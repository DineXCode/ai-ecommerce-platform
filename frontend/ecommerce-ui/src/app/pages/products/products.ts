import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {

  products: any[] = [];

  name = '';
  price = 0;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        console.log('Products loaded:', data);

        this.products = [...data];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('GET Error:', err);
      }
    });
  }

  addProduct() {
    const product = {
      name: this.name,
      price: this.price
    };

    console.log('Sending:', product);

    this.productService.addProduct(product).subscribe({
      next: (data) => {
        console.log('Added successfully:', data);

        setTimeout(() => {
          this.loadProducts();
        }, 100);

        this.name = '';
        this.price = 0;
      },
      error: (err) => {
        console.error('POST Error:', err);
      }
    });
  }
}