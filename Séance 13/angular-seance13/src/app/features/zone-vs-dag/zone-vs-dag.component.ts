import { Component, signal, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

interface TreeNode {
  id: string;
  name: string;
  role: string;
  isTarget?: boolean;
  status: 'idle' | 'checking' | 'updated';
}

@Component({
  selector: 'app-zone-vs-dag',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 13 · Module 01</span>
          <span class="badge badge-purple">La Révolution Zoneless</span>
          <span class="badge badge-blue">Graphe DAG</span>
          <span class="badge badge-warning">Fin du Dirty Checking</span>
        </div>
        <h2>La Fin de Zone.js & Le DAG Réactif (Gare Centrale & Tableur Excel)</h2>
        <p class="module-desc">
          Visualisez la rupture technologique majeure d'Angular 22 : l'abandon du parcours d'arbre aveugle de Zone.js au profit d'un Graphe Orienté Acyclique (DAG) reliant chirurgicalement chaque signal à son nœud HTML exact.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Simulateur Visuel (Gare Centrale & Excel)
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 1 · 5 Défis)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="simulators-workbench">

          <!-- 1. SIMULATEUR COMPARATIF : GARE CENTRALE (ZONE.JS VS SIGNALS) -->
          <div class="card-panel sim-card">
            <div class="sim-card-header">
              <div class="badge-title">
                <span class="badge badge-purple">Simulateur #1</span>
                <h3>L'Analogie de la Gare Centrale : Zone.js vs Angular Signals</h3>
              </div>
              <div class="mode-selector-pills">
                <button 
                  class="pill-btn" 
                  [class.active]="detectionMode() === 'zone'"
                  (click)="setDetectionMode('zone')"
                >
                  🕵️ Mode Ancien (Zone.js & Dirty Checking)
                </button>
                <button 
                  class="pill-btn" 
                  [class.active]="detectionMode() === 'signals'"
                  (click)="setDetectionMode('signals')"
                >
                  ⚡ Mode Moderne (Signals DAG & Zoneless)
                </button>
              </div>
            </div>

            <!-- Explication du mode sélectionné -->
            <div class="mode-banner" [class.zone]="detectionMode() === 'zone'" [class.signals]="detectionMode() === 'signals'">
              @if (detectionMode() === 'zone') {
                <div class="banner-text">
                  <strong>🕵️ Modèle Patrimonial (Zone.js) :</strong> Un clic sur le bouton déclenche un événement asynchrone intercepté. Ne sachant pas <em>où</em> la donnée a changé, Angular déclenche une onde qui parcourt TOUT l'arbre de composants du haut vers le bas !
                </div>
              } @else {
                <div class="banner-text">
                  <strong>⚡ Modèle Moderne (Signals DAG) :</strong> Le signal 'compteur' sait exactement qui l'écoute. La modification allume un câble optique direct vers le nœud HTML exact. Les autres composants dorment paisiblement.
                </div>
              }
            </div>

            <!-- Arbre de composants interactif -->
            <div class="tree-workbench">
              <div class="tree-controls">
                <button class="btn-primary btn-sm" (click)="triggerClick()" [disabled]="isSimulating()">
                  🎮 Cliquer sur le bouton Compteur (+1)
                </button>
                <button class="btn-secondary btn-sm" (click)="resetTree()" [disabled]="isSimulating()">
                  ↺ Réinitialiser
                </button>
                <div class="metrics-row">
                  <span class="metric-pill">
                    Compteur : <strong>{{ countValue() }}</strong>
                  </span>
                  <span class="metric-pill" [class.bad]="checksCount() > 1" [class.good]="checksCount() === 1">
                    Nœuds inspectés : <strong>{{ checksCount() }}</strong> / 8
                  </span>
                  <span class="metric-pill good">
                    Cycles gaspillés évités : <strong>{{ cyclesSaved() }}</strong>
                  </span>
                </div>
              </div>

              <!-- Visualisation Graphique de l'Arbre -->
              <div class="tree-canvas">
                <div class="tree-level level-0">
                  <div class="node-card" [class]="getNodeClass('root')">
                    <div class="node-title">[App Root]</div>
                    <div class="node-status">{{ getNodeStatus('root') }}</div>
                  </div>
                </div>

                <div class="tree-branch-lines lines-level-1"></div>

                <div class="tree-level level-1">
                  <div class="node-card" [class]="getNodeClass('nav')">
                    <div class="node-title">[Navigation]</div>
                    <div class="node-status">{{ getNodeStatus('nav') }}</div>
                  </div>
                  <div class="node-card" [class]="getNodeClass('page')">
                    <div class="node-title">[Page Dashboard]</div>
                    <div class="node-status">{{ getNodeStatus('page') }}</div>
                  </div>
                </div>

                <div class="tree-branch-lines lines-level-2"></div>

                <div class="tree-level level-2">
                  <div class="node-card" [class]="getNodeClass('menu')">
                    <div class="node-title">[Menu Profil]</div>
                    <div class="node-status">{{ getNodeStatus('menu') }}</div>
                  </div>
                  <div class="node-card" [class]="getNodeClass('stats')">
                    <div class="node-title">[Statistiques]</div>
                    <div class="node-status">{{ getNodeStatus('stats') }}</div>
                  </div>
                  <div class="node-card target-node" [class]="getNodeClass('counter')">
                    <div class="node-title">[CompteurWidget] 🎯</div>
                    <div class="node-status font-mono">{{ getNodeStatus('counter') }}</div>
                    <div class="node-preview">
                      <span class="val-badge">{{ countValue() }}</span>
                    </div>
                  </div>
                  <div class="node-card" [class]="getNodeClass('footer')">
                    <div class="node-title">[Footer]</div>
                    <div class="node-status">{{ getNodeStatus('footer') }}</div>
                  </div>
                </div>

                @if (detectionMode() === 'signals' && isSimulating()) {
                  <div class="laser-cable-overlay">
                    <div class="laser-pulse"></div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- 2. SIMULATEUR TABLEUR EXCEL (LAZY EVALUATION & MEMOIZATION) -->
          <div class="card-panel excel-card mt-3">
            <div class="sim-card-header">
              <div class="badge-title">
                <span class="badge badge-blue">Simulateur #2</span>
                <h3>L'Analogie du Tableur Excel : Évaluation Paresseuse & Mémoïsation</h3>
              </div>
              <span class="badge badge-success">Glitch-Free DAG</span>
            </div>

            <p class="text-muted mb-3" style="font-size: 0.86rem;">
              Un <code>signal()</code> est une cellule brute (ex: A1). Un <code>computed()</code> est une formule de tableur (ex: B1 = A1 * 2). Modifiez A1 ci-dessous : observez comment B1 et C1 ne recalculent <strong>que</strong> si nécessaire, tandis que les cellules D1 et E1 restent totalement indemnes !
            </p>

            <div class="excel-grid-container">
              <div class="excel-table">
                <!-- En-tête des colonnes -->
                <div class="excel-row header-row">
                  <div class="excel-cell index-col">#</div>
                  <div class="excel-cell">Colonne A (Signal Source)</div>
                  <div class="excel-cell">Colonne B (computed = A * 2)</div>
                  <div class="excel-cell">Colonne C (computed = B + 10)</div>
                  <div class="excel-cell">Colonne D (Texte Statique)</div>
                  <div class="excel-cell">Colonne E (Autre Signal)</div>
                </div>

                <!-- Ligne 1 -->
                <div class="excel-row">
                  <div class="excel-cell index-col">1</div>
                  
                  <!-- Cellule A1 : Signal Source -->
                  <div class="excel-cell cell-source">
                    <div class="cell-header-tag">
                      <span class="tag-name">A1 : signal</span>
                      <span class="tag-type">Source mutable</span>
                    </div>
                    <div class="cell-input-row">
                      <input 
                        type="number" 
                        [value]="cellA1()" 
                        (input)="onInputA1($event)"
                        class="excel-input"
                      />
                      <button class="btn-mini-step" (click)="stepA1(1)">+1</button>
                      <button class="btn-mini-step" (click)="stepA1(-1)">-1</button>
                    </div>
                    <div class="cell-footer-stat">Mutations directes : {{ a1Mutations() }}</div>
                  </div>

                  <!-- Cellule B1 : Computed = A1 * 2 -->
                  <div class="excel-cell cell-computed" [class.recomputed]="justRecomputedB1()">
                    <div class="cell-header-tag">
                      <span class="tag-name">B1 : computed</span>
                      <span class="tag-formula">= A1 * 2</span>
                    </div>
                    <div class="cell-value-display">
                      <span class="excel-num-val">{{ cellB1() }}</span>
                      @if (justRecomputedB1()) {
                        <span class="pulse-recalc">Recalculé !</span>
                      } @else {
                        <span class="cached-tag">En Cache</span>
                      }
                    </div>
                    <div class="cell-footer-stat">Recalculs réels : {{ b1CalculationsCount() }}</div>
                  </div>

                  <!-- Cellule C1 : Computed = B1 + 10 -->
                  <div class="excel-cell cell-computed" [class.recomputed]="justRecomputedC1()">
                    <div class="cell-header-tag">
                      <span class="tag-name">C1 : computed</span>
                      <span class="tag-formula">= B1 + 10</span>
                    </div>
                    <div class="cell-value-display">
                      <span class="excel-num-val">{{ cellC1() }}</span>
                      @if (justRecomputedC1()) {
                        <span class="pulse-recalc">Recalculé !</span>
                      } @else {
                        <span class="cached-tag">En Cache</span>
                      }
                    </div>
                    <div class="cell-footer-stat">Recalculs réels : {{ c1CalculationsCount() }}</div>
                  </div>

                  <!-- Cellule D1 : Texte statique -->
                  <div class="excel-cell cell-static">
                    <div class="cell-header-tag">
                      <span class="tag-name">D1 : statique</span>
                      <span class="tag-type">Immuable</span>
                    </div>
                    <div class="cell-value-display">
                      <span class="excel-text-val">"Bruxelles"</span>
                    </div>
                    <div class="cell-footer-stat text-dim">Recalculs : 0 (Dort)</div>
                  </div>

                  <!-- Cellule E1 : Signal non relié -->
                  <div class="excel-cell cell-unrelated">
                    <div class="cell-header-tag">
                      <span class="tag-name">E1 : signal</span>
                      <span class="tag-type">Indépendant</span>
                    </div>
                    <div class="cell-value-display">
                      <span class="excel-num-val">{{ cellE1() }}</span>
                    </div>
                    <div class="cell-footer-stat text-dim">Recalculs : 0 (Dort)</div>
                  </div>
                </div>
              </div>

              <!-- Explications interactives du DAG -->
              <div class="dag-explanation-panel card-panel mt-3">
                <div class="dag-flow-row">
                  <div class="flow-step">
                    <span class="step-badge">Source</span>
                    <strong>A1 ({{ cellA1() }})</strong>
                  </div>
                  <div class="flow-arrow">➔</div>
                  <div class="flow-step">
                    <span class="step-badge">Projection pure</span>
                    <strong>B1 ({{ cellB1() }})</strong>
                  </div>
                  <div class="flow-arrow">➔</div>
                  <div class="flow-step">
                    <span class="step-badge">Projection transitive</span>
                    <strong>C1 ({{ cellC1() }})</strong>
                  </div>
                </div>
                <div class="dag-note">
                  💡 <strong>Garantie sans glitch (*Glitch-Free*) :</strong> C1 attend que B1 ait terminé sa transition avant d'évaluer sa formule. Aucune valeur incohérente ou intermédiaire n'apparaît à l'écran.
                </div>
              </div>
            </div>
          </div>

        </div>
      } @else {
        <!-- Mode Exercices : Labo 1 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="1"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .sim-card {
      padding: 20px;
    }

    .sim-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      flex-wrap: wrap;
      gap: 12px;

      h3 {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
        margin-top: 4px;
      }
    }

    .mode-selector-pills {
      display: flex;
      gap: 8px;
    }

    .pill-btn {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        color: var(--text-main);
        background: var(--bg-card-hover);
      }

      &.active {
        background: var(--bs-purple);
        color: #fff;
        border-color: var(--bs-purple-light);
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.4);
      }
    }

    .mode-banner {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.85rem;
      line-height: 1.45;

      &.zone {
        background: rgba(244, 63, 94, 0.12);
        border: 1px solid rgba(244, 63, 94, 0.3);
        color: #fecdd3;
      }

      &.signals {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #a7f3d0;
      }
    }

    .tree-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tree-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .metrics-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
      flex-wrap: wrap;
    }

    .metric-pill {
      font-size: 0.76rem;
      padding: 4px 10px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      strong {
        color: var(--text-main);
        font-family: var(--font-mono);
      }

      &.good strong {
        color: #34d399;
      }

      &.bad strong {
        color: #f87171;
      }
    }

    .tree-canvas {
      position: relative;
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      overflow: hidden;
    }

    .tree-level {
      display: flex;
      justify-content: center;
      gap: 16px;
      width: 100%;
      flex-wrap: wrap;
    }

    .node-card {
      width: 150px;
      padding: 10px 12px;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      transition: all 0.25s ease;

      .node-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .node-status {
        font-size: 0.68rem;
        color: var(--text-dim);
      }

      &.idle {
        opacity: 0.85;
      }

      &.checking {
        border-color: #f43f5e;
        background: rgba(244, 63, 94, 0.2);
        box-shadow: 0 0 15px rgba(244, 63, 94, 0.5);
        transform: scale(1.05);

        .node-status {
          color: #fca5a5;
          font-weight: 700;
        }
      }

      &.updated {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.2);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
        transform: scale(1.08);

        .node-status {
          color: #86efac;
          font-weight: 800;
        }
      }

      &.target-node {
        border-width: 2px;
      }
    }

    .val-badge {
      display: inline-block;
      margin-top: 4px;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--bs-purple);
      color: #fff;
      font-weight: 800;
      font-family: var(--font-mono);
      font-size: 0.82rem;
    }

    .laser-cable-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border: 2px dashed #10b981;
      border-radius: 8px;
      animation: laser-beam 0.8s ease-in-out infinite;
    }

    /* Tableur Excel */
    .excel-grid-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .excel-table {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .excel-row {
      display: grid;
      grid-template-columns: 45px repeat(5, 1fr);
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }

      &.header-row {
        background: var(--bg-subtle);
        font-weight: 700;
        font-size: 0.74rem;
        color: var(--text-muted);
        text-transform: uppercase;
      }
    }

    .excel-cell {
      padding: 12px;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: var(--bg-card);
      transition: background 0.3s ease;

      &:last-child {
        border-right: none;
      }

      &.index-col {
        align-items: center;
        justify-content: center;
        background: var(--bg-subtle);
        font-family: var(--font-mono);
        font-weight: 700;
        color: var(--text-dim);
      }

      &.recomputed {
        background: rgba(16, 185, 129, 0.15) !important;
        border-color: #10b981;
      }
    }

    .cell-header-tag {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .tag-name {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--bs-purple-light);
      }

      .tag-type, .tag-formula {
        font-size: 0.65rem;
        padding: 1px 5px;
        border-radius: 3px;
        background: var(--bg-subtle);
        color: var(--text-dim);
      }

      .tag-formula {
        color: #38bdf8;
        font-family: var(--font-mono);
      }
    }

    .cell-input-row {
      display: flex;
      align-items: center;
      gap: 6px;

      .excel-input {
        width: 65px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 4px 8px;
        color: var(--text-main);
        font-family: var(--font-mono);
        font-size: 0.9rem;
        font-weight: 700;
      }

      .btn-mini-step {
        padding: 4px 8px;
        border-radius: 4px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-main);
        font-size: 0.72rem;
        font-weight: 700;

        &:hover {
          background: var(--bg-card-hover);
        }
      }
    }

    .cell-value-display {
      display: flex;
      align-items: center;
      gap: 8px;

      .excel-num-val {
        font-size: 1.25rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: #38bdf8;
      }

      .excel-text-val {
        font-size: 1rem;
        font-family: var(--font-mono);
        color: var(--text-muted);
      }

      .pulse-recalc {
        font-size: 0.65rem;
        font-weight: 800;
        color: #34d399;
        background: rgba(16, 185, 129, 0.2);
        padding: 2px 6px;
        border-radius: 4px;
      }

      .cached-tag {
        font-size: 0.65rem;
        color: var(--text-dim);
        background: var(--bg-subtle);
        padding: 2px 6px;
        border-radius: 4px;
      }
    }

    .cell-footer-stat {
      font-size: 0.68rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    .dag-explanation-panel {
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .dag-flow-row {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.85rem;

      .flow-step {
        display: flex;
        align-items: center;
        gap: 6px;
        background: var(--bg-subtle);
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid var(--border-color);

        .step-badge {
          font-size: 0.65rem;
          color: var(--bs-purple-light);
          font-weight: 700;
        }

        strong {
          color: var(--text-main);
          font-family: var(--font-mono);
        }
      }

      .flow-arrow {
        color: var(--text-dim);
        font-weight: 800;
      }
    }

    .dag-note {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  `]
})
export class ZoneVsDagComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');
  readonly detectionMode = signal<'zone' | 'signals'>('signals');
  readonly countValue = signal<number>(10);
  readonly isSimulating = signal<boolean>(false);
  readonly checksCount = signal<number>(1);
  readonly cyclesSaved = signal<number>(0);

  // Nœuds de l'arbre
  readonly nodeStates = signal<Record<string, 'idle' | 'checking' | 'updated'>>({
    root: 'idle',
    nav: 'idle',
    page: 'idle',
    menu: 'idle',
    stats: 'idle',
    counter: 'idle',
    footer: 'idle'
  });

  // Tableur Excel
  readonly cellA1 = signal<number>(10);
  readonly a1Mutations = signal<number>(0);
  readonly cellE1 = signal<number>(99);

  // Recalculs et mémoïsation
  readonly b1CalculationsCount = signal<number>(1);
  readonly c1CalculationsCount = signal<number>(1);
  readonly justRecomputedB1 = signal<boolean>(false);
  readonly justRecomputedC1 = signal<boolean>(false);

  readonly cellB1 = computed(() => {
    const val = this.cellA1();
    return val * 2;
  });

  readonly cellC1 = computed(() => {
    return this.cellB1() + 10;
  });

  setDetectionMode(mode: 'zone' | 'signals'): void {
    this.detectionMode.set(mode);
    this.resetTree();
  }

  resetTree(): void {
    this.nodeStates.set({
      root: 'idle',
      nav: 'idle',
      page: 'idle',
      menu: 'idle',
      stats: 'idle',
      counter: 'idle',
      footer: 'idle'
    });
    this.checksCount.set(this.detectionMode() === 'signals' ? 1 : 0);
  }

  triggerClick(): void {
    if (this.isSimulating()) return;
    this.isSimulating.set(true);

    if (this.detectionMode() === 'zone') {
      this.simulateZoneWave();
    } else {
      this.simulateSignalDirect();
    }
  }

  private simulateZoneWave(): void {
    const sequence = ['root', 'nav', 'page', 'menu', 'stats', 'counter', 'footer'];
    let idx = 0;
    this.checksCount.set(0);

    const interval = setInterval(() => {
      if (idx < sequence.length) {
        const id = sequence[idx];
        this.checksCount.update(c => c + 1);
        this.nodeStates.update(s => ({
          ...s,
          [id]: id === 'counter' ? 'updated' : 'checking'
        }));
        idx++;
      } else {
        clearInterval(interval);
        this.countValue.update(v => v + 1);
        setTimeout(() => {
          this.isSimulating.set(false);
        }, 400);
      }
    }, 180);
  }

  private simulateSignalDirect(): void {
    this.checksCount.set(1);
    this.cyclesSaved.update(c => c + 7);
    this.nodeStates.update(s => ({
      ...s,
      counter: 'updated'
    }));

    setTimeout(() => {
      this.countValue.update(v => v + 1);
      this.isSimulating.set(false);
    }, 300);
  }

  getNodeClass(id: string): string {
    const state = this.nodeStates()[id] || 'idle';
    return state;
  }

  getNodeStatus(id: string): string {
    const state = this.nodeStates()[id] || 'idle';
    if (state === 'checking') return 'Vérification...';
    if (state === 'updated') return 'Mis à jour !';
    return 'En veille';
  }

  onInputA1(event: Event): void {
    const target = event.target as HTMLInputElement;
    const num = parseInt(target.value, 10);
    if (!isNaN(num)) {
      this.stepA1To(num);
    }
  }

  stepA1(delta: number): void {
    this.stepA1To(this.cellA1() + delta);
  }

  private stepA1To(val: number): void {
    this.cellA1.set(val);
    this.a1Mutations.update(m => m + 1);
    this.b1CalculationsCount.update(c => c + 1);
    this.c1CalculationsCount.update(c => c + 1);

    this.justRecomputedB1.set(true);
    this.justRecomputedC1.set(true);

    setTimeout(() => {
      this.justRecomputedB1.set(false);
      this.justRecomputedC1.set(false);
    }, 600);
  }
}
