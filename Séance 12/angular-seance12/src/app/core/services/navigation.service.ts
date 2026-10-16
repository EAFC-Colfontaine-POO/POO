import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('memory-model-identity');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'memory-model-identity',
      index: 1,
      title: '01. Modèle Mémoire : Pile (Stack) vs Tas (Heap) & L\'Énigme du ===',
      shortTitle: 'Stack vs Heap & Identité',
      icon: 'layers',
      badge: '0xRAM',
      description: 'Distinguer la valeur de l\'adresse de référence en mémoire. Comprendre pourquoi { a: 1 } !== { a: 1 } et observer le danger des effets de bord.',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'business-equality-equals',
      index: 2,
      title: '02. L\'Égalité Métier : Concevoir une Méthode equals() Robuste',
      shortTitle: 'Égalité Métier & equals()',
      icon: 'check-circle',
      badge: 'Contrat POO',
      description: 'L\'anatomie canonique en 3 étapes : court-circuit d\'adresse, garde de type instanceof strict et comparaison sémantique des attributs.',
      labNumber: 2,
      exerciseCount: 5
    },
    {
      id: 'cloning-shallow-vs-deep',
      index: 3,
      title: '03. La Duplication : Copie Superficielle (Shallow) vs Copie Profonde (Deep)',
      shortTitle: 'Clonage Shallow vs Deep',
      icon: 'copy',
      badge: 'structuredClone',
      description: 'Le piège de la valise câblée avec le spread operator {...obj}, l\'arme moderne structuredClone() et le patron de conception POO clone().',
      labNumber: 3,
      exerciseCount: 5
    },
    {
      id: 'immutability-value-objects',
      index: 4,
      title: '04. L\'Immutabilité en POO : readonly, Object.freeze() & Value Objects',
      shortTitle: 'Immutabilité & freeze()',
      icon: 'shield',
      badge: 'Stone Solid',
      description: 'Le double bouclier TypeScript + JavaScript. Concevoir des Value Objects indestructibles comme la classe Monnaie et éviter les pièges juniors.',
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'angular-signals-memory',
      index: 5,
      title: '05. La Clé de Voûte : Angular Signals, Object.is() & Réactivité Mémoire',
      shortTitle: 'Signals & Object.is',
      icon: 'zap',
      badge: 'Angular 22',
      description: 'Pourquoi un signal ignore les mutations sur place et exige une nouvelle référence mémoire. Démonstrateur interactif de Fiche Article POS.',
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'workshops-lab',
      index: 6,
      title: '06. Espace Ateliers Pratiques (22 Micro-Exercices Monaco)',
      shortTitle: 'Ateliers Monaco (22 ex)',
      icon: 'terminal',
      badge: 'Labo Global',
      description: 'Banc d\'entraînement interactif avec Monaco Editor, terminal virtuel interceptant console.log et évaluation automatisée par assertions en direct.',
      exerciseCount: 22
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
