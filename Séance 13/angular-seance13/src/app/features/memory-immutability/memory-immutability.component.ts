import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-memory-immutability',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 13 · Module 03</span>
          <span class="badge badge-purple">Pont Séance 12</span>
          <span class="badge badge-blue">Pile vs Tas</span>
          <span class="badge badge-danger">Le Piège de .push()</span>
        </div>
        <h2>Mémoire & Immutabilité : Le Pont Direct avec la Séance 12</h2>
        <p class="module-desc">
          Pourquoi <code>panier().push(...)</code> fige-t-il l'interface utilisateur ? Découvrez visuellement comment le comparateur de référence <code>Object.is()</code> d'Angular réagit face à la mutation en place versus l'allocation d'une nouvelle adresse mémoire dans le Tas.
        </p>
      </div>

      <div class="memory-workbench">

        <!-- Panneau de comparaison directe côte à côte -->
        <div class="grid-2-cols">

          <!-- ❌ ANTI-PATTERN : MUTATION EN PLACE -->
          <div class="card-panel anti-card">
            <div class="card-head-bad">
              <span class="badge badge-danger">❌ Anti-Pattern Junior</span>
              <h3>panier().push('Pomme') : Mutation en Place dans le Tas</h3>
            </div>

            <div class="code-sample-box">
              <pre><code>// 1. Initialisation
const panier = signal&lt;string[]&gt;(['Poire']); // Adresse 0x10A

// 2. Mutation directe dans le Tas
panier().push('Pomme'); 

// 3. Que fait Angular ?
// Object.is(0x10A, 0x10A) ➔ TRUE !
// 💥 Résultat : LE DOM RESTE FIGÉ !</code></pre>
            </div>

            <!-- Visualisation RAM Pile & Tas pour .push() -->
            <div class="ram-viz-block">
              <div class="ram-col stack-col">
                <div class="col-badge">📚 PILE (Stack)</div>
                <div class="ram-slot">
                  <div class="slot-label">variable 'panier'</div>
                  <div class="slot-pointer font-mono">0x10A</div>
                  <div class="slot-note">L'adresse reste inchangée !</div>
                </div>
              </div>

              <div class="ram-arrow-box">➔</div>

              <div class="ram-col heap-col">
                <div class="col-badge">📦 TAS (Heap)</div>
                <div class="heap-object">
                  <div class="heap-addr font-mono">@0x10A</div>
                  <div class="heap-items">
                    <span>['Poire', 'Pomme']</span>
                  </div>
                  <div class="heap-note text-danger">Contenu altéré à la même adresse</div>
                </div>
              </div>
            </div>

            <div class="dom-verdict-box dom-frozen mt-3">
              <div class="verdict-title">Résultat sur l'écran :</div>
              <div class="verdict-badge">❄️ DOM FIGÉ (0 mise à jour)</div>
              <p class="verdict-desc">
                Angular teste <code>Object.is(ancRef, nouvRef)</code>. Comme les deux pointeurs valent <code>0x10A</code>, Angular déduit qu'aucune modification n'a eu lieu et ne repeint rien !
              </p>
              <button class="btn-secondary btn-sm mt-2" (click)="simulatePush()">
                Simuler panier().push('Pomme')
              </button>
            </div>
          </div>

          <!-- ✅ BONNE PRATIQUE : IMMUTABILITÉ SPREAD -->
          <div class="card-panel good-card">
            <div class="card-head-good">
              <span class="badge badge-success">✅ Règle d'Or POO (S12)</span>
              <h3>panier.update(items => [...items, 'Pomme']) : Nouvelle Référence</h3>
            </div>

            <div class="code-sample-box">
              <pre><code>// 1. Initialisation
const panier = signal&lt;string[]&gt;(['Poire']); // Adresse 0x10A

// 2. Nouvelle allocation mémoire
panier.update(items => [...items, 'Pomme']); // Alloue 0x20B

