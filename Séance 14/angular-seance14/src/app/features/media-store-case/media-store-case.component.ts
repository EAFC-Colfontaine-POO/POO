import { Component, signal, computed } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';
import { Produit, Client, Film } from '../../core/models/entites.model';

type ArchitectureNodeId = 
  | 'Identifiable'
  | 'Produit'
  | 'Client'
  | 'Film'
  | 'Repository'
  | 'ProduitService'
  | 'ClientService'
  | 'FilmService'
  | 'MediaStoreComponent';

@Component({
  selector: 'app-media-store-case',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 07 · Étude de Cas Complète</div>
        <h2>L'Atelier d'Architecture MediaStore : De la Conception à l'IHM</h2>
        <p class="module-desc">
          Une application d'entreprise complète réunissant l'ensemble des concepts du cours :
          contrat d'interface, entités du domaine, Repository générique, services spécialisés par héritage
          et composant Angular moderne consommant plusieurs services via <code>inject()</code>.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Diagramme d'Architecture &amp; Démo MediaStore</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 6 · 4 Ex)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Diagramme d'Architecture Interactif -->
        <section class="card-panel">
          <div class="panel-header">
            <h3>🗺️ Cartographie des Composants du Système</h3>
            <span class="badge badge-purple">Cliquer sur un bloc pour inspecter son code</span>
          </div>

          <div class="architecture-diagram my-3">
            <!-- Couche 1 : Contrat d'Interface -->
            <div class="arch-layer">
              <div class="layer-title">1. Contrat Structurel (Types pur)</div>
              <div class="nodes-row">
                <button 
                  class="arch-node node-yellow" 
                  [class.selected]="selectedNode() === 'Identifiable'" 
                  (click)="selectedNode.set('Identifiable')"
                >
                  <span class="node-kind">«interface»</span>
                  <strong>Identifiable</strong>
                  <code>id: number | string</code>
                </button>
              </div>
            </div>

            <!-- Couche 2 : Entités Métier -->
            <div class="arch-layer">
              <div class="layer-title">2. Entités Métier (Invariants encapsulés)</div>
              <div class="nodes-row">
                <button 
                  class="arch-node node-blue" 
                  [class.selected]="selectedNode() === 'Produit'" 
                  (click)="selectedNode.set('Produit')"
                >
                  <span class="node-kind">class</span>
                  <strong>Produit</strong>
                  <code>(id: number)</code>
                </button>

                <button 
                  class="arch-node node-blue" 
                  [class.selected]="selectedNode() === 'Client'" 
                  (click)="selectedNode.set('Client')"
                >
                  <span class="node-kind">class</span>
                  <strong>Client</strong>
                  <code>(id: string)</code>
                </button>

                <button 
                  class="arch-node node-blue" 
                  [class.selected]="selectedNode() === 'Film'" 
                  (click)="selectedNode.set('Film')"
                >
                  <span class="node-kind">class</span>
                  <strong>Film</strong>
                  <code>(id: number)</code>
                </button>
              </div>
            </div>

            <!-- Couche 3 : Socle Générique -->
            <div class="arch-layer">
              <div class="layer-title">3. Persistance Générique Universelle</div>
              <div class="nodes-row">
                <button 
                  class="arch-node node-purple wide" 
                  [class.selected]="selectedNode() === 'Repository'" 
                  (click)="selectedNode.set('Repository')"
                >
                  <span class="node-kind">class générique</span>
                  <strong>Repository&lt;T extends Identifiable&gt;</strong>
                  <code>#items = signal&lt;T[]&gt;([]) · ajouter · supprimer · trouverParId</code>
                </button>
              </div>
            </div>

            <!-- Couche 4 : Services Métier Spécialisés -->
            <div class="arch-layer">
              <div class="layer-title">4. Services Spécialisés Injectables (DI)</div>
              <div class="nodes-row">
                <button 
                  class="arch-node node-green" 
                  [class.selected]="selectedNode() === 'ProduitService'" 
                  (click)="selectedNode.set('ProduitService')"
                >
                  <span class="node-kind">&#64;Injectable</span>
                  <strong>ProduitService</strong>
                  <code>valeurStock = computed(...)</code>
                </button>

                <button 
                  class="arch-node node-green" 
                  [class.selected]="selectedNode() === 'ClientService'" 
                  (click)="selectedNode.set('ClientService')"
                >
                  <span class="node-kind">&#64;Injectable</span>
                  <strong>ClientService</strong>
                  <code>(Hérite de tout le CRUD sans code !)</code>
                </button>

                <button 
                  class="arch-node node-green" 
                  [class.selected]="selectedNode() === 'FilmService'" 
                  (click)="selectedNode.set('FilmService')"
                >
                  <span class="node-kind">&#64;Injectable</span>
                  <strong>FilmService</strong>
                  <code>dureeTotale = computed(...)</code>
                </button>
              </div>
            </div>

            <!-- Couche 5 : Composant IHM -->
            <div class="arch-layer">
              <div class="layer-title">5. Composant IHM (Présentation &amp; Clics)</div>
              <div class="nodes-row">
                <button 
                  class="arch-node node-orange wide" 
                  [class.selected]="selectedNode() === 'MediaStoreComponent'" 
                  (click)="selectedNode.set('MediaStoreComponent')"
                >
                  <span class="node-kind">&#64;Component</span>
                  <strong>MediaStoreComponent</strong>
                  <code>inject(ProduitService) × inject(ClientService) × inject(FilmService)</code>
                </button>
              </div>
            </div>
          </div>

          <!-- Panneau d'inspection du nœud sélectionné -->
          <div class="node-inspector-card mt-3">
            <div class="inspector-header">
              <div>
                <span class="inspector-title">Élément sélectionné : <strong>{{ selectedNode() }}</strong></span>
                <span class="badge badge-ts ml-2">{{ getNodeRole(selectedNode()) }}</span>
              </div>
              <span class="node-resp">{{ getNodeResponsibility(selectedNode()) }}</span>
            </div>

            <div class="code-box mt-2">
              <pre><code>{{ getNodeSourceCode(selectedNode()) }}</code></pre>
            </div>
          </div>
        </section>

        <!-- 2. Démonstrateur Live MediaStore en Temps Réel -->
        <section class="card-panel mt-4">
          <div class="panel-header">
            <h3>🎬 Démonstrateur Live de l'Application MediaStore</h3>
            <span class="badge badge-success">3 Services Injectés Simultanément</span>
          </div>

          <div class="mediastore-demo-layout mt-3">
            <!-- Colonne 1 : Gestion des Produits -->
            <div class="demo-card">
              <div class="demo-card-header">
                <div class="header-left">
                  <span class="demo-icon">📦</span>
                  <h4>Produits ({{ produits().length }})</h4>
                </div>
                <div class="stock-total-badge">
                  Stock : <strong>{{ valeurStockTotal().toFixed(2) }} €</strong>
                </div>
              </div>

              <div class="demo-list">
                @for (p of produits(); track p.id) {
                  <div class="demo-item">
                    <div class="p-details">
                      <strong>{{ p.nom }}</strong>
                      <span class="p-meta">{{ p.prix }} € · Stock: {{ p.stock }}</span>
                    </div>
                    <button class="btn-delete-small" (click)="supprimerProduit(p.id)" title="Supprimer produit">✕</button>
                  </div>
                }
              </div>

              <div class="demo-add-row mt-2">
                <input class="input-control flex-1" [value]="newProduitNom()" (input)="onNewProdNom($event)" placeholder="Nom du produit..." />
                <button class="btn-primary" (click)="ajouterProduit()">+ Ajouter</button>
              </div>
            </div>

            <!-- Colonne 2 : Gestion des Clients -->
            <div class="demo-card">
              <div class="demo-card-header">
                <div class="header-left">
                  <span class="demo-icon">👤</span>
                  <h4>Clients ({{ clients().length }})</h4>
                </div>
                <span class="badge badge-purple">ID Texte</span>
              </div>

              <div class="demo-list">
                @for (c of clients(); track c.id) {
                  <div class="demo-item">
                    <div class="p-details">
                      <strong>{{ c.nom }}</strong>
                      <span class="p-meta">ID: <code>{{ c.id }}</code></span>
                    </div>
                    <button class="btn-delete-small" (click)="supprimerClient(c.id)" title="Supprimer client">✕</button>
                  </div>
                }
              </div>

              <div class="demo-add-row mt-2">
                <input class="input-control flex-1" [value]="newClientNom()" (input)="onNewClientNom($event)" placeholder="Nom du client..." />
                <button class="btn-primary" (click)="ajouterClient()">+ Ajouter</button>
              </div>
            </div>

            <!-- Colonne 3 : Gestion des Films -->
            <div class="demo-card">
              <div class="demo-card-header">
                <div class="header-left">
                  <span class="demo-icon">🎥</span>
                  <h4>Films ({{ films().length }})</h4>
                </div>
                <div class="stock-total-badge">
                  Durée : <strong>{{ dureeTotaleFilms() }} min</strong>
                </div>
              </div>

              <div class="demo-list">
                @for (f of films(); track f.id) {
                  <div class="demo-item">
                    <div class="p-details">
                      <strong>{{ f.titre }}</strong>
                      <span class="p-meta">{{ f.dureeMinutes }} min</span>
                    </div>
                    <button class="btn-delete-small" (click)="supprimerFilm(f.id)" title="Supprimer film">✕</button>
                  </div>
                }
              </div>

              <div class="demo-add-row mt-2">
                <input class="input-control flex-1" [value]="newFilmTitre()" (input)="onNewFilmTitre($event)" placeholder="Titre du film..." />
                <button class="btn-primary" (click)="ajouterFilm()">+ Ajouter</button>
              </div>
            </div>
          </div>
        </section>
      } @else {
        <app-lab-runner [defaultLabNumber]="6"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
      }
    }

    .architecture-diagram {
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
    }

    .arch-layer {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .layer-title {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text-dim);
      }
    }

    .nodes-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .arch-node {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 8px 14px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.18s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }

      &.selected {
        outline: 2px solid var(--ts-blue);
        border-color: var(--ts-blue);
      }

      &.wide {
        flex: 1;
      }

      .node-kind {
        font-size: 0.68rem;
        font-family: var(--font-mono);
        color: var(--text-dim);
      }

      code {
        font-size: 0.72rem;
        color: var(--text-muted);
      }

      &.node-yellow {
        border-left: 4px solid #eab308;
      }
      &.node-blue {
        border-left: 4px solid #0284c7;
      }
      &.node-purple {
        border-left: 4px solid #9333ea;
      }
      &.node-green {
        border-left: 4px solid #16a34a;
      }
      &.node-orange {
        border-left: 4px solid #ea580c;
      }
    }

    .node-inspector-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;

      .inspector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        .inspector-title {
          font-size: 0.92rem;
        }

        .node-resp {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-style: italic;
        }
      }
    }

    .mediastore-demo-layout {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 960px) {
      .mediastore-demo-layout {
        grid-template-columns: 1fr;
      }
    }

    .demo-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;

      .demo-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .header-left {
          display: flex;
          align-items: center;
          gap: 6px;

          h4 {
            font-size: 0.9rem;
            font-weight: 700;
          }
        }
      }

      .stock-total-badge {
        font-size: 0.76rem;
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #34d399;
        padding: 2px 8px;
        border-radius: 4px;
      }

      .demo-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-height: 140px;
        max-height: 220px;
        overflow-y: auto;
      }

      .demo-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.8rem;

        .p-details {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .p-meta {
            font-size: 0.72rem;
            color: var(--text-dim);
          }
        }

        .btn-delete-small {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          font-size: 0.85rem;
          padding: 2px 6px;

          &:hover {
            color: #f87171;
          }
        }
      }

      .demo-add-row {
        display: flex;
        gap: 6px;
      }
    }

    .flex-1 {
      flex: 1;
    }
  `]
})
export class MediaStoreCaseComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly selectedNode = signal<ArchitectureNodeId>('Repository');

  // Données du live MediaStore
  readonly produits = signal<Produit[]>([
    new Produit(101, 'Clavier mécanique sans fil', 129.99, 14),
    new Produit(102, 'Casque Hi-Res Bluetooth', 89.50, 8),
    new Produit(103, 'Tapis de souris XXL', 19.99, 32)
  ]);

  readonly clients = signal<Client[]>([
    new Client('CLI-100', 'Cabinet d’avocats Lex'),
    new Client('CLI-200', 'Studio Graphique Pixel')
  ]);

  readonly films = signal<Film[]>([
    new Film(1, 'Interstellar', 169),
    new Film(2, 'Le Fabuleux Destin d’Amélie Poulain', 122)
  ]);

  readonly valeurStockTotal = computed(() => {
    return this.produits().reduce((total, p) => total + p.prix * p.stock, 0);
  });

  readonly dureeTotaleFilms = computed(() => {
    return this.films().reduce((tot, f) => tot + f.dureeMinutes, 0);
  });

  // Nouveaux ajouts
  readonly newProduitNom = signal<string>('Souris Ergonomique');
  readonly newClientNom = signal<string>('Centre Médical Alpha');
  readonly newFilmTitre = signal<string>('Blade Runner 2049');

  onNewProdNom(e: Event): void {
    this.newProduitNom.set((e.target as HTMLInputElement).value);
  }

  onNewClientNom(e: Event): void {
    this.newClientNom.set((e.target as HTMLInputElement).value);
  }

  onNewFilmTitre(e: Event): void {
    this.newFilmTitre.set((e.target as HTMLInputElement).value);
  }

  ajouterProduit(): void {
    const nom = this.newProduitNom().trim();
    if (!nom) return;
    const newId = this.produits().length > 0 ? Math.max(...this.produits().map(p => p.id)) + 1 : 101;
    this.produits.update(list => [...list, new Produit(newId, nom, 45.00, 10)]);
    this.newProduitNom.set('');
  }

  supprimerProduit(id: number): void {
    this.produits.update(list => list.filter(p => p.id !== id));
  }

  ajouterClient(): void {
    const nom = this.newClientNom().trim();
    if (!nom) return;
    const newId = `CLI-${Math.floor(100 + Math.random() * 900)}`;
    this.clients.update(list => [...list, new Client(newId, nom)]);
    this.newClientNom.set('');
  }

  supprimerClient(id: string): void {
    this.clients.update(list => list.filter(c => c.id !== id));
  }

  ajouterFilm(): void {
    const titre = this.newFilmTitre().trim();
    if (!titre) return;
    const newId = this.films().length > 0 ? Math.max(...this.films().map(f => f.id)) + 1 : 1;
    this.films.update(list => [...list, new Film(newId, titre, 135)]);
    this.newFilmTitre.set('');
  }

  supprimerFilm(id: number): void {
    this.films.update(list => list.filter(f => f.id !== id));
  }

  getNodeRole(node: ArchitectureNodeId): string {
    switch (node) {
      case 'Identifiable': return 'Contrat structurel (Zéro JS)';
      case 'Produit': return 'Entité Métier (id number)';
      case 'Client': return 'Entité Métier (id string)';
      case 'Film': return 'Entité Métier (Atelier pratique)';
      case 'Repository': return 'Socle Universel CRUD & Signals';
      case 'ProduitService': return 'Spécialisation Produit';
      case 'ClientService': return 'Spécialisation Client';
      case 'FilmService': return 'Spécialisation Film';
      case 'MediaStoreComponent': return 'Consommateur IHM (@for track)';
    }
  }

  getNodeResponsibility(node: ArchitectureNodeId): string {
    switch (node) {
      case 'Identifiable': return 'Impose la présence de la clé unique (id).';
      case 'Produit': return 'Valide les invariants (prix >= 0, stock >= 0).';
      case 'Client': return 'Structure les données clientes avec clé textuelle.';
      case 'Film': return 'Protège la durée de projection (0 < duree <= 240).';
      case 'Repository': return 'Écrit une seule fois pour toutes les entités.';
      case 'ProduitService': return 'Ajoute le signal calculé valeurStock.';
      case 'ClientService': return 'Hérite sans une seule ligne de code dupliquée.';
      case 'FilmService': return 'Ajoute le calcul de dureeTotale.';
      case 'MediaStoreComponent': return 'Injecte les services et délègue la logique.';
    }
  }

  getNodeSourceCode(node: ArchitectureNodeId): string {
    switch (node) {
      case 'Identifiable':
        return `export interface Identifiable {\n  readonly id: number | string;\n}`;
      case 'Produit':
        return `export class Produit implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly nom: string,\n    public readonly prix: number,\n    public stock: number\n  ) {\n    if (prix < 0) throw new Error("Prix négatif interdit !");\n  }\n}`;
      case 'Client':
        return `export class Client implements Identifiable {\n  constructor(\n    public readonly id: string,\n    public readonly nom: string\n  ) {}\n}`;
      case 'Film':
        return `export class Film implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly titre: string,\n    public readonly dureeMinutes: number\n  ) {\n    if (dureeMinutes <= 0) throw new Error("Durée invalide");\n    if (dureeMinutes > 240) throw new Error("Film trop long (> 4h)");\n  }\n}`;
      case 'Repository':
        return `export class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  ajouter(element: T): void {\n    if (this.trouverParId(element.id)) throw new Error("Doublon !");\n    this.#items.update(liste => [...liste, element]);\n  }\n  supprimer(id: T['id']): void {\n    this.#items.update(liste => liste.filter(i => i.id !== id));\n  }\n  trouverParId(id: T['id']): T | undefined {\n    return this.#items().find(i => i.id === id);\n  }\n}`;
      case 'ProduitService':
        return `@Injectable({ providedIn: 'root' })\nexport class ProduitService extends Repository<Produit> {\n  readonly valeurStock = computed(() =>\n    this.items().reduce((total, p) => total + p.prix * p.stock, 0)\n  );\n}`;
      case 'ClientService':
        return `@Injectable({ providedIn: 'root' })\nexport class ClientService extends Repository<Client> {\n  // Rien à écrire : ajouter, supprimer, trouverParId\n  // sont hérités directement du Repository<T> !\n}`;
      case 'FilmService':
        return `@Injectable({ providedIn: 'root' })\nexport class FilmService extends Repository<Film> {\n  readonly dureeTotale = computed(() =>\n    this.items().reduce((tot, f) => tot + f.dureeMinutes, 0)\n  );\n}`;
      case 'MediaStoreComponent':
        return `@Component({\n  selector: 'app-media-store',\n  template: \`\n    <h3>Produits ({{ produitService.items().length }})</h3>\n    <p>Stock : {{ produitService.valeurStock() }} €</p>\n    @for (p of produitService.items(); track p.id) {\n      <li>{{ p.nom }} - {{ p.prix }} €</li>\n    }\n  \`\n})\nexport class MediaStoreComponent {\n  protected readonly produitService = inject(ProduitService);\n  protected readonly clientService = inject(ClientService);\n  protected readonly filmService = inject(FilmService);\n}`;
    }
  }
}
