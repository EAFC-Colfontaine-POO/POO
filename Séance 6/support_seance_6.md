# Séance 6 — L'Héritage en Programmation Orientée Objet

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant sera en mesure de :

1. **Fondements et syntaxe** — comprendre le rôle du mot-clé `extends`, l'obligation d'appel de `super()` dans le constructeur d'une classe dérivée, et le modificateur de visibilité `protected`.
2. **Redéfinition et sécurité** — spécialiser un comportement hérité à l'aide du mot-clé `override` et exploiter la rigueur du compilateur TypeScript pour éviter les régressions silencieuses.
3. **Discernement et pièges** — valider la relation « est-un » (*is-a*), identifier le couplage fort, le problème de la classe de base fragile et l'effet yo-yo.
4. **Intégration Angular** — consommer une hiérarchie de classes métier pures (écrites en TypeScript, sans dépendance au framework) au sein d'un composant Standalone moderne utilisant les Signals.

---

## 1. Partie théorique

### 1.1 Le problème de départ : la duplication de code

En séance 5, il a été appris à concevoir une classe solide et autonome : encapsulation (regroupement de l'état et des comportements au sein d'une entité cohérente), modificateurs de visibilité (`private`/`public`) et constructeur garantissant la naissance de l'objet dans un état valide.

Cette maîtrise de la classe individuelle atteint toutefois rapidement ses limites dans un projet d'entreprise : on gère rarement une seule classe isolée, mais des dizaines d'entités métier qui partagent des caractéristiques communes.

Prenons l'exemple de la gestion du catalogue d'une médiathèque. Sans mécanisme de partage, chaque entité est écrite séparément :

```typescript
// livre.ts
class Livre {
  titre: string;
  annee: number;
  nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    this.titre = titre;
    this.annee = annee;
    this.nombrePages = pages;
  }

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}
```

```typescript
// film.ts
class Film {
  titre: string;
  annee: number;
  duree: number;

  constructor(titre: string, annee: number, duree: number) {
    this.titre = titre;
    this.annee = annee;
    this.duree = duree;
  }

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}
```

On constate que `titre`, `annee`, leur stockage dans le constructeur et la méthode `getDescription()` sont **intégralement dupliqués** entre les deux classes. Si l'on ajoute `JeuVideo`, `Musique` ou `Podcast`, le même bloc sera recopié cinq ou dix fois.

Cette duplication présente trois risques majeurs :

- **Risque de bug accru** — si la formule de `getDescription()` contient une coquille, il faut la corriger dans *toutes* les classes dupliquées ;
- **Divergence silencieuse** — avec le temps et plusieurs développeurs, deux copies d'un même code finissent par évoluer différemment par mégarde ;
- **Dette technique** — la base de code enfle inutilement, augmentant l'effort de lecture, de test et de maintenance globale.

