import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rider } from '../../../../models/rider.model';
import { RiderService } from '../../../../services/rider.service';

@Component({
  selector: 'app-add-rider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-rider.component.html',
  styleUrl: './add-rider.component.scss'
})
export class AddRiderComponent implements OnInit {

  @Input() riderToEdit?: Rider | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Rider>();

  formData: Rider = {
    name: '',
    email: '',
    phone: '',
    vehicle: 'Motorcycle',
    zone: 'Dhanmondi',
    orders: 0,
    ordersCount: 0,
    rating: 4.8,
    status: 'Active'
  };

  vehicles = ['Motorcycle', 'Bicycle', 'Scooter', 'Electric Bike'];
  zones = ['Dhanmondi', 'Mirpur', 'Uttara', 'Banani', 'Gulshan', 'Mohammadpur', 'Badda', 'Old Dhaka'];

  isSubmitting = false;
  errorMessage = '';

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    if (this.riderToEdit) {
      this.formData = { ...this.riderToEdit };
    }
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.name.trim()) {
      this.errorMessage = 'Rider name is required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.formData.id) {
      this.riderService.update(this.formData.id, this.formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.saved.emit(res);
          this.close.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to update rider.';
        }
      });
    } else {
      this.riderService.create(this.formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.saved.emit(res);
          this.close.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to add rider.';
        }
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
