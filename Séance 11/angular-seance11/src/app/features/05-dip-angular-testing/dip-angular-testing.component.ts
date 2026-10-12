import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-dip-angular-testing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 11 · DI &amp; Tests</span>
          <span class="badge badge-indigo">Angular Dependency Injection</span>
          <span class="badge badge-success">Tests en RAM (2 ms)</span>
        </div>
        <h2>DIP dans Angular &amp; Banc de Test Unitaire Ultra-Rapide</h2>
        <p class="module-desc">
          Le principe d'inversion des dépendances révolutionne la testabilité logicielle.
          En substituant une base de données lourde par un <strong>Fake Repository en mémoire</strong>, vos tests unitaires
          s'exécutent en quelques millisecondes, sans réseau et avec une isolation chirurgicale des bugs métier.
        </p>
      </div>

      <!-- SIMULATEUR 1 : LE CHRONOMÈTRE DU TEST UNITAIRE EN RAM (2 ms vs 450 ms) -->
      <div class="card-panel demo-card">
        <div class="card-title-row">
          <span class="badge badge-emerald">Banc d'Essai Live</span>
          <h3>Laboratoire de Test Unitaire : BDD Réseau vs Fake Repository en RAM</h3>
        </div>
        <p class="section-intro">
          Lancez les deux scénarios de test pour mesurer l'impact de l'inversion de dépendance sur la vélocité et la fiabilité :
        </p>

        <div class="benchmark-grid mt-2">
          <!-- Test BDD Réelle -->
          <div class="bench-col bdd-col" [class.running]="isTestingBdd()">
            <div class="col-head">
              <span class="badge badge-rose">❌ Couplage Bas Niveau</span>
              <h4>Test avec Vraie Base PostgreSQL</h4>
            </div>
            <p class="bench-desc">
              Démarre un conteneur Docker, établit le socket TCP réseau, initialise la table SQL, exécute l'INSERT et referme la session.
            </p>

            <div class="timer-display" [class.finished]="bddTime() !== null">
              @if (isTestingBdd()) {
                <span class="pulse-text">Connexion socket &amp; I/O disque en cours...</span>
              } @else if (bddTime() !== null) {
                <span class="time-val text-danger">{{ bddTime() }} ms</span>
                <span class="time-sub">⚠️ Très lent &amp; risque de timeout réseau</span>
              } @else {
                <span class="time-idle">Prêt à tester</span>
              }
            </div>

            <button class="btn-secondary btn-sm" (click)="lancerTestBdd()" [disabled]="isTestingBdd() || isTestingRam()">
              🐢 Exécuter le Test BDD Réseau
            </button>
          </div>

          <!-- Test Fake Repo RAM -->
          <div class="bench-col ram-col" [class.running]="isTestingRam()">
            <div class="col-head">
              <span class="badge badge-emerald">✅ Découplage DIP Parfait</span>
              <h4>Test avec Fake Repository en RAM</h4>
            </div>
            <p class="bench-desc">
              Utilise <code>InMemoryCommandeRepository</code> avec un simple tableau JavaScript privé. Zéro I/O disque, zéro socket, zéro Docker.
            </p>

            <div class="timer-display" [class.finished]="ramTime() !== null">
              @if (isTestingRam()) {
                <span class="pulse-text">Calcul en mémoire vive...</span>
              } @else if (ramTime() !== null) {
                <span class="time-val text-success">{{ ramTime() }} ms</span>
                <span class="time-sub">⚡ 225x plus rapide · 100% Déterministe</span>
              } @else {
                <span class="time-idle">Prêt à tester</span>
              }
            </div>

            <button class="btn-primary btn-sm" (click)="lancerTestRam()" [disabled]="isTestingBdd() || isTestingRam()">
              ⚡ Exécuter le Test en RAM (DIP)
            </button>
          </div>
        </div>

        @if (bddTime() !== null && ramTime() !== null) {
          <div class="comparison-summary-banner mt-3">
            🎯 <strong>Verdict de l'Architecte :</strong> En injectant une abstraction, une suite de <strong>1 000 tests unitaires</strong>
            met seulement <strong>2 secondes</strong> à s'exécuter en RAM contre plus de <strong>7 minutes</strong> avec une base de données réelle !
          </div>
        }
      </div>

      <!-- SIMULATEUR 2 : VISUALISEUR DU MOTEUR D'INJECTION ANGULAR (DI) -->
      <div class="card-panel">
        <div class="card-title-row">
          <span class="badge badge-indigo">Écosystème Angular</span>
          <h3>Le Conteneur d'Injection de Dépendances (DI) d'Angular</h3>
        </div>
        <p class="section-intro">
          Angular intègre nativement un moteur hiérarchique d'inversion de dépendance. Découvrez les 3 éléments clés :
        </p>

        <div class="angular-di-grid mt-3">
          <!-- 1. Injectable -->
          <div class="di-card">
            <div class="di-number">01</div>
            <h4>L'Enregistrement : &#64;Injectable</h4>
            <p class="di-text">
              Déclare la classe comme service instanciable par le conteneur IoC d'Angular.
            </p>
            <pre class="di-code"><code>&#64;Injectable(&#123;
  providedIn: 'root' // Singleton applicatif
