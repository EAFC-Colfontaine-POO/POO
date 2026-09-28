import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-instanceof-type-narrowing',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 06</span>
          <span class="badge badge-purple">Type Narrowing</span>
          <span class="badge badge-warning">3 Pièges Critiques</span>
        </div>
        <h2>Le Garde de Type : <code>instanceof</code> & Type Narrowing</h2>
        <p class="module-desc">
          Quand le polymorphisme pur ne suffit pas : comment accéder aux méthodes exclusives d'une sous-classe sans polluer l'abstraction parente, et comment éviter les 3 pièges mortels en entreprise.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🔬 Démonstrateur Narrowing & 3 Pièges
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 4)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="narrowing-workbench">
          <!-- 1. Démonstrateur de Narrowing de Flux -->
          <div class="card-panel flow-panel">
            <div class="flow-header">
              <span class="step-badge">DÉMONSTRATEUR</span>
              <h3>Analyseur de Flux : Le Déverrouillage Magique</h3>
              <p>Voyez comment le compilateur change temporairement le type de <code>media</code> à l'intérieur du bloc :</p>
            </div>

            <div class="flow-interactive">
              <div class="media-selector-pills">
                <span>Tester avec :</span>
                <button 
                  class="pill-btn" 
                  [class.active]="currentMedia() === 'livre'"
                  (click)="currentMedia.set('livre')"
                >
                  📖 new Livre("Clean Code", 464)
                </button>
                <button 
                  class="pill-btn" 
                  [class.active]="currentMedia() === 'film'"
                  (click)="currentMedia.set('film')"
                >
                  🎬 new Film("Inception", 148)
                </button>
              </div>

              <!-- Bloc de code avec surbrillance dynamique de branche -->
              <div class="flow-code-card">
                <div class="code-flow-line" [class.active-branch]="true">
                  <code>function traiter(media: Media) {{ '{' }}</code>
                </div>

                <div class="code-flow-line nested" [class.active-branch]="currentMedia() === 'livre'">
                  <code>&nbsp;&nbsp;if (media instanceof Livre) {{ '{' }}</code>
                  @if (currentMedia() === 'livre') {
                    <span class="narrow-badge">✔ Type narrowed: Livre</span>
                  }
                </div>

                <div class="code-flow-line nested-2" [class.active-branch]="currentMedia() === 'livre'">
                  <code>&nbsp;&nbsp;&nbsp;&nbsp;console.log(media.pages);       // ✅ Déverrouillé : 464 pages</code>
                </div>

                <div class="code-flow-line nested-2" [class.active-branch]="currentMedia() === 'livre'">
                  <code>&nbsp;&nbsp;&nbsp;&nbsp;media.feuilleter();             // ✅ Déverrouillé : Feuilletage !</code>
                </div>

                <div class="code-flow-line nested" [class.active-branch]="currentMedia() === 'film'">
                  <code>&nbsp;&nbsp;{{ '}' }} else if (media instanceof Film) {{ '{' }}</code>
                  @if (currentMedia() === 'film') {
                    <span class="narrow-badge">✔ Type narrowed: Film</span>
                  }
                </div>

                <div class="code-flow-line nested-2" [class.active-branch]="currentMedia() === 'film'">
                  <code>&nbsp;&nbsp;&nbsp;&nbsp;console.log(media.duree);       // ✅ Déverrouillé : 148 min</code>
                </div>

                <div class="code-flow-line nested-2" [class.active-branch]="currentMedia() === 'film'">
                  <code>&nbsp;&nbsp;&nbsp;&nbsp;media.regarderBandeAnnonce();  // ✅ Déverrouillé : Teaser vidéo !</code>
                </div>

                <div class="code-flow-line">
                  <code>&nbsp;&nbsp;{{ '}' }}</code>
                </div>

                <div class="code-flow-line">
                  <code>{{ '}' }}</code>
                </div>
              </div>

              <div class="execution-result-bar">
                <span class="res-tag">SORTIE EXÉCUTÉE :</span>
                <span class="res-val">{{ getFlowResult() }}</span>
              </div>
            </div>
          </div>

          <!-- 2. LE SIMULATEUR DES 3 PIÈGES CRITIQUES -->
          <div class="card-panel pitfalls-card">
            <div class="pitfalls-header">
              <span class="danger-badge">ATTENTION AUX PIÈGES</span>
              <h3>Le Simulateur des 3 Pièges Mortels de <code>instanceof</code></h3>
              <p>Trois erreurs récurrentes rencontrées en environnement professionnel :</p>
            </div>

            <div class="pitfalls-tabs">
              <button 
                class="pitfall-tab-btn" 
                [class.active]="activePitfall() === 1"
                (click)="activePitfall.set(1)"
              >
                1. Interface vs Classe
              </button>
              <button 
                class="pitfall-tab-btn" 
                [class.active]="activePitfall() === 2"
                (click)="activePitfall.set(2)"
              >
                2. Syndrome JSON.parse()
              </button>
              <button 
                class="pitfall-tab-btn" 
                [class.active]="activePitfall() === 3"
                (click)="activePitfall.set(3)"
              >
                3. L'Abus de instanceof
              </button>
            </div>

            <!-- Contenu Piège 1 : Interface vs Classe -->
            @if (activePitfall() === 1) {
              <div class="pitfall-box">
                <div class="pitfall-problem">
                  <h4>❌ L'Erreur : Tenter un <code>instanceof</code> sur une interface TS</h4>
                  <div class="code-box">
                    <pre><code><span class="token-keyword">interface</span> <span class="token-type">MediaInterface</span> {{ '{' }}
  titre: <span class="token-type">string</span>;
{{ '}' }}

<span class="token-comment">// ❌ REFUS DE COMPILATION PAR TYPESCRIPT !</span>
<span class="token-keyword">if</span> (item <span class="token-keyword">instanceof</span> <span class="token-type">MediaInterface</span>) {{ '{' }} ... {{ '}' }}
<span class="token-error">// TS2693: 'MediaInterface' only refers to a type, but is being used as a value here.</span></code></pre>
                  </div>
                </div>

                <div class="pitfall-explanation">
                  <div class="exp-title">💡 Pourquoi ce blocage ?</div>
                  <p>
                    L'opérateur <code>instanceof</code> est un opérateur <strong>JavaScript natif du runtime</strong> qui inspecte la chaîne de prototypes. Or, les <code>interface</code> et <code>type</code> TypeScript subissent l'<strong>effacement de type (*type erasure*)</strong> : ils sont totalement supprimés du fichier JS final après compilation !
                  </p>
                  <div class="solution-tip">
                    ✔️ <strong>La solution :</strong> Utiliser l'opérateur JavaScript <code>'in'</code> (ex: <code>'titre' in item</code>) ou une fonction prédicat de type (<em>User-Defined Type Guard</em> : <code>item is Livre</code>).
                  </div>
                </div>
              </div>
            }

            <!-- Contenu Piège 2 : Le syndrome JSON.parse() -->
            @if (activePitfall() === 2) {
              <div class="pitfall-box">
                <div class="pitfall-problem">
                  <h4>⚠️ Le Syndrome : Des données reçues d'une API REST / WebSocket</h4>
                  <div class="code-box">
                    <pre><code><span class="token-comment">// Objet brut reçu par HTTP (désérialisé par JSON.parse)</span>
<span class="token-keyword">const</span> data = JSON.parse(<span class="token-str">'&#123;"titre":"Dune","pages":412&#125;'</span>);

console.log(data <span class="token-keyword">instanceof</span> <span class="token-class">Livre</span>);
<span class="token-comment">// 👉 Affiche FALSE ! Même si les propriétés titre et pages sont présentes !</span></code></pre>
                  </div>
                </div>

                <div class="interactive-resurrect">
                  <div class="resurrect-status">
                    <span>État actuel :</span>
                    <span class="badge" [class.badge-danger]="!isResurrected()" [class.badge-success]="isResurrected()">
                      data instanceof Livre === {{ isResurrected() ? 'true' : 'false' }}
                    </span>
                  </div>

                  <div class="resurrect-actions">
                    <button class="btn-primary btn-sm" [disabled]="isResurrected()" (click)="resurrectObject()">
                      ⚡ Ressusciter : new Livre(data.titre, data.pages)
                    </button>
                    <button class="btn-secondary btn-sm" [disabled]="!isResurrected()" (click)="isResurrected.set(false)">
                      ↺ Revenir à JSON brut
                    </button>
                  </div>

                  <div class="resurrect-desc">
                    @if (isResurrected()) {
                      <span class="text-success">
                        ✔ L'objet a été ré-instancié via son constructeur de classe ! Le pointeur <code>__proto__</code> est reconnecté à <code>Livre.prototype</code>. <code>instanceof Livre</code> vaut désormais <strong>true</strong>.
                      </span>
                    } @else {
                      <span class="text-muted">
                        Un objet issu de <code>JSON.parse()</code> n'a que <code>Object.prototype</code> dans sa chaîne de prototypes. Il ne possède aucune méthode et fait échouer <code>instanceof</code>.
                      </span>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Contenu Piège 3 : L'Abus de instanceof -->
            @if (activePitfall() === 3) {
              <div class="pitfall-box">
                <div class="pitfall-problem">
                  <h4>💥 L'Anti-pattern : La Tour de Contrôle déguisée en instanceof</h4>
                  <div class="code-box">
                    <pre><code><span class="token-comment">// ❌ CATASTROPHE : Réintroduction du procédural rigide !</span>
<span class="token-keyword">if</span> (media <span class="token-keyword">instanceof</span> <span class="token-class">Livre</span>) {{ '{' }}
  console.log(media.getDescriptionLivre());
{{ '}' }} <span class="token-keyword">else if</span> (media <span class="token-keyword">instanceof</span> <span class="token-class">Film</span>) {{ '{' }}
  console.log(media.getDescriptionFilm());
{{ '}' }} <span class="token-keyword">else if</span> (media <span class="token-keyword">instanceof</span> <span class="token-class">JeuVideo</span>) {{ '{' }}
  ...
{{ '}' }}</code></pre>
                  </div>
                </div>

                <!-- Jauge de dette technique -->
                <div class="debt-gauge-box">
                  <div class="gauge-header">
                    <span>Jauge de Dette Technique de l'architecture :</span>
                    <span class="gauge-val" [class.danger]="instanceofCount() > 3">
                      {{ (instanceofCount() * 25) }}% Risque de Régression
                    </span>
                  </div>
                  <div class="gauge-track">
                    <div class="gauge-fill" [style.width.%]="instanceofCount() * 25"></div>
                  </div>

                  <div class="gauge-actions">
                    <button class="btn-secondary btn-xs" (click)="addInstanceof()">
                      + Ajouter un if (m instanceof ...)
                    </button>
                    <button class="btn-primary btn-xs" (click)="refactorToPolymorphism()">
                      ✨ Refactoriser en Polymorphisme Pur (0 instanceof)
                    </button>
                  </div>

                  <div class="rule-box">
                    <strong>Règle d'or de conception :</strong> Réservez <code>instanceof</code> exclusivement à l'affichage de métadonnées spécifiques dans le template HTML. Pour tout calcul métier ou affichage général, utilisez une <strong>méthode polymorphe redéfinie</strong> !
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="4"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .narrowing-workbench {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .flow-panel {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .step-badge {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--bs-purple-light);
      }

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 2px 0;
        color: var(--text-main);
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin: 0;
      }
    }

    .media-selector-pills {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 0.82rem;
      color: var(--text-muted);
      flex-wrap: wrap;

      .pill-btn {
        padding: 6px 14px;
        border-radius: 6px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-main);

        &:hover { background: var(--bg-card-hover); }

        &.active {
          background: rgba(14, 165, 233, 0.2);
          border-color: #0ea5e9;
          color: #38bdf8;
        }
      }
    }

    .flow-code-card {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .code-flow-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 8px;
      border-radius: 4px;
      color: #64748b;

      &.nested { padding-left: 20px; }
      &.nested-2 { padding-left: 36px; }

      &.active-branch {
        background: rgba(14, 165, 233, 0.12);
        color: #f8fafc;
      }

      .narrow-badge {
        font-size: 0.7rem;
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
      }
    }

    .execution-result-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--bg-subtle);
      border-radius: 6px;
      border: 1px solid var(--border-color);
      margin-top: 10px;

      .res-tag {
        font-size: 0.72rem;
        font-weight: 800;
        color: var(--text-muted);
      }

      .res-val {
        font-family: var(--font-mono);
        font-size: 0.84rem;
        color: #86efac;
        font-weight: 600;
      }
    }

    /* Pièges */
    .pitfalls-card {
      padding: 20px;

      .danger-badge {
        font-size: 0.68rem;
        font-weight: 800;
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 2px 8px;
        border-radius: 4px;
      }

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
        margin: 4px 0 2px 0;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin: 0;
      }
    }

    .pitfalls-tabs {
      display: flex;
      gap: 8px;
      margin: 16px 0;
      flex-wrap: wrap;
    }

    .pitfall-tab-btn {
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      background: var(--bg-subtle);
      color: var(--text-muted);
      border: 1px solid var(--border-color);

      &:hover { color: var(--text-main); }

      &.active {
        background: var(--bs-purple);
        color: #fff;
        border-color: var(--bs-purple-light);
      }
    }

    .pitfall-box {
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;

      h4 {
        font-size: 0.92rem;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: var(--text-main);
      }
    }

    .code-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.5;

      pre { margin: 0; }
    }

    .token-comment { color: #64748b; font-style: italic; }
    .token-keyword { color: #c084fc; font-weight: 600; }
    .token-str { color: #86efac; }
    .token-type { color: #fde047; }
    .token-class { color: #38bdf8; font-weight: 600; }
    .token-error { color: #f87171; font-weight: 700; }

    .pitfall-explanation {
      font-size: 0.82rem;
      line-height: 1.5;
      color: var(--text-muted);

      .exp-title {
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 4px;
      }

      .solution-tip {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 10px 12px;
        border-radius: 6px;
        margin-top: 10px;
        color: #ecfdf5;

        strong { color: #34d399; }
      }
    }

    .interactive-resurrect {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      background: var(--bg-card);
      border-radius: 6px;

      .resurrect-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 0.82rem;
      }

      .resurrect-actions {
        display: flex;
        gap: 8px;
      }

      .resurrect-desc {
        font-size: 0.78rem;
        line-height: 1.4;
      }
    }

    .debt-gauge-box {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
      background: var(--bg-card);
      border-radius: 6px;

      .gauge-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.8rem;
        font-weight: 700;

        .gauge-val.danger { color: #f87171; }
      }

      .gauge-track {
        height: 8px;
        background: var(--bg-subtle);
        border-radius: 4px;
        overflow: hidden;
      }

      .gauge-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
        transition: width 0.3s ease;
      }

      .gauge-actions {
        display: flex;
        gap: 8px;
      }

      .rule-box {
        margin-top: 4px;
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.45;
        border-left: 3px solid var(--bs-purple);
        padding-left: 10px;

        strong { color: var(--bs-purple-light); }
      }
    }
  `]
})
export class InstanceofTypeNarrowingComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');
  readonly currentMedia = signal<'livre' | 'film'>('livre');
  readonly activePitfall = signal<1 | 2 | 3>(1);

  readonly isResurrected = signal<boolean>(false);
  readonly instanceofCount = signal<number>(4);

  getFlowResult(): string {
    if (this.currentMedia() === 'livre') {
      return 'Pages : 464 · Feuilletage du livre : consultation des chapitres.';
    } else {
      return 'Durée : 148 min · Bande-annonce vidéo : lecture du teaser.';
    }
  }

  resurrectObject(): void {
    this.isResurrected.set(true);
  }

  addInstanceof(): void {
    if (this.instanceofCount() < 4) {
      this.instanceofCount.update(c => c + 1);
    }
  }

  refactorToPolymorphism(): void {
    this.instanceofCount.set(0);
  }
}
