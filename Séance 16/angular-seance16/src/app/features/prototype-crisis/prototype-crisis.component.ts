import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-prototype-crisis',
  standalone: true,
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 04 · Prototypes &amp; Chaîne d'Héritage</div>
        <h2>Le Drame du Prototype Perdu (L'Illusion du Cast Naïf)</h2>
        <p class="module-desc">
          En TypeScript, le mot-clé <code>as Classe</code> n'est qu'une directive de complaisance pour le compilateur :
          <strong>il s'efface totalement à la compilation</strong>. Au runtime, <code>JSON.parse()</code> crée un objet littéral pur
          dépourvu de prototype de classe, provoquant l'échec d'<code>instanceof</code> et le crash immédiat à l'appel de vos méthodes.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'crash'" (click)="activeSubTab.set('crash')">
              💥 Le Simulateur de Crash &amp; Graphe de Prototypes
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'antipattern'" (click)="activeSubTab.set('antipattern')">
              ⚠️ L'Anti-Pattern Object.setPrototypeOf()
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Passer aux Exercices du Labo 3 ➔
          </button>
        </div>
      </div>

      @if (activeSubTab() === 'crash') {
        <!-- 1. SIMULATEUR DE CRASH & PROTOTYPE CHAIN -->
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">1</span>
              <div>
                <h3 class="zone-title">Simulation du Crash : JSON.parse(str) as Tache</h3>
                <p class="zone-subtitle">Observez le fossé entre les promesses du compilateur TypeScript et la réalité du runtime JavaScript.</p>
              </div>
            </div>

            <button class="btn-primary" (click)="runNaiveCastSimulation()">
              ▶️ Exécuter le Cast Naïf &amp; Déclencher le Crash
            </button>
          </div>

          <div class="crisis-grid">
            <!-- Code TypeScript & Erreur -->
            <div class="code-and-console-col">
              <div class="col-bar">
                <span>Code exécuté :</span>
                <span class="badge badge-warning">Illusion du Cast</span>
              </div>

              <pre class="code-pre"><code>class Tache &#123;
  constructor(public id: string, public titre: string) &#123;&#125;

  terminer(): void &#123;
    console.log("Tâche terminée !");
  &#125;
&#125;

// La désérialisation naïve :
const json = '&#123;"id":"T-1","titre":"Réviser le cours"&#125;';
const t = JSON.parse(json) as Tache; // ⚠️ Le "as" disparaît au runtime !

console.log(t instanceof Tache); // ➔ false !
t.terminer();                    // 💥 Crash fatal !</code></pre>

              <!-- Console virtuelle de crash -->
              <div class="terminal-box">
                <div class="term-bar">
                  <span class="dot-red"></span>
                  <span>Console Runtime V8</span>
                </div>
                <div class="term-log">
                  @if (hasCrashRun()) {
                    <div class="log-info">t instanceof Tache : <span class="text-danger font-bold">false</span></div>
                    <div class="log-crash">
                      💥 <strong>TypeError: t.terminer is not a function</strong><br>
                      &nbsp;&nbsp;&nbsp;&nbsp;at runNaiveCastSimulation (prototype-crisis.ts:14:7)
                    </div>
                  } @else {
                    <div class="log-idle">&gt; Cliquez sur le bouton ci-dessus pour observer le crash.</div>
                  }
                </div>
              </div>
            </div>

            <!-- Inspecteur de la Chaîne des Prototypes -->
            <div class="proto-chain-col">
              <div class="col-bar">
                <span>Inspecteur de Chaîne de Prototypes (__proto__) :</span>
              </div>

              <div class="proto-diagram">
                <!-- Cas 1 : Vraie instance POO -->
                <div class="chain-box normal-chain">
                  <div class="chain-badge valid-badge">VRAIE INSTANCE : new Tache()</div>
                  <div class="chain-node node-instance">
                    <span class="node-title">Instance t</span>
                    <span class="node-prop">id: "T-1", titre: "..."</span>
                  </div>
                  <div class="chain-arrow">↓ __proto__</div>
                  <div class="chain-node node-proto">
                    <span class="node-title">Tache.prototype</span>
                    <span class="node-methods">✅ terminer(): void</span>
                  </div>
                  <div class="chain-arrow">↓ __proto__</div>
                  <div class="chain-node node-object">
                    <span class="node-title">Object.prototype</span>
                    <span class="node-prop">toString(), hasOwnProperty()</span>
                  </div>
                </div>

                <!-- Cas 2 : Objet issu de JSON.parse -->
                <div class="chain-box broken-chain">
                  <div class="chain-badge broken-badge">CAST NAÏF : JSON.parse() as Tache</div>
                  <div class="chain-node node-instance-broken">
                    <span class="node-title">Objet Littéral t</span>
                    <span class="node-prop">id: "T-1", titre: "..."</span>
                  </div>
                  <div class="chain-arrow-broken">↓ __proto__ (Liaison vers Tache.prototype inexistante !)</div>
                  <div class="chain-node node-missing">
                    <span class="node-title cross-title">❌ Tache.prototype est sauté !</span>
                    <span class="node-desc">JSON.parse ne connaît pas votre classe.</span>
                  </div>
                  <div class="chain-arrow">↓ __proto__</div>
                  <div class="chain-node node-object">
                    <span class="node-title">Object.prototype</span>
                    <span class="node-prop">toString(), hasOwnProperty()</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- 2. ANTI-PATTERN OBJECT.SETPROTOTYPEOF -->
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">2</span>
              <div>
                <h3 class="zone-title">Pourquoi Object.setPrototypeOf() est un Anti-Pattern Majeur</h3>
                <p class="zone-subtitle">La fausse bonne idée des bidouilleurs : raccrocher le prototype à la main crée 3 failles critiques.</p>
              </div>
            </div>
          </div>

          <div class="bad-practice-code-card">
            <span class="bad-tag">🛑 CE CODE EST FORMELLEMENT PROSCRIT :</span>
            <pre><code>const raw = JSON.parse(str);
// ❌ BIDOUILLE DANGEREUSE :
Object.setPrototypeOf(raw, Tache.prototype);
// OU
const t = Object.assign(new Tache("dummy", "dummy"), raw);</code></pre>
          </div>

          <div class="pitfalls-trio">
            <div class="pitfall-card">
              <div class="p-num">1</div>
              <h4>Contournement du Constructeur</h4>
              <p>
                Le constructeur est le <strong>gardien des invariants</strong> de votre objet (Séance 05).
                En forçant le prototype avec <code>Object.setPrototypeOf()</code>, le constructeur n'est <strong>JAMAIS appelé</strong>.
                Des données corrompues (titre vide, montant négatif) entrent en mémoire sans aucun contrôle !
              </p>
            </div>

            <div class="pitfall-card">
              <div class="p-num">2</div>
              <h4>Désoptimisation Moteur (V8 / SpiderMonkey)</h4>
              <p>
                Modifier le <code>[[Prototype]]</code> d'un objet existant après sa création détruit brutalement les <em>Hidden Classes</em> (Shapes) et les <em>Inline Caches</em> du moteur JavaScript.
                Cela dégrade les performances d'accès aux propriétés de toute votre application.
              </p>
            </div>

            <div class="pitfall-card">
              <div class="p-num">3</div>
              <h4>Incompatibilité avec les Champs Privés (#)</h4>
              <p>
                Les attributs privés <code>#champ</code> sont alloués exclusivement lors de l'exécution physique du constructeur.
                Sur un objet forcé via <code>Object.setPrototypeOf()</code>, tout appel à une méthode accédant à un champ privé lève :
                <code>TypeError: Cannot read private member #champ</code>.
              </p>
            </div>
          </div>

          <div class="clean-solution-box">
            <div class="sol-title">✅ La Seule Solution d'Ingénierie Conforme : Le Patron DTO &amp; fromDTO()</div>
            <p>
              Au lieu de forcer les prototypes, on sépare le contrat de transport (l'interface <code>TacheDTO</code>) de l'entité vivante (la classe <code>Tache</code>).
              On passe alors obligatoirement par la fabrique statique <code>Tache.fromDTO(dto)</code> qui appelle <code>new Tache(...)</code> et réactive toutes les sécurités !
            </p>
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

    /* Crisis Grid */
    .crisis-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .code-and-console-col, .proto-chain-col {
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
    }

    .terminal-box {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .term-bar {
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

    .term-log {
      padding: 12px;
      font-family: var(--font-mono);
      font-size: 0.76rem;
      min-height: 70px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .log-idle {
      color: var(--text-dim);
    }

    .log-info {
      color: #93c5fd;
    }

    .log-crash {
      color: #f87171;
      background: rgba(239, 68, 68, 0.1);
      border-left: 3px solid #ef4444;
      padding: 6px 8px;
      border-radius: 0 4px 4px 0;
    }

    .text-danger {
      color: #ef4444;
    }

    /* Proto Chain */
    .proto-diagram {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .chain-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }

    .chain-badge {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      margin-bottom: 4px;
      text-align: center;

      &.valid-badge {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
      &.broken-badge {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }
    }

    .chain-node {
      width: 100%;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.74rem;
      font-family: var(--font-mono);

      .node-title {
        font-weight: 700;
        color: var(--text-main);
      }
      .node-prop {
        color: var(--text-muted);
        font-size: 0.68rem;
      }
      .node-methods {
        color: #34d399;
        font-weight: 600;
      }

      &.node-instance {
        border-color: #3b82f6;
      }
      &.node-proto {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.08);
      }
      &.node-missing {
        border: 2px dashed #ef4444;
        background: rgba(239, 68, 68, 0.08);
        .cross-title {
          color: #ef4444;
        }
        .node-desc {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
      }
    }

    .chain-arrow {
      font-size: 0.72rem;
      color: #60a5fa;
      font-weight: 700;
    }

    .chain-arrow-broken {
      font-size: 0.68rem;
      color: #f87171;
      font-weight: 700;
      text-align: center;
    }

    /* Anti-pattern Tab */
    .bad-practice-code-card {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 16px;

      .bad-tag {
        font-size: 0.74rem;
        font-weight: 800;
        color: #f87171;
      }

      pre {
        background: var(--bg-code);
        padding: 10px;
        border-radius: 6px;
        margin-top: 8px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: #fca5a5;
      }
    }

    .pitfalls-trio {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 18px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .pitfall-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .p-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
      }

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    .clean-solution-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 8px;
      padding: 16px;

      .sol-title {
        font-size: 0.92rem;
        font-weight: 800;
        color: #34d399;
        margin-bottom: 6px;
      }

      p {
        font-size: 0.84rem;
        color: var(--text-main);
        line-height: 1.5;
      }
    }
  `]
})
export class PrototypeCrisisComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly activeSubTab = signal<'crash' | 'antipattern'>('crash');
  readonly hasCrashRun = signal<boolean>(false);

  runNaiveCastSimulation(): void {
    this.hasCrashRun.set(true);
  }

  jumpToLab(): void {
    this.exercises.setFilterLab(3);
    this.nav.setTab('workshops-lab');
  }
}
