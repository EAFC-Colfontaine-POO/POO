import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-immutability-value-objects',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 12 · Module 04</span>
          <span class="badge badge-purple">Immutabilité POO</span>
          <span class="badge badge-blue">readonly + freeze()</span>
          <span class="badge badge-success">Value Object Monnaie</span>
        </div>
        <h2>L'Immutabilité en POO : readonly, Object.freeze() & Value Objects</h2>
        <p class="module-desc">
          Et si la méthode la plus élégante et la plus sûre pour éliminer les bugs de mutation consistait tout simplement à interdire formellement toute modification d'état ? Découvrez comment combiner compilation et runtime pour forger des objets indestructibles.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Laboratoire d'Immutabilité & Mur des Pièges
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 4)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="immutability-workbench">

          <!-- 1. Tableau Blanc vs Gravure sur Pierre -->
          <div class="card-panel contrast-card">
            <div class="panel-head">
              <span class="badge badge-purple">Philosophie Logicielle</span>
              <h3>Tableau Blanc (Mutable) vs Gravure sur Pierre (Immuable)</h3>
            </div>

            <div class="contrast-grid">
              <!-- Mutable -->
              <div class="philosophy-box mutable-box">
                <div class="philo-header">
                  <span class="icon">✏️</span>
                  <h4>L'Objet Mutable (Par défaut)</h4>
                </div>
                <div class="philo-metaphor">Ressemble à un tableau blanc effaçable</div>
                <p>N'importe quelle méthode ou fonction distante peut venir effacer et réécrire ses attributs internes à tout moment.</p>
                <div class="points-list danger">
                  <div>💥 Risque élevé d'effets de bord imprévus</div>
                  <div>💥 Impossible de savoir qui a modifié l'état et quand</div>
                  <div>💥 Bugs indétectables en environnement réactif</div>
                </div>
              </div>

              <!-- Immuable -->
              <div class="philosophy-box immutable-box">
                <div class="philo-header">
                  <span class="icon">🗿</span>
                  <h4>L'Objet Immuable (Gravé sur pierre)</h4>
                </div>
                <div class="philo-metaphor">Ressemble à une gravure sur pierre</div>
                <p>Dès que l'objet sort du constructeur, son état interne est scellé pour l'éternité. Pour le modifier, on instancie une nouvelle version.</p>
                <div class="points-list success">
                  <div>✅ Fiabilité absolue : 100% prédictible</div>
                  <div>✅ Aucun risque d'altération cachée</div>
                  <div>✅ Détection de changement ultra-rapide par référence</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Le Double Bouclier : readonly (TS) + Object.freeze() (JS) -->
          <div class="card-panel shield-card">
            <div class="panel-head">
              <span class="badge badge-blue">Le Double Bouclier</span>
              <h3>Sécurité de Compilation vs Verrou Physique Runtime</h3>
              <p class="sub-text">Comment sceller rigoureusement une classe en TypeScript.</p>
            </div>

            <div class="shield-grid">
              <div class="shield-col">
                <div class="shield-tag ts font-mono">🛡️ 1. readonly (TypeScript)</div>
                <div class="shield-title">Sécurité au Temps de Compilation</div>
                <p>Le compilateur TypeScript vérifie le code dans votre éditeur et refuse de générer le JavaScript si une réassignation est tentée.</p>
                <div class="shield-alert warning">
                  ⚠️ <strong>Attention :</strong> Lors de la compilation, le mot-clé <code>readonly</code> s'évapore totalement du code généré !
                </div>
              </div>

              <div class="shield-col">
                <div class="shield-tag js font-mono">🧊 2. Object.freeze(this) (JavaScript)</div>
                <div class="shield-title">Verrouillage au Temps d'Exécution</div>
                <p>Le moteur JavaScript (V8) verrouille physiquement la structure dans le Tas. Toute tentative d'écriture déclenche un <code>TypeError</code> au runtime.</p>
                <div class="shield-alert success">
                  ✔ <strong>Cadenas physique :</strong> Même un script externe JS pur ne pourra jamais altérer votre objet en mémoire vive.
                </div>
              </div>
            </div>

            <!-- Démonstrateur de tentative d'écriture -->
            <div class="freeze-interactive-stage">
              <div class="stage-title">🧪 Testez le cadenas en mémoire vive sur GPS :</div>
              <div class="stage-controls">
                <button class="btn-secondary btn-sm" (click)="testModifyGps()">
                  Tenter : bruxelles.latitude = 52.0 (Mutation)
                </button>
                <button class="btn-ghost btn-xs" (click)="freezeMessage.set(null)">
                  Effacer
                </button>
              </div>

              @if (freezeMessage()) {
                <div class="freeze-output font-mono" [class.error]="isFreezeError()">
                  {{ freezeMessage() }}
                </div>
              }
            </div>
          </div>

          <!-- 3. Le Chef-d'œuvre du Value Object : La Classe Monnaie -->
          <div class="card-panel monnaie-card">
            <div class="panel-head">
              <span class="badge badge-success">Exemple Magistral</span>
              <h3>La Classe Métier Monnaie : Pure, Auto-validée & Immuable</h3>
              <p class="sub-text">Chaque opération financière instancie une nouvelle valeur sans jamais altérer l'original.</p>
            </div>

            <div class="monnaie-interactive-demo">
              <div class="cards-row">
                <!-- Prix Article -->
                <div class="money-instance font-mono">
                  <div class="inst-label">const prixArticle</div>
                  <div class="inst-addr">@0x10A-EUR</div>
                  <div class="inst-val">{{ prixArticle() }} €</div>
                  <div class="inst-status">Inchangé pour toujours</div>
                </div>

                <div class="math-operator">+</div>

                <!-- Frais de Port -->
                <div class="money-instance font-mono">
                  <div class="inst-label">const fraisPort</div>
                  <div class="inst-addr">@0x20B-EUR</div>
                  <div class="inst-val">{{ fraisPort() }} €</div>
                  <div class="inst-status">Instance autonome</div>
                </div>

                <div class="math-operator">=</div>

                <!-- Total Calculé -->
                <div class="money-instance total-instance font-mono">
                  <div class="inst-label">const total = prix.ajouter(frais)</div>
                  <div class="inst-addr">@0x30C-EUR (NOUVELLE INSTANCE)</div>
                  <div class="inst-val">{{ totalMontant() }} €</div>
                  <div class="inst-status text-success">Nouvelle adresse en RAM 🎉</div>
                </div>
              </div>

              <div class="monnaie-actions">
                <button class="btn-primary btn-sm" (click)="changerFraisPort(20)">
                  Modifier Frais de Port (+10 €)
                </button>
                <button class="btn-secondary btn-sm" (click)="changerFraisPort(10)">
                  Remettre Frais de Port à 10 €
                </button>
              </div>
            </div>
          </div>

          <!-- 4. Le Mur des 4 Pièges Classiques des Juniors -->
          <div class="card-panel traps-wall-card">
            <div class="panel-head">
              <span class="badge badge-danger">Mur des Pièges</span>
              <h3>Les 4 Pièges Classiques des Développeurs Juniors</h3>
            </div>

            <div class="traps-grid">
              <div class="trap-card">
                <div class="trap-head">
                  <span class="trap-badge">Piège 1</span>
                  <h4>Muter un tableau avec .push()</h4>
                </div>
                <div class="trap-code font-mono">
                  <div class="bad">tab.push(item); // 💥 Même adresse</div>
                  <div class="good">[...tab, item]; // ✔ Nouveau tableau</div>
                </div>
                <p>Dans Angular Signals, .push() conserve l'adresse : aucun composant ne se rafraîchit !</p>
              </div>

              <div class="trap-card">
                <div class="trap-head">
                  <span class="trap-badge">Piège 2</span>
                  <h4>Confondre const et l'immutabilité</h4>
                </div>
                <div class="trap-code font-mono">
                  <div class="bad">const u = &#123; nom: 'A' &#125;; u.nom = 'B';</div>
                  <div class="good">Object.freeze(u); // ✔ Verrouille le Tas</div>
                </div>
                <p><code>const</code> verrouille le pointeur dans la Pile, pas les propriétés dans le Tas !</p>
              </div>

              <div class="trap-card">
                <div class="trap-head">
                  <span class="trap-badge">Piège 3</span>
                  <h4>Comparer deux Dates avec ===</h4>
                </div>
                <div class="trap-code font-mono">
                  <div class="bad">d1 === d2 // 💥 Compare 0x10A === 0x20B</div>
                  <div class="good">d1.getTime() === d2.getTime() // ✔ Timestamp</div>
                </div>
                <p>Deux dates identiques dans le temps sont deux objets distincts en mémoire vive.</p>
              </div>

              <div class="trap-card">
                <div class="trap-head">
                  <span class="trap-badge">Piège 4</span>
                  <h4>Cloner une classe par spread</h4>
                </div>
                <div class="trap-code font-mono">
                  <div class="bad">const c2 = &#123; ...c1 &#125;; // 💥 Objet littéral</div>
                  <div class="good">const c2 = c1.clone(); // ✔ Méthodes gardées</div>
                </div>
                <p>Le spread détruit le prototype et toutes les méthodes de la classe.</p>
              </div>
            </div>
          </div>

        </div>
      } @else {
        <!-- Onglet Exercices Labo 4 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="4"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .immutability-workbench {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .panel-head {
      margin-bottom: 16px;
      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        margin-top: 4px;
      }
      .sub-text {
        font-size: 0.84rem;
        color: var(--text-muted);
      }
    }

    /* Tableau Blanc vs Gravure */
    .contrast-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .philosophy-box {
      border-radius: 10px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.mutable-box {
        background: rgba(239, 68, 68, 0.06);
        border: 1px solid rgba(239, 68, 68, 0.25);
      }

      &.immutable-box {
        background: rgba(16, 185, 129, 0.06);
        border: 1px solid rgba(16, 185, 129, 0.25);
      }

      .philo-header {
        display: flex;
        align-items: center;
        gap: 10px;

        .icon {
          font-size: 1.6rem;
        }

        h4 {
          font-size: 1.05rem;
          font-weight: 800;
        }
      }

      .philo-metaphor {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      p {
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.45;
      }

      .points-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.8rem;
        font-weight: 600;

        &.danger { color: #fca5a5; }
        &.success { color: #a7f3d0; }
      }
    }

    /* Double Bouclier */
    .shield-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .shield-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .shield-tag {
        font-size: 0.76rem;
        font-weight: 700;

        &.ts { color: #60a5fa; }
        &.js { color: #fde047; }
      }

      .shield-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
      }

      .shield-alert {
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 0.78rem;

        &.warning {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fbbf24;
        }

        &.success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #a7f3d0;
        }
      }
    }

    .freeze-interactive-stage {
      margin-top: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 14px;

      .stage-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .stage-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .freeze-output {
        margin-top: 10px;
        padding: 8px 12px;
        background: var(--bg-code);
        border-radius: 6px;
        font-size: 0.78rem;

        &.error {
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }
      }
    }

    /* Monnaie Value Object */
    .monnaie-interactive-demo {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .cards-row {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      .math-operator {
        font-size: 1.8rem;
        font-weight: 900;
        color: var(--text-dim);
      }

      .money-instance {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 170px;

        &.total-instance {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.4);
        }

        .inst-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .inst-addr {
          font-size: 0.68rem;
          color: #38bdf8;
        }

        .inst-val {
          font-size: 1.6rem;
          font-weight: 900;
          color: #10b981;
        }

        .inst-status {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
      }

      .monnaie-actions {
        display: flex;
        gap: 8px;
      }
    }

    /* Mur des Pièges */
    .traps-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .trap-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .trap-head {
        display: flex;
        align-items: center;
        gap: 8px;

        .trap-badge {
          font-size: 0.7rem;
          font-weight: 800;
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 2px 6px;
          border-radius: 4px;
        }

        h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }
      }

      .trap-code {
        background: var(--bg-code);
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 0.74rem;
        line-height: 1.4;

        .bad { color: #f87171; }
        .good { color: #34d399; }
      }

      p {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }
  `]
})
export class ImmutabilityValueObjectsComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  // Test freeze
  readonly freezeMessage = signal<string | null>(null);
  readonly isFreezeError = signal<boolean>(false);

  // Démo Monnaie
  readonly prixArticle = signal<number>(50);
  readonly fraisPort = signal<number>(10);

  totalMontant(): number {
    return this.prixArticle() + this.fraisPort();
  }

  changerFraisPort(montant: number): void {
    this.fraisPort.set(montant);
  }

  testModifyGps(): void {
    try {
      const gps: any = { latitude: 50.85, longitude: 4.35 };
      Object.freeze(gps);

      // Tentative de modification en mode strict
      'use strict';
      gps.latitude = 52.0;

      // Si le runtime ne jette pas d'erreur (non-strict context), on vérifie si la valeur a bougé
      if (gps.latitude === 50.85) {
        this.isFreezeError.set(true);
        this.freezeMessage.set('TypeError: Cannot assign to read only property "latitude" of object (Verrouillé par Object.freeze). La valeur reste 50.85.');
      } else {
        this.freezeMessage.set('Modifié');
      }
    } catch (err: any) {
      this.isFreezeError.set(true);
      this.freezeMessage.set(`TypeError: ${err.message || String(err)}`);
    }
  }
}
