import { Component, signal, inject } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';
import { ExerciseService } from '../../core/services/exercise.service';

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">ESPACE ATELIERS · MONACO EDITOR</div>
        <h2>Laboratoire Pratique Global — 26 Micro-Exercices d'Entraînement</h2>
        <p class="module-desc">
          Entraînez-vous sur les 26 micro-défis progressifs avec coloration syntaxique officielle TypeScript, autocomplétion, console virtuelle interactive et validation par suite de tests unitaires automatisés.
        </p>
      </div>

      <!-- Filtres par Labo -->
      <div class="card-panel lab-filter-bar">
        <div class="filter-pills">
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === undefined" 
            (click)="selectedLab.set(undefined)"
          >
            Tous les défis (26)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 1" 
            (click)="selectedLab.set(1)"
          >
            Labo 1 · Pile, Tas &amp; Aliasing (4)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 2" 
            (click)="selectedLab.set(2)"
          >
            Labo 2 · Invariants &amp; Constructeur (5)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 3" 
            (click)="selectedLab.set(3)"
          >
            Labo 3 · Parameter Properties (4)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 4" 
            (click)="selectedLab.set(4)"
          >
            Labo 4 · Getters &amp; Tell Don't Ask (5)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 5" 
            (click)="selectedLab.set(5)"
          >
            Labo 5 · Instance vs Static (4)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 6" 
            (click)="selectedLab.set(6)"
          >
            Labo 6 · Fabriques &amp; Enums (4)
          </button>
        </div>

        <div class="global-counter">
          <span class="badge badge-success">{{ exerciseService.completedCount() }} / {{ exerciseService.totalCount() }} Validés ({{ exerciseService.progressPercentage() }}%)</span>
        </div>
      </div>

      <!-- Runner Monaco -->
      <div class="runner-wrapper">
        <app-lab-runner [labNumber]="selectedLab()"></app-lab-runner>
      </div>
    </div>
  `,
  styles: [`
    .lab-filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
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
            background: var(--ts-blue);
            color: #ffffff;
            border-color: var(--ts-blue);
            font-weight: 600;
          }
        }
      }
    }

    .runner-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 580px;
    }
  `]
})
export class WorkshopsLabComponent {
  readonly exerciseService = inject(ExerciseService);
  readonly selectedLab = signal<number | undefined>(undefined);
}
