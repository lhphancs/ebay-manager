import { DatabaseUsersService } from './../../services/database-users.service';
import { DatabaseShippingsService } from './../../services/database-shippings.service';
import { Component, OnInit } from '@angular/core';

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
    , private databaseShippingsService:DatabaseShippingsService) { }


  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.databaseShippingsService.getShipCompanies(this.userId).subscribe((data) =>{
          this.shipCompanies = data['shipCompanies'];
        });
      }
    });
  }

}
