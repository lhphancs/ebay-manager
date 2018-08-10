import { DatabaseShippingsService } from './../../services/database-shippings.service';
import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

class ShippingCompany{
  name;
  services;
  constructor(name, services){
    this.name = name;
    this.services = services;
  }
}

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

  shippingCompanies;
  shippingCompanyObjects = {};
  selectedShippingCompany;

  constructor(private databaseUsersService:DatabaseUsersService
    , private databaseShippingsService:DatabaseShippingsService) {
      this.selectedShippingCompany = "USPS";
  }

  loadShippings(){
    this.databaseShippingsService.getShippings(this.userId).subscribe( (data) =>{
      if(data['success']){
        this.shippingCompanyObjects = data['shippings'];
        this.shippingCompanies = Object.keys(this.shippingCompanyObjects);
        this.shippingCompanies.push("FEDEX_TO_REMOVE");
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
        this.loadShippings();
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
      this.saleValue = Math.round((this.totalProfit+this.paypalFlatFee
        + this.productCost + this.miscCost + this.shippingCost)
        / (1-this.paypalPercentageFromSaleFee*0.01 - this.ebayPercentageFromSaleFee*0.01)*100)/100;
      this.updateFees();
    }
  }
}