import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {

  return () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    // User login করা আছে কিনা
    if (!authService.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    // Current user
    const user = authService.getCurrentUser();

    if (!user) {
      return router.createUrlTree(['/login']);
    }

    // User role allowed কিনা
    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Role না মিললে নিজের dashboard-এ পাঠাবে
    switch (user.role) {

      case 'customer':
        return router.createUrlTree(['/account']);

      case 'restaurant':
        return router.createUrlTree(['/restaurant/dashboard']);

      case 'rider':
        return router.createUrlTree(['/delivery/dashboard']);

      case 'admin':
        return router.createUrlTree(['/admin/dashboard']);

      default:
        return router.createUrlTree(['/login']);
    }
  };
};