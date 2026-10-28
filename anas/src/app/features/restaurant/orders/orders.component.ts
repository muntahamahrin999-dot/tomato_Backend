import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { RiderService } from '../../../services/rider.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order } from '../../../models/order.model';
import { Rider } from '../../../models/rider.model';

interface RestaurantOrder {
  rawId: number;
  id: string;
  customer: string;
  items: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered';
  assignedRider?: string;
  selectedRiderId?: number;
}

@Component({
  selector: 'app-restaurant-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  orders: RestaurantOrder[] = [];
  riders: Rider[] = [];
  isLoading = false;
  private toastService = inject(ToastService);

  constructor(
    private orderService: OrderService,
    private riderService: RiderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadRiders();
  }

  loadRiders(): void {
    this.riderService.getAll().subscribe({
      next: (data) => {
        this.riders = data || [];
      },
      error: () => {
        this.riders = [
          { id: 1, name: 'Rahim Ahmed', email: 'rahim@delivery.com', phone: '01711122334', vehicle: 'Bike', zone: 'Gulshan', status: 'Active' },
          { id: 2, name: 'Karim Ullah', email: 'karim@delivery.com', phone: '01822334455', vehicle: 'Scooter', zone: 'Banani', status: 'Active' }
        ];
      }
    });
  }

  assignRider(order: RestaurantOrder): void {
    if (!order.selectedRiderId) {
      this.toastService.warning('Please select a rider first.');
      return;
    }
    const rider = this.riders.find(r => r.id === Number(order.selectedRiderId));
    const riderName = rider ? rider.name : 'Assigned Rider';
    order.assignedRider = riderName;
    this.toastService.success(`Order #${order.id} assigned to rider ${riderName}.`);
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = (data || []).map(order => ({
          rawId: order.id || 0,
          id: order.orderNumber ? order.orderNumber.replace('#', '') : `ORD-${order.id}`,
          customer: order.customerName || 'Customer',
          items: order.orderItems && order.orderItems.length > 0
            ? order.orderItems.map(item => `${item.foodName} × ${item.quantity}`).join(', ')
            : `${order.itemsCount || 1} items`,
          amount: order.finalAmount || order.totalAmount || 0,
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Today',
          status: this.mapBackendStatus(order.status)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load live orders:', err);
        this.orders = [];
        this.isLoading = false;
      }
    });
  }

  private mapBackendStatus(status?: string): 'Pending' | 'Preparing' | 'Ready' | 'Delivered' {
    const s = (status || '').toUpperCase();
    if (s === 'PREPARING') return 'Preparing';
    if (s === 'READY_FOR_PICKUP' || s === 'READY') return 'Ready';
    if (s === 'DELIVERED' || s === 'ON_THE_WAY') return 'Delivered';
    return 'Pending';
  }

  get pendingOrders(): number {
    return this.orders.filter(order => order.status === 'Pending').length;
  }

  get preparingOrders(): number {
    return this.orders.filter(order => order.status === 'Preparing').length;
  }

  get deliveredOrders(): number {
    return this.orders.filter(order => order.status === 'Delivered').length;
  }

  acceptOrder(order: RestaurantOrder): void {
    if (order.status === 'Pending') {
      order.status = 'Preparing';
      this.orderService.updateStatus(order.rawId, 'PREPARING').subscribe({
        next: () => {
          this.toastService.success(`Order #${order.id} accepted & set to Preparing.`);
          this.loadOrders();
        },
        error: () => {
          this.toastService.success(`Order #${order.id} accepted locally.`);
          this.loadOrders();
        }
      });
    }
  }

  markReady(order: RestaurantOrder): void {
    if (order.status === 'Preparing') {
      order.status = 'Ready';
      this.orderService.updateStatus(order.rawId, 'READY_FOR_PICKUP').subscribe({
        next: () => {
          this.toastService.success(`Order #${order.id} marked as Ready for pickup.`);
          this.loadOrders();
        },
        error: () => {
          this.toastService.success(`Order #${order.id} marked as Ready locally.`);
          this.loadOrders();
        }
      });
    }
  }

  completeOrder(order: RestaurantOrder): void {
    order.status = 'Delivered';
    this.orderService.updateStatus(order.rawId, 'DELIVERED').subscribe({
      next: () => {
        this.toastService.success(`Order #${order.id} marked as Delivered.`);
        this.loadOrders();
      },
      error: () => {
        this.toastService.success(`Order #${order.id} marked as Delivered locally.`);
        this.loadOrders();
      }
    });
  }
}
