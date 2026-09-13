import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncapsulationMode } from '../../core/models/app.models';

@Component({
  selector: 'app-view-encapsulation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Styles & Rendu — Isolation CSS & ViewEncapsulation</div>
        <h2>6. Laboratoire d'Encapsulation CSS (View Encapsulation)</h2>
        <p class="module-desc">
          Pourquoi les styles définis dans un composant ne débordent-ils pas sur le reste de l'application ?
          Angular implémente par défaut une émulation de scopage basée sur l'injection d'attributs uniques 
          (<code>_ngcontent-ng-c...</code>). Comparez les modes <strong>Emulated</strong>, <strong>None</strong> et <strong>ShadowDom</strong> 
          et observez en direct le risque d'une fuite de styles globale.
        </p>
      </div>

      <!-- Sélecteur de Mode d'Encapsulation -->
      <div class="mode-selector-card card-panel">
        <div class="selector-title-row">
          <div class="sel-title">
            <span class="icon">🛡️</span>
            <span>Sélectionner le mode <code>encapsulation: ViewEncapsulation...</code> :</span>
          </div>

          <div class="mode-buttons">
            <button 
              class="mode-btn" 
              [class.active]="selectedMode() === 'Emulated'"
              (click)="setMode('Emulated')"
            >
              Emulated (Par défaut)
            </button>
            <button 
              class="mode-btn mode-btn-danger" 
              [class.active]="selectedMode() === 'None'"
              (click)="setMode('None')"
            >
              None (Styles Globaux / Fuite)
            </button>
            <button 
              class="mode-btn" 
              [class.active]="selectedMode() === 'ShadowDom'"
              (click)="setMode('ShadowDom')"
            >
              ShadowDom (Natif)
            </button>
          </div>
        </div>

        <div class="mode-explanation-alert" [ngClass]="'alert-' + selectedMode().toLowerCase()">
          @switch (selectedMode()) {
            @case ('Emulated') {
              <strong>✓ ViewEncapsulation.Emulated (Recommandé) :</strong>
              Angular réécrit les sélecteurs CSS à la volée en leur adjoignant l'attribut unique <code>_ngcontent-ng-c123</code>.
              Le composant parent est parfaitement protégé contre toute pollution.
            }
            @case ('None') {
              <strong>⚠️ ViewEncapsulation.None (Attention aux effets de bord !) :</strong>
              Angular n'injecte aucun attribut de scopage et injecte le CSS directement dans la balise <code>&lt;head&gt;</code> globale.
              La règle <code>p &#123; color: purple; &#125;</code> s'échappe et colore TOUS les paragraphes de l'application !
            }
            @case ('ShadowDom') {
              <strong>🌐 ViewEncapsulation.ShadowDom :</strong>
              Angular s'appuie sur le standard Web Component du navigateur en encapsulant le composant dans un véritable <code>#shadow-root</code> natif.
            }
          }
        </div>
      </div>

      <!-- Zone de Démonstration Visuelle -->
      <div class="encapsulation-grid">
        <!-- Rendu Graphique Simulé (Parent + Enfant) -->
        <div class="card-panel render-visual-panel">
          <div class="panel-header">
            <span class="header-title">Arbre de Composants & Rendu Navigateur</span>
            <span class="leak-indicator" [class.leaking]="selectedMode() === 'None'">
              {{ selectedMode() === 'None' ? '⚠️ Fuite CSS active !' : '🛡️ Styles étanches' }}
            </span>
          </div>

          <!-- Composant Parent : AppComponent -->
          <div class="component-box parent-box">
            <div class="comp-tag parent-tag">
              <span>🏠 Composant PARENT : <code>AppComponent</code></span>
              <span class="tag-attr" *ngIf="selectedMode() === 'Emulated'">_nghost-ng-c100</span>
            </div>

            <!-- Paragraphe du parent -->
            <p class="parent-paragraph" [class.leaked-purple]="selectedMode() === 'None'">
              Je suis un paragraphe &lt;p&gt; situé dans le composant <strong>PARENT</strong> (<code>AppComponent</code>).
              {{ selectedMode() === 'None' ? '🚨 Je suis devenu VIOLET par accident à cause du mode None !' : 'Je conserve mon style normal car je suis étanche.' }}
            </p>

            <!-- Composant Enfant : HeaderComponent -->
            <div class="component-box child-box">
              <div class="comp-tag child-tag">
                <span>👶 Composant ENFANT : <code>HeaderComponent</code></span>
                <span class="tag-attr" *ngIf="selectedMode() === 'Emulated'">_ngcontent-ng-c100 _nghost-ng-c200</span>
              </div>

              <!-- Règle CSS déclarée pour l'enfant -->
              <div class="css-rule-badge">
                Règle dans <code>header.component.css</code> : 
                <code>p &#123; color: purple; font-style: italic; &#125;</code>
              </div>

              <p class="child-paragraph">
                Je suis un paragraphe &lt;p&gt; situé dans le composant <strong>ENFANT</strong> (<code>HeaderComponent</code>).
                Je suis toujours coloré en violet et en italique.
              </p>
            </div>
          </div>
        </div>

        <!-- Visualiseur de Compilation (Transformation CSS & DOM) -->
        <div class="card-panel compilation-visual-panel">
          <div class="panel-header">
            <span class="header-title">Sous le Capot : Ce que fait le compilateur Angular</span>
          </div>

          <!-- Transformation CSS -->
          <div class="transform-block">
            <div class="block-title">1. Réécriture du sélecteur CSS par Angular :</div>
            <pre class="code-box"><code>@if (selectedMode() === 'Emulated') {
/* CSS écrit par le développeur : */
p &#123; color: purple; font-style: italic; &#125;

/* 🪄 CSS RÉÉCRIT à la compilation par Angular : */
<span class="hl-css">p[_ngcontent-ng-c200]</span> &#123;
  color: purple;
  font-style: italic;
&#125;
} @else if (selectedMode() === 'None') {
/* En mode None, AUCUNE réécriture : */
<span class="hl-leak">p</span> &#123;
  color: purple;
  font-style: italic;
&#125;
/* ⚠️ Injecté directement dans &lt;head&gt; -> touche tous les &lt;p&gt; de la page ! */
} @else {
/* En mode ShadowDom : */
#shadow-root (open)
  p &#123; color: purple; font-style: italic; &#125;
}</code></pre>
          </div>

          <!-- Transformation du DOM HTML -->
          <div class="transform-block">
            <div class="block-title">2. Arbre HTML généré dans les DevTools (F12) :</div>
            <pre class="code-box"><code>@if (selectedMode() === 'Emulated') {
&lt;app-root <span class="hl-attr">_nghost-ng-c100</span>&gt;
  &lt;p <span class="hl-attr">_ngcontent-ng-c100</span>&gt;Paragraphe du parent (Non ciblé)&lt;/p&gt;

  &lt;app-header <span class="hl-attr">_ngcontent-ng-c100</span> <span class="hl-attr">_nghost-ng-c200</span>&gt;
    &lt;p <span class="hl-match">_ngcontent-ng-c200</span>&gt;Paragraphe de l'enfant (Correspondance exacte !)&lt;/p&gt;
  &lt;/app-header&gt;
&lt;/app-root&gt;
} @else if (selectedMode() === 'None') {
&lt;app-root&gt;
  &lt;p&gt;Paragraphe du parent (Impacté par la règle globale !)&lt;/p&gt;
  &lt;app-header&gt;
    &lt;p&gt;Paragraphe de l'enfant&lt;/p&gt;
  &lt;/app-header&gt;
&lt;/app-root&gt;
} @else {
&lt;app-root&gt;
  &lt;p&gt;Paragraphe du parent&lt;/p&gt;
  &lt;app-header&gt;
    #shadow-root (open)
      &lt;p&gt;Paragraphe de l'enfant isolé par le Shadow DOM&lt;/p&gt;
  &lt;/app-header&gt;
&lt;/app-root&gt;
}</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mode-selector-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .selector-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;

      .sel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--text-main);

        code { color: #dd0031; }
      }
    }

    .mode-buttons {
      display: flex;
      gap: 6px;
    }

    .mode-btn {
      padding: 6px 14px;
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
        background: #3178c6;
        color: #ffffff;
        border-color: #3178c6;
        box-shadow: 0 2px 6px rgba(49, 120, 198, 0.4);
      }

      &.mode-btn-danger.active {
        background: #ef4444;
        border-color: #ef4444;
        box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
      }
    }

    .mode-explanation-alert {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      line-height: 1.45;

      &.alert-emulated {
        background: rgba(16, 185, 129, 0.1);
        border-left: 3px solid #10b981;
        color: var(--text-main);
      }

      &.alert-none {
        background: rgba(239, 68, 68, 0.1);
        border-left: 3px solid #ef4444;
        color: var(--text-main);
      }

      &.alert-shadowdom {
        background: rgba(49, 120, 198, 0.1);
        border-left: 3px solid #3178c6;
        color: var(--text-main);
      }
    }

    .encapsulation-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      min-height: 520px;
    }

    .render-visual-panel, .compilation-visual-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 18px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;

      .header-title {
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--text-main);
      }

      .leak-indicator {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;

        &.leaking {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          animation: pulse 1.5s infinite;
        }
      }
    }

    .component-box {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.parent-box {
        background: var(--bg-subtle);
        border: 2px dashed rgba(49, 120, 198, 0.4);
      }

      &.child-box {
        background: var(--bg-card);
        border: 2px solid rgba(147, 51, 234, 0.5);
      }
    }

    .comp-tag {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 700;

      .tag-attr {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.1);
        padding: 1px 6px;
        border-radius: 4px;
      }
    }

    .parent-tag { color: #3178c6; }
    .child-tag { color: #c084fc; }

    .parent-paragraph {
      font-size: 0.88rem;
      color: var(--text-main);
      padding: 10px 14px;
      background: var(--bg-app);
      border-radius: 6px;
      border: 1px solid var(--border-color);
      line-height: 1.45;
      transition: all 0.3s;

      &.leaked-purple {
        color: #c084fc !important;
        font-style: italic !important;
        font-weight: bold !important;
        border-color: #9333ea !important;
        background: rgba(147, 51, 234, 0.1) !important;
      }
    }

    .css-rule-badge {
      font-size: 0.76rem;
      color: var(--text-dim);
      code {
        color: #c084fc;
        font-weight: 700;
      }
    }

    .child-paragraph {
      font-size: 0.88rem;
      color: #c084fc !important;
      font-style: italic !important;
      font-weight: bold !important;
      padding: 10px 14px;
      background: var(--bg-app);
      border-radius: 6px;
      border: 1px solid rgba(147, 51, 234, 0.3);
      line-height: 1.45;
    }

    /* Compilation visualizer */
    .transform-block {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .block-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-dim);
      }
    }

    .code-box {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      margin: 0;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: #e2e8f0;
      line-height: 1.45;
      overflow-x: auto;
    }

    .hl-css {
      color: #38bdf8;
      font-weight: 800;
      background: rgba(56, 189, 248, 0.15);
      padding: 0 4px;
      border-radius: 3px;
    }

    .hl-leak {
      color: #f87171;
      font-weight: 800;
      background: rgba(239, 68, 68, 0.2);
      padding: 0 4px;
      border-radius: 3px;
    }

    .hl-attr {
      color: #fb923c;
    }

    .hl-match {
      color: #34d399;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.15);
      padding: 0 4px;
      border-radius: 3px;
    }
  `]
})
export class ViewEncapsulationComponent {
  readonly selectedMode = signal<EncapsulationMode>('Emulated');

  setMode(mode: EncapsulationMode): void {
    this.selectedMode.set(mode);
  }
}
