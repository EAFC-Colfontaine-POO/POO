import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules interactifs de la Séance 14 + le Laboratoire Global
import { MemorySimulatorComponent } from './features/memory-simulator/memory-simulator.component';
import { ServiceAnatomyComponent } from './features/service-anatomy/service-anatomy.component';
import { CodeDilemmaComponent } from './features/code-dilemma/code-dilemma.component';
import { GenericBoxComponent } from './features/generic-box/generic-box.component';
import { GenericConstraintsComponent } from './features/generic-constraints/generic-constraints.component';
import { UniversalRepositoryComponent } from './features/universal-repository/universal-repository.component';
import { MediaStoreCaseComponent } from './features/media-store-case/media-store-case.component';
import { EntityFactoryComponent } from './features/entity-factory/entity-factory.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    MemorySimulatorComponent,
    ServiceAnatomyComponent,
    CodeDilemmaComponent,
    GenericBoxComponent,
    GenericConstraintsComponent,
    UniversalRepositoryComponent,
    MediaStoreCaseComponent,
    EntityFactoryComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement de Monaco Editor pour une disponibilité immédiate dans les labos
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
