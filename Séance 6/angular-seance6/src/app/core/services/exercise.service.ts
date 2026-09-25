import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  Exercise, 
  ExerciseDef, 
  ValidationSummary, 
  TabId, 
  ConsoleLogEntry,
  ValidationCriterion
} from '../models/app.models';
import { ConfettiService } from './confetti.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'seance6_exercises_progress';
  private readonly confetti = inject(ConfettiService);

  private readonly RAW_EXERCISES: ExerciseDef[] = [
    // ==========================================
    // LABO 1 : Déclaration de sous-classe & super() (4 ex)
    // ==========================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Première sous-classe avec extends & super()',
      subtitle: 'Création d\'une classe fille Livre dérivée de Media',
      sectionId: 'constructor-super',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Soit la classe de base Media (titre, annee). Déclarez la classe Livre qui hérite de Media via le mot-clé extends. Son constructeur doit accepter (titre: string, annee: number, nombrePages: number), appeler obligatoirement super(titre, annee) et stocker nombrePages.',
      hint: 'Utilisez la syntaxe : class Livre extends Media { ... constructor(...) { super(titre, annee); this.nombrePages = nombrePages; } }',
      initialCode: `// 1. Classe de base Media
class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

// 2. Déclarez ici la sous-classe Livre qui hérite de Media
class Livre extends Media {
  nombrePages: number;

  constructor(titre: string, annee: number, nombrePages: number) {
    // TODO: Appelez le constructeur parent et initialisez nombrePages
    
  }
}

// Test d'instanciation
const livre = new Livre("Dune", 1965, 412);
console.log("Livre créé :", livre.titre, "-", livre.nombrePages, "pages");
`,
      solutionCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class Livre extends Media {
  nombrePages: number;

  constructor(titre: string, annee: number, nombrePages: number) {
    super(titre, annee);
    this.nombrePages = nombrePages;
  }
}

const livre = new Livre("Dune", 1965, 412);
console.log("Livre créé :", livre.titre, "-", livre.nombrePages, "pages");
`,
      solutionExplanation: [
        'Le mot-clé "extends Media" établit formellement le lien d\'héritage prototype entre Livre et Media.',
        'L\'instruction "super(titre, annee)" doit impérativement être la toute première action pour couler les fondations mémoire de la classe mère.',
        'Une fois super() exécuté, "this" existe officiellement et l\'affectation "this.nombrePages = nombrePages" devient valide.'
      ],
      syntaxRequirements: [
        {
          type: 'keyword',
          pattern: /class\s+Livre\s+extends\s+Media/,
          label: 'Héritage extends Media',
          errorMessage: 'La classe Livre doit obligatoirement hériter de Media avec le mot-clé "extends Media".'
        },
        {
          type: 'keyword',
          pattern: /super\s*\(\s*titre\s*,\s*annee\s*\)/,
          label: 'Appel super(titre, annee)',
          errorMessage: 'Le constructeur de Livre doit appeler "super(titre, annee)".'
        }
      ],
      criteria: [
        {
          id: 'c1-extends',
          label: 'Héritage extends',
          description: 'Livre dérive correctement de Media',
          passed: false,
          hint: 'Vérifiez la clause "class Livre extends Media".'
        },
        {
          id: 'c1-super',
          label: 'Appel constructeur parent',
          description: 'super(titre, annee) est invoqué avant this.nombrePages',
          passed: false,
          hint: 'Appelez super(titre, annee) en premier dans le constructeur.'
        },
        {
          id: 'c1-instance',
          label: 'Validation d\'état',
          description: 'L\'objet créé possède titre, annee et nombrePages',
          passed: false,
          hint: 'Assurez-vous que new Livre("Dune", 1965, 412) initialise correctement les 3 propriétés.'
        }
      ],
      evaluateFn: (sandbox: any, logs: string[]) => {
        const results = [];
        const Livre = sandbox.Livre;
        const Media = sandbox.Media;

        const isExtendsValid = Livre && Media && (Livre.prototype instanceof Media);
        results.push({
          criterionId: 'c1-extends',
          passed: !!isExtendsValid,
          message: isExtendsValid ? undefined : 'Livre n\'hérite pas correctement du prototype Media.'
        });

        let instanceValid = false;
        let superValid = false;
        try {
          if (Livre) {
            const testInst = new Livre('Fondation', 1951, 255);
            if (testInst.titre === 'Fondation' && testInst.annee === 1951) {
              superValid = true;
            }
            if (testInst.nombrePages === 255) {
              instanceValid = true;
            }
          }
        } catch (e: any) {
          // Error in instantiation
        }

        results.push({
          criterionId: 'c1-super',
          passed: superValid,
          message: superValid ? undefined : 'Les attributs hérités titre et annee ne sont pas renseignés via super().'
        });

        results.push({
          criterionId: 'c1-instance',
          passed: instanceValid && superValid,
          message: (instanceValid && superValid) ? undefined : 'L\'instance de Livre ne possède pas les 3 valeurs attendues.'
        });

        return results;
      },
      isCompleted: false
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Réparer l\'ordre du constructeur (Piège TS17009)',
      subtitle: 'Accès interdit à this avant super()',
      sectionId: 'constructor-super',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement: 'Le code ci-dessous déclenche l\'erreur fatale TS17009 ("\'super\' must be called before accessing \'this\'"). Réorganisez les instructions du constructeur de Film pour respecter l\'ordre du cycle de construction.',
      hint: 'Placez toujours l\'appel super(...) AVANT toute utilisation de this.dureeMinutes.',
      initialCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class Film extends Media {
  dureeMinutes: number;

  constructor(titre: string, annee: number, dureeMinutes: number) {
    // ERREUR TS17009 : this est accédé avant que super() ne crée l'objet !
    this.dureeMinutes = dureeMinutes;
    super(titre, annee);
  }
}

const film = new Film("Inception", 2010, 148);
console.log("Film :", film.titre, "-", film.dureeMinutes, "min");
`,
      solutionCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class Film extends Media {
  dureeMinutes: number;

  constructor(titre: string, annee: number, dureeMinutes: number) {
    super(titre, annee);
    this.dureeMinutes = dureeMinutes;
  }
}

const film = new Film("Inception", 2010, 148);
console.log("Film :", film.titre, "-", film.dureeMinutes, "min");
`,
      solutionExplanation: [
        'En JavaScript / TypeScript moderne, une classe fille ne crée pas son propre contexte "this" : elle le reçoit en retour de super().',
        'Accéder à "this" avant d\'avoir exécuté super() lève une ReferenceError immédiate au runtime et une erreur TS17009 à la compilation.',
        'La correction consiste à inverser l\'ordre : super(titre, annee) d\'abord, puis this.dureeMinutes = dureeMinutes.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /super\s*\([^)]*\)[\s\S]*?this\.dureeMinutes\s*=/,
          label: 'Ordre super() avant this',
          errorMessage: 'super(...) doit obligatoirement être appelé avant l\'assignation de this.dureeMinutes.'
        }
      ],
      criteria: [
        {
          id: 'c2-order',
          label: 'Résolution TS17009',
          description: 'super() est appelé avant tout accès à this',
          passed: false,
          hint: 'Déplacez super(titre, annee) avant this.dureeMinutes.'
        },
        {
          id: 'c2-runtime',
          label: 'Exécution sans crash',
          description: 'new Film(...) s\'exécute sans ReferenceError',
          passed: false,
          hint: 'Vérifiez que le code s\'exécute sans erreur dans la console.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Film = sandbox.Film;
        let instantiated = false;
        try {
          if (Film) {
            const f = new Film('Interstellar', 2014, 169);
            instantiated = f.titre === 'Interstellar' && f.dureeMinutes === 169;
          }
        } catch (e) {
          instantiated = false;
        }

        return [
          {
            criterionId: 'c2-order',
            passed: instantiated,
            message: instantiated ? undefined : 'L\'ordre dans le constructeur provoque une erreur à l\'instanciation.'
          },
          {
            criterionId: 'c2-runtime',
            passed: instantiated,
            message: instantiated ? undefined : 'Impossible d\'instancier Film correctement.'
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Spécialisation sans nouveau paramètre',
      subtitle: 'Valeur transmise en dur à super()',
      sectionId: 'constructor-super',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement: 'Créez une classe ArticlePresse extends Media dont le constructeur ne prend qu\'un seul paramètre : "titre: string". Le constructeur doit fixer l\'année automatiquement à 2026 en appelant super(titre, 2026).',
      hint: 'Le constructeur de la fille n\'a pas l\'obligation de répéter tous les paramètres du parent : constructor(titre: string) { super(titre, 2026); }',
      initialCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

// TODO: Déclarez ArticlePresse avec un constructeur ne prenant que (titre: string)
class ArticlePresse extends Media {
  constructor(titre: string) {
    // Appelez super en fixant l'année à 2026
    
  }
}

const article = new ArticlePresse("Le Monde Informatique");
console.log("Article :", article.titre, "publié en", article.annee);
`,
      solutionCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class ArticlePresse extends Media {
  constructor(titre: string) {
    super(titre, 2026);
  }
}

const article = new ArticlePresse("Le Monde Informatique");
console.log("Article :", article.titre, "publié en", article.annee);
`,
      solutionExplanation: [
        'Une sous-classe peut simplifier l\'interface de construction pour son cas d\'usage.',
        'En passant la constante 2026 à super(titre, 2026), la classe mère Media reçoit tous les arguments requis sans encombrer l\'appelant d\'ArticlePresse.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /constructor\s*\(\s*titre[^)]*\)/,
          label: 'Constructeur à 1 seul paramètre',
          errorMessage: 'Le constructeur d\'ArticlePresse ne doit accepter que le paramètre "titre".'
        },
        {
          type: 'regex',
          pattern: /super\s*\(\s*titre\s*,\s*2026\s*\)/,
          label: 'Appel super(titre, 2026)',
          errorMessage: 'Le constructeur doit invoquer super(titre, 2026).'
        }
      ],
      criteria: [
        {
          id: 'c3-params',
          label: 'Signature épurée',
          description: 'Constructeur prenant uniquement le titre',
          passed: false,
          hint: 'Vérifiez la signature : constructor(titre: string).'
        },
        {
          id: 'c3-year',
          label: 'Année 2026 automatique',
          description: 'L\'attribut annee vaut automatiquement 2026',
          passed: false,
          hint: 'Vérifiez l\'appel : super(titre, 2026).'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Article = sandbox.ArticlePresse;
        let valid = false;
        try {
          if (Article) {
            const a = new Article('Tech News');
            valid = a.titre === 'Tech News' && a.annee === 2026;
          }
        } catch (e) {
          valid = false;
        }

        return [
          {
            criterionId: 'c3-params',
            passed: valid,
            message: valid ? undefined : 'La classe ArticlePresse ne répond pas à l\'interface demandée.'
          },
          {
            criterionId: 'c3-year',
            passed: valid,
            message: valid ? undefined : 'L\'année n\'a pas été automatiquement fixée à 2026.'
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-1-4',
      labNumber: 1,
      number: '1.4',
      title: 'Instanciation et vérification d\'héritage',
      subtitle: 'Contrôle instanceof et affichage console',
      sectionId: 'constructor-super',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Complétez le script pour instancier un objet "film" de classe Film ("Matrix", 1999, 136). Utilisez ensuite console.log() pour afficher si film est une instance de Film et s\'il est AUSSI une instance de Media via l\'opérateur instanceof.',
      hint: 'Utilisez console.log("instanceof Film :", film instanceof Film) et console.log("instanceof Media :", film instanceof Media).',
      initialCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class Film extends Media {
  dureeMinutes: number;

  constructor(titre: string, annee: number, dureeMinutes: number) {
    super(titre, annee);
    this.dureeMinutes = dureeMinutes;
  }
}

// TODO:
// 1. Instanciez un Film ("Matrix", 1999, 136) dans la variable film
// 2. Affichez via console.log le résultat de (film instanceof Film)
// 3. Affichez via console.log le résultat de (film instanceof Media)

const film = null;
`,
      solutionCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class Film extends Media {
  dureeMinutes: number;

  constructor(titre: string, annee: number, dureeMinutes: number) {
    super(titre, annee);
    this.dureeMinutes = dureeMinutes;
  }
}

const film = new Film("Matrix", 1999, 136);
console.log("instanceof Film :", film instanceof Film);
console.log("instanceof Media :", film instanceof Media);
`,
      solutionExplanation: [
        'L\'opérateur "instanceof" remonte toute la chaîne des prototypes.',
        'Un objet de type Film est à la fois une instance de Film (sa classe concrète) ET une instance de Media (sa superclasse).',
        'Cette double identité est le fondement même du polymorphisme.'
      ],
      syntaxRequirements: [
        {
          type: 'keyword',
          pattern: /new\s+Film\s*\(\s*["']Matrix["']\s*,\s*1999\s*,\s*136\s*\)/,
          label: 'Instanciation de Film',
          errorMessage: 'Instanciez Film avec les valeurs ("Matrix", 1999, 136).'
        },
        {
          type: 'keyword',
          pattern: /instanceof\s+Media/,
          label: 'Vérification instanceof Media',
          errorMessage: 'Utilisez "instanceof Media" pour contrôler la chaîne d\'héritage.'
        }
      ],
      criteria: [
        {
          id: 'c4-inst',
          label: 'Création du film',
          description: 'film est instancié avec titre, année et durée',
          passed: false,
          hint: 'const film = new Film("Matrix", 1999, 136);'
        },
        {
          id: 'c4-instanceof',
          label: 'Double identité prototypale',
          description: 'Contrôle que film instanceof Media est true',
          passed: false,
          hint: 'Affichez les tests instanceof dans la console.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const film = sandbox.film;
        const Media = sandbox.Media;
        const Film = sandbox.Film;

        const isInst = film && Film && (film instanceof Film);
        const isMedia = film && Media && (film instanceof Media);

        return [
          {
            criterionId: 'c4-inst',
            passed: !!isInst && film.titre === 'Matrix',
            message: isInst ? undefined : 'L\'objet film n\'est pas instancié correctement.'
          },
          {
            criterionId: 'c4-instanceof',
            passed: !!isMedia,
            message: isMedia ? undefined : 'film instanceof Media doit valoir true.'
          }
        ];
      },
      isCompleted: false
    },

    // ==========================================
    // LABO 2 : Encapsulation & Visibilité protected (3 ex)
    // ==========================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Corriger le blocage private avec protected',
      subtitle: 'Permettre l\'accès aux sous-classes sans exposer à l\'extérieur',
      sectionId: 'protected-encapsulation',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Dans le code ci-dessous, la classe fille Livre déclenche une erreur TS2341 car elle tente d\'accéder à "this.titre" qui est déclaré "private" dans Media. Remplacez le modificateur "private" par "protected" dans Media pour permettre l\'accès à la famille tout en protégeant le champ du monde extérieur.',
      hint: 'Remplacez "private titre: string;" par "protected titre: string;".',
      initialCode: `class Media {
  // ❌ private bloque même les classes filles !
  private titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class Livre extends Media {
  nombrePages: number;

  constructor(titre: string, annee: number, nombrePages: number) {
    super(titre, annee);
    this.nombrePages = nombrePages;
  }

  // Cette méthode a besoin d'accéder à titre :
  afficherResume(): string {
    return this.titre.toUpperCase() + " (" + this.annee + ")";
  }
}

const livre = new Livre("Le Petit Prince", 1943, 96);
console.log(livre.afficherResume());
`,
      solutionCode: `class Media {
  // ✅ protected rend l'attribut accessible dans Media et toutes ses classes filles
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

class Livre extends Media {
  nombrePages: number;

  constructor(titre: string, annee: number, nombrePages: number) {
    super(titre, annee);
    this.nombrePages = nombrePages;
  }

  afficherResume(): string {
    return this.titre.toUpperCase() + " (" + this.annee + ")";
  }
}

const livre = new Livre("Le Petit Prince", 1943, 96);
console.log(livre.afficherResume());
`,
      solutionExplanation: [
        'Le modificateur "private" est strictement hermétique à la classe exacte où il est déclaré : même les sous-classes dérivées ne peuvent pas y toucher.',
        'Le modificateur "protected" est le "secret de famille" : il autorise l\'accès à la classe mère et à toutes ses sous-classes (Livre, Film, etc.), tout en restant strictement interdit à l\'extérieur.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /protected\s+titre\s*:\s*string/,
          label: 'protected titre: string',
          errorMessage: 'Déclarez "protected titre: string;" dans la classe Media.'
        }
      ],
      criteria: [
        {
          id: 'c21-protected',
          label: 'Modificateur protected',
          description: 'L\'attribut titre est protégé et accessible aux classes filles',
          passed: false,
          hint: 'Changez private en protected sur le champ titre de Media.'
        },
        {
          id: 'c21-method',
          label: 'Exécution méthode fille',
          description: 'afficherResume() renvoie le titre en majuscules',
          passed: false,
          hint: 'Vérifiez la valeur retournée : "LE PETIT PRINCE (1943)".'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Livre = sandbox.Livre;
        let methodOutput = '';
        try {
          if (Livre) {
            const l = new Livre('Le Petit Prince', 1943, 96);
            methodOutput = l.afficherResume();
          }
        } catch (e) {}

        const passed = methodOutput.includes('LE PETIT PRINCE');
        return [
          {
            criterionId: 'c21-protected',
            passed,
            message: passed ? undefined : 'titre n\'est pas accessible depuis Livre.'
          },
          {
            criterionId: 'c21-method',
            passed,
            message: passed ? undefined : 'afficherResume() n\'a pas retourné le résultat escompté.'
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Respecter l\'hermétisme extérieur avec un getter public',
      subtitle: 'Accès sécurisé en lecture seule',
      sectionId: 'protected-encapsulation',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Dans une classe Media avec "protected annee: number", ajoutez un getter public "get publication(): number" permettant au monde extérieur de lire l\'année sans pouvoir la corrompre de l\'extérieur.',
      hint: 'Dans Media, écrivez : public get publication(): number { return this.annee; }',
      initialCode: `class Media {
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  // TODO: Ajoutez ici un getter public "publication" qui retourne this.annee
  
}

const media = new Media("1984", 1949);
// Ce code extérieur doit pouvoir lire media.publication :
console.log("Année de publication :", media.publication);
`,
      solutionCode: `class Media {
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  public get publication(): number {
    return this.annee;
  }
}

const media = new Media("1984", 1949);
console.log("Année de publication :", media.publication);
`,
      solutionExplanation: [
        'En gardant "annee" en "protected", les sous-classes peuvent l\'utiliser pour des calculs internes sans l\'exposer publiquement à l\'écriture.',
        'Le getter public "get publication()" offre une passerelle de lecture sécurisée (lecture seule) pour le monde extérieur.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /get\s+publication\s*\(\s*\)/,
          label: 'Getter public publication',
          errorMessage: 'Déclarez le getter "get publication(): number { return this.annee; }".'
        }
      ],
      criteria: [
        {
          id: 'c22-getter',
          label: 'Getter publication',
          description: 'Présence du getter get publication()',
          passed: false,
          hint: 'Déclarez get publication() dans Media.'
        },
        {
          id: 'c22-read',
          label: 'Lecture sécurisée',
          description: 'media.publication retourne la valeur 1949',
          passed: false,
          hint: 'Vérifiez que media.publication renvoie bien 1949.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Media = sandbox.Media;
        let value = 0;
        try {
          if (Media) {
            const m = new Media('1984', 1949);
            value = m.publication;
          }
        } catch (e) {}

        const passed = value === 1949;
        return [
          {
            criterionId: 'c22-getter',
            passed,
            message: passed ? undefined : 'Getter publication absent ou non fonctionnel.'
          },
          {
            criterionId: 'c22-read',
            passed,
            message: passed ? undefined : 'media.publication n\'a pas retourné l\'année 1949.'
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Secret de famille : CompteBancaire & CompteCourant',
      subtitle: 'Vérification de découvert via protected solde',
      sectionId: 'protected-encapsulation',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Définissez la classe CompteBancaire avec "protected solde: number". Créez la sous-classe CompteCourant (prenant solde et decouvertMax: number). Implémentez la méthode "retirer(montant: number): boolean" dans CompteCourant : si (this.solde - montant >= -this.decouvertMax), soustrayez le montant de this.solde et renvoyez true, sinon renvoyez false.',
      hint: 'Dans CompteCourant: if (this.solde - montant >= -this.decouvertMax) { this.solde -= montant; return true; } return false;',
      initialCode: `class CompteBancaire {
  protected solde: number;

  constructor(soldeInitial: number) {
    this.solde = soldeInitial;
  }

  getSolde(): number {
    return this.solde;
  }
}

class CompteCourant extends CompteBancaire {
  private decouvertMax: number;

  constructor(soldeInitial: number, decouvertMax: number) {
    super(soldeInitial);
    this.decouvertMax = decouvertMax;
  }

  // TODO: Implémentez retirer(montant: number): boolean
  // Utilisez directement this.solde (protégé)
  retirer(montant: number): boolean {
    
    return false;
  }
}

const compte = new CompteCourant(100, 200); // 100€ de solde, jusqu'à -200€ autorisé
console.log("Retrait 250€ :", compte.retirer(250)); // doit renvoyer true (solde restant = -150)
console.log("Nouveau solde :", compte.getSolde());
console.log("Retrait 100€ :", compte.retirer(100)); // doit renvoyer false (-250 dépasserait -200)
`,
      solutionCode: `class CompteBancaire {
  protected solde: number;

  constructor(soldeInitial: number) {
    this.solde = soldeInitial;
  }

  getSolde(): number {
    return this.solde;
  }
}

class CompteCourant extends CompteBancaire {
  private decouvertMax: number;

  constructor(soldeInitial: number, decouvertMax: number) {
    super(soldeInitial);
    this.decouvertMax = decouvertMax;
  }

  retirer(montant: number): boolean {
    if (this.solde - montant >= -this.decouvertMax) {
      this.solde -= montant;
      return true;
    }
    return false;
  }
}

const compte = new CompteCourant(100, 200);
console.log("Retrait 250€ :", compte.retirer(250));
console.log("Nouveau solde :", compte.getSolde());
console.log("Retrait 100€ :", compte.retirer(100));
`,
      solutionExplanation: [
        'Grâce à "protected solde", la sous-classe CompteCourant manipule directement la trésorerie sans passer par un setter public qui autoriserait n\'importe quel tiers à fausser le solde.',
        'La logique métier du découvert maximal reste complètement encapsulée dans la classe spécialisée.'
      ],
      syntaxRequirements: [
        {
          type: 'keyword',
          pattern: /this\.solde\s*-=/,
          label: 'Modification directe du solde protégé',
          errorMessage: 'CompteCourant doit mettre à jour "this.solde".'
        }
      ],
      criteria: [
        {
          id: 'c23-logic',
          label: 'Respect du découvert',
          description: 'Autorise le retrait si solde - montant >= -decouvertMax',
          passed: false,
          hint: 'Vérifiez la condition de découvert dans la méthode retirer().'
        },
        {
          id: 'c23-update',
          label: 'Débit effectif',
          description: 'Le solde est débité lors d\'un retrait valide',
          passed: false,
          hint: 'Décrémentez this.solde du montant retiré.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const CompteCourant = sandbox.CompteCourant;
        let test1 = false;
        let test2 = false;
        try {
          if (CompteCourant) {
            const c = new CompteCourant(100, 200);
            const r1 = c.retirer(250); // true, solde = -150
            const s1 = c.getSolde() === -150;
            const r2 = c.retirer(100); // false (-250 < -200)
            test1 = r1 && s1;
            test2 = !r2 && c.getSolde() === -150;
          }
        } catch (e) {}

        return [
          {
            criterionId: 'c23-logic',
            passed: test1 && test2,
            message: (test1 && test2) ? undefined : 'La méthode retirer ne gère pas correctement les plafonds de découvert.'
          },
          {
            criterionId: 'c23-update',
            passed: test1,
            message: test1 ? undefined : 'Le solde protégé n\'est pas correctement décrémenté.'
          }
        ];
      },
      isCompleted: false
    },

    // ==========================================
    // LABO 3 : Redéfinition (override) & super.methode() (4 ex)
    // ==========================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Spécialisation de méthode avec override obligatoire',
      subtitle: 'Redéfinition propre de getDescription() dans Film',
      sectionId: 'override-enrichment',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Redéfinissez la méthode "getDescription(): string" dans la classe Film en utilisant obligatoirement le mot-clé "override". Elle doit renvoyer la chaîne exacte : "[titre] ([annee]) — durée : [dureeMinutes] min".',
      hint: 'Écrivez : override getDescription(): string { return `${this.titre} (${this.annee}) — durée : ${this.dureeMinutes} min`; }',
      initialCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  getDescription(): string {
    return \`\${this.titre} (\${this.annee})\`;
  }
}

class Film extends Media {
  dureeMinutes: number;

  constructor(titre: string, annee: number, dureeMinutes: number) {
    super(titre, annee);
    this.dureeMinutes = dureeMinutes;
  }

  // TODO: Redéfinissez getDescription() avec le mot-clé override
  
}

const film = new Film("Gladiator", 2000, 155);
console.log(film.getDescription());
`,
      solutionCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  getDescription(): string {
    return \`\${this.titre} (\${this.annee})\`;
  }
}

class Film extends Media {
  dureeMinutes: number;

  constructor(titre: string, annee: number, dureeMinutes: number) {
    super(titre, annee);
    this.dureeMinutes = dureeMinutes;
  }

  override getDescription(): string {
    return \`\${this.titre} (\${this.annee}) — durée : \${this.dureeMinutes} min\`;
  }
}

const film = new Film("Gladiator", 2000, 155);
console.log(film.getDescription());
`,
      solutionExplanation: [
        'Le mot-clé "override" informe le compilateur TypeScript que cette méthode a l\'intention délibérée de remplacer celle de la classe parente.',
        'Si la classe mère renomme un jour sa méthode en "formatDescription()", le compilateur refusera de compiler avec l\'erreur TS4113, évitant un bug silencieux catastrophique.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /override\s+getDescription\s*\(\s*\)/,
          label: 'Mot-clé override obligatoire',
          errorMessage: 'La méthode getDescription() de Film doit être préfixée par "override".'
        }
      ],
      criteria: [
        {
          id: 'c31-keyword',
          label: 'Mot-clé override',
          description: 'Présence explicite du mot-clé override',
          passed: false,
          hint: 'Ajoutez "override" devant getDescription().'
        },
        {
          id: 'c31-output',
          label: 'Formatage spécialisé',
          description: 'Renvoie le format avec titre, année et durée',
          passed: false,
          hint: 'Vérifiez le format : "Gladiator (2000) — durée : 155 min".'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Film = sandbox.Film;
        let res = '';
        try {
          if (Film) {
            const f = new Film('Gladiator', 2000, 155);
            res = f.getDescription();
          }
        } catch (e) {}

        const passed = res.includes('Gladiator') && res.includes('2000') && res.includes('155 min');
        return [
          {
            criterionId: 'c31-keyword',
            passed,
            message: passed ? undefined : 'La méthode redéfinie n\'est pas détectée ou ne fonctionne pas.'
          },
          {
            criterionId: 'c31-output',
            passed,
            message: passed ? undefined : `Résultat inattendu : "${res}". Attendu : "Gladiator (2000) — durée : 155 min".`
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Détecter la coquille grâce à override (TS4113)',
      subtitle: 'Correction d\'une faute de frappe fatale',
      sectionId: 'override-enrichment',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement: 'Dans le code ci-dessous, la classe fille a écrit "override getdescription()" (avec un "d" minuscule). TypeScript signale l\'erreur TS4113 car Media ne possède pas de méthode "getdescription". Corrigez la casse du nom de méthode pour rétablir la concordance.',
      hint: 'Remplacez "getdescription()" par "getDescription()".',
      initialCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  getDescription(): string {
    return \`\${this.titre} (\${this.annee})\`;
  }
}

class Podcast extends Media {
  episode: number;

  constructor(titre: string, annee: number, episode: number) {
    super(titre, annee);
    this.episode = episode;
  }

  // ❌ ERREUR TS4113 : "getdescription" n'existe pas dans Media !
  override getdescription(): string {
    return \`\${this.titre} - Épisode \${this.episode}\`;
  }
}

const podcast = new Podcast("DevPod", 2026, 42);
console.log(podcast.getDescription());
`,
      solutionCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  getDescription(): string {
    return \`\${this.titre} (\${this.annee})\`;
  }
}

class Podcast extends Media {
  episode: number;

  constructor(titre: string, annee: number, episode: number) {
    super(titre, annee);
    this.episode = episode;
  }

  // ✅ Corrigé en camelCase "getDescription"
  override getDescription(): string {
    return \`\${this.titre} - Épisode \${this.episode}\`;
  }
}

const podcast = new Podcast("DevPod", 2026, 42);
console.log(podcast.getDescription());
`,
      solutionExplanation: [
        'Sans le mot-clé "override", JavaScript aurait silencieusement créé une NOUVELLE méthode orpheline "getdescription()", et tout appel à podcast.getDescription() aurait exécuté le code parent !',
        'Grâce à "override" et à l\'option "noImplicitOverride: true", TypeScript intercepte immédiatement la coquille.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /override\s+getDescription\s*\(\s*\)/,
          label: 'Nom de méthode corrigé : getDescription()',
          errorMessage: 'La méthode doit s\'appeler exactement "getDescription()" avec un D majuscule.'
        }
      ],
      criteria: [
        {
          id: 'c32-typo',
          label: 'Correction de la casse',
          description: 'La méthode s\'appelle getDescription() avec override',
          passed: false,
          hint: 'Corrigez le nom : override getDescription().'
        },
        {
          id: 'c32-exec',
          label: 'Exécution polymorphique',
          description: 'podcast.getDescription() exécute la spécialisation',
          passed: false,
          hint: 'Vérifiez la sortie : "DevPod - Épisode 42".'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Podcast = sandbox.Podcast;
        let out = '';
        try {
          if (Podcast) {
            const p = new Podcast('DevPod', 2026, 42);
            out = p.getDescription();
          }
        } catch (e) {}

        const passed = out.includes('DevPod') && out.includes('Épisode 42');
        return [
          {
            criterionId: 'c32-typo',
            passed,
            message: passed ? undefined : 'La méthode override getDescription n\'est pas trouvée.'
          },
          {
            criterionId: 'c32-exec',
            passed,
            message: passed ? undefined : `podcast.getDescription() a renvoyé "${out}" au lieu de la version spécialisée.`
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Enrichir avec super.methode()',
      subtitle: 'Greffer la spécialité sans réécrire le tronc commun',
      sectionId: 'override-enrichment',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Dans la classe Livre, redéfinissez getDescription() en appelant la méthode parent "super.getDescription()" et en lui accolant " — [nombrePages] pages". Ne réécrivez PAS le titre et l\'année à la main !',
      hint: 'Écrivez : override getDescription(): string { return `${super.getDescription()} — ${this.nombrePages} pages`; }',
      initialCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  getDescription(): string {
    return \`« \${this.titre} » (\${this.annee})\`;
  }
}

class Livre extends Media {
  nombrePages: number;

  constructor(titre: string, annee: number, nombrePages: number) {
    super(titre, annee);
    this.nombrePages = nombrePages;
  }

  // TODO: Redéfinissez getDescription() en utilisant super.getDescription()
  override getDescription(): string {
    
    return "";
  }
}

const livre = new Livre("Clean Code", 2008, 464);
console.log(livre.getDescription());
`,
      solutionCode: `class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  getDescription(): string {
    return \`« \${this.titre} » (\${this.annee})\`;
  }
}

class Livre extends Media {
  nombrePages: number;

  constructor(titre: string, annee: number, nombrePages: number) {
    super(titre, annee);
    this.nombrePages = nombrePages;
  }

  override getDescription(): string {
    return \`\${super.getDescription()} — \${this.nombrePages} pages\`;
  }
}

const livre = new Livre("Clean Code", 2008, 464);
console.log(livre.getDescription());
`,
      solutionExplanation: [
        'L\'instruction "super.getDescription()" invoque explicitement l\'implémentation définie dans Media.',
        'Cette approche respecte le principe DRY : si la classe mère décide demain de modifier son format (ex: ajouter des guillemets ou des crochets), Livre en bénéficiera automatiquement sans modifier une seule ligne !'
      ],
      syntaxRequirements: [
        {
          type: 'keyword',
          pattern: /super\.getDescription\s*\(\s*\)/,
          label: 'Appel super.getDescription()',
          errorMessage: 'Vous devez appeler "super.getDescription()" pour récupérer la description de base.'
        },
        {
          type: 'keyword',
          pattern: /override/,
          label: 'Mot-clé override',
          errorMessage: 'La méthode doit être annotée "override".'
        }
      ],
      criteria: [
        {
          id: 'c33-supercall',
          label: 'Enrichissement via super',
          description: 'super.getDescription() est appelé pour former la chaîne',
          passed: false,
          hint: 'Utilisez super.getDescription() dans votre return.'
        },
        {
          id: 'c33-complete',
          label: 'Résultat conforme',
          description: 'Chaîne finale incluant guillemets, année et pages',
          passed: false,
          hint: 'Vérifiez le résultat : "« Clean Code » (2008) — 464 pages".'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Livre = sandbox.Livre;
        let out = '';
        try {
          if (Livre) {
            const l = new Livre('Clean Code', 2008, 464);
            out = l.getDescription();
          }
        } catch (e) {}

        const passed = out.includes('« Clean Code » (2008)') && out.includes('464 pages');
        return [
          {
            criterionId: 'c33-supercall',
            passed,
            message: passed ? undefined : 'super.getDescription() n\'a pas été utilisé pour récupérer la chaîne parent.'
          },
          {
            criterionId: 'c33-complete',
            passed,
            message: passed ? undefined : `Sortie incorrecte : "${out}". Attendu : "« Clean Code » (2008) — 464 pages".`
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-3-4',
      labNumber: 3,
      number: '3.4',
      title: 'Chaînage de calculs avec super.methode()',
      subtitle: 'Calcul de prime managériale greffée au salaire de base',
      sectionId: 'override-enrichment',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement: 'Soit la classe Employe avec la méthode "calculerSalaire(): number" (qui renvoie 2000). Créez la sous-classe Manager extends Employe dont la méthode override "calculerSalaire(): number" appelle "super.calculerSalaire()" et y ajoute une prime de 500.',
      hint: 'Dans Manager: override calculerSalaire(): number { return super.calculerSalaire() + 500; }',
      initialCode: `class Employe {
  nom: string;

  constructor(nom: string) {
    this.nom = nom;
  }

  calculerSalaire(): number {
    return 2000; // Salaire fixe de base
  }
}

// TODO: Créez la sous-classe Manager extends Employe
// Sa méthode calculerSalaire() doit appeler super.calculerSalaire() + 500
class Manager extends Employe {
  // Implémentez ici la redéfinition
  
}

const manager = new Manager("Alice");
console.log("Salaire du manager :", manager.calculerSalaire(), "€");
`,
      solutionCode: `class Employe {
  nom: string;

  constructor(nom: string) {
    this.nom = nom;
  }

  calculerSalaire(): number {
    return 2000;
  }
}

class Manager extends Employe {
  override calculerSalaire(): number {
    return super.calculerSalaire() + 500;
  }
}

const manager = new Manager("Alice");
console.log("Salaire du manager :", manager.calculerSalaire(), "€");
`,
      solutionExplanation: [
        'Le chaînage de calculs numériques via "super.calculerSalaire() + prime" évite de dupliquer la formule de rémunération du personnel.',
        'Si le salaire plancher passe à 2100€ dans Employe, tous les managers percevront automatiquement 2600€ sans recalibrer leur classe.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /super\.calculerSalaire\s*\(\s*\)\s*\+\s*500/,
          label: 'super.calculerSalaire() + 500',
          errorMessage: 'La méthode doit retourner super.calculerSalaire() + 500.'
        }
      ],
      criteria: [
        {
          id: 'c34-chain',
          label: 'Chaînage super.calculerSalaire()',
          description: 'Le calcul s\'appuie sur la méthode parente',
          passed: false,
          hint: 'Invoquez super.calculerSalaire() dans l\'addition.'
        },
        {
          id: 'c34-val',
          label: 'Montant total 2500€',
          description: 'manager.calculerSalaire() renvoie exactement 2500',
          passed: false,
          hint: 'Vérifiez que le retour est bien 2500.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Manager = sandbox.Manager;
        let sal = 0;
        try {
          if (Manager) {
            const m = new Manager('Alice');
            sal = m.calculerSalaire();
          }
        } catch (e) {}

        const passed = sal === 2500;
        return [
          {
            criterionId: 'c34-chain',
            passed,
            message: passed ? undefined : 'La méthode n\'effectue pas le chaînage parent.'
          },
          {
            criterionId: 'c34-val',
            passed,
            message: passed ? undefined : `Montant retourné : ${sal}€. Attendu : 2500€.`
          }
        ];
      },
      isCompleted: false
    },

    // ==========================================
    // LABO 4 : Discernement Architectural (« Est-un » vs « A-un ») (3 ex)
    // ==========================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Réfutation d\'un anti-pattern : Facture & Client',
      subtitle: 'Remplacer l\'héritage abusif par de la composition',
      sectionId: 'is-a-vs-has-a',
      estimatedTime: '6 min',
      difficulty: 'Facile',
      statement: 'Le code ci-dessous utilise une relation absurde : "class Facture extends Client" (une facture N\'EST PAS un client !). Refactorisez ce code en retirant le mot-clé extends et en dotant Facture d\'un attribut "client: Client" et d\'un attribut "montant: number".',
      hint: 'class Facture { constructor(public client: Client, public montant: number) {} }',
      initialCode: `class Client {
  constructor(public nom: string, public email: string) {}
}

// ❌ HÉRÉSIE ARCHITECTURALE : Héritage par commodité
class Facture extends Client {
  constructor(nom: string, email: string, public montant: number) {
    super(nom, email);
  }
}

// TODO: Refactorisez Facture pour utiliser la COMPOSITION :
// Une facture POSSÈDE un client (client: Client).
`,
      solutionCode: `class Client {
  constructor(public nom: string, public email: string) {}
}

// ✅ COMPOSITION SAINE : Une facture "a un" client
class Facture {
  client: Client;
  montant: number;

  constructor(client: Client, montant: number) {
    this.client = client;
    this.montant = montant;
  }
}

const client = new Client("Dupont SA", "contact@dupont.com");
const facture = new Facture(client, 1500);
console.log("Facture pour :", facture.client.nom, "-", facture.montant, "€");
`,
      solutionExplanation: [
        'L\'héritage par commodité consiste à hériter d\'une classe juste pour réutiliser deux champs ("nom", "email"), sans respecter la relation sémantique "Est-un".',
        'Une Facture n\'est pas un Client : elle n\'a pas de mot de passe, ne se connecte pas au site. La composition ("Facture a un Client") est la seule architecture saine et évolutive.'
      ],
      syntaxRequirements: [
        {
          type: 'forbidden',
          pattern: /class\s+Facture\s+extends\s+Client/,
          label: 'Pas de extends Client',
          errorMessage: 'Facture ne doit PAS hériter de Client.'
        }
      ],
      criteria: [
        {
          id: 'c41-noextends',
          label: 'Suppression extends',
          description: 'Facture n\'hérite plus de Client',
          passed: false,
          hint: 'Supprimez "extends Client" sur Facture.'
        },
        {
          id: 'c41-composition',
          label: 'Attribut client: Client',
          description: 'Facture détient une référence vers une instance de Client',
          passed: false,
          hint: 'Passez une instance de Client dans le constructeur de Facture.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Client = sandbox.Client;
        const Facture = sandbox.Facture;

        let ok = false;
        try {
          if (Client && Facture) {
            const isSubclass = Facture.prototype instanceof Client;
            const c = new Client('Acme', 'a@a.com');
            const f = new Facture(c, 500);
            if (!isSubclass && f.client === c && f.montant === 500) {
              ok = true;
            }
          }
        } catch (e) {}

        return [
          {
            criterionId: 'c41-noextends',
            passed: ok,
            message: ok ? undefined : 'Facture est toujours dérivée de Client ou mal instanciée.'
          },
          {
            criterionId: 'c41-composition',
            passed: ok,
            message: ok ? undefined : 'Facture ne possède pas la référence client demandée.'
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Refactoring Aile / Avion',
      subtitle: 'Remplacer l\'héritage du tout par ses parties',
      sectionId: 'is-a-vs-has-a',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Un avion n\'est pas une aile : un avion A des ailes ! Corrigez la classe Avion pour qu\'elle ne dérive plus de Aile, mais contienne un tableau "ailes: Aile[]" et une méthode "ajouterAile(aile: Aile): void".',
      hint: 'class Avion { ailes: Aile[] = []; ajouterAile(aile: Aile) { this.ailes.push(aile); } }',
      initialCode: `class Aile {
  constructor(public envergureMetres: number) {}
}

// ❌ ERREUR : Un avion n'est pas une aile !
class Avion extends Aile {
  constructor(envergure: number, public modele: string) {
    super(envergure);
  }
}

// TODO: Refactorisez Avion pour qu'il POSSÈDE des ailes (ailes: Aile[])
`,
      solutionCode: `class Aile {
  constructor(public envergureMetres: number) {}
}

class Avion {
  modele: string;
  ailes: Aile[] = [];

  constructor(modele: string) {
    this.modele = modele;
  }

  ajouterAile(aile: Aile): void {
    this.ailes.push(aile);
  }
}

const avion = new Avion("A350");
avion.ajouterAile(new Aile(32));
avion.ajouterAile(new Aile(32));
console.log("Avion", avion.modele, "avec", avion.ailes.length, "ailes");
`,
      solutionExplanation: [
        'Confondre le tout et ses composants ("L\'avion est une aile") est une erreur classique de modélisation.',
        'La composition modélise fidèlement le monde réel : un avion possède plusieurs pièces détachées distinctes qu\'il assemble.'
      ],
      syntaxRequirements: [
        {
          type: 'forbidden',
          pattern: /class\s+Avion\s+extends\s+Aile/,
          label: 'Pas de extends Aile',
          errorMessage: 'Avion ne doit plus hériter de Aile.'
        }
      ],
      criteria: [
        {
          id: 'c42-parts',
          label: 'Composition de pièces',
          description: 'Avion possède une collection d\'ailes',
          passed: false,
          hint: 'Déclarez ailes: Aile[] dans Avion.'
        },
        {
          id: 'c42-add',
          label: 'Méthode ajouterAile',
          description: 'Permet d\'ajouter dynamiquement une aile',
          passed: false,
          hint: 'Implémentez ajouterAile(aile: Aile) via push.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const Avion = sandbox.Avion;
        const Aile = sandbox.Aile;

        let ok = false;
        try {
          if (Avion && Aile) {
            const av = new Avion('B787');
            if (!(av instanceof Aile) && typeof av.ajouterAile === 'function') {
              av.ajouterAile(new Aile(30));
              ok = av.ailes.length === 1;
            }
          }
        } catch (e) {}

        return [
          {
            criterionId: 'c42-parts',
            passed: ok,
            message: ok ? undefined : 'Avion n\'a pas la structure de composition attendue.'
          },
          {
            criterionId: 'c42-add',
            passed: ok,
            message: ok ? undefined : 'ajouterAile n\'ajoute pas l\'aile dans la collection.'
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Aplatir une hiérarchie yo-yo',
      subtitle: 'Passer de 4 niveaux superflus à une conception directe à 2 niveaux',
      sectionId: 'fragile-base-class',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement: 'Voici une chaîne d\'héritage exagérée : Entite -> RessourceWeb -> MediaNumerique -> ArticleBlog. Aplatissez cette hiérarchie toxique : gardez une seule classe de base "DocumentMetier (id, titre)" et faites hériter "ArticleBlog" directement de "DocumentMetier".',
      hint: 'Supprimez RessourceWeb et MediaNumerique pour faire : class ArticleBlog extends DocumentMetier',
      initialCode: `// ❌ Effet Yo-Yo : 4 niveaux pour stocker 3 pauvres propriétés !
class Entite {
  constructor(public id: string) {}
}

class RessourceWeb extends Entite {
  constructor(id: string, public url: string) {
    super(id);
  }
}

class MediaNumerique extends RessourceWeb {
  constructor(id: string, url: string, public titre: string) {
    super(id, url);
  }
}

class ArticleBlog extends MediaNumerique {
  constructor(id: string, url: string, titre: string, public contenu: string) {
    super(id, url, titre);
  }
}

// TODO: Simplifiez ! Ne gardez que DocumentMetier (id, titre) et ArticleBlog extends DocumentMetier (id, titre, contenu)
`,
      solutionCode: `// ✅ Hiérarchie saine et lisible à 2 niveaux
class DocumentMetier {
  constructor(public id: string, public titre: string) {}
}

class ArticleBlog extends DocumentMetier {
  constructor(id: string, titre: string, public contenu: string) {
    super(id, titre);
  }
}

const article = new ArticleBlog("art-1", "Comprendre l'Héritage", "Voici le contenu...");
console.log("Article simplifié :", article.id, "-", article.titre);
`,
      solutionExplanation: [
        'L\'effet Yo-Yo survient lorsque des développeurs créent des couches d\'abstractions intermédiaires "au cas où" sans justification métier réelle.',
        'La règle d\'or de l\'architecture logicielle moderne est de ne jamais dépasser 2 à 3 niveaux d\'héritage pour préserver la lisibilité du code.'
      ],
      syntaxRequirements: [
        {
          type: 'keyword',
          pattern: /class\s+ArticleBlog\s+extends\s+DocumentMetier/,
          label: 'ArticleBlog extends DocumentMetier',
          errorMessage: 'ArticleBlog doit dériver directement de DocumentMetier.'
        }
      ],
      criteria: [
        {
          id: 'c43-flat',
          label: 'Hiérarchie aplatie',
          description: 'ArticleBlog dérive directement de DocumentMetier',
          passed: false,
          hint: 'Reliez ArticleBlog à DocumentMetier directement.'
        },
        {
          id: 'c43-props',
          label: 'Propriétés préservées',
          description: 'L\'article possède id, titre et contenu',
          passed: false,
          hint: 'Vérifiez la présence des 3 attributs.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const ArticleBlog = sandbox.ArticleBlog;
        const DocumentMetier = sandbox.DocumentMetier;

        let ok = false;
        try {
          if (ArticleBlog && DocumentMetier) {
            const isDirect = ArticleBlog.prototype instanceof DocumentMetier;
            const a = new ArticleBlog('1', 'Titre', 'Texte');
            ok = isDirect && a.id === '1' && a.titre === 'Titre' && a.contenu === 'Texte';
          }
        } catch (e) {}

        return [
          {
            criterionId: 'c43-flat',
            passed: ok,
            message: ok ? undefined : 'La hiérarchie n\'a pas été aplatie vers DocumentMetier.'
          },
          {
            criterionId: 'c43-props',
            passed: ok,
            message: ok ? undefined : 'Les attributs id, titre et contenu ne sont pas correctement assignés.'
          }
        ];
      },
      isCompleted: false
    },

    // ==========================================
    // LABO 5 : Intégration Angular & Signals (3 ex)
    // ==========================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: 'Collection polymorphique typée avec signal<Media[]>',
      subtitle: 'Initialisation réactive avec des instances variées',
      sectionId: 'angular-mediatheque',
      estimatedTime: '5 min',
      difficulty: 'Débutant',
      statement: 'Créez un signal Angular "collection = signal<Media[]>([...])" initialisé avec un tableau contenant exactement 2 instances de Livre et 2 instances de Film.',
      hint: 'const collection = signal<Media[]>([new Livre(...), new Livre(...), new Film(...), new Film(...)]);',
      initialCode: `class Media {
  constructor(public titre: string, public annee: number) {}
}

class Livre extends Media {
  constructor(titre: string, annee: number, public pages: number) {
    super(titre, annee);
  }
}

class Film extends Media {
  constructor(titre: string, annee: number, public duree: number) {
    super(titre, annee);
  }
}

// TODO: Déclarez le signal collection contenant 2 Livres et 2 Films
const collection = signal<Media[]>([]);

console.log("Éléments dans le Signal :", collection().length);
`,
      solutionCode: `class Media {
  constructor(public titre: string, public annee: number) {}
}

class Livre extends Media {
  constructor(titre: string, annee: number, public pages: number) {
    super(titre, annee);
  }
}

class Film extends Media {
  constructor(titre: string, annee: number, public duree: number) {
    super(titre, annee);
  }
}

const collection = signal<Media[]>([
  new Livre("Dune", 1965, 412),
  new Livre("1984", 1949, 328),
  new Film("Matrix", 1999, 136),
  new Film("Inception", 2010, 148)
]);

console.log("Éléments dans le Signal :", collection().length);
`,
      solutionExplanation: [
        'Le typage "signal<Media[]>" illustre la puissance du polymorphisme : un tableau typé avec la superclasse Media accepte en toute sécurité n\'importe quelle instance de ses classes dérivées (Livre, Film).',
        'Le template Angular pourra itérer dessus avec @for sans distinction technique.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /signal\s*<\s*Media\s*\[\s*\]\s*>\s*\(/,
          label: 'signal<Media[]>([...])',
          errorMessage: 'Initialisez le Signal avec le type générique signal<Media[]>(...).'
        }
      ],
      criteria: [
        {
          id: 'c51-count',
          label: '4 médias au total',
          description: 'Le signal contient exactement 4 éléments',
          passed: false,
          hint: 'Fournissez 2 livres et 2 films dans le tableau du signal.'
        },
        {
          id: 'c51-types',
          label: 'Mélange Livre et Film',
          description: 'Contient 2 instances de Livre et 2 instances de Film',
          passed: false,
          hint: 'Instanciez 2 Livre et 2 Film distincts.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const col = sandbox.collection;
        const Livre = sandbox.Livre;
        const Film = sandbox.Film;

        let is4 = false;
        let books = 0;
        let movies = 0;

        try {
          if (typeof col === 'function') {
            const arr = col();
            is4 = arr.length === 4;
            books = arr.filter((x: any) => x instanceof Livre).length;
            movies = arr.filter((x: any) => x instanceof Film).length;
          }
        } catch (e) {}

        const typesOk = books === 2 && movies === 2;
        return [
          {
            criterionId: 'c51-count',
            passed: is4,
            message: is4 ? undefined : 'Le signal ne contient pas 4 éléments.'
          },
          {
            criterionId: 'c51-types',
            passed: typesOk,
            message: typesOk ? undefined : `Attendu: 2 Livres et 2 Films. Trouvé: ${books} Livres, ${movies} Films.`
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Ajout réactif avec collection.update()',
      subtitle: 'Mise à jour immuable d\'une liste polymorphique',
      sectionId: 'angular-mediatheque',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Écrivez la fonction "ajouterLivre(titre: string, annee: number, pages: number): void" qui ajoute un nouveau Livre dans le signal "collection" via sa méthode ".update()".',
      hint: 'collection.update(liste => [...liste, new Livre(titre, annee, pages)]);',
      initialCode: `class Media {
  constructor(public titre: string, public annee: number) {}
}

class Livre extends Media {
  constructor(titre: string, annee: number, public pages: number) {
    super(titre, annee);
  }
}

const collection = signal<Media[]>([
  new Livre("Le Hobbit", 1937, 310)
]);

// TODO: Implémentez ajouterLivre pour enrichir le signal via .update()
function ajouterLivre(titre: string, annee: number, pages: number): void {
  
}

ajouterLivre("Fondation", 1951, 255);
console.log("Nouvelle taille de la collection :", collection().length);
`,
      solutionCode: `class Media {
  constructor(public titre: string, public annee: number) {}
}

class Livre extends Media {
  constructor(titre: string, annee: number, public pages: number) {
    super(titre, annee);
  }
}

const collection = signal<Media[]>([
  new Livre("Le Hobbit", 1937, 310)
]);

function ajouterLivre(titre: string, annee: number, pages: number): void {
  collection.update(elements => [...elements, new Livre(titre, annee, pages)]);
}

ajouterLivre("Fondation", 1951, 255);
console.log("Nouvelle taille de la collection :", collection().length);
`,
      solutionExplanation: [
        'Dans l\'écosystème réactif moderne d\'Angular, les Signaux privilégient l\'immuabilité.',
        'La méthode ".update(items => [...items, nouveau])" préserve la pureté de l\'état et déclenche la détection de changements uniquement là où le Signal est consommé.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /collection\.update\s*\(/,
          label: 'Appel collection.update()',
          errorMessage: 'Vous devez mettre à jour le Signal avec collection.update(...).'
        }
      ],
      criteria: [
        {
          id: 'c52-update',
          label: 'Méthode .update() employée',
          description: 'Utilisation de .update() pour garantir la réactivité',
          passed: false,
          hint: 'Appelez collection.update(...) dans votre fonction.'
        },
        {
          id: 'c52-added',
          label: 'Ajout réussi',
          description: 'Le nouveau Livre est présent à la fin de collection()',
          passed: false,
          hint: 'Vérifiez que le tableau contient le livre Fondation.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const col = sandbox.collection;
        const addFn = sandbox.ajouterLivre;
        const Livre = sandbox.Livre;

        let ok = false;
        try {
          if (typeof col === 'function' && typeof addFn === 'function') {
            const initialCount = col().length;
            addFn('Neuromancien', 1984, 271);
            const after = col();
            const last = after[after.length - 1];
            ok = after.length === initialCount + 1 && (last instanceof Livre) && last.titre === 'Neuromancien';
          }
        } catch (e) {}

        return [
          {
            criterionId: 'c52-update',
            passed: ok,
            message: ok ? undefined : 'La fonction ajouterLivre n\'a pas mis à jour le signal correctement.'
          },
          {
            criterionId: 'c52-added',
            passed: ok,
            message: ok ? undefined : 'L\'élément ajouté n\'est pas une instance valide de Livre.'
          }
        ];
      },
      isCompleted: false
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: 'État dérivé avec computed() et instanceof',
      subtitle: 'Filtrage et comptage réactif par type concret',
      sectionId: 'angular-mediatheque',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement: 'Créez un signal calculé "totalLivres = computed(() => ...)" qui compte en temps réel le nombre d\'éléments dans collection() étant des instances de Livre (via "instanceof Livre").',
      hint: 'const totalLivres = computed(() => collection().filter(m => m instanceof Livre).length);',
      initialCode: `class Media {
  constructor(public titre: string) {}
}

class Livre extends Media {}
class Film extends Media {}

const collection = signal<Media[]>([
  new Livre("Dune"),
  new Film("Alien"),
  new Livre("1984"),
  new Film("Blade Runner")
]);

// TODO: Déclarez totalLivres avec computed() en filtrant avec instanceof Livre
const totalLivres = null;

console.log("Nombre de livres calculé :", totalLivres ? totalLivres() : 0);
`,
      solutionCode: `class Media {
  constructor(public titre: string) {}
}

class Livre extends Media {}
class Film extends Media {}

const collection = signal<Media[]>([
  new Livre("Dune"),
  new Film("Alien"),
  new Livre("1984"),
  new Film("Blade Runner")
]);

const totalLivres = computed(() => {
  return collection().filter(item => item instanceof Livre).length;
});

console.log("Nombre de livres calculé :", totalLivres());
`,
      solutionExplanation: [
        'La fonction "computed()" crée un mémo réactif sans effet de bord : sa valeur n\'est recalculée que si le Signal dépendant "collection()" change.',
        'L\'opérateur "instanceof Livre" discrimine dynamiquement les types concrets dans une collection hétérogène polymorphique.'
      ],
      syntaxRequirements: [
        {
          type: 'regex',
          pattern: /computed\s*\(\s*\(\s*\)\s*=>/,
          label: 'Déclaration computed(() => ...)',
          errorMessage: 'Déclarez totalLivres à l\'aide de computed(() => ...).'
        },
        {
          type: 'keyword',
          pattern: /instanceof\s+Livre/,
          label: 'Contrôle instanceof Livre',
          errorMessage: 'Utilisez "instanceof Livre" pour identifier les livres.'
        }
      ],
      criteria: [
        {
          id: 'c53-computed',
          label: 'Signal computed',
          description: 'totalLivres est un signal calculé',
          passed: false,
          hint: 'Vérifiez la déclaration : const totalLivres = computed(...).'
        },
        {
          id: 'c53-count',
          label: 'Comptage exact (2 livres)',
          description: 'totalLivres() renvoie 2 pour la collection initiale',
          passed: false,
          hint: 'Vérifiez le filtre : .filter(item => item instanceof Livre).length.'
        }
      ],
      evaluateFn: (sandbox: any) => {
        const totalLivres = sandbox.totalLivres;
        let count = 0;
        try {
          if (typeof totalLivres === 'function') {
            count = totalLivres();
          }
        } catch (e) {}

        const passed = count === 2;
        return [
          {
            criterionId: 'c53-computed',
            passed,
            message: passed ? undefined : 'totalLivres n\'est pas une fonction Signal calculée.'
          },
          {
            criterionId: 'c53-count',
            passed,
            message: passed ? undefined : `totalLivres() a retourné ${count} au lieu de 2.`
          }
        ];
      },
      isCompleted: false
    }
  ];

  readonly exercises = signal<Exercise[]>([]);
  readonly selectedExerciseId = signal<string>('ex-1-1');

  readonly completedCount = computed(() => 
    this.exercises().filter(e => e.isCompleted).length
  );

  readonly totalCount = computed(() => 
    this.exercises().length
  );

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  readonly activeExercise = computed(() => {
    const list = this.exercises();
    return list.find(e => e.id === this.selectedExerciseId()) || list[0];
  });

  constructor() {
    this.initExercises();
  }

  private initExercises(): void {
    let savedProgress: Record<string, boolean> = {};
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          savedProgress = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Erreur lecture localStorage pour exercices :', e);
      }
    }

    const initialList: Exercise[] = this.RAW_EXERCISES.map(def => ({
      ...def,
      currentCode: def.initialCode,
      isCompleted: !!savedProgress[def.id]
    }));

    this.exercises.set(initialList);
  }

  selectExercise(id: string): void {
    this.selectedExerciseId.set(id);
  }

  updateCode(id: string, newCode: string): void {
    this.exercises.update(list => 
      list.map(ex => ex.id === id ? { ...ex, currentCode: newCode } : ex)
    );
  }

  resetExercise(id: string): void {
    const raw = this.RAW_EXERCISES.find(r => r.id === id);
    if (!raw) return;

    this.exercises.update(list => 
      list.map(ex => ex.id === id ? { 
        ...ex, 
        currentCode: raw.initialCode, 
        isCompleted: false,
        criteria: raw.criteria.map(c => ({ ...c, passed: false })) 
      } : ex)
    );
    this.saveProgress();
  }

  injectSolution(id: string): void {
    const raw = this.RAW_EXERCISES.find(r => r.id === id);
    if (!raw) return;

    this.exercises.update(list => 
      list.map(ex => ex.id === id ? { ...ex, currentCode: raw.solutionCode } : ex)
    );
  }

  /**
   * Moteur d'évaluation combinant vérification syntaxique et exécution sécurisée en mémoire
   */
  evaluateExercise(id: string): ValidationSummary {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) {
      return {
        success: false,
        passedCount: 0,
        totalCount: 0,
        messages: ['Exercice introuvable'],
        consoleLogs: []
      };
    }

    const logs: ConsoleLogEntry[] = [];
    const messages: string[] = [];

    // 1. Vérifications syntaxiques statiques
    let syntaxPassed = true;
    for (const req of ex.syntaxRequirements) {
      const match = typeof req.pattern === 'string'
        ? ex.currentCode.includes(req.pattern)
        : req.pattern.test(ex.currentCode);

      if (req.type === 'forbidden' && match) {
        syntaxPassed = false;
        messages.push(`Syntaxe interdite : ${req.errorMessage}`);
      } else if (req.type !== 'forbidden' && !match) {
        syntaxPassed = false;
        messages.push(`Syntaxe manquante : ${req.errorMessage}`);
      }
    }

    // 2. Transpilation TS -> JS propre pour exécution mémoire
    const transpileJs = this.transpileTsToJs(ex.currentCode);

    // 3. Bac à sable d'exécution mémoire
    let sandboxContext: any = {};
    let executionError: string | undefined = undefined;

    // Simulation réactive Angular signal/computed pour le labo 5
    const mockSignal = <T>(initVal: T) => {
      let val = initVal;
      const getter: any = () => val;
      getter.set = (newVal: T) => { val = newVal; };
      getter.update = (fn: (v: T) => T) => { val = fn(val); };
      return getter;
    };

    const mockComputed = <T>(calcFn: () => T) => {
      return () => calcFn();
    };

    try {
      const rawLogs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'log',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        info: (...args: any[]) => {
          const str = args.map(a => String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'info',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        warn: (...args: any[]) => {
          const str = args.map(a => String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'warn',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        error: (...args: any[]) => {
          const str = args.map(a => String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        }
      };

      // Wrapper de capture de scope
      const executionCode = `
        ${transpileJs}
        return {
          Media: typeof Media !== 'undefined' ? Media : undefined,
          Livre: typeof Livre !== 'undefined' ? Livre : undefined,
          Film: typeof Film !== 'undefined' ? Film : undefined,
          ArticlePresse: typeof ArticlePresse !== 'undefined' ? ArticlePresse : undefined,
          Podcast: typeof Podcast !== 'undefined' ? Podcast : undefined,
          CompteBancaire: typeof CompteBancaire !== 'undefined' ? CompteBancaire : undefined,
          CompteCourant: typeof CompteCourant !== 'undefined' ? CompteCourant : undefined,
          Employe: typeof Employe !== 'undefined' ? Employe : undefined,
          Manager: typeof Manager !== 'undefined' ? Manager : undefined,
          Client: typeof Client !== 'undefined' ? Client : undefined,
          Facture: typeof Facture !== 'undefined' ? Facture : undefined,
          Aile: typeof Aile !== 'undefined' ? Aile : undefined,
          Avion: typeof Avion !== 'undefined' ? Avion : undefined,
          DocumentMetier: typeof DocumentMetier !== 'undefined' ? DocumentMetier : undefined,
          ArticleBlog: typeof ArticleBlog !== 'undefined' ? ArticleBlog : undefined,
          collection: typeof collection !== 'undefined' ? collection : undefined,
          ajouterLivre: typeof ajouterLivre !== 'undefined' ? ajouterLivre : undefined,
          totalLivres: typeof totalLivres !== 'undefined' ? totalLivres : undefined,
          film: typeof film !== 'undefined' ? film : undefined,
          media: typeof media !== 'undefined' ? media : undefined,
          livre: typeof livre !== 'undefined' ? livre : undefined
        };
      `;

      const runnerFn = new Function('console', 'signal', 'computed', executionCode);
      sandboxContext = runnerFn(customConsole, mockSignal, mockComputed);

      // 4. Assertions dynamiques sur les objets instanciés
      const evalResults = ex.evaluateFn(sandboxContext, rawLogs);

      // Mise à jour des critères de l'exercice
      const updatedCriteria = ex.criteria.map(c => {
        const found = evalResults.find(r => r.criterionId === c.id);
        const passed = syntaxPassed && !!found?.passed;
        if (found && !found.passed && found.message) {
          messages.push(found.message);
        }
        return { ...c, passed };
      });

      const allPassed = syntaxPassed && updatedCriteria.every(c => c.passed);

      this.exercises.update(list => 
        list.map(e => e.id === id ? { 
          ...e, 
          criteria: updatedCriteria,
          isCompleted: allPassed
        } : e)
      );

      if (allPassed) {
        this.saveProgress();
        this.confetti.triggerSuccess();
        logs.push({
          type: 'success',
          timestamp: new Date().toLocaleTimeString(),
          message: `✔ Tous les critères de l'exercice ${ex.number} sont validés !`
        });
      }

      return {
        success: allPassed,
        passedCount: updatedCriteria.filter(c => c.passed).length,
        totalCount: updatedCriteria.length,
        messages,
        consoleLogs: logs
      };

    } catch (err: any) {
      executionError = err.message || String(err);
      logs.push({
        type: 'error',
        timestamp: new Date().toLocaleTimeString(),
        message: `Erreur d'exécution : ${executionError}`
      });

      const failedCriteria = ex.criteria.map(c => ({ ...c, passed: false }));
      this.exercises.update(list => 
        list.map(e => e.id === id ? { ...e, criteria: failedCriteria, isCompleted: false } : e)
      );

      return {
        success: false,
        passedCount: 0,
        totalCount: ex.criteria.length,
        messages: [executionError || 'Erreur d\'exécution du code'],
        consoleLogs: logs,
        executionError
      };
    }
  }

  /**
   * Transpileur TS -> JS pour l'évaluation en mémoire
   * Gère les parameter properties des constructeurs (public, private, protected, readonly)
   * et supprime les annotations de types sans affecter les littéraux d'objets.
   */
  private transpileTsToJs(tsCode: string): string {
    let js = this.transformConstructors(tsCode);

    // Retirer les types de retour de fonction / méthode
    js = js.replace(/\)\s*:\s*[A-Za-z0-9_<>[\]| ]+\s*(\{)/g, ') {');
    js = js.replace(/\)\s*:\s*[A-Za-z0-9_<>[\]| ]+\s*(=>)/g, ') =>');

    // Retirer les types génériques Angular signal<Type>(...) -> signal(...)
    js = js.replace(/\b(signal|computed)\s*<[^>]+>/g, '$1');

    // Retirer les modificateurs restants
    js = js.replace(/\b(public|private|protected|readonly|override)\s+/g, '');

    // Retirer le typage des variables : const/let/var x: Type = ... -> const/let/var x = ...
    js = js.replace(/\b(const|let|var)\s+([A-Za-z0-9_$]+)\s*:\s*[^=;]+?\s*=/g, '$1 $2 =');

    // Retirer le typage des paramètres dans les parenthèses : (x: Type, y: Type = val) -> (x, y = val)
    js = js.replace(/(\([^)]*\))/g, (match) => {
      return match.replace(/:\s*[A-Za-z0-9_<>[\]| ]+?(?=\s*[,=)])/g, '');
    });

    // Retirer les annotations de type des champs de classe :
    // e.g. "modele: string;" -> "modele;" ou "ailes: Aile[] = [];" -> "ailes = [];"
    js = js.replace(/(^\s*|\n\s*)([A-Za-z0-9_$]+)\s*:\s*[^=;\n]+?\s*([=;])/g, '$1$2 $3');

    return js;
  }

  /**
   * Transforme les constructeurs TypeScript avec parameter properties
   * en constructeurs JavaScript standards avec assignations this.prop = prop;
   */
  private transformConstructors(code: string): string {
    const ctorRegex = /constructor\s*\(([^)]*)\)\s*\{/g;
    let match: RegExpExecArray | null;
    let result = '';
    let lastIndex = 0;

    while ((match = ctorRegex.exec(code)) !== null) {
      result += code.slice(lastIndex, match.index);
      const params = match[1];
      const startIndex = match.index + match[0].length;

      let depth = 1;
      let endIndex = startIndex;
      while (endIndex < code.length && depth > 0) {
        if (code[endIndex] === '{') depth++;
        else if (code[endIndex] === '}') depth--;
        endIndex++;
      }
      const body = code.slice(startIndex, endIndex - 1);
      lastIndex = endIndex;

      const paramList = params.split(',');
      const assignments: string[] = [];
      const cleanedParams = paramList.map(p => {
        const propMatch = p.match(/\b(public|private|protected|readonly)\s+([A-Za-z0-9_$]+)/);
        if (propMatch) {
          const paramName = propMatch[2];
          assignments.push(`this.${paramName} = ${paramName};`);
          return p.replace(/\b(public|private|protected|readonly)\s+/, '');
        }
        return p;
      });

      let newBody = body;
      if (assignments.length > 0) {
        const assignStr = assignments.join(' ');
        const superMatch = newBody.match(/(super\s*\([^)]*\)\s*;?)/);
        if (superMatch && superMatch.index !== undefined) {
          const idx = superMatch.index + superMatch[0].length;
          newBody = newBody.slice(0, idx) + '\n    ' + assignStr + newBody.slice(idx);
        } else {
          newBody = '\n    ' + assignStr + newBody;
        }
      }

      result += `constructor(${cleanedParams.join(',')}) {${newBody}}`;
    }
    result += code.slice(lastIndex);
    return result;
  }

  private saveProgress(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const progress: Record<string, boolean> = {};
      this.exercises().forEach(e => {
        if (e.isCompleted) progress[e.id] = true;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Erreur sauvegarde localStorage :', e);
    }
  }
}
