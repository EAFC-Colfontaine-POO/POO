import { ExerciseDef } from '../models/app.models';

export const LAB2_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-2-1',
    labNumber: 2,
    number: '2.1',
    title: 'Persistance Basique avec effect()',
    subtitle: 'Synchroniser un état réactif avec une API externe du monde réel',
    sectionId: 'trio-primitives',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `1. Soit le signal 'pseudo' valant initialement 'Alexandre'.\n2. Créez un effect() qui lit pseudo() et appelle la méthode fakeStorage.sauvegarder(pseudo()).\n3. Modifiez ensuite le signal avec pseudo.set('Béatrice').\n4. L'effet doit s'exécuter automatiquement à chaque changement !`,
    hint: `effect(() => { fakeStorage.sauvegarder(pseudo()); }); Un effet lit le signal et interagit avec le monde extérieur.`,
    initialCode: `// Exercice 2.1 — Persistance Basique avec effect()
const fakeStorage = {
  derniereSauvegarde: '',
  sauvegarder(val: string) {
    this.derniereSauvegarde = val;
    console.log('[Storage] Sauvegarde de :', val);
  }
};

const pseudo = signal<string>('Alexandre');

// TODO: 1. Déclarer un effect() qui sauvegarde la valeur de pseudo()


// TODO: 2. Changer le pseudo pour 'Béatrice' avec .set('Béatrice')
`,
    solutionCode: `// Exercice 2.1 — Solution officielle
const fakeStorage = {
  derniereSauvegarde: '',
  sauvegarder(val: string) {
    this.derniereSauvegarde = val;
    console.log('[Storage] Sauvegarde de :', val);
  }
};

const pseudo = signal<string>('Alexandre');

// Effet de bord synchronisant l'état vers le monde extérieur :
effect(() => {
  fakeStorage.sauvegarder(pseudo());
});

// Déclenche immédiatement une nouvelle exécution de l'effet :
pseudo.set('Béatrice');`,
    solutionExplanation: [
      "effect() exécute son callback immédiatement une première fois, puis à chaque fois qu'un signal lu à l'intérieur change.",
      "C'est l'outil idoine pour synchroniser avec localStorage, document.title, ou une API analytique.",
      "Ne jamais l'utiliser pour calculer une donnée qui doit s'afficher dans Angular : utilisez computed() pour cela !"
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /effect\s*\(\s*\(\)\s*=>/,
        label: 'Appel de effect()',
        errorMessage: "Vous devez déclarer un effect(() => { ... })."
      },
      {
        type: 'regex',
        pattern: /fakeStorage\.sauvegarder\s*\(\s*pseudo\s*\(\s*\)\s*\)/,
        label: 'Sauvegarde de pseudo()',
        errorMessage: "L'effet doit appeler fakeStorage.sauvegarder(pseudo())."
      },
      {
        type: 'regex',
        pattern: /pseudo\.set\s*\(\s*['"]Béatrice['"]\s*\)/,
        label: "Mise à jour à 'Béatrice'",
        errorMessage: "Vous devez modifier le signal avec pseudo.set('Béatrice')."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const st = sandbox.fakeStorage;
      const ps = sandbox.pseudo;

      const isSignal = typeof ps === 'function';
      const storageHasBeat = st && st.derniereSauvegarde === 'Béatrice';

      results.push({
        criterionId: 'c-2-1-1',
        passed: isSignal && storageHasBeat,
        message: storageHasBeat ? undefined : "fakeStorage.derniereSauvegarde doit contenir 'Béatrice'."
      });

      const loggedAlex = logs.some(l => l.includes('Alexandre'));
      const loggedBeat = logs.some(l => l.includes('Béatrice'));

      results.push({
        criterionId: 'c-2-1-2',
        passed: loggedAlex && loggedBeat,
        message: loggedAlex && loggedBeat ? undefined : "Les deux sauvegardes ('Alexandre' puis 'Béatrice') doivent être visibles dans les logs."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-2-1-1',
        label: 'Synchronisation par effet',
        description: "fakeStorage reçoit automatiquement la mise à jour 'Béatrice'.",
        passed: false,
        hint: "effect(() => fakeStorage.sauvegarder(pseudo())); pseudo.set('Béatrice');"
      },
      {
        id: 'c-2-1-2',
        label: 'Traces d\'audit',
        description: "Les logs confirment la synchronisation successive.",
        passed: false,
        hint: "Observer les messages de console loggués par fakeStorage."
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-2-2',
    labNumber: 2,
    number: '2.2',
    title: 'Résolution d\'Anti-Pattern (NG0600)',
    subtitle: 'Remplacer une tentative d\'écriture dans un effect() par un computed() pur',
    sectionId: 'trio-primitives',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `Un développeur débutant a écrit un effect() qui tente d'appeler total.set(quantite() * prixUnitaire()).\nSous Angular 22, cela déclenche l'erreur fatale NG0600 (Writing to signals is forbidden in effects) !\n1. Supprimez l'effet fautif et le signal 'total'.\n2. Déclarez 'totalPropre' avec computed() calculant quantite() * prixUnitaire().\n3. Affichez la valeur de totalPropre() dans la console.`,
    hint: `Règle d'or : si vous voulez produire une valeur dérivée, n'écrivez JAMAIS dans un signal avec effect() ! Utilisez un computed().`,
    initialCode: `// Exercice 2.2 — Résolution d'Anti-Pattern
const quantite = signal<number>(3);
const prixUnitaire = signal<number>(25);

// ❌ CODE ANTI-PATTERN INTERDIT PAR ANGULAR (à remplacer !) :
// const total = signal<number>(0);
// effect(() => {
//   total.set(quantite() * prixUnitaire()); // NG0600: Écriture interdite !
// });

// TODO: Déclarer 'totalPropre' avec computed()


// TODO: Afficher avec console.log(totalPropre())
`,
    solutionCode: `// Exercice 2.2 — Solution officielle
const quantite = signal<number>(3);
const prixUnitaire = signal<number>(25);

// ✅ Bonne pratique : dérivation pure sans effet secondaire
const totalPropre = computed(() => quantite() * prixUnitaire());

console.log(totalPropre()); // 75`,
    solutionExplanation: [
      "Angular interdit l'écriture dans un signal depuis un effet pour éviter les boucles infinies de notification.",
      "computed() calcule l'état dérivé de façon déclarative, paresseuse et sans plomberie manuelle.",
      "Le résultat 75 est mémorisé tant que ni quantite ni prixUnitaire ne changent."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /totalPropre\s*=\s*computed\s*\(/,
        label: 'Création de totalPropre avec computed',
        errorMessage: "Vous devez déclarer 'totalPropre' avec computed()."
      },
      {
        type: 'forbidden',
        pattern: /total\.set\s*\(/,
        label: 'Interdiction de total.set()',
        errorMessage: "Vous ne devez pas utiliser total.set() : c'est l'anti-pattern NG0600 !"
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const tp = sandbox.totalPropre;

      const isComputed = typeof tp === 'function';
      const hasValue75 = isComputed && tp() === 75;

      results.push({
        criterionId: 'c-2-2-1',
        passed: hasValue75,
        message: hasValue75 ? undefined : "totalPropre() doit être un computed valant 75 (3 * 25)."
      });

      const logged75 = logs.some(l => l.includes('75'));
      results.push({
        criterionId: 'c-2-2-2',
        passed: logged75,
        message: logged75 ? undefined : "console.log(totalPropre()) doit afficher 75."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-2-2-1',
        label: 'Remplacement propre par computed',
        description: "L'état dérivé est exprimé sous forme de computed() pur.",
        passed: false,
        hint: "const totalPropre = computed(() => quantite() * prixUnitaire());"
      },
      {
        id: 'c-2-2-2',
        label: 'Sortie console conforme',
        description: "La valeur 75 est imprimée.",
        passed: false,
        hint: "console.log(totalPropre());"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-2-3',
    labNumber: 2,
    number: '2.3',
    title: 'Nettoyage des Ressources avec onCleanup',
    subtitle: 'Éviter les fuites de mémoire lors du changement de cycle d\'un effet',
    sectionId: 'trio-primitives',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `1. Soit un signal 'intervalleMs' valant 1000 au départ.\n2. Écrivez un effect((onCleanup) => { ... }) qui démarre un timer avec setInterval().\n3. Enregistrez dans onCleanup(() => clearInterval(timer)) la destruction du timer.\n4. Logguez '[Timer] Démarrage' et '[Timer] Nettoyage' pour prouver la libération de ressource.`,
    hint: `effect((onCleanup) => { const t = setInterval(...); onCleanup(() => clearInterval(t)); });`,
    initialCode: `// Exercice 2.3 — Libération avec onCleanup
const intervalleMs = signal<number>(1000);

// TODO: Configurer l'effect avec le callback de nettoyage onCleanup
effect((onCleanup) => {
  const ms = intervalleMs();
  console.log('[Timer] Démarrage intervalle de', ms, 'ms');
  
  const timer = setInterval(() => {
    // Tâche récurrente
  }, ms);

  // TODO: Enregistrer la fonction de nettoyage avec onCleanup(...)
  
});

// Modification de l'intervalle :
intervalleMs.set(500);
`,
    solutionCode: `// Exercice 2.3 — Solution officielle
const intervalleMs = signal<number>(1000);

effect((onCleanup) => {
  const ms = intervalleMs();
  console.log('[Timer] Démarrage intervalle de', ms, 'ms');

  const timer = setInterval(() => {}, ms);

  // Nettoyage impératif avant la prochaine ré-exécution :
  onCleanup(() => {
    clearInterval(timer);
    console.log('[Timer] Nettoyage de l\\'ancien timer');
  });
});

intervalleMs.set(500);`,
    solutionExplanation: [
      "onCleanup() est invoqué juste avant que l'effet ne se ré-exécute avec la nouvelle valeur, ainsi qu'à la destruction du composant.",
      "Sans cela, chaque modification de intervalleMs accumulerait un nouveau setInterval() fantôme qui tournerait indéfiniment en arrière-plan.",
      "C'est la garantie absolue contre les fuites de mémoire (Memory Leaks)."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /effect\s*\(\s*\(\s*onCleanup\s*\)\s*=>/,
        label: 'Paramètre onCleanup',
        errorMessage: "L'effet doit recevoir le paramètre 'onCleanup'."
      },
      {
        type: 'regex',
        pattern: /onCleanup\s*\(\s*\(\)\s*=>/,
        label: 'Enregistrement du nettoyage',
        errorMessage: "Vous devez invoquer onCleanup(() => { clearInterval(timer); ... })."
      },
      {
        type: 'regex',
        pattern: /clearInterval\s*\(/,
        label: 'Appel de clearInterval',
        errorMessage: "Vous devez libérer le timer avec clearInterval()."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];

      const loggedDemarrage = logs.some(l => l.includes('[Timer] Démarrage'));
      const loggedNettoyage = logs.some(l => l.includes('[Timer] Nettoyage'));

      results.push({
        criterionId: 'c-2-3-1',
        passed: loggedDemarrage,
        message: loggedDemarrage ? undefined : "Le message de démarrage du timer doit être journalisé."
      });

      results.push({
        criterionId: 'c-2-3-2',
        passed: loggedNettoyage,
        message: loggedNettoyage ? undefined : "Le callback onCleanup doit avoir journalisé le nettoyage."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-2-3-1',
        label: 'Démarrage du timer',
        description: "Le timer externe est initialisé dans l'effet.",
        passed: false,
        hint: "console.log('[Timer] Démarrage intervalle de', ms, 'ms');"
      },
      {
        id: 'c-2-3-2',
        label: 'Exécution du callback onCleanup',
        description: "L'ancien timer est détruit lors du passage à 500ms.",
        passed: false,
        hint: "onCleanup(() => { clearInterval(timer); console.log('[Timer] Nettoyage...'); });"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-2-4',
    labNumber: 2,
    number: '2.4',
    title: 'Respect du Contexte d\'Injection (NG0203)',
    subtitle: 'Placer l\'effet dans le constructeur de la classe pour bénéficier de l\'injection',
    sectionId: 'trio-primitives',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Un étudiant a placé un effect() dans une méthode 'sauvegarderOnClick()'. Angular lève l'exception fatale NG0203 (effect() can only be used within an injection context) !\n1. Déplacez l'appel de effect() à l'intérieur du constructor() de la classe MoniteurComponent.\n2. Laissez la méthode 'sauvegarderOnClick()' mettre simplement à jour le signal avec un incrément.\n3. Instanciez 'const moniteur = new MoniteurComponent();' et appelez 'moniteur.sauvegarderOnClick();'.`,
    hint: `Le constructeur fait partie du contexte d'injection d'Angular, ce qui permet à l'effet de s'accrocher au cycle de vie de l'instance et de se détruire proprement !`,
    initialCode: `// Exercice 2.4 — Contexte d'Injection
class MoniteurComponent {
  public clics = signal<number>(0);

  // ❌ ERREUR DU COLLÈGUE : effect() dans une méthode ordinaire !
  sauvegarderOnClick(): void {
    // effect(() => { ... }); // 💥 NG0203 !
    // TODO: Mettre à jour this.clics avec .update(n => n + 1)
  }

  // TODO: Déplacer l'effect() dans le constructor()
  constructor() {
    
  }
}

// TODO: Instancier et appeler la méthode
`,
    solutionCode: `// Exercice 2.4 — Solution officielle
class MoniteurComponent {
  public clics = signal<number>(0);

  constructor() {
    // ✅ Déclaration dans le contexte d'injection légitime :
    effect(() => {
      console.log('[Audit] Nombre de clics enregistrés :', this.clics());
    });
  }

  // Méthode ordinaire : modifie simplement le signal
  sauvegarderOnClick(): void {
    this.clics.update(n => n + 1);
  }
}

const moniteur = new MoniteurComponent();
moniteur.sauvegarderOnClick();`,
    solutionExplanation: [
      "effect() a impérativement besoin d'un InjectionContext pour savoir à quel composant il est rattaché.",
      "Seuls le constructor() et les initialisations directes de champs de classe possèdent ce contexte.",
      "Une méthode appelée plus tard (comme un clic de bouton) n'a plus ce contexte d'injection."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /constructor\s*\([^)]*\)\s*\{[\s\S]*effect\s*\(/,
        label: 'effect() dans le constructeur',
        errorMessage: "L'appel de effect() doit impérativement se situer dans le constructor() !"
      },
      {
        type: 'regex',
        pattern: /this\.clics\.update\s*\(/,
        label: 'Mise à jour du signal dans la méthode',
        errorMessage: "La méthode sauvegarderOnClick() doit appeler this.clics.update()."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const Moniteur = sandbox.MoniteurComponent;

      const isClass = typeof Moniteur === 'function';
      let instanceWorks = false;

      if (isClass) {
        try {
          const inst = new Moniteur();
          if (inst.clics() === 0) {
            inst.sauvegarderOnClick();
            if (inst.clics() === 1) instanceWorks = true;
          }
        } catch (e) {}
      }

      results.push({
        criterionId: 'c-2-4-1',
        passed: instanceWorks,
        message: instanceWorks ? undefined : "La classe MoniteurComponent doit initialiser l'effet dans son constructeur et incrémenter le signal via sa méthode."
      });

      const loggedAudit = logs.some(l => l.includes('[Audit] Nombre de clics enregistrés'));
      results.push({
        criterionId: 'c-2-4-2',
        passed: loggedAudit,
        message: loggedAudit ? undefined : "L'effet doit afficher le journal d'audit dans la console."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-2-4-1',
        label: 'Architecture de classe valide',
        description: "L'effet réside dans le constructeur et la méthode mute le signal.",
        passed: false,
        hint: "Placer effect(() => ...) dans constructor() {}"
      },
      {
        id: 'c-2-4-2',
        label: 'Journalisation réactive',
        description: "Le log d'audit s'affiche suite à l'appel de méthode.",
        passed: false,
        hint: "moniteur.sauvegarderOnClick() déclenche l'affichage du log."
      }
    ],
    isCompleted: false
  }
];
