import { Component, inject, signal } from '@angular/core';
import { ExerciseService } from '../../core/services/exercise.service';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-exercises-lab',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Studio Pratique — Banc d'Entraînement Intensif</div>
        <h2>Les 27 Micro-Exercices TypeScript (Labos 1 à 6)</h2>
        <p class="module-desc">
          Entraînez-vous intensivement sur toutes les notions de la Séance 2 avec Monaco Editor.
          Chaque micro-exercice est court, ciblé et progressif pour vous donner confiance.
          Éditez le code, testez vos <code>console.log()</code> dans la console virtuelle et validez automatiquement vos critères !
        </p>
      </div>

      <!-- Filtres par Laboratoire -->
      <div class="labs-filter-bar card-panel">
        <div class="filter-label">Filtrer par Laboratoire :</div>
        <div class="filter-buttons">
          <button 
            class="filter-pill" 
            [class.active]="selectedLab() === null"
            (click)="selectLab(null)"
          >
            Tous les Ateliers (27)
          </button>
          <button 
            class="filter-pill" 
            [class.active]="selectedLab() === 1"
            (click)="selectLab(1)"
          >
            Labo 1 : Types & Inférence (5)
          </button>
          <button 
            class="filter-pill" 
            [class.active]="selectedLab() === 2"
            (click)="selectLab(2)"
          >
            Labo 2 : Scope & TDZ (4)
          </button>
          <button 
            class="filter-pill" 
            [class.active]="selectedLab() === 3"
            (click)="selectLab(3)"
          >
            Labo 3 : Contrôle de Flux (4)
          </button>
          <button 
            class="filter-pill" 
            [class.active]="selectedLab() === 4"
            (click)="selectLab(4)"
          >
            Labo 4 : Fonctions (5)
          </button>
          <button 
            class="filter-pill" 
            [class.active]="selectedLab() === 5"
            (click)="selectLab(5)"
          >
            Labo 5 : Tableaux & Tuples (4)
          </button>
          <button 
            class="filter-pill" 
            [class.active]="selectedLab() === 6"
            (click)="selectLab(6)"
          >
            Labo 6 : Objets & Duck Typing (5)
          </button>
        </div>

        <div class="global-counter">
          <span class="badge badge-success">{{ exercisesService.completedCount() }} / {{ exercisesService.totalCount() }} Validés ({{ exercisesService.progressPercentage() }}%)</span>
        </div>
      </div>

      <!-- Runner Monaco -->
      <app-lab-runner [targetLabNumber]="selectedLab() || undefined"></app-lab-runner>
    </div>
  `,
  styles: [`
    .labs-filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 16px;
      flex-wrap: wrap;
    }

    .filter-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-dim);
    }

    .filter-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      flex: 1;
    }

    .filter-pill {
      padding: 5px 12px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 500;

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
  `]
})
export class ExercisesLabComponent {
  readonly exercisesService = inject(ExerciseService);
  readonly selectedLab = signal<number | null>(null);

  selectLab(lab: number | null): void {
    this.selectedLab.set(lab);
  }
}
