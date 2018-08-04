import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {
  user:Object;

  constructor(private databaseUsersService: DatabaseUsersService) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (user) =>{
      this.user = user;
    });
  }
}
