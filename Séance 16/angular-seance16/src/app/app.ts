import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 7 modules interactifs de la Séance 16 + le Laboratoire Global
import { RamVsStorageComponent } from './features/ram-vs-storage/ram-vs-storage.component';
import { JsonVsXmlComponent } from './features/json-vs-xml/json-vs-xml.component';
import { StringifyEncapsulationComponent } from './features/stringify-encapsulation/stringify-encapsulation.component';
import { PrototypeCrisisComponent } from './features/prototype-crisis/prototype-crisis.component';
import { DtoStudioComponent } from './features/dto-studio/dto-studio.component';
import { CrashTestsComponent } from './features/crash-tests/crash-tests.component';
import { FilePersistenceComponent } from './features/file-persistence/file-persistence.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    RamVsStorageComponent,
    JsonVsXmlComponent,
    StringifyEncapsulationComponent,
    PrototypeCrisisComponent,
    DtoStudioComponent,
    CrashTestsComponent,
    FilePersistenceComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement de Monaco Editor pour une disponibilité instantanée
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
