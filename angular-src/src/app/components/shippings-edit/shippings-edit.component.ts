import { DatabaseUsersService } from './../../services/database-users.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shippings-edit',
  templateUrl: './shippings-edit.component.html',
  styleUrls: ['./shippings-edit.component.css']
})
export class ShippingsEditComponent implements OnInit {
  shipMethodId:string;

  constructor(private databaseUsersService:DatabaseUsersService,
    private activatedRoute: ActivatedRoute) { }

  loadShipMethod(shipMethodId){
    this.databaseUsersService.getShipMethodById(shipMethodId).subscribe( (data) =>{
      console.log(data)
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
