import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { stripComments } from './validation-utils';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance16_exercises_v2';
  private readonly transpiler: TypescriptTranspilerService;

  constructor(customTranspiler?: TypescriptTranspilerService) {
    this.transpiler = customTranspiler ?? inject(TypescriptTranspilerService, { optional: true }) ?? new TypescriptTranspilerService();
    this.loadFromStorage();
  }

  readonly activeExerciseIndex = signal<number>(0);
  readonly filterLab = signal<number | null>(null);

  /** Définitions des exercices : `currentCode` est dérivé de `initialCode` (source unique de vérité). */
  private readonly exerciseDefinitions: Omit<Exercise, 'currentCode'>[] = [
    // =========================================================================
    // LABO 1 : Syntaxe JSON & DOMParser XML (3 exercices)
    // =========================================================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Assainissement JSON Strict',
      subtitle: 'Corriger un flux JSON syntaxiquement corrompu pour satisfaire la RFC 8259',
      sectionId: 'json-vs-xml',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Une API vous retourne une chaîne de caractères altérée comportant trois erreurs fatales en JSON strict : des apostrophes à la place des guillemets doubles, un commentaire // interdit, et une virgule finale traînante (trailing comma). Corrigez la chaîne dans la variable `jsonInvalide` pour que `JSON.parse(jsonInvalide)` s\'exécute avec succès.',
      hint: 'En JSON strict : uniquement des guillemets doubles `"`, aucun commentaire `//`, et jamais de virgule après la dernière propriété.',
      initialCode: `// 1. Corrigez la chaîne ci-dessous pour en faire du JSON valide strict :
const jsonInvalide = \`{
  'nom': 'Souris Pro', // commentaire interdit
  'prix': 49.99,
}\`;

// 2. Test de parsing natif :
const article = JSON.parse(jsonInvalide);
console.log("Article désérialisé avec succès :", article.nom, "-", article.prix, "€");
`,
      solutionCode: `const jsonInvalide = \`{
  "nom": "Souris Pro",
  "prix": 49.99
}\`;

const article = JSON.parse(jsonInvalide);
console.log("Article désérialisé avec succès :", article.nom, "-", article.prix, "€");
`,
      isCompleted: false,
      solutionExplanation: [
        'La norme RFC 8259 impose des guillemets doubles `"` autour de chaque nom de clé et valeur textuelle.',
        'Les commentaires `//` ou `/* */` ne font pas partie de la grammaire JSON et provoquent un `SyntaxError`.',
        'La virgule finale traînante (*trailing comma*) est strictement interdite après le dernier élément.'
      ],
      criteria: [
        {
          id: 'c1-no-single-quotes',
          label: 'Aucune apostrophe dans le JSON',
          description: 'Toutes les chaînes et clés doivent utiliser des guillemets doubles.',
          passed: false,
          hint: 'Remplacez les apostrophes \' par des guillemets doubles "'
        },
        {
          id: 'c1-no-comments',
          label: 'Aucun commentaire dans le JSON',
          description: 'Le corps de la chaîne JSON ne doit contenir aucun // ni /*.',
          passed: false,
          hint: 'Supprimez la ligne de commentaire // commentaire interdit'
        },
        {
          id: 'c1-parse-success',
          label: 'Exécution réussie de JSON.parse()',
          description: 'Le code s\'exécute sans lever d\'exception de syntaxe et affiche l\'article.',
          passed: false,
          hint: 'Vérifiez la virgule après 49.99'
        }
      ]
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Détection d\'Erreur XML (DOMParser)',
      subtitle: 'Détecter la balise <parsererror> produite par le navigateur',
      sectionId: 'json-vs-xml',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Contrairement à JSON.parse, `DOMParser.parseFromString()` ne lève pas d\'erreur JavaScript lors d\'une anomalie syntaxique XML : il crée un document contenant un nœud `<parsererror>`. Écrivez la fonction `analyserXml(flux: string): boolean` qui parse le flux en `"application/xml"` et retourne `true` si le document est sain, ou `false` si une balise `<parsererror>` est détectée.',
      hint: 'Utilisez `const doc = new DOMParser().parseFromString(flux, "application/xml");` puis testez `doc.querySelector("parsererror") === null`.',
      initialCode: `// Implémentez la fonction analyserXml :
function analyserXml(flux: string): boolean {
  // À vous de jouer :
  // 1. Instanciez DOMParser
  // 2. ParseFromString avec "application/xml"
  // 3. Vérifiez la présence de "parsererror"
  return false;
}

// Tests d'auto-évaluation :
const xmlValide = "<catalogue><article id='A1'>Livre</article></catalogue>";
const xmlCorrompu = "<catalogue><article id='A1'>Balise non fermée</catalogue>";

console.log("XML valide :", analyserXml(xmlValide));
console.log("XML corrompu :", analyserXml(xmlCorrompu));
`,
      solutionCode: `function analyserXml(flux: string): boolean {
  const parser = new DOMParser();
  const doc = parser.parseFromString(flux, "application/xml");
  const erreur = doc.querySelector("parsererror");
  return erreur === null;
}

const xmlValide = "<catalogue><article id='A1'>Livre</article></catalogue>";
const xmlCorrompu = "<catalogue><article id='A1'>Balise non fermée</catalogue>";

console.log("XML valide :", analyserXml(xmlValide));
console.log("XML corrompu :", analyserXml(xmlCorrompu));
`,
      isCompleted: false,
      solutionExplanation: [
        '`DOMParser` retourne un `XMLDocument` dans tous les cas pour éviter d\'interrompre brutalement le thread de rendu.',
        'La présence d\'un nœud `<parsererror>` atteste formellement que le flux XML était malformé.',
        'Tester `doc.querySelector("parsererror") === null` est la méthode standard W3C de vérification.'
      ],
      criteria: [
        {
          id: 'c2-domparser-usage',
          label: 'Utilisation de DOMParser',
          description: 'La fonction doit instancier DOMParser et appeler parseFromString.',
          passed: false,
          hint: 'new DOMParser().parseFromString(flux, "application/xml")'
        },
        {
          id: 'c2-parsererror-check',
          label: 'Détection du nœud parsererror',
          description: 'La méthode doit inspecter le document avec querySelector("parsererror").',
          passed: false,
          hint: 'doc.querySelector("parsererror")'
        },
        {
          id: 'c2-correct-boolean-output',
          label: 'Sortie correcte (true pour valide, false pour corrompu)',
          description: 'analyserXml(xmlValide) doit retourner true et analyserXml(xmlCorrompu) doit retourner false.',
          passed: false,
          hint: 'Retournez true s\'il n\'y a pas d\'erreur'
        }
      ]
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Extraction DOM XML',
      subtitle: 'Extraire les attributs et nœuds textuels d\'un document XML',
      sectionId: 'json-vs-xml',
      estimatedTime: '6 min',
      difficulty: 'Facile',
      statement:
        'Dans les formats patrimoniaux XML, la distinction entre attributs (`id="ART-101"`) et éléments (`<prixHT>129.99</prixHT>`) requiert une extraction manuelle. Complétez la fonction `extraireArticle(fluxXml: string)` pour qu\'elle récupère l\'attribut `id` de l\'élément `<article>` et convertisse le texte de `<prixHT>` en `number` (via `parseFloat`).',
      hint: 'Utilisez `article.getAttribute("id")` et `parseFloat(doc.querySelector("prixHT")?.textContent ?? "0")`.',
      initialCode: `interface DonneesArticle {
  id: string;
  prixHT: number;
}

function extraireArticle(fluxXml: string): DonneesArticle {
  const parser = new DOMParser();
  const doc = parser.parseFromString(fluxXml, "application/xml");

  // À vous de jouer :
  // Récupérez l'attribut 'id' et le texte numérique de 'prixHT'
  return { id: "", prixHT: 0 };
}

// Test d'exécution :
const xml = \`
  <catalogue>
    <article id="ART-99">
      <designation>Casque Audio</designation>
      <prixHT>89.50</prixHT>
    </article>
  </catalogue>
\`;

const resultat = extraireArticle(xml);
console.log("ID extrait :", resultat.id, "| Prix HT :", resultat.prixHT);
`,
      solutionCode: `interface DonneesArticle {
  id: string;
  prixHT: number;
}

function extraireArticle(fluxXml: string): DonneesArticle {
  const parser = new DOMParser();
  const doc = parser.parseFromString(fluxXml, "application/xml");
  const articleEl = doc.querySelector("article");
  const prixEl = doc.querySelector("prixHT");

  const id = articleEl?.getAttribute("id") ?? "";
  const prixHT = parseFloat(prixEl?.textContent ?? "0");

  return { id, prixHT };
}

const xml = \`
  <catalogue>
    <article id="ART-99">
      <designation>Casque Audio</designation>
      <prixHT>89.50</prixHT>
    </article>
  </catalogue>
\`;

const resultat = extraireArticle(xml);
console.log("ID extrait :", resultat.id, "| Prix HT :", resultat.prixHT);
`,
      isCompleted: false,
      solutionExplanation: [
        'En XML, les métadonnées techniques sont souvent placées en attributs d\'éléments : on utilise `.getAttribute("id")`.',
        'Les valeurs textuelles enfants se lisent via la propriété `.textContent`.',
        'Tout est initialement lu sous forme de chaîne de caractères : une conversion explicite avec `parseFloat()` ou `Number()` est impérative.'
      ],
      criteria: [
        {
          id: 'c3-get-attribute',
          label: 'Lecture de l\'attribut id',
          description: 'L\'attribut id de l\'élément article doit être extrait.',
          passed: false,
          hint: 'articleEl.getAttribute("id")'
        },
        {
          id: 'c3-parse-float-prix',
          label: 'Conversion du prix en nombre',
          description: 'Le contenu de prixHT doit être converti en number avec parseFloat.',
          passed: false,
          hint: 'parseFloat(prixEl.textContent)'
        },
        {
          id: 'c3-output-art99',
          label: 'Valeurs attendues retournées',
          description: 'La fonction doit retourner { id: "ART-99", prixHT: 89.5 } sur l\'échantillon fourni.',
          passed: false,
          hint: 'Vérifiez la console : ID extrait : ART-99 | Prix HT : 89.5'
        }
      ]
    },

    // =========================================================================
    // LABO 2 : JSON.stringify, replacer & toJSON (3 exercices)
    // =========================================================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Filtrage par Liste Blanche',
      subtitle: 'Sécuriser l\'export en sélectionnant les clés autorisées via un tableau',
      sectionId: 'stringify-encapsulation',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Pour éviter la fuite de secrets métier, `JSON.stringify` accepte comme second paramètre une liste blanche de clés sous forme de tableau de chaînes. Soit l\'objet `utilisateur` contenant `id`, `pseudo`, `motDePasseHash`, et `email`. Utilisez `JSON.stringify` pour n\'exporter EXCLUSIVEMENT que les clés `"id"` et `"email"`, avec une indentation de 2 espaces.',
      hint: 'Signature : `JSON.stringify(utilisateur, ["id", "email"], 2)`.',
      initialCode: `const utilisateur = {
  id: 104,
  pseudo: "Alice",
  motDePasseHash: "argon2$secretSalt$987654",
  email: "alice@eafc.be"
};

// À vous de jouer :
// Utilisez JSON.stringify avec un tableau en 2e argument pour n'exporter que 'id' et 'email' :
const jsonPublic = "";

console.log("Sortie publique sécurisée :\\n" + jsonPublic);
`,
      solutionCode: `const utilisateur = {
  id: 104,
  pseudo: "Alice",
  motDePasseHash: "argon2$secretSalt$987654",
  email: "alice@eafc.be"
};

const jsonPublic = JSON.stringify(utilisateur, ["id", "email"], 2);

console.log("Sortie publique sécurisée :\\n" + jsonPublic);
`,
      isCompleted: false,
      solutionExplanation: [
        'Le second paramètre de `JSON.stringify` est le `replacer`.',
        'Fournir un tableau de clés `string[]` agit comme un filtre en liste blanche (*whitelist*).',
        'Toute propriété absente du tableau (comme `motDePasseHash` ou `pseudo`) est automatiquement ignorée lors de la sérialisation.'
      ],
      criteria: [
        {
          id: 'c4-whitelist-keys',
          label: 'Liste blanche ["id", "email"] passée en replacer',
          description: 'JSON.stringify doit recevoir le tableau contenant exactement "id" et "email".',
          passed: false,
          hint: 'JSON.stringify(utilisateur, ["id", "email"], 2)'
        },
        {
          id: 'c4-space-indent',
          label: 'Indentation à 2 espaces',
          description: 'Le troisième paramètre space doit valoir 2.',
          passed: false,
          hint: '3e paramètre : 2'
        },
        {
          id: 'c4-no-password-in-output',
          label: 'Aucun mot de passe dans le résultat',
          description: 'La chaîne jsonPublic ne doit contenir ni pseudo ni motDePasseHash.',
          passed: false,
          hint: 'Vérifiez la sortie affichée'
        }
      ]
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Masquage Dynamique via Replacer',
      subtitle: 'Évincer les clés sensibles en renvoyant undefined dans la fonction',
      sectionId: 'stringify-encapsulation',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Dans une fonction `replacer(cle: string, valeur: any)`, renvoyer la valeur `undefined` ordonne au sérialiseur d\'omettre immédiatement la propriété du résultat final. Écrivez la fonction `masquerMotDePasse(cle: string, valeur: any): any` pour qu\'elle renvoie `undefined` si `cle === "motDePasse"`, et retourne la valeur inchangée pour toutes les autres clés.',
      hint: '`if (cle === "motDePasse") return undefined; return valeur;`',
      initialCode: `// Complétez la fonction replacer :
function masquerMotDePasse(cle: string, valeur: any): any {
  // À vous de jouer :
  // Si cle vaut "motDePasse", retournez undefined
  // Sinon retournez valeur
  return valeur;
}

const compte = {
  identifiant: "USR-77",
  motDePasse: "MonSuperSecret!2026",
  nom: "Bob"
};

const jsonResultat = JSON.stringify(compte, masquerMotDePasse, 2);
console.log(jsonResultat);
`,
      solutionCode: `function masquerMotDePasse(cle: string, valeur: any): any {
  if (cle === "motDePasse") {
    return undefined;
  }
  return valeur;
}

const compte = {
  identifiant: "USR-77",
  motDePasse: "MonSuperSecret!2026",
  nom: "Bob"
};

const jsonResultat = JSON.stringify(compte, masquerMotDePasse, 2);
console.log(jsonResultat);
`,
      isCompleted: false,
      solutionExplanation: [
        'Lors de la sérialisation, `JSON.stringify` appelle la fonction `replacer` pour chaque paire clé/valeur.',
        'Retourner `undefined` pour une propriété d\'objet supprime purement et simplement cette propriété de la sortie JSON.',
        'C\'est un moyen dynamique puissant pour assainir des graphes d\'objets avant transmission réseau.'
      ],
      criteria: [
        {
          id: 'c5-replacer-condition',
          label: 'Condition cle === "motDePasse"',
          description: 'La fonction doit vérifier le nom de la clé.',
          passed: false,
          hint: 'if (cle === "motDePasse")'
        },
        {
          id: 'c5-return-undefined',
          label: 'Retour de undefined pour la clé sensible',
          description: 'Le replacer doit retourner undefined pour masquer la propriété.',
          passed: false,
          hint: 'return undefined;'
        },
        {
          id: 'c5-clean-json-output',
          label: 'Sortie JSON exempte du mot de passe',
          description: 'jsonResultat ne contient que identifiant et nom.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Encapsulation avec toJSON()',
      subtitle: 'Donner à la classe la maîtrise totale de sa frontière de divulgation',
      sectionId: 'stringify-encapsulation',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement:
        'Si une classe déclare une méthode `toJSON()`, `JSON.stringify()` lui délègue automatiquement sa sérialisation. Créez la classe `Article` avec un constructeur recevant `public nom: string`, `public prix: number`, et un champ privé `#coutAchat: number`. Implémentez la méthode `toJSON(): object` retournant un objet contenant `nom`, `prix` arrondi à 2 décimales sous forme de nombre (ou via `Number(this.prix.toFixed(2))`), tout en préservant le secret absolu de `#coutAchat`.',
      hint: 'Déclarez `readonly #coutAchat: number;` dans la classe, assignez-le dans le constructeur, et implémentez `toJSON()`.',
      initialCode: `class Article {
  readonly #coutAchat: number;

  constructor(public nom: string, public prix: number, coutAchat: number) {
    this.#coutAchat = coutAchat;
  }

  // À vous de jouer :
  // Implémentez toJSON(): object pour n'exposer que nom et prix :
  toJSON(): object {
    return {};
  }
}

const livre = new Article("Livre TypeScript", 29.999, 12.00);
const jsonLivre = JSON.stringify(livre, null, 2);
console.log(jsonLivre);
`,
      solutionCode: `class Article {
  readonly #coutAchat: number;

  constructor(public nom: string, public prix: number, coutAchat: number) {
    this.#coutAchat = coutAchat;
  }

  toJSON(): object {
    return {
      nom: this.nom,
      prix: Number(this.prix.toFixed(2))
    };
  }
}

const livre = new Article("Livre TypeScript", 29.999, 12.00);
const jsonLivre = JSON.stringify(livre, null, 2);
console.log(jsonLivre);
`,
      isCompleted: false,
      solutionExplanation: [
        'La méthode `toJSON()` est un hook officiel reconnu par le standard ECMAScript dans `JSON.stringify`.',
        'Elle garantit le respect du principe d\'encapsulation (Séance 05) : l\'objet décide de sa propre représentation externe.',
        'Le champ privé `#coutAchat` ne sera jamais exposé, même si un développeur tiers appelle `JSON.stringify(article)`.'
      ],
      criteria: [
        {
          id: 'c6-private-field',
          label: 'Champ privé #coutAchat présent',
          description: 'La classe doit encapsuler son coût d\'achat avec un champ privé #.',
          passed: false,
          hint: 'readonly #coutAchat: number;'
        },
        {
          id: 'c6-tojson-method',
          label: 'Méthode toJSON() implémentée',
          description: 'La classe doit déclarer toJSON(): object.',
          passed: false,
          hint: 'toJSON(): object { return { ... }; }'
        },
        {
          id: 'c6-no-coutachat-in-json',
          label: 'Cout d\'achat absent du JSON final',
          description: 'La chaîne générée contient nom et prix mais jamais coutAchat.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },

    // =========================================================================
    // LABO 3 : Le Prototype Perdu & Limitations (3 exercices)
    // =========================================================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Démasquer le Faux Type (as Classe)',
      subtitle: 'Prouver que JSON.parse(str) as Tache échoue à instanceof Tache',
      sectionId: 'prototype-crisis',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Le cast TypeScript `as Classe` n\'est qu\'une consigne d\'aveuglement pour le compilateur : au runtime, `JSON.parse` ne rappelle jamais votre constructeur et ne relie pas le prototype ! Écrivez la fonction `testerInstance(objet: any): boolean` qui retourne le résultat de `objet instanceof Tache`. Observez que pour un objet issu d\'un cast naïf, ce test renvoie impitoyablement `false` !',
      hint: '`return objet instanceof Tache;`',
      initialCode: `class Tache {
  constructor(public id: string, public titre: string) {}

  terminer(): void {
    console.log("Tâche", this.titre, "terminée !");
  }
}

// 1. Simulez une désérialisation naïve :
const json = '{"id":"T1","titre":"Réviser le cours"}';
const tacheNaïve = JSON.parse(json) as Tache;

// 2. Écrivez la fonction de vérification :
function testerInstance(objet: any): boolean {
  // À vous de jouer : testez si objet est réellement une instance de Tache
  return false;
}

console.log("Est-ce une vraie Tache ? :", testerInstance(tacheNaïve));
`,
      solutionCode: `class Tache {
  constructor(public id: string, public titre: string) {}

  terminer(): void {
    console.log("Tâche", this.titre, "terminée !");
  }
}

const json = '{"id":"T1","titre":"Réviser le cours"}';
const tacheNaïve = JSON.parse(json) as Tache;

function testerInstance(objet: any): boolean {
  return objet instanceof Tache;
}

console.log("Est-ce une vraie Tache ? :", testerInstance(tacheNaïve));
`,
      isCompleted: false,
      solutionExplanation: [
        'En JavaScript, l\'opérateur `instanceof` remonte la chaîne des prototypes (`__proto__`).',
        'Puisque `JSON.parse` instancie un objet littéral pur, `tacheNaïve.__proto__` pointe vers `Object.prototype`, pas `Tache.prototype`.',
        'Tenter d\'appeler `tacheNaïve.terminer()` provoquera donc immédiatement : `TypeError: tacheNaïve.terminer is not a function` !'
      ],
      criteria: [
        {
          id: 'c7-instanceof-check',
          label: 'Test avec instanceof Tache',
          description: 'La fonction doit utiliser l\'opérateur instanceof Tache.',
          passed: false,
          hint: 'objet instanceof Tache'
        },
        {
          id: 'c7-returns-false-for-naive',
          label: 'Retourne false pour le cast naïf',
          description: 'testerInstance(tacheNaïve) doit retourner false.',
          passed: false,
          hint: 'Vérifiez la sortie dans la console'
        },
        {
          id: 'c7-exec-success',
          label: 'Exécution sans erreur',
          description: 'Le script s\'exécute avec succès.',
          passed: false,
          hint: 'Consultez la console virtuelle'
        }
      ]
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Le Piège de la Date Stringifiée',
      subtitle: 'Restaurer une véritable instance Date à partir de sa chaîne ISO',
      sectionId: 'crash-tests',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'JSON n\'a pas de type `Date` natif : `JSON.stringify` convertit toute `Date` en chaîne ISO (`"2026-10-28T..."`). Après `JSON.parse`, appeler `.getFullYear()` provoque un crash ! Écrivez la fonction `rehydraterDate(donnees: { id: string; dateCreation: string })` qui retourne un objet avec `dateCreation: new Date(donnees.dateCreation)`, permettant d\'appeler `.getFullYear()` sans encombre.',
      hint: '`return { id: donnees.id, dateCreation: new Date(donnees.dateCreation) };`',
      initialCode: `// 1. Données brutes issues de JSON.parse :
const donneesBrutes = {
  id: "EVT-1",
  dateCreation: "2026-10-28T14:30:00.000Z"
};

// 2. Écrivez la fonction de réhydratation :
function rehydraterDate(donnees: { id: string; dateCreation: string }): { id: string; dateCreation: Date } {
  // À vous de jouer : convertissez la chaîne en véritable instance new Date(donnees.dateCreation)
  return { id: donnees.id, dateCreation: donnees.dateCreation as any };
}

const rehydrate = rehydraterDate(donneesBrutes);
console.log("Année extraite avec succès :", rehydrate.dateCreation.getFullYear());
console.log("Est-ce bien une Date ? :", rehydrate.dateCreation instanceof Date);
`,
      solutionCode: `const donneesBrutes = {
  id: "EVT-1",
  dateCreation: "2026-10-28T14:30:00.000Z"
};

function rehydraterDate(donnees: { id: string; dateCreation: string }): { id: string; dateCreation: Date } {
  return {
    id: donnees.id,
    dateCreation: new Date(donnees.dateCreation)
  };
}

const rehydrate = rehydraterDate(donneesBrutes);
console.log("Année extraite avec succès :", rehydrate.dateCreation.getFullYear());
console.log("Est-ce bien une Date ? :", rehydrate.dateCreation instanceof Date);
`,
      isCompleted: false,
      solutionExplanation: [
        'Lors de la sérialisation, `Date.prototype.toJSON` est invoquée par défaut et renvoie `date.toISOString()`.',
        '`JSON.parse` ne fait aucune supposition sur la signification de cette chaîne : il la lit comme un simple `string`.',
        'La réhydratation explicite via `new Date(dto.dateCreation)` restaure les méthodes de calendrier.'
      ],
      criteria: [
        {
          id: 'c8-new-date-instance',
          label: 'Création d\'une instance new Date',
          description: 'La fonction doit instancier new Date(donnees.dateCreation).',
          passed: false,
          hint: 'new Date(donnees.dateCreation)'
        },
        {
          id: 'c8-get-full-year-runs',
          label: 'getFullYear() s\'exécute sans erreur',
          description: 'L\'appel getFullYear() affiche 2026 dans la console.',
          passed: false,
          hint: 'Vérifiez la console'
        },
        {
          id: 'c8-instanceof-date',
          label: 'dateCreation instanceof Date est vrai',
          description: 'La propriété restaurée doit être une vraie instance Date.',
          passed: false,
          hint: 'rehydrate.dateCreation instanceof Date === true'
        }
      ]
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Parsing Sécurisé (Try / Catch Robuste)',
      subtitle: 'Encapsuler JSON.parse pour éliminer tout risque de crash applicatif',
      sectionId: 'prototype-crisis',
      estimatedTime: '6 min',
      difficulty: 'Facile',
      statement:
        'Appeler `JSON.parse` sans filet de sécurité sur une chaîne corrompue provoque une exception fatale non rattrapée. Implémentez la fonction générique `parserJsonSecurise<T>(jsonStr: string): { succes: boolean; donnees?: T; erreur?: string }` qui capture toute `SyntaxError` et renvoie un résultat typé sûr.',
      hint: 'Utilisez un bloc `try { const donnees = JSON.parse(jsonStr) as T; return { succes: true, donnees }; } catch (err: any) { return { succes: false, erreur: err.message }; }`.',
      initialCode: `interface ResultatParsing<T> {
  succes: boolean;
  donnees?: T;
  erreur?: string;
}

function parserJsonSecurise<T>(jsonStr: string): ResultatParsing<T> {
  // À vous de jouer :
  // 1. Tentez le JSON.parse dans un try
  // 2. Capturez l'erreur dans le catch et retournez succes: false avec le message
  return { succes: false };
}

// Tests d'auto-évaluation :
const bonJson = '{"version": 16, "status": "ok"}';
const mauvaisJson = '{"version": 16, nonFerme';

console.log("Test valide :", parserJsonSecurise(bonJson));
console.log("Test corrompu :", parserJsonSecurise(mauvaisJson));
`,
      solutionCode: `interface ResultatParsing<T> {
  succes: boolean;
  donnees?: T;
  erreur?: string;
}

function parserJsonSecurise<T>(jsonStr: string): ResultatParsing<T> {
  try {
    const donnees = JSON.parse(jsonStr) as T;
    return { succes: true, donnees };
  } catch (err: any) {
    return { succes: false, erreur: err.message };
  }
}

const bonJson = '{"version": 16, "status": "ok"}';
const mauvaisJson = '{"version": 16, nonFerme';

console.log("Test valide :", parserJsonSecurise(bonJson));
console.log("Test corrompu :", parserJsonSecurise(mauvaisJson));
`,
      isCompleted: false,
      solutionExplanation: [
        'Le motif Résultat (*Result Pattern*) permet d\'éviter les interruptions inattendues du cycle d\'exécution.',
        'La fonction renvoie un objet prévisible à deux branches : `{ succes: true, donnees }` ou `{ succes: false, erreur }`.',
        'Ce motif est particulièrement adapté pour traiter des fichiers disques ou des flux réseau non fiables (Séance 10).'
      ],
      criteria: [
        {
          id: 'c9-try-catch-block',
          label: 'Présence du bloc try / catch',
          description: 'La fonction doit envelopper JSON.parse dans un bloc try/catch.',
          passed: false,
          hint: 'try { JSON.parse(...) } catch (err) { ... }'
        },
        {
          id: 'c9-success-branch',
          label: 'Gestion de la branche succès',
          description: 'Retourne { succes: true, donnees: ... } pour le bon JSON.',
          passed: false,
          hint: 'return { succes: true, donnees };'
        },
        {
          id: 'c9-failure-branch',
          label: 'Gestion de la branche erreur',
          description: 'Retourne { succes: false, erreur: ... } sans crasher sur le mauvais JSON.',
          passed: false,
          hint: 'return { succes: false, erreur: err.message };'
        }
      ]
    },

    // =========================================================================
    // LABO 4 : Le Patron DTO & Fabrique de Réhydratation (4 exercices)
    // =========================================================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Modéliser le Contrat DTO',
      subtitle: 'Définir l\'interface TypeScript passive pour le transport JSON',
      sectionId: 'dto-studio',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Le patron DTO (*Data Transfer Object*) dissocie la structure de stockage externe du modèle métier. Déclarez l\'interface TypeScript `TacheDTO` comportant 4 propriétés primitives sérialisables : `id` (string), `titre` (string), `echeance` (string, date au format ISO), et `terminee` (boolean).',
      hint: '`interface TacheDTO { id: string; titre: string; echeance: string; terminee: boolean; }`',
      initialCode: `// 1. Déclarez l'interface TacheDTO :
// Propriétés requises : id (string), titre (string), echeance (string), terminee (boolean)


// 2. Exemple d'objet conforme au contrat DTO :
const exempleDTO: TacheDTO = {
  id: "T-101",
  titre: "Préparer la séance 17",
  echeance: "2026-11-04T09:00:00.000Z",
  terminee: false
};

console.log("DTO valide créé :", exempleDTO.titre);
`,
      solutionCode: `interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

const exempleDTO: TacheDTO = {
  id: "T-101",
  titre: "Préparer la séance 17",
  echeance: "2026-11-04T09:00:00.000Z",
  terminee: false
};

console.log("DTO valide créé :", exempleDTO.titre);
`,
      isCompleted: false,
      solutionExplanation: [
        'Une interface DTO ne déclare aucune méthode ni comportement : c\'est un sac de données passif.',
        'Les dates y sont modélisées sous forme de `string` (ISO 8601) pour refléter fidèlement le standard JSON.',
        'Elle sert de contrat d\'échange fiable entre le front-end et le stockage ou le réseau.'
      ],
      criteria: [
        {
          id: 'c10-interface-declared',
          label: 'Interface TacheDTO déclarée',
          description: 'L\'interface TacheDTO doit exister dans le code.',
          passed: false,
          hint: 'interface TacheDTO { ... }'
        },
        {
          id: 'c10-primitive-types',
          label: 'Types primitifs conformes (id, titre, echeance, terminee)',
          description: 'id: string, titre: string, echeance: string, terminee: boolean.',
          passed: false,
          hint: 'Vérifiez les noms et types des 4 propriétés'
        },
        {
          id: 'c10-compiles-cleanly',
          label: 'Exécution sans erreur',
          description: 'L\'objet exempleDTO s\'exécute et s\'affiche dans la console.',
          passed: false,
          hint: 'Vérifiez la console virtuelle'
        }
      ]
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Méthode d\'Exportation .toDTO()',
      subtitle: 'Projeter l\'entité vivante vers son contrat de transport',
      sectionId: 'dto-studio',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'L\'entité métier vivante `Tache` possède un véritable objet `echeance: Date` et des méthodes. Pour la sauvegarder, elle doit savoir se convertir en DTO passif. Implémentez la méthode d\'instance `toDTO(): TacheDTO` dans la classe `Tache` ci-dessous, en convertissant la date en chaîne ISO via `.toISOString()`.',
      hint: '`toDTO(): TacheDTO { return { id: this.id, titre: this.titre, echeance: this.echeance.toISOString(), terminee: this.terminee }; }`',
      initialCode: `interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

class Tache {
  constructor(
    public id: string,
    public titre: string,
    public echeance: Date,
    public terminee: boolean = false
  ) {}

  // À vous de jouer :
  // Implémentez toDTO(): TacheDTO
  toDTO(): TacheDTO {
    return { id: "", titre: "", echeance: "", terminee: false };
  }
}

const tache = new Tache("T-200", "Rédiger le compte-rendu", new Date("2026-10-30T10:00:00Z"));
const dto = tache.toDTO();

console.log("DTO produit :", JSON.stringify(dto));
console.log("Type de echeance dans le DTO :", typeof dto.echeance);
`,
      solutionCode: `interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

class Tache {
  constructor(
    public id: string,
    public titre: string,
    public echeance: Date,
    public terminee: boolean = false
  ) {}

  toDTO(): TacheDTO {
    return {
      id: this.id,
      titre: this.titre,
      echeance: this.echeance.toISOString(),
      terminee: this.terminee
    };
  }
}

const tache = new Tache("T-200", "Rédiger le compte-rendu", new Date("2026-10-30T10:00:00Z"));
const dto = tache.toDTO();

console.log("DTO produit :", JSON.stringify(dto));
console.log("Type de echeance dans le DTO :", typeof dto.echeance);
`,
      isCompleted: false,
      solutionExplanation: [
        'La méthode `.toDTO()` est la passerelle de sortie de la RAM vers la persistance.',
        'Elle isole la transformation des types complexes (ex: `Date` ➔ `string ISO`).',
        'Le résultat est immédiatement compatible avec `JSON.stringify(dto)` sans effet de bord.'
      ],
      criteria: [
        {
          id: 'c11-to-dto-method',
          label: 'Méthode toDTO() implémentée',
          description: 'Tache doit déclarer toDTO(): TacheDTO.',
          passed: false,
          hint: 'toDTO(): TacheDTO { ... }'
        },
        {
          id: 'c11-iso-date-string',
          label: 'Date convertie avec toISOString()',
          description: 'this.echeance.toISOString() doit être assigné à echeance.',
          passed: false,
          hint: 'this.echeance.toISOString()'
        },
        {
          id: 'c11-dto-output-valid',
          label: 'DTO généré avec typeof echeance === "string"',
          description: 'dto.echeance doit être de type string.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Fabrique Statique .fromDTO()',
      subtitle: 'Reconstruire l\'entité vivante et verrouiller les invariants',
      sectionId: 'dto-studio',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement:
        'La désérialisation doit toujours passer par le constructeur pour garantir les invariants ! Ajoutez la fabrique statique `static fromDTO(dto: TacheDTO): Tache` sur la classe `Tache`. Le constructeur doit valider que le titre n\'est pas vide (`titre.trim() === ""`) en levant `new Error("Titre obligatoire")`. La fabrique réhydrate `new Date(dto.echeance)` et retourne la nouvelle instance.',
      hint: 'Dans `static fromDTO(dto: TacheDTO): Tache`, faites `return new Tache(dto.id, dto.titre, new Date(dto.echeance), dto.terminee);`.',
      initialCode: `interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

class Tache {
  constructor(
    public id: string,
    public titre: string,
    public echeance: Date,
    public terminee: boolean = false
  ) {
    // 1. Validation de l'invariant de classe :
    if (!titre || titre.trim() === "") {
      throw new Error("Titre obligatoire");
    }
  }

  // 2. À vous de jouer :
  // Implémentez la fabrique statique fromDTO :
  static fromDTO(dto: TacheDTO): Tache {
    return new Tache("", "", new Date());
  }

  terminer(): void {
    this.terminee = true;
  }
}

// Test d'exécution :
const payload: TacheDTO = {
  id: "T-300",
  titre: "Installer Angular 22",
  echeance: "2026-11-01T12:00:00Z",
  terminee: false
};

const instance = Tache.fromDTO(payload);
instance.terminer();

console.log("Instance réhydratée :", instance instanceof Tache);
console.log("Méthode terminée fonctionnelle :", instance.terminee);
console.log("Année restaurée :", instance.echeance.getFullYear());
`,
      solutionCode: `interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

class Tache {
  constructor(
    public id: string,
    public titre: string,
    public echeance: Date,
    public terminee: boolean = false
  ) {
    if (!titre || titre.trim() === "") {
      throw new Error("Titre obligatoire");
    }
  }

  static fromDTO(dto: TacheDTO): Tache {
    return new Tache(
      dto.id,
      dto.titre,
      new Date(dto.echeance),
      dto.terminee
    );
  }

  terminer(): void {
    this.terminee = true;
  }
}

const payload: TacheDTO = {
  id: "T-300",
  titre: "Installer Angular 22",
  echeance: "2026-11-01T12:00:00Z",
  terminee: false
};

const instance = Tache.fromDTO(payload);
instance.terminer();

console.log("Instance réhydratée :", instance instanceof Tache);
console.log("Méthode terminée fonctionnelle :", instance.terminee);
console.log("Année restaurée :", instance.echeance.getFullYear());
`,
      isCompleted: false,
      solutionExplanation: [
        'La fabrique statique `static fromDTO()` est le point d\'entrée officiel de reconstruction d\'objet.',
        'Puisqu\'elle appelle `new Tache(...)`, le constructeur est obligatoirement déclenché et les invariants métier sont revérifiés.',
        'Le prototype de classe est parfaitement restauré : `instanceof Tache` vaut `true` et les méthodes sont à nouveau disponibles.'
      ],
      criteria: [
        {
          id: 'c12-static-from-dto',
          label: 'Fabrique statique static fromDTO',
          description: 'La classe Tache doit déclarer la méthode statique fromDTO(dto: TacheDTO): Tache.',
          passed: false,
          hint: 'static fromDTO(dto: TacheDTO): Tache'
        },
        {
          id: 'c12-date-rehydration',
          label: 'Réhydratation de new Date(dto.echeance)',
          description: 'La date ISO doit être convertie en véritable objet Date.',
          passed: false,
          hint: 'new Date(dto.echeance)'
        },
        {
          id: 'c12-instance-and-methods',
          label: 'Instance valide et méthodes actives',
          description: 'instance instanceof Tache est vrai et terminer() fonctionne.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: 'Type Guard Personnalisé',
      subtitle: 'Sécuriser la frontière inconnue avant réhydratation (val is TacheDTO)',
      sectionId: 'dto-studio',
      estimatedTime: '6 min',
      difficulty: 'Avancé',
      statement:
        'Le résultat de `JSON.parse` est par nature non fiable (`unknown`). Pour empêcher des corruptions mémoire, implémentez le garde de type `estTacheDTO(val: unknown): val is TacheDTO` qui vérifie : que `val` est un objet non nul, que `id`, `titre` et `echeance` sont des `string`, et que `terminee` est un `boolean`.',
      hint: 'Vérifiez `typeof val === "object" && val !== null` puis testez le type de chaque champ.',
      initialCode: `interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

// Implémentez le Type Guard :
function estTacheDTO(val: unknown): val is TacheDTO {
  // À vous de jouer :
  // 1. Vérifiez que val est un objet non nul
  // 2. Vérifiez le typeof de chaque propriété
  return false;
}

// Tests d'auto-évaluation :
const valide: unknown = { id: "1", titre: "Ok", echeance: "2026-10-28", terminee: true };
const invalide: unknown = { id: 2, titre: null }; // Types incorrects

console.log("Valide est TacheDTO ? :", estTacheDTO(valide));
console.log("Invalide est TacheDTO ? :", estTacheDTO(invalide));
`,
      solutionCode: `interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;
  terminee: boolean;
}

function estTacheDTO(val: unknown): val is TacheDTO {
  if (typeof val !== "object" || val === null) {
    return false;
  }
  const obj = val as Record<string, unknown>;
  return (
    typeof obj["id"] === "string" &&
    typeof obj["titre"] === "string" &&
    typeof obj["echeance"] === "string" &&
    typeof obj["terminee"] === "boolean"
  );
}

const valide: unknown = { id: "1", titre: "Ok", echeance: "2026-10-28", terminee: true };
const invalide: unknown = { id: 2, titre: null };

console.log("Valide est TacheDTO ? :", estTacheDTO(valide));
console.log("Invalide est TacheDTO ? :", estTacheDTO(invalide));
`,
      isCompleted: false,
      solutionExplanation: [
        'Le prédicat de type `val is TacheDTO` informe le compilateur TypeScript que si la fonction retourne `true`, la variable est garantie être un `TacheDTO`.',
        'Cela permet de manipuler `val` en toute sécurité sans recourir à un cast naïf `as`.',
        'Cette approche élimine le type `any` à la frontière d\'ingestion des données.'
      ],
      criteria: [
        {
          id: 'c13-type-predicate',
          label: 'Prédicat de type val is TacheDTO',
          description: 'La signature doit comporter le prédicat de type val is TacheDTO.',
          passed: false,
          hint: 'function estTacheDTO(val: unknown): val is TacheDTO'
        },
        {
          id: 'c13-check-object-non-null',
          label: 'Vérification objet non nul',
          description: 'La fonction doit vérifier typeof val === "object" && val !== null.',
          passed: false,
          hint: 'if (typeof val !== "object" || val === null) return false;'
        },
        {
          id: 'c13-discriminated-boolean-outputs',
          label: 'Résultats corrects (true pour valide, false pour invalide)',
          description: 'estTacheDTO(valide) === true et estTacheDTO(invalide) === false.',
          passed: false,
          hint: 'Vérifiez la console'
        }
      ]
    }
  ];

  readonly exercises = signal<Exercise[]>(
    this.exerciseDefinitions.map(def => ({ ...def, currentCode: def.initialCode }))
  );

  readonly activeExercise = computed<Exercise>(() => {
    const list = this.exercises();
    const idx = this.activeExerciseIndex();
    return list[idx] || list[0];
  });

  readonly completedCount = computed<number>(() => {
    return this.exercises().filter(e => e.isCompleted).length;
  });

  readonly totalCount = computed<number>(() => {
    return this.exercises().length;
  });

  readonly progressPercentage = computed<number>(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  selectExercise(id: string): void {
    this.selectExerciseById(id);
  }

  selectExerciseById(id: string): void {
    const idx = this.exercises().findIndex(e => e.id === id);
    if (idx !== -1) {
      this.activeExerciseIndex.set(idx);
    }
  }

  selectExerciseByIndex(index: number): void {
    if (index >= 0 && index < this.exercises().length) {
      this.activeExerciseIndex.set(index);
    }
  }

  setFilterLab(labNumber: number | null): void {
    this.filterLab.set(labNumber);
  }

  resetCurrentExercise(): void {
    const active = this.activeExercise();
    this.resetExercise(active.id);
  }

  resetExercise(exerciseId: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            currentCode: ex.initialCode,
            isCompleted: false,
            criteria: ex.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  revealSolution(): void {
    const active = this.activeExercise();
    this.injectSolution(active.id);
  }

  injectSolution(exerciseId: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === exerciseId) {
          return { ...ex, currentCode: ex.solutionCode };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  updateCurrentCode(id: string, code: string): void {
    this.updateExerciseCode(id, code);
  }

  updateExerciseCode(id: string, code: string): void {
    this.exercises.update(list => {
      return list.map(e => (e.id === id ? { ...e, currentCode: code } : e));
    });
    this.saveToStorage();
  }

  /**
   * Valide le code de l'exercice spécifié via le compilateur/transpileur en mémoire.
   */
  validateExercise(targetId: string, inputCode?: string): { success: boolean; logs: ConsoleLogEntry[]; error?: string } {
    const exercise = this.exercises().find(e => e.id === targetId);
    if (!exercise) {
      return { success: false, logs: [], error: 'Exercice introuvable' };
    }
    return this.evaluate(targetId, inputCode !== undefined ? inputCode : exercise.currentCode, 'student');
  }

  /** Critères qui sont déjà verts sur le code de départ NON modifié (mis en cache). */
  private readonly baselineGreenCache = new Map<string, Set<string>>();

  private getBaselineGreen(id: string): Set<string> {
    const cached = this.baselineGreenCache.get(id);
    if (cached) return cached;
    const ex = this.exercises().find(e => e.id === id);
    const green = new Set<string>();
    if (ex) {
      const res = this.evaluate(id, ex.initialCode, 'baseline');
      (res.criteria ?? []).filter(c => c.passed).forEach(c => green.add(c.id));
    }
    this.baselineGreenCache.set(id, green);
    return green;
  }

  private evaluate(targetId: string, rawCode: string, mode: 'baseline' | 'student'): { success: boolean; logs: ConsoleLogEntry[]; error?: string; criteria?: ValidationCriterion[] } {
    const exercise = this.exercises().find(e => e.id === targetId);
    if (!exercise) {
      return { success: false, logs: [], error: 'Exercice introuvable' };
    }

    const code = stripComments(rawCode);
    const exec = this.transpiler.executeCode(rawCode);

    const updatedCriteria = exercise.criteria.map(c => ({ ...c }));
    let allPassed = false;

    switch (targetId) {
      // LABO 1 : Syntaxe JSON & DOMParser XML
      case 'ex-1-1': {
        const noSingleQuotesInJson = !/'nom'|'prix'/.test(code);
        const noCommentsInJson = !/\/\/\s*commentaire/.test(code);
        const parseRunsSuccess = exec.success && exec.logs.some(l => l.text.includes("Souris Pro") && l.text.includes("49.99"));

        updatedCriteria[0].passed = noSingleQuotesInJson;
        updatedCriteria[1].passed = noCommentsInJson;
        updatedCriteria[2].passed = parseRunsSuccess;
        allPassed = noSingleQuotesInJson && noCommentsInJson && parseRunsSuccess;
        break;
      }

      case 'ex-1-2': {
        const hasDomParser = /DOMParser/.test(code) && /parseFromString/.test(code);
        const hasParserError = /parsererror/.test(code);
        const hasCorrectLogs = exec.success &&
          exec.logs.some(l => l.text.includes("XML valide : true")) &&
          exec.logs.some(l => l.text.includes("XML corrompu : false"));

        updatedCriteria[0].passed = hasDomParser;
        updatedCriteria[1].passed = hasParserError;
        updatedCriteria[2].passed = hasCorrectLogs;
        allPassed = hasDomParser && hasParserError && hasCorrectLogs;
        break;
      }

      case 'ex-1-3': {
        const hasGetAttribute = /getAttribute\s*\(\s*["']id["']\s*\)/.test(code);
        const hasParseFloat = /parseFloat|Number\(/.test(code);
        const hasExpectedOutput = exec.success && exec.logs.some(l => l.text.includes("ART-99") && l.text.includes("89.5"));

        updatedCriteria[0].passed = hasGetAttribute;
        updatedCriteria[1].passed = hasParseFloat;
        updatedCriteria[2].passed = hasExpectedOutput;
        allPassed = hasGetAttribute && hasParseFloat && hasExpectedOutput;
        break;
      }

      // LABO 2 : JSON.stringify, replacer & toJSON
      case 'ex-2-1': {
        const hasWhitelist = /\[\s*["']id["']\s*,\s*["']email["']\s*\]|\[\s*["']email["']\s*,\s*["']id["']\s*\]/.test(code);
        const hasSpace2 = /,\s*2\s*\)/.test(code);
        const noPassword = exec.success && !exec.logs.some(l => l.text.includes("argon2") || l.text.includes("Alice")) &&
          exec.logs.some(l => l.text.includes("alice@eafc.be") && l.text.includes("104"));

        updatedCriteria[0].passed = hasWhitelist;
        updatedCriteria[1].passed = hasSpace2;
        updatedCriteria[2].passed = noPassword;
        allPassed = hasWhitelist && hasSpace2 && noPassword;
        break;
      }

      case 'ex-2-2': {
        const hasCheckCondition = /cle\s*===?\s*["']motDePasse["']/.test(code);
        const returnsUndefined = /return\s+undefined/.test(code);
        const noPasswordInJson = exec.success && !exec.logs.some(l => l.text.includes("MonSuperSecret")) &&
          exec.logs.some(l => l.text.includes("USR-77") && l.text.includes("Bob"));

        updatedCriteria[0].passed = hasCheckCondition;
        updatedCriteria[1].passed = returnsUndefined;
        updatedCriteria[2].passed = noPasswordInJson;
        allPassed = hasCheckCondition && returnsUndefined && noPasswordInJson;
        break;
      }

      case 'ex-2-3': {
        const hasPrivateField = /#coutAchat/.test(code);
        const hasToJson = /toJSON\s*\(\s*\)/.test(code);
        const noPrivateExposed = exec.success && !exec.logs.some(l => l.text.includes("12") && l.text.includes("coutAchat")) &&
          exec.logs.some(l => l.text.includes("Livre TypeScript") && l.text.includes("30"));

        updatedCriteria[0].passed = hasPrivateField;
        updatedCriteria[1].passed = hasToJson;
        updatedCriteria[2].passed = noPrivateExposed;
        allPassed = hasPrivateField && hasToJson && noPrivateExposed;
        break;
      }

      // LABO 3 : Le Prototype Perdu & Limitations
      case 'ex-3-1': {
        const hasInstanceOf = /instanceof\s+Tache/.test(code);
        const returnsFalse = exec.success && exec.logs.some(l => l.text.includes("Est-ce une vraie Tache ? : false"));

        updatedCriteria[0].passed = hasInstanceOf;
        updatedCriteria[1].passed = returnsFalse;
        updatedCriteria[2].passed = exec.success;
        allPassed = hasInstanceOf && returnsFalse && exec.success;
        break;
      }

      case 'ex-3-2': {
        const hasNewDate = /new\s+Date\s*\(\s*donnees\.dateCreation\s*\)/.test(code);
        const yearSuccess = exec.success && exec.logs.some(l => l.text.includes("Année extraite avec succès : 2026"));
        const instanceOfDate = exec.success && exec.logs.some(l => l.text.includes("Est-ce bien une Date ? : true"));

        updatedCriteria[0].passed = hasNewDate;
        updatedCriteria[1].passed = yearSuccess;
        updatedCriteria[2].passed = instanceOfDate;
        allPassed = hasNewDate && yearSuccess && instanceOfDate;
        break;
      }

      case 'ex-3-3': {
        const hasTryCatch = /try\s*\{[\s\S]*\}\s*catch/.test(code);
        const hasSuccessBranch = exec.success && exec.logs.some(l => l.text.includes("succes: true") || l.text.includes('"succes": true'));
        const hasFailureBranch = exec.success && exec.logs.some(l => l.text.includes("succes: false") || l.text.includes('"succes": false'));

        updatedCriteria[0].passed = hasTryCatch;
        updatedCriteria[1].passed = hasSuccessBranch;
        updatedCriteria[2].passed = hasFailureBranch;
        allPassed = hasTryCatch && hasSuccessBranch && hasFailureBranch;
        break;
      }

      // LABO 4 : Le Patron DTO & Fabrique de Réhydratation
      case 'ex-4-1': {
        const hasInterface = /interface\s+TacheDTO\b/.test(code);
        const hasProperties = /id\s*:\s*string/.test(code) &&
          /titre\s*:\s*string/.test(code) &&
          /echeance\s*:\s*string/.test(code) &&
          /terminee\s*:\s*boolean/.test(code);
        const compilesOk = exec.success && exec.logs.some(l => l.text.includes("DTO valide créé :"));

        updatedCriteria[0].passed = hasInterface;
        updatedCriteria[1].passed = hasProperties;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasInterface && hasProperties && compilesOk;
        break;
      }

      case 'ex-4-2': {
        const hasToDto = /toDTO\s*\(\s*\)\s*(?::\s*TacheDTO)?/.test(code);
        const hasToIso = /toISOString\s*\(\s*\)/.test(code);
        const hasValidOutput = exec.success &&
          exec.logs.some(l => l.text.includes('"id":"T-200"')) &&
          exec.logs.some(l => l.text.includes("Type de echeance dans le DTO : string"));

        updatedCriteria[0].passed = hasToDto;
        updatedCriteria[1].passed = hasToIso;
        updatedCriteria[2].passed = hasValidOutput;
        allPassed = hasToDto && hasToIso && hasValidOutput;
        break;
      }

      case 'ex-4-3': {
        const hasStaticFromDto = /static\s+fromDTO\s*\([^)]*TacheDTO[^)]*\)/.test(code);
        const hasNewDate = /new\s+Date\s*\([^)]*echeance[^)]*\)/.test(code);
        const hasExpectedOutputs = exec.success &&
          exec.logs.some(l => l.text.includes("Instance réhydratée : true")) &&
          exec.logs.some(l => l.text.includes("Méthode terminée fonctionnelle : true")) &&
          exec.logs.some(l => l.text.includes("Année restaurée : 2026"));

        updatedCriteria[0].passed = hasStaticFromDto;
        updatedCriteria[1].passed = hasNewDate;
        updatedCriteria[2].passed = hasExpectedOutputs;
        allPassed = hasStaticFromDto && hasNewDate && hasExpectedOutputs;
        break;
      }

      case 'ex-4-4': {
        const hasTypePredicate = /estTacheDTO\s*\([^)]*\)\s*:\s*\w+\s+is\s+TacheDTO/.test(code);
        const checksNonNullObj = /typeof\s+\w+\s*[!=]==?\s*["']object["']/.test(code) && /[!=]==?\s*null/.test(code);
        const hasAccurateChecks = exec.success &&
          exec.logs.some(l => l.text.includes("Valide est TacheDTO ? : true")) &&
          exec.logs.some(l => l.text.includes("Invalide est TacheDTO ? : false"));

        updatedCriteria[0].passed = hasTypePredicate;
        updatedCriteria[1].passed = checksNonNullObj;
        updatedCriteria[2].passed = hasAccurateChecks;
        allPassed = hasTypePredicate && checksNonNullObj && hasAccurateChecks;
        break;
      }
    }

    // Mettre à jour l'exercice dans le signal
    if (mode === 'baseline') {
      return { success: allPassed, logs: exec.logs, error: exec.error, criteria: updatedCriteria };
    }

    // Les critères « gratuits » (déjà verts sur le code de départ non modifié, ex. « aucun new »)
    // ne s'allument qu'une fois tout le travail réel accompli : plus de validation « offerte ».
    const baselineGreen = this.getBaselineGreen(targetId);
    const workDone = updatedCriteria.filter(c => !baselineGreen.has(c.id)).every(c => c.passed);
    if (!workDone) {
      updatedCriteria.forEach(c => {
        if (baselineGreen.has(c.id)) c.passed = false;
      });
      allPassed = false;
    }

    this.exercises.update(list =>
      list.map(e =>
        e.id === targetId
          ? { ...e, currentCode: rawCode, isCompleted: allPassed, criteria: updatedCriteria }
          : e
      )
    );

    this.saveToStorage();

    return { success: allPassed, logs: exec.logs, error: exec.error, criteria: updatedCriteria };
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = this.exercises().map(e => ({
        id: e.id,
        currentCode: e.currentCode,
        isCompleted: e.isCompleted,
        criteria: e.criteria.map(c => ({ id: c.id, passed: c.passed }))
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignorer
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed: Array<{ id: string; currentCode: string; isCompleted: boolean; criteria: Array<{ id: string; passed: boolean }> }> = JSON.parse(raw);
      this.exercises.update(list => {
        return list.map(ex => {
          const saved = parsed.find(p => p.id === ex.id);
          if (!saved) return ex;
          return {
            ...ex,
            currentCode: saved.currentCode || ex.currentCode,
            isCompleted: saved.isCompleted ?? false,
            criteria: ex.criteria.map(c => {
              const savedCrit = saved.criteria?.find(sc => sc.id === c.id);
              return savedCrit ? { ...c, passed: savedCrit.passed } : c;
            })
          };
        });
      });
    } catch {
      // Ignorer
    }
  }
}
