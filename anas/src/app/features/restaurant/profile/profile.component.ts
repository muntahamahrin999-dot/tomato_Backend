import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-restaurant-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user: any = null;
  restaurantAddress = 'Dhaka, Bangladesh';
  private toastService = inject(ToastService);

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser();
  }


  editProfile(): void {
    this.toastService.info('Profile editing feature is active.');
  }


  changePassword(): void {
    this.toastService.info('Password change option is active.');
  }

}
