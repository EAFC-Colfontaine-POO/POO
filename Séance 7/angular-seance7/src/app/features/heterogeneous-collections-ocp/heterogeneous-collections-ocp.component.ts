import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

interface CatalogueEntry {
  id: string;
  className: string;
  titre: string;
  annee: number;
  badgeCss: string;
  description: string;
  extraMeta: string;
}

@Component({
  selector: 'app-heterogeneous-collections-ocp',
  standalone: true,
  imports: [FormsModule, CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 05</span>
          <span class="badge badge-purple">Collections Hétérogènes</span>
          <span class="badge badge-success">Crash-Test OCP</span>
        </div>
        <h2>Collections Hétérogènes & Crash-Test OCP</h2>
        <p class="module-desc">
          Comment rassembler des objets variés dans un tableau unique <code>Media[]</code> et les traiter de façon totalement uniforme avec une seule boucle <code>for...of</code>.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            📚 Catalogue Multimédia & Crash-Test OCP
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 3)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="collections-workbench">
          <!-- Barre d'actions rapides du catalogue -->
          <div class="card-panel catalogue-actions">
            <div class="action-desc">
              <h4>Ajouter des médias standards au catalogue (<code>catalogue: Media[]</code>) :</h4>
            </div>
            <div class="add-buttons">
              <button class="btn-secondary btn-sm" (click)="addLivre()">
                📖 + Livre ("Le Seigneur des Anneaux", 1178 p.)
              </button>
              <button class="btn-secondary btn-sm" (click)="addFilm()">
                🎬 + Film ("Interstellar", 169 min)
              </button>
              <button class="btn-secondary btn-sm" (click)="addJeu()">
                🎮 + JeuVideo ("The Witcher 3", PC)
              </button>
              <button class="btn-ghost btn-sm" (click)="reinitCatalogue()">
                ↺ Réinitialiser
              </button>
            </div>
          </div>

          <!-- Affichage du Code de la Boucle Universelle -->
          <div class="card-panel code-loop-panel">
            <div class="panel-header">
              <span class="tag">TRAITEMENT UNIFORME</span>
              <span class="count-pill">{{ catalogue().length }} éléments dans le tableau</span>
            </div>
            <div class="code-box">
              <pre><code><span class="token-comment">// 1. Le tableau hétérogène : rassemble sous le type parent Media</span>
<span class="token-keyword">const</span> catalogue: <span class="token-type">Media</span>[] = [ ... ];

<span class="token-comment">// 2. La boucle universelle : UNE SEULE instruction pour tous les médias !</span>
<span class="token-keyword">for</span> (<span class="token-keyword">const</span> media <span class="token-keyword">of</span> catalogue) {{ '{' }}
  console.log(media.<span class="token-fn">getDescription</span>()); <span class="token-comment">// ✨ Late binding en direct !</span>
{{ '}' }}</code></pre>
            </div>
          </div>

          <!-- Rendu en direct des cartes du catalogue -->
          <div class="catalogue-grid">
            @for (item of catalogue(); track item.id) {
              <div class="card-panel media-card">
                <div class="card-top">
                  <span [class]="item.badgeCss">{{ item.className }}</span>
                  <span class="year-pill">{{ item.annee }}</span>
                </div>

                <div class="card-body-content">
                  <h4 class="media-title">{{ item.titre }}</h4>
                  <div class="poly-call-box">
                    <span class="call-sig">media.getDescription() 👉</span>
                    <span class="call-res">« {{ item.description }} »</span>
                  </div>
                </div>

                <div class="card-bottom">
                  <span class="extra-info">{{ item.extraMeta }}</span>
                  <button class="remove-btn" (click)="removeItem(item.id)" title="Supprimer du catalogue">✕</button>
                </div>
              </div>
            } @empty {
              <div class="empty-state card-panel">
                <span>Le catalogue est vide. Ajoutez des médias avec les boutons ci-dessus !</span>
              </div>
            }
          </div>

          <!-- SECTION CRASH-TEST OCP -->
          <div class="card-panel crash-test-card">
            <div class="crash-header">
              <div class="crash-title-box">
                <span class="crash-badge">CRASH-TEST OCP</span>
                <h3>Créez une Nouvelle Sous-Classe Personnalisée !</h3>
              </div>
              <p>Prouvez que l'application est ouverte à l'extension sans modifier une seule ligne du moteur :</p>
            </div>

            <div class="crash-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nom de la nouvelle classe :</label>
                  <input type="text" [(ngModel)]="newClassName" placeholder="ex: Podcast, AudioBook, Manga">
                </div>

                <div class="form-group">
                  <label>Titre de l'œuvre :</label>
                  <input type="text" [(ngModel)]="newTitre" placeholder="ex: Underscore Talk">
                </div>

                <div class="form-group">
                  <label>Année :</label>
                  <input type="number" [(ngModel)]="newAnnee" style="width: 110px;">
                </div>

                <div class="form-group">
                  <label>Spécificité (ex: animateur, épisodes) :</label>
                  <input type="text" [(ngModel)]="newExtra" placeholder="ex: Animé par Micode (24 épisodes)">
                </div>
              </div>

              <div class="form-action">
                <button class="btn-primary" (click)="injectCustomClass()">
                  🚀 Injecter la classe dans le Catalogue
                </button>
              </div>
            </div>

            @if (hasInjectedCustom()) {
              <div class="crash-success-banner mt-3">
                <div class="banner-icon">🎉</div>
                <div class="banner-text">
                  <strong>Crash-Test OCP Réussi à 100% !</strong>
                  <p>
                    La classe <code>{{ lastInjectedClass }}</code> a été instanciée et ajoutée au tableau <code>Media[]</code>.
                    La boucle universelle a immédiatement invoqué sa méthode <code>getDescription()</code> sans que nous n'ayons retouché au code d'affichage !
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="3"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .collections-workbench {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .catalogue-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      flex-wrap: wrap;
      gap: 12px;

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-main);
      }

      .add-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    .code-loop-panel {
      padding: 16px 20px;

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .tag {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--bs-purple-light);
        }

        .count-pill {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }
      }
    }

    .code-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px 16px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      line-height: 1.5;

      pre { margin: 0; }
    }

    .token-comment { color: #64748b; font-style: italic; }
    .token-keyword { color: #c084fc; font-weight: 600; }
    .token-fn { color: #60a5fa; }
    .token-type { color: #fde047; }

    .catalogue-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .media-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      background: var(--bg-card);
      border-radius: 8px;

      .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .year-pill {
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--text-dim);
        }
      }

      .media-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-main);
        margin: 0 0 6px 0;
      }

      .poly-call-box {
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 8px 10px;
        font-family: var(--font-mono);
        display: flex;
        flex-direction: column;
        gap: 4px;

        .call-sig {
          font-size: 0.7rem;
          color: #38bdf8;
        }

        .call-res {
          font-size: 0.8rem;
          color: #86efac;
          font-weight: 600;
        }
      }

      .card-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--border-color);
        padding-top: 8px;

        .extra-info {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .remove-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: var(--text-dim);

          &:hover {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.15);
          }
        }
      }
    }

    .empty-state {
      padding: 30px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    /* Crash-test OCP */
    .crash-test-card {
      padding: 20px;
      border: 1px solid rgba(121, 82, 179, 0.4);
      background: linear-gradient(180deg, var(--bg-card), var(--bg-subtle));

      .crash-header {
        margin-bottom: 16px;

        .crash-title-box {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;

          h3 {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--text-main);
            margin: 0;
          }

          .crash-badge {
            background: #7952b3;
            color: #fff;
            font-size: 0.68rem;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
          }
        }

        p {
          font-size: 0.84rem;
          color: var(--text-muted);
          margin: 0;
        }
      }

      .crash-form {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .form-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 160px;

          label {
            font-size: 0.74rem;
            font-weight: 600;
            color: var(--text-muted);
          }

          input {
            padding: 8px 12px;
            border-radius: 6px;
            background: var(--bg-input);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            font-size: 0.85rem;

            &:focus {
              outline: none;
              border-color: var(--bs-purple);
            }
          }
        }
      }

      .crash-success-banner {
        display: flex;
        gap: 12px;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.35);
        border-radius: 8px;
        padding: 14px;
        color: #ecfdf5;

        .banner-icon { font-size: 1.4rem; }

        strong { color: #34d399; }
        p { color: #a7f3d0; margin: 4px 0 0 0; font-size: 0.82rem; }
      }
    }
  `]
})
export class HeterogeneousCollectionsOcpComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');
  readonly hasInjectedCustom = signal<boolean>(false);
  lastInjectedClass = '';

  newClassName = 'Podcast';
  newTitre = 'Underscore_';
  newAnnee = 2024;
  newExtra = 'Animé par Micode (24 épisodes)';

  readonly catalogue = signal<CatalogueEntry[]>([
    {
      id: '1',
      className: 'Livre',
      titre: '1984',
      annee: 1949,
      badgeCss: 'badge badge-bootstrap',
      description: 'Livre : 1984 — 328 pages',
      extraMeta: '328 pages'
    },
    {
      id: '2',
      className: 'Film',
      titre: 'Matrix',
      annee: 1999,
      badgeCss: 'badge badge-danger',
      description: 'Film : Matrix — 136 min',
      extraMeta: '136 minutes'
    },
    {
      id: '3',
      className: 'Livre',
      titre: 'Dune',
      annee: 1965,
      badgeCss: 'badge badge-bootstrap',
      description: 'Livre : Dune — 412 pages',
      extraMeta: '412 pages'
    }
  ]);

  addLivre(): void {
    const id = Date.now().toString();
    this.catalogue.update(list => [
      ...list,
      {
        id,
        className: 'Livre',
        titre: 'Le Seigneur des Anneaux',
        annee: 1954,
        badgeCss: 'badge badge-bootstrap',
        description: 'Livre : Le Seigneur des Anneaux — 1178 pages',
        extraMeta: '1178 pages'
      }
    ]);
  }

  addFilm(): void {
    const id = Date.now().toString();
    this.catalogue.update(list => [
      ...list,
      {
        id,
        className: 'Film',
        titre: 'Interstellar',
        annee: 2014,
        badgeCss: 'badge badge-danger',
        description: 'Film : Interstellar — 169 min',
        extraMeta: '169 minutes'
      }
    ]);
  }

  addJeu(): void {
    const id = Date.now().toString();
    this.catalogue.update(list => [
      ...list,
      {
        id,
        className: 'JeuVideo',
        titre: 'The Witcher 3',
        annee: 2015,
        badgeCss: 'badge badge-success',
        description: 'Jeu : The Witcher 3 [PC / Consoles]',
        extraMeta: 'PC / Consoles'
      }
    ]);
  }

  removeItem(id: string): void {
    this.catalogue.update(list => list.filter(item => item.id !== id));
  }

  reinitCatalogue(): void {
    this.catalogue.set([
      {
        id: '1',
        className: 'Livre',
        titre: '1984',
        annee: 1949,
        badgeCss: 'badge badge-bootstrap',
        description: 'Livre : 1984 — 328 pages',
        extraMeta: '328 pages'
      },
      {
        id: '2',
        className: 'Film',
        titre: 'Matrix',
        annee: 1999,
        badgeCss: 'badge badge-danger',
        description: 'Film : Matrix — 136 min',
        extraMeta: '136 minutes'
      }
    ]);
    this.hasInjectedCustom.set(false);
  }

  injectCustomClass(): void {
    const cls = this.newClassName.trim() || 'Podcast';
    const titre = this.newTitre.trim() || 'Émission sans titre';
    const annee = Number(this.newAnnee) || 2024;
    const extra = this.newExtra.trim() || 'Détails spécialisés';

    const id = Date.now().toString();
    this.catalogue.update(list => [
      ...list,
      {
        id,
        className: cls,
        titre,
        annee,
        badgeCss: 'badge badge-warning',
        description: `${cls} : « ${titre} » [${extra}]`,
        extraMeta: extra
      }
    ]);

    this.lastInjectedClass = cls;
    this.hasInjectedCustom.set(true);
  }
}
