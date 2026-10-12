import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-dip-dependency-inversion',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 11 · Pilier 3</span>
          <span class="badge badge-purple">D : Dependency Inversion</span>
          <span class="badge badge-indigo">Uncle Bob's Laws</span>
        </div>
        <h2>'D' — Dependency Inversion Principle (DIP)</h2>
        <p class="module-desc">
          <em>« Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. Tous deux doivent dépendre d'abstractions. »</em>
          Bannissez l'instanciation technique en dur (<code>new</code>) dans votre cœur de métier.
        </p>

        <!-- Bascule Théorie & Simulateurs vs Atelier Pratique -->
        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'interactive'"
            (click)="activeMode.set('interactive')"
          >
            🔬 Simulateurs DIP &amp; Prise 230V
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            💻 Atelier Monaco (Labo 3 · 4 Exercices)
          </button>
        </div>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- SIMULATEUR 1 : L'ANALOGIE ÉLECTRIQUE DE LA PRISE 230V -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-purple">Analogie Visuelle #1</span>
            <h3>L'Analogie de la Prise Murale 230V</h3>
          </div>
          <p class="section-intro">
            Imaginez souder les fils de votre lampe de chevet directement aux câbles en cuivre du mur.
            Si la lampe grille, vous devez casser le plâtre pour la changer ! Comparez avec une prise 230V standardisée :
          </p>

          <div class="mode-switch-row mt-2">
            <button 
              class="choice-btn" 
              [class.active]="socketMode() === 'welded'"
              (click)="socketMode.set('welded')"
            >
              🔥 Soudure Directe (new LampeHalogene)
            </button>
            <button 
              class="choice-btn" 
              [class.active]="socketMode() === 'standard'"
              (click)="socketMode.set('standard')"
            >
              🔌 Prise Murale Standard 230V (interface)
            </button>
          </div>

          <div class="electric-sim-box mt-3">
            @if (socketMode() === 'welded') {
              <!-- SOUDURE DIRECTE -->
              <div class="welded-view">
                <div class="circuit-element wall-box danger-border">
                  <div class="elem-tag">Mur / Réseau Électrique</div>
                  <div class="elem-name">Maison 230V</div>
                </div>

                <div class="weld-connection">
                  <span class="spark">⚡</span>
                  <div class="wire red-wire"></div>
                  <span class="weld-label">SOUDURE FERMÉE (new LampeHalogene())</span>
                  <div class="wire red-wire"></div>
                </div>

                <div class="circuit-element device-box danger-border">
                  <div class="elem-tag">Détail Concret</div>
                  <div class="elem-name">LampeHalogene</div>
                  <span class="elem-status">Indissociable du mur !</span>
                </div>
              </div>

              <div class="electrical-verdict danger mt-2">
                ❌ <strong>Couplage Mortel :</strong> Pour changer de lampe ou tester le réseau, il faut couper le courant général et dessouder physiquement les composants. C'est exactement ce que produit <code>new Service()</code> dans votre code métier !
              </div>
            } @else {
              <!-- PRISE MURALE STANDARDISÉE -->
              <div class="standard-view">
                <div class="circuit-element wall-box success-border">
                  <div class="elem-tag">Haut Niveau (Consommateur)</div>
                  <div class="elem-name">Appareil Electrique</div>
                </div>

                <div class="socket-connection">
                  <div class="plug-graphic">🔌</div>
                  <div class="interface-pill">
                    <span class="int-title">Contrat Standardisé</span>
                    <code>interface Prise230V &#123; fournirCourant(): void &#125;</code>
                  </div>
                  <div class="socket-graphic">🔲</div>
                </div>

                <div class="circuit-element device-box success-border">
                  <div class="elem-tag">Bas Niveau (Interchangeable)</div>
                  <div class="elem-name">{{ activePlugDevice() }}</div>
                  <div class="device-switcher mt-1">
                    <button class="plug-chip" [class.active]="activePlugDevice() === 'LampeLED'" (click)="activePlugDevice.set('LampeLED')">Lampe LED</button>
                    <button class="plug-chip" [class.active]="activePlugDevice() === 'ChargeurMac'" (click)="activePlugDevice.set('ChargeurMac')">Chargeur Mac</button>
                    <button class="plug-chip" [class.active]="activePlugDevice() === 'Aspirateur'" (click)="activePlugDevice.set('Aspirateur')">Aspirateur</button>
                  </div>
                </div>
              </div>

              <div class="electrical-verdict success mt-2">
                ✅ <strong>Inversion Totale :</strong> La prise murale n'a aucune idée de ce qui est branché dessus. Elle ne connaît que son contrat d'interface. Vous pouvez brancher un aspirateur, une lampe ou un faux appareil de test (mock) sans altérer le mur !
              </div>
            }
          </div>
        </div>

        <!-- SIMULATEUR 2 : DÉMYSTIFICATEUR DES 2 LOIS DE ROBERT C. MARTIN -->
        <div class="card-panel">
          <div class="card-title-row">
            <span class="badge badge-indigo">Les Fondements</span>
            <h3>Démystificateur des 2 Lois du DIP</h3>
          </div>
          <p class="section-intro">
            Comprenez la révolution copernicienne de l'inversion de la flèche de dépendance :
          </p>

          <div class="laws-grid mt-3">
            <!-- Loi 1 -->
            <div class="law-card">
              <div class="law-num">Loi #1</div>
              <h4>Haut Niveau vs Bas Niveau</h4>
              <p class="law-def">
                « Les modules de haut niveau (règles métier précieuses) ne doivent pas dépendre des modules de bas niveau (BDD, HTTP, système de fichiers).
                Tous deux doivent dépendre d'abstractions. »
              </p>
              <div class="law-schema">
                <div class="schema-box high">Haut Niveau : <code>GestionCommandes</code></div>
                <div class="schema-arrow">▼ dépend de</div>
                <div class="schema-box contract">Abstraction : <code>interface CommandeRepository</code></div>
                <div class="schema-arrow">▲ implémente</div>
                <div class="schema-box low">Bas Niveau : <code>PostgreSqlRepository</code></div>
              </div>
            </div>

            <!-- Loi 2 -->
            <div class="law-card">
              <div class="law-num">Loi #2</div>
              <h4>Abstractions vs Détails</h4>
              <p class="law-def">
                « Les abstractions ne doivent pas dépendre des détails. Ce sont les détails techniques qui doivent se conformer aux abstractions. »
              </p>
              <div class="law-schema">
                <div class="bad-vs-good">
                  <div class="bvg-item text-danger">
                    <strong>❌ Dépendance corrompue :</strong>
                    <code>interface Repo &#123; executerRequeteSql(sql: string) &#125;</code>
                    <p class="sub">L'abstraction laisse fuiter un détail technique (SQL).</p>
                  </div>
                  <div class="bvg-item text-success">
                    <strong>✅ Abstraction pure orientée métier :</strong>
                    <code>interface Repo &#123; trouverParId(id: string): Commande &#125;</code>
                    <p class="sub">Zéro fuite d'infrastructure technique.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SIMULATEUR 3 : LE PROBLÈME DU NEW EN DUR -->
        <div class="card-panel">
          <div class="card-title-row">
            <span class="badge badge-rose">Code Smell #1</span>
            <h3>Le Problème du "new" en Dur dans le Domaine</h3>
          </div>
          <p class="section-intro">
            Chaque <code>new BaseDeDonnees()</code> rédigé au cœur d'un service métier est une trahison de l'architecture propre :
          </p>

          <div class="new-comparison-grid mt-3">
            <div class="code-column anti-code">
              <div class="col-title text-danger">❌ Couplage Dur : new BaseDeDonneesSQL()</div>
              <pre><code>export class ServiceCommande &#123;
  // ❌ SOUDURE TECHNIQUE EN DUR :
  private bdd = new BaseDeDonneesSQL('postgres://...');

  valider(cmd: Commande) &#123;
    // Logique métier
    this.bdd.insert(cmd); // Bloque les tests unitaires !
  &#125;