Le principe **DRY** (*Don't Repeat Yourself*) est une règle fondamentale de la maintenabilité logicielle. L'héritage est le mécanisme historique de la POO conçu pour y répondre.

### 1.2 Le principe de l'héritage

L'héritage permet à une classe d'acquérir automatiquement tous les membres (attributs et méthodes) d'une autre classe. Il repose sur deux mouvements complémentaires :

1. **Factorisation (classe mère)** — on regroupe les attributs et comportements partagés au sein d'une *classe de base* (par exemple `Media`).
2. **Spécialisation (classes filles)** — les *classes dérivées* (par exemple `Livre`, `Film`) héritent du socle commun et n'écrivent que leurs particularités.

Le vocabulaire est à connaître ; tous les termes suivants désignent la même relation :

| Terme pour la classe générale | Terme pour la classe spécialisée |
|---|---|
| Classe parente | Classe dérivée |
| Classe mère | Classe fille |
| Super-classe | Sous-classe |
| Classe de base | Classe spécialisée |

#### La relation fondamentale : « est-un » (*is-a*)

L'héritage modélise obligatoirement une relation de sous-type stricte. Un `Livre` *est un* `Media` (avec un nombre de pages en plus) ; un `Film` *est un* `Media` (avec une durée en plus) ; un `Chien` *est un* `Animal`. Tout ce qui est vrai pour le concept général s'applique naturellement au concept spécialisé.

> **Critère d'or** : si une classe dérivée n'est pas un cas particulier évident de sa classe de base, l'héritage est une erreur de conception.

La question cruciale à se poser avant d'écrire la moindre ligne avec `extends` est :

> « Un B est-il véritablement et en tout temps un A ? »

Exemples sémantiquement valides :

- `Livre` est-un `Media`
- `Voiture` est-un `Vehicule`
- `Enseignant` est-une `Personne`
- `CompteEpargne` est-un `CompteBancaire`

Exemples invalides (anti-patterns) :

- `Facture extends Client` — une facture n'est pas un client ;
- `Voiture extends Moteur` — une voiture n'est pas un moteur ;
- `Avion extends Aile` — un avion *possède* une aile, il ne l'est pas ;
- `Panier extends Article` — un panier *contient* des articles.

### 1.3 La syntaxe : `extends` et `super()`

En TypeScript (comme en JavaScript ES6+), l'héritage s'exprime avec le mot-clé **`extends`** :

```typescript
export class Media {
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

export class Livre extends Media {
  private nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee); // Invoque le constructeur de Media
    this.nombrePages = pages;
  }
}
```

`Livre` acquiert automatiquement `titre`, `annee` et tous les comportements déclarés dans `Media`. Il ne reste qu'à ajouter sa spécialité (`nombrePages`).

#### Le rôle vital de `super()`

L'instruction **`super(...)`** joue deux rôles :

1. **Délégation d'initialisation** — la classe dérivée ne réinvente pas la roue : elle délègue l'initialisation des champs hérités au constructeur de sa classe mère ;
2. **Cohérence du contrat** — si la classe mère exige deux paramètres à la construction, toute classe fille est *obligée* de les lui fournir pour que l'objet soit intègre.

> **Règle TypeScript** : si une classe fille définit un constructeur, elle a l'obligation stricte d'appeler `super()`. Omettre cet appel produit une erreur de compilation immédiate.

#### La règle d'ordre : `super()` avant tout accès à `this`

En TypeScript et JavaScript, le constructeur d'une classe dérivée est régi par une règle d'ordre stricte : l'appel à `super()` doit *précéder* tout accès à `this`.

```typescript
// ❌ Incorrect — erreur de compilation
class Livre extends Media {
  pages: number;

  constructor(titre: string, annee: number, pages: number) {
    this.pages = pages;  // ERREUR !
    super(titre, annee); // Trop tard !
  }
}
```

Le compilateur signale : `TS17009: 'super' must be called before accessing 'this' in the constructor of a derived class.`

```typescript
// ✅ Correct
class Livre extends Media {
  pages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee); // D'abord le parent
    this.pages = pages;  // Puis l'enfant
  }
}
```

*Pourquoi cette règle ?* L'objet `this` n'existe officiellement en mémoire que lorsque la fondation (la classe parente) a fini de se construire. L'analogie du bâtiment s'impose : on ne pose pas le papier peint du premier étage (`this.pages = pages`) tant que les fondations et le rez-de-chaussée (`super`) ne sont pas coulés.

### 1.4 Le dilemme de visibilité et la solution `protected`

Rappelons les modificateurs vus en séance 5. Face à l'héritage, ils posent un dilemme :

- **Le problème de `private`** — un membre déclaré `private` dans `Media` est totalement inaccessible depuis `Livre` :

```typescript
class Media {
  private titre: string;
}

class Livre extends Media {
  afficher() {
    // ❌ Erreur : 'titre' est privé et n'est accessible que dans 'Media'
    console.log(this.titre);
  }
}
```

- **Le piège de `public`** — tout déclarer en `public` résout l'accès depuis `Livre`, mais détruit l'encapsulation : n'importe quel code extérieur peut corrompre les données.

```typescript
class Media {
  public titre: string;
}

const m = new Media('Dune', 1965);
m.titre = ''; // ⚠️ Aucune protection !
```

Le mot-clé **`protected`** est le juste milieu, spécialement conçu pour l'héritage :

```typescript
export class Media {
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

export class Livre extends Media {
  resume(): string {
    // ✅ Autorisé : 'titre' est protected
    return `${this.titre.toUpperCase()}`;
  }
}

const livre = new Livre('1984', 1949, 328);
// livre.titre; ❌ ERREUR : membre inaccessible depuis l'extérieur
```

Un membre `protected` fonctionne comme un « secret de famille » : les membres de la famille (classe mère et classes filles) y ont accès, mais le public extérieur ne peut pas y toucher directement.

#### Matrice récapitulative des visibilités

| Modificateur | Classe mère | Classes dérivées | Reste du monde (extérieur) |
|---|---|---|---|
| `public` | ✅ Oui | ✅ Oui | ✅ Oui |
| `protected` | ✅ Oui | ✅ Oui | ❌ Non |
| `private` | ✅ Oui | ❌ Non | ❌ Non |

> **Recommandation** : par défaut, il convient de privilégier `private`. On n'ouvre en `protected` que les attributs dont les classes dérivées ont réellement besoin.

### 1.5 Redéfinition de méthode (*method overriding*) et le mot-clé `override`

Hériter d'une méthode ne signifie pas être prisonnier de son implémentation initiale. Une classe dérivée peut fournir sa propre version d'une méthode reçue du parent :

```typescript
// Classe mère
export class Media {
  protected titre: string;
  protected annee: number;

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}

// Classe dérivée
export class Film extends Media {
  private duree: number; // en minutes

  override getDescription(): string {
    return `${this.titre} (${this.annee}) — ${this.duree} min`;
  }
}
```

Quand on appelle `unFilm.getDescription()`, c'est la version spécialisée de `Film` qui s'exécute, pas celle de `Media`.

#### Le mot-clé `override` en TypeScript

Depuis TypeScript 4.3, le mot-clé **`override`** permet de déclarer explicitement son intention de redéfinir une méthode héritée. Il apporte trois bénéfices :

1. **Lisibilité immédiate** — il indique instantanément au lecteur que cette méthode provient d'un ancêtre ;
2. **Protection du compilateur** — il empêche les erreurs de frappe indétectables dans le nom de la méthode ;
3. **Refactorings sereins** — si la méthode parente est renommée, TypeScript signale immédiatement l'incohérence.

Il constitue un contrat formel avec le compilateur : *« je promets que cette méthode existe déjà dans la classe mère »*.

#### Le bug silencieux évité par `override`

Sans `override`, une simple coquille dans le nom de la méthode passe totalement inaperçue :

```typescript
class Media {
  protected titre: string = '';
  getDescription(): string {
    return `${this.titre}`;
  }
}

class Film extends Media {
  // Coquille : 'd' minuscule au lieu de 'D' majuscule
  getdescription(): string {
    return `${this.titre} (Film)`;
  }
}

const f = new Film();
f.getDescription(); // Exécute la version de Media ! Pas celle de Film !
```

TypeScript valide ce code car il l'interprète comme la création d'une *nouvelle* méthode, sans lien avec la méthode parente. Le bug passe en production.

Avec `override`, la coquille est bloquée dès la compilation :

```typescript
class Film extends Media {
  override getdescription(): string { // ❌ TS4113
    return `${this.titre} (Film)`;
  }
}
```

Le compilateur signale : `TS4113: This member cannot have an 'override' modifier because it is not declared in the base class 'Media'.`

> **Option recommandée dans `tsconfig.json`** : `"noImplicitOverride": true`, qui rend l'usage d'`override` obligatoire pour toute redéfinition.

#### Enrichir plutôt qu'écraser : `super.methode()`

Une classe dérivée n'a pas toujours besoin de tout réécrire de zéro. Elle peut **réutiliser** le résultat du parent grâce à `super.nomDeMethode()` :

```typescript
export class Livre extends Media {
  private nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee);
    this.nombrePages = pages;
  }

  // On enrichit la description parente au lieu de la dupliquer
  override getDescription(): string {
    const descriptionBase = super.getDescription(); // "Dune (1965)"
    return `${descriptionBase} — ${this.nombrePages} pages`;
  }
}
```

**Avantage maintenance** : si le format global de `Media` change (par exemple `[1965] Dune`), `Livre` en profite automatiquement sans modification. C'est l'essence même de l'extension de comportement : déléguer la partie commune et n'ajouter que la spécialité.

### 1.6 Discernement architectural et pièges de l'héritage

L'héritage est le lien le plus fort et le plus rigide qui puisse unir deux classes. Il ne faut jamais en faire un réflexe : c'est un outil puissant, mais il n'est pas gratuit.

**Ce que l'héritage résout avec brio :**

- élimine la duplication de code entre entités sœurs ;
- spécialise élégamment un concept abstrait ;
- modélise fidèlement une taxonomie métier naturelle (relation « est-un »).

**Ce que l'héritage coûte en pratique :**

- **couplage très fort** entre parent et enfants ;
- perte de flexibilité : la relation est fixée à la compilation ;
- fragilité de la classe mère face aux évolutions ;
- complexité de lecture croissante avec la profondeur de la hiérarchie.

En ingénierie logicielle, on échange un gain de lignes de code contre une **rigidité architecturale accrue**. Ce compromis (*trade-off*) doit être assumé consciemment.

#### Piège n°1 : l'héritage par commodité

L'erreur classique du débutant consiste à hériter simplement pour « récupérer » des méthodes ou des propriétés pratiques :

```typescript
// ❌ Héritage abusif
class Client {
  nom: string = '';
  adresse: string = '';
  envoyerEmail(): void { /* ... */ }
}

// ❌ Une facture n'est PAS un client !
class Facture extends Client {
  montantTotal: number = 0;
}

const f = new Facture();
f.envoyerEmail(); // Sémantiquement absurde !
```

La solution saine est la **composition** — une relation « a-un » (*has-a*) :

```typescript
// ✅ Relation saine de composition
class Client {
  nom: string = '';
  adresse: string = '';
}

// ✅ Une facture POSSÈDE un client
class Facture {
  numero: string;
  montantTotal: number;
  client: Client; // Référence propre

  constructor(num: string, total: number, client: Client) {
    this.numero = num;
    this.montantTotal = total;
    this.client = client;
  }
}
```

> Ne jamais hériter d'une classe simplement pour éviter de retaper des propriétés. La relation sémantique doit être irréprochable. (La composition fera l'objet d'une séance dédiée — séance 9 ; il s'agit ici d'en poser l'intuition.)

