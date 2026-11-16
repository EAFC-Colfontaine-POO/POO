import { Exercise } from '../models/app.models';

export const EXERCISES_REGISTRY: Omit<Exercise, 'currentCode'>[] = [
  // =========================================================================
  // LABO 1 : Création de Base & Clés Primaires (4 exercices)
  // =========================================================================
  {
    id: 'ex-1-1',
    labNumber: 1,
    number: '1.1',
    title: 'Héritage Dexie & Table Typée',
    subtitle: 'Créer une classe étendant Dexie et déclarer une table typée',
    sectionId: 'typed-database',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Créez une classe `TodoDB` héritant de `Dexie` (S06). Déclarez-y la propriété `taches!: Table<TacheDTO, string>` et appelez `super("TodoDB")` dans son constructeur.',
    hint: 'Déclarez `class TodoDB extends Dexie { taches!: Table<TacheDTO, string>; constructor() { super("TodoDB"); } }`.',
    initialCode: `// 1. Déclarez la classe TodoDB qui hérite de Dexie :
class TodoDB extends Dexie {
  // Déclarez la table taches typée avec Table<TacheDTO, string> :

  constructor() {
    // Appelez le constructeur parent avec le nom de la base :
  }
}

// Tests :
const db = new TodoDB();
console.log("Nom de la base :", db.name);
console.log("Instance Dexie valide :", db instanceof Dexie);
`,
    solutionCode: `class TodoDB extends Dexie {
  taches!: Table<TacheDTO, string>;

  constructor() {
    super("TodoDB");
  }
}

const db = new TodoDB();
console.log("Nom de la base :", db.name);
console.log("Instance Dexie valide :", db instanceof Dexie);
`,
    isCompleted: false,
    solutionExplanation: [
      'Dexie s\'utilise élégamment par héritage de classe en TypeScript (principe POO de spécialisation S06).',
      'La propriété `taches!: Table<TacheDTO, string>` informe le compilateur du type des entités et de la clé.',
      'L\'appel `super("NomDB")` initialise la base IndexedDB sous-jacente.'
    ],
    criteria: [
      {
        id: 'c1-1-extends',
        label: 'Héritage de Dexie',
        description: 'La classe TodoDB doit hériter de Dexie via le mot-clé extends.',
        passed: false,
        hint: 'Utilisez `class TodoDB extends Dexie`'
      },
      {
        id: 'c1-1-prop',
        label: 'Déclaration de Table typée',
        description: 'Déclarer la propriété taches typée avec Table<TacheDTO, string>.',
        passed: false,
        hint: 'Ajoutez `taches!: Table<TacheDTO, string>;` dans la classe'
      },
      {
        id: 'c1-1-super',
        label: 'Appel super("TodoDB")',
        description: 'Le constructeur doit invoquer super avec le nom "TodoDB".',
        passed: false,
        hint: 'Appelez `super("TodoDB");`'
      },
      {
        id: 'c1-1-exec',
        label: 'Exécution réussie',
        description: 'La console affiche le nom TodoDB et confirme que l\'instance est valide.',
        passed: false,
        hint: 'Vérifiez la console virtuelle'
      }
    ]
  },
  {
    id: 'ex-1-2',
    labNumber: 1,
    number: '1.2',
    title: 'Schéma Minimal (Règle d\'Or)',
    subtitle: 'Ne lister dans stores() que les index de recherche',
    sectionId: 'typed-database',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Configurez `this.version(1).stores(...)` dans `TodoDB` pour indexer uniquement la clé primaire `id` et le critère de recherche `priorite`. Règle d\'or : ne PAS indexer `description` (l\'objet complet est quand même stocké sur le disque) !',
    hint: 'Utilisez `this.version(1).stores({ taches: "id, priorite" });`.',
    initialCode: `class TodoDB extends Dexie {
  taches!: Table<TacheDTO, string>;

  constructor() {
    super("TodoDB_" + crypto.randomUUID());
    // Configurez le schéma v1 ici (uniquement id et priorite) :
  }
}

// Tests :
const db = new TodoDB();
await db.open();
await db.taches.add({
  id: "t1",
  titre: "Faire le labo",
  priorite: "HAUTE",
  description: "Texte volumineux qui n'a pas besoin d'index"
});
const t = await db.taches.get("t1");
console.log("Tâche lue :", t?.titre, "| Priorité :", t?.priorite);
console.log("Description intacte sur disque :", t?.description !== undefined);
await db.delete();
`,
    solutionCode: `class TodoDB extends Dexie {
  taches!: Table<TacheDTO, string>;

  constructor() {
    super("TodoDB_" + crypto.randomUUID());
    this.version(1).stores({
      taches: "id, priorite"
    });
  }
}

const db = new TodoDB();
await db.open();
await db.taches.add({
  id: "t1",
  titre: "Faire le labo",
  priorite: "HAUTE",
  description: "Texte volumineux qui n'a pas besoin d'index"
});
const t = await db.taches.get("t1");
console.log("Tâche lue :", t?.titre, "| Priorité :", t?.priorite);
console.log("Description intacte sur disque :", t?.description !== undefined);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Dans Dexie, `.stores()` NE définit PAS les colonnes comme en SQL.',
      'Il ne liste QUE les index de recherche B-Tree nécessaires à `.where()`.',
      'Tous les autres champs (comme description) sont intégralement stockés sur disque sans surcoût d\'indexation.'
    ],
    criteria: [
      {
        id: 'c1-2-version',
        label: 'Déclaration version(1)',
        description: 'Le constructeur doit invoquer this.version(1).stores(...).',
        passed: false,
        hint: 'Appelez `this.version(1).stores(...)`'
      },
      {
        id: 'c1-2-indexes',
        label: 'Index minimaux (Règle d\'or)',
        description: 'Définir "id, priorite" sans inclure description dans les index.',
        passed: false,
        hint: 'La table taches doit avoir `"id, priorite"` et non pas description'
      },
      {
        id: 'c1-2-exec',
        label: 'Exécution & Persistance',
        description: 'La tâche est enregistrée et relue avec sa description intacte.',
        passed: false,
        hint: 'Exécutez pour valider la lecture'
      }
    ]
  },
  {
    id: 'ex-1-3',
    labNumber: 1,
    number: '1.3',
    title: 'Clé Auto-Incrémentée (++id)',
    subtitle: 'Générer automatiquement des entiers séquentiels',
    sectionId: 'typed-database',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez une base `AppLogDB extends Dexie` avec un store `logs` utilisant la clé primaire auto-incrémentée `++id` et l\'index `niveau`. Insérez un log sans spécifier d\'id et affichez la clé générée.',
    hint: 'Schéma : `logs: "++id, niveau"`. Puis `const id = await db.logs.add({ niveau: "INFO", message: "Start", dateISO: new Date().toISOString() });`.',
    initialCode: `class AppLogDB extends Dexie {
  logs!: Table<LogEntryDTO, number>;

  constructor() {
    super("AppLogDB_" + crypto.randomUUID());
    // 1. Déclarez le store logs avec clé auto-incrémentée ++id et index niveau :
  }
}

// Tests :
const db = new AppLogDB();
await db.open();
// 2. Insérez un log SANS fournir d'id et affichez la clé numérique retournée :
const cleGeneree = 0; // Remplacez par await db.logs.add(...)

console.log("Clé numérique auto-générée :", cleGeneree);
await db.delete();
`,
    solutionCode: `class AppLogDB extends Dexie {
  logs!: Table<LogEntryDTO, number>;

  constructor() {
    super("AppLogDB_" + crypto.randomUUID());
    this.version(1).stores({
      logs: "++id, niveau"
    });
  }
}

const db = new AppLogDB();
await db.open();
const cleGeneree = await db.logs.add({
  niveau: "INFO",
  message: "Application démarrée",
  dateISO: new Date().toISOString()
});
console.log("Clé numérique auto-générée :", cleGeneree);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Le préfixe `++` indique à IndexedDB de générer automatiquement un entier 1, 2, 3...',
      'Lors de l\'appel à `add()`, il est inutile de renseigner la propriété `id`.',
      'Attention : pour une synchro multi-appareils hors-ligne, UUID est préférable pour éviter les collisions.'
    ],
    criteria: [
      {
        id: 'c1-3-auto',
        label: 'Syntaxe ++id dans le schéma',
        description: 'Le schéma du store logs doit déclarer la clé primaire auto-incrémentée ++id.',
        passed: false,
        hint: 'Utilisez `"++id, niveau"`'
      },
      {
        id: 'c1-3-add',
        label: 'Insertion asynchrone sans id',
        description: 'Insérer un log via await db.logs.add(...) sans passer d\'id.',
        passed: false,
        hint: 'Appelez `await db.logs.add({ niveau: "INFO", ... })`'
      },
      {
        id: 'c1-3-exec',
        label: 'Clé générée confirmée',
        description: 'La console affiche la clé numérique 1 générée par IndexedDB.',
        passed: false,
        hint: 'Vérifiez la sortie console'
      }
    ]
  },
  {
    id: 'ex-1-4',
    labNumber: 1,
    number: '1.4',
    title: 'CRUD Asynchrone (add & get)',
    subtitle: 'Écrire et relire des entités par clé primaire avec async/await',
    sectionId: 'typed-database',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Écrivez la fonction `sauvegarderEtRelire(article: ArticleDTO): Promise<ArticleDTO | undefined>`. Insérez l\'article avec `await db.articles.add(article)` puis relisez-le par son id avec `await db.articles.get(article.id)` et retournez-le.',
    hint: 'Utilisez `await db.articles.add(article); return await db.articles.get(article.id);`.',
    initialCode: `class MagasinDB extends Dexie {
  articles!: Table<ArticleDTO, string>;
  constructor() {
    super("MagasinDB_" + crypto.randomUUID());
    this.version(1).stores({ articles: "id, categorie, prix" });
  }
}

const db = new MagasinDB();
await db.open();

// Complétez cette fonction :
async function sauvegarderEtRelire(article: ArticleDTO): Promise<ArticleDTO | undefined> {
  // 1. Sauvegardez avec db.articles.add
  // 2. Relisez avec db.articles.get et retournez l'article
  return undefined;
}

// Tests :
const art: ArticleDTO = { id: "art-42", titre: "Clavier Mécanique", prix: 89, categorie: "Informatique" };
const resultat = await sauvegarderEtRelire(art);
console.log("Article relu :", resultat?.titre, "| Prix :", resultat?.prix);
await db.delete();
`,
    solutionCode: `class MagasinDB extends Dexie {
  articles!: Table<ArticleDTO, string>;
  constructor() {
    super("MagasinDB_" + crypto.randomUUID());
    this.version(1).stores({ articles: "id, categorie, prix" });
  }
}

const db = new MagasinDB();
await db.open();

async function sauvegarderEtRelire(article: ArticleDTO): Promise<ArticleDTO | undefined> {
  await db.articles.add(article);
  return await db.articles.get(article.id);
}

const art: ArticleDTO = { id: "art-42", titre: "Clavier Mécanique", prix: 89, categorie: "Informatique" };
const resultat = await sauvegarderEtRelire(art);
console.log("Article relu :", resultat?.titre, "| Prix :", resultat?.prix);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Contrairement à LocalStorage, Dexie est 100% asynchrone et renvoie des Promises.',
      '`add()` insère l\'objet et échoue si la clé primaire existe déjà.',
      '`get(key)` effectue une recherche binaire instantanée par clé primaire en O(log n).'
    ],
    criteria: [
      {
        id: 'c1-4-add',
        label: 'Utilisation de await add(...)',
        description: 'La fonction doit appeler await db.articles.add(article).',
        passed: false,
        hint: 'Ajoutez `await db.articles.add(article);`'
      },
      {
        id: 'c1-4-get',
        label: 'Utilisation de await get(...)',
        description: 'La fonction doit relire via await db.articles.get(article.id).',
        passed: false,
        hint: 'Ajoutez `return await db.articles.get(article.id);`'
      },
      {
        id: 'c1-4-exec',
        label: 'Exécution réussie',
        description: 'L\'article Clavier Mécanique est affiché avec son prix 89.',
        passed: false,
        hint: 'Exécutez pour valider le retour'
      }
    ]
  },

  // =========================================================================
  // LABO 2 : Index Uniques, Multi-Entry & Composés (4 exercices)
  // =========================================================================
  {
    id: 'ex-2-1',
    labNumber: 2,
    number: '2.1',
    title: 'Index Unique (&) & ConstraintError',
    subtitle: 'Empêcher physiquement les doublons au niveau du disque',
    sectionId: 'btree-indexes',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Déclarez le schéma `livres: "id, &isbn, titre"`. Dans un bloc `try/catch`, tentez d\'insérer deux livres ayant le même ISBN. Capturez l\'exception et vérifiez si `err instanceof Dexie.ConstraintError`. Affichez `"ConstraintError interceptée"` dans la console.',
    hint: 'Préfixez `&isbn` dans `.stores()`. Dans le catch : `if (err instanceof Dexie.ConstraintError || err.name === "ConstraintError") { console.log("ConstraintError interceptée"); }`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    // 1. Déclarez le schéma avec l'index unique &isbn :
    this.version(1).stores({
      livres: "id, titre" // 💣 Modifiez ici pour ajouter l'index unique &isbn
    });
  }
}

const db = new BiblioDB();
await db.open();

// 2. Insérez deux livres avec le même ISBN et interceptez ConstraintError :
try {
  await db.livres.add({ id: "1", isbn: "978-2070368228", titre: "Livre A" });
  await db.livres.add({ id: "2", isbn: "978-2070368228", titre: "Livre B (Doublon)" });
} catch (err: any) {
  // Interceptez et affichez "ConstraintError interceptée" :
}

await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, &isbn, titre"
    });
  }
}

const db = new BiblioDB();
await db.open();

try {
  await db.livres.add({ id: "1", isbn: "978-2070368228", titre: "Livre A" });
  await db.livres.add({ id: "2", isbn: "978-2070368228", titre: "Livre B (Doublon)" });
} catch (err: any) {
  if (err instanceof Dexie.ConstraintError || err?.name === "ConstraintError") {
    console.log("ConstraintError interceptée : doublon refusé");
  }
}

await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Le préfixe `&` crée un index B-Tree avec contrainte d\'unicité physique dans IndexedDB.',
      'Toute tentative d\'insérer un doublon lève instantanément une `Dexie.ConstraintError`.',
      'Cela protège la cohérence de vos données métier sans avoir à faire un `get()` préalable.'
    ],
    criteria: [
      {
        id: 'c2-1-schema',
        label: 'Index unique &isbn',
        description: 'Le schéma de la table livres doit comporter &isbn.',
        passed: false,
        hint: 'Écrivez `"id, &isbn, titre"` dans stores()'
      },
      {
        id: 'c2-1-catch',
        label: 'Interception ConstraintError',
        description: 'Le code doit capturer et vérifier l\'erreur ConstraintError.',
        passed: false,
        hint: 'Vérifiez `err instanceof Dexie.ConstraintError` ou le nom de l\'erreur'
      },
      {
        id: 'c2-1-exec',
        label: 'Message de confirmation',
        description: 'La console affiche le message confirmant l\'interception du doublon.',
        passed: false,
        hint: 'Affichez le log dans le bloc catch'
      }
    ]
  },
  {
    id: 'ex-2-2',
    labNumber: 2,
    number: '2.2',
    title: 'Index Multi-Entry (*)',
    subtitle: 'Indexer chaque élément d\'un tableau pour des requêtes instantanées',
    sectionId: 'btree-indexes',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Déclarez le store `livres: "id, titre, *genres"`. Insérez 3 livres dont 2 ont le genre `"SF"` dans leur tableau `genres`. Écrivez la requête `.where("genres").equals("SF").toArray()` et affichez le nombre de livres trouvés.',
    hint: 'Préfixe `*` : `*genres`. Requête : `const sfs = await db.livres.where("genres").equals("SF").toArray();`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    // 1. Déclarez *genres :
    this.version(1).stores({
      livres: "id, titre" // Modifiez ici
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([
  { id: "1", titre: "Dune", genres: ["SF", "Roman"] },
  { id: "2", titre: "Fondation", genres: ["SF", "Espace"] },
  { id: "3", titre: "Le Hobbit", genres: ["Fantasy"] }
]);

// 2. Interrogez les livres ayant le genre "SF" :
const resultats: any[] = []; // Complétez avec .where('genres').equals('SF').toArray()

console.log("Nombre de livres SF trouvés :", resultats.length);
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre, *genres"
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([
  { id: "1", titre: "Dune", genres: ["SF", "Roman"] },
  { id: "2", titre: "Fondation", genres: ["SF", "Espace"] },
  { id: "3", titre: "Le Hobbit", genres: ["Fantasy"] }
]);

const resultats = await db.livres.where("genres").equals("SF").toArray();

console.log("Nombre de livres SF trouvés :", resultats.length);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Le préfixe `*` crée un index Multi-Entry dans IndexedDB.',
      'Chaque élément du tableau `genres` génère sa propre entrée dans l\'arbre B-Tree.',
      'La requête `.where("genres").equals("SF")` s\'exécute en 1 ms même sur 50 000 livres !'
    ],
    criteria: [
      {
        id: 'c2-2-schema',
        label: 'Index multi-entry *genres',
        description: 'Le schéma doit comporter *genres.',
        passed: false,
        hint: 'Ajoutez `*genres` dans le schéma de la table livres'
      },
      {
        id: 'c2-2-query',
        label: 'Requête where("genres").equals("SF")',
        description: 'Interroger avec .where("genres").equals("SF").toArray().',
        passed: false,
        hint: 'Appelez `await db.livres.where("genres").equals("SF").toArray()`'
      },
      {
        id: 'c2-2-exec',
        label: 'Résultats corrects',
        description: 'La console affiche exactement 2 livres SF trouvés.',
        passed: false,
        hint: 'Exécutez pour vérifier le comptage'
      }
    ]
  },
  {
    id: 'ex-2-3',
    labNumber: 2,
    number: '2.3',
    title: 'Index Composé ([a+b])',
    subtitle: 'Accélérer les requêtes combinant plusieurs critères fréquents',
    sectionId: 'btree-indexes',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Déclarez l\'index composé `[statut+priorite]` sur la table `taches`. Insérez 3 tâches et interrogez celles qui ont le statut `"EN_COURS"` et la priorité `"HAUTE"` via `.where("[statut+priorite]").equals(["EN_COURS", "HAUTE"]).toArray()`.',
    hint: 'Schéma : `taches: "id, [statut+priorite]"`. Requête : `.where("[statut+priorite]").equals(["EN_COURS", "HAUTE"]).toArray()`.',
    initialCode: `class TaskDB extends Dexie {
  taches!: Table<any, string>;
  constructor() {
    super("TaskDB_" + crypto.randomUUID());
    // 1. Déclarez l'index composé [statut+priorite] :
    this.version(1).stores({
      taches: "id"
    });
  }
}

const db = new TaskDB();
await db.open();

await db.taches.bulkAdd([
  { id: "t1", titre: "Corriger bug prod", statut: "EN_COURS", priorite: "HAUTE" },
  { id: "t2", titre: "Rédiger doc", statut: "EN_COURS", priorite: "BASSE" },
  { id: "t3", titre: "Mettre à jour Angular", statut: "A_FAIRE", priorite: "HAUTE" }
]);

// 2. Recherchez les tâches EN_COURS et HAUTE via l'index composé :
const urgentes: any[] = [];

console.log("Tâches urgentes en cours trouvées :", urgentes.length);
await db.delete();
`,
    solutionCode: `class TaskDB extends Dexie {
  taches!: Table<any, string>;
  constructor() {
    super("TaskDB_" + crypto.randomUUID());
    this.version(1).stores({
      taches: "id, [statut+priorite]"
    });
  }
}

const db = new TaskDB();
await db.open();

await db.taches.bulkAdd([
  { id: "t1", titre: "Corriger bug prod", statut: "EN_COURS", priorite: "HAUTE" },
  { id: "t2", titre: "Rédiger doc", statut: "EN_COURS", priorite: "BASSE" },
  { id: "t3", titre: "Mettre à jour Angular", statut: "A_FAIRE", priorite: "HAUTE" }
]);

const urgentes = await db.taches
  .where("[statut+priorite]")
  .equals(["EN_COURS", "HAUTE"])
  .toArray();

console.log("Tâches urgentes en cours trouvées :", urgentes.length);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Un index composé `[a+b]` crée une clé composite dans l\'arbre B-Tree.',
      'La recherche se fait en passant un tableau de valeurs `[valA, valB]`.',
      'C\'est bien plus rapide qu\'un filtrage mémoire car les deux critères sont élagués directement par le moteur d\'indexation.'
    ],
    criteria: [
      {
        id: 'c2-3-schema',
        label: 'Index composé [statut+priorite]',
        description: 'Le schéma doit comporter la syntaxe [statut+priorite].',
        passed: false,
        hint: 'Ajoutez `[statut+priorite]` dans stores()'
      },
      {
        id: 'c2-3-query',
        label: 'Requête sur paire composite',
        description: 'Utiliser .equals(["EN_COURS", "HAUTE"]).',
        passed: false,
        hint: 'Passez le tableau `["EN_COURS", "HAUTE"]` à `.equals()`'
      },
      {
        id: 'c2-3-exec',
        label: '1 tâche urgente trouvée',
        description: 'La console affiche exactement 1 tâche urgente trouvée.',
        passed: false,
        hint: 'Exécutez pour valider la requête'
      }
    ]
  },
  {
    id: 'ex-2-4',
    labNumber: 2,
    number: '2.4',
    title: 'Déboguer un .where() Non Indexé',
    subtitle: 'Comprendre et réparer l\'erreur SchemaError sur index manquant',
    sectionId: 'btree-indexes',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Le code ci-dessous tente une requête `.where("categorie")`, mais échoue car `categorie` a été oublié dans `.stores()`. Corrigez le schéma en ajoutant l\'index `categorie` pour que la recherche aboutisse.',
    hint: 'Remplacez `articles: "id, titre"` par `articles: "id, titre, categorie"`.',
    initialCode: `class BoutiqueDB extends Dexie {
  articles!: Table<any, string>;
  constructor() {
    super("BoutiqueDB_" + crypto.randomUUID());
    // 💣 BUG : 'categorie' n'est pas indexé, .where('categorie') va échouer !
    this.version(1).stores({
      articles: "id, titre"
    });
  }
}

const db = new BoutiqueDB();
await db.open();

await db.articles.bulkAdd([
  { id: "1", titre: "Souris", categorie: "Informatique" },
  { id: "2", titre: "Bureau", categorie: "Mobilier" }
]);

// Cette requête lève une erreur si 'categorie' n'est pas dans stores() :
const informatiques = await db.articles.where("categorie").equals("Informatique").toArray();
console.log("Articles informatique trouvés :", informatiques.length);
await db.delete();
`,
    solutionCode: `class BoutiqueDB extends Dexie {
  articles!: Table<any, string>;
  constructor() {
    super("BoutiqueDB_" + crypto.randomUUID());
    this.version(1).stores({
      articles: "id, titre, categorie"
    });
  }
}

const db = new BoutiqueDB();
await db.open();

await db.articles.bulkAdd([
  { id: "1", titre: "Souris", categorie: "Informatique" },
  { id: "2", titre: "Bureau", categorie: "Mobilier" }
]);

const informatiques = await db.articles.where("categorie").equals("Informatique").toArray();
console.log("Articles informatique trouvés :", informatiques.length);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Dexie interdit formellement d\'appeler `.where("prop")` si `prop` n\'est pas listé dans `.stores()`.',
      'Sans index, IndexedDB ne peut pas faire de recherche binaire.',
      'Si vous ne souhaitez pas indexer la propriété, vous devez utiliser `.filter(a => a.prop === ...)`.'
    ],
    criteria: [
      {
        id: 'c2-4-index',
        label: 'Ajout de categorie dans stores()',
        description: 'Le schéma doit comporter categorie parmi les index.',
        passed: false,
        hint: 'Ajoutez `categorie` dans la chaîne stores()'
      },
      {
        id: 'c2-4-query',
        label: 'Requête where valide',
        description: 'La requête .where("categorie").equals(...) doit s\'exécuter sans erreur.',
        passed: false,
        hint: 'Vérifiez la concordance du nom de propriété'
      },
      {
        id: 'c2-4-exec',
        label: 'Exécution réussie',
        description: 'La console affiche 1 article informatique trouvé.',
        passed: false,
        hint: 'Exécutez pour valider la correction'
      }
    ]
  },

  // =========================================================================
  // LABO 3 : Fluent API, Recherche & Réhydratation (5 exercices)
  // =========================================================================
  {
    id: 'ex-3-1',
    labNumber: 3,
    number: '3.1',
    title: 'Autocomplétion (startsWithIgnoreCase)',
    subtitle: 'Recherche par préfixe insensible à la casse avec limitation de résultats',
    sectionId: 'fluent-api',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Écrivez la fonction `chercherLivres(prefixe: string): Promise<any[]>`. Interrogez la table `livres` sur l\'index `titre` avec `.startsWithIgnoreCase(prefixe)` et limitez les résultats à 5 avec `.limit(5).toArray()`.',
    hint: 'Utilisez `return await db.livres.where("titre").startsWithIgnoreCase(prefixe).limit(5).toArray();`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([
  { id: "1", titre: "Harry Potter à l'école des sorciers" },
  { id: "2", titre: "harry potter et la chambre des secrets" },
  { id: "3", titre: "HARRY POTTER et le prisonnier d'Azkaban" },
  { id: "4", titre: "Le Seigneur des Anneaux" }
]);

async function chercherLivres(prefixe: string): Promise<any[]> {
  // Complétez ici avec .where("titre").startsWithIgnoreCase(prefixe).limit(5).toArray() :
  return [];
}

// Tests :
const resultats = await chercherLivres("ha");
console.log("Livres Harry Potter trouvés (insensible à la casse) :", resultats.length);
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([
  { id: "1", titre: "Harry Potter à l'école des sorciers" },
  { id: "2", titre: "harry potter et la chambre des secrets" },
  { id: "3", titre: "HARRY POTTER et le prisonnier d'Azkaban" },
  { id: "4", titre: "Le Seigneur des Anneaux" }
]);

async function chercherLivres(prefixe: string): Promise<any[]> {
  return await db.livres
    .where("titre")
    .startsWithIgnoreCase(prefixe)
    .limit(5)
    .toArray();
}

const resultats = await chercherLivres("ha");
console.log("Livres Harry Potter trouvés (insensible à la casse) :", resultats.length);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      '`startsWithIgnoreCase()` utilise l\'index B-Tree pour cibler la plage lexicale correspondante.',
      'La recherche est insensible aux majuscules/minuscules sans nécessiter de boucle mémoire.',
      '`.limit(5)` arrête la lecture dès que le quota de résultats est atteint.'
    ],
    criteria: [
      {
        id: 'c3-1-prefix',
        label: 'startsWithIgnoreCase sur titre',
        description: 'Utiliser .where("titre").startsWithIgnoreCase(prefixe).',
        passed: false,
        hint: 'Appelez `startsWithIgnoreCase(prefixe)`'
      },
      {
        id: 'c3-1-limit',
        label: 'Limitation à 5 résultats',
        description: 'Chaîner .limit(5).',
        passed: false,
        hint: 'Ajoutez `.limit(5)`'
      },
      {
        id: 'c3-1-exec',
        label: '3 livres trouvés',
        description: 'La console affiche 3 livres trouvés pour le préfixe "ha".',
        passed: false,
        hint: 'Exécutez pour valider la recherche'
      }
    ]
  },
  {
    id: 'ex-3-2',
    labNumber: 3,
    number: '3.2',
    title: 'Intervalle (between) sur Dates ISO',
    subtitle: 'Filtrer chronologiquement grâce à l\'ordre lexicographique des dates ISO 8601',
    sectionId: 'fluent-api',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Récupérez tous les emprunts effectués entre le `"2026-10-01"` et le `"2026-10-31"` (bornes incluses) avec la méthode `.between("2026-10-01", "2026-10-31", true, true).toArray()`.',
    hint: 'Utilisez `await db.emprunts.where("dateEmpruntISO").between("2026-10-01", "2026-10-31", true, true).toArray();`.',
    initialCode: `class BiblioDB extends Dexie {
  emprunts!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ emprunts: "id, dateEmpruntISO" });
  }
}

