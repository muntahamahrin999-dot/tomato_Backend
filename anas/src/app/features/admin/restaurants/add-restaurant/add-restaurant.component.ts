import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../../../../models/restaurant.model';
import { RestaurantService } from '../../../../services/restaurant.service';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.scss'
})
export class AddRestaurantComponent implements OnInit {

  @Input() restaurantToEdit?: Restaurant | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Restaurant>();

  formData: Restaurant = {
    name: '',
    owner: '',
    category: 'Fast Food',
    location: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingTime: '09:00 AM',
    closingTime: '10:00 PM',
    rating: 4.5,
    ordersCount: 0,
    status: 'Active',
    active: true
  };

  categories = [
    'Fast Food',
    'Bangladeshi',
    'Pizza',
    'Indian',
    'Biryani',
    'Cafe',
    'Chinese',
    'Bakery',
    'Desserts'
  ];

  isSubmitting = false;
  errorMessage = '';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    if (this.restaurantToEdit) {
      this.formData = {
        ...this.formData,
        ...this.restaurantToEdit,
        name: this.restaurantToEdit.name || '',
        location: this.restaurantToEdit.location || this.restaurantToEdit.address || '',
        address: this.restaurantToEdit.address || this.restaurantToEdit.location || ''
      };
    }
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.name.trim()) {
      this.errorMessage = 'Restaurant name is required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    if (!this.formData.address) {
      this.formData.address = this.formData.location;
    }
    if (!this.formData.location) {
      this.formData.location = this.formData.address;
    }

    if (this.formData.id) {
      this.restaurantService.update(this.formData.id, this.formData).subscribe({
        next: (res: Restaurant) => {
          this.isSubmitting = false;
          this.saved.emit(res);
          this.close.emit();
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to update restaurant.';
        }
      });
    } else {
      this.restaurantService.create(this.formData).subscribe({
        next: (res: Restaurant) => {
          this.isSubmitting = false;
          this.saved.emit(res);
          this.close.emit();
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to add restaurant.';
        }
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
