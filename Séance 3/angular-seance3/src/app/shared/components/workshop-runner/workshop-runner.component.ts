import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkshopService } from '../../../core/services/workshop.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { WorkshopExercise, WorkshopFile } from '../../../core/models/app.models';

@Component({
  selector: 'app-workshop-runner',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorComponent],
  template: `
    <div class="workshop-runner-container">
      <!-- Barre supérieure de sélection des 4 Ateliers -->
      <div class="workshop-selector-bar card-panel">
        <div class="selector-tabs">
          @for (ex of workshops.exercises(); track ex.id) {
            <button 
              class="ex-pill-btn" 
              [class.active]="workshops.selectedExerciseId() === ex.id"
              [class.completed]="ex.isCompleted"
              (click)="onSelectExercise(ex.id)"
            >
              <span class="status-icon">{{ ex.isCompleted ? '✓' : ex.number }}</span>
              <span class="ex-short-title">{{ ex.title }}</span>
            </button>
          }
        </div>

        <div class="ws-progress-badge">
          <span class="badge badge-success">{{ workshops.completedCount() }} / {{ workshops.totalCount() }} Validés</span>
        </div>
      </div>

      <!-- Espace de travail de l'atelier actif -->
      <div class="workshop-workspace-grid">
        <!-- Colonne Gauche : Énoncé, Consignes & Critères -->
        <div class="card-panel brief-panel">
          <div class="brief-header">
            <div class="badges-row">
              <span class="badge badge-ts">Atelier {{ activeEx().number }}</span>
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
            <div class="statement-label">🎯 Consigne de l'exercice :</div>
            <pre class="statement-text">{{ activeEx().statement }}</pre>
          </div>

          <!-- Critères d'évaluation automatique -->
          <div class="criteria-box">
            <div class="criteria-title">Critères de validation automatique :</div>
            <div class="criteria-list">
              @for (c of activeEx().criteria; track c.id) {
                <div class="criterion-item" [class.passed]="c.passed">
                  <div class="c-icon">{{ c.passed ? '✔' : '○' }}</div>
                  <div class="c-info">
                    <div class="c-label">{{ c.label }}</div>
                    <div class="c-desc">{{ c.description }}</div>
                    @if (!c.passed && showHints()) {
                      <div class="c-hint">💡 Conseil : {{ c.hint }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Indice dépliable -->
          @if (showHints()) {
            <div class="hint-card">
              <div class="hint-title">💡 Indice pas-à-pas :</div>
              <pre class="hint-body">{{ activeEx().hint }}</pre>
            </div>
          }

          <!-- Explication guidée de la solution -->
          @if (showSolution()) {
            <div class="solution-card">
              <div class="sol-title">📖 Explication pédagogique de la solution :</div>
              <ul>
                @for (item of activeEx().solutionExplanation; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Colonne Droite : Éditeur Monaco multi-fichiers & Prévisualisation en direct -->
        <div class="editor-column">
          <!-- Barre d'outils et onglets de fichiers -->
          <div class="editor-tabs-toolbar card-panel">
            <div class="file-tabs">
              @for (file of activeEx().files; track file.name; let idx = $index) {
                <button 
                  class="file-tab-btn" 
                  [class.active]="activeEx().activeFileIndex === idx"
                  (click)="onSelectFile(idx)"
                >
                  <span class="file-lang-dot" [ngClass]="'dot-' + file.language"></span>
                  <span class="file-tab-name">{{ file.name }}</span>
                </button>
              }
            </div>

            <div class="toolbar-actions">
              <button class="btn-secondary btn-sm" (click)="toggleHints()">
                {{ showHints() ? 'Masquer Indice' : '💡 Indice' }}
              </button>
              <button class="btn-secondary btn-sm" (click)="toggleSolution()">
                {{ showSolution() ? 'Masquer Solution' : '📖 Solution' }}
              </button>
              <button class="btn-secondary btn-sm" (click)="injectSolution()" title="Injecter la correction officielle">
                Injecter Solution
              </button>
              <button class="btn-secondary btn-sm" (click)="resetExercise()" title="Réinitialiser le code d'origine">
                ↺ Réinitialiser
              </button>
              <button class="btn-primary btn-sm" (click)="validate()">
                🚀 Valider
              </button>
            </div>
          </div>

          <!-- Zone Éditeur Monaco -->
          <div class="monaco-wrapper-card card-panel">
            <app-monaco-editor
              [code]="currentFile().currentContent"
              [language]="currentFile().language"
              (codeChange)="onCodeChange($event)"
            ></app-monaco-editor>
          </div>

          <!-- Message de validation -->
          @if (validationMessage()) {
            <div class="validation-banner" [class.success]="validationSuccess()" [class.error]="!validationSuccess()">
              <span>{{ validationMessage() }}</span>
            </div>
          }

          <!-- Prévisualisation en Direct du Résultat -->
          <div class="live-preview-card card-panel">
            <div class="preview-header">
              <span class="preview-dot"></span>
              <span class="preview-title">Aperçu Visuel de l'Interface en Direct (Live Preview)</span>
              <span class="preview-tag">Rendu Navigateur</span>
            </div>

            <div class="preview-viewport">
              @switch (activeEx().id) {
                @case ('ws-3-1') {
                  <!-- Prévisualisation Atelier 3.1 -->
                  <div class="preview-app-card">
                    <h2>Cours de Programmation Orientée Objet</h2>
                    <h3>Séance n°3 : Présentation générale d'Angular</h3>
                    <p class="preview-student-row">
                      Étudiant : <strong>{{ previewStudentName() }}</strong> 
                      (Année académique : {{ previewAcademicYear() }})
                    </p>
                    <p>Statut du cours : <span class="status-online">En direct</span></p>
                    <button class="preview-btn" (click)="togglePreviewStatus()">Changer le statut</button>
                  </div>
                }

                @case ('ws-3-2') {
                  <!-- Prévisualisation Atelier 3.2 -->
                  <div class="preview-app-card">
                    <h2>Cours de Programmation Orientée Objet</h2>
                    <h3>Séance n°3 : Présentation générale d'Angular</h3>
                    <hr />
                    <h3 class="preview-counter-heading">Nombre d'interactions : <span class="count-badge">{{ previewClickCount() }}</span></h3>
                    <div class="preview-btn-row">
                      <button class="preview-btn" (click)="previewIncrement()">Compter (+1)</button>
                      <button class="preview-btn-secondary" (click)="previewReset()" [disabled]="previewClickCount() === 0">
                        Réinitialiser
                      </button>
                    </div>
                    <hr />
                    <p>Statut du cours : <span class="status-online">En direct</span></p>
                  </div>
                }

                @case ('ws-3-3') {
                  <!-- Prévisualisation Atelier 3.3 -->
                  <div class="preview-app-layout">
                    <div class="preview-header-comp">
                      <h2>🎓 En-tête de l'application (HeaderComponent)</h2>
                      <p>Plateforme d'apprentissage Angular — EAFC Colfontaine</p>
                    </div>

                    <div class="preview-app-card">
                      <h2>Cours de Programmation Orientée Objet</h2>
                      <h3>Séance n°3 : Présentation générale d'Angular</h3>
                      <p>Composant racine AppComponent fonctionnel avec son sous-composant imbriqué !</p>
                    </div>
                  </div>
                }

                @case ('ws-3-4') {
                  <!-- Prévisualisation Atelier 3.4 -->
                  <div class="preview-app-layout">
                    <div class="preview-header-comp scoped-purple">
                      <h2>🎓 En-tête de l'application (HeaderComponent)</h2>
                      <p class="child-p-scoped">Je suis un paragraphe du composant ENFANT (coloré en violet et italique grâce à votre CSS !)</p>
                    </div>

                    <div class="preview-app-card">
                      <h2>Composant Racine (AppComponent)</h2>
                      <p class="parent-p-untouched">
                        Je suis un paragraphe du composant PARENT. Je reste noir/gris standard car le style CSS est isolé par Angular !
                      </p>
                    </div>
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
    .workshop-runner-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .workshop-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .selector-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .ex-pill-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;

      .status-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--border-color);
        color: var(--text-main);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.72rem;
      }

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: rgba(221, 0, 49, 0.15);
        border-color: #dd0031;
        color: #f87171;

        .status-icon {
          background: #dd0031;
          color: #ffffff;
        }
      }

      &.completed {
        border-color: rgba(16, 185, 129, 0.5);
        .status-icon {
          background: #10b981;
          color: #ffffff;
        }
      }
    }

    .workshop-workspace-grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 20px;
      min-height: 600px;
    }

    .brief-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      overflow-y: auto;
      max-height: 820px;
    }

    .brief-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;

      .badges-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .brief-title {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .brief-sub {
        font-size: 0.82rem;
        color: var(--text-muted);
      }
    }

    .statement-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;

      .statement-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 6px;
      }

      .statement-text {
        font-family: var(--font-sans);
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.5;
        white-space: pre-wrap;
        margin: 0;
      }
    }

    .criteria-box {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .criteria-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-dim);
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
        border-radius: 6px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        font-size: 0.8rem;

        .c-icon {
          font-weight: 800;
          color: var(--text-dim);
          margin-top: 1px;
        }

        .c-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .c-label {
          font-weight: 700;
          color: var(--text-main);
        }

        .c-desc {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .c-hint {
          font-size: 0.74rem;
          color: #fbbf24;
          margin-top: 2px;
        }

        &.passed {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.4);

          .c-icon {
            color: #10b981;
          }

          .c-label {
            color: #10b981;
          }
        }
      }
    }

    .hint-card, .solution-card {
      background: rgba(49, 120, 198, 0.08);
      border-left: 3px solid #3178c6;
      border-radius: 0 8px 8px 0;
      padding: 12px;
      font-size: 0.82rem;

      .hint-title, .sol-title {
        font-weight: 700;
        color: #38bdf8;
        margin-bottom: 6px;
      }

      .hint-body {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--text-main);
        margin: 0;
        white-space: pre-wrap;
      }

      ul {
        margin: 0;
        padding-left: 18px;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    /* Colonne Éditeur & Preview */
    .editor-column {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .editor-tabs-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .file-tabs {
      display: flex;
      gap: 6px;
    }

    .file-tab-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 5px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-muted);

      .file-lang-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        &.dot-typescript { background: #3178c6; }
        &.dot-html { background: #ea580c; }
        &.dot-css { background: #9333ea; }
      }

      &:hover {
        color: var(--text-main);
      }

      &.active {
        background: var(--bg-card);
        color: var(--text-main);
        border-color: #dd0031;
        font-weight: 600;
      }
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .btn-sm {
      padding: 5px 12px;
      font-size: 0.78rem;
    }

    .monaco-wrapper-card {
      padding: 0;
      overflow: hidden;
      height: 380px;
      min-height: 380px;
      border: 1px solid var(--border-color);
    }

    .validation-banner {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;

      &.success {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.4);
      }

      &.error {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.4);
      }
    }

    /* Live Preview Card */
    .live-preview-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;

      .preview-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
      }

      .preview-title {
        font-size: 0.84rem;
        font-weight: 700;
        color: var(--text-main);
        flex: 1;
      }

      .preview-tag {
        font-size: 0.7rem;
        background: var(--bg-subtle);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--text-muted);
      }
    }

    .preview-viewport {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 16px;
      min-height: 160px;
    }

    .preview-app-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      font-family: Arial, sans-serif;

      h2 { margin: 0 0 4px 0; font-size: 1.05rem; color: var(--text-main); }
      h3 { margin: 0 0 10px 0; font-size: 0.9rem; color: var(--text-muted); font-weight: normal; }
      p { margin: 6px 0; font-size: 0.85rem; color: var(--text-main); }

      .status-online { color: green; font-weight: bold; }

      .preview-btn {
        margin-top: 10px;
        background: #dd0031;
        color: #ffffff;
        padding: 6px 14px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
      }

      .preview-btn-secondary {
        margin-top: 10px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-main);
        padding: 6px 14px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
      }
    }

    .preview-btn-row {
      display: flex;
      gap: 8px;
    }

    .count-badge {
      color: #dd0031;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .preview-app-layout {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .preview-header-comp {
      background: #1e293b;
      padding: 14px;
      border-radius: 6px;
      border-left: 4px solid #dd0031;

      h2 { margin: 0 0 4px 0; color: #f8fafc; font-size: 1rem; }
      p { margin: 0; color: #94a3b8; font-size: 0.82rem; }

      &.scoped-purple {
        .child-p-scoped {
          color: purple !important;
          font-style: italic !important;
          font-weight: bold !important;
        }
      }
    }
  `]
})
export class WorkshopRunnerComponent {
  readonly workshops = inject(WorkshopService);

  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly validationMessage = signal<string | null>(null);
  readonly validationSuccess = signal<boolean>(false);

