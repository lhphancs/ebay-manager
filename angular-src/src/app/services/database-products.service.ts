import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseProductsService {

  constructor(private httpClient: HttpClient) { }

  addProduct(userId, newProduct){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/products/add'
    , {userId:userId, newProduct:newProduct}, {headers: headers});
  }

  addManyProducts(userId, products){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/products/add-many'
    , {userId:userId, products: products}, {headers: headers});
  }

  updateProduct(userId, oldUPC, newProduct){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.put('/api/products/update'
    , {userId:userId, oldUPC: oldUPC, newProduct: newProduct}, {headers: headers});
  }

  getProductByUPC(userId, productUPC){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`/api/products/info/${userId}/${productUPC}`
    , {headers: headers});
  }

  getProducts(userId){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`/api/products/${userId}`
    , {headers: headers});
  }

  deleteProducts(userId, UPCs){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: {userId:userId, UPCs: UPCs}
    };
    return this.httpClient.delete('/api/products/delete'
    , httpOptions);
  }
}
