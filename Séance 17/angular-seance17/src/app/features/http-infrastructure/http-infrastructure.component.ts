import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-http-infrastructure',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">Module 03 · Configuration &amp; Injection de Dépendances</div>
        <h2>Configuration Réseau : <code>provideHttpClient(withFetch())</code></h2>
        <p class="module-desc">
          Dans une application Angular moderne en Standalone Components, toute la tuyauterie réseau
          est enregistrée au démarrage dans <code>app.config.ts</code>. Découvrez le démonstrateur
          de panne <code>NullInjectorError</code> et comprenez pourquoi <code>withFetch()</code> est indispensable.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'inspector'" (click)="activeSubTab.set('inspector')">
              🛠️ Inspecteur app.config.ts &amp; Crash NullInjector
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'fetch-vs-xhr'" (click)="activeSubTab.set('fetch-vs-xhr')">
              ⚡ Duel : withFetch() vs XMLHttpRequest
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 2 ➔
          </button>
        </div>
      </div>

      <!-- SOUS-ONGLET 1 : INSPECTEUR ET SIMULATEUR DE PANNE -->
      @if (activeSubTab() === 'inspector') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Inspecteur de Configuration &amp; Simulateur de Crash</h3>
              <p class="zone-subtitle">Activez ou désactivez le fournisseur réseau pour voir immédiatement son impact sur l'injecteur Angular.</p>
            </div>

            <div class="toggle-control">
              <label class="switch-label">
                <span>État de <code>provideHttpClient()</code> :</span>
                <button 
                  class="toggle-btn" 
                  [class.active-on]="isHttpProviderActive()" 
                  (click)="toggleHttpProvider()"
                >
                  {{ isHttpProviderActive() ? '🟢 ACTIF (withFetch)' : '🔴 DÉSACTIVÉ' }}
                </button>
              </label>
            </div>
          </div>

          <div class="grid-2-cols mt-3">
            <!-- Code app.config.ts interactif -->
            <div class="code-view-box">
              <div class="box-bar">
                <span>Fichier : src/app/app.config.ts</span>
                <span class="badge badge-ts">Standalone Config</span>
              </div>
              <pre class="code-pre"><code>import &#123; ApplicationConfig &#125; from '&#64;angular/core';
import &#123; provideRouter &#125; from '&#64;angular/router';
import &#123; provideHttpClient, withFetch &#125; from '&#64;angular/common/http';
import &#123; routes &#125; from './app.routes';

export const appConfig: ApplicationConfig = &#123;
  providers: [
    provideRouter(routes),

    <span [class.text-highlight-on]="isHttpProviderActive()" [class.text-highlight-off]="!isHttpProviderActive()">
      @if (isHttpProviderActive()) {
        // 🌐 Infrastructure réseau moderne activée
        provideHttpClient(withFetch())
      } @else {
        // ⚠️ FOURNISSEUR RETIRÉ !
        // Aucun HttpClient n'est enregistré dans l'injecteur racine
      }
    </span>
  ]
