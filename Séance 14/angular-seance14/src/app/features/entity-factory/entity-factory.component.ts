import { Component, signal, computed } from '@angular/core';

interface CustomEntityRecord {
  id: number | string;
  [key: string]: any;
}

@Component({
  selector: 'app-entity-factory',
  standalone: true,
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 08 · Live Sandbox</div>
        <h2>Live Sandbox : L'Usine à Entités</h2>
        <p class="module-desc">
          Testez la promesse ultime de la généricité : configurez une entité métier quelconque
          (ex: <code>Livre</code>, <code>JeuVideo</code>, <code>Etudiant</code>, <code>Vehicule</code>),
          instanciez instantanément son <code>Repository&lt;T&gt;</code> réactif en mémoire,
          et exportez le code TypeScript prêt pour la production.
        </p>
      </header>

      <!-- Configuration de l'entité -->
      <section class="card-panel">
        <div class="panel-header">
          <h3>🏭 1. Définir votre Entité Métier</h3>
          <span class="badge badge-ts">Générateur de Types</span>
        </div>

        <div class="factory-config-grid my-3">
          <div class="field-item">
            <label>Nom de l'entité (PascalCase) :</label>
            <input class="input-control" [value]="entityName()" (input)="onEntityNameInput($event)" placeholder="Ex: Livre, JeuVideo, Etudiant" />
          </div>

          <div class="field-item">
            <label>Type de l'identifiant (id) :</label>
            <div class="btn-group">
              <button class="btn-toggle" [class.active]="idType() === 'number'" (click)="idType.set('number')">
                number (Numérique)
              </button>
              <button class="btn-toggle" [class.active]="idType() === 'string'" (click)="idType.set('string')">
                string (Texte / UUID)
              </button>
            </div>
          </div>

          <div class="field-item">
            <label>Propriété métier 1 :</label>
            <div class="prop-input-row">
              <input class="input-control flex-1" [value]="prop1Name()" (input)="onProp1Input($event)" placeholder="Nom (ex: titre, marque)" />
              <select class="input-control select-type" [value]="prop1Type()" (change)="onProp1TypeChange($event)">
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
              </select>
            </div>
          </div>

          <div class="field-item">
            <label>Propriété métier 2 :</label>
            <div class="prop-input-row">
              <input class="input-control flex-1" [value]="prop2Name()" (input)="onProp2Input($event)" placeholder="Nom (ex: auteur, prix)" />
              <select class="input-control select-type" [value]="prop2Type()" (change)="onProp2TypeChange($event)">
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Code TypeScript Généré en Direct -->
      <section class="card-panel mt-4">
        <div class="panel-header">
          <h3>📜 2. Code TypeScript Généré Automatiquement</h3>
          <button class="btn-secondary" (click)="copierCode()">
            {{ codeCopie() ? '✓ Code Copié !' : '📋 Copier le Code' }}
          </button>
        </div>

        <div class="code-box mt-2">
          <div class="code-header">
            <span>{{ entityName().toLowerCase() }}.service.ts</span>
            <span class="badge badge-success">Zéro Duplication</span>
          </div>
          <pre><code>{{ generatedCode() }}</code></pre>
        </div>
      </section>

      <!-- Table CRUD Réactive en Direct -->
      <section class="card-panel mt-4">
        <div class="panel-header">
          <h3>⚡ 3. Banc d'Essai Réactif : Repository&lt;{{ entityName() }}&gt;</h3>
          <span class="badge badge-success">{{ records().length }} enregistrement(s) en mémoire</span>
        </div>

        <!-- Formulaire d'ajout rapide -->
        <div class="add-record-bar my-3">
          <input 
            class="input-control id-input" 
            [value]="newRecordId()" 
            (input)="onRecordIdInput($event)" 
            placeholder="id ({{ idType() }})" 
          />
          <input 
            class="input-control flex-1" 
            [value]="newRecordProp1()" 
            (input)="onRecordProp1Input($event)" 
            placeholder="{{ prop1Name() }} ({{ prop1Type() }})" 
          />
          <input 
            class="input-control flex-1" 
            [value]="newRecordProp2()" 
            (input)="onRecordProp2Input($event)" 
            placeholder="{{ prop2Name() }} ({{ prop2Type() }})" 
          />
          <button class="btn-primary" (click)="ajouterRecord()">
            + Insérer dans le Repository
          </button>
        </div>

        @if (factoryError()) {
          <div class="error-msg-banner mb-3">
            🚨 {{ factoryError() }}
          </div>
        }

        <!-- Tableau des données de l'entité -->
        <div class="table-responsive">
          <table class="entity-table">
            <thead>
              <tr>
                <th>id ({{ idType() }})</th>
                <th>{{ prop1Name() }} ({{ prop1Type() }})</th>
                <th>{{ prop2Name() }} ({{ prop2Type() }})</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (row of records(); track row.id) {
                <tr>
                  <td><span class="id-tag">{{ row.id }}</span></td>
                  <td>{{ row[prop1Name()] }}</td>
                  <td>{{ row[prop2Name()] }}</td>
                  <td>
                    <button class="btn-delete" (click)="supprimerRecord(row.id)" title="Supprimer">
                      🗑️
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="empty-cell">
                    Aucun(e) {{ entityName() }} enregistré(e). Complétez la ligne ci-dessus pour tester !
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
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

    .factory-config-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (max-width: 860px) {
      .factory-config-grid {
        grid-template-columns: 1fr;
      }
    }

    .field-item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
      }
    }

    .prop-input-row {
      display: flex;
      gap: 8px;
    }

    .select-type {
      width: 110px;
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
      flex: 1;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);

      &.active {
        background: var(--ts-blue);
        color: #fff;
      }
    }

    .add-record-bar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .id-input {
        width: 140px;
      }
    }

    .error-msg-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .entity-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;

      th, td {
        padding: 10px 14px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }

      th {
        background: var(--bg-subtle);
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.78rem;
      }

      .id-tag {
        font-family: var(--font-mono);
        font-size: 0.76rem;
        padding: 2px 7px;
        background: rgba(49, 120, 198, 0.18);
        color: var(--ts-blue-light);
        border-radius: 4px;
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

      .empty-cell {
        text-align: center;
        color: var(--text-dim);
        font-style: italic;
        padding: 24px;
      }
    }

    .flex-1 {
      flex: 1;
    }
  `]
})
export class EntityFactoryComponent {
  readonly entityName = signal<string>('JeuVideo');
  readonly idType = signal<'number' | 'string'>('number');
  readonly prop1Name = signal<string>('titre');
  readonly prop1Type = signal<'string' | 'number' | 'boolean'>('string');
  readonly prop2Name = signal<string>('prix');
  readonly prop2Type = signal<'string' | 'number' | 'boolean'>('number');

  readonly codeCopie = signal<boolean>(false);
  readonly factoryError = signal<string | null>(null);

  // Formulaire d'ajout
  readonly newRecordId = signal<string>('1');
  readonly newRecordProp1 = signal<string>('Elden Ring');
  readonly newRecordProp2 = signal<string>('59.99');

  // Données de l'entité
  readonly records = signal<CustomEntityRecord[]>([
    { id: 1, titre: 'Elden Ring', prix: 59.99 },
    { id: 2, titre: 'Hollow Knight', prix: 14.99 }
  ]);

  readonly generatedCode = computed(() => {
    const e = this.entityName();
    const idT = this.idType();
    const p1 = this.prop1Name();
    const t1 = this.prop1Type();
    const p2 = this.prop2Name();
    const t2 = this.prop2Type();

    return `// 1. Entité ${e} qui honore le contrat Identifiable
