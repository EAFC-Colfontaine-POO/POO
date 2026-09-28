# Séance 7 — Le Polymorphisme

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant sera en mesure de :

- définir le polymorphisme par redéfinition et en identifier les trois conditions d'application (relation d'héritage, redéfinition de méthode, référence de type parent) ;
- distinguer la redéfinition (polymorphisme d'inclusion, dynamique) de la surcharge (polymorphisme ad hoc, statique), et simuler la surcharge en TypeScript au moyen de signatures d'appel ;
- distinguer le type statique (déclaré, vérifié à la compilation) du type dynamique (effectif, déterminé à l'exécution) et expliquer le mécanisme de la liaison dynamique (*late binding*) ;
- manipuler une collection hétérogène d'objets via un type commun et formuler le bénéfice en termes de respect du principe Ouvert/Fermé (OCP) ;
- utiliser l'opérateur `instanceof` comme garde de type, en comprendre le rétrécissement de type automatique (*type narrowing*) et en connaître les pièges d'usage ;
- découvrir l'alternative par union discriminée (propriété `kind` littérale, filtrage exhaustif par `switch` et variable de type `never`) et situer son domaine de prédilection ;
- mettre en œuvre le polymorphisme dans un composant Angular standalone signal-first (`@for`, appel de méthode redéfinie, `@if` combiné à `instanceof`).

---

## 1. Contexte : le problème du code rigide

Les séances précédentes ont posé deux piliers de la programmation orientée objet : l'encapsulation (séance 5), qui protège l'état interne des objets et garantit leurs invariants, et l'héritage (séance 6), qui factorise les attributs et comportements communs d'une famille de classes et permet leur spécialisation au moyen de `extends`, `super()` et `override`. L'héritage, pris isolément, ne fait toutefois qu'économiser quelques lignes de déclaration. C'est le polymorphisme, troisième pilier abordé dans la présente séance, qui libère son plein potentiel : la capacité de manipuler des objets spécialisés à travers une signature générale, sans connaître leur type concret à l'avance.

### 1.1 L'idée en quelques secondes : la basse-cour

Avant d'entrer dans le code métier, une image suffit à saisir l'idée centrale. On donne **le même ordre** à trois animaux différents :

```typescript
class Animal {
  crier(): string {
    return '...';
  }
}

class Chat extends Animal {
  override crier(): string { return 'Miaou !'; }
}

class Chien extends Animal {
  override crier(): string { return 'Ouaf !'; }
}

class Vache extends Animal {
  override crier(): string { return 'Meuh !'; }
}
```

```typescript
for (const a of [chat, chien, vache]) {
  a.crier();
}
```

Un seul ordre (`crier()`), trois réactions différentes : « Miaou ! », « Ouaf ! », « Meuh ! ». C'est l'essence même du polymorphisme. Le reste de la séance consiste à appliquer cette même idée dans du code professionnel.

### 1.2 L'anti-pattern de la tour de contrôle

Considérons à présent une hiérarchie simple issue de la séance 6, composée d'une classe `Media` et de ses sous-classes `Livre` et `Film`. Dans une approche procédurale, si l'on souhaite afficher les informations d'un élément du catalogue, on écrit une fonction qui inspecte l'intérieur de chaque objet pour décider quoi faire :

```typescript
// Approche procédurale sans polymorphisme
function afficherInfo(item: any): void {
  if (item.type === 'livre') {
    console.log(`Livre: ${item.titre} (${item.pages} p.)`);
  } else if (item.type === 'film') {
    console.log(`Film: ${item.titre} (${item.duree} min)`);
  } else {
    console.log(`Média inconnu`);
  }
}
```

Ce style de code, parfois qualifié de « tour de contrôle », présente trois défauts structurels :

1. **Couplage fort** : la fonction appelante doit connaître l'intégralité des types concrets existant dans le système.
2. **Duplication des cascades** : dès qu'une seconde opération est requise (calculer un tarif, imprimer une étiquette), le même `if / else if` est réécrit ailleurs.
3. **Violation du principe Ouvert/Fermé** : l'ajout d'un type `JeuVideo` oblige à rouvrir et modifier toutes les fonctions existantes, ce qui accroît le risque de régression.

En programmation orientée objet, on inverse cette responsabilité : au lieu d'interroger l'objet pour prendre la décision à sa place, on lui envoie un message et c'est lui qui réagit selon sa propre nature.

---

## 2. Le polymorphisme par redéfinition

### 2.1 Définition

Le terme « polymorphisme » provient du grec *poly* (plusieurs) et *morphê* (formes). En programmation orientée objet, il désigne la capacité d'un système à invoquer, au moment de l'exécution, la méthode appropriée en fonction du **type effectif de l'instance**, bien que la référence qui la manipule soit typée selon la **classe parente**. Il s'agit ici du polymorphisme par sous-typage (ou polymorphisme d'inclusion), le plus fondamental en POO classique.

Trois conditions sont indispensables à son fonctionnement :

1. une **relation d'héritage** (`extends`) entre une classe générale et des classes dérivées ;
2. une **redéfinition de méthode** (`override`) portant la même signature dans la classe fille ;
3. une **référence de type parent** pointant vers un objet instancié d'une sous-classe.

### 2.2 Illustration

Reprenons la hiérarchie de la séance 6 et complétons-la par une méthode redéfinie :

```typescript
// Classe de base
class Media {
  constructor(public titre: string, public annee: number) {}

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}

// Sous-classe spécialisée
class Livre extends Media {
  constructor(titre: string, annee: number, public pages: number) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `Livre : ${this.titre} — ${this.pages} pages`;
  }
}

class Film extends Media {
  constructor(titre: string, annee: number, public duree: number) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `Film : ${this.titre} — ${this.duree} min`;
  }
}
```

Le code consommateur devient alors d'une remarquable sobriété :

```typescript
function afficher(media: Media): void {
  console.log(media.getDescription());
}
```

La fonction `afficher` ne contient ni `if` ni `switch`. Elle ignore totalement si elle reçoit un `Livre` ou un `Film` : elle fait confiance à la méthode de l'objet, et c'est celui-ci qui détermine le comportement exécuté. On délègue à l'objet la responsabilité de son propre comportement.

---

## 3. L'autre forme de polymorphisme : la surcharge

### 3.1 Polymorphisme ad hoc

Le polymorphisme admet une seconde famille, dite **polymorphisme ad hoc** (ou par surcharge) : plusieurs méthodes portant **le même nom**, dans **la même classe**, mais avec des **signatures différentes** (nombre ou type de paramètres). C'est le **compilateur** qui choisit, à la compilation, quelle version appeler selon les arguments fournis — le choix ne dépend en rien de l'objet présent en mémoire.

Il convient de ne pas confondre les deux familles, confusion très fréquente :

| Critère | Surcharge | Redéfinition |
|---|---|---|
| Où ? | Dans la même classe | Dans une classe fille |
| Signature | Différente | Identique |
| Résolue à la | Compilation | Exécution |
| Statut dans ce cours | Nouveau | Déjà vu (section 2) |

Les deux méritent le nom de « polymorphisme » (un même nom, des comportements différents), mais leur mécanisme est complètement différent.

### 3.2 La surcharge en TypeScript : un piège à connaître

Contrairement à Java ou C#, TypeScript (comme JavaScript) n'autorise **qu'une seule implémentation** par nom de méthode : écrire deux méthodes `resume()` avec deux corps différents ne compile pas. On simule la surcharge en déclarant des **signatures d'appel** au-dessus d'une implémentation unique :

```typescript
class Livre extends Media {
  // Signatures de surcharge (visibles à l'appel)
  resume(): string;
  resume(nbCaracteres: number): string;

  // Implémentation unique (jamais appelée directement par le compilateur)
  resume(nbCaracteres?: number): string {
    const texte = `${this.titre}, par ${this.auteur}`;
    return nbCaracteres ? texte.slice(0, nbCaracteres) : texte;
  }
}
```

```typescript
livre.resume();    // texte complet
livre.resume(20);  // 20 premiers caractères
```

**Piège classique** pour qui connaît Java : en Java, on écrirait deux méthodes `resume()` avec deux corps distincts. En TypeScript, il n'existe qu'un seul corps en mémoire. Les signatures de surcharge sont une pure construction du compilateur — elles guident l'auto-complétion et la vérification de type, puis sont effacées à la compilation, exactement comme les interfaces et les alias de type. JavaScript, au *runtime*, ne connaît qu'une seule fonction.

---

## 4. Mécanique interne : type statique, type dynamique et liaison dynamique

### 4.1 L'analogie de la télécommande universelle

Le type de la variable peut être comparé à une **télécommande**, et l'objet instancié en mémoire vive à l'**appareil** qu'elle pilote. La télécommande de type `Media` possède un bouton `getDescription()` : c'est le **contrat statique** vérifié par TypeScript à la compilation. Lorsqu'on presse ce bouton, c'est l'appareil branché derrière — un `Livre` ou un `Film` — qui réagit selon ses propres circuits. Une seule commande est envoyée, mais la réaction diffère selon l'objet ciblé.

### 4.2 Type statique vs type dynamique

```typescript
// 1. Déclaration avec type parent (statique)
// 2. Instanciation de la sous-classe (dynamique)
const m1: Media = new Livre("Clean Code", 2008, 464);
const m2: Media = new Film("Inception", 2010, 148);

console.log(m1.getDescription()); // 👉 "Livre : Clean Code — 464 pages"
console.log(m2.getDescription()); // 👉 "Film : Inception — 148 min"
```

- Le **type statique** (ici `Media`) est connu au moment de la compilation. Il fixe l'ensemble des méthodes et propriétés accessibles sur la référence.
- Le **type dynamique** (ici `Livre` puis `Film`) est déterminé à l'exécution ; c'est lui qui détermine le code réellement exécuté.

### 4.3 La liaison dynamique (*late binding*)

Comme le chat et le chien qui criaient chacun à leur façon sur le même ordre, le moteur JavaScript résout chaque appel à l'exécution. Dans une **liaison statique** (précoce), l'adresse de la fonction est résolue dès la compilation. Dans une **liaison dynamique** (tardive), qui est celle des méthodes redéfinies, l'adresse de la méthode est cherchée au moment précis de l'appel, en inspectant la chaîne de prototypes de l'objet présent en mémoire :

```
Instance (Livre en RAM)
    │ __proto__
    ▼
Livre.prototype  →  getDescription() [version spécialisée]
    │ __proto__
    ▼
Media.prototype  →  getDescription() [version générique]
```

Le moteur JavaScript trouve `getDescription` directement sur `Livre.prototype` et l'exécute immédiatement, sans remonter plus haut dans la chaîne. Si aucune redéfinition n'existait, il remonterait jusqu'à `Media.prototype`. C'est cette résolution à l'exécution qui constitue l'essence du polymorphisme par redéfinition — et qui la distingue fondamentalement de la surcharge, résolue elle à la compilation.

### 4.4 La règle d'or du compilateur TypeScript

```typescript
const m: Media = new Livre("Les Misérables", 1862, 1488);

console.log(m.titre);            // ✅ autorisé : déclaré sur Media
console.log(m.getDescription()); // ✅ autorisé : déclaré sur Media

console.log(m.pages);
// ❌ ERREUR DE COMPILATION — TS2339: Property 'pages' does not exist on type 'Media'.
```

Ce blocage, fréquemment source de confusion chez les débutants, est fondamental : même si l'objet réel possède bien la propriété `pages`, TypeScript garantit la sécurité de type. La variable étant de type `Media`, elle pourrait tout aussi bien contenir un `Film`, qui ne possède pas de pages. **Le type statique restreint la vue** : on ne peut voir et actionner que les membres déclarés sur la classe de référence.

---

## 5. Collections hétérogènes et extensibilité

### 5.1 Le principe

Une **collection hétérogène** rassemble des instances de sous-classes différentes sous un type commun :

```typescript
const catalogue: Media[] = [
  new Livre("1984", 1949, 328),
  new Film("Matrix", 1999, 136),
  new Livre("Dune", 1965, 412),
  new Film("Interstellar", 2014, 169)
];

// Traitement uniforme
for (const media of catalogue) {
  console.log(media.getDescription());
}
```

À chaque tour de boucle, la liaison dynamique résout la méthode adaptée à l'objet courant, sans aucune condition manuelle. Une seule ligne d'appel produit des formats complètement différents — exactement comme la basse-cour de la section 1.1, appliquée à du code métier.

### 5.2 Le crash-test de l'extensibilité : le principe Ouvert/Fermé

Ajoutons un nouveau type au catalogue :

```typescript
class JeuVideo extends Media {
  constructor(titre: string, annee: number, public plateforme: string) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `Jeu : ${this.titre} [${this.plateforme}]`;
  }
}

// Injection du nouveau type dans le catalogue existant
catalogue.push(new JeuVideo("Zelda: BotW", 2017, "Nintendo Switch"));

for (const media of catalogue) {
  console.log(media.getDescription());
}
// 👉 le jeu vidéo s'affiche parfaitement, sans aucune modification du code existant
```

Ni la classe `Media`, ni la boucle `for`, ni les classes `Livre` et `Film` n'ont été touchées. Le principe **Ouvert/Fermé** est respecté : le code est ouvert à l'extension (on a créé `JeuVideo`) mais fermé à la modification (aucun code existant n'a été retouché). On « branche » simplement un nouveau module et l'application fonctionne immédiatement.

### 5.3 Comparatif architectural

| Critère | Sans polymorphisme (approche procédurale) | Avec polymorphisme (approche objet) |
|---|---|---|
| Structure | Cascades de `if / else if` ou `switch` dupliquées | Appel unifié : `media.getDescription()` |
| Ajout d'un type | Modification de toutes les fonctions existantes (risque de régression) | Création d'une classe fille, zéro impact sur le reste |
| Connaissance requise | Le code client connaît les détails internes de chaque classe | Le code client ne connaît que le contrat du parent |
| Tests unitaires | Chaque fonction doit tester tous les cas | Chaque classe est testée isolément |

---

## 6. Le garde de type : `instanceof` et rétrécissement de type

### 6.1 Quand le polymorphisme pur ne suffit pas

Certaines méthodes n'ont aucun sens sur la classe parente : un film ne se « feuillette » pas (`Livre.feuilleter()`), un livre papier n'a pas de bande-annonce vidéo (`Film.regarderBandeAnnonce()`). L'erreur de conception classique consisterait à ajouter ces méthodes à `Media` avec des corps vides ou levant des exceptions, ce qui polluerait l'interface parente et casserait l'encapsulation. La bonne démarche consiste à conserver ces méthodes dans les classes spécialisées et à utiliser un **garde de type** au moment précis où l'on souhaite y accéder.

### 6.2 L'opérateur `instanceof`

```typescript
function traiterMedia(media: Media): void {
  // Appel polymorphe général
  console.log(media.getDescription());

  // Traitement spécialisé sécurisé
  if (media instanceof Livre) {
    // TypeScript SAIT que media est un Livre ici !
    console.log(`Pages à lire : ${media.pages}`);
  } else if (media instanceof Film) {
    // TypeScript SAIT que media est un Film ici !
    console.log(`Durée : ${media.duree} minutes`);
  }
}
```

L'opérateur `instanceof` vérifie si un objet appartient à une classe donnée. Dès que la condition est validée, le compilateur opère un **rétrécissement de type** (*type narrowing*) : à l'intérieur du bloc, le type de `media` est temporairement changé en `Livre`, et l'auto-complétion de l'IDE propose `media.pages` sans cast manuel. C'est l'une des forces majeures de TypeScript : le compilateur analyse le flot de contrôle du code.

### 6.3 Les trois pièges de `instanceof`

1. **Fonctionne uniquement avec des classes.** L'opérateur inspecte la chaîne de prototypes à l'exécution. Les `interface` et les alias `type` TypeScript sont effacés à la compilation (ils n'existent pas au *runtime*) : les utiliser avec `instanceof` provoque une erreur.
2. **Attention aux objets désérialisés.** Un objet reçu d'une API via `JSON.parse()` est un objet littéral sans classe : `data instanceof Livre` vaudra toujours `false` tant que l'objet n'a pas été ré-instancié avec `new Livre(...)`.
3. **Le piège de l'abus.** Multiplier les `if (m instanceof ...)` dans le code revient à réintroduire l'anti-pattern procédural de la tour de contrôle. **Règle d'or de conception** : on privilégie toujours une méthode polymorphe redéfinie ; `instanceof` se réserve aux cas exceptionnels, typiquement l'affichage de métadonnées exclusives dans une interface utilisateur.

---

## 7. Alternative moderne : les unions discriminées

### 7.1 Définition

TypeScript propose une technique de polymorphisme **structurel**, sans classes ni héritage, fondée sur des types littéraux et une propriété commune appelée **discriminant** :

```typescript
type LivreData = {
  kind: 'livre'; // discriminant (valeur littérale unique)
  titre: string;
  pages: number;
};

type FilmData = {
  kind: 'film';  // discriminant
  titre: string;
  duree: number;
};

// L'union des deux types
type MediaData = LivreData | FilmData;
```

Chaque membre de l'union porte une valeur littérale distincte sur la propriété `kind` (aussi nommée `type`). Cette approche est idéale pour typer les réponses JSON d'un serveur REST ou les événements, sans devoir instancier des classes avec `new`. La différence de philosophie est nette : les classes regroupent données et méthodes ; les unions discriminées décrivent de la donnée pure (DTO, *payloads* API).

### 7.2 Filtrage exhaustif avec `switch` et `never`

```typescript
function formaterMedia(item: MediaData): string {
  switch (item.kind) {
    case 'livre':
      // item est automatiquement LivreData ici !
      return `Livre: ${item.titre} (${item.pages} p.)`;

    case 'film':
      // item est automatiquement FilmData ici !
      return `Film: ${item.titre} (${item.duree} min)`;

    default:
      // Sécurité absolue à la compilation !
      const _exhaustif: never = item;
      throw new Error(`Cas non géré : ${_exhaustif}`);
  }
}
```

Dès qu'un membre est ajouté à l'union (par exemple `type JeuData = { kind: 'jeu', ... }`) sans mise à jour du `switch`, la variable `item` ne peut plus être assignée au type `never` : **TypeScript refuse de compiler**. Cette astuce du `never` garantit l'exhaustivité des traitements et détecte immédiatement les oublis.

### 7.3 Tableau comparatif

| Critère | Classes & héritage (POO) | Unions discriminées (TS) |
|---|---|---|
| Nature | Hiérarchie de classes avec prototypes | Types littéraux et typage structurel |
| Comportement | Méthodes internes encapsulées (`media.getDescription()`) | Fonctions externes (`formater(media)`) |
| État & invariants | Encapsulation forte (constructeur, validation) | Données brutes, souvent immuables |
| Extensibilité | Facile d'ajouter un type (nouvelle classe fille, sans toucher au code existant) | Facile d'ajouter une opération (nouvelle fonction externe, sans toucher aux types) |
| Contexte de prédilection | Modèle métier riche, logique d'application, entités complexes | Payloads HTTP / JSON, DTO, événements, états applicatifs |

---

## 8. Démonstration Angular

La démonstration met en œuvre, dans une application Angular 21+ standalone et signal-first, un catalogue multimédia affichant une liste d'objets de types différents en appelant une méthode polymorphe — exactement le mécanisme prévu par le planning pour cette séance. Le mini-projet est fourni par l'enseignant via Git ; l'étudiant le récupère par `git clone`/`git pull` et l'explore pendant la démonstration. Seuls les mécanismes déjà vus sont employés : composants standalone, signals (signal privé exposé en lecture via `computed()`, selon le patron de la séance 5), et les nouveautés de la présente séance (`@for`, `@if`, appel polymorphe, `instanceof` dans le template).

### Étape 1 — Le modèle métier en pur TypeScript

Le modèle reste indépendant d'Angular : aucun import `@angular/core` dans le fichier du modèle. C'est le principe d'architecture propre déjà souligné lors des séances précédentes. Chaque sous-classe redéfinit `getDescription()` et fournit également, par polymorphisme, le code CSS de son badge Bootstrap :

```typescript
// src/app/models/media.model.ts
export class Media {
  constructor(
    public titre: string,
    public annee: number
  ) {}

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }

  getBadgeCss(): string {
    return 'badge bg-secondary';
  }
}

export class Livre extends Media {
  constructor(
    titre: string,
    annee: number,
    public auteur: string,
    public pages: number
  ) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `« ${this.titre} » par ${this.auteur}`;
  }

  override getBadgeCss(): string {
    return 'badge bg-primary';
  }
}

export class Film extends Media {
  constructor(
    titre: string,
    annee: number,
    public realisateur: string,
    public duree: number
  ) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `Film : ${this.titre} (${this.duree} min)`;
  }

  override getBadgeCss(): string {
    return 'badge bg-danger';
  }
}

export class JeuVideo extends Media {
  constructor(
    titre: string,
    annee: number,
    public console: string
  ) {
    super(titre, annee);
  }

  override getDescription(): string {
    return `Jeu : ${this.titre} [${this.console}]`;
  }

  override getBadgeCss(): string {
    return 'badge bg-success';
  }
}
```

La méthode `getBadgeCss()` illustre l'intérêt du polymorphisme pour l'affichage : le modèle fournit son propre code couleur, et le template HTML n'a pas besoin de savoir quel type d'objet il manipule.

### Étape 2 — Le service réactif avec signals

Le service applique le patron d'encapsulation vu en séance 5 : un signal privé modifiable, exposé publiquement en lecture seule via `computed()`. Le signal contient la collection hétérogène :

```typescript
// src/app/services/mediatheque.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Media, Livre, Film, JeuVideo } from '../models/media.model';

@Injectable({ providedIn: 'root' })
export class MediathequeService {
  // Signal privé encapsulé contenant la collection polymorphe
  private readonly _medias = signal<Media[]>([
    new Livre('Le Petit Prince', 1943, 'Antoine de Saint-Exupéry', 96),
    new Film('Inception', 2010, 'Christopher Nolan', 148),
    new JeuVideo('The Witcher 3', 2015, 'PC / Consoles')
  ]);

  // Exposition en lecture seule
  readonly medias = computed(() => this._medias());

  ajouterLivre(titre: string, annee: number, auteur: string, pages: number): void {
    const nouveau = new Livre(titre, annee, auteur, pages);
    this._medias.update(liste => [...liste, nouveau]);
  }
}
```

### Étape 3 — Le composant standalone

```typescript
// src/app/components/catalogue.component.ts
import { Component, inject } from '@angular/core';
import { MediathequeService } from '../services/mediatheque.service';
import { Livre, Film, JeuVideo } from '../models/media.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  templateUrl: './catalogue.component.html'
})
export class CatalogueComponent {
  protected readonly service = inject(MediathequeService);

  // Exposition des constructeurs pour utilisation dans le template avec instanceof
  protected readonly LivreClass = Livre;
  protected readonly FilmClass = Film;
  protected readonly JeuVideoClass = JeuVideo;
}
```

L'injection se fait ici par la fonction `inject()`, sans constructeur verbeux. L'astuce cruciale tient à la dernière partie du composant : un template Angular ne voit que les propriétés déclarées sur la classe du composant. Pour pouvoir écrire `media instanceof Livre` dans le template, la référence à la classe `Livre` doit donc être exposée comme propriété du composant.

### Étape 4 — Le template avec `@for` et appel polymorphe

```html
<!-- src/app/components/catalogue.component.html -->
<div class="container py-4">
  <h2 class="mb-4">Catalogue de la Médiathèque</h2>

  <div class="row g-3">
    @for (media of service.medias(); track media.titre) {
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0 bg-light">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <span [class]="media.getBadgeCss()">{{ media.annee }}</span>
              <!-- Appel polymorphe pur : résolution dynamique au runtime ! -->
              <h5 class="card-title mt-2">{{ media.getDescription() }}</h5>
            </div>
          </div>
        </div>
      </div>
    } @empty {
      <div class="col-12"><p class="text-muted">Aucun média dans le catalogue.</p></div>
    }
  </div>
</div>
```

Le template est court, lisible et robuste : il n'a pas besoin de savoir si l'élément est un livre, un film ou un jeu pour afficher sa description et son badge. La boucle `@for` (avec sa branche `@empty`) parcourt la collection hétérogène, et chaque appel `media.getDescription()` est résolu dynamiquement selon le type effectif de l'objet.

### Étape 5 — Afficher les spécificités avec `@if` et `instanceof`

Pour afficher les métadonnées exclusives de chaque type, on recourt au garde de type dans le template — l'usage légitime de `instanceof` évoqué à la section 6 :

```html
<!-- Intérieur de la carte (après le titre) -->
<div class="mt-3 pt-2 border-top text-muted small">
  @if (media instanceof LivreClass) {
    <p class="mb-0">
      ✍️ <strong>Auteur :</strong> {{ media.auteur }}<br>
      📄 <strong>Pagination :</strong> {{ media.pages }} pages
    </p>
  }

  @if (media instanceof FilmClass) {
    <p class="mb-0">
      🎬 <strong>Réalisateur :</strong> {{ media.realisateur }}<br>
      ⏱️ <strong>Durée :</strong> {{ media.duree }} minutes
    </p>
  }

  @if (media instanceof JeuVideoClass) {
    <p class="mb-0">
      🎮 <strong>Plateforme :</strong> {{ media.console }}
    </p>
  }
</div>
```

### Synthèse des points clés de l'architecture

1. **Appel polymorphe** : `media.getDescription()` s'exécute dynamiquement selon la sous-classe, sans aucune ligne de condition dans le template.
2. **Collection hétérogène** : le tableau `Media[]` stocke côte à côte des livres, des films et des jeux sous un contrat commun.
3. **Rétrécissement de type contrôlé** : `media instanceof Livre` permet d'extraire les attributs propres à chaque média en toute sécurité.
4. **Extensibilité maximale (OCP)** : pour ajouter un `Podcast`, il suffit de créer une sous-classe ; l'application continue de fonctionner sans régression.

---

## 9. Ce qu'il faut retenir

| Notion | Rôle fondamental | Exemple clé |
|---|---|---|
| Polymorphisme par redéfinition | Même appel, exécution dépendante du type réel en mémoire | `m.getDescription()` résout la méthode de `Livre` |
| Polymorphisme par surcharge | Même nom, signatures différentes, résolu à la compilation | `resume()` / `resume(20)` |
| Type statique vs type dynamique | Contrôle à la compilation vs objet en RAM à l'exécution | `const m: Media = new Livre(...)` |
| Liaison dynamique (*late binding*) | Résolution de méthode au *runtime* via la chaîne de prototypes | Recherche dans `Livre.prototype` avant `Media.prototype` |
| Collection hétérogène | Unifier des sous-classes sous une référence commune | `catalogue: Media[] = [livre, film]` |
| Garde `instanceof` | Rétrécissement de type sécurisé | `if (m instanceof Livre) { m.pages }` |
| Union discriminée | Alternative sans classes pour les données API / JSON | `type Media = LivreData \| FilmData` |

---

## 10. Ouverture vers la séance suivante

Le modèle actuel présente une limite de conception : rien n'interdit d'écrire `const m = new Media("Objet Bizarre", 2026)`, alors qu'un média générique qui ne serait ni un livre, ni un film, ni un jeu n'a aucun sens métier d'exister. La séance 8 apportera la réponse à ce paradoxe au moyen des **classes abstraites** (`abstract`, qui empêche l'instanciation directe et force les sous-classes à implémenter certaines méthodes) et des **interfaces** (`implements`), qui définissent des contrats purs pouvant s'appliquer à plusieurs familles de classes.
