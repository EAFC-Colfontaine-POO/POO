import { Component, inject } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation.service';
import { TabId } from '../../../core/models/app.models';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <aside class="sidebar" [class.collapsed]="nav.isSidebarCollapsed()">
      <div class="sidebar-header">
        <div class="header-label">PARCOURS PÉDAGOGIQUE</div>
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
                @case ('type-erasure') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                }
                @case ('tooling-cli') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                  </svg>
                }
                @case ('types-primitives') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                  </svg>
                }
                @case ('scope-mutability') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                }
                @case ('flow-operators') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="6" y1="3" x2="6" y2="15"></line>
                    <circle cx="18" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M18 9a9 9 0 0 1-9 9"></path>
                  </svg>
                }
                @case ('functions') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                }
                @case ('arrays-tuples') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                }
                @case ('objects-interfaces') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                }
                @case ('exercises') {
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
              @if (item.id === 'exercises') {
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
        <div class="author-box">
          <div class="author-icon">🎓</div>
          <div class="author-details">
            <div class="author-role">Bachelier en Informatique</div>
            <div class="author-sub">Support de cours Séance 2</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 265px;
      height: 100%;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.25s ease, transform 0.25s ease;
      overflow: hidden;

      &.collapsed {
        width: 64px;

        .header-label, .item-content, .sidebar-footer {
          display: none;
        }

        .nav-item {
          justify-content: center;
          padding: 10px 0;
        }
      }
    }

    .sidebar-header {
      padding: 16px 14px 10px 14px;
    }

    .header-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-dim);
    }

    .module-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 8px;
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
      text-align: left;
      color: var(--text-muted);
      border: 1px solid transparent;
      width: 100%;

      &:hover {
        background: var(--bg-card);
        color: var(--text-main);
      }

      &.active {
        background: rgba(49, 120, 198, 0.15);
        color: var(--ts-blue-light);
        border-color: rgba(49, 120, 198, 0.35);
        font-weight: 600;

        .item-icon-wrapper {
          color: var(--ts-blue-light);
        }

        .item-num {
          color: var(--ts-blue-light);
        }
      }
    }

    .item-icon-wrapper {
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
    }

    .item-num {
      font-weight: 700;
      font-size: 0.8rem;
      color: var(--text-dim);
    }

    .item-title {
      font-size: 0.85rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-badge-pill {
      font-size: 0.68rem;
      color: var(--text-dim);

      &.special-badge {
        color: #10b981;
        font-weight: 600;
      }
    }

    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid var(--border-color);
      background: var(--bg-header);
    }

    .author-box {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .author-icon {
      font-size: 1.3rem;
    }

    .author-role {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .author-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
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
