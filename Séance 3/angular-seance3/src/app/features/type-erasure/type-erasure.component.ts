import { Component, signal, inject } from '@angular/core';
import { MonacoEditorComponent } from '../../shared/components/monaco-editor/monaco-editor.component';
import { TypescriptTranspilerService } from '../../core/services/typescript-transpiler.service';

@Component({
  selector: 'app-type-erasure',
  standalone: true,
  imports: [MonacoEditorComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 1 — Fondamentaux & Philosophie</div>
        <h2>Pourquoi TypeScript ? & Transpilation (Type Erasure)</h2>
        <p class="module-desc">
          TypeScript est un <strong>sur-ensemble typé de JavaScript</strong> qui n'est jamais exécuté directement par le navigateur.
          Découvrez visuellement le principe fondamental d'<strong>effacement de type</strong> (<em>Type Erasure</em>) et comparez la sécurité du typage statique au typage dynamique.
        </p>
      </div>

      <!-- Alerte Pédagogique Clé -->
      <div class="pedagogical-banner card-panel">
        <div class="banner-icon">💡</div>
        <div class="banner-content">
          <strong>Règle d'or pour les débutants :</strong>
          Le typage statique de TypeScript est un outil d'aide au développement (autocomplétion, détection précoce des erreurs, documentation vivante).
          Lors de la compilation (<code>tsc</code>), <strong>tous les types disparaissent intégralement</strong>.
          Le JavaScript généré est du JS standard, léger et rapide : TypeScript n'ajoute aucun surcoût de performance à l'exécution !
        </div>
      </div>

      <!-- Section 1 : Split-Screen Transpilation en Direct -->
      <div class="card-panel split-screen-section">
        <div class="section-title-row">
          <div>
            <h3>Split-Screen en direct : TypeScript vers JavaScript</h3>
            <p class="section-sub">Tapez ou modifiez du code à gauche, observez la disparition instantanée des types à droite.</p>
          </div>
          <div class="snippets-bar">
            <span class="snippets-label">Exemples à tester :</span>
            <button class="btn-secondary btn-sm" (click)="loadSnippet('interface')">Interface & Objet</button>
            <button class="btn-secondary btn-sm" (click)="loadSnippet('union')">Union & Littéraux</button>
            <button class="btn-secondary btn-sm" (click)="loadSnippet('function')">Fonction typée</button>
            <button class="btn-secondary btn-sm" (click)="loadSnippet('generics')">Generic & As</button>
          </div>
        </div>

        <div class="split-editors-grid">
          <!-- Éditeur Gauche : TypeScript -->
          <div class="editor-pane">
            <div class="pane-header">
              <span class="badge badge-ts">Code Source : TypeScript (.ts)</span>
              <span class="pane-hint">✏️ Éditable en direct</span>
            </div>
            <div class="pane-editor-box">
              <app-monaco-editor
                [code]="tsCode()"
                language="typescript"
                (codeChange)="onTsChange($event)"
              ></app-monaco-editor>
            </div>
          </div>

          <!-- Panneau Droite : JavaScript Transpilé -->
          <div class="editor-pane">
            <div class="pane-header">
              <span class="badge badge-warning">Code Généré : JavaScript (.js)</span>
              <span class="pane-hint">⚡ Type Erasure appliqué</span>
            </div>
            <div class="pane-editor-box">
              <app-monaco-editor
                [code]="transpiledJs()"
                language="javascript"
                [readOnly]="true"
              ></app-monaco-editor>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2 : Comparateur Statique vs Dynamique -->
      <div class="card-panel comparator-section">
        <div class="section-title-row">
          <div>
            <h3>Comparateur Statique vs Dynamique : Le piège de l'addition inattendue</h3>
            <p class="section-sub">Pourquoi le JavaScript pur laisse passer des bugs silencieux alors que TypeScript les stoppe immédiatement.</p>
          </div>
        </div>

        <div class="comparator-grid">
          <!-- Colonne JS Dynamique -->
          <div class="lang-card js-card">
            <div class="card-top">
              <span class="badge badge-warning">JavaScript (Typage Dynamique)</span>
              <span class="status-tag bug">⚠️ Bug silencieux</span>
            </div>
            <div class="code-block">
              <pre><code>// En JavaScript standard :
function calculerTotal(prix, tva) {{ '{' }}
  return prix + tva;
{{ '}' }}

// Un utilisateur envoie par erreur "5" (string) au lieu de 5
const total = calculerTotal(10, "5");
console.log(total); // Affiche "105" au lieu de 15 !</code></pre>
            </div>
            <div class="explanation-box">
              <strong>À l'exécution :</strong> JavaScript convertit silencieusement le nombre <code>10</code> en chaîne et effectue une concaténation texte.
              L'application continue de fonctionner, mais votre client est facturé <strong>105 €</strong> au lieu de <strong>15 €</strong> ! Aucune alerte n'a été levée.
            </div>
          </div>

          <!-- Colonne TS Statique -->
          <div class="lang-card ts-card">
            <div class="card-top">
              <span class="badge badge-ts">TypeScript (Typage Statique)</span>
              <span class="status-tag safe">🛡️ Bloqué à l'écriture</span>
            </div>
            <div class="code-block">
              <pre><code>// En TypeScript :
function calculerTotal(prix: number, tva: number): number {{ '{' }}
  return prix + tva;
{{ '}' }}

// Le compilateur analyse le type dès la frappe :
const total = calculerTotal(10, <span class="error-underline">"5"</span>);
// ❌ ERREUR TSC : Argument of type 'string' is not
// assignable to parameter of type 'number'.</code></pre>
            </div>
            <div class="explanation-box">
              <strong>Avant l'exécution :</strong> Le compilateur TypeScript souligne la chaîne <code>"5"</code> en rouge dans votre IDE et refuse de compiler.
              L'erreur est identifiée en <strong>0 seconde</strong> par le développeur avant même de sauvegarder ou de déployer !
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pedagogical-banner {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: linear-gradient(135deg, rgba(49, 120, 198, 0.12), rgba(49, 120, 198, 0.04));
      border: 1px solid rgba(49, 120, 198, 0.3);
      padding: 16px 20px;

      .banner-icon {
        font-size: 1.6rem;
      }

      .banner-content {
        font-size: 0.92rem;
        line-height: 1.5;
        color: var(--text-main);

        strong {
          color: var(--ts-blue-light);
          display: block;
          margin-bottom: 4px;
        }

        code {
          background: rgba(49, 120, 198, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--ts-blue-light);
        }
      }
    }

    .split-screen-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .section-sub {
        font-size: 0.84rem;
        color: var(--text-muted);
      }
    }

    .snippets-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .snippets-label {
        font-size: 0.8rem;
        color: var(--text-dim);
      }

      .btn-sm {
        padding: 5px 10px;
        font-size: 0.78rem;
      }
    }

    .split-editors-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      min-height: 420px;
    }

    .editor-pane {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg-code);
    }

    .pane-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);

      .pane-hint {
        font-size: 0.72rem;
        color: var(--text-dim);
      }
    }

    .pane-editor-box {
      flex: 1;
      height: 380px;
    }

    .comparator-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .lang-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--bg-subtle);

      &.js-card {
        border-left: 4px solid #f59e0b;
      }

      &.ts-card {
        border-left: 4px solid #3178c6;
      }
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .status-tag {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 4px;

        &.bug {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }

        &.safe {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
      }
    }

    .code-block {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      font-size: 0.84rem;
      color: var(--text-code);
      overflow-x: auto;

      .error-underline {
        text-decoration: wavy underline #ef4444;
        color: #f87171;
        font-weight: 700;
      }
    }

    .explanation-box {
      font-size: 0.84rem;
      line-height: 1.5;
      color: var(--text-muted);

      strong {
        color: var(--text-main);
      }
    }
  `]
})
export class TypeErasureComponent {
  private readonly transpiler = inject(TypescriptTranspilerService);

  readonly tsCode = signal<string>(`// Déclaration d'une interface (disparaîtra dans le JS généré)
