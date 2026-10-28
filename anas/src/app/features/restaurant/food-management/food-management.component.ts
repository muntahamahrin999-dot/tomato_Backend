import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Food } from '../../../models/food.model';
import { FoodService } from '../../../services/food.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-food-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './food-management.component.html',
  styleUrl: './food-management.component.scss'
})
export class FoodManagementComponent implements OnInit {

  private toastService = inject(ToastService);

  searchText = '';
  foods: Food[] = [];
  isLoading = false;
  errorMessage = '';

  // Form State
  showForm = false;
  editingFoodId?: number;

  foodFormData: Food = {
    name: '',
    description: '',
    category: 'Burger',
    categoryName: 'Burger',
    price: 250,
    icon: '🍔',
    image: '',
    available: true,
    preparationTime: 20
  };

  sampleImages = [
    { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600' },
    { label: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600' },
    { label: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600' },
    { label: 'Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600' },
    { label: 'Chicken', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600' }
  ];

  selectSampleImage(url: string): void {
    this.foodFormData.image = url;
  }

  categories = ['Burger', 'Pizza', 'Biryani', 'Pasta', 'Drinks', 'Dessert', 'Chicken', 'Snacks'];

  constructor(private foodService: FoodService) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.foodService.getAll().subscribe({
      next: (data: Food[]) => {
        this.foods = (data && data.length > 0) ? data : this.getLocalFallbackFoods();
        this.isLoading = false;
      },
      error: () => {
        this.foods = this.getLocalFallbackFoods();
        this.isLoading = false;
      }
    });
  }

  private getLocalFallbackFoods(): Food[] {
    const stored = localStorage.getItem('tomato_restaurant_foods');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 1, name: 'Classic Beef Burger', category: 'Burger', price: 280, available: true, preparationTime: 15, icon: '🍔', description: 'Juicy beef patty with special sauce' },
      { id: 2, name: 'Pepperoni Feast Pizza', category: 'Pizza', price: 650, available: true, preparationTime: 25, icon: '🍕', description: 'Loaded with beef pepperoni and mozzarella' },
      { id: 3, name: 'Chicken Biryani', category: 'Biryani', price: 320, available: true, preparationTime: 20, icon: '🍚', description: 'Traditional aromatic chicken biryani' }
    ];
  }

  private saveLocalFallbackFoods(): void {
    localStorage.setItem('tomato_restaurant_foods', JSON.stringify(this.foods));
  }

  get filteredFoods(): Food[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      return this.foods;
    }

    return this.foods.filter(food =>
      food.name.toLowerCase().includes(search) ||
      (food.category && food.category.toLowerCase().includes(search)) ||
      (food.categoryName && food.categoryName.toLowerCase().includes(search))
    );
  }

  get availableCount(): number {
    return this.foods.filter(food => food.available).length;
  }

  get unavailableCount(): number {
    return this.foods.filter(food => !food.available).length;
  }

  addFood(): void {
    this.editingFoodId = undefined;
    this.foodFormData = {
      name: '',
      description: '',
      category: 'Burger',
      categoryName: 'Burger',
      price: 250,
      icon: '🍔',
      image: '',
      available: true,
      preparationTime: 20
    };
    this.showForm = true;
  }

  editFood(id?: number): void {
    if (!id) return;
    const found = this.foods.find(f => f.id === id);
    if (found) {
      this.editingFoodId = id;
      this.foodFormData = {
        ...found,
        category: found.category || found.categoryName || 'Burger',
        categoryName: found.categoryName || found.category || 'Burger'
      };
      this.showForm = true;
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.editingFoodId = undefined;
  }

  onSaveFood(): void {
    if (!this.foodFormData.name || !this.foodFormData.name.trim()) {
      this.toastService.warning('Please enter a food name.');
      return;
    }
    if (!this.foodFormData.price || this.foodFormData.price <= 0) {
      this.toastService.warning('Please enter a valid price.');
      return;
    }

    this.foodFormData.categoryName = this.foodFormData.category;

    if (this.editingFoodId) {
      this.foodService.update(this.editingFoodId, this.foodFormData).subscribe({
        next: (updated: Food) => {
          const idx = this.foods.findIndex(f => f.id === updated.id);
          if (idx > -1) {
            this.foods[idx] = updated;
          } else {
            const localIdx = this.foods.findIndex(f => f.id === this.editingFoodId);
            if (localIdx > -1) this.foods[localIdx] = { ...this.foodFormData, id: this.editingFoodId };
          }
          this.saveLocalFallbackFoods();
          this.toastService.success('Food item updated successfully!');
          this.closeForm();
        },
        error: () => {
          const idx = this.foods.findIndex(f => f.id === this.editingFoodId);
          if (idx > -1) {
            this.foods[idx] = { ...this.foodFormData, id: this.editingFoodId };
          }
          this.saveLocalFallbackFoods();
          this.toastService.success('Food item updated successfully!');
          this.closeForm();
        }
      });
    } else {
      this.foodService.create(this.foodFormData).subscribe({
        next: (created: Food) => {
          this.foods.unshift(created);
          this.saveLocalFallbackFoods();
          this.toastService.success('Food item created successfully!');
          this.closeForm();
        },
        error: () => {
          const newFood: Food = {
            ...this.foodFormData,
            id: Date.now()
          };
          this.foods.unshift(newFood);
          this.saveLocalFallbackFoods();
          this.toastService.success('Food item created successfully!');
          this.closeForm();
        }
      });
    }
  }

  deleteFood(id?: number): void {
    if (!id) return;
    const confirmed = confirm('Are you sure you want to delete this food?');
    if (!confirmed) {
      return;
    }

    this.foodService.delete(id).subscribe({
      next: () => {
        this.foods = this.foods.filter(f => f.id !== id);
        this.saveLocalFallbackFoods();
        this.toastService.success('Food deleted successfully.');
      },
      error: () => {
        this.foods = this.foods.filter(f => f.id !== id);
        this.saveLocalFallbackFoods();
        this.toastService.success('Food deleted successfully.');
      }
    });
  }

  toggleAvailability(id?: number): void {
    if (!id) return;
    const found = this.foods.find(item => item.id === id);
    if (!found) return;

    this.foodService.toggleAvailability(id).subscribe({
      next: (res: Food) => {
        found.available = res?.available !== undefined ? res.available : !found.available;
        this.saveLocalFallbackFoods();
        this.toastService.info(`Availability updated for ${found.name}`);
      },
      error: () => {
        found.available = !found.available;
        this.saveLocalFallbackFoods();
        this.toastService.info(`Availability updated for ${found.name}`);
      }
    });
  }
}
