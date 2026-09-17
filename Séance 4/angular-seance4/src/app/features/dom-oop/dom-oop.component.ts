import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

interface DomNodeInfo {
  tag: string;
  name: string;
  oopClass: string;
  inheritance: string[];
  properties: Record<string, string | boolean | number>;
  methods: string[];
  explanation: string;
}

@Component({
  selector: 'app-dom-oop',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 01</span>
          <span class="badge badge-html">HTML5</span>
          <span class="badge badge-purple">DOM & POO</span>
        </div>
        <h2>1. Le Trio du Web, le HTML & le DOM (Lien avec la POO)</h2>
        <p class="module-desc">
          Comprenez comment le navigateur transforme le balisage HTML textuel en un véritable arbre d'objets vivants instanciés en mémoire vive (RAM). En POO, chaque balise devient une instance d'une classe TypeScript/JavaScript avec héritage et accesseurs.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'theory'"
            (click)="activeMode.set('theory')"
          >
            <span>📖 Démonstrateur Interactif & Théorie</span>
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            <span>🧪 Ateliers Monaco (Labo 1 · 4 défis)</span>
          </button>
        </div>
      </div>

      @if (activeMode() === 'theory') {
        <!-- Trio du Web Récapitulatif -->
        <div class="grid-trio">
          <div class="card-panel trio-card html-card">
            <div class="trio-icon">🦴</div>
            <h4>HTML : Le Squelette & Sémantique</h4>
            <p>Définit la structure et le sens du document. Aucun calcul ni logique.</p>
            <div class="code-pill">&lt;button id="btn"&gt;Action&lt;/button&gt;</div>
          </div>
          <div class="card-panel trio-card css-card">
            <div class="trio-icon">🎨</div>
            <h4>CSS : L'Habillage & Mise en page</h4>
            <p>Définit l'apparence visuelle, les couleurs, espacements et responsive.</p>
            <div class="code-pill">button &#123; background: #7952b3; &#125;</div>
          </div>
          <div class="card-panel trio-card js-card">
            <div class="trio-icon">⚡</div>
            <h4>TS / Angular : Les Muscles & la Logique</h4>
            <p>Interagit directement avec les objets du DOM instanciés en mémoire.</p>
            <div class="code-pill">btn.addEventListener('click', ...)</div>
          </div>
        </div>

        <!-- 1. Visualiseur Interactif d'Arbre DOM & Focus POO -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>🌳 Inspecteur d'Arbre DOM & Focus POO (Héritage d'Objets)</h3>
            <span class="badge badge-purple">Cliquez sur un nœud pour inspecter sa classe POO</span>
          </div>

          <p class="panel-sub">
            Le HTML n'est qu'un texte sérialisé. Le moteur du navigateur l'analyse et exécute en mémoire : <code>new HTMLButtonElement()</code>.
          </p>

          <div class="dom-inspector-layout">
            <!-- Arbre Visuel Hiérarchique -->
            <div class="tree-pane">
              <div class="tree-node root-node" [class.selected]="selectedNodeKey() === 'document'" (click)="selectNode('document')">
                <span class="node-icon">📄</span>
                <span class="node-tag">#document</span>
                <span class="node-class">Document</span>
              </div>

              <div class="tree-branch">
                <div class="tree-node" [class.selected]="selectedNodeKey() === 'html'" (click)="selectNode('html')">
                  <span class="node-tag">&lt;html&gt;</span>
                  <span class="node-class">HTMLHtmlElement</span>
                </div>

                <div class="tree-sub-branch">
                  <div class="tree-node" [class.selected]="selectedNodeKey() === 'head'" (click)="selectNode('head')">
                    <span class="node-tag">&lt;head&gt;</span>
                    <span class="node-class">HTMLHeadElement</span>
                  </div>

                  <div class="tree-node" [class.selected]="selectedNodeKey() === 'body'" (click)="selectNode('body')">
                    <span class="node-tag">&lt;body&gt;</span>
                    <span class="node-class">HTMLBodyElement</span>
                  </div>

                  <div class="tree-children-branch">
                    <div class="tree-node highlight-child" [class.selected]="selectedNodeKey() === 'h1'" (click)="selectNode('h1')">
                      <span class="node-tag">&lt;h1&gt;</span>
                      <span class="node-class">HTMLHeadingElement</span>
                    </div>

                    <div class="tree-node highlight-child" [class.selected]="selectedNodeKey() === 'button'" (click)="selectNode('button')">
                      <span class="node-tag">&lt;button#btn-valider&gt;</span>
                      <span class="node-class">HTMLButtonElement</span>
                    </div>

                    <div class="tree-node highlight-child" [class.selected]="selectedNodeKey() === 'input'" (click)="selectNode('input')">
                      <span class="node-tag">&lt;input.form-control&gt;</span>
                      <span class="node-class">HTMLInputElement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fiche d'Inspection POO -->
            <div class="oop-card">
              <div class="oop-card-header">
                <div class="oop-title-row">
                  <span class="badge badge-html">&lt;{{ activeNode().tag }}&gt;</span>
                  <span class="oop-class-name">{{ activeNode().oopClass }}</span>
                </div>
                <p class="oop-desc">{{ activeNode().explanation }}</p>
              </div>

              <!-- Chaîne d'héritage visuelle -->
              <div class="inheritance-box">
                <div class="box-label">🧬 Chaîne d'héritage prototypale (POO JavaScript) :</div>
                <div class="inheritance-steps">
                  @for (step of activeNode().inheritance; track step; let last = $last) {
                    <div class="inherit-step" [class.current]="last">
                      <span class="step-name">{{ step }}</span>
                    </div>
                    @if (!last) {
                      <span class="inherit-arrow">➔</span>
                    }
                  }
                </div>
              </div>

              <!-- Propriétés instanciées en mémoire -->
              <div class="props-box">
                <div class="box-label">📦 Propriétés instanciées en RAM (Accesseurs / État) :</div>
                <div class="props-grid">
                  @for (prop of getPropsList(); track prop.key) {
                    <div class="prop-item">
                      <span class="prop-key">{{ prop.key }}</span>
                      <span class="prop-val">{{ prop.val }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Méthodes héritées -->
              <div class="methods-box">
                <div class="box-label">⚙️ Méthodes héritées disponibles :</div>
                <div class="methods-pills">
                  @for (m of activeNode().methods; track m) {
                    <span class="method-pill">{{ m }}</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Laboratoire Blocs vs En-ligne -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>📦 Laboratoire Éléments Blocs vs En-Ligne (Inline)</h3>
            <span class="badge badge-css">Comportement physique dans le flux</span>
          </div>

          <div class="block-inline-grid">
            <div class="theory-box">
              <div class="block-def">
                <h5 class="text-blue">Éléments Bloc (<code>display: block</code>)</h5>
                <p>Occupe <strong>100% de la largeur</strong> disponible. Provoque toujours un <strong>retour à la ligne</strong> avant et après. Respecte <code>width</code>, <code>height</code> et les marges verticales.</p>
                <div class="tags-list"><code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;h1&gt;-&lt;h6&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;section&gt;</code></div>
              </div>

              <div class="inline-def mt-3">
                <h5 class="text-green">Éléments En-Ligne (<code>display: inline</code>)</h5>
                <p>Prend <strong>uniquement la largeur de son contenu</strong>. Reste <strong>sur la même ligne</strong> dans le texte. Ignore <code>width</code>, <code>height</code> et les marges verticales.</p>
                <div class="tags-list"><code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;code&gt;</code></div>
              </div>
            </div>

            <div class="sandbox-box">
              <div class="sandbox-controls">
                <span>Tester la propriété CSS sur l'élément témoin :</span>
                <div class="btn-group">
                  <button class="pill-toggle" [class.active]="testDisplay() === 'inline'" (click)="testDisplay.set('inline')">display: inline</button>
                  <button class="pill-toggle" [class.active]="testDisplay() === 'block'" (click)="testDisplay.set('block')">display: block</button>
                  <button class="pill-toggle" [class.active]="testDisplay() === 'inline-block'" (click)="testDisplay.set('inline-block')">display: inline-block</button>
                </div>
              </div>

              <div class="sandbox-preview">
                <div class="preview-text-stream">
                  Texte avant...
                  <span class="witness-element" [style.display]="testDisplay()">
                    Élément témoin ({{ testDisplay() }})
                  </span>
                  ...Texte qui continue après dans le flux naturel.
                </div>
              </div>

              <div class="metric-summary">
                <div class="metric-item">
                  <span class="m-label">Largeur :</span>
                  <span class="m-val">{{ testDisplay() === 'block' ? '100% (pleine largeur)' : 'Ajustée au texte' }}</span>
                </div>
                <div class="metric-item">
                  <span class="m-label">Saut de ligne :</span>
                  <span class="m-val">{{ testDisplay() === 'block' ? 'Oui (automatique)' : 'Non (reste dans le texte)' }}</span>
                </div>
                <div class="metric-item">
                  <span class="m-label">Accepte width/height :</span>
                  <span class="m-val">{{ testDisplay() === 'inline' ? 'Non (ignoré)' : 'Oui (pris en compte)' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Atelier Pratique (Monaco Editor) -->
        <app-code-runner [labNumber]="1"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .grid-trio {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    .trio-card {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .trio-icon {
        font-size: 1.8rem;
      }

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .code-pill {
        margin-top: auto;
        padding: 5px 10px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: #c4b5fd;
      }
    }

    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 6px;

      h3 {
        font-size: 1.15rem;
        font-weight: 800;
      }
    }

    .panel-sub {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .dom-inspector-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .tree-pane {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tree-branch, .tree-sub-branch, .tree-children-branch {
      margin-left: 18px;
      border-left: 2px dashed var(--border-color);
      padding-left: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tree-node {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;

      &:hover {
        border-color: #7952b3;
        background: var(--bg-card-hover);
      }

      &.selected {
        border-color: #7952b3;
        background: rgba(121, 82, 179, 0.2);
        .node-tag { color: #c4b5fd; font-weight: 700; }
      }

      .node-tag {
        font-family: var(--font-mono);
        color: var(--text-main);
      }

      .node-class {
        margin-left: auto;
        font-size: 0.7rem;
        color: var(--text-dim);
      }
    }

    .oop-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .oop-card-header {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .oop-title-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .oop-class-name {
        font-size: 1.1rem;
        font-weight: 800;
        color: #c4b5fd;
        font-family: var(--font-mono);
      }

      .oop-desc {
        font-size: 0.85rem;
        color: var(--text-muted);
      }
    }

    .box-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .inheritance-steps {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .inherit-step {
        padding: 4px 10px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.78rem;
        font-family: var(--font-mono);
        color: var(--text-muted);

        &.current {
          background: rgba(121, 82, 179, 0.25);
          color: #c4b5fd;
          border-color: #7952b3;
          font-weight: 700;
        }
      }

      .inherit-arrow {
        color: var(--text-dim);
        font-size: 0.8rem;
      }
    }

    .props-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;

      .prop-item {
        background: var(--bg-card);
        padding: 6px 10px;
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 0.75rem;

        .prop-key { color: #60a5fa; }
        .prop-val { color: #34d399; }
      }
    }

    .methods-pills {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .method-pill {
        padding: 3px 8px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        font-size: 0.72rem;
        font-family: var(--font-mono);
        color: var(--text-muted);
      }
    }

    .block-inline-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 10px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .theory-box {
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 0.84rem;

      .text-blue { color: #60a5fa; font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
      .text-green { color: #34d399; font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
      p { color: var(--text-muted); line-height: 1.45; }
      .tags-list { margin-top: 6px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim); }
    }

    .sandbox-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .sandbox-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--text-muted);

      .btn-group {
        display: flex;
        gap: 6px;
      }

      .pill-toggle {
        padding: 5px 12px;
        border-radius: 6px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        font-size: 0.78rem;

        &.active {
          background: #7952b3;
          color: white;
          border-color: #7952b3;
          font-weight: 600;
        }
      }
    }

    .sandbox-preview {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 16px;
      min-height: 90px;
      display: flex;
      align-items: center;

      .preview-text-stream {
        font-size: 0.86rem;
        line-height: 1.8;
      }

      .witness-element {
        background: #7952b3;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: bold;
        margin: 4px;
      }
    }

    .metric-summary {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: var(--bg-card);
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.8rem;

      .metric-item {
        display: flex;
        justify-content: space-between;
        .m-label { color: var(--text-muted); }
        .m-val { font-weight: 600; color: #c4b5fd; }
      }
    }
  `]
})
export class DomOopComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');
  readonly selectedNodeKey = signal<string>('button');
  readonly testDisplay = signal<'inline' | 'block' | 'inline-block'>('inline');

  private readonly nodesData: Record<string, DomNodeInfo> = {
    document: {
      tag: '#document',
      name: 'Document racine',
      oopClass: 'HTMLDocument',
      inheritance: ['EventTarget', 'Node', 'Document', 'HTMLDocument'],
      properties: {
        title: 'Séance 4 — HTML/CSS',
        URL: 'http://localhost:4200/',
        readyState: 'complete',
        compatMode: 'CSS1Compat'
      },
      methods: ['getElementById()', 'querySelector()', 'createElement()', 'addEventListener()'],
      explanation: 'Le point d\'entrée du DOM représentant l\'intégralité de la page web chargée en mémoire.'
    },
    html: {
      tag: 'html',
      name: 'Racine HTML',
      oopClass: 'HTMLHtmlElement',
      inheritance: ['EventTarget', 'Node', 'Element', 'HTMLElement', 'HTMLHtmlElement'],
      properties: {
        lang: 'fr',
        nodeName: 'HTML',
        childElementCount: 2
      },
      methods: ['getAttribute()', 'setAttribute()', 'appendChild()'],
      explanation: 'L\'élément racine englobant <head> et <body>.'
    },
    head: {
      tag: 'head',
      name: 'Métadonnées',
      oopClass: 'HTMLHeadElement',
      inheritance: ['EventTarget', 'Node', 'Element', 'HTMLElement', 'HTMLHeadElement'],
      properties: {
        nodeName: 'HEAD',
        childElementCount: 4
      },
      methods: ['appendChild()', 'removeChild()'],
      explanation: 'Contient les métadonnées (charset, title, liens CSS Bootstrap).'
    },
    body: {
      tag: 'body',
      name: 'Corps du document',
      oopClass: 'HTMLBodyElement',
      inheritance: ['EventTarget', 'Node', 'Element', 'HTMLElement', 'HTMLBodyElement'],
      properties: {
        nodeName: 'BODY',
        bgColor: '#ffffff',
        scrollHeight: 920
      },
      methods: ['appendChild()', 'addEventListener()'],
      explanation: 'Englobe tout le contenu visible affiché dans le viewport.'
    },
    h1: {
      tag: 'h1',
      name: 'Titre principal',
      oopClass: 'HTMLHeadingElement',
      inheritance: ['EventTarget', 'Node', 'Element', 'HTMLElement', 'HTMLHeadingElement'],
      properties: {
        nodeName: 'H1',
        innerText: 'Mon Application Web',
        offsetHeight: 42
      },
      methods: ['addEventListener()', 'remove()'],
      explanation: 'Titre de premier niveau sémantique hiérarchique.'
    },
    button: {
      tag: 'button',
      name: 'Bouton d\'action',
      oopClass: 'HTMLButtonElement',
      inheritance: ['EventTarget', 'Node', 'Element', 'HTMLElement', 'HTMLButtonElement'],
      properties: {
        id: 'btn-valider',
        className: 'btn btn-primary',
        type: 'submit',
        disabled: false,
        innerHTML: 'Cliquer ici',
        offsetHeight: 38
      },
      methods: ['click()', 'addEventListener()', 'focus()', 'setAttribute()'],
      explanation: 'Instance d\'un bouton interactif. En POO, le gestionnaire de clic délègue vers EventTarget.'
    },
    input: {
      tag: 'input',
      name: 'Champ de saisie',
      oopClass: 'HTMLInputElement',
      inheritance: ['EventTarget', 'Node', 'Element', 'HTMLElement', 'HTMLInputElement'],
      properties: {
        type: 'text',
        value: 'Jean Dupont',
        placeholder: 'Nom...',
        required: true
      },
      methods: ['focus()', 'select()', 'checkValidity()'],
      explanation: 'Élément formulaire gérant la saisie utilisateur et la validation native.'
    }
  };

  activeNode(): DomNodeInfo {
    return this.nodesData[this.selectedNodeKey()] || this.nodesData['button'];
  }

  selectNode(key: string): void {
    this.selectedNodeKey.set(key);
  }

  getPropsList(): { key: string; val: string | number | boolean }[] {
    const p = this.activeNode().properties;
    return Object.keys(p).map(k => ({ key: k, val: p[k] }));
  }
}
