import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseUsersService {

  constructor(private httpClient: HttpClient) { }

  addUser(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('http://localhost:3000/api/users/add'
    , user, {headers: headers});
  }
}
