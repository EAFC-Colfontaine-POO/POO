import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

// ==========================================
// COUCHE 1 : MODÈLE MÉTIER PUR (media.model.ts)
// ==========================================
export class MediaClass {
  constructor(
    public titre: string,
    public annee: number
  ) {}

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }

  getBadgeCss(): string {
    return 'badge badge-bootstrap';
  }
}

export class LivreClass extends MediaClass {
  constructor(
    titre: string,
    annee: number,
    public auteur: string,
    public pages: number
  ) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `« ${this.titre} » par ${this.auteur}`;
  }

  override getBadgeCss(): string {
    return 'badge badge-purple';
  }
}

export class FilmClass extends MediaClass {
  constructor(
    titre: string,
    annee: number,
    public realisateur: string,
    public duree: number
  ) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `Film : « ${this.titre} » (${this.duree} min)`;
  }

  override getBadgeCss(): string {
    return 'badge badge-danger';
  }
}

export class JeuVideoClass extends MediaClass {
  constructor(
    titre: string,
    annee: number,
    public console: string
  ) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `Jeu : « ${this.titre} » [${this.console}]`;
  }

  override getBadgeCss(): string {
    return 'badge badge-success';
  }
}

@Component({
  selector: 'app-angular-modern-mediatheque',
  standalone: true,
  imports: [FormsModule, CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 7 · Module 08</span>
          <span class="badge badge-angular">Angular Moderne</span>
          <span class="badge badge-purple">Signals + &#64;for + &#64;if</span>
        </div>
        <h2>Démonstrateur Angular Moderne (Architecture de Production)</h2>
        <p class="module-desc">
          Architecture 3 couches en direct : découplage du modèle métier pur, réactivité par <code>Signals</code> et rendu polymorphe dans le template Standalone avec le Control Flow natif.
        </p>

        <div class="section-mode-tabs mt-2">
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'simulator'"
            (click)="activeMode.set('simulator')"
          >
            🏛️ Médiathèque Angular en Direct
          </button>
          <button 
            class="mode-tab-btn" 
            [class.active]="activeMode() === 'exercises'"
            (click)="activeMode.set('exercises')"
          >
            💻 Exercices d'Entraînement (Labo 6)
          </button>
        </div>
      </div>

      @if (activeMode() === 'simulator') {
        <div class="angular-workbench">
          <!-- Les 3 Couches d'Architecture -->
          <div class="layers-grid">
            <div class="layer-card">
              <div class="layer-num">1</div>
              <div class="layer-info">
                <h4>Modèle Métier Pur</h4>
                <p><code>media.model.ts</code> : 100% indépendant d'Angular, méthodes polymorphes <code>getDescription()</code> et <code>getBadgeCss()</code>.</p>
              </div>
            </div>

            <div class="layer-card">
              <div class="layer-num">2</div>
              <div class="layer-info">
                <h4>Service Réactif</h4>
                <p><code>mediatheque.service.ts</code> : <code>signal&lt;Media[]&gt;</code> privé, <code>computed()</code> pour l'exposition en lecture seule.</p>
              </div>
            </div>

            <div class="layer-card">
              <div class="layer-num">3</div>
              <div class="layer-info">
                <h4>Template Standalone</h4>
                <p><code>catalogue.component.html</code> : boucle <code>&#64;for</code> universelle, métadonnées exclusives avec <code>&#64;if (m instanceof LivreClass)</code>.</p>
              </div>
            </div>
          </div>

          <!-- Panneau d'Ajout Réactif -->
          <div class="card-panel add-media-panel">
            <div class="add-header">
              <h4>Ajouter un média au Signal de la Médiathèque :</h4>
            </div>

            <div class="form-grid">
              <div class="input-group">
                <label>Type :</label>
                <select [(ngModel)]="newType">
                  <option value="livre">📖 Livre</option>
                  <option value="film">🎬 Film</option>
                  <option value="jeu">🎮 Jeu Vidéo</option>
                </select>
              </div>

              <div class="input-group">
                <label>Titre :</label>
                <input type="text" [(ngModel)]="newTitre" placeholder="Titre de l'œuvre">
              </div>

              <div class="input-group">
                <label>Année :</label>
                <input type="number" [(ngModel)]="newAnnee" style="width: 100px;">
              </div>

              @if (newType === 'livre') {
                <div class="input-group">
                  <label>Auteur :</label>
                  <input type="text" [(ngModel)]="newLivreAuteur" placeholder="Auteur">
                </div>
                <div class="input-group">
                  <label>Pages :</label>
                  <input type="number" [(ngModel)]="newLivrePages" style="width: 90px;">
                </div>
              }

              @if (newType === 'film') {
                <div class="input-group">
                  <label>Réalisateur :</label>
                  <input type="text" [(ngModel)]="newFilmReal" placeholder="Réalisateur">
                </div>
                <div class="input-group">
                  <label>Durée (min) :</label>
                  <input type="number" [(ngModel)]="newFilmDuree" style="width: 90px;">
                </div>
              }

              @if (newType === 'jeu') {
                <div class="input-group">
                  <label>Console :</label>
                  <input type="text" [(ngModel)]="newJeuConsole" placeholder="ex: Nintendo Switch">
                </div>
              }

              <button class="btn-primary" (click)="ajouterMediaAuSignal()">
                ➕ Ajouter au Signal
              </button>
            </div>
          </div>

          <!-- Rendu en direct du Catalogue Angular (@for & @if) -->
          <div class="card-panel showroom-panel">
            <div class="showroom-header">
              <div class="showroom-title">
                <span class="pulse-icon">●</span>
                <h3>Catalogue Réactif (Signal <code>medias()</code> : {{ medias().length }} éléments)</h3>
              </div>
              <span class="tech-badge">Rendu Standalone Angular</span>
            </div>

            <div class="showroom-cards-grid">
              @for (media of medias(); track $index) {
                <div class="showroom-card">
                  <!-- En-tête : Badge dynamique issu du modèle -->
                  <div class="sh-top">
                    <span [class]="media.getBadgeCss()">{{ media.annee }}</span>
                  </div>

                  <!-- Corps : Appel polymorphe pur au runtime -->
                  <div class="sh-body">
                    <h5 class="sh-title">{{ media.getDescription() }}</h5>
                  </div>

                  <!-- Pied : Métadonnées exclusives via @if (media instanceof Classe) -->
                  <div class="sh-footer">
                    @if (media instanceof LivreClassRef) {
                      <div class="specific-meta book">
                        <span>✍️ <strong>Auteur :</strong> {{ media.auteur }}</span>
                        <span>📄 <strong>Pagination :</strong> {{ media.pages }} pages</span>
                      </div>
                    }

                    @if (media instanceof FilmClassRef) {
                      <div class="specific-meta movie">
                        <span>🎬 <strong>Réalisateur :</strong> {{ media.realisateur }}</span>
                        <span>⏱️ <strong>Durée :</strong> {{ media.duree }} minutes</span>
                      </div>
                    }

                    @if (media instanceof JeuVideoClassRef) {
                      <div class="specific-meta game">
                        <span>🎮 <strong>Plateforme :</strong> {{ media.console }}</span>
                      </div>
                    }
                  </div>
                </div>
              } @empty {
                <div class="empty-box">Aucun média dans la médiathèque.</div>
              }
            </div>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="6"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .angular-workbench {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .layers-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .layer-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      align-items: flex-start;
      gap: 12px;

      .layer-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--bs-purple);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.8rem;
        flex-shrink: 0;
      }

      h4 {
        font-size: 0.92rem;
        font-weight: 700;
        margin: 0 0 2px 0;
        color: var(--text-main);
      }

      p {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.4;
        margin: 0;
      }
    }

    .add-media-panel {
      padding: 18px 20px;

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        margin: 0 0 12px 0;
        color: var(--text-main);
      }
    }

    .form-grid {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      flex-wrap: wrap;

      .input-group {
        display: flex;
        flex-direction: column;
        gap: 4px;

        label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        input, select {
          padding: 7px 10px;
          border-radius: 6px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-size: 0.82rem;

          &:focus {
            outline: none;
            border-color: var(--bs-purple);
          }
        }
      }
    }

    .showroom-panel {
      padding: 20px;
    }

    .showroom-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 10px;

      .showroom-title {
        display: flex;
        align-items: center;
        gap: 8px;

        .pulse-icon {
          color: #10b981;
          font-size: 0.8rem;
          animation: pulse 2s infinite;
        }

        h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }
      }
    }

    .showroom-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .showroom-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s;

      &:hover {
        border-color: rgba(121, 82, 179, 0.4);
        transform: translateY(-2px);
      }

      .sh-title {
        font-size: 0.98rem;
        font-weight: 700;
        color: var(--text-main);
        margin: 0;
        line-height: 1.4;
      }

      .sh-footer {
        border-top: 1px solid var(--border-color);
        padding-top: 10px;
      }
    }

    .specific-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 0.76rem;

      &.book { color: #c4b5fd; }
      &.movie { color: #fca5a5; }
      &.game { color: #86efac; }
    }

    .empty-box {
      padding: 24px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
  `]
})
export class AngularModernMediathequeComponent {
  readonly activeMode = signal<'simulator' | 'exercises'>('simulator');

  protected readonly LivreClassRef = LivreClass;
  protected readonly FilmClassRef = FilmClass;
  protected readonly JeuVideoClassRef = JeuVideoClass;

  private readonly _medias = signal<MediaClass[]>([
    new LivreClass('Le Petit Prince', 1943, 'Antoine de Saint-Exupéry', 96),
    new FilmClass('Inception', 2010, 'Christopher Nolan', 148),
    new JeuVideoClass('The Witcher 3', 2015, 'PC / Consoles')
  ]);

  readonly medias = computed(() => this._medias());

  newType = 'livre';
  newTitre = 'Clean Code';
  newAnnee = 2024;
  newLivreAuteur = 'Robert C. Martin';
  newLivrePages = 464;
  newFilmReal = 'Christopher Nolan';
  newFilmDuree = 150;
  newJeuConsole = 'PS5';

  ajouterMediaAuSignal(): void {
    const titre = this.newTitre.trim() || (this.newType === 'livre' ? 'Livre sans titre' : this.newType === 'film' ? 'Film sans titre' : 'Jeu sans titre');
    const annee = Number(this.newAnnee) || 2024;

    let nouveau: MediaClass;
    if (this.newType === 'livre') {
      nouveau = new LivreClass(titre, annee, this.newLivreAuteur.trim() || 'Auteur inconnu', Number(this.newLivrePages) || 100);
    } else if (this.newType === 'film') {
      nouveau = new FilmClass(titre, annee, this.newFilmReal.trim() || 'Réalisateur inconnu', Number(this.newFilmDuree) || 100);
    } else {
      nouveau = new JeuVideoClass(titre, annee, this.newJeuConsole.trim() || 'Multiplateforme');
    }

    this._medias.update(list => [...list, nouveau]);
  }
}
