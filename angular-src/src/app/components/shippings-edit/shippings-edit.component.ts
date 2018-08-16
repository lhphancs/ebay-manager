import { ShippingsComponent } from './../shippings/shippings.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from './../../services/database-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { openSnackbar } from '../snackbar';
import { ShipMethod } from '../../classesAndInterfaces/shipMethod';

class OzPrice{
  oz:number;
  price: number;
}

@Component({
  selector: 'app-shippings-edit',
  templateUrl: './shippings-edit.component.html',
  styleUrls: ['./shippings-edit.component.css']
})
export class ShippingsEditComponent implements OnInit {
  userId:string;
  mode:string;
  paramId:string;

  name:string;
  description:string;
  displayedColumns: string[] = ['select', 'oz', 'price'];

  // updating dataSource.data will update entriesOzPrice
  entriesOzPrice: OzPrice[] = [{oz: null, price: null}];
  dataSource = new MatTableDataSource<OzPrice>(this.entriesOzPrice);
  selection = new SelectionModel<OzPrice>(true, []);

  constructor( 
    private databaseUsersService:DatabaseUsersService
    , private activatedRoute: ActivatedRoute
    , public snackBar: MatSnackBar
    , private router: Router) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe ( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.activatedRoute.paramMap.subscribe(params => {
          this.paramId = params.get('id');
          this.mode = params.get('mode');
          if(this.mode == 'update')
            this.prepareShipMethodUpdate(this.paramId);
        });
      }
    });
  }

  remove_idFromObjectsArray(objs){
    objs.forEach(element => {
      delete element._id;
    });
    return objs;
  }

  fillInForm(shipMethod){
    this.name = shipMethod['name'];
    this.description = shipMethod['description'];
    let ozPrice = this.remove_idFromObjectsArray(shipMethod['ozPrice']);
    this.dataSource.data = ozPrice;
    this.dataSource.data.push({oz:null, price:null});
    this.dataSource = new MatTableDataSource<OzPrice>(this.dataSource.data);
  }

  loadShipMethod(shipMethodId){
    this.databaseUsersService.getShipMethodById(shipMethodId).subscribe( (data) =>{
      let shipMethod = data['shipMethod'];
      console.log(shipMethod)

      this.fillInForm(shipMethod);
    });
  }


  prepareShipMethodUpdate(shipMethodId){
    this.databaseUsersService.getShipMethodById(shipMethodId).subscribe((data) =>{
      if(data['success']){
        if(data['shipMethod'])
          this.fillInForm(data['shipMethod']);
        else
          openSnackbar(this.snackBar, "Error: Ship Method Id not found in database");
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isFilledLastEntry(): boolean{
    let data = this.dataSource.data;

    let lastEntryIndex = data.length-1;
    let isLastOzFilled = !(data[lastEntryIndex].oz == null);
    let isLastPriceFilled = !(data[lastEntryIndex].price == null);
    return isLastOzFilled || isLastPriceFilled;
  }

  addBlankEntryIfNeeded(): void{
    if(this.dataSource.data.length <= 0 || this.isFilledLastEntry()){
      this.dataSource.data.push({oz:null, price:null});
      this.dataSource = new MatTableDataSource<OzPrice>(this.dataSource.data);
    }  
  }

  removeSelectedRows(){
    this.selection.selected.forEach(item => {
      let index: number = this.dataSource.data.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource<OzPrice>(this.dataSource.data);
    });
    this.addBlankEntryIfNeeded();
    this.selection = new SelectionModel<OzPrice>(true, []);
  }
  
  isEmptyStringField(value){
    if(value == null) return true;
      return value.trim() == "";
  }

  isEmptyEntry(entry){
    return this.isEmptyStringField(entry.ASIN)
      && entry.packAmt == null && this.isEmptyStringField(entry.preparation);
  }

  isCompleteEntry(entry){
    return !this.isEmptyStringField(entry.ASIN)
      && entry.packAmt != null && !this.isEmptyStringField(entry.preparation);
  }


  updateProduct(shipMethodId, newShipMethod){
    this.databaseUsersService.updateShipMethod(shipMethodId, newShipMethod).subscribe(data => {
      if(data['success'])
        openSnackbar(this.snackBar, `Update successful: ${data['msg']}`);
      else
        openSnackbar(this.snackBar, `Failed to add product: ${data['msg']}`);
    });
    this.router.navigateByUrl('/shippings');
  }

  //Gets all the entries. Returns null if half complete entry exist
  getEntriesOzPrice(){
    let validEntriesASIN = [];
    for(let entry of this.dataSource.data){
      if(this.isEmptyEntry(entry))
        continue;
      if( this.isCompleteEntry(entry) )
        validEntriesASIN.push(entry);
      else
        return null;
    };
    return validEntriesASIN;
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
    let processedEntriesOzPrice = this.getEntriesOzPrice();
    if(processedEntriesOzPrice == null)
      openSnackbar(this.snackBar, 'Failed to add product: Partially filled ASIN entry exists. Complete or remove the entry.');
    else{
      let newShipMethod = this.getNewShipMethodObject(processedEntriesOzPrice);
      if(this.mode == "update")
        this.updateProduct(this.paramId, newShipMethod)
      else
        this.addShipMethod(newShipMethod, form);
    }
  }

  addSuccessResponse(form){
    //Clear form completely
    this.dataSource.data = [{oz: null, price: null}];
    this.dataSource = new MatTableDataSource<OzPrice>(this.dataSource.data);
    form.resetForm();

    openSnackbar(this.snackBar, 'Successfully added ship method');
  }
}
