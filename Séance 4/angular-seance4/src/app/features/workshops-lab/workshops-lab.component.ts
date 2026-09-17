import { Component, signal, inject, computed } from '@angular/core';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';
import { ExerciseService } from '../../core/services/exercise.service';

interface LabInfo {
  num: number;
  title: string;
  badge: string;
  count: number;
}

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Espace Ateliers Pratiques</span>
          <span class="badge badge-purple">Monaco Studio</span>
          <span class="badge badge-success">{{ exerciseService.completedCount() }} / {{ exerciseService.totalCount() }} Validés</span>
        </div>
        <h2>9. Espace Ateliers Pratiques (22 Défis de Programmation Web)</h2>
        <p class="module-desc">
          Banc d'entraînement intensif avec éditeur Monaco (HTML/CSS), bac à sable d'exécution en direct avec Bootstrap 5.3 et moteur de validation automatique par analyse du DOM.
        </p>

        <!-- Sélecteur des 5 Laboratoires -->
        <div class="labs-selector-row mt-2">
          @for (lab of labs; track lab.num) {
            <button 
              class="lab-tab-btn" 
              [class.active]="activeLab() === lab.num"
              (click)="activeLab.set(lab.num)"
            >
              <div class="lab-btn-num">Labo {{ lab.num }}</div>
              <div class="lab-btn-info">
                <span class="lab-btn-title">{{ lab.title }}</span>
                <span class="lab-btn-ratio">
                  {{ getLabCompleted(lab.num) }}/{{ lab.count }} Validés
                </span>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Runner Monaco & Live Preview -->
      <div class="lab-runner-frame">
        <app-code-runner [labNumber]="activeLab()"></app-code-runner>
      </div>
    </div>
  `,
  styles: [`
    .labs-selector-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;

      @media (max-width: 1100px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 700px) {
        grid-template-columns: 1fr;
      }
    }

    .lab-tab-btn {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-card-hover);
        border-color: #7952b3;
      }

      &.active {
        background: rgba(121, 82, 179, 0.15);
        border-color: #7952b3;
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.3);

        .lab-btn-num { color: #c4b5fd; font-weight: 800; }
        .lab-btn-title { color: var(--text-main); font-weight: 700; }
      }

      .lab-btn-num {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .lab-btn-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .lab-btn-title {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lab-btn-ratio {
        font-size: 0.7rem;
        color: #10b981;
        font-weight: 600;
      }
    }

    .lab-runner-frame {
      flex: 1;
      min-height: 600px;
    }
  `]
})
export class WorkshopsLabComponent {
  readonly exerciseService = inject(ExerciseService);
  readonly activeLab = signal<number>(1);

  readonly labs: LabInfo[] = [
    { num: 1, title: 'Sémantique & DOM', badge: 'HTML & DOM', count: 4 },
    { num: 2, title: 'Sélecteurs & Box Model', badge: 'CSS & Box', count: 4 },
    { num: 3, title: 'Flexbox en Pratique', badge: 'Flexbox 1D', count: 4 },
    { num: 4, title: 'Grille Bootstrap', badge: 'Grille 12 Col', count: 5 },
    { num: 5, title: 'Composants & Spacing', badge: 'Boutons/Cards', count: 5 }
  ];

  getLabCompleted(labNum: number): number {
    return this.exerciseService.getExercisesByLab(labNum).filter(e => e.isCompleted).length;
  }
}
