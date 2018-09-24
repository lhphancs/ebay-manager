import { Component, OnInit } from '@angular/core';
import { Listing } from '../../../classesAndInterfaces/Listing'
import { EbayService } from '../../../services/ebay.service';
import { EbayComponent } from '../ebay.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { DatabaseShippingsService } from '../../../services/database-shippings.service';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'ebay-listings',
  templateUrl: './ebay-listings.component.html',
  styleUrls: ['./ebay-listings.component.css']
})
export class EbayListingsComponent implements OnInit {
  desiredProfitPerSingle = 1;

  listings: Listing[];
  displayedColumns: string[] = ['imgUrl', 'brand', 'name', 'costPerSingle', 'UPC', 'stockNo', 'wholesaleComp'];
  dataSource: MatTableDataSource<Listing>;
  selection = new SelectionModel<Listing>(true, []);

  constructor(private ebayComponent:EbayComponent
    , private databaseProductsService: DatabaseProductsService
    , private databaseShippingsService: DatabaseShippingsService
    , private ebayService: EbayService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.ebayService.getListings(this.ebayComponent.userId).subscribe( (data) => {
      console.log(data)
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}