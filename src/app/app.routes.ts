import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MangasListComponent } from './pages/mangas-list/mangas-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
    },
    {
        path: 'signin',
        title: 'Sign in',
        loadComponent: () => import('./pages/login/login.component').then((p) => p.LoginComponent),
    },
    {
        path: 'signup',
        title: 'Sign up',
        loadComponent: () => import('./pages/register/register.component').then((p) => p.RegisterComponent),
    },
    {
        path: 'list',
        title: 'List of mangas',
        loadComponent: () => import('./pages/mangas-list/mangas-list.component').then((p) => MangasListComponent),
        canActivate: [authGuard],
        data: {
            roles: ['admin', 'user']
        }
    },
    {
        path: 'admin',
        title: 'Add new Manga',
        loadComponent: () => import('./pages/admin/admin.component').then((p) => p.AdminComponent),
        canActivate: [authGuard],
        data: {
            roles: ['admin']
        }
    },
    {
        path: 'subscriptions',
        title: 'Subscriptions',
        loadComponent: () => import('./pages/subscriptions/subscriptions.component').then((p) => p.SubscriptionsComponent),
        canActivate: [authGuard],
        data: {
            roles: ['admin', 'user']
        }
    },
    {
        path: '**',
        title: 'Not Found',
        loadComponent: () => import('./pages/not-found/not-found.component').then((p) => p.NotFoundComponent),
    },
];
