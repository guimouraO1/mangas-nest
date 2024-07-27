import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';

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
  user: any;

  ngOnInit() {
    this.authService.getUserObject().subscribe((value) => {
      this.user = value;
    });
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  dashboard() {
    if (!this.user) return;
    this.router.navigate([`dashboard/${this.user.id}`]);
  }

  admin() {
    if (!this.user) return;
    this.router.navigate([`admin/${this.user.id}`]);
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
