import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import Dexie from 'dexie';

interface ContactRecord {
  id: string;
  nomComplet?: string;
  nom?: string;
  prenom?: string;
  actif?: boolean;
}

@Component({
  selector: 'app-schema-migrations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 06 · ÉVOLUTION DE SCHÉMA SANS PERTE DE DONNÉES</div>
        <h2>Migrations de Schéma (.version() &amp; .upgrade())</h2>
        <p class="module-desc">
          Faire évoluer une application déployée chez des milliers d'utilisateurs sans jamais détruire leurs données locales.
          Maîtriser l'empilement incrémental des versions, la transformation en place avec <code>.upgrade()</code>,
          et les 4 règles d'or des migrations Dexie.js.
        </p>
      </div>

      <!-- Simulateur de Mise à Jour en Production -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">🚀 Simulateur de Déploiement en Production : Migration v1 ➔ v2</div>
          <span class="badge badge-ts">Transformation en Direct</span>
        </div>

        <p class="p-lead">
          La base de vos utilisateurs est actuellement en <strong>Version 1</strong>. Chaque contact possède un <code>nomComplet</code>.
          Déclenchez la mise à jour pour scinder les noms en <code>prenom</code> et <code>nom</code> :
        </p>

        <div class="migration-controls-bar">
          <button 
            class="btn-primary" 
            (click)="defragmenterMigration()" 
            [disabled]="currentVersion() === 2 || isMigrating()"
          >
            {{ isMigrating() ? 'Migration en cours...' : currentVersion() === 2 ? 'Base déjà en v2 ✅' : '🚀 Déployer la v2 (.upgrade)' }}
          </button>
          <button class="btn-ghost" (click)="reinitialiserEnV1()" [disabled]="isMigrating()">
            Réinitialiser en v1
          </button>
          <div class="version-indicator">
            <span>Version de la base :</span>
            <span class="badge badge-purple">v{{ currentVersion() }}</span>
          </div>
        </div>

        <!-- Tableau comparatif des données physiques -->
        <div class="records-table-container">
          <table class="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                @if (currentVersion() === 1) {
                  <th>nomComplet (v1)</th>
                } @else {
                  <th>Prénom (v2)</th>
                  <th>Nom (v2)</th>
                  <th>Actif (Défaut v2)</th>
                }
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (contact of contacts(); track contact.id) {
                <tr>
                  <td><code>{{ contact.id }}</code></td>
                  @if (currentVersion() === 1) {
                    <td><span class="val-v1">{{ contact.nomComplet }}</span></td>
                  } @else {
                    <td><span class="val-v2">{{ contact.prenom }}</span></td>
                    <td><span class="val-v2 font-bold">{{ contact.nom }}</span></td>
                    <td><span class="badge badge-success">{{ contact.actif ? 'Actif' : 'Inactif' }}</span></td>
                  }
                  <td>
                    <span class="status-pill" [class.migrated]="currentVersion() === 2">
                      {{ currentVersion() === 2 ? 'Migré avec succès' : 'Ancien schéma v1' }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (migrationSummary()) {
          <div class="migration-log-box">
            <div class="log-title">📋 Rapport de Migration Dexie :</div>
            <code>{{ migrationSummary() }}</code>
          </div>
        }
      </div>

      <!-- Les 4 Règles d'Or des Migrations -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">💎 Les 4 Règles d'Or des Migrations Dexie</div>
          <span class="badge badge-warning">Sécurité de Déploiement</span>
        </div>

        <div class="golden-rules-grid">
          <div class="rule-card">
            <div class="rule-num">01</div>
            <h4>Ne JAMAIS Modifier version(1)</h4>
            <p>
              Les bases déjà déployées chez vos clients ne ré-exécutent pas une version passée.
              Toute modification rétroactive brise le déterminisme de la migration.
            </p>
          </div>

          <div class="rule-card">
            <div class="rule-num">02</div>
            <h4>Entiers Séquentiels Stricts</h4>
            <p>
              Utilisez des entiers strictement croissants : <code>version(1)</code>, <code>version(2)</code>,
              <code>version(3)</code>. Les décimales (1.1, 2.0.1) sont formellement proscrites.
            </p>
          </div>

          <div class="rule-card">
            <div class="rule-num">03</div>
            <h4>Initialiser les Nouveaux Champs</h4>
            <p>
              Si vous ajoutez un champ obligatoire dans votre classe TypeScript, initialisez-le
              dans <code>.upgrade()</code> avec une valeur de repli pour ne pas casser <code>fromDTO()</code>.
            </p>
          </div>

          <div class="rule-card">
            <div class="rule-num">04</div>
            <h4>Supprimer un Store via null</h4>
            <p>
              Pour purger un Object Store devenu obsolète et libérer le disque,
              assignez-lui explicitement <code>null</code> dans le schéma : <code>&#123; archives: null &#125;</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .migration-controls-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 14px;
      flex-wrap: wrap;

      .version-indicator {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82rem;
      }
    }

    .records-table-container {
      margin-top: 16px;
      overflow-x: auto;
      border: 1px solid var(--border-color);
      border-radius: 8px;
    }

    .styled-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      text-align: left;

      th {
        padding: 10px 14px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-color);
        color: var(--text-muted);
        font-weight: 600;
      }

      td {
        padding: 10px 14px;
        border-bottom: 1px solid var(--border-color);
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      .val-v1 {
        color: #f59e0b;
        font-family: var(--font-mono);
      }

      .val-v2 {
        color: #60a5fa;
        font-family: var(--font-mono);
      }

      .status-pill {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 0.72rem;
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;

        &.migrated {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }
      }
    }

    .migration-log-box {
      margin-top: 14px;
      padding: 12px;
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.75rem;

      .log-title {
        font-weight: 700;
        color: #10b981;
        margin-bottom: 4px;
      }

      code {
        color: #93c5fd;
        display: block;
        line-height: 1.4;
      }
    }

    .golden-rules-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 14px;

      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .rule-card {
      padding: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;

      .rule-num {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: #f59e0b;
        font-weight: 800;
        font-family: var(--font-mono);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        margin-bottom: 10px;
      }

      h4 { font-size: 0.9rem; margin-bottom: 6px; }
      p { font-size: 0.75rem; color: var(--text-dim); line-height: 1.4; }
    }
  `]
})
export class SchemaMigrationsComponent {
  readonly currentVersion = signal<number>(1);
  readonly isMigrating = signal<boolean>(false);
  readonly migrationSummary = signal<string | null>(null);

  readonly initialContacts: ContactRecord[] = [
    { id: 'c1', nomComplet: 'Jean Dupont' },
    { id: 'c2', nomComplet: 'Marie Curie' },
    { id: 'c3', nomComplet: 'Alan Turing' },
    { id: 'c4', nomComplet: 'Ada Lovelace' }
  ];

  readonly contacts = signal<ContactRecord[]>(this.initialContacts);

  async defragmenterMigration(): Promise<void> {
    this.isMigrating.set(true);

    // Simulation visuelle de la migration v1 -> v2
    await new Promise(r => setTimeout(r, 600));

    const transformed: ContactRecord[] = this.contacts().map(c => {
      const parts = (c.nomComplet || '').split(' ');
      const prenom = parts[0] || '';
      const nom = parts.slice(1).join(' ') || '';
      return {
        id: c.id,
        prenom,
        nom,
        actif: true
      };
    });

    this.contacts.set(transformed);
    this.currentVersion.set(2);
    this.isMigrating.set(false);
    this.migrationSummary.set(
      `version(2).upgrade() exécuté avec succès : 4 enregistrements transformés sans aucune perte de données.`
    );
  }

  reinitialiserEnV1(): void {
    this.contacts.set(this.initialContacts);
    this.currentVersion.set(1);
    this.migrationSummary.set(null);
  }
}
