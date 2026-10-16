import { ExerciseDef } from '../models/app.models';

export const LAB1_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-1-1',
    labNumber: 1,
    number: '1.1',
    title: 'L\'Illusion de l\'égalité d\'objets',
    subtitle: 'Comprendre pourquoi deux instances distinctes ne sont pas égales par ===',
    sectionId: 'memory-model-identity',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Instanciez deux objets distincts p1 et p2 de la classe Point avec les mêmes coordonnées x = 5 et y = 10. Affichez via console.log la comparaison p1 === p2 (qui doit valoir false) et l\'égalité des coordonnées p1.x === p2.x (qui doit valoir true).',
    hint: 'Déclarez const p1 = new Point(5, 10); et const p2 = new Point(5, 10);. Utilisez console.log(p1 === p2); puis console.log(p1.x === p2.x);',
    initialCode: `class Point {
  constructor(public x: number, public y: number) {}
}

// TODO: 1. Instanciez p1 avec x=5, y=10
// TODO: 2. Instanciez p2 avec x=5, y=10
// TODO: 3. Affichez console.log(p1 === p2)
// TODO: 4. Affichez console.log(p1.x === p2.x)
`,
    solutionCode: `class Point {
  constructor(public x: number, public y: number) {}
}

const p1 = new Point(5, 10);
const p2 = new Point(5, 10);

console.log("p1 === p2 :", p1 === p2);
console.log("p1.x === p2.x :", p1.x === p2.x);
`,
    solutionExplanation: [
      'L\'opérateur === compare les adresses physiques dans le Tas (0x10A !== 0x20B).',
      'Chaque appel à new alloue un nouvel emplacement mémoire distinct.',
      'Par contre, p1.x et p2.x sont des nombres primitifs comparés par valeur brute (5 === 5).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /new\s+Point\s*\(/,
        label: 'Instanciation de Point avec new',
        errorMessage: 'Vous devez instancier la classe Point avec le mot-clé new.'
      },
      {
        type: 'keyword',
        pattern: /console\.log/,
        label: 'Appel console.log',
        errorMessage: 'Affichez les résultats des comparaisons avec console.log.'
      }
    ],
    criteria: [
      {
        id: 'c1-instances',
        label: 'Deux instances distinctes créées',
        description: 'p1 et p2 sont deux instances de Point non nulles',
        passed: false,
        hint: 'Créez p1 et p2 avec new Point(5, 10)'
      },
      {
        id: 'c1-inequality',
        label: 'Identité de référence différente',
        description: 'p1 et p2 ont des adresses différentes (p1 !== p2)',
        passed: false,
        hint: 'p1 et p2 doivent être deux appels distincts à new'
      },
      {
        id: 'c1-coords',
        label: 'Coordonnées identiques',
        description: 'p1.x === p2.x (5) et p1.y === p2.y (10)',
        passed: false,
        hint: 'Passez 5 et 10 en arguments au constructeur'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const p1 = sandbox.p1;
      const p2 = sandbox.p2;
      const hasInstances = p1 && p2 && p1.x !== undefined && p2.x !== undefined;
      const isDistinct = hasInstances && p1 !== p2;
      const sameCoords = hasInstances && p1.x === 5 && p2.x === 5 && p1.y === 10 && p2.y === 10;

      return [
        { criterionId: 'c1-instances', passed: !!hasInstances, message: 'Déclarez const p1 et const p2 comme instances de Point.' },
        { criterionId: 'c1-inequality', passed: !!isDistinct, message: 'p1 et p2 doivent être deux objets distincts (p1 !== p2).' },
        { criterionId: 'c1-coords', passed: !!sameCoords, message: 'Les coordonnées doivent valoir x = 5 et y = 10.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-1-2',
    labNumber: 1,
    number: '1.2',
    title: 'L\'Effet de bord par affectation d\'adresse',
    subtitle: 'Remplacer l\'alias par référence par une copie superficielle (spread)',
    sectionId: 'memory-model-identity',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: 'Soit compteA représentant le compte bancaire d\'Alice avec un solde initial de 500 €. Le code crée un alias compteB = compteA et modifie compteB.solde = 200, ce qui altère Alice. Corrigez le code pour que compteB soit une copie superficielle ({ ...compteA }) afin que compteA.solde reste à 500 € et compteB.solde vaille 200 €.',
    hint: 'Remplacez const compteB = compteA; par const compteB = { ...compteA };',
    initialCode: `const compteA = {
  titulaire: 'Alice',
  solde: 500
};

// ⚠️ BUG : ceci ne copie que l'adresse mémoire !
// TODO: Corrigez cette ligne pour cloner compteA avec le spread operator
const compteB = compteA;

compteB.titulaire = 'Bob';
compteB.solde = 200;

console.log("Solde Alice :", compteA.solde);
console.log("Solde Bob :", compteB.solde);
`,
    solutionCode: `const compteA = {
  titulaire: 'Alice',
  solde: 500
};

// ✅ Correction : nouvelle boîte en mémoire via spread
const compteB = { ...compteA };

compteB.titulaire = 'Bob';
compteB.solde = 200;

console.log("Solde Alice :", compteA.solde);
console.log("Solde Bob :", compteB.solde);
`,
    solutionExplanation: [
      'L\'affectation const b = a ne fait que dupliquer l\'adresse dans la pile (Stack).',
      'Avec le spread operator { ...a }, on alloue un nouvel objet dans le Tas (Heap).',
      'Alice et Bob disposent désormais de deux comptes bancaires autonomes.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /\{\s*\.\.\.compteA\s*\}/,
        label: 'Usage du spread operator {...compteA}',
        errorMessage: 'Utilisez le spread operator { ...compteA } pour cloner l\'objet de premier niveau.'
      }
    ],
    criteria: [
      {
        id: 'c2-spread',
        label: 'Clonage par spread',
        description: 'compteB est une copie distincte de compteA (compteA !== compteB)',
        passed: false,
        hint: 'Écrivez const compteB = { ...compteA };'
      },
      {
        id: 'c2-isolation',
        label: 'Préservation du solde d\'Alice',
        description: 'compteA.solde reste à 500 et compteB.solde vaut 200',
        passed: false,
        hint: 'Le solde de compteA ne doit pas avoir été modifié à 200'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const a = sandbox.compteA;
      const b = sandbox.compteB;
      const isDistinct = a && b && a !== b;
      const isIsolated = a && b && a.solde === 500 && b.solde === 200;

      return [
        { criterionId: 'c2-spread', passed: !!isDistinct, message: 'compteB doit être une référence distincte de compteA.' },
        { criterionId: 'c2-isolation', passed: !!isIsolated, message: 'compteA.solde doit rester à 500 et compteB.solde valoir 200.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-1-3',
    labNumber: 1,
    number: '1.3',
    title: 'Le Piège de la comparaison de Dates',
    subtitle: 'Comparer deux dates par valeur temporelle (.getTime()) plutôt que par adresse',
    sectionId: 'memory-model-identity',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Écrivez la fonction sontMemeDate(d1: Date, d2: Date): boolean qui compare si deux objets Date représentent le même instant temporel en utilisant la méthode .getTime(). Deux dates créées au même instant doivent renvoyer true.',
    hint: 'Utilisez d1.getTime() === d2.getTime() pour comparer les millisecondes primitives au lieu de d1 === d2.',
    initialCode: `function sontMemeDate(d1: Date, d2: Date): boolean {
  // ⚠️ BUG : comparer directement les objets compare leurs adresses mémoires et renvoie false !
  // TODO: Comparez les timestamps numériques avec .getTime()
  return d1 === d2;
}

const date1 = new Date('2026-09-30T10:00:00Z');
const date2 = new Date('2026-09-30T10:00:00Z');

console.log("Même date ?", sontMemeDate(date1, date2));
`,
    solutionCode: `function sontMemeDate(d1: Date, d2: Date): boolean {
  return d1.getTime() === d2.getTime();
}

const date1 = new Date('2026-09-30T10:00:00Z');
const date2 = new Date('2026-09-30T10:00:00Z');

console.log("Même date ?", sontMemeDate(date1, date2));
`,
    solutionExplanation: [
      'Les instances de Date sont des objets stockés dans le Tas : date1 === date2 compare 0x10A !== 0x20B.',
      'La méthode .getTime() extrait la valeur primitive brute en millisecondes (timestamp number).',
      'Comparer deux nombres primitifs compare leur vraie valeur mathématique.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /\.getTime\s*\(\s*\)/,
        label: 'Usage de .getTime()',
        errorMessage: 'Utilisez la méthode .getTime() pour extraire le timestamp en millisecondes.'
      },
      {
        type: 'forbidden',
        pattern: /d1\s*===\s*d2|d2\s*===\s*d1/,
        label: 'Suppression de d1 === d2',
        errorMessage: 'Supprimez la comparaison directe d1 === d2 qui compare les adresses.'
      }
    ],
    criteria: [
      {
        id: 'c3-function',
        label: 'Fonction sontMemeDate déclarée',
        description: 'La fonction existe et retourne un booléen',
        passed: false,
        hint: 'Gardez la signature function sontMemeDate(d1: Date, d2: Date): boolean'
      },
      {
        id: 'c3-equality',
        label: 'Vérification temporelle exacte',
        description: 'Renvoie true pour 2 instances distinctes avec le même timestamp, et false si les dates diffèrent',
        passed: false,
        hint: 'Vérifiez return d1.getTime() === d2.getTime();'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const fn = sandbox.sontMemeDate;
      if (typeof fn !== 'function') {
        return [
          { criterionId: 'c3-function', passed: false, message: 'La fonction sontMemeDate doit être définie.' },
          { criterionId: 'c3-equality', passed: false }
        ];
      }

      const dA = new Date('2026-01-01T00:00:00Z');
      const dB = new Date('2026-01-01T00:00:00Z');
      const dC = new Date('2026-01-02T00:00:00Z');

      const okSame = fn(dA, dB) === true;
      const okDiff = fn(dA, dC) === false;

      return [
        { criterionId: 'c3-function', passed: true },
        { criterionId: 'c3-equality', passed: okSame && okDiff, message: 'La fonction doit renvoyer true pour deux dates identiques et false sinon.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-1-4',
    labNumber: 1,
    number: '1.4',
    title: 'Détecter un alias intentionnel en mémoire',
    subtitle: 'Écrire une fonction qui vérifie si deux variables pointent vers la même adresse',
    sectionId: 'memory-model-identity',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Écrivez une fonction estMemeReference(a: object, b: object): boolean qui renvoie true si et seulement si les deux paramètres désignent physiquement le même objet en mémoire vive (même adresse).',
    hint: 'L\'opérateur d\'égalité stricte === teste précisément si deux variables partagent la même référence : return a === b;',
    initialCode: `function estMemeReference(a: object, b: object): boolean {
  // TODO: Renvoyez true si a et b pointent vers la même adresse mémoire
  return false;
}

const obj1 = { id: 1 };
const obj2 = { id: 1 };
const alias = obj1;

console.log("obj1 et alias :", estMemeReference(obj1, alias)); // Doit être true
console.log("obj1 et obj2 :", estMemeReference(obj1, obj2));   // Doit être false
`,
    solutionCode: `function estMemeReference(a: object, b: object): boolean {
  return a === b;
}

const obj1 = { id: 1 };
const obj2 = { id: 1 };
const alias = obj1;

console.log("obj1 et alias :", estMemeReference(obj1, alias));
console.log("obj1 et obj2 :", estMemeReference(obj1, obj2));
`,
    solutionExplanation: [
      'En JavaScript / TypeScript, l\'opérateur === est le test d\'identité de référence.',
      'Il compare l\'adresse mémoire contenue dans la pile (Stack).',
      'obj1 === alias compare 0x10A === 0x10A (true) ; obj1 === obj2 compare 0x10A === 0x20B (false).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /(?:a\s*===\s*b|b\s*===\s*a|Object\.is\s*\(\s*a\s*,\s*b\s*\)|Object\.is\s*\(\s*b\s*,\s*a\s*\))/,
        label: 'Comparaison a === b ou Object.is(a, b)',
        errorMessage: 'Utilisez l\'égalité stricte a === b ou Object.is(a, b).'
      }
    ],
    criteria: [
      {
        id: 'c4-def',
        label: 'Fonction estMemeReference déclarée',
        description: 'La fonction est définie et accepte 2 paramètres',
        passed: false,
        hint: 'Déclarez function estMemeReference(a: object, b: object): boolean'
      },
      {
        id: 'c4-ref-test',
        label: 'Validation exacte de l\'identité',
        description: 'Renvoie true pour un alias et false pour deux objets distincts au contenu identique',
        passed: false,
        hint: 'return a === b;'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const fn = sandbox.estMemeReference;
      if (typeof fn !== 'function') {
        return [
          { criterionId: 'c4-def', passed: false, message: 'La fonction estMemeReference doit exister.' },
          { criterionId: 'c4-ref-test', passed: false }
        ];
      }

      const o1 = { test: 1 };
      const o2 = { test: 1 };
      const alias = o1;

      const okAlias = fn(o1, alias) === true;
      const okDistinct = fn(o1, o2) === false;

      return [
        { criterionId: 'c4-def', passed: true },
        { criterionId: 'c4-ref-test', passed: okAlias && okDistinct, message: 'La fonction doit renvoyer true pour un alias et false pour des instances distinctes.' }
      ];
    },
    isCompleted: false
  }
];
