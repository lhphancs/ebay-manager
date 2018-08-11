import { DatabaseShippingsService } from './../../services/database-shippings.service';
import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  objectKeys = Object.keys;
  userId;
  mode = "calcProfit";

  saleValue:number;
  productCost:number;
  miscCost:number;
  shippingCost:number;
  ebayPercentageFromSaleFee:number;
  paypalPercentageFromSaleFee:number;
  paypalFlatFee:number;
  totalEbayFee:number;
  totalPaypalFee:number;

  totalProfit:number;

  shipCompanies:object;

  selectedCompanyIndex;
  selectedMethodIndex;
  selectedOzPriceIndex;

  constructor(private databaseUsersService:DatabaseUsersService
    , private databaseShippingsService:DatabaseShippingsService) {
  }

  loadAvailableShippings(){
    this.databaseShippingsService.getShipCompanies(this.userId).subscribe( (data) =>{
      if(data['success']){
        this.shipCompanies=data['shipCompanies'];
        this.companySelect(0);
      }
    });
  }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        let fees = data['fees'];
        this.ebayPercentageFromSaleFee = fees['ebayPercentageFromSaleFee'];
        this.paypalPercentageFromSaleFee = fees['paypalPercentageFromSaleFee'];
        this.paypalFlatFee = fees['paypalFlatFee'];
        this.loadAvailableShippings();
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

  updateTotalOrSaleValue(){
    if(this.mode=="calcProfit")
      this.totalProfit = Math.round((this.saleValue - this.productCost - this.miscCost
        - this.shippingCost - this.totalEbayFee - this.totalPaypalFee)*100)/100;
    else{
      this.saleValue = Math.round((this.totalProfit+this.paypalFlatFee
        + this.productCost + this.miscCost + this.shippingCost)
        / (1-this.paypalPercentageFromSaleFee*0.01 - this.ebayPercentageFromSaleFee*0.01)*100)/100;
      this.updateFees();
    }
  }

  weightSelect(ozPriceIndex){
    this.selectedOzPriceIndex = ozPriceIndex;
    this.updateTotalOrSaleValue();
    this.shippingCost = this.shipCompanies[this.selectedCompanyIndex]['shipMethods']
      [this.selectedMethodIndex]['ozPrice'][this.selectedOzPriceIndex]['price'];
  }

  methodSelect(methodIndex){
    this.selectedMethodIndex = methodIndex;
    this.weightSelect(0);
  }

  companySelect(companyIndex){
    this.selectedCompanyIndex = companyIndex;
    this.methodSelect(0);
  }
}