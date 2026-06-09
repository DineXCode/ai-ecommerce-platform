import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {

  cartItems: any[] = [];

  currentUser: any;

  name = '';
  mobile = '';
  address = '';
  pincode = '';

  constructor(
  private cartService: CartService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {

    this.currentUser =
      JSON.parse(
        localStorage.getItem('user') || 'null'
      );

    this.loadCart();
  }

  loadCart() {

  console.log('Current User:', this.currentUser);

  this.cartService
    .getCart(this.currentUser.id)
    .subscribe({
      next: (data: any) => {

        console.log('Checkout Cart Data:', data);

        this.cartItems = [...data];
        this.cdr.detectChanges();
        console.log('Checkout Items:', this.cartItems);
      },
      error: (err) => {
        console.error('Checkout Error:', err);
      }
    });
}

  getTotalPrice(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total +
        (item.product?.price || 0)
        * item.quantity,
      0
    );
  }

  placeOrder() {

    if (
      !this.name ||
      !this.mobile ||
      !this.address ||
      !this.pincode
    ) {
      alert('Please fill all fields');
      return;
    }

    alert(
      '🎉 Order Placed Successfully!'
    );
  }
}