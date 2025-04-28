import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const isUserAuthenticated = authService.getIsUserAuthenticated();

    if (!isUserAuthenticated) {
        return router.createUrlTree(['/sign-in']);
    }

    return isUserAuthenticated;
};
