import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-http-resource',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">Module 04 · Angular 22 Signal-First Réseau</div>
        <h2>La Révolution <code>httpResource()</code></h2>
        <p class="module-desc">
          Fini le labyrinthe impératif des souscriptions manuelles RxJS, des <code>unsubscribe()</code> oubliés
          et des variables d'état manuelles. Découvrez la puissance déclarative de <code>httpResource()</code>
          et explorez l'anatomie complète d'un <code>HttpResourceRef&lt;T&gt;</code>.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'split-screen'" (click)="activeSubTab.set('split-screen')">
              ⚔️ Split-Screen : RxJS vs Signals
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'anatomy'" (click)="activeSubTab.set('anatomy')">
              🧬 Anatomie de HttpResourceRef&lt;T&gt;
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 3 ➔
          </button>
        </div>
      </div>

      <!-- SOUS-ONGLET 1 : SPLIT SCREEN RXJS VS SIGNALS -->
      @if (activeSubTab() === 'split-screen') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Le Choc des Paradigmes : 25 Lignes de Plomberie vs 1 Déclaration</h3>
              <p class="zone-subtitle">Comparez le volume de code, les risques de bugs et la charge mentale entre l'ancien monde et le monde moderne.</p>
            </div>
          </div>

          <div class="split-grid mt-3">
            <!-- Ancien Monde RxJS -->
            <div class="paradigm-box old-world">
              <div class="box-header">
                <span class="badge badge-warning">Ancien Monde · RxJS Impératif</span>
                <span class="lines-count">~ 28 lignes de code</span>
              </div>

              <pre class="code-pre"><code>// ❌ Ancien Monde : Gestion manuelle des flux
