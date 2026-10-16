import { ExerciseDef } from '../models/app.models';

export const LAB5_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-5-1',
    labNumber: 5,
    number: '5.1',
    title: 'Réveiller un Signal Figé',
    subtitle: 'Remplacer la mutation en place par une nouvelle référence mémoire',
    sectionId: 'angular-signals-memory',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Soit un signal Angular profil contenant { nom: "Alice", age: 25 }. La méthode anniversaire() mute profil() en place (p.age++) puis fait profil.set(p), ce qui conserve l\'adresse 0x10A : Angular ignore la mise à jour car Object.is(0x10A, 0x10A) est true ! Corrigez la méthode pour utiliser profil.update(p => ({ ...p, age: p.age + 1 })) afin de transmettre une nouvelle référence.',
    hint: 'Remplacez la mutation directe par profil.update(p => ({ ...p, age: p.age + 1 }));',
    initialCode: `// Mock signal Angular
const profil = signal({ nom: 'Alice', age: 25 });

function anniversaire(): void {
  // ⚠️ BUG : mutation en place, même référence 0x10A !
  const p = profil();
  p.age++;
  profil.set(p); // Angular ne détecte aucun changement !
}

anniversaire();

console.log("Âge actuel :", profil().age);
`,
    solutionCode: `const profil = signal({ nom: 'Alice', age: 25 });

function anniversaire(): void {
  profil.update(p => ({ ...p, age: p.age + 1 }));
}

anniversaire();

console.log("Âge actuel :", profil().age);
`,
    solutionExplanation: [
      'Angular Signals utilise par défaut Object.is(precedent, suivant) pour comparer l\'état.',
      'Si vous renvoyez la même référence mémoire, Angular suppose qu\'aucun changement n\'a eu lieu.',
      'En utilisant le spread operator dans .update(), vous produisez une nouvelle adresse (0x20B), réveillant le signal et actualisant le DOM.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /profil\.update\s*\(/,
        label: 'Appel profil.update(...)',
        errorMessage: 'Utilisez la méthode réactive profil.update(...).'
      },
      {
        type: 'keyword',
        pattern: /\{\s*\.\.\.[A-Za-z0-9_]+\s*,/,
        label: 'Nouveau littéral d\'objet { ...p, ... }',
        errorMessage: 'Produisez un nouvel objet avec le spread operator (ex: { ...p, age: p.age + 1 }).'
      }
    ],
    criteria: [
      {
        id: 'c1-update-signal',
        label: 'Mise à jour via profil.update',
        description: 'La méthode utilise .update() avec un nouveau conteneur',
        passed: false,
        hint: 'profil.update(p => ({ ...p, age: p.age + 1 }))'
      },
      {
        id: 'c1-age-inc',
        label: 'Incrémentation validée',
        description: 'L\'âge passe de 25 à 26',
        passed: false,
        hint: 'profil().age doit valoir 26'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const p = sandbox.profil;
      if (!p) {
        return [
          { criterionId: 'c1-update-signal', passed: false, message: 'Le signal profil doit être déclaré.' },
          { criterionId: 'c1-age-inc', passed: false }
        ];
      }

      const val = p();
      const ageOk = val && val.age === 26;

      return [
        { criterionId: 'c1-update-signal', passed: true },
        { criterionId: 'c1-age-inc', passed: ageOk, message: 'L\'âge doit avoir été incrémenté à 26 avec une nouvelle référence.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-5-2',
    labNumber: 5,
    number: '5.2',
    title: 'Mise à jour Immuable d\'une Liste dans un Signal',
    subtitle: 'Associer .update() et .map() pour transformer une collection d\'objets',
    sectionId: 'angular-signals-memory',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Soit taches = signal([{ id: 1, titre: "Coder", terminee: false }, { id: 2, titre: "Tester", terminee: false }]). Implémentez la fonction terminerTache(id: number): void. Elle doit utiliser taches.update(...) combiné avec .map(...) pour retourner un nouveau tableau où l\'élément ciblé est dupliqué avec terminee: true ({ ...t, terminee: true }).',
    hint: 'taches.update(liste => liste.map(t => t.id === id ? { ...t, terminee: true } : t));',
    initialCode: `interface Tache {
  id: number;
  titre: string;
  terminee: boolean;
}

const taches = signal<Tache[]>([
  { id: 1, titre: 'Coder', terminee: false },
  { id: 2, titre: 'Tester', terminee: false }
]);

function terminerTache(id: number): void {
  // TODO: Mettez à jour le signal avec .update() et .map() de façon immuable
}

terminerTache(1);

console.log("Tâche 1 terminée ?", taches()[0].terminee); // Doit afficher true
console.log("Tâche 2 terminée ?", taches()[1].terminee); // Doit rester false
`,
    solutionCode: `interface Tache {
  id: number;
  titre: string;
  terminee: boolean;
}

const taches = signal<Tache[]>([
  { id: 1, titre: 'Coder', terminee: false },
  { id: 2, titre: 'Tester', terminee: false }
]);

function terminerTache(id: number): void {
  taches.update(liste => liste.map(t => t.id === id ? { ...t, terminee: true } : t));
}

terminerTache(1);

console.log("Tâche 1 terminée ?", taches()[0].terminee);
console.log("Tâche 2 terminée ?", taches()[1].terminee);
`,
    solutionExplanation: [
      'La méthode .map() retourne toujours un NOUVEAU tableau sans altérer l\'original.',
      'L\'opérateur ternaire cible uniquement l\'élément recherché et crée une nouvelle copie { ...t, terminee: true }.',
      'Les autres éléments non concernés conservent leur référence pour optimiser les performances.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /taches\.update\s*\(/,
        label: 'Appel taches.update(...)',
        errorMessage: 'Mettez à jour la liste via taches.update(...).'
      },
      {
        type: 'keyword',
        pattern: /\.map\s*\(/,
        label: 'Usage de .map(...)',
        errorMessage: 'Utilisez .map(...) pour transformer la liste de manière fonctionnelle.'
      }
    ],
    criteria: [
      {
        id: 'c2-map-update',
        label: 'Mise à jour fonctionnelle',
        description: 'Utilisation de .update() et .map()',
        passed: false,
        hint: 'taches.update(liste => liste.map(...))'
      },
      {
        id: 'c2-task-state',
        label: 'État des tâches validé',
        description: 'La tâche 1 est terminée et la tâche 2 est inchangée',
        passed: false,
        hint: 'taches()[0].terminee === true et taches()[1].terminee === false'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const taches = sandbox.taches;
      if (!taches) {
        return [
          { criterionId: 'c2-map-update', passed: false, message: 'Le signal taches doit être défini.' },
          { criterionId: 'c2-task-state', passed: false }
        ];
      }

      const list = taches();
      const okT1 = list && list[0] && list[0].terminee === true;
      const okT2 = list && list[1] && list[1].terminee === false;

      return [
        { criterionId: 'c2-map-update', passed: true },
        { criterionId: 'c2-task-state', passed: okT1 && okT2, message: 'La tâche ciblée doit être marquée terminée sans affecter les autres.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-5-3',
    labNumber: 5,
    number: '5.3',
    title: 'Méthode de Copie Fonctionnelle sur Classe Métier',
    subtitle: 'Implémenter avecNouveauPrix() pour réveiller un signal de composant',
    sectionId: 'angular-signals-memory',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: '1. Dans la classe Article(id: number, nom: string, prix: number), implémentez la méthode avecNouveauPrix(nouveauPrix: number): Article qui retourne une nouvelle instance de Article (new Article(this.id, this.nom, nouveauPrix)). 2. Complétez la fonction appliquerRemise(remisePourcent: number) pour mettre à jour articleSignal avec un nouveau prix calculé à l\'aide de cette méthode.',
    hint: 'avecNouveauPrix(nouveauPrix: number): Article { return new Article(this.id, this.nom, nouveauPrix); } et articleSignal.update(a => a.avecNouveauPrix(nouveauPrix));',
    initialCode: `class Article {
  constructor(
    public readonly id: number,
    public readonly nom: string,
    public readonly prix: number
  ) {}

  // TODO: 1. Implémentez avecNouveauPrix(nouveauPrix: number): Article
  avecNouveauPrix(nouveauPrix: number): Article {
    return this; // ⚠️ À remplacer par new Article(...)
  }
}

const articleSignal = signal(new Article(42, 'Casque Audio', 100));

function appliquerRemise(taux: number): void {
  // TODO: 2. Calculez nouveauPrix = articleSignal().prix * (1 - taux)
  // et mettez à jour articleSignal avec avecNouveauPrix()
}

appliquerRemise(0.3); // 30% de remise

console.log("Nouveau prix :", articleSignal().prix); // Doit valoir 70
`,
    solutionCode: `class Article {
  constructor(
    public readonly id: number,
    public readonly nom: string,
    public readonly prix: number
  ) {}

  avecNouveauPrix(nouveauPrix: number): Article {
    return new Article(this.id, this.nom, nouveauPrix);
  }
}

const articleSignal = signal(new Article(42, 'Casque Audio', 100));

function appliquerRemise(taux: number): void {
  const prixActuel = articleSignal().prix;
  const nouveauPrix = prixActuel * (1 - taux);
  articleSignal.update(a => a.avecNouveauPrix(nouveauPrix));
}

appliquerRemise(0.3);

console.log("Nouveau prix :", articleSignal().prix);
`,
    solutionExplanation: [
      'Le modèle métier POO est 100% immuable grâce à readonly sur tous ses attributs.',
      'avecNouveauPrix() crée une nouvelle instance sans effet de bord sur l\'ancienne.',
      'Transmise à articleSignal.update(), la nouvelle adresse 0x20B réveille instantanément la détection de changements Angular.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /new\s+Article\s*\(/,
        label: 'Instanciation new Article(...)',
        errorMessage: 'Retournez une nouvelle instance new Article(this.id, this.nom, nouveauPrix).'
      },
      {
        type: 'keyword',
        pattern: /\.avecNouveauPrix\s*\(/,
        label: 'Appel à .avecNouveauPrix(...)',
        errorMessage: 'Utilisez .avecNouveauPrix(...) pour actualiser l\'article.'
      }
    ],
    criteria: [
      {
        id: 'c3-functional-copy',
        label: 'Méthode avecNouveauPrix conforme',
        description: 'Retourne une nouvelle instance de Article',
        passed: false,
        hint: 'return new Article(this.id, this.nom, nouveauPrix);'
      },
      {
        id: 'c3-signal-update',
        label: 'Signal actualisé à 70 €',
        description: 'articleSignal().prix vaut 70',
        passed: false,
        hint: 'Vérifiez la mise à jour du signal avec remise de 30%'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Article = sandbox.Article;
      const articleSignal = sandbox.articleSignal;

      if (!Article || !articleSignal) {
        return [
          { criterionId: 'c3-functional-copy', passed: false, message: 'La classe Article et le signal doivent être définis.' },
          { criterionId: 'c3-signal-update', passed: false }
        ];
      }

      const art = new Article(1, 'Test', 50);
      const art2 = art.avecNouveauPrix(40);
      const isNewInst = art2 && art2 instanceof Article && art2 !== art && art2.prix === 40;

      const currentSignalVal = articleSignal();
      const signalOk = currentSignalVal && Math.round(currentSignalVal.prix) === 70;

      return [
        { criterionId: 'c3-functional-copy', passed: !!isNewInst, message: 'avecNouveauPrix doit retourner une nouvelle instance.' },
        { criterionId: 'c3-signal-update', passed: signalOk, message: 'Le signal doit contenir l\'article à 70 €.' }
      ];
    },
    isCompleted: false
  },
  {
    id: 'ex-5-4',
    labNumber: 5,
    number: '5.4',
    title: 'Remplacement d\'Entité avec equals() dans un Signal',
    subtitle: 'Localiser et remplacer un élément d\'un catalogue grâce à son contrat d\'égalité',
    sectionId: 'angular-signals-memory',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: 'Soit catalogue = signal<Article[]>([new Article(1, "Bureau", 200), new Article(2, "Chaise", 80)]). Écrivez la fonction remplacerArticle(maj: Article): void. Elle doit mettre à jour le catalogue via catalogue.update(...) en remplaçant l\'article dont item.equals(maj) est true par la nouvelle version maj, tout en conservant les autres.',
    hint: 'catalogue.update(items => items.map(item => item.equals(maj) ? maj : item));',
    initialCode: `class Article {
  constructor(
    public readonly id: number,
    public readonly nom: string,
    public readonly prix: number
  ) {}

  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof Article)) return false;
    return this.id === autre.id;
  }
}

const catalogue = signal<Article[]>([
  new Article(1, 'Bureau Ergonomique', 250),
  new Article(2, 'Chaise Gaming', 120)
]);

function remplacerArticle(maj: Article): void {
  // TODO: Utilisez catalogue.update() et .map() avec item.equals(maj)
}

// Remplacement du bureau (id 1) avec un prix promotionnel de 199 €
remplacerArticle(new Article(1, 'Bureau Ergonomique Pro', 199));

console.log("Nouveau prix bureau :", catalogue()[0].prix); // 199
console.log("Nouveau nom bureau :", catalogue()[0].nom);   // 'Bureau Ergonomique Pro'
console.log("Prix chaise intact :", catalogue()[1].prix);  // 120
`,
    solutionCode: `class Article {
  constructor(
    public readonly id: number,
    public readonly nom: string,
    public readonly prix: number
  ) {}

  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof Article)) return false;
    return this.id === autre.id;
  }
}

const catalogue = signal<Article[]>([
  new Article(1, 'Bureau Ergonomique', 250),
  new Article(2, 'Chaise Gaming', 120)
]);

function remplacerArticle(maj: Article): void {
  catalogue.update(items => items.map(item => item.equals(maj) ? maj : item));
}

remplacerArticle(new Article(1, 'Bureau Ergonomique Pro', 199));

console.log("Nouveau prix bureau :", catalogue()[0].prix);
console.log("Nouveau nom bureau :", catalogue()[0].nom);
console.log("Prix chaise intact :", catalogue()[1].prix);
`,
    solutionExplanation: [
      'Cette fonction synthétise toute la séance 12 :',
      '1. L\'égalité métier equals() permet de retrouver l\'entité logique par son identifiant unique (id=1).',
      '2. La réactivité fine d\'Angular est assurée en produisant un nouveau tableau et une nouvelle référence d\'article.',
      '3. Les composants abonnés au catalogue se rafraîchissent immédiatement sans effet de bord.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /catalogue\.update\s*\(/,
        label: 'Appel catalogue.update(...)',
        errorMessage: 'Actualisez le signal via catalogue.update(...).'
      },
      {
        type: 'keyword',
        pattern: /\.equals\s*\(/,
        label: 'Utilisation de .equals(...)',
        errorMessage: 'Localisez l\'article cible en appelant item.equals(maj).'
      }
    ],
    criteria: [
      {
        id: 'c4-equals-replace',
        label: 'Recherche sémantique par equals()',
        description: 'Le remplacement s\'appuie sur item.equals(maj)',
        passed: false,
        hint: 'items.map(item => item.equals(maj) ? maj : item)'
      },
      {
        id: 'c4-catalog-state',
        label: 'Catalogue mis à jour avec exactitude',
        description: 'Le bureau a son nouveau prix de 199 € et la chaise est inchangée à 120 €',
        passed: false,
        hint: 'catalogue()[0].prix === 199 et catalogue()[1].prix === 120'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const Article = sandbox.Article;
      const catalogue = sandbox.catalogue;
      const remplacerArticle = sandbox.remplacerArticle;

      if (!Article || !catalogue || typeof remplacerArticle !== 'function') {
        return [
          { criterionId: 'c4-equals-replace', passed: false, message: 'La fonction remplacerArticle et le signal catalogue doivent être définis.' },
          { criterionId: 'c4-catalog-state', passed: false }
        ];
      }

      const list = catalogue();
      const okBureau = list && list[0] && list[0].prix === 199 && list[0].nom === 'Bureau Ergonomique Pro';
      const okChaise = list && list[1] && list[1].prix === 120;

      let replaceTestedOk = false;
      try {
        remplacerArticle(new Article(2, 'Chaise Gaming RGB', 150));
        const listAfter = catalogue();
        replaceTestedOk = !!(listAfter && listAfter[1] && listAfter[1].prix === 150 && listAfter[1].nom === 'Chaise Gaming RGB');
      } catch (e) {
        replaceTestedOk = false;
      }

      return [
        { criterionId: 'c4-equals-replace', passed: replaceTestedOk, message: 'remplacerArticle doit trouver l\'article via equals et actualiser le catalogue.' },
        { criterionId: 'c4-catalog-state', passed: okBureau && okChaise, message: 'L\'article id 1 doit être mis à jour et l\'article id 2 préservé.' }
      ];
    },
    isCompleted: false
  }
];
