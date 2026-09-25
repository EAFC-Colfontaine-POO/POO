import { Component, signal, computed } from '@angular/core';
import { BuildingStep } from '../../core/models/app.models';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-constructor-super',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Module 3 · Mécanique Interne</span>
          <span class="badge badge-bootstrap">Cycle de Vie Objet</span>
        </div>
        <h2>Mécanique TypeScript : <code>extends</code>, <code>super()</code> & Cycle de Construction</h2>
        <p class="module-desc">
          Lorsqu'une classe dérive d'une autre, comment l'objet naît-il concrètement dans la mémoire vive ? Découvrez l'analogie du bâtiment et comprenez la règle absolue de l'invocation de <code>super()</code>.
        </p>
      </div>

      <!-- Mode Théorie vs Labo -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeView() === 'theory'"
          (click)="activeView.set('theory')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>Cycle d'Instanciation & Piège TS17009</span>
        </button>
        <button 
          class="mode-tab-btn" 
          [class.active]="activeView() === 'lab'"
          (click)="activeView.set('lab')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>Atelier Pratique (Labo 1)</span>
        </button>
      </div>

      @if (activeView() === 'theory') {
        <!-- Démonstrateur du Piège TS17009 -->
        <div class="trap-box card-panel" [class.danger]="isInverted()">
          <div class="trap-header">
            <div class="trap-title-group">
              <span class="trap-badge">{{ isInverted() ? '🚨 CODE ERRONÉ : TS17009' : '✅ CODE VALIDE : ORDRE RESPECTÉ' }}</span>
              <h3>Le Piège du Constructeur Dérivé</h3>
            </div>

            <button class="btn-secondary" (click)="toggleInversion()">
              {{ toggleButtonText() }}
            </button>
          </div>

          <div class="trap-comparison">
            <!-- Code TypeScript -->
            <div class="code-column">
              <div class="code-label">Constructeur de la classe fille Livre :</div>
              @if (isInverted()) {
                <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Livre</span> <span class="kw">extends</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(titre: <span class="typ">string</span>, annee: <span class="typ">number</span>, nombrePages: <span class="typ">number</span>) &#123;
<span class="highlight-err">    <span class="kw">this</span>.nombrePages = nombrePages; <span class="comment">// 💥 ERREUR TS17009 : this n'existe pas encore !</span></span>
    <span class="kw">super</span>(titre, annee);
  &#125;
&#125;</code></pre>
              } @else {
                <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Livre</span> <span class="kw">extends</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(titre: <span class="typ">string</span>, annee: <span class="typ">number</span>, nombrePages: <span class="typ">number</span>) &#123;
<span class="highlight-ok">    <span class="kw">super</span>(titre, annee);            <span class="comment">// 1️⃣ Fondations de Media coulées, "this" vient au monde</span></span>
<span class="highlight-ok">    <span class="kw">this</span>.nombrePages = nombrePages; <span class="comment">// 2️⃣ Initialisation sécurisée du champ propre</span></span>
  &#125;
&#125;</code></pre>
              }
            </div>

            <!-- Diagnostic Compilateur TS -->
            <div class="diagnostic-column">
              <div class="diag-label">Diagnostic du Compilateur TypeScript & Runtime :</div>
              @if (isInverted()) {
                <div class="error-terminal">
                  <div class="term-line red">error TS17009: 'super' must be called before accessing 'this' in the constructor of a derived class.</div>
                  <div class="term-line dim">Runtime V8 (JavaScript) : ReferenceError: Must call super constructor in derived class before accessing 'this'</div>
                  <div class="term-explanation">
                    <strong>Pourquoi ce blocage physique ?</strong><br>
                    En JavaScript/TypeScript, une classe fille ne crée pas son propre contexte mémoire pour <code>this</code>. C'est l'exécution de <code>super()</code> qui alloue l'objet en mémoire et en retourne la référence. Tenter d'écrire dans <code>this</code> avant <code>super()</code> revient à peindre les murs d'un immeuble dont les fondations n'ont pas encore été coulées !
                  </div>
                </div>
              } @else {
                <div class="success-terminal">
                  <div class="term-line green">✔ Compilation TypeScript : 0 erreur détectée.</div>
                  <div class="term-line dim">Runtime V8 : new Livre("Dune", 1965, 412) instancié avec succès.</div>
                  <div class="term-explanation">
                    <strong>Fondations respectées :</strong><br>
                    Le moteur instancie d'abord la couche parente <code>Media</code>, initialise <code>titre</code> et <code>annee</code>, injecte l'instance dans la variable <code>this</code> locale, puis autorise la fille à greffer ses champs propres.
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Schéma Interactif : L'Analogie du Bâtiment (Step by Step) -->
        <div class="card-panel stepper-panel">
          <div class="stepper-header">
            <div class="stepper-title-row">
              <span class="stepper-badge">ANALOGIE DU BÂTIMENT</span>
              <h3>Les 4 Temps de la Construction d'un Objet Dérivé</h3>
            </div>
            <div class="step-nav-buttons">
              <button class="btn-secondary btn-sm" [disabled]="currentStepIndex() === 0" (click)="prevStep()">◀ Étape précédente</button>
              <span class="step-counter">Étape {{ currentStepIndex() + 1 }} / {{ steps.length }}</span>
              <button class="btn-primary btn-sm" [disabled]="currentStepIndex() === steps.length - 1" (click)="nextStep()">Étape suivante ▶</button>
            </div>
          </div>

          <!-- Barre d'onglets étapes -->
          <div class="steps-progress-bar">
            @for (step of steps; track step.stepNumber; let i = $index) {
              <button 
                class="step-progress-item" 
                [class.active]="currentStepIndex() === i"
                [class.passed]="isStepPassed(i)"
                (click)="setStep(i)"
              >
                <div class="step-circle">{{ i + 1 }}</div>
                <div class="step-meta">
                  <span class="step-name">{{ step.title }}</span>
                  <span class="step-phase">{{ step.analogyPhase }}</span>
                </div>
              </button>
            }
          </div>

          <!-- Visualiseur dynamique de mémoire vive -->
          <div class="stepper-body">
            <!-- Schéma Mémoire Objet -->
            <div class="memory-card">
              <div class="mem-title">Visualisation de l'Espace Mémoire (Heap) :</div>
              <div class="building-frame">
                <!-- Étage Fille (Finitions) -->
                <div class="building-floor child-floor" [class.unlocked]="activeStep().memoryState.childFieldsInitialized">
                  <div class="floor-badge">Étage 2 : Spécialisation Livre</div>
                  @if (activeStep().memoryState.childFieldsInitialized) {
                    <div class="field-item green">nombrePages: 412</div>
                  } @else {
                    <div class="field-item dim">-- non initialisé --</div>
                  }
                </div>

                <!-- Connecteur this -->
                <div class="this-pointer" [class.active]="activeStep().memoryState.thisBorn">
                  <div class="pointer-arrow">▲</div>
                  <div class="pointer-label">
                    {{ activeStep().memoryState.thisBorn ? 'Pointeur "this" ACTIF en mémoire' : 'Pointeur "this" INEXISTANT (TDZ)' }}
                  </div>
                </div>

                <!-- Rez-de-Chaussée (Fondations Media) -->
                <div class="building-floor base-floor" [class.unlocked]="activeStep().memoryState.baseAllocated">
                  <div class="floor-badge">Étage 1 (Fondations) : Classe Mère Media</div>
                  @if (activeStep().memoryState.baseAllocated) {
                    <div class="field-row">
                      <span class="field-item green">titre: "Dune"</span>
                      <span class="field-item green">annee: 1965</span>
                    </div>
                  } @else {
                    <div class="field-item dim">-- Fondations non coulées --</div>
                  }
                </div>
              </div>
            </div>

            <!-- Explication Détaillée de l'Étape Active -->
            <div class="step-detail-card">
              <div class="phase-tag">{{ activeStep().analogyPhase }}</div>
              <h4>{{ activeStep().title }} : {{ activeStep().subtitle }}</h4>
              <p class="step-explanation-text">{{ activeStep().explanation }}</p>

              <div class="callout-box">
                <span class="callout-icon">🏗️</span>
                <div class="callout-content">
                  <strong>Règle d'Architecture :</strong>
                  Aucune sous-classe ne peut prétendre exister sans que son socle parent n'ait été intégralement validé et construit au préalable.
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="1"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .trap-box {
      border: 1px solid var(--border-color);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.25s;

      &.danger {
        border-color: rgba(239, 68, 68, 0.5);
        background: rgba(239, 68, 68, 0.04);
      }
    }

    .trap-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;

      .trap-badge {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
      }

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .trap-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .code-column, .diagnostic-column {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .code-label, .diag-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .code-box {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.6;
      border: 1px solid var(--border-subtle);

      .highlight-err {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        display: block;
        padding-left: 6px;
        margin-left: -6px;
        border-left: 3px solid #ef4444;
      }

      .highlight-ok {
        background: rgba(16, 185, 129, 0.15);
        color: #86efac;
        display: block;
        padding-left: 6px;
        margin-left: -6px;
        border-left: 3px solid #10b981;
      }

      .highlight-neutral {
        display: block;
      }

      .kw { color: #c678dd; }
      .cls { color: #e5c07b; }
      .typ { color: #e5c07b; }
      .comment { color: #5c6370; font-style: italic; }
    }

    .error-terminal, .success-terminal {
      background: #090d16;
      border-radius: 6px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid var(--border-subtle);
      height: 100%;
    }

    .term-line {
      font-weight: 700;

      &.red { color: #f87171; }
      &.green { color: #34d399; }
      &.dim { color: #94a3b8; font-weight: normal; }
    }

    .term-explanation {
      font-family: var(--font-sans);
      font-size: 0.82rem;
      color: var(--text-main);
      background: var(--bg-card);
      padding: 10px;
      border-radius: 4px;
      border-left: 3px solid #0ea5e9;
      line-height: 1.45;
    }

    /* Stepper Bâtiment */
    .stepper-panel {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px;
    }

    .stepper-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;

      .stepper-badge {
        font-size: 0.72rem;
        font-weight: 800;
        color: #38bdf8;
        letter-spacing: 0.08em;
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    .step-nav-buttons {
      display: flex;
      align-items: center;
      gap: 10px;

      .step-counter {
        font-size: 0.82rem;
        color: var(--text-muted);
        font-weight: 600;
      }
    }

    .steps-progress-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .step-progress-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      text-align: left;
      cursor: pointer;

      &:hover {
        background: var(--bg-card-hover);
      }

      &.active {
        border-color: #0ea5e9;
        background: rgba(14, 165, 233, 0.08);

        .step-circle {
          background: #0ea5e9;
          color: #ffffff;
        }

        .step-name {
          color: #ffffff;
        }
      }

      &.passed {
        border-color: rgba(16, 185, 129, 0.4);

        .step-circle {
          background: #10b981;
          color: #ffffff;
        }
      }

      .step-circle {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--bg-card);
        color: var(--text-dim);
        font-size: 0.75rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .step-meta {
        display: flex;
        flex-direction: column;
      }

      .step-name {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .step-phase {
        font-size: 0.7rem;
        color: var(--text-dim);
      }
    }

    .stepper-body {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .memory-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .mem-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
      }
    }

    .building-frame {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      padding: 10px 0;
    }

    .building-floor {
      width: 100%;
      padding: 14px;
      border-radius: 6px;
      border: 1px dashed var(--border-color);
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.3s;

      .floor-badge {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
      }

      &.unlocked {
        border-style: solid;
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.06);

        .floor-badge {
          color: #34d399;
        }
      }

      .field-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .field-item {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        padding: 4px 8px;
        border-radius: 4px;

        &.green {
          background: rgba(16, 185, 129, 0.15);
          color: #86efac;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        &.dim {
          color: var(--text-dim);
          font-style: italic;
        }
      }
    }

    .this-pointer {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-dim);
      transition: all 0.3s;

      &.active {
        color: #38bdf8;
        .pointer-arrow { transform: scale(1.3); color: #38bdf8; }
      }
    }

    .step-detail-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;

      .phase-tag {
        font-size: 0.72rem;
        font-weight: 700;
        color: #0ea5e9;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      h4 {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .step-explanation-text {
        font-size: 0.9rem;
        color: var(--text-muted);
        line-height: 1.6;
      }
    }

    .callout-box {
      margin-top: auto;
      background: rgba(14, 165, 233, 0.08);
      border: 1px solid rgba(14, 165, 233, 0.3);
      padding: 12px;
      border-radius: 6px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.82rem;
      color: var(--text-main);

      .callout-icon {
        font-size: 1.2rem;
      }
    }
  `]
})
export class ConstructorSuperComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly isInverted = signal<boolean>(false);
  readonly currentStepIndex = signal<number>(0);

  readonly steps: BuildingStep[] = [
    {
      stepNumber: 1,
      title: '1. Invocation',
      subtitle: 'new Livre("Dune", 1965, 412)',
      analogyPhase: 'Phase 1 : Permis de construire',
      memoryState: {
        baseAllocated: false,
        thisBorn: false,
        childFieldsInitialized: false
      },
      codeHighlightLine: 1,
      explanation: 'Le code appelant sollicite le constructeur de Livre avec ses 3 arguments. À ce stade exact, l\'objet n\'existe pas encore dans la mémoire heap et la variable this est en Zone Morte Temporelle (TDZ).'
    },
    {
      stepNumber: 2,
      title: '2. super(titre, annee)',
      subtitle: 'Coulage des fondations de Media',
      analogyPhase: 'Phase 2 : Fondations en béton armé',
      memoryState: {
        baseAllocated: true,
        thisBorn: true,
        childFieldsInitialized: false
      },
      codeHighlightLine: 3,
      explanation: 'L\'exécution de super(titre, annee) déclenche le constructeur de Media. Le moteur alloue le bloc mémoire parent et y inscrit titre="Dune" et annee=1965. En retour, le pointeur "this" naît officiellement !'
    },
    {
      stepNumber: 3,
      title: '3. Naissance de this',
      subtitle: 'Contexte mémoire opérationnel',
      analogyPhase: 'Phase 3 : Élévation des murs porteurs',
      memoryState: {
        baseAllocated: true,
        thisBorn: true,
        childFieldsInitialized: false
      },
      codeHighlightLine: 4,
      explanation: 'Le constructeur dérivé reprend la main. Désormais, "this" pointe vers une structure valide contenant les attributs hérités. L\'accès à this est maintenant autorisé par le compilateur.'
    },
    {
      stepNumber: 4,
      title: '4. this.nombrePages = 412',
      subtitle: 'Greffe des attributs spécialisés',
      analogyPhase: 'Phase 4 : Aménagements et finitions',
      memoryState: {
        baseAllocated: true,
        thisBorn: true,
        childFieldsInitialized: true
      },
      codeHighlightLine: 5,
      explanation: 'Livre enrichit l\'instance en lui greffant son champ propre nombrePages=412. L\'objet Livre complet est retourné à l\'appelant, prêt à l\'emploi avec toutes ses méthodes.'
    }
  ];

  readonly activeStep = computed(() => this.steps[this.currentStepIndex()]);
  readonly toggleButtonText = computed(() => 
    this.isInverted() ? "✔ Rétablir l'ordre légitime (super en premier)" : "⚡ Inverser l'ordre (Provoquer le piège TS17009)"
  );
  isStepPassed(i: number): boolean {
    return this.currentStepIndex() > i;
  }

  toggleInversion(): void {
    this.isInverted.update(v => !v);
  }

  setStep(index: number): void {
    this.currentStepIndex.set(index);
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update(i => i - 1);
    }
  }

  nextStep(): void {
    if (this.currentStepIndex() < this.steps.length - 1) {
      this.currentStepIndex.update(i => i + 1);
    }
  }
}
