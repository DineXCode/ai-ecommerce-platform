import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  currentUser: any;
  isLoading = true;
  errorMsg = '';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!this.currentUser) {
      this.errorMsg = 'Please login to view orders.';
      this.isLoading = false;
      return;
    }

    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders(this.currentUser.id).subscribe({
      next: (data: any) => {
        this.orders = [...data];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Orders load error:', err);
        this.errorMsg = 'Failed to load orders.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':    return 'bg-warning text-dark';
      case 'Confirmed':  return 'bg-info text-dark';
      case 'Shipped':    return 'bg-primary';
      case 'Delivered':  return 'bg-success';
      case 'Cancelled':  return 'bg-danger';
      default:           return 'bg-secondary';
    }
  }
}