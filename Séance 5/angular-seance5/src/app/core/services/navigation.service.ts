import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('memory-model');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'memory-model',
      index: 1,
      title: 'Le Modèle Mémoire : Pile (Stack) vs Tas (Heap)',
      shortTitle: 'Pile vs Tas (RAM)',
      icon: 'layers',
      badge: 'RAM & Références',
      description: 'Distinguer les types primitifs (copie par valeur dans la pile) et les objets (adresses mémoires pointant vers le tas).',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'aliasing-pitfall',
      index: 2,
      title: 'Le Piège de l\'Aliasing & Effets de Bord',
      shortTitle: 'Piège de l\'Aliasing',
      icon: 'tv',
      badge: 'Télécommandes',
      description: 'Comprendre pourquoi l\'affectation j2 = j1 copie l\'adresse et non l\'objet, créant des mutations invisibles à distance.',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'class-vs-instance',
      index: 3,
      title: 'Classe vs Instance : Le Plan d\'Architecte vs La Maison',
      shortTitle: 'Plan vs Maison (new)',
      icon: 'home',
      badge: 'Chantier Virtuel',
      description: 'Distinguer le plan conceptuel unique (la classe) des maisons coulées en béton dans le tas (les instances créées par new).',
      labNumber: 2,
      exerciseCount: 5
    },
    {
      id: 'instance-vs-static',
      index: 4,
      title: 'Mémoire d\'Instance vs Mémoire de Classe (static)',
      shortTitle: 'Instance vs Static',
      icon: 'cpu',
      badge: 'Scope de this',
      description: 'Membres dupliqués par objet vs membres uniques partagés. Comprendre pourquoi une méthode statique ne peut jamais voir this.',
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'encapsulation-invariants',
      index: 5,
      title: 'Pourquoi l\'Encapsulation & Les Invariants de Classe',
      shortTitle: 'Encapsulation & Invariants',
      icon: 'shield',
      badge: 'Crash-Test',
      description: 'Protéger l\'état interne avec un cordon sanitaire et garantir que les règles métier absolues (invariants) ne sont jamais violées.',
      labNumber: 2,
      exerciseCount: 5
    },
    {
      id: 'visibility-parameter-properties',
      index: 6,
      title: 'Modificateurs de Visibilité & Parameter Properties',
      shortTitle: 'Visibilité & Syntaxe TS',
      icon: 'key',
      badge: 'public / private',
      description: 'Maîtriser public, private, protected, la convention _solde et la syntaxe concise TypeScript pour des constructeurs épurés.',
      labNumber: 3,
      exerciseCount: 4
    },
    {
      id: 'getters-setters-tell-dont-ask',
      index: 7,
      title: 'Accesseurs (get/set), Propriétés Calculées & "Tell, Don\'t Ask"',
      shortTitle: 'Accesseurs & Tell Don\'t Ask',
      icon: 'sliders',
      badge: 'Contrôle & Intention',
      description: 'Intercepter la lecture/écriture, calculer des valeurs en direct sans désynchronisation, et abandonner les faux setters aveugles.',
      labNumber: 4,
      exerciseCount: 5
    },
    {
      id: 'advanced-mechanisms',
      index: 8,
      title: 'Mécanismes Avancés : Static Factories, Enums & Ordre Statique',
      shortTitle: 'Fabriques & Enums Riches',
      icon: 'globe',
      badge: 'Système Solaire',
      description: 'Surmonter l\'unique constructeur avec des constructeurs nommés privés, structurer avec enum et déjouer le piège d\'initialisation.',
      labNumber: 6,
      exerciseCount: 4
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: 'Laboratoire Étudiant Global — 26 Micro-Exercices',
      shortTitle: 'Labo Monaco (26 Ex)',
      icon: 'code',
      badge: '26 Défis',
      description: 'Espace d\'entraînement pratique immersif avec Monaco Editor, console virtuelle en bac à sable et évaluation automatisée en direct.'
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
