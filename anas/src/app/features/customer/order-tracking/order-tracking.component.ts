import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.scss'
})
export class OrderTrackingComponent implements OnInit {

  orderId = 'TOM-000000';
  rawDbId: number | null = null;

  customerName = '';
  phone = '';
  address = '';
  city = 'Dhaka';
  paymentMethod = 'Cash on Delivery';
  deliveryFee = 60;
  total = 0;
  restaurantName = 'Tomato Kitchen';

  currentStep = 2;
  statusLabel = 'Preparing';
  statusIcon = '🍳';
  statusHeadline = 'Your food is being prepared';
  statusDescription = 'The restaurant is carefully preparing your order.';
  estimatedArrival = '30–40 min';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const idParam = params.get('orderId');
      if (idParam) {
        this.rawDbId = Number(idParam);
        this.fetchLiveOrder(this.rawDbId);
      } else {
        this.loadFromStorage();
      }
    });
  }

  loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        if (order.id) {
          this.rawDbId = order.id;
          this.fetchLiveOrder(order.id);
          return;
        }
        this.populateOrderData(order);
      } catch {
        // fallback
      }
    } else {
      const savedOrderId = localStorage.getItem('lastOrderId');
      if (savedOrderId) {
        this.orderId = savedOrderId;
      }
    }
  }

  fetchLiveOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order: Order) => {
        this.populateOrderData(order);
      },
      error: (err) => {
        console.error('Failed to load tracking data from server:', err);
      }
    });
  }

  private populateOrderData(order: any): void {
    this.orderId = order.orderNumber || (order.id ? `#ORD-${order.id}` : 'TOM-000000');
    this.customerName = order.customerName || '';
    this.phone = order.customerPhone || order.phone || '';
    this.address = order.deliveryAddress || order.address || '';
    this.restaurantName = order.restaurantName || 'Tomato Kitchen';
    this.paymentMethod = order.paymentMethod || 'Cash on Delivery';
    this.deliveryFee = order.deliveryFee || 60;
    this.total = order.finalAmount || order.total || order.totalAmount || 0;

    const s = (order.status || '').toUpperCase();
    if (s === 'PENDING' || s === 'CONFIRMED') {
      this.currentStep = 1;
      this.statusLabel = 'Order Placed';
      this.statusIcon = '✓';
      this.statusHeadline = 'Order placed successfully';
      this.statusDescription = 'Your order has been received and confirmed by the restaurant.';
      this.estimatedArrival = '40–50 min';
    } else if (s === 'PREPARING') {
      this.currentStep = 2;
      this.statusLabel = 'Preparing';
      this.statusIcon = '🍳';
      this.statusHeadline = 'Your food is being prepared';
      this.statusDescription = 'The restaurant is carefully cooking your meal with fresh ingredients.';
      this.estimatedArrival = '30–40 min';
    } else if (s === 'READY_FOR_PICKUP' || s === 'ON_THE_WAY') {
      this.currentStep = 3;
      this.statusLabel = 'On the Way';
      this.statusIcon = '🛵';
      this.statusHeadline = 'Rider is on the way';
      this.statusDescription = 'Your delivery partner has picked up your food and is rushing towards you.';
      this.estimatedArrival = '15–20 min';
    } else if (s === 'DELIVERED') {
      this.currentStep = 4;
      this.statusLabel = 'Delivered';
      this.statusIcon = '✓';
      this.statusHeadline = 'Order Delivered';
      this.statusDescription = 'Your order has arrived. Enjoy your meal and thank you for ordering with Tomato!';
      this.estimatedArrival = 'Arrived';
    }
  }

  getStepClass(index: number): string {
    if (index < this.currentStep) {
      return 'completed';
    }
    if (index === this.currentStep) {
      return 'active';
    }
    return '';
  }
}