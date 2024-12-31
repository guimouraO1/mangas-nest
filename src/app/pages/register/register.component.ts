import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertType } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';
import { firstValueFrom } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslateModule],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    registerForm: FormGroup;
    fb = inject(FormBuilder);
    isPasswordHiden = true;
    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    translateService = inject(TranslateService);

    isDisableButton: boolean = false;
    stepper: boolean = true;

    constructor() {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword: [
                '',
                [Validators.required, Validators.minLength(3)],
            ],
        }, { validators: [this.stepperValidator(), this.passwordsMatches()] });
    }

    async signUp() {
        if (this.registerForm.invalid) {
            return;
        }

        this.isDisableButton = true;
        try {
            const { confirmPassword, ...formData } = this.registerForm.value;
            await firstValueFrom(this.authService.register(formData));
            
            const successMessage = await firstValueFrom(this.translateService.get("pages.signup.alerts.success"));

            this.notificationService.alert({
                message: successMessage,
                type: AlertType.Success,
            });

            this.stepper = true;
            this.registerForm.reset();

        } catch (err: any) {
            const errorMessage = await firstValueFrom(this.translateService.get("pages.signup.alerts.error"));

            this.notificationService.alert({
                message: errorMessage,
                type: AlertType.Error,
            });
        }

        this.isDisableButton = false;
    }

    stepperValidator() {
        return (formGroup: FormGroup): { [key: string]: any } | null => {
            const username = formGroup.get('username');
            const name = formGroup.get('name');
            const email = formGroup.get('email');
            const password = formGroup.get('password');
            const confirmPassword = formGroup.get('confirmPassword');

            if (username?.invalid || name?.invalid || email?.invalid) {
                return { step1: true };
            }

            if (password?.invalid && confirmPassword?.invalid) {
                return { step2: true };
            }

            return null;
        };
    }

    passwordsMatches() {
        return (formGroup: FormGroup): { [key: string]: any } | null => {
            const password = formGroup.get('password');
            const confirmPassword = formGroup.get('confirmPassword');

            if (password?.value !== confirmPassword?.value) {
                return { passwordsDontMatches: true };
            }

            return null;
        };
    }
}
