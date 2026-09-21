import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface PlanetData {
  name: string;
  symbol: string;
  gravity: number; // m/s²
  color: string;
  size: number;
}

@Component({
  selector: 'app-solar-system-enum',
  standalone: true,
  imports: [FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">MODULE 08 · MÉCANISMES AVANCÉS</div>
        <h2>Static Factories, Enums Riches &amp; Ordre d'Initialisation Statique</h2>
        <p class="module-desc">
          Surmontez la contrainte de l'unique constructeur avec les <strong>fabriques statiques</strong>, exploitez le pattern <strong>Enum-like</strong> pour créer des instances uniques enrichies de méthodes métiers, et déjouez le piège mortel de l'ordre d'évaluation des champs statiques.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🪐 Le Système Solaire Enum-like</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 6 · Fabriques &amp; Enums)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="advanced-workbench">
          <!-- 1. Le Système Solaire Enum-like & Calculateur de Poids -->
          <div class="card-panel solar-system-panel">
            <div class="panel-header-row">
              <div class="ph-icon">🪐</div>
              <div>
                <h3>1. Pattern Enum-like : Instances Uniques &amp; Riches (Classe Planete)</h3>
                <span class="ph-sub">Constructeur privé + instances statiques immuables + calculs physiques</span>
              </div>
            </div>

            <div class="weight-calculator-bar">
              <span class="calc-label">Entrez votre masse corporelle sur Terre :</span>
              <div class="input-with-unit">
                <input type="number" [(ngModel)]="masseTerre" min="1" max="300" class="weight-input" />
                <span class="unit">kg</span>
              </div>
            </div>

            <!-- Liste des Planètes Statiques -->
            <div class="planets-cards-grid">
              @for (p of planets; track p.name) {
                <div class="planet-card" [style.border-color]="p.color">
                  <div class="planet-avatar" [style.background]="p.color" [style.width.px]="p.size" [style.height.px]="p.size">
                    <span>{{ p.symbol }}</span>
                  </div>

                  <div class="planet-info">
                    <div class="planet-title">Planete.{{ p.name.toUpperCase() }}</div>
                    <div class="planet-grav">Gravité : <strong>{{ p.gravity }} m/s²</strong></div>
                    <div class="planet-weight-res">
                      Poids : <strong>{{ calculateWeight(p.gravity) }} N</strong>
                      <span class="sub-weight">({{ (calculateWeight(p.gravity) / 9.81).toFixed(1) }} kg équiv.)</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="enum-like-code-note">
              <code>Planete.TERRE.calculerPoids(70)</code> appelle directement la méthode sur l'unique instance allouée en mémoire vive. Aucune nouvelle planète ne peut être créée de l'extérieur car <code>new Planete(...)</code> est privé.
            </div>
          </div>

          <!-- 2. Le Piège de l'Ordre d'Initialisation Statique -->
          <div class="card-panel timeline-panel">
            <div class="panel-header-row">
              <div class="ph-icon">⚠️</div>
              <div>
                <h3>2. Le Piège d'Ordre d'Initialisation des Membres Statiques</h3>
                <span class="ph-sub">Pourquoi déclarer _all après les instances provoque TypeError: _all is undefined</span>
              </div>
            </div>

            <div class="order-toggle-bar">
              <button 
                class="btn-secondary" 
                [class.btn-error-mode]="initOrder() === 'buggy'" 
                (click)="initOrder.set('buggy')"
              >
                ❌ Ordre Inversé (Crash à l'exécution)
              </button>
              <button 
                class="btn-secondary" 
                [class.btn-success-mode]="initOrder() === 'fixed'" 
                (click)="initOrder.set('fixed')"
              >
                ✅ Ordre Correct (Registre en tête)
              </button>
            </div>

            <div class="timeline-visual-grid">
              <!-- Code affiché -->
              <div class="timeline-code-col">
                <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Planete</span> &#123;
@if (initOrder() === 'buggy') {
  <span class="bad-line">// 💥 1. S'exécute en premier :</span>
  <span class="kw">static readonly</span> TERRE = <span class="kw">new</span> Planete("Terre", 9.81);
  <span class="kw">static readonly</span> MARS  = <span class="kw">new</span> Planete("Mars", 3.71);

  <span class="bad-line">// ⚠️ 2. N'a pas encore été initialisé !</span>
  <span class="kw">private static readonly</span> _all: Planete[] = [];
} @else {
  <span class="good-line">// ✨ 1. Initialisé EN PREMIER :</span>
  <span class="kw">private static readonly</span> _all: Planete[] = [];

  <span class="good-line">// ✅ 2. new Planete() peut pusher dans _all en toute sécurité :</span>
  <span class="kw">static readonly</span> TERRE = <span class="kw">new</span> Planete("Terre", 9.81);
  <span class="kw">static readonly</span> MARS  = <span class="kw">new</span> Planete("Mars", 3.71);
}

  <span class="kw">private constructor</span>(...) &#123;
    Planete._all.push(<span class="kw">this</span>);
  &#125;
&#125;</code></pre>
              </div>

              <!-- Diagnostic d'exécution -->
              <div class="timeline-status-col">
                @if (initOrder() === 'buggy') {
                  <div class="crash-card">
                    <div class="crash-badge">CRASH RUNTIME JAVASCRIPT</div>
                    <h4>TypeError: Cannot read properties of undefined (reading 'push')</h4>
                    <p>
                      <strong>Séquence d'événements :</strong><br>
                      1. Le moteur charge la classe <code>Planete</code>.<br>
                      2. Il exécute la ligne <code>new Planete("Terre")</code>.<br>
                      3. Le constructeur tourne et tente <code>Planete._all.push(this)</code>.<br>
                      4. 💥 Or, <code>_all</code> est déclaré plus bas ! Sa valeur courante est encore <code>undefined</code>.<br>
                      5. Le programme s'effondre immédiatement.
                    </p>
                  </div>
                } @else {
                  <div class="success-card">
                    <div class="success-badge">EXÉCUTION PARFAITE</div>
                    <h4>Planete.toutes().length = 2 planètes enregistrées</h4>
                    <p>
                      <strong>Séquence saine :</strong><br>
                      1. Le moteur évalue <code>_all = []</code> : un tableau vide est alloué en RAM.<br>
                      2. Le moteur évalue <code>TERRE = new Planete(...)</code> : le constructeur push sans encombre.<br>
                      3. Le moteur évalue <code>MARS = new Planete(...)</code> : deuxième push réussi.
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-lab-runner [labNumber]="6"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .advanced-workbench {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .solar-system-panel, .timeline-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .panel-header-row {
      display: flex;
      align-items: center;
      gap: 12px;

      .ph-icon { font-size: 1.8rem; }
      h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-main); }
      .ph-sub { font-size: 0.75rem; color: var(--text-muted); }
    }

    .weight-calculator-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--bg-subtle);
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid var(--border-color);

      .calc-label { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }

      .input-with-unit {
        display: flex;
        align-items: center;
        gap: 6px;

        .weight-input {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          color: #38bdf8;
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 1.1rem;
          padding: 6px 10px;
          border-radius: 6px;
          width: 90px;
        }

        .unit { font-weight: 700; color: var(--text-muted); }
      }
    }

    .planets-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 14px;
    }

    .planet-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-top: 3px solid;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center;
      box-shadow: var(--shadow-sm);

      .planet-avatar {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        span { font-size: 1.2rem; }
      }

      .planet-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;

        .planet-title {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.82rem;
          color: var(--text-main);
        }

        .planet-grav {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        .planet-weight-res {
          background: var(--bg-subtle);
          padding: 6px 8px;
          border-radius: 6px;
          margin-top: 4px;
          font-size: 0.85rem;
          color: #10b981;

          strong { font-family: var(--font-mono); }

          .sub-weight {
            display: block;
            font-size: 0.7rem;
            color: var(--text-dim);
          }
        }
      }
    }

    .enum-like-code-note {
      background: rgba(49, 120, 198, 0.08);
      border: 1px solid rgba(49, 120, 198, 0.25);
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 0.82rem;
      color: var(--text-muted);

      code { font-family: var(--font-mono); color: var(--ts-blue-light); }
    }

    .order-toggle-bar {
      display: flex;
      gap: 12px;

      .btn-error-mode {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border-color: #ef4444;
      }

      .btn-success-mode {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border-color: #10b981;
      }
    }

    .timeline-visual-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 16px;
    }

    .code-box {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #e2e8f0;
      line-height: 1.45;
      margin: 0;

      .kw { color: #f472b6; font-weight: 600; }
      .cls { color: #38bdf8; font-weight: 700; }
      .bad-line { color: #f87171; font-weight: 700; }
      .good-line { color: #34d399; font-weight: 700; }
    }

    .crash-card, .success-card {
      padding: 16px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 100%;

      .crash-badge {
        font-size: 0.7rem;
        font-weight: 800;
        color: #ef4444;
      }

      .success-badge {
        font-size: 0.7rem;
        font-weight: 800;
        color: #10b981;
      }

      h4 {
        font-size: 0.95rem;
        font-family: var(--font-mono);
      }

      p {
        font-size: 0.82rem;
        line-height: 1.45;
      }
    }

    .crash-card {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
    }

    .success-card {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #86efac;
    }
  `]
})
export class SolarSystemEnumComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');
  readonly masseTerre = signal<number>(70);
  readonly initOrder = signal<'buggy' | 'fixed'>('fixed');

  readonly planets: PlanetData[] = [
    { name: 'Mercure', symbol: '☿', gravity: 3.7, color: '#94a3b8', size: 40 },
    { name: 'Venus', symbol: '♀', gravity: 8.87, color: '#fb923c', size: 50 },
    { name: 'Terre', symbol: '♁', gravity: 9.81, color: '#38bdf8', size: 55 },
    { name: 'Lune', symbol: '☾', gravity: 1.62, color: '#cbd5e1', size: 36 },
    { name: 'Mars', symbol: '♂', gravity: 3.71, color: '#f87171', size: 45 },
    { name: 'Jupiter', symbol: '♃', gravity: 24.79, color: '#f59e0b', size: 75 }
  ];

  calculateWeight(gravity: number): number {
    return Math.round(this.masseTerre() * gravity);
  }
}
