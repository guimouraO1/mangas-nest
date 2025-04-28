import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, delay, filter, switchMap, take, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const httpInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);
    const router = inject(Router);

    const token = tokenService.getAccessToken();

    if (token) {
        request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` }, withCredentials: true });
    }

    return next(request).pipe(
        delay(500),
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401) {
                return throwError(() => error);
            }

            if (request.url.includes('/sign-in') || request.url.includes('/sign-out')) {
                return throwError(() => error);
            }

            if (!isRefreshing) {
                isRefreshing = true;
                refreshTokenSubject.next(null);

                return authService.refreshToken().pipe(
                    switchMap(response => {
                        tokenService.setToken(response.token);
                        authService.setIsUserAuthenticated(true);

                        isRefreshing = false;
                        refreshTokenSubject.next(response.token);

                        return next(request.clone({ setHeaders: { Authorization: `Bearer ${response.token}` }, withCredentials: true }));
                    }),
                    catchError(refreshError => {
                        isRefreshing = false;
                        tokenService.clearAccessToken();
                        authService.setIsUserAuthenticated(false);
                        authService.signOut();
                        router.navigate(['/sign-in']);
                        return throwError(() => refreshError);
                    })
                );
            } else {
                return refreshTokenSubject.pipe(
                    filter(newToken => newToken != null),
                    take(1),
                    switchMap(newToken =>
                        next(
                            request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` }, withCredentials: true })
                        )
                    )
                );
            }
        })
    );
};
