import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, firstValueFrom, throwError, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);

    const token = tokenService.getToken();

    if (!token) {
        return next(request);
    }

    const clone = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return next(clone).pipe(
        catchError(async (error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.log('Token Refreshed');
                const response = await firstValueFrom(authService.refreshToken());
                tokenService.setToken(response.token)
                window.location.reload();
            }

            return throwError(() => error);
        })
    ) as Observable<any>;
};
