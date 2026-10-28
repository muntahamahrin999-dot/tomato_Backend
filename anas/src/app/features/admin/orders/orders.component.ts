import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order as BackendOrder } from '../../../models/order.model';
import { ToastService } from '../../../core/services/toast.service';

interface AdminOrder {
  rawId: number;
  id: string;
  customer: string;
  restaurant: string;
  amount: number;
  items: number;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  payment: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  private toastService = inject(ToastService);

  selectedFilter = 'All';
  searchTerm = '';
  isLoading = false;

  orders: AdminOrder[] = [];

  filters = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data: BackendOrder[]) => {
        this.orders = (data || []).map(order => ({
          rawId: order.id || 0,
          id: order.orderNumber ? order.orderNumber : `#ORD-${order.id}`,
          customer: order.customerName || 'Customer',
          restaurant: order.restaurantName || 'Tomato Kitchen',
          amount: order.finalAmount || order.totalAmount || 0,
          items: order.orderItems?.length || order.itemsCount || 1,
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Today',
          time: order.createdAt
            ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now',
          status: this.mapBackendStatus(order.status),
          payment: order.paymentStatus?.toUpperCase() === 'PAID' ? 'Paid' : 'Pending'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load admin orders:', err);
        this.isLoading = false;
      }
    });
  }

  private mapBackendStatus(status?: string): 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled' {
    const s = (status || '').toUpperCase();
    if (s === 'CONFIRMED') return 'Confirmed';
    if (s === 'PREPARING') return 'Preparing';
    if (s === 'READY_FOR_PICKUP' || s === 'ON_THE_WAY') return 'Out for Delivery';
    if (s === 'DELIVERED') return 'Delivered';
    if (s === 'CANCELLED') return 'Cancelled';
    return 'Pending';
  }

  get filteredOrders(): AdminOrder[] {
    let result = this.orders;

    if (this.selectedFilter !== 'All') {
      result = result.filter(order => order.status === this.selectedFilter);
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.trim().toLowerCase();
      result = result.filter(order =>
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.restaurant.toLowerCase().includes(q)
      );
    }

    return result;
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get pendingOrders(): number {
    return this.orders.filter(
      order => order.status === 'Pending'
    ).length;
  }

  get activeOrders(): number {
    return this.orders.filter(order =>
      ['Confirmed', 'Preparing', 'Out for Delivery']
        .includes(order.status)
    ).length;
  }

  get deliveredOrders(): number {
    return this.orders.filter(
      order => order.status === 'Delivered'
    ).length;
  }

  getStatusClass(status: string): string {
    return status
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  viewOrder(order: AdminOrder): void {
    this.toastService.info(
      `${order.id} · ${order.customer} · ${order.restaurant} · ৳${order.amount} · ${order.status}`
    );
  }
}