const db = new BiblioDB();
await db.open();

await db.emprunts.bulkAdd([
  { id: "e1", livreId: "l1", adherentNom: "Alice", dateEmpruntISO: "2026-09-15" },
  { id: "e2", livreId: "l2", adherentNom: "Bob", dateEmpruntISO: "2026-10-05" },
  { id: "e3", livreId: "l3", adherentNom: "Charlie", dateEmpruntISO: "2026-10-20" },
  { id: "e4", livreId: "l4", adherentNom: "Diana", dateEmpruntISO: "2026-11-02" }
]);

// Récupérez les emprunts d'octobre 2026 avec .between(...) :
const empruntsOctobre: any[] = [];

console.log("Emprunts d'octobre trouvés :", empruntsOctobre.length);
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  emprunts!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ emprunts: "id, dateEmpruntISO" });
  }
}

const db = new BiblioDB();
await db.open();

await db.emprunts.bulkAdd([
  { id: "e1", livreId: "l1", adherentNom: "Alice", dateEmpruntISO: "2026-09-15" },
  { id: "e2", livreId: "l2", adherentNom: "Bob", dateEmpruntISO: "2026-10-05" },
  { id: "e3", livreId: "l3", adherentNom: "Charlie", dateEmpruntISO: "2026-10-20" },
  { id: "e4", livreId: "l4", adherentNom: "Diana", dateEmpruntISO: "2026-11-02" }
]);

