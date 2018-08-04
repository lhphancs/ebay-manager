import { DatabaseUsersService } from '../../services/database-users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Component, OnInit } from '@angular/core';
import { openSnackbar } from '../snackbar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private databaseUsersService: DatabaseUsersService
    , public snackBar: MatSnackBar
    , private router: Router) { }

  ngOnInit() {
    if(this.databaseUsersService.loggedIn())
      this.router.navigate(['/database/products']);
  }

  onSubmit(userForm){
    let formValues = userForm.value;
    if(formValues['password'] != formValues['confirm-password'])
      openSnackbar(this.snackBar, "Passwords do not match. Try again");
    else{
      delete formValues['confirm-password'];
      this.databaseUsersService.addUser(formValues).subscribe(data => {
        if(data['success'])
          this.router.navigate(['/database']);
        else
          openSnackbar(this.snackBar, `Failed to register user: ${data['msg']}`);
      });
    }
  }
}
