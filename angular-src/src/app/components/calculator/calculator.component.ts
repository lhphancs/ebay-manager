import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  userId;

  saleValue;
  productCost;
  miscCost;
  shippingCost = 0;
  ebayPercentageFromSaleFee;
  paypalPercentageFromSaleFee;
  paypalFlatFee;
  totalEbayFee;
  totalPaypalFee;

  totalProfit;

  constructor(private databaseUsersService:DatabaseUsersService) {
  }


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
  
  updateFees(){
    this.totalEbayFee= Math.round((this.ebayPercentageFromSaleFee*0.01
        * this.saleValue)*100)/100;
    this.totalPaypalFee = Math.round((this.paypalFlatFee
        + this.paypalPercentageFromSaleFee*0.01
        * this.saleValue)*100)/100;
  }

  updateTotalOrSaleValue(mode){
    if(mode=="calcProfit")
      this.totalProfit = Math.round((this.saleValue - this.productCost - this.miscCost
        - this.shippingCost - this.totalEbayFee - this.totalPaypalFee)*100)/100;
    else{
      this.saleValue = Math.round((this.totalProfit+this.paypalFlatFee + this.miscCost + this.shippingCost)
        / (1-this.paypalPercentageFromSaleFee*0.01 - this.ebayPercentageFromSaleFee*0.01)*100)/100;
      this.updateFees();
    }
  }
}