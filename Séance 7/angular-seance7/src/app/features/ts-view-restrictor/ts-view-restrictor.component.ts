import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-ts-view-restrictor',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 04</span>
          <span class="badge badge-danger">Erreur TS2339</span>
          <span class="badge badge-purple">Sécurité Statique</span>
        </div>
        <h2>La Règle d'Or du Compilateur TypeScript (Restricteur de Vue)</h2>
        <p class="module-desc">
          L'erreur n°1 des développeurs débutants en POO : « Mais mon objet en mémoire est un <code>Livre</code>, pourquoi TypeScript refuse-t-il d'accéder à <code>m.pages</code> ? ». Comprenez le rôle protecteur de l'étiquette de type.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🔬 Laboratoire de l'Erreur TS2339
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 2)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="restrictor-workbench">
          <!-- Carte Laboratoire d'Erreur TS2339 -->
          <div class="card-panel error-lab">
            <div class="lab-title-row">
              <h4>Expérience : Forcer l'accès à une propriété spécialisée</h4>
              <span class="badge badge-bootstrap">Déclaration : const m: Media = new Livre(...)</span>
            </div>

            <div class="code-preview-box">
              <pre><code><span class="token-keyword">const</span> m: <span class="token-type">Media</span> = <span class="token-keyword">new</span> <span class="token-class">Livre</span>(<span class="token-str">"Clean Code"</span>, 2008, 464);

console.log(m.titre);            <span class="token-comment">// ✅ Valide : déclaré sur Media</span>
console.log(m.getDescription());  <span class="token-comment">// ✅ Valide : déclaré sur Media (late binding vers Livre)</span>

