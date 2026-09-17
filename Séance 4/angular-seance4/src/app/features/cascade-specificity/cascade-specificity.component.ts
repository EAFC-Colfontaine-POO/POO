import { Component, signal, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

interface ArenaFighter {
  label: string;
  selector: string;
  inline: number;
  id: number;
  classes: number;
  elements: number;
  color: string;
}

@Component({
  selector: 'app-cascade-specificity',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Chapitre 03</span>
          <span class="badge badge-css">CSS3</span>
          <span class="badge badge-purple">Spécificité</span>
        </div>
        <h2>3. Cascade CSS & Calculateur de Spécificité (L'Arène des Sélecteurs)</h2>
        <p class="module-desc">
          Quand plusieurs règles CSS ciblent un même élément avec des styles contradictoires, le navigateur calcule un score précis de spécificité (Inline 1000 pts, ID 100 pts, Classe 10 pts, Balise 1 pt). À score égal, la dernière règle écrite l'emporte !
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'theory'"
            (click)="activeMode.set('theory')"
          >
            <span>📖 Arène de Duel & Spécificité</span>
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'lab'"
            (click)="activeMode.set('lab')"
          >
            <span>🧪 Ateliers Monaco (Labo 2 · Conflits de Cascade)</span>
          </button>
        </div>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. L'Arène de Spécificité -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>⚔️ L'Arène de Spécificité (Le Duel des Deux Règles)</h3>
            <div class="presets-row">
              <span class="presets-label">Duels Prédéfinis :</span>
              <button class="preset-btn" (click)="loadPreset(1)">Balise vs Classe</button>
              <button class="preset-btn" (click)="loadPreset(2)">Classe vs ID</button>
              <button class="preset-btn" (click)="loadPreset(3)">Complexe vs ID</button>
              <button class="preset-btn" (click)="loadPreset(4)">Style en Ligne</button>
            </div>
          </div>

          <p class="panel-sub">
            Deux règles CSS appliquent une couleur différente sur le même texte. Observez le décompte mathématique de points et le résultat final.
          </p>

          <div class="arena-grid">
            <!-- Combattant A -->
            <div class="fighter-card" [class.winner]="winner() === 'A'">
              <div class="fighter-head">
                <span class="fighter-badge a">Règle A</span>
                @if (winner() === 'A') {
                  <span class="winner-trophy">🏆 REMPORTE LA CASCADE</span>
                }
              </div>

              <div class="input-group">
                <label>Sélecteur CSS :</label>
                <input class="selector-input" [value]="fighterA().selector" (input)="updateSelector('A', $event)" />
              </div>

              <!-- Barème des 4 compteurs -->
              <div class="score-breakdown">
                <div class="score-col">
                  <span class="score-type">Inline (1000)</span>
                  <span class="score-val">{{ fighterA().inline }}</span>
                </div>
                <div class="score-col">
                  <span class="score-type">ID (100)</span>
                  <span class="score-val">{{ fighterA().id }}</span>
                </div>
                <div class="score-col">
                  <span class="score-type">Classe (10)</span>
                  <span class="score-val">{{ fighterA().classes }}</span>
                </div>
                <div class="score-col">
                  <span class="score-type">Balise (1)</span>
                  <span class="score-val">{{ fighterA().elements }}</span>
                </div>
              </div>

              <div class="total-score-box">
                <span>Score de Spécificité :</span>
                <span class="score-number">{{ scoreA() }} pts</span>
              </div>
            </div>

            <!-- VS Badge -->
            <div class="vs-divider">
              <div class="vs-circle">VS</div>
            </div>

            <!-- Combattant B -->
            <div class="fighter-card" [class.winner]="winner() === 'B'">
              <div class="fighter-head">
                <span class="fighter-badge b">Règle B</span>
                @if (winner() === 'B') {
                  <span class="winner-trophy">🏆 REMPORTE LA CASCADE</span>
                }
              </div>

              <div class="input-group">
                <label>Sélecteur CSS :</label>
                <input class="selector-input" [value]="fighterB().selector" (input)="updateSelector('B', $event)" />
              </div>

              <!-- Barème des 4 compteurs -->
              <div class="score-breakdown">
                <div class="score-col">
                  <span class="score-type">Inline (1000)</span>
                  <span class="score-val">{{ fighterB().inline }}</span>
                </div>
                <div class="score-col">
                  <span class="score-type">ID (100)</span>
                  <span class="score-val">{{ fighterB().id }}</span>
                </div>
                <div class="score-col">
                  <span class="score-type">Classe (10)</span>
                  <span class="score-val">{{ fighterB().classes }}</span>
                </div>
                <div class="score-col">
                  <span class="score-type">Balise (1)</span>
                  <span class="score-val">{{ fighterB().elements }}</span>
                </div>
              </div>

              <div class="total-score-box">
                <span>Score de Spécificité :</span>
                <span class="score-number">{{ scoreB() }} pts</span>
              </div>
            </div>
          </div>

          <!-- Rendu Visuel Gagnant -->
          <div class="arena-verdict-card">
            <div class="verdict-header">
              <span class="verdict-title">🎯 Rendu Visuel Final dans le Navigateur :</span>
              <span class="winner-badge">{{ winner() === 'A' ? 'Règle A appliquée' : 'Règle B appliquée' }}</span>
            </div>

            <div class="rendered-preview-box">
              <p class="preview-text" [style.color]="winnerColor()" [style.borderColor]="winnerColor()">
                Texte cible : &lt;p id="pied" class="carte"&gt;
              </p>
            </div>

            <div class="verdict-explanation">
              <strong>Explication de la cascade :</strong>
              <p>{{ explanationText() }}</p>
            </div>
          </div>
        </div>

        <!-- 2. Testeur de Sélecteurs Combinés -->
        <div class="card-panel">
          <div class="panel-head">
            <h3>🔬 Guide des Sélecteurs Combinés</h3>
            <span class="badge badge-css">Sélecteurs complexes</span>
          </div>

          <div class="table-responsive">
            <table class="selector-table">
              <thead>
                <tr>
                  <th>Sélecteur</th>
                  <th>Nom & Syntaxe</th>
                  <th>Signification concrète</th>
                  <th>Exemple d'application</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>div.carte</code></td>
                  <td>Élément + Classe</td>
                  <td>Cible spécifiquement un &lt;div&gt; portant la classe .carte (ignore les &lt;article class="carte"&gt;)</td>
                  <td><span class="badge badge-css">11 pts</span></td>
                </tr>
                <tr>
                  <td><code>.carte h3</code></td>
                  <td>Descendant (espace)</td>
                  <td>Cible tout titre &lt;h3&gt; situé n'importe où à l'intérieur d'une .carte</td>
                  <td><span class="badge badge-css">11 pts</span></td>
                </tr>
                <tr>
                  <td><code>ul &gt; li</code></td>
                  <td>Enfant direct (chevron)</td>
                  <td>Cible uniquement les &lt;li&gt; enfants directs du &lt;ul&gt; (pas les sous-listes)</td>
                  <td><span class="badge badge-css">2 pts</span></td>
                </tr>
                <tr>
                  <td><code>.btn:hover</code></td>
                  <td>Pseudo-classe</td>
                  <td>Cible le bouton au survol du curseur de la souris</td>
                  <td><span class="badge badge-css">20 pts</span></td>
                </tr>
                <tr>
                  <td><code>#monId</code></td>
                  <td>Identifiant unique</td>
                  <td>Prioritaire sur toutes les classes ordinaires</td>
                  <td><span class="badge badge-purple">100 pts</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <app-code-runner [labNumber]="2" exerciseId="ex-2-2"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 6px;

      h3 { font-size: 1.15rem; font-weight: 800; }
    }

    .presets-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;

      .presets-label {
        font-size: 0.76rem;
        color: var(--text-dim);
      }

      .preset-btn {
        padding: 4px 10px;
        border-radius: 6px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        font-size: 0.76rem;

        &:hover {
          color: var(--text-main);
          border-color: #7952b3;
          background: var(--bg-card-hover);
        }
      }
    }

    .panel-sub {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .arena-grid {
      display: grid;
      grid-template-columns: 1fr 60px 1fr;
      gap: 16px;
      align-items: center;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    .fighter-card {
      background: var(--bg-subtle);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.25s;

      &.winner {
        border-color: #10b981;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.25);
      }

      .fighter-head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .fighter-badge {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 4px;

          &.a { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
          &.b { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        }

        .winner-trophy {
          font-size: 0.72rem;
          font-weight: 800;
          color: #10b981;
        }
      }

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .selector-input {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-main);
          font-family: var(--font-mono);
          font-size: 0.88rem;

          &:focus {
            border-color: #7952b3;
            outline: none;
          }
        }
      }
    }

    .score-breakdown {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: var(--bg-card);
      padding: 10px;
      border-radius: 6px;
      text-align: center;

      .score-col {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .score-type {
          font-size: 0.65rem;
          color: var(--text-dim);
        }
        .score-val {
          font-size: 0.95rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #c4b5fd;
        }
      }
    }

    .total-score-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.84rem;
      font-weight: 600;

      .score-number {
        font-size: 1.1rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: #10b981;
      }
    }

    .vs-divider {
      display: flex;
      justify-content: center;

      .vs-circle {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #7952b3;
        color: white;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.5);
      }
    }

    .arena-verdict-card {
      margin-top: 20px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .verdict-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        font-weight: 700;

        .winner-badge {
          font-size: 0.75rem;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          padding: 2px 8px;
          border-radius: 4px;
        }
      }

      .rendered-preview-box {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 20px;
        display: flex;
        justify-content: center;

        .preview-text {
          font-size: 1.1rem;
          font-weight: 700;
          padding: 10px 20px;
          border: 2px solid;
          border-radius: 6px;
          transition: all 0.3s;
        }
      }

      .verdict-explanation {
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    .selector-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;

      th {
        text-align: left;
        padding: 10px 14px;
        background: var(--bg-subtle);
        color: var(--text-dim);
        font-weight: 700;
        border-bottom: 1px solid var(--border-color);
      }

      td {
        padding: 10px 14px;
        border-bottom: 1px solid var(--border-subtle);
        color: var(--text-muted);

        code {
          color: #c4b5fd;
          font-weight: 600;
        }
      }
    }
  `]
})
export class CascadeSpecificityComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');

  readonly fighterA = signal<ArenaFighter>({
    label: 'Règle A',
    selector: '.carte',
    inline: 0,
    id: 0,
    classes: 1,
    elements: 0,
    color: '#3b82f6'
  });

  readonly fighterB = signal<ArenaFighter>({
    label: 'Règle B',
    selector: '#pied',
    inline: 0,
    id: 1,
    classes: 0,
    elements: 0,
    color: '#ef4444'
  });

  readonly scoreA = computed(() => {
    const f = this.fighterA();
    return f.inline * 1000 + f.id * 100 + f.classes * 10 + f.elements * 1;
  });

  readonly scoreB = computed(() => {
    const f = this.fighterB();
    return f.inline * 1000 + f.id * 100 + f.classes * 10 + f.elements * 1;
  });

  readonly winner = computed<'A' | 'B'>(() => {
    const sa = this.scoreA();
    const sb = this.scoreB();
    if (sa > sb) return 'A';
    if (sb > sa) return 'B';
    return 'B'; // À égalité, la dernière règle gagne
  });

  readonly winnerColor = computed(() => {
    return this.winner() === 'A' ? this.fighterA().color : this.fighterB().color;
  });

  readonly explanationText = computed(() => {
    const sa = this.scoreA();
    const sb = this.scoreB();
    const selA = this.fighterA().selector;
    const selB = this.fighterB().selector;

    if (sa > sb) {
      return `La règle A (${selA}) totalise ${sa} points contre ${sb} points pour la règle B (${selB}). Son niveau de spécificité supérieur écrase la règle concurrente.`;
    } else if (sb > sa) {
      return `La règle B (${selB}) totalise ${sb} points contre ${sa} points pour la règle A (${selA}). Son niveau de spécificité supérieur écrase la règle concurrente.`;
    } else {
      return `Égalité parfaite (${sa} pts contre ${sb} pts) ! En vertu de la cascade CSS, la dernière règle écrite dans la feuille de style (Règle B) l'emporte.`;
    }
  });

  updateSelector(fighter: 'A' | 'B', event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const parsed = this.parseSelector(val);

    if (fighter === 'A') {
      this.fighterA.update(f => ({ ...f, selector: val, ...parsed }));
    } else {
      this.fighterB.update(f => ({ ...f, selector: val, ...parsed }));
    }
  }

  loadPreset(num: number): void {
    switch (num) {
      case 1:
        this.fighterA.set({ label: 'Règle A', selector: 'p', inline: 0, id: 0, classes: 0, elements: 1, color: '#3b82f6' });
        this.fighterB.set({ label: 'Règle B', selector: '.carte', inline: 0, id: 0, classes: 1, elements: 0, color: '#10b981' });
        break;
      case 2:
        this.fighterA.set({ label: 'Règle A', selector: '.carte', inline: 0, id: 0, classes: 1, elements: 0, color: '#3b82f6' });
        this.fighterB.set({ label: 'Règle B', selector: '#pied', inline: 0, id: 1, classes: 0, elements: 0, color: '#ef4444' });
        break;
      case 3:
        this.fighterA.set({ label: 'Règle A', selector: 'div.container header nav a.btn.active', inline: 0, id: 0, classes: 4, elements: 4, color: '#3b82f6' });
        this.fighterB.set({ label: 'Règle B', selector: '#lien-accueil', inline: 0, id: 1, classes: 0, elements: 0, color: '#8b5cf6' });
        break;
      case 4:
        this.fighterA.set({ label: 'Règle A', selector: '#titre.important', inline: 0, id: 1, classes: 1, elements: 0, color: '#3b82f6' });
        this.fighterB.set({ label: 'Règle B', selector: 'style="..." (En-ligne)', inline: 1, id: 0, classes: 0, elements: 0, color: '#f59e0b' });
        break;
    }
  }

  private parseSelector(sel: string): { inline: number; id: number; classes: number; elements: number } {
    if (sel.includes('style=')) {
      return { inline: 1, id: 0, classes: 0, elements: 0 };
    }

    const ids = (sel.match(/#[a-zA-Z0-9_-]+/g) || []).length;
    const classes = (sel.match(/\.[a-zA-Z0-9_-]+/g) || []).length + (sel.match(/:[a-zA-Z0-9_-]+/g) || []).length;
    // Balises simples (mots hors préfixes # ou .)
    const cleaned = sel.replace(/#[a-zA-Z0-9_-]+/g, '').replace(/\.[a-zA-Z0-9_-]+/g, '').replace(/:[a-zA-Z0-9_-]+/g, '');
    const elements = (cleaned.match(/[a-zA-Z0-9]+/g) || []).length;

    return { inline: 0, id: ids, classes, elements };
  }
}
