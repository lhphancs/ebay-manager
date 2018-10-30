import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from 'src/app/classesAndInterfaces/Product';
import { MatTableDataSource, MatSnackBar, MatSort } from '@angular/material';
import { ShopifyComponent } from '../shopify.component';
import { DatabaseUsersService } from 'src/app/services/database-users.service';
import { DatabaseProductsService } from 'src/app/services/database-products.service';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'app-shopify-calculations',
  templateUrl: './shopify-calculations.component.html',
  styleUrls: ['./shopify-calculations.component.css']
})
export class ShopifyCalculationsComponent implements OnInit {
  percentages:number[];
  flatFees:number[];
  
  products: Product[];
  dataSource: MatTableDataSource<Product>;
  
  constructor(private shopifyComponent:ShopifyComponent
    , private databaseUsersService: DatabaseUsersService
    , private databaseProductsService: DatabaseProductsService
    , public snackBar: MatSnackBar) { }

  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
  
    }
  }

  ngOnInit() {
    this.databaseUsersService.getShopifyFees(this.shopifyComponent.userId).subscribe( (data) =>{
      this.percentages = [ data['shopifyFees'].shopifyPercentageFromSaleFee, data['shopifyFees'].websitePercentageDiscount ];
      this.flatFees = [ data['shopifyFees'].shopifyFlatFee ];
      this.initializeProducts();
    });
  }

  initializeProducts(){
    this.databaseProductsService.getProducts(this.shopifyComponent.userId).subscribe( (data) => {
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
