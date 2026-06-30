import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit {

  wishlistItems: any[] = [];
  currentUser: any;
  isLoading = true;
  errorMsg = '';

  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private cdr: ChangeDetectorRef  // ← add this
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!this.currentUser) {
      this.errorMsg = 'Please login to view wishlist.';
      this.isLoading = false;
      return;
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadWishlist();
    });

    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist(this.currentUser.id).subscribe({
      next: (data: any) => {
        this.wishlistItems = [...data];  // ← spread to force new reference
        this.isLoading = false;
        this.cdr.detectChanges();        // ← force re-render
        console.log('Wishlist loaded:', this.wishlistItems);
      },
      error: (err: any) => {
        console.error('Wishlist load error:', err);
        this.errorMsg = 'Failed to load wishlist.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeWishlist(id: number): void {
    this.wishlistService.removeWishlist(id).subscribe({
      next: () => { this.loadWishlist(); },
      error: (err) => { console.error(err); }
    });
  }
}