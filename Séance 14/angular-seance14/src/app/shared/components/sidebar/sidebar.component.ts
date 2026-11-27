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
        <div class="header-label">PARCOURS SÉANCE 14</div>
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
                @case ('memory-simulator') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
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
                @case ('service-anatomy') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                }
                @case ('code-dilemma') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="6" y1="3" x2="6" y2="15"></line>
                    <circle cx="18" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M18 9a9 9 0 0 1-9 9"></path>
                  </svg>
                }
                @case ('generic-box') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                }
                @case ('generic-constraints') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                }
                @case ('universal-repository') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                }
                @case ('media-store-case') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                }
                @case ('entity-factory') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
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

      <!-- Pied de menu : Statut de progression global -->
      <div class="sidebar-footer">
        <div class="footer-progress">
          <div class="footer-progress-label">
            <span>Progression POO S14</span>
            <span class="pct">{{ exercises.progressPercentage() }}%</span>
          </div>
          <div class="footer-track">
            <div class="footer-fill" [style.width.%]="exercises.progressPercentage()"></div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 270px;
      height: 100%;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 40;

      &.collapsed {
        width: 64px;

        .header-label,
        .item-content,
        .sidebar-footer {
          display: none;
        }

        .item-icon-wrapper {
          margin: 0 auto;
        }

        .nav-item {
          padding: 10px;
          justify-content: center;
        }
      }
    }

    .sidebar-header {
      padding: 14px 18px 8px;
      .header-label {
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: var(--text-dim);
      }
    }

    .module-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
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
      transition: all 0.15s;

      &:hover {
        background: var(--bg-card);
        color: var(--text-main);
      }

      &.active {
        background: var(--badge-bg);
        color: var(--ts-blue-light);
        font-weight: 600;

        .item-icon-wrapper {
          color: var(--ts-blue-light);
        }

        .item-num {
          color: var(--ts-blue);
        }
      }
    }

    .item-icon-wrapper {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--text-dim);
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
      flex: 1;
    }

    .item-title-row {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .item-num {
        font-size: 0.72rem;
        font-family: var(--font-mono);
        color: var(--text-dim);
      }

      .item-title {
        font-size: 0.83rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .item-badge-pill {
      font-size: 0.68rem;
      color: var(--text-dim);
      font-weight: 500;

      &.special-badge {
        color: #34d399;
        font-weight: 600;
      }
    }

    .sidebar-footer {
      padding: 14px 16px;
      border-top: 1px solid var(--border-color);
      background: var(--bg-sidebar);

      .footer-progress-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.72rem;
        font-weight: 600;
        margin-bottom: 6px;

        .pct {
          color: var(--ts-blue-light);
          font-family: var(--font-mono);
        }
      }

      .footer-track {
        height: 6px;
        background: var(--bg-app);
        border-radius: 9999px;
        overflow: hidden;
      }

      .footer-fill {
        height: 100%;
        background: linear-gradient(90deg, #3178c6, #10b981);
        border-radius: 9999px;
        transition: width 0.3s;
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
