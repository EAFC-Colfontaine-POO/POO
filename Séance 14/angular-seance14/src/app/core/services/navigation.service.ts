import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('memory-simulator');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'memory-simulator',
      index: 1,
      title: "Simulateur Mémoire : new MonService() vs inject(MonService)",
      shortTitle: "new vs inject()",
      icon: "cpu",
      badge: "Tas Mémoire",
      description: "Visualiseur dynamique du Tas Mémoire (Heap) : instanciations isolées vs singleton partagé.",
      labNumber: 1,
      exerciseCount: 3
    },
    {
      id: 'service-anatomy',
      index: 2,
      title: "Anatomie d'un Service Signal-First & Fiche Anti-Bugs",
      shortTitle: "Anatomie Service",
      icon: "shield",
      badge: "4 Piliers",
      description: "Survol guidé des 4 piliers d'un service Angular 22 et reproduction interactive des erreurs NG0203 et .push().",
      labNumber: 2,
      exerciseCount: 3
    },
    {
      id: 'code-dilemma',
      index: 3,
      title: "Le Dilemme du Code : Duplication vs any vs Généricité <T>",
      shortTitle: "Duplication vs any vs <T>",
      icon: "git-branch",
      badge: "Le Choix Pro",
      description: "Comparateur interactif à 3 colonnes : copier-coller vs laxisme any vs rigueur générique.",
      labNumber: 3,
      exerciseCount: 3
    },
    {
      id: 'generic-box',
      index: 4,
      title: "Le Moule à Gâteaux : La classe générique Boite<T>",
      shortTitle: "Boite<T> & Moule",
      icon: "box",
      badge: "TS2345",
      description: "Démonstrateur visuel « Le moule et la pâte » et simulation en direct des erreurs de typage TS2345.",
      labNumber: 3,
      exerciseCount: 3
    },
    {
      id: 'generic-constraints',
      index: 5,
      title: "Le Mur de la Contrainte : Pourquoi <T extends Identifiable> ?",
      shortTitle: "Contrainte extends",
      icon: "lock",
      badge: "TS2339",
      description: "Pourquoi TypeScript refuse l'accès à .id sans contrainte, le contrat structurel et le Lookup Type T['id'].",
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'universal-repository',
      index: 6,
      title: "Le Cœur du Réacteur : Repository<T extends Identifiable>",
      shortTitle: "Repository<T>",
      icon: "database",
      badge: "CRUD Réactif",
      description: "Bac à sable réactif du socle universel combinant Signals, immutabilité et généricité.",
      labNumber: 5,
      exerciseCount: 3
    },
    {
      id: 'media-store-case',
      index: 7,
      title: "L'Atelier d'Architecture MediaStore (Étude de cas)",
      shortTitle: "Architecture MediaStore",
      icon: "layers",
      badge: "Étude de Cas",
      description: "Diagramme d'architecture interactif reliant Contrat, Entités, Repository, Services et Composants.",
      labNumber: 6,
      exerciseCount: 4
    },
    {
      id: 'entity-factory',
      index: 8,
      title: "Live Sandbox : L'Usine à Entités",
      shortTitle: "Usine à Entités",
      icon: "tool",
      badge: "Playground",
      description: "Instanciez dynamiquement un service dérivé de Repository<T> pour n'importe quelle entité personnalisée.",
      exerciseCount: 0
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: "Ateliers Pratiques Monaco Editor (20 Exercices)",
      shortTitle: "Labo Monaco (20 Ex)",
      icon: "terminal",
      badge: "20 Ex",
      description: "Banc d'exercices interactifs avec éditeur Monaco, autocomplétion TypeScript, terminal virtuel et validation automatique."
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(collapsed => !collapsed);
  }
}