#### La notion clé : le couplage fort

Le **couplage** mesure le degré d'interdépendance entre deux modules ou classes. Deux classes sont fortement couplées lorsque modifier l'une risque de casser l'autre.

L'analogie des fondations s'applique : la classe dérivée est un étage construit *directement sur les fondations* d'un bâtiment existant. Tant que les fondations restent immobiles, tout est parfait ; mais si le rez-de-chaussée modifie ses poutres porteuses, *tous les étages supérieurs* doivent être réexaminés, même ceux qui n'ont pas été touchés directement.

Contrairement à une simple utilisation externe (qui ne voit que les méthodes publiques), la classe fille dépend souvent de :

- l'ordre d'initialisation du constructeur (règle de `super()`) ;
- l'implémentation interne de `super.methode()` ;
- l'état des membres `protected`.

L'héritage est ainsi la forme de couplage la plus serrée de toute la programmation orientée objet.

#### Piège n°2 : la classe de base fragile (*fragile base class problem*)

Une modification anodine dans la classe mère peut bouleverser les classes filles *sans qu'aucune ligne de ces dernières n'ait été touchée* :

```typescript
// VERSION INITIALE
class Media {
  protected titre: string = '';
  protected annee: number = 0;
  getDescription(): string { return `${this.titre} (${this.annee})`; }
}

class Livre extends Media {
  // Livre s'appuie sur le format exact du parent
  override getDescription(): string {
    return `${super.getDescription()} — X pages`;
  }
}
// Résultat initial : "Dune (1965) — X pages" ✅
```

