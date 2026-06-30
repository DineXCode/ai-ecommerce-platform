import { Routes } from '@angular/router';

import { ProductsComponent } from './pages/products/products';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { CheckoutComponent } from './pages/checkout/checkout';
import { ProductDetailsComponent } from './pages/product-details/product-details';
import { ProfileComponent } from './pages/profile/profile';
import { CartComponent } from './pages/cart/cart';
import { WishlistComponent } from './pages/wishlist/wishlist';
import { OrdersComponent } from './pages/orders/orders';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductsComponent },

  { path: 'product/:id', component: ProductDetailsComponent },

  { path: 'checkout', component: CheckoutComponent },

  { path: 'cart', component: CartComponent },

  { path: 'wishlist', component: WishlistComponent },

  { path: 'orders', component: OrdersComponent },
  

// add inside routes array:
{ path: 'profile', component: ProfileComponent }

];