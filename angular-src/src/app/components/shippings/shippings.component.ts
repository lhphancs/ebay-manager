import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { openSnackbar } from '../snackbar';
import { Router } from '@angular/router';
import { DatabaseShippingsService } from '../../services/database-shippings.service';
import { getProcessedShipMethods } from '../getProcessedShipMethods';

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
    , private databaseShippingService: DatabaseShippingsService
    , private dialog: MatDialog
    , public snackBar: MatSnackBar
    , private router: Router) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.databaseShippingService.getShipMethods(this.userId).subscribe((data) =>{
          this.shipCompanies = getProcessedShipMethods(data['shipMethods']);
        });
      }
    });
  }

  removeShipMethodFromView(companyIndex, shipMethodIndex){
    this.shipCompanies[companyIndex].shipMethods.splice(shipMethodIndex, 1);
  }

  deleteShipMethod(companyIndex, shipMethodIndex){
    let shipMethodObj = this.shipCompanies[companyIndex].shipMethods[shipMethodIndex];
    this.databaseShippingService.deleteShipMethod(shipMethodObj.shipMethodId, this.userId)
      .subscribe( (data) =>{
        if(data['success']){
          this.removeShipMethodFromView(companyIndex, shipMethodIndex);
          openSnackbar(this.snackBar, `Successfully deleted ship method: ${shipMethodObj.shipMethodName}`);
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

  addResponse(companyIndex){
    let firstShipMethodIdOfCompany = this.shipCompanies[companyIndex].shipMethods[0].shipMethodId;
    this.router.navigate([`/shippings/add/${firstShipMethodIdOfCompany}`]);
  }

  addNewShipCompanyResponse(){
    this.router.navigate(['/shippings/new-ship-company']);
  }

  toggleZoomClass(shipMethodObj){
    shipMethodObj.active = !shipMethodObj.active;
  }
}
