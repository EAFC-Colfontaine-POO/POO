import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('dry-problem');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'dry-problem',
      index: 1,
      title: 'Genèse : Le Problème de la Duplication (Principe DRY)',
      shortTitle: '1. Duplication & DRY',
      icon: 'copy',
      badge: 'Architecture',
      description: 'Découvrez la genèse de l\'héritage en confrontant le coût de la duplication de code et le gain immédiat d\'une factorisation dans une classe mère.',
      labNumber: 1
    },
    {
      id: 'is-a-vs-has-a',
      index: 2,
      title: 'La Relation Fondamentale « Est-un » (is-a) vs Composition (« A-un »)',
      shortTitle: '2. « Est-un » vs « A-un »',
      icon: 'git-merge',
      badge: 'Sémantique',
      description: 'Appliquez la Question d\'Or pour distinguer l\'héritage légitime de l\'anti-pattern de composition et éviter l\'héritage par commodité.',
      labNumber: 4
    },
    {
      id: 'constructor-super',
      index: 3,
      title: 'Mécanique TypeScript : extends, super() et Cycle de Construction',
      shortTitle: '3. Constructeur & super()',
      icon: 'layers',
      badge: 'Mécanique TS',
      description: 'Visualisez l\'analogie du bâtiment : le coulage des fondations avec super(), la naissance de this et le piège TS17009.',
      labNumber: 1
    },
    {
      id: 'protected-encapsulation',
      index: 4,
      title: 'Le Dilemme d\'Encapsulation & la Visibilité protected',
      shortTitle: '4. Visibilité protected',
      icon: 'shield',
      badge: 'Encapsulation',
      description: 'Explorez le scanner à 3 cercles concentriques pour comprendre pourquoi protected est le « secret de famille » hermétique à l\'extérieur.',
      labNumber: 2
    },
    {
      id: 'override-enrichment',
      index: 5,
      title: 'Redéfinition (override) & Enrichissement (super.methode())',
      shortTitle: '5. Redéfinition & override',
      icon: 'edit-3',
      badge: 'Spécialisation',
      description: 'Évitez les bugs silencieux grâce au mot-clé override (TS4113) et apprenez à enrichir proprement le comportement parent via super.methode().',
      labNumber: 3
    },
    {
      id: 'fragile-base-class',
      index: 6,
      title: 'Discernement & Pièges : Couplage Fort, Classe Fragile & Yo-Yo',
      shortTitle: '6. Classe Fragile & Yo-Yo',
      icon: 'alert-triangle',
      badge: 'Pièges & Limites',
      description: 'Constatez l\'effet domino d\'une modification de classe mère et découvrez l\'effet Yo-Yo à travers une hiérarchie vertigineuse à 6 niveaux.',
      labNumber: 4
    },
    {
      id: 'angular-mediatheque',
      index: 7,
      title: 'Showroom Démo Angular : Médiathèque Réactive & Signaux',
      shortTitle: '7. Showroom Angular',
      icon: 'layout',
      badge: 'Angular 22 & Signals',
      description: 'Observez l\'intégration concrète de classes TypeScript dans un composant Standalone réactif avec signal<Media[]> et boucle native @for.',
      labNumber: 5
    },
    {
      id: 'workshops-lab',
      index: 8,
      title: 'Ateliers Pratiques : 17 Micro-Exercices avec Monaco Editor',
      shortTitle: '8. Labo Interactif',
      icon: 'terminal',
      badge: '17 Exercices',
      description: 'Entraînez-vous dans un éditeur Monaco professionnel avec console virtuelle et validation automatisée en temps réel.',
      exerciseCount: 17
    }
  ];

  setTab(tabId: TabId): void {
    this.activeTab.set(tabId);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(val => !val);
  }
}
