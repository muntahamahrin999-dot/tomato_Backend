
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is not logged in, allow access to login
  if (!authService.isLoggedIn()) {
    return true;
  }

  // If already logged in, redirect based on role
  const user = authService.getCurrentUser();
  const role = user?.role?.toLowerCase();

  switch (role) {
    case 'customer':
      return router.createUrlTree(['/account']);

    case 'restaurant':
      return router.createUrlTree(['/restaurant/dashboard']);

    case 'rider':
      return router.createUrlTree(['/delivery/dashboard']);

    case 'admin':
      return router.createUrlTree(['/admin/dashboard']);

    default:
      return router.createUrlTree(['/']);
  }
};
