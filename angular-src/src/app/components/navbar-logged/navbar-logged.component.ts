import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'navbar-logged',
  templateUrl: './navbar-logged.component.html',
  styleUrls: ['./navbar-logged.component.css']
})
export class NavbarLoggedComponent implements OnInit {

  constructor(private databaseUsersService:DatabaseUsersService
    , private router: Router ) { }

  ngOnInit() {
  }

  onLogoutClick(event){
    event.preventDefault();
    this.databaseUsersService.logout();
    this.router.navigate(['/login']);
  }
}
