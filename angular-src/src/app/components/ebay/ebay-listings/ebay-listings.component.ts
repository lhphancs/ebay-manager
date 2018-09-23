import { Component, OnInit } from '@angular/core';
import { EbayService } from '../../../services/ebay.service';
import { EbayComponent } from '../ebay.component';

@Component({
  selector: 'ebay-listings',
  templateUrl: './ebay-listings.component.html',
  styleUrls: ['./ebay-listings.component.css']
})
export class EbayListingsComponent implements OnInit {

  constructor(private ebayService: EbayService
    , private ebayComponent: EbayComponent) { }

  ngOnInit() {
    this.ebayService.getListings(this.ebayComponent.userId).subscribe( (data) => {
      console.log(data)
    });
  }

}