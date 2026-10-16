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
        <div class="header-label">PLAN DE LA SÉANCE 12</div>
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
                @case ('memory-model-identity') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                }
                @case ('business-equality-equals') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                }
                @case ('cloning-shallow-vs-deep') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                }
                @case ('immutability-value-objects') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                }
                @case ('angular-signals-memory') {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
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
              <div class="item-meta">
                @if (item.badge) {
                  <span class="badge-mini">{{ item.badge }}</span>
                }
                @if (item.exerciseCount) {
                  <span class="ex-count">{{ item.exerciseCount }} ex</span>
                }
              </div>
            </div>
          </button>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="bloc-status">
          <div class="bloc-pill">Fin Bloc B POO</div>
          <div class="bloc-desc">Passerelle vers Angular Signals</div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100%;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.25s ease-in-out;
      overflow: hidden;

      &.collapsed {
        width: 68px;

        .header-label,
        .item-content,
        .sidebar-footer {
          display: none;
        }

        .nav-item {
          justify-content: center;
          padding: 12px 0;
        }

        .item-icon-wrapper {
          margin: 0;
        }
      }
    }

    .sidebar-header {
      padding: 16px 18px 8px;

      .header-label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-dim);
      }
    }

    .module-list {
      flex: 1;
      padding: 8px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--text-muted);
      text-align: left;
      border: 1px solid transparent;
      width: 100%;

      &:hover {
        background: var(--bg-subtle);
        color: var(--text-main);
      }

      &.active {
        background: rgba(121, 82, 179, 0.15);
        color: #fff;
        border-color: rgba(121, 82, 179, 0.4);

        .item-icon-wrapper {
          color: var(--bs-purple-light);
        }

        .item-num {
          color: var(--bs-purple-light);
        }
      }
    }

    .item-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-dim);
      flex-shrink: 0;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: 3px;
      overflow: hidden;
    }

    .item-title-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .item-num {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-dim);
      }

      .item-title {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 6px;

      .badge-mini {
        font-size: 0.65rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-dim);
        padding: 1px 5px;
        border-radius: 3px;
        font-family: var(--font-mono);
      }

      .ex-count {
        font-size: 0.68rem;
        color: #10b981;
        font-family: var(--font-mono);
        font-weight: 600;
      }
    }

    .sidebar-footer {
      padding: 14px 16px;
      border-top: 1px solid var(--border-color);
      background: var(--bg-card);

      .bloc-pill {
        display: inline-block;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 8px;
        background: linear-gradient(135deg, rgba(121, 82, 179, 0.3), rgba(221, 0, 49, 0.3));
        color: #e2e8f0;
        border-radius: 9999px;
        border: 1px solid rgba(121, 82, 179, 0.4);
        margin-bottom: 4px;
      }

      .bloc-desc {
        font-size: 0.72rem;
        color: var(--text-dim);
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
