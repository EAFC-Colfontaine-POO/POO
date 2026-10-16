import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-cloning-shallow-vs-deep',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 12 · Module 03</span>
          <span class="badge badge-purple">Shallow vs Deep</span>
          <span class="badge badge-blue">structuredClone()</span>
          <span class="badge badge-success">Pattern clone() POO</span>
        </div>
        <h2>La Duplication : Copie Superficielle (Shallow) vs Copie Profonde (Deep)</h2>
        <p class="module-desc">
          Comment obtenir une copie véritablement autonome d'un objet sans risquer d'altérer l'original ? Comprenez la frontière entre le premier niveau et les niveaux imbriqués, et découvrez le patron Prototype en POO.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Visualiseur de Duplication & Matrice de Décision
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 3)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="cloning-workbench">

          <!-- 1. Démonstrateur Interactif Shallow vs Deep -->
          <div class="card-panel demo-interactive-card">
            <div class="panel-head">
              <span class="badge badge-warning">L'Expérience en Direct</span>
              <h3>L'Analogie de la Valise Câblée : Spread vs structuredClone()</h3>
              <p class="sub-text">Observez ce qui se produit en mémoire selon la stratégie de duplication choisie.</p>
            </div>

            <!-- Contrôles interactifs -->
            <div class="controls-row">
              <button 
                class="btn-secondary btn-sm" 
                [class.active]="duplicationMode() === 'spread'"
                (click)="setStrategy('spread')"
              >
                1. Duplication par Spread &#123; ...original &#125; (Shallow)
              </button>
              <button 
                class="btn-secondary btn-sm" 
                [class.active]="duplicationMode() === 'structuredClone'"
                (click)="setStrategy('structuredClone')"
              >
                2. Duplication par structuredClone() (Deep)
              </button>
              <button 
                class="btn-secondary btn-sm" 
                [class.active]="duplicationMode() === 'pooClone'"
                (click)="setStrategy('pooClone')"
              >
                3. Patron POO clone() avec Délégation
              </button>
              <button class="btn-ghost btn-sm" (click)="resetDemo()">
                ↺ Réinitialiser
              </button>
            </div>

            <!-- Zone de Comparaison des Objets en Mémoire -->
            <div class="memory-boxes-grid">
              <!-- Objet Original -->
              <div class="obj-box original-box">
                <div class="box-head">
                  <div class="box-title">📦 Objet Original (Alice)</div>
                  <span class="addr-badge font-mono">@0x100</span>
                </div>

                <div class="obj-content font-mono">
                  <div class="line">pseudo: <span class="val-str">'Alice'</span></div>
                  <div class="nested-block">
                    <div class="nested-title">parametres: <span class="sub-addr">@{{ origParamsAddr() }}</span></div>
                    <div class="line">notifications: <span class="val-bool" [class.danger]="!origNotifs()">{{ origNotifs() }}</span></div>
                    <div class="line">resolution: <span class="val-str">'1080p'</span></div>
                  </div>
                </div>
              </div>

              <!-- Objet Cloné -->
              <div class="obj-box clone-box" [class.danger-box]="duplicationMode() === 'spread' && hasToggledNotif()">
                <div class="box-head">
                  <div class="box-title">📋 Objet Cloné</div>
                  <span class="addr-badge font-mono">@0x200 (Nouveau niveau 1)</span>
                </div>

                <div class="obj-content font-mono">
                  <div class="line">pseudo: <span class="val-str">'Alice'</span></div>
                  <div class="nested-block" [class.shared-highlight]="duplicationMode() === 'spread'">
                    <div class="nested-title">
                      parametres: 
                      <span class="sub-addr" [class.shared-addr]="duplicationMode() === 'spread'">
                        @{{ cloneParamsAddr() }}
                        @if (duplicationMode() === 'spread') {
                          <span>(PARTAGÉ !)</span>
                        }
                      </span>
                    </div>
                    <div class="line">notifications: <span class="val-bool" [class.danger]="!cloneNotifs()">{{ cloneNotifs() }}</span></div>
                    <div class="line">resolution: <span class="val-str">'1080p'</span></div>
                  </div>
                </div>

                <div class="box-actions">
                  <button class="btn-primary btn-sm" (click)="toggleCloneNotifs()">
                    ⚡ Basculer notifications sur le CLONE
                  </button>
                </div>
              </div>
            </div>

            <!-- Explication du résultat actuel -->
            <div class="result-banner" [class.alert-danger]="duplicationMode() === 'spread' && hasToggledNotif()" [class.alert-success]="duplicationMode() !== 'spread'">
              @if (duplicationMode() === 'spread') {
                @if (hasToggledNotif()) {
                  <div>
                    💥 <strong>DÉSASTRE SILENCIEUX (EFFET DE BORD) :</strong> En modifiant <code>clone.parametres.notifications = false</code>, vous avez muté l'objet d'origine d'Alice ! Car le spread n'a recopié que l'adresse <code>@0x999</code> du sous-objet.
                  </div>
                } @else {
                  <div>
                    ⚠️ <strong>Attention :</strong> Le conteneur externe a une nouvelle adresse (@0x200), mais le sous-objet <code>parametres</code> partage toujours l'adresse <code>@0x999</code> avec l'original. Cliquez sur le bouton violet ci-dessus pour observer le bug !
                  </div>
                }
              } @else if (duplicationMode() === 'structuredClone') {
                <div>
                  🎉 <strong>COPIE PROFONDE RÉUSSIE :</strong> <code>structuredClone()</code> a dupliqué récursivement tous les niveaux. Le sous-objet a sa propre adresse (@0x888). L'original d'Alice est 100% protégé !
                </div>
              } @else {
                <div>
                  💎 <strong>PATRON POO CLONE() :</strong> La classe Client a délégué la copie à <code>this.adresse.clone()</code>. Prototypes, méthodes et encapsulation sont parfaitement conservés !
                </div>
              }
            </div>
          </div>

          <!-- 2. La Limite de structuredClone() face aux Classes Métier -->
          <div class="card-panel limits-card">
            <div class="panel-head">
              <span class="badge badge-danger">Attention en POO</span>
              <h3>La Limite Majeure de structuredClone() : La Perte du Prototype</h3>
              <p class="sub-text">structuredClone() est conçu pour les données pures (JSON, Dates, Maps, Sets). Mais sur une instance de classe, voici le piège :</p>
            </div>

            <div class="limits-grid">
              <div class="limit-demo-box">
                <div class="box-title">Code Exécuté :</div>
                <pre class="font-mono"><code>class Client &#123;
  constructor(public nom: string) &#125;
  saluer() &#123; return "Bonjour " + this.nom; &#125;
