import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-stringify-encapsulation',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 03 · Sérialisation &amp; Encapsulation</div>
        <h2>Laboratoire JSON.stringify &amp; Encapsulation (toJSON)</h2>
        <p class="module-desc">
          Découvrez la signature complète <code>JSON.stringify(valeur, replacer?, space?)</code> :
          maîtrisez le formatage avec <code>space</code>, filtrez les clés avec le <code>replacer</code>,
          et donnez à vos classes le contrôle absolu de leur divulgation grâce à la méthode magique <code>toJSON()</code>.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeTab() === 'sandbox'" (click)="activeTab.set('sandbox')">
              🎛️ Bac à Sable : replacer &amp; space
            </button>
            <button class="mode-tab-btn" [class.active]="activeTab() === 'tojson'" (click)="activeTab.set('tojson')">
              🔒 Le Démonstrateur toJSON() &amp; Encapsulation
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 2 ➔
          </button>
        </div>
      </div>

      <!-- ONGLET 1 : BAC À SABLE JSON.STRINGIFY -->
      @if (activeTab() === 'sandbox') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">1</span>
              <div>
                <h3 class="zone-title">Bac à Sable des Paramètres Avancés</h3>
                <p class="zone-subtitle">Modifiez les paramètres <code>replacer</code> et <code>space</code> et observez en direct la chaîne produite.</p>
              </div>
            </div>

            <div class="signature-badge">
              <code>JSON.stringify(val, replacer, space)</code>
            </div>
          </div>

          <!-- Contrôles interactifs -->
          <div class="controls-toolbar">
            <div class="control-group">
              <label class="ctrl-label">1. Paramètre <code>space</code> (Indentation) :</label>
              <div class="btn-segmented">
                <button [class.active]="spaceChoice() === 0" (click)="spaceChoice.set(0)">Compact (0)</button>
                <button [class.active]="spaceChoice() === 2" (click)="spaceChoice.set(2)">2 Espaces</button>
                <button [class.active]="spaceChoice() === 4" (click)="spaceChoice.set(4)">4 Espaces</button>
                <button [class.active]="spaceChoice() === 'tab'" (click)="spaceChoice.set('tab')">Tabulation</button>
              </div>
            </div>

            <div class="control-group">
              <label class="ctrl-label">2. Paramètre <code>replacer</code> (Filtrage / Mutation) :</label>
              <div class="btn-segmented">
                <button [class.active]="replacerMode() === 'none'" (click)="replacerMode.set('none')">
                  Aucun (Tous les champs)
                </button>
                <button [class.active]="replacerMode() === 'whitelist'" (click)="replacerMode.set('whitelist')">
                  Liste Blanche (['id', 'pseudo', 'email'])
                </button>
                <button [class.active]="replacerMode() === 'mask-fn'" (click)="replacerMode.set('mask-fn')">
                  Fonction (Masquer motDePasse)
                </button>
                <button [class.active]="replacerMode() === 'transform-fn'" (click)="replacerMode.set('transform-fn')">
                  Fonction (Masquer + Formater soldePoints)
                </button>
              </div>
            </div>
          </div>

          <div class="sandbox-grid">
            <!-- Source en RAM -->
            <div class="sandbox-col">
              <div class="col-bar">
                <span>🧠 Objet Source en RAM (TypeScript) :</span>
              </div>
              <pre class="code-pre"><code>{{ sampleUserCode }}</code></pre>

              <div class="replacer-code-note">
                <span class="note-tag">Replacer appliqué :</span>
                <code>{{ activeReplacerDescription() }}</code>
              </div>
            </div>

            <!-- Sortie générée -->
            <div class="sandbox-col">
              <div class="col-bar output-bar">
                <span>📄 Sortie JSON Générée :</span>
                <span class="badge badge-success">{{ outputJsonBytes() }} octets</span>
              </div>
              <pre class="code-pre output-pre"><code>{{ generatedJsonOutput() }}</code></pre>

              <div class="output-analysis">
                <strong>Analyse du résultat :</strong>
                <p>{{ outputAnalysisText() }}</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 2 : DÉMONSTRATEUR TOJSON() -->
      @if (activeTab() === 'tojson') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">2</span>
              <div>
                <h3 class="zone-title">Le Démonstrateur toJSON() &amp; Encapsulation POO</h3>
                <p class="zone-subtitle">La classe choisit elle-même sa frontière de divulgation : JSON.stringify() lui délègue prioritairement le travail.</p>
              </div>
            </div>

            <div class="toggle-mode-btn-group">
              <button class="btn-secondary" [class.active]="withToJson()" (click)="withToJson.set(true)">
                🛡️ Classe avec toJSON() Protecteur
              </button>
              <button class="btn-secondary" [class.danger-active]="!withToJson()" (click)="withToJson.set(false)">
                ⚠️ Sans toJSON() (Objet Brut Sans Protection)
              </button>
            </div>
          </div>

          <div class="tojson-grid">
            <!-- Code de la classe CompteBancaire -->
            <div class="class-col">
              <div class="col-bar">
                <span>🏛️ Code de la Classe POO (CompteBancaire.ts)</span>
                <span class="badge badge-ts">Encapsulation Séance 05</span>
              </div>

              <pre class="code-pre class-code"><code>{{ activeClassCode() }}</code></pre>
            </div>

            <!-- Exécution & Sortie JSON -->
            <div class="exec-col">
              <div class="col-bar">
                <span>⚡ Exécution : const json = JSON.stringify(compte, null, 2);</span>
              </div>

              <pre class="code-pre output-pre" [class.warning-border]="!withToJson()"><code>{{ activeToJsonOutput() }}</code></pre>

              <div class="security-card" [class.secure]="withToJson()" [class.insecure]="!withToJson()">
                <div class="sec-header">
                  <span class="sec-icon">{{ withToJson() ? '🛡️ Protection Active' : '🚨 Fuite Potentielle de Données' }}</span>
                  <span class="badge" [class.badge-success]="withToJson()" [class.badge-red]="!withToJson()">
                    {{ withToJson() ? 'CONFORME POO' : 'DANGER SÉCURITÉ' }}
                  </span>
                </div>
                <p class="sec-desc">
                  @if (withToJson()) {
                    La méthode <code>toJSON()</code> est appelée automatiquement par le sérialiseur natif ! Le <code>#codeSecret</code> et le <code>#pin</code> ne sont jamais inclus dans le flux de sortie. La classe contrôle sa frontière de persistance.
                  } @else {
                    Sans <code>toJSON()</code>, un appel standard à <code>JSON.stringify</code> exposerait toutes les propriétés publiques sans aucun filtre ni formatage spécifique de date d'export.
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .zone-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
      margin-bottom: 16px;
    }

    .zone-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(147, 51, 234, 0.2);
      color: #c084fc;
      font-weight: 800;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .zone-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .zone-subtitle {
      font-size: 0.84rem;
      color: var(--text-muted);
    }

    .signature-badge {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      color: #60a5fa;
    }

    /* Controls Toolbar */
    .controls-toolbar {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 16px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .ctrl-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .btn-segmented {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      button {
        padding: 5px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.78rem;
        color: var(--text-muted);
        font-weight: 600;

        &:hover {
          color: var(--text-main);
          border-color: var(--border-focus);
        }

        &.active {
          background: #3178c6;
          border-color: #3b82f6;
          color: #ffffff;
        }
      }
    }

    /* Sandbox Grid */
    .sandbox-grid, .tojson-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .sandbox-col, .class-col, .exec-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .col-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .code-pre {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      font-size: 0.78rem;
      font-family: var(--font-mono);
      color: #e2e8f0;
      line-height: 1.4;
      overflow-x: auto;
      flex: 1;

      &.output-pre {
        color: #34d399;
      }

      &.warning-border {
        border-color: rgba(239, 68, 68, 0.4);
      }
    }

    .replacer-code-note {
      font-size: 0.75rem;
      background: var(--bg-card);
      padding: 8px 12px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .note-tag {
        font-weight: 700;
        color: var(--text-muted);
      }
      code {
        color: #60a5fa;
        font-family: var(--font-mono);
      }
    }

    .output-analysis {
      background: var(--bg-card);
      border-left: 3px solid #3b82f6;
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      font-size: 0.78rem;
      color: var(--text-main);

      p {
        margin-top: 4px;
        color: var(--text-muted);
      }
    }

    /* toJSON Demonstrator */
    .toggle-mode-btn-group {
      display: flex;
      gap: 8px;

      button {
        &.active {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #34d399;
        }
        &.danger-active {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #f87171;
        }
      }
    }

    .security-card {
      padding: 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 6px;

      &.secure {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #86efac;
      }
      &.insecure {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      .sec-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
      }
      .sec-desc {
        color: var(--text-muted);
        line-height: 1.4;
      }
    }
  `]
})
export class StringifyEncapsulationComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly activeTab = signal<'sandbox' | 'tojson'>('sandbox');

  // Sandbox State
  readonly spaceChoice = signal<number | string>(2);
  readonly replacerMode = signal<'none' | 'whitelist' | 'mask-fn' | 'transform-fn'>('none');

  readonly sampleUserCode = `const utilisateur = {
  id: 104,
  pseudo: "Alice",
  motDePasse: "argon2$secretSalt$987654",
  email: "alice@eafc.be",
  soldePoints: 1500,
  derniereConnexion: "2026-10-28T12:00:00.000Z"
};`;

  readonly rawUserObject = {
    id: 104,
    pseudo: "Alice",
    motDePasse: "argon2$secretSalt$987654",
    email: "alice@eafc.be",
    soldePoints: 1500,
    derniereConnexion: "2026-10-28T12:00:00.000Z"
  };

  readonly activeReplacerDescription = computed<string>(() => {
    switch (this.replacerMode()) {
      case 'none': return 'null (aucun filtrage, sérialisation exhaustive)';
      case 'whitelist': return "['id', 'pseudo', 'email'] (Tableau de chaînes en liste blanche)";
      case 'mask-fn': return "(cle, val) => cle === 'motDePasse' ? undefined : val (Fonction évinçant le mot de passe)";
      case 'transform-fn': return "(cle, val) => cle === 'motDePasse' ? undefined : (cle === 'soldePoints' ? `${val} pts` : val)";
    }
  });

  readonly generatedJsonOutput = computed<string>(() => {
    const space = this.spaceChoice() === 'tab' ? '\t' : (this.spaceChoice() as number);

    switch (this.replacerMode()) {
      case 'none':
        return JSON.stringify(this.rawUserObject, null, space);

      case 'whitelist':
        return JSON.stringify(this.rawUserObject, ['id', 'pseudo', 'email'], space);

      case 'mask-fn':
        return JSON.stringify(this.rawUserObject, (cle, val) => {
          if (cle === 'motDePasse') return undefined;
          return val;
        }, space);

      case 'transform-fn':
        return JSON.stringify(this.rawUserObject, (cle, val) => {
          if (cle === 'motDePasse') return undefined;
          if (cle === 'soldePoints') return `${val} points bonus`;
          return val;
        }, space);
    }
  });

  readonly outputJsonBytes = computed<number>(() => {
    return new TextEncoder().encode(this.generatedJsonOutput()).length;
  });

  readonly outputAnalysisText = computed<string>(() => {
    switch (this.replacerMode()) {
      case 'none':
        return "⚠️ Toutes les propriétés publiques sont exposées, y compris le mot de passe hashé. Ce format est dangereux pour une API publique.";
      case 'whitelist':
        return "✅ Le tableau ['id', 'pseudo', 'email'] a agi comme une barrière étanche. Le mot de passe et le solde ont été purement éliminés.";
      case 'mask-fn':
        return "✅ Renvoyer undefined dans la fonction a fait disparaître la clé motDePasse de la chaîne JSON finale.";
      case 'transform-fn':
        return "✨ En plus d'évincer le mot de passe, la fonction replacer a converti soldePoints en chaîne formatée avec devise.";
    }
  });

  // toJSON Demonstrator State
  readonly withToJson = signal<boolean>(true);

  readonly activeClassCode = computed<string>(() => {
    if (this.withToJson()) {
      return `export class CompteBancaire {
  readonly #iban: string;
  #solde: number;
  readonly #pin: string; // 🔒 Donnée sensible

  constructor(iban: string, solde: number, pin: string) {
    this.#iban = iban;
    this.#solde = solde;
    this.#pin = pin;
  }

  // 👑 Hook invoqué automatiquement par JSON.stringify() :
  toJSON(): object {
    return {
      iban: this.#iban,
      solde: this.#solde,
      exporteLe: new Date().toISOString()
      // #pin est délibérément exclu : protection absolue !
    };
  }
}

const compte = new CompteBancaire("BE76-1234-5678-9012", 2450.50, "PIN-8842");`;
    } else {
      return `export class CompteBancaireNaif {
  public iban: string;
  public solde: number;
  public pin: string; // ⚠️ Public : fuite garantie !

  constructor(iban: string, solde: number, pin: string) {
    this.iban = iban;
    this.solde = solde;
    this.pin = pin;
  }
  // Aucune méthode toJSON() déclarée :
}

const compte = new CompteBancaireNaif("BE76-1234-5678-9012", 2450.50, "PIN-8842");`;
    }
  });

  readonly activeToJsonOutput = computed<string>(() => {
    if (this.withToJson()) {
      return `{\n  "iban": "BE76-1234-5678-9012",\n  "solde": 2450.5,\n  "exporteLe": "2026-10-28T20:30:00.000Z"\n}`;
    } else {
      return `{\n  "iban": "BE76-1234-5678-9012",\n  "solde": 2450.5,\n  "pin": "PIN-8842"\n}`;
    }
  });

  jumpToLab(): void {
    this.exercises.setFilterLab(2);
    this.nav.setTab('workshops-lab');
  }
}
