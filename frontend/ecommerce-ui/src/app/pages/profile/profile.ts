import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  currentUser: any;
  newName = '';
  successMsg = '';
  errorMsg = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    this.newName = this.currentUser?.name || '';
  }

  updateName(): void {
    if (!this.newName.trim()) {
      this.errorMsg = 'Name cannot be empty.';
      return;
    }

    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.authService.updateName(this.currentUser.id, this.newName).subscribe({
      next: (res: any) => {
        this.currentUser.name = res.name;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.successMsg = '✅ Name updated successfully!';
        this.isLoading = false;

        // Reload after 1 second so navbar picks up new name
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMsg = '❌ Failed to update name.';
        this.isLoading = false;
      }
    });
  }
}