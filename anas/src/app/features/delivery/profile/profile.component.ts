import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-delivery-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  rider = {
    name: 'Demo Rider',
    email: 'rider@tomato.com',
    phone: '01700000003',
    vehicle: 'Motorcycle',
    vehicleNumber: 'DHAKA-METRO-1234',
    joined: 'January 2026'
  };

  editMode = false;

  constructor() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.rider = {
        ...this.rider,
        name: user.name || this.rider.name,
        email: user.email || this.rider.email,
        phone: user.phone || this.rider.phone
      };
    }
  }

  saveProfile(): void {
    this.editMode = false;
    this.toastService.success('Profile updated successfully!');
  }

  cancelEdit(): void {
    this.editMode = false;
  }
}