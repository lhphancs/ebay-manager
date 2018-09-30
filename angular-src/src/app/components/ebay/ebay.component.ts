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
  ebayPercentageFromSaleFee;
  paypalFlatFee;
  paypalPercentageFromSaleFee;
  ebayAppId;
  ebayKey;
  ebayUserName;

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
        this.initializeEbaySettings(this.userId);
        this.initializeShippingMethods();
      }
    });
  }

  initializeEbaySettings(userId){
    this.databaseUsersService.getEbaySettings(userId).subscribe( (data) =>{
      let ebaySettings = data['ebaySettings'];
      this.ebayPercentageFromSaleFee = ebaySettings.ebayFees.ebayPercentageFromSaleFee;
      this.paypalFlatFee = ebaySettings.ebayFees.paypalFlatFee;
      this.paypalPercentageFromSaleFee = ebaySettings.ebayFees.paypalPercentageFromSaleFee;
      this.ebayAppId = ebaySettings.ebayAppId;
      this.ebayKey = ebaySettings.ebayKey;
      this.ebayUserName = ebaySettings.ebayUserName;
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
