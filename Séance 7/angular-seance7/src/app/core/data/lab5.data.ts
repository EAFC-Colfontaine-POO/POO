import { ExerciseDef } from '../models/app.models';

export const LAB5_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-5-1',
    labNumber: 5,
    number: '5.1',
    title: 'Création d\'une union discriminée',
    subtitle: 'Définir des types avec discriminant commun canal: "email" | "sms"',
    sectionId: 'oop-vs-discriminated-unions',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Définissez le type NotificationEmail ({ canal: "email"; dest: string; sujet: string }) et NotificationSMS ({ canal: "sms"; tel: string; texte: string }). Déclarez ensuite le type union Notification = NotificationEmail | NotificationSMS. Créez un objet de chaque type.',
    hint: 'type NotificationEmail = { canal: "email"; dest: string; sujet: string; }; type Notification = NotificationEmail | NotificationSMS;',
    initialCode: `// TODO: 1. Déclarez NotificationEmail avec canal: 'email', dest: string, sujet: string


// TODO: 2. Déclarez NotificationSMS avec canal: 'sms', tel: string, texte: string


// TODO: 3. Déclarez le type union Notification = NotificationEmail | NotificationSMS :


const notif1: any = {
  canal: 'email',
  dest: 'etudiant@eafc.be',
  sujet: 'Séance 7 - Polymorphisme'
};

const notif2: any = {
  canal: 'sms',
  tel: '0470123456',
  texte: 'Rappel cours à 18h'
};

console.log("Canaux :", notif1.canal, "&", notif2.canal);
`,
    solutionCode: `type NotificationEmail = {
  canal: 'email';
  dest: string;
  sujet: string;
};

type NotificationSMS = {
  canal: 'sms';
  tel: string;
  texte: string;
};

type Notification = NotificationEmail | NotificationSMS;

const notif1: Notification = {
  canal: 'email',
  dest: 'etudiant@eafc.be',
  sujet: 'Séance 7 - Polymorphisme'
};

const notif2: Notification = {
  canal: 'sms',
  tel: '0470123456',
  texte: 'Rappel cours à 18h'
};

console.log("Canaux :", notif1.canal, "&", notif2.canal);
`,
    solutionExplanation: [
      'La propriété discriminante commune "canal" possède une valeur littérale distincte pour chaque type.',
      'L\'union permet à TypeScript de distinguer avec certitude quel type est manipulé dès que canal est testé.',
      'Idéal pour typer des charges utiles JSON sans classes.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /type\s+Notification\s*=\s*NotificationEmail\s*\|\s*NotificationSMS/,
        label: 'Type union Notification',
        errorMessage: 'Définissez type Notification = NotificationEmail | NotificationSMS'
      }
    ],
    criteria: [
      {
        id: 'c51-types',
        label: 'Union déclarée',
        description: 'Notification regroupe Email et SMS',
        passed: false,
        hint: 'Vérifiez la clause d\'union'
      },
      {
        id: 'c51-log',
        label: 'Objets conformes',
        description: 'Affiche Canaux : email & sms',
        passed: false,
        hint: 'Affichez notif1.canal et notif2.canal'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasCanaux = logs.some(l => l.includes('email & sms'));
      return [
        { criterionId: 'c51-types', passed: hasCanaux, message: 'Le type union doit être valide.' },
        { criterionId: 'c51-log', passed: hasCanaux, message: 'Les deux notifications doivent avoir leur canal.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-5-2',
    labNumber: 5,
    number: '5.2',
    title: 'Switch avec Type Narrowing discriminant',
    subtitle: 'Exploiter le discriminant pour accéder aux champs spécifiques',
    sectionId: 'oop-vs-discriminated-unions',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Écrivez la fonction formaterNotif(n: Notification): string avec un switch (n.canal). Dans le case "email", retournez `Email à ${n.dest} : ${n.sujet}`. Dans le case "sms", retournez `SMS au ${n.tel} : ${n.texte}`.',
    hint: 'switch (n.canal) { case "email": return `...`; case "sms": return `...`; }',
    initialCode: `type NotificationEmail = { canal: 'email'; dest: string; sujet: string };
type NotificationSMS = { canal: 'sms'; tel: string; texte: string };
type Notification = NotificationEmail | NotificationSMS;

function formaterNotif(n: Notification): string {
  // TODO: Écrivez le switch sur n.canal pour gérer 'email' et 'sms' :
  
}

console.log(formaterNotif({ canal: 'email', dest: 'a@b.com', sujet: 'Hello' }));
console.log(formaterNotif({ canal: 'sms', tel: '0499', texte: 'Code 42' }));
`,
    solutionCode: `type NotificationEmail = { canal: 'email'; dest: string; sujet: string };
type NotificationSMS = { canal: 'sms'; tel: string; texte: string };
type Notification = NotificationEmail | NotificationSMS;

function formaterNotif(n: Notification): string {
  switch (n.canal) {
    case 'email':
      return \`Email à \${n.dest} : \${n.sujet}\`;
    case 'sms':
      return \`SMS au \${n.tel} : \${n.texte}\`;
  }
}

console.log(formaterNotif({ canal: 'email', dest: 'a@b.com', sujet: 'Hello' }));
console.log(formaterNotif({ canal: 'sms', tel: '0499', texte: 'Code 42' }));
`,
    solutionExplanation: [
      'Dans chaque branche case, TypeScript sait quel sous-type est actif.',
      'n.dest n\'est accessible que dans le bloc email, n.tel dans le bloc sms.',
      'Le narrowing est garanti par le compilateur.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /switch\s*\(\s*n\.canal\s*\)/,
        label: 'switch sur n.canal',
        errorMessage: 'Faites un switch (n.canal).'
      }
    ],
    criteria: [
      {
        id: 'c52-switch',
        label: 'Branches complètes',
        description: 'Traite email et sms',
        passed: false,
        hint: 'Vérifiez les deux case du switch'
      },
      {
        id: 'c52-format',
        label: 'Sortie correcte',
        description: 'Affiche les deux formats',
        passed: false,
        hint: 'Affichez les sorties formatées'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasEmail = logs.some(l => l.includes('Email à a@b.com'));
      const hasSms = logs.some(l => l.includes('SMS au 0499'));
      return [
        { criterionId: 'c52-switch', passed: hasEmail && hasSms, message: 'Les deux branches doivent être implémentées.' },
        { criterionId: 'c52-format', passed: hasEmail && hasSms, message: 'Le formatage doit être exact.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-5-3',
    labNumber: 5,
    number: '5.3',
    title: 'Sécurité d\'exhaustivité avec never',
    subtitle: 'Garantir à la compilation qu\'aucun cas de l\'union n\'est oublié',
    sectionId: 'oop-vs-discriminated-unions',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Ajoutez une clause default dans le switch de formaterNotif : default: const _exhaustif: never = n; throw new Error("Non géré"); Cela garantit que si l\'union est étendue sans mettre à jour le switch, TypeScript refusera de compiler.',
    hint: 'default: { const _exhaustif: never = n; throw new Error(`Cas non géré : ${_exhaustif}`); }',
    initialCode: `type NotificationEmail = { canal: 'email'; dest: string; sujet: string };
type NotificationSMS = { canal: 'sms'; tel: string; texte: string };
type Notification = NotificationEmail | NotificationSMS;

function formaterNotif(n: Notification): string {
  switch (n.canal) {
    case 'email':
      return \`Email : \${n.sujet}\`;
    case 'sms':
      return \`SMS : \${n.texte}\`;
    // TODO: Ajoutez la garde d'exhaustivité avec never :
    default:
      
  }
}

console.log(formaterNotif({ canal: 'email', dest: 'x@y.com', sujet: 'Test never' }));
`,
    solutionCode: `type NotificationEmail = { canal: 'email'; dest: string; sujet: string };
type NotificationSMS = { canal: 'sms'; tel: string; texte: string };
type Notification = NotificationEmail | NotificationSMS;

function formaterNotif(n: Notification): string {
  switch (n.canal) {
    case 'email':
      return \`Email : \${n.sujet}\`;
    case 'sms':
      return \`SMS : \${n.texte}\`;
    default:
      const _exhaustif: never = n;
      throw new Error(\`Cas non géré : \${_exhaustif}\`);
  }
}

console.log(formaterNotif({ canal: 'email', dest: 'x@y.com', sujet: 'Test never' }));
`,
    solutionExplanation: [
      'Si tous les cas sont traités, n est de type "never" dans la branche default.',
      'Si un cas est oublié, n aura le type non géré, et TypeScript provoquera une erreur car un type concret ne peut être assigné à never.',
      'C\'est le garde-fou absolu du typage fonctionnel.'
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /const\s+(_exhaustif|_ex|_check)\s*:\s*never\s*=\s*n/,
        label: 'Garde const _exhaustif: never = n',
        errorMessage: 'Ajoutez dans default: const _exhaustif: never = n;'
      }
    ],
    criteria: [
      {
        id: 'c53-never',
        label: 'Garde never',
        description: 'Type never assigné à n dans default',
        passed: false,
        hint: 'Ajoutez const _exhaustif: never = n;'
      },
      {
        id: 'c53-run',
        label: 'Exécution',
        description: 'La fonction traite le cas email valide',
        passed: false,
        hint: 'Affiche Email : Test never'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasEmail = logs.some(l => l.includes('Test never'));
      return [
        { criterionId: 'c53-never', passed: hasEmail, message: 'La garde never doit être présente.' },
        { criterionId: 'c53-run', passed: hasEmail, message: 'Le test d\'exécution doit réussir.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-5-4',
    labNumber: 5,
    number: '5.4',
    title: 'Extension d\'union et prise en charge',
    subtitle: 'Ajouter NotificationPush à l\'union et mettre à jour le switch',
    sectionId: 'oop-vs-discriminated-unions',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: 'Ajoutez type NotificationPush = { canal: "push"; badge: number; message: string }. Intégrez-le dans l\'union Notification. Mettez ensuite à jour le switch pour gérer case "push": return `Push (${n.badge}) : ${n.message}`. Testez avec une notification push.',
    hint: 'Ajoutez case "push": return `Push (${n.badge}) : ${n.message}`;',
    initialCode: `type NotificationEmail = { canal: 'email'; dest: string; sujet: string };
type NotificationSMS = { canal: 'sms'; tel: string; texte: string };

// TODO: 1. Déclarez NotificationPush avec canal: 'push', badge: number, message: string


// TODO: 2. Intégrez NotificationPush dans l'union :
type Notification = NotificationEmail | NotificationSMS;

function formaterNotif(n: Notification): string {
  switch (n.canal) {
    case 'email':
      return \`Email : \${n.sujet}\`;
    case 'sms':
      return \`SMS : \${n.texte}\`;
    // TODO: 3. Ajoutez le case 'push' :
    
    default:
      const _exhaustif: never = n;
      throw new Error(\`Non géré : \${_exhaustif}\`);
  }
}

// Décommentez pour tester l'appel avec push :
// console.log(formaterNotif({ canal: 'push', badge: 3, message: 'Nouveau devoir déposé' }));
`,
    solutionCode: `type NotificationEmail = { canal: 'email'; dest: string; sujet: string };
type NotificationSMS = { canal: 'sms'; tel: string; texte: string };
type NotificationPush = { canal: 'push'; badge: number; message: string };

type Notification = NotificationEmail | NotificationSMS | NotificationPush;

function formaterNotif(n: Notification): string {
  switch (n.canal) {
    case 'email':
      return \`Email : \${n.sujet}\`;
    case 'sms':
      return \`SMS : \${n.texte}\`;
    case 'push':
      return \`Push (\${n.badge}) : \${n.message}\`;
    default:
      const _exhaustif: never = n;
      throw new Error(\`Non géré : \${_exhaustif}\`);
  }
}

console.log(formaterNotif({ canal: 'push', badge: 3, message: 'Nouveau devoir déposé' }));
`,
    solutionExplanation: [
      'En ajoutant NotificationPush à l\'union, sans le case "push", TypeScript refuse de compiler car n dans default n\'est plus never.',
      'Dès que case "push" est codé, l\'exhaustivité est restaurée et le code compile sereinement.',
      'Sécurité de non-régression maximale.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /case\s+['"]push['"]/,
        label: 'case "push"',
        errorMessage: 'Gérez le case "push" dans le switch.'
      }
    ],
    criteria: [
      {
        id: 'c54-push',
        label: 'Prise en charge push',
        description: 'Gère les notifications push',
        passed: false,
        hint: 'Ajoutez case "push"'
      },
      {
        id: 'c54-badge',
        label: 'Formatage push',
        description: 'Affiche Push (3) : Nouveau devoir déposé',
        passed: false,
        hint: 'Affichez le badge et le message'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const hasPush = logs.some(l => l.includes('Push (3)'));
      return [
        { criterionId: 'c54-push', passed: hasPush, message: 'Le push doit être géré.' },
        { criterionId: 'c54-badge', passed: hasPush, message: 'Le message push complet doit s\'afficher.' }
      ];
    },
    isCompleted: false
  }
];
