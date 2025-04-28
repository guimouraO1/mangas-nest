import { Injectable, signal } from '@angular/core';

export type ThemeInterface = 'light' | 'dark'

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private themeSignal = signal<ThemeInterface>('light');

    getInitialTheme(): void {
        const theme = localStorage.getItem('theme') as ThemeInterface | null;
        if (!theme) return;
        this.themeSignal.update(() => theme);
    }

    getTheme() {
        return this.themeSignal();
    }

    toggleTheme(): void {
        this.themeSignal.update((value) => value === 'light' ? 'dark' : 'light');
        localStorage.setItem('theme', this.themeSignal());
    }
}