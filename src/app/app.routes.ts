import { ErrorHandler, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { adminGuard } from './guard/admin.guard';
import { alreadyLoggedIn } from './guard/alreadyLoggedIn.guard';
import { authGuard } from './guard/auth.guard';
import { AlertType } from './models/notification.model';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login Page',
    loadComponent: () =>
      import('./pages/login/login.component').then((p) => p.LoginComponent),
    canActivate: [alreadyLoggedIn],
  },
  {
    path: 'admin',
    redirectTo: () => {
      const notificationService = inject(NotificationService);
      const authService = inject(AuthService);
      const errorHandler = inject(ErrorHandler);
      const user: User = authService.getUser();

      if (!user) {
        notificationService.alert({
          message:
            'Não autorizado. Você deve estar logado para acessar esta página',
          type: AlertType.Error,
        });
        return `login`;
      }

      if (user) {
        return `/admin/${user.id}`;
      } else {
        errorHandler.handleError(
          new Error(
            'Tentativa de navegação para a página de administração sem id de usuário'
          )
        );
        return `not-found`;
      }
    },
    pathMatch: 'full',
  },
  {
    path: 'admin/:user',
    title: 'Admin Page',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((p) => p.AdminComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'dashboard',
    redirectTo: () => {
      const notificationService = inject(NotificationService);
      const authService = inject(AuthService);
      const errorHandler = inject(ErrorHandler);
      const user: User = authService.getUser();

      if (!user) {
        notificationService.alert({
          message:
            'Não autorizado. Você deve estar logado para acessar esta página',
          type: AlertType.Error,
        });
        return 'login';
      }

      if (user) {
        return `/dashboard/${user.id}`;
      } else {
        errorHandler.handleError(
          new Error('Tentativa de navegação para a página sem id de usuário')
        );
        return `login`;
      }
    },
    pathMatch: 'full',
  },
  {
    path: 'dashboard/:user',
    title: 'User Page',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (p) => p.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    title: 'Not found',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (p) => p.NotFoundComponent
      ),
  },
];
