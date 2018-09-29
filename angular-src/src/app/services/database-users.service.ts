import { HttpHeaders, HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class DatabaseUsersService {
  authToken;
  user;

  normalHeader;

  constructor(private httpClient: HttpClient) {
    this.loadToken();
  }

  ngOnInit() {
    this.normalHeader = new HttpHeaders();
    this.normalHeader.append('Content-Type', 'application/json');
  }

  auth(email, password){
    return this.httpClient.post('/api/users/auth'
      , {email: email, password: password}, {headers: this.normalHeader});
  }

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  addUser(user){
    return this.httpClient.post('/api/users/add'
    , user, {headers: this.normalHeader});
  }

  updatePassword(userId, formValues){
    return this.httpClient.patch('/api/users/update-password'
    , {userId: userId, formValues:formValues}, {headers: this.normalHeader});
  }

  updateEbayAppId(userId, ebayAppId){
    return this.httpClient.patch('/api/users/update-ebay-key'
    , {userId: userId, ebayAppId:ebayAppId}, {headers: this.normalHeader});
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
    return this.httpClient.get(`/api/users/fees/${userId}`
    , {headers: this.normalHeader});
  }

  updateFees(userId, newFees){
    return this.httpClient.put('/api/users/fees/update'
    , {userId: userId, newFees: newFees}, {headers: this.normalHeader});
  }
}