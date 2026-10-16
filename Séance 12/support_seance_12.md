# Séance 12 — Les Objets eux-mêmes : Identité, Comparaison & Clonage

**Cours de programmation orientée objet — Bachelier en informatique (EAFC)**  
**Stack technique : TypeScript 5+, Angular 21/22 (approche signal-first)**

---

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant est en mesure de :

1. **Distinguer rigoureusement l'Identité de la Valeur** : appréhender l'architecture mémoire sous-jacente (la **Pile / *Stack*** vs le **Tas / *Heap***), comprendre la sémantique des adresses physiques de référence, et élucider pourquoi deux objets au contenu strictement identique sont déclarés inégaux par l'opérateur d'égalité stricte (`{ a: 1 } !== { a: 1 }`).
2. **Implémenter une méthode sémantique `equals()` robuste** : combler l'absence de surcharge d'opérateur en JavaScript/TypeScript en concevant une méthode d'égalité contractuelle en trois étapes (court-circuit d'adresse, garde de type strict `unknown` / `instanceof`, comparaison des attributs) respectant les quatre lois mathématiques de l'équivalence (réflexivité, symétrie, transitivité, cohérence).
3. **Différencier Entités Métier et Objets-Valeurs (*Value Objects*)** : identifier si la comparaison d'un objet repose sur un identifiant pérenne unique (`id`) ou sur l'intégralité de ses propriétés internes, formaliser le contrat générique `Equatable<T>` et proscrire définitivement le piège de `JSON.stringify()`.
4. **Maîtriser la duplication d'objets (Copie Superficielle vs Copie Profonde)** : diagnostiquer les ravages des références partagées lors de l'usage du *spread operator* (`{ ...obj }`) sur des structures imbriquées, exploiter la fonction native `structuredClone()` (ECMAScript 2022) pour les arbres de données purs, et implémenter le patron de conception `clone()` en POO afin de préserver l'encapsulation et le prototype des classes.
5. **Pratiquer l'Immutabilité logicielle** : opposer le modèle du tableau blanc effaçable (mutable) à la gravure sur pierre (immuable), combiner la protection au temps de compilation de `readonly` (TypeScript) et le verrouillage au temps d'exécution d'`Object.freeze()` (JavaScript), et concevoir des *Value Objects* auto-validés produisant de nouvelles instances lors de chaque opération.
6. **Comprendre la mécanique intime de la réactivité Angular Signals** : découvrir pourquoi le comparateur interne d'Angular (`Object.is()`) ignore souverainement les mutations d'objets en place dans le Tas, et assimiler pourquoi la production délibérée d'une nouvelle référence mémoire est l'unique moyen de déclencher l'actualisation chirurgicale du DOM.

---

## Partie 00 — Le cheminement : d'où venons-nous ?

Cette douzième séance représente un jalon capital dans votre formation d'ingénierie logicielle : elle marque l'achèvement du **Bloc B** et pose la dernière pierre fondatrice avant d'aborder les architectures réactives avancées d'Angular.

Dressons le panorama de notre parcours depuis l'ouverture du semestre :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROGRESSION PÉDAGOGIQUE DU CURSUS POO                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🧱 BLOC A — Les Fondamentaux du Paradigme Objet (Séances 05 à 09)          │
│    • S05 — Encapsulation & Invariants (private, accesseurs contrôlés)       │
│    • S06 — Héritage & Spécialisation (extends, super, factorisation)        │
│    • S07 — Polymorphisme Dynamique (liaison tardive, élimination des if)    │
│    • S08 — Abstraction & Contrats Purs (abstract, interfaces, typage)       │
│    • S09 — Composition vs Héritage (relations a-un, délégation, souplesse)  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🛡️ BLOC B — Qualité, Robustesse & Maîtrise des Objets (Séances 10 à 12)     │
│    • S10 — Exceptions Métier & Robustesse (throw, try/catch/finally)       │
│    • S11 — Principes SOLID (S : Responsabilité, O : Extensibilité, D : DI)  │
│    • S12 — Aujourd'hui : Identité, Clonage & Immutabilité des Objets        │
├─────────────────────────────────────────────────────────────────────────────┤
│ ⚡ BLOC C — Architecture Réactive Angular Signal-First (Séances 13 à 15)    │
│    • S13 — Composants Standalone & Signaux Réactifs fins                    │
│    • S14 — Services Métier, Génériques avancés & Injection de Dépendance    │
│    • S15 — Signal Forms, Validation déclarative & Routing d'Entreprise      │
└─────────────────────────────────────────────────────────────────────────────┘
```

Jusqu'à présent, nous avons appris à dessiner des plans d'architecte : découper des responsabilités (SRP), injecter des abstractions (DIP), fermer aux modifications (OCP) et lever des alertes contrôlées (`throw Error`).

Mais qu'advient-il lorsque ces classes s'animent dans les entrailles de la machine ? Comment un objet existe-t-il physiquement dans les barrettes de RAM ?

Nombreux sont les développeurs débutants qui se heurtent à des comportements déconcertants :
- *« Deux objets possèdent exactement le même contenu, mais la condition `if (obj1 === obj2)` est évaluée à false ! »*
- *« J'ai modifié la propriété d'une copie, et l'objet d'origine a été modifié en silence à l'autre bout de l'application ! »*
- *« J'ai modifié le prix d'un article dans mon signal Angular, mais le template reste figé et refuse de se mettre à jour ! »*

Ces énigmes ne relèvent ni du hasard ni d'un dysfonctionnement du compilateur. Elles découlent d'un principe fondamental de l'informatique : **la distinction absolue entre l'identité physique en mémoire et la valeur métier des données**.

---

## Partie 01 — Identité & Égalité : Référence vs Valeur

### 1.1 L'Énigme du code : pourquoi `===` ne fonctionne pas comme vous le croyez

Examinons la confrontation entre deux scénarios élémentaires en TypeScript :

```typescript
// ============================================================================
// Cas 1 : Les types primitifs (nombres, chaînes de caractères, booléens)
// ============================================================================
const score1: number = 100;
const score2: number = 100;

console.log(score1 === score2); // ✅ TRUE — Intuition confirmée !

// ============================================================================
// Cas 2 : Deux instances d'objets aux propriétés rigoureusement identiques
// ============================================================================
class Coordonnees {
  constructor(public x: number, public y: number) {}
}

const pointA = new Coordonnees(10, 20);
const pointB = new Coordonnees(10, 20);

