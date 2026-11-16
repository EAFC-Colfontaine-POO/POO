import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface AntiPatternItem {
  id: number;
  title: string;
  badge: string;
  buggyCode: string;
  consequence: string;
  fixedCode: string;
  rationale: string;
}

@Component({
  selector: 'app-anti-patterns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 07 · DIAGNOSTIC &amp; QUALITÉ LOGICIELLE</div>
        <h2>Pièges Fréquents &amp; Les 5 Anti-Patterns Dexie.js</h2>
        <p class="module-desc">
          Les 5 erreurs classiques commises par les développeurs venant du monde SQL ou de LocalStorage,
          leurs conséquences dévastatrices à l'exécution et leurs correctifs d'ingénierie logicielle.
        </p>
      </div>

      <!-- Sélecteur d'anti-pattern -->
      <div class="card-panel">
        <div class="pills-bar">
          @for (item of antiPatterns; track item.id) {
            <button 
              class="pattern-pill" 
              [class.active]="selectedId() === item.id"
              (click)="selectPattern(item.id)"
            >
              <span class="p-num">0{{ item.id }}.</span>
              <span class="p-title">{{ item.title }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Fiche Diagnostic Détaillée -->
      <div class="card-panel pattern-detail-panel">
        <div class="detail-header">
          <div class="badges-row">
            <span class="badge badge-ts">Anti-Pattern 0{{ activePattern().id }}</span>
            <span class="badge badge-red">{{ activePattern().badge }}</span>
          </div>
          <h3>{{ activePattern().title }}</h3>
        </div>

        <div class="before-after-grid">
          <!-- Côté Gauche : Code Bogué -->
          <div class="diag-col bad-col">
            <div class="col-bar">
              <span class="dot-red"></span>
              <span>❌ Code Bogué (Anti-Pattern)</span>
            </div>
            <pre class="code-box"><code>{{ activePattern().buggyCode }}</code></pre>
            <div class="impact-box">
              <div class="impact-title">💥 Conséquence Runtime :</div>
              <p>{{ activePattern().consequence }}</p>
            </div>
          </div>

          <!-- Côté Droit : Correctif -->
          <div class="diag-col good-col">
            <div class="col-bar">
              <span class="dot-green"></span>
              <span>✅ Correctif d'Ingénierie (Recommandé)</span>
            </div>
            <pre class="code-box"><code>{{ activePattern().fixedCode }}</code></pre>
            <div class="rationale-box">
              <div class="rat-title">🛡️ Pourquoi c'est solide :</div>
              <p>{{ activePattern().rationale }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pills-bar {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 0;

      .pattern-pill {
        padding: 8px 14px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.8rem;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;

        .p-num {
          font-weight: 800;
          color: #60a5fa;
          font-family: var(--font-mono);
        }

        &:hover {
          background: var(--bg-subtle);
          color: var(--text-main);
        }

        &.active {
          background: rgba(49, 120, 198, 0.2);
          border-color: #3b82f6;
          color: #93c5fd;
          font-weight: 600;
        }
      }
    }

    .pattern-detail-panel {
      margin-top: 14px;

      .detail-header {
        margin-bottom: 14px;
        h3 {
          font-size: 1.15rem;
          margin-top: 6px;
        }
      }
    }

    .before-after-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .diag-col {
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      overflow: hidden;
      display: flex;
      flex-direction: column;

      &.bad-col { border-top: 3px solid #ef4444; }
      &.good-col { border-top: 3px solid #10b981; }

      .col-bar {
        padding: 8px 12px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;

        .dot-red { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
        .dot-green { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
      }

      .code-box {
        padding: 12px;
        background: var(--bg-code);
        font-size: 0.75rem;
        line-height: 1.45;
        flex: 1;
        overflow-x: auto;
      }

      .impact-box {
        padding: 12px;
        background: rgba(239, 68, 68, 0.1);
        border-top: 1px solid rgba(239, 68, 68, 0.25);
        font-size: 0.78rem;
        color: #fca5a5;

        .impact-title { font-weight: 700; color: #ef4444; margin-bottom: 2px; }
        p { color: #fecaca; line-height: 1.35; }
      }

      .rationale-box {
        padding: 12px;
        background: rgba(16, 185, 129, 0.1);
        border-top: 1px solid rgba(16, 185, 129, 0.25);
        font-size: 0.78rem;
        color: #86efac;

        .rat-title { font-weight: 700; color: #10b981; margin-bottom: 2px; }
        p { color: #d1fae5; line-height: 1.35; }
      }
    }
  `]
})
export class AntiPatternsComponent {
  readonly selectedId = signal<number>(1);

  readonly antiPatterns: AntiPatternItem[] = [
    {
      id: 1,
      title: 'La Sur-Indexation SQL',
      badge: 'Gaspillage CPU & Disque',
      buggyCode: `// 💣 Vouloir lister toutes les propriétés comme en SQL :
this.version(1).stores({
  articles: 'id, titre, description, prix, stock, dateCreation, auteur'
});`,
      consequence: 'Chaque écriture ou mise à jour doit réindexer 7 arbres B-Tree distincts ! Le CPU du navigateur est saturé et la taille de la base explose.',
      fixedCode: `// ✅ Règle d'or : indexer UNIQUEMENT les critères de .where() :
this.version(1).stores({
  articles: 'id, titre' // description, prix, etc. sont quand même sauvés !
});`,
      rationale: 'Dexie sauvegarde l\'intégralité de l\'objet par Structured Clone sans avoir besoin de déclarer les champs secondaires dans stores().'
    },
    {
      id: 2,
      title: 'L\'Oubli de await sur les Opérations Asynchrones',
      badge: 'Course Critique (Race Condition)',
      buggyCode: `// 💣 Oubli de await devant l'ajout :
async function ajouter(livre: LivreDTO) {
  db.livres.add(livre); // ⚠️ Promesse pendante non attendue !
  this.#livres.set(await db.livres.toArray()); // Lit AVANT la fin de l'écriture !
}`,
      consequence: 'L\'interface se recharge immédiatement en interrogeant la base alors que l\'écriture n\'est pas terminée. Le livre n\'apparaît pas à l\'écran !',
      fixedCode: `// ✅ Attendre systématiquement la fin de la persistance :
async function ajouter(livre: LivreDTO) {
  await db.livres.add(livre);
  await this.recharger(); // Séquentialité stricte garantie
}`,
      rationale: 'Dexie est 100% asynchrone : tout appel doit être précédé de await pour assurer l\'ordre strict des événements.'
    },
    {
      id: 3,
      title: 'L\'Appel Réseau fetch() à l\'Intérieur d\'une Transaction',
      badge: 'TransactionInactiveError',
      buggyCode: `// 💣 Appel asynchrone non-Dexie dans la transaction :
await db.transaction('rw', db.commandes, async () => {
  const stock = await fetch('/api/check-stock'); // ⚠️ Macro-tâche !
  await db.commandes.add(cmd);
});`,
      consequence: 'IndexedDB suspend et clôture immédiatement la transaction dès que le thread quitte les micro-tâches IndexedDB : TransactionInactiveError !',
      fixedCode: `// ✅ Extraire tout le réseau AVANT la transaction locale :
const stock = await fetch('/api/check-stock');

await db.transaction('rw', db.commandes, async () => {
  await db.commandes.add(cmd); // 100% local, commit en 1 ms
});`,
      rationale: 'Les transactions IndexedDB doivent être ultra-courtes et purement locales. Rassemblez les données réseau au préalable.'
    },
    {
      id: 4,
      title: 'L\'Oubli de la Réhydratation fromDTO()',
      badge: 'Prototype Perdu & Méthodes Mortes',
      buggyCode: `// 💣 Utiliser l'objet lu brut depuis Dexie :
const raw = await db.livres.get(id);
raw.estDisponible(); // 💥 TypeError: is not a function !`,
      consequence: 'IndexedDB détruit les prototypes des classes. L\'appel d\'une méthode métier provoque un crash de l\'application en production.',
      fixedCode: `// ✅ Réhydrater l'entité vivante via la fabrique statique :
const raw = await db.livres.get(id);
const livre = Livre.fromDTO(raw);
livre.estDisponible(); // true ✅ Encapsulation # restaurée !`,
      rationale: 'La triade DTO / toDTO() / fromDTO() garantit l\'étanchéité absolue entre la persistance physique et vos classes POO.'
    },
    {
      id: 5,
      title: 'La Modification Directe de version(1)',
      badge: 'Blocage Définitif en Production',
      buggyCode: `// 💣 Modifier rétroactivement version(1) pour renommer un champ :
this.version(1).stores({
  contacts: 'id, nom, prenom' // ⚠️ Anciennement 'id, nomComplet'
});`,
      consequence: 'Les utilisateurs ayant déjà la v1 installée sur leur poste ne ré-exécutent pas la v1. Leurs données ne sont pas migrées et les requêtes échouent.',
      fixedCode: `// ✅ Conserver v1 intacte et empiler version(2) avec .upgrade() :
this.version(1).stores({ contacts: 'id, nomComplet' });
this.version(2).stores({ contacts: 'id, nom, prenom' })
  .upgrade(async tx => { /* migrer en place */ });`,
      rationale: 'Les migrations de schéma doivent être strictement incrémentales. Chaque version passée doit rester gravée dans le marbre.'
    }
  ];

  readonly activePattern = () => {
    return this.antiPatterns.find(p => p.id === this.selectedId()) || this.antiPatterns[0];
  };

  selectPattern(id: number): void {
    this.selectedId.set(id);
  }
}
