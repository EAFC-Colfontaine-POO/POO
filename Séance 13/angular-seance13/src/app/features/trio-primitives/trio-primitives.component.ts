import { Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-trio-primitives',
  standalone: true,
  imports: [CodeRunnerComponent, DecimalPipe],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 13 · Module 02</span>
          <span class="badge badge-purple">Trio Réactif</span>
          <span class="badge badge-blue">signal · computed · effect</span>
          <span class="badge badge-warning">onCleanup & NG0600</span>
        </div>
        <h2>Le Trio Réactif Fondamental : signal(), computed() & effect()</h2>
        <p class="module-desc">
          Explorez le rôle strict et non interchangeable de chaque primitive : la source mutable avec son hameçon d'abonnement, la projection pure avec son cache de mémoïsation, et l'effet de bord avec son cycle de vie contrôlé.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Banc d'Essai Interactif du Trio
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 2 · 4 Défis)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="trio-workbench">

          <!-- 1. LABORATOIRE SIGNAL<T>() -->
          <div class="card-panel trio-card">
            <div class="card-title-row">
              <div class="badge-title">
                <span class="badge badge-purple">1️⃣ Le Producteur d'État</span>
                <h3>Laboratoire signal&lt;T&gt;() : .set() vs .update() & L'Hameçon ()</h3>
              </div>
            </div>

            <div class="grid-2-cols">
              <!-- Démonstrateur .set() vs .update() -->
              <div class="sub-panel">
                <div class="panel-header-mini">Mutation d'État : .set() vs .update()</div>
                <div class="action-row">
                  <button class="btn-primary btn-sm" (click)="demoSet()">
                    .set(100)
                  </button>
                  <button class="btn-secondary btn-sm" (click)="demoUpdate()">
                    .update(n =&gt; n + 5)
                  </button>
                  <button class="btn-ghost btn-sm" (click)="resetSignalDemo()">
                    ↺ Reset
                  </button>
                </div>

                <div class="signal-viewer-box mt-3">
                  <div class="signal-prop">
                    <span class="prop-label">Valeur courante score() :</span>
                    <span class="prop-val">{{ demoScore() }}</span>
                  </div>
                  <div class="signal-prop">
                    <span class="prop-label">Dernière opération :</span>
                    <span class="prop-val-code">{{ lastSignalOp() }}</span>
                  </div>
                </div>

                <div class="expl-mini mt-2">
                  💡 <code>.set(val)</code> écrase sans regarder le passé (ex: reset, données HTTP).<br>
                  💡 <code>.update(fn)</code> applique une transition fonctionnelle à partir de l'ancienne valeur (ex: incrément, ajout).
                </div>
              </div>

              <!-- Démonstrateur de lecture fonctionnelle : L'hameçon () -->
              <div class="sub-panel">
                <div class="panel-header-mini">🔬 L'Hameçon Invisible : Pourquoi des parenthèses () ?</div>
                <div class="hook-demo-container">
                  <div class="hook-status-card" [class.hooked]="isHookActive()">
                    <div class="hook-visual">
                      <span class="hook-icon">🪝</span>
                      <span class="hook-wire" [class.active]="isHookActive()"></span>
                    </div>
                    <div class="hook-info">
                      <div class="hook-title">Exécution de <code>score()</code></div>
                      <div class="hook-desc">{{ hookMessage() }}</div>
                    </div>
                  </div>

                  <div class="hook-actions mt-3">
                    <button class="btn-secondary btn-sm" (click)="simulateReadWithParentheses()">
                      Lire avec parenthèses score()
                    </button>
                    <button class="btn-secondary btn-sm" (click)="simulateReadWithoutParentheses()">
                      Lire sans parenthèses score
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. INSPECTEUR DE COMPUTED<T>() -->
          <div class="card-panel trio-card mt-3">
            <div class="card-title-row">
              <div class="badge-title">
                <span class="badge badge-blue">2️⃣ La Projection Pure</span>
                <h3>Inspecteur de computed&lt;T&gt;() : Évaluation Paresseuse & Mémoïsation</h3>
              </div>
            </div>

            <div class="computed-inspector-grid">
              <!-- Paramètres amont -->
              <div class="sub-panel">
                <div class="panel-header-mini">Sources Primaires (Signaux)</div>
                <div class="source-ctrl-row">
                  <label>prixHT (signal) :</label>
                  <input type="number" [value]="sourcePrixHT()" (input)="onPrixHTChange($event)" class="num-field" />
                  <span class="unit">€</span>
                </div>
                <div class="source-ctrl-row mt-2">
                  <label>tauxTVA (signal) :</label>
                  <select [value]="sourceTva()" (change)="onTvaChange($event)" class="select-field">
                    <option value="0.06">6% (Taux réduit)</option>
                    <option value="0.12">12% (Restauration)</option>
                    <option value="0.21">21% (Taux standard)</option>
                  </select>
                </div>

                <div class="mt-3">
                  <button class="btn-secondary btn-sm" (click)="readComputedMultipleTimes()">
                    Lire prixTTC() 5 fois de suite
                  </button>
                </div>
              </div>

              <!-- État dérivé & Cache -->
              <div class="sub-panel">
                <div class="panel-header-mini">Projection Dérivée prixTTC = computed(...)</div>
                <div class="computed-result-display">
                  <div class="main-res">
                    <span class="res-num">{{ computedPrixTTC() | number:'1.2-2' }} €</span>
                    <span class="res-badge">Lecture Seule (Readonly)</span>
                  </div>

                  <div class="cache-metrics-grid mt-2">
                    <div class="metric-box">
                      <span class="m-lbl">Lectures dans le template :</span>
                      <span class="m-val">{{ totalReads() }}</span>
                    </div>
                    <div class="metric-box">
                      <span class="m-lbl">Exécutions réelles du calcul :</span>
                      <span class="m-val highlight">{{ actualCalculations() }}</span>
                    </div>
                    <div class="metric-box">
                      <span class="m-lbl">Lectures servies par le cache :</span>
                      <span class="m-val good">{{ totalReads() - actualCalculations() }}</span>
                    </div>
                  </div>
                </div>

                <div class="expl-mini mt-2">
                  ⚡ <strong>Mémoïsation en action :</strong> Même si le template affiche prixTTC() 5 fois par cycle, le calcul JavaScript n'est exécuté qu'<strong>une seule fois</strong> tant que prixHT et tauxTVA ne changent pas !
                </div>
              </div>
            </div>
          </div>

          <!-- 3. BANC D'ESSAI DE EFFECT() -->
          <div class="card-panel trio-card mt-3">
            <div class="card-title-row">
              <div class="badge-title">
                <span class="badge badge-warning">3️⃣ L'Effet de Bord Contrôlé</span>
                <h3>Banc d'Essai de effect() : Contexte d'Injection, onCleanup & Anti-Pattern NG0600</h3>
              </div>
            </div>

            <div class="grid-3-cols">
              <!-- Test 1 : Contexte d'injection -->
              <div class="sub-panel">
                <div class="panel-header-mini">Test 1 : Contexte d'Injection (NG0203)</div>
                <p class="sub-desc">Où a-t-on le droit de créer un effect() ?</p>

                <div class="btn-col-group">
                  <button class="btn-secondary btn-sm" (click)="testInjectionContext('constructor')">
                    1. Dans constructor() ✅
                  </button>
                  <button class="btn-secondary btn-sm" (click)="testInjectionContext('method')">
                    2. Dans onClick() ❌
                  </button>
                </div>

                <div class="diag-result-box mt-3" [class.error]="injectionError()" [class.success]="!injectionError() && injectionTested()">
                  @if (!injectionTested()) {
                    <span class="dim">Cliquez pour tester l'injection</span>
                  } @else if (injectionError()) {
                    <div class="err-msg">
                      <strong>💥 NG0203 :</strong> effect() can only be used within an injection context.
                    </div>
                  } @else {
                    <div class="ok-msg">
                      <strong>✔ Contexte valide :</strong> L'effet est correctement rattaché au cycle de vie du composant.
                    </div>
                  }
                </div>
              </div>

              <!-- Test 2 : Nettoyage onCleanup -->
              <div class="sub-panel">
                <div class="panel-header-mini">Test 2 : Nettoyage de timer (onCleanup)</div>
                <p class="sub-desc">Simulation d'un setInterval surveillant un article :</p>

                <div class="action-row">
                  <button class="btn-primary btn-sm" (click)="switchArticleId()">
                    Changer articleId ({{ currentArticleId() }} ➔ {{ nextArticleId() }})
                  </button>
                </div>

                <div class="timer-audit-box mt-3">
                  @for (log of cleanupLogs(); track $index) {
                    <div class="audit-line">
                      {{ log }}
                    </div>
                  }
                </div>

                <div class="expl-mini mt-2">
                  🛡️ L'ancien timer est détruit par onCleanup AVANT de démarrer le nouveau : zéro fuite mémoire !
                </div>
              </div>

              <!-- Test 3 : Anti-Pattern NG0600 -->
              <div class="sub-panel">
                <div class="panel-header-mini">Test 3 : Écriture Interdite (NG0600)</div>
                <p class="sub-desc">Que se passe-t-il si un effect() modifie un signal ?</p>

                <div class="action-row">
                  <button class="btn-secondary btn-sm" (click)="simulateNg0600()">
                    Tenter effect(() =&gt; s.set(...))
                  </button>
                </div>

                <div class="diag-result-box mt-3" [class.error]="ng0600Active()">
                  @if (ng0600Active()) {
                    <div class="err-msg">
                      <strong>💥 NG0600 :</strong> Writing to signals is not allowed in a computed or an effect by default.
                      <p class="mini-fix mt-1">👉 Solution : Remplacez cet effet par un computed() !</p>
                    </div>
                  } @else {
                    <span class="dim">Cliquez pour déclencher l'erreur de sécurité</span>
                  }
                </div>
              </div>
            </div>
          </div>

        </div>
      } @else {
        <!-- Mode Exercices : Labo 2 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="2"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .trio-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .trio-card {
      padding: 20px;
    }

    .card-title-row {
      margin-bottom: 14px;

      h3 {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
        margin-top: 4px;
      }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .grid-3-cols {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 1050px) {
        grid-template-columns: 1fr;
      }
    }

    .sub-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
    }

    .panel-header-mini {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--bs-purple-light);
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .sub-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    .action-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .signal-viewer-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .signal-prop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;

      .prop-label {
        color: var(--text-muted);
      }

      .prop-val {
        font-size: 1.1rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: #38bdf8;
      }

      .prop-val-code {
        font-family: var(--font-mono);
        font-size: 0.76rem;
        color: #34d399;
      }
    }

    .expl-mini {
      font-size: 0.74rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Hameçon */
    .hook-status-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s ease;

      &.hooked {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.1);
      }
    }

    .hook-visual {
      font-size: 1.6rem;
    }

    .hook-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .hook-desc {
      font-size: 0.76rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .hook-actions {
      display: flex;
      gap: 8px;
    }

    /* Computed Inspector */
    .computed-inspector-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .source-ctrl-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;

      label {
        width: 130px;
        color: var(--text-muted);
        font-family: var(--font-mono);
      }

      .num-field {
        width: 90px;
        padding: 4px 8px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: var(--text-main);
        font-family: var(--font-mono);
        font-weight: 700;
      }

      .select-field {
        padding: 4px 8px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: var(--text-main);
      }

      .unit {
        color: var(--text-dim);
      }
    }

    .computed-result-display {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .main-res {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .res-num {
        font-size: 1.5rem;
        font-weight: 900;
        font-family: var(--font-mono);
        color: #38bdf8;
      }

      .res-badge {
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(121, 82, 179, 0.2);
        color: var(--bs-purple-light);
        font-weight: 700;
      }
    }

    .cache-metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .metric-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .m-lbl {
        font-size: 0.65rem;
        color: var(--text-dim);
      }

      .m-val {
        font-size: 1.1rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: var(--text-main);

        &.highlight { color: #f59e0b; }
        &.good { color: #10b981; }
      }
    }

    /* Injection & Cleanup tests */
    .btn-col-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .diag-result-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      min-height: 60px;
      display: flex;
      align-items: center;
      font-size: 0.78rem;

      .dim {
        color: var(--text-dim);
      }

      &.error {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        color: #fca5a5;
      }

      &.success {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.1);
        color: #86efac;
      }
    }

    .timer-audit-box {
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px;
      height: 90px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      display: flex;
      flex-direction: column;
      gap: 3px;

      .audit-line {
        color: #38bdf8;
      }
    }
  `]
})
export class TrioPrimitivesComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  // Signal demo
  readonly demoScore = signal<number>(50);
  readonly lastSignalOp = signal<string>('Initialisé à 50');
  readonly isHookActive = signal<boolean>(false);
  readonly hookMessage = signal<string>('Aucune lecture en cours. Le signal attend un appelant.');

  demoSet(): void {
    this.demoScore.set(100);
    this.lastSignalOp.set('score.set(100)');
  }

  demoUpdate(): void {
    this.demoScore.update(n => n + 5);
    this.lastSignalOp.set('score.update(n => n + 5)');
  }

  resetSignalDemo(): void {
    this.demoScore.set(50);
    this.lastSignalOp.set('Réinitialisé à 50');
  }

  simulateReadWithParentheses(): void {
    this.isHookActive.set(true);
    this.hookMessage.set("L'appel fonctionnel score() a inscrit le template dans la liste des abonnés !");
    setTimeout(() => {
      this.isHookActive.set(false);
    }, 1200);
  }

  simulateReadWithoutParentheses(): void {
    this.isHookActive.set(false);
    this.hookMessage.set("Attention : sans () vous manipulez la fonction elle-même, aucun hameçon ne mord !");
  }

  // Computed Inspector
  readonly sourcePrixHT = signal<number>(100);
  readonly sourceTva = signal<number>(0.21);
  readonly totalReads = signal<number>(1);
  readonly actualCalculations = signal<number>(1);

  readonly computedPrixTTC = computed(() => {
    const ht = this.sourcePrixHT();
    const tva = this.sourceTva();
    return ht * (1 + tva);
  });

  onPrixHTChange(e: Event): void {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val)) {
      this.sourcePrixHT.set(val);
      this.actualCalculations.update(c => c + 1);
      this.totalReads.update(r => r + 1);
    }
  }

  onTvaChange(e: Event): void {
    const val = parseFloat((e.target as HTMLSelectElement).value);
    this.sourceTva.set(val);
    this.actualCalculations.update(c => c + 1);
    this.totalReads.update(r => r + 1);
  }

  readComputedMultipleTimes(): void {
    this.totalReads.update(r => r + 5);
    // Notice : actualCalculations does NOT increment because sources haven't changed!
  }

  // Effect banc d'essai
  readonly injectionTested = signal<boolean>(false);
  readonly injectionError = signal<boolean>(false);

  testInjectionContext(type: 'constructor' | 'method'): void {
    this.injectionTested.set(true);
    if (type === 'constructor') {
      this.injectionError.set(false);
    } else {
      this.injectionError.set(true);
    }
  }

  readonly currentArticleId = signal<number>(101);
  readonly nextArticleId = computed(() => this.currentArticleId() === 101 ? 102 : 101);
  readonly cleanupLogs = signal<string[]>([
    '[Timer #101] Initialisé (setInterval 5s)'
  ]);

  switchArticleId(): void {
    const prev = this.currentArticleId();
    const next = this.nextArticleId();
    this.currentArticleId.set(next);
    this.cleanupLogs.update(logs => [
      ...logs,
      `[onCleanup] 🛑 Arrêt du timer pour #${prev}`,
      `[Timer #${next}] 🚀 Démarrage du timer pour #${next}`
    ]);
  }

  readonly ng0600Active = signal<boolean>(false);

  simulateNg0600(): void {
    this.ng0600Active.set(true);
    setTimeout(() => {
      this.ng0600Active.set(false);
    }, 4000);
  }
}
