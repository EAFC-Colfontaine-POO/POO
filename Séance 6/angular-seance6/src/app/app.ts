import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavigationService } from './core/services/navigation.service';
import { DryProblemComponent } from './features/dry-problem/dry-problem.component';
import { IsAVsHasAComponent } from './features/is-a-vs-has-a/is-a-vs-has-a.component';
import { ConstructorSuperComponent } from './features/constructor-super/constructor-super.component';
import { ProtectedEncapsulationComponent } from './features/protected-encapsulation/protected-encapsulation.component';
import { OverrideEnrichmentComponent } from './features/override-enrichment/override-enrichment.component';
import { FragileBaseClassComponent } from './features/fragile-base-class/fragile-base-class.component';
import { AngularMediathequeComponent } from './features/angular-mediatheque/angular-mediatheque.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    DryProblemComponent,
    IsAVsHasAComponent,
    ConstructorSuperComponent,
    ProtectedEncapsulationComponent,
    OverrideEnrichmentComponent,
    FragileBaseClassComponent,
    AngularMediathequeComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly nav = inject(NavigationService);
}
