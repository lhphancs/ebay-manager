import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { openSnackbar } from '../snackbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shippings',
  templateUrl: './shippings.component.html',
  styleUrls: ['./shippings.component.css']
})
export class ShippingsComponent implements OnInit {
  objectKeys = Object.keys;
  userId:string;
  shipCompanies:Object;

  constructor(private databaseUsersService:DatabaseUsersService
    , private dialog: MatDialog
    , public snackBar: MatSnackBar
    , private router: Router) { }


  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.databaseUsersService.getShipCompanies(this.userId).subscribe((data) =>{
          this.shipCompanies = data['shipCompanies'];
        });
      }
    });
  }

  removeShipMethodFromView(companyIndex, shipMethodIndex){
    this.shipCompanies[companyIndex].shipMethods.splice(shipMethodIndex, 1);
  }

  deleteShipMethod(companyIndex, shipMethodIndex){
    let shipMethodObj = this.shipCompanies[companyIndex].shipMethods[shipMethodIndex];
    this.databaseUsersService.deleteShipMethod(this.userId, shipMethodObj._id)
      .subscribe( (data) =>{
        if(data['success']){
          this.removeShipMethodFromView(companyIndex, shipMethodIndex);
          openSnackbar(this.snackBar, `Successfully deleted ship method: ${shipMethodObj.name}`);
        }
        else
          openSnackbar(this.snackBar, data['msg']);
      });
  }

  openDeleteConfirmDialog(companyIndex, shipMethodIndex){
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{title: "Confirmation", msg: "Are you sure you want to delete?"}
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if(result)
        this.deleteShipMethod(companyIndex, shipMethodIndex);
    });
  }

  addResponse(shipCompanyId){
    this.router.navigate([`/shippings/add/${shipCompanyId}`]);
  }
}
