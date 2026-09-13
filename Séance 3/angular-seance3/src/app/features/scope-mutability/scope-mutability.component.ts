import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-scope-mutability',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Module 4 — Variables & Mémoire</div>
        <h2>Variables, Portée de Bloc (Scope) & Mutabilité avec const</h2>
        <p class="module-desc">
          Comprenez les mécanismes cruciaux d'isolation du code : pourquoi <code>var</code> fuit hors de vos boucles,
          pourquoi <code>const</code> n'empêche pas de modifier un tableau avec <code>.push()</code>, et comment fonctionne la Zone Morte Temporelle (TDZ).
        </p>
      </div>

      <!-- Onglets Mode : Théorie & Démos / Labo 2 -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'theory'"
          (click)="activeMode.set('theory')"
        >
          <span>📚 Cours & Schémas Visuels</span>
        </button>
        <button 
          class="mode-tab-btn" 
          [class.active]="activeMode() === 'lab'"
          (click)="activeMode.set('lab')"
        >
          <span>🧪 Atelier Pratique : Labo 2 (4 Défis Monaco)</span>
        </button>
      </div>

      @if (activeMode() === 'theory') {
        <!-- 1. Visualiseur de Portée (Scope) : var vs let -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>1. Visualiseur de Scope : La fuite de var contre le bloc let/const</h3>
              <p class="section-sub">Observez comment les accolades &#123; &#125; protègent l'étanchéité de vos variables.</p>
            </div>
          </div>

          <div class="scope-comparison-grid">
            <!-- Colonne var -->
            <div class="scope-card var-leak">
              <div class="scope-header">
                <span class="badge badge-red">var : Portée Fonction (FUITE)</span>
                <span class="leak-tag">⚠️ Fuite hors du bloc</span>
              </div>
              <div class="code-box">
                <pre><code>function test() &#123;
  if (true) &#123;
    <span class="highlight-var">var message = "Bonjour";</span>
  &#125;
  
  // message "fuit" et existe encore ici !
  console.log(message); // "Bonjour" 😱
&#125;</code></pre>
              </div>
              <div class="scope-diagram">
                <div class="outer-scope">
                  <span class="scope-label">Fonction test()</span>
                  <div class="inner-block leaking">
                    <span class="inner-label">Bloc if &#123; &#125;</span>
                    <span class="var-badge">var message</span>
                    <span class="leak-arrow">↗️ s'échappe</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne let / const -->
            <div class="scope-card let-clean">
              <div class="scope-header">
                <span class="badge badge-success">let & const : Portée de Bloc &#123; &#125;</span>
                <span class="safe-tag">🛡️ Confinement strict</span>
              </div>
              <div class="code-box">
                <pre><code>function test() &#123;
  if (true) &#123;
    <span class="highlight-let">let message = "Bonjour";</span>
  &#125;
  
  // message est détruit dès la sortie du bloc !
  console.log(message); // ❌ ReferenceError
&#125;</code></pre>
              </div>
              <div class="scope-diagram">
                <div class="outer-scope">
                  <span class="scope-label">Fonction test()</span>
                  <div class="inner-block protected">
                    <span class="inner-label">Bloc if &#123; &#125;</span>
                    <span class="let-badge">let message</span>
                    <span class="lock-icon">🔒 enfermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Le piège de la mutabilité avec const -->
        <div class="card-panel">
          <div class="section-title-row">
            <div>
              <h3>2. Le Piège de la Mutabilité avec const : Référence vs Contenu</h3>
              <p class="section-sub">Pourquoi <code>const tab = ["a"]; tab.push("b");</code> est parfaitement autorisé.</p>
            </div>
          </div>

          <div class="mutability-grid">
            <div class="mut-card allowed">
              <div class="mut-top">
                <span class="badge badge-success">AUTORISÉ : Modification du contenu</span>
                <span class="tag-ok">✔ Mutation interne</span>
              </div>
              <pre><code>const fruits = ["pomme"];

// On modifie les éléments du tableau :
fruits.push("banane"); // ✔ AUTORISÉ
fruits[0] = "poire";   // ✔ AUTORISÉ

console.log(fruits); // ["poire", "banane"]</code></pre>
              <p class="mut-explanation">
                <strong>Explication :</strong> La variable <code>fruits</code> contient une <strong>adresse mémoire (référence)</strong>.
                Modifier les éléments internes du tableau ne change pas cette adresse : c'est toujours le même tableau.
              </p>
            </div>

            <div class="mut-card forbidden">
              <div class="mut-top">
                <span class="badge badge-red">INTERDIT : Réassignation de la variable</span>
                <span class="tag-ko">❌ Réaffectation</span>
              </div>
              <pre><code>const fruits = ["pomme"];

// On tente de remplacer le tableau par un autre :
fruits = ["orange"]; // ❌ ERREUR COMPILATEUR !
// Cannot assign to 'fruits' because it is a constant.</code></pre>
              <p class="mut-explanation">
                <strong>Explication :</strong> <code>const</code> interdit de modifier la <strong>flèche de référence</strong> vers un nouvel objet en mémoire.
                Pour vider le tableau sans changer de référence, utilisez <code>fruits.length = 0;</code>.
              </p>
            </div>
          </div>
        </div>

        <!-- 3. Timeline de la Temporal Dead Zone (TDZ) -->
        <div class="card-panel tdz-section">
          <div class="section-title-row">
            <div>
              <h3>3. Chronologie de la Temporal Dead Zone (TDZ)</h3>
              <p class="section-sub">L'interdiction absolue d'utiliser une variable <code>let</code> avant sa ligne de déclaration.</p>
            </div>
          </div>

          <div class="tdz-timeline-card">
            <div class="timeline-step step-start">
              <div class="time-marker">Ligne 1</div>
              <div class="step-content">
                <span class="step-badge">Entrée dans la fonction</span>
                <p>Le bloc démarre. La variable <code>remise</code> est connue du moteur, mais <strong>inaccessible</strong>.</p>
              </div>
            </div>

            <div class="timeline-step step-tdz">
              <div class="time-marker">Ligne 2</div>
              <div class="step-content error-step">
                <span class="step-badge danger">ZONE MORTE TEMPORELLE (TDZ)</span>
                <code>console.log(remise); // ❌ ReferenceError: Cannot access 'remise' before initialization</code>
                <p>Tentative d'accès prématurée : crash immédiat !</p>
              </div>
            </div>

            <div class="timeline-step step-decl">
              <div class="time-marker">Ligne 3</div>
              <div class="step-content success-step">
                <span class="step-badge success">Déclaration & Initialisation</span>
                <code>let remise = 15;</code>
                <p>La TDZ prend fin ici ! À partir de cette ligne, <code>remise</code> peut être lue et modifiée.</p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Labo 2 -->
        <app-lab-runner [targetLabNumber]="2"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .scope-comparison-grid, .mutability-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }

    .scope-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.var-leak {
        border-left: 4px solid #ef4444;
      }

      &.let-clean {
        border-left: 4px solid #10b981;
      }
    }

    .scope-header, .mut-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .leak-tag { color: #f87171; font-size: 0.75rem; font-weight: 700; }
      .safe-tag { color: #34d399; font-size: 0.75rem; font-weight: 700; }
      .tag-ok { color: #34d399; font-size: 0.75rem; font-weight: 700; }
      .tag-ko { color: #f87171; font-size: 0.75rem; font-weight: 700; }
    }

    .code-box, pre {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      padding: 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      color: var(--text-code);
      overflow-x: auto;
    }

    .highlight-var {
      color: #f87171;
      font-weight: 700;
    }

    .highlight-let {
      color: #34d399;
      font-weight: 700;
    }

    .scope-diagram {
      padding: 12px;
      background: var(--bg-card);
      border: 1px dashed var(--border-color);
      border-radius: 6px;
    }

    .outer-scope {
      border: 1px solid var(--border-color);
      padding: 10px;
      border-radius: 6px;
      position: relative;
    }

    .scope-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-dim);
      display: block;
      margin-bottom: 6px;
    }

    .inner-block {
      padding: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.leaking {
        background: rgba(239, 68, 68, 0.1);
        border: 1px dashed rgba(239, 68, 68, 0.4);
      }

      &.protected {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.4);
      }

      .inner-label {
        font-size: 0.75rem;
        font-weight: 600;
      }

      .var-badge {
        background: #ef4444;
        color: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.72rem;
      }

      .let-badge {
        background: #10b981;
        color: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.72rem;
      }

      .leak-arrow {
        color: #f87171;
        font-size: 0.78rem;
        font-weight: 700;
      }

      .lock-icon {
        color: #34d399;
        font-size: 0.78rem;
        font-weight: 700;
      }
    }

    .mut-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--bg-subtle);

      &.allowed {
        border-left: 4px solid #10b981;
      }

      &.forbidden {
        border-left: 4px solid #ef4444;
      }
    }

    .mut-explanation {
      font-size: 0.84rem;
      color: var(--text-muted);
      line-height: 1.4;

      strong {
        color: var(--text-main);
      }

      code {
        color: var(--ts-blue-light);
        background: var(--bg-code);
        padding: 1px 4px;
        border-radius: 3px;
      }
    }

    .tdz-timeline-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 14px;
      position: relative;
    }

    .timeline-step {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 16px;
      align-items: center;

      .time-marker {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--text-dim);
        font-weight: 700;
        text-align: right;
      }

      .step-content {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        padding: 10px 14px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        &.error-step {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.3);

          code {
            color: #fca5a5;
            font-size: 0.8rem;
          }
        }

        &.success-step {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.3);

          code {
            color: #34d399;
            font-size: 0.85rem;
            font-weight: 600;
          }
        }
      }

      .step-badge {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--text-dim);

        &.danger { color: #f87171; }
        &.success { color: #34d399; }
      }
    }
  `]
})
export class ScopeMutabilityComponent {
  readonly activeMode = signal<'theory' | 'lab'>('theory');
}
