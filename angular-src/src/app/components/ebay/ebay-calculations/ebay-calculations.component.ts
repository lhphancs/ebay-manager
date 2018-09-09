import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../classesAndInterfaces/Product';
import { MatTableDataSource, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EbayComponent } from '../ebay.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { DatabaseShippingsService } from '../../../services/database-shippings.service';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'ebay-calculations',
  templateUrl: './ebay-calculations.component.html',
  styleUrls: ['./ebay-calculations.component.css']
})
export class EbayCalculationsComponent implements OnInit {
  loadingMsg = "Loading products..."

  userId;
  ebayPercentageFromSaleFee:number;
  paypalPercentageFromSaleFee:number;
  paypalFlatFee:number;

  desiredProfitPerSingle = 1;
  dictShipIdToName = {};
  dictShipIdAndOzToCost = {};
  filterValue: string;
  products: Product[];
  displayedColumns: string[] = ['brand', 'name', 'stockNo', 'costPerSingle', 'ASINS', 'UPC', 'wholesaleComp', 'packsInfo'];
  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);

  constructor(
    private ebayComponent:EbayComponent
    , private databaseProductsService: DatabaseProductsService
    , private databaseShippingsService: DatabaseShippingsService
    , public snackBar: MatSnackBar, private dialog: MatDialog){
  }

  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit() {
    this.userId = this.ebayComponent.userId;
    this.ebayPercentageFromSaleFee = this.ebayComponent.ebayPercentageFromSaleFee;
    this.paypalPercentageFromSaleFee = this.ebayComponent.paypalPercentageFromSaleFee;
    this.paypalFlatFee = this.ebayComponent.paypalFlatFee;

    this.databaseShippingsService.getShipMethods(this.userId).subscribe((data)=>{
      this.initializeShippingMethods(data['shipMethods']);
      this.databaseProductsService.getProducts(this.userId).subscribe( (data) => {
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

  initializeShippingMethods(methods){
    for(let method of methods){
      this.dictShipIdToName[method._id]= method.shipCompanyName + " - " + method.shipMethodName;
      if(method.flatRatePrice)
        this.dictShipIdAndOzToCost[method._id] = method.flatRatePrice;
      else{
        for(let obj of method.ozPrice)
          this.dictShipIdAndOzToCost[method._id + obj.oz] = obj.price;
      }
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

  calculateNeededSale(packAmt, shipId, oz, costPerSingle){
    let roundedUpOz = oz ? Math.ceil(oz): "";
    let totalProfit = this.desiredProfitPerSingle * packAmt;
    let totalProductCost = costPerSingle * packAmt;
    let key = shipId + roundedUpOz;
    let shipCost = this.dictShipIdAndOzToCost[key];
    
    let err = this.getErrMsg(totalProfit, totalProductCost, shipCost);
    if(err)
      return err;

    return Math.round((totalProfit+this.paypalFlatFee
      + totalProductCost + shipCost)
      / (1-this.paypalPercentageFromSaleFee*0.01 - this.ebayPercentageFromSaleFee*0.01)*100)/100;
  }
}

