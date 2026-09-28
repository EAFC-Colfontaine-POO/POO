import { ExerciseDef } from '../models/app.models';

export const LAB4_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-4-1',
    labNumber: 4,
    number: '4.1',
    title: 'Garde de type simple avec instanceof',
    subtitle: 'Accéder en toute sécurité à la propriété spécifique d\'une sous-classe',
    sectionId: 'instanceof-type-narrowing',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Écrivez un bloc if (media instanceof Livre) pour afficher le nombre de pages du livre (ex: "Pages : 320"). Si ce n\'est pas un livre, n\'affichez rien.',
    hint: 'if (item instanceof Livre) { console.log("Pages :", item.pages); }',
    initialCode: `class Media {
  constructor(public titre: string) {}
}

class Livre extends Media {
  constructor(titre: string, public pages: number) {
    super(titre);
  }
}

function inspecter(item: Media): void {
  // TODO: Utilisez instanceof pour sécuriser l'accès à pages :
  
}

inspecter(new Livre("Le Hobbit", 320));
inspecter(new Media("Fichier Audio"));
`,
    solutionCode: `class Media {
  constructor(public titre: string) {}
}

class Livre extends Media {
  constructor(titre: string, public pages: number) {
    super(titre);
  }
}

function inspecter(item: Media): void {
  if (item instanceof Livre) {
    console.log("Pages :", item.pages);
  }
}

inspecter(new Livre("Le Hobbit", 320));
inspecter(new Media("Fichier Audio"));
`,
    solutionExplanation: [
      'À l\'intérieur du bloc if (item instanceof Livre), TypeScript opère un Type Narrowing automatique.',
      'La variable item passe temporairement du type Media au type Livre.',
      'L\'accès à item.pages est certifié sans risque au runtime.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /item\s+instanceof\s+Livre/,
        label: 'Garde instanceof Livre',
        errorMessage: 'Utilisez if (item instanceof Livre) pour rétrécir le type.'
      }
    ],
    criteria: [
      {
        id: 'c41-narrow',
        label: 'Type Narrowing',
        description: 'Accès sécurisé à .pages',
        passed: false,
        hint: 'Vérifiez if (item instanceof Livre)'
      },
      {
        id: 'c41-output',
        label: 'Affichage 320',
        description: 'Affiche Pages : 320 pour Le Hobbit uniquement',
        passed: false,
        hint: 'Affichez Pages : item.pages'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const has320 = logs.some(l => l.includes('320'));
      return [
        { criterionId: 'c41-narrow', passed: has320, message: 'La garde instanceof doit être mise en place.' },
        { criterionId: 'c41-output', passed: has320, message: 'Pages : 320 doit être affiché.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-4-2',
    labNumber: 4,
    number: '4.2',
    title: 'Multi-garde séquentielle',
    subtitle: 'Traiter différemment CarteBancaire et PayPal avec instanceof',
    sectionId: 'instanceof-type-narrowing',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Soit la classe abstraite Paiement et ses sous-classes CarteBancaire (numeroMasque) et PayPal (emailCompte). Dans traiter(p: Paiement), distinguez les deux cas avec if / else if et affichez le détail de paiement respectif.',
    hint: 'if (p instanceof CarteBancaire) { ... } else if (p instanceof PayPal) { ... }',
    initialCode: `class Paiement {
  constructor(public montant: number) {}
}

class CarteBancaire extends Paiement {
  constructor(montant: number, public numeroMasque: string) {
    super(montant);
  }
}

class PayPal extends Paiement {
  constructor(montant: number, public emailCompte: string) {
    super(montant);
  }
}

function traiter(p: Paiement): void {
  // TODO: Complétez avec instanceof
  
}

traiter(new CarteBancaire(50, "**** 1234"));
traiter(new PayPal(30, "user@test.com"));
`,
    solutionCode: `class Paiement {
  constructor(public montant: number) {}
}

class CarteBancaire extends Paiement {
  constructor(montant: number, public numeroMasque: string) {
    super(montant);
  }
}

class PayPal extends Paiement {
  constructor(montant: number, public emailCompte: string) {
    super(montant);
  }
}

function traiter(p: Paiement): void {
  if (p instanceof CarteBancaire) {
    console.log("Carte :", p.numeroMasque);
  } else if (p instanceof PayPal) {
    console.log("PayPal :", p.emailCompte);
  }
}

traiter(new CarteBancaire(50, "**** 1234"));
traiter(new PayPal(30, "user@test.com"));
`,
    solutionExplanation: [
      'La multi-garde séquentielle permet de cibler les propriétés exclusives de chaque modalité de paiement.',
      'Chaque branche bénéficie de l\'auto-complétion TypeScript spécifique.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /instanceof\s+CarteBancaire/,
        label: 'Garde CarteBancaire',
        errorMessage: 'Ajoutez if (p instanceof CarteBancaire)'
      },
      {
        type: 'keyword',
        pattern: /instanceof\s+PayPal/,
        label: 'Garde PayPal',
        errorMessage: 'Ajoutez else if (p instanceof PayPal)'
      }
    ],
    criteria: [
      {
        id: 'c42-both',
        label: 'Deux gardes',
        description: 'Traite CarteBancaire et PayPal',
        passed: false,
        hint: 'Vérifiez les deux blocs conditionnels'
      },
      {
        id: 'c42-log',
        label: 'Sortie console',
        description: 'Affiche le numéro masqué et l\'email',
        passed: false,
        hint: 'Les deux paiements doivent s\'afficher'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasCard = logs.some(l => l.includes('1234'));
      const hasEmail = logs.some(l => l.includes('user@test.com'));
      return [
        { criterionId: 'c42-both', passed: hasCard && hasEmail, message: 'Les deux types doivent être inspectés.' },
        { criterionId: 'c42-log', passed: hasCard && hasEmail, message: 'Affichez les détails des deux paiements.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-4-3',
    labNumber: 4,
    number: '4.3',
    title: 'Le Piège 1 : Interface vs Classe au runtime',
    subtitle: 'Remplacer instanceof MonInterface par une vérification de propriété compatible',
    sectionId: 'instanceof-type-narrowing',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Le code ci-dessous tente d\'utiliser if (obj instanceof Utilisable). Or Utilisable est une INTERFACE ! En JavaScript au runtime, les interfaces sont totalement effacées, provoquant ReferenceError. Remplacez le instanceof par l\'opérateur in ("utiliser" in obj) pour sécuriser l\'accès.',
    hint: 'Remplacez obj instanceof Utilisable par "utiliser" in obj',
    initialCode: `interface Utilisable {
  utiliser(): void;
}

class Outil implements Utilisable {
  utiliser(): void {
    console.log("Outil utilisé !");
  }
}

function executerAction(obj: any): void {
  // ❌ ERREUR : Utilisable n'existe pas au runtime !
  // Modifiez cette condition avec l'opérateur 'in' :
  if (obj instanceof Utilisable) {
    obj.utiliser();
  }
}

executerAction(new Outil());
`,
    solutionCode: `interface Utilisable {
  utiliser(): void;
}

class Outil implements Utilisable {
  utiliser(): void {
    console.log("Outil utilisé !");
  }
}

function executerAction(obj: any): void {
  if ("utiliser" in obj && typeof obj.utiliser === 'function') {
    obj.utiliser();
  }
}

executerAction(new Outil());
`,
    solutionExplanation: [
      'Les interfaces et types TypeScript n\'émettent aucun code JavaScript après compilation.',
      'Faire un instanceof sur une interface génère un plantage fatal au runtime.',
      'L\'opérateur JavaScript "in" inspecte les propriétés existantes sur l\'objet sans avoir besoin d\'une classe constructeur.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /instanceof\s+Utilisable/,
        label: 'Interdiction de instanceof Utilisable',
        errorMessage: 'Ne faites jamais instanceof sur une interface TypeScript !'
      },
      {
        type: 'keyword',
        pattern: /"utiliser"\s+in\s+/,
        label: 'Opérateur in',
        errorMessage: 'Vérifiez la présence de la méthode avec "utiliser" in obj'
      }
    ],
    criteria: [
      {
        id: 'c43-in',
        label: 'Utilisation de in',
        description: 'Garde valide sans ReferenceError',
        passed: false,
        hint: 'Vérifiez "utiliser" in obj'
      },
      {
        id: 'c43-run',
        label: 'Exécution',
        description: 'Affiche "Outil utilisé !"',
        passed: false,
        hint: 'Exécutez obj.utiliser()'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasOutil = logs.some(l => l.includes('Outil utilisé'));
      return [
        { criterionId: 'c43-in', passed: hasOutil, message: 'La garde in doit fonctionner.' },
        { criterionId: 'c43-run', passed: hasOutil, message: 'La sortie console doit s\'afficher.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-4-4',
    labNumber: 4,
    number: '4.4',
    title: 'Le Piège 2 : Résurrection post-JSON.parse()',
    subtitle: 'Restaurer la chaîne de prototypes sur des données brutes d\'API',
    sectionId: 'instanceof-type-narrowing',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: 'Soit des données brutes reçues d\'un serveur via HTTP : const data = JSON.parse(\'{"titre":"Dune","pages":412}\'). Prouvez que data instanceof Livre vaut false, puis "ressuscitez" l\'objet en créant const livreReel = new Livre(data.titre, data.pages). Affichez la confirmation avec livreReel instanceof Livre.',
    hint: 'const livreReel = new Livre(data.titre, data.pages); console.log("Est Livre :", livreReel instanceof Livre);',
    initialCode: `class Livre {
  constructor(public titre: string, public pages: number) {}

  resumer(): string {
    return \`\${this.titre} (\${this.pages} p.)\`;
  }
}

// Données JSON brutes (objet littéral pur sans prototype Livre)
const brute = JSON.parse('{"titre":"Dune","pages":412}');
console.log("Brut instanceof Livre :", brute instanceof Livre); // false !

// TODO: Ré-instanciez Livre à partir des données brutes et vérifiez :


`,
    solutionCode: `class Livre {
  constructor(public titre: string, public pages: number) {}

  resumer(): string {
    return \`\${this.titre} (\${this.pages} p.)\`;
  }
}

const brute = JSON.parse('{"titre":"Dune","pages":412}');
console.log("Brut instanceof Livre :", brute instanceof Livre);

const livreReel = new Livre(brute.titre, brute.pages);
console.log("Réel instanceof Livre :", livreReel instanceof Livre);
console.log(livreReel.resumer());
`,
    solutionExplanation: [
      'JSON.parse() produit des objets simples dont le prototype est directement Object.prototype.',
      'Sans instanciation par new, la chaîne de prototype est brisée et instanceof renvoie toujours false.',
      'La ré-instanciation avec new Livre() reconnecte le prototype et restaure toutes les méthodes.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /new\s+Livre\s*\(/,
        label: 'Ré-instanciation new Livre(...)',
        errorMessage: 'Ré-instanciez l\'objet avec new Livre(brute.titre, brute.pages).'
      }
    ],
    criteria: [
      {
        id: 'c44-inst',
        label: 'Instanciation',
        description: 'L\'objet est ré-instancié avec la classe Livre',
        passed: false,
        hint: 'Créez new Livre(brute.titre, brute.pages)'
      },
      {
        id: 'c44-true',
        label: 'instanceof = true',
        description: 'livreReel instanceof Livre vaut true',
        passed: false,
        hint: 'Affichez livreReel instanceof Livre'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasFalse = logs.some(l => l.includes('false'));
      const hasTrue = logs.some(l => l.includes('true'));
      return [
        { criterionId: 'c44-inst', passed: hasTrue, message: 'Le nouvel objet doit être une véritable instance de Livre.' },
        { criterionId: 'c44-true', passed: hasFalse && hasTrue, message: 'Le premier test doit valoir false et le second true.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-4-5',
    labNumber: 4,
    number: '4.5',
    title: 'Le Piège 3 : Refactoring anti-instanceof',
    subtitle: 'Éliminer une mauvaise cascade de instanceof en introduisant une méthode polymorphe',
    sectionId: 'instanceof-type-narrowing',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: 'La fonction exporterRapport(doc) utilise une mauvaise cascade de if (doc instanceof ...). Refactorisez le code : ajoutez la méthode getExport(): string dans Document, Rapport et Facture. Remplacez ensuite le corps de exporterRapport par doc.getExport().',
    hint: 'Supprimez la cascade if dans exporterRapport et appelez simplement doc.getExport() !',
    initialCode: `class DocumentMetier {
  constructor(public titre: string) {}
  getExport(): string {
    return \`Document : \${this.titre}\`;
  }
}

class Rapport extends DocumentMetier {
  override getExport(): string {
    return \`Rapport confidentiel : \${this.titre}\`;
  }
}

class Facture extends DocumentMetier {
  constructor(titre: string, public montant: number) {
    super(titre);
  }
  override getExport(): string {
    return \`Facture : \${this.titre} (\${this.montant} €)\`;
  }
}

// ❌ ANTI-PATTERN : Abus de instanceof qui recrée une tour de contrôle !
// TODO: Remplacez cette cascade par un appel polymorphe direct :
function exporterRapport(doc: DocumentMetier): string {
  if (doc instanceof Facture) {
    return doc.getExport();
  } else if (doc instanceof Rapport) {
    return doc.getExport();
  }
  return doc.getExport();
}

console.log(exporterRapport(new Rapport("Audit Q3")));
console.log(exporterRapport(new Facture("F-2026-01", 1250)));
`,
    solutionCode: `class DocumentMetier {
  constructor(public titre: string) {}
  getExport(): string {
    return \`Document : \${this.titre}\`;
  }
}

class Rapport extends DocumentMetier {
  override getExport(): string {
    return \`Rapport confidentiel : \${this.titre}\`;
  }
}

class Facture extends DocumentMetier {
  constructor(titre: string, public montant: number) {
    super(titre);
  }
  override getExport(): string {
    return \`Facture : \${this.titre} (\${this.montant} €)\`;
  }
}

function exporterRapport(doc: DocumentMetier): string {
  return doc.getExport();
}

console.log(exporterRapport(new Rapport("Audit Q3")));
console.log(exporterRapport(new Facture("F-2026-01", 1250)));
`,
    solutionExplanation: [
      'Abuser de instanceof partout dans le code métier recrée exactement la rigidité procédurale que le polymorphisme vise à éliminer.',
      'Réservez instanceof pour les besoins d\'affichage spécifiques dans l\'UI.',
      'Pour la logique métier, confiez la responsabilité à une méthode polymorphe.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /if\s*\(doc\s+instanceof/,
        label: 'Suppression des instanceof',
        errorMessage: 'Supprimez la cascade if (doc instanceof ...).'
      },
      {
        type: 'keyword',
        pattern: /doc\.getExport\(\)/,
        label: 'Appel polymorphe doc.getExport()',
        errorMessage: 'La fonction exporterRapport doit retourner doc.getExport().'
      }
    ],
    criteria: [
      {
        id: 'c45-clean',
        label: 'Code épuré',
        description: 'Zéro condition dans exporterRapport',
        passed: false,
        hint: 'return doc.getExport()'
      },
      {
        id: 'c45-out',
        label: 'Export fidèle',
        description: 'Les deux exports s\'affichent sans régression',
        passed: false,
        hint: 'Vérifiez les deux console.log'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasAudit = logs.some(l => l.includes('Audit Q3'));
      const hasFacture = logs.some(l => l.includes('1250'));
      return [
        { criterionId: 'c45-clean', passed: hasAudit && hasFacture, message: 'La fonction doit être épurée.' },
        { criterionId: 'c45-out', passed: hasAudit && hasFacture, message: 'Les sorties des deux documents doivent être exactes.' }
      ];
    },
    isCompleted: false
  }
];
