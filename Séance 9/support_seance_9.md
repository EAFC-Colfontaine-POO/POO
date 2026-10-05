# Séance 9 — Composition vs Héritage

**Cours de programmation orientée objet — Bachelier en informatique (EAFC)**
**Stack technique : TypeScript 5+, Angular 22 (approche signal-first)**

---

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant est en mesure de :

1. Identifier les trois grandes pathologies de l'héritage : l'explosion combinatoire des sous-classes, la classe de base fragile (*fragile base class*) et le syndrome du « gorille et de la banane ».
2. Distinguer sémantiquement la relation « est-un » (*is-a*), qui relève de l'héritage, de la relation « a-un » (*has-a*), qui relève de la composition.
3. Mettre en œuvre le mécanisme de délégation : transférer l'exécution d'une tâche à un objet collaborateur interne plutôt que de tout implémenter dans une seule classe.
4. Combiner composition et interfaces (vue en séance 8) afin de découpler les classes, de permettre le remplacement dynamique des composants et de faciliter les tests unitaires par injection de *mocks*.
5. Appliquer l'arbre de décision permettant de choisir méthodiquement entre héritage et composition selon le contexte métier.
6. Reconnaître la composition dans une application Angular simple : injection de dépendances, entrées par signaux et délégation directe.

---

## Introduction : pourquoi l'héritage ne suffit plus

Les séances précédentes ont posé les fondations de la programmation orientée objet : l'encapsulation (séance 5), l'héritage et le polymorphisme (séances 6 et 7), puis les classes abstraites et les interfaces (séance 8). Il est tentant, une fois le mot-clé `extends` maîtrisé, d'en faire l'outil de réutilisation universel. Les projets d'envergure démontrent pourtant que l'héritage, utilisé à outrance, constitue une prison architecturale. Trois problèmes récurrents illustrent cette limite.

### 1.1 L'explosion combinatoire des sous-classes

Lorsque l'on modélise des entités qui combinent plusieurs caractéristiques orthogonales — indépendantes les unes des autres — l'héritage conduit à créer une sous-classe par combinaison. Considérons la modélisation de véhicules dotés d'un type de motorisation et d'un type de transmission :

```typescript
class Vehicule { /* ... */ }

// Une sous-classe par variante :
class VehiculeThermique extends Vehicule {}
class VehiculeElectrique extends Vehicule {}

class VehiculeThermiqueManuel extends VehiculeThermique {}
class VehiculeThermiqueAutomatique extends VehiculeThermique {}
class VehiculeElectriqueAutomatique extends VehiculeElectrique {}
```

Si l'on ajoute une option supplémentaire, par exemple « connecté », le nombre de classes requis croît de façon exponentielle : avec $N$ options à deux choix chacune, il faut $2^N$ sous-classes. Quatre options impliquent déjà seize classes à maintenir, dont la plupart ne contiennent quasiment aucun code propre.

La composition règle ce problème immédiatement : on conserve une seule classe `Vehicule` qui assemble des composants :

```typescript
class Vehicule {
  constructor(
    private moteur: Moteur,             // Thermique ou Électrique
    private transmission: Transmission, // Manuelle ou Automatique
    private connectivite?: ModuleGPS    // Optionnel
  ) {}
}

// Les combinaisons se font à l'instanciation, sans nouvelle classe :
const tesla = new Vehicule(
  new MoteurElectrique(),
  new TransmissionAutomatique()
);
```

Ajouter une nouvelle option ne demande plus aucune nouvelle sous-classe : l'objet se construit comme un assemblage de briques, à l'image d'un jeu de construction.

### 1.2 La classe de base fragile (*fragile base class*)

L'héritage d'implémentation brise l'encapsulation : une classe fille dépend intimement des détails d'implémentation de sa classe mère. Considérons un compte bancaire dont une sous-classe journalise les dépôts :

```typescript
class CompteBancaire {
  protected solde: number = 0;

  deposer(montant: number): void {
    this.solde += montant;
  }

  // Version initiale de la classe mère :
  deposerPlusieurs(montants: number[]): void {
    for (const m of montants) {
      this.solde += m; // modification directe du solde
    }
  }
}

class CompteAvecJournal extends CompteBancaire {
  override deposer(montant: number): void {
    super.deposer(montant);
    console.log(`Dépôt de ${montant} €`);
  }
}
```

Supposons qu'un mainteneur de `CompteBancaire` refactorise la méthode `deposerPlusieurs` afin de réutiliser le code existant :

