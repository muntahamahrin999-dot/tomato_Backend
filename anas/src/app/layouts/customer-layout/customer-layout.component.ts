import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { AuthService, User } from "../../core/auth/services/auth.service";
import { CartService } from "../../services/cart.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-customer-layout",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: "./customer-layout.component.html",
  styleUrl: "./customer-layout.component.scss",
})
export class CustomerLayoutComponent implements OnInit, OnDestroy {
  user: User | null | undefined;
  cartCount = 0;
  private cartSub!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.cartCount = this.cartService.getCartCount();
    this.cartSub = this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
