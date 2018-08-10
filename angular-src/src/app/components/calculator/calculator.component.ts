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
  shippingCost;
  ebayPercentageFromSaleFee;
  paypalPercentageFromSaleFee;
  paypalFlatFee;
  totalEbayFee;
  totalPaypalFee;

  totalProfit;

  companies;
  methods;
  weights;

  companyObjectsDict = {};
  companyToMethodsDict = {};
  companyMethodToWeightsDict = {};
  companyMethodWeightToPriceDict = {};


  selectedCompany;
  selectedMethod;
  selectedWeight;

  constructor(private databaseUsersService:DatabaseUsersService
    , private databaseShippingsService:DatabaseShippingsService) {
      this.selectedCompany = "USPS";
  }

  setDicts(){
    for(let companyName in this.companyObjectsDict)
    {
      if(this.companyToMethodsDict[companyName] == undefined)
        this.companyToMethodsDict[companyName] = [];
      let companyShipMethodArray = this.companyObjectsDict[companyName];
      for(let i=0; i<companyShipMethodArray.length; ++i){
        let methodWithOzAndPrice = companyShipMethodArray[i];
        this.companyToMethodsDict[companyName]
          .push(methodWithOzAndPrice.shipMethod);

        let ozPriceArray = methodWithOzAndPrice.ozPrice;
        for(let j=0; j<ozPriceArray.length; ++j){
          let methodToWeightsKey = companyName+methodWithOzAndPrice.shipMethod;
          if(this.companyMethodToWeightsDict[methodToWeightsKey] == undefined)
            this.companyMethodToWeightsDict[methodToWeightsKey] = [];
          this.companyMethodToWeightsDict[methodToWeightsKey].push(ozPriceArray[j].oz);
          let weightToPriceKey = methodToWeightsKey+ozPriceArray[j].oz;
          if(this.companyMethodWeightToPriceDict[weightToPriceKey] == undefined)
            this.companyMethodWeightToPriceDict[weightToPriceKey] = [];

          this.companyMethodWeightToPriceDict[weightToPriceKey] = ozPriceArray[j].price;
        }
      }
    }
  }

  loadAvailableShippings(){
    this.databaseShippingsService.getShippings(this.userId).subscribe( (data) =>{
      if(data['success']){
        this.companyObjectsDict = data['shippings'];
        this.companies = Object.keys(this.companyObjectsDict);
        this.setDicts();
        this.companySelect(this.selectedCompany);
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

  weightSelect(weight){
    this.selectedWeight = weight;
    let key = this.selectedCompany + this.selectedMethod + weight;
    this.shippingCost = this.companyMethodWeightToPriceDict[key];
  }

  methodSelect(method){
    this.selectedMethod = method;
    let key = this.selectedCompany+method;
    this.weights = this.companyMethodToWeightsDict[key];
    this.weightSelect(this.weights[0]);
  }

  companySelect(company){
    this.selectedCompany = company;
    this.methods = this.companyToMethodsDict[company];
    this.methodSelect(this.methods[0]);
  }
}