console.log(pointA === pointB); // ❌ FALSE — Consternation du débutant !
console.log(pointA == pointB);  // ❌ FALSE — Même avec le double égal !
```

Face à ce résultat, le réflexe naturel est l'incompréhension. Dans le monde réel, deux feuilles de papier au format A4 avec le même texte imprimé au même endroit sont perçues comme « pareilles ».

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LE CONFLIT D'INTERPRÉTATION                          │
├────────────────────────────────────────────────────────────────────────┤
│ 🧠 L'intuition humaine (orientée CONTENU) :                            │
│    « Les deux points possèdent x=10 et y=20. Leurs données sont        │
│      strictement identiques, donc ils sont égaux ! »                   │
├────────────────────────────────────────────────────────────────────────┤
│ ⚙️ La réalité de la machine (orientée CONTENEUR) :                     │
│    L'opérateur === appliqué à des objets ne lit JAMAIS leurs champs !  │
│    Il compare uniquement l'ADRESSE PHYSIQUE dans la mémoire vive.     │
│    Deux invocations du mot-clé 'new' ont alloué deux cases mémoires    │
│    distinctes dans le Tas : les adresses sont différentes, donc false. │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1.2 Les deux grandes analogies pour tout comprendre

Pour ancrer définitivement ce principe, faisons appel à deux métaphores visuelles universelles :

#### 1. L'Analogie des vrais jumeaux (Valeur identique, Identités distinctes)
Imaginez deux jumeaux monozygotes. Ils partagent le même patrimoine génétique, possèdent la même morphologie, pèsent le même poids et portent des vêtements identiques. Au regard de leur aspect extérieur (**leur valeur**), ils sont rigoureusement indiscernables.

Pourtant, ils possèdent **deux cartes d'identité différentes**, deux numéros de registre national distincts et deux passeports séparés. Si l'un des deux se coupe le doigt en cuisinant, le doigt de son frère ne saigne pas !  
En informatique, deux instances `jumeauA` et `jumeauB` issues de la même classe représentent deux entités distinctes. L'instruction `jumeauA === jumeauB` compare leurs numéros de passeport : le résultat est inévitablement `false`.

#### 2. L'Analogie de l'adresse postale (La variable n'est qu'un papier)
Considérez deux maisons construites dans un lotissement selon le même plan d'architecte. Elles disposent du même nombre de pièces, de la même peinture et de la même superficie.

Une variable typée par un objet ne contient **jamais** la maison physique elle-même. Elle contient simplement un petit bout de papier sur lequel est griffonnée une **adresse postale** (par exemple : *« 12 rue de la Gare »* ou *« 45 avenue du Parc »*).  
Lorsque vous écrivez `pointA === pointB`, l'ordinateur ne visite pas les maisons pour inventorier les meubles : il regarde simplement les deux bouts de papier et demande : *« Ces deux morceaux de papier affichent-ils la même adresse postale exacte ? »*. Si l'un indique le numéro 12 et l'autre le numéro 45, la réponse est irrévocablement négative.

---

### 1.3 Sous le capot : Le Modèle Mémoire (Stack vs Heap)

Pour comprendre l'origine technique de cette distinction, examinons l'architecture de la mémoire vive allouée par le moteur JavaScript (comme Google V8 sous Node.js ou Chrome). La mémoire est scindée en deux espaces aux fonctions radicalement dissemblables :

```
┌────────────────────────────────────────┐         ┌────────────────────────────────────────┐
│           LA PILE (Stack)              │         │              LE TAS (Heap)             │
│   Taille fixe · Allocation ultra-rapide│         │    Dynamique · Grands espaces libres   │
├────────────────────────────────────────┤         ├────────────────────────────────────────┤
│  Variable             Valeur en pile   │         │  Adresse         Contenu de l'objet    │
│ ────────────────────────────────────── │         │ ────────────────────────────────────── │
│  age                  25 (brut)        │         │                                        │
│  score                100 (brut)       │         │                                        │
│                                        │         │                                        │
│  pointA      ───────> 0x10A ───────────┼─────────┼─> 0x10A        Point { x: 10, y: 20 }  │
│                                        │         │                                        │
│  pointB      ───────> 0x20B ───────────┼─────────┼─> 0x20B        Point { x: 10, y: 20 }  │
│                                        │         │                                        │
│  pointC      ───────> 0x10A ───────────┼─────────┘                                        │
│                       (alias de pointA)│                                                  │
└────────────────────────────────────────┘         └────────────────────────────────────────┘
```

#### Fonctionnement de la Pile (*Stack*) :
- La pile stocke les variables locales et les primitives (`number`, `boolean`, `string`, `null`, `undefined`).
- Les données y sont de taille fixe et connue à l'avance.
- La variable `age` contient directement la valeur brute binaire `25`.
- Lorsque l'on crée un objet avec `new`, la pile ne stocke **que le pointeur** (l'adresse mémoire hexadécimale, comme `0x10A`), occupant une taille fixe minimale (généralement 64 bits).

#### Fonctionnement du Tas (*Heap*) :
- Le tas est un grand espace de stockage dynamique non structuré, géré par le ramasse-miettes (*Garbage Collector*).
- C'est ici que sont alloués les objets, tableaux, closures et instances de classes, dont la taille peut croître au cours du temps.
- À l'adresse `0x10A` réside la structure `{ x: 10, y: 20 }`.
- À l'adresse `0x20B` réside une seconde structure `{ x: 10, y: 20 }`.

#### Conséquence sur les comparaisons :
```typescript
// L'ordinateur compare les valeurs stockées dans la pile :
pointA === pointB // Équivaut à comparer : 0x10A === 0x20B  ➔ FALSE
pointA === pointC // Équivaut à comparer : 0x10A === 0x10A  ➔ TRUE
```

---

### 1.4 L'Affectation par référence et le piège de l'effet de bord (*Side Effect*)

Comprendre ce modèle permet d'éviter l'erreur la plus dévastatrice chez les développeurs débutants : croire que l'instruction d'affectation `=` clone un objet.

```typescript
// ❌ ANTI-PATTERN ARCHITECTURAL : L'illusion de la copie par affectation
export class CompteBancaire {
  constructor(
    public titulaire: string,
    public solde: number
  ) {}
}

const compteAlice = new CompteBancaire('Alice', 1000);

// Le piège fatal : on ne crée PAS de second compte en mémoire !
// On recopie uniquement l'adresse mémoire (0x10A) dans la pile !
const compteBob = compteAlice; 

// Bob effectue un achat sur ce qu'il croit être "son" compte personnel :
compteBob.solde -= 400;

