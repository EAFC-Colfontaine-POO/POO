import { 
  Component, 
  input, 
  computed, 
  signal, 
  inject, 
  effect 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../core/services/exercise.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { ConsoleLogEntry, ValidationSummary } from '../../../core/models/app.models';

@Component({
  selector: 'app-lab-runner',
  standalone: true,
  imports: [CommonModule, MonacoEditorComponent],
  template: `
    <div class="lab-runner-layout">
      <!-- Barre horizontale de sélection des exercices -->
      <div class="exercise-selector-bar">
        <div class="selector-scroll">
          @for (ex of displayedExercises(); track ex.id) {
            <button 
              class="ex-pill-btn" 
              [class.active]="activeEx().id === ex.id"
              [class.completed]="ex.isCompleted"
              (click)="onSelectExercise(ex.id)"
            >
              <span class="ex-num">{{ ex.number }}</span>
              <span class="ex-name">{{ ex.title }}</span>
              @if (ex.isCompleted) {
                <span class="check-mark" title="Exercice validé !">✔</span>
              }
            </button>
          }
        </div>
      </div>

      <!-- Corps du Studio d'Atelier (Split 2 Colonnes) -->
      <div class="lab-workspace-grid">
        <!-- COLONNE GAUCHE : Énoncé, Critères, Indices & Solution -->
        <div class="left-panel">
          <div class="card-panel statement-card">
            <div class="ex-header-meta">
              <div class="tags-group">
                <span class="badge badge-indigo">Labo {{ activeEx().labNumber }} · Ex {{ activeEx().number }}</span>
                <span class="badge" [class.badge-emerald]="activeEx().difficulty === 'Débutant' || activeEx().difficulty === 'Facile'"
                                  [class.badge-amber]="activeEx().difficulty === 'Intermédiaire'"
                                  [class.badge-rose]="activeEx().difficulty === 'Avancé'">
                  {{ activeEx().difficulty }}
                </span>
                <span class="badge badge-purple">⏱ {{ activeEx().estimatedTime }}</span>
              </div>
              @if (activeEx().isCompleted) {
                <span class="badge badge-success status-pill">✔ Validé</span>
              }
            </div>

            <h3 class="exercise-title">{{ activeEx().title }}</h3>
            <p class="exercise-subtitle">{{ activeEx().subtitle }}</p>

            <div class="statement-body">
              <h4 class="section-label">Énoncé du Défi Architectural</h4>
              <div class="statement-text">
                {{ activeEx().statement }}
              </div>
            </div>

            <!-- Accordeon Indice -->
            <div class="collapsible-section">
              <button class="toggle-link" (click)="toggleHints()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [style.transform]="showHints() ? 'rotate(90deg)' : 'none'">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <span>@if (showHints()) { Masquer l'indice } @else { Besoin d'un indice technique ? }</span>
              </button>
              @if (showHints()) {
                <div class="hint-box">
                  💡 {{ activeEx().hint }}
                </div>
              }
            </div>

            <!-- Critères de Validation (Assertions Vitest simulées) -->
            <div class="criteria-section">
              <h4 class="section-label">Contrats &amp; Assertions à Satisfaire</h4>
              <div class="criteria-list">
                @for (c of activeEx().criteria; track c.id) {
                  <div class="criterion-item" [class.passed]="c.passed">
                    <div class="criterion-icon">
                      @if (c.passed) {
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      } @else {
                        <div class="dot-pending"></div>
                      }
                    </div>
                    <div class="criterion-text">
                      <span class="crit-label">{{ c.label }}</span>
                      <span class="crit-desc">{{ c.description }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Corrigé officiel révélable -->
            <div class="solution-section">
              <button class="btn-ghost solution-toggle-btn" (click)="toggleSolution()">
                <span>{{ showSolution() ? 'Masquer le corrigé commenté' : 'Consulter le corrigé officiel' }}</span>
              </button>

              @if (showSolution()) {
                <div class="solution-panel">
                  <div class="solution-header">
                    <span class="sol-title">Architecture de Référence :</span>
                    <button class="btn-secondary btn-xs" (click)="injectSolution()" title="Copier le code de la solution dans votre éditeur">
                      Injecter dans l'éditeur
                    </button>
                  </div>
                  <pre class="solution-code-view"><code>{{ activeEx().solutionCode }}</code></pre>
                  
                  <div class="solution-explanations">
                    <span class="expl-title">Pourquoi cette solution est Clean :</span>
                    <ul>
                      @for (point of activeEx().solutionExplanation; track point) {
                        <li>{{ point }}</li>
                      }
                    </ul>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- COLONNE DROITE : Monaco Editor & Terminal Virtuel -->
        <div class="right-panel">
          <!-- Barre d'outils de l'éditeur -->
          <div class="editor-toolbar card-panel">
            <div class="file-tabs">
              <div class="file-tab active">
                <span class="badge-tag ts">TS</span>
                <span>exercice.ts</span>
              </div>
            </div>

            <div class="toolbar-actions">
              <div class="nav-arrows-group">
                <button 
                  class="btn-secondary btn-sm nav-arrow-btn" 
                  [disabled]="!prevExercise()" 
                  (click)="goToPrevExercise()"
                  [title]="prevExercise() ? 'Exercice précédent : ' + prevExercise()!.number + ' – ' + prevExercise()!.title : 'Premier exercice'"
                >
                  ◀ Précédent
                </button>
                <button 
                  class="btn-secondary btn-sm nav-arrow-btn" 
                  [disabled]="!nextInList()" 
                  (click)="goToNextExercise()"
                  [title]="nextInList() ? 'Exercice suivant : ' + nextInList()!.number + ' – ' + nextInList()!.title : 'Dernier exercice'"
                >
                  Suivant ▶
                </button>
              </div>

              <span class="toolbar-divider"></span>

              <button class="btn-secondary btn-sm" (click)="resetExercise()" title="Réinitialiser le code à l'état initial">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                <span>Réinitialiser</span>
              </button>

              <button class="btn-secondary btn-sm" (click)="toggleHints()">
                <span>💡 Indice</span>
              </button>

              <button class="btn-secondary btn-sm" (click)="toggleSolution()">
                <span>Corrigé</span>
              </button>

              <button class="btn-primary btn-sm btn-execute" (click)="validateCurrentExercise()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Exécuter &amp; Valider</span>
              </button>
            </div>
          </div>

          <!-- Composant Monaco Editor -->
          <div class="monaco-container">
            <app-monaco-editor 
              [code]="activeEx().currentCode"
              language="typescript"
              (codeChange)="onCodeChange($event)"
            ></app-monaco-editor>
          </div>

          <!-- Console Virtuelle & Résultats de Tests -->
          <div class="virtual-terminal card-panel">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="terminal-title">TERMINAL VIRTUEL &amp; SORTIES D'ÉVALUATION</span>
              <div class="terminal-actions">
                <span class="log-count-badge">{{ currentLogs().length }} logs</span>
                <button class="btn-ghost btn-xs" (click)="clearConsole()" title="Effacer la console">
                  Effacer
                </button>
              </div>
            </div>

            <div class="terminal-body">
              @if (currentLogs().length === 0) {
                <div class="terminal-empty">
                  <span>En attente d'exécution. Cliquez sur « Exécuter &amp; Valider » pour tester votre architecture.</span>
                  <span class="dim">Les sorties console.log() et les résultats des assertions s'afficheront ici.</span>
                </div>
              } @else {
                <div class="logs-container">
                  @for (log of currentLogs(); track $index) {
                    <div class="log-line" [class]="'log-' + log.type">
                      <span class="log-time">{{ log.timestamp }}</span>
                      <span class="log-prefix">[{{ log.type.toUpperCase() }}]</span>
                      <span class="log-msg">{{ log.message }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Résultat global du test -->
          @if (lastValidationResult()) {
            <div class="card-panel validation-panel">
              <div class="validation-header">
                <span class="val-title">Bilan de Validation</span>
                <span class="val-badge" [class.success]="lastValidationResult()!.success" [class.error]="!lastValidationResult()!.success">
                  {{ lastValidationResult()!.passedCount }} / {{ lastValidationResult()!.totalCount }} critères réussis
                </span>
              </div>

              @if (lastValidationResult()!.success) {
                <div class="banner success">
                  <div class="banner-content">
                    <span class="check-icon">🎉</span>
                    <div>
                      <strong>Défi Architectural Validé !</strong>
                      <p>Votre refactoring respecte scrupuleusement les contrats d'interfaces et les principes SOLID.</p>
                      @if (nextExercise(); as next) {
                        <button class="btn-primary btn-sm next-ex-btn" (click)="goToNextExercise()">
                          Passer à l'exercice suivant : {{ next.number }} – {{ next.title }} ➔
                        </button>
                      } @else {
                        <p class="all-done-msg"><strong>🏆 Tous les exercices de cette sélection sont validés !</strong></p>
                      }
                    </div>
                  </div>
                </div>
              } @else {
                <div class="banner error">
                  <div class="banner-content">
                    <span class="check-icon">⚠️</span>
                    <div>
                      <strong>Assertions non satisfaites</strong>
                      <p>Vérifiez les erreurs remontées dans le terminal ci-dessus ou consultez l'indice.</p>
                      @if (lastValidationResult()!.executionError) {
                        <div class="error-line">{{ lastValidationResult()!.executionError }}</div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .next-ex-btn { margin-top: 8px; }

    .lab-runner-layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    .exercise-selector-bar {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 6px;
      overflow-x: auto;
    }

    .selector-scroll {
      display: flex;
      gap: 6px;
      min-width: max-content;
    }

    .ex-pill-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--bg-subtle);
      border: 1px solid transparent;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: rgba(99, 102, 241, 0.2);
        color: #818cf8;
        border-color: #6366f1;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.25);
      }

      &.completed {
        border-left: 3px solid #10b981;
      }

      .ex-num {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        opacity: 0.8;
      }

      .check-mark {
        color: #10b981;
        font-size: 0.8rem;
      }
    }

    .lab-workspace-grid {
      display: grid;
      grid-template-columns: 460px 1fr;
      gap: 16px;
      flex: 1;
      min-height: 0;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }

    .left-panel, .right-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 0;
    }

    .left-panel {
      overflow-y: auto;
      padding-right: 4px;
    }

    .statement-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .ex-header-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;

      .tags-group {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
      }

      .status-pill {
        font-size: 0.72rem;
      }
    }

    .exercise-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-main);
      margin-top: 2px;
    }

    .exercise-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: -6px;
    }

    .section-label {
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      margin-bottom: 8px;
    }

    .statement-text {
      font-size: 0.88rem;
      line-height: 1.6;
      color: var(--text-main);
      background: var(--bg-subtle);
      padding: 12px;
      border-radius: 6px;
      border-left: 3px solid #6366f1;
      white-space: pre-line;
    }

    .collapsible-section {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .toggle-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #818cf8;
        font-size: 0.82rem;
        font-weight: 600;
        text-align: left;

        &:hover {
          color: #a5b4fc;
        }
      }

      .hint-box {
        font-size: 0.82rem;
        line-height: 1.5;
        padding: 10px 12px;
        background: rgba(245, 158, 11, 0.08);
        border: 1px solid rgba(245, 158, 11, 0.25);
        color: #fde68a;
        border-radius: 6px;
      }
    }

    .criteria-section {
      display: flex;
      flex-direction: column;
    }

    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .criterion-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      transition: all 0.2s;

      &.passed {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.06);

        .crit-label {
          color: #34d399;
        }
      }

      .criterion-icon {
        margin-top: 2px;
        width: 16px;
        display: flex;
        justify-content: center;
      }

      .dot-pending {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-dim);
      }

      .criterion-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .crit-label {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .crit-desc {
        font-size: 0.76rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .solution-section {
      margin-top: 6px;
    }

    .solution-toggle-btn {
      width: 100%;
      justify-content: center;
      padding: 8px;
      border: 1px dashed var(--border-color);
      font-size: 0.8rem;
    }

    .solution-panel {
      margin-top: 10px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .solution-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .sol-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .solution-code-view {
      background: var(--bg-code);
      padding: 10px;
      border-radius: 6px;
      font-size: 0.76rem;
      overflow-x: auto;
      max-height: 200px;
      color: #93c5fd;
      line-height: 1.4;
    }

    .solution-explanations {
      font-size: 0.78rem;
      color: var(--text-muted);

      .expl-title {
        font-weight: 700;
        color: var(--text-main);
        display: block;
        margin-bottom: 4px;
      }

      ul {
        padding-left: 18px;
        line-height: 1.4;
      }
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      gap: 10px;
      flex-wrap: wrap;
    }

    .file-tabs {
      display: flex;
      gap: 6px;
    }

    .file-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--bg-subtle);

      &.active {
        color: var(--text-main);
        background: var(--bg-card-hover);
        border: 1px solid var(--border-color);
      }

      .badge-tag.ts {
        font-size: 0.68rem;
        background: #3178c6;
        color: #fff;
        padding: 1px 4px;
        border-radius: 3px;
        font-weight: 800;
      }
    }

    .toolbar-actions {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }

    .nav-arrows-group {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }

    .nav-arrow-btn {
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .toolbar-divider {
      width: 1px;
      height: 18px;
      background: var(--border-color);
      margin: 0 4px;
    }

    .all-done-msg {
      margin-top: 8px;
      color: #34d399;
      font-size: 0.85rem;
    }

    .btn-sm {
      font-size: 0.78rem;
      padding: 5px 10px;
    }

    .btn-xs {
      font-size: 0.72rem;
      padding: 3px 8px;
    }

    .monaco-container {
      height: 440px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .virtual-terminal {
      display: flex;
      flex-direction: column;
      height: 280px;
      padding: 0;
      overflow: hidden;
      border-color: #24314c;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: var(--terminal-header);
      border-bottom: 1px solid var(--border-color);
    }

    .terminal-dots {
      display: flex;
      gap: 6px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;

        &.red { background: #ef4444; }
        &.yellow { background: #f59e0b; }
        &.green { background: #10b981; }
      }
    }

    .terminal-title {
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    .terminal-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .log-count-badge {
        font-size: 0.7rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
    }

    .terminal-body {
      flex: 1;
      padding: 12px;
      background: var(--terminal-bg);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      overflow-y: auto;
      line-height: 1.5;
    }

    .terminal-empty {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--text-dim);
      padding: 16px 8px;

      .dim {
        font-size: 0.72rem;
        color: #475569;
      }
    }

    .logs-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .log-line {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      word-break: break-all;

      .log-time {
        font-size: 0.7rem;
        color: #475569;
        min-width: 55px;
      }

      .log-prefix {
        font-size: 0.72rem;
        font-weight: 700;
      }

      &.log-log {
        color: #e2e8f0;
        .log-prefix { color: #60a5fa; }
      }

      &.log-info {
        color: #93c5fd;
        .log-prefix { color: #3b82f6; }
      }

      &.log-warn {
        color: #fde047;
        .log-prefix { color: #eab308; }
      }

      &.log-error {
        color: #fca5a5;
        .log-prefix { color: #ef4444; }
      }

      &.log-success {
        color: #86efac;
        .log-prefix { color: #22c55e; }
      }
    }

    .validation-panel {
      padding: 16px;
    }

    .validation-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .val-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-main);
        text-transform: uppercase;
      }

      .val-badge {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;

        &.success {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        &.error {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
      }
    }

    .banner {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.82rem;

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #ecfdf5;

        p {
          color: #a7f3d0;
          font-size: 0.78rem;
          margin-top: 3px;
        }
      }

      &.error {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fef2f2;

        .error-line {
          color: #fca5a5;
          margin-top: 4px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }
      }

      .banner-content {
        display: flex;
        gap: 10px;
        align-items: flex-start;

        .check-icon {
          font-size: 1.2rem;
          margin-top: 1px;
        }
      }
    }
  `]
})
export class LabRunnerComponent {
  readonly filterLabNumber = input<number | undefined>(undefined);

