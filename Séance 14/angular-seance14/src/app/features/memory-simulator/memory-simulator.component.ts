import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-memory-simulator',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <header class="module-header">
        <div class="module-tag">Module 01 · Fondations d'Architecture</div>
        <h2>Simulateur Mémoire : new MonService() vs inject(MonService)</h2>
        <p class="module-desc">
          Pourquoi sortir l'état du composant ? Découvrez visuellement la gestion de la mémoire (Tas / Heap)
          et observez pourquoi l'opérateur <code>new</code> brise le partage d'état alors que <code>inject()</code>
          fournit une référence Singleton unique.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Simulateur Visuel du Tas Mémoire</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 1 · 3 Ex)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- Simulateur Mémoire Interactif -->
        <section class="card-panel interactive-section">
          <div class="section-top-bar">
            <div class="mode-selector">
              <span class="ctrl-label">Mode d'instanciation :</span>
              <div class="btn-group">
                <button 
                  class="btn-toggle" 
                  [class.active]="mode() === 'new'" 
                  (click)="setMode('new')"
                >
                  ❌ Mode A : new PanierService() (Anti-Pattern)
                </button>
                <button 
                  class="btn-toggle active-green" 
                  [class.active]="mode() === 'inject'" 
                  (click)="setMode('inject')"
                >
                  ✅ Mode B : inject(PanierService) (Singleton)
                </button>
              </div>
            </div>

            <button class="btn-secondary" (click)="reinitialiser()">
              ↺ Réinitialiser la mémoire
            </button>
          </div>

          <!-- Code Preview du Mode Actif -->
          <div class="code-box my-3">
            <div class="code-header">
              <span>{{ mode() === 'new' ? 'catalogue.component.ts & navbar.component.ts (Couplage fort par new)' : 'catalogue.component.ts & navbar.component.ts (Injection de Dépendances)' }}</span>
              <span class="addr-badge" [class.root]="mode() === 'inject'" [class.isolated-1]="mode() === 'new'">
                {{ mode() === 'new' ? '2 Instances Isolées' : '1 Singleton Partagé (#0xROOT)' }}
              </span>
            </div>
            <pre><code>{{ mode() === 'new' ? codeModeNew : codeModeInject }}</code></pre>
          </div>

          <!-- Scène interactive : Composants & Tas Mémoire -->
          <div class="simulator-layout">
            <!-- Colonne Gauche : Les Deux Composants IHM -->
            <div class="components-column">
              <div class="col-title">🖥️ Arbre des Composants (IHM)</div>

              <!-- Composant Catalogue -->
              <div class="component-card">
                <div class="comp-header">
                  <div class="comp-name">CatalogueComponent</div>
                  <span class="addr-badge" [class.isolated-1]="mode() === 'new'" [class.root]="mode() === 'inject'">
                    Pointe vers : {{ mode() === 'new' ? '#0x1A4F' : '#0xROOT' }}
                  </span>
                </div>
                <p class="comp-desc">L'utilisateur consulte la boutique et clique sur « Ajouter ».</p>

                <div class="comp-action-area">
                  <button class="btn-primary" (click)="ajouterAuCatalogue()">
                    + Ajouter un Clavier (49.99 €)
                  </button>
                  <div class="comp-metric">
                    Articles vus par le Catalogue : <strong>{{ catalogueCount() }}</strong>
                  </div>
                </div>
              </div>

              <!-- Composant Navbar -->
              <div class="component-card mt-3">
                <div class="comp-header">
                  <div class="comp-name">NavbarComponent</div>
                  <span class="addr-badge" [class.isolated-2]="mode() === 'new'" [class.root]="mode() === 'inject'">
                    Pointe vers : {{ mode() === 'new' ? '#0x8B9C' : '#0xROOT' }}
                  </span>
                </div>
                <p class="comp-desc">La barre supérieure affiche le badge du panier pour l'utilisateur.</p>

                <div class="navbar-preview">
                  <div class="nav-mock-brand">🛒 MonShop</div>
                  <div class="nav-cart-badge" [class.badge-empty]="navbarCount() === 0">
                    <span class="cart-icon">🛍️</span>
                    <span class="cart-count">{{ navbarCount() }} article(s)</span>
                    <span class="cart-total">({{ (navbarCount() * 49.99).toFixed(2) }} €)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne Droite : Le Tas Mémoire (Heap) -->
            <div class="heap-column">
              <div class="col-title">🧠 Tas Mémoire de l'Application (Heap)</div>

              <div class="heap-arena">
                @if (mode() === 'new') {
                  <!-- Mode A : Deux boîtes étanches -->
                  <div class="heap-box box-orange">
                    <div class="box-header">
                      <span class="box-addr">Objet #0x1A4F</span>
                      <span class="badge badge-warning">Instance Catalogue</span>
                    </div>
                    <div class="box-body">
                      <div class="box-prop">type: <code>PanierService</code></div>
                      <div class="box-prop">articles: <code>[{{ catalogueCount() }} élément(s)]</code></div>
                      <div class="box-status">Modifié lors du clic dans le Catalogue</div>
                    </div>
                  </div>

                  <div class="heap-divider-warning">
                    ⚠️ Cloisonnement étanche : Aucune communication possible entre ces deux adresses mémoire !
                  </div>

                  <div class="heap-box box-red">
                    <div class="box-header">
                      <span class="box-addr">Objet #0x8B9C</span>
                      <span class="badge badge-red">Instance Navbar</span>
                    </div>
                    <div class="box-body">
                      <div class="box-prop">type: <code>PanierService</code></div>
                      <div class="box-prop">articles: <code>[{{ navbarCount() }} élément(s)]</code></div>
                      <div class="box-status">Reste désespérément vide (0) !</div>
                    </div>
                  </div>

                  <div class="diagnostic-banner warning">
                    <div class="diag-icon">🚨</div>
                    <div class="diag-text">
                      <strong>Désynchronisation critique (Bug d'instanciation) :</strong>
                      Chaque appel à <code>new PanierService()</code> alloue un nouvel emplacement mémoire indépendant dans le tas.
                      L'ajout de produit incrémente le panier de l'objet <code>#0x1A4F</code>, mais la navbar observe l'objet <code>#0x8B9C</code> qui reste à 0.
                    </div>
                  </div>
                } @else {
                  <!-- Mode B : Un seul singleton partagé -->
                  <div class="heap-box box-emerald animate-pulse-subtle">
                    <div class="box-header">
                      <span class="box-addr">Objet #0xROOT</span>
                      <span class="badge badge-success">Singleton Partagé (Root Injector)</span>
                    </div>
                    <div class="box-body">
                      <div class="box-prop">type: <code>PanierService</code></div>
                      <div class="box-prop">articles: <code>[{{ sharedCount() }} élément(s)]</code></div>
                      <div class="box-prop">total: <code>{{ (sharedCount() * 49.99).toFixed(2) }} €</code></div>
                      <div class="box-links">
                        <span class="link-tag">← CatalogueComponent</span>
                        <span class="link-tag">← NavbarComponent</span>
                      </div>
                    </div>
                  </div>

                  <div class="diagnostic-banner success mt-3">
                    <div class="diag-icon">✨</div>
                    <div class="diag-text">
                      <strong>Architecture Optimale (Injection de Dépendances) :</strong>
                      Angular instancie <code>PanierService</code> une seule fois à la racine (<code>providedIn: 'root'</code>).
                      Tous les composants consomment la même référence mémoire <code>#0xROOT</code>.
                      Tout changement d'état se répercute instantanément à l'ensemble de l'interface !
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Les 3 Piliers Pédagogiques -->
        <section class="grid-3-cols mt-4">
          <div class="card-panel pillar-card">
            <div class="pillar-icon">🔄</div>
            <h4>1. Partage entre Composants</h4>
            <p>
              Deux composants situés à des endroits opposés de l'arbre DOM (ex: bouton dans une fiche produit et compteur dans l'en-tête)
              partagent la même source de vérité (*Single Source of Truth*).
            </p>
          </div>

          <div class="card-panel pillar-card">
            <div class="pillar-icon">🧭</div>
            <h4>2. Survie aux Navigations SPA</h4>
            <p>
              Quand l'utilisateur change de page avec le routeur, les composants sont détruits et recréés.
              Le service singleton, lui, reste vivant dans le Root Injector tout au long de la session.
            </p>
          </div>

          <div class="card-panel pillar-card">
            <div class="pillar-icon">🧪</div>
            <h4>3. Testabilité &amp; Découplage (DIP)</h4>
            <p>
              En éliminant l'opérateur <code>new</code> des composants, on respecte le principe d'Inversion de Dépendance (DIP, S11).
              En test unitaire, on peut substituer un faux service (Mock) en une seule ligne.
            </p>
          </div>
        </section>
      } @else {
        <!-- Mode Laboratoire Pratique Monaco -->
        <app-lab-runner [defaultLabNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .interactive-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .mode-selector {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ctrl-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .btn-group {
      display: flex;
      gap: 6px;
      background: var(--bg-subtle);
      padding: 4px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .btn-toggle {
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);

      &:hover {
        color: var(--text-main);
      }

      &.active {
        background: #ef4444;
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
      }

      &.active-green.active {
        background: #10b981;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.35);
      }
    }

    .simulator-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 8px;
    }

    @media (max-width: 960px) {
      .simulator-layout {
        grid-template-columns: 1fr;
      }
    }

    .col-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .component-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;

      .comp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .comp-name {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--ts-blue-light);
      }

      .comp-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 14px;
      }

      .comp-action-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .comp-metric {
        font-size: 0.82rem;
        color: var(--text-main);
      }
    }

    .navbar-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 10px 14px;
      border-radius: 6px;

      .nav-mock-brand {
        font-weight: 700;
        font-size: 0.85rem;
      }

      .nav-cart-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 10px;
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #34d399;
        border-radius: 9999px;
        font-size: 0.78rem;
        font-weight: 600;

        &.badge-empty {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.35);
          color: #f87171;
        }
      }
    }

    .heap-arena {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .heap-box {
      border-radius: 8px;
      padding: 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);

      &.box-orange {
        border-left: 4px solid #f59e0b;
      }
      &.box-red {
        border-left: 4px solid #ef4444;
      }
      &.box-emerald {
        border-left: 4px solid #10b981;
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
      }

      .box-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .box-addr {
        font-family: var(--font-mono);
        font-weight: 700;
        font-size: 0.85rem;
      }

      .box-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.82rem;

        .box-prop {
          color: var(--text-muted);
          code {
            color: var(--text-code);
          }
        }

        .box-status {
          margin-top: 6px;
          font-size: 0.75rem;
          color: var(--text-dim);
          font-style: italic;
        }

        .box-links {
          margin-top: 8px;
          display: flex;
          gap: 8px;

          .link-tag {
            font-size: 0.72rem;
            font-family: var(--font-mono);
            background: rgba(49, 120, 198, 0.2);
            color: var(--ts-blue-light);
            padding: 2px 8px;
            border-radius: 4px;
          }
        }
      }
    }

    .heap-divider-warning {
      font-size: 0.75rem;
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.1);
      border: 1px dashed rgba(245, 158, 11, 0.3);
      padding: 6px 10px;
      border-radius: 6px;
      text-align: center;
    }

    .diagnostic-banner {
      display: flex;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      line-height: 1.5;

      &.warning {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #a7f3d0;
      }

      .diag-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }
    }

    .grid-3-cols {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 880px) {
      .grid-3-cols {
        grid-template-columns: 1fr;
      }
    }

    .pillar-card {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .pillar-icon {
        font-size: 1.6rem;
      }

      h4 {
        font-size: 0.92rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.5;
      }
    }
  `]
})
export class MemorySimulatorComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly mode = signal<'new' | 'inject'>('new');

  // État en Mode A (new : deux états désynchronisés)
  readonly catalogueCount = signal<number>(0);
  readonly navbarCount = signal<number>(0);

  // État en Mode B (inject : un seul état partagé)
  readonly sharedCount = signal<number>(0);

  readonly codeModeNew = `// ❌ MODE A : Chaque composant instancie son propre service avec 'new'
