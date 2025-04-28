import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, TranslateModule, ReactiveFormsModule, CommonModule, RouterLinkActive],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent  {
    protected readonly toast = toast;
    tokenService = inject(TokenService);
    authService = inject(AuthService);
    router = inject(Router);
    languageService = inject(LanguageService);
    themeService = inject(ThemeService);

    drawerOpen = new FormControl(false);

    toggleSidenav() {
        this.drawerOpen.setValue(false);
    }

    async signOut() {
        this.toggleSidenav();
        this.tokenService.clearAccessToken();
        this.authService.setIsUserAuthenticated(false);
        this.router.navigate(['/sign-in']);

        await firstValueFrom(this.authService.signOut()).catch();
    }
}
