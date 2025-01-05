import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AlertType } from '../../models/notification.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TokenService } from '../../services/token.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslateModule],
    templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
    router: Router = inject(Router);
    authService = inject(AuthService);
    fb = inject(FormBuilder);
    notificationService = inject(NotificationService);
    translateService = inject(TranslateService);
    tokenService = inject(TokenService);

    loginForm: FormGroup;
    isPasswordHiden = true;
    isButtonSigninDisable = false;
    alertType = AlertType;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(3)]],
        });
    }

    async ngOnInit() {
       const isUserAuthenticated = await firstValueFrom(this.authService.getIsUserAuthenticated());
       if (isUserAuthenticated) {
            this.router.navigate(['subscriptions']);
       }
    }

    async onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.isButtonSigninDisable = true;

        try {
            const response = await firstValueFrom(this.authService.startSession(this.loginForm.value));
            this.tokenService.setToken(response.token);
            this.authService.setIsUserAuthenticated(true);
            this.router.navigate(['subscriptions']);

            const successMessage = await firstValueFrom(this.translateService.get("pages.signin.alerts.success"));
            this.notificationService.alert({
                message: successMessage,
                type: AlertType.Success,
            });

        } catch (err: any) {
            const errorMessage = await firstValueFrom(this.translateService.get("pages.signin.alerts.error"));

            this.notificationService.alert({
                message: errorMessage,
                type: AlertType.Error,
            });
        } finally {
            this.isButtonSigninDisable = false;
        }
    }
}
