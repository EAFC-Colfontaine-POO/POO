import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules interactifs de la Séance 19 + Espace Ateliers Monaco
import { ImpedanceMismatchComponent } from './features/impedance-mismatch/impedance-mismatch.component';
import { TypedDatabaseComponent } from './features/typed-database/typed-database.component';
import { BtreeIndexesComponent } from './features/btree-indexes/btree-indexes.component';
import { FluentApiComponent } from './features/fluent-api/fluent-api.component';
import { AcidTransactionsComponent } from './features/acid-transactions/acid-transactions.component';
import { SchemaMigrationsComponent } from './features/schema-migrations/schema-migrations.component';
import { AntiPatternsComponent } from './features/anti-patterns/anti-patterns.component';
import { BibliotechDemoComponent } from './features/bibliotech-demo/bibliotech-demo.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    ImpedanceMismatchComponent,
    TypedDatabaseComponent,
    BtreeIndexesComponent,
    FluentApiComponent,
    AcidTransactionsComponent,
    SchemaMigrationsComponent,
    AntiPatternsComponent,
    BibliotechDemoComponent,
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
