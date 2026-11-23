import { ExerciseDef } from '../models/app.models';

export const LAB3_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-3-1',
    labNumber: 3,
    number: '3.1',
    title: 'Déclaration d\'une Entrée Obligatoire avec input.required()',
    subtitle: 'Garantir au typage qu\'un composant ne peut être instancié sans ses données vitales',
    sectionId: 'component-comm',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: `1. Dans la classe ProfilCarteComponent, déclarez une entrée obligatoire 'userId' de type string à l'aide de input.required<string>().\n2. Déclarez une entrée optionnelle 'badge' avec la valeur par défaut 'Membre' via input<string>('Membre').\n3. Instanciez un composant de test et vérifiez la lecture fonctionnelle de userId() et badge().`,
    hint: `userId = input.required<string>(); et badge = input<string>('Membre');`,
    initialCode: `// Exercice 3.1 — Entrées Réactives
class ProfilCarteComponent {
  // TODO: 1. Déclarer l'entrée OBLIGATOIRE 'userId' avec input.required<string>()
  // userId = ...

  // TODO: 2. Déclarer l'entrée OPTIONNELLE 'badge' avec input<string>('Membre')
  // badge = ...
}

// TODO: Instancier et simuler la lecture
const carte = new ProfilCarteComponent();
// Note : dans notre bac à sable, simulez ensuite la valeur reçue du parent pour userId (ex. 'USR-999')
// puis affichez userId() et badge() dans la console.
`,
    solutionCode: `// Exercice 3.1 — Solution officielle
class ProfilCarteComponent {
  // Entrée requise : TypeScript refusera la compilation si omis par le parent
  userId = input.required<string>();

  // Entrée avec valeur par défaut :
  badge = input<string>('Membre');
}

const carte = new ProfilCarteComponent();
// Simulation pour test :
carte.userId = input.required<string>('USR-999');

console.log(carte.userId()); // "USR-999"
console.log(carte.badge());  // "Membre"`,
    solutionExplanation: [
      "input.required<T>() crée un InputSignal<T> qui n'a pas besoin de valeur par défaut initiale.",
      "Le compilateur Angular vérifie au moment du build qu'un attribut [userId] est bien fourni dans le template du parent.",
      "Finis les bugs d'objets fantômes avec identifiant 'undefined' au démarrage !"
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /userId\s*=\s*input\.required/,
        label: 'Appel de input.required()',
        errorMessage: "Vous devez déclarer userId avec input.required()."
      },
      {
        type: 'regex',
        pattern: /badge\s*=\s*input\s*(?:<[^>]*>)?\s*\(/,
        label: 'Appel de input() avec défaut',
        errorMessage: "Vous devez déclarer badge avec input('Membre')."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const Comp = sandbox.ProfilCarteComponent;

      const isClass = typeof Comp === 'function';
      let correctInputs = false;

      if (isClass) {
        try {
          const inst = new Comp();
          correctInputs = typeof inst.userId === 'function' && typeof inst.badge === 'function' && inst.badge() === 'Membre';
        } catch (e) {}
      }

      results.push({
        criterionId: 'c-3-1-1',
        passed: correctInputs,
        message: correctInputs ? undefined : "ProfilCarteComponent doit déclarer userId via input.required() et badge avec la valeur par défaut 'Membre'."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-3-1-1',
        label: 'Contrat d\'entrées typé',
        description: "userId et badge sont des signaux d'entrée valides.",
        passed: false,
        hint: "userId = input.required<string>(); badge = input<string>('Membre');"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-3-2',
    labNumber: 3,
    number: '3.2',
    title: 'Transformation d\'Attributs avec booleanAttribute',
    subtitle: 'Supporter les attributs HTML standards sans alourdir le parent',
    sectionId: 'component-comm',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `Dans le web standard, un attribut booléen s'écrit simplement <bouton actif>. Dans l'ancien Angular, il fallait obligatoirement écrire [actif]="true".\n1. Déclarez une entrée 'active' dans ToggleButtonComponent.\n2. Initialisez-la à false en ajoutant l'option { transform: booleanAttribute }.\n3. Testez la conversion en simulant le passage de la chaîne vide "" (présence de l'attribut) : la valeur doit devenir true !`,
    hint: `active = input(false, { transform: booleanAttribute });`,
    initialCode: `// Exercice 3.2 — Transformateur d'Attributs
class ToggleButtonComponent {
  // TODO: Déclarer l'entrée 'active' (valeur par défaut false) avec l'option de transformation booleanAttribute
}

// Test de conversion :
const btn = new ToggleButtonComponent();
// TODO: Simuler la présence d'attribut HTML (chaîne vide "") et vérifier que btn.active() vaut true
// TODO: Afficher le résultat dans la console
`,
    solutionCode: `// Exercice 3.2 — Solution officielle
class ToggleButtonComponent {
  // Coercition automatique de présence HTML en booléen :
  active = input(false, { transform: booleanAttribute });
}

const btn = new ToggleButtonComponent();
btn.active = input(booleanAttribute(''));

console.log('Actif ?', btn.active()); // true`,
    solutionExplanation: [
      "booleanAttribute convertit '', 'true', et true en true, et tout le reste en false.",
      "Le développeur peut ainsi écrire <app-toggle-button active /> sans syntaxe verbeuse.",
      "La transformation est exécutée par Angular avant que la valeur n'atteigne le signal."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /transform\s*:\s*booleanAttribute/,
        label: 'Option transform: booleanAttribute',
        errorMessage: "Vous devez spécifier { transform: booleanAttribute } dans l'option de input()."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const Comp = sandbox.ToggleButtonComponent;

      const isClass = typeof Comp === 'function';
      let transformPassed = false;

      if (isClass) {
        try {
          const inst = new Comp();
          transformPassed = typeof inst.active === 'function' && inst.active() === false;
        } catch (e) {}
      }

      results.push({
        criterionId: 'c-3-2-1',
        passed: transformPassed,
        message: transformPassed ? undefined : "L'entrée 'active' doit être déclarée avec input(false, { transform: booleanAttribute })."
      });

      const btnActive = sandbox.btn && typeof sandbox.btn.active === 'function' && sandbox.btn.active() === true;
      const loggedTrue = logs.some(l => l.includes('true'));
      results.push({
        criterionId: 'c-3-2-2',
        passed: !!btnActive && loggedTrue,
        message: btnActive && loggedTrue ? undefined : "btn.active() doit valoir true (conversion de \"\") et la console doit l'afficher."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-3-2-1',
        label: 'Coercition d\'attribut booléen',
        description: "L'option { transform: booleanAttribute } est correctement branchée.",
        passed: false,
        hint: "active = input(false, { transform: booleanAttribute });"
      },
      {
        id: 'c-3-2-2',
        label: 'Validation fonctionnelle',
        description: "La conversion de l'attribut HTML renvoie bien true.",
        passed: false,
        hint: "console.log('Actif ?', btn.active());"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-3-3',
    labNumber: 3,
    number: '3.3',
    title: 'Émission d\'Événement avec output()',
    subtitle: 'Remplacer EventEmitter de RxJS par la fonction native output()',
    sectionId: 'component-comm',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `Dans un composant SupprimerBoutonComponent :\n1. Déclarez une sortie nommée 'supprimer' en appelant la fonction output<number>().\n2. Écrivez une méthode declencher(id: number): void qui émet cet identifiant vers le parent via this.supprimer.emit(id).\n3. Instanciez le composant et appelez declencher(42).`,
    hint: `supprimer = output<number>(); et dans la méthode : this.supprimer.emit(id);`,
    initialCode: `// Exercice 3.3 — Sorties Réactives avec output()
class SupprimerBoutonComponent {
  // TODO: 1. Remplacer l'ancien EventEmitter RxJS par la sortie 'supprimer' (fonction output)

  // TODO: 2. Compléter la méthode declencher pour émettre l'identifiant
  declencher(id: number): void {
    
  }
}

// TODO: Instancier et tester (appeler declencher avec l'identifiant 42)
const btn = new SupprimerBoutonComponent();
`,
    solutionCode: `// Exercice 3.3 — Solution officielle
class SupprimerBoutonComponent {
  // Sortie légère native :
  supprimer = output<number>();

  declencher(id: number): void {
    // Émission de l'événement vers le parent
    this.supprimer.emit(id);
    console.log('[Enfant] Émission de la suppression #', id);
  }
}

const btn = new SupprimerBoutonComponent();
btn.declencher(42);`,
    solutionExplanation: [
      "output<T>() remplace les décorateurs @Output() et l'objet EventEmitter de RxJS.",
      "Il ne dépend plus de RxJS, allège considérablement la mémoire et améliore les performances d'exécution.",
      "Le composant parent l'écoute simplement avec la syntaxe standard (supprimer)=\"gerer($event)\"."
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /EventEmitter/,
        label: 'Interdiction de EventEmitter',
        errorMessage: "EventEmitter de RxJS est banni : utilisez la fonction output<T>() !"
      },
      {
        type: 'regex',
        pattern: /supprimer\s*=\s*output/,
        label: 'Appel de output()',
        errorMessage: "Vous devez initialiser 'supprimer' avec output<number>()."
      },
      {
        type: 'regex',
        pattern: /this\.supprimer\.emit\s*\(/,
        label: 'Appel de .emit()',
        errorMessage: "Vous devez émettre l'identifiant avec this.supprimer.emit(id)."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const Comp = sandbox.SupprimerBoutonComponent;

      const isClass = typeof Comp === 'function';
      let emitWorks = false;

      if (isClass) {
        try {
          const inst = new Comp();
          if (inst.supprimer && typeof inst.supprimer.emit === 'function') {
            inst.declencher(42);
            emitWorks = true;
          }
        } catch (e) {}
      }

      results.push({
        criterionId: 'c-3-3-1',
        passed: emitWorks,
        message: emitWorks ? undefined : "La méthode declencher(id) doit émettre la valeur via output.emit()."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-3-3-1',
        label: 'Émission par output()',
        description: "L'émetteur d'événement transmet la charge utile avec succès.",
        passed: false,
        hint: "supprimer = output<number>(); this.supprimer.emit(id);"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-3-4',
    labNumber: 3,
    number: '3.4',
    title: 'Liaison Bidirectionnelle avec model()',
    subtitle: 'Créer un signal double-sens pour supprimer toute la plomberie manuelle',
    sectionId: 'component-comm',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Dans un composant InterrupteurComponent :\n1. Déclarez une propriété 'actif' initialisée avec model<boolean>(false).\n2. Écrivez une méthode basculer(): void qui inverse la valeur actuelle avec this.actif.update(v => !v).\n3. Testez l'interrupteur : actif() doit valoir false au départ, puis true après basculer().`,
    hint: `actif = model<boolean>(false); puis this.actif.update(v => !v);`,
    initialCode: `// Exercice 3.4 — model() Bidirectionnel
class InterrupteurComponent {
  // TODO: 1. Déclarer le signal bidirectionnel 'actif' (model booléen, valeur initiale false)

  // TODO: 2. Écrire la méthode basculer() qui inverse l'état
  basculer(): void {
    
  }
}

// TODO: Instancier et tester (afficher l'état initial, basculer, puis afficher l'état après bascule)
const interrupteur = new InterrupteurComponent();
`,
    solutionCode: `// Exercice 3.4 — Solution officielle
class InterrupteurComponent {
  // Signal bidirectionnel : accessible en lecture et en écriture
  actif = model<boolean>(false);

  basculer(): void {
    this.actif.update(v => !v);
  }
}

const interrupteur = new InterrupteurComponent();
console.log('État initial :', interrupteur.actif()); // false

interrupteur.basculer();
console.log('Après bascule :', interrupteur.actif()); // true`,
    solutionExplanation: [
      "model() est à la fois un InputSignal (reçoit du parent) et un OutputEmitterRef (notifie le parent).",
      "Quand le composant appelle this.actif.update(), Angular met à jour la valeur locale ET émet l'événement de mise à jour vers le parent.",
      "Une seule ligne de code remplace le couple historique @Input() + @Output()Change !"
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /actif\s*=\s*model/,
        label: 'Déclaration avec model()',
        errorMessage: "Vous devez déclarer 'actif' avec model<boolean>(false)."
      },
      {
        type: 'regex',
        pattern: /this\.actif\.update\s*\(/,
        label: 'Mutation avec this.actif.update',
        errorMessage: "Vous devez inverser l'état avec this.actif.update(v => !v)."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const Comp = sandbox.InterrupteurComponent;

      const isClass = typeof Comp === 'function';
      let modelWorks = false;

      if (isClass) {
        try {
          const inst = new Comp();
          if (inst.actif() === false) {
            inst.basculer();
            if (inst.actif() === true) modelWorks = true;
          }
        } catch (e) {}
      }

      results.push({
        criterionId: 'c-3-4-1',
        passed: modelWorks,
        message: modelWorks ? undefined : "InterrupteurComponent doit inverser son signal actif via model()."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-3-4-1',
        label: 'Composant piloté par model()',
        description: "L'état est initialisé à false et bascule à true à la demande.",
        passed: false,
        hint: "actif = model<boolean>(false); this.actif.update(v => !v);"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-3-5',
    labNumber: 3,
    number: '3.5',
    title: 'Chaînage Parent-Enfant avec la "Boîte à Bananes" [()]',
    subtitle: 'Synchroniser un signal du parent avec le model() d\'un enfant dans le template',
    sectionId: 'component-comm',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: `Dans le composant parent, nous avons un signal : systemeActif = signal<boolean>(false).\nNous voulons insérer le composant enfant <app-interrupteur> en liant son entrée-sortie bidirectionnelle 'actif' à notre signal local.\n1. Écrivez le fragment de template HTML utilisant la syntaxe "boîte à bananes" [()].\n2. Stockez ce fragment HTML dans une constante nommée 'templateParent'.\n3. Vérifiez la conformité de la syntaxe.`,
    hint: `[(actif)]="systemeActif" ! Les crochets [] représentent la boîte, les parenthèses () représentent la banane.`,
    initialCode: `// Exercice 3.5 — Chaînage Parent-Enfant
// Dans le composant parent :
// systemeActif = signal<boolean>(false);

// TODO: Rédiger la balise HTML du composant enfant avec la boîte à bananes [()]
// reliant l'attribut 'actif' de l'enfant au signal 'systemeActif' du parent.
const templateParent = \`
  <!-- Écrivez ici la balise <app-interrupteur ... /> -->
\`;

console.log(templateParent.trim());
`,
    solutionCode: `// Exercice 3.5 — Solution officielle
// La syntaxe "boîte à bananes" relie le model() de l'enfant au signal du parent :
const templateParent = \`<app-interrupteur [(actif)]="systemeActif" />\`;

console.log(templateParent.trim());`,
    solutionExplanation: [
      "La syntaxe [(actif)]=\"systemeActif\" lie les deux sens en une seule écriture déclarative.",
      "Si le parent modifie systemeActif.set(true), l'enfant reçoit la nouvelle valeur.",
      "Si l'enfant clique et appelle actif.update(), le signal systemeActif du parent est synchronisé instantanément sans méthode d'écoute manuelle !"
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /\[\s*\(\s*actif\s*\)\s*\]\s*=\s*['"]systemeActif['"]/,
        label: 'Syntaxe boîte à bananes [(actif)]="systemeActif"',
        errorMessage: "Vous devez écrire [(actif)]=\"systemeActif\" dans la balise HTML !"
      },
      {
        type: 'regex',
        pattern: /<app-interrupteur/,
        label: 'Balise de composant app-interrupteur',
        errorMessage: "La balise doit cibler <app-interrupteur>."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const tpl = String(sandbox.templateParent || '');

      const isConform = /<app-interrupteur\s+\[\(actif\)\]="systemeActif"\s*\/?>/.test(tpl);

      results.push({
        criterionId: 'c-3-5-1',
        passed: isConform,
        message: isConform ? undefined : "Le template doit être exactement : <app-interrupteur [(actif)]=\"systemeActif\" />"
      });

      return results;
    },
    criteria: [
      {
        id: 'c-3-5-1',
        label: 'Liaison bidirectionnelle déclarative',
        description: "La syntaxe [()] est correctement formatée dans le template.",
        passed: false,
        hint: "<app-interrupteur [(actif)]=\"systemeActif\" />"
      }
    ],
    isCompleted: false
  }
];
