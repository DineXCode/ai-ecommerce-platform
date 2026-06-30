import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { ActivityService } from '../../services/activity'; // ✅ Added missing import

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html'
})
export class ProductDetailsComponent implements OnInit {

  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private activityService: ActivityService, // ✅ Added missing injection
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(id).subscribe({
      next: (data: any) => {
        console.log('PRODUCT RECEIVED:', data);
        this.product = data;
        this.cdr.detectChanges();

        // ✅ Moved inside next callback — was outside subscribe before
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
          this.activityService.track({
            userId: user.id,
            productId: data.id,
            actionType: 'VIEW'
          }).subscribe();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // ─── Cart ─────────────────────────────────────────────────────────────────

  addToCart(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) {
      alert('Please Login');
      return;
    }

    this.cartService.addToCart(user.id, this.product.id).subscribe({
      next: () => {
        alert('Added to Cart');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  buyNow(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) {
      alert('Please Login');
      return;
    }

    this.cartService.addToCart(user.id, this.product.id).subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      }
    });
  }
}