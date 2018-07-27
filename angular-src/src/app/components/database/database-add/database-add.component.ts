import { EntryASIN } from './../../../classesAndInterfaces/entryASIN';

import { DatabaseService } from '../../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from '../../../classesAndInterfaces/product';
import { MatSnackBar } from '@angular/material';

let entriesASIN: EntryASIN[] = [
  {ASIN: null, packAmt: null, preparation: null}
];

let listOfCheckedIndexes:number[] = [];

@Component({
  selector: 'database-add',
  templateUrl: './database-add.component.html',
  styleUrls: ['./database-add.component.css']
})
export class DatabaseAddComponent implements OnInit {
  displayedColumns: string[] = ['select', 'ASIN', 'packAmt', 'preparation'];
  dataSource = new MatTableDataSource<EntryASIN>(entriesASIN);
  selection = new SelectionModel<EntryASIN>(true, []);

  constructor(private databaseService: DatabaseService
      , private router: Router
      , public snackBar: MatSnackBar)
  { }

  ngOnInit() {
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    listOfCheckedIndexes = [];
    if(this.isAllSelected())
      this.selection.clear();

    else{
      this.dataSource.data.forEach(row => this.selection.select(row));
      listOfCheckedIndexes = new Array(entriesASIN.length);
      for(let i=0; i<entriesASIN.length; ++i)
        listOfCheckedIndexes[i] = i;
    }
  }

  addBlankEntry(): void{
    entriesASIN.push( {ASIN:null, packAmt:null, preparation: null} as EntryASIN );
    this.dataSource = new MatTableDataSource<EntryASIN>(entriesASIN);
  }

  addBlankEntryIfDeleteAll(): void{
    if(entriesASIN.length < 0 ){
      this.addBlankEntry();
    }
  }

  isFilledLastEntry(): boolean{
    let lastEntryIndex = entriesASIN.length-1;
    let lastASIN:string = entriesASIN[lastEntryIndex].ASIN;
    let lastPackAmt:number = entriesASIN[lastEntryIndex].packAmt;
    let lastPreparation:string = entriesASIN[lastEntryIndex].preparation;
    let isLastASINFilled:boolean = !(lastASIN == null);
    let isLastPackAmtFilled:boolean = !(lastPackAmt == null);
    let isLastPreparationFilled:boolean = !(lastPreparation == null);
    return isLastASINFilled || isLastPackAmtFilled || isLastPreparationFilled;
  }

  addBlankEntryIfNeeded(): void{
    if(entriesASIN.length == 0 || this.isFilledLastEntry())
      this.addBlankEntry();
  }

  deleteEntries(amtToDelete:number): void{
    listOfCheckedIndexes.sort();
    for(let i=amtToDelete-1; i>=0; --i)
      entriesASIN.splice(listOfCheckedIndexes[i], 1);
  }

  deleteCheckedEntries(): void{
    let amtToDelete:number = listOfCheckedIndexes.length;
    if(amtToDelete >= entriesASIN.length)
      entriesASIN = [];
      
    else{
      this.deleteEntries(amtToDelete);
      this.addBlankEntryIfNeeded();
    }
    this.addBlankEntryIfNeeded();
    this.dataSource = new MatTableDataSource<EntryASIN>(entriesASIN);
    this.resetCheckedSelection();
  }

  updateCheckedList(index, isChecked): void{
    if(isChecked)
      listOfCheckedIndexes.push(index);
    else
      entriesASIN.splice(listOfCheckedIndexes[index], 1);
  }

  isEmptyStringField(value){
    if(value == null) return true;
      return value.trim() == "";
  }

  isEmptyEntry(entry){
    return this.isEmptyStringField(entry.ASIN)
      && entry.packAmt == null && this.isEmptyStringField(entry.preparation);
  }

  isCompleteEntry(entry){
    return !this.isEmptyStringField(entry.ASIN)
      && entry.packAmt != null && !this.isEmptyStringField(entry.preparation);
  }

  //Gets all the entries. Returns null if half complete entry exist
  getEntriesASIN(entriesASIN){
    let validEntriesASIN = [];
    for(let entry of entriesASIN){
      if(this.isEmptyEntry(entry))
        continue;
      if( this.isCompleteEntry(entry) )
        validEntriesASIN.push(entry);
      else
        return null;
    };
    return validEntriesASIN;
  }

  resetCheckedSelection(){
    listOfCheckedIndexes = [];
    this.selection.clear();
  }

  resetEntriesASIN(){
    entriesASIN = [];
    this.addBlankEntryIfNeeded();
    this.dataSource = new MatTableDataSource<EntryASIN>(entriesASIN);
    this.resetCheckedSelection();
  }

  openSnackbar(msg){
    this.snackBar.open(msg, null, {
      duration: 4000
    });
  }

  successResponse(form){
    this.resetEntriesASIN();
    this.openSnackbar('Successfully added product');
    form.resetForm();
  }

  addProduct(form, processedEntriesASIN){
    let formValues = form.form.value;
    let product = new Product(formValues.brand, formValues.name, formValues.costPerBox
    , formValues.quantityPerBox, formValues.purchasedLocation, formValues.stockNo
    , formValues.UPC, processedEntriesASIN);

    this.databaseService.addProduct(product).subscribe(data => {
      if(data['success'])
        this.successResponse(form);
      else
        this.openSnackbar(`Failed to add product: ${data['msg']}`);
    });
  }
  
  onSubmit(form){
    let processedEntriesASIN = this.getEntriesASIN(entriesASIN);
    if(processedEntriesASIN == null)
      this.openSnackbar('Failed to add product: Partially filled ASIN entry exists. Complete or remove the entry.');
    else
      this.addProduct(form, processedEntriesASIN);
  }
}
