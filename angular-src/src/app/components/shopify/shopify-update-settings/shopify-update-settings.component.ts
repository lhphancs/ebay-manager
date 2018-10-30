import { Component, OnInit } from '@angular/core';
import { ShopifyComponent } from '../shopify.component';
import { DatabaseUsersService } from 'src/app/services/database-users.service';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'shopify-update-settings',
  templateUrl: './shopify-update-settings.component.html',
  styleUrls: ['./shopify-update-settings.component.css']
})
export class ShopifyUpdateSettingsComponent implements OnInit {
  shopifyPercentageFromSaleFee: number;
  shopifyFlatFee: number;
  websitePercentageDiscount: number;

  constructor(private shopifyComponent: ShopifyComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initializeShopifySettings(this.shopifyComponent.userId);
  }

  initializeShopifySettings(userId){
    this.databaseUsersService.getShopifyFees(userId).subscribe( (data) =>{
      let shopifyFees = data['shopifyFees'];
      this.shopifyPercentageFromSaleFee = shopifyFees.shopifyPercentageFromSaleFee;
      this.shopifyFlatFee = shopifyFees.shopifyFlatFee;
      this.websitePercentageDiscount = shopifyFees.websitePercentageDiscount;
    });
  }
  
  getShopifyFeesFromForm(){
    let values = {
        shopifyPercentageFromSaleFee: this.shopifyPercentageFromSaleFee
        , shopifyFlatFee: this.shopifyFlatFee
        , websitePercentageDiscount: this.websitePercentageDiscount
      }
    return values;
  }

  onUpdateFees(){
    let newShopifyFees = this.getShopifyFeesFromForm();
    this.databaseUsersService.updateShopifyFees(this.shopifyComponent.userId, newShopifyFees).subscribe( (data) =>{
      if(data['success'])
        openSnackbar(this.snackBar, 'Successfully updated shopify fees');
      else
        openSnackbar(this.snackBar, `Failed to update shopify fees: ${data['msg']}`);
    });
  }
}
