import { Component, OnInit } from '@angular/core';
import { openSnackbar } from '../../snackbar';
import { EbayComponent } from '../ebay.component';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'ebay-update-fees',
  templateUrl: './ebay-update-fees.component.html',
  styleUrls: ['./ebay-update-fees.component.css']
})
export class EbayUpdateFeesComponent implements OnInit {
  userId;

  constructor(private ebayComponent: EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.ebayComponent.userId;
  }

  getFeesFromFormValues(){
    let values = {
      ebayPercentageFromSaleFee: this.ebayComponent.ebayPercentageFromSaleFee,
      paypalFlatFee: this.ebayComponent.paypalFlatFee,
      paypalPercentageFromSaleFee: this.ebayComponent.paypalPercentageFromSaleFee
    }
    return values;
  }

  onUpdate(){
    let newFees = this.getFeesFromFormValues();
    this.databaseUsersService.updateFees(this.userId, newFees).subscribe( (data) =>{
      if(data['success'])
        openSnackbar(this.snackBar, 'Successfully updated fees');
      else
        openSnackbar(this.snackBar, `Failed to update fees: ${data['msg']}`);
    });
  }
}
