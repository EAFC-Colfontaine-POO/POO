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
        <h2>Laboratoire Pratique Global — {{ exerciseService.totalCount() }} Exercices d'Entraînement</h2>
        <p class="module-desc">
          Entraînez-vous intensivement sur les 6 ateliers de la Séance 14 avec coloration syntaxique officielle TypeScript,
          autocomplétion en direct, terminal virtuel et validation par suite d'assertions automatisées en mémoire.
        </p>
      </div>

      <!-- Filtres par Labo -->
      <div class="card-panel lab-filter-bar">
        <div class="filter-pills">
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === null" 
            (click)="selectedLab.set(null)"
          >
            Tous ({{ exerciseService.totalCount() }})
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 1" 
            (click)="selectedLab.set(1)"
          >
            Labo 1 · Services &amp; DI (3)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 2" 
            (click)="selectedLab.set(2)"
          >
            Labo 2 · Signaux &amp; Immutabilité (3)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 3" 
            (click)="selectedLab.set(3)"
          >
            Labo 3 · Généricité &lt;T&gt; (3)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 4" 
            (click)="selectedLab.set(4)"
          >
            Labo 4 · Contraintes &amp; Lookups (4)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 5" 
            (click)="selectedLab.set(5)"
          >
            Labo 5 · Repository&lt;T&gt; Universel (3)
          </button>
          <button 
            class="filter-btn" 
            [class.active]="selectedLab() === 6" 
            (click)="selectedLab.set(6)"
          >
            Labo 6 · Spécialisation &amp; Atelier Film (4)
          </button>
        </div>

        <div class="filter-stats">
          <span class="badge badge-success">
            {{ exerciseService.completedCount() }} / {{ exerciseService.totalCount() }} Validés
          </span>
        </div>
      </div>

      <!-- Runner Monaco interactif -->
      <app-lab-runner [defaultLabNumber]="selectedLab()"></app-lab-runner>
    </div>
  `,
  styles: [`
    .lab-filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 10px 16px;
    }

    .filter-pills {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        color: var(--text-main);
        background: var(--bg-card);
      }

      &.active {
        background: var(--ts-blue);
        color: #ffffff;
        border-color: var(--ts-blue);
      }
    }

    .filter-stats {
      font-size: 0.85rem;
    }
  `]
})
export class WorkshopsLabComponent {
  readonly exerciseService = inject(ExerciseService);
  readonly selectedLab = signal<number | null>(null);
}