```typescript
// PLUS TARD : un développeur modifie la classe mère pour un besoin externe...
class Media {
  getDescription(): string { return `[${this.annee}] - TITRE : ${this.titre}`; }
}
// Résultat dans Livre : "[1965] - TITRE : Dune — X pages" 💥
```

Plus la classe mère a d'enfants, plus elle devient « pétrifiée » et difficile à faire évoluer : toute modification doit être évaluée au regard de *toutes* ses sous-classes. C'est le problème de la classe de base fragile, concept fondamental en génie logiciel.

#### Piège n°3 : l'effet yo-yo et les hiérarchies profondes

Empiler les niveaux d'héritage rend le code illisible et ingérable :

```typescript
class Entite { /* ... */ }
class ObjetMetier extends Entite { /* ... */ }
class Ressource extends ObjetMetier { /* ... */ }
class Media extends Ressource { /* ... */ }
class DocumentPapier extends Media { /* ... */ }
class Livre extends DocumentPapier { /* ... */ }
```

Six niveaux d'héritage produisent l'**effet yo-yo** : pour comprendre ce que fait une seule méthode de `Livre`, le développeur doit ouvrir `Livre.ts` (appelle `super.m()`), puis `DocumentPapier.ts` (ne redéfinit rien), puis `Media.ts` (appelle `super.m()`), puis `Ressource.ts`… Son cerveau oscille sans cesse entre six fichiers, ce qui fatigue, complexifie le débogage et masque les responsabilités.

