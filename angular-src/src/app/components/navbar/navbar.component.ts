import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { Link } from '../../classesAndInterfaces/Link';

class MenuItemLink{
  icon:string;
  text:string;
  href:string;

  constructor(icon, text, href){
    this.icon=icon;
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
      new Link("Shippings", "shippings"),
      new Link("Fees", "fees")
  ];

  menuItemLinks = [
    new MenuItemLink("account_box", "Account", "account"),
    new MenuItemLink("settings", "Settings", "settings"),
    new MenuItemLink("exit_to_app", "Logout", "logout"),
  ]

  // databaseUsersService used by html to determine if user is logged in or not
  constructor(private databaseUsersService:DatabaseUsersService) { }

  ngOnInit() {
  }

}
