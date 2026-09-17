import { Component, signal, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';
import { FlexDirection, JustifyContent, AlignItems } from '../../core/models/app.models';

@Component({
  selector: 'app-flexbox-lab',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 05</span>
          <span class="badge badge-css">CSS3</span>
          <span class="badge badge-purple">Flexbox 1D</span>
        </div>
        <h2>5. Flexbox — Disposition Unidimensionnelle</h2>
        <p class="module-desc">
          Flexbox est le moteur de mise en page moderne unidimensionnel sur lequel repose toute la grille Bootstrap. Manipulez les propriétés d'axe principal (justify-content) et d'axe secondaire (align-items) avec visualisation des flux en temps réel.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'theory'"
            (click)="activeMode.set('theory')"
          >
            <span>📖 Laboratoire Interactif Flexbox</span>
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            <span>🧪 Ateliers Monaco (Labo 3 · Flexbox)</span>
          </button>
        </div>
      </div>

      @if (activeMode() === 'theory') {
        <!-- Simulateur Flexbox Dynamique -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>🎛️ Banc d'Essai Flexbox avec Axes Dynamiques</h3>
            <button class="btn-secondary btn-sm" (click)="copyCss()">
              {{ copied() ? '✔ CSS Copié !' : '📋 Copier le code CSS' }}
            </button>
          </div>

          <p class="panel-sub">
            Ajustez la direction, la distribution et l'alignement pour observer le déplacement physique des flèches d'axes et des cartes enfants.
          </p>

          <div class="flex-workbench-grid">
            <!-- Panneau des Contrôles -->
            <div class="flex-controls-panel">
              <!-- Direction -->
              <div class="control-group">
                <label>flex-direction (Axe Principal) :</label>
                <div class="btn-grid">
                  @for (dir of ['row', 'row-reverse', 'column', 'column-reverse']; track dir) {
                    <button 
                      class="ctrl-btn" 
                      [class.active]="direction() === dir"
                      (click)="direction.set($any(dir))"
                    >
                      {{ dir }}
                    </button>
                  }
                </div>
              </div>

              <!-- Justify Content -->
              <div class="control-group">
                <label>justify-content (Alignement Axe Principal) :</label>
                <div class="btn-grid wrap-grid">
                  @for (j of ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']; track j) {
                    <button 
                      class="ctrl-btn" 
                      [class.active]="justify() === j"
                      (click)="justify.set($any(j))"
                    >
                      {{ j }}
                    </button>
                  }
                </div>
              </div>

              <!-- Align Items -->
              <div class="control-group">
                <label>align-items (Alignement Axe Secondaire) :</label>
                <div class="btn-grid">
                  @for (a of ['stretch', 'center', 'flex-start', 'flex-end']; track a) {
                    <button 
                      class="ctrl-btn" 
                      [class.active]="align() === a"
                      (click)="align.set($any(a))"
                    >
                      {{ a }}
                    </button>
                  }
                </div>
              </div>

              <!-- Gap -->
              <div class="control-group">
                <div class="slider-head">
                  <label>gap (Espacement) :</label>
                  <span class="slider-val">{{ gap() }} px</span>
                </div>
                <input type="range" min="0" max="40" [value]="gap()" (input)="onGapChange($event)" />
              </div>

              <!-- Éléments -->
              <div class="control-group">
                <label>Nombre d'éléments enfants :</label>
                <div class="btn-grid">
                  @for (n of [3, 4, 5]; track n) {
                    <button 
                      class="ctrl-btn" 
                      [class.active]="itemCount() === n"
                      (click)="itemCount.set(n)"
                    >
                      {{ n }} blocs
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- Espace de Rendu Visuel -->
            <div class="flex-stage-wrapper">
              <!-- Indicateurs d'axes -->
              <div class="axes-indicator-card">
                <div class="axis-line main-axis">
                  <span class="axis-badge main">Axe Principal (justify-content)</span>
                  <span class="axis-arrow">{{ isRow() ? (isReverse() ? '⬅ Gauche' : 'Droite ➔') : (isReverse() ? '⬆ Haut' : 'Bas ⬇') }}</span>
                </div>
                <div class="axis-line cross-axis">
                  <span class="axis-badge cross">Axe Secondaire (align-items)</span>
                  <span class="axis-arrow">{{ isRow() ? 'Vertical (Haut ↕ Bas)' : 'Horizontal (Gauche ↔ Droite)' }}</span>
                </div>
              </div>

              <!-- Scène Flexbox -->
              <div 
                class="flex-stage"
                [style.flexDirection]="direction()"
                [style.justifyContent]="justify()"
                [style.alignItems]="align()"
                [style.gap.px]="gap()"
              >
                @for (item of itemsArray(); track item.id) {
                  <div class="flex-box-item" [style.minHeight]="item.customHeight">
                    <span class="item-id">{{ item.label }}</span>
                    <span class="item-size">{{ item.desc }}</span>
                  </div>
                }
              </div>

              <!-- Code CSS généré -->
              <div class="generated-css-card">
                <div class="css-head">Code CSS généré :</div>
                <pre><code>.conteneur &#123;
  display: flex;
  flex-direction: {{ direction() }};
  justify-content: {{ justify() }};
  align-items: {{ align() }};
  gap: {{ gap() }}px;
&#125;</code></pre>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [labNumber]="3"></app-code-runner>
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

    .flex-workbench-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 20px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .flex-controls-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      .slider-head {
        display: flex;
        justify-content: space-between;
        .slider-val { font-family: var(--font-mono); font-size: 0.8rem; color: #c4b5fd; font-weight: 700; }
      }

      input[type="range"] {
        accent-color: #7952b3;
      }
    }

    .btn-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;

      &.wrap-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .ctrl-btn {
      padding: 6px 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      color: var(--text-muted);
      text-align: center;

      &:hover {
        color: var(--text-main);
        background: var(--bg-card-hover);
      }

      &.active {
        background: #7952b3;
        color: white;
        border-color: #7952b3;
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(121, 82, 179, 0.4);
      }
    }

    .flex-stage-wrapper {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .axes-indicator-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-around;
      gap: 12px;
      flex-wrap: wrap;

      .axis-line {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;

        .axis-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.72rem;

          &.main { background: rgba(121, 82, 179, 0.2); color: #c4b5fd; }
          &.cross { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        }

        .axis-arrow {
          font-weight: 700;
          color: var(--text-main);
        }
      }
    }

    .flex-stage {
      display: flex;
      height: 340px;
      background: var(--bg-card);
      border: 2px dashed #7952b3;
      border-radius: 8px;
      padding: 16px;
      overflow: auto;
      transition: all 0.25s ease;
    }

    .flex-box-item {
      min-width: 90px;
      background: linear-gradient(135deg, rgba(121, 82, 179, 0.25), rgba(59, 130, 246, 0.25));
      border: 2px solid #7952b3;
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.25s ease;

      .item-id {
        font-size: 1.1rem;
        font-weight: 800;
        color: #c4b5fd;
      }

      .item-size {
        font-size: 0.7rem;
        color: var(--text-muted);
      }
    }

    .generated-css-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 16px;

      .css-head {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-dim);
        margin-bottom: 6px;
      }

      pre {
        color: #c4b5fd;
        font-size: 0.82rem;
      }
    }
  `]
})
export class FlexboxLabComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');

  readonly direction = signal<FlexDirection>('row');
  readonly justify = signal<JustifyContent>('space-between');
  readonly align = signal<AlignItems>('center');
  readonly gap = signal<number>(16);
  readonly itemCount = signal<number>(4);
  readonly copied = signal<boolean>(false);

  readonly isRow = computed(() => this.direction().startsWith('row'));
  readonly isReverse = computed(() => this.direction().endsWith('reverse'));

  readonly itemsArray = computed(() => {
    const count = this.itemCount();
    const heights = ['60px', '90px', '75px', '110px', '65px'];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      label: `Bloc ${i + 1}`,
      desc: `h: ${heights[i % heights.length]}`,
      customHeight: heights[i % heights.length]
    }));
  });

  onGapChange(e: Event): void {
    this.gap.set(Number((e.target as HTMLInputElement).value));
  }

  copyCss(): void {
    const css = `.conteneur {
  display: flex;
  flex-direction: ${this.direction()};
  justify-content: ${this.justify()};
  align-items: ${this.align()};
  gap: ${this.gap()}px;
}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(css).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
