import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  // =========================================
  // ACCOUNT
  // =========================================

  role = '';


  // =========================================
  // PERSONAL INFORMATION
  // =========================================

  name = '';

  email = '';

  phone = '';

  dateOfBirth = '';

  gender = '';

  city = '';

  address = '';


  // =========================================
  // CUSTOMER INFORMATION
  // =========================================

  deliveryArea = '';

  postCode = '';

  deliveryInstruction = '';


  // =========================================
  // RESTAURANT INFORMATION
  // =========================================

  restaurantName = '';

  businessType = '';

  restaurantAddress = '';

  licenseNumber = '';

  openingTime = '';

  closingTime = '';


  // =========================================
  // RIDER INFORMATION
  // =========================================

  vehicleType = '';

  vehicleNumber = '';

  drivingLicense = '';

  emergencyContact = '';


  // =========================================
  // ACCOUNT SECURITY
  // =========================================

  password = '';

  confirmPassword = '';


  private toastService = inject(ToastService);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // =========================================
  // REGISTER
  // =========================================

  register(): void {

    // -----------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------

    if (
      !this.role ||
      !this.name.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.address.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {

      this.toastService.warning(
        'Please fill in all required fields.'
      );

      return;
    }


    // -----------------------------------------
    // CUSTOMER VALIDATION
    // -----------------------------------------

    if (this.role === 'customer') {

      if (!this.deliveryArea.trim()) {

        this.toastService.warning(
          'Please enter your delivery area.'
        );

        return;
      }
    }


    // -----------------------------------------
    // RESTAURANT VALIDATION
    // -----------------------------------------

    if (this.role === 'restaurant') {

      if (
        !this.restaurantName.trim() ||
        !this.restaurantAddress.trim()
      ) {

        this.toastService.warning(
          'Please fill in the restaurant information.'
        );

        return;
      }
    }


    // -----------------------------------------
    // RIDER VALIDATION
    // -----------------------------------------

    if (this.role === 'rider') {

      if (!this.vehicleType) {

        this.toastService.warning(
          'Please select your vehicle type.'
        );

        return;
      }
    }


    // -----------------------------------------
    // PASSWORD MATCH
    // -----------------------------------------

    if (this.password !== this.confirmPassword) {

      this.toastService.error(
        'Passwords do not match.'
      );

      return;
    }


    // -----------------------------------------
    // PASSWORD LENGTH
    // -----------------------------------------

    if (this.password.length < 6) {

      this.toastService.warning(
        'Password must be at least 6 characters.'
      );

      return;
    }


    // -----------------------------------------
    // REGISTER USER
    // -----------------------------------------
    //
    // IMPORTANT:
    // AuthService.register() must accept
    this.authService.register(
      this.name.trim(),
      this.email.trim(),
      this.phone.trim(),
      this.password,
      this.role
    ).subscribe({
      next: () => {
        this.toastService.success('Registration successful! Redirecting to login.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.toastService.error(err?.error?.message || 'Registration failed. An account with this email/username may already exist.');
      }
    });
  }
}
