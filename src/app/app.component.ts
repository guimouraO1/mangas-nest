import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Alert } from './models/notification.model';
import { DarkModeService } from './services/dark-mode.service';
import { NotificationService } from './services/notification.service';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterOutlet,
        NavbarComponent,
        CommonModule,
        MatIconModule,
        TranslateModule
    ],
})
export class AppComponent {
    darkModeService: DarkModeService = inject(DarkModeService);
    notificationService = inject(NotificationService);
    snackBar: MatSnackBar = inject(MatSnackBar);

    constructor(private translate: TranslateService) {
        this.translate.addLangs(['pt-br', 'en']);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        
        this.notificationService.alert$.subscribe((alert: Alert | null) => {
            if (alert) {
                this.snackBar.openFromComponent(CustomSnackbarComponent, {
                    data: { alert },
                    duration: alert.duration ?? 3000,
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
