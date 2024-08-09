import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  darkModeSignal = signal<string>('light');

  getInitialTheme(): void {
    let theme = localStorage.getItem('theme');
    if (!theme) return;
    this.darkModeSignal.update((value) => theme);
  }

  updateDarkMode(): void {
    this.darkModeSignal.update((value) =>
      value === 'dark' ? 'light' : 'dark'
    );
    localStorage.setItem('theme', this.darkModeSignal());
  }
}
