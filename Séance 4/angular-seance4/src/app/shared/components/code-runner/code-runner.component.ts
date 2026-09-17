import { 
  Component, 
  Input, 
  ViewChild, 
  ElementRef, 
  AfterViewInit, 
  OnChanges, 
  SimpleChanges, 
  inject, 
  signal, 
  computed, 
  effect 
} from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { Exercise, ValidationSummary } from '../../../core/models/app.models';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';

@Component({
  selector: 'app-code-runner',
  standalone: true,
  imports: [MonacoEditorComponent],
  template: `
    <div class="code-runner-container">
      <!-- Barre supérieure de sélection d'exercices -->
      @if (exercisesList().length > 1) {
        <div class="exercise-selector-bar card-panel">
          <div class="selector-tabs">
            @for (ex of exercisesList(); track ex.id) {
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
            <span class="badge badge-success">{{ labCompletedCount() }} / {{ exercisesList().length }} Validés</span>
          </div>
        </div>
      }

      <!-- Espace de travail de l'exercice actif -->
      <div class="runner-grid">
        <!-- Colonne Gauche : Énoncé, Critères & Monaco Editor -->
        <div class="editor-col">
          <!-- Carte Énoncé -->
          <div class="card-panel brief-panel">
            <div class="brief-header">
              <div class="badges-row">
                <span class="badge badge-bootstrap">Exercice {{ activeEx().number }}</span>
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
              <div class="criteria-title">Critères d'évaluation automatique :</div>
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

            <!-- Solution pas-à-pas -->
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

          <!-- Barre d'outils de l'éditeur -->
          <div class="editor-toolbar card-panel">
            <div class="file-tabs">
              <button 
                class="file-tab" 
                [class.active]="activeFileTab() === 'html'"
                (click)="activeFileTab.set('html')"
              >
                <span class="badge-tag html">HTML</span>
                <span>index.html</span>
              </button>
              <button 
                class="file-tab" 
                [class.active]="activeFileTab() === 'css'"
                (click)="activeFileTab.set('css')"
              >
                <span class="badge-tag css">CSS</span>
                <span>styles.css</span>
              </button>
            </div>

            <div class="toolbar-actions">
              <button class="btn-secondary btn-sm" (click)="toggleHints()">
                {{ showHints() ? 'Masquer Indice' : '💡 Indice' }}
              </button>
              <button class="btn-secondary btn-sm" (click)="toggleSolution()">
                {{ showSolution() ? 'Masquer Solution' : '📖 Solution' }}
              </button>
              <button class="btn-secondary btn-sm" (click)="injectSolution()" title="Injecter la solution officielle">
                Injecter Solution
              </button>
              <button class="btn-secondary btn-sm" (click)="resetExercise()" title="Réinitialiser le code de départ">
                ↺ Réinitialiser
              </button>
              <button class="btn-primary btn-sm" (click)="validateCurrentExercise()">
                🚀 Valider l'exercice
              </button>
            </div>
          </div>

          <!-- Zone Éditeur Monaco -->
          <div class="monaco-container">
            @if (activeFileTab() === 'html') {
              <app-monaco-editor
                [code]="activeEx().currentHtml"
                language="html"
                (codeChange)="onHtmlChange($event)"
              ></app-monaco-editor>
            } @else {
              <app-monaco-editor
                [code]="activeEx().currentCss"
                language="css"
                (codeChange)="onCssChange($event)"
              ></app-monaco-editor>
            }
          </div>
        </div>

        <!-- Colonne Droite : Prévisualisation Iframe Live + Console de Tests -->
        <div class="preview-col">
          <!-- Header de la Sandbox Live -->
          <div class="preview-header card-panel">
            <div class="header-info">
              <div class="dots-row">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="preview-title">Rendu Temps Réel (Bac à sable iframe)</span>
            </div>
            <div class="header-badges">
              <span class="badge badge-bootstrap">Bootstrap 5.3 CDN Actif</span>
              <button class="reload-btn" (click)="refreshIframe()" title="Forcer le rafraîchissement">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Iframe Sandbox -->
          <div class="iframe-wrapper">
            <iframe 
              #previewIframe
              class="preview-iframe"
              title="Prévisualisation en direct avec Bootstrap 5.3"
            ></iframe>
          </div>

          <!-- Résultat de Validation -->
          <div class="validation-panel card-panel">
            <div class="validation-header">
              <span class="val-title">Console de Validation du DOM</span>
              @if (lastValidationResult()) {
                <span class="val-badge" [class.success]="lastValidationResult()?.success" [class.error]="!lastValidationResult()?.success">
                  {{ lastValidationResult()?.success ? 'Succès (100%)' : 'En cours de résolution' }}
                </span>
              }
            </div>

            <div class="validation-body">
              @if (lastValidationResult()) {
                <div class="banner" [class.success]="lastValidationResult()?.success" [class.error]="!lastValidationResult()?.success">
                  @if (lastValidationResult()?.success) {
                    <div class="banner-content">
                      <span class="check-icon">🎉</span>
                      <div>
                        <strong>Félicitations ! Tous les critères sont validés avec succès !</strong>
                        <p>Le DOM analysé respecte parfaitement les balises sémantiques, les classes Bootstrap et les styles exigés.</p>
                      </div>
                    </div>
                  } @else {
                    <div class="banner-content">
                      <span class="check-icon">⚠️</span>
                      <div>
                        <strong>Exercice non validé :</strong>
                        @for (msg of lastValidationResult()?.messages; track msg) {
                          <div class="error-line">• {{ msg }}</div>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-hint">
                  Modifiez le code dans l'éditeur Monaco et cliquez sur « <strong>🚀 Valider l'exercice</strong> » pour évaluer automatiquement les balises, classes et styles calculés du DOM.
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .code-runner-container {
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
        background: rgba(121, 82, 179, 0.18);
        color: #c4b5fd;
        border-color: rgba(121, 82, 179, 0.5);
      }

      &.completed {
        border-color: rgba(16, 185, 129, 0.4);
        .status-icon {
          color: #10b981;
          font-weight: 800;
        }
      }
    }

    .status-icon {
      font-weight: 700;
      font-size: 0.8rem;
    }

    .runner-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      flex: 1;
      min-height: 600px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .editor-col, .preview-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .brief-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .badges-row {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }

      .brief-title {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
        margin-top: 2px;
      }

      .brief-sub {
        font-size: 0.85rem;
        color: var(--text-muted);
      }
    }

    .statement-box {
      background: var(--bg-subtle);
      border-left: 3px solid #7952b3;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;

      .statement-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: #c4b5fd;
        margin-bottom: 4px;
      }
      .statement-text {
        font-size: 0.88rem;
        color: var(--text-main);
        line-height: 1.45;
      }
    }

    .criteria-box {
      .criteria-title {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-dim);
        margin-bottom: 8px;
      }

      .criteria-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .criterion-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 12px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        font-size: 0.82rem;

        &.passed {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.08);

          .c-icon {
            color: #10b981;
          }
          .c-label {
            color: #34d399;
          }
        }

        .c-icon {
          font-weight: 800;
          color: var(--text-dim);
          margin-top: 1px;
        }

        .c-info {
          flex: 1;
        }

        .c-label {
          font-weight: 600;
          color: var(--text-main);
        }

        .c-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .c-hint {
          font-size: 0.75rem;
          color: #f59e0b;
          margin-top: 4px;
          background: rgba(245, 158, 11, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    }

    .hint-card, .solution-card {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.84rem;
      line-height: 1.45;
    }

    .hint-card {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;

      .hint-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
    }

    .solution-card {
      background: rgba(121, 82, 179, 0.12);
      border: 1px solid rgba(121, 82, 179, 0.35);
      color: var(--text-main);

      .sol-title {
        font-weight: 700;
        color: #c4b5fd;
        margin-bottom: 6px;
      }

      ul {
        list-style: disc inside;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      gap: 10px;
      flex-wrap: wrap;

      .file-tabs {
        display: flex;
        gap: 6px;
      }

      .file-tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);

        &:hover {
          color: var(--text-main);
        }

        &.active {
          background: var(--bg-card-hover);
          color: var(--text-main);
          border-color: #7952b3;
        }
      }

      .badge-tag {
        font-size: 0.65rem;
        padding: 1px 4px;
        border-radius: 3px;
        font-weight: 700;

        &.html {
          background: rgba(228, 77, 38, 0.2);
          color: #ff7849;
        }
        &.css {
          background: rgba(38, 77, 228, 0.2);
          color: #60a5fa;
        }
      }

      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .btn-sm {
        padding: 5px 10px;
        font-size: 0.8rem;
      }
    }

    .monaco-container {
      height: 380px;
      min-height: 320px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;

      .header-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .dots-row {
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

      .preview-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .header-badges {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .reload-btn {
        color: var(--text-muted);
        padding: 4px;
        border-radius: 4px;

        &:hover {
          color: var(--text-main);
          background: var(--bg-subtle);
        }
      }
    }

    .iframe-wrapper {
      height: 380px;
      min-height: 320px;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .preview-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }

    .validation-panel {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .validation-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .val-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .val-badge {
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 600;

        &.success {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
        &.error {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }
      }

      .empty-hint {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .banner {
        padding: 10px 12px;
        border-radius: 6px;
        font-size: 0.84rem;

        &.success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
        }

        &.error {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fbbf24;
        }

        .banner-content {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .error-line {
          font-size: 0.8rem;
          color: var(--text-main);
          margin-top: 3px;
        }
      }
    }
  `]
})
export class CodeRunnerComponent implements AfterViewInit, OnChanges {
  readonly currentLabNumber = signal<number | undefined>(undefined);
  readonly currentExerciseId = signal<string | undefined>(undefined);

