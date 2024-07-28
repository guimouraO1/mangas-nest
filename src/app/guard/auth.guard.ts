import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take } from 'rxjs';
import { AlertType } from '../models/notification.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  let user: User | any = null;

  authService
    .getUserObserver()
    .pipe(take(1))
    .subscribe((value) => {
      user = value;
    });

  if (!user) {
    console.log('esadsa');
    notificationService.alert({
      message:
        'Não autorizado. Você deve estar logado para acessar esta página',
      type: AlertType.Error,
    });
    return router.createUrlTree(['login']);
  }

  const param: any = route.params;
  if (user.id !== param.user) {
    return router.createUrlTree([`dashboard/${user.id}`]);
  }

  return true;
};
