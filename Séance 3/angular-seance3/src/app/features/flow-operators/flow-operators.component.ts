import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface EqualityComparison {
  expr: string;
  looseResult: boolean;
  strictResult: boolean;
  explanation: string;
}

@Component({
  selector: 'app-flow-operators',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 5 — Logique & Syntaxe Moderne</div>
        <h2>Contrôle de Flux & Opérateurs Modernes (===, for...of, ?., ??)</h2>
        <p class="module-desc">
          Évitez les pièges historiques de JavaScript grâce à l'égalité stricte, parcourez proprement les itérables avec <code>for...of</code>,
          et sécurisez vos accès mémoire avec le chaînage optionnel (<code>?.</code>) et le nullish coalescing (<code>??</code>).
        </p>
      </div>

      <!-- Onglets Mode : Théorie & Démos / Labo 3 -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'theory'"
          (click)="activeMode.set('theory')"
        >
          <span>📚 Cours & Comparateurs Interactifs</span>
        </button>
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'lab'"
          (click)="activeMode.set('lab')"
        >
          <span>🧪 Atelier Pratique : Labo 3 (4 Défis Monaco)</span>
        </button>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Tableau d'Égalité stricte === vs relâchée == -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>1. Égalité Stricte (===) vs Relâchée (==) : La Matrice des Pièges</h3>
              <p class="section-sub">Pourquoi TypeScript et les équipes professionnelles bannissent formellement le double égal <code>==</code>.</p>
            </div>
          </div>

          <div class="table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Comparaison</th>
                  <th>== (Relâchée)</th>
                  <th>=== (Stricte)</th>
                  <th>Pourquoi ce résultat ?</th>
                </tr>
              </thead>
              <tbody>
                @for (item of equalityItems; track item.expr) {
                  <tr>
                    <td><code>{{ item.expr }}</code></td>
                    <td>
                      <span class="res-badge" [class.true-res]="item.looseResult" [class.false-res]="!item.looseResult">
                        {{ item.looseResult }}
                      </span>
                    </td>
                    <td>
                      <span class="res-badge" [class.true-res]="item.strictResult" [class.false-res]="!item.strictResult">
                        {{ item.strictResult }}
                      </span>
                    </td>
                    <td class="table-expl">{{ item.explanation }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. for...of (Valeurs) vs for...in (Clés) -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>2. Parcours de Données : for...of vs for...in</h3>
              <p class="section-sub">Ne confondez plus jamais l'extraction des éléments et l'extraction des clés.</p>
            </div>
          </div>

          <div class="loops-grid">
            <div class="loop-card for-of-card">
              <div class="loop-top">
                <span class="badge badge-success">for...of : Extrait les VALEURS</span>
                <span class="rec-badge">⭐ Recommandé sur Tableaux</span>
              </div>
              <pre><code>const fruits = ["pomme", "poire", "banane"];

for (const fruit of fruits) {{ '{' }}
  console.log(fruit);
{{ '}' }}
// Affiche : "pomme", "poire", "banane"</code></pre>
              <p class="loop-desc">
                Idéal pour itérer directement sur le contenu des tableaux, des chaînes de caractères, des <code>Map</code> et des <code>Set</code>.
              </p>
            </div>

            <div class="loop-card for-in-card">
              <div class="loop-top">
                <span class="badge badge-warning">for...in : Extrait les CLÉS / INDICES</span>
                <span class="warn-badge">⚠️ Piège fréquent sur Tableaux</span>
              </div>
              <pre><code>const fruits = ["pomme", "poire", "banane"];

for (const index in fruits) {{ '{' }}
  console.log(index);
{{ '}' }}
// Affiche : "0", "1", "2" (des chaînes de texte !)</code></pre>
              <p class="loop-desc">
                <code>for...in</code> est conçu pour énumérer les noms de propriétés d'un objet dictionnaire, et <strong>jamais</strong> pour manipuler les valeurs d'un tableau.
              </p>
            </div>
          </div>
        </div>

        <!-- 3. Laboratoire ?. et ?? -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>3. Laboratoire : Chaînage Optionnel (?.) et Nullish Coalescing (??)</h3>
              <p class="section-sub">Écrire du code robuste et élégant face aux données partielles ou non définies.</p>
            </div>
          </div>

          <div class="operators-lab-grid">
            <!-- Optional Chaining -->
            <div class="op-card">
              <div class="op-header">
                <span class="badge badge-ts">?. (Optional Chaining)</span>
                <h4>Accès sécurisé sans plantage</h4>
              </div>
              <pre><code>type Utilisateur = {{ '{' }}
  nom: string;
  adresse?: {{ '{' }} ville?: string {{ '}' }};
{{ '}' }};

const u1: Utilisateur = {{ '{' }} nom: "Lucas" {{ '}' }};

// Sans ?. : u1.adresse.ville -> 💥 TypeError !
// Avec ?. :
const ville = u1.adresse?.ville;
console.log(ville); // undefined (sans aucun crash !)</code></pre>
            </div>

            <!-- Nullish Coalescing -->
            <div class="op-card">
              <div class="op-header">
                <span class="badge badge-purple">?? vs || (Nullish Coalescing)</span>
                <h4>Le piège du 0 écrasé par ||</h4>
              </div>
              <pre><code>let score = 0; // Le joueur a réellement un score de 0

// Piège avec || : 0 est considéré comme faux (falsy)
const resOr = score || 10;
console.log(resOr); // 10 (Erreur : le 0 est écrasé !)

// Sécurité avec ?? : remplace UNIQUEMENT null / undefined
const resNullish = score ?? 10;
console.log(resNullish); // 0 (✔ Valeur légitime préservée !)</code></pre>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Labo 3 -->
        <app-lab-runner [targetLabNumber]="3"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
      margin-top: 14px;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.86rem;

      th, td {
        padding: 10px 14px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }

      th {
        background: var(--bg-subtle);
        color: var(--text-dim);
        font-weight: 700;
        font-size: 0.78rem;
        text-transform: uppercase;
      }

      code {
        color: var(--ts-blue-light);
        font-weight: 600;
      }

      .table-expl {
        color: var(--text-muted);
        font-size: 0.82rem;
      }
    }

    .res-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-family: var(--font-mono);
      font-size: 0.75rem;

      &.true-res {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }

      &.false-res {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }
    }

    .loops-grid, .operators-lab-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .loop-card, .op-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.for-of-card { border-left: 4px solid #10b981; }
      &.for-in-card { border-left: 4px solid #f59e0b; }

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.82rem;
        color: var(--text-code);
        overflow-x: auto;
      }
    }

    .loop-top, .op-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rec-badge { color: #34d399; font-size: 0.75rem; font-weight: 700; }
      .warn-badge { color: #fbbf24; font-size: 0.75rem; font-weight: 700; }

      h4 {
        font-size: 0.95rem;
        color: var(--text-main);
      }
    }

    .loop-desc {
      font-size: 0.84rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
  `]
})
export class FlowOperatorsComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');

  readonly equalityItems: EqualityComparison[] = [
    {
      expr: '5 === "5"',
      looseResult: true,
      strictResult: false,
      explanation: '== convertit la chaîne "5" en nombre, alors que === constate immédiatement que string !== number.'
    },
    {
      expr: '0 === ""',
      looseResult: true,
      strictResult: false,
      explanation: '== convertit la chaîne vide en 0, créant une fausse équivalence désastreuse.'
    },
    {
      expr: 'false === "0"',
      looseResult: true,
      strictResult: false,
      explanation: '== convertit "0" en nombre 0, puis compare 0 avec false (qui vaut 0). Absurde mais vrai !'
    },
    {
      expr: 'null === undefined',
      looseResult: true,
      strictResult: false,
      explanation: '== les considère identiques, alors que === distingue rigoureusement le pointeur nul de la valeur non définie.'
    }
  ];
}
