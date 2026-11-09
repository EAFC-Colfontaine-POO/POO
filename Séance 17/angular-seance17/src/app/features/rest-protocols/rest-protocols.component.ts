import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface HttpVerbInfo {
  verb: string;
  role: string;
  idempotent: boolean;
  safe: boolean;
  hasBody: string;
  color: string;
  description: string;
}

interface SimulatedDbItem {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-rest-protocols',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">Module 02 · Protocoles Réseau &amp; Sémantique REST</div>
        <h2>Protocoles REST, Verbes d'Action &amp; Statuts HTTP</h2>
        <p class="module-desc">
          En architecture REST, l'URI désigne la ressource et le verbe HTTP désigne l'action.
          Explorez la sémantique formelle d'idempotence et d'innocuité (Safe), observez leur impact en direct
          sur une base de données simulée, et testez les différentes familles de codes de réponse.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'verbs'" (click)="activeSubTab.set('verbs')">
              🔄 Matrice des Verbes HTTP &amp; Base Simulée
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'status'" (click)="activeSubTab.set('status')">
              🚦 Explorateur de Statuts (2xx, 3xx, 4xx, 5xx)
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 1 ➔
          </button>
        </div>
      </div>

      <!-- SOUS-ONGLET 1 : MATRICE DES VERBES -->
      @if (activeSubTab() === 'verbs') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Matrice Sémantique des 5 Verbes Majeurs</h3>
              <p class="zone-subtitle">Cliquez sur un verbe pour tester ses caractéristiques et observer son impact sur la base de données.</p>
            </div>
          </div>

