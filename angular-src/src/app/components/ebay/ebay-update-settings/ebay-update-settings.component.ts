import { Component, OnInit } from '@angular/core';
import { EbayComponent } from '../ebay.component';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'ebay-update-settings',
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
    , private databaseUsersService: DatabaseUsersService) { }

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

}
