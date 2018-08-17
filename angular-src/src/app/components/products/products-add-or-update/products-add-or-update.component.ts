import { ProductsComponent } from '../products.component';
import { ViewChild, ElementRef } from '@angular/core';
//Add and update page do almost the same thing, so just clump code together

import { EntryASIN } from '../../../classesAndInterfaces/entryASIN';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../classesAndInterfaces/product';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { getNullValuesObj } from '../../table-methods'

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

  entries;
  headers: object[] = [
    {name:'select'}
    , {name:'ASIN', type:"string"}
    , {name:'packAmt', type:"number", min:1, step:"1"}
    , {name:'preparation', type:"string"}
  ];
  headerNames;


  oldProductUPC: string;

  constructor(private productsComponent:ProductsComponent,
      private databaseProductsService: DatabaseProductsService
      , private activatedRoute: ActivatedRoute
      , public snackBar: MatSnackBar
      , private router: Router)
      
  { }

  ngOnInit() {
    this.setHeaderNames();
    this.userId = this.productsComponent.userId;
    this.activatedRoute.paramMap.subscribe(params => {
      this.oldProductUPC = params.get('UPC');
      if(this.oldProductUPC)
        this.prepareProductUpdate();
      else{
        this.entries = [];
        this.displayRdy = true;
      }
    });
  }

  setHeaderNames(){
    this.headerNames = [];
    this.headers.forEach(element => {
      this.headerNames.push(element['name']);
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
  }
  
  prepareProductUpdate(){
    this.databaseProductsService.getProductByUPC(this.userId
        , this.oldProductUPC).subscribe((data) =>{
      if(data['success']){
        if(data['product']){
          let product = data['product'];
          this.entries = product.ASINS;
          this.fillInForm(product);
        }
        else
          openSnackbar(this.snackBar, "Error: UPC not found in database");
      }
      else
        openSnackbar(this.snackBar, data['msg']);
      this.displayRdy = true;
    });
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
    console.log(this.entries)
    let validEntriesASIN = [];
    for(let entry of this.entries){
      if(this.isEmptyEntry(entry))
        continue;
      if( this.isCompleteEntry(entry) )
        validEntriesASIN.push(entry);
      else
        return null;
    };
    return validEntriesASIN;
   return null;
  }

  addSuccessResponse(form){
    //Clear form completely
    this.entries = getNullValuesObj(this.headerNames);
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
        this.addSuccessResponse(form);
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