&#125;</code></pre>
              <p class="impact-text text-danger">
                Conséquence : Vous ne pouvez pas tester <code>valider()</code> sans installer un serveur PostgreSQL local et une connexion réseau active.
              </p>
            </div>

            <div class="code-column clean-code">
              <div class="col-title text-success">✅ Inversion DIP : Injection d'Interface</div>
              <pre><code>export class ServiceCommande &#123;
  // ✅ DÉPENDANCE D'UNE ABSTRACTION :
  constructor(private repo: CommandeRepository) &#123;&#125;

  valider(cmd: Commande) &#123;
    // Logique métier pure
    this.repo.sauvegarder(cmd); // Délégué au contrat
  &#125;
&#125;</code></pre>
              <p class="impact-text text-success">
                Conséquence : En production, on injecte <code>PostgresRepository</code>. En test, on injecte <code>InMemoryRepository</code> qui s'exécute en 2 ms !
              </p>
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO : LABO 3 (4 EXERCICES) -->
        <app-lab-runner [filterLabNumber]="3"></app-lab-runner>
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

    .mode-switch-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .choice-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.84rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: rgba(139, 92, 246, 0.2);
        color: #c084fc;
        border-color: #8b5cf6;
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.25);
      }
    }

    .electric-sim-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
    }

    .welded-view, .standard-view {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 16px;

      @media (max-width: 800px) {
        flex-direction: column;
      }
    }

    .circuit-element {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      min-width: 180px;

      &.danger-border {
        border: 2px solid #f43f5e;
      }

      &.success-border {
        border: 2px solid #10b981;
      }

      .elem-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .elem-name {
        font-size: 1rem;
        font-weight: 800;
        color: var(--text-main);
        margin: 4px 0;
      }

      .elem-status {
        font-size: 0.74rem;
        color: #fca5a5;
      }
    }

    .weld-connection {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;

      .spark {
        font-size: 1.5rem;
        animation: pulse-glow 1s infinite alternate;
      }

      .wire {
        width: 120px;
        height: 4px;
        background: #f43f5e;
        border-radius: 2px;
      }

      .weld-label {
        font-size: 0.72rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: #fb7185;
      }
    }

    .socket-connection {
      display: flex;
      align-items: center;
      gap: 10px;

      .plug-graphic, .socket-graphic {
        font-size: 1.6rem;
      }

      .interface-pill {
        background: var(--bg-card);
        border: 1px solid #10b981;
        padding: 8px 12px;
        border-radius: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .int-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: #34d399;
          text-transform: uppercase;
        }

        code {
          font-size: 0.75rem;
          color: #93c5fd;
        }
      }
    }

    .device-switcher {
      display: flex;
      gap: 4px;
      justify-content: center;
    }

    .plug-chip {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &.active {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border-color: #10b981;
      }
    }

    .electrical-verdict {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.84rem;
      line-height: 1.5;

      &.danger {
        background: rgba(244, 63, 94, 0.12);
        border: 1px solid rgba(244, 63, 94, 0.3);
        color: #fecdd3;
      }

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #a7f3d0;
      }
    }

    .laws-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .law-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .law-num {
        font-size: 0.72rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: #818cf8;
        text-transform: uppercase;
      }

      h4 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .law-def {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
        font-style: italic;
      }
    }

    .law-schema {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      background: var(--bg-card);
      padding: 12px;
      border-radius: 6px;

      .schema-box {
        width: 100%;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 0.76rem;
        text-align: center;
        border: 1px solid var(--border-color);

        &.high { background: rgba(59, 130, 246, 0.15); border-color: #3b82f6; }
        &.contract { background: rgba(16, 185, 129, 0.15); border-color: #10b981; font-weight: 700; }
        &.low { background: rgba(139, 92, 246, 0.15); border-color: #8b5cf6; }
      }

      .schema-arrow {
        font-size: 0.7rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
    }

    .bad-vs-good {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 0.8rem;

      .bvg-item {
        background: var(--bg-card);
        padding: 10px;
        border-radius: 6px;
        border: 1px solid var(--border-color);

        code {
          display: block;
          margin: 4px 0;
          font-size: 0.76rem;
        }

        .sub {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
      }
    }

    .new-comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .code-column {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .col-title {
        font-size: 0.88rem;
        font-weight: 700;
      }

      pre {
        background: var(--bg-code);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.76rem;
        color: var(--text-code);
        line-height: 1.4;
      }

      .impact-text {
        font-size: 0.78rem;
        line-height: 1.4;
      }
    }
  `]
})
export class DipDependencyInversionComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly socketMode = signal<'welded' | 'standard'>('standard');
  readonly activePlugDevice = signal<'LampeLED' | 'ChargeurMac' | 'Aspirateur'>('LampeLED');
}
