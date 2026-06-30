import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private apiUrl =
    'http://localhost:5006/api/activity';

  constructor(
    private http: HttpClient
  ) {}

  track(data: any) {

    return this.http.post(
      this.apiUrl,
      data
    );

  }
}