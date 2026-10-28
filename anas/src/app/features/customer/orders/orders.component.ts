import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Order as BackendOrder } from '../../../models/order.model';

interface CustomerOrder {
  rawId?: number;
  id: string;
  restaurant: string;
  items: string;
  total: number;
  date: string;
  status: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  orders: CustomerOrder[] = [];
  isLoading = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    const email = user?.email;
    const phone = user?.phone;

    this.orderService.getAllOrders(undefined, undefined, email, phone).subscribe({
      next: (data: BackendOrder[]) => {
        this.orders = (data || []).map(order => ({
          rawId: order.id,
          id: order.orderNumber ? order.orderNumber : `#ORD-${order.id}`,
          restaurant: order.restaurantName || 'Tomato Kitchen',
          items: order.orderItems && order.orderItems.length > 0
            ? order.orderItems.map(i => `${i.foodName} × ${i.quantity}`).join(', ')
            : `${order.itemsCount || 1} items`,
          total: order.finalAmount || order.totalAmount || 0,
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Today',
          status: this.formatStatus(order.status),
          paymentMethod: order.paymentMethod || 'Cash on Delivery'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user orders:', err);
        this.orders = [];
        this.isLoading = false;
      }
    });
  }

  private formatStatus(status?: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'PENDING') return 'Pending';
    if (s === 'CONFIRMED') return 'Confirmed';
    if (s === 'PREPARING') return 'Preparing';
    if (s === 'READY_FOR_PICKUP' || s === 'ON_THE_WAY') return 'On the Way';
    if (s === 'DELIVERED') return 'Delivered';
    if (s === 'CANCELLED') return 'Cancelled';
    return 'Processing';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}
