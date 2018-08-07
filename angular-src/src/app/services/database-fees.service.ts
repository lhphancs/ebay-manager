import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseFeesService {

  constructor(private httpClient: HttpClient) { }

  getFees(userId){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`api/fees/${userId}`
    , {headers: headers});
  }

}
