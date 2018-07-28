import { EntryASIN } from '../../../classesAndInterfaces/entryASIN';

import { DatabaseService } from '../../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from '../../../classesAndInterfaces/product';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'database-add-or-update',
  templateUrl: './database-add-or-update.component.html',
  styleUrls: ['./database-add-or-update.component.css']
})
export class DatabaseAddOrUpdateComponent implements OnInit {
  // updating dataSource.data will update entriesASIN
  entriesASIN: EntryASIN[] = [{ASIN: null, packAmt: null, preparation: null}];
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

  isFilledLastEntry(): boolean{
    let data = this.dataSource.data;

    let lastEntryIndex = data.length-1;
    let isLastASINFilled = !(data[lastEntryIndex].ASIN == null);
    let isLastPackAmtFilled = !(data[lastEntryIndex].packAmt == null);
    let isLastPreparationFilled = !(data[lastEntryIndex].preparation == null);
    return isLastASINFilled || isLastPackAmtFilled || isLastPreparationFilled;
  }

  addBlankEntryIfNeeded(): void{
    if(this.dataSource.data.length <= 0 || this.isFilledLastEntry()){
      this.dataSource.data.push({ASIN:null, packAmt:null, preparation: null});
      this.dataSource = new MatTableDataSource<EntryASIN>(this.dataSource.data);
    }  
  }

  removeSelectedRows(){
    this.selection.selected.forEach(item => {
      let index: number = this.dataSource.data.findIndex(d => d === item);
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
  getEntriesASIN(){
    let validEntriesASIN = [];
    for(let entry of this.dataSource.data){
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

    //Clear form completely
    this.dataSource.data = [{ASIN: null, packAmt: null, preparation: null}];
    this.dataSource = new MatTableDataSource<EntryASIN>(this.dataSource.data);
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
    let processedEntriesASIN = this.getEntriesASIN();
    if(processedEntriesASIN == null)
      openSnackbar(this.snackBar, 'Failed to add product: Partially filled ASIN entry exists. Complete or remove the entry.');
    else
      this.addProduct(form, processedEntriesASIN);
  }
}