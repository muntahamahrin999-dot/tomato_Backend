import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  restaurant: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'tomato_cart_items';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());

  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  private loadFromStorage(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed.map(item => ({
            ...item,
            quantity: Number(item.quantity) || 1
          })) : [];
        }
      } catch (e) {
        console.error('Failed to load cart from storage', e);
        return [];
      }
    }
    return [];
  }

  private saveToStorage(items: CartItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
    this.cartItemsSubject.next(items);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: Omit<CartItem, 'quantity'>): void {
    const currentItems = [...this.cartItemsSubject.value];
    const existingItem = currentItems.find(
      cartItem => cartItem.id === item.id
    );

    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
      currentItems.push({
        ...item,
        quantity: 1
      });
    }

    this.saveToStorage(currentItems);
  }

  removeFromCart(id: number): void {
    const updatedItems = this.cartItemsSubject.value.filter(
      item => item.id !== id
    );
    this.saveToStorage(updatedItems);
  }

  increaseQuantity(id: number): void {
    const items = [...this.cartItemsSubject.value];
    const item = items.find(
      cartItem => cartItem.id === id
    );

    if (item) {
      item.quantity = (Number(item.quantity) || 1) + 1;
      this.saveToStorage(items);
    }
  }

  decreaseQuantity(id: number): void {
    const items = [...this.cartItemsSubject.value];
    const item = items.find(
      cartItem => cartItem.id === id
    );

    if (!item) {
      return;
    }

    const currentQty = Number(item.quantity) || 1;
    if (currentQty > 1) {
      item.quantity = currentQty - 1;
      this.saveToStorage(items);
    } else {
      this.removeFromCart(id);
    }
  }

  clearCart(): void {
    this.saveToStorage([]);
  }

  getCartCount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (Number(item.quantity) || 1),
      0
    );
  }

  getCartTotal(): number {
    const currentItems = this.cartItemsSubject.value;
    return currentItems.reduce(
      (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
  }
}
