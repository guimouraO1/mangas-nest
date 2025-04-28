import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },
    {
        title: 'Mangas nest - Sign-In',
        path: 'sign-in',
        loadComponent: () => import('./pages/sign-in/sign-in.component').then((m) => m.SignInComponent)
    },
    {
        path: '',
        canActivateChild: [authGuard],
        loadComponent: () => import('./pages/_layout-auth/layout-auth.component').then((m) => m.LayoutAuthComponent),
        children: [
            {
                title: 'Mangas nest - Subscriptions',
                path: 'subscriptions',
                loadComponent: () => import('./pages/subscriptions/subscriptions.component').then((m) => m.SubscriptionsComponent)
            },
            {
                title: 'Mangas nest - Mangas',
                path: 'mangas',
                loadComponent: () => import('./pages/mangas/mangas.component').then((m) => m.MangasComponent)
            }
        ]
    }
];
