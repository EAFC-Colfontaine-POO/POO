# Séance 14 — Services & Injection de Dépendances : Architecture Métier & Généricité TypeScript

**Cours de programmation orientée objet — Bachelier en informatique (EAFC)**  
**Stack technique : TypeScript 5+, Angular 22 (approche signal-first)**

---

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant est en mesure de :

1. **Dissocier rigoureusement Présentation et Logique Métier (SRP & SoC)** : identifier pourquoi un composant d'interface utilisateur ne doit jamais porter la gestion de la persistance, la coordination des données ou la logique métier complexe, et formaliser le rôle pivot d'un **Service** en tant que source unique de vérité (*Single Source of Truth - SSOT*).
2. **Maîtriser le patron d'Injection de Dépendances (*Dependency Injection - DI*)** : appréhender l'Inversion de Contrôle (*IoC*) et l'Inversion de Dépendance (*DIP*, Séance 11), comprendre comment le conteneur d'injection d'Angular résout automatiquement les graphes de dépendances sans instanciation sauvage par l'opérateur `new`.
3. **Comprendre la hiérarchie et la portée des Injecteurs Angular** : maîtriser la portée globale de type Singleton avec `@Injectable({ providedIn: 'root' })`, la comparer à l'instanciation locale limitée au cycle de vie d'un composant (`providers: [...]`), et choisir sciemment le périmètre de partage de l'état réactif.
4. **Adopter l'API moderne `inject()` d'Angular** : abandonner l'injection verbeuse par paramètres de constructeur au profit de la fonction native `inject()`, appréhender le concept de contexte d'injection (*injection context*) et tirer parti de sa lisibilité dans l'initialisation des champs de classe.
5. **Maîtriser les classes et interfaces génériques en TypeScript** : concevoir des structures réutilisables typées (`class Repository<T>`, `interface IRepository<T>`), appliquer des contraintes de type rigoureuses (`<T extends Identifiable>`), et proscrire définitivement le recours dangereux au type `any`.
6. **Bâtir un Service Réactif à base de Signals (*Signal-First Store*)** : encapsuler l'état mutable dans des signaux privés (`#items = signal<T[]>([])`), exposer des projections publiques non modifiables (`asReadonly()`, `computed()`), et implémenter des mutations strictement immutables respectant l'identité mémoire (Séance 12).
7. **Bâtir une architecture d'entreprise réutilisable multi-entités** : concevoir un service « Repository » générique pilotant sans duplication de code deux entités métier distinctes (`Produit` et `Client`), consommé par des composants standalone modernes via `inject()` et le nouveau flux de contrôle déclaratif (`@if`, `@for`, `@let`).

---

## Partie 00 — Le cheminement : d'où venons-nous ?

