import { Component, OnInit } from '@angular/core';
import { AccountComponent } from '../account.component';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'account-ebay-key',
  templateUrl: './account-ebay-key.component.html',
  styleUrls: ['./account-ebay-key.component.css']
})
export class AccountEbayKeyComponent implements OnInit {
  userId;

  constructor(private accountComponent: AccountComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.accountComponent.userId;
  }

  updateEbayKey(updateEbayKeyForm){
    let formValues = updateEbayKeyForm.value;
    let ebayKey = formValues['ebayKey'];

    this.databaseUsersService.updateEbayKey(this.userId, ebayKey).subscribe(data => {
      if(data['success'])
        openSnackbar(this.snackBar, `eBay key update successful!`);
      else
        openSnackbar(this.snackBar, `eBay key update failed: ${data['msg']}`);
    });
  }
}
