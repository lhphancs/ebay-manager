import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseProductsService {

  constructor(private httpClient: HttpClient) { }

  addProduct(product){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/products/add'
    , product, {headers: headers});
  }

  addManyProducts(products){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post('/api/products/add-many'
    , {products: products}, {headers: headers});
  }

  updateProduct(oldUPC, product){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.put('/api/products/update'
    , {oldUPC: oldUPC, product: product}, {headers: headers});
  }

  getProductByUPC(productUPC){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`/api/products/info/${productUPC}`
    , {headers: headers});
  }

  getProducts(){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get('/api/products/'
    , {headers: headers});
  }

  deleteProducts(UPCs){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: {UPCs: UPCs}
    };
    return this.httpClient.delete('/api/products/delete'
    , httpOptions);
  }
}
