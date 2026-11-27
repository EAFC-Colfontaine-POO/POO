import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-service-anatomy',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 02 · Robustesse &amp; Conception</div>
        <h2>Anatomie d'un Service Signal-First &amp; Fiche Anti-Bugs</h2>
        <p class="module-desc">
          Un service moderne Angular 22 repose sur 4 piliers inébranlables. Explorez son écorché interactif
          et reproduisez en direct les deux pièges les plus dévastateurs : l'erreur <code>NG0203</code>
          et le blocage de la réactivité par mutation <code>.push()</code>.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Écorché Interactif &amp; Fiche Anti-Bugs</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 2 · 3 Ex)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Écorché Interactif des 4 Piliers -->
        <section class="card-panel">
          <div class="panel-header">
            <h3>🏛️ Les 4 Piliers d'un Service Angular 22</h3>
            <span class="badge badge-purple">Standard de Production</span>
          </div>

          <!-- Sélecteur de pilier interactif -->
          <div class="pillar-nav-pills my-3">
            <button class="pillar-pill" [class.active]="selectedPillar() === 1" (click)="selectedPillar.set(1)">
              1. providedIn: 'root'
            </button>
            <button class="pillar-pill" [class.active]="selectedPillar() === 2" (click)="selectedPillar.set(2)">
              2. État Privé (#)
            </button>
            <button class="pillar-pill" [class.active]="selectedPillar() === 3" (click)="selectedPillar.set(3)">
              3. asReadonly &amp; computed
            </button>
            <button class="pillar-pill" [class.active]="selectedPillar() === 4" (click)="selectedPillar.set(4)">
              4. Mutations Immutables
            </button>
          </div>

          <div class="grid-2-cols">
            <div class="code-box">
              <div class="code-header">
                <span>panier.service.ts</span>
                <span class="badge badge-ts">Angular 22</span>
              </div>
              <pre><code><span [class.highlight-line]="selectedPillar() === 1">@Injectable({{ '{' }} providedIn: 'root' {{ '}' }})</span>
export class PanierService {{ '{' }}
  <span [class.highlight-line]="selectedPillar() === 2">// 1. L'état : privé et réactif (#)
  readonly #articles = signal&lt;Produit[]&gt;([]);</span>

  <span [class.highlight-line]="selectedPillar() === 3">// 2. La vue publique : lecture seule
  readonly articles = this.#articles.asReadonly();
  readonly total = computed(() =&gt;
    this.#articles().reduce((t, p) =&gt; t + p.prix, 0)
  );</span>

  <span [class.highlight-line]="selectedPillar() === 4">// 3. Les seules portes d'entrée pour modifier
  ajouter(p: Produit): void {{ '{' }}
    this.#articles.update(liste =&gt; [...liste, p]); // immutable
  {{ '}' }}</span>
{{ '}' }}</code></pre>
            </div>

            <!-- Fiche Explicative du Pilier Sélectionné -->
            <div class="pillar-detail-box">
              @switch (selectedPillar()) {
                @case (1) {
                  <div class="pillar-focus">
                    <div class="focus-title">Pôle 1 : Déclaration Singleton (providedIn: 'root')</div>
                    <p>
                      Enregistre le service directement auprès du Root Injector d'Angular.
                      Une seule et unique instance est partagée par l'ensemble des composants et de l'arbre de navigation.
                    </p>
                    <div class="tip-box">
                      💡 <strong>Gain supplémentaire :</strong> Le service est <em>tree-shakable</em>. S'il n'est importé nulle part, il est purgé à la compilation et n'alourdit pas votre fichier bundle JavaScript.
                    </div>
                  </div>
                }
                @case (2) {
                  <div class="pillar-focus">
                    <div class="focus-title">Pôle 2 : Encapsulation Stricte (#)</div>
                    <p>
                      Le caractère <code>#</code> applique une vraie encapsulation privée native de standard ES2022.
                      Aucun composant consommateur ne peut appeler directement <code>service.#articles.set([])</code>.
                    </p>
                    <div class="tip-box">
                      🛡️ <strong>Règle d'or :</strong> L'état est la propriété exclusive du service. Seules ses méthodes publiques ont le droit d'en ordonner la mutation.
                    </div>
                  </div>
                }
                @case (3) {
                  <div class="pillar-focus">
                    <div class="focus-title">Pôle 3 : Exposition en Lecture Seule &amp; Dérivation</div>
                    <p>
                      <code>asReadonly()</code> expose une signature de lecture <code>Signal&lt;T&gt;</code> débarrassée des fonctions <code>.set()</code> et <code>.update()</code>.
                      Les <code>computed()</code> calculent dynamiquement les totaux et s'auto-memoizent sans risque de désynchronisation.
                    </p>
                    <div class="tip-box">
                      👁️ <strong>Rôle du composant :</strong> Les composants <em>lisent</em> <code>articles()</code> et <code>total()</code>, mais ne décident jamais de la logique comptable.
                    </div>
                  </div>
                }
                @case (4) {
                  <div class="pillar-focus">
                    <div class="focus-title">Pôle 4 : Mutations Immutables (.update + Spread)</div>
                    <p>
                      Angular compare les signaux par identité de référence mémoire (<code>Object.is</code>).
                      Tout ajout ou suppression doit obligatoirement produire une <strong>nouvelle référence</strong> de tableau via <code>[...liste, p]</code> ou <code>liste.filter(...)</code>.
                    </p>
                    <div class="tip-box warning">
                      🚫 <strong>Piège mortel :</strong> <code>.push()</code> modifie le tableau sans changer son adresse mémoire. Le signal reste aveugle et le template ne bouge plus !
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </section>

        <!-- 2. Démystificateur de Bugs en Direct -->
        <section class="card-panel mt-4">
          <div class="panel-header">
            <h3>💣 Laboratoire des Erreurs Fréquentes (Live Bug Reproducers)</h3>
            <span class="badge badge-red">Anti-Patterns Fréquents</span>
          </div>

          <div class="grid-2-cols mt-3">
            <!-- Bug 1 : NG0203 -->
            <div class="bug-box">
              <div class="bug-box-header">
                <span class="bug-badge">Bug 1</span>
                <h4>L'Erreur NG0203 : inject() hors contexte</h4>
              </div>
              <p class="bug-desc">
                Appeler <code>inject()</code> dans une méthode ou un callback au lieu de la déclaration des champs.
              </p>

              <div class="btn-group my-2">
                <button class="btn-toggle" [class.active]="ng0203Mode() === 'bad'" (click)="ng0203Mode.set('bad')">
                  ❌ Appel dans un (click)
                </button>
                <button class="btn-toggle active-green" [class.active]="ng0203Mode() === 'good'" (click)="ng0203Mode.set('good')">
                  ✅ Déclaration au niveau du champ
                </button>
              </div>

              <div class="code-box">
                <pre><code>{{ ng0203Mode() === 'bad' ? badInjectCode : goodInjectCode }}</code></pre>
              </div>

              <button class="btn-primary w-full mt-2" (click)="triggerNg0203()">
                ▶️ Simuler le clic utilisateur : <code>onCommander()</code>
              </button>

              @if (ng0203Triggered()) {
                <div class="terminal-mini mt-2" [class.error]="ng0203Mode() === 'bad'" [class.success]="ng0203Mode() === 'good'">
                  <div class="term-title">Console DevTools :</div>
                  @if (ng0203Mode() === 'bad') {
                    <div class="term-err-line">
                      ❌ RuntimeError: NG0203: inject() must be called from an injection context such as a constructor, a factory function, a field initializer, or a function used with runInInjectionContext.
                    </div>
                  } @else {
                    <div class="term-ok-line">
                      ✓ Dépendance injectée avec succès au chargement du composant. Commande validée !
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Bug 2 : Le piège .push() -->
            <div class="bug-box">
              <div class="bug-box-header">
                <span class="bug-badge">Bug 2</span>
                <h4>Le Piège .push() : Mort de la Réactivité</h4>
              </div>
              <p class="bug-desc">
                Muter le tableau directement sans changer la référence mémoire : le signal ne réagit plus.
              </p>

              <div class="btn-group my-2">
                <button class="btn-toggle" [class.active]="pushMode() === 'push'" (click)="setPushMode('push')">
                  ❌ this.articles().push(...)
                </button>
                <button class="btn-toggle active-green" [class.active]="pushMode() === 'update'" (click)="setPushMode('update')">
                  ✅ this.articles.update(...)
                </button>
              </div>

              <div class="code-box">
                <pre><code>{{ pushMode() === 'push' ? codePush : codeUpdate }}</code></pre>
              </div>

              <div class="push-interactive-row mt-2">
                <button class="btn-primary" (click)="ajouterArticleTest()">
                  + Ajouter un article
                </button>
                <button class="btn-secondary" (click)="resetPushDemo()">
                  ↺ Vider
                </button>
              </div>

              <!-- Visualisation de l'effet sur le DOM -->
              <div class="reactivity-arena mt-3">
                <div class="arena-metric-row">
                  <div>Donnée en mémoire : <strong>{{ memoryArticlesCount() }} article(s)</strong></div>
                  <div>Rendu à l'écran (Signal) : <strong>{{ displayedArticlesCount() }} article(s)</strong></div>
                </div>

                <div class="ref-badge-row">
                  <span>Adresse mémoire du tableau :</span>
                  <span class="addr-badge" [class.isolated-1]="pushMode() === 'push'" [class.root]="pushMode() === 'update'">
                    {{ currentArrayRef() }}
                  </span>
                </div>

                @if (pushMode() === 'push' && memoryArticlesCount() > displayedArticlesCount()) {
                  <div class="frozen-screen-alert mt-2">
                    🥶 <strong>ÉCRAN FIGÉ :</strong> La donnée a bien été ajoutée au tableau en RAM, mais son adresse mémoire reste <code>{{ currentArrayRef() }}</code> !
                    Angular compare <code>0xOLD === 0xOLD</code> et décide qu'il n'y a aucun changement : l'utilisateur ne voit rien !
                  </div>
                }
              </div>
            </div>
          </div>
        </section>
      } @else {
        <app-lab-runner [defaultLabNumber]="2"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
      }
    }

    .pillar-nav-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pillar-pill {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        color: var(--text-main);
      }

      &.active {
        background: var(--ts-blue);
        color: #fff;
        border-color: var(--ts-blue);
      }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 900px) {
      .grid-2-cols {
        grid-template-columns: 1fr;
      }
    }

    .highlight-line {
      background: rgba(49, 120, 198, 0.25);
      border-left: 3px solid #3b82f6;
      display: block;
      margin: 0 -14px;
      padding: 2px 14px;
    }

    .pillar-detail-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .focus-title {
        font-size: 1rem;
        font-weight: 800;
        color: var(--ts-blue-light);
        margin-bottom: 10px;
      }

      p {
        font-size: 0.88rem;
        line-height: 1.6;
        color: var(--text-main);
        margin-bottom: 16px;
      }
    }

    .tip-box {
      background: rgba(49, 120, 198, 0.1);
      border: 1px solid rgba(49, 120, 198, 0.3);
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      color: var(--ts-blue-light);

      &.warning {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }
    }

    .bug-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;

      .bug-box-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;

        h4 {
          font-size: 0.92rem;
          font-weight: 700;
        }
      }

      .bug-badge {
        font-size: 0.7rem;
        font-weight: 700;
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .bug-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 8px;
      }
    }

    .btn-group {
      display: flex;
      gap: 4px;
      background: var(--bg-card);
      padding: 3px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }

    .btn-toggle {
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);

      &.active {
        background: #ef4444;
        color: #fff;
      }
      &.active-green.active {
        background: #10b981;
      }
    }

    .terminal-mini {
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      padding: 10px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.75rem;

      .term-title {
        color: var(--text-dim);
        font-size: 0.7rem;
        margin-bottom: 4px;
      }

      &.error {
        border-color: rgba(239, 68, 68, 0.4);
        color: #f87171;
      }

      &.success {
        border-color: rgba(16, 185, 129, 0.4);
        color: #34d399;
      }
    }

    .push-interactive-row {
      display: flex;
      gap: 8px;
    }

    .reactivity-arena {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.82rem;

      .arena-metric-row {
        display: flex;
        justify-content: space-between;
      }

      .ref-badge-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    .frozen-screen-alert {
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #7dd3fc;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      line-height: 1.45;
    }
  `]
})
export class ServiceAnatomyComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly selectedPillar = signal<number>(1);

  // Bug 1 : NG0203
  readonly ng0203Mode = signal<'bad' | 'good'>('bad');
  readonly ng0203Triggered = signal<boolean>(false);

  readonly badInjectCode = `// ❌ INTERDIT : inject() dans une méthode callback
export class CommandeComponent {
  onCommander(): void {
    // 💥 Crash immédiat à l'exécution : NG0203 !
    const panier = inject(PanierService);
    panier.valider();
  }
}`;

  readonly goodInjectCode = `// ✅ RECOMMANDÉ : inject() au niveau de la déclaration des champs
export class CommandeComponent {
  // Contexte d'injection valide lors de l'instanciation de la classe
  private readonly panier = inject(PanierService);

  onCommander(): void {
    this.panier.valider(); // 100% sûr !
  }
}`;

  // Bug 2 : .push()
  readonly pushMode = signal<'push' | 'update'>('push');
  readonly memoryArticlesCount = signal<number>(0);
  readonly displayedArticlesCount = signal<number>(0);
  readonly currentArrayRef = signal<string>('#0xMEM_INIT');

  readonly codePush = `// ❌ LE PIÈGE : Mutation en place avec .push()
ajouter(item: Produit): void {
  this.#articles().push(item);
  // L'adresse mémoire reste #0xMEM_INIT
  // Angular compare prev === next et ne redessine rien !
}`;

  readonly codeUpdate = `// ✅ LA RÈGLE : Nouvelle référence avec .update()
ajouter(item: Produit): void {
  this.#articles.update(liste => [...liste, item]);
  // Nouvelle adresse #0xMEM_NEW allouée
  // Angular détecte le changement et rafraîchit la vue !
}`;

  triggerNg0203(): void {
    this.ng0203Triggered.set(true);
  }

  setPushMode(mode: 'push' | 'update'): void {
    this.pushMode.set(mode);
    this.resetPushDemo();
  }

  ajouterArticleTest(): void {
    if (this.pushMode() === 'push') {
      this.memoryArticlesCount.update(c => c + 1);
      // Remarque : displayedArticlesCount NE BOUGE PAS, adresse mémoire inchangée
    } else {
      this.memoryArticlesCount.update(c => c + 1);
      this.displayedArticlesCount.set(this.memoryArticlesCount());
      const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
      this.currentArrayRef.set(`#0xNEW_${randomHex}`);
    }
  }

  resetPushDemo(): void {
    this.memoryArticlesCount.set(0);
    this.displayedArticlesCount.set(0);
    this.currentArrayRef.set('#0xMEM_INIT');
  }
}
