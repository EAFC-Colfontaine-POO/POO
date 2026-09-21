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
                @case ('memory-model') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                }
                @case ('aliasing-pitfall') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                    <polyline points="17 2 12 7 7 2"></polyline>
                  </svg>
                }
                @case ('class-vs-instance') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                }
                @case ('instance-vs-static') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                  </svg>
                }
                @case ('encapsulation-invariants') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                }
                @case ('visibility-parameter-properties') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                }
                @case ('getters-setters-tell-dont-ask') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                  </svg>
                }
                @case ('advanced-mechanisms') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
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
          <div class="footer-text">POO TypeScript — Séance 5</div>
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
        border-color: rgba(49, 120, 198, 0.4);
        color: var(--text-main);

        .item-icon-wrapper {
          color: var(--ts-blue-light);
          background: rgba(49, 120, 198, 0.18);
        }

        .item-num {
          color: var(--ts-blue-light);
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
        color: var(--ts-blue-light);
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
