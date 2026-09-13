import { Injectable, signal } from '@angular/core';
import { ModuleSection, TabId } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly modules: ModuleSection[] = [
    {
      id: 'mpa-vs-spa',
      index: 1,
      title: "1. Architecture Web : MPA vs SPA",
      shortTitle: 'MPA vs SPA (Architecture)',
      icon: 'network',
      badge: 'Simulateur Réseau',
      description: 'Comparateur interactif de flux HTTP/JSON, simulation de rechargement complet (flash blanc) vs routage client SPA instantané, et matrice dynamique des avantages & compromis.'
    },
    {
      id: 'tree-explorer',
      index: 2,
      title: "2. Arborescence & Fichiers Clés du CLI",
      shortTitle: 'Arborescence & Fichiers Clés',
      icon: 'folder',
      badge: 'Tree-view Interactif',
      description: 'Explorateur complet de l\'arborescence standard générée par le CLI Angular (v21/22), inspecteur de rôle architectural côte à côte et coloration syntaxique.'
    },
    {
      id: 'bootstrap-flow',
      index: 3,
      title: "3. Cycle d'Amorçage (Bootstrap Flow)",
      shortTitle: 'Cycle d\'Amorçage (Bootstrap)',
      icon: 'cpu',
      badge: 'Stepper 4 Étapes',
      description: 'Visualiseur séquentiel pas-à-pas du démarrage : réception du squelette index.html, exécution de main.ts, bootstrapApplication et hydratation du DOM <app-root>.'
    },
    {
      id: 'standalone-anatomy',
      index: 4,
      title: "4. Anatomie d'un Composant Standalone",
      shortTitle: 'Composant Standalone & Rayons X',
      icon: 'box',
      badge: 'Mode Rayons X',
      description: 'Déconstructeur interactif du décorateur @Component (selector, standalone, imports, template, styles), classe TypeScript et liaison visuelle en mode rayons X.'
    },
    {
      id: 'template-bindings',
      index: 5,
      title: "5. Bac à Sable des Liaisons de Données",
      shortTitle: 'Liaisons de Données (Bindings)',
      icon: 'zap',
      badge: 'Playground Tri-Vue',
      description: 'Laboratoire d\'expérimentation des 3 liaisons fondamentales : interpolation {{ }}, liaison de propriété [prop]="val" et liaison d\'événement (event)="action()".'
    },
    {
      id: 'view-encapsulation',
      index: 6,
      title: "6. Encapsulation des Styles CSS",
      shortTitle: 'Encapsulation CSS & Scopage',
      icon: 'shield',
      badge: 'Laboratoire de Styles',
      description: 'Démonstration du scopage CSS Angular : imperméabilité des styles du sous-composant, analyse des attributs générés _ngcontent, et comparaison Emulated vs None vs ShadowDom.'
    },
    {
      id: 'cli-terminal',
      index: 7,
      title: "7. Console Virtuelle du CLI Angular",
      shortTitle: 'Console Virtuelle CLI (@angular/cli)',
      icon: 'terminal',
      badge: 'Terminal Interactif',
      description: 'Simulateur de terminal en ligne de commande pour manipuler ng serve (avec Live Reload), ng generate component (arborescence des 4 fichiers) et ng build (dossier dist/).'
    },
    {
      id: 'workshops-lab',
      index: 8,
      title: "8. Espace Ateliers Pratiques (Monaco Editor)",
      shortTitle: 'Ateliers Pratiques (4 Défis)',
      icon: 'code',
      badge: 'Monaco Studio',
      workshopCount: 4,
      description: 'Studio d\'exercices guidés du cours : Atelier 3.1 (Interpolation), 3.2 (Compteur & Binding), 3.3 (Arbre de composants) et 3.4 (Isolation CSS) avec Monaco Editor et validation.'
    }
  ];

  readonly activeTab = signal<TabId>('mpa-vs-spa');
  readonly isSidebarCollapsed = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as TabId;
      if (this.modules.some(m => m.id === hash)) {
        this.activeTab.set(hash);
      }
    }
  }

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(val => !val);
  }
}
