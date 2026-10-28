import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

interface DeliveryRecord {
  id: string;
  customer: string;
  restaurant: string;
  address: string;
  amount: string;
  earned: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-delivery-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-history.component.html',
  styleUrl: './delivery-history.component.scss'
})
export class DeliveryHistoryComponent implements OnInit {

  selectedFilter = 'All';
  isLoading = false;
  deliveries: DeliveryRecord[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  get filteredDeliveries(): DeliveryRecord[] {
    if (this.selectedFilter === 'Today') {
      const today = new Date().toDateString();
      return this.deliveries.filter(d => new Date(d.date).toDateString() === today);
    }
    return this.deliveries;
  }

  loadHistory(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        const delivered = (orders || []).filter(
          order => (order.status || '').toUpperCase() === 'DELIVERED'
        );

        this.deliveries = delivered
          .slice()
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .map(order => ({
            id: order.orderNumber || `#ORD-${order.id}`,
            customer: order.customerName || 'Customer',
            restaurant: order.restaurantName || 'Tomato Kitchen',
            address: order.deliveryAddress || 'Dhaka',
            amount: `৳ ${order.finalAmount || order.totalAmount || 0}`,
            earned: `৳ ${order.deliveryFee || 60}`,
            date: order.createdAt ? new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Today',
            status: 'Delivered'
          }));
        this.isLoading = false;
      },
      error: () => {
        this.deliveries = [];
        this.isLoading = false;
      }
    });
  }
}
