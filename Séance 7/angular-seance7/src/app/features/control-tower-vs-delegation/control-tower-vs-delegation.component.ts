import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

interface DemoItem {
  id: string;
  type: string;
  titre: string;
  annee: number;
  extra: string;
}

@Component({
  selector: 'app-control-tower-vs-delegation',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 01</span>
          <span class="badge badge-purple">Principe OCP</span>
          <span class="badge badge-warning">Liaison Dynamique</span>
        </div>
        <h2>L'Anti-pattern de la « Tour de Contrôle » vs La Délégation</h2>
        <p class="module-desc">
          Pourquoi les cascades de <code>if / else if</code> ou <code>switch</code> sur les types mènent à la fragilité logicielle, et comment la POO résout élégamment ce problème grâce au polymorphisme.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🔬 Simulateur Comparatif & OCP
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 1)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <!-- Simulateur comparatif interactif -->
        <div class="simulator-wrapper">
          <!-- Barre d'action : Ajouter un Média -->
          <div class="action-bar card-panel">
            <div class="action-info">
              <h4>Expérimentation interactive OCP (Open/Closed Principle)</h4>
              <p>Simulez l'ajout d'un nouveau type de média (ex: Jeu Vidéo) dans le système :</p>
            </div>
            <div class="action-btns">
              <button 
                class="btn-primary" 
                [disabled]="hasAddedJeuVideo()" 
                (click)="ajouterJeuVideo()"
              >
                🎮 Ajouter un Média : JeuVideo ("Zelda", 2017)
              </button>
              <button 
                class="btn-secondary" 
                [disabled]="!hasAddedJeuVideo()" 
                (click)="reinitialiser()"
              >
                ↺ Réinitialiser
              </button>
            </div>
          </div>

          <!-- Grille comparative 2 colonnes -->
          <div class="comparison-grid">
            <!-- Colonne 1 : Approche Procédurale Fragile (Tour de Contrôle) -->
            <div class="card-panel comp-col left-col">
              <div class="col-header">
                <div class="col-title">
                  <span class="status-indicator red"></span>
                  <div>
                    <h3>1. Approche Procédurale Fragile</h3>
                    <span class="sub">L'anti-pattern de la « Tour de Contrôle »</span>
                  </div>
                </div>
                <span class="badge badge-danger">Rigide & Violateur OCP</span>
              </div>

              <div class="code-box">
                <pre><code><span class="token-comment">// Fonction externe qui inspecte tous les objets</span>
<span class="token-keyword">function</span> <span class="token-fn">afficherInfo</span>(item: <span class="token-type">any</span>): <span class="token-type">void</span> {{ '{' }}
  <span class="token-keyword">if</span> (item.type === <span class="token-str">'livre'</span>) {{ '{' }}
    console.log(<span class="token-str">\`Livre: \${{ 'item.titre' }} (\${{ 'item.pages' }} p.)\`</span>);
  {{ '}' }} <span class="token-keyword">else if</span> (item.type === <span class="token-str">'film'</span>) {{ '{' }}
    console.log(<span class="token-str">\`Film: \${{ 'item.titre' }} (\${{ 'item.duree' }} min)\`</span>);
  {{ '}' }} <span class="token-keyword">else</span> {{ '{' }}
    <span class="token-comment">// ⚠️ Si un nouveau média arrive, il est ignoré ou plante !</span>
    console.log(<span class="token-str">'Média inconnu !'</span>);
  {{ '}' }}
{{ '}' }}</code></pre>
              </div>

              <!-- Sortie Console Procédurale -->
              <div class="sim-terminal">
                <div class="terminal-bar">Console Output (Procédural)</div>
                <div class="terminal-content">
                  @for (item of currentItems(); track item.id) {
                    @if (item.type === 'livre') {
                      <div class="term-line success">▶ Livre: {{ item.titre }} ({{ item.extra }} p.)</div>
                    } @else if (item.type === 'film') {
                      <div class="term-line success">▶ Film: {{ item.titre }} ({{ item.extra }} min)</div>
                    } @else {
                      <div class="term-line error">✖ [ALERTE ROUGE] Média inconnu ! Type '{{ item.type }}' ignoré ou non géré.</div>
                    }
                  }
                </div>
              </div>

              @if (hasAddedJeuVideo()) {
                <div class="alert-box error mt-3">
                  <div class="alert-icon">⚠️</div>
                  <div class="alert-body">
                    <strong>Violation de l'Open/Closed Principle !</strong>
                    <p>
                      La fonction <code>afficherInfo()</code> ne sait pas quoi faire du jeu vidéo. Pour le prendre en compte, nous sommes <strong>obligés d'ouvrir le fichier existant</strong> et de modifier le code source pour rajouter une branche <code>else if (item.type === 'jeuvideo')</code>. Risque direct de régression sur le code existant !
                    </p>
                  </div>
                </div>
              } @else {
                <div class="hint-tip mt-3">
                  💡 Cliquez sur « Ajouter un Média : JeuVideo » ci-dessus pour observer la panne.
                </div>
              }
            </div>

            <!-- Colonne 2 : Approche Polymorphisme POO (Délégation) -->
            <div class="card-panel comp-col right-col">
              <div class="col-header">
                <div class="col-title">
                  <span class="status-indicator green"></span>
                  <div>
                    <h3>2. Approche Polymorphisme POO</h3>
                    <span class="sub">Délégation complète à l'objet récepteur</span>
                  </div>
                </div>
                <span class="badge badge-success">Conforme OCP & Extensible</span>
              </div>

              <div class="code-box">
                <pre><code><span class="token-comment">// La fonction appelante universelle : ZÉRO condition !</span>
<span class="token-keyword">function</span> <span class="token-fn">afficher</span>(media: <span class="token-type">Media</span>): <span class="token-type">void</span> {{ '{' }}
  <span class="token-comment">// On envoie un message. L'objet sait comment réagir.</span>
  console.log(media.<span class="token-fn">getDescription</span>());
{{ '}' }}

<span class="token-comment">// Sous-classe fermée et autonome :</span>
<span class="token-keyword">class</span> <span class="token-class">JeuVideo</span> <span class="token-keyword">extends</span> <span class="token-class">Media</span> {{ '{' }}
  <span class="token-keyword">override</span> <span class="token-fn">getDescription</span>(): <span class="token-type">string</span> {{ '{' }}
    <span class="token-keyword">return</span> <span class="token-str">\`Jeu: \${{ 'this.titre' }} [\${{ 'this.plateforme' }}]\`</span>;
  {{ '}' }}
{{ '}' }}</code></pre>
              </div>

              <!-- Sortie Console POO -->
              <div class="sim-terminal">
                <div class="terminal-bar">Console Output (Polymorphisme POO)</div>
                <div class="terminal-content">
                  @for (item of currentItems(); track item.id) {
                    <div class="term-line success">
                      ✔ {{ getPooOutput(item) }}
                    </div>
                  }
                </div>
              </div>

              @if (hasAddedJeuVideo()) {
                <div class="alert-box success mt-3">
                  <div class="alert-icon">🎉</div>
                  <div class="alert-body">
                    <strong>Principe Ouvert/Fermé 100% Respecté !</strong>
                    <p>
                      La fonction <code>afficher(media: Media)</code> n'a <strong>pas bougé d'une seule ligne</strong> ! Le nouveau type <code>JeuVideo</code> s'est greffé instantanément et la liaison dynamique a résolu sa propre méthode <code>getDescription()</code> au runtime.
                    </p>
                  </div>
                </div>
              } @else {
                <div class="hint-tip mt-3">
                  ✨ Le code appelant fait confiance au contrat polymorphe <code>getDescription()</code>.
                </div>
              }
            </div>
          </div>

          <!-- Synthèse Théorique OCP -->
          <div class="card-panel theory-panel mt-3">
            <h3 class="panel-title">🛡️ L'Open/Closed Principle (OCP) démystifié</h3>
            <div class="ocp-grid">
              <div class="ocp-card open">
                <div class="ocp-badge">OUVERT</div>
                <h4>Ouvert à l'extension</h4>
                <p>On peut ajouter de nouveaux comportements ou de nouvelles variantes métier en créant simplement une nouvelle sous-classe dérivée (<code>Podcast</code>, <code>JeuVideo</code>, <code>AudioBook</code>).</p>
              </div>

              <div class="ocp-card closed">
                <div class="ocp-badge">FERMÉ</div>
                <h4>Fermé à la modification</h4>
                <p>Le code existant (classes de base, fonctions de traitement, algorithmes de parcours, templates) reste <strong>totalement intact</strong>, éliminant tout risque de régression lors des évolutions.</p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Mode Labo avec Monaco Editor -->
        <app-code-runner [filterLabNumber]="1"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .simulator-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      gap: 16px;
      flex-wrap: wrap;

      h4 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 2px;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin: 0;
      }

      .action-btns {
        display: flex;
        gap: 10px;
      }
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .comp-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 20px;

      &.left-col {
        border-top: 4px solid #ef4444;
      }

      &.right-col {
        border-top: 4px solid #10b981;
      }
    }

    .col-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .col-title {
      display: flex;
      align-items: center;
      gap: 10px;

      h3 {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-main);
        margin: 0;
      }

      .sub {
        font-size: 0.76rem;
        color: var(--text-muted);
      }
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;

      &.red {
        background: #ef4444;
        box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
      }

      &.green {
        background: #10b981;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
      }
    }

    .code-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px 16px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.45;
      overflow-x: auto;

      pre { margin: 0; }
    }

    .token-comment { color: #64748b; font-style: italic; }
    .token-keyword { color: #c084fc; font-weight: 600; }
    .token-fn { color: #60a5fa; }
    .token-str { color: #86efac; }
    .token-type { color: #fde047; }
    .token-class { color: #38bdf8; font-weight: 600; }

    .sim-terminal {
      background: var(--terminal-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;

      .terminal-bar {
        background: var(--terminal-header);
        padding: 6px 12px;
        font-size: 0.72rem;
        font-family: var(--font-mono);
        color: var(--text-muted);
        border-bottom: 1px solid var(--border-color);
      }

      .terminal-content {
        padding: 12px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
    }

    .term-line {
      &.success { color: #86efac; }
      &.error { color: #fca5a5; font-weight: 600; }
    }

    .alert-box {
      display: flex;
      gap: 12px;
      padding: 14px;
      border-radius: 8px;
      font-size: 0.82rem;

      &.error {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #fef2f2;

        strong { color: #f87171; }
        p { color: #fca5a5; margin: 4px 0 0 0; }
      }

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #ecfdf5;

        strong { color: #34d399; }
        p { color: #a7f3d0; margin: 4px 0 0 0; }
      }

      .alert-icon {
        font-size: 1.3rem;
      }
    }

    .hint-tip {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .theory-panel {
      padding: 20px;

      .panel-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 16px;
      }
    }

    .ocp-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .ocp-card {
      padding: 16px;
      border-radius: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        margin: 8px 0 4px 0;
      }

      p {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
        margin: 0;
      }

      .ocp-badge {
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
      }

      &.open {
        border-color: rgba(14, 165, 233, 0.4);
        h4 { color: #38bdf8; }
        .ocp-badge { background: rgba(14, 165, 233, 0.2); color: #38bdf8; }
      }

      &.closed {
        border-color: rgba(121, 82, 179, 0.4);
        h4 { color: var(--bs-purple-light); }
        .ocp-badge { background: rgba(121, 82, 179, 0.2); color: #c4b5fd; }
      }
    }
  `]
})
export class ControlTowerVsDelegationComponent {
  readonly nav = inject(NavigationService);
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  readonly hasAddedJeuVideo = signal<boolean>(false);

