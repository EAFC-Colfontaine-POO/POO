import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../core/services/navigation.service';
import { ExerciseService } from '../../core/services/exercise.service';

interface QuizScenario {
  id: string;
  title: string;
  code: string;
  illegalTarget: string;
  explanation: string;
  rfcRule: string;
}

@Component({
  selector: 'app-json-vs-xml',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <div class="module-header card-panel">
        <div class="module-tag">Module 02 · Formats de Données</div>
        <h2>L'Arène des Formats : JSON vs XML</h2>
        <p class="module-desc">
          Comparez la compacité et le typage natif de <strong>JSON</strong> face à la verbosité sémantique de <strong>XML</strong>,
          expérimentez la lecture avec <code>DOMParser</code> et déjouez les pièges du standard strict <strong>RFC 8259</strong>.
        </p>

        <div class="header-actions">
          <div class="section-mode-tabs">
            <button class="mode-tab-btn" [class.active]="activeTab() === 'compare'" (click)="activeTab.set('compare')">
              ⚖️ Comparateur &amp; Poids d'Octets
            </button>
            <button class="mode-tab-btn" [class.active]="activeTab() === 'domparser'" (click)="activeTab.set('domparser')">
              🧪 Laboratoire DOMParser (&lt;parsererror&gt;)
            </button>
            <button class="mode-tab-btn" [class.active]="activeTab() === 'rfc-quiz'" (click)="activeTab.set('rfc-quiz')">
              🎯 Mini-Jeu : Validateur JSON Strict (RFC 8259)
            </button>
          </div>

          <button class="btn-primary jump-lab-btn" (click)="jumpToLab()">
            💻 Aller aux Exercices du Labo 1 ➔
          </button>
        </div>
      </div>

      <!-- ONGLET 1 : COMPARATEUR CÔTE-À-CÔTE -->
      @if (activeTab() === 'compare') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">1</span>
              <div>
                <h3 class="zone-title">Catalogue d'Entrepôt : XML vs JSON</h3>
                <p class="zone-subtitle">Même jeu de données modélisé dans les deux formats avec mesure dynamique de la bande passante.</p>
              </div>
            </div>

            <div class="metrics-summary">
              <div class="metric-card xml-metric">
                <span class="m-label">Taille XML</span>
                <span class="m-val">{{ xmlSize() }} octets</span>
              </div>
              <div class="metric-card json-metric">
                <span class="m-label">Taille JSON</span>
                <span class="m-val">{{ jsonSize() }} octets</span>
              </div>
              <div class="metric-card savings-metric">
                <span class="m-label">Gain de Poids</span>
                <span class="m-val">-{{ byteSavingsPercent() }}%</span>
              </div>
            </div>
          </div>

          <div class="compare-grid">
            <!-- XML Col -->
            <div class="compare-col">
              <div class="col-header">
                <div class="col-title">
                  <span class="badge badge-purple">XML (eXtensible Markup Language)</span>
                  <span class="col-sub">Balisage lourd · Nombres non typés</span>
                </div>
              </div>
              <pre class="code-viewport"><code>{{ sampleXml }}</code></pre>
              <div class="col-footer-info">
                <strong>Désavantages XML :</strong>
                <ul>
                  <li>Balises fermantes obligatoires et répétées (<code>&lt;/article&gt;</code>, <code>&lt;/prixHT&gt;</code>).</li>
                  <li>Tout est lu comme du texte brut : <code>"129.99"</code> n'est pas un nombre.</li>
                  <li>Pas de concept natif de tableau : balise parente englobante obligatoire.</li>
                </ul>
              </div>
            </div>

            <!-- JSON Col -->
            <div class="compare-col">
              <div class="col-header">
                <div class="col-title">
                  <span class="badge badge-ts">JSON (JavaScript Object Notation)</span>
                  <span class="col-sub">Concis · Typage direct · Tableaux natifs</span>
                </div>
              </div>
              <pre class="code-viewport"><code>{{ sampleJson }}</code></pre>
              <div class="col-footer-info json-info">
                <strong>Avantages majeurs JSON :</strong>
                <ul>
                  <li>Économie d'environ 45% sur le trafic réseau.</li>
                  <li><code>129.99</code> est nativement typé en <code>number</code> (pas de parseFloat manuel).</li>
                  <li>Tableaux <code>[ ... ]</code> ordonnés natifs et parsing C++ ultra-rapide.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 2 : LABORATOIRE DOMPARSER -->
      @if (activeTab() === 'domparser') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">2</span>
              <div>
                <h3 class="zone-title">Laboratoire DOMParser &amp; Piège du &lt;parsererror&gt;</h3>
                <p class="zone-subtitle">Démontrer qu'en XML, le navigateur ne throw pas d'exception par défaut mais injecte un nœud d'erreur.</p>
              </div>
            </div>

            <div class="sample-loader-buttons">
              <button class="btn-secondary" (click)="loadValidXml()">Charger XML Valide</button>
              <button class="btn-secondary" (click)="loadBrokenXml()">Charger XML Corrompu</button>
              <button class="btn-secondary" (click)="loadCdataXml()">Charger XML avec CDATA</button>
            </div>
          </div>

          <div class="domparser-layout">
            <!-- Éditeur XML -->
            <div class="editor-subpanel">
              <div class="subpanel-header">
                <span>Flux XML en entrée (Éditable) :</span>
                <button class="btn-primary parse-action-btn" [class.just-parsed]="justParsed()" (click)="parseXmlInput()">
                  ⚙️ new DOMParser().parseFromString(...)
                  @if (justParsed()) {
                    <span class="btn-flash-tag">✔ Analysé !</span>
                  }
                </button>
              </div>
              <textarea 
                class="xml-textarea" 
                [(ngModel)]="xmlInputText" 
                (ngModelChange)="onXmlEdited()"
                rows="11" 
                placeholder="Collez ou modifiez du code XML ici..."
              ></textarea>
              <div class="editor-hint-bar">
                <span>💡 <em>Astuce :</em> Vous pouvez éditer le XML ci-dessus et cliquer sur le bouton pour analyser votre flux personnalisé.</span>
                @if (lastParsedTime()) {
                  <span class="timestamp-tag">Dernière analyse : {{ lastParsedTime() }}</span>
                }
              </div>
            </div>

            <!-- Inspecteur DOM & Détecteur parsererror -->
            <div class="inspector-subpanel">
              <div class="subpanel-header">
                <span>Résultat de l'analyse W3C :</span>
                <span class="status-indicator" [class.valid]="isXmlValid()" [class.invalid]="!isXmlValid()">
                  {{ isXmlValid() ? '✔ Document XML Valide' : '✖ Erreur Syntaxe Détectée' }}
                </span>
              </div>

              @if (!isXmlValid()) {
                <div class="parsererror-banner">
                  <div class="err-header">
                    <span class="err-icon">🚨</span>
                    <strong>Nœud &lt;parsererror&gt; intercepté par querySelector() :</strong>
                  </div>
                  <pre class="err-content"><code>{{ parserErrorMessage() }}</code></pre>
                  <p class="err-hint">
                    💡 <strong>Leçon d'architecture :</strong> Si vous oubliez d'écrire <code>doc.querySelector('parsererror')</code>, votre code croira que le document est valide et échouera plus loin avec un <code>null</code> silencieux !
                  </p>
                </div>
              } @else {
                <div class="dom-success-box">
                  <div class="dom-query-bar">
                    <span class="query-prompt">doc.querySelector('article') :</span>
                    <span class="badge badge-success">Trouvé</span>
                  </div>

                  <div class="extracted-details">
                    <div class="detail-row">
                      <span class="row-label">Attribut 'id' :</span>
                      <code>{{ extractedId() || '(aucun attribut id)' }}</code>
                    </div>
                    <div class="detail-row">
                      <span class="row-label">Attribut 'statut' :</span>
                      <code>{{ extractedStatut() || '(aucun statut)' }}</code>
                    </div>
                    <div class="detail-row">
                      <span class="row-label">Élément &lt;designation&gt; :</span>
                      <code>{{ extractedDesignation() || '(non trouvé)' }}</code>
                    </div>
                    <div class="detail-row">
                      <span class="row-label">Élément &lt;prixHT&gt; converti :</span>
                      <code>{{ extractedPrixHT() }} € (type number via parseFloat)</code>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- ONGLET 3 : MINI-JEU VALIDATEUR RFC 8259 -->
      @if (activeTab() === 'rfc-quiz') {
        <div class="card-panel">
          <div class="zone-header">
            <div class="zone-title-group">
              <span class="step-num">3</span>
              <div>
                <h3 class="zone-title">Mini-Jeu : Le Chasseur d'Illégalités (RFC 8259)</h3>
                <p class="zone-subtitle">Identifiez la faute de syntaxe formelle qui fait échouer JSON.parse() avec un SyntaxError.</p>
              </div>
            </div>

            <div class="score-display">
              <span class="badge badge-ts">Scénario {{ currentQuizIndex() + 1 }} / {{ quizScenarios.length }}</span>
            </div>
          </div>

          <div class="quiz-container">
            <div class="quiz-nav-row">
              @for (sc of quizScenarios; track sc.id; let idx = $index) {
                <button 
                  class="quiz-tab-btn" 
                  [class.active]="currentQuizIndex() === idx"
                  (click)="currentQuizIndex.set(idx); quizAnswerRevealed.set(false)"
                >
                  Cas {{ idx + 1 }} : {{ sc.title }}
                </button>
              }
            </div>

            <div class="quiz-card">
              <div class="quiz-code-box">
                <div class="code-title">Flux JSON soumis à JSON.parse() :</div>
                <pre><code>{{ activeScenario().code }}</code></pre>
              </div>

              <div class="quiz-interaction">
                @if (!quizAnswerRevealed()) {
                  <div class="prompt-section">
                    <h4>Quel élément est formellement interdit ici selon la RFC 8259 ?</h4>
                    <button class="btn-primary" (click)="quizAnswerRevealed.set(true)">
                      🔍 Inspecter &amp; Démasquer l'Erreur
                    </button>
                  </div>
                } @else {
                  <div class="answer-section">
                    <div class="bad-target-banner">
                      <span class="cross-badge">❌ Élément coupable :</span>
                      <code>{{ activeScenario().illegalTarget }}</code>
                    </div>

                    <div class="crash-simulation">
                      <span class="crash-tag">Sortie du moteur V8 :</span>
                      <pre class="crash-log"><code>SyntaxError: Unexpected token '{{ activeScenario().illegalTarget }}', ... is not valid JSON</code></pre>
                    </div>

                    <div class="explanation-box">
                      <strong>Règle RFC 8259 violée :</strong>
                      <p>{{ activeScenario().rfcRule }}</p>
                      <div class="extra-exp">{{ activeScenario().explanation }}</div>
                    </div>

                    <button class="btn-secondary" (click)="nextQuiz()">
                      Passer au cas suivant ➔
                    </button>
                  </div>
                }
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

    /* Metrics Summary */
    .metrics-summary {
      display: flex;
      gap: 10px;
    }

    .metric-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 6px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .m-label {
        font-size: 0.68rem;
        color: var(--text-muted);
        text-transform: uppercase;
        font-weight: 600;
      }
      .m-val {
        font-size: 0.95rem;
        font-weight: 800;
        font-family: var(--font-mono);
      }

      &.xml-metric .m-val { color: #c084fc; }
      &.json-metric .m-val { color: #60a5fa; }
      &.savings-metric {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.1);
        .m-val { color: #34d399; }
      }
    }

    /* Compare Grid */
    .compare-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .compare-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .col-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .col-title {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .col-sub {
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .code-viewport {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      font-size: 0.76rem;
      font-family: var(--font-mono);
      color: #e2e8f0;
      overflow-x: auto;
      max-height: 290px;
      line-height: 1.4;
    }

    .col-footer-info {
      font-size: 0.78rem;
      color: var(--text-muted);
      background: var(--bg-card);
      padding: 10px 14px;
      border-radius: 6px;

      ul {
        margin-top: 6px;
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      &.json-info {
        border-left: 3px solid #3b82f6;
      }
    }

    /* DOMParser layout */
    .sample-loader-buttons {
      display: flex;
      gap: 8px;
    }

    .domparser-layout {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .editor-subpanel, .inspector-subpanel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .subpanel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .parse-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      &.just-parsed {
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

    .xml-textarea {
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

    .status-indicator {
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 700;

      &.valid {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
      &.invalid {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }
    }

    .parsererror-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .err-header {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #f87171;
        font-size: 0.84rem;
      }

      .err-content {
        background: var(--bg-code);
        border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 8px;
        border-radius: 4px;
        font-size: 0.74rem;
        color: #fca5a5;
        white-space: pre-wrap;
      }

      .err-hint {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    .dom-success-box {
      background: var(--bg-card);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .dom-query-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 0.76rem;
    }

    .extracted-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.8rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-subtle);
      padding: 6px 10px;
      border-radius: 4px;

      code {
        color: #34d399;
      }
    }

    /* Quiz RFC 8259 */
    .quiz-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .quiz-nav-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .quiz-tab-btn {
      padding: 6px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);

      &.active {
        background: rgba(49, 120, 198, 0.2);
        border-color: #3b82f6;
        color: #ffffff;
      }
    }

    .quiz-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }
    }

    .quiz-code-box {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .code-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
      }

      pre {
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        padding: 12px;
        border-radius: 6px;
        font-size: 0.82rem;
        font-family: var(--font-mono);
        color: #f1f5f9;
        line-height: 1.4;
      }
    }

    .quiz-interaction {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
    }

    .prompt-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 12px;
      padding: 20px;

      h4 {
        font-size: 0.95rem;
        color: var(--text-main);
      }
    }

    .answer-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .bad-target-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      color: #fca5a5;

      code {
        color: #ffffff;
        background: #991b1b;
        padding: 2px 6px;
        border-radius: 4px;
      }
    }

    .crash-simulation {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .crash-tag {
        font-size: 0.7rem;
        color: #ef4444;
        font-weight: 700;
      }

      .crash-log {
        background: var(--bg-code);
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 8px;
        border-radius: 4px;
        font-size: 0.74rem;
        font-family: var(--font-mono);
        color: #f87171;
      }
    }

    .explanation-box {
      background: var(--bg-card);
      border-left: 3px solid #3b82f6;
      padding: 10px 12px;
      border-radius: 0 6px 6px 0;
      font-size: 0.82rem;

      p {
        margin: 4px 0;
        color: #93c5fd;
      }
      .extra-exp {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }
  `]
})
export class JsonVsXmlComponent {
  private readonly nav = inject(NavigationService);
  private readonly exercises = inject(ExerciseService);

  readonly activeTab = signal<'compare' | 'domparser' | 'rfc-quiz'>('compare');

  readonly sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<catalogue depot="Bruxelles-Nord" date="2026-10-28">
  <article id="ART-101" statut="disponible">
    <designation>Clavier Mécanique</designation>
    <prixHT devise="EUR">129.99</prixHT>
    <tauxTVA>21</tauxTVA>
    <categories>
      <categorie>Informatique</categorie>
      <categorie>Périphériques</categorie>
    </categories>
  </article>
</catalogue>`;

  readonly sampleJson = `{
  "depot": "Bruxelles-Nord",
  "date": "2026-10-28T00:00:00.000Z",
  "articles": [
    {
      "id": "ART-101",
      "statut": "disponible",
      "designation": "Clavier Mécanique",
      "prixHT": 129.99,
      "tauxTVA": 21,
      "categories": ["Informatique", "Périphériques"]
    }
  ]
}`;

  readonly xmlSize = computed<number>(() => new TextEncoder().encode(this.sampleXml).length);
  readonly jsonSize = computed<number>(() => new TextEncoder().encode(this.sampleJson).length);
  readonly byteSavingsPercent = computed<number>(() => {
    const x = this.xmlSize();
    const j = this.jsonSize();
    return Math.round(((x - j) / x) * 100);
  });

  // DOMParser Lab
  xmlInputText = `<?xml version="1.0" encoding="UTF-8"?>
<catalogue>
  <article id="ART-101" statut="en_stock">
    <designation>Clavier Mécanique</designation>
    <prixHT>129.99</prixHT>
  </article>
</catalogue>`;

  readonly isXmlValid = signal<boolean>(true);
  readonly parserErrorMessage = signal<string>('');
  readonly extractedId = signal<string>('ART-101');
  readonly extractedStatut = signal<string>('en_stock');
  readonly extractedDesignation = signal<string>('Clavier Mécanique');
  readonly extractedPrixHT = signal<number>(129.99);
  readonly justParsed = signal<boolean>(false);
  readonly lastParsedTime = signal<string>('');

  // Quiz RFC
  readonly currentQuizIndex = signal<number>(0);
  readonly quizAnswerRevealed = signal<boolean>(false);

  readonly quizScenarios: QuizScenario[] = [
    {
      id: 'single-quotes',
      title: 'Apostrophes au lieu de guillemets doubles',
      code: `{\n  'nom': 'Souris Ergonomique',\n  'prix': 39.90\n}`,
      illegalTarget: "' (Apostrophe simple)",
      rfcRule: 'Section 7 : Strings : A string begins and ends with quotation marks (ASCII 0x22 / ").',
      explanation: 'En JSON strict, les apostrophes simples \' ne sont JAMAIS autorisées, ni pour les chaînes de texte ni pour les clés d\'objets.'
    },
    {
      id: 'trailing-comma',
      title: 'Virgule traînante (Trailing Comma)',
      code: `{\n  "id": 42,\n  "titre": "Guide POO",\n}`,
      illegalTarget: ", (Virgule après la dernière propriété)",
      rfcRule: 'Section 4 : Objects : An object member is separated by a comma. No trailing comma allowed.',
      explanation: 'Contrairement à TypeScript moderne qui tolère ou encourage la trailing comma, JSON strict crashe immédiatement sur {"a": 1,}.'
    },
    {
      id: 'comments',
      title: 'Commentaires dans le corps du fichier',
      code: `{\n  "statut": "actif" // Ce champ est utilisé par l'authentification\n}`,
      illegalTarget: "// (Commentaire inline)",
      rfcRule: 'Section 2 : JSON Grammar : JSON does not include comments in its syntax.',
      explanation: 'Douglas Crockford a délibérément exclu les commentaires pour empêcher l\'ajout de directives de parsing incompatibles entre bibliothèques.'
    },
    {
      id: 'undefined-val',
      title: 'Valeur undefined explicite',
      code: `{\n  "utilisateur": "Alice",\n  "session": undefined\n}`,
      illegalTarget: "undefined",
      rfcRule: 'Section 3 : Values : JSON values can only be object, array, number, string, false, null, true.',
      explanation: 'undefined n\'est pas un type JSON. Dans JSON.stringify, une propriété valant undefined est purement effacée.'
    },
    {
      id: 'nan-val',
      title: 'Valeur NaN ou Infinity',
      code: `{\n  "score": NaN,\n  "limite": Infinity\n}`,
      illegalTarget: "NaN / Infinity",
      rfcRule: 'Section 6 : Numbers : Numeric values must be finite. NaN and Infinity are prohibited.',
      explanation: 'Les constantes IEEE NaN et Infinity ne sont pas autorisées. JSON.stringify les convertit silencieusement en null.'
    }
  ];

  readonly activeScenario = computed<QuizScenario>(() => {
    return this.quizScenarios[this.currentQuizIndex()];
  });

  loadValidXml(): void {
    this.xmlInputText = `<?xml version="1.0" encoding="UTF-8"?>
<catalogue>
  <article id="ART-101" statut="en_stock">
    <designation>Clavier Mécanique</designation>
    <prixHT>129.99</prixHT>
  </article>
</catalogue>`;
    this.parseXmlInput();
  }

  loadBrokenXml(): void {
    this.xmlInputText = `<?xml version="1.0" encoding="UTF-8"?>
<catalogue>
  <article id="ART-101" statut="en_stock">
    <designation>Clavier Mécanique (Oubli balise fermante)
    <prixHT>129.99</prixHT>
  </article>
</catalogue>`;
    this.parseXmlInput();
  }

  loadCdataXml(): void {
    this.xmlInputText = `<?xml version="1.0" encoding="UTF-8"?>
<catalogue>
  <article id="ART-77" statut="promo">
    <designation><![CDATA[ Écran 4K & HDR 1000 <Ultra> ]]></designation>
    <prixHT>499.00</prixHT>
  </article>
</catalogue>`;
    this.parseXmlInput();
  }

  onXmlEdited(): void {
    this.parseXmlInput();
  }

  parseXmlInput(): void {
    if (typeof window === 'undefined') return;

    this.justParsed.set(true);
    this.lastParsedTime.set(new Date().toLocaleTimeString());
    setTimeout(() => this.justParsed.set(false), 1200);

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.xmlInputText, 'application/xml');
      const parseError = doc.querySelector('parsererror');

      if (parseError) {
        this.isXmlValid.set(false);
        this.parserErrorMessage.set(parseError.textContent || 'Erreur inconnue de syntaxe XML');
      } else {
        this.isXmlValid.set(true);
        this.parserErrorMessage.set('');

        const art = doc.querySelector('article');
        this.extractedId.set(art?.getAttribute('id') || '');
        this.extractedStatut.set(art?.getAttribute('statut') || '');
        this.extractedDesignation.set(doc.querySelector('designation')?.textContent?.trim() || '');
        this.extractedPrixHT.set(parseFloat(doc.querySelector('prixHT')?.textContent || '0'));
      }
    } catch (err: any) {
      this.isXmlValid.set(false);
      this.parserErrorMessage.set(err.message);
    }
  }

  nextQuiz(): void {
    const nextIdx = (this.currentQuizIndex() + 1) % this.quizScenarios.length;
    this.currentQuizIndex.set(nextIdx);
    this.quizAnswerRevealed.set(false);
  }

  jumpToLab(): void {
    this.exercises.setFilterLab(1);
    this.nav.setTab('workshops-lab');
  }
}
