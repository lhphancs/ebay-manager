import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private httpClient: HttpClient) { }

  addProduct(product){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('http://localhost:3000/api/products/add'
    , product, {headers: headers});
  }

  getProducts(){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get('http://localhost:3000/api/products/'
    , {headers: headers});
  }

  deleteProducts(UPCs){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: {UPCs: UPCs}
    };
    return this.httpClient.delete('http://localhost:3000/api/products/delete'
    , httpOptions);
  }
}
