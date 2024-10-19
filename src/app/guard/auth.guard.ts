import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AlertType } from '../models/notification.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const allowedRoles = route.data['roles'] as string[];

  const user: User | undefined = authService.getUser();

  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  notificationService.alert({
    message: 'Access denied: You do not have the required permissions',
    type: AlertType.Error,
  });
  return false;
};