console.log(compteBob.solde);   // 600 €
console.log(compteAlice.solde); // 600 € 💥 Alice a perdu 400 € sans rien faire !
console.log(compteAlice === compteBob); // true (même compte physique en RAM)
```

```
┌────────────────────────────────────────────────────────────────────────┐
│             L'ANALOGIE DES DEUX TÉLÉCOMMANDES POUR LA MÊME TV          │
├────────────────────────────────────────────────────────────────────────┤
│ • Alice et Bob ont chacun une télécommande dans la main.               │
│ • La variable 'compteAlice' est la télécommande noire.                 │
│ • La variable 'compteBob' est la télécommande grise.                   │
│ • Mais les deux télécommandes sont synchronisées sur le MÊME téléviseur│
│   situé dans le salon (l'objet unique situé à l'adresse 0x10A).        │
│                                                                        │
│ Si Bob appuie sur la touche « Changer de chaîne », le téléviseur change│
│ de chaîne pour Alice également !                                       │
└────────────────────────────────────────────────────────────────────────┘
```

Pour qu'Alice et Bob puissent gérer leurs finances de manière autonome, il est impératif qu'ils disposent de deux comptes bancaires physiques séparés : il est indispensable de **cloner** l'objet.

---

### 1.5 Tableau comparatif approfondi : Types Primitifs vs Types Objets

| Caractéristique fondamentale | Types Primitifs (`number`, `string`, `boolean`, `null`, `undefined`) | Types Objets (`Object`, `Array`, `Date`, Instances de classe) |
|---|---|---|
| **Espace de stockage principal** | Stockés directement dans la **Pile** (*Stack*). | Stockés dans le **Tas** (*Heap*) ; la Pile ne conserve que l'adresse. |
| **Opération d'affectation** (`let b = a`) | **Copie par valeur** : `b` reçoit un double indépendant de la valeur. | **Copie par référence** : `b` reçoit la même adresse mémoire que `a`. |
| **Comparaison stricte** (`a === b`) | Compare la **valeur brute** (`10 === 10` ➔ `true`). | Compare l'**adresse mémoire** (`0x10A === 0x20B` ➔ `false`). |
| **Mutabilité par défaut** | **Immuables par nature** : un nombre `42` ne peut pas être muté en `43`. | **Mutables par défaut** : les propriétés internes peuvent être altérées. |
| **Effet de bord lors d'une modification** | Nul : modifier `b` ne peut en aucun cas affecter `a`. | Total : modifier `b.propriete` altère immédiatement l'objet vu par `a`. |
| **Passage en paramètre de fonction** | Par valeur : la fonction travaille sur une copie locale isolée. | Par partage de référence : la fonction peut muter l'objet appelant ! |

---

## Partie 02 — Comparer des Objets Métier : Concevoir une Méthode `equals()` Robuste

### 2.1 Le besoin d'une égalité métier : pourquoi pas de surcharge d'opérateur ?

Dans certains langages comme le C++, Python ou Kotlin, il est possible de « surcharger » les opérateurs (ex: redéfinir `operator==` ou la méthode magique `__eq__`) pour que l'écriture `pointA == pointB` compare automatiquement les coordonnées.

En JavaScript et en TypeScript, **la surcharge d'opérateur n'existe pas et ne sera probablement jamais introduite**. Les opérateurs `===` et `==` sont figés au niveau du moteur d'exécution et compareront toujours et exclusivement les adresses de référence pour les objets.

La solution universelle, éprouvée en ingénierie logicielle (standardisée depuis des décennies en Java et C#), consiste à doter nos classes d'une méthode explicite d'égalité : **la méthode `equals()`**.

---

### 2.2 L'anatomie canonique d'une méthode `equals()` en 3 étapes

Pour concevoir une méthode d'égalité robuste, infaillible et performante, nous devons respecter une structure en trois étapes strictes :

```typescript
export class Point2D {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  /**
   * Compare l'instance courante avec un autre objet de nature inconnue.
   * @param other L'objet à comparer, rigoureusement typé 'unknown'.
   */
  equals(other: unknown): boolean {
    // ------------------------------------------------------------------------
    // ÉTAPE 1 : Le court-circuit d'adresse (Optimisation de performance)
    // ------------------------------------------------------------------------
    if (this === other) {
      return true; // S'ils partagent la même adresse, ils sont fatalement identiques !
    }

    // ------------------------------------------------------------------------
    // ÉTAPE 2 : Le garde de type strict (Protection contre null, undefined et types tiers)
    // ------------------------------------------------------------------------
    if (!(other instanceof Point2D)) {
      return false; // Élimine null, undefined, les primitives et les classes distinctes
    }

    // ------------------------------------------------------------------------
    // ÉTAPE 3 : La comparaison sémantique des attributs métier
    // ------------------------------------------------------------------------
    // Grâce au rétrécissement de type opéré par 'instanceof', TypeScript sait
    // avec certitude que 'other' est un Point2D disposant des membres x et y :
    return this.x === other.x && this.y === other.y;
  }
}
```

```
┌────────────────────────────────────────────────────────────────────────┐
│                  LES 3 ÉTAPES D'UNE MÉTHODE equals() IDÉALE            │
├────────────────────────────────────────────────────────────────────────┤
│ 1️⃣  COURT-CIRCUIT DE RÉFÉRENCE (this === other)                        │
│     Si les deux variables pointent vers le même emplacement 0x10A,     │
│     inutile de comparer 50 propriétés : le résultat est true en 1 CPU  │
│     cycle. C'est le raccourci le plus rapide du génie logiciel.        │
├────────────────────────────────────────────────────────────────────────┤
│ 2️⃣  GARDE DE TYPE STRICT (!(other instanceof Point2D))                 │
│     En typant le paramètre 'other: unknown', la méthode accepte        │
│     n'importe quelle valeur sans risquer de crash TypeError à          │
│     l'exécution si l'on reçoit null, undefined ou une chaîne.          │
├────────────────────────────────────────────────────────────────────────┤
│ 3️⃣  COMPARAISON DES ATTRIBUTS MÉTIER                                   │
│     C'est la classe — et elle seule — qui détient la connaissance de   │
│     ce qui constitue son équivalence sémantique.                       │
└────────────────────────────────────────────────────────────────────────┘
```

Testons le comportement de notre classe :

```typescript
const p1 = new Point2D(5, 8);
const p2 = new Point2D(5, 8);
const p3 = p1;

console.log(p1 === p2);     // false (adresses 0x10A vs 0x20B distinctes)
console.log(p1.equals(p2)); // ✅ TRUE  (valeurs x=5 et y=8 identiques !)
console.log(p1.equals(p3)); // ✅ TRUE  (court-circuit étape 1 activé)
console.log(p1.equals(null)); // ✅ FALSE (protégé par l'étape 2 sans planter)
console.log(p1.equals("texte")); // ✅ FALSE (protégé par l'étape 2)
```

---

### 2.3 Entités Métier (*Entities*) vs Objets-Valeurs (*Value Objects*)

Toutes les classes ne définissent pas leur égalité de la même façon. Le paradigme du **Domain-Driven Design (DDD)** distingue deux grandes familles d'objets dans un système d'information :

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│     1. L'ENTITÉ MÉTIER (Entity)      │     │  2. L'OBJET-VALEUR (Value Object)    │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│ Possède une IDENTITÉ UNIQUE pérenne  │     │ Dépourvu d'identifiant. Est défini   │
│ (souvent un ID numérique ou UUID).   │     │ EXCLUSIVEMENT par la totalité de ses │
│ Même si son état ou son nom change,  │     │ propriétés et attributs.             │
│ elle demeure la même entité.         │     │                                      │
│                                      │     │ Deux billets de 20 € ont la même     │
│ Exemples :                           │     │ valeur d'échange sur le marché.      │
│ • Utilisateur (id: 42)               │     │                                      │
│ • Commande (numéro: 'CMD-902')       │     │ Exemples :                           │
│ • CompteBancaire (iban: 'BE89...')   │     │ • Point2D (x, y)                     │
│                                      │     │ • Monnaie (montant: 50, devise: EUR) │
│ Règle d'égalité equals() :           │     │ • IntervalleDate (debut, fin)        │
│ this.id === other.id                 │     │                                      │
│                                      │     │ Règle d'égalité equals() :           │
│                                      │     │ this.montant === other.montant &&    │
│                                      │     │ this.devise === other.devise         │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

> [!TIP]
> **La question directrice à poser lors de la modélisation :**  
> *« Si je modifie l'un des attributs de mon objet, s'agit-il toujours du même objet ayant évolué dans le temps (Entité), ou s'agit-il d'un tout autre concept mathématique (Objet-Valeur) ? »*

---

### 2.4 Le Contrat d'Interface générique : `Equatable<T>`

Plutôt que de laisser chaque développeur choisir un nom arbitraire (`isSame()`, `compare()`, `estEgal()`, `sameAs()`), appliquons le principe d'abstraction (Séance 8) en formalisant un contrat d'interface générique :

```typescript
// src/app/core/equatable.interface.ts
export interface Equatable<T> {
  equals(other: T): boolean;
}
```

Implémentons ce contrat au sein d'une classe d'entité pour un panier d'achats :

```typescript
// src/app/models/article-panier.model.ts
import { Equatable } from '../core/equatable.interface';

export class ArticlePanier implements Equatable<ArticlePanier> {
  constructor(
    public readonly reference: string, // Code article unique (SKU)
    public readonly designation: string,
    public prixUnitaire: number
  ) {}

  equals(other: ArticlePanier): boolean {
    if (this === other) return true;
    if (!other) return false;
    // Deux articles du panier sont équivalents s'ils partagent la même référence catalogue
    return this.reference === other.reference;
  }
}
```

#### Puissance pratique : Simplification radicale des algorithmes de collection
Grâce à ce contrat, les opérations de recherche dans des listes deviennent limpides et élégantes :

```typescript
const panier: ArticlePanier[] = [
  new ArticlePanier('REF-CLAVIER', 'Clavier Mécanique', 120),
  new ArticlePanier('REF-SOURIS', 'Souris Ergonomique', 60)
];

const articleScanne = new ArticlePanier('REF-CLAVIER', 'Clavier Gamer RGB', 140);

// Vérifier si l'article est déjà présent dans le panier :
const dejaPresent = panier.some(item => item.equals(articleScanne));
console.log(dejaPresent); // ✅ TRUE ! Même si les prix ou libellés diffèrent.

