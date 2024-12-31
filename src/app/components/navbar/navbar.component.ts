import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';

enum Languages {
    PT_BR = 'pt-br',
    EN = 'en',
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, TranslateModule],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    authService = inject(AuthService);
    darkModeService: DarkModeService = inject(DarkModeService);
    router: Router = inject(Router);
    notificationService = inject(NotificationService);
    languageService = inject(LanguageService)

    user: User | undefined;
    isSidenavOpened = signal<boolean>(false);
    translateService = inject(TranslateService);

    language: string = 'en';

    constructor() {
        this.authService.getUserObserver().subscribe((value) => this.user = value);
        this.languageService.getLanguageObserver().subscribe((value) => this.language = value);
    }

    toggleDarkMode() {
        this.darkModeService.updateDarkMode();
    }

    signOut(): void {
        this.isSidenavOpened.set(false);

        this.authService.logout();
        localStorage.removeItem('token');
        this.router.navigate(['signin']);
    }

    changeLanguage(language: any): void {
        localStorage.setItem('lg', language);
        this.languageService.setLanguage(language);
        this.translateService.use(language);
        const dropdown = document.getElementById('dropdown') as HTMLDetailsElement;
        if (dropdown) {
            dropdown.removeAttribute('open'); // Fecha o dropdown
        }
    }
}
