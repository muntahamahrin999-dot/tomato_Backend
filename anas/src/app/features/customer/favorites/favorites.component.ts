import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

interface FavoriteFood {
  id: number;
  name: string;
  price: number;
  image: string;
  restaurant: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

  private readonly STORAGE_KEY = 'tomato_customer_favorites';

  private readonly defaultFavorites: FavoriteFood[] = [
    {
      id: 101,
      name: 'Classic Beef Burger',
      price: 350,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
      restaurant: 'Tomato Kitchen',
      category: 'Burger',
      description: 'Juicy beef patty with fresh vegetables and special sauce.'
    },
    {
      id: 102,
      name: 'Chicken Pizza',
      price: 680,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
      restaurant: 'Pizza House',
      category: 'Pizza',
      description: 'Loaded chicken pizza with cheese and fresh toppings.'
    },
    {
      id: 103,
      name: 'Chicken Biryani',
      price: 280,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
      restaurant: 'Biryani Express',
      category: 'Biryani',
      description: 'Traditional aromatic chicken biryani with flavorful rice.'
    }
  ];

  favorites: FavoriteFood[] = [];

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {
    this.favorites = this.loadFromStorage();
  }

  private loadFromStorage(): FavoriteFood[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.error('Failed to load favorites from storage', e);
      }
    }
    return [...this.defaultFavorites];
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
      } catch (e) {
        console.error('Failed to save favorites to storage', e);
      }
    }
  }

  addToCart(food: FavoriteFood): void {

    this.cartService.addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      restaurant: food.restaurant
    });

    this.toastService.success(`${food.name} added to cart.`);
  }

  removeFavorite(id: number): void {

    this.favorites = this.favorites.filter(
      food => food.id !== id
    );

    this.saveToStorage();
    this.toastService.info('Removed from favorites.');
  }
}
