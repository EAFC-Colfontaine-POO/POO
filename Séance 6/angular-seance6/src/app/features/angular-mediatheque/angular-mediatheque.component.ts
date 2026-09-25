import { Component, signal, computed } from '@angular/core';
import { MediaModel, LivreModel, FilmModel } from '../../core/models/app.models';
import { FormsModule } from '@angular/forms';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-angular-mediatheque',
  standalone: true,
  imports: [FormsModule, CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Module 7 · Intégration Framework</span>
          <span class="badge badge-angular">Angular 22 Standalone</span>
        </div>
        <h2>Showroom Démo : La Médiathèque Réactive Découplée</h2>
        <p class="module-desc">
          Comment intégrer des classes orientées objet avec les Signals Angular modernes ? Observez une architecture 100% découplée : modèles TypeScript purs et réactivité fine via <code>signal&lt;Media[]&gt;</code> et <code>&#64;for</code> natif.
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
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M3 9h18M9 21V9"></path>
          </svg>
          <span>Architecture Tripartite & Démo Live</span>
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
          <span>Atelier Pratique (Labo 5)</span>
        </button>
      </div>

      @if (activeView() === 'theory') {
        <!-- Architecture Découplée en 3 Panneaux -->
        <div class="three-panels-grid">
          <!-- Panneau 1 : Modèles Purs TS -->
          <div class="code-panel card-panel">
            <div class="panel-tag-header">
              <span class="badge badge-css">PANNEAU 1 : MODÈLES PURS</span>
              <span class="file-name">src/app/models/media.model.ts</span>
            </div>
            <pre class="code-box"><code><span class="comment">// 100% TypeScript pur (agnostique à Angular)</span>
<span class="kw">export abstract class</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(
    <span class="kw">public</span> titre: <span class="typ">string</span>,
    <span class="kw">public</span> annee: <span class="typ">number</span>
  ) &#123;&#125;

  <span class="kw">abstract</span> <span class="fn">getType</span>(): <span class="typ">string</span>;

  <span class="fn">getDescription</span>(): <span class="typ">string</span> &#123;
    <span class="kw">return</span> <span class="str">&#96;« &#36;&#123;this.titre&#125; » (&#36;&#123;this.annee&#125;)&#96;</span>;
  &#125;
&#125;

<span class="kw">export class</span> <span class="cls">Livre</span> <span class="kw">extends</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(t: <span class="typ">string</span>, a: <span class="typ">number</span>, <span class="kw">public</span> pages: <span class="typ">number</span>) &#123;
    <span class="kw">super</span>(t, a);
  &#125;
  <span class="kw">override</span> <span class="fn">getType</span>() &#123; <span class="kw">return</span> <span class="str">'Livre'</span>; &#125;
  <span class="kw">override</span> <span class="fn">getDescription</span>() &#123;
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;super.getDescription()&#125; — &#36;&#123;this.pages&#125; p.&#96;</span>;
  &#125;
&#125;

<span class="kw">export class</span> <span class="cls">Film</span> <span class="kw">extends</span> <span class="cls">Media</span> &#123;
  <span class="kw">constructor</span>(t: <span class="typ">string</span>, a: <span class="typ">number</span>, <span class="kw">public</span> duree: <span class="typ">number</span>) &#123;
    <span class="kw">super</span>(t, a);
  &#125;
  <span class="kw">override</span> <span class="fn">getType</span>() &#123; <span class="kw">return</span> <span class="str">'Film'</span>; &#125;
  <span class="kw">override</span> <span class="fn">getDescription</span>() &#123;
    <span class="kw">return</span> <span class="str">&#96;&#36;&#123;super.getDescription()&#125; — &#36;&#123;this.duree&#125; min&#96;</span>;
  &#125;
&#125;</code></pre>
          </div>

          <!-- Panneau 2 : Composant Standalone -->
          <div class="code-panel card-panel">
            <div class="panel-tag-header">
              <span class="badge badge-angular">PANNEAU 2 : COMPOSANT STANDALONE</span>
              <span class="file-name">mediatheque.component.ts</span>
            </div>
            <pre class="code-box"><code><span class="kw">&#64;Component</span>(&#123;
  selector: <span class="str">'app-mediatheque'</span>,
  standalone: <span class="kw">true</span>,
  templateUrl: <span class="str">'./mediatheque.component.html'</span>
&#125;)
<span class="kw">export class</span> <span class="cls">MediathequeComponent</span> &#123;
  <span class="comment">// 1. État réactif avec Signal typé polymorphique :</span>
  <span class="kw">readonly</span> collection = <span class="fn">signal</span>&lt;<span class="cls">Media</span>[]&gt;([
    <span class="kw">new</span> <span class="cls">Livre</span>(<span class="str">"Dune"</span>, 1965, 412),
    <span class="kw">new</span> <span class="cls">Film</span>(<span class="str">"Matrix"</span>, 1999, 136)
  ]);

  <span class="comment">// 2. État dérivé réactif :</span>
  <span class="kw">readonly</span> totalLivres = <span class="fn">computed</span>(() =&gt; 
    <span class="kw">this</span>.collection().filter(m =&gt; m <span class="kw">instanceof</span> <span class="cls">Livre</span>).length
  );

  <span class="comment">// 3. Mutation immuable :</span>
  <span class="fn">ajouterLivre</span>(titre: <span class="typ">string</span>, annee: <span class="typ">number</span>, pages: <span class="typ">number</span>) &#123;
    <span class="kw">this</span>.collection.<span class="fn">update</span>(liste =&gt; [
      ...liste, 
      <span class="kw">new</span> <span class="cls">Livre</span>(titre, annee, pages)
    ]);
  &#125;
&#125;</code></pre>
          </div>

          <!-- Panneau 3 : Template @for Moderne -->
          <div class="code-panel card-panel">
            <div class="panel-tag-header">
              <span class="badge badge-html">PANNEAU 3 : TEMPLATE MODERNE</span>
              <span class="file-name">mediatheque.component.html</span>
            </div>
            <pre class="code-box"><code>&lt;<span class="kw">div</span> <span class="typ">class</span>=<span class="str">"media-list"</span>&gt;
  <span class="comment">&lt;!-- Itération moderne &#64;for avec tracking propre --&gt;</span>
  &#64;<span class="kw">for</span> (media of collection(); track media.getDescription()) &#123;
    &lt;<span class="kw">div</span> <span class="typ">class</span>=<span class="str">"media-card"</span>&gt;
      &lt;<span class="kw">span</span> <span class="typ">class</span>=<span class="str">"badge"</span>&gt;{{ '{{' }} media.getType() {{ '}}' }}&lt;/<span class="kw">span</span>&gt;
      &lt;<span class="kw">h4</span>&gt;{{ '{{' }} media.titre {{ '}}' }}&lt;/<span class="kw">h4</span>&gt;
      &lt;<span class="kw">p</span>&gt;{{ '{{' }} media.getDescription() {{ '}}' }}&lt;/<span class="kw">p</span>&gt;
    &lt;/<span class="kw">div</span>&gt;
  &#125; &#64;<span class="kw">empty</span> &#123;
    &lt;<span class="kw">div</span> <span class="typ">class</span>=<span class="str">"empty-state"</span>&gt;
      Aucun média dans la collection.
    &lt;/<span class="kw">div</span>&gt;
  &#125;
&lt;/<span class="kw">div</span>&gt;</code></pre>
          </div>
        </div>

        <!-- DÉMONSTRATEUR INTERACTIF EN DIRECT -->
        <div class="card-panel live-demo-card">
          <div class="demo-header">
            <div class="demo-title-group">
              <span class="demo-badge">BAC À SABLE INTERACTIF</span>
              <h3>Médiathèque Réactive en Direct (Angular Signals)</h3>
            </div>

            <!-- Compteurs d'état dérivé -->
            <div class="live-stats">
              <span class="badge badge-bootstrap">Total : {{ collection().length }} médias</span>
              <span class="badge badge-purple">Livres : {{ totalLivres() }}</span>
              <span class="badge badge-html">Films : {{ totalFilms() }}</span>
            </div>
          </div>

          <!-- Formulaire d'ajout rapide -->
          <div class="add-bar">
            <div class="type-selector">
              <button class="type-btn" [class.active]="selectedType() === 'Livre'" (click)="selectedType.set('Livre')">
                📚 Nouveau Livre
              </button>
              <button class="type-btn" [class.active]="selectedType() === 'Film'" (click)="selectedType.set('Film')">
                🎬 Nouveau Film
              </button>
            </div>

            <div class="input-fields">
              <input type="text" [(ngModel)]="formTitre" placeholder="Titre du média (ex: Fondation)">
              <input type="number" [(ngModel)]="formAnnee" placeholder="Année" style="width: 90px;">
              @if (selectedType() === 'Livre') {
                <input type="number" [(ngModel)]="formSpecific" placeholder="Pages (ex: 255)" style="width: 120px;">
              } @else {
                <input type="number" [(ngModel)]="formSpecific" placeholder="Durée en min (ex: 120)" style="width: 120px;">
              }
              <button class="btn-primary btn-sm" (click)="ajouterMedia()">
                + Ajouter au Signal
              </button>
            </div>
          </div>

          <!-- Liste des Médias rendus par @for -->
          <div class="media-rendered-grid">
            @for (item of collection(); track item.getDescription(); let i = $index) {
              <div class="rendered-card" [class.book-border]="item.getType() === 'Livre'" [class.film-border]="item.getType() === 'Film'">
                <div class="card-top">
                  <span class="badge" [class.badge-bootstrap]="item.getType() === 'Livre'" [class.badge-purple]="item.getType() === 'Film'">
                    {{ item.getType() === 'Livre' ? '📚 Livre' : '🎬 Film' }}
                  </span>
                  <button class="delete-btn" (click)="supprimerMedia(i)" title="Supprimer de la collection">✕</button>
                </div>

                <div class="card-title">{{ item.titre }}</div>
                <div class="card-output">
                  <span class="fn-call">media.getDescription() :</span>
                  <code>{{ item.getDescription() }}</code>
                </div>
              </div>
            } @empty {
              <div class="empty-shelf">
                <span>📭 La collection est vide. Ajoutez un livre ou un film ci-dessus.</span>
              </div>
            }
          </div>
        </div>

        <!-- TEASING PÉDAGOGIQUE SÉANCE 7 : LE POLYMORPHISME -->
        <div class="card-panel polymorphism-teaser">
          <div class="teaser-icon">🔮</div>
          <div class="teaser-body">
            <span class="teaser-tag">TEASING PÉDAGOGIQUE POUR LA SÉANCE 7</span>
            <h4>« Comment le template sait-il quelle méthode appeler sur <code>media.getDescription()</code> ? »</h4>
            <p>
              Remarquez la beauté du template Angular : il boucle sur un simple tableau de type générique <code>Media[]</code>. Il appelle aveuglément <code>media.getDescription()</code> sans savoir s'il s'agit d'un livre ou d'un film.
              C'est le moteur d'exécution qui, à la volée, résout la méthode concrète de l'objet sous-jacent. C'est le <strong>Polymorphisme</strong>, le sujet d'or de notre prochaine séance !
            </p>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="5"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .three-panels-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }

    .code-panel {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .panel-tag-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      .file-name {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--text-dim);
      }
    }

    .code-box {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 12px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      line-height: 1.5;
      overflow-x: auto;
      border: 1px solid var(--border-subtle);

      .kw { color: #c678dd; }
      .cls { color: #e5c07b; }
      .typ { color: #e5c07b; }
      .fn { color: #61afef; }
      .str { color: #98c379; }
      .comment { color: #5c6370; font-style: italic; }
    }

    /* Live Demo */
    .live-demo-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .demo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;

      .demo-badge {
        font-size: 0.72rem;
        font-weight: 800;
        color: #38bdf8;
        letter-spacing: 0.08em;
      }

      h3 {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-main);
      }
    }

    .live-stats {
      display: flex;
      gap: 8px;
    }

    .add-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--bg-subtle);
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      flex-wrap: wrap;
    }

    .type-selector {
      display: flex;
      gap: 6px;
    }

    .type-btn {
      padding: 6px 12px;
      border-radius: 6px;
      background: var(--bg-card);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
      font-size: 0.78rem;
      font-weight: 600;

      &.active {
        background: var(--bs-purple);
        color: #ffffff;
        border-color: var(--bs-purple-light);
      }
    }

    .input-fields {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      flex-wrap: wrap;

      input {
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        color: var(--text-main);
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 0.82rem;
        outline: none;

        &:focus {
          border-color: var(--border-focus);
        }
      }
    }

    .media-rendered-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }

    .rendered-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.book-border {
        border-left: 4px solid #3b82f6;
      }

      &.film-border {
        border-left: 4px solid #9333ea;
      }
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .delete-btn {
      color: var(--text-dim);
      font-size: 0.8rem;
      padding: 2px 6px;
      border-radius: 4px;

      &:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .card-output {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 0.74rem;

      .fn-call {
        color: var(--text-dim);
      }

      code {
        background: var(--bg-code);
        padding: 6px 8px;
        border-radius: 4px;
        color: #c4b5fd;
        font-family: var(--font-mono);
      }
    }

    .empty-shelf {
      grid-column: 1 / -1;
      padding: 32px;
      text-align: center;
      color: var(--text-dim);
      font-size: 0.9rem;
    }

    /* Teaser Séance 7 */
    .polymorphism-teaser {
      background: linear-gradient(135deg, rgba(121, 82, 179, 0.15), rgba(14, 165, 233, 0.15));
      border: 1px solid rgba(121, 82, 179, 0.4);
      padding: 20px;
      display: flex;
      align-items: flex-start;
      gap: 16px;

      .teaser-icon {
        font-size: 2.2rem;
      }

      .teaser-body {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .teaser-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #c4b5fd;
          letter-spacing: 0.08em;
        }

        h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
        }

        p {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;

          strong {
            color: #38bdf8;
          }
        }
      }
    }
  `]
})
export class AngularMediathequeComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly collection = signal<MediaModel[]>([
    new LivreModel('Dune', 1965, 412),
    new FilmModel('Matrix', 1999, 136),
    new LivreModel('1984', 1949, 328)
  ]);

  readonly selectedType = signal<'Livre' | 'Film'>('Livre');
  formTitre: string = '';
  formAnnee: number = 2026;
  formSpecific: number = 250;

  readonly totalLivres = computed(() => 
    this.collection().filter(m => m instanceof LivreModel).length
  );

  readonly totalFilms = computed(() => 
    this.collection().filter(m => m instanceof FilmModel).length
  );

  ajouterMedia(): void {
    if (!this.formTitre.trim()) return;

    if (this.selectedType() === 'Livre') {
      const nouveauLivre = new LivreModel(this.formTitre, this.formAnnee, this.formSpecific || 100);
      this.collection.update(items => [...items, nouveauLivre]);
    } else {
      const nouveauFilm = new FilmModel(this.formTitre, this.formAnnee, this.formSpecific || 120);
      this.collection.update(items => [...items, nouveauFilm]);
    }

    this.formTitre = '';
  }

  supprimerMedia(index: number): void {
    this.collection.update(items => items.filter((_, i) => i !== index));
  }
}
