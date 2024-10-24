import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    authService = inject(AuthService);
    darkModeService: DarkModeService = inject(DarkModeService);
    router: Router = inject(Router);
    notificationService = inject(NotificationService);
    user: User | undefined;
    isSidenavOpened = signal<boolean>(false);

    constructor() {
        this.authService.getUserObserver().subscribe((value) => {
            this.user = value;
        });
    }

    toggleDarkMode() {
        this.darkModeService.updateDarkMode();
    }

    signOut(): void {
        this.isSidenavOpened.set(false);

        this.authService.logout();
        localStorage.removeItem('token');
        this.router.navigate(['signin']);
    }
}
