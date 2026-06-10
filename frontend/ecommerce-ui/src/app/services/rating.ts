import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  apiUrl = 'http://localhost:5006/api/ratings';

  constructor(private http: HttpClient) {}

  addRating(data:any) {
    return this.http.post(
      this.apiUrl,
      data
    );
  }
}