> **Règle d'or en pratique** : ne jamais dépasser 2 à 3 niveaux d'héritage.

---

## 2. Démonstration Angular

La démonstration consiste à intégrer la hiérarchie de classes métier `Media` / `Livre` / `Film` au sein d'un composant Angular Standalone simple. Le mini-projet est mis à disposition des étudiants via `git clone` / `git pull` ; la démonstration se déroule en suivant les étapes ci-dessous.

### 2.1 Architecture du projet

On sépare rigoureusement la **logique métier pure** (classes TypeScript sans aucune dépendance Angular) des **composants d'interface** :

```
src/app/
├── models/                     # 100 % TypeScript pur (agnostique d'Angular)
│   ├── media.model.ts          # Classe de base
│   ├── livre.model.ts          # Classe dérivée
│   └── film.model.ts           # Classe dérivée
│
└── components/                 # Présentation Angular
    └── bibliotheque/
        ├── bibliotheque.component.ts    # Composant Standalone + Signals
        ├── bibliotheque.component.html  # Template + Control Flow (@for)
        └── bibliotheque.component.css   # Styles encapsulés
```

**Principe essentiel à faire remarquer** : les modèles métier ne dépendent pas du framework. Aucun décorateur `@Component`, aucun import d'Angular : ces classes fonctionnent partout (Node.js, un script CLI, un autre framework). Angular n'est que la couche d'affichage.

### 2.2 Étape 1 — Classe de base : `media.model.ts`

```typescript
// src/app/models/media.model.ts
export class Media {
  // Attributs protégés : accessibles par Livre et Film
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  // Comportement universel à tous les médias
  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}
```

À souligner : le constructeur propre, la visibilité `protected` qui transmet l'état de façon sécurisée aux classes dérivées, et la méthode `getDescription()` fournissant le comportement par défaut.

### 2.3 Étape 2 — Classes spécialisées : `Livre` et `Film`

```typescript
// src/app/models/livre.model.ts
import { Media } from './media.model';

export class Livre extends Media {
  private nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee); // 1. Fondation (Media)
    this.nombrePages = pages;
  }

  getNombrePages(): number {
    return this.nombrePages;
  }

  override getDescription(): string {
    return `${super.getDescription()} — ${this.nombrePages} p.`;
  }
}
```

