import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { filter } from 'rxjs/operators';

import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  cartCount = 0;
  isLoggedIn = false;
  userRole = '';
  isSearchOpen = false;
  searchQuery = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Check login status when navbar loads
    this.updateAuthState();

    // Update cart count
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });

    // Check login status whenever route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateAuthState();
        this.isSearchOpen = false;
      });
  }

  private updateAuthState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role || '';
  }

  get dashboardLink(): string {
    if (this.userRole === 'admin') return '/admin/orders';
    if (this.userRole === 'restaurant') return '/restaurant/orders';
    if (this.userRole === 'rider') return '/delivery/assigned-orders';
    return '/orders';
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  onNavbarSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/food'], { queryParams: { search: this.searchQuery.trim() } });
      this.isSearchOpen = false;
      this.searchQuery = '';
    }
  }

  logout(): void {

    this.authService.logout();

    this.isLoggedIn = false;
    this.userRole = '';

    this.router.navigate(['/']);
  }
}