  @Input() set labNumber(val: number | undefined) {
    this.currentLabNumber.set(val);
  }
  get labNumber(): number | undefined {
    return this.currentLabNumber();
  }

  @Input() set exerciseId(val: string | undefined) {
    this.currentExerciseId.set(val);
  }
  get exerciseId(): string | undefined {
    return this.currentExerciseId();
  }

  @ViewChild('previewIframe') iframeRef!: ElementRef<HTMLIFrameElement>;

  readonly exerciseService = inject(ExerciseService);

  readonly selectedExerciseId = signal<string>('ex-1-1');
  readonly activeFileTab = signal<'html' | 'css'>('html');
  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly lastValidationResult = signal<ValidationSummary | null>(null);

  readonly exercisesList = computed<Exercise[]>(() => {
    const lab = this.currentLabNumber();
    if (lab !== undefined) {
      return this.exerciseService.getExercisesByLab(lab);
    }
    return this.exerciseService.exercises();
  });

  readonly activeEx = computed<Exercise>(() => {
    const list = this.exercisesList();
    return list.find(e => e.id === this.selectedExerciseId()) || list[0] || this.exerciseService.exercises()[0];
  });

  readonly labCompletedCount = computed<number>(() => {
    return this.exercisesList().filter(e => e.isCompleted).length;
  });

