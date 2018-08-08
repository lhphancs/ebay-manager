import { MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { openSnackbar } from '../snackbar';

@Component({
  selector: 'fees',
  templateUrl: './fees.component.html',
  styleUrls: ['../products/products-add-or-update/products-add-or-update.component.css']
})
export class FeesComponent implements OnInit {
  userId;
  fees;

  constructor(private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId=data['_id'];
        this.databaseUsersService.getFees(this.userId).subscribe( (data) =>{
          if(data['success']){
            this.fees = data['fees'];
          }
        });
      }
    });
  }

  getFeesFromFormValues(formValues){
    let values = {
      ebayPercentageFromSaleFee: formValues.ebayPercentageFromSaleFee,
      paypalFlatFee: formValues.paypalFlatFee,
      paypalPercentageFromSaleFee: formValues.paypalPercentageFromSaleFee
    }
    if(formValues['miscFee'])
      values['miscFee'] = formValues.miscFee;
    return values;
  }

  onSubmit(form){
    let newFees = this.getFeesFromFormValues(form.value);
    this.databaseUsersService.updateFees(this.userId, newFees).subscribe( (data) =>{
      if(data['success'])
        openSnackbar(this.snackBar, 'Successfully updated fees');
      else
        openSnackbar(this.snackBar, `Failed to update fees: ${data['msg']}`);
    });
  }
}
