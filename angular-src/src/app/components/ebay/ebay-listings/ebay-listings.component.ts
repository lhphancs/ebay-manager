import { Component, OnInit, ViewChild } from '@angular/core';
import { Listing } from '../../../classesAndInterfaces/Listing'
import { EbayService } from '../../../services/ebay.service';
import { EbayComponent } from '../ebay.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { DatabaseShippingsService } from '../../../services/database-shippings.service';
import { MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Variation } from '../../../classesAndInterfaces/Variation';

@Component({
  selector: 'ebay-listings',
  templateUrl: './ebay-listings.component.html',
  styleUrls: ['./ebay-listings.component.css']
})
export class EbayListingsComponent implements OnInit {
  loadingMsg = "Loading listings..."
  desiredProfitPerSingle = 1;

  listings: Listing[];
  displayedColumns: string[] = ['imgUrl', 'listTitle', 'UPC', 'costPerSingle', 'wholesaleComp', 'stockNo', 'variations'];
  dataSource: MatTableDataSource<Listing>;
  selection = new SelectionModel<Listing>(true, []);

  constructor(private ebayComponent:EbayComponent
    , private databaseProductsService: DatabaseProductsService
    , private ebayService: EbayService
    , public snackBar: MatSnackBar) {
      this.listings = [];
    }

  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit() {
    let listingDict = {};

/*
    let upcs = this.getUpcsFromListingDict(listingDict);

    this.databaseProductsService.getManyProductsByUpcs(this.ebayComponent.userId
      , upcs).subscribe((data) =>{
        if(data['success'])
          this.addProductInfoToListingDict(listingDict, data['products']);
    });
    
    this.addListingsFromDict(listingDict);
    this.dataSource = new MatTableDataSource<Listing>(this.listings);
    this.dataSource.sort = this.sort;
  */  
    this.ebayService.getListings(this.ebayComponent.userId).subscribe( (data) => {
      console.log("zzz")
      console.log(data)
      console.log("zzz")
    });

  }

  addListingsFromDict(listingDict){
    for(let key in listingDict)
      this.listings.push(listingDict[key]);
  }

  getUpcsFromListingDict(listingDict){
    let upcs = [];
    for(let key in listingDict)
      upcs.push(listingDict[key].UPC);
    return upcs;
  }

  addVariationsToListing(upc, listing, packsInfo){
    for(let packInfo of packsInfo){
      delete packInfo._id;
    }
    listing.packsInfo = packsInfo;
  }

  addProductInfoToListingDict(listingDict, products){
    for(let product of products){
      let upc = product.UPC;
      let listing = listingDict[upc];
      listing.wholesaleComp = product.wholesaleComp;
      listing.stockNo = product.stockNo;
      listing.costPerSingle = product.costPerBox/product.quantityPerBox;
      this.addVariationsToListing(upc, listing, product.packsInfo)
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

    let key = shipId in this.ebayComponent.dictShipIdAndOzToCost ? shipId: shipId + roundedUpOz;
    let shipCost = this.ebayComponent.dictShipIdAndOzToCost[key];
    
    let err = this.getErrMsg(totalProfit, totalProductCost, shipCost);
    if(err)
      return err;

    return Math.round((totalProfit+this.ebayComponent.paypalFlatFee
      + totalProductCost + shipCost)
      / (1-this.ebayComponent.paypalPercentageFromSaleFee*0.01 - this.ebayComponent.ebayPercentageFromSaleFee*0.01)*100)/100;
  }
}