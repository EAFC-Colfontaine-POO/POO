import { Component, signal, Signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-oop-encapsulation',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 13 · Module 05</span>
          <span class="badge badge-purple">Encapsulation POO</span>
          <span class="badge badge-blue">Private Source, Public Readonly</span>
          <span class="badge badge-warning">Protection d'Invariants</span>
        </div>
        <h2>Encapsulation POO : Le Motif Private Source, Public Readonly</h2>
        <p class="module-desc">
          Rappel fondamental de la Séance 05 : un objet doit être le maître absolu de ses données internes. Découvrez comment sceller un signal d'état avec <code>asReadonly()</code> et canaliser toutes les mutations via des commandes métier validant les invariants.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Le Coffre-Fort de l'État
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 4 · 4 Défis)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="encapsulation-workbench">

          <!-- 1. LE SCHÉMA ARCHITECTURAL DU COFFRE-FORT -->
          <div class="card-panel vault-card">
            <div class="card-head-row">
              <div class="badge-title">
                <span class="badge badge-purple">Architecture Sécurisée</span>
                <h3>Le Coffre-Fort de l'État : Classe CompteBancaire</h3>
              </div>
              <span class="badge badge-success">Encapsulation Inviolable</span>
            </div>

            <div class="vault-grid mt-3">
              <!-- Cœur de la classe (Intérieur du Coffre) -->
              <div class="vault-box inside-vault">
                <div class="vault-tag">🏰 CŒUR DE LA CLASSE (PRIVATE)</div>
                <div class="code-zone">
                  <pre><code>// 1. Source de vérité STRICTEMENT PRIVÉE :
private readonly _solde = signal&lt;number&gt;({{ soldeActuel() }});

// 2. Vue publique scellée en lecture seule :
public readonly solde: Signal&lt;number&gt; = 
  this._solde.asReadonly();</code></pre>
                </div>

                <div class="vault-inner-status mt-2">
                  <span class="val-lbl">Case mémoire protégée :</span>
                  <span class="val-money font-mono">{{ soldeActuel() }} €</span>
                </div>
              </div>

              <!-- Barrière de Sécurité -->
              <div class="security-barrier">
                <div class="shield-icon">🛡️</div>
                <div class="shield-label">Barrière asReadonly()</div>
                <div class="shield-desc">TypeScript refuse .set() et .update()</div>
              </div>

              <!-- Monde Extérieur / Template -->
              <div class="vault-box outside-vault">
                <div class="vault-tag">🌐 MONDE EXTÉRIEUR / TEMPLATE (PUBLIC)</div>
                <div class="code-zone">
                  <pre><code>// ✅ Lecture libre de l'état :
&lt;p&gt;Solde : {{ '{{ compte.solde() }}' }} €&lt;/p&gt;

