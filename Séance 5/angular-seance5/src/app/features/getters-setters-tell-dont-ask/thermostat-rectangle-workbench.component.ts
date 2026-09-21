import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-thermostat-rectangle-workbench',
  standalone: true,
  imports: [FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 07 · ACCESSEURS &amp; INTENTION</div>
        <h2>Accesseurs (get / set), Propriétés Calculées &amp; "Tell, Don't Ask"</h2>
        <p class="module-desc">
          Les accesseurs interceptent la lecture et l'écriture pour valider les données à la volée. Les propriétés calculées évitent les bugs de désynchronisation. Enfin, le principe <em>« Don't just get and set, tell the object what to do ! »</em> redonne aux méthodes leur rôle de commande métier.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🌡️ Le Banc d'Essai Thermostat &amp; Rectangle</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 4 · Getters, Setters &amp; Tell Don't Ask)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="workbench-grid">
          <!-- 1. Banc d'Essai Thermostat (Setter avec validation + Tell Don't Ask) -->
          <div class="card-panel demo-card">
            <div class="card-title-row">
              <div class="card-icon">🌡️</div>
              <div>
                <h3>1. Thermostat Intelligent (Validation [5°C - 30°C])</h3>
                <span class="card-sub">Interception setter &amp; méthodes d'intention métier</span>
              </div>
            </div>

            <!-- Jauge Thermostat -->
            <div class="thermostat-display">
              <div class="therm-dial">
                <div class="temp-big">{{ temperature() }}°C</div>
                <div class="temp-status">Consigne de confort</div>
              </div>

              <!-- Jauge colorée -->
              <div class="temp-meter">
                <div class="meter-bar" [style.height.%]="(temperature() / 35) * 100"></div>
                <div class="meter-mark max">30°C Max</div>
                <div class="meter-mark min">5°C Min</div>
              </div>
            </div>

            <!-- Commandes -->
            <div class="thermostat-controls">
              <div class="slider-row">
                <label>Setter direct : <code>t.temperature = {{ temperature() }}</code></label>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  [ngModel]="temperature()" 
                  (ngModelChange)="onSliderChange($event)"
                  class="temp-slider"
                />
              </div>

              <div class="tell-dont-ask-buttons">
                <div class="tda-label">✨ Approche "Tell, Don't Ask" (Méthodes d'action) :</div>
                <div class="btn-group">
                  <button class="btn-secondary" (click)="tellAugmenter(1)">t.augmenter(1°C)</button>
                  <button class="btn-secondary" (click)="tellAugmenter(5)">t.augmenter(5°C)</button>
                  <button class="btn-secondary" (click)="tellDiminuer(1)">t.diminuer(1°C)</button>
                  <button class="btn-secondary btn-danger" (click)="attemptBadTemp(45)">Injecter 45°C (Crash-Test)</button>
                </div>
              </div>
            </div>

            <!-- Alerte Setter -->
            @if (thermoError()) {
              <div class="thermo-error-alert">
                <span>💥 <strong>Exception interceptée :</strong> {{ thermoError() }}</span>
              </div>
            } @else {
              <div class="thermo-ok-alert">
                <span>✅ Invariant respecté : la température reste dans la plage légale [5°C - 30°C].</span>
              </div>
            }
          </div>

          <!-- 2. Banc d'Essai Rectangle (Propriété Calculée Dynamique) -->
          <div class="card-panel demo-card">
            <div class="card-title-row">
              <div class="card-icon">📐</div>
              <div>
                <h3>2. Rectangle &amp; Propriété Calculée (aire)</h3>
                <span class="card-sub">Synchronisation automatique sans attribut redondant</span>
              </div>
            </div>

            <!-- SVG Interactif du Rectangle -->
            <div class="svg-container">
              <svg width="100%" height="180" viewBox="0 0 300 180" class="rect-svg">
                <rect 
                  [attr.x]="150 - (largeur() * 1.5)" 
                  [attr.y]="90 - (hauteur() * 1.5)" 
                  [attr.width]="largeur() * 3" 
                  [attr.height]="hauteur() * 3" 
                  rx="6"
                  fill="rgba(49, 120, 198, 0.25)"
                  stroke="#3178c6"
                  stroke-width="2"
                />
                <text 
                  x="150" 
                  y="95" 
                  text-anchor="middle" 
                  fill="#ffffff" 
                  font-family="monospace" 
                  font-weight="bold"
                  font-size="14"
                >
                  aire = {{ aire() }} cm²
                </text>
              </svg>
            </div>

            <!-- Sliders Largeur & Hauteur -->
            <div class="rect-controls">
              <div class="slider-item">
                <div class="slider-label">
                  <span>Largeur (largeur) :</span>
                  <strong>{{ largeur() }} cm</strong>
                </div>
                <input type="range" min="10" max="80" [(ngModel)]="largeur" class="dim-slider" />
              </div>

              <div class="slider-item">
                <div class="slider-label">
                  <span>Hauteur (hauteur) :</span>
                  <strong>{{ hauteur() }} cm</strong>
                </div>
                <input type="range" min="10" max="50" [(ngModel)]="hauteur" class="dim-slider" />
              </div>
            </div>

            <!-- Explication Propriété Calculée -->
            <div class="computed-explanation">
              <div class="formula-box">
                <code>get aire(): number &#123; return this.largeur * this.hauteur; &#125;</code>
              </div>
              <ul class="computed-benefits">
                <li><strong>Zéro redondance</strong> : aucun attribut <code>_aire</code> n'est stocké en mémoire.</li>
                <li><strong>Synchronisation parfaite</strong> : impossible d'avoir une aire fausse si les côtés changent.</li>
                <li><strong>Lecture seule native</strong> : écrire <code>r.aire = 500</code> est impossible car aucun setter n'existe.</li>
              </ul>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="4"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .workbench-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .demo-card {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .card-title-row {
        display: flex;
        align-items: center;
        gap: 12px;

        .card-icon { font-size: 1.8rem; }
        h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-main); }
        .card-sub { font-size: 0.75rem; color: var(--text-muted); }
      }
    }

    .thermostat-display {
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;

      .therm-dial {
        display: flex;
        flex-direction: column;
        align-items: center;

        .temp-big {
          font-size: 2.5rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #f59e0b;
        }

        .temp-status {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      }

      .temp-meter {
        width: 24px;
        height: 100px;
        background: var(--bg-subtle);
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border-color);

        .meter-bar {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: linear-gradient(180deg, #ef4444, #f59e0b, #3b82f6);
          border-radius: 12px;
          transition: height 0.3s;
        }

        .meter-mark {
          position: absolute;
          font-size: 0.6rem;
          font-family: var(--font-mono);
          color: var(--text-dim);
          white-space: nowrap;

          &.max { top: 4px; left: 28px; }
          &.min { bottom: 4px; left: 28px; }
        }
      }
    }

    .thermostat-controls {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .slider-row {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 0.8rem;
          color: var(--text-muted);
          code { font-family: var(--font-mono); color: var(--text-main); }
        }

        .temp-slider {
          width: 100%;
          accent-color: #f59e0b;
          cursor: pointer;
        }
      }
    }

    .tell-dont-ask-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .tda-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--ts-blue-light);
      }

      .btn-group {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;

        button { font-size: 0.76rem; padding: 6px 10px; font-family: var(--font-mono); }
        .btn-danger { color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
      }
    }

    .thermo-error-alert {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      padding: 10px;
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .thermo-ok-alert {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #86efac;
      padding: 10px;
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .svg-container {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rect-controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;

      .slider-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .slider-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted);
          strong { color: var(--text-main); font-family: var(--font-mono); }
        }

        .dim-slider {
          width: 100%;
          accent-color: var(--ts-blue);
          cursor: pointer;
        }
      }
    }

    .computed-explanation {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .formula-box {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        color: #38bdf8;
      }

      .computed-benefits {
        padding-left: 18px;
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.45;
        li { margin-bottom: 4px; }
      }
    }
  `]
})
export class ThermostatRectangleWorkbenchComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  // Thermostat state
  readonly temperature = signal<number>(20);
  readonly thermoError = signal<string | null>(null);

  // Rectangle state
  readonly largeur = signal<number>(40);
  readonly hauteur = signal<number>(25);

  readonly aire = computed(() => {
    return this.largeur() * this.hauteur();
  });

  onSliderChange(newVal: any): void {
    const num = Number(newVal);
    if (num < 5 || num > 30) {
      this.thermoError.set(`Hors bornes [5-30°C] : tentative de régler sur ${num}°C refusée par le setter !`);
    } else {
      this.thermoError.set(null);
      this.temperature.set(num);
    }
  }

  tellAugmenter(delta: number): void {
    const next = this.temperature() + delta;
    if (next > 30) {
      this.temperature.set(30);
      this.thermoError.set('Plafond maximal atteint (30°C). La méthode augmenter() a plafonné la valeur.');
    } else {
      this.thermoError.set(null);
      this.temperature.set(next);
    }
  }

  tellDiminuer(delta: number): void {
    const next = this.temperature() - delta;
    if (next < 5) {
      this.temperature.set(5);
      this.thermoError.set('Hors-gel minimal atteint (5°C). La méthode diminuer() a planché la valeur.');
    } else {
      this.thermoError.set(null);
      this.temperature.set(next);
    }
  }

  attemptBadTemp(badVal: number): void {
    this.thermoError.set(`throw new Error("Hors bornes [5-30]") : ${badVal}°C est une valeur dangereuse bloquée par le setter !`);
  }
}
