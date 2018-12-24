import { Component, OnInit } from '@angular/core';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Link } from '../../classesAndInterfaces/Link';
import { DatabaseShippingsService } from '../../services/database-shippings.service';
import { initializeShipDicts } from '../getProcessedShipMethods'

@Component({
  selector: 'ebay',
  templateUrl: './ebay.component.html',
  styleUrls: ['./ebay.component.css']
})
export class EbayComponent implements OnInit {
  userId;
  dictShipIdToName = {};
  dictShipIdAndOzToCost = {};

  leftSublinks = [
    new Link("Calculations", "calculations")
    , new Link("Listings", "listings")
    , new Link("Calculator", "calculator")
    , new Link("Shipping", "shipping")
  ];

  rightSublinks = [
    new Link("eBay Settings", "update-ebay-settings")
  ];
  
  constructor(private databaseUsersService: DatabaseUsersService
    , private databaseShippingsService: DatabaseShippingsService) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.initializeShippingMethods();
      }
    });
  }

  //For 'calculations' and 'listings' tab
  initializeShippingMethods(){
    this.databaseShippingsService.getShipMethods(this.userId).subscribe((data)=>{
      initializeShipDicts(this.dictShipIdToName, this.dictShipIdAndOzToCost, data['shipMethods']);
    });
  }
}