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
        <div class="header-label">PARCOURS DU COURS</div>
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
                @case ('dom-oop') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 3v18"></path>
                    <path d="m19 9-7-6-7 6"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="18" r="3"></circle>
                  </svg>
                }
                @case ('semantic-attributes') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                }
                @case ('cascade-specificity') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                }
                @case ('box-model') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                }
                @case ('flexbox-lab') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <line x1="12" y1="3" x2="12" y2="21"></line>
                  </svg>
                }
                @case ('bootstrap-grid') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                  </svg>
                }
                @case ('bootstrap-components') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m18 15-6-6-6 6"></path>
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  </svg>
                }
                @case ('angular-integration') {
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
        <div class="footer-box">
          <div class="footer-tag">EAFC Colfontaine</div>
          <div class="footer-text">POO & Web — Séance 4</div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      min-width: 280px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.22s ease-in-out;
      user-select: none;
      z-index: 40;

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
      }
    }

    .sidebar-header {
      padding: 14px 16px 8px 16px;
      border-bottom: 1px solid var(--border-subtle);

      .header-label {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-dim);
      }
    }

    .module-list {
      flex: 1;
      overflow-y: auto;
      padding: 10px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 12px;
      border-radius: 8px;
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
        border-color: rgba(121, 82, 179, 0.45);
        color: var(--text-main);

        .item-icon-wrapper {
          color: #c4b5fd;
          background: rgba(121, 82, 179, 0.25);
        }

        .item-num {
          color: #c4b5fd;
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
      background: var(--bg-subtle);
      color: var(--text-dim);
      transition: all 0.2s;
    }

    .item-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .item-title-row {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .item-num {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-dim);
      font-family: var(--font-mono);
    }

    .item-title {
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-badge-pill {
      font-size: 0.68rem;
      color: var(--text-dim);
      background: var(--bg-subtle);
      padding: 1px 6px;
      border-radius: 4px;
      width: fit-content;

      &.special-badge {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        font-weight: 600;
      }
    }

    .sidebar-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--border-subtle);

      .footer-box {
        background: var(--bg-subtle);
        padding: 8px 10px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
      }

      .footer-tag {
        font-size: 0.68rem;
        font-weight: 700;
        color: #7952b3;
        text-transform: uppercase;
      }

      .footer-text {
        font-size: 0.72rem;
        color: var(--text-muted);
      }
    }
  `]
})
export class SidebarComponent {
  readonly nav = inject(NavigationService);
  readonly exercises = inject(ExerciseService);

  selectTab(tab: TabId): void {
    this.nav.setTab(tab);
  }
}
