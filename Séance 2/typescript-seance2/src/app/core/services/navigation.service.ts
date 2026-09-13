import { Injectable, signal } from '@angular/core';
import { ModuleSection, TabId } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly modules: ModuleSection[] = [
    {
      id: 'type-erasure',
      index: 1,
      title: "1. Pourquoi TypeScript ? & Transpilation",
      shortTitle: 'Transpilation (Type Erasure)',
      icon: 'zap',
      badge: 'Split-Screen TS/JS',
      description: 'Démystifier le langage, visualiser en direct l\'effacement de types et comparer typage statique vs dynamique.'
    },
    {
      id: 'tooling-cli',
      index: 2,
      title: "2. Environnement & Outillage (tsc & tsconfig)",
      shortTitle: 'Terminal & tsconfig.json',
      icon: 'terminal',
      badge: 'Simulateur CLI',
      description: 'Simulateur CLI pas-à-pas (tsc, node, ts-node) et inspecteur interactif des options clés de tsconfig.json.'
    },
    {
      id: 'types-primitives',
      index: 3,
      title: "3. Types Primitifs, Inférence & Conversions",
      shortTitle: 'Types Primitifs & Inférence',
      icon: 'cpu',
      badge: 'Labo 1 (5 ex)',
      labNumber: 1,
      exerciseCount: 5,
      description: 'Cartes mémo, inférence automatique de type, any vs unknown, void, unions | et types littéraux.'
    },
    {
      id: 'scope-mutability',
      index: 4,
      title: "4. Variables, Portée (Scope) & Mutabilité",
      shortTitle: 'Scope & Mutabilité (const)',
      icon: 'shield',
      badge: 'Labo 2 (4 ex)',
      labNumber: 2,
      exerciseCount: 4,
      description: 'Visualiseur de scope (var vs let/const), piège de la mutabilité des tableaux const et chronologie TDZ.'
    },
    {
      id: 'flow-operators',
      index: 5,
      title: "5. Contrôle de Flux & Opérateurs Modernes",
      shortTitle: 'Contrôle de Flux & Opérateurs',
      icon: 'git-branch',
      badge: 'Labo 3 (4 ex)',
      labNumber: 3,
      exerciseCount: 4,
      description: 'Matrice interactive === vs ==, parcours for...of vs for...in, laboratoire ?. (Optional Chaining) et ??.'
    },
    {
      id: 'functions',
      index: 6,
      title: "6. Fonctions & Paramètres",
      shortTitle: 'Fonctions & Paramètres',
      icon: 'play',
      badge: 'Labo 4 (5 ex)',
      labNumber: 4,
      exerciseCount: 5,
      description: 'Anatomie d\'une fonction typée, fonctions fléchées, paramètres optionnels ?, valeurs par défaut et ...rest.'
    },
    {
      id: 'arrays-tuples',
      index: 7,
      title: "7. Tableaux & Tuples",
      shortTitle: 'Tableaux & Tuples',
      icon: 'layers',
      badge: 'Labo 5 (4 ex)',
      labNumber: 5,
      exerciseCount: 4,
      description: 'Tableaux typés number[], visualiseur de Tuples fixes, playground animé map/filter/find/reduce et spread.'
    },
    {
      id: 'objects-interfaces',
      index: 8,
      title: "8. Objets, Interfaces & Typage Structurel",
      shortTitle: 'Objets & Duck Typing',
      icon: 'box',
      badge: 'Labo 6 (5 ex)',
      labNumber: 6,
      exerciseCount: 5,
      description: 'Déclaration d\'interfaces, propriétés optionnelles/readonly, démonstrateur de duck typing et signatures d\'index.'
    },
    {
      id: 'exercises',
      index: 9,
      title: "Labo d'Entraînement Intensif (27 Défis)",
      shortTitle: 'Tous les Ateliers (27)',
      icon: 'code',
      badge: 'Monaco Studio',
      description: 'Espace complet réunissant les 27 micro-exercices des 6 laboratoires avec Monaco Editor et validation.'
    }
  ];

  readonly activeTab = signal<TabId>('type-erasure');
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
