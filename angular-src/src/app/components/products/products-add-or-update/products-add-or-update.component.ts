import { ProductsComponent } from '../products.component';
import { ViewChild, ElementRef } from '@angular/core';
//Add and update page do almost the same thing, so just clump code together

import { EntryASIN } from '../../../classesAndInterfaces/entryASIN';

import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../classesAndInterfaces/product';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';
import { DatabaseProductsService } from '../../../services/database-products.service';

@Component({
  selector: 'products-add-or-update',
  templateUrl: './products-add-or-update.component.html',
  styleUrls: ['./products-add-or-update.component.css']
})

export class ProductsAddOrUpdateComponent implements OnInit {
  //used for update page
  userId;
  displayRdy = false;

  inputBrand;
  inputName;
  inputUPC;
  inputPurchasedLocation;
  inputStockNo;
  inputOz;
  inputCostPerBox;
  inputQuantityPerBox;

  // updating dataSource.data will update entriesASIN
  entriesASIN: EntryASIN[] = [{ASIN: null, packAmt: null, preparation: null}];
  displayedColumns: string[] = ['select', 'ASIN', 'packAmt', 'preparation'];
  dataSource = new MatTableDataSource<EntryASIN>(this.entriesASIN);
  selection = new SelectionModel<EntryASIN>(true, []);
  oldProductUPC: string;

  constructor(private productsComponent:ProductsComponent,
      private databaseProductsService: DatabaseProductsService
      , private route: ActivatedRoute
      , public snackBar: MatSnackBar
      , private router: Router)
      
  { }

  ngOnInit() {
    this.userId = this.productsComponent.userId;
    this.route.paramMap.subscribe(params => {
      this.oldProductUPC = params.get('UPC');
      if(this.oldProductUPC)
        this.prepareProductUpdate();
      else
        this.displayRdy = true;
    });
  }

  fillInForm(product){
    this.inputBrand = product.brand;
    this.inputName = product.name;
    this.inputUPC = product.UPC;
    this.inputPurchasedLocation = product.purchasedLocation;
    this.inputStockNo = product.stockNo;
    this.inputOz = product.oz;
    this.inputCostPerBox = product.costPerBox;
    this.inputQuantityPerBox = product.quantityPerBox;

    this.dataSource.data = product.ASINS;
    this.dataSource.data.push({ASIN:null, packAmt:null, preparation: null});
    this.dataSource = new MatTableDataSource<EntryASIN>(this.dataSource.data);
  }
  
  prepareProductUpdate(){
    this.databaseProductsService.getProductByUPC(this.userId
        , this.oldProductUPC).subscribe((data) =>{
      if(data['success']){
        if(data['product'])
          this.fillInForm(data['product']);
        else
          openSnackbar(this.snackBar, "Error: UPC not found in database");
      }
      else
        openSnackbar(this.snackBar, data['msg']);
      this.displayRdy = true;
    });
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
    //Clear form completely
    this.dataSource.data = [{ASIN: null, packAmt: null, preparation: null}];
    this.dataSource = new MatTableDataSource<EntryASIN>(this.dataSource.data);
    form.resetForm();

    openSnackbar(this.snackBar, 'Successfully added product');
  }

  getNewProductObject(processedEntriesASIN){
    return new Product(this.inputBrand, this.inputName, this.inputUPC
      , this.inputCostPerBox, this.inputQuantityPerBox
        , this.inputPurchasedLocation, this.inputStockNo, this.inputOz
        , processedEntriesASIN);
  }

  addProduct(product, form){
    this.databaseProductsService.addProduct(this.userId
      , product).subscribe(data => {
      if(data['success'])
        this.successResponse(form);
      else
        openSnackbar(this.snackBar, `Failed to add product: ${data['msg']}`);
    });
  }

  updateProduct(oldProductUPC, newProduct){
    this.databaseProductsService.updateProduct(this.userId, oldProductUPC, newProduct).subscribe(data => {
      if(data['success'])
        openSnackbar(this.snackBar, `Update successful: ${data['msg']}`);
      else
        openSnackbar(this.snackBar, `Failed to add product: ${data['msg']}`);
    });
    this.router.navigateByUrl('/products/display');
  }
  
  onSubmit(form){
    let processedEntriesASIN = this.getEntriesASIN();
    if(processedEntriesASIN == null)
      openSnackbar(this.snackBar, 'Failed to add product: Partially filled ASIN entry exists. Complete or remove the entry.');
    else{
      let newProduct = this.getNewProductObject(processedEntriesASIN);
      if(this.oldProductUPC)
        this.updateProduct(this.oldProductUPC, newProduct)
      else
        this.addProduct(newProduct, form);
    }
  }
}