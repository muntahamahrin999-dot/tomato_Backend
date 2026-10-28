import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Restaurant as RestaurantModel } from '../../../models/restaurant.model';
import { RestaurantService } from '../../../services/restaurant.service';

interface Restaurant {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number | null;
  description: string;
  hours: string;
}

const DEFAULT_RESTAURANT_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900';

const MOCK_RESTAURANTS: Restaurant[] = [

  {
    id: 1,
    name: 'Tomato Kitchen',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900',
    cuisine: 'Burgers • Fast Food',
    rating: 4.8,
    deliveryTime: '25–35 min',
    deliveryFee: 60,
    description:
      'Fresh burgers, fries and delicious comfort food.',
    hours: ''
  },

  {
    id: 2,
    name: 'Pizza House',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900',
    cuisine: 'Pizza • Italian',
    rating: 4.7,
    deliveryTime: '30–40 min',
    deliveryFee: 70,
    description:
      'Cheesy pizzas prepared with fresh ingredients.',
    hours: ''
  },

  {
    id: 3,
    name: 'Biryani Express',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    cuisine: 'Biryani • Bangladeshi',
    rating: 4.9,
    deliveryTime: '25–35 min',
    deliveryFee: 50,
    description:
      'Authentic aromatic biryani and traditional meals.',
    hours: ''
  },

  {
    id: 4,
    name: 'Green Garden',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900',
    cuisine: 'Healthy • Vegetarian',
    rating: 4.6,
    deliveryTime: '20–30 min',
    deliveryFee: 50,
    description:
      'Healthy meals, salads and fresh vegetarian dishes.',
    hours: ''
  },

  {
    id: 5,
    name: 'Spice Route',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900',
    cuisine: 'Indian • Asian',
    rating: 4.7,
    deliveryTime: '30–40 min',
    deliveryFee: 60,
    description:
      'Rich spices and flavorful dishes from South Asia.',
    hours: ''
  },

  {
    id: 6,
    name: 'Sweet Cravings',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900',
    cuisine: 'Desserts • Bakery',
    rating: 4.8,
    deliveryTime: '20–30 min',
    deliveryFee: 40,
    description:
      'Cakes, desserts and freshly baked sweet treats.',
    hours: ''
  }

];

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.scss'
})
export class RestaurantsComponent implements OnInit {

  private restaurantService = inject(RestaurantService);

  restaurants: Restaurant[] = MOCK_RESTAURANTS;

  ngOnInit(): void {
    this.loadRestaurants();
  }

  private loadRestaurants(): void {
    this.restaurantService.getAll('Active').subscribe({
      next: (list: RestaurantModel[]) => {
        const mapped = (list || []).map((restaurant, index) =>
          this.mapRestaurant(restaurant, index)
        );

        this.restaurants = mapped.length > 0 ? mapped : MOCK_RESTAURANTS;
      },
      error: () => {
        this.restaurants = MOCK_RESTAURANTS;
      }
    });
  }

  private mapRestaurant(restaurant: RestaurantModel, index: number): Restaurant {
    const hours =
      restaurant.openingTime && restaurant.closingTime
        ? `${restaurant.openingTime} – ${restaurant.closingTime}`
        : '';

    return {
      id: restaurant.id ?? index + 1,
      name: restaurant.name,
      image: restaurant.imageUrls?.[0] || DEFAULT_RESTAURANT_IMAGE,
      cuisine: restaurant.category || restaurant.location || '',
      rating: restaurant.rating ?? 0,
      deliveryTime: '',
      deliveryFee: null,
      description: restaurant.description || '',
      hours
    };
  }
}
