import { Component, signal, model, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-component-comm',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 13 · Module 04</span>
          <span class="badge badge-purple">Communication Réactive</span>
          <span class="badge badge-blue">input · output · model</span>
          <span class="badge badge-success">Boîte à bananes [()]</span>
        </div>
        <h2>Communication Moderne : input(), output() & model()</h2>
        <p class="module-desc">
          Dites adieu aux décorateurs verbeux et aux EventEmitters RxJS ! Angular 22 unifie les flux inter-composants sous forme de signaux fortement typés, avec coercion automatique et liaison bidirectionnelle unifiée.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Banc d'Essai de Communication
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 3 · 5 Défis)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="comm-workbench">

          <!-- 1. COMPARATEUR ANCIEN MONDE VS SIGNAL-FIRST -->
          <div class="card-panel comm-card">
            <div class="card-head-row">
              <div class="badge-title">
                <span class="badge badge-purple">Comparateur</span>
                <h3>L'Évolution Historique : Décorateurs vs Fonctions Signal-First</h3>
              </div>
            </div>

            <div class="table-responsive mt-3">
              <table class="table custom-table">
                <thead>
                  <tr>
                    <th>Rôle</th>
                    <th>Ancien Monde (&lt; Angular 17)</th>
                    <th>Signal-First (Angular 22)</th>
                    <th>Avantage décisif</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Entrée standard</strong></td>
                    <td><code>@Input() val = 0;</code></td>
                    <td><code class="text-success">val = input(0);</code></td>
                    <td>Devient un <code>InputSignal&lt;T&gt;</code> en lecture seule.</td>
                  </tr>
                  <tr>
                    <td><strong>Entrée requise</strong></td>
                    <td><code>@Input(&#123; required: true &#125;) id!: string;</code></td>
                    <td><code class="text-success">id = input.required&lt;string&gt;();</code></td>
                    <td>Bloque la compilation TypeScript si omis. Zéro crash runtime.</td>
                  </tr>
                  <tr>
                    <td><strong>Émission d'événement</strong></td>
                    <td><code>@Output() evt = new EventEmitter();</code></td>
                    <td><code class="text-success">evt = output&lt;string&gt;();</code></td>
                    <td>Plus léger, fortement typé, libéré de la dépendance lourde RxJS.</td>
                  </tr>
                  <tr>
                    <td><strong>Liaison 2 sens</strong></td>
                    <td><code>@Input() v + @Output() vChange</code></td>
                    <td><code class="text-success">v = model(0);</code></td>
                    <td><strong>1 seule ligne</strong> synchronisée dans les deux sens !</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 2. PLAYGROUND INPUT() & TRANSFORM -->
          <div class="card-panel comm-card mt-3">
            <div class="card-head-row">
              <div class="badge-title">
                <span class="badge badge-blue">Playground</span>
                <h3>Coercition d'Attributs : booleanAttribute & numberAttribute</h3>
              </div>
            </div>

            <div class="grid-2-cols mt-3">
              <div class="sub-panel">
                <div class="panel-header-mini">Attribut Booléen (booleanAttribute)</div>
                <p class="sub-desc">Dans le code parent, comment écrivez-vous l'attribut ?</p>

                <div class="btn-group-mini">
                  <button class="btn-secondary btn-sm" [class.active]="boolInputRaw() === ''" (click)="setBoolAttr('')">
                    Présence seule : &lt;vignette promo /&gt;
                  </button>
                  <button class="btn-secondary btn-sm" [class.active]="boolInputRaw() === 'false'" (click)="setBoolAttr('false')">
                    Chaîne 'false' : &lt;vignette promo="false" /&gt;
                  </button>
                </div>

                <div class="transform-res-box mt-3">
                  <div>Valeur transmise en HTML : <code>{{ boolInputRaw() === '' ? '(présence attribut)' : '"' + boolInputRaw() + '"' }}</code></div>
                  <div class="res-pill mt-2">
                    Valeur reçue par le signal : <strong [class.text-success]="coercedBool()" [class.text-danger]="!coercedBool()">{{ coercedBool() }}</strong> (type boolean)
                  </div>
                </div>
              </div>

              <div class="sub-panel">
                <div class="panel-header-mini">Attribut Numérique (numberAttribute)</div>
                <p class="sub-desc">Conversion automatique d'une chaîne HTML en nombre :</p>

                <div class="input-inline-row">
                  <label>Saisie HTML brute :</label>
                  <input type="text" [value]="numInputRaw()" (input)="onNumInput($event)" class="num-field" />
                </div>

                <div class="transform-res-box mt-3">
                  <div>Type en JavaScript : <code>typeof {{ coercedNum() }} ➔ "{{ typeofNum() }}"</code></div>
                  <div class="res-pill mt-2">
                    Valeur numérique exploitable : <strong class="text-success">{{ coercedNum() }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. LE DÉMONSTRATEUR "BOÎTE À BANANES" MODEL() -->
          <div class="card-panel comm-card mt-3">
            <div class="card-head-row">
              <div class="badge-title">
                <span class="badge badge-success">model() en Action</span>
                <h3>Le Démonstrateur « Boîte à Bananes » [()] : Synchronisation Temps Réel</h3>
              </div>
            </div>

            <div class="banana-box-visualizer mt-3">
              <!-- Composant Parent -->
              <div class="component-block parent-block">
                <div class="comp-badge">🏠 COMPOSANT PARENT</div>
                <div class="comp-code-snippet">
                  <code>volumeParent = signal&lt;number&gt;({{ sharedVolume() }});</code><br>
                  <code class="banana-markup">&lt;app-stepper [(volume)]="volumeParent" /&gt;</code>
                </div>

                <div class="ctrl-row mt-3">
                  <label>Modifier depuis le parent :</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    [value]="sharedVolume()" 
                    (input)="onParentVolumeSlider($event)"
                    class="slider-range"
                  />
                  <span class="val-display">{{ sharedVolume() }}%</span>
                </div>
              </div>

              <div class="bidirectional-cable">
                <div class="cable-arrow-up">▲ Émission vers parent</div>
                <div class="cable-label">[(volume)]</div>
                <div class="cable-arrow-down">▼ Propagation vers enfant</div>
              </div>

              <!-- Composant Enfant -->
              <div class="component-block child-block">
                <div class="comp-badge">👶 COMPOSANT ENFANT (app-stepper)</div>
                <div class="comp-code-snippet">
                  <code>volume = model&lt;number&gt;(50);</code><br>
                  <code>this.volume.update(v =&gt; v + 10);</code>
                </div>

                <div class="ctrl-row mt-3">
                  <button class="btn-secondary btn-sm" (click)="stepChildVolume(-10)">
                    − 10%
                  </button>
                  <span class="val-display">{{ sharedVolume() }}%</span>
                  <button class="btn-primary btn-sm" (click)="stepChildVolume(+10)">
                    ＋ 10%
                  </button>
                </div>
              </div>
            </div>

            <div class="expl-mini mt-3 text-center">
              ✨ Modifiez le curseur dans le Parent ou cliquez sur les boutons de l'Enfant : les deux états restent <strong>strictement identiques</strong> sans aucun code d'écoute <code>(volumeChange)</code> manuel !
            </div>
          </div>

        </div>
      } @else {
        <!-- Mode Exercices : Labo 3 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="3"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .comm-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comm-card {
      padding: 20px;
    }

    .card-head-row h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-main);
      margin-top: 4px;
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;

      th {
        background: var(--bg-subtle);
        color: var(--text-muted);
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }

      td {
        padding: 10px 12px;
        border-bottom: 1px solid var(--border-color);
      }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .sub-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
    }

    .panel-header-mini {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--bs-purple-light);
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .sub-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    .btn-group-mini {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .transform-res-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      font-size: 0.8rem;
    }

    .res-pill {
      font-family: var(--font-mono);
      font-size: 0.82rem;
    }

    .input-inline-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;

      .num-field {
        width: 100px;
        padding: 4px 8px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: var(--text-main);
        font-family: var(--font-mono);
      }
    }

    /* Boîte à bananes */
    .banana-box-visualizer {
      display: grid;
      grid-template-columns: 1.2fr 0.6fr 1.2fr;
      gap: 14px;
      align-items: center;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .component-block {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .comp-badge {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--bs-purple-light);
    }

    .comp-code-snippet {
      background: var(--bg-code);
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.74rem;

      .banana-markup {
        color: #f59e0b;
        font-weight: 700;
      }
    }

    .ctrl-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.82rem;

      .slider-range {
        flex: 1;
      }

      .val-display {
        font-size: 1.1rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: #38bdf8;
        min-width: 50px;
      }
    }

    .bidirectional-cable {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 8px;
      border: 1px dashed var(--bs-purple);
      border-radius: 8px;
      background: var(--bg-subtle);

      .cable-label {
        font-size: 0.95rem;
        font-weight: 900;
        font-family: var(--font-mono);
        color: #f59e0b;
      }

      .cable-arrow-up, .cable-arrow-down {
        font-size: 0.68rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
    }
  `]
})
export class ComponentCommComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  readonly boolInputRaw = signal<string>('');
  readonly coercedBool = computed(() => {
    const val = this.boolInputRaw();
    return val !== 'false';
  });

  setBoolAttr(raw: string): void {
    this.boolInputRaw.set(raw);
  }

  readonly numInputRaw = signal<string>('42');
  readonly coercedNum = computed(() => {
    const n = parseFloat(this.numInputRaw());
    return isNaN(n) ? 0 : n;
  });
  readonly typeofNum = computed(() => typeof this.coercedNum());

  onNumInput(e: Event): void {
    this.numInputRaw.set((e.target as HTMLInputElement).value);
  }

  readonly sharedVolume = signal<number>(50);

  onParentVolumeSlider(e: Event): void {
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    this.sharedVolume.set(val);
  }

  stepChildVolume(delta: number): void {
    this.sharedVolume.update(v => Math.max(0, Math.min(100, v + delta)));
  }
}