```typescript
// Modification dans CompteBancaire :
deposerPlusieurs(montants: number[]): void {
  for (const m of montants) {
    this.deposer(m); // appelle désormais deposer()
  }
}
```

Cette modification, en apparence anodine, change le comportement observable de la sous-classe : chaque dépôt multiple déclenche désormais un journal, ce qui peut provoquer des doublons ou une corruption des logs si la sous-classe avait elle-même surchargé `deposerPlusieurs`. Le danger est double : la rupture est **silencieuse** — aucune erreur de compilation ne se produit — et **distante** — elle touche des classes héritées situées ailleurs dans le code. L'héritage transforme chaque modification de la classe mère en risque potentiel pour l'ensemble de la hiérarchie.

### 1.3 Le piège du « gorille et de la banane »

Joe Armstrong, concepteur du langage Erlang, formule le problème avec une image restée célèbre :

> « Le problème avec les langages orientés objet classiques, c'est tout ce monde implicite qu'ils transportent avec eux. Vous vouliez une banane, mais ce que vous obtenez, c'est un gorille qui tient la banane, et toute la jungle qui va avec ! »

Concrètement : lorsqu'une classe hérite d'une autre pour n'en réutiliser qu'une seule méthode, elle hérite aussi de toutes ses variables, de ses constructeurs complexes et de ses dépendances cachées. L'anti-pattern typique du projet débutant consiste à créer un ancêtre générique « fourre-tout » destiné à partager du code :

```typescript
abstract class BaseEntity {
  id: string = '';
  createdAt: Date = new Date();

  envoyerEmail(dest: string, msg: string): void { /* ... */ }
  sauvegarderEnBase(): void { /* ... */ }
  genererPdf(): void { /* ... */ }
  loguerActivite(): void { /* ... */ }
}

// Une simple facture hérite de dizaines de méthodes inutiles :
class Facture extends BaseEntity {
  // La facture a-t-elle réellement besoin de la gestion SMTP ?
}
```

Cette classe mère viole le principe de responsabilité unique (SRP) : elle cumule des responsabilités hétérogènes (persistance, messagerie, reporting), et toutes ses sous-classes héritent d'un bagage lourd dont elles n'ont que faire.

---

## 1. Les deux piliers relationnels : « est-un » contre « a-un »

Avant d'écrire la moindre ligne de code, il convient de poser le bon diagnostic conceptuel. La distinction entre les deux relations est le premier réflexe du concepteur.

### 1.1 La relation « est-un » (*is-a*)

La relation « est-un » formalise qu'une classe fille constitue une **variante spécifique** d'une classe plus générale. Elle s'exprime avec le mot-clé `extends`. Trois exemples canoniques :

- Un `Chien` **est un** `Animal`.
- Un `Cercle` **est une** `Forme`.
- Un `CompteEpargne` **est un** `CompteBancaire`.

Cette relation possède trois caractéristiques fondamentales :

- **Statique** : le lien est figé à la compilation. Un `Chien` ne peut pas devenir un `Oiseau` en cours d'exécution.
- **Substituable** : le principe de substitution de Liskov (LSP) doit être respecté — partout où un `Animal` est attendu, un `Chien` doit se comporter sans surprise.
- **Unique** : en TypeScript, une classe ne peut avoir qu'un seul parent direct (héritage simple).

Règle de discernement : l'héritage ne se justifie que face à une identité fondamentale commune, jamais par simple commodité technique.

### 1.2 La relation « a-un » (*has-a*)

La relation « a-un » formalise qu'une classe est **composée d'autres objets** pour fonctionner. Elle se matérialise par une référence vers ces objets, stockée en attribut :

- Une `Voiture` **a un** `Moteur`.
- Un `Ordinateur` **a un** `Processeur`.
- Un `Utilisateur` **a une** `Adresse`.

Ses caractéristiques fondamentales s'opposent point par point à celles de l'héritage :

- **Dynamique** : le composant interne peut être remplacé ou reconfiguré pendant l'exécution, comme on change un moteur ou une carte réseau.
- **Boîte noire** (*black-box reuse*) : la classe composite utilise uniquement les méthodes publiques du composant, sans se soucier de son code interne.
- **Multiplicité libre** : une classe peut contenir autant de composants différents que nécessaire, sans restriction linguistique.

