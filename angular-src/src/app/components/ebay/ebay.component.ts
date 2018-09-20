import { Component, OnInit } from '@angular/core';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Link } from '../../classesAndInterfaces/Link';
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

  leftSublinks = [
    new Link("Calculations", "calculations")
    , new Link("Listings", "listings")
    , new Link("Calculator", "calculator")
  ];

  rightSublinks = [
    new Link("Update Fees", "update-fees")
    , new Link("Update Key", "update-key")
  ];
  
  constructor(private databaseUsersService: DatabaseUsersService) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        let fees = data['fees'];
        this.ebayPercentageFromSaleFee = fees.ebayPercentageFromSaleFee;
        this.paypalFlatFee = fees.paypalFlatFee;
        this.paypalPercentageFromSaleFee = fees.paypalPercentageFromSaleFee;
      }
    });
  }

}