// Retrouver l'instance existante pour incrémenter sa quantité :
const itemExistant = panier.find(item => item.equals(articleScanne));
```

---

### 2.5 Les 4 lois mathématiques d'une équivalence saine

Une méthode `equals()` ne s'écrit pas à la légère. En mathématiques comme en informatique fondamentale, la relation d'équivalence doit scrupuleusement satisfaire **quatre axiomes** :

1. **La Réflexivité** : Pour tout objet non nul `a`, `a.equals(a)` doit impérativement retourner `true`.
2. **La Symétrie** : Pour tous objets `a` et `b`, `a.equals(b)` doit retourner `true` si et seulement si `b.equals(a)` retourne `true`.
3. **La Transitivité** : Pour tous objets `a`, `b` et `c`, si `a.equals(b)` est vrai et que `b.equals(c)` est vrai, alors `a.equals(c)` doit obligatoirement être vrai.
4. **La Cohérence (*Consistency*)** : Des invocations répétées de `a.equals(b)` doivent systématiquement retourner la même valeur booléenne, tant qu'aucune propriété discriminante n'a été modifiée.
5. **La Non-nullité** : Pour tout objet non nul `a`, l'appel `a.equals(null)` et `a.equals(undefined)` doit obligatoirement retourner `false` sans jamais lever d'exception.

---

### 2.6 La fausse bonne idée : `JSON.stringify()`

Un anti-pattern très répandu chez les développeurs consiste à comparer deux objets en les transformant en chaînes JSON :

```typescript
// ❌ ANTI-PATTERN ARCHITECTURAL DU BRICOLEUR
const userA = { nom: 'Dupont', prenom: 'Jean' };
const userB = { prenom: 'Jean', nom: 'Dupont' }; // Même contenu, ordre inversé !

console.log(JSON.stringify(userA) === JSON.stringify(userB)); // ❌ FALSE !
```

Cette approche est un désastre en production pour trois raisons fondamentales :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LES 3 TARES DE JSON.stringify()                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. L'ORDRE DES CLÉS N'EST PAS GARANTI                                  │
│    En JavaScript, l'ordre d'insertion des propriétés d'un objet字典    │
│    détermine l'ordre de sortie du JSON. Deux objets contenant          │
│    rigoureusement les mêmes paires clé/valeur produisent deux chaînes  │
│    différentes si les clés ont été déclarées dans un ordre différent ! │
├────────────────────────────────────────────────────────────────────────┤
│ 2. PERTE IRRÉVERSIBLE DES TYPES RICHES                                 │
│    • Les objets 'Date' sont convertis en chaînes ISO primitives.       │
│    • Les expressions régulières 'RegExp' deviennent des objets vides {}.│
│    • Les structures 'Map' et 'Set' deviennent {} ou [].                │
│    • Les valeurs 'undefined' et les méthodes de classes sont SIMPLEMENT│
│      SUPPRIMÉES du flux généré !                                       │
├────────────────────────────────────────────────────────────────────────┤
│ 3. PERFORMANCES CATASTROPHIQUES                                        │
│    Transformer deux graphes d'objets en mémoire en longues chaînes     │
│    de caractères consomme des milliers de cycles CPU et surcharge le   │
│    Garbage Collector avec des allocations temporaires massives.        │
└────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> Bannissez définitivement `JSON.stringify()` pour tester l'égalité d'objets métier : implémentez systématiquement une méthode `equals()` explicite.

---

## Partie 03 — La Duplication d'Objets : Copie Superficielle (*Shallow*) vs Copie Profonde (*Deep*)

Dès lors que nous comprenons que l'affectation `const b = a` ne crée qu'un alias vers la même adresse mémoire, une question se pose : **comment dupliquer un objet de manière autonome ?**

Il existe deux niveaux de duplication en informatique :
- La **Copie Superficielle** (*Shallow Copy*).
- La **Copie Profonde** (*Deep Copy*).

---

### 3.1 La Copie Superficielle (*Shallow Copy*) : Les Mécanismes

Une copie superficielle ne duplique que **l'enveloppe extérieure (le premier niveau)** de l'objet. Les outils standards en TypeScript moderne sont :

```typescript
// 1. L'opérateur Spread { ...objet } (Recommandé pour objets plats)
const configurationInitiale = {
  theme: 'dark',
  langue: 'fr',
  volumeSonore: 80
};

// ✅ Crée un nouvel objet physique avec sa propre adresse mémoire (0x20B) :
const copieConfig = { ...configurationInitiale };

copieConfig.volumeSonore = 50;

console.log(configurationInitiale.volumeSonore); // 80 (Original préservé !)
console.log(copieConfig.volumeSonore);           // 50 (Copie indépendante !)
console.log(configurationInitiale === copieConfig); // false (deux conteneurs distincts)
```

```typescript
// 2. Équivalent plus ancien : Object.assign()
const copieAssign = Object.assign({}, configurationInitiale);

// 3. Pour les tableaux : [...tableau] ou tableau.slice()
const notes = [12, 15, 18];
const copieNotes = [...notes];
copieNotes.push(20);

console.log(notes.length);      // 3 (Préservé !)
console.log(copieNotes.length); // 4 (Modifié !)
```

Tant que votre objet est **plat** (ne contenant que des primitives : chaînes, nombres, booléens), le *spread operator* accomplit parfaitement sa mission.

---

### 3.2 Le Piège du Shallow Copy : Les Objets Imbriqués

Que se passe-t-il dès que notre objet contient un sous-objet, une date ou un tableau d'éléments ?

```typescript
// ❌ LE PIÈGE FATAL DU SPREAD SUR OBJETS COMPLEXES :
const profilUtilisateur = {
  pseudo: 'Alice',
  parametres: {
    notifications: true,
    resolution: '1080p'
  }
};

// Réalisation d'une copie superficielle :
const cloneSuperficiel = { ...profilUtilisateur };

// Modification de niveau 1 (propriété primitive) :
cloneSuperficiel.pseudo = 'Bob'; // ✅ Aucun problème, 'pseudo' est copié par valeur.

// Modification de niveau 2 (dans l'objet imbriqué) :
cloneSuperficiel.parametres.notifications = false;

// Observons l'état de l'original :
console.log(profilUtilisateur.pseudo); // 'Alice' (OK !)
console.log(profilUtilisateur.parametres.notifications); // 💥 FALSE ! L'ORIGINAL A ÉTÉ MUTÉ !
```

```
┌────────────────────────────────────────────────────────────────────────┐
│                   POURQUOI CET EFFET DE BORD DESTRUCTEUR ?             │
├────────────────────────────────────────────────────────────────────────┤
│ Le spread operator { ...profilUtilisateur } a effectivement créé une   │
│ nouvelle boîte de niveau 1 (adresse 0x20B).                            │
│                                                                        │
│ Mais en arrivant à la propriété 'parametres', il a constaté qu'il      │
│ s'agissait d'un objet. Il a donc simplement RECOPIÉ L'ADRESSE MÉMOIRE  │
│ (0x99F) vers le sous-objet existant dans le Tas !                      │
│                                                                        │
│ Résultat :                                                             │
│ • cloneSuperficiel.pseudo !== profilUtilisateur.pseudo (indépendant)   │
│ • cloneSuperficiel.parametres === profilUtilisateur.parametres (PARTAGÉ)│
└────────────────────────────────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────────────┐
│                        L'ANALOGIE DE LA VALISE                         │
├────────────────────────────────────────────────────────────────────────┤
│ Imaginez que vous achetiez une seconde valise neuve (la copie).        │
│ Mais au lieu de fabriquer de nouveaux appareils électroniques à placer │
│ à l'intérieur, vous tirez des câbles électriques qui relient les       │
│ prises de votre nouvelle valise aux appareils restés dans l'ancienne   │
│ valise !                                                               │
│                                                                        │
│ Si vous modifiez un commutateur dans la seconde valise, vous altérez   │
│ directement le circuit de la première valise.                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3 La Copie Profonde moderne (*Deep Copy*) : L'arme native `structuredClone()`

