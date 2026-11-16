import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import Dexie from 'dexie';

@Component({
  selector: 'app-btree-indexes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 03 · INDEXATION AVANCÉE &amp; ARBRES B-TREE</div>
        <h2>Indexation Avancée &amp; Arbres B-Tree (&amp;, *, [a+b])</h2>
        <p class="module-desc">
          Comprendre la puissance algorithmique de l'arbre B-Tree ($O(\\log n)$ vs $O(n)$) et maîtriser les trois index spéciaux
          de Dexie.js : l'index unique <code>&amp;</code>, l'index multi-entry <code>*</code> pour les tableaux,
          et l'index composé <code>[a+b]</code> pour les paires de critères.
        </p>
      </div>

      <!-- Visualiseur de complexité O(n) vs O(log n) -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">⚡ Visualiseur de Complexité : Balayage Séquentiel vs Arbre B-Tree</div>
          <span class="badge badge-ts">50 000 Enregistrements</span>
        </div>

        <p class="p-lead">
          Imaginez une table de 50 000 dossiers médicaux ou factures. Lancez la recherche pour comparer le nombre d'opérations :
        </p>

        <div class="complexity-grid">
          <div class="comp-card linear-card">
            <div class="comp-header">
              <span class="badge badge-red">Sans Index · O(n)</span>
              <h4>Balayage Séquentiel (Table Scan)</h4>
            </div>
            <div class="comp-metric">
              <span class="m-val text-danger">50 000</span>
              <span class="m-unit">lectures disque</span>
            </div>
            <p class="comp-desc">
              IndexedDB doit charger un par un les 50 000 documents depuis le disque vers la RAM pour tester chaque condition.
            </p>
            <div class="visu-bar-track">
              <div class="visu-bar-fill red" style="width: 100%;"></div>
            </div>
          </div>

          <div class="comp-card btree-card">
            <div class="comp-header">
              <span class="badge badge-success">Avec Index B-Tree · O(log n)</span>
              <h4>Recherche Binaire dans l'Arbre</h4>
            </div>
            <div class="comp-metric">
              <span class="m-val text-success">16</span>
              <span class="m-unit">sauts de nœuds</span>
            </div>
            <p class="comp-desc">
              À chaque niveau de l'arbre B-Tree, la moitié du jeu de données est éliminée : 2¹⁶ = 65 536 &gt; 50 000.
            </p>
            <div class="visu-bar-track">
              <div class="visu-bar-fill green" style="width: 3%;"></div>
            </div>
          </div>
        </div>

        <div class="b-tree-diagram">
          <div class="diag-title">Illustration de la descente dans l'Arbre B-Tree :</div>
          <div class="tree-nodes">
            <div class="tree-level">
              <span class="tree-node root">[Racine : M]</span>
            </div>
            <div class="tree-branches">
              <div class="tree-branch">↙ (A à L)</div>
              <div class="tree-branch">↘ (N à Z)</div>
            </div>
            <div class="tree-level">
              <span class="tree-node leaf">[Feuilles : A..D]</span>
              <span class="tree-node leaf">[Feuilles : E..H]</span>
              <span class="tree-node leaf active">[Feuilles : H..L 🎯 Cible trouvée en 1 ms !]</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Les 3 Index Spéciaux de Dexie.js -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">💎 Les 3 Index Spéciaux : Unique (&amp;), Multi-Entry (*) &amp; Composé ([a+b])</div>
          <span class="badge badge-purple">Syntaxe Dexie 4+</span>
        </div>

        <div class="index-cards-grid">
          <!-- 1. Index Unique -->
          <div class="special-idx-card">
            <div class="idx-header">
              <span class="idx-symbol">&amp;</span>
              <div class="idx-title-box">
                <h4>Index Unique (<code>&amp;isbn</code>, <code>&amp;email</code>)</h4>
                <span class="badge badge-red">ConstraintError</span>
              </div>
            </div>
            <p class="idx-text">
              Interdit physiquement deux enregistrements ayant la même valeur. Tentez d'insérer un doublon :
            </p>
            <div class="interactive-sandbox">
              <button class="btn-sm btn-primary" (click)="testerIndexUnique()" [disabled]="isRunningUnique()">
                Tenter d'insérer un ISBN dupliqué
              </button>
              @if (logUnique()) {
                <div class="terminal-mini" [class.error]="isErrorUnique()">
                  <code>{{ logUnique() }}</code>
                </div>
              }
            </div>
          </div>

          <!-- 2. Index Multi-Entry -->
          <div class="special-idx-card">
            <div class="idx-header">
              <span class="idx-symbol">*</span>
              <div class="idx-title-box">
                <h4>Index Multi-Entry (<code>*genres</code>, <code>*tags</code>)</h4>
                <span class="badge badge-success">Éclatement de Tableau</span>
              </div>
            </div>
            <p class="idx-text">
              Éclate automatiquement chaque élément d'un tableau en entrée d'index distincte dans l'arbre :
            </p>
            <div class="array-explosion-box">
              <div class="arr-source"><code>genres: ["SF", "Roman", "Espace"]</code></div>
              <div class="arr-arrows">⬇ Éclatement en 3 entrées B-Tree :</div>
              <div class="arr-tokens">
                <span class="token">B-Tree ➔ "SF"</span>
                <span class="token">B-Tree ➔ "Roman"</span>
                <span class="token">B-Tree ➔ "Espace"</span>
              </div>
            </div>
            <div class="query-demo">
              <code>.where('genres').equals('SF').toArray()</code> ➔ <strong>Instant O(log n)</strong>
            </div>
          </div>

          <!-- 3. Index Composé -->
          <div class="special-idx-card">
            <div class="idx-header">
              <span class="idx-symbol">[a+b]</span>
              <div class="idx-title-box">
                <h4>Index Composé (<code>[statut+priorite]</code>)</h4>
                <span class="badge badge-warning">Clé Composite</span>
              </div>
            </div>
            <p class="idx-text">
              Combine deux propriétés en une seule clé binaire pour accélérer les requêtes combinées très fréquentes :
            </p>
            <div class="composite-box">
              <div class="comp-pair">
                <span>Paire indexée :</span>
                <code>['EN_COURS', 'HAUTE']</code>
              </div>
              <div class="comp-query">
                <pre><code>.where('[statut+priorite]')
.equals(['EN_COURS', 'HAUTE'])
.toArray()</code></pre>
              </div>
            </div>
            <div class="query-demo">
              Zéro filtrage mémoire : les deux critères sont élagués ensemble dès le premier saut B-Tree.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .complexity-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .comp-card {
      padding: 16px;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);

      &.linear-card { border-top: 3px solid #ef4444; }
      &.btree-card { border-top: 3px solid #10b981; }

      .comp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        h4 { font-size: 0.95rem; }
      }

      .comp-metric {
        margin: 10px 0;
        display: flex;
        align-items: baseline;
        gap: 8px;

        .m-val {
          font-size: 2.2rem;
          font-weight: 800;
          font-family: var(--font-mono);
          line-height: 1;
        }
        .m-unit {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
      }

      .comp-desc {
        font-size: 0.78rem;
        color: var(--text-dim);
        line-height: 1.4;
      }
    }

    .visu-bar-track {
      height: 6px;
      background: var(--bg-subtle);
      border-radius: 3px;
      margin-top: 12px;
      overflow: hidden;

      .visu-bar-fill {
        height: 100%;
        &.red { background: #ef4444; }
        &.green { background: #10b981; }
      }
    }

    .b-tree-diagram {
      margin-top: 18px;
      padding: 14px;
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      text-align: center;

      .diag-title {
        font-size: 0.78rem;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .tree-nodes {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .tree-level {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .tree-branches {
          display: flex;
          gap: 60px;
          font-size: 0.75rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        .tree-node {
          padding: 6px 12px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #93c5fd;

          &.active {
            background: rgba(16, 185, 129, 0.15);
            border-color: #10b981;
            color: #6ee7b7;
            font-weight: 700;
          }
        }
      }
    }

    .index-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 14px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .special-idx-card {
      padding: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      flex-direction: column;

      .idx-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        .idx-symbol {
          width: 36px;
          height: 36px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 1.1rem;
          color: #60a5fa;
        }

        .idx-title-box {
          h4 { font-size: 0.88rem; }
        }
      }

      .idx-text {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.35;
        margin-bottom: 12px;
      }

      .interactive-sandbox {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .terminal-mini {
          padding: 8px;
          background: var(--bg-code);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: #94a3b8;

          &.error {
            border-color: rgba(239, 68, 68, 0.4);
            color: #fca5a5;
            background: rgba(239, 68, 68, 0.08);
          }
        }
      }

      .array-explosion-box {
        background: var(--bg-code);
        padding: 10px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        margin-bottom: 10px;
        font-size: 0.75rem;

        .arr-arrows {
          margin: 6px 0;
          color: var(--text-dim);
          font-size: 0.7rem;
        }

        .arr-tokens {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;

          .token {
            padding: 2px 6px;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #86efac;
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 0.68rem;
          }
        }
      }

      .composite-box {
        background: var(--bg-code);
        padding: 10px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        margin-bottom: 10px;
        font-size: 0.75rem;

        .comp-pair {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          code { color: #f59e0b; }
        }

        .comp-query pre code {
          font-size: 0.7rem;
          color: #93c5fd;
        }
      }

      .query-demo {
        font-size: 0.72rem;
        color: var(--text-dim);
        code { color: #60a5fa; font-weight: 600; }
      }
    }
  `]
})
export class BtreeIndexesComponent {
  readonly isRunningUnique = signal<boolean>(false);
  readonly logUnique = signal<string | null>(null);
  readonly isErrorUnique = signal<boolean>(false);

  async testerIndexUnique(): Promise<void> {
    this.isRunningUnique.set(true);
    const dbName = `UniqueDB_${crypto.randomUUID()}`;
    const db = new Dexie(dbName);
    db.version(1).stores({ livres: 'id, &isbn, titre' });

    try {
      await db.open();
      await db.table('livres').add({ id: '1', isbn: '978-2070368228', titre: 'Livre Initial' });

      // Tentative d'insertion du même ISBN
      await db.table('livres').add({ id: '2', isbn: '978-2070368228', titre: 'Doublon Refusé' });

      this.logUnique.set('Erreur : le doublon aurait dû être rejeté !');
      this.isErrorUnique.set(false);
    } catch (err: any) {
      if (err instanceof Dexie.ConstraintError || err.name === 'ConstraintError') {
        this.logUnique.set(`🛑 Dexie.ConstraintError capturée : Doublon de clé &isbn intercepté !`);
        this.isErrorUnique.set(true);
      } else {
        this.logUnique.set(`Erreur inattendue : ${err.message}`);
        this.isErrorUnique.set(true);
      }
    } finally {
      await db.delete();
      this.isRunningUnique.set(false);
    }
  }
}
