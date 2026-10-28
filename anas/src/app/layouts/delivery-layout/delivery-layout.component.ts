import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Subscription } from 'rxjs';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-delivery-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './delivery-layout.component.html',
  styleUrl: './delivery-layout.component.scss'
})
export class DeliveryLayoutComponent implements OnInit, OnDestroy {

  sidebarOpen = true;
  isAvailable = true;
  assignedOrdersCount = 0;
  private orderSub?: Subscription;

  private browser = false;

  private availabilityHandler = (event: Event) => {
    const customEvent = event as CustomEvent<boolean>;

    if (typeof customEvent.detail === 'boolean') {
      this.isAvailable = customEvent.detail;
    }
  };

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.browser = isPlatformBrowser(this.platformId);

    if (!this.browser) {
      return;
    }

    const savedStatus = localStorage.getItem('tomato_rider_available');

    if (savedStatus !== null) {
      this.isAvailable = savedStatus === 'true';
    }

    window.addEventListener(
      'tomato-rider-availability',
      this.availabilityHandler
    );

    this.loadAssignedCount();
  }

  loadAssignedCount(): void {
    this.orderSub = this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        const active = (orders || []).filter(o => {
          const s = (o.status || '').toUpperCase();
          return s !== 'DELIVERED' && s !== 'CANCELLED';
        });
        this.assignedOrdersCount = active.length;
      },
      error: () => {
        this.assignedOrdersCount = 0;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }

    if (!this.browser) {
      return;
    }

    window.removeEventListener(
      'tomato-rider-availability',
      this.availabilityHandler
    );
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get riderName(): string {
    return this.currentUser?.name || 'Rider';
  }

  get riderInitial(): string {
    return this.riderName.charAt(0).toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleAvailability(): void {

    this.isAvailable = !this.isAvailable;

    if (!this.browser) {
      return;
    }

    localStorage.setItem(
      'tomato_rider_available',
      String(this.isAvailable)
    );

    window.dispatchEvent(
      new CustomEvent(
        'tomato-rider-availability',
        {
          detail: this.isAvailable
        }
      )
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
