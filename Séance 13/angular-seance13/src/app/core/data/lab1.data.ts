import { ExerciseDef } from '../models/app.models';

export const LAB1_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-1-1',
    labNumber: 1,
    number: '1.1',
    title: 'Signal Primitif & Lecture Fonctionnelle',
    subtitle: 'Instancier une case d\'état réactive, modifier sa valeur et la lire avec ()',
    sectionId: 'zone-vs-dag',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: `1. Déclarez une variable nommée 'tentatives' initialisée avec signal<number>(0).\n2. Utilisez la méthode .set() pour lui assigner la valeur 3.\n3. Créez une variable 'valeurLue' qui stocke la lecture fonctionnelle du signal.\n4. Affichez 'valeurLue' avec console.log().`,
    hint: `Pour lire la valeur d'un signal, il faut impérativement l'appeler comme une fonction sans argument : tentatives() !`,
    initialCode: `// Exercice 1.1 — Signal Primitif & Lecture
// 1. Déclarer le signal 'tentatives' initialisé à 0
const tentatives = signal<number>(0);

// TODO: 2. Assigner la valeur 3 avec .set()


// TODO: 3. Lire la valeur du signal dans 'valeurLue' via l'appel fonctionnel ()
const valeurLue = 0; // Remplacez ici

// TODO: 4. Afficher avec console.log(valeurLue)
`,
    solutionCode: `// Exercice 1.1 — Solution officielle
const tentatives = signal<number>(0);

// 2. Remplacement unilatéral avec .set()
tentatives.set(3);

// 3. Lecture fonctionnelle avec ()
const valeurLue = tentatives();

// 4. Affichage
console.log(valeurLue);`,
    solutionExplanation: [
      "signal<number>(0) crée une cellule réactive (WritableSignal) avec 0 comme valeur initiale.",
      ".set(3) remplace la valeur actuelle par 3.",
      "L'appel tentatives() avec parenthèses lit la valeur courante et inscrit l'observateur dans le graphe réactif."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /tentatives\s*=\s*signal/,
        label: 'Déclaration du signal',
        errorMessage: "Vous devez initialiser la variable 'tentatives' avec signal()."
      },
      {
        type: 'regex',
        pattern: /tentatives\.set\s*\(\s*3\s*\)/,
        label: 'Appel de .set(3)',
        errorMessage: "Vous devez modifier le signal avec tentatives.set(3)."
      },
      {
        type: 'regex',
        pattern: /tentatives\s*\(\s*\)/,
        label: 'Lecture fonctionnelle ()',
        errorMessage: "Vous devez lire le signal avec la syntaxe fonctionnelle 'tentatives()'."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const s = sandbox.tentatives;
      const val = sandbox.valeurLue;

      const isSignal = typeof s === 'function' && typeof s.set === 'function';
      results.push({
        criterionId: 'c-1-1-1',
        passed: isSignal,
        message: isSignal ? undefined : "'tentatives' doit être un WritableSignal valide."
      });

      const hasValue3 = isSignal && s() === 3 && val === 3;
      results.push({
        criterionId: 'c-1-1-2',
        passed: hasValue3,
        message: hasValue3 ? undefined : "Le signal et 'valeurLue' doivent valoir exactement 3."
      });

      const logged3 = logs.some(l => l.includes('3'));
      results.push({
        criterionId: 'c-1-1-3',
        passed: logged3,
        message: logged3 ? undefined : "console.log(valeurLue) doit afficher 3."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-1-1-1',
        label: 'Cellule réactive signal',
        description: "'tentatives' est instancié avec signal<number>(0).",
        passed: false,
        hint: "const tentatives = signal<number>(0);"
      },
      {
        id: 'c-1-1-2',
        label: 'Mutation .set(3) et lecture',
        description: "Le signal a été mis à jour à 3 et lu fonctionnellement.",
        passed: false,
        hint: "tentatives.set(3); const valeurLue = tentatives();"
      },
      {
        id: 'c-1-1-3',
        label: 'Affichage console',
        description: "La valeur 3 est imprimée dans la console.",
        passed: false,
        hint: "console.log(valeurLue);"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-1-2',
    labNumber: 1,
    number: '1.2',
    title: 'Transition Fonctionnelle avec .update()',
    subtitle: 'Faire évoluer un état de manière atomique à partir de sa valeur précédente',
    sectionId: 'zone-vs-dag',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: `1. Soit le signal 'score' valant 100 au départ.\n2. Utilisez la méthode .update() avec une fonction fléchée pour ajouter 15 points au score.\n3. Affichez la nouvelle valeur de score() dans la console.`,
    hint: `.update() reçoit la valeur précédente en paramètre et doit renvoyer la nouvelle valeur : score.update(actuel => actuel + 15)`,
    initialCode: `// Exercice 1.2 — Transition Fonctionnelle
const score = signal<number>(100);

// TODO: Ajouter 15 points au score avec .update()


// TODO: Afficher le nouveau score avec console.log(score())
`,
    solutionCode: `// Exercice 1.2 — Solution officielle
const score = signal<number>(100);

// Transition fonctionnelle avec .update()
score.update(actuel => actuel + 15);

// Affichage
console.log(score());`,
    solutionExplanation: [
      ".update() est conçu pour les mutations qui dépendent de l'état précédent.",
      "Elle garantit une mise à jour atomique sans risque de lecture concurrente d'une valeur obsolète.",
      "Après l'opération, score() renvoie 115."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /score\.update\s*\(/,
        label: 'Utilisation de .update()',
        errorMessage: "Vous devez utiliser la méthode .update() sur 'score'."
      },
      {
        type: 'regex',
        pattern: /\+\s*15/,
        label: 'Incrément de 15',
        errorMessage: "La fonction passée à .update() doit ajouter 15 à la valeur courante."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const s = sandbox.score;

      const isSignal = typeof s === 'function' && typeof s.update === 'function';
      results.push({
        criterionId: 'c-1-2-1',
        passed: isSignal && s() === 115,
        message: isSignal && s() === 115 ? undefined : "Le score final doit valoir 115."
      });

      const logged115 = logs.some(l => l.includes('115'));
      results.push({
        criterionId: 'c-1-2-2',
        passed: logged115,
        message: logged115 ? undefined : "console.log(score()) doit afficher 115."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-1-2-1',
        label: 'Mise à jour par transition fonctionnelle',
        description: "score.update() a correctement produit 115.",
        passed: false,
        hint: "score.update(n => n + 15);"
      },
      {
        id: 'c-1-2-2',
        label: 'Sortie console',
        description: "La valeur 115 est loggée.",
        passed: false,
        hint: "console.log(score());"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-1-3',
    labNumber: 1,
    number: '1.3',
    title: 'Mise à Jour Immuable d\'une Collection',
    subtitle: 'Éviter le piège de .push() et fournir une nouvelle référence dans le Tas',
    sectionId: 'zone-vs-dag',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `Un collègue a écrit : panier().push('Clavier') pour ajouter un élément, mais le DOM ne s'actualise pas !\n1. Corrigez ce code en utilisant panier.update().\n2. Utilisez le spread operator [...] pour retourner un NOUVEAU tableau contenant les anciens articles + 'Clavier'.\n3. Vérifiez avec console.log() la longueur et le contenu de panier().`,
    hint: `panier.update(articles => [...articles, 'Clavier']) crée une nouvelle adresse mémoire dans le Tas que Object.is détectera immédiatement !`,
    initialCode: `// Exercice 1.3 — Immutabilité d'une Collection
const panier = signal<string[]>(['Écran', 'Souris']);

// ❌ CODE ERRONÉ DU COLLÈGUE (à remplacer) :
// panier().push('Clavier'); 

// TODO: Remplacez par une mise à jour immuable avec panier.update() et [...]


// TODO: Afficher le résultat avec console.log(panier())
`,
    solutionCode: `// Exercice 1.3 — Solution officielle
const panier = signal<string[]>(['Écran', 'Souris']);

// Mise à jour immuable avec nouvelle référence dans le Tas :
panier.update(articles => [...articles, 'Clavier']);

console.log(panier());`,
    solutionExplanation: [
      ".push() mute le tableau en place à la même adresse dans le Tas. Object.is(ref, ref) renvoie true et Angular reste figé.",
      "L'opérateur spread [...articles, 'Clavier'] alloue un nouveau tableau à une nouvelle adresse mémoire.",
      "Angular détecte le changement de référence et réveille le composant."
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /\.push\s*\(/,
        label: 'Interdiction de .push()',
        errorMessage: "L'usage de .push() est strictement interdit : il casse l'immutabilité réactive !"
      },
      {
        type: 'regex',
        pattern: /panier\.update\s*\(/,
        label: 'Utilisation de panier.update',
        errorMessage: "Vous devez utiliser panier.update()."
      },
      {
        type: 'regex',
        pattern: /\[\s*\.\.\./,
        label: 'Opérateur spread [...]',
        errorMessage: "Vous devez créer un nouveau tableau avec le spread operator [...articles, 'Clavier']."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const p = sandbox.panier;

      const isSignal = typeof p === 'function' && typeof p.update === 'function';
      const arr = isSignal ? p() : [];
      const isCorrect = Array.isArray(arr) && arr.length === 3 && arr[2] === 'Clavier';

      results.push({
        criterionId: 'c-1-3-1',
        passed: isCorrect,
        message: isCorrect ? undefined : "Le panier doit contenir exactement ['Écran', 'Souris', 'Clavier']."
      });

      const logged = logs.some(l => l.includes('Clavier') && l.includes('Souris'));
      results.push({
        criterionId: 'c-1-3-2',
        passed: logged,
        message: logged ? undefined : "Le panier mis à jour doit être affiché dans la console."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-1-3-1',
        label: 'Collection immuable mise à jour',
        description: "Le tableau contient 3 éléments sans mutation directe.",
        passed: false,
        hint: "panier.update(anciens => [...anciens, 'Clavier']);"
      },
      {
        id: 'c-1-3-2',
        label: 'Affichage console',
        description: "Le panier contenant 'Clavier' est loggé.",
        passed: false,
        hint: "console.log(panier());"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-1-4',
    labNumber: 1,
    number: '1.4',
    title: 'Calcul Dérivé Pur avec computed()',
    subtitle: 'Créer une cellule de projection paresseuse et mémorisée',
    sectionId: 'zone-vs-dag',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `1. Soit les signaux sources 'prixHT' valant 200 et 'tauxTVA' valant 0.20 (20%).\n2. Déclarez une variable 'prixTTC' initialisée avec computed().\n3. La formule doit retourner : prixHT() * (1 + tauxTVA()).\n4. Lisez et affichez prixTTC() avec console.log().\n5. Passez prixHT à 300 via .set(300) et observez la mise à jour automatique de prixTTC().`,
    hint: `computed(() => prixHT() * (1 + tauxTVA())) s'abonne automatiquement aux deux sources sans aucun code d'écoute manuel !`,
    initialCode: `// Exercice 1.4 — Calcul Dérivé Pur
const prixHT = signal<number>(200);
const tauxTVA = signal<number>(0.20);

// TODO: 1. Créer le signal calculé 'prixTTC' avec computed()
// const prixTTC = ...


// TODO: 2. Afficher la valeur initiale de prixTTC()
// console.log(prixTTC());

// TODO: 3. Modifier prixHT à 300 avec .set(300)


// TODO: 4. Ré-afficher prixTTC() pour constater le recalcul automatique
`,
    solutionCode: `// Exercice 1.4 — Solution officielle
const prixHT = signal<number>(200);
const tauxTVA = signal<number>(0.20);

// Projection pure mémorisée
const prixTTC = computed(() => prixHT() * (1 + tauxTVA()));

console.log(prixTTC()); // 240

// Modification de la source
prixHT.set(300);

console.log(prixTTC()); // 360`,
    solutionExplanation: [
      "computed() prend une fonction pure sans argument et renvoie un Signal en lecture seule.",
      "Lorsqu'on modifie prixHT.set(300), le graphe réactif invalide le cache et prixTTC() vaut immédiatement 360.",
      "Aucun risque de désynchronisation d'état : prixTTC est une projection mathématique."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /prixTTC\s*=\s*computed\s*\(/,
        label: 'Création de prixTTC avec computed',
        errorMessage: "Vous devez déclarer 'prixTTC' avec la primitive computed()."
      },
      {
        type: 'regex',
        pattern: /prixHT\.set\s*\(\s*300\s*\)/,
        label: 'Mise à jour de prixHT à 300',
        errorMessage: "Vous devez modifier prixHT avec prixHT.set(300)."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const ttc = sandbox.prixTTC;
      const ht = sandbox.prixHT;

      const isComputed = typeof ttc === 'function';
      const hasCorrectFinalVal = isComputed && ttc() === 360;

      results.push({
        criterionId: 'c-1-4-1',
        passed: isComputed && hasCorrectFinalVal,
        message: hasCorrectFinalVal ? undefined : "prixTTC() doit être un signal calculé valant 360 après le passage à 300 HT."
      });

      const logged240 = logs.some(l => l.includes('240'));
      const logged360 = logs.some(l => l.includes('360'));

      results.push({
        criterionId: 'c-1-4-2',
        passed: logged240 && logged360,
        message: logged240 && logged360 ? undefined : "La console doit enregistrer 240 puis 360."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-1-4-1',
        label: 'Projection réactive computed',
        description: "prixTTC calcule automatiquement le montant TTC et réagit à prixHT.set(300).",
        passed: false,
        hint: "const prixTTC = computed(() => prixHT() * (1 + tauxTVA()));"
      },
      {
        id: 'c-1-4-2',
        label: 'Historique des calculs',
        description: "Les valeurs 240 puis 360 sont émises dans la console.",
        passed: false,
        hint: "console.log(prixTTC()); prixHT.set(300); console.log(prixTTC());"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-1-5',
    labNumber: 1,
    number: '1.5',
    title: 'Dépendances Dynamiques Conditionnelles',
    subtitle: 'Comprendre que computed() ne s\'abonne qu\'aux signaux effectivement lus',
    sectionId: 'zone-vs-dag',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `1. Soit les signaux : modeAvance (booléen valant false), primeStandard (nombre valant 50) et primeAvancee (nombre valant 150).\n2. Créez un computed 'primeAccordee' : si modeAvance() est true, renvoyer primeAvancee(), sinon renvoyer primeStandard().\n3. Affichez primeAccordee() (doit valoir 50).\n4. Basculez modeAvance.set(true) et vérifiez que primeAccordee() passe dynamiquement à 150.`,
    hint: `computed(() => modeAvance() ? primeAvancee() : primeStandard()). Quand modeAvance() est false, primeAvancee n'est même pas dans les dépendances actives !`,
    initialCode: `// Exercice 1.5 — Dépendances Dynamiques Conditionnelles
const modeAvance = signal<boolean>(false);
const primeStandard = signal<number>(50);
const primeAvancee = signal<number>(150);

// TODO: Créer le computed 'primeAccordee' qui bascule selon modeAvance()
// const primeAccordee = ...


// TODO: Afficher primeAccordee() en mode standard


// TODO: Basculer modeAvance à true avec .set(true)


// TODO: Ré-afficher primeAccordee() pour observer le passage à 150
`,
    solutionCode: `// Exercice 1.5 — Solution officielle
const modeAvance = signal<boolean>(false);
const primeStandard = signal<number>(50);
const primeAvancee = signal<number>(150);

// Suivi dynamique de dépendances
const primeAccordee = computed(() => {
  return modeAvance() ? primeAvancee() : primeStandard();
});

console.log(primeAccordee()); // 50

modeAvance.set(true);

console.log(primeAccordee()); // 150`,
    solutionExplanation: [
      "Angular construit le graphe de dépendances de manière dynamique lors de chaque évaluation.",
      "Tant que modeAvance() est false, primeAvancee n'est pas lu, donc modifier primeAvancee ne déclenche aucun recalcul !",
      "Dès que modeAvance() passe à true, la branche active change et primeAccordee s'abonne à primeAvancee."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /primeAccordee\s*=\s*computed\s*\(/,
        label: 'Déclaration de primeAccordee',
        errorMessage: "Vous devez créer 'primeAccordee' avec computed()."
      },
      {
        type: 'regex',
        pattern: /modeAvance\.set\s*\(\s*true\s*\)/,
        label: 'Bascule à true',
        errorMessage: "Vous devez basculer le mode avec modeAvance.set(true)."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const pa = sandbox.primeAccordee;
      const ma = sandbox.modeAvance;

      const isComputed = typeof pa === 'function';
      const isDynamic = isComputed && ma() === true && pa() === 150;

      results.push({
        criterionId: 'c-1-5-1',
        passed: isDynamic,
        message: isDynamic ? undefined : "primeAccordee() doit valoir 150 une fois modeAvance passé à true."
      });

      const logged50 = logs.some(l => l.includes('50'));
      const logged150 = logs.some(l => l.includes('150'));

      results.push({
        criterionId: 'c-1-5-2',
        passed: logged50 && logged150,
        message: logged50 && logged150 ? undefined : "La console doit afficher 50 puis 150."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-1-5-1',
        label: 'Aiguillage conditionnel réactif',
        description: "primeAccordee s'adapte en temps réel à l'état du drapeau booléen.",
        passed: false,
        hint: "modeAvance() ? primeAvancee() : primeStandard();"
      },
      {
        id: 'c-1-5-2',
        label: 'Double sortie console',
        description: "Les valeurs 50 puis 150 sont confirmées dans la console.",
        passed: false,
        hint: "console.log(primeAccordee()); modeAvance.set(true); console.log(primeAccordee());"
      }
    ],
    isCompleted: false
  }
];
