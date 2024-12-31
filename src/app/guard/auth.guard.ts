import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertType } from '../models/notification.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const translateService = inject(TranslateService);
  const allowedRoles = route.data['roles'] as string[];

  const user: User | undefined = authService.getUser();

  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  const translatedMessage = await firstValueFrom(translateService.get("guard.denied"));
  
  notificationService.alert({
    message: translatedMessage,
    type: AlertType.Error
  });

  return router.createUrlTree(['/signin']);
};

