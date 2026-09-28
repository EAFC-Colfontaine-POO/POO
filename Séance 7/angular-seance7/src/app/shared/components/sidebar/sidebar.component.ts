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
        <div class="header-label">PLAN DE LA SÉANCE 7</div>
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
                @case ('control-tower-vs-delegation') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                    <path d="M9 22v-4h6v4"></path>
                    <path d="M8 6h.01"></path>
                    <path d="M16 6h.01"></path>
                    <path d="M12 6h.01"></path>
                    <path d="M12 10h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 10h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 10h.01"></path>
                    <path d="M8 14h.01"></path>
                  </svg>
                }
                @case ('remote-control-analogy') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="2" width="12" height="20" rx="2"></rect>
                    <line x1="12" y1="6" x2="12" y2="6.01"></line>
                    <line x1="10" y1="10" x2="14" y2="10"></line>
                    <line x1="12" y1="14" x2="12" y2="18"></line>
                    <line x1="10" y1="16" x2="14" y2="16"></line>
                  </svg>
                }
                @case ('late-binding-prototypes') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                }
                @case ('ts-view-restrictor') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                }
                @case ('heterogeneous-collections-ocp') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                }
                @case ('instanceof-type-narrowing') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                }
                @case ('oop-vs-discriminated-unions') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M18 6l-6 6-6-6"></path>
                    <path d="M12 12v9"></path>
                  </svg>
                }
                @case ('angular-modern-mediatheque') {
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
          <div class="card-icon">🎭</div>
          <div class="card-text">
            <div class="card-headline">Séance 7 — Polymorphisme</div>
            <div class="card-sub">POO, Late Binding & Angular</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 270px;
      min-width: 270px;
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
