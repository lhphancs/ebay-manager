import { DatabaseUsersService } from '../../services/database-users.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private databaseUsersService:DatabaseUsersService
    , private router: Router) { }

  ngOnInit() {
  }

  onLogoutClick(event){
    event.preventDefault();
    this.databaseUsersService.logout();
    this.router.navigate(['/login']);
  }

}
