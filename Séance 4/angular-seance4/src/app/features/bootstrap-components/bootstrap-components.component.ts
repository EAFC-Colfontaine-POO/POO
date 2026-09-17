import { Component, signal, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-bootstrap-components',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 07</span>
          <span class="badge badge-bootstrap">Bootstrap 5</span>
          <span class="badge badge-purple">Composants & Spacing</span>
        </div>
        <h2>7. Composants Clés & Classes Utilitaires de Bootstrap</h2>
        <p class="module-desc">
          Accélérez le développement avec le catalogue de composants prêts à l'emploi (boutons, cartes structurées, formulaires accessibles) et décodez la grammaire compacte des classes d'espacement (m-*, p-*).
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'theory'"
            (click)="activeMode.set('theory')"
          >
            <span>📖 Showcase Composants & Réglette Utilitaires</span>
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            <span>🧪 Ateliers Monaco (Labo 5 · Composants)</span>
          </button>
        </div>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Showcase Interactif des Composants Clés -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>🎨 Showcase des Composants Clés de Bootstrap</h3>
            <span class="badge badge-bootstrap">Boutons, Cartes & Formulaires</span>
          </div>

          <div class="components-grid">
            <!-- A. Boutons -->
            <div class="component-card">
              <div class="comp-card-header">
                <h4>1. Boutons & Variantes (.btn)</h4>
                <span class="badge badge-purple">Plein & Outline</span>
              </div>
              <p class="comp-desc">La classe <code>.btn</code> initialise le bouton, suivie de la couleur sémantique ou de la bordure <code>.btn-outline-*</code>.</p>
              
              <div class="btn-demo-stage">
                <button class="btn btn-primary">.btn-primary</button>
                <button class="btn btn-secondary">.btn-secondary</button>
                <button class="btn btn-danger">.btn-danger</button>
                <button class="btn btn-outline-primary">.btn-outline-primary</button>
                <button class="btn btn-outline-warning">.btn-outline-warning</button>
                <button class="btn btn-success btn-sm">.btn-sm</button>
                <button class="btn btn-dark btn-lg">.btn-lg</button>
              </div>
            </div>

            <!-- B. Formulaires -->
            <div class="component-card">
              <div class="comp-card-header">
                <h4>2. Formulaires (.form-control, .form-label)</h4>
                <span class="badge badge-bootstrap">Champs & Validation</span>
              </div>
              <p class="comp-desc">Combinez <code>.form-label</code>, <code>.form-control</code> et <code>.mb-3</code> pour des formulaires nets et espacés.</p>

              <div class="form-demo-stage">
                <div class="mb-3">
                  <label for="demo-mail" class="form-label">Courriel professionnel :</label>
                  <input type="email" id="demo-mail" class="form-control" placeholder="nom@exemple.com" />
                </div>
                <div class="mb-3">
                  <label for="demo-select" class="form-label">Choix du cours :</label>
                  <select id="demo-select" class="form-select">
                    <option>Séance 4 — HTML/CSS & Bootstrap 5</option>
                    <option>Séance 5 — Encapsulation & Objets</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- C. Cartes & Alignement h-100 -->
          <div class="card-demo-full mt-3">
            <div class="comp-card-header">
              <h4>3. Cartes Structurées & Alignement des Hauteurs (.h-100)</h4>
              <button class="btn-secondary btn-sm" (click)="toggleH100()">
                {{ enableH100() ? 'Désactiver .h-100' : 'Activer .h-100 (Aligner)' }}
              </button>
            </div>
            <p class="comp-desc">
              Sans <code>.h-100</code>, deux cartes adjacentes de longueurs inégales ont des hauteurs asymétriques. Avec <code>.h-100</code>, elles occupent 100% de la colonne !
            </p>

            <div class="row g-3">
              <div class="col-md-6">
                <div class="card shadow-sm" [class.h-100]="enableH100()">
                  <div class="card-body">
                    <h5 class="card-title">Carte Courte</h5>
                    <p class="card-text text-muted">Contenu concis en 2 lignes seulement.</p>
                    <a href="javascript:void(0)" class="btn btn-primary btn-sm">Action</a>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card shadow-sm" [class.h-100]="enableH100()">
                  <div class="card-body">
                    <h5 class="card-title">Carte Détaillée</h5>
                    <p class="card-text text-muted">
                      Contenu beaucoup plus exhaustif expliquant les détails de l'arbre d'héritage POO du DOM, l'utilité des sélecteurs de grille et la manipulation des classes utilitaires.
                    </p>
                    <a href="javascript:void(0)" class="btn btn-outline-secondary btn-sm">Détails</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Réglette Décodeur des Classes Utilitaires d'Espacement -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>📏 Décodeur Interactif des Classes d'Espacement</h3>
            <span class="badge badge-purple">&#123;m|p&#125;&#123;côté&#125;-&#123;taille&#125;</span>
          </div>

          <p class="panel-sub">
            Composez votre classe utilitaire en sélectionnant la propriété, le côté et la taille, puis visualisez immédiatement le résultat physique.
          </p>

          <div class="spacing-builder-grid">
            <!-- Sélecteurs de syntaxe -->
            <div class="builder-controls">
              <!-- Propriété -->
              <div class="b-group">
                <label>1. Propriété :</label>
                <div class="b-pills">
                  <button class="b-btn" [class.active]="spacingProp() === 'm'" (click)="spacingProp.set('m')">m (Margin - Marge externe)</button>
                  <button class="b-btn" [class.active]="spacingProp() === 'p'" (click)="spacingProp.set('p')">p (Padding - Marge interne)</button>
                </div>
              </div>

              <!-- Côté -->
              <div class="b-group">
                <label>2. Côté :</label>
                <div class="b-pills">
                  <button class="b-btn" [class.active]="spacingSide() === ''" (click)="spacingSide.set('')">Tous (les 4 côtés)</button>
                  <button class="b-btn" [class.active]="spacingSide() === 't'" (click)="spacingSide.set('t')">t (Top - Haut)</button>
                  <button class="b-btn" [class.active]="spacingSide() === 'b'" (click)="spacingSide.set('b')">b (Bottom - Bas)</button>
                  <button class="b-btn" [class.active]="spacingSide() === 's'" (click)="spacingSide.set('s')">s (Start - Gauche)</button>
                  <button class="b-btn" [class.active]="spacingSide() === 'e'" (click)="spacingSide.set('e')">e (End - Droite)</button>
                  <button class="b-btn" [class.active]="spacingSide() === 'x'" (click)="spacingSide.set('x')">x (Horizontal : Gauche + Droite)</button>
                  <button class="b-btn" [class.active]="spacingSide() === 'y'" (click)="spacingSide.set('y')">y (Vertical : Haut + Bas)</button>
                </div>
              </div>

              <!-- Échelle de taille 0 à 5 -->
              <div class="b-group">
                <label>3. Échelle de taille :</label>
                <div class="b-pills">
                  @for (lvl of [0, 1, 2, 3, 4, 5]; track lvl) {
                    <button class="b-btn" [class.active]="spacingLevel() === lvl" (click)="spacingLevel.set(lvl)">
                      -{{ lvl }} ({{ getSpacingPixels(lvl) }}px)
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Rendu de la classe et scène de visualisation -->
            <div class="builder-preview-col">
              <!-- Carte formule & explication -->
              <div class="class-formula-card">
                <div class="formula-header">
                  <span class="formula-label">Classe Bootstrap générée :</span>
                  <span class="formula-badge" [class.is-margin]="spacingProp() === 'm'" [class.is-padding]="spacingProp() === 'p'">
                    {{ spacingProp() === 'm' ? '🟧 Marge externe (Margin)' : '🟩 Marge interne (Padding)' }}
                  </span>
                </div>
                <div class="formula-class"><code>.{{ generatedClassName() }}</code></div>
                <div class="formula-css">{{ generatedCssRule() }}</div>
                <div class="formula-desc">{{ pedagogicalDescription() }}</div>
              </div>

              <!-- Scène de démonstration avec Conteneur Parent + Blocs Voisins + Élément Cible -->
              <div class="stage-wrapper">
                <div class="stage-parent-container">
                  <div class="stage-parent-label">
                    <span class="badge-parent">📦 Conteneur parent (&lt;div class="container-demo"&gt;)</span>
                    <span class="badge-target-note">L'élément de base est la boîte violette centrale 👇</span>
                  </div>

                  <div class="stage-flow-content">
                    <!-- Bloc voisin supérieur -->
                    <div class="sibling-block top-sibling">
                      <span class="sibling-icon">🧱</span>
                      <span class="sibling-text">Bloc voisin supérieur</span>
                      <span class="sibling-tag">(reste fixe dans le flux)</span>
                    </div>

                    <!-- Élément de base cible qui reçoit la classe -->
                    <div 
                      class="target-base-element" 
                      [class]="'target-base-element ' + generatedClassName()"
                      [class.highlight-margin]="spacingProp() === 'm'"
                      [class.highlight-padding]="spacingProp() === 'p'"
                    >
                      <div class="target-base-header">
                        <span class="target-pill">🎯 ÉLÉMENT DE BASE (Reçoit la classe)</span>
                        <span class="target-class-pill">.{{ generatedClassName() }}</span>
                      </div>
                      
                      <div class="target-content-box">
                        <div class="target-content-inner">
                          <span class="content-icon">📝</span>
                          <span class="content-text">Contenu texte de l'élément</span>
                        </div>
                      </div>

                      @if (spacingProp() === 'p' && currentPixels() > 0) {
                        <div class="padding-indicator-tag">
                          zone padding interne : {{ currentPixels() }}px
                        </div>
                      }
                    </div>

                    <!-- Bloc voisin inférieur -->
                    <div class="sibling-block bottom-sibling">
                      <span class="sibling-icon">🧱</span>
                      <span class="sibling-text">Bloc voisin inférieur</span>
                      <span class="sibling-tag">(repoussé si marge basse)</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Légende explicative & Code HTML généré -->
              <div class="code-legend-card">
                <div class="legend-row">
                  <div class="legend-item margin-leg">
                    <span class="leg-color orange"></span>
                    <span><strong>Marge (orange) :</strong> Espace extérieur qui repousse les voisins</span>
                  </div>
                  <div class="legend-item padding-leg">
                    <span class="leg-color green"></span>
                    <span><strong>Padding (vert) :</strong> Espace intérieur entre bordure et texte</span>
                  </div>
                </div>

                <div class="code-snippet-box">
                  <div class="snippet-title">Structure HTML correspondante :</div>
                  <pre><code>&lt;!-- Conteneur parent --&gt;
&lt;div class="conteneur-parent"&gt;
  &lt;div class="bloc-voisin"&gt;Bloc supérieur&lt;/div&gt;

  &lt;!-- 🎯 ÉLÉMENT DE BASE : Reçoit la classe d'espacement --&gt;
  &lt;div class="element-base <mark class="hl-class">{{ generatedClassName() }}</mark>"&gt;
    Contenu texte de l'élément
  &lt;/div&gt;

  &lt;div class="bloc-voisin"&gt;Bloc inférieur&lt;/div&gt;
&lt;/div&gt;</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [labNumber]="5"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 6px;

      h3 { font-size: 1.15rem; font-weight: 800; }
    }

    .panel-sub {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .components-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    .component-card, .card-demo-full {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .comp-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h4 { font-size: 0.95rem; font-weight: 700; }
      }

      .comp-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .btn-demo-stage {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 16px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    .form-demo-stage {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 16px;

      .form-label { font-size: 0.82rem; font-weight: 600; color: var(--text-main); }
      .form-control, .form-select {
        font-size: 0.82rem;
        background: var(--bg-subtle);
        border-color: var(--border-color);
        color: var(--text-main);

        &:focus {
          border-color: #7952b3;
          box-shadow: 0 0 0 0.25rem rgba(121, 82, 179, 0.25);
        }
      }
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-main);

      .card-title { font-weight: 700; font-size: 0.95rem; }
      .card-text { font-size: 0.82rem; }
    }

    .spacing-builder-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 20px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .builder-controls {
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: var(--bg-subtle);
      padding: 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;

      .b-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-dim);
        }
      }

      .b-pills {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .b-btn {
        padding: 5px 10px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.76rem;
        font-family: var(--font-mono);
        color: var(--text-muted);

        &:hover {
          color: var(--text-main);
          background: var(--bg-card-hover);
        }

        &.active {
          background: #7952b3;
          color: white;
          border-color: #7952b3;
          font-weight: 700;
        }
      }
    }

    .builder-preview-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .class-formula-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .formula-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .formula-label {
        font-size: 0.78rem;
        color: var(--text-dim);
        font-weight: 600;
      }

      .formula-badge {
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 700;

        &.is-margin {
          background: rgba(249, 115, 22, 0.18);
          color: #fb923c;
          border: 1px solid rgba(249, 115, 22, 0.4);
        }
        &.is-padding {
          background: rgba(16, 185, 129, 0.18);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
      }

      .formula-class {
        font-size: 1.5rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: #c4b5fd;
      }

      .formula-css {
        font-size: 0.85rem;
        font-family: var(--font-mono);
        color: #34d399;
        background: rgba(0, 0, 0, 0.2);
        padding: 4px 8px;
        border-radius: 4px;
        width: fit-content;
      }

      .formula-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
        margin-top: 2px;
      }
    }

    .stage-wrapper {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }

    .stage-parent-container {
      border: 2px dashed rgba(121, 82, 179, 0.4);
      background: rgba(121, 82, 179, 0.04);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .stage-parent-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 0.74rem;

      .badge-parent {
        font-weight: 700;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
      .badge-target-note {
        color: #c4b5fd;
        font-weight: 600;
      }
    }

    .stage-flow-content {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .sibling-block {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--text-muted);
      user-select: none;

      .sibling-icon {
        font-size: 0.9rem;
      }
      .sibling-text {
        font-weight: 600;
      }
      .sibling-tag {
        font-size: 0.72rem;
        color: var(--text-dim);
      }
    }

    .target-base-element {
      background: linear-gradient(135deg, #6d28d9 0%, #7952b3 100%);
      color: white;
      border: 2px solid #a855f7;
      border-radius: 6px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: all 0.2s ease;
      position: relative;

      &.highlight-margin {
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.45);
      }

      &.highlight-padding {
        background: linear-gradient(135deg, #5b21b6 0%, #6d28d9 100%);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.4);
      }

      .target-base-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .target-pill {
        font-size: 0.72rem;
        font-weight: 800;
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 8px;
        border-radius: 4px;
        letter-spacing: 0.02em;
      }

      .target-class-pill {
        font-size: 0.74rem;
        font-family: var(--font-mono);
        font-weight: 800;
        background: #0f172a;
        color: #34d399;
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid rgba(52, 211, 153, 0.4);
      }

      .target-content-box {
        background: rgba(15, 23, 42, 0.45);
        border: 1px dashed rgba(255, 255, 255, 0.35);
        border-radius: 4px;
        padding: 8px 12px;
        text-align: center;
      }

      .target-content-inner {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82rem;
        font-weight: 600;
        color: #f8fafc;
      }

      .padding-indicator-tag {
        font-size: 0.68rem;
        font-weight: 700;
        color: #6ee7b7;
        text-align: center;
        background: rgba(16, 185, 129, 0.2);
        padding: 2px 6px;
        border-radius: 3px;
        margin-top: 2px;
      }
    }

    .code-legend-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .legend-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.76rem;
        color: var(--text-muted);

        .leg-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;

          &.orange {
            background: #f97316;
            border: 1px solid #ea580c;
          }
          &.green {
            background: #10b981;
            border: 1px solid #059669;
          }
        }
      }

      .code-snippet-box {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .snippet-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        pre {
          margin: 0;
          padding: 10px 12px;
          background: var(--bg-code);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          overflow-x: auto;
          font-size: 0.76rem;
          line-height: 1.45;
          font-family: var(--font-mono);
          color: var(--text-code);
        }

        .hl-class {
          background: rgba(121, 82, 179, 0.45);
          color: #f8fafc;
          padding: 1px 4px;
          border-radius: 3px;
          font-weight: 800;
        }
      }
    }
  `]
})
export class BootstrapComponentsComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');

  readonly enableH100 = signal<boolean>(true);

  readonly spacingProp = signal<'m' | 'p'>('m');
  readonly spacingSide = signal<string>('');
  readonly spacingLevel = signal<number>(3);

  readonly generatedClassName = computed(() => {
    const prop = this.spacingProp();
    const side = this.spacingSide();
    const lvl = this.spacingLevel();
    return `${prop}${side}-${lvl}`;
  });

  readonly currentPixels = computed(() => {
    return this.getSpacingPixels(this.spacingLevel());
  });

  readonly sideLabel = computed(() => {
    switch (this.spacingSide()) {
      case '': return 'Tous les 4 côtés';
      case 't': return 'Haut (Top)';
      case 'b': return 'Bas (Bottom)';
      case 's': return 'Gauche (Start / Left)';
      case 'e': return 'Droite (End / Right)';
      case 'x': return 'Horizontal (Gauche + Droite)';
      case 'y': return 'Vertical (Haut + Bas)';
      default: return 'Tous les 4 côtés';
    }
  });

  readonly generatedCssRule = computed(() => {
    const p = this.spacingProp() === 'm' ? 'margin' : 'padding';
    const s = this.spacingSide();
    const px = this.currentPixels();

    if (s === '') return `${p}: ${px}px; /* 4 côtés */`;
    if (s === 't') return `${p}-top: ${px}px;`;
    if (s === 'b') return `${p}-bottom: ${px}px;`;
    if (s === 's') return `${p}-left: ${px}px;`;
    if (s === 'e') return `${p}-right: ${px}px;`;
    if (s === 'x') return `${p}-left: ${px}px; ${p}-right: ${px}px;`;
    if (s === 'y') return `${p}-top: ${px}px; ${p}-bottom: ${px}px;`;
    return `${p}: ${px}px;`;
  });

  readonly pedagogicalDescription = computed(() => {
    const isMargin = this.spacingProp() === 'm';
    const px = this.currentPixels();
    const side = this.sideLabel();
    if (isMargin) {
      return `La classe .${this.generatedClassName()} s'applique sur l'Élément Cible et génère une marge externe de ${px}px (${side}), repoussant les blocs voisins et les parois du conteneur parent vers l'extérieur.`;
    } else {
      return `La classe .${this.generatedClassName()} s'applique sur l'Élément Cible et génère un rembourrage interne de ${px}px (${side}), créant un espace de respiration entre la bordure de l'élément et son texte.`;
    }
  });

  toggleH100(): void {
    this.enableH100.update(v => !v);
  }

  getSpacingPixels(level: number): number {
    switch (level) {
      case 0: return 0;
      case 1: return 4;
      case 2: return 8;
      case 3: return 16;
      case 4: return 24;
      case 5: return 48;
      default: return 16;
    }
  }
}
