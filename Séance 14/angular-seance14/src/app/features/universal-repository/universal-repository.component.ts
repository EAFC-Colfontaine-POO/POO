import { Component, signal, computed } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';
import { Identifiable } from '../../core/models/entites.model';

interface DemoItem extends Identifiable {
  id: number | string;
  nom: string;
  infoExtra?: string;
}

@Component({
  selector: 'app-universal-repository',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 06 · Cœur Réactif &amp; Universel</div>
        <h2>Le Cœur du Réacteur : Repository&lt;T extends Identifiable&gt;</h2>
        <p class="module-desc">
          Voici le socle d'ingénierie qui résout l'ensemble de nos défis :
          un état réactif privé par signal, une exposition en lecture seule, une contrainte structurelle
          <code>&lt;T extends Identifiable&gt;</code> et des mutations strictement immutables.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Bac à Sable Réactif du Repository</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 5 · 3 Ex)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Code du Repository Universel -->
        <section class="card-panel">
          <div class="panel-header">
            <h3>⚡ L'Implémentation Officielle du Repository Universel</h3>
            <span class="badge badge-success">Signal-First + &lt;T&gt;</span>
          </div>

          <div class="code-box my-3">
            <div class="code-header">
              <span>repository.ts (Écrit une seule fois pour toutes les entités de l'appli)</span>
              <span class="badge badge-ts">TypeScript 5+</span>
            </div>
            <pre><code>{{ repositoryCode }}</code></pre>
          </div>
        </section>

        <!-- 2. Bac à Sable Interactif en Direct -->
        <section class="card-panel mt-4">
          <div class="panel-header">
            <h3>🧪 Console Interactive du Repository en Mémoire</h3>
            <div class="entity-mode-toggles">
              <span class="ctrl-label">Type d'entité :</span>
              <div class="btn-group">
                <button class="btn-toggle" [class.active]="entityType() === 'Produit'" (click)="setEntityType('Produit')">
                  📦 Produit (id numérique)
                </button>
                <button class="btn-toggle active-purple" [class.active]="entityType() === 'Client'" (click)="setEntityType('Client')">
                  👤 Client (id texte)
                </button>
              </div>
            </div>
          </div>

          <div class="grid-2-cols mt-3">
            <!-- Formulaire d'action -->
            <div class="repo-action-form">
              <div class="form-title">Opérations CRUD en direct :</div>

              <div class="form-fields">
                <div class="field-row">
                  <label>Identifiant ({{ entityType() === 'Produit' ? 'number' : 'string' }}) :</label>
                  <input 
                    class="input-control" 
                    [value]="inputNewId()" 
                    (input)="onIdInput($event)" 
                    placeholder="Ex: {{ entityType() === 'Produit' ? '101' : 'CLI-042' }}" 
                  />
                </div>

                <div class="field-row">
                  <label>Nom du {{ entityType() }} :</label>
                  <input 
                    class="input-control" 
                    [value]="inputNewNom()" 
                    (input)="onNomInput($event)" 
                    placeholder="Ex: {{ entityType() === 'Produit' ? 'Casque Audio' : 'Société Horizon' }}" 
                  />
                </div>
              </div>

              <div class="action-buttons-row mt-3">
                <button class="btn-primary" (click)="ajouterElement()">
                  + Ajouter au Repository
                </button>
                <button class="btn-secondary" (click)="testerDoublon()">
                  ⚠️ Tester Doublon
                </button>
                <button class="btn-secondary" (click)="viderRepo()">
                  ↺ Réinitialiser
                </button>
              </div>

              <!-- Message d'alerte / feedback -->
              @if (lastError()) {
                <div class="error-msg-banner mt-3">
                  🚨 <strong>Exception levée :</strong> {{ lastError() }}
                </div>
              } @else if (lastSuccess()) {
                <div class="success-msg-banner mt-3">
                  ✓ {{ lastSuccess() }}
                </div>
              }

              <!-- Recherche par ID en direct -->
              <div class="search-box mt-3">
                <div class="search-label">🔍 Recherche avec Lookup Type <code>T['id']</code> :</div>
                <div class="search-row">
                  <input 
                    class="input-control flex-1" 
                    [value]="searchQuery()" 
                    (input)="onSearchInput($event)" 
                    placeholder="Entrer l'id exact..." 
                  />
                </div>
                @if (searchResult()) {
                  <div class="search-result-pill mt-2">
                    Trouvé : <strong>{{ searchResult()?.nom }}</strong> (id: <code>{{ searchResult()?.id }}</code>)
                  </div>
                }
              </div>
            </div>

            <!-- Liste Réactive des Données en Mémoire -->
            <div class="repo-data-view">
              <div class="data-header">
                <div>
                  <span class="data-title">État du signal #items()</span>
                  <span class="badge badge-success ml-2">compteur: {{ items().length }}</span>
                </div>
                <span class="addr-badge root">{{ currentMemAddress() }}</span>
              </div>

              <div class="items-list">
                @for (item of items(); track item.id) {
                  <div class="item-row animate-fade-in">
                    <div class="item-info">
                      <span class="item-id-pill">ID: {{ item.id }}</span>
                      <span class="item-name">{{ item.nom }}</span>
                      @if (item.infoExtra) {
                        <span class="item-extra">({{ item.infoExtra }})</span>
                      }
                    </div>
                    <button class="btn-delete" (click)="supprimerElement(item.id)" title="Supprimer par id">
                      🗑️
                    </button>
                  </div>
                } @empty {
                  <div class="empty-state">
                    Aucun élément dans le Repository. Utilisez le formulaire ci-contre pour en ajouter !
                  </div>
                }
              </div>
            </div>
          </div>
        </section>
      } @else {
        <app-lab-runner [defaultLabNumber]="5"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
      }
    }

    .entity-mode-toggles {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ctrl-label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .btn-group {
      display: flex;
      gap: 4px;
      background: var(--bg-subtle);
      padding: 3px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }

    .btn-toggle {
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);

      &.active {
        background: var(--ts-blue);
        color: #fff;
      }

      &.active-purple.active {
        background: #9333ea;
        color: #fff;
      }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 920px) {
      .grid-2-cols {
        grid-template-columns: 1fr;
      }
    }

    .repo-action-form {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;

      .form-title {
        font-size: 0.92rem;
        font-weight: 700;
        margin-bottom: 12px;
      }
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .field-row {
        display: flex;
        flex-direction: column;
        gap: 4px;

        label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
        }
      }
    }

    .action-buttons-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .error-msg-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
    }

    .success-msg-banner {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
    }

    .search-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;

      .search-label {
        font-size: 0.76rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-bottom: 6px;
      }

      .search-row {
        display: flex;
        gap: 8px;
      }

      .search-result-pill {
        font-size: 0.78rem;
        color: #34d399;
        background: rgba(16, 185, 129, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
      }
    }

    .repo-data-view {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;

      .data-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);

        .data-title {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--ts-blue-light);
        }
      }
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      overflow-y: auto;
      max-height: 380px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      transition: all 0.18s;

      &:hover {
        border-color: var(--ts-blue);
      }

      .item-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.84rem;

        .item-id-pill {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: rgba(49, 120, 198, 0.18);
          color: var(--ts-blue-light);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .item-name {
          font-weight: 600;
        }

        .item-extra {
          color: var(--text-dim);
          font-size: 0.76rem;
        }
      }

      .btn-delete {
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.18s;

        &:hover {
          opacity: 1;
        }
      }
    }

    .empty-state {
      padding: 30px 16px;
      text-align: center;
      color: var(--text-dim);
      font-size: 0.84rem;
      font-style: italic;
    }

    .flex-1 {
      flex: 1;
    }
  `]
})
export class UniversalRepositoryComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly entityType = signal<'Produit' | 'Client'>('Produit');

  readonly repositoryCode = `import { signal, computed } from '@angular/core';
