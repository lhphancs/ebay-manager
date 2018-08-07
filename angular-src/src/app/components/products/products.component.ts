import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  userId;

  constructor(private databaseUsersService: DatabaseUsersService) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (user) =>{
      this.userId = user['_id'];
    });
  }
}
