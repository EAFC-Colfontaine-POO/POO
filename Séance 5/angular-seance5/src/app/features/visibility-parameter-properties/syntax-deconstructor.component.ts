import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-syntax-deconstructor',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 06 · VISIBILITÉ &amp; SYNTAXE</div>
        <h2>Modificateurs de Visibilité &amp; Parameter Properties</h2>
        <p class="module-desc">
          Maîtrisez les barrières de protection du langage TypeScript (<code>public</code>, <code>private</code>, <code>protected</code>) et découvrez la syntaxe ultra-concise des <em>Parameter Properties</em> qui divise par deux la taille de vos constructeurs.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🔍 Le Déconstructeur de Syntaxe</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 3 · Visibilité &amp; Parameter Properties)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="deconstructor-workbench">
          <!-- 1. Déconstructeur de Syntaxe : Comparaison Côte à Côte -->
          <div class="card-panel syntax-panel">
            <div class="panel-head">
              <h3>1. Déconstructeur de Syntaxe : Du Verbeux au Concis</h3>
              <div class="view-selector">
                <button class="btn-secondary" [class.active-btn]="syntaxView() === 'side-by-side'" (click)="syntaxView.set('side-by-side')">
                  Côte à côte
                </button>
                <button class="btn-secondary" [class.active-btn]="syntaxView() === 'js'" (click)="syntaxView.set('js')">
                  JavaScript Généré
                </button>
              </div>
            </div>

            @if (syntaxView() === 'side-by-side') {
              <div class="code-compare-grid">
                <!-- Syntaxe Classique Verbeuse -->
                <div class="code-col">
                  <div class="code-tag red">❌ Syntaxe classique verbeuse (14 lignes)</div>
                  <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Compte</span> &#123;
  <span class="kw">private</span> _numero: <span class="typ">string</span>;
  <span class="kw">private</span> _solde: <span class="typ">number</span>;
  <span class="kw">public readonly</span> rib: <span class="typ">string</span>;

  <span class="kw">constructor</span>(
    numero: <span class="typ">string</span>,
    solde: <span class="typ">number</span>,
    rib: <span class="typ">string</span>
  ) &#123;
    <span class="kw">this</span>._numero = numero;
    <span class="kw">this</span>._solde = solde;
    <span class="kw">this</span>.rib = rib;
  &#125;
&#125;</code></pre>
                  <span class="col-analysis">3 répétitions de chaque identifiant : attribut, argument, assignation.</span>
                </div>

                <!-- Syntaxe Concise Parameter Properties -->
                <div class="code-col">
                  <div class="code-tag green">✨ Syntaxe concise Parameter Properties (7 lignes)</div>
                  <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Compte</span> &#123;
  <span class="comm">// Déclaration + assignation automatiques !</span>
  <span class="kw">constructor</span>(
    <span class="kw">private</span> _numero: <span class="typ">string</span>,
    <span class="kw">private</span> _solde: <span class="typ">number</span>,
    <span class="kw">public readonly</span> rib: <span class="typ">string</span>
  ) &#123;&#125;
&#125;</code></pre>
                  <span class="col-analysis success">TypeScript génère automatiquement les attributs et le code <code>this.x = x</code> !</span>
                </div>
              </div>
            } @else {
              <div class="js-output-box">
                <div class="code-tag blue">⚙️ Ce que le compilateur TypeScript génère en JavaScript standard :</div>
                <pre class="code-box"><code>class Compte &#123;
  constructor(_numero, _solde, rib) &#123;
    this._numero = _numero;
    this._solde = _solde;
    this.rib = rib;
  &#125;
&#125;</code></pre>
                <p class="js-note">Les modificateurs (<code>private</code>, <code>readonly</code>) disparaissent à l'exécution : ils servent exclusivement au contrôle strict lors de l'écriture du code par les développeurs.</p>
              </div>
            }
          </div>

          <!-- 2. Matrice d'Accessibilité Interactive -->
          <div class="card-panel matrix-panel">
            <div class="matrix-header">
              <h3>2. Matrice d'Accessibilité des Modificateurs</h3>
              <span class="matrix-sub">Cliquez sur une case pour analyser la règle de compilation</span>
            </div>

            <div class="matrix-table-wrapper">
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th>Modificateur</th>
                    <th>Dans la classe</th>
                    <th>Dans une sous-classe (héritage)</th>
                    <th>Depuis l'extérieur (instance)</th>
                    <th>Modifiable après création</th>
                  </tr>
                </thead>
                <tbody>
                  <tr (click)="selectModifier('public')">
                    <td><span class="badge badge-success">public</span></td>
                    <td class="check">✅ Oui</td>
                    <td class="check">✅ Oui</td>
                    <td class="check">✅ Oui</td>
                    <td class="check">✅ Oui</td>
                  </tr>
                  <tr (click)="selectModifier('private')">
                    <td><span class="badge badge-red">private</span></td>
                    <td class="check">✅ Oui</td>
                    <td class="cross">❌ Non (Secret interne)</td>
                    <td class="cross">❌ Non (Bloqué TS)</td>
                    <td class="check">✅ Oui (en interne)</td>
                  </tr>
                  <tr (click)="selectModifier('protected')">
                    <td><span class="badge badge-warning">protected</span></td>
                    <td class="check">✅ Oui</td>
                    <td class="check">✅ Oui (Cercle familial)</td>
                    <td class="cross">❌ Non (Bloqué TS)</td>
                    <td class="check">✅ Oui (en interne)</td>
                  </tr>
                  <tr (click)="selectModifier('readonly')">
                    <td><span class="badge badge-purple">readonly</span></td>
                    <td class="check">✅ Oui (en lecture)</td>
                    <td class="check">✅ Oui (en lecture)</td>
                    <td class="check">✅ Oui (en lecture)</td>
                    <td class="cross">❌ Non (Immuable)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Détail du modificateur sélectionné -->
            <div class="selected-detail-card">
              <div class="detail-title">
                <span>Règle d'or pour :</span>
                <span class="badge badge-ts">{{ selectedModifier() }}</span>
              </div>
              <p class="detail-desc">{{ modifierDetails[selectedModifier()] }}</p>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="3"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .deconstructor-workbench {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .syntax-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-main); }
        .view-selector {
          display: flex;
          gap: 6px;

          .active-btn {
            background: var(--ts-blue);
            color: #ffffff;
            border-color: var(--ts-blue);
          }
        }
      }
    }

    .code-compare-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .code-col {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .code-tag {
        font-size: 0.78rem;
        font-weight: 700;

        &.red { color: #f87171; }
        &.green { color: #34d399; }
      }

      .col-analysis {
        font-size: 0.76rem;
        color: var(--text-muted);

        &.success { color: #34d399; }
      }
    }

    .code-box {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: #e2e8f0;
      line-height: 1.45;
      margin: 0;

      .kw { color: #f472b6; font-weight: 600; }
      .cls { color: #38bdf8; font-weight: 700; }
      .typ { color: #34d399; }
      .comm { color: #64748b; font-style: italic; }
    }

    .js-output-box {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .code-tag.blue {
        color: #60a5fa;
        font-size: 0.8rem;
        font-weight: 700;
      }

      .js-note {
        font-size: 0.82rem;
        color: var(--text-muted);
        code { font-family: var(--font-mono); color: var(--text-main); }
      }
    }

    .matrix-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .matrix-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-main); }
        .matrix-sub { font-size: 0.75rem; color: var(--text-muted); }
      }
    }

    .matrix-table-wrapper {
      overflow-x: auto;
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;

      th, td {
        padding: 10px 14px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }

      th {
        background: var(--bg-subtle);
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.78rem;
        text-transform: uppercase;
      }

      tbody tr {
        cursor: pointer;
        transition: background 0.15s;

        &:hover {
          background: var(--bg-card-hover);
        }
      }

      .check { color: #34d399; font-weight: 600; }
      .cross { color: #f87171; font-weight: 600; }
    }

    .selected-detail-card {
      background: rgba(49, 120, 198, 0.08);
      border: 1px solid rgba(49, 120, 198, 0.25);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .detail-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .detail-desc {
        font-size: 0.84rem;
        line-height: 1.45;
        color: var(--text-muted);
      }
    }
  `]
})
export class SyntaxDeconstructorComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly syntaxView = signal<'side-by-side' | 'js'>('side-by-side');
  readonly selectedModifier = signal<'public' | 'private' | 'protected' | 'readonly'>('private');

  readonly modifierDetails: Record<string, string> = {
    public: "Visibilité par défaut. À réserver aux méthodes métier indispensables qui constituent le tableau de bord offert à l'utilisateur.",
    private: "Le secret de fabrication interne. Obligatoire pour tous les attributs d'état afin d'interdire tout risque d'altération externe incontrôlée.",
    protected: "Le cercle familial. Permet aux sous-classes héritières (via extends) d'accéder aux propriétés sans les ouvrir au reste du monde.",
    readonly: "Verrou d'immuabilité. Empêche toute réaffectation après le passage dans le constructeur. Parfait pour les identifiants, RIB ou clés fixes."
  };

  selectModifier(mod: 'public' | 'private' | 'protected' | 'readonly'): void {
    this.selectedModifier.set(mod);
  }
}