Jusqu'en 2021, réaliser une copie profonde en JavaScript imposait d'installer des bibliothèques externes lourdes (comme `lodash.cloneDeep`) ou de recourir à des hacks instables.

Depuis **ECMAScript 2022** (disponible dans tous les navigateurs modernes et Node.js 17+), le standard intègre une fonction globale native ultra-performante : **`structuredClone()`**.

```typescript
const profilOriginal = {
  pseudo: 'Alice',
  parametres: {
    notifications: true,
    theme: { mode: 'dark', contraste: 'eleve' }
  },
  historiqueScores: [100, 150, 200],
  dateInscription: new Date('2025-01-15')
};

// ✅ VRAIE COPIE PROFONDE NATIVE :
const vraiClone = structuredClone(profilOriginal);

// Altérations en profondeur sur le clone :
vraiClone.parametres.theme.mode = 'light';
vraiClone.historiqueScores.push(300);
vraiClone.dateInscription.setFullYear(2030);

// Vérification de l'original : 100% INTÈGRE ET PRÉSERVÉ !
console.log(profilOriginal.parametres.theme.mode);   // 'dark' (Préservé !)
console.log(profilOriginal.historiqueScores.length); // 3      (Préservé !)
console.log(profilOriginal.dateInscription.getFullYear()); // 2025 (Préservé !)
```

#### Les super-pouvoirs de `structuredClone()` :
1. **Clonage récursif exhaustif** : Tous les niveaux d'imbrication sont dupliqués de manière autonome.
2. **Support des types riches du langage** : Contrairement à JSON, il duplique fidèlement les instances de `Date`, `RegExp`, `Map`, `Set`, `ArrayBuffer`, etc.
3. **Gestion native des références circulaires** : Si l'objet `A` possède une propriété pointant vers `B`, et que `B` possède une propriété repointant vers `A`, `structuredClone()` gère le cycle sans jamais entrer dans une boucle infinie (*Call stack size exceeded*).

> [!WARNING]
> **La seule et unique limite de `structuredClone()` en POO :**  
> `structuredClone()` ne peut **pas** cloner les fonctions ni les méthodes de classe !  
> Si vous lui passez une instance d'une classe `class Client`, le clone retourné **perd son prototype** : il redevient un objet JavaScript anonyme brut et `clone instanceof Client` renvoie `false`. Toutes les méthodes de la classe disparaissent !

---

### 3.4 Le Clonage en POO : La Méthode Métier `clone()` (Patron Prototype)

Pour cloner une instance de classe tout en conservant ses méthodes, son prototype et son encapsulation stricte, la solution reine du génie logiciel s'appelle le **patron de conception Prototype**, concrétisé par une méthode métier **`clone()`** :

```typescript
// 1. Sous-objet d'infrastructure : Adresse
export class Adresse {
  constructor(
    public rue: string,
    public ville: string
  ) {}

  /**
   * Clone l'adresse de façon autonome.
   */
  clone(): Adresse {
    return new Adresse(this.rue, this.ville);
  }
}

// 2. Entité racine : Client
export class Client {
  constructor(
    public nom: string,
    public adresse: Adresse // Composition d'objet (Séance 9)
  ) {}

  /**
   * Clone récursif du client en déléguant à ses sous-composants.
   */
  clone(): Client {
    return new Client(
      this.nom,
      // DÉLÉGATION DU CLONAGE : Le client demande à l'adresse de se cloner elle-même !
      this.adresse.clone() 
    );
  }
}
```

Démonstration de l'isolation parfaite :

```typescript
const clientOriginal = new Client('Alice', new Adresse('Rue Royale', 'Bruxelles'));

// Duplication par méthode métier :
const clientDuplique = clientOriginal.clone();

// Modification en profondeur :
clientDuplique.adresse.ville = 'Liège';

console.log(clientOriginal.adresse.ville); // 'Bruxelles' ✅ Totalement imperméable !
console.log(clientDuplique instanceof Client);   // ✅ true (prototype préservé !)
console.log(clientDuplique.adresse instanceof Adresse); // ✅ true
```

#### Pourquoi la méthode `clone()` est supérieure pour la POO ?
- **Respect absolu de l'encapsulation** : Chaque classe sait exactement comment dupliquer ses propres membres privés (`private`).
- **Préservation des prototypes** : L'objet cloné conserve toute sa chaîne d'héritage et l'ensemble de ses méthodes.
- **Délégation saine (Séance 9)** : La classe parente n'a pas à connaître les détails internes de la duplication de ses enfants : elle leur délègue l'opération via `this.enfant.clone()`.

---

### 3.5 Matrice de décision : Quelle stratégie de duplication choisir ?

| Stratégie de copie | Profondeur | Conserve le prototype & méthodes ? | Gère les Dates, Map, Set ? | Cas d'usage préconisé |
|---|:---:|:---:|:---:|---|
| **Affectation directe** (`b = a`) | ❌ 0 niveau (alias) | ✅ Oui | ✅ Oui | Vous souhaitez simplement créer un deuxième pointeur vers le même objet en RAM. |
| **Spread operator** (`{ ...a }`) | 🟡 1 niveau (*Shallow*) | ❌ Non (objet littéral anonyme) | ❌ Non (copie les références) | **Objets de données plats**, DTOs simples sans sous-objets, mise à jour d'états légers. |
| **`structuredClone(a)`** | 🟢 Tous niveaux (*Deep*) | ❌ Non (données pures uniquement) | ✅ **Oui (Support parfait)** | **Arbres de données complexes**, payloads JSON d'APIs, états réactifs sans classes. |
| **Méthode métier `clone()`** | 🟢 Tous niveaux (*Deep*) | ✅ **Oui (100% POO préservée)** | ✅ Oui (si géré par la classe) | **Vraies classes de domaine POO**, entités métiers avec invariants et méthodes. |

---

## Partie 04 — L'Immutabilité en POO : `readonly`, `Object.freeze()` et les Objets-Valeurs

### 4.1 Qu'est-ce que l'Immutabilité ?

Une fois que l'on a mesuré les risques liés aux effets de bord et aux références partagées, une question s'impose :  
*« Et si la méthode la plus élégante et la plus sûre pour éliminer les bugs de mutation consistait tout simplement à interdire formellement toute modification d'état après l'instanciation ? »*

C'est la philosophie de **l'Immutabilité** :

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│     L'OBJET MUTABLE (Par défaut)     │     │     L'OBJET IMMUABLE (Immutable)     │
├──────────────────────────────────────┤     ├──────────────────────────────────────┤
│ Ressemble à un TABLEAU BLANC :       │     │ Ressemble à une GRAVURE SUR PIERRE : │
│ N'importe quelle méthode ou fonction │     │ Dès que l'objet sort du constructeur,│
│ peut venir effacer et réécrire ses   │     │ son état interne est scellé pour     │
│ attributs internes à tout moment.    │     │ l'éternité.                          │
│                                      │     │                                      │
│ 💥 Risque élevé d'effets de bord     │     │ ✅ Prédictibilité mathématique 100%  │
│ 💥 Impossible de savoir qui a altéré │     │ ✅ Aucun risque d'altération cachée  │
│    la variable ni quand              │     │ ✅ Comparaison de changement foudro- │
│ 💥 Détection de changement confuse   │     │    yante pour les moteurs réactifs   │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
```

> [!IMPORTANT]
> **Le principe cardinal de l'immutabilité :**  
> Si vous souhaitez modifier un objet immuable, vous ne touchez jamais à l'objet existant : vous instanciez **une nouvelle version** de l'objet embarquant les nouvelles valeurs !

---

### 4.2 La double protection : `readonly` (TS) vs `Object.freeze()` (JS)

Pour verrouiller l'immuabilité en TypeScript, nous disposons de deux ceintures de sécurité complémentaires intervenant à deux étapes distinctes du cycle de vie du code :

```typescript
export class CoordonneesGPS {
  // 1. Sécurité au temps de compilation (TypeScript)
  readonly latitude: number;
  readonly longitude: number;

