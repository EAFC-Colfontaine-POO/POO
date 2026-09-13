import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface PrimitiveCard {
  name: string;
  badge: string;
  example: string;
  description: string;
  pitfall: string;
}

@Component({
  selector: 'app-types-primitives',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 3 — Le Système de Typage</div>
        <h2>Types Primitifs, Inférence Automatique & Types Spéciaux</h2>
        <p class="module-desc">
          Maîtrisez les 5 types primitifs élémentaires, comprenez comment TypeScript devine automatiquement le type de vos variables sans annotation verbeuse, et découvrez pourquoi <code>unknown</code> surpasse le dangereux <code>any</code>.
        </p>
      </div>

      <!-- Sélecteur Mode : Théorie & Démos interactives / Labo 1 (5 Exercices) -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'theory'"
          (click)="activeMode.set('theory')"
        >
          <span>📚 Cours & Démos Interactives</span>
        </button>
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'lab'"
          (click)="activeMode.set('lab')"
        >
          <span>🧪 Atelier Pratique : Labo 1 (5 Défis Monaco)</span>
        </button>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Cartes mémo interactives -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>1. Les 5 Types Primitifs de Base</h3>
              <p class="section-sub">Cliquez sur une carte pour examiner sa syntaxe et ses règles strictes.</p>
            </div>
          </div>

          <div class="primitives-grid">
            @for (card of primitiveCards; track card.name; let idx = $index) {
              <div 
                class="prim-card" 
                [class.selected]="selectedCardIndex() === idx"
                (click)="selectedCardIndex.set(idx)"
              >
                <div class="prim-header">
                  <code>{{ card.name }}</code>
                  <span class="badge badge-ts">{{ card.badge }}</span>
                </div>
                <div class="prim-code">
                  <code>{{ card.example }}</code>
                </div>
                <p class="prim-desc">{{ card.description }}</p>
                <div class="prim-pitfall">
                  <span class="pit-label">⚠️ Attention :</span> {{ card.pitfall }}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- 2. Playground Inférence de Type -->
        <div class="card-panel inference-section">
          <div class="section-title-row">
            <div>
              <h3>2. Le Playground de l'Inférence de Type</h3>
              <p class="section-sub">Pourquoi vous n'avez pas toujours besoin d'écrire <code>: number</code> ou <code>: string</code>.</p>
            </div>
          </div>

          <div class="inference-demo-grid">
            <div class="demo-box">
              <div class="box-tag">Ce que vous écrivez :</div>
              <div class="code-editor-preview">
                <pre><code>let score = 10; // Aucune annotation de type spécifiée</code></pre>
              </div>
              <div class="detection-badge">
                <span class="arrow-down">⬇️ Détection automatique par TypeScript :</span>
                <div class="inferred-type">
                  Type déduit : <code>score: number</code>
                </div>
              </div>
              <div class="attempt-box">
                <div class="attempt-header">Si vous tentez ensuite d'écrire :</div>
                <pre><code>score = "dix"; // ❌ ERREUR COMPILATEUR !</code></pre>
                <p class="error-msg">
                  Type 'string' is not assignable to type 'number'.
                </p>
                <p class="takeaway-text">
                  ✨ <strong>Principe clé :</strong> Une fois qu'une variable est initialisée, son type est figé pour toute sa durée de vie, même si vous ne l'avez pas écrit explicitement !
                </p>
              </div>
            </div>

            <!-- Démonstrateur d'Union -->
            <div class="demo-box">
              <div class="box-tag">Comment autoriser plusieurs types ? (Union |)</div>
              <div class="code-editor-preview">
                <pre><code>// L'opérateur pipe | permet de combiner des types :
let identifiant: number | string;

identifiant = 42;       // ✔ Parfaitement valide
identifiant = "AB-992"; // ✔ Tout aussi valide !
// identifiant = true;  // ❌ Erreur : boolean non autorisé</code></pre>
              </div>
              <div class="types-literal-box">
                <strong>Types Littéraux (Valeurs exactes) :</strong>
                <pre><code>type Direction = "gauche" | "droite";
let mouvement: Direction = "gauche"; // ✔ Valide
// mouvement = "haut"; // ❌ Erreur : pas dans l'union !</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. any vs unknown vs void -->
        <div class="card-panel special-types-section">
          <div class="section-title-row">
            <div>
              <h3>3. Types Spéciaux & Sécurité : any (DANGER) vs unknown (SÉCURITÉ)</h3>
              <p class="section-sub">Ne désactivez jamais l'alarme incendie : utilisez <code>unknown</code> au lieu de <code>any</code>.</p>
            </div>
          </div>

          <div class="types-compare-grid">
            <div class="type-card danger-card">
              <div class="type-badge-row">
                <span class="badge badge-red">any — À ÉVITER</span>
                <span class="danger-tag">💥 Désactive TypeScript</span>
              </div>
              <pre><code>let data: any = "hello";
data.foobar(); // Compile sans aucune erreur !
// 💥 CRASH à l'exécution : data.foobar is not a function</code></pre>
              <p class="card-summary">
                <code>any</code> annule tous les bénéfices du compilateur. Il transforme TypeScript en JavaScript non sécurisé.
              </p>
            </div>

            <div class="type-card safe-card">
              <div class="type-badge-row">
                <span class="badge badge-success">unknown — LA BONNE PRATIQUE</span>
                <span class="safe-tag">🛡️ Sécurité garantie</span>
              </div>
              <pre><code>let data: unknown = "hello";
// data.foobar(); // ❌ ERREUR : 'data' est de type 'unknown'

if (typeof data === "string") {{ '{' }}
  console.log(data.toUpperCase()); // ✔ Autorisé après vérification !
{{ '}' }}</code></pre>
              <p class="card-summary">
                <code>unknown</code> force le développeur à tester le type avec <code>typeof</code> avant de pouvoir appeler des propriétés ou méthodes.
              </p>
            </div>

            <div class="type-card void-card">
              <div class="type-badge-row">
                <span class="badge badge-purple">void & never</span>
                <span class="info-tag">Fonctions sans retour</span>
              </div>
              <pre><code>function journaliser(msg: string): void {{ '{' }}
  console.log(msg); // Ne retourne rien (undefined)
{{ '}' }}

function leverErreur(msg: string): never {{ '{' }}
  throw new Error(msg); // N'aboutit jamais
{{ '}' }}</code></pre>
              <p class="card-summary">
                <code>void</code> s'utilise quand une fonction s'exécute pour ses effets de bord sans renvoyer de résultat.
              </p>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Labo 1 avec Monaco Editor -->
        <app-lab-runner [targetLabNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .primitives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-top: 14px;
    }

    .prim-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-card-hover);
        border-color: var(--ts-blue);
      }

      &.selected {
        border-color: var(--ts-blue);
        background: rgba(49, 120, 198, 0.1);
      }
    }

    .prim-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      code {
        font-size: 1rem;
        font-weight: 700;
        color: var(--ts-blue-light);
      }
    }

    .prim-code {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 0.78rem;
      color: #34d399;
    }

    .prim-desc {
      font-size: 0.82rem;
      color: var(--text-main);
      line-height: 1.4;
    }

    .prim-pitfall {
      font-size: 0.76rem;
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.08);
      padding: 6px 8px;
      border-radius: 4px;

      .pit-label {
        font-weight: 700;
      }
    }

    .inference-demo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .demo-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .box-tag {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--ts-blue-light);
      text-transform: uppercase;
    }

    .code-editor-preview {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      padding: 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-code);
    }

    .detection-badge {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .arrow-down {
        font-size: 0.8rem;
        color: var(--text-dim);
      }

      .inferred-type {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 0.85rem;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
    }

    .attempt-box {
      border-top: 1px dashed var(--border-color);
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .attempt-header {
        font-size: 0.82rem;
        color: var(--text-muted);
      }

      pre {
        background: var(--bg-code);
        padding: 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        color: #fca5a5;
      }

      .error-msg {
        font-size: 0.8rem;
        color: #f87171;
        font-weight: 600;
        font-family: var(--font-mono);
      }

      .takeaway-text {
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .types-literal-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      font-size: 0.82rem;

      strong {
        color: var(--text-main);
        display: block;
        margin-bottom: 6px;
      }

      pre {
        background: var(--bg-code);
        padding: 8px;
        border-radius: 4px;
        color: var(--text-code);
      }
    }

    .types-compare-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 14px;
    }

    .type-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: var(--bg-subtle);

      &.danger-card {
        border-left: 4px solid #ef4444;
      }

      &.safe-card {
        border-left: 4px solid #10b981;
      }

      &.void-card {
        border-left: 4px solid #9333ea;
      }

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        padding: 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        color: var(--text-code);
        overflow-x: auto;
      }
    }

    .type-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .danger-tag { color: #f87171; font-size: 0.75rem; font-weight: 700; }
      .safe-tag { color: #34d399; font-size: 0.75rem; font-weight: 700; }
      .info-tag { color: #c084fc; font-size: 0.75rem; font-weight: 700; }
    }

    .card-summary {
      font-size: 0.82rem;
      line-height: 1.4;
      color: var(--text-muted);
    }
  `]
})
export class TypesPrimitivesComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');
  readonly selectedCardIndex = signal<number>(0);

  readonly primitiveCards: PrimitiveCard[] = [
    {
      name: "number",
      badge: "Entiers & Décimaux",
      example: "let age: number = 21;\nlet note: number = 15.5;",
      description: "Représente toutes les valeurs numériques (entiers, flottants, hexadécimaux). Il n'y a pas de type 'int' ou 'float' distinct.",
      pitfall: "Attention : NaN et Infinity sont aussi de type number !"
    },
    {
      name: "string",
      badge: "Chaînes de texte",
      example: "let nom: string = \"Amina\";\nlet msg = `Bonjour ${nom}`;",
      description: "Chaîne de caractères délimitée par des guillemets simples, doubles ou des backticks pour l'interpolation.",
      pitfall: "Les template strings avec backticks ` permettent d'injecter des variables sans concaténation manuelle."
    },
    {
      name: "boolean",
      badge: "Vrai ou Faux",
      example: "let estInscrit: boolean = true;\nlet actif = false;",
      description: "Valeur logique binaire : uniquement true ou false.",
      pitfall: "Ne pas confondre avec 1 ou 0 qui sont des nombres."
    },
    {
      name: "null",
      badge: "Absence volontaire",
      example: "let donnees: null = null;",
      description: "Représente une absence intentionnelle de valeur ou un pointeur vide.",
      pitfall: "En mode strict, null n'est pas assignable à number ou string sans union (number | null)."
    },
    {
      name: "undefined",
      badge: "Non initialisé",
      example: "let resultat: undefined = undefined;",
      description: "Valeur par défaut d'une variable déclarée mais qui n'a pas encore reçu de valeur.",
      pitfall: "Indique généralement un oubli d'initialisation ou un paramètre optionnel absent."
    }
  ];
}