Règle de discernement : une voiture n'est pas un moteur, elle possède un moteur. Faire `class Voiture extends Moteur` serait absurde — la voiture hériterait de la vidange d'huile et du nombre de soupapes.

### 1.3 Représentation UML comparée

En UML, l'héritage se représente par une flèche à triangle blanc fermé (`Animal <|-- Chien`), traduisant une filiation stricte. La composition se représente par un losange du côté de la classe possédante : le losange **plein** (◆) désigne une composition forte — la pièce n'existe pas sans le tout —, le losange **creux** (◇) désigne une agrégation, où la pièce peut exister indépendamment du tout. Visuellement, le diagramme d'héritage évoque un arbre généalogique, tandis que le diagramme de composition évoque un plan de montage industriel.

### 1.4 Quiz de discernement

Quatre cas permettent d'entraîner le réflexe :

1. **Un Smartphone et une Batterie** — le smartphone a une batterie (composition) : la batterie se remplace.
2. **Un Enseignant et une Personne** — l'enseignant est une personne (héritage) : identité humaine irréductible.
3. **Un Compte Bancaire et un Journal de logs** — le compte possède un journal (composition) : le journal est un service externe.
4. **Un Carré et un Rectangle** — piège célèbre de Liskov : mathématiquement, un carré est un rectangle ; en programmation orientée objet avec objets mutables, hériter conduit à des incohérences (redimensionner la largeur d'un « rectangle » hérité ne doit pas modifier la hauteur d'un carré).

La question à se poser systématiquement : *« Si je remplace ou retire ce composant, l'objet principal conserve-t-il son identité ? »*

---

## 2. Le mécanisme de composition et la délégation en TypeScript

### 2.1 La délégation

La délégation est l'acte par lequel un objet, recevant un appel de méthode, **confie l'exécution du travail** à un collaborateur interne. L'image de la vie réelle est parlante : un chef d'entreprise ne livre pas lui-même les colis ; lorsqu'un client demande « expédiez ma commande », le chef transmet l'ordre au `ServiceLivraison`.

La délégation procure trois vertus :

1. **Spécialisation** : chaque classe se concentre sur sa responsabilité unique (SRP).
2. **Cloisonnement** : si le fonctionnement interne du composant change, la classe composite n'a pas à être modifiée.
3. **Réutilisabilité** : le composant délégué peut servir dans des classes composites totalement différentes.

### 2.2 Assemblage simple et délégation

```typescript
// Le composant spécialisé
class Moteur {
  constructor(private puissanceCV: number) {}

  demarrer(): string {
    return `Moteur ${this.puissanceCV} CV vrombit !`;
  }
}

// La classe composite : « a un » Moteur
class Voiture {
  constructor(
    public marque: string,
    private moteur: Moteur // référence stockée en privé
  ) {}

  rouler(): void {
    // Délégation de l'action au composant interne
    const bruit = this.moteur.demarrer();
    console.log(`${this.marque} roule : ${bruit}`);
  }
}

// Instanciation et injection :
const moteurV8 = new Moteur(450);
const mustang = new Voiture('Ford Mustang', moteurV8);
mustang.rouler();
// Sortie : Ford Mustang roule : Moteur 450 CV vrombit !
```

Aucun héritage n'est utilisé : `Voiture` possède une référence vers une instance de `Moteur`. Le même `Moteur` pourrait équiper un `Bateau` ou un `GenerateurElectrique` sans duplication aucune.

### 2.3 Remplacement dynamique à chaud

La composition offre une mutabilité temporelle absolue :

```typescript
class VoitureModulable {
  constructor(
    public marque: string,
    private moteur: Moteur
  ) {}

  remplacerMoteur(nouveauMoteur: Moteur): void {
    console.log('[Atelier] Remplacement du moteur...');
    this.moteur = nouveauMoteur;
  }

  rouler(): void {
    console.log(`${this.marque} -> ${this.moteur.demarrer()}`);
  }
}

const monVehicule = new VoitureModulable('EcoCar', new Moteur(75));
monVehicule.rouler();
// EcoCar -> Moteur 75 CV vrombit !
monVehicule.remplacerMoteur(new Moteur(300));
monVehicule.rouler();
// EcoCar -> Moteur 300 CV vrombit !
```

Avec l'héritage, cette transformation serait impossible : il faudrait détruire l'objet et instancier une nouvelle classe. Un `Chien` ne deviendra jamais un `Chat` à l'exécution ; en revanche, un guerrier peut, par composition, rengainer son épée et équiper un arc immédiatement.