  constructor(lat: number, lng: number) {
    this.latitude = lat;
    this.longitude = lng;

    // 2. Sécurité au temps d'exécution (Moteur JavaScript V8)
    Object.freeze(this);
  }
}

const bruxelles = new CoordonneesGPS(50.8503, 4.3517);

// ❌ Tentative de modification détectée par le compilateur TypeScript :
// TS2540: Cannot assign to 'latitude' because it is a read-only property.
// bruxelles.latitude = 51.0;

// ❌ Si un script externe JS pur tente de passer outre au runtime :
// TypeError: Cannot assign to read only property 'latitude' of object '#<CoordonneesGPS>'
```

```
┌────────────────────────────────────────────────────────────────────────┐
│               LE DOUBLE BOUCLIER DE L'IMMUTABILITÉ                     │
├────────────────────────────────────────────────────────────────────────┤
│ 🛡️ readonly (TypeScript — Compilation)                                │
│    C'est un filet de sécurité de développement. Le compilateur 'tsc'   │
│    analyse votre code et refuse de compiler s'il détecte une tentative │
│    de réassignation. Mais attention : lors de la transpilation vers JS,│
│    le mot-clé 'readonly' S'ÉVAPORE totalement du code machine !        │
├────────────────────────────────────────────────────────────────────────┤
│ 🧊 Object.freeze(this) (JavaScript — Exécution / Runtime)              │
│    C'est le cadenas physique en mémoire vive. Le moteur JS verrouille  │
│    la structure de l'objet dans le Tas. Toute tentative d'écriture     │
│    ultérieure déclenche immédiatement une exception TypeError en mode  │
│    strict.                                                             │
└────────────────────────────────────────────────────────────────────────┘
```

> [!WARNING]
> Tout comme le spread operator, `Object.freeze()` est un gel superficiel (*shallow freeze*). Si l'objet gelé contient un sous-objet, ce sous-objet reste mutable à moins d'appliquer un gel réactif récursif (*deep freeze*).

---

### 4.3 L'Exemple Magistral : Le *Value Object* Immuable `Monnaie`

Concevons une classe financière exemplaire démontrant l'alliance parfaite de l'encapsulation, de la validation d'invariants, de l'immutabilité et de l'égalité métier :

```typescript
export class Monnaie {
  constructor(
    public readonly montant: number,
    public readonly devise: string
  ) {
    // Validation stricte des invariants dès la naissance de l'objet :
    if (montant < 0) {
      throw new Error(`Le montant monétaire ne peut être négatif : ${montant}`);
    }
    if (!devise || devise.trim().length !== 3) {
      throw new Error(`Code devise ISO invalide : ${devise}`);
    }

    // Verrouillage physique au runtime :
    Object.freeze(this);
  }

  /**
   * Égalité sémantique (Partie 02)
   */
  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof Monnaie)) return false;
    return this.montant === autre.montant && this.devise === autre.devise;
  }

  /**
   * Opération mathématique pure :
   * L'instance courante n'est JAMAIS altérée. On retourne une NOUVELLE instance !
   */
  ajouter(autre: Monnaie): Monnaie {
    if (this.devise !== autre.devise) {
      throw new Error(
        `Impossible d'additionner deux devises différentes : ${this.devise} vs ${autre.devise}`
      );
    }

    // Création d'une nouvelle instance immuable :
    return new Monnaie(this.montant + autre.montant, this.devise);
  }

  /**
   * Applique un coefficient multiplicateur (ex: taxe, remise).
   */
  multiplier(coefficient: number): Monnaie {
    if (coefficient < 0) {
      throw new Error(`Le coefficient multiplicateur ne peut être négatif : ${coefficient}`);
    }
    return new Monnaie(Math.round(this.montant * coefficient * 100) / 100, this.devise);
  }
}
```

Observons l'incroyable sérénité offerte par cette approche :

```typescript
const prixArticle = new Monnaie(100, 'EUR');
const fraisPort = new Monnaie(15, 'EUR');

// Addition :
const totalTTC = prixArticle.ajouter(fraisPort);

console.log(prixArticle.montant); // 100 € (Strictement inchangé !)
console.log(totalTTC.montant);    // 115 € (Nouvelle instance autonome)

// Comparaison métier :
const verification = new Monnaie(115, 'EUR');
console.log(totalTTC === verification);    // false (adresses 0x10A vs 0x20B)
console.log(totalTTC.equals(verification)); // ✅ TRUE !
```

---

## Partie 05 — Pièges fréquents & Bonnes pratiques des juniors

Avant d'aborder la démonstration Angular, répertorions les cinq erreurs classiques commises par les développeurs juniors lors de la manipulation des objets en mémoire :

### 5.1 Piège 1 : Muter un tableau avec `.push()` en environnement réactif

```typescript
// ❌ PIÈGE : La mutation en place d'un tableau
const listeSignaux = signal<string[]>(['Pomme', 'Banane']);

// Mauvaise pratique :
const tableauCourant = listeSignaux();
tableauCourant.push('Orange'); // Mute le tableau à l'adresse 0x10A
listeSignaux.set(tableauCourant); // Même adresse 0x10A -> AUCUNE DÉTECTION !

// ✅ BONNE PRATIQUE IMMUABLE :
// On produit un NOUVEAU tableau avec le spread operator
listeSignaux.update(anciensFruits => [...anciensFruits, 'Orange']);
```

---

### 5.2 Piège 2 : Confondre le mot-clé `const` et l'immutabilité

```typescript
// ❌ PIÈGE : Croire que 'const' empêche de modifier l'objet
const user = { nom: 'Dupont' };

// 'const' empêche uniquement de RÉASSIGNER la variable dans la pile :
// user = { nom: 'Durand' }; // ❌ Erreur TS : Assignment to constant variable.

// Mais l'objet dans le Tas est totalement MUTABLE :
user.nom = 'Durand'; // ✅ Compile et s'exécute sans broncher !
```

> **Règle :** `const` verrouille le **pointeur de la pile** ; `Object.freeze()` verrouille les **propriétés dans le tas**.

---

### 5.3 Piège 3 : Comparer deux objets `Date` avec `===`

```typescript
const dateA = new Date('2026-09-30T10:00:00Z');
const dateB = new Date('2026-09-30T10:00:00Z');

console.log(dateA === dateB); // ❌ FALSE ! Deux adresses mémoires distinctes.

// ✅ BONNE PRATIQUE : Comparer les timestamps numériques primitifs
console.log(dateA.getTime() === dateB.getTime()); // ✅ TRUE !
```

---

### 5.4 Piège 4 : Le clonage préhistorique `JSON.parse(JSON.stringify(obj))`

Ce bricolage très populaire dans les années 2010 doit être banni :
- Les objets `Date` se transforment en chaînes de caractères brutes et perdent toutes leurs méthodes (`getFullYear()`, etc.).
- Les valeurs `undefined` disparaissent.
- Si l'objet comporte une référence circulaire, le moteur plante brutalement avec l'erreur fatale : `TypeError: Converting circular structure to JSON`.
- **Règle :** Utilisez `structuredClone()` pour les données pures, ou une méthode `clone()` pour vos classes métier.

---

### 5.5 Piège 5 : Cloner une instance de classe par spread `{ ...instance }`

```typescript
class Utilisateur {
  constructor(public nom: string) {}
  saluer(): string { return `Bonjour, je suis ${this.nom}`; }
}

const u1 = new Utilisateur('Alice');
const u2 = { ...u1 }; // ⚠️ Faux clone d'instance !

