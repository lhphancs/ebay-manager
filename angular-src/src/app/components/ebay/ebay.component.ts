import { Component, OnInit } from '@angular/core';
import { DatabaseUsersService } from '../../services/database-users.service';

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
