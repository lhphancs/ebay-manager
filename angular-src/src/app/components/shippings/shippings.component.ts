import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { openSnackbar } from '../snackbar';
import { Router } from '@angular/router';
import { DatabaseShippingsService } from '../../services/database-shippings.service';

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

  getProcessedShipMethods(shipMethods){
    let companyDict = {};
    let processedShipMethods = [];

    for(let shipMethod of shipMethods){
      let shipCompany = shipMethod['shipCompany'];
      if( !(shipCompany in companyDict) ){
        companyDict[shipCompany] = Object.keys(companyDict).length;
        processedShipMethods.push(  { name:shipCompany, shipMethods:[] }  );
      }

      processedShipMethods[companyDict[shipCompany]].shipMethods.push(
        {
          shipMethodId: shipMethod['_id']
          , shipMethodName: shipMethod['shipMethodName']
          , description: shipMethod['description']
          , ozPrice: shipMethod['ozPrice']
        }
      );
    }
    return processedShipMethods;
  }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.databaseShippingService.getShipMethods(this.userId).subscribe((data) =>{
          this.shipCompanies = this.getProcessedShipMethods(data['shipMethods']);
          console.log(this.shipCompanies);
        });
      }
    });
  }

  removeShipMethodFromView(companyIndex, shipMethodIndex){
    this.shipCompanies[companyIndex].shipMethods.splice(shipMethodIndex, 1);
  }

  deleteShipMethod(companyIndex, shipMethodIndex){
    let shipMethodObj = this.shipCompanies[companyIndex].shipMethods[shipMethodIndex];
    this.databaseShippingService.deleteShipMethod(this.userId, shipMethodObj.shipMethodId)
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

  addResponse(companyId){
    this.router.navigate([`/shippings/add/${companyId}`]);
  }
}