const empruntsOctobre = await db.emprunts
  .where("dateEmpruntISO")
  .between("2026-10-01", "2026-10-31", true, true)
  .toArray();

console.log("Emprunts d'octobre trouvés :", empruntsOctobre.length);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Le format ISO 8601 (`AAAA-MM-JJ`) a la propriété remarquable d\'avoir un ordre alphabétique identique à l\'ordre chronologique.',
      '`.between(debut, fin, inclureDebut, inclureFin)` parcourt directement la branche concernée de l\'arbre B-Tree.',
      'C\'est l\'approche recommandée pour tout historique ou audit temporel.'
    ],
    criteria: [
      {
        id: 'c3-2-between',
        label: 'Utilisation de .between()',
        description: 'La requête doit utiliser .between("2026-10-01", "2026-10-31", ...).',
        passed: false,
        hint: 'Appelez `.between("2026-10-01", "2026-10-31", true, true)`'
      },
      {
        id: 'c3-2-field',
        label: 'Index dateEmpruntISO',
        description: 'La requête cible le champ dateEmpruntISO.',
        passed: false,
        hint: 'Utilisez `where("dateEmpruntISO")`'
      },
      {
        id: 'c3-2-exec',
        label: '2 emprunts trouvés',
        description: 'La console affiche exactement 2 emprunts trouvés pour octobre.',
        passed: false,
        hint: 'Exécutez pour vérifier les dates'
      }
    ]
  },
  {
    id: 'ex-3-3',
    labNumber: 3,
    number: '3.3',
    title: 'Tri et Pagination (orderBy, offset, limit)',
    subtitle: 'Naviguer dans un jeu de données volumineux avec fluidité',
    sectionId: 'fluent-api',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Écrivez la fonction `lirePage(page: number, taillePage: number): Promise<any[]>`. Triez les livres par "titre", appliquez le saut de page via `.offset((page - 1) * taillePage)` et limitez avec `.limit(taillePage).toArray()`. Pour la page 2 (taille 3), vous devez obtenir les livres 4, 5 et 6.',
    hint: 'Utilisez `return await db.livres.orderBy("titre").offset((page - 1) * taillePage).limit(taillePage).toArray();`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([
  { id: "1", titre: "Algorithmes" },
  { id: "2", titre: "Bases de données" },
  { id: "3", titre: "Compilateurs" },
  { id: "4", titre: "Design Patterns" },
  { id: "5", titre: "Event Loop" },
  { id: "6", titre: "Fonctions Pures" },
  { id: "7", titre: "Gestion Mémoire" }
]);

async function lirePage(page: number, taillePage: number): Promise<any[]> {
  // Complétez avec .orderBy("titre").offset(...).limit(...).toArray() :
  return [];
}

