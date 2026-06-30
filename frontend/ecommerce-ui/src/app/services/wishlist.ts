import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private apiUrl = 'http://localhost:5006/api/wishlist';

  constructor(private http: HttpClient) {}

  getWishlist(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addToWishlist(userId: number, productId: number) {
    return this.http.post(
      `${this.apiUrl}/${userId}/${productId}`,
      {}
    );
  }

  removeWishlist(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}