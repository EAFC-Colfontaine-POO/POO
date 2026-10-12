import { Component, signal, inject } from '@angular/core';
import { ExerciseService } from '../../core/services/exercise.service';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 11 · Ateliers Pratiques</span>
          <span class="badge badge-purple">Monaco Editor</span>
          <span class="badge badge-success">{{ exercises.completedCount() }} / {{ exercises.totalCount() }} Validés</span>
          @if (exercises.completedCount() > 0) {
            <button class="reset-all-link" (click)="onResetAll()" title="Réinitialiser l'ensemble des 14 ateliers">
              🔄 Remettre à zéro
            </button>
          }
        </div>
        <h2>Espace Ateliers Pratiques (14 Défis d'Architecture SOLID)</h2>
        <p class="module-desc">
          Mettez en pratique les 3 piliers structurants du Clean Code : le découplage des responsabilités (<strong>SRP</strong>),
          l'extensibilité par patron Stratégie (<strong>OCP</strong>), et l'injection d'interfaces sans <code>new</code> (<strong>DIP</strong>).
          Révisez vos solutions en direct dans l'éditeur et observez les assertions en mémoire.
        </p>

        <!-- Filtre des 4 Labos -->
        <div class="lab-filters-bar mt-2">
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === undefined"
            (click)="selectedLab.set(undefined)"
          >
            🌟 Tous les Labos (14 Défis)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 1"
            (click)="selectedLab.set(1)"
          >
            Labo 1 : Responsabilité Unique (SRP) (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 2"
            (click)="selectedLab.set(2)"
          >
            Labo 2 : Ouvert / Fermé (OCP) (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 3"
            (click)="selectedLab.set(3)"
          >
            Labo 3 : Inversion de Dépendance (DIP) (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 4"
            (click)="selectedLab.set(4)"
          >
            Labo 4 : Défi Synthèse SOLID (2 ex)
          </button>
        </div>
      </div>

      <div class="runner-wrapper">
        <app-lab-runner [filterLabNumber]="selectedLab()"></app-lab-runner>
      </div>
    </div>
  `,
  styles: [`
    .reset-all-link {
      background: none;
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #f87171;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(239, 68, 68, 0.15);
        border-color: #ef4444;
      }
    }

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
        background: var(--accent-indigo);
        color: #ffffff;
        border-color: #818cf8;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
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

  onResetAll(): void {
    if (typeof window !== 'undefined' && window.confirm('Êtes-vous sûr de vouloir réinitialiser l\'ensemble des 14 ateliers ? Vos codes et validations seront réinitialisés.')) {
      this.exercises.resetAllExercises();
    }
  }
}