// Tests pour la page 2 (3 livres par page) :
const page2 = await lirePage(2, 3);
console.log("Nombre de livres page 2 :", page2.length);
console.log("Premier titre page 2 :", page2[0]?.titre);
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([
  { id: "1", titre: "Algorithmes" },
  { id: "2", titre: "Bases de données" },
  { id: "3", titre: "Compilateurs" },
  { id: "4", titre: "Design Patterns" },
  { id: "5", titre: "Event Loop" },
  { id: "6", titre: "Fonctions Pures" },
  { id: "7", titre: "Gestion Mémoire" }
]);

async function lirePage(page: number, taillePage: number): Promise<any[]> {
  return await db.livres
    .orderBy("titre")
    .offset((page - 1) * taillePage)
    .limit(taillePage)
    .toArray();
}

const page2 = await lirePage(2, 3);
console.log("Nombre de livres page 2 :", page2.length);
console.log("Premier titre page 2 :", page2[0]?.titre);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      '`.orderBy("titre")` utilise l\'index B-Tree pour parcourir les enregistrements déjà triés sans surcoût.',
      '`.offset(n)` saute les n premiers éléments.',
      '`.limit(k)` ne charge en mémoire que le paquet souhaité pour le composant d\'affichage.'
    ],
    criteria: [
      {
        id: 'c3-3-order',
        label: 'Tri via orderBy("titre")',
        description: 'Utiliser .orderBy("titre").',
        passed: false,
        hint: 'Appelez `orderBy("titre")`'
      },
      {
        id: 'c3-3-page',
        label: 'Combinaison offset & limit',
        description: 'Calculer offset((page - 1) * taillePage) et limit(taillePage).',
        passed: false,
        hint: 'Chaînez `.offset(...).limit(...)`'
      },
      {
        id: 'c3-3-exec',
        label: 'Page 2 conforme',
        description: 'La console affiche 3 livres et le premier titre est "Design Patterns".',
        passed: false,
        hint: 'Vérifiez la sortie console'
      }
    ]
  },
  {
    id: 'ex-3-4',
    labNumber: 3,
    number: '3.4',
    title: 'Index + Filtre Mémoire (where & filter)',
    subtitle: 'Combiner la rapidité de l\'index disque et la flexibilité d\'un prédicat JS',
    sectionId: 'fluent-api',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Filtrez les articles : ciblez d\'abord par l\'index `.where("categorie").equals("Informatique")`, puis affinez en mémoire avec `.filter(a => a.prix < 50).toArray()`.',
    hint: 'Utilisez `await db.articles.where("categorie").equals("Informatique").filter(a => a.prix < 50).toArray();`.',
    initialCode: `class BoutiqueDB extends Dexie {
  articles!: Table<ArticleDTO, string>;
  constructor() {
    super("BoutiqueDB_" + crypto.randomUUID());
    this.version(1).stores({ articles: "id, categorie" });
  }
}

const db = new BoutiqueDB();
await db.open();

await db.articles.bulkAdd([
  { id: "1", titre: "Câble HDMI", prix: 12, categorie: "Informatique" },
  { id: "2", titre: "Écran 4K", prix: 350, categorie: "Informatique" },
  { id: "3", titre: "Clé USB", prix: 25, categorie: "Informatique" },
  { id: "4", titre: "Chaise bureau", prix: 45, categorie: "Mobilier" }
]);

// Ciblez "Informatique" par index, puis affinez le prix < 50 via .filter() :
const bonsPlansInfo: any[] = [];

console.log("Articles informatique à moins de 50€ :", bonsPlansInfo.length);
await db.delete();
`,
    solutionCode: `class BoutiqueDB extends Dexie {
  articles!: Table<ArticleDTO, string>;
  constructor() {
    super("BoutiqueDB_" + crypto.randomUUID());
    this.version(1).stores({ articles: "id, categorie" });
  }
}

const db = new BoutiqueDB();
await db.open();

await db.articles.bulkAdd([
  { id: "1", titre: "Câble HDMI", prix: 12, categorie: "Informatique" },
  { id: "2", titre: "Écran 4K", prix: 350, categorie: "Informatique" },
  { id: "3", titre: "Clé USB", prix: 25, categorie: "Informatique" },
  { id: "4", titre: "Chaise bureau", prix: 45, categorie: "Mobilier" }
]);

const bonsPlansInfo = await db.articles
  .where("categorie")
  .equals("Informatique")
  .filter(a => a.prix < 50)
  .toArray();

console.log("Articles informatique à moins de 50€ :", bonsPlansInfo.length);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'L\'arbitrage d\'ingénierie : ne pas sur-indexer des champs secondaires comme `prix`.',
      'On réduit d\'abord le périmètre de recherche grâce à l\'index `categorie` en O(log n).',
      'On applique ensuite le prédicat JavaScript `.filter(...)` sur la poignée d\'enregistrements retenus.'
    ],
    criteria: [
      {
        id: 'c3-4-where',
        label: 'Ciblage par index categorie',
        description: 'Utiliser .where("categorie").equals("Informatique").',
        passed: false,
        hint: 'Commencez par `.where("categorie").equals(...)`'
      },
      {
        id: 'c3-4-filter',
        label: 'Filtre mémoire .filter()',
        description: 'Affiner avec .filter(a => a.prix < 50).',
        passed: false,
        hint: 'Ajoutez `.filter(a => a.prix < 50)`'
      },
      {
        id: 'c3-4-exec',
        label: '2 articles trouvés',
        description: 'La console affiche 2 articles (Câble HDMI et Clé USB).',
        passed: false,
        hint: 'Exécutez pour valider le résultat'
      }
    ]
  },
  {
    id: 'ex-3-5',
    labNumber: 3,
    number: '3.5',
    title: 'Réhydratation (fromDTO)',
    subtitle: 'Ressusciter les prototypes et méthodes métiers des objets lus depuis Dexie',
    sectionId: 'fluent-api',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Dexie stocke des clones purs (DTO). Lorsque vous lisez `await db.livres.toArray()`, les objets n\'ont pas de méthodes ! Réhydratez le tableau brut en instances de classe `Livre` via `.map(Livre.fromDTO)` et invoquez `livre.estDisponible()`.',
    hint: 'Utilisez `const livres = (await db.livres.toArray()).map(Livre.fromDTO);`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, isbn, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({
  id: "l1",
  isbn: "978-2070368228",
  titre: "L'Étranger",
  genres: ["Roman"],
  nbExemplaires: 3
});

// 1. Lisez les DTOs bruts depuis Dexie :
const dtos = await db.livres.toArray();

// 2. Réhydratez en instances vivantes avec Livre.fromDTO :
const livresVivants: Livre[] = []; // Complétez avec dtos.map(Livre.fromDTO)

console.log("Nombre de livres réhydratés :", livresVivants.length);
if (livresVivants.length > 0) {
  console.log("Méthode estDisponible() fonctionnelle :", livresVivants[0].estDisponible());
  console.log("Instance de Livre :", livresVivants[0] instanceof Livre);
}

await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, isbn, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({
  id: "l1",
  isbn: "978-2070368228",
  titre: "L'Étranger",
  genres: ["Roman"],
  nbExemplaires: 3
});

const dtos = await db.livres.toArray();
const livresVivants = dtos.map(Livre.fromDTO);

console.log("Nombre de livres réhydratés :", livresVivants.length);
if (livresVivants.length > 0) {
  console.log("Méthode estDisponible() fonctionnelle :", livresVivants[0].estDisponible());
  console.log("Instance de Livre :", livresVivants[0] instanceof Livre);
}

await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'L\'algorithme Structured Clone d\'IndexedDB détruit la chaîne de prototypes : les méthodes sont perdues.',
      'Un objet lu brut depuis la base est un simple `LivreDTO` inerte.',
      'La fabrique statique `Livre.fromDTO(dto)` reconstruit l\'entité vivante avec ses invariants et ses méthodes métiers.'
    ],
    criteria: [
      {
        id: 'c3-5-map',
        label: 'Réhydratation par .map(Livre.fromDTO)',
        description: 'Convertir les DTOs en instances de classe Livre.',
        passed: false,
        hint: 'Utilisez `dtos.map(Livre.fromDTO)`'
      },
      {
        id: 'c3-5-method',
        label: 'Appel méthode métier estDisponible()',
        description: 'La méthode métier estDisponible() doit pouvoir être invoquée.',
        passed: false,
        hint: 'Vérifiez la présence des méthodes sur l\'instance'
      },
      {
        id: 'c3-5-exec',
        label: 'Instance vivante validée',
        description: 'La console confirme que estDisponible() renvoie true et instanceof est validé.',
        passed: false,
        hint: 'Exécutez pour vérifier les logs'
      }
    ]
  },

  // =========================================================================
  // LABO 4 : Transactions ACID & Robustesse (5 exercices)
  // =========================================================================
  {
    id: 'ex-4-1',
    labNumber: 4,
    number: '4.1',
    title: 'Transaction Multi-Tables (\'rw\')',
    subtitle: 'Exécuter plusieurs opérations en un seul bloc atomique',
    sectionId: 'acid-transactions',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Enveloppez la décrémentation du stock d\'un livre et la création d\'une fiche d\'emprunt dans `await db.transaction("rw", [db.livres, db.emprunts], async () => { ... })`.',
    hint: 'Utilisez `await db.transaction("rw", [db.livres, db.emprunts], async () => { await db.livres.update(id, { nbExemplaires: 2 }); await db.emprunts.add(...); });`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  emprunts!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre",
      emprunts: "id, livreId"
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({ id: "l1", titre: "Dune", nbExemplaires: 3 });

// Enveloppez ces deux opérations dans une transaction 'rw' multi-tables :
// 1. Mettre à jour nbExemplaires à 2
// 2. Ajouter l'emprunt { id: "e1", livreId: "l1", adherentNom: "Alice" }

console.log("Transaction atomique validée !");
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  emprunts!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre",
      emprunts: "id, livreId"
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({ id: "l1", titre: "Dune", nbExemplaires: 3 });

await db.transaction("rw", [db.livres, db.emprunts], async () => {
  await db.livres.update("l1", { nbExemplaires: 2 });
  await db.emprunts.add({ id: "e1", livreId: "l1", adherentNom: "Alice" });
});

const l = await db.livres.get("l1");
const e = await db.emprunts.get("e1");
console.log("Stock mis à jour :", l?.nbExemplaires);
console.log("Emprunt créé :", e?.adherentNom);
console.log("Transaction atomique validée !");
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      '`db.transaction("rw", [tables...], callback)` déclare le périmètre d\'accès lecture/écriture.',
      'Si toutes les promesses du callback réussissent, le COMMIT est automatique.',
      'Toutes les modifications sont écrites sur disque en un seul bloc indivisible.'
    ],
    criteria: [
      {
        id: 'c4-1-tx',
        label: 'Syntaxe db.transaction("rw", ...)',
        description: 'Utiliser db.transaction avec le mode "rw" et les deux tables.',
        passed: false,
        hint: 'Appelez `db.transaction("rw", [db.livres, db.emprunts], async () => ...)`'
      },
      {
        id: 'c4-1-ops',
        label: 'Opérations coordonnées',
        description: 'Mettre à jour le livre et insérer l\'emprunt dans la transaction.',
        passed: false,
        hint: 'Appelez `update()` sur livres et `add()` sur emprunts'
      },
      {
        id: 'c4-1-exec',
        label: 'Données synchronisées',
        description: 'La console confirme que le stock vaut 2 et que l\'emprunt existe.',
        passed: false,
        hint: 'Exécutez pour valider la transaction'
      }
    ]
  },
  {
    id: 'ex-4-2',
    labNumber: 4,
    number: '4.2',
    title: 'Rollback sur Exception Métier',
    subtitle: 'Vérifier l\'annulation automatique de toutes les modifications en cas d\'erreur',
    sectionId: 'acid-transactions',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Dans une transaction "rw", modifiez le solde du compte de 100€ à 50€ avec `await db.comptes.update("c1", { solde: 50 })`, puis levez immédiatement `throw new Error("Solde insuffisant")`. Attrapez l\'erreur à l\'extérieur et prouvez que le solde initial de 100€ a été restauré (ROLLBACK).',
    hint: 'L\'erreur rejetée par le callback de `transaction()` déclenche le rollback automatique de Dexie.',
    initialCode: `class BanqueDB extends Dexie {
  comptes!: Table<any, string>;
  constructor() {
    super("BanqueDB_" + crypto.randomUUID());
    this.version(1).stores({ comptes: "id" });
  }
}

const db = new BanqueDB();
await db.open();

await db.comptes.add({ id: "c1", titulaire: "Alice", solde: 100 });

// 1. Tentez la transaction avec throw new Error("Panne simulée") :
try {
  await db.transaction("rw", db.comptes, async () => {
    await db.comptes.update("c1", { solde: 50 });
    // Levez une exception ici pour forcer le rollback :
  });
} catch (err: any) {
  console.log("Exception capturée :", err.message);
}

// 2. Vérifiez le solde réel sur le disque :
const c = await db.comptes.get("c1");
console.log("Solde après rollback :", c?.solde, "€"); // Doit valoir 100 !
await db.delete();
`,
    solutionCode: `class BanqueDB extends Dexie {
  comptes!: Table<any, string>;
  constructor() {
    super("BanqueDB_" + crypto.randomUUID());
    this.version(1).stores({ comptes: "id" });
  }
}

const db = new BanqueDB();
await db.open();

await db.comptes.add({ id: "c1", titulaire: "Alice", solde: 100 });

try {
  await db.transaction("rw", db.comptes, async () => {
    await db.comptes.update("c1", { solde: 50 });
    throw new Error("Panne simulée");
  });
} catch (err: any) {
  console.log("Exception capturée :", err.message);
}

const c = await db.comptes.get("c1");
console.log("Solde après rollback :", c?.solde, "€");
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'C\'est la garantie suprême de l\'Atomicité (le A d\'ACID).',
      'Dès qu\'une Promise rejette ou qu\'une `Error` est levée dans la transaction, Dexie ordonne un ROLLBACK à IndexedDB.',
      'La modification intermédiaire (solde = 50) est effacée comme si elle n\'avait jamais eu lieu.'
    ],
    criteria: [
      {
        id: 'c4-2-tx',
        label: 'Levée d\'erreur dans la transaction',
        description: 'La transaction doit lever une exception après la première mise à jour.',
        passed: false,
        hint: 'Ajoutez `throw new Error(...)` dans le callback de transaction'
      },
      {
        id: 'c4-2-rollback',
        label: 'Restauration du solde initial',
        description: 'Le compte doit retrouver son solde de 100€.',
        passed: false,
        hint: 'Vérifiez que le solde est bien préservé'
      },
      {
        id: 'c4-2-exec',
        label: 'Rollback confirmé',
        description: 'La console affiche "Solde après rollback : 100 €".',
        passed: false,
        hint: 'Exécutez pour valider le rollback'
      }
    ]
  },
  {
    id: 'ex-4-3',
    labNumber: 4,
    number: '4.3',
    title: 'Protection du Dernier Exemplaire',
    subtitle: 'Empêcher les stocks négatifs grâce à l\'alliance de la POO et des transactions',
    sectionId: 'acid-transactions',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Écrivez la fonction `emprunter(id: string)` qui charge le livre DANS la transaction, le réhydrate avec `Livre.fromDTO()`, invoque `livre.retirerUnExemplaire()` (qui lève une erreur si `stock === 0`), met à jour le stock et crée l\'emprunt. Testez avec un livre ayant 0 exemplaire.',
    hint: 'Si `livre.retirerUnExemplaire()` lève une `Error`, Dexie annule automatiquement la création de l\'emprunt.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  emprunts!: Table<EmpruntDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre",
      emprunts: "id, livreId"
    });
  }
}

