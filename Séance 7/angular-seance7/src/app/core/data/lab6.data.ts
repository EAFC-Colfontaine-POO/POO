import { ExerciseDef } from '../models/app.models';

export const LAB6_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-6-1',
    labNumber: 6,
    number: '6.1',
    title: 'Modèle métier pur découplé d\'Angular',
    subtitle: 'Classes Tache, TacheUrgente et TacheLongue avec méthode polymorphe',
    sectionId: 'angular-modern-mediatheque',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: 'Dans un fichier modèle pur (sans aucun import @angular/core), créez la classe Tache (description: string) avec getBadgeCss(): string { return "badge bg-secondary"; }. Créez TacheUrgente (renvoie "badge bg-danger") et TacheLongue (renvoie "badge bg-info"). Instanciez les 3 et affichez leurs badges.',
    hint: 'class TacheUrgente extends Tache { override getBadgeCss() { return "badge bg-danger"; } }',
    initialCode: `export class Tache {
  constructor(public description: string) {}

  getBadgeCss(): string {
    return 'badge bg-secondary';
  }
}

// TODO: Créez TacheUrgente extends Tache (badge bg-danger)


// TODO: Créez TacheLongue extends Tache (badge bg-info)


const t1: Tache = new Tache("Lire emails");
// Décommentez pour tester vos sous-classes :
// const t2: Tache = new TacheUrgente("Corriger bug prod");
// const t3: Tache = new TacheLongue("Rédiger mémoire");

console.log(t1.description, ":", t1.getBadgeCss());
// console.log(t2.description, ":", t2.getBadgeCss());
// console.log(t3.description, ":", t3.getBadgeCss());
`,
    solutionCode: `export class Tache {
  constructor(public description: string) {}

  getBadgeCss(): string {
    return 'badge bg-secondary';
  }
}

export class TacheUrgente extends Tache {
  override getBadgeCss(): string {
    return 'badge bg-danger';
  }
}

export class TacheLongue extends Tache {
  override getBadgeCss(): string {
    return 'badge bg-info';
  }
}

const t1: Tache = new Tache("Lire emails");
const t2: Tache = new TacheUrgente("Corriger bug prod");
const t3: Tache = new TacheLongue("Rédiger mémoire");

console.log(t1.description, ":", t1.getBadgeCss());
console.log(t2.description, ":", t2.getBadgeCss());
console.log(t3.description, ":", t3.getBadgeCss());
`,
    solutionExplanation: [
      'Le modèle métier reste 100% agnostique du framework (aucun import Angular).',
      'La méthode polymorphe getBadgeCss() fournit à l\'UI la classe CSS appropriée sans forcer le template à tester le type de chaque tâche.',
      'Propreté et séparation des responsabilités.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+TacheUrgente\s+extends\s+Tache/,
        label: 'TacheUrgente extends Tache',
        errorMessage: 'Déclarez TacheUrgente extends Tache.'
      },
      {
        type: 'keyword',
        pattern: /class\s+TacheLongue\s+extends\s+Tache/,
        label: 'TacheLongue extends Tache',
        errorMessage: 'Déclarez TacheLongue extends Tache.'
      }
    ],
    criteria: [
      {
        id: 'c61-classes',
        label: 'Sous-classes déclarées',
        description: 'TacheUrgente et TacheLongue héritent de Tache',
        passed: false,
        hint: 'Vérifiez les déclarations de classe'
      },
      {
        id: 'c61-badges',
        label: 'Badges polymorphes',
        description: 'Affiche bg-secondary, bg-danger et bg-info',
        passed: false,
        hint: 'Vérifiez les retours de getBadgeCss()'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasDanger = logs.some(l => l.includes('bg-danger'));
      const hasInfo = logs.some(l => l.includes('bg-info'));
      return [
        { criterionId: 'c61-classes', passed: hasDanger && hasInfo, message: 'Les classes doivent être créées.' },
        { criterionId: 'c61-badges', passed: hasDanger && hasInfo, message: 'Les classes CSS doivent être exactes.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-6-2',
    labNumber: 6,
    number: '6.2',
    title: 'Service Angular avec Signal de collection polymorphe',
    subtitle: 'Gérer un signal<Tache[]> privé exposé en lecture seule',
    sectionId: 'angular-modern-mediatheque',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Simulez le service Angular TachesService : déclarez une propriété privée _taches = signal<Tache[]>([]) et exposez-la via readonly taches = computed(() => this._taches()). Écrivez la méthode ajouterTache(t: Tache): void qui met à jour le signal avec this._taches.update(list => [...list, t]).',
    hint: 'ajouterTache(t: Tache) { this._taches.update(l => [...l, t]); }',
    initialCode: `class Tache {
  constructor(public titre: string) {}
}

class TachesService {
  // Signal privé encapsulé
  private readonly _taches = signal<Tache[]>([]);

  // Exposition publique en lecture seule
  readonly taches = computed(() => this._taches());

  // TODO: Écrivez la méthode ajouterTache avec update()
  ajouterTache(t: Tache): void {
    
  }
}

const service = new TachesService();
service.ajouterTache(new Tache("Tâche 1"));
service.ajouterTache(new Tache("Tâche 2"));

console.log("Nombre de tâches :", service.taches().length);
`,
    solutionCode: `class Tache {
  constructor(public titre: string) {}
}

class TachesService {
  private readonly _taches = signal<Tache[]>([]);
  readonly taches = computed(() => this._taches());

  ajouterTache(t: Tache): void {
    this._taches.update(list => [...list, t]);
  }
}

const service = new TachesService();
service.ajouterTache(new Tache("Tâche 1"));
service.ajouterTache(new Tache("Tâche 2"));

console.log("Nombre de tâches :", service.taches().length);
`,
    solutionExplanation: [
      'On applique le principe d\'encapsulation (Séance 5) combiné au polymorphisme (Séance 7).',
      'Le signal privé modifiable est protégé de l\'extérieur.',
      'La collection polymorphe Tache[] peut accueillir n\'importe quelle sous-classe sans recompiler le service.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /this\._taches\.update\s*\(/,
        label: 'Mise à jour par update()',
        errorMessage: 'Mettez à jour le signal via this._taches.update(...)'
      }
    ],
    criteria: [
      {
        id: 'c62-update',
        label: 'Méthode d\'ajout',
        description: 'Ajoute la tâche au signal via update',
        passed: false,
        hint: 'Utilisez this._taches.update(l => [...l, t])'
      },
      {
        id: 'c62-length',
        label: 'Réactivité',
        description: 'service.taches().length vaut 2',
        passed: false,
        hint: 'Vérifiez les deux ajouts'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const has2 = logs.some(l => l.includes('2'));
      return [
        { criterionId: 'c62-update', passed: has2, message: 'La méthode ajouterTache doit mettre à jour le signal.' },
        { criterionId: 'c62-length', passed: has2, message: 'Le signal doit contenir 2 tâches.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-6-3',
    labNumber: 6,
    number: '6.3',
    title: 'Exposition d\'une classe pour le template Angular',
    subtitle: 'Rendre accessible la référence d\'une classe pour l\'usage de @if (item instanceof Classe)',
    sectionId: 'angular-modern-mediatheque',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Dans un composant Angular Standalone, pour pouvoir écrire @if (tache instanceof TacheUrgenteClass) dans le HTML, la classe doit être exposée dans le composant. Déclarez la propriété protégée : protected readonly TacheUrgenteClass = TacheUrgente; dans la classe du composant.',
    hint: 'protected readonly TacheUrgenteClass = TacheUrgente;',
    initialCode: `class Tache {
  constructor(public titre: string) {}
}

class TacheUrgente extends Tache {
  constructor(titre: string, public delaiHeures: number) {
    super(titre);
  }
}

class TachesComponent {
  // TODO: Exposez la référence de la classe TacheUrgente pour le template HTML (TacheUrgenteClass) :
  

  verifierType(item: Tache): boolean {
    return item instanceof (this as any).TacheUrgenteClass;
  }
}

const comp = new TachesComponent();
const u = new TacheUrgente("Urgent", 2);
console.log("Est urgente :", comp.verifierType(u));
`,
    solutionCode: `class Tache {
  constructor(public titre: string) {}
}

class TacheUrgente extends Tache {
  constructor(titre: string, public delaiHeures: number) {
    super(titre);
  }
}

class TachesComponent {
  protected readonly TacheUrgenteClass = TacheUrgente;

  verifierType(item: Tache): boolean {
    return item instanceof this.TacheUrgenteClass;
  }
}

const comp = new TachesComponent();
const u = new TacheUrgente("Urgent", 2);
console.log("Est urgente :", comp.verifierType(u));
`,
    solutionExplanation: [
      'Le template HTML d\'un composant Angular ne peut accéder qu\'aux membres déclarés sur la classe du composant.',
      'Écrire @if (item instanceof TacheUrgente) échouerait sans importer et affecter la classe à une propriété.',
      'La convention "protected readonly NomClasseClass = NomClasse" est le standard moderne d\'Angular.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /readonly\s+TacheUrgenteClass\s*=\s*TacheUrgente/,
        label: 'Propriété TacheUrgenteClass',
        errorMessage: 'Déclarez protected readonly TacheUrgenteClass = TacheUrgente;'
      }
    ],
    criteria: [
      {
        id: 'c63-prop',
        label: 'Exposition de classe',
        description: 'TacheUrgenteClass référence le constructeur',
        passed: false,
        hint: 'Vérifiez la déclaration de la propriété'
      },
      {
        id: 'c63-true',
        label: 'Test instanceof',
        description: 'Renvoie true pour une TacheUrgente',
        passed: false,
        hint: 'comp.verifierType(u) doit être true'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasTrue = logs.some(l => l.includes('true'));
      return [
        { criterionId: 'c63-prop', passed: hasTrue, message: 'La classe doit être exposée.' },
        { criterionId: 'c63-true', passed: hasTrue, message: 'La vérification doit renvoyer true.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-6-4',
    labNumber: 6,
    number: '6.4',
    title: 'Signal calculé polymorphe (computed)',
    subtitle: 'Calculer un indicateur global réactif via une méthode polymorphe',
    sectionId: 'angular-modern-mediatheque',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: 'Soit la classe NotificationApp et ses sous-classes EmailApp (cout: 0.05€) et SmsApp (cout: 0.12€). Dans NotificationsService, créez un signal calculé readonly coutTotal = computed(() => ...) qui somme le coût de toutes les notifications via n.getCout(). Affichez coutTotal().',
    hint: 'readonly coutTotal = computed(() => this.notifs().reduce((acc, n) => acc + n.getCout(), 0));',
    initialCode: `class NotificationApp {
  getCout(): number { return 0; }
}

class EmailApp extends NotificationApp {
  override getCout(): number { return 0.05; }
}

class SmsApp extends NotificationApp {
  override getCout(): number { return 0.12; }
}

class NotificationsService {
  readonly notifs = signal<NotificationApp[]>([
    new EmailApp(),
    new EmailApp(),
    new SmsApp() // 0.05 + 0.05 + 0.12 = 0.22
  ]);

  // TODO: Créez le computed() polymorphe coutTotal :
  
}

const s = new NotificationsService();
// Décommentez après avoir implémenté coutTotal :
// console.log("Coût total calculé :", (s as any).coutTotal?.(), "€");
`,
    solutionCode: `class NotificationApp {
  getCout(): number { return 0; }
}

class EmailApp extends NotificationApp {
  override getCout(): number { return 0.05; }
}

class SmsApp extends NotificationApp {
  override getCout(): number { return 0.12; }
}

class NotificationsService {
  readonly notifs = signal<NotificationApp[]>([
    new EmailApp(),
    new EmailApp(),
    new SmsApp()
  ]);

  readonly coutTotal = computed(() => {
    let sum = 0;
    for (const n of this.notifs()) {
      sum += n.getCout();
    }
    return Math.round(sum * 100) / 100;
  });
}

const s = new NotificationsService();
console.log("Coût total calculé :", s.coutTotal(), "€");
`,
    solutionExplanation: [
      'Le signal calculé computed() suit automatiquement les dépendances du signal notifs().',
      'À l\'intérieur, l\'appel polymorphe n.getCout() s\'exécute pour chaque élément sans distinction conditionnelle.',
      'Dès qu\'une notification est ajoutée au signal, le coût total est recalculé instantanément.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /computed\s*\(/,
        label: 'Signal calculé computed()',
        errorMessage: 'Utilisez computed() pour calculer le coût total réactif.'
      },
      {
        type: 'keyword',
        pattern: /\.getCout\(\)/,
        label: 'Appel polymorphe getCout()',
        errorMessage: 'Appelez n.getCout() sur chaque notification.'
      }
    ],
    criteria: [
      {
        id: 'c64-comp',
        label: 'Signal computed',
        description: 'coutTotal est un signal calculé',
        passed: false,
        hint: 'Vérifiez la déclaration de coutTotal'
      },
      {
        id: 'c64-sum',
        label: 'Coût exact',
        description: 'Affiche Coût total calculé : 0.22 €',
        passed: false,
        hint: '0.05 + 0.05 + 0.12 = 0.22'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const has22 = logs.some(l => l.includes('0.22'));
      return [
        { criterionId: 'c64-comp', passed: has22, message: 'Le signal calculé doit être configuré.' },
        { criterionId: 'c64-sum', passed: has22, message: 'Le coût total doit être de 0.22 €.' }
      ];
    },
    isCompleted: false
  }
];
