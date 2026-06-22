import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ProductsComponent } from './pages/products/products';
import { CheckoutComponent } from './pages/checkout/checkout';
import { ProductDetailsComponent } from './pages/product-details/product-details';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'products',
    component: ProductsComponent
  },

  {
    path: 'checkout',
    component: CheckoutComponent
  },

  {
    path: 'hello',
    component: ProductsComponent
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent
  }
];