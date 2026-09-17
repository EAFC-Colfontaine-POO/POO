import { Component, signal, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-box-model',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 04</span>
          <span class="badge badge-css">CSS3</span>
          <span class="badge badge-bootstrap">Box Model</span>
        </div>
        <h2>4. Le Modèle de Boîte (Box Model) & box-sizing</h2>
        <p class="module-desc">
          Chaque élément HTML est composé de 4 couches concentriques : Content, Padding, Border et Margin. Découvrez la différence cruciale entre le modèle historique content-box (dépassements et casse de mise en page) et le standard moderne border-box généralisé par le Reboot de Bootstrap 5.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'theory'"
            (click)="activeMode.set('theory')"
          >
            <span>📖 Explorateur Concentrique & Simulateur</span>
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            <span>🧪 Ateliers Monaco (Labo 2 · Box Model)</span>
          </button>
        </div>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Explorateur Dynamique du Box Model -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>🎯 Explorateur Concentrique Dynamique du Box Model</h3>
            <span class="badge badge-css">Ajustez les 4 curseurs</span>
          </div>

          <p class="panel-sub">
            Déplacez les curseurs pour observer en direct l'élargissement physique des couches concentriques et la formule de calcul en temps réel.
          </p>

          <div class="box-model-workbench">
            <!-- Sliders de contrôle -->
            <div class="controls-card">
              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-title text-orange">1. Margin (Marge externe)</span>
                  <span class="slider-val">{{ margin() }} px</span>
                </div>
                <input type="range" min="0" max="40" [value]="margin()" (input)="onMarginChange($event)" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-title text-yellow">2. Border (Bordure)</span>
                  <span class="slider-val">{{ border() }} px</span>
                </div>
                <input type="range" min="0" max="20" [value]="border()" (input)="onBorderChange($event)" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-title text-green">3. Padding (Marge interne)</span>
                  <span class="slider-val">{{ padding() }} px</span>
                </div>
                <input type="range" min="0" max="50" [value]="padding()" (input)="onPaddingChange($event)" />
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span class="slider-title text-blue">4. Content (Largeur)</span>
                  <span class="slider-val">{{ contentWidth() }} px</span>
                </div>
                <input type="range" min="120" max="300" [value]="contentWidth()" (input)="onWidthChange($event)" />
              </div>

              <!-- Formule mathématique en direct -->
              <div class="math-summary">
                <div class="math-title">📐 Calcul de la Largeur Totale Occupée :</div>
                <div class="formula">
                  <span>{{ contentWidth() }} (Content)</span> + 
                  <span class="text-green">{{ padding() * 2 }} (Padding)</span> + 
                  <span class="text-yellow">{{ border() * 2 }} (Border)</span> + 
                  <span class="text-orange">{{ margin() * 2 }} (Margin)</span>
                </div>
                <div class="formula-total">
                  = <strong>{{ totalOccupiedWidth() }} px</strong> au total
                </div>
              </div>
            </div>

            <!-- Représentation Concentrique Interactive -->
            <div class="concentric-display">
              <!-- Margin Box -->
              <div class="layer-margin" [style.padding.px]="margin()">
                <div class="layer-tag tag-margin">MARGIN : {{ margin() }}px</div>

                <!-- Border Box -->
                <div class="layer-border" [style.padding.px]="border()">
                  <div class="layer-tag tag-border">BORDER : {{ border() }}px</div>

                  <!-- Padding Box -->
                  <div class="layer-padding" [style.padding.px]="padding()">
                    <div class="layer-tag tag-padding">PADDING : {{ padding() }}px</div>

                    <!-- Content Box -->
                    <div class="layer-content" [style.width.px]="contentWidth()">
                      <div class="layer-tag tag-content">CONTENT : {{ contentWidth() }}px</div>
                      <div class="content-text">Texte / Image</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Simulateur content-box vs border-box -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>⚖️ Simulateur Comparatif : content-box vs border-box</h3>
            <span class="badge badge-bootstrap">Standard Bootstrap Reboot</span>
          </div>

          <p class="panel-sub">
            Deux colonnes avec le même code CSS : <code>width: 200px; padding: 20px; border: 4px solid;</code>. Observez la casse de disposition causée par <code>content-box</code> face à la stabilité de <code>border-box</code>.
          </p>

          <div class="comparison-grid">
            <!-- Box Content-box (Par défaut) -->
            <div class="box-card broken">
              <div class="box-card-header">
                <span class="badge badge-warning">content-box (Défaut navigateur)</span>
                <h4>Comportement Historique</h4>
              </div>

              <div class="box-visual-wrapper">
                <div class="rule-indicator">Largeur spécifiée en CSS : width: 200px</div>
                <div class="real-box content-box-demo">
                  <div class="inner-label">Largeur réelle = 248px !</div>
                </div>
              </div>

              <div class="box-details">
                <div class="math-line">
                  200px + 40px (padding) + 8px (border) = <strong class="text-danger">248px</strong>
                </div>
                <p class="consequence-text text-danger">
                  ❌ <strong>Problème :</strong> L'élément déborde de son parent. Deux colonnes de 50% ne tiendront jamais côte à côte et s'empileront violemment !
                </p>
              </div>
            </div>

            <!-- Box Border-box (Moderne) -->
            <div class="box-card fixed">
              <div class="box-card-header">
                <span class="badge badge-success">border-box (Standard Moderne)</span>
                <h4>Reboot CSS de Bootstrap 5</h4>
              </div>

              <div class="box-visual-wrapper">
                <div class="rule-indicator">Largeur spécifiée en CSS : width: 200px</div>
                <div class="real-box border-box-demo">
                  <div class="inner-label">Strictement 200px</div>
                </div>
              </div>

              <div class="box-details">
                <div class="math-line">
                  Padding et bordures déduits du contenu = <strong class="text-success">Strictement 200px</strong>
                </div>
                <p class="consequence-text text-success">
                  ✔️ <strong>Avantage :</strong> Le contenu s'ajuste à 152px. Deux colonnes de 50% restent parfaitement alignées sur la même ligne sans dépassement.
                </p>
              </div>
            </div>
          </div>

          <div class="reboot-notice">
            <span class="reboot-icon">💡</span>
            <div>
              <strong>Règle universelle appliquée automatiquement par Bootstrap 5 :</strong>
              <pre><code>*, *::before, *::after &#123; box-sizing: border-box; &#125;</code></pre>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [labNumber]="2" exerciseId="ex-2-3"></app-code-runner>
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

    .box-model-workbench {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 20px;
      align-items: center;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .controls-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .slider-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .slider-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.78rem;
        font-weight: 600;

        .text-orange { color: #fb923c; }
        .text-yellow { color: #facc15; }
        .text-green { color: #4ade80; }
        .text-blue { color: #60a5fa; }

        .slider-val {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--text-main);
        }
      }

      input[type="range"] {
        width: 100%;
        accent-color: #7952b3;
      }
    }

    .math-summary {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 12px;
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .math-title {
        font-weight: 700;
        color: var(--text-dim);
      }

      .formula {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-muted);
      }

      .formula-total {
        font-size: 0.95rem;
        color: #c4b5fd;
        margin-top: 2px;
      }
    }

    .concentric-display {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow-x: auto;
    }

    .layer-tag {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .layer-margin {
      background: rgba(249, 115, 22, 0.15);
      border: 2px dashed #f97316;
      border-radius: 8px;
      transition: all 0.15s ease;
      .tag-margin { color: #ea580c; }
    }

    .layer-border {
      background: rgba(234, 179, 8, 0.2);
      border: 2px solid #eab308;
      border-radius: 6px;
      transition: all 0.15s ease;
      .tag-border { color: #ca8a04; }
    }

    .layer-padding {
      background: rgba(34, 197, 94, 0.2);
      border: 2px dashed #22c55e;
      border-radius: 4px;
      transition: all 0.15s ease;
      .tag-padding { color: #16a34a; }
    }

    .layer-content {
      background: rgba(59, 130, 246, 0.35);
      border: 2px solid #3b82f6;
      border-radius: 4px;
      padding: 12px;
      text-align: center;
      transition: all 0.15s ease;
      .tag-content { color: #1d4ed8; }
      .content-text { font-size: 0.82rem; font-weight: 600; color: white; }
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    .box-card {
      background: var(--bg-subtle);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      &.broken { border-color: rgba(239, 68, 68, 0.35); }
      &.fixed { border-color: rgba(16, 185, 129, 0.4); }

      .box-card-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
        h4 { font-size: 1rem; font-weight: 700; }
      }
    }

    .box-visual-wrapper {
      background: var(--bg-card);
      padding: 16px;
      border-radius: 6px;
      border: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 8px;

      .rule-indicator {
        font-size: 0.72rem;
        font-family: var(--font-mono);
        color: var(--text-dim);
      }
    }

    .real-box {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      border-radius: 4px;

      &.content-box-demo {
        box-sizing: content-box;
        width: 200px;
        padding: 20px;
        border: 4px solid #ef4444;
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }

      &.border-box-demo {
        box-sizing: border-box;
        width: 200px;
        padding: 20px;
        border: 4px solid #10b981;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
    }

    .box-details {
      font-size: 0.82rem;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .math-line {
        font-family: var(--font-mono);
        font-size: 0.85rem;
      }

      .text-danger { color: #f87171; }
      .text-success { color: #34d399; }
      .consequence-text { line-height: 1.4; }
    }

    .reboot-notice {
      margin-top: 16px;
      background: rgba(121, 82, 179, 0.12);
      border: 1px solid rgba(121, 82, 179, 0.35);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.85rem;

      .reboot-icon { font-size: 1.4rem; }

      pre {
        margin-top: 4px;
        code { color: #c4b5fd; font-weight: 600; font-size: 0.82rem; }
      }
    }
  `]
})
export class BoxModelComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');

  readonly margin = signal<number>(16);
  readonly border = signal<number>(4);
  readonly padding = signal<number>(20);
  readonly contentWidth = signal<number>(180);

  readonly totalOccupiedWidth = computed(() => {
    return this.contentWidth() + (this.padding() * 2) + (this.border() * 2) + (this.margin() * 2);
  });

  onMarginChange(e: Event): void {
    this.margin.set(Number((e.target as HTMLInputElement).value));
  }
  onBorderChange(e: Event): void {
    this.border.set(Number((e.target as HTMLInputElement).value));
  }
  onPaddingChange(e: Event): void {
    this.padding.set(Number((e.target as HTMLInputElement).value));
  }
  onWidthChange(e: Event): void {
    this.contentWidth.set(Number((e.target as HTMLInputElement).value));
  }
}
