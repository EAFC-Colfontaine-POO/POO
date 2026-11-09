import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface LoopStep {
  id: number;
  description: string;
  callStack: string[];
  webApis: string[];
  taskQueue: string[];
  eventLoopActive: boolean;
  explanation: string;
}

interface QuizItem {
  id: string;
  label: string;
  category: 'sync' | 'async';
  selectedCategory?: 'sync' | 'async';
  explanation: string;
}

@Component({
  selector: 'app-event-loop-clock',
  standalone: true,
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 01 · Asynchronisme Réseau &amp; Moteur V8</div>
        <h2>L'Horlogerie de l'Event Loop &amp; Le Défi Asynchrone</h2>
        <p class="module-desc">
          Dans un navigateur, JavaScript s'exécute sur <strong>un seul et unique thread d'exécution</strong>.
          Comprenez comment la Call Stack, les Web APIs du navigateur, la file des tâches et l'Event Loop
          permettent d'interroger des serveurs distants sans jamais paralyser l'interface utilisateur.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'event-loop'" (click)="activeSubTab.set('event-loop')">
              ⚙️ Simulateur de l'Event Loop
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'restaurant'" (click)="activeSubTab.set('restaurant')">
              🍽️ Analogie du Restaurant (Synchrone vs Asynchrone)
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'arbitrage'" (click)="activeSubTab.set('arbitrage')">
              ⚖️ Grille d'Arbitrage (Quiz Express)
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 1 ➔
          </button>
        </div>
      </div>

      <!-- SOUS-ONGLET 1 : SIMULATEUR EVENT LOOP -->
      @if (activeSubTab() === 'event-loop') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Simulateur Visuel des 4 Compartiments</h3>
              <p class="zone-subtitle">Suivez pas-à-pas la vie d'un appel réseau <code>fetch()</code> / <code>httpResource()</code> au cœur du moteur JavaScript.</p>
            </div>

            <div class="sim-controls">
              <button class="btn-secondary" (click)="prevStep()" [disabled]="currentStepIndex() === 0">⏮ Étape précédente</button>
              <button class="btn-primary" (click)="nextStep()" [disabled]="currentStepIndex() === steps.length - 1">Étape suivante ⏭</button>
              <button class="btn-secondary" (click)="resetSimulation()">🔄 Réinitialiser</button>
            </div>
          </div>

          <!-- Les 4 Compartiments -->
          <div class="event-loop-grid">
            <!-- 1. Call Stack -->
            <div class="compartment-box">
              <div class="comp-header">
                <span class="comp-badge">1</span>
                <div>
                  <h4 class="comp-title">Call Stack (Pile d'Appels)</h4>
                  <span class="comp-sub">Synchrone · Mono-thread (LIFO)</span>
                </div>
              </div>
              <div class="comp-body stack-view">
                @if (currentStep().callStack.length === 0) {
                  <div class="empty-state">Stack vide (prête pour l'Event Loop)</div>
                } @else {
                  @for (frame of currentStep().callStack; track frame) {
                    <div class="stack-frame animate-pop">
                      <span class="frame-tag">EXEC</span>
                      <code>{{ frame }}</code>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- 2. Web APIs -->
            <div class="compartment-box">
              <div class="comp-header">
                <span class="comp-badge">2</span>
                <div>
                  <h4 class="comp-title">Web APIs Navigateur</h4>
                  <span class="comp-sub">Threads système en arrière-plan</span>
                </div>
              </div>
              <div class="comp-body web-apis-view">
                @if (currentStep().webApis.length === 0) {
                  <div class="empty-state">Aucun travail réseau en cours</div>
                } @else {
                  @for (task of currentStep().webApis; track task) {
                    <div class="webapi-card animate-pulse-custom">
                      <span class="api-icon">🌐</span>
                      <div class="api-info">
                        <strong>{{ task }}</strong>
                        <span class="sub-text">Attente latence réseau...</span>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- 3. Task / Microtask Queue -->
            <div class="compartment-box">
              <div class="comp-header">
                <span class="comp-badge">3</span>
                <div>
                  <h4 class="comp-title">File des Tâches &amp; Callbacks</h4>
                  <span class="comp-sub">File d'attente FIFO (Prête à être injectée)</span>
                </div>
              </div>
              <div class="comp-body queue-view">
                @if (currentStep().taskQueue.length === 0) {
                  <div class="empty-state">File d'attente vide</div>
                } @else {
                  @for (item of currentStep().taskQueue; track item) {
                    <div class="queue-item animate-slide">
                      <span class="queue-tag">CALLBACK PRÊT</span>
                      <code>{{ item }}</code>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- 4. L'Aiguilleur Event Loop -->
            <div class="compartment-box loop-box" [class.loop-active]="currentStep().eventLoopActive">
              <div class="comp-header">
                <span class="comp-badge">4</span>
                <div>
                  <h4 class="comp-title">L'Aiguilleur (Event Loop)</h4>
                  <span class="comp-sub">Surveillance permanente</span>
                </div>
              </div>
              <div class="comp-body loop-visual">
                <div class="loop-spinner" [class.spinning]="currentStep().eventLoopActive">
                  <div class="loop-arrow">↻</div>
                </div>
                <div class="loop-status-text">
                  @if (currentStep().eventLoopActive) {
                    <span class="text-success font-bold">Stack vide détectée ! Injection de la tâche...</span>
                  } @else {
                    <span class="text-muted">En attente que la Call Stack soit complètement libérée</span>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Explication de l'étape courante -->
          <div class="step-card mt-3">
            <div class="step-badge">Étape {{ currentStepIndex() + 1 }} / {{ steps.length }} : {{ currentStep().description }}</div>
            <p class="step-explanation">{{ currentStep().explanation }}</p>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 2 : ANALOGIE DU RESTAURANT -->
      @if (activeSubTab() === 'restaurant') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Le Restaurant : Serveur Bloqué vs Buzzer Électronique</h3>
              <p class="zone-subtitle">Comparez le comportement de l'interface en situation de blocage synchrone vs asynchronisme non-bloquant.</p>
            </div>
          </div>

          <div class="grid-2-cols">
            <!-- Mode Synchrone -->
            <div class="restaurant-card sync-mode">
              <div class="rest-header text-danger">
                <h4>🔴 Serveur Synchrone (Bloquant)</h4>
                <span class="badge badge-warning">Freeze de l'écran</span>
              </div>
              <div class="rest-story">
                <p><strong>1.</strong> Le client commande un plat qui demande 25 minutes de cuisson.</p>
                <p><strong>2.</strong> Le serveur dépose la commande en cuisine.</p>
                <p><strong>3.</strong> <strong>Il reste planté immobile devant les fourneaux</strong> sans rien faire, attendant la fin de la cuisson !</p>
                <p class="consequence">💥 <strong>Conséquence :</strong> Plus aucun autre client ne peut être accueilli, personne ne reçoit ses boissons, le restaurant est paralysé !</p>
              </div>

              <div class="interactive-freeze-test">
                <button class="btn-danger w-full" (click)="simulateSyncFreeze()">
                  🧊 Simuler un appel synchrone (Simuler Freeze UI)
                </button>
                @if (isSyncFrozen()) {
                  <div class="freeze-alert">
                    ⚠️ <strong>THREAD BLOQUÉ :</strong> Tentative de clic ignorée, FPS = 0, avertissement "Page ne répond pas" du navigateur !
                  </div>
                }
              </div>
            </div>

            <!-- Mode Asynchrone -->
            <div class="restaurant-card async-mode">
              <div class="rest-header text-success">
                <h4>🟢 Serveur Asynchrone (Non-Bloquant)</h4>
                <span class="badge badge-success">Fluidité 60 FPS</span>
              </div>
              <div class="rest-story">
                <p><strong>1.</strong> Le client commande son plat.</p>
                <p><strong>2.</strong> Le serveur lui confie un <strong>buzzer électronique</strong> (la Promesse).</p>
                <p><strong>3.</strong> <strong>Il retourne immédiatement en salle :</strong> il accueille de nouvelles tables, prend des commandes et sert les desserts.</p>
                <p class="consequence">🔔 <strong>Quand le bip sonne :</strong> Le serveur va chercher le plat dès qu'il a les mains libres et le dépose sur la table.</p>
              </div>

              <div class="interactive-buzzer-test">
                <button class="btn-success w-full" (click)="simulateAsyncBuzzer()">
                  🔔 Déclencher une commande asynchrone (Buzzer)
                </button>
                <div class="buzzer-status">
                  <span>Compteur de réactivité (clics pendant attente) : <strong>{{ asyncClicks() }}</strong></span>
                  <button class="btn-secondary btn-sm" (click)="incrementAsyncClicks()">🖱️ Cliquer pendant l'attente</button>
                </div>
                @if (buzzerActive()) {
                  <div class="buzzer-ringing">
                    🍽️ <strong>LE BIP SONNE !</strong> Les données sont arrivées en arrière-plan sans ralentir l'interface !
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 3 : GRILLE D'ARBITRAGE -->
      @if (activeSubTab() === 'arbitrage') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Grille d'Arbitrage : Quand Employer le Synchrone vs Asynchrone ?</h3>
              <p class="zone-subtitle">Classez chaque opération technique dans la bonne famille. Règle d'or : en RAM ➔ Synchrone ; franchissement de frontière physique ➔ Asynchrone.</p>
            </div>

            <div class="quiz-score-badge">
              <span class="badge badge-purple">Score : {{ getQuizScore() }} / {{ quizItems.length }}</span>
            </div>
          </div>

          <div class="quiz-grid">
            @for (item of quizItems; track item.id) {
              <div class="quiz-card" [class.correct]="item.selectedCategory && item.selectedCategory === item.category" [class.incorrect]="item.selectedCategory && item.selectedCategory !== item.category">
                <div class="quiz-label">{{ item.label }}</div>

                <div class="quiz-choices">
                  <button 
                    class="choice-btn" 
                    [class.selected]="item.selectedCategory === 'sync'"
                    (click)="selectQuizCategory(item, 'sync')"
                  >
                    ⚡ Synchrone
                  </button>
                  <button 
                    class="choice-btn" 
                    [class.selected]="item.selectedCategory === 'async'"
                    (click)="selectQuizCategory(item, 'async')"
                  >
                    🌐 Asynchrone
                  </button>
                </div>

                @if (item.selectedCategory) {
                  <div class="quiz-feedback">
                    @if (item.selectedCategory === item.category) {
                      <span class="text-success">✔ Correct !</span>
                    } @else {
                      <span class="text-danger">✖ Incorrect !</span>
                    }
                    <p class="quiz-exp">{{ item.explanation }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .event-loop-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 16px;
    }

    .compartment-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      min-height: 240px;

      .comp-header {
        padding: 12px 14px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 8px 8px 0 0;

        .comp-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #3b82f6;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .comp-title {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .comp-sub {
          font-size: 0.7rem;
          color: var(--text-dim);
          display: block;
        }
      }

      .comp-body {
        padding: 12px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }

    .empty-state {
      font-size: 0.78rem;
      color: var(--text-dim);
      font-style: italic;
      text-align: center;
      margin: auto;
    }

    .stack-frame {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid #3b82f6;
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 3px;

      .frame-tag {
        font-size: 0.65rem;
        font-weight: 700;
        color: #60a5fa;
      }
    }

    .webapi-card {
      background: rgba(147, 51, 234, 0.15);
      border: 1px solid #9333ea;
      border-radius: 6px;
      padding: 8px;
      display: flex;
      align-items: center;
      gap: 8px;

      .api-icon {
        font-size: 1.2rem;
      }

      .api-info {
        display: flex;
        flex-direction: column;
        font-size: 0.78rem;

        .sub-text {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
      }
    }

    .queue-item {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 3px;

      .queue-tag {
        font-size: 0.65rem;
        font-weight: 700;
        color: #34d399;
      }
    }

    .loop-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 12px;

      .loop-spinner {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 3px dashed var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        color: var(--text-muted);

        &.spinning {
          border-color: #10b981;
          color: #10b981;
          animation: spin 3s linear infinite;
        }
      }

      .loop-status-text {
        font-size: 0.75rem;
      }
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .step-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 18px;

      .step-badge {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--ts-blue-light);
        margin-bottom: 4px;
      }

      .step-explanation {
        font-size: 0.88rem;
        color: var(--text-main);
        line-height: 1.5;
      }
    }

    .restaurant-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .rest-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
          font-size: 1.05rem;
          font-weight: 700;
        }
      }

      .rest-story {
        font-size: 0.85rem;
        line-height: 1.5;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .consequence {
          background: rgba(0, 0, 0, 0.2);
          padding: 8px 10px;
          border-radius: 6px;
        }
      }
    }

    .freeze-alert {
      margin-top: 10px;
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      color: #fca5a5;
      padding: 10px;
      border-radius: 6px;
      font-size: 0.82rem;
    }

    .buzzer-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      font-size: 0.82rem;
    }

    .buzzer-ringing {
      margin-top: 10px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid #10b981;
      color: #6ee7b7;
      padding: 10px;
      border-radius: 6px;
      font-size: 0.82rem;
    }

    .quiz-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 16px;
    }

    .quiz-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.correct {
        border-color: #10b981;
      }

      &.incorrect {
        border-color: #ef4444;
      }

      .quiz-label {
        font-size: 0.88rem;
        font-weight: 600;
        min-height: 42px;
      }

      .quiz-choices {
        display: flex;
        gap: 8px;

        .choice-btn {
          flex: 1;
          padding: 6px 8px;
          font-size: 0.78rem;
          font-weight: 600;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-muted);
          border-radius: 6px;
          cursor: pointer;

          &.selected {
            background: #3b82f6;
            color: #ffffff;
            border-color: #60a5fa;
          }
        }
      }

      .quiz-feedback {
        font-size: 0.78rem;
        border-top: 1px solid var(--border-color);
        padding-top: 8px;

        .quiz-exp {
          font-size: 0.72rem;
          color: var(--text-dim);
          margin-top: 4px;
        }
      }
    }

    .btn-danger {
      background: #dc2626;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }

    .btn-success {
      background: #059669;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 0.75rem;
    }

    .w-full {
      width: 100%;
    }

    .sim-controls {
      display: flex;
      gap: 8px;
    }
  `]
})
export class EventLoopClockComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly activeSubTab = signal<'event-loop' | 'restaurant' | 'arbitrage'>('event-loop');

  readonly currentStepIndex = signal<number>(0);
  readonly steps: LoopStep[] = [
    {
      id: 1,
      description: 'Appel de httpResource() / fetch() synchrone',
      callStack: ['httpResource("https://api.fake.com/articles")', 'main()'],
      webApis: [],
      taskQueue: [],
      eventLoopActive: false,
      explanation: 'Le script exécute la déclaration. L\'appel est empilé sur la Call Stack. Il demande au navigateur d\'initier la requête réseau.'
    },
    {
      id: 2,
      description: 'Délégation aux Web APIs du navigateur',
      callStack: ['main()'],
      webApis: ['fetch(https://api.fake.com/articles) [Latence 300ms]'],
      taskQueue: [],
      eventLoopActive: false,
      explanation: 'Le navigateur prend le relais sur un thread système dédié au réseau. La fonction réseau sort immédiatement de la Call Stack !'
    },
    {
      id: 3,
      description: 'La Call Stack continue et se vide',
      callStack: [],
      webApis: ['fetch(https://api.fake.com/articles) [En transit...]'],
      taskQueue: [],
      eventLoopActive: false,
      explanation: 'La Call Stack est maintenant libre. Le navigateur peut continuer à traiter les clics, animations et le rendu à 60 FPS.'
    },
    {
      id: 4,
      description: 'Le paquet réseau arrive dans la Task Queue',
      callStack: [],
      webApis: [],
      taskQueue: ['callback(data) -> updateSignal(value)'],
      eventLoopActive: true,
      explanation: 'Le serveur a répondu. Le navigateur dépose la fonction de rappel dans la file des tâches. L\'Event Loop vérifie si la Call Stack est vide.'
    },
    {
      id: 5,
      description: 'L\'Event Loop injecte la tâche dans la Stack',
      callStack: ['updateSignal(data) -> renderView()'],
      webApis: [],
      taskQueue: [],
      eventLoopActive: false,
      explanation: 'La Call Stack étant libre, l\'Event Loop y transfère la mise à jour des signaux. Le template Angular se rafraîchit avec les nouvelles données !'
    }
  ];

  readonly currentStep = () => this.steps[this.currentStepIndex()];

  nextStep(): void {
    if (this.currentStepIndex() < this.steps.length - 1) {
      this.currentStepIndex.update(i => i + 1);
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(i => i - 1);
    }
  }

  resetSimulation(): void {
    this.currentStepIndex.set(0);
  }

  // Restaurant
  readonly isSyncFrozen = signal(false);
  readonly asyncClicks = signal(0);
  readonly buzzerActive = signal(false);

  simulateSyncFreeze(): void {
    this.isSyncFrozen.set(true);
    setTimeout(() => {
      this.isSyncFrozen.set(false);
    }, 2500);
  }

  simulateAsyncBuzzer(): void {
    this.buzzerActive.set(false);
    setTimeout(() => {
      this.buzzerActive.set(true);
    }, 1800);
  }

  incrementAsyncClicks(): void {
    this.asyncClicks.update(n => n + 1);
  }

  // Quiz
  readonly quizItems: QuizItem[] = [
    {
      id: 'q1',
      label: 'Calculer le prix total TTC d\'un panier d\'articles en RAM',
      category: 'sync',
      explanation: 'Opération purement arithmétique en mémoire vive locale (< 1 microseconde).'
    },
    {
      id: 'q2',
      label: 'Interroger une API REST via httpResource()',
      category: 'async',
      explanation: 'Franchissement de frontière physique réseau (latence 50ms à plusieurs secondes).'
    },
    {
      id: 'q3',
      label: 'Instancier une classe avec new Recipe(...)',
      category: 'sync',
      explanation: 'Allocation d\'objet sur le tas (Heap) de la RAM locale.'
    },
    {
      id: 'q4',
      label: 'Lire des enregistrements stockés dans IndexedDB',
      category: 'async',
      explanation: 'Accès au disque dur / stockage physique persistant du terminal.'
    },
    {
      id: 'q5',
      label: 'Accesseur encapsulé get tempsTotalMinutes()',
      category: 'sync',
      explanation: 'Getter synchrone calculant une propriété dérivée instantanément.'
    },
    {
      id: 'q6',
      label: 'Temporisateur setTimeout(..., 1000)',
      category: 'async',
      explanation: 'Délégation au timer des Web APIs du navigateur.'
    }
  ];

  selectQuizCategory(item: QuizItem, category: 'sync' | 'async'): void {
    item.selectedCategory = category;
  }

  getQuizScore(): number {
    return this.quizItems.filter(i => i.selectedCategory === i.category).length;
  }

  jumpToLab(): void {
    this.exerciseService.setFilterLab(1);
    this.nav.setTab('workshops-lab');
  }
}