&#125;;</code></pre>
            </div>

            <!-- Terminal d'exécution en direct -->
            <div class="console-diagnostic-box">
              <div class="box-bar">
                <span class="dot-red"></span>
                <span>Sortie Console Angular / Injector</span>
              </div>

              <div class="diagnostic-content">
                @if (isHttpProviderActive()) {
                  <div class="diag-success">
                    <div class="status-icon-big">✅</div>
                    <div class="diag-text">
                      <strong>Injecteur racine opérationnel :</strong>
                      <p>Le service <code>HttpClient</code> et la primitive <code>httpResource()</code> sont configurés avec succès avec le moteur <code>fetch()</code> natif.</p>
                      <div class="diag-stats mt-2">
                        <span>Annulation AbortSignal : <strong>Supportée</strong></span>
                        <span>Mode SSR : <strong>Compatible</strong></span>
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="diag-error">
                    <div class="status-icon-big">💥</div>
                    <div class="diag-text">
                      <strong class="text-danger font-mono">NullInjectorError: No provider for HttpClient!</strong>
                      <p class="error-details mt-1">
                        Un service ou un composant tente d'utiliser <code>httpResource()</code> ou d'injecter <code>HttpClient</code>, mais l'arbre d'injection de dépendances ne trouve aucun fournisseur dans <code>app.config.ts</code>.
                      </p>
                      <div class="error-fix-tip mt-2">
                        💡 <strong>Remède immédiat :</strong> Ajouter <code>provideHttpClient(withFetch())</code> dans les <code>providers</code> de <code>app.config.ts</code>.
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 2 : FETCH VS XHR -->
      @if (activeSubTab() === 'fetch-vs-xhr') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Pourquoi withFetch() surpasse l'ancien XMLHttpRequest ?</h3>
              <p class="zone-subtitle">Comprenez l'évolution technologique entre le protocole historique des années 2000 et le standard Web moderne.</p>
            </div>
          </div>

          <div class="comparison-grid mt-3">
            <div class="comp-card card-old">
              <div class="card-tag">Historique · Déconseillé</div>
              <h4>XMLHttpRequest (XHR)</h4>
              <p class="card-desc">Conçu en 1999 pour Internet Explorer 5, conservé pendant 20 ans par compatibilité ascendante.</p>

              <ul class="comp-list">
                <li class="negative">❌ <strong>Pas de support natif d'AbortSignal</strong> : annulation lourde et peu fiable.</li>
                <li class="negative">❌ <strong>Non disponible en environnement Node.js / SSR</strong> : nécessite des polyfills verbeux.</li>
                <li class="negative">❌ <strong>Modèle d'événements obsolète</strong> : architecture complexe basée sur <code>onreadystatechange</code>.</li>
                <li class="negative">❌ <strong>Empreinte mémoire plus élevée</strong> lors de transferts de flux volumineux.</li>
              </ul>
            </div>

            <div class="comp-card card-modern">
              <div class="card-tag tag-modern">Moderne · Recommandé Angular 22</div>
              <h4>provideHttpClient(withFetch())</h4>
              <p class="card-desc">Standard moderne du W3C basé sur les Promesses et les flux natifs du navigateur.</p>

              <ul class="comp-list">
                <li class="positive">✅ <strong>Annulation native via AbortSignal</strong> : permet à <code>httpResource()</code> d'annuler les requêtes obsolètes instantanément.</li>
                <li class="positive">✅ <strong>Compatibilité SSR &amp; Hydratation</strong> : exécution native sous Node.js et Cloudflare Workers.</li>
                <li class="positive">✅ <strong>Performances réseau optimales</strong> : exploite les optimisations bas-niveau du navigateur.</li>
                <li class="positive">✅ <strong>Streams natifs</strong> : lecture par morceaux (streaming) des flux de données.</li>
              </ul>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .code-view-box, .console-diagnostic-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      min-height: 280px;

      .box-bar {
        padding: 10px 14px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.78rem;
        font-weight: 600;
        border-radius: 8px 8px 0 0;
      }
    }

    .code-pre {
      padding: 14px;
      font-size: 0.8rem;
      line-height: 1.5;
      font-family: var(--font-mono);
      overflow-x: auto;
    }

    .text-highlight-on {
      color: #34d399;
      font-weight: 700;
    }

    .text-highlight-off {
      color: #fca5a5;
      font-weight: 700;
      background: rgba(239, 68, 68, 0.1);
      display: block;
      padding: 4px;
      border-radius: 4px;
    }

    .diagnostic-content {
      padding: 18px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .diag-success, .diag-error {
      display: flex;
      gap: 16px;
      align-items: flex-start;

      .status-icon-big {
        font-size: 2rem;
      }

      .diag-text {
        font-size: 0.85rem;
        line-height: 1.5;

        p {
          margin-top: 4px;
          color: var(--text-muted);
        }
      }
    }

    .diag-stats {
      display: flex;
      gap: 16px;
      font-size: 0.78rem;
      background: rgba(16, 185, 129, 0.1);
      padding: 6px 10px;
      border-radius: 6px;
      color: #34d399;
    }

    .error-fix-tip {
      background: rgba(0, 0, 0, 0.3);
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      color: #cbd5e1;
    }

    .toggle-control {
      display: flex;
      align-items: center;

      .switch-label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .toggle-btn {
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid var(--border-color);
        background: var(--bg-card);
        color: #ef4444;

        &.active-on {
          background: rgba(16, 185, 129, 0.15);
          border-color: #10b981;
          color: #34d399;
        }
      }
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .comp-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .card-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .tag-modern {
        color: #34d399;
      }

      h4 {
        font-size: 1.1rem;
        font-weight: 700;
      }

      .card-desc {
        font-size: 0.82rem;
        color: var(--text-muted);
      }

      .comp-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
        font-size: 0.82rem;

        li {
          padding: 8px 10px;
          border-radius: 6px;
          line-height: 1.4;

          &.positive {
            background: rgba(16, 185, 129, 0.1);
            color: var(--text-main);
          }

          &.negative {
            background: rgba(239, 68, 68, 0.1);
            color: var(--text-main);
          }
        }
      }

      &.card-modern {
        border-color: rgba(16, 185, 129, 0.4);
      }
    }
  `]
})
export class HttpInfrastructureComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly activeSubTab = signal<'inspector' | 'fetch-vs-xhr'>('inspector');
  readonly isHttpProviderActive = signal<boolean>(true);

  toggleHttpProvider(): void {
    this.isHttpProviderActive.update(v => !v);
  }

  jumpToLab(): void {
    this.exerciseService.setFilterLab(2);
    this.nav.setTab('workshops-lab');
  }
}