Cette quatorzième séance constitue le cœur architectural du **Bloc C**, consacré à l'ingénierie avancée sous **Angular 22** :

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
│    • S11 — Principes SOLID (S : Responsabilité, O : Extensibilité, D : DIP) │
│    • S12 — Les Objets eux-mêmes : Identité, Clonage & Immutabilité          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ⚡ BLOC C — Angular en Signal-First, Approfondissement (Séances 13 à 15)     │
│    • S13 — Composants & Signals (Primitives atomiques & Communication)      │
│    • S14 — Aujourd'hui : Services Métier, Génériques & Injection (DI)       │
│    • S15 — Signal Forms, Validation Déclarative & Routing d'Entreprise      │
└─────────────────────────────────────────────────────────────────────────────┘
```

En **Séance 13**, nous avons vu comment animer un composant graphique à l'aide des signaux réactifs (`signal`, `computed`, `input`, `output`, `model`). Cependant, nous avions confiné l'état et les données directement à l'intérieur du composant lui-même.

Ce choix pragmatique pour une démonstration locale devient une **aberration architecturale** dès que l'application grandit :
- **Que se passe-t-il si deux composants distincts ont besoin de consulter et de mettre à jour la même liste d'éléments ?** (Par exemple, un composant panier dans la barre de navigation et un catalogue de produits sur la page principale).
- **Que devient l'état lorsque l'utilisateur navigue vers une autre page ?** Le composant est détruit, et toutes ses données s'évaporent de la mémoire.
- **Comment tester la logique de calcul d'une remise ou d'un solde bancaire sans être forcé d'instancier un arbre DOM complexe ?**

La réponse de l'Orienté Objet repose sur trois piliers étudiés dans nos blocs précédents :
1. **L'Encapsulation (Séance 05)** : Isoler l'état interne et ne l'exposer qu'à travers une interface contrôlée.
2. **La Composition plutôt que l'Héritage (Séance 09)** : Un composant graphique ne *doit pas être* un gestionnaire de données ; il *possède* (`has-a`) une référence vers un gestionnaire de données auquel il délègue les opérations métier.
3. **Le Principe d'Inversion de Dépendance (DIP, Séance 11)** : Les modules de haut niveau (l'IHM) ne doivent pas créer directement leurs dépendances concrètes de bas niveau. Ils doivent recevoir leurs collaborateurs de l'extérieur.

C'est exactement la vocation des **Services** et de l'**Injection de Dépendances (DI)** sous Angular.

---

## Partie 01 — La Crise du Couplage : Pourquoi l'Injection de Dépendances ?

### 1.1 Le Piège mortel du couplage fort par l'opérateur `new`

Considérons le réflexe d'un développeur débutant qui souhaite manipuler des données métier dans un composant Angular :

```typescript
// ❌ ANTI-PATTERN MAJEUR : Le composant instancie lui-même son collaborateur
@Component({ ... })
export class PanierComponent {
  // Création rigide avec 'new'
  private readonly panierService = new PanierService();
}
```

Ce geste semble anodin. Pourtant, sur le plan de la conception logicielle, **l'utilisation de l'opérateur `new` à l'intérieur d'une classe consommatrice crée un couplage fort destructeur** :

```
┌────────────────────────────────────────────────────────────────────────┐
│               LE PIÈGE DE L'INSTANCIATION DIRECTE AVEC 'new'           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ PanierComponent ] ──( new PanierService() )──▶ [ Instance #1 ]     │
│                                                     (État : 2 articles)│
│                                                                        │
│   [ NavbarComponent ] ──( new PanierService() )──▶ [ Instance #2 ]     │
│                                                     (État : 0 article) │
│                                                                        │
│ ❌ DÉSYNCHRONISATION : Deux instances étanches en mémoire !            │
│ ❌ IMPOSSIBLE À TESTER : On ne peut pas substituer un Mock pour tester!│
│ ❌ EFFET CASCADE : Si PanierService a besoin d'autres dépendances      │
│    (ex: HttpClient, AuthService), le composant doit les fabriquer aussi!│
└────────────────────────────────────────────────────────────────────────┘
```

Les trois conséquences directes de cette erreur :
1. **Perte de l'unicité de l'état** : `PanierComponent` et `NavbarComponent` possèdent chacun leur propre boîte mémoire étanche dans le Tas (*Heap*). L'utilisateur ajoute un produit dans le panier : le composant de navigation ne le saura jamais !
2. **Intestabilité radicale** : Dans un test unitaire, vous ne pouvez pas remplacer `PanierService` par un faux service de test (*Mock* ou *Stub*) sans modifier le code source du composant.
3. **Effet boule de neige d'initialisation** : Si demain `PanierService` a besoin d'un `HttpService`, d'un `LoggerService` et d'un `ConfigurationService`, `PanierComponent` devra apprendre à instancier manuellement ces trois classes avant de pouvoir fabriquer son `PanierService`. C'est une violation flagrante du principe de responsabilité unique (SRP).

---

### 1.2 Les Deux Grandes Analogies pour Tout Comprendre

Pour ancrer la nécessité de l'Injection de Dépendances dans votre intuition technique :

#### 1. L'Analogie de l'eau courante : Le puits individuel vs Le réseau de distribution
- **Sans Injection de Dépendances (l'opérateur `new`)** : Chaque maison qui a besoin d'eau creuse son propre puits dans son jardin, achète sa propre pompe et installe son propre système de filtration. Si la nappe phréatique est polluée ou si la pompe tombe en panne, chaque maison doit reconstruire tout son système individuellement. C'est inefficace, redondant et ingérable à l'échelle d'une ville.
- **Avec l'Injection de Dépendances (DI)** : La municipalité gère une usine centrale de traitement et un réseau de canalisations. Chaque maison dispose simplement d'un robinet standardisé. Quand la maison a soif, elle ouvre le robinet (`inject(EauService)`) sans avoir à savoir comment l'eau a été acheminée ni d'où elle provient.

#### 2. L'Analogie du connecteur USB-C standardisé
- **Sans DI** : Vous achetez un clavier d'ordinateur dont les fils de cuivre sont directement soudés sur la puce processeur de la carte mère. Pour changer de clavier ou pour brancher une machine de diagnostic en atelier, vous devez dessouder l'ordinateur !
- **Avec DI** : L'ordinateur offre un port femelle USB standard. Le clavier implémente le protocole USB. Vous pouvez débrancher le vrai clavier physique et brancher un simulateur de frappe de touches pour tester votre logiciel instantanément, sans jamais modifier l'ordinateur.

```
┌────────────────────────────────────────────────────────────────────────┐
│             L'INJECTION DE DÉPENDANCES : DÉCOUPLAGE PAR CONTRAT        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Composant A ] ────┐                                                │
│                       │ Demande la dépendance                          │
│                       ▼                                                │
│              ╔═════════════════════════════════╗                       │
│              ║   CONTENEUR D'INJECTION (DI)    ║                       │
│              ║      (L'Injecteur Angular)      ║                       │
│              ╚═════════════════════════════════╝                       │
│                       ▲                                                │
│                       │ Fournit l'instance unique partagée (Singleton) │
│   [ Composant B ] ────┘                                                │
│                                                                        │
│                      ┌──────────────────────┐                          │
│                      │   Instance Unique    │                          │
│                      │  de PanierService    │                          │
│                      │ (État central partagé)│                          │
│                      └──────────────────────┘                          │
│                                                                        │
│ ✅ Une seule source de vérité pour tous les consommateurs !            │
│ ✅ Remplacement transparent par un mock lors des tests !               │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Inversion de Contrôle (IoC) & Inversion de Dépendance (DIP)

Il est capital de ne pas confondre le principe architectural et le mécanisme d'exécution :

1. **L'Inversion de Contrôle (*Inversion of Control - IoC*)** :  
   C'est le méta-principe architectural souvent résumé par la *Loi d'Hollywood* :
   > *« Ne nous appelez pas, c'est nous qui vous appellerons. »*  
   Dans un programme procédural classique, votre code pilote le déroulement du programme et instancie la machine. Dans un framework comme Angular, c'est le conteneur du framework qui pilote la machine, gère le cycle de vie des objets et injecte automatiquement les dépendances là où elles sont requises.

2. **Le Principe d'Inversion de Dépendance (*Dependency Inversion Principle - DIP*, Séance 11)** :  
   C'est la règle de conception POO :
   > *« Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. Les deux doivent dépendre d'abstractions. »*  
   L'Injection de Dépendances est l'outil technique qui permet de matérialiser concrètement le DIP au sein du code applicatif.

---

### 1.4 Tableau comparatif : Instanciation directe (`new`) vs Injection (`inject()`)

| Critère d'évaluation | Instanciation directe (`new`) | Injection de Dépendances (`inject()`) |
| :--- | :--- | :--- |
| **Lieu de décision** | Le consommateur décide de la classe concrète à instancier. | Le conteneur (l'injecteur) décide quelle instance fournir. |
| **Couplage logiciel** | **Fort** (soudé à l'implémentation concrète). | **Faible** (découplé via des abstractions ou des tokens). |
| **Gestion du cycle de vie** | Manuelle, dispersée et désynchronisée. | Centralisée par l'injecteur Angular. |
| **Partage de l'état (State)** | Impossible par défaut (chaque `new` crée un objet neuf). | Garanti de manière transparente (portée Singleton par défaut). |
| **Testabilité unitaire** | Quasiment impossible sans bidouillages complexes. | Immédiate et triviale grâce à la substitution de mocks. |
| **Maintenance & Évolution** | Un changement de constructeur casse tous les appelants. | La modification du constructeur est résolue par le conteneur. |

---

## Partie 02 — L'Architecture de l'Injecteur Angular & la Portée des Services

### 2.1 Qu'est-ce qu'un Service Angular ? Le décorateur `@Injectable`

En Angular, un **Service** est une classe TypeScript ordinaire dédiée à une responsabilité précise hors de l'affichage (calculs métier, rétention d'état, communication réseau, validation croisée).

Pour qu'Angular reconnaisse cette classe comme une dépendance gérable par son conteneur d'injection, on lui adjoint le décorateur `@Injectable()` :

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root' // 👈 La clé magique du Singleton applicatif
})
export class CompteurService {
  // État interne encapsulé (Signal privé)
  readonly #valeur = signal<number>(0);

  // Projection publique non mutable (Signal dérivé / lecture seule)
  readonly valeur = this.#valeur.asReadonly();
  readonly estPair = computed(() => this.#valeur() % 2 === 0);

  // Méthodes métier appliquant les invariants
  incrementer(): void {
    this.#valeur.update(v => v + 1);
  }

  decrementer(): void {
    if (this.#valeur() > 0) {
      this.#valeur.update(v => v - 1);
    }
  }

  reinitialiser(): void {
    this.#valeur.set(0);
  }
}
```

> [!NOTE]
> Le rôle de l'option `providedIn: 'root'` est fondamental : elle enregistre le service auprès de l'**Injecteur Racine d'Environnement** (*Root Environment Injector*). Cela confère au service deux propriétés remarquables :
> 1. **Comportement Singleton** : Une seule et unique instance de la classe `CompteurService` est instanciée pour toute la durée de vie de l'application dans le navigateur. Tous les composants qui l'injectent partageront rigoureusement la même instance mémoire.
> 2. **Élimination du code mort (*Tree-shaking*)** : Si aucun composant de votre application n'injecte `CompteurService`, le compilateur d'Angular l'évincera totalement du bundle JavaScript final de production !

---

### 2.2 La Portée des Dépendances (*Provider Scopes*) & l'Arbre Hiérarchique d'Injecteurs

L'architecture d'Angular ne possède pas un conteneur d'injection unique et plat, mais une **hiérarchie d'injecteurs en arbre** calquée sur l'arborescence des composants :

```
┌────────────────────────────────────────────────────────────────────────┐
│                  L'ARBRE DES INJECTEURS ANGULAR                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ NullInjector ]                                                     │
│          ▲ (Remonte en cas d'échec : lève l'erreur NG0203)            │
│          │                                                             │
│   [ Platform Injector ] (Services système : DomSanitizer, etc.)        │
│          ▲                                                             │
│          │                                                             │
│   [ Root Environment Injector ] ◀─── @Injectable({ providedIn: 'root' })│
│          │                                                             │
│          │ ──▶ [ Singleton Global : Instance Unique partagée ]         │
│          │                                                             │
│          ├───▶ [ Composant Racine : AppComponent ]                     │
│          │            │                                                │
│          │            ├───▶ [ PageCatalogueComponent ]                │
│          │            │                                                │
│          │            └───▶ [ WidgetPanierComponent ]                  │
│          │                                                             │
│          └───▶ [ Element Injector Local ] ◀── providers: [MonService]  │
│                       │                                                │
│                       └───▶ [ DialogueModalComponent ]                 │
│                             (Nouvelle instance isolée créée et détruite│
│                              avec la boîte de dialogue !)              │
└────────────────────────────────────────────────────────────────────────┘
```

#### Quand utiliser `providedIn: 'root'` vs `providers: [MonService]` dans `@Component` ?

1. **`providedIn: 'root'` (Recommandé dans 95% des cas)** :
   - Pour les services d'état partagé (*Stateful Stores*).
   - Pour les services de données et d'accès API (Repositories, Authentification, Panier).
   - Garantit une mémoire partagée et une consommation mémoire optimale (une seule instance).

2. **`providers: [MonService]` au niveau d'un `@Component` (Cas spécialisés)** :
   - Chaque nouvelle instance de ce composant dans le DOM créera sa **propre instance dédiée** de `MonService`.
   - Lorsque le composant est détruit (`@if` bascule à faux, ou navigation), l'instance du service est détruite et libérée par le Garbage Collector.
   - **Exemple classique** : Un formulaire d'édition complexe sous forme d'onglet ou de modale, qui a besoin d'un brouillon d'état totalement isolé ne risquant pas de contaminer les autres onglets ouverts en parallèle.

> [!WARNING]
> **Le Piège classique du junior** : Ajouter un service de panier dans les `providers: [PanierService]` de deux composants différents pensant bien faire. Résultat : chaque composant recevra sa propre instance isolée, et le panier de la barre de navigation restera désespérément vide quand le composant de catalogue ajoutera un produit !

---

### 2.3 L'Évolution Syntaxique : Le Constructeur historique vs La Révolution `inject()`

Depuis les premières versions d'Angular jusqu'à la version 14, l'injection se faisait exclusivement via les paramètres du constructeur de classe :

```typescript
// 🏛️ ANCIENNE SYNTAXE (Historique - Toujours fonctionnelle mais vieillissante)
@Component({ ... })
export class AncienCatalogueComponent {
  // Syntaxe verbeuse : paramètres avec modificateurs TypeScript
  constructor(
    private readonly catalogueService: CatalogueService,
    private readonly panierService: PanierService,
    private readonly authService: AuthService
  ) {
    // Initialisations...
  }
}
```

Depuis Angular 14 et de manière pleinement généralisée avec Angular 21/22, le framework a introduit la fonction native **`inject()`** :

```typescript
// ⚡ SYNTAXE MODERNE (Angular 22 - Approche Signal-First & Fonctionnelle)
@Component({ ... })
export class ModerneCatalogueComponent {
  // Propre, direct, lisible et parfaitement inféré
  private readonly catalogueService = inject(CatalogueService);
  private readonly panierService = inject(PanierService);
  private readonly authService = inject(AuthService);
}
```

#### Pourquoi `inject()` surpasse-t-il le constructeur ?

1. **L'Héritage sans friction (`super()`)** :  
   Dans une hiérarchie de classes POO (Séance 06), si une classe mère possède 4 dépendances dans son constructeur, toute classe fille qui hérite avec `extends` est obligée de déclarer ces 4 dépendances et de les repasser manuellement à `super(dep1, dep2, dep3, dep4)`. Avec `inject()`, la classe mère déclare ses `inject()` dans ses propres propriétés, et la classe fille n'a pas à polluer son propre constructeur !
2. **Usage dans les fonctions factory et utilitaires** :  
   `inject()` peut être appelé dans n'importe quelle fonction exécutée dans un **contexte d'injection** (*Injection Context*), par exemple pour créer des utilitaires réactifs réutilisables.
3. **Inférence de type parfaite** :  
   TypeScript déduit immédiatement le type exact de la variable sans redondance syntaxique.

> [!IMPORTANT]
> **La Règle du Contexte d'Injection** :  
> La fonction `inject()` ne peut être appelée que lors de la phase d'initialisation de l'instance (dans la déclaration d'un champ de classe, dans le constructeur ou dans une fonction factory de provider).  
> **Il est strictement interdit d'appeler `inject()` à l'intérieur d'une méthode appelée ultérieurement** (comme dans un gestionnaire de clic `onClick()` ou un callback asynchrone), sous peine de lever l'erreur d'exécution Angular :  
> `NG0203: inject() must be called from an injection context`.

---

## Partie 03 — Notions TypeScript Spécifiques : La Généricité au Service de l'OO

### 3.1 Pourquoi la Généricité ? L'Impasse de la Duplication vs l'Abîme de `any`

Imaginons que notre application doive gérer plusieurs entités métier : des `Produits`, des `Clients`, des `Commandes`. Chaque entité a besoin d'opérations fondamentales de stockage : ajouter, modifier, supprimer, lister, rechercher par identifiant (le patron *Repository*).

Face à ce besoin, trois voies s'offrent au concepteur :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LES TROIS VOIES DE L'INGÉNIERIE LOGICIELLE           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ 1. LA DUPLICATION AVEUGLE (Le copié-collé)                             │
│    ProduitRepository, ClientRepository, CommandeRepository...         │
│    ❌ Viole le principe DRY (Don't Repeat Yourself).                   │
│    ❌ Si l'algorithme de filtrage change, il faut corriger N fichiers. │
│                                                                        │
│ 2. L'ABANDON DU TYPAGE (Le recours destructeur à 'any')                │
│    class UniversalRepository { items: any[] = []; }                    │
│    ❌ Perte de l'autocomplétion et du contrôle à la compilation.       │
│    ❌ Erreurs de frappe non détectées, plantages inattendus au runtime.│
│                                                                        │
│ 3. LA GÉNÉRICITÉ TYPÉE (La solution d'excellence POO)                  │
│    class Repository<T extends Identifiable> { items: signal<T[]>; }    │
│    ✅ Code algorithmique écrit une seule fois !                        │
│    ✅ Sécurité absolue du compilateur TypeScript !                     │
│    ✅ IntelliSense contextuel complet pour chaque type concret !       │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Anatomie d'une Classe Générique : Le Paramètre de Type (`<T>`)

Un type générique est un type qui accepte un ou plusieurs **paramètres de type** (conventionnellement notés `T` pour *Type*, `K` pour *Key*, `V` pour *Value*, `E` pour *Element*). C'est un gabarit (*template*) de classe :

```typescript
// Définition d'un conteneur générique
export class Boite<T> {
  #contenu: T;

  constructor(valeurInitiale: T) {
    this.#contenu = valeurInitiale;
  }

  obtenir(): T {
    return this.#contenu;
  }

  remplacer(nouvelleValeur: T): void {
    this.#contenu = nouvelleValeur;
  }
}

// Utilisation avec des types concrets différents :
const boiteNombre = new Boite<number>(42);
const valeurNum: number = boiteNombre.obtenir(); // Type 'number' garanti !

const boiteTexte = new Boite<string>("Bonjour EAFC");
const valeurStr: string = boiteTexte.obtenir();  // Type 'string' garanti !
```

---

### 3.3 Les Contraintes de Types avec `extends` (*Generic Constraints*)

Dans un conteneur purement abstrait comme `Boite<T>`, le type `T` peut être absolument n'importe quoi (un nombre, un booléen, une fonction).

Cependant, dans un gestionnaire de données métier (*Repository*), nous avons besoin d'accéder à certaines propriétés vitales de l'objet, par exemple son identifiant unique `id` pour effectuer une suppression ou une mise à jour.

Si nous écrivons naïvement :

```typescript
// ❌ ERREUR DE COMPILATION TYPESCRIPT
export class Repository<T> {
  private items: T[] = [];

  supprimer(id: number): void {
    // 💥 Erreur TS2339 : Property 'id' does not exist on type 'T'.
    this.items = this.items.filter(item => item.id !== id);
  }
}
```

TypeScript refuse légitimement de compiler ce code : comme `T` peut être `string` ou `boolean`, il n'a aucune garantie que `item.id` existe !

La solution consiste à poser une **contrainte générique** à l'aide du mot-clé `extends` :

```typescript
// 1. Définition du contrat minimal requis
export interface Identifiable {
  readonly id: number | string;
}

// 2. Déclaration de la classe générique sous contrainte
// « T peut être n'importe quelle classe, à condition qu'elle implémente Identifiable »
export class Repository<T extends Identifiable> {
  // Le compilateur SAIT avec certitude que chaque T possède un 'id' !
  supprimerParId(id: T['id']): void {
    // ✅ Valide et rigoureusement typé !
  }
}
```

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LA CONTRAINTE GÉNÉRIQUE EN ACTION                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                     ┌───────────────────────────┐                      │
│                     │   interface Identifiable  │                      │
│                     │   { id: number | string } │                      │
│                     └─────────────▲─────────────┘                      │
│                                   │                                    │
│                   ┌───────────────┴───────────────┐                    │
│                   │                               │                    │
│        ┌─────────────────────┐         ┌─────────────────────┐         │
│        │    class Produit    │         │    class Client     │         │
│        │  id: number         │         │  id: string         │         │
│        │  nom: string        │         │  email: string      │         │
│        │  prix: number       │         │  points: number     │         │
│        └─────────────────────┘         └─────────────────────┘         │
│                   ▲                               ▲                    │
│                   │ ✅ Autorisé                   │ ✅ Autorisé        │
│       ╔═════════════════════════════════════════════════════════╗      │
│       ║           class Repository<T extends Identifiable>      ║      │
│       ╚═════════════════════════════════════════════════════════╝      │
│                   ▲                                                    │
│                   │ ❌ REFUSÉ : boolean ne possède pas 'id' !           │
│        ┌─────────────────────┐                                         │
│        │   boolean / number  │                                         │
│        └─────────────────────┘                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Les Types Utilitaires associés (`Partial<T>`, `Readonly<T>`)

TypeScript fournit des types utilitaires intégrés extrêmement puissants lorsqu'ils sont combinés à la généricité :

1. **`Partial<T>`** : Rend toutes les propriétés de `T` optionnelles. Idéal pour une méthode de mise à jour partielle :
   ```typescript
   // On ne transmet que les champs que l'on souhaite mettre à jour !
   mettreAJour(id: T['id'], modifications: Partial<T>): void
   ```
2. **`Readonly<T>`** : Protège l'objet contre toute mutation directe de ses champs.
3. **`T['id']` (Lookup Type)** : Permet d'extraire dynamiquement le type exact de l'identifiant (que ce soit un `number`, un `string` ou un UUID personnalisé).

---

## Partie 04 — Le Patron *Stateful Service* : Services Métier & Signals

### 4.1 L'Architecture Store Réactif en Signaux (*Signal-First Store*)

Comment orchestrer l'état dans un service moderne sous Angular 22 ? En combinant l'**Encapsulation stricte (Séance 05)** et les **Signaux (Séance 13)** :

```
┌────────────────────────────────────────────────────────────────────────┐
│             L'ARCHITECTURE DU SERVICE EN SIGNAUX (STORE POO)           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ MonService Métier (@Injectable)                                │   │
│   │                                                                │   │
│   │  [PRIVÉ]   #items = signal<T[]>([...]) 🔒 (Source de Vérité)   │   │
│   │               │                                                │   │
│   │  [PUBLIC]     ├──▶ items = #items.asReadonly() 👁️              │   │
│   │               │    (Exposé aux composants en lecture seule)    │   │
│   │               │                                                │   │
│   │               └──▶ total = computed(() => #items().length) 🧮  │   │
│   │                    (Projection réactive calculée)              │   │
│   │                                                                │   │
│   │  [MÉTHODES] ajouter(elem), supprimer(id), modifier(id, patch)  │   │
│   │             (Seules portes d'entrée pour muter l'état !)       │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                      ▲                               │                 │
│         Appels des   │                               │ Notifications   │
│         méthodes     │                               │ automatiques    │
│                      │                               ▼                 │
│             [ Composant A (IHM) ]           [ Composant B (IHM) ]      │
└────────────────────────────────────────────────────────────────────────┘
```

Cette architecture résout le problème de l'état partagé de façon élégante :
- **Protection des invariants** : Aucun composant externe ne peut exécuter `service.items.set([])` à l'insu du service. Le composant n'a accès qu'à `asReadonly()`.
- **Transitions d'état contrôlées** : Les modifications de l'état passent obligatoirement par des méthodes métier du service (`ajouter`, `supprimer`), qui peuvent valider les règles métier, lever des exceptions typées (Séance 10) ou persister les données.
- **Réactivité chirurgicale** : Dès que `#items` est mis à jour, tous les composants abonnés dans le DOM s'actualisent instantanément sans détection de changement globale.

---

### 4.2 Immutabilité et Transitions d'État dans le Service

Rappelons la leçon cruciale de la **Séance 12 (Les Objets eux-mêmes)** :  
*Angular Signals compare la nouvelle valeur à l'ancienne via `Object.is()`. Si la référence mémoire ne change pas, le signal considère qu'il n'y a aucun changement et n'avertit aucun consommateur !*

Par conséquent, à l'intérieur de notre service, nous ne devons **JAMAIS** muter la collection en place avec `.push()`, `.splice()` ou `.pop()` :

```typescript
// ❌ CATASTROPHE RÉACTIVE : Mutation en place dans le Tas
this.#items().push(nouvelItem); // Même adresse mémoire !
this.#items.set(this.#items()); // Object.is(ref, ref) === true ➔ AUCUN RAFRAÎCHISSEMENT DOM !

// ✅ IMMUTABILITÉ POO : Production délibérée d'un nouveau tableau
this.#items.update(listeActuelle => [...listeActuelle, nouvelItem]);

// ✅ MODIFICATION IMMUTABLE : Remplacement par projection .map()
this.#items.update(liste =>
  liste.map(item => item.id === id ? { ...item, ...modifications } : item)
);

// ✅ SUPPRESSION IMMUTABLE : Remplacement par filtrage .filter()
this.#items.update(liste => liste.filter(item => item.id !== id));
```

---

### 4.3 Séparation des Responsabilités : Composant vs Service

Pour garantir un code propre conforme à l'esprit SOLID (Séance 11), voici la grille de répartition absolue des rôles :

| Préoccupation logicielle | Doit résider dans le **Composant** | Doit résider dans le **Service** |
| :--- | :---: | :---: |
| Définition de la vue HTML et du style CSS | ✅ Oui | ❌ Jamais |
| Capture des événements DOM (`(click)`, `(submit)`) | ✅ Oui | ❌ Jamais |
| Formatage d'affichage local (ouvrir/fermer un accordéon) | ✅ Oui | ❌ Jamais |
| Stockage central de la collection de données | ❌ Jamais | ✅ Oui |
| Calculs métier partagés (chiffre d'affaires, remises) | ❌ Jamais | ✅ Oui |
| Appels réseau HTTP ou stockage local (Dexie/IndexedDB) | ❌ Jamais | ✅ Oui |
| Validation des règles métier et invariants | ❌ Jamais | ✅ Oui |
| Déclenchement de notifications ou d'audits | ❌ Jamais | ✅ Oui |

---

## Partie 05 — Pièges Fréquents & Anti-Patterns des Développeurs Juniors

### 5.1 Piège 1 : Instancier un service injectable avec l'opérateur `new`
- **Le code fautif** :
  ```typescript
  export class MonComposant {
    private service = new MonService(); // ❌ Court-circuite la DI d'Angular !
  }
  ```
- **Pourquoi c'est grave** : Le service perd son caractère de Singleton, ne peut pas injecter d'autres dépendances via `inject()`, et l'état n'est plus partagé avec le reste de l'application.
- **La correction** :
  ```typescript
  export class MonComposant {
    private readonly service = inject(MonService); // ✅ Conforme
  }
  ```

---

### 5.2 Piège 2 : Exposer directement un Signal mutable (`WritableSignal`)
- **Le code fautif** :
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class PanierService {
    public articles = signal<Article[]>([]); // ❌ WritableSignal public !
  }
  ```
- **Pourquoi c'est grave** : N'importe quel composant peut faire `this.panierService.articles.set([])` ou `articles.update(...)` de n'importe où, court-circuitant toutes les vérifications de stock et brisant l'encapsulation (Séance 05).
- **La correction** :
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class PanierService {
    readonly #articles = signal<Article[]>([]);
    public readonly articles = this.#articles.asReadonly(); // ✅ Lecture seule
  }
  ```

---

### 5.3 Piège 3 : La fausse isolation via `providers: [...]` dans le composant
- **Le code fautif** : Déclarer systématiquement le service dans le tableau `providers` du décorateur `@Component`.
- **Pourquoi c'est grave** : Chaque occurrence du composant dans l'application crée sa propre copie du service. Si vous avez une vue maître-détail découpée en deux composants, ils ne partageront pas les données !
- **La règle d'or** : Laissez `@Injectable({ providedIn: 'root' })` s'occuper de la portée sauf si vous voulez explicitement détruire l'état avec la fermeture du composant.

---

### 5.4 Piège 4 : Les dépendances circulaires (*Circular Dependencies*)
- **Le scénario** : `CommandeService` injecte `FactureService`, et `FactureService` injecte `CommandeService`.
- **Pourquoi c'est grave** : L'injecteur d'Angular entre dans une boucle infinie lors de la résolution de l'arbre de dépendance et lève une erreur critique d'instanciation.
- **Diagnostic architectural** : C'est le symptôme direct d'une violation du principe de responsabilité unique (SRP). Une des deux classes en fait trop, ou une troisième classe médiatrice (ex. `FacturationOrchestratorService`) doit être extraite.

---

### 5.5 Piège 5 : Confondre Généricité et Type `any`
- **Le code fautif** : Déclarer `class DataService<T = any>` et forcer des transtypages avec `as any`.
- **Pourquoi c'est grave** : Vous perdez tout le bénéfice du système de types de TypeScript. Les erreurs surviendront en production chez l'utilisateur au lieu d'être arrêtées par le compilateur.
- **La correction** : Toujours contraindre vos génériques avec des interfaces explicites (`<T extends Identifiable>`).

---

### 5.6 Les 5 Commandements de l'Injection de Dépendances et de la Généricité

```
┌────────────────────────────────────────────────────────────────────────┐
│   LES 5 COMMANDEMENTS DE L'INJECTION & DE LA GÉNÉRICITÉ EN POO         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. 🚫 JAMAIS 'new' sur un service injectable tu n'utiliseras.          │
│    (Laisse l'injecteur Angular gouverner le cycle de vie via inject()).│
│                                                                        │
│ 2. 🛡️ TON ÉTAT RÉACTIF toujours en privé tu encapsuleras.             │
│    (Le signal mutable est privé (#items), seule la projection          │
│     asReadonly() ou computed() est publique).                          │
│                                                                        │
│ 3. 🧊 L'IMMUBILITÉ MÉMOIRE scrupuleusement tu respecteras.             │
│    (Chaque mutation d'état produit une nouvelle référence de tableau   │
│     via update() et le spread operator [...], jamais de .push()).      │
│                                                                        │
│ 4. 🧬 TES CONTRATS GÉNÉRIQUES rigoureusement tu contraindras.          │
│    (Préfère toujours <T extends Identifiable> à l'illusion de any).    │
│                                                                        │
│ 5. ✂️ COMPOSANT ET SERVICE strictement tu sépareras.                   │
│    (Au composant l'IHM et l'interaction ; au service l'état,           │
│     le calcul métier et la persistance).                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Partie 06 — Démonstration Angular Complète : La Plateforme Multi-Entités (*NexusStore*)

Mettons en pratique l'ensemble de ces concepts dans une architecture d'entreprise concrète et fonctionnelle sous Angular 22 : le système de gestion **NexusStore**.

Ce projet démontre comment un **unique service Repository générique réactif** est réutilisé pour piloter simultanément deux entités métier totalement dissemblables :
- Les **Produits** du catalogue (prix, stocks, alertes de réapprovisionnement).
- Les **Clients** de l'enseigne (points de fidélité, statut VIP, historique).

```
┌────────────────────────────────────────────────────────────────────────┐
│               ARCHITECTURE TECHNIQUE DU PROJET NEXUSSTORE              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│            [ Contrat Générique : interface Identifiable ]              │
│                       ▲                          ▲                     │
│                       │                          │                     │
│              [ Entité Produit ]          [ Entité Client ]             │
│                                                                        │
│       ╔═════════════════════════════════════════════════════════╗      │
│       ║      Classe Générique Abstraite : BaseRepository<T>     ║      │
│       ║  • #items = signal<T[]>([]) (État réactif privé)        ║      │
│       ║  • items = #items.asReadonly() (Projection publique)    ║      │
│       ║  • count = computed(() => #items().length)              ║      │
│       ║  • Méthodes CRUD immutables : ajouter, modifier, etc.   ║      │
│       ╚═════════════════════════════════════════════════════════╝      │
│                       ▲                          ▲                     │
│        Hérite / Compose│                          │Hérite / Compose    │
│                       │                          │                     │
│         [ ProduitService ]                    [ ClientService ]        │
│         @Injectable(root)                     @Injectable(root)        │
│         + computed(valeurTotaleStock)         + computed(clientsVIP)   │
│                       ▲                          ▲                     │
│               inject()│                  inject()│                     │
│                       │                          │                     │
│       ╔═════════════════════════════════════════════════════════╗      │
│       ║           Composant Maître : NexusDashboardComponent    ║      │
│       ║             Consomme les deux services via DI           ║      │
│       ║        Vue intégrée avec flux de contrôle moderne       ║      │
│       ╚═════════════════════════════════════════════════════════╝      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 6.1 Étape 1 : Le Contrat d'Interface Générique (`identifiable.model.ts`)

Nous définissons le contrat fondamental qui servira de contrainte générique pour notre architecture de persistance :

```typescript
// src/app/core/models/identifiable.model.ts

/**
 * Contrat fondamental imposant la présence d'un identifiant unique.
 * Toute entité souhaitant bénéficier du Repository générique doit honorer ce contrat.
 */
export interface Identifiable {
  readonly id: number | string;
}

/**
 * Type utilitaire extrayant le type de l'identifiant pour une entité donnée.
 */
export type EntityId<T extends Identifiable> = T['id'];
```

---

### 6.2 Étape 2 : Les Deux Entités Métier Spécifiques (`nexus.models.ts`)

Voici nos deux entités métier. Remarquez la richesse de leur modélisation POO avec leurs constructeurs et leurs méthodes métier :

```typescript
// src/app/core/models/nexus.models.ts
import { Identifiable } from './identifiable.model';

export type CategorieProduit = 'Informatique' | 'Bureautique' | 'Mobilier' | 'Audio';

/**
 * Entité Métier 1 : Produit du catalogue
 */
export class Produit implements Identifiable {
  constructor(
    public readonly id: number,
    public nom: string,
    public categorie: CategorieProduit,
    public prixUnitaire: number,
    public stock: number
  ) {
    if (prixUnitaire < 0) throw new Error("Le prix unitaire ne peut être négatif.");
    if (stock < 0) throw new Error("Le stock ne peut être négatif.");
  }

  /**
   * Calcul de la valeur marchande du stock de cet article.
   */
  get valeurTotaleStock(): number {
    return this.prixUnitaire * this.stock;
  }

  /**
   * Règle métier : l'article nécessite-t-il une commande urgente ?
   */
  get estEnAlerteRupture(): boolean {
    return this.stock <= 5;
  }
}

export type StatutClient = 'Standard' | 'Premium' | 'VIP';

/**
 * Entité Métier 2 : Client de la plateforme
 */
export class Client implements Identifiable {
  constructor(
    public readonly id: string, // Notez l'ID sous forme de chaîne (UUID / Code client)
    public nomComplet: string,
    public email: string,
    public pointsFidelite: number,
    public statut: StatutClient
  ) {
    if (!email.includes('@')) throw new Error("Format d'adresse courriel invalide.");
    if (pointsFidelite < 0) throw new Error("Les points de fidélité doivent être positifs.");
  }

  /**
   * Règle métier : attribution d'un bonus d'achat
   */
  crediterPoints(montantAchat: number): void {
    const nouveauxPoints = Math.floor(montantAchat / 10);
    this.pointsFidelite += nouveauxPoints;
    this.actualiserStatut();
  }

  private actualiserStatut(): void {
    if (this.pointsFidelite >= 1000) {
      this.statut = 'VIP';
    } else if (this.pointsFidelite >= 300) {
      this.statut = 'Premium';
    } else {
      this.statut = 'Standard';
    }
  }
}
```

---

### 6.3 Étape 3 : Le Service Repository Générique Réactif (`generic-repository.service.ts`)

Voici le joyau architectural de notre séance : une classe générique réutilisable encapsulant la logique d'état et de manipulation réactive avec les Signals :

```typescript
// src/app/core/services/generic-repository.service.ts
import { signal, computed, Signal } from '@angular/core';
import { Identifiable, EntityId } from '../models/identifiable.model';

/**
 * Classe de base générique pour la gestion réactive d'une collection d'entités.
 * Encapsule un Store Signal-First immuable.
 */
export abstract class GenericRepository<T extends Identifiable> {
  // 1. ÉTAT INTERNE PRIVÉ (Source unique de vérité)
  readonly #items = signal<T[]>([]);

  // 2. PROJECTIONS PUBLIQUES EN LECTURE SEULE
  public readonly items: Signal<T[]> = this.#items.asReadonly();

  // Compteur réactif dérivé mémorisé (glitch-free)
  public readonly totalElements = computed(() => this.#items().length);

  // Vérification réactive de collection vide
  public readonly estVide = computed(() => this.#items().length === 0);

  /**
   * Constructeur protégé recevant optionnellement un jeu de données initial.
   */
  protected constructor(donneesInitiales: T[] = []) {
    this.#items.set([...donneesInitiales]);
  }

  /**
   * Recherche unitaire par identifiant.
   */
  public trouverParId(id: EntityId<T>): T | undefined {
    return this.#items().find(item => item.id === id);
  }

  /**
   * Ajoute une nouvelle entité en garantissant l'unicité de son ID.
   */
  public ajouter(nouvelElement: T): void {
    if (this.trouverParId(nouvelElement.id)) {
      throw new Error(`Conflit d'intégrité : Une entité avec l'ID ${nouvelElement.id} existe déjà.`);
    }

    // Mise à jour immutable par création d'une nouvelle référence de tableau
    this.#items.update(liste => [...liste, nouvelElement]);
  }

  /**
   * Supprime une entité par son identifiant.
   */
  public supprimer(id: EntityId<T>): boolean {
    const elementExiste = this.trouverParId(id) !== undefined;
    if (!elementExiste) {
      return false;
    }

    // Filtrage immutable : produit un nouveau tableau dans le Tas
    this.#items.update(liste => liste.filter(item => item.id !== id));
    return true;
  }

  /**
   * Met à jour une entité existante de manière immuable.
   */
  public mettreAJour(id: EntityId<T>, miseAJourFn: (existant: T) => T): void {
    this.#items.update(liste =>
      liste.map(item => {
        if (item.id === id) {
          const modifie = miseAJourFn(item);
          // Garantir que l'identifiant n'a pas été corrompu par la fonction de mise à jour
          if (modifie.id !== id) {
            throw new Error("Violation d'invariant : L'ID d'une entité ne peut pas être altéré.");
          }
          return modifie;
        }
        return item;
      })
    );
  }

  /**
   * Vide intégralement le référentiel.
   */
  public vider(): void {
    this.#items.set([]);
  }
}
```

---

### 6.4 Étape 4 : Les Services Métier Spécialisés Injectables

Chaque service métier hérite du `GenericRepository<T>` et s'enregistre comme Singleton dans l'injecteur racine d'Angular via `@Injectable({ providedIn: 'root' })`. Il peut ensuite enrichir son comportement avec des signaux calculés et des règles propres à son domaine :

#### 1. Le Service Catalogue Produits (`produit.service.ts`)

```typescript
// src/app/core/services/produit.service.ts
import { Injectable, computed } from '@angular/core';
import { GenericRepository } from './generic-repository.service';
import { Produit } from '../models/nexus.models';

@Injectable({
  providedIn: 'root' // Singleton d'application
})
export class ProduitService extends GenericRepository<Produit> {
  constructor() {
    // Jeu de test initial représentatif
    super([
      new Produit(101, 'Clavier Mécanique Sans Fil', 'Informatique', 129.99, 14),
      new Produit(102, 'Écran 4K 27 Pouces IPS', 'Informatique', 449.00, 3),
      new Produit(103, 'Casque Audio ANC Haute-Fidélité', 'Audio', 199.50, 2),
      new Produit(104, 'Fauteuil Ergonomique Pro', 'Mobilier', 380.00, 8),
      new Produit(105, 'Lampe de Bureau LED Smart', 'Bureautique', 45.00, 1)
    ]);
  }

  // --- CALCULS RÉACTIFS PROPRES AU DOMAINE DES PRODUITS ---

  /**
   * Valeur financière totale du stock de l'entreprise (somme réactive).
   */
  public readonly valeurTotaleInventaire = computed(() =>
    this.items().reduce((total, p) => total + p.valeurTotaleStock, 0)
  );

  /**
   * Liste dynamique des produits en rupture imminente (stock <= 5).
   */
  public readonly alertesRupture = computed(() =>
    this.items().filter(p => p.estEnAlerteRupture)
  );

  /**
   * Réapprovisionnement d'un produit (méthode métier).
   */
  public reapprovisionner(id: number, quantite: number): void {
    if (quantite <= 0) throw new Error("La quantité de réapprovisionnement doit être positive.");
    
    this.mettreAJour(id, produitExistant => 
      new Produit(
        produitExistant.id,
        produitExistant.nom,
        produitExistant.categorie,
        produitExistant.prixUnitaire,
        produitExistant.stock + quantite
      )
    );
  }
}
```

#### 2. Le Service Clientèle (`client.service.ts`)

```typescript
// src/app/core/services/client.service.ts
import { Injectable, computed } from '@angular/core';
import { GenericRepository } from './generic-repository.service';
import { Client } from '../models/nexus.models';

@Injectable({
  providedIn: 'root' // Singleton d'application
})
export class ClientService extends GenericRepository<Client> {
  constructor() {
    super([
      new Client('CLI-001', 'Alice Dupont', 'alice.dupont@eafc.be', 1250, 'VIP'),
      new Client('CLI-002', 'Benoît Marcq', 'benoit.marcq@eafc.be', 450, 'Premium'),
      new Client('CLI-003', 'Chloé Martin', 'chloe.martin@eafc.be', 80, 'Standard'),
      new Client('CLI-004', 'David Laurent', 'david.laurent@eafc.be', 1100, 'VIP')
    ]);
  }

  // --- CALCULS RÉACTIFS PROPRES AU DOMAINE CLIENTÈLE ---

  /**
   * Nombre de clients ayant acquis le statut prestigieux VIP.
   */
  public readonly totalVIP = computed(() =>
    this.items().filter(c => c.statut === 'VIP').length
  );

  /**
   * Moyenne réactive des points de fidélité accordés.
   */
  public readonly moyennePointsFidelite = computed(() => {
    const liste = this.items();
    if (liste.length === 0) return 0;
    const cumul = liste.reduce((acc, c) => acc + c.pointsFidelite, 0);
    return Math.round(cumul / liste.length);
  });

  /**
   * Enregistre un achat client et ajuste ses points automatiquement.
   */
  public enregistrerAchat(clientId: string, montant: number): void {
    this.mettreAJour(clientId, clientExistant => {
      // Cloner pour respecter l'immutabilité de référence
      const clientCopie = new Client(
        clientExistant.id,
        clientExistant.nomComplet,
        clientExistant.email,
        clientExistant.pointsFidelite,
        clientExistant.statut
      );
      clientCopie.crediterPoints(montant);
      return clientCopie;
    });
  }
}
```

---

### 6.5 Étape 5 : Le Composant Maître Standalone (`nexus-dashboard.component.ts`)

Admirons la concision et la pureté du composant graphique. Grâce à l'injection de dépendances moderne via `inject()`, le composant ne contient **aucune ligne d'infrastructure de stockage** : il compose simplement ses services métiers et leur délègue l'action !

```typescript
// src/app/features/dashboard/nexus-dashboard.component.ts
import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { ProduitService } from '../../core/services/produit.service';
import { ClientService } from '../../core/services/client.service';
import { Produit, Client } from '../../core/models/nexus.models';

@Component({
  selector: 'app-nexus-dashboard',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './nexus-dashboard.component.html',
  styleUrls: ['./nexus-dashboard.component.css']
})
export class NexusDashboardComponent {
  // 💉 INJECTION MODERNE DES SERVICES MÉTIER (Zéro paramètre de constructeur !)
  protected readonly produitService = inject(ProduitService);
  protected readonly clientService = inject(ClientService);

  // État local réservé strictement à l'IHM (onglet actif, message flash)
  protected readonly ongletActif = signal<'produits' | 'clients'>('produits');
  protected readonly messageInfo = signal<string | null>(null);

  changerOnglet(onglet: 'produits' | 'clients'): void {
    this.ongletActif.set(onglet);
  }

  // --- ACTIONS DÉLÉGUÉES AU PRODUIT_SERVICE ---

  reapprovisionnerRapide(produit: Produit): void {
    try {
      this.produitService.reapprovisionner(produit.id, 5);
      this.notifier(`Réapprovisionnement de 5 unités effectué pour : ${produit.nom}`);
    } catch (err: unknown) {
      this.notifier(`Erreur : ${(err as Error).message}`);
    }
  }

  supprimerProduit(id: number): void {
    if (confirm("Confirmez-vous la suppression de ce produit ?")) {
      this.produitService.supprimer(id);
      this.notifier(`Article #${id} supprimé du catalogue.`);
    }
  }

  // --- ACTIONS DÉLÉGUÉES AU CLIENT_SERVICE ---

  simulerAchatClient(client: Client): void {
    this.clientService.enregistrerAchat(client.id, 250);
    this.notifier(`Achat de 250 € simulé pour ${client.nomComplet} (+25 points) !`);
  }

  supprimerClient(id: string): void {
    if (confirm("Confirmez-vous la radiation de ce compte client ?")) {
      this.clientService.supprimer(id);
      this.notifier(`Compte client ${id} supprimé.`);
    }
  }

  private notifier(msg: string): void {
    this.messageInfo.set(msg);
    setTimeout(() => this.messageInfo.set(null), 3500);
  }
}
```

---

### 6.6 Étape 6 : Le Template HTML Réactif (`nexus-dashboard.component.html`)

Le template HTML exploite le nouveau flux de contrôle déclaratif natif d'Angular 22 (`@if`, `@for`, `@let`) pour consommer les signaux directement, avec une lisibilité maximale :

```html
<!-- src/app/features/dashboard/nexus-dashboard.component.html -->
<div class="dashboard-container">

  <!-- EN-TÊTE ET NOTIFICATIONS -->
  <header class="dashboard-header">
    <div class="brand">
      <h1>🚀 NexusStore Enterprise</h1>
      <p class="subtitle">Architecture POO Générique & Injection de Dépendances</p>
    </div>

    <!-- BANDEAU RÉACTIF FLASH -->
    @if (messageInfo(); as message) {
      <div class="alert-banner animate-fade">
        ℹ️ {{ message }}
      </div>
    }
  </header>

  <!-- CARTES KPI GLOBALES (Composent les signaux des deux services) -->
  <section class="kpi-grid">
    <div class="kpi-card blue">
      <span class="kpi-title">Articles au Catalogue</span>
      <span class="kpi-value">{{ produitService.totalElements() }}</span>
      <span class="kpi-detail">En inventaire</span>
    </div>

    <div class="kpi-card green">
      <span class="kpi-title">Valeur Marchande du Stock</span>
      <span class="kpi-value">{{ produitService.valeurTotaleInventaire() | currency:'EUR':'symbol':'1.2-2' }}</span>
      <span class="kpi-detail">Valorisation globale</span>
    </div>

    <div class="kpi-card amber">
      <span class="kpi-title">Alertes Rupture</span>
      <span class="kpi-value">{{ produitService.alertesRupture().length }}</span>
      <span class="kpi-detail">Stocks critiques (&le; 5)</span>
    </div>

    <div class="kpi-card purple">
      <span class="kpi-title">Clients Enregistrés</span>
      <span class="kpi-value">{{ clientService.totalElements() }}</span>
      <span class="kpi-detail">Dont {{ clientService.totalVIP() }} VIP</span>
    </div>
  </section>

  <!-- NAVIGATION PAR ONGLETS -->
  <nav class="tabs-nav">
    <button 
      class="tab-btn" 
      [class.active]="ongletActif() === 'produits'"
      (click)="changerOnglet('produits')">
      📦 Gestion Catalogue ({{ produitService.totalElements() }})
    </button>
    <button 
      class="tab-btn" 
      [class.active]="ongletActif() === 'clients'"
      (click)="changerOnglet('clients')">
      👥 Gestion Clientèle ({{ clientService.totalElements() }})
    </button>
  </nav>

  <!-- VUE 1 : CATALOGUE DE PRODUITS -->
  @if (ongletActif() === 'produits') {
    <section class="table-section">
      <h2>Inventaire des Produits Réactifs</h2>

      @if (produitService.estVide()) {
        <p class="empty-msg">Aucun produit dans le catalogue.</p>
      } @else {
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Désignation</th>
              <th>Catégorie</th>
              <th>Prix Unitaire</th>
              <th>Stock</th>
              <th>Valorisation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (prod of produitService.items(); track prod.id) {
              <!-- Variable locale réactive avec @let -->
              @let rupture = prod.estEnAlerteRupture;

              <tr [class.row-warning]="rupture">
                <td>#{{ prod.id }}</td>
                <td class="font-bold">{{ prod.nom }}</td>
                <td><span class="badge">{{ prod.categorie }}</span></td>
                <td>{{ prod.prixUnitaire | currency:'EUR':'symbol':'1.2-2' }}</td>
                <td>
                  <span class="stock-pill" [class.danger]="rupture">
                    {{ prod.stock }} unité(s)
                  </span>
                </td>
                <td>{{ prod.valeurTotaleStock | currency:'EUR':'symbol':'1.2-2' }}</td>
                <td class="action-cell">
                  <button class="btn-sm btn-info" (click)="reapprovisionnerRapide(prod)">
                    +5 Stock
                  </button>
                  <button class="btn-sm btn-danger" (click)="supprimerProduit(prod.id)">
                    Supprimer
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  }

  <!-- VUE 2 : RÉPERTOIRE DES CLIENTS -->
  @if (ongletActif() === 'clients') {
    <section class="table-section">
      <h2>Annuaire des Comptes Clients</h2>

      @if (clientService.estVide()) {
        <p class="empty-msg">Aucun client enregistré.</p>
      } @else {
        <table class="data-table">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom & Prénom</th>
              <th>Courriel</th>
              <th>Fidélité</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (cli of clientService.items(); track cli.id) {
              <tr>
                <td class="code">{{ cli.id }}</td>
                <td class="font-bold">{{ cli.nomComplet }}</td>
                <td>{{ cli.email }}</td>
                <td>⭐ {{ cli.pointsFidelite }} pts</td>
                <td>
                  <span class="badge" [class.vip]="cli.statut === 'VIP'" [class.premium]="cli.statut === 'Premium'">
                    {{ cli.statut }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="btn-sm btn-success" (click)="simulerAchatClient(cli)">
                    💳 +250€ Achat
                  </button>
                  <button class="btn-sm btn-danger" (click)="supprimerClient(cli.id)">
                    Radier
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  }

</div>
```

---

### 6.7 Scénario d'Exécution Pas à Pas & Analyse Architecturale

Traçons rigoureusement les événements qui se déroulent dans la mémoire et dans l'Injecteur lors de l'interaction utilisateur :

```
┌────────────────────────────────────────────────────────────────────────┐
│               TRACÉ D'EXÉCUTION LORS DU CLIC « +5 STOCK »              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. L'utilisateur clique sur le bouton « +5 Stock » du produit #102.    │
│ 2. Le template déclenche l'événement : (click)="reapprovisionner(prod)"│
│ 3. NexusDashboardComponent délègue à :                                 │
│    produitService.reapprovisionner(102, 5)                             │
│ 4. ProduitService (Singleton) appelle en interne la méthode héritée :  │
│    this.mettreAJour(102, fn)                                           │
│ 5. Le GenericRepository exécute :                                      │
│    this.#items.update(liste => liste.map(...))                         │
│ 6. Un nouveau tableau d'articles est instancié dans le Tas.            │
│    L'ancien produit #102 (stock: 3) est remplacé par un nouveau        │
│    Produit (stock: 8).                                                 │
│ 7. Le signal source #items notifie ses dépendances dans le DAG :       │
│    • items() change de référence.                                      │
│    • totalElements() ne change pas (longueur identique ➔ pas de calcul)│
│    • valeurTotaleInventaire() se recalcule instantanément.             │
│    • alertesRupture() recalcule son filtre (l'article 102 en sort !).  │
│ 8. Angular met à jour chirurgicalement les nœuds du DOM :              │
│    • La carte KPI "Valeur Marchande du Stock" s'actualise.             │
│    • La ligne du produit 102 perd sa classe d'alerte rouge.            │
│    • Le badge de stock affiche « 8 unité(s) ».                         │
│    • AUCUNE autre partie de l'IHM n'est recalculée !                   │
└────────────────────────────────────────────────────────────────────────┘
```

**Bilan architectural** :
- **Zéro duplication de code** : L'algorithme de stockage, de recherche, de mise à jour et de suppression est écrit une seule fois dans `GenericRepository<T>`.
- **Typage strict garanti** : `produitService.items()` renvoie `Signal<Produit[]>`, tandis que `clientService.items()` renvoie `Signal<Client[]>`. Impossible d'insérer un client dans le catalogue de produits par erreur.
- **Découplage parfait** : Le composant ne sait rien de la façon dont les données sont conservées en mémoire (ni si elles seront un jour synchronisées avec une API REST ou Dexie.js dans les séances du Bloc D).

---

## Synthèse : ce qu'il faut retenir absolument

### Tableau récapitulatif des mécanismes fondamentaux

| Concept / Syntaxe | Rôle architectural | Avantage clé en POO |
| :--- | :--- | :--- |
| **Service métier** | Classe dédiée à la logique, aux calculs et à l'état applicatif. | Respect du principe de responsabilité unique (SRP). |
| **`@Injectable({ providedIn: 'root' })`** | Déclare la classe comme injectable dans l'injecteur racine. | Garantit une instance unique (Singleton) et le tree-shaking. |
| **`inject(MonService)`** | Fonction d'injection moderne en contexte d'initialisation. | Évite la verbosité du constructeur et facilite l'héritage. |
| **`class Repository<T>`** | Patron de classe générique paramétré par un type `T`. | Réutilisation maximale du code (DRY) sans duplication. |
| **`<T extends Identifiable>`** | Contrainte générique imposant la présence d'attributs requis. | Sécurité de typage totale sans recourir au type `any`. |
| **`#items = signal<T[]>([])`** | Conteneur mutable d'état interne au service. | Encapsulation forte et point unique de mutation contrôlée. |
| **`items = #items.asReadonly()`** | Projection publique en lecture seule du signal d'état. | Interdit aux composants de muter l'état en douce. |

---

### La Règle d'Or de la Séance 14

> **« Un composant affiche et interagit ; un service pense et retient. Confiez l'état et la logique métier à des services injectables singleton, encapsulez vos signaux en lecture seule, et exploitez la généricité TypeScript pour ne jamais dupliquer un algorithme de persistance. »**

---

## Clôture de la séance & Pont vers la Séance 15

Félicitations ! Vous venez de franchir une étape majeure dans la structuration logicielle de vos applications Angular :
- Vous savez découpler vos interfaces graphiques de vos données en appliquant l'Injection de Dépendances.
- Vous maîtrisez la généricité TypeScript (`<T extends Identifiable>`) pour bâtir des abstractions robustes et réutilisables.
- Vous savez architecturer un Store réactif en signaux respectant les règles d'or de l'encapsulation et de l'immutabilité.

Cependant, dans nos démonstrations actuelles, les données saisies par l'utilisateur sont encore capturées de façon basique. Que se passe-t-il lorsque l'utilisateur remplit un formulaire d'inscription complexe avec des contrôles de validité stricts (format d'email, mot de passe robuste, unicité) ? Et comment naviguer d'un écran à un autre sans perdre la trace de nos entités ?

### Aperçu de la Séance 15 : Signal Forms & Routing d'Entreprise
Dans la prochaine séance, nous conclurons le **Bloc C** en abordant :
- **L'API Signal Forms** (stabilisée depuis Angular 22) : la gestion réactive et déclarative des formulaires avec validation en temps réel synchronisée sur les signaux.
- **Le Routeur Angular moderne** : configuration des routes, navigation programmatique, paramètres d'URL réactifs (`withComponentInputBinding`) et protection d'accès par gardes fonctionnels.
