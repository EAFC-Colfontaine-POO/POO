import { Component, signal, computed } from '@angular/core';

interface StorageEntry {
  key: string;
  value: string;
  bytes: number;
}

@Component({
  selector: 'app-storage-api',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 02 · L'INTERFACE STORAGE &amp; LE PIÈGE DE LA CHAÎNE</div>
        <h2>Laboratoire de l'API Storage &amp; Pièges de Typage</h2>
        <p class="module-desc">
          Testez en direct les 6 méthodes natives de l'interface <code>Storage</code> et découvrez pourquoi
          l'adage « Tout est chaîne » engendre les bugs les plus sournois du développement web.
        </p>
      </div>

      <!-- Section 1 : Terminal Interactif des 6 Méthodes -->
      <div class="card-panel terminal-wrapper">
        <div class="section-title-row">
          <div class="s-title">🖥️ Terminal Interactif : Les 6 Méthodes Natives</div>
          <span class="badge badge-ts">window.localStorage &amp; window.sessionStorage</span>
        </div>

        <div class="interactive-grid">
          <!-- Commandes -->
          <div class="actions-panel">
            <div class="inputs-row">
              <div class="input-cell">
                <label>Clé (String) :</label>
                <input type="text" [value]="inputKey()" (input)="inputKey.set($any($event.target).value)" placeholder="ex: theme, user_id" />
              </div>
              <div class="input-cell">
                <label>Valeur (String) :</label>
                <input type="text" [value]="inputVal()" (input)="inputVal.set($any($event.target).value)" placeholder="ex: sombre, 42" />
              </div>
            </div>

            <div class="buttons-grid">
              <button class="btn-primary" (click)="execSetItem()">
                <code>setItem(k, v)</code>
              </button>
              <button class="btn-secondary" (click)="execGetItem()">
                <code>getItem(k)</code>
              </button>
              <button class="btn-danger" (click)="execRemoveItem()">
                <code>removeItem(k)</code>
              </button>
              <button class="btn-secondary" (click)="execKey()">
                <code>key(index: {{ keyIndex() }})</code>
              </button>
              <button class="btn-secondary" (click)="execLength()">
                <code>length</code>
              </button>
              <button class="btn-danger" (click)="execClear()">
                <code>clear()</code>
              </button>
            </div>

            <!-- Sortie de la commande exécutée -->
            <div class="terminal-output-box">
              <div class="out-title">Sortie JavaScript native :</div>
              <pre class="out-content">{{ lastCommandLog() }}</pre>
            </div>
          </div>

          <!-- Inspecteur DevTools simulé -->
          <div class="storage-inspector">
            <div class="inspector-header">
              <span>Inspecteur DevTools (Application ➔ Storage)</span>
              <span class="badge badge-success">{{ tableEntries().length }} Clés · {{ totalBytes() }} octets</span>
            </div>

            <div class="table-container">
              <table class="storage-table">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Clé</th>
                    <th>Valeur brute (String)</th>
                    <th>Taille</th>
                  </tr>
                </thead>
                <tbody>
                  @for (entry of tableEntries(); track entry.key; let idx = $index) {
                    <tr>
                      <td class="idx-col">{{ idx }}</td>
                      <td class="key-col"><code>{{ entry.key }}</code></td>
                      <td class="val-col"><code>{{ entry.value }}</code></td>
                      <td class="size-col">{{ entry.bytes }} octets</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="empty-row">Le stockage est actuellement vide. Utilisez setItem() pour ajouter une clé.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2 : Le Laboratoire « Tout est Chaîne » (Le Bug Invisible) -->
      <div class="card-panel bugs-lab-panel">
        <div class="section-title-row">
          <div class="s-title">💣 Laboratoire « Tout est Chaîne » : Le Bug Invisible</div>
          <span class="badge badge-red">Anti-Patterns Fréquents</span>
        </div>

        <div class="pitfalls-grid">
          <!-- Piège 1 : Le Booléen "false" -->
          <div class="pitfall-card">
            <div class="card-head">
              <span class="p-num">Piège 01</span>
              <h4>Le Booléen "false" qui devient Truthy</h4>
            </div>

            <div class="code-compare">
              <div class="code-box bad">
                <div class="tag-row text-danger">❌ Code Naïf &amp; Défaillance :</div>
                <pre><code>localStorage.setItem('actif', false as any);
const val = localStorage.getItem('actif'); 
// val vaut "false" (chaîne non-vide !)

if (val) &#123;
  // 💣 S'exécute TOUJOURS !
  console.log("Accès accordé !");
&#125;</code></pre>
              </div>

              <div class="code-box good">
                <div class="tag-row text-success">✅ Remédiation Conforme :</div>
                <pre><code>// 1. Désérialiser avec JSON.parse()
const reel = JSON.parse(val ?? 'false');

// 2. Ou comparaison stricte
const estActif = val === 'true';

if (estActif) &#123; /* Bloqué correctement ✅ */ &#125;</code></pre>
              </div>
            </div>

            <button class="btn-secondary btn-sm test-btn" (click)="testBooleanTrap()">
              🧪 Tester l'évaluation JS : if ("false") ➔ Résultat : {{ booleanResult() }}
            </button>
          </div>

          <!-- Piège 2 : La Concaténation de Nombres -->
          <div class="pitfall-card">
            <div class="card-head">
              <span class="p-num">Piège 02</span>
              <h4>L'Incrémentation Textuelle : "0" + 1 = "01"</h4>
            </div>

            <div class="code-compare">
              <div class="code-box bad">
                <div class="tag-row text-danger">❌ Code Naïf &amp; Défaillance :</div>
                <pre><code>localStorage.setItem('score', 0 as any);
const score = localStorage.getItem('score'); // "0"

const total = score + 1;
// 👉 Résultat : "01" (Concaténation !)</code></pre>
              </div>

              <div class="code-box good">
                <div class="tag-row text-success">✅ Remédiation Conforme :</div>
                <pre><code>// Conversion numérique explicite obligatoire :
const brut = localStorage.getItem('score');
const score = Number(brut ?? 0);

const total = score + 1; // 1 ✅</code></pre>
              </div>
            </div>

            <button class="btn-secondary btn-sm test-btn" (click)="testNumberTrap()">
              🧪 Tester le calcul : score + 1 ➔ Naïf: {{ numberNaif() }} vs Réel: {{ numberReel() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .terminal-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .s-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .interactive-grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 16px;
    }

    .actions-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .inputs-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;

        .input-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;

          label {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-weight: 600;
          }

          input {
            width: 100%;
          }
        }
      }

      .buttons-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;

        button {
          padding: 8px;
          font-size: 0.8rem;
          font-family: var(--font-mono);
        }
      }

      .terminal-output-box {
        background: #060911;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 10px 12px;
        font-family: var(--font-mono);
        min-height: 80px;

        .out-title {
          font-size: 0.72rem;
          color: var(--text-dim);
          margin-bottom: 4px;
        }

        .out-content {
          font-size: 0.8rem;
          color: #34d399;
          white-space: pre-wrap;
          line-height: 1.4;
        }
      }
    }

    .storage-inspector {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .inspector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-subtle);
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-muted);
      }

      .table-container {
        flex: 1;
        overflow-y: auto;
        max-height: 280px;

        .storage-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          text-align: left;

          th {
            background: var(--bg-subtle);
            color: var(--text-dim);
            padding: 6px 12px;
            font-weight: 600;
            border-bottom: 1px solid var(--border-subtle);
          }

          td {
            padding: 8px 12px;
            border-bottom: 1px solid var(--border-subtle);
            color: var(--text-main);

            &.idx-col {
              color: var(--text-dim);
              width: 50px;
            }

            &.key-col code {
              color: var(--ts-blue-light);
              font-weight: 600;
            }

            &.val-col code {
              color: #34d399;
            }

            &.size-col {
              color: var(--text-muted);
              width: 90px;
              font-size: 0.75rem;
            }
          }

          .empty-row {
            text-align: center;
            color: var(--text-dim);
            padding: 24px 12px;
            font-style: italic;
          }
        }
      }
    }

    .bugs-lab-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .pitfalls-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        .pitfall-card {
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;

          .card-head {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .p-num {
              font-size: 0.7rem;
              font-weight: 700;
              color: #f87171;
              text-transform: uppercase;
            }

            h4 {
              font-size: 0.95rem;
              font-weight: 700;
              color: var(--text-main);
            }
          }

          .code-compare {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .code-box {
              border-radius: 6px;
              padding: 10px;
              font-size: 0.76rem;
              font-family: var(--font-mono);

              &.bad {
                background: rgba(221, 0, 49, 0.08);
                border: 1px solid rgba(221, 0, 49, 0.25);
              }

              &.good {
                background: rgba(16, 185, 129, 0.08);
                border: 1px solid rgba(16, 185, 129, 0.25);
              }

              .tag-row {
                font-size: 0.72rem;
                font-weight: 700;
                margin-bottom: 4px;
                font-family: var(--font-sans);

                &.text-danger { color: #f87171; }
                &.text-success { color: #34d399; }
              }

              pre code {
                line-height: 1.4;
              }
            }
          }

          .test-btn {
            align-self: flex-start;
          }
        }
      }
    }
  `]
})
export class StorageApiComponent {
  readonly inputKey = signal<string>('app_theme');
  readonly inputVal = signal<string>('sombre');
  readonly keyIndex = signal<number>(0);
  readonly lastCommandLog = signal<string>('Prêt. Cliquez sur un bouton pour exécuter une méthode Storage.');

  // Store interactif isolé
  private readonly store = signal<Map<string, string>>(new Map([
    ['app_theme', 'sombre'],
    ['auth_token', 'xyz_987'],
    ['visites', '1']
  ]));

  readonly tableEntries = computed<StorageEntry[]>(() => {
    const list: StorageEntry[] = [];
    for (const [k, v] of this.store().entries()) {
      list.push({
        key: k,
        value: v,
        bytes: (k.length + v.length) * 2 // UTF-16
      });
    }
    return list;
  });

  readonly totalBytes = computed(() => {
    return this.tableEntries().reduce((acc, curr) => acc + curr.bytes, 0);
  });

  // Tests pièges
  readonly booleanResult = signal<string>('Non exécuté (Cliquez sur Tester)');
  readonly numberNaif = signal<string>('"01"');
  readonly numberReel = signal<string>('1');

  execSetItem(): void {
    const k = this.inputKey().trim();
    const v = this.inputVal();
    if (!k) return;

    this.store.update(map => {
      const next = new Map(map);
      next.set(k, String(v));
      return next;
    });

    this.lastCommandLog.set(`localStorage.setItem("${k}", "${v}")\n➔ Retour : undefined (Valeur persistée avec succès)`);
  }

  execGetItem(): void {
    const k = this.inputKey().trim();
    const val = this.store().get(k) ?? null;
    this.lastCommandLog.set(
      `localStorage.getItem("${k}")\n➔ Type retourné : ${val === null ? 'object (null)' : 'string'}\n➔ Valeur : ${JSON.stringify(val)}`
    );
  }

  execRemoveItem(): void {
    const k = this.inputKey().trim();
    this.store.update(map => {
      const next = new Map(map);
      next.delete(k);
      return next;
    });
    this.lastCommandLog.set(`localStorage.removeItem("${k}")\n➔ Retour : undefined (Clé supprimée si elle existait)`);
  }

  execKey(): void {
    const keys = Array.from(this.store().keys());
    const idx = this.keyIndex();
    const result = keys[idx] ?? null;
    this.lastCommandLog.set(`localStorage.key(${idx})\n➔ Clé à l'index ${idx} : ${JSON.stringify(result)}`);
  }

  execLength(): void {
    const len = this.store().size;
    this.lastCommandLog.set(`localStorage.length\n➔ Total d'éléments : ${len}`);
  }

  execClear(): void {
    this.store.set(new Map());
    this.lastCommandLog.set(`localStorage.clear()\n➔ TOUT le stockage du domaine a été vidé !`);
  }

  testBooleanTrap(): void {
    const strVal = 'false';
    const isTruthy = Boolean(strVal);
    this.booleanResult.set(isTruthy ? 'TRUTHY 💣 (Boolean("false") === true !)' : 'Falsy');
  }

  testNumberTrap(): void {
    const strVal = '0';
    this.numberNaif.set(`"${strVal + 1}"`);
    this.numberReel.set(`${Number(strVal) + 1}`);
  }
}
