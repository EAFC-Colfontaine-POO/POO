import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapStep } from '../../core/models/app.models';

@Component({
  selector: 'app-bootstrap-flow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Flux d'Exécution — Cycle de Vie du Démarrage</div>
        <h2>3. Simulateur de Démarrage (Bootstrap Flow)</h2>
        <p class="module-desc">
          Comment une application Angular prend-elle vie dans le navigateur ?
          Suivez séquentiellement les 4 étapes fondamentales : depuis la requête HTTP initiale du squelette <code>index.html</code> 
          jusqu'au remplacement dynamique de la balise <code>&lt;app-root&gt;</code> par l'arbre de composants.
        </p>
      </div>

      <!-- Barre de progression du Stepper -->
      <div class="stepper-bar-card card-panel">
        <div class="stepper-nav-row">
          <div class="stepper-tabs">
            @for (s of steps; track s.step) {
              <button 
                class="step-tab-btn" 
                [class.active]="currentStep() === s.step"
                [class.passed]="currentStep() > s.step"
                (click)="goToStep(s.step)"
              >
                <span class="step-num">{{ currentStep() > s.step ? '✓' : s.step }}</span>
                <span class="step-title">{{ s.title }}</span>
              </button>
            }
          </div>

          <div class="stepper-controls">
            <button class="btn-secondary btn-sm" (click)="prevStep()" [disabled]="currentStep() === 1">
              ◀ Précédent
            </button>
            <button class="btn-primary btn-sm" (click)="nextStep()" [disabled]="currentStep() === 4">
              Suivant ▶
            </button>
            <button class="btn-secondary btn-sm" (click)="toggleAutoPlay()">
              {{ isAutoPlaying() ? '⏸ Pause' : '▶ Lecture Auto' }}
            </button>
            <button class="btn-secondary btn-sm" (click)="restart()">
              ↺ Rejouer
            </button>
          </div>
        </div>

        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="(currentStep() / 4) * 100"></div>
        </div>
      </div>

      <!-- Contenu de l'étape active -->
      <div class="step-details-grid">
        <!-- Fiche explicative & Code exécuté -->
        <div class="card-panel step-info-panel">
          <div class="step-badge-row">
            <span class="badge badge-ts">{{ activeStepData().phaseLabel }}</span>
            <span class="badge badge-warning">Étape {{ activeStepData().step }} / 4</span>
            <span class="file-ref-badge">Fichier : <code>{{ activeStepData().activeFile }}</code></span>
          </div>

          <h3 class="step-headline">{{ activeStepData().title }}</h3>
          <p class="step-explanation">{{ activeStepData().description }}</p>

          <div class="tech-highlight-box">
            <div class="th-title">⚙️ Ce qui se passe en coulisses :</div>
            <p>{{ activeStepData().technicalDetails }}</p>
          </div>

          <!-- Code source actif lors de cette étape -->
          <div class="code-execution-box">
            <div class="box-bar">
              <span>Code source exécuté à cette étape (<code>{{ activeStepData().activeFile }}</code>)</span>
            </div>
            <pre class="code-block"><code>{{ activeStepData().executedCode }}</code></pre>
          </div>
        </div>

        <!-- Inspecteur du DOM en direct -->
        <div class="card-panel dom-inspector-panel">
          <div class="dom-inspector-header">
            <div class="dom-title">
              <span class="pulse-dot"></span>
              <span>Inspecteur du DOM Navigateur (Synchronisé en direct)</span>
            </div>
            <span class="dom-status-badge">État : Étape {{ currentStep() }}</span>
          </div>

          <div class="dom-representation">
            <pre class="dom-tree"><code>{{ activeStepData().htmlDomState }}</code></pre>
          </div>

          <div class="dom-footer-notes">
            @switch (currentStep()) {
              @case (1) {
                <div class="note-box note-warning">
                  <strong>Point clé :</strong> La balise <code>&lt;app-root&gt;</code> est vide à ce stade. Si le JavaScript est désactivé ou échoue, l'écran reste blanc.
                </div>
              }
              @case (2) {
                <div class="note-box note-info">
                  <strong>Point clé :</strong> Le compilateur TypeScript a transformé vos fichiers en JavaScript moderne (ES2022+), chargé sous forme de module ES6.
                </div>
              }
              @case (3) {
                <div class="note-box note-info">
                  <strong>Point clé :</strong> <code>bootstrapApplication()</code> crée le conteneur d'injection de dépendances (DI) et initialise les routes globales sans avoir recours à un NgModule.
                </div>
              }
              @case (4) {
                <div class="note-box note-success">
                  <strong>Point clé :</strong> Angular a instancié le composant racine et a injecté son template dans <code>&lt;app-root&gt;</code>. L'application est maintenant interactive !
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stepper-bar-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 14px 20px;
    }

    .stepper-nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .stepper-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .step-tab-btn {
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

      .step-num {
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

        .step-num {
          background: #dd0031;
          color: #ffffff;
        }
      }

      &.passed {
        .step-num {
          background: #10b981;
          color: #ffffff;
        }
      }
    }

    .stepper-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.78rem;
    }

    .progress-track {
      height: 4px;
      background: var(--bg-subtle);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #dd0031, #f43f5e, #10b981);
      transition: width 0.3s ease;
    }

    .step-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      min-height: 520px;
    }

    .step-info-panel, .dom-inspector-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .step-badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .file-ref-badge {
      font-size: 0.75rem;
      color: var(--text-dim);
      code {
        color: #38bdf8;
      }
    }

    .step-headline {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .step-explanation {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .tech-highlight-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;

      .th-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 4px;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin: 0;
        line-height: 1.45;
      }
    }

    .code-execution-box {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .box-bar {
        padding: 6px 12px;
        background: var(--terminal-header, #121826);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.74rem;
        color: var(--text-muted);
      }

      .code-block {
        padding: 12px;
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: #e2e8f0;
        line-height: 1.45;
        overflow-x: auto;
      }
    }

    .dom-inspector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;

      .dom-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .dom-status-badge {
        font-size: 0.72rem;
        color: #10b981;
        font-weight: 600;
      }
    }

    .dom-representation {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;
      flex: 1;

      .dom-tree {
        padding: 14px;
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: #a5f3fc;
        line-height: 1.5;
        overflow-x: auto;
        white-space: pre;
      }
    }

    .dom-footer-notes {
      .note-box {
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 0.82rem;
        line-height: 1.4;

        &.note-warning {
          background: rgba(245, 158, 11, 0.1);
          border-left: 3px solid #f59e0b;
          color: var(--text-main);
        }

        &.note-info {
          background: rgba(49, 120, 198, 0.1);
          border-left: 3px solid #3178c6;
          color: var(--text-main);
        }

        &.note-success {
          background: rgba(16, 185, 129, 0.1);
          border-left: 3px solid #10b981;
          color: var(--text-main);
        }
      }
    }
  `]
})
export class BootstrapFlowComponent implements OnDestroy {
  readonly currentStep = signal<number>(1);
  readonly isAutoPlaying = signal<boolean>(false);
  private autoPlayTimer: any = null;

  readonly steps: BootstrapStep[] = [
    {
      step: 1,
      title: 'Réception du Squelette HTML',
      phaseLabel: 'Étape 1 : Requête HTTP initiale',
      badgeColor: '#ea580c',
      activeFile: 'src/index.html',
      description: 'Le navigateur émet une requête HTTP GET vers le serveur web et télécharge le fichier index.html. Ce fichier est minimaliste : il ne contient aucun élément d\'interface en dehors de la balise hôte personnalisée <app-root></app-root>.',
      technicalDetails: 'Le serveur web renvoie un code HTTP 200 avec le document HTML. Le parser HTML du navigateur commence à construire le DOM standard et rencontre la balise inconnue <app-root>, qu\'il traite comme un élément HTML personnalisé vide.',
      executedCode: `<!-- Document téléchargé depuis le serveur web -->
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Application Angular</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <!-- Point d'ancrage vide : en attente de l'exécution du JS -->
  <app-root></app-root>
</body>
</html>`,
      htmlDomState: `▼ <html>
  ▼ <head>
      <title>Application Angular</title>
      <base href="/">
    </head>
  ▼ <body>
    ► <app-root></app-root>  <!-- ⚠️ VIDE : Aucun composant instancié -->
    </body>
  </html>`
    },
    {
      step: 2,
      title: 'Chargement & Exécution du Script',
      phaseLabel: 'Étape 2 : Chargement du Bundle',
      badgeColor: '#eab308',
      activeFile: 'src/main.ts',
      description: 'Le navigateur télécharge et analyse les bundles JavaScript générés lors de la compilation. Le moteur JS (V8 sur Chrome) entreprend l\'exécution du point d\'entrée main.ts.',
      technicalDetails: 'Les scripts sont injectés automatiquement par le bundler (Vite/esbuild). Le moteur JavaScript lit les imports, résout les dépendances du framework Angular et prépare l\'instanciation du runtime.',
      executedCode: `// Point d'entrée de l'application
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Lancement imminent de l'amorce...
console.log('Amorçage de l\\'application Angular...');`,
      htmlDomState: `▼ <html>
  ▼ <head> ... </head>
  ▼ <body>
      <app-root></app-root>
      <!-- Script bundlé en cours d'évaluation par le moteur JS -->
      <script type="module" src="/main.js"></script>
    </body>
  </html>`
    },
    {
      step: 3,
      title: 'Amorçage de bootstrapApplication()',
      phaseLabel: 'Étape 3 : Instanciation & Injection',
      badgeColor: '#3b82f6',
      activeFile: 'src/app/app.config.ts & main.ts',
      description: 'La fonction bootstrapApplication(AppComponent, appConfig) est appelée. Angular configure son moteur d\'injection de dépendances (DI), enregistre les providers globaux et prépare le composant racine.',
      technicalDetails: 'Angular instancie l\'ApplicationRef et l\'EnvironmentInjector avec les configurations spécifiées dans app.config.ts (ex. routes avec provideRouter(), client HTTP). Aucun NgModule n\'est nécessaire.',
      executedCode: `// main.ts
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Erreur au démarrage :', err));

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};`,
      htmlDomState: `▼ <html>
  ▼ <head> ... </head>
  ▼ <body>
    ▼ <app-root>
        <!-- Injection des Services Globaux & Router Providers... -->
        <!-- Compilation du template AppComponent en cours... -->
      </app-root>
    </body>
  </html>`
    },
    {
      step: 4,
      title: 'Hydratation & Rendu du Composant Racine',
      phaseLabel: 'Étape 4 : Rendu dans le DOM',
      badgeColor: '#10b981',
      activeFile: 'src/app/app.component.html & .ts',
      description: 'Angular recherche dans le DOM la balise correspondant au sélecteur selector: "app-root". Il instancie la classe AppComponent et peuple l\'intérieur de <app-root> avec le HTML compilé et les écouteurs d\'événements réactifs.',
      technicalDetails: 'Le DOM est mis à jour chirurgicalement. Les attributs d\'encapsulation des styles (_ngcontent-ng-c...) sont appliqués. Les liaisons de données ({{ }}, [disabled], (click)) deviennent actives et réactives aux interactions de l\'utilisateur.',
      executedCode: `@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: \`
    <div class="card">
      <h1>Cours de {{ courseName }}</h1>
      <button (click)="toggleStatus()">Changer le statut</button>
    </div>
  \`
})
export class AppComponent {
  courseName = 'Programmation Orientée Objet';
  toggleStatus() { /* réactif */ }
}`,
      htmlDomState: `▼ <html>
  ▼ <head>
      <!-- Styles injectés avec scopage de composant -->
      <style>p[_ngcontent-ng-c123] { color: purple; }</style>
    </head>
  ▼ <body>
    ▼ <app-root _nghost-ng-c123 ng-version="22.1.0">
      ▼ <div _ngcontent-ng-c123 class="card">
          <h1 _ngcontent-ng-c123>Cours de Programmation Orientée Objet</h1>
          <p _ngcontent-ng-c123>Statut : En direct</p>
          <button _ngcontent-ng-c123>Changer le statut</button>
        </div>
      </app-root>
    </body>
  </html>`
    }
  ];

  activeStepData(): BootstrapStep {
    return this.steps[this.currentStep() - 1];
  }

  goToStep(step: number): void {
    this.currentStep.set(step);
  }

  nextStep(): void {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  restart(): void {
    this.currentStep.set(1);
  }

  toggleAutoPlay(): void {
    if (this.isAutoPlaying()) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  private startAutoPlay(): void {
    this.isAutoPlaying.set(true);
    this.autoPlayTimer = setInterval(() => {
      if (this.currentStep() < 4) {
        this.nextStep();
      } else {
        this.currentStep.set(1);
      }
    }, 2800);
  }

  private stopAutoPlay(): void {
    this.isAutoPlaying.set(false);
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }
}
