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

  getShipMethod(shipMethodId, userId){
    return this.httpClient.get(`/api/shippings/shipMethod/${shipMethodId}/${userId}`
    , {headers: this.normalHeader});
  }

  getShipMethods(userId){
    return this.httpClient.get(`/api/shippings/all/${userId}`, {headers: this.normalHeader});
  }

  deleteShipMethod(shipMethodId, userId){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      , body: {shipMethodId: shipMethodId, userId:userId}
    };
    return this.httpClient.delete('/api/shippings/delete', httpOptions);
  }

  updateShipMethod(shipMethodId, userId, newShipMethod){
    return this.httpClient.put('/api/shippings/update'
    , {shipMethodId:shipMethodId, userId:userId, newShipMethod:newShipMethod}
    , {headers: this.normalHeader});
  }
}
