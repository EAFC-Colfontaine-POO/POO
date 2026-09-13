import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopService } from '../../core/services/workshop.service';
import { WorkshopRunnerComponent } from '../../shared/components/workshop-runner/workshop-runner.component';

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [CommonModule, WorkshopRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag">Pratique & Entraînement — Ateliers Guidés (Séance 3)</div>
        <h2>8. Espace Ateliers Pratiques (Labo Étudiant avec Monaco Editor)</h2>
        <p class="module-desc">
          Mettez en application directe les notions de la séance sur les 4 ateliers officiels du cours :
          <strong>Atelier 3.1</strong> (Déclaration & Interpolation <code>{{ '{{ }}' }}</code>), 
          <strong>Atelier 3.2</strong> (Compteur interactif & Property Binding <code>[disabled]</code>), 
          <strong>Atelier 3.3</strong> (Arbre de composants & Déclaration Standalone <code>imports: []</code>) et 
          <strong>Atelier 3.4</strong> (Isolation des styles CSS & View Encapsulation).
          Éditez le code dans Monaco Editor, visualisez le rendu en direct et validez automatiquement vos critères !
        </p>
      </div>

      <!-- Runner Monaco Multi-fichiers pour les Ateliers -->
      <app-workshop-runner></app-workshop-runner>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class WorkshopsLabComponent {
  readonly workshopService = inject(WorkshopService);
}
