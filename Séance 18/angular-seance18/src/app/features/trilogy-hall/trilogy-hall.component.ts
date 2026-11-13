import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-trilogy-hall',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 01 · LES FONDATIONS DU STOCKAGE WEB</div>
        <h2>Le Hall de la Trilogie Web : Cookies vs SessionStorage vs LocalStorage</h2>
        <p class="module-desc">
          Distinguez physiquement les trois mécanismes de stockage du navigateur à travers l'expérimentation visuelle :
          cycle de vie, portée (scope), transit réseau HTTP et arbre de décision pour orienter vos choix d'ingénierie POO.
        </p>
      </div>

      <!-- Sélecteur des 3 Tiroirs -->
      <div class="drawer-tabs-row">
        <button 
          class="drawer-tab" 
          [class.active]="selectedDrawer() === 'cookie'"
          (click)="selectedDrawer.set('cookie')"
        >
          <span class="d-icon">🍪</span>
          <div class="d-info">
            <span class="d-title">Le Cookie HTTP</span>
            <span class="d-sub">Le Badge Visiteur (~4 Ko)</span>
          </div>
        </button>

        <button 
          class="drawer-tab" 
          [class.active]="selectedDrawer() === 'session'"
          (click)="selectedDrawer.set('session')"
        >
          <span class="d-icon">⏱️</span>
          <div class="d-info">
            <span class="d-title">SessionStorage</span>
            <span class="d-sub">Le Casier de Piscine (~5 Mo)</span>
          </div>
        </button>

        <button 
          class="drawer-tab" 
          [class.active]="selectedDrawer() === 'local'"
          (click)="selectedDrawer.set('local')"
        >
          <span class="d-icon">🗄️</span>
          <div class="d-info">
            <span class="d-title">LocalStorage</span>
            <span class="d-sub">Le Coffre de Maison (~5 à 10 Mo)</span>
          </div>
        </button>
      </div>

      <!-- Contenu du Tiroir Actif -->
      <div class="card-panel drawer-detail-panel">
        @switch (selectedDrawer()) {
          @case ('cookie') {
            <div class="drawer-view cookie-view">
              <div class="view-header">
                <div class="header-badge-row">
                  <span class="badge badge-warning">Portée : Domaine &amp; Réseau</span>
                  <span class="badge badge-red">Plafond : ~4 Ko</span>
                  <span class="badge badge-purple">Sécurité : HttpOnly / Secure / SameSite</span>
                </div>
                <h3>🍪 Le Cookie : Embarquement Automatique sur le Réseau</h3>
                <p class="sub-text">
                  Tout cookie créé est <strong>automatiquement injecté par le navigateur</strong> dans l'en-tête
                  <code>Cookie: ...</code> de <strong>chaque future requête HTTP</strong> (fichiers, images, API REST).
                </p>
              </div>

              <div class="interactive-sandbox grid-2">
                <div class="config-box">
                  <div class="box-label">Paramètres du Cookie Client</div>
                  <div class="form-group">
                    <label>Nom du Cookie :</label>
                    <input type="text" [value]="cookieName()" (input)="cookieName.set($any($event.target).value)" />
                  </div>
                  <div class="form-group">
                    <label>Valeur (Jeton ou Session) :</label>
                    <input type="text" [value]="cookieValue()" (input)="cookieValue.set($any($event.target).value)" />
                  </div>
                  <div class="flags-group">
                    <label class="checkbox-label">
                      <input type="checkbox" [checked]="httpOnly()" (change)="httpOnly.set(!httpOnly())" />
                      <span><code>HttpOnly</code> (Inaccessible en JS, protection anti-XSS)</span>
                    </label>
                    <label class="checkbox-label">
                      <input type="checkbox" [checked]="secureFlag()" (change)="secureFlag.set(!secureFlag())" />
                      <span><code>Secure</code> (HTTPS uniquement)</span>
                    </label>
                    <label class="checkbox-label">
                      <input type="checkbox" [checked]="sameSite()" (change)="sameSite.set(!sameSite())" />
                      <span><code>SameSite=Strict</code> (Protection CSRF)</span>
                    </label>
                  </div>

                  <div class="size-meter">
                    <div class="size-text">
                      <span>Poids du cookie :</span>
                      <strong>{{ cookieSize() }} / 4096 octets</strong>
                    </div>
                    <div class="meter-bar">
                      <div class="meter-fill" [style.width.%]="(cookieSize() / 4096) * 100"></div>
                    </div>
                  </div>

                  <button class="btn-primary" (click)="simulateHttpRequest()">
                    🚀 Simuler Requête HTTP vers le Serveur
                  </button>
                </div>

                <div class="network-wire-box">
                  <div class="box-label">Visualiseur de Trames Réseau (Headers HTTP)</div>
                  @if (httpRequestTriggered()) {
                    <div class="http-packet animate-fade">
                      <div class="packet-line method">GET /api/v1/profil-etudiant HTTP/1.1</div>
                      <div class="packet-line header">Host: api.eafc-bruxelles.be</div>
                      <div class="packet-line header">Accept: application/json</div>
                      <div class="packet-line header cookie-header">
                        <span class="hl-cookie">Cookie:</span> {{ cookieName() }}={{ cookieValue() }};
                      </div>
                      <div class="packet-line header">User-Agent: Mozilla/5.0 (TypeScript Lab)</div>
                      <div class="packet-note">
                        ⚠️ <strong>Constat d'ingénierie :</strong> Ces octets voyagent à chaque aller-retour.
                        Y stocker 50 articles d'un panier ralentirait chaque clic de l'étudiant !
                      </div>
                    </div>
                  } @else {
                    <div class="placeholder-wire">
                      Cliquez sur « Simuler Requête HTTP » pour observer l'envoi transparent du Cookie par le navigateur.
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @case ('session') {
            <div class="drawer-view session-view">
              <div class="view-header">
                <div class="header-badge-row">
                  <span class="badge badge-purple">Portée : Onglet Unique</span>
                  <span class="badge badge-teal">Cycle : Meurt à la fermeture de l'onglet</span>
                  <span class="badge badge-success">Capacité : ~5 Mo</span>
                </div>
                <h3>⏱️ SessionStorage : Le Casier de Piscine Isolé</h3>
                <p class="sub-text">
                  Deux onglets ouverts sur la même URL ont chacun leur <strong>espace hermétique</strong>.
                  Survit au rechargement (<kbd>F5</kbd>), mais se vide dès la fermeture de la fenêtre.
                </p>
              </div>

              <!-- Simulateur de deux onglets virtuels -->
              <div class="tabs-simulator grid-2">
                <!-- Onglet Virtuel A -->
                <div class="virtual-tab-card" [class.focused]="activeVirtualTab() === 'A'">
                  <div class="tab-card-header">
                    <span class="tab-dot dot-red"></span>
                    <span class="tab-dot dot-yellow"></span>
                    <span class="tab-dot dot-green"></span>
                    <span class="tab-title">Onglet A (localhost:4200/panier)</span>
                    <button class="btn-ghost btn-xs" (click)="activeVirtualTab.set('A')">Activer</button>
                  </div>
                  <div class="tab-card-body">
                    <div class="field-row">
                      <label>Donnée stockée (Casier A) :</label>
                      <input 
                        type="text" 
                        [value]="sessionDataA()" 
                        (input)="onSessionAInput($any($event.target).value)"
                        placeholder="Ex: Étape 2 du wizard de commande..."
                      />
                    </div>
                    <div class="storage-state">
                      <code>sessionStorage.getItem('step')</code> ➔
                      <strong class="val-pill">{{ sessionDataA() || 'null' }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Onglet Virtuel B -->
                <div class="virtual-tab-card" [class.focused]="activeVirtualTab() === 'B'">
                  <div class="tab-card-header">
                    <span class="tab-dot dot-red"></span>
                    <span class="tab-dot dot-yellow"></span>
                    <span class="tab-dot dot-green"></span>
                    <span class="tab-title">Onglet B (localhost:4200/panier)</span>
                    <button class="btn-ghost btn-xs" (click)="activeVirtualTab.set('B')">Activer</button>
                  </div>
                  <div class="tab-card-body">
                    <div class="field-row">
                      <label>Donnée stockée (Casier B) :</label>
                      <input 
                        type="text" 
                        [value]="sessionDataB()" 
                        (input)="onSessionBInput($any($event.target).value)"
                        placeholder="Ex: Étape 1 d'une autre commande..."
                      />
                    </div>
                    <div class="storage-state">
                      <code>sessionStorage.getItem('step')</code> ➔
                      <strong class="val-pill">{{ sessionDataB() || 'null' }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-actions-bar">
                <button class="btn-secondary" (click)="simulateReloadTab()">
                  🔄 Simuler Rechargement (F5) ➔ La donnée survit !
                </button>
                <button class="btn-danger" (click)="simulateCloseTab()">
                  ❌ Simuler Fermeture de l'onglet ➔ Le casier se vide !
                </button>
                <span class="action-feedback">{{ sessionFeedback() }}</span>
              </div>
            </div>
          }

          @case ('local') {
            <div class="drawer-view local-view">
              <div class="view-header">
                <div class="header-badge-row">
                  <span class="badge badge-success">Portée : Tout le Domaine (Origine)</span>
                  <span class="badge badge-ts">Durée : Permanente (Jusqu'à suppression)</span>
                  <span class="badge badge-warning">Capacité : 5 à 10 Mo</span>
                </div>
                <h3>🗄️ LocalStorage : Le Coffre-Fort Domestique</h3>
                <p class="sub-text">
                  Enregistré physiquement sur le disque dur. Partagé instantanément par tous les onglets du même domaine.
                  Persiste après redémarrage de la machine !
                </p>
              </div>

              <div class="local-live-demo grid-2">
                <div class="box-panel">
                  <div class="box-label">Écrire dans le Coffre Local</div>
                  <div class="form-group">
                    <label>Clé :</label>
                    <input type="text" [value]="localKey()" (input)="localKey.set($any($event.target).value)" />
                  </div>
                  <div class="form-group">
                    <label>Valeur :</label>
                    <input type="text" [value]="localVal()" (input)="localVal.set($any($event.target).value)" />
                  </div>
                  <div class="btn-row">
                    <button class="btn-primary" (click)="saveLocalDemo()">Sauvegarder</button>
                    <button class="btn-secondary" (click)="clearLocalDemo()">Vider la clé</button>
                  </div>
                </div>

                <div class="box-panel disk-preview">
                  <div class="box-label">État Physique sur Disque (Simulateur DevTools)</div>
                  <div class="disk-meta">
                    <div class="meta-row">
                      <span>Origine :</span>
                      <code>http://localhost:4200</code>
                    </div>
                    <div class="meta-row">
                      <span>Clé enregistrée :</span>
                      <code>{{ localKey() }}</code>
                    </div>
                    <div class="meta-row">
                      <span>Valeur brute :</span>
                      <code class="val-highlight">{{ savedLocalVal() !== null ? savedLocalVal() : '(clé absente / null)' }}</code>
                    </div>
                    <div class="meta-row">
                      <span>Persistance après F5 :</span>
                      <strong class="text-success">OUI ✅ (Survit indéfiniment)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </div>

      <!-- Arbre de Décision Dynamique -->
      <div class="card-panel decision-tree-panel">
        <div class="tree-header">
          <div class="module-tag">AIDE AU CHOIX D'ARCHITECTURE</div>
          <h3>🌲 Arbre de Décision Dynamique : Quel Stockage Choisir ?</h3>
          <p class="sub-text">Répondez aux 3 critères pour obtenir la recommandation technique conforme :</p>
        </div>

        <div class="questions-grid">
          <div class="q-card" [class.selected]="q1ServerNeed() !== null">
            <div class="q-num">Question 1</div>
            <div class="q-title">Le serveur a-t-il besoin de lire cette donnée à chaque requête HTTP ?</div>
            <div class="q-choices">
              <button 
                class="choice-btn" 
                [class.active]="q1ServerNeed() === true" 
                (click)="q1ServerNeed.set(true)"
              >
                OUI (ex: Session, Jeton Auth)
              </button>
              <button 
                class="choice-btn" 
                [class.active]="q1ServerNeed() === false" 
                (click)="q1ServerNeed.set(false)"
              >
                NON (100% Client)
              </button>
            </div>
          </div>

          <div class="q-card" [class.selected]="q2TabIsolated() !== null" [class.disabled]="q1ServerNeed() === true">
            <div class="q-num">Question 2</div>
            <div class="q-title">La donnée doit-elle être détruite dès la fermeture de l'onglet ?</div>
            <div class="q-choices">
              <button 
                class="choice-btn" 
                [class.active]="q2TabIsolated() === true" 
                [disabled]="q1ServerNeed() === true"
                (click)="q2TabIsolated.set(true)"
              >
                OUI (Casier éphémère)
              </button>
              <button 
                class="choice-btn" 
                [class.active]="q2TabIsolated() === false" 
                [disabled]="q1ServerNeed() === true"
                (click)="q2TabIsolated.set(false)"
              >
                NON (Persistance durable)
              </button>
            </div>
          </div>

          <div class="q-card" [class.selected]="q3HeavyVolume() !== null" [class.disabled]="q1ServerNeed() === true || q2TabIsolated() === true">
            <div class="q-num">Question 3</div>
            <div class="q-title">Le volume dépasse-t-il 5 Mo ou exige-t-il des requêtes indexées complexes ?</div>
            <div class="q-choices">
              <button 
                class="choice-btn" 
                [class.active]="q3HeavyVolume() === true" 
                [disabled]="q1ServerNeed() === true || q2TabIsolated() === true"
                (click)="q3HeavyVolume.set(true)"
              >
                OUI (&gt; 5 Mo ou Index BDD)
              </button>
              <button 
                class="choice-btn" 
                [class.active]="q3HeavyVolume() === false" 
                [disabled]="q1ServerNeed() === true || q2TabIsolated() === true"
                (click)="q3HeavyVolume.set(false)"
              >
                NON (Petite préférence &lt; 5 Mo)
              </button>
            </div>
          </div>
        </div>

        <!-- Verdict de l'arbre -->
        <div class="verdict-banner" [class]="verdict().type">
          <div class="verdict-icon">{{ verdict().icon }}</div>
          <div class="verdict-content">
            <div class="verdict-title">Recommandation d'Ingénierie : {{ verdict().tool }}</div>
            <p class="verdict-reason">{{ verdict().reason }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawer-tabs-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;

      .drawer-tab {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        text-align: left;

        &:hover {
          border-color: var(--ts-blue);
          background: var(--bg-card-hover);
        }

        &.active {
          border-color: var(--ts-blue);
          background: rgba(49, 120, 198, 0.12);

          .d-title {
            color: var(--ts-blue-light);
          }
        }

        .d-icon {
          font-size: 2rem;
        }

        .d-info {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .d-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-main);
          }

          .d-sub {
            font-size: 0.78rem;
            color: var(--text-muted);
          }
        }
      }
    }

    .drawer-detail-panel {
      min-height: 380px;

      .view-header {
        margin-bottom: 20px;

        .header-badge-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .sub-text {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
      }
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .config-box, .network-wire-box, .box-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .box-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--ts-blue-light);
        letter-spacing: 0.05em;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;

      label {
        font-size: 0.78rem;
        color: var(--text-muted);
        font-weight: 600;
      }

      input {
        width: 100%;
      }
    }

    .flags-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px 0;

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: var(--text-main);
        cursor: pointer;
      }
    }

    .size-meter {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 4px 0 8px;

      .size-text {
        display: flex;
        justify-content: space-between;
        font-size: 0.76rem;
        color: var(--text-muted);
      }

      .meter-bar {
        height: 6px;
        background: var(--bg-card);
        border-radius: 3px;
        overflow: hidden;

        .meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #f59e0b);
          transition: width 0.3s;
        }
      }
    }

    .network-wire-box {
      background: #060911;

      .placeholder-wire {
        color: var(--text-dim);
        font-size: 0.82rem;
        font-style: italic;
        margin: auto;
        text-align: center;
      }

      .http-packet {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-family: var(--font-mono);
        font-size: 0.82rem;

        .method {
          color: #34d399;
          font-weight: 700;
        }

        .header {
          color: #94a3b8;
        }

        .cookie-header {
          background: rgba(245, 158, 11, 0.15);
          padding: 4px 8px;
          border-radius: 4px;
          border-left: 3px solid #f59e0b;

          .hl-cookie {
            color: #fbbf24;
            font-weight: 700;
          }
        }

        .packet-note {
          margin-top: 14px;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          color: var(--text-muted);
          background: rgba(221, 0, 49, 0.1);
          border: 1px solid rgba(221, 0, 49, 0.25);
          padding: 8px 10px;
          border-radius: 6px;
        }
      }
    }

    .virtual-tab-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      &.focused {
        border-color: var(--ts-blue);
        box-shadow: 0 0 0 2px rgba(49, 120, 198, 0.2);
      }

      .tab-card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-subtle);

        .tab-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.dot-red { background: #ef4444; }
          &.dot-yellow { background: #f59e0b; }
          &.dot-green { background: #10b981; }
        }

        .tab-title {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          flex: 1;
        }
      }

      .tab-card-body {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .storage-state {
          font-size: 0.8rem;
          color: var(--text-muted);

          .val-pill {
            color: #34d399;
            background: rgba(16, 185, 129, 0.12);
            padding: 2px 6px;
            border-radius: 4px;
          }
        }
      }
    }

    .tab-actions-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      flex-wrap: wrap;

      .action-feedback {
        font-size: 0.82rem;
        color: #60a5fa;
        font-weight: 500;
      }
    }

    .disk-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.82rem;

      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid var(--border-subtle);

        .val-highlight {
          color: #34d399;
          font-weight: 600;
        }

        .text-success {
          color: #34d399;
        }
      }
    }

    .btn-row {
      display: flex;
      gap: 8px;
    }

    .decision-tree-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .questions-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;

        .q-card {
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;

          &.selected {
            border-color: rgba(49, 120, 198, 0.4);
          }

          &.disabled {
            opacity: 0.4;
            pointer-events: none;
          }

          .q-num {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--ts-blue-light);
            text-transform: uppercase;
          }

          .q-title {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-main);
            min-height: 48px;
          }

          .q-choices {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .choice-btn {
              padding: 8px 10px;
              background: var(--bg-card);
              border: 1px solid var(--border-color);
              border-radius: 6px;
              font-size: 0.78rem;
              color: var(--text-muted);
              text-align: left;

              &:hover:not(:disabled) {
                background: var(--bg-card-hover);
                color: var(--text-main);
              }

              &.active {
                background: var(--ts-blue);
                color: #ffffff;
                font-weight: 600;
                border-color: var(--ts-blue-light);
              }
            }
          }
        }
      }

      .verdict-banner {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        background: var(--bg-subtle);

        &.cookie {
          border-color: rgba(245, 158, 11, 0.4);
          background: rgba(245, 158, 11, 0.08);
        }

        &.session {
          border-color: rgba(147, 51, 234, 0.4);
          background: rgba(147, 51, 234, 0.08);
        }

        &.local {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.08);
        }

        &.indexeddb {
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(59, 130, 246, 0.08);
        }

        .verdict-icon {
          font-size: 2.2rem;
        }

        .verdict-content {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .verdict-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text-main);
          }

          .verdict-reason {
            font-size: 0.85rem;
            color: var(--text-muted);
            line-height: 1.45;
          }
        }
      }
    }
  `]
})
export class TrilogyHallComponent {
  readonly selectedDrawer = signal<'cookie' | 'session' | 'local'>('cookie');

  // Cookie Simulator state
  readonly cookieName = signal<string>('session_token');
  readonly cookieValue = signal<string>('jwt_eyJhbGciOiJIUzI1NiIsInR5cCI6...');
  readonly httpOnly = signal<boolean>(true);
  readonly secureFlag = signal<boolean>(true);
  readonly sameSite = signal<boolean>(true);
  readonly httpRequestTriggered = signal<boolean>(false);

  readonly cookieSize = computed(() => {
    return this.cookieName().length + this.cookieValue().length + 10;
  });

  // SessionStorage Simulator state
  readonly activeVirtualTab = signal<'A' | 'B'>('A');
  readonly sessionDataA = signal<string>('Panier : 2 articles (Onglet A)');
  readonly sessionDataB = signal<string>('Panier : 0 article (Onglet B vide)');
  readonly sessionFeedback = signal<string>('');

  // LocalStorage Demo state
  readonly localKey = signal<string>('theme_preference');
  readonly localVal = signal<string>('sombre');
  readonly savedLocalVal = signal<string | null>('sombre');

  // Decision Tree state
  readonly q1ServerNeed = signal<boolean | null>(false);
  readonly q2TabIsolated = signal<boolean | null>(false);
  readonly q3HeavyVolume = signal<boolean | null>(false);

  readonly verdict = computed(() => {
    if (this.q1ServerNeed() === true) {
      return {
        type: 'cookie',
        icon: '🍪',
        tool: 'Cookies HTTP (avec HttpOnly et Secure)',
        reason: 'Le serveur a impérativement besoin de recevoir ce jeton à chaque requête réseau. Ne pas y stocker de données applicatives volumineuses !'
      };
    }

    if (this.q2TabIsolated() === true) {
      return {
        type: 'session',
        icon: '⏱️',
        tool: 'SessionStorage (window.sessionStorage)',
        reason: 'Donnée éphémère isolée à un seul onglet. Idéal pour les formulaires multi-étapes, les filtres temporaires et les transactions uniques.'
      };
    }

    if (this.q3HeavyVolume() === true) {
      return {
        type: 'indexeddb',
        icon: '🚀',
        tool: 'IndexedDB & Dexie.js (Séance 19)',
        reason: 'Le volume dépasse 5 Mo ou nécessite des index et requêtes asynchrones non-bloquantes. LocalStorage saturerait ou gèlerait l\'Event Loop !'
      };
    }

    return {
      type: 'local',
      icon: '🗄️',
      tool: 'LocalStorage (window.localStorage)',
      reason: 'Choix optimal pour les préférences légères (< 5 Mo), thèmes graphiques, drapeaux d\'onboarding et petits états durables persistants.'
    };
  });

  simulateHttpRequest(): void {
    this.httpRequestTriggered.set(true);
  }

  onSessionAInput(val: string): void {
    this.sessionDataA.set(val);
    this.sessionFeedback.set('Modifié dans Onglet A uniquement !');
  }

  onSessionBInput(val: string): void {
    this.sessionDataB.set(val);
    this.sessionFeedback.set('Modifié dans Onglet B uniquement !');
  }

  simulateReloadTab(): void {
    this.sessionFeedback.set('Rechargement F5 simulé : Les données de chaque onglet sont intactes ! ✅');
  }

  simulateCloseTab(): void {
    if (this.activeVirtualTab() === 'A') {
      this.sessionDataA.set('');
      this.sessionFeedback.set('Onglet A fermé : Casier de session A détruit ! ❌');
    } else {
      this.sessionDataB.set('');
      this.sessionFeedback.set('Onglet B fermé : Casier de session B détruit ! ❌');
    }
  }

  saveLocalDemo(): void {
    this.savedLocalVal.set(this.localVal());
  }

  clearLocalDemo(): void {
    this.savedLocalVal.set(null);
  }
}
