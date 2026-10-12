import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'seance11_studio_theme';
  readonly theme = signal<AppTheme>('dark');

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as AppTheme | null;
      if (saved === 'dark' || saved === 'light') {
        this.theme.set(saved);
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme.set(prefersDark ? 'dark' : 'light');
      }
    }

    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', current);
        if (current === 'dark') {
          document.body.classList.add('theme-dark');
          document.body.classList.remove('theme-light');
        } else {
          document.body.classList.add('theme-light');
          document.body.classList.remove('theme-dark');
        }
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, current);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
