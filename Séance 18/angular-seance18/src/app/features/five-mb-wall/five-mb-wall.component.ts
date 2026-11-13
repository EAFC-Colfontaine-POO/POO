import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-five-mb-wall',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 07 · LIMITES PHYSIQUES &amp; PONT VERS LA SÉANCE 19</div>
        <h2>Le Mur des 5 Mo &amp; L'Éveil à la Vraie Base de Données</h2>
        <p class="module-desc">
          Comprenez les 3 limites physiques infranchissables de <code>LocalStorage</code> et pourquoi
          le développement d'applications web professionnelles exige une vraie base de données client :
          <strong>IndexedDB &amp; Dexie.js (Séance 19)</strong>.
        </p>
      </div>

      <!-- Les 3 Murs Physiques -->
      <div class="walls-grid">
        <div class="wall-card card-panel wall-1">
          <div class="wall-badge">MUR N°1</div>
          <div class="wall-icon">🧱</div>
          <h3 class="wall-title">Le Plafond des 5 Mo</h3>
          <p class="wall-desc">
            Une seule photo haute résolution prise avec un smartphone pèse 3 à 5 Mo.
            Un historique d'achats ou un cache hors-ligne dépasse rapidement le seuil :
            le navigateur déclenche impitoyablement <code>QuotaExceededError</code>.
          </p>
          <div class="wall-footer">
            <span>Ordre de grandeur :</span>
            <strong>~5 Mo par domaine</strong>
          </div>
        </div>

        <div class="wall-card card-panel wall-2">
          <div class="wall-badge">MUR N°2</div>
          <div class="wall-icon">🧊</div>
          <h3 class="wall-title">Le Gel Synchrone de l'Event Loop</h3>
          <p class="wall-desc">
            Chaque <code>setItem()</code> et <code>getItem()</code> s'exécute sur le <strong>thread principal</strong>.
            Sérialiser 10 000 objets fige l'écran pendant 50 à 200 ms : animations saccadées, clics ignorés et sensation de lourdeur.
          </p>
          <div class="wall-footer">
            <span>Impact UX :</span>
            <strong>Chute à 0 FPS pendant l'I/O</strong>
          </div>
        </div>

        <div class="wall-card card-panel wall-3">
          <div class="wall-badge">MUR N°3</div>
          <div class="wall-icon">🔍</div>
          <h3 class="wall-title">Zéro Requête, Zéro Index</h3>
          <p class="wall-desc">
            LocalStorage est <strong>aveugle</strong> : pour modifier le prix d'un seul article parmi 5 000,
            il faut <em>tout lire</em>, <em>tout parser en RAM</em>, filtrer... puis <em>tout réécrire</em> sur disque !
          </p>
          <div class="wall-footer">
            <span>Complexité :</span>
            <strong>O(N) obligatoire à chaque mise à jour</strong>
          </div>
        </div>
      </div>

      <!-- Comparatif LocalStorage vs IndexedDB (Dexie.js) -->
      <div class="card-panel comparison-panel">
        <div class="comparison-header">
          <div class="comp-tag">PONT CONCEPTUEL VERS LA SÉANCE 19</div>
          <h3>La Réponse Professionnelle : LocalStorage vs IndexedDB / Dexie.js</h3>
        </div>

        <div class="table-wrapper">
          <table class="comp-table">
            <thead>
              <tr>
                <th>Critère Architectural</th>
                <th>🗄️ LocalStorage (Séance 18)</th>
                <th>🚀 IndexedDB &amp; Dexie.js (Séance 19)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Capacité de Stockage</strong></td>
                <td>Plafonné à ~5 Mo par origine</td>
                <td><strong class="text-success">Des Gigaoctets</strong> (jusqu'à 60% du disque libre)</td>
              </tr>
              <tr>
                <td><strong>Modèle d'Exécution</strong></td>
                <td><span class="text-danger">100% Synchrone</span> (bloque l'UI)</td>
                <td><strong class="text-success">100% Asynchrone</strong> (Promises &amp; Web Workers)</td>
              </tr>
              <tr>
                <td><strong>Indexation &amp; Requêtes</strong></td>
                <td>Zéro index (Scan linéaire en RAM)</td>
                <td><strong class="text-success">Multi-index B-Tree</strong> (recherche instantanée par date, statut, etc.)</td>
              </tr>
              <tr>
                <td><strong>Transactions &amp; Sécurité</strong></td>
                <td>Aucune transaction (corruption si coupure)</td>
                <td><strong class="text-success">Transactions ACID</strong> avec Rollback automatique</td>
              </tr>
              <tr>
                <td><strong>Typage de Données</strong></td>
                <td>Chaîne de caractères brute uniquement</td>
                <td>Objets typés natifs, Blob, File, ArrayBuffer</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Teaser interactif de code Dexie.js -->
        <div class="dexie-teaser-box">
          <div class="teaser-head">
            <span class="badge badge-purple">Avant-goût Séance 19 · Dexie.js</span>
            <h4>À quoi ressemblera votre code POO à la Séance 19 ?</h4>
          </div>

          <pre><code>import Dexie, &#123; type Table &#125; from 'dexie';

// 1. Déclaration de la base avec indexation B-Tree :
export class BibliothequeDB extends Dexie &#123;
  livres!: Table&lt;LivreDTO, number&gt;;

  constructor() &#123;
    super('BibliothequePOO');
    this.version(1).stores(&#123;
      livres: '++id, isbn, auteur, anneePublication' // Index ultra-rapides !
    &#125;);
  &#125;
&#125;

// 2. Requête asynchrone non-bloquante avec index :
const db = new BibliothequeDB();
const livresRecents = await db.livres
  .where('anneePublication')
  .above(2024)
  .toArray(); // Exécuté sans bloquer un seul frame de l'Event Loop ! ⚡</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .walls-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      .wall-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
        overflow: hidden;

        &.wall-1 { border-top: 4px solid #ef4444; }
        &.wall-2 { border-top: 4px solid #f59e0b; }
        &.wall-3 { border-top: 4px solid #9333ea; }

        .wall-badge {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .wall-icon {
          font-size: 2.2rem;
        }

        .wall-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .wall-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          flex: 1;
        }

        .wall-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.75rem;

          span { color: var(--text-dim); }
          strong { color: var(--text-main); }
        }
      }
    }

    .comparison-panel {
      display: flex;
      flex-direction: column;
      gap: 18px;

      .comparison-header {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .comp-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--ts-blue-light);
          text-transform: uppercase;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }
      }

      .table-wrapper {
        overflow-x: auto;

        .comp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;

          th {
            background: var(--bg-subtle);
            padding: 10px 14px;
            text-align: left;
            border-bottom: 2px solid var(--border-color);
            color: var(--text-main);
            font-weight: 700;
          }

          td {
            padding: 10px 14px;
            border-bottom: 1px solid var(--border-subtle);
            color: var(--text-muted);

            strong {
              color: var(--text-main);
            }

            .text-success { color: #34d399; }
            .text-danger { color: #f87171; }
          }
        }
      }

      .dexie-teaser-box {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .teaser-head {
          display: flex;
          flex-direction: column;
          gap: 4px;

          h4 {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-main);
          }
        }

        pre {
          background: var(--bg-code);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 14px;
          font-size: 0.8rem;
          line-height: 1.45;
          overflow-x: auto;
        }
      }
    }
  `]
})
export class FiveMbWallComponent {}
