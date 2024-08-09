import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AlertType } from '../models/notification.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  let user: User | undefined = await firstValueFrom(
    authService.getUserObserver()
  );

  if (!user) {
    notificationService.alert({
      message:
        'Não autorizado. Você deve estar logado para acessar esta página',
      type: AlertType.Error,
    });
    return router.createUrlTree(['login']);
  }

  if (user.role != 'admin') {
    notificationService.alert({
      message: 'Você não tem permissão para acessar essa página',
      type: AlertType.Error,
    });
    return router.createUrlTree([`dashboard/${user.username}`]);
  }

  const param: any = route.params;
  if (user.username !== param.user) {
    return router.createUrlTree([`admin/${user.username}`]);
  }

  return true;
};
