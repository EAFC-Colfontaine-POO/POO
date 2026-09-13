import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules de la Séance 3
import { MpaVsSpaComponent } from './features/mpa-vs-spa/mpa-vs-spa.component';
import { TreeExplorerComponent } from './features/tree-explorer/tree-explorer.component';
import { BootstrapFlowComponent } from './features/bootstrap-flow/bootstrap-flow.component';
import { StandaloneAnatomyComponent } from './features/standalone-anatomy/standalone-anatomy.component';
import { TemplateBindingsComponent } from './features/template-bindings/template-bindings.component';
import { ViewEncapsulationComponent } from './features/view-encapsulation/view-encapsulation.component';
import { CliTerminalComponent } from './features/cli-terminal/cli-terminal.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    MpaVsSpaComponent,
    TreeExplorerComponent,
    BootstrapFlowComponent,
    StandaloneAnatomyComponent,
    TemplateBindingsComponent,
    ViewEncapsulationComponent,
    CliTerminalComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement immédiat de Monaco Editor pour une disponibilité instantanée
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