  constructor() {
    // Si la liste des exercices change (par ex. changement de laboratoire) et que l'exercice sélectionné n'appartient pas au nouveau laboratoire
    effect(() => {
      const list = this.exercisesList();
      const currentId = this.selectedExerciseId();
      const exId = this.currentExerciseId();

      if (exId && list.some(e => e.id === exId)) {
        if (currentId !== exId) {
          this.selectedExerciseId.set(exId);
          this.activeFileTab.set('html');
          this.showHints.set(false);
          this.showSolution.set(false);
          this.lastValidationResult.set(null);
        }
      } else if (list.length > 0 && !list.some(e => e.id === currentId)) {
        this.selectedExerciseId.set(list[0].id);
        this.activeFileTab.set('html');
        this.showHints.set(false);
        this.showSolution.set(false);
        this.lastValidationResult.set(null);
      }
    });

    effect(() => {
      // Met à jour la prévisualisation quand l'exercice change
      const ex = this.activeEx();
      if (ex) {
        setTimeout(() => this.updateIframeContent(ex.currentHtml, ex.currentCss), 20);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.exerciseId) {
      this.selectedExerciseId.set(this.exerciseId);
    } else if (this.exercisesList().length > 0) {
      this.selectedExerciseId.set(this.exercisesList()[0].id);
    }
    this.refreshIframe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exerciseId'] && this.exerciseId) {
      this.selectedExerciseId.set(this.exerciseId);
      this.activeFileTab.set('html');
      this.showHints.set(false);
      this.showSolution.set(false);
      this.lastValidationResult.set(null);
    } else if (changes['labNumber']) {
      const list = this.exerciseService.getExercisesByLab(this.labNumber ?? 1);
      if (list.length > 0) {
        this.selectedExerciseId.set(list[0].id);
      }
      this.activeFileTab.set('html');
      this.showHints.set(false);
      this.showSolution.set(false);
      this.lastValidationResult.set(null);
    }
  }

  onSelectExercise(id: string): void {
    this.selectedExerciseId.set(id);
    this.showHints.set(false);
    this.showSolution.set(false);
    this.lastValidationResult.set(null);
    const ex = this.exerciseService.exercises().find(e => e.id === id);
    if (ex) {
      this.updateIframeContent(ex.currentHtml, ex.currentCss);
    }
  }

  onHtmlChange(html: string): void {
    const ex = this.activeEx();
    this.exerciseService.updateExerciseCode(ex.id, html, ex.currentCss);
    this.updateIframeContent(html, ex.currentCss);
  }

  onCssChange(css: string): void {
    const ex = this.activeEx();
    this.exerciseService.updateExerciseCode(ex.id, ex.currentHtml, css);
    this.updateIframeContent(ex.currentHtml, css);
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    this.showSolution.update(v => !v);
  }

  injectSolution(): void {
    const ex = this.activeEx();
    this.exerciseService.injectSolution(ex.id);
    this.updateIframeContent(ex.solutionHtml, ex.solutionCss);
  }

  resetExercise(): void {
    const ex = this.activeEx();
    this.exerciseService.resetExercise(ex.id);
    this.lastValidationResult.set(null);
    this.updateIframeContent(ex.initialHtml, ex.initialCss);
  }

  refreshIframe(): void {
    const ex = this.activeEx();
    if (ex) {
      this.updateIframeContent(ex.currentHtml, ex.currentCss);
    }
  }

  validateCurrentExercise(): void {
    const iframe = this.iframeRef?.nativeElement;
    const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
    if (!doc || !doc.body) {
      this.lastValidationResult.set({
        success: false,
        passedCount: 0,
        totalCount: this.activeEx().criteria.length,
        messages: ['Le document de prévisualisation n\'est pas encore prêt. Veuillez patienter une seconde et réessayer.']
      });
      return;
    }

    const res = this.exerciseService.evaluateExercise(this.activeEx().id, doc);
    this.lastValidationResult.set(res);
  }

  private updateIframeContent(html: string, css: string): void {
    const iframe = this.iframeRef?.nativeElement;
    if (!iframe) return;

    const fullDoc = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 1rem;
      background-color: #ffffff;
      color: #212529;
    }
    /* Style utilisateur */
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    iframe.srcdoc = fullDoc;
  }
}
