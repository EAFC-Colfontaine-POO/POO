import { ExerciseDef } from '../models/app.models';

export const LAB3_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-3-1',
    labNumber: 3,
    number: '3.1',
    title: 'Le tableau polymorphe d\'employés',
    subtitle: 'Créer une collection hétérogène Employe[] contenant Ouvrier et Manager',
    sectionId: 'heterogeneous-collections-ocp',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Créez un tableau "equipe" explicitement typé Employe[]. Remplissez-le avec un Ouvrier("Alice", 2000) et un Manager("Bob", 3500, 500). Affichez la taille du tableau equipe.length.',
    hint: 'const equipe: Employe[] = [ new Ouvrier("Alice", 2000), new Manager("Bob", 3500, 500) ];',
    initialCode: `class Employe {
  constructor(public nom: string, public salaireBase: number) {}
}

class Ouvrier extends Employe {}

class Manager extends Employe {
  constructor(nom: string, salaireBase: number, public prime: number) {
    super(nom, salaireBase);
  }
}

// TODO: Déclarez equipe de type Employe[] avec 1 Ouvrier et 1 Manager :


`,
    solutionCode: `class Employe {
  constructor(public nom: string, public salaireBase: number) {}
}

class Ouvrier extends Employe {}

class Manager extends Employe {
  constructor(nom: string, salaireBase: number, public prime: number) {
    super(nom, salaireBase);
  }
}

const equipe: Employe[] = [
  new Ouvrier("Alice", 2000),
  new Manager("Bob", 3500, 500)
];

console.log("Membres :", equipe.length);
`,
    solutionExplanation: [
      'Un tableau typé avec la classe parente Employe[] accepte toute instance d\'une sous-classe dérivée.',
      'C\'est le fondement des collections hétérogènes en programmation orientée objet.',
      'Les éléments partagent le contrat de base d\'Employe.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /const\s+equipe\s*:\s*Employe\[\]\s*=/,
        label: 'Typage Employe[]',
        errorMessage: 'Déclarez const equipe: Employe[] = [...]'
      }
    ],
    criteria: [
      {
        id: 'c31-array',
        label: 'Tableau hétérogène',
        description: 'Contient un Ouvrier et un Manager',
        passed: false,
        hint: 'Instanciez Ouvrier et Manager dans equipe'
      },
      {
        id: 'c31-len',
        label: 'Taille du tableau',
        description: 'La console affiche Membres : 2',
        passed: false,
        hint: 'Affichez equipe.length'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const has2 = logs.some(l => l.includes('2'));
      return [
        { criterionId: 'c31-array', passed: has2, message: 'Le tableau doit contenir les deux employés.' },
        { criterionId: 'c31-len', passed: has2, message: 'Affichez le nombre de membres (2).' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-3-2',
    labNumber: 3,
    number: '3.2',
    title: 'Parcours uniforme et calcul de masse salariale',
    subtitle: 'Calculer le total des salaires via une boucle for..of polymorphe',
    sectionId: 'heterogeneous-collections-ocp',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Ajoutez la méthode calculerSalaire(): number dans Employe, Ouvrier et Manager (le Manager ajoute sa prime). Écrivez une fonction masseSalariale(equipe: Employe[]): number qui parcourt le tableau avec une boucle for..of et somme les salaires via e.calculerSalaire().',
    hint: 'for (const e of equipe) { total += e.calculerSalaire(); }',
    initialCode: `class Employe {
  constructor(public nom: string, public salaireBase: number) {}

  calculerSalaire(): number {
    return this.salaireBase;
  }
}

class Ouvrier extends Employe {}

class Manager extends Employe {
  constructor(nom: string, salaireBase: number, public prime: number) {
    super(nom, salaireBase);
  }

  override calculerSalaire(): number {
    return this.salaireBase + this.prime;
  }
}

const equipe: Employe[] = [
  new Ouvrier("Alice", 2000),
  new Manager("Bob", 3500, 500) // 4000
];

// TODO: Écrivez la fonction masseSalariale avec une boucle for..of
function masseSalariale(employes: Employe[]): number {
  let total = 0;
  
  return total;
}

console.log("Masse salariale totale :", masseSalariale(equipe), "€");
`,
    solutionCode: `class Employe {
  constructor(public nom: string, public salaireBase: number) {}

  calculerSalaire(): number {
    return this.salaireBase;
  }
}

class Ouvrier extends Employe {}

class Manager extends Employe {
  constructor(nom: string, salaireBase: number, public prime: number) {
    super(nom, salaireBase);
  }

  override calculerSalaire(): number {
    return this.salaireBase + this.prime;
  }
}

const equipe: Employe[] = [
  new Ouvrier("Alice", 2000),
  new Manager("Bob", 3500, 500)
];

function masseSalariale(employes: Employe[]): number {
  let total = 0;
  for (const e of employes) {
    total += e.calculerSalaire();
  }
  return total;
}

console.log("Masse salariale totale :", masseSalariale(equipe), "€");
`,
    solutionExplanation: [
      'La boucle for..of traite chaque élément de façon uniforme.',
      'À chaque itération, le late binding appelle le calcul de l\'Ouvrier (2000) puis du Manager (4000).',
      'Zéro condition de type dans la fonction de calcul !'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /for\s*\(\s*(const|let)\s+\w+\s+of\s+/,
        label: 'Boucle for..of',
        errorMessage: 'Utilisez une boucle for..of pour parcourir les employés.'
      },
      {
        type: 'keyword',
        pattern: /\.calculerSalaire\(\)/,
        label: 'Appel polymorphe calculerSalaire()',
        errorMessage: 'Invoquez calculerSalaire() sur chaque élément.'
      }
    ],
    criteria: [
      {
        id: 'c32-loop',
        label: 'Parcours polymorphe',
        description: 'Boucle for..of sans if/switch',
        passed: false,
        hint: 'total += e.calculerSalaire()'
      },
      {
        id: 'c32-total',
        label: 'Résultat 6000 €',
        description: '2000 + 4000 = 6000 €',
        passed: false,
        hint: 'Vérifiez le total calculé'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const has6000 = logs.some(l => l.includes('6000'));
      return [
        { criterionId: 'c32-loop', passed: has6000, message: 'La fonction doit parcourir les employés.' },
        { criterionId: 'c32-total', passed: has6000, message: 'Le total doit être égal à 6000 €.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-3-3',
    labNumber: 3,
    number: '3.3',
    title: 'Le Crash-Test OCP (Principe Ouvert/Fermé)',
    subtitle: 'Ajouter Freelance extends Employe sans retoucher la fonction de paie',
    sectionId: 'heterogeneous-collections-ocp',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: 'Créez la classe Freelance qui hérite d\'Employe avec constructor(nom: string, public tjm: number, public joursTravailles: number). Redéfinissez calculerSalaire() pour renvoyer tjm * joursTravailles. Ajoutez un Freelance("Charlie", 400, 10) dans l\'équipe et vérifiez que masseSalariale() donne 10000 € SANS modifier masseSalariale() !',
    hint: 'class Freelance extends Employe { constructor(nom: string, public tjm: number, public joursTravailles: number) { super(nom, 0); } override calculerSalaire() { return this.tjm * this.joursTravailles; } }',
    initialCode: `class Employe {
  constructor(public nom: string, public salaireBase: number) {}
  calculerSalaire(): number { return this.salaireBase; }
}

class Ouvrier extends Employe {}
class Manager extends Employe {
  constructor(nom: string, salaireBase: number, public prime: number) {
    super(nom, salaireBase);
  }
  override calculerSalaire(): number { return this.salaireBase + this.prime; }
}

// Fonction existante FERMÉE à la modification :
function masseSalariale(employes: Employe[]): number {
  let total = 0;
  for (const e of employes) {
    total += e.calculerSalaire();
  }
  return total;
}

// TODO: Créez Freelance extends Employe (tjm, joursTravailles)
// super(nom, 0) puis calculerSalaire() = tjm * joursTravailles


const equipe: Employe[] = [
  new Ouvrier("Alice", 2000),
  new Manager("Bob", 3500, 500)
  // TODO: Ajoutez Charlie : tjm 400, 10 jours
];

console.log("Nouvelle masse salariale :", masseSalariale(equipe), "€");
`,
    solutionCode: `class Employe {
  constructor(public nom: string, public salaireBase: number) {}
  calculerSalaire(): number { return this.salaireBase; }
}

class Ouvrier extends Employe {}
class Manager extends Employe {
  constructor(nom: string, salaireBase: number, public prime: number) {
    super(nom, salaireBase);
  }
  override calculerSalaire(): number { return this.salaireBase + this.prime; }
}

function masseSalariale(employes: Employe[]): number {
  let total = 0;
  for (const e of employes) {
    total += e.calculerSalaire();
  }
  return total;
}

class Freelance extends Employe {
  constructor(nom: string, public tjm: number, public joursTravailles: number) {
    super(nom, 0);
  }

  override calculerSalaire(): number {
    return this.tjm * this.joursTravailles;
  }
}

const equipe: Employe[] = [
  new Ouvrier("Alice", 2000),
  new Manager("Bob", 3500, 500),
  new Freelance("Charlie", 400, 10)
];

console.log("Nouvelle masse salariale :", masseSalariale(equipe), "€");
`,
    solutionExplanation: [
      'Le code existant est FERMÉ à la modification : masseSalariale n\'a pas été touchée.',
      'Le système est OUVERT à l\'extension : la nouvelle classe Freelance s\'intègre naturellement.',
      'C\'est la quintessence du principe OCP (Open/Closed Principle).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+Freelance\s+extends\s+Employe/,
        label: 'Héritage Freelance extends Employe',
        errorMessage: 'La classe Freelance doit étendre Employe.'
      }
    ],
    criteria: [
      {
        id: 'c33-freelance',
        label: 'Classe Freelance',
        description: 'Hérite d\'Employe et calcule tjm * jours',
        passed: false,
        hint: '400 * 10 = 4000 €'
      },
      {
        id: 'c33-ocp',
        label: 'Succès Crash-Test OCP',
        description: 'La masse salariale totale atteint exactement 10000 €',
        passed: false,
        hint: '2000 + 4000 + 4000 = 10000 €'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const has10000 = logs.some(l => l.includes('10000'));
      return [
        { criterionId: 'c33-freelance', passed: has10000, message: 'La classe Freelance doit être créée.' },
        { criterionId: 'c33-ocp', passed: has10000, message: 'Le total doit être de 10000 €.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-3-4',
    labNumber: 3,
    number: '3.4',
    title: 'Filtrage polymorphe sur collection',
    subtitle: 'Filtrer les figures géométriques dont la surface dépasse un seuil',
    sectionId: 'heterogeneous-collections-ocp',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Soit une collection formes: FigureGeometrique[]. Utilisez la méthode array.filter() pour ne retenir que les figures dont calculerAire() est strictement supérieur à 50. Affichez le nombre de figures retenues.',
    hint: 'const grandes = figures.filter(f => f.calculerAire() > 50); console.log("Grandes :", grandes.length);',
    initialCode: `class FigureGeometrique {
  constructor(public nom: string) {}
  calculerAire(): number { return 0; }
}

class Carre extends FigureGeometrique {
  constructor(nom: string, public cote: number) {
    super(nom);
  }
  override calculerAire(): number { return this.cote * this.cote; }
}

class Triangle extends FigureGeometrique {
  constructor(nom: string, public base: number, public hauteur: number) {
    super(nom);
  }
  override calculerAire(): number { return (this.base * this.hauteur) / 2; }
}

const figures: FigureGeometrique[] = [
  new Carre("Petit Carré", 4),       // 16
  new Carre("Grand Carré", 10),      // 100 (> 50)
  new Triangle("Grand Triangle", 20, 6) // 60 (> 50)
];

// TODO: Filtrez les figures dont calculerAire() > 50 et affichez leur nombre :


`,
    solutionCode: `class FigureGeometrique {
  constructor(public nom: string) {}
  calculerAire(): number { return 0; }
}

class Carre extends FigureGeometrique {
  constructor(nom: string, public cote: number) {
    super(nom);
  }
  override calculerAire(): number { return this.cote * this.cote; }
}

class Triangle extends FigureGeometrique {
  constructor(nom: string, public base: number, public hauteur: number) {
    super(nom);
  }
  override calculerAire(): number { return (this.base * this.hauteur) / 2; }
}

const figures: FigureGeometrique[] = [
  new Carre("Petit Carré", 4),
  new Carre("Grand Carré", 10),
  new Triangle("Grand Triangle", 20, 6)
];

const grandes = figures.filter(f => f.calculerAire() > 50);
console.log("Grandes :", grandes.length);
`,
    solutionExplanation: [
      'Le prédicat de filtre utilise l\'appel polymorphe f.calculerAire().',
      'Chaque objet applique sa propre formule géométrique.',
      'Deux figures sur trois ont une aire > 50 (le grand carré et le triangle).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /\.filter\s*\(/,
        label: 'Méthode .filter()',
        errorMessage: 'Utilisez .filter() pour filtrer la collection polymorphe.'
      }
    ],
    criteria: [
      {
        id: 'c34-filter',
        label: 'Filtrage fonctionnel',
        description: 'Filtre sur f.calculerAire() > 50',
        passed: false,
        hint: 'Utilisez figures.filter(f => f.calculerAire() > 50)'
      },
      {
        id: 'c34-count',
        label: 'Comptage correct',
        description: 'Affiche Grandes : 2',
        passed: false,
        hint: '2 figures dépassent 50'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const has2 = logs.some(l => l.includes('2'));
      return [
        { criterionId: 'c34-filter', passed: has2, message: 'Le filtre doit être appliqué.' },
        { criterionId: 'c34-count', passed: has2, message: 'Le nombre de figures retenues doit être 2.' }
      ];
    },
    isCompleted: false
  }
];
