import { Component, OnInit } from '@angular/core';
import { DatabaseUsersService } from '../../services/database-users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  email;
  userId;
  constructor(private databaseUsersService: DatabaseUsersService) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.email = data['email'];
        this.userId = data['_id'];
      }
    });
  }

}