export class ${e} implements Identifiable {
  constructor(
    public readonly id: ${idT},
    public readonly ${p1}: ${t1},
    public ${p2}: ${t2}
  ) {}
}

// 2. Service injectable spécialisé (Hérite de tout le CRUD sans aucune réécriture !)
@Injectable({ providedIn: 'root' })
export class ${e}Service extends Repository<${e}> {
  // Vos règles métier spécifiques à ${e} ici :
}

// 3. Consommation dans vos composants :
export class ${e}Component {
  protected readonly ${e.toLowerCase()}Service = inject(${e}Service);
}`;
  });

  onEntityNameInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value.trim();
    if (val) this.entityName.set(val);
  }

  onProp1Input(e: Event): void {
    const val = (e.target as HTMLInputElement).value.trim();
    if (val) this.prop1Name.set(val);
  }

  onProp2Input(e: Event): void {
    const val = (e.target as HTMLInputElement).value.trim();
    if (val) this.prop2Name.set(val);
  }

  onProp1TypeChange(e: Event): void {
    this.prop1Type.set((e.target as HTMLSelectElement).value as any);
  }

  onProp2TypeChange(e: Event): void {
    this.prop2Type.set((e.target as HTMLSelectElement).value as any);
  }

  onRecordIdInput(e: Event): void {
    this.newRecordId.set((e.target as HTMLInputElement).value);
  }

  onRecordProp1Input(e: Event): void {
    this.newRecordProp1.set((e.target as HTMLInputElement).value);
  }

  onRecordProp2Input(e: Event): void {
    this.newRecordProp2.set((e.target as HTMLInputElement).value);
  }

  ajouterRecord(): void {
    const rawId = this.newRecordId().trim();
    const val1 = this.newRecordProp1().trim();
    const val2 = this.newRecordProp2().trim();

    if (!rawId) {
      this.factoryError.set("L'identifiant est obligatoire.");
      return;
    }

    const id = this.idType() === 'number' ? Number(rawId) : rawId;
    if (this.idType() === 'number' && isNaN(id as number)) {
      this.factoryError.set("L'id doit être un nombre valide.");
      return;
    }

    // Unicité
    if (this.records().some(r => r.id === id)) {
      this.factoryError.set(`L'id ${id} existe déjà dans le Repository !`);
      return;
    }

    const p1Parsed = this.prop1Type() === 'number' ? Number(val1) : (this.prop1Type() === 'boolean' ? val1 === 'true' : val1);
    const p2Parsed = this.prop2Type() === 'number' ? Number(val2) : (this.prop2Type() === 'boolean' ? val2 === 'true' : val2);

    const newObj: CustomEntityRecord = {
      id,
      [this.prop1Name()]: p1Parsed,
      [this.prop2Name()]: p2Parsed
    };

    this.records.update(list => [...list, newObj]);
    this.factoryError.set(null);

    if (this.idType() === 'number') {
      this.newRecordId.set(String(Number(id) + 1));
    }
    this.newRecordProp1.set('');
    this.newRecordProp2.set('');
  }

  supprimerRecord(id: number | string): void {
    this.records.update(list => list.filter(r => r.id !== id));
  }

  copierCode(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.generatedCode());
      this.codeCopie.set(true);
      setTimeout(() => this.codeCopie.set(false), 2000);
    }
  }
}
