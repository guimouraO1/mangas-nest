import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take } from 'rxjs';
import { Alert, AlertType } from '../models/notification.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

function newAlert(alert: Alert) {
  const notificationService = inject(NotificationService);
  notificationService.alert(alert);
}

export const alreadyLoggedIn: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let user: User | any = false;

  authService
    .getUserObserver()
    .pipe(take(1))
    .subscribe((value) => {
      user = value;
    });

  if (user) {
    newAlert({
      message: 'Você já está logado',
      type: AlertType.Info,
    });
    const route =
      user.role === 'admin' ? `admin/${user.id}` : `dashboard/${user.id}`;
    return router.navigate([route]);
  }

  return true;
};