import { Identifiable } from '../models/entites.model';

export class Repository<T extends Identifiable> {
  // 1. État réactif privé et encapsulé (#)
  readonly #items = signal<T[]>([]);

  // 2. Projections publiques en lecture seule
  readonly items = this.#items.asReadonly();
  readonly compteur = computed(() => this.#items().length);

  // 3. Opérations CRUD immutables
  ajouter(element: T): void {
    if (this.trouverParId(element.id)) {
      throw new Error(\`L'identifiant \${element.id} existe déjà !\`);
    }
    this.#items.update(liste => [...liste, element]); // Nouvelle référence
  }

  supprimer(id: T['id']): void {
    this.#items.update(liste => liste.filter(i => i.id !== id));
  }

  trouverParId(id: T['id']): T | undefined {
    return this.#items().find(i => i.id === id);
  }
}`;

  // Données du Repository
  readonly items = signal<DemoItem[]>([
    { id: 1, nom: 'Clavier mécanique RGB', infoExtra: '49.99 €' },
    { id: 2, nom: 'Souris sans fil Ergonomique', infoExtra: '29.99 €' },
    { id: 3, nom: 'Écran 27" IPS 144Hz', infoExtra: '219.00 €' }
  ]);

  readonly currentMemAddress = signal<string>('#0xREPO_ROOT');

  // Champs du formulaire
  readonly inputNewId = signal<string>('4');
  readonly inputNewNom = signal<string>('Webcam HD');
  readonly lastError = signal<string | null>(null);
  readonly lastSuccess = signal<string | null>(null);

  // Recherche
  readonly searchQuery = signal<string>('');
  readonly searchResult = computed(() => {
    const q = this.searchQuery().trim();
    if (!q) return null;
    return this.items().find(i => String(i.id) === q) || null;
  });

  setEntityType(type: 'Produit' | 'Client'): void {
    this.entityType.set(type);
    this.lastError.set(null);
    this.lastSuccess.set(null);
    if (type === 'Produit') {
      this.items.set([
        { id: 1, nom: 'Clavier mécanique RGB', infoExtra: '49.99 €' },
        { id: 2, nom: 'Souris sans fil Ergonomique', infoExtra: '29.99 €' },
        { id: 3, nom: 'Écran 27" IPS 144Hz', infoExtra: '219.00 €' }
      ]);
      this.inputNewId.set('4');
      this.inputNewNom.set('Webcam HD');
    } else {
      this.items.set([
        { id: 'CLI-001', nom: 'Société Dupont', infoExtra: 'Bruxelles' },
        { id: 'CLI-002', nom: 'Garage Martin', infoExtra: 'Namur' },
        { id: 'CLI-003', nom: 'Librairie Horizon', infoExtra: 'Liège' }
      ]);
      this.inputNewId.set('CLI-004');
      this.inputNewNom.set('Atelier Techno');
    }
  }

  onIdInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.inputNewId.set(val);
  }

  onNomInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.inputNewNom.set(val);
  }

  onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  ajouterElement(): void {
    const rawId = this.inputNewId().trim();
    const nom = this.inputNewNom().trim();
    if (!rawId || !nom) {
      this.lastError.set("L'identifiant et le nom sont requis.");
      return;
    }

    const id = this.entityType() === 'Produit' ? Number(rawId) : rawId;
    if (this.entityType() === 'Produit' && isNaN(id as number)) {
      this.lastError.set("L'identifiant d'un produit doit être un nombre valide.");
      return;
    }

    // Garde anti-doublon (comme dans Repository<T>)
    const existant = this.items().find(i => i.id === id);
    if (existant) {
      this.lastError.set(`L'identifiant ${id} existe déjà ! (Violation d'unicité)`);
      this.lastSuccess.set(null);
      return;
    }

    // Ajout immutable
    this.items.update(l => [...l, { id, nom, infoExtra: this.entityType() === 'Produit' ? '59.00 €' : 'Mons' }]);
    const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
    this.currentMemAddress.set(`#0xHEAP_${hex}`);
    this.lastError.set(null);
    this.lastSuccess.set(`Élément [${id}] "${nom}" inséré avec succès de manière immutable.`);

    // Préparer id suivant
    if (this.entityType() === 'Produit') {
      this.inputNewId.set(String(Number(id) + 1));
    }
  }

  testerDoublon(): void {
    if (this.items().length > 0) {
      const premierId = this.items()[0].id;
      this.inputNewId.set(String(premierId));
      this.inputNewNom.set('Doublon Test');
      this.ajouterElement();
    }
  }

  supprimerElement(id: number | string): void {
    this.items.update(l => l.filter(i => i.id !== id));
    const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
    this.currentMemAddress.set(`#0xHEAP_${hex}`);
    this.lastSuccess.set(`Élément [${id}] supprimé.`);
  }

  viderRepo(): void {
    this.setEntityType(this.entityType());
  }
}
