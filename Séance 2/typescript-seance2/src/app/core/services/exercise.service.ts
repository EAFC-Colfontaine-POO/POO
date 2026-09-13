import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance2_exercises_v1';
  private readonly transpiler = inject(TypescriptTranspilerService);

  readonly activeExerciseIndex = signal<number>(0);
  readonly filterLab = signal<number | null>(null); // null = all labs, 1..6 = specific lab

  readonly exercises = signal<Exercise[]>([
    // ==========================================
    // LABO 1 : Types de base & Inférence (5 ex)
    // ==========================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Typage explicite de variable',
      subtitle: 'Déclarer une variable numérique avec annotation de type',
      sectionId: 'types-primitives',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Déclarez une variable nommée `note` avec le typage explicite `number`, et assignez-lui la valeur `15.5`. Affichez-la ensuite avec `console.log(note)`.',
      hint: 'Utilisez la syntaxe : let nomVariable: type = valeur;',
      initialCode: `// Déclarez ici la variable note de type number avec la valeur 15.5\n\n// Puis affichez-la dans la console :\n`,
      solutionCode: `let note: number = 15.5;\nconsole.log("Note obtenue :", note);\n`,
      currentCode: `// Déclarez ici la variable note de type number avec la valeur 15.5\n\n// Puis affichez-la dans la console :\n`,
      isCompleted: false,
      solutionExplanation: [
        "En TypeScript, le typage explicite s'écrit avec deux points : `let nomVariable: type = valeur;`.",
        "Le type `number` englobe tous les nombres (entiers et nombres à virgule flottante).",
        "`console.log(note)` permet de vérifier la valeur dans la console virtuelle."
      ],
      criteria: [
        {
          id: 'crit-note-declared',
          label: "Variable note déclarée",
          description: "La variable 'note' doit être déclarée avec let ou const.",
          passed: false,
          hint: "Écrivez : let note: number = 15.5;"
        },
        {
          id: 'crit-note-typed',
          label: "Type explicite : number",
          description: "L'annotation ': number' doit être explicitement présente.",
          passed: false,
          hint: "Ajoutez ': number' après le nom de la variable."
        },
        {
          id: 'crit-note-value',
          label: "Valeur 15.5",
          description: "La variable doit être initialisée à 15.5.",
          passed: false,
          hint: "Assignez = 15.5;"
        }
      ]
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Inférence et Union de types',
      subtitle: 'Autoriser deux types grâce à l\'opérateur union |',
      sectionId: 'types-primitives',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement: 'Par défaut, `let texte = "hello";` est inféré comme `string`, ce qui bloque `texte = 42;`. Modifiez la déclaration avec une union `string | number` pour que les deux affectations soient autorisées.',
      hint: 'Déclarez explicitement : let texte: string | number = "hello";',
      initialCode: `// Corrigez la déclaration ci-dessous avec une union :\nlet texte = "hello";\n\ntexte = 42; // TypeScript bloque ici par inférence !\nconsole.log(texte);\n`,
      solutionCode: `// Avec une union, la variable accepte string OU number\nlet texte: string | number = "hello";\n\ntexte = 42;\nconsole.log("Texte après réassignation :", texte);\n`,
      currentCode: `// Corrigez la déclaration ci-dessous avec une union :\nlet texte = "hello";\n\ntexte = 42; // TypeScript bloque ici par inférence !\nconsole.log(texte);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Quand on ne précise aucun type, TypeScript infère le type initial : `texte` devient strictement `string`.",
        "L'opérateur pipe `|` permet de créer une union de types (`string | number`).",
        "La variable peut alors successivement contenir une chaîne ou un nombre en toute sécurité."
      ],
      criteria: [
        {
          id: 'crit-union-declared',
          label: "Union string | number déclarée",
          description: "La variable texte doit être annotée ': string | number' ou ': number | string'.",
          passed: false,
          hint: "Écrivez : let texte: string | number = 'hello';"
        },
        {
          id: 'crit-reassigned',
          label: "Réassignation à 42 acceptée",
          description: "La variable texte doit recevoir 42 sans erreur.",
          passed: false,
          hint: "Conservez la ligne : texte = 42;"
        }
      ]
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Le type unknown et typeof',
      subtitle: 'Sécuriser l\'accès à une valeur inconnue avec un guard de type',
      sectionId: 'types-primitives',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Complétez la fonction `traiter(x: unknown): string` : si `typeof x === "string"`, retournez `x.toUpperCase()`, sinon retournez `"Autre"`.',
      hint: 'Utilisez if (typeof x === "string") { return x.toUpperCase(); } return "Autre";',
      initialCode: `function traiter(x: unknown): string {\n  // TODO: Vérifiez si x est une chaîne avec typeof avant d'appeler toUpperCase\n  \n  return "Autre";\n}\n\nconsole.log(traiter("bonjour")); // Doit afficher "BONJOUR"\nconsole.log(traiter(123));       // Doit afficher "Autre"\n`,
      solutionCode: `function traiter(x: unknown): string {\n  if (typeof x === "string") {\n    return x.toUpperCase();\n  }\n  return "Autre";\n}\n\nconsole.log(traiter("bonjour")); // "BONJOUR"\nconsole.log(traiter(123));       // "Autre"\n`,
      currentCode: `function traiter(x: unknown): string {\n  // TODO: Vérifiez si x est une chaîne avec typeof avant d'appeler toUpperCase\n  \n  return "Autre";\n}\n\nconsole.log(traiter("bonjour")); // Doit afficher "BONJOUR"\nconsole.log(traiter(123));       // Doit afficher "Autre"\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le type `unknown` est une alternative sûre à `any` : il interdit tout appel de méthode sans vérification préalable.",
        "Grâce à `typeof x === 'string'`, TypeScript effectue un « narrowing » (rétrécissement de type) à l'intérieur du bloc if.",
        "Le compilateur sait alors que `x` est une `string` et autorise `x.toUpperCase()`."
      ],
      criteria: [
        {
          id: 'crit-typeof-check',
          label: "Vérification typeof x === 'string'",
          description: "La fonction doit tester le type à l'aide de typeof.",
          passed: false,
          hint: "Ajoutez : if (typeof x === 'string')"
        },
        {
          id: 'crit-toupper',
          label: "Appel à toUpperCase()",
          description: "Retourner la chaîne en majuscules pour les textes.",
          passed: false,
          hint: "Écrivez : return x.toUpperCase();"
        },
        {
          id: 'crit-fallback',
          label: "Retour 'Autre' par défaut",
          description: "Retourner 'Autre' pour tout autre type.",
          passed: false,
          hint: "Terminez par : return 'Autre';"
        }
      ]
    },
    {
      id: 'ex-1-4',
      labNumber: 1,
      number: '1.4',
      title: 'Types littéraux et alias',
      subtitle: 'Restreindre une variable à des valeurs exactes',
      sectionId: 'types-primitives',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Définissez un alias de type `type Role = "admin" | "visiteur";` puis déclarez une variable `monRole: Role` initialisée à `"admin"`.',
      hint: 'Écrivez type Role = "admin" | "visiteur"; puis let monRole: Role = "admin";',
      initialCode: `// 1. Déclarez ici le type Role\n\n// 2. Déclarez une variable monRole de ce type avec la valeur "admin"\n\n`,
      solutionCode: `type Role = "admin" | "visiteur";\nlet monRole: Role = "admin";\n\nconsole.log("Rôle actuel :", monRole);\n`,
      currentCode: `// 1. Déclarez ici le type Role\n\n// 2. Déclarez une variable monRole de ce type avec la valeur "admin"\n\n`,
      isCompleted: false,
      solutionExplanation: [
        "Un type littéral fige une valeur précise comme un type autorisé.",
        "En combinant des types littéraux avec `|`, on crée une énumération simple et typée.",
        "Si l'on tentait d'écrire `monRole = 'moderateur'`, TypeScript afficherait une erreur rouge immédiate !"
      ],
      criteria: [
        {
          id: 'crit-type-role',
          label: "Alias type Role défini",
          description: "Le type Role doit accepter 'admin' ou 'visiteur'.",
          passed: false,
          hint: "type Role = 'admin' | 'visiteur';"
        },
        {
          id: 'crit-var-role',
          label: "Variable monRole déclarée et typée",
          description: "La variable monRole doit être typée avec Role et valoir 'admin'.",
          passed: false,
          hint: "let monRole: Role = 'admin';"
        }
      ]
    },
    {
      id: 'ex-1-5',
      labNumber: 1,
      number: '1.5',
      title: 'Assertion de type avec l\'opérateur as',
      subtitle: 'Indiquer explicitement le type au compilateur',
      sectionId: 'types-primitives',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Soit `let donnee: unknown = "TypeScript";`. Utilisez l\'assertion `as string` pour lire la propriété `.length` et stockez le résultat dans une variable `longueur: number`.',
      hint: 'Écrivez : let longueur: number = (donnee as string).length;',
      initialCode: `let donnee: unknown = "TypeScript";\n\n// Utilisez l'opérateur 'as' pour lire .length sur donnee :\nlet longueur: number = \n\nconsole.log("Longueur :", longueur);\n`,
      solutionCode: `let donnee: unknown = "TypeScript";\n\nlet longueur: number = (donnee as string).length;\nconsole.log("Longueur :", longueur); // 10\n`,
      currentCode: `let donnee: unknown = "TypeScript";\n\n// Utilisez l'opérateur 'as' pour lire .length sur donnee :\nlet longueur: number = \n\nconsole.log("Longueur :", longueur);\n`,
      isCompleted: false,
      solutionExplanation: [
        "L'assertion de type `(valeur as Type)` indique au compilateur : « fais-moi confiance, je sais que cette valeur est de ce type ».",
        "Elle ne modifie rien à l'exécution (aucun casting ou conversion réelle).",
        "À manipuler avec précaution, uniquement quand vous avez la certitude de la nature de la valeur."
      ],
      criteria: [
        {
          id: 'crit-as-used',
          label: "Opérateur as string utilisé",
          description: "Le code doit comporter '(donnee as string)'.",
          passed: false,
          hint: "Utilisez : (donnee as string).length"
        },
        {
          id: 'crit-length-val',
          label: "Longueur correcte (10)",
          description: "La variable longueur doit valoir 10.",
          passed: false,
          hint: "let longueur: number = (donnee as string).length;"
        }
      ]
    },

    // ==========================================
    // LABO 2 : Variables, Portée & TDZ (4 ex)
    // ==========================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Portée de bloc avec let',
      subtitle: 'Empêcher la fuite de variable hors des accolades',
      sectionId: 'scope-mutability',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Dans la fonction ci-dessous, remplacez `var i` par `let i`. Observez que `i` ne doit plus être accessible après la boucle, et retirez la ligne `console.log(i)` en dehors de la boucle pour compiler proprement.',
      hint: 'Changez for (var i = ...) en for (let i = ...) et supprimez le console.log(i) extérieur.',
      initialCode: `function compter(): void {\n  for (var i = 0; i < 3; i++) {\n    console.log("Dans la boucle :", i);\n  }\n  // Avec var, i fuit ici et affiche 3 !\n  console.log("Hors boucle :", i);\n}\n\ncompter();\n`,
      solutionCode: `function compter(): void {\n  for (let i = 0; i < 3; i++) {\n    console.log("Dans la boucle :", i);\n  }\n  // i n'existe plus en dehors du bloc for !\n}\n\ncompter();\n`,
      currentCode: `function compter(): void {\n  for (var i = 0; i < 3; i++) {\n    console.log("Dans la boucle :", i);\n  }\n  // Avec var, i fuit ici et affiche 3 !\n  console.log("Hors boucle :", i);\n}\n\ncompter();\n`,
      isCompleted: false,
      solutionExplanation: [
        "`var` a une portée fonctionnelle et « fuit » hors des structures de contrôle comme `for` ou `if`.",
        "`let` a une portée de bloc `{ }` : dès que l'exécution quitte la boucle, la variable `i` est détruite.",
        "C'est pourquoi on utilise systématiquement `let` (ou `const`) en TypeScript moderne."
      ],
      criteria: [
        {
          id: 'crit-let-in-for',
          label: "for (let i = ...)",
          description: "La boucle doit utiliser 'let' au lieu de 'var'.",
          passed: false,
          hint: "Remplacez 'var i' par 'let i'."
        },
        {
          id: 'crit-no-leaking-log',
          label: "Pas de console.log(i) extérieur",
          description: "Ne pas tenter d'accéder à i hors du bloc for.",
          passed: false,
          hint: "Supprimez la ligne 'console.log(\"Hors boucle :\", i);'."
        }
      ]
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Mutabilité du contenu avec const',
      subtitle: 'Comprendre que const n\'empêche pas la modification d\'un tableau',
      sectionId: 'scope-mutability',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Déclarez `const couleurs: string[] = ["rouge"];`. Ajoutez ensuite `"bleu"` avec la méthode `.push()` et affichez le tableau final avec `console.log(couleurs)`.',
      hint: 'couleurs.push("bleu"); fonctionne car const fige la référence, pas le contenu !',
      initialCode: `// 1. Déclarez le tableau const couleurs contenant ["rouge"]\n\n// 2. Ajoutez "bleu" avec .push()\n\n// 3. Affichez le tableau\n`,
      solutionCode: `const couleurs: string[] = ["rouge"];\ncouleurs.push("bleu");\nconsole.log("Couleurs :", couleurs); // ["rouge", "bleu"]\n`,
      currentCode: `// 1. Déclarez le tableau const couleurs contenant ["rouge"]\n\n// 2. Ajoutez "bleu" avec .push()\n\n// 3. Affichez le tableau\n`,
      isCompleted: false,
      solutionExplanation: [
        "`const` garantit que la variable `couleurs` pointera toujours vers la même case mémoire.",
        "Cependant, le tableau lui-même reste mutable : on peut ajouter, modifier ou supprimer ses éléments avec `.push()`, `.pop()`, etc.",
        "Seule la réassignation (`couleurs = [...]`) est interdite."
      ],
      criteria: [
        {
          id: 'crit-const-couleurs',
          label: "const couleurs déclaré",
          description: "Doit déclarer un tableau const initialisé avec ['rouge'].",
          passed: false,
          hint: "const couleurs: string[] = ['rouge'];"
        },
        {
          id: 'crit-push-bleu',
          label: "couleurs.push('bleu')",
          description: "Ajouter 'bleu' au tableau.",
          passed: false,
          hint: "couleurs.push('bleu');"
        }
      ]
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Interdiction de réassignation d\'une const',
      subtitle: 'Corriger une tentative illégale d\'écrasement de variable',
      sectionId: 'scope-mutability',
      estimatedTime: '3 min',
      difficulty: 'Facile',
      statement: 'Le code suivant tente de réaffecter `panier = [];`, ce qui génère une erreur. Modifiez le code pour vider le tableau sans changer sa référence (par exemple via `panier.length = 0;`), ou déclarez `let panier` si la réassignation est vraiment souhaitée.',
      hint: 'Utilisez panier.length = 0; pour vider un tableau const, ou changez const en let.',
      initialCode: `const panier: string[] = ["pomme", "poire"];\n\n// ERREUR TypeScript : Impossible d'assigner à 'panier' car c'est une constante !\npanier = [];\n\nconsole.log(panier);\n`,
      solutionCode: `const panier: string[] = ["pomme", "poire"];\n\n// Vidage propre sans réassigner la variable :\npanier.length = 0;\n\nconsole.log("Panier vidé :", panier); // []\n`,
      currentCode: `const panier: string[] = ["pomme", "poire"];\n\n// ERREUR TypeScript : Impossible d'assigner à 'panier' car c'est une constante !\npanier = [];\n\nconsole.log(panier);\n`,
      isCompleted: false,
      solutionExplanation: [
        "En TypeScript, réassigner une variable `const` provoque immédiatement l'erreur : `Cannot assign to 'panier' because it is a constant`.",
        "Pour réinitialiser le contenu d'un tableau sans réassigner sa référence, l'astuce idiomatique JavaScript/TypeScript est `tableau.length = 0;`.",
        "Si l'on doit impérativement remplacer l'objet complet, il faut utiliser `let`."
      ],
      criteria: [
        {
          id: 'crit-no-illegal-assign',
          label: "Pas de réassignation invalide de const",
          description: "Le code ne doit plus comporter 'panier = []' si panier est const.",
          passed: false,
          hint: "Remplacez 'panier = [];' par 'panier.length = 0;' ou changez const en let."
        },
        {
          id: 'crit-panier-empty',
          label: "Panier vidé (longueur 0)",
          description: "Le panier doit être vide au final.",
          passed: false,
          hint: "panier.length = 0;"
        }
      ]
    },
    {
      id: 'ex-2-4',
      labNumber: 2,
      number: '2.4',
      title: 'Temporal Dead Zone (TDZ)',
      subtitle: 'Remettre les déclarations dans le bon ordre chronologique',
      sectionId: 'scope-mutability',
      estimatedTime: '3 min',
      difficulty: 'Facile',
      statement: 'Dans la fonction suivante, `remise` est lue avant d\'être déclarée avec `let`, ce qui déclenche une erreur de Zone Morte Temporelle (TDZ). Déplacez la déclaration avant le `console.log`.',
      hint: 'Placez let remise = prix * 0.1; au début de la fonction.',
      initialCode: `function calculerRemise(prix: number): number {\n  console.log("Remise calculée :", remise); // ERREUR TDZ !\n  let remise = prix * 0.1;\n  return remise;\n}\n\nconsole.log(calculerRemise(100));\n`,
      solutionCode: `function calculerRemise(prix: number): number {\n  let remise = prix * 0.1;\n  console.log("Remise calculée :", remise);\n  return remise;\n}\n\nconsole.log(calculerRemise(100)); // 10\n`,
      currentCode: `function calculerRemise(prix: number): number {\n  console.log("Remise calculée :", remise); // ERREUR TDZ !\n  let remise = prix * 0.1;\n  return remise;\n}\n\nconsole.log(calculerRemise(100));\n`,
      isCompleted: false,
      solutionExplanation: [
        "Contrairement à `var` qui est « remonté » (*hoisted*) avec la valeur `undefined`, une variable `let` ou `const` n'est pas accessible avant sa ligne de déclaration.",
        "L'espace entre le début du bloc et la déclaration s'appelle la Temporal Dead Zone (TDZ).",
        "Y accéder lève une exception `ReferenceError` à l'exécution et une erreur au compilateur."
      ],
      criteria: [
        {
          id: 'crit-order-corrected',
          label: "Déclaration avant utilisation",
          description: "let remise doit être déclaré avant tout console.log(remise).",
          passed: false,
          hint: "Écrivez d'abord let remise = prix * 0.1; puis console.log."
        },
        {
          id: 'crit-return-remise',
          label: "Retourne 10 pour un prix de 100",
          description: "La fonction doit s'exécuter et renvoyer la remise.",
          passed: false,
          hint: "calculerRemise(100) doit retourner 10."
        }
      ]
    },

    // ==========================================
    // LABO 3 : Contrôle de Flux & Opérateurs (4 ex)
    // ==========================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Égalité stricte === vs relâchée ==',
      subtitle: 'Éviter les conversions implicites dangereuses',
      sectionId: 'flow-operators',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Écrivez une fonction `estDix(valeur: any): boolean` qui utilise l\'égalité stricte `===` pour vérifier si `valeur` est exactement le nombre `10` (sans conversion de type depuis une chaîne).',
      hint: 'return valeur === 10;',
      initialCode: `function estDix(valeur: any): boolean {\n  // TODO: Utilisez l'égalité stricte === pour tester si valeur est le nombre 10\n  return false;\n}\n\nconsole.log(estDix(10));   // Doit afficher true\nconsole.log(estDix("10")); // Doit afficher false avec === (mais true avec == !)\n`,
      solutionCode: `function estDix(valeur: any): boolean {\n  return valeur === 10;\n}\n\nconsole.log(estDix(10));   // true\nconsole.log(estDix("10")); // false\n`,
      currentCode: `function estDix(valeur: any): boolean {\n  // TODO: Utilisez l'égalité stricte === pour tester si valeur est le nombre 10\n  return false;\n}\n\nconsole.log(estDix(10));   // Doit afficher true\nconsole.log(estDix("10")); // Doit afficher false avec === (mais true avec == !)\n`,
      isCompleted: false,
      solutionExplanation: [
        "`==` effectue une conversion implicite de type (coercition) : `\"10\" == 10` renvoie `true`.",
        "`===` compare la valeur ET le type sans aucune conversion : `\"10\" === 10` renvoie `false`.",
        "En TypeScript et JavaScript moderne, la règle absolue est de toujours privilégier `===`."
      ],
      criteria: [
        {
          id: 'crit-triple-equal',
          label: "Opérateur === utilisé",
          description: "La fonction doit contenir l'opérateur d'égalité stricte ===.",
          passed: false,
          hint: "return valeur === 10;"
        },
        {
          id: 'crit-test-behavior',
          label: "Test exact : 10 -> true, '10' -> false",
          description: "La fonction doit renvoyer true pour 10 et false pour '10'.",
          passed: false,
          hint: "Vérifiez que vous comparez bien avec le nombre 10."
        }
      ]
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Parcours avec la boucle for...of',
      subtitle: 'Extraire directement les valeurs d\'un tableau',
      sectionId: 'flow-operators',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `compterMotsEnA(mots: string[]): number` qui parcourt `mots` avec `for (const mot of mots)` et compte combien de mots commencent par la lettre `"A"` ou `"a"`.',
      hint: 'Utilisez for (const mot of mots) { if (mot.startsWith("A") || mot.startsWith("a")) total++; }',
      initialCode: `function compterMotsEnA(mots: string[]): number {\n  let compteur = 0;\n  // TODO: Parcourez le tableau avec for...of\n  \n  return compteur;\n}\n\nconsole.log(compterMotsEnA(["Arbre", "Bateau", "avion", "Soleil"])); // Doit afficher 2\n`,
      solutionCode: `function compterMotsEnA(mots: string[]): number {\n  let compteur = 0;\n  for (const mot of mots) {\n    if (mot.toLowerCase().startsWith("a")) {\n      compteur++;\n    }\n  }\n  return compteur;\n}\n\nconsole.log(compterMotsEnA(["Arbre", "Bateau", "avion", "Soleil"])); // 2\n`,
      currentCode: `function compterMotsEnA(mots: string[]): number {\n  let compteur = 0;\n  // TODO: Parcourez le tableau avec for...of\n  \n  return compteur;\n}\n\nconsole.log(compterMotsEnA(["Arbre", "Bateau", "avion", "Soleil"])); // Doit afficher 2\n`,
      isCompleted: false,
      solutionExplanation: [
        "`for...of` extrait directement chaque élément (valeur) d'un tableau itérable.",
        "À l'inverse, `for...in` extrait les clés ou indices (`\"0\"`, `\"1\"`, etc.), ce qui est rarement ce que l'on souhaite sur un tableau.",
        "L'utilisation de `.toLowerCase().startsWith('a')` rend la recherche insensible à la casse."
      ],
      criteria: [
        {
          id: 'crit-for-of',
          label: "Boucle for...of présente",
          description: "Le code doit utiliser la syntaxe 'for (... of mots)'.",
          passed: false,
          hint: "for (const mot of mots) { ... }"
        },
        {
          id: 'crit-count-correct',
          label: "Résultat attendu : 2",
          description: "La fonction doit compter 'Arbre' et 'avion'.",
          passed: false,
          hint: "Testez if (mot.toLowerCase().startsWith('a')) compteur++;"
        }
      ]
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Chaînage optionnel (?.)',
      subtitle: 'Accéder sereinement à des propriétés imbriquées sans planter',
      sectionId: 'flow-operators',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `recupererVille(client: any): string` qui retourne `client?.adresse?.ville ?? "Non renseignée"`. Si `adresse` ou `ville` est manquant, la fonction ne doit pas planter.',
      hint: 'return client?.adresse?.ville ?? "Non renseignée";',
      initialCode: `function recupererVille(client: any): string {\n  // TODO: Sécurisez l'accès avec ?. et le repli ??\n  return "";\n}\n\nconst client1 = { nom: "Alice", adresse: { ville: "Bruxelles" } };\nconst client2 = { nom: "Bob" }; // Pas d'adresse !\n\nconsole.log(recupererVille(client1)); // "Bruxelles"\nconsole.log(recupererVille(client2)); // "Non renseignée" (sans crash !)\n`,
      solutionCode: `function recupererVille(client: any): string {\n  return client?.adresse?.ville ?? "Non renseignée";\n}\n\nconst client1 = { nom: "Alice", adresse: { ville: "Bruxelles" } };\nconst client2 = { nom: "Bob" };\n\nconsole.log(recupererVille(client1)); // "Bruxelles"\nconsole.log(recupererVille(client2)); // "Non renseignée"\n`,
      currentCode: `function recupererVille(client: any): string {\n  // TODO: Sécurisez l'accès avec ?. et le repli ??\n  return "";\n}\n\nconst client1 = { nom: "Alice", adresse: { ville: "Bruxelles" } };\nconst client2 = { nom: "Bob" }; // Pas d'adresse !\n\nconsole.log(recupererVille(client1)); // "Bruxelles"\nconsole.log(recupererVille(client2)); // "Non renseignée" (sans crash !)\n`,
      isCompleted: false,
      solutionExplanation: [
        "Sans `?.`, tenter d'accéder à `client2.adresse.ville` provoque une erreur fatale `TypeError: Cannot read property 'ville' of undefined`.",
        "`?.` arrête l'évaluation et retourne `undefined` dès qu'un élément de la chaîne est `null` ou `undefined`.",
        "Le `??` prend ensuite le relais pour substituer une valeur par défaut conviviale."
      ],
      criteria: [
        {
          id: 'crit-opt-chaining',
          label: "Opérateur ?. utilisé",
          description: "La fonction doit contenir l'accès optionnel client?.adresse?.ville.",
          passed: false,
          hint: "Écrivez : client?.adresse?.ville"
        },
        {
          id: 'crit-nullish-fallback',
          label: "Repli 'Non renseignée'",
          description: "Retourner 'Non renseignée' si la ville est absente.",
          passed: false,
          hint: "Ajoutez ?? 'Non renseignée'"
        }
      ]
    },
    {
      id: 'ex-3-4',
      labNumber: 3,
      number: '3.4',
      title: 'Nullish Coalescing (??) vs OR (||)',
      subtitle: 'Préserver le score 0 sans l\'écraser par la valeur par défaut',
      sectionId: 'flow-operators',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Un joueur possède `score = 0`. Avec `||`, `0 || 10` donne `10` car `0` est falsy ! Corrigez la fonction `obtenirScore(score?: number): number` avec `??` pour que `0` soit conservé et que `undefined` prenne `10`.',
      hint: 'return score ?? 10;',
      initialCode: `function obtenirScore(score?: number): number {\n  // ERREUR : || considère 0 comme faux et le remplace à tort par 10 !\n  return score || 10;\n}\n\nconsole.log("Score de 0 :", obtenirScore(0));         // Devrait être 0, mais || donne 10 !\nconsole.log("Score non défini :", obtenirScore());   // Doit donner 10\n`,
      solutionCode: `function obtenirScore(score?: number): number {\n  // ?? ne remplace QUE null ou undefined, 0 est donc préservé !\n  return score ?? 10;\n}\n\nconsole.log("Score de 0 :", obtenirScore(0));         // 0\nconsole.log("Score non défini :", obtenirScore());   // 10\n`,
      currentCode: `function obtenirScore(score?: number): number {\n  // ERREUR : || considère 0 comme faux et le remplace à tort par 10 !\n  return score || 10;\n}\n\nconsole.log("Score de 0 :", obtenirScore(0));         // Devrait être 0, mais || donne 10 !\nconsole.log("Score non défini :", obtenirScore());   // Doit donner 10\n`,
      isCompleted: false,
      solutionExplanation: [
        "`||` se déclenche pour TOUTE valeur « fausse » (*falsy*) : `0`, `\"\"`, `false`, `NaN`, `null`, `undefined`.",
        "`??` (*nullish coalescing*) ne se déclenche QUE pour `null` ou `undefined`.",
        "Quand `0` ou `\"\"` sont des valeurs légales et légitimes, `??` est indispensable pour éviter les bugs."
      ],
      criteria: [
        {
          id: 'crit-nullish-op',
          label: "Opérateur ?? utilisé",
          description: "La fonction doit remplacer || par ??.",
          passed: false,
          hint: "return score ?? 10;"
        },
        {
          id: 'crit-zero-preserved',
          label: "obtenirScore(0) === 0",
          description: "Vérifie que la valeur 0 n'est pas remplacée par 10.",
          passed: false,
          hint: "La fonction doit renvoyer 0 si on lui passe 0."
        }
      ]
    },

    // ==========================================
    // LABO 4 : Fonctions & Paramètres (5 ex)
    // ==========================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Fonction fléchée typée (Arrow Function)',
      subtitle: 'Syntaxe concise et typage strict des paramètres et retour',
      sectionId: 'functions',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Déclarez une fonction fléchée `const estPair = (n: number): boolean => n % 2 === 0;` testant si un nombre est pair.',
      hint: 'const estPair = (n: number): boolean => n % 2 === 0;',
      initialCode: `// Déclarez la fonction fléchée typée estPair :\n\n\nconsole.log(estPair(4)); // Doit afficher true\nconsole.log(estPair(7)); // Doit afficher false\n`,
      solutionCode: `const estPair = (n: number): boolean => n % 2 === 0;\n\nconsole.log(estPair(4)); // true\nconsole.log(estPair(7)); // false\n`,
      currentCode: `// Déclarez la fonction fléchée typée estPair :\n\n\nconsole.log(estPair(4)); // Doit afficher true\nconsole.log(estPair(7)); // Doit afficher false\n`,
      isCompleted: false,
      solutionExplanation: [
        "La syntaxe fléchée `(params) => expression` permet une écriture très compacte.",
        "Le typage des paramètres se place entre parenthèses : `(n: number)`.",
        "Le type de retour se place après la parenthèse fermante : `: boolean =>`."
      ],
      criteria: [
        {
          id: 'crit-arrow-syntax',
          label: "Syntaxe fléchée =>",
          description: "Doit être déclarée avec const estPair = (n: number)... => ...",
          passed: false,
          hint: "const estPair = (n: number): boolean => ..."
        },
        {
          id: 'crit-parity-logic',
          label: "Logique n % 2 === 0",
          description: "Retourne true pour 4 et false pour 7.",
          passed: false,
          hint: "Vérifiez : n % 2 === 0"
        }
      ]
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Paramètre optionnel (?)',
      subtitle: 'Rendre un argument facultatif grâce au point d\'interrogation',
      sectionId: 'functions',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `saluer(prenom: string, titre?: string): string` : si `titre` est fourni, elle retourne `"Bonjour " + titre + " " + prenom`, sinon `"Bonjour " + prenom`.',
      hint: 'if (titre) return `Bonjour ${titre} ${prenom}`; return `Bonjour ${prenom}`;',
      initialCode: `function saluer(prenom: string, titre?: string): string {\n  // TODO: Gérez la présence ou l'absence du titre optionnel\n  return "";\n}\n\nconsole.log(saluer("Amina", "Dr.")); // "Bonjour Dr. Amina"\nconsole.log(saluer("Lucas"));        // "Bonjour Lucas"\n`,
      solutionCode: `function saluer(prenom: string, titre?: string): string {\n  if (titre) {\n    return \`Bonjour \${titre} \${prenom}\`;\n  }\n  return \`Bonjour \${prenom}\`;\n}\n\nconsole.log(saluer("Amina", "Dr.")); // "Bonjour Dr. Amina"\nconsole.log(saluer("Lucas"));        // "Bonjour Lucas"\n`,
      currentCode: `function saluer(prenom: string, titre?: string): string {\n  // TODO: Gérez la présence ou l'absence du titre optionnel\n  return "";\n}\n\nconsole.log(saluer("Amina", "Dr.")); // "Bonjour Dr. Amina"\nconsole.log(saluer("Lucas"));        // "Bonjour Lucas"\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le point d'interrogation `titre?: string` indique que ce paramètre est optionnel.",
        "Son type effectif dans le corps de la fonction devient `string | undefined`.",
        "Un paramètre optionnel doit obligatoirement être placé après les paramètres obligatoires."
      ],
      criteria: [
        {
          id: 'crit-optional-mark',
          label: "Paramètre titre?: string",
          description: "La signature doit comporter 'titre?: string'.",
          passed: false,
          hint: "function saluer(prenom: string, titre?: string): string"
        },
        {
          id: 'crit-saluer-output',
          label: "Salutations correctes",
          description: "Gère les deux cas (avec et sans titre).",
          passed: false,
          hint: "Retournez 'Bonjour Dr. Amina' et 'Bonjour Lucas'."
        }
      ]
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Valeur par défaut de paramètre',
      subtitle: 'Attribuer une valeur automatique sans vérifier manuellement undefined',
      sectionId: 'functions',
      estimatedTime: '3 min',
      difficulty: 'Facile',
      statement: 'Déclarez une fonction `calculerTTC(prixHT: number, taux: number = 0.20): number` qui retourne `prixHT * (1 + taux)`.',
      hint: 'function calculerTTC(prixHT: number, taux: number = 0.20): number { return prixHT * (1 + taux); }',
      initialCode: `// Déclarez calculerTTC avec taux valant 0.20 par défaut :\nfunction calculerTTC(prixHT: number, taux: number = 0.20): number {\n  return 0;\n}\n\nconsole.log(calculerTTC(100));       // Doit afficher 120 (taux 20% par défaut)\nconsole.log(calculerTTC(100, 0.06)); // Doit afficher 106 (taux 6% fourni)\n`,
      solutionCode: `function calculerTTC(prixHT: number, taux: number = 0.20): number {\n  return prixHT * (1 + taux);\n}\n\nconsole.log(calculerTTC(100));       // 120\nconsole.log(calculerTTC(100, 0.06)); // 106\n`,
      currentCode: `// Déclarez calculerTTC avec taux valant 0.20 par défaut :\nfunction calculerTTC(prixHT: number, taux: number = 0.20): number {\n  return 0;\n}\n\nconsole.log(calculerTTC(100));       // Doit afficher 120 (taux 20% par défaut)\nconsole.log(calculerTTC(100, 0.06)); // Doit afficher 106 (taux 6% fourni)\n`,
      isCompleted: false,
      solutionExplanation: [
        "En écrivant `taux: number = 0.20`, le paramètre devient automatiquement optionnel pour l'appelant.",
        "Si l'appelant ne fournit pas de deuxième argument, TypeScript lui affecte la valeur `0.20`.",
        "Le type est même souvent inféré automatiquement à partir de la valeur par défaut."
      ],
      criteria: [
        {
          id: 'crit-default-param',
          label: "taux: number = 0.20",
          description: "Définir la valeur par défaut à 0.20.",
          passed: false,
          hint: "paramètre : taux: number = 0.20"
        },
        {
          id: 'crit-ttc-calc',
          label: "Calcul TTC exact",
          description: "prixHT * (1 + taux) donne 120 pour 100 et 106 pour 100 avec taux 0.06.",
          passed: false,
          hint: "return prixHT * (1 + taux);"
        }
      ]
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: 'Paramètres du reste (...rest)',
      subtitle: 'Accepter un nombre indéterminé d\'arguments sous forme de tableau',
      sectionId: 'functions',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `sommer(...nombres: number[]): number` qui utilise `.reduce()` pour faire la somme de tous les arguments passés.',
      hint: 'function sommer(...nombres: number[]): number { return nombres.reduce((acc, n) => acc + n, 0); }',
      initialCode: `function sommer(...nombres: number[]): number {\n  // TODO: Utilisez .reduce() sur le tableau nombres\n  return 0;\n}\n\nconsole.log(sommer(1, 2, 3, 4)); // Doit afficher 10\nconsole.log(sommer(10, 20));     // Doit afficher 30\n`,
      solutionCode: `function sommer(...nombres: number[]): number {\n  return nombres.reduce((total, n) => total + n, 0);\n}\n\nconsole.log(sommer(1, 2, 3, 4)); // 10\nconsole.log(sommer(10, 20));     // 30\n`,
      currentCode: `function sommer(...nombres: number[]): number {\n  // TODO: Utilisez .reduce() sur le tableau nombres\n  return 0;\n}\n\nconsole.log(sommer(1, 2, 3, 4)); // Doit afficher 10\nconsole.log(sommer(10, 20));     // Doit afficher 30\n`,
      isCompleted: false,
      solutionExplanation: [
        "Les paramètres rest `...nombres: number[]` collectent tous les arguments additionnels dans un véritable tableau JavaScript.",
        "On peut ensuite utiliser toutes les méthodes de tableau comme `.reduce()`, `.map()`, etc.",
        "Le paramètre rest doit toujours être le dernier paramètre de la fonction."
      ],
      criteria: [
        {
          id: 'crit-rest-syntax',
          label: "...nombres: number[]",
          description: "La signature doit comporter le rest operator ...nombres: number[].",
          passed: false,
          hint: "function sommer(...nombres: number[]): number"
        },
        {
          id: 'crit-reduce-sum',
          label: "Somme calculée avec reduce",
          description: "sommer(1, 2, 3, 4) doit donner 10.",
          passed: false,
          hint: "return nombres.reduce((acc, n) => acc + n, 0);"
        }
      ]
    },
    {
      id: 'ex-4-5',
      labNumber: 4,
      number: '4.5',
      title: 'Typage d\'une fonction callback',
      subtitle: 'Passer une fonction en argument avec un type prédicat',
      sectionId: 'functions',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Définissez le type `type Filtre = (n: number) => boolean;` puis écrivez une fonction `filtrer(elements: number[], test: Filtre): number[]` qui retourne les éléments satisfaisant le test.',
      hint: 'return elements.filter(test);',
      initialCode: `// 1. Définissez l'alias de type Filtre :\n\n\n// 2. Écrivez la fonction filtrer utilisant le callback typé :\nfunction filtrer(elements: number[], test: Filtre): number[] {\n  return [];\n}\n\nconsole.log(filtrer([1, 2, 3, 4, 5, 6], (n) => n > 3)); // [4, 5, 6]\n`,
      solutionCode: `type Filtre = (n: number) => boolean;\n\nfunction filtrer(elements: number[], test: Filtre): number[] {\n  return elements.filter(test);\n}\n\nconsole.log(filtrer([1, 2, 3, 4, 5, 6], (n) => n > 3)); // [4, 5, 6]\n`,
      currentCode: `// 1. Définissez l'alias de type Filtre :\n\n\n// 2. Écrivez la fonction filtrer utilisant le callback typé :\nfunction filtrer(elements: number[], test: Filtre): number[] {\n  return [];\n}\n\nconsole.log(filtrer([1, 2, 3, 4, 5, 6], (n) => n > 3)); // [4, 5, 6]\n`,
      isCompleted: false,
      solutionExplanation: [
        "En TypeScript, les fonctions sont des valeurs de première classe et possèdent leur propre type : `(param: Type) => TypeRetour`.",
        "Nommer ce type avec un alias (`type Filtre = ...`) rend les signatures de fonctions claires et réutilisables.",
        "Le callback passé en argument bénéficie d'une autocomplétion et d'une vérification de type instantanée."
      ],
      criteria: [
        {
          id: 'crit-type-filtre',
          label: "Type Filtre défini",
          description: "type Filtre = (n: number) => boolean;",
          passed: false,
          hint: "type Filtre = (n: number) => boolean;"
        },
        {
          id: 'crit-filter-result',
          label: "Filtrage correct [4, 5, 6]",
          description: "La fonction doit filtrer les nombres supérieurs à 3.",
          passed: false,
          hint: "return elements.filter(test);"
        }
      ]
    },

    // ==========================================
    // LABO 5 : Tableaux & Tuples (4 ex)
    // ==========================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: 'Déclaration d\'un Tuple',
      subtitle: 'Créer un tableau à taille et types fixes par position',
      sectionId: 'arrays-tuples',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Déclarez une variable `coordonnees: [number, number]` initialisée avec la latitude `48.8566` et la longitude `2.3522` (Paris).',
      hint: 'let coordonnees: [number, number] = [48.8566, 2.3522];',
      initialCode: `// Déclarez le tuple coordonnees de type [number, number] :\n\n\nconsole.log("Coordonnées :", coordonnees);\n`,
      solutionCode: `let coordonnees: [number, number] = [48.8566, 2.3522];\n\nconsole.log("Coordonnées :", coordonnees);\n`,
      currentCode: `// Déclarez le tuple coordonnees de type [number, number] :\n\n\nconsole.log("Coordonnées :", coordonnees);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Un tuple est un tableau dont le nombre d'éléments et le type de chaque position sont connus à l'avance.",
        "La syntaxe s'écrit entre crochets : `[type1, type2]`.",
        "Tenter d'y insérer une chaîne ou d'inverser les positions provoquera une erreur TypeScript."
      ],
      criteria: [
        {
          id: 'crit-tuple-type',
          label: "Type tuple [number, number]",
          description: "L'annotation doit être strictement [number, number].",
          passed: false,
          hint: "let coordonnees: [number, number] = ..."
        },
        {
          id: 'crit-tuple-values',
          label: "Valeurs [48.8566, 2.3522]",
          description: "Initialisé avec les deux nombres.",
          passed: false,
          hint: "coordonnees = [48.8566, 2.3522];"
        }
      ]
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Transformation avec .map()',
      subtitle: 'Créer un nouveau tableau avec chaque valeur doublée',
      sectionId: 'arrays-tuples',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `doublerNombres(liste: number[]): number[]` qui retourne un nouveau tableau avec chaque nombre multiplié par 2 à l\'aide de `.map()`.',
      hint: 'return liste.map(n => n * 2);',
      initialCode: `function doublerNombres(liste: number[]): number[] {\n  // TODO: Utilisez .map() pour multiplier chaque nombre par 2\n  return [];\n}\n\nconsole.log(doublerNombres([1, 2, 3, 4])); // Doit afficher [2, 4, 6, 8]\n`,
      solutionCode: `function doublerNombres(liste: number[]): number[] {\n  return liste.map((n) => n * 2);\n}\n\nconsole.log(doublerNombres([1, 2, 3, 4])); // [2, 4, 6, 8]\n`,
      currentCode: `function doublerNombres(liste: number[]): number[] {\n  // TODO: Utilisez .map() pour multiplier chaque nombre par 2\n  return [];\n}\n\nconsole.log(doublerNombres([1, 2, 3, 4])); // Doit afficher [2, 4, 6, 8]\n`,
      isCompleted: false,
      solutionExplanation: [
        "`.map()` est une méthode fonctionnelle non-mutative : elle parcourt chaque élément et renvoie un tout nouveau tableau.",
        "TypeScript infère automatiquement le type du nouveau tableau retourné.",
        "Le tableau original `liste` reste parfaitement intact."
      ],
      criteria: [
        {
          id: 'crit-map-used',
          label: "Méthode .map() utilisée",
          description: "Le code doit utiliser .map().",
          passed: false,
          hint: "return liste.map(...);"
        },
        {
          id: 'crit-doubled-values',
          label: "Résultat doublé [2, 4, 6, 8]",
          description: "Vérifie le calcul pour [1, 2, 3, 4].",
          passed: false,
          hint: "Chaque élément doit être multiplié par 2."
        }
      ]
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: 'Filtrage avec .filter()',
      subtitle: 'Sélectionner les éléments respectant une condition',
      sectionId: 'arrays-tuples',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Écrivez une fonction `filtrerAdmis(notes: number[]): number[]` qui retourne uniquement les notes supérieures ou égales à 10 grâce à `.filter()`.',
      hint: 'return notes.filter(n => n >= 10);',
      initialCode: `function filtrerAdmis(notes: number[]): number[] {\n  // TODO: Conservez uniquement les notes >= 10\n  return [];\n}\n\nconsole.log(filtrerAdmis([14, 8, 12, 9, 18, 6])); // Doit afficher [14, 12, 18]\n`,
      solutionCode: `function filtrerAdmis(notes: number[]): number[] {\n  return notes.filter((n) => n >= 10);\n}\n\nconsole.log(filtrerAdmis([14, 8, 12, 9, 18, 6])); // [14, 12, 18]\n`,
      currentCode: `function filtrerAdmis(notes: number[]): number[] {\n  // TODO: Conservez uniquement les notes >= 10\n  return [];\n}\n\nconsole.log(filtrerAdmis([14, 8, 12, 9, 18, 6])); // Doit afficher [14, 12, 18]\n`,
      isCompleted: false,
      solutionExplanation: [
        "`.filter()` prend une fonction prédicat retournant un booléen.",
        "Si le prédicat vaut `true`, l'élément est conservé dans le nouveau tableau ; sinon il est écarté.",
        "Pratique et très lisible par rapport à une boucle impérative avec `push`."
      ],
      criteria: [
        {
          id: 'crit-filter-used',
          label: "Méthode .filter() utilisée",
          description: "Le code doit utiliser .filter().",
          passed: false,
          hint: "return notes.filter(...);"
        },
        {
          id: 'crit-filter-result',
          label: "Notes filtrées [14, 12, 18]",
          description: "Seules les notes >= 10 doivent subsister.",
          passed: false,
          hint: "n >= 10"
        }
      ]
    },
    {
      id: 'ex-5-4',
      labNumber: 5,
      number: '5.4',
      title: 'Déstructuration de tableau',
      subtitle: 'Extraire les premiers éléments dans des variables distinctes',
      sectionId: 'arrays-tuples',
      estimatedTime: '3 min',
      difficulty: 'Facile',
      statement: 'Soit `const podium = ["Or", "Argent", "Bronze"];`. Utilisez la déstructuration de tableau pour extraire les deux premières places dans deux constantes `premier` et `second`.',
      hint: 'const [premier, second] = podium;',
      initialCode: `const podium = ["Or", "Argent", "Bronze"];\n\n// Déstructurez ici pour extraire premier et second :\n\n\nconsole.log("1er :", premier, "| 2nd :", second);\n`,
      solutionCode: `const podium = ["Or", "Argent", "Bronze"];\n\nconst [premier, second] = podium;\n\nconsole.log("1er :", premier, "| 2nd :", second); // Or | Argent\n`,
      currentCode: `const podium = ["Or", "Argent", "Bronze"];\n\n// Déstructurez ici pour extraire premier et second :\n\n\nconsole.log("1er :", premier, "| 2nd :", second);\n`,
      isCompleted: false,
      solutionExplanation: [
        "La déstructuration de tableau `const [a, b] = tab;` assigne par position : `a` reçoit `tab[0]` et `b` reçoit `tab[1]`.",
        "Elle évite d'écrire `const premier = podium[0]; const second = podium[1];`.",
        "TypeScript déduit automatiquement le type des variables créées."
      ],
      criteria: [
        {
          id: 'crit-destructuring',
          label: "const [premier, second] = ...",
          description: "Utilise la syntaxe de déstructuration de tableau.",
          passed: false,
          hint: "const [premier, second] = podium;"
        },
        {
          id: 'crit-values-extracted',
          label: "premier vaut 'Or', second vaut 'Argent'",
          description: "Vérifie les valeurs extraites.",
          passed: false,
          hint: "premier doit être 'Or' et second 'Argent'."
        }
      ]
    },

    // ==========================================
    // LABO 6 : Objets, Interfaces & Duck Typing (5 ex)
    // ==========================================
    {
      id: 'ex-6-1',
      labNumber: 6,
      number: '6.1',
      title: 'Première interface TypeScript',
      subtitle: 'Décrire la forme d\'un objet avec nom et âge',
      sectionId: 'objects-interfaces',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Déclarez une `interface Etudiant` contenant `nom: string` et `age: number`. Créez ensuite une constante `etudiant1: Etudiant` avec les valeurs `"Amina"` et `21`.',
      hint: 'interface Etudiant { nom: string; age: number; } puis const etudiant1: Etudiant = { nom: "Amina", age: 21 };',
      initialCode: `// 1. Déclarez l'interface Etudiant :\n\n\n// 2. Créez la constante etudiant1 conforme à l'interface :\n\n\nconsole.log("Étudiant :", etudiant1);\n`,
      solutionCode: `interface Etudiant {\n  nom: string;\n  age: number;\n}\n\nconst etudiant1: Etudiant = {\n  nom: "Amina",\n  age: 21\n};\n\nconsole.log("Étudiant :", etudiant1);\n`,
      currentCode: `// 1. Déclarez l'interface Etudiant :\n\n\n// 2. Créez la constante etudiant1 conforme à l'interface :\n\n\nconsole.log("Étudiant :", etudiant1);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Une interface décrit un contrat de forme pour un objet.",
        "Elle ne génère aucun code JavaScript à la compilation (effacement de type).",
        "Si l'on oublie une propriété ou que l'on se trompe de type, TypeScript le signale immédiatement."
      ],
      criteria: [
        {
          id: 'crit-interface-etudiant',
          label: "interface Etudiant déclarée",
          description: "Doit comporter nom: string et age: number.",
          passed: false,
          hint: "interface Etudiant { nom: string; age: number; }"
        },
        {
          id: 'crit-obj-etudiant1',
          label: "etudiant1 conforme créé",
          description: "Doit être typé avec Etudiant et initialisé.",
          passed: false,
          hint: "const etudiant1: Etudiant = { nom: 'Amina', age: 21 };"
        }
      ]
    },
    {
      id: 'ex-6-2',
      labNumber: 6,
      number: '6.2',
      title: 'Propriété optionnelle dans une interface',
      subtitle: 'Autoriser un champ manquant sans erreur de compilation',
      sectionId: 'objects-interfaces',
      estimatedTime: '3 min',
      difficulty: 'Facile',
      statement: 'Ajoutez une propriété optionnelle `email?: string` à l\'interface `Etudiant`, et créez un objet `etudiantSansEmail` valide sans renseigner d\'email.',
      hint: 'email?: string dans l\'interface permet de ne pas la renseigner lors de la création de l\'objet.',
      initialCode: `interface Etudiant {\n  nom: string;\n  age: number;\n  // TODO: Ajoutez ici email comme propriété optionnelle string\n}\n\n// Créez etudiantSansEmail sans spécifier d'email :\nconst etudiantSansEmail: Etudiant = {\n  nom: "Lucas",\n  age: 22\n};\n\nconsole.log(etudiantSansEmail);\n`,
      solutionCode: `interface Etudiant {\n  nom: string;\n  age: number;\n  email?: string;\n}\n\nconst etudiantSansEmail: Etudiant = {\n  nom: "Lucas",\n  age: 22\n};\n\nconsole.log("Étudiant sans email :", etudiantSansEmail);\n`,
      currentCode: `interface Etudiant {\n  nom: string;\n  age: number;\n  // TODO: Ajoutez ici email comme propriété optionnelle string\n}\n\n// Créez etudiantSansEmail sans spécifier d'email :\nconst etudiantSansEmail: Etudiant = {\n  nom: "Lucas",\n  age: 22\n};\n\nconsole.log(etudiantSansEmail);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le `?` après le nom d'une propriété indique que l'objet n'est pas tenu de la fournir.",
        "Sa valeur sera `undefined` si elle n'est pas initialisée.",
        "Très courant pour les formulaires où certains champs sont facultatifs."
      ],
      criteria: [
        {
          id: 'crit-opt-email',
          label: "email?: string dans l'interface",
          description: "La propriété email doit comporter un point d'interrogation.",
          passed: false,
          hint: "email?: string;"
        },
        {
          id: 'crit-valid-object',
          label: "Objet etudiantSansEmail valide",
          description: "L'objet compile sans comporter de champ email.",
          passed: false,
          hint: "L'objet ne doit avoir que nom et age."
        }
      ]
    },
    {
      id: 'ex-6-3',
      labNumber: 6,
      number: '6.3',
      title: 'Propriété en lecture seule (readonly)',
      subtitle: 'Verrouiller une propriété contre toute modification ultérieure',
      sectionId: 'objects-interfaces',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Déclarez une `interface Livre` avec `readonly isbn: string` et `titre: string`. Créez un livre `monLivre: Livre` puis vérifiez qu\'une réassignation de `isbn` est bien interdite (commentez la ligne de réassignation pour que le code final compile).',
      hint: 'readonly isbn: string; puis commentez monLivre.isbn = "..." avec //',
      initialCode: `interface Livre {\n  // TODO: Déclarez isbn en readonly string\n  isbn: string;\n  titre: string;\n}\n\nconst monLivre: Livre = {\n  isbn: "978-2070368228",\n  titre: "1984"\n};\n\n// Si vous décommentez la ligne ci-dessous, TypeScript doit crier à l'erreur !\n// monLivre.isbn = "autre";\n\nconsole.log("Livre créé :", monLivre.titre, monLivre.isbn);\n`,
      solutionCode: `interface Livre {\n  readonly isbn: string;\n  titre: string;\n}\n\nconst monLivre: Livre = {\n  isbn: "978-2070368228",\n  titre: "1984"\n};\n\n// monLivre.isbn = "autre"; // Erreur : Cannot assign to 'isbn' because it is a read-only property.\nconsole.log("Livre créé :", monLivre.titre, monLivre.isbn);\n`,
      currentCode: `interface Livre {\n  // TODO: Déclarez isbn en readonly string\n  isbn: string;\n  titre: string;\n}\n\nconst monLivre: Livre = {\n  isbn: "978-2070368228",\n  titre: "1984"\n};\n\n// Si vous décommentez la ligne ci-dessous, TypeScript doit crier à l'erreur !\n// monLivre.isbn = "autre";\n\nconsole.log("Livre créé :", monLivre.titre, monLivre.isbn);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le mot-clé `readonly` indique que la propriété ne peut être assignée que lors de la création de l'objet.",
        "Toute écriture ultérieure `obj.propriete = ...` est refusée par le compilateur.",
        "Idéal pour les identifiants uniques, clés primaires ou données immuables."
      ],
      criteria: [
        {
          id: 'crit-readonly-isbn',
          label: "readonly isbn: string",
          description: "L'interface Livre doit marquer isbn comme readonly.",
          passed: false,
          hint: "readonly isbn: string;"
        },
        {
          id: 'crit-livre-instantiated',
          label: "Instance monLivre valide",
          description: "Livre instancié avec isbn et titre.",
          passed: false,
          hint: "monLivre doit posséder isbn et titre."
        }
      ]
    },
    {
      id: 'ex-6-4',
      labNumber: 6,
      number: '6.4',
      title: 'Typage structurel (Duck Typing)',
      subtitle: 'Comprendre pourquoi un objet avec plus de propriétés reste accepté',
      sectionId: 'objects-interfaces',
      estimatedTime: '4 min',
      difficulty: 'Intermédiaire',
      statement: 'Observez la fonction `afficherCompte(c: { id: number; nom: string })`. Passez-lui l\'objet `utilisateurComplet` qui possède 3 propriétés (`id`, `nom`, `role`). Observez que le code est parfaitement accepté grâce au typage structurel !',
      hint: 'afficherCompte(utilisateurComplet); fonctionne car utilisateurComplet a AU MOINS id et nom !',
      initialCode: `function afficherCompte(c: { id: number; nom: string }): string {\n  return \`Compte #\${c.id} : \${c.nom}\`;\n}\n\n// Cet objet a 3 propriétés (dont 'role') :\nconst utilisateurComplet = {\n  id: 42,\n  nom: "Chloé",\n  role: "Administratrice"\n};\n\n// TODO: Appelez afficherCompte avec utilisateurComplet et observez le résultat\nconst message = "";\nconsole.log(message);\n`,
      solutionCode: `function afficherCompte(c: { id: number; nom: string }): string {\n  return \`Compte #\${c.id} : \${c.nom}\`;\n}\n\nconst utilisateurComplet = {\n  id: 42,\n  nom: "Chloé",\n  role: "Administratrice"\n};\n\nconst message = afficherCompte(utilisateurComplet);\nconsole.log(message); // "Compte #42 : Chloé"\n`,
      currentCode: `function afficherCompte(c: { id: number; nom: string }): string {\n  return \`Compte #\${c.id} : \${c.nom}\`;\n}\n\n// Cet objet a 3 propriétés (dont 'role') :\nconst utilisateurComplet = {\n  id: 42,\n  nom: "Chloé",\n  role: "Administratrice"\n};\n\n// TODO: Appelez afficherCompte avec utilisateurComplet et observez le résultat\nconst message = "";\nconsole.log(message);\n`,
      isCompleted: false,
      solutionExplanation: [
        "En TypeScript, la compatibilité de type ne repose pas sur le nom du type (typage nominal), mais sur sa composition interne (typage structurel ou *duck typing*).",
        "Si un objet possède AU MINIMUM toutes les propriétés exigées par le type cible, il est compatible !",
        "La propriété supplémentaire `role` ne pose aucun problème lors de l'appel."
      ],
      criteria: [
        {
          id: 'crit-duck-call',
          label: "Appel afficherCompte(utilisateurComplet)",
          description: "La fonction doit être appelée avec l'objet plus riche.",
          passed: false,
          hint: "const message = afficherCompte(utilisateurComplet);"
        },
        {
          id: 'crit-msg-output',
          label: "Message 'Compte #42 : Chloé'",
          description: "Le résultat doit être affiché.",
          passed: false,
          hint: "console.log(message) doit donner 'Compte #42 : Chloé'."
        }
      ]
    },
    {
      id: 'ex-6-5',
      labNumber: 6,
      number: '6.5',
      title: 'Signature d\'index (Dictionnaire dynamique)',
      subtitle: 'Typer un objet dont les clés ne sont pas connues d\'avance',
      sectionId: 'objects-interfaces',
      estimatedTime: '4 min',
      difficulty: 'Intermédiaire',
      statement: 'Déclarez une `interface Scores` avec une signature d\'index `[joueur: string]: number;`. Créez un objet `tableauScores: Scores` contenant les scores de `"Alice": 150` et `"Bob": 120`.',
      hint: 'interface Scores { [joueur: string]: number; }',
      initialCode: `// 1. Déclarez l'interface Scores avec la signature d'index [joueur: string]: number\n\n\n// 2. Initialisez tableauScores avec les scores d'Alice et Bob\nconst tableauScores: Scores = {\n\n};\n\nconsole.log(tableauScores);\n`,
      solutionCode: `interface Scores {\n  [joueur: string]: number;\n}\n\nconst tableauScores: Scores = {\n  Alice: 150,\n  Bob: 120\n};\n\nconsole.log("Tableau des scores :", tableauScores);\n`,
      currentCode: `// 1. Déclarez l'interface Scores avec la signature d'index [joueur: string]: number\n\n\n// 2. Initialisez tableauScores avec les scores d'Alice et Bob\nconst tableauScores: Scores = {\n\n};\n\nconsole.log(tableauScores);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Une signature d'index `[cle: string]: TypeValeur` permet de typer des dictionnaires ou tables de hachage.",
        "Elle accepte n'importe quelle chaîne comme nom de propriété, tout en imposant que la valeur associée soit du type spécifié (ici `number`).",
        "Si l'on tentait d'ajouter `Alice: 'cent cinquante'`, TypeScript bloquerait immédiatement."
      ],
      criteria: [
        {
          id: 'crit-index-signature',
          label: "[joueur: string]: number",
          description: "L'interface Scores doit comporter la signature d'index.",
          passed: false,
          hint: "interface Scores { [joueur: string]: number; }"
        },
        {
          id: 'crit-scores-values',
          label: "Scores d'Alice (150) et Bob (120)",
          description: "tableauScores doit comporter les deux entrées.",
          passed: false,
          hint: "Alice: 150, Bob: 120"
        }
      ]
    }
  ]);

  // Computed properties
  readonly completedCount = computed(() => {
    return this.exercises().filter(ex => ex.isCompleted).length;
  });

  readonly totalCount = computed(() => {
    return this.exercises().length;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  readonly currentExercise = computed(() => {
    const list = this.filteredExercises();
    const idx = this.activeExerciseIndex();
    return list[idx] || list[0] || this.exercises()[0];
  });

  readonly filteredExercises = computed(() => {
    const lab = this.filterLab();
    if (lab === null) return this.exercises();
    return this.exercises().filter(ex => ex.labNumber === lab);
  });

  constructor() {
    this.loadFromStorage();
  }

  selectExercise(idx: number): void {
    const list = this.filteredExercises();
    if (idx >= 0 && idx < list.length) {
      this.activeExerciseIndex.set(idx);
    }
  }

  selectExerciseById(id: string): void {
    const list = this.filteredExercises();
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.activeExerciseIndex.set(idx);
    } else {
      // Find globally and reset filter
      const globalIdx = this.exercises().findIndex(e => e.id === id);
      if (globalIdx !== -1) {
        this.filterLab.set(null);
        this.activeExerciseIndex.set(globalIdx);
      }
    }
  }

  setLabFilter(labNumber: number | null): void {
    this.filterLab.set(labNumber);
    this.activeExerciseIndex.set(0);
  }

  updateCurrentCode(newCode: string): void {
    const currentEx = this.currentExercise();
    if (!currentEx) return;

    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === currentEx.id) {
          return { ...ex, currentCode: newCode };
        }
        return ex;
      });
    });
  }

  resetCurrentExercise(): void {
    const currentEx = this.currentExercise();
    if (!currentEx) return;

    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === currentEx.id) {
          return {
            ...ex,
            currentCode: ex.initialCode,
            isCompleted: false,
            criteria: ex.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  loadSolution(): void {
    const currentEx = this.currentExercise();
    if (!currentEx) return;

    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === currentEx.id) {
          return {
            ...ex,
            currentCode: ex.solutionCode
          };
        }
        return ex;
      });
    });
    this.validateExercise(currentEx.id);
  }

  /**
   * Valide le code de l'exercice actif :
   * Exécute le code TypeScript dans le bac à sable, teste les critères regex et logiques.
   */
  validateExercise(exerciseId?: string): { success: boolean; logs: ConsoleLogEntry[]; error?: string } {
    const targetId = exerciseId || this.currentExercise().id;
    const ex = this.exercises().find(e => e.id === targetId);
    if (!ex) return { success: false, logs: [] };

    const code = ex.currentCode;
    const exec = this.transpiler.executeCode(code);

    let allPassed = true;
    const updatedCriteria = ex.criteria.map(c => ({ ...c }));

    switch (ex.id) {
      // Labo 1
      case 'ex-1-1': {
        const declared = /\b(let|const|var)\s+note\b/.test(code);
        const typed = /note\s*:\s*number\b/.test(code);
        const val = /=\s*15\.5\b/.test(code);
        updatedCriteria[0].passed = declared;
        updatedCriteria[1].passed = typed;
        updatedCriteria[2].passed = val;
        allPassed = declared && typed && val;
        break;
      }
      case 'ex-1-2': {
        const union = /let\s+texte\s*:\s*(string\s*\|\s*number|number\s*\|\s*string)\b/.test(code);
        const reassigned = /texte\s*=\s*42\b/.test(code);
        updatedCriteria[0].passed = union;
        updatedCriteria[1].passed = reassigned;
        allPassed = union && reassigned;
        break;
      }
      case 'ex-1-3': {
        const typeofCheck = /typeof\s+x\s*===?\s*['"]string['"]/.test(code);
        const toupper = /\.toUpperCase\(\)/.test(code);
        const fallback = /return\s+['"]Autre['"]/.test(code);
        const hasLogic = exec.logs.some(l => l.text.includes('BONJOUR')) && exec.logs.some(l => l.text.includes('Autre'));
        updatedCriteria[0].passed = typeofCheck;
        updatedCriteria[1].passed = toupper;
        updatedCriteria[2].passed = fallback;
        allPassed = typeofCheck && toupper && (fallback || hasLogic);
        break;
      }
      case 'ex-1-4': {
        const typeRole = /type\s+Role\s*=\s*(['"]admin['"]\s*\|\s*['"]visiteur['"]|['"]visiteur['"]\s*\|\s*['"]admin['"])/.test(code);
        const varRole = /\b(let|const)\s+[a-zA-Z0-9_$]+\s*:\s*Role\s*=\s*['"]admin['"]/.test(code);
        updatedCriteria[0].passed = typeRole;
        updatedCriteria[1].passed = varRole;
        allPassed = typeRole && varRole;
        break;
      }
      case 'ex-1-5': {
        const asUsed = /\(\s*donnee\s+as\s+string\s*\)\.length/.test(code) || /donnee\s+as\s+string/.test(code);
        const val10 = exec.logs.some(l => l.text.includes('10')) || /longueur\s*(:\s*number)?\s*=\s*.*\.length/.test(code);
        updatedCriteria[0].passed = asUsed;
        updatedCriteria[1].passed = val10;
        allPassed = asUsed && val10;
        break;
      }

      // Labo 2
      case 'ex-2-1': {
        const letFor = /for\s*\(\s*let\s+i\b/.test(code);
        const noLeakLog = !/console\.log\([^)]*Hors boucle[^)]*i[^)]*\)/.test(code) && !/console\.log\(\s*i\s*\)/.test(code);
        updatedCriteria[0].passed = letFor;
        updatedCriteria[1].passed = noLeakLog;
        allPassed = letFor && noLeakLog;
        break;
      }
      case 'ex-2-2': {
        const constCouleurs = /const\s+couleurs(\s*:\s*string\[\])?\s*=\s*\[\s*['"]rouge['"]\s*\]/.test(code);
        const pushBleu = /couleurs\.push\(\s*['"]bleu['"]\s*\)/.test(code);
        updatedCriteria[0].passed = constCouleurs;
        updatedCriteria[1].passed = pushBleu;
        allPassed = constCouleurs && pushBleu;
        break;
      }
      case 'ex-2-3': {
        const noReassign = !/const\s+panier[\s\S]*panier\s*=\s*\[\]/.test(code);
        const emptyDone = /panier\.length\s*=\s*0/.test(code) || /let\s+panier/.test(code);
        updatedCriteria[0].passed = noReassign;
        updatedCriteria[1].passed = emptyDone;
        allPassed = noReassign && emptyDone;
        break;
      }
      case 'ex-2-4': {
        const letIndex = code.indexOf('let remise');
        const logIndex = code.indexOf('console.log(');
        const orderCorrect = letIndex !== -1 && (logIndex === -1 || letIndex < logIndex);
        const returns10 = exec.logs.some(l => l.text.includes('10'));
        updatedCriteria[0].passed = orderCorrect;
        updatedCriteria[1].passed = returns10;
        allPassed = orderCorrect && returns10;
        break;
      }

      // Labo 3
      case 'ex-3-1': {
        const tripleEqual = /valeur\s*===\s*10\b/.test(code) || /10\s*===\s*valeur\b/.test(code);
        const logicWorks = exec.logs.some(l => l.text.includes('true')) && exec.logs.some(l => l.text.includes('false'));
        updatedCriteria[0].passed = tripleEqual;
        updatedCriteria[1].passed = logicWorks || tripleEqual;
        allPassed = tripleEqual;
        break;
      }
      case 'ex-3-2': {
        const forOf = /for\s*\(\s*(const|let)\s+[a-zA-Z0-9_$]+\s+of\s+mots\s*\)/.test(code);
        const count2 = exec.logs.some(l => l.text.includes('2')) || /compteur\s*\+\+/.test(code);
        updatedCriteria[0].passed = forOf;
        updatedCriteria[1].passed = count2;
        allPassed = forOf && count2;
        break;
      }
      case 'ex-3-3': {
        const optChaining = /client\?\.\s*adresse\?\.\s*ville/.test(code);
        const fallback = /\?\?\s*['"]Non renseignée['"]/.test(code);
        updatedCriteria[0].passed = optChaining;
        updatedCriteria[1].passed = fallback;
        allPassed = optChaining && fallback;
        break;
      }
      case 'ex-3-4': {
        const nullishUsed = /\?\?\s*10\b/.test(code);
        const zeroLogged = exec.logs.some(l => l.text.includes('Score de 0 : 0') || l.text.includes('Score de 0 :') && l.text.includes('0'));
        updatedCriteria[0].passed = nullishUsed;
        updatedCriteria[1].passed = zeroLogged || nullishUsed;
        allPassed = nullishUsed;
        break;
      }

      // Labo 4
      case 'ex-4-1': {
        const arrow = /const\s+estPair\s*=\s*\([^)]*\)\s*(:\s*boolean)?\s*=>/.test(code);
        const parity = /%\s*2\s*===?\s*0/.test(code);
        updatedCriteria[0].passed = arrow;
        updatedCriteria[1].passed = parity;
        allPassed = arrow && parity;
        break;
      }
      case 'ex-4-2': {
        const optionalMark = /titre\s*\?\s*:\s*string/.test(code);
        const saluerOutput = exec.logs.some(l => l.text.includes('Bonjour Dr. Amina')) && exec.logs.some(l => l.text.includes('Bonjour Lucas'));
        updatedCriteria[0].passed = optionalMark;
        updatedCriteria[1].passed = saluerOutput || optionalMark;
        allPassed = optionalMark;
        break;
      }
      case 'ex-4-3': {
        const defaultParam = /taux(\s*:\s*number)?\s*=\s*0\.2(0)?\b/.test(code);
        const calcWorks = exec.logs.some(l => l.text.includes('120')) && exec.logs.some(l => l.text.includes('106'));
        updatedCriteria[0].passed = defaultParam;
        updatedCriteria[1].passed = calcWorks || /prixHT\s*\*\s*\(\s*1\s*\+\s*taux\s*\)/.test(code);
        allPassed = defaultParam && updatedCriteria[1].passed;
        break;
      }
      case 'ex-4-4': {
        const restSyntax = /\.\.\.nombres\s*:\s*number\[\]/.test(code);
        const reduceUsed = /nombres\.reduce\(/.test(code);
        updatedCriteria[0].passed = restSyntax;
        updatedCriteria[1].passed = reduceUsed;
        allPassed = restSyntax && reduceUsed;
        break;
      }
      case 'ex-4-5': {
        const typeFiltre = /type\s+Filtre\s*=\s*\([^)]*\)\s*=>\s*boolean/.test(code);
        const filterResult = exec.logs.some(l => l.text.includes('4') && l.text.includes('5') && l.text.includes('6'));
        updatedCriteria[0].passed = typeFiltre;
        updatedCriteria[1].passed = filterResult || /\.filter\(/.test(code);
        allPassed = typeFiltre && updatedCriteria[1].passed;
        break;
      }

      // Labo 5
      case 'ex-5-1': {
        const tupleType = /coordonnees\s*:\s*\[\s*number\s*,\s*number\s*\]/.test(code);
        const tupleValues = /\[\s*48\.8566\s*,\s*2\.3522\s*\]/.test(code);
        updatedCriteria[0].passed = tupleType;
        updatedCriteria[1].passed = tupleValues;
        allPassed = tupleType && tupleValues;
        break;
      }
      case 'ex-5-2': {
        const mapUsed = /\.map\(/.test(code);
        const doubled = exec.logs.some(l => l.text.includes('2') && l.text.includes('4') && l.text.includes('6') && l.text.includes('8'));
        updatedCriteria[0].passed = mapUsed;
        updatedCriteria[1].passed = doubled || /\*\s*2\b/.test(code);
        allPassed = mapUsed && updatedCriteria[1].passed;
        break;
      }
      case 'ex-5-3': {
        const filterUsed = /\.filter\(/.test(code);
        const filteredResult = exec.logs.some(l => l.text.includes('14') && l.text.includes('12') && l.text.includes('18'));
        updatedCriteria[0].passed = filterUsed;
        updatedCriteria[1].passed = filteredResult || />=\s*10\b/.test(code);
        allPassed = filterUsed && updatedCriteria[1].passed;
        break;
      }
      case 'ex-5-4': {
        const destructuring = /const\s*\[\s*premier\s*,\s*second\s*\]\s*=\s*podium/.test(code);
        const values = exec.logs.some(l => l.text.includes('Or') && l.text.includes('Argent'));
        updatedCriteria[0].passed = destructuring;
        updatedCriteria[1].passed = values || destructuring;
        allPassed = destructuring;
        break;
      }

      // Labo 6
      case 'ex-6-1': {
        const iface = /interface\s+Etudiant\s*\{[\s\S]*nom\s*:\s*string[\s\S]*age\s*:\s*number[\s\S]*\}/.test(code);
        const obj = /etudiant1\s*:\s*Etudiant\s*=\s*\{[\s\S]*nom\s*:[\s\S]*age\s*:/.test(code);
        updatedCriteria[0].passed = iface;
        updatedCriteria[1].passed = obj;
        allPassed = iface && obj;
        break;
      }
      case 'ex-6-2': {
        const optEmail = /email\s*\?\s*:\s*string/.test(code);
        const objValid = /const\s+etudiantSansEmail\s*:\s*Etudiant\s*=/.test(code);
        updatedCriteria[0].passed = optEmail;
        updatedCriteria[1].passed = objValid;
        allPassed = optEmail && objValid;
        break;
      }
      case 'ex-6-3': {
        const readonlyIsbn = /readonly\s+isbn\s*:\s*string/.test(code);
        const inst = /const\s+monLivre\s*:\s*Livre\s*=/.test(code);
        updatedCriteria[0].passed = readonlyIsbn;
        updatedCriteria[1].passed = inst;
        allPassed = readonlyIsbn && inst;
        break;
      }
      case 'ex-6-4': {
        const duckCall = /afficherCompte\(\s*utilisateurComplet\s*\)/.test(code);
        const msg = exec.logs.some(l => l.text.includes('Compte #42 : Chloé'));
        updatedCriteria[0].passed = duckCall;
        updatedCriteria[1].passed = msg || duckCall;
        allPassed = duckCall;
        break;
      }
      case 'ex-6-5': {
        const indexSig = /\[\s*[a-zA-Z0-9_$]+\s*:\s*string\s*\]\s*:\s*number/.test(code);
        const scoresVal = /Alice\s*:\s*150/.test(code) && /Bob\s*:\s*120/.test(code);
        updatedCriteria[0].passed = indexSig;
        updatedCriteria[1].passed = scoresVal;
        allPassed = indexSig && scoresVal;
        break;
      }
    }

    this.exercises.update(list => {
      return list.map(item => {
        if (item.id === targetId) {
          return {
            ...item,
            isCompleted: allPassed,
            criteria: updatedCriteria
          };
        }
        return item;
      });
    });

    this.saveToStorage();

    return {
      success: allPassed,
      logs: exec.logs,
      error: exec.error
    };
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = this.exercises().map(ex => ({
        id: ex.id,
        isCompleted: ex.isCompleted,
        currentCode: ex.currentCode
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignorer si quota plein
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.exercises.update(list => {
          return list.map(ex => {
            const saved = parsed.find((p: any) => p.id === ex.id);
            if (saved) {
              return {
                ...ex,
                isCompleted: !!saved.isCompleted,
                currentCode: saved.currentCode || ex.initialCode
              };
            }
            return ex;
          });
        });
      }
    } catch {
      // Ignorer
    }
  }
}
