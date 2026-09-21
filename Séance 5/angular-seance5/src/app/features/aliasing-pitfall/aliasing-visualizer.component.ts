import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-aliasing-visualizer',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 02 · EFFETS DE BORD</div>
        <h2>Le Piège de l'Aliasing &amp; le Laboratoire des Télécommandes</h2>
        <p class="module-desc">
          Lorsqu'on affecte un objet à une autre variable (<code>let j2 = j1;</code>), <strong>seule l'adresse mémoire est copiée</strong>. Les deux variables deviennent des <em>alias</em> pointant vers le même bloc mémoire dans le tas. Modifier l'un modifie l'autre silencieusement.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>📺 Le Laboratoire des Télécommandes</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 1 · Aliasing &amp; Copie)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="aliasing-workbench">
          <!-- Barre d'options en haut -->
          <div class="card-panel config-bar">
            <div class="config-mode">
              <span class="mode-label">Mode d'allocation :</span>
              <button 
                class="btn-secondary" 
                [class.btn-selected]="mode() === 'alias'" 
                (click)="setMode('alias')"
              >
                ⚠️ Mode Référence Partagée (Aliasing : 1 Télévision)
              </button>
              <button 
                class="btn-secondary" 
                [class.btn-selected]="mode() === 'clone'" 
                (click)="setMode('clone')"
              >
                🛡️ Mode Copie Défensive (Spread : 2 Télévisions)
              </button>
            </div>

            <button class="btn-ghost" (click)="toggleExplain()">
              {{ showExplain() ? 'Masquer l\'explication' : '💡 Pourquoi ce comportement ?' }}
            </button>
          </div>

          <!-- Panneau Explication dépliable -->
          @if (showExplain()) {
            <div class="card-panel explain-panel">
              <div class="explain-grid">
                <div class="explain-code">
                  <div class="code-title">Code TypeScript équivalent :</div>
                  @if (mode() === 'alias') {
                    <pre><code>// ⚠️ L'erreur classique : copie d'adresse
const telecommandeA = &#123; chaine: "{{ tv1().chaine }}", volume: {{ tv1().volume }} &#125;;
const telecommandeB = telecommandeA; // 💥 Copie du pointeur 0x42FA !

telecommandeB.chaine = "Arte";
console.log(telecommandeA.chaine); // Affiche "Arte" !</code></pre>
                  } @else {
                    <pre><code>// 🛡️ La solution : allocation d'un nouvel objet
const telecommandeA = &#123; chaine: "{{ tv1().chaine }}", volume: {{ tv1().volume }} &#125;;
const telecommandeB = &#123; ...telecommandeA &#125;; // ✨ Nouvelle adresse 0x99BC !

telecommandeB.chaine = "Arte";
console.log(telecommandeA.chaine); // Reste inchangé !</code></pre>
                  }
                </div>
                <div class="explain-text">
                  <h4>L'analogie physique</h4>
                  <p>
                    Il n'y a qu'<strong>une seule télévision</strong> dans le salon (un seul bloc d'octets dans le tas). 
                    <code>telecommandeA</code> et <code>telecommandeB</code> ne sont que deux boîtiers infrarouges synchronisés sur le même récepteur.
                  </p>
                  <p class="conclusion">
                    👉 En POO, pour empêcher un tiers d'altérer vos données en douce, <strong>l'encapsulation et les copies défensives</strong> sont indispensables.
                  </p>
                </div>
              </div>
            </div>
          }

          <!-- Zone Visuelle : Télécommandes et Téléviseur(s) -->
          <div class="interactive-stage">
            <!-- Télécommande A -->
            <div class="card-panel remote-control" [class.highlighted]="lastTouched() === 'A'">
              <div class="remote-header">
                <span class="remote-badge">Pile : 0x7FFE0A</span>
                <h4>Télécommande A</h4>
                <span class="ref-tag">Adresse pointée : {{ mode() === 'alias' ? '0x42FA' : '0x42FA' }}</span>
              </div>

              <div class="remote-screen">
                <div class="screen-stat">Écran visé : <strong>TV 1</strong></div>
                <div class="screen-stat">Chaîne : <strong>{{ tv1().chaine }}</strong></div>
                <div class="screen-stat">Volume : <strong>{{ tv1().volume }}</strong></div>
              </div>

              <div class="remote-buttons">
                <button class="remote-btn" (click)="changeChannel('A', 'TF1')">TF1</button>
                <button class="remote-btn" (click)="changeChannel('A', 'France 2')">FR2</button>
                <button class="remote-btn" (click)="changeChannel('A', 'Arte')">Arte</button>
                <button class="remote-btn" (click)="changeVolume('A', 1)">Vol +</button>
                <button class="remote-btn" (click)="changeVolume('A', -1)">Vol -</button>
                <button class="remote-btn btn-power" (click)="togglePower('A')">⏻</button>
              </div>
            </div>

            <!-- Centre : Le Tas (Télévision 1 et éventuelle Télévision 2) -->
            <div class="tv-hub">
              <!-- TV 1 -->
              <div class="tv-device card-panel" [class.tv-off]="!tv1().power">
                <div class="tv-antennas">
                  <div class="antenna left"></div>
                  <div class="antenna right"></div>
                </div>
                <div class="tv-screen-bezel">
                  <div class="tv-display">
                    @if (tv1().power) {
                      <div class="channel-badge">{{ tv1().chaine }}</div>
                      <div class="tv-graphic">
                        <div class="tv-sound-wave" [style.height.px]="tv1().volume * 2"></div>
                        <span class="tv-info">Volume : {{ tv1().volume }} / 30</span>
                      </div>
                    } @else {
                      <div class="tv-standby">Veille</div>
                    }
                  </div>
                </div>
                <div class="tv-base">
                  <span class="tv-memory-tag">Tas : Adresse 0x42FA (Objet TV #1)</span>
                </div>
              </div>

              <!-- TV 2 (Uniquement en mode Copie Défensive) -->
              @if (mode() === 'clone') {
                <div class="tv-device card-panel tv-secondary" [class.tv-off]="!tv2().power">
                  <div class="tv-antennas">
                    <div class="antenna left"></div>
                    <div class="antenna right"></div>
                  </div>
                  <div class="tv-screen-bezel">
                    <div class="tv-display">
                      @if (tv2().power) {
                        <div class="channel-badge">{{ tv2().chaine }}</div>
                        <div class="tv-graphic">
                          <div class="tv-sound-wave" [style.height.px]="tv2().volume * 2"></div>
                          <span class="tv-info">Volume : {{ tv2().volume }} / 30</span>
                        </div>
                      } @else {
                        <div class="tv-standby">Veille</div>
                      }
                    </div>
                  </div>
                  <div class="tv-base">
                    <span class="tv-memory-tag">Tas : Adresse 0x99BC (Objet TV #2 Distinct)</span>
                  </div>
                </div>
              }
            </div>

            <!-- Télécommande B -->
            <div class="card-panel remote-control" [class.highlighted]="lastTouched() === 'B'">
              <div class="remote-header">
                <span class="remote-badge">Pile : 0x7FFE0B</span>
                <h4>Télécommande B</h4>
                <span class="ref-tag">Adresse pointée : {{ mode() === 'alias' ? '0x42FA (Même adresse !)' : '0x99BC (Nouvelle adresse)' }}</span>
              </div>

              <div class="remote-screen">
                <div class="screen-stat">Écran visé : <strong>{{ mode() === 'alias' ? 'TV 1' : 'TV 2' }}</strong></div>
                <div class="screen-stat">Chaîne : <strong>{{ mode() === 'alias' ? tv1().chaine : tv2().chaine }}</strong></div>
                <div class="screen-stat">Volume : <strong>{{ mode() === 'alias' ? tv1().volume : tv2().volume }}</strong></div>
              </div>

              <div class="remote-buttons">
                <button class="remote-btn" (click)="changeChannel('B', 'TF1')">TF1</button>
                <button class="remote-btn" (click)="changeChannel('B', 'France 2')">FR2</button>
                <button class="remote-btn" (click)="changeChannel('B', 'Arte')">Arte</button>
                <button class="remote-btn" (click)="changeVolume('B', 1)">Vol +</button>
                <button class="remote-btn" (click)="changeVolume('B', -1)">Vol -</button>
                <button class="remote-btn btn-power" (click)="togglePower('B')">⏻</button>
              </div>
            </div>
          </div>

          <!-- Bandeau interactif de notification de mutation -->
          <div class="mutation-alert card-panel" [class.alert-danger]="mode() === 'alias'" [class.alert-success]="mode() === 'clone'">
            @if (mode() === 'alias') {
              <div class="alert-icon">⚠️</div>
              <div class="alert-content">
                <strong>Aliasing actif !</strong>
                Lorsque vous cliquez sur la Télécommande B, vous modifiez l'état de la Télécommande A en direct, car elles partagent la même adresse <code>0x42FA</code> dans le tas.
              </div>
            } @else {
              <div class="alert-icon">🛡️</div>
              <div class="alert-content">
                <strong>Indépendance garantie !</strong>
                Chaque télécommande possède désormais son propre écran dans le tas. Modifier la Télécommande B ne touche absolument pas la Télécommande A.
              </div>
            }
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .aliasing-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .config-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;

      .config-mode {
        display: flex;
        align-items: center;
        gap: 12px;

        .mode-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .btn-selected {
          background: var(--ts-blue);
          color: #ffffff;
          border-color: var(--ts-blue);
        }
      }
    }

    .explain-panel {
      background: rgba(49, 120, 198, 0.05);
      border-color: rgba(49, 120, 198, 0.3);
      padding: 16px;

      .explain-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 20px;
      }

      .code-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--ts-blue-light);
        margin-bottom: 6px;
      }

      pre {
        background: #090d16;
        border: 1px solid var(--border-color);
        padding: 12px;
        border-radius: 6px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: #e2e8f0;
      }

      .explain-text {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 0.86rem;

        h4 {
          color: var(--text-main);
          font-weight: 700;
        }

        p {
          color: var(--text-muted);
          line-height: 1.45;
        }

        .conclusion {
          color: var(--ts-blue-light);
          font-weight: 600;
        }
      }
    }

    .interactive-stage {
      display: grid;
      grid-template-columns: 280px 1fr 280px;
      gap: 20px;
      align-items: center;
    }

    .remote-control {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      box-shadow: var(--shadow-md);
      transition: all 0.25s;

      &.highlighted {
        border-color: var(--ts-blue);
        box-shadow: 0 0 15px rgba(49, 120, 198, 0.35);
      }

      .remote-header {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .remote-badge {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--text-dim);
        }

        h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .ref-tag {
          font-size: 0.72rem;
          color: #f59e0b;
          font-weight: 600;
        }
      }

      .remote-screen {
        background: #090d16;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.78rem;
        font-family: var(--font-mono);

        .screen-stat {
          color: var(--text-muted);
          strong { color: #38bdf8; }
        }
      }

      .remote-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;

        .remote-btn {
          padding: 8px 4px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-main);
          text-align: center;

          &:hover {
            background: var(--bg-card-hover);
            border-color: var(--border-focus);
          }

          &.btn-power {
            grid-column: span 3;
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.3);
          }
        }
      }
    }

    .tv-hub {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      justify-content: center;
    }

    .tv-device {
      width: 100%;
      max-width: 360px;
      background: #111726;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      &.tv-off .tv-display {
        background: #050811;
      }

      .tv-antennas {
        display: flex;
        gap: 30px;
        position: absolute;
        top: -16px;

        .antenna {
          width: 3px;
          height: 20px;
          background: #64748b;

          &.left { transform: rotate(-25deg); }
          &.right { transform: rotate(25deg); }
        }
      }

      .tv-screen-bezel {
        width: 100%;
        background: #090d16;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #1e293b;
      }

      .tv-display {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        height: 140px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;

        .channel-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(59, 130, 246, 0.3);
          border: 1px solid #3b82f6;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .tv-graphic {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;

          .tv-sound-wave {
            width: 80px;
            max-height: 40px;
            background: linear-gradient(90deg, #10b981, #3b82f6, #6366f1);
            border-radius: 4px;
            transition: height 0.2s;
          }

          .tv-info {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-family: var(--font-mono);
          }
        }

        .tv-standby {
          color: #ef4444;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
        }
      }

      .tv-base {
        margin-top: 10px;
        .tv-memory-tag {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: #c084fc;
          font-weight: 600;
        }
      }
    }

    .mutation-alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;

      .alert-icon {
        font-size: 1.4rem;
      }

      .alert-content {
        font-size: 0.86rem;
        line-height: 1.4;

        code {
          font-family: var(--font-mono);
          background: rgba(0, 0, 0, 0.25);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      &.alert-danger {
        border-color: rgba(245, 158, 11, 0.4);
        background: rgba(245, 158, 11, 0.08);
        color: #fbbf24;
      }

      &.alert-success {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.08);
        color: #34d399;
      }
    }
  `]
})
export class AliasingVisualizerComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly mode = signal<'alias' | 'clone'>('alias');
  readonly showExplain = signal<boolean>(false);
  readonly lastTouched = signal<'A' | 'B'>('B');

  readonly tv1 = signal({
    chaine: 'TF1',
    volume: 12,
    power: true
  });

  readonly tv2 = signal({
    chaine: 'TF1',
    volume: 12,
    power: true
  });

  setMode(m: 'alias' | 'clone'): void {
    this.mode.set(m);
    if (m === 'clone') {
      this.tv2.set({ ...this.tv1() });
    }
  }

  toggleExplain(): void {
    this.showExplain.update(v => !v);
  }

  changeChannel(remote: 'A' | 'B', channel: string): void {
    this.lastTouched.set(remote);
    if (this.mode() === 'alias' || remote === 'A') {
      this.tv1.update(tv => ({ ...tv, chaine: channel, power: true }));
    } else {
      this.tv2.update(tv => ({ ...tv, chaine: channel, power: true }));
    }
  }

  changeVolume(remote: 'A' | 'B', delta: number): void {
    this.lastTouched.set(remote);
    if (this.mode() === 'alias' || remote === 'A') {
      this.tv1.update(tv => ({
        ...tv,
        volume: Math.min(30, Math.max(0, tv.volume + delta))
      }));
    } else {
      this.tv2.update(tv => ({
        ...tv,
        volume: Math.min(30, Math.max(0, tv.volume + delta))
      }));
    }
  }

  togglePower(remote: 'A' | 'B'): void {
    this.lastTouched.set(remote);
    if (this.mode() === 'alias' || remote === 'A') {
      this.tv1.update(tv => ({ ...tv, power: !tv.power }));
    } else {
      this.tv2.update(tv => ({ ...tv, power: !tv.power }));
    }
  }
}
