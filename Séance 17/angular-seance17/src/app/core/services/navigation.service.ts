import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('event-loop-clock');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'event-loop-clock',
      index: 1,
      title: 'L\'Horlogerie de l\'Event Loop & l\'Asynchronisme',
      shortTitle: 'Event Loop & Asynchronisme',
      icon: 'clock',
      badge: 'Moteur V8',
      description: 'Visualisation dynamique des 4 compartiments (Call Stack, Web APIs, Task Queue, Event Loop). Analogie du restaurant synchrone vs asynchrone et grille d\'arbitrage interactive.',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'rest-protocols',
      index: 2,
      title: 'Protocoles REST, Verbes & Statuts HTTP',
      shortTitle: 'REST, Verbes & Statuts',
      icon: 'globe',
      badge: 'HTTP RFC',
      description: 'Matrice des verbes (GET, POST, PUT, PATCH, DELETE) avec témoins d\'idempotence et d\'innocuité (Safe). Décodeur de codes de statut 2xx, 3xx, 4xx, 5xx et simulateur d\'appels.',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'http-infrastructure',
      index: 3,
      title: 'Configuration & Infrastructure : provideHttpClient()',
      shortTitle: 'Infrastructure HttpClient',
      icon: 'tool',
      badge: 'app.config.ts',
      description: 'Configuration dans app.config.ts avec withFetch(). Démonstrateur de panne NullInjectorError et comparatif moderne withFetch() vs XMLHttpRequest.',
      labNumber: 2,
      exerciseCount: 3
    },
    {
      id: 'http-resource',
      index: 4,
      title: 'La Révolution httpResource() Signal-First',
      shortTitle: 'Révolution httpResource()',
      icon: 'zap',
      badge: 'Signal-First',
      description: 'Comparateur Ancien Monde (RxJS, subscribe, switchMap) vs Signal-First déclaratif. Anatomie de HttpResourceRef (value, isLoading, error, reload) et graphe réactif.',
      labNumber: 3,
      exerciseCount: 4
    },
    {
      id: 'resource-lifecycle',
      index: 5,
      title: 'Machine à États & Ergonomie UI (ResourceStatus)',
      shortTitle: 'Machine à États & UX',
      icon: 'activity',
      badge: 'ResourceStatus',
      description: 'Défilement du cycle de vie Idle, Loading, Reloading, Resolved, Error. Laboratoire d\'UX Réseau : Loading (premier chargement) vs Reloading (rafraîchissement discret sans saut).',
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'dynamic-requests',
      index: 6,
      title: 'Requêtes Dynamiques, Annulation & Suspension',
      shortTitle: 'Dynamique & AbortSignal',
      icon: 'sliders',
      badge: 'Graphe Réactif',
      description: 'Requêtes réactives en cascade pilotées par signaux. Annulation automatique AbortSignal sur frappe rapide, suspension Idle via undefined et atelier sécurité encodeURIComponent.',
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'dto-to-entity',
      index: 7,
      title: 'Le Pont POO : Du DTO Inerte à l\'Entité Vivante',
      shortTitle: 'Pont DTO ➔ Entité Métier',
      icon: 'layers',
      badge: 'Patron Clé POO',
      description: 'Le piège mortel du cast naïf au runtime. Découplage DTO interface vs Entité class, fabrique récursive fromDTO() avec Recipe & Ingredient, et pont computed().',
      labNumber: 6,
      exerciseCount: 5
    },
    {
      id: 'anti-patterns',
      index: 8,
      title: 'Salle de Diagnostic des Anti-Patterns Réseau & POO',
      shortTitle: 'Crash-Tests & Anti-Patterns',
      icon: 'alert-triangle',
      badge: '4 Pièges Critiques',
      description: 'Détecteur interactif de 4 anti-patterns récurrents : illusion synchrone, boucle infinie dans effect(), oubli de encodeURIComponent, et prototype perdu.',
      labNumber: 6,
      exerciseCount: 5
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: 'Ateliers Pratiques Monaco Editor (24 Exercices)',
      shortTitle: 'Labos Monaco (24 Exos)',
      icon: 'terminal',
      badge: '24 Exercices',
      description: 'Banc d\'entraînement interactif avec coloration TypeScript officielle, vérification des types statiques, exécution runtime et validation d\'assertions POO.'
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
