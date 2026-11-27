import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-code-dilemma',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 03 · Généricité TypeScript</div>
        <h2>Le Dilemme du Code : Duplication vs any vs Généricité &lt;T&gt;</h2>
        <p class="module-desc">
          Votre application gère des <strong>Produits</strong> et des <strong>Clients</strong>.
          Trois stratégies s'offrent à vous : copier-coller (enfer de maintenance), tout accepter avec <code>any</code> (perte de typage et crash runtime),
          ou adopter la généricité <code>&lt;T&gt;</code> (l'algorithme unique strictement typé).
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Comparateur Interactif à 3 Colonnes</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 3 · 3 Ex)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- Comparateur Interactif à 3 Colonnes -->
        <section class="card-panel">
          <div class="comparator-header">
            <h3>⚖️ Le Match des 3 Stratégies</h3>
            <span class="badge badge-ts">TypeScript 5+</span>
          </div>

          <div class="three-columns-grid mt-3">
            <!-- Colonne 1 : Copier-Coller -->
            <div class="strategy-col col-rose">
              <div class="strategy-badge badge-rose">❌ Stratégie 1 : Copier-Coller</div>
              <h4>Duplication Massive</h4>
              <p class="strat-desc">
                On crée <code>ProduitRepository</code>, puis on copie-colle pour <code>ClientRepository</code>, <code>CommandeRepository</code>...
              </p>

              <div class="code-box-mini">
                <div class="code-title">produit-repo.ts &amp; client-repo.ts</div>
                <pre><code>class ProduitRepo {{ '{' }}
  items: Produit[] = [];
  ajouter(p: Produit) {{ '{' }} ... {{ '}' }}
{{ '}' }}

class ClientRepo {{ '{' }}
  items: Client[] = [];
  ajouter(c: Client) {{ '{' }} ... {{ '}' }}
{{ '}' }}</code></pre>
              </div>

              <div class="interactive-test-box">
                <div class="test-label">⚡ Test de Maintenance :</div>
                <p class="test-desc">Un bug d'unicité est détecté dans l'algorithme d'ajout.</p>
                <button class="btn-secondary w-full" (click)="corrigerBugDuplication()">
                  {{ bugDuplicationCorrige() ? '✓ Bug corrigé dans ProduitRepo' : '🔧 Corriger le bug dans ProduitRepo' }}
                </button>

                @if (bugDuplicationCorrige()) {
                  <div class="warning-callout mt-2">
                    ⚠️ <strong>Problème :</strong> Le bug a été corrigé dans <code>ProduitRepo</code>, mais <code>ClientRepo</code> contient toujours la faille !
                    Si vous avez 10 entités, vous devez réécrire le correctif 10 fois.
                  </div>
                }
              </div>
            </div>

            <!-- Colonne 2 : Le piège any -->
            <div class="strategy-col col-amber">
              <div class="strategy-badge badge-amber">❌ Stratégie 2 : Le Piège any</div>
              <h4>Laxisme &amp; Crashes</h4>
              <p class="strat-desc">
                Une seule classe avec <code>items: any[]</code>. Plus de duplication, mais plus aucun contrôle du compilateur.
              </p>

              <div class="code-box-mini">
                <div class="code-title">any-repo.ts</div>
                <pre><code>class AnyRepository {{ '{' }}
  items: any[] = [];
  ajouter(item: any) {{ '{' }}
    this.items.push(item);
  {{ '}' }}
{{ '}' }}</code></pre>
              </div>

              <div class="interactive-test-box">
                <div class="test-label">⚡ Test de Robustesse :</div>
                <p class="test-desc">Injection accidentelle d'un objet incompatible dans la liste :</p>
                <button class="btn-secondary w-full" (click)="injecterFauteAny()">
                  Insérer : <code>repo.ajouter({{ '{' }} nom: "Incompatible" {{ '}' }})</code>
                </button>

                @if (anyCrashTriggered()) {
                  <div class="crash-callout mt-2">
                    💥 <strong>CRASH RUNTIME :</strong><br>
                    Le compilateur a laissé passer le mélange sans rien dire.
                    Lors de l'appel à <code>p.prix.toFixed(2)</code>, l'application plante avec :<br>
                    <code>TypeError: Cannot read properties of undefined (reading 'toFixed')</code>
                  </div>
                }
              </div>
            </div>

            <!-- Colonne 3 : La Généricité <T> -->
            <div class="strategy-col col-emerald">
              <div class="strategy-badge badge-emerald">✅ Stratégie 3 : Généricité &lt;T&gt;</div>
              <h4>Le Meilleur des Deux Mondes</h4>
              <p class="strat-desc">
                Une seule classe <code>Repository&lt;T&gt;</code>. Le code est écrit une fois, et TypeScript vérifie chaque type à 100%.
              </p>

              <div class="code-box-mini">
                <div class="code-title">repository.ts</div>
                <pre><code>class Repository&lt;T&gt; {{ '{' }}
  #items = signal&lt;T[]&gt;([]);
  ajouter(item: T) {{ '{' }} ... {{ '}' }}
{{ '}' }}

