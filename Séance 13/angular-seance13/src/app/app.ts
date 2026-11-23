import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavigationService } from './core/services/navigation.service';
import { ZoneVsDagComponent } from './features/zone-vs-dag/zone-vs-dag.component';
import { TrioPrimitivesComponent } from './features/trio-primitives/trio-primitives.component';
import { MemoryImmutabilityComponent } from './features/memory-immutability/memory-immutability.component';
import { ComponentCommComponent } from './features/component-comm/component-comm.component';
import { OopEncapsulationComponent } from './features/oop-encapsulation/oop-encapsulation.component';
import { FritkotDemoComponent } from './features/fritkot-demo/fritkot-demo.component';
import { AntipatternScannerComponent } from './features/antipattern-scanner/antipattern-scanner.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    ZoneVsDagComponent,
    TrioPrimitivesComponent,
    MemoryImmutabilityComponent,
    ComponentCommComponent,
    OopEncapsulationComponent,
    FritkotDemoComponent,
    AntipatternScannerComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly nav = inject(NavigationService);
}
