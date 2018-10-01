import { Component, OnInit } from '@angular/core';
import { DatabaseShippingsService } from '../../../services/database-shippings.service';
import { getProcessedShipMethods } from '../../getProcessedShipMethods';
import { EbayComponent } from '../ebay.component';
import { DatabaseUsersService } from '../../../services/database-users.service';

@Component({
  selector: 'ebay-calculator',
  templateUrl: './ebay-calculator.component.html',
  styleUrls: ['./ebay-calculator.component.css']
})
export class EbayCalculatorComponent implements OnInit {
  ebayPercentageFromSaleFee;
  paypalFlatFee;
  paypalPercentageFromSaleFee;
  multiplierArray = [2,3,5];

  objectKeys = Object.keys;
  mode = "calcProfit";

  saleValue:number;
  productCost:number;
  miscCost:number;
  shippingCost:number;
  totalEbayFee:number;
  totalPaypalFee:number;

  totalProfit:number;
  shipCompanies:object;

  selectedCompanyIndex;
  selectedMethodIndex;
  selectedOzPriceIndex;

  constructor(private ebayComponent:EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , private databaseShippingsService:DatabaseShippingsService) {
      this.miscCost = 0;
  }

  loadAvailableShippings(){
    this.databaseShippingsService.getShipMethods(this.ebayComponent.userId).subscribe( (data) =>{
      if(data['success']){
        this.shipCompanies = getProcessedShipMethods(data['shipMethods']);
        this.companySelect(0);
      }
    });
  }

  ngOnInit() {
    this.loadAvailableShippings();
    this.databaseUsersService.getEbayFees(this.ebayComponent.userId).subscribe( (data) =>{
      this.ebayPercentageFromSaleFee = data['ebayFees'].ebayPercentageFromSaleFee;
      this.paypalFlatFee = data['ebayFees'].paypalFlatFee;
      this.paypalPercentageFromSaleFee = data['ebayFees'].paypalPercentageFromSaleFee;
    });
  }
  
  updateEbayFees(){
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
      this.updateEbayFees();
    }
  }

  weightSelect(ozPriceIndex){
    this.shippingCost = this.shipCompanies[this.selectedCompanyIndex]['shipMethods'][this.selectedMethodIndex].flatRatePrice;
    if(!this.shippingCost){
      this.selectedOzPriceIndex = ozPriceIndex;
      this.shippingCost = this.shipCompanies[this.selectedCompanyIndex]['shipMethods']
        [this.selectedMethodIndex]['ozPrice'][this.selectedOzPriceIndex]['price']; 
    }
    this.updateTotalOrSaleValue();
  }

  methodSelect(methodIndex){
    this.selectedMethodIndex = methodIndex;
    this.weightSelect(0);
  }

  companySelect(companyIndex){
    this.selectedCompanyIndex = companyIndex;
    this.methodSelect(0);
  }

  multiplyProductCost(multiplier){
    this.productCost = Math.round(this.productCost*multiplier*100)/100;
    this.updateTotalOrSaleValue();
  }

  onCalcNeededSaleClick(){
    this.totalProfit = 1;
    this.updateTotalOrSaleValue();
  }
}
