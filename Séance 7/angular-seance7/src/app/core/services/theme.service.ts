import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'seance7_theme';
  readonly theme = signal<AppTheme>('dark');

  constructor() {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(this.THEME_KEY) as AppTheme : null;
    if (saved === 'light' || saved === 'dark') {
      this.theme.set(saved);
    }

    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', current);
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(`theme-${current}`);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.THEME_KEY, current);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
