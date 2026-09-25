import { Component, signal, computed, inject } from '@angular/core';
import { ExerciseService } from '../../core/services/exercise.service';
import { CodeRunnerComponent } from '../../shared/components/code-runner/code-runner.component';

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [CodeRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="badge badge-purple">Ateliers Pratiques</span>
          <span class="badge badge-bootstrap">Playground Monaco & Console</span>
        </div>
        <h2>Laboratoire d'Entraînement Intensif : 17 Micro-Exercices</h2>
        <p class="module-desc">
          Mettez en pratique chaque concept de la séance 6 : déclaration <code>extends</code>, ordre impératif de <code>super()</code>, étanchéité de <code>protected</code>, sécurité de <code>override</code>, refactoring de composition et typage de Signals Angular.
        </p>
      </div>

      <!-- Filtres de Laboratoires -->
      <div class="lab-filters card-panel">
        <div class="filters-scroll">
          <button 
            class="filter-pill"
            [class.active]="selectedLab() === 0"
            (click)="setLab(0)"
          >
            <span class="pill-name">Tous les Exercices</span>
            <span class="pill-count">{{ exercisesService.completedCount() }}/{{ exercisesService.totalCount() }}</span>
          </button>

          @for (lab of labs; track lab.num) {
            <button 
              class="filter-pill"
              [class.active]="selectedLab() === lab.num"
              (click)="setLab(lab.num)"
            >
              <span class="pill-badge">Labo {{ lab.num }}</span>
              <span class="pill-name">{{ lab.title }}</span>
              <span class="pill-count" [class.all-done]="getLabCompletedCount(lab.num) === lab.count">
                {{ getLabCompletedCount(lab.num) }}/{{ lab.count }}
              </span>
            </button>
          }
        </div>
      </div>

      <!-- Runner Monaco Interactif -->
      <app-code-runner [filterLabNumber]="selectedLab() === 0 ? undefined : selectedLab()"></app-code-runner>
    </div>
  `,
  styles: [`
    .lab-filters {
      padding: 10px 14px;
    }

    .filters-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.78rem;
      white-space: nowrap;
      font-weight: 600;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--bs-purple);
        color: #ffffff;
        border-color: var(--bs-purple-light);
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.4);

        .pill-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      }

      .pill-badge {
        font-size: 0.68rem;
        background: rgba(121, 82, 179, 0.15);
        color: #c4b5fd;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .pill-count {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        background: var(--bg-card);
        padding: 2px 6px;
        border-radius: 10px;
        color: var(--text-dim);

        &.all-done {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-weight: 700;
        }
      }
    }
  `]
})
export class WorkshopsLabComponent {
  readonly exercisesService = inject(ExerciseService);
  readonly selectedLab = signal<number>(0);

  readonly labs = [
    { num: 1, title: 'Sous-classe & super()', count: 4 },
    { num: 2, title: 'Encapsulation & protected', count: 3 },
    { num: 3, title: 'override & super.methode()', count: 4 },
    { num: 4, title: 'Discernement « Est-un » vs « A-un »', count: 3 },
    { num: 5, title: 'Intégration Angular & Signals', count: 3 }
  ];

  setLab(labNum: number): void {
    this.selectedLab.set(labNum);
  }

  getLabCompletedCount(labNum: number): number {
    return this.exercisesService.exercises()
      .filter(e => e.labNumber === labNum && e.isCompleted).length;
  }
}
