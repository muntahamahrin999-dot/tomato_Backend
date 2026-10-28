import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { FoodService } from '../../../services/food.service';
import { CategoryService } from '../../../services/category.service';
import { Food } from '../../../models/food.model';
import { Category } from '../../../models/category.model';

interface FoodItem {
  id: number;
  name: string;
  category: string;
  restaurant: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  popular?: boolean;
}

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss'
})
export class FoodComponent implements OnInit {

  searchTerm = '';
  selectedCategory = 'All';

  categories: string[] = [
    'All',
    'Burger',
    'Pizza',
    'Chicken',
    'Biryani',
    'Sushi',
    'Coffee',
    'Dessert',
    'Drinks',
    'Mexican'
  ];

  foods: FoodItem[] = [];
  isLoading = false;

  constructor(
    private cartService: CartService,
    private foodService: FoodService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFoods();
    this.loadCategories();
  }

  loadFoods(): void {
    this.isLoading = true;
    this.foodService.getAll(undefined, undefined, undefined, true).subscribe({
      next: (backendFoods: Food[]) => {
        if (backendFoods && backendFoods.length > 0) {
          this.foods = backendFoods.map(f => ({
            id: f.id || Math.floor(Math.random() * 10000),
            name: f.name,
            category: f.categoryName || f.category || 'General',
            restaurant: f.restaurantName || 'Tomato Kitchen',
            description: f.description || '',
            price: f.price,
            rating: f.rating || 4.7,
            image: f.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
            popular: true
          }));
        } else {
          this.foods = this.getDefaultFoods();
        }
        this.isLoading = false;
      },
      error: () => {
        this.foods = this.getDefaultFoods();
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll(true).subscribe({
      next: (catList: Category[]) => {
        if (catList && catList.length > 0) {
          const names = catList.map(c => c.name);
          this.categories = ['All', ...new Set([...names, ...this.categories.slice(1)])];
        }
      },
      error: () => {}
    });
  }

  get filteredFoods(): FoodItem[] {
    return this.foods.filter(food => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        food.category.toLowerCase() === this.selectedCategory.toLowerCase();

      const search = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        food.name.toLowerCase().includes(search) ||
        food.restaurant.toLowerCase().includes(search) ||
        food.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  addToCart(food: FoodItem): void {
    this.cartService.addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      restaurant: food.restaurant
    });

    this.router.navigate(['/cart']);
  }

  private getDefaultFoods(): FoodItem[] {
    return [
      {
        id: 1,
        name: 'Classic Beef Burger',
        category: 'Burger',
        restaurant: 'Burger House',
        description: 'Juicy beef patty with fresh vegetables and special sauce.',
        price: 280,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        popular: true
      },
      {
        id: 2,
        name: 'Smoky BBQ Burger',
        category: 'Burger',
        restaurant: 'Burger House',
        description: 'Grilled patty basted with rich smoky BBQ sauce.',
        price: 320,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600'
      },
      {
        id: 3,
        name: 'Pepperoni Feast Pizza',
        category: 'Pizza',
        restaurant: 'Pizza Point',
        description: 'Loaded with beef pepperoni and mozzarella cheese.',
        price: 650,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600',
        popular: true
      },
      {
        id: 4,
        name: 'Four Cheese Pizza',
        category: 'Pizza',
        restaurant: 'Pizza Point',
        description: 'Mozzarella, cheddar, parmesan and blue cheese blend.',
        price: 720,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'
      },
      {
        id: 5,
        name: 'Crispy Fried Chicken',
        category: 'Chicken',
        restaurant: 'Crispy Club',
        description: 'Golden crispy chicken with savory spicy dip.',
        price: 380,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600',
        popular: true
      },
      {
        id: 6,
        name: 'Chicken Kacchi Biryani',
        category: 'Biryani',
        restaurant: 'Biryani Express',
        description: 'Fragrant basmati rice cooked with spiced chicken and potatoes.',
        price: 320,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
        popular: true
      }
    ];
  }
}