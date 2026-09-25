import { Component, inject } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation.service';
import { ExerciseService } from '../../../core/services/exercise.service';
import { TabId } from '../../../core/models/app.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <aside class="sidebar" [class.collapsed]="nav.isSidebarCollapsed()">
      <div class="sidebar-header">
        <div class="header-label">PLAN DE LA SÉANCE 6</div>
      </div>

      <nav class="module-list">
        @for (item of nav.modules; track item.id) {
          <button 
            class="nav-item" 
            [class.active]="nav.activeTab() === item.id"
            (click)="selectTab(item.id)"
            [title]="item.title"
          >
            <div class="item-icon-wrapper">
              @switch (item.id) {
                @case ('dry-problem') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                }
                @case ('is-a-vs-has-a') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M6 21V9a9 9 0 0 0 9 9"></path>
                  </svg>
                }
                @case ('constructor-super') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                }
                @case ('protected-encapsulation') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                }
                @case ('override-enrichment') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                }
                @case ('fragile-base-class') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                }
                @case ('angular-mediatheque') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m2 4 10 18L22 4l-10 2L2 4z"></path>
                  </svg>
                }
                @case ('workshops-lab') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                }
              }
            </div>

            <div class="item-content">
              <div class="item-title-row">
                <span class="item-num">{{ item.index }}.</span>
                <span class="item-title">{{ item.shortTitle }}</span>
              </div>
              @if (item.id === 'workshops-lab') {
                <div class="item-badge-pill special-badge">
                  {{ exercises.completedCount() }}/{{ exercises.totalCount() }} Validés
                </div>
              } @else if (item.badge) {
                <div class="item-badge-pill">{{ item.badge }}</div>
              }
            </div>
          </button>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="footer-card">
          <div class="card-icon">💡</div>
          <div class="card-text">
            <div class="card-headline">Séance 6 — Héritage</div>
            <div class="card-sub">POO & TypeScript Avancé</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      min-width: 260px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.25s ease;
      z-index: 40;
      position: relative;

      &.collapsed {
        width: 64px;
        min-width: 64px;

        .header-label,
        .item-content,
        .sidebar-footer {
          display: none;
        }

        .nav-item {
          justify-content: center;
          padding: 10px 0;
        }

        .sidebar-header {
          padding: 14px 0;
          display: flex;
          justify-content: center;
        }
      }
    }

    .sidebar-header {
      padding: 14px 18px 8px 18px;
    }

    .header-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      text-transform: uppercase;
    }

    .module-list {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 6px;
      color: var(--text-muted);
      text-align: left;
      width: 100%;
      border: 1px solid transparent;

      &:hover {
        background: var(--bg-card);
        color: var(--text-main);
      }

      &.active {
        background: var(--bg-card);
        color: var(--text-main);
        border-color: rgba(14, 165, 233, 0.4);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

        .item-icon-wrapper {
          color: #38bdf8;
          background: rgba(14, 165, 233, 0.12);
        }

        .item-title {
          font-weight: 600;
          color: #ffffff;
        }
      }
    }

    .item-icon-wrapper {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-dim);
      background: var(--bg-subtle);
      flex-shrink: 0;
      transition: all 0.2s;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }

    .item-title-row {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.82rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .item-num {
      font-weight: 700;
      color: var(--text-dim);
      font-size: 0.75rem;
    }

    .item-title {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-badge-pill {
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--text-dim);

      &.special-badge {
        color: #34d399;
        font-weight: 700;
      }
    }

    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid var(--border-color);
    }

    .footer-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 10px;

      .card-icon {
        font-size: 1.2rem;
      }

      .card-headline {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .card-sub {
        font-size: 0.7rem;
        color: var(--text-muted);
      }
    }
  `]
})
export class SidebarComponent {
  readonly nav = inject(NavigationService);
  readonly exercises = inject(ExerciseService);

  selectTab(id: TabId): void {
    this.nav.setTab(id);
  }
}
