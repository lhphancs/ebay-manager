import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { DatabaseUsersService } from './../../services/database-users.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

class OzPrice{

}

@Component({
  selector: 'app-shippings-edit',
  templateUrl: './shippings-edit.component.html',
  styleUrls: ['./shippings-edit.component.css']
})
export class ShippingsEditComponent implements OnInit {
  shipMethodId:string;

  name:string;
  description:string;
  displayedColumns: string[] = ['select', 'oz', 'price'];
  dataSource: MatTableDataSource<OzPrice>;
  selection = new SelectionModel<OzPrice>(true, []);

  constructor(private databaseUsersService:DatabaseUsersService,
    private activatedRoute: ActivatedRoute) { }

  remove_idFromObjectsArray(objs){
    objs.forEach(element => {
      delete element._id;
    });
    return objs;
  }

  loadShipMethod(shipMethodId){
    this.databaseUsersService.getShipMethodById(shipMethodId).subscribe( (data) =>{
      let shipMethod = data['shipMethod'];
      console.log(shipMethod)
      this.name = shipMethod['name'];
      this.description = shipMethod['description'];

      let ozPrice = this.remove_idFromObjectsArray(shipMethod['ozPrice']);

      this.dataSource = new MatTableDataSource<OzPrice>(ozPrice);
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.shipMethodId = params.get('shipMethodId');
      if(this.shipMethodId){
        this.loadShipMethod(this.shipMethodId);
      }
    });
  }

}
