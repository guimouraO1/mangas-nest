import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, SignInForm } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-sign-in',
    imports: [ReactiveFormsModule, TranslateModule],
    templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
    themeService: ThemeService = inject(ThemeService);
    authService: AuthService = inject(AuthService);
    tokenService: TokenService = inject(TokenService);
    languageService = inject(LanguageService);
    router = inject(Router);

    isLoading = false;
    protected readonly toast = toast;
    isPasswordVisible: boolean = false;

    signInForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    ngOnInit(): void {
        this.redirectIfAuthenticated();
    }

    redirectIfAuthenticated() {
        const isUserAuthenticated = this.authService.getIsUserAuthenticated();
        if (!isUserAuthenticated) return;

        this.router.navigate(['subscriptions']);
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    async signIn() {
        this.isLoading = true;

        if (this.signInForm.invalid) return;
        const signInData = this.signInForm.value as SignInForm;

        try {
            const response = await firstValueFrom(this.authService.signIn(signInData));
            this.tokenService.setToken(response.token);
            this.authService.setIsUserAuthenticated(true);

            this.router.navigate(['subscriptions']);
        } catch (error: any) {
            if (error.status === 401) {
                this.isLoading = false;
                toast.error(error.error.message);
                return;
            }

            toast.error(error.message);
        }

        this.isLoading = false;
    }
}
