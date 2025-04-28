import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { httpInterceptor } from './services/interceptor.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './services/language.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideAnimations } from '@angular/platform-browser/animations';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) => new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        importProvidersFrom([TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        })]),
        provideAppInitializer(() => {
            const themeService = inject(ThemeService);
            themeService.getInitialTheme();

            const languageService = inject(LanguageService);
            languageService.initializeLanguage();

            const authService = inject(AuthService);
            authService.initializeVerifyIsUserAuthenticated();
        }),
        provideHttpClient(withInterceptors([httpInterceptor])),
        provideEnvironmentNgxMask(),
        provideAnimations()
    ]
};
