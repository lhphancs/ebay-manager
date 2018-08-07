import { MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMsg = null;

  constructor(private databaseUsersService:DatabaseUsersService
    , private router: Router) { }

  ngOnInit() {
    if(this.databaseUsersService.loggedIn())
      this.router.navigate(['/products/display']);
  }

  onSubmit(loginForm){
    let formValues = loginForm.value;
    this.databaseUsersService.auth(formValues['email']
      , formValues['password']).subscribe( (data) =>{
        if(data['success']){
          this.databaseUsersService.storeUserData(data['token'], data['user']);
          this.router.navigate(['database']);
        }
          
        else
          this.errorMsg = data['msg'];
    });
  }
}
