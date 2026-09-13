import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpaSpaComparisonItem, ComparisonCategory } from '../../core/models/app.models';

@Component({
  selector: 'app-mpa-vs-spa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Architecture Web — Fondations & Paradigmes</div>
        <h2>1. Simulateur d'Architecture : MPA vs SPA</h2>
        <p class="module-desc">
          Comparez concrètement le cycle de vie d'une <strong>Multi-Page Application (MPA)</strong> traditionnelle 
          et d'une <strong>Single Page Application (SPA)</strong> moderne sous Angular. Observez l'impact du rechargement complet 
          (effet de flash blanc et perte d'état client) face à la réactivité d'un routage côté client avec requêtes asynchrones JSON.
        </p>
      </div>

      <!-- Sélecteur de mode simulateur -->
      <div class="simulator-control-panel card-panel">
        <div class="panel-title-row">
          <div class="panel-title">
            <span class="pulse-indicator"></span>
            <span>Banc d'Essai Interactif du Flux Réseau</span>
          </div>
          <div class="mode-switch-group">
            <button 
              class="switch-btn" 
              [class.active]="simMode() === 'mpa'"
              (click)="setMode('mpa')"
            >
              Mode MPA (Traditionnel)
            </button>
            <button 
              class="switch-btn" 
              [class.active]="simMode() === 'spa'"
              (click)="setMode('spa')"
            >
              Mode SPA (Angular Moderne)
            </button>
          </div>
        </div>

        <!-- Zone du simulateur de navigateur -->
        <div class="browser-mockup">
          <!-- Barre d'adresse -->
          <div class="browser-chrome">
            <div class="window-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="address-bar">
              <span class="padlock">🔒</span>
              <span class="url-text">{{ currentUrl() }}</span>
            </div>
            <button class="nav-action-btn" (click)="triggerNavigation()" [disabled]="isNavigating()">
              {{ isNavigating() ? 'Chargement en cours...' : '🔄 Naviguer vers /profil' }}
            </button>
          </div>

          <!-- Écran de navigation avec effet flash blanc si MPA -->
          <div class="browser-viewport" [class.white-flash]="isFlashing()">
            <!-- Diagramme de flux animé -->
            <div class="network-flow-diagram">
              <div class="flow-actor client-actor">
                <div class="actor-icon">💻</div>
                <div class="actor-name">Navigateur Client</div>
                <div class="actor-role">{{ simMode() === 'mpa' ? 'Moteur HTML natif' : 'Runtime Angular SPA' }}</div>
              </div>

              <div class="flow-conduit">
                @if (isNavigating()) {
                  <div class="packet-animation" [class.spa-packet]="simMode() === 'spa'">
                    <span class="packet-label">{{ packetText() }}</span>
                  </div>
                } @else {
                  <div class="idle-conduit">
                    <span>{{ idleMessage() }}</span>
                  </div>
                }
              </div>

              <div class="flow-actor server-actor">
                <div class="actor-icon">🗄️</div>
                <div class="actor-name">Serveur Web</div>
                <div class="actor-role">{{ simMode() === 'mpa' ? 'Serveur PHP / Java / ASP.NET' : 'API REST / JSON (Spring, Node, Django)' }}</div>
              </div>
            </div>

            <!-- Page rendue dans le faux navigateur -->
            <div class="mock-page-content">
              <div class="mock-nav">
                <span class="mock-logo">EAFC Portal</span>
                <span class="mock-page-indicator">Vue active : <strong>{{ currentPage() }}</strong></span>
              </div>

              <div class="mock-body">
                @if (currentPage() === 'cours') {
                  <div class="view-panel">
                    <h3>📚 Liste des Cours Disponibles</h3>
                    <p>Bienvenue sur la plateforme pédagogique de l'EAFC Colfontaine.</p>
                  </div>
                } @else {
                  <div class="view-panel">
                    <h3>👤 Espace Profil Étudiant</h3>
                    <p>Données chargées : <strong>Jean Dupont (Informatique de Gestion)</strong></p>
                  </div>
                }

                <!-- Démonstrateur de conservation de l'état client -->
                <div class="state-preservation-box">
                  <div class="box-label">
                    <span>📝 Test de persistance de l'état (Brouillon temporaire) :</span>
                    @if (stateLostAlert()) {
                      <span class="state-warning-badge">⚠️ État réinitialisé lors du rechargement MPA !</span>
                    } @else if (userDraft().length > 0 && !isNavigating()) {
                      <span class="state-success-badge">✓ État conservé intact dans le runtime SPA</span>
                    }
                  </div>
                  <input 
                    type="text" 
                    class="state-input" 
                    placeholder="Tapez une note ici puis cliquez sur 'Naviguer vers /profil'..." 
                    [value]="userDraft()"
                    (input)="onDraftChange($event)"
                  />
                  <div class="state-explanation">
                    {{ simMode() === 'mpa' 
                      ? 'En MPA : Le rechargement de page détruit complètement l\'arbre DOM et la mémoire JS du navigateur.' 
                      : 'En SPA : La mémoire JavaScript et les composants non détruits conservent leur état sans interruption.' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inspecteur de la cascade réseau (Waterfall) -->
        <div class="waterfall-inspector">
          <div class="waterfall-header">
            <span class="wf-title">Inspecteur Réseau (DevTools Network)</span>
            <span class="wf-metrics">
              Taille transférée : <strong>{{ simMode() === 'mpa' ? '218 Ko' : '480 octets' }}</strong> | 
              Temps ressenti : <strong>{{ simMode() === 'mpa' ? '~350 ms' : '~25 ms' }}</strong>
            </span>
          </div>

          <div class="waterfall-table">
            <div class="wf-row header-row">
              <span class="col-name">Ressource</span>
              <span class="col-type">Type</span>
              <span class="col-size">Taille</span>
              <span class="col-waterfall">Chronologie Réseau</span>
            </div>

            @if (simMode() === 'mpa') {
              <div class="wf-row">
                <span class="col-name">profil.html</span>
                <span class="col-type">document (HTML)</span>
                <span class="col-size">34 Ko</span>
                <span class="col-waterfall"><div class="bar bar-html" style="width: 80%;">320ms</div></span>
              </div>
              <div class="wf-row">
                <span class="col-name">styles.css</span>
                <span class="col-type">stylesheet (CSS)</span>
                <span class="col-size">48 Ko</span>
                <span class="col-waterfall"><div class="bar bar-css" style="width: 45%;">110ms</div></span>
              </div>
              <div class="wf-row">
                <span class="col-name">app.js</span>
                <span class="col-type">script (JS)</span>
                <span class="col-size">118 Ko</span>
                <span class="col-waterfall"><div class="bar bar-js" style="width: 60%;">190ms</div></span>
              </div>
              <div class="wf-row">
                <span class="col-name">avatar.png</span>
                <span class="col-type">png (Image)</span>
                <span class="col-size">18 Ko</span>
                <span class="col-waterfall"><div class="bar bar-img" style="width: 30%;">85ms</div></span>
              </div>
            } @else {
              <div class="wf-row">
                <span class="col-name">api/profile.json</span>
                <span class="col-type">fetch / xhr (JSON)</span>
                <span class="col-size">480 octets</span>
                <span class="col-waterfall"><div class="bar bar-json" style="width: 15%;">22ms</div></span>
              </div>
              <div class="wf-row cached-row">
                <span class="col-name">bundles Angular</span>
                <span class="col-type">script / style</span>
                <span class="col-size">En mémoire</span>
                <span class="col-waterfall"><span class="cached-label">✓ Déjà chargés lors du bootstrap initial (zéro requête réseau)</span></span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Tableau comparatif Avantages / Compromis -->
      <div class="matrix-section card-panel">
        <div class="matrix-header">
          <h3>Tableau Comparatif : MPA vs SPA</h3>
          <div class="filter-pills">
            <button class="pill" [class.active]="selectedCategory() === 'all'" (click)="setCategory('all')">Tous les critères</button>
            <button class="pill" [class.active]="selectedCategory() === 'perf'" (click)="setCategory('perf')">Performance & Fluidité</button>
            <button class="pill" [class.active]="selectedCategory() === 'seo'" (click)="setCategory('seo')">SEO & Indexation</button>
            <button class="pill" [class.active]="selectedCategory() === 'state'" (click)="setCategory('state')">État Client & Mémoire</button>
            <button class="pill" [class.active]="selectedCategory() === 'arch'" (click)="setCategory('arch')">Découplage Front / Back</button>
          </div>
        </div>

        <div class="comparison-grid">
          @for (item of filteredItems(); track item.id) {
            <div class="matrix-card">
              <div class="matrix-card-top">
                <span class="category-tag">{{ item.categoryLabel }}</span>
                <h4 class="topic-title">{{ item.topic }}</h4>
              </div>

              <div class="matrix-sides">
                <div class="side mpa-side">
                  <div class="side-header">
                    <span class="side-badge" [class.badge-bad]="item.mpaStatus === 'negative'" [class.badge-good]="item.mpaStatus === 'positive'" [class.badge-neutral]="item.mpaStatus === 'neutral'">
                      MPA
                    </span>
                  </div>
                  <p class="side-text">{{ item.mpaBehavior }}</p>
                </div>

                <div class="side spa-side">
                  <div class="side-header">
                    <span class="side-badge" [class.badge-bad]="item.spaStatus === 'negative'" [class.badge-good]="item.spaStatus === 'positive'" [class.badge-neutral]="item.spaStatus === 'neutral'">
                      SPA (Angular)
                    </span>
                  </div>
                  <p class="side-text">{{ item.spaBehavior }}</p>
                </div>
              </div>

              <div class="pedagogical-box">
                <strong>💡 Ce qu'il faut retenir pour l'examen :</strong> {{ item.pedagogicalTakeaway }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .simulator-control-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .panel-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text-main);
    }

    .pulse-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #dd0031;
      box-shadow: 0 0 10px rgba(221, 0, 49, 0.7);
    }

    .mode-switch-group {
      display: flex;
      background: var(--bg-subtle);
      padding: 4px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      gap: 4px;
    }

    .switch-btn {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);

      &.active {
        background: #dd0031;
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(221, 0, 49, 0.35);
      }
    }

    .browser-mockup {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg-card);
      box-shadow: var(--shadow-md);
    }

    .browser-chrome {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 14px;
      background: var(--bg-subtle);
      border-bottom: 1px solid var(--border-color);
    }

    .window-dots {
      display: flex;
      gap: 6px;

      .dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        &.red { background: #ef4444; }
        &.yellow { background: #f59e0b; }
        &.green { background: #10b981; }
      }
    }

    .address-bar {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      padding: 5px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-main);
    }

    .nav-action-btn {
      background: linear-gradient(135deg, #dd0031, #b90029);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;

      &:hover:not(:disabled) {
        background: #e91e63;
      }
    }

    .browser-viewport {
      position: relative;
      min-height: 280px;
      padding: 20px;
      transition: background-color 0.15s ease;

      &.white-flash {
        background: #ffffff !important;
        * { opacity: 0.1; }
      }
    }

    .network-flow-diagram {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 24px;
      margin-bottom: 20px;
    }

    .flow-actor {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 140px;

      .actor-icon { font-size: 2rem; }
      .actor-name { font-weight: 700; font-size: 0.85rem; color: var(--text-main); }
      .actor-role { font-size: 0.72rem; color: var(--text-muted); }
    }

    .flow-conduit {
      flex: 1;
      margin: 0 20px;
      height: 38px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 2px dashed var(--border-focus);
    }

    .idle-conduit {
      font-size: 0.76rem;
      color: var(--text-dim);
      font-style: italic;
    }

    .packet-animation {
      position: absolute;
      padding: 4px 10px;
      background: #f59e0b;
      color: #000000;
      font-size: 0.74rem;
      font-weight: 700;
      border-radius: 12px;
      animation: packetMove 1.4s infinite ease-in-out;

      &.spa-packet {
        background: #10b981;
        color: #ffffff;
      }
    }

    @keyframes packetMove {
      0% { left: 5%; opacity: 0.2; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.05); }
      100% { left: 85%; opacity: 0.2; transform: scale(0.9); }
    }

    .mock-page-content {
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 16px;
      background: var(--bg-app);
    }

    .mock-nav {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;
      margin-bottom: 14px;
      font-size: 0.82rem;

      .mock-logo { font-weight: 800; color: #dd0031; }
      .mock-page-indicator { color: var(--text-muted); }
    }

    .view-panel {
      margin-bottom: 16px;
      h3 { font-size: 1.1rem; color: var(--text-main); margin-bottom: 4px; }
      p { font-size: 0.85rem; color: var(--text-muted); }
    }

    .state-preservation-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .box-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-main);
      }

      .state-warning-badge {
        color: #ef4444;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .state-success-badge {
        color: #10b981;
        font-size: 0.75rem;
        font-weight: 700;
      }

      .state-input {
        background: var(--bg-app);
        border: 1px solid var(--border-color);
        padding: 8px 12px;
        border-radius: 4px;
        color: var(--text-main);
        font-size: 0.85rem;

        &:focus {
          border-color: #dd0031;
          outline: none;
        }
      }

      .state-explanation {
        font-size: 0.73rem;
        color: var(--text-dim);
        font-style: italic;
      }
    }

    .waterfall-inspector {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      font-family: var(--font-mono);
      font-size: 0.78rem;
    }

    .waterfall-header {
      display: flex;
      justify-content: space-between;
      padding: 8px 14px;
      background: var(--terminal-header, #121826);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-muted);
      font-weight: 600;

      .wf-metrics strong {
        color: #f8fafc;
      }
    }

    .waterfall-table {
      display: flex;
      flex-direction: column;
    }

    .wf-row {
      display: flex;
      align-items: center;
      padding: 6px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &.header-row {
        color: var(--text-dim);
        font-weight: 700;
      }

      &.cached-row {
        color: #10b981;
        font-style: italic;
      }

      .col-name { width: 25%; color: #38bdf8; }
      .col-type { width: 22%; color: var(--text-muted); }
      .col-size { width: 18%; color: #e2e8f0; }
      .col-waterfall { flex: 1; display: flex; align-items: center; }
    }

    .bar {
      height: 14px;
      border-radius: 3px;
      font-size: 0.68rem;
      display: flex;
      align-items: center;
      padding-left: 6px;
      color: #ffffff;
      font-weight: 600;

      &.bar-html { background: #ea580c; }
      &.bar-css { background: #0284c7; }
      &.bar-js { background: #eab308; color: #000; }
      &.bar-img { background: #9333ea; }
      &.bar-json { background: #10b981; }
    }

    .cached-label {
      font-size: 0.72rem;
      color: #34d399;
    }

    /* Matrice Avantages / Inconvénients */
    .matrix-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .matrix-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;

      h3 { font-size: 1.15rem; color: var(--text-main); font-weight: 700; }
    }

    .filter-pills {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .pill {
        padding: 5px 12px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.75rem;
        color: var(--text-muted);

        &.active {
          background: #dd0031;
          color: #ffffff;
          border-color: #dd0031;
          font-weight: 600;
        }
      }
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 16px;
    }

    .matrix-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &:hover {
        border-color: rgba(221, 0, 49, 0.4);
      }
    }

    .matrix-card-top {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .category-tag {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #dd0031;
      }

      .topic-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .matrix-sides {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .side {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .side-header {
        display: flex;
        align-items: center;
      }

      .side-badge {
        font-size: 0.68rem;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;

        &.badge-bad { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        &.badge-good { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        &.badge-neutral { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
      }

      .side-text {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.35;
      }
    }

    .pedagogical-box {
      background: rgba(49, 120, 198, 0.08);
      border-left: 3px solid #3178c6;
      padding: 8px 10px;
      border-radius: 0 4px 4px 0;
      font-size: 0.76rem;
      color: var(--text-main);
      line-height: 1.4;
    }
  `]
})
export class MpaVsSpaComponent {
  readonly simMode = signal<'mpa' | 'spa'>('mpa');
  readonly isNavigating = signal<boolean>(false);
  readonly isFlashing = signal<boolean>(false);
  readonly currentUrl = signal<string>('http://eafc-cours.be/cours');
  readonly currentPage = signal<'cours' | 'profil'>('cours');
  readonly userDraft = signal<string>('Note importante pour mon projet d\'examen...');
  readonly stateLostAlert = signal<boolean>(false);
  readonly packetText = signal<string>('GET /profil HTTP/1.1');
  readonly idleMessage = signal<string>('Canal inactif — Prêt pour une navigation');

  readonly selectedCategory = signal<ComparisonCategory>('all');

  readonly comparisonData: MpaSpaComparisonItem[] = [
    {
      id: 'm1',
      category: 'perf',
      categoryLabel: 'Performance & Fluidité',
      topic: 'Expérience Utilisateur lors de la Navigation',
      mpaBehavior: 'Rechargement complet de la fenêtre avec latence et effet de flash blanc à chaque clic.',
      mpaStatus: 'negative',
      spaBehavior: 'Transition instantanée, le routeur client intercepte le clic sans recharger la page.',
      spaStatus: 'positive',
      pedagogicalTakeaway: 'Une SPA offre un confort proche d\'une application de bureau native grâce au routage côté client.'
    },
    {
      id: 'm2',
      category: 'perf',
      categoryLabel: 'Performance & Fluidité',
      topic: 'Consommation de Bande Passante Réseau',
      mpaBehavior: 'Re-téléchargement systématique de l\'intégralité du document HTML et des ressources statiques identiques.',
      mpaStatus: 'negative',
      spaBehavior: 'Seules les données brutes utiles (JSON de quelques centaines d\'octets) transitent après le démarrage initial.',
      spaStatus: 'positive',
      pedagogicalTakeaway: 'Une fois le bundle initial chargé, les requêtes réseau sont ultra-légères.'
    },
    {
      id: 'm3',
      category: 'state',
      categoryLabel: 'État Client & Mémoire',
      topic: 'Préservation de l\'État de l\'Interface (State)',
      mpaBehavior: 'Destruction intégrale de l\'arbre DOM et de la mémoire JS à chaque changement de page.',
      mpaStatus: 'negative',
      spaBehavior: 'La mémoire client et les variables (ex. formulaire non soumis, filtres) persistent sans interruption.',
      spaStatus: 'positive',
      pedagogicalTakeaway: 'L\'état de l\'application reste sous contrôle direct du développeur frontend.'
    },
    {
      id: 'm4',
      category: 'arch',
      categoryLabel: 'Découplage Front / Back',
      topic: 'Séparation des Responsabilités (SoC)',
      mpaBehavior: 'Fort couplage : le serveur compose le HTML et injecte les données (PHP, JSP, ASP.NET).',
      mpaStatus: 'neutral',
      spaBehavior: 'Séparation stricte : le Frontend s\'occupe à 100% de l\'UI, le Backend ne sert que d\'API REST/GraphQL.',
      spaStatus: 'positive',
      pedagogicalTakeaway: 'L\'API REST du backend peut être directement réutilisée par une application mobile (Android/iOS).'
    },
    {
      id: 'm5',
      category: 'seo',
      categoryLabel: 'SEO & Indexation',
      topic: 'Référencement Naturel par les Moteurs de Recherche',
      mpaBehavior: 'Excellente indexation immédiate : le HTML est servi prêt et complet aux robots des moteurs.',
      mpaStatus: 'positive',
      spaBehavior: 'Défis en rendu purement client (CSR) : nécessite du SSR (Server-Side Rendering) pour optimiser le SEO.',
      spaStatus: 'negative',
      pedagogicalTakeaway: 'Les SPA sont idéales pour les intranets, portails et tableaux de bord, mais requièrent Angular SSR pour le e-commerce public.'
    }
  ];

  setMode(mode: 'mpa' | 'spa'): void {
    this.simMode.set(mode);
    this.stateLostAlert.set(false);
  }

  setCategory(cat: ComparisonCategory): void {
    this.selectedCategory.set(cat);
  }

  filteredItems(): MpaSpaComparisonItem[] {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.comparisonData;
    return this.comparisonData.filter(item => item.category === cat);
  }

  onDraftChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.userDraft.set(target.value);
  }

  triggerNavigation(): void {
    if (this.isNavigating()) return;
    this.isNavigating.set(true);
    this.stateLostAlert.set(false);

    const targetUrl = this.currentPage() === 'cours' ? 'http://eafc-cours.be/profil' : 'http://eafc-cours.be/cours';
    const targetPage = this.currentPage() === 'cours' ? 'profil' : 'cours';

    if (this.simMode() === 'mpa') {
      // Séquence MPA : Requête HTTP -> Flash blanc -> Perte d'état
      this.packetText.set('GET ' + targetPage + ' (Requête HTTP complète)');

      setTimeout(() => {
        // Flash blanc de rechargement total
        this.isFlashing.set(true);

        setTimeout(() => {
          this.currentPage.set(targetPage);
          this.currentUrl.set(targetUrl);
          this.userDraft.set(''); // Perte d'état brutale
          this.stateLostAlert.set(true);
          this.isFlashing.set(false);
          this.isNavigating.set(false);
        }, 350);
      }, 700);

    } else {
      // Séquence SPA : Déclenchement du routeur Angular + appel JSON léger
      this.currentUrl.set(targetUrl);
      this.packetText.set('fetch(/api/' + targetPage + '.json) -> 480B');

      setTimeout(() => {
        this.currentPage.set(targetPage);
        // L'état userDraft est scrupuleusement conservé !
        this.isNavigating.set(false);
      }, 550);
    }
  }
}
