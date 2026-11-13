import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('trilogy-hall');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: readonly ModuleSection[] = [
    {
      id: 'trilogy-hall',
      index: 1,
      title: 'Le Hall de la Trilogie Web (Cookies vs Session vs LocalStorage)',
      shortTitle: 'Trilogie Web',
      icon: 'trilogy',
      badge: 'Les 3 Tiroirs',
      description: 'Comparateur visuel des 3 espaces de stockage, cycle de vie, portée et arbre de décision interactif.'
    },
    {
      id: 'storage-api',
      index: 2,
      title: 'Laboratoire de l\'API Storage & Pièges de Typage',
      shortTitle: 'API & Pièges Typage',
      icon: 'terminal',
      badge: 'Tout est Chaîne',
      description: 'Terminal interactif setItem/getItem et démonstrateur du bug invisible ("false" truthy, concaténation 01).'
    },
    {
      id: 'event-loop-quota',
      index: 3,
      title: 'Simulateur d\'Event Loop & Gestion du Quota',
      shortTitle: 'Event Loop & Quota',
      icon: 'gauge',
      badge: 'Gel Synchrone',
      description: 'Mesure du gel de thread principal (chute de FPS) et crash test QuotaExceededError avec try/catch.'
    },
    {
      id: 'poo-clash',
      index: 4,
      title: 'Le Choc POO : Autopsie du [object Object] & Prototype Perdu',
      shortTitle: 'Le Choc POO',
      icon: 'dto',
      badge: 'La Triade DTO',
      description: 'Autopsie du drame de JSON.parse(), perte de méthodes et réhydratation robuste par la triade DTO / toDTO() / fromDTO().'
    },
    {
      id: 'multi-tabs',
      index: 5,
      title: 'Laboratoire Multi-Onglets (StorageEvent)',
      shortTitle: 'Multi-Onglets',
      icon: 'tabs',
      badge: 'StorageEvent',
      description: 'Simulateur d\'onglets jumeaux A & B : pourquoi l\'événement ne se déclenche que dans les autres fenêtres.'
    },
    {
      id: 'pocket-notes',
      index: 6,
      title: 'Application Témoin Intégrée : PocketNotes (Signal-First)',
      shortTitle: 'PocketNotes',
      icon: 'notes',
      badge: 'Service Angular 22',
      description: 'Service Signal-First complet avec audit POO temps réel, résilience SSR et crash test par corruption JSON.'
    },
    {
      id: 'five-mb-wall',
      index: 7,
      title: 'Le Mur des 5 Mo & Pont vers la Séance 19',
      shortTitle: 'Le Mur des 5 Mo',
      icon: 'wall',
      badge: 'Vers IndexedDB',
      description: 'Synthèse des 3 limites physiques de LocalStorage et teaser comparatif avec IndexedDB & Dexie.js.'
    },
    {
      id: 'workshops-lab',
      index: 8,
      title: 'Espace Ateliers Pratiques (Monaco Editor)',
      shortTitle: 'Ateliers Monaco',
      icon: 'lab',
      badge: '19 Micro-Défis',
      description: 'Entraînement guidé sur 5 labos progressifs avec validation automatique par expressions régulières et exécution locale.'
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(c => !c);
  }
}
