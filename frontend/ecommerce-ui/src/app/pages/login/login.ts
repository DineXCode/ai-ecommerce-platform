import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

  const loginData = {
    email: this.email,
    password: this.password
  };

  this.authService
    .login(loginData)
    .subscribe({
      next: (res:any) => {

        localStorage.setItem(
          'token',
          res.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify({
            id: res.userId,
            name: res.name,
            role: res.role
          })
        );

        this.router.navigate(['/products']);
      },
      error: (err:any) => {
        console.error(err);
      }
    });
}
}