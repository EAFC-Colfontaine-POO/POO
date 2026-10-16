import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'seance12_theme';
  readonly theme = signal<Theme>('dark');

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_KEY) as Theme;
      if (saved === 'dark' || saved === 'light') {
        this.theme.set(saved);
      }
    }

    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', current);
        document.body.className = `theme-${current}`;
        localStorage.setItem(this.THEME_KEY, current);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
