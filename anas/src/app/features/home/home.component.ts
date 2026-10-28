import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Food } from '../../models/food.model';
import { Restaurant } from '../../models/restaurant.model';
import { ImageUrlPipe } from '../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ImageUrlPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private foodService = inject(FoodService);
  private restaurantService = inject(RestaurantService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  featuredFoods: Food[] = [];
  popularRestaurants: Restaurant[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.isLoading = true;
    this.foodService.getAll().subscribe({
      next: (foods) => {
        this.featuredFoods = (foods && foods.length > 0) ? foods.slice(0, 4) : this.getDefaultFoods();
        this.isLoading = false;
      },
      error: () => {
        this.featuredFoods = this.getDefaultFoods();
        this.isLoading = false;
      }
    });

    this.restaurantService.getAll().subscribe({
      next: (restaurants) => {
        this.popularRestaurants = (restaurants && restaurants.length > 0) ? restaurants.slice(0, 4) : this.getDefaultRestaurants();
      },
      error: () => {
        this.popularRestaurants = this.getDefaultRestaurants();
      }
    });
  }

  addToCart(food: Food): void {
    this.cartService.addToCart({
      id: food.id || Math.floor(Math.random() * 10000),
      name: food.name,
      price: food.price,
      image: food.image || food.icon || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
      restaurant: food.restaurantName || 'Tomato Kitchen'
    });
    this.toastService.success(`${food.name} added to cart!`);
    this.router.navigate(['/cart']);
  }

  private getDefaultFoods(): Food[] {
    return [
      { id: 1, name: 'Classic Beef Burger', price: 350, category: 'Burger', restaurantName: 'Tomato Kitchen', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', available: true, description: 'Juicy beef patty with special sauce' },
      { id: 2, name: 'Italian Cheese Pizza', price: 680, category: 'Pizza', restaurantName: 'Pizza House', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', available: true, description: 'Loaded with beef pepperoni and mozzarella' },
      { id: 3, name: 'Special Chicken Biryani', price: 280, category: 'Biryani', restaurantName: 'Biryani Express', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', available: true, description: 'Traditional aromatic chicken biryani' },
      { id: 4, name: 'Creamy White Pasta', price: 420, category: 'Pasta', restaurantName: 'Pasta Italiano', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600', available: true, description: 'Rich white sauce pasta with herbs' }
    ];
  }

  private getDefaultRestaurants(): Restaurant[] {
    return [
      { id: 1, name: 'Food Village', category: 'Fast Food, Burgers', rating: 4.8, imageUrls: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'], status: 'Active' },
      { id: 2, name: 'Pizza House', category: 'Italian, Pizza', rating: 4.6, imageUrls: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'], status: 'Active' },
      { id: 3, name: 'Chicken Corner', category: 'Fried Chicken, Fast Food', rating: 4.7, imageUrls: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800'], status: 'Active' },
      { id: 4, name: 'Biryani Express', category: 'Desi, Biryani', rating: 4.9, imageUrls: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'], status: 'Active' }
    ];
  }
}
