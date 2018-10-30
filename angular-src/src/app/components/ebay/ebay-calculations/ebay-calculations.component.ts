import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../../../classesAndInterfaces/Product';
import { MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EbayComponent } from '../ebay.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { openSnackbar } from '../../snackbar';
import { DatabaseUsersService } from '../../../services/database-users.service';

@Component({
  selector: 'ebay-calculations',
  templateUrl: './ebay-calculations.component.html',
  styleUrls: ['./ebay-calculations.component.css']
})
export class EbayCalculationsComponent implements OnInit {
  percentages:number[];
  flatFees:number[];
  
  products: Product[];
  dataSource: MatTableDataSource<Product>;

  constructor(
    private ebayComponent:EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , private databaseProductsService: DatabaseProductsService
    , public snackBar: MatSnackBar){
  }

  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
  
    }
  }
  
  ngOnInit() {
    this.databaseUsersService.getEbayFees(this.ebayComponent.userId).subscribe( (data) =>{
      this.percentages = [ data['ebayFees'].ebayPercentageFromSaleFee, data['ebayFees'].paypalPercentageFromSaleFee ];
      this.flatFees = [ data['ebayFees'].paypalFlatFee ];
      this.initializeProducts();
    });
  }

  initializeProducts(){
    this.databaseProductsService.getProducts(this.ebayComponent.userId).subscribe( (data) => {
      if(data['success']){
        this.products = data['products'];
        this.addCostPerSingleToProducts(this.products);
        this.addAsinsToProducts(this.products);
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.sort = this.sort;
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
  }


  addCostPerSingleToProducts(products){
    for(let product of products){
      product.costPerSingle = product.costPerBox/product.quantityPerBox;
    }
  }

  addAsinsToProducts(products){
    for(let product of products){
      let strASINS = "";
      for(let packInfo of product.packsInfo)
        strASINS += packInfo.ASIN + '   |   ';
      product.ASINS = strASINS;
    }
  }
}