<span class="token-comment">// Ligne sous test :</span>
<span class="highlight-line">console.log(m.pages);</span></code></pre>
            </div>

            <div class="lab-action-row">
              <button 
                class="btn-primary" 
                [class.btn-danger]="hasTriggeredError()"
                (click)="triggerTsError()"
              >
                🚨 Tenter d'exécuter <code>console.log(m.pages)</code>
              </button>
              <button 
                class="btn-secondary" 
                [disabled]="!hasTriggeredError()"
                (click)="hasTriggeredError.set(false)"
              >
                Effacer l'erreur
              </button>
            </div>

            @if (hasTriggeredError()) {
              <!-- Panneau rouge officiel d'erreur TS2339 -->
              <div class="ts-error-card mt-3">
                <div class="error-badge-row">
                  <span class="error-pill">TS2339</span>
                  <span class="error-desc">Property 'pages' does not exist on type 'Media'.</span>
                </div>
                <div class="error-terminal-view">
                  <code>src/app.ts:5:15 - error TS2339: Property 'pages' does not exist on type 'Media'.<br>
                  5 console.log(m.pages);<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~~~~~</code>
                </div>
              </div>
            }
          </div>

          <!-- Métaphore Visuelle de la Boîte Opaque -->
          <div class="card-panel metaphor-card">
            <h3 class="panel-title">📦 La Métaphore de la Boîte Opaque & de l'Étiquette</h3>

            <div class="boxes-row">
              <!-- Boîte 1 : Typée en Media -->
              <div class="box-container" [class.active]="viewMode() === 'media'">
                <div class="box-header">
                  <span class="box-tag">Cas A</span>
                  <h4>const m: Media</h4>
                </div>
                <div class="box-visual">
                  <div class="box-label">Étiquette : Media</div>
                  <div class="box-content-peek">
                    <span class="peek-title">Contenu physique réel en RAM :</span>
                    <span class="peek-val">Livre &#123; titre, annee, <strong>pages: 464</strong> &#125;</span>
                  </div>
                  <div class="viewfinder-window">
                    <div class="allowed-props">
                      <span class="p-ok">✔ .titre</span>
                      <span class="p-ok">✔ .annee</span>
                      <span class="p-ok">✔ .getDescription()</span>
                    </div>
                    <div class="blocked-props">
                      <span class="p-blocked">🔒 .pages (Caché par l'étiquette)</span>
                    </div>
                  </div>
                </div>
                <div class="box-explain">
                  <strong>Vue Restreinte :</strong> Le compilateur ne regarde que l'étiquette <code>Media</code>. Il refuse l'accès pour vous protéger au cas où la variable contiendrait un <code>Film</code> demain !
                </div>
              </div>

              <!-- Boîte 2 : Typée en Livre -->
              <div class="box-container" [class.active]="viewMode() === 'livre'">
                <div class="box-header">
                  <span class="box-tag">Cas B</span>
                  <h4>const m: Livre</h4>
                </div>
                <div class="box-visual">
                  <div class="box-label special">Étiquette : Livre</div>
                  <div class="box-content-peek">
                    <span class="peek-title">Contenu physique réel en RAM :</span>
                    <span class="peek-val">Livre &#123; titre, annee, pages: 464 &#125;</span>
                  </div>
                  <div class="viewfinder-window full">
                    <div class="allowed-props">
                      <span class="p-ok">✔ .titre</span>
                      <span class="p-ok">✔ .annee</span>
                      <span class="p-ok">✔ .getDescription()</span>
                      <span class="p-special">✔ .pages (Déverrouillé !)</span>
                    </div>
                  </div>
                </div>
                <div class="box-explain">
                  <strong>Vue Complète :</strong> L'étiquette est spécialisée. <code>m.pages</code> est accessible, mais la variable perd son abstraction (elle ne peut plus recevoir un <code>Film</code>).
                </div>
              </div>

              <!-- Boîte 3 : Type Narrowing avec instanceof -->
              <div class="box-container" [class.active]="viewMode() === 'narrow'">
                <div class="box-header">
                  <span class="box-tag">Cas C (Le compromis idéal)</span>
                  <h4>if (m instanceof Livre)</h4>
                </div>
                <div class="box-visual">
                  <div class="box-label narrow">Rétrécissement temporaire</div>
                  <div class="box-content-peek">
                    <span class="peek-title">Dans le bloc if :</span>
                    <span class="peek-val">m est garanti être un Livre</span>
                  </div>
                  <div class="viewfinder-window narrow-window">
                    <div class="allowed-props">
                      <span class="p-ok">✔ .titre</span>
                      <span class="p-ok">✔ .getDescription()</span>
                      <span class="p-special">✔ .pages (Sécurisé !)</span>
                    </div>
                  </div>
                </div>
                <div class="box-explain">
                  <strong>Type Narrowing :</strong> Vous conservez l'abstraction générale <code>Media</code> partout ailleurs, tout en ouvrant une brèche contrôlée et sécurisée là où c'est indispensable.
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="2"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .restrictor-workbench {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .error-lab {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .lab-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;

      h4 {
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-main);
      }
    }

    .code-preview-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 14px 18px;
      font-family: var(--font-mono);
      font-size: 0.84rem;
      line-height: 1.5;

      pre { margin: 0; }

      .highlight-line {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        display: block;
        padding: 2px 6px;
        border-radius: 4px;
        margin: 4px 0;
        border-left: 3px solid #ef4444;
      }
    }

    .token-comment { color: #64748b; font-style: italic; }
    .token-keyword { color: #c084fc; font-weight: 600; }
    .token-str { color: #86efac; }
    .token-type { color: #fde047; }
    .token-class { color: #38bdf8; font-weight: 600; }

    .lab-action-row {
      display: flex;
      gap: 10px;
    }

    .btn-danger {
      background: #dc2626 !important;
      box-shadow: 0 0 14px rgba(220, 38, 38, 0.5) !important;
    }

    .ts-error-card {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid #ef4444;
      border-radius: 8px;
      padding: 16px;
      animation: shake 0.3s ease-in-out;

      .error-badge-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        .error-pill {
          background: #ef4444;
          color: #fff;
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 0.76rem;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .error-desc {
          font-weight: 700;
          color: #f87171;
          font-size: 0.88rem;
        }
      }

      .error-terminal-view {
        background: #000;
        border-radius: 4px;
        padding: 10px 14px;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: #fca5a5;
        line-height: 1.5;
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }

    .metaphor-card {
      padding: 20px;

      .panel-title {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 16px;
      }
    }

    .boxes-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .box-container {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .box-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .box-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        h4 {
          font-size: 0.9rem;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }
      }
    }

    .box-visual {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .box-label {
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: 0.8rem;
        padding: 4px 8px;
        background: rgba(121, 82, 179, 0.2);
        color: #c4b5fd;
        border-radius: 4px;
        width: fit-content;

        &.special {
          background: rgba(14, 165, 233, 0.2);
          color: #38bdf8;
        }

        &.narrow {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
      }

      .box-content-peek {
        font-size: 0.74rem;
        color: var(--text-muted);
        display: flex;
        flex-direction: column;
        gap: 2px;

        .peek-val {
          font-family: var(--font-mono);
          color: var(--text-main);
        }
      }
    }

    .viewfinder-window {
      border: 1px dashed var(--border-color);
      border-radius: 4px;
      padding: 8px;
      font-family: var(--font-mono);
      font-size: 0.74rem;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .p-ok { color: #86efac; }
      .p-special { color: #38bdf8; font-weight: 700; }
      .p-blocked { color: #f87171; text-decoration: line-through; }
    }

    .box-explain {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.45;
      margin-top: auto;

      strong { color: var(--text-main); }
    }
  `]
})
export class TsViewRestrictorComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');
  readonly hasTriggeredError = signal<boolean>(false);
  readonly viewMode = signal<'media' | 'livre' | 'narrow'>('media');

  triggerTsError(): void {
    this.hasTriggeredError.set(true);
  }
}
