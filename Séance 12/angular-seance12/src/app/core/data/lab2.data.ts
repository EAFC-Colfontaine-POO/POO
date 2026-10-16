import { ExerciseDef } from '../models/app.models';

export const LAB2_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-2-1',
    labNumber: 2,
    number: '2.1',
    title: 'Le Court-circuit d\'adresse mémoire',
    subtitle: 'La première étape d\'optimisation maximale d\'une méthode equals()',
    sectionId: 'business-equality-equals',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Dans la classe Livre, implémentez la toute première ligne de la méthode equals(other: unknown): boolean. Elle doit vérifier si this et other partagent la même adresse mémoire (this === other) et renvoyer immédiatement true dans ce cas.',
    hint: 'Écrivez: if (this === other) return true;',
    initialCode: `class Livre {
  constructor(public titre: string, public isbn: string) {}

  equals(other: unknown): boolean {
    // TODO: Étape 1 - Court-circuit d'adresse mémoire
    // Si this === other, renvoyez immédiatement true
    
    return false;
  }
}

const l1 = new Livre('Clean Code', '978-0132350884');
const alias = l1;

console.log("Même référence :", l1.equals(alias)); // Doit afficher true
`,
    solutionCode: `class Livre {
  constructor(public titre: string, public isbn: string) {}

  equals(other: unknown): boolean {
    if (this === other) return true;
    return false;
  }
}

const l1 = new Livre('Clean Code', '978-0132350884');
const alias = l1;

console.log("Même référence :", l1.equals(alias));
`,
    solutionExplanation: [
      'Si deux variables ont la même adresse mémoire (this === other), elles pointent vers le même objet.',
      'Inutile de comparer les chaînes de caractères : le résultat est true garanti en 1 cycle CPU.',
      'C\'est le court-circuit le plus performant du génie logiciel.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /if\s*\(\s*(?:this\s*===\s*other|other\s*===\s*this)\s*\)\s*\{?\s*return\s+true/,
        label: 'Court-circuit if (this === other) return true;',
        errorMessage: 'Ajoutez le test if (this === other) return true; au début de la méthode.'
      }
    ],
    criteria: [
      {
        id: 'c1-short-circuit',
        label: 'Court-circuit présent',
        description: 'La méthode court-circuite et renvoie true si this === other',
        passed: false,
        hint: 'if (this === other) return true;'
      },
      {
        id: 'c1-eval',
        label: 'Comportement fonctionnel',
        description: 'l1.equals(l1) renvoie true et l1.equals(autre) renvoie false',
        passed: false,
        hint: 'Testez l\'alias ou la même instance'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Livre = sandbox.Livre;
      if (!Livre) {
        return [
          { criterionId: 'c1-short-circuit', passed: false, message: 'La classe Livre doit exister.' },
          { criterionId: 'c1-eval', passed: false }
        ];
      }

      const l = new Livre('Refactoring', '123');
      const alias = l;
      const other = new Livre('Refactoring', '123');

      const okSelf = l.equals(alias) === true;
      const okOther = l.equals(other) === false;
      const okNull = l.equals(null) === false;

      return [
        { criterionId: 'c1-short-circuit', passed: okSelf, message: 'l.equals(alias) doit renvoyer true grâce au court-circuit.' },
        { criterionId: 'c1-eval', passed: okSelf && okOther && okNull, message: 'l.equals doit renvoyer true pour la même instance et false pour d\'autres.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-2-2',
    labNumber: 2,
    number: '2.2',
    title: 'Le Garde de type strict instanceof',
    subtitle: 'Rejeter en toute sécurité null, undefined et les types incompatibles',
    sectionId: 'business-equality-equals',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Complétez la méthode equals(other: unknown) de la classe Produit. Après le court-circuit d\'adresse, ajoutez le garde de type qui vérifie si other n\'est PAS une instance de Produit (!(other instanceof Produit)), auquel cas elle doit renvoyer false sans planter.',
    hint: 'Écrivez: if (!(other instanceof Produit)) return false;',
    initialCode: `class Produit {
  constructor(public code: string) {}

  equals(other: unknown): boolean {
    if (this === other) return true;

    // TODO: Étape 2 - Garde de type strict
    // Si other n'est pas une instance de Produit, renvoyez false

    return (other as Produit).code === this.code;
  }
}

const p = new Produit('P001');

console.log("Avec null :", p.equals(null));        // Doit afficher false sans planter
console.log("Avec string :", p.equals("P001"));    // Doit afficher false
`,
    solutionCode: `class Produit {
  constructor(public code: string) {}

  equals(other: unknown): boolean {
    if (this === other) return true;

    if (!(other instanceof Produit)) return false;

    return other.code === this.code;
  }
}

const p = new Produit('P001');

console.log("Avec null :", p.equals(null));
console.log("Avec string :", p.equals("P001"));
`,
    solutionExplanation: [
      'Le paramètre est typé unknown pour accepter n\'importe quelle valeur en entrée.',
      'L\'opérateur instanceof élimine automatiquement null, undefined et les objets d\'autres classes.',
      'Après le garde, TypeScript restreint (narrow) le type de other en Produit sans cast.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /instanceof\s+Produit/,
        label: 'Garde instanceof Produit',
        errorMessage: 'Utilisez instanceof Produit pour vérifier le type dynamique à l\'exécution.'
      }
    ],
    criteria: [
      {
        id: 'c2-guard',
        label: 'Garde instanceof implémenté',
        description: 'La méthode vérifie other instanceof Produit et rejette les types invalides',
        passed: false,
        hint: 'if (!(other instanceof Produit)) return false;'
      },
      {
        id: 'c2-safety',
        label: 'Sécurité runtime éprouvée',
        description: 'p.equals(null), p.equals(undefined) et p.equals({}) renvoient false sans lever d\'exception',
        passed: false,
        hint: 'Le garde doit intercepter les valeurs nulles avant d\'accéder à other.code'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Produit = sandbox.Produit;
      if (!Produit) {
        return [
          { criterionId: 'c2-guard', passed: false, message: 'La classe Produit doit être définie.' },
          { criterionId: 'c2-safety', passed: false }
        ];
      }

      const p = new Produit('ABC');
      try {
        const okNull = p.equals(null) === false;
        const okUndef = p.equals(undefined) === false;
        const okObj = p.equals({ code: 'ABC' }) === false;
        const okSame = p.equals(new Produit('ABC')) === true;
        const okDiff = p.equals(new Produit('XYZ')) === false;

        return [
          { criterionId: 'c2-guard', passed: okNull && okUndef && okObj, message: 'Le garde instanceof doit intercepter null, undefined et les objets bruts sans crash.' },
          { criterionId: 'c2-safety', passed: okNull && okUndef && okObj && okSame && okDiff, message: 'La méthode doit rejeter les types incompatibles et comparer les codes pour les instances de Produit.' }
        ];
      } catch (e: any) {
        return [
          { criterionId: 'c2-guard', passed: false, message: 'Une exception s\'est produite lors de l\'appel avec null/undefined.' },
          { criterionId: 'c2-safety', passed: false, message: 'Une exception s\'est produite lors de l\'évaluation.' }
        ];
      }
    },
    isCompleted: false
  },
  {
    id: 'ex-2-3',
    labNumber: 2,
    number: '2.3',
    title: 'Égalité complète d\'un Value Object',
    subtitle: 'Implémenter l\'anatomie canonique en 3 étapes pour un point 2D',
    sectionId: 'business-equality-equals',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Implémentez l\'intégralité de la méthode equals(other: unknown): boolean sur la classe Coordonnees(x: number, y: number) en respectant les 3 étapes : (1) court-circuit this === other, (2) garde strict instanceof Coordonnees, (3) comparaison de this.x === other.x et this.y === other.y.',
    hint: 'Étape 1: if (this === other) return true; Étape 2: if (!(other instanceof Coordonnees)) return false; Étape 3: return this.x === other.x && this.y === other.y;',
    initialCode: `class Coordonnees {
  constructor(public x: number, public y: number) {}

  equals(other: unknown): boolean {
    // TODO: Étape 1 - Court-circuit d'adresse
    // TODO: Étape 2 - Garde de type strict (instanceof Coordonnees)
    // TODO: Étape 3 - Comparaison des deux coordonnées x et y
    return false;
  }
}

const c1 = new Coordonnees(10, 20);
const c2 = new Coordonnees(10, 20);
const c3 = new Coordonnees(10, 99);

console.log("c1.equals(c2) :", c1.equals(c2)); // Doit afficher true
console.log("c1.equals(c3) :", c1.equals(c3)); // Doit afficher false
`,
    solutionCode: `class Coordonnees {
  constructor(public x: number, public y: number) {}

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!(other instanceof Coordonnees)) return false;
    return this.x === other.x && this.y === other.y;
  }
}

const c1 = new Coordonnees(10, 20);
const c2 = new Coordonnees(10, 20);
const c3 = new Coordonnees(10, 99);

console.log("c1.equals(c2) :", c1.equals(c2));
console.log("c1.equals(c3) :", c1.equals(c3));
`,
    solutionExplanation: [
      'Un Value Object n\'a pas d\'ID : il est défini par l\'ensemble de ses champs (x et y).',
      'Les 3 étapes garantissent la performance maximale, l\'absence de crash et l\'exactitude métier.',
      'c1 === c2 est false (deux adresses), mais c1.equals(c2) est true (mêmes coordonnées).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /(?:this\s*===\s*other|other\s*===\s*this)/,
        label: 'Court-circuit this === other',
        errorMessage: 'Incluez le court-circuit if (this === other) return true;.'
      },
      {
        type: 'keyword',
        pattern: /instanceof\s+Coordonnees/,
        label: 'Garde instanceof Coordonnees',
        errorMessage: 'Vérifiez le type avec instanceof Coordonnees.'
      }
    ],
    criteria: [
      {
        id: 'c3-structure',
        label: 'Respect des 3 étapes',
        description: 'La méthode implémente le court-circuit, le garde et la comparaison des champs',
        passed: false,
        hint: 'Suivez la structure canonique en 3 étapes'
      },
      {
        id: 'c3-val-object',
        label: 'Équivalence de valeurs validée',
        description: 'Deux points aux coordonnées identiques sont égaux, différents sinon',
        passed: false,
        hint: 'return this.x === other.x && this.y === other.y;'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Coordonnees = sandbox.Coordonnees;
      if (!Coordonnees) {
        return [
          { criterionId: 'c3-structure', passed: false, message: 'La classe Coordonnees doit être présente.' },
          { criterionId: 'c3-val-object', passed: false }
        ];
      }

      const a = new Coordonnees(5, 7);
      const b = new Coordonnees(5, 7);
      const c = new Coordonnees(5, 8);
      const d = new Coordonnees(6, 7);

      const okEq = a.equals(b) === true;
      const okDiffC = a.equals(c) === false;
      const okDiffD = a.equals(d) === false;
      const okNull = a.equals(null) === false;
      const okUndef = a.equals(undefined) === false;
      const okSelf = a.equals(a) === true;

      return [
        { criterionId: 'c3-structure', passed: okSelf && okNull && okUndef, message: 'La méthode doit valider le court-circuit et le garde.' },
        { criterionId: 'c3-val-object', passed: okEq && okDiffC && okDiffD, message: 'La méthode equals doit valider les coordonnées identiques et rejeter les différentes.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-2-4',
    labNumber: 2,
    number: '2.4',
    title: 'Égalité d\'une Entité Métier',
    subtitle: 'Comparer uniquement l\'identifiant pérenne unique (id)',
    sectionId: 'business-equality-equals',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Dans une entité Utilisateur(id: number, nom: string, email: string), deux utilisateurs représentent la même personne dans le système s\'ils ont le même id, même si leur nom ou email a été modifié. Implémentez la méthode equals(other: unknown): boolean en vous basant exclusivement sur l\'identifiant id.',
    hint: 'Après le court-circuit et le garde instanceof Utilisateur, renvoyez this.id === other.id.',
    initialCode: `class Utilisateur {
  constructor(
    public readonly id: number,
    public nom: string,
    public email: string
  ) {}

  equals(other: unknown): boolean {
    // TODO: Implémentez l'égalité d'entité basée uniquement sur l'id
    return false;
  }
}

const u1 = new Utilisateur(42, 'Dupont', 'dupont@test.be');
const u2 = new Utilisateur(42, 'Dupont-Renard', 'nouvel.email@test.be');
const u3 = new Utilisateur(99, 'Durand', 'durand@test.be');

console.log("Même entité u1 & u2 ?", u1.equals(u2)); // Doit afficher true (même id 42)
console.log("Même entité u1 & u3 ?", u1.equals(u3)); // Doit afficher false
`,
    solutionCode: `class Utilisateur {
  constructor(
    public readonly id: number,
    public nom: string,
    public email: string
  ) {}

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!(other instanceof Utilisateur)) return false;
    return this.id === other.id;
  }
}

const u1 = new Utilisateur(42, 'Dupont', 'dupont@test.be');
const u2 = new Utilisateur(42, 'Dupont-Renard', 'nouvel.email@test.be');
const u3 = new Utilisateur(99, 'Durand', 'durand@test.be');

console.log("Même entité u1 & u2 ?", u1.equals(u2));
console.log("Même entité u1 & u3 ?", u1.equals(u3));
`,
    solutionExplanation: [
      'Une Entité possède une identité pérenne dans le temps : son identifiant unique (id).',
      'Même si le profil ou l\'adresse email change, il s\'agit toujours du même utilisateur.',
      'La comparaison compare uniquement this.id === other.id.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /(?:this\.id\s*===\s*other\.id|other\.id\s*===\s*this\.id)/,
        label: 'Comparaison this.id === other.id',
        errorMessage: 'L\'égalité d\'entité doit comparer l\'identifiant pérenne id.'
      }
    ],
    criteria: [
      {
        id: 'c4-entity-equality',
        label: 'Égalité par identifiant unique',
        description: 'Deux utilisateurs avec le même id sont égaux même avec des noms différents',
        passed: false,
        hint: 'return this.id === other.id;'
      },
      {
        id: 'c4-guard',
        label: 'Garde de type strict',
        description: 'Rejette null et d\'autres types sans crash',
        passed: false,
        hint: 'if (!(other instanceof Utilisateur)) return false;'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Utilisateur = sandbox.Utilisateur;
      if (!Utilisateur) {
        return [
          { criterionId: 'c4-entity-equality', passed: false, message: 'La classe Utilisateur doit exister.' },
          { criterionId: 'c4-guard', passed: false }
        ];
      }

      const uA = new Utilisateur(1, 'Alice', 'a@a.be');
      const uB = new Utilisateur(1, 'Alice V2', 'alice.new@a.be');
      const uC = new Utilisateur(2, 'Alice', 'a@a.be');

      const okSameId = uA.equals(uB) === true;
      const okDiffId = uA.equals(uC) === false;
      const okNull = uA.equals(null) === false;

      return [
        { criterionId: 'c4-entity-equality', passed: okSameId && okDiffId, message: 'Deux utilisateurs au même id doivent être considérés comme égaux.' },
        { criterionId: 'c4-guard', passed: okNull, message: 'Rejetez null sans crash.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-2-5',
    labNumber: 2,
    number: '2.5',
    title: 'Le Contrat d\'Interface Equatable<T>',
    subtitle: 'Normaliser l\'égalité métier et faciliter la recherche dans les collections',
    sectionId: 'business-equality-equals',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: '1. Déclarez l\'interface générique Equatable<T> avec la méthode equals(other: T): boolean. 2. Faites implémenter Equatable<Article> par la classe Article(id: number, libelle: string) (l\'égalité se base sur l\'id). 3. Utilisez panier.some(item => item.equals(cible)) pour vérifier si un article scanné existe déjà dans la liste panier.',
    hint: 'interface Equatable<T> { equals(other: T): boolean; } et class Article implements Equatable<Article> { ... }',
    initialCode: `// 1. Définition du contrat générique
interface Equatable<T> {
  equals(other: T): boolean;
}

// TODO: 2. Faites implémenter Equatable<Article> à la classe Article
class Article implements Equatable<Article> {
  constructor(public id: number, public libelle: string) {}

  equals(other: Article): boolean {
    if (this === other) return true;
    if (!other) return false;
    // TODO: Comparez par identifiant id
    return false;
  }
}

const panier = [
  new Article(101, 'Clavier'),
  new Article(102, 'Souris')
];

const articleScanne = new Article(101, 'Clavier RGB Gamer');

// TODO: 3. Utilisez panier.some() avec la méthode equals()
const estDansPanier = false;

console.log("Article présent dans le panier ?", estDansPanier); // Doit valoir true
`,
    solutionCode: `interface Equatable<T> {
  equals(other: T): boolean;
}

class Article implements Equatable<Article> {
  constructor(public id: number, public libelle: string) {}

  equals(other: Article): boolean {
    if (this === other) return true;
    if (!other) return false;
    return this.id === other.id;
  }
}

const panier = [
  new Article(101, 'Clavier'),
  new Article(102, 'Souris')
];

const articleScanne = new Article(101, 'Clavier RGB Gamer');

const estDansPanier = panier.some(item => item.equals(articleScanne));

console.log("Article présent dans le panier ?", estDansPanier);
`,
    solutionExplanation: [
      'Le contrat d\'interface Equatable<T> standardise la méthode d\'égalité dans toute l\'équipe.',
      'Dans les collections, .some(item => item.equals(cible)) remplace avantageusement le simple .includes() qui échoue sur des adresses mémoires distinctes.',
      'Article(101, \'Clavier RGB\') est reconnu comme déjà présent grâce à son identifiant.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /panier\.some\s*\(/,
        label: 'Recherche avec panier.some()',
        errorMessage: 'Utilisez la méthode panier.some(...) pour chercher dans la collection.'
      },
      {
        type: 'keyword',
        pattern: /\.equals\s*\(/,
        label: 'Appel de .equals(...)',
        errorMessage: 'Appelez la méthode .equals(...) sur les éléments du panier.'
      }
    ],
    criteria: [
      {
        id: 'c5-article-equals',
        label: 'Méthode equals de l\'Article',
        description: 'Article.equals compare l\'id',
        passed: false,
        hint: 'return this.id === other.id;'
      },
      {
        id: 'c5-collection-search',
        label: 'Recherche fonctionnelle dans le tableau',
        description: 'estDansPanier vaut true pour l\'article scanné ayant l\'id 101',
        passed: false,
        hint: 'const estDansPanier = panier.some(item => item.equals(articleScanne));'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Article = sandbox.Article;
      const panier = sandbox.panier;
      const estDansPanier = sandbox.estDansPanier;

      if (!Article) {
        return [
          { criterionId: 'c5-article-equals', passed: false, message: 'La classe Article doit être définie.' },
          { criterionId: 'c5-collection-search', passed: false }
        ];
      }

      const a1 = new Article(1, 'A');
      const a2 = new Article(1, 'B');
      const a3 = new Article(2, 'A');
      const okEqualsSame = a1.equals(a2) === true;
      const okEqualsDiff = a1.equals(a3) === false;

      return [
        { criterionId: 'c5-article-equals', passed: okEqualsSame && okEqualsDiff, message: 'Deux articles avec le même id doivent être considérés égaux, et différents s\'ils ont des IDs distincts.' },
        { criterionId: 'c5-collection-search', passed: estDansPanier === true, message: 'estDansPanier doit valoir true.' }
      ];
    },
    isCompleted: false
  }
];
