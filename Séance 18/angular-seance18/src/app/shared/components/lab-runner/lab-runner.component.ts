import { Component, input, inject, signal, computed, effect } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ExerciseService } from '../../../core/services/exercise.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { Exercise, ConsoleLogEntry } from '../../../core/models/app.models';

@Component({
  selector: 'app-lab-runner',
  standalone: true,
  imports: [MonacoEditorComponent, UpperCasePipe],
  template: `
    <div class="lab-runner-container">
      <!-- Barre supérieure de sélection d'exercices -->
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

          <!-- Critères d'évaluation automatique -->
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>exercice_{{ activeEx().number.replace('.', '_') }}.ts</span>
            </div>

            <div class="editor-actions">
              <button class="btn-ghost btn-sm" (click)="toggleHints()" title="Afficher/Masquer les indices">
                <span>{{ showHints() ? 'Masquer indices' : '💡 Indices' }}</span>
              </button>

              <button class="btn-ghost btn-sm" (click)="toggleSolution()" title="Voir la solution officielle">
                <span>{{ showSolution() ? 'Masquer solution' : '👁️ Solution' }}</span>
              </button>

              <button class="btn-ghost btn-sm" (click)="resetExerciseCode()" title="Réinitialiser au code de départ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span>Reset</span>
              </button>

              <button class="btn-primary btn-sm run-btn" (click)="runValidation()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Exécuter &amp; Valider</span>
              </button>
            </div>
          </div>

          <!-- Zone Monaco -->
          <div class="editor-frame">
            <app-monaco-editor
              [code]="editorCurrentCode()"
              (codeChange)="onCodeChanged($event)"
            ></app-monaco-editor>
          </div>

          <!-- Console Virtuelle & Diagnostic -->
          <div class="card-panel terminal-panel">
            <div class="terminal-bar">
              <div class="term-title">
                <span class="term-dot"></span>
                <span>Console Virtuelle &amp; Diagnostic d'Exécution</span>
              </div>
              <div class="term-actions">
                <button class="term-clear-btn" (click)="clearConsole()">Effacer</button>
              </div>
            </div>

            <div class="terminal-body">
              @if (lastRunError()) {
                <div class="runtime-error-banner">
                  <div class="err-title">⚠️ Erreur Runtime / Transpilation :</div>
                  <pre class="err-message">{{ lastRunError() }}</pre>
                </div>
              }

              @for (log of consoleLogs(); track $index) {
                <div class="log-entry" [class]="log.type">
                  <span class="log-time">[{{ log.timestamp }}]</span>
                  <span class="log-tag">{{ log.type | uppercase }}</span>
                  <span class="log-text">{{ log.text }}</span>
                </div>
              } @empty {
                @if (!lastRunError()) {
                  <div class="empty-console">
                    Cliquez sur « Exécuter &amp; Valider » pour tester votre code et voir les sorties console.
                  </div>
                }
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
      gap: 14px;
      height: 100%;
    }

    .exercise-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      gap: 12px;

      .selector-tabs {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        flex: 1;

        .ex-pill-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;

          &:hover {
            background: var(--bg-card-hover);
            color: var(--text-main);
          }

          &.active {
            background: rgba(49, 120, 198, 0.2);
            border-color: var(--ts-blue);
            color: var(--ts-blue-light);
            font-weight: 600;
          }

          &.completed {
            border-color: rgba(16, 185, 129, 0.4);

            .status-icon {
              color: #34d399;
              font-weight: 700;
            }
          }

          .status-icon {
            font-size: 0.75rem;
            color: var(--text-dim);
          }
        }
      }
    }

    .lab-grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 16px;
      flex: 1;
      min-height: 620px;
    }

    .brief-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      max-height: 800px;

      .brief-header {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .badges-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .brief-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .brief-sub {
          font-size: 0.84rem;
          color: var(--text-muted);
        }
      }

      .statement-box {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px;

        .statement-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--ts-blue-light);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .statement-text {
          font-size: 0.86rem;
          line-height: 1.5;
          color: var(--text-main);
        }
      }

      .criteria-box {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .criteria-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .criteria-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .criterion-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 10px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.8rem;

          &.passed {
            border-color: rgba(16, 185, 129, 0.4);
            background: rgba(16, 185, 129, 0.06);

            .c-icon {
              color: #34d399;
              font-weight: 700;
            }
          }

          .c-icon {
            color: var(--text-dim);
            font-size: 0.85rem;
            line-height: 1.2;
          }

          .c-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;

            .c-label {
              font-weight: 600;
              color: var(--text-main);
            }

            .c-desc {
              font-size: 0.76rem;
              color: var(--text-muted);
            }

            .c-hint {
              font-size: 0.72rem;
              color: #fbbf24;
              margin-top: 4px;
            }
          }
        }
      }

      .hint-card, .solution-card {
        padding: 12px;
        border-radius: 8px;
        font-size: 0.82rem;
        line-height: 1.45;
      }

      .hint-card {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.25);
        color: var(--text-main);

        .hint-title {
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 4px;
        }
      }

      .solution-card {
        background: rgba(147, 51, 234, 0.1);
        border: 1px solid rgba(147, 51, 234, 0.25);
        color: var(--text-main);

        .sol-title {
          font-weight: 700;
          color: #c084fc;
          margin-bottom: 6px;
        }

        ul {
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      }
    }

    .editor-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 620px;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;

      .file-name-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .editor-actions {
        display: flex;
        align-items: center;
        gap: 8px;

        .btn-sm {
          padding: 5px 10px;
          font-size: 0.78rem;
        }

        .run-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: #059669;

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #34d399, #10b981);
          }
        }
      }
    }

    .editor-frame {
      flex: 1;
      min-height: 400px;
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .terminal-panel {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      max-height: 220px;

      .terminal-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: var(--terminal-header);
        border-bottom: 1px solid var(--border-subtle);

        .term-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);

          .term-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
          }
        }

        .term-clear-btn {
          font-size: 0.72rem;
          color: var(--text-dim);

          &:hover {
            color: var(--text-main);
          }
        }
      }

      .terminal-body {
        padding: 10px 14px;
        background: var(--terminal-bg);
        overflow-y: auto;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .empty-console {
          color: var(--text-dim);
          font-style: italic;
          font-size: 0.76rem;
          padding: 8px 0;
        }

        .runtime-error-banner {
          background: rgba(221, 0, 49, 0.15);
          border: 1px solid rgba(221, 0, 49, 0.35);
          padding: 8px 10px;
          border-radius: 4px;
          margin-bottom: 6px;

          .err-title {
            color: #f87171;
            font-weight: 700;
            margin-bottom: 2px;
          }

          .err-message {
            color: #fca5a5;
            white-space: pre-wrap;
            word-break: break-word;
          }
        }

        .log-entry {
          display: flex;
          gap: 8px;
          line-height: 1.4;

          .log-time {
            color: var(--text-dim);
          }

          .log-tag {
            font-weight: 700;
            font-size: 0.7rem;
            padding: 0 4px;
            border-radius: 3px;
          }

          .log-text {
            color: var(--text-code);
            white-space: pre-wrap;
            word-break: break-word;
          }

          &.log .log-tag {
            background: rgba(49, 120, 198, 0.2);
            color: var(--ts-blue-light);
          }

          &.error .log-tag {
            background: rgba(221, 0, 49, 0.2);
            color: #f87171;
          }

          &.error .log-text {
            color: #fca5a5;
          }

          &.warn .log-tag {
            background: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
          }

          &.info .log-tag {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
          }
        }
      }
    }
  `]
})
export class LabRunnerComponent {
  readonly labFilter = input<number | null>(null);

