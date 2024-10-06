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
import { Alert, AlertType } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    registerForm: FormGroup;
    fb = inject(FormBuilder);
    hidePassword = true;
    authService = inject(AuthService);
    notificationService = inject(NotificationService);

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
        });
    }

    async register() {
        if (this.registerForm.invalid) {
            return;
        }

        try {
            await firstValueFrom(this.authService.register(this.registerForm.value));
            this.newAlert({
                message: 'Registrado com sucesso!',
                type: AlertType.Success,
            });
            this.registerForm.reset();
        } catch (err: any) {
            this.newAlert({
                message: err.error.message,
                type: AlertType.Error,
            });
        }
    }

    newAlert(alert: Alert) {
        this.notificationService.alert(alert);
    }
}
