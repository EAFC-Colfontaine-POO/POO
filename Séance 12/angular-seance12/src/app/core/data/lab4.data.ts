import { ExerciseDef } from '../models/app.models';

export const LAB4_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-4-1',
    labNumber: 4,
    number: '4.1',
    title: 'Le Double Bouclier : readonly + Object.freeze()',
    subtitle: 'Allier la sécurité de compilation TypeScript au verrou physique runtime',
    sectionId: 'immutability-value-objects',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Créez la classe Vecteur2D avec deux champs publics readonly x: number et readonly y: number. Dans son constructeur, ajoutez l\'appel à Object.freeze(this) afin de sceller physiquement l\'objet en mémoire vive dès son instanciation.',
    hint: 'class Vecteur2D { constructor(public readonly x: number, public readonly y: number) { Object.freeze(this); } }',
    initialCode: `class Vecteur2D {
  // TODO: Rendez x et y 'readonly' et scellez l'instance dans le constructeur
  constructor(public x: number, public y: number) {
    
  }
}

const v = new Vecteur2D(3, 4);

console.log("Vecteur gelé ?", Object.isFrozen(v)); // Doit afficher true
`,
    solutionCode: `class Vecteur2D {
  constructor(public readonly x: number, public readonly y: number) {
    Object.freeze(this);
  }
}

const v = new Vecteur2D(3, 4);

console.log("Vecteur gelé ?", Object.isFrozen(v));
`,
    solutionExplanation: [
      'readonly protège le développeur au moment de la rédaction du code dans l\'IDE.',
      'Mais readonly disparaît après la transpilation TypeScript -> JavaScript.',
      'Object.freeze(this) garantit que le moteur JS lèvera une erreur si un script tente d\'écrire sur v.x.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /readonly\s+[xy]/,
        label: 'Mot-clé readonly sur x ou y',
        errorMessage: 'Déclarez les propriétés avec le modificateur readonly.'
      },
      {
        type: 'keyword',
        pattern: /Object\.freeze\s*\(\s*this\s*\)/,
        label: 'Appel Object.freeze(this)',
        errorMessage: 'Ajoutez Object.freeze(this) dans le constructeur.'
      }
    ],
    criteria: [
      {
        id: 'c1-readonly',
        label: 'Propriétés readonly',
        description: 'Les attributs sont marqués readonly',
        passed: false,
        hint: 'public readonly x: number'
      },
      {
        id: 'c1-frozen',
        label: 'Objet gelé physiquement',
        description: 'Object.isFrozen(instance) renvoie true',
        passed: false,
        hint: 'Object.freeze(this); dans le constructeur'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Vecteur2D = sandbox.Vecteur2D;
      if (!Vecteur2D) {
        return [
          { criterionId: 'c1-readonly', passed: false, message: 'La classe Vecteur2D doit exister.' },
          { criterionId: 'c1-frozen', passed: false }
        ];
      }

      const v = new Vecteur2D(1, 2);
      const isFrozen = Object.isFrozen(v);

      return [
        { criterionId: 'c1-readonly', passed: true },
        { criterionId: 'c1-frozen', passed: isFrozen, message: 'L\'instance de Vecteur2D doit être gelée avec Object.freeze(this).' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-4-2',
    labNumber: 4,
    number: '4.2',
    title: 'Opération Pure sur un Value Object',
    subtitle: 'Retourner une nouvelle instance plutôt que de muter l\'objet existant',
    sectionId: 'immutability-value-objects',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Ajoutez à la classe Vecteur2D la méthode pure translater(dx: number, dy: number): Vecteur2D. Cette méthode ne doit PAS modifier l\'instance courante, mais renvoyer un new Vecteur2D(this.x + dx, this.y + dy).',
    hint: 'translater(dx: number, dy: number): Vecteur2D { return new Vecteur2D(this.x + dx, this.y + dy); }',
    initialCode: `class Vecteur2D {
  constructor(public readonly x: number, public readonly y: number) {
    Object.freeze(this);
  }

  // TODO: Implémentez la méthode pure translater(dx, dy)
  translater(dx: number, dy: number): Vecteur2D {
    return this; // ⚠️ À remplacer par une nouvelle instance !
  }
}

const v1 = new Vecteur2D(10, 20);
const v2 = v1.translater(5, -5);

console.log("v1 (inchangé) :", v1.x, v1.y); // Doit rester 10, 20
console.log("v2 (translaté) :", v2.x, v2.y); // Doit valoir 15, 15
`,
    solutionCode: `class Vecteur2D {
  constructor(public readonly x: number, public readonly y: number) {
    Object.freeze(this);
  }

  translater(dx: number, dy: number): Vecteur2D {
    return new Vecteur2D(this.x + dx, this.y + dy);
  }
}

const v1 = new Vecteur2D(10, 20);
const v2 = v1.translater(5, -5);

console.log("v1 (inchangé) :", v1.x, v1.y);
console.log("v2 (translaté) :", v2.x, v2.y);
`,
    solutionExplanation: [
      'Dans un modèle immuable, une méthode d\'action n\'altère jamais l\'état existant.',
      'Elle retourne une nouvelle projection mathématique sous la forme d\'une nouvelle instance.',
      'v1 reste gravé dans la pierre ; v2 est alloué à sa propre adresse mémoire.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /return\s+new\s+Vecteur2D\s*\(/,
        label: 'Instanciation return new Vecteur2D(...)',
        errorMessage: 'Retournez new Vecteur2D(this.x + dx, this.y + dy).'
      }
    ],
    criteria: [
      {
        id: 'c2-pure-fn',
        label: 'Méthode pure instanciant une copie',
        description: 'translater renvoie une nouvelle instance',
        passed: false,
        hint: 'return new Vecteur2D(this.x + dx, this.y + dy);'
      },
      {
        id: 'c2-integrity',
        label: 'Intégrité de l\'instance d\'origine',
        description: 'v1.x et v1.y restent inchangés et v2 possède les nouvelles coordonnées',
        passed: false,
        hint: 'v1.x doit rester 10'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Vecteur2D = sandbox.Vecteur2D;
      if (!Vecteur2D) {
        return [
          { criterionId: 'c2-pure-fn', passed: false, message: 'La classe Vecteur2D doit exister.' },
          { criterionId: 'c2-integrity', passed: false }
        ];
      }

      const v1 = new Vecteur2D(2, 3);
      const v2 = v1.translater(4, 5);

      const isNew = v2 && v2 instanceof Vecteur2D && v2 !== v1;
      const isCorrectValues = v1.x === 2 && v1.y === 3 && v2.x === 6 && v2.y === 8;

      return [
        { criterionId: 'c2-pure-fn', passed: !!isNew, message: 'translater doit retourner une nouvelle instance.' },
        { criterionId: 'c2-integrity', passed: isCorrectValues, message: 'Les coordonnées de v1 doivent rester intactes et v2 calculé.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-4-3',
    labNumber: 4,
    number: '4.3',
    title: 'Immutabilité des Tableaux : Bannir .push()',
    subtitle: 'Produire un nouveau tableau par spread [...anciens, nouveau]',
    sectionId: 'immutability-value-objects',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Refactorisez la fonction ajouterElement(tab: number[], el: number): number[]. Au lieu de muter tab avec .push(el), elle doit retourner un tout nouveau tableau créé via le spread operator [...tab, el]. Le tableau passé en argument ne doit pas voir sa taille augmenter !',
    hint: 'Remplacez tab.push(el); return tab; par return [...tab, el];',
    initialCode: `function ajouterElement(tab: number[], el: number): number[] {
  // ⚠️ ANTI-PATTERN : muter le tableau en place dans le Tas !
  // TODO: Renvoyez un nouveau tableau créé avec [...tab, el]
  tab.push(el);
  return tab;
}

const original = [1, 2, 3];
const resultat = ajouterElement(original, 4);

console.log("Taille original :", original.length); // Doit rester 3 !
console.log("Taille résultat :", resultat.length); // Doit valoir 4
`,
    solutionCode: `function ajouterElement(tab: number[], el: number): number[] {
  return [...tab, el];
}

const original = [1, 2, 3];
const resultat = ajouterElement(original, 4);

console.log("Taille original :", original.length);
console.log("Taille résultat :", resultat.length);
`,
    solutionExplanation: [
      '.push() modifie la collection en place à la même adresse mémoire (0x10A).',
      '[...tab, el] crée un NOUVEAU tableau à l\'adresse 0x20B sans altérer l\'original.',
      'C\'est la règle d\'or absolue pour les tableaux dans Angular Signals et Redux/NgRx.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /\.push\s*\(/,
        label: 'Suppression de .push()',
        errorMessage: 'Bannissez l\'usage de .push() pour respecter l\'immutabilité.'
      },
      {
        type: 'keyword',
        pattern: /\[\s*\.\.\.tab\s*,\s*el\s*\]/,
        label: 'Spread operator [...tab, el]',
        errorMessage: 'Utilisez le spread operator [...tab, el].'
      }
    ],
    criteria: [
      {
        id: 'c3-no-push',
        label: 'Absence de mutation par .push()',
        description: 'La fonction n\'utilise pas .push()',
        passed: false,
        hint: 'Supprimez tab.push()'
      },
      {
        id: 'c3-immutable-arr',
        label: 'Nouveau tableau produit',
        description: 'original.length reste 3 et resultat.length vaut 4',
        passed: false,
        hint: 'return [...tab, el];'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const fn = sandbox.ajouterElement;
      if (typeof fn !== 'function') {
        return [
          { criterionId: 'c3-no-push', passed: false, message: 'La fonction ajouterElement doit exister.' },
          { criterionId: 'c3-immutable-arr', passed: false }
        ];
      }

      const input = [10, 20];
      const output = fn(input, 30);

      const isNewArray = output && Array.isArray(output) && output !== input;
      const inputUntouched = input.length === 2 && input[0] === 10 && input[1] === 20;
      const outputCorrect = output && output.length === 3 && output[2] === 30;

      return [
        { criterionId: 'c3-no-push', passed: true },
        { criterionId: 'c3-immutable-arr', passed: isNewArray && inputUntouched && outputCorrect, message: 'Le tableau d\'entrée doit rester intact et une nouvelle copie retournée.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-4-4',
    labNumber: 4,
    number: '4.4',
    title: 'Le Chef-d\'œuvre du Value Object : La Classe Monnaie',
    subtitle: 'Validation d\'invariants, immutabilité garantie, addition pure et méthode equals()',
    sectionId: 'immutability-value-objects',
    estimatedTime: '7 min',
    difficulty: 'Intermédiaire',
    statement: 'Complétez la classe Monnaie(montant: number, devise: string) : 1. Rejetez les montants négatifs dans le constructeur (throw new Error("Montant négatif")), 2. Scellez avec Object.freeze(this), 3. Implémentez equals(autre: unknown): boolean (vérifie instanceof Monnaie, montant et devise), 4. Implémentez ajouter(autre: Monnaie): Monnaie (vérifie la même devise puis renvoie un new Monnaie avec la somme).',
    hint: 'throw new Error(...) si montant < 0 ou devises différentes. ajouter(autre) retourne new Monnaie(this.montant + autre.montant, this.devise).',
    initialCode: `class Monnaie {
  constructor(
    public readonly montant: number,
    public readonly devise: string
  ) {
    // TODO: 1. Validez que montant >= 0 (sinon levez une Error)
    // TODO: 2. Verrouillez l'instance avec freeze
  }

  // TODO: 3. Égalité métier complète (montant et devise)
  equals(autre: unknown): boolean {
    return false;
  }

  // TODO: 4. Opération mathématique pure
  ajouter(autre: Monnaie): Monnaie {
    // Vérifiez que this.devise === autre.devise (sinon levez une Error)
    return this;
  }
}

const prix = new Monnaie(50, 'EUR');
const livraison = new Monnaie(10, 'EUR');
const total = prix.ajouter(livraison);

console.log("Total montant :", total.montant); // 60
console.log("Prix d'origine :", prix.montant);  // 50 (Inchangé !)
`,
    solutionCode: `class Monnaie {
  constructor(
    public readonly montant: number,
    public readonly devise: string
  ) {
    if (montant < 0) {
      throw new Error("Le montant ne peut pas être négatif");
    }
    Object.freeze(this);
  }

  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof Monnaie)) return false;
    return this.montant === autre.montant && this.devise === autre.devise;
  }

  ajouter(autre: Monnaie): Monnaie {
    if (this.devise !== autre.devise) {
      throw new Error("Devises incompatibles");
    }
    return new Monnaie(this.montant + autre.montant, this.devise);
  }
}

const prix = new Monnaie(50, 'EUR');
const livraison = new Monnaie(10, 'EUR');
const total = prix.ajouter(livraison);

console.log("Total montant :", total.montant);
console.log("Prix d'origine :", prix.montant);
`,
    solutionExplanation: [
      'Un Value Object est auto-validant : un état invalide (montant < 0) est impossible à instancier.',
      'Le constructeur applique Object.freeze(this) pour un scellement définitif.',
      'L\'addition vérifie la compatibilité métier (devises identiques) et instancie un nouveau Monnaie.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /throw\s+new\s+Error/,
        label: 'Levée d\'erreur de validation',
        errorMessage: 'Levez une erreur en cas de montant négatif ou de devises incompatibles.'
      },
      {
        type: 'keyword',
        pattern: /Object\.freeze\s*\(\s*this\s*\)/,
        label: 'Appel à Object.freeze(this)',
        errorMessage: 'Scellez l\'objet avec Object.freeze(this).'
      }
    ],
    criteria: [
      {
        id: 'c4-invariants',
        label: 'Validation des invariants',
        description: 'Rejette les montants négatifs avec une exception',
        passed: false,
        hint: 'if (montant < 0) throw new Error(...)'
      },
      {
        id: 'c4-equals',
        label: 'Méthode equals complète',
        description: 'Valide l\'égalité montant + devise et rejette null',
        passed: false,
        hint: 'return this.montant === autre.montant && this.devise === autre.devise;'
      },
      {
        id: 'c4-pure-add',
        label: 'Addition pure sans effet de bord',
        description: 'ajouter retourne une nouvelle Monnaie et vérifie la devise',
        passed: false,
        hint: 'return new Monnaie(this.montant + autre.montant, this.devise);'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Monnaie = sandbox.Monnaie;
      if (!Monnaie) {
        return [
          { criterionId: 'c4-invariants', passed: false, message: 'La classe Monnaie doit exister.' },
          { criterionId: 'c4-equals', passed: false },
          { criterionId: 'c4-pure-add', passed: false }
        ];
      }

      let invariantOk = false;
      try {
        new Monnaie(-10, 'EUR');
      } catch (e) {
        invariantOk = true;
      }

      const m1 = new Monnaie(50, 'EUR');
      const m2 = new Monnaie(50, 'EUR');
      const m3 = new Monnaie(50, 'USD');

      const equalsOk = m1.equals(m2) === true && m1.equals(m3) === false && m1.equals(null) === false;

      const mAdd = new Monnaie(20, 'EUR');
      const sum = m1.ajouter(mAdd);

      const addOk = sum && sum instanceof Monnaie && sum.montant === 70 && m1.montant === 50;

      let currencyCheckOk = false;
      try {
        m1.ajouter(m3);
      } catch (e) {
        currencyCheckOk = true;
      }

      return [
        { criterionId: 'c4-invariants', passed: invariantOk, message: 'Le constructeur doit lever une erreur si le montant est négatif.' },
        { criterionId: 'c4-equals', passed: equalsOk, message: 'equals doit comparer à la fois le montant et la devise.' },
        { criterionId: 'c4-pure-add', passed: addOk && currencyCheckOk, message: 'ajouter doit retourner une nouvelle instance et vérifier la devise.' }
      ];
    },
    isCompleted: false
  }
];
