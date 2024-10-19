import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { MangasListComponent } from './pages/mangas-list/mangas-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
            import('./pages/login/login.component').then(
                (p) => p.LoginComponent
            ),
    },
    {
        path: 'register',
        title: 'Register',
        loadComponent: () =>
            import('./pages/register/register.component').then(
                (p) => p.RegisterComponent
            ),
    },
    {
        path: 'list',
        title: 'List of mangas',
        loadComponent: () =>
            import('./pages/mangas-list/mangas-list.component').then(
                (p) => MangasListComponent
            ),
        canActivate: [authGuard],
        data: {
            roles: ['admin', 'user']
        }
    },
    {
        path: 'admin',
        title: 'Add manga',
        loadComponent: () =>
            import('./pages/admin/admin.component').then(
                (p) => p.AdminComponent
            ),
        canActivate: [authGuard],
        data: {
            roles: ['admin']
        }
    },
    {
        path: 'dashboard',
        title: 'Recents mangas',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component').then(
                (p) => p.DashboardComponent
            ),
        canActivate: [authGuard],
        data: {
            roles: ['admin', 'user']
        }
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
