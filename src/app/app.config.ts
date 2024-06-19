import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DarkModeService } from './services/dark-mode.service';

export function initializer(darkModeService: DarkModeService) {
  return () => darkModeService.getInitialTheme();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [DarkModeService],
      multi: true,
    },
  ],
};
