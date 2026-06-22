import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports:[CommonModule],
  templateUrl:'./product-details.html'
})
export class ProductDetailsComponent implements OnInit{

  product:any;

  constructor(
  private route: ActivatedRoute,
  private productService: ProductService,
  private cartService: CartService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}
buyNow() {

  const user =
    JSON.parse(
      localStorage.getItem('user') || 'null'
    );

  if (!user) {

    alert('Please Login');

    return;

  }

  this.cartService
      .addToCart(
        user.id,
        this.product.id
      )
      .subscribe({

        next: () => {

          this.router.navigate(
            ['/checkout']
          );

        }

      });

}
addToCart() {

  const user =
    JSON.parse(
      localStorage.getItem('user') || 'null'
    );

  if (!user) {

    alert('Please Login');

    return;

  }

  this.cartService
      .addToCart(
        user.id,
        this.product.id
      )
      .subscribe({

        next: () => {

          alert('Added to Cart');

        },

        error: (err) => {

          console.error(err);

        }

      });

}
  ngOnInit(){

    const id = Number(
  this.route.snapshot.paramMap.get('id')
);

this.productService
  .getProductById(id)
  .subscribe({
    next: (data: any) => {

      console.log('PRODUCT RECEIVED:', data);

      this.product = data;

      this.cdr.detectChanges();

    },
    error: (err) => {
      console.error(err);
    }
  });

  }

}