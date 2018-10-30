import { Component, OnInit } from '@angular/core';
import { Link } from 'src/app/classesAndInterfaces/Link';
import { DatabaseUsersService } from 'src/app/services/database-users.service';
import { DatabaseShippingsService } from 'src/app/services/database-shippings.service';
import { initializeShipDicts } from '../getProcessedShipMethods';

@Component({
  selector: 'shopify',
  templateUrl: './shopify.component.html',
  styleUrls: ['./shopify.component.css']
})
export class ShopifyComponent implements OnInit {
  userId;
  dictShipIdToName = {};
  dictShipIdAndOzToCost = {};

  leftSublinks = [
    new Link("Calculations", "calculations")
  ];

  rightSublinks = [
    new Link("Shopify Settings", "update-shopify-settings")
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

  //For 'calculations'
  initializeShippingMethods(){
    this.databaseShippingsService.getShipMethods(this.userId).subscribe((data)=>{
      initializeShipDicts(this.dictShipIdToName, this.dictShipIdAndOzToCost, data['shipMethods']);
    });
  }
}
