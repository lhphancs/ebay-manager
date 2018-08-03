import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { DatabaseUsersService } from '../services/database-users.service';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private databaseUserService: DatabaseUsersService, private router: Router){
    }

    canActivate(){
        if(this.databaseUserService.loggedIn())
            return true;
        else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}