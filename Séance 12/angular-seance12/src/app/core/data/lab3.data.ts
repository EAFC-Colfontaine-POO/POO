import { ExerciseDef } from '../models/app.models';

export const LAB3_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-3-1',
    labNumber: 3,
    number: '3.1',
    title: 'Copie Superficielle avec le Spread Operator',
    subtitle: 'Dupliquer un objet plat de configuration sans impacter l\'original',
    sectionId: 'cloning-shallow-vs-deep',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Clonez l\'objet plat configOriginal via le spread operator ({ ...configOriginal }) dans une variable configCopie. Modifiez configCopie.volume = 50. Vérifiez par console que configOriginal.volume est préservé à 80.',
    hint: 'const configCopie = { ...configOriginal }; puis configCopie.volume = 50;',
    initialCode: `const configOriginal = {
  theme: 'dark',
  volume: 80
};

// TODO: 1. Créez configCopie en clonant avec le spread operator
const configCopie: any = null;

// TODO: 2. Modifiez le volume sur la copie à 50

console.log("Original volume :", configOriginal.volume); // Doit rester 80
console.log("Copie volume :", configCopie ? configCopie.volume : 0); // Doit être 50
`,
    solutionCode: `const configOriginal = {
  theme: 'dark',
  volume: 80
};

const configCopie = { ...configOriginal };
configCopie.volume = 50;

console.log("Original volume :", configOriginal.volume);
console.log("Copie volume :", configCopie.volume);
`,
    solutionExplanation: [
      'Le spread operator { ...obj } alloue un nouvel objet de premier niveau dans le Tas.',
      'Pour les types primitifs (nombres, chaînes), la valeur est dupliquée indépendamment.',
      'L\'original reste intact à 80 pendant que la copie évolue à 50.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /\{\s*\.\.\.configOriginal\s*\}/,
        label: 'Spread operator {...configOriginal}',
        errorMessage: 'Utilisez le spread operator { ...configOriginal }.'
      }
    ],
    criteria: [
      {
        id: 'c1-spread-clone',
        label: 'Clonage par spread',
        description: 'configCopie est une référence distincte de configOriginal',
        passed: false,
        hint: 'const configCopie = { ...configOriginal };'
      },
      {
        id: 'c1-preservation',
        label: 'Indépendance des valeurs',
        description: 'configOriginal.volume === 80 et configCopie.volume === 50',
        passed: false,
        hint: 'Modifiez uniquement configCopie.volume'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const orig = sandbox.configOriginal;
      const copy = sandbox.configCopie;

      const isDistinct = orig && copy && orig !== copy;
      const isOkValues = orig && copy && orig.volume === 80 && copy.volume === 50;

      return [
        { criterionId: 'c1-spread-clone', passed: !!isDistinct, message: 'configCopie doit être un objet distinct.' },
        { criterionId: 'c1-preservation', passed: !!isOkValues, message: 'configOriginal.volume doit rester à 80 et configCopie.volume valoir 50.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-3-2',
    labNumber: 3,
    number: '3.2',
    title: 'Le Piège du sous-objet partagé (Shallow Copy)',
    subtitle: 'Démontrer l\'effet de bord destructeur sur un objet imbriqué',
    sectionId: 'cloning-shallow-vs-deep',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Soit utilisateurOriginal contenant un sous-objet profil: { prenom: "Luc" }. Réalisez une copie superficielle avec le spread operator { ...utilisateurOriginal } dans cloneSuperficiel. Modifiez ensuite cloneSuperficiel.profil.prenom = "Marc". Constatez que utilisateurOriginal.profil.prenom a été muté à "Marc" en silence.',
    hint: 'const cloneSuperficiel = { ...utilisateurOriginal }; cloneSuperficiel.profil.prenom = "Marc";',
    initialCode: `const utilisateurOriginal = {
  role: 'admin',
  profil: {
    prenom: 'Luc'
  }
};

// TODO: 1. Réalisez une copie superficielle par spread
const cloneSuperficiel: any = null;

// TODO: 2. Modifiez le prenom dans le sous-objet du clone à 'Marc'

console.log("Original prénom :", utilisateurOriginal.profil.prenom); // Constat : 'Marc' !
`,
    solutionCode: `const utilisateurOriginal = {
  role: 'admin',
  profil: {
    prenom: 'Luc'
  }
};

const cloneSuperficiel = { ...utilisateurOriginal };
cloneSuperficiel.profil.prenom = 'Marc';

console.log("Original prénom :", utilisateurOriginal.profil.prenom);
`,
    solutionExplanation: [
      'L\'analogie de la valise câblée : le conteneur externe a été dupliqué, mais pas l\'intérieur.',
      'La propriété profil contient une référence (0x99F) qui a été simplement recopiée.',
      'Toucher au sous-objet du clone modifie directement l\'objet d\'origine dans le Tas !'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /\{\s*\.\.\.utilisateurOriginal\s*\}/,
        label: 'Spread operator {...utilisateurOriginal}',
        errorMessage: 'Utilisez le spread operator pour illustrer le problème du shallow copy.'
      }
    ],
    criteria: [
      {
        id: 'c2-shallow',
        label: 'Copie superficielle créée',
        description: 'cloneSuperficiel !== utilisateurOriginal mais cloneSuperficiel.profil === utilisateurOriginal.profil',
        passed: false,
        hint: 'const cloneSuperficiel = { ...utilisateurOriginal };'
      },
      {
        id: 'c2-mutation',
        label: 'Mutation partagée constatée',
        description: 'Le prénom dans l\'original et le clone vaut désormais Marc',
        passed: false,
        hint: 'cloneSuperficiel.profil.prenom = "Marc";'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const orig = sandbox.utilisateurOriginal;
      const clone = sandbox.cloneSuperficiel;

      const isShallow = orig && clone && orig !== clone && orig.profil === clone.profil;
      const isMutated = orig && orig.profil && orig.profil.prenom === 'Marc';

      return [
        { criterionId: 'c2-shallow', passed: !!isShallow, message: 'cloneSuperficiel doit être un shallow copy partageant la référence profil.' },
        { criterionId: 'c2-mutation', passed: !!isMutated, message: 'cloneSuperficiel.profil.prenom doit avoir été modifié à "Marc".' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-3-3',
    labNumber: 3,
    number: '3.3',
    title: 'Copie Profonde Moderne avec structuredClone()',
    subtitle: 'Isoler 100% de la structure de données de manière récursive native',
    sectionId: 'cloning-shallow-vs-deep',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Corrigez le problème de l\'exercice précédent en utilisant la fonction native standard structuredClone(). Créez vraiClone en clonant utilisateurOriginal avec structuredClone. Modifiez vraiClone.profil.prenom = "Marc". Vérifiez que utilisateurOriginal.profil.prenom reste intègre à "Luc" !',
    hint: 'const vraiClone = structuredClone(utilisateurOriginal); vraiClone.profil.prenom = "Marc";',
    initialCode: `const utilisateurOriginal = {
  role: 'admin',
  profil: {
    prenom: 'Luc'
  }
};

// TODO: Remplacez par une vraie copie profonde avec structuredClone()
const vraiClone: any = null;

// TODO: Modifiez vraiClone.profil.prenom à 'Marc'

console.log("Original prénom :", utilisateurOriginal.profil.prenom); // Doit rester 'Luc' !
console.log("Clone prénom :", vraiClone ? vraiClone.profil.prenom : ''); // Doit être 'Marc'
`,
    solutionCode: `const utilisateurOriginal = {
  role: 'admin',
  profil: {
    prenom: 'Luc'
  }
};

const vraiClone = structuredClone(utilisateurOriginal);
vraiClone.profil.prenom = 'Marc';

console.log("Original prénom :", utilisateurOriginal.profil.prenom);
console.log("Clone prénom :", vraiClone.profil.prenom);
`,
    solutionExplanation: [
      'structuredClone() est la fonction standard moderne (ECMAScript 2022).',
      'Elle descend récursivement dans tous les sous-objets pour allouer de nouveaux espaces mémoires.',
      'utilisateurOriginal.profil et vraiClone.profil sont deux structures complètement étanches.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /structuredClone\s*\(\s*utilisateurOriginal\s*\)/,
        label: 'Appel à structuredClone(utilisateurOriginal)',
        errorMessage: 'Utilisez la méthode standard native structuredClone(...).'
      }
    ],
    criteria: [
      {
        id: 'c3-structured',
        label: 'Clonage avec structuredClone',
        description: 'vraiClone.profil est une référence distincte de utilisateurOriginal.profil',
        passed: false,
        hint: 'const vraiClone = structuredClone(utilisateurOriginal);'
      },
      {
        id: 'c3-deep-isolation',
        label: 'Intégrité de l\'original garantie',
        description: 'utilisateurOriginal.profil.prenom reste "Luc" et vraiClone.profil.prenom vaut "Marc"',
        passed: false,
        hint: 'L\'original ne doit pas avoir changé'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const orig = sandbox.utilisateurOriginal;
      const clone = sandbox.vraiClone;

      const isDeep = orig && clone && orig !== clone && orig.profil !== clone.profil;
      const isPreserved = orig && clone && orig.profil.prenom === 'Luc' && clone.profil.prenom === 'Marc';

      return [
        { criterionId: 'c3-structured', passed: !!isDeep, message: 'vraiClone doit être un vrai clone profond (sous-objets distincts).' },
        { criterionId: 'c3-deep-isolation', passed: !!isPreserved, message: 'L\'original doit rester "Luc" et le clone valoir "Marc".' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-3-4',
    labNumber: 3,
    number: '3.4',
    title: 'Clonage en POO : La méthode métier clone()',
    subtitle: 'Créer une méthode de clonage qui préserve l\'instance et les méthodes',
    sectionId: 'cloning-shallow-vs-deep',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Définissez la méthode clone(): Adresse sur la classe Adresse(rue: string, ville: string). Elle doit instancier et retourner une nouvelle instance de Adresse avec les mêmes valeurs (new Adresse(this.rue, this.ville)). Testez avec clone = a1.clone().',
    hint: 'Dans la classe Adresse, ajoutez: clone(): Adresse { return new Adresse(this.rue, this.ville); }',
    initialCode: `class Adresse {
  constructor(public rue: string, public ville: string) {}

  // TODO: Implémentez la méthode clone(): Adresse
  clone(): Adresse {
    return this; // ⚠️ Faux clone, renvoie la même référence !
  }
}

const a1 = new Adresse('Rue de la Loi', 'Bruxelles');
const a2 = a1.clone();
a2.ville = 'Namur';

console.log("a1.ville :", a1.ville); // Doit rester 'Bruxelles'
console.log("a2.ville :", a2.ville); // Doit valoir 'Namur'
`,
    solutionCode: `class Adresse {
  constructor(public rue: string, public ville: string) {}

  clone(): Adresse {
    return new Adresse(this.rue, this.ville);
  }
}

const a1 = new Adresse('Rue de la Loi', 'Bruxelles');
const a2 = a1.clone();
a2.ville = 'Namur';

console.log("a1.ville :", a1.ville);
console.log("a2.ville :", a2.ville);
`,
    solutionExplanation: [
      'structuredClone() détruit le prototype et les méthodes des classes.',
      'En POO, la méthode métier clone() permet à la classe d\'instancier sa propre copie.',
      'Le résultat a2 instanceof Adresse reste true et toutes les méthodes de la classe sont conservées.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /return\s+new\s+Adresse\s*\(/,
        label: 'Instanciation return new Adresse(...)',
        errorMessage: 'La méthode clone() doit retourner une nouvelle instance new Adresse(this.rue, this.ville).'
      }
    ],
    criteria: [
      {
        id: 'c4-clone-method',
        label: 'Méthode clone fonctionnelle',
        description: 'Retourne une nouvelle instance de Adresse',
        passed: false,
        hint: 'return new Adresse(this.rue, this.ville);'
      },
      {
        id: 'c4-clone-isolation',
        label: 'Isolation des instances',
        description: 'Modifier la ville sur le clone n\'altère pas la ville d\'origine',
        passed: false,
        hint: 'a1.ville doit rester "Bruxelles"'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Adresse = sandbox.Adresse;
      if (!Adresse) {
        return [
          { criterionId: 'c4-clone-method', passed: false, message: 'La classe Adresse doit exister.' },
          { criterionId: 'c4-clone-isolation', passed: false }
        ];
      }

      const original = new Adresse('Rue A', 'Liège');
      const cloned = original.clone();

      const isNewInstance = cloned && cloned instanceof Adresse && cloned !== original;
      if (cloned) cloned.ville = 'Mons';
      const isIsolated = original.ville === 'Liège';

      return [
        { criterionId: 'c4-clone-method', passed: !!isNewInstance, message: 'clone() doit renvoyer une nouvelle instance de Adresse.' },
        { criterionId: 'c4-clone-isolation', passed: isIsolated, message: 'Modifier le clone ne doit pas impacter l\'original.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-3-5',
    labNumber: 3,
    number: '3.5',
    title: 'Clonage POO avec Délégation Récursive',
    subtitle: 'Déléguer la duplication des sous-objets selon les principes de la Séance 9',
    sectionId: 'cloning-shallow-vs-deep',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: 'Dans la classe Client(nom: string, adresse: Adresse), implémentez la méthode clone(): Client. Elle doit retourner un new Client(this.nom, this.adresse.clone()) en déléguant la duplication à la méthode clone() du sous-objet adresse.',
    hint: 'clone(): Client { return new Client(this.nom, this.adresse.clone()); }',
    initialCode: `class Adresse {
  constructor(public rue: string, public ville: string) {}

  clone(): Adresse {
    return new Adresse(this.rue, this.ville);
  }
}

class Client {
  constructor(public nom: string, public adresse: Adresse) {}

  // TODO: Implémentez clone(): Client en déléguant la duplication à l'adresse
  clone(): Client {
    return this;
  }
}

const c1 = new Client('Alice', new Adresse('Grand-Place', 'Bruxelles'));
const c2 = c1.clone();
c2.adresse.ville = 'Anvers';

console.log("Ville client 1 :", c1.adresse.ville); // Doit rester 'Bruxelles' !
console.log("Ville client 2 :", c2.adresse.ville); // Doit valoir 'Anvers'
`,
    solutionCode: `class Adresse {
  constructor(public rue: string, public ville: string) {}

  clone(): Adresse {
    return new Adresse(this.rue, this.ville);
  }
}

class Client {
  constructor(public nom: string, public adresse: Adresse) {}

  clone(): Client {
    return new Client(this.nom, this.adresse.clone());
  }
}

const c1 = new Client('Alice', new Adresse('Grand-Place', 'Bruxelles'));
const c2 = c1.clone();
c2.adresse.ville = 'Anvers';

console.log("Ville client 1 :", c1.adresse.ville);
console.log("Ville client 2 :", c2.adresse.ville);
`,
    solutionExplanation: [
      'Principe de délégation (Séance 9) : chaque classe est experte de son propre état interne.',
      'Client n\'a pas besoin de savoir comment cloner une Adresse : il appelle simplement this.adresse.clone().',
      'L\'encapsulation, le prototype et la hiérarchie sont parfaitement respectés.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /this\.adresse\.clone\s*\(\s*\)/,
        label: 'Délégation this.adresse.clone()',
        errorMessage: 'Déléguez la duplication du sous-objet via this.adresse.clone().'
      },
      {
        type: 'keyword',
        pattern: /new\s+Client\s*\(/,
        label: 'Instanciation new Client(...)',
        errorMessage: 'Retournez une nouvelle instance de Client.'
      }
    ],
    criteria: [
      {
        id: 'c5-delegation',
        label: 'Délégation de clonage propre',
        description: 'La méthode Client.clone() délègue à this.adresse.clone()',
        passed: false,
        hint: 'return new Client(this.nom, this.adresse.clone());'
      },
      {
        id: 'c5-deep-poo',
        label: 'Indépendance totale des sous-objets',
        description: 'c1.adresse.ville reste Bruxelles après modification de c2.adresse.ville',
        passed: false,
        hint: 'Vérifiez que c1.adresse !== c2.adresse'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Client = sandbox.Client;
      const Adresse = sandbox.Adresse;

      if (!Client || !Adresse) {
        return [
          { criterionId: 'c5-delegation', passed: false, message: 'Les classes Client et Adresse doivent exister.' },
          { criterionId: 'c5-deep-poo', passed: false }
        ];
      }

      const client = new Client('Bob', new Adresse('Rue Neuve', 'Tournai'));
      const cloned = client.clone();

      const isNewClient = cloned && cloned instanceof Client && cloned !== client;
      const isNewAdresse = cloned && cloned.adresse instanceof Adresse && cloned.adresse !== client.adresse;

      if (cloned && cloned.adresse) cloned.adresse.ville = 'Charleroi';
      const isProtected = client.adresse.ville === 'Tournai';

      return [
        { criterionId: 'c5-delegation', passed: !!(isNewClient && isNewAdresse), message: 'Le client et son adresse doivent tous deux être dupliqués.' },
        { criterionId: 'c5-deep-poo', passed: isProtected, message: 'La ville de l\'original doit rester inchangée.' }
      ];
    },
    isCompleted: false
  }
];
