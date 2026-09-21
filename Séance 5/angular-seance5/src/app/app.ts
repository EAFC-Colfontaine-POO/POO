import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules interactifs de la Séance 5 + le Laboratoire Global
import { MemoryVisualizerComponent } from './features/memory-model/memory-visualizer.component';
import { AliasingVisualizerComponent } from './features/aliasing-pitfall/aliasing-visualizer.component';
import { ConstructionSiteComponent } from './features/class-vs-instance/construction-site.component';
import { InstanceVsStaticInspectorComponent } from './features/instance-vs-static/instance-vs-static-inspector.component';
import { CrashTestBankComponent } from './features/encapsulation-invariants/crash-test-bank.component';
import { SyntaxDeconstructorComponent } from './features/visibility-parameter-properties/syntax-deconstructor.component';
import { ThermostatRectangleWorkbenchComponent } from './features/getters-setters-tell-dont-ask/thermostat-rectangle-workbench.component';
import { SolarSystemEnumComponent } from './features/advanced-mechanisms/solar-system-enum.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    MemoryVisualizerComponent,
    AliasingVisualizerComponent,
    ConstructionSiteComponent,
    InstanceVsStaticInspectorComponent,
    CrashTestBankComponent,
    SyntaxDeconstructorComponent,
    ThermostatRectangleWorkbenchComponent,
    SolarSystemEnumComponent,
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