const db = new BiblioDB();
await db.open();

// Livre avec STOCK ÉPUISÉ (0 exemplaire) :
await db.livres.add({
  id: "l1",
  isbn: "978-2070368228",
  titre: "Dune",
  genres: ["SF"],
  nbExemplaires: 0
});

async function tenterEmprunt(livreId: string): Promise<void> {
  await db.transaction("rw", [db.livres, db.emprunts], async () => {
    const dto = await db.livres.get(livreId);
    if (!dto) throw new Error("Introuvable");
    // 1. Réhydratez l'objet Livre
    // 2. Appelez livre.retirerUnExemplaire() (qui va lever car stock = 0 !)
    // 3. Mettez à jour le stock et créez l'emprunt
  });
}

// Tests :
try {
  await tenterEmprunt("l1");
} catch (err: any) {
  console.log("Emprunt refusé par la règle métier :", err.message);
}

const nbEmprunts = await db.emprunts.count();
console.log("Fiches d'emprunt créées :", nbEmprunts); // Doit valoir 0 !
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  emprunts!: Table<EmpruntDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre",
      emprunts: "id, livreId"
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({
  id: "l1",
  isbn: "978-2070368228",
  titre: "Dune",
  genres: ["SF"],
  nbExemplaires: 0
});

async function tenterEmprunt(livreId: string): Promise<void> {
  await db.transaction("rw", [db.livres, db.emprunts], async () => {
    const dto = await db.livres.get(livreId);
    if (!dto) throw new Error("Introuvable");
    const livre = Livre.fromDTO(dto);
    livre.retirerUnExemplaire();
    await db.livres.update(livreId, { nbExemplaires: livre.nbExemplaires });
    await db.emprunts.add({
      id: "e1",
      livreId,
      adherentNom: "Bob",
      dateEmpruntISO: new Date().toISOString()
    });
  });
}

try {
  await tenterEmprunt("l1");
} catch (err: any) {
  console.log("Emprunt refusé par la règle métier :", err.message);
}

