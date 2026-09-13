import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-bindings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Liaisons de Données — Synchronisation Vue & Modèle</div>
        <h2>5. Bac à Sable des Liaisons de Données (Template Bindings)</h2>
        <p class="module-desc">
          Angular synchronise dynamiquement l'état de votre classe TypeScript et votre vue HTML grâce à 
          trois formes élémentaires de liaisons. Expérimentez chacune d'elles en direct dans ce bac à sable synchronisé :
          <strong>Interpolation</strong> <code>{{ '{{ expression }}' }}</code>, <strong>Liaison de Propriété</strong> <code>[propriété]="valeur"</code> 
          et <strong>Liaison d'Événement</strong> <code>(événement)="méthode()"</code>.
        </p>
      </div>

      <!-- Contrôles du Bac à Sable -->
      <div class="sandbox-controls-grid">
        <!-- Carte 1 : Interpolation -->
        <div class="card-panel binding-ctrl-card">
          <div class="ctrl-card-header">
            <span class="badge badge-ts">1. Interpolation</span>
            <code>{{ '{{ expression }}' }}</code>
          </div>
          <p class="ctrl-desc">Injecte une expression TypeScript évaluée sous forme de texte dans le DOM.</p>

          <div class="input-field-group">
            <label>Nom de l'étudiant (<code>studentName</code>) :</label>
            <input type="text" [ngModel]="studentName()" (ngModelChange)="studentName.set($event)" class="ctrl-input" />
          </div>

          <div class="input-field-group">
            <label>Intitulé du cours (<code>courseName</code>) :</label>
            <input type="text" [ngModel]="courseName()" (ngModelChange)="courseName.set($event)" class="ctrl-input" />
          </div>
        </div>

        <!-- Carte 2 : Property Binding -->
        <div class="card-panel binding-ctrl-card">
          <div class="ctrl-card-header">
            <span class="badge badge-purple">2. Property Binding</span>
            <code>[propriété]="valeur"</code>
          </div>
          <p class="ctrl-desc">Lie une valeur TypeScript à une propriété d'élément HTML du DOM.</p>

          <div class="toggle-row">
            <span>Bouton désactivé (<code>isButtonDisabled</code>) :</span>
            <button 
              class="toggle-btn" 
              [class.active]="isButtonDisabled()"
              (click)="isButtonDisabled.update(v => !v)"
            >
              {{ isButtonDisabled() ? 'true (Désactivé)' : 'false (Actif)' }}
            </button>
          </div>

          <div class="toggle-row">
            <span>Statut du cours (<code>isOnline</code>) :</span>
            <button 
              class="toggle-btn" 
              [class.active]="isOnline()"
              (click)="isOnline.update(v => !v)"
            >
              {{ isOnline() ? 'true (En direct)' : 'false (Hors ligne)' }}
            </button>
          </div>

          <div class="input-field-group">
            <label>URL de l'image (<code>avatarUrl</code>) :</label>
            <select [ngModel]="avatarUrl()" (ngModelChange)="avatarUrl.set($event)" class="ctrl-select">
              <option value="https://api.dicebear.com/7.x/bottts/svg?seed=Angular">Robot Angular</option>
              <option value="https://api.dicebear.com/7.x/bottts/svg?seed=TypeScript">Robot TypeScript</option>
              <option value="https://api.dicebear.com/7.x/bottts/svg?seed=EAFC">Robot EAFC</option>
            </select>
          </div>
        </div>

        <!-- Carte 3 : Event Binding -->
        <div class="card-panel binding-ctrl-card">
          <div class="ctrl-card-header">
            <span class="badge badge-warning">3. Event Binding</span>
            <code>(événement)="méthode()"</code>
          </div>
          <p class="ctrl-desc">Écoute les événements déclenchés par l'utilisateur pour appeler la classe.</p>

          <div class="actions-row">
            <button class="btn-primary btn-sm" (click)="incrementCounter()">
              🖱️ (click)="increment()"
            </button>
            <button class="btn-secondary btn-sm" (click)="resetCounter()" [disabled]="clickCount() === 0">
              ↺ (click)="resetCounter()"
            </button>
          </div>

          <div class="event-journal-box">
            <div class="journal-title">Dernière interaction capturée :</div>
            <div class="journal-entry">{{ lastAction() }}</div>
          </div>
        </div>
      </div>

      <!-- Synchronisation Triple : TS <-> Template HTML <-> Rendu Navigateur -->
      <div class="triple-sync-grid">
        <!-- Colonne 1 : État TypeScript en temps réel -->
        <div class="card-panel sync-col">
          <div class="sync-col-header">
            <span class="col-icon">🔷</span>
            <span>1. État de la Classe TypeScript</span>
          </div>
          <pre class="sync-code-box"><code>export class AppComponent &#123;
  // Propriétés réactives
  courseName: string = '{{ courseName() }}';
  studentName: string = '{{ studentName() }}';
  isButtonDisabled: boolean = {{ isButtonDisabled() }};
  isOnline: boolean = {{ isOnline() }};
  avatarUrl: string = '...';
  clickCount: number = {{ clickCount() }};

  // Méthodes
  increment(): void &#123;
    this.clickCount++;
  &#125;

  resetCounter(): void &#123;
    this.clickCount = 0;
  &#125;
