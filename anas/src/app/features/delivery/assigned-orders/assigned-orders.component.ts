import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { ToastService } from '../../../core/services/toast.service';

type OrderStatus = 'New' | 'Accepted' | 'Active';

interface AssignedOrder {
  rawId: number;
  id: string;
  customer: string;
  restaurant: string;
  address: string;
  phone: string;
  amount: number;
  distance: string;
  payment: string;
  status: OrderStatus;
  time: string;
  items: number;
  eta: string;
}

@Component({
  selector: 'app-assigned-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './assigned-orders.component.html',
  styleUrl: './assigned-orders.component.scss'
})
export class AssignedOrdersComponent implements OnInit {

  private toastService = inject(ToastService);

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchTerm = '';

  selectedStatus:
    | 'All'
    | 'New'
    | 'Accepted'
    | 'Active' = 'All';

  orders: AssignedOrder[] = [];
  filteredOrders: AssignedOrder[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data: Order[]) => {
        // Filter out already delivered or cancelled orders from the assigned active queue
        const activeQueue = (data || []).filter(o => {
          const s = (o.status || '').toUpperCase();
          return s === 'READY_FOR_PICKUP' || s === 'READY' || s === 'ON_THE_WAY';
        });

        this.orders = activeQueue.map(order => ({
          rawId: order.id || 0,
          id: order.orderNumber ? order.orderNumber : `#ORD-${order.id}`,
          customer: order.customerName || 'Customer',
          restaurant: order.restaurantName || 'Tomato Kitchen',
          address: order.deliveryAddress || 'Dhaka',
          phone: order.customerPhone || 'N/A',
          amount: order.finalAmount || order.totalAmount || 0,
          distance: '2.5 km',
          payment: order.paymentMethod || 'Cash on Delivery',
          status: this.mapBackendStatus(order.status),
          time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
          items: order.orderItems?.length || order.itemsCount || 1,
          eta: '25 min'
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load rider orders:', err);
        this.isLoading = false;
      }
    });
  }

  private mapBackendStatus(status?: string): OrderStatus {
    const s = (status || '').toUpperCase();
    if (s === 'ON_THE_WAY') return 'Active';
    if (s === 'READY_FOR_PICKUP' || s === 'PREPARING') return 'Accepted';
    return 'New';
  }


  // =====================================================
  // SUMMARY
  // =====================================================

  get newOrdersCount(): number {
    return this.orders.filter(
      order => order.status === 'New'
    ).length;
  }


  get acceptedOrdersCount(): number {
    return this.orders.filter(
      order => order.status === 'Accepted'
    ).length;
  }


  get activeOrdersCount(): number {
    return this.orders.filter(
      order => order.status === 'Active'
    ).length;
  }


  get totalOrderValue(): number {
    return this.orders.reduce(
      (total, order) => total + order.amount,
      0
    );
  }


  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredOrders =
      this.orders.filter(order => {

        const matchesStatus =
          this.selectedStatus === 'All' ||
          order.status === this.selectedStatus;


        const matchesSearch =
          !search ||
          order.id.toLowerCase().includes(search) ||
          order.customer.toLowerCase().includes(search) ||
          order.restaurant.toLowerCase().includes(search) ||
          order.address.toLowerCase().includes(search);


        return matchesStatus && matchesSearch;
      });

  }


  setStatus(
    status:
      | 'All'
      | 'New'
      | 'Accepted'
      | 'Active'
  ): void {

    this.selectedStatus = status;

    this.applyFilters();
  }


  clearSearch(): void {

    this.searchTerm = '';

    this.applyFilters();
  }


  resetFilters(): void {

    this.searchTerm = '';

    this.selectedStatus = 'All';

    this.applyFilters();
  }


  // =====================================================
  // ACCEPT ORDER
  // =====================================================

  acceptOrder(order: AssignedOrder): void {
    if (order.status !== 'New') {
      return;
    }

    this.orderService.updateStatus(order.rawId, 'READY_FOR_PICKUP').subscribe({
      next: () => {
        order.status = 'Accepted';
        this.applyFilters();
        this.toastService.success(`Order ${order.id} accepted.`);
      },
      error: (err) => {
        console.error('Failed to accept order:', err);
        this.toastService.error('Failed to accept order. Please try again.');
      }
    });
  }

  // =====================================================
  // START DELIVERY
  // =====================================================

  startDelivery(order: AssignedOrder): void {
    if (order.status !== 'Accepted') {
      return;
    }

    this.orderService.updateStatus(order.rawId, 'ON_THE_WAY').subscribe({
      next: () => {
        order.status = 'Active';
        this.applyFilters();
        this.toastService.success(`Delivery started for ${order.id}.`);
        this.router.navigate(['/delivery/active-delivery'], {
          queryParams: {
            orderId: order.rawId
          }
        });
      },
      error: (err) => {
        console.error('Failed to start delivery:', err);
        this.toastService.error('Failed to start delivery. Please try again.');
      }
    });
  }

  // =====================================================
  // CONTINUE ACTIVE DELIVERY
  // =====================================================

  continueDelivery(order: AssignedOrder): void {
    this.router.navigate(['/delivery/active-delivery'], {
      queryParams: {
        orderId: order.rawId
      }
    });
  }


  // =====================================================
  // VIEW ORDER
  // =====================================================

  viewOrder(order: AssignedOrder): void {

    this.toastService.info(
      `Order ${order.id} · ${order.customer} · ${order.restaurant} · ${order.status}`
    );

  }


  // =====================================================
  // TRACK BY
  // =====================================================

  trackByOrderId(
    index: number,
    order: AssignedOrder
  ): string {

    return order.id;

  }

}