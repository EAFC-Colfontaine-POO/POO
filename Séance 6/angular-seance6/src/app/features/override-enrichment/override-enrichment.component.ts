import { Component, signal, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-override-enrichment',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Module 5 · Spécialisation</span>
          <span class="badge badge-angular">override & super.methode()</span>
        </div>
        <h2>Redéfinition (<code>override</code>) & Enrichissement (<code>super.methode()</code>)</h2>
        <p class="module-desc">
          Comment spécialiser le comportement d'une méthode héritée sans tout réécrire à la main ? Comment TypeScript prévient-il les fautes de frappe silencieuses qui gâchent des heures de débogage ?
        </p>
      </div>

      <!-- Mode Théorie vs Labo -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeView() === 'theory'"
          (click)="activeView.set('theory')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Simulateur Bug Silencieux vs override</span>
        </button>
        <button 
          class="mode-tab-btn" 
          [class.active]="activeView() === 'lab'"
          (click)="activeView.set('lab')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>Atelier Pratique (Labo 3)</span>
        </button>
      </div>

      @if (activeView() === 'theory') {
        <!-- PARTIE 1 : Comparateur Bug Silencieux vs Compilateur Vigilant -->
        <div class="section-block">
          <div class="block-title">
            <span class="badge badge-bootstrap">PARTIE 1</span>
            <h3>Le Bug Silencieux de la Coquille vs Le Compilateur Vigilant</h3>
          </div>

          <div class="card-panel controls-card">
            <div class="toggle-group">
              <span class="t-label">Simulation d'une faute de frappe :</span>
              <button 
                class="pill-toggle" 
                [class.active]="hasTypo()"
                (click)="hasTypo.set(true)"
              >
                Faute de frappe : <code>getdescription()</code> (d minuscule)
              </button>
              <button 
                class="pill-toggle" 
                [class.active]="!hasTypo()"
                (click)="hasTypo.set(false)"
              >
                Nom correct : <code>getDescription()</code> (D majuscule)
              </button>
            </div>

            <div class="toggle-group">
              <span class="t-label">Présence du mot-clé <code>override</code> :</span>
              <button 
                class="pill-toggle" 
                [class.active]="hasOverride()"
                (click)="hasOverride.set(true)"
              >
                Avec mot-clé <code>override</code>
              </button>
              <button 
                class="pill-toggle" 
                [class.active]="!hasOverride()"
                (click)="hasOverride.set(false)"
              >
                Sans <code>override</code> (JS classique)
              </button>
            </div>
          </div>

          <!-- Affichage du Code et du Résultat -->
          <div class="comparator-grid">
            <!-- Code Source -->
            <div class="code-card card-panel">
              <div class="panel-header">
                <span class="panel-tag">CODE TYPESCRIPT</span>
                <span class="status-tag" [class.danger]="isSilentBug()" [class.warning]="isCompilerError()" [class.success]="isValidOverride()">
                  {{ getStatusBadgeText() }}
                </span>
              </div>

              <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Media</span> &#123;
  <span class="fn">getDescription</span>(): <span class="typ">string</span> &#123;
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;this.titre&#125; (&#36;&#123;this.annee&#125;)&#96;</span>;
  &#125;
&#125;

<span class="kw">class</span> <span class="cls">Livre</span> <span class="kw">extends</span> <span class="cls">Media</span> &#123;
  <span class="comment">// Intention du développeur : spécialiser la description</span>
@if (hasOverride() && hasTypo()) {
<span class="highlight-err">  <span class="kw">override</span> <span class="fn">getdescription</span>(): <span class="typ">string</span> &#123; <span class="comment">// 👈 Coquille détectée !</span>
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;super.getDescription()&#125; — &#36;&#123;this.nombrePages&#125; pages&#96;</span>;
  &#125;</span>
} @else if (!hasOverride() && hasTypo()) {
<span class="highlight-silent">  <span class="fn">getdescription</span>(): <span class="typ">string</span> &#123; <span class="comment">// 👈 SANS override : NOUVELLE méthode créée !</span>
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;super.getDescription()&#125; — &#36;&#123;this.nombrePages&#125; pages&#96;</span>;
  &#125;</span>
} @else if (hasOverride() && !hasTypo()) {
<span class="highlight-ok">  <span class="kw">override</span> <span class="fn">getDescription</span>(): <span class="typ">string</span> &#123; <span class="comment">// ✅ Redéfinition certifiée</span>
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;super.getDescription()&#125; — &#36;&#123;this.nombrePages&#125; pages&#96;</span>;
  &#125;</span>
} @else {
  <span class="fn">getDescription</span>(): <span class="typ">string</span> &#123;
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;super.getDescription()&#125; — &#36;&#123;this.nombrePages&#125; pages&#96;</span>;
  &#125;
}
&#125;

<span class="kw">const</span> monLivre = <span class="kw">new</span> <span class="cls">Livre</span>(<span class="str">"Dune"</span>, 1965, 412);
console.log(monLivre.getDescription());</code></pre>
            </div>

            <!-- Résultat et Conséquences -->
            <div class="result-card card-panel">
              <div class="panel-header">
                <span class="panel-tag">COMPORTEMENT DU RUNTIME & CONSOLE</span>
              </div>

              @if (isSilentBug()) {
                <div class="outcome-box silent-bug">
                  <div class="outcome-header">
                    <span class="icon">😱</span>
                    <h4>LE PIÈGE ABSOLU : LE BUG SILENCIEUX</h4>
                  </div>
                  <div class="console-box">
                    <span class="c-line">&gt; monLivre.getDescription()</span>
                    <span class="c-output red">"Dune (1965)" ❌ (Les 412 pages ont disparu !)</span>
                  </div>
                  <p class="explanation">
                    <strong>Que s'est-il passé ?</strong> Le compilateur n'a rien dit. Il a bêtement créé une NOUVELLE méthode orpheline <code>getdescription()</code> (avec un d minuscule) que personne n'appelle jamais. Lorsque l'application appelle <code>getDescription()</code>, c'est la méthode de la classe mère <code>Media</code> qui s'exécute ! Vous venez de perdre 2 heures à chercher pourquoi vos pages ne s'affichent pas.
                  </p>
                </div>
              } @else if (isCompilerError()) {
                <div class="outcome-box compiler-catch">
                  <div class="outcome-header">
                    <span class="icon">🛡️</span>
                    <h4>LE COMPILATEUR TYPESCRIPT VOUS SAUVE LA VIE !</h4>
                  </div>
                  <div class="console-box">
                    <span class="c-line red">error TS4113: This member cannot have an 'override' modifier because it is not declared in the base class 'Media'.</span>
                  </div>
                  <p class="explanation">
                    <strong>Protection active :</strong> Parce que vous avez écrit <code>override</code>, TypeScript a vérifié que <code>Media</code> possédait bien une méthode <code>getdescription</code>. Ne la trouvant pas, la compilation <strong>refuse de continuer</strong> et vous pointe immédiatement la coquille !
                  </p>
                </div>
              } @else {
                <div class="outcome-box all-good">
                  <div class="outcome-header">
                    <span class="icon">🎉</span>
                    <h4>REDÉFINITION PARFAITE ET ROBUSTE</h4>
                  </div>
                  <div class="console-box">
                    <span class="c-line">&gt; monLivre.getDescription()</span>
                    <span class="c-output green">"Dune (1965) — 412 pages" ✔</span>
                  </div>
                  <p class="explanation">
                    Le contrat est honoré : la méthode fille surcharge proprement la méthode mère avec le mot-clé <code>override</code>. Si la méthode parente change de nom un jour, le compilateur tirera immédiatement la sonnette d'alarme.
                  </p>
                </div>
              }

              <!-- Focus tsconfig -->
              <div class="tsconfig-focus card-panel">
                <div class="ts-badge">⚙️ OPTION CONSEILLÉE DANS TSCONFIG.JSON</div>
                <code>"compilerOptions": &#123; "noImplicitOverride": true &#125;</code>
                <p>Oblige chaque méthode redéfinie à porter explicitement le mot-clé <code>override</code> sous peine d'erreur de compilation.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : Visualiseur d'Enrichissement avec super.methode() -->
        <div class="section-block">
          <div class="block-title">
            <span class="badge badge-html">PARTIE 2</span>
            <h3>L'Enrichissement de Comportement via <code>super.methode()</code></h3>
          </div>

          <div class="card-panel enrichment-flow-card">
            <div class="flow-header">
              <div class="flow-title">Animation du Flux d'Exécution de <code>livre.getDescription()</code> :</div>
              <div class="base-format-toggle">
                <span class="toggle-label">Format dans la classe mère Media :</span>
                <button class="pill-btn" [class.active]="parentFormat() === 'standard'" (click)="parentFormat.set('standard')">Standard : « Dune » (1965)</button>
                <button class="pill-btn" [class.active]="parentFormat() === 'iso'" (click)="parentFormat.set('iso')">Évolution 2026 : [1965] DUNE</button>
              </div>
            </div>

            <!-- Diagramme de Flux Animé -->
            <div class="flow-diagram">
              <div class="flow-step step-1">
                <div class="step-num">1</div>
                <div class="step-box">
                  <div class="box-title">Appel initial</div>
                  <code>livre.getDescription()</code>
                </div>
              </div>

              <div class="flow-arrow">➔</div>

              <div class="flow-step step-2">
                <div class="step-num">2</div>
                <div class="step-box parent-box">
                  <div class="box-title">super.getDescription()</div>
                  <code>{{ parentFormat() === 'standard' ? '« Dune » (1965)' : '[1965] DUNE' }}</code>
                  <span class="badge badge-success">Tronc commun extrait</span>
                </div>
              </div>

              <div class="flow-arrow">➔</div>

              <div class="flow-step step-3">
                <div class="step-num">3</div>
                <div class="step-box child-box">
                  <div class="box-title">Greffe Spécialisée</div>
                  <code>+ " — 412 pages"</code>
                  <span class="badge badge-purple">Spécifique au Livre</span>
                </div>
              </div>

              <div class="flow-arrow">➔</div>

              <div class="flow-step step-4">
                <div class="step-num">4</div>
                <div class="step-box final-box">
                  <div class="box-title">Résultat Final</div>
                  <strong class="result-text">{{ parentFormat() === 'standard' ? '« Dune » (1965) — 412 pages' : '[1965] DUNE — 412 pages' }}</strong>
                </div>
              </div>
            </div>

            <div class="enrichment-lesson">
              <strong>Preuve d'évolutivité :</strong> Remarquez que lorsque vous basculez le format de la classe mère (bouton ci-dessus), le résultat final de <code>Livre</code> s'adapte <strong>instantanément</strong> sans avoir touché une seule virgule au code de la classe fille !
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="3"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .section-block {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .block-title {
      display: flex;
      align-items: center;
      gap: 10px;

      h3 {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    .controls-card {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      padding: 14px 20px;
      align-items: center;
    }

    .toggle-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .t-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
      }
    }

    .pill-toggle {
      padding: 6px 12px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--bs-purple);
        color: #ffffff;
        border-color: var(--bs-purple-light);
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.4);
      }

      code {
        font-family: var(--font-mono);
      }
    }

    .comparator-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .code-card, .result-card {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .panel-tag {
        font-size: 0.72rem;
        font-weight: 800;
        color: var(--text-dim);
        letter-spacing: 0.08em;
      }

      .status-tag {
        font-size: 0.72rem;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 4px;

        &.danger {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        &.warning {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }

        &.success {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
      }
    }

    .code-box {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.6;
      border: 1px solid var(--border-subtle);

      .highlight-err {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        display: block;
        padding-left: 6px;
        margin-left: -6px;
        border-left: 3px solid #ef4444;
      }

      .highlight-silent {
        background: rgba(245, 158, 11, 0.15);
        color: #fde047;
        display: block;
        padding-left: 6px;
        margin-left: -6px;
        border-left: 3px solid #eab308;
      }

      .highlight-ok {
        background: rgba(16, 185, 129, 0.15);
        color: #86efac;
        display: block;
        padding-left: 6px;
        margin-left: -6px;
        border-left: 3px solid #10b981;
      }

      .kw { color: #c678dd; }
      .cls { color: #e5c07b; }
      .fn { color: #61afef; }
      .str { color: #98c379; }
      .typ { color: #e5c07b; }
      .comment { color: #5c6370; font-style: italic; }
    }

    .outcome-box {
      padding: 16px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .outcome-header {
        display: flex;
        align-items: center;
        gap: 10px;

        .icon { font-size: 1.4rem; }

        h4 {
          font-size: 0.95rem;
          font-weight: 800;
        }
      }

      .explanation {
        font-size: 0.82rem;
        line-height: 1.5;
      }

      &.silent-bug {
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.3);
        h4 { color: #f87171; }
        .explanation { color: #fecaca; }
      }

      &.compiler-catch {
        background: rgba(245, 158, 11, 0.08);
        border: 1px solid rgba(245, 158, 11, 0.3);
        h4 { color: #fbbf24; }
        .explanation { color: #fef3c7; }
      }

      &.all-good {
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.3);
        h4 { color: #34d399; }
        .explanation { color: #d1fae5; }
      }
    }

    .console-box {
      background: #090d16;
      border-radius: 6px;
      padding: 10px 14px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .c-line { color: #94a3b8; }
      .c-output.red { color: #f87171; font-weight: 700; }
      .c-output.green { color: #34d399; font-weight: 700; }
    }

    .tsconfig-focus {
      background: var(--bg-subtle);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .ts-badge {
        font-size: 0.7rem;
        font-weight: 800;
        color: #38bdf8;
      }

      code {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: #c4b5fd;
      }

      p {
        font-size: 0.76rem;
        color: var(--text-dim);
      }
    }

    /* Diagramme Enrichissement */
    .enrichment-flow-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .flow-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;

      .flow-title {
        font-weight: 700;
        color: var(--text-main);
        font-size: 0.95rem;
      }
    }

    .base-format-toggle {
      display: flex;
      align-items: center;
      gap: 8px;

      .toggle-label {
        font-size: 0.74rem;
        color: var(--text-dim);
      }

      .pill-btn {
        font-size: 0.75rem;
        padding: 4px 10px;
        border-radius: 4px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-muted);

        &.active {
          background: var(--bs-purple);
          color: #ffffff;
          border-color: var(--bs-purple-light);
        }
      }
    }

    .flow-diagram {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      overflow-x: auto;
      padding: 10px 0;
    }

    .flow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-width: 140px;

      .step-num {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--bs-purple);
        color: #ffffff;
        font-size: 0.72rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .step-box {
        width: 100%;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.78rem;

        .box-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        &.parent-box {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.05);
        }

        &.child-box {
          border-color: rgba(121, 82, 179, 0.4);
          background: rgba(121, 82, 179, 0.05);
        }

        &.final-box {
          border-color: #38bdf8;
          background: rgba(14, 165, 233, 0.08);

          .result-text {
            color: #38bdf8;
            font-size: 0.84rem;
          }
        }
      }
    }

    .flow-arrow {
      color: var(--text-dim);
      font-weight: 800;
      font-size: 1.2rem;
    }

    .enrichment-lesson {
      background: rgba(14, 165, 233, 0.08);
      border-left: 3px solid #0ea5e9;
      padding: 12px;
      border-radius: 4px;
      font-size: 0.82rem;
      color: var(--text-main);
      line-height: 1.45;
    }
  `]
})
export class OverrideEnrichmentComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly hasTypo = signal<boolean>(true);
  readonly hasOverride = signal<boolean>(false);
  readonly parentFormat = signal<'standard' | 'iso'>('standard');

  readonly isSilentBug = computed(() => this.hasTypo() && !this.hasOverride());
  readonly isCompilerError = computed(() => this.hasTypo() && this.hasOverride());
  readonly isValidOverride = computed(() => !this.hasTypo() && this.hasOverride());

  getStatusBadgeText(): string {
    if (this.isSilentBug()) return 'BUG SILENCIEUX (JavaScript)';
    if (this.isCompilerError()) return 'ERREUR TS4113 INTERCEPTÉE';
    return 'CONFORME & SÉCURISÉ';
  }
}
