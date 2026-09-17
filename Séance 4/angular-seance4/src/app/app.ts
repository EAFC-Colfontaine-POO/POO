import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules + Ateliers de la Séance 4
import { DomOopComponent } from './features/dom-oop/dom-oop.component';
import { SemanticAttributesComponent } from './features/semantic-attributes/semantic-attributes.component';
import { CascadeSpecificityComponent } from './features/cascade-specificity/cascade-specificity.component';
import { BoxModelComponent } from './features/box-model/box-model.component';
import { FlexboxLabComponent } from './features/flexbox-lab/flexbox-lab.component';
import { BootstrapGridComponent } from './features/bootstrap-grid/bootstrap-grid.component';
import { BootstrapComponentsComponent } from './features/bootstrap-components/bootstrap-components.component';
import { AngularIntegrationComponent } from './features/angular-integration/angular-integration.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    DomOopComponent,
    SemanticAttributesComponent,
    CascadeSpecificityComponent,
    BoxModelComponent,
    FlexboxLabComponent,
    BootstrapGridComponent,
    BootstrapComponentsComponent,
    AngularIntegrationComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement préventif de Monaco Editor
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
