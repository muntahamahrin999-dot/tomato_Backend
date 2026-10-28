import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-active-delivery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './active-delivery.component.html',
  styleUrl: './active-delivery.component.scss'
})
export class ActiveDeliveryComponent implements OnInit {

  private toastService = inject(ToastService);

  orderId: number | null = null;
  orderNumber = '#ORD-1050';
  customerName = 'Nusrat Jahan';
  customerPhone = '01812-456789';
  restaurantName = 'Pizza House';
  deliveryAddress = 'House 14, Road 5, Lalmatia, Dhaka';
  foodTotal = 620;
  deliveryFee = 50;
  totalAmount = 670;
  paymentMethod = 'Online Paid';
  deliveryStatus = 'Picked Up';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const idParam = params.get('orderId');
      if (idParam) {
        this.orderId = Number(idParam);
        this.loadOrderDetails(this.orderId);
      }
    });
  }

  loadOrderDetails(id: number): void {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order: Order) => {
        this.orderNumber = order.orderNumber || `#ORD-${order.id}`;
        this.customerName = order.customerName || 'Customer';
        this.customerPhone = order.customerPhone || 'N/A';
        this.restaurantName = order.restaurantName || 'Tomato Kitchen';
        this.deliveryAddress = order.deliveryAddress || 'Dhaka';
        this.foodTotal = order.totalAmount || 0;
        this.deliveryFee = order.deliveryFee || 60;
        this.totalAmount = order.finalAmount || (this.foodTotal + this.deliveryFee);
        this.paymentMethod = order.paymentMethod || 'Cash on Delivery';

        const s = (order.status || '').toUpperCase();
        if (s === 'DELIVERED') {
          this.deliveryStatus = 'Delivered';
        } else if (s === 'ON_THE_WAY') {
          this.deliveryStatus = 'On the Way';
        } else {
          this.deliveryStatus = 'Picked Up';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load order for active delivery:', err);
        this.isLoading = false;
      }
    });
  }

  updateStatus(status: string): void {
    this.deliveryStatus = status;
    if (this.orderId) {
      const backendStatus = status === 'On the Way' ? 'ON_THE_WAY' : status.toUpperCase();
      this.orderService.updateStatus(this.orderId, backendStatus).subscribe({
        next: () => this.toastService.success(`Order status updated to "${status}".`),
        error: (err) => {
          console.error('Failed to update status:', err);
          this.toastService.error('Failed to update order status.');
        }
      });
    }
  }

  callCustomer(): void {
    this.toastService.info(`Calling customer at ${this.customerPhone}...`);
  }

  completeDelivery(): void {
    if (this.orderId) {
      this.orderService.updateStatus(this.orderId, 'DELIVERED').subscribe({
        next: () => {
          this.deliveryStatus = 'Delivered';
          this.toastService.success('Delivery completed successfully!');
        },
        error: (err) => {
          console.error('Failed to mark delivered:', err);
          this.toastService.error('Failed to complete delivery. Please try again.');
        }
      });
    } else {
      this.deliveryStatus = 'Delivered';
      this.toastService.success('Delivery completed successfully!');
    }
  }
}