export class CatalogueComponent {
  panier = new PanierService(); // Emplacement #0x1A4F dans le Tas
}

export class NavbarComponent {
  panier = new PanierService(); // Emplacement #0x8B9C : un AUTRE objet !
  // Résultat : le compteur de la navbar reste à 0 même si le catalogue en a 10 !
}`;

  readonly codeModeInject = `// ✅ MODE B : Laisser l'injecteur Angular distribuer la même instance unique
@Injectable({ providedIn: 'root' })
export class PanierService { ... }

export class CatalogueComponent {
  panier = inject(PanierService); // Référence vers #0xROOT
}

export class NavbarComponent {
  panier = inject(PanierService); // Référence vers le MÊME #0xROOT !
  // Résultat : l'ajout dans le catalogue met à jour la navbar instantanément !
}`;

  setMode(m: 'new' | 'inject'): void {
    this.mode.set(m);
    this.reinitialiser();
  }

  ajouterAuCatalogue(): void {
    if (this.mode() === 'new') {
      this.catalogueCount.update(c => c + 1);
      // Remarque : navbarCount NE BOUGE PAS en mode new, c'est le bug pédagogique !
    } else {
      this.sharedCount.update(c => c + 1);
      this.catalogueCount.set(this.sharedCount());
      this.navbarCount.set(this.sharedCount());
    }
  }

  reinitialiser(): void {
    this.catalogueCount.set(0);
    this.navbarCount.set(0);
    this.sharedCount.set(0);
  }
}
