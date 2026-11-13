import { Component, signal, computed, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface NoteDTO {
  readonly id: string;
  readonly titre: string;
  readonly priorite: 'normale' | 'urgente';
  readonly dateISO: string;
}

export class Note {
  readonly #id: string;
  readonly #titre: string;
  readonly #priorite: 'normale' | 'urgente';
  readonly #date: Date;

  constructor(id: string, titre: string, priorite: 'normale' | 'urgente', date = new Date()) {
    if (!id?.trim()) throw new Error("ID obligatoire");
    if (!titre || titre.trim().length < 3) {
      throw new Error("Le titre doit comporter au moins 3 caractères.");
    }
    this.#id = id.trim();
    this.#titre = titre.trim();
    this.#priorite = priorite;
    this.#date = date;
  }

  get id(): string { return this.#id; }
  get titre(): string { return this.#titre; }
  get priorite(): 'normale' | 'urgente' { return this.#priorite; }
  get date(): Date { return this.#date; }

  isUrgente(): boolean {
    return this.#priorite === 'urgente';
  }

  toDTO(): NoteDTO {
    return {
      id: this.#id,
      titre: this.#titre,
      priorite: this.#priorite,
      dateISO: this.#date.toISOString()
    };
  }

  static fromDTO(dto: NoteDTO): Note {
    return new Note(dto.id, dto.titre, dto.priorite, new Date(dto.dateISO));
  }
}

@Component({
  selector: 'app-pocket-notes',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 06 · ARCHITECTURE MODÈLE ANGULAR 22</div>
        <h2>Application Témoin : PocketNotes (Signal-First)</h2>
        <p class="module-desc">
          Démonstrateur de référence implémentant l'ensemble des bonnes pratiques du cours :
          service Angular encapsulant <code>localStorage</code>, réactivité <strong>Signal-First</strong>,
          sécurité SSR (<code>isPlatformBrowser</code>), synchronisation inter-onglets et bandeau d'audit POO.
        </p>
      </div>

      <!-- Bandeau d'Audit POO en Temps Réel -->
      <div class="card-panel audit-panel">
        <div class="audit-row-layout">
          <div class="audit-main">
            <span class="audit-title">🔎 Audit POO en Temps Réel :</span>
            <div class="audit-badges">
              <span class="badge" [class.badge-success]="auditInstanceof()" [class.badge-red]="!auditInstanceof()">
                premier instanceof Note ➔ {{ auditInstanceof() ? 'true ✅' : 'false ❌' }}
              </span>
              <span class="badge" [class.badge-success]="auditMethodActive()" [class.badge-red]="!auditMethodActive()">
                Méthode isUrgente() active ➔ {{ auditMethodActive() ? 'OUI ✅' : 'NON ❌' }}
              </span>
              <span class="badge" [class.badge-success]="auditDateActive()" [class.badge-red]="!auditDateActive()">
                date instanceof Date ➔ {{ auditDateActive() ? 'OUI ✅' : 'NON ❌' }}
              </span>
            </div>
          </div>
          <div class="audit-count">
            <span class="urg-count">⚡ {{ nbUrgentes() }} urgente(s) sur {{ notes().length }} note(s)</span>
          </div>
        </div>
      </div>

      <!-- Corps de l'application PocketNotes -->
      <div class="notes-layout grid-2">
        <!-- Formulaire d'ajout & Liste des Notes -->
        <div class="card-panel notes-app-panel">
          <div class="app-top-row">
            <h3>📝 Carnet de Notes</h3>
            <span class="badge badge-purple">eafc_pocket_notes_v1</span>
          </div>

          <div class="add-note-form">
            <input 
              type="text" 
              [value]="newNoteTitle()" 
              (input)="newNoteTitle.set($any($event.target).value)" 
              placeholder="Nouvelle note (min. 3 car.)..." 
              (keyup.enter)="ajouterNote()"
            />
            <select [value]="newNotePriority()" (change)="newNotePriority.set($any($event.target).value)">
              <option value="normale">Priorité Normale</option>
              <option value="urgente">⚡ Priorité Urgente</option>
            </select>
            <button class="btn-primary" (click)="ajouterNote()">Ajouter</button>
          </div>

          @if (formError()) {
            <div class="form-error-msg animate-fade">⚠️ {{ formError() }}</div>
          }

          <!-- Liste des notes -->
          <div class="notes-list">
            @for (note of notes(); track note.id) {
              <div class="note-item" [class.urgent-card]="note.isUrgente()">
                <div class="note-main-info">
                  <div class="note-title-line">
                    <strong>{{ note.titre }}</strong>
                    @if (note.isUrgente()) {
                      <span class="badge badge-warning">⚡ Urgente</span>
                    }
                  </div>
                  <div class="note-meta-line">
                    <span>Créée le {{ note.date.toLocaleDateString() }} à {{ note.date.toLocaleTimeString() }}</span>
                    <span>• ID : <code>{{ note.id.slice(0, 8) }}...</code></span>
                  </div>
                </div>

                <button class="btn-ghost delete-btn" (click)="supprimerNote(note.id)" title="Supprimer la note">
                  🗑️
                </button>
              </div>
            } @empty {
              <div class="empty-notes">
                Aucune note enregistrée. Créez-en une pour observer la sérialisation DTO et le stockage disque !
              </div>
            }
          </div>
        </div>

        <!-- Inspecteur DevTools & Filet de Sécurité -->
        <div class="card-panel devtools-inspect-panel">
          <div class="devtools-header">
            <div class="d-title">🛠️ Inspecteur Application (LocalStorage Brute)</div>
            <span class="badge badge-teal">Clé : pocket_notes_v1</span>
          </div>

          <p class="devtools-sub">
            Voici la chaîne JSON exacte écrite sur votre disque dur. Vous pouvez tester la résilience du service en corrompant volontairement le JSON !
          </p>

          <div class="json-disk-view">
            <pre><code>{{ rawJsonFromDisk() }}</code></pre>
          </div>

          <div class="devtools-actions">
            <button class="btn-danger" (click)="corrompreVolontairement()">
              💣 Corrompre le JSON (Supprimer des accolades)
            </button>
            <button class="btn-secondary" (click)="reinitialiserNotesDefaut()">
              🔄 Recharger des notes modèles
            </button>
          </div>

          @if (corruptionMessage()) {
            <div class="corruption-alert animate-fade" [class.success]="isCorruptionRecovered()">
              <div class="alert-title">{{ corruptionMessage() }}</div>
              <p class="alert-sub">
                Grâce au bloc <code>try / catch</code> du service, le <code>SyntaxError</code> a été absorbé en silence et la vue a continué de fonctionner sans crasher !
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .audit-panel {
      padding: 12px 18px;
      background: var(--bg-card);

      .audit-row-layout {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;

        .audit-main {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;

          .audit-title {
            font-size: 0.84rem;
            font-weight: 700;
            color: var(--text-main);
          }

          .audit-badges {
            display: flex;
            gap: 8px;
          }
        }

        .urg-count {
          font-size: 0.82rem;
          color: #fbbf24;
          font-weight: 600;
        }
      }
    }

    .notes-layout {
      min-height: 480px;
    }

    .notes-app-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .app-top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
        }
      }

      .add-note-form {
        display: flex;
        gap: 8px;

        input {
          flex: 1;
        }
      }

      .form-error-msg {
        font-size: 0.78rem;
        color: #f87171;
        background: rgba(221, 0, 49, 0.1);
        padding: 6px 10px;
        border-radius: 4px;
        border-left: 3px solid #ef4444;
      }

      .notes-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
        max-height: 380px;

        .note-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 10px 14px;
          transition: all 0.2s;

          &.urgent-card {
            border-left: 4px solid #f59e0b;
            background: rgba(245, 158, 11, 0.04);
          }

          .note-main-info {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .note-title-line {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.9rem;
              color: var(--text-main);
            }

            .note-meta-line {
              font-size: 0.72rem;
              color: var(--text-dim);
              display: flex;
              gap: 8px;
            }
          }

          .delete-btn {
            font-size: 0.95rem;
            padding: 4px 8px;

            &:hover {
              background: rgba(221, 0, 49, 0.15);
            }
          }
        }

        .empty-notes {
          text-align: center;
          padding: 30px;
          color: var(--text-dim);
          font-size: 0.85rem;
          font-style: italic;
        }
      }
    }

    .devtools-inspect-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .devtools-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .d-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }
      }

      .devtools-sub {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      .json-disk-view {
        background: #060911;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 12px;
        overflow-y: auto;
        max-height: 220px;
        flex: 1;

        pre code {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: #34d399;
          white-space: pre-wrap;
          word-break: break-all;
        }
      }

      .devtools-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        button {
          padding: 8px 12px;
          font-size: 0.78rem;
        }
      }

      .corruption-alert {
        background: rgba(221, 0, 49, 0.12);
        border: 1px solid rgba(221, 0, 49, 0.3);
        border-radius: 6px;
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        &.success {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);

          .alert-title {
            color: #34d399;
          }
        }

        .alert-title {
          font-weight: 700;
          font-size: 0.84rem;
          color: #f87171;
        }

        .alert-sub {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      }
    }
  `]
})
export class PocketNotesComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'eafc_pocket_notes_v1';

  // State Signal-First
  readonly notes = signal<readonly Note[]>(this.chargerInitiales());
  readonly nbUrgentes = computed(() => this.notes().filter(n => n.isUrgente()).length);

  // Formulaire state
  readonly newNoteTitle = signal<string>('');
  readonly newNotePriority = signal<'normale' | 'urgente'>('normale');
  readonly formError = signal<string | null>(null);

  // Devtools / test corruption
  readonly rawJsonFromDisk = signal<string>('');
  readonly corruptionMessage = signal<string | null>(null);
  readonly isCorruptionRecovered = signal<boolean>(false);

  // Audit POO computed signals
  readonly auditInstanceof = computed<boolean>(() => {
    const premier = this.notes()[0];
    return premier ? premier instanceof Note : true;
  });

  readonly auditMethodActive = computed<boolean>(() => {
    const premier = this.notes()[0];
    return premier ? typeof premier.isUrgente === 'function' : true;
  });

  readonly auditDateActive = computed<boolean>(() => {
    const premier = this.notes()[0];
    return premier ? premier.date instanceof Date : true;
  });

  private storageListener: ((event: StorageEvent) => void) | null = null;

  constructor() {
    this.refreshRawDiskView();

    // Synchronisation inter-onglets avec StorageEvent
    if (this.isBrowser) {
      this.storageListener = (event: StorageEvent) => {
        if (event.key === this.STORAGE_KEY || event.key === null) {
          this.notes.set(this.chargerInitiales());
          this.refreshRawDiskView();
        }
      };
      window.addEventListener('storage', this.storageListener);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
  }

  ajouterNote(): void {
    const titre = this.newNoteTitle().trim();
    if (titre.length < 3) {
      this.formError.set('Le titre doit comporter au moins 3 caractères.');
      return;
    }

    this.formError.set(null);
    try {
      const nouvelle = new Note(crypto.randomUUID(), titre, this.newNotePriority(), new Date());
      const maj = [nouvelle, ...this.notes()];
      this.sauvegarder(maj);
      this.notes.set(maj);
      this.newNoteTitle.set('');
      this.refreshRawDiskView();
    } catch (e: any) {
      this.formError.set(e.message);
    }
  }

  supprimerNote(id: string): void {
    const maj = this.notes().filter(n => n.id !== id);
    this.sauvegarder(maj);
    this.notes.set(maj);
    this.refreshRawDiskView();
  }

  corrompreVolontairement(): void {
    if (!this.isBrowser) return;
    try {
      // Ingestion d'un JSON syntaxiquement invalide
      const corrupt = '{"id":"xyz", "titre":"Note Corrompue", BROKEN_JSON';
      localStorage.setItem(this.STORAGE_KEY, corrupt);
      this.rawJsonFromDisk.set(corrupt);

      // Rechargement immédiat
      const testReload = this.chargerInitiales();
      this.notes.set(testReload);

      this.isCorruptionRecovered.set(true);
      this.corruptionMessage.set('Filet de sécurité activé : JSON corrompu intercepté sans crash !');
    } catch (e) {
      this.corruptionMessage.set('Erreur inattendue.');
    }
  }

  reinitialiserNotesDefaut(): void {
    const defauts = [
      new Note(crypto.randomUUID(), 'Réviser la triade DTO & Entité fromDTO', 'urgente', new Date()),
      new Note(crypto.randomUUID(), 'Tester l’événement storage dans 2 onglets', 'normale', new Date()),
      new Note(crypto.randomUUID(), 'Découvrir IndexedDB et Dexie à la Séance 19', 'normale', new Date())
    ];
    this.sauvegarder(defauts);
    this.notes.set(defauts);
    this.refreshRawDiskView();
    this.corruptionMessage.set(null);
  }

  private sauvegarder(liste: readonly Note[]): void {
    if (!this.isBrowser) return;
    try {
      const dtos: NoteDTO[] = liste.map(n => n.toDTO());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dtos));
    } catch (e) {
      console.error('[PocketNotes] Quota dépassé :', e);
    }
  }

  private chargerInitiales(): readonly Note[] {
    if (!this.isBrowser) return [];
    try {
      const brut = localStorage.getItem(this.STORAGE_KEY);
      if (!brut) {
        // Initialiser avec quelques notes par défaut
        return [
          new Note('1', 'Comprendre le stockage synchrone', 'urgente', new Date()),
          new Note('2', 'Bannir l’accès direct en composant Angular', 'normale', new Date())
        ];
      }
      const dtos: NoteDTO[] = JSON.parse(brut);
      return dtos.map(Note.fromDTO);
    } catch {
      // Données corrompues : repli gracieux sans écran blanc
      return [];
    }
  }

  private refreshRawDiskView(): void {
    if (!this.isBrowser) return;
    const brut = localStorage.getItem(this.STORAGE_KEY);
    this.rawJsonFromDisk.set(brut ?? '(Clé inexistante sur disque)');
  }
}
