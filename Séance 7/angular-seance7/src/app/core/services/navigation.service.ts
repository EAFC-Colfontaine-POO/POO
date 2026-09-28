import { Injectable, signal, computed } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly isSidebarCollapsed = signal<boolean>(false);
  readonly activeTab = signal<TabId>('control-tower-vs-delegation');

  readonly modules: ModuleSection[] = [
    {
      id: 'control-tower-vs-delegation',
      index: 1,
      title: 'L\'Anti-pattern de la « Tour de Contrôle » vs La Délégation',
      shortTitle: 'Tour de Contrôle vs Délégation',
      icon: 'tower',
      badge: 'OCP',
      description: 'Découvrez pourquoi les cascades de if/else mènent à la catastrophe logicielle et comment le polymorphisme respecte le principe Ouvert/Fermé (OCP).',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'remote-control-analogy',
      index: 2,
      title: 'L\'Analogie de la Télécommande Universelle (Statique vs Dynamique)',
      shortTitle: 'Télécommande Universelle',
      icon: 'remote',
      badge: 'Contrat',
      description: 'Comprenez viscéralement la différence entre type statique (les boutons disponibles) et type dynamique (le circuit interne exécuté).',
      labNumber: 2,
      exerciseCount: 4
    },
    {
      id: 'late-binding-prototypes',
      index: 3,
      title: 'Sous le Capot : La Liaison Dynamique (Late Binding) & Prototypes',
      shortTitle: 'Liaison Dynamique & Prototypes',
      icon: 'cpu',
      badge: 'V8 Engine',
      description: 'Explorez la résolution d\'appel au runtime dans la mémoire vive : inspection du prototype (__proto__) et exécution sans remontée inutile.',
      labNumber: 2,
      exerciseCount: 4
    },
    {
      id: 'ts-view-restrictor',
      index: 4,
      title: 'La Règle d\'Or du Compilateur TypeScript (Restricteur de Vue)',
      shortTitle: 'Restricteur de Vue (TS2339)',
      icon: 'shield-alert',
      badge: 'Sécurité TS',
      description: 'Pourquoi m.pages refuse de compiler même si l\'objet réel contient 464 pages ? Comprenez la sécurité statique du compilateur.',
      labNumber: 2,
      exerciseCount: 4
    },
    {
      id: 'heterogeneous-collections-ocp',
      index: 5,
      title: 'Collections Hétérogènes & Crash-Test OCP',
      shortTitle: 'Collections & Crash-Test OCP',
      icon: 'layers',
      badge: 'Extensibilité',
      description: 'Manipulez un catalogue polymorphe Media[] en une boucle unique, et réalisez le crash-test en injectant un nouveau type sans modifier l\'existant.',
      labNumber: 3,
      exerciseCount: 4
    },
    {
      id: 'instanceof-type-narrowing',
      index: 6,
      title: 'Le Garde de Type : instanceof & Type Narrowing',
      shortTitle: 'instanceof & Type Narrowing',
      icon: 'funnel',
      badge: 'Narrowing',
      description: 'Accédez aux fonctionnalités exclusives en toute sécurité. Démystifiez les 3 pièges critiques : interface, JSON.parse() et abus.',
      labNumber: 4,
      exerciseCount: 5
    },
    {
      id: 'oop-vs-discriminated-unions',
      index: 7,
      title: 'Alternative Moderne : POO vs Unions Discriminées',
      shortTitle: 'POO vs Unions Discriminées',
      icon: 'git-compare',
      badge: 'never exhaustif',
      description: 'Comparez le polymorphisme par classes au polymorphisme structurel. Expérimentez le switch exhaustif avec le type never.',
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'angular-modern-mediatheque',
      index: 8,
      title: 'Démonstrateur Angular Moderne (Architecture de Production)',
      shortTitle: 'Architecture Médiathèque Angular',
      icon: 'angular',
      badge: 'Signals + @for',
      description: 'Mettez en œuvre le polymorphisme dans une architecture propre 3 couches avec les Signals Angular, @for et @if (media instanceof Classe).',
      labNumber: 6,
      exerciseCount: 4
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: 'Espace Ateliers Pratiques (Labo Étudiant avec Monaco Editor)',
      shortTitle: 'Labo & 25 Exercices',
      icon: 'terminal',
      badge: '25 Défis',
      description: '25 micro-exercices d\'entraînement exécutables dans Monaco Editor avec autocomplétion TypeScript, runner bac à sable et validation immédiate.'
    }
  ];

  readonly currentModule = computed(() => {
    return this.modules.find(m => m.id === this.activeTab()) || this.modules[0];
  });

  setTab(tabId: TabId): void {
    this.activeTab.set(tabId);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(c => !c);
  }
}
