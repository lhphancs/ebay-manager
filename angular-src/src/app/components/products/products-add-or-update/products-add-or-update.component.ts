import { TableDynamicInputComponent } from '../../table-dynamic-input/table-dynamic-input.component';
import { ProductsComponent } from '../products.component';
import { ViewChild, ElementRef } from '@angular/core';
//Add and update page do almost the same thing, so just clump code together

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../classesAndInterfaces/product';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { getProcessedEntries } from '../../table-methods'
import { getHeaderNames } from '../../table-methods'

@Component({
  selector: 'products-add-or-update',
  templateUrl: './products-add-or-update.component.html',
  styleUrls: ['./products-add-or-update.component.css']
})

export class ProductsAddOrUpdateComponent implements OnInit {
  @ViewChild(TableDynamicInputComponent) viewTable;

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

  entries:object[];
  headers: object[] = [
    {name:'ASIN', type:"string"}
    , {name:'packAmt', type:"number", min:1, step:"1"}
    , {name:'preparation', type:"string"}
  ];
  headerNames:string[];


  oldProductUPC: string;

  constructor(private productsComponent:ProductsComponent,
      private databaseProductsService: DatabaseProductsService
      , private activatedRoute: ActivatedRoute
      , public snackBar: MatSnackBar
      , private router: Router)
      
  { }

  ngOnInit() {
    this.headerNames = getHeaderNames(this.headers);
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

  getNewProductObject(processedEntries){
    return new Product(this.inputBrand, this.inputName, this.inputUPC
      , this.inputCostPerBox, this.inputQuantityPerBox
        , this.inputPurchasedLocation, this.inputStockNo, this.inputOz
        , processedEntries);
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

  addSuccessResponse(form){
    //Clear form completely
    form.resetForm();
    this.entries=[];
    this.viewTable.resetTable(this.entries);

    openSnackbar(this.snackBar, 'Successfully added product');
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
    let processedEntries = getProcessedEntries(this.entries);
    if(processedEntries == null)
      openSnackbar(this.snackBar, 'Failed to add product: Partially filled ASIN entry exists. Complete or remove the entry.');
    else{
      let newProduct = this.getNewProductObject(processedEntries);
      if(this.oldProductUPC)
        this.updateProduct(this.oldProductUPC, newProduct)
      else
        this.addProduct(newProduct, form);
    }
  }
}