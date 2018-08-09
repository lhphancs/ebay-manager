import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  userId;
  ebayPercentageFromSaleFee;
  paypalPercentageFromSaleFee;
  paypalFlatFee;
  saleValue;
  productCost;
  miscCost;

  constructor(private databaseUsersService:DatabaseUsersService) { }


  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        let fees = data['fees'];
        this.ebayPercentageFromSaleFee = fees['ebayPercentageFromSaleFee'];
        this.paypalPercentageFromSaleFee = fees['paypalPercentageFromSaleFee'];
        this.paypalFlatFee = fees['paypalFlatFee'];
      }
    });
  }

}
