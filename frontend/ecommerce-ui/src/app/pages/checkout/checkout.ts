import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { Router } from '@angular/router';

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
  orderNumber = '';
  orderPlaced = false;
  paymentMethod = 'COD';

  constructor(
  private cartService: CartService,
  private router: Router,
  private orderService: OrderService
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
        console.log('Checkout Items:', this.cartItems);
      },
      error: (err: any) => {
        console.error('Checkout Error:', err);
      }
    });
}
removeFromCheckout(cartItemId: number): void {

  this.cartService.removeFromCart(cartItemId).subscribe({

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

  this.orderService.placeOrder(
    this.currentUser.id,
    this.paymentMethod
)
.subscribe({

      next: (response: any) => {

        this.orderPlaced = true;

        this.orderNumber = response.orderNumber;

        alert(
          `🎉 Order Placed Successfully!\n\nOrder Number: ${response.orderNumber}`
        );

        this.loadCart();

      },

      error: (err) => {

        console.error(err);

        alert(err.error);

      }

    });

}
}