import { TableDynamicInputComponent } from '../table-dynamic-input/table-dynamic-input.component';
import { MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from '../../services/database-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { openSnackbar } from '../snackbar';
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
  newShipCompanyName:string; //Only used if they are trying to add new
  shipMethodId:string;
  userId:string;
  mode:string;
  paramId:string;

  isFlatRate:boolean;
  flatRatePrice:number;

  shipCompanyName:string;
  shipMethodName:string;
  description:string;
  imgUrl;
  entries:object[];
  headers: object[] = [
    {data:"input", name:'oz', type:"number", min:0, step:"any"}
    , {data:"input", name:'price', type:"number", min:0, step:"any"}
  ];
  headerNames:string[];

  constructor( 
    private databaseUsersService:DatabaseUsersService
    , private databaseShippingsService:DatabaseShippingsService
    , private activatedRoute: ActivatedRoute
    , public snackBar: MatSnackBar
    , private router: Router) {
      this.isFlatRate = true;
    }

  ngOnInit() {
    this.headerNames = getHeaderNames(this.headers);
    this.databaseUsersService.getProfile().subscribe ( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.activatedRoute.paramMap.subscribe(params => {
          this.paramId = params.get('id');
          this.mode = params.get('mode');
          this.entries = [];
          if(this.mode == 'update')
            this.prepareShipMethodUpdate(this.paramId);
          else{
            if(this.mode =='add')
              this.prepareShipMethodAdd(this.paramId);
            else{
              ;
            }
          }
        });
      }
    });
  }

  loadShipMethod(shipMethod){
    this.isFlatRate = shipMethod['isFlatRate'];
    this.flatRatePrice = shipMethod['flatRatePrice'];
    if(!this.isFlatRate)
      this.entries = shipMethod['ozPrice'];
  }

  prepareShipMethodUpdate(shipMethodId){
    this.databaseShippingsService.getShipMethod(shipMethodId, this.userId).subscribe((data) =>{
      if(data['success']){
        let shipMethod = data['shipMethod'];
        this.shipMethodId = shipMethod._id;

        this.shipCompanyName = shipMethod.shipCompanyName;
        this.shipMethodName = shipMethod.shipMethodName;
        this.description = shipMethod['description'];
        this.imgUrl = shipMethod['imgUrl'];
        
        this.loadShipMethod(shipMethod);
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
  }

  prepareShipMethodAdd(firstShipMethodIdOfCompany){
    this.databaseShippingsService.getShipCompanyName(firstShipMethodIdOfCompany
    , this.userId).subscribe((data) =>{
      if(data['success'])
          this.shipCompanyName = data['shipCompanyName'];

      else
        openSnackbar(this.snackBar, data['msg']);
    });
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

  getNewShipMethodObject(isFlatRate, flatRatePrice, ozPrice){
    let obj = {
      _id: this.shipMethodId
      , userId: this.userId
      , shipCompanyName: this.shipCompanyName
      , shipMethodName: this.shipMethodName
      , description: this.description
      , imgUrl: this.imgUrl
      , isFlatRate: isFlatRate
      , flatRatePrice: flatRatePrice
      , ozPrice: ozPrice
    };
    return obj;
  }

  addShipMethod(newShipMethod){
    delete newShipMethod['_id'];
    this.databaseShippingsService.addShipMethod(newShipMethod).subscribe(data => {
      if(data['success'])
        this.addSuccessResponse("Add successful: " + data['msg']);
      else
        openSnackbar(this.snackBar, `Add failed: ${data['msg']}`);
    });
  }

  ///The add is currently connected, but edit needs companyId
  onSubmit(){
    let newShipMethod;
    if(this.isFlatRate)
      newShipMethod = this.getNewShipMethodObject(this.isFlatRate, this.flatRatePrice, null);
    else{
      let processedEntries = getProcessedEntries(this.entries);
      newShipMethod = this.getNewShipMethodObject(this.isFlatRate, null, processedEntries);
    }
    if(this.mode == "update")
      this.updateShipMethod(this.paramId, newShipMethod)
    else
      this.addShipMethod(newShipMethod);
  }

  addSuccessResponse(msg){
    this.router.navigate(['/shippings']);
    openSnackbar(this.snackBar, msg);
  }

  
  
  initiateNewShipCompany(){
    this.shipCompanyName = this.newShipCompanyName;
  }
}
