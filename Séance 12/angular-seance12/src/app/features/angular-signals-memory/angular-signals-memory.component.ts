import { Component, signal } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

class ArticleModel {
  constructor(
    public readonly id: number,
    public readonly nom: string,
    public readonly prix: number
  ) {}

  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof ArticleModel)) return false;
    return this.id === autre.id;
  }

  avecNouveauPrix(nouveauPrix: number): ArticleModel {
    return new ArticleModel(this.id, this.nom, nouveauPrix);
  }
}

interface TelemetryEntry {
  timestamp: string;
  action: string;
  heapPrice: number;
  domPrice: number;
  address: string;
  angularDecision: string;
  isSuccess: boolean;
}

@Component({
  selector: 'app-angular-signals-memory',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 12 · Module 05</span>
          <span class="badge badge-purple">Angular 22 Signals</span>
          <span class="badge badge-danger">Object.is()</span>
          <span class="badge badge-success">Signals POS</span>
        </div>
        <h2>La Clé de Voûte : Angular Signals, Object.is() & Réactivité Mémoire</h2>
        <p class="module-desc">
          Dans Angular moderne, la réactivité chirurgicale repose entièrement sur la détection des changements d'adresses en mémoire vive. Découvrez pourquoi un signal ignore les mutations sur place et comment l'immutabilité réveille l'interface graphique.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🕹️ Démonstrateur Interactif Fiche Article (Signals POS)
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 5)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="signals-workbench">

          <!-- 1. Le Simulateur de Détection de Changement Object.is -->
          <div class="card-panel detection-theory-card">
            <div class="panel-head">
              <span class="badge badge-blue">Mécanique Interne du Framework</span>
              <h3>Comment Angular Détecte-t-il les Changements ?</h3>
              <p class="sub-text">Par défaut, un signal utilise la fonction standard <code>Object.is(valeurPrecedente, nouvelleValeur)</code> :</p>
            </div>

            <div class="theory-comparison-grid">
              <!-- Cas Rouge : Même Adresse -->
              <div class="comp-box bad-box">
                <div class="comp-tag danger">❌ Mutation en place (Même adresse)</div>
                <div class="math-expr font-mono">Object.is(0x10A, 0x10A) ➔ <strong class="text-danger">TRUE</strong></div>
                <p>Pour Angular, si <code>Object.is</code> renvoie <strong>true</strong>, cela signifie : <em>« Rien n'a bougé dans le signal, aucun rafraîchissement nécessaire »</em>.</p>
                <div class="ui-consequence danger">
                  💥 <strong>Résultat :</strong> L'objet a changé dans la RAM, mais le DOM reste figé sur l'ancienne valeur !
                </div>
              </div>

              <!-- Cas Vert : Nouvelle Adresse -->
              <div class="comp-box good-box">
                <div class="comp-tag success">✅ Nouvelle instance immuable (Nouvelle adresse)</div>
                <div class="math-expr font-mono">Object.is(0x10A, 0x20B) ➔ <strong class="text-success">FALSE</strong></div>
                <p>Si <code>Object.is</code> renvoie <strong>false</strong>, Angular conclut immédiatement : <em>« Une nouvelle donnée est disponible ! »</em>.</p>
                <div class="ui-consequence success">
                  🎉 <strong>Résultat :</strong> Le composant planifie une mise à jour chirurgicale immédiate du DOM !
                </div>
              </div>
            </div>
          </div>

          <!-- 2. La Fiche Article Interactive (Signals POS) -->
          <div class="card-panel pos-interactive-card">
            <div class="panel-head">
              <span class="badge badge-purple">Expérience en Direct</span>
              <h3>Fiche Article de Caisse (Signals POS)</h3>
              <p class="sub-text">Cliquez sur les deux boutons ci-dessous et observez le contraste entre l'anti-pattern et la bonne pratique.</p>
            </div>

            <div class="pos-stage-grid">
              <!-- Composant Angular Réel Simulée -->
              <div class="pos-device-box">
                <div class="device-header">
                  <span class="device-title">📦 COMPOSANT ANGULAR (ArticleComponent)</span>
                  <span class="device-ref font-mono">#{{ currentArticle().id }}</span>
                </div>

                <div class="article-sheet">
                  <div class="sheet-top">
                    <div>
                      <div class="sheet-label">Désignation Produit</div>
                      <div class="sheet-name">{{ currentArticle().nom }}</div>
                    </div>

                    <div class="sheet-price-box">
                      <div class="price-label">Prix Affiché (DOM)</div>
                      <!-- Ce prix provient DIRECTEMENT du signal currentArticle().prix -->
                      <div class="price-val font-mono" [class.frozen]="isDomFrozen()">
                        {{ currentArticle().prix }} €
                      </div>
                    </div>
                  </div>

                  <!-- Boutons d'action -->
                  <div class="action-buttons-grid">
                    <button class="btn-pos btn-red" (click)="remiseMuteDirect()">
                      <span class="btn-top">❌ Muter en place (70 €)</span>
                      <span class="btn-bot">Anti-pattern : Mute dans le Tas sans changer l'adresse (0x10A). L'écran se fige !</span>
                    </button>

                    <button class="btn-pos btn-green" (click)="remiseImmuable()">
                      <span class="btn-top">✅ Nouvelle instance (70 €)</span>
                      <span class="btn-bot">Bonne pratique : Crée new Article (0x20B). L'écran s'actualise instantanément !</span>
                    </button>
                  </div>

                  <div class="reset-row">
                    <button class="btn-ghost btn-xs" (click)="resetArticle()">
                      ↺ Réinitialiser à 100 € (new Article #42)
                    </button>
                  </div>
                </div>
              </div>

              <!-- Inspecteur de RAM & Télémétrie -->
              <div class="ram-telemetry-box">
                <div class="box-title">📡 Télémétrie en Direct du Signal</div>

                <div class="telemetry-status-card">
                  <div class="t-row">
                    <span class="t-k">Valeur dans le Tas (RAM) :</span>
                    <span class="t-v font-mono text-warning">{{ heapPrice() }} €</span>
                  </div>
                  <div class="t-row">
                    <span class="t-k">Valeur Affichée (Template DOM) :</span>
                    <span class="t-v font-mono" [class.text-danger]="isDomFrozen()" [class.text-success]="!isDomFrozen()">
                      {{ currentArticle().prix }} €
                    </span>
                  </div>
                  <div class="t-row">
                    <span class="t-k">Adresse Mémoire Active :</span>
                    <span class="t-v font-mono text-cyan">{{ currentAddress() }}</span>
                  </div>
                  <div class="t-row">
                    <span class="t-k">Diagnostic Réactif :</span>
                    <span class="t-v font-bold" [class.text-danger]="isDomFrozen()" [class.text-success]="!isDomFrozen()">
                      {{ diagnosticText() }}
                    </span>
                  </div>
                </div>

                <!-- Historique des Événements -->
                <div class="events-history">
                  <div class="history-title">Historique des notifications de signaux :</div>
                  <div class="history-list">
                    @for (log of telemetryLogs(); track log.timestamp) {
                      <div class="log-item" [class.fail]="!log.isSuccess" [class.ok]="log.isSuccess">
                        <span class="log-t font-mono">{{ log.timestamp }}</span>
                        <div class="log-details">
                          <strong>{{ log.action }}</strong>
                          <div class="log-sub">
                            RAM: {{ log.heapPrice }} € | DOM: {{ log.domPrice }} € | @{{ log.address }} | {{ log.angularDecision }}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. La Clé de Voûte Philosophique Finale -->
          <div class="card-panel philosophy-climax-card">
            <div class="climax-header">
              <span class="climax-icon">✨</span>
              <h3>La Révélation Philosophique de la Séance 12</h3>
            </div>

            <div class="climax-dual-grid">
              <div class="dual-box dual-equals">
                <div class="dual-title">1. L'Égalité Métier (equals)</div>
                <div class="dual-formula font-mono">
                  articleInitial.equals(articlePromo) ➔ <strong class="text-success">TRUE</strong>
                </div>
                <p>
                  Pour votre logique métier et votre entrepôt, <strong>c'est le même article physique</strong> : c'est toujours le produit #42 avec le même code-barres.
                </p>
                <div class="dual-role">👉 Sert à la logique du Domaine Métier (panier, recherche).</div>
              </div>

              <div class="dual-box dual-memory">
                <div class="dual-title">2. L'Égalité Mémoire (=== / Object.is)</div>
                <div class="dual-formula font-mono">
                  articleInitial === articlePromo ➔ <strong class="text-danger">FALSE</strong>
                </div>
                <p>
                  Pour l'ordinateur et le moteur d'Angular, <strong>ce sont deux adresses différentes</strong> (<code>0x10A !== 0x20B</code>).
                </p>
                <div class="dual-role">👉 C'est ce FALSE qui déclenche la réactivité et redessine le DOM !</div>
              </div>
            </div>

            <div class="climax-quote">
              « Vous écrivez <code>equals()</code> pour reconnaître vos objets au niveau métier,<br>
              et vous créez de nouvelles références pour réveiller les signaux Angular ! »
            </div>
          </div>

        </div>
      } @else {
        <!-- Onglet Exercices Labo 5 -->
        <div class="runner-wrapper">
          <app-code-runner [filterLabNumber]="5"></app-code-runner>
        </div>
      }
    </div>
  `,
  styles: [`
    .signals-workbench {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .panel-head {
      margin-bottom: 16px;
      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        margin-top: 4px;
      }
      .sub-text {
        font-size: 0.84rem;
        color: var(--text-muted);
      }
    }

    /* Théorie Object.is */
    .theory-comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .comp-box {
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.bad-box {
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.3);
      }

      &.good-box {
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      .comp-tag {
        font-size: 0.8rem;
        font-weight: 800;
        &.danger { color: #f87171; }
        &.success { color: #34d399; }
      }

      .math-expr {
        background: var(--bg-code);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
      }

      .ui-consequence {
        font-size: 0.8rem;
        margin-top: auto;
        padding: 6px 10px;
        border-radius: 6px;

        &.danger {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }

        &.success {
          background: rgba(16, 185, 129, 0.15);
          color: #a7f3d0;
        }
      }
    }

    /* POS Stage Grid */
    .pos-stage-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;

      @media (max-width: 1050px) {
        grid-template-columns: 1fr;
      }
    }

    .pos-device-box {
      background: #090d16;
      border: 2px solid #23304a;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);

      .device-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1e293b;
        padding-bottom: 10px;

        .device-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--bs-purple-light);
        }

        .device-ref {
          font-size: 0.75rem;
          background: rgba(121, 82, 179, 0.25);
          color: #c4b5fd;
          padding: 2px 8px;
          border-radius: 4px;
        }
      }
    }

    .article-sheet {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .sheet-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #111726;
        border-radius: 12px;
        padding: 16px 20px;
        border: 1px solid #1e293b;

        .sheet-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 700;
        }

        .sheet-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: #fff;
        }

        .sheet-price-box {
          text-align: right;

          .price-label {
            font-size: 0.7rem;
            color: #94a3b8;
            text-transform: uppercase;
            font-weight: 700;
          }

          .price-val {
            font-size: 2.2rem;
            font-weight: 900;
            color: #10b981;
            transition: all 0.3s;

            &.frozen {
              color: #f87171;
              animation: pulse-glow 1s infinite alternate;
            }
          }
        }
      }
    }

    .action-buttons-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .btn-pos {
      padding: 14px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
      transition: all 0.2s;

      .btn-top {
        font-size: 0.88rem;
        font-weight: 800;
      }

      .btn-bot {
        font-size: 0.72rem;
        line-height: 1.35;
        opacity: 0.85;
      }

      &.btn-red {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #fca5a5;

        &:hover {
          background: rgba(239, 68, 68, 0.22);
          transform: translateY(-1px);
        }
      }

      &.btn-green {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #a7f3d0;

        &:hover {
          background: rgba(16, 185, 129, 0.22);
          transform: translateY(-1px);
        }
      }
    }

    .reset-row {
      display: flex;
      justify-content: flex-end;
    }

    /* Télémétrie Box */
    .ram-telemetry-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      .box-title {
        font-size: 0.82rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--text-dim);
      }
    }

    .telemetry-status-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .t-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;

        .t-k { color: var(--text-muted); }
        .t-v { font-weight: 700; }
        .text-cyan { color: #38bdf8; }
      }
    }

    .events-history {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .history-title {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
      }

      .history-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: 220px;
        overflow-y: auto;
      }

      .log-item {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 0.74rem;
        display: flex;
        gap: 8px;

        &.fail {
          border-left: 3px solid #ef4444;
        }

        &.ok {
          border-left: 3px solid #10b981;
        }

        .log-t {
          color: var(--text-dim);
          min-width: 50px;
        }

        .log-details {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .log-sub {
            font-size: 0.68rem;
            color: var(--text-muted);
            font-family: var(--font-mono);
          }
        }
      }
    }

    /* Climax Philosophique */
    .philosophy-climax-card {
      background: linear-gradient(135deg, rgba(121, 82, 179, 0.15), rgba(59, 130, 246, 0.15));
      border: 1px solid rgba(121, 82, 179, 0.4);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: center;

      .climax-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        .climax-icon {
          font-size: 1.8rem;
        }

        h3 {
          font-size: 1.3rem;
          font-weight: 900;
          color: #fff;
        }
      }
    }

    .climax-dual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      text-align: left;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .dual-box {
      background: rgba(15, 20, 34, 0.8);
      border-radius: 10px;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 8px;

      .dual-title {
        font-size: 0.95rem;
        font-weight: 800;
        color: #fff;
      }

      .dual-formula {
        background: var(--bg-code);
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 0.78rem;
      }

      p {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.45;
        flex: 1;
      }

      .dual-role {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--bs-purple-light);
      }
    }

    .climax-quote {
      margin-top: 8px;
      font-size: 1rem;
      font-weight: 800;
      color: #38bdf8;
      line-height: 1.5;
      font-style: italic;
    }
  `]
})
export class AngularSignalsMemoryComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  // État du signal article POS
  readonly currentArticle = signal<ArticleModel>(new ArticleModel(42, 'Casque Bluetooth ANC', 100));

  readonly heapPrice = signal<number>(100);
  readonly currentAddress = signal<string>('0x10A');
  readonly isDomFrozen = signal<boolean>(false);
  readonly diagnosticText = signal<string>('Composant synchronisé à 100 €');

  readonly telemetryLogs = signal<TelemetryEntry[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      action: 'Initialisation du signal',
      heapPrice: 100,
      domPrice: 100,
      address: '0x10A',
      angularDecision: 'Rendu initial (100 €)',
      isSuccess: true
    }
  ]);

  remiseMuteDirect(): void {
    const a = this.currentArticle();

    // ⚠️ On force la modification directe de la propriété dans le Tas
    (a as any).prix = 70;
    this.heapPrice.set(70);

    // Tentative de passage au signal de la même instance
    this.currentArticle.set(a);

    // Analyse : Object.is(0x10A, 0x10A) === true ➔ Angular refuse de redessiner !
    this.isDomFrozen.set(true);
    this.diagnosticText.set('❌ Même adresse 0x10A : Angular ignore ➔ DOM figé à 100 € !');

    this.telemetryLogs.update(logs => [
      {
        timestamp: new Date().toLocaleTimeString(),
        action: 'Mutation en place (prix = 70)',
        heapPrice: 70,
        domPrice: 100,
        address: '0x10A',
        angularDecision: 'Object.is(0x10A, 0x10A) = true ➔ Pas d\'update !',
        isSuccess: false
      },
      ...logs
    ]);
  }

  remiseImmuable(): void {
    const a = this.currentArticle();

    // Nouvelle instance créée avec une nouvelle adresse 0x20B
    const nouvelArticle = a.avecNouveauPrix(70);
    this.heapPrice.set(70);
    this.currentAddress.set('0x20B');

    this.currentArticle.set(nouvelArticle);
    this.isDomFrozen.set(false);
    this.diagnosticText.set('✅ Nouvelle adresse 0x20B : Angular détecte ➔ DOM actualisé à 70 € !');

    this.telemetryLogs.update(logs => [
      {
        timestamp: new Date().toLocaleTimeString(),
        action: 'Nouvelle instance immuable',
        heapPrice: 70,
        domPrice: 70,
        address: '0x20B',
        angularDecision: 'Object.is(0x10A, 0x20B) = false ➔ DOM Redessiné !',
        isSuccess: true
      },
      ...logs
    ]);
  }

  resetArticle(): void {
    const fresh = new ArticleModel(42, 'Casque Bluetooth ANC', 100);
    this.currentAddress.set('0x10A');
    this.heapPrice.set(100);
    this.currentArticle.set(fresh);
    this.isDomFrozen.set(false);
    this.diagnosticText.set('Composant réinitialisé à 100 €');

    this.telemetryLogs.update(logs => [
      {
        timestamp: new Date().toLocaleTimeString(),
        action: 'Réinitialisation',
        heapPrice: 100,
        domPrice: 100,
        address: '0x10A',
        angularDecision: 'Reset effectué',
        isSuccess: true
      },
      ...logs
    ]);
  }
}
