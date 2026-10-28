import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  private cartSub!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  increaseQuantity(id: number): void {
    this.cartService.increaseQuantity(id);
  }

  decreaseQuantity(id: number): void {
    this.cartService.decreaseQuantity(id);
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  get subtotal(): number {
    return this.cartService.getCartTotal();
  }

  get deliveryFee(): number {
    return this.cartItems.length > 0 ? 60 : 0;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }
}
