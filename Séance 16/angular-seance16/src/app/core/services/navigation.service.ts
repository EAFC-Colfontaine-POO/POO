import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('ram-vs-storage');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'ram-vs-storage',
      index: 1,
      title: 'Mémoire Vive vs Persistance & L\'Armoire IKEA',
      shortTitle: 'RAM vs Stockage & IKEA',
      icon: 'box',
      badge: 'Bases & Tas',
      description: 'Frontière physique entre le tas (Heap) de la RAM et le flux linéaire 1D. Métaphore de l\'armoire en kit IKEA et Bilan des Pertes (Survie vs Mort).',
      labNumber: 1,
      exerciseCount: 3
    },
    {
      id: 'json-vs-xml',
      index: 2,
      title: 'L\'Arène des Formats : JSON vs XML',
      shortTitle: 'JSON vs XML & DOMParser',
      icon: 'file-code',
      badge: 'Duel Formats',
      description: 'Comparateur côte-à-côte avec métriques d\'octets en direct. Laboratoire DOMParser avec détection de <parsererror> et Mini-jeu RFC 8259.',
      labNumber: 1,
      exerciseCount: 3
    },
    {
      id: 'stringify-encapsulation',
      index: 3,
      title: 'Laboratoire JSON.stringify & Encapsulation',
      shortTitle: 'JSON.stringify & toJSON',
      icon: 'sliders',
      badge: 'Paramètres Avancés',
      description: 'Contrôle du formatage (space), replacer en liste blanche ou fonctionnel, et encapsulation avec la méthode magique toJSON() de classe.',
      labNumber: 2,
      exerciseCount: 3
    },
    {
      id: 'prototype-crisis',
      index: 4,
      title: 'Le Drame du Prototype Perdu',
      shortTitle: 'Le Prototype Perdu (Cast)',
      icon: 'alert-triangle',
      badge: 'Illusion du Cast',
      description: 'Pourquoi le cast naïf `as Classe` échoue, simulation du crash TypeError runtime, et dangers de Object.setPrototypeOf().',
      labNumber: 3,
      exerciseCount: 3
    },
    {
      id: 'dto-studio',
      index: 5,
      title: 'Le Studio DTO & La Fabrique fromDTO()',
      shortTitle: 'Studio DTO & fromDTO()',
      icon: 'git-merge',
      badge: 'Patron Clé POO',
      description: 'Pipeline interactif en 7 étapes : Entité Métier ➔ toDTO() ➔ JSON ➔ fromDTO(). Validation des invariants et protection de l\'intégrité.',
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'crash-tests',
      index: 6,
      title: 'Salle des Crash-Tests (Anti-Patterns)',
      shortTitle: 'Crash-Tests & Anti-Patterns',
      icon: 'zap-off',
      badge: 'Pièges Fréquents',
      description: 'Simulateur de références circulaires parent/enfant, piège de la Date fantôme et solutions par reviver ou DTO.',
      labNumber: 3,
      exerciseCount: 3
    },
    {
      id: 'file-persistence',
      index: 7,
      title: 'Démonstrateur Persistance Fichier Web',
      shortTitle: 'Persistance Fichier Web',
      icon: 'hard-drive',
      badge: 'File System API',
      description: 'Sandbox Web vs Desktop. Démonstrateur interactif avec showOpenFilePicker() et showSaveFilePicker() sous Signal Angular.',
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'workshops-lab',
      index: 8,
      title: 'Ateliers Pratiques Monaco Editor',
      shortTitle: 'Labos Pratiques (13 Exos)',
      icon: 'terminal',
      badge: '13 Exercices',
      description: 'Environnement de codage immersif avec Monaco Editor, diagnostics TypeScript, validation automatique des assertions et solutions pas-à-pas.'
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
