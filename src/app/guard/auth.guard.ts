import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertType } from '../models/notification.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const allowedRoles = route.data['roles'] as string[];

  const user: User | undefined = authService.getUser();
  console.log(state)
  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  notificationService.alert({
    message: 'Access denied: You do not have the required permissions',
    type: AlertType.Error
  });

  return router.createUrlTree(['/signin']);
};

