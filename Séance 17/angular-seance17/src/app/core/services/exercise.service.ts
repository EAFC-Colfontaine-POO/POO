import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { stripComments } from './validation-utils';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance17_exercises_v2';
  private readonly transpiler: TypescriptTranspilerService;

  constructor(customTranspiler?: TypescriptTranspilerService) {
    this.transpiler = customTranspiler ?? inject(TypescriptTranspilerService, { optional: true }) ?? new TypescriptTranspilerService();
    this.loadFromStorage();
  }

  readonly activeExerciseIndex = signal<number>(0);
  readonly filterLab = signal<number | null>(null);

  /** Définitions des exercices : `currentCode` est dérivé de `initialCode` (source unique de vérité). */
  private readonly exerciseDefinitions: Omit<Exercise, 'currentCode'>[] = [
    // =========================================================================
    // LABO 1 : Requêtes REST, Sémantique & Paramètres (4 exercices)
    // =========================================================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Construction d\'URL Sécurisée',
      subtitle: 'Protéger les paramètres de requête avec encodeURIComponent',
      sectionId: 'rest-protocols',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement: 'Écrivez la fonction `construireUrl(base: string, tag: string): string` qui assemble une URL de recherche sous la forme `${base}?tag=${...}` en protégeant impérativement le paramètre `tag` avec `encodeURIComponent`.',
      hint: 'Utilisez `encodeURIComponent(tag.trim())` pour neutraliser les espaces, accents et caractères réservés comme & ou #.',
      initialCode: `// 1. Implémentez construireUrl :
function construireUrl(base: string, tag: string): string {
  // Complétez ici :
  return "";
}

// 2. Tests :
console.log(construireUrl("https://api.fake.com/articles", "café & thé"));
`,
      solutionCode: `function construireUrl(base: string, tag: string): string {
  return \`\${base}?tag=\${encodeURIComponent(tag.trim())}\`;
}

console.log(construireUrl("https://api.fake.com/articles", "café & thé"));
`,
      isCompleted: false,
      solutionExplanation: [
        'Les caractères spéciaux (&, ?, espaces, accents) corrompent la structure des URLs sans encodage.',
        '`encodeURIComponent()` transforme "café & thé" en "caf%C3%A9%20%26%20th%C3%A9", évitant toute injection.',
        'La concaténation par gabarit de chaîne produit une URI REST conforme à la RFC 3986.'
      ],
      criteria: [
        {
          id: 'c1-encode',
          label: 'Utilisation de encodeURIComponent',
          description: 'La fonction doit appeler encodeURIComponent sur le tag.',
          passed: false,
          hint: 'Appelez encodeURIComponent(tag)'
        },
        {
          id: 'c1-format',
          label: 'Structure de requête valide',
          description: 'L\'URL doit contenir ?tag= suivi du paramètre encodé.',
          passed: false,
          hint: 'Vérifiez la présence de "?tag="'
        },
        {
          id: 'c1-exec',
          label: 'Exécution réussie',
          description: 'La sortie console contient l\'URL encodée.',
          passed: false,
          hint: 'Affichez le résultat avec console.log()'
        }
      ]
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Sémantique des Verbes HTTP',
      subtitle: 'Associer les actions CRUD aux méthodes HTTP normalisées',
      sectionId: 'rest-protocols',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction `obtenirVerbeHttp(action: string): string` qui retourne le verbe HTTP standard correspondant aux actions suivantes : "LIRE" -> "GET", "CREER" -> "POST", "METTRE_A_JOUR_TOTAL" -> "PUT", "MODIFIER_PARTIEL" -> "PATCH", "SUPPRIMER" -> "DELETE".',
      hint: 'Utilisez un `switch` ou une table d\'association clé-valeur (Record).',
      initialCode: `function obtenirVerbeHttp(action: string): string {
  // Complétez les correspondances CRUD -> Verbe HTTP
  return "";
}

console.log("Action CREER :", obtenirVerbeHttp("CREER"));
console.log("Action SUPPRIMER :", obtenirVerbeHttp("SUPPRIMER"));
`,
      solutionCode: `function obtenirVerbeHttp(action: string): string {
  switch (action) {
    case "LIRE": return "GET";
    case "CREER": return "POST";
    case "METTRE_A_JOUR_TOTAL": return "PUT";
    case "MODIFIER_PARTIEL": return "PATCH";
    case "SUPPRIMER": return "DELETE";
    default: throw new Error(\`Action inconnue : \${action}\`);
  }
}

console.log("Action CREER :", obtenirVerbeHttp("CREER"));
console.log("Action SUPPRIMER :", obtenirVerbeHttp("SUPPRIMER"));
`,
      isCompleted: false,
      solutionExplanation: [
        'En architecture REST, l\'URL désigne la ressource et le verbe HTTP désigne l\'action.',
        'POST pour la création d\'une sous-ressource, DELETE pour la suppression.',
        'PUT remplace la ressource entière, tandis que PATCH modifie un fragment.'
      ],
      criteria: [
        {
          id: 'c2-verbs',
          label: 'Gestion des 5 verbes CRUD',
          description: 'La fonction doit mapper correctement LIRE, CREER, METTRE_A_JOUR_TOTAL, MODIFIER_PARTIEL et SUPPRIMER.',
          passed: false,
          hint: 'Vérifiez POST, PUT, DELETE, PATCH, GET'
        },
        {
          id: 'c2-exec',
          label: 'Sortie console conforme',
          description: 'Affiche POST pour CREER et DELETE pour SUPPRIMER.',
          passed: false,
          hint: 'Exécutez pour tester le résultat'
        }
      ]
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Décodage des Familles de Statut HTTP',
      subtitle: 'Identifier la famille sémantique d\'un code de statut (2xx, 3xx, 4xx, 5xx)',
      sectionId: 'rest-protocols',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction `analyserStatut(code: number): string` qui retourne : "Succès" (200-299), "Redirection" (300-399), "Erreur Client" (400-499), "Erreur Serveur" (500-599), ou "Code Inconnu".',
      hint: 'Divisez par 100 avec `Math.floor(code / 100)` ou utilisez des comparaisons d\'intervalles numériques.',
      initialCode: `function analyserStatut(code: number): string {
  // Identifiez la tranche du code HTTP
  return "";
}

console.log("Code 200 :", analyserStatut(200));
console.log("Code 404 :", analyserStatut(404));
console.log("Code 500 :", analyserStatut(500));
`,
      solutionCode: `function analyserStatut(code: number): string {
  if (code >= 200 && code < 300) return "Succès";
  if (code >= 300 && code < 400) return "Redirection";
  if (code >= 400 && code < 500) return "Erreur Client";
  if (code >= 500 && code < 600) return "Erreur Serveur";
  return "Code Inconnu";
}

console.log("Code 200 :", analyserStatut(200));
console.log("Code 404 :", analyserStatut(404));
console.log("Code 500 :", analyserStatut(500));
`,
      isCompleted: false,
      solutionExplanation: [
        'Les codes 2xx attestent de la bonne exécution de la requête par le serveur distant.',
        'Les codes 4xx indiquent un problème imputable au client (URL introuvable, absence de token).',
        'Les codes 5xx signalent une défaillance interne du backend (crash non intercepté).'
      ],
      criteria: [
        {
          id: 'c3-ranges',
          label: 'Intervalles 2xx, 3xx, 4xx, 5xx',
          description: 'Tous les paliers sont correctement identifiés.',
          passed: false,
          hint: 'Testez les bornes [200, 299], [400, 499], [500, 599]'
        },
        {
          id: 'c3-exec',
          label: 'Affichage des trois catégories types',
          description: 'Affiche Succès, Erreur Client et Erreur Serveur.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-1-4',
      labNumber: 1,
      number: '1.4',
      title: 'Prédicat d\'Idempotence HTTP',
      subtitle: 'Valider mathématiquement la garantie d\'idempotence',
      sectionId: 'rest-protocols',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez le prédicat `estIdempotent(methode: string): boolean` qui retourne `true` si et seulement si la méthode HTTP est idempotente (parmi `GET`, `HEAD`, `PUT`, `DELETE`, `OPTIONS`), et `false` pour `POST` et `PATCH`.',
      hint: 'Une opération est idempotente si son exécution répétée N fois produit exactement le même état final sur le serveur.',
      initialCode: `function estIdempotent(methode: string): boolean {
  // Retournez true si la méthode est idempotente
  return false;
}

console.log("GET est idempotent :", estIdempotent("GET"));
console.log("POST est idempotent :", estIdempotent("POST"));
console.log("DELETE est idempotent :", estIdempotent("DELETE"));
`,
      solutionCode: `function estIdempotent(methode: string): boolean {
  const idempotents = ["GET", "HEAD", "PUT", "DELETE", "OPTIONS"];
  return idempotents.includes(methode.toUpperCase());
}

console.log("GET est idempotent :", estIdempotent("GET"));
console.log("POST est idempotent :", estIdempotent("POST"));
console.log("DELETE est idempotent :", estIdempotent("DELETE"));
`,
      isCompleted: false,
      solutionExplanation: [
        '`GET` et `DELETE` sont idempotents : répéter l\'appel ne modifie pas l\'état ultérieur.',
        '`POST` n\'est pas idempotent : chaque appel crée une nouvelle ressource.',
        '`PUT` est idempotent car il remplace intégralement l\'état ciblé.'
      ],
      criteria: [
        {
          id: 'c4-idempotent',
          label: 'Vérification stricte de l\'idempotence',
          description: 'GET, PUT, DELETE retournent true ; POST et PATCH retournent false.',
          passed: false,
          hint: 'Vérifiez les méthodes autorisées'
        },
        {
          id: 'c4-exec',
          label: 'Exécution correcte',
          description: 'Affiche true pour GET et DELETE, et false pour POST.',
          passed: false,
          hint: 'Lancez la validation'
        }
      ]
    },

    // =========================================================================
    // LABO 2 : Infrastructure & Configuration (3 exercices)
    // =========================================================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Configuration de app.config.ts',
      subtitle: 'Enregistrer provideHttpClient avec withFetch() dans les providers',
      sectionId: 'http-infrastructure',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Complétez la fonction `configurerApplication()` pour qu\'elle retourne une configuration contenant le provider réseau moderne d\'Angular avec l\'option `withFetch()`.',
      hint: 'Appelez `provideHttpClient(withFetch())` dans le tableau des `providers`.',
      initialCode: `// Complétez la fonction de configuration :
function configurerApplication() {
  return {
    providers: [
      // Ajoutez provideHttpClient avec withFetch() ici :
    ]
  };
}

const config = configurerApplication();
console.log("Nombre de providers déclarés :", config.providers.length);
`,
      solutionCode: `function configurerApplication() {
  return {
    providers: [
      provideHttpClient(withFetch())
    ]
  };
}

const config = configurerApplication();
console.log("Nombre de providers déclarés :", config.providers.length);
`,
      isCompleted: false,
      solutionExplanation: [
        'Dans les applications Standalone Angular, `app.config.ts` remplace l\'ancien `AppModule`.',
        '`provideHttpClient()` enregistre tous les services du module HTTP dans l\'injecteur racine.',
        '`withFetch()` remplace le protocole historique `XMLHttpRequest` par la primitive moderne `fetch`.'
      ],
      criteria: [
        {
          id: 'c21-provide',
          label: 'Présence de provideHttpClient',
          description: 'La fonction appelle provideHttpClient.',
          passed: false,
          hint: 'Ajoutez provideHttpClient()'
        },
        {
          id: 'c21-fetch',
          label: 'Présence de withFetch()',
          description: 'L\'argument withFetch() est passé à provideHttpClient.',
          passed: false,
          hint: 'Passez withFetch() en argument'
        },
        {
          id: 'c21-exec',
          label: 'Validation à l\'exécution',
          description: 'Au moins 1 provider est déclaré dans la configuration.',
          passed: false,
          hint: 'Vérifiez la déclaration'
        }
      ]
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Diagnostic de NullInjectorError',
      subtitle: 'Identifier la cause et corriger l\'absence de fournisseur réseau',
      sectionId: 'http-infrastructure',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Un composant tente de consommer le réseau mais l\'application lève l\'erreur `NullInjectorError: No provider for HttpClient!`. Écrivez la fonction `diagnostiquerEtCorriger(providers: any[]): any[]` qui vérifie si `provideHttpClient` est présent, et l\'ajoute avec `withFetch()` si manquant.',
      hint: 'Vérifiez si l\'un des éléments a `provide: "HttpClient"`. Si non, ajoutez `provideHttpClient(withFetch())`.',
      initialCode: `function diagnostiquerEtCorriger(providers: any[]): any[] {
  // Si le provider HttpClient est absent, ajoutez-le avec withFetch()
  return providers;
}

const providersInitiaux = [];
const providersCorriges = diagnostiquerEtCorriger(providersInitiaux);
console.log("Provider réparé présent :", providersCorriges.length > 0);
`,
      solutionCode: `function diagnostiquerEtCorriger(providers: any[]): any[] {
  const hasHttp = providers.some(p => p && p.provide === 'HttpClient');
  if (!hasHttp) {
    return [...providers, provideHttpClient(withFetch())];
  }
  return providers;
}

const providersInitiaux = [];
const providersCorriges = diagnostiquerEtCorriger(providersInitiaux);
console.log("Provider réparé présent :", providersCorriges.length > 0);
`,
      isCompleted: false,
      solutionExplanation: [
        '`NullInjectorError` survient quand un service ou composant demande une dépendance non déclarée.',
        'L\'injection de dépendances (DI) d\'Angular remonte jusqu\'au Root Injector sans trouver de fabricant.',
        'L\'adjonction de `provideHttpClient()` résout définitivement l\'anomalie.'
      ],
      criteria: [
        {
          id: 'c22-fix',
          label: 'Ajout de provideHttpClient(withFetch())',
          description: 'La liste corrigée contient le provider requis.',
          passed: false,
          hint: 'Ajoutez provideHttpClient(withFetch())'
        },
        {
          id: 'c22-exec',
          label: 'Confirmation en console',
          description: 'Affiche true pour la présence du provider réparé.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Activation du Fetch Natif & AbortSignal',
      subtitle: 'Comprendre l\'intérêt de withFetch() pour l\'annulation de requêtes',
      sectionId: 'http-infrastructure',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `verifierSupportFetch(config: any): boolean` qui inspecte les features de `provideHttpClient` et valide que l\'option `fetch` est activée pour autoriser l\'annulation native via `AbortSignal`.',
      hint: 'Inspectez si `config.features` contient une feature de type `fetch`.',
      initialCode: `function verifierSupportFetch(httpConfig: any): boolean {
  // Retournez true si withFetch() est bien configuré
  return false;
}

const testConfig = provideHttpClient(withFetch());
console.log("Fetch supporté :", verifierSupportFetch(testConfig));
`,
      solutionCode: `function verifierSupportFetch(httpConfig: any): boolean {
  if (!httpConfig || !httpConfig.features) return false;
  return httpConfig.features.some((f: any) => f && f.kind === 'fetch');
}

const testConfig = provideHttpClient(withFetch());
console.log("Fetch supporté :", verifierSupportFetch(testConfig));
`,
      isCompleted: false,
      solutionExplanation: [
        '`withFetch()` permet au client HTTP d\'exploiter l\'API standard `window.fetch`.',
        'Cette configuration débloque l\'annulation de paquets réseau via `AbortController` / `AbortSignal`.',
        'Elle est également indispensable pour les applications en Server-Side Rendering (SSR).'
      ],
      criteria: [
        {
          id: 'c23-inspect',
          label: 'Inspection des options features',
          description: 'La fonction teste correctement la présence du fetch.',
          passed: false,
          hint: 'Inspectez httpConfig.features'
        },
        {
          id: 'c23-exec',
          label: 'Succès du test unitaire',
          description: 'La console affiche "Fetch supporté : true".',
          passed: false,
          hint: 'Lancez l\'exécution'
        }
      ]
    },

    // =========================================================================
    // LABO 3 : Déclaration Réactive avec httpResource (4 exercices)
    // =========================================================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Déclaration d\'une Ressource Statique',
      subtitle: 'Créer une HttpResourceRef sur une URL cible avec typage DTO',
      sectionId: 'http-resource',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Déclarez une variable `articlesResource` à l\'aide de `httpResource` interrogeant `"https://api.fake.com/articles"` avec un DTO `ArticleDTO[]`. Affichez la valeur initiale du signal de chargement `.isLoading()`.',
      hint: 'Utilisez `const articlesResource = httpResource<ArticleDTO[]>("https://api.fake.com/articles");`',
      initialCode: `interface ArticleDTO {
  id: number;
  titre: string;
}

// 1. Déclarez articlesResource avec httpResource :
const articlesResource = null;

// 2. Affichez l'état de chargement initial :
if (articlesResource) {
  console.log("Chargement en cours :", (articlesResource as any).isLoading());
}
`,
      solutionCode: `interface ArticleDTO {
  id: number;
  titre: string;
}

const articlesResource = httpResource<ArticleDTO[]>("https://api.fake.com/articles");

console.log("Chargement en cours :", articlesResource.isLoading());
console.log("Données disponibles :", articlesResource.value()?.length);
`,
      isCompleted: false,
      solutionExplanation: [
        '`httpResource()` retourne un `HttpResourceRef` prêt à l\'emploi dans le composant.',
        'La ressource émet la requête HTTP dès son instanciation de façon non bloquante.',
        'Tous les membres d\'état (`.value()`, `.isLoading()`) sont des signaux Angular.'
      ],
      criteria: [
        {
          id: 'c31-decl',
          label: 'Déclaration avec httpResource',
          description: 'articlesResource est initialisé avec httpResource.',
          passed: false,
          hint: 'Utilisez httpResource(...)'
        },
        {
          id: 'c31-exec',
          label: 'Lecture du signal réactif',
          description: 'Affiche l\'état de chargement en console sans erreur.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Exploitation d\'un Signal Dérivé computed()',
      subtitle: 'Extraire le nombre d\'éléments disponibles sans bloquer l\'UI',
      sectionId: 'http-resource',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Créez un signal `nombreArticles = computed(...)` qui lit `articlesResource.value()` et retourne le nombre d\'articles reçus, ou `0` si les données ne sont pas encore résolues (`undefined`).',
      hint: 'Utilisez `computed(() => articlesResource.value()?.length ?? 0)`.',
      initialCode: `const articlesResource = httpResource("https://api.fake.com/articles");

// Créez le computed() nombreArticles :
const nombreArticles = null;

if (nombreArticles) {
  console.log("Total articles réactif :", (nombreArticles as any)());
}
`,
      solutionCode: `const articlesResource = httpResource("https://api.fake.com/articles");

const nombreArticles = computed(() => {
  const data = articlesResource.value();
  return data ? data.length : 0;
});

console.log("Total articles réactif :", nombreArticles());
`,
      isCompleted: false,
      solutionExplanation: [
        '`computed()` s\'abonne automatiquement au signal `value()` de la ressource.',
        'L\'opérateur de coalescence nulle `?? 0` garantit un retour robuste même pendant l\'attente réseau.',
        'Aucune souscription manuelle ni désouscription (`unsubscribe`) n\'est requise.'
      ],
      criteria: [
        {
          id: 'c32-computed',
          label: 'Utilisation de computed()',
          description: 'nombreArticles est un signal dérivé déclaré avec computed.',
          passed: false,
          hint: 'Utilisez computed(() => ...)'
        },
        {
          id: 'c32-exec',
          label: 'Résultat numérique obtenu',
          description: 'Affiche 2 (ou le nombre d\'éléments) en console.',
          passed: false,
          hint: 'Exécutez pour tester'
        }
      ]
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Pilotage Impératif du Rechargement (.reload)',
      subtitle: 'Rafraîchir une ressource à la demande de l\'utilisateur',
      sectionId: 'http-resource',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez la méthode `rafraichirDonnees(resource: any): void` qui déclenche la réactualisation de la ressource en appelant sa méthode native `.reload()`.',
      hint: 'Appelez simplement `resource.reload()`.',
      initialCode: `const res = httpResource("https://api.fake.com/articles");

function rafraichirDonnees(resource: any): void {
  // Déclenchez le rechargement ici :
}

rafraichirDonnees(res);
`,
      solutionCode: `const res = httpResource("https://api.fake.com/articles");

function rafraichirDonnees(resource: any): void {
  if (resource && typeof resource.reload === 'function') {
    resource.reload();
  }
}

rafraichirDonnees(res);
`,
      isCompleted: false,
      solutionExplanation: [
        'Contrairement aux requêtes déclaratives automatiques, `.reload()` est une commande impérative.',
        'Elle permet de répondre à un geste explicite de l\'utilisateur (bouton "Actualiser").',
        'Pendant la réactualisation, le statut de la ressource bascule sur `Reloading`.'
      ],
      criteria: [
        {
          id: 'c33-reload',
          label: 'Appel de resource.reload()',
          description: 'La méthode reload est invoquée sur l\'objet ressource.',
          passed: false,
          hint: 'Appelez resource.reload()'
        },
        {
          id: 'c33-exec',
          label: 'Notification en console',
          description: 'Le journal confirme le déclenchement du rechargement.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-3-4',
      labNumber: 3,
      number: '3.4',
      title: 'Extraction Sécurisée d\'Erreur Réseau',
      subtitle: 'Traduire l\'erreur brute en message compréhensible pour l\'utilisateur',
      sectionId: 'http-resource',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Créez un signal `messageErreur = computed(...)` lisant `resource.error()`. S\'il n\'y a pas d\'erreur, retournez `null`. Si une erreur 404 est présente, retournez `"Ressource introuvable"`, sinon retournez `"Erreur réseau survenue"`.',
      hint: 'Inspectez `const err = resource.error() as any;` puis testez `err.status === 404`.',
      initialCode: `const resource = httpResource("https://api.fake.com/articles/error");

// Créez le computed messageErreur :
const messageErreur = null;

if (messageErreur) {
  console.log("Diagnostic d'erreur :", (messageErreur as any)());
}
`,
      solutionCode: `const resource = httpResource("https://api.fake.com/articles/error");

const messageErreur = computed(() => {
  const err = resource.error() as any;
  if (!err) return null;
  if (err.status === 404) return "Ressource introuvable";
  return "Erreur réseau survenue";
});

console.log("Diagnostic d'erreur :", messageErreur());
`,
      isCompleted: false,
      solutionExplanation: [
        '`resource.error()` capture automatiquement tout rejet réseau ou réponse HTTP >= 400.',
        'Les erreurs ne doivent jamais être présentées sous leur forme technique brute à l\'utilisateur.',
        'Un message sémantique convivial renforce la qualité UX de l\'application.'
      ],
      criteria: [
        {
          id: 'c34-error-sig',
          label: 'Dérivation via computed()',
          description: 'messageErreur lit resource.error() dans un computed.',
          passed: false,
          hint: 'Utilisez computed()'
        },
        {
          id: 'c34-exec',
          label: 'Message 404 retourné',
          description: 'La console affiche "Ressource introuvable".',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },

    // =========================================================================
    // LABO 4 : Requêtes Dynamiques & Suspension Réactive (4 exercices)
    // =========================================================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Requête Paramétrée par un Signal',
      subtitle: 'Passer une fonction fléchée de calcul d\'URL à httpResource',
      sectionId: 'dynamic-requests',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Déclarez un signal `page = signal(1)`. Liez ensuite `articlesResource` avec une fonction de requête qui calcule l\'URL dynamique `https://api.fake.com/items?page=${page()}`.',
      hint: 'Passez une fonction anonyme `() => ...` en premier argument de `httpResource`.',
      initialCode: `// 1. Déclarez le signal de pagination :
const page = null;

// 2. Déclarez la ressource paramétrée :
const articlesResource = null;

if (page && articlesResource) {
  console.log("Ressource initialisée avec page :", (page as any)());
}
`,
      solutionCode: `const page = signal(1);

const articlesResource = httpResource(() => {
  return \`https://api.fake.com/items?page=\${page()}\`;
});

console.log("Ressource initialisée avec page :", page());
`,
      isCompleted: false,
      solutionExplanation: [
        'En fournissant une fonction fléchée à `httpResource`, Angular enregistre une dépendance réactive.',
        'Chaque fois que `page.set()` sera appelé, l\'URL sera recalculée.',
        'La nouvelle requête réseau sera émise automatiquement sans code impératif.'
      ],
      criteria: [
        {
          id: 'c41-page',
          label: 'Signal de page initialisé',
          description: 'page est un signal avec valeur initiale 1.',
          passed: false,
          hint: 'Utilisez signal(1)'
        },
        {
          id: 'c41-url-fn',
          label: 'Fonction de calcul d\'URL',
          description: 'httpResource reçoit une fonction fléchée lisant page().',
          passed: false,
          hint: 'Passez () => `...` à httpResource'
        },
        {
          id: 'c41-exec',
          label: 'Exécution réussie',
          description: 'Le journal confirme la page 1 initialisée.',
          passed: false,
          hint: 'Exécutez pour valider'
        }
      ]
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Suspension Conditionnelle avec undefined',
      subtitle: 'Mettre la ressource en veille Idle si la recherche est trop courte',
      sectionId: 'dynamic-requests',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Configurez la fonction de requête de `rechercheResource` pour qu\'elle renvoie `undefined` si `filtre().trim().length < 3`. Si le terme fait 3 caractères ou plus, retournez l\'URL `https://api.fake.com/search?q=${encodeURIComponent(terme)}`.',
      hint: 'Si la fonction de requête retourne `undefined`, Angular bascule la ressource à l\'état `ResourceStatus.Idle` sans émettre d\'appel HTTP.',
      initialCode: `const filtre = signal("an"); // 2 caractères seulement

const rechercheResource = httpResource(() => {
  // Complétez ici :
  // Si filtre().trim().length < 3 -> return undefined;
  // Sinon return l'URL sécurisée
  return "";
});

console.log("Statut de la ressource suspendue :", rechercheResource.status());
`,
      solutionCode: `const filtre = signal("an");

const rechercheResource = httpResource(() => {
  const terme = filtre().trim();
  if (terme.length < 3) {
    return undefined;
  }
  return \`https://api.fake.com/search?q=\${encodeURIComponent(terme)}\`;
});

console.log("Statut de la ressource suspendue :", rechercheResource.status());
`,
      isCompleted: false,
      solutionExplanation: [
        'Le retour explicite de `undefined` dans la fonction de requête suspend l\'émission réseau.',
        'La ressource reste à l\'état `Idle (0)`, préservant la bande passante et le serveur.',
        'Dès que la saisie atteint 3 lettres, la ressource s\'active instantanément.'
      ],
      criteria: [
        {
          id: 'c42-undefined',
          label: 'Retour conditionnel de undefined',
          description: 'La fonction renvoie undefined si moins de 3 caractères.',
          passed: false,
          hint: 'Vérifiez if (terme.length < 3) return undefined'
        },
        {
          id: 'c42-idle',
          label: 'Statut Idle (0) vérifié',
          description: 'La console affiche le statut 0 (Idle).',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Requête Réactive Multicritères',
      subtitle: 'Combiner plusieurs signaux avec encodage complet des paramètres',
      sectionId: 'dynamic-requests',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Créez une fonction de requête combinant deux signaux `terme = signal("pizza")` et `categorie = signal("italien")`. L\'URL retournée doit être `https://api.fake.com/recherche?q=${encodeURIComponent(terme())}&cat=${encodeURIComponent(categorie())}`.',
      hint: 'Utilisez `encodeURIComponent` pour chacun des deux paramètres.',
      initialCode: `const terme = signal("pizza & pâte");
const categorie = signal("cuisine/italienne");

const catalogueResource = httpResource(() => {
  // Assemblez les deux signaux encodés :
  return "";
});

console.log("Ressource multicritères prête.");
`,
      solutionCode: `const terme = signal("pizza & pâte");
const categorie = signal("cuisine/italienne");

const catalogueResource = httpResource(() => {
  const q = encodeURIComponent(terme().trim());
  const cat = encodeURIComponent(categorie().trim());
  return \`https://api.fake.com/recherche?q=\${q}&cat=\${cat}\`;
});

console.log("Ressource multicritères prête.");
`,
      isCompleted: false,
      solutionExplanation: [
        'Chaque signal lu dans la fonction de requête est enregistré dans le graphe de dépendance.',
        'Une modification de `terme` OU de `categorie` relance immédiatement la requête.',
        'L\'encodage individuel des paramètres protège contre la corruption des séparateurs `&` et `/`.'
      ],
      criteria: [
        {
          id: 'c43-multi',
          label: 'Lecture des deux signaux',
          description: 'La fonction lit terme() et categorie().',
          passed: false,
          hint: 'Lisez terme() et categorie()'
        },
        {
          id: 'c43-encode',
          label: 'Encodage sécurisé des deux paramètres',
          description: 'encodeURIComponent est appliqué à terme et categorie.',
          passed: false,
          hint: 'Utilisez encodeURIComponent'
        },
        {
          id: 'c43-exec',
          label: 'Confirmation d\'exécution',
          description: 'Le script s\'exécute avec succès.',
          passed: false,
          hint: 'Validez le code'
        }
      ]
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: 'Simulation d\'Annulation AbortSignal',
      subtitle: 'Comprendre l\'éviction des requêtes obsolètes lors d\'une frappe rapide',
      sectionId: 'dynamic-requests',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `simulerAnnulation(precedente: { annulee: boolean }): void` qui marque l\'objet précédent avec `annulee = true` lorsqu\'une nouvelle saisie intervient.',
      hint: 'Modifiez simplement la propriété `precedente.annulee = true`.',
      initialCode: `function simulerAnnulation(requeteEnCours: { annulee: boolean }): void {
  // Marquez la requête comme annulée :
}

const req1 = { annulee: false };
simulerAnnulation(req1);
console.log("Requête 1 annulée par la nouvelle frappe :", req1.annulee);
`,
      solutionCode: `function simulerAnnulation(requeteEnCours: { annulee: boolean }): void {
  requeteEnCours.annulee = true;
}

const req1 = { annulee: false };
simulerAnnulation(req1);
console.log("Requête 1 annulée par la nouvelle frappe :", req1.annulee);
`,
      isCompleted: false,
      solutionExplanation: [
        'Lors d\'une frappe continue, le serveur reçoit plusieurs requêtes successives.',
        'L\'annulation automatique via `AbortSignal` permet d\'ignorer immédiatement la réponse obsolète.',
        'Cela résout définitivement les bugs critiques de désynchronisation (*Race Conditions*).'
      ],
      criteria: [
        {
          id: 'c44-abort',
          label: 'Passage du drapeau à true',
          description: 'La requête précédente passe son état annulee à true.',
          passed: false,
          hint: 'Assignez true à annulee'
        },
        {
          id: 'c44-exec',
          label: 'Validation en console',
          description: 'Affiche true pour la requête annulée.',
          passed: false,
          hint: 'Exécutez pour valider'
        }
      ]
    },

    // =========================================================================
    // LABO 5 : Machine à États & Ergonomie UI (4 exercices)
    // =========================================================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: 'Décodage de l\'Enum ResourceStatus',
      subtitle: 'Traduire les états de la machine réseau en libellés français clairs',
      sectionId: 'resource-lifecycle',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction `traduireStatut(status: number): string` qui retourne : "En veille" (Idle/0), "Échec" (Error/1), "Premier chargement" (Loading/2), "Actualisation" (Reloading/3), "Données prêtes" (Resolved/4), ou "Mutation locale" (Local/5).',
      hint: 'Utilisez un `switch` ou indexez un dictionnaire d\'états.',
      initialCode: `function traduireStatut(status: number): string {
  // Associez chaque valeur de ResourceStatus à son libellé en français
  return "";
}

console.log("Statut 2 :", traduireStatut(ResourceStatus.Loading));
console.log("Statut 3 :", traduireStatut(ResourceStatus.Reloading));
console.log("Statut 4 :", traduireStatut(ResourceStatus.Resolved));
`,
      solutionCode: `function traduireStatut(status: number): string {
  switch (status) {
    case ResourceStatus.Idle: return "En veille";
    case ResourceStatus.Error: return "Échec";
    case ResourceStatus.Loading: return "Premier chargement";
    case ResourceStatus.Reloading: return "Actualisation";
    case ResourceStatus.Resolved: return "Données prêtes";
    case ResourceStatus.Local: return "Mutation locale";
    default: return "Inconnu";
  }
}

console.log("Statut 2 :", traduireStatut(ResourceStatus.Loading));
console.log("Statut 3 :", traduireStatut(ResourceStatus.Reloading));
console.log("Statut 4 :", traduireStatut(ResourceStatus.Resolved));
`,
      isCompleted: false,
      solutionExplanation: [
        '`ResourceStatus` est une énumération TypeScript numérique stricte de 0 à 5.',
        'Elle décrit avec exactitude chaque phase du cycle de vie réseau.',
        'Traduire ces états permet de concevoir des interfaces utilisateur riches et explicites.'
      ],
      criteria: [
        {
          id: 'c51-enum',
          label: 'Support de tous les statuts',
          description: 'La fonction prend en charge Loading, Reloading, Resolved, Idle, Error.',
          passed: false,
          hint: 'Vérifiez les valeurs de l\'énumération'
        },
        {
          id: 'c51-exec',
          label: 'Affichage des libellés exacts',
          description: 'Affiche Premier chargement, Actualisation et Données prêtes.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Détection du Premier Chargement (Loading)',
      subtitle: 'Afficher le spinner uniquement lors du premier affichage',
      sectionId: 'resource-lifecycle',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez le prédicat `doitAfficherSpinner(res: any): boolean` qui retourne `true` UNIQUEMENT lorsque `res.status() === ResourceStatus.Loading`. Lors d\'un rafraîchissement (`Reloading`), il doit impérativement retourner `false`.',
      hint: 'Comparez directement `res.status() === ResourceStatus.Loading`.',
      initialCode: `function doitAfficherSpinner(res: any): boolean {
  // Retournez true UNIQUEMENT pour ResourceStatus.Loading
  return false;
}

const mockResLoading = { status: () => ResourceStatus.Loading };
const mockResReloading = { status: () => ResourceStatus.Reloading };

console.log("Afficher spinner (Loading) :", doitAfficherSpinner(mockResLoading));
console.log("Afficher spinner (Reloading) :", doitAfficherSpinner(mockResReloading));
`,
      solutionCode: `function doitAfficherSpinner(res: any): boolean {
  return res && res.status() === ResourceStatus.Loading;
}

const mockResLoading = { status: () => ResourceStatus.Loading };
const mockResReloading = { status: () => ResourceStatus.Reloading };

console.log("Afficher spinner (Loading) :", doitAfficherSpinner(mockResLoading));
console.log("Afficher spinner (Reloading) :", doitAfficherSpinner(mockResReloading));
`,
      isCompleted: false,
      solutionExplanation: [
        'Lors du premier affichage (`Loading`), aucune donnée n\'existe : le spinner plein écran est légitime.',
        'Lors d\'un rafraîchissement (`Reloading`), les anciennes données sont encore présentes.',
        'Remplacer les données visibles par un spinner provoquerait un clignotement désagréable.'
      ],
      criteria: [
        {
          id: 'c52-loading',
          label: 'Ciblage exclusif de Loading',
          description: 'Retourne true pour Loading, false pour Reloading et Resolved.',
          passed: false,
          hint: 'Vérifiez la comparaison'
        },
        {
          id: 'c52-exec',
          label: 'Sortie console conforme',
          description: 'Affiche true puis false.',
          passed: false,
          hint: 'Exécutez pour tester'
        }
      ]
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: 'Détection de l\'Actualisation Discrète (Reloading)',
      subtitle: 'Afficher un badge discret d\'actualisation sans masquer la vue',
      sectionId: 'resource-lifecycle',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez le prédicat `doitAfficherBadgeActualisation(res: any): boolean` qui retourne `true` UNIQUEMENT lorsque `res.status() === ResourceStatus.Reloading`.',
      hint: 'Testez `res.status() === ResourceStatus.Reloading`.',
      initialCode: `function doitAfficherBadgeActualisation(res: any): boolean {
  // Retournez true UNIQUEMENT pour ResourceStatus.Reloading
  return false;
}

const mockResLoading = { status: () => ResourceStatus.Loading };
const mockResReloading = { status: () => ResourceStatus.Reloading };

console.log("Afficher badge (Loading) :", doitAfficherBadgeActualisation(mockResLoading));
console.log("Afficher badge (Reloading) :", doitAfficherBadgeActualisation(mockResReloading));
`,
      solutionCode: `function doitAfficherBadgeActualisation(res: any): boolean {
  return res && res.status() === ResourceStatus.Reloading;
}

const mockResLoading = { status: () => ResourceStatus.Loading };
const mockResReloading = { status: () => ResourceStatus.Reloading };

console.log("Afficher badge (Loading) :", doitAfficherBadgeActualisation(mockResLoading));
console.log("Afficher badge (Reloading) :", doitAfficherBadgeActualisation(mockResReloading));
`,
      isCompleted: false,
      solutionExplanation: [
        'Le statut `Reloading` signale une mise à jour d\'arrière-plan.',
        'L\'ergonomie moderne recommande de conserver la liste visible et d\'afficher un badge non intrusif.',
        'Cela assure une fluidité maximale pour l\'utilisateur final.'
      ],
      criteria: [
        {
          id: 'c53-reloading',
          label: 'Ciblage de Reloading',
          description: 'Retourne true pour Reloading, false pour Loading.',
          passed: false,
          hint: 'Vérifiez ResourceStatus.Reloading'
        },
        {
          id: 'c53-exec',
          label: 'Sortie console conforme',
          description: 'Affiche false puis true.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-5-4',
      labNumber: 5,
      number: '5.4',
      title: 'Simulation du Template Control Flow',
      subtitle: 'Modéliser la cascade logique @if / @else if d\'un template Angular',
      sectionId: 'resource-lifecycle',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Écrivez la fonction `simulerRenduTemplate(res: any): string` qui reproduit le rendu template : si `res.error()` est présent -> `"VUE_ERREUR"`, sinon si `res.status() === ResourceStatus.Loading` -> `"VUE_SPINNER"`, sinon si `res.status() === ResourceStatus.Resolved` ou `Reloading` -> `"VUE_DONNEES"`, sinon -> `"VUE_VIDE"`.',
      hint: 'Respectez l\'ordre d\'évaluation : erreur d\'abord, puis chargement initial, puis affichage des données.',
      initialCode: `function simulerRenduTemplate(res: any): string {
  // Reproduisez la cascade @if / @else if du template
  return "";
}

console.log("Rendu Resolved :", simulerRenduTemplate({ error: () => null, status: () => ResourceStatus.Resolved }));
console.log("Rendu Loading :", simulerRenduTemplate({ error: () => null, status: () => ResourceStatus.Loading }));
console.log("Rendu Error :", simulerRenduTemplate({ error: () => ({ status: 500 }), status: () => ResourceStatus.Error }));
`,
      solutionCode: `function simulerRenduTemplate(res: any): string {
  if (res.error()) return "VUE_ERREUR";
  if (res.status() === ResourceStatus.Loading) return "VUE_SPINNER";
  if (res.status() === ResourceStatus.Resolved || res.status() === ResourceStatus.Reloading) return "VUE_DONNEES";
  return "VUE_VIDE";
}

console.log("Rendu Resolved :", simulerRenduTemplate({ error: () => null, status: () => ResourceStatus.Resolved }));
console.log("Rendu Loading :", simulerRenduTemplate({ error: () => null, status: () => ResourceStatus.Loading }));
console.log("Rendu Error :", simulerRenduTemplate({ error: () => ({ status: 500 }), status: () => ResourceStatus.Error }));
`,
      isCompleted: false,
      solutionExplanation: [
        'Dans le template natif Angular 22, le Control Flow (`@if`, `@else if`) gère les priorités d\'affichage.',
        'L\'erreur doit être interceptée en premier pour informer l\'utilisateur d\'une coupure réseau.',
        '`Reloading` conserve la vue des données active pendant le téléchargement du nouveau flux.'
      ],
      criteria: [
        {
          id: 'c54-flow',
          label: 'Priorités d\'affichage conformes',
          description: 'Gère correctement l\'erreur, le chargement, et les données résolues.',
          passed: false,
          hint: 'Vérifiez l\'ordre des conditions'
        },
        {
          id: 'c54-exec',
          label: 'Sortie console conforme',
          description: 'Affiche VUE_DONNEES, VUE_SPINNER et VUE_ERREUR.',
          passed: false,
          hint: 'Exécutez pour valider'
        }
      ]
    },

    // =========================================================================
    // LABO 6 : Le Pont POO : DTO vers Entité Vivante (5 exercices)
    // =========================================================================
    {
      id: 'ex-6-1',
      labNumber: 6,
      number: '6.1',
      title: 'Le Contrat DTO Passif',
      subtitle: 'Définir une interface RecipeDTO modélisant fidèlement le JSON brut',
      sectionId: 'dto-to-entity',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Définissez l\'interface TypeScript `RecipeDTO` comportant : `id: number`, `name: string`, `ingredients: string[]`, `prepTimeMinutes: number`, `cookTimeMinutes: number`, et `caloriesPerServing: number`.',
      hint: 'Une interface DTO ne contient aucune méthode ni constructeur : ce sont de simples données brutes.',
      initialCode: `// Définissez l'interface RecipeDTO ci-dessous :
interface RecipeDTO {
  // Complétez les 6 propriétés
}

const mockDto: RecipeDTO = {
  id: 1,
  name: "Pizza Margherita",
  ingredients: ["Farine", "Tomate", "Mozzarella"],
  prepTimeMinutes: 20,
  cookTimeMinutes: 15,
  caloriesPerServing: 650
};

console.log("DTO brut valide :", mockDto.name, "-", mockDto.ingredients.length, "ingrédients");
`,
      solutionCode: `interface RecipeDTO {
  id: number;
  name: string;
  ingredients: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  caloriesPerServing: number;
}

const mockDto: RecipeDTO = {
  id: 1,
  name: "Pizza Margherita",
  ingredients: ["Farine", "Tomate", "Mozzarella"],
  prepTimeMinutes: 20,
  cookTimeMinutes: 15,
  caloriesPerServing: 650
};

console.log("DTO brut valide :", mockDto.name, "-", mockDto.ingredients.length, "ingrédients");
`,
      isCompleted: false,
      solutionExplanation: [
        'Le DTO (Data Transfer Object) est le reflet fidèle du JSON transmis sur les câbles réseau.',
        'Il s\'exprime sous forme d\'interface TypeScript et s\'efface à la compilation.',
        'Il ne protège aucun invariant et ne porte aucune logique métier.'
      ],
      criteria: [
        {
          id: 'c61-interface',
          label: 'Définition de l\'interface RecipeDTO',
          description: 'L\'interface RecipeDTO est présente et typée.',
          passed: false,
          hint: 'Déclarez interface RecipeDTO'
        },
        {
          id: 'c61-props',
          label: 'Présence des 6 champs requis',
          description: 'id, name, ingredients, prepTimeMinutes, cookTimeMinutes, caloriesPerServing.',
          passed: false,
          hint: 'Vérifiez tous les champs'
        },
        {
          id: 'c61-exec',
          label: 'Création d\'un objet DTO valide',
          description: 'L\'objet test s\'exécute et s\'affiche en console.',
          passed: false,
          hint: 'Exécutez pour valider'
        }
      ]
    },
    {
      id: 'ex-6-2',
      labNumber: 6,
      number: '6.2',
      title: 'L\'Entité Métier Encapsulée',
      subtitle: 'Créer la classe Recipe avec champs privés, validation d\'invariants et getters',
      sectionId: 'dto-to-entity',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Créez la classe `Recipe` avec propriétés privées `#nom`, `#prep`, `#cuisson`. Validez dans le constructeur que le nom n\'est pas vide et que prep et cuisson sont >= 0 (sinon levez une `Error`). Exposez les getters `nom` et `tempsTotalMinutes` (somme de prep et cuisson).',
      hint: 'Utilisez `if (!nom || !nom.trim()) throw new Error("Nom requis");` et `#prep + #cuisson`.',
      initialCode: `class Recipe {
  #nom: string;
  #prep: number;
  #cuisson: number;

  constructor(nom: string, prep: number, cuisson: number) {
    // Validez les invariants et assignez les champs privés
  }

  get nom(): string {
    return this.#nom;
  }

  get tempsTotalMinutes(): number {
    return 0; // À compléter
  }
}

const r = new Recipe("Tarte aux pommes", 15, 30);
console.log("Recette :", r.nom, "- Durée totale :", r.tempsTotalMinutes, "min");
`,
      solutionCode: `class Recipe {
  #nom: string;
  #prep: number;
  #cuisson: number;

  constructor(nom: string, prep: number, cuisson: number) {
    if (!nom || !nom.trim()) throw new Error("Nom requis.");
    if (prep < 0 || cuisson < 0) throw new Error("Durées doivent être positives.");
    this.#nom = nom.trim();
    this.#prep = prep;
    this.#cuisson = cuisson;
  }

  get nom(): string {
    return this.#nom;
  }

  get tempsTotalMinutes(): number {
    return this.#prep + this.#cuisson;
  }
}

const r = new Recipe("Tarte aux pommes", 15, 30);
console.log("Recette :", r.nom, "- Durée totale :", r.tempsTotalMinutes, "min");
`,
      isCompleted: false,
      solutionExplanation: [
        'L\'entité métier protège son intégrité dès l\'instanciation dans son constructeur.',
        'Les champs privés `#field` garantissent une encapsulation inviolable au runtime.',
        'Les méthodes et accesseurs calculés (`tempsTotalMinutes`) font vivre les règles métier locales.'
      ],
      criteria: [
        {
          id: 'c62-private',
          label: 'Encapsulation avec champs privés',
          description: 'Utilisation de #nom, #prep, #cuisson.',
          passed: false,
          hint: 'Utilisez la syntaxe #private'
        },
        {
          id: 'c62-invariants',
          label: 'Validation des invariants',
          description: 'Le constructeur lève une exception en cas de données invalides.',
          passed: false,
          hint: 'Testez if (!nom) throw new Error()'
        },
        {
          id: 'c62-getter',
          label: 'Calcul du temps total',
          description: 'Le getter tempsTotalMinutes retourne 45 min pour 15 + 30.',
          passed: false,
          hint: 'Sommez #prep et #cuisson'
        }
      ]
    },
    {
      id: 'ex-6-3',
      labNumber: 6,
      number: '6.3',
      title: 'La Fabrique Statique fromDTO()',
      subtitle: 'Ressusciter le prototype et instancier la classe depuis le DTO inerte',
      sectionId: 'dto-to-entity',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Ajoutez la méthode statique `Recipe.fromDTO(dto: any): Recipe` qui extrait les propriétés du DTO pour instancier la classe `Recipe`. Vérifiez avec `instanceof` que le prototype est bien restauré.',
      hint: 'Utilisez `static fromDTO(dto: any): Recipe { return new Recipe(dto.name, dto.prepTimeMinutes, dto.cookTimeMinutes); }`.',
      initialCode: `class Recipe {
  constructor(public nom: string, public prep: number, public cuisson: number) {}

  get tempsTotalMinutes(): number {
    return this.prep + this.cuisson;
  }

  // Implémentez la méthode statique fromDTO :
}

const dto = { name: "Pâtes Carbonara", prepTimeMinutes: 10, cookTimeMinutes: 12 };
const r = (Recipe as any).fromDTO ? (Recipe as any).fromDTO(dto) : null;

if (r) {
  console.log("Instance de Recipe :", r instanceof Recipe);
  console.log("Méthode fonctionnelle :", r.tempsTotalMinutes, "min");
}
`,
      solutionCode: `class Recipe {
  constructor(public nom: string, public prep: number, public cuisson: number) {}

  get tempsTotalMinutes(): number {
    return this.prep + this.cuisson;
  }

  static fromDTO(dto: any): Recipe {
    return new Recipe(dto.name, dto.prepTimeMinutes, dto.cookTimeMinutes);
  }
}

const dto = { name: "Pâtes Carbonara", prepTimeMinutes: 10, cookTimeMinutes: 12 };
const r = Recipe.fromDTO(dto);

console.log("Instance de Recipe :", r instanceof Recipe);
console.log("Méthode fonctionnelle :", r.tempsTotalMinutes, "min");
`,
      isCompleted: false,
      solutionExplanation: [
        'Le cast naïf `as Recipe` trompe le compilateur mais laisse un objet JSON orphelin sans méthode.',
        'La fabrique statique `fromDTO()` invoque le véritable mot-clé `new`, attachant la chaîne de prototypes.',
        '`r instanceof Recipe` redevient `true`, et tous les calculs de classe s\'exécutent sans faille.'
      ],
      criteria: [
        {
          id: 'c63-static',
          label: 'Présence de static fromDTO()',
          description: 'La méthode statique fromDTO est implémentée sur la classe Recipe.',
          passed: false,
          hint: 'Déclarez static fromDTO'
        },
        {
          id: 'c63-instance',
          label: 'Restauration du prototype (instanceof)',
          description: 'L\'objet réhydraté satisfait r instanceof Recipe === true.',
          passed: false,
          hint: 'Instanciez avec new Recipe()'
        },
        {
          id: 'c63-exec',
          label: 'Appel de méthode concluant',
          description: 'Affiche 22 min pour 10 + 12.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-6-4',
      labNumber: 6,
      number: '6.4',
      title: 'Réhydratation Récursive (Composition POO)',
      subtitle: 'Réhydrater l\'entité Recipe et ses composants Ingredient imbriqués',
      sectionId: 'dto-to-entity',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Une recette EST COMPOSÉE d\'ingrédients. Implémentez la classe `Ingredient` avec la fabrique `Ingredient.fromDTO(libelle: string)`. Mettez à jour `Recipe.fromDTO` pour réhydrater récursivement la liste `dto.ingredients.map(Ingredient.fromDTO)`.',
      hint: 'Utilisez `dto.ingredients.map((chaine: string) => Ingredient.fromDTO(chaine))`.',
      initialCode: `class Ingredient {
  constructor(public nom: string) {}

  static fromDTO(libelle: string): Ingredient {
    return new Ingredient(libelle.trim());
  }
}

class Recipe {
  constructor(public nom: string, public ingredients: Ingredient[]) {}

  static fromDTO(dto: any): Recipe {
    // Réhydratez les ingrédients récursivement avec Ingredient.fromDTO
    return new Recipe(dto.name, []);
  }
}

const dto = {
  name: "Salade César",
  ingredients: ["Laitue romaine", "Croûtons", "Parmesan"]
};

const r = Recipe.fromDTO(dto);
console.log("Recette réhydratée :", r.nom);
console.log("Composant 1 est Ingredient :", r.ingredients[0] instanceof Ingredient);
`,
      solutionCode: `class Ingredient {
  constructor(public nom: string) {}

  static fromDTO(libelle: string): Ingredient {
    return new Ingredient(libelle.trim());
  }
}

class Recipe {
  constructor(public nom: string, public ingredients: Ingredient[]) {}

  static fromDTO(dto: any): Recipe {
    const ings = (dto.ingredients || []).map((i: string) => Ingredient.fromDTO(i));
    return new Recipe(dto.name, ings);
  }
}

const dto = {
  name: "Salade César",
  ingredients: ["Laitue romaine", "Croûtons", "Parmesan"]
};

const r = Recipe.fromDTO(dto);
console.log("Recette réhydratée :", r.nom);
console.log("Composant 1 est Ingredient :", r.ingredients[0] instanceof Ingredient);
`,
      isCompleted: false,
      solutionExplanation: [
        'Dans les modèles objet riches, les objets sont composés d\'autres objets métier ou d\'objets-valeurs.',
        'La réhydratation doit être récursive pour réveiller chaque niveau de l\'arborescence de données.',
        'À l\'issue de la transformation, l\'arbre entier est composé d\'instances vivantes protégées.'
      ],
      criteria: [
        {
          id: 'c64-ing-from',
          label: 'Fabrique Ingredient.fromDTO',
          description: 'La classe Ingredient dispose de sa méthode statique fromDTO.',
          passed: false,
          hint: 'Vérifiez Ingredient.fromDTO'
        },
        {
          id: 'c64-recipe-map',
          label: 'Mappage récursif dans Recipe',
          description: 'Recipe.fromDTO réhydrate chaque élément du tableau ingredients.',
          passed: false,
          hint: 'Utilisez dto.ingredients.map(...)'
        },
        {
          id: 'c64-exec',
          label: 'Validation des prototypes imbriqués',
          description: 'Affiche true pour r.ingredients[0] instanceof Ingredient.',
          passed: false,
          hint: 'Exécutez pour valider'
        }
      ]
    },
    {
      id: 'ex-6-5',
      labNumber: 6,
      number: '6.5',
      title: 'Le Pont Réactif Final (httpResource + computed)',
      subtitle: 'Connecter la ressource HTTP déclarative au flux d\'entités réhydratées',
      sectionId: 'dto-to-entity',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Dans un service Angular, déclarez `recettesResource = httpResource<any[]>("https://api.fake.com/recipes")`. Créez ensuite le signal `recettes = computed<Recipe[]>(...)` qui transforme le tableau de DTOs en instances de `Recipe` via `Recipe.fromDTO`.',
      hint: 'Utilisez `computed(() => (recettesResource.value() || []).map(Recipe.fromDTO))`.',
      initialCode: `class Recipe {
  constructor(public nom: string) {}
  static fromDTO(dto: any): Recipe {
    return new Recipe(dto.name || dto.titre || "Recette sans nom");
  }
}

// 1. Ressource HTTP :
const recettesResource = httpResource("https://api.fake.com/recipes");

// 2. Pont réactif DTO -> Entités :
const recettes = null;

if (recettes) {
  const premiere = (recettes as any)()[0];
  console.log("Première recette réhydratée :", premiere?.nom);
  console.log("Est instance de Recipe :", premiere instanceof Recipe);
}
`,
      solutionCode: `class Recipe {
  constructor(public nom: string) {}
  static fromDTO(dto: any): Recipe {
    return new Recipe(dto.name || dto.titre || "Recette sans nom");
  }
}

const recettesResource = httpResource("https://api.fake.com/recipes");

const recettes = computed(() => {
  const dtos = recettesResource.value() || [];
  return dtos.map((dto: any) => Recipe.fromDTO(dto));
});

const premiere = recettes()[0];
console.log("Première recette réhydratée :", premiere?.nom);
console.log("Est instance de Recipe :", premiere instanceof Recipe);
`,
      isCompleted: false,
      solutionExplanation: [
        'C\'est la quintessence du patron architectural de la Séance 17 !',
        '`httpResource()` gère le réseau de façon asynchrone et non-bloquante sans plomberie.',
        '`computed()` applique la fabrique `fromDTO()` de manière pure et réactive.',
        'La vue Angular manipule exclusivement des objets métier vivants, robustes et encapsulés.'
      ],
      criteria: [
        {
          id: 'c65-bridge',
          label: 'Création du signal réactif computed',
          description: 'recettes est un signal calculé connectant la ressource aux entités.',
          passed: false,
          hint: 'Utilisez computed()'
        },
        {
          id: 'c65-map-from',
          label: 'Application de Recipe.fromDTO',
          description: 'Chaque élément du tableau est converti par la fabrique.',
          passed: false,
          hint: 'Utilisez .map(Recipe.fromDTO)'
        },
        {
          id: 'c65-exec',
          label: 'Validation finale du prototype',
          description: 'Affiche "Est instance de Recipe : true".',
          passed: false,
          hint: 'Exécutez pour valider l\'exercice final'
        }
      ]
    }
  ];

  readonly exercises = signal<Exercise[]>(
    this.exerciseDefinitions.map(def => ({ ...def, currentCode: def.initialCode }))
  );

  readonly activeExercise = computed<Exercise>(() => {
    const list = this.exercises();
    const idx = this.activeExerciseIndex();
    return list[idx] || list[0];
  });

  readonly totalCount = computed(() => this.exercises().length);
  readonly completedCount = computed(() => this.exercises().filter(e => e.isCompleted).length);
  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  selectExercise(id: string): void {
    const idx = this.exercises().findIndex(e => e.id === id);
    if (idx !== -1) {
      this.activeExerciseIndex.set(idx);
    }
  }

  setFilterLab(labNumber: number | null): void {
    this.filterLab.set(labNumber);
    if (labNumber !== null) {
      const firstInLab = this.exercises().findIndex(e => e.labNumber === labNumber);
      if (firstInLab !== -1) {
        this.activeExerciseIndex.set(firstInLab);
      }
    }
  }

  updateCurrentCode(exerciseId: string, code: string): void {
    this.exercises.update(list =>
      list.map(ex => (ex.id === exerciseId ? { ...ex, currentCode: code } : ex))
    );
    this.saveToStorage();
  }

  injectSolution(exerciseId: string): void {
    this.exercises.update(list =>
      list.map(ex => (ex.id === exerciseId ? { ...ex, currentCode: ex.solutionCode } : ex))
    );
    this.saveToStorage();
  }

  resetExercise(exerciseId: string): void {
    this.resetExerciseCode(exerciseId);
  }

  resetExerciseCode(exerciseId: string): void {
    this.exercises.update(list =>
      list.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            currentCode: ex.initialCode,
            isCompleted: false,
            criteria: ex.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return ex;
      })
    );
    this.saveToStorage();
  }

  validateExercise(exerciseId?: string, overrideCode?: string): { success: boolean; logs: ConsoleLogEntry[]; error?: string } {
    const targetId = exerciseId ?? this.activeExercise().id;
    const exercise = this.exercises().find(e => e.id === targetId);
    if (!exercise) {
      return { success: false, logs: [] };
    }
    return this.evaluate(targetId, overrideCode ?? exercise.currentCode, 'student');
  }

  /** Critères qui sont déjà verts sur le code de départ NON modifié (mis en cache). */
  private readonly baselineGreenCache = new Map<string, Set<string>>();

  private getBaselineGreen(id: string): Set<string> {
    const cached = this.baselineGreenCache.get(id);
    if (cached) return cached;
    const ex = this.exercises().find(e => e.id === id);
    const green = new Set<string>();
    if (ex) {
      const res = this.evaluate(id, ex.initialCode, 'baseline');
      (res.criteria ?? []).filter(c => c.passed).forEach(c => green.add(c.id));
    }
    this.baselineGreenCache.set(id, green);
    return green;
  }

  private evaluate(targetId: string, rawCode: string, mode: 'baseline' | 'student'): { success: boolean; logs: ConsoleLogEntry[]; error?: string; criteria?: ValidationCriterion[] } {
    const currentEx = this.exercises().find(e => e.id === targetId);
    if (!currentEx) {
      return { success: false, logs: [] };
    }

    const code = stripComments(rawCode);
    const exec = this.transpiler.executeCode(rawCode);

    const updatedCriteria = currentEx.criteria.map(c => ({ ...c }));
    let allPassed = false;

    switch (targetId) {
      // Labo 1
      case 'ex-1-1': {
        const hasEncode = /encodeURIComponent\s*\(/.test(code);
        const hasFormat = /tag=/.test(code) && (/\?tag=/.test(code) || /\$\{base\}\?tag=/.test(code) || /base\s*\+\s*["']\?tag=/.test(code));
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("caf%C3%A9%20%26%20th%C3%A9") || l.text.includes("café") || l.text.includes("%20"));
        updatedCriteria[0].passed = hasEncode;
        updatedCriteria[1].passed = hasFormat;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasEncode && hasFormat && compilesOk;
        break;
      }
      case 'ex-1-2': {
        const has5Verbs = /GET/.test(code) && /POST/.test(code) && /PUT/.test(code) && /DELETE/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("POST")) &&
          exec.logs.some(l => l.text.includes("DELETE"));
        updatedCriteria[0].passed = has5Verbs;
        updatedCriteria[1].passed = compilesOk;
        allPassed = has5Verbs && compilesOk;
        break;
      }
      case 'ex-1-3': {
        const hasRanges = (/200/.test(code) || /Succès/.test(code)) &&
          (/400/.test(code) || /Client/.test(code)) &&
          (/500/.test(code) || /Serveur/.test(code));
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Succès")) &&
          exec.logs.some(l => l.text.includes("Erreur Client")) &&
          exec.logs.some(l => l.text.includes("Erreur Serveur"));
        updatedCriteria[0].passed = hasRanges;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasRanges && compilesOk;
        break;
      }
      case 'ex-1-4': {
        const hasIdempotents = /GET/.test(code) && /PUT/.test(code) && /DELETE/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("GET est idempotent : true")) &&
          exec.logs.some(l => l.text.includes("POST est idempotent : false")) &&
          exec.logs.some(l => l.text.includes("DELETE est idempotent : true"));
        updatedCriteria[0].passed = hasIdempotents;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasIdempotents && compilesOk;
        break;
      }

      // Labo 2
      case 'ex-2-1': {
        const hasProvide = /provideHttpClient\s*\(/.test(code);
        const hasFetch = /withFetch\s*\(/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Nombre de providers déclarés : 1") || l.text.includes("providers déclarés : 1"));
        updatedCriteria[0].passed = hasProvide;
        updatedCriteria[1].passed = hasFetch;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasProvide && hasFetch && compilesOk;
        break;
      }
      case 'ex-2-2': {
        const hasFix = /provideHttpClient/.test(code) && /withFetch/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Provider réparé présent : true"));
        updatedCriteria[0].passed = hasFix;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasFix && compilesOk;
        break;
      }
      case 'ex-2-3': {
        const hasInspect = /features/.test(code) || /kind/.test(code) || /fetch/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Fetch supporté : true"));
        updatedCriteria[0].passed = hasInspect;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasInspect && compilesOk;
        break;
      }

      // Labo 3
      case 'ex-3-1': {
        const hasResource = /httpResource\s*(?:<[^>]*>)?\s*\(/.test(code);
        const compilesOk = exec.success && (
          exec.logs.some(l => l.text.includes("Chargement en cours :")) ||
          exec.logs.some(l => l.text.includes("Données disponibles :"))
        );
        updatedCriteria[0].passed = hasResource;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasResource && compilesOk;
        break;
      }
      case 'ex-3-2': {
        const hasComputed = /computed\s*\(/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Total articles réactif : 2") || l.text.includes("Total articles réactif :"));
        updatedCriteria[0].passed = hasComputed;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasComputed && compilesOk;
        break;
      }
      case 'ex-3-3': {
        const hasReload = /\.reload\s*\(/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("reload()") || l.text.includes("rechargement"));
        updatedCriteria[0].passed = hasReload;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasReload && compilesOk;
        break;
      }
      case 'ex-3-4': {
        const hasComputedErr = /computed\s*\(/.test(code) && /\.error\s*\(/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Ressource introuvable"));
        updatedCriteria[0].passed = hasComputedErr;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasComputedErr && compilesOk;
        break;
      }

      // Labo 4
      case 'ex-4-1': {
        const hasSignal = /signal\s*\(\s*1\s*\)/.test(code);
        const hasUrlFn = /httpResource\s*\(\s*\(\s*\)\s*=>/.test(code) || /httpResource\s*\(\s*function/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("page : 1"));
        updatedCriteria[0].passed = hasSignal;
        updatedCriteria[1].passed = hasUrlFn;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasSignal && hasUrlFn && compilesOk;
        break;
      }
      case 'ex-4-2': {
        const hasUndefined = /return\s+undefined/.test(code) && /length\s*<\s*3/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("suspendue : 0") || l.text.includes("suspendue : Idle"));
        updatedCriteria[0].passed = hasUndefined;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasUndefined && compilesOk;
        break;
      }
      case 'ex-4-3': {
        const hasTwoSignals = /terme\s*\(\s*\)/.test(code) && /categorie\s*\(\s*\)/.test(code);
        const hasEncode = /encodeURIComponent/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("multicritères prête"));
        updatedCriteria[0].passed = hasTwoSignals;
        updatedCriteria[1].passed = hasEncode;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasTwoSignals && hasEncode && compilesOk;
        break;
      }
      case 'ex-4-4': {
        const hasFlag = /annulee\s*=\s*true/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("annulée par la nouvelle frappe : true"));
        updatedCriteria[0].passed = hasFlag;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasFlag && compilesOk;
        break;
      }

      // Labo 5
      case 'ex-5-1': {
        const hasAllStatuses = /Loading/.test(code) && /Reloading/.test(code) && /Resolved/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Premier chargement")) &&
          exec.logs.some(l => l.text.includes("Actualisation")) &&
          exec.logs.some(l => l.text.includes("Données prêtes"));
        updatedCriteria[0].passed = hasAllStatuses;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasAllStatuses && compilesOk;
        break;
      }
      case 'ex-5-2': {
        const hasCheckLoading = /ResourceStatus\.Loading/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Afficher spinner (Loading) : true")) &&
          exec.logs.some(l => l.text.includes("Afficher spinner (Reloading) : false"));
        updatedCriteria[0].passed = hasCheckLoading;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasCheckLoading && compilesOk;
        break;
      }
      case 'ex-5-3': {
        const hasCheckReloading = /ResourceStatus\.Reloading/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Afficher badge (Loading) : false")) &&
          exec.logs.some(l => l.text.includes("Afficher badge (Reloading) : true"));
        updatedCriteria[0].passed = hasCheckReloading;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasCheckReloading && compilesOk;
        break;
      }
      case 'ex-5-4': {
        const hasTemplateFlow = /VUE_ERREUR/.test(code) && /VUE_SPINNER/.test(code) && /VUE_DONNEES/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Rendu Resolved : VUE_DONNEES")) &&
          exec.logs.some(l => l.text.includes("Rendu Loading : VUE_SPINNER")) &&
          exec.logs.some(l => l.text.includes("Rendu Error : VUE_ERREUR"));
        updatedCriteria[0].passed = hasTemplateFlow;
        updatedCriteria[1].passed = compilesOk;
        allPassed = hasTemplateFlow && compilesOk;
        break;
      }

      // Labo 6
      case 'ex-6-1': {
        const hasInterface = /interface\s+RecipeDTO/.test(code);
        const hasProperties = /id\s*:\s*number/.test(code) &&
          /name\s*:\s*string/.test(code) &&
          /ingredients\s*:\s*(?:string\[\]|readonly\s*string\[\]|Array<string>)/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("DTO brut valide :"));
        updatedCriteria[0].passed = hasInterface;
        updatedCriteria[1].passed = hasProperties;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasInterface && hasProperties && compilesOk;
        break;
      }
      case 'ex-6-2': {
        const hasPrivate = /#nom/.test(code) && /#prep/.test(code) && /#cuisson/.test(code);
        const hasInvariants = /throw\s+new\s+Error/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Durée totale : 45 min"));
        updatedCriteria[0].passed = hasPrivate;
        updatedCriteria[1].passed = hasInvariants;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasPrivate && hasInvariants && compilesOk;
        break;
      }
      case 'ex-6-3': {
        const hasStatic = /static\s+fromDTO\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Instance de Recipe : true")) &&
          exec.logs.some(l => l.text.includes("Méthode fonctionnelle : 22 min"));
        updatedCriteria[0].passed = hasStatic;
        updatedCriteria[1].passed = compilesOk;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasStatic && compilesOk;
        break;
      }
      case 'ex-6-4': {
        const hasIngFrom = /class\s+Ingredient/.test(code) && /static\s+fromDTO/.test(code);
        const hasMap = /map\s*\(/.test(code) && /Ingredient\.fromDTO/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Composant 1 est Ingredient : true"));
        updatedCriteria[0].passed = hasIngFrom;
        updatedCriteria[1].passed = hasMap;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasIngFrom && hasMap && compilesOk;
        break;
      }
      case 'ex-6-5': {
        const hasBridge = /computed\s*\(/.test(code);
        const hasMapFrom = /Recipe\.fromDTO/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Est instance de Recipe : true"));
        updatedCriteria[0].passed = hasBridge;
        updatedCriteria[1].passed = hasMapFrom;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasBridge && hasMapFrom && compilesOk;
        break;
      }
    }

    if (mode === 'baseline') {
      return { success: allPassed, logs: exec.logs, error: exec.error, criteria: updatedCriteria };
    }

    // Les critères « gratuits » (déjà verts sur le code de départ non modifié, ex. « aucun new »)
    // ne s'allument qu'une fois tout le travail réel accompli : plus de validation « offerte ».
    const baselineGreen = this.getBaselineGreen(targetId);
    const workDone = updatedCriteria.filter(c => !baselineGreen.has(c.id)).every(c => c.passed);
    if (!workDone) {
      updatedCriteria.forEach(c => {
        if (baselineGreen.has(c.id)) c.passed = false;
      });
      allPassed = false;
    }

    this.exercises.update(list =>
      list.map(e =>
        e.id === targetId
          ? { ...e, currentCode: rawCode, isCompleted: allPassed, criteria: updatedCriteria }
          : e
      )
    );

    this.saveToStorage();

    return { success: allPassed, logs: exec.logs, error: exec.error, criteria: updatedCriteria };
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = this.exercises().map(e => ({
        id: e.id,
        currentCode: e.currentCode,
        isCompleted: e.isCompleted,
        criteria: e.criteria.map(c => ({ id: c.id, passed: c.passed }))
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignorer
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed: Array<{ id: string; currentCode: string; isCompleted: boolean; criteria: Array<{ id: string; passed: boolean }> }> = JSON.parse(raw);
      this.exercises.update(list => {
        return list.map(ex => {
          const saved = parsed.find(p => p.id === ex.id);
          if (!saved) return ex;
          return {
            ...ex,
            currentCode: saved.currentCode || ex.currentCode,
            isCompleted: saved.isCompleted ?? false,
            criteria: ex.criteria.map(c => {
              const savedCrit = saved.criteria?.find(sc => sc.id === c.id);
              return savedCrit ? { ...c, passed: savedCrit.passed } : c;
            })
          };
        });
      });
    } catch {
      // Ignorer
    }
  }
}
