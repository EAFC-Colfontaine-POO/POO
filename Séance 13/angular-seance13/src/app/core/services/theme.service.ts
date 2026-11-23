import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'seance13_theme_preference';
  readonly theme = signal<AppTheme>('dark');

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_KEY) as AppTheme;
      if (saved === 'dark' || saved === 'light') {
        this.theme.set(saved);
      }
    }

    effect(() => {
      const t = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', t);
        if (t === 'dark') {
          document.body.classList.add('theme-dark');
          document.body.classList.remove('theme-light');
        } else {
          document.body.classList.add('theme-light');
          document.body.classList.remove('theme-dark');
        }
      }
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(this.THEME_KEY, t);
        } catch (e) {}
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }
}
