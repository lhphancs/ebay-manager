import { MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from './../../services/database-users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMsg = null;

  constructor(private databaseUserService:DatabaseUsersService) { }

  ngOnInit() {
  }

  onSubmit(loginForm){
    let formValues = loginForm.value;
    this.databaseUserService.auth(formValues['email']
      , formValues['password']).subscribe( (data) =>{
        if(data['success'])
          console.log("success");
        else
          this.errorMsg = data['msg'];
    });
  }
}
