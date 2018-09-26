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
    , private databaseShippingsService: DatabaseShippingsService
    , private ebayService: EbayService
    , public snackBar: MatSnackBar) {
      this.listings = [];
    }

  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit() {
    let listingDict = {};
    listingDict['upc1'] = new Listing('www1', 'listTitle1', 'upc1');
    listingDict['upc2'] = new Listing('www2', 'listTitle2', 'upc2');

    let upcs = this.getUpcsFromListingDict(listingDict);

    this.databaseProductsService.getManyProductsByUpcs(this.ebayComponent.userId
      , upcs).subscribe((data) =>{
        if(data['success'])
          this.addProductInfoToListingDict(listingDict, data['products']);
    });
    
    this.addListingsFromDict(listingDict);
    this.dataSource = new MatTableDataSource<Listing>(this.listings);
    this.dataSource.sort = this.sort;
    
    /*
    this.ebayService.getListings(this.ebayComponent.userId).subscribe( (data) => {
      console.log(data)
    });
    */
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

  addVariationsToListing(listing, packInfo){

  }

  addProductInfoToListingDict(listingDict, products){
    for(let product of products){
      let upc = product.UPC;
      let listing = listingDict[upc];
      listing.wholesaleComp = product.wholesaleComp;
      listing.stockNo = product.stockNo;
      listing.costPerSingle = product.costPerBox/product.quantityPerBox;
      this.addVariationsToListing(listing, listing.packInfo)
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}