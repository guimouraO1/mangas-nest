import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

let isRefreshing = false;
let refreshTokenSubject: string | null = null;

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);

    const token = tokenService.getToken();

    if (token) {
        request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true;

                    return authService.refreshToken().pipe(
                        switchMap((response) => {
                            isRefreshing = false;
                            refreshTokenSubject = response.token;

                            tokenService.setToken(response.token);

                            return next(
                                request.clone({
                                    setHeaders: { Authorization: `Bearer ${response.token}` }                                
                                })
                            );
                        }),
                        catchError((refreshError) => {
                            isRefreshing = false;
                            refreshTokenSubject = null;
                            authService.endSession();
                            return throwError(() => refreshError);
                        })
                    );
                } else {
                    return refreshTokenSubject
                        ? next(
                              request.clone({
                                  setHeaders: { Authorization: `Bearer ${refreshTokenSubject}` }
                              })
                          )
                        : throwError(() => error);
                }
            }

            return throwError(() => error);
        })
    );
};