// ❌ Tentative d'écriture externe :
// compte.solde.set(-99999);
// ➔ ERREUR DE COMPILATION !</code></pre>
                </div>

                <div class="ext-attempt mt-2">
                  <button class="btn-secondary btn-sm btn-hack" (click)="simulateHackAttempt()">
                    ⚡ Tenter compte.solde.set(0)
                  </button>
                  @if (hackBlocked()) {
                    <div class="hack-alert mt-2">
                      🛑 <strong>Rejeté par TypeScript !</strong> La propriété 'set' n'existe pas sur le type 'Signal&lt;number&gt;'.
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- 2. PANNEAU DES COMMANDES MÉTIER AVEC CONTRÔLE D'INVARIANTS -->
          <div class="card-panel actions-card mt-3">
            <div class="card-head-row">
              <div class="badge-title">
                <span class="badge badge-blue">Commandes Métier</span>
                <h3>Passer par les Méthodes d'Affaires : deposer() & retirer()</h3>
              </div>
            </div>

            <p class="text-muted" style="font-size: 0.85rem;">
              Pour modifier l'état, l'extérieur doit impérativement invoquer une commande métier. La méthode vérifie les invariants (Séance 05) et lève une exception typée (Séance 10) si la règle est enfreinte.
            </p>

            <div class="operations-grid mt-3">
              <!-- Opération Dépôt -->
              <div class="operation-panel">
                <div class="op-title">1. Dépôt de Fonds (deposer)</div>
                <div class="input-row mt-2">
                  <input type="number" [value]="depotAmount()" (input)="onDepotInput($event)" class="op-input" />
                  <span class="unit">€</span>
                  <button class="btn-primary btn-sm" (click)="executeDeposer()">
                    deposer({{ depotAmount() }} €)
                  </button>
                </div>
                <div class="op-rule mt-2">Invariant : montant &gt; 0 requis.</div>
              </div>

              <!-- Opération Retrait -->
              <div class="operation-panel">
                <div class="op-title">2. Retrait de Fonds (retirer)</div>
                <div class="input-row mt-2">
                  <input type="number" [value]="retraitAmount()" (input)="onRetraitInput($event)" class="op-input" />
                  <span class="unit">€</span>
                  <button class="btn-secondary btn-sm" (click)="executeRetirer()">
                    retirer({{ retraitAmount() }} €)
                  </button>
                </div>
                <div class="op-rule mt-2">Invariant : montant &gt; 0 et pas de découvert (solde - m &gt;= 0).</div>
              </div>
            </div>

            <!-- Journal des transactions et exceptions -->
            <div class="transaction-audit-panel mt-3">
              <div class="audit-head">
                <span>Journal d'Audit des Invariants Métier</span>
                <button class="btn-ghost btn-xs" (click)="auditLogs.set([])">Effacer</button>
              </div>
              <div class="audit-lines">
                @if (auditLogs().length === 0) {
                  <span class="dim">Effectuez des opérations pour observer la validation des invariants...</span>
                } @else {
                  @for (log of auditLogs(); track $index) {
                    <div class="log-entry" [class.success]="log.type === 'ok'" [class.error]="log.type === 'err'">
                      <span class="log-badge">{{ log.type === 'ok' ? '✔ SUCCÈS' : '✖ REJET INVARIANT' }}</span>
                      <span class="log-txt">{{ log.text }}</span>
                    </div>
                  }
                }
              </div>
            </div>
          </div>

        </div>
      } @else {
        <!-- Mode Exercices : Labo 4 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="4"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .encapsulation-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .vault-card, .actions-card {
      padding: 20px;
    }

    .card-head-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 10px;

      h3 {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
        margin-top: 4px;
      }
    }

    .vault-grid {
      display: grid;
      grid-template-columns: 1fr 180px 1fr;
      gap: 14px;
      align-items: center;

      @media (max-width: 1050px) {
        grid-template-columns: 1fr;
      }
    }

    .vault-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.inside-vault {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.04);
      }

      &.outside-vault {
        border-color: rgba(121, 82, 179, 0.4);
      }
    }

    .vault-tag {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--bs-purple-light);
    }

    .code-zone {
      background: var(--bg-code);
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--border-color);

      pre {
        margin: 0;
        padding: 10px;
        font-size: 0.74rem;
      }
    }

    .vault-inner-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;

      .val-lbl { color: var(--text-muted); }
      .val-money {
        font-size: 1.25rem;
        font-weight: 900;
        color: #34d399;
      }
    }

    .security-barrier {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 6px;
      padding: 12px;
      background: var(--bg-subtle);
      border: 2px dashed #10b981;
      border-radius: 10px;

      .shield-icon { font-size: 1.8rem; }
      .shield-label {
        font-size: 0.78rem;
        font-weight: 800;
        color: #10b981;
      }
      .shield-desc {
        font-size: 0.68rem;
        color: var(--text-dim);
      }
    }

    .ext-attempt {
      display: flex;
      flex-direction: column;

      .btn-hack {
        border-color: #ef4444;
        color: #f87171;

        &:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      }
    }

    .hack-alert {
      padding: 8px 10px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      font-size: 0.76rem;
      line-height: 1.4;
    }

    /* Operations Grid */
    .operations-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .operation-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;

      .op-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .input-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .op-input {
          width: 80px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 5px 8px;
          color: var(--text-main);
          font-family: var(--font-mono);
          font-weight: 700;
        }

        .unit {
          color: var(--text-dim);
        }
      }

      .op-rule {
        font-size: 0.72rem;
        color: var(--text-dim);
        font-style: italic;
      }
    }

    .transaction-audit-panel {
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .audit-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        background: var(--terminal-header);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.74rem;
        font-weight: 700;
        color: var(--text-muted);
      }

      .audit-lines {
        padding: 12px;
        max-height: 120px;
        overflow-y: auto;
        font-family: var(--font-mono);
        font-size: 0.74rem;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .dim { color: var(--text-dim); }

        .log-entry {
          display: flex;
          align-items: center;
          gap: 8px;

          &.success {
            color: #86efac;
            .log-badge { color: #22c55e; font-weight: 800; }
          }

          &.error {
            color: #fca5a5;
            .log-badge { color: #ef4444; font-weight: 800; }
          }
        }
      }
    }
  `]
})
export class OopEncapsulationComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  // Source privée & projection publique
  readonly soldeActuel = signal<number>(1000);
  readonly hackBlocked = signal<boolean>(false);

  readonly depotAmount = signal<number>(150);
  readonly retraitAmount = signal<number>(200);

  readonly auditLogs = signal<{ type: 'ok' | 'err'; text: string }[]>([
    { type: 'ok', text: 'Compte initialisé avec un solde de départ de 1000.00 €' }
  ]);

  simulateHackAttempt(): void {
    this.hackBlocked.set(true);
    setTimeout(() => {
      this.hackBlocked.set(false);
    }, 4000);
  }

  onDepotInput(e: Event): void {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val)) this.depotAmount.set(val);
  }

  onRetraitInput(e: Event): void {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val)) this.retraitAmount.set(val);
  }

  executeDeposer(): void {
    const montant = this.depotAmount();
    if (montant <= 0) {
      this.auditLogs.update(l => [
        ...l,
        { type: 'err', text: `Dépôt rejeté : Le montant (${montant} €) doit être strictement positif.` }
      ]);
      return;
    }

    this.soldeActuel.update(s => s + montant);
    this.auditLogs.update(l => [
      ...l,
      { type: 'ok', text: `Dépôt de ${montant.toFixed(2)} € validé. Nouveau solde : ${this.soldeActuel().toFixed(2)} €` }
    ]);
  }

  executeRetirer(): void {
    const montant = this.retraitAmount();
    if (montant <= 0) {
      this.auditLogs.update(l => [
        ...l,
        { type: 'err', text: `Retrait rejeté : Le montant (${montant} €) doit être strictement positif.` }
      ]);
      return;
    }

    if (this.soldeActuel() - montant < 0) {
      this.auditLogs.update(l => [
        ...l,
        { type: 'err', text: `Retrait rejeté : Solde insuffisant (${this.soldeActuel().toFixed(2)} € pour retirer ${montant} €). Pas de découvert autorisé.` }
      ]);
      return;
    }

    this.soldeActuel.update(s => s - montant);
    this.auditLogs.update(l => [
      ...l,
      { type: 'ok', text: `Retrait de ${montant.toFixed(2)} € validé. Nouveau solde : ${this.soldeActuel().toFixed(2)} €` }
    ]);
  }
}
