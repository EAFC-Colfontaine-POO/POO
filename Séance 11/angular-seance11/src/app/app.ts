import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 6 modules interactifs majeurs de la Séance 11 + Espace Ateliers
import { CriseMaintenanceComponent } from './features/01-crise-maintenance/crise-maintenance.component';
import { SrpSingleResponsibilityComponent } from './features/02-srp-single-responsibility/srp-single-responsibility.component';
import { OcpOpenClosedComponent } from './features/03-ocp-open-closed/ocp-open-closed.component';
import { DipDependencyInversionComponent } from './features/04-dip-dependency-inversion/dip-dependency-inversion.component';
import { DipAngularTestingComponent } from './features/05-dip-angular-testing/dip-angular-testing.component';
import { SynergieSodArbitrageComponent } from './features/06-synergie-sod-arbitrage/synergie-sod-arbitrage.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    CriseMaintenanceComponent,
    SrpSingleResponsibilityComponent,
    OcpOpenClosedComponent,
    DipDependencyInversionComponent,
    DipAngularTestingComponent,
    SynergieSodArbitrageComponent,
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
