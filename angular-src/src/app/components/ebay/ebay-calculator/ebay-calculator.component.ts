import { Component, OnInit } from '@angular/core';
import { DatabaseShippingsService } from '../../../services/database-shippings.service';
import { getProcessedShipMethods } from '../../getProcessedShipMethods';
import { EbayComponent } from '../ebay.component';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { calculateTotalEbayFee } from '../calculations';
import { calculateTotalPaypalFee } from '../calculations';
import { calculateProfit } from '../calculations';
import { calculateDesiredSaleValue } from '../calculations';


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
    this.totalEbayFee = calculateTotalEbayFee(this.saleValue, this.ebayPercentageFromSaleFee);
    this.totalPaypalFee = calculateTotalPaypalFee(this.saleValue
                          , this.paypalPercentageFromSaleFee, this.paypalFlatFee);
  }

  updateTotalOrSaleValue(){
    if(this.mode=="calcProfit")
      this.totalProfit = calculateProfit(this.saleValue, 1, this.productCost, this.shippingCost
        , this.totalEbayFee, this.totalPaypalFee, this.miscCost);
    else{
      let desiredProfit = calculateDesiredSaleValue(this.totalProfit, 1, this.productCost, this.shippingCost
        , this.miscCost, this.ebayPercentageFromSaleFee, this.paypalPercentageFromSaleFee, this.paypalFlatFee, true);
      this.saleValue = typeof(desiredProfit) == 'number' ? desiredProfit : NaN;
      this.updateEbayFees();
    }
  }

  weightSelect(ozPriceIndex){
    let isFlatRate = this.shipCompanies[this.selectedCompanyIndex]['shipMethods'][this.selectedMethodIndex].isFlatRate
    if(isFlatRate)
      this.shippingCost = this.shipCompanies[this.selectedCompanyIndex]['shipMethods'][this.selectedMethodIndex].flatRatePrice;
    else{
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
