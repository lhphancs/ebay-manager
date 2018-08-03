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

  constructor(private databaseUserService:DatabaseUsersService
    , private router: Router) { }

  ngOnInit() {
  }

  onSubmit(loginForm){
    let formValues = loginForm.value;
    this.databaseUserService.auth(formValues['email']
      , formValues['password']).subscribe( (data) =>{
        if(data['success']){
          this.databaseUserService.storeUserData(data['token'], data['user']);
          this.router.navigate(['database']);
        }
          
        else
          this.errorMsg = data['msg'];
    });
  }
}