const nbEmprunts = await db.emprunts.count();
console.log("Fiches d'emprunt créées :", nbEmprunts);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'La règle métier (refuser un stock à 0) est encapsulée dans la classe `Livre`.',
      'L\'exception levée par `retirerUnExemplaire()` déclenche le Rollback de la transaction.',
      'Résultat : aucune fiche d\'emprunt orpheline n\'est créée et le stock ne passe jamais à -1.'
    ],
    criteria: [
      {
        id: 'c4-3-method',
        label: 'Appel de retirerUnExemplaire()',
        description: 'La transaction doit appeler retirerUnExemplaire() sur l\'entité réhydratée.',
        passed: false,
        hint: 'Appelez `livre.retirerUnExemplaire()`'
      },
      {
        id: 'c4-3-safe',
        label: 'Protection du stock épuisé',
        description: 'Aucun enregistrement d\'emprunt ne doit être créé.',
        passed: false,
        hint: 'Vérifiez que le nombre d\'emprunts reste à 0'
      },
      {
        id: 'c4-3-exec',
        label: 'Rollback métier validé',
        description: 'La console affiche le refus et confirme 0 fiche d\'emprunt.',
        passed: false,
        hint: 'Exécutez pour valider la protection'
      }
    ]
  },
  {
    id: 'ex-4-4',
    labNumber: 4,
    number: '4.4',
    title: 'Le Piège du Réseau (TransactionInactiveError)',
    subtitle: 'Extraire tout appel asynchrone non-IndexedDB avant le début de la transaction',
    sectionId: 'acid-transactions',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Le code ci-dessous simule un appel réseau externe `verifierQuota()` *à l\'intérieur* de `db.transaction()`. Dans IndexedDB, toute macro-tâche réseau suspend le contexte de transaction et provoque `TransactionInactiveError` ! Corrigez le code en déplaçant l\'appel réseau AVANT la transaction.',
    hint: 'Déplacez `const ok = await verifierQuota();` avant `await db.transaction(...)`.',
    initialCode: `class QuotaDB extends Dexie {
  items!: Table<any, string>;
  constructor() {
    super("QuotaDB_" + crypto.randomUUID());
    this.version(1).stores({ items: "id" });
  }
}

const db = new QuotaDB();
await db.open();

// Simulation d'un appel réseau externe (ex: fetch) :
async function verifierQuotaReseau(): Promise<boolean> {
  return true;
}

// 💣 CODE BOGUÉ : L'appel réseau est DANS la transaction !
async function enregistrerItemSecurise(id: string, libelle: string): Promise<void> {
  await db.transaction("rw", db.items, async () => {
    // ⚠️ ERREUR CRITIQUE : l'appel réseau ici va casser la transaction IndexedDB !
    const autorise = await verifierQuotaReseau();
    if (autorise) {
      await db.items.add({ id, libelle });
    }
  });
}

// Tests :
await enregistrerItemSecurise("i1", "Document Important");
const item = await db.items.get("i1");
console.log("Item enregistré sans TransactionInactiveError :", item?.libelle);
await db.delete();
`,
    solutionCode: `class QuotaDB extends Dexie {
  items!: Table<any, string>;
  constructor() {
    super("QuotaDB_" + crypto.randomUUID());
    this.version(1).stores({ items: "id" });
  }
}

const db = new QuotaDB();
await db.open();

async function verifierQuotaReseau(): Promise<boolean> {
  return true;
}

async function enregistrerItemSecurise(id: string, libelle: string): Promise<void> {
  const autorise = await verifierQuotaReseau();
  if (!autorise) return;

  await db.transaction("rw", db.items, async () => {
    await db.items.add({ id, libelle });
  });
}

await enregistrerItemSecurise("i1", "Document Important");
const item = await db.items.get("i1");
console.log("Item enregistré sans TransactionInactiveError :", item?.libelle);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Le moteur IndexedDB du navigateur clôture automatiquement une transaction dès qu\'elle n\'a plus de micro-tâches actives.',
      'Un `await fetch(...)` ou un `setTimeout` fait perdre le contexte transactionnel (`TransactionInactiveError`).',
      'La règle d\'ingénierie : collecter TOUTES les données réseau au préalable, puis ouvrir une transaction ultra-courte 100% locale.'
    ],
    criteria: [
      {
        id: 'c4-4-extract',
        label: 'Appel réseau extrait de la transaction',
        description: 'verifierQuotaReseau doit être invoqué AVANT db.transaction.',
        passed: false,
        hint: 'Déplacez l\'appel réseau en dehors du bloc transactionnel'
      },
      {
        id: 'c4-4-tx',
        label: 'Transaction purement locale',
        description: 'La transaction ne doit contenir que l\'opération Dexie.',
        passed: false,
        hint: 'Ne gardez que `db.items.add` dans la transaction'
      },
      {
        id: 'c4-4-exec',
        label: 'Exécution réussie',
        description: 'L\'item est persisté sans erreur de transaction inactive.',
        passed: false,
        hint: 'Exécutez pour valider la correction'
      }
    ]
  },
  {
    id: 'ex-4-5',
    labNumber: 4,
    number: '4.5',
    title: 'Transaction Lecture Seule (\'r\')',
    subtitle: 'Garantir une vue cohérente sans blocage en mode lecture pure',
    sectionId: 'acid-transactions',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Créez une transaction en mode "r" sur `[db.livres, db.emprunts]` pour lire simultanément le nombre total de livres (`await db.livres.count()`) et le nombre total d\'emprunts (`await db.emprunts.count()`). Retournez `{ totalLivres, totalEmprunts }`.',
    hint: 'Utilisez `return await db.transaction("r", [db.livres, db.emprunts], async () => { const totalLivres = await db.livres.count(); const totalEmprunts = await db.emprunts.count(); return { totalLivres, totalEmprunts }; });`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  emprunts!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre",
      emprunts: "id, livreId"
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([{ id: "1", titre: "A" }, { id: "2", titre: "B" }]);
await db.emprunts.add({ id: "e1", livreId: "1" });

async function obtenirStatistiques(): Promise<{ totalLivres: number; totalEmprunts: number }> {
  // Complétez avec db.transaction("r", [db.livres, db.emprunts], async () => ...) :
  return { totalLivres: 0, totalEmprunts: 0 };
}

// Tests :
const stats = await obtenirStatistiques();
console.log("Statistiques cohérentes :", stats.totalLivres, "livres,", stats.totalEmprunts, "emprunts");
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  emprunts!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre",
      emprunts: "id, livreId"
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([{ id: "1", titre: "A" }, { id: "2", titre: "B" }]);
await db.emprunts.add({ id: "e1", livreId: "1" });

async function obtenirStatistiques(): Promise<{ totalLivres: number; totalEmprunts: number }> {
  return await db.transaction("r", [db.livres, db.emprunts], async () => {
    const totalLivres = await db.livres.count();
    const totalEmprunts = await db.emprunts.count();
    return { totalLivres, totalEmprunts };
  });
}

const stats = await obtenirStatistiques();
console.log("Statistiques cohérentes :", stats.totalLivres, "livres,", stats.totalEmprunts, "emprunts");
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Le mode `"r"` (read-only) offre le niveau d\'Isolation (le I d\'ACID) sans verrouiller les écritures concurrentes.',
      'Les deux comptages sont garantis d\'être exécutés sur le même cliché instantané (snapshot).',
      'C\'est la bonne pratique pour générer des exports de données ou des rapports de synthèse cohérents.'
    ],
    criteria: [
      {
        id: 'c4-5-tx',
        label: 'Mode "r" en transaction',
        description: 'Utiliser le mode "r" dans db.transaction.',
        passed: false,
        hint: 'Spécifiez le premier paramètre `"r"`'
      },
      {
        id: 'c4-5-count',
        label: 'Double comptage count()',
        description: 'Invoquer count() sur livres et emprunts.',
        passed: false,
        hint: 'Appelez `await db.livres.count()` et `await db.emprunts.count()`'
      },
      {
        id: 'c4-5-exec',
        label: 'Statistiques exactes',
        description: 'La console affiche 2 livres et 1 emprunt.',
        passed: false,
        hint: 'Exécutez pour valider le résultat'
      }
    ]
  },

  // =========================================================================
  // LABO 5 : Migrations de Schéma Incrémentales (4 exercices)
  // =========================================================================
  {
    id: 'ex-5-1',
    labNumber: 5,
    number: '5.1',
    title: 'Empiler une Version 2',
    subtitle: 'Faire évoluer le schéma sans jamais altérer l\'historique de la version 1',
    sectionId: 'schema-migrations',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Une base existante en production possède `this.version(1).stores({ contacts: "id, nomComplet" })`. Sans toucher à cette ligne (Règle d\'or 1), empilez la version 2 en ajoutant `this.version(2).stores({ contacts: "id, nom, prenom" })`.',
    hint: 'Conservez `this.version(1)...` intact et ajoutez `this.version(2).stores({ contacts: "id, nom, prenom" });` à la suite.',
    initialCode: `class CarnetDB extends Dexie {
  contacts!: Table<any, string>;
  constructor() {
    super("CarnetDB_" + crypto.randomUUID());
    
    // Règle d'or 1 : Ne JAMAIS modifier la version 1 existante !
    this.version(1).stores({
      contacts: "id, nomComplet"
    });

    // Ajoutez la version 2 ici :
  }
}

// Tests :
const db = new CarnetDB();
await db.open();
console.log("Version active de la base :", db.verno);
await db.delete();
`,
    solutionCode: `class CarnetDB extends Dexie {
  contacts!: Table<any, string>;
  constructor() {
    super("CarnetDB_" + crypto.randomUUID());
    
    this.version(1).stores({
      contacts: "id, nomComplet"
    });

    this.version(2).stores({
      contacts: "id, nom, prenom"
    });
  }
}

const db = new CarnetDB();
await db.open();
console.log("Version active de la base :", db.verno);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Dexie applique les migrations de manière incrémentale en comparant le numéro de version stocké avec le code.',
      'Ne modifiez JAMAIS `version(1)` : les utilisateurs existants ne rejoueraient pas la modification et resteraient bloqués.',
      'Empilez toujours `version(2)`, `version(3)` avec des entiers strictement croissants.'
    ],
    criteria: [
      {
        id: 'c5-1-v1',
        label: 'Version 1 intacte',
        description: 'La déclaration version(1) doit être préservée avec nomComplet.',
        passed: false,
        hint: 'Ne modifiez pas la ligne version(1)'
      },
      {
        id: 'c5-1-v2',
        label: 'Ajout de version(2)',
        description: 'Déclarer this.version(2).stores({ contacts: "id, nom, prenom" }).',
        passed: false,
        hint: 'Ajoutez `this.version(2).stores({ contacts: "id, nom, prenom" });`'
      },
      {
        id: 'c5-1-exec',
        label: 'Version 2 active',
        description: 'La console affiche "Version active de la base : 2".',
        passed: false,
        hint: 'Exécutez pour valider la version'
      }
    ]
  },
  {
    id: 'ex-5-2',
    labNumber: 5,
    number: '5.2',
    title: 'Transformation de Données (.upgrade)',
    subtitle: 'Migrer les anciens enregistrements en scindant nomComplet en nom et prenom',
    sectionId: 'schema-migrations',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Écrivez le callback `.upgrade(async tx => ...)` sur la version 2. Utilisez `tx.table("contacts").toCollection().modify(contact => { ... })` pour découper `contact.nomComplet` (ex: "Jean Dupont") en `prenom` et `nom`, puis supprimez `delete contact.nomComplet`.',
    hint: 'Dans `.upgrade()`, écrivez `return tx.table("contacts").toCollection().modify(c => { const parts = (c.nomComplet || "").split(" "); c.prenom = parts[0] || ""; c.nom = parts[1] || ""; delete c.nomComplet; });`.',
    initialCode: `const dbName = "CarnetDB_" + crypto.randomUUID();

// Étape 1 : Créer la base v1 avec un contact ancien
const dbV1 = new Dexie(dbName);
dbV1.version(1).stores({ contacts: "id, nomComplet" });
await dbV1.open();
await dbV1.table("contacts").add({ id: "c1", nomComplet: "Jean Dupont" });
dbV1.close();

// Étape 2 : Déployer la v2 avec la fonction de transformation .upgrade()
const dbV2 = new Dexie(dbName);
dbV2.version(1).stores({ contacts: "id, nomComplet" });
dbV2.version(2).stores({ contacts: "id, nom, prenom" })
  .upgrade(async tx => {
    // Complétez ici avec tx.table("contacts").toCollection().modify(...) :
  });

await dbV2.open();

// Vérification de la transformation :
const c = await dbV2.table("contacts").get("c1");
console.log("Prénom extrait :", c?.prenom);
console.log("Nom extrait :", c?.nom);
console.log("nomComplet supprimé :", c?.nomComplet === undefined);
await dbV2.delete();
`,
    solutionCode: `const dbName = "CarnetDB_" + crypto.randomUUID();

const dbV1 = new Dexie(dbName);
dbV1.version(1).stores({ contacts: "id, nomComplet" });
await dbV1.open();
await dbV1.table("contacts").add({ id: "c1", nomComplet: "Jean Dupont" });
dbV1.close();

const dbV2 = new Dexie(dbName);
dbV2.version(1).stores({ contacts: "id, nomComplet" });
dbV2.version(2).stores({ contacts: "id, nom, prenom" })
  .upgrade(async tx => {
    return tx.table("contacts").toCollection().modify((c: any) => {
      const parts = (c.nomComplet || "").split(" ");
      c.prenom = parts[0] || "";
      c.nom = parts.slice(1).join(" ") || "";
      delete c.nomComplet;
    });
  });

await dbV2.open();

const c = await dbV2.table("contacts").get("c1");
console.log("Prénom extrait :", c?.prenom);
console.log("Nom extrait :", c?.nom);
console.log("nomComplet supprimé :", c?.nomComplet === undefined);
await dbV2.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      '`.upgrade()` reçoit une transaction système spéciale englobant l\'ensemble de la migration.',
      '`.modify()` met à jour chaque enregistrement en place directement sur le disque dur.',
      'Si le script plante ou que la batterie coupe pendant le modify, la migration entière est annulée sans perte.'
    ],
    criteria: [
      {
        id: 'c5-2-upgrade',
        label: 'Méthode .upgrade()',
        description: 'Enchaîner .upgrade(...) sur la version 2.',
        passed: false,
        hint: 'Ajoutez `.upgrade(async tx => ...)` après `.stores(...)`'
      },
      {
        id: 'c5-2-modify',
        label: 'Transformation via .modify()',
        description: 'Utiliser tx.table("contacts").toCollection().modify(...) pour affecter prenom et nom.',
        passed: false,
        hint: 'Appelez `modify((c) => { ... })`'
      },
      {
        id: 'c5-2-exec',
        label: 'Contact transformé sans perte',
        description: 'La console affiche Jean, Dupont et confirme la suppression de nomComplet.',
        passed: false,
        hint: 'Exécutez pour valider la migration'
      }
    ]
  },
  {
    id: 'ex-5-3',
    labNumber: 5,
    number: '5.3',
    title: 'Valeur par Défaut lors d\'une Migration',
    subtitle: 'Garantir l\'intégrité des invariants en initialisant les nouveaux champs obligatoires',
    sectionId: 'schema-migrations',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'En version 2, vous ajoutez un nouvel index `actif` (`contacts: "id, nom, actif"`). Dans le callback `.upgrade()`, initialisez `contact.actif = true` sur tous les anciens contacts afin d\'éviter qu\'ils ne soient `undefined`.',
    hint: 'Dans `.upgrade()`, écrivez `return tx.table("contacts").toCollection().modify(c => { c.actif = true; });`.',
    initialCode: `const dbName = "CarnetDB_" + crypto.randomUUID();

const dbV1 = new Dexie(dbName);
dbV1.version(1).stores({ contacts: "id, nom" });
await dbV1.open();
await dbV1.table("contacts").add({ id: "c1", nom: "Dupont" });
dbV1.close();

const dbV2 = new Dexie(dbName);
dbV2.version(1).stores({ contacts: "id, nom" });
// 1. Ajoutez actif au schéma v2 et initialisez actif = true dans .upgrade() :
dbV2.version(2).stores({ contacts: "id, nom, actif" })
  .upgrade(async tx => {
    // Initialisez contact.actif = true ici
  });

await dbV2.open();

const c = await dbV2.table("contacts").get("c1");
console.log("Contact migré avec valeur par défaut :", c?.actif === true);
await dbV2.delete();
`,
    solutionCode: `const dbName = "CarnetDB_" + crypto.randomUUID();

const dbV1 = new Dexie(dbName);
dbV1.version(1).stores({ contacts: "id, nom" });
await dbV1.open();
await dbV1.table("contacts").add({ id: "c1", nom: "Dupont" });
dbV1.close();

const dbV2 = new Dexie(dbName);
dbV2.version(1).stores({ contacts: "id, nom" });
dbV2.version(2).stores({ contacts: "id, nom, actif" })
  .upgrade(async tx => {
    return tx.table("contacts").toCollection().modify((c: any) => {
      c.actif = true;
    });
  });

await dbV2.open();

const c = await dbV2.table("contacts").get("c1");
console.log("Contact migré avec valeur par défaut :", c?.actif === true);
await dbV2.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Lorsqu\'on ajoute un champ obligatoire dans une classe métier, les anciens enregistrements sur disque ne l\'ont pas.',
      'Si on ne l\'initialise pas dans `.upgrade()`, la réhydratation `fromDTO()` risque de lever une exception.',
      'La migration doit combler les lacunes avec des valeurs par défaut saines.'
    ],
    criteria: [
      {
        id: 'c5-3-index',
        label: 'Index actif dans schéma v2',
        description: 'La version 2 doit déclarer actif.',
        passed: false,
        hint: 'Ajoutez `actif` dans la chaîne stores de la version 2'
      },
      {
        id: 'c5-3-default',
        label: 'Initialisation actif = true',
        description: 'Initialiser la propriété actif à true dans modify.',
        passed: false,
        hint: 'Affectez `c.actif = true;`'
      },
      {
        id: 'c5-3-exec',
        label: 'Vérification de la valeur',
        description: 'La console confirme que contact.actif vaut true.',
        passed: false,
        hint: 'Exécutez pour valider le résultat'
      }
    ]
  },
  {
    id: 'ex-5-4',
    labNumber: 5,
    number: '5.4',
    title: 'Suppression Propre d\'un Object Store (null)',
    subtitle: 'Purger une table obsolète sans laisser de scories sur le disque',
    sectionId: 'schema-migrations',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'En version 3, l\'ancien store `archives` est devenu obsolète. Pour demander à Dexie et IndexedDB de supprimer définitivement la table physique sur le disque, assignez-lui la valeur `null` dans `this.version(3).stores({ archives: null })`.',
    hint: 'Écrivez `db.version(3).stores({ archives: null });`.',
    initialCode: `const dbName = "CarnetDB_" + crypto.randomUUID();

const dbV2 = new Dexie(dbName);
dbV2.version(1).stores({ contacts: "id, nom", archives: "id, dateArchive" });
await dbV2.open();
console.log("Tables en v2 :", dbV2.tables.map(t => t.name).join(", "));
dbV2.close();

const dbV3 = new Dexie(dbName);
dbV3.version(1).stores({ contacts: "id, nom", archives: "id, dateArchive" });
// 1. Déclarez la version 3 en supprimant archives via la valeur null :
dbV3.version(3).stores({
  // Supprimez archives ici
});

await dbV3.open();
const tablesV3 = dbV3.tables.map(t => t.name);
console.log("Tables restantes en v3 :", tablesV3.join(", "));
console.log("Table archives définitivement supprimée :", !tablesV3.includes("archives"));
await dbV3.delete();
`,
    solutionCode: `const dbName = "CarnetDB_" + crypto.randomUUID();

const dbV2 = new Dexie(dbName);
dbV2.version(1).stores({ contacts: "id, nom", archives: "id, dateArchive" });
await dbV2.open();
console.log("Tables en v2 :", dbV2.tables.map(t => t.name).join(", "));
dbV2.close();

const dbV3 = new Dexie(dbName);
dbV3.version(1).stores({ contacts: "id, nom", archives: "id, dateArchive" });
dbV3.version(3).stores({
  archives: null
});

await dbV3.open();
const tablesV3 = dbV3.tables.map(t => t.name);
console.log("Tables restantes en v3 :", tablesV3.join(", "));
console.log("Table archives définitivement supprimée :", !tablesV3.includes("archives"));
await dbV3.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Dans Dexie, omettre simplement une table d\'une version suivante ne la supprime PAS (pour éviter les accidents).',
      'Pour instruire IndexedDB d\'effacer l\'Object Store et libérer l\'espace disque, il faut explicitement spécifier `null`.',
      'C\'est la règle d\'or 4 des migrations Dexie.'
    ],
    criteria: [
      {
        id: 'c5-4-v3',
        label: 'Déclaration version(3)',
        description: 'Déclarer this.version(3).stores(...).',
        passed: false,
        hint: 'Utilisez `version(3).stores(...)`'
      },
      {
        id: 'c5-4-null',
        label: 'Assignation archives: null',
        description: 'Assigner la valeur null à la table archives.',
        passed: false,
        hint: 'Écrivez `{ archives: null }`'
      },
      {
        id: 'c5-4-exec',
        label: 'Table purgée avec succès',
        description: 'La console confirme que la table archives n\'existe plus en v3.',
        passed: false,
        hint: 'Exécutez pour valider la suppression'
      }
    ]
  },

  // =========================================================================
  // LABO 6 : Architecture POO, Signals & BiblioTech (4 exercices)
  // =========================================================================
  {
    id: 'ex-6-1',
    labNumber: 6,
    number: '6.1',
    title: 'Encapsulation & Invariant Métier',
    subtitle: 'Protéger l\'état interne de l\'entité Livre via un champ privé (#)',
    sectionId: 'bibliotech-demo',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Complétez la méthode métier `retirerUnExemplaire()` de la classe `Livre`. Si le stock est inférieur ou égal à 0 (ou si `!this.estDisponible()`), levez `new Error("Stock épuisé")`. Sinon, décrémentez le champ privé `#nbExemplaires`.',
    hint: 'Vérifiez `if (!this.estDisponible()) throw new Error("Stock épuisé"); this.#nbExemplaires--;`.',
    initialCode: `class LivreExemplaire {
  #titre: string;
  #nbExemplaires: number;

  constructor(titre: string, nb: number) {
    this.#titre = titre;
    this.#nbExemplaires = nb;
  }

  get titre(): string { return this.#titre; }
  get nbExemplaires(): number { return this.#nbExemplaires; }
  estDisponible(): boolean { return this.#nbExemplaires > 0; }

  retirerUnExemplaire(): void {
    // 1. Si le livre n'est pas disponible, levez new Error("Stock épuisé")
    // 2. Sinon décrémentez #nbExemplaires
  }
}

// Tests :
const livre = new LivreExemplaire("Clean Code", 1);
livre.retirerUnExemplaire();
console.log("Stock après 1er retrait :", livre.nbExemplaires); // 0

try {
  livre.retirerUnExemplaire(); // Doit lever une Error !
} catch (err: any) {
  console.log("Exception levée au 2e retrait :", err.message);
}
`,
    solutionCode: `class LivreExemplaire {
  #titre: string;
  #nbExemplaires: number;

  constructor(titre: string, nb: number) {
    this.#titre = titre;
    this.#nbExemplaires = nb;
  }

  get titre(): string { return this.#titre; }
  get nbExemplaires(): number { return this.#nbExemplaires; }
  estDisponible(): boolean { return this.#nbExemplaires > 0; }

  retirerUnExemplaire(): void {
    if (!this.estDisponible()) {
      throw new Error("Stock épuisé");
    }
    this.#nbExemplaires--;
  }
}

const livre = new LivreExemplaire("Clean Code", 1);
livre.retirerUnExemplaire();
console.log("Stock après 1er retrait :", livre.nbExemplaires);

try {
  livre.retirerUnExemplaire();
} catch (err: any) {
  console.log("Exception levée au 2e retrait :", err.message);
}
`,
    isCompleted: false,
    solutionExplanation: [
      'Le champ `#nbExemplaires` est strictement privé et encapsulé : aucun code externe ne peut le corrompre.',
      'La méthode métier `retirerUnExemplaire()` garantit l\'invariant : le stock ne peut JAMAIS descendre en dessous de 0.',
      'Cette exception sera interceptée par la transaction Dexie pour déclencher le Rollback.'
    ],
    criteria: [
      {
        id: 'c6-1-check',
        label: 'Vérification de disponibilité',
        description: 'La méthode doit lever new Error("Stock épuisé") si le stock est nul.',
        passed: false,
        hint: 'Utilisez `if (!this.estDisponible()) throw new Error(...)`'
      },
      {
        id: 'c6-1-dec',
        label: 'Décrémentation du champ privé',
        description: 'Décrémenter this.#nbExemplaires.',
        passed: false,
        hint: 'Écrivez `this.#nbExemplaires--;`'
      },
      {
        id: 'c6-1-exec',
        label: 'Invariant validé',
        description: 'La console affiche le stock 0 puis capture l\'exception "Stock épuisé".',
        passed: false,
        hint: 'Exécutez pour valider la protection'
      }
    ]
  },
  {
    id: 'ex-6-2',
    labNumber: 6,
    number: '6.2',
    title: 'Sérialisation toDTO() & fromDTO()',
    subtitle: 'Assurer le pont bidirectionnel étanche entre l\'objet métier et le stockage Dexie',
    sectionId: 'bibliotech-demo',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Implémentez les méthodes `toDTO(): LivreDTO` et `static fromDTO(dto: LivreDTO): LivreModele` sur l\'entité `LivreModele` pour convertir proprement l\'objet encapsulé en structure de données pure pour Dexie, et inversement.',
    hint: '`toDTO()` renvoie un objet `{ id: this.#id, ... }`. `static fromDTO(dto)` fait `return new LivreModele(...)`.',
    initialCode: `class LivreModele {
  #id: string;
  #titre: string;
  #stock: number;

  constructor(id: string, titre: string, stock: number) {
    this.#id = id;
    this.#titre = titre;
    this.#stock = stock;
  }

  get id(): string { return this.#id; }
  get titre(): string { return this.#titre; }
  get stock(): number { return this.#stock; }

  // 1. Implémentez toDTO() :
  toDTO(): any {
    return null;
  }

  // 2. Implémentez la fabrique statique fromDTO() :
  static fromDTO(dto: any): LivreModele {
    return null as any;
  }
}

// Tests :
const entite = new LivreModele("l1", "TypeScript Avancé", 5);
const dto = entite.toDTO();
console.log("DTO généré (objet pur) :", dto?.id, dto?.titre, dto?.stock);

const réhydraté = LivreModele.fromDTO(dto);
console.log("Entité ressuscitée :", réhydraté?.titre, "| instanceof LivreModele :", réhydraté instanceof LivreModele);
`,
    solutionCode: `class LivreModele {
  #id: string;
  #titre: string;
  #stock: number;

  constructor(id: string, titre: string, stock: number) {
    this.#id = id;
    this.#titre = titre;
    this.#stock = stock;
  }

  get id(): string { return this.#id; }
  get titre(): string { return this.#titre; }
  get stock(): number { return this.#stock; }

  toDTO(): any {
    return {
      id: this.#id,
      titre: this.#titre,
      stock: this.#stock
    };
  }

  static fromDTO(dto: any): LivreModele {
    return new LivreModele(dto.id, dto.titre, dto.stock);
  }
}

const entite = new LivreModele("l1", "TypeScript Avancé", 5);
const dto = entite.toDTO();
console.log("DTO généré (objet pur) :", dto?.id, dto?.titre, dto?.stock);

const réhydraté = LivreModele.fromDTO(dto);
console.log("Entité ressuscitée :", réhydraté?.titre, "| instanceof LivreModele :", réhydraté instanceof LivreModele);
`,
    isCompleted: false,
    solutionExplanation: [
      'Un DTO (Data Transfer Object) est un sac de données sans comportement ni champs privés `#`.',
      '`toDTO()` extrait l\'état interne pour l\'enregistrer dans IndexedDB.',
      '`fromDTO()` reconstruit l\'entité vivante en ré-exécutant le constructeur et ses validations d\'invariants.'
    ],
    criteria: [
      {
        id: 'c6-2-todto',
        label: 'Méthode toDTO()',
        description: 'toDTO() doit retourner un objet littéral avec id, titre et stock.',
        passed: false,
        hint: 'Retournez `{ id: this.#id, titre: this.#titre, stock: this.#stock }`'
      },
      {
        id: 'c6-2-fromdto',
        label: 'Méthode statique fromDTO()',
        description: 'fromDTO() doit instancier un nouveau LivreModele.',
        passed: false,
        hint: 'Retournez `new LivreModele(dto.id, dto.titre, dto.stock)`'
      },
      {
        id: 'c6-2-exec',
        label: 'Aller-retour validé',
        description: 'La console confirme la sérialisation puis la réhydratation fidèle.',
        passed: false,
        hint: 'Exécutez pour valider le test'
      }
    ]
  },
  {
    id: 'ex-6-3',
    labNumber: 6,
    number: '6.3',
    title: 'Passerelle Dexie → Angular Signal',
    subtitle: 'Faire le pont entre les Promesses asynchrones de Dexie et la réactivité synchrone des signaux',
    sectionId: 'bibliotech-demo',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Complétez la méthode `async recharger(): Promise<void>` d\'un service Angular. Lisez tous les livres avec `await db.livres.toArray()`, réhydratez-les avec `.map(Livre.fromDTO)`, et mettez à jour le signal privé via `this.#livres.set(...)`.',
    hint: 'Utilisez `const dtos = await db.livres.toArray(); this.#livres.set(dtos.map(Livre.fromDTO));`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, isbn, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({
  id: "l1",
  isbn: "978-2070368228",
  titre: "L'Étranger",
  genres: ["Roman"],
  nbExemplaires: 2
});

