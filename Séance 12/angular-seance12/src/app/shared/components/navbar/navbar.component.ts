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
        <button class="icon-btn sidebar-toggle" (click)="nav.toggleSidebar()" title="Masquer / Afficher le menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="brand">
          <div class="poo-logo-box">
            <span>S12</span>
          </div>
          <div class="brand-text">
            <div class="brand-title">
              Web & POO Studio <span class="session-tag">Séance 12</span>
            </div>
            <div class="brand-subtitle">Les Objets eux-mêmes · Identité, Comparaison, Clonage & Signals</div>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <div class="tech-badge">
          <span class="pulse-dot"></span>
          <span>Angular v22 · TS v6</span>
        </div>

        <div class="progress-pill" (click)="nav.setTab('workshops-lab')" title="Accéder aux 22 micro-exercices d'entraînement">
          <div class="progress-info">
            <span class="progress-label">Exercices Validés</span>
            <span class="progress-ratio">{{ exercises.completedCount() }}/{{ exercises.totalCount() }}</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" [style.width.%]="exercises.progressPercentage()"></div>
          </div>
        </div>

        <button class="theme-toggle-btn" (click)="theme.toggleTheme()" [title]="theme.theme() === 'dark' ? 'Mode clair' : 'Mode sombre'">
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

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .poo-logo-box {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--bs-purple), var(--angular-red));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 900;
      font-size: 0.95rem;
      font-family: var(--font-mono);
      box-shadow: 0 2px 8px rgba(121, 82, 179, 0.4);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-weight: 800;
      font-size: 0.98rem;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;

      .session-tag {
        font-size: 0.7rem;
        font-weight: 700;
        background: rgba(121, 82, 179, 0.2);
        color: var(--bs-purple-light);
        padding: 2px 7px;
        border-radius: 4px;
        border: 1px solid rgba(121, 82, 179, 0.3);
      }
    }

    .brand-subtitle {
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .tech-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-muted);
      font-family: var(--font-mono);

      .pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 6px #10b981;
      }
    }

    .progress-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--bs-purple);
        transform: translateY(-1px);
      }

      .progress-info {
        display: flex;
        flex-direction: column;

        .progress-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-dim);
        }

        .progress-ratio {
          font-size: 0.78rem;
          font-weight: 800;
          color: #34d399;
          font-family: var(--font-mono);
        }
      }

      .progress-bar-track {
        width: 70px;
        height: 6px;
        background: var(--bg-subtle);
        border-radius: 9999px;
        overflow: hidden;

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--bs-purple), #10b981);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }
      }
    }

    .theme-toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }
    }
  `]
})
export class NavbarComponent {
  readonly theme = inject(ThemeService);
  readonly nav = inject(NavigationService);
  readonly exercises = inject(ExerciseService);
}
