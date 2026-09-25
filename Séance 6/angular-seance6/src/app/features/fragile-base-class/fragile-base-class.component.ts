import { Component, signal, computed } from '@angular/core';
import { DominoTarget, YoYoLevel } from '../../core/models/app.models';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-fragile-base-class',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Module 6 · Pièges & Limites</span>
          <span class="badge badge-warning">Architecture Fragile</span>
        </div>
        <h2>Discernement & Pièges : Classe Fragile & Effet Yo-Yo</h2>
        <p class="module-desc">
          L'héritage est le couplage le plus rigide du génie logiciel. Si la classe mère vacille, tout l'édifice s'effondre. Découvrez comment une simple retouche dans une classe de base peut contaminer des dizaines de descendants.
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
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Simulateur Classe Fragile & Yo-Yo</span>
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
          <span>Atelier Pratique (Labo 4)</span>
        </button>
      </div>

      @if (activeView() === 'theory') {
        <!-- PARTIE 1 : Simulateur de la Classe de Base Fragile (Effet Domino) -->
        <div class="section-block">
          <div class="block-title">
            <span class="badge badge-html">SIMULATEUR 1</span>
            <h3>L'Effet Domino de la Classe de Base Fragile (Fragile Base Class)</h3>
          </div>

          <div class="card-panel domino-panel">
            <div class="domino-header">
              <div class="header-text">
                <span class="domino-badge">💥 CHANGER UNE LIGNE DANS LA CLASSE MÈRE MEDIA</span>
                <h4>Modifiez le format retourné par <code>Media.getDescription()</code> :</h4>
              </div>

              <!-- Options de mutation -->
              <div class="format-options">
                <button 
                  class="pill-btn" 
                  [class.active]="baseFormat() === 'standard'"
                  (click)="baseFormat.set('standard')"
                >
                  1. Format Initial : <code>"titre (annee)"</code>
                </button>
                <button 
                  class="pill-btn danger" 
                  [class.active]="baseFormat() === 'iso'"
                  (click)="baseFormat.set('iso')"
                >
                  2. Mutation Inattendue : <code>"[ANNEE] TITRE_MAJ"</code>
                </button>
                <button 
                  class="pill-btn danger" 
                  [class.active]="baseFormat() === 'renamed'"
                  (click)="baseFormat.set('renamed')"
                >
                  3. Rupture de Contrat : Renommage en <code>getSummary()</code>
                </button>
              </div>
            </div>

            <!-- Code Mère Actif -->
            <div class="domino-grid">
              <div class="mother-code-card card-panel" [class.broken]="baseFormat() !== 'standard'">
                <div class="card-tag">🏛️ CLASSE MÈRE : Media.ts (Modifiée ici uniquement)</div>
                <pre class="code-box"><code><span class="kw">class</span> <span class="cls">Media</span> &#123;
@if (baseFormat() === 'standard') {
  <span class="highlight-ok"><span class="fn">getDescription</span>(): <span class="typ">string</span> &#123;
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;this.titre&#125; (&#36;&#123;this.annee&#125;)&#96;</span>;
  &#125;</span>
} @else if (baseFormat() === 'iso') {
  <span class="highlight-warn"><span class="fn">getDescription</span>(): <span class="typ">string</span> &#123;
    <span class="comment">// 🚨 Changement de formatage arbitraire</span>
    <span class="kw">return</span> <span class="str">&#96;[&#36;&#123;this.annee&#125;] &#36;&#123;this.titre.toUpperCase()&#125;&#96;</span>;
  &#125;</span>
} @else {
  <span class="highlight-err"><span class="fn">getSummary</span>(): <span class="typ">string</span> &#123; <span class="comment">// 💥 RENOMMÉ !</span>
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;this.titre&#125;&#96;</span>;
  &#125;</span>
}
&#125;</code></pre>
              </div>

              <!-- Effet Domino sur les 3 classes filles -->
              <div class="domino-targets-list">
                <div class="targets-header">
                  <span>RÉPERCUSSIONS EN CASCADE SUR LES CLASSES FILLES (NON MODIFIÉES) :</span>
                </div>

                @for (t of dominoTargets(); track t.name) {
                  <div class="domino-card card-panel" [class.broken]="t.isBroken" [class.impacted]="baseFormat() === 'iso'">
                    <div class="domino-top">
                      <div class="target-name">
                        <span class="domino-icon">{{ t.isBroken ? '💥' : (baseFormat() === 'iso' ? '⚡' : '✔') }}</span>
                        <strong>class {{ t.name }} extends Media</strong>
                      </div>
                      <span class="status-pill" [class.red]="t.isBroken" [class.amber]="baseFormat() === 'iso'" [class.green]="baseFormat() === 'standard'">
                        {{ t.isBroken ? 'CRASH / COMPILATION BRISÉE' : (baseFormat() === 'iso' ? 'FORMAT ALTÉRÉ' : 'STABLE') }}
                      </span>
                    </div>

                    <div class="domino-body">
                      <div class="output-preview">
                        <span class="out-label">Sortie retournée par {{ t.name.toLowerCase() }}.getDescription() :</span>
                        <code [class.text-red]="t.isBroken" [class.text-amber]="baseFormat() === 'iso'">
                          {{ t.derivedOutput }}
                        </code>
                      </div>
                      <div class="impact-text">{{ t.impactDescription }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="domino-summary">
              <strong>Leçon d'Architecture :</strong> Le couplage par héritage est bidirectionnel : la classe fille dépend intimement de chaque décision prise dans la classe mère. Modifier la classe mère peut casser silencieusement 20 classes filles réparties sur 10 modules distincts.
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : Visualiseur de l'Effet Yo-Yo -->
        <div class="section-block">
          <div class="block-title">
            <span class="badge badge-purple">SIMULATEUR 2</span>
            <h3>Le Piège du Mal de Crâne : L'Effet Yo-Yo (6 Niveaux)</h3>
          </div>

          <div class="card-panel yoyo-card">
            <div class="yoyo-header">
              <div class="yoyo-title-group">
                <span class="yoyo-tag">ARBRE GÉNÉALOGIQUE ABUSIF (ANTI-PATTERN)</span>
                <h4>Navigation chaotique lors de l'exécution d'une méthode</h4>
              </div>

              <button 
                class="btn-primary" 
                (click)="triggerYoYoAnimation()"
              >
                🎮 Simuler l'enquête du développeur (Effet Yo-Yo)
              </button>
            </div>

            <p class="yoyo-desc">
              Lorsqu'une méthode est morcelée à travers 5 appels de <code>super.methode()</code> sur 6 fichiers distincts, le cerveau humain décroche. C'est l'Effet Yo-Yo : le regard monte et descend sans cesse dans l'arbre d'héritage.
            </p>

            <!-- Arbre Vertical à 6 Paliers -->
            <div class="yoyo-tree">
              @for (lvl of yoyoLevels; track lvl.level; let i = $index) {
                <div class="tree-level-item" [class.active]="activeYoYoIndex() === i">
                  <div class="level-indicator">
                    <span class="lvl-num">Niveau {{ lvl.level }}</span>
                    <span class="file-name">{{ lvl.fileName }}</span>
                  </div>

                  <div class="level-card" [class.highlight]="activeYoYoIndex() === i">
                    <div class="level-header">
                      <span class="class-title">{{ lvl.className }}</span>
                      <span class="role-badge">{{ lvl.role }}</span>
                    </div>
                    <code class="level-code">{{ lvl.codeSnippet }}</code>
                  </div>
                </div>

                @if (i < yoyoLevels.length - 1) {
                  <div class="tree-connector">
                    <span class="connector-arrow">▲ extends</span>
                  </div>
                }
              }
            </div>

            <!-- Règle d'or de l'aplatissement -->
            <div class="golden-rule-box">
              <div class="rule-icon">📐</div>
              <div class="rule-content">
                <strong>RÈGLE D'OR DE L'HÉRITAGE EN PRODUCTION :</strong><br>
                <em>« Ne dépassez jamais 2 à 3 niveaux d'héritage. Au-delà, l'héritage devient un poison de maintenance. Préférez systématiquement la composition et l'injection de dépendances. »</em>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="4"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .section-block {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .block-title {
      display: flex;
      align-items: center;
      gap: 10px;

      h3 {
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    /* Domino */
    .domino-panel {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .domino-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;

      .domino-badge {
        font-size: 0.72rem;
        font-weight: 800;
        color: #f87171;
        letter-spacing: 0.08em;
      }

      h4 {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .format-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pill-btn {
      padding: 6px 12px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--bs-purple);
        color: #ffffff;
        border-color: var(--bs-purple-light);
      }

      &.danger.active {
        background: #ef4444;
        border-color: #f87171;
      }
    }

    .domino-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 18px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .mother-code-card {
      padding: 16px;
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.broken {
        border-color: rgba(239, 68, 68, 0.4);
      }

      .card-tag {
        font-size: 0.72rem;
        font-weight: 800;
        color: var(--text-dim);
      }
    }

    .code-box {
      background: var(--bg-code);
      padding: 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      line-height: 1.5;

      .highlight-ok { color: #86efac; }
      .highlight-warn { color: #fde047; }
      .highlight-err { color: #fca5a5; }
      .kw { color: #c678dd; }
      .cls { color: #e5c07b; }
      .fn { color: #61afef; }
      .str { color: #98c379; }
      .typ { color: #e5c07b; }
      .comment { color: #5c6370; font-style: italic; }
    }

    .domino-targets-list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .targets-header {
        font-size: 0.72rem;
        font-weight: 800;
        color: var(--text-dim);
      }
    }

    .domino-card {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border: 1px solid var(--border-subtle);
      transition: all 0.25s;

      &.broken {
        border-color: rgba(239, 68, 68, 0.5);
        background: rgba(239, 68, 68, 0.05);
      }

      &.impacted {
        border-color: rgba(245, 158, 11, 0.5);
      }
    }

    .domino-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .target-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        color: var(--text-main);
      }

      .status-pill {
        font-size: 0.68rem;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 4px;

        &.green { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        &.amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        &.red { background: rgba(239, 68, 68, 0.2); color: #f87171; }
      }
    }

    .domino-body {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .output-preview {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 0.76rem;

        .out-label { color: var(--text-dim); }

        code {
          background: var(--bg-code);
          padding: 4px 8px;
          border-radius: 4px;
          color: #c4b5fd;
          font-family: var(--font-mono);

          &.text-amber { color: #fbbf24; }
          &.text-red { color: #f87171; }
        }
      }

      .impact-text {
        font-size: 0.76rem;
        color: var(--text-muted);
      }
    }

    .domino-summary {
      background: rgba(239, 68, 68, 0.08);
      border-left: 3px solid #ef4444;
      padding: 12px;
      border-radius: 4px;
      font-size: 0.82rem;
      color: var(--text-main);
      line-height: 1.45;
    }

    /* Yo-Yo */
    .yoyo-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .yoyo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;

      .yoyo-tag {
        font-size: 0.72rem;
        font-weight: 800;
        color: #c4b5fd;
        letter-spacing: 0.08em;
      }

      h4 {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    .yoyo-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .yoyo-tree {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 10px 0;
    }

    .tree-level-item {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 14px;
      align-items: center;
      transition: all 0.3s;

      &.active {
        .level-card {
          border-color: #0ea5e9;
          background: rgba(14, 165, 233, 0.12);
          box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
          transform: scale(1.01);
        }
      }
    }

    .level-indicator {
      display: flex;
      flex-direction: column;
      text-align: right;

      .lvl-num {
        font-size: 0.76rem;
        font-weight: 800;
        color: var(--text-muted);
      }

      .file-name {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--text-dim);
      }
    }

    .level-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

      .level-header {
        display: flex;
        align-items: center;
        gap: 8px;

        .class-title {
          font-weight: 700;
          font-size: 0.84rem;
          color: var(--text-main);
        }

        .role-badge {
          font-size: 0.68rem;
          color: var(--text-dim);
        }
      }

      .level-code {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: #38bdf8;
      }
    }

    .tree-connector {
      padding-left: 174px;
      color: var(--text-dim);
      font-size: 0.72rem;
      font-family: var(--font-mono);
    }

    .golden-rule-box {
      background: linear-gradient(135deg, rgba(121, 82, 179, 0.15), rgba(14, 165, 233, 0.15));
      border: 1px solid rgba(121, 82, 179, 0.4);
      padding: 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 14px;

      .rule-icon { font-size: 2rem; }

      .rule-content {
        font-size: 0.88rem;
        color: var(--text-main);
        line-height: 1.5;

        strong { color: #c4b5fd; }
      }
    }
  `]
})
export class FragileBaseClassComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly baseFormat = signal<'standard' | 'iso' | 'renamed'>('standard');
  readonly activeYoYoIndex = signal<number>(-1);

  readonly dominoTargets = computed<DominoTarget[]>(() => {
    switch (this.baseFormat()) {
      case 'standard':
        return [
          {
            name: 'Livre',
            type: 'Livre',
            impactDescription: 'Fonctionne selon les spécifications initiales.',
            derivedOutput: '« Dune » (1965) — 412 pages',
            isBroken: false
          },
          {
            name: 'Film',
            type: 'Film',
            impactDescription: 'Fonctionne selon les spécifications initiales.',
            derivedOutput: '« Inception » (2010) — 148 min',
            isBroken: false
          },
          {
            name: 'AudioBook',
            type: 'AudioBook',
            impactDescription: 'Fonctionne selon les spécifications initiales.',
            derivedOutput: '« 1984 » (1949) — lu par R. Smith',
            isBroken: false
          }
        ];
      case 'iso':
        return [
          {
            name: 'Livre',
            type: 'Livre',
            impactDescription: 'Formatage altéré : crochets et majuscules imposés.',
            derivedOutput: '[1965] DUNE — 412 pages',
            isBroken: false
          },
          {
            name: 'Film',
            type: 'Film',
            impactDescription: 'Incohérence graphique dans l\'interface utilisateur.',
            derivedOutput: '[2010] INCEPTION — 148 min',
            isBroken: false
          },
          {
            name: 'AudioBook',
            type: 'AudioBook',
            impactDescription: 'Impacté sans qu\'aucun développeur n\'ait édité AudioBook.ts !',
            derivedOutput: '[1949] 1984 — lu par R. Smith',
            isBroken: false
          }
        ];
      case 'renamed':
        return [
          {
            name: 'Livre',
            type: 'Livre',
            impactDescription: 'TypeError: super.getDescription is not a function !',
            derivedOutput: 'TypeError: super.getDescription is not a function',
            isBroken: true
          },
          {
            name: 'Film',
            type: 'Film',
            impactDescription: 'TypeError: super.getDescription is not a function !',
            derivedOutput: 'TypeError: super.getDescription is not a function',
            isBroken: true
          },
          {
            name: 'AudioBook',
            type: 'AudioBook',
            impactDescription: 'Crash au chargement des cartes de la médiathèque.',
            derivedOutput: 'TypeError: super.getDescription is not a function',
            isBroken: true
          }
        ];
    }
  });

  readonly yoyoLevels: YoYoLevel[] = [
    {
      level: 1,
      className: 'EntiteBase',
      fileName: 'entite.model.ts',
      methodName: 'formater()',
      codeSnippet: 'return `[#${this.id}]`;',
      role: 'Racine système'
    },
    {
      level: 2,
      className: 'ObjetMetier',
      fileName: 'objet-metier.model.ts',
      methodName: 'formater()',
      codeSnippet: 'return `${super.formater()} <METIER>`;',
      role: 'Couche abstraction'
    },
    {
      level: 3,
      className: 'Ressource',
      fileName: 'ressource.model.ts',
      methodName: 'formater()',
      codeSnippet: 'return `${super.formater()} (ver: ${this.v})`;',
      role: 'Couche technique'
    },
    {
      level: 4,
      className: 'Media',
      fileName: 'media.model.ts',
      methodName: 'formater()',
      codeSnippet: 'return `${super.formater()} ${this.titre}`;',
      role: 'Domaine médiathèque'
    },
    {
      level: 5,
      className: 'DocumentPapier',
      fileName: 'doc-papier.model.ts',
      methodName: 'formater()',
      codeSnippet: 'return `${super.formater()} [PAPIER]`;',
      role: 'Support matériel'
    },
    {
      level: 6,
      className: 'Livre',
      fileName: 'livre.model.ts',
      methodName: 'formater()',
      codeSnippet: 'return `${super.formater()} - ${this.pages}p`;',
      role: 'Produit final'
    }
  ];

  triggerYoYoAnimation(): void {
    let step = 0;
    const interval = setInterval(() => {
      this.activeYoYoIndex.set(step);
      step++;
      if (step >= this.yoyoLevels.length) {
        clearInterval(interval);
        setTimeout(() => this.activeYoYoIndex.set(-1), 1500);
      }
    }, 450);
  }
}
