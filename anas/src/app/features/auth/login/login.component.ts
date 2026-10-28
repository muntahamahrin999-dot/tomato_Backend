import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthResponse } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      alert('Please enter your email and password.');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: (res: AuthResponse) => {
        this.isLoading = false;
        const user = this.authService.getCurrentUser();
        const displayName = user ? user.name : res.username;
        const role = user ? user.role : 'customer';

        alert(`Login successful! Welcome ${displayName}`);
        this.redirectByRole(role);
      },
      error: (err: any) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Invalid email or password.');
      }
    });
  }

  createDemoAccounts(): void {
    alert(
      'Default Admin Account:\n' +
      'Email: admin@tomato.com\n' +
      'Password: admin123\n\n' +
      'Customer/Restaurant/Rider accounts can be registered on the Register page!'
    );
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'customer':
        this.router.navigate(['/account']);
        break;
      case 'restaurant':
        this.router.navigate(['/restaurant/dashboard']);
        break;
      case 'rider':
        this.router.navigate(['/delivery/dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}