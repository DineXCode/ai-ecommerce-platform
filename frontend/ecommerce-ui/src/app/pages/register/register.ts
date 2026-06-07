import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {

    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(user).subscribe({
      next: () => {

        alert('Registration Successful');

        this.router.navigate(['/login']);
      },

      error: (err) => {
        console.error(err);
        alert('Registration Failed');
      }
    });
  }
}