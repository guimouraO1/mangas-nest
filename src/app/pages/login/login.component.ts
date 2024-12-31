import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
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

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslateModule],
    templateUrl: './login.component.html',
})

export class LoginComponent {
    router: Router = inject(Router);
    authService = inject(AuthService);
    fb = inject(FormBuilder);
    notificationService = inject(NotificationService);
    translateService = inject(TranslateService);

    loginForm: FormGroup;
    isPasswordHiden = true;
    isButtonSigninDisable = false;
    alertType = AlertType;

    constructor(authSerice: AuthService) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(3)]],
        });
    }

    get emailControl() {
        return this.loginForm.get('email') as FormControl;
    }

    get passwordControl() {
        return this.loginForm.get('password') as FormControl;
    }

    async onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.isButtonSigninDisable = true;

        try {
            const res = await firstValueFrom(this.authService.signin(this.loginForm.value));

            localStorage.setItem('token', res.token);

            this.authService.setUser(this.authService.decodePayloadJWT(res.token));

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
