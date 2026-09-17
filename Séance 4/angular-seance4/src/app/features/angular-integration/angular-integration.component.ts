import { Component, signal } from '@angular/core';

interface ProductItem {
  id: number;
  title: string;
  category: string;
  badgeColor: string;
  description: string;
}

@Component({
  selector: 'app-angular-integration',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 08</span>
          <span class="badge badge-angular">Angular v22</span>
          <span class="badge badge-bootstrap">Bootstrap 5</span>
        </div>
        <h2>8. Intégration dans un Projet Angular</h2>
        <p class="module-desc">
          Guide pas-à-pas pour injecter Bootstrap 5.3 dans votre flux de travail Angular (installation npm, déclaration dans angular.json) et conception d'un composant standalone moderne combinant barre de navigation, grille de cartes rendue avec <code>&#64;for</code> et formulaire réactif.
        </p>
      </div>

      <!-- Stepper 3 Étapes -->
      <div class="stepper-grid">
        <!-- Étape 1 -->
        <div class="step-card card-panel">
          <div class="step-header">
            <span class="step-number">01</span>
            <h4>Installation du paquet npm</h4>
          </div>
          <p class="step-text">Dans le terminal de votre projet Angular, installez la bibliothèque Bootstrap :</p>
          <div class="terminal-snippet">
            <span class="prompt">$</span>
            <code>npm install bootstrap&#64;v5.3.8</code>
            <button class="copy-mini-btn" (click)="copyText('npm install bootstrap@v5.3.8')">Copier</button>
          </div>
          <div class="note-box">
            💡 Aucune dépendance jQuery n'est nécessaire avec Bootstrap 5 !
          </div>
        </div>

        <!-- Étape 2 -->
        <div class="step-card card-panel">
          <div class="step-header">
            <span class="step-number">02</span>
            <h4>Configuration dans angular.json</h4>
          </div>
          <p class="step-text">Ajoutez le fichier CSS minifié dans le tableau <code>styles</code> :</p>
          <div class="code-snippet-box">
            <pre><code>"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]</code></pre>
          </div>
          <div class="note-box">
            ⚠️ Relancez <code>ng serve</code> après avoir modifié <code>angular.json</code>.
          </div>
        </div>

        <!-- Étape 3 -->
        <div class="step-card card-panel">
          <div class="step-header">
            <span class="step-number">03</span>
            <h4>Utilisation dans les templates</h4>
          </div>
          <p class="step-text">Les classes Bootstrap sont immédiatement disponibles dans vos templates :</p>
          <div class="code-snippet-box">
            <pre><code>&lt;div class="container mt-4"&gt;
  &lt;div class="row g-3"&gt;
    &#64;for (item of list(); track item.id) &#123;
      &lt;div class="col-12 col-md-6 col-lg-4"&gt;
        &lt;div class="card h-100 shadow-sm"&gt;
          ...
        &lt;/div&gt;
      &lt;/div&gt;
    &#125;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- 3. Démonstration Live d'un Composant Angular + Bootstrap 5 -->
      <div class="card-panel mt-2">
        <div class="panel-head">
          <h3>🚀 Démonstrateur Interactif : Composant Angular Standalone Complet</h3>
          <span class="badge badge-success">Signals + &#64;for + Bootstrap 5</span>
        </div>

        <p class="panel-sub">
          Voici une véritable mini-application interactive illustrant l'intégration parfaite de la Navbar Bootstrap, de la grille responsive générée dynamiquement avec <code>&#64;for</code> et d'un formulaire réactif avec signaux Angular.
        </p>

        <!-- Mini App Mockup -->
        <div class="demo-app-window">
          <!-- Barre de navigation Bootstrap -->
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-2 rounded-top">
            <div class="container-fluid p-0">
              <a class="navbar-brand fw-bold text-white d-flex align-items-center gap-2" href="javascript:void(0)">
                <span class="badge bg-primary">POO</span>
                <span>Catalogue Angular</span>
              </a>
              <div class="d-flex align-items-center gap-2">
                <span class="text-white-50 small">{{ items().length }} élément(s)</span>
              </div>
            </div>
          </nav>

          <!-- Corps de la mini app -->
          <div class="mini-app-body p-3">
            <!-- Formulaire d'ajout rapide -->
            <div class="card mb-4 shadow-sm border-0 bg-light">
              <div class="card-body p-3">
                <h6 class="fw-bold mb-3 text-dark">Ajouter un nouveau cours ou projet :</h6>
                <div class="row g-2">
                  <div class="col-md-5">
                    <input 
                      type="text" 
                      class="form-control form-control-sm" 
                      placeholder="Titre de la séance..." 
                      [value]="newTitle()" 
                      (input)="newTitle.set($any($event.target).value)" 
                    />
                  </div>
                  <div class="col-md-4">
                    <select 
                      class="form-select form-select-sm" 
                      [value]="newCategory()" 
                      (change)="newCategory.set($any($event.target).value)"
                    >
                      <option value="Web">Web & Frontend</option>
                      <option value="POO">Programmation Orientée Objet</option>
                      <option value="Base de données">Base de Données</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <button 
                      class="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                      [disabled]="!newTitle().trim()"
                      (click)="addItem()"
                    >
                      <span>➕ Ajouter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grille Responsive avec @for -->
            <div class="row g-3">
              @for (item of items(); track item.id) {
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="card h-100 shadow-sm border">
                    <div class="card-body d-flex flex-direction-column">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span [class]="'badge ' + item.badgeColor">{{ item.category }}</span>
                        <button class="btn-close btn-sm" (click)="removeItem(item.id)" title="Supprimer"></button>
                      </div>
                      <h6 class="card-title fw-bold text-dark">{{ item.title }}</h6>
                      <p class="card-text text-muted small flex-grow-1">{{ item.description }}</p>
                      <div class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                        <span class="text-secondary small">ID: #{{ item.id }}</span>
                        <button class="btn btn-outline-primary btn-sm">Accéder</button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
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

    .stepper-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .step-card {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .step-header {
        display: flex;
        align-items: center;
        gap: 10px;

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(121, 82, 179, 0.2);
          color: #c4b5fd;
          font-weight: 800;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }

        h4 { font-size: 0.95rem; font-weight: 700; }
      }

      .step-text {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .terminal-snippet {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.78rem;

      .prompt { color: #10b981; font-weight: bold; }
      code { color: #f8fafc; flex: 1; }

      .copy-mini-btn {
        padding: 2px 8px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-subtle);
        border-radius: 4px;
        color: var(--text-muted);
        font-size: 0.7rem;

        &:hover { color: var(--text-main); background: var(--bg-card); }
      }
    }

    .code-snippet-box {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px 14px;
      overflow-x: auto;

      pre {
        color: #c4b5fd;
        font-size: 0.75rem;
        font-family: var(--font-mono);
      }
    }

    .note-box {
      margin-top: auto;
      font-size: 0.75rem;
      color: var(--text-muted);
      background: var(--bg-subtle);
      padding: 6px 10px;
      border-radius: 4px;
      border-left: 2px solid #7952b3;
    }

    .demo-app-window {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

      .mini-app-body {
        background: #f8fafc;
        min-height: 280px;
      }
    }
  `]
})
export class AngularIntegrationComponent {
  readonly newTitle = signal<string>('');
  readonly newCategory = signal<string>('Web');

  readonly items = signal<ProductItem[]>([
    {
      id: 1,
      title: 'Séance 4 — HTML/CSS & Bootstrap',
      category: 'Web',
      badgeColor: 'bg-primary',
      description: 'Maîtrise de la grille 12 colonnes, du Box Model et des composants graphiques.'
    },
    {
      id: 2,
      title: 'Séance 5 — Encapsulation & Objets',
      category: 'POO',
      badgeColor: 'bg-purple text-white',
      description: 'Protection de l\'état interne, accesseurs getters/setters et invariants.'
    },
    {
      id: 3,
      title: 'Séance 6 — Héritage & Polymorphisme',
      category: 'POO',
      badgeColor: 'bg-success',
      description: 'Liaison tardive, classes abstraites et substituabilité Liskov.'
    }
  ]);

  addItem(): void {
    const title = this.newTitle().trim();
    if (!title) return;

    const cat = this.newCategory();
    const colors: Record<string, string> = {
      'Web': 'bg-primary',
      'POO': 'bg-purple text-white',
      'Base de données': 'bg-warning text-dark'
    };

    const newItem: ProductItem = {
      id: Date.now() % 1000,
      title,
      category: cat,
      badgeColor: colors[cat] || 'bg-secondary',
      description: `Module ajouté dynamiquement via Angular Signal dans le composant.`
    };

    this.items.update(list => [newItem, ...list]);
    this.newTitle.set('');
  }

  removeItem(id: number): void {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  copyText(txt: string): void {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(txt);
    }
  }
}
