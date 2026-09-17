import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';
import { SemanticZone } from '../../core/models/app.models';

@Component({
  selector: 'app-semantic-attributes',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 02</span>
          <span class="badge badge-html">HTML5</span>
          <span class="badge badge-bootstrap">Attributs</span>
        </div>
        <h2>2. Structure Sémantique & Attributs Universels (class vs id)</h2>
        <p class="module-desc">
          Les balises sémantiques donnent du sens aux contenus pour les moteurs de recherche et les aides techniques. Maîtrisez le découpage 2D d'un gabarit HTML5 et la différence fondamentale entre identifiant unique (id) et classes cumulatives (class).
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'theory'"
            (click)="activeMode.set('theory')"
          >
            <span>📖 Gabarit 2D & Démonstrateurs</span>
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            <span>🧪 Ateliers Monaco (Labo 1 · Exercices 1.2 & 1.4)</span>
          </button>
        </div>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Générateur de gabarit sémantique HTML5 2D -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>📐 Schéma 2D Interactif d'une Page Web Sémantique</h3>
            <button class="btn-secondary btn-sm" (click)="copyBoilerplate()">
              {{ copySuccess() ? '✔ Gabarit Copié !' : '📋 Copier le Squelette HTML5' }}
            </button>
          </div>

          <p class="panel-sub">
            Cliquez sur l'une des boîtes colorées pour découvrir son rôle d'accessibilité, ses contraintes d'unicité et son code HTML.
          </p>

          <div class="semantic-explorer-grid">
            <!-- Schéma Visuel 2D -->
            <div class="layout-wireframe">
              <!-- Header -->
              <div 
                class="zone-box zone-header" 
                [class.selected]="selectedZone().tag === 'header'"
                (click)="selectZone('header')"
              >
                <span class="zone-label">&lt;header&gt;</span>
                <span class="zone-sub">En-tête de page ou de section</span>
              </div>

              <!-- Nav -->
              <div 
                class="zone-box zone-nav" 
                [class.selected]="selectedZone().tag === 'nav'"
                (click)="selectZone('nav')"
              >
                <span class="zone-label">&lt;nav&gt;</span>
                <span class="zone-sub">Liens de navigation principale</span>
              </div>

              <!-- Main & Aside -->
              <div class="main-aside-row">
                <div 
                  class="zone-box zone-main" 
                  [class.selected]="selectedZone().tag === 'main'"
                  (click)="selectZone('main')"
                >
                  <div class="zone-label">&lt;main&gt; (Contenu Principal - Strictement Unique)</div>
                  
                  <div class="inner-sections">
                    <div 
                      class="zone-box zone-section" 
                      [class.selected]="selectedZone().tag === 'section'"
                      (click)="$event.stopPropagation(); selectZone('section')"
                    >
                      &lt;section&gt;
                    </div>
                    <div 
                      class="zone-box zone-article" 
                      [class.selected]="selectedZone().tag === 'article'"
                      (click)="$event.stopPropagation(); selectZone('article')"
                    >
                      &lt;article&gt;
                    </div>
                  </div>
                </div>

                <div 
                  class="zone-box zone-aside" 
                  [class.selected]="selectedZone().tag === 'aside'"
                  (click)="selectZone('aside')"
                >
                  <span class="zone-label">&lt;aside&gt;</span>
                  <span class="zone-sub">Sidebar</span>
                </div>
              </div>

              <!-- Footer -->
              <div 
                class="zone-box zone-footer" 
                [class.selected]="selectedZone().tag === 'footer'"
                (click)="selectZone('footer')"
              >
                <span class="zone-label">&lt;footer&gt;</span>
                <span class="zone-sub">Pied de page</span>
              </div>
            </div>

            <!-- Fiche détaillée de la zone active -->
            <div class="zone-detail-card">
              <div class="detail-header">
                <div class="tag-title-row">
                  <span class="badge badge-html">&lt;{{ selectedZone().tag }}&gt;</span>
                  <h4>{{ selectedZone().title }}</h4>
                </div>
                <span class="unicity-pill" [class.strict]="selectedZone().unique">
                  {{ selectedZone().unique ? '⚠️ Unique dans la page' : '✔ Réutilisable' }}
                </span>
              </div>

              <div class="info-block">
                <div class="info-label">🎯 Rôle Sémantique :</div>
                <p>{{ selectedZone().roleExplanation }}</p>
              </div>

              <div class="info-block">
                <div class="info-label">♿ Utilité Accessibilité (Lecteurs d'écran) :</div>
                <p>{{ selectedZone().screenReaderUtility }}</p>
              </div>

              <div class="code-preview-block">
                <div class="info-label">Exemple de balisage HTML :</div>
                <pre><code>{{ selectedZone().exampleHtml }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Comparateur class vs id -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>⚖️ Démonstrateur Interactif : class vs id</h3>
            <span class="badge badge-bootstrap">La clé de voûte de Bootstrap</span>
          </div>

          <p class="panel-sub">
            Découvrez pourquoi <code>class</code> est le mécanisme roi du design réutilisable, tandis que <code>id</code> est réservé aux identifiants stricts.
          </p>

          <div class="comparator-grid">
            <!-- Panneau ID (Unique) -->
            <div class="comp-col id-col">
              <div class="comp-header">
                <span class="badge badge-purple">id="..."</span>
                <h4>Identifiant Unique (Strict)</h4>
              </div>
              <ul class="comp-list">
                <li>• <strong>Unicité absolue :</strong> Ne doit apparaître qu'une seule fois dans tout le document HTML.</li>
                <li>• <strong>Cible technique :</strong> Formulaires (<code>&lt;label for="monId"&gt;</code>), ancres d'URL (<code>href="#monId"</code>).</li>
                <li>• <strong>Sélecteur CSS :</strong> Préfixé par <code>#</code> avec un score élevé de 100 points.</li>
              </ul>

              <div class="interactive-witness">
                <div class="witness-title">Ciblage technique unique :</div>
                <div class="target-demo">
                  <label for="input-email-demo">Email :</label>
                  <input id="input-email-demo" type="email" placeholder="nom@domaine.com" class="demo-input" />
                </div>
                <p class="hint-small">Le clic sur le label active instantanément le champ grâce à l'association <code>for="input-email-demo"</code>.</p>
              </div>
            </div>

            <!-- Panneau Class (Réutilisable & Cumulable) -->
            <div class="comp-col class-col">
              <div class="comp-header">
                <span class="badge badge-bootstrap">class="..."</span>
                <h4>Classe Réutilisable & Cumulable</h4>
              </div>
              <ul class="comp-list">
                <li>• <strong>Partageable :</strong> S'applique à autant d'éléments qu'on le souhaite.</li>
                <li>• <strong>Cumulable :</strong> Un élément peut combiner plusieurs classes séparées par un espace.</li>
                <li>• <strong>Moteur de Bootstrap :</strong> Ex. <code>class="btn btn-primary shadow-sm"</code>.</li>
              </ul>

              <div class="interactive-witness">
                <div class="witness-title">Démonstration de cumul de classes en direct :</div>
                <div class="witness-badges-row">
                  <div class="test-badge" [class.badge-color]="hasColorClass()" [class.badge-shadow]="hasShadowClass()" [class.badge-round]="hasRoundClass()">
                    Composant A
                  </div>
                  <div class="test-badge" [class.badge-color]="hasColorClass()" [class.badge-shadow]="hasShadowClass()" [class.badge-round]="hasRoundClass()">
                    Composant B
                  </div>
                  <div class="test-badge" [class.badge-color]="hasColorClass()" [class.badge-shadow]="hasShadowClass()" [class.badge-round]="hasRoundClass()">
                    Composant C
                  </div>
                </div>

                <div class="classes-toggles">
                  <label><input type="checkbox" [checked]="hasColorClass()" (change)="hasColorClass.set(!hasColorClass())" /> .bg-purple</label>
                  <label><input type="checkbox" [checked]="hasShadowClass()" (change)="hasShadowClass.set(!hasShadowClass())" /> .shadow-lg</label>
                  <label><input type="checkbox" [checked]="hasRoundClass()" (change)="hasRoundClass.set(!hasRoundClass())" /> .rounded-pill</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [labNumber]="1" exerciseId="ex-1-2"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 6px;

      h3 { font-size: 1.15rem; font-weight: 800; }
    }

    .panel-sub {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .semantic-explorer-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 20px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .layout-wireframe {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--bg-subtle);
      padding: 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
    }

    .zone-box {
      border: 2px dashed #3b82f6;
      border-radius: 6px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: rgba(59, 130, 246, 0.08);
      transition: all 0.2s;

      &:hover {
        background: rgba(59, 130, 246, 0.18);
        border-color: #60a5fa;
      }

      &.selected {
        background: rgba(121, 82, 179, 0.25);
        border-color: #a855f7;
        border-style: solid;
        box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
      }

      .zone-label {
        font-family: var(--font-mono);
        font-weight: 700;
        font-size: 0.85rem;
        color: var(--text-main);
      }

      .zone-sub {
        font-size: 0.72rem;
        color: var(--text-muted);
      }
    }

    .zone-header { border-color: #3b82f6; background: rgba(59, 130, 246, 0.12); }
    .zone-nav { border-color: #10b981; background: rgba(16, 185, 129, 0.12); }
    .main-aside-row {
      display: grid;
      grid-template-columns: 3fr 1fr;
      gap: 8px;
      min-height: 140px;
    }
    .zone-main { border-color: #f59e0b; background: rgba(245, 158, 11, 0.1); justify-content: flex-start; }
    .zone-aside { border-color: #ec4899; background: rgba(236, 72, 153, 0.1); }
    .zone-footer { border-color: #64748b; background: rgba(100, 116, 139, 0.12); }

    .inner-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      width: 100%;
      margin-top: 8px;

      .zone-section { border-color: #f97316; font-size: 0.75rem; padding: 6px; }
      .zone-article { border-color: #06b6d4; font-size: 0.75rem; padding: 6px; }
    }

    .zone-detail-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tag-title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        h4 { font-size: 1.1rem; font-weight: 700; }
      }
    }

    .unicity-pill {
      font-size: 0.72rem;
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;

      &.strict {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
      }
    }

    .info-block {
      .info-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
        margin-bottom: 4px;
      }
      p {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    .code-preview-block {
      .info-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
        margin-bottom: 4px;
      }

      pre {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 0.78rem;
        color: #c4b5fd;
        overflow-x: auto;
      }
    }

    .comparator-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    .comp-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .comp-header {
        display: flex;
        align-items: center;
        gap: 10px;
        h4 { font-size: 1rem; font-weight: 700; }
      }

      .comp-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .interactive-witness {
      margin-top: auto;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .witness-title {
        font-size: 0.76rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      .target-demo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.84rem;

        .demo-input {
          flex: 1;
          padding: 6px 10px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: var(--bg-subtle);
          color: var(--text-main);
          font-size: 0.82rem;

          &:focus {
            border-color: #7952b3;
            outline: none;
          }
        }
      }

      .hint-small {
        font-size: 0.74rem;
        color: var(--text-muted);
        font-style: italic;
      }
    }

    .witness-badges-row {
      display: flex;
      gap: 8px;
    }

    .test-badge {
      padding: 6px 14px;
      background: #334155;
      color: white;
      border-radius: 4px;
      font-size: 0.8rem;
      transition: all 0.25s ease;

      &.badge-color { background: #7952b3; }
      &.badge-shadow { box-shadow: 0 4px 14px rgba(121, 82, 179, 0.6); }
      &.badge-round { border-radius: 20px; }
    }

    .classes-toggles {
      display: flex;
      gap: 14px;
      font-size: 0.78rem;
      font-family: var(--font-mono);
      color: var(--text-muted);

      label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
      }
    }
  `]
})
export class SemanticAttributesComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');
  readonly copySuccess = signal<boolean>(false);

  readonly hasColorClass = signal<boolean>(true);
  readonly hasShadowClass = signal<boolean>(false);
  readonly hasRoundClass = signal<boolean>(false);

  readonly selectedZone = signal<SemanticZone>({
    tag: 'main',
    title: 'Contenu Principal',
    role: 'main',
    unique: true,
    roleExplanation: 'Désigne le cœur de contenu directement lié au sujet central de la page ou de l\'application. Il exclut tout contenu répété (en-têtes, pieds de page, menus de navigation).',
    screenReaderUtility: 'Permet aux utilisateurs de lecteurs d\'écran de sauter directement au contenu (« Skip to main content ») sans devoir réécouter toute la barre de navigation.',
    exampleHtml: `<main>\n  <h1>Tableau de Bord</h1>\n  <section>\n    <article>...</article>\n  </section>\n</main>`,
    color: '#f59e0b'
  });

  private readonly zones: Record<string, SemanticZone> = {
    header: {
      tag: 'header',
      title: 'En-tête de page ou de section',
      role: 'banner / header',
      unique: false,
      roleExplanation: 'Représente le groupe introductif d\'une page ou d\'une section. Il accueille typiquement le logo, le titre principal <h1> et parfois la navigation.',
      screenReaderUtility: 'Identifie le point d\'entrée de la page.',
      exampleHtml: `<header>\n  <h1>Mon Application Web</h1>\n  <p>Portail étudiant</p>\n</header>`,
      color: '#3b82f6'
    },
    nav: {
      tag: 'nav',
      title: 'Navigation Principale',
      role: 'navigation',
      unique: false,
      roleExplanation: 'Réservé aux blocs majeurs de liens de navigation interne ou externe.',
      screenReaderUtility: 'Annonce clairement aux synthèses vocales une section de navigation avec le décompte des liens.',
      exampleHtml: `<nav>\n  <ul>\n    <li><a href="/">Accueil</a></li>\n    <li><a href="/profil">Profil</a></li>\n  </ul>\n</nav>`,
      color: '#10b981'
    },
    main: {
      tag: 'main',
      title: 'Contenu Principal',
      role: 'main',
      unique: true,
      roleExplanation: 'Désigne le cœur de contenu directement lié au sujet central de la page. Strictement UNIQUE par document.',
      screenReaderUtility: 'Raccourci essentiel pour sauter directement au contenu applicatif.',
      exampleHtml: `<main>\n  <h2>Liste des cours</h2>\n  <section>...</section>\n</main>`,
      color: '#f59e0b'
    },
    section: {
      tag: 'section',
      title: 'Section Thématique',
      role: 'region',
      unique: false,
      roleExplanation: 'Regroupe un ensemble thématique de contenu, généralement introduit par un titre (<h2>-<h6>).',
      screenReaderUtility: 'Permet la navigation par régions de contenu.',
      exampleHtml: `<section>\n  <h3>Détails du module</h3>\n  <p>Contenu thématique...</p>\n</section>`,
      color: '#f97316'
    },
    article: {
      tag: 'article',
      title: 'Article Autonome',
      role: 'article',
      unique: false,
      roleExplanation: 'Désigne un élément complet, autonome et diffusable indépendamment (ex: article de blog, fiche produit, commentaire).',
      screenReaderUtility: 'Indique une unité d\'information indépendante.',
      exampleHtml: `<article>\n  <h3>Billet de blog</h3>\n  <p>Texte complet...</p>\n</article>`,
      color: '#06b6d4'
    },
    aside: {
      tag: 'aside',
      title: 'Contenu Annexe (Sidebar)',
      role: 'complementary',
      unique: false,
      roleExplanation: 'Contenu indirectement lié au sujet principal (barre latérale, encadré d\'informations, liens connexes).',
      screenReaderUtility: 'Identifié comme contenu complémentaire non indispensable à la compréhension du sujet principal.',
      exampleHtml: `<aside>\n  <h4>Liens connexes</h4>\n  <p>Documentation Bootstrap 5</p>\n</aside>`,
      color: '#ec4899'
    },
    footer: {
      tag: 'footer',
      title: 'Pied de Page',
      role: 'contentinfo',
      unique: false,
      roleExplanation: 'Conclut la page ou une section avec les informations d\'auteur, copyright, liens légaux ou métadonnées.',
      screenReaderUtility: 'Zone d\'informations complémentaires sur le document.',
      exampleHtml: `<footer>\n  <p>© 2026 — EAFC Informatique</p>\n</footer>`,
      color: '#64748b'
    }
  };

  selectZone(tag: string): void {
    if (this.zones[tag]) {
      this.selectedZone.set(this.zones[tag]);
    }
  }

  copyBoilerplate(): void {
    const code = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Structure Sémantique HTML5</title>
</head>
<body>
  <header>
    <h1>Mon Application</h1>
    <nav>
      <ul>
        <li><a href="#">Accueil</a></li>
        <li><a href="#">Cours</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h2>Séance 4 — HTML/CSS & Bootstrap</h2>
      <article>
        <h3>Le DOM</h3>
        <p>Arbre d'objets en mémoire.</p>
      </article>
    </section>

    <aside>
      <h4>Ressources</h4>
      <p>Documentation officielle</p>
    </aside>
  </main>

  <footer>
    <p>© 2026 — Bachelier en informatique</p>
  </footer>
</body>
</html>`;

    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code).then(() => {
        this.copySuccess.set(true);
        setTimeout(() => this.copySuccess.set(false), 2000);
      });
    }
  }
}