&#125;

const c1 = new Client("Alice");
const c2 = structuredClone(c1); // ⚠️ Clone anonyme !</code></pre>
              </div>

              <div class="limit-results-box">
                <div class="res-item">
                  <span class="res-label">c1 instanceof Client :</span>
                  <span class="badge badge-success font-mono">true</span>
                </div>
                <div class="res-item">
                  <span class="res-label">c2 instanceof Client :</span>
                  <span class="badge badge-danger font-mono">false 💥 (Prototype perdu !)</span>
                </div>
                <div class="res-item">
                  <span class="res-label">c2.saluer() :</span>
                  <span class="badge badge-danger font-mono">TypeError: c2.saluer is not a function 💥</span>
                </div>
                <div class="res-conclusion">
                  👉 <strong>Conclusion :</strong> Pour vos vraies classes de domaine POO comportant des méthodes, vous devez impérativement implémenter une méthode métier <code>clone(): T</code> !
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Matrice Interactive de Décision -->
          <div class="card-panel matrix-card">
            <div class="panel-head">
              <span class="badge badge-purple">Boîte à Outils</span>
              <h3>Matrice de Décision : Quelle Stratégie de Duplication Choisir ?</h3>
              <p class="sub-text">Le guide de référence pour ne plus jamais hésiter sur le terrain.</p>
            </div>

            <div class="table-responsive">
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th>Technique</th>
                    <th>Profondeur</th>
                    <th>Garde les Méthodes / Prototype ?</th>
                    <th>Gère les Dates, Map, Set ?</th>
                    <th>Cas d'usage Idéal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong class="font-mono">b = a</strong></td>
                    <td><span class="badge badge-danger">0 niveau (Alias)</span></td>
                    <td><span class="text-success">✔ Oui</span></td>
                    <td><span class="text-success">✔ Oui</span></td>
                    <td>Vous voulez simplement un second pointeur vers le même objet en RAM.</td>
                  </tr>
                  <tr>
                    <td><strong class="font-mono">&#123; ...a &#125;</strong></td>
                    <td><span class="badge badge-warning">1 niveau (Shallow)</span></td>
                    <td><span class="text-danger">✖ Non (Objet littéral)</span></td>
                    <td><span class="text-danger">✖ Non (Copie l'adresse)</span></td>
                    <td><strong>Objets de données plats</strong>, DTOs simples sans sous-objets, état de formulaire.</td>
                  </tr>
                  <tr>
                    <td><strong class="font-mono">structuredClone(a)</strong></td>
                    <td><span class="badge badge-success">Tous niveaux (Deep)</span></td>
                    <td><span class="text-danger">✖ Non (Données pures)</span></td>
                    <td><span class="text-success">✔ Oui (Natif & parfait)</span></td>
                    <td><strong>Arbres de données complexes</strong>, payloads d'APIs, clones d'états réactifs.</td>
                  </tr>
                  <tr>
                    <td><strong class="font-mono">a.clone() POO</strong></td>
                    <td><span class="badge badge-success">Tous niveaux (Deep)</span></td>
                    <td><span class="text-success">✔ Oui (100% POO)</span></td>
                    <td><span class="text-success">✔ Oui (si géré)</span></td>
                    <td><strong>Classes métier de domaine</strong>, préservation d'encapsulation et méthodes.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      } @else {
        <!-- Onglet Exercices Labo 3 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="3"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .cloning-workbench {
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

    .controls-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;

      .btn-secondary.active {
        background: var(--bs-purple);
        color: #fff;
        border-color: var(--bs-purple-light);
      }
    }

    .memory-boxes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .obj-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.danger-box {
        border-color: rgba(239, 68, 68, 0.5);
      }

      .box-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;

        .box-title {
          font-weight: 700;
          font-size: 0.95rem;
        }

        .addr-badge {
          font-size: 0.75rem;
          color: #38bdf8;
          background: var(--bg-code);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    }

    .obj-content {
      font-size: 0.82rem;
      line-height: 1.6;

      .val-str { color: #fde047; }
      .val-bool {
        color: #34d399;
        font-weight: 800;
        &.danger { color: #f87171; }
      }

      .nested-block {
        margin-top: 6px;
        margin-left: 12px;
        padding: 8px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;

        &.shared-highlight {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.08);
        }

        .nested-title {
          font-size: 0.78rem;
          color: var(--text-dim);
          margin-bottom: 4px;
        }

        .sub-addr {
          color: #c084fc;
          font-weight: 700;

          &.shared-addr {
            color: #f59e0b;
          }
        }
      }
    }

    .box-actions {
      margin-top: auto;
    }

    .result-banner {
      margin-top: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      line-height: 1.5;

      &.alert-danger {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #fca5a5;
      }

      &.alert-success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #a7f3d0;
      }
    }

    /* Limite structuredClone */
    .limits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .limit-demo-box pre {
      background: var(--bg-code);
      padding: 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.8rem;
      line-height: 1.5;
    }

    .limit-results-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .res-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;

        .res-label {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
          font-family: var(--font-mono);
        }
      }

      .res-conclusion {
        margin-top: 6px;
        font-size: 0.8rem;
        color: var(--text-main);
        padding: 8px;
        background: rgba(121, 82, 179, 0.15);
        border-radius: 6px;
      }
    }

    /* Matrice Table */
    .table-responsive {
      overflow-x: auto;
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;

      th {
        text-align: left;
        padding: 10px 14px;
        background: var(--bg-subtle);
        color: var(--text-muted);
        font-weight: 700;
        border-bottom: 1px solid var(--border-color);
      }

      td {
        padding: 12px 14px;
        border-bottom: 1px solid var(--border-subtle);
      }

      tr:hover td {
        background: var(--bg-card-hover);
      }
    }
  `]
})
export class CloningShallowVsDeepComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  readonly duplicationMode = signal<'spread' | 'structuredClone' | 'pooClone'>('spread');
  readonly hasToggledNotif = signal<boolean>(false);

  // Valeurs des paramètres
  readonly origNotifs = signal<boolean>(true);
  readonly cloneNotifs = signal<boolean>(true);

  readonly origParamsAddr = signal<string>('0x999');
  readonly cloneParamsAddr = signal<string>('0x999');

  setStrategy(strat: 'spread' | 'structuredClone' | 'pooClone'): void {
    this.duplicationMode.set(strat);
    this.hasToggledNotif.set(false);
    this.origNotifs.set(true);
    this.cloneNotifs.set(true);

    if (strat === 'spread') {
      this.cloneParamsAddr.set('0x999'); // Même adresse partagée
    } else if (strat === 'structuredClone') {
      this.cloneParamsAddr.set('0x888'); // Adresse indépendante
    } else {
      this.cloneParamsAddr.set('0x777'); // Adresse autonome POO
    }
  }

  toggleCloneNotifs(): void {
    this.hasToggledNotif.set(true);
    this.cloneNotifs.update(v => !v);

    // Si on est en mode shallow (spread), l'original est muté aussi !
    if (this.duplicationMode() === 'spread') {
      this.origNotifs.set(this.cloneNotifs());
    }
  }

  resetDemo(): void {
    this.setStrategy('spread');
  }
}
