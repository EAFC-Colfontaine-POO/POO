import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'eafc_seance18_theme';

  readonly theme = signal<AppTheme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.STORAGE_KEY, nextTheme);
      } catch {
        // Ignorer si stockage inaccessible
      }
    }
  }

  private getInitialTheme(): AppTheme {
    if (!this.isBrowser) return 'dark';
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // Ignorer
    }
    return 'dark';
  }

  private applyTheme(t: AppTheme): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }
}
