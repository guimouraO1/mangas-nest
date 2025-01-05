import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { TokenDecoded, TokenService } from '../../services/token.service';
import { Languages } from '../../models/language.model';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, TranslateModule],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnDestroy {
    authService = inject(AuthService);
    darkModeService: DarkModeService = inject(DarkModeService);
    router: Router = inject(Router);
    languageService = inject(LanguageService);
    tokenService = inject(TokenService);

    private ngUnsubscribe = new Subject<void>();
    isUserAuthenticated: boolean = false;
    isSidenavOpened = signal<boolean>(false);
    language: string = this.languageService.DEFAULT_LANGUAGE;
    user: TokenDecoded | null =  null; 

    constructor() {
        this.authService.getIsUserAuthenticated().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
            this.isUserAuthenticated = value;
            
            if (value) {
                this.user = this.tokenService.decodePayloadJWT();
            }
        });
        this.languageService.getLanguageObserver().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => this.language = value);
    }

    toggleDarkMode() {
        this.darkModeService.updateDarkMode();
    }

    async endSession() {
        this.isSidenavOpened.set(false);
        this.tokenService.removeToken();
        this.authService.setIsUserAuthenticated(false);
        this.router.navigate(['signin']);
        await firstValueFrom(this.authService.endSession());
    }

    changeLanguage(language: Languages): void {
        this.languageService.setLanguage(language);
        const dropdown = document.getElementById('dropdown') as HTMLDetailsElement;
        if (dropdown) {
            dropdown.removeAttribute('open');
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
