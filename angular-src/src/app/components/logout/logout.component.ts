import { Router } from '@angular/router';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private databaseUsersService:DatabaseUsersService
    , private router: Router) { }

  ngOnInit() {
    this.databaseUsersService.logout();
    this.router.navigate(['/login']);
  }
}
