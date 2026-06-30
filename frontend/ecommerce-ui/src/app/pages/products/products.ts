import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { DashboardService } from '../../services/dashboard';
import { RatingService } from '../../services/rating';
import { ActivityService } from '../../services/activity'; 

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  cartItems: any[] = [];
  wishlistItems: any[] = [];
  recommendations: any[] = [];
  dashboard: any = {};
  users: any[] = [];
  currentUser: any = null;
  isAdmin = false;
  adminProducts: any[] = [];
  adminCartItems: any[] = [];
  adminWishlist: any[] = [];

  name = '';
  price = 0;
  description = '';
  aboutItem = '';
  imageUrl = '';
  category = '';
  stockQuantity = 0;
  selectedView = '';
  searchText = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private dashboardService: DashboardService,
    private ratingService: RatingService,
    private activityService: ActivityService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    this.isAdmin = this.currentUser?.role === 'Admin';

    if (this.isAdmin) {
      this.loadDashboard();
    }

    this.loadProducts();

    if (!this.isAdmin) {
      this.loadCart();
      this.loadWishlist();
      this.showRecommendations(); 
    }
  }

  // ─── Dashboard (Admin) ────────────────────────────────────────────────────

  loadDashboard(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data: any) => {
        this.dashboard = data;
      }
    });
  }

  showUsers(): void {
    this.selectedView = 'users';
    this.dashboardService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  showProducts(): void {
    this.selectedView = 'products';
    this.dashboardService.getProducts().subscribe(data => {
      this.adminProducts = data;
    });
  }

  showCartItems(): void {
    this.selectedView = 'cart';
    this.dashboardService.getCartItems().subscribe(data => {
      this.adminCartItems = data;
    });
  }

  showWishlist(): void {
    this.selectedView = 'wishlist';
    this.dashboardService.getWishlist().subscribe(data => {
      this.adminWishlist = data;
    });
  }

  // ─── Products ─────────────────────────────────────────────────────────────

  loadProducts(): void {
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

  filteredProducts(): any[] {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  getProductImage(productName: string): string {
    const images: Record<string, string> = {
      'Microphone': '/images/microphone.jpg',
      'Books': '/images/books.jpg',
      'Chair': '/images/chair.jpg',
      'Table': '/images/table.jpg',
      'Laptop': '/images/laptop.jpg',
      'Phone': '/images/phone.jpg',
      'Camera': '/images/camera.jpg',
      'Keyboard': '/images/keyboard.jpg',
      'Mouse': '/images/mouse.jpg',
      'Pillow': '/images/pillow.jpg',
      'Shirts': '/images/shirt.jpg',
      'Joystick': '/images/joystick.jpg'
    };
    return images[productName] || '/images/default.jpg';
  }

  addProduct(): void {
    if (!this.isAdmin) {
      alert('Only Admin can add products');
      return;
    }

    const product = {
      name: this.name,
      price: this.price,
      description: this.description,
      aboutItem: this.aboutItem,
      imageUrl: this.imageUrl,
      category: this.category,
      stockQuantity: this.stockQuantity
    };

    this.productService.addProduct(product).subscribe({
      next: () => {
        this.loadProducts();
        this.name = '';
        this.price = 0;
        this.description = '';
        this.aboutItem = '';
        this.imageUrl = '';
        this.category = '';
        this.stockQuantity = 0;
      },
      error: (err) => {
        console.error('POST Error:', err);
      }
    });
  }

  deleteProduct(id: number): void {
    if (!this.isAdmin) {
      alert('Only Admin can delete products');
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('DELETE Error:', err);
      }
    });
  }

  saveAbout(product: any): void {
    this.productService.updateProduct(product.id, product).subscribe({
      next: () => {
        alert('About section saved');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  // ─── Cart ─────────────────────────────────────────────────────────────────

  loadCart(): void {
    if (!this.currentUser || this.isAdmin) return;

    this.cartService.getCart(this.currentUser.id).subscribe({
      next: (data: any) => {
        this.cartItems = [...data];
        this.cdr.detectChanges();
        console.log('Cart Loaded:', this.cartItems);
      },
      error: (err) => {
        console.error('Cart Load Error:', err);
      }
    });
  }

  addToCart(productId: number, productName: string): void {

  if (!this.currentUser) {
    alert('Please login first');
    return;
  }

  this.cartService.addToCart(this.currentUser.id, productId).subscribe({

    next: () => {

      alert('✅ Product added to cart successfully.');

      this.activityService.track({
        userId: this.currentUser.id,
        productId: productId,
        actionType: 'CART'
      }).subscribe();

      this.showRecommendations();

    },

    error: (err: any) => {

      console.error('Cart Error:', err);

      alert('❌ Failed to add product to cart.');

    }

  });

}

  removeFromCart(id: number): void {
    this.cartService.removeFromCart(id).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']).then(success => {
      console.log('Navigation Success:', success);
    });
  }

  // ─── wishlist section

  loadWishlist(): void {
    this.wishlistService.getWishlist(this.currentUser.id).subscribe({
      next: (data: any) => {
        this.wishlistItems = data;
      }
    });
  }

  addToWishlist(productId: number): void {
  if (!this.currentUser) {
    alert('Please login first');
    return;
  }

  this.wishlistService.addToWishlist(this.currentUser.id, productId).subscribe({
    next: () => {
      alert('❤️ Added to wishlist!');
      this.loadWishlist();
      this.activityService.track({
        userId: this.currentUser.id,
        productId: productId,
        actionType: 'WISHLIST'
      }).subscribe();
    },
    error: (err: any) => {
      console.error('Wishlist Error:', err);
      alert('❌ Failed to add to wishlist.');
    }
  });
}
// Add these properties at the top with other properties:
restockQuantities: { [productId: number]: number } = {};

// Add this method:
restock(productId: number): void {
  const qty = this.restockQuantities[productId];

  if (!qty || qty <= 0) {
    alert('Please enter a valid quantity.');
    return;
  }

  this.productService.restock(productId, qty).subscribe({
    next: (res: any) => {
      alert(`✅ Stock updated! New stock: ${res.newStock}`);
      this.restockQuantities[productId] = 0;
      this.loadProducts();
    },
    error: (err) => {
      console.error(err);
      alert('❌ Failed to update stock.');
    }
  });
}
  removeWishlist(id: number): void {
    this.wishlistService.removeWishlist(id).subscribe({
      next: () => {
        this.loadWishlist();
      }
    });
  }

  // ─── Recommendations ──────────────────────────────────────────────────────

  showRecommendations(): void {
  if (!this.currentUser) return;
  this.productService.getRecommendations(this.currentUser.id).subscribe({
    next: (data: any) => {
      this.recommendations = data;
    },
    error: (err) => {
      console.error('Recommendation Error:', err);
    }
  });
}

  // ─── Ratings ──────────────────────────────────────────────────────────────

  rateProduct(productId: number, rating: number): void {
    this.ratingService.addRating({
      userId: this.currentUser.id,
      productId: productId,
      rating: +rating
    }).subscribe({
      next: () => {
        this.loadProducts();
        alert('Rating submitted successfully');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // ─── authentcation

  logout(): void {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}