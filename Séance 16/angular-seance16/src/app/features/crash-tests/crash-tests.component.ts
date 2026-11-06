import { Component, signal, computed, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-crash-tests',
  standalone: true,
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 06 · Crash-Tests &amp; Anti-Patterns</div>
        <h2>Salle des Crash-Tests (Anti-Patterns &amp; Références Circulaires)</h2>
        <p class="module-desc">
          Certaines structures d'objets courantes en mémoire vive provoquent un blocage ou un crash instantané lors du passage en JSON.
          Désamorcez les deux plus grands pièges classiques : <strong>la référence circulaire infinie</strong> et <strong>le syndrome de la Date fantôme</strong>.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeTab() === 'circular'" (click)="activeTab.set('circular')">
              ♾️ Références Circulaires (Boucle Infinie)
            </button>
            <button class="mode-tab-btn" [class.active]="activeTab() === 'date-trap'" (click)="activeTab.set('date-trap')">
              📅 Le Piège de la Date Fantôme &amp; Reviver
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Aller aux Exercices Pratiques ➔
          </button>
        </div>
      </div>

      <!-- ONGLET 1 : RÉFÉRENCES CIRCULAIRES -->
      @if (activeTab() === 'circular') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">1</span>
              <div>
                <h3 class="zone-title">Simulateur de Référence Circulaire (Parent ⟷ Enfant)</h3>
                <p class="zone-subtitle">Déclenchez le crash réel du moteur JavaScript et découvrez les solutions d'architecture.</p>
              </div>
            </div>

            <button class="btn-primary" (click)="triggerCircularCrash()">
              💥 Déclencher JSON.stringify(parent)
            </button>
          </div>

          <div class="circular-grid">
            <!-- Schéma de la boucle -->
            <div class="loop-col">
              <div class="col-bar">
                <span>Graphe Mémoire en RAM (Boucle Infinie) :</span>
              </div>

              <div class="loop-visual-card">
                <div class="node-box parent-node">
                  <div class="node-title">Objet Parent (&commat;0x01)</div>
                  <div class="node-prop">nom: "Dossier Racine"</div>
                  <div class="node-prop">enfant: &commat;0x02</div>
                </div>

                <div class="infinite-arrows">
                  <div class="arrow-down">⬇️ parent.enfant = enfant</div>
                  <div class="arrow-up">⬆️ enfant.parent = parent</div>
                </div>

                <div class="node-box child-node">
                  <div class="node-title">Objet Enfant (&commat;0x02)</div>
                  <div class="node-prop">nom: "Sous-Dossier A"</div>
                  <div class="node-prop">parent: &commat;0x01 (Boucle !)</div>
                </div>
              </div>

              <!-- Terminal de crash -->
              <div class="term-crash-box">
                <div class="term-head">
                  <span class="dot-red"></span>
                  <span>Console JavaScript Runtime</span>
                </div>
                <div class="term-body">
                  @if (circularCrashed()) {
                    <pre class="crash-text"><code>💥 Uncaught TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'enfant' -> object with constructor 'Object'
    --- property 'parent' closes the circle
    at JSON.stringify (&lt;anonymous&gt;)</code></pre>
                  } @else {
                    <span class="idle-text">&gt; Cliquez sur le bouton « 💥 Déclencher » pour tester la sérialisation native.</span>
                  }
                </div>
              </div>
            </div>

            <!-- Solutions d'ingénierie -->
            <div class="solutions-col">
              <div class="col-bar">
                <span>🛡️ Les Deux Solutions Conformes :</span>
              </div>

              <div class="sol-card sol-dto">
                <div class="sol-badge">SOLUTION RECOMMANDÉE : DTO APLATI</div>
                <h4>Rompre la liaison arrière dans le contrat de transport</h4>
                <p>
                  Dans l'interface DTO, on ne stocke pas l'objet parent entier, mais uniquement son identifiant scalaire : <code>parentId: string</code>.
                </p>
                <pre class="sol-code"><code>// EnfantDTO aplati :
interface EnfantDTO &#123;
  id: string;
  nom: string;
  parentId: string; // 💡 Pas de référence cyclique !
&#125;</code></pre>
              </div>

              <div class="sol-card sol-replacer">
                <div class="sol-badge badge-purple">SOLUTION ALGORITHMIQUE : REPLACER CYCLIQUE</div>
                <h4>Détecter les cycles avec un WeakSet</h4>
                <p>
                  On passe un replacer qui mémorise les objets déjà visités dans un <code>WeakSet</code> et renvoie <code>undefined</code> s'ils réapparaissent.
                </p>
                <pre class="sol-code"><code>const vus = new WeakSet();
const json = JSON.stringify(parent, (cle, val) => &#123;
  if (typeof val === "object" && val !== null) &#123;
    if (vus.has(val)) return undefined; // Coupe le cycle
    vus.add(val);
  &#125;
  return val;
&#125;);</code></pre>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 2 : LE PIÈGE DE LA DATE -->
      @if (activeTab() === 'date-trap') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">2</span>
              <div>
                <h3 class="zone-title">Le Piège de la Date Fantôme &amp; Le Reviver</h3>
                <p class="zone-subtitle">Pourquoi JSON.parse ne redonne jamais une Date et comment utiliser le paramètre reviver.</p>
              </div>
            </div>

            <div class="btn-group-date">
              <button class="btn-secondary" [class.danger-glow]="dateTestMode() === 'naive'" (click)="dateTestMode.set('naive')">
                ❌ Parsing Naïf (Crash getFullYear)
              </button>
              <button class="btn-primary" [class.active]="dateTestMode() === 'reviver'" (click)="dateTestMode.set('reviver')">
                ✅ Parsing avec Reviver
              </button>
            </div>
          </div>

          <div class="date-trap-grid">
            <!-- Code du test -->
            <div class="date-col">
              <div class="col-bar">
                <span>Code exécuté :</span>
              </div>

              <pre class="code-pre"><code>{{ dateSnippet() }}</code></pre>
            </div>

            <!-- Résultat et Console -->
            <div class="date-col">
              <div class="col-bar">
                <span>Résultat d'exécution en direct :</span>
              </div>

              <div class="term-date-box" [class.term-crash]="dateTestMode() === 'naive'" [class.term-ok]="dateTestMode() === 'reviver'">
                <div class="term-head">
                  <span [class.dot-red]="dateTestMode() === 'naive'" [class.dot-green]="dateTestMode() === 'reviver'"></span>
                  <span>Console d'évaluation</span>
                </div>
                <div class="term-body">
                  @if (dateTestMode() === 'naive') {
                    <div class="log-line text-muted">Type de recup.date : "string"</div>
                    <pre class="crash-text"><code>💥 TypeError: recup.date.getFullYear is not a function
    at eval (date-test.ts:12:12)</code></pre>
                  } @else {
                    <div class="log-line text-ok">✔ recup.date instanceof Date : <strong>true</strong></div>
                    <div class="log-line text-ok">✔ recup.date.getFullYear() : <strong>2026</strong></div>
                    <div class="log-line text-ok">✔ recup.date.toLocaleDateString() : <strong>"28/10/2026"</strong></div>
                  }
                </div>
              </div>

              <div class="date-insight-card">
                <strong>💡 Règle d'or de réhydratation :</strong>
                <p>
                  Dans une architecture Angular / TypeScript propre, on préfère réhydrater les <code>Date</code> dans la fabrique statique <code>fromDTO()</code> :
                  <code>new Date(dto.date)</code>. Le <code>reviver</code> de <code>JSON.parse(str, reviver)</code> est une alternative directe utile pour les parseurs génériques.
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

    /* Circular Grid */
    .circular-grid, .date-trap-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .loop-col, .solutions-col, .date-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .col-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .loop-visual-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .node-box {
      width: 220px;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 0.76rem;
      font-family: var(--font-mono);
      display: flex;
      flex-direction: column;
      gap: 2px;

      .node-title {
        font-weight: 800;
      }
      .node-prop {
        color: var(--text-muted);
        font-size: 0.72rem;
      }

      &.parent-node {
        background: rgba(49, 120, 198, 0.15);
        border: 1px solid rgba(49, 120, 198, 0.4);
        .node-title { color: #60a5fa; }
      }

      &.child-node {
        background: rgba(147, 51, 234, 0.15);
        border: 1px solid rgba(147, 51, 234, 0.4);
        .node-title { color: #c084fc; }
      }
    }

    .infinite-arrows {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.72rem;
      font-weight: 700;
      color: #ef4444;
      gap: 2px;
    }

    .term-crash-box, .term-date-box {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .term-head {
      background: #111724;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .dot-red {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
    }
    .dot-green {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }

    .term-body {
      padding: 10px 12px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      min-height: 75px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
    }

    .crash-text {
      color: #f87171;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .idle-text {
      color: var(--text-dim);
    }

    /* Solutions Col */
    .sol-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .sol-badge {
        font-size: 0.68rem;
        font-weight: 800;
        color: #34d399;
      }

      h4 {
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .sol-code {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      padding: 8px 10px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.74rem;
      color: #e2e8f0;
      overflow-x: auto;
    }

    /* Date Trap */
    .btn-group-date {
      display: flex;
      gap: 8px;
    }

    .danger-glow {
      border-color: #ef4444 !important;
      color: #f87171 !important;
      background: rgba(239, 68, 68, 0.15) !important;
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
    }

    .text-ok {
      color: #34d399;
    }
    .text-muted {
      color: var(--text-muted);
    }

    .date-insight-card {
      background: var(--bg-card);
      border-left: 3px solid #10b981;
      padding: 10px 12px;
      border-radius: 0 6px 6px 0;
      font-size: 0.8rem;
      color: var(--text-main);

      p {
        margin-top: 4px;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }
  `]
})
export class CrashTestsComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly activeTab = signal<'circular' | 'date-trap'>('circular');
  readonly circularCrashed = signal<boolean>(false);
  readonly dateTestMode = signal<'naive' | 'reviver'>('naive');

  readonly dateSnippet = computed<string>(() => {
    const isNaive = this.dateTestMode() === 'naive';
    if (isNaive) {
      return `// 1. En RAM :
const reunion = {
  titre: "Sprint Planning",
  date: new Date("2026-10-28T14:00:00Z")
};

// 2. Sérialisation (la Date devient un string ISO) :
const flux = JSON.stringify(reunion);
// '{ "titre": "Sprint Planning", "date": "2026-10-28T14:00:00.000Z" }'

// 3. Désérialisation NAÏVE :
const recup = JSON.parse(flux);
console.log(typeof recup.date); // 'string' !
recup.date.getFullYear();        // 💥 TypeError: recup.date.getFullYear is not a function !`;
    } else {
      return `// 1. En RAM :
const reunion = {
  titre: "Sprint Planning",
  date: new Date("2026-10-28T14:00:00Z")
};

// 2. Sérialisation (la Date devient un string ISO) :
const flux = JSON.stringify(reunion);

// 3. Désérialisation avec REVIVER :
const recup = JSON.parse(flux, (cle, val) => {
  if (cle === "date") return new Date(val); // Réhydratation !
  return val;
});
console.log(recup.date instanceof Date); // true
console.log(recup.date.getFullYear());  // 2026 !`;
    }
  });

  triggerCircularCrash(): void {
    this.circularCrashed.set(true);
  }

  jumpToLab(): void {
    this.exercises.setFilterLab(3);
    this.nav.setTab('workshops-lab');
  }
}