  readonly exercisesService = inject(ExerciseService);

  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly currentLogs = signal<ConsoleLogEntry[]>([]);
  readonly lastValidationResult = signal<ValidationSummary | null>(null);

  readonly displayedExercises = computed(() => {
    const list = this.exercisesService.exercises();
    const filter = this.filterLabNumber();
    if (filter !== undefined) {
      return list.filter(e => e.labNumber === filter);
    }
    return list;
  });

  readonly selectedExerciseId = computed(() => {
    return this.exercisesService.selectedExerciseId();
  });

  readonly activeEx = computed(() => {
    const list = this.displayedExercises();
    const selId = this.selectedExerciseId();
    const found = list.find(e => e.id === selId);
    return found || list[0] || this.exercisesService.activeExercise();
  });

  readonly labCompletedCount = computed(() => {
    return this.displayedExercises().filter(e => e.isCompleted).length;
  });

  readonly currentIndex = computed(() => {
    const list = this.displayedExercises();
    const activeId = this.activeEx().id;
    return list.findIndex(e => e.id === activeId);
  });

  readonly prevExercise = computed(() => {
    const list = this.displayedExercises();
    const idx = this.currentIndex();
    if (idx > 0) return list[idx - 1];
    return null;
  });

  readonly nextInList = computed(() => {
    const list = this.displayedExercises();
    const idx = this.currentIndex();
    if (idx >= 0 && idx < list.length - 1) return list[idx + 1];
    return null;
  });

