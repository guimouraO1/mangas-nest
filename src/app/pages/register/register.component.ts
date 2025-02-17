import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
export class RegisterComponent implements OnInit {
    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    translateService = inject(TranslateService);
    router = inject(Router);
    
    registerForm: FormGroup;
    fb = inject(FormBuilder);
    isPasswordHiden = true;
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

    async ngOnInit() {
        const isUserAuthenticated = await firstValueFrom(this.authService.getIsUserAuthenticated());
        if (isUserAuthenticated) {
             this.router.navigate(['subscriptions']);
        }
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
            this.router.navigate(['signin']);
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
