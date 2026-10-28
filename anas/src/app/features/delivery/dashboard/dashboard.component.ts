import {
  Component,
  Inject,
  OnInit,
  inject,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { ToastService } from '../../../core/services/toast.service';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';


// ======================================================
// AVAILABLE ORDER INTERFACE
// ======================================================

interface AvailableOrder {

  id: string;

  restaurant: string;

  address: string;

  amount: string;

  distance: string;

  eta: string;

  items: string;

}


// ======================================================
// RECENT ORDER INTERFACE
// ======================================================

interface RecentOrder {

  id: string;

  customer: string;

  restaurant: string;

  address: string;

  amount: string;

  status: string;

  time: string;

}


@Component({

  selector: 'app-delivery-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './dashboard.component.html',

  styleUrl: './dashboard.component.scss'

})


export class DashboardComponent implements OnInit, OnDestroy {


  private toastService = inject(ToastService);

  private orderService = inject(OrderService);


  // ======================================================
  // TODAY
  // ======================================================

  today = new Date();


  // ======================================================
  // RIDER AVAILABILITY
  // ======================================================

  isAvailable = true;

  private browser = false;


  // ======================================================
  // AVAILABILITY EVENT
  // ======================================================

  private availabilityHandler = (event: Event): void => {

    const customEvent =
      event as CustomEvent<boolean>;

    this.isAvailable =
      !!customEvent.detail;

  };


  // ======================================================
  // AVAILABLE ORDERS
  // ======================================================

  availableOrders: AvailableOrder[] = [];

  recentOrders: RecentOrder[] = [];


  // ======================================================
  // LIVE BACKEND STATS (mock defaults, replaced on load)
  // ======================================================

  private todayDeliveries = 0;

  private completedDeliveries = 0;

  private pendingCount = 0;

  private todayEarnings = 0;


  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(

    @Inject(PLATFORM_ID)
    private platformId: Object

  ) {

    this.browser =
      isPlatformBrowser(this.platformId);


    if (this.browser) {

      const savedAvailability =
        localStorage.getItem(
          'tomato_rider_available'
        );


      // Default = Available

      this.isAvailable =
        savedAvailability !== 'false';


      // Listen for navbar status changes

      window.addEventListener(
        'riderAvailabilityChanged',
        this.availabilityHandler
      );

    }

  }


  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // ======================================================
  // LOAD DASHBOARD DATA
  // ======================================================

  loadDashboard(): void {

    this.orderService.getAllOrders().subscribe({

      next: (orders: Order[]) =>

        this.applyBackendData(orders || []),

      error: (err) => {
        console.error('Failed to load delivery dashboard data:', err);
        this.todayDeliveries = 0;
        this.completedDeliveries = 0;
        this.pendingCount = 0;
        this.todayEarnings = 0;
        this.availableOrders = [];
        this.recentOrders = [];
      }

    });

  }


  private applyBackendData(orders: Order[]): void {

    const statusOf = (order: Order) =>
      (order.status || '').toUpperCase();

    const delivered = orders.filter(
      order => statusOf(order) === 'DELIVERED'
    );

    const pending = orders.filter(order => {

      const status = statusOf(order);

      return status === 'READY_FOR_PICKUP' || status === 'READY';

    });

    const today = new Date().toDateString();

    const deliveredToday = delivered.filter(order =>
      order.createdAt
        ? new Date(order.createdAt).toDateString() === today
        : false
    );

    this.todayDeliveries =
      deliveredToday.length || delivered.length;

    this.completedDeliveries = delivered.length;

    this.pendingCount = pending.length;

    this.todayEarnings = delivered.reduce(
      (sum, order) => sum + (order.deliveryFee || 0),
      0
    );

    this.availableOrders = pending
      .slice(0, 5)
      .map(order => this.mapAvailableOrder(order));

    this.recentOrders = orders
      .slice()
      .sort((a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5)
      .map(order => this.mapRecentOrder(order));

  }


  private mapAvailableOrder(order: Order): AvailableOrder {

    return {

      id: order.orderNumber || `#ORD-${order.id}`,

      restaurant: order.restaurantName || 'Tomato Kitchen',

      address: order.deliveryAddress || 'Dhaka',

      amount: `৳ ${(order.finalAmount || order.totalAmount || 0).toLocaleString()}`,

      distance: '2.5 km',

      eta: '25 min',

      items: `${order.orderItems?.length || order.itemsCount || 1} items`

    };

  }


  private mapRecentOrder(order: Order): RecentOrder {

    return {

      id: order.orderNumber || `#ORD-${order.id}`,

      customer: order.customerName || 'Customer',

      restaurant: order.restaurantName || 'Tomato Kitchen',

      address: order.deliveryAddress || 'Dhaka',

      amount: `৳ ${(order.finalAmount || order.totalAmount || 0).toLocaleString()}`,

      status: this.mapStatusLabel(order.status),

      time: order.createdAt
        ? new Date(order.createdAt).toLocaleTimeString(
            [],
            { hour: '2-digit', minute: '2-digit' }
          )
        : 'Recent'

    };

  }


  private mapStatusLabel(status?: string): string {

    switch ((status || '').toUpperCase()) {

      case 'DELIVERED':
        return 'Delivered';

      case 'ON_THE_WAY':
        return 'On the Way';

      case 'READY_FOR_PICKUP':
      case 'PREPARING':
      case 'CONFIRMED':
        return 'Picked Up';

      case 'ACCEPTED':
        return 'Accepted';

      default:
        return 'Pending';

    }

  }


  // ======================================================
  // AVAILABLE ORDER COUNT
  // ======================================================

  get availableOrderCount(): number {

    return this.availableOrders.length;

  }


  // ======================================================
  // DASHBOARD STATS
  // ======================================================

  get stats() {

    return [

      {
        title: 'Today Deliveries',

        value: this.todayDeliveries.toString(),

        icon: '🛵',

        change: '+3 today',

        type: 'delivery'

      },

      {
        title: 'Completed',

        value:
          this.completedDeliveries
            .toString()
            .padStart(2, '0'),

        icon: '✓',

        change: `${this.completionRate}% completed`,

        type: 'completed'

      },

      {
        title: 'Pending Orders',

        value:
          this.pendingCount
            .toString()
            .padStart(2, '0'),

        icon: '📦',

        change:
          this.isAvailable
            ? 'Need action'
            : 'Currently unavailable',

        type: 'pending'

      },

      {
        title: "Today's Earnings",

        value: `৳ ${this.todayEarnings.toLocaleString()}`,

        icon: '৳',

        change: '+18% from yesterday',

        type: 'earnings'

      }

    ];

  }


  get completionRate(): number {

    if (!this.todayDeliveries) {

      return 0;

    }

    return Math.round(
      (this.completedDeliveries / this.todayDeliveries) * 100
    );

  }


  // ======================================================
  // ACCEPT ORDER
  // ======================================================

  acceptOrder(order: AvailableOrder): void {


    // Rider unavailable

    if (!this.isAvailable) {

      this.toastService.warning(
        'You are currently unavailable. Please set your status to Available first.'
      );

      return;

    }


    // Remove accepted order

    this.availableOrders =
      this.availableOrders.filter(
        item => item.id !== order.id
      );


    // Add accepted order to Recent Orders

    this.recentOrders.unshift({

      id: order.id,

      customer: 'New Customer',

      restaurant: order.restaurant,

      address: order.address,

      amount: order.amount,

      status: 'Accepted',

      time: 'Just now'

    });

  }


  // ======================================================
  // ORDER STATUS CLASS
  // ======================================================

  getStatusClass(status: string): string {

    switch (status) {

      case 'Delivered':
        return 'delivered';

      case 'On the Way':
        return 'on-way';

      case 'Picked Up':
        return 'picked-up';

      case 'Accepted':
        return 'accepted';

      default:
        return '';

    }

  }


  // ======================================================
  // DESTROY
  // ======================================================

  ngOnDestroy(): void {

    if (this.browser) {

      window.removeEventListener(
        'riderAvailabilityChanged',
        this.availabilityHandler
      );

    }

  }

}