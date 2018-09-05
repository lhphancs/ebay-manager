import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseShippingsService {
  normalHeader;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.normalHeader = new HttpHeaders();
    this.normalHeader.append('Content-Type', 'application/json');
  }

  getShipMethods(userId){
    return this.httpClient.get(`/api/shippings/${userId}`, {headers: this.normalHeader});
  }

  deleteShipMethod(userId, shipId){
    return this.httpClient.get(`/api/shippings/${userId}`, {headers: this.normalHeader});
  }
}