&#125;)
export class CommandeService &#123; ... &#125;</code></pre>
            <span class="di-tip">L'arbre racine gère le cycle de vie automatiquement.</span>
          </div>

          <!-- 2. inject() -->
          <div class="di-card">
            <div class="di-number">02</div>
            <h4>La Résolution : inject()</h4>
            <p class="di-text">
              La fonction moderne d'Angular remplace avantageusement l'injection par constructeur verbose.
            </p>
            <pre class="di-code"><code>export class PanierComponent &#123;
  // Résolution propre &amp; typée
  private readonly commandeService =
    inject(CommandeService);
&#125;</code></pre>
            <span class="di-tip">Fonctionne dans les composants, directives et guards.</span>
          </div>

          <!-- 3. Providers de Test -->
          <div class="di-card">
            <div class="di-number">03</div>
            <h4>La Substitution : useValue</h4>
            <p class="di-text">
              Dans TestBed, substituez les services réels par des mocks instantanés sans toucher au composant.
            </p>
            <pre class="di-code"><code>TestBed.configureTestingModule(&#123;
  providers: [&#123;
    provide: CommandeService,
    useValue: fakeServiceEnRam
  &#125;]
&#125;);</code></pre>
            <span class="di-tip">Garantit des tests unitaires isolés et sans réseau.</span>
          </div>
        </div>
      </div>

      <!-- PASSERELLE VERS L'ATELIER MONACO : DÉFI 3.4 -->
      <div class="card-panel atelier-cta-card mt-3">
        <div class="cta-content">
          <div class="cta-icon">💻</div>
          <div class="cta-text">
            <h3>Passez à la Pratique : Atelier Monaco Défi 3.4</h3>
            <p>Appliquez concrètement la substitution de clients HTTP par un Mock en mémoire dans l'exercice 3.4.</p>
          </div>
        </div>
        <button class="btn-primary btn-cta" (click)="goToExercise34()">
          Ouvrir l'Atelier Défi 3.4 ➔
        </button>
      </div>
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

    .benchmark-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .bench-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.bdd-col { border-left: 4px solid #f43f5e; }
      &.ram-col { border-left: 4px solid #10b981; }

      .col-head {
        display: flex;
        flex-direction: column;
        gap: 4px;

        h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }
      }

      .bench-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.45;
      }

      .timer-display {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 16px;
        text-align: center;
        min-height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .time-idle {
          font-size: 0.85rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        .pulse-text {
          font-size: 0.82rem;
          color: #818cf8;
          animation: pulse 1s infinite;
        }

        .time-val {
          font-size: 2rem;
          font-weight: 900;
          font-family: var(--font-mono);

          &.text-danger { color: #f43f5e; }
          &.text-success { color: #10b981; }
        }

        .time-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
      }
    }

    .comparison-summary-banner {
      padding: 14px 18px;
      border-radius: 8px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid #6366f1;
      font-size: 0.85rem;
      line-height: 1.5;
      color: #e0e7ff;
    }

    .angular-di-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .di-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .di-number {
        font-size: 1.2rem;
        font-weight: 900;
        font-family: var(--font-mono);
        color: #818cf8;
      }

      h4 {
        font-size: 0.92rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .di-text {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .di-code {
        background: var(--bg-code);
        padding: 10px;
        border-radius: 6px;
        font-size: 0.74rem;
        color: var(--text-code);
        line-height: 1.4;
        margin: 4px 0;
      }

      .di-tip {
        font-size: 0.72rem;
        color: #34d399;
        font-weight: 600;
      }
    }

    .atelier-cta-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08));
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 8px;
      padding: 16px 20px;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .cta-content {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .cta-icon {
      font-size: 1.8rem;
    }

    .cta-text {
      h3 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 2px;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
      }
    }

    .btn-cta {
      padding: 8px 16px;
      font-size: 0.84rem;
      white-space: nowrap;
    }
  `]
})
export class DipAngularTestingComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly isTestingBdd = signal<boolean>(false);
  readonly isTestingRam = signal<boolean>(false);
  readonly bddTime = signal<number | null>(null);
  readonly ramTime = signal<number | null>(null);

  goToExercise34(): void {
    this.exercises.selectExercise('ex-3-4');
    this.nav.setTab('workshops-lab');
  }

  lancerTestBdd(): void {
    this.isTestingBdd.set(true);
    this.bddTime.set(null);

    setTimeout(() => {
      this.isTestingBdd.set(false);
      this.bddTime.set(452); // ~452 ms
    }, 600);
  }

  lancerTestRam(): void {
    this.isTestingRam.set(true);
    this.ramTime.set(null);

    setTimeout(() => {
      this.isTestingRam.set(false);
      this.ramTime.set(2); // 2 ms
    }, 80);
  }
}