class BiblioService {
  readonly #livres = signal<readonly Livre[]>([]);
  readonly livres = this.#livres.asReadonly();

  async recharger(): Promise<void> {
    // 1. Lisez db.livres.toArray() avec await
    // 2. Réhydratez les DTOs avec Livre.fromDTO
    // 3. Mettez à jour le signal via this.#livres.set(...)
  }
}

// Tests :
const service = new BiblioService();
await service.recharger();
console.log("Nombre de livres dans le signal :", service.livres().length);
console.log("Titre du premier livre :", service.livres()[0]?.titre);
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, isbn, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({
  id: "l1",
  isbn: "978-2070368228",
  titre: "L'Étranger",
  genres: ["Roman"],
  nbExemplaires: 2
});

class BiblioService {
  readonly #livres = signal<readonly Livre[]>([]);
  readonly livres = this.#livres.asReadonly();

  async recharger(): Promise<void> {
    const dtos = await db.livres.toArray();
    this.#livres.set(dtos.map(Livre.fromDTO));
  }
}

const service = new BiblioService();
await service.recharger();
console.log("Nombre de livres dans le signal :", service.livres().length);
console.log("Titre du premier livre :", service.livres()[0]?.titre);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Dexie est asynchrone (`Promise`, `await`) alors que les Angular Signals sont synchrones (`set()`).',
      'Le service joue le rôle d\'adaptateur architectural parfait entre le stockage disque et l\'UI.',
      'Dès que le signal est mis à jour, les composants OnPush s\'actualisent sans zone.js.'
    ],
    criteria: [
      {
        id: 'c6-3-read',
        label: 'Lecture await db.livres.toArray()',
        description: 'La méthode doit lire les enregistrements avec toArray().',
        passed: false,
        hint: 'Appelez `await db.livres.toArray()`'
      },
      {
        id: 'c6-3-rehydrate',
        label: 'Réhydratation avec Livre.fromDTO',
        description: 'Convertir les DTOs en Livre via Livre.fromDTO.',
        passed: false,
        hint: 'Utilisez `.map(Livre.fromDTO)`'
      },
      {
        id: 'c6-3-signal',
        label: 'Mise à jour du signal .set()',
        description: 'Mettre à jour le signal avec this.#livres.set(...).',
        passed: false,
        hint: 'Appelez `this.#livres.set(...)`'
      },
      {
        id: 'c6-3-exec',
        label: 'Signal alimenté avec succès',
        description: 'La console affiche 1 livre dans le signal et le titre "L\'Étranger".',
        passed: false,
        hint: 'Exécutez pour valider le signal'
      }
    ]
  },
  {
    id: 'ex-6-4',
    labNumber: 6,
    number: '6.4',
    title: 'Déboguer un Oubli de await',
    subtitle: 'Éviter les conditions de course entre l\'écriture disque et le rafraîchissement d\'affichage',
    sectionId: 'bibliotech-demo',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'La méthode `ajouterLivre()` ci-dessous souffre du bug classique de l\'oubli de `await` : le signal est rechargé *avant* que l\'écriture sur le disque ne soit terminée ! Corrigez la méthode en ajoutant le mot-clé `await` devant l\'opération `db.livres.add()`.',
    hint: 'Ajoutez `await` devant `db.livres.add(...)`.',
    initialCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, isbn, titre" });
  }
}

