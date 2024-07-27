import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let user: User | any = null;

  authService
    .getUserObject()
    .pipe(take(1))
    .subscribe((value) => {
      user = value;
    });

  if (!user) {
    return router.createUrlTree(['login']);
  }

  if (user.role != 'standart') {
    return router.createUrlTree(['login']);
  }

  return true;
};
