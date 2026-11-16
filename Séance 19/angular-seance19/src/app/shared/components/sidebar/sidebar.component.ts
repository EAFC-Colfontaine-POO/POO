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
        <div class="header-label">PARCOURS SÉANCE 19 · BLOC D</div>
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
                @case ('impedance-mismatch') {
                  <!-- Voiture / Choc d'impédance -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                    <circle cx="7" cy="17" r="2"></circle>
                    <path d="M9 17h6"></path>
                    <circle cx="17" cy="17" r="2"></circle>
                  </svg>
                }
                @case ('typed-database') {
                  <!-- Base de données cylindrique typée -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                }
                @case ('btree-indexes') {
                  <!-- Arbre B-Tree / ramification O(log n) -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M18 15V9a3 3 0 0 0-3-3H9"></path>
                    <path d="M6 9v6"></path>
                  </svg>
                }
                @case ('fluent-api') {
                  <!-- Fluent API where() / filtre entonnoir -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                }
                @case ('acid-transactions') {
                  <!-- Bouclier de robustesse ACID -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                }
                @case ('schema-migrations') {
                  <!-- Cycle de migration de schéma -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                }
                @case ('anti-patterns') {
                  <!-- Triangle d'alerte anti-patterns -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                }
                @case ('bibliotech-demo') {
                  <!-- Livre ouvert / application BiblioTech -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                }
                @case ('workshops-lab') {
                  <!-- Validation des 26 exercices Monaco -->
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
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
        <div class="eafc-tag">
          <span>EAFC · Programmation Orientée Objet</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 275px;
      height: 100%;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      z-index: 40;

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
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .header-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      text-transform: uppercase;
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
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      color: var(--text-muted);
      text-align: left;
      border: 1px solid transparent;

      &:hover {
        background: var(--bg-subtle);
        color: var(--text-main);
      }

      &.active {
        background: rgba(49, 120, 198, 0.14);
        color: var(--ts-blue-light);
        border-color: rgba(49, 120, 198, 0.35);

        .item-icon-wrapper {
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
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-num {
      color: var(--text-dim);
      font-size: 0.75rem;
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
      padding: 12px 16px;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.72rem;
      color: var(--text-dim);
    }
  `]
})
export class SidebarComponent {
  readonly nav = inject(NavigationService);
  readonly exercises = inject(ExerciseService);

  selectTab(tabId: TabId): void {
    this.nav.setTab(tabId);
  }
}
