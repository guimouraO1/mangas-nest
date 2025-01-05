import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { DarkModeService } from './services/dark-mode.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LanguageService } from './services/language.service';
import { httpInterceptor } from './services/interceptor.service';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export function initializer(darkModeService: DarkModeService) {
  return () => darkModeService.getInitialTheme();
}

export function AuthInitializer(authService: AuthService) {
  return () => authService.verifyUserAuth();
}

export function languageInitializer(languageService: LanguageService) {
  return () => languageService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: AuthInitializer,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: languageInitializer,
      deps: [LanguageService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [DarkModeService],
      multi: true,
    },
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })])
  ]
};
