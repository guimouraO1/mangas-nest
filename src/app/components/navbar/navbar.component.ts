import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  darkModeService: DarkModeService = inject(DarkModeService);
  router: Router = inject(Router);
  notificationService = inject(NotificationService);
  user: any;

  ngOnInit() {
    this.authService.getUserObserver().subscribe((value) => {
      this.user = value;
    });
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
