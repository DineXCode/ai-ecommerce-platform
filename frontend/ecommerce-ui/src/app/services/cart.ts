import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:5006/api/cart';

  constructor(private http: HttpClient) {}

  getCart() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToCart(productId: number) {
    return this.http.post(`${this.apiUrl}/${productId}`, {});
  }
  
  removeFromCart(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
  }
}