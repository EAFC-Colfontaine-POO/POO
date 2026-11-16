import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import Dexie from 'dexie';

interface FieldOption {
  key: string;
  label: string;
  type: string;
  isPrimary?: boolean;
  indexed: boolean;
  description: string;
}

@Component({
  selector: 'app-typed-database',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 02 · ARCHITECTURE DES SCHÉMAS &amp; CLÉS</div>
        <h2>Modélisation d'une Base Typée &amp; Arbitrage des Clés Primaires</h2>
        <p class="module-desc">
          Maîtriser la syntaxe concise de <code>this.version(1).stores()</code>, comprendre la <strong>Règle d'or</strong>
          (seuls les index sont listés dans le schéma), et arbitrer rigoureusement entre clé auto-incrémentée <code>++id</code>
          et clé universelle <code>crypto.randomUUID()</code> pour les applications Offline-First.
        </p>
      </div>

      <!-- Constructeur Visuel de Schéma Dexie -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">🛠️ Constructeur Visuel de Schéma Dexie (Entité Article)</div>
          <span class="badge badge-ts">Générateur Dynamique</span>
        </div>

        <p class="p-lead">
          Cochez les champs à indexer pour la recherche. Observez comment Dexie génère le schéma minimal en temps réel.
        </p>

        <div class="schema-builder-grid">
          <div class="fields-selection">
            <div class="fields-list">
              @for (field of fields(); track field.key) {
                <div class="field-item" [class.primary]="field.isPrimary" [class.checked]="field.indexed">
                  <label class="field-checkbox-label">
                    <input 
                      type="checkbox" 
                      [checked]="field.indexed"
                      [disabled]="field.isPrimary"
                      (change)="toggleField(field.key)"
                    />
                    <div class="field-info">
                      <span class="field-name"><code>{{ field.key }}</code></span>
                      <span class="field-type">({{ field.type }})</span>
                      @if (field.isPrimary) {
                        <span class="badge badge-warning">Clé Primaire</span>
                      }
                    </div>
                  </label>
                  <div class="field-desc">{{ field.description }}</div>
                </div>
              }
            </div>
          </div>

          <div class="code-preview-col">
            <div class="preview-header">
              <span>Code TypeScript Généré</span>
              <span class="badge badge-success">Classe Dexie 4+</span>
            </div>
            <pre class="code-box"><code>{{ generatedCode() }}</code></pre>
          </div>
        </div>
      </div>

      <!-- Démonstrateur de la Règle d'or -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">💎 Démonstrateur de la « Règle d'Or » : Disque vs Index B-Tree</div>
          <span class="badge badge-purple">Principe NoSQL Clé</span>
        </div>

        <p class="p-lead">
          Même si <code>descriptionLongue</code> n'est <strong>PAS</strong> listée dans <code>stores()</code>,
          l'objet complet est tout de même sauvegardé intact sur le disque dur !
        </p>

        <div class="golden-rule-grid">
          <div class="golden-col">
            <h4>1. Arbre d'Index B-Tree (RAM &amp; Disque)</h4>
            <div class="index-tree-box">
              <div class="tree-label">Index enregistrés pour .where() :</div>
              <div class="index-pills">
                @for (idx of activeIndexNames(); track idx) {
                  <span class="index-pill">{{ idx }}</span>
                }
              </div>
              <div class="tree-note">
                Recherche ultra-rapide en <strong>O(log n)</strong> sur ces clés uniquement.
              </div>
            </div>
          </div>

          <div class="golden-col">
            <h4>2. Enregistrement Physique sur le Disque</h4>
            <div class="disk-payload-box">
              <div class="payload-header">Objet réhydraté intégralement :</div>
              <pre><code>&#123;
  id: "art-101",
  titre: "Écran 34 Pouces Ultrawide",
  prix: 499,
  categorie: "Informatique",
  descriptionLongue: "Dalle IPS incurvée 144Hz avec hub USB-C et HDR400. Stockée intégralement sans surcoût d'indexation !"
&#125;</code></pre>
              <div class="badge badge-success">descriptionLongue est 100% conservée ! ✅</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Arbitrage Clé Primaire : ++id vs crypto.randomUUID() -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">⚖️ Arbitrage Clé Primaire : Incrément (<code>++id</code>) vs UUID Hors-Ligne</div>
          <span class="badge badge-warning">Sécurité de Synchronisation</span>
        </div>

        <p class="p-lead">
          Simulez deux ordinateurs portables de commerciaux travaillant hors connexion sans réseau :
        </p>

        <div class="sync-simulator-grid">
          <div class="device-card">
            <div class="device-header">
              <span class="device-icon">💻</span>
              <span>Appareil A (Hors Ligne)</span>
            </div>
            <div class="device-records">
              <div class="record-row">
                <span class="r-id" [class.danger]="idStrategy() === 'auto'">
                  {{ idStrategy() === 'auto' ? 'ID #1' : 'uuid-a1' }}
                </span>
                <span>Devis Client Martin</span>
              </div>
              <div class="record-row">
                <span class="r-id" [class.danger]="idStrategy() === 'auto'">
                  {{ idStrategy() === 'auto' ? 'ID #2' : 'uuid-a2' }}
                </span>
                <span>Devis Client Bernard</span>
              </div>
            </div>
          </div>

          <div class="sync-center-col">
            <div class="sync-toggle">
              <button 
                class="btn-sm" 
                [class.btn-primary]="idStrategy() === 'auto'"
                (click)="setIdStrategy('auto')"
              >
                Mode ++id
              </button>
              <button 
                class="btn-sm" 
                [class.btn-primary]="idStrategy() === 'uuid'"
                (click)="setIdStrategy('uuid')"
              >
                Mode UUID
              </button>
            </div>

            <div class="sync-result" [class.collision]="idStrategy() === 'auto'" [class.clean]="idStrategy() === 'uuid'">
              @if (idStrategy() === 'auto') {
                <div class="status-title">💥 COLLISION CRITIQUE !</div>
                <p>
                  Les deux appareils ont généré les mêmes clés <code>1</code> et <code>2</code>.
                  Lors de la synchronisation, l'appareil B écrasera silencieusement le travail de l'appareil A !
                </p>
              } @else {
                <div class="status-title">✅ SYNCHRONISATION PARFAITE</div>
                <p>
                  Grâce à <code>crypto.randomUUID()</code>, chaque appareil génère des clés mondialement uniques.
                  Zéro collision, fusion hors-ligne 100% fiable !
                </p>
              }
            </div>
          </div>

          <div class="device-card">
            <div class="device-header">
              <span class="device-icon">📱</span>
              <span>Appareil B (Hors Ligne)</span>
            </div>
            <div class="device-records">
              <div class="record-row">
                <span class="r-id" [class.danger]="idStrategy() === 'auto'">
                  {{ idStrategy() === 'auto' ? 'ID #1' : 'uuid-b1' }}
                </span>
                <span>Devis Client Durand</span>
              </div>
              <div class="record-row">
                <span class="r-id" [class.danger]="idStrategy() === 'auto'">
                  {{ idStrategy() === 'auto' ? 'ID #2' : 'uuid-b2' }}
                </span>
                <span>Devis Client Lefebvre</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .schema-builder-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .fields-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-item {
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      transition: all 0.2s;

      &.checked {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.05);
      }

      .field-checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-size: 0.88rem;

        input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .field-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .field-name code {
            font-weight: 700;
            color: #60a5fa;
          }

          .field-type {
            color: var(--text-muted);
            font-size: 0.78rem;
          }
        }
      }

      .field-desc {
        margin-top: 4px;
        margin-left: 26px;
        font-size: 0.75rem;
        color: var(--text-dim);
      }
    }

    .code-preview-col {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .preview-header {
        padding: 8px 14px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .code-box {
        padding: 14px;
        font-size: 0.78rem;
        line-height: 1.45;
        color: #93c5fd;
        flex: 1;
        overflow-x: auto;
      }
    }

    .golden-rule-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;

      .golden-col {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;

        h4 {
          font-size: 0.95rem;
          margin-bottom: 10px;
        }
      }

      .index-tree-box {
        padding: 12px;
        background: var(--bg-code);
        border-radius: 6px;
        border: 1px solid var(--border-color);

        .tree-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .index-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;

          .index-pill {
            padding: 4px 10px;
            background: rgba(59, 130, 246, 0.15);
            border: 1px solid rgba(59, 130, 246, 0.35);
            color: #93c5fd;
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 0.78rem;
            font-weight: 600;
          }
        }

        .tree-note {
          margin-top: 12px;
          font-size: 0.75rem;
          color: var(--text-dim);
        }
      }

      .disk-payload-box {
        padding: 12px;
        background: var(--bg-code);
        border-radius: 6px;
        border: 1px solid var(--border-color);

        .payload-header {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        pre code {
          font-size: 0.74rem;
          color: #a7f3d0;
          line-height: 1.35;
        }

        .badge {
          margin-top: 8px;
        }
      }
    }

    .sync-simulator-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr 1fr;
      gap: 14px;
      margin-top: 14px;
      align-items: center;

      .device-card {
        padding: 14px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;

        .device-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 12px;
        }

        .device-records {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .record-row {
            padding: 6px 10px;
            background: var(--bg-subtle);
            border-radius: 4px;
            font-size: 0.75rem;
            display: flex;
            justify-content: space-between;

            .r-id {
              font-family: var(--font-mono);
              font-weight: 700;
              color: #60a5fa;

              &.danger {
                color: #f87171;
              }
            }
          }
        }
      }

      .sync-center-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .sync-toggle {
          display: flex;
          gap: 6px;
          padding: 4px;
          background: var(--bg-subtle);
          border-radius: 6px;
          border: 1px solid var(--border-color);

          button {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
          }
        }

        .sync-result {
          padding: 14px;
          border-radius: 8px;
          text-align: center;
          font-size: 0.78rem;

          &.collision {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            .status-title {
              color: #ef4444;
              font-weight: 800;
              font-size: 0.9rem;
              margin-bottom: 4px;
            }
          }

          &.clean {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #86efac;
            .status-title {
              color: #10b981;
              font-weight: 800;
              font-size: 0.9rem;
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  `]
})
export class TypedDatabaseComponent {
  readonly fields = signal<FieldOption[]>([
    { key: 'id', label: 'id', type: 'string', isPrimary: true, indexed: true, description: 'Clé primaire unique de chaque article.' },
    { key: 'titre', label: 'titre', type: 'string', indexed: true, description: 'Indexé pour la recherche textuelle rapide et l\'autocomplétion.' },
    { key: 'categorie', label: 'categorie', type: 'string', indexed: true, description: 'Indexé pour le filtrage direct par catégorie.' },
    { key: 'prix', label: 'prix', type: 'number', indexed: false, description: 'Non indexé : filtré en mémoire avec .filter() si nécessaire.' },
    { key: 'descriptionLongue', label: 'descriptionLongue', type: 'string', indexed: false, description: 'Texte volumineux non indexé : stocké tel quel sur disque.' },
    { key: 'dateCreation', label: 'dateCreation', type: 'string', indexed: false, description: 'Horodatage ISO : indexé uniquement si tri chronologique fréquent.' }
  ]);

  readonly idStrategy = signal<'auto' | 'uuid'>('uuid');

  readonly activeIndexNames = computed(() => {
    return this.fields().filter(f => f.indexed).map(f => f.key);
  });

  readonly generatedCode = computed(() => {
    const indexes = this.activeIndexNames().join(', ');
    return `import Dexie, { Table } from 'dexie';

export interface ArticleDTO {
  id: string;
  titre: string;
  prix: number;
  categorie: string;
  descriptionLongue?: string;
  dateCreation?: string;
}

export class MagasinDB extends Dexie {
  articles!: Table<ArticleDTO, string>;

  constructor() {
    super('MagasinDB');
    this.version(1).stores({
      articles: '${indexes}'
    });
  }
}

export const db = new MagasinDB();`;
  });

  toggleField(key: string): void {
    this.fields.update(list =>
      list.map(f => {
        if (f.key === key && !f.isPrimary) {
          return { ...f, indexed: !f.indexed };
        }
        return f;
      })
    );
  }

  setIdStrategy(strategy: 'auto' | 'uuid'): void {
    this.idStrategy.set(strategy);
  }
}
