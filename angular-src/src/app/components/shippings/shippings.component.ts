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
  shippings:Object;

  constructor(private databaseUsersService:DatabaseUsersService
    , private databaseShippingsService:DatabaseShippingsService) { }


  setData(data){
    this.shippings = data['shippings'];
    console.log(this.shippings)
  }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId = data['_id'];
        this.databaseShippingsService.getShippings(this.userId).subscribe((data) =>{
          this.setData(data);
        });
      }
    });
  }

}
