import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-dry-problem',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <!-- En-tête de la section -->
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Module 1 · Genèse de la POO</span>
          <span class="badge badge-html">Principe DRY</span>
        </div>
        <h2>Le Problème de la Duplication : Don't Repeat Yourself</h2>
        <p class="module-desc">
          Avant d'être une syntaxe ou un mot-clé (<code>extends</code>), l'héritage est une réponse d'ingénierie au fléau numéro un du développement logiciel : la duplication de code et la divergence silencieuse.
        </p>
      </div>

      <!-- Onglets Mode Théorie vs Labo -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeView() === 'theory'"
          (click)="activeView.set('theory')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M7 7h10M7 12h10M7 17h6"></path>
          </svg>
          <span>Simulateur DRY & Factorisation</span>
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
          <span>Atelier Pratique (Labo 1)</span>
        </button>
      </div>

      @if (activeView() === 'theory') {
        <!-- Métriques de Dette Technique -->
        <div class="metrics-grid">
          <div class="metric-card card-panel" [class.success]="isFactorized()">
            <div class="metric-icon">📉</div>
            <div class="metric-content">
              <div class="metric-value">{{ isFactorized() ? '0' : '14' }} lignes</div>
              <div class="metric-label">Duplication stricte</div>
              <div class="metric-sub">{{ isFactorized() ? 'Tronc commun mutualisé à 100%' : 'Champs & constructeurs copiés-collés' }}</div>
            </div>
          </div>

          <div class="metric-card card-panel" [class.warning]="!isFactorized()">
            <div class="metric-icon">⚠️</div>
            <div class="metric-content">
              <div class="metric-value">{{ isFactorized() ? 'Faible (1x)' : 'Élevé (x5)' }}</div>
              <div class="metric-label">Risque de divergence silencieuse</div>
              <div class="metric-sub">{{ isFactorized() ? 'Un seul endroit à corriger ou faire évoluer' : 'Chaque classe fille peut diverger' }}</div>
            </div>
          </div>

          <div class="metric-card card-panel" [class.danger]="!isFactorized()">
            <div class="metric-icon">⏱️</div>
            <div class="metric-content">
              <div class="metric-value">{{ isFactorized() ? '15 min' : '3h 30' }}</div>
              <div class="metric-label">Charge maintenance (5 nouveaux médias)</div>
              <div class="metric-sub">Ajout de Album, BD, JeuVideo, Podcast, Revue</div>
            </div>
          </div>
        </div>

        <!-- Bouton d'action interactif Factoriser -->
        <div class="action-bar card-panel">
          <div class="action-info">
            <span class="action-badge">{{ isFactorized() ? 'ETAT : APRES FACTORISATION' : 'ETAT : AVANT FACTORISATION' }}</span>
            <div class="action-title">
              {{ isFactorized() 
                ? 'Code factorisé : Livre et Film héritent de Media' 
                : 'Deux classes jumelles isolées : redondance massive' 
              }}
            </div>
          </div>
          <button 
            class="btn-primary factorize-btn"
            [class.active]="isFactorized()"
            (click)="toggleFactorization()"
          >
            <span class="btn-icon">⚡</span>
            <span>{{ isFactorized() ? '↺ Revenir au Code Dupliqué (Avant)' : '⚡ Factoriser vers Media (Après)' }}</span>
          </button>
        </div>

        <!-- Visualiseur de Code Comparatif -->
        @if (!isFactorized()) {
          <!-- VUE AVANT : Duplication côté à côte -->
          <div class="code-split-view">
            <!-- Classe Livre -->
            <div class="code-card card-panel">
              <div class="code-card-header">
                <div class="class-badge book-badge">class Livre (Indépendante)</div>
                <span class="dup-tag red">4 blocs dupliqués</span>
              </div>
              <pre class="code-box"><code><span class="dup-line"><span class="kw">class</span> <span class="cls">Livre</span> &#123;</span>
<span class="dup-line highlight">  <span class="kw">public</span> titre: <span class="typ">string</span>;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
<span class="dup-line highlight">  <span class="kw">public</span> annee: <span class="typ">number</span>;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
  <span class="kw">public</span> nombrePages: <span class="typ">number</span>; <span class="comment">// Spécifique au Livre</span>

<span class="dup-line highlight">  <span class="kw">constructor</span>(titre: <span class="typ">string</span>, annee: <span class="typ">number</span>, nombrePages: <span class="typ">number</span>) &#123;</span>
<span class="dup-line highlight">    <span class="kw">this</span>.titre = titre;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
<span class="dup-line highlight">    <span class="kw">this</span>.annee = annee;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
    <span class="kw">this</span>.nombrePages = nombrePages;
  &#125;

<span class="dup-line highlight">  <span class="fn">getDescription</span>(): <span class="typ">string</span> &#123; <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
<span class="dup-line highlight">    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;this.titre&#125; (&#36;&#123;this.annee&#125;)&#96;</span>;</span>
  &#125;
&#125;</code></pre>
            </div>

            <!-- Classe Film -->
            <div class="code-card card-panel">
              <div class="code-card-header">
                <div class="class-badge film-badge">class Film (Indépendante)</div>
                <span class="dup-tag red">4 blocs dupliqués</span>
              </div>
              <pre class="code-box"><code><span class="dup-line"><span class="kw">class</span> <span class="cls">Film</span> &#123;</span>
<span class="dup-line highlight">  <span class="kw">public</span> titre: <span class="typ">string</span>;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
<span class="dup-line highlight">  <span class="kw">public</span> annee: <span class="typ">number</span>;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
  <span class="kw">public</span> dureeMinutes: <span class="typ">number</span>;<span class="comment">// Spécifique au Film</span>

<span class="dup-line highlight">  <span class="kw">constructor</span>(titre: <span class="typ">string</span>, annee: <span class="typ">number</span>, dureeMinutes: <span class="typ">number</span>) &#123;</span>
<span class="dup-line highlight">    <span class="kw">this</span>.titre = titre;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
<span class="dup-line highlight">    <span class="kw">this</span>.annee = annee;      <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
    <span class="kw">this</span>.dureeMinutes = dureeMinutes;
  &#125;

<span class="dup-line highlight">  <span class="fn">getDescription</span>(): <span class="typ">string</span> &#123; <span class="comment">// 🔁 STRICTEMENT IDENTIQUE</span></span>
<span class="dup-line highlight">    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;this.titre&#125; (&#36;&#123;this.annee&#125;)&#96;</span>;</span>
  &#125;
&#125;</code></pre>
            </div>
          </div>
        } @else {
          <!-- VUE APRES : Tronc commun Media + Classes spécialisées allégées -->
          <div class="factorized-tree-view">
            <!-- Classe Mère Media -->
            <div class="parent-card card-panel">
              <div class="code-card-header">
                <div class="class-badge parent-badge">🏛️ Classe Mère : Media (Tronc Commun DRY)</div>
                <span class="dup-tag green">100% Factorisé</span>
              </div>
              <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(
    <span class="kw">public</span> titre: <span class="typ">string</span>, 
    <span class="kw">public</span> annee: <span class="typ">number</span>
  ) &#123;&#125;

  <span class="fn">getDescription</span>(): <span class="typ">string</span> &#123;
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;this.titre&#125; (&#36;&#123;this.annee&#125;)&#96;</span>;
  &#125;
&#125;</code></pre>
            </div>

            <!-- Flèches d'héritage -->
            <div class="inheritance-connector">
              <div class="branch left">▲ extends Media</div>
              <div class="branch right">▲ extends Media</div>
            </div>

            <!-- Sous-classes Filles -->
            <div class="children-grid">
              <div class="code-card card-panel child-card">
                <div class="code-card-header">
                  <div class="class-badge book-badge">class Livre extends Media</div>
                  <span class="dup-tag green">-65% de code</span>
                </div>
                <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Livre</span> <span class="kw">extends</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(
    titre: <span class="typ">string</span>, 
    annee: <span class="typ">number</span>, 
    <span class="kw">public</span> nombrePages: <span class="typ">number</span>
  ) &#123;
    <span class="kw">super</span>(titre, annee); <span class="comment">// 👈 Délégation à Media</span>
  &#125;
&#125;</code></pre>
              </div>

              <div class="code-card card-panel child-card">
                <div class="code-card-header">
                  <div class="class-badge film-badge">class Film extends Media</div>
                  <span class="dup-tag green">-65% de code</span>
                </div>
                <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Film</span> <span class="kw">extends</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(
    titre: <span class="typ">string</span>, 
    annee: <span class="typ">number</span>, 
    <span class="kw">public</span> dureeMinutes: <span class="typ">number</span>
  ) &#123;
    <span class="kw">super</span>(titre, annee); <span class="comment">// 👈 Délégation à Media</span>
  &#125;
&#125;</code></pre>
              </div>
            </div>
          </div>
        }

        <!-- Synthèse Architecturale -->
        <div class="card-panel summary-panel">
          <div class="summary-title">💡 La Règle d'Or Pédagogique</div>
          <p>
            L'héritage résout le problème de duplication en établissant une <strong>hiérarchie de types</strong>. La classe mère <code>Media</code> capture l'essence commune à tous les médias d'une médiathèque, tandis que <code>Livre</code> et <code>Film</code> ne se concentrent que sur leur <strong>spécialisation exclusive</strong>.
          </p>
        </div>
      } @else {
        <!-- Mode Atelier Pratique Labo 1 -->
        <app-code-runner [filterLabNumber]="1"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .metric-card {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 16px 20px;
      transition: all 0.2s;

      .metric-icon {
        font-size: 2rem;
      }

      .metric-value {
        font-size: 1.4rem;
        font-weight: 800;
        color: var(--text-main);
        line-height: 1.1;
      }

      .metric-label {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-top: 2px;
      }

      .metric-sub {
        font-size: 0.74rem;
        color: var(--text-dim);
      }

      &.success {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.05);
        .metric-value { color: #34d399; }
      }

      &.warning {
        border-color: rgba(245, 158, 11, 0.4);
        .metric-value { color: #fbbf24; }
      }

      &.danger {
        border-color: rgba(239, 68, 68, 0.4);
        .metric-value { color: #f87171; }
      }
    }

    .action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      gap: 16px;
      flex-wrap: wrap;

      .action-badge {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-dim);
        letter-spacing: 0.06em;
      }

      .action-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .factorize-btn {
        padding: 10px 22px;
        font-size: 0.92rem;
      }
    }

    .code-split-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .code-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .code-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .class-badge {
      font-size: 0.8rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 4px;
      font-family: var(--font-mono);

      &.book-badge {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.3);
      }

      &.film-badge {
        background: rgba(236, 72, 153, 0.15);
        color: #f472b6;
        border: 1px solid rgba(236, 72, 153, 0.3);
      }

      &.parent-badge {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
    }

    .dup-tag {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;

      &.red {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }

      &.green {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
    }

    .code-box {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      line-height: 1.6;
      overflow-x: auto;
      border: 1px solid var(--border-subtle);

      .highlight {
        background: rgba(239, 68, 68, 0.12);
        display: block;
        border-left: 3px solid #ef4444;
        padding-left: 6px;
        margin-left: -6px;
      }

      .kw { color: #c678dd; font-weight: 600; }
      .cls { color: #e5c07b; font-weight: 600; }
      .typ { color: #e5c07b; }
      .fn { color: #61afef; }
      .str { color: #98c379; }
      .comment { color: #5c6370; font-style: italic; }
    }

    .factorized-tree-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .parent-card {
      width: 100%;
      max-width: 650px;
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.03);
    }

    .inheritance-connector {
      display: flex;
      justify-content: space-around;
      width: 100%;
      max-width: 700px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 700;
      color: #34d399;
    }

    .children-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      width: 100%;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .summary-panel {
      background: var(--bg-card);
      border-left: 4px solid var(--bs-purple);

      .summary-title {
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--text-main);
        margin-bottom: 6px;
      }

      p {
        font-size: 0.88rem;
        color: var(--text-muted);
        line-height: 1.5;
      }
    }
  `]
})
export class DryProblemComponent {
  readonly nav = inject(NavigationService);
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly isFactorized = signal<boolean>(false);

  toggleFactorization(): void {
    this.isFactorized.update(v => !v);
  }
}
