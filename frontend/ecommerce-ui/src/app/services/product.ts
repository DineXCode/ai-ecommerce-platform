import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5006/api/products';

  constructor(private http: HttpClient) {}
  getProductById(id: number) {

  return this.http.get(
    `${this.apiUrl}/${id}`
  );

}
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }
  
updateProduct(id: number, product: any) {

  return this.http.put(
    `${this.apiUrl}/${id}`,
    product
  );

}
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getRecommendations(productName: string) {
  return this.http.get<any[]>(
    `http://localhost:5006/api/recommendations/${productName}`
  );
}

}