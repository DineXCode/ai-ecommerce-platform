import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl =
    'http://localhost:5006/api/dashboard';

  constructor(
    private http: HttpClient
  ) {}

  getDashboard() {
    return this.http.get<any>(
      this.apiUrl
    );
  }

  getUsers() {
    return this.http.get<any[]>(
      `${this.apiUrl}/users`
    );
  }

  getProducts() {
    return this.http.get<any[]>(
      `${this.apiUrl}/products`
    );
  }

  getCartItems() {
    return this.http.get<any[]>(
      `${this.apiUrl}/cartitems`
    );
  }

  getWishlist() {
    return this.http.get<any[]>(
      `${this.apiUrl}/wishlist`
    );
  }
}