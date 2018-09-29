import { Component, OnInit } from '@angular/core';
import { EbayComponent } from '../ebay.component';
import { DatabaseUsersService } from '../../../services/database-users.service';
import { MatSnackBar } from '@angular/material';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'ebay-update-key',
  templateUrl: './ebay-update-key.component.html',
  styleUrls: ['./ebay-update-key.component.css']
})
export class EbayUpdateKeyComponent implements OnInit {
  userId;
  ebayAppId;

  constructor(private ebayComponent: EbayComponent
    , private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.ebayComponent.userId;
  }

  onUpdate(){
    this.databaseUsersService.updateEbayAppId(this.userId, this.ebayAppId).subscribe(data => {
      if(data['success'])
        openSnackbar(this.snackBar, `eBay key update successful!`);
      else
        openSnackbar(this.snackBar, `eBay key update failed: ${data['msg']}`);
    });
  }
}
