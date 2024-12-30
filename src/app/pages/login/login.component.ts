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
import { Alert, AlertType } from '../../models/notification.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './login.component.html',
})

export class LoginComponent {
    router: Router = inject(Router);
    authService = inject(AuthService);
    fb = inject(FormBuilder);
    notificationService = inject(NotificationService);

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

            this.newAlert({
                message: 'Login realizado com sucesso!',
                type: AlertType.Success,
            });
        } catch (err: any) {
            this.newAlert({
                message: err.error.message,
                type: AlertType.Error,
            });
        } finally {
            this.isButtonSigninDisable = false;
        }
    }

    newAlert(alert: Alert) {
        this.notificationService.alert(alert);
    }
}
