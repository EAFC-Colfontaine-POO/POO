import { Component, signal, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface SimulatedEventLog {
  target: 'TabA' | 'TabB';
  triggered: boolean;
  key: string;
  oldValue: string | null;
  newValue: string | null;
  timestamp: string;
}

@Component({
  selector: 'app-multi-tabs',
  standalone: true,
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">MODULE 05 · COMMUNICATION SANS SERVEUR NI WEBSOCKET</div>
        <h2>Laboratoire Multi-Onglets (L'Événement <code>StorageEvent</code>)</h2>
        <p class="module-desc">
          Découvrez comment synchroniser plusieurs fenêtres ou onglets en temps réel grâce à l'événement <code>storage</code>.
          Comprenez la règle fondamentale : <strong>l'événement ne se déclenche JAMAIS dans l'onglet émetteur</strong>, mais uniquement dans les autres onglets !
        </p>
      </div>

      <!-- Section 1 : Simulateur d'Onglets Jumeaux -->
      <div class="card-panel simulator-panel">
        <div class="section-title-row">
          <div class="s-title">👥 Simulateur d'Onglets Jumeaux Côte à Côte</div>
          <span class="badge badge-purple">Synchronisation Inter-Processus</span>
        </div>

        <div class="twin-tabs-grid">
          <!-- Fenêtre A -->
          <div class="window-mock tab-a" [class.emitting]="isEmittingFromA()">
            <div class="mock-titlebar">
              <div class="window-controls">
                <span class="ctrl-dot red"></span>
                <span class="ctrl-dot yellow"></span>
                <span class="ctrl-dot green"></span>
              </div>
              <span class="mock-address">Onglet A · https://boutique.eafc.be</span>
              <span class="badge badge-ts">Émetteur</span>
            </div>

            <div class="mock-content">
              <div class="mock-field">
                <label>Clé à modifier :</label>
                <input type="text" [value]="simKey()" (input)="simKey.set($any($event.target).value)" />
              </div>
              <div class="mock-field">
                <label>Nouvelle valeur :</label>
                <input type="text" [value]="simValA()" (input)="simValA.set($any($event.target).value)" />
              </div>

              <button class="btn-primary" (click)="emitFromTabA()">
                ✍️ Écrire setItem() depuis Onglet A
              </button>

              <div class="event-listener-box" [class.no-event]="lastLogA() && !lastLogA()?.triggered">
                <div class="box-tag">Écoute window.addEventListener('storage', ...) :</div>
                @if (lastLogA()) {
                  <div class="no-event-content">
                    <span class="icon">🚫</span>
                    <strong>AUCUN événement storage déclenché dans A !</strong>
                    <p>Règle W3C : L'onglet qui effectue l'écriture ne reçoit jamais l'événement.</p>
                  </div>
                } @else {
                  <div class="idle-text">En attente d'écriture...</div>
                }
              </div>
            </div>
          </div>

          <!-- Bus de synchronisation animé -->
          <div class="sync-bus-indicator">
            <div class="bus-line"></div>
            <div class="bus-packet" [class.pulsing]="isEmittingFromA()">
              <span>📡 StorageEvent</span>
            </div>
          </div>

          <!-- Fenêtre B -->
          <div class="window-mock tab-b" [class.receiving]="isReceivingInB()">
            <div class="mock-titlebar">
              <div class="window-controls">
                <span class="ctrl-dot red"></span>
                <span class="ctrl-dot yellow"></span>
                <span class="ctrl-dot green"></span>
              </div>
              <span class="mock-address">Onglet B · https://boutique.eafc.be</span>
              <span class="badge badge-success">Récepteur</span>
            </div>

            <div class="mock-content">
              <div class="receptive-display">
                <div class="badge-title">Valeur synchronisée dans Onglet B :</div>
                <div class="received-value">{{ tabBSyncedVal() || '(En attente)' }}</div>
              </div>

              <div class="event-listener-box" [class.has-event]="lastLogB() && lastLogB()?.triggered">
                <div class="box-tag">Écoute window.addEventListener('storage', ...) :</div>
                @if (lastLogB()) {
                  <div class="has-event-content">
                    <div class="event-header">
                      <span class="icon">⚡</span>
                      <strong>StorageEvent Reçu Instantanément dans B !</strong>
                    </div>
                    <div class="event-props">
                      <div>• <code>event.key</code> : <strong>{{ lastLogB()?.key }}</strong></div>
                      <div>• <code>event.oldValue</code> : <code>{{ lastLogB()?.oldValue || 'null' }}</code></div>
                      <div>• <code>event.newValue</code> : <strong class="text-success">{{ lastLogB()?.newValue }}</strong></div>
                    </div>
                  </div>
                } @else {
                  <div class="idle-text">En attente d'une mutation dans Onglet A...</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2 : Test Réel Inter-Onglets (API Native du Navigateur) -->
      <div class="card-panel real-test-panel">
        <div class="section-title-row">
          <div class="s-title">🌐 Test Réel sur Votre Propre Navigateur</div>
          <span class="badge badge-teal">Événement DOM Réel</span>
        </div>

        <div class="real-test-content">
          <p class="real-instructions">
            Testez la synchronisation inter-onglets native en ouvrant <strong>un second onglet sur cette même page</strong>.
            Lorsque vous cliquez sur le bouton ci-dessous, la clé <code>eafc_seance18_ping</code> sera modifiée et vos autres onglets
            recevront l'événement en temps réel !
          </p>

          <div class="real-actions-row">
            <button class="btn-primary" (click)="broadcastRealEvent()">
              📢 Émettre une impulsion sur localStorage (Ping)
            </button>
            <span class="real-status">{{ realBroadcastStatus() }}</span>
          </div>

          <!-- Journal des événements réels capturés -->
          <div class="real-events-log">
            <div class="log-title">Journal des StorageEvent réels interceptés sur cet onglet :</div>
            @for (ev of realEvents(); track $index) {
              <div class="real-event-item">
                <span class="time">{{ ev.time }}</span>
                <span class="k">Clé : <code>{{ ev.key }}</code></span>
                <span class="v">Nouvelle valeur : <strong>{{ ev.val }}</strong></span>
              </div>
            } @empty {
              <div class="no-real-events">
                Aucun événement externe reçu pour l'instant. Ouvrez un 2ᵉ onglet et cliquez sur le bouton Ping pour voir l'événement apparaître ici !
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .simulator-panel, .real-test-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .s-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .twin-tabs-grid {
      display: grid;
      grid-template-columns: 1fr 100px 1fr;
      align-items: center;
      gap: 12px;
    }

    .window-mock {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s;

      &.emitting {
        border-color: var(--ts-blue);
        box-shadow: 0 0 12px rgba(49, 120, 198, 0.3);
      }

      &.receiving {
        border-color: #34d399;
        box-shadow: 0 0 12px rgba(52, 211, 153, 0.3);
      }

      .mock-titlebar {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: var(--bg-subtle);
        border-bottom: 1px solid var(--border-subtle);

        .window-controls {
          display: flex;
          gap: 6px;

          .ctrl-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;

            &.red { background: #ef4444; }
            &.yellow { background: #f59e0b; }
            &.green { background: #10b981; }
          }
        }

        .mock-address {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          flex: 1;
        }
      }

      .mock-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .mock-field {
          display: flex;
          flex-direction: column;
          gap: 4px;

          label {
            font-size: 0.76rem;
            color: var(--text-muted);
            font-weight: 600;
          }

          input {
            width: 100%;
          }
        }
      }
    }

    .sync-bus-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;

      .bus-line {
        width: 100%;
        height: 2px;
        background: var(--border-color);
      }

      .bus-packet {
        position: absolute;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 4px 8px;
        border-radius: 9999px;
        font-size: 0.68rem;
        font-family: var(--font-mono);
        color: var(--text-muted);
        white-space: nowrap;

        &.pulsing {
          border-color: #34d399;
          color: #34d399;
          animation: pulsePacket 0.6s ease;
        }
      }
    }

    @keyframes pulsePacket {
      0% { transform: scale(0.9); }
      50% { transform: scale(1.15); box-shadow: 0 0 10px #34d399; }
      100% { transform: scale(1); }
    }

    .receptive-display {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .badge-title {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
      }

      .received-value {
        font-family: var(--font-mono);
        font-size: 1.1rem;
        font-weight: 700;
        color: #34d399;
      }
    }

    .event-listener-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px 12px;
      min-height: 95px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .box-tag {
        font-size: 0.72rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }

      .idle-text {
        font-size: 0.76rem;
        color: var(--text-dim);
        font-style: italic;
        margin: auto;
      }

      &.no-event {
        background: rgba(221, 0, 49, 0.08);
        border-color: rgba(221, 0, 49, 0.25);

        .no-event-content {
          font-size: 0.78rem;
          color: #f87171;
          display: flex;
          flex-direction: column;
          gap: 2px;

          p {
            font-size: 0.72rem;
            color: var(--text-muted);
          }
        }
      }

      &.has-event {
        background: rgba(16, 185, 129, 0.08);
        border-color: rgba(16, 185, 129, 0.3);

        .has-event-content {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .event-header {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            color: #34d399;
          }

          .event-props {
            font-size: 0.74rem;
            font-family: var(--font-mono);
            color: var(--text-main);
            display: flex;
            flex-direction: column;
            gap: 2px;

            .text-success { color: #34d399; }
          }
        }
      }
    }

    .real-test-content {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .real-instructions {
        font-size: 0.88rem;
        color: var(--text-muted);
        line-height: 1.5;
      }

      .real-actions-row {
        display: flex;
        align-items: center;
        gap: 14px;

        .real-status {
          font-size: 0.82rem;
          color: #60a5fa;
        }
      }

      .real-events-log {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .log-title {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .real-event-item {
          display: flex;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          padding: 6px 8px;
          background: var(--bg-card);
          border-radius: 4px;

          .time { color: var(--text-dim); }
          .k code { color: #60a5fa; }
          .v strong { color: #34d399; }
        }

        .no-real-events {
          color: var(--text-dim);
          font-style: italic;
          font-size: 0.78rem;
          padding: 8px 0;
        }
      }
    }
  `]
})
export class MultiTabsComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Twin tabs simulator state
  readonly simKey = signal<string>('panier_total');
  readonly simValA = signal<string>('3 articles (149 €)');
  readonly tabBSyncedVal = signal<string>('0 article (0 €)');
  readonly isEmittingFromA = signal<boolean>(false);
  readonly isReceivingInB = signal<boolean>(false);

  readonly lastLogA = signal<SimulatedEventLog | null>(null);
  readonly lastLogB = signal<SimulatedEventLog | null>(null);

  // Real multi-tab native state
  readonly realBroadcastStatus = signal<string>('');
  readonly realEvents = signal<{ time: string; key: string; val: string }[]>([]);

  private storageListener: ((event: StorageEvent) => void) | null = null;

  constructor() {
    if (this.isBrowser) {
      this.storageListener = (event: StorageEvent) => {
        if (event.key?.startsWith('eafc_seance18_ping')) {
          this.realEvents.update(list => [
            {
              time: new Date().toLocaleTimeString(),
              key: event.key ?? '',
              val: event.newValue ?? 'null'
            },
            ...list.slice(0, 5)
          ]);
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

  emitFromTabA(): void {
    const k = this.simKey();
    const oldV = this.tabBSyncedVal();
    const newV = this.simValA();
    const ts = new Date().toLocaleTimeString();

    this.isEmittingFromA.set(true);

    // Onglet A effectue setItem() : il ne reçoit PAS l'événement
    this.lastLogA.set({
      target: 'TabA',
      triggered: false,
      key: k,
      oldValue: oldV,
      newValue: newV,
      timestamp: ts
    });

    setTimeout(() => {
      this.isEmittingFromA.set(false);
      this.isReceivingInB.set(true);
      this.tabBSyncedVal.set(newV);

      // Onglet B reçoit l'événement storage
      this.lastLogB.set({
        target: 'TabB',
        triggered: true,
        key: k,
        oldValue: oldV,
        newValue: newV,
        timestamp: ts
      });

      setTimeout(() => {
        this.isReceivingInB.set(false);
      }, 700);
    }, 400);
  }

  broadcastRealEvent(): void {
    if (!this.isBrowser) return;
    const now = new Date().toLocaleTimeString();
    try {
      localStorage.setItem('eafc_seance18_ping', `Ping envoyé à ${now}`);
      this.realBroadcastStatus.set(`Ping écrit dans localStorage à ${now} ! Vos autres onglets reçoivent l'événement.`);
    } catch (e) {
      this.realBroadcastStatus.set('Erreur lors de l\'écriture du Ping.');
    }
  }
}
