import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('crise-maintenance');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'crise-maintenance',
      index: 1,
      title: 'La Crise de la Maintenance & Les 3 Symptômes',
      shortTitle: 'Crise & Code Smells',
      icon: 'alert-triangle',
      badge: 'Rigidité · Fragilité',
      description: 'L\'illusion du code qui marche, effet domino Château de cartes vs LEGO et panorama SOLID.'
    },
    {
      id: 'srp-single-responsibility',
      index: 2,
      title: '\'S\' — Single Responsibility Principle (SRP)',
      shortTitle: 'S : Responsabilité Unique',
      icon: 'award',
      badge: '1 Raison de Changer',
      description: 'Démantèlement de la classe Dieu (God Object), brigade spécialisée, et Fat Component vs PanierService.',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'ocp-open-closed',
      index: 3,
      title: '\'O\' — Open/Closed Principle (OCP)',
      shortTitle: 'O : Ouvert / Fermé',
      icon: 'box',
      badge: 'Pattern Stratégie',
      description: 'Le piège des cascades switch/case, injection de stratégies dynamiques et notifications multi-canaux.',
      labNumber: 2,
      exerciseCount: 4
    },
    {
      id: 'dip-dependency-inversion',
      index: 4,
      title: '\'D\' — Dependency Inversion Principle (DIP)',
      shortTitle: 'D : Inversion Dépendance',
      icon: 'zap',
      badge: 'Prise Murale 230V',
      description: 'Bannir le new en dur, les 2 Lois de Robert C. Martin et découplage Domaine vs Détails techniques.',
      labNumber: 3,
      exerciseCount: 4
    },
    {
      id: 'dip-angular-testing',
      index: 5,
      title: 'DIP dans Angular & Banc de Test en RAM (2 ms)',
      shortTitle: 'DI Angular & Fast Tests',
      icon: 'activity',
      badge: 'Fake Repo en RAM',
      description: 'Conteneur DI d\'Angular, inject(), providers de substitution et banc d\'essai unitaire ultra-rapide.',
      labNumber: 3,
      exerciseCount: 4
    },
    {
      id: 'synergie-sod-arbitrage',
      index: 6,
      title: 'Synergie S-O-D & Tableau d\'Arbitrage',
      shortTitle: 'Synergie S-O-D & Quiz',
      icon: 'compass',
      badge: 'S ➔ O ➔ D',
      description: 'Pipeline vertueux de conception, matrice d\'arbitrage et quiz interactif Code Smell Detector.',
      labNumber: 4,
      exerciseCount: 2
    },
    {
      id: 'workshops-lab',
      index: 7,
      title: 'Espace Ateliers Pratiques (14 Défis Monaco Editor)',
      shortTitle: 'Labo Monaco (14 Ex)',
      icon: 'terminal',
      badge: '14 Ateliers Monaco',
      description: 'Banc d\'entraînement avec Monaco Editor, terminal virtuel et validation en mémoire.'
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
