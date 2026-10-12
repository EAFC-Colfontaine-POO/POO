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
        <span class="header-label">PARCOURS D'APPRENTISSAGE</span>
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
                @case ('crise-maintenance') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                }
                @case ('srp-single-responsibility') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                }
                @case ('ocp-open-closed') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                }
                @case ('dip-dependency-inversion') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                }
                @case ('dip-angular-testing') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                }
                @case ('synergie-sod-arbitrage') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
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
        <div class="footer-badge">
          <span class="dot"></span>
          <span>POO Avancée · EAFC</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      min-width: 280px;
      height: 100%;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;

      &.collapsed {
        width: 68px;
        min-width: 68px;

        .sidebar-header, .item-content, .sidebar-footer {
          opacity: 0;
          pointer-events: none;
        }

        .nav-item {
          justify-content: center;
          padding: 10px 0;
        }

        .item-icon-wrapper {
          margin: 0;
        }
      }
    }

    .sidebar-header {
      padding: 16px 20px 8px 20px;
      transition: opacity 0.2s;

      .header-label {
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-dim);
      }
    }

    .module-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 9px 12px;
      border-radius: 8px;
      color: var(--text-muted);
      text-align: left;
      border: 1px solid transparent;
      background: transparent;

      &:hover {
        background: var(--bg-card);
        color: var(--text-main);
      }

      &.active {
        background: var(--bg-card);
        color: #ffffff;
        border-color: rgba(99, 102, 241, 0.4);
        box-shadow: var(--shadow-sm);

        .item-icon-wrapper {
          color: #818cf8;
          background: rgba(99, 102, 241, 0.15);
        }

        .item-num {
          color: #818cf8;
        }
      }
    }

    .item-icon-wrapper {
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      background: var(--bg-subtle);
      transition: all 0.2s;
    }

    .item-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: opacity 0.2s;
    }

    .item-title-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .item-num {
      font-size: 0.72rem;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--text-dim);
    }

    .item-title {
      font-size: 0.82rem;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .item-badge-pill {
      font-size: 0.65rem;
      color: var(--text-dim);
      font-family: var(--font-mono);

      &.special-badge {
        color: #34d399;
        font-weight: 700;
      }
    }

    .sidebar-footer {
      padding: 14px 20px;
      border-top: 1px solid var(--border-color);
      transition: opacity 0.2s;

      .footer-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.74rem;
        color: var(--text-dim);

        .dot {
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
        }
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
