import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AlertType } from '../models/notification.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authRedirectGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  let user: User | undefined = await firstValueFrom(
    authService.getUserObserver()
  );

  if (user) {
    notificationService.alert({
      message: 'Você já está logado',
      type: AlertType.Info,
    });

    const route =
      user.role === 'admin'
        ? `admin/${user.username}`
        : `dashboard/${user.username}`;
    return router.navigate([route]);
  }

  return true;
};
