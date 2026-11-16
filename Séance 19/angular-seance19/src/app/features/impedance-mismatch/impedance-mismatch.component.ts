import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import Dexie, { Table } from 'dexie';

interface LigneCommande {
  article: string;
  quantite: number;
  prixUnitaire: number;
}

interface CommandeDTO {
  id: string;
  client: string;
  dateISO: string;
  lignes: LigneCommande[];
  tags: string[];
}

@Component({
  selector: 'app-impedance-mismatch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 01 · LES FONDATIONS DU STOCKAGE MODERNE</div>
        <h2>IndexedDB &amp; Le Gouffre Objet-Relationnel (Impedance Mismatch)</h2>
        <p class="module-desc">
          Pourquoi LocalStorage ne suffit plus pour les applications d'entreprise (5 Mo, synchrone bloquant, texte brut),
          comment IndexedDB franchit ces trois murs, et pourquoi le modèle NoSQL réconcilie nos objets vivants avec le disque dur.
        </p>
      </div>

      <!-- Comparateur des 3 Murs : LocalStorage vs IndexedDB -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">⚔️ Face-à-Face : Les 3 Murs de LocalStorage vs la Réponse IndexedDB</div>
          <span class="badge badge-ts">Architecture</span>
        </div>

        <div class="comparison-grid">
          <div class="comp-col localstorage-col">
            <div class="col-header">
              <div class="badge badge-red">LocalStorage (S18)</div>
              <h3>Le Placard Clé-Valeur Primitif</h3>
            </div>
            <ul class="crit-list">
              <li>
                <span class="crit-label">Capacité :</span>
                <span class="crit-val text-danger">~5 Mo par origine</span>
                <p class="crit-desc">Le moindre catalogue ou historique sature en quelques clics.</p>
              </li>
              <li>
                <span class="crit-label">Concurrence :</span>
                <span class="crit-val text-danger">Synchrone (Bloquant)</span>
                <p class="crit-desc">Chaque écriture ou sérialisation JSON gèle l'Event Loop et fait chuter les FPS.</p>
              </li>
              <li>
                <span class="crit-label">Données :</span>
                <span class="crit-val text-danger">Chaîne de caractères brute</span>
                <p class="crit-desc">Requiert JSON.stringify() / parse(), perte totale des prototypes et types.</p>
              </li>
              <li>
                <span class="crit-label">Requêtage :</span>
                <span class="crit-val text-danger">Zéro index, zéro filtre</span>
                <p class="crit-desc">Recherche en O(n) obligatoire : tout charger en mémoire pour filtrer manuellement.</p>
              </li>
            </ul>
          </div>

          <div class="comp-col indexeddb-col">
            <div class="col-header">
              <div class="badge badge-success">IndexedDB + Dexie.js (S19)</div>
              <h3>La Vraie Base de Données du Navigateur</h3>
            </div>
            <ul class="crit-list">
              <li>
                <span class="crit-label">Capacité :</span>
                <span class="crit-val text-success">Gigaoctets (Quota navigateur)</span>
                <p class="crit-desc">Peut stocker des dizaines de milliers d'enregistrements, images et fichiers.</p>
              </li>
              <li>
                <span class="crit-label">Concurrence :</span>
                <span class="crit-val text-success">100% Asynchrone (Promises)</span>
                <p class="crit-desc">Les écritures et lectures s'exécutent en arrière-plan sans aucun gel de l'UI.</p>
              </li>
              <li>
                <span class="crit-label">Données :</span>
                <span class="crit-val text-success">Structured Clone (Objets natifs)</span>
                <p class="crit-desc">Préserve les Dates, Arrays, Maps, Blobs sans passer par une chaîne JSON.</p>
              </li>
              <li>
                <span class="crit-label">Requêtage :</span>
                <span class="crit-val text-success">Index B-Tree puissants en O(log n)</span>
                <p class="crit-desc">Recherche par préfixe, intervalles, index uniques, multi-entry et composés.</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Simulateur de test comparatif -->
        <div class="live-action-bar">
          <div class="action-info">
            <span class="info-icon">⚡</span>
            <span>Testez l'écriture en direct de 1 000 objets riches (Commandes avec lignes et tags) :</span>
          </div>
          <div class="action-buttons">
            <button class="btn-primary" (click)="testerIndexedDb()" [disabled]="isRunningIdb()">
              {{ isRunningIdb() ? 'Écriture en cours...' : 'Tester IndexedDB (Dexie)' }}
            </button>
          </div>
        </div>

        @if (idbBenchmark()) {
          <div class="benchmark-result">
            <div class="bench-badge">IndexedDB ✅</div>
            <div>{{ idbBenchmark() }}</div>
          </div>
        }
      </div>

      <!-- Animateur "La Voiture Découpée" (Le Gouffre Objet-Relationnel) -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">🚗 L'Animateur « La Voiture Découpée » (Impedance Mismatch)</div>
          <span class="badge badge-purple">Modèle NoSQL vs SQL</span>
        </div>

        <p class="p-lead">
          En programmation orientée objet, une <code>Commande</code> forme un tout cohérent : elle possède un client,
          un tableau de lignes d'articles et des tags. Voyez la différence entre le modèle relationnel classique et le stockage NoSQL IndexedDB.
        </p>

        <div class="car-comparison-grid">
          <!-- SQL : Découper la voiture -->
          <div class="car-card sql-card" [class.highlighted]="modeVoiture() === 'sql'">
            <div class="car-card-header">
              <span class="tag-model">MODÈLE RELATIONNEL (SQL)</span>
              <h4>Démonter la voiture en pièces détachées</h4>
            </div>
            <div class="car-visu">
              <div class="visu-box">
                <div class="table-slice">📦 Table <code>commandes</code> (id, client, date)</div>
                <div class="join-arrow">⬇ FOREIGN KEY</div>
                <div class="table-slice">📦 Table <code>lignes_commande</code> (id, commande_id, article, qte, prix)</div>
                <div class="join-arrow">⬇ FOREIGN KEY</div>
                <div class="table-slice">📦 Table <code>tags_commande</code> (commande_id, tag)</div>
              </div>
            </div>
            <div class="car-desc">
              💥 <strong>Le drame du JOIN :</strong> Pour sauver une commande, il faut 3 requêtes <code>INSERT</code>.
              Pour la relire, il faut une jointure complexe <code>JOIN</code> qui multiplie les lignes en mémoire.
            </div>
          </div>

          <!-- NoSQL IndexedDB : Garer la voiture intacte -->
          <div class="car-card nosql-card" [class.highlighted]="modeVoiture() === 'nosql'">
            <div class="car-card-header">
              <span class="tag-model success">MODÈLE DOCUMENT (INDEXEDDB)</span>
              <h4>Garer la voiture intacte dans le garage</h4>
            </div>
            <div class="car-visu">
              <div class="visu-box single-box">
                <div class="doc-preview">
                  <pre><code>&#123;
  id: "cmd-901",
  client: "Alice",
  lignes: [
    &#123; article: "PC Portable", qte: 1, prix: 1200 &#125;,
    &#123; article: "Souris Sans Fil", qte: 2, prix: 35 &#125;
  ],
  tags: ["VIP", "Livraison-Express"]
&#125;</code></pre>
                </div>
              </div>
            </div>
            <div class="car-desc">
              💎 <strong>Structured Clone :</strong> L'objet métier est enregistré <strong>en une seule fois</strong> sans être découpé.
              Lors de la lecture, l'objet ressort intact avec ses sous-tableaux sans aucune jointure !
            </div>
          </div>
        </div>

        <div class="car-toggle-bar">
          <button class="btn-ghost" (click)="toggleVoiture('sql')">Voir la vision SQL</button>
          <button class="btn-ghost" (click)="toggleVoiture('nosql')">Voir la vision IndexedDB</button>
        </div>
      </div>

      <!-- Comparateur de code : Callback Hell natif vs Dexie.js -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">📜 Comparateur de Code : IndexedDB Natif vs Dexie.js</div>
          <span class="badge badge-warning">Productivité &amp; Typage</span>
        </div>

        <div class="code-diff-grid">
          <!-- Côté Gauche : API Native IndexedDB -->
          <div class="code-col native-code">
            <div class="code-col-header">
              <span class="dot-red"></span>
              <span>IndexedDB Natif (40 lignes d'événements verbeux)</span>
            </div>
            <pre class="code-scroll"><code>// 1. Ouverture avec gestion manuelle de version
const req = indexedDB.open("BoutiqueDB", 1);

req.onupgradeneeded = (e) => &#123;
  const db = req.result;
  if (!db.objectStoreNames.contains("articles")) &#123;
    const store = db.createObjectStore("articles", &#123; keyPath: "id" &#125;);
    store.createIndex("titre", "titre", &#123; unique: false &#125;);
  &#125;
&#125;;

req.onsuccess = () => &#123;
  const db = req.result;
  // 2. Transaction manuelle
  const tx = db.transaction("articles", "readwrite");
  const store = tx.objectStore("articles");

  // 3. Callback d'ajout
  const addReq = store.add(&#123; id: "1", titre: "Livre" &#125;);
  addReq.onsuccess = () => &#123;
    // 4. Callback de lecture
    const getReq = store.get("1");
    getReq.onsuccess = () => console.log(getReq.result);
    getReq.onerror = (err) => console.error(err);
  &#125;;
  addReq.onerror = (err) => console.error(err);
&#125;;
req.onerror = (err) => console.error(err);</code></pre>
          </div>

          <!-- Côté Droit : Dexie.js -->
          <div class="code-col dexie-code">
            <div class="code-col-header">
              <span class="dot-green"></span>
              <span>Dexie.js 4+ (4 lignes élégantes, typées et async/await)</span>
            </div>
            <pre class="code-scroll"><code>// 1. Déclaration de classe typée avec Dexie
class BoutiqueDB extends Dexie &#123;
  articles!: Table&lt;ArticleDTO, string&gt;;
  constructor() &#123;
    super("BoutiqueDB");
    this.version(1).stores(&#123; articles: "id, titre" &#125;);
  &#125;
&#125;

// 2. Utilisation fluide avec async/await pur :
const db = new BoutiqueDB();
await db.articles.add(&#123; id: "1", titre: "Livre" &#125;);
const article = await db.articles.get("1");
console.log(article?.titre);</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .comp-col {
      padding: 16px;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);

      &.localstorage-col {
        border-top: 3px solid #ef4444;
      }
      &.indexeddb-col {
        border-top: 3px solid #10b981;
      }

      .col-header {
        margin-bottom: 12px;
        h3 {
          font-size: 1.05rem;
          margin-top: 6px;
        }
      }
    }

    .crit-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;

      li {
        font-size: 0.85rem;
      }

      .crit-label {
        font-weight: 700;
        margin-right: 6px;
      }

      .crit-desc {
        color: var(--text-muted);
        font-size: 0.78rem;
        margin-top: 2px;
      }
    }

    .live-action-bar {
      margin-top: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;

      .action-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
      }
    }

    .benchmark-result {
      margin-top: 12px;
      padding: 10px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 6px;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 10px;

      .bench-badge {
        font-weight: 700;
        color: #10b981;
      }
    }

    .car-comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .car-card {
      padding: 16px;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      transition: all 0.25s;

      &.highlighted {
        border-color: #3b82f6;
        box-shadow: 0 0 16px rgba(59, 130, 246, 0.2);
      }

      .car-card-header {
        margin-bottom: 12px;
        .tag-model {
          font-size: 0.7rem;
          font-weight: 700;
          color: #f59e0b;
          &.success {
            color: #10b981;
          }
        }
        h4 {
          font-size: 0.95rem;
          margin-top: 4px;
        }
      }

      .car-visu {
        margin: 12px 0;
        background: var(--bg-code);
        padding: 12px;
        border-radius: 6px;
        border: 1px solid var(--border-color);

        .visu-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .table-slice {
          padding: 6px 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #fca5a5;
        }

        .join-arrow {
          font-size: 0.68rem;
          text-align: center;
          color: var(--text-dim);
          font-weight: 700;
        }

        .single-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 4px;
          padding: 8px;
        }

        .doc-preview pre {
          font-size: 0.72rem;
          color: #86efac;
          line-height: 1.3;
        }
      }

      .car-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .car-toggle-bar {
      display: flex;
      gap: 10px;
      margin-top: 14px;
    }

    .code-diff-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;

      .code-col {
        border-radius: 8px;
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        overflow: hidden;

        .code-col-header {
          padding: 8px 12px;
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--border-color);
          font-size: 0.78rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;

          .dot-red {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ef4444;
          }
          .dot-green {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
          }
        }

        .code-scroll {
          padding: 12px;
          font-size: 0.75rem;
          overflow-x: auto;
          line-height: 1.4;
        }
      }
    }

    .text-danger { color: #f87171; }
    .text-success { color: #34d399; }
  `]
})
export class ImpedanceMismatchComponent {
  readonly isRunningIdb = signal<boolean>(false);
  readonly idbBenchmark = signal<string | null>(null);
  readonly modeVoiture = signal<'sql' | 'nosql'>('nosql');

  toggleVoiture(mode: 'sql' | 'nosql'): void {
    this.modeVoiture.set(mode);
  }

  async testerIndexedDb(): Promise<void> {
    this.isRunningIdb.set(true);
    const start = performance.now();

    try {
      const dbName = `BenchDB_${crypto.randomUUID()}`;
      const db = new Dexie(dbName);
      db.version(1).stores({ commandes: 'id, client, dateISO' });
      await db.open();

      const items: CommandeDTO[] = [];
      for (let i = 0; i < 1000; i++) {
        items.push({
          id: `cmd-${i}`,
          client: `Client-${i % 50}`,
          dateISO: new Date().toISOString(),
          lignes: [
            { article: 'Article A', quantite: 2, prixUnitaire: 25 },
            { article: 'Article B', quantite: 1, prixUnitaire: 140 }
          ],
          tags: ['Web', 'IndexedDB', 'S19']
        });
      }

      await db.table('commandes').bulkAdd(items);
      const count = await db.table('commandes').count();
      const duration = (performance.now() - start).toFixed(1);

      this.idbBenchmark.set(
        `${count} commandes riches insérées avec sous-tableaux en ${duration} ms sans bloquer l'Event Loop !`
      );

      await db.delete();
    } catch (err: any) {
      this.idbBenchmark.set(`Erreur : ${err.message}`);
    } finally {
      this.isRunningIdb.set(false);
    }
  }
}
