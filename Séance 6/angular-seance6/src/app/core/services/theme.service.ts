import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'seance4_theme_pref';

  readonly theme = signal<AppTheme>('dark');

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as AppTheme | null;
      if (saved === 'dark' || saved === 'light') {
        this.theme.set(saved);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        this.theme.set('light');
      }

      this.applyTheme(this.theme());

      effect(() => {
        const current = this.theme();
        this.applyTheme(current);
        localStorage.setItem(this.STORAGE_KEY, current);
      });
    }
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: AppTheme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;
      root.setAttribute('data-theme', theme);
      root.setAttribute('data-bs-theme', theme);
      body.classList.remove('theme-dark', 'theme-light');
      body.classList.add(`theme-${theme}`);
    }
  }
}
