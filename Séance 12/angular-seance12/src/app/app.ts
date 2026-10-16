import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavigationService } from './core/services/navigation.service';
import { MemoryModelIdentityComponent } from './features/memory-model-identity/memory-model-identity.component';
import { BusinessEqualityEqualsComponent } from './features/business-equality-equals/business-equality-equals.component';
import { CloningShallowVsDeepComponent } from './features/cloning-shallow-vs-deep/cloning-shallow-vs-deep.component';
import { ImmutabilityValueObjectsComponent } from './features/immutability-value-objects/immutability-value-objects.component';
import { AngularSignalsMemoryComponent } from './features/angular-signals-memory/angular-signals-memory.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    MemoryModelIdentityComponent,
    BusinessEqualityEqualsComponent,
    CloningShallowVsDeepComponent,
    ImmutabilityValueObjectsComponent,
    AngularSignalsMemoryComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly nav = inject(NavigationService);
}
