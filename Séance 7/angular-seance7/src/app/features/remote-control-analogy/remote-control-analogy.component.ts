import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

type DeviceType = 'Livre' | 'Film' | 'JeuVideo';

@Component({
  selector: 'app-remote-control-analogy',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 02</span>
          <span class="badge badge-purple">Type Statique vs Dynamique</span>
          <span class="badge badge-blue">Métaphore Clé</span>
        </div>
        <h2>L'Analogie de la Télécommande Universelle</h2>
        <p class="module-desc">
          Comment concilier le contrôle strict du compilateur TypeScript avec la flexibilité d'exécution de JavaScript au runtime ? Explorez la métaphore de la télécommande et de l'appareil branché.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Visualiseur Télécommande Universelle
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 2)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="remote-workbench">
          <!-- Sélecteur d'appareil à brancher en RAM -->
          <div class="device-selector-card card-panel">
            <div class="sel-label">
              <span class="step-num">1</span>
              <span>Choisissez l'appareil physique à instancier en RAM (Type Dynamique) :</span>
            </div>
            <div class="device-buttons">
              <button 
                class="device-pill" 
                [class.active]="selectedDevice() === 'Livre'"
                (click)="plugDevice('Livre')"
              >
                📖 new Livre("Clean Code", 2008, 464)
              </button>
              <button 
                class="device-pill" 
                [class.active]="selectedDevice() === 'Film'"
                (click)="plugDevice('Film')"
              >
                🎬 new Film("Inception", 2010, 148)
              </button>
              <button 
                class="device-pill" 
                [class.active]="selectedDevice() === 'JeuVideo'"
                (click)="plugDevice('JeuVideo')"
              >
                🎮 new JeuVideo("Zelda: BotW", 2017, "Switch")
              </button>
            </div>
          </div>

          <!-- Zone Interactive Métaphorique -->
          <div class="interactive-stage">
            <!-- La Télécommande (Type Statique Déclaré) -->
            <div class="remote-box card-panel">
              <div class="remote-badge">
                <span class="icon">🕹️</span>
                <span>TÉLÉCOMMANDE (Type Statique)</span>
              </div>
              <div class="type-tag">const m: Media</div>

              <div class="remote-buttons-grid">
                <button 
                  class="remote-btn" 
                  [class.active]="activeCommand() === 'titre'"
                  (click)="pressButton('titre')"
                >
                  <span class="btn-name">.titre</span>
                  <span class="btn-type">string</span>
                </button>

                <button 
                  class="remote-btn" 
                  [class.active]="activeCommand() === 'annee'"
                  (click)="pressButton('annee')"
                >
                  <span class="btn-name">.annee</span>
                  <span class="btn-type">number</span>
                </button>

                <button 
                  class="remote-btn action-btn" 
                  [class.active]="activeCommand() === 'getDescription'"
                  (click)="pressButton('getDescription')"
                >
                  <span class="btn-name">.getDescription()</span>
                  <span class="btn-type">string (Polymorphe)</span>
                </button>

                <!-- Boutons inexistants sur la télécommande -->
                <div class="ghost-btn" title="Inexistant sur Media : refusé par TypeScript !">
                  <span class="btn-name">🚫 .pages</span>
                  <span class="btn-type">Non déclaré</span>
                </div>

                <div class="ghost-btn" title="Inexistant sur Media : refusé par TypeScript !">
                  <span class="btn-name">🚫 .duree</span>
                  <span class="btn-type">Non déclaré</span>
                </div>
              </div>

              <div class="remote-footer">
                TypeScript vérifie uniquement ce boîtier. Si un bouton n'y est pas gravé, interdiction d'appuyer !
              </div>
            </div>

            <!-- Faisceau lumineux interactif -->
            <div class="beam-container">
              <div class="beam-cable">
                @if (isFiring()) {
                  <div class="light-pulse"></div>
                }
              </div>
              <div class="signal-label">
                @if (isFiring()) {
                  <span class="firing-tag">⚡ Envoi du signal: {{ activeCommand() }}()</span>
                } @else {
                  <span class="idle-tag">Câble de liaison dynamique</span>
                }
              </div>
            </div>

            <!-- L'Appareil Branché en RAM (Type Dynamique) -->
            <div class="device-box card-panel" [class.highlight]="isFiring()">
              <div class="device-badge">
                <span class="icon">🔌</span>
                <span>APPAREIL BRANCHÉ (Type Dynamique en RAM)</span>
              </div>
              <div class="device-class-tag">Instance effective : new {{ selectedDevice() }}()</div>

              <div class="device-internals">
                <div class="internal-chip">
                  <div class="chip-title">Circuit imprimé exécuté :</div>
                  <div class="chip-code">
                    @switch (selectedDevice()) {
                      @case ('Livre') {
                        <span>Livre.prototype.getDescription() :</span>
                        <code>return "Livre: " + this.titre + " — " + this.pages + " p.";</code>
                      }
                      @case ('Film') {
                        <span>Film.prototype.getDescription() :</span>
                        <code>return "Film: " + this.titre + " — " + this.duree + " min";</code>
                      }
                      @case ('JeuVideo') {
                        <span>JeuVideo.prototype.getDescription() :</span>
                        <code>return "Jeu: " + this.titre + " [" + this.plateforme + "]";</code>
                      }
                    }
                  </div>
                </div>

                <div class="screen-output">
                  <div class="screen-label">Écran de sortie (Résultat du signal) :</div>
                  <div class="screen-value">
                    {{ currentOutput() }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Inspecteur de Phase : Compilation vs Exécution -->
          <div class="card-panel inspector-panel">
            <h3 class="panel-title">🔍 Inspecteur de Phase : Ce qui se passe à chaque étape</h3>
            <div class="phases-grid">
              <div class="phase-card compile-phase">
                <div class="phase-header">
                  <span class="phase-icon">🛡️</span>
                  <div>
                    <h4>1. Phase de Compilation (TypeScript)</h4>
                    <span class="phase-moment">Avant l'exécution · Dans l'IDE / tsc</span>
                  </div>
                </div>
                <ul class="phase-points">
                  <li><strong>Ne regarde QUE la télécommande</strong> (<code>Media</code>).</li>
                  <li>Vérifie que la méthode <code>getDescription()</code> existe bien sur <code>Media</code>.</li>
                  <li>Interdit l'accès à <code>m.pages</code> ou <code>m.duree</code> car ces boutons n'existent pas sur la télécommande générale.</li>
                  <li>Garantit que le code ne plantera pas si un autre appareil est branché demain.</li>
                </ul>
              </div>

              <div class="phase-card runtime-phase">
                <div class="phase-header">
                  <span class="phase-icon">⚡</span>
                  <div>
                    <h4>2. Phase d'Exécution (JavaScript Runtime)</h4>
                    <span class="phase-moment">En cours d'exécution · Navigateur / V8</span>
                  </div>
                </div>
                <ul class="phase-points">
                  <li><strong>Ne regarde QUE l'appareil branché</strong> (l'instance en mémoire RAM).</li>
                  <li>Lorsque le signal <code>getDescription()</code> arrive, V8 résout l'adresse dans <code>{{ selectedDevice() }}.prototype</code>.</li>
                  <li>Exécute le code spécialisé de l'objet concret.</li>
                  <li>C'est la <strong>liaison tardive (*late binding*)</strong> !</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="2"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .remote-workbench {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .device-selector-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px 20px;

      .sel-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--text-main);

        .step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--bs-purple);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
      }

      .device-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .device-pill {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-family: var(--font-mono);
        font-weight: 600;
        background: var(--bg-subtle);
        color: var(--text-muted);
        border: 1px solid var(--border-color);

        &:hover {
          background: var(--bg-card-hover);
          color: var(--text-main);
        }

        &.active {
          background: rgba(14, 165, 233, 0.2);
          border-color: #0ea5e9;
          color: #38bdf8;
          box-shadow: 0 2px 10px rgba(14, 165, 233, 0.3);
        }
      }
    }

    .interactive-stage {
      display: grid;
      grid-template-columns: 1fr 120px 1fr;
      gap: 16px;
      align-items: center;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    .remote-box, .device-box {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 380px;
    }

    .remote-badge, .device-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--bs-purple-light);
    }

    .type-tag, .device-class-tag {
      font-family: var(--font-mono);
      font-size: 0.92rem;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 6px;
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      color: #38bdf8;
    }

    .remote-buttons-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .remote-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-main);

      .btn-name {
        font-family: var(--font-mono);
        font-weight: 700;
        font-size: 0.85rem;
      }

      .btn-type {
        font-size: 0.72rem;
        color: var(--text-muted);
      }

      &:hover {
        background: var(--bg-card-hover);
        border-color: var(--bs-purple);
      }

      &.active {
        border-color: var(--bs-purple);
        background: rgba(121, 82, 179, 0.25);
      }

      &.action-btn {
        background: linear-gradient(135deg, rgba(121, 82, 179, 0.2), rgba(14, 165, 233, 0.2));
        border-color: var(--bs-purple-light);
        .btn-name { color: #c084fc; }
      }
    }

    .ghost-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.05);
      border: 1px dashed rgba(239, 68, 68, 0.3);
      color: #94a3b8;
      cursor: not-allowed;
      opacity: 0.6;

      .btn-name {
        font-family: var(--font-mono);
        font-size: 0.82rem;
        color: #f87171;
      }

      .btn-type {
        font-size: 0.7rem;
        color: #fca5a5;
      }
    }

    .remote-footer {
      font-size: 0.76rem;
      color: var(--text-dim);
      font-style: italic;
      margin-top: auto;
    }

    /* Faisceau lumineux */
    .beam-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .beam-cable {
      width: 100%;
      height: 6px;
      background: #23304a;
      border-radius: 3px;
      position: relative;
      overflow: hidden;
    }

    .light-pulse {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 40px;
      background: linear-gradient(90deg, transparent, #38bdf8, #c084fc, transparent);
      box-shadow: 0 0 12px #38bdf8;
      animation: pulse-move 0.6s linear infinite;
    }

    @keyframes pulse-move {
      0% { left: -40px; }
      100% { left: 100%; }
    }

    .signal-label {
      font-size: 0.7rem;
      font-family: var(--font-mono);
      text-align: center;

      .firing-tag { color: #38bdf8; font-weight: 700; }
      .idle-tag { color: var(--text-dim); }
    }

    /* Device Box */
    .device-box {
      border-color: rgba(14, 165, 233, 0.3);
      transition: all 0.3s;

      &.highlight {
        border-color: #0ea5e9;
        box-shadow: 0 0 20px rgba(14, 165, 233, 0.35);
      }
    }

    .internal-chip {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;

      .chip-title {
        font-size: 0.74rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 6px;
      }

      .chip-code {
        font-size: 0.78rem;
        color: var(--text-main);
        display: flex;
        flex-direction: column;
        gap: 4px;

        code {
          color: #86efac;
          font-size: 0.8rem;
        }
      }
    }

    .screen-output {
      background: #000;
      border: 2px solid #23304a;
      border-radius: 6px;
      padding: 14px;
      font-family: var(--font-mono);

      .screen-label {
        font-size: 0.68rem;
        color: #64748b;
        margin-bottom: 4px;
        text-transform: uppercase;
      }

      .screen-value {
        font-size: 0.92rem;
        color: #38bdf8;
        font-weight: 700;
      }
    }

    .inspector-panel {
      padding: 20px;

      .panel-title {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 16px;
      }
    }

    .phases-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .phase-card {
      padding: 16px;
      border-radius: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);

      .phase-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;

        .phase-icon { font-size: 1.4rem; }

        h4 {
          font-size: 0.92rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-main);
        }

        .phase-moment {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
      }

      .phase-points {
        margin-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.8rem;
        color: var(--text-muted);

        strong { color: var(--text-main); }
      }

      &.compile-phase {
        border-color: rgba(121, 82, 179, 0.35);
      }

      &.runtime-phase {
        border-color: rgba(14, 165, 233, 0.35);
      }
    }
  `]
})
export class RemoteControlAnalogyComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');
  readonly selectedDevice = signal<DeviceType>('Livre');
  readonly activeCommand = signal<string>('getDescription');
  readonly isFiring = signal<boolean>(false);
  readonly currentOutput = signal<string>('Livre : « Clean Code » — 464 pages');

  plugDevice(type: DeviceType): void {
    this.selectedDevice.set(type);
    this.triggerSignal(this.activeCommand());
  }

  pressButton(cmd: string): void {
    this.activeCommand.set(cmd);
    this.triggerSignal(cmd);
  }

  private triggerSignal(cmd: string): void {
    this.isFiring.set(true);
    setTimeout(() => {
      this.isFiring.set(false);
      this.updateOutput(cmd);
    }, 450);
  }

  private updateOutput(cmd: string): void {
    const dev = this.selectedDevice();
    if (cmd === 'titre') {
      if (dev === 'Livre') this.currentOutput.set('"Clean Code"');
      else if (dev === 'Film') this.currentOutput.set('"Inception"');
      else this.currentOutput.set('"Zelda: BotW"');
    } else if (cmd === 'annee') {
      if (dev === 'Livre') this.currentOutput.set('2008');
      else if (dev === 'Film') this.currentOutput.set('2010');
      else this.currentOutput.set('2017');
    } else if (cmd === 'getDescription') {
      if (dev === 'Livre') this.currentOutput.set('Livre : « Clean Code » — 464 pages');
      else if (dev === 'Film') this.currentOutput.set('Film : « Inception » — 148 min');
      else this.currentOutput.set('Jeu : « Zelda: BotW » [Switch]');
    }
  }
}
