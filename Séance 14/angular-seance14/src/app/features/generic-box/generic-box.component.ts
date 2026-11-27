import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-generic-box',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 04 · Fondement Conceptuel</div>
        <h2>Le Moule à Gâteaux : La classe générique Boite&lt;T&gt;</h2>
        <p class="module-desc">
          Une classe générique est un moule universel qui ne change jamais de forme.
          Sélectionnez la « pâte » à verser dedans (<code>number</code>, <code>string</code>, <code>Produit</code>)
          et observez comment le compilateur déduit les signatures et stoppe net les assignations illégales (<strong>TS2345</strong>).
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Le Moule &amp; La Pâte (Simulateur TS2345)</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 3 · 3 Ex)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <section class="card-panel">
          <div class="panel-header">
            <h3>🎂 L'Analogie du Moule et de la Pâte</h3>
            <span class="badge badge-purple">class Boite&lt;T&gt;</span>
          </div>

          <div class="mold-selector-row my-3">
            <span class="ctrl-label">Choisir le type d'ingrédient &lt;T&gt; :</span>
            <div class="btn-group">
              <button class="btn-toggle" [class.active]="selectedType() === 'number'" (click)="selectType('number')">
                🍫 number (Chocolat)
              </button>
              <button class="btn-toggle" [class.active]="selectedType() === 'string'" (click)="selectType('string')">
                🍦 string (Vanille)
              </button>
              <button class="btn-toggle" [class.active]="selectedType() === 'Produit'" (click)="selectType('Produit')">
                🍓 Produit (Fruits)
              </button>
            </div>
          </div>

          <div class="grid-2-cols">
            <!-- Code TypeScript Dynamique -->
            <div class="code-box">
              <div class="code-header">
                <span>boite.ts</span>
                <span class="badge badge-ts">T = {{ selectedType() }}</span>
              </div>
              <pre><code>// 1. Le moule unique :
export class Boite&lt;T&gt; {{ '{' }}
  #contenu: T;

  constructor(valeur: T) {{ '{' }}
    this.#contenu = valeur;
  {{ '}' }}

  obtenir(): T {{ '{' }}
    return this.#contenu;
  {{ '}' }}

  remplacer(nouvelleValeur: T): void {{ '{' }}
    this.#contenu = nouvelleValeur;
  {{ '}' }}
{{ '}' }}

