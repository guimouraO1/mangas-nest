import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Alert, AlertType } from '../../models/notification.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  router: Router = inject(Router);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  notificationService = inject(NotificationService);

  loginForm: FormGroup;
  hidePassword = true;
  loadingLogin = false;

  emailSignal = signal('');
  passwordSignal = signal('');

  constructor() {
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

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingLogin = true;

    try {
      const res = await firstValueFrom(
        this.authService.login(this.loginForm.value)
      );

      localStorage.setItem('token', res.access_token);
      this.authService.setUser(res.user);

      const route =
        res.user.role === 'admin'
          ? `admin/${res.user.id}`
          : `dashboard/${res.user.id}`;
      this.router.navigate([route]);

      this.newAlert({
        message: 'Login realizado com sucesso!',
        type: AlertType.Success,
      });
    } catch (err: any) {
      this.newAlert({
        message: err.error.msg,
        type: AlertType.Error,
      });
    } finally {
      this.loadingLogin = false;
    }
  }
  newAlert(alert: Alert) {
    this.notificationService.alert(alert);
  }
}