export class AncienComposant implements OnInit, OnDestroy &#123;
  private readonly http = inject(HttpClient);
  private sub?: Subscription;

  // ⚠️ 3 variables d'état manuelles à synchroniser !
  articles: ArticleDTO[] = [];
  isLoading = false;
  error: any = null;

  ngOnInit() &#123;
    this.chargerArticles();
  &#125;

  chargerArticles() &#123;
    this.isLoading = true;
    this.error = null;

    // ⚠️ Risque de fuite de mémoire si pas d'unsubscribe !
    this.sub = this.http.get&lt;ArticleDTO[]&gt;('/api/articles')
      .subscribe(&#123;
        next: (data) => &#123;
          this.articles = data;
          this.isLoading = false;
        &#125;,
        error: (err) => &#123;
          this.error = err;
          this.isLoading = false;
        &#125;
      &#125;);
  &#125;

  ngOnDestroy() &#123;
    this.sub?.unsubscribe(); // ⚠️ Lourd et oubli fréquent
  &#125;
&#125;</code></pre>

              <div class="critique-box mt-2">
                <div class="critique-title text-danger">⚠️ Points de friction majeurs :</div>
                <ul class="critique-list">
                  <li>Fuites de mémoire silencieuses si l'abonnement n'est pas nettoyé dans <code>ngOnDestroy</code>.</li>
                  <li>Mise à jour manuelle des booléens <code>isLoading</code> et <code>error</code> dans les callbacks.</li>
                  <li>Absence d'annulation automatique si l'utilisateur change de filtre en cours de route.</li>
                </ul>
              </div>
            </div>

            <!-- Monde Moderne Signals -->
            <div class="paradigm-box modern-world">
              <div class="box-header">
                <span class="badge badge-success">Monde Moderne · Angular 22 Signals</span>
                <span class="lines-count font-bold text-success">1 ligne déclarative</span>
              </div>

              <pre class="code-pre"><code>// ✅ Monde Moderne : Déclaratif Signal-First
export class NouveauComposant &#123;
  // 🎯 1 SEULE DÉCLARATION LIMPIDE :
  readonly articlesResource = httpResource&lt;ArticleDTO[]&gt;('/api/articles');

  // C'est TOUT ! Angular gère tout sous le capot :
  // - Requête émise automatiquement
  // - .value() contient le tableau résolu
  // - .isLoading() est un Signal boolean natif
  // - .error() capture les erreurs sans callback
  // - Zéro fuite de mémoire possible à la destruction
&#125;</code></pre>

              <div class="critique-box mt-2">
                <div class="critique-title text-success">✨ Avantages déterminants :</div>
                <ul class="critique-list">
                  <li><strong>Zéro souscription manuelle :</strong> cycle de vie entièrement pris en charge par le graphe réactif.</li>
                  <li><strong>Signaux natifs directs :</strong> consommables immédiatement dans le template HTML.</li>
                  <li><strong>Annulation native :</strong> interruption automatique des requêtes obsolètes.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 2 : ANATOMIE DE HTTPRESOURCEREF -->
      @if (activeSubTab() === 'anatomy') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Anatomie Interactive d'un HttpResourceRef&lt;T&gt;</h3>
              <p class="zone-subtitle">Explorez les 4 signaux d'état et la méthode de rechargement impérative disponibles sur l'objet retourné.</p>
            </div>

            <button class="btn-primary btn-sm" (click)="triggerReloadSimulation()">
              🔄 Invoquer .reload() en direct
            </button>
          </div>

          <!-- Cartographie interactive des membres -->
          <div class="members-grid mt-3">
            <div class="member-card" [class.active-member]="selectedMember() === 'value'" (click)="selectedMember.set('value')">
              <div class="member-top">
                <span class="member-name">.value()</span>
                <span class="badge badge-ts">Signal&lt;T | undefined&gt;</span>
              </div>
              <p class="member-desc">Contient les données JSON résolues, ou <code>undefined</code> tant que le réseau n'a pas répondu.</p>
              <div class="live-val">Valeur actuelle : <strong>{{ mockResourceValue() }}</strong></div>
            </div>

            <div class="member-card" [class.active-member]="selectedMember() === 'isLoading'" (click)="selectedMember.set('isLoading')">
              <div class="member-top">
                <span class="member-name">.isLoading()</span>
                <span class="badge badge-warning">Signal&lt;boolean&gt;</span>
              </div>
              <p class="member-desc">Vaut <code>true</code> pendant le transit réseau, idéal pour piloter spinners et squelettes.</p>
              <div class="live-val">Valeur actuelle : <strong>{{ mockIsLoading() }}</strong></div>
            </div>

            <div class="member-card" [class.active-member]="selectedMember() === 'error'" (click)="selectedMember.set('error')">
              <div class="member-top">
                <span class="member-name">.error()</span>
                <span class="badge badge-danger">Signal&lt;unknown&gt;</span>
              </div>
              <p class="member-desc">Capture automatiquement l'objet d'erreur HTTP en cas de statut 4xx, 5xx ou rupture réseau.</p>
              <div class="live-val">Valeur actuelle : <strong>null (aucun échec)</strong></div>
            </div>

            <div class="member-card" [class.active-member]="selectedMember() === 'status'" (click)="selectedMember.set('status')">
              <div class="member-top">
                <span class="member-name">.status()</span>
                <span class="badge badge-purple">Signal&lt;ResourceStatus&gt;</span>
              </div>
              <p class="member-desc">Énumération précise du cycle de vie : <code>Idle (0)</code>, <code>Loading (2)</code>, <code>Resolved (4)</code>, <code>Reloading (3)</code>.</p>
              <div class="live-val">Valeur actuelle : <strong>{{ mockStatusName() }}</strong></div>
            </div>

            <div class="member-card full-span" [class.active-member]="selectedMember() === 'reload'" (click)="selectedMember.set('reload')">
              <div class="member-top">
                <span class="member-name">.reload()</span>
                <span class="badge badge-success">Fonction Impérative</span>
              </div>
              <p class="member-desc">
                Méthode impérative permettant de relancer explicitement la requête réseau (ex: suite au clic de l'utilisateur sur "Actualiser").
                Pendant le rechargement, <code>.status()</code> passe à <code>Reloading (3)</code> tandis que <code>.value()</code> conserve l'affichage précédent pour éviter tout clignotement.
              </p>
              <div class="live-val">Compteur de rechargements : <strong>{{ reloadCount() }} fois</strong></div>
            </div>
          </div>

          <!-- Graphe Réactif en direct -->
          <div class="graph-box mt-4">
            <h4 class="font-bold text-sm mb-2">Visualiseur du Graphe Réactif Angular 22 :</h4>
            <div class="reactive-pipeline">
              <div class="pipe-node node-res">
                <span class="node-tag">HTTP RESOURCE</span>
                <strong>httpResource('/api/articles')</strong>
              </div>
              <div class="pipe-arrow">➔</div>
              <div class="pipe-node node-signals">
                <span class="node-tag">SIGNAUX D'ÉTAT</span>
                <div>value() · isLoading() · status()</div>
              </div>
              <div class="pipe-arrow">➔</div>
              <div class="pipe-node node-template">
                <span class="node-tag">TEMPLATE VUE</span>
                <div>&#64;if (!res.isLoading()) &#123; ... &#125;</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .paradigm-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      flex-direction: column;

      .box-header {
        padding: 12px 16px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;

        .lines-count {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }
      }

      &.modern-world {
        border-color: rgba(16, 185, 129, 0.4);
      }
    }

    .code-pre {
      padding: 16px;
      font-size: 0.78rem;
      line-height: 1.5;
      font-family: var(--font-mono);
      overflow-x: auto;
      flex: 1;
    }

    .critique-box {
      padding: 14px 16px;
      background: var(--bg-card);
      border-top: 1px solid var(--border-color);
      border-radius: 0 0 8px 8px;

      .critique-title {
        font-size: 0.82rem;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .critique-list {
        font-size: 0.78rem;
        color: var(--text-muted);
        padding-left: 16px;
        line-height: 1.5;
      }
    }

    .members-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .member-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #3b82f6;
        background: var(--bg-card-hover);
      }

      &.active-member {
        border-color: #3b82f6;
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
      }

      &.full-span {
        grid-column: span 2;
      }

      .member-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .member-name {
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 1rem;
          color: #60a5fa;
        }
      }

      .member-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .live-val {
        margin-top: auto;
        font-size: 0.75rem;
        background: var(--bg-card);
        padding: 6px 10px;
        border-radius: 4px;
        color: var(--text-main);
      }
    }

    .graph-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }

    .reactive-pipeline {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow-x: auto;
      padding: 10px 0;

      .pipe-node {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 200px;
        text-align: center;

        .node-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--ts-blue-light);
        }

        &.node-res {
          border-color: #3b82f6;
        }

        &.node-signals {
          border-color: #9333ea;
        }

        &.node-template {
          border-color: #10b981;
        }
      }

      .pipe-arrow {
        font-size: 1.4rem;
        color: var(--text-dim);
      }
    }

    .badge-danger {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
    }
  `]
})
export class HttpResourceComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly activeSubTab = signal<'split-screen' | 'anatomy'>('split-screen');
  readonly selectedMember = signal<string>('value');

  readonly mockIsLoading = signal<boolean>(false);
  readonly reloadCount = signal<number>(0);
  readonly mockStatusName = signal<string>('Resolved (4)');
  readonly mockResourceValue = signal<string>('[2 Articles Résolus]');

  triggerReloadSimulation(): void {
    this.reloadCount.update(c => c + 1);
    this.mockIsLoading.set(true);
    this.mockStatusName.set('Reloading (3)');

    setTimeout(() => {
      this.mockIsLoading.set(false);
      this.mockStatusName.set('Resolved (4)');
    }, 1200);
  }

  jumpToLab(): void {
    this.exerciseService.setFilterLab(3);
    this.nav.setTab('workshops-lab');
  }
}
