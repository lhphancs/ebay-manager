import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseShippingsService {

  constructor(private httpClient:HttpClient) { }

  getShipCompanies(userId){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`/api/users/ship-companies/${userId}`
    , {headers: headers});
  }
}