  readonly currentItems = signal<DemoItem[]>([
    { id: '1', type: 'livre', titre: 'Clean Code', annee: 2008, extra: '464' },
    { id: '2', type: 'film', titre: 'Inception', annee: 2010, extra: '148' }
  ]);

  ajouterJeuVideo(): void {
    this.currentItems.update(items => [
      ...items,
      { id: '3', type: 'jeuvideo', titre: 'Zelda: BotW', annee: 2017, extra: 'Nintendo Switch' }
    ]);
    this.hasAddedJeuVideo.set(true);
  }

  reinitialiser(): void {
    this.currentItems.set([
      { id: '1', type: 'livre', titre: 'Clean Code', annee: 2008, extra: '464' },
      { id: '2', type: 'film', titre: 'Inception', annee: 2010, extra: '148' }
    ]);
    this.hasAddedJeuVideo.set(false);
  }

  getPooOutput(item: DemoItem): string {
    switch (item.type) {
      case 'livre':
        return `Livre : « ${item.titre} » — ${item.extra} pages`;
      case 'film':
        return `Film : « ${item.titre} » — ${item.extra} min`;
      case 'jeuvideo':
        return `Jeu : « ${item.titre} » [${item.extra}]`;
      default:
        return `Média : ${item.titre} (${item.annee})`;
    }
  }
}