  /** Prochain exercice à proposer : d'abord le suivant non validé (circulaire), sinon le suivant direct dans la liste. */
  readonly nextExercise = computed(() => {
    const list = this.displayedExercises();
    const idx = this.currentIndex();
    if (idx === -1 || list.length <= 1) return null;
    for (let i = 1; i < list.length; i++) {
      const cand = list[(idx + i) % list.length];
      if (!cand.isCompleted) return cand;
    }
    if (idx < list.length - 1) return list[idx + 1];
    return null;
  });

  constructor() {
    effect(() => {
      const list = this.displayedExercises();
      const selId = this.exercisesService.selectedExerciseId();
      if (list.length > 0 && !list.some(e => e.id === selId)) {
        this.exercisesService.selectExercise(list[0].id);
        this.lastValidationResult.set(null);
        this.currentLogs.set([]);
        this.showHints.set(false);
        this.showSolution.set(false);
      }
    }, { allowSignalWrites: true });
  }

  onSelectExercise(id: string): void {
    this.exercisesService.selectExercise(id);
    this.lastValidationResult.set(null);
    this.currentLogs.set([]);
    this.showHints.set(false);
    this.showSolution.set(false);
  }

  goToPrevExercise(): void {
    const prev = this.prevExercise();
    if (prev) this.onSelectExercise(prev.id);
  }

  goToNextExercise(): void {
    const next = this.nextExercise() || this.nextInList();
    if (next) this.onSelectExercise(next.id);
  }

  onCodeChange(code: string): void {
    this.exercisesService.updateCode(this.activeEx().id, code);
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    this.showSolution.update(v => !v);
  }

  injectSolution(): void {
    this.exercisesService.injectSolution(this.activeEx().id);
    this.showSolution.set(true);
  }

  resetExercise(): void {
    this.exercisesService.resetExercise(this.activeEx().id);
    this.lastValidationResult.set(null);
    this.currentLogs.set([]);
  }

  validateCurrentExercise(): void {
    const summary = this.exercisesService.evaluateExercise(this.activeEx().id);
    this.lastValidationResult.set(summary);
    this.currentLogs.set(summary.consoleLogs);
  }

  clearConsole(): void {
    this.currentLogs.set([]);
  }
}
