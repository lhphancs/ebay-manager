import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EbayService {

  constructor(private httpClient: HttpClient) { }

  getListings(userId){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/ebay/listings'
    , {userId:userId}, {headers: headers});
  }
}
