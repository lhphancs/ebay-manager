import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseUsersService {

  constructor(private httpClient: HttpClient) { }

  auth(email, password){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/users/auth'
      , {email: email, password: password}, {headers: headers});
  }

  addUser(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/users/add'
    , user, {headers: headers});
  }

  
}
