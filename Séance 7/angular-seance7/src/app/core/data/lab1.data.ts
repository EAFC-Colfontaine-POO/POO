import { ExerciseDef } from '../models/app.models';

export const LAB1_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-1-1',
    labNumber: 1,
    number: '1.1',
    title: 'Détecter le couplage & Déléguer',
    subtitle: 'Remplacer une cascade conditionnelle procédurale par un appel polymorphe',
    sectionId: 'control-tower-vs-delegation',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Soit la fonction procédurale demarrerVehicule(v) qui inspecte le type avec un if/else. Remplacer le contenu de la fonction demarrerVehicule par un appel polymorphe direct sur la méthode demarrer() du véhicule passé en paramètre.',
    hint: 'Supprimez le if/else et appelez simplement v.demarrer(). Grâce au polymorphisme, chaque véhicule sait déjà comment démarrer !',
    initialCode: `class Voiture {
  demarrer(): string {
    return "Vroum ! Le moteur thermique démarre.";
  }
}

class VeloElectrique {
  demarrer(): string {
    return "Bzzzt ! L'assistance électrique s'active.";
  }
}

// TODO: Refactorisez cette fonction pour supprimer le if/else
function demarrerVehicule(v: any): string {
  if (v instanceof Voiture) {
    return v.demarrer();
  } else if (v instanceof VeloElectrique) {
    return v.demarrer();
  }
  return "Véhicule inconnu";
}

const voiture = new Voiture();
const velo = new VeloElectrique();

console.log(demarrerVehicule(voiture));
console.log(demarrerVehicule(velo));
`,
    solutionCode: `class Voiture {
  demarrer(): string {
    return "Vroum ! Le moteur thermique démarre.";
  }
}

class VeloElectrique {
  demarrer(): string {
    return "Bzzzt ! L'assistance électrique s'active.";
  }
}

function demarrerVehicule(v: any): string {
  return v.demarrer();
}

const voiture = new Voiture();
const velo = new VeloElectrique();

console.log(demarrerVehicule(voiture));
console.log(demarrerVehicule(velo));
`,
    solutionExplanation: [
      'En POO polymorphe, le code appelant ne doit pas inspecter l\'identité de l\'objet.',
      'La méthode demarrer() est partagée par les objets : on délègue directement à l\'objet récepteur.',
      'La fonction demarrerVehicule devient ouverte aux futurs véhicules sans modification.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /if\s*\(.*instanceof/,
        label: 'Suppression du if (v instanceof ...)',
        errorMessage: 'Supprimez la cascade conditionnelle if (instanceof) : utilisez l\'appel polymorphe direct.'
      },
      {
        type: 'keyword',
        pattern: /v\.demarrer\(\)/,
        label: 'Appel polymorphe v.demarrer()',
        errorMessage: 'La fonction doit appeler directement v.demarrer().'
      }
    ],
    criteria: [
      {
        id: 'c1-no-if',
        label: 'Absence de conditions',
        description: 'La fonction n\'utilise aucun if/else ni switch',
        passed: false,
        hint: 'Déléguez directement à v.demarrer()'
      },
      {
        id: 'c1-output',
        label: 'Sortie conforme',
        description: 'La voiture et le vélo démarrent avec leur message respectif',
        passed: false,
        hint: 'Vérifiez les appels console.log(demarrerVehicule(...))'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasVoiture = logs.some(l => l.includes('Vroum'));
      const hasVelo = logs.some(l => l.includes('Bzzzt'));
      return [
        { criterionId: 'c1-no-if', passed: true },
        { criterionId: 'c1-output', passed: hasVoiture && hasVelo, message: 'Les deux véhicules doivent afficher leur démarrage.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-1-2',
    labNumber: 1,
    number: '1.2',
    title: 'Première sous-classe polymorphe',
    subtitle: 'Création de la classe Moto étendant Vehicule avec redéfinition override',
    sectionId: 'control-tower-vs-delegation',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: 'Soit la classe de base Vehicule possédant la méthode demarrer(): string. Créez la classe Moto qui hérite de Vehicule avec "extends" et redéfinit sa méthode demarrer() avec le mot-clé "override" pour renvoyer "Braaap ! La moto rugit.".',
    hint: 'Utilisez: class Moto extends Vehicule { override demarrer(): string { return "..."; } }',
    initialCode: `class Vehicule {
  constructor(public marque: string) {}

  demarrer(): string {
    return "Le véhicule démarre.";
  }
}

// TODO: Déclarez la classe Moto qui hérite de Vehicule
// et redéfinit demarrer() avec le mot-clé override


const moto = new Moto("Yamaha");
console.log(moto.marque, ":", moto.demarrer());
`,
    solutionCode: `class Vehicule {
  constructor(public marque: string) {}

  demarrer(): string {
    return "Le véhicule démarre.";
  }
}

class Moto extends Vehicule {
  constructor(marque: string) {
    super(marque);
  }

  override demarrer(): string {
    return "Braaap ! La moto rugit.";
  }
}

const moto = new Moto("Yamaha");
console.log(moto.marque, ":", moto.demarrer());
`,
    solutionExplanation: [
      'Le mot-clé "extends Vehicule" crée le lien de sous-typage prototype.',
      'Le mot-clé "override" assure la sécurité de typage : TypeScript vérifie que demarrer() existe bien dans Vehicule.',
      'La méthode spécialisée remplace la version générique lors de la résolution dynamique.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+Moto\s+extends\s+Vehicule/,
        label: 'Héritage extends Vehicule',
        errorMessage: 'La classe Moto doit étendre Vehicule (class Moto extends Vehicule).'
      },
      {
        type: 'keyword',
        pattern: /override\s+demarrer\s*\(\s*\)/,
        label: 'Mot-clé override',
        errorMessage: 'La méthode demarrer() de Moto doit comporter le mot-clé "override".'
      }
    ],
    criteria: [
      {
        id: 'c2-class',
        label: 'Déclaration sous-classe',
        description: 'Moto hérite bien de Vehicule',
        passed: false,
        hint: 'Ajoutez class Moto extends Vehicule'
      },
      {
        id: 'c2-override',
        label: 'Redéfinition polymorphe',
        description: 'demarrer() renvoie "Braaap ! La moto rugit."',
        passed: false,
        hint: 'Retournez la chaîne demandée dans demarrer()'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasMotoClass = typeof sandbox?.Moto === 'function';
      let sound = '';
      if (hasMotoClass) {
        try {
          const m = new sandbox.Moto('Yamaha');
          sound = m.demarrer();
        } catch (e) {}
      }
      return [
        { criterionId: 'c2-class', passed: hasMotoClass, message: 'La classe Moto doit être définie.' },
        { criterionId: 'c2-override', passed: sound.includes('Braaap'), message: 'demarrer() doit renvoyer "Braaap ! La moto rugit."' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-1-3',
    labNumber: 1,
    number: '1.3',
    title: 'Signature cohérente et substitution',
    subtitle: 'Détecter et corriger une erreur de signature brisant le polymorphisme',
    sectionId: 'control-tower-vs-delegation',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Dans le code ci-dessous, la classe Avion exige un paramètre obligatoire "altitude" dans sa méthode voler(), ce qui empêche de l\'appeler uniformément avec oiseau.voler(). Corrigez la méthode voler() d\'Avion pour que sa signature soit compatible (altitude optionnelle avec valeur par défaut 10000) et qu\'elle renvoie une chaîne.',
    hint: 'Mettez altitude: number = 10000 dans les paramètres de voler() pour que voler() puisse être appelé sans argument !',
    initialCode: `class Oiseau {
  voler(): string {
    return "L'oiseau bat des ailes dans le ciel.";
  }
}

class Avion {
  // TODO: Rendez le paramètre altitude optionnel avec une valeur par défaut de 10000
  voler(altitude: number): string {
    return \`L'avion vole à \${altitude} mètres d'altitude.\`;
  }
}

// Cette fonction universelle doit fonctionner avec les deux sans paramètre :
function faireVoler(objetVolant: { voler: () => string }): void {
  console.log(objetVolant.voler());
}

faireVoler(new Oiseau());
faireVoler(new Avion()); // ❌ Doit pouvoir être appelé sans argument !
`,
    solutionCode: `class Oiseau {
  voler(): string {
    return "L'oiseau bat des ailes dans le ciel.";
  }
}

class Avion {
  voler(altitude: number = 10000): string {
    return \`L'avion vole à \${altitude} mètres d'altitude.\`;
  }
}

function faireVoler(objetVolant: { voler: () => string }): void {
  console.log(objetVolant.voler());
}

faireVoler(new Oiseau());
faireVoler(new Avion());
`,
    solutionExplanation: [
      'Pour qu\'un appel soit polymorphe, la signature dans la sous-classe ou le type substituable doit respecter le contrat de base.',
      'Exiger un paramètre obligatoire casse le principe de substitution de Liskov (LSP).',
      'Rendre le paramètre optionnel (avec valeur par défaut) rétablit la compatibilité parfaite.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /voler\s*\(\s*altitude(\s*:\s*number)?\s*=\s*10_?000\s*\)/,
        label: 'Paramètre altitude par défaut 10000',
        errorMessage: 'La méthode voler(altitude: number = 10000) doit fournir une valeur par défaut de 10000.'
      }
    ],
    criteria: [
      {
        id: 'c3-signature',
        label: 'Signature compatible',
        description: 'voler() peut être appelé sans argument sur Avion',
        passed: false,
        hint: 'Ajoutez altitude: number = 10000'
      },
      {
        id: 'c3-output',
        label: 'Sortie correcte',
        description: 'L\'avion vole à 10000 mètres d\'altitude s\'affiche dans la console',
        passed: false,
        hint: 'Vérifiez l\'appel faireVoler(new Avion())'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      let avionVol = '';
      if (typeof sandbox?.Avion === 'function') {
        try {
          const a = new sandbox.Avion();
          avionVol = a.voler();
        } catch (e) {}
      }
      const hasAvion10000 = logs.some(l => l.includes('10000 mètres') || l.includes('10000')) || avionVol.includes('10000');
      const hasOiseau = logs.some(l => l.includes('oiseau bat'));
      return [
        { criterionId: 'c3-signature', passed: hasAvion10000, message: 'Avion doit pouvoir voler sans argument et mentionner 10000 mètres.' },
        { criterionId: 'c3-output', passed: (hasOiseau && hasAvion10000) || hasAvion10000, message: 'Les messages de vol doivent s\'afficher.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-1-4',
    labNumber: 1,
    number: '1.4',
    title: 'Délégation complète de calcul',
    subtitle: 'Calculer le prix final polymorphe pour ProduitPhysique et ProduitNumerique',
    sectionId: 'control-tower-vs-delegation',
    estimatedTime: '6 min',
    difficulty: 'Facile',
    statement: 'Créez la méthode calculerPrixTTC(): number dans Produit. Dans ProduitPhysique, ajoutez 5€ de frais de port au prix * 1.20 (TVA 20%). Dans ProduitNumerique, le prix TTC est simplement prix * 1.20 (sans frais de port). La fonction totalPanier(produits: Produit[]) doit sommer les prix TTC via un appel polymorphe.',
    hint: 'Dans ProduitPhysique : return super.calculerPrixTTC() + 5; Dans ProduitNumerique : return super.calculerPrixTTC(); (ou hériter directement).',
    initialCode: `class Produit {
  constructor(public nom: string, public prixHT: number) {}

  calculerPrixTTC(): number {
    return this.prixHT * 1.2;
  }
}

class ProduitPhysique extends Produit {
  override calculerPrixTTC(): number {
    // TODO: Utilisez super.calculerPrixTTC() + 5€ de port
    return 0;
  }
}

class ProduitNumerique extends Produit {
  override calculerPrixTTC(): number {
    // TODO: Prix TTC sans port (super.calculerPrixTTC())
    return 0;
  }
}

const panier: Produit[] = [
  new ProduitPhysique("Livre relié", 20), // 20 * 1.2 + 5 = 29
  new ProduitNumerique("E-book", 10)       // 10 * 1.2 = 12
];

function totalPanier(items: Produit[]): number {
  let total = 0;
  for (const item of items) {
    total += item.calculerPrixTTC();
  }
  return total;
}

console.log("Total TTC :", totalPanier(panier), "€");
`,
    solutionCode: `class Produit {
  constructor(public nom: string, public prixHT: number) {}

  calculerPrixTTC(): number {
    return this.prixHT * 1.2;
  }
}

class ProduitPhysique extends Produit {
  override calculerPrixTTC(): number {
    return super.calculerPrixTTC() + 5;
  }
}

class ProduitNumerique extends Produit {
  override calculerPrixTTC(): number {
    return super.calculerPrixTTC();
  }
}

const panier: Produit[] = [
  new ProduitPhysique("Livre relié", 20),
  new ProduitNumerique("E-book", 10)
];

function totalPanier(items: Produit[]): number {
  let total = 0;
  for (const item of items) {
    total += item.calculerPrixTTC();
  }
  return total;
}

console.log("Total TTC :", totalPanier(panier), "€");
`,
    solutionExplanation: [
      'Appeler super.calculerPrixTTC() réutilise la logique de base (calcul de TVA) sans duplication.',
      'ProduitPhysique n\'ajoute que sa spécificité métier : + 5€ de frais de port.',
      'La fonction totalPanier traite tous les produits de façon totalement uniforme et polymorphe.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /calculerPrixTTC\s*\(\s*\)/,
        label: 'Méthode calculerPrixTTC',
        errorMessage: 'La méthode calculerPrixTTC() doit être présente.'
      }
    ],
    criteria: [
      {
        id: 'c4-physique',
        label: 'Calcul ProduitPhysique',
        description: '20€ HT donne 29€ TTC avec 5€ de port',
        passed: false,
        hint: 'return super.calculerPrixTTC() + 5;'
      },
      {
        id: 'c4-total',
        label: 'Somme unifiée',
        description: 'Le total du panier affiche 41 €',
        passed: false,
        hint: '29 + 12 = 41'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      let prixPhysique = 0;
      let prixNumerique = 0;
      if (typeof sandbox?.ProduitPhysique === 'function') {
        try {
          const pp = new sandbox.ProduitPhysique('Livre relié', 20);
          prixPhysique = typeof pp.calculerPrixTTC === 'function' ? pp.calculerPrixTTC() : 0;
        } catch (e) {}
      }
      if (typeof sandbox?.ProduitNumerique === 'function') {
        try {
          const pn = new sandbox.ProduitNumerique('E-book', 10);
          prixNumerique = typeof pn.calculerPrixTTC === 'function' ? pn.calculerPrixTTC() : 0;
        } catch (e) {}
      }
      const has41 = logs.some(l => l.includes('41')) || (prixPhysique === 29 && prixNumerique === 12);
      const has29 = logs.some(l => l.includes('29')) || prixPhysique === 29;
      return [
        { criterionId: 'c4-physique', passed: has29, message: 'ProduitPhysique (20€ HT) doit donner 29€ TTC.' },
        { criterionId: 'c4-total', passed: has41, message: 'Le total du panier doit être de 41 €.' }
      ];
    },
    isCompleted: false
  }
];
