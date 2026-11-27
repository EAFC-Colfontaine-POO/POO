import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header class="top-nav">
      <div class="nav-left">
        <button class="icon-btn sidebar-toggle" (click)="nav.toggleSidebar()" title="Masquer / Afficher le menu latéral">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="brand">
          <div class="brand-logo-box">
            <span>POO</span>
          </div>
          <div class="brand-text">
            <div class="brand-title">
              TypeScript POO Studio <span class="session-tag">Séance 14</span>
            </div>
            <div class="brand-subtitle">Services, Injection de Dépendances &amp; Généricité TypeScript (Angular 22)</div>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <!-- Badge Framework & version -->
        <div class="tech-badge">
          <span class="pulse-dot"></span>
          <span>Angular v22 · Signal-First</span>
        </div>

        <!-- Jauge de progression des exercices -->
        <div class="progress-pill" (click)="nav.setTab('workshops-lab')" title="Accéder aux 20 exercices Monaco Editor">
          <div class="progress-info">
            <span class="progress-label">Exercices Validés</span>
            <span class="progress-ratio">{{ exercises.completedCount() }}/{{ exercises.totalCount() }}</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" [style.width.%]="exercises.progressPercentage()"></div>
          </div>
        </div>

        <!-- Bouton Thème -->
        <button class="theme-toggle-btn" (click)="theme.toggleTheme()" [title]="theme.theme() === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'">
          @if (theme.theme() === 'dark') {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          }
        </button>
      </div>
    </header>
  `,
  styles: [`
    .top-nav {
      height: 56px;
      background: var(--bg-header);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 50;
      position: relative;
    }

    .nav-left, .nav-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .sidebar-toggle {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      width: 34px;
      height: 34px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.18s;

      &:hover {
        background: var(--bg-subtle);
        color: var(--text-main);
        border-color: var(--ts-blue);
      }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo-box {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3178c6, #9333ea);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      box-shadow: 0 2px 8px rgba(49, 120, 198, 0.4);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;

      .session-tag {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 1px 7px;
        border-radius: 4px;
        background: rgba(147, 51, 234, 0.2);
        color: #c084fc;
        border: 1px solid rgba(147, 51, 234, 0.35);
      }
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .tech-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      border-radius: 9999px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);

      .pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
        animation: pulse 1.8s infinite;
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.6; }
    }

    .progress-pill {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      padding: 6px 14px;
      border-radius: 8px;
      cursor: pointer;
      min-width: 140px;
      transition: border-color 0.18s;

      &:hover {
        border-color: var(--ts-blue);
      }
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.72rem;
      font-weight: 600;

      .progress-label {
        color: var(--text-muted);
      }

      .progress-ratio {
        color: var(--ts-blue-light);
        font-family: var(--font-mono);
      }
    }

    .progress-bar-track {
      height: 5px;
      width: 100%;
      background: var(--bg-app);
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3178c6, #10b981);
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    .theme-toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        color: var(--text-main);
        border-color: var(--border-focus);
      }
    }
  `]
})
export class NavbarComponent {
  readonly theme = inject(ThemeService);
  readonly nav = inject(NavigationService);
  readonly exercises = inject(ExerciseService);
}
