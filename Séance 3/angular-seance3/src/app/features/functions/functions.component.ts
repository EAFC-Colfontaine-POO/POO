import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-functions',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 6 — Modularité & Signatures</div>
        <h2>Fonctions, Fonctions Fléchées & Flexibilité des Paramètres</h2>
        <p class="module-desc">
          Les fonctions sont les briques fondamentales de toute application TypeScript.
          Apprenez à typer rigoureusement leurs paramètres et retours, manipulez les paramètres optionnels, valeurs par défaut et rest parameters, et passez des fonctions typées en tant que callbacks.
        </p>
      </div>

      <!-- Onglets Mode : Théorie / Labo 4 -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'theory'"
          (click)="activeMode.set('theory')"
        >
          <span>📚 Cours & Schémas Visuels</span>
        </button>
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'lab'"
          (click)="activeMode.set('lab')"
        >
          <span>🧪 Atelier Pratique : Labo 4 (5 Défis Monaco)</span>
        </button>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Anatomie d'une fonction typée -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>1. Anatomie Visuelle d'une Fonction Typée</h3>
              <p class="section-sub">Décomposition en 4 zones clés : nom, paramètres d'entrée, type de retour et corps.</p>
            </div>
          </div>

          <div class="function-anatomy-card">
            <div class="code-visual">
              <span class="kw">function</span> 
              <span class="fn-name" title="Identifiant de la fonction">calculerRemise</span>
              <span class="paren">(</span>
              <span class="param" title="Paramètre obligatoire typé number">prix: <span class="type">number</span></span>, 
              <span class="param opt" title="Paramètre optionnel typé number">taux?: <span class="type">number</span></span>
              <span class="paren">)</span>: 
              <span class="return-type" title="Type retourné par la fonction">number</span> 
              <span class="brace">&#123;</span>
              <div class="fn-body">
                <span class="kw">return</span> prix * (taux ?? 0.1);
              </div>
              <span class="brace">&#125;</span>
            </div>

            <div class="anatomy-legend-grid">
              <div class="legend-item">
                <span class="legend-dot param-dot"></span>
                <div>
                  <strong>Paramètres d'entrée :</strong>
                  <p>Chaque paramètre est obligatoirement validé à l'appel. Le compilateur refuse tout argument absent ou de mauvais type.</p>
                </div>
              </div>
              <div class="legend-item">
                <span class="legend-dot return-dot"></span>
                <div>
                  <strong>Type de retour (: number) :</strong>
                  <p>Sécurise le résultat. Si la fonction oublie de retourner une valeur ou renvoie une chaîne, TypeScript signale une erreur immédiate.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Fonctions Classiques vs Arrow Functions -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>2. Fonctions Classiques vs Fonctions Fléchées (Arrow Functions)</h3>
              <p class="section-sub">Quand privilégier la syntaxe fléchée () => &#123; &#125; ?</p>
            </div>
          </div>

          <div class="comparison-grid">
            <div class="fn-type-card">
              <div class="fn-top">
                <span class="badge badge-ts">Fonction Déclarée Classique</span>
                <span class="fn-tag">function</span>
              </div>
              <pre><code>function sommer(a: number, b: number): number &#123;
  return a + b;
&#125;</code></pre>
              <ul class="fn-points">
                <li>Idéal pour les fonctions de haut niveau ou les méthodes d'objets traditionnelles.</li>
                <li>Possède son propre contexte <code>this</code>.</li>
              </ul>
            </div>

            <div class="fn-type-card">
              <div class="fn-top">
                <span class="badge badge-success">Fonction Fléchée (Arrow Function)</span>
                <span class="fn-tag">() =></span>
              </div>
              <pre><code>const sommer = (a: number, b: number): number => a + b;

const doubler = (x: number): number => x * 2;</code></pre>
              <ul class="fn-points">
                <li>Syntaxe concise avec retour implicite sur une seule ligne.</li>
                <li><strong>Conserve le <code>this</code> englobant</strong> (indispensable pour les callbacks et Angular !).</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 3. Bac à Sable des Paramètres -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>3. Bac à Sable des Paramètres : Optionnels, Par Défaut & Rest</h3>
              <p class="section-sub">Les 3 mécanismes de souplesse pour vos signatures de fonctions.</p>
            </div>
          </div>

          <div class="params-sandbox-grid">
            <div class="param-card">
              <span class="badge badge-warning">Optionnel : param?</span>
              <pre><code>function saluer(prenom: string, titre?: string): string &#123;
  return titre ? ("Bonjour " + titre + " " + prenom) : ("Bonjour " + prenom);
&#125;

saluer("Amina");        // ✔ "Bonjour Amina"
saluer("Amina", "Dr."); // ✔ "Bonjour Dr. Amina"</code></pre>
              <p class="p-note">Un paramètre optionnel doit toujours être placé après les paramètres obligatoires.</p>
            </div>

            <div class="param-card">
              <span class="badge badge-ts">Valeur par défaut : param = def</span>
              <pre><code>function puissance(base: number, exp: number = 2): number &#123;
  return base ** exp;
&#125;

puissance(5);    // ✔ 25 (exp vaut 2 par défaut)
puissance(5, 3); // ✔ 125 (exp remplacé par 3)</code></pre>
              <p class="p-note">Attribue une valeur de repli propre sans manipulation de undefined.</p>
            </div>

            <div class="param-card">
              <span class="badge badge-purple">Paramètres du reste : ...rest</span>
              <pre><code>function total(...notes: number[]): number &#123;
  return notes.reduce((acc, n) => acc + n, 0);
&#125;

total(10, 15, 20); // ✔ 45
total(12, 14);     // ✔ 26</code></pre>
              <p class="p-note">Rassemble une infinité d'arguments dans un tableau typé <code>number[]</code>.</p>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Labo 4 -->
        <app-lab-runner [targetLabNumber]="4"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .function-anatomy-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 14px;
    }

    .code-visual {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      padding: 16px 20px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 1.05rem;
      color: var(--text-code);

      .kw { color: #f472b6; font-weight: 700; }
      .fn-name { color: #60a5fa; font-weight: 700; }
      .paren, .brace { color: #e2e8f0; font-weight: 700; }
      .param {
        background: rgba(49, 120, 198, 0.15);
        padding: 2px 6px;
        border-radius: 4px;
        color: #93c5fd;

        &.opt {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
        }
      }
      .type { color: #34d399; font-weight: 600; }
      .return-type {
        background: rgba(16, 185, 129, 0.15);
        padding: 2px 6px;
        border-radius: 4px;
        color: #34d399;
        font-weight: 700;
      }
      .fn-body {
        padding-left: 24px;
        font-size: 0.9rem;
        margin: 4px 0;
        color: var(--text-muted);
      }
    }

    .anatomy-legend-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;

      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-top: 6px;
        flex-shrink: 0;

        &.param-dot { background: #3b82f6; }
        &.return-dot { background: #10b981; }
      }

      strong {
        color: var(--text-main);
        font-size: 0.88rem;
      }

      p {
        color: var(--text-muted);
        font-size: 0.82rem;
        line-height: 1.4;
      }
    }

    .comparison-grid, .params-sandbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 14px;
    }

    .fn-type-card, .param-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

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

    .fn-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .fn-tag {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-dim);
      }
    }

    .fn-points {
      padding-left: 18px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .p-note {
      font-size: 0.78rem;
      color: var(--text-dim);
    }
  `]
})
export class FunctionsComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');
}
