import { Component, signal, computed, inject } from '@angular/core';
import { SemanticPairCard } from '../../core/models/app.models';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-is-a-vs-has-a',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Module 2 · Fondements Sémantiques</span>
          <span class="badge badge-css">Modélisation Objet</span>
        </div>
        <h2>La Relation « Est-un » (is-a) vs La Composition (« A-un »)</h2>
        <p class="module-desc">
          Ne jamais hériter par simple commodité ! L'héritage crée le couplage le plus fort de toute la programmation orientée objet. Avant d'écrire <code>extends</code>, appliquez systématiquement la Question d'Or.
        </p>
      </div>

      <!-- Onglets Mode Théorie vs Labo -->
      <div class="section-mode-tabs">
        <button 
          class="mode-tab-btn" 
          [class.active]="activeView() === 'theory'"
          (click)="activeView.set('theory')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="18" r="3"></circle>
            <circle cx="6" cy="6" r="3"></circle>
            <path d="M6 21V9a9 9 0 0 0 9 9"></path>
          </svg>
          <span>Simulateur Cartes de Tri « Est-un »</span>
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
        <!-- Bannière de la Question d'Or -->
        <div class="golden-question-banner card-panel">
          <div class="golden-badge">🌟 LA QUESTION D'OR SÉMANTIQUE</div>
          <div class="golden-text">
            « Un <span class="term-b">B</span> est-il véritablement, naturellement et <u>en tout temps</u> un <span class="term-a">A</span> ? »
          </div>
          <div class="golden-sub">
            Si la réponse est <strong>OUI</strong> sans compromis ➔ <span class="badge badge-success">Héritage (B extends A)</span><br>
            Si la relation exprime une possession, une pièce détachée ou un contenant ➔ <span class="badge badge-purple">Composition (B possède un attribut de type A)</span>
          </div>
        </div>

        <!-- Compteur de progression du tri -->
        <div class="quiz-progress-bar card-panel">
          <div class="quiz-info">
            <span class="quiz-label">Exercice de validation sémantique</span>
            <span class="quiz-count">{{ score() }}/{{ cards().length }} résolus correctement</span>
          </div>
          <div class="track">
            <div class="fill" [style.width.%]="(score() / cards().length) * 100"></div>
          </div>
        </div>

        <!-- Grille des Cartes de Tri Interactives -->
        <div class="cards-grid">
          @for (c of cards(); track c.id) {
            <div class="card-panel semantic-card" [class.answered]="c.userChoice !== undefined" [class.correct]="c.userChoice === c.correctRelation" [class.wrong]="c.userChoice !== undefined && c.userChoice !== c.correctRelation">
              <div class="card-top">
                <div class="relation-pair">
                  <span class="cls-box class-b">{{ c.classB }}</span>
                  <span class="link-symbol">➔</span>
                  <span class="cls-box class-a">{{ c.classA }}</span>
                </div>
                @if (c.userChoice) {
                  <span class="badge" [class.badge-success]="c.userChoice === c.correctRelation" [class.badge-html]="c.userChoice !== c.correctRelation">
                    {{ c.userChoice === c.correctRelation ? '✔ Validé' : '✖ Erreur' }}
                  </span>
                }
              </div>

              <div class="card-question">
                Quelle est la relation architecturale légitime entre <strong>{{ c.classB }}</strong> et <strong>{{ c.classA }}</strong> ?
              </div>

              <!-- Boutons de Choix -->
              <div class="choice-buttons">
                <button 
                  class="choice-btn"
                  [class.selected]="c.userChoice === 'is-a'"
                  (click)="submitChoice(c.id, 'is-a')"
                >
                  <span class="icon">🏛️</span>
                  <span>« Est-un » (Héritage)</span>
                </button>

                <button 
                  class="choice-btn"
                  [class.selected]="c.userChoice === 'has-a'"
                  (click)="submitChoice(c.id, 'has-a')"
                >
                  <span class="icon">🧩</span>
                  <span>« A-un » (Composition)</span>
                </button>
              </div>

              <!-- Feedback & Explication Pédagogique -->
              @if (c.userChoice) {
                <div class="feedback-box" [class.success]="c.userChoice === c.correctRelation" [class.error]="c.userChoice !== c.correctRelation">
                  <div class="fb-title">
                    {{ c.userChoice === c.correctRelation ? '🎉 Analyse exacte !' : '⚠️ Piège de modélisation :' }}
                  </div>
                  <p class="fb-text">{{ c.justification }}</p>

                  @if (c.heresyExplanation) {
                    <div class="heresy-box">
                      <span class="heresy-tag">DANGER DE L'HÉRITAGE PAR COMMODITÉ :</span>
                      <p>{{ c.heresyExplanation }}</p>
                    </div>
                  }

                  <div class="code-preview-box">
                    <span class="preview-label">Design recommandé :</span>
                    <code>{{ c.recommendedDesign }}</code>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Alerte Pédagogique : Le Danger de l'Héritage par Commodité -->
        <div class="card-panel warning-banner">
          <div class="banner-icon">🚨</div>
          <div class="banner-body">
            <h4>Pourquoi <code>class Facture extends Client</code> est une hérésie ?</h4>
            <p>
              Parce qu'une <code>Facture</code> n'a pas de date de naissance, ne se connecte pas avec un mot de passe et n'a pas de panier d'achat !
              Si vous héritez de <code>Client</code> uniquement pour récupérer les champs <code>nom</code> et <code>email</code>, vous violez le principe de substitution et vous polluez votre objet avec des dizaines de méthodes sans aucun sens métier.
            </p>
          </div>
        </div>
      } @else {
        <app-code-runner [filterLabNumber]="4"></app-code-runner>
      }
    </div>
  `,
  styles: [`
    .golden-question-banner {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(121, 82, 179, 0.15));
      border: 1px solid rgba(121, 82, 179, 0.4);
      padding: 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .golden-badge {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        color: #c4b5fd;
      }

      .golden-text {
        font-size: 1.35rem;
        font-weight: 800;
        color: var(--text-main);

        .term-b { color: #60a5fa; }
        .term-a { color: #34d399; }
      }

      .golden-sub {
        font-size: 0.88rem;
        color: var(--text-muted);
        line-height: 1.6;
      }
    }

    .quiz-progress-bar {
      padding: 12px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .quiz-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);

        .quiz-count {
          color: #38bdf8;
        }
      }

      .track {
        height: 6px;
        background: var(--bg-subtle);
        border-radius: 3px;
        overflow: hidden;

        .fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #10b981);
          transition: width 0.3s ease;
        }
      }
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 16px;
    }

    .semantic-card {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.2s;

      &.correct {
        border-color: rgba(16, 185, 129, 0.4);
      }

      &.wrong {
        border-color: rgba(239, 68, 68, 0.4);
      }
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .relation-pair {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-weight: 700;

      .cls-box {
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.85rem;

        &.class-b {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        &.class-a {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
      }

      .link-symbol {
        color: var(--text-dim);
      }
    }

    .card-question {
      font-size: 0.88rem;
      color: var(--text-main);
      line-height: 1.4;
    }

    .choice-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .choice-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 600;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.selected {
        background: var(--bs-purple);
        color: #ffffff;
        border-color: var(--bs-purple-light);
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.4);
      }
    }

    .feedback-box {
      padding: 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.success {
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.25);
        color: #ecfdf5;

        .fb-title { color: #34d399; font-weight: 700; }
        .fb-text { color: #d1fae5; }
      }

      &.error {
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: #fef2f2;

        .fb-title { color: #f87171; font-weight: 700; }
        .fb-text { color: #fca5a5; }
      }
    }

    .heresy-box {
      background: rgba(239, 68, 68, 0.12);
      padding: 8px;
      border-radius: 4px;
      font-size: 0.76rem;

      .heresy-tag {
        font-weight: 800;
        color: #f87171;
        display: block;
        margin-bottom: 2px;
      }

      p {
        color: #fecaca;
        line-height: 1.35;
      }
    }

    .code-preview-box {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.76rem;

      .preview-label {
        color: var(--text-dim);
        font-weight: 600;
      }

      code {
        background: var(--bg-code);
        padding: 6px 8px;
        border-radius: 4px;
        color: #c4b5fd;
        border: 1px solid var(--border-subtle);
        word-break: break-all;
      }
    }

    .warning-banner {
      display: flex;
      gap: 16px;
      padding: 20px;
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.05);

      .banner-icon {
        font-size: 2rem;
      }

      .banner-body {
        h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #f87171;
          margin-bottom: 6px;
        }

        p {
          font-size: 0.88rem;
          color: var(--text-main);
          line-height: 1.5;
        }
      }
    }
  `]
})
export class IsAVsHasAComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly cards = signal<SemanticPairCard[]>([
    {
      id: 'c1',
      classA: 'Media',
      classB: 'Livre',
      correctRelation: 'is-a',
      title: 'Livre & Media',
      justification: 'Un Livre EST véritablement et en tout temps un Média de la médiathèque. Il possède un titre, une année et une description.',
      recommendedDesign: 'class Livre extends Media { constructor(...) { super(...); } }'
    },
    {
      id: 'c2',
      classA: 'Client',
      classB: 'Facture',
      correctRelation: 'has-a',
      title: 'Facture & Client',
      justification: 'Une Facture N\'EST PAS un Client ! Une Facture POSSÈDE une référence vers le Client qui la règle.',
      heresyExplanation: 'Si Facture hérite de Client, une facture peut se connecter, changer son mot de passe ou mettre des articles dans un panier !',
      recommendedDesign: 'class Facture { constructor(public client: Client, public montant: number) {} }'
    },
    {
      id: 'c3',
      classA: 'Moteur',
      classB: 'Voiture',
      correctRelation: 'has-a',
      title: 'Voiture & Moteur',
      justification: 'Une Voiture N\'EST PAS un Moteur ! Une Voiture A un Moteur sous son capot (agrégation de composants).',
      heresyExplanation: 'Si Voiture hérite de Moteur, vous ne pouvez pas changer de moteur (électrique vs thermique) pendant la vie de l\'objet sans détruire la voiture.',
      recommendedDesign: 'class Voiture { constructor(public moteur: Moteur) {} }'
    },
    {
      id: 'c4',
      classA: 'CompteBancaire',
      classB: 'CompteEpargne',
      correctRelation: 'is-a',
      title: 'CompteEpargne & CompteBancaire',
      justification: 'Un Compte Épargne EST un Compte Bancaire spécifique qui obéit aux mêmes opérations (déposer, retirer) avec une règle de taux d\'intérêt additionnelle.',
      recommendedDesign: 'class CompteEpargne extends CompteBancaire { tauxInteret: number; }'
    },
    {
      id: 'c5',
      classA: 'Article',
      classB: 'Panier',
      correctRelation: 'has-a',
      title: 'Panier & Article',
      justification: 'Un Panier N\'EST PAS un Article : un Panier CONTIENT une liste ordonnée d\'articles.',
      recommendedDesign: 'class Panier { articles: Article[] = []; ajouter(a: Article) { ... } }'
    },
    {
      id: 'c6',
      classA: 'Personne',
      classB: 'Employe',
      correctRelation: 'is-a',
      title: 'Employe & Personne',
      justification: 'Un Employé EST une Personne humaine (nom, prénom, date de naissance) engagée dans un contrat de travail (salaire, poste).',
      recommendedDesign: 'class Employe extends Personne { salaire: number; }'
    }
  ]);

  readonly score = computed(() => {
    return this.cards().filter(c => c.userChoice === c.correctRelation).length;
  });

  submitChoice(id: string, choice: 'is-a' | 'has-a'): void {
    this.cards.update(list => 
      list.map(c => c.id === id ? { ...c, userChoice: choice } : c)
    );
  }
}
