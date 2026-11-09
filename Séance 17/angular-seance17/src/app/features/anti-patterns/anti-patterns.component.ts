import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface AntiPatternCase {
  id: string;
  number: number;
  title: string;
  severity: 'Critique' | 'Bloquant' | 'Majeur';
  description: string;
  badCode: string;
  goodCode: string;
  explanation: string;
  remedy: string;
}

@Component({
  selector: 'app-anti-patterns',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">Module 08 · Diagnostic &amp; Qualité de Code</div>
        <h2>Salle de Diagnostic des 4 Anti-Patterns Réseau &amp; POO</h2>
        <p class="module-desc">
          Les pièges classiques rencontrés par les étudiants lors de la consommation d'APIs REST.
          Analysez les erreurs fréquentes de conception, déclenchez les crashes simulés et apprenez
          les solutions conformes d'ingénierie logicielle.
        </p>

        <div class="header-actions">
          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Mettre en Pratique dans les Labos ➔
          </button>
        </div>
      </div>

      <div class="patterns-grid">
        @for (pat of patterns; track pat.id) {
          <div class="card-panel pattern-card">
            <div class="pat-header">
              <div class="pat-title-group">
                <span class="pat-badge">#{{ pat.number }}</span>
                <div>
                  <h3 class="pat-title">{{ pat.title }}</h3>
                  <span class="pat-sub">{{ pat.description }}</span>
                </div>
              </div>

              <span class="badge" [class.badge-danger]="pat.severity === 'Critique'" [class.badge-warning]="pat.severity !== 'Critique'">
                {{ pat.severity }}
              </span>
            </div>

            <!-- Code Comparatif -->
            <div class="pat-codes-grid mt-3">
              <div class="code-col col-bad">
                <div class="col-bar">
                  <span class="text-danger font-bold">❌ Anti-Pattern (À Proscrire) :</span>
                </div>
                <pre class="code-pre"><code>{{ pat.badCode }}</code></pre>
              </div>

              <div class="code-col col-good">
                <div class="col-bar">
                  <span class="text-success font-bold">✅ Solution Conforme :</span>
                </div>
                <pre class="code-pre"><code>{{ pat.goodCode }}</code></pre>
              </div>
            </div>

            <!-- Explication & Remède -->
            <div class="pat-footer mt-3">
              <div class="exp-box">
                <strong>Pourquoi c'est une défaillance :</strong> {{ pat.explanation }}
              </div>
              <div class="fix-box mt-1">
                <strong>💡 La règle d'ingénierie :</strong> {{ pat.remedy }}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .patterns-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .pattern-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
    }

    .pat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .pat-title-group {
        display: flex;
        align-items: center;
        gap: 12px;

        .pat-badge {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          font-weight: 800;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pat-title {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .pat-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      }
    }

    .pat-codes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .code-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;

      .col-bar {
        padding: 8px 12px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.75rem;
      }

      .code-pre {
        padding: 12px;
        font-size: 0.76rem;
        line-height: 1.45;
        font-family: var(--font-mono);
        overflow-x: auto;
      }

      &.col-bad {
        border-color: rgba(239, 68, 68, 0.3);
      }

      &.col-good {
        border-color: rgba(16, 185, 129, 0.3);
      }
    }

    .pat-footer {
      background: var(--bg-subtle);
      padding: 12px 14px;
      border-radius: 6px;
      font-size: 0.8rem;
      line-height: 1.4;

      .exp-box {
        color: var(--text-muted);
      }

      .fix-box {
        color: #34d399;
      }
    }

    .badge-danger {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
    }

    .badge-warning {
      background: rgba(245, 158, 11, 0.15);
      color: #fcd34d;
    }
  `]
})
export class AntiPatternsComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly patterns: AntiPatternCase[] = [
    {
      id: 'p1',
      number: 1,
      title: 'L\'Illusion Synchrone',
      severity: 'Critique',
      description: 'Tenter de lire res.value() immédiatement dans le constructeur ou la méthode appelante.',
      badCode: `const res = httpResource('/api/articles');
// ❌ CRASH : à la ligne suivante, le réseau vient à peine de démarrer !
const premier = res.value()[0]; // TypeError: Cannot read properties of undefined`,
      goodCode: `const res = httpResource('/api/articles');
// ✅ Traiter la valeur de manière réactive
readonly premier = computed(() => res.value()?.[0]);
// Ou dans le template avec @if (!res.isLoading())`,
      explanation: 'Un appel réseau prend 100 à 800 ms. Au moment où le thread JavaScript exécute la ligne suivante, la valeur vaut impérativement undefined.',
      remedy: 'Ne lisez jamais .value() de manière impérative synchrone. Passez toujours par un computed() ou par les directives de template.'
    },
    {
      id: 'p2',
      number: 2,
      title: 'La Boucle Infinie dans effect()',
      severity: 'Critique',
      description: 'Muter un signal dépendant à l\'intérieur d\'un effet observant la ressource.',
      badCode: `effect(() => {
  if (this.res.value()) {
    // ❌ DANGER : Déclenche un rechargement infini qui fige le navigateur !
    this.page.set(this.page() + 1);
  }
});`,
      goodCode: `// ✅ Utiliser des flux unidirectionnels purs (computed)
readonly totalPages = computed(() => {
  return Math.ceil((this.res.value()?.total ?? 0) / 10);
});`,
      explanation: 'Si un effet modifie un signal qui recalcule l\'URL de la ressource, un cycle perpétuel de requêtes réseau paralyse le thread principal.',
      remedy: 'Privilégiez computed() pour dériver de l\'état. Réservez effect() pour les effets de bord externes stricts (ex: synchroniser le titre du document).'
    },
    {
      id: 'p3',
      number: 3,
      title: 'L\'Omission de encodeURIComponent()',
      severity: 'Bloquant',
      description: 'Concaténer directement les saisies utilisateurs dans l\'URL de requête.',
      badCode: `// ❌ Si terme = "café & croissants", l'URL est corrompue
const url = \`/api/search?q=\${this.terme()}\`; // Erreur 400 ou requête faussée`,
      goodCode: `// ✅ Toujours protéger les paramètres d'URL
const url = \`/api/search?q=\${encodeURIComponent(this.terme().trim())}\`;`,
      explanation: 'Les caractères réservés (&, ?, /, #, espaces) altèrent la grammaire de l\'URI HTTP et provoquent des erreurs 400 ou des failles.',
      remedy: 'Systématisez encodeURIComponent() sur chaque paramètre dynamique injecté dans une URL.'
    },
    {
      id: 'p4',
      number: 4,
      title: 'Le Prototype Perdu (Cast Naïf)',
      severity: 'Bloquant',
      description: 'Typer httpResource avec une classe métier et supposer que les méthodes existent.',
      badCode: `// ❌ Le "as" disparaît au runtime, aucun prototype n'est rattaché !
readonly res = httpResource<Recipe[]>('/api/recipes');
this.res.value()[0].isExpress(); // 💥 TypeError: is not a function`,
      goodCode: `// ✅ Typer avec le DTO et réhydrater via fromDTO()
readonly res = httpResource<RecipeDTO[]>('/api/recipes');
readonly recipes = computed(() => res.value()?.map(Recipe.fromDTO));`,
      explanation: 'JSON.parse() ne crée que des dictionnaires bruts sans prototype. Le mot-clé "as" de TypeScript ne modifie pas les objets en mémoire à l\'exécution.',
      remedy: 'Découplez toujours le DTO (interface) de l\'Entité (classe), et réhydratez avec une fabrique statique fromDTO().'
    }
  ];

  jumpToLab(): void {
    this.exerciseService.setFilterLab(6);
    this.nav.setTab('workshops-lab');
  }
}
