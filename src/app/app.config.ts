import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { DarkModeService } from './services/dark-mode.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function initializer(darkModeService: DarkModeService) {
  return () => darkModeService.getInitialTheme();
}

export function authInitializer(authService: AuthService) {
  return () => authService.confirmAuthentication();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [DarkModeService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      deps: [AuthService],
      multi: true,
    }, provideAnimationsAsync(),
  ],
};
