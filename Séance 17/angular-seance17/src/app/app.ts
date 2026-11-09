import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules interactifs de la Séance 17 + le Laboratoire Global
import { EventLoopClockComponent } from './features/event-loop-clock/event-loop-clock.component';
import { RestProtocolsComponent } from './features/rest-protocols/rest-protocols.component';
import { HttpInfrastructureComponent } from './features/http-infrastructure/http-infrastructure.component';
import { HttpResourceComponent } from './features/http-resource/http-resource.component';
import { ResourceLifecycleComponent } from './features/resource-lifecycle/resource-lifecycle.component';
import { DynamicRequestsComponent } from './features/dynamic-requests/dynamic-requests.component';
import { DtoToEntityComponent } from './features/dto-to-entity/dto-to-entity.component';
import { AntiPatternsComponent } from './features/anti-patterns/anti-patterns.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    EventLoopClockComponent,
    RestProtocolsComponent,
    HttpInfrastructureComponent,
    HttpResourceComponent,
    ResourceLifecycleComponent,
    DynamicRequestsComponent,
    DtoToEntityComponent,
    AntiPatternsComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement de Monaco Editor pour disponibilité instantanée
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
