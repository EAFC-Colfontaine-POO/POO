import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-ocp-open-closed',
  standalone: true,
  imports: [CommonModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 11 · Pilier 2</span>
          <span class="badge badge-emerald">O : Open / Closed Principle</span>
          <span class="badge badge-purple">Pattern Stratégie</span>
        </div>
        <h2>'O' — Open/Closed Principle (OCP)</h2>
        <p class="module-desc">
          <em>« Une entité logicielle doit être ouverte à l'extension, mais fermée à la modification. »</em> — Bertrand Meyer / Robert C. Martin.
          On doit pouvoir ajouter de nouvelles fonctionnalités sans toucher à une seule ligne de code déjà testée et déployée en production.
        </p>

        <!-- Bascule Théorie & Simulateurs vs Atelier Pratique -->
        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'interactive'"
            (click)="activeMode.set('interactive')"
          >
            🔬 Simulateurs OCP &amp; Stratégie
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            💻 Atelier Monaco (Labo 2 · 4 Exercices)
          </button>
        </div>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- SIMULATEUR 1 : LE PIÈGE DU SWITCH / CASE -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-rose">Piège Récurrent</span>
            <h3>Le Piège du Switch/Case : Pourquoi il viole l'OCP</h3>
          </div>
          <p class="section-intro">
            Voici un calculateur de remise codé avec un <code>switch</code> classique.
            Cliquez sur « Ajouter le type SENIOR (-30%) » pour observer la violation de fermeture :
          </p>

          <div class="switch-trap-grid mt-2">
            <!-- Panneau Code Switch -->
            <div class="code-view-col">
              <div class="code-header">
                <span class="dot"></span>
                <span>CalculateurRemiseSpaghetti.ts</span>
                <span class="badge badge-rose ml-auto">Fermeture Violée</span>
              </div>
              <pre class="code-content"><code>calculerRemise(type: string, total: number): number &#123;
  switch (type) &#123;
    case 'STANDARD':     return total;
    case 'VIP':          return total * 0.85; // 15%
    case 'ETUDIANT':     return total * 0.80; // 20%
    case 'BLACK_FRIDAY': return total * 0.50; // 50%
<span [class.added-line]="hasAddedSenior()">@if (hasAddedSenior()) {
    <span class="hl-red">+ case 'SENIOR':       return total * 0.70; // ⚠️ Code existant modifié !</span>
}</span>    default: throw new Error('Type inconnu');
  &#125;
&#125;</code></pre>
            </div>

            <!-- Panneau Explications & Conséquences QA -->
            <div class="consequences-col">
              <div class="action-box">
                <button 
                  class="btn-primary" 
                  (click)="toggleSeniorSwitch()"
                >
                  {{ hasAddedSenior() ? 'Annuler l\'ajout de SENIOR' : '➕ Ajouter le profil SENIOR (-30%)' }}
                </button>
                <span class="action-hint">Modifie directement le corps du switch existant</span>
              </div>

              @if (hasAddedSenior()) {
                <div class="regression-alert">
                  <div class="alert-head">
                    <span class="icon">💥</span>
                    <strong>Effet Collatéral &amp; Dette Technique Immédiate :</strong>
                  </div>
                  <ul>
                    <li><strong>Viol de la fermeture :</strong> Vous avez été contraint d'ouvrir le fichier en production pour insérer une nouvelle branche.</li>
                    <li><strong>Risque de régression :</strong> Une faute de frappe dans le <code>case 'VIP'</code> juste au-dessus pourrait casser la facturation des clients premium !</li>
                    <li><strong>Surcoût de test :</strong> Obligation contractuelle de relancer l'intégralité de la suite de tests de non-régression sur tous les types existants.</li>
                  </ul>
                </div>
              } @else {
                <div class="neutral-hint">
                  Dans un système non-OCP, chaque nouvelle règle business exige de re-tester l'intégralité des anciennes règles.
                </div>
              }
            </div>
          </div>
        </div>

        <!-- SIMULATEUR 2 : PATTERN STRATÉGIE SANS MODIFICATION -->
        <div class="card-panel">
          <div class="card-title-row">
            <span class="badge badge-emerald">La Solution Pro</span>
            <h3>Atelier Pattern Stratégie : Zéro Ligne Modifiée</h3>
          </div>
          <p class="section-intro">
            Voici la version refactorisée selon l'OCP. <code>CalculateurRemise</code> est <strong>100% fermé à la modification</strong>.
            Injectez dynamiquement la stratégie <code>RemiseSenior</code> à l'exécution :
          </p>

          <div class="strategy-workshop-grid mt-3">
            <!-- Schéma d'injection -->
            <div class="strategy-flow">
              <div class="flow-card contract-card">
                <div class="card-tag">Contrat Stable (Interface)</div>
                <div class="card-name">interface StrategieRemise</div>
                <code class="mini-code">appliquer(montant: number): number</code>
              </div>

              <div class="flow-arrow-down">▼ injecté dans le constructeur</div>

              <div class="flow-card host-card">
                <div class="card-tag">Fermé à la modification 🔒</div>
                <div class="card-name">CalculateurRemise</div>
                <p class="mini-desc">Ne contient aucun if, aucun switch. Délègue aveuglément à la stratégie.</p>
              </div>

              <div class="flow-arrow-down">▲ implémenté par vos classes</div>

              <div class="strategies-pool">
                <button 
                  class="strat-chip" 
                  [class.selected]="selectedStrategy() === 'standard'"
                  (click)="selectedStrategy.set('standard')"
                >
                  Standard (0%)
                </button>
                <button 
                  class="strat-chip" 
                  [class.selected]="selectedStrategy() === 'vip'"
                  (click)="selectedStrategy.set('vip')"
                >
                  RemiseVIP (-15%)
                </button>
                <button 
                  class="strat-chip" 
                  [class.selected]="selectedStrategy() === 'etudiant'"
                  (click)="selectedStrategy.set('etudiant')"
                >
                  RemiseEtudiant (-20%)
                </button>
                <button 
                  class="strat-chip senior-chip" 
                  [class.selected]="selectedStrategy() === 'senior'"
                  (click)="selectedStrategy.set('senior')"
                >
                  ✨ RemiseSenior (-30%)
                </button>
              </div>
            </div>

            <!-- Banc d'évaluation en direct -->
            <div class="strategy-demo-box">
              <div class="box-title">Exécution Dynamique en Direct</div>

              <div class="calc-form">
                <label>Montant du panier d'achat (€) :</label>
                <input 
                  type="number" 
                  class="amount-input" 
                  [value]="panierMontant()" 
                  (input)="onMontantChange($event)"
                />
              </div>

              <div class="receipt-box mt-2">
                <div class="receipt-row">
                  <span>Stratégie Active :</span>
                  <span class="receipt-val fw-bold text-accent">{{ getStrategyName() }}</span>
                </div>
                <div class="receipt-row">
                  <span>Montant Brut :</span>
                  <span class="receipt-val">{{ panierMontant() }} €</span>
                </div>
                <div class="receipt-row">
                  <span>Taux de Réduction :</span>
                  <span class="receipt-val text-success">{{ getDiscountRate() }}</span>
                </div>
                <div class="receipt-divider"></div>
                <div class="receipt-row total-row">
                  <span>Total Net Réglé :</span>
                  <span class="receipt-total">{{ calculerTotalNet() }} €</span>
                </div>
              </div>

              <div class="ocp-proof-banner mt-2">
                🌟 <strong>Preuve OCP :</strong> La classe <code>RemiseSenior</code> a été ajoutée et évaluée avec <strong>zéro modification</strong> dans le calculateur hôte !
              </div>
            </div>
          </div>
        </div>

        <!-- SIMULATEUR 3 : ROUTAGE D'ALERTES MULTI-CANAL -->
        <div class="card-panel">
          <div class="card-title-row">
            <span class="badge badge-purple">Architecture Réseau</span>
            <h3>Simulateur de Routage d'Alertes Multi-Canal</h3>
          </div>
          <p class="section-intro">
            Le contrat <code>CanalNotification</code> permet d'adresser des alertes à un ensemble hétérogène de canaux.
            Cochez les canaux actifs et diffusez une notification en direct :
          </p>

          <div class="multi-channel-grid mt-3">
            <div class="channels-list">
              <label class="channel-toggle-row">
                <input type="checkbox" [checked]="channelEmail()" (change)="channelEmail.set(!channelEmail())" />
                <span class="channel-icon">📧</span>
                <span class="channel-name">CanalEmail (SMTP)</span>
              </label>

              <label class="channel-toggle-row">
                <input type="checkbox" [checked]="channelSms()" (change)="channelSms.set(!channelSms())" />
                <span class="channel-icon">📱</span>
                <span class="channel-name">CanalSMS (Twilio)</span>
              </label>

              <label class="channel-toggle-row">
                <input type="checkbox" [checked]="channelDiscord()" (change)="channelDiscord.set(!channelDiscord())" />
                <span class="channel-icon">👾</span>
                <span class="channel-name">CanalDiscord (Webhook)</span>
              </label>

              <label class="channel-toggle-row">
                <input type="checkbox" [checked]="channelWhatsapp()" (change)="channelWhatsapp.set(!channelWhatsapp())" />
                <span class="channel-icon">💬</span>
                <span class="channel-name">CanalWhatsApp (Meta API)</span>
              </label>

              <button class="btn-primary mt-2" (click)="diffuserAlerte()">
                📢 Diffuser l'Alerte : « Panne Serveur BDD »
              </button>
            </div>

            <!-- Écran de réception des alertes -->
            <div class="receipts-display-box">
              <div class="box-title">Accusés de Réception des Canaux Notifiés</div>
              @if (alertReceipts().length === 0) {
                <div class="empty-receipts">
                  Sélectionnez les canaux et cliquez sur le bouton pour diffuser l'alerte.
                </div>
              } @else {
                <div class="receipts-list">
                  @for (r of alertReceipts(); track $index) {
                    <div class="receipt-item">
                      <span class="status-dot"></span>
                      <code>{{ r }}</code>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO : LABO 2 (4 EXERCICES) -->
        <app-lab-runner [filterLabNumber]="2"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .demo-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 10px;

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .section-intro {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .switch-trap-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .code-view-col {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .code-header {
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.04);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.76rem;
        font-family: var(--font-mono);
        color: var(--text-muted);

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f43f5e;
        }

        .ml-auto {
          margin-left: auto;
        }
      }

      .code-content {
        padding: 12px;
        font-size: 0.78rem;
        line-height: 1.45;
        color: var(--text-code);
        margin: 0;
      }

      .hl-red {
        color: #fca5a5;
        font-weight: 700;
        background: rgba(244, 63, 94, 0.2);
        display: block;
        padding: 2px 4px;
        border-radius: 4px;
      }
    }

    .consequences-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .action-hint {
        font-size: 0.75rem;
        color: var(--text-dim);
      }
    }

    .regression-alert {
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid #f43f5e;
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: #fecdd3;
      font-size: 0.8rem;
      line-height: 1.45;

      .alert-head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        font-size: 0.85rem;
      }

      ul {
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    .neutral-hint {
      padding: 14px;
      border-radius: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .strategy-workshop-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .strategy-flow {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .flow-card {
      width: 100%;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      text-align: center;

      &.contract-card {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.08);

        .card-tag { color: #34d399; }
      }

      &.host-card {
        border-color: #6366f1;
        background: rgba(99, 102, 241, 0.08);

        .card-tag { color: #818cf8; }
      }

      .card-tag {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      .card-name {
        font-size: 0.95rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: var(--text-main);
        margin: 4px 0;
      }

      .mini-code {
        font-size: 0.74rem;
        color: #93c5fd;
      }

      .mini-desc {
        font-size: 0.76rem;
        color: var(--text-muted);
        margin-top: 4px;
      }
    }

    .flow-arrow-down {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      color: var(--text-dim);
    }

    .strategies-pool {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
    }

    .strat-chip {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.selected {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border-color: #10b981;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);
      }

      &.senior-chip.selected {
        background: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
        border-color: #f59e0b;
      }
    }

    .strategy-demo-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .box-title {
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
      }
    }

    .calc-form {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .amount-input {
        padding: 8px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-main);
        font-size: 1rem;
        font-weight: 700;
        font-family: var(--font-mono);

        &:focus {
          outline: none;
          border-color: #10b981;
        }
      }
    }

    .receipt-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.82rem;

      .receipt-row {
        display: flex;
        justify-content: space-between;
        color: var(--text-muted);
      }

      .receipt-val {
        color: var(--text-main);
        font-family: var(--font-mono);

        &.text-accent { color: #818cf8; }
        &.text-success { color: #34d399; font-weight: 700; }
      }

      .receipt-divider {
        height: 1px;
        background: var(--border-color);
        margin: 4px 0;
      }

      .total-row {
        font-size: 1rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .receipt-total {
        color: #34d399;
        font-family: var(--font-mono);
      }
    }

    .ocp-proof-banner {
      padding: 10px 12px;
      border-radius: 6px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-size: 0.78rem;
      color: #a7f3d0;
      line-height: 1.4;
    }

    .multi-channel-grid {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .channels-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .channel-toggle-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.84rem;
      color: var(--text-main);

      &:hover {
        background: var(--bg-card-hover);
      }

      .channel-icon {
        font-size: 1.1rem;
      }
    }

    .receipts-display-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 180px;

      .box-title {
        font-size: 0.74rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .empty-receipts {
        font-size: 0.8rem;
        color: var(--text-dim);
        font-style: italic;
        margin: auto;
      }

      .receipts-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .receipt-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: #86efac;

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }

        code {
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    }
  `]
})
export class OcpOpenClosedComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  // Simulateur 1 : Switch Trap
  readonly hasAddedSenior = signal<boolean>(false);

  // Simulateur 2 : Strategy Workshop
  readonly selectedStrategy = signal<'standard' | 'vip' | 'etudiant' | 'senior'>('senior');
  readonly panierMontant = signal<number>(100);

  // Simulateur 3 : Multi-Channel Alerts
  readonly channelEmail = signal<boolean>(true);
  readonly channelSms = signal<boolean>(true);
  readonly channelDiscord = signal<boolean>(true);
  readonly channelWhatsapp = signal<boolean>(false);
  readonly alertReceipts = signal<string[]>([]);

  toggleSeniorSwitch(): void {
    this.hasAddedSenior.update(v => !v);
  }

  onMontantChange(event: any): void {
    const val = parseFloat(event.target.value);
    this.panierMontant.set(isNaN(val) ? 0 : val);
  }

  getStrategyName(): string {
    switch (this.selectedStrategy()) {
      case 'standard': return 'Standard (Pas de remise)';
      case 'vip': return 'RemiseVIP';
      case 'etudiant': return 'RemiseEtudiant';
      case 'senior': return 'RemiseSenior';
    }
  }

  getDiscountRate(): string {
    switch (this.selectedStrategy()) {
      case 'standard': return '0%';
      case 'vip': return '-15%';
      case 'etudiant': return '-20%';
      case 'senior': return '-30%';
    }
  }

  calculerTotalNet(): number {
    const total = this.panierMontant();
    switch (this.selectedStrategy()) {
      case 'standard': return total;
      case 'vip': return Math.round(total * 0.85 * 100) / 100;
      case 'etudiant': return Math.round(total * 0.80 * 100) / 100;
      case 'senior': return Math.round(total * 0.70 * 100) / 100;
    }
  }

  diffuserAlerte(): void {
    const receipts: string[] = [];
    if (this.channelEmail()) {
      receipts.push('[EMAIL SMTP] Accusé 250 : Alerte transmise aux administrateurs (admin@eafc.be)');
    }
    if (this.channelSms()) {
      receipts.push('[SMS TWILIO] Message SID SM8932 : SMS d\'urgence envoyé à l\'astreinte (+32 470 12 34 56)');
    }
    if (this.channelDiscord()) {
      receipts.push('[DISCORD WEBHOOK] HTTP 204 : Notification poussée dans le salon #alertes-infra');
    }
    if (this.channelWhatsapp()) {
      receipts.push('[WHATSAPP API] Status 200 : Message de groupe expédié');
    }
    this.alertReceipts.set(receipts);
  }
}
