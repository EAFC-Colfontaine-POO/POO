import { Component, signal, computed } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface StepAction {
  code: string;
  explanation: string;
  stack: { name: string; type: 'primitive' | 'reference'; value: string; address: string; pointsTo?: string }[];
  heap: { address: string; label: string; data: Record<string, any>; isOrphan?: boolean }[];
}

@Component({
  selector: 'app-memory-visualizer',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 01 · MODÈLE MÉMOIRE</div>
        <h2>Le Modèle Mémoire : Pile (Stack) vs Tas (Heap)</h2>
        <p class="module-desc">
          Comprenez comment le processeur organise la mémoire vive (RAM). Les types primitifs vivent directement dans les cases fixes de la pile, tandis que les objets résident dans le tas dynamique et ne sont manipulés qu'à travers leurs adresses mémoires (références).
        </p>
      </div>

      <!-- Onglets Mode de travail -->
      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🖥️ Simulateur RAM Virtuelle</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 1 · 4 Exercices)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- Simulateur Interactif Pile vs Tas -->
        <div class="ram-simulator-grid">
          <!-- Panneau de Contrôle & Code -->
          <div class="card-panel controls-col">
            <div class="panel-section-title">
              <span>Scénario d'Exécution Mémoire</span>
              <span class="badge badge-ts">Étape {{ currentStep() + 1 }} / {{ steps.length }}</span>
            </div>

            <!-- Code TypeScript avec surlignage de la ligne courante -->
            <div class="code-execution-box">
              <div class="code-header">programme.ts</div>
              <pre class="code-lines">
@for (s of steps; track $index; let idx = $index) {
<div class="code-line" [class.active-line]="idx === currentStep()">
  <span class="line-num">{{ idx + 1 }}</span>
  <span class="line-text">{{ s.code }}</span>
  @if (idx === currentStep()) {
    <span class="exec-pointer">◀</span>
  }
</div>
}
              </pre>
            </div>

            <!-- Explication physique -->
            <div class="explanation-box">
              <div class="exp-title">🔬 Ce qui se passe physiquement en RAM :</div>
              <p class="exp-text">{{ currentStepData().explanation }}</p>
            </div>

            <!-- Boutons Pas-à-Pas -->
            <div class="stepper-actions">
              <button class="btn-secondary" (click)="prevStep()" [disabled]="currentStep() === 0">
                ◀ Précédent
              </button>
              <button class="btn-primary" (click)="nextStep()" [disabled]="currentStep() === steps.length - 1">
                Suivant ▶
              </button>
              <button class="btn-secondary" (click)="resetStepper()">
                ↺ Recommencer
              </button>
            </div>

            <!-- Synthèse Mémoire -->
            <div class="recap-cards">
              <div class="recap-card stack-card">
                <div class="recap-badge">📦 PILE (STACK)</div>
                <p>Taille fixe, rapide, valeurs copiées par duplication indépendante. Contient les primitifs et les adresses.</p>
              </div>
              <div class="recap-card heap-card">
                <div class="recap-badge">🏢 TAS (HEAP)</div>
                <p>Taille variable, dynamique. Contient les objets complets créés par les accolades ou <code>new</code>.</p>
              </div>
            </div>
          </div>

          <!-- Panneau Visualisation RAM (Pile à gauche, Tas à droite) -->
          <div class="card-panel memory-visual-col">
            <div class="ram-header">
              <h3>Cartographie de la RAM Virtuelle</h3>
              <span class="ram-status-badge">Temps réel · 64 bits</span>
            </div>

            <div class="ram-columns">
              <!-- Colonne Pile (Stack) -->
              <div class="memory-column stack-column">
                <div class="col-title">
                  <div class="col-icon">📦</div>
                  <div>
                    <div class="col-name">Pile (Stack)</div>
                    <div class="col-sub">LIFO · Adresses d'exécution</div>
                  </div>
                </div>

                <div class="cells-container">
                  @if (currentStepData().stack.length === 0) {
                    <div class="empty-col-notice">Pile vide</div>
                  }
                  @for (cell of currentStepData().stack; track cell.name) {
                    <div class="stack-cell" [class.is-ref]="cell.type === 'reference'">
                      <div class="cell-addr">{{ cell.address }}</div>
                      <div class="cell-content">
                        <span class="cell-var">{{ cell.name }} :</span>
                        @if (cell.type === 'primitive') {
                          <span class="cell-val-prim">{{ cell.value }}</span>
                        } @else {
                          <span class="cell-val-ref">{{ cell.value }}</span>
                        }
                      </div>
                      @if (cell.type === 'reference') {
                        <div class="pointer-tag">Pointe vers {{ cell.pointsTo }} ➔</div>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Colonne Tas (Heap) -->
              <div class="memory-column heap-column">
                <div class="col-title">
                  <div class="col-icon">🏢</div>
                  <div>
                    <div class="col-name">Tas (Heap)</div>
                    <div class="col-sub">Stockage dynamique des Objets</div>
                  </div>
                </div>

                <div class="cells-container">
                  @if (currentStepData().heap.length === 0) {
                    <div class="empty-col-notice">Tas inoccupé (aucun objet)</div>
                  }
                  @for (block of currentStepData().heap; track block.address) {
                    <div class="heap-block" [class.orphan]="block.isOrphan">
                      <div class="block-header">
                        <span class="block-addr">{{ block.address }}</span>
                        <span class="block-label">{{ block.label }}</span>
                      </div>
                      <div class="block-body">
                        @for (prop of getObjectKeys(block.data); track prop) {
                          <div class="block-prop">
                            <span class="prop-key">{{ prop }} :</span>
                            <span class="prop-val">{{ block.data[prop] }}</span>
                          </div>
                        }
                      </div>
                      @if (block.isOrphan) {
                        <div class="orphan-alert">⚠️ Objet orphelin (Éligible Garbage Collector)</div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Atelier Monaco -->
        <app-lab-runner [labNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .ram-simulator-grid {
      display: grid;
      grid-template-columns: 440px 1fr;
      gap: 20px;
      flex: 1;
      min-height: 540px;
    }

    .controls-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .panel-section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .code-execution-box {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .code-header {
        background: #111726;
        padding: 6px 12px;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--text-dim);
        border-bottom: 1px solid var(--border-subtle);
      }

      .code-lines {
        padding: 8px 0;
        font-family: var(--font-mono);
        font-size: 0.82rem;
        margin: 0;
      }

      .code-line {
        display: flex;
        align-items: center;
        padding: 3px 12px;
        gap: 12px;
        transition: background 0.15s;

        .line-num {
          color: var(--text-dim);
          width: 16px;
          text-align: right;
          font-size: 0.72rem;
        }

        .line-text {
          color: #e2e8f0;
          flex: 1;
        }

        .exec-pointer {
          color: #f59e0b;
          font-weight: 700;
        }

        &.active-line {
          background: rgba(49, 120, 198, 0.25);
          border-left: 3px solid var(--ts-blue);
          .line-text {
            color: #ffffff;
            font-weight: 600;
          }
        }
      }
    }

    .explanation-box {
      background: rgba(49, 120, 198, 0.08);
      border: 1px solid rgba(49, 120, 198, 0.25);
      border-radius: 8px;
      padding: 12px;

      .exp-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--ts-blue-light);
        margin-bottom: 4px;
      }

      .exp-text {
        font-size: 0.84rem;
        line-height: 1.45;
        color: var(--text-main);
      }
    }

    .stepper-actions {
      display: flex;
      gap: 10px;
    }

    .recap-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: auto;
    }

    .recap-card {
      padding: 10px;
      border-radius: 8px;
      font-size: 0.76rem;
      line-height: 1.35;

      p {
        color: var(--text-muted);
        margin-top: 4px;
      }

      &.stack-card {
        background: rgba(49, 120, 198, 0.06);
        border: 1px solid rgba(49, 120, 198, 0.2);
        .recap-badge { color: var(--ts-blue-light); font-weight: 700; }
      }

      &.heap-card {
        background: rgba(147, 51, 234, 0.06);
        border: 1px solid rgba(147, 51, 234, 0.2);
        .recap-badge { color: #c084fc; font-weight: 700; }
      }
    }

    .memory-visual-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ram-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .ram-status-badge {
        font-size: 0.72rem;
        color: #10b981;
        background: rgba(16, 185, 129, 0.12);
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: 600;
      }
    }

    .ram-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      flex: 1;
    }

    .memory-column {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .col-title {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-subtle);

        .col-icon { font-size: 1.3rem; }
        .col-name { font-weight: 700; font-size: 0.95rem; color: var(--text-main); }
        .col-sub { font-size: 0.72rem; color: var(--text-dim); }
      }
    }

    .cells-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .empty-col-notice {
      color: var(--text-dim);
      font-size: 0.8rem;
      text-align: center;
      padding: 40px 0;
      font-style: italic;
    }

    .stack-cell {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
      transition: all 0.25s;

      .cell-addr {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--text-dim);
      }

      .cell-content {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.88rem;
        font-weight: 600;
      }

      .cell-var { color: var(--text-main); }
      .cell-val-prim { color: #10b981; font-family: var(--font-mono); }
      .cell-val-ref { color: #f59e0b; font-family: var(--font-mono); }

      .pointer-tag {
        font-size: 0.72rem;
        color: #f59e0b;
        font-weight: 600;
        margin-top: 2px;
      }

      &.is-ref {
        border-left: 3px solid #f59e0b;
      }
    }

    .heap-block {
      background: var(--bg-card);
      border: 1px solid rgba(147, 51, 234, 0.4);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(147, 51, 234, 0.08);
      transition: all 0.25s;

      .block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-subtle);
        padding-bottom: 6px;

        .block-addr {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #c084fc;
          font-weight: 700;
        }

        .block-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
      }

      .block-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .block-prop {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 0.82rem;

        .prop-key { color: var(--text-muted); }
        .prop-val { color: #38bdf8; font-weight: 600; }
      }

      &.orphan {
        opacity: 0.5;
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.05);

        .orphan-alert {
          font-size: 0.72rem;
          color: #ef4444;
          font-weight: 600;
          margin-top: 4px;
        }
      }
    }
  `]
})
export class MemoryVisualizerComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly currentStep = signal<number>(0);

  readonly steps: StepAction[] = [
    {
      code: 'let age = 25;',
      explanation: 'Allocation d\'une case de taille fixe dans la pile (Stack) à l\'adresse 0x7FFE001. La valeur primitive 25 y est stockée directement.',
      stack: [
        { name: 'age', type: 'primitive', value: '25', address: '0x7FFE001' }
      ],
      heap: []
    },
    {
      code: 'let autre = age;',
      explanation: 'Passage par valeur : une nouvelle case mémoire distincte (0x7FFE002) est allouée dans la pile. Les octets de la valeur 25 y sont dupliqués. Les deux cases sont désormais totalement indépendantes.',
      stack: [
        { name: 'age', type: 'primitive', value: '25', address: '0x7FFE001' },
        { name: 'autre', type: 'primitive', value: '25', address: '0x7FFE002' }
      ],
      heap: []
    },
    {
      code: 'autre = 30;',
      explanation: 'La case 0x7FFE002 reçoit la valeur 30. La case 0x7FFE001 (age) reste intacte à 25. C\'est l\'indépendance parfaite des types primitifs.',
      stack: [
        { name: 'age', type: 'primitive', value: '25', address: '0x7FFE001' },
        { name: 'autre', type: 'primitive', value: '30', address: '0x7FFE002' }
      ],
      heap: []
    },
    {
      code: 'let joueur = { score: 100 };',
      explanation: 'Un objet a une taille dynamique : il est alloué dans le tas (Heap) à l\'adresse 0x1A4F. Dans la pile, la variable "joueur" ne stocke que cette adresse (le ticket de retrait) !',
      stack: [
        { name: 'age', type: 'primitive', value: '25', address: '0x7FFE001' },
        { name: 'autre', type: 'primitive', value: '30', address: '0x7FFE002' },
        { name: 'joueur', type: 'reference', value: '0x1A4F', address: '0x7FFE003', pointsTo: '0x1A4F' }
      ],
      heap: [
        { address: '0x1A4F', label: 'Object { score }', data: { score: 100 } }
      ]
    },
    {
      code: 'joueur.score = 150;',
      explanation: 'Le processeur lit l\'adresse 0x1A4F dans la pile, suit le pointeur jusqu\'au tas et modifie la case "score" dans le bloc d\'origine.',
      stack: [
        { name: 'age', type: 'primitive', value: '25', address: '0x7FFE001' },
        { name: 'autre', type: 'primitive', value: '30', address: '0x7FFE002' },
        { name: 'joueur', type: 'reference', value: '0x1A4F', address: '0x7FFE003', pointsTo: '0x1A4F' }
      ],
      heap: [
        { address: '0x1A4F', label: 'Object { score }', data: { score: 150 } }
      ]
    },
    {
      code: 'joueur = null;',
      explanation: 'La variable dans la pile est vidée (null). L\'objet dans le tas (0x1A4F) n\'est plus référencé par aucune variable : il devient orphelin et sera nettoyé par le Garbage Collector.',
      stack: [
        { name: 'age', type: 'primitive', value: '25', address: '0x7FFE001' },
        { name: 'autre', type: 'primitive', value: '30', address: '0x7FFE002' },
        { name: 'joueur', type: 'primitive', value: 'null', address: '0x7FFE003' }
      ],
      heap: [
        { address: '0x1A4F', label: 'Object { score }', data: { score: 150 }, isOrphan: true }
      ]
    }
  ];

  readonly currentStepData = computed(() => {
    return this.steps[this.currentStep()];
  });

  nextStep(): void {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }

  resetStepper(): void {
    this.currentStep.set(0);
  }

  getObjectKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }
}
