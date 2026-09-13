import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules thématiques de la Séance 2
import { TypeErasureComponent } from './features/type-erasure/type-erasure.component';
import { ToolingCliComponent } from './features/tooling-cli/tooling-cli.component';
import { TypesPrimitivesComponent } from './features/types-primitives/types-primitives.component';
import { ScopeMutabilityComponent } from './features/scope-mutability/scope-mutability.component';
import { FlowOperatorsComponent } from './features/flow-operators/flow-operators.component';
import { FunctionsComponent } from './features/functions/functions.component';
import { ArraysTuplesComponent } from './features/arrays-tuples/arrays-tuples.component';
import { ObjectsInterfacesComponent } from './features/objects-interfaces/objects-interfaces.component';
import { ExercisesLabComponent } from './features/exercises-lab/exercises-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    TypeErasureComponent,
    ToolingCliComponent,
    TypesPrimitivesComponent,
    ScopeMutabilityComponent,
    FlowOperatorsComponent,
    FunctionsComponent,
    ArraysTuplesComponent,
    ObjectsInterfacesComponent,
    ExercisesLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement immédiat de Monaco Editor pour éviter tout blocage de chargement
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