---

## 3. Découplage par l'interface et injection

C'est ici que les acquis de la séance 8 (interfaces) rejoignent la composition : programmer vers un contrat d'abstraction plutôt que vers une classe concrète.

### 3.1 La composition rigide : le `new` en dur

Créer le composant directement dans le constructeur de la classe composite semble relever de la composition, mais il s'agit d'une composition **rigide** :

```typescript
class Voiture {
  private moteur: MoteurEssence;

  constructor() {
    // Couplage fort caché à l'intérieur de la classe :
    this.moteur = new MoteurEssence(120);
  }
}
```

`Voiture` est mariée à vie avec `MoteurEssence` : impossible de la tester avec un faux moteur, impossible de lui adjoindre un moteur électrique.

### 3.2 L'injection par interface

La bonne pratique consiste à dépendre de l'**interface**, non de la classe concrète, et à recevoir le composant par le constructeur (injection par constructeur) :

```typescript
// Contrat pur (séance 8)
interface Moteur {
  demarrer(): string;
}

class Voiture {
  // Dépend de l'INTERFACE, pas d'une classe concrète
  constructor(private moteur: Moteur) {}
}
```

`Voiture` accepte désormais n'importe quel objet respectant le contrat `Moteur`. C'est le principe d'inversion des dépendances : la classe de haut niveau (`Voiture`) ne dépend plus d'un détail d'implémentation (`MoteurEssence`), mais d'une abstraction.

### 3.3 Le polymorphisme sans héritage

L'alliance composition–interface reproduit le polymorphisme sans recourir à `extends` :

```typescript
// Contrat d'abstraction
interface Moteur {
  demarrer(): string;
}

// Deux implémentations interchangeables
class MoteurThermique implements Moteur {
  demarrer(): string { return 'Vroum ! Essence brûlée.'; }
}

class MoteurElectrique implements Moteur {
  demarrer(): string { return 'Bzzzz ! 100% silencieux.'; }
}

// La classe composite ne dépend QUE du contrat
class Voiture {
  constructor(
    public readonly nom: string,
    private moteur: Moteur
  ) {}

  conduire(): string {
    return `${this.nom} : ${this.moteur.demarrer()}`;
  }
}

// Assemblage libre :
const clio = new Voiture('Renault Clio', new MoteurThermique());
const zoé = new Voiture('Renault Zoé', new MoteurElectrique());
console.log(clio.conduire()); // Renault Clio : Vroum ! Essence brûlée.
console.log(zoé.conduire());  // Renault Zoé : Bzzzz ! 100% silencieux.
```

Il n'existe aucun lien de parenté entre les deux moteurs : leur interchangeabilité provient exclusivement de l'interface commune qu'ils implémentent.

### 3.4 La testabilité révolutionnée : injection de *mocks*

Si `Voiture` héritait d'une classe contactant un GPS satellite réel ou écrivant en base de données, ses tests unitaires échoueraient ou prendraient des minutes, et il serait impossible d'isoler la sous-classe de son parent lourd. La composition rend le test trivial :

```typescript
// Mock créé sur mesure en trois lignes :
class MockMoteur implements Moteur {
  demarrer(): string {
    return 'TEST_OK';
  }
}

// Test unitaire instantané et déterministe :
const voitureTest = new Voiture('Testeur', new MockMoteur());
console.assert(
  voitureTest.conduire() === 'Testeur : TEST_OK',
  'Le test doit réussir !'
);
```

On teste la logique propre à `Voiture` sans aucune machinerie externe réelle. En entreprise, la testabilité constitue le premier critère de qualité logicielle, et l'héritage la dégrade précisément parce qu'il contraint de traîner toute la hiérarchie dans chaque test.

---

## 4. Le duel : héritage contre composition

### 4.1 Tableau comparatif

