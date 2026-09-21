import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-instance-vs-static-inspector',
  standalone: true,
  imports: [FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 04 · STATIC &amp; THIS</div>
        <h2>Mémoire d'Instance vs Mémoire de Classe (static)</h2>
        <p class="module-desc">
          Les membres d'instance sont dupliqués pour chaque objet créé avec <code>new</code> et manipulés via <code>this</code>. Les membres statiques n'existent qu'en <strong>un seul exemplaire</strong> pour toute l'application et sont rattachés à la classe.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🔍 L'Inspecteur Instance vs Static</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 5 · Static &amp; Scope de this)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="inspector-layout">
          <!-- Haut : Tableau comparatif synthétique -->
          <div class="card-panel comparison-summary">
            <div class="comp-col instance-box">
              <div class="box-badge">🏡 MEMBRES D'INSTANCE (this)</div>
              <div class="box-stats">Exemplaires : <strong>{{ accounts().length }}</strong> (autant que d'objets)</div>
              <p>Variables propres à chaque maison : <code>this.numero</code>, <code>this.solde</code>.</p>
            </div>

            <div class="comp-col static-box">
              <div class="box-badge">📐 MEMBRES DE CLASSE (static)</div>
              <div class="box-stats">Exemplaire : <strong>1 SEUL</strong> partagé par tout le programme</div>
              <p>Constantes et utilitaires : <code>Compte.tauxEpargne</code>, <code>Compte.totalCrees</code>.</p>
            </div>
          </div>

          <div class="inspector-main-grid">
            <!-- Colonne Gauche : Mémoire Statique (Bureau d'études) -->
            <div class="card-panel static-hub-panel">
              <div class="hub-header">
                <div class="hub-icon">📐</div>
                <div>
                  <h3>Bureau d'études (Mémoire Statique)</h3>
                  <span class="hub-sub">Rattaché à la classe CompteBancaire</span>
                </div>
              </div>

              <!-- Régulateur de Taux Statique -->
              <div class="static-param-card">
                <div class="param-top">
                  <span class="param-name">CompteBancaire.tauxEpargne :</span>
                  <span class="param-val">{{ (tauxEpargne() * 100).toFixed(1) }} %</span>
                </div>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.08" 
                  step="0.005" 
                  [ngModel]="tauxEpargne()" 
                  (ngModelChange)="updateTaux($event)" 
                  class="taux-slider"
                />
                <span class="param-hint">Glissez le curseur : ce taux unique s'applique instantanément au calcul d'intérêts de TOUS les comptes !</span>
              </div>

              <!-- Total Comptes Créés -->
              <div class="static-stat-card">
                <span class="stat-name">CompteBancaire.totalComptesCrees :</span>
                <span class="stat-val">{{ accounts().length }}</span>
              </div>

              <!-- Crash-Test : Tenter d'utiliser this en static -->
              <div class="this-violation-test" [class.has-error]="tryThisInStatic()">
                <div class="test-header">
                  <span>Expérience : Accéder à <code>this.solde</code> en méthode statique</span>
                  <label class="switch">
                    <input type="checkbox" [checked]="tryThisInStatic()" (change)="toggleThisTest()" />
                    <span class="slider"></span>
                  </label>
                </div>

                @if (tryThisInStatic()) {
                  <div class="ts-error-box">
                    <div class="ts-error-code">❌ TS2334: 'this' cannot be referenced in a static method.</div>
                    <div class="ts-error-exp">
                      <strong>Explication physique :</strong><br>
                      Quand on appelle <code>CompteBancaire.afficherSolde()</code>, on se trouve sur le plan au bureau de l'architecte. Aucune maison n'est sélectionnée en mémoire vive ! Demander d'allumer la lumière du salon n'a aucun sens car le processeur ne sait pas quelle maison viser.
                    </div>
                  </div>
                } @else {
                  <div class="ts-ok-box">
                    Code TypeScript légitime : <code>static reglement(): void &#123; ... &#125;</code> n'utilise pas <code>this</code>.
                  </div>
                }
              </div>
            </div>

            <!-- Colonne Droite : Les Instances Réelles (Maison 1 et Maison 2) -->
            <div class="card-panel instances-col">
              <div class="instances-header">
                <h3>Les Objets en Mémoire Vive (this = instance courante)</h3>
                <button class="btn-secondary" (click)="addAccount()">+ Créer une instance (new)</button>
              </div>

              <div class="accounts-list">
                @for (acc of accounts(); track acc.id; let idx = $index) {
                  <div class="account-card card-panel">
                    <div class="acc-top">
                      <div class="acc-name-row">
                        <span class="acc-var-label">Variable <code>c{{ idx + 1 }}</code></span>
                        <span class="acc-num">{{ acc.numero }}</span>
                      </div>
                      <span class="acc-addr">{{ acc.address }}</span>
                    </div>

                    <div class="acc-data-grid">
                      <div class="data-item">
                        <span class="d-label">this._solde (propre) :</span>
                        <span class="d-val">{{ acc.solde }} €</span>
                      </div>
                      <div class="data-item">
                        <span class="d-label">Intérêts annuels (calculés avec static) :</span>
                        <span class="d-val-highlight">{{ (acc.solde * tauxEpargne()).toFixed(2) }} €</span>
                      </div>
                    </div>

                    <div class="acc-actions-row">
                      <button class="btn-secondary btn-sm" (click)="modifySolde(acc.id, 100)">c{{ idx + 1 }}.deposer(100)</button>
                      <button class="btn-secondary btn-sm" (click)="modifySolde(acc.id, -100)">c{{ idx + 1 }}.retirer(100)</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="5"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .inspector-layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comparison-summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 14px 20px;
    }

    .comp-col {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 14px;
      border-radius: 8px;

      .box-badge {
        font-size: 0.74rem;
        font-weight: 800;
        letter-spacing: 0.05em;
      }

      .box-stats {
        font-size: 0.85rem;
        color: var(--text-main);
        strong { font-family: var(--font-mono); }
      }

      p {
        font-size: 0.78rem;
        color: var(--text-muted);
        code { font-family: var(--font-mono); color: var(--text-main); }
      }

      &.instance-box {
        background: rgba(59, 130, 246, 0.06);
        border: 1px solid rgba(59, 130, 246, 0.25);
        .box-badge { color: #60a5fa; }
      }

      &.static-box {
        background: rgba(147, 51, 234, 0.06);
        border: 1px solid rgba(147, 51, 234, 0.25);
        .box-badge { color: #c084fc; }
      }
    }

    .inspector-main-grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 20px;
    }

    .static-hub-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: rgba(147, 51, 234, 0.03);
      border-color: rgba(147, 51, 234, 0.35);

      .hub-header {
        display: flex;
        align-items: center;
        gap: 12px;

        .hub-icon { font-size: 1.8rem; }
        h3 { font-size: 1.05rem; color: #c084fc; font-weight: 700; }
        .hub-sub { font-size: 0.72rem; color: var(--text-muted); }
      }
    }

    .static-param-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .param-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .param-name { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); }
        .param-val { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: #c084fc; }
      }

      .taux-slider {
        width: 100%;
        accent-color: #9333ea;
        cursor: pointer;
      }

      .param-hint {
        font-size: 0.74rem;
        color: var(--text-dim);
        line-height: 1.35;
      }
    }

    .static-stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .stat-name { font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); }
      .stat-val { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: #38bdf8; }
    }

    .this-violation-test {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.has-error {
        border-color: rgba(239, 68, 68, 0.5);
      }

      .test-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-main);
      }
    }

    .ts-error-box {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 6px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .ts-error-code {
        font-family: var(--font-mono);
        font-size: 0.76rem;
        color: #f87171;
        font-weight: 700;
      }

      .ts-error-exp {
        font-size: 0.78rem;
        color: #fca5a5;
        line-height: 1.4;
      }
    }

    .ts-ok-box {
      font-size: 0.78rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 8px;
      border-radius: 6px;
    }

    /* Switch stylé */
    .switch {
      position: relative;
      display: inline-block;
      width: 38px;
      height: 20px;

      input { opacity: 0; width: 0; height: 0; }

      .slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: var(--bg-subtle);
        border: 1px solid var(--border-color);
        transition: .3s;
        border-radius: 20px;

        &:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 2px;
          bottom: 2px;
          background-color: #ffffff;
          transition: .3s;
          border-radius: 50%;
        }
      }

      input:checked + .slider {
        background-color: #ef4444;
      }

      input:checked + .slider:before {
        transform: translateX(18px);
      }
    }

    .instances-col {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .instances-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 { font-size: 1.05rem; color: var(--text-main); font-weight: 700; }
      }
    }

    .accounts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .account-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-left: 4px solid #3b82f6;

      .acc-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .acc-name-row {
          display: flex;
          align-items: center;
          gap: 8px;

          .acc-var-label { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
          .acc-num { font-size: 0.76rem; color: var(--text-muted); font-family: var(--font-mono); }
        }

        .acc-addr { font-family: var(--font-mono); font-size: 0.72rem; color: #c084fc; }
      }

      .acc-data-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        background: var(--bg-subtle);
        padding: 8px 12px;
        border-radius: 6px;

        .data-item {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .d-label { font-size: 0.72rem; color: var(--text-muted); }
          .d-val { font-size: 0.95rem; font-weight: 700; color: #10b981; font-family: var(--font-mono); }
          .d-val-highlight { font-size: 0.95rem; font-weight: 700; color: #38bdf8; font-family: var(--font-mono); }
        }
      }

      .acc-actions-row {
        display: flex;
        gap: 8px;
        .btn-sm { padding: 4px 10px; font-size: 0.76rem; font-family: var(--font-mono); }
      }
    }
  `]
})
export class InstanceVsStaticInspectorComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly tauxEpargne = signal<number>(0.03);
  readonly tryThisInStatic = signal<boolean>(false);

  readonly accounts = signal([
    { id: '1', address: '0x1A4F', numero: 'BE-100', solde: 1000 },
    { id: '2', address: '0x2B5E', numero: 'BE-200', solde: 2500 }
  ]);

  updateTaux(val: number): void {
    this.tauxEpargne.set(Number(val));
  }

  toggleThisTest(): void {
    this.tryThisInStatic.update(v => !v);
  }

  modifySolde(id: string, delta: number): void {
    this.accounts.update(list => list.map(a => {
      if (a.id === id) {
        return { ...a, solde: Math.max(0, a.solde + delta) };
      }
      return a;
    }));
  }

  addAccount(): void {
    const nextIdx = this.accounts().length + 1;
    const hex = '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    this.accounts.update(list => [
      ...list,
      {
        id: Date.now().toString(),
        address: hex,
        numero: `BE-${nextIdx}00`,
        solde: 500
      }
    ]);
  }
}