const db = new BiblioDB();
await db.open();

class BiblioManager {
  readonly #livres = signal<readonly Livre[]>([]);
  readonly livres = this.#livres.asReadonly();

  async recharger(): Promise<void> {
    const dtos = await db.livres.toArray();
    this.#livres.set(dtos.map(Livre.fromDTO));
  }

  async ajouterLivre(isbn: string, titre: string): Promise<void> {
    const livre = new Livre(crypto.randomUUID(), isbn, titre, ["Essai"], 1);
    
    // 💣 BUG À CORRIGER : Oubli de await devant db.livres.add() !
    db.livres.add(livre.toDTO()); // Corrigez cette ligne !
    
    await this.recharger();
  }
}

// Tests :
const manager = new BiblioManager();
await manager.ajouterLivre("978-2070368228", "Le Mythe de Sisyphe");
console.log("Nombre de livres après ajout synchrone :", manager.livres().length);
await db.delete();
`,
    solutionCode: `class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, isbn, titre" });
  }
}

const db = new BiblioDB();
await db.open();

class BiblioManager {
  readonly #livres = signal<readonly Livre[]>([]);
  readonly livres = this.#livres.asReadonly();

  async recharger(): Promise<void> {
    const dtos = await db.livres.toArray();
    this.#livres.set(dtos.map(Livre.fromDTO));
  }

  async ajouterLivre(isbn: string, titre: string): Promise<void> {
    const livre = new Livre(crypto.randomUUID(), isbn, titre, ["Essai"], 1);
    
    await db.livres.add(livre.toDTO());
    
    await this.recharger();
  }
}

const manager = new BiblioManager();
await manager.ajouterLivre("978-2070368228", "Le Mythe de Sisyphe");
console.log("Nombre de livres après ajout synchrone :", manager.livres().length);
await db.delete();
`,
    isCompleted: false,
    solutionExplanation: [
      'Sans `await`, `db.livres.add()` retourne immédiatement une Promise pendante.',
      '`recharger()` est appelé sur le coup, interroge IndexedDB AVANT que la transaction d\'ajout ne soit commitée, et lit 0 livre !',
      'L\'ajout de `await` garantit la séquentialité stricte de l\'écriture puis de la lecture.'
    ],
    criteria: [
      {
        id: 'c6-4-await',
        label: 'Présence de await db.livres.add',
        description: 'L\'appel db.livres.add(...) doit être précédé du mot-clé await.',
        passed: false,
        hint: 'Ajoutez `await` devant `db.livres.add(...)`'
      },
      {
        id: 'c6-4-async',
        label: 'Séquentialité respectée',
        description: 'La méthode recharger doit s\'exécuter après la fin effective de l\'ajout.',
        passed: false,
        hint: 'Veillez à ce que l\'ordre soit conservé'
      },
      {
        id: 'c6-4-exec',
        label: 'Ajout synchronisé',
        description: 'La console affiche 1 livre dans le signal immédiatement après l\'ajout.',
        passed: false,
        hint: 'Exécutez pour valider la synchronisation'
      }
    ]
  }
];
