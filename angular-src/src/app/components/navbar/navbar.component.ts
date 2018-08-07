import { DatabaseUsersService } from '../../services/database-users.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

class Link{
  text;
  href;

  constructor(text, href){
    this.text=text;
    this.href=href;
  }
}

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  loginRightLinks = [
      new Link("Login", "login")
    , new Link("Register", "register")
  ];

  loggedLeftLinks = [
      new Link("Amazon", "amazon"),
      new Link("eBay", "ebay")

  ];

  loggedRightLinks = [
      new Link("Products", "products"),
      new Link("Shipping", "shipping"),
      new Link("Calculator", "calculator")
  ];

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
