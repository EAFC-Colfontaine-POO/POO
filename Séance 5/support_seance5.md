# Séance 5 — L'Encapsulation & les Invariants de Classe


## 1. Objectifs pédagogiques

À l'issue de cette séance, l'étudiant sera en mesure de :

1. **Distinguer la pile (*stack*) du tas (*heap*)** et expliquer pourquoi les objets ne se comportent pas comme les types primitifs ; il saura identifier et éviter le piège de l'aliasing.
2. **Comprendre la finalité de l'encapsulation** : protéger l'état interne d'un objet et garantir les **invariants de classe** à tout instant.
3. **Maîtriser les modificateurs de visibilité** (`private`, `public`, `protected`), la syntaxe concise des *parameter properties* et le bon usage des getters/setters.
4. **Distinguer membres d'instance et membres de classe (`static`)**, comprendre pourquoi un membre statique n'a pas accès à `this`, et utiliser les constructeurs nommés (*static factories*) ainsi que les énumérations.

**Fil conducteur de la séance :** partir du modèle physique de la mémoire pour concevoir des objets fiables, protégés contre les erreurs de manipulation.

---

## 2. Partie théorique

### 2.1 Le modèle mémoire : pile et tas

#### 2.1.1 Une variable primitive en mémoire 


  En TypeScript (comme en JavaScript), les **types primitifs** — nombres, chaînes de caractères, booléens, etc. — sont stockés directement dans la **pile (*stack*)**. La variable est une *étiquette* collée sur une *case mémoire* de taille fixe.


```ts
let age = 25;
let autre = age;   // copie indépendante de la valeur
autre = 30;

console.log(age);   // 25 — inchangé
console.log(autre); // 30
```

Ce mécanisme s'appelle le **passage par valeur** : l'affectation `let autre = age` duplique les octets dans une nouvelle case de la pile. Modifier `autre` ne touche en rien `age`. *Analogie : écrire une recette sur un post-it et en photocopier une version pour un ami — s'il rature sa copie, l'original reste intact.*

#### 2.1.2 Les objets et le tas (*heap*)


Un objet a une taille **variable et potentiellement très grande** : il ne loge pas dans les petites cases rigides de la pile. Il est donc stocké dans le **tas (*heap*)**, un vaste espace de stockage dynamique où les objets peuvent grandir librement.

```ts
let joueur = { nom: 'Alice', score: 100 };
```

Le point essentiel à retenir est le suivant : **la variable ne contient pas l'objet**, elle contient seulement **l'adresse mémoire** (une *référence*) pointant vers l'objet situé dans le tas.

- **Pile :** la variable `joueur` contient une adresse, par exemple `0x7FFE...`
- **Tas :** l'objet `{ nom, score }` réside à cette adresse

*Analogie : la pile est une poche. On n'y range pas un canapé, on y range le ticket de retrait qui indique son emplacement dans l'entrepôt.*

#### 2.1.3 Le piège de l'aliasing (effet de bord)


Lorsqu'on affecte une variable objet à une autre variable, **c'est l'adresse qui est copiée, pas l'objet** :

```ts
let joueur1 = { nom: 'Alice', score: 100 };

// ⚠ On copie L'ADRESSE, pas l'objet !
let joueur2 = joueur1;

joueur2.score = 0;

console.log(joueur1.score); // 💥 Affiche 0 !
```

On dit que `joueur1` et `joueur2` sont des **alias** : les deux variables pointent vers **le même bloc mémoire** et partagent donc le même état interne. Modifier l'une modifie l'autre *à distance, sans prévenir*.

*Analogie des télécommandes : il n'y a qu'une seule télévision dans la pièce ; `joueur1` et `joueur2` sont deux télécommandes synchronisées sur le même écran.*

C'est la **source de bug numéro un chez les débutants en POO** : sans encapsulation, toute partie du programme détenant une référence peut écraser les données.

### 2.2 Classe et instance : le plan d'architecte


