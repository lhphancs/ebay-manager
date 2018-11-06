import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Listing } from '../../../classesAndInterfaces/Listing'
import { EbayService } from '../../../services/ebay.service';
import { EbayComponent } from '../ebay.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { calculateTotalFee } from '../../profitCalculations';
import { calculateProfit } from '../../profitCalculations';
import { calculateDesiredSaleValue } from '../../profitCalculations';

var ProfitStatus = {
  outOfStock: 0,
  incalculable: 1,
  tooMuchProfit: 2,
  desiredPriceRange: 3,
  onlyAboveProfitPerSingle: 4,
  belowProfitPerSingle: 5
};

@Component({
  selector: 'ebay-listings',
  templateUrl: './ebay-listings.component.html',
  styleUrls: ['./ebay-listings.component.css']
})
export class EbayListingsComponent implements OnInit {
  chkOutOfStock = true;
  chkIncalculable = true;
  chkTooMuchProfit = true;
  chkDesiredPriceRange = true;
  chkOnlyAboveProfitPerSingle = true;
  chkBelowProfitPerSingle = true;

  isLoading = true;
  errMsg;
  loadingMsg = "Loading settings..."
  
  ebayPercentageFromSaleFee;
  paypalFlatFee;
  paypalPercentageFromSaleFee;
  desiredProfitPerSingle = 1;

  listings: Listing[];
  displayedColumns: string[] = ['imgUrl', 'listTitle', 'UPC', 'costPerSingle', 'wholesaleComp', 'stockNo', 'variations'];
  dataSource: MatTableDataSource<Listing>;
  selection = new SelectionModel<Listing>(true, []);

