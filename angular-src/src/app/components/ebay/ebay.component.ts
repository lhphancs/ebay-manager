import { Component, OnInit } from '@angular/core';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Link } from '../../classesAndInterfaces/Link';
import { DatabaseShippingsService } from '../../services/database-shippings.service';
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
      for(let method of data['shipMethods']){
        this.dictShipIdToName[method._id] = method.shipCompanyName + " - " + method.shipMethodName;
        if(method.flatRatePrice)
          this.dictShipIdAndOzToCost[method._id] = method.flatRatePrice;
        else{
          for(let obj of method.ozPrice)
            this.dictShipIdAndOzToCost[method._id + obj.oz] = obj.price;
        }
      }
    });
  }
}