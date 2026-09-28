import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavigationService } from './core/services/navigation.service';
import { ControlTowerVsDelegationComponent } from './features/control-tower-vs-delegation/control-tower-vs-delegation.component';
import { RemoteControlAnalogyComponent } from './features/remote-control-analogy/remote-control-analogy.component';
import { LateBindingPrototypesComponent } from './features/late-binding-prototypes/late-binding-prototypes.component';
import { TsViewRestrictorComponent } from './features/ts-view-restrictor/ts-view-restrictor.component';
import { HeterogeneousCollectionsOcpComponent } from './features/heterogeneous-collections-ocp/heterogeneous-collections-ocp.component';
import { InstanceofTypeNarrowingComponent } from './features/instanceof-type-narrowing/instanceof-type-narrowing.component';
import { OopVsDiscriminatedUnionsComponent } from './features/oop-vs-discriminated-unions/oop-vs-discriminated-unions.component';
import { AngularModernMediathequeComponent } from './features/angular-modern-mediatheque/angular-modern-mediatheque.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    ControlTowerVsDelegationComponent,
    RemoteControlAnalogyComponent,
    LateBindingPrototypesComponent,
    TsViewRestrictorComponent,
    HeterogeneousCollectionsOcpComponent,
    InstanceofTypeNarrowingComponent,
    OopVsDiscriminatedUnionsComponent,
    AngularModernMediathequeComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly nav = inject(NavigationService);
}
