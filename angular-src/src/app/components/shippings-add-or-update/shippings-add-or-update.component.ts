import { TableDynamicInputComponent } from '../table-dynamic-input/table-dynamic-input.component';
import { MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from '../../services/database-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { openSnackbar } from '../snackbar';
import { ShipMethod } from '../../classesAndInterfaces/shipMethod';
import { getProcessedEntries } from '../table-methods'
import { getHeaderNames } from '../table-methods'
import { DatabaseShippingsService } from '../../services/database-shippings.service';

@Component({
  selector: 'shippings-add-or-update',
  templateUrl: './shippings-add-or-update.component.html',
  styleUrls: ['./shippings-add-or-update.component.css']
})
export class ShippingsAddOrUpdateComponent implements OnInit {
  @ViewChild(TableDynamicInputComponent) viewTable;
  shipMethodId:string;
  userId:string;
  mode:string;
  paramId:string;

  isFlatRate:boolean;
  flatRateCost:number;

  shipCompanyName:string;
  shipMethodName:string;
  description:string;
  entries:object[];
  headers: object[] = [
    {name:'oz', type:"string"}
    , {name:'price', type:"number", min:0, step:"any"}
  ];
  headerNames:string[];

  constructor( 
    private databaseUsersService:DatabaseUsersService
    , private databaseShippingsService:DatabaseShippingsService
    , private activatedRoute: ActivatedRoute
    , public snackBar: MatSnackBar
    , private router: Router) { }

  ngOnInit() {
    this.headerNames = getHeaderNames(this.headers);
    this.databaseUsersService.getProfile().subscribe ( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.activatedRoute.paramMap.subscribe(params => {
          this.paramId = params.get('id');
          this.mode = params.get('mode');
          if(this.mode == 'update')
            this.prepareShipMethodUpdate(this.paramId);
          else{
            this.companyId = this.paramId;
            this.prepareShipMethodAdd(this.companyId);
          }
        });
      }
    });
  }

  loadShipMethod(shipMethod){
    let tableEntries = shipMethod['ozPrice'];
    if(tableEntries[0].oz == -1){
      this.isFlatRate = true;
      this.flatRateCost = tableEntries[0].price;
      this.entries = [];
    }
    else
      this.entries = tableEntries;
  }

  prepareShipMethodUpdate(shipMethodId){
    this.databaseShippingsService.getShipMethod(shipMethodId, this.userId).subscribe((data) =>{
      if(data['success']){
        let shipMethod = data['shipMethod'];
        this.shipMethodId = shipMethod._id;

        this.shipCompanyName = shipMethod.shipCompany;
        this.shipMethodName = shipMethod.shipMethodName;
        this.description = shipMethod['description'];
        
        this.loadShipMethod(shipMethod);
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
  }

  prepareShipMethodAdd(companyId){
    /*
    this.databaseUsersService.getShipCompanyName(this.userId, companyId).subscribe((data) =>{
      if(data['success']){
        if(data['shipCompanyName']){
            this.shipCompanyName = data['shipCompanyName'];
            this.entries = [];
        }
        else
          openSnackbar(this.snackBar, "Error: Ship Company Id not found in database");
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
*/
  }


  updateShipMethod(shipMethodId, newShipMethod){
    this.databaseShippingsService.updateShipMethod(shipMethodId
    , this.userId, newShipMethod).subscribe(data => {
      if(data['success']){
        openSnackbar(this.snackBar, `Update successful: ${newShipMethod.shipMethodName}`);
        this.router.navigateByUrl('/shippings');
      }
      else
        openSnackbar(this.snackBar, `Update failed: ${data['msg']}`);
    });
  }

  getNewShipMethodObject(processedEntriesOzPrice){
    return new ShipMethod(this.shipMethodId, this.userId, this.shipCompanyName
      , this.shipMethodName, this.description, processedEntriesOzPrice);
  }

  addShipMethod(shipMethod, form){
    /*
    this.databaseUsersService.addShipMethod(this.userId, this.companyId, shipMethod).subscribe(data => {
      if(data['success'])
        this.addSuccessResponse(form);
      else
        openSnackbar(this.snackBar, `Failed to add product: ${data['msg']}`);
    });
    */
  }

  ///The add is currently connected, but edit needs companyId
  onSubmit(form){
    let processedEntries;
    if(this.isFlatRate)
      processedEntries = [ {oz:-1, price:this.flatRateCost} ];
    else
      processedEntries = getProcessedEntries(this.entries);
    
    if(processedEntries == null)
      openSnackbar(this.snackBar, 'Failed to add product: Partially filled ASIN entry exists. Complete or remove the entry.');

    else{
      let newShipMethod = this.getNewShipMethodObject(processedEntries);
      if(this.mode == "update")
        this.updateShipMethod(this.paramId, newShipMethod)
      else
        this.addShipMethod(newShipMethod, form);
    }
  }

  addSuccessResponse(form){
    this.router.navigate(['/shippings']);
    openSnackbar(this.snackBar, 'Successfully added ship method');
  }
}
