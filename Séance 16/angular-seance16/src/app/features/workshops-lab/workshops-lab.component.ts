import { Component, signal, inject } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header card-panel">
        <div class="module-tag">ESPACE ATELIERS · MONACO EDITOR</div>
        <h2>Laboratoire Pratique Global — {{ exerciseService.totalCount() }} Exercices d'Entraînement</h2>
        <p class="module-desc">
          Entraînez-vous intensivement sur les 13 défis progressifs de la Séance 16 avec coloration syntaxique officielle TypeScript,
          autocomplétion, console virtuelle interactive et validation par suite d'assertions automatisées.
        </p>

        <!-- Filtres par Labo -->
        <div class="lab-filter-bar">
          <div class="filter-pills">
            <button 
              class="filter-btn" 
              [class.active]="selectedLab() === null" 
              (click)="selectLab(null)"
            >
              Tous ({{ exerciseService.totalCount() }})
            </button>
            <button 
              class="filter-btn" 
              [class.active]="selectedLab() === 1" 
              (click)="selectLab(1)"
            >
              Labo 1 · Syntaxe JSON &amp; DOMParser (3)
            </button>
            <button 
              class="filter-btn" 
              [class.active]="selectedLab() === 2" 
              (click)="selectLab(2)"
            >
              Labo 2 · stringify, replacer &amp; toJSON (3)
            </button>
            <button 
              class="filter-btn" 
              [class.active]="selectedLab() === 3" 
              (click)="selectLab(3)"
            >
              Labo 3 · Prototype Perdu &amp; Pièges (3)
            </button>
            <button 
              class="filter-btn" 
              [class.active]="selectedLab() === 4" 
              (click)="selectLab(4)"
            >
              Labo 4 · Patron DTO &amp; fromDTO() (4)
            </button>
          </div>

          <div class="global-counter">
            <span class="badge badge-success">
              {{ exerciseService.completedCount() }} / {{ exerciseService.totalCount() }} Validés ({{ exerciseService.progressPercentage() }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Runner Monaco -->
      <div class="runner-wrapper">
        <app-lab-runner [labFilter]="selectedLab()"></app-lab-runner>
      </div>
    </div>
  `,
  styles: [`
    .lab-filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      gap: 12px;
      flex-wrap: wrap;

      .filter-pills {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        flex: 1;

        .filter-btn {
          padding: 6px 12px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;

          &:hover {
            background: var(--bg-card-hover);
            color: var(--text-main);
          }

          &.active {
            background: #9333ea;
            border-color: #a855f7;
            color: #ffffff;
            font-weight: 600;
          }
        }
      }
    }

    .runner-wrapper {
      flex: 1;
      min-height: 580px;
    }
  `]
})
export class WorkshopsLabComponent {
  readonly exerciseService = inject(ExerciseService);
  readonly selectedLab = signal<number | null>(null);

  constructor() {
    const f = this.exerciseService.filterLab();
    if (f !== null) {
      this.selectedLab.set(f);
    }
  }

  selectLab(lab: number | null): void {
    this.selectedLab.set(lab);
    this.exerciseService.setFilterLab(lab);
  }
}