&#125;</code></pre>
        </div>

        <!-- Colonne 2 : Template HTML avec surbrillance -->
        <div class="card-panel sync-col">
          <div class="sync-col-header">
            <span class="col-icon">🌐</span>
            <span>2. Template HTML avec Bindings</span>
          </div>
          <pre class="sync-code-box html-bindings"><code>{{ sampleHtmlSnippet }}</code></pre>
        </div>

        <!-- Colonne 3 : Rendu en Direct (Live DOM) -->
        <div class="card-panel sync-col preview-col">
          <div class="sync-col-header">
            <span class="col-icon">🖥️</span>
            <span>3. Rendu Réel dans le DOM</span>
          </div>

          <div class="live-card-render">
            <div class="render-header">
              <img [src]="avatarUrl()" alt="Avatar" class="render-avatar" width="46" height="46" />
              <div>
                <h2>Cours de {{ courseName() }}</h2>
                <div class="sub-render">Étudiant : <strong>{{ studentName() }}</strong></div>
              </div>
            </div>

            <div class="render-status">
              Statut du cours : 
              <span class="status-badge" [class.badge-online]="isOnline()" [class.badge-offline]="!isOnline()">
                {{ isOnline() ? '🟢 En direct' : '🔴 Hors ligne' }}
              </span>
            </div>

            <div class="render-counter-section">
              <h4>Nombre de clics enregistrés : <span class="counter-display">{{ clickCount() }}</span></h4>
              <div class="render-buttons">
                <button class="btn-primary btn-sm" (click)="incrementCounter()">
                  ➕ Compter (+1)
                </button>
                <button class="btn-secondary btn-sm" (click)="resetCounter()" [disabled]="isButtonDisabled() || clickCount() === 0">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sandbox-controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }

    .binding-ctrl-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .ctrl-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      code {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: #f87171;
        font-weight: 700;
      }
    }

    .ctrl-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .input-field-group {
      display: flex;
      flex-direction: column;
      gap: 4px;

      label {
        font-size: 0.76rem;
        font-weight: 600;
        color: var(--text-dim);
      }
    }

    .ctrl-input, .ctrl-select {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      padding: 7px 10px;
      border-radius: 6px;
      color: var(--text-main);
      font-size: 0.82rem;

      &:focus {
        border-color: #dd0031;
        outline: none;
      }
    }

    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .toggle-btn {
      padding: 4px 10px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-dim);

      &.active {
        background: #dd0031;
        color: #ffffff;
        border-color: #dd0031;
      }
    }

    .actions-row {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.78rem;
    }

    .event-journal-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 0.75rem;

      .journal-title {
        font-weight: 700;
        color: var(--text-dim);
        margin-bottom: 2px;
      }

      .journal-entry {
        font-family: var(--font-mono);
        color: #38bdf8;
      }
    }

    /* Triple Sync Grid */
    .triple-sync-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      min-height: 400px;
    }

    .sync-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .sync-col-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-main);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;
    }

    .sync-code-box {
      background: var(--terminal-bg, #0b0f19);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      margin: 0;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: #e2e8f0;
      line-height: 1.5;
      flex: 1;
      overflow-x: auto;
    }

    .hl-inter {
      color: #fbbf24;
      font-weight: 700;
      background: rgba(245, 158, 11, 0.15);
      padding: 0 4px;
      border-radius: 3px;
    }

    .hl-prop {
      color: #c084fc;
      font-weight: 700;
      background: rgba(192, 132, 252, 0.15);
      padding: 0 4px;
      border-radius: 3px;
    }

    .hl-event {
      color: #f87171;
      font-weight: 700;
      background: rgba(248, 113, 113, 0.15);
      padding: 0 4px;
      border-radius: 3px;
    }

    /* Live Card Render */
    .live-card-render {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      box-shadow: var(--shadow-sm);
      flex: 1;
    }

    .render-header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;

      .render-avatar {
        border-radius: 8px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
      }

      h2 { margin: 0; font-size: 1rem; color: var(--text-main); font-weight: 800; }
      .sub-render { font-size: 0.8rem; color: var(--text-muted); }
    }

    .render-status {
      font-size: 0.85rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;

      .status-badge {
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 0.75rem;

        &.badge-online { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        &.badge-offline { background: rgba(239, 68, 68, 0.15); color: #f87171; }
      }
    }

    .render-counter-section {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      h4 { margin: 0; font-size: 0.85rem; color: var(--text-main); }
      .counter-display { font-size: 1.1rem; color: #dd0031; font-weight: 800; }

      .render-buttons {
        display: flex;
        gap: 8px;
      }
    }
  `]
})
export class TemplateBindingsComponent {
  readonly sampleHtmlSnippet = `<div class="card">
  <!-- 1. Interpolation -->
  <h1>Cours de {{ courseName }}</h1>
  <p>Étudiant : <strong>{{ studentName }}</strong></p>

  <!-- 2. Property Binding -->
  <img [src]="avatarUrl" width="48" />
  <p>Statut : 
    <span [class.online]="isOnline">
      {{ isOnline ? 'En direct' : 'Hors ligne' }}
    </span>
  </p>

  <!-- 3. Event & Property Binding -->
  <h3>Clics : {{ clickCount }}</h3>
  <button (click)="increment()">Compter</button>
  <button (click)="resetCounter()" [disabled]="isButtonDisabled">
    Valider
  </button>
</div>`;

  readonly courseName = signal<string>('Programmation Orientée Objet');
  readonly studentName = signal<string>('Jean Dupont');
  readonly isButtonDisabled = signal<boolean>(false);
  readonly isOnline = signal<boolean>(true);
  readonly avatarUrl = signal<string>('https://api.dicebear.com/7.x/bottts/svg?seed=Angular');
  readonly clickCount = signal<number>(0);
  readonly lastAction = signal<string>('En attente d\'une action utilisateur');

  incrementCounter(): void {
    this.clickCount.update(c => c + 1);
    this.lastAction.set(`(click)="increment()" -> clickCount vaut maintenant ${this.clickCount()}`);
  }

  resetCounter(): void {
    this.clickCount.set(0);
    this.lastAction.set(`(click)="resetCounter()" -> clickCount remis à 0`);
  }
}