  readonly exerciseService = inject(ExerciseService);

  readonly selectedExerciseId = signal<string>('');
  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly consoleLogs = signal<ConsoleLogEntry[]>([]);
  readonly lastRunError = signal<string | undefined>(undefined);
  readonly editorCurrentCode = signal<string>('');

  readonly displayedExercises = computed(() => {
    const f = this.labFilter();
    const all = this.exerciseService.exercises();
    if (f === null) return all;
    return all.filter(e => e.labNumber === f);
  });

  readonly activeEx = computed<Exercise>(() => {
    const id = this.selectedExerciseId();
    const found = this.exerciseService.exercises().find(e => e.id === id);
    if (found) return found;
    return this.displayedExercises()[0] ?? this.exerciseService.exercises()[0];
  });

  readonly labCompletedCount = computed(() => {
    return this.displayedExercises().filter(e => e.isCompleted).length;
  });

  constructor() {
    effect(() => {
      const list = this.displayedExercises();
      if (list.length > 0) {
        const curId = this.selectedExerciseId();
        if (!curId || !list.some(e => e.id === curId)) {
          this.onSelectExercise(list[0].id);
        }
      }
    });
  }

  onSelectExercise(id: string): void {
    this.selectedExerciseId.set(id);
    this.showHints.set(false);
    this.showSolution.set(false);
    this.consoleLogs.set([]);
    this.lastRunError.set(undefined);

    const ex = this.exerciseService.exercises().find(e => e.id === id);
    if (ex) {
      this.editorCurrentCode.set(ex.currentCode);
    }
  }

  onCodeChanged(newCode: string): void {
    this.editorCurrentCode.set(newCode);
    this.exerciseService.updateCode(this.activeEx().id, newCode);
  }

  resetExerciseCode(): void {
    const ex = this.activeEx();
    this.exerciseService.resetCode(ex.id);
    this.editorCurrentCode.set(ex.initialCode);
    this.showSolution.set(false);
    this.consoleLogs.set([]);
    this.lastRunError.set(undefined);
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    const next = !this.showSolution();
    this.showSolution.set(next);
    if (next) {
      const ex = this.activeEx();
      this.editorCurrentCode.set(ex.solutionCode);
      this.exerciseService.updateCode(ex.id, ex.solutionCode);
    }
  }

  clearConsole(): void {
    this.consoleLogs.set([]);
    this.lastRunError.set(undefined);
  }

  runValidation(): void {
    const ex = this.activeEx();
    const code = this.editorCurrentCode();
    const res = this.exerciseService.validateExercise(ex.id, code);

    this.consoleLogs.set(res.logs);
    this.lastRunError.set(res.error);
  }
}
