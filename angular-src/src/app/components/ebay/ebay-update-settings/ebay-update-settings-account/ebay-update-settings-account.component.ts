import { Component, OnInit } from '@angular/core';
import { EbayUpdateSettingsComponent } from '../ebay-update-settings.component';
import { DatabaseUsersService } from '../../../../services/database-users.service';
import { openSnackbar } from '../../../snackbar';
import { MatSnackBar } from '@angular/material';
import { EbayComponent } from '../../ebay.component';

@Component({
  selector: 'ebay-update-settings-account',
  templateUrl: './ebay-update-settings-account.component.html',
  styleUrls: ['./ebay-update-settings-account.component.css']
})
export class EbayUpdateSettingsAccountComponent implements OnInit {
  constructor(private ebayComponent:EbayComponent
    , private ebayUpdateSettingsComponent:EbayUpdateSettingsComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  getEbayAccountSettingsFromForm(){
    let values = {
      ebayUserName: this.ebayUpdateSettingsComponent.ebayUserName,
      ebayStoreName: this.ebayUpdateSettingsComponent.ebayStoreName,
      ebayAppId: this.ebayUpdateSettingsComponent.ebayAppId,
      ebayKey: this.ebayUpdateSettingsComponent.ebayKey
    }
    return values;
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