| Critère | Héritage (`extends`) | Composition (`has-a`) |
|---|---|---|
| Relation sémantique | « Est-un » — filiation | « A-un » — assemblage |
| Liaison temporelle | Statique (fixée à la compilation) | Dynamique (modifiable à l'exécution) |
| Niveau de couplage | Fort (l'enfant dépend du parent) | Faible (dépendance par interface) |
| Encapsulation | Brisée (*white-box reuse*, accès `protected`) | Respectée (*black-box reuse*, méthodes publiques) |
| Nombre de relations | Un seul parent direct | Multiplicité libre |
| Risque combinatoire | Élevé (explosion exponentielle) | Nul (combinaisons à l'instanciation) |
| Testabilité | Difficile (chaîne de `super`) | Triviale (injection d'un faux composant) |
| Idéal pour | Taxonomie, gabarit abstrait commun | Fonctionnalités transversales, services |

### 4.2 La maxime du *Gang of Four*

En 1994, Erich Gamma, Richard Helm, Ralph Johnson et John Vlissides énoncent dans l'ouvrage fondateur des *Design Patterns* le principe le plus cité de la conception orientée objet :

> « Favor object composition over class inheritance » — préférer la composition d'objets à l'héritage de classes.

Ce principe recommande de considérer la composition comme le choix par défaut et d'exiger une justification stricte avant de recourir à l'héritage. Trois bénéfices en découlent :

1. **Moins de code parasite** — l'interface de chaque classe reste compacte, sans méthodes superflues héritées.
2. **Architecture évolutive** — modifier ou remplacer une pièce interne n'affecte pas les autres parties du logiciel.
3. **Agilité d'équipe** — deux développeurs peuvent coder séparément le moteur et la voiture sans conflit ni blocage mutuel.

### 4.3 L'arbre de décision

Pour trancher méthodiquement, on applique la séquence de questions suivante :

1. S'agit-il d'une véritable relation taxonomique « est-un » ? → **Non** : préférer la composition.
2. Le comportement doit-il changer à chaud à l'exécution ? → **Oui** : composition.
3. Y a-t-il plusieurs fonctionnalités orthogonales à combiner ? → **Oui** : composition.
4. Souhaite-t-on factoriser du code via une classe abstraite ? → **Oui** : héritage légitime ; **Non** : interface pure.

La composition gagne dans l'immense majorité des cas d'usage concrets. L'héritage se justifie lorsque la relation relève d'une essence — mathématique (`Cercle` est une `Forme`) ou biologique (`Chien` est un `Animal`) — et que la hiérarchie demeure courte, de l'ordre de deux niveaux.

---

## 5. Pièges fréquents et anti-patterns

### 5.1 L'héritage par pure paresse (*convenience inheritance*)

L'envie de « gagner du temps » en héritant d'une structure existante mène à des catastrophes d'encapsulation. Cas historique : la classe `Stack` des premières versions de la bibliothèque standard de Java héritait de `Vector`, exposant toutes les opérations d'un tableau sur une pile censée n'autoriser que `push` et `pop`.

```typescript
// Le piège : hériter d'un tableau natif
class Pile<T> extends Array<T> {
  empiler(element: T): void { this.push(element); }
  depiler(): T | undefined { return this.pop(); }
}

const p = new Pile<number>();
p.empiler(10);
// Catastrophe : toutes les méthodes d'Array sont exposées !
p.splice(0, 1); // suppression au milieu de la pile !
p.sort();       // destruction de l'ordre de la pile !
```

La correction consiste à **encapsuler** le tableau :

```typescript
// Une Pile N'EST PAS un tableau, elle UTILISE un tableau
class Pile<T> {
  private elements: T[] = []; // privé, parfaitement sécurisé

  empiler(element: T): void { this.elements.push(element); }
  depiler(): T | undefined { return this.elements.pop(); }

  get taille(): number { return this.elements.length; }
}
// Impossible de contourner les règles de la pile
```

L'encapsulation est sauve : l'utilisateur ne peut employer que les opérations prévues, et les invariants de la structure restent garantis.

### 5.2 L'anti-pattern `BaseComponent` en Angular

La fausse bonne idée consiste à créer une classe mère pour « factoriser » les services injectés :

```typescript
// Classe mère créée pour factoriser — mauvaise idée
abstract class BaseComponent {
  protected router = inject(Router);
  protected alert = inject(AlertService);
  protected http = inject(HttpClient);
  protected userAuth = inject(AuthService);

  log(msg: string): void { console.log(msg); }
}

@Component({ /* ... */ })
export class SimpleTitleComponent extends BaseComponent {
  // Hérite de quatre services dont il ne se sert jamais !
}
```

Un composant qui souhaite simplement afficher un titre se retrouve avec quatre services superflus, un arbre de dépendances compliqué et des tests alourdis. La composition moderne, par injection ciblée, prévaut :

```typescript
@Component({ /* ... */ })
export class SimpleTitleComponent {
  // N'injecte strictement que ce dont il a besoin.
  // Aucun héritage, zéro pollution.
  title = input.required<string>();
}
```

Si un comportement partagé s'avère nécessaire, il convient de le placer dans un petit service dédié ou une directive de composition — jamais dans une classe mère. Angular a été conçu dès l'origine pour la composition via l'injection de dépendances, non pour l'héritage de composants. La présence de `extends BaseComponent` dans du code Angular constitue une alerte architecturale.

---

## 6. Démonstration Angular — la galerie de véhicules

La démonstration illustre la composition dans un composant standalone simple : le composant compose des modèles métier par injection de constructeur et par signal d'entrée, puis observe la délégation dans l'interface graphique. Aucune notion Angular nouvelle n'est introduite au-delà des signaux (`signal`, `input`) vus dans les séances précédentes.

### 6.1 Architecture du mini-projet

```
src/app/
├── models/
│   ├── engine.interface.ts          (contrat pur du moteur)
│   ├── engines.model.ts             (moteur électrique, moteur thermique)
│   └── car.model.ts                 (classe composite Voiture)
├── components/
│   └── vehicle-card/
│       ├── vehicle-card.component.ts
│       └── vehicle-card.component.html
├── app.component.ts                 (parent : assemblage des voitures)
└── app.component.html
```

Ce qui sera observé en direct :

1. **Composition pure** — la classe `Car` reçoit son moteur par constructeur.
2. **Délégation** — le clic sur le bouton demande à la voiture de démarrer, qui délègue au moteur.
3. **Clarté Angular** — le composant utilise un signal `input.required<Car>()` sans complexité superflue.

### 6.2 Le contrat `Engine` et ses deux implémentations

```typescript
// src/app/models/engine.interface.ts
export interface Engine {
  readonly type: string;
  start(): string;
}
```

Le contrat pur impose à tout moteur de savoir démarrer et d'annoncer son type.

```typescript
// src/app/models/engines.model.ts
import { Engine } from './engine.interface';

export class ElectricEngine implements Engine {
  readonly type = 'Électrique';
  start(): string {
    return '⚡ Silence absolu... 100% couple instantané !';
  }
}

export class CombustionEngine implements Engine {
  readonly type = 'Thermique';
  constructor(private cylindres: number = 4) {}

  start(): string {
    return `🔥 Vrouuum ! Les ${this.cylindres} cylindres rugissent !`;
  }
}
```

Les deux comportements sont sonorement et techniquement distincts, sans aucun lien de parenté entre eux — seule l'interface commune les rend interchangeables.

### 6.3 Le modèle `Car` : composition par délégation

```typescript
// src/app/models/car.model.ts
import { Engine } from './engine.interface';

export class Car {
  constructor(
    public readonly brand: string,
    public readonly model: string,
    public readonly color: string,
    // « A UN » moteur — composition
    private engine: Engine
  ) {}

  get engineType(): string {
    return this.engine.type;
  }

  // Délégation de l'action
  start(): string {
    return this.engine.start();
  }
}
```

Trois points méritent d'être soulignés :

- **Pas de classe `CarElectrique`** — une seule classe `Car` suffit ; elle délègue la propulsion à l'objet `engine` injecté.
- **Encapsulation forte** — le moteur est privé ; l'extérieur demande simplement à la voiture de `start()`, sans savoir quel moteur se trouve sous le capot.
- **Évolutivité garantie** — si l'on crée demain un `HydrogenEngine`, la classe `Car` n'exige aucune retouche.

La méthode `start()` tient en une seule ligne — `return this.engine.start();` — : c'est l'essence même de la délégation.

### 6.4 Le composant enfant standalone

```typescript
// src/app/components/vehicle-card/vehicle-card.component.ts
import { Component, input, signal } from '@angular/core';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  templateUrl: './vehicle-card.component.html'
})
export class VehicleCardComponent {
  // La voiture est reçue par Signal Input
  car = input.required<Car>();
  // État local réactif : message du moteur
  engineSound = signal<string>('Moteur à l’arrêt');

  onStartCar(): void {
    // Appel de la méthode de la voiture -> délégation !
    const sound = this.car().start();
    this.engineSound.set(sound);
  }
}
```

Le composant se lit en quelques secondes : une entrée (la voiture), un état pour le son (signal), une méthode déclenchée au clic. `input.required<Car>()` exige que le parent fournisse une instance de `Car` ; `engineSound`, simple `signal('...')`, stocke la phrase renvoyée par le moteur et met à jour le template automatiquement.

### 6.5 Le template enfant

```html
<!-- src/app/components/vehicle-card/vehicle-card.component.html -->
<div [style.border-color]="car().color"
  class="p-4 rounded-xl border-2 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between">
  <div>
    <h3 class="text-lg font-bold text-slate-900 dark:text-white">
      {{ car().brand }} {{ car().model }}
    </h3>
    <span class="inline-block px-2 py-0.5 mt-1 text-[11px] font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
      Moteur : {{ car().engineType }}
    </span>
  </div>
  <div class="my-3 p-2 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 min-h-[3rem] flex items-center">
    {{ engineSound() }}
  </div>
  <button (click)="onStartCar()"
    class="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition">
    🔑 Démarrer le véhicule
  </button>
</div>
```

La chaîne de responsabilité se déroule ainsi : `(click)` → `onStartCar()` → `car().start()` → `engine.start()` → `engineSound.set(...)` → affichage. Les signaux se lisent avec des parenthèses (`car()`, `engineSound()`) ; la bordure de la carte s'illumine de la couleur réelle du véhicule grâce à la liaison `[style.border-color]`.

### 6.6 Le composant parent : l'assemblage

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { VehicleCardComponent } from './components/vehicle-card/vehicle-card.component';
import { Car } from './models/car.model';
import { ElectricEngine, CombustionEngine } from './models/engines.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VehicleCardComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Le parent ASSEMBLE les objets composites
  vehicles: Car[] = [
    new Car('Tesla', 'Model 3', '#3b82f6', new ElectricEngine()),
    new Car('Ford', 'Mustang GT', '#ef4444', new CombustionEngine(8)),
    new Car('Renault', 'Zoé', '#10b981', new ElectricEngine()),
    new Car('Porsche', '911 Carrera', '#f59e0b', new CombustionEngine(6))
  ];
}
```

```html
<!-- src/app/app.component.html -->
<main class="p-6 max-w-4xl mx-auto">
  <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-4">
    🚗 Garage Modulaire — Démonstration de la Composition
  </h1>

  <div class="grid grid-cols-12 gap-4">
    @for (v of vehicles; track $index) {
      <div class="col-span-12 sm:col-span-6 md:col-span-3">
        <app-vehicle-card [car]="v" />
      </div>
    }
  </div>
</main>
```

Quatre voitures, deux types de moteurs, des cylindrées différentes : une seule boucle `@for` et un seul composant d'affichage suffisent, chaque véhicule se comportant selon le moteur qui lui a été composé. Le composant enfant affiche fidèlement chaque voiture sans jamais avoir besoin de connaître le fonctionnement interne du moteur.

---

## Synthèse : ce qu'il faut retenir

1. **L'héritage est un engagement lourd** — il crée un lien rigide et statique, figé à la compilation, et expose la classe fille aux modifications de la classe mère.
2. **La composition est un assemblage de briques** — construire un objet en lui associant des collaborateurs évite l'explosion combinatoire des sous-classes et préserve l'encapsulation.
3. **La délégation confie le travail aux spécialistes** — la classe composite transmet l'ordre à son composant interne compétent au lieu de tout implémenter elle-même.
4. **L'interface offre le découplage suprême** — en typant les composants par des interfaces plutôt que par des classes concrètes, on permet le remplacement à chaud et l'injection de *mocks* pour les tests.
5. **En Angular, tout est composition** — l'injection de dépendances et l'assemblage de composants enfants via `input()` incarnent la composition au quotidien.

**La règle d'or de la conception :**

> « Composez ce que vos objets *font* ; héritez uniquement de ce que vos objets *sont*. »

Si la caractéristique relève d'une aptitude, d'un comportement ou d'une pièce mécanique, on compose. Si elle relève d'une essence ontologique immuable, on hérite. Par défaut, le développeur compose ; `extends` n'intervient que face à une relation « est-un » incontestable — c'est là le réflexe du développeur expérimenté.

---

## Aperçu de la séance suivante

La séance 10 abordera la gestion des exceptions et la robustesse en programmation orientée objet : le flux d'exécution exceptionnel et les blocs `try`/`catch`/`finally`, la hiérarchie des erreurs typées et la création de classes d'exception métier, la propagation et l'appel de pile (*stack unwinding*), ainsi que l'interception des erreurs applicatives en Angular pour offrir un retour utilisateur propre.
