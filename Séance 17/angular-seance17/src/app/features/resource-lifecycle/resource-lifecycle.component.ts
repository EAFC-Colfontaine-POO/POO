import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface StatusState {
  code: number;
  name: string;
  badgeClass: string;
  title: string;
  uiBehavior: string;
  valueState: string;
}

@Component({
  selector: 'app-resource-lifecycle',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">Module 05 · Machine à États &amp; Expérience Utilisateur</div>
        <h2>Machine à États <code>ResourceStatus</code> &amp; Ergonomie UI</h2>
        <p class="module-desc">
          Pour concevoir des applications de haute qualité, un simple booléen <code>isLoading</code> ne suffit pas.
          La machine à états <code>ResourceStatus</code> distingue avec finesse un premier chargement (écran vide)
          d'un rafraîchissement d'arrière-plan (données conservées sans scintillement).
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'lifecycle'" (click)="activeSubTab.set('lifecycle')">
              🔄 Cycle de Vie ResourceStatus
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'ux-lab'" (click)="activeSubTab.set('ux-lab')">
              🎨 Laboratoire UX : Loading vs Reloading
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 5 ➔
          </button>
        </div>
      </div>

      <!-- SOUS-ONGLET 1 : CYCLE DE VIE RESOURCESTATUS -->
      @if (activeSubTab() === 'lifecycle') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Simulateur de Transitions d'États</h3>
              <p class="zone-subtitle">Naviguez entre les 5 états canoniques de la machine à états réseau.</p>
            </div>

            <div class="state-buttons">
              @for (st of states; track st.code) {
                <button 
                  class="state-btn" 
                  [class.active]="currentStatusCode() === st.code"
                  (click)="currentStatusCode.set(st.code)"
                >
                  <span class="code-num">{{ st.code }}</span>
                  <span>{{ st.name }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Affichage de l'état actif -->
          <div class="state-card-active mt-3">
            <div class="state-header-banner" [class]="currentState().badgeClass">
              <span class="banner-code">ResourceStatus.{{ currentState().name }} ({{ currentState().code }})</span>
              <span class="banner-title">{{ currentState().title }}</span>
            </div>

            <div class="state-details-grid p-4">
              <div class="detail-block">
                <span class="detail-label">Contenu de .value() :</span>
                <code class="detail-val">{{ currentState().valueState }}</code>
              </div>

              <div class="detail-block">
                <span class="detail-label">Comportement UX Recommandé :</span>
                <p class="detail-text">{{ currentState().uiBehavior }}</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 2 : LABO UX LOADING VS RELOADING -->
      @if (activeSubTab() === 'ux-lab') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Laboratoire d'UX Réseau : Loading (Initial) vs Reloading (Discret)</h3>
              <p class="zone-subtitle">Observez la différence visuelle flagrante entre un premier chargement et une réactualisation.</p>
            </div>

            <div class="lab-actions">
              <button class="btn-primary btn-sm" (click)="triggerInitialLoad()">
                ⏳ Déclencher Premier Chargement (Loading)
              </button>
              <button class="btn-secondary btn-sm" (click)="triggerBackgroundReload()">
                🔄 Déclencher Actualisation (Reloading)
              </button>
            </div>
          </div>

          <!-- Simulateur d'écran d'application -->
          <div class="screen-preview-container mt-3">
            <div class="screen-chrome">
              <div class="screen-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="screen-address-bar">
                <span>https://mon-application-poo.be/catalogue-articles</span>
              </div>
              <div class="screen-status-indicator">
                @if (uxStatus() === 'loading') {
                  <span class="badge badge-warning">Loading (0) · Premier chargement</span>
                } @else if (uxStatus() === 'reloading') {
                  <span class="badge badge-purple animate-pulse">Reloading (3) · Rafraîchissement discret</span>
                } @else {
                  <span class="badge badge-success">Resolved (4) · Prêt</span>
                }
              </div>
            </div>

            <div class="screen-viewport">
              @if (uxStatus() === 'loading') {
                <!-- État Loading : Écran vide, Spinner central ou Skeleton UI -->
                <div class="skeleton-layout">
                  <div class="spinner-center">
                    <div class="spinner-ring"></div>
                    <p class="mt-2 text-sm text-muted">Préchauffage du catalogue...</p>
                  </div>
                  <div class="skeleton-grid">
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                    <div class="skeleton-card"></div>
                  </div>
                </div>
              } @else {
                <!-- État Resolved OU Reloading : Les cartes restent parfaitement visibles ! -->
                <div class="products-grid">
                  @for (prod of sampleProducts; track prod.id) {
                    <div class="product-card" [class.subtle-dim]="uxStatus() === 'reloading'">
                      <div class="prod-img-box">{{ prod.icon }}</div>
                      <div class="prod-info">
                        <h5>{{ prod.name }}</h5>
                        <div class="prod-price">{{ prod.price }} €</div>
                        <span class="badge badge-ts">{{ prod.category }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="ergonomy-tip mt-3">
            💡 <strong>Règle d'or ergonomique :</strong> Ne faites jamais clignoter l'écran complet avec un spinner lors d'un <code>Reloading</code> ! L'utilisateur est en train de lire ses données : un badge d'actualisation discret en haut de page préserve le confort de lecture à 100%.
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .state-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .state-btn {
      padding: 6px 12px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;

      .code-num {
        font-family: var(--font-mono);
        background: var(--bg-card);
        padding: 1px 5px;
        border-radius: 3px;
        font-size: 0.72rem;
      }

      &.active {
        background: #3b82f6;
        color: #ffffff;
        border-color: #60a5fa;

        .code-num {
          background: rgba(0, 0, 0, 0.3);
          color: #ffffff;
        }
      }
    }

    .state-card-active {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .state-header-banner {
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;

      .banner-code {
        font-family: var(--font-mono);
        font-size: 0.95rem;
      }

      &.b-idle { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; }
      &.b-loading { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
      &.b-reloading { background: rgba(147, 51, 234, 0.2); color: #c084fc; }
      &.b-resolved { background: rgba(16, 185, 129, 0.2); color: #34d399; }
      &.b-error { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    }

    .state-details-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-block {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .detail-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-dim);
      }

      .detail-val {
        font-size: 0.85rem;
        color: #60a5fa;
      }

      .detail-text {
        font-size: 0.85rem;
        color: var(--text-main);
        line-height: 1.4;
      }
    }

    .screen-preview-container {
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .screen-chrome {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      .screen-dots {
        display: flex;
        gap: 6px;

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;

          &.red { background: #ef4444; }
          &.yellow { background: #f59e0b; }
          &.green { background: #10b981; }
        }
      }

      .screen-address-bar {
        flex: 1;
        max-width: 450px;
        background: var(--bg-subtle);
        padding: 4px 10px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--text-dim);
      }
    }

    .screen-viewport {
      min-height: 260px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .spinner-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .spinner-ring {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .skeleton-card {
      height: 120px;
      background: var(--bg-subtle);
      border-radius: 8px;
      animation: pulse-op 1.5s infinite;
    }

    @keyframes pulse-op {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .product-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      gap: 12px;
      align-items: center;
      transition: all 0.2s;

      &.subtle-dim {
        opacity: 0.75;
      }

      .prod-img-box {
        font-size: 2rem;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-subtle);
        border-radius: 6px;
      }

      .prod-info {
        display: flex;
        flex-direction: column;
        gap: 3px;

        h5 {
          font-size: 0.88rem;
          font-weight: 700;
        }

        .prod-price {
          font-size: 0.82rem;
          font-weight: 700;
          color: #34d399;
        }
      }
    }

    .ergonomy-tip {
      font-size: 0.82rem;
      background: rgba(147, 51, 234, 0.1);
      border: 1px solid rgba(147, 51, 234, 0.3);
      padding: 10px 14px;
      border-radius: 6px;
      color: #c084fc;
    }
  `]
})
export class ResourceLifecycleComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly activeSubTab = signal<'lifecycle' | 'ux-lab'>('lifecycle');
  readonly currentStatusCode = signal<number>(2);

  readonly states: StatusState[] = [
    {
      code: 0,
      name: 'Idle',
      badgeClass: 'b-idle',
      title: 'En veille (Aucune requête en cours)',
      valueState: 'undefined',
      uiBehavior: 'Idéal lorsque l\'utilisateur n\'a pas encore commencé à taper sa recherche (ou saisie < 3 caractères). L\'interface reste neutre et n\'émet aucun trafic.'
    },
    {
      code: 2,
      name: 'Loading',
      badgeClass: 'b-loading',
      title: 'Premier Chargement Initial',
      valueState: 'undefined',
      uiBehavior: 'L\'utilisateur arrive pour la première fois. Aucune donnée n\'existe en mémoire : afficher un Skeleton UI ou un Spinner plein écran.'
    },
    {
      code: 4,
      name: 'Resolved',
      badgeClass: 'b-resolved',
      title: 'Succès Résolu',
      valueState: 'Données JSON disponibles (Array, Object)',
      uiBehavior: 'Les données sont prêtes ! Le template injecte les cartes et objets réhydratés sans délai.'
    },
    {
      code: 3,
      name: 'Reloading',
      badgeClass: 'b-reloading',
      title: 'Réactualisation en Tâche de Fond',
      valueState: 'Conserve les données précédentes !',
      uiBehavior: 'L\'utilisateur a cliqué sur "Actualiser" ou changé un filtre. Conserver la liste affichée et afficher un badge discret sans scintillement visuel.'
    },
    {
      code: 1,
      name: 'Error',
      badgeClass: 'b-error',
      title: 'Échec / Erreur Réseau',
      valueState: 'undefined ou données obsolètes',
      uiBehavior: 'Le serveur est injoignable ou a renvoyé 4xx/5xx. Afficher une bannière explicative avec bouton Réessayer (.reload()).'
    }
  ];

  readonly currentState = () => this.states.find(s => s.code === this.currentStatusCode()) || this.states[1];

  // UX Lab
  readonly uxStatus = signal<'loading' | 'resolved' | 'reloading'>('resolved');
  readonly sampleProducts = [
    { id: 1, name: "Ordinateur Portable Pro", price: 1299, category: "Informatique", icon: "💻" },
    { id: 2, name: "Casque Audio Bluetooth", price: 149, category: "Audio", icon: "🎧" },
    { id: 3, name: "Clavier Ergonomique", price: 89, category: "Accessoires", icon: "⌨️" }
  ];

  triggerInitialLoad(): void {
    this.uxStatus.set('loading');
    setTimeout(() => {
      this.uxStatus.set('resolved');
    }, 1500);
  }

  triggerBackgroundReload(): void {
    this.uxStatus.set('reloading');
    setTimeout(() => {
      this.uxStatus.set('resolved');
    }, 1500);
  }

  jumpToLab(): void {
    this.exerciseService.setFilterLab(5);
    this.nav.setTab('workshops-lab');
  }
}
