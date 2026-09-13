# Séance 2 - Introduction au langage TypeScript

### Support de cours — Bachelier en informatique

---

## Avant-propos

Ce support constitue une introduction complète au langage TypeScript. Il a pour objectif de fournir à l'étudiant les bases syntaxiques et conceptuelles nécessaires à la compréhension du langage, préalablement à l'étude de la programmation orientée objet, laquelle fera l'objet d'un module distinct. Les notions propres à la programmation orientée objet (héritage, polymorphisme, encapsulation, visibilité des membres, interfaces implémentées par des classes, classes abstraites, etc.) ne sont volontairement pas abordées ici.

Chaque chapitre présente les notions théoriques, illustrées d'exemples de code, suivies d'une série d'exercices accompagnés de leur correction.

---

## Table des matières

1. [Introduction et origines de TypeScript](#chapitre-1--introduction-et-origines-de-typescript)
2. [Installation et environnement de travail](#chapitre-2--installation-et-environnement-de-travail)
3. [Les types de base](#chapitre-3--les-types-de-base)
4. [Variables et portée](#chapitre-4--variables-et-portée)
5. [Structures de contrôle et opérateurs](#chapitre-5--structures-de-contrôle-et-opérateurs)
6. [Fonctions](#chapitre-6--fonctions)
7. [Tableaux et structures de données](#chapitre-7--tableaux-et-structures-de-données)

8. [Objets, interfaces et types structurels](#chapitre-8--objets-interfaces-et-types-structurels)
9. [Classes : syntaxe de base](#chapitre-9--classes--syntaxe-de-base)
10. [Généricité (generics)](#chapitre-10--généricité-generics)
11. [Modules](#chapitre-11--modules)
12. [Asynchronisme : Promises et async/await](#chapitre-12--asynchronisme--promises-et-asyncawait)
13. [Décorateurs](#chapitre-13--décorateurs)
14. [Aperçu du framework Angular](#chapitre-14--aperçu-du-framework-angular)
15. [Synthèse générale](#chapitre-15--synthèse-générale)

---

## Chapitre 1 — Introduction et origines de TypeScript

### 1.1 Contexte historique

TypeScript est un langage de programmation développé et maintenu par Microsoft, dont la première version publique date de 2012. Il a été conçu sous la direction d'Anders Hejlsberg, également concepteur du langage C#. Son origine répond à un constat simple : JavaScript, bien qu'indispensable au développement web, a été conçu à l'origine (1995, par Brendan Eich) pour de petits scripts destinés à animer des pages web, et non pour la construction d'applications de grande envergure. Avec la généralisation des applications web complexes (applications à page unique, applications d'entreprise), les limites de JavaScript sont devenues plus problématiques, notamment l'absence de typage statique, source fréquente d'erreurs détectées seulement à l'exécution.

TypeScript a été conçu comme un **sur-ensemble syntaxique de JavaScript** (« JavaScript that scales », selon la formule employée par ses concepteurs). Cela signifie que :

- tout code JavaScript valide est également du code TypeScript valide ;
- TypeScript ajoute par-dessus JavaScript un système de **typage statique optionnel**, ainsi que des fonctionnalités syntaxiques modernes ;
- TypeScript ne s'exécute jamais directement : il est **transpilé** (compilé) vers du JavaScript avant exécution, que ce soit dans un navigateur ou dans un environnement comme Node.js.

### 1.2 Pourquoi typer un langage dynamiquement typé ?

JavaScript est un langage à **typage dynamique** : le type d'une variable n'est connu qu'à l'exécution, et une même variable peut changer de type au cours du programme. Ce fonctionnement offre une grande souplesse mais favorise certaines catégories d'erreurs qui ne sont détectées que lors de l'exécution du programme, parfois même en production.

TypeScript introduit un **typage statique** : le type des variables, paramètres et valeurs de retour peut être déclaré (ou déduit automatiquement) et est vérifié par le compilateur **avant** l'exécution. Le compilateur TypeScript (`tsc`) agit ainsi comme un outil de détection d'erreurs, mais également comme une documentation vivante du code et comme support à l'autocomplétion dans les éditeurs.

Il convient de souligner un point essentiel : le typage de TypeScript est un typage de **développement**. Une fois le code transpilé en JavaScript, toute information de type disparaît (on parle d'« effacement de type », *type erasure*). Le typage n'a donc aucun effet sur les performances d'exécution ; il s'agit d'un outil destiné au développeur.

### 1.3 Compilation (transpilation)

Le compilateur officiel de TypeScript, `tsc`, transforme un fichier `.ts` en fichier `.js` exécutable. Exemple :

```typescript
// fichier salutation.ts
function saluer(nom: string): string {
  return "Bonjour " + nom;
}
```

Après compilation (`tsc salutation.ts`), on obtient un fichier `salutation.js` classique, dépourvu de toute annotation de type, exécutable par n'importe quel moteur JavaScript.

### 1.4 Positionnement de TypeScript dans l'écosystème actuel

TypeScript est aujourd'hui largement adopté dans l'industrie, notamment parce qu'il constitue le langage par défaut de plusieurs frameworks front-end majeurs, dont **Angular**, qui l'utilise nativement depuis sa version 2 (2016). React et Vue.js proposent également un support de premier plan pour TypeScript. Il est également très employé côté serveur, notamment avec Node.js.

### Exercices — Chapitre 1

**Exercice 1.1.** Expliquer, en une dizaine de lignes, la différence fondamentale entre un langage à typage statique et un langage à typage dynamique. Citer un avantage et un inconvénient de chaque approche.

**Correction 1.1.**
Un langage à typage statique vérifie la cohérence des types au moment de la compilation : chaque variable possède un type connu avant l'exécution, ce qui permet de détecter précocement certaines erreurs (par exemple, additionner un nombre et une chaîne de caractères de façon incohérente). L'avantage principal est la détection anticipée des erreurs et une meilleure lisibilité/documentation du code ; l'inconvénient est une plus grande verbosité et une rigidité accrue lors du prototypage rapide. Un langage à typage dynamique (comme JavaScript natif) détermine le type des variables à l'exécution, ce qui offre davantage de souplesse et de rapidité d'écriture, mais reporte la détection de certaines erreurs à l'exécution, avec un risque accru en production.

**Exercice 1.2.** TypeScript est-il exécuté directement par les navigateurs web ? Justifier la réponse et décrire l'étape nécessaire avant exécution.

**Correction 1.2.**
Non. Les navigateurs (et Node.js) n'exécutent que du JavaScript. Le code TypeScript doit d'abord être transpilé en JavaScript à l'aide du compilateur `tsc` (ou d'un outil équivalent intégré à une chaîne de build). Le fichier `.js` généré est dépourvu de toute annotation de type, celles-ci n'existant que pour les besoins du développement.

**Exercice 1.3.** Un développeur affirme : « Le typage de TypeScript améliore les performances d'exécution de mon application. » Cette affirmation est-elle correcte ? Justifier.

**Correction 1.3.**
Cette affirmation est incorrecte. Le typage de TypeScript est entièrement supprimé lors de la compilation vers JavaScript (effacement de type). Le code JavaScript généré est strictement équivalent, en termes d'exécution, à un code JavaScript écrit directement. Le typage n'apporte donc aucun gain de performance à l'exécution ; son bénéfice se situe exclusivement au niveau du développement (détection d'erreurs, lisibilité, outillage).

**Exercice 1.4.** Citer deux raisons pour lesquelles TypeScript s'est largement imposé dans le développement d'applications web de grande taille.

**Correction 1.4.**
On peut notamment citer : (1) la détection anticipée d'erreurs grâce au typage statique, particulièrement utile lorsque plusieurs développeurs travaillent sur une base de code volumineuse ; (2) l'adoption de TypeScript comme langage par défaut par des frameworks majeurs tels qu'Angular, ce qui a favorisé sa diffusion dans l'industrie ; on pourrait également mentionner l'amélioration de l'outillage (autocomplétion, refactoring assisté) apportée par le typage statique.

---

## Chapitre 2 — Installation et environnement de travail

### 2.1 Prérequis : Node.js et npm

TypeScript s'installe généralement via **npm** (*Node Package Manager*), lui-même fourni avec **Node.js**. Il convient donc d'installer Node.js au préalable (disponible sur [nodejs.org](https://nodejs.org)).

### 2.2 Installation du compilateur

L'installation globale du compilateur TypeScript s'effectue via la commande suivante :

```bash
npm install -g typescript
```

La vérification de la version installée se fait ainsi :

```bash
tsc --version
```

### 2.3 Compilation d'un fichier

```bash
tsc mon-fichier.ts
```

Cette commande génère un fichier `mon-fichier.js` dans le même répertoire.

### 2.4 Le fichier de configuration `tsconfig.json`

Dans un projet réel, on ne compile jamais fichier par fichier : on définit un fichier `tsconfig.json` à la racine du projet, décrivant les options de compilation. Ce fichier peut être généré automatiquement :

```bash
tsc --init
```

Quelques options essentielles :

```json
{
  "compilerOptions": {
    "target": "ES2020",      // version de JavaScript générée
    "module": "commonjs",    // système de modules utilisé
    "strict": true,          // active l'ensemble des vérifications strictes
    "outDir": "./dist",      // dossier de sortie des fichiers .js
    "rootDir": "./src"       // dossier source des fichiers .ts
  }
}
```

L'option `strict` est particulièrement recommandée en contexte pédagogique : elle active un ensemble de vérifications rigoureuses (interdiction implicite du type `any`, vérification stricte des valeurs `null`/`undefined`, etc.) qui aident à adopter de bonnes pratiques dès l'apprentissage.

### 2.5 Exécution directe avec `ts-node`

Pour éviter l'étape de compilation manuelle lors de tests rapides, l'outil `ts-node` permet d'exécuter directement un fichier `.ts` :

```bash
npm install -g ts-node
ts-node mon-fichier.ts
```

### 2.6 Environnements de développement

Le langage étant indépendant de tout éditeur, il peut être utilisé dans n'importe quel environnement. Visual Studio Code, également développé par Microsoft, offre toutefois un support natif particulièrement abouti (vérification de types en temps réel, autocomplétion, navigation dans le code).

### Exercices — Chapitre 2

**Exercice 2.1.** Décrire, étape par étape, la procédure permettant de compiler manuellement un fichier `bonjour.ts` en `bonjour.js` à l'aide de `tsc`, en supposant que Node.js est déjà installé.

**Correction 2.1.**
1. Installer TypeScript globalement : `npm install -g typescript`.
2. Vérifier l'installation : `tsc --version`.
3. Se placer dans le dossier contenant `bonjour.ts`.
4. Exécuter `tsc bonjour.ts`, ce qui génère `bonjour.js` dans le même dossier.
5. Exécuter le fichier généré avec Node.js : `node bonjour.js`.

**Exercice 2.2.** Quelle est l'utilité du fichier `tsconfig.json` ? Que produit la commande `tsc --init` ?

**Correction 2.2.**
Le fichier `tsconfig.json` centralise les options de compilation d'un projet TypeScript (version de JavaScript ciblée, dossier source, dossier de sortie, niveau de rigueur du typage, etc.), évitant de devoir spécifier ces options manuellement à chaque compilation et permettant de compiler l'ensemble du projet via la simple commande `tsc`. La commande `tsc --init` génère automatiquement un fichier `tsconfig.json` par défaut, largement commenté, à la racine du projet.

**Exercice 2.3.** Expliquer la différence pratique entre l'utilisation de `tsc` suivi de `node`, et l'utilisation directe de `ts-node`.

**Correction 2.3.**
`tsc` suivi de `node` correspond à un flux en deux étapes : compilation explicite du fichier `.ts` vers un fichier `.js`, puis exécution de ce fichier `.js` par Node.js. `ts-node` fusionne ces deux étapes : il compile le code TypeScript « à la volée », en mémoire, puis l'exécute immédiatement, sans générer de fichier `.js` intermédiaire sur le disque. Cet outil est surtout utile en phase de développement ou pour des tests rapides ; il n'est en général pas utilisé pour livrer une application en production.

**Exercice 2.4.** Un projet possède l'option `"strict": true` dans son `tsconfig.json`. Quel est l'intérêt pédagogique de cette option pour un étudiant qui découvre le langage ?

**Correction 2.4.**
L'option `strict` regroupe un ensemble de vérifications rigoureuses (entre autres l'interdiction du typage implicite en `any`, et la prise en compte stricte de `null`/`undefined` dans les types). Pour un étudiant, elle a l'avantage de forcer une déclaration explicite et rigoureuse des types dès le départ, ce qui favorise l'acquisition de bonnes pratiques et évite de s'habituer à un typage relâché qui masquerait des erreurs potentielles.

---

## Chapitre 3 — Les types de base

### 3.1 Les types primitifs

TypeScript reprend les types primitifs de JavaScript et permet de les annoter explicitement :

```typescript
let age: number = 21;
let prenom: string = "Amina";
let estInscrit: boolean = true;
let rien: null = null;
let nonDefini: undefined = undefined;
```

### 3.2 L'inférence de type

Il n'est pas toujours nécessaire d'annoter explicitement le type d'une variable : lorsqu'une valeur initiale est fournie, TypeScript **déduit** (infère) automatiquement le type le plus adapté.

```typescript
let age = 21;        // inféré comme "number"
let prenom = "Amina"; // inféré comme "string"
```

Une fois le type inféré, il reste toutefois figé : une affectation ultérieure incompatible sera rejetée par le compilateur.

```typescript
let age = 21;
age = "vingt-et-un"; // erreur de compilation : string non assignable à number
```

### 3.3 Les types spéciaux : `any`, `unknown`, `never`, `void`

- **`any`** : désactive totalement la vérification de type pour la variable concernée. Son usage est déconseillé, car il annule les bénéfices du typage statique.
- **`unknown`** : type sûr pour représenter une valeur dont le type n'est pas connu à l'avance ; contrairement à `any`, il impose une vérification du type avant toute utilisation.
- **`void`** : indique l'absence de valeur de retour, typiquement utilisé pour une fonction qui ne retourne rien.
- **`never`** : représente une valeur qui ne se produit jamais (par exemple, une fonction qui lève systématiquement une exception, ou une boucle infinie).

```typescript
let valeur: unknown = "bonjour";

// utilisation directe interdite :
// valeur.toUpperCase(); // erreur de compilation

if (typeof valeur === "string") {
  valeur.toUpperCase(); // autorisé après vérification du type
}

function afficherMessage(msg: string): void {
  console.log(msg);
}

function leverErreur(message: string): never {
  throw new Error(message);
}
```

### 3.4 Types littéraux

Une valeur précise peut elle-même servir de type :

```typescript
let direction: "gauche" | "droite";
direction = "gauche"; // valide
direction = "haut";   // erreur de compilation
```

### 3.5 Unions et intersections de types

```typescript
let identifiant: number | string; // union : number OU string
identifiant = 42;
identifiant = "ABC123";

type Localisable = { latitude: number; longitude: number };
type Nommable = { nom: string };
type LieuNomme = Localisable & Nommable; // intersection : les deux à la fois

const gare: LieuNomme = { nom: "Gare centrale", latitude: 50.4, longitude: 4.4 };
```

### 3.6 Alias de type (`type`)

Un alias de type permet de nommer une combinaison de types afin de la réutiliser :

```typescript
type Identifiant = number | string;

function rechercherParId(id: Identifiant) {
  // ...
}
```

### 3.7 Conversion de type (*type assertion*)

Il est possible d'indiquer explicitement au compilateur que l'on considère une valeur comme étant d'un type précis, via `as` :

```typescript
let valeur: unknown = "42";
let longueur: number = (valeur as string).length;
```

Cette opération ne modifie pas la valeur réelle à l'exécution : elle informe uniquement le compilateur, sous la responsabilité du développeur.

### Exercices — Chapitre 3

**Exercice 3.1.** Déclarer une variable `note` destinée à contenir un nombre à virgule flottante, avec typage explicite, puis lui affecter la valeur `14.5`.

**Correction 3.1.**
```typescript
let note: number = 14.5;
```

**Exercice 3.2.** Expliquer pourquoi le code suivant provoque une erreur de compilation, puis proposer une correction :
```typescript
let quantite = 10;
quantite = "dix";
```

**Correction 3.2.**
Le type de `quantite` est inféré comme `number` lors de son initialisation avec la valeur `10`. L'affectation ultérieure d'une chaîne de caractères `"dix"` est donc incompatible avec ce type et provoque une erreur de compilation. Deux corrections sont possibles : soit conserver un nombre (`quantite = 10;`), soit déclarer explicitement un type union dès le départ : `let quantite: number | string = 10;`.

**Exercice 3.3.** Écrire une fonction `traiterEntree(valeur: unknown): string` qui retourne la valeur convertie en majuscules si elle est une chaîne de caractères, ou le message `"Type non supporté"` dans le cas contraire.

**Correction 3.3.**
```typescript
function traiterEntree(valeur: unknown): string {
  if (typeof valeur === "string") {
    return valeur.toUpperCase();
  }
  return "Type non supporté";
}
```

**Exercice 3.4.** Définir un alias de type `Statut` représentant uniquement les trois valeurs littérales `"actif"`, `"inactif"` et `"suspendu"`, puis déclarer une variable `statutUtilisateur` de ce type initialisée à `"actif"`.

**Correction 3.4.**
```typescript
type Statut = "actif" | "inactif" | "suspendu";
let statutUtilisateur: Statut = "actif";
```

---

## Chapitre 4 — Variables et portée

### 4.1 `var`, `let` et `const`

JavaScript, et donc TypeScript, propose trois mots-clés de déclaration de variable :

- **`var`** : héritée des premières versions de JavaScript, sa portée est celle de la **fonction** englobante (ou globale), et non du bloc. Son usage est aujourd'hui déconseillé en raison de comportements souvent contre-intuitifs.
- **`let`** : sa portée est celle du **bloc** (délimité par des accolades `{ }`). C'est la déclaration à privilégier pour une variable destinée à être réaffectée.
- **`const`** : également à portée de bloc, mais interdit toute réaffectation après l'initialisation. À privilégier par défaut, y compris pour les objets et tableaux (voir remarque ci-dessous).

```typescript
function demonstrationPortee() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  console.log(x); // 1 : accessible, portée fonction
  console.log(y); // erreur : y n'existe pas dans ce bloc
}
```

### 4.2 `const` et mutabilité

`const` interdit la **réaffectation** de la variable elle-même, mais n'empêche pas la modification du **contenu** d'un objet ou d'un tableau qu'elle référence.

```typescript
const utilisateur = { nom: "Dupont" };
utilisateur.nom = "Martin";     // autorisé : le contenu est modifié
// utilisateur = { nom: "X" };  // interdit : la référence ne peut être réaffectée

const notes: number[] = [12, 15];
notes.push(18); // autorisé
```

### 4.3 Portée de bloc et zone morte temporelle

Une variable déclarée avec `let` ou `const` n'est pas accessible avant sa ligne de déclaration, même si elle est techniquement « repérée » par l'interpréteur (contrairement à `var`, qui est « remontée » avec une valeur initiale `undefined`). Cette zone d'inaccessibilité est appelée *zone morte temporelle* (*temporal dead zone*).

```typescript
console.log(a); // undefined (var est "remontée")
var a = 5;

console.log(b); // erreur : b est utilisée avant son initialisation
let b = 5;
```

### 4.4 Convention de nommage

Bien que TypeScript n'impose aucune convention, l'usage largement répandu dans l'écosystème (et notamment dans Angular) est le suivant :

- variables et fonctions : `camelCase` (ex. `nombreEtudiants`) ;
- types, interfaces et classes : `PascalCase` (ex. `Etudiant`, `CompteBancaire`) ;
- constantes globales : parfois `UPPER_SNAKE_CASE` (ex. `TAUX_TVA`).

### Exercices — Chapitre 4

**Exercice 4.1.** Expliquer la différence de portée entre `var` et `let` à l'aide d'un exemple de code simple.

**Correction 4.1.**
```typescript
function exemple() {
  for (var i = 0; i < 3; i++) {}
  console.log(i); // 3 : "i" reste accessible après la boucle (portée fonction)

  for (let j = 0; j < 3; j++) {}
  console.log(j); // erreur : "j" n'existe pas ici (portée bloc)
}
```
`var` possède une portée liée à la fonction englobante : la variable `i` reste accessible après la boucle `for`. `let`, en revanche, possède une portée de bloc : la variable `j`, déclarée dans le bloc du `for`, n'existe plus une fois la boucle terminée.

**Exercice 4.2.** Le code suivant provoque-t-il une erreur de compilation ? Justifier.
```typescript
const equipe: string[] = ["Alice", "Bob"];
equipe.push("Chloé");
```

**Correction 4.2.**
Non, ce code ne provoque aucune erreur. `const` interdit uniquement la réaffectation de la variable `equipe` elle-même (par exemple `equipe = []`), mais n'empêche pas la modification du contenu du tableau qu'elle référence. La méthode `push` modifie le tableau existant sans réaffecter la variable, ce qui est parfaitement autorisé.

**Exercice 4.3.** Pourquoi recommande-t-on généralement d'utiliser `const` par défaut, et de ne recourir à `let` que lorsque c'est nécessaire ?

**Correction 4.3.**
L'usage systématique de `const` par défaut rend explicite l'intention du développeur : une variable déclarée en `const` ne sera jamais réaffectée, ce qui facilite la lecture et la compréhension du code (on sait immédiatement qu'aucune réaffectation n'est à rechercher plus loin dans le code). Cela réduit également les risques d'erreurs liées à une réaffectation accidentelle. `let` n'est utilisé que lorsque la variable doit explicitement pouvoir être réaffectée (par exemple, un compteur de boucle ou un accumulateur).

**Exercice 4.4.** Identifier l'erreur dans le code suivant et la corriger.
```typescript
function calculerRemise(prix: number) {
  console.log(remise);
  let remise = prix * 0.1;
  return remise;
}
```

**Correction 4.4.**
La variable `remise` est utilisée (ligne `console.log(remise)`) avant sa déclaration, alors qu'elle est déclarée avec `let`. Cela déclenche une erreur liée à la zone morte temporelle. La correction consiste à déplacer la déclaration avant son utilisation :
```typescript
function calculerRemise(prix: number) {
  let remise = prix * 0.1;
  console.log(remise);
  return remise;
}
```

---

## Chapitre 5 — Structures de contrôle et opérateurs

### 5.1 Les instructions conditionnelles

```typescript
let temperature: number = 18;

if (temperature < 0) {
  console.log("Gel");
} else if (temperature < 20) {
  console.log("Frais");
} else {
  console.log("Agréable");
}
```

L'opérateur ternaire offre une écriture condensée pour les cas simples :

```typescript
let message = temperature < 20 ? "Frais" : "Agréable";
```

### 5.2 L'instruction `switch`

```typescript
type JourSemaine = "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi" | "dimanche";

function estWeekend(jour: JourSemaine): boolean {
  switch (jour) {
    case "samedi":
    case "dimanche":
      return true;
    default:
      return false;
  }
}
```

### 5.3 Les boucles

```typescript
// boucle for classique
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// boucle while
let compteur = 0;
while (compteur < 5) {
  compteur++;
}

// boucle do...while
let n = 0;
do {
  n++;
} while (n < 5);
```

### 5.4 `for...of` et `for...in`

- **`for...of`** parcourt les **valeurs** d'un itérable (tableau, chaîne de caractères, `Map`, `Set`, etc.).
- **`for...in`** parcourt les **clés** (indices ou propriétés) d'un objet.

```typescript
const fruits: string[] = ["pomme", "poire", "banane"];

for (const fruit of fruits) {
  console.log(fruit); // pomme, poire, banane
}

for (const index in fruits) {
  console.log(index); // "0", "1", "2"
}
```

### 5.5 Opérateurs logiques et de comparaison

TypeScript distingue l'égalité **stricte** (`===`, `!==`), qui compare valeur **et** type sans conversion implicite, de l'égalité **relâchée** (`==`, `!=`), qui autorise une conversion implicite de type avant comparaison. L'usage de l'égalité stricte est fortement recommandé.

```typescript
console.log(5 === "5"); // false : types différents
console.log(5 == "5");  // true  : conversion implicite effectuée
```

### 5.6 Optional chaining (`?.`) et nullish coalescing (`??`)

Ces deux opérateurs, introduits en JavaScript moderne (ES2020) et pleinement supportés par TypeScript, facilitent la gestion des valeurs potentiellement `null` ou `undefined`.

```typescript
type Adresse = { ville?: string };
type Personne = { nom: string; adresse?: Adresse };

function afficherVille(p: Personne): string {
  // évite une erreur si "adresse" est undefined
  return p.adresse?.ville ?? "Ville inconnue";
}
```

`?.` interrompt l'évaluation de la chaîne et retourne `undefined` dès qu'une valeur intermédiaire est `null` ou `undefined`, au lieu de lever une erreur. `??` fournit une valeur de repli **uniquement** lorsque l'opérande de gauche vaut `null` ou `undefined` (contrairement à `||`, qui se déclenche pour toute valeur « fausse », y compris `0` ou `""`).

### Exercices — Chapitre 5

**Exercice 5.1.** Écrire une fonction `classerAge(age: number): string` qui retourne `"mineur"` si l'âge est strictement inférieur à 18, `"jeune adulte"` s'il est compris entre 18 et 25 inclus, et `"adulte"` au-delà.

**Correction 5.1.**
```typescript
function classerAge(age: number): string {
  if (age < 18) {
    return "mineur";
  } else if (age <= 25) {
    return "jeune adulte";
  } else {
    return "adulte";
  }
}
```

**Exercice 5.2.** À l'aide d'une boucle `for`, écrire une fonction `sommeDe1AN(n: number): number` qui calcule la somme des entiers de 1 à `n`.

**Correction 5.2.**
```typescript
function sommeDe1AN(n: number): number {
  let somme = 0;
  for (let i = 1; i <= n; i++) {
    somme += i;
  }
  return somme;
}
```

**Exercice 5.3.** À l'aide d'un `for...of`, écrire une fonction `compterVoyelles(mot: string): number` qui retourne le nombre de voyelles (a, e, i, o, u, y) présentes dans un mot, sans tenir compte de la casse.

**Correction 5.3.**
```typescript
function compterVoyelles(mot: string): number {
  const voyelles = "aeiouy";
  let total = 0;
  for (const lettre of mot.toLowerCase()) {
    if (voyelles.includes(lettre)) {
      total++;
    }
  }
  return total;
}
```

**Exercice 5.4.** Expliquer la différence de comportement entre les deux expressions suivantes, pour `quantite = 0` :
```typescript
const a = quantite || 10;
const b = quantite ?? 10;
```

**Correction 5.4.**
Pour `quantite = 0`, `a` vaudra `10`, car l'opérateur `||` considère `0` comme une valeur « fausse » (*falsy*) et déclenche donc la valeur de repli. En revanche, `b` vaudra `0`, car l'opérateur `??` (nullish coalescing) ne déclenche la valeur de repli que si l'opérande de gauche est strictement `null` ou `undefined`, ce qui n'est pas le cas de `0`. Cette distinction est essentielle lorsque la valeur `0` (ou une chaîne vide) constitue une valeur légitime que l'on ne souhaite pas remplacer.

---

## Chapitre 6 — Fonctions

### 6.1 Déclaration et typage

```typescript
function additionner(a: number, b: number): number {
  return a + b;
}
```

Le type de retour peut être omis : TypeScript l'infère à partir du corps de la fonction. Son annotation explicite reste toutefois recommandée pour les fonctions publiques, à des fins de lisibilité.

### 6.2 Fonctions fléchées (*arrow functions*)

```typescript
const multiplier = (a: number, b: number): number => a + b === a ? 0 : a * b;

const carre = (x: number): number => x * x;
```

Les fonctions fléchées offrent une syntaxe plus concise et, à la différence des fonctions classiques, ne redéfinissent pas la valeur de `this` : elles conservent celle du contexte englobant. Ce comportement les rend particulièrement utilisées comme callbacks et dans les frameworks tels qu'Angular.

### 6.3 Paramètres optionnels et valeurs par défaut

```typescript
function saluer(nom: string, titre?: string): string {
  return titre ? `Bonjour ${titre} ${nom}` : `Bonjour ${nom}`;
}

function puissance(base: number, exposant: number = 2): number {
  return base ** exposant;
}
```

Un paramètre optionnel (`?`) doit obligatoirement être déclaré après les paramètres obligatoires.

### 6.4 Paramètres du reste (*rest parameters*)

```typescript
function additionnerTout(...nombres: number[]): number {
  return nombres.reduce((total, n) => total + n, 0);
}

additionnerTout(1, 2, 3, 4); // 10
```

### 6.5 Signature de fonction en tant que type

Une fonction peut être typée comme n'importe quelle autre valeur, ce qui permet de la passer en paramètre ou de la stocker dans une variable :

```typescript
type OperationBinaire = (a: number, b: number) => number;

function appliquerOperation(a: number, b: number, operation: OperationBinaire): number {
  return operation(a, b);
}

appliquerOperation(4, 5, (x, y) => x + y); // 9
```

### 6.6 Surcharge de fonctions (*overloads*)

TypeScript permet de décrire plusieurs signatures possibles pour une même fonction, utile lorsque le type de retour dépend du type des paramètres :

```typescript
function formater(valeur: number): string;
function formater(valeur: string): string;
function formater(valeur: number | string): string {
  if (typeof valeur === "number") {
    return valeur.toFixed(2);
  }
  return valeur.trim();
}
```

### Exercices — Chapitre 6

**Exercice 6.1.** Écrire, sous forme de fonction fléchée typée, une fonction `estPair` prenant un `number` et retournant un `boolean`.

**Correction 6.1.**
```typescript
const estPair = (n: number): boolean => n % 2 === 0;
```

**Exercice 6.2.** Écrire une fonction `creerMessage(destinataire: string, expediteur?: string): string` qui retourne `"Message pour {destinataire}, de la part de {expediteur}"` si `expediteur` est fourni, ou `"Message pour {destinataire}"` sinon.

**Correction 6.2.**
```typescript
function creerMessage(destinataire: string, expediteur?: string): string {
  if (expediteur) {
    return `Message pour ${destinataire}, de la part de ${expediteur}`;
  }
  return `Message pour ${destinataire}`;
}
```

**Exercice 6.3.** À l'aide de paramètres du reste, écrire une fonction `moyenne(...valeurs: number[]): number` qui calcule la moyenne d'un nombre variable de valeurs (on supposera qu'au moins une valeur est fournie).

**Correction 6.3.**
```typescript
function moyenne(...valeurs: number[]): number {
  const somme = valeurs.reduce((total, v) => total + v, 0);
  return somme / valeurs.length;
}
```

**Exercice 6.4.** Définir un alias de type `Predicat<T>` — on pourra ici se contenter de `Predicat` typé pour `number` — représentant une fonction prenant un `number` et retournant un `boolean`, puis écrire une fonction `filtrerNombres(nombres: number[], predicat: Predicat): number[]` qui retourne les éléments du tableau satisfaisant le prédicat.

**Correction 6.4.**
```typescript
type Predicat = (valeur: number) => boolean;

function filtrerNombres(nombres: number[], predicat: Predicat): number[] {
  return nombres.filter(predicat);
}

// exemple d'utilisation :
filtrerNombres([1, 2, 3, 4, 5], (n) => n % 2 === 0); // [2, 4]
```

---

## Chapitre 7 — Tableaux et structures de données

### 7.1 Tableaux typés

```typescript
let nombres: number[] = [1, 2, 3];
let prenoms: Array<string> = ["Alice", "Bob"]; // syntaxe générique équivalente
```

### 7.2 Les tuples

Un tuple est un tableau de longueur fixe dont le type de chaque position est défini individuellement :

```typescript
let coordonnee: [number, number] = [50.4, 4.4];
let entreeUtilisateur: [string, number, boolean] = ["Alice", 21, true];
```

### 7.3 Méthodes courantes sur les tableaux

```typescript
const notes: number[] = [12, 15, 9, 18];

const moyenneNotes = notes.reduce((acc, n) => acc + n, 0) / notes.length;
const notesReussies = notes.filter((n) => n >= 10);
const notesSur20Vers10 = notes.map((n) => n / 2);
const premiereEchec = notes.find((n) => n < 10);
const toutesReussies = notes.every((n) => n >= 10);
const uneEchouee = notes.some((n) => n < 10);
```

### 7.4 Déstructuration (*destructuring*)

```typescript
const [premier, second] = notes;

const utilisateur = { nom: "Dupont", age: 30 };
const { nom, age } = utilisateur;

function afficherPosition({ x, y }: { x: number; y: number }): void {
  console.log(`(${x}, ${y})`);
}
```

### 7.5 Opérateur de décomposition (*spread*)

```typescript
const notesInitiales = [12, 15];
const toutesLesNotes = [...notesInitiales, 18, 9];

const optionsBase = { langue: "fr", theme: "clair" };
const optionsPersonnalisees = { ...optionsBase, theme: "sombre" };
```

### 7.6 `Map` et `Set`

`Map` associe des clés à des valeurs (comparable à un dictionnaire), en conservant le type des clés et des valeurs. `Set` représente un ensemble de valeurs uniques.

```typescript
const capitales = new Map<string, string>();
capitales.set("Belgique", "Bruxelles");
capitales.set("France", "Paris");
console.log(capitales.get("Belgique")); // "Bruxelles"

const idsUniques = new Set<number>([1, 2, 2, 3]);
console.log(idsUniques.size); // 3
```

### Exercices — Chapitre 7

**Exercice 7.1.** Déclarer un tuple `etudiant` composé d'un `string` (nom), d'un `number` (âge) et d'un tableau de `number` (notes).

**Correction 7.1.**
```typescript
let etudiant: [string, number, number[]] = ["Amina", 20, [14, 16, 12]];
```

**Exercice 7.2.** À l'aide de `map` et `filter`, écrire une fonction `doublerPairs(nombres: number[]): number[]` qui retourne, dans un nouveau tableau, le double de chaque nombre pair du tableau d'origine (les nombres impairs sont ignorés).

**Correction 7.2.**
```typescript
function doublerPairs(nombres: number[]): number[] {
  return nombres.filter((n) => n % 2 === 0).map((n) => n * 2);
}
```

**Exercice 7.3.** À l'aide de la déstructuration, écrire une fonction `presenter` qui reçoit un objet `{ nom: string; ville: string }` et retourne la chaîne `"{nom} habite à {ville}"`.

**Correction 7.3.**
```typescript
function presenter({ nom, ville }: { nom: string; ville: string }): string {
  return `${nom} habite à ${ville}`;
}
```

**Exercice 7.4.** À l'aide d'un `Map<string, number>`, écrire une fonction `compterOccurrences(mots: string[]): Map<string, number>` qui retourne le nombre d'occurrences de chaque mot d'un tableau.

**Correction 7.4.**
```typescript
function compterOccurrences(mots: string[]): Map<string, number> {
  const compteur = new Map<string, number>();
  for (const mot of mots) {
    compteur.set(mot, (compteur.get(mot) ?? 0) + 1);
  }
  return compteur;
}
```

---

## Chapitre 8 — Objets, interfaces et types structurels

### 8.1 Typage d'objets

```typescript
let voiture: { marque: string; annee: number } = {
  marque: "Toyota",
  annee: 2020,
};
```

### 8.2 Les interfaces

Une interface décrit la **forme** attendue d'un objet, sans se limiter à un usage lié aux classes : elle constitue avant tout un outil de définition de types.

```typescript
interface Livre {
  titre: string;
  auteur: string;
  anneePublication: number;
  disponible?: boolean; // propriété optionnelle
  readonly isbn: string; // propriété en lecture seule après création
}

const livre1: Livre = {
  titre: "1984",
  auteur: "George Orwell",
  anneePublication: 1949,
  isbn: "978-2070368228",
};

// livre1.isbn = "autre"; // erreur : propriété en lecture seule
```

### 8.3 `interface` versus `type`

Pour décrire la forme d'un objet, `interface` et `type` sont dans une large mesure interchangeables :

```typescript
interface PersonneA {
  nom: string;
}

type PersonneB = {
  nom: string;
};
```

Deux différences pratiques méritent d'être retenues : une `interface` peut être étendue par une autre interface via `extends` et peut être **rouverte** (deux déclarations du même nom fusionnent automatiquement leurs membres), tandis qu'un `type` (alias) ne peut pas être rouvert, mais peut représenter des types qu'une interface ne peut pas exprimer (union, intersection, type primitif, tuple). En pratique, l'usage veut que `interface` soit privilégiée pour décrire la forme d'un objet ou d'un futur composant, et `type` pour tout le reste (unions, alias de types primitifs, etc.).

### 8.4 Typage structurel (*structural typing*)

Une particularité importante de TypeScript, héritée du concept de *duck typing*, est que la compatibilité entre deux types repose sur leur **structure**, et non sur un nom déclaré explicitement.

```typescript
interface Point {
  x: number;
  y: number;
}

function afficherPoint(p: Point): void {
  console.log(`(${p.x}, ${p.y})`);
}

const coordonneeGPS = { x: 10, y: 20, altitude: 100 };
afficherPoint(coordonneeGPS); // valide : possède au minimum x et y
```

### 8.5 Signatures d'index

Une signature d'index permet de typer un objet dont l'ensemble des clés n'est pas connu à l'avance, mais dont le type des clés et des valeurs est connu :

```typescript
interface DictionnaireDeScores {
  [nomJoueur: string]: number;
}

const scores: DictionnaireDeScores = {
  Alice: 42,
  Bob: 37,
};
```

### Exercices — Chapitre 8

**Exercice 8.1.** Définir une interface `Produit` possédant les propriétés `nom` (string), `prix` (number) et `enStock` (boolean, optionnelle), puis créer une constante `produit1` conforme à cette interface, sans préciser `enStock`.

**Correction 8.1.**
```typescript
interface Produit {
  nom: string;
  prix: number;
  enStock?: boolean;
}

const produit1: Produit = {
  nom: "Clavier mécanique",
  prix: 79.99,
};
```

**Exercice 8.2.** Expliquer pourquoi le code suivant compile sans erreur, alors que l'objet `commande` possède davantage de propriétés que celles définies dans l'interface `Commande`.
```typescript
interface Commande {
  id: number;
  montant: number;
}

function afficherCommande(c: Commande): void {
  console.log(c.id);
}

const commande = { id: 1, montant: 49.9, client: "Dupont" };
afficherCommande(commande);
```

**Correction 8.2.**
Ce code compile car TypeScript utilise un système de typage **structurel** : un objet est considéré compatible avec un type donné dès lors qu'il possède **au minimum** toutes les propriétés requises par ce type, avec les bons types. La propriété supplémentaire `client` n'empêche pas la compatibilité, puisque `commande` possède bien `id` (number) et `montant` (number). Ce mécanisme diffère d'un typage nominal strict, où seule une correspondance exacte de nom de type serait acceptée.

**Exercice 8.3.** Définir une interface `Inventaire` représentant un objet dont les clés sont des chaînes de caractères (noms d'articles) et les valeurs des nombres (quantités en stock), puis écrire une fonction `quantiteTotale(inventaire: Inventaire): number` qui retourne la somme des quantités.

**Correction 8.3.**
```typescript
interface Inventaire {
  [article: string]: number;
}

function quantiteTotale(inventaire: Inventaire): number {
  return Object.values(inventaire).reduce((total, quantite) => total + quantite, 0);
}
```

**Exercice 8.4.** Définir une interface `Vehicule` avec une propriété `immatriculation` en lecture seule (`readonly`) et une propriété `kilometrage` modifiable. Créer une instance, puis expliquer pourquoi une tentative de modification de `immatriculation` échouerait à la compilation.

**Correction 8.4.**
```typescript
interface Vehicule {
  readonly immatriculation: string;
  kilometrage: number;
}

const vehicule1: Vehicule = {
  immatriculation: "1-ABC-123",
  kilometrage: 45000,
};

vehicule1.kilometrage = 45500; // autorisé
// vehicule1.immatriculation = "1-XYZ-999"; // erreur de compilation
```
Le mot-clé `readonly` indique au compilateur qu'une propriété ne peut être affectée qu'au moment de la création de l'objet. Toute tentative de réaffectation ultérieure est détectée et rejetée dès la compilation, ce qui protège la propriété contre toute modification accidentelle.

---

## Chapitre 9 — Classes : syntaxe de base

> Ce chapitre se limite strictement à la syntaxe permettant de lire et d'écrire une classe simple en TypeScript. Les mécanismes propres à la programmation orientée objet (héritage, polymorphisme, visibilité des membres, classes abstraites, interfaces implémentées) seront abordés dans un module ultérieur. L'objectif est ici uniquement de permettre à l'étudiant de reconnaître cette syntaxe, notamment dans le contexte des composants Angular présentés au chapitre 14.

### 9.1 Définition d'une classe

```typescript
class CompteBancaire {
  solde: number;
  titulaire: string;

  constructor(titulaire: string, soldeInitial: number) {
    this.titulaire = titulaire;
    this.solde = soldeInitial;
  }

  deposer(montant: number): void {
    this.solde += montant;
  }

  afficherSolde(): string {
    return `${this.titulaire} : ${this.solde} €`;
  }
}

const compte1 = new CompteBancaire("Dupont", 100);
compte1.deposer(50);
console.log(compte1.afficherSolde()); // "Dupont : 150 €"
```

Une classe regroupe des **propriétés** (les données) et des **méthodes** (le comportement associé). Le mot-clé `new` permet de créer une **instance** de la classe, c'est-à-dire un objet concret construit à partir de ce modèle. Le mot-clé `this`, à l'intérieur d'une méthode, désigne l'instance sur laquelle la méthode est appelée.

### 9.2 Syntaxe raccourcie des propriétés dans le constructeur

TypeScript autorise une écriture condensée, très répandue en pratique, permettant de déclarer et d'initialiser une propriété directement depuis les paramètres du constructeur :

```typescript
class Produit {
  constructor(public nom: string, public prix: number) {}
}

const p = new Produit("Clavier", 49.99);
console.log(p.nom); // "Clavier"
```

Ce code est strictement équivalent à la version « longue » du paragraphe précédent (déclaration des propriétés, puis affectation dans le corps du constructeur). Le mot-clé `public` employé ici précise uniquement la visibilité par défaut de la propriété ; son étude détaillée, ainsi que celle des autres modificateurs de visibilité, relève du module consacré à la programmation orientée objet.

### 9.3 Propriétés en lecture seule

Comme pour les interfaces, une propriété de classe peut être déclarée `readonly` :

```typescript
class Utilisateur {
  readonly identifiant: number;
  nom: string;

  constructor(identifiant: number, nom: string) {
    this.identifiant = identifiant;
    this.nom = nom;
  }
}
```

### 9.4 Valeurs par défaut

```typescript
class Compteur {
  valeur: number = 0;

  incrementer(): void {
    this.valeur++;
  }
}
```

### Exercices — Chapitre 9

**Exercice 9.1.** Écrire une classe `Rectangle` possédant deux propriétés `largeur` et `hauteur` (de type `number`), initialisées via le constructeur, ainsi qu'une méthode `aire(): number` retournant l'aire du rectangle.

**Correction 9.1.**
```typescript
class Rectangle {
  largeur: number;
  hauteur: number;

  constructor(largeur: number, hauteur: number) {
    this.largeur = largeur;
    this.hauteur = hauteur;
  }

  aire(): number {
    return this.largeur * this.hauteur;
  }
}
```

**Exercice 9.2.** Réécrire la classe `Rectangle` de l'exercice précédent en utilisant la syntaxe raccourcie des propriétés dans le constructeur.

**Correction 9.2.**
```typescript
class Rectangle {
  constructor(public largeur: number, public hauteur: number) {}

  aire(): number {
    return this.largeur * this.hauteur;
  }
}
```

**Exercice 9.3.** Écrire une classe `Chronometre` possédant une propriété `secoulees` (initialisée à `0`) et deux méthodes : `demarrer()`, qui incrémente `secoulees` de 1, et `reinitialiser()`, qui remet `secoulees` à `0`.

**Correction 9.3.**
```typescript
class Chronometre {
  secoulees: number = 0;

  demarrer(): void {
    this.secoulees++;
  }

  reinitialiser(): void {
    this.secoulees = 0;
  }
}
```

**Exercice 9.4.** Créer une instance de la classe `CompteBancaire` présentée en 9.1, avec un solde initial de `200`, effectuer deux dépôts de `50` et `25`, puis afficher le solde final à l'aide de `afficherSolde()`.

**Correction 9.4.**
```typescript
const compteEtudiant = new CompteBancaire("Etudiant Test", 200);
compteEtudiant.deposer(50);
compteEtudiant.deposer(25);
console.log(compteEtudiant.afficherSolde()); // "Etudiant Test : 275 €"
```

---

## Chapitre 10 — Généricité (generics)

### 10.1 Motivation

La généricité permet d'écrire des fonctions, interfaces ou classes réutilisables avec des types variables, sans pour autant renoncer à la vérification statique de type (contrairement à l'usage de `any`, qui désactiverait toute vérification).

```typescript
// Sans generics : duplication ou perte de précision de type
function premierElementAny(tableau: any[]): any {
  return tableau[0];
}

// Avec generics : le type est préservé
function premierElement<T>(tableau: T[]): T {
  return tableau[0];
}

const nombre = premierElement<number>([1, 2, 3]);   // typé "number"
const texte = premierElement<string>(["a", "b"]);   // typé "string"
```

Dans l'exemple ci-dessus, `T` est un **paramètre de type** : il représente un type qui sera précisé lors de l'appel de la fonction (ou déduit automatiquement par inférence).

### 10.2 Inférence automatique du type générique

Dans la pratique, il n'est presque jamais nécessaire de préciser explicitement le type générique entre chevrons : TypeScript l'infère à partir des arguments fournis.

```typescript
const dernier = premierElement([10, 20, 30]); // T déduit comme "number"
```

### 10.3 Interfaces génériques

```typescript
interface Paire<T> {
  premier: T;
  second: T;
}

const coordonnees: Paire<number> = { premier: 10, second: 20 };
const nomsComplets: Paire<string> = { premier: "Jean", second: "Dupont" };
```

### 10.4 Contraintes sur les types génériques (`extends`)

Il est possible de restreindre les types acceptés par un paramètre générique à l'aide de `extends` :

```typescript
interface PossedeLongueur {
  length: number;
}

function afficherLongueur<T extends PossedeLongueur>(element: T): number {
  return element.length;
}

afficherLongueur("bonjour");     // valide : string possède "length"
afficherLongueur([1, 2, 3]);     // valide : tableau possède "length"
// afficherLongueur(42);          // erreur : number ne possède pas "length"
```

### Exercices — Chapitre 10

**Exercice 10.1.** Écrire une fonction générique `dernierElement<T>(tableau: T[]): T` retournant le dernier élément d'un tableau.

**Correction 10.1.**
```typescript
function dernierElement<T>(tableau: T[]): T {
  return tableau[tableau.length - 1];
}
```

**Exercice 10.2.** Définir une interface générique `Boite<T>` possédant une unique propriété `contenu` de type `T`, puis créer une constante `boiteDeNombres` de type `Boite<number>` contenant la valeur `42`.

**Correction 10.2.**
```typescript
interface Boite<T> {
  contenu: T;
}

const boiteDeNombres: Boite<number> = { contenu: 42 };
```

**Exercice 10.3.** Écrire une fonction générique `inverserPaire<T>(paire: [T, T]): [T, T]` qui retourne un tuple avec les deux éléments inversés.

**Correction 10.3.**
```typescript
function inverserPaire<T>(paire: [T, T]): [T, T] {
  return [paire[1], paire[0]];
}

inverserPaire<number>([1, 2]); // [2, 1]
```

**Exercice 10.4.** Écrire une fonction générique `estVide<T extends { length: number }>(element: T): boolean` qui retourne `true` si l'élément possède une longueur nulle (fonctionne aussi bien pour des chaînes que pour des tableaux).

**Correction 10.4.**
```typescript
function estVide<T extends { length: number }>(element: T): boolean {
  return element.length === 0;
}

estVide("");        // true
estVide([1, 2, 3]); // false
```

---

## Chapitre 11 — Modules

### 11.1 Exportation

Chaque fichier TypeScript peut constituer un **module**, exposant explicitement les éléments destinés à être utilisés ailleurs.

```typescript
// fichier calculatrice.ts
export function additionner(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

export interface Operation {
  symbole: string;
  executer: (a: number, b: number) => number;
}
```

### 11.2 Importation

```typescript
// fichier principal.ts
import { additionner, PI, Operation } from "./calculatrice";

console.log(additionner(2, 3));
```

### 11.3 Export par défaut

Un module peut également exposer un unique élément par défaut :

```typescript
// fichier logger.ts
export default class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

// fichier principal.ts
import Logger from "./logger";
```

### 11.4 Renommage à l'import et import global

```typescript
import { additionner as sommer } from "./calculatrice";
import * as Calc from "./calculatrice";

Calc.additionner(1, 2);
```

### Exercices — Chapitre 11

**Exercice 11.1.** Écrire un fichier `geometrie.ts` exportant une fonction `aireCercle(rayon: number): number` (on utilisera `Math.PI`).

**Correction 11.1.**
```typescript
// geometrie.ts
export function aireCercle(rayon: number): number {
  return Math.PI * rayon * rayon;
}
```

**Exercice 11.2.** Écrire le fichier `principal.ts` qui importe uniquement la fonction `aireCercle` définie à l'exercice précédent, et affiche l'aire d'un cercle de rayon 5.

**Correction 11.2.**
```typescript
// principal.ts
import { aireCercle } from "./geometrie";

console.log(aireCercle(5));
```

**Exercice 11.3.** Modifier le fichier `geometrie.ts` afin que la fonction `aireCercle` soit exportée par défaut, puis adapter l'importation dans `principal.ts`.

**Correction 11.3.**
```typescript
// geometrie.ts
export default function aireCercle(rayon: number): number {
  return Math.PI * rayon * rayon;
}

// principal.ts
import aireCercle from "./geometrie";
console.log(aireCercle(5));
```

**Exercice 11.4.** Expliquer la différence entre `export` (nommé) et `export default`, en particulier concernant le nombre d'utilisations possibles par fichier et la syntaxe d'importation associée.

**Correction 11.4.**
Un module peut comporter plusieurs exports nommés (`export`), chacun devant être importé entre accolades avec le nom exact utilisé lors de l'export (sauf renommage explicite via `as`). Un module ne peut en revanche comporter qu'un seul export par défaut (`export default`) ; celui-ci s'importe sans accolades et peut être renommé librement à l'importation, puisqu'aucun nom n'est imposé par l'export. En pratique, l'export par défaut est souvent réservé à l'élément « principal » d'un fichier (une classe, par exemple), tandis que les exports nommés conviennent à des utilitaires multiples.

---

## Chapitre 12 — Asynchronisme : Promises et async/await

### 12.1 La notion de code asynchrone

Certaines opérations (requête réseau, lecture de fichier, minuteur) ne produisent pas leur résultat immédiatement. JavaScript, et donc TypeScript, étant des langages à exécution **non bloquante** sur un seul fil d'exécution, ces opérations sont gérées de manière asynchrone : le programme continue son exécution sans attendre le résultat, et une mécanique dédiée permet de traiter ce résultat lorsqu'il devient disponible.

### 12.2 La `Promise`

Une `Promise<T>` représente une valeur de type `T` qui sera disponible dans le futur (ou une erreur, en cas d'échec).

```typescript
function attendre(millisecondes: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondes);
  });
}

function recupererUtilisateur(id: number): Promise<{ id: number; nom: string }> {
  return new Promise((resolve, reject) => {
    if (id <= 0) {
      reject(new Error("Identifiant invalide"));
    } else {
      resolve({ id, nom: "Utilisateur " + id });
    }
  });
}
```

### 12.3 Consommation via `.then()` / `.catch()`

```typescript
recupererUtilisateur(1)
  .then((utilisateur) => console.log(utilisateur.nom))
  .catch((erreur) => console.error(erreur.message));
```

### 12.4 `async` / `await`

La syntaxe `async`/`await`, pleinement typée par TypeScript, permet d'écrire du code asynchrone avec une structure proche du code synchrone, généralement plus lisible que l'enchaînement de `.then()`.

```typescript
async function afficherUtilisateur(id: number): Promise<void> {
  try {
    const utilisateur = await recupererUtilisateur(id);
    console.log(utilisateur.nom);
  } catch (erreur) {
    console.error("Erreur :", erreur);
  }
}
```

Une fonction déclarée `async` retourne toujours implicitement une `Promise`. Le mot-clé `await` suspend l'exécution de la fonction jusqu'à la résolution de la `Promise` concernée, sans bloquer le reste du programme.

### 12.5 Remarque sur l'usage dans Angular

Angular repose historiquement davantage sur la bibliothèque **RxJS** (programmation réactive, basée sur les `Observable`) que sur les `Promise` pour la gestion de l'asynchrone, notamment pour les requêtes HTTP. Cette notion sera vue en détail dans le cadre spécifique du cours Angular ; il est toutefois utile de savoir que les mécanismes `Promise`/`async`/`await` présentés ici demeurent parfaitement valides et fréquemment rencontrés, y compris au sein d'applications Angular.

### Exercices — Chapitre 12

**Exercice 12.1.** Écrire une fonction `doubler(valeur: number): Promise<number>` qui retourne une `Promise` résolue avec le double de la valeur passée en paramètre.

**Correction 12.1.**
```typescript
function doubler(valeur: number): Promise<number> {
  return new Promise((resolve) => {
    resolve(valeur * 2);
  });
}
```

**Exercice 12.2.** Consommer la fonction `doubler` de l'exercice précédent à l'aide de `.then()`, en affichant le résultat dans la console.

**Correction 12.2.**
```typescript
doubler(21).then((resultat) => console.log(resultat)); // 42
```

**Exercice 12.3.** Réécrire la consommation de l'exercice 12.2 à l'aide d'une fonction `async`/`await`.

**Correction 12.3.**
```typescript
async function afficherDouble(valeur: number): Promise<void> {
  const resultat = await doubler(valeur);
  console.log(resultat);
}

afficherDouble(21); // affiche 42
```

**Exercice 12.4.** Écrire une fonction `diviser(a: number, b: number): Promise<number>` qui rejette la `Promise` avec une erreur `"Division par zéro"` si `b` vaut `0`, ou la résout avec `a / b` sinon. Écrire ensuite une fonction `async` qui appelle `diviser` et gère l'erreur éventuelle avec `try/catch`.

**Correction 12.4.**
```typescript
function diviser(a: number, b: number): Promise<number> {
  return new Promise((resolve, reject) => {
    if (b === 0) {
      reject(new Error("Division par zéro"));
    } else {
      resolve(a / b);
    }
  });
}

async function afficherDivision(a: number, b: number): Promise<void> {
  try {
    const resultat = await diviser(a, b);
    console.log("Résultat :", resultat);
  } catch (erreur) {
    console.error("Erreur :", (erreur as Error).message);
  }
}
```

---

## Chapitre 13 — Décorateurs

### 13.1 Principe général

Un **décorateur** est une fonction spéciale permettant d'ajouter des annotations ou de modifier le comportement d'une classe, d'une méthode, d'une propriété ou d'un paramètre, à l'aide d'une syntaxe préfixée par `@`. Il s'agit d'une fonctionnalité encore expérimentale dans TypeScript pur (nécessitant l'activation de l'option `experimentalDecorators` dans `tsconfig.json`), mais largement popularisée par son usage central dans le framework Angular.

### 13.2 Exemple minimal

```typescript
function journaliser(constructeurCible: Function) {
  console.log(`Classe créée : ${constructeurCible.name}`);
}

@journaliser
class ServiceExemple {}
```

Ici, `journaliser` est une fonction ordinaire, appliquée automatiquement à la classe `ServiceExemple` au moyen de la syntaxe `@journaliser`.

### 13.3 Décorateurs à paramètres (*decorator factories*)

Dans la pratique — et en particulier dans Angular —, les décorateurs employés sont presque toujours des **fabriques de décorateurs** : des fonctions qui, une fois appelées avec des paramètres, retournent le décorateur effectif.

```typescript
function Composant(configuration: { selecteur: string }) {
  return function (constructeurCible: Function) {
    console.log(`Composant "${configuration.selecteur}" enregistré`);
  };
}

@Composant({ selecteur: "app-exemple" })
class MonComposant {}
```

Cette forme correspond exactement à la mécanique du décorateur `@Component(...)` d'Angular, présenté au chapitre suivant.

### 13.4 Remarque

L'écriture de décorateurs personnalisés relève d'un usage avancé du langage. Dans le cadre de ce cours, l'objectif est uniquement de permettre à l'étudiant de **reconnaître** la syntaxe des décorateurs et d'en comprendre le principe général (une fonction exécutée automatiquement sur l'élément qu'elle décore), car cette syntaxe est omniprésente dans le code Angular.

### Exercices — Chapitre 13

**Exercice 13.1.** Sans écrire de code, expliquer en une phrase à quoi sert la syntaxe `@NomDuDecorateur` placée juste avant la déclaration d'une classe.

**Correction 13.1.**
Cette syntaxe applique automatiquement la fonction `NomDuDecorateur` à la classe qui suit, permettant d'ajouter des métadonnées ou de modifier le comportement de cette classe sans altérer directement son code interne.

**Exercice 13.2.** Écrire une fonction décoratrice `figer` qui, appliquée à une classe, affiche dans la console le message `"Classe {nom} figée"` (où `{nom}` est remplacé par le nom réel de la classe), puis l'appliquer à une classe vide `Configuration`.

**Correction 13.2.**
```typescript
function figer(constructeurCible: Function) {
  console.log(`Classe ${constructeurCible.name} figée`);
}

@figer
class Configuration {}
```

**Exercice 13.3.** Écrire une fabrique de décorateur `Etiquette(nom: string)` qui, une fois appliquée à une classe, affiche `"Étiquette posée : {nom}"`.

**Correction 13.3.**
```typescript
function Etiquette(nom: string) {
  return function (constructeurCible: Function) {
    console.log(`Étiquette posée : ${nom}`);
  };
}

@Etiquette("module-facturation")
class ModuleFacturation {}
```

**Exercice 13.4.** Observer le décorateur `@Composant({ selecteur: "app-exemple" })` du paragraphe 13.3. Identifier ce qui, dans cette écriture, correspond à la « fabrique » de décorateur et ce qui correspond au décorateur effectivement appliqué à la classe.

**Correction 13.4.**
`Composant({ selecteur: "app-exemple" })` correspond à l'appel de la fabrique : cet appel exécute immédiatement la fonction `Composant` avec l'objet de configuration fourni, et retourne une nouvelle fonction. C'est cette fonction **retournée** (celle qui reçoit `constructeurCible` en paramètre dans l'exemple du cours) qui constitue le décorateur effectivement appliqué à la classe `MonComposant`.

---

## Chapitre 14 — Aperçu du framework Angular

### 14.1 Objectif de ce chapitre

Ce chapitre ne constitue en aucun cas une introduction complète à Angular, laquelle fera l'objet d'un cours dédié. Il vise uniquement à montrer, à titre d'illustration, la manière dont les notions TypeScript étudiées dans ce support (types, classes, décorateurs, interfaces) sont concrètement mobilisées dans un framework largement utilisé en entreprise.

### 14.2 Angular et TypeScript

Angular, développé par Google, est un framework destiné à la construction d'applications web structurées en **composants**. Contrairement à certaines alternatives, Angular impose l'usage de TypeScript comme langage de développement : l'ensemble du code applicatif est écrit en TypeScript, puis transpilé en JavaScript lors de la construction (*build*) de l'application.

### 14.3 Anatomie d'un composant Angular

Un composant Angular typique associe :

- une **classe** TypeScript, contenant les données et la logique du composant ;
- un **décorateur** `@Component`, précisant les métadonnées du composant (sélecteur HTML, gabarit associé, styles) ;
- un **gabarit** (*template*) HTML, affichant les données de la classe.

```typescript
import { Component } from "@angular/core";

interface Tache {
  libelle: string;
  terminee: boolean;
}

@Component({
  selector: "app-liste-taches",
  template: `
    <ul>
      <li *ngFor="let tache of taches">
        {{ tache.libelle }} — {{ tache.terminee ? "Fait" : "À faire" }}
      </li>
    </ul>
    <p>Total : {{ nombreTaches() }}</p>
  `,
})
export class ListeTachesComponent {
  taches: Tache[] = [
    { libelle: "Réviser TypeScript", terminee: true },
    { libelle: "Préparer le cours OO", terminee: false },
  ];

  nombreTaches(): number {
    return this.taches.length;
  }

  ajouterTache(libelle: string): void {
    this.taches.push({ libelle, terminee: false });
  }
}
```

### 14.4 Ce que l'étudiant doit être capable de reconnaître dans cet exemple

- L'`import` d'un module externe (`@angular/core`), correspondant directement au chapitre 11.
- Une **interface** (`Tache`) décrivant la forme des données manipulées, correspondant au chapitre 8.
- Un **décorateur** (`@Component({...})`), correspondant au chapitre 13, appliqué à la classe qui suit.
- Une **classe exportée** (`export class ListeTachesComponent`), correspondant aux chapitres 9 et 11, dont les propriétés (`taches`) et méthodes (`nombreTaches`, `ajouterTache`) sont typées exactement comme n'importe quelle autre classe TypeScript étudiée précédemment.
- Un tableau typé (`Tache[]`), correspondant au chapitre 7.

Aucune notion supplémentaire n'est donc requise, à ce stade, pour lire la structure générale d'un composant Angular : l'étude approfondie du framework (liaison de données, injection de dépendances, cycle de vie des composants, services, modules Angular, etc.) fera l'objet du cours dédié.

### 14.5 Les services Angular : une classe TypeScript ordinaire

Un service Angular n'est, du point de vue strictement syntaxique, rien d'autre qu'une classe TypeScript décorée :

```typescript
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CalculatriceService {
  additionner(a: number, b: number): number {
    return a + b;
  }
}
```

Ce constat illustre l'objectif pédagogique de ce support : l'ensemble des mécanismes Angular reposent sur des fondations purement TypeScript, déjà maîtrisées à l'issue de ce module.

### Exercices — Chapitre 14

**Exercice 14.1.** Dans l'exemple du composant `ListeTachesComponent` (paragraphe 14.3), identifier la ligne correspondant à l'application d'un décorateur, et préciser à quel élément ce décorateur est appliqué.

**Correction 14.1.**
La ligne `@Component({ selector: ..., template: ... })` correspond à l'application du décorateur. Celui-ci est appliqué à la classe déclarée immédiatement après, `export class ListeTachesComponent`.

**Exercice 14.2.** En se basant sur les notions vues au chapitre 8, ajouter à l'interface `Tache` une propriété optionnelle `priorite` de type `"basse" | "normale" | "haute"`.

**Correction 14.2.**
```typescript
interface Tache {
  libelle: string;
  terminee: boolean;
  priorite?: "basse" | "normale" | "haute";
}
```

**Exercice 14.3.** Ajouter, dans la classe `ListeTachesComponent`, une méthode `tachesRestantes(): number` retournant le nombre de tâches dont la propriété `terminee` vaut `false`.

**Correction 14.3.**
```typescript
tachesRestantes(): number {
  return this.taches.filter((tache) => !tache.terminee).length;
}
```

**Exercice 14.4.** En s'inspirant de la classe `CalculatriceService` (paragraphe 14.5), écrire une classe `ConversionService`, décorée avec `@Injectable({ providedIn: "root" })`, comportant une méthode `celsiusVersFahrenheit(celsius: number): number` appliquant la formule `F = C × 9/5 + 32`.

**Correction 14.4.**
```typescript
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ConversionService {
  celsiusVersFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }
}
```

---

## Chapitre 15 — Synthèse générale

### 15.1 Récapitulatif des notions abordées

| Notion | Chapitre |
|---|---|
| Origines et rôle du compilateur | 1 |
| Environnement (`tsc`, `tsconfig.json`, `ts-node`) | 2 |
| Types primitifs, `any`/`unknown`/`never`, unions, alias | 3 |
| `var`/`let`/`const`, portée de bloc | 4 |
| Conditions, boucles, `?.`/`??` | 5 |
| Fonctions, arrow functions, surcharges | 6 |
| Tableaux, tuples, destructuring, `Map`/`Set` | 7 |
| Interfaces, typage structurel, signatures d'index | 8 |
| Syntaxe de base des classes | 9 |
| Généricité | 10 |
| Modules (`import`/`export`) | 11 |
| `Promise`, `async`/`await` | 12 |
| Décorateurs | 13 |
| Lecture d'un composant Angular | 14 |

### 15.2 Vers le cours de programmation orientée objet

L'ensemble des notions présentées dans ce support constitue le socle syntaxique nécessaire à l'étude de la programmation orientée objet : la classe (chapitre 9) et l'interface (chapitre 8) y ont été volontairement introduites sous leur seule forme syntaxique, sans aborder les mécanismes qui en font véritablement des outils de conception orientée objet (héritage, polymorphisme, visibilité des membres, classes abstraites, principes SOLID, etc.). C'est précisément sur ces bases que s'appuiera le module suivant.

### Exercice de synthèse

**Exercice 15.1.** Écrire, en mobilisant l'ensemble des notions vues dans ce support (types, interface, classe simple, generics, fonctions fléchées, tableau), un petit programme TypeScript répondant au cahier des charges suivant :

1. Définir une interface `Etudiant` avec les propriétés `nom` (string) et `moyenne` (number).
2. Écrire une classe `Promotion` possédant une propriété `etudiants: Etudiant[]` initialisée à un tableau vide dans le constructeur, une méthode `ajouter(etudiant: Etudiant): void`, et une méthode `moyenneGenerale(): number` retournant la moyenne des moyennes de tous les étudiants (on retournera `0` si la promotion est vide).
3. Créer une instance de `Promotion`, y ajouter trois étudiants, puis afficher la moyenne générale.

**Correction 15.1.**
```typescript
interface Etudiant {
  nom: string;
  moyenne: number;
}

class Promotion {
  etudiants: Etudiant[];

  constructor() {
    this.etudiants = [];
  }

  ajouter(etudiant: Etudiant): void {
    this.etudiants.push(etudiant);
  }

  moyenneGenerale(): number {
    if (this.etudiants.length === 0) {
      return 0;
    }
    const somme = this.etudiants.reduce((total, e) => total + e.moyenne, 0);
    return somme / this.etudiants.length;
  }
}

const promoBachelier = new Promotion();
promoBachelier.ajouter({ nom: "Amina", moyenne: 15.5 });
promoBachelier.ajouter({ nom: "Lucas", moyenne: 12 });
promoBachelier.ajouter({ nom: "Chloé", moyenne: 17 });

console.log(promoBachelier.moyenneGenerale()); // 14.833333333333334
```

---
