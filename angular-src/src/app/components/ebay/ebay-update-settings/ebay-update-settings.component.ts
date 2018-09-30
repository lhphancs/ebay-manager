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
  userId;

  constructor(private ebayComponent: EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.ebayComponent.userId;
  }

  getEbaySettingsFromFormValues(){
    let values = {
      ebayFees:{
        ebayPercentageFromSaleFee: this.ebayComponent.ebayPercentageFromSaleFee,
        paypalFlatFee: this.ebayComponent.paypalFlatFee,
        paypalPercentageFromSaleFee: this.ebayComponent.paypalPercentageFromSaleFee
      },
      ebayAppId: this.ebayComponent.ebayAppId,
      ebayKey: this.ebayComponent.ebayKey,
      ebayUserName: this.ebayComponent.ebayUserName
    }
    console.log(values)
    return values;
  }

  onUpdate(){
    let newEbaySettings = this.getEbaySettingsFromFormValues();
    this.databaseUsersService.updateEbaySettings(this.userId, newEbaySettings).subscribe( (data) =>{
      if(data['success'])
        openSnackbar(this.snackBar, 'Successfully updated ebay settings');
      else
        openSnackbar(this.snackBar, `Failed to update ebay settings: ${data['msg']}`);
    });
  }
}
