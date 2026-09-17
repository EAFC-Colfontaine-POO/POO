import { Injectable, signal } from '@angular/core';
import { ModuleSection, TabId } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly modules: ModuleSection[] = [
    {
      id: 'dom-oop',
      index: 1,
      title: '1. Le Trio du Web, le HTML & le DOM (Lien avec la POO)',
      shortTitle: 'DOM & Objets POO',
      icon: 'tree',
      badge: 'DOM Tree Inspector',
      labNumber: 1,
      exerciseCount: 4,
      description: 'Découvrez le lien fondamental entre HTML/CSS et la POO : le DOM comme arbre d\'objets vivants instanciés en mémoire avec leur chaîne d\'héritage JavaScript et le comportement bloc vs en-ligne.'
    },
    {
      id: 'semantic-attributes',
      index: 2,
      title: '2. Structure Sémantique & Attributs Universels',
      shortTitle: 'Sémantique & class vs id',
      icon: 'layout',
      badge: 'Gabarit HTML5 2D',
      labNumber: 1,
      exerciseCount: 4,
      description: 'Structurez une page avec les balises sémantiques HTML5 (<header>, <nav>, <main>, <article>, <footer>) et comprenez la distinction essentielle entre identifiant unique (id) et classes réutilisables (class).'
    },
    {
      id: 'cascade-specificity',
      index: 3,
      title: '3. Cascade CSS & Calculateur de Spécificité',
      shortTitle: 'Cascade & Spécificité',
      icon: 'swords',
      badge: 'Arène des Sélecteurs',
      labNumber: 2,
      exerciseCount: 4,
      description: 'Comprenez comment le navigateur résout les conflits de styles grâce à l\'algorithme de spécificité (Inline 1000 pts, ID 100 pts, Classe 10 pts, Balise 1 pt) et testez les sélecteurs combinés.'
    },
    {
      id: 'box-model',
      index: 4,
      title: '4. Le Modèle de Boîte (Box Model) & box-sizing',
      shortTitle: 'Box Model & box-sizing',
      icon: 'box',
      badge: 'Simulateur Concentrique',
      labNumber: 2,
      exerciseCount: 4,
      description: 'Explorez visuellement les 4 couches de tout élément : Content, Padding, Border et Margin. Démontrez mathématiquement la supériorité de border-box face au content-box par défaut.'
    },
    {
      id: 'flexbox-lab',
      index: 5,
      title: '5. Flexbox — Disposition Unidimensionnelle',
      shortTitle: 'Laboratoire Flexbox',
      icon: 'columns',
      badge: 'Axes Main & Cross',
      labNumber: 3,
      exerciseCount: 4,
      description: 'Manipulez en direct les propriétés d\'alignement unidimensionnel : flex-direction, justify-content, align-items, gap et observez les flèches dynamiques de l\'axe principal et secondaire.'
    },
    {
      id: 'bootstrap-grid',
      index: 6,
      title: '6. Système de Grille Bootstrap (12 Colonnes & Breakpoints)',
      shortTitle: 'Grille 12 Colonnes',
      icon: 'grid',
      badge: 'Simulateur Viewport',
      labNumber: 4,
      exerciseCount: 5,
      description: 'Simulez le redimensionnement d\'écran de 320px à 1500px, observez le déclenchement des 6 breakpoints (col-, col-sm-, col-md-, col-lg-, col-xl-, col-xxl-) et maîtrisez les gouttières.'
    },
    {
      id: 'bootstrap-components',
      index: 7,
      title: '7. Composants Clés & Classes Utilitaires de Bootstrap',
      shortTitle: 'Composants & Utilitaires',
      icon: 'component',
      badge: 'Showcase & Spacing',
      labNumber: 5,
      exerciseCount: 5,
      description: 'Explorez la panoplie de composants préfabriqués (boutons, cartes avec alignement .h-100, formulaires stylisés) et décodez la syntaxe universelle des classes de marge et padding {m|p}{t|b|s|e|x|y}-{0..5|auto}.'
    },
    {
      id: 'angular-integration',
      index: 8,
      title: '8. Intégration dans un Projet Angular',
      shortTitle: 'Intégration Angular',
      icon: 'angular',
      badge: 'Guide & Démo Live',
      description: 'Intégrez Bootstrap 5 dans une application Angular moderne : installation npm, déclaration dans angular.json et mise en œuvre d\'un composant standalone avec @for, navbar responsive et cartes dynamiques.'
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: '9. Espace Ateliers Pratiques (Monaco Editor & Sandbox)',
      shortTitle: 'Ateliers Pratiques (22 défis)',
      icon: 'code',
      badge: 'Monaco Studio',
      description: 'Mettez vos compétences à l\'épreuve dans les 5 ateliers thématiques : éditeur de code Monaco, prévisualisation temps réel avec Bootstrap actif et validation automatique par analyse du DOM.'
    }
  ];

  readonly activeTab = signal<TabId>('dom-oop');
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
    this.isSidebarCollapsed.update(v => !v);
  }
}