// 3. Que fait Angular ?
// Object.is(0x10A, 0x20B) ➔ FALSE !
// ⚡ Résultat : RAFRAÎCHISSEMENT CHIRURGICAL !</code></pre>
            </div>

            <!-- Visualisation RAM Pile & Tas pour .update() -->
            <div class="ram-viz-block">
              <div class="ram-col stack-col">
                <div class="col-badge">📚 PILE (Stack)</div>
                <div class="ram-slot highlight-good">
                  <div class="slot-label">variable 'panier'</div>
                  <div class="slot-pointer font-mono text-success">{{ currentGoodAddress() }}</div>
                  <div class="slot-note">Nouvelle adresse pointée !</div>
                </div>
              </div>

              <div class="ram-arrow-box">➔</div>

              <div class="ram-col heap-col">
                <div class="col-badge">📦 TAS (Heap)</div>
                <div class="heap-object" [class.highlight-new]="isNewAlloc()">
                  <div class="heap-addr font-mono">@{{ currentGoodAddress() }}</div>
                  <div class="heap-items">
                    <span>{{ goodPanierItems() }}</span>
                  </div>
                  <div class="heap-note text-success">Nouvelle allocation mémoire propre</div>
                </div>
              </div>
            </div>

            <div class="dom-verdict-box dom-updated mt-3">
              <div class="verdict-title">Résultat sur l'écran :</div>
              <div class="verdict-badge">⚡ DOM RÉVEILLÉ ET ACTUALISÉ !</div>
              <p class="verdict-desc">
                <code>Object.is(0x10A, 0x20B) === false</code>. Angular détecte instantanément le changement d'identité d'objet et déclenche la mise à jour chirurgicale du template HTML.
              </p>
              <button class="btn-primary btn-sm mt-2" (click)="simulateSpread()">
                Simuler panier.update([...items, 'Pomme'])
              </button>
            </div>
          </div>

        </div>

        <!-- Tableau synthétique de référence -->
        <div class="card-panel summary-table-card mt-4">
          <h3>Tableau Récapitulatif : Mutation en Place vs Immutabilité</h3>
          <div class="table-responsive mt-2">
            <table class="table custom-table">
              <thead>
                <tr>
                  <th>Opération</th>
                  <th>Syntaxe</th>
                  <th>Adresse dans le Tas</th>
                  <th>Object.is(anc, nouv)</th>
                  <th>Effet sur le DOM</th>
                </tr>
              </thead>
              <tbody>
                <tr class="row-danger">
                  <td><strong>Mutation directe</strong></td>
                  <td><code>panier().push('X')</code></td>
                  <td>Identique (0x10A)</td>
                  <td><code>true</code> (Pas de changement)</td>
                  <td>❌ DOM figé</td>
                </tr>
                <tr class="row-success">
                  <td><strong>Remplacement immuable</strong></td>
                  <td><code>panier.update(l =&gt; [...l, 'X'])</code></td>
                  <td>Nouvelle adresse (0x20B)</td>
                  <td><code>false</code> (Différence détectée)</td>
                  <td>✔ Mise à jour immédiate</td>
                </tr>
                <tr class="row-success">
                  <td><strong>Filtrage immuable</strong></td>
                  <td><code>panier.update(l =&gt; l.filter(...))</code></td>
                  <td>Nouvelle adresse (0x30C)</td>
                  <td><code>false</code> (Différence détectée)</td>
                  <td>✔ Mise à jour immédiate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 1000px) {
        grid-template-columns: 1fr;
      }
    }

    .card-head-bad h3 {
      font-size: 1.05rem;
      font-weight: 800;
      color: #f87171;
      margin-top: 6px;
    }

    .card-head-good h3 {
      font-size: 1.05rem;
      font-weight: 800;
      color: #34d399;
      margin-top: 6px;
    }

    .code-sample-box {
      margin-top: 12px;
      border-radius: 6px;
      overflow: hidden;
      background: var(--bg-code);
      border: 1px solid var(--border-color);

      pre {
        margin: 0;
        padding: 12px;
        font-size: 0.76rem;
      }
    }

    .ram-viz-block {
      margin-top: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
    }

    .ram-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .col-badge {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--bs-purple-light);
      }
    }

    .ram-arrow-box {
      font-size: 1.2rem;
      color: var(--text-dim);
      font-weight: 800;
    }

    .ram-slot, .heap-object {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 10px;
    }

    .slot-label {
      font-size: 0.68rem;
      color: var(--text-dim);
    }

    .slot-pointer, .heap-addr {
      font-size: 0.95rem;
      font-weight: 800;
      color: #38bdf8;
    }

    .slot-note, .heap-note {
      font-size: 0.65rem;
      margin-top: 3px;
    }

    .heap-items {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-main);
      margin: 2px 0;
    }

    .highlight-good {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.08);
    }

    .highlight-new {
      animation: pulse-glow 0.8s ease-in-out;
    }

    .dom-verdict-box {
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .verdict-title {
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 700;
      }

      .verdict-badge {
        font-size: 0.85rem;
        font-weight: 800;
        font-family: var(--font-mono);
      }

      .verdict-desc {
        font-size: 0.78rem;
        line-height: 1.45;
      }

      &.dom-frozen {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;

        .verdict-badge { color: #f87171; }
      }

      &.dom-updated {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #86efac;

        .verdict-badge { color: #34d399; }
      }
    }

    .summary-table-card {
      h3 {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 8px;
      }
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;

      th {
        background: var(--bg-subtle);
        color: var(--text-muted);
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }

      td {
        padding: 10px 12px;
        border-bottom: 1px solid var(--border-color);
      }

      .row-danger {
        background: rgba(239, 68, 68, 0.05);
      }

      .row-success {
        background: rgba(16, 185, 129, 0.05);
      }
    }
  `]
})
export class MemoryImmutabilityComponent {
  readonly currentGoodAddress = signal<string>('0x10A');
  readonly isNewAlloc = signal<boolean>(false);
  readonly goodPanierItems = signal<string>("['Poire']");

  simulatePush(): void {
    alert("Simulation .push() : L'objet a été muté dans le Tas, mais son adresse reste 0x10A. Object.is(0x10A, 0x10A) est TRUE. Le DOM n'a pas bougé !");
  }

  simulateSpread(): void {
    const nextAddr = this.currentGoodAddress() === '0x10A' ? '0x20B' : '0x30C';
    this.currentGoodAddress.set(nextAddr);
    this.goodPanierItems.set("['Poire', 'Pomme']");
    this.isNewAlloc.set(true);

    setTimeout(() => {
      this.isNewAlloc.set(false);
    }, 1000);
  }
}
