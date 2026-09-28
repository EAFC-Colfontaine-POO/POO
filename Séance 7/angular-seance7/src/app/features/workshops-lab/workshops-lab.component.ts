import { Component, signal, inject } from '@angular/core';
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
          <span class="module-tag">Séance 7 · Labo Pratique</span>
          <span class="badge badge-purple">Monaco Editor</span>
          <span class="badge badge-success">{{ exercises.completedCount() }} / {{ exercises.totalCount() }} Validés</span>
        </div>
        <h2>Espace Ateliers Pratiques (25 Micro-Exercices d'Entraînement)</h2>
        <p class="module-desc">
          Entraînez-vous à la programmation orientée objet polymorphe en écrivant et en exécutant votre code dans Monaco Editor avec autocomplétion TypeScript et validation automatisée en direct.
        </p>

        <!-- Filtre des 6 Labos -->
        <div class="lab-filters-bar mt-2">
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === undefined"
            (click)="selectedLab.set(undefined)"
          >
            🌟 Tous les Labos (25 Défis)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 1"
            (click)="selectedLab.set(1)"
          >
            Labo 1 : Du Code Rigide au Polymorphisme (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 2"
            (click)="selectedLab.set(2)"
          >
            Labo 2 : Types Statiques vs Dynamiques (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 3"
            (click)="selectedLab.set(3)"
          >
            Labo 3 : Collections & OCP (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 4"
            (click)="selectedLab.set(4)"
          >
            Labo 4 : instanceof & Narrowing (5 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 5"
            (click)="selectedLab.set(5)"
          >
            Labo 5 : Unions & never (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 6"
            (click)="selectedLab.set(6)"
          >
            Labo 6 : Architecture Angular (4 ex)
          </button>
        </div>
      </div>

      <div class="runner-wrapper">
        <app-code-runner [filterLabNumber]="selectedLab()"></app-code-runner>
      </div>
    </div>
  `,
  styles: [`
    .lab-filters-bar {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .lab-tab-btn {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--bs-purple);
        color: #ffffff;
        border-color: var(--bs-purple-light);
        box-shadow: 0 2px 8px rgba(121, 82, 179, 0.35);
      }
    }

    .runner-wrapper {
      flex: 1;
      min-height: 0;
    }
  `]
})
export class WorkshopsLabComponent {
  readonly exercises = inject(ExerciseService);
  readonly selectedLab = signal<number | undefined>(undefined);
}
