import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:5006/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(userId: number, paymentMethod: string) {
    return this.http.post(this.apiUrl, { userId, paymentMethod });
  }

  // User orders
  getOrders(userId: number) {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  // Admin: all orders
  getAllOrders() {
    return this.http.get(this.apiUrl);
  }

  updateStatus(orderId: number, status: string) {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}