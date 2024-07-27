import { Routes } from '@angular/router';
import { adminGuard } from './guard/admin.guard';
import { authGuard } from './guard/auth.guard';

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
  },
  {
    path: 'admin/:user',
    title: 'Admin Page',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((p) => p.AdminComponent),
    canActivate: [adminGuard],
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
