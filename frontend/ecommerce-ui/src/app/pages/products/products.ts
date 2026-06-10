import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { DashboardService } from '../../services/dashboard';

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
  wishlistItems:any[] = [];
  recommendations: string[] = [];
  dashboard: any = {};
  users: any[] = [];
  currentUser: any = null;
  isAdmin = false;
  adminProducts: any[] = [];

  adminCartItems: any[] = [];

  adminWishlist: any[] = [];
  name = '';
  price = 0;
  selectedView = '';
  searchText = '';

  constructor(
  private productService: ProductService,
  private cartService: CartService,
  private cdr: ChangeDetectorRef,
  private router: Router,
  private wishlistService: WishlistService,
  private dashboardService: DashboardService,
) {}

  ngOnInit(): void {

  this.currentUser =
    JSON.parse(localStorage.getItem('user') || 'null');

  this.isAdmin =
    this.currentUser?.role === 'Admin';
  if (this.isAdmin) {
  this.loadDashboard();
}  
  this.loadProducts();

  if (!this.isAdmin) {
    this.loadCart();
  }
  if (!this.isAdmin) {

  this.loadCart();

  this.loadWishlist();
}
}
showUsers() {

  this.selectedView = 'users';

  this.dashboardService
      .getUsers()
      .subscribe(data => {

        this.users = data;

      });
}

showProducts() {

  this.selectedView = 'products';

  this.dashboardService
      .getProducts()
      .subscribe(data => {

        this.adminProducts = data;

      });
}

showCartItems() {

  this.selectedView = 'cart';

  this.dashboardService
      .getCartItems()
      .subscribe(data => {

        this.adminCartItems = data;

      });
}

showWishlist() {

  this.selectedView = 'wishlist';

  this.dashboardService
      .getWishlist()
      .subscribe(data => {

        this.adminWishlist = data;

      });
}
getProductImage(productName: string): string {

  const images: any = {

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

  return images[productName] ||
         '/images/default.jpg';
}
loadDashboard() {

  this.dashboardService
      .getDashboard()
      .subscribe({

        next:(data:any)=>{

          this.dashboard = data;

        }

      });
}
goToCheckout() {

  console.log('Checkout Clicked');

  this.router.navigate(['/checkout'])
    .then(success => {
      console.log('Navigation Success:', success);
    });

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
  loadWishlist() {

  this.wishlistService
      .getWishlist(
        this.currentUser.id
      )
      .subscribe({

        next:(data:any)=>{

          this.wishlistItems =
            data;

        }
      });
}

addToWishlist(productId:number) {

  this.wishlistService
      .addToWishlist(
        this.currentUser.id,
        productId
      )
      .subscribe({

        next:()=>{

          this.loadWishlist();

        }
      });
}


  loadCart() {

  if (!this.currentUser || this.isAdmin) {
  return;
}

  this.cartService
    .getCart(this.currentUser.id)
    .subscribe({
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

  addProduct() {

  if (!this.isAdmin) {
    alert('Only Admin can add products');
    return;
  }
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

  setTimeout(() => {
    this.loadCart();
  }, 200);

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
removeWishlist(id:number) {

  this.wishlistService
      .removeWishlist(id)
      .subscribe({

        next:()=>{

          this.loadWishlist();

        }
      });
}
  filteredProducts() {

  return this.products.filter(product =>
    product.name
      .toLowerCase()
      .includes(
        this.searchText.toLowerCase()
      )
  );

}

  logout() {

    localStorage.removeItem('user');

    window.location.href = '/login';
  }
}