  constructor(private ebayComponent:EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , private databaseProductsService: DatabaseProductsService
    , private ebayService: EbayService
    , public snackBar: MatSnackBar) {
      this.listings = [];
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
      this.ebayPercentageFromSaleFee = data['ebayFees'].ebayPercentageFromSaleFee;
      this.paypalFlatFee = data['ebayFees'].paypalFlatFee;
      this.paypalPercentageFromSaleFee = data['ebayFees'].paypalPercentageFromSaleFee;
      this.initializeListings();
    });
  }

  initializeListings(){
    this.loadingMsg = 'Loading listings...'
    let listingDict;

    this.ebayService.getListings(this.ebayComponent.userId).subscribe( (data) => {
      if(data['success']){
        listingDict = data['listingDict'];
        let upcs = Object.keys(listingDict);

        this.databaseProductsService.getManyProductsByUpcs(this.ebayComponent.userId
          , upcs).subscribe((data) =>{
            if(data['success']){
              this.addProductInfoToListingDict(listingDict, data['products']);
              this.addListingsFromDict(listingDict);
              this.dataSource = new MatTableDataSource<Listing>(this.listings);
              this.dataSource.sort = this.sort;
            }
            else
              this.errMsg = data['msg'];
            this.isLoading = false;
        });
      }
      else{
        this.errMsg = data['msg'];
        this.isLoading = false;
      }
    });
  }
  addProfitToListing(listing){
    let costPerSingle = listing.costPerSingle;
    let variations = listing.variation;
      for(let key in variations){
          let variation = variations[key];
          variation.ebaySellPrice = Number(variation.ebaySellPrice);
          let ebaySellPrice = variation.ebaySellPrice;
          
          let shipCost = this.getShipCost(variation.shipMethodId, variation.ozWeight);
          
          if(!listing.isFreeShipping)
            ebaySellPrice += shipCost; //If buyer pays for shipping, then the salePrice goes up by shipCost
            
          let totalEbayFee = calculateTotalFee(ebaySellPrice, [this.ebayPercentageFromSaleFee], []);
          let totalPaypalFee = calculateTotalFee(ebaySellPrice, [this.paypalPercentageFromSaleFee], [this.paypalFlatFee]);
          
          variation.profit = calculateProfit(ebaySellPrice, variation.packAmt, costPerSingle, shipCost
            , [totalEbayFee, totalPaypalFee], 0);
    }
  }

  addListingsFromDict(listingDict){
    for(let key in listingDict){
      let listing = listingDict[key];

      listing.variation = Object.values(listing.variation);
      this.addProfitToListing(listing);
      this.updateListingProfitStatus(listing);
      this.listings.push(listingDict[key]);
    }
  }

  handleVariationProfitStatus(variation, desiredPrice, listingProfitStatus){
    const tooMuchProfitAmt = 0.50;
    
    if(variation['ebaySellPrice'] >= desiredPrice + tooMuchProfitAmt)
      variation.profitStatus = ProfitStatus.tooMuchProfit;
    else if(variation['ebaySellPrice'] >= desiredPrice)
      variation.profitStatus = ProfitStatus.desiredPriceRange;
    else if( variation.profit < this.desiredProfitPerSingle)
      variation.profitStatus = ProfitStatus.belowProfitPerSingle;
    else
      variation.profitStatus = ProfitStatus.onlyAboveProfitPerSingle;
    
    //Now return updated row's profitStatus
    let vProfitStatus = variation.profitStatus;
    switch(listingProfitStatus){
      case ProfitStatus.outOfStock:             return ProfitStatus.outOfStock;
      case ProfitStatus.incalculable:           return ProfitStatus.incalculable;
      case ProfitStatus.belowProfitPerSingle:   return ProfitStatus.belowProfitPerSingle;
      case ProfitStatus.desiredPriceRange:      return vProfitStatus;

      case ProfitStatus.tooMuchProfit:
        return vProfitStatus == ProfitStatus.belowProfitPerSingle 
          ? ProfitStatus.belowProfitPerSingle : ProfitStatus.tooMuchProfit;
      
      case ProfitStatus.onlyAboveProfitPerSingle:
        return vProfitStatus == ProfitStatus.belowProfitPerSingle ? ProfitStatus.belowProfitPerSingle
          : vProfitStatus == ProfitStatus.tooMuchProfit ? ProfitStatus.tooMuchProfit
          : ProfitStatus.onlyAboveProfitPerSingle
    }
  }
  
  getShipCost(shipId, oz){
    let key = shipId in this.ebayComponent.dictShipIdAndOzToCost ? shipId: shipId + oz;
    return this.ebayComponent.dictShipIdAndOzToCost[key];
  }

  updateListingProfitStatus(listing){
    let listingProfitStatus = ProfitStatus.desiredPriceRange;

    let variations = listing.variation;
    for(let key in variations){
      let variation = variations[key];
      let desiredPrice = variation.desiredPrice;
      if(variation['ebayQuantityLeft'] == 0){
        listingProfitStatus = ProfitStatus.outOfStock;
        variation.profitStatus = ProfitStatus.outOfStock;
      }
      else if( typeof(desiredPrice) != 'number' ){
        listingProfitStatus = ProfitStatus.incalculable;
        variation.profitStatus = ProfitStatus.incalculable;
      }
      else
        listingProfitStatus = this.handleVariationProfitStatus(variation, desiredPrice, listingProfitStatus);
    }
    listing.profitStatus = listingProfitStatus;  
  }

  addVariationsToListing(listing, packsInfo){
    for(let packInfo of packsInfo){
      let packAmt = packInfo.packAmt;
      if(packAmt in listing.variation){
        let variationToEdit = listing.variation[packAmt];
        variationToEdit.ozWeight = Math.ceil(packInfo.ozWeight);
        variationToEdit.shipMethodId = packInfo.shipMethodId;
        variationToEdit.packaging = packInfo.packaging;
        variationToEdit.preparation = packInfo.preparation;

        let shipId = packInfo.shipMethodId;
        let shipCost = this.getShipCost(shipId, variationToEdit.ozWeight);
        
        let isFreeShipping = listing.isFreeShipping;
        variationToEdit.desiredPrice = calculateDesiredSaleValue(this.desiredProfitPerSingle
          , packAmt, listing.costPerSingle, shipCost
          , [this.ebayPercentageFromSaleFee, this.paypalPercentageFromSaleFee]
          , [this.paypalFlatFee], 0, isFreeShipping)
      }
    }
  }

  addProductInfoToListingDict(listingDict, products){
    for(let product of products){
      let upc = product.UPC;
      let listing = listingDict[upc];
      listing.wholesaleComp = product.wholesaleComp;
      listing.stockNo = product.stockNo;
      listing.costPerSingle = product.costPerBox/product.quantityPerBox;
      this.addVariationsToListing(listing, product.packsInfo)
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

  onDesiredProfitChange(){
    for(let listing of this.listings){
      for(let variation of listing['variation']){
        let packAmt = variation['packAmt'];
        let shipId = variation['shipMethodId'];
        let shipCost = this.getShipCost(shipId, variation.ozWeight);
        variation['desiredPrice'] = calculateDesiredSaleValue(this.desiredProfitPerSingle
          , packAmt, listing.costPerSingle, shipCost
          , [this.ebayPercentageFromSaleFee, this.paypalPercentageFromSaleFee]
          , [this.paypalFlatFee], 0, true)
      }
      this.updateListingProfitStatus(listing);
    }
  }
}