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

    const user = {
      email: this.email,
      password: this.password
    };

    this.authService.login(user).subscribe({
      next: (response: any) => {

        // Save logged-in user
        localStorage.setItem(
          'user',
          JSON.stringify(response)
        );

        alert('Login Successful');

        this.router.navigate(['/products']);
      },

      error: () => {
        alert('Invalid Email or Password');
      }
    });
  }
}