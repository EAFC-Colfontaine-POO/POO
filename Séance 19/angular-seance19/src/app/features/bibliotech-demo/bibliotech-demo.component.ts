import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { LivreDTO, EmpruntDTO } from '../../core/models/app.models';

export class BiblioLivre {
  readonly #id: string;
  readonly #isbn: string;
  readonly #titre: string;
  readonly #genres: readonly string[];
  #nbExemplaires: number;

  constructor(id: string, isbn: string, titre: string, genres: readonly string[], nbExemplaires: number) {
    if (!isbn?.trim() || isbn.length < 5) throw new Error('Invariant violé : ISBN invalide (min 5 caractères)');
    if (!titre || titre.trim().length < 2) throw new Error('Invariant violé : Titre trop court (min 2 caractères)');
    if (nbExemplaires < 0) throw new Error('Invariant violé : Stock négatif strictement interdit !');
    this.#id = id;
    this.#isbn = isbn.trim().toUpperCase();
    this.#titre = titre.trim();
    this.#genres = Object.freeze([...(genres || [])]);
    this.#nbExemplaires = Math.floor(nbExemplaires);
  }

  get id(): string { return this.#id; }
  get isbn(): string { return this.#isbn; }
  get titre(): string { return this.#titre; }
  get genres(): readonly string[] { return this.#genres; }
  get nbExemplaires(): number { return this.#nbExemplaires; }

  estDisponible(): boolean { return this.#nbExemplaires > 0; }

  retirerUnExemplaire(): void {
    if (!this.estDisponible()) {
      throw new Error(`Stock épuisé pour "${this.#titre}"`);
    }
    this.#nbExemplaires--;
  }

  toDTO(): LivreDTO {
    return {
      id: this.#id,
      isbn: this.#isbn,
      titre: this.#titre,
      genres: [...this.#genres],
      nbExemplaires: this.#nbExemplaires
    };
  }

  static fromDTO(dto: LivreDTO): BiblioLivre {
    return new BiblioLivre(dto.id, dto.isbn, dto.titre, dto.genres, dto.nbExemplaires);
  }
}

class BiblioDemoDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  emprunts!: Table<EmpruntDTO, string>;

  constructor() {
    super('BiblioTechDB_Live');
    this.version(1).stores({
      livres: 'id, &isbn, titre, *genres',
      emprunts: 'id, livreId, adherentNom, dateEmpruntISO'
    });
  }
}

@Component({
  selector: 'app-bibliotech-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 08 · DÉMONSTRATION DE SYNTHÈSE COMPLETE</div>
        <h2>BiblioTech : Passerelle Dexie.js ↔ Angular Signals</h2>
        <p class="module-desc">
          Mini-application complète démontrant l'architecture professionnelle en 3 couches du cours :
          l'entité POO avec invariants et champs privés <code>#</code>, la base Dexie typée avec index riches,
          et le service réactif Signal-First sans zone.js.
        </p>
      </div>

      <!-- Barre d'actions & Recherche -->
      <div class="card-panel">
        <div class="actions-header-row">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Recherche instantanée par titre (startsWithIgnoreCase)..."
              [value]="searchPrefix()"
              (input)="onSearchInput($event)"
            />
          </div>

          <div class="stress-test-box">
            <button class="btn-primary stress-btn" (click)="lancerStressTestDoubleClic()" [disabled]="isTesting()">
              ⚡ Stress-Test : Double-clic sur le dernier exemplaire
            </button>
          </div>
        </div>

        @if (stressLog()) {
          <div class="stress-log-banner" [class.success]="stressSuccess()">
            <div class="log-heading">Rapport du Stress-Test de Concurrence :</div>
            <code>{{ stressLog() }}</code>
          </div>
        }
      </div>

      <!-- Grille Principale : Catalogue & Formulaire d'Ajout -->
      <div class="biblio-main-grid">
        <!-- Colonne Gauche : Catalogue des Livres -->
        <div class="card-panel catalogue-col">
          <div class="section-title-row">
            <div class="s-title">📚 Catalogue des Livres en Rayon</div>
            <span class="badge badge-success">{{ livres().length }} référence(s)</span>
          </div>

          <div class="livres-list">
            @for (livre of livres(); track livre.id) {
              <div class="livre-row-item card-panel" [class.out-of-stock]="!livre.estDisponible()">
                <div class="livre-meta-left">
                  <div class="livre-title-bar">
                    <h4>{{ livre.titre }}</h4>
                    <span class="badge" [class.badge-success]="livre.estDisponible()" [class.badge-red]="!livre.estDisponible()">
                      {{ livre.estDisponible() ? livre.nbExemplaires + ' exemplaire(s)' : 'Stock Épuisé' }}
                    </span>
                  </div>
                  <div class="livre-sub-info">
                    <span class="isbn-tag"><code>{{ livre.isbn }}</code></span>
                    <div class="genres-tags">
                      @for (g of livre.genres; track g) {
                        <span class="genre-bubble">{{ g }}</span>
                      }
                    </div>
                  </div>
                </div>

                <div class="livre-actions-right">
                  <button 
                    class="btn-sm btn-borrow" 
                    (click)="emprunter(livre.id)"
                    [disabled]="!livre.estDisponible()"
                  >
                    Emprunter
                  </button>
                </div>
              </div>
            } @empty {
              <div class="empty-list">Aucun livre ne correspond à votre recherche.</div>
            }
          </div>
        </div>

        <!-- Colonne Droite : Formulaire d'Ajout & Inspecteur DevTools -->
        <div class="side-col">
          <!-- Formulaire d'Ajout avec détection d'erreurs -->
          <div class="card-panel">
            <div class="section-title-row">
              <div class="s-title">➕ Ajouter un Livre (Index Unique &amp; Invariants)</div>
            </div>

            <form class="add-form" (submit)="ajouterLivre($event)">
              <div class="form-group">
                <label>ISBN (Index Unique <code>&amp;isbn</code>) :</label>
                <input type="text" #isbnInput placeholder="ex: 978-2070368228" required />
              </div>

              <div class="form-group">
                <label>Titre de l'ouvrage :</label>
                <input type="text" #titreInput placeholder="ex: Le Petit Prince" required />
              </div>

              <div class="form-group">
                <label>Genres (Index Multi-Entry <code>*genres</code>, séparés par virgule) :</label>
                <input type="text" #genresInput placeholder="ex: Roman, Philosophie, Jeunesse" />
              </div>

              <div class="form-group">
                <label>Nombre d'exemplaires :</label>
                <input type="number" #nbInput value="2" min="1" required />
              </div>

              <button type="submit" class="btn-primary w-full">
                Enregistrer dans IndexedDB
              </button>

              @if (formError()) {
                <div class="error-toast">
                  <span>🛑 {{ formError() }}</span>
                </div>
              }
            </form>
          </div>

          <!-- Inspecteur DevTools Embarqué (F12 Application > IndexedDB) -->
          <div class="card-panel devtools-inspector">
            <div class="section-title-row">
              <div class="s-title">🔍 Inspecteur DevTools Embarqué (F12 ➔ IndexedDB)</div>
              <span class="badge badge-purple">BiblioTechDB_Live</span>
            </div>

            <div class="devtools-tabs">
              <button 
                class="dev-tab" 
                [class.active]="inspectorTab() === 'livres'"
                (click)="setInspectorTab('livres')"
              >
                Store 'livres' ({{ livres().length }})
              </button>
              <button 
                class="dev-tab" 
                [class.active]="inspectorTab() === 'emprunts'"
                (click)="setInspectorTab('emprunts')"
              >
                Store 'emprunts' ({{ emprunts().length }})
              </button>
            </div>

            <div class="devtools-body">
              @if (inspectorTab() === 'livres') {
                <div class="devtools-records">
                  @for (l of livres(); track l.id) {
                    <div class="raw-record">
                      <span class="rec-key">Key: "{{ l.id }}"</span>
                      <pre><code>&#123; isbn: "{{ l.isbn }}", titre: "{{ l.titre }}", stock: {{ l.nbExemplaires }} &#125;</code></pre>
                    </div>
                  }
                </div>
              } @else {
                <div class="devtools-records">
                  @for (e of emprunts(); track e.id) {
                    <div class="raw-record">
                      <span class="rec-key">Key: "{{ e.id }}"</span>
                      <pre><code>&#123; livreId: "{{ e.livreId }}", adherent: "{{ e.adherentNom }}", date: "{{ e.dateEmpruntISO.slice(0, 10) }}" &#125;</code></pre>
                    </div>
                  } @empty {
                    <div class="empty-dev">Aucun emprunt enregistré pour le moment.</div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .actions-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;

      .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 8px 12px;
        border-radius: 6px;
        flex: 1;
        max-width: 480px;

        input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-size: 0.82rem;
          width: 100%;
        }
      }

      .stress-btn {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
        &:hover {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
        }
      }
    }

    .stress-log-banner {
      margin-top: 12px;
      padding: 10px 14px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 6px;
      font-size: 0.78rem;

      &.success {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.3);
        .log-heading { color: #10b981; }
        code { color: #86efac; }
      }

      .log-heading {
        font-weight: 700;
        margin-bottom: 2px;
      }
      code {
        color: #fca5a5;
        font-family: var(--font-mono);
      }
    }

    .biblio-main-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 16px;
      margin-top: 14px;

      @media (max-width: 960px) {
        grid-template-columns: 1fr;
      }
    }

    .livres-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 12px;
      max-height: 600px;
      overflow-y: auto;
    }

    .livre-row-item {
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      transition: all 0.2s;

      &.out-of-stock {
        opacity: 0.65;
        border-color: rgba(239, 68, 68, 0.3);
      }

      .livre-meta-left {
        flex: 1;

        .livre-title-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
          h4 { font-size: 0.92rem; }
        }

        .livre-sub-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;

          .isbn-tag code {
            font-size: 0.72rem;
            color: #60a5fa;
          }

          .genres-tags {
            display: flex;
            gap: 4px;

            .genre-bubble {
              padding: 1px 6px;
              background: var(--bg-subtle);
              border: 1px solid var(--border-color);
              border-radius: 4px;
              font-size: 0.68rem;
              color: var(--text-muted);
            }
          }
        }
      }

      .btn-borrow {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.35);
        padding: 6px 12px;
        border-radius: 6px;
        font-weight: 600;

        &:hover:not(:disabled) {
          background: #10b981;
          color: #ffffff;
        }
      }
    }

    .side-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .add-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 4px;

        label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          code { color: #60a5fa; }
        }

        input {
          padding: 8px 10px;
          background: var(--bg-code);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-main);
          font-size: 0.8rem;
          outline: none;

          &:focus {
            border-color: var(--border-focus);
          }
        }
      }