console.log(u2.nom); // 'Alice'
console.log(u2 instanceof Utilisateur); // ❌ FALSE !
// u2.saluer(); // 💥 TypeError: u2.saluer is not a function !
```

Le spread a extrait les attributs énumérables pour fabriquer un objet littéral pur, détruisant au passage le prototype et toutes les méthodes de la classe.

---

### 5.6 Les 5 Commandements de la Maîtrise des Objets en POO

1. **Ne jamais se fier à `===` pour le contenu d'un objet** : Deux invocations de `new` créent deux identités physiques distinctes. Implémentez systématiquement `equals()` pour vos comparaisons métier.
2. **Bannir les alias accidentels par affectation** : Ne faites jamais `const b = a` si vous prévoyez d'altérer les données de `b` de manière autonome. Clonez vos objets.
3. **Se méfier du spread sur structures imbriquées** : Rappelez-vous que `{ ...obj }` ne copie que le premier étage. Utilisez `structuredClone()` pour les arbres profonds de données.
4. **Sceller vos Objets-Valeurs** : Combinez `readonly` au typage et `Object.freeze()` à l'exécution. Vos objets métier doivent être indestructibles.
5. **En programmation réactive, privilégier le remplacement à la mutation** : Pour avertir un framework réactif qu'une donnée a changé, transmettez toujours une **nouvelle référence mémoire**.

---

## Partie 06 — Démonstration Angular : La Fiche Article Réactive (*Signals POS*)

Pour observer la convergence absolue de tous les concepts étudiés aujourd'hui (identité, modèle mémoire, méthode `equals`, immutabilité et clonage), analysons un mini-projet Angular 22 complet : **La Fiche Article du Catalogue**.

### 6.1 Pourquoi Angular Signals dépend-il de l'identité mémoire ?

Dans le moteur réactif moderne d'Angular, un signal créé par `article = signal<Article>(...)` surveille ses modifications grâce à une fonction de comparaison interne par défaut : **`Object.is(valeurPrecedente, nouvelleValeur)`**.

Or, `Object.is()` sur des objets se comporte exactement comme l'opérateur d'égalité stricte `===` : il compare uniquement les adresses mémoires dans la pile !
- Si vous mutez un objet sur place dans le Tas et que vous faites `this.article.set(objet)`, l'adresse mémoire transmise est strictement identique (`0x10A === 0x10A`). Angular déduit qu'aucun changement n'a eu lieu : **le template reste figé et l'interface utilisateur ne s'actualise pas !**
- Si vous fournissez une nouvelle instance issue d'un clonage (`0x10A !== 0x20B`), Angular détecte la rupture de référence et **rafraîchit immédiatement le composant**.

---

### 6.2 Étape 1 : Le Modèle Métier POO — La Classe `Article`

```typescript
// src/app/models/article.model.ts
import { Equatable } from '../core/equatable.interface';

export class Article implements Equatable<Article> {
  constructor(
    public readonly id: number,    // 🆔 Identité unique immuable
    public readonly nom: string,   // 🏷️ Libellé descriptif
    public readonly prix: number   // 💶 Valeur financière
  ) {
    if (prix < 0) {
      throw new Error("Le prix d'un article ne peut pas être négatif");
    }
  }

  /**
   * 1. Égalité Métier (Partie 02)
   * Deux articles sont sémantiquement identiques s'ils partagent le même identifiant,
   * même si leur prix temporaire ou promotionnel diffère.
   */
  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof Article)) return false;
    return this.id === autre.id;
  }

  /**
   * 2. Clonage Fonctionnel Immuable (Parties 03 & 04)
   * Au lieu de modifier 'prix' en place, on instancie un NOUVEL Article
   * avec le prix mis à jour tout en préservant l'id et le nom d'origine.
   */
  avecNouveauPrix(nouveauPrix: number): Article {
    return new Article(this.id, this.nom, nouveauPrix);
  }
}
```

---

### 6.3 Étape 2 : Le Composant Angular Standalone — `ArticleComponent`

```typescript
// src/app/components/article/article.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article.component.html'
})
export class ArticleComponent {
  // Le signal Angular héberge l'instance de notre modèle métier POO
  article = signal<Article>(new Article(42, 'Casque Bluetooth ANC', 100));

  // Journal des événements pour visualiser l'activité interne à l'écran
  dernierMessage = signal<string>('Composant initialisé à 100 €');

  /**
   * ❌ BOUTON 1 : Mutation en place (L'Anti-pattern du débutant)
   */
  remiseMuteDirect(): void {
    const a = this.article();

    // ⚠️ Forçage de mutation interne dans le Tas (contournement du readonly) :
    (a as any).prix = 70;

    // Tentative de notification au signal :
    this.article.set(a);

    // Analyse du désastre :
    // 'a' pointe toujours vers l'adresse 0x10A.
    // Angular teste : Object.is(0x10A, 0x10A) ➔ TRUE !
    // Angular conclut : "Rien n'a bougé, aucun rafraîchissement nécessaire."
    this.dernierMessage.set('❌ Mutation en place exécutée : même adresse 0x10A ➔ Le DOM reste figé !');
  }

  /**
   * ✅ BOUTON 2 : Nouvelle instance immuable (La Bonne Pratique)
   */
  remiseImmuable(): void {
    const a = this.article();

    // Création d'une nouvelle instance à une NOUVELLE adresse mémoire (0x20B) :
    const nouvelArticle = a.avecNouveauPrix(70);

    // Notification au signal :
    this.article.set(nouvelArticle);

    // Analyse de la réussite :
    // Angular teste : Object.is(0x10A, 0x20B) ➔ FALSE !
    // Angular détecte immédiatement le changement d'adresse et actualise l'écran.
    this.dernierMessage.set('✅ Nouvelle instance créée : adresse 0x20B ➔ Le DOM est actualisé à 70 € !');
  }
}
```

---

### 6.4 Étape 3 : Le Template HTML du Composant (`article.component.html`)

```html
<!-- src/app/components/article/article.component.html -->
<main class="max-w-xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl space-y-6">

  <!-- En-tête de la fiche produit -->
  <header class="flex justify-between items-center border-b border-slate-800 pb-4">
    <div>
      <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
        Réf Article : #{{ article().id }}
      </span>
      <h2 class="text-2xl font-black mt-2 text-white">{{ article().nom }}</h2>
    </div>
    
    <!-- Prix réactif lié au Signal -->
    <div class="text-right">
      <div class="text-xs uppercase font-bold text-slate-400">Prix affiché</div>
      <div class="text-3xl font-extrabold text-emerald-400 font-mono">
        {{ article().prix }} €
      </div>
    </div>
  </header>

  <!-- Panneau des boutons d'expérimentation pédagogique -->
  <section class="space-y-3">
    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
      Expérimentez la détection de changement :
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Bouton Anti-pattern -->
      <button 
        (click)="remiseMuteDirect()"
        class="p-3.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs text-left transition flex flex-col justify-between">
        <span class="flex items-center gap-1.5 mb-1 text-rose-400">
          <span>❌</span> Muter en place (70 €)
        </span>
        <span class="text-[10px] opacity-75 font-normal">
          Mute l'objet dans la RAM sans changer l'adresse (0x10A).
        </span>
      </button>

      <!-- Bouton Bonne pratique -->
      <button 
        (click)="remiseImmuable()"
        class="p-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-left transition flex flex-col justify-between">
        <span class="flex items-center gap-1.5 mb-1 text-emerald-400">
          <span>✅</span> Nouvelle instance (70 €)
        </span>
        <span class="text-[10px] opacity-75 font-normal">
          Crée une nouvelle adresse (0x20B) via avecNouveauPrix().
        </span>
      </button>
    </div>
  </section>

  <!-- Journal de télémétrie en direct -->
  <footer class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
    <div class="text-slate-400 font-bold">📡 Journal de réactivité :</div>
    <div class="text-amber-300">{{ dernierMessage() }}</div>
  </footer>

