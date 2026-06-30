import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5006/api/auth';

  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post(
      `${this.apiUrl}/register`,
      user
    );
  }
  updateName(userId: number, newName: string) {
  return this.http.put('http://localhost:5006/api/auth/update-name', {
    userId,
    newName
  });
}
  login(user: any) {
    return this.http.post(
      `${this.apiUrl}/login`,
      user
    );
  }
}