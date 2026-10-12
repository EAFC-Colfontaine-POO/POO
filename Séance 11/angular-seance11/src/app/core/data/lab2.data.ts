import { ExerciseDef } from '../models/app.models';

export const LAB2_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-2-1',
    labNumber: 2,
    number: '2.1',
    title: 'Élimination d\'un switch par Pattern Stratégie',
    subtitle: 'Remplacer l\'aiguillage impératif par le polymorphisme d\'interface',
    sectionId: 'ocp-open-closed',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: `Un calculateur de frais de port utilise un switch instable. Refactorisez-le avec le pattern Stratégie :
1. Définissez l'interface StrategieFraisPort avec la méthode calculer(poidsKg: number): number.
2. Créez FraisPortDHL (base 10€ + 2€/kg) et FraisPortPoste (base 4€ + 1€/kg).
3. Créez ServiceExpedition qui reçoit une StrategieFraisPort dans son constructeur et propose calculerFrais(poidsKg: number): number.`,
    hint: 'La classe ServiceExpedition ne doit contenir aucun switch ni if sur le nom du transporteur.',
    initialCode: `// ❌ CODE ANTI-PATTERN OCP AVEC SWITCH :
// export class CalculateurFraisPort {
//   calculer(type: string, poids: number): number {
//     switch (type) {
//       case 'DHL': return 10 + poids * 2;
//       case 'POSTE': return 4 + poids * 1;
//       default: throw new Error('Inconnu');
//     }
//   }
// }

// TODO 1 : Définir l'interface StrategieFraisPort
export interface StrategieFraisPort {
  calculer(poidsKg: number): number;
}

// TODO 2 : Implémenter FraisPortDHL (10 + poidsKg * 2)
export class FraisPortDHL implements StrategieFraisPort {
  calculer(poidsKg: number): number {
    return 0;
  }
}

// TODO 3 : Implémenter FraisPortPoste (4 + poidsKg * 1)
export class FraisPortPoste implements StrategieFraisPort {
  calculer(poidsKg: number): number {
    return 0;
  }
}

// TODO 4 : Créer ServiceExpedition sans switch
export class ServiceExpedition {
  constructor(private strategie: StrategieFraisPort) {}

  calculerFrais(poidsKg: number): number {
    return 0;
  }
}
`,
    solutionCode: `export interface StrategieFraisPort {
  calculer(poidsKg: number): number;
}

export class FraisPortDHL implements StrategieFraisPort {
  calculer(poidsKg: number): number {
    return 10 + poidsKg * 2;
  }
}

export class FraisPortPoste implements StrategieFraisPort {
  calculer(poidsKg: number): number {
    return 4 + poidsKg * 1;
  }
}

export class ServiceExpedition {
  constructor(private strategie: StrategieFraisPort) {}

  calculerFrais(poidsKg: number): number {
    return this.strategie.calculer(poidsKg);
  }
}
`,
    solutionExplanation: [
      'ServiceExpedition est maintenant fermé à la modification : il ne changera jamais, quel que soit le transporteur.',
      'Le système est ouvert à l\'extension : pour ajouter UPS, nous créons une nouvelle classe FraisPortUPS sans toucher à une seule ligne existante.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /switch\s*\(/,
        label: 'Pas de switch',
        errorMessage: 'Vous ne devez pas utiliser d\'instruction switch.'
      },
      {
        type: 'keyword',
        pattern: /class\s+ServiceExpedition/,
        label: 'class ServiceExpedition',
        errorMessage: 'Vous devez créer la classe ServiceExpedition.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const DhlClass = sandbox.FraisPortDHL;
      const PosteClass = sandbox.FraisPortPoste;
      const ExpClass = sandbox.ServiceExpedition;

      if (!DhlClass || !PosteClass || !ExpClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes de stratégie ou ServiceExpedition introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes de stratégie ou ServiceExpedition introuvables.' }
        ];
      }

      try {
        const dhl = new DhlClass();
        const poste = new PosteClass();
        const coutDhl = dhl.calculer(5); // 10 + 10 = 20
        const coutPoste = poste.calculer(5); // 4 + 5 = 9
        const p1 = coutDhl === 20 && coutPoste === 9;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : `Attendu DHL=20 et Poste=9 pour 5kg. Reçu DHL=${coutDhl}, Poste=${coutPoste}` });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const dhl = new DhlClass();
        const service = new ExpClass(dhl);
        const res = service.calculerFrais(3); // 10 + 6 = 16
        const p2 = res === 16;
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `ServiceExpedition n'a pas délégué à la stratégie. Reçu: ${res}` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Stratégies DHL et Poste conformes',
        description: 'FraisPortDHL et FraisPortPoste calculent les montants respectifs (20€ et 9€ pour 5kg).',
        passed: false,
        hint: 'DHL = 10 + poids * 2, Poste = 4 + poids * 1.'
      },
      {
        id: 'c2',
        label: 'Délégation polymorphique dans ServiceExpedition',
        description: 'ServiceExpedition appelle this.strategie.calculer(poidsKg) sans aucun switch.',
        passed: false,
        hint: 'Retournez this.strategie.calculer(poidsKg).'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-2-2',
    labNumber: 2,
    number: '2.2',
    title: 'Extension sans modification',
    subtitle: 'Ajouter une stratégie RemiseEtudiant sans altérer le code existant',
    sectionId: 'ocp-open-closed',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `La classe CalculateurRemise est verrouillée et ne doit PAS être modifiée.
Elle consomme le contrat StrategieRemise.
Implémentez la nouvelle classe RemiseEtudiant offrant 20% de réduction immédiate (total * 0.8), et vérifiez qu'elle s'exécute parfaitement avec CalculateurRemise.`,
    hint: 'Créez class RemiseEtudiant implements StrategieRemise { appliquer(montant: number): number { return montant * 0.8; } }',
    initialCode: `export interface StrategieRemise {
  appliquer(montant: number): number;
}

// 🔒 CODE FIGÉ (Interdit de modifier CalculateurRemise)
export class CalculateurRemise {
  constructor(private strategie: StrategieRemise) {}

  calculerNet(total: number): number {
    return this.strategie.appliquer(total);
  }
}

// TODO : Créer la classe RemiseEtudiant qui implémente StrategieRemise (-20%)
export class RemiseEtudiant implements StrategieRemise {
  appliquer(montant: number): number {
    // TODO : Réduction de 20%
    return montant;
  }
}
`,
    solutionCode: `export interface StrategieRemise {
  appliquer(montant: number): number;
}

export class CalculateurRemise {
  constructor(private strategie: StrategieRemise) {}

  calculerNet(total: number): number {
    return this.strategie.appliquer(total);
  }
}

export class RemiseEtudiant implements StrategieRemise {
  appliquer(montant: number): number {
    return Math.round(montant * 0.8 * 100) / 100;
  }
}
`,
    solutionExplanation: [
      'CalculateurRemise est rigoureusement fermé à la modification.',
      'L\'ajout de la réduction étudiant se fait à 100% par création de code additionnel (ouvert à l\'extension).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+RemiseEtudiant/,
        label: 'class RemiseEtudiant',
        errorMessage: 'Vous devez créer la classe RemiseEtudiant.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const RemiseClass = sandbox.RemiseEtudiant;
      const CalcClass = sandbox.CalculateurRemise;

      if (!RemiseClass || !CalcClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const r = new RemiseClass();
        const res = r.appliquer(100);
        const p1 = Math.abs(res - 80) < 0.01;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : `Attendu: 80€ pour 100€ d'achat (-20%). Reçu: ${res}` });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const r = new RemiseClass();
        const calc = new CalcClass(r);
        const net = calc.calculerNet(200);
        const p2 = Math.abs(net - 160) < 0.01;
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `CalculateurRemise n'a pas appliqué la remise étudiante (attendu: 160€, reçu: ${net}€).` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Remise étudiante de 20%',
        description: 'RemiseEtudiant.appliquer(100) renvoie 80.',
        passed: false,
        hint: 'Retournez montant * 0.8.'
      },
      {
        id: 'c2',
        label: 'Intégration transparente dans CalculateurRemise',
        description: 'CalculateurRemise utilise RemiseEtudiant et renvoie 160 pour 200€.',
        passed: false,
        hint: 'Injectez RemiseEtudiant dans le constructeur de CalculateurRemise.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-2-3',
    labNumber: 2,
    number: '2.3',
    title: 'Système de validation extensible',
    subtitle: 'Moteur de règles ouvert à l\'ajout de validateurs sans retouche',
    sectionId: 'ocp-open-closed',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Créez un moteur de validation FormValidator ouvert aux règles futures :
1. Interface RegleValidation avec :
   - valider(valeur: string): boolean
   - messageErreur: string
2. Implémentez RegleEmail (vérifie que valeur contient '@' ; messageErreur: 'Format e-mail invalide')
3. Implémentez RegleLongueurMin avec constructeur(longueurMin: number) (vérifie valeur.length >= longueurMin ; messageErreur: 'Trop court')
4. FormValidator possède ajouterRegle(regle: RegleValidation): void et valider(valeur: string): string[] (renvoie la liste des messages d'erreur).`,
    hint: 'valider() itère sur les règles ajoutées et accumule les messageErreur si !regle.valider(valeur).',
    initialCode: `export interface RegleValidation {
  messageErreur: string;
  valider(valeur: string): boolean;
}

// TODO : Créer RegleEmail
export class RegleEmail implements RegleValidation {
  messageErreur: string = 'Format e-mail invalide';
  valider(valeur: string): boolean {
    return false;
  }
}

// TODO : Créer RegleLongueurMin
export class RegleLongueurMin implements RegleValidation {
  messageErreur: string = 'Trop court';
  constructor(private min: number) {}
  valider(valeur: string): boolean {
    return false;
  }
}

// TODO : Créer FormValidator
export class FormValidator {
  private regles: RegleValidation[] = [];

  ajouterRegle(regle: RegleValidation): void {
    // TODO
  }

  valider(valeur: string): string[] {
    // TODO : Retourner les messages d'erreur des règles non respectées
    return [];
  }
}
`,
    solutionCode: `export interface RegleValidation {
  messageErreur: string;
  valider(valeur: string): boolean;
}

export class RegleEmail implements RegleValidation {
  messageErreur: string = 'Format e-mail invalide';
  valider(valeur: string): boolean {
    return valeur.includes('@');
  }
}

export class RegleLongueurMin implements RegleValidation {
  messageErreur: string = 'Trop court';
  constructor(private min: number) {}
  valider(valeur: string): boolean {
    return valeur.length >= this.min;
  }
}

export class FormValidator {
  private regles: RegleValidation[] = [];

  ajouterRegle(regle: RegleValidation): void {
    this.regles.push(regle);
  }

  valider(valeur: string): string[] {
    const erreurs: string[] = [];
    for (const r of this.regles) {
      if (!r.valider(valeur)) {
        erreurs.push(r.messageErreur);
      }
    }
    return erreurs;
  }
}
`,
    solutionExplanation: [
      'FormValidator ne connaît aucune règle en particulier : il est totalement découplé des validations concrètes.',
      'Si nous ajoutons une règle Regex ou MotDePasseFort, le moteur de validation reste inchangé.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+FormValidator/,
        label: 'class FormValidator',
        errorMessage: 'Vous devez créer la classe FormValidator.'
      },
      {
        type: 'keyword',
        pattern: /class\s+RegleEmail/,
        label: 'class RegleEmail',
        errorMessage: 'Vous devez créer la classe RegleEmail.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const ValClass = sandbox.FormValidator;
      const EmailClass = sandbox.RegleEmail;
      const LenClass = sandbox.RegleLongueurMin;

      if (!ValClass || !EmailClass || !LenClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const email = new EmailClass();
        const len = new LenClass(5);
        const p1 = email.valider('test@domaine.be') && !email.valider('bademail') && len.valider('12345') && !len.valider('123');
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'Les règles Email ou LongueurMin ne valident pas correctement.' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const validator = new ValClass();
        validator.ajouterRegle(new EmailClass());
        validator.ajouterRegle(new LenClass(5));

        const errorsValide = validator.valider('alice@test.be');
        const errorsInvalide = validator.valider('bad'); // ni @, ni len >= 5 => 2 erreurs

        const p2 = errorsValide.length === 0 && errorsInvalide.length === 2;
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `Attendu: 0 erreur pour e-mail valide, 2 erreurs pour "bad". Reçu: ${errorsInvalide.length}` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Règles unitaires conformes',
        description: 'RegleEmail vérifie la présence de @ et RegleLongueurMin vérifie la taille minimale.',
        passed: false,
        hint: 'Utilisez valeur.includes("@") et valeur.length >= this.min.'
      },
      {
        id: 'c2',
        label: 'Moteur FormValidator extensible',
        description: 'FormValidator accumule les règles et agrège les messages d\'erreur.',
        passed: false,
        hint: 'Dans valider(), parcourez this.regles et ajoutez r.messageErreur si !r.valider(valeur).'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-2-4',
    labNumber: 2,
    number: '2.4',
    title: 'Système de notification multi-plateforme',
    subtitle: 'Ajouter un canal Discord sans toucher au service d\'alerte',
    sectionId: 'ocp-open-closed',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Un service d'alerte diffuse des messages à une collection de canaux.
1. Implémentez la classe WebhookDiscordNotification respectant l'interface CanalNotification :
   - envoyer(message: string): string (renvoyant "[DISCORD] : " + message)
2. Créez ServiceAlerte avec un tableau de CanalNotification[] et la méthode diffuser(msg: string): string[] qui appelle envoyer sur chaque canal et renvoie le tableau de confirmations.`,
    hint: 'ServiceAlerte prend une liste de canaux en paramètre et ne connaît aucune implémentation concrète.',
    initialCode: `export interface CanalNotification {
  envoyer(message: string): string;
}

export class EmailNotification implements CanalNotification {
  envoyer(message: string): string {
    return \`[EMAIL] : \${message}\`;
  }
}

// TODO : Créer WebhookDiscordNotification implements CanalNotification
export class WebhookDiscordNotification implements CanalNotification {
  envoyer(message: string): string {
    // TODO : [DISCORD] : message
    return '';
  }
}

// TODO : Créer ServiceAlerte
export class ServiceAlerte {
  constructor(private canaux: CanalNotification[]) {}

  diffuser(message: string): string[] {
    // TODO : Envoyer le message sur tous les canaux
    return [];
  }
}
`,
    solutionCode: `export interface CanalNotification {
  envoyer(message: string): string;
}

export class EmailNotification implements CanalNotification {
  envoyer(message: string): string {
    return \`[EMAIL] : \${message}\`;
  }
}

export class WebhookDiscordNotification implements CanalNotification {
  envoyer(message: string): string {
    return \`[DISCORD] : \${message}\`;
  }
}

export class ServiceAlerte {
  constructor(private canaux: CanalNotification[]) {}

  diffuser(message: string): string[] {
    return this.canaux.map(c => c.envoyer(message));
  }
}
`,
    solutionExplanation: [
      'Le service d\'alerte est totalement neutre vis-à-vis des protocoles réseau.',
      'Pour supporter Slack, Telegram ou WhatsApp, on ajoute une classe sans jamais toucher à ServiceAlerte.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+WebhookDiscordNotification/,
        label: 'class WebhookDiscordNotification',
        errorMessage: 'Vous devez créer la classe WebhookDiscordNotification.'
      },
      {
        type: 'keyword',
        pattern: /class\s+ServiceAlerte/,
        label: 'class ServiceAlerte',
        errorMessage: 'Vous devez créer la classe ServiceAlerte.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const DiscClass = sandbox.WebhookDiscordNotification;
      const EmailClass = sandbox.EmailNotification;
      const AlertClass = sandbox.ServiceAlerte;

      if (!DiscClass || !AlertClass || !EmailClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const d = new DiscClass();
        const res = d.envoyer('Alerte serveur');
        const p1 = res.includes('[DISCORD]') && res.includes('Alerte serveur');
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : `Attendu: "[DISCORD] : Alerte serveur", Reçu: "${res}"` });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const email = new EmailClass();
        const discord = new DiscClass();
        const service = new AlertClass([email, discord]);
        const diff = service.diffuser('Panne');
        const p2 = Array.isArray(diff) && diff.length === 2 && diff[0].includes('[EMAIL]') && diff[1].includes('[DISCORD]');
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `ServiceAlerte n'a pas diffusé sur tous les canaux configurés.` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Canal Discord fonctionnel',
        description: 'WebhookDiscordNotification formate le préfixe [DISCORD] correctement.',
        passed: false,
        hint: 'Retournez `[DISCORD] : ${message}`.'
      },
      {
        id: 'c2',
        label: 'Diffusion multi-canaux sans couplage',
        description: 'ServiceAlerte diffuse à la fois sur Email et Discord sans connaître leurs détails techniques.',
        passed: false,
        hint: 'Utilisez this.canaux.map(c => c.envoyer(message)).'
      }
    ],
    isCompleted: false
  }
];
