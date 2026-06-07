import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  cartItems: any[] = [];

  recommendations: string[] = [];

  currentUser: any = null;

  name = '';
  price = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.currentUser =
      JSON.parse(localStorage.getItem('user') || 'null');

    this.loadProducts();
    this.loadCart();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('GET Error:', err);
      }
    });
  }

  loadCart() {

  if (!this.currentUser) {
    return;
  }

  this.cartService
    .getCart(this.currentUser.id)
    .subscribe({
      next: (data: any) => {
        this.cartItems = data;
      },
      error: (err) => {
        console.error('Cart Load Error:', err);
      }
    });
}

  addProduct() {
    const product = {
      name: this.name,
      price: this.price
    };

    this.productService.addProduct(product).subscribe({
      next: () => {
        this.loadProducts();

        this.name = '';
        this.price = 0;
      },
      error: (err) => {
        console.error('POST Error:', err);
      }
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('DELETE Error:', err);
      }
    });
  }

  addToCart(productId: number, productName: string) {

  if (!this.currentUser) {
    alert('Please login first');
    return;
  }

  this.cartService
    .addToCart(
      this.currentUser.id,
      productId
    )
    .subscribe({
      next: () => {

        this.loadCart();

        this.showRecommendations(
          productName
        );
      },
      error: (err) => {
        console.error('Cart Error:', err);
      }
    });
}

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id)
      .subscribe({
        next: () => {
          this.loadCart();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  showRecommendations(productName: string) {
    this.productService
      .getRecommendations(productName)
      .subscribe({
        next: (data: any) => {
          this.recommendations = data;
        },
        error: (err) => {
          console.error('Recommendation Error:', err);
        }
      });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) =>
        total + (item.product?.price || 0) * item.quantity,
      0
    );
  }

  logout() {

    localStorage.removeItem('user');

    window.location.href = '/login';
  }
}