La **classe** est le **plan d'architecte** : elle définit la forme et les règles, mais *on ne peut pas habiter dans un plan*. Elle n'existe qu'une seule fois dans le programme.

L'**instance**, créée par `new`, est la **maison coulée en béton** : chaque appel à `new` alloue un **nouveau bloc mémoire** dans le tas.

```ts
class Compte {
  constructor(
    public numero: string,
    public solde: number
  ) {}
}

const c1 = new Compte('BE123', 1000);
const c2 = new Compte('BE456', 500);
```

`c1` et `c2` désignent deux adresses mémoires **distinctes** : chaque maison possède ses propres murs et ses propres pièces.

### 2.3 Mémoire d'instance vs mémoire de classe (`static`)


Une classe peut déclarer deux catégories de membres :

```ts
class Compte {
  // Membre d'instance : propre à chaque maison
  public solde: number = 0;

  // Membre de classe : partagé par tout le programme
  static tauxEpargne = 0.02;

  static reglement(): void {
    console.log("Banque EAFC - Règlement");
  }
}

const c1 = new Compte();
const c2 = new Compte();
```

| Critère | Mémoire d'instance | Mémoire de classe (`static`) |
|---|---|---|
| **Naissance** | À chaque appel de `new` | Au chargement de la classe en mémoire |
| **Nombre d'exemplaires** | Un par objet créé | **Un seul**, partagé globalement |
| **Accès** | Via la référence (`c1.solde`) | Via le nom de la classe (`Compte.tauxEpargne`) |
| **Accès à `this`** | ✅ Oui (`this` = l'instance courante) | ❌ Non |

- **Instance** = données variables propres à chaque entité (l'état de chaque maison).
- **`static`** = constantes globales ou fonctions utilitaires (le bureau d'études de l'architecte).

#### Pourquoi `static` ne peut pas voir `this`

```ts
class Exemple {
  private solde = 100;

  static afficher(): void {
    // console.log(this.solde); // ❌ ERREUR TypeScript !
  }
}
```

La règle est absolue : **un membre statique n'a jamais accès à l'instance**. `this` représente l'instance *courante* ; or, lorsqu'on appelle une méthode statique, **aucune maison n'est sélectionnée** — on se trouve sur le plan. *Depuis le bureau de l'architecte, on ne peut pas allumer la lumière du salon : quelle maison viserait-on ? Cela n'a aucun sens physique.*

### 2.4 Pourquoi l'encapsulation ?

#### 2.4.1 Le scénario catastrophe : sans encapsulation


Considérons une classe dont tous les attributs sont publics :

```ts
class CompteBancaire {
  public numero: string;
  public solde: number;

  constructor(numero: string, solde: number) {
    this.numero = numero;
    this.solde = solde;
  }
}

const c = new CompteBancaire('BE-01', 500);

// N'importe qui peut tout casser :
c.solde = -999999; // règles bancaires violées sans alerte
c.solde = NaN;     // donnée corrompue : les calculs futurs échoueront
c.numero = "";     // l'identifiant est effacé, l'objet ne représente plus rien
```

Aucun de ces accès ne déclenche d'erreur du compilateur : **l'objet est passif et sans défense**.

#### 2.4.2 Définition


L'**encapsulation** repose sur deux principes :

1. **Regrouper** : réunir dans une même classe les **données** (état interne) et les **méthodes** qui les manipulent (comportement).
2. **Protéger (cordon sanitaire)** : **verrouiller l'accès direct** aux données internes et forcer l'usage de méthodes publiques contrôlées.

> **Règle fondamentale :** l'état interne est privé ; seule l'interface publique est accessible.

#### 2.4.3 La métaphore de la voiture


L'encapsulation, c'est le **capot fermé** d'une voiture :

- **Interface publique** (commandes visibles) : volant, pédale d'accélérateur, frein, tableau de bord. Elles sont ergonomiques et sûres — il est impossible de casser le moteur en tournant le volant.
- **État interne privé** (organes cachés) : pistons, bougies, injecteurs, calculateur électronique. Complexes et fragiles, ils ne doivent jamais être manipulés directement.

Pour accélérer, on appuie sur la **pédale** (méthode publique) ; on ne verse pas l'essence dans les cylindres avec une pipette.

#### 2.4.4 La notion clé : l'invariant de classe


Un **invariant de classe** est une **règle métier qui doit être vraie à chaque instant** : à la création de l'objet et après l'exécution de chaque méthode publique.

Exemples :

| Classe | Invariant | Justification |
|---|---|---|
| 🏦 Compte bancaire | `solde >= -decouvertMax` | Le solde ne descend jamais sous le plafond accordé. |
| 📝 Note d'examen | `0 <= note <= 20` | Une note négative ou supérieure à 20 est impossible. |
| 🌡️ Thermostat | `5°C <= consigne <= 30°C` | Consigne bornée entre hors-gel et confort maximal. |

> **Rôle de l'encapsulation :** rendre *techniquement impossible* la violation d'un invariant.

#### 2.4.5 Le constructeur : premier gardien des invariants


```ts
class Note {
  private _valeur: number;

  constructor(valeurInitiale: number) {
    if (valeurInitiale < 0 || valeurInitiale > 20) {
      throw new Error(`Note invalide : ${valeurInitiale}`);
    }
    this._valeur = valeurInitiale;
  }
}
```

- `const n1 = new Note(15);` — ✅ l'invariant est respecté, l'objet est instancié sainement.
- `const n2 = new Note(25);` — ❌ une exception est levée immédiatement : **aucun objet corrompu n'est créé en mémoire**.

L'instruction `throw new Error()` garantit que le reste du programme manipulera toujours des objets valides.

### 2.5 Visibilité et accesseurs en pratique

#### 2.5.1 Les modificateurs d'accès en TypeScript


| Modificateur | Visibilité | Usage typique |
|---|---|---|
| `public` | Totale (valeur par défaut), depuis l'intérieur et l'extérieur de la classe | `compte.deposer()` |
| `private` | Uniquement depuis le code interne de la classe — « secret de fabrication » | `this._solde` |
| `protected` | Dans la classe et ses futures sous-classes — « cercle familial » | *(vu avec l'héritage, séance 6)* |

> **Convention :** on préfixe souvent les attributs privés d'un tiret bas (`_solde`) pour libérer le nom propre (`solde`) pour les getters ou méthodes publiques.

#### 2.5.2 Syntaxe concise : les *parameter properties*


TypeScript offre une syntaxe abrégée qui évite la redondance de la version classique :

```ts
// ❌ Syntaxe classique verbeuse
class Compte {
  private _numero: string;
  private _solde: number;

  constructor(numero: string, solde: number) {
    this._numero = numero;
    this._solde = solde;
  }
}
```

```ts
// ✨ Syntaxe concise : déclaration + assignation automatiques
class Compte {
  constructor(
    private _numero: string,
    private _solde: number
  ) {}
}
```

Préfixer un paramètre de constructeur par `private` ou `public` ordonne à TypeScript de **générer l'attribut et l'assignation automatiquement**.

#### 2.5.3 Cas pratique : le Thermostat


**État et invariant :**

```ts
class Thermostat {
  constructor(
    private _temperature: number,
    public readonly piece: string
  ) {
    if (_temperature < 5 || _temperature > 30) {
      throw new Error("Température hors bornes");
    }
  }

  public getTemperature(): number {
    return this._temperature;
  }
}
```

- `_temperature` est **privée** : personne ne peut écrire `t._temperature = 100` depuis l'extérieur.
- `piece` est **`readonly`** : visible par tout le monde, mais non modifiable après la création.

**Méthodes d'action protégeant l'invariant :**

```ts
public augmenter(delta: number): void {
  if (delta <= 0) {
    console.warn("Delta invalide");
    return;
  }
  if (this._temperature + delta > 30) {
    this._temperature = 30; // plafond maximal
    return;
  }
  this._temperature += delta;
}
```

La méthode vérifie les bornes **avant** d'altérer l'état : l'invariant `temp <= 30°C` ne peut jamais être violé. Elle exprime en outre une **intention métier claire** : on demande à l'objet « d'augmenter la température » plutôt que de forcer une valeur brute.

#### 2.5.4 Getters et setters (`get` / `set`)


```ts
class Thermostat {
  constructor(private _temp: number) {}

  get temperature(): number {
    return this._temp;
  }

  set temperature(nouvelle: number) {
    if (nouvelle < 5 || nouvelle > 30) {
      throw new Error("Hors bornes [5-30]");
    }
    this._temp = nouvelle;
  }
}
```

```ts
const t = new Thermostat(19);

t.temperature = 22;         // exécute le setter (validation incluse)
console.log(t.temperature); // exécute le getter (affiche 22)

// t.temperature = 50;      // 💥 erreur levée !
```

Extérieurement, l'accès *ressemble* à une variable ordinaire ; intérieurement, **une méthode filtre et valide chaque accès**.

#### 2.5.5 Propriété calculée : l'exemple du Rectangle


```ts
class Rectangle {
  constructor(
    private _largeur: number,
    private _hauteur: number
  ) {}

  get largeur(): number { return this._largeur; }

  // Propriété calculée dynamiquement :
  get aire(): number {
    return this._largeur * this._hauteur;
  }
}

const r = new Rectangle(5, 10);
console.log(r.aire); // 50
```

- **Toujours synchronisée** : il n'existe pas d'attribut `_aire` qui risquerait d'être désynchronisé si la largeur change.
- **Lecture seule par nature** : faute de `set aire()`, l'écriture `r.aire = 80` refuse de compiler.

#### 2.5.6 Le piège du « faux getter/setter »


```ts
// ❌ ANTI-PATTERN : ne sert à rien !
class Compte {
  private _solde: number;

  get solde(): number { return this._solde; }
  set solde(v: number) { this._solde = v; } // zéro contrôle !
}
```

Un tel couple est **équivalent à un champ public, avec six lignes inutiles**. La bonne pratique consiste à remplacer les setters aveugles par des **méthodes exprimant une intention métier** :

```ts
class Compte {
  // ...
  public deposer(montant: number): void { /* validation + logique */ }
  public retirer(montant: number): void { /* validation + logique */ }
}
```

> **Principe :** *« Don't just get and set, tell the object what to do ! »*

### 2.6 Mécanismes avancés

#### 2.6.1 La contrainte : un seul constructeur


TypeScript n'autorise **qu'un seul constructeur par classe** — la surcharge de constructeurs est interdite. En JavaScript, les types s'effacent à l'exécution : seul un unique constructeur peut exister dans le prototype.

```ts
// ❌ Interdit en TypeScript !
class User {
  constructor(name: string) { /* ... */ }
  constructor(id: string, name: string) { /* ... */ } // Erreur
}
```

La solution : les **fabriques statiques** (*static factories*).

#### 2.6.2 Constructeurs nommés via fabriques statiques


```ts
type Role = 'admin' | 'guest';

class User {
  // 1. Constructeur PRIVÉ : impossible de faire "new User()"
  //    depuis l'extérieur de la classe
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _role: Role
  ) {}

  // 2. Fabrique 1 : invité
  static createGuest(name: string): User {
    const id = Math.random().toString(36).substring(2, 8);
    return new User(id, name, 'guest');
  }

  // 3. Fabrique 2 : administrateur
  static createAdmin(id: string, name: string): User {
    return new User(id, name, 'admin');
  }
}
```

```ts
const invite = User.createGuest("Jean Paul");
const admin  = User.createAdmin("ADM-01", "Alice");

// const u = new User("123", "Bob", "guest"); // ❌ ERREUR : constructeur privé !
```

Le mécanisme repose sur le **constructeur privé** : seule la classe elle-même détient le pouvoir d'appeler `new User(...)`, ce qui lui donne un **contrôle total sur la création** des instances.

Bénéfices :

| Bénéfice | Description |
|---|---|
| 📖 **Clarté du code** | Le nom de la méthode exprime directement *ce qu'on fabrique* ; le code appelant devient évident à lire sans consulter la documentation. |
| 🛡️ **Sécurité totale** | Impossible d'oublier un champ obligatoire ou de mal initialiser l'objet. |
| ⚡ **Évolutivité** | Ajouter une variante (ex. `createModerator`) sans impacter le code existant. |

#### 2.6.3 Les énumérations (`enum`)

Une énumération regroupe un ensemble fermé de valeurs nommées, typées à la compilation :

```ts
enum StatutCommande {
  EnAttente, // 0
  Payee,     // 1
  Livree     // 2
}

class Commande {
  private _statut = StatutCommande.EnAttente;

  public payer(): void {
    if (this._statut !== StatutCommande.EnAttente) {
      throw new Error("Paiement impossible");
    }
    this._statut = StatutCommande.Payee;
  }
}
```

- **Sécurité à la compilation** : une faute de frappe comme `StatutCommande.Livre` est détectée par le compilateur.
- **Typage strict** : une fonction peut exiger un `StatutCommande` plutôt qu'une chaîne de caractères libre.

#### 2.6.4 Pattern enum-like : des instances uniques et riches


Lorsque chaque valeur doit porter des **données et du comportement**, on peut combiner constructeur privé et membres statiques :

```ts
class Planete {
  private static readonly _all: Planete[] = [];

  // Instances uniques partagées
  static readonly TERRE   = new Planete("Terre",   5.97e24, 9.81);
  static readonly MARS    = new Planete("Mars",    0.64e24, 3.71);
  static readonly JUPITER = new Planete("Jupiter", 1898e24, 24.79);

  private constructor(
    public readonly nom: string,
    public readonly masseKg: number,
    public readonly gravite: number
  ) {
    Planete._all.push(this);
  }

  // Méthodes riches portées par chaque instance
  public calculerPoids(masseObjetKg: number): number {
    return masseObjetKg * this.gravite;
  }

  // API statique
  public static toutes(): Planete[] {
    return [...Planete._all];
  }
}
```

```ts
const poidsSurTerre = Planete.TERRE.calculerPoids(70);
const poidsSurMars  = Planete.MARS.calculerPoids(70);
```

- **Constructeur privé** : aucune autre planète ne peut être créée de l'extérieur ; le jeu d'instances est clos.
- **Instances uniques en mémoire** : une seule `Terre` est allouée pour toute l'application.
- **Objets riches** : contrairement à un simple `enum`, chaque valeur porte des données et du calcul métier.

#### 2.6.5 Le piège de l'ordre d'initialisation statique


En JavaScript/TypeScript, les champs statiques s'exécutent **de haut en bas**, dans l'ordre où ils sont écrits :

```ts
class Planete {
  // ❌ ERREUR : _all est déclaré APRÈS les instances !
  static readonly TERRE = new Planete("Terre", 9.81);
  private static readonly _all: Planete[] = [];

  private constructor(public nom: string, public gravite: number) {
    Planete._all.push(this);
    // 💥 TypeError: _all is undefined !
  }
}
```

Au moment où `new Planete()` s'exécute, `_all` n'a pas encore été initialisé.

> **Règle :** déclarez toujours les registres/tableaux statiques **avant** les instances statiques.

---

## 3. Récapitulatif : les 4 règles d'or


1. **Par défaut, tout est privé.** Garder les attributs en `private` ; n'ouvrir en `public` que les méthodes indispensables au monde extérieur.
2. **Protéger ses invariants.** Un objet ne doit jamais naître invalide : valider dès le constructeur, et refuser toute modification qui mènerait à un état corrompu.
3. **Pas de setters aveugles.** Éviter de générer mécaniquement des getters/setters sans contrôle ; privilégier des méthodes métier porteuses de sens (`deposer()`, `retirer()`).
4. **Distinguer instance et classe.** Dans la maison = instance (avec `this`) ; sur le plan d'architecte = `static` (sans `this`).

