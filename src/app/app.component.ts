import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Alert } from './models/notification.model';
import { DarkModeService } from './services/dark-mode.service';
import { NotificationService } from './services/notification.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterOutlet,
        NavbarComponent,
        CommonModule,
        RouterLink,
        MatIconModule,
    ],
})
export class AppComponent {
    darkModeService: DarkModeService = inject(DarkModeService);
    router: Router = inject(Router);
    notificationService = inject(NotificationService);
    snackBar: MatSnackBar = inject(MatSnackBar);

    constructor() {
        this.notificationService.alert$.subscribe((alert: Alert | null) => {
            if (alert) {
                this.snackBar.openFromComponent(CustomSnackbarComponent, {
                    data: { alert },
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    panelClass: [
                        '!mt-24',
                        '!mr-4',
                        'custom-snackbar-button-error',
                    ],
                });
            }
        });
    }
}