```typescript
// src/app/models/film.model.ts
import { Media } from './media.model';

export class Film extends Media {
  private dureeMinutes: number;

  constructor(titre: string, annee: number, duree: number) {
    super(titre, annee); // 1. Fondation (Media)
    this.dureeMinutes = duree;
  }

  getDureeMinutes(): number {
    return this.dureeMinutes;
  }

  override getDescription(): string {
    return `${super.getDescription()} — ${this.dureeMinutes} min`;
  }
}
```

La symétrie parfaite des deux classes filles illustre la factorisation : chaque classe dérivée est ultra-courte car tout le socle a été écrit une seule fois dans `Media`. Les deux redéfinitions réutilisent `super.getDescription()` et n'y apposent que leur spécialité.

### 2.4 Étape 3 — Composant Angular : `BibliothequeComponent`

```typescript
// src/app/components/bibliotheque/bibliotheque.component.ts
import { Component, signal } from '@angular/core';
import { Media } from '../../models/media.model';
import { Livre } from '../../models/livre.model';
import { Film } from '../../models/film.model';

@Component({
  selector: 'app-bibliotheque',
  standalone: true,
  templateUrl: './bibliotheque.component.html',
  styleUrl: './bibliotheque.component.css'
})
export class BibliothequeComponent {
  collection = signal<Media[]>([
    new Livre('Le Petit Prince', 1943, 96),
    new Film('Inception', 2010, 148),
    new Livre('Les Misérables', 1862, 1462),
    new Film('Interstellar', 2014, 169)
  ]);
}
```

**Point capitale à mettre en évidence** : la variable `collection` est typée `Media[]`, mais elle accueille indifféremment des `Livre` et des `Film`. TypeScript l'accepte car un `Livre` *est un* `Media` : c'est l'expression directe de la relation « est-un » dans le système de types. (La mécanique d'exécution qui permet à chaque objet d'utiliser *sa propre* version de `getDescription()` — le polymorphisme — fera l'objet de la séance 7 ; on se contente ici de constater le fait empiriquement.)

Sur le plan Angular, le composant est `standalone: true` et son état est géré par un **`signal()`**, conformément à l'approche signal-first du cours.

### 2.5 Étape 4 — Template HTML avec Control Flow moderne

```html
<!-- bibliotheque.component.html -->
<div class="container mt-4">
  <h2 class="mb-3">📚 Ma Médiathèque</h2>

  <div class="list-group">
    @for (media of collection(); track media.getDescription()) {
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <span class="fw-semibold">{{ media.getDescription() }}</span>
        </div>
        <span class="badge bg-secondary rounded-pill">
          Média
        </span>
      </div>
    } @empty {
      <p class="text-muted">Aucun média dans la collection.</p>
    }
  </div>
</div>
```

Le template appelle `media.getDescription()` sur chaque élément de la boucle `@for` (syntaxe de Control Flow native, avec `track` et la branche `@empty`). Pour chaque objet, c'est la version spécialisée — celle de `Livre` ou celle de `Film` — qui produit le texte affiché.

### 2.6 Ce qu'il faut retenir de la démonstration

- **Architecture découplée** — les modèles métier sont en pur TypeScript, testables indépendamment de toute interface web ;
- **Modernité Angular** — composant `standalone: true`, état géré via `signal()`, rendu par `@for` ;
- **Encapsulation respectée** — le composant interagit avec le modèle uniquement via son API publique (`getDescription()`), sans jamais toucher aux membres `protected` ;
- **Question laissée en suspens** — le template appelle `media.getDescription()` sur un tableau de `Media`, et pourtant le résultat affiche bien les pages ou les minutes : comment le moteur sait-il quelle méthode appeler pour chaque objet ? C'est la séance 7 (polymorphisme et liaison dynamique) qui apportera la réponse.

---


