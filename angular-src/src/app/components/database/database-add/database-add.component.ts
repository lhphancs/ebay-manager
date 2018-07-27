import { EntryASIN } from './../../../classesAndInterfaces/entryASIN';

import { DatabaseService } from '../../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from '../../../classesAndInterfaces/product';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'database-add',
  templateUrl: './database-add.component.html',
  styleUrls: ['./database-add.component.css']
})
export class DatabaseAddComponent implements OnInit {
  entriesASIN: EntryASIN[] = [
    {ASIN: null, packAmt: null, preparation: null}
  ];
  displayedColumns: string[] = ['select', 'ASIN', 'packAmt', 'preparation'];
  dataSource = new MatTableDataSource<EntryASIN>(this.entriesASIN);
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
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  addBlankEntry(): void{
    this.entriesASIN.push( {ASIN:null, packAmt:null, preparation: null} as EntryASIN );
    this.dataSource = new MatTableDataSource<EntryASIN>(this.entriesASIN);
  }
  
  isFilledLastEntry(): boolean{
    let lastEntryIndex = this.entriesASIN.length-1;
    let lastASIN:string = this.entriesASIN[lastEntryIndex].ASIN;
    let lastPackAmt:number = this.entriesASIN[lastEntryIndex].packAmt;
    let lastPreparation:string = this.entriesASIN[lastEntryIndex].preparation;
    let isLastASINFilled:boolean = !(lastASIN == null);
    let isLastPackAmtFilled:boolean = !(lastPackAmt == null);
    let isLastPreparationFilled:boolean = !(lastPreparation == null);
    return isLastASINFilled || isLastPackAmtFilled || isLastPreparationFilled;
  }

  addBlankEntryIfNeeded(): void{
    if(this.entriesASIN.length <= 0 || this.isFilledLastEntry())
      this.addBlankEntry();
  }

  removeSelectedRows(){
    this.selection.selected.forEach(item => {
      let index: number = this.entriesASIN.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource<EntryASIN>(this.dataSource.data);
    });
    this.addBlankEntryIfNeeded();
    this.selection = new SelectionModel<EntryASIN>(true, []);
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

  successResponse(form){
    openSnackbar(this.snackBar, 'Successfully added product');
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
        openSnackbar(this.snackBar, `Failed to add product: ${data['msg']}`);
    });
  }
  
  onSubmit(form){
    let processedEntriesASIN = this.getEntriesASIN(this.entriesASIN);
    if(processedEntriesASIN == null)
      openSnackbar(this.snackBar, 'Failed to add product: Partially filled ASIN entry exists. Complete or remove the entry.');
    else
      this.addProduct(form, processedEntriesASIN);
  }
}