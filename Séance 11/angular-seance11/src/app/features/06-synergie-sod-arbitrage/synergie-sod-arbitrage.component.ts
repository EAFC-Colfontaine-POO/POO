import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface QuizQuestion {
  id: number;
  snippet: string;
  question: string;
  options: { label: string; principle: 'S' | 'O' | 'D'; pattern: string; isCorrect: boolean }[];
  explanation: string;
}

@Component({
  selector: 'app-synergie-sod-arbitrage',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 11 · Synthèse &amp; Décision</span>
          <span class="badge badge-purple">Synergie S-O-D</span>
          <span class="badge badge-emerald">Quiz Code Smell Detector</span>
        </div>
        <h2>Synergie S-O-D &amp; Tableau d'Arbitrage</h2>
        <p class="module-desc">
          Les principes SOLID ne travaillent pas en silos : ils forment un pipeline vertueux de conception.
          <strong>SRP</strong> isole les responsabilités, <strong>OCP</strong> formalise les points de variation par des interfaces,
          et <strong>DIP</strong> injecte ces contrats pour bannir les couplages techniques directs.
        </p>

        <!-- Bascule Théorie & Simulateurs vs Atelier Pratique -->
        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'interactive'"
            (click)="activeMode.set('interactive')"
          >
            🔬 Pipeline S-O-D &amp; Quiz Interactif
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            💻 Défi Synthèse Monaco (Labo 4 · 2 Exercices)
          </button>
        </div>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- SECTION 1 : LE PIPELINE VERTUEUX S ➔ O ➔ D -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-indigo">Enchaînement Systémique</span>
            <h3>Le Pipeline Vertueux : S ➔ O ➔ D</h3>
          </div>
          <p class="section-intro">
            Découvrez comment chaque principe prépare et rend possible le suivant dans votre workflow d'architecture :
          </p>

          <div class="pipeline-container mt-3">
            <!-- Étape 1 : S -->
            <div class="pipeline-step" [class.active]="pipelineStep() === 1" (click)="pipelineStep.set(1)">
              <div class="step-num s-badge">1. SRP</div>
              <h4>Découper les Responsabilités</h4>
              <p class="step-desc">
                On identifie les acteurs. On démantèle le monolithe en classes à haute cohésion (1 seule raison de changer).
              </p>
              <div class="step-result">
                <span>Résultat :</span>
                <code>Classe Métier isolée de l'UI et du Stockage</code>
              </div>
            </div>

            <div class="pipeline-arrow">➔</div>

            <!-- Étape 2 : O -->
            <div class="pipeline-step" [class.active]="pipelineStep() === 2" (click)="pipelineStep.set(2)">
              <div class="step-num o-badge">2. OCP</div>
              <h4>Formaliser les Contrats d'Extension</h4>
              <p class="step-desc">
                Pour chaque comportement susceptible d'évoluer (remises, TVA, formats), on pose une <strong>interface</strong>.
              </p>
              <div class="step-result">
                <span>Résultat :</span>
                <code>interface StrategieRemise (Fermé à la modif)</code>
              </div>
            </div>

            <div class="pipeline-arrow">➔</div>

            <!-- Étape 3 : D -->
            <div class="pipeline-step" [class.active]="pipelineStep() === 3" (click)="pipelineStep.set(3)">
              <div class="step-num d-badge">3. DIP</div>
              <h4>Injecter les Abstractions</h4>
              <p class="step-desc">
                On supprime tout <code>new</code> direct. Le module de haut niveau reçoit le contrat via son constructeur ou <code>inject()</code>.
              </p>
              <div class="step-result">
                <span>Résultat :</span>
                <code>100% Testable en RAM (Fake Repo / Mock)</code>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2 : QUIZ INTERACTIF CODE SMELL DETECTOR -->
        <div class="card-panel">
          <div class="card-title-row">
            <span class="badge badge-emerald">Auto-Évaluation</span>
            <h3>Quiz : Code Smell Detector (Diagnostiquer le Principe &amp; le Pattern)</h3>
          </div>
          <p class="section-intro">
            Analysez l'extrait de code ci-dessous. Quel principe SOLID est violé et quel patron de conception faut-il appliquer ?
          </p>

          <div class="quiz-box mt-3">
            <div class="quiz-progress-row">
              <span class="q-badge">Question {{ currentQuestionIndex() + 1 }} / {{ questions.length }}</span>
              <span class="score-badge">Score : {{ score() }} / {{ answeredCount() }}</span>
            </div>

            <div class="quiz-snippet-wrapper">
              <pre><code>{{ currentQuestion().snippet }}</code></pre>
            </div>

            <h4 class="q-title">{{ currentQuestion().question }}</h4>

            <div class="options-grid">
              @for (opt of currentQuestion().options; track $index) {
                <button 
                  class="quiz-option-btn"
                  [disabled]="hasAnsweredCurrent()"
                  [class.correct]="hasAnsweredCurrent() && opt.isCorrect"
                  [class.wrong]="hasAnsweredCurrent() && selectedOptionIndex() === $index && !opt.isCorrect"
                  (click)="answerQuestion($index)"
                >
                  <span class="opt-key">{{ ['A', 'B', 'C', 'D'][$index] }}</span>
                  <div class="opt-body">
                    <strong>Principe [{{ opt.principle }}]</strong> — {{ opt.label }}
                    <span class="opt-pattern">Pattern recommandé : {{ opt.pattern }}</span>
                  </div>
                </button>
              }
            </div>

            @if (hasAnsweredCurrent()) {
              <div class="explanation-box mt-3" [class.success]="isCurrentCorrect()" [class.error]="!isCurrentCorrect()">
                <div class="exp-title">
                  {{ isCurrentCorrect() ? '🎉 Excellent Diagnostic !' : '❌ Diagnostic Incorrect' }}
                </div>
                <p>{{ currentQuestion().explanation }}</p>
                <div class="quiz-actions-row">
                  @if (currentQuestionIndex() < questions.length - 1) {
                    <button class="btn-primary btn-sm" (click)="nextQuestion()">
                      Question Suivante ➔
                    </button>
                  } @else {
                    <button class="btn-secondary btn-sm" (click)="restartQuiz()">
                      🔄 Recommencer le Quiz
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO : LABO 4 (DÉFI SYNTHÈSE · 2 EXERCICES) -->
        <app-lab-runner [filterLabNumber]="4"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .demo-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 10px;

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .section-intro {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .pipeline-container {
      display: flex;
      align-items: center;
      gap: 12px;

      @media (max-width: 900px) {
        flex-direction: column;
      }
    }

    .pipeline-step {
      flex: 1;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: rgba(99, 102, 241, 0.4);
        background: var(--bg-card);
      }

      &.active {
        border-color: #6366f1;
        background: var(--bg-card);
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);
      }

      .step-num {
        font-size: 0.76rem;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 4px;
        width: fit-content;
        font-family: var(--font-mono);

        &.s-badge { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        &.o-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        &.d-badge { background: rgba(139, 92, 246, 0.2); color: #c084fc; }
      }

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .step-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .step-result {
        margin-top: auto;
        padding-top: 8px;
        border-top: 1px dashed var(--border-color);
        font-size: 0.74rem;

        span { color: var(--text-dim); }
        code { color: #818cf8; display: block; margin-top: 2px; }
      }
    }

    .pipeline-arrow {
      font-size: 1.3rem;
      color: var(--text-dim);
      font-family: var(--font-mono);
    }

    .quiz-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .quiz-progress-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .q-badge {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }

      .score-badge {
        font-size: 0.78rem;
        font-weight: 700;
        color: #10b981;
        font-family: var(--font-mono);
      }
    }

    .quiz-snippet-wrapper {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;

      pre {
        margin: 0;
        font-size: 0.78rem;
        color: var(--text-code);
        line-height: 1.4;
      }
    }

    .q-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .quiz-option-btn {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      text-align: left;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: var(--bg-card-hover);
        border-color: #6366f1;
      }

      .opt-key {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.75rem;
        font-family: var(--font-mono);
        color: var(--text-muted);
      }

      .opt-body {
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: 0.82rem;
        color: var(--text-main);

        .opt-pattern {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
      }

      &.correct {
        background: rgba(16, 185, 129, 0.15) !important;
        border-color: #10b981 !important;
        color: #ecfdf5 !important;
      }

      &.wrong {
        background: rgba(244, 63, 94, 0.15) !important;
        border-color: #f43f5e !important;
        color: #fecdd3 !important;
      }
    }

    .explanation-box {
      padding: 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      line-height: 1.45;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #a7f3d0;
      }

      &.error {
        background: rgba(244, 63, 94, 0.12);
        border: 1px solid rgba(244, 63, 94, 0.3);
        color: #fecdd3;
      }

      .exp-title {
        font-weight: 800;
      }
    }

    .quiz-actions-row {
      margin-top: 4px;
    }
  `]
})
export class SynergieSodArbitrageComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly pipelineStep = signal<number>(1);

  readonly questions: QuizQuestion[] = [
    {
      id: 1,
      snippet: `export class GestionnaireCommande {
  valider(cmd: Commande) {
    if (cmd.modePaiement === 'PAYPAL') { ... }
    else if (cmd.modePaiement === 'STRIPE') { ... }
    else if (cmd.modePaiement === 'CRYPTO') { ... }
  }
}`,
      question: 'Quel principe est violé dans la méthode valider() et comment corriger ce code ?',
      options: [
        {
          label: 'La méthode est trop longue pour une seule classe',
          principle: 'S',
          pattern: 'Facade Pattern',
          isCorrect: false
        },
        {
          label: 'L\'ajout d\'un 4e moyen de paiement oblige à modifier le code existant',
          principle: 'O',
          pattern: 'Pattern Stratégie (PasserellePaiement)',
          isCorrect: true
        },
        {
          label: 'Le type Commande devrait hériter de ModePaiement',
          principle: 'D',
          pattern: 'Héritage multiple',
          isCorrect: false
        },
        {
          label: 'GestionnaireCommande utilise des chaînes littérales au lieu de Symbol',
          principle: 'S',
          pattern: 'Enumération TypeScript',
          isCorrect: false
        }
      ],
      explanation: 'Le branchement if/else sur le mode de paiement viole l\'Open/Closed Principle (OCP). En créant une interface PasserellePaiement et des stratégies concrètes (PaiementPaypal, PaiementStripe), la méthode valider() devient fermée à la modification.'
    },
    {
      id: 2,
      snippet: `export class FactureService {
  private baseDeDonnees = new SQLiteDatabase('factures.db');

  sauvegarder(f: Facture): void {
    this.baseDeDonnees.insert(f);
  }
}`,
      question: 'Pourquoi FactureService est-il impossible à tester proprement en test unitaire ?',
      options: [
        {
          label: 'FactureService instancie en dur un détail technique bas niveau (SQLiteDatabase)',
          principle: 'D',
          pattern: 'Repository Pattern (Injection d\'interface)',
          isCorrect: true
        },
        {
          label: 'La méthode sauvegarder ne renvoie pas de Promise<void>',
          principle: 'S',
          pattern: 'Async / Await',
          isCorrect: false
        },
        {
          label: 'On ne peut pas étendre FactureService avec un autre moteur SQLite',
          principle: 'O',
          pattern: 'Template Method',
          isCorrect: false
        },
        {
          label: 'FactureService manipule des objets Facture sans les cloner',
          principle: 'S',
          pattern: 'Immutabilité pure',
          isCorrect: false
        }
      ],
      explanation: 'FactureService viole le principe d\'inversion de dépendance (DIP) à cause du new SQLiteDatabase(). Il est soudé à la base de données. Pour le tester sans créer de fichier factures.db, il faut lui injecter une abstraction IFactureRepository.'
    },
    {
      id: 3,
      snippet: `export class UtilisateurService {
  authentifier(login: string, pass: string): boolean { ... }
  genererPdfBilan(user: Utilisateur): Buffer { ... }
  envoyerSmsRappel(numero: string): void { ... }
}`,
      question: 'Qu\'est-ce qui cloche dans la cohésion de cette classe ?',
      options: [
        {
          label: 'Elle possède 3 raisons de changer (Sécurité, Rendu PDF, Télécoms)',
          principle: 'S',
          pattern: 'Séparation en 3 Services Spécialisés',
          isCorrect: true
        },
        {
          label: 'Elle n\'utilise pas de switch pour choisir le format PDF',
          principle: 'O',
          pattern: 'Pattern Builder',
          isCorrect: false
        },
        {
          label: 'Elle ne déclare pas ses méthodes en protected abstract',
          principle: 'D',
          pattern: 'Inversion IoC',
          isCorrect: false
        },
        {
          label: 'La méthode authentifier devrait retourner un Token JWT',
          principle: 'S',
          pattern: 'OAuth2 Factory',
          isCorrect: false
        }
      ],
      explanation: 'Cette classe viole le Single Responsibility Principle (SRP). Elle mélange la sécurité, le rendu graphique PDF et l\'envoi de SMS. Si le format de PDF change, on modifie la même classe que celle qui gère les mots de passe !'
    }
  ];

  readonly currentQuestionIndex = signal<number>(0);
  readonly selectedOptionIndex = signal<number | null>(null);
  readonly hasAnsweredCurrent = signal<boolean>(false);
  readonly score = signal<number>(0);
  readonly answeredCount = signal<number>(0);

  currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex()];
  }

  isCurrentCorrect(): boolean {
    const sel = this.selectedOptionIndex();
    if (sel === null) return false;
    return this.currentQuestion().options[sel].isCorrect;
  }

  answerQuestion(index: number): void {
    if (this.hasAnsweredCurrent()) return;
    this.selectedOptionIndex.set(index);
    this.hasAnsweredCurrent.set(true);
    this.answeredCount.update(c => c + 1);
    if (this.currentQuestion().options[index].isCorrect) {
      this.score.update(s => s + 1);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedOptionIndex.set(null);
      this.hasAnsweredCurrent.set(false);
    }
  }

  restartQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.selectedOptionIndex.set(null);
    this.hasAnsweredCurrent.set(false);
    this.score.set(0);
    this.answeredCount.set(0);
  }
}
