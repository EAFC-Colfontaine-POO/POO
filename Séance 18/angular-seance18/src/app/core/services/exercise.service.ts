import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { stripComments } from './validation-utils';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance18_exercises_v1';
  private readonly transpiler: TypescriptTranspilerService;

  constructor(customTranspiler?: TypescriptTranspilerService) {
    this.transpiler = customTranspiler ?? inject(TypescriptTranspilerService, { optional: true }) ?? new TypescriptTranspilerService();
    this.loadFromStorage();
  }

  readonly activeExerciseIndex = signal<number>(0);

  /** Définitions des 19 micro-exercices répartis en 5 labos */
  private readonly exerciseDefinitions: Omit<Exercise, 'currentCode'>[] = [
    // =========================================================================
    // LABO 1 : Maîtrise de l'API & Pièges Primitifs (4 exercices)
    // =========================================================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Stockage & Lecture Typée',
      subtitle: 'Manipuler setItem / getItem avec valeur par défaut',
      sectionId: 'storage-api',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement: 'Écrivez deux fonctions : `sauvegarderTheme(theme: "clair" | "sombre"): void` qui enregistre le thème sous la clé "app_theme", et `lireTheme(): "clair" | "sombre"` qui lit cette clé. Si la clé n\'existe pas (ou vaut null), renvoyer "clair".',
      hint: 'Utilisez `localStorage.setItem("app_theme", theme)` et `localStorage.getItem("app_theme") ?? "clair"`.',
      initialCode: `// 1. Sauvegarder le thème sous la clé "app_theme" :
function sauvegarderTheme(theme: "clair" | "sombre"): void {
  // Complétez ici :
}

// 2. Lire le thème (renvoyer "clair" si null ou absent) :
function lireTheme(): "clair" | "sombre" {
  // Complétez ici :
  return "clair";
}

// Tests :
sauvegarderTheme("sombre");
console.log("Thème lu après sauvegarde :", lireTheme());
localStorage.removeItem("app_theme");
console.log("Thème lu après suppression (défaut) :", lireTheme());
`,
      solutionCode: `function sauvegarderTheme(theme: "clair" | "sombre"): void {
  localStorage.setItem("app_theme", theme);
}

function lireTheme(): "clair" | "sombre" {
  const val = localStorage.getItem("app_theme");
  return (val === "sombre" || val === "clair") ? val : "clair";
}

sauvegarderTheme("sombre");
console.log("Thème lu après sauvegarde :", lireTheme());
localStorage.removeItem("app_theme");
console.log("Thème lu après suppression (défaut) :", lireTheme());
`,
      isCompleted: false,
      solutionExplanation: [
        'LocalStorage ne stocke que des chaînes de caractères brutes.',
        'getItem() renvoie `string | null` : il faut toujours tester la présence et renvoyer une valeur de repli.',
        'La comparaison garantit le respect du type union strict "clair" | "sombre".'
      ],
      criteria: [
        {
          id: 'c1-set',
          label: 'Utilisation de localStorage.setItem',
          description: 'La fonction sauvegarderTheme doit persister la clé "app_theme".',
          passed: false,
          hint: 'Appelez localStorage.setItem("app_theme", theme)'
        },
        {
          id: 'c1-get',
          label: 'Utilisation de localStorage.getItem & repli',
          description: 'lireTheme doit lire la clé et renvoyer "clair" si absente.',
          passed: false,
          hint: 'Vérifiez si le retour de getItem est nul pour renvoyer "clair"'
        },
        {
          id: 'c1-exec',
          label: 'Exécution réussie',
          description: 'La console affiche le thème sombre puis le repli clair.',
          passed: false,
          hint: 'Exécutez pour vérifier la console'
        }
      ]
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Le Piège du Booléen "false"',
      subtitle: 'Éviter le piège de la chaîne non-vide truthy',
      sectionId: 'storage-api',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Corrigez la fonction `estPremiereVisite(): boolean`. Actuellement elle fait l\'erreur classique `if (localStorage.getItem("visite"))`. Faites en sorte qu\'elle lise la clé "visite", désérialise proprement avec `JSON.parse` ou une comparaison stricte, et renvoie un vrai booléen (`true` par défaut si absente).',
      hint: 'La chaîne "false" est non-vide donc truthy en JS ! Utilisez `JSON.parse(val)` ou `val !== "false"`.',
      initialCode: `// Corrigez cette fonction pour ne plus tomber dans le piège de la chaîne "false" :
function estPremiereVisite(): boolean {
  const brut = localStorage.getItem("visite");
  // 💣 BUG À CORRIGER : if (brut) évalue à true même si brut === "false" !
  if (brut) {
    return true;
  }
  return false;
}

// Tests :
localStorage.setItem("visite", "false");
console.log("Visite avec chaîne 'false' :", estPremiereVisite()); // Doit afficher false !
localStorage.removeItem("visite");
console.log("Visite si clé absente :", estPremiereVisite()); // Doit afficher true !
`,
      solutionCode: `function estPremiereVisite(): boolean {
  const brut = localStorage.getItem("visite");
  if (brut === null) return true;
  return brut === "true";
}

localStorage.setItem("visite", "false");
console.log("Visite avec chaîne 'false' :", estPremiereVisite());
localStorage.removeItem("visite");
console.log("Visite si clé absente :", estPremiereVisite());
`,
      isCompleted: false,
      solutionExplanation: [
        'En JavaScript, Boolean("false") === true car toute chaîne non vide est truthy.',
        'Il faut soit comparer explicitement `brut === "true"`, soit utiliser `JSON.parse(brut)`.',
        'Gérer le cas `null` permet d\'affecter la valeur métier souhaitée pour la première visite.'
      ],
      criteria: [
        {
          id: 'c2-fix',
          label: 'Correction du test naïf',
          description: 'Ne doit plus contenir le test naïf `if (brut)` ou `if (localStorage.getItem)`.',
          passed: false,
          hint: 'Remplacez la vérification implicite par une comparaison stricte ou JSON.parse'
        },
        {
          id: 'c2-eval',
          label: 'Conversion booléenne réelle',
          description: 'La fonction doit comparer "true" ou utiliser JSON.parse.',
          passed: false,
          hint: 'Utilisez brut === "true" ou JSON.parse(brut)'
        },
        {
          id: 'c2-exec',
          label: 'Exécution réussie',
          description: 'La console affiche false pour "false", et true pour une clé absente.',
          passed: false,
          hint: 'Vérifiez vos retours dans la console'
        }
      ]
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Le Compteur Numérique',
      subtitle: 'Éviter la concaténation textuelle "0" + 1 = "01"',
      sectionId: 'storage-api',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction `incrementerVisites(): number` qui lit le compteur sous la clé "visites_total", convertit la chaîne en nombre (avec `Number()` ou `parseInt()`), incrémente de 1, enregistre la nouvelle valeur dans `localStorage` sous forme de chaîne et retourne le nouveau total numérique.',
      hint: 'Utilisez `const total = Number(localStorage.getItem("visites_total") ?? 0) + 1;` puis `setItem`.',
      initialCode: `function incrementerVisites(): number {
  // 1. Lire "visites_total"
  // 2. Convertir en nombre et ajouter 1
  // 3. Sauvegarder dans localStorage
  // 4. Retourner le nombre à jour
  return 0;
}

// Tests :
localStorage.setItem("visites_total", "0");
console.log("Passage 1 :", incrementerVisites()); // Doit afficher 1 (et pas "01" !)
console.log("Passage 2 :", incrementerVisites()); // Doit afficher 2
`,
      solutionCode: `function incrementerVisites(): number {
  const brut = localStorage.getItem("visites_total");
  const count = Number(brut ?? 0) + 1;
  localStorage.setItem("visites_total", String(count));
  return count;
}

localStorage.setItem("visites_total", "0");
console.log("Passage 1 :", incrementerVisites());
console.log("Passage 2 :", incrementerVisites());
`,
      isCompleted: false,
      solutionExplanation: [
        'Sans conversion, `"0" + 1` donne la chaîne `"01"` par concaténation textuelle.',
        '`Number()` ou `parseInt()` convertit la chaîne en primitive `number`.',
        'La réécriture se fait via `String(count)` ou `count.toString()`.'
      ],
      criteria: [
        {
          id: 'c3-convert',
          label: 'Conversion numérique explicite',
          description: 'Le code doit utiliser Number(), parseInt() ou le préfixe +.',
          passed: false,
          hint: 'Utilisez Number(...) ou parseInt(...)'
        },
        {
          id: 'c3-save',
          label: 'Sauvegarde du nouveau compteur',
          description: 'La fonction doit appeler localStorage.setItem("visites_total", ...).',
          passed: false,
          hint: 'Enregistrez le nouveau score dans localStorage'
        },
        {
          id: 'c3-exec',
          label: 'Exécution réussie',
          description: 'La console affiche Passage 1 : 1 et Passage 2 : 2.',
          passed: false,
          hint: 'Vérifiez que 0 s\'incrémente bien en 1 puis 2'
        }
      ]
    },
    {
      id: 'ex-1-4',
      labNumber: 1,
      number: '1.4',
      title: 'Nettoyage Ciblé vs Global',
      subtitle: 'Purger un préfixe sans écraser les clés tierces du domaine',
      sectionId: 'storage-api',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Écrivez la fonction `nettoyerPrefixe(prefixe: string): number` qui supprime uniquement les clés commençant par `prefixe` (ex: "app_"). Retournez le nombre de clés supprimées. INTERDICTION FORMELLE d\'utiliser `localStorage.clear()` car cela détruirait les clés tierces du domaine !',
      hint: 'Récupérez d\'abord les clés à supprimer dans un tableau (ex: via `Object.keys(localStorage)` ou boucle `localStorage.key(i)`), puis bouclez dessus pour appeler `removeItem`.',
      initialCode: `function nettoyerPrefixe(prefixe: string): number {
  // Rappel : localStorage.clear() est INTERDIT ici !
  // 1. Lister les clés correspondantes
  // 2. Supprimer chaque clé trouvée
  // 3. Retourner le nombre de suppressions
  return 0;
}

// Tests :
localStorage.setItem("app_theme", "sombre");
localStorage.setItem("app_lang", "fr");
localStorage.setItem("session_token", "ne_pas_toucher");

const suppr = nettoyerPrefixe("app_");
console.log("Clés app_ supprimées :", suppr);
console.log("session_token préservé :", localStorage.getItem("session_token") !== null);
`,
      solutionCode: `function nettoyerPrefixe(prefixe: string): number {
  const clesASupprimer: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefixe)) {
      clesASupprimer.push(k);
    }
  }

  for (const k of clesASupprimer) {
    localStorage.removeItem(k);
  }

  return clesASupprimer.length;
}

localStorage.setItem("app_theme", "sombre");
localStorage.setItem("app_lang", "fr");
localStorage.setItem("session_token", "ne_pas_toucher");

const suppr = nettoyerPrefixe("app_");
console.log("Clés app_ supprimées :", suppr);
console.log("session_token préservé :", localStorage.getItem("session_token") !== null);
`,
      isCompleted: false,
      solutionExplanation: [
        '`localStorage.clear()` est destructeur car il vide l\'intégralité du domaine partagé.',
        'Il faut collecter d\'abord les clés dans un tableau tampon avant de les supprimer, pour éviter de décaler les index en cours d\'itération.',
        'La méthode `startsWith()` permet un ciblage précis du préfixe namespace.'
      ],
      criteria: [
        {
          id: 'c4-no-clear',
          label: 'Interdiction de clear()',
          description: 'Le code ne doit PAS appeler localStorage.clear().',
          passed: false,
          hint: 'N\'utilisez pas localStorage.clear()'
        },
        {
          id: 'c4-remove',
          label: 'Suppression sélective par removeItem',
          description: 'Le code doit appeler localStorage.removeItem() pour chaque clé ciblée.',
          passed: false,
          hint: 'Appelez localStorage.removeItem(cle)'
        },
        {
          id: 'c4-exec',
          label: 'Exécution réussie',
          description: 'Supprime 2 clés préfixées et conserve session_token.',
          passed: false,
          hint: 'Vérifiez les logs console'
        }
      ]
    },

    // =========================================================================
    // LABO 2 : Résilience, Quota & Données Corrompues (4 exercices)
    // =========================================================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Sauvegarde Sécurisée & Quota',
      subtitle: 'Intercepter DOMException sans crasher l\'application',
      sectionId: 'event-loop-quota',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction `sauvegarderSecurise(cle: string, valeur: string): boolean` qui écrit dans `localStorage` à l\'intérieur d\'un bloc `try / catch`. Si l\'écriture réussit, renvoyer `true`. Si une exception est levée (comme `QuotaExceededError` ou stockage bloqué), capturer l\'erreur, afficher un message d\'erreur dans la console et renvoyer `false`.',
      hint: 'Utilisez `try { localStorage.setItem(cle, valeur); return true; } catch (err) { ... return false; }`.',
      initialCode: `function sauvegarderSecurise(cle: string, valeur: string): boolean {
  // Encapsulez l'appel dans un bloc try / catch robuste :
  return false;
}

// Tests :
const ok = sauvegarderSecurise("config", "valeur_valide");
console.log("Sauvegarde réussie :", ok);
`,
      solutionCode: `function sauvegarderSecurise(cle: string, valeur: string): boolean {
  try {
    localStorage.setItem(cle, valeur);
    return true;
  } catch (erreur) {
    console.error("[Storage] Échec de sauvegarde pour", cle, erreur);
    return false;
  }
}

const ok = sauvegarderSecurise("config", "valeur_valide");
console.log("Sauvegarde réussie :", ok);
`,
      isCompleted: false,
      solutionExplanation: [
        'En navigation privée stricte ou lorsque les 5 Mo sont pleins, `setItem` jette une `DOMException`.',
        'Sans `try / catch`, cette exception non interceptée stoppe net le rendu Angular.',
        'Retourner un booléen permet à l\'appelant d\'adapter son comportement de manière gracieuse.'
      ],
      criteria: [
        {
          id: 'c21-try',
          label: 'Structure try / catch',
          description: 'La méthode doit contenir un bloc try / catch.',
          passed: false,
          hint: 'Ajoutez un bloc try / catch'
        },
        {
          id: 'c21-ret',
          label: 'Retour booléen de statut',
          description: 'Doit retourner true en cas de succès et false en cas d\'erreur.',
          passed: false,
          hint: 'Renvoyez true dans le try et false dans le catch'
        },
        {
          id: 'c21-exec',
          label: 'Exécution réussie',
          description: 'La console affiche la confirmation de sauvegarde réussie.',
          passed: false,
          hint: 'Vérifiez les logs console'
        }
      ]
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Lecture Tolérante aux Pannes (Fault-Tolerant)',
      subtitle: 'Absorber les SyntaxError de JSON.parse sans écran blanc',
      sectionId: 'event-loop-quota',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction générique `lireJSONSecurise<T>(cle: string, repli: T): T` qui lit une clé dans `localStorage`. Si la clé est absente (null) ou si son contenu est un JSON syntaxiquement corrompu (`SyntaxError`), la fonction doit absorber l\'erreur et renvoyer la valeur de `repli`.',
      hint: 'Utilisez `try { const b = localStorage.getItem(cle); if (!b) return repli; return JSON.parse(b); } catch { return repli; }`.',
      initialCode: `function lireJSONSecurise<T>(cle: string, repli: T): T {
  // Complétez ici avec protection try/catch et retour de repli :
  return repli;
}

// Tests :
localStorage.setItem("panier_valide", JSON.stringify(["Livre POO", "Clavier"]));
localStorage.setItem("panier_corrompu", "{ id: 1, broken_json...");

console.log("Lecture valide :", lireJSONSecurise("panier_valide", []));
console.log("Lecture corrompue (repli attendu) :", lireJSONSecurise("panier_corrompu", []));
`,
      solutionCode: `function lireJSONSecurise<T>(cle: string, repli: T): T {
  const brut = localStorage.getItem(cle);
  if (!brut) return repli;
  try {
    return JSON.parse(brut) as T;
  } catch (err) {
    console.warn("[Storage] JSON corrompu pour la clé", cle, "- Repli activé");
    return repli;
  }
}

localStorage.setItem("panier_valide", JSON.stringify(["Livre POO", "Clavier"]));
localStorage.setItem("panier_corrompu", "{ id: 1, broken_json...");

console.log("Lecture valide :", lireJSONSecurise("panier_valide", []));
console.log("Lecture corrompue (repli attendu) :", lireJSONSecurise("panier_corrompu", []));
`,
      isCompleted: false,
      solutionExplanation: [
        'Un JSON peut être altéré manuellement par l\'utilisateur ou par une écriture interrompue.',
        '`JSON.parse()` jette immédiatement un `SyntaxError` bloquant.',
        'La valeur de repli typée garantit la robustesse du composant qui reçoit toujours un conteneur valide.'
      ],
      criteria: [
        {
          id: 'c22-try',
          label: 'Protection JSON.parse avec try/catch',
          description: 'L\'appel JSON.parse doit être protégé dans un try/catch.',
          passed: false,
          hint: 'Enveloppez JSON.parse dans un try / catch'
        },
        {
          id: 'c22-repli',
          label: 'Retour de la valeur de repli',
          description: 'Doit renvoyer repli si null ou en cas de catch.',
          passed: false,
          hint: 'Retournez repli en cas d\'erreur'
        },
        {
          id: 'c22-exec',
          label: 'Exécution réussie',
          description: 'La console affiche le tableau valide puis le repli vide [] sans crasher.',
          passed: false,
          hint: 'Vérifiez la sortie console'
        }
      ]
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Le Gardien SSR & Navigation Privée',
      subtitle: 'Vérifier la disponibilité réelle de window.localStorage',
      sectionId: 'event-loop-quota',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Écrivez la fonction `estStorageDisponible(): boolean` qui teste si `localStorage` est utilisable. Elle doit vérifier que `typeof window !== "undefined"` (garde SSR) et exécuter un test sonde d\'écriture et de suppression (`setItem` puis `removeItem` d\'une clé test) dans un `try/catch`. Renvoyez `true` si le test réussit, `false` sinon.',
      hint: 'Créez une clé test `const k = "__probe__"`, écrivez, supprimez et renvoyez true. Capturez toute exception pour renvoyer false.',
      initialCode: `function estStorageDisponible(): boolean {
  // 1. Vérifier que window et localStorage existent (SSR)
  // 2. Tester une écriture/suppression sonde avec try/catch
  // 3. Renvoyer true ou false
  return false;
}

// Tests :
console.log("Storage disponible dans cet environnement :", estStorageDisponible());
`,
      solutionCode: `function estStorageDisponible(): boolean {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return false;
  }
  try {
    const probe = "__storage_probe__";
    localStorage.setItem(probe, "ok");
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

console.log("Storage disponible dans cet environnement :", estStorageDisponible());
`,
      isCompleted: false,
      solutionExplanation: [
        'En Server-Side Rendering (Node.js), l\'objet `window` n\'existe pas : y accéder crashe le serveur.',
        'Dans certains navigateurs en navigation privée, `window.localStorage` existe mais lève une erreur dès le premier `setItem`.',
        'Le test sonde (probe write/remove) est la technique standard recommandée par le W3C et MDN.'
      ],
      criteria: [
        {
          id: 'c23-ssr',
          label: 'Garde SSR (window / localStorage)',
          description: 'Le code doit vérifier typeof window ou typeof localStorage.',
          passed: false,
          hint: 'Vérifiez typeof window ou typeof localStorage !== "undefined"'
        },
        {
          id: 'c23-probe',
          label: 'Test sonde d\'écriture / suppression',
          description: 'Doit exécuter setItem et removeItem dans un try/catch.',
          passed: false,
          hint: 'Écrivez puis supprimez une clé temporaire dans un try/catch'
        },
        {
          id: 'c23-exec',
          label: 'Exécution réussie',
          description: 'La console affiche true dans l\'environnement navigateur.',
          passed: false,
          hint: 'Exécutez pour vérifier le résultat'
        }
      ]
    },
    {
      id: 'ex-2-4',
      labNumber: 2,
      number: '2.4',
      title: 'Purge d\'Urgence (Cache Eviction)',
      subtitle: 'Stratégie de secours en cas de QuotaExceededError',
      sectionId: 'event-loop-quota',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Écrivez `sauvegarderAvecEviction(cle: string, valeur: string, cleEviction: string): boolean`. Tentez d\'écrire `localStorage.setItem(cle, valeur)`. Si une exception est interceptée, supprimez `cleEviction` avec `localStorage.removeItem(cleEviction)` et retentez l\'écriture une seconde fois dans un nouveau try/catch. Renvoyez `true` si réussi, `false` sinon.',
      hint: 'Enveloppez le premier setItem dans un try/catch. Dans le catch, supprimez cleEviction et retentez dans un second try/catch.',
      initialCode: `function sauvegarderAvecEviction(cle: string, valeur: string, cleEviction: string): boolean {
  // Complétez la routine de purge d'urgence :
  return false;
}

// Tests :
localStorage.setItem("cache_temporaire", "grosses_donnees");
const ok = sauvegarderAvecEviction("mon_panier", "donnees_vitales", "cache_temporaire");
console.log("Sauvegarde après gestion d'éviction :", ok);
`,
      solutionCode: `function sauvegarderAvecEviction(cle: string, valeur: string, cleEviction: string): boolean {
  try {
    localStorage.setItem(cle, valeur);
    return true;
  } catch {
    console.warn("[Quota] Échec initial, purge de secours de :", cleEviction);
    localStorage.removeItem(cleEviction);
    try {
      localStorage.setItem(cle, valeur);
      return true;
    } catch (e2) {
      console.error("[Quota] Échec définitif même après purge", e2);
      return false;
    }
  }
}

localStorage.setItem("cache_temporaire", "grosses_donnees");
const ok = sauvegarderAvecEviction("mon_panier", "donnees_vitales", "cache_temporaire");
console.log("Sauvegarde après gestion d'éviction :", ok);
`,
      isCompleted: false,
      solutionExplanation: [
        'Lorsqu\'un quota est atteint, une stratégie LRU (Least Recently Used) permet de libérer de l\'espace.',
        'La routine supprime les caches temporaires secondaires pour prioriser les données vitales.',
        'La double tentative sécurisée évite tout arrêt brutal du processus applicatif.'
      ],
      criteria: [
        {
          id: 'c24-remove',
          label: 'Suppression de la clé d\'éviction',
          description: 'Le code doit appeler removeItem sur la clé de secours en cas d\'erreur.',
          passed: false,
          hint: 'Appelez localStorage.removeItem(cleEviction) dans le catch'
        },
        {
          id: 'c24-retry',
          label: 'Nouvelle tentative d\'écriture',
          description: 'Le code doit retenter setItem après l\'éviction.',
          passed: false,
          hint: 'Retentez l\'écriture après suppression'
        },
        {
          id: 'c24-exec',
          label: 'Exécution réussie',
          description: 'La console affiche true attestant du succès.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },

    // =========================================================================
    // LABO 3 : Le Choc POO & La Triade DTO (4 exercices)
    // =========================================================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Contrat DTO & Méthode toDTO()',
      subtitle: 'Extraire les données publiques pures d\'une entité encapsulée',
      sectionId: 'poo-clash',
      estimatedTime: '6 min',
      difficulty: 'Facile',
      statement: 'Définissez l\'interface `ArticleDTO` avec `id: string`, `nom: string`, `prixHT: number`. Créez la classe `Article` avec des champs privés natifs `#id`, `#nom`, `#prixHT`, un constructeur, un getter `prixTTC` (calculant `prixHT * 1.2`), et la méthode `toDTO(): ArticleDTO` exportant ses données.',
      hint: 'Utilisez `toDTO(): ArticleDTO { return { id: this.#id, nom: this.#nom, prixHT: this.#prixHT }; }`.',
      initialCode: `interface ArticleDTO {
  // Définissez les 3 champs ici :
}

class Article {
  readonly #id: string;
  readonly #nom: string;
  readonly #prixHT: number;

  constructor(id: string, nom: string, prixHT: number) {
    this.#id = id;
    this.#nom = nom;
    this.#prixHT = prixHT;
  }

  // 1. Getter prixTTC (HT * 1.2) :
  get prixTTC(): number {
    return 0;
  }

  // 2. Méthode toDTO() :
  toDTO(): ArticleDTO {
    // Complétez ici :
    return {} as any;
  }
}

// Tests :
const art = new Article("a1", "Écran 4K", 300);
console.log("Prix TTC calculé :", art.prixTTC);
console.log("DTO exporté :", art.toDTO());
`,
      solutionCode: `interface ArticleDTO {
  readonly id: string;
  readonly nom: string;
  readonly prixHT: number;
}

class Article {
  readonly #id: string;
  readonly #nom: string;
  readonly #prixHT: number;

  constructor(id: string, nom: string, prixHT: number) {
    this.#id = id;
    this.#nom = nom;
    this.#prixHT = prixHT;
  }

  get prixTTC(): number {
    return this.#prixHT * 1.2;
  }

  toDTO(): ArticleDTO {
    return {
      id: this.#id,
      nom: this.#nom,
      prixHT: this.#prixHT
    };
  }
}

const art = new Article("a1", "Écran 4K", 300);
console.log("Prix TTC calculé :", art.prixTTC);
console.log("DTO exporté :", art.toDTO());
`,
      isCompleted: false,
      solutionExplanation: [
        'Les champs privés `#` protègent l\'encapsulation et empêchent toute mutation non autorisée.',
        'La méthode `toDTO()` permet à l\'entité de décider elle-même des données qu\'elle divulgue pour la sérialisation.',
        'Le DTO est une structure inerte prête à être passée sans danger à `JSON.stringify()`.'
      ],
      criteria: [
        {
          id: 'c31-getter',
          label: 'Getter prixTTC calculé',
          description: 'Le getter prixTTC doit multiplier le prix HT par 1.2.',
          passed: false,
          hint: 'Calculez this.#prixHT * 1.2'
        },
        {
          id: 'c31-todto',
          label: 'Méthode toDTO conforme',
          description: 'toDTO doit renvoyer un objet contenant id, nom et prixHT.',
          passed: false,
          hint: 'Retournez { id, nom, prixHT }'
        },
        {
          id: 'c31-exec',
          label: 'Exécution réussie',
          description: 'La console affiche le prix TTC 360 et le DTO propre.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Fabrique de Réhydratation fromDTO()',
      subtitle: 'Ressusciter le prototype et revalider les invariants',
      sectionId: 'poo-clash',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Ajoutez à la classe `Article` la validation d\'invariant dans le constructeur (si `prixHT < 0`, jeter une `Error("Prix négatif interdit")`), et la fabrique statique `static fromDTO(dto: ArticleDTO): Article`. Vérifiez que l\'instance renvoyée est bien `instanceof Article` et relance la validation.',
      hint: '`static fromDTO(dto: ArticleDTO): Article { return new Article(dto.id, dto.nom, dto.prixHT); }`.',
      initialCode: `interface ArticleDTO {
  readonly id: string;
  readonly nom: string;
  readonly prixHT: number;
}

class Article {
  readonly #id: string;
  readonly #nom: string;
  readonly #prixHT: number;

  constructor(id: string, nom: string, prixHT: number) {
    // 1. Valider l'invariant : prixHT ne doit pas être négatif !
    this.#id = id;
    this.#nom = nom;
    this.#prixHT = prixHT;
  }

  get prixTTC(): number { return this.#prixHT * 1.2; }

  // 2. Déclarez la fabrique statique fromDTO ici :
}

// Tests :
const dtoValide: ArticleDTO = { id: "a2", nom: "Souris Ergonomique", prixHT: 50 };
const articleVivante = Article.fromDTO(dtoValide);

console.log("instanceof Article :", articleVivante instanceof Article);
console.log("Méthode/Getter actif :", articleVivante.prixTTC);
`,
      solutionCode: `interface ArticleDTO {
  readonly id: string;
  readonly nom: string;
  readonly prixHT: number;
}

class Article {
  readonly #id: string;
  readonly #nom: string;
  readonly #prixHT: number;

  constructor(id: string, nom: string, prixHT: number) {
    if (prixHT < 0) {
      throw new Error("Prix négatif interdit");
    }
    this.#id = id;
    this.#nom = nom;
    this.#prixHT = prixHT;
  }

  get prixTTC(): number { return this.#prixHT * 1.2; }

  static fromDTO(dto: ArticleDTO): Article {
    return new Article(dto.id, dto.nom, dto.prixHT);
  }
}

const dtoValide: ArticleDTO = { id: "a2", nom: "Souris Ergonomique", prixHT: 50 };
const articleVivante = Article.fromDTO(dtoValide);

console.log("instanceof Article :", articleVivante instanceof Article);
console.log("Méthode/Getter actif :", articleVivante.prixTTC);
`,
      isCompleted: false,
      solutionExplanation: [
        '`fromDTO()` est une méthode statique de fabrique (Factory Method).',
        'En réappelant `new Article(...)`, elle passe impérativement par le constructeur et réexécute la validation d\'invariants.',
        'L\'instance récupère son prototype complet : `instanceof Article` vaut à nouveau `true` !'
      ],
      criteria: [
        {
          id: 'c32-static',
          label: 'Méthode statique fromDTO',
          description: 'La classe Article doit définir static fromDTO(dto: ArticleDTO): Article.',
          passed: false,
          hint: 'Déclarez static fromDTO(dto: ArticleDTO): Article'
        },
        {
          id: 'c32-invar',
          label: 'Validation d\'invariant (prix négatif)',
          description: 'Le constructeur doit jeter une exception si prixHT < 0.',
          passed: false,
          hint: 'Vérifiez if (prixHT < 0) throw new Error(...)'
        },
        {
          id: 'c32-exec',
          label: 'Exécution réussie',
          description: 'La console affiche instanceof Article : true et le prix TTC 60.',
          passed: false,
          hint: 'Exécutez pour tester'
        }
      ]
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Résurrection des Dates',
      subtitle: 'Restaurer un objet Date à partir de sa chaîne ISO sérialisée',
      sectionId: 'poo-clash',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Concevez la classe `SessionUtilisateur` avec `#login: string` et `#dateConnexion: Date`. En JSON, une Date devient une chaîne textuelle ISO. Implémentez `toDTO(): SessionDTO` (avec `dateISO: string`) et `SessionUtilisateur.fromDTO(dto)` garantissant que `session.dateConnexion instanceof Date` est `true` !',
      hint: 'Dans toDTO: `dateISO: this.#date.toISOString()`. Dans fromDTO: `new Date(dto.dateISO)`.',
      initialCode: `interface SessionDTO {
  readonly login: string;
  readonly dateISO: string;
}

class SessionUtilisateur {
  readonly #login: string;
  readonly #dateConnexion: Date;

  constructor(login: string, dateConnexion: Date) {
    this.#login = login;
    this.#dateConnexion = dateConnexion;
  }

  get login(): string { return this.#login; }
  get dateConnexion(): Date { return this.#dateConnexion; }

  // 1. Implémentez toDTO() :
  toDTO(): SessionDTO {
    return {} as any;
  }

  // 2. Implémentez static fromDTO() :
  static fromDTO(dto: SessionDTO): SessionUtilisateur {
    return {} as any;
  }
}

// Tests :
const session = new SessionUtilisateur("ada_lovelace", new Date("2026-11-12T08:00:00Z"));
const dto = session.toDTO();
console.log("DTO textuel ISO :", dto.dateISO);

const restauree = SessionUtilisateur.fromDTO(dto);
console.log("dateConnexion instanceof Date :", restauree.dateConnexion instanceof Date);
console.log("Année restaurée :", restauree.dateConnexion.getFullYear());
`,
      solutionCode: `interface SessionDTO {
  readonly login: string;
  readonly dateISO: string;
}

class SessionUtilisateur {
  readonly #login: string;
  readonly #dateConnexion: Date;

  constructor(login: string, dateConnexion: Date) {
    this.#login = login;
    this.#dateConnexion = dateConnexion;
  }

  get login(): string { return this.#login; }
  get dateConnexion(): Date { return this.#dateConnexion; }

  toDTO(): SessionDTO {
    return {
      login: this.#login,
      dateISO: this.#dateConnexion.toISOString()
    };
  }

  static fromDTO(dto: SessionDTO): SessionUtilisateur {
    return new SessionUtilisateur(dto.login, new Date(dto.dateISO));
  }
}

const session = new SessionUtilisateur("ada_lovelace", new Date("2026-11-12T08:00:00Z"));
const dto = session.toDTO();
console.log("DTO textuel ISO :", dto.dateISO);

const restauree = SessionUtilisateur.fromDTO(dto);
console.log("dateConnexion instanceof Date :", restauree.dateConnexion instanceof Date);
console.log("Année restaurée :", restauree.dateConnexion.getFullYear());
`,
      isCompleted: false,
      solutionExplanation: [
        'JSON n\'a pas de type de données Date natif : `JSON.stringify` appelle automatiquement `.toISOString()`.',
        'À la relecture avec `JSON.parse`, la date reste une simple chaîne de caractères morte.',
        'C\'est la responsabilité de la méthode `fromDTO()` de réinstancier `new Date(dto.dateISO)` pour rendre ses méthodes vivantes.'
      ],
      criteria: [
        {
          id: 'c33-iso',
          label: 'Export ISO String',
          description: 'toDTO doit exporter dateConnexion avec toISOString().',
          passed: false,
          hint: 'Utilisez this.#dateConnexion.toISOString()'
        },
        {
          id: 'c33-date',
          label: 'Réinstanciation new Date',
          description: 'fromDTO doit reconstruire un objet Date via new Date(dto.dateISO).',
          passed: false,
          hint: 'Appelez new Date(dto.dateISO)'
        },
        {
          id: 'c33-exec',
          label: 'Exécution réussie',
          description: 'La console affiche instanceof Date : true et l\'année correspondante.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-3-4',
      labNumber: 3,
      number: '3.4',
      title: 'Sérialisation d\'une Collection d\'Entités',
      subtitle: 'Cycle complet Tableau d\'objets -> Disque -> Tableau d\'entités vivantes',
      sectionId: 'poo-clash',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Écrivez les fonctions `serialiserPanier(articles: Article[]): string` et `deserialiserPanier(json: string): Article[]`. La sérialisation doit mapper les articles via `.toDTO()` puis stringifier. La désérialisation doit parser le JSON puis mapper chaque DTO via `Article.fromDTO` pour garantir que chaque élément soit une vraie entité.',
      hint: 'Utilisez `JSON.stringify(articles.map(a => a.toDTO()))` et `(JSON.parse(json) as ArticleDTO[]).map(Article.fromDTO)`.',
      initialCode: `// Réutilisation de la classe Article et son ArticleDTO :
interface ArticleDTO { id: string; nom: string; prixHT: number; }

class Article {
  constructor(public id: string, public nom: string, public prixHT: number) {}
  get prixTTC(): number { return this.prixHT * 1.2; }
  toDTO(): ArticleDTO { return { id: this.id, nom: this.nom, prixHT: this.prixHT }; }
  static fromDTO(dto: ArticleDTO): Article { return new Article(dto.id, dto.nom, dto.prixHT); }
}

// 1. Sérialiser la collection en chaîne JSON :
function serialiserPanier(articles: Article[]): string {
  // Complétez ici :
  return "";
}

// 2. Désérialiser la chaîne JSON en vraies entités Article vivantes :
function deserialiserPanier(json: string): Article[] {
  // Complétez ici :
  return [];
}

// Tests :
const panier = [new Article("1", "Livre POO", 40), new Article("2", "Souris", 25)];
const texte = serialiserPanier(panier);
console.log("Texte JSON pour LocalStorage :", texte);

const restaures = deserialiserPanier(texte);
console.log("Tous instanceof Article :", restaures.length > 0 && restaures.every(a => a instanceof Article));
console.log("Calcul TTC premier article :", restaures[0]?.prixTTC);
`,
      solutionCode: `interface ArticleDTO { id: string; nom: string; prixHT: number; }

class Article {
  constructor(public id: string, public nom: string, public prixHT: number) {}
  get prixTTC(): number { return this.prixHT * 1.2; }
  toDTO(): ArticleDTO { return { id: this.id, nom: this.nom, prixHT: this.prixHT }; }
  static fromDTO(dto: ArticleDTO): Article { return new Article(dto.id, dto.nom, dto.prixHT); }
}

function serialiserPanier(articles: Article[]): string {
  const dtos = articles.map(a => a.toDTO());
  return JSON.stringify(dtos);
}

function deserialiserPanier(json: string): Article[] {
  if (!json) return [];
  const dtos: ArticleDTO[] = JSON.parse(json);
  return dtos.map(Article.fromDTO);
}

const panier = [new Article("1", "Livre POO", 40), new Article("2", "Souris", 25)];
const texte = serialiserPanier(panier);
console.log("Texte JSON pour LocalStorage :", texte);

const restaures = deserialiserPanier(texte);
console.log("Tous instanceof Article :", restaures.length > 0 && restaures.every(a => a instanceof Article));
console.log("Calcul TTC premier article :", restaures[0].prixTTC);
`,
      isCompleted: false,
      solutionExplanation: [
        'Lors de la sauvegarde d\'un tableau, `articles.map(a => a.toDTO())` nettoie chaque instance avant la sérialisation.',
        'À la relecture, `dtos.map(Article.fromDTO)` reconstruit une à une chaque instance avec son prototype et ses getters.',
        'Le tableau final contient 100% d\'objets vivants validant `instanceof Article`.'
      ],
      criteria: [
        {
          id: 'c34-ser',
          label: 'Sérialisation via toDTO et JSON.stringify',
          description: 'serialiserPanier doit mapper les articles en toDTO() avant JSON.stringify.',
          passed: false,
          hint: 'Utilisez articles.map(a => a.toDTO())'
        },
        {
          id: 'c34-deser',
          label: 'Désérialisation via Article.fromDTO',
          description: 'deserialiserPanier doit mapper les DTOs avec Article.fromDTO.',
          passed: false,
          hint: 'Utilisez dtos.map(Article.fromDTO)'
        },
        {
          id: 'c34-exec',
          label: 'Exécution réussie',
          description: 'La console atteste que tous les éléments sont instanceof Article avec TTC actif.',
          passed: false,
          hint: 'Vérifiez la sortie console'
        }
      ]
    },

    // =========================================================================
    // LABO 4 : Service Angular Signal-First (4 exercices)
    // =========================================================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Signal d\'Initialisation Sécurisé',
      subtitle: 'Encapsuler l\'état du service derrière un signal en lecture seule',
      sectionId: 'pocket-notes',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Dans une classe de service `NotesService`, déclarez un signal privé `readonly #notes = signal<string[]>(this.#charger())` et exposez publiquement sa version en lecture seule `readonly notes = this.#notes.asReadonly()`. La méthode privée `#charger()` doit lire la clé "notes_app" et renvoyer un tableau vide si absente.',
      hint: 'Utilisez `signal()`, `asReadonly()` et un champ privé `#notes`.',
      initialCode: `class NotesService {
  // 1. Déclarez le signal privé #notes :
  // 2. Exposez la propriété publique notes en lecture seule avec asReadonly() :

  #charger(): string[] {
    const b = localStorage.getItem("notes_app");
    return b ? JSON.parse(b) : [];
  }
}

// Tests :
localStorage.setItem("notes_app", JSON.stringify(["Note A", "Note B"]));
const service = new NotesService();

console.log("Nombre de notes initiales :", service.notes().length);
console.log("Contenu initial :", service.notes());
`,
      solutionCode: `class NotesService {
  readonly #notes = signal<string[]>(this.#charger());
  readonly notes = this.#notes.asReadonly();

  #charger(): string[] {
    const b = localStorage.getItem("notes_app");
    return b ? JSON.parse(b) : [];
  }
}

localStorage.setItem("notes_app", JSON.stringify(["Note A", "Note B"]));
const service = new NotesService();

console.log("Nombre de notes initiales :", service.notes().length);
console.log("Contenu initial :", service.notes());
`,
      isCompleted: false,
      solutionExplanation: [
        'Le signal privé `#notes` empêche les composants consommateurs d\'altérer l\'état directement avec `.set()`.',
        '`this.#notes.asReadonly()` expose un signal réactif immuable conforme au principe SRP (S11).',
        'L\'initialisation charge le stockage dès la construction du service.'
      ],
      criteria: [
        {
          id: 'c41-private',
          label: 'Signal privé #notes',
          description: 'Le service doit déclarer un champ privé #notes = signal(...).',
          passed: false,
          hint: 'Déclarez readonly #notes = signal(...)'
        },
        {
          id: 'c41-asreadonly',
          label: 'Exposition asReadonly()',
          description: 'Le service doit exposer la propriété notes via .asReadonly().',
          passed: false,
          hint: 'Exposez readonly notes = this.#notes.asReadonly()'
        },
        {
          id: 'c41-exec',
          label: 'Exécution réussie',
          description: 'La console affiche les 2 notes chargées depuis le stockage.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Computed Métier Réactif',
      subtitle: 'Calculer un dérivé réactif basé sur les méthodes de l\'entité',
      sectionId: 'pocket-notes',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Ajoutez dans le service une propriété `readonly nbUrgentes = computed(() => ...)` qui calcule en temps réel le nombre de notes dont la méthode métier `note.isUrgente()` renvoie `true`.',
      hint: 'Utilisez `computed(() => this.notes().filter(n => n.isUrgente()).length)`.',
      initialCode: `class NoteItem {
  constructor(public titre: string, public priorite: "normale" | "urgente") {}
  isUrgente(): boolean { return this.priorite === "urgente"; }
}

class NotesService {
  readonly #notes = signal<NoteItem[]>([
    new NoteItem("Rédiger rapport", "urgente"),
    new NoteItem("Arroser plantes", "normale"),
    new NoteItem("Sauvegarder BDD", "urgente")
  ]);

  readonly notes = this.#notes.asReadonly();

  // Déclarez le computed nbUrgentes ici :
}

// Tests :
const svc = new NotesService();
console.log("Total notes urgentes calculé :", svc.nbUrgentes());
`,
      solutionCode: `class NoteItem {
  constructor(public titre: string, public priorite: "normale" | "urgente") {}
  isUrgente(): boolean { return this.priorite === "urgente"; }
}

class NotesService {
  readonly #notes = signal<NoteItem[]>([
    new NoteItem("Rédiger rapport", "urgente"),
    new NoteItem("Arroser plantes", "normale"),
    new NoteItem("Sauvegarder BDD", "urgente")
  ]);

  readonly notes = this.#notes.asReadonly();
  readonly nbUrgentes = computed(() => this.notes().filter(n => n.isUrgente()).length);
}

const svc = new NotesService();
console.log("Total notes urgentes calculé :", svc.nbUrgentes());
`,
      isCompleted: false,
      solutionExplanation: [
        '`computed()` met en cache le calcul et ne se réexécute que lorsque le signal source change.',
        'La règle métier `note.isUrgente()` est encapsulée dans l\'objet et non disséminée dans l\'UI.',
        'Zéro abonnement RxJS, gestion propre et prévisible de la réactivité.'
      ],
      criteria: [
        {
          id: 'c42-comp',
          label: 'Déclaration computed()',
          description: 'Le service doit déclarer nbUrgentes avec computed().',
          passed: false,
          hint: 'Utilisez readonly nbUrgentes = computed(...)'
        },
        {
          id: 'c42-method',
          label: 'Appel de la méthode isUrgente()',
          description: 'Le filtre doit faire appel à n.isUrgente().',
          passed: false,
          hint: 'Appelez isUrgente() sur chaque note'
        },
        {
          id: 'c42-exec',
          label: 'Exécution réussie',
          description: 'La console affiche exactement 2 notes urgentes.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Mutation Synchronisée & Persistance',
      subtitle: 'Mettre à jour le signal et persister le tableau de DTOs',
      sectionId: 'pocket-notes',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Implémentez la méthode `ajouter(titre: string): void` dans `NotesService`. Elle doit instancier une nouvelle `NoteItem`, mettre à jour le signal `#notes` avec immutabilité (tableau étendu `[nouvelle, ...actuelles]`), et sauvegarder immédiatement le tableau sérialisé dans `localStorage.setItem("notes_app", ...)`.',
      hint: 'Utilisez `this.#notes.update(actuelles => [nouvelle, ...actuelles])` puis `this.#sauvegarder()`.',
      initialCode: `class NoteItem {
  constructor(public id: string, public titre: string) {}
}

class NotesService {
  readonly #notes = signal<NoteItem[]>([]);
  readonly notes = this.#notes.asReadonly();

  ajouter(titre: string): void {
    // 1. Instancier NoteItem avec un id unique
    // 2. Mettre à jour le signal #notes
    // 3. Persister dans localStorage sous "notes_app"
  }
}

// Tests :
const svc = new NotesService();
svc.ajouter("Apprendre Angular Signals");
console.log("Nombre après ajout :", svc.notes().length);
console.log("Contenu dans localStorage :", localStorage.getItem("notes_app"));
`,
      solutionCode: `class NoteItem {
  constructor(public id: string, public titre: string) {}
}

class NotesService {
  readonly #notes = signal<NoteItem[]>([]);
  readonly notes = this.#notes.asReadonly();

  ajouter(titre: string): void {
    const nouvelle = new NoteItem(String(Date.now()), titre);
    const maj = [nouvelle, ...this.#notes()];
    this.#notes.set(maj);
    localStorage.setItem("notes_app", JSON.stringify(maj));
  }
}

const svc = new NotesService();
svc.ajouter("Apprendre Angular Signals");
console.log("Nombre après ajout :", svc.notes().length);
console.log("Contenu dans localStorage :", localStorage.getItem("notes_app"));
`,
      isCompleted: false,
      solutionExplanation: [
        'L\'immutabilité `[nouvelle, ...anciennes]` permet au système de Signals d\'Angular de détecter instantanément le changement de référence.',
        'La persistance dans `localStorage` se fait dans la même transaction applicative.',
        'Le composant appelant n\'a aucun souci de persistance à gérer (responsabilité unique du service).'
      ],
      criteria: [
        {
          id: 'c43-inst',
          label: 'Création d\'une instance NoteItem',
          description: 'La méthode doit instancier un new NoteItem.',
          passed: false,
          hint: 'Instanciez new NoteItem(...)'
        },
        {
          id: 'c43-save',
          label: 'Mise à jour du signal et de localStorage',
          description: 'Doit mettre à jour le signal et persister avec setItem.',
          passed: false,
          hint: 'Mettez à jour #notes et appelez localStorage.setItem'
        },
        {
          id: 'c43-exec',
          label: 'Exécution réussie',
          description: 'La note apparaît dans le signal et dans le localStorage.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: 'Suppression Immuable & Synchronisation',
      subtitle: 'Nettoyer l\'état avec signal.update() et réécriture disque',
      sectionId: 'pocket-notes',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Implémentez `supprimer(id: string): void` dans `NotesService`. Filtrez la liste des notes avec `update()` ou `set()` pour retirer la note correspondant à l\'ID, puis réécrivez immédiatement la liste mise à jour dans `localStorage.setItem("notes_app", ...)`.',
      hint: 'Utilisez `const maj = this.#notes().filter(n => n.id !== id);` puis mettez à jour le signal et le stockage.',
      initialCode: `class NoteItem {
  constructor(public id: string, public titre: string) {}
}

class NotesService {
  readonly #notes = signal<NoteItem[]>([
    new NoteItem("n1", "Acheter café"),
    new NoteItem("n2", "Finir labo 4")
  ]);
  readonly notes = this.#notes.asReadonly();

  supprimer(id: string): void {
    // Complétez la suppression immuable et la persistance :
  }
}

// Tests :
const svc = new NotesService();
svc.supprimer("n1");
console.log("Notes restantes :", svc.notes().map(n => n.titre));
`,
      solutionCode: `class NoteItem {
  constructor(public id: string, public titre: string) {}
}

class NotesService {
  readonly #notes = signal<NoteItem[]>([
    new NoteItem("n1", "Acheter café"),
    new NoteItem("n2", "Finir labo 4")
  ]);
  readonly notes = this.#notes.asReadonly();

  supprimer(id: string): void {
    const maj = this.#notes().filter(n => n.id !== id);
    this.#notes.set(maj);
    localStorage.setItem("notes_app", JSON.stringify(maj));
  }
}

const svc = new NotesService();
svc.supprimer("n1");
console.log("Notes restantes :", svc.notes().map(n => n.titre));
`,
      isCompleted: false,
      solutionExplanation: [
        '`filter()` crée un nouveau tableau sans muter l\'ancien, garantissant l\'immutabilité pure.',
        'Le signal est mis à jour immédiatement, déclenchant le rafraîchissement réactif du template Angular.',
        'La réécriture dans LocalStorage garantit que le rechargement F5 reflète la suppression.'
      ],
      criteria: [
        {
          id: 'c44-filter',
          label: 'Filtrage par identifiant',
          description: 'Le code doit filtrer les notes avec n.id !== id.',
          passed: false,
          hint: 'Utilisez .filter(n => n.id !== id)'
        },
        {
          id: 'c44-sync',
          label: 'Synchronisation du signal et du disque',
          description: 'Doit mettre à jour le signal et réécrire dans localStorage.',
          passed: false,
          hint: 'Mettez à jour le signal et persistez avec setItem'
        },
        {
          id: 'c44-exec',
          label: 'Exécution réussie',
          description: 'Seule la note n2 subsiste après suppression.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },

    // =========================================================================
    // LABO 5 : Synchronisation Multi-Onglets (StorageEvent) (3 exercices)
    // =========================================================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: 'Listener d\'Événement Inter-Onglets',
      subtitle: 'Attacher l\'écouteur standard window.addEventListener("storage")',
      sectionId: 'multi-tabs',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction `configurerEcouteurStorage(callback: (cle: string | null, valeur: string | null) => void): void`. Elle doit attacher un listener sur `window.addEventListener("storage", (event: StorageEvent) => ...)` et transmettre `event.key` et `event.newValue` au callback.',
      hint: 'Utilisez `window.addEventListener("storage", (event: StorageEvent) => { callback(event.key, event.newValue); });`.',
      initialCode: `function configurerEcouteurStorage(callback: (cle: string | null, valeur: string | null) => void): void {
  // Attachez l'écouteur d'événement storage ici :
}

// Tests :
let cleCapturee = "";
configurerEcouteurStorage((cle, val) => {
  cleCapturee = cle ?? "";
  console.log("Événement storage intercepté ! Clé :", cle, "Nouvelle valeur :", val);
});

// Simulation d'un événement storage venant d'un autre onglet :
window.dispatchEvent({ key: "theme", newValue: "sombre" });
console.log("Test écouteur réussi :", cleCapturee === "theme");
`,
      solutionCode: `function configurerEcouteurStorage(callback: (cle: string | null, valeur: string | null) => void): void {
  window.addEventListener("storage", (event: any) => {
    callback(event.key, event.newValue);
  });
}

let cleCapturee = "";
configurerEcouteurStorage((cle, val) => {
  cleCapturee = cle ?? "";
  console.log("Événement storage intercepté ! Clé :", cle, "Nouvelle valeur :", val);
});

window.dispatchEvent({ key: "theme", newValue: "sombre" });
console.log("Test écouteur réussi :", cleCapturee === "theme");
`,
      isCompleted: false,
      solutionExplanation: [
        'L\'événement `"storage"` est un événement global diffusé par le navigateur.',
        '`event.key` contient le nom de la clé altérée par un autre onglet.',
        '`event.newValue` contient la nouvelle valeur persistée sur le disque.'
      ],
      criteria: [
        {
          id: 'c51-listen',
          label: 'Écoute window.addEventListener',
          description: 'Le code doit attacher un écouteur sur l\'événement "storage".',
          passed: false,
          hint: 'Appelez window.addEventListener("storage", ...)'
        },
        {
          id: 'c51-callback',
          label: 'Transmission des propriétés',
          description: 'Doit transmettre event.key et event.newValue au callback.',
          passed: false,
          hint: 'Transmettez event.key et event.newValue'
        },
        {
          id: 'c51-exec',
          label: 'Exécution réussie',
          description: 'La console confirme la capture de la clé "theme".',
          passed: false,
          hint: 'Vérifiez les logs console'
        }
      ]
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Filtrage Sélectif par Clé',
      subtitle: 'Ignorer les mutations tierces et réagir à l\'altération de l\'app',
      sectionId: 'multi-tabs',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Écrivez `synchroniserSiCleCible(event: { key: string | null }, cleCible: string, onUpdate: () => void): boolean`. La fonction doit appeler `onUpdate()` et renvoyer `true` SI `event.key === cleCible` OU si `event.key === null` (cas où un onglet a appelé `localStorage.clear()`). Pour toute autre clé tierce, ignorer et renvoyer `false`.',
      hint: 'Testez `if (event.key === cleCible || event.key === null) { onUpdate(); return true; } return false;`.',
      initialCode: `function synchroniserSiCleCible(
  event: { key: string | null },
  cleCible: string,
  onUpdate: () => void
): boolean {
  // Complétez le filtrage sélectif :
  return false;
}

// Tests :
let compteUpdates = 0;
const maj = () => compteUpdates++;

console.log("Clé tierce ignorée :", synchroniserSiCleCible({ key: "autre_app" }, "mes_notes", maj));
console.log("Clé ciblée acceptée :", synchroniserSiCleCible({ key: "mes_notes" }, "mes_notes", maj));
console.log("localStorage.clear() (clé null) accepté :", synchroniserSiCleCible({ key: null }, "mes_notes", maj));
console.log("Total mises à jour déclenchées :", compteUpdates); // Doit valoir 2 !
`,
      solutionCode: `function synchroniserSiCleCible(
  event: { key: string | null },
  cleCible: string,
  onUpdate: () => void
): boolean {
  if (event.key === cleCible || event.key === null) {
    onUpdate();
    return true;
  }
  return false;
}

let compteUpdates = 0;
const maj = () => compteUpdates++;

console.log("Clé tierce ignorée :", synchroniserSiCleCible({ key: "autre_app" }, "mes_notes", maj));
console.log("Clé ciblée acceptée :", synchroniserSiCleCible({ key: "mes_notes" }, "mes_notes", maj));
console.log("localStorage.clear() (clé null) accepté :", synchroniserSiCleCible({ key: null }, "mes_notes", maj));
console.log("Total mises à jour déclenchées :", compteUpdates);
`,
      isCompleted: false,
      solutionExplanation: [
        'Sur un même domaine, d\'autres scripts ou services écrivent dans LocalStorage.',
        'Filtrer par clé évite de déclencher des rechargements inutiles et coûteux pour des données étrangères.',
        'La spécification W3C indique que `event.key === null` lorsque `localStorage.clear()` a été appelé.'
      ],
      criteria: [
        {
          id: 'c52-key',
          label: 'Vérification de la clé cible',
          description: 'Doit vérifier event.key === cleCible.',
          passed: false,
          hint: 'Vérifiez event.key === cleCible'
        },
        {
          id: 'c52-null',
          label: 'Gestion de la clé null (clear)',
          description: 'Doit prendre en charge event.key === null.',
          passed: false,
          hint: 'Ajoutez la condition || event.key === null'
        },
        {
          id: 'c52-exec',
          label: 'Exécution réussie',
          description: 'La console affiche 2 mises à jour déclenchées.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: 'Déconnexion Inter-Onglets (Single Sign-Out)',
      subtitle: 'Sécuriser la déconnexion simultanée de tous les onglets ouverts',
      sectionId: 'multi-tabs',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Écrivez la fonction `surveillerDeconnexion(cleAuth: string, onDeconnecte: () => void): void`. Elle doit écouter `storage`. Dès qu\'un événement concerne `cleAuth` ET que `event.newValue === null` (ou supprimé), invoquer immédiatement le callback `onDeconnecte()`.',
      hint: 'Dans le listener storage : `if (event.key === cleAuth && event.newValue === null) onDeconnecte();`.',
      initialCode: `function surveillerDeconnexion(cleAuth: string, onDeconnecte: () => void): void {
  // Attachez le listener pour intercepter la suppression du jeton :
}

// Tests :
let deconnecte = false;
surveillerDeconnexion("auth_token", () => {
  deconnecte = true;
  console.log("Déconnexion inter-onglets déclenchée avec succès !");
});

// Simulation : l'utilisateur clique sur "Déconnexion" dans un autre onglet
window.dispatchEvent({ key: "auth_token", newValue: null });
console.log("Statut de déconnexion :", deconnecte);
`,
      solutionCode: `function surveillerDeconnexion(cleAuth: string, onDeconnecte: () => void): void {
  window.addEventListener("storage", (event: any) => {
    if (event.key === cleAuth && (event.newValue === null || event.newValue === undefined)) {
      onDeconnecte();
    }
  });
}

let deconnecte = false;
surveillerDeconnexion("auth_token", () => {
  deconnecte = true;
  console.log("Déconnexion inter-onglets déclenchée avec succès !");
});

window.dispatchEvent({ key: "auth_token", newValue: null });
console.log("Statut de déconnexion :", deconnecte);
`,
      isCompleted: false,
      solutionExplanation: [
        'Lorsqu\'un utilisateur se déconnecte dans l\'onglet A, le jeton est supprimé via `removeItem("auth_token")`.',
        'L\'événement `storage` diffuse alors `key: "auth_token"` et `newValue: null` vers tous les autres onglets.',
        'L\'onglet B intercepte la nouvelle et redirige immédiatement vers la page de login (Single Sign-Out).'
      ],
      criteria: [
        {
          id: 'c53-listen',
          label: 'Écoute de l\'événement storage',
          description: 'Le code doit attacher window.addEventListener("storage", ...).',
          passed: false,
          hint: 'Attachez l\'écouteur storage'
        },
        {
          id: 'c53-cond',
          label: 'Détection suppression du token (newValue === null)',
          description: 'Doit vérifier event.key === cleAuth et event.newValue === null.',
          passed: false,
          hint: 'Vérifiez event.key === cleAuth et event.newValue === null'
        },
        {
          id: 'c53-exec',
          label: 'Exécution réussie',
          description: 'La console confirme que le statut de déconnexion est true.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    }
  ];

  readonly exercises = signal<Exercise[]>([]);

  readonly activeExercise = computed<Exercise>(() => {
    const list = this.exercises();
    const idx = this.activeExerciseIndex();
    return list[idx] ?? list[0];
  });

  readonly totalCount = computed(() => this.exercises().length);
  readonly completedCount = computed(() => this.exercises().filter(e => e.isCompleted).length);
  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  private loadFromStorage(): void {
    const initialExercises: Exercise[] = this.exerciseDefinitions.map(def => ({
      ...def,
      currentCode: def.initialCode
    }));

    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              const target = initialExercises.find(e => e.id === item.id);
              if (target) {
                target.currentCode = item.currentCode ?? target.initialCode;
                target.isCompleted = !!item.isCompleted;
                if (Array.isArray(item.criteria)) {
                  target.criteria = target.criteria.map(c => {
                    const savedC = item.criteria.find((sc: any) => sc.id === c.id);
                    return savedC ? { ...c, passed: !!savedC.passed } : c;
                  });
                }
              }
            }
          }
        }
      } catch {
        // Ignorer si stockage corrompu
      }
    }

    this.exercises.set(initialExercises);
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const dataToSave = this.exercises().map(e => ({
        id: e.id,
        currentCode: e.currentCode,
        isCompleted: e.isCompleted,
        criteria: e.criteria.map(c => ({ id: c.id, passed: c.passed }))
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // Ignorer
    }
  }

  updateCode(id: string, code: string): void {
    this.exercises.update(list =>
      list.map(e => e.id === id ? { ...e, currentCode: code } : e)
    );
    this.saveToStorage();
  }

  resetCode(id: string): void {
    this.exercises.update(list =>
      list.map(e => {
        if (e.id === id) {
          return {
            ...e,
            currentCode: e.initialCode,
            isCompleted: false,
            criteria: e.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return e;
      })
    );
    this.saveToStorage();
  }

  validateExercise(exerciseId?: string, overrideCode?: string): { success: boolean; logs: ConsoleLogEntry[]; error?: string; criteria?: ValidationCriterion[] } {
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

  private evaluate(targetId: string, rawCode: string, mode: 'baseline' | 'student' = 'student'): { success: boolean; logs: ConsoleLogEntry[]; error?: string; criteria?: ValidationCriterion[] } {
    const currentEx = this.exercises().find(e => e.id === targetId);
    if (!currentEx) {
      return { success: false, logs: [] };
    }

    const code = stripComments(rawCode);
    const exec = this.transpiler.executeCode(rawCode);

    const updatedCriteria = currentEx.criteria.map(c => ({ ...c }));
    let allPassed = false;

    switch (targetId) {
      // =======================================================================
      // LABO 1 : API & Typage
      // =======================================================================
      case 'ex-1-1': {
        const hasSet = /localStorage\s*\.\s*setItem\s*\(/.test(code) && /app_theme/.test(code);
        const hasGet = /localStorage\s*\.\s*getItem\s*\(/.test(code) && /app_theme/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("sombre")) &&
          exec.logs.some(l => l.text.includes("clair"));

        updatedCriteria[0].passed = hasSet;
        updatedCriteria[1].passed = hasGet;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasSet && hasGet && compilesOk;
        break;
      }

      case 'ex-1-2': {
        const noNaiveIf = !/if\s*\(\s*brut\s*\)/.test(code) && !/if\s*\(\s*localStorage\.getItem/.test(code);
        const hasParseOrStrict = /JSON\s*\.\s*parse\s*\(/.test(code) || /===|!==/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("false") && l.text.includes("Visite avec")) &&
          exec.logs.some(l => l.text.includes("true") && l.text.includes("clé absente"));

        updatedCriteria[0].passed = noNaiveIf;
        updatedCriteria[1].passed = hasParseOrStrict;
        updatedCriteria[2].passed = compilesOk;
        allPassed = noNaiveIf && hasParseOrStrict && compilesOk;
        break;
      }

      case 'ex-1-3': {
        const hasNum = /Number\s*\(/.test(code) || /parseInt\s*\(/.test(code) || /\+\s*[a-zA-Z_$]/.test(code) || /\+\s*\(/.test(code);
        const hasSet = /localStorage\s*\.\s*setItem\s*\(/.test(code) && /visites_total/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => /Passage 1\s*:\s*1\b/.test(l.text)) &&
          exec.logs.some(l => /Passage 2\s*:\s*2\b/.test(l.text));

        updatedCriteria[0].passed = hasNum;
        updatedCriteria[1].passed = hasSet;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasNum && hasSet && compilesOk;
        break;
      }

      case 'ex-1-4': {
        const noClear = !/localStorage\s*\.\s*clear\s*\(/.test(code);
        const hasRemove = /localStorage\s*\.\s*removeItem\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("supprimées : 2") || l.text.includes("2")) &&
          exec.logs.some(l => l.text.includes("préservé : true"));

        updatedCriteria[0].passed = noClear;
        updatedCriteria[1].passed = hasRemove;
        updatedCriteria[2].passed = compilesOk;
        allPassed = noClear && hasRemove && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 2 : Résilience & Quota
      // =======================================================================
      case 'ex-2-1': {
        const hasTry = /try\s*\{/.test(code) && /catch\s*(?:\([^)]*\))?\s*\{/.test(code);
        const hasRetBool = /return\s+true\b/.test(code) && /return\s+false\b/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Sauvegarde réussie : true"));

        updatedCriteria[0].passed = hasTry;
        updatedCriteria[1].passed = hasRetBool;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasTry && hasRetBool && compilesOk;
        break;
      }

      case 'ex-2-2': {
        const hasTryAndParse = /try\s*\{[\s\S]*?JSON\s*\.\s*parse[\s\S]*?\}\s*catch/.test(code);
        const returnsRepli = /return\s+repli\b/.test(code) || (/repli/.test(code) && /return/.test(code));
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Livre POO") || l.text.includes("Clavier")) &&
          exec.logs.some(l => l.text.includes("Lecture corrompue") && (l.text.includes("[]") || l.text.includes("Array")));

        updatedCriteria[0].passed = hasTryAndParse;
        updatedCriteria[1].passed = returnsRepli;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasTryAndParse && returnsRepli && compilesOk;
        break;
      }

      case 'ex-2-3': {
        const hasSsrGuard = /typeof\s+window/.test(code) || /typeof\s+localStorage/.test(code) || /isPlatformBrowser/.test(code);
        const hasProbe = /setItem\s*\(/.test(code) && /removeItem\s*\(/.test(code) && /try\s*\{/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Storage disponible") && l.text.includes("true"));

        updatedCriteria[0].passed = hasSsrGuard;
        updatedCriteria[1].passed = hasProbe;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasSsrGuard && hasProbe && compilesOk;
        break;
      }

      case 'ex-2-4': {
        const hasRemove = /removeItem\s*\(\s*cleEviction\s*\)/.test(code) || /removeItem\s*\(/.test(code);
        const hasRetry = /setItem/.test(code) && (/catch[\s\S]*?setItem/.test(code) || /catch[\s\S]*?removeItem/.test(code));
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Sauvegarde après gestion d'éviction : true"));

        updatedCriteria[0].passed = hasRemove;
        updatedCriteria[1].passed = hasRetry;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasRemove && hasRetry && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 3 : Choc POO & DTO
      // =======================================================================
      case 'ex-3-1': {
        const hasGetter = /get\s+prixTTC\s*\(\s*\)/.test(code) && (/1\.2/.test(code) || /0\.2/.test(code) || /120/.test(code) || /prixHT/.test(code));
        const hasToDTO = /toDTO\s*\(\s*\)/.test(code) && /prixHT/.test(code) && /id/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Prix TTC calculé : 360") || l.text.includes("360")) &&
          exec.logs.some(l => l.text.includes("Écran 4K"));

        updatedCriteria[0].passed = hasGetter;
        updatedCriteria[1].passed = hasToDTO;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasGetter && hasToDTO && compilesOk;
        break;
      }

      case 'ex-3-2': {
        const hasStatic = /static\s+fromDTO\s*\(/.test(code);
        const hasInvariant = (/prixHT\s*<\s*0/.test(code) || /0\s*>\s*prixHT/.test(code) || /prixHT\s*<=\s*-?0/.test(code) || /prixHT\s*<=\s*-1/.test(code)) && /throw\s+(?:new\s+)?Error/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("instanceof Article : true")) &&
          exec.logs.some(l => l.text.includes("60"));

        updatedCriteria[0].passed = hasStatic;
        updatedCriteria[1].passed = hasInvariant;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasStatic && hasInvariant && compilesOk;
        break;
      }

      case 'ex-3-3': {
        const hasIso = /toISOString\s*\(/.test(code);
        const hasNewDate = /new\s+Date\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("instanceof Date : true")) &&
          exec.logs.some(l => l.text.includes("2026"));

        updatedCriteria[0].passed = hasIso;
        updatedCriteria[1].passed = hasNewDate;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasIso && hasNewDate && compilesOk;
        break;
      }

      case 'ex-3-4': {
        const hasSerMap = /\.map\s*\([^)]*toDTO/.test(code) || /toDTO/.test(code);
        const hasDeserMap = /fromDTO/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Tous instanceof Article : true")) &&
          exec.logs.some(l => l.text.includes("48"));

        updatedCriteria[0].passed = hasSerMap;
        updatedCriteria[1].passed = hasDeserMap;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasSerMap && hasDeserMap && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 4 : Services Angular Signal-First
      // =======================================================================
      case 'ex-4-1': {
        const hasPrivateSignal = /#notes(?:\s*:\s*[^=]+)?\s*=\s*signal\s*(?:<[^>]*>)?\s*\(/.test(code);
        const hasAsReadonly = /\.asReadonly\s*\(\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Nombre de notes initiales : 2")) &&
          exec.logs.some(l => l.text.includes("Note A"));

        updatedCriteria[0].passed = hasPrivateSignal;
        updatedCriteria[1].passed = hasAsReadonly;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasPrivateSignal && hasAsReadonly && compilesOk;
        break;
      }

      case 'ex-4-2': {
        const hasComputed = /computed\s*(?:<[^>]*>)?\s*\(/.test(code);
        const hasIsUrgente = /isUrgente\s*\(/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Total notes urgentes calculé : 2"));

        updatedCriteria[0].passed = hasComputed;
        updatedCriteria[1].passed = hasIsUrgente;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasComputed && hasIsUrgente && compilesOk;
        break;
      }

      case 'ex-4-3': {
        const hasInst = /new\s+NoteItem\s*\(/.test(code);
        const hasSave = /setItem\s*\(/.test(code) && (/set\s*\(/.test(code) || /update\s*\(/.test(code));
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Nombre après ajout : 1")) &&
          exec.logs.some(l => l.text.includes("Apprendre Angular Signals"));

        updatedCriteria[0].passed = hasInst;
        updatedCriteria[1].passed = hasSave;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasInst && hasSave && compilesOk;
        break;
      }

      case 'ex-4-4': {
        const hasFilter = /\.filter\s*\([\s\S]*?\bid\b/.test(code);
        const hasSync = (/set\s*\(/.test(code) || /update\s*\(/.test(code)) && /setItem\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Finir labo 4")) &&
          !exec.logs.some(l => l.text.includes("Acheter café"));

        updatedCriteria[0].passed = hasFilter;
        updatedCriteria[1].passed = hasSync;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasFilter && hasSync && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 5 : Multi-Onglets (StorageEvent)
      // =======================================================================
      case 'ex-5-1': {
        const hasListen = /window\s*\.\s*addEventListener\s*\(\s*['"]storage['"]/.test(code) || /addEventListener\s*\(\s*['"]storage['"]/.test(code);
        const hasProps = /key/.test(code) && /newValue/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Test écouteur réussi : true"));

        updatedCriteria[0].passed = hasListen;
        updatedCriteria[1].passed = hasProps;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasListen && hasProps && compilesOk;
        break;
      }

      case 'ex-5-2': {
        const hasKeyCheck = /key\s*===?\s*cleCible/.test(code) || /cleCible\s*===?\s*(?:event\.)?key/.test(code) || /key\s*==/.test(code);
        const hasNullCheck = /key\s*===?\s*null/.test(code) || /key\s*==\s*null/.test(code) || /null\s*===?\s*(?:event\.)?key/.test(code) || /!\w*\.?key\b/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Total mises à jour déclenchées : 2"));

        updatedCriteria[0].passed = hasKeyCheck;
        updatedCriteria[1].passed = hasNullCheck;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasKeyCheck && hasNullCheck && compilesOk;
        break;
      }

      case 'ex-5-3': {
        const hasListen = /addEventListener\s*\(\s*['"]storage['"]/.test(code);
        const hasCond = /cleAuth/.test(code) && (/newValue\s*===?\s*null/.test(code) || /newValue\s*==\s*null/.test(code) || /null\s*===?\s*\w*\.?newValue/.test(code) || /!\w*\.?newValue\b/.test(code));
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("Statut de déconnexion : true"));

        updatedCriteria[0].passed = hasListen;
        updatedCriteria[1].passed = hasCond;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasListen && hasCond && compilesOk;
        break;
      }
    }

    if (mode === 'baseline') {
      return { success: allPassed, logs: exec.logs, error: exec.error, criteria: updatedCriteria };
    }

    // Les critères déjà verts sur le code initial non modifié ne sont validés qu'une fois le travail réel fait
    const baselineGreen = this.getBaselineGreen(targetId);
    const workDone = updatedCriteria.filter(c => !baselineGreen.has(c.id)).every(c => c.passed);
    if (!workDone) {
      updatedCriteria.forEach(c => {
        if (baselineGreen.has(c.id)) c.passed = false;
      });
      allPassed = false;
    }

    // Mise à jour réactive de l'état de l'exercice
    this.exercises.update(list =>
      list.map(e => {
        if (e.id === targetId) {
          return {
            ...e,
            currentCode: rawCode,
            isCompleted: allPassed,
            criteria: updatedCriteria
          };
        }
        return e;
      })
    );

    this.saveToStorage();

    return {
      success: allPassed,
      logs: exec.logs,
      error: exec.error,
      criteria: updatedCriteria
    };
  }
}
