import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('zone-vs-dag');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'zone-vs-dag',
      index: 1,
      title: '01. La Fin de Zone.js & Le DAG Réactif (Gare Centrale & Tableur Excel)',
      shortTitle: 'Zone.js vs Signals (DAG)',
      icon: 'activity',
      badge: 'Zoneless',
      description: 'Comprendre pourquoi Angular 22 abandonne le Dirty Checking aveugle pour un Graphe Orienté Acyclique (DAG) chirurgical. Simulateurs interactifs de Gare Centrale et de Tableur Excel.',
      labNumber: 1,
      exerciseCount: 5
    },
    {
      id: 'trio-primitives',
      index: 2,
      title: '02. Le Trio Réactif Fondamental : signal(), computed() & effect()',
      shortTitle: 'signal · computed · effect',
      icon: 'zap',
      badge: 'Fondations',
      description: 'Maîtriser le producteur d\'état mutable signal(), la projection pure et mémorisée computed() et l\'effet de bord effect() avec cycle de nettoyage onCleanup.',
      labNumber: 2,
      exerciseCount: 4
    },
    {
      id: 'memory-immutability',
      index: 3,
      title: '03. Mémoire & Immutabilité : Le Pont Direct avec la Séance 12',
      shortTitle: 'Pile, Tas & Object.is',
      icon: 'layers',
      badge: 'Pont S12',
      description: 'Pourquoi panier().push(\'Pomme\') fige le DOM alors que panier.update(l => [...l, \'Pomme\']) réveille Angular. Visualiseur d\'adresses mémoire dans le Tas et comparaison Object.is().'
    },
    {
      id: 'component-comm',
      index: 4,
      title: '04. Communication Moderne de Composants : input(), output() & model()',
      shortTitle: 'input · output · model',
      icon: 'repeat',
      badge: 'Signal-First',
      description: 'Remplacer définitivement les décorateurs @Input/@Output par les primitives signal-first. Testeur de transforms (booleanAttribute, numberAttribute) et démonstrateur boîte à bananes [()].',
      labNumber: 3,
      exerciseCount: 5
    },
    {
      id: 'oop-encapsulation',
      index: 5,
      title: '05. Encapsulation POO : Le Motif Private Source, Public Readonly',
      shortTitle: 'Encapsulation POO',
      icon: 'shield',
      badge: 'asReadonly()',
      description: 'Protéger l\'état et les invariants métier. Modèle interactif du Coffre-Fort : private _solde = signal(), public solde = asReadonly() et levée d\'exceptions typées.',
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'fritkot-demo',
      index: 6,
      title: '06. Démonstration Complète : 🍟 La Friterie Réactive (Frit\'Kot)',
      shortTitle: '🍟 Démo Frit\'Kot',
      icon: 'shopping-bag',
      badge: 'App Complète',
      description: 'Assembler tous les concepts du jour dans une mini-application concrète : articles, prix de ligne dérivés, composant compteur [(model)], persistance localStorage et flux @for ... track / @empty.'
    },
    {
      id: 'antipattern-scanner',
      index: 7,
      title: '07. Le Scanner d\'Anti-Patterns (Diagnostic Interactif de Bugs)',
      shortTitle: 'Diagnostic Anti-Patterns',
      icon: 'alert-triangle',
      badge: '6 Pièges',
      description: 'Détecteur interactif pour repérer et corriger en 1 seconde les 6 erreurs juniors classiques : parenthèses manquantes, mutation push(), écriture dans effect(), computed() impur, injection NG0203 et cycle.'
    },
    {
      id: 'workshops-lab',
      index: 8,
      title: '08. Espace Ateliers Pratiques (18 Micro-Exercices Monaco)',
      shortTitle: 'Ateliers Monaco (18 ex)',
      icon: 'terminal',
      badge: 'Labo Global',
      description: 'Environnement de travaux pratiques complet avec Monaco Editor, autocomplétion TypeScript, exécution en sandbox sécurisé, console virtuelle et validation automatisée.',
      exerciseCount: 18
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
