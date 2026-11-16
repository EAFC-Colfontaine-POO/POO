import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-acid-transactions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 05 · INTÉGRITÉ &amp; TRANSACTIONS ACID</div>
        <h2>Transactions ACID &amp; Le Piège du Réseau</h2>
        <p class="module-desc">
          Garantir l'intégrité absolue de vos données même en cas de panne de batterie ou de coupure réseau.
          Comprendre les 4 piliers ACID, observer le <strong>Rollback automatique</strong> en direct, et éviter
          l'erreur fatale <code>TransactionInactiveError</code> causée par un <code>fetch</code> dans une transaction.
        </p>
      </div>

      <!-- Simulateur de Crash & Rollback en 3 étapes -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">💥 Simulateur de Crash &amp; Rollback : Scénario Validation de Commande</div>
          <span class="badge badge-red">Atomicité en Action</span>
        </div>

        <p class="p-lead">
          Une validation de commande comprend 3 étapes critiques : 1. Débiter 100€ ➔ 2. Décrémenter le stock ➔ 3. Créer la commande.
          Simulez une coupure brutale de batterie à l'étape 2 :
        </p>

        <!-- Toggle mode transaction -->
        <div class="mode-selection-bar">
          <button 
            class="mode-btn" 
            [class.active]="txMode() === 'none'"
            (click)="setTxMode('none')"
          >
            Mode 1 : Sans Transaction (Naïf)
          </button>
          <button 
            class="mode-btn success" 
            [class.active]="txMode() === 'acid'"
            (click)="setTxMode('acid')"
          >
            Mode 2 : Avec db.transaction('rw', ...) (Professionnel)
          </button>
        </div>

        <!-- Les 3 Étapes Visuelles -->
        <div class="steps-flow-grid">
          <div class="step-card" [class.done]="step1Done()" [class.corrupted]="step1Done() && crashOccurred() && txMode() === 'none'">
            <div class="step-num">01</div>
            <div class="step-content">
              <h4>Débiter le Client (100 €)</h4>
              <p>Solde initial : 100 € ➔ Nouveau solde : {{ clientBalance() }} €</p>
              @if (step1Done()) {
                <span class="step-status text-success">✓ Écriture effectuée</span>
              }
            </div>
          </div>

          <div class="step-card crash-target" [class.crashed]="crashOccurred()">
            <div class="step-num">02</div>
            <div class="step-content">
              <h4>Décrémenter le Stock</h4>
              <p>Stock initial : 1 ➔ Nouveau stock : {{ stockCount() }}</p>
              @if (crashOccurred()) {
                <span class="step-status text-danger">⚡ PANNE BATTERIE / EXCEPTION !</span>
              }
            </div>
          </div>

          <div class="step-card" [class.done]="step3Done()">
            <div class="step-num">03</div>
            <div class="step-content">
              <h4>Créer la Commande</h4>
              <p>Génération de la facture et de la fiche de livraison</p>
              @if (step3Done()) {
                <span class="step-status text-success">✓ Commande créée</span>
              } @else if (crashOccurred()) {
                <span class="step-status text-dim">⛔ Jamais atteinte</span>
              }
            </div>
          </div>
        </div>

        <!-- Déclencheur du Crash Test -->
        <div class="crash-actions">
          <button class="btn-primary" (click)="lancerSimulation()" [disabled]="isSimulating()">
            {{ isSimulating() ? 'Exécution en cours...' : '⚡ Simuler la Commande avec Panne à l\'Étape 2' }}
          </button>
          <button class="btn-ghost" (click)="reinitialiserSimulation()">Réinitialiser</button>
        </div>

        <!-- Résultat & Bilan d'intégrité -->
        @if (crashOccurred()) {
          <div class="integrity-report" [class.bad]="txMode() === 'none'" [class.good]="txMode() === 'acid'">
            @if (txMode() === 'none') {
              <div class="report-title">🛑 BASE CORROMPUE (Drame Commercial) :</div>
              <p>
                Le client a été débité de 100€ (solde = 0€), mais l'étape 3 n'a jamais eu lieu !
                <strong>La commande n'existe pas</strong> dans la base de données. L'argent a disparu.
              </p>
            } @else {
              <div class="report-title">💎 ROLLBACK AUTOMATIQUE RÉUSSI :</div>
              <p>
                Dexie a intercepté le crash à l'étape 2 et a ordonné à IndexedDB d'<strong>annuler l'étape 1</strong> !
                Le solde du client a été restauré à 100€ et le stock est intact. Zéro corruption.
              </p>
            }
          </div>
        }
      </div>

      <!-- Les 4 Piliers ACID -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">🏛️ Les 4 Piliers Fondamentaux ACID</div>
          <span class="badge badge-purple">Théorie Fondamentale</span>
        </div>

        <div class="acid-pillars-grid">
          <div class="pillar-card">
            <div class="pillar-letter">A</div>
            <h4>Atomicité</h4>
            <div class="pillar-subtitle">Tout ou Rien</div>
            <p>Si une seule opération de la transaction échoue, toutes les autres sont annulées (Rollback).</p>
          </div>

          <div class="pillar-card">
            <div class="pillar-letter">C</div>
            <h4>Cohérence</h4>
            <div class="pillar-subtitle">Invariants Respectés</div>
            <p>La base passe toujours d'un état valide à un autre état valide selon toutes vos règles métiers.</p>
          </div>

          <div class="pillar-card">
            <div class="pillar-letter">I</div>
            <h4>Isolation</h4>
            <div class="pillar-subtitle">Zéro Lecture Sale</div>
            <p>Deux transactions concurrentes ne voient pas les modifications partielles l'une de l'autre.</p>
          </div>

          <div class="pillar-card">
            <div class="pillar-letter">D</div>
            <h4>Durabilité</h4>
            <div class="pillar-subtitle">Gravé dans le Disque</div>
            <p>Une fois commitée, la transaction résiste à un crash du navigateur ou à une extinction du système.</p>
          </div>
        </div>
      </div>

      <!-- Le Piège du Réseau (TransactionInactiveError) -->
      <div class="card-panel">
        <div class="section-title-row">
          <div class="s-title">🌐 Le Piège du Réseau : Pourquoi <code>fetch()</code> Tue vos Transactions</div>
          <span class="badge badge-warning">Architecture Critique</span>
        </div>

        <div class="network-trap-grid">
          <div class="trap-col bad-code">
            <div class="trap-header">
              <span class="dot-red"></span>
              <h4>❌ ANTI-PATTERN : fetch() dans la transaction</h4>
            </div>
            <pre class="code-box"><code>await db.transaction('rw', db.commandes, async () => &#123;
  // 💣 FATAL : la macro-tâche réseau suspend IndexedDB !
  const rep = await fetch('/api/valider-panier');
  await db.commandes.add(commande);
&#125;);
// ➔ Dexie.TransactionInactiveError !</code></pre>
            <div class="trap-explanation">
              Le moteur IndexedDB ferme automatiquement la transaction dès qu'il n'y a plus de micro-tâches locales actives.
            </div>
          </div>

          <div class="trap-col good-code">
            <div class="trap-header">
              <span class="dot-green"></span>
              <h4>✅ SOLUTION : Réseau AVANT la transaction</h4>
            </div>
            <pre class="code-box"><code>// 1. Appel réseau externe en amont :
const rep = await fetch('/api/valider-panier');

// 2. Transaction 100% locale ultra-courte (1 ms) :
await db.transaction('rw', db.commandes, async () => &#123;
  await db.commandes.add(commande);
&#125;);
// ➔ Commit instantané et fiable !</code></pre>
            <div class="trap-explanation">
              Isolez tout l'I/O externe en amont, puis exécutez la transaction atomique en une fraction de milliseconde.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mode-selection-bar {
      display: flex;
      gap: 12px;
      margin-top: 14px;

      .mode-btn {
        padding: 8px 16px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);

        &.active {
          background: rgba(239, 68, 68, 0.15);
          border-color: #ef4444;
          color: #f87171;
        }

        &.success.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: #10b981;
          color: #34d399;
        }
      }
    }

    .steps-flow-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .step-card {
      padding: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      gap: 12px;
      transition: all 0.25s;

      .step-num {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: 0.85rem;
        color: #60a5fa;
        flex-shrink: 0;
      }

      .step-content {
        h4 { font-size: 0.88rem; margin-bottom: 4px; }
        p { font-size: 0.78rem; color: var(--text-muted); }
        .step-status {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          margin-top: 6px;
        }
      }

      &.done {
        border-color: #3b82f6;
      }

      &.corrupted {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.05);
      }

      &.crashed {
        border-color: #ef4444;
        animation: shake 0.4s ease-in-out;
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }

    .crash-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .integrity-report {
      margin-top: 16px;
      padding: 14px;
      border-radius: 8px;
      font-size: 0.82rem;

      &.bad {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #fca5a5;
        .report-title { color: #ef4444; font-weight: 800; margin-bottom: 4px; }
      }

      &.good {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #86efac;
        .report-title { color: #10b981; font-weight: 800; margin-bottom: 4px; }
      }
    }

    .acid-pillars-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 14px;

      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .pillar-card {
      padding: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      text-align: center;

      .pillar-letter {
        width: 42px;
        height: 42px;
        margin: 0 auto 10px;
        border-radius: 50%;
        background: rgba(147, 51, 234, 0.15);
        border: 1px solid rgba(147, 51, 234, 0.35);
        color: #c084fc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-size: 1.25rem;
        font-weight: 800;
      }

      h4 { font-size: 0.95rem; margin-bottom: 2px; }
      .pillar-subtitle {
        font-size: 0.72rem;
        font-weight: 700;
        color: #60a5fa;
        margin-bottom: 8px;
      }
      p {
        font-size: 0.75rem;
        color: var(--text-dim);
        line-height: 1.35;
      }
    }

    .network-trap-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .trap-col {
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      overflow: hidden;

      &.bad-code { border-top: 3px solid #ef4444; }
      &.good-code { border-top: 3px solid #10b981; }

      .trap-header {
        padding: 8px 12px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;

        .dot-red { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
        .dot-green { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
      }

      .code-box {
        padding: 12px;
        background: var(--bg-code);
        font-size: 0.75rem;
        line-height: 1.4;
      }

      .trap-explanation {
        padding: 10px 14px;
        font-size: 0.75rem;
        color: var(--text-muted);
        line-height: 1.35;
      }
    }

    .text-success { color: #34d399; }
    .text-danger { color: #f87171; }
    .text-dim { color: var(--text-dim); }
  `]
})
export class AcidTransactionsComponent {
  readonly txMode = signal<'none' | 'acid'>('acid');
  readonly isSimulating = signal<boolean>(false);
  readonly step1Done = signal<boolean>(false);
  readonly crashOccurred = signal<boolean>(false);
  readonly step3Done = signal<boolean>(false);
  readonly clientBalance = signal<number>(100);
  readonly stockCount = signal<number>(1);

  setTxMode(mode: 'none' | 'acid'): void {
    this.txMode.set(mode);
    this.reinitialiserSimulation();
  }

  async lancerSimulation(): Promise<void> {
    this.reinitialiserSimulation();
    this.isSimulating.set(true);

    // Étape 1 : Débit
    await new Promise(r => setTimeout(r, 400));
    this.step1Done.set(true);
    this.clientBalance.set(0);

    // Étape 2 : Crash à mi-chemin
    await new Promise(r => setTimeout(r, 600));
    this.crashOccurred.set(true);

    if (this.txMode() === 'acid') {
      // Rollback immédiat !
      await new Promise(r => setTimeout(r, 400));
      this.clientBalance.set(100);
      this.stockCount.set(1);
    }

    this.isSimulating.set(false);
  }

  reinitialiserSimulation(): void {
    this.step1Done.set(false);
    this.crashOccurred.set(false);
    this.step3Done.set(false);
    this.clientBalance.set(100);
    this.stockCount.set(1);
  }
}
