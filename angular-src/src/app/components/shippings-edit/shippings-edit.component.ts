import { TableDynamicInputComponent } from './../table-dynamic-input/table-dynamic-input.component';
import { MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from './../../services/database-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { openSnackbar } from '../snackbar';
import { ShipMethod } from '../../classesAndInterfaces/shipMethod';
import { getProcessedEntries } from '../table-methods'
import { getHeaderNames } from '../table-methods'

@Component({
  selector: 'app-shippings-edit',
  templateUrl: './shippings-edit.component.html',
  styleUrls: ['./shippings-edit.component.css']
})
export class ShippingsEditComponent implements OnInit {
  @ViewChild(TableDynamicInputComponent) viewTable;

  userId:string;
  mode:string;
  paramId:string;

  isFlatRate:boolean;
  flatRateCost:number;

  name:string;
  description:string;
  entries:object[];
  headers: object[] = [
    {name:'oz', type:"string"}
    , {name:'price', type:"number", min:0, step:"any"}
  ];
  headerNames:string[];

  constructor( 
    private databaseUsersService:DatabaseUsersService
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
          if(this.mode == 'update'){
            this.prepareShipMethodUpdate(this.paramId);
          }
        });
      }
    });
  }

  fillInForm(shipMethod){
    this.name = shipMethod['name'];
    this.description = shipMethod['description'];
  }

  loadShipMethod(shipMethodId){
    this.databaseUsersService.getShipMethod(shipMethodId).subscribe( (data) =>{
      let shipMethod = data['shipMethod'];

      this.fillInForm(shipMethod);
      this.entries = shipMethod['ozPrice'];
    });
  }

  prepareShipMethodUpdate(shipMethodId){
    this.databaseUsersService.getShipMethod(shipMethodId).subscribe((data) =>{
      if(data['success']){
        if(data['shipMethod']){
            this.loadShipMethod(this.paramId);
        }
        else
          openSnackbar(this.snackBar, "Error: Ship Method Id not found in database");
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
  }


  updateShipMethod(shipMethodId, newShipMethod){
    this.databaseUsersService.updateShipMethod(this.userId, shipMethodId, newShipMethod).subscribe(data => {
      if(data['success']){
        openSnackbar(this.snackBar, `Update successful: ${newShipMethod.name}`);
        this.router.navigateByUrl('/shippings');
      }
      else
        openSnackbar(this.snackBar, `Failed to add product: ${data['msg']}`);
    });
  }

  getNewShipMethodObject(processedEntriesOzPrice){
    return new ShipMethod(this.name, this.description, processedEntriesOzPrice);
  }

  addShipMethod(shipMethod, form){
    this.databaseUsersService.addShipMethod(this.userId, shipMethod).subscribe(data => {
      if(data['success'])
        this.addSuccessResponse(form);
      else
        openSnackbar(this.snackBar, `Failed to add product: ${data['msg']}`);
    });
  }

  onSubmit(form){
    let processedEntries = getProcessedEntries(this.entries);
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
    //Clear form completely
    form.resetForm();
    this.entries=[];
    this.viewTable.resetTable(this.entries);

    openSnackbar(this.snackBar, 'Successfully added ship method');
  }
}
