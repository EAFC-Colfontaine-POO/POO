import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { stripComments } from './validation-utils';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance14_exercises_v1';
  private readonly transpiler = inject(TypescriptTranspilerService);

  readonly activeExerciseIndex = signal<number>(0);
  readonly filterLab = signal<number | null>(null);

  readonly exercises = signal<Exercise[]>([
    // =========================================================================
    // LABO 1 : Injection & Services Singleton (3 exercices)
    // =========================================================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Déclaration moderne @Injectable',
      subtitle: "Configurer le service à la racine de l'arbre d'injection (Root Singleton)",
      sectionId: 'memory-simulator',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        "Complétez la déclaration du service `CompteurService` en lui ajoutant le décorateur `@Injectable({ providedIn: 'root' })`. Initialisez une propriété `valeur = 0;` et une méthode `incrementer(): void` qui augmente cette valeur de 1.",
      hint: "Importez Injectable depuis '@angular/core' (ou utilisez directement @Injectable({ providedIn: 'root' })). Déclarez la classe avec sa méthode.",
      initialCode: `// 1. Décorez la classe avec @Injectable({ providedIn: 'root' }) :\n\nexport class CompteurService {\n  valeur = 0;\n\n  // 2. Écrivez la méthode incrementer() :\n\n}\n\n// Test d'exécution :\nconst service = new CompteurService();\nservice.incrementer();\nconsole.log("Valeur du compteur :", service.valeur);\n`,
      solutionCode: `@Injectable({ providedIn: 'root' })\nexport class CompteurService {\n  valeur = 0;\n\n  incrementer(): void {\n    this.valeur++;\n  }\n}\n\nconst service = new CompteurService();\nservice.incrementer();\nconsole.log("Valeur du compteur :", service.valeur);\n`,
      currentCode: `// 1. Décorez la classe avec @Injectable({ providedIn: 'root' }) :\n\nexport class CompteurService {\n  valeur = 0;\n\n  // 2. Écrivez la méthode incrementer() :\n\n}\n\n// Test d'exécution :\nconst service = new CompteurService();\nservice.incrementer();\nconsole.log("Valeur du compteur :", service.valeur);\n`,
      isCompleted: false,
      solutionExplanation: [
        "`@Injectable({ providedIn: 'root' })` enregistre le service au niveau racine de l'application.",
        "Angular garantit ainsi qu'une unique instance (Singleton) sera partagée par tous les composants.",
        "Le service est également *tree-shakable* : s'il n'est jamais injecté, il est éliminé du bundle final."
      ],
      criteria: [
        {
          id: 'c1-injectable',
          label: "Décorateur @Injectable({ providedIn: 'root' }) présent",
          description: "La classe doit être décorée avec providedIn: 'root'.",
          passed: false,
          hint: "@Injectable({ providedIn: 'root' })"
        },
        {
          id: 'c1-incrementer',
          label: "Méthode incrementer() fonctionnelle",
          description: "La méthode incrementer doit faire progresser la valeur.",
          passed: false,
          hint: "incrementer(): void { this.valeur++; }"
        },
        {
          id: 'c1-log-valeur',
          label: "Sortie console correcte (valeur 1)",
          description: "La console doit afficher la valeur 1 après l'incrémentation.",
          passed: false,
          hint: "Vérifiez l'exécution de service.incrementer()."
        }
      ]
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Injection sans new via inject()',
      subtitle: "Consommer un service dans un composant avec l'API moderne d'Angular",
      sectionId: 'memory-simulator',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Dans la classe `ThemeComponent`, injectez le service `ThemeService` dans une propriété publique `themeService` en utilisant la fonction native `inject(ThemeService)`. Appelez ensuite `this.themeService.toggle()` dans une méthode `changerTheme()`.",
      hint: "Déclarez `themeService = inject(ThemeService);` directement dans les champs de classe (pas de new !).",
      initialCode: `class ThemeService {\n  mode: 'clair' | 'sombre' = 'clair';\n  toggle(): void {\n    this.mode = this.mode === 'clair' ? 'sombre' : 'clair';\n  }\n}\n\nexport class ThemeComponent {\n  // 1. Injectez ThemeService avec inject() sans utiliser new :\n  \n\n  // 2. Écrivez la méthode changerTheme() qui appelle toggle() :\n  \n}\n\n// Test d'exécution :\nconst comp = new ThemeComponent();\ncomp.changerTheme();\nconsole.log("Nouveau thème :", comp.themeService.mode);\n`,
      solutionCode: `class ThemeService {\n  mode: 'clair' | 'sombre' = 'clair';\n  toggle(): void {\n    this.mode = this.mode === 'clair' ? 'sombre' : 'clair';\n  }\n}\n\nexport class ThemeComponent {\n  themeService = inject(ThemeService);\n\n  changerTheme(): void {\n    this.themeService.toggle();\n  }\n}\n\nconst comp = new ThemeComponent();\ncomp.changerTheme();\nconsole.log("Nouveau thème :", comp.themeService.mode);\n`,
      currentCode: `class ThemeService {\n  mode: 'clair' | 'sombre' = 'clair';\n  toggle(): void {\n    this.mode = this.mode === 'clair' ? 'sombre' : 'clair';\n  }\n}\n\nexport class ThemeComponent {\n  // 1. Injectez ThemeService avec inject() sans utiliser new :\n  \n\n  // 2. Écrivez la méthode changerTheme() qui appelle toggle() :\n  \n}\n\n// Test d'exécution :\nconst comp = new ThemeComponent();\ncomp.changerTheme();\nconsole.log("Nouveau thème :", comp.themeService.mode);\n`,
      isCompleted: false,
      solutionExplanation: [
        "L'appel `inject(ThemeService)` résout la dépendance auprès de l'injecteur Angular sans constructeur.",
        "Il remplace avantageusement le constructeur verbeux `constructor(private ts: ThemeService) {}`.",
        "Il doit impérativement être appelé dans un *contexte d'injection* (initialiseur de champ ou constructeur)."
      ],
      criteria: [
        {
          id: 'c2-inject-call',
          label: "Utilisation de inject(ThemeService)",
          description: "La propriété themeService doit être initialisée avec inject(ThemeService).",
          passed: false,
          hint: "themeService = inject(ThemeService);"
        },
        {
          id: 'c2-no-new',
          label: "Aucun appel à new ThemeService dans le composant",
          description: "Le composant ne doit jamais fabriquer son service avec new.",
          passed: false,
          hint: "Bannissez le mot-clé new ThemeService() dans ThemeComponent."
        },
        {
          id: 'c2-toggle-output',
          label: "Bascule effective du thème (mode sombre)",
          description: "La console doit afficher que le mode est devenu 'sombre'.",
          passed: false,
          hint: "Exécutez comp.changerTheme() et affichez comp.themeService.mode."
        }
      ]
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Correction du piège de portée (new vs inject)',
      subtitle: "Rétablir le partage d'état entre deux composants désynchronisés",
      sectionId: 'memory-simulator',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Deux composants `CatalogueComponent` et `NavbarComponent` ont chacun écrit `panier = new PanierService()`. Corrigez les deux classes pour qu'elles utilisent `inject(PanierService)`. Vérifiez qu'un article ajouté depuis le catalogue incrémente bien le compteur visible dans la navbar !",
      hint: "Remplacez chaque `new PanierService()` par `inject(PanierService)`.",
      initialCode: `class PanierService {\n  totalArticles = 0;\n  ajouter(): void { this.totalArticles++; }\n}\n\n// ❌ Corrigez ces deux classes qui s'isolent avec new :\nexport class CatalogueComponent {\n  panier = new PanierService();\n}\n\nexport class NavbarComponent {\n  panier = new PanierService();\n}\n\n// Scénario de test :\nconst cat = new CatalogueComponent();\nconst nav = new NavbarComponent();\ncat.panier.ajouter();\nconsole.log("Navbar voit :", nav.panier.totalArticles, "article(s)");\n`,
      solutionCode: `class PanierService {\n  totalArticles = 0;\n  ajouter(): void { this.totalArticles++; }\n}\n\nexport class CatalogueComponent {\n  panier = inject(PanierService);\n}\n\nexport class NavbarComponent {\n  panier = inject(PanierService);\n}\n\nconst cat = new CatalogueComponent();\nconst nav = new NavbarComponent();\ncat.panier.ajouter();\nconsole.log("Navbar voit :", nav.panier.totalArticles, "article(s)");\n`,
      currentCode: `class PanierService {\n  totalArticles = 0;\n  ajouter(): void { this.totalArticles++; }\n}\n\n// ❌ Corrigez ces deux classes qui s'isolent avec new :\nexport class CatalogueComponent {\n  panier = new PanierService();\n}\n\nexport class NavbarComponent {\n  panier = new PanierService();\n}\n\n// Scénario de test :\nconst cat = new CatalogueComponent();\nconst nav = new NavbarComponent();\ncat.panier.ajouter();\nconsole.log("Navbar voit :", nav.panier.totalArticles, "article(s)");\n`,
      isCompleted: false,
      solutionExplanation: [
        "Avec `new`, chaque composant possédait sa propre instance en mémoire dans le tas.",
        "Avec `inject()`, les deux composants reçoivent la même référence pointant vers le même objet.",
        "L'état devient partagé et synchrone sans avoir besoin d'événements complexes."
      ],
      criteria: [
        {
          id: 'c3-no-new-panier',
          label: "Suppression des 'new PanierService()'",
          description: "Aucun composant ne doit instancier le panier avec new.",
          passed: false,
          hint: "Remplacez 'new PanierService()' par 'inject(PanierService)'."
        },
        {
          id: 'c3-both-inject',
          label: "Catalogue et Navbar injectent PanierService",
          description: "Les deux classes doivent appeler inject(PanierService).",
          passed: false,
          hint: "panier = inject(PanierService);"
        },
        {
          id: 'c3-shared-state',
          label: "État partagé vérifié (Navbar voit 1 article)",
          description: "La console doit afficher 1 article pour la navbar après ajout du catalogue.",
          passed: false,
          hint: "Le log doit afficher 'Navbar voit : 1 article(s)'."
        }
      ]
    },

    // =========================================================================
    // LABO 2 : Encapsulation & Immutabilité par les Signaux (3 exercices)
    // =========================================================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Signal privé et lecture seule sécurisée',
      subtitle: "Protéger l'état interne avec # et asReadonly()",
      sectionId: 'service-anatomy',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        "Dans `CompteBancaireService`, déclarez un signal privé `#solde = signal(100)`. Exposez ensuite publiquement la propriété `readonly solde = this.#solde.asReadonly()`. Écrivez une méthode `deposer(montant: number)` qui incrémente le signal via `.update()`.",
      hint: "Utilisez `#solde = signal(100)` pour le champ privé, `solde = this.#solde.asReadonly()`, et `this.#solde.update(s => s + montant)`.",
      initialCode: `export class CompteBancaireService {\n  // 1. Déclarez le signal privé #solde initialisé à 100 :\n\n\n  // 2. Exposez la version publique en lecture seule avec asReadonly() :\n\n\n  // 3. Méthode deposer(montant: number) via .update() :\n\n}\n\n// Test d'exécution :\nconst compte = new CompteBancaireService();\ncompte.deposer(50);\nconsole.log("Solde actuel :", compte.solde());\n`,
      solutionCode: `export class CompteBancaireService {\n  readonly #solde = signal(100);\n  readonly solde = this.#solde.asReadonly();\n\n  deposer(montant: number): void {\n    this.#solde.update(s => s + montant);\n  }\n}\n\nconst compte = new CompteBancaireService();\ncompte.deposer(50);\nconsole.log("Solde actuel :", compte.solde());\n`,
      currentCode: `export class CompteBancaireService {\n  // 1. Déclarez le signal privé #solde initialisé à 100 :\n\n\n  // 2. Exposez la version publique en lecture seule avec asReadonly() :\n\n\n  // 3. Méthode deposer(montant: number) via .update() :\n\n}\n\n// Test d'exécution :\nconst compte = new CompteBancaireService();\ncompte.deposer(50);\nconsole.log("Solde actuel :", compte.solde());\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le préfixe `#` applique une vraie encapsulation privée native ES2022 inaccessible de l'extérieur.",
        "`asReadonly()` supprime les méthodes `.set()` et `.update()` de l'objet exposé : le composant peut lire mais ne peut pas corrompre.",
        "Toutes les modifications passent obligatoirement par des méthodes métier du service."
      ],
      criteria: [
        {
          id: 'c4-private-signal',
          label: "Signal privé #solde déclaré",
          description: "La propriété privée #solde doit être initialisée avec signal(100).",
          passed: false,
          hint: "readonly #solde = signal(100);"
        },
        {
          id: 'c4-as-readonly',
          label: "Exposition publique via asReadonly()",
          description: "La propriété solde doit appeler this.#solde.asReadonly().",
          passed: false,
          hint: "readonly solde = this.#solde.asReadonly();"
        },
        {
          id: 'c4-deposer-update',
          label: "Dépôt de 50 € validé (solde = 150)",
          description: "La console doit afficher 'Solde actuel : 150'.",
          passed: false,
          hint: "this.#solde.update(s => s + montant);"
        }
      ]
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Mutation immutable sans .push()',
      subtitle: "Garantir une nouvelle référence mémoire pour réveiller Angular",
      sectionId: 'service-anatomy',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Dans `TachesService`, implémentez la méthode `ajouter(nom: string)` en mettant à jour le signal `#taches = signal<string[]>([])` de manière strictement immutable. Utilisez `.update()` et le spread operator `[...liste, nom]`. Bannissez absolument `.push()` !",
      hint: "Dans la méthode : `this.#taches.update(liste => [...liste, nom]);`",
      initialCode: `export class TachesService {\n  readonly #taches = signal<string[]>([]);\n  readonly taches = this.#taches.asReadonly();\n\n  ajouter(nom: string): void {\n    // ❌ INTERDIT : this.#taches().push(nom); (ne change pas la référence !)\n    // ✅ Écrivez la mise à jour immutable avec .update() et spread operator :\n    \n  }\n}\n\n// Test d'exécution :\nconst s = new TachesService();\ns.ajouter("Faire les courses");\ns.ajouter("Réviser la POO");\nconsole.log("Nombre de tâches :", s.taches().length, "- Première :", s.taches()[0]);\n`,
      solutionCode: `export class TachesService {\n  readonly #taches = signal<string[]>([]);\n  readonly taches = this.#taches.asReadonly();\n\n  ajouter(nom: string): void {\n    this.#taches.update(liste => [...liste, nom]);\n  }\n}\n\nconst s = new TachesService();\ns.ajouter("Faire les courses");\ns.ajouter("Réviser la POO");\nconsole.log("Nombre de tâches :", s.taches().length, "- Première :", s.taches()[0]);\n`,
      currentCode: `export class TachesService {\n  readonly #taches = signal<string[]>([]);\n  readonly taches = this.#taches.asReadonly();\n\n  ajouter(nom: string): void {\n    // ❌ INTERDIT : this.#taches().push(nom); (ne change pas la référence !)\n    // ✅ Écrivez la mise à jour immutable avec .update() et spread operator :\n    \n  }\n}\n\n// Test d'exécution :\nconst s = new TachesService();\ns.ajouter("Faire les courses");\ns.ajouter("Réviser la POO");\nconsole.log("Nombre de tâches :", s.taches().length, "- Première :", s.taches()[0]);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Un signal compare la nouvelle valeur à l'ancienne par référence (`Object.is`).",
        "Si on appelle `.push()`, le tableau est muté en place : l'adresse mémoire reste inchangée et Angular ne redessine rien.",
        "Le spread operator `[...liste, nom]` alloue un nouveau tableau à une nouvelle adresse mémoire, garantissant la réactivité."
      ],
      criteria: [
        {
          id: 'c5-no-push',
          label: "Absence totale de l'opérateur .push()",
          description: "Le code ne doit pas utiliser de mutation en place.",
          passed: false,
          hint: "N'utilisez pas .push(), mais .update(l => [...l, nom])."
        },
        {
          id: 'c5-update-spread',
          label: "Mise à jour avec .update() et spread",
          description: "La méthode doit employer update avec [...liste, nom].",
          passed: false,
          hint: "this.#taches.update(liste => [...liste, nom]);"
        },
        {
          id: 'c5-two-tasks',
          label: "Ajout vérifié (2 tâches en console)",
          description: "La console doit afficher 2 tâches et la première intitulée 'Faire les courses'.",
          passed: false,
          hint: "Vérifiez que s.taches().length vaut 2."
        }
      ]
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Valeur calculée dérivée avec computed()',
      subtitle: "Calculer automatiquement le montant total TTC d'un panier",
      sectionId: 'service-anatomy',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        "Dans `FactureService`, vous disposez d'un signal `#lignes = signal<{ article: string; prixHT: number }[]>([])`. Déclarez la propriété publique `readonly totalTTC = computed(...)` qui calcule la somme des prix HT multipliée par 1.20 (TVA 20%). Implémentez aussi `ajouterLigne(article: string, prixHT: number)`.",
      hint: "Utilisez `this.#lignes().reduce((somme, l) => somme + l.prixHT, 0) * 1.2` à l'intérieur de `computed(() => ...)`. N'oubliez pas les parenthèses d'appel `#lignes()` !",
      initialCode: `export class FactureService {\n  readonly #lignes = signal<{ article: string; prixHT: number }[]>([]);\n  readonly lignes = this.#lignes.asReadonly();\n\n  // 1. Déclarez totalTTC avec computed() (prix total * 1.20) :\n  \n\n  ajouterLigne(article: string, prixHT: number): void {\n    // 2. Ajoutez la ligne de façon immutable :\n    \n  }\n}\n\n// Test d'exécution :\nconst fact = new FactureService();\nfact.ajouterLigne("Écran 27 pouces", 200);\nfact.ajouterLigne("Câble HDMI", 50);\nconsole.log("Total TTC calculé :", fact.totalTTC(), "€");\n`,
      solutionCode: `export class FactureService {\n  readonly #lignes = signal<{ article: string; prixHT: number }[]>([]);\n  readonly lignes = this.#lignes.asReadonly();\n\n  readonly totalTTC = computed(() => {\n    const totalHT = this.#lignes().reduce((acc, l) => acc + l.prixHT, 0);\n    return totalHT * 1.2;\n  });\n\n  ajouterLigne(article: string, prixHT: number): void {\n    this.#lignes.update(liste => [...liste, { article, prixHT }]);\n  }\n}\n\nconst fact = new FactureService();\nfact.ajouterLigne("Écran 27 pouces", 200);\nfact.ajouterLigne("Câble HDMI", 50);\nconsole.log("Total TTC calculé :", fact.totalTTC(), "€");\n`,
      currentCode: `export class FactureService {\n  readonly #lignes = signal<{ article: string; prixHT: number }[]>([]);\n  readonly lignes = this.#lignes.asReadonly();\n\n  // 1. Déclarez totalTTC avec computed() (prix total * 1.20) :\n  \n\n  ajouterLigne(article: string, prixHT: number): void {\n    // 2. Ajoutez la ligne de façon immutable :\n    \n  }\n}\n\n// Test d'exécution :\nconst fact = new FactureService();\nfact.ajouterLigne("Écran 27 pouces", 200);\nfact.ajouterLigne("Câble HDMI", 50);\nconsole.log("Total TTC calculé :", fact.totalTTC(), "€");\n`,
      isCompleted: false,
      solutionExplanation: [
        "`computed()` crée un signal dérivé en lecture seule qui s'auto-abonne aux signaux qu'il lit.",
        "Dès que `#lignes` est mis à jour, `totalTTC` recalcule paresseusement sa valeur (memoization).",
        "Aucune variable de cache manuelle n'est requise : zéro risque de désynchronisation."
      ],
      criteria: [
        {
          id: 'c6-computed-decl',
          label: "Déclaration de totalTTC avec computed()",
          description: "totalTTC doit être initialisé avec la fonction computed().",
          passed: false,
          hint: "readonly totalTTC = computed(() => ...);"
        },
        {
          id: 'c6-ajouter-ligne',
          label: "Méthode ajouterLigne immutable",
          description: "La méthode doit utiliser .update() sans muter le tableau directement.",
          passed: false,
          hint: "this.#lignes.update(l => [...l, { article, prixHT }]);"
        },
        {
          id: 'c6-output-ttc',
          label: "Calcul correct en console (300 € pour 250 HT * 1.2)",
          description: "La console doit afficher 'Total TTC calculé : 300 €'.",
          passed: false,
          hint: "200 + 50 = 250 HT * 1.2 = 300 TTC."
        }
      ]
    },

    // =========================================================================
    // LABO 3 : Initiation à la Généricité <T> (3 exercices)
    // =========================================================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'La première fonction générique <T>',
      subtitle: 'Extraire un élément en conservant son type exact sans any',
      sectionId: 'code-dilemma',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        "Écrivez une fonction générique `premierElement<T>(tableau: T[]): T | undefined` qui retourne le premier élément du tableau fourni (ou `undefined` si le tableau est vide). Testez-la avec un tableau de nombres puis un tableau de chaînes.",
      hint: "Syntaxe : `function premierElement<T>(tableau: T[]): T | undefined { return tableau[0]; }`",
      initialCode: `// 1. Écrivez la fonction générique premierElement<T> :\n\n\n// 2. Testez avec un tableau de nombres :\nconst nb = premierElement([10, 20, 30]);\nconsole.log("Nombre récupéré :", nb);\n\n// 3. Testez avec un tableau de textes :\nconst txt = premierElement(["Angular", "TypeScript"]);\nconsole.log("Texte récupéré :", txt);\n`,
      solutionCode: `function premierElement<T>(tableau: T[]): T | undefined {\n  return tableau[0];\n}\n\nconst nb = premierElement([10, 20, 30]);\nconsole.log("Nombre récupéré :", nb);\n\nconst txt = premierElement(["Angular", "TypeScript"]);\nconsole.log("Texte récupéré :", txt);\n`,
      currentCode: `// 1. Écrivez la fonction générique premierElement<T> :\n\n\n// 2. Testez avec un tableau de nombres :\nconst nb = premierElement([10, 20, 30]);\nconsole.log("Nombre récupéré :", nb);\n\n// 3. Testez avec un tableau de textes :\nconst txt = premierElement(["Angular", "TypeScript"]);\nconsole.log("Texte récupéré :", txt);\n`,
      isCompleted: false,
      solutionExplanation: [
        "`<T>` est un paramètre de type : le compilateur substitue `T` par le type concret passé en argument.",
        "Sur `[10, 20]`, `T` vaut `number` : la variable de retour est typée `number | undefined`.",
        "On conserve toute l'autocomplétion sans jamais écrire de code dupliqué ni recourir à `any`."
      ],
      criteria: [
        {
          id: 'c7-fn-generic',
          label: "Déclaration générique <T>",
          description: "La fonction doit comporter le paramètre de type <T>.",
          passed: false,
          hint: "function premierElement<T>(tableau: T[]): T | undefined"
        },
        {
          id: 'c7-return-first',
          label: "Retour du premier élément",
          description: "La fonction doit renvoyer tableau[0].",
          passed: false,
          hint: "return tableau[0];"
        },
        {
          id: 'c7-outputs',
          label: "Exécution réussie avec 10 et 'Angular'",
          description: "La console doit afficher les deux valeurs extraites.",
          passed: false,
          hint: "Vérifiez que la console affiche 10 et Angular."
        }
      ]
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Le wrapper générique Boite<T>',
      subtitle: 'Créer une classe moule recevant un type paramétré',
      sectionId: 'generic-box',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Écrivez la classe générique `Boite<T>` avec une propriété privée `#contenu: T`. Son constructeur initialise ce contenu. Écrivez la méthode `recuperer(): T` et la méthode `remplacer(nouveau: T): void`. Instanciez une `Boite<number>` et remplacez sa valeur par 99.",
      hint: "Déclarez `class Boite<T> { #contenu: T; constructor(val: T) { this.#contenu = val; } recuperer(): T { return this.#contenu; } remplacer(n: T): void { this.#contenu = n; } }`",
      initialCode: `// 1. Coder la classe générique Boite<T> :\nexport class Boite<T> {\n  #contenu: T;\n\n  constructor(valeurInitiale: T) {\n    this.#contenu = valeurInitiale;\n  }\n\n  // Écrivez recuperer(): T\n  \n\n  // Écrivez remplacer(nouveau: T): void\n  \n}\n\n// 2. Testez votre classe :\nconst boite = new Boite<number>(42);\nboite.remplacer(99);\nconsole.log("Contenu de la boîte :", boite.recuperer());\n`,
      solutionCode: `export class Boite<T> {\n  #contenu: T;\n\n  constructor(valeurInitiale: T) {\n    this.#contenu = valeurInitiale;\n  }\n\n  recuperer(): T {\n    return this.#contenu;\n  }\n\n  remplacer(nouveau: T): void {\n    this.#contenu = nouveau;\n  }\n}\n\nconst boite = new Boite<number>(42);\nboite.remplacer(99);\nconsole.log("Contenu de la boîte :", boite.recuperer());\n`,
      currentCode: `// 1. Coder la classe générique Boite<T> :\nexport class Boite<T> {\n  #contenu: T;\n\n  constructor(valeurInitiale: T) {\n    this.#contenu = valeurInitiale;\n  }\n\n  // Écrivez recuperer(): T\n  \n\n  // Écrivez remplacer(nouveau: T): void\n  \n}\n\n// 2. Testez votre classe :\nconst boite = new Boite<number>(42);\nboite.remplacer(99);\nconsole.log("Contenu de la boîte :", boite.recuperer());\n`,
      isCompleted: false,
      solutionExplanation: [
        "La classe agit comme un moule : le type `T` est réutilisé dans les méthodes `recuperer` et `remplacer`.",
        "Si l'étudiant tente de faire `boite.remplacer('texte')` sur une `Boite<number>`, TypeScript refuse immédiatement (TS2345).",
        "Le code de la classe n'est écrit qu'une seule fois pour tous les types possibles."
      ],
      criteria: [
        {
          id: 'c8-recuperer-body',
          label: "Méthode recuperer() implémentée",
          description: "recuperer() doit retourner this.#contenu.",
          passed: false,
          hint: "recuperer(): T { return this.#contenu; }"
        },
        {
          id: 'c8-remplacer-body',
          label: "Méthode remplacer(nouveau: T) implémentée",
          description: "remplacer doit mettre à jour this.#contenu.",
          passed: false,
          hint: "remplacer(nouveau: T): void { this.#contenu = nouveau; }"
        },
        {
          id: 'c8-output-99',
          label: "Contenu mis à jour à 99 en console",
          description: "La console doit afficher 'Contenu de la boîte : 99'.",
          passed: false,
          hint: "Vérifiez l'affichage de boite.recuperer()."
        }
      ]
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Paire générique <K, V>',
      subtitle: 'Manipuler deux paramètres de type distincts',
      sectionId: 'code-dilemma',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Créez une classe générique `Paire<K, V>` avec un constructeur factorisant deux propriétés `public readonly cle: K` et `public readonly valeur: V`. Ajoutez une méthode `toString(): string` retournant `\"[cle => valeur]\"`. Instanciez une paire reliant un ID numérique `101` et un libellé `\"Clavier\"`.",
      hint: "Syntaxe : `class Paire<K, V> { constructor(public readonly cle: K, public readonly valeur: V) {} toString(): string { return `[${this.cle} => ${this.valeur}]`; } }`",
      initialCode: `// 1. Déclarez la classe générique Paire<K, V> avec ses deux propriétés cle et valeur :\n\n\n// 2. Instanciez la paire (101, "Clavier") et affichez son toString() :\n`,
      solutionCode: `export class Paire<K, V> {\n  constructor(\n    public readonly cle: K,\n    public readonly valeur: V\n  ) {}\n\n  toString(): string {\n    return \`[\${this.cle} => \${this.valeur}]\`;\n  }\n}\n\nconst item = new Paire<number, string>(101, "Clavier");\nconsole.log(item.toString());\n`,
      currentCode: `// 1. Déclarez la classe générique Paire<K, V> avec ses deux propriétés cle et valeur :\n\n\n// 2. Instanciez la paire (101, "Clavier") et affichez son toString() :\n`,
      isCompleted: false,
      solutionExplanation: [
        "Une classe peut déclarer plusieurs paramètres de type séparés par des virgules `<K, V>`.",
        "K (Key) et V (Value) peuvent recevoir des types totalement hétérogènes (ex: number et string).",
        "Cette structure est la base des Maps et dictionnaires typés modernes."
      ],
      criteria: [
        {
          id: 'c9-two-generics',
          label: "Déclaration de deux types génériques <K, V>",
          description: "La classe doit comporter deux paramètres de type.",
          passed: false,
          hint: "class Paire<K, V>"
        },
        {
          id: 'c9-props',
          label: "Propriétés cle et valeur initialisées",
          description: "Les propriétés doivent être déclarées et accessibles.",
          passed: false,
          hint: "constructor(public readonly cle: K, public readonly valeur: V)"
        },
        {
          id: 'c9-string-output',
          label: "Format de chaîne respecté [101 => Clavier]",
          description: "La sortie console doit afficher '[101 => Clavier]'.",
          passed: false,
          hint: "return `[${this.cle} => ${this.valeur}]`;"
        }
      ]
    },

    // =========================================================================
    // LABO 4 : Contraintes Génériques (extends) & Lookups (4 exercices)
    // =========================================================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: "Le contrat d'interface Identifiable",
      subtitle: "Formaliser la présence universelle d'une clé d'identification",
      sectionId: 'generic-constraints',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        "Définissez l'interface `Identifiable` imposant une propriété `readonly id: number | string`. Créez ensuite une classe `Utilisateur implements Identifiable` possédant `public readonly id: number` et `public nom: string`.",
      hint: "Interface : `export interface Identifiable { readonly id: number | string; }`. Classe : `export class Utilisateur implements Identifiable { ... }`.",
      initialCode: `// 1. Déclarez l'interface Identifiable :\n\n\n// 2. Déclarez la classe Utilisateur qui l'implémente :\n\n\n// Test d'exécution :\nconst u = new Utilisateur(1, "Alice");\nconsole.log("Utilisateur créé :", u.id, u.nom);\n`,
      solutionCode: `export interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Utilisateur implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public nom: string\n  ) {}\n}\n\nconst u = new Utilisateur(1, "Alice");\nconsole.log("Utilisateur créé :", u.id, u.nom);\n`,
      currentCode: `// 1. Déclarez l'interface Identifiable :\n\n\n// 2. Déclarez la classe Utilisateur qui l'implémente :\n\n\n// Test d'exécution :\nconst u = new Utilisateur(1, "Alice");\nconsole.log("Utilisateur créé :", u.id, u.nom);\n`,
      isCompleted: false,
      solutionExplanation: [
        "L'interface pose un contrat pur sans générer un seul octet JavaScript à l'exécution.",
        "`number | string` autorise à la fois des clés primaires auto-incrémentées et des clés textuelles (UUID, codes clients).",
        "Cette interface servira de contrainte pour nos futurs services génériques."
      ],
      criteria: [
        {
          id: 'c10-interface-identifiable',
          label: "Interface Identifiable avec id: number | string",
          description: "L'interface doit exiger la propriété id.",
          passed: false,
          hint: "interface Identifiable { readonly id: number | string; }"
        },
        {
          id: 'c10-implements-user',
          label: "Utilisateur implements Identifiable",
          description: "La classe doit implémenter l'interface.",
          passed: false,
          hint: "class Utilisateur implements Identifiable"
        },
        {
          id: 'c10-user-output',
          label: "Sortie console correcte (Alice avec id 1)",
          description: "La console doit afficher l'utilisateur 1 Alice.",
          passed: false,
          hint: "Vérifiez que le constructeur affecte bien id et nom."
        }
      ]
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Poser la contrainte <T extends Identifiable>',
      subtitle: "Autoriser le compilateur à accéder à .id sans erreur TS2339",
      sectionId: 'generic-constraints',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "La classe `Registre<T>` ci-dessous ne compile pas car TypeScript refuse `item.id` sur un type `T` non contraint (Erreur TS2339). Corrigez la signature de la classe en ajoutant la contrainte `<T extends Identifiable>`.",
      hint: "Remplacez `class Registre<T>` par `class Registre<T extends Identifiable>`.",
      initialCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\n// ❌ Corrigez cette signature pour autoriser l'accès à item.id :\nexport class Registre<T> {\n  items: T[] = [];\n\n  supprimer(id: number | string): void {\n    // Sans contrainte, 'id' n'existe pas sur 'T' !\n    this.items = this.items.filter(item => item.id !== id);\n  }\n}\n\n// Scénario de test :\nconst reg = new Registre<{ id: number; titre: string }>();\nreg.items = [{ id: 10, titre: "Livre A" }, { id: 20, titre: "Livre B" }];\nreg.supprimer(10);\nconsole.log("Éléments restants :", reg.items.length);\n`,
      solutionCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Registre<T extends Identifiable> {\n  items: T[] = [];\n\n  supprimer(id: number | string): void {\n    this.items = this.items.filter(item => item.id !== id);\n  }\n}\n\nconst reg = new Registre<{ id: number; titre: string }>();\nreg.items = [{ id: 10, titre: "Livre A" }, { id: 20, titre: "Livre B" }];\nreg.supprimer(10);\nconsole.log("Éléments restants :", reg.items.length);\n`,
      currentCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\n// ❌ Corrigez cette signature pour autoriser l'accès à item.id :\nexport class Registre<T> {\n  items: T[] = [];\n\n  supprimer(id: number | string): void {\n    // Sans contrainte, 'id' n'existe pas sur 'T' !\n    this.items = this.items.filter(item => item.id !== id);\n  }\n}\n\n// Scénario de test :\nconst reg = new Registre<{ id: number; titre: string }>();\nreg.items = [{ id: 10, titre: "Livre A" }, { id: 20, titre: "Livre B" }];\nreg.supprimer(10);\nconsole.log("Éléments restants :", reg.items.length);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Sans contrainte, TypeScript suppose le cas le plus défavorable : `T` pourrait être un booléen sans `.id`.",
        "La clause `<T extends Identifiable>` garantit au compilateur que tout élément de type `T` possèdera un champ `id`.",
        "Le mot `extends` exprime ici une conformité structurelle : tout type ayant la forme requise est accepté."
      ],
      criteria: [
        {
          id: 'c11-extends-clause',
          label: "Contrainte <T extends Identifiable> posée",
          description: "La classe doit déclarer la contrainte extends.",
          passed: false,
          hint: "class Registre<T extends Identifiable>"
        },
        {
          id: 'c11-supprimer-work',
          label: "Suppression effective sans erreur",
          description: "La méthode supprimer doit filtrer l'élément demandé.",
          passed: false,
          hint: "this.items = this.items.filter(item => item.id !== id);"
        },
        {
          id: 'c11-remaining-count',
          label: "1 élément restant en console après suppression de l'id 10",
          description: "La console doit afficher 'Éléments restants : 1'.",
          passed: false,
          hint: "Vérifiez que l'élément d'id 10 a bien été retiré."
        }
      ]
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: "Typage exact du paramètre avec Lookup Type T['id']",
      subtitle: "Adapter automatiquement le type de la recherche à l'entité",
      sectionId: 'generic-constraints',
      estimatedTime: '4 min',
      difficulty: 'Intermédiaire',
      statement:
        "Dans `Chercheur<T extends Identifiable>`, typez le paramètre de la méthode `chercher(id: T['id']): T | undefined` à l'aide de l'Indexed Access Type (Lookup Type) `T['id']`. Pour un produit dont l'id est `number`, la méthode n'acceptera qu'un nombre. Pour un client dont l'id est `string`, elle n'acceptera qu'une chaîne !",
      hint: "Signature : `chercher(id: T['id']): T | undefined { return this.items.find(i => i.id === id); }`",
      initialCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Chercheur<T extends Identifiable> {\n  items: T[] = [];\n\n  // Typez le paramètre 'id' avec le Lookup Type T['id'] :\n  chercher(id: any): T | undefined {\n    return this.items.find(i => i.id === id);\n  }\n}\n\n// Test d'exécution :\nconst ch = new Chercheur<{ id: string; nom: string }>();\nch.items = [{ id: "CLI-01", nom: "Société Acme" }];\nconst trouve = ch.chercher("CLI-01");\nconsole.log("Trouvé :", trouve?.nom);\n`,
      solutionCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Chercheur<T extends Identifiable> {\n  items: T[] = [];\n\n  chercher(id: T['id']): T | undefined {\n    return this.items.find(i => i.id === id);\n  }\n}\n\nconst ch = new Chercheur<{ id: string; nom: string }>();\nch.items = [{ id: "CLI-01", nom: "Société Acme" }];\nconst trouve = ch.chercher("CLI-01");\nconsole.log("Trouvé :", trouve?.nom);\n`,
      currentCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Chercheur<T extends Identifiable> {\n  items: T[] = [];\n\n  // Typez le paramètre 'id' avec le Lookup Type T['id'] :\n  chercher(id: any): T | undefined {\n    return this.items.find(i => i.id === id);\n  }\n}\n\n// Test d'exécution :\nconst ch = new Chercheur<{ id: string; nom: string }>();\nch.items = [{ id: "CLI-01", nom: "Société Acme" }];\nconst trouve = ch.chercher("CLI-01");\nconsole.log("Trouvé :", trouve?.nom);\n`,
      isCompleted: false,
      solutionExplanation: [
        "`T['id']` est un Lookup Type : il extrait le type précis de la propriété `id` de `T`.",
        "Si `T` est `Produit`, `T['id']` est `number`. Si `T` est `Client`, `T['id']` est `string`.",
        "On évite ainsi d'accepter une chaîne sur un produit ou un nombre sur un client."
      ],
      criteria: [
        {
          id: 'c12-lookup-type',
          label: "Utilisation du lookup type T['id']",
          description: "Le paramètre id doit être typé T['id'].",
          passed: false,
          hint: "chercher(id: T['id'])"
        },
        {
          id: 'c12-no-any',
          label: "Bannissement du type any",
          description: "Le type any ne doit plus apparaître dans la signature.",
          passed: false,
          hint: "Remplacez 'id: any' par 'id: T[\"id\"]'."
        },
        {
          id: 'c12-output-client',
          label: "Recherche validée ('Société Acme')",
          description: "La console doit afficher 'Trouvé : Société Acme'.",
          passed: false,
          hint: "Vérifiez que trouve?.nom s'affiche correctement."
        }
      ]
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: 'Exclusion de type non conforme à la compilation',
      subtitle: 'Observer le refus de compilation pour un objet sans identifiant',
      sectionId: 'generic-constraints',
      estimatedTime: '3 min',
      difficulty: 'Facile',
      statement:
        "Une classe `Coordonnees` ne possède que `latitude: number` et `longitude: number` (pas de champ `id`). Déclarez cette classe, puis commentez la tentative `new Registre<Coordonnees>()` en expliquant pourquoi TypeScript refuserait de compiler (Erreur TS2344).",
      hint: "Déclarez `class Coordonnees { constructor(public latitude: number, public longitude: number) {} }`. Laissez la création en commentaire pour que le code s'exécute.",
      initialCode: `interface Identifiable {\n  readonly id: number | string;\n}\nclass Registre<T extends Identifiable> {}\n\n// 1. Déclarez la classe Coordonnees (latitude: number, longitude: number) :\n\n\n// 2. La ligne suivante provoquerait TS2344 si décommentée :\n// const r = new Registre<Coordonnees>();\n\nconsole.log("Contrainte de type vérifiée avec succès !");\n`,
      solutionCode: `interface Identifiable {\n  readonly id: number | string;\n}\nclass Registre<T extends Identifiable> {}\n\nclass Coordonnees {\n  constructor(\n    public latitude: number,\n    public longitude: number\n  ) {}\n}\n\n// const r = new Registre<Coordonnees>(); // TS2344: Type 'Coordonnees' does not satisfy constraint 'Identifiable'.\n\nconsole.log("Contrainte de type vérifiée avec succès !");\n`,
      currentCode: `interface Identifiable {\n  readonly id: number | string;\n}\nclass Registre<T extends Identifiable> {}\n\n// 1. Déclarez la classe Coordonnees (latitude: number, longitude: number) :\n\n\n// 2. La ligne suivante provoquerait TS2344 si décommentée :\n// const r = new Registre<Coordonnees>();\n\nconsole.log("Contrainte de type vérifiée avec succès !");\n`,
      isCompleted: false,
      solutionExplanation: [
        "`Coordonnees` ne respecte pas le contrat `Identifiable` car il lui manque la propriété obligatoire `id`.",
        "Le compilateur protège l'application avant l'exécution en déclenchant l'erreur `TS2344`.",
        "Le typage structurel assure qu'aucun objet incompatible ne peut pénétrer dans le `Registre`."
      ],
      criteria: [
        {
          id: 'c13-coordonnees-class',
          label: "Classe Coordonnees déclarée avec latitude et longitude",
          description: "La classe Coordonnees doit être présente dans le code.",
          passed: false,
          hint: "class Coordonnees { constructor(public latitude: number, public longitude: number) {} }"
        },
        {
          id: 'c13-safe-comment',
          label: "L'assignation illégale est bien commentée",
          description: "Le code doit compiler proprement sans instancier Coordonnees dans Registre.",
          passed: false,
          hint: "Gardez la ligne new Registre<Coordonnees> commentée."
        },
        {
          id: 'c13-log-success',
          label: "Message de validation affiché en console",
          description: "La console doit afficher 'Contrainte de type vérifiée avec succès !'.",
          passed: false,
          hint: "console.log('Contrainte de type vérifiée avec succès !');"
        }
      ]
    },

    // =========================================================================
    // LABO 5 : Le Repository<T> Universel (3 exercices)
    // =========================================================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: 'Recherche par ID dans le Repository réactif',
      subtitle: "Implémenter trouverParId sur le signal interne #items",
      sectionId: 'universal-repository',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Dans `Repository<T extends Identifiable>`, implémentez la méthode `trouverParId(id: T['id']): T | undefined`. Elle doit inspecter la valeur actuelle du signal `#items()` et renvoyer l'élément dont l'id correspond.",
      hint: "Dans la méthode : `return this.#items().find(item => item.id === id);`",
      initialCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  constructor(elementsInitiaux: T[] = []) {\n    this.#items.set(elementsInitiaux);\n  }\n\n  // Implémentez trouverParId(id: T['id']): T | undefined :\n  trouverParId(id: T['id']): T | undefined {\n    \n  }\n}\n\n// Test d'exécution :\nconst repo = new Repository<{ id: number; nom: string }>([\n  { id: 1, nom: "Souris optique" },\n  { id: 2, nom: "Écran 4K" }\n]);\nconst prod = repo.trouverParId(2);\nconsole.log("Produit trouvé :", prod?.nom);\n`,
      solutionCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  constructor(elementsInitiaux: T[] = []) {\n    this.#items.set(elementsInitiaux);\n  }\n\n  trouverParId(id: T['id']): T | undefined {\n    return this.#items().find(item => item.id === id);\n  }\n}\n\nconst repo = new Repository<{ id: number; nom: string }>([\n  { id: 1, nom: "Souris optique" },\n  { id: 2, nom: "Écran 4K" }\n]);\nconst prod = repo.trouverParId(2);\nconsole.log("Produit trouvé :", prod?.nom);\n`,
      currentCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  constructor(elementsInitiaux: T[] = []) {\n    this.#items.set(elementsInitiaux);\n  }\n\n  // Implémentez trouverParId(id: T['id']): T | undefined :\n  trouverParId(id: T['id']): T | undefined {\n    \n  }\n}\n\n// Test d'exécution :\nconst repo = new Repository<{ id: number; nom: string }>([\n  { id: 1, nom: "Souris optique" },\n  { id: 2, nom: "Écran 4K" }\n]);\nconst prod = repo.trouverParId(2);\nconsole.log("Produit trouvé :", prod?.nom);\n`,
      isCompleted: false,
      solutionExplanation: [
        "On accède au tableau actuel en appelant le signal privé comme une fonction `this.#items()`.",
        "La méthode standard `.find()` filtre sur `item.id === id`, autorisé par la contrainte `T extends Identifiable`.",
        "Le type de retour est `T | undefined` au cas où aucun élément ne correspond."
      ],
      criteria: [
        {
          id: 'c14-find-body',
          label: "Recherche sur le signal this.#items()",
          description: "La méthode doit interroger this.#items() avec .find().",
          passed: false,
          hint: "return this.#items().find(i => i.id === id);"
        },
        {
          id: 'c14-signature-lookup',
          label: "Signature id: T['id']",
          description: "Le paramètre id doit être typé avec le lookup type.",
          passed: false,
          hint: "trouverParId(id: T['id'])"
        },
        {
          id: 'c14-output-screen',
          label: "Résultat attendu en console ('Écran 4K')",
          description: "La console doit afficher 'Produit trouvé : Écran 4K'.",
          passed: false,
          hint: "Vérifiez que repo.trouverParId(2) renvoie l'écran."
        }
      ]
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Ajout sécurisé avec détection de doublon',
      subtitle: "Rejeter l'insertion si l'identifiant existe déjà",
      sectionId: 'universal-repository',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        "Dans `Repository<T extends Identifiable>`, écrivez la méthode `ajouter(element: T): void`. Elle doit vérifier via `this.trouverParId(element.id)` si l'id existe déjà. Si oui, elle lève une `Error(\"L'identifiant existe déjà\")`. Sinon, elle met à jour `#items` avec `.update(liste => [...liste, element])`.",
      hint: "Structure : `if (this.trouverParId(element.id)) throw new Error('Doublon'); this.#items.update(l => [...l, element]);`",
      initialCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  trouverParId(id: T['id']): T | undefined {\n    return this.#items().find(i => i.id === id);\n  }\n\n  // Écrivez ajouter(element: T): void avec garde anti-doublon :\n  ajouter(element: T): void {\n    \n  }\n}\n\n// Test d'exécution :\nconst repo = new Repository<{ id: number; nom: string }>();\nrepo.ajouter({ id: 10, nom: "Disque SSD" });\ntry {\n  repo.ajouter({ id: 10, nom: "Disque Doublon" });\n} catch (e: any) {\n  console.log("Doublon intercepté :", e.message);\n}\nconsole.log("Total après tentative :", repo.items().length);\n`,
      solutionCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  trouverParId(id: T['id']): T | undefined {\n    return this.#items().find(i => i.id === id);\n  }\n\n  ajouter(element: T): void {\n    if (this.trouverParId(element.id)) {\n      throw new Error("L'identifiant existe déjà");\n    }\n    this.#items.update(liste => [...liste, element]);\n  }\n}\n\nconst repo = new Repository<{ id: number; nom: string }>();\nrepo.ajouter({ id: 10, nom: "Disque SSD" });\ntry {\n  repo.ajouter({ id: 10, nom: "Disque Doublon" });\n} catch (e: any) {\n  console.log("Doublon intercepté :", e.message);\n}\nconsole.log("Total après tentative :", repo.items().length);\n`,
      currentCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  trouverParId(id: T['id']): T | undefined {\n    return this.#items().find(i => i.id === id);\n  }\n\n  // Écrivez ajouter(element: T): void avec garde anti-doublon :\n  ajouter(element: T): void {\n    \n  }\n}\n\n// Test d'exécution :\nconst repo = new Repository<{ id: number; nom: string }>();\nrepo.ajouter({ id: 10, nom: "Disque SSD" });\ntry {\n  repo.ajouter({ id: 10, nom: "Disque Doublon" });\n} catch (e: any) {\n  console.log("Doublon intercepté :", e.message);\n}\nconsole.log("Total après tentative :", repo.items().length);\n`,
      isCompleted: false,
      solutionExplanation: [
        "La règle métier d'unicité de clé primaire est protégée au niveau du service, pas dans l'IHM.",
        "La méthode `trouverParId` réutilise le travail déjà fait (DRY).",
        "L'ajout préserve l'immutabilité du tableau grâce à `.update()` et au spread operator."
      ],
      criteria: [
        {
          id: 'c15-duplicate-check',
          label: "Détection du doublon avec levée d'Error",
          description: "La méthode doit lever une exception si l'id existe déjà.",
          passed: false,
          hint: "if (this.trouverParId(element.id)) throw new Error(...);"
        },
        {
          id: 'c15-immutable-update',
          label: "Mise à jour réactive immutable",
          description: "L'ajout valide doit passer par this.#items.update(l => [...l, element]).",
          passed: false,
          hint: "this.#items.update(liste => [...liste, element]);"
        },
        {
          id: 'c15-interception-log',
          label: "Doublon intercepté et taille finale égale à 1",
          description: "La console doit afficher l'interception et un total de 1 élément.",
          passed: false,
          hint: "Total après tentative : 1."
        }
      ]
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: 'Suppression par identifiant & Compteur réactif',
      subtitle: "Compléter les opérations CRUD et ajouter une projection computed",
      sectionId: 'universal-repository',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        "Complétez `Repository<T>` avec : 1) une propriété publique `readonly compteur = computed(() => this.#items().length)` ; 2) la méthode `supprimer(id: T['id']): void` qui filtre les éléments via `.update()`.",
      hint: "Dans supprimer : `this.#items.update(liste => liste.filter(i => i.id !== id));`",
      initialCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  // 1. Ajoutez le compteur réactif computed() :\n  \n\n  constructor(elementsInitiaux: T[] = []) {\n    this.#items.set(elementsInitiaux);\n  }\n\n  // 2. Écrivez supprimer(id: T['id']): void :\n  supprimer(id: T['id']): void {\n    \n  }\n}\n\n// Test d'exécution :\nconst repo = new Repository<{ id: string; titre: string }>([\n  { id: "A", titre: "Doc A" },\n  { id: "B", titre: "Doc B" }\n]);\nconsole.log("Compteur initial :", repo.compteur());\nrepo.supprimer("A");\nconsole.log("Compteur après suppression :", repo.compteur());\n`,
      solutionCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  readonly compteur = computed(() => this.#items().length);\n\n  constructor(elementsInitiaux: T[] = []) {\n    this.#items.set(elementsInitiaux);\n  }\n\n  supprimer(id: T['id']): void {\n    this.#items.update(liste => liste.filter(i => i.id !== id));\n  }\n}\n\nconst repo = new Repository<{ id: string; titre: string }>([\n  { id: "A", titre: "Doc A" },\n  { id: "B", titre: "Doc B" }\n]);\nconsole.log("Compteur initial :", repo.compteur());\nrepo.supprimer("A");\nconsole.log("Compteur après suppression :", repo.compteur());\n`,
      currentCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n\n  // 1. Ajoutez le compteur réactif computed() :\n  \n\n  constructor(elementsInitiaux: T[] = []) {\n    this.#items.set(elementsInitiaux);\n  }\n\n  // 2. Écrivez supprimer(id: T['id']): void :\n  supprimer(id: T['id']): void {\n    \n  }\n}\n\n// Test d'exécution :\nconst repo = new Repository<{ id: string; titre: string }>([\n  { id: "A", titre: "Doc A" },\n  { id: "B", titre: "Doc B" }\n]);\nconsole.log("Compteur initial :", repo.compteur());\nrepo.supprimer("A");\nconsole.log("Compteur après suppression :", repo.compteur());\n`,
      isCompleted: false,
      solutionExplanation: [
        "La suppression via `.filter()` génère une nouvelle référence de tableau : le signal se réveille instantanément.",
        "`compteur` étant un signal `computed`, sa valeur est recalculée automatiquement sans code additionnel.",
        "Le Repository est désormais un composant logiciel complet prêt pour l'architecture MediaStore."
      ],
      criteria: [
        {
          id: 'c16-compteur-computed',
          label: "Propriété compteur déclarée avec computed()",
          description: "compteur doit renvoyer this.#items().length.",
          passed: false,
          hint: "readonly compteur = computed(() => this.#items().length);"
        },
        {
          id: 'c16-filter-update',
          label: "Suppression immutable via .filter()",
          description: "La méthode supprimer doit mettre à jour le signal avec un filtre.",
          passed: false,
          hint: "this.#items.update(l => l.filter(i => i.id !== id));"
        },
        {
          id: 'c16-compteur-evolution',
          label: "Compteur passant de 2 à 1 en console",
          description: "La console doit afficher 2 puis 1.",
          passed: false,
          hint: "Compteur initial : 2 puis Compteur après suppression : 1."
        }
      ]
    },

    // =========================================================================
    // LABO 6 : Spécialisation Métier & Atelier Film (4 exercices)
    // =========================================================================
    {
      id: 'ex-6-1',
      labNumber: 6,
      number: '6.1',
      title: 'Spécialisation sans réécriture (ClientService)',
      subtitle: "Hériter de toutes les capacités CRUD en une ligne de code",
      sectionId: 'media-store-case',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        "Créez la classe `ClientService` qui étend `Repository<Client>`. Constatez que la classe peut rester totalement vide tout en permettant d'ajouter, chercher et supprimer des clients !",
      hint: "Syntaxe : `export class ClientService extends Repository<Client> {}`",
      initialCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  items: T[] = [];\n  ajouter(e: T): void { this.items.push(e); }\n}\n\nclass Client implements Identifiable {\n  constructor(public readonly id: string, public readonly nom: string) {}\n}\n\n// 1. Déclarez ClientService qui hérite de Repository<Client> :\n\n\n// Test d'exécution :\nconst service = new ClientService();\nservice.ajouter(new Client("CLI-001", "Jean Dupont"));\nconsole.log("Client géré par le service :", service.items[0].nom);\n`,
      solutionCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  items: T[] = [];\n  ajouter(e: T): void { this.items.push(e); }\n}\n\nclass Client implements Identifiable {\n  constructor(public readonly id: string, public readonly nom: string) {}\n}\n\nexport class ClientService extends Repository<Client> {}\n\nconst service = new ClientService();\nservice.ajouter(new Client("CLI-001", "Jean Dupont"));\nconsole.log("Client géré par le service :", service.items[0].nom);\n`,
      currentCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  items: T[] = [];\n  ajouter(e: T): void { this.items.push(e); }\n}\n\nclass Client implements Identifiable {\n  constructor(public readonly id: string, public readonly nom: string) {}\n}\n\n// 1. Déclarez ClientService qui hérite de Repository<Client> :\n\n\n// Test d'exécution :\nconst service = new ClientService();\nservice.ajouter(new Client("CLI-001", "Jean Dupont"));\nconsole.log("Client géré par le service :", service.items[0].nom);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Grâce à la généricité et à l'héritage, `ClientService` hérite immédiatement de toutes les méthodes typées pour `Client`.",
        "Zéro ligne de code CRUD n'a été dupliquée.",
        "Le service peut être injecté dans n'importe quel composant Angular."
      ],
      criteria: [
        {
          id: 'c17-client-service',
          label: "ClientService extends Repository<Client>",
          description: "La classe ClientService doit étendre Repository<Client>.",
          passed: false,
          hint: "class ClientService extends Repository<Client> {}"
        },
        {
          id: 'c17-inherited-crud',
          label: "Appel de la méthode héritée ajouter()",
          description: "service.ajouter doit accepter un objet Client sans erreur.",
          passed: false,
          hint: "service.ajouter(new Client(...));"
        },
        {
          id: 'c17-output-jean',
          label: "Sortie console correcte ('Jean Dupont')",
          description: "La console doit afficher le nom du client géré.",
          passed: false,
          hint: "Vérifiez l'affichage de service.items[0].nom."
        }
      ]
    },
    {
      id: 'ex-6-2',
      labNumber: 6,
      number: '6.2',
      title: 'Règle métier dédiée dans ProduitService',
      subtitle: "Adjoindre un signal calculé propre à une entité spécialisée",
      sectionId: 'media-store-case',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Créez `ProduitService` qui étend `Repository<Produit>`. Ajoutez-y une propriété propre `readonly valeurStock = computed(...)` qui calcule la somme de `prix * stock` pour tous les produits.",
      hint: "Dans la classe : `readonly valeurStock = computed(() => this.items().reduce((tot, p) => tot + p.prix * p.stock, 0));`",
      initialCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n  ajouter(e: T): void { this.#items.update(l => [...l, e]); }\n}\n\nclass Produit implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly nom: string,\n    public readonly prix: number,\n    public stock: number\n  ) {}\n}\n\n// 1. Déclarez ProduitService avec son computed valeurStock :\nexport class ProduitService extends Repository<Produit> {\n  \n}\n\n// Test d'exécution :\nconst ps = new ProduitService();\nps.ajouter(new Produit(1, "Clavier", 50, 10));  // 500 €\nps.ajouter(new Produit(2, "Souris", 25, 4));    // 100 €\nconsole.log("Valeur totale du stock :", ps.valeurStock(), "€");\n`,
      solutionCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n  ajouter(e: T): void { this.#items.update(l => [...l, e]); }\n}\n\nclass Produit implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly nom: string,\n    public readonly prix: number,\n    public stock: number\n  ) {}\n}\n\nexport class ProduitService extends Repository<Produit> {\n  readonly valeurStock = computed(() =>\n    this.items().reduce((total, p) => total + p.prix * p.stock, 0)\n  );\n}\n\nconst ps = new ProduitService();\nps.ajouter(new Produit(1, "Clavier", 50, 10));\nps.ajouter(new Produit(2, "Souris", 25, 4));\nconsole.log("Valeur totale du stock :", ps.valeurStock(), "€");\n`,
      currentCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n  ajouter(e: T): void { this.#items.update(l => [...l, e]); }\n}\n\nclass Produit implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly nom: string,\n    public readonly prix: number,\n    public stock: number\n  ) {}\n}\n\n// 1. Déclarez ProduitService avec son computed valeurStock :\nexport class ProduitService extends Repository<Produit> {\n  \n}\n\n// Test d'exécution :\nconst ps = new ProduitService();\nps.ajouter(new Produit(1, "Clavier", 50, 10));  // 500 €\nps.ajouter(new Produit(2, "Souris", 25, 4));    // 100 €\nconsole.log("Valeur totale du stock :", ps.valeurStock(), "€");\n`,
      isCompleted: false,
      solutionExplanation: [
        "La règle métier du stock n'a de sens que pour `Produit` : elle reste logée dans `ProduitService` sans polluer le Repository universel.",
        "`this.items()` est hérité du Repository générique : le calcul s'effectue automatiquement sur l'état réactif.",
        "Si on ajoute ou supprime un produit, `valeurStock` se met à jour immédiatement."
      ],
      criteria: [
        {
          id: 'c18-extends-produit',
          label: "ProduitService extends Repository<Produit>",
          description: "La classe doit hériter du Repository typé avec Produit.",
          passed: false,
          hint: "class ProduitService extends Repository<Produit>"
        },
        {
          id: 'c18-valeur-stock',
          label: "Signal calculé valeurStock présent",
          description: "valeurStock doit être un computed calculant prix * stock.",
          passed: false,
          hint: "readonly valeurStock = computed(() => ...);"
        },
        {
          id: 'c18-total-600',
          label: "Montant total de 600 € affiché en console",
          description: "50*10 + 25*4 = 600 €. La console doit afficher 600 €.",
          passed: false,
          hint: "Vérifiez le calcul de ps.valeurStock()."
        }
      ]
    },
    {
      id: 'ex-6-3',
      labNumber: 6,
      number: '6.3',
      title: "L'entité Film avec invariant métier",
      subtitle: "Valider les données d'une nouvelle entité du domaine",
      sectionId: 'media-store-case',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Déclarez la classe `Film implements Identifiable` avec `public readonly id: number`, `public readonly titre: string` et `public readonly dureeMinutes: number`. Ajoutez une validation dans le constructeur qui lève une exception si `dureeMinutes <= 0`.",
      hint: "Dans le constructeur : `if (dureeMinutes <= 0) throw new Error('Durée invalide');`",
      initialCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\n// 1. Déclarez la classe Film implements Identifiable avec sa garde métier :\n\n\n// Test d'exécution :\nconst f = new Film(1, "Inception", 148);\nconsole.log("Film valide :", f.titre, \`(\${f.dureeMinutes} min)\`);\n\ntry {\n  new Film(2, "Film Buggé", -10);\n} catch (err: any) {\n  console.log("Invariant protégé :", err.message);\n}\n`,
      solutionCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\nexport class Film implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly titre: string,\n    public readonly dureeMinutes: number\n  ) {\n    if (dureeMinutes <= 0) {\n      throw new Error("Durée invalide");\n    }\n  }\n}\n\nconst f = new Film(1, "Inception", 148);\nconsole.log("Film valide :", f.titre, \`(\${f.dureeMinutes} min)\`);\n\ntry {\n  new Film(2, "Film Buggé", -10);\n} catch (err: any) {\n  console.log("Invariant protégé :", err.message);\n}\n`,
      currentCode: `interface Identifiable {\n  readonly id: number | string;\n}\n\n// 1. Déclarez la classe Film implements Identifiable avec sa garde métier :\n\n\n// Test d'exécution :\nconst f = new Film(1, "Inception", 148);\nconsole.log("Film valide :", f.titre, \`(\${f.dureeMinutes} min)\`);\n\ntry {\n  new Film(2, "Film Buggé", -10);\n} catch (err: any) {\n  console.log("Invariant protégé :", err.message);\n}\n`,
      isCompleted: false,
      solutionExplanation: [
        "Les invariants métier de l'entité restent encapsulés dans son propre constructeur.",
        "`Film` honore le contrat `Identifiable`, ce qui lui permettra d'être directement pris en charge par `Repository<Film>`.",
        "Le Repository n'a pas besoin de connaître la notion de durée : il manipule simplement un `T extends Identifiable`."
      ],
      criteria: [
        {
          id: 'c19-film-class',
          label: "Film implements Identifiable avec id, titre, dureeMinutes",
          description: "La classe Film doit implémenter l'interface et déclarer les 3 propriétés.",
          passed: false,
          hint: "class Film implements Identifiable { constructor(...) {} }"
        },
        {
          id: 'c19-duree-guard',
          label: "Garde de durée <= 0",
          description: "Le constructeur doit refuser une durée inférieure ou égale à 0.",
          passed: false,
          hint: "if (dureeMinutes <= 0) throw new Error(...);"
        },
        {
          id: 'c19-output-inception',
          label: "Sortie console Inception (148 min) et interception du bug",
          description: "La console doit afficher Inception puis la capture de l'erreur.",
          passed: false,
          hint: "Vérifiez que l'exception sur -10 est levée et interceptée."
        }
      ]
    },
    {
      id: 'ex-6-4',
      labNumber: 6,
      number: '6.4',
      title: 'Atelier Film : FilmService et garde des 240 minutes',
      subtitle: "Brancher l'entité dans l'architecture sans changer une seule ligne du Repository",
      sectionId: 'media-store-case',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        "Complétez l'entité `Film` en y ajoutant une seconde garde interdisant les films de plus de 240 minutes (4h). Déclarez ensuite le service `@Injectable({ providedIn: 'root' }) export class FilmService extends Repository<Film>`. Ajoutez-y une méthode `dureeTotale(): number` qui somme les durées de tous les films !",
      hint: "Dans Film : `if (dureeMinutes > 240) throw new Error('Film trop long');`. Dans FilmService : `dureeTotale(): number { return this.items().reduce((tot, f) => tot + f.dureeMinutes, 0); }`",
      initialCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n  ajouter(e: T): void { this.#items.update(l => [...l, e]); }\n}\n\nexport class Film implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly titre: string,\n    public readonly dureeMinutes: number\n  ) {\n    if (dureeMinutes <= 0) throw new Error("Durée négative");\n    // 1. Ajoutez la garde rejetant les films de plus de 240 min :\n    \n  }\n}\n\n// 2. Déclarez FilmService avec son décorateur @Injectable et sa méthode dureeTotale() :\n\n\n// Test d'exécution :\nconst fs = new FilmService();\nfs.ajouter(new Film(1, "Interstellar", 169));\nfs.ajouter(new Film(2, "Le Parrain", 175));\nconsole.log("Durée totale du catalogue :", fs.dureeTotale(), "min");\n`,
      solutionCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n  ajouter(e: T): void { this.#items.update(l => [...l, e]); }\n}\n\nexport class Film implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly titre: string,\n    public readonly dureeMinutes: number\n  ) {\n    if (dureeMinutes <= 0) throw new Error("Durée négative");\n    if (dureeMinutes > 240) throw new Error("Film trop long (> 240 min)");\n  }\n}\n\n@Injectable({ providedIn: 'root' })\nexport class FilmService extends Repository<Film> {\n  dureeTotale(): number {\n    return this.items().reduce((total, f) => total + f.dureeMinutes, 0);\n  }\n}\n\nconst fs = new FilmService();\nfs.ajouter(new Film(1, "Interstellar", 169));\nfs.ajouter(new Film(2, "Le Parrain", 175));\nconsole.log("Durée totale du catalogue :", fs.dureeTotale(), "min");\n`,
      currentCode: `interface Identifiable { readonly id: number | string; }\nclass Repository<T extends Identifiable> {\n  readonly #items = signal<T[]>([]);\n  readonly items = this.#items.asReadonly();\n  ajouter(e: T): void { this.#items.update(l => [...l, e]); }\n}\n\nexport class Film implements Identifiable {\n  constructor(\n    public readonly id: number,\n    public readonly titre: string,\n    public readonly dureeMinutes: number\n  ) {\n    if (dureeMinutes <= 0) throw new Error("Durée négative");\n    // 1. Ajoutez la garde rejetant les films de plus de 240 min :\n    \n  }\n}\n\n// 2. Déclarez FilmService avec son décorateur @Injectable et sa méthode dureeTotale() :\n\n\n// Test d'exécution :\nconst fs = new FilmService();\nfs.ajouter(new Film(1, "Interstellar", 169));\nfs.ajouter(new Film(2, "Le Parrain", 175));\nconsole.log("Durée totale du catalogue :", fs.dureeTotale(), "min");\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le `Repository<T>` n'a subi **aucune modification** pour intégrer les films : c'est la victoire de la généricité.",
        "`FilmService` est décoré avec `@Injectable({ providedIn: 'root' })` et prêt pour l'injection dans les composants Angular.",
        "L'application gère désormais Produits, Clients et Films avec une robustesse maximale."
      ],
      criteria: [
        {
          id: 'c20-film-guard-240',
          label: "Garde des 240 minutes dans Film",
          description: "Le constructeur doit rejeter les durées supérieures à 240.",
          passed: false,
          hint: "if (dureeMinutes > 240) throw new Error(...);"
        },
        {
          id: 'c20-film-service',
          label: "FilmService extends Repository<Film> avec @Injectable",
          description: "Le service doit hériter de Repository<Film> et être décoré.",
          passed: false,
          hint: "@Injectable({ providedIn: 'root' }) class FilmService extends Repository<Film>"
        },
        {
          id: 'c20-duree-totale-output',
          label: "Durée totale de 344 min affichée en console (169 + 175)",
          description: "La console doit afficher 344 min.",
          passed: false,
          hint: "169 + 175 = 344 min."
        }
      ]
    }
  ]);

  readonly activeExercise = computed(() => {
    const list = this.filteredExercises();
    const idx = this.activeExerciseIndex();
    return list[idx] || list[0] || this.exercises()[0];
  });

  readonly filteredExercises = computed(() => {
    const lab = this.filterLab();
    if (lab === null) return this.exercises();
    return this.exercises().filter(e => e.labNumber === lab);
  });

  readonly completedCount = computed(() => {
    return this.exercises().filter(e => e.isCompleted).length;
  });

  readonly totalCount = computed(() => {
    return this.exercises().length;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  constructor() {
    this.loadFromStorage();
  }

  selectExercise(id: string): void {
    const list = this.filteredExercises();
    const foundIdx = list.findIndex(e => e.id === id);
    if (foundIdx !== -1) {
      this.activeExerciseIndex.set(foundIdx);
    }
  }

  setLabFilter(labNumber: number | null): void {
    this.filterLab.set(labNumber);
    this.activeExerciseIndex.set(0);
  }

  resetExercise(id: string): void {
    this.exercises.update(list => {
      return list.map(e => {
        if (e.id === id) {
          return {
            ...e,
            currentCode: e.initialCode,
            isCompleted: false,
            criteria: e.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return e;
      });
    });
    this.saveToStorage();
  }

  injectSolution(id: string): void {
    this.exercises.update(list => {
      return list.map(e => {
        if (e.id === id) {
          return {
            ...e,
            currentCode: e.solutionCode
          };
        }
        return e;
      });
    });
  }

  updateCurrentCode(id: string, code: string): void {
    this.exercises.update(list => {
      return list.map(e => {
        if (e.id === id) {
          return {
            ...e,
            currentCode: code
          };
        }
        return e;
      });
    });
    this.saveToStorage();
  }

  validateExercise(targetId: string, code: string): { success: boolean; logs: ConsoleLogEntry[]; error?: string } {
    return this.evaluate(targetId, code, 'student');
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
    const currentList = this.exercises();
    const targetEx = currentList.find(e => e.id === targetId);
    if (!targetEx) {
      return { success: false, logs: [] };
    }

    const code = stripComments(rawCode);
    const exec = this.transpiler.executeCode(rawCode);
    const updatedCriteria: ValidationCriterion[] = targetEx.criteria.map(c => ({ ...c }));
    let allPassed = false;

    switch (targetId) {
      // LABO 1 : Services & DI
      case 'ex-1-1': {
        const hasInjectable = /@Injectable\s*\(\s*\{\s*providedIn\s*:\s*['"]root['"]\s*\}\s*\)/.test(code);
        const hasIncrementer = /incrementer\s*\([^)]*\)(?:\s*:\s*[^{]+)?\s*\{[\s\S]*?(?:this\.valeur\s*\+\+|\+\+\s*this\.valeur|this\.valeur\s*\+=\s*1)/.test(code);
        const hasValue1 = exec.logs.some(l => l.text.includes('1'));

        updatedCriteria[0].passed = hasInjectable;
        updatedCriteria[1].passed = hasIncrementer;
        updatedCriteria[2].passed = hasValue1 && exec.success;
        allPassed = hasInjectable && hasIncrementer && hasValue1 && exec.success;
        break;
      }

      case 'ex-1-2': {
        const hasInjectCall = /themeService\s*=\s*inject\s*\(\s*ThemeService\s*\)/.test(code);
        const noNewTheme = !/new\s+ThemeService\b/.test(code.replace(/class\s+ThemeComponent[\s\S]*/, ''));
        const hasSombre = exec.logs.some(l => l.text.includes('sombre'));

        updatedCriteria[0].passed = hasInjectCall;
        updatedCriteria[1].passed = !/new\s+ThemeService\b/.test(code.substring(code.indexOf('class ThemeComponent')));
        updatedCriteria[2].passed = hasSombre && exec.success;
        allPassed = updatedCriteria[0].passed && updatedCriteria[1].passed && updatedCriteria[2].passed;
        break;
      }

      case 'ex-1-3': {
        const noNewPanierInCat = !/CatalogueComponent\s*\{[\s\S]*?new\s+PanierService/.test(code);
        const noNewPanierInNav = !/NavbarComponent\s*\{[\s\S]*?new\s+PanierService/.test(code);
        const hasInjectCat = /CatalogueComponent\s*\{[\s\S]*?inject\s*\(\s*PanierService\s*\)/.test(code);
        const hasInjectNav = /NavbarComponent\s*\{[\s\S]*?inject\s*\(\s*PanierService\s*\)/.test(code);
        const sees1Article = exec.logs.some(l => l.text.includes('1 article'));

        updatedCriteria[0].passed = noNewPanierInCat && noNewPanierInNav;
        updatedCriteria[1].passed = hasInjectCat && hasInjectNav;
        updatedCriteria[2].passed = sees1Article && exec.success;
        allPassed = updatedCriteria[0].passed && updatedCriteria[1].passed && updatedCriteria[2].passed;
        break;
      }

      // LABO 2 : Encapsulation & Immutabilité
      case 'ex-2-1': {
        const hasPrivateHash = /#solde\s*=\s*signal\s*\(\s*100\s*\)/.test(code);
        const hasAsReadonly = /solde\s*=\s*this\.#solde\.asReadonly\s*\(\s*\)/.test(code);
        const has150 = exec.logs.some(l => l.text.includes('150'));

        updatedCriteria[0].passed = hasPrivateHash;
        updatedCriteria[1].passed = hasAsReadonly;
        updatedCriteria[2].passed = has150 && exec.success;
        allPassed = hasPrivateHash && hasAsReadonly && has150 && exec.success;
        break;
      }

      case 'ex-2-2': {
        const codeNoComments = code.replace(/\/\/.*$/gm, '');
        const hasNoPush = !/\.push\s*\(/.test(codeNoComments);
        const hasUpdateSpread = /\.update\s*\([^)]*=>\s*\[\s*\.\.\.[^,]+,\s*[a-zA-Z0-9_$]+\s*\]\s*\)/.test(code);
        const hasTwoTasks = exec.logs.some(l => l.text.includes('2') && l.text.includes('Faire les courses'));

        updatedCriteria[0].passed = hasNoPush;
        updatedCriteria[1].passed = hasUpdateSpread;
        updatedCriteria[2].passed = hasTwoTasks && exec.success;
        allPassed = hasNoPush && hasUpdateSpread && hasTwoTasks && exec.success;
        break;
      }

      case 'ex-2-3': {
        const hasComputed = /totalTTC\s*=\s*computed\s*\(/.test(code) && /1\.2/.test(code);
        const hasImmutableAdd = /ajouterLigne[\s\S]*?\.update\s*\(/.test(code);
        const has300 = exec.logs.some(l => l.text.includes('300'));

        updatedCriteria[0].passed = hasComputed;
        updatedCriteria[1].passed = hasImmutableAdd;
        updatedCriteria[2].passed = has300 && exec.success;
        allPassed = hasComputed && hasImmutableAdd && has300 && exec.success;
        break;
      }

      // LABO 3 : Initiation à la Généricité <T>
      case 'ex-3-1': {
        const hasGenericFn = /function\s+premierElement\s*<\s*T\s*>\s*\(\s*[a-zA-Z0-9_$]+\s*:\s*T\s*\[\s*\]\s*\)/.test(code);
        const returnsFirst = /return\s+[a-zA-Z0-9_$]+\[\s*0\s*\]/.test(code);
        const has10AndAngular = exec.logs.some(l => l.text.includes('10')) && exec.logs.some(l => l.text.includes('Angular'));

        updatedCriteria[0].passed = hasGenericFn;
        updatedCriteria[1].passed = returnsFirst;
        updatedCriteria[2].passed = has10AndAngular && exec.success;
        allPassed = hasGenericFn && returnsFirst && has10AndAngular && exec.success;
        break;
      }

      case 'ex-3-2': {
        const hasRecuperer = /recuperer\s*\([^)]*\)\s*(?::\s*T)?\s*\{[\s\S]*?return\s+this\.#contenu/.test(code);
        const hasRemplacer = /remplacer\s*\(\s*[a-zA-Z0-9_$]+\s*(?::\s*T)?\s*\)[\s\S]*?this\.#contenu\s*=/.test(code);
        const has99 = exec.logs.some(l => l.text.includes('99'));

        updatedCriteria[0].passed = hasRecuperer;
        updatedCriteria[1].passed = hasRemplacer;
        updatedCriteria[2].passed = has99 && exec.success;
        allPassed = hasRecuperer && hasRemplacer && has99 && exec.success;
        break;
      }

      case 'ex-3-3': {
        const hasPaireKV = /class\s+Paire\s*<\s*K\s*,\s*V\s*>/.test(code);
        const hasProps = /cle[\s\S]*?valeur/.test(code);
        const hasClavier = exec.logs.some(l => l.text.includes('101') && l.text.includes('Clavier'));

        updatedCriteria[0].passed = hasPaireKV;
        updatedCriteria[1].passed = hasProps;
        updatedCriteria[2].passed = hasClavier && exec.success;
        allPassed = hasPaireKV && hasProps && hasClavier && exec.success;
        break;
      }

      // LABO 4 : Contraintes Génériques & Lookups
      case 'ex-4-1': {
        const hasIdentifiable = /interface\s+Identifiable\s*\{[\s\S]*?id\s*:\s*(?:number\s*\|\s*string|string\s*\|\s*number)/.test(code);
        const hasUserImpl = /class\s+Utilisateur\s+implements\s+Identifiable\b/.test(code);
        const hasAlice = exec.logs.some(l => l.text.includes('Alice') && l.text.includes('1'));

        updatedCriteria[0].passed = hasIdentifiable;
        updatedCriteria[1].passed = hasUserImpl;
        updatedCriteria[2].passed = hasAlice && exec.success;
        allPassed = hasIdentifiable && hasUserImpl && hasAlice && exec.success;
        break;
      }

      case 'ex-4-2': {
        const hasConstraint = /class\s+Registre\s*<\s*T\s+extends\s+Identifiable\s*>/.test(code);
        const hasSuppr = /supprimer\s*\([^)]*\)[\s\S]*?\.filter\s*\(/.test(code);
        const hasRemaining1 = exec.logs.some(l => l.text.includes('1'));

        updatedCriteria[0].passed = hasConstraint;
        updatedCriteria[1].passed = hasSuppr;
        updatedCriteria[2].passed = hasRemaining1 && exec.success;
        allPassed = hasConstraint && hasSuppr && hasRemaining1 && exec.success;
        break;
      }

      case 'ex-4-3': {
        const hasLookup = /chercher\s*\(\s*id\s*:\s*T\s*\[\s*['"]id['"]\s*\]\s*\)/.test(code);
        const noAny = !/chercher\s*\(\s*id\s*:\s*any\s*\)/.test(code);
        const hasAcme = exec.logs.some(l => l.text.includes('Société Acme'));

        updatedCriteria[0].passed = hasLookup;
        updatedCriteria[1].passed = noAny;
        updatedCriteria[2].passed = hasAcme && exec.success;
        allPassed = hasLookup && noAny && hasAcme && exec.success;
        break;
      }

      case 'ex-4-4': {
        const hasCoords = /class\s+Coordonnees\b/.test(code) && /latitude/.test(code) && /longitude/.test(code);
        const codeNoComments = code.replace(/\/\/.*$/gm, '');
        const noActiveInstantiation = !/new\s+Registre\s*<\s*Coordonnees\s*>/.test(codeNoComments);
        const hasSuccessLog = exec.logs.some(l => l.text.includes('Contrainte de type vérifiée avec succès'));

        updatedCriteria[0].passed = hasCoords;
        updatedCriteria[1].passed = noActiveInstantiation;
        updatedCriteria[2].passed = hasSuccessLog && exec.success;
        allPassed = hasCoords && noActiveInstantiation && hasSuccessLog && exec.success;
        break;
      }

      // LABO 5 : Repository<T> Universel
      case 'ex-5-1': {
        const hasFindOnItems = /trouverParId[\s\S]*?this\.#items\s*\(\s*\)\.find\s*\(/.test(code);
        const hasLookupSig = /trouverParId\s*\(\s*id\s*:\s*T\s*\[\s*['"]id['"]\s*\]\s*\)/.test(code);
        const hasEcran4K = exec.logs.some(l => l.text.includes('Écran 4K'));

        updatedCriteria[0].passed = hasFindOnItems;
        updatedCriteria[1].passed = hasLookupSig;
        updatedCriteria[2].passed = hasEcran4K && exec.success;
        allPassed = hasFindOnItems && hasLookupSig && hasEcran4K && exec.success;
        break;
      }

      case 'ex-5-2': {
        const hasThrow = /ajouter[\s\S]*?if\s*\([^)]*trouverParId[\s\S]*?throw\s+new\s+Error/.test(code);
        const hasImmutableAdd = /ajouter[\s\S]*?this\.#items\.update\s*\([^)]*=>\s*\[\s*\.\.\.[^,]+,\s*[a-zA-Z0-9_$]+\s*\]\s*\)/.test(code);
        const hasIntercepted = exec.logs.some(l => l.text.includes('Doublon intercepté') || l.text.includes('existe déjà')) &&
                               exec.logs.some(l => l.text.includes('Total après tentative : 1'));

        updatedCriteria[0].passed = hasThrow;
        updatedCriteria[1].passed = hasImmutableAdd;
        updatedCriteria[2].passed = hasIntercepted && exec.success;
        allPassed = hasThrow && hasImmutableAdd && hasIntercepted && exec.success;
        break;
      }

      case 'ex-5-3': {
        const hasCompteur = /compteur\s*=\s*computed\s*\(\s*\(\s*\)\s*=>\s*this\.#items\s*\(\s*\)\.length\s*\)/.test(code);
        const hasFilter = /supprimer[\s\S]*?this\.#items\.update\s*\([^)]*=>\s*[^.]+\.filter\s*\(/.test(code);
        const has2Then1 = exec.logs.some(l => l.text.includes('2')) && exec.logs.some(l => l.text.includes('1'));

        updatedCriteria[0].passed = hasCompteur;
        updatedCriteria[1].passed = hasFilter;
        updatedCriteria[2].passed = has2Then1 && exec.success;
        allPassed = hasCompteur && hasFilter && has2Then1 && exec.success;
        break;
      }

      // LABO 6 : Spécialisation Métier & Atelier Film
      case 'ex-6-1': {
        const hasClientServiceExtends = /class\s+ClientService\s+extends\s+Repository\s*<\s*Client\s*>/.test(code);
        const callsAjouter = /service\.ajouter\s*\(\s*new\s+Client\b/.test(code);
        const hasJeanDupont = exec.logs.some(l => l.text.includes('Jean Dupont'));

        updatedCriteria[0].passed = hasClientServiceExtends;
        updatedCriteria[1].passed = callsAjouter;
        updatedCriteria[2].passed = hasJeanDupont && exec.success;
        allPassed = hasClientServiceExtends && callsAjouter && hasJeanDupont && exec.success;
        break;
      }

      case 'ex-6-2': {
        const hasProduitService = /class\s+ProduitService\s+extends\s+Repository\s*<\s*Produit\s*>/.test(code);
        const hasValeurStock = /valeurStock\s*=\s*computed\s*\([\s\S]*?prix\s*\*\s*[\s\S]*?stock/.test(code);
        const has600 = exec.logs.some(l => l.text.includes('600'));

        updatedCriteria[0].passed = hasProduitService;
        updatedCriteria[1].passed = hasValeurStock;
        updatedCriteria[2].passed = has600 && exec.success;
        allPassed = hasProduitService && hasValeurStock && has600 && exec.success;
        break;
      }

      case 'ex-6-3': {
        const hasFilmClass = /class\s+Film\s+implements\s+Identifiable\b/.test(code) && /dureeMinutes/.test(code);
        const hasGuardDuree = /if\s*\([^)]*dureeMinutes\s*<=\s*0[^)]*\)[\s\S]*?throw\s+new\s+Error/.test(code);
        const hasInception = exec.logs.some(l => l.text.includes('Inception') && l.text.includes('148')) &&
                             exec.logs.some(l => l.text.includes('Invariant protégé') || l.text.includes('invalide'));

        updatedCriteria[0].passed = hasFilmClass;
        updatedCriteria[1].passed = hasGuardDuree;
        updatedCriteria[2].passed = hasInception && exec.success;
        allPassed = hasFilmClass && hasGuardDuree && hasInception && exec.success;
        break;
      }

      case 'ex-6-4': {
        const hasGuard240 = /dureeMinutes\s*>\s*240/.test(code);
        const hasFilmService = /@Injectable\s*\([^)]*\)[\s\S]*?class\s+FilmService\s+extends\s+Repository\s*<\s*Film\s*>/.test(code);
        const has344 = exec.logs.some(l => l.text.includes('344'));

        updatedCriteria[0].passed = hasGuard240;
        updatedCriteria[1].passed = hasFilmService;
        updatedCriteria[2].passed = has344 && exec.success;
        allPassed = hasGuard240 && hasFilmService && has344 && exec.success;
        break;
      }
    }

    // Mettre à jour l'exercice dans le signal
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
