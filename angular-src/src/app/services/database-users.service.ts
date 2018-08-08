import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class DatabaseUsersService {
  authToken;
  user;

  constructor(private httpClient: HttpClient) {
    this.loadToken();
  }

  auth(email, password){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/users/auth'
      , {email: email, password: password}, {headers: headers});
  }

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  addUser(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/users/add'
    , user, {headers: headers});
  }

  loadToken(){
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  getProfile(){
    this.loadToken();
    let headers = new HttpHeaders({'Authorization':this.authToken
      , 'Content-Type':'application/json'});
    return this.httpClient.get('/api/users/profile', {headers: headers})
  }

  loggedIn(){
    if(this.authToken){
      const jwtHelper = new JwtHelperService();
      return !jwtHelper.isTokenExpired(this.authToken);
    }
    return false;
}

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  
  getFees(userId){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`/api/users/fees/${userId}`
    , {headers: headers});
  }

  updateFees(userId, newFees){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.put('/api/users/fees/update'
    , {userId: userId, newFees: newFees}, {headers: headers});
  }
}
