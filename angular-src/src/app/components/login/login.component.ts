import { MatSnackBar } from '@angular/material';
import { DatabaseUsersService } from '../../services/database-users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMsg = null;

  constructor(private databaseUsersService:DatabaseUsersService
    , private router: Router) { }

  async ngOnInit() {
    this.databaseUsersService.addUser({email:'a@gmail.com', password: 'a'}).subscribe(data => {
        this.databaseUsersService.auth('a@gmail.com'
          , 'a').subscribe( (data) =>{
            if(data['success']){
              this.databaseUsersService.storeUserData(data['token'], data['user']);
              this.router.navigate(['/products']);
            }
              
            else
              this.errorMsg = data['msg'];
        });
      });
  }

  onSubmit(loginForm){
    let formValues = loginForm.value;
    this.databaseUsersService.auth(formValues['email']
      , formValues['password']).subscribe( (data) =>{
        if(data['success']){
          this.databaseUsersService.storeUserData(data['token'], data['user']);
          this.router.navigate(['/products']);
        }
          
        else
          this.errorMsg = data['msg'];
    });
  }
}
