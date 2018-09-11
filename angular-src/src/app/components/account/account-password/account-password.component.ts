import { Component, OnInit } from '@angular/core';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';
import { AccountComponent } from '../account.component';

@Component({
  selector: 'account-password',
  templateUrl: './account-password.component.html',
  styleUrls: ['./account-password.component.css']
})
export class AccountPasswordComponent implements OnInit {
  userId;

  constructor(private accountComponent: AccountComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.accountComponent.userId;
  }

  updatePass(updatePassForm){
    let formValues = updatePassForm.value;

    if(formValues['newPassword'] != formValues['confirmNewPassword'])
      openSnackbar(this.snackBar, "New passwords do not match. Try again");  
    else{
      delete formValues['confirmNewPassword'];
      this.databaseUsersService.updatePassword(this.userId, formValues).subscribe(data => {
        if(data['success'])
          openSnackbar(this.snackBar, `Password update successful!`);
        else
          openSnackbar(this.snackBar, `Password update failed: ${data['msg']}`);
      });
    }
    updatePassForm.reset();
  }
}
