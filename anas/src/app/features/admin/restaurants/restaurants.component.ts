import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../../../models/restaurant.model';
import { RestaurantService } from '../../../services/restaurant.service';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddRestaurantComponent
  ],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.scss'
})
export class RestaurantsComponent implements OnInit {

  private toastService = inject(ToastService);

  searchText = '';
  selectedStatus = 'All';

  restaurants: Restaurant[] = [];
  isLoading = false;
  errorMessage = '';

  // Form View State
  showForm = false;
  selectedRestaurantToEdit: Restaurant | null = null;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.restaurantService.getAll().subscribe({
      next: (data: Restaurant[]) => {
        this.restaurants = data || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load restaurants from server. Please check backend connection.';
        console.error('Error loading restaurants:', err);
      }
    });
  }

  get filteredRestaurants(): Restaurant[] {
    const search = this.searchText.toLowerCase().trim();

    return this.restaurants.filter(restaurant => {
      const matchesSearch =
        !search ||
        (restaurant.name && restaurant.name.toLowerCase().includes(search)) ||
        (restaurant.owner && restaurant.owner.toLowerCase().includes(search)) ||
        (restaurant.category && restaurant.category.toLowerCase().includes(search)) ||
        (restaurant.location && restaurant.location.toLowerCase().includes(search)) ||
        (restaurant.address && restaurant.address.toLowerCase().includes(search));

      const matchesStatus =
        this.selectedStatus === 'All' ||
        restaurant.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get activeCount(): number {
    return this.restaurants.filter(r => r.status === 'Active').length;
  }

  get pendingCount(): number {
    return this.restaurants.filter(r => r.status === 'Pending').length;
  }

  get averageRating(): string {
    if (!this.restaurants.length) {
      return '0.0';
    }
    const total = this.restaurants.reduce(
      (sum, r) => sum + (r.rating || 0),
      0
    );
    return (total / this.restaurants.length).toFixed(1);
  }

  addRestaurant(): void {
    this.selectedRestaurantToEdit = null;
    this.showForm = true;
  }

  editRestaurant(id?: number): void {
    if (!id) return;
    const found = this.restaurants.find(r => r.id === id);
    if (found) {
      this.selectedRestaurantToEdit = { ...found };
      this.showForm = true;
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedRestaurantToEdit = null;
  }

  onFormSaved(saved: Restaurant): void {
    const idx = this.restaurants.findIndex(r => r.id === saved.id);
    if (idx > -1) {
      this.restaurants[idx] = saved;
    } else {
      this.restaurants.unshift(saved);
    }
    this.showForm = false;
    this.selectedRestaurantToEdit = null;
  }

  viewRestaurant(id?: number): void {
    if (!id) return;
    const found = this.restaurants.find(r => r.id === id);
    if (found) {
      this.toastService.info(
        `Restaurant ${found.name} · ${found.status} · Rating ${found.rating || 0}`
      );
    }
  }

  deleteRestaurant(id?: number): void {
    if (!id) return;
    const confirmed = confirm('Are you sure you want to delete this restaurant?');
    if (!confirmed) {
      return;
    }

    this.restaurantService.delete(id).subscribe({
      next: () => {
        this.restaurants = this.restaurants.filter(r => r.id !== id);
        this.toastService.success('Restaurant deleted successfully.');
      },
      error: (err: any) => {
        this.toastService.error('Failed to delete restaurant: ' + (err?.error?.message || err.message));
      }
    });
  }
}