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

  updateebayKey(userId, ebayKey){
    return this.httpClient.patch('/api/users/update-ebay-key'
    , {userId: userId, ebayKey:ebayKey}, {headers: this.normalHeader});
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
  
  getEbaySettings(userId){
    return this.httpClient.get(`/api/users/ebay-settings/${userId}`
    , {headers: this.normalHeader});
  }

  getEbayFees(userId){
    return this.httpClient.get(`/api/users/ebay-fees/${userId}`
    , {headers: this.normalHeader});
  }

  getShopifyFees(userId){
    return this.httpClient.get(`/api/users/shopify-fees/${userId}`
    , {headers: this.normalHeader});
  }

  updateEbayFees(userId, newEbayFees){
    return this.httpClient.put('/api/users/ebay-fees/update'
    , {userId: userId, newEbayFees: newEbayFees}, {headers: this.normalHeader});
  }

  updateShopifyFees(userId, newShopifyFees){
    return this.httpClient.put('/api/users/shopify-fees/update'
    , {userId: userId, newShopifyFees: newShopifyFees}, {headers: this.normalHeader});
  }

  updateEbayAccountSettings(userId, newEbayAccountSettings){
    return this.httpClient.put('/api/users/ebay-account-settings/update'
    , {userId: userId, newEbayAccountSettings: newEbayAccountSettings}, {headers: this.normalHeader});
  }
}