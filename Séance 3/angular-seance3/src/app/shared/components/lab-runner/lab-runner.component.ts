import { Component, Input, inject, signal, computed, effect } from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { Exercise, ConsoleLogEntry, ValidationCriterion } from '../../../core/models/app.models';

@Component({
  selector: 'app-lab-runner',
  standalone: true,
  imports: [MonacoEditorComponent],
  template: `
    <div class="lab-runner-container">
      <!-- Barre supérieure de sélection d'exercices si un labNumber est spécifié -->
      <div class="exercise-selector-bar card-panel">
        <div class="selector-tabs">
          @for (ex of displayedExercises(); track ex.id; let idx = $index) {
            <button 
              class="ex-pill-btn" 
              [class.active]="selectedExerciseId() === ex.id"
              [class.completed]="ex.isCompleted"
              (click)="onSelectExercise(ex.id)"
            >
              <span class="status-icon">{{ ex.isCompleted ? '✓' : ex.number }}</span>
              <span class="ex-short-title">{{ ex.title }}</span>
            </button>
          }
        </div>

        <div class="lab-progress-badge">
          <span class="badge badge-success">{{ labCompletedCount() }} / {{ displayedExercises().length }} Validés</span>
        </div>
      </div>

      <!-- Espace de travail de l'exercice actif -->
      <div class="lab-grid">
        <!-- Panneau Énoncé & Critères -->
        <div class="card-panel brief-panel">
          <div class="brief-header">
            <div class="badges-row">
              <span class="badge badge-ts">Exercice {{ activeEx().number }}</span>
              <span class="badge badge-purple">{{ activeEx().difficulty }}</span>
              <span class="badge badge-warning">⏱️ {{ activeEx().estimatedTime }}</span>
              @if (activeEx().isCompleted) {
                <span class="badge badge-success">✓ Validé</span>
              }
            </div>
            <h3 class="brief-title">{{ activeEx().title }}</h3>
            <p class="brief-sub">{{ activeEx().subtitle }}</p>
          </div>

          <div class="statement-box">
            <div class="statement-label">🎯 Consigne :</div>
            <p class="statement-text">{{ activeEx().statement }}</p>
          </div>

          <!-- Critères d'évaluation -->
          <div class="criteria-box">
            <div class="criteria-title">Vérifications automatiques :</div>
            <div class="criteria-list">
              @for (c of activeEx().criteria; track c.id) {
                <div class="criterion-item" [class.passed]="c.passed">
                  <div class="c-icon">{{ c.passed ? '✔' : '○' }}</div>
                  <div class="c-info">
                    <div class="c-label">{{ c.label }}</div>
                    <div class="c-desc">{{ c.description }}</div>
                    @if (!c.passed && showHints()) {
                      <div class="c-hint">💡 Indice : {{ c.hint }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Indice dépliable -->
          @if (showHints()) {
            <div class="hint-card">
              <div class="hint-title">💡 Indice pédagogique :</div>
              <p>{{ activeEx().hint }}</p>
            </div>
          }

          <!-- Explication guidée de la solution -->
          @if (showSolution()) {
            <div class="solution-card">
              <div class="sol-title">📖 Explication pas-à-pas de la solution :</div>
              <ul>
                @for (item of activeEx().solutionExplanation; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Panneau Éditeur Monaco & Console Virtuelle -->
        <div class="editor-col">
          <!-- Barre d'outils de l'éditeur -->
          <div class="editor-toolbar card-panel">
            <div class="file-name-indicator">
              <span class="ts-icon">TS</span>
              <span>exercice-{{ activeEx().number }}.ts</span>
            </div>

            <div class="toolbar-actions">
              <button class="btn-secondary" (click)="toggleHints()">
                {{ showHints() ? 'Masquer Indice' : '💡 Indice' }}
              </button>
              <button class="btn-secondary" (click)="toggleSolution()">
                {{ showSolution() ? 'Masquer Solution' : '📖 Solution' }}
              </button>
              <button class="btn-secondary" (click)="injectSolution()" title="Remplacer le code par la correction officielle">
                Injecter Solution
              </button>
              <button class="btn-secondary" (click)="resetExercise()" title="Réinitialiser le code d'origine">
                ↺ Réinitialiser
              </button>
              <button class="btn-primary" (click)="validate()">
                🚀 Valider mon code
              </button>
            </div>
          </div>

          <!-- Monaco Editor Box -->
          <div class="editor-wrapper">
            <app-monaco-editor
              [code]="activeEx().currentCode"
              language="typescript"
              (codeChange)="onCodeChange($event)"
            ></app-monaco-editor>
          </div>

          <!-- Console Virtuelle & Résultat -->
          <div class="virtual-terminal card-panel">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="term-title">Console d'Exécution Virtuelle (TypeScript / Node Sandbox)</span>
              <button class="clear-btn" (click)="clearLogs()">Effacer</button>
            </div>

            <div class="terminal-body">
              @if (lastValidationResult()) {
                <div class="validation-banner" [class.success]="lastValidationResult()?.success" [class.error]="!lastValidationResult()?.success">
                  @if (lastValidationResult()?.success) {
                    <span>✔ Succès ! Tous les critères sont respectés et le code compile sans erreur.</span>
                  } @else {
                    <span>❌ Code non validé : certains critères ne sont pas encore satisfaits.</span>
                  }
                </div>
              }

              @if (logs().length === 0) {
                <div class="empty-terminal-hint">
                  Appuyez sur « <strong>🚀 Valider mon code</strong> » pour compiler et exécuter vos instructions <code>console.log()</code>.
                </div>
              } @else {
                <div class="terminal-logs">
                  @for (log of logs(); track log.timestamp + log.text) {
                    <div class="log-line" [class]="'log-' + log.type">
                      <span class="log-time">{{ log.timestamp }}</span>
                      <span class="log-badge">{{ log.type.toUpperCase() }}</span>
                      <pre class="log-text">{{ log.text }}</pre>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lab-runner-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    .exercise-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .selector-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      flex: 1;
    }

    .ex-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 500;
      white-space: nowrap;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: rgba(49, 120, 198, 0.15);
        color: var(--ts-blue-light);
        border-color: var(--ts-blue);
        font-weight: 600;
      }

      &.completed .status-icon {
        color: #10b981;
        font-weight: 700;
      }
    }

    .status-icon {
      font-size: 0.78rem;
    }

    .lab-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 16px;
      flex: 1;
      min-height: 520px;
    }

    .brief-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      overflow-y: auto;
      max-height: calc(100vh - 200px);
    }

    .brief-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .brief-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .brief-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .statement-box {
      background: var(--bg-subtle);
      padding: 12px;
      border-radius: 6px;
      border-left: 3px solid var(--ts-blue);
    }

    .statement-label {
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--ts-blue-light);
      margin-bottom: 4px;
    }

    .statement-text {
      font-size: 0.88rem;
      line-height: 1.5;
      color: var(--text-main);
    }

    .criteria-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .criterion-item {
      display: flex;
      gap: 10px;
      padding: 8px 10px;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.82rem;

      &.passed {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.05);

        .c-icon {
          color: #10b981;
          font-weight: 700;
        }
      }

      .c-icon {
        color: var(--text-dim);
      }

      .c-label {
        font-weight: 600;
        color: var(--text-main);
      }

      .c-desc {
        color: var(--text-muted);
        font-size: 0.78rem;
      }

      .c-hint {
        margin-top: 4px;
        color: #fbbf24;
        font-size: 0.76rem;
      }
    }

    .hint-card {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      color: #fbbf24;

      .hint-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
    }

    .solution-card {
      background: rgba(147, 51, 234, 0.1);
      border: 1px solid rgba(147, 51, 234, 0.3);
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      color: #c084fc;

      .sol-title {
        font-weight: 700;
        margin-bottom: 6px;
      }

      ul {
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    .editor-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      gap: 10px;
      flex-wrap: wrap;
    }

    .file-name-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-main);

      .ts-icon {
        background: #3178c6;
        color: #ffffff;
        font-size: 0.65rem;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 700;
      }
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .editor-wrapper {
      height: 320px;
      min-height: 250px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .virtual-terminal {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      min-height: 160px;
      max-height: 220px;
    }

    .terminal-header {
      background: var(--terminal-header);
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);

      .terminal-dots {
        display: flex;
        gap: 6px;

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;

          &.red { background: #ef4444; }
          &.yellow { background: #f59e0b; }
          &.green { background: #10b981; }
        }
      }

      .term-title {
        font-size: 0.75rem;
        color: var(--text-muted);
        font-family: var(--font-mono);
      }

      .clear-btn {
        font-size: 0.7rem;
        color: var(--text-dim);

        &:hover { color: var(--text-main); }
      }
    }

    .terminal-body {
      padding: 10px 14px;
      overflow-y: auto;
      flex: 1;
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }

    .validation-banner {
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 8px;

      &.success {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      &.error {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
    }

    .empty-terminal-hint {
      color: var(--text-dim);
      font-size: 0.8rem;
      padding: 12px 0;
    }

    .terminal-logs {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .log-line {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      line-height: 1.4;

      .log-time {
        color: var(--text-dim);
        font-size: 0.7rem;
      }

      .log-badge {
        font-size: 0.65rem;
        padding: 1px 4px;
        border-radius: 3px;
        font-weight: 600;
      }

      .log-text {
        color: var(--text-code);
        white-space: pre-wrap;
      }

      &.log-log .log-badge {
        background: rgba(49, 120, 198, 0.2);
        color: #60a5fa;
      }

      &.log-error {
        .log-badge {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }
        .log-text {
          color: #fca5a5;
        }
      }

      &.log-warn {
        .log-badge {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }
      }
    }
  `]
})
export class LabRunnerComponent {
  /** Numéro optionnel de Lab (1 à 6). Si non fourni, affiche tous les exercices. */
  @Input() targetLabNumber?: number;

