import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 7 modules interactifs de la Séance 18 + Espace Ateliers Monaco
import { TrilogyHallComponent } from './features/trilogy-hall/trilogy-hall.component';
import { StorageApiComponent } from './features/storage-api/storage-api.component';
import { EventLoopQuotaComponent } from './features/event-loop-quota/event-loop-quota.component';
import { PooClashComponent } from './features/poo-clash/poo-clash.component';
import { MultiTabsComponent } from './features/multi-tabs/multi-tabs.component';
import { PocketNotesComponent } from './features/pocket-notes/pocket-notes.component';
import { FiveMbWallComponent } from './features/five-mb-wall/five-mb-wall.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    TrilogyHallComponent,
    StorageApiComponent,
    EventLoopQuotaComponent,
    PooClashComponent,
    MultiTabsComponent,
    PocketNotesComponent,
    FiveMbWallComponent,
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