      .w-full {
        width: 100%;
        margin-top: 4px;
      }

      .error-toast {
        padding: 8px 12px;
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.4);
        border-radius: 6px;
        color: #fca5a5;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }

    .devtools-inspector {
      .devtools-tabs {
        display: flex;
        gap: 8px;
        margin: 10px 0;

        .dev-tab {
          padding: 4px 10px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);

          &.active {
            background: rgba(147, 51, 234, 0.2);
            border-color: #a855f7;
            color: #c084fc;
            font-weight: 600;
          }
        }
      }

      .devtools-records {
        max-height: 200px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .raw-record {
          padding: 6px 10px;
          background: var(--bg-code);
          border-radius: 4px;
          border: 1px solid var(--border-color);
          font-size: 0.7rem;

          .rec-key {
            color: #f59e0b;
            font-family: var(--font-mono);
            font-weight: 700;
            display: block;
            margin-bottom: 2px;
          }

          pre code {
            color: #93c5fd;
          }
        }
      }

      .empty-dev {
        text-align: center;
        padding: 16px;
        font-size: 0.75rem;
        color: var(--text-dim);
      }
    }
  `]
})
export class BibliotechDemoComponent {
  private db: BiblioDemoDB;

  readonly livres = signal<BiblioLivre[]>([]);
  readonly emprunts = signal<EmpruntDTO[]>([]);
  readonly searchPrefix = signal<string>('');
  readonly formError = signal<string | null>(null);
  readonly isTesting = signal<boolean>(false);
  readonly stressLog = signal<string | null>(null);
  readonly stressSuccess = signal<boolean>(false);
  readonly inspectorTab = signal<'livres' | 'emprunts'>('livres');

  constructor() {
    this.db = new BiblioDemoDB();
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    try {
      await this.db.open();
      const count = await this.db.livres.count();
      if (count === 0) {
        // Jeu de données initial
        await this.db.livres.bulkAdd([
          { id: '1', isbn: '978-2070368228', titre: 'L\'Étranger', genres: ['Roman', 'Philosophie'], nbExemplaires: 3 },
          { id: '2', isbn: '978-0441172719', titre: 'Dune', genres: ['SF', 'Espace'], nbExemplaires: 1 }, // Pour le stress-test
          { id: '3', isbn: '978-0132350884', titre: 'Clean Code', genres: ['Informatique', 'Architecture'], nbExemplaires: 2 }
        ]);
      }
      await this.recharger();
    } catch (err: any) {
      console.error('[BiblioDemo] Erreur initialisation :', err);
    }
  }

  async recharger(): Promise<void> {
    const prefix = this.searchPrefix().trim();
    let dtos: LivreDTO[];

    if (!prefix) {
      dtos = await this.db.livres.orderBy('titre').toArray();
    } else {
      dtos = await this.db.livres
        .where('titre')
        .startsWithIgnoreCase(prefix)
        .toArray();
    }

    this.livres.set(dtos.map(BiblioLivre.fromDTO));

    const allEmprunts = await this.db.emprunts.toArray();
    this.emprunts.set(allEmprunts);
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchPrefix.set(val);
    this.recharger();
  }

  async ajouterLivre(event: Event): Promise<void> {
    event.preventDefault();
    this.formError.set(null);

    const form = event.target as HTMLFormElement;
    const isbn = (form.elements.namedItem('isbnInput') as any)?.value || (form.querySelector('input[type="text"]') as HTMLInputElement)?.value;
    const inputs = form.querySelectorAll('input');
    const isbnVal = inputs[0].value.trim();
    const titreVal = inputs[1].value.trim();
    const genresVal = inputs[2].value.split(',').map(g => g.trim()).filter(Boolean);
    const nbVal = parseInt(inputs[3].value, 10) || 1;

    try {
      const nouveau = new BiblioLivre(crypto.randomUUID(), isbnVal, titreVal, genresVal, nbVal);
      await this.db.livres.add(nouveau.toDTO());
      form.reset();
      await this.recharger();
    } catch (err: any) {
      if (err instanceof Dexie.ConstraintError || err.name === 'ConstraintError') {
        this.formError.set(`Index Unique violé : L'ISBN "${isbnVal}" existe déjà dans la base !`);
      } else {
        this.formError.set(err.message);
      }
    }
  }

  async emprunter(livreId: string): Promise<void> {
    try {
      await this.db.transaction('rw', [this.db.livres, this.db.emprunts], async () => {
        const dto = await this.db.livres.get(livreId);
        if (!dto) throw new Error('Livre introuvable');
        const livre = BiblioLivre.fromDTO(dto);
        livre.retirerUnExemplaire();

        await this.db.livres.update(livreId, { nbExemplaires: livre.nbExemplaires });
        await this.db.emprunts.add({
          id: crypto.randomUUID(),
          livreId,
          adherentNom: 'Étudiant Bachelier',
          dateEmpruntISO: new Date().toISOString()
        });
      });
      await this.recharger();
    } catch (err: any) {
      alert(`Emprunt refusé : ${err.message}`);
    }
  }

  async lancerStressTestDoubleClic(): Promise<void> {
    this.isTesting.set(true);
    this.stressLog.set(null);

    // Trouver ou créer un livre avec EXACTEMENT 1 exemplaire
    let cible = this.livres().find(l => l.nbExemplaires === 1);
    if (!cible) {
      await this.db.livres.add({
        id: crypto.randomUUID(),
        isbn: `978-TEST-${Date.now().toString().slice(-4)}`,
        titre: 'Dernier Exemplaire Test',
        genres: ['Test'],
        nbExemplaires: 1
      });
      await this.recharger();
      cible = this.livres().find(l => l.titre === 'Dernier Exemplaire Test')!;
    }

    const livreId = cible.id;

    // Deux appels transactionnels quasi-simultanés !
    const call1 = this.emprunterLivreInterne(livreId, 'Appel Concurrent A');
    const call2 = this.emprunterLivreInterne(livreId, 'Appel Concurrent B');

    const results = await Promise.allSettled([call1, call2]);

    const reussi = results.filter(r => r.status === 'fulfilled').length;
    const echoue = results.filter(r => r.status === 'rejected').length;

    await this.recharger();
    const livreFinal = await this.db.livres.get(livreId);

    this.stressSuccess.set(reussi === 1 && echoue === 1 && livreFinal?.nbExemplaires === 0);
    this.stressLog.set(
      `Résultat : ${reussi} transaction validée (Stock 1 ➔ 0), ${echoue} transaction refusée avec ROLLBACK (Stock épuisé). Stock final : ${livreFinal?.nbExemplaires} (Strictement jamais -1 !)`
    );
    this.isTesting.set(false);
  }

  private async emprunterLivreInterne(livreId: string, adherent: string): Promise<void> {
    return this.db.transaction('rw', [this.db.livres, this.db.emprunts], async () => {
      const dto = await this.db.livres.get(livreId);
      if (!dto) throw new Error('Livre introuvable');
      const livre = BiblioLivre.fromDTO(dto);
      livre.retirerUnExemplaire();

      await this.db.livres.update(livreId, { nbExemplaires: livre.nbExemplaires });
      await this.db.emprunts.add({
        id: crypto.randomUUID(),
        livreId,
        adherentNom: adherent,
        dateEmpruntISO: new Date().toISOString()
      });
    });
  }

  setInspectorTab(tab: 'livres' | 'emprunts'): void {
    this.inspectorTab.set(tab);
  }
}
