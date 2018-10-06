import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../classesAndInterfaces/Product';
import { MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EbayComponent } from '../ebay.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { DatabaseShippingsService } from '../../../services/database-shippings.service';
import { openSnackbar } from '../../snackbar';
import { DatabaseUsersService } from '../../../services/database-users.service';

@Component({
  selector: 'ebay-calculations',
  templateUrl: './ebay-calculations.component.html',
  styleUrls: ['./ebay-calculations.component.css']
})
export class EbayCalculationsComponent implements OnInit {
  loadingMsg = "Loading products..."
  ebayPercentageFromSaleFee;
  paypalFlatFee;
  paypalPercentageFromSaleFee;

  desiredProfitPerSingle = 1;
  
  products: Product[];
  displayedColumns: string[] = ['name', 'stockNo', 'costPerSingle', 'ASINS', 'UPC', 'wholesaleComp', 'packsInfo'];
  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);

  constructor(
    private ebayComponent:EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , private databaseProductsService: DatabaseProductsService
    , public snackBar: MatSnackBar){
  }

  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit() {
    this.databaseUsersService.getEbayFees(this.ebayComponent.userId).subscribe( (data) =>{
      this.ebayPercentageFromSaleFee = data['ebayFees'].ebayPercentageFromSaleFee;
      this.paypalFlatFee = data['ebayFees'].paypalFlatFee;
      this.paypalPercentageFromSaleFee = data['ebayFees'].paypalPercentageFromSaleFee;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getErrMsg(totalProfit, totalProductCost, shipCost){
    let BASE_ERR_MSG = "Err: ";
    let errMsg = BASE_ERR_MSG;
    if(!totalProfit) errMsg += "desiredProfit ";
    if(!totalProductCost) errMsg += "totalProductCost ";
    if(!shipCost) errMsg += "shipId/oz";
    return errMsg == BASE_ERR_MSG ? null : errMsg;
  }

  calculateDesiredPrice(packAmt, shipId, oz, costPerSingle){
    let roundedUpOz = oz ? Math.ceil(oz): "";
    let totalProfit = this.desiredProfitPerSingle * packAmt;
    let totalProductCost = costPerSingle * packAmt;
    let key = shipId in this.ebayComponent.dictShipIdAndOzToCost ? shipId: shipId + roundedUpOz;
    let shipCost = this.ebayComponent.dictShipIdAndOzToCost[key];
    
    let err = this.getErrMsg(totalProfit, totalProductCost, shipCost);
    if(err)
      return err;

    return Math.round((totalProfit+this.paypalFlatFee
      + totalProductCost + shipCost)
      / (1-this.paypalPercentageFromSaleFee*0.01 - this.ebayPercentageFromSaleFee*0.01)*100)/100;
  }
}

