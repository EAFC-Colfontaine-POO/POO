import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface NetworkPacket {
  id: number;
  query: string;
  status: 'pending' | 'aborted' | 'completed';
  time: string;
}

@Component({
  selector: 'app-dynamic-requests',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">Module 06 · Signaux Dérivés &amp; Annulation de Requêtes</div>
        <h2>Requêtes Dynamiques, Annulation <code>AbortSignal</code> &amp; Suspension</h2>
        <p class="module-desc">
          En fournissant une fonction fléchée <code>() => ...</code> à <code>httpResource</code>,
          celle-ci s'intègre automatiquement au graphe de dépendances d'Angular.
          Expérimentez le recalcul de l'URL, l'annulation par <code>AbortSignal</code>
          lors de la frappe rapide et la mise en veille <code>Idle</code> avec <code>undefined</code>.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'playground'" (click)="activeSubTab.set('playground')">
              🎛️ Playground Réactif &amp; Suspension
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'abort'" (click)="activeSubTab.set('abort')">
              🚫 Simulateur d'Annulation AbortSignal
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'security'" (click)="activeSubTab.set('security')">
              🔒 Atelier Sécurité encodeURIComponent
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 4 ➔
          </button>
        </div>
      </div>

      <!-- SOUS-ONGLET 1 : PLAYGROUND RÉACTIF & SUSPENSION -->
      @if (activeSubTab() === 'playground') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Graphe Réactif en Cascade &amp; Suspension Idle</h3>
              <p class="zone-subtitle">Modifiez les signaux de contrôle ci-dessous pour voir l'URL se recalculer et observer la suspension automatique si moins de 3 caractères.</p>
            </div>
          </div>

          <!-- Contrôles Utilisateurs (Signaux Source) -->
          <div class="controls-bar mt-3">
            <div class="ctrl-group">
              <label>Terme de recherche (<code>signal&lt;string&gt;</code>) :</label>
              <input 
                type="text" 
                class="input-box" 
                [ngModel]="searchQuery()" 
                (ngModelChange)="onSearchChange($event)"
                placeholder="Tapez 'laptop'..." 
              />
              <span class="text-xs text-muted">
                Longueur : {{ searchQuery().trim().length }} car.
                @if (searchQuery().trim().length < 3 && searchQuery().trim().length > 0) {
                  <strong class="text-danger">(&lt; 3 car. ➔ Suspension !)</strong>
                }
              </span>
            </div>

            <div class="ctrl-group">
              <label>Page active (<code>signal&lt;number&gt;</code>) :</label>
              <div class="page-controls">
                <button class="btn-secondary btn-sm" (click)="prevPage()" [disabled]="page() <= 1">◀</button>
                <span class="page-badge">Page {{ page() }}</span>
                <button class="btn-secondary btn-sm" (click)="nextPage()">▶</button>
              </div>
            </div>

            <div class="ctrl-group">
              <label>Catégorie (<code>signal&lt;string&gt;</code>) :</label>
              <select class="input-box" [ngModel]="category()" (ngModelChange)="category.set($event)">
                <option value="all">Toutes les catégories</option>
                <option value="laptops">Ordinateurs (laptops)</option>
                <option value="smartphones">Smartphones</option>
                <option value="fragrances">Parfumerie</option>
              </select>
            </div>
          </div>

          <!-- Visualisation de la Fonction de Requête & de l'URL résultante -->
          <div class="computed-url-box mt-4">
            <div class="url-header">
              <span>Code de la fonction passée à <code>httpResource(() => ...)</code> :</span>
              @if (computedUrl() === undefined) {
                <span class="badge badge-warning">SUSPENDU ➔ ResourceStatus.Idle (0)</span>
              } @else {
                <span class="badge badge-success">ÉMISSION ACTIVE ➔ ResourceStatus.Resolved (4)</span>
              }
            </div>

            <pre class="code-pre"><code>readonly catalogueResource = httpResource(() => &#123;
  const terme = this.searchQuery().trim();
  const cat = this.category();
  const page = this.page();

  // ⏸️ Règle de suspension : moins de 3 caractères ?
  if (terme.length &gt; 0 &amp;&amp; terme.length &lt; 3) &#123;
    <strong class="text-warning">return undefined; // ➔ Angular reste sagement à l'état Idle (0) !</strong>
  &#125;

  return <strong class="text-success">\`https://api.fake.com/articles?q=\${{'{'}}encodeURIComponent(terme){{'}'}}&amp;page=\${{'{'}}page{{'}'}}&amp;cat=\${{'{'}}cat{{'}'}}\`</strong>;
&#125;);</code></pre>

            <div class="url-output-line">
              <span class="label">URL calculée en temps réel :</span>
              <code [class.text-danger]="computedUrl() === undefined" [class.text-success]="computedUrl() !== undefined">
                {{ computedUrl() === undefined ? 'undefined (Aucun appel réseau émis)' : computedUrl() }}
              </code>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 2 : SIMULATEUR D'ANNULATION ABORTSIGNAL -->
      @if (activeSubTab() === 'abort') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Simulateur d'Annulation Automatique AbortSignal</h3>
              <p class="zone-subtitle">Lors d'une frappe rapide, plusieurs requêtes partent. Observez comment Angular annule immédiatement les requêtes obsolètes pour éliminer les bugs de concurrence (Race Conditions).</p>
            </div>

            <button class="btn-primary btn-sm" (click)="simulateFastTyping()">
              ⚡ Simuler frappe rapide ("p" ➔ "pi" ➔ "piz" ➔ "pizza")
            </button>
          </div>

          <!-- Tableau des paquets réseau -->
          <div class="network-inspector mt-3">
            <div class="inspector-header">
              <span>Inspecteur Réseau Virtuel (DevTools Network Panel)</span>
              <button class="btn-ghost btn-sm" (click)="networkPackets.set([])">Effacer</button>
            </div>

            <div class="packets-list">
              @if (networkPackets().length === 0) {
                <div class="empty-packets">Cliquez sur le bouton ci-dessus pour simuler la frappe rapide...</div>
              } @else {
                @for (pkt of networkPackets(); track pkt.id) {
                  <div class="packet-row" [class.pkt-aborted]="pkt.status === 'aborted'" [class.pkt-completed]="pkt.status === 'completed'">
                    <span class="pkt-time">{{ pkt.time }}</span>
                    <span class="pkt-verb">GET</span>
                    <span class="pkt-url">/api/search?q={{ pkt.query }}</span>
                    <span class="pkt-status">
                      @if (pkt.status === 'aborted') {
                        <span class="badge badge-danger">canceled (AbortSignal)</span>
                      } @else if (pkt.status === 'completed') {
                        <span class="badge badge-success">200 OK (Réponse reçue)</span>
                      } @else {
                        <span class="badge badge-warning">Pending...</span>
                      }
                    </span>
                  </div>
                }
              }
            </div>
          </div>

          <div class="abort-explanation mt-3">
            💡 <strong>Pourquoi c'est vital :</strong> Si la réponse pour "pi" prenait 500ms et la réponse pour "pizza" seulement 100ms, sans <code>AbortSignal</code> l'ancienne réponse aurait écrasé la plus récente ! Angular 22 élimine ce problème nativement.
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 3 : ATELIER SÉCURITÉ ENCODEURICOMPONENT -->
      @if (activeSubTab() === 'security') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Atelier Sécurité d'URL : Le Rôle Vital de encodeURIComponent()</h3>
              <p class="zone-subtitle">Découvrez ce qui arrive quand un utilisateur tape un espace, un accent, un &amp; ou un # dans le champ de recherche.</p>
            </div>
          </div>

          <div class="security-test-box mt-3">
            <label class="font-bold text-sm">Testez une saisie à risque :</label>
            <div class="presets-row mt-2">
              <button class="btn-secondary btn-sm" (click)="securityInput.set('ordinateur portable')">Espace : "ordinateur portable"</button>
              <button class="btn-secondary btn-sm" (click)="securityInput.set('café & thé')">Caractère & : "café & thé"</button>
              <button class="btn-secondary btn-sm" (click)="securityInput.set('C# / C++')">Caractères # / : "C# / C++"</button>
            </div>

            <div class="input-row mt-3">
              <input type="text" class="input-box" [ngModel]="securityInput()" (ngModelChange)="securityInput.set($event)" />
            </div>

            <div class="comparison-results mt-4">
              <div class="res-card res-bad">
                <div class="res-title text-danger">❌ SANS encodeURIComponent (Corrompue) :</div>
                <code>https://api.fake.com/articles?q={{ securityInput() }}</code>
                <p class="res-desc">
                  Les espaces peuvent provoquer un rejet HTTP 400. Le caractère <code>&amp;</code> crée artificiellement un nouveau paramètre d'URL non désiré, et <code>#</code> coupe l'URL au fragment !
                </p>
              </div>

              <div class="res-card res-good">
                <div class="res-title text-success">✅ AVEC encodeURIComponent (Sécurisée) :</div>
                <code>https://api.fake.com/articles?q={{ getEncodedInput() }}</code>
                <p class="res-desc">
                  Chaque caractère spécial est traduit en séquence hexadécimale (ex: <code>%20</code> pour espace, <code>%26</code> pour &amp;). L'URL est 100% conforme à la RFC 3986.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .controls-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }

    .ctrl-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-dim);
      }
    }

    .input-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;

      &:focus {
        border-color: #3b82f6;
        outline: none;
      }
    }

    .page-controls {
      display: flex;
      align-items: center;
      gap: 8px;

      .page-badge {
        font-size: 0.8rem;
        font-weight: 700;
        font-family: var(--font-mono);
      }
    }

    .computed-url-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .url-header {
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        padding: 10px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;
        font-weight: 700;
      }

      .code-pre {
        padding: 14px;
        font-size: 0.8rem;
        font-family: var(--font-mono);
      }

      .url-output-line {
        background: var(--bg-card);
        border-top: 1px solid var(--border-color);
        padding: 12px 14px;
        display: flex;
        gap: 10px;
        align-items: center;
        font-size: 0.82rem;

        .label {
          font-weight: 700;
          color: var(--text-dim);
        }
      }
    }

    .network-inspector {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .inspector-header {
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        padding: 10px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;
        font-weight: 700;
      }

      .packets-list {
        height: 180px;
        overflow-y: auto;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
    }

    .packet-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 10px;
      border-radius: 4px;
      background: var(--bg-card);
      font-family: var(--font-mono);
      font-size: 0.75rem;

      &.pkt-aborted {
        opacity: 0.6;
        text-decoration: line-through;
        background: rgba(239, 68, 68, 0.05);
      }

      &.pkt-completed {
        border-left: 3px solid #10b981;
      }

      .pkt-time {
        color: var(--text-dim);
      }

      .pkt-verb {
        font-weight: 800;
        color: #60a5fa;
      }

      .pkt-url {
        flex: 1;
      }
    }

    .empty-packets {
      color: var(--text-dim);
      font-style: italic;
      text-align: center;
      margin: auto;
      font-size: 0.8rem;
    }

    .abort-explanation, .security-test-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      font-size: 0.85rem;
    }

    .presets-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .comparison-results {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .res-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.82rem;

      code {
        background: var(--bg-subtle);
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 0.78rem;
        word-break: break-all;
      }

      .res-desc {
        color: var(--text-muted);
        line-height: 1.4;
      }

      &.res-bad {
        border-color: rgba(239, 68, 68, 0.4);
      }

      &.res-good {
        border-color: rgba(16, 185, 129, 0.4);
      }
    }
  `]
})
export class DynamicRequestsComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly activeSubTab = signal<'playground' | 'abort' | 'security'>('playground');

  readonly searchQuery = signal<string>('pizza');
  readonly page = signal<number>(1);
  readonly category = signal<string>('all');

  readonly computedUrl = computed<string | undefined>(() => {
    const q = this.searchQuery().trim();
    if (q.length > 0 && q.length < 3) {
      return undefined;
    }
    const cat = this.category();
    const p = this.page();
    return `https://api.fake.com/articles?q=${encodeURIComponent(q)}&page=${p}&cat=${cat}`;
  });

  onSearchChange(val: string): void {
    this.searchQuery.set(val);
  }

  nextPage(): void {
    this.page.update(p => p + 1);
  }

  prevPage(): void {
    this.page.update(p => Math.max(1, p - 1));
  }

  // Abort
  readonly networkPackets = signal<NetworkPacket[]>([]);

  simulateFastTyping(): void {
    this.networkPackets.set([]);
    const queries = ['p', 'pi', 'piz', 'pizza'];
    let delay = 0;

    queries.forEach((q, idx) => {
      setTimeout(() => {
        const time = new Date().toLocaleTimeString();
        // Annuler les paquets précédents s'il y en avait
        this.networkPackets.update(list =>
          list.map(pkt => pkt.status === 'pending' ? { ...pkt, status: 'aborted' } : pkt)
        );

        const newPkt: NetworkPacket = {
          id: idx + 1,
          query: q,
          status: 'pending',
          time
        };

        this.networkPackets.update(list => [...list, newPkt]);

        // Si c'est le dernier ("pizza"), il se complète
        if (idx === queries.length - 1) {
          setTimeout(() => {
            this.networkPackets.update(list =>
              list.map(p => p.id === newPkt.id ? { ...p, status: 'completed' } : p)
            );
          }, 400);
        }
      }, delay);
      delay += 180;
    });
  }

  // Security
  readonly securityInput = signal<string>('café & thé');

  getEncodedInput(): string {
    return encodeURIComponent(this.securityInput().trim());
  }

  jumpToLab(): void {
    this.exerciseService.setFilterLab(4);
    this.nav.setTab('workshops-lab');
  }
}
