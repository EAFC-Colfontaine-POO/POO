import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-late-binding-prototypes',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 03</span>
          <span class="badge badge-purple">Late Binding</span>
          <span class="badge badge-warning">Moteur V8 & Prototypes</span>
        </div>
        <h2>Sous le Capot : La Liaison Dynamique & les Prototypes</h2>
        <p class="module-desc">
          Comment le moteur JavaScript (V8) résout-il dynamiquement l'adresse de la fonction à exécuter au moment précis de l'appel ? Explorez la chaîne de prototypes en mémoire vive.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🔬 Inspecteur de Mémoire & Prototypes
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
        <div class="memory-workbench">
          <!-- Contrôles de simulation -->
          <div class="sim-controls-card card-panel">
            <div class="control-header">
              <h4>🎯 Choisissez la méthode à invoquer sur <code>m1</code> :</h4>
              <p>Observez le parcours du pointeur dans la chaîne de prototypes :</p>
            </div>

            <div class="method-choices">
              <button 
                class="method-btn" 
                [class.active]="invokedCall() === 'getDescription'"
                (click)="setCall('getDescription')"
              >
                <span>⚡ m1.getDescription()</span>
                <span class="badge badge-success">Méthode redéfinie (Arrêt immédiat)</span>
              </button>

              <button 
                class="method-btn" 
                [class.active]="invokedCall() === 'getCategorie'"
                (click)="setCall('getCategorie')"
              >
                <span>🪜 m1.getCategorie()</span>
                <span class="badge badge-blue">Non redéfinie (Remontée parent)</span>
              </button>
            </div>

            <div class="step-nav-bar">
              <span class="step-counter">Étape {{ currentStep() }} / 3</span>
              <div class="step-actions">
                <button class="btn-secondary btn-sm" [disabled]="currentStep() <= 1" (click)="prevStep()">
                  ◀ Précédent
                </button>
                <button class="btn-primary btn-sm" [disabled]="currentStep() >= 3" (click)="nextStep()">
                  Suivant ▶
                </button>
                <button class="btn-ghost btn-sm" (click)="resetSteps()">
                  ↺ Réinitialiser
                </button>
              </div>
            </div>
          </div>

          <!-- Représentation visuelle de la mémoire (Tas / Heap) -->
          <div class="heap-visualizer card-panel">
            <div class="heap-header">
              <span class="heap-title">MÉMOIRE HEAP (Tas d'objets) & CHAÎNE DE PROTOTYPES</span>
              <span class="call-banner">Instruction active : <code>{{ currentCallInstruction() }}</code></span>
            </div>

            <div class="nodes-chain">
              <!-- Nœud 1 : Instance en RAM (m1) -->
              <div class="chain-node instance-node" [class.active-step]="currentStep() === 1">
                <div class="node-badge">1. Instance en RAM (m1)</div>
                <div class="node-class">Objet Livre</div>
                <div class="node-props">
                  <div class="prop-item"><span class="k">titre:</span> <span class="v">"Clean Code"</span></div>
                  <div class="prop-item"><span class="k">annee:</span> <span class="v">2008</span></div>
                  <div class="prop-item"><span class="k">pages:</span> <span class="v">464</span></div>
                  <div class="prop-item proto-ref">
                    <span class="k">[[Prototype]] (__proto__):</span>
                    <span class="ptr">👉 Livre.prototype</span>
                  </div>
                </div>
                @if (currentStep() === 1) {
                  <div class="step-callout">
                    🔍 Le moteur V8 commence ici. L'objet m1 ne possède pas la méthode sur lui-même, il suit le pointeur __proto__.
                  </div>
                }
              </div>

              <div class="chain-arrow" [class.active]="currentStep() >= 2">
                <span class="arrow-line"></span>
                <span class="arrow-tag">__proto__</span>
              </div>

              <!-- Nœud 2 : Prototype de Livre -->
              <div class="chain-node prototype-node" [class.active-step]="currentStep() === 2">
                <div class="node-badge">2. Livre.prototype</div>
                <div class="node-class">Prototype spécialisé</div>
                <div class="node-methods">
                  <div class="method-item" [class.highlighted]="invokedCall() === 'getDescription' && currentStep() >= 2">
                    <span class="m-name">getDescription()</span>
                    <span class="m-badge">Version Livre (464 p.)</span>
                  </div>
                  <div class="prop-item proto-ref">
                    <span class="k">[[Prototype]] (__proto__):</span>
                    <span class="ptr">👉 Media.prototype</span>
                  </div>
                </div>
                @if (currentStep() === 2) {
                  @if (invokedCall() === 'getDescription') {
                    <div class="step-callout success">
                      🎯 <strong>TROUVÉ DÈS L'ÉTAPE 2 !</strong><br>
                      V8 trouve <code>getDescription()</code> directement dans <code>Livre.prototype</code>. Il l'exécute immédiatement SANS remonter plus haut !
                    </div>
                  } @else {
                    <div class="step-callout warn">
                      ❌ <code>getCategorie()</code> n'existe pas sur <code>Livre.prototype</code>. Le moteur continue de remonter la chaîne vers le parent...
                    </div>
                  }
                }
              </div>

              <div class="chain-arrow" [class.active]="currentStep() === 3">
                <span class="arrow-line"></span>
                <span class="arrow-tag">__proto__</span>
              </div>

              <!-- Nœud 3 : Prototype parent Media -->
              <div class="chain-node parent-node" [class.active-step]="currentStep() === 3">
                <div class="node-badge">3. Media.prototype</div>
                <div class="node-class">Prototype parent</div>
                <div class="node-methods">
                  <div class="method-item dimmed">
                    <span class="m-name">getDescription()</span>
                    <span class="m-badge">Version générique (Non atteinte)</span>
                  </div>
                  <div class="method-item" [class.highlighted]="invokedCall() === 'getCategorie' && currentStep() === 3">
                    <span class="m-name">getCategorie()</span>
                    <span class="m-badge">"Média Général"</span>
                  </div>
                </div>
                @if (currentStep() === 3) {
                  @if (invokedCall() === 'getCategorie') {
                    <div class="step-callout success">
                      🎯 <strong>TROUVÉ À L'ÉTAPE 3 !</strong><br>
                      V8 trouve la méthode sur le prototype parent <code>Media.prototype</code> et l'exécute en lui liant le <code>this</code> de l'instance <code>m1</code>.
                    </div>
                  } @else {
                    <div class="step-callout info">
                      Ce niveau n'a pas eu besoin d'être consulté grâce à la liaison dynamique court-circuitée !
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Résumé de l'étape active -->
            <div class="step-summary-banner">
              <strong>Explication de l'étape {{ currentStep() }} :</strong>
              <p>{{ getStepExplanation() }}</p>
            </div>
          </div>

          <!-- Encadré Théorique Liaison Statique vs Tardive -->
          <div class="card-panel comp-theory">
            <div class="theory-row">
              <div class="theory-box">
                <h4>🔒 Liaison Statique (Early Binding)</h4>
                <p>
                  Dans les langages purement compilés ou pour les méthodes <code>final</code> / fonctions simples, l'adresse mémoire du code est gravée dans le binaire dès la compilation. Très rapide, mais incapable d'adapter son comportement à une sous-classe non anticipée.
                </p>
              </div>

              <div class="theory-box highlight">
                <h4>⚡ Liaison Dynamique (Late Binding / Dynamic Dispatch)</h4>
                <p>
                  L'adresse de la méthode est résolue <strong>au moment précis de l'appel</strong> en inspectant la chaîne des prototypes de l'objet en RAM. C'est le moteur du polymorphisme : chaque objet répond avec sa propre version de la méthode.
                </p>
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
    .memory-workbench {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sim-controls-card {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
        margin: 0 0 2px 0;
      }

      p {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin: 0;
      }
    }

    .method-choices {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .method-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      font-family: var(--font-mono);
      font-size: 0.84rem;
      font-weight: 600;

      &:hover {
        background: var(--bg-card-hover);
        border-color: var(--bs-purple);
      }

      &.active {
        background: rgba(121, 82, 179, 0.2);
        border-color: var(--bs-purple);
        color: #ffffff;
      }
    }

    .step-nav-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-color);
      padding-top: 12px;
      flex-wrap: wrap;
      gap: 10px;

      .step-counter {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--bs-purple-light);
        font-family: var(--font-mono);
      }

      .step-actions {
        display: flex;
        gap: 8px;
      }
    }

    .heap-visualizer {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .heap-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;

      .heap-title {
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .call-banner {
        font-size: 0.82rem;
        font-family: var(--font-mono);
        color: #38bdf8;
      }
    }

    .nodes-chain {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      overflow-x: auto;
      padding: 10px 0;

      @media (max-width: 1100px) {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .chain-node {
      flex: 1;
      min-width: 250px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.3s;

      &.active-step {
        border-color: var(--bs-purple);
        box-shadow: 0 0 16px rgba(121, 82, 179, 0.4);
        transform: translateY(-2px);
      }

      .node-badge {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--bs-purple-light);
      }

      .node-class {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .prop-item, .method-item {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      padding: 5px 8px;
      border-radius: 4px;
      background: var(--bg-code);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      .k { color: var(--text-muted); }
      .v { color: #86efac; }
      .ptr { color: #38bdf8; font-weight: 600; }

      &.highlighted {
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid #10b981;
        .m-name { color: #34d399; font-weight: 700; }
      }

      &.dimmed {
        opacity: 0.4;
      }
    }

    .chain-arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding-top: 50px;

      @media (max-width: 1100px) {
        padding: 6px 0;
        flex-direction: row;
      }

      .arrow-line {
        width: 32px;
        height: 3px;
        background: var(--border-color);
      }

      .arrow-tag {
        font-size: 0.65rem;
        font-family: var(--font-mono);
        color: var(--text-dim);
      }

      &.active .arrow-line {
        background: var(--bs-purple);
        box-shadow: 0 0 8px var(--bs-purple);
      }
    }

    .step-callout {
      margin-top: 8px;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      line-height: 1.4;
      background: rgba(121, 82, 179, 0.12);
      border: 1px solid rgba(121, 82, 179, 0.3);
      color: var(--text-main);

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.35);
        color: #ecfdf5;
      }

      &.warn {
        background: rgba(245, 158, 11, 0.12);
        border-color: rgba(245, 158, 11, 0.35);
        color: #fef3c7;
      }
    }

    .step-summary-banner {
      background: var(--bg-subtle);
      border-left: 3px solid var(--bs-purple);
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 0.84rem;

      strong { color: var(--bs-purple-light); }
      p { margin: 4px 0 0 0; color: var(--text-main); }
    }

    .comp-theory {
      padding: 20px;
    }

    .theory-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .theory-box {
      padding: 16px;
      border-radius: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        margin-bottom: 6px;
        color: var(--text-main);
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
        margin: 0;
      }

      &.highlight {
        border-color: rgba(121, 82, 179, 0.4);
        h4 { color: var(--bs-purple-light); }
      }
    }
  `]
})
export class LateBindingPrototypesComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');
  readonly invokedCall = signal<'getDescription' | 'getCategorie'>('getDescription');
  readonly currentStep = signal<number>(1);

  setCall(c: 'getDescription' | 'getCategorie'): void {
    this.invokedCall.set(c);
    this.currentStep.set(1);
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  resetSteps(): void {
    this.currentStep.set(1);
  }

  currentCallInstruction(): string {
    return this.invokedCall() === 'getDescription'
      ? 'const res = m1.getDescription();'
      : 'const res = m1.getCategorie();';
  }

  getStepExplanation(): string {
    const step = this.currentStep();
    const call = this.invokedCall();

    if (step === 1) {
      return 'L\'instruction inspecte l\'instance m1 en mémoire vive. m1 contient ses attributs d\'état (titre, annee, pages), mais aucune méthode propre. Son pointeur [[Prototype]] renvoie vers Livre.prototype.';
    }

    if (step === 2) {
      if (call === 'getDescription') {
        return 'Le moteur inspecte Livre.prototype. La méthode getDescription() y est présente (redéfinie via override). La recherche s\'arrête immédiatement ici : elle est invoquée avec le contexte de m1 !';
      } else {
        return 'Le moteur inspecte Livre.prototype. La méthode getCategorie() n\'y figure pas. Le moteur ne renvoie pas d\'erreur : il continue d\'escalader la chaîne via Livre.prototype.__proto__.';
      }
    }

    if (step === 3) {
      if (call === 'getDescription') {
        return 'Media.prototype ne sera jamais atteint pour getDescription(), car la méthode spécialisée a court-circuité la remontée dès l\'étape 2.';
      } else {
        return 'Le moteur trouve getCategorie() sur Media.prototype. Il l\'exécute avec succès en renvoyant "Média Général". Si elle n\'avait pas été trouvée ici, il aurait continué jusqu\'à Object.prototype.';
      }
    }

    return '';
  }
}
