import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})

export class CartComponent implements OnInit {

  cartItems:any[]=[];

  currentUser:any;

  constructor(
    private cartService:CartService,
    private router:Router,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {

  console.log("CartComponent Loaded");

  this.currentUser = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  console.log("Current User:", this.currentUser);

  this.loadCart();

}
hasOutOfStockItems(): boolean {
  return this.cartItems.some(
    item => item.product?.stockQuantity === 0
  );
}
loadCart() {

  console.log("Current User:", this.currentUser);

  this.cartService.getCart(this.currentUser.id).subscribe({

    next: (data: any) => {

      console.log("Cart API Response:", data);

      this.cartItems = [...data];

      this.cdr.detectChanges();

    },

    error: (err: any) => {

      console.error(err);

    }

  });

}

  removeFromCart(id:number){

    this.cartService
      .removeFromCart(id)
      .subscribe(()=>{

        this.loadCart();

      });

  }

  getTotalPrice(){

    return this.cartItems.reduce(

      (total,item)=>

        total+

        item.product.price*

        item.quantity,

      0

    );

  }

  checkout(){

    this.router.navigate(['/checkout']);

  }

}