  // État interactif de la preview pour les ateliers
  readonly previewClickCount = signal<number>(0);

  activeEx(): WorkshopExercise {
    return this.workshops.activeExercise();
  }

  currentFile(): WorkshopFile {
    const ex = this.activeEx();
    return ex.files[ex.activeFileIndex] || ex.files[0];
  }

  onSelectExercise(id: string): void {
    this.workshops.selectExercise(id);
    this.validationMessage.set(null);
    this.previewClickCount.set(0);
  }

  onSelectFile(index: number): void {
    this.workshops.setActiveFileIndex(this.activeEx().id, index);
  }

  onCodeChange(newCode: string): void {
    const ex = this.activeEx();
    this.workshops.updateFileContent(ex.id, ex.activeFileIndex, newCode);
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    this.showSolution.update(v => !v);
  }

  injectSolution(): void {
    this.workshops.injectSolution(this.activeEx().id);
    this.validationSuccess.set(true);
    this.validationMessage.set('✔ Solution injectée et validée avec succès !');
  }

  resetExercise(): void {
    this.workshops.resetExercise(this.activeEx().id);
    this.validationMessage.set(null);
    this.previewClickCount.set(0);
  }

  validate(): void {
    const passed = this.workshops.validateExercise(this.activeEx().id);
    this.validationSuccess.set(passed);

    if (passed) {
      this.validationMessage.set('🎉 Bravo ! Tous les critères de l\'atelier sont validés avec succès !');
    } else {
      this.validationMessage.set('❌ Certains critères ne sont pas encore satisfaits. Consultez les indices à gauche.');
    }
  }

  // Fonctions de preview réactive
  previewStudentName(): string {
    const tsCode = this.activeEx().files.find(f => f.name.endsWith('.ts'))?.currentContent || '';
    const match = tsCode.match(/studentName\s*(?::\s*string)?\s*=\s*['"]([^'"]+)['"]/);
    return match ? match[1] : 'Jean Dupont';
  }

  previewAcademicYear(): string {
    const tsCode = this.activeEx().files.find(f => f.name.endsWith('.ts'))?.currentContent || '';
    const match = tsCode.match(/academicYear\s*(?::\s*string)?\s*=\s*['"]([^'"]+)['"]/);
    return match ? match[1] : '2025-2026';
  }

  togglePreviewStatus(): void {
    // Interaction visuelle
  }

  previewIncrement(): void {
    this.previewClickCount.update(c => c + 1);
  }

  previewReset(): void {
    this.previewClickCount.set(0);
  }
}
