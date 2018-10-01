import { Component, OnInit } from '@angular/core';
import { EbayComponent } from '../ebay.component';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'app-ebay-update-settings',
  templateUrl: './ebay-update-settings.component.html',
  styleUrls: ['./ebay-update-settings.component.css']
})
export class EbayUpdateSettingsComponent implements OnInit {
  ebayPercentageFromSaleFee;
  paypalFlatFee;
  paypalPercentageFromSaleFee;
  ebayUserName;
  ebayStoreName;
  ebayAppId;
  ebayKey;

  constructor(private ebayComponent: EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initializeEbaySettings(this.ebayComponent.userId);
  }

  initializeEbaySettings(userId){
    this.databaseUsersService.getEbaySettings(userId).subscribe( (data) =>{
      let ebaySettings = data['ebaySettings'];
      this.ebayPercentageFromSaleFee = ebaySettings.ebayFees.ebayPercentageFromSaleFee;
      this.paypalFlatFee = ebaySettings.ebayFees.paypalFlatFee;
      this.paypalPercentageFromSaleFee = ebaySettings.ebayFees.paypalPercentageFromSaleFee;
      this.ebayUserName = ebaySettings.ebayUserName;
      this.ebayStoreName = ebaySettings.ebayStoreName;
      this.ebayAppId = ebaySettings.ebayAppId;
      this.ebayKey = ebaySettings.ebayKey;
      
    });
  }

  getEbayFeesFromForm(){
    let values = {
        ebayPercentageFromSaleFee: this.ebayPercentageFromSaleFee,
        paypalFlatFee: this.paypalFlatFee,
        paypalPercentageFromSaleFee: this.paypalPercentageFromSaleFee
      }
    return values;
  }

  getEbayAccountSettingsFromForm(){
    let values = {
      ebayUserName: this.ebayUserName,
      ebayStoreName: this.ebayStoreName,
      ebayAppId: this.ebayAppId,
      ebayKey: this.ebayKey
    }
    return values;
  }

  onUpdateFees(){
    let newEbayFees = this.getEbayFeesFromForm();
    this.databaseUsersService.updateEbayFees(this.ebayComponent.userId, newEbayFees).subscribe( (data) =>{
      if(data['success'])
        openSnackbar(this.snackBar, 'Successfully updated ebay fees');
      else
        openSnackbar(this.snackBar, `Failed to update ebay fees: ${data['msg']}`);
    });
  }

  onUpdateAccountSettings(){
    let newEbayAccountSettings = this.getEbayAccountSettingsFromForm();
    this.databaseUsersService.updateEbayAccountSettings(this.ebayComponent.userId, newEbayAccountSettings).subscribe( (data) =>{
      if(data['success'])
        openSnackbar(this.snackBar, 'Successfully updated eBay account settings');
      else
        openSnackbar(this.snackBar, `Failed to update eBay account settings: ${data['msg']}`);
    });
  }
}
