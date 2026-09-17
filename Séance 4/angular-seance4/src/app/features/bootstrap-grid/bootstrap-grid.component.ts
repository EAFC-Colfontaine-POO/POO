import { Component, signal, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';
import { BootstrapBreakpoint } from '../../core/models/app.models';

@Component({
  selector: 'app-bootstrap-grid',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 06</span>
          <span class="badge badge-bootstrap">Bootstrap 5</span>
          <span class="badge badge-purple">Grille 12 Colonnes</span>
        </div>
        <h2>6. Système de Grille Bootstrap (12 Colonnes & Breakpoints)</h2>
        <p class="module-desc">
          La grille Bootstrap est un système flexible puissant basé sur une division en 12 colonnes avec approche Mobile-First. Simulez différentes largeurs d'écran en temps réel pour observer le déclenchement des points d'arrêt et l'adaptation des colonnes.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'theory'"
            (click)="activeMode.set('theory')"
          >
            <span>📖 Simulateur de Viewport & Grille</span>
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            <span>🧪 Ateliers Monaco (Labo 4 · Grille Responsive)</span>
          </button>
        </div>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Simulateur de Viewport Responsive & Breakpoints -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>📱 Simulateur de Viewport Responsive & Détection de Breakpoint</h3>
            <div class="active-bp-pill">
              <span>Breakpoint Actif :</span>
              <span class="bp-tag">{{ activeBreakpoint().name }} ({{ activeBreakpoint().infix }})</span>
            </div>
          </div>

          <p class="panel-sub">
            Faites glisser la jauge de largeur ou cliquez sur les boutons d'appareils pour observer les seuils de rupture Bootstrap en action.
          </p>

          <div class="viewport-controls">
            <div class="slider-row">
              <span class="v-label">Largeur d'écran simulée :</span>
              <input type="range" min="320" max="1440" [value]="viewportWidth()" (input)="onWidthChange($event)" />
              <span class="v-width-display">{{ viewportWidth() }} px</span>
            </div>

            <div class="devices-row">
              <button class="device-btn" [class.active]="viewportWidth() === 375" (click)="viewportWidth.set(375)">
                📱 Mobile (375px)
              </button>
              <button class="device-btn" [class.active]="viewportWidth() === 600" (click)="viewportWidth.set(600)">
                📱 Phablette (≥576px sm)
              </button>
              <button class="device-btn" [class.active]="viewportWidth() === 800" (click)="viewportWidth.set(800)">
                💻 Tablette (≥768px md)
              </button>
              <button class="device-btn" [class.active]="viewportWidth() === 1040" (click)="viewportWidth.set(1040)">
                🖥️ Desktop (≥992px lg)
              </button>
              <button class="device-btn" [class.active]="viewportWidth() === 1240" (click)="viewportWidth.set(1240)">
                🖥️ Large (≥1200px xl)
              </button>
              <button class="device-btn" [class.active]="viewportWidth() === 1440" (click)="viewportWidth.set(1440)">
                📺 XXL (≥1400px xxl)
              </button>
            </div>
          </div>

          <!-- Tableau récapitulatif des breakpoints -->
          <div class="breakpoints-table-wrapper mt-3">
            <table class="bp-table">
              <thead>
                <tr>
                  <th>Breakpoint</th>
                  <th>Infixe de classe</th>
                  <th>Largeur minimale</th>
                  <th>Appareils cibles</th>
                  <th>Statut actuel</th>
                </tr>
              </thead>
              <tbody>
                @for (bp of breakpoints; track bp.name) {
                  <tr [class.highlight]="activeBreakpoint().name === bp.name">
                    <td><strong>{{ bp.name }}</strong></td>
                    <td><code>{{ bp.infix }}</code></td>
                    <td>{{ bp.minWidth === 0 ? '< 576 px' : '≥ ' + bp.minWidth + ' px' }}</td>
                    <td>{{ bp.devices }}</td>
                    <td>
                      @if (activeBreakpoint().name === bp.name) {
                        <span class="status-active">● ACTIF</span>
                      } @else {
                        <span class="status-idle">○ Inactif</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. Constructeur Interactif de Grille à 12 Colonnes -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>📐 Constructeur de Grille à 12 Colonnes & Gouttières</h3>
            <div class="gutter-selector">
              <span>Gouttière (gutter) :</span>
              <div class="gutter-pills">
                @for (g of [0, 1, 2, 3, 4, 5]; track g) {
                  <button class="g-pill" [class.active]="gutter() === g" (click)="gutter.set(g)">
                    .g-{{ g }}
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Règle graduée de 12 colonnes -->
          <div class="ruler-grid">
            @for (num of [1,2,3,4,5,6,7,8,9,10,11,12]; track num) {
              <div class="ruler-col">
                <span>{{ num }}</span>
              </div>
            }
          </div>

          <!-- Démonstration de la combinaison reine responsive -->
          <div class="responsive-card-demo mt-3">
            <div class="demo-caption">
              <strong>Cas d'usage classique Mobile-First :</strong>
              <code>class="col-12 col-md-6 col-lg-4"</code>
              <span class="caption-explain">
                ➔ Mobile : 1 bloc par ligne (12/12) | Tablette : 2 blocs (6/12) | Desktop : 3 blocs (4/12)
              </span>
            </div>

            <!-- Simulation visuelle dynamique selon viewportWidth -->
            <div class="dynamic-responsive-grid" [style.gap.px]="gutter() * 8">
              @for (item of [1, 2, 3]; track item) {
                <div class="responsive-grid-col" [style.flexBasis]="getColumnBasis()">
                  <div class="inner-demo-box">
                    <div class="box-title">Carte {{ item }}</div>
                    <div class="box-size-info">{{ getColumnWidthText() }}</div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Combinaisons types 12 colonnes -->
          <div class="preset-combinations mt-3">
            <div class="comb-title">Combinaisons types sur 12 unités :</div>
            
            <div class="sample-grid mb-2">
              <div class="col-sample span-12">.col-12 (100% — Pleine largeur)</div>
            </div>

            <div class="sample-grid mb-2">
              <div class="col-sample span-6">.col-6 (50%)</div>
              <div class="col-sample span-6">.col-6 (50%)</div>
            </div>

            <div class="sample-grid mb-2">
              <div class="col-sample span-4">.col-4 (33.3%)</div>
              <div class="col-sample span-4">.col-4 (33.3%)</div>
              <div class="col-sample span-4">.col-4 (33.3%)</div>
            </div>

            <div class="sample-grid">
              <div class="col-sample span-3">.col-3 (Sidebar 25%)</div>
              <div class="col-sample span-9">.col-9 (Contenu principal 75%)</div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [labNumber]="4"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 6px;

      h3 { font-size: 1.15rem; font-weight: 800; }
    }

    .active-bp-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      padding: 4px 10px;
      border-radius: 20px;

      .bp-tag {
        font-weight: 800;
        color: #c4b5fd;
        font-family: var(--font-mono);
      }
    }

    .panel-sub {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .viewport-controls {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 14px;

      .v-label { font-size: 0.82rem; font-weight: 600; min-width: 170px; }
      input[type="range"] { flex: 1; accent-color: #7952b3; }
      .v-width-display {
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: 1.05rem;
        color: #c4b5fd;
        min-width: 80px;
        text-align: right;
      }
    }

    .devices-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .device-btn {
        padding: 6px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-muted);
        font-size: 0.78rem;

        &:hover { color: var(--text-main); border-color: #7952b3; }
        &.active {
          background: #7952b3;
          color: white;
          border-color: #7952b3;
          font-weight: 700;
        }
      }
    }

    .bp-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;

      th {
        text-align: left;
        padding: 8px 12px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-color);
        color: var(--text-dim);
      }

      td {
        padding: 8px 12px;
        border-bottom: 1px solid var(--border-subtle);
        color: var(--text-muted);
      }

      tr.highlight td {
        background: rgba(121, 82, 179, 0.15);
        color: var(--text-main);
        font-weight: 600;
      }

      .status-active { color: #34d399; font-weight: 800; }
      .status-idle { color: var(--text-dim); }
    }

    .gutter-selector {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.8rem;

      .gutter-pills {
        display: flex;
        gap: 4px;
      }

      .g-pill {
        padding: 3px 8px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.75rem;
        font-family: var(--font-mono);
        color: var(--text-muted);

        &.active {
          background: #7952b3;
          color: white;
          border-color: #7952b3;
        }
      }
    }

    .ruler-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 4px;
      background: var(--bg-subtle);
      padding: 6px;
      border-radius: 6px;
      border: 1px solid var(--border-subtle);

      .ruler-col {
        background: rgba(121, 82, 179, 0.15);
        border: 1px dashed #7952b3;
        border-radius: 4px;
        padding: 4px;
        text-align: center;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        font-weight: 700;
        color: #c4b5fd;
      }
    }

    .responsive-card-demo {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;

      .demo-caption {
        font-size: 0.82rem;
        margin-bottom: 12px;
        code { color: #c4b5fd; font-weight: 700; margin: 0 4px; }
        .caption-explain { color: var(--text-muted); margin-left: 6px; }
      }
    }

    .dynamic-responsive-grid {
      display: flex;
      flex-wrap: wrap;
      transition: all 0.3s ease;
    }

    .responsive-grid-col {
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .inner-demo-box {
      background: var(--bg-card);
      border: 2px solid #7952b3;
      border-radius: 6px;
      padding: 14px;
      text-align: center;

      .box-title { font-weight: 700; font-size: 0.9rem; }
      .box-size-info { font-size: 0.75rem; color: #c4b5fd; font-family: var(--font-mono); margin-top: 4px; }
    }

    .preset-combinations {
      .comb-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-dim);
        margin-bottom: 8px;
      }

      .sample-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 6px;

        .col-sample {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid #3b82f6;
          border-radius: 4px;
          padding: 8px;
          text-align: center;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          color: white;

          &.span-12 { grid-column: span 12; background: rgba(121, 82, 179, 0.3); border-color: #7952b3; }
          &.span-6 { grid-column: span 6; }
          &.span-4 { grid-column: span 4; background: rgba(16, 185, 129, 0.2); border-color: #10b981; }
          &.span-3 { grid-column: span 3; background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; }
          &.span-9 { grid-column: span 9; background: rgba(245, 158, 11, 0.3); border-color: #f59e0b; }
        }
      }
    }
  `]
})
export class BootstrapGridComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');

  readonly viewportWidth = signal<number>(1040);
  readonly gutter = signal<number>(3);

  readonly breakpoints: BootstrapBreakpoint[] = [
    { name: 'Extra Small', infix: 'col-', minWidth: 0, devices: 'Smartphones verticaux', badgeClass: 'badge-warning' },
    { name: 'Small', infix: 'col-sm-', minWidth: 576, devices: 'Grands smartphones / phablettes', badgeClass: 'badge-purple' },
    { name: 'Medium', infix: 'col-md-', minWidth: 768, devices: 'Tablettes tactiles', badgeClass: 'badge-css' },
    { name: 'Large', infix: 'col-lg-', minWidth: 992, devices: 'Ordinateurs de bureau / portables', badgeClass: 'badge-bootstrap' },
    { name: 'Extra Large', infix: 'col-xl-', minWidth: 1200, devices: 'Grands écrans', badgeClass: 'badge-html' },
    { name: 'Extra Extra Large', infix: 'col-xxl-', minWidth: 1400, devices: 'Écrans très haute résolution', badgeClass: 'badge-success' }
  ];

  readonly activeBreakpoint = computed(() => {
    const w = this.viewportWidth();
    if (w >= 1400) return this.breakpoints[5];
    if (w >= 1200) return this.breakpoints[4];
    if (w >= 992) return this.breakpoints[3];
    if (w >= 768) return this.breakpoints[2];
    if (w >= 576) return this.breakpoints[1];
    return this.breakpoints[0];
  });

  onWidthChange(e: Event): void {
    this.viewportWidth.set(Number((e.target as HTMLInputElement).value));
  }

  getColumnBasis(): string {
    const w = this.viewportWidth();
    if (w >= 992) return 'calc(33.333% - 16px)'; // col-lg-4
    if (w >= 768) return 'calc(50% - 16px)'; // col-md-6
    return '100%'; // col-12
  }

  getColumnWidthText(): string {
    const w = this.viewportWidth();
    if (w >= 992) return 'col-lg-4 (3 par ligne · 33%)';
    if (w >= 768) return 'col-md-6 (2 par ligne · 50%)';
    return 'col-12 (1 par ligne · 100%)';
  }
}