          <!-- Tableau Comparatif -->
          <div class="table-container">
            <table class="verbs-table">
              <thead>
                <tr>
                  <th>Verbe</th>
                  <th>Rôle Sémantique</th>
                  <th>Idempotent ?</th>
                  <th>Sûr (Safe) ?</th>
                  <th>Corps (Body) ?</th>
                  <th>Action Test</th>
                </tr>
              </thead>
              <tbody>
                @for (item of verbs; track item.verb) {
                  <tr [class.selected-row]="selectedVerb().verb === item.verb" (click)="selectedVerb.set(item)">
                    <td>
                      <span class="verb-badge" [style.background]="item.color">{{ item.verb }}</span>
                    </td>
                    <td>{{ item.role }}</td>
                    <td>
                      <span class="tag" [class.tag-ok]="item.idempotent" [class.tag-no]="!item.idempotent">
                        {{ item.idempotent ? 'OUI (Répétable sans risque)' : 'NON (Effet cumulatif)' }}
                      </span>
                    </td>
                    <td>
                      <span class="tag" [class.tag-ok]="item.safe" [class.tag-no]="!item.safe">
                        {{ item.safe ? 'OUI (Lecture seule)' : 'NON (Altère le serveur)' }}
                      </span>
                    </td>
                    <td><code>{{ item.hasBody }}</code></td>
                    <td>
                      <button class="btn-secondary btn-sm" (click)="simulateVerb(item.verb); $event.stopPropagation()">
                        Simuler {{ item.verb }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Banc d'essai Idempotence en direct -->
          <div class="db-simulator-zone mt-4">
            <div class="db-sim-header">
              <div>
                <h4 class="font-bold text-sm">🧪 Laboratoire d'Idempotence en Direct sur Base Fictive</h4>
                <p class="text-xs text-muted">Testez la différence fondamentale : 5 clics consécutifs sur POST vs 5 clics consécutifs sur DELETE / PUT.</p>
              </div>

              <div class="sim-actions">
                <button class="btn-primary btn-sm" (click)="simulateVerb('POST')">➕ POST (Créer)</button>
                <button class="btn-secondary btn-sm" (click)="simulateVerb('PUT')">✏️ PUT (Remplacer #1)</button>
                <button class="btn-secondary btn-sm" (click)="simulateVerb('PATCH')">🔧 PATCH (Prix #1)</button>
                <button class="btn-danger btn-sm" (click)="simulateVerb('DELETE')">🗑️ DELETE (#2)</button>
                <button class="btn-ghost btn-sm" (click)="resetDb()">🔄 Réinitialiser Base</button>
              </div>
            </div>

            <div class="db-content-grid mt-3">
              <!-- Journal des requêtes -->
              <div class="log-col">
                <div class="col-title">Journal des Requêtes HTTP Émises :</div>
                <div class="request-logs">
                  @if (requestLogs().length === 0) {
                    <div class="empty-log">Cliquez sur un verbe ci-dessus pour émettre une requête...</div>
                  } @else {
                    @for (log of requestLogs(); track $index) {
                      <div class="log-line">
                        <span class="log-time">{{ log.time }}</span>
                        <span class="verb-mini" [style.background]="getVerbColor(log.verb)">{{ log.verb }}</span>
                        <span class="log-desc">{{ log.text }}</span>
                      </div>
                    }
                  }
                </div>
              </div>

              <!-- État actuel de la table Articles -->
              <div class="table-col">
                <div class="col-title">État de la Base de Données (Table <code>articles</code>) :</div>
                <div class="db-table-wrapper">
                  <table class="db-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom Produit</th>
                        <th>Prix Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of dbItems(); track row.id) {
                        <tr>
                          <td><strong>#{{ row.id }}</strong></td>
                          <td>{{ row.name }}</td>
                          <td>{{ row.price }} €</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SOUS-ONGLET 2 : CODES DE STATUT -->
      @if (activeSubTab() === 'status') {
        <div class="card-panel">
          <div class="zone-header">
            <div>
              <h3 class="zone-title">Explorateur &amp; Décodeur de Codes de Statut HTTP</h3>
              <p class="zone-subtitle">Moyen mnémotechnique : 2xx Tout va bien · 3xx Va voir ailleurs · 4xx Erreur Client · 5xx Crash Serveur.</p>
            </div>
          </div>

          <!-- Les 4 grandes familles -->
          <div class="status-families-grid">
            <div class="family-card c-2xx">
              <div class="family-badge">2xx</div>
              <div class="family-title">Succès (Success)</div>
              <p class="family-desc">Le serveur a reçu, compris et traité la demande avec succès.</p>
              <div class="status-chips">
                <span class="chip" (click)="testStatusCode(200)">200 OK</span>
                <span class="chip" (click)="testStatusCode(201)">201 Created</span>
                <span class="chip" (click)="testStatusCode(204)">204 No Content</span>
              </div>
            </div>

            <div class="family-card c-3xx">
              <div class="family-badge">3xx</div>
              <div class="family-title">Redirection</div>
              <p class="family-desc">La ressource a été déplacée ou peut être récupérée du cache local.</p>
              <div class="status-chips">
                <span class="chip" (click)="testStatusCode(301)">301 Moved</span>
                <span class="chip" (click)="testStatusCode(304)">304 Not Modified</span>
              </div>
            </div>

            <div class="family-card c-4xx">
              <div class="family-badge">4xx</div>
              <div class="family-title">Erreur Client (« C'est notre faute »)</div>
              <p class="family-desc">Mauvaise URL, corps JSON invalide, token expiré ou absent.</p>
              <div class="status-chips">
                <span class="chip" (click)="testStatusCode(400)">400 Bad Request</span>
                <span class="chip" (click)="testStatusCode(401)">401 Unauthorized</span>
                <span class="chip" (click)="testStatusCode(404)">404 Not Found</span>
                <span class="chip" (click)="testStatusCode(422)">422 Unprocessable</span>
              </div>
            </div>

            <div class="family-card c-5xx">
              <div class="family-badge">5xx</div>
              <div class="family-title">Erreur Serveur (« C'est leur faute »)</div>
              <p class="family-desc">Le backend a planté, base de données hors-service ou timeout.</p>
              <div class="status-chips">
                <span class="chip" (click)="testStatusCode(500)">500 Internal Error</span>
                <span class="chip" (click)="testStatusCode(502)">502 Bad Gateway</span>
                <span class="chip" (click)="testStatusCode(503)">503 Unavailable</span>
              </div>
            </div>
          </div>

          <!-- Simulateur d'appel avec diagnostic -->
          <div class="status-test-bench mt-4">
            <h4 class="font-bold text-sm mb-2">Simulateur d'Appel HTTP avec Diagnostic Détaillé :</h4>
            <div class="test-bench-body">
              <div class="code-badge-large" [class.bg-success]="testedCode() >= 200 && testedCode() < 300" [class.bg-warning]="testedCode() >= 400 && testedCode() < 500" [class.bg-danger]="testedCode() >= 500">
                HTTP {{ testedCode() }}
              </div>
              <div class="bench-desc">
                <div class="font-bold text-sm">{{ testedInfo().title }}</div>
                <p class="text-xs text-muted mt-1">{{ testedInfo().description }}</p>
                <div class="remedy-box mt-2">
                  <strong>Que doit faire le client Angular ? :</strong> {{ testedInfo().actionAngular }}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      margin-top: 14px;
    }

    .verbs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;

      th, td {
        padding: 10px 14px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }

      th {
        background: var(--bg-subtle);
        color: var(--text-dim);
        font-weight: 700;
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      tr:hover {
        background: var(--bg-card-hover);
      }

      &.selected-row {
        background: rgba(49, 120, 198, 0.1);
      }
    }

    .verb-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      color: #ffffff;
      font-weight: 800;
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    .tag {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;

      &.tag-ok {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }

      &.tag-no {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
      }
    }

    .db-simulator-zone {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }

    .db-sim-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .sim-actions {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .db-content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .col-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-dim);
      margin-bottom: 8px;
    }

    .request-logs {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      height: 180px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    .empty-log {
      color: var(--text-dim);
      font-style: italic;
      margin: auto;
    }

    .log-line {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .log-time {
      color: var(--text-dim);
      font-size: 0.7rem;
    }

    .verb-mini {
      color: #fff;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 0.68rem;
      font-weight: 700;
    }

    .db-table-wrapper {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      height: 180px;
      overflow-y: auto;
    }

    .db-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;

      th, td {
        padding: 6px 10px;
        border-bottom: 1px solid var(--border-color);
      }

      th {
        background: var(--bg-subtle);
        font-size: 0.7rem;
      }
    }

    .status-families-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 14px;
    }

    .family-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .family-badge {
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: 1.1rem;
      }

      .family-title {
        font-weight: 700;
        font-size: 0.85rem;
      }

      .family-desc {
        font-size: 0.75rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .status-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;

        .chip {
          padding: 3px 8px;
          border-radius: 4px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          cursor: pointer;

          &:hover {
            border-color: #3b82f6;
            color: #60a5fa;
          }
        }
      }

      &.c-2xx .family-badge { color: #10b981; }
      &.c-3xx .family-badge { color: #3b82f6; }
      &.c-4xx .family-badge { color: #f59e0b; }
      &.c-5xx .family-badge { color: #ef4444; }
    }

    .status-test-bench {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }

    .test-bench-body {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .code-badge-large {
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 1.2rem;
      font-weight: 800;
      font-family: var(--font-mono);
      color: #fff;
    }

    .bg-success { background: #059669; }
    .bg-warning { background: #d97706; }
    .bg-danger { background: #dc2626; }

    .remedy-box {
      font-size: 0.78rem;
      background: var(--bg-card);
      padding: 6px 10px;
      border-radius: 4px;
      border-left: 3px solid #3b82f6;
    }

    .btn-danger {
      background: #dc2626;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 10px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class RestProtocolsComponent {
  readonly nav = inject(NavigationService);
  readonly exerciseService = inject(ExerciseService);

  readonly activeSubTab = signal<'verbs' | 'status'>('verbs');

  readonly verbs: HttpVerbInfo[] = [
    {
      verb: 'GET',
      role: 'Récupération d\'une ressource ou liste',
      idempotent: true,
      safe: true,
      hasBody: 'Non recommandé',
      color: '#059669',
      description: 'Strictement en lecture seule. Doit pouvoir être rappelé sans effet de bord.'
    },
    {
      verb: 'POST',
      role: 'Création d\'une nouvelle sous-ressource',
      idempotent: false,
      safe: false,
      hasBody: 'Oui (Données de l\'entité)',
      color: '#2563eb',
      description: 'Non-idempotent : 5 clics consécutifs créent 5 nouveaux enregistrements distincts.'
    },
    {
      verb: 'PUT',
      role: 'Remplacement complet d\'une ressource',
      idempotent: true,
      safe: false,
      hasBody: 'Oui (Entité complète)',
      color: '#d97706',
      description: 'Idempotent : écraser 5 fois un enregistrement avec le même payload donne le même état.'
    },
    {
      verb: 'PATCH',
      role: 'Modification partielle de certains champs',
      idempotent: false,
      safe: false,
      hasBody: 'Oui (Diff de champs)',
      color: '#7c3aed',
      description: 'Applique une mutation partielle (ex: incrémenter un stock ou changer un prix).'
    },
    {
      verb: 'DELETE',
      role: 'Suppression définitive de la ressource',
      idempotent: true,
      safe: false,
      hasBody: 'Rare / Déconseillé',
      color: '#dc2626',
      description: 'Idempotent : supprimer 1 fois ou 5 fois supprime l\'élément, son état final est absent.'
    }
  ];

  readonly selectedVerb = signal<HttpVerbInfo>(this.verbs[0]);

  // DB Simulée
  readonly dbItems = signal<SimulatedDbItem[]>([
    { id: 1, name: "Clavier Mécanique RGB", price: 89.99 },
    { id: 2, name: "Souris Sans Fil 2.4G", price: 49.99 }
  ]);

  readonly requestLogs = signal<Array<{ time: string; verb: string; text: string }>>([]);
  private nextId = 3;

  simulateVerb(verb: string): void {
    const time = new Date().toLocaleTimeString();

    switch (verb) {
      case 'GET':
        this.requestLogs.update(logs => [
          { time, verb: 'GET', text: `Lecture de /api/articles -> ${this.dbItems().length} articles retournés (Aucune altération DB)` },
          ...logs
        ]);
        break;

      case 'POST': {
        const newItem: SimulatedDbItem = {
          id: this.nextId++,
          name: `Nouveau Produit #${this.nextId - 1}`,
          price: 29.99
        };
        this.dbItems.update(items => [...items, newItem]);
        this.requestLogs.update(logs => [
          { time, verb: 'POST', text: `Création de /api/articles -> Article #${newItem.id} créé (+1 en DB)` },
          ...logs
        ]);
        break;
      }

      case 'PUT':
        this.dbItems.update(items =>
          items.map(it => it.id === 1 ? { ...it, name: "Clavier Pro Remplacé (PUT)", price: 99.00 } : it)
        );
        this.requestLogs.update(logs => [
          { time, verb: 'PUT', text: `Remplacement total /api/articles/1 -> Écrasé avec nouvel état (Idempotent)` },
          ...logs
        ]);
        break;

      case 'PATCH':
        this.dbItems.update(items =>
          items.map(it => it.id === 1 ? { ...it, price: Math.round((it.price + 5) * 100) / 100 } : it)
        );
        this.requestLogs.update(logs => [
          { time, verb: 'PATCH', text: `Modification partielle /api/articles/1 -> Prix augmenté de 5€ (Non-idempotent)` },
          ...logs
        ]);
        break;

      case 'DELETE':
        this.dbItems.update(items => items.filter(it => it.id !== 2));
        this.requestLogs.update(logs => [
          { time, verb: 'DELETE', text: `Suppression de /api/articles/2 -> Article supprimé (Répéter = 404 sans effet plus grave)` },
          ...logs
        ]);
        break;
    }
  }

  resetDb(): void {
    this.dbItems.set([
      { id: 1, name: "Clavier Mécanique RGB", price: 89.99 },
      { id: 2, name: "Souris Sans Fil 2.4G", price: 49.99 }
    ]);
    this.requestLogs.set([]);
  }

  getVerbColor(verb: string): string {
    return this.verbs.find(v => v.verb === verb)?.color || '#64748b';
  }

  // Statuts
  readonly testedCode = signal<number>(200);

  testStatusCode(code: number): void {
    this.testedCode.set(code);
  }

  readonly testedInfo = () => {
    const code = this.testedCode();
    switch (code) {
      case 200:
        return {
          title: "200 OK — Requête traitée avec succès",
          description: "La ressource a été trouvée et est renvoyée dans le corps de la réponse JSON.",
          actionAngular: "La ressource passe en status Resolved (4) et injecte la charge utile dans .value()."
        };
      case 201:
        return {
          title: "201 Created — Sous-ressource créée",
          description: "Typique d'une réponse après un POST concluant. Contient souvent l'en-tête Location.",
          actionAngular: "Notifier l'utilisateur avec un Toast de succès et rafraîchir la liste parente via .reload()."
        };
      case 204:
        return {
          title: "204 No Content — Succès sans contenu",
          description: "L'action s'est déroulée avec succès (ex: DELETE), mais aucun body n'est renvoyé.",
          actionAngular: "Traiter la réussite sans tenter d'effectuer un JSON.parse() qui échouerait sur un flux vide."
        };
      case 301:
        return {
          title: "301 Moved Permanently — Redirection définitive",
          description: "L'adresse de l'API a changé d'URI de manière permanente.",
          actionAngular: "Le navigateur suit automatiquement la redirection ; mettre à jour la constante d'URL dans le code."
        };
      case 304:
        return {
          title: "304 Not Modified — Cache navigateur valide",
          description: "La ressource n'a pas changé depuis le dernier ETag / If-Modified-Since.",
          actionAngular: "Le navigateur réutilise les données locales en cache sans surcoût de transfert réseau."
        };
      case 400:
        return {
          title: "400 Bad Request — Syntaxe corrompue",
          description: "Le serveur a rejeté le format des paramètres ou le corps JSON malformé.",
          actionAngular: "Vérifier la sérialisation DTO et s'assurer que les chaînes sont protégées par encodeURIComponent()."
        };
      case 401:
        return {
          title: "401 Unauthorized — Authentification requise",
          description: "Le jeton JWT / Bearer est manquant, corrompu ou arrivé à expiration.",
          actionAngular: "Intercepter l'erreur dans un HttpInterceptor et rediriger l'utilisateur vers la page de login."
        };
      case 404:
        return {
          title: "404 Not Found — Ressource inexistante",
          description: "L'URI demandée ne correspond à aucune route ou entité sur le serveur distant.",
          actionAngular: "resource.error() est valorisé ; afficher un message amical 'Élément introuvable'."
        };
      case 422:
        return {
          title: "422 Unprocessable Entity — Rejet métier",
          description: "Le format est valide mais une règle métier est violée (ex: solde insuffisant, email déjà pris).",
          actionAngular: "Afficher les messages de validation spécifiques sous chaque champ de formulaire."
        };
      case 500:
        return {
          title: "500 Internal Server Error — Crash backend",
          description: "Le code du serveur a levé une exception non interceptée (NullPointerException, etc.).",
          actionAngular: "Ne pas paniquer l'utilisateur : afficher 'Service temporairement indisponible' et proposer un bouton Réessayer."
        };
      case 502:
        return {
          title: "502 Bad Gateway — Passerelle mandataire défaillante",
          description: "Le reverse proxy (Nginx, Cloudflare) n'a pas pu communiquer avec le serveur d'application.",
          actionAngular: "Vérifier l'état de l'infrastructure ou patienter pendant le redémarrage du conteneur."
        };
      case 503:
        return {
          title: "503 Service Unavailable — Surcharge ou maintenance",
          description: "Le serveur est temporairement en saturation ou en cours de déploiement.",
          actionAngular: "Implémenter une stratégie de réessai exponentiel (Exponential Backoff)."
        };
      default:
        return {
          title: `Code HTTP ${code}`,
          description: "Code HTTP générique.",
          actionAngular: "Inspecter les DevTools et vérifier la documentation de l'API."
        };
    }
  };

  jumpToLab(): void {
    this.exerciseService.setFilterLab(1);
    this.nav.setTab('workshops-lab');
  }
}