interface Etudiant {
  nom: string;
  note: number;
  estInscrit?: boolean;
}

// Fonction typée avec paramètres et retour typé
function presenter(etudiant: Etudiant): string {
  return \`\${etudiant.nom} a obtenu \${etudiant.note}/20\`;
}

// Objet conforme
const alice: Etudiant = {
  nom: "Alice",
  note: 18.5
};

console.log(presenter(alice));`);

  readonly transpiledJs = signal<string>('');

  constructor() {
    this.updateTranspiledJs(this.tsCode());
  }

  onTsChange(newCode: string): void {
    this.tsCode.set(newCode);
    this.updateTranspiledJs(newCode);
  }

  loadSnippet(type: 'interface' | 'union' | 'function' | 'generics'): void {
    let snippet = '';
    switch (type) {
      case 'interface':
        snippet = `interface Produit {\n  readonly id: number;\n  libelle: string;\n  prix: number;\n  enPromotion?: boolean;\n}\n\nconst livre: Produit = {\n  id: 101,\n  libelle: "Apprendre TypeScript",\n  prix: 29.99\n};\n\nconsole.log(livre.libelle, livre.prix);`;
        break;
      case 'union':
        snippet = `type Statut = "actif" | "inactif" | "suspendu";\ntype Identifiant = number | string;\n\nlet userId: Identifiant = "USR-992";\nlet userStatut: Statut = "actif";\n\nconsole.log(userId, userStatut);`;
        break;
      case 'function':
        snippet = `function diviser(a: number, b: number): number {\n  if (b === 0) throw new Error("Division par zéro");\n  return a / b;\n}\n\nconst resultat: number = diviser(20, 4);\nconsole.log("Résultat :", resultat);`;
        break;
      case 'generics':
        snippet = `function premierElement<T>(tableau: T[]): T {\n  return tableau[0];\n}\n\nconst premierNombre = premierElement<number>([10, 20, 30]);\nconst premierMot = premierElement<string>(["chat", "chien"]);\n\nconsole.log(premierNombre, premierMot);`;
        break;
    }
    this.tsCode.set(snippet);
    this.updateTranspiledJs(snippet);
  }

  private updateTranspiledJs(ts: string): void {
    const js = this.transpiler.transpileToJs(ts);
    this.transpiledJs.set(js);
  }
}
