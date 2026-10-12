import { ExerciseDef } from '../models/app.models';

export const LAB3_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-3-1',
    labNumber: 3,
    number: '3.1',
    title: 'Bannir le new hardcodé',
    subtitle: 'Injecter une abstraction de stockage au lieu d\'instancier en dur',
    sectionId: 'dip-dependency-inversion',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: `La classe ServiceAuthentification instancie directement new StockageSessionNavigateur() dans son constructeur.
1. Définissez l'interface StockageSession avec :
   - get(cle: string): string | null
   - set(cle: string, valeur: string): void
2. Refactorisez ServiceAuthentification pour injecter StockageSession dans son constructeur.
3. Implémentez StockageSessionMemoire (avec une Map ou un objet JS) pour permettre les tests en mémoire.`,
    hint: 'Remplacez le "private session = new StockageSessionNavigateur()" par une injection par constructeur : constructor(private session: StockageSession) {}',
    initialCode: `// ❌ CODE ANTI-PATTERN DIP : Instanciation directe en dur
// export class ServiceAuthentification {
//   private session = new StockageSessionNavigateur(); // Couplage fort !
//   connecter(user: string): void { this.session.set('user', user); }
// }

// TODO 1 : Définir l'interface StockageSession
export interface StockageSession {
  get(cle: string): string | null;
  set(cle: string, valeur: string): void;
}

// TODO 2 : Implémenter StockageSessionMemoire
export class StockageSessionMemoire implements StockageSession {
  // TODO : Stocker les données en mémoire (ex: Record<string, string> ou Map)
  get(cle: string): string | null {
    // TODO
    return null;
  }

  set(cle: string, valeur: string): void {
    // TODO
  }
}

// TODO 3 : Refactoriser ServiceAuthentification avec injection
export class ServiceAuthentification {
  constructor(private session?: any) {}

  connecter(utilisateur: string): void {
    // TODO : enregistrer dans this.session sous la clé 'user'
  }

  getUtilisateurConnecte(): string | null {
    // TODO : lire depuis this.session
    return null;
  }
}
`,
    solutionCode: `export interface StockageSession {
  get(cle: string): string | null;
  set(cle: string, valeur: string): void;
}

export class StockageSessionMemoire implements StockageSession {
  private donnees: Record<string, string> = {};

  get(cle: string): string | null {
    return this.donnees[cle] ?? null;
  }

  set(cle: string, valeur: string): void {
    this.donnees[cle] = valeur;
  }
}

export class ServiceAuthentification {
  constructor(private session: StockageSession) {}

  connecter(utilisateur: string): void {
    this.session.set('user', utilisateur);
  }

  getUtilisateurConnecte(): string | null {
    return this.session.get('user');
  }
}
`,
    solutionExplanation: [
      'ServiceAuthentification ne dépend plus d\'une technologie de navigateur spécifique.',
      'Grâce à l\'injection d\'interface, il fonctionne aussi bien sur serveur (Node/SSR) qu\'avec un mock en mémoire.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /new\s+StockageSessionNavigateur/,
        label: 'Pas de new StockageSessionNavigateur',
        errorMessage: 'Bannissez l\'instanciation en dur de StockageSessionNavigateur.'
      },
      {
        type: 'keyword',
        pattern: /class\s+StockageSessionMemoire/,
        label: 'class StockageSessionMemoire',
        errorMessage: 'Vous devez créer la classe StockageSessionMemoire.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const MemClass = sandbox.StockageSessionMemoire;
      const AuthClass = sandbox.ServiceAuthentification;

      if (!MemClass || !AuthClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const mem = new MemClass();
        mem.set('cle', 'valeur');
        const v = mem.get('cle');
        const p1 = v === 'valeur' && mem.get('absent') === null;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'StockageSessionMemoire ne stocke ou ne restitue pas correctement.' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const mem = new MemClass();
        const auth = new AuthClass(mem);
        auth.connecter('Alice');
        const user = auth.getUtilisateurConnecte();
        const p2 = user === 'Alice' && mem.get('user') === 'Alice';
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `ServiceAuthentification n'a pas utilisé le stockage injecté.` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Stockage mémoire opérationnel',
        description: 'StockageSessionMemoire implémente get() et set() sans dépendre du DOM.',
        passed: false,
        hint: 'Utilisez un objet privé pour stocker les paires clé/valeur.'
      },
      {
        id: 'c2',
        label: 'Injection de dépendance dans le service',
        description: 'ServiceAuthentification délègue à l\'abstraction StockageSession injectée.',
        passed: false,
        hint: 'Appelez this.session.set("user", utilisateur).'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-3-2',
    labNumber: 3,
    number: '3.2',
    title: 'Contrat de Repository de données',
    subtitle: 'Formaliser l\'interface de persistance du domaine métier',
    sectionId: 'dip-dependency-inversion',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `Définissez le contrat d'accès aux données pour le catalogue produits :
1. Interface Article : { id: string; nom: string; prix: number; }
2. Interface ArticleRepository :
   - trouverTous(): Article[]
   - sauvegarder(article: Article): void
3. Classe métier GestionCatalogue qui reçoit ArticleRepository dans son constructeur :
   - listerArticles(): Article[] (délègue à trouverTous)
   - ajouterArticle(nom: string, prix: number): void (crée l'Article et délègue à sauvegarder)`,
    hint: 'GestionCatalogue ne doit avoir aucun lien avec une base SQLite, MongoDB ou Firebase.',
    initialCode: `export interface Article {
  id: string;
  nom: string;
  prix: number;
}

// TODO 1 : Définir l'interface ArticleRepository
export interface ArticleRepository {
  trouverTous(): Article[];
  sauvegarder(article: Article): void;
}

// TODO 2 : Implémenter GestionCatalogue
export class GestionCatalogue {
  constructor(private repo: ArticleRepository) {}

  listerArticles(): Article[] {
    return [];
  }

  ajouterArticle(nom: string, prix: number): void {
    // TODO
  }
}
`,
    solutionCode: `export interface Article {
  id: string;
  nom: string;
  prix: number;
}

export interface ArticleRepository {
  trouverTous(): Article[];
  sauvegarder(article: Article): void;
}

export class GestionCatalogue {
  constructor(private repo: ArticleRepository) {}

  listerArticles(): Article[] {
    return this.repo.trouverTous();
  }

  ajouterArticle(nom: string, prix: number): void {
    const article: Article = {
      id: String(Date.now()),
      nom,
      prix
    };
    this.repo.sauvegarder(article);
  }
}
`,
    solutionExplanation: [
      'Le service GestionCatalogue (module de haut niveau) dicte l\'interface ArticleRepository.',
      'C\'est l\'infrastructure technique qui devra se plier à ce contrat, et non l\'inverse (Inversion de dépendance).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+GestionCatalogue/,
        label: 'class GestionCatalogue',
        errorMessage: 'Vous devez créer la classe GestionCatalogue.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const GestClass = sandbox.GestionCatalogue;

      if (!GestClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classe GestionCatalogue introuvable.' },
          { criterionId: 'c2', passed: false, message: 'Classe GestionCatalogue introuvable.' }
        ];
      }

      // Mock repository espion
      const articlesSauvegardes: any[] = [];
      const mockRepo = {
        trouverTous: () => [...articlesSauvegardes],
        sauvegarder: (a: any) => { articlesSauvegardes.push(a); }
      };

      try {
        const gest = new GestClass(mockRepo);
        gest.ajouterArticle('Écran 4K', 350);
        const p1 = articlesSauvegardes.length === 1 && articlesSauvegardes[0].nom === 'Écran 4K' && articlesSauvegardes[0].prix === 350;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'ajouterArticle n\'a pas sauvegardé l\'article dans le repository.' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const gest = new GestClass(mockRepo);
        const liste = gest.listerArticles();
        const p2 = Array.isArray(liste) && liste.length === 1 && liste[0].nom === 'Écran 4K';
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : 'listerArticles ne renvoie pas la liste fournie par trouverTous().' });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Création et persistance par contrat',
        description: 'ajouterArticle instancie l\'article et appelle repo.sauvegarder().',
        passed: false,
        hint: 'Appelez this.repo.sauvegarder({ id: String(Date.now()), nom, prix }).'
      },
      {
        id: 'c2',
        label: 'Lecture déléguée au repository',
        description: 'listerArticles renvoie le résultat de repo.trouverTous().',
        passed: false,
        hint: 'Retournez this.repo.trouverTous().'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-3-3',
    labNumber: 3,
    number: '3.3',
    title: 'Fake Repository pour Test Unitaire',
    subtitle: 'Implémentation en mémoire pour tests déterministes et instantanés',
    sectionId: 'dip-dependency-inversion',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Implémentez InMemoryArticleRepository pour exécuter une suite de tests unitaires sans base de données :
1. InMemoryArticleRepository implémente ArticleRepository en conservant les articles dans un tableau privé.
2. Créez la fonction executerTestUnitaire(): boolean qui :
   - Instancie un InMemoryArticleRepository
   - Instancie GestionCatalogue avec ce repository
   - Ajoute "Souris sans fil" à 25€
   - Vérifie que listerArticles() renvoie exactement 1 article portant ce nom
   - Renvoie true si le test réussit.`,
    hint: 'Ce test s\'exécute en 1 milliseconde car il ne requiert aucun I/O disque ni connexion réseau.',
    initialCode: `export interface Article {
  id: string;
  nom: string;
  prix: number;
}

export interface ArticleRepository {
  trouverTous(): Article[];
  sauvegarder(article: Article): void;
}

export class GestionCatalogue {
  constructor(private repo: ArticleRepository) {}
  listerArticles(): Article[] { return this.repo.trouverTous(); }
  ajouterArticle(nom: string, prix: number): void {
    this.repo.sauvegarder({ id: '1', nom, prix });
  }
}

// TODO 1 : Créer InMemoryArticleRepository
export class InMemoryArticleRepository implements ArticleRepository {
  private articles: Article[] = [];
  trouverTous(): Article[] {
    return [];
  }
  sauvegarder(article: Article): void {
    // TODO
  }
}

// TODO 2 : Écrire la fonction executerTestUnitaire(): boolean
export function executerTestUnitaire(): boolean {
  // TODO
  return false;
}
`,
    solutionCode: `export interface Article {
  id: string;
  nom: string;
  prix: number;
}

export interface ArticleRepository {
  trouverTous(): Article[];
  sauvegarder(article: Article): void;
}

export class GestionCatalogue {
  constructor(private repo: ArticleRepository) {}
  listerArticles(): Article[] { return this.repo.trouverTous(); }
  ajouterArticle(nom: string, prix: number): void {
    this.repo.sauvegarder({ id: String(Date.now()), nom, prix });
  }
}

export class InMemoryArticleRepository implements ArticleRepository {
  private articles: Article[] = [];

  trouverTous(): Article[] {
    return [...this.articles];
  }

  sauvegarder(article: Article): void {
    this.articles.push(article);
  }
}

export function executerTestUnitaire(): boolean {
  const repo = new InMemoryArticleRepository();
  const catalogue = new GestionCatalogue(repo);
  catalogue.ajouterArticle('Souris sans fil', 25);
  const tous = catalogue.listerArticles();
  return tous.length === 1 && tous[0].nom === 'Souris sans fil' && tous[0].prix === 25;
}
`,
    solutionExplanation: [
      'Le Fake Repository simule fidèlement le comportement d\'une base SQL en restant 100% en RAM.',
      'Le test unitaire est indépendant de l\'infrastructure, stable et instantané.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+InMemoryArticleRepository/,
        label: 'class InMemoryArticleRepository',
        errorMessage: 'Vous devez créer la classe InMemoryArticleRepository.'
      },
      {
        type: 'keyword',
        pattern: /(?:function\s+executerTestUnitaire|const\s+executerTestUnitaire\s*=)/,
        label: 'function executerTestUnitaire',
        errorMessage: 'Vous devez créer la fonction executerTestUnitaire.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const RepoClass = sandbox.InMemoryArticleRepository;
      const testFn = sandbox.executerTestUnitaire;

      if (!RepoClass || !testFn) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classe ou fonction introuvable.' },
          { criterionId: 'c2', passed: false, message: 'Classe ou fonction introuvable.' }
        ];
      }

      try {
        const repo = new RepoClass();
        repo.sauvegarder({ id: '1', nom: 'Livre', prix: 15 });
        const list = repo.trouverTous();
        const p1 = Array.isArray(list) && list.length === 1 && list[0].nom === 'Livre';
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'InMemoryArticleRepository ne stocke pas les articles en mémoire.' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const testReussi = testFn();
        results.push({ criterionId: 'c2', passed: testReussi === true, message: testReussi === true ? undefined : 'executerTestUnitaire() a renvoyé false.' });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Repository en RAM fonctionnel',
        description: 'InMemoryArticleRepository sauvegarde et liste les articles avec son tableau interne.',
        passed: false,
        hint: 'Utilisez this.articles.push(article) et return [...this.articles].'
      },
      {
        id: 'c2',
        label: 'Test unitaire réussi',
        description: 'executerTestUnitaire() valide l\'ajout et la restitution de la "Souris sans fil".',
        passed: false,
        hint: 'Instanciez le repo, le catalogue, ajoutez l\'article et vérifiez length === 1.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-3-4',
    labNumber: 3,
    number: '3.4',
    title: 'Injection Angular & Doubles de Test',
    subtitle: 'Neutraliser les requêtes HTTP lors des tests grâce à la DI',
    sectionId: 'dip-angular-testing',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Simulez la substitution d'un client HTTP par un Mock dans l'écosystème Angular :
1. Interface ApiClient : { get<T>(url: string): T }
2. Classe ProduitApiService :
   - Constructeur qui injecte ApiClient
   - chargerProduits(): string[] (appelle this.api.get('/produits') et renvoie les noms)
3. Écrivez la fonction testerAvecMock(): boolean :
   - Fournit un faux ApiClient dont get() renvoie directement ['Livre Angular', 'Guide TypeScript']
   - Instancie ProduitApiService avec ce mock
   - Vérifie que chargerProduits() renvoie les 2 livres sans déclencher de requête HTTP réelle.`,
    hint: 'Le mock se contente de renvoyer le tableau statique pour la méthode get().',
    initialCode: `export interface ApiClient {
  get<T>(url: string): T;
}

// TODO 1 : Créer ProduitApiService
export class ProduitApiService {
  constructor(private api?: any) {}

  chargerProduits(): string[] {
    // TODO : return this.api.get('/produits')
    return [];
  }
}

// TODO 2 : Écrire testerAvecMock(): boolean
export function testerAvecMock(): boolean {
  // Créer un faux ApiClient en mémoire
  // Instancier ProduitApiService avec ce mock
  // Vérifier le résultat
  return false;
}
`,
    solutionCode: `export interface ApiClient {
  get<T>(url: string): T;
}

export class ProduitApiService {
  constructor(private api: ApiClient) {}

  chargerProduits(): string[] {
    return this.api.get<string[]>('/produits');
  }
}

export function testerAvecMock(): boolean {
  const fakeApi: ApiClient = {
    get: (url: string) => ['Livre Angular', 'Guide TypeScript']
  };

  const service = new ProduitApiService(fakeApi);
  const resultat = service.chargerProduits();
  return resultat.length === 2 && resultat[0] === 'Livre Angular' && resultat[1] === 'Guide TypeScript';
}
`,
    solutionExplanation: [
      'ProduitApiService ne crée jamais d\'instance concrète de HttpClient.',
      'Dans les tests unitaires Angular, il suffit de configurer `{ provide: ApiClient, useValue: fakeApi }` pour tester instantanément.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+ProduitApiService/,
        label: 'class ProduitApiService',
        errorMessage: 'Vous devez créer la classe ProduitApiService.'
      },
      {
        type: 'keyword',
        pattern: /(?:function\s+testerAvecMock|const\s+testerAvecMock\s*=)/,
        label: 'function testerAvecMock',
        errorMessage: 'Vous devez créer la fonction testerAvecMock.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const ServClass = sandbox.ProduitApiService;
      const testFn = sandbox.testerAvecMock;

      if (!ServClass || !testFn) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classe ou fonction introuvable.' },
          { criterionId: 'c2', passed: false, message: 'Classe ou fonction introuvable.' }
        ];
      }

      try {
        let appelesUrl = '';
        const mock: any = {
          get: (u: string) => { appelesUrl = u; return ['P1', 'P2']; }
        };
        const s = new ServClass(mock);
        const res = s.chargerProduits();
        const p1 = appelesUrl === '/produits' && res.length === 2;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'ProduitApiService n\'a pas appelé api.get("/produits").' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const passed = testFn() === true;
        results.push({ criterionId: 'c2', passed, message: passed ? undefined : 'testerAvecMock() n\'a pas retourné true.' });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Service d\'API avec injection de contrat',
        description: 'ProduitApiService consomme ApiClient sans instanciation concrète.',
        passed: false,
        hint: 'Injectez api: ApiClient dans le constructeur et appelez api.get("/produits").'
      },
      {
        id: 'c2',
        label: 'Test d\'isolation avec Mock réussi',
        description: 'testerAvecMock valide les 2 produits sans réseau.',
        passed: false,
        hint: 'Fournissez un objet { get: (url) => ["Livre Angular", "Guide TypeScript"] }.'
      }
    ],
    isCompleted: false
  }
];