const prods = new Repository&lt;Produit&gt;();
const clients = new Repository&lt;Client&gt;();</code></pre>
              </div>

              <div class="interactive-test-box">
                <div class="test-label">⚡ Bouclier du Compilateur :</div>
                <p class="test-desc">Tentative de mélanger Client et Produit :</p>
                <button class="btn-primary w-full" (click)="testerGenericiteShield()">
                  Tester : <code>prods.ajouter(new Client(...))</code>
                </button>

                @if (shieldTriggered()) {
                  <div class="shield-callout mt-2">
                    🛡️ <strong>TS2345 BLOQUÉ AVANT EXÉCUTION :</strong><br>
                    <code>Argument of type 'Client' is not assignable to parameter of type 'Produit'.</code><br>
                    Aucun crash en production : le bug est stoppé dans l'IDE !
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Tableau Synthétique de Comparaison -->
        <section class="card-panel mt-4">
          <h3>📊 Synthèse Comparative</h3>
          <div class="table-responsive mt-3">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Critère</th>
                  <th>1. Copier-Coller</th>
                  <th>2. Le type any</th>
                  <th>3. Généricité &lt;T&gt;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Lignes de code (DRY)</strong></td>
                  <td class="bad">❌ Multipliées par le nombre d'entités</td>
                  <td class="good">✓ Code factorisé en une seule classe</td>
                  <td class="good">✓ Code factorisé en une seule classe</td>
                </tr>
                <tr>
                  <td><strong>Sécurité du typage</strong></td>
                  <td class="good">✓ Strictement typé</td>
                  <td class="bad">❌ Zéro sécurité (désactivation totale)</td>
                  <td class="good">✓ Typage strict et autonome par entité</td>
                </tr>
                <tr>
                  <td><strong>Autocomplétion IDE</strong></td>
                  <td class="good">✓ Disponible</td>
                  <td class="bad">❌ Aveugle (propositions inexistantes)</td>
                  <td class="good">✓ Complète et contextuelle</td>
                </tr>
                <tr>
                  <td><strong>Détection des fautes de frappe</strong></td>
                  <td class="good">✓ Immédiate</td>
                  <td class="bad">❌ Silencieuse jusqu'au crash</td>
                  <td class="good">✓ Immédiate (TS2339 / TS2345)</td>
                </tr>
                <tr>
                  <td><strong>Maintenance des algorithmes</strong></td>
                  <td class="bad">❌ Cauchemar (corriger dans chaque classe)</td>
                  <td class="good">✓ 1 seul endroit</td>
                  <td class="good">✓ 1 seul endroit pour toute l'appli</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      } @else {
        <app-lab-runner [defaultLabNumber]="3"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .comparator-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
      }
    }

    .three-columns-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 980px) {
      .three-columns-grid {
        grid-template-columns: 1fr;
      }
    }

    .strategy-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.col-rose {
        border-top: 4px solid #f43f5e;
      }
      &.col-amber {
        border-top: 4px solid #f59e0b;
      }
      &.col-emerald {
        border-top: 4px solid #10b981;
        background: rgba(16, 185, 129, 0.04);
      }

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
      }

      .strat-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    .strategy-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
      width: fit-content;

      &.badge-rose {
        background: rgba(244, 63, 94, 0.15);
        color: #fb7185;
      }
      &.badge-amber {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
      }
      &.badge-emerald {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
    }

    .code-box-mini {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;

      .code-title {
        background: var(--bg-subtle);
        padding: 4px 10px;
        font-size: 0.7rem;
        font-family: var(--font-mono);
        color: var(--text-dim);
      }

      pre {
        margin: 0;
        padding: 10px;
        font-size: 0.76rem;
        color: var(--text-code);
        font-family: var(--font-mono);
        line-height: 1.45;
      }
    }

    .interactive-test-box {
      margin-top: auto;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;

      .test-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 4px;
      }

      .test-desc {
        font-size: 0.74rem;
        color: var(--text-muted);
        margin-bottom: 8px;
      }
    }

    .warning-callout {
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #fda4af;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      line-height: 1.45;
    }

    .crash-callout {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      line-height: 1.45;

      code {
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        padding: 2px 4px;
        border-radius: 3px;
      }
    }

    .shield-callout {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #a7f3d0;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      line-height: 1.45;

      code {
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        padding: 2px 4px;
        border-radius: 3px;
      }
    }

    .table-responsive {
      overflow-x: auto;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;

      th, td {
        padding: 10px 14px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }

      th {
        background: var(--bg-subtle);
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.78rem;
      }

      td.good {
        color: #34d399;
      }

      td.bad {
        color: #f87171;
      }
    }
  `]
})
export class CodeDilemmaComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly bugDuplicationCorrige = signal<boolean>(false);
  readonly anyCrashTriggered = signal<boolean>(false);
  readonly shieldTriggered = signal<boolean>(false);

  corrigerBugDuplication(): void {
    this.bugDuplicationCorrige.set(true);
  }

  injecterFauteAny(): void {
    this.anyCrashTriggered.set(true);
  }

  testerGenericiteShield(): void {
    this.shieldTriggered.set(true);
  }
}
