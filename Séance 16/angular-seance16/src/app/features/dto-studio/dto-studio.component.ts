import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface PipelineStep {
  num: number;
  label: string;
  sub: string;
  typeSign: string;
  category: 'ram' | 'trans' | 'file';
  codeSnippet: string;
  description: string;
}

@Component({
  selector: 'app-dto-studio',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 05 · Patron Architectural DTO</div>
        <h2>Le Studio DTO &amp; La Fabrique fromDTO()</h2>
        <p class="module-desc">
          Le patron DTO (<em>Data Transfer Object</em>) découple la forteresse métier de son enveloppe de transport.
          Explorez le <strong>pipeline de sérialisation en 7 phases</strong> et observez comment la fabrique statique
          <code>fromDTO()</code> protège vos invariants contre les données corrompues de l'extérieur.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'pipeline'" (click)="activeSubTab.set('pipeline')">
              🔄 Pipeline Interactif Pas-à-Pas (7 Phases)
            </button>
            <button class="mode-tab-btn" [class.active]="activeSubTab() === 'invariants'" (click)="activeSubTab.set('invariants')">
              🛡️ Inspecteur d'Invariants &amp; Type Guard
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Aller aux Exercices du Labo 4 ➔
          </button>
        </div>
      </div>

      <!-- ONGLET 1 : PIPELINE EN 7 PHASES -->
      @if (activeSubTab() === 'pipeline') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">1</span>
              <div>
                <h3 class="zone-title">Le Cycle Complet en 7 Phases</h3>
                <p class="zone-subtitle">Cliquez sur chaque étape du flux pour analyser la métamorphose de l'objet.</p>
              </div>
            </div>
          </div>

          <!-- Stepper horizontal du pipeline -->
          <div class="pipeline-track">
            @for (st of pipelineSteps; track st.num) {
              <button 
                class="pipe-step-btn" 
                [class.active]="currentStep() === st.num"
                [class]="'cat-' + st.category"
                (click)="currentStep.set(st.num)"
              >
                <div class="pipe-header">
                  <span class="st-num">{{ st.num }}</span>
                  <span class="st-badge">{{ st.category | uppercase }}</span>
                </div>
                <div class="st-label">{{ st.label }}</div>
                <div class="st-type">{{ st.typeSign }}</div>
              </button>
              @if (st.num < 7) {
                <div class="pipe-connector">➔</div>
              }
            }
          </div>

          <!-- Détail de l'étape active -->
          <div class="pipeline-detail-card">
            <div class="detail-header">
              <div class="detail-title-col">
                <span class="badge" [class.badge-ts]="activeStepData().category === 'ram'" [class.badge-purple]="activeStepData().category !== 'ram'">
                  Phase {{ activeStepData().num }} / 7 : {{ activeStepData().category | uppercase }}
                </span>
                <h4>{{ activeStepData().label }} — <code>{{ activeStepData().typeSign }}</code></h4>
              </div>
              <div class="detail-sub">{{ activeStepData().sub }}</div>
            </div>

            <div class="detail-grid">
              <div class="detail-code-box">
                <div class="box-title">Instruction exécutée à cette étape :</div>
                <pre><code>{{ activeStepData().codeSnippet }}</code></pre>
              </div>

              <div class="detail-expl-box">
                <div class="box-title">💡 Rôle et enjeu architectural :</div>
                <p>{{ activeStepData().description }}</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 2 : INSPECTEUR D'INVARIANTS -->
      @if (activeSubTab() === 'invariants') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">2</span>
              <div>
                <h3 class="zone-title">Inspecteur de Type Guard &amp; Invariants Métier</h3>
                <p class="zone-subtitle">Modifiez le payload JSON ci-dessous (titre vide, type altéré) et observez la réaction de la fabrique.</p>
              </div>
            </div>

            <div class="scenario-buttons">
              <button class="btn-secondary" (click)="loadValidPayload()">Payload Valide</button>
              <button class="btn-secondary" (click)="loadEmptyTitlePayload()">Titre Vide (Invariant)</button>
              <button class="btn-secondary" (click)="loadCorruptedTypesPayload()">Types Corrompus (Garde)</button>
            </div>
          </div>

          <div class="invariants-layout">
            <!-- Colonne Saisie JSON -->
            <div class="inv-col">
              <div class="col-bar">
                <span>1. Payload JSON Brut en Entrée (Éditable) :</span>
                <button class="btn-primary rehydrate-action-btn" [class.just-rehydrated]="justRehydrated()" (click)="rehydrateFromJson()">
                  ⚙️ Tache.fromDTO(JSON.parse(json))
                  @if (justRehydrated()) {
                    <span class="btn-flash-tag">✔ Exécuté !</span>
                  }
                </button>
              </div>

              <textarea 
                class="json-editor-textarea" 
                [(ngModel)]="rawJsonPayload" 
                (ngModelChange)="onPayloadEdited()"
                rows="8"
              ></textarea>

              <div class="editor-hint-bar">
                <span>💡 <em>Mode Bac à Sable :</em> Modifiez le JSON ou choisissez un scénario pour voir la réaction de la fabrique.</span>
                @if (lastRehydratedTime()) {
                  <span class="timestamp-tag">Dernière exécution : {{ lastRehydratedTime() }}</span>
                }
              </div>

              <div class="guard-status-box" [class.guard-pass]="guardPassed()" [class.guard-fail]="!guardPassed()">
                <div class="guard-header">
                  <span>Type Guard : <code>estTacheDTO(val: unknown): val is TacheDTO</code></span>
                  <span class="badge" [class.badge-success]="guardPassed()" [class.badge-red]="!guardPassed()">
                    {{ guardPassed() ? '✔ Forme Valide' : '✖ Rejet de Structure' }}
                  </span>
                </div>
                <div class="guard-desc">{{ guardMessage() }}</div>
              </div>
            </div>

            <!-- Colonne Résultat de la Fabrique -->
            <div class="inv-col">
              <div class="col-bar">
                <span>2. Réaction de la Fabrique Statique fromDTO() :</span>
                <span class="badge" [class.badge-success]="factoryStatus() === 'success'" [class.badge-red]="factoryStatus() === 'error'">
                  {{ factoryStatus() === 'success' ? '✔ Instance Créée' : '✖ Erreur Levée' }}
                </span>
              </div>

              @if (factoryStatus() === 'success') {
                <div class="factory-success-card">
                  <div class="card-hero">🎉 Instance <code>class Tache</code> Réhydratée avec Succès !</div>
                  
                  <div class="instance-checks-grid">
                    <div class="check-item">
                      <span class="c-key">instanceof Tache :</span>
                      <code class="c-val-ok">true (Prototype restauré !)</code>
                    </div>
                    <div class="check-item">
                      <span class="c-key">Méthode .terminer() :</span>
                      <code class="c-val-ok">Disponible et exécutable</code>
                    </div>
                    <div class="check-item">
                      <span class="c-key">t.echeance instanceof Date :</span>
                      <code class="c-val-ok">true (getFullYear() = {{ hydratedYear() }})</code>
                    </div>
                    <div class="check-item">
                      <span class="c-key">Invariant respecté :</span>
                      <code class="c-val-ok">Titre non vide validé par le constructeur</code>
                    </div>
                  </div>
                </div>
              } @else {
                <div class="factory-error-card">
                  <div class="err-title">🚨 Exception Métier Déclenchée par le Constructeur :</div>
                  <pre class="err-box"><code>{{ factoryErrorMessage() }}</code></pre>
                  <p class="err-explanation">
                    🛡️ <strong>Triomphe de la POO :</strong> Parce que nous sommes passés par <code>Tache.fromDTO()</code> et <code>new Tache(...)</code>, le constructeur a validé ses invariants.
                    L'application <strong>refuse catégoriquement</strong> de créer un objet incohérent en mémoire !
                  </p>
                </div>
              }
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

    /* Pipeline Track */
    .pipeline-track {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      padding: 10px 0;
      margin-bottom: 16px;
    }

    .pipe-step-btn {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 8px 12px;
      min-width: 140px;
      text-align: left;
      transition: all 0.2s;

      &:hover {
        border-color: var(--border-focus);
      }

      &.active {
        border-color: #a855f7;
        background: rgba(147, 51, 234, 0.15);
      }
    }

    .pipe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .st-num {
      font-size: 0.72rem;
      font-weight: 800;
      color: #c084fc;
      font-family: var(--font-mono);
    }

    .st-badge {
      font-size: 0.6rem;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      background: var(--bg-subtle);
      color: var(--text-dim);
    }

    .st-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .st-type {
      font-size: 0.68rem;
      font-family: var(--font-mono);
      color: #60a5fa;
    }

    .pipe-connector {
      font-size: 0.8rem;
      color: var(--text-dim);
      font-weight: 700;
      flex-shrink: 0;
    }

    .pipeline-detail-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .detail-title-col {
      display: flex;
      flex-direction: column;
      gap: 4px;

      h4 {
        font-size: 1.05rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    .detail-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .detail-code-box, .detail-expl-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .box-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
      }

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        padding: 10px;
        border-radius: 6px;
        font-size: 0.78rem;
        font-family: var(--font-mono);
        color: #34d399;
        line-height: 1.4;
      }

      p {
        background: var(--bg-card);
        border-left: 3px solid #a855f7;
        padding: 10px 14px;
        border-radius: 0 6px 6px 0;
        font-size: 0.82rem;
        color: var(--text-main);
        line-height: 1.5;
      }
    }

    /* Invariants Inspector */
    .scenario-buttons {
      display: flex;
      gap: 8px;
    }

    .invariants-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .inv-col {
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

    .rehydrate-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      &.just-rehydrated {
        background: #059669;
        transform: scale(1.02);
      }
    }

    .btn-flash-tag {
      background: rgba(255, 255, 255, 0.25);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 0.72rem;
    }

    .editor-hint-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.74rem;
      color: var(--text-muted);
      margin-top: -2px;
      flex-wrap: wrap;
      gap: 6px;
    }

    .timestamp-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: #38bdf8;
    }

    .json-editor-textarea {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      color: #f8fafc;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      resize: vertical;
      line-height: 1.4;

      &:focus {
        border-color: var(--border-focus);
        outline: none;
      }
    }

    .guard-status-box {
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 0.78rem;
      display: flex;
      flex-direction: column;
      gap: 4px;

      &.guard-pass {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #86efac;
      }
      &.guard-fail {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      .guard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .guard-desc {
        color: var(--text-muted);
      }
    }

    .factory-success-card {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 6px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .card-hero {
        font-size: 0.95rem;
        font-weight: 800;
        color: #34d399;
      }
    }

    .instance-checks-grid {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .check-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.76rem;

      .c-key {
        color: var(--text-muted);
      }
      .c-val-ok {
        color: #34d399;
        font-weight: 600;
      }
    }

    .factory-error-card {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 6px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .err-title {
        font-size: 0.88rem;
        font-weight: 800;
        color: #f87171;
      }

      .err-box {
        background: var(--bg-code);
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.78rem;
        font-family: var(--font-mono);
        color: #fca5a5;
      }

      .err-explanation {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }
  `]
})
export class DtoStudioComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly activeSubTab = signal<'pipeline' | 'invariants'>('pipeline');
  readonly currentStep = signal<number>(1);

  readonly pipelineSteps: PipelineStep[] = [
    {
      num: 1,
      label: 'Entité Métier',
      sub: 'Objet vivant en RAM',
      typeSign: 'class Tache',
      category: 'ram',
      codeSnippet: `const entite = new Tache("T-1", "Créer DTO", new Date());\nentite.terminer(); // Méthode active !`,
      description: "L'entité vit dans le tas. Ses méthodes sont opérationnelles et ses attributs privés sont encapsulés."
    },
    {
      num: 2,
      label: '.toDTO()',
      sub: 'Projection sortante',
      typeSign: 'interface TacheDTO',
      category: 'trans',
      codeSnippet: `const dto: TacheDTO = entite.toDTO();\n// echeance devient un string ISO`,
      description: "L'entité s'aplatit en une structure passive sans méthodes. Les objets complexes (Date) sont convertis en scalaires."
    },
    {
      num: 3,
      label: 'JSON.stringify()',
      sub: 'Sérialisation',
      typeSign: 'string (JSON)',
      category: 'file',
      codeSnippet: `const fluxJson: string = JSON.stringify(dto, null, 2);`,
      description: "Le DTO est traduit en chaîne de caractères 1D linéaire, prête à être écrite sur le disque ou transmise sur le réseau."
    },
    {
      num: 4,
      label: 'Fichier / Réseau',
      sub: 'Transport durable',
      typeSign: 'taches.json',
      category: 'file',
      codeSnippet: `await fileHandle.write(fluxJson);\n// Stocké sur SSD ou envoyé en POST HTTP`,
      description: "Le fichier texte froid dort sur le disque. Il est universel, mais ignore totalement le monde de la POO."
    },
    {
      num: 5,
      label: 'JSON.parse()',
      sub: 'Désérialisation brute',
      typeSign: 'unknown / any',
      category: 'trans',
      codeSnippet: `const brut: unknown = JSON.parse(await file.text());\n// Objet littéral pur relié à Object.prototype`,
      description: "La chaîne redevient une structure en mémoire. Mais attention : elle n'a AUCUNE méthode et son type est dangereux (unknown) !"
    },
    {
      num: 6,
      label: 'Tache.fromDTO()',
      sub: 'Fabrique de réhydratation',
      typeSign: 'Tache.fromDTO(dto)',
      category: 'trans',
      codeSnippet: `if (estTacheDTO(brut)) {\n  const vivante = Tache.fromDTO(brut);\n}`,
      description: "Après validation par le Type Guard, la fabrique appelle new Tache(...). Le constructeur vérifie les invariants et rétablit les méthodes !"
    },
    {
      num: 7,
      label: 'Instance Restaurée',
      sub: 'Objet réhydraté en RAM',
      typeSign: 'class Tache (vivante)',
      category: 'ram',
      codeSnippet: `vivante.terminer(); // ✅ Fonctionne !\nvivante instanceof Tache; // ✅ true`,
      description: "La boucle est bouclée ! L'armoire a été remontée avec toutes ses charnières et ses rails grâce à la notice POO."
    }
  ];

  readonly activeStepData = computed<PipelineStep>(() => {
    return this.pipelineSteps[this.currentStep() - 1];
  });

  // Invariants Inspector State
  rawJsonPayload = `{
  "id": "T-404",
  "titre": "Corriger le bug de sérialisation",
  "echeance": "2026-11-05T10:00:00.000Z",
  "terminee": false
}`;

  readonly guardPassed = signal<boolean>(true);
  readonly guardMessage = signal<string>('La structure respecte scrupuleusement le contrat TacheDTO.');
  readonly factoryStatus = signal<'success' | 'error'>('success');
  readonly factoryErrorMessage = signal<string>('');
  readonly hydratedYear = signal<number>(2026);
  readonly justRehydrated = signal<boolean>(false);
  readonly lastRehydratedTime = signal<string>('');

  loadValidPayload(): void {
    this.rawJsonPayload = `{
  "id": "T-404",
  "titre": "Corriger le bug de sérialisation",
  "echeance": "2026-11-05T10:00:00.000Z",
  "terminee": false
}`;
    this.rehydrateFromJson();
  }

  loadEmptyTitlePayload(): void {
    this.rawJsonPayload = `{
  "id": "T-405",
  "titre": "   ",
  "echeance": "2026-11-05T10:00:00.000Z",
  "terminee": false
}`;
    this.rehydrateFromJson();
  }

  loadCorruptedTypesPayload(): void {
    this.rawJsonPayload = `{
  "id": 9999,
  "titre": true,
  "echeance": 12345
}`;
    this.rehydrateFromJson();
  }

  onPayloadEdited(): void {
    this.rehydrateFromJson();
  }

  rehydrateFromJson(): void {
    this.justRehydrated.set(true);
    this.lastRehydratedTime.set(new Date().toLocaleTimeString());
    setTimeout(() => this.justRehydrated.set(false), 1200);

    try {
      const parsed: unknown = JSON.parse(this.rawJsonPayload);

      // Type Guard
      const isDto = this.checkIsTacheDto(parsed);
      this.guardPassed.set(isDto);

      if (!isDto) {
        this.guardMessage.set('Échec Type Guard : l\'objet ne contient pas les champs requis typés en string/boolean.');
        this.factoryStatus.set('error');
        this.factoryErrorMessage.set('ValidationError: Le payload reçu ne satisfait pas le contrat TacheDTO.');
        return;
      }

      this.guardMessage.set('Type Guard réussi : les propriétés sont conformes.');

      // Constructeur validation
      const dto = parsed as any;
      if (!dto.titre || dto.titre.trim() === '') {
        this.factoryStatus.set('error');
        this.factoryErrorMessage.set('Error: Titre obligatoire. L\'invariant de classe interdit un titre vide.');
        return;
      }

      // Succès
      const dateInstance = new Date(dto.echeance);
      this.hydratedYear.set(dateInstance.getFullYear() || 2026);
      this.factoryStatus.set('success');
      this.factoryErrorMessage.set('');

    } catch (err: any) {
      this.guardPassed.set(false);
      this.guardMessage.set(`SyntaxError JSON : ${err.message}`);
      this.factoryStatus.set('error');
      this.factoryErrorMessage.set(err.message);
    }
  }

  private checkIsTacheDto(val: unknown): boolean {
    if (typeof val !== 'object' || val === null) return false;
    const obj = val as Record<string, unknown>;
    return (
      typeof obj['id'] === 'string' &&
      typeof obj['titre'] === 'string' &&
      typeof obj['echeance'] === 'string' &&
      typeof obj['terminee'] === 'boolean'
    );
  }

  jumpToLab(): void {
    this.exercises.setFilterLab(4);
    this.nav.setTab('workshops-lab');
  }
}