  readonly exerciseService = inject(ExerciseService);

  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly selectedExerciseId = signal<string>('');
  readonly logs = signal<ConsoleLogEntry[]>([]);
  readonly lastValidationResult = signal<{ success: boolean } | null>(null);

  readonly displayedExercises = computed(() => {
    const list = this.exerciseService.exercises();
    if (this.targetLabNumber) {
      return list.filter(e => e.labNumber === this.targetLabNumber);
    }
    return list;
  });

  readonly activeEx = computed(() => {
    const currentId = this.selectedExerciseId();
    const list = this.displayedExercises();
    if (currentId) {
      const match = list.find(e => e.id === currentId);
      if (match) return match;
    }
    return list[0] || this.exerciseService.exercises()[0];
  });

  readonly labCompletedCount = computed(() => {
    return this.displayedExercises().filter(e => e.isCompleted).length;
  });

  constructor() {
    effect(() => {
      const list = this.displayedExercises();
      if (list.length > 0 && !this.selectedExerciseId()) {
        this.selectedExerciseId.set(list[0].id);
      }
    });
  }

  onSelectExercise(id: string): void {
    this.selectedExerciseId.set(id);
    this.showHints.set(false);
    this.showSolution.set(false);
    this.lastValidationResult.set(null);
    this.logs.set([]);
  }

  onCodeChange(newCode: string): void {
    const exId = this.activeEx().id;
    this.exerciseService.exercises.update(list => {
      return list.map(item => {
        if (item.id === exId) {
          return { ...item, currentCode: newCode };
        }
        return item;
      });
    });
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    this.showSolution.update(v => !v);
  }

  injectSolution(): void {
    const ex = this.activeEx();
    this.onCodeChange(ex.solutionCode);
    this.validate();
  }

  resetExercise(): void {
    const ex = this.activeEx();
    this.exerciseService.exercises.update(list => {
      return list.map(item => {
        if (item.id === ex.id) {
          return {
            ...item,
            currentCode: item.initialCode,
            isCompleted: false,
            criteria: item.criteria.map((c: ValidationCriterion) => ({ ...c, passed: false }))
          };
        }
        return item;
      });
    });
    this.logs.set([]);
    this.lastValidationResult.set(null);
  }

  validate(): void {
    const ex = this.activeEx();
    const result = this.exerciseService.validateExercise(ex.id);
    this.logs.set(result.logs);
    this.lastValidationResult.set({ success: result.success });
  }

  clearLogs(): void {
    this.logs.set([]);
  }
}
