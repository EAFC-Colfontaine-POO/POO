import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentPart } from '../../core/models/app.models';

@Component({
  selector: 'app-standalone-anatomy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Composant Standalone — Anatomie & Déconstructeur</div>
        <h2>4. Anatomie d'un Composant Standalone & Mode Rayons X</h2>
        <p class="module-desc">
          En Angular, l'interface est un arbre de composants autonomes (<em>Standalone Components</em>).
          Survolez ou cliquez sur les différentes zones du fichier <code>app.component.ts</code> pour activer le
          <strong>Mode Rayons X</strong> et visualiser en temps réel l'impact direct de chaque métadonnée dans
          le template HTML, les styles CSS scopés ou le document racine.
        </p>
      </div>

      <div class="anatomy-grid">
        <!-- Déconstructeur de code interactif -->
        <div class="card-panel code-deconstructor-panel">
          <div class="panel-top-bar">
            <div class="file-name">
              <span class="ts-tag">TS</span>
              <span>src/app/app.component.ts</span>
            </div>
            <span class="badge badge-purple">Mode Rayons X actif</span>
          </div>

          <div class="interactive-code-editor">
            <!-- Lignes de code avec blocs cliquables/survolables -->
            <div class="code-line import-line">
              <span class="kw">import</span> &#123; <span class="fn">Component</span> &#125; <span class="kw">from</span> <span class="str">'&#64;angular/core'</span>;
            </div>
            <div class="code-line import-line">
              <span class="kw">import</span> &#123; <span class="fn">HeaderComponent</span> &#125; <span class="kw">from</span> <span class="str">'./components/header/header.component'</span>;
            </div>
            <div class="code-line">&nbsp;</div>

            <!-- Décorateur -->
            <div 
              class="code-block-zone decorator-zone" 
              [class.active-zone]="selectedPart()?.id === 'decorator'"
              (mouseenter)="hoverPart('decorator')"
              (click)="selectPart('decorator')"
            >
              <div class="zone-label">&#64;Component Decorator</div>
              <div class="code-line"><span class="dec">&#64;Component</span>(&#123;</div>

              <div 
                class="code-line indent part-item" 
                [class.highlighted]="selectedPart()?.id === 'selector'"
                (mouseenter)="hoverPart('selector')"
                (click)="selectPart('selector')"
              >
                <span class="prop">selector</span>: <span class="str">'app-root'</span>,
                <span class="xray-indicator">🔍 Rayons X : index.html</span>
              </div>

              <div 
                class="code-line indent part-item" 
                [class.highlighted]="selectedPart()?.id === 'standalone'"
                (mouseenter)="hoverPart('standalone')"
                (click)="selectPart('standalone')"
              >
                <span class="prop">standalone</span>: <span class="bool">true</span>,
                <span class="xray-indicator">⚡ Zéro NgModule</span>
              </div>

              <div 
                class="code-line indent part-item" 
                [class.highlighted]="selectedPart()?.id === 'imports'"
                (mouseenter)="hoverPart('imports')"
                (click)="selectPart('imports')"
              >
                <span class="prop">imports</span>: [<span class="fn">HeaderComponent</span>],
                <span class="xray-indicator">📦 Dépendances explicites</span>
              </div>

              <div 
                class="code-line indent part-item" 
                [class.highlighted]="selectedPart()?.id === 'templateUrl'"
                (mouseenter)="hoverPart('templateUrl')"
                (click)="selectPart('templateUrl')"
              >
                <span class="prop">templateUrl</span>: <span class="str">'./app.component.html'</span>,
                <span class="xray-indicator">👁️ Vue HTML liée</span>
              </div>

              <div 
                class="code-line indent part-item" 
                [class.highlighted]="selectedPart()?.id === 'styleUrl'"
                (mouseenter)="hoverPart('styleUrl')"
                (click)="selectPart('styleUrl')"
              >
                <span class="prop">styleUrl</span>: <span class="str">'./app.component.css'</span>
                <span class="xray-indicator">🎨 Styles scopés</span>
              </div>

              <div class="code-line">&#125;)</div>
            </div>

            <div class="code-line">&nbsp;</div>

            <!-- Classe TypeScript -->
            <div 
              class="code-block-zone class-zone"
              [class.active-zone]="selectedPart()?.id === 'class'"
              (mouseenter)="hoverPart('class')"
              (click)="selectPart('class')"
            >
              <div class="zone-label">Classe TypeScript (État & Logique)</div>
              <div class="code-line"><span class="kw">export class</span> <span class="cls">AppComponent</span> &#123;</div>

              <div 
                class="code-line indent part-item"
                [class.highlighted]="selectedPart()?.id === 'prop-course'"
                (mouseenter)="hoverPart('prop-course')"
                (click)="selectPart('prop-course')"
              >
                <span class="field">courseName</span>: <span class="type">string</span> = <span class="str">'Programmation Orientée Objet'</span>;
              </div>

              <div 
                class="code-line indent part-item"
                [class.highlighted]="selectedPart()?.id === 'prop-status'"
                (mouseenter)="hoverPart('prop-status')"
                (click)="selectPart('prop-status')"
              >
                <span class="field">isOnline</span>: <span class="type">boolean</span> = <span class="bool">true</span>;
              </div>

              <div class="code-line indent">&nbsp;</div>

              <div 
                class="code-line indent part-item"
                [class.highlighted]="selectedPart()?.id === 'method-toggle'"
                (mouseenter)="hoverPart('method-toggle')"
                (click)="selectPart('method-toggle')"
              >
                <span class="fn">toggleStatus</span>(): <span class="type">void</span> &#123;
              </div>
              <div class="code-line double-indent">
                <span class="kw">this</span>.isOnline = !<span class="kw">this</span>.isOnline;
              </div>
              <div class="code-line indent">&#125;</div>

              <div class="code-line">&#125;</div>
            </div>
          </div>
        </div>

        <!-- Panneau Rayons X (Visualisation d'impact liée) -->
        <div class="card-panel xray-panel">
          <div class="xray-header">
            <div class="xray-title">
              <span class="laser-icon">⚡</span>
              <span>Visualiseur Rayons X : Impact dans l'Application</span>
            </div>
            <span class="target-badge" [ngClass]="'target-' + activePart().xrayTarget">
              Cible : {{ getTargetLabel(activePart().xrayTarget) }}
            </span>
          </div>

          <div class="xray-explanation-card">
            <h4 class="part-title">{{ activePart().name }}</h4>
            <div class="part-role">{{ activePart().role }}</div>
            <div class="part-impact">
              <strong>Impact technique :</strong> {{ activePart().xrayExplanation }}
            </div>
          </div>

          <!-- Code lié avec mise en valeur laser -->
          <div class="linked-code-container">
            <div class="linked-code-bar">
              <span>Fichier impacté : <code>{{ getTargetFilename(activePart().xrayTarget) }}</code></span>
              <span class="glow-tag">Liaison Détectée</span>
            </div>
            <pre class="linked-code-snippet"><code>{{ activePart().xrayLinkedSnippet }}</code></pre>
          </div>

          <!-- Mini simulateur de rendu associé -->
          <div class="preview-mini-box">
            <div class="mini-box-label">Aperçu Réel du Rendu Navigateur :</div>
            <div class="mini-browser-view">
              <div class="sample-card">
                <div class="sample-header">
                  <span>🎓 En-tête (HeaderComponent)</span>
                </div>
                <h4>Cours de Programmation Orientée Objet</h4>
                <p>
                  Statut : 
                  <span class="status-pill" [class.online]="true">En direct</span>
                </p>
                <button class="sample-btn">Changer le statut</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .anatomy-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      min-height: 560px;
    }

    .code-deconstructor-panel, .xray-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .panel-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;

      .file-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .ts-tag {
        background: #3178c6;
        color: #fff;
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 0.7rem;
      }
    }

    .interactive-code-editor {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      overflow-x: auto;
    }

    .code-line {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 2px 6px;
      border-radius: 4px;
      color: #e2e8f0;

      &.indent { padding-left: 24px; }
      &.double-indent { padding-left: 44px; }
    }

    .code-block-zone {
      position: relative;
      border: 1px dashed var(--border-color);
      border-radius: 6px;
      padding: 8px 4px;
      margin: 4px 0;
      transition: all 0.2s;

      .zone-label {
        position: absolute;
        top: -9px;
        right: 12px;
        background: var(--bg-card);
        padding: 0 6px;
        font-size: 0.65rem;
        color: var(--text-dim);
        font-weight: 700;
        border-radius: 3px;
        border: 1px solid var(--border-subtle);
      }

      &:hover, &.active-zone {
        border-color: #dd0031;
        background: rgba(221, 0, 49, 0.03);
      }
    }

    .part-item {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      transition: all 0.15s;

      .xray-indicator {
        font-size: 0.68rem;
        opacity: 0;
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.1);
        padding: 1px 6px;
        border-radius: 4px;
        transition: opacity 0.15s;
      }

      &:hover, &.highlighted {
        background: rgba(221, 0, 49, 0.15);
        color: #ffffff;
        font-weight: 600;

        .xray-indicator {
          opacity: 1;
        }
      }
    }

    /* Coloration syntaxique */
    .kw { color: #f43f5e; font-weight: 700; }
    .dec { color: #eab308; font-weight: 700; }
    .cls { color: #38bdf8; font-weight: 700; }
    .prop { color: #a5b4fc; }
    .str { color: #34d399; }
    .bool { color: #f59e0b; }
    .fn { color: #60a5fa; }
    .type { color: #c084fc; }
    .field { color: #e2e8f0; }

    /* Panneau Rayons X */
    .xray-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;

      .xray-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--text-main);
      }
    }

    .target-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;

      &.target-html { background: rgba(234, 88, 12, 0.2); color: #fb923c; }
      &.target-css { background: rgba(147, 51, 234, 0.2); color: #c084fc; }
      &.target-index { background: rgba(16, 185, 129, 0.2); color: #34d399; }
      &.target-ts { background: rgba(49, 120, 198, 0.2); color: #60a5fa; }
    }

    .xray-explanation-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .part-title {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .part-role {
        font-size: 0.85rem;
        color: #dd0031;
        font-weight: 600;
      }

      .part-impact {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    .linked-code-container {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .linked-code-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 12px;
        background: var(--terminal-header, #121826);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.75rem;
        color: var(--text-muted);
      }

      .glow-tag {
        font-size: 0.68rem;
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        padding: 1px 6px;
        border-radius: 4px;
        font-weight: 700;
        animation: pulse 2s infinite;
      }

      .linked-code-snippet {
        padding: 12px;
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: #f8fafc;
        line-height: 1.45;
        overflow-x: auto;
      }
    }

    .preview-mini-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;

      .mini-box-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-dim);
        margin-bottom: 8px;
      }

      .sample-card {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 14px;

        .sample-header {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 8px;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 6px;
        }

        h4 { margin: 0 0 6px 0; color: var(--text-main); font-size: 0.95rem; }
        p { margin: 0 0 10px 0; font-size: 0.82rem; color: var(--text-muted); }

        .status-pill {
          font-weight: 700;
          color: #10b981;
        }

        .sample-btn {
          background: #dd0031;
          color: #ffffff;
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 600;
        }
      }
    }
  `]
})
export class StandaloneAnatomyComponent {
  readonly parts: ComponentPart[] = [
    {
      id: 'selector',
      type: 'metadata',
      name: "selector: 'app-root'",
      codeSnippet: "selector: 'app-root'",
      role: 'Sélecteur de balise personnalisée HTML',
      xrayTarget: 'index',
      xrayExplanation: "Définit le nom de la balise HTML (<app-root></app-root>) que le navigateur doit cibler pour y injecter le composant. Lorsqu'Angular démarre, il recherche précisément cette balise dans index.html.",
      xrayLinkedSnippet: `<!-- Dans src/index.html -->
<body>
  <!-- 🔍 Angular repère cette balise grâce à selector: 'app-root' -->
  <app-root></app-root>
</body>`
    },
    {
      id: 'standalone',
      type: 'metadata',
      name: 'standalone: true',
      codeSnippet: 'standalone: true',
      role: 'Composant Autonome Moderne',
      xrayTarget: 'ts',
      xrayExplanation: 'Indique qu\'il s\'agit d\'un composant autonome. Il n\'a plus besoin d\'être déclaré dans un NgModule. Il gère lui-même ses importations de dépendances.',
      xrayLinkedSnippet: `// Aucune déclaration nécessaire dans un ancien AppModule !
// Le composant est directement amorçable via :
bootstrapApplication(AppComponent, appConfig);`
    },
    {
      id: 'imports',
      type: 'metadata',
      name: 'imports: [HeaderComponent]',
      codeSnippet: 'imports: [HeaderComponent]',
      role: 'Tableau des Dépendances du Template',
      xrayTarget: 'html',
      xrayExplanation: 'Déclare explicitement les sous-composants, directives ou pipes utilisés dans app.component.html. Si HeaderComponent n\'est pas dans imports, la balise <app-header> provoquera une erreur de compilation.',
      xrayLinkedSnippet: `<!-- Dans src/app/app.component.html -->
<!-- 🔍 rendu possible car HeaderComponent est dans imports: [HeaderComponent] -->
<app-header></app-header>

<div class="card">
  <h1>...</h1>
</div>`
    },
    {
      id: 'templateUrl',
      type: 'metadata',
      name: "templateUrl: './app.component.html'",
      codeSnippet: "templateUrl: './app.component.html'",
      role: 'Chemin vers le Template de la Vue',
      xrayTarget: 'html',
      xrayExplanation: 'Lien vers le fichier HTML définissant la vue et la structure graphique. Angular compile ce fichier et lie son contenu aux propriétés de la classe.',
      xrayLinkedSnippet: `<!-- src/app/app.component.html -->
<div class="card">
  <h1>Cours de {{ courseName }}</h1>
  <button (click)="toggleStatus()">Changer le statut</button>
</div>`
    },
    {
      id: 'styleUrl',
      type: 'metadata',
      name: "styleUrl: './app.component.css'",
      codeSnippet: "styleUrl: './app.component.css'",
      role: 'Feuille de Styles CSS Scopée',
      xrayTarget: 'css',
      xrayExplanation: 'Styles appliqués exclusivement au template de ce composant. Angular isole ces règles via ViewEncapsulation pour éviter toute fuite vers d\'autres composants.',
      xrayLinkedSnippet: `/* src/app/app.component.css */
.card {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
}`
    },
    {
      id: 'prop-course',
      type: 'property',
      name: "courseName: string = 'Programmation Orientée Objet'",
      codeSnippet: "courseName: string = 'Programmation Orientée Objet'",
      role: 'Propriété d\'état public (Liée à la vue)',
      xrayTarget: 'html',
      xrayExplanation: 'Cette variable d\'instance est directement consommée par le template via l\'interpolation {{ courseName }}. Dès qu\'elle est modifiée, Angular met à jour le texte correspondant dans le DOM.',
      xrayLinkedSnippet: `<!-- Dans src/app/app.component.html -->
<!-- 🔍 Évalue en direct la propriété courseName de la classe -->
<h1>Cours de {{ courseName }}</h1>`
    },
    {
      id: 'prop-status',
      type: 'property',
      name: 'isOnline: boolean = true',
      codeSnippet: 'isOnline: boolean = true',
      role: 'Propriété Booléenne Réactive',
      xrayTarget: 'html',
      xrayExplanation: 'Permet de conditionner le rendu visuel ou des classes CSS dynamiques, par exemple [class.online]="isOnline".',
      xrayLinkedSnippet: `<!-- Dans src/app/app.component.html -->
<span [class.online]="isOnline" [class.offline]="!isOnline">
  {{ isOnline ? 'En direct' : 'Hors ligne' }}
</span>`
    },
    {
      id: 'method-toggle',
      type: 'method',
      name: 'toggleStatus(): void',
      codeSnippet: 'toggleStatus(): void { this.isOnline = !this.isOnline; }',
      role: 'Méthode Gestionnaire d\'Événement (Event Handler)',
      xrayTarget: 'html',
      xrayExplanation: 'Invoquée lors du clic de l\'utilisateur via la liaison d\'événement (click)="toggleStatus()". Elle modifie la propriété isOnline et déclenche la détection de changements.',
      xrayLinkedSnippet: `<!-- Dans src/app/app.component.html -->
<!-- 🔍 Écoute l'événement clic et appelle la méthode de classe -->
<button (click)="toggleStatus()">Changer le statut</button>`
    },
    {
      id: 'decorator',
      type: 'decorator',
      name: 'Décorateur @Component',
      codeSnippet: '@Component({ ... })',
      role: 'Métadonnées de Configuration du Composant',
      xrayTarget: 'ts',
      xrayExplanation: 'Le décorateur @Component est une fonction TypeScript qui attache des métadonnées cruciales à la classe AppComponent pour transformer une simple classe ES6 en composant Angular.',
      xrayLinkedSnippet: `// Le compilateur Angular utilise ces métadonnées pour générer la définition du composant :
// ɵcmp = ɵɵdefineComponent({ ... })`
    },
    {
      id: 'class',
      type: 'class',
      name: 'Classe AppComponent',
      codeSnippet: 'export class AppComponent { ... }',
      role: 'Logique Applicative & Modèle de Données',
      xrayTarget: 'ts',
      xrayExplanation: 'Contient l\'état interne (propriétés) et le comportement métier (méthodes) de ce composant.',
      xrayLinkedSnippet: `const app = new AppComponent();
console.log(app.courseName); // 'Programmation Orientée Objet'`
    }
  ];

  readonly selectedPart = signal<ComponentPart | null>(this.parts[0]);

  activePart(): ComponentPart {
    return this.selectedPart() || this.parts[0];
  }

  hoverPart(id: string): void {
    const found = this.parts.find(p => p.id === id);
    if (found) {
      this.selectedPart.set(found);
    }
  }

  selectPart(id: string): void {
    const found = this.parts.find(p => p.id === id);
    if (found) {
      this.selectedPart.set(found);
    }
  }

  getTargetLabel(target: string): string {
    switch (target) {
      case 'html': return 'Template HTML (Vue)';
      case 'css': return 'Styles CSS (Scopés)';
      case 'index': return 'index.html (Racine)';
      case 'ts': return 'TypeScript (Logique)';
      default: return target;
    }
  }

  getTargetFilename(target: string): string {
    switch (target) {
      case 'html': return 'src/app/app.component.html';
      case 'css': return 'src/app/app.component.css';
      case 'index': return 'src/index.html';
      case 'ts': return 'src/app/app.component.ts';
      default: return '';
    }
  }
}