</main>
```

---

### 6.5 Démonstration visuelle et scénario d'exécution pas à pas

Visualisons ce qui se passe sur l'écran de l'utilisateur lors de la manipulation des deux boutons :

```
┌────────────────────────────────────────────────────────┐
│ 📦 CATALOGUE BOUTIQUE                       Réf: #42   │
│ Casque Bluetooth ANC                                   │
│                                            PRIX ÉCRAN  │
│                                               100 €    │
├────────────────────────────────────────────────────────┤
│ [ ❌ MUTER EN PLACE (70 €) ]  [ ✅ NOUVELLE INSTANCE ] │
├────────────────────────────────────────────────────────┤
│ 📡 Journal : Composant initialisé à 100 €              │
└────────────────────────────────────────────────────────┘

SCÉNARIO 1 : L'étudiant clique sur [ ❌ MUTER EN PLACE ]
1. En mémoire RAM (dans le Tas), la propriété prix passe physiquement de 100 à 70.
2. Angular évalue le signal : Object.is(0x10A, 0x10A) ➔ TRUE.
3. RÉSULTAT VISUEL :
┌────────────────────────────────────────────────────────┐
│ 📦 CATALOGUE BOUTIQUE                       Réf: #42   │
│ Casque Bluetooth ANC                                   │
│                                            PRIX ÉCRAN  │
│                                               100 € 💥 │ <── FIGÉ SUR 100 € !
├────────────────────────────────────────────────────────┤
│ 📡 Journal : ❌ Même adresse 0x10A ➔ Le DOM reste figé !│
└────────────────────────────────────────────────────────┘

SCÉNARIO 2 : L'étudiant clique sur [ ✅ NOUVELLE INSTANCE ]
1. La méthode avecNouveauPrix(70) alloue un nouvel objet à l'adresse 0x20B.
2. Angular évalue le signal : Object.is(0x10A, 0x20B) ➔ FALSE.
3. RÉSULTAT VISUEL :
┌────────────────────────────────────────────────────────┐
│ 📦 CATALOGUE BOUTIQUE                       Réf: #42   │
│ Casque Bluetooth ANC                                   │
│                                            PRIX ÉCRAN  │
│                                                70 € 🎉 │ <── ACTUALISÉ SUR 70 € !
├────────────────────────────────────────────────────────┤
│ 📡 Journal : ✅ Nouvelle adresse 0x20B ➔ DOM actualisé !│
└────────────────────────────────────────────────────────┘
```

---

### 6.6 La Clé de Voûte philosophique : Égalité Métier (`equals`) vs Égalité Mémoire (`===`)

Cette démonstration met en lumière la symbiose conceptuelle la plus profonde de notre cours de POO moderne :

```typescript
const articleInitial = new Article(42, 'Casque Bluetooth', 100);
const articlePromo   = articleInitial.avecNouveauPrix(70);

// 1. ÉGALITÉ MÉTIER (Vue du Domaine Métier) :
console.log(articleInitial.equals(articlePromo)); // ✅ TRUE !
// Pourquoi ? Parce que c'est toujours le même produit #42 en entrepôt !
// Le client ne change pas d'article, il bénéficie juste d'un tarif préférentiel.

// 2. ÉGALITÉ MÉMOIRE (Vue du Moteur Réactif Angular) :
console.log(articleInitial === articlePromo);    // ❌ FALSE !
// Pourquoi ? Parce que 0x10A !== 0x20B en mémoire vive !
// Et c'est précisément ce "FALSE" qui permet à Angular de savoir qu'il DOIT redessiner l'écran !
```

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LA RÉVÉLATION DE LA SÉANCE 12                        │
├────────────────────────────────────────────────────────────────────────┤
│ Vous écrivez equals() pour que votre logique d'entreprise sache        │
│ reconnaître que deux objets représentent la même entité du monde réel. │
│                                                                        │
│ Et vous générez de NOUVELLES RÉFÉRENCES MÉMOIRE par immutabilité       │
│ pour réveiller les moteurs réactifs et actualiser vos interfaces       │
│ graphiques !                                                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Synthèse : ce qu'il faut retenir absolument

### Tableau récapitulatif des mécanismes

| Concept / Mécanisme | Problème résolu | Implémentation TypeScript / Angular | Règle d'or associée |
|---|---|---|---|
| **Identité (`===`)** | Distingue deux instances physiques en mémoire vive. | `a === b` compare les adresses hexadécimales de la Pile (*Stack*). | Deux objets différents avec les mêmes attributs ne sont **jamais** égaux par `===`. |
| **Égalité Métier (`equals`)** | Compare le contenu sémantique ou l'identifiant des objets. | Méthode `equals(other: unknown): boolean` avec garde `instanceof`. | Incontournable pour les recherches dans les collections (`.some()`, `.find()`). |
| **Copie Superficielle (*Shallow*)** | Duplique l'enveloppe de premier niveau d'un objet. | Spread operator `{ ...obj }` ou tableau `[ ...tab ]`. | Parfait pour les objets plats ; dangereux dès qu'il y a des objets imbriqués. |
| **Copie Profonde (*Deep*)** | Duplique récursivement tous les niveaux d'un arbre de données. | Fonction standard `structuredClone(obj)`. | À réserver aux données pures ; perd les méthodes et prototypes de classes. |
| **Clonage POO (`clone`)** | Duplique une instance en préservant méthodes et encapsulation. | Méthode métier `clone(): T` avec délégation aux sous-objets. | La solution reine en orienté objet pour dupliquer des modèles de domaine. |
| **Immutabilité** | Élimine les effets de bord et fiabilise la détection de changements. | `readonly` (compilation) + `Object.freeze(this)` (exécution). | Traitez vos données comme des gravures sur pierre ; produisez des copies pour modifier. |
| **Réactivité Signals** | Déclenche chirurgicalement la mise à jour de l'interface utilisateur. | `signal<T>()`, `update(prev => next)`, comparaison `Object.is()`. | Ne mutez jamais un objet en place : passez toujours une nouvelle référence mémoire. |

---

### La Règle d'Or de la Séance 12

> **« En programmation réactive moderne, ne mutez jamais vos objets en place : traitez vos modèles de domaine comme des gravures sur pierre.**  
> **Pour faire évoluer l'état de votre application, produisez systématiquement une nouvelle référence mémoire afin d'informer vos signaux et de garantir l'actualisation instantanée de vos composants graphiques. »**

---

## Clôture du Bloc B & Pont vers le Bloc C

Toutes nos félicitations ! Vous venez de valider avec succès le **Bloc B** de votre cursus de Programmation Orientée Objet :

- Avec la **Séance 10**, vous avez dompté la fragilité logicielle grâce aux exceptions métier typées et à la garantie du bloc `finally`.
- Avec la **Séance 11**, vous avez éliminé la rigidité architecturale en appliquant les principes **SOLID** (Responsabilité Unique, Ouvert/Fermé, Inversion de Dépendance).
- Avec la **Séance 12**, vous avez percé le mystère de la mémoire vive, maîtrisé l'identité, le clonage et l'immutabilité.

Vous disposez désormais d'un socle d'ingénierie logicielle digne des meilleurs développeurs professionnels.

### Aperçu du Bloc C : L'Approche Angular Signal-First (Séances 13 à 15)

Dès la prochaine séance, nous quittons les coulisses pour appliquer directement ce modèle objet au framework **Angular 22** :

- **Séance 13 — Composants & Signals Approfondis** : Les briques réactives fondamentales (`signal`, `computed`, `effect`), les nouvelles APIs d'entrées/sorties réactives (`input()`, `output()`, `model()`) et l'orchestration d'une interface dynamique complète.
- **Séance 14 — Services Métier, Génériques & Injection de Dépendance** : Comment mettre en musique l'Inversion de Dépendance (DIP de la S11) en concevant des services injectables basés sur des contrats d'interfaces génériques (`Repository<T>`).
- **Séance 15 — Signal Forms, Validation Réactive & Routing** : La construction d'une application d'entreprise complète avec gestion des formulaires réactifs modernes, validation déclarative et navigation multi-pages sécurisée.
