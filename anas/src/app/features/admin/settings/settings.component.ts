import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  private toastService = inject(ToastService);

  activeSection = 'general';

  settings = {
    restaurantName: 'Tomato',
    supportEmail: 'support@tomato.com',
    supportPhone: '+880 1700-000000',
    address: 'Dhaka, Bangladesh',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',

    adminName: 'Admin',
    adminEmail: 'admin@tomato.com',

    emailNotifications: true,
    orderNotifications: true,
    reviewNotifications: true,
    userNotifications: false,

    deliveryFee: 60,
    freeDeliveryAmount: 1000,
    estimatedDeliveryTime: 45,

    cashOnDelivery: true,
    onlinePayment: true,
    cardPayment: true,

    twoFactorAuth: false,
    loginAlerts: true
  };

  sections = [
    {
      id: 'general',
      title: 'General',
      icon: '⚙'
    },
    {
      id: 'account',
      title: 'Account',
      icon: '👤'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔'
    },
    {
      id: 'delivery',
      title: 'Delivery',
      icon: '🏍'
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: '💳'
    },
    {
      id: 'security',
      title: 'Security',
      icon: '🔒'
    }
  ];

  selectSection(section: string): void {
    this.activeSection = section;
  }

  saveChanges(): void {
    this.toastService.success('Settings saved successfully!');
  }

  resetSettings(): void {
    const confirmed = confirm(
      'Are you sure you want to reset the settings?'
    );

    if (confirmed) {
      this.activeSection = 'general';
      this.toastService.success('Settings have been reset.');
    }
  }

  toggleSetting(setting: keyof typeof this.settings): void {
    const value = this.settings[setting];

    if (typeof value === 'boolean') {
      this.settings[setting] = !value as never;
    }
  }
}