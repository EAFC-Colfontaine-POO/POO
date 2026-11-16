import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('impedance-mismatch');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: readonly ModuleSection[] = [
    {
      id: 'impedance-mismatch',
      index: 1,
      title: 'Le Choc d\'Impédance (LocalStorage vs IndexedDB)',
      shortTitle: 'Choc d\'Impédance',
      icon: 'car',
      badge: 'Les 3 Murs',
      description: 'Pourquoi LocalStorage échoue sur les données volumineuses : 5 Mo, blocage du thread principal, métaphore de la voiture découpée et comparatif de code natif vs Dexie.'
    },
    {
      id: 'typed-database',
      index: 2,
      title: 'La Base Typée & La Règle d\'Or du Schéma Dexie',
      shortTitle: 'Schéma Typé Dexie',
      icon: 'database',
      badge: 'Règle d\'Or',
      description: 'Constructeur de schéma Dexie v4, déclaration exclusive des clés d\'indexation, et arbitrage UUID v4 vs ++id auto-incrémenté.'
    },
    {
      id: 'btree-indexes',
      index: 3,
      title: 'L\'Anatomie des Index B-Tree & Recherche O(log n)',
      shortTitle: 'Index B-Tree',
      icon: 'tree',
      badge: 'O(log n)',
      description: 'Simulateur visuel d\'arbre B-Tree vs balayage linéaire O(n), et les 3 index spéciaux : unique (&), multi-entry (*), composé ([a+b]).'
    },
    {
      id: 'fluent-api',
      index: 4,
      title: 'Fluent API Dexie & Réhydratation POO',
      shortTitle: 'Fluent API & POO',
      icon: 'filter',
      badge: 'where() & fromDTO()',
      description: 'Bac à sable de requêtes sur 20 livres du domaine, piège du prototype perdu et réhydratation par fromDTO().'
    },
    {
      id: 'acid-transactions',
      index: 5,
      title: 'Transactions ACID & Le Crash Test Rollback',
      shortTitle: 'Transactions ACID',
      icon: 'shield',
      badge: 'Tout ou Rien',
      description: 'Simulateur d\'emprunt en 3 étapes avec injection de panne, les 4 piliers ACID et le piège critique du fetch réseau dans une transaction.'
    },
    {
      id: 'schema-migrations',
      index: 6,
      title: 'Migrations de Schéma en Production (v1 → v2)',
      shortTitle: 'Migrations v1 → v2',
      icon: 'refresh',
      badge: '.version().upgrade()',
      description: 'Simulation pas-à-pas de montée de version avec table.toCollection().modify(), et les 4 règles d\'or pour ne jamais corrompre la prod.'
    },
    {
      id: 'anti-patterns',
      index: 7,
      title: 'Les 5 Anti-Patterns Mortels d\'IndexedDB',
      shortTitle: '5 Anti-Patterns',
      icon: 'alert',
      badge: 'Avant / Après',
      description: 'Diagnostic interactif des 5 erreurs critiques : réouverture de db, fetch en transaction, indexation totale, forEach séquentiel, perte de prototype.'
    },
    {
      id: 'bibliotech-demo',
      index: 8,
      title: 'Application Complète : BiblioTech Dexie & Signals',
      shortTitle: 'BiblioTech Demo',
      icon: 'library',
      badge: 'App 3 Couches',
      description: 'Application complète en 3 couches (Database -> Service Signal-First -> Composants), inspecteur IndexedDB intégré et stress-test double-clic.'
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: 'Espace Ateliers Pratiques (Monaco Editor)',
      shortTitle: 'Ateliers Monaco',
      icon: 'code',
      badge: '26 Micro-Défis',
      description: '6 Labos thématiques progressifs avec éditeur Monaco, typage Dexie complet et validation automatisée en temps réel.'
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(c => !c);
  }
}
