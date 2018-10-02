import { Component, OnInit } from '@angular/core';
import { EbayUpdateSettingsComponent } from '../ebay-update-settings.component';
import { EbayComponent } from '../../ebay.component';
import { DatabaseUsersService } from '../../../../services/database-users.service';
import { openSnackbar } from '../../../snackbar';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'ebay-update-settings-fees',
  templateUrl: './ebay-update-settings-fees.component.html',
  styleUrls: ['./ebay-update-settings-fees.component.css']
})
export class EbayUpdateSettingsFeesComponent implements OnInit {

  constructor(private ebayComponent: EbayComponent
    , private ebayUpdateSettingsComponent:EbayUpdateSettingsComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  
  getEbayFeesFromForm(){
    let values = {
        ebayPercentageFromSaleFee: this.ebayUpdateSettingsComponent.ebayPercentageFromSaleFee,
        paypalFlatFee: this.ebayUpdateSettingsComponent.paypalFlatFee,
        paypalPercentageFromSaleFee: this.ebayUpdateSettingsComponent.paypalPercentageFromSaleFee
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
}
