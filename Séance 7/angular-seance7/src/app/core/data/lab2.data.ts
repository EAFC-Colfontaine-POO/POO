import { ExerciseDef } from '../models/app.models';

export const LAB2_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-2-1',
    labNumber: 2,
    number: '2.1',
    title: 'La restriction de vue du type statique',
    subtitle: 'Comprendre pourquoi Animal restreint la vue et corriger',
    sectionId: 'ts-view-restrictor',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Soit const a: Animal = new Chien("Rex"). TypeScript refuse d\'appeler a.aboyer() car aboyer() n\'est pas dans le type statique Animal. Modifiez la déclaration du type statique de "a" pour autoriser l\'appel a.aboyer() tout en conservant l\'instance Chien.',
    hint: 'Remplacez le type statique : const a: Chien = new Chien("Rex");',
    initialCode: `class Animal {
  constructor(public nom: string) {}

  dormir(): string {
    return \`\${this.nom} s'endort paisiblement.\`;
  }
}

class Chien extends Animal {
  aboyer(): string {
    return \`\${this.nom} aboie : Wouaf !\`;
  }
}

// TODO: Modifiez l'annotation de type de "a" pour que TypeScript autorise aboyer()
const a: Animal = new Chien("Rex");

console.log(a.dormir());
// Décommentez la ligne suivante une fois le type ajusté :
// console.log(a.aboyer());
`,
    solutionCode: `class Animal {
  constructor(public nom: string) {}

  dormir(): string {
    return \`\${this.nom} s'endort paisiblement.\`;
  }
}

class Chien extends Animal {
  aboyer(): string {
    return \`\${this.nom} aboie : Wouaf !\`;
  }
}

const a: Chien = new Chien("Rex");

console.log(a.dormir());
console.log(a.aboyer());
`,
    solutionExplanation: [
      'Le compilateur TypeScript n\'autorise que les membres déclarés sur le type statique (l\'étiquette de la télécommande).',
      'Typée en "Animal", la variable ne donne accès qu\'à nom et dormir().',
      'En typant explicitement en "Chien", le compilateur déverrouille l\'accès à aboyer().'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /const\s+a\s*:\s*Chien\s*=/,
        label: 'Type statique Chien',
        errorMessage: 'Déclarez la variable avec l\'annotation de type : const a: Chien ='
      }
    ],
    criteria: [
      {
        id: 'c21-type',
        label: 'Annotation Chien',
        description: 'a est typé avec Chien',
        passed: false,
        hint: 'Changez Animal en Chien sur la déclaration'
      },
      {
        id: 'c21-aboyer',
        label: 'Appel aboyer()',
        description: 'Rex aboie : Wouaf ! s\'affiche dans la console',
        passed: false,
        hint: 'Décommentez console.log(a.aboyer())'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasBark = logs.some(l => l.includes('Wouaf'));
      return [
        { criterionId: 'c21-type', passed: hasBark, message: 'Le chien doit pouvoir aboyer.' },
        { criterionId: 'c21-aboyer', passed: hasBark, message: 'La sortie console doit contenir "Wouaf !".' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-2-2',
    labNumber: 2,
    number: '2.2',
    title: 'Invocation polymorphe avec référence parente',
    subtitle: 'Télécommande Appareil, récepteur Smartphone en RAM',
    sectionId: 'remote-control-analogy',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Soit la classe Appareil et sa sous-classe Smartphone qui redéfinit allumer(). Déclarez une variable "monAppareil" avec le type statique Appareil, instanciez un Smartphone("Pixel 9"), puis appelez monAppareil.allumer() pour observer l\'exécution dynamique.',
    hint: 'const monAppareil: Appareil = new Smartphone("Pixel 9"); console.log(monAppareil.allumer());',
    initialCode: `class Appareil {
  constructor(public modele: string) {}

  allumer(): string {
    return \`\${this.modele} : Alimentation sous tension.\`;
  }
}

class Smartphone extends Appareil {
  override allumer(): string {
    return \`\${this.modele} : Écran OLED allumé, chargement d'Android...\`;
  }
}

// TODO: Déclarez monAppareil de type Appareil, affectez-lui un new Smartphone("Pixel 9")
// puis affichez le résultat de son allumage :


`,
    solutionCode: `class Appareil {
  constructor(public modele: string) {}

  allumer(): string {
    return \`\${this.modele} : Alimentation sous tension.\`;
  }
}

class Smartphone extends Appareil {
  override allumer(): string {
    return \`\${this.modele} : Écran OLED allumé, chargement d'Android...\`;
  }
}

const monAppareil: Appareil = new Smartphone("Pixel 9");
console.log(monAppareil.allumer());
`,
    solutionExplanation: [
      'Le type statique est Appareil (le bouton allumer() existe bien sur la télécommande).',
      'L\'objet en RAM est un Smartphone (l\'appareil physique branché).',
      'À l\'exécution, c\'est la méthode spécialisée de Smartphone qui est invoquée.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /const\s+monAppareil\s*:\s*Appareil\s*=\s*new\s+Smartphone/,
        label: 'Type statique Appareil et new Smartphone',
        errorMessage: 'Déclarez const monAppareil: Appareil = new Smartphone(...);'
      }
    ],
    criteria: [
      {
        id: 'c22-ref',
        label: 'Référence parente',
        description: 'Type statique Appareil et instance Smartphone',
        passed: false,
        hint: 'Vérifiez la déclaration de variable demandée'
      },
      {
        id: 'c22-exec',
        label: 'Exécution spécialisée',
        description: 'Affiche le message spécifique avec Écran OLED',
        passed: false,
        hint: 'Appelez console.log(monAppareil.allumer())'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasOled = logs.some(l => l.includes('OLED'));
      return [
        { criterionId: 'c22-ref', passed: hasOled, message: 'monAppareil doit être instancié avec Smartphone.' },
        { criterionId: 'c22-exec', passed: hasOled, message: 'La méthode spécialisée OLED doit s\'exécuter.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-2-3',
    labNumber: 2,
    number: '2.3',
    title: 'La chaîne de prototypes & Late Binding à 3 niveaux',
    subtitle: 'Comprendre l\'arrêt immédiat dès la première méthode trouvée dans le prototype',
    sectionId: 'late-binding-prototypes',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Soit la hiérarchie GrandParent -> Parent -> Enfant. GrandParent implémente saluer(). Parent la redéfinit avec "Bonjour du Parent". Enfant ne la redéfinit PAS. Instanciez const e: GrandParent = new Enfant() et observez la méthode appelée en affichant e.saluer().',
    hint: 'Enfant n\'a pas saluer(), le moteur remonte à Parent.prototype qui l\'a ! Il s\'arrête donc là sans aller jusqu\'à GrandParent.',
    initialCode: `class GrandParent {
  saluer(): string {
    return "Bonjour du GrandParent";
  }
}

class Parent extends GrandParent {
  override saluer(): string {
    return "Bonjour du Parent";
  }
}

class Enfant extends Parent {
  // Aucune redéfinition ici !
}

// TODO: Instanciez un Enfant typé en GrandParent et affichez son salut :


`,
    solutionCode: `class GrandParent {
  saluer(): string {
    return "Bonjour du GrandParent";
  }
}

class Parent extends GrandParent {
  override saluer(): string {
    return "Bonjour du Parent";
  }
}

class Enfant extends Parent {}

const e: GrandParent = new Enfant();
console.log(e.saluer());
`,
    solutionExplanation: [
      'Lors de e.saluer(), le moteur V8 cherche d\'abord sur Enfant.prototype : absent.',
      'Il remonte la chaîne __proto__ vers Parent.prototype : trouvé !',
      'Il exécute immédiatement la version de Parent sans jamais remonter à GrandParent.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /new\s+Enfant\(\)/,
        label: 'Instanciation new Enfant()',
        errorMessage: 'Instanciez la classe Enfant avec new Enfant().'
      }
    ],
    criteria: [
      {
        id: 'c23-stop',
        label: 'Résolution de prototype',
        description: 'La console affiche "Bonjour du Parent"',
        passed: false,
        hint: 'Vérifiez la sortie de e.saluer()'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasParent = logs.some(l => l.includes('Bonjour du Parent'));
      return [
        { criterionId: 'c23-stop', passed: hasParent, message: 'La chaîne de prototype doit s\'arrêter à Parent.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-2-4',
    labNumber: 2,
    number: '2.4',
    title: 'Correction d\'abstraction commune',
    subtitle: 'Remonter une méthode dans la classe de base pour autoriser l\'accès polymorphe',
    sectionId: 'ts-view-restrictor',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Soit la classe Forme et ses sous-classes Cercle et Rectangle. La méthode calculerSurface() n\'est déclarée que dans les classes filles, empêchant d\'écrire f.calculerSurface() lorsque f est de type Forme. Ajoutez la méthode calculerSurface(): number dans la classe de base Forme (renvoyant 0 par défaut).',
    hint: 'Ajoutez calculerSurface(): number { return 0; } dans la classe Forme.',
    initialCode: `class Forme {
  constructor(public couleur: string) {}
  // TODO: Déclarez calculerSurface(): number ici pour autoriser l'accès polymorphe
  
}

class Cercle extends Forme {
  constructor(couleur: string, public rayon: number) {
    super(couleur);
  }

  override calculerSurface(): number {
    return Math.PI * this.rayon * this.rayon;
  }
}

class Rectangle extends Forme {
  constructor(couleur: string, public largeur: number, public hauteur: number) {
    super(couleur);
  }

  override calculerSurface(): number {
    return this.largeur * this.hauteur;
  }
}

const f: Forme = new Rectangle("Bleu", 10, 5);
console.log("Surface :", f.calculerSurface());
`,
    solutionCode: `class Forme {
  constructor(public couleur: string) {}

  calculerSurface(): number {
    return 0;
  }
}

class Cercle extends Forme {
  constructor(couleur: string, public rayon: number) {
    super(couleur);
  }

  override calculerSurface(): number {
    return Math.PI * this.rayon * this.rayon;
  }
}

class Rectangle extends Forme {
  constructor(couleur: string, public largeur: number, public hauteur: number) {
    super(couleur);
  }

  override calculerSurface(): number {
    return this.largeur * this.hauteur;
  }
}

const f: Forme = new Rectangle("Bleu", 10, 5);
console.log("Surface :", f.calculerSurface());
`,
    solutionExplanation: [
      'Pour actionner un bouton sur la télécommande, il doit obligatoirement être présent sur le type statique.',
      'En déclarant calculerSurface() sur Forme, TypeScript valide l\'instruction f.calculerSurface().',
      'À l\'exécution, c\'est la version spécialisée du Rectangle qui s\'exécute (10 * 5 = 50).'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /class\s+Forme[\s\S]*?calculerSurface\s*\(\s*\)[\s\S]*?class\s+Cercle/,
        label: 'calculerSurface() dans Forme',
        errorMessage: 'Déclarez calculerSurface() dans la classe Forme.'
      }
    ],
    criteria: [
      {
        id: 'c24-surface',
        label: 'Présence dans Forme',
        description: 'La méthode existe sur la classe de base',
        passed: false,
        hint: 'Ajoutez calculerSurface(): number { return 0; } dans Forme'
      },
      {
        id: 'c24-calc',
        label: 'Calcul exact',
        description: 'La surface du rectangle affiche 50',
        passed: false,
        hint: 'Rectangle 10 x 5 doit afficher 50'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      let formeSurface = -1;
      let rectSurface = -1;
      if (typeof sandbox?.Forme === 'function') {
        try {
          const f = new sandbox.Forme('Rouge');
          formeSurface = typeof f.calculerSurface === 'function' ? f.calculerSurface() : -1;
        } catch (e) {}
      }
      if (typeof sandbox?.Rectangle === 'function') {
        try {
          const r = new sandbox.Rectangle('Bleu', 10, 5);
          rectSurface = typeof r.calculerSurface === 'function' ? r.calculerSurface() : -1;
        } catch (e) {}
      }
      const hasInForme = typeof sandbox?.Forme?.prototype?.calculerSurface === 'function' || formeSurface !== -1;
      const has50 = logs.some(l => l.includes('50')) || rectSurface === 50;
      return [
        { criterionId: 'c24-surface', passed: hasInForme, message: 'calculerSurface doit être déclarée dans Forme.' },
        { criterionId: 'c24-calc', passed: hasInForme && has50, message: 'La surface calculée doit être 50.' }
      ];
    },
    isCompleted: false
  }
];