// 2. Instanciation avec T = {{ selectedType() }} :
const maBoite = new Boite&lt;{{ selectedType() }}&gt;({{ currentInitValueCode() }});
const val = maBoite.obtenir(); // Type déduit : {{ selectedType() }}</code></pre>
            </div>

            <!-- Démonstrateur Visuel du Moule -->
            <div class="mold-visual-card">
              <div class="mold-box" [class]="'theme-' + selectedType()">
                <div class="mold-badge">📦 Boite&lt;{{ selectedType() }}&gt;</div>
                <div class="mold-content-zone">
                  <div class="ingredient-icon">{{ ingredientIcon() }}</div>
                  <div class="ingredient-name">Contenu actuel (type {{ selectedType() }})</div>
                  <div class="ingredient-value"><code>{{ currentDisplayValue() }}</code></div>
                </div>

                <div class="mold-methods">
                  <div class="method-chip">obtenir(): <strong>{{ selectedType() }}</strong></div>
                  <div class="method-chip">remplacer(v: <strong>{{ selectedType() }}</strong>): void</div>
                </div>
              </div>

              <!-- Test d'assignation illégale -->
              <div class="illegal-assignment-box mt-3">
                <div class="illegal-label">⚠️ Test d'assignation illégale :</div>
                <p class="illegal-desc">
                  Tenter de verser du texte <code>"Bonjour"</code> dans notre <code>Boite&lt;{{ selectedType() }}&gt;</code> :
                </p>

                <button class="btn-secondary w-full" (click)="testerAssignation()">
                  Exécuter : <code>maBoite.remplacer("Bonjour")</code>
                </button>

                @if (testAttempted()) {
                  @if (selectedType() === 'string') {
                    <div class="allowed-box mt-2">
                      ✓ <strong>VALIDE :</strong> Comme <code>T</code> est <code>string</code>, passer <code>"Bonjour"</code> est parfaitement légal !
                    </div>
                  } @else {
                    <div class="ts-error-box mt-2">
                      <div class="ts-error-code">🔴 TS2345 : Erreur de compilation TypeScript</div>
                      <div class="ts-error-msg">
                        Argument of type 'string' is not assignable to parameter of type '{{ selectedType() }}'.
                      </div>
                      <div class="ts-error-desc">
                        Le compilateur a substitué <code>T</code> par <code>{{ selectedType() }}</code>.
                        Il refuse catégoriquement qu'une chaîne pénètre dans cette boîte. Zéro bug à l'exécution !
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Explication théorique -->
        <section class="card-panel mt-4">
          <h3>💡 Ce qu'il faut retenir sur le paramètre &lt;T&gt;</h3>
          <div class="grid-3-cols mt-3">
            <div class="takeaway-item">
              <div class="num-badge">1</div>
              <h4>Une variable pour les types</h4>
              <p>Tout comme <code>x</code> est une variable pour une valeur dans <code>f(x)</code>, <code>T</code> est une variable pour un type dans <code>Boite&lt;T&gt;</code>.</p>
            </div>
            <div class="takeaway-item">
              <div class="num-badge">2</div>
              <h4>Zéro coût JavaScript</h4>
              <p>À la compilation, tous les <code>&lt;T&gt;</code> sont totalement effacés (<em>Type Erasure</em>). Le JavaScript exécuté est ultra-léger et rapide.</p>
            </div>
            <div class="takeaway-item">
              <div class="num-badge">3</div>
              <h4>Autocomplétion totale</h4>
              <p>Votre IDE connaît exactement la structure du contenu retourné par <code>obtenir()</code>. Aucun cast hasardeux <code>as Type</code> n'est nécessaire.</p>
            </div>
          </div>
        </section>
      } @else {
        <app-lab-runner [defaultLabNumber]="3"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
      }
    }

    .mold-selector-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ctrl-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .btn-group {
      display: flex;
      gap: 6px;
      background: var(--bg-subtle);
      padding: 4px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .btn-toggle {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);

      &:hover {
        color: var(--text-main);
      }

      &.active {
        background: var(--ts-blue);
        color: #ffffff;
      }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 920px) {
      .grid-2-cols {
        grid-template-columns: 1fr;
      }
    }

    .mold-visual-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .mold-box {
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 20px;
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.25s;

      &.theme-number {
        border-color: #f59e0b;
        background: rgba(245, 158, 11, 0.05);
      }
      &.theme-string {
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.05);
      }
      &.theme-Produit {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.05);
      }

      .mold-badge {
        font-family: var(--font-mono);
        font-size: 0.82rem;
        font-weight: 800;
        background: var(--bg-subtle);
        padding: 4px 12px;
        border-radius: 9999px;
        border: 1px solid var(--border-color);
        margin-bottom: 12px;
      }

      .ingredient-icon {
        font-size: 2.8rem;
        margin-bottom: 6px;
      }

      .ingredient-name {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .ingredient-value {
        font-size: 0.95rem;
        margin-top: 4px;
        font-weight: 700;
        color: var(--text-main);
      }

      .mold-methods {
        display: flex;
        gap: 8px;
        margin-top: 14px;

        .method-chip {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: var(--bg-subtle);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          color: var(--text-muted);

          strong {
            color: var(--ts-blue-light);
          }
        }
      }
    }

    .illegal-assignment-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;

      .illegal-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 4px;
      }

      .illegal-desc {
        font-size: 0.76rem;
        color: var(--text-muted);
        margin-bottom: 10px;
      }
    }

    .allowed-box {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
    }

    .ts-error-box {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.4);
      padding: 10px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.75rem;

      .ts-error-code {
        color: #f87171;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .ts-error-msg {
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        padding: 4px 6px;
        border-radius: 4px;
        margin-bottom: 6px;
      }

      .ts-error-desc {
        color: #fca5a5;
        font-family: var(--font-sans);
        line-height: 1.45;
      }
    }

    .grid-3-cols {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 860px) {
      .grid-3-cols {
        grid-template-columns: 1fr;
      }
    }

    .takeaway-item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .num-badge {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--badge-bg);
        color: var(--ts-blue-light);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.8rem;
      }

      h4 {
        font-size: 0.9rem;
        font-weight: 700;
      }

      p {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }
  `]
})
export class GenericBoxComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly selectedType = signal<'number' | 'string' | 'Produit'>('number');
  readonly testAttempted = signal<boolean>(false);

  selectType(type: 'number' | 'string' | 'Produit'): void {
    this.selectedType.set(type);
    this.testAttempted.set(false);
  }

  ingredientIcon(): string {
    switch (this.selectedType()) {
      case 'number': return '🍫';
      case 'string': return '🍦';
      case 'Produit': return '🍓';
    }
  }

  currentInitValueCode(): string {
    switch (this.selectedType()) {
      case 'number': return '42';
      case 'string': return '"Bonjour"';
      case 'Produit': return 'new Produit(1, "Clavier", 49.99, 10)';
    }
  }

  currentDisplayValue(): string {
    switch (this.selectedType()) {
      case 'number': return '42';
      case 'string': return '"Bonjour"';
      case 'Produit': return '{ id: 1, nom: "Clavier", prix: 49.99, stock: 10 }';
    }
  }

  testerAssignation(): void {
    this.testAttempted.set(true);
  }
}
