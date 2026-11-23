# Séance 13 — Composants & Signals : L'Architecture Réactive Fine

**Cours de programmation orientée objet — Bachelier en informatique (EAFC)**  
**Stack technique : TypeScript 5+, Angular 22 (approche signal-first)**

---

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant est en mesure de :

1. **Comprendre la révolution du modèle réactif fin (*Fine-Grained Reactivity*)** : identifier les limites historiques du modèle de détection de changements global (*Dirty Checking* et Zone.js), comprendre le fonctionnement d'un graphe de dépendances orienté sans cycle (DAG) et appréhender la synchronisation chirurgicale du DOM sans recompilation générale de la vue.
2. **Maîtriser les primitives fondamentales d'état réactif** : manipuler le conteneur mutable `signal<T>()`, appliquer rigoureusement ses opérations de mise à jour (`.set()`, `.update()`, `.asReadonly()`), et intégrer le prédicat d'égalité personnalisé pour sécuriser les transitions d'état.
3. **Structurer les états dérivés avec `computed()`** : concevoir des projections réactives pures, sans effet de bord, tirer parti de la mémorisation automatique (*memoization*), du suivi dynamique de dépendances (*glitch-free reactivity*) et de l'évaluation paresseuse (*lazy evaluation*).
4. **Orchestrer les effets de bord contrôlés avec `effect()`** : identifier le rôle restreint mais indispensable de la primitive d'effet (journalisation, synchronisation avec des APIs externes du navigateur, rendu Canvas/WebGL), respecter scrupuleusement le contexte d'injection et maîtriser la fonction de nettoyage (*cleanup function*).
5. **Rénover la communication inter-composants avec les nouvelles APIs Signal-First** : remplacer définitivement les décorateurs patrimoniaux (`@Input`, `@Output`) par `input<T>()`, `input.required<T>()` (avec fonctions de transformation), `output<T>()` et la liaison bidirectionnelle moderne via `model<T>()`.
6. **Harmoniser les principes POO et la réactivité moderne** : appliquer l'encapsulation stricte aux signaux d'état (signaux sources privés, signaux calculés publics en lecture seule), préserver les invariants métier lors des transitions et combiner l'immutabilité acquise en Séance 12 avec le rafraîchissement d'interface.
7. **Bâtir un composant réactif complet et autonome** : assembler une interface utilisateur dynamique sous Angular 22 (la commande d'une friterie : signaux sources, prix dérivés, composants enfants et compteur bidirectionnel) en exploitant le nouveau flux de contrôle déclaratif (`@for`, `@empty`).

---

## Partie 00 — Le cheminement : d'où venons-nous ?

Cette treizième séance marque un tournant majeur dans notre cursus : elle ouvre le **Bloc C**, consacré à l'ingénierie réactive avancée sous **Angular 22**.

Dressons le bilan de notre parcours pour mesurer l'importance de cette transition :

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
│    • S12 — Les Objets eux-mêmes : Identité, Clonage & Immutabilité          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ⚡ BLOC C — Angular en Signal-First, Approfondissement (Séances 13 à 15)     │
│    • S13 — Aujourd'hui : Composants & Signals (Primitives & Communication)  │
│    • S14 — Services Métier, Génériques avancés & Injection de Dépendance    │
│    • S15 — Signal Forms, Validation Déclarative & Routing d'Entreprise      │
└─────────────────────────────────────────────────────────────────────────────┘
```

Dans les séances précédentes, nous avons abordé la POO comme un ensemble de règles architecturales strictes et intemporelles :
- En **Séance 05**, nous avons appris à interdire l'accès direct aux attributs pour protéger les invariants.
- En **Séance 11**, nous avons dissocié les rôles selon le principe de responsabilité unique (SRP) et inversé les couplages (DIP).
- En **Séance 12**, nous avons exploré le modèle mémoire (Pile vs Tas) et constaté qu'Angular s'appuie sur la comparaison par référence (`Object.is`) pour détecter le moindre changement.

Désormais, nous allons répondre à la question centrale de tout système interactif moderne :

> **« Comment lier l'état interne d'un objet métier à l'interface visuelle sans gaspiller de cycles processeur, sans synchronisation manuelle et sans risque d'incohérence ? »**

Angular ne constitue pas une matière distincte de l'Orienté Objet : il en est le **prolongement graphique et interactif**. Les Signals représentent la façon la plus pure d'incarner l'état et l'encapsulation dans le développement logiciel contemporain.

---

## Partie 01 — La Révolution Réactive : Pourquoi les Signals ?

### 1.1 La Crise de la détection de changements traditionnelle (*Dirty Checking* & Zone.js)

Pour comprendre l'enthousiasme de l'industrie pour les Signals, il convient d'analyser la façon dont les frameworks web ont historiquement résolu le problème de la mise à jour graphique.

Dans les architectures Angular classiques (versions 2 à 15), le framework utilisait une bibliothèque nommée **Zone.js**. Le principe reposait sur le « monkey patching » (la substitution invisible au runtime) de l'ensemble des APIs asynchrones natives du navigateur : `setTimeout`, `setInterval`, `Promise`, `fetch`, et tous les écouteurs d'événements `addEventListener`.

Chaque fois qu'un événement utilisateur survenait (un clic de souris, une réponse HTTP reçue, une temporisation écoulée), Zone.js interceptait l'appel et lançait une alerte générale au framework : *« Une action asynchrone vient de se produire ! Quelque chose a peut-être changé dans les données ! »*.

```
┌────────────────────────────────────────────────────────────────────────┐
│             L'ANCIEN MONDE : DÉTECTION GLOBALE AVEC ZONE.JS            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. L'utilisateur clique sur un simple bouton compteur (+1).            │
│ 2. Zone.js intercepte l'événement de clic.                             │
│ 3. Angular ignore OÙ la donnée a été modifiée dans la mémoire.         │
│ 4. Angular parcourt TOUT l'arbre des composants, de haut en bas,       │
│    en réévaluant chaque expression dans chaque template HTML !         │
│                                                                        │
│                    [ Composant Racine (App) ]                          │
│                           /          \                                 │
│                  [ Navigation ]    [ Catalogue ]                       │
│                     /        \        /      \                         │
│                 [ Liens ]  [ Profil ][ Carte ][ Compteur (+1) ]        │
│                    ⬇           ⬇        ⬇          ⬇                   │
│                (Vérifié)   (Vérifié) (Vérifié)  (Mis à jour)           │
│                                                                        │
│ ➔ 99% des vérifications étaient inutiles !                            │
└────────────────────────────────────────────────────────────────────────┘
```

Cette approche présentait de lourdes limites d'ingénierie :
1. **Surcoût processeur massif** : Même pour incrémenter un simple entier dans un composant feuille, des centaines de liaisons de template étaient recalculées à travers toute l'application (*Dirty Checking* généralisé).
2. **La boîte noire de Zone.js** : En interceptant le moteur asynchrone du navigateur, Zone.js alourdissait le bundle initial, brouillait les traces de pile d'appels (*stack traces*) et empêchait l'usage transparent des fonctionnalités ECMAScript modernes telles que le `async / await` natif compilé sans polyfill.
3. **L'illusion de la réactivité** : L'état lui-même n'était pas réactif ; c'était le moteur qui scannait continuellement la mémoire pour détecter d'éventuelles différences par force brute.

---

### 1.2 Le Modèle Réactif Fin (*Fine-Grained Reactivity*) et le mode Zoneless

Les **Signals** introduisent un changement de paradigme fondamental. Au lieu de surveiller l'ensemble de l'application à l'aveugle, Angular s'appuie désormais sur un **graphe de dépendances précis et dynamique** (un graphe orienté acyclique, ou DAG).

Un Signal est un conteneur d'état réactif doté d'une double faculté :
1. **En écriture** : Il avertit directement et exclusivement les consommateurs abonnés lorsque sa valeur est modifiée.
2. **En lecture** : Il enregistre silencieusement le contexte consommateur (un template HTML, un calcul dérivé, un effet) au moment exact où sa valeur est consultée.

```
┌────────────────────────────────────────────────────────────────────────┐
│             LE MONDE MODERNE : RÉACTIVITÉ FINE AVEC LES SIGNALS        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. L'utilisateur clique sur le bouton (+1).                            │
│ 2. L'instruction 'compteur.update(n => n + 1)' modifie le signal.      │
│ 3. Seul le nœud DOM directement branché sur 'compteur()' est notifié.  │
│ 4. Aucun parcours d'arbre ! Aucun composant parent ou voisin n'est     │
│    sollicité !                                                         │
│                                                                        │
│                    [ Composant Racine (App) ]                          │
│                           /          \                                 │
│                  [ Navigation ]    [ Catalogue ]                       │
│                     /        \        /      \                         │
│                 [ Liens ]  [ Profil ][ Carte ][ Compteur (+1) ]        │
│                    💤          💤       💤         ⚡                  │
│                (Endormi)   (Endormi)(Endormi) (Mise à jour directe)    │
│                                                                        │
│ ➔ Mise à jour chirurgicale, instantanée et prédictible (Zoneless).     │
└────────────────────────────────────────────────────────────────────────┘
```

Grâce à cette précision atomique, Angular 22 fonctionne en mode **Zoneless natif** : le framework n'embarque plus Zone.js dans le binaire déployé, le temps de chargement initial diminue considérablement et les performances d'exécution atteignent les plus hauts standards de l'industrie.

---

### 1.3 Les Deux Grandes Analogies pour Tout Comprendre

Pour ancrer définitivement ce modèle dans votre intuition de développeur, faisons appel à deux représentations visuelles :

#### 1. L'Analogie de la gare : L'employé de quai vs Le panneau d'affichage numérique
- **Ancien modèle (Zone.js)** : Un train entre en gare. Un employé doit courir à travers les 24 voies de la gare, vérifier chaque écriteau en bois un par un, pour constater que seule la voie 4 a changé. C'est un gaspillage absurde d'énergie.
- **Nouveau modèle (Signals)** : Chaque quai est relié par fibre optique au grand panneau d'affichage numérique central. Dès que le signal de la voie 4 bascule, seules les diodes de la ligne 4 s'illuminent. Les voies 1 à 3 et 5 à 24 restent parfaitement inactives.

#### 2. L'Analogie du tableur Excel (Le modèle mathématique du Signal)
Pensez à une feuille de calcul Excel :
- La cellule **A1** contient la valeur brute `10` (c'est un `signal`).
- La cellule **B1** contient la formule `= A1 * 2` (c'est un `computed`).
- Si vous modifiez **A1** pour mettre `25`, Excel ne recalcule pas les 10 000 autres formules de votre classeur ! Il recalcule **B1** immédiatement, parce qu'il sait que **B1 dépend de A1**.  
Un `computed` Angular se comporte exactement comme une cellule de tableur : il recalcule sa valeur dès que sa cellule source évolue, et met son résultat en mémoire tampon.

---

### 1.4 Tableau comparatif : Zone.js vs Angular Signals

| Critère d'ingénierie | Approche patrimoniale (Zone.js / Dirty Checking) | Approche moderne (Signals / Signal-First) |
|---|---|---|
| **Granularité de détection** | Composant / Arborescence complète de l'application. | **Atomique / Nœud de DOM ciblé** (*Fine-Grained*). |
| **Mécanisme sous-jacent** | Interception des APIs asynchrones du navigateur (*monkey patching*). | **Graphe de dépendances dynamique orienté (DAG)**. |
| **Moment du calcul** | À chaque tick asynchrone (clic, timer, requête HTTP). | **Sur demande (*Pull*) lors de la lecture, notifié (*Push*) lors de l'écriture**. |
| **Performance d'exécution** | Dégradée sur les grands arbres de composants. | **Optimale et constante**, indépendante de la taille de l'arbre. |
| **Poids du bundle (*Footprint*)** | Poids additionnel de la bibliothèque Zone.js (~30-40 ko). | **0 ko additionnel** (architecture native Zoneless dans Angular 22). |
| **Débogage & Diagnostic** | Piles d'appels obscurcies par les intercepteurs Zone.js. | **Piles d'appels natives et transparentes**, `async/await` natif standard. |

---

## Partie 02 — Les Primitives Réactives Fondamentales : `signal`, `computed` & `effect`

L'architecture réactive d'Angular 22 est régie par un triptyque fondamental :
1. **Le producteur primaire d'état** : `signal<T>()`
2. **Le transformateur pur d'état dérivé** : `computed<T>()`
3. **Le consommateur terminal d'effets de bord** : `effect()`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   LE TRIO DES PRIMITIVES RÉACTIVES ANGULAR                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────┐        ┌──────────────────┐        ┌────────────────┐   │
│   │   signal()    │ ────>  │    computed()    │ ────>  │    effect()    │   │
│   │ (Source brute)│        │ (Valeur dérivée) │        │ (Effet de bord)│   │
│   └───────────────┘        └──────────────────┘        └────────────────┘   │
│          ▲                          ▲                          ▲            │
│      Écriture                   Projection                 Consommation     │
│    (set / update)             (Pure / Mémorisée)          (DOM / Console)   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.1 Le Signal Source : `signal<T>()`

Un signal source (représenté par le type TypeScript `WritableSignal<T>`) est une case mémoire réactive accessible en lecture et en écriture.

#### Déclaration et initialisation :
Pour instancier un signal, on invoque la fonction `signal()` en lui fournissant obligatoirement une valeur initiale :

```typescript
import { signal, WritableSignal } from '@angular/core';

// Signal contenant un nombre primitif :
const score: WritableSignal<number> = signal<number>(0);

// Signal contenant une chaîne de caractères :
const nomUtilisateur = signal<string>('Alexandre');

// Signal contenant une collection :
const identifiants = signal<number[]>([101, 102, 103]);
```

#### Lecture de la valeur :
Pour obtenir la valeur encapsulée dans le signal, **on invoque le signal comme une fonction sans argument** :

```typescript
console.log(score());          // Affiche : 0
console.log(nomUtilisateur());    // Affiche : "Alexandre"
```

> 🔬 **Sous le capot : pourquoi une fonction `()` et non une simple variable ?**  
> Lorsque JavaScript exécute `score()`, le moteur d'Angular regarde quel contexte est en train de s'exécuter (un template HTML, une formule `computed()`, un `effect()`). Si un contexte réactif est actif, Angular l'ajoute immédiatement à la liste des abonnés de `score`. L'appel de fonction est l'hameçon invisible qui tisse le graphe de dépendance !

#### Mutation d'état : `.set()` vs `.update()`

Pour modifier la valeur d'un `WritableSignal`, deux méthodes strictes s'offrent à nous :

1. **Le remplacement unilatéral : `.set(nouvelleValeur)`**  
   Utilisé lorsque la nouvelle valeur est déterminée de manière autonome, sans lien avec la valeur précédente.
   ```typescript
   score.set(50); // Le score vaut immédiatement 50
   ```

2. **La transition fonctionnelle : `.update(fonctionDeCalcul)`**  
   Utilisé lorsque la nouvelle valeur est calculée à partir de la valeur précédente. La fonction passée en argument reçoit la valeur courante et doit impérativement retourner la nouvelle valeur.
   ```typescript
   // Incrémentation sûre et atomique :
   score.update((valeurActuelle: number) => valeurActuelle + 1);
   ```

#### ⚠️ Le Rappel Crucial de la Séance 12 : L'Immutabilité obligatoire

Comme nous l'avons démontré lors de l'étude de la Pile et du Tas, Angular utilise par défaut la fonction standard ECMAScript `Object.is(ancienneValeur, nouvelleValeur)` pour décider s'il doit propager la notification.

```typescript
// ❌ ANTI-PATTERN MAJEUR : Muter un objet ou un tableau en place dans le Tas
const panier = signal<string[]>(['Pomme', 'Poire']);

panier().push('Orange'); // 💥 Modification directe de l'objet à l'adresse 0x10A !
panier.set(panier());    // Object.is(0x10A, 0x10A) renvoie TRUE !
// Conséquence : Angular déduit que rien n'a bougé. Le template HTML RESTE FIGÉ !

// ✅ BONNE PRATIQUE ARCHITECTURALE : Produire une nouvelle référence mémoire
panier.update((anciensFruits) => [...anciensFruits, 'Orange']);
// Une nouvelle adresse mémoire (0x20B) est créée : Angular réveille le DOM !
```

#### Personnalisation du prédicat d'égalité : l'option `equal`

Si vous stockez des instances de classes métier équipées d'une méthode `equals()` (développée en Séance 12), vous pouvez indiquer au signal d'utiliser votre égalité sémantique plutôt que l'égalité de référence par défaut :

```typescript
import { signal } from '@angular/core';
import { Article } from './article.model';

const articleActif = signal<Article>(
  new Article(42, 'Clavier Mécanique', 99),
  {
    // Empêche la propagation si l'article porte le même identifiant métier :
    equal: (artA, artB) => artA.equals(artB)
  }
);
```

#### Verrouillage en lecture seule : `.asReadonly()`

Pour garantir l'encapsulation au sein d'une classe ou d'un service, on ne doit jamais exposer un `WritableSignal` directement au monde extérieur. On expose une projection en lecture seule (`Signal<T>`) produite par `.asReadonly()` :

```typescript
export class ChronometreService {
  // Source privée modifiable :
  private readonly _secondes = signal<number>(0);

  // Vue publique protégée en lecture seule :
  public readonly secondes = this._secondes.asReadonly();

  public tic(): void {
    this._secondes.update(s => s + 1);
  }
}

// Appelant extérieur :
const chrono = new ChronometreService();
console.log(chrono.secondes()); // ✅ Lecture autorisée : 0
// chrono.secondes.set(10);     // ❌ ERREUR DE COMPILATION TYPESCRIPT !
```

---

### 2.2 L'État Dérivé Mémorisé : `computed<T>()`

Un signal calculé via `computed()` représente une valeur dérivée d'autres signaux.

```typescript
import { signal, computed, Signal } from '@angular/core';

const prixHorsTva = signal<number>(100);
const tauxTva = signal<number>(0.21); // 21%

// Signal dérivé calculé :
const prixTTC: Signal<number> = computed(() => {
  return prixHorsTva() * (1 + tauxTva());
});

console.log(prixTTC()); // 121 €
```

#### Les 4 Piliers de `computed()`

1. **Évaluation Paresseuse (*Lazy Evaluation*)** : La fonction passée à `computed()` n'est pas exécutée à sa déclaration. Elle s'exécute uniquement la toute première fois qu'un observateur (un template, un log, un autre signal) lit sa valeur. Si personne ne lit `prixTTC()`, le processeur n'effectue aucun calcul.
2. **Mémorisation Intelligente (*Memoization*)** : Tant que ni `prixHorsTva` ni `tauxTva` ne sont modifiés, vous pouvez lire `prixTTC()` 1 000 fois dans votre template HTML : la fonction de calcul ne tournera **qu'une seule fois**. Le résultat est servi directement depuis le cache mémoire.
3. **Immuabilité intrinsèque** : Un `computed()` retourne toujours un `Signal<T>` en lecture seule. Il ne dispose d'aucune méthode `.set()` ou `.update()`. Sa valeur est l'esclave absolue de ses sources amont.
4. **Garantie sans anomalie (*Glitch-Free DAG*)** : Si un calcul dépend de deux signaux intermédiaires qui dépendent eux-mêmes d'une même source racine (le motif du « diamant » réactif), Angular garantit que le calcul final ne sera évalué qu'une fois que l'ensemble des branches aura terminé sa transition. Il n'existe aucun état intermédiaire invalide ou incohérent.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LE PROBLÈME DU DIAMANT RÉACTIF (GLITCH)              │
├────────────────────────────────────────────────────────────────────────┤
│                          [ Compteur (1) ]                              │
│                           /            \                               │
│                          v              v                              │
│                 [ EstPair (false) ]   [ Double (2) ]                   │
│                          \              /                              │
│                           v            v                               │
│                    [ Message: "1 est impair, double=2" ]               │
│                                                                        │
│ Dans les mauvais systèmes réactifs, si Compteur passe à 2,             │
│ Message risque d'être lu avec EstPair=true mais Double encore à 2       │
│ (état incohérent : "2 est pair, double=2").                            │
│                                                                        │
│ Angular 22 résout le graphe de façon topologique :                    │
│ Message est mis à jour UNE SEULE FOIS, de manière cohérente :          │
│ "2 est pair, double=4" !                                               │
└────────────────────────────────────────────────────────────────────────┘
```

#### Suivi dynamique des dépendances en temps réel

Le graphe de dépendance est recalculé dynamiquement lors de chaque lecture :

```typescript
const modeExpert = signal<boolean>(false);
const coefficientStandard = signal<number>(1.1);
const coefficientAvance = signal<number>(1.5);
const base = signal<number>(100);

const total = computed(() => {
  if (modeExpert()) {
    // Branche A : suit 'base' et 'coefficientAvance'
    return base() * coefficientAvance();
  } else {
    // Branche B : suit 'base' et 'coefficientStandard'
    return base() * coefficientStandard();
  }
});
```
Tant que `modeExpert()` reste à `false`, modifier `coefficientAvance.set(2.0)` ne provoque **strictement aucun recalcul** de `total()`, car cette variable n'a pas été lue dans la branche active du code.

#### Règle de pureté absolue : Pas d'effet de bord dans `computed()` !

> ⚠️ **RÈGLE CRUCIALE D'INGÉNIERIE**  
> Une fonction passée à `computed()` doit être une **fonction mathématique pure**.  
> - Elle ne doit jamais modifier un autre signal (`signal.set()`).
> - Elle ne doit jamais faire d'appel réseau HTTP ou écrire dans le DOM.
> - Elle ne doit avoir aucun effet secondaire. Elle prend des signaux en entrée et retourne une nouvelle valeur, un point c'est tout.

---

### 2.3 Les Effets de Bord Contrôlés : `effect()`

Un `effect()` est une opération réactive qui s'exécute automatiquement chaque fois qu'un des signaux lus à l'intérieur subit une modification.

```typescript
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-audit-connexion',
  standalone: true,
  template: `<p>Utilisateur : {{ login() }}</p>`
})
export class AuditConnexionComponent {
  login = signal<string>('invité');

  constructor() {
    // Déclaration obligatoire au sein du Contexte d'Injection :
    effect(() => {
      console.log(`[JOURNAL D'AUDIT] Changement d'utilisateur : ${this.login()}`);
    });
  }
}
```

#### Le Contexte d'Injection (*Injection Context*)

Un effet surveille le cycle de vie du composant dans lequel il réside. Pour être capable de se détruire automatiquement lorsque le composant quitte l'écran (évitant ainsi les fuites de mémoire fatales), `effect()` doit impérativement être instancié au moment où Angular initialise l'injection de dépendances :
- Soit directement dans le **`constructor()`** de la classe.
- Soit au niveau de l'assignation directe d'un champ de classe : `private logEffect = effect(...)`.

Si vous tentez d'appeler `effect()` à l'intérieur d'une méthode ordinaire (ex: dans un gestionnaire de clic `onClick()`), Angular lèvera l'exception :  
`NG0203: effect() can only be used within an injection context`.

#### 🚫 L'Anti-Pattern : Utiliser `effect()` à la place de `computed()`

De nombreux développeurs débutants écrivent des effets pour synchroniser des variables entre elles :

```typescript
// ❌ ANTI-PATTERN ABSOLU : Ne faites jamais cela !
const quantite = signal<number>(2);
const prix = signal<number>(50);
const total = signal<number>(0);

effect(() => {
  // Mauvaise pratique : écriture impérative manuelle
  total.set(quantite() * prix()); 
});

// ✅ LA BONNE PRATIQUE NATIVE : Déclaration pure avec computed()
const quantitePropre = signal<number>(2);
const prixPropre = signal<number>(50);
const totalPropre = computed(() => quantitePropre() * prixPropre());
```

Pour protéger les développeurs contre les boucles réactives infinies, Angular 22 interdit par défaut toute écriture dans un signal à l'intérieur d'un `effect()`. Tenter de faire `monSignal.set(...)` dans un effet provoque l'erreur :  
`NG0600: Writing to signals is not allowed in a computed or an effect by default`.

#### Les Cas d'Usage Légitimes de `effect()` :
- **Persistance dans le Web Storage** : Sauvegarder un panier ou un token dans `localStorage` ou `sessionStorage`.
- **Synchronisation avec des librairies tierces non-Angular** : Tracer des courbes avec Chart.js, animer une scène Three.js ou positionner un marqueur sur Leaflet.
- **Manipulation chirurgicale du document web** : Modifier la balise `<title>` de la page HTML ou manipuler un élément HTML5 `<canvas>`.
- **Télémétrie et traçage applicatif** : Envoyer des événements analytiques à une plateforme distante.

#### Libération de ressources avec `onCleanup`

Si votre effet déclenche une tâche asynchrone (un abonnement externe, un écouteur DOM natif, un timer), il vous fournit un callback de nettoyage nommé `onCleanup`. Ce callback s'exécute automatiquement avant la prochaine invocation de l'effet et lors de la destruction finale du composant :

```typescript
effect((onCleanup) => {
  const identifiant = this.articleId();
  
  const timer = setInterval(() => {
    console.log(`Vérification périodique des stocks pour l'article #${identifiant}`);
  }, 10000);

  // Enregistrement de la procédure de nettoyage :
  onCleanup(() => {
    clearInterval(timer);
    console.log(`Timer arrêté pour l'article #${identifiant}`);
  });
});
```

---

## Partie 03 — Communication Réactive : `input()`, `output()` et `model()`

La communication entre composants est la colonne vertébrale de toute architecture modulaire (rappel du principe de composition de la **Séance 09**).

Dans les versions historiques d'Angular, cette communication s'appuyait sur des décorateurs TypeScript (`@Input()` et `@Output()`) et sur la classe `EventEmitter` issue de RxJS.

Angular 22 a totalement refondu cette couche avec des fonctions déclaratives orientées signaux :

```
┌────────────────────────────────────────────────────────────────────────┐
│             L'ÉVOLUTION DES COMMUNICATIONS COMPOSANTS                 │
├────────────────────────────────────────────────────────────────────────┤
│ RÔLE ARCHITECTURAL     │ SYNTAXE PATRIMONIALE   │ SYNTAXE MODERNE S13  │
├────────────────────────┼────────────────────────┼──────────────────────┤
│ Entrée de données      │ @Input() valeur        │ input()              │
│ Entrée obligatoire     │ @Input({ required })   │ input.required()     │
│ Sortie d'événement     │ @Output() chg = new EE │ output()             │
│ Liaison bidirectionnelle│ @Input + @Output       │ model()              │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1 Les Entrées Réactives : `input<T>()`

Une entrée déclarée avec la fonction `input()` est un **signal en lecture seule (`InputSignal<T>`)**.

```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-indicateur-stock',
  standalone: true,
  template: `
    <div [class]="classeAlerte()">
      Stock disponible : {{ quantite() }} unités
    </div>
  `
})
export class IndicateurStockComponent {
  // 1. Entrée optionnelle dotée d'une valeur par défaut (5) :
  seuilCritique = input<number>(5);

  // 2. Entrée obligatoire : une erreur de compilation TS surgit si le parent l'omet !
  quantite = input.required<number>();

  // 3. Calcul dérivé immédiat sans avoir recours au crochet ngOnChanges :
  classeAlerte = computed(() => {
    return this.quantite() <= this.seuilCritique() ? 'badge-danger' : 'badge-succes';
  });
}
```

Dans le template du composant parent :
```html
<app-indicateur-stock [quantite]="stockArticles()" [seuilCritique]="10" />
```

#### Les Fonctions de Transformation : `transform`

L'API `input()` intègre un mécanisme natif de coercition de types pour convertir automatiquement les valeurs transmises depuis les templates HTML :

```typescript
import { Component, input, numberAttribute, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-vignette-produit',
  standalone: true,
  template: `<p>{{ reference() }} - En promo : {{ promotion() }} - Prix : {{ tarif() }}€</p>`
})
export class VignetteProduitComponent {
  reference = input.required<string>();

  // Convertit automatiquement la chaîne "149.90" passée en HTML en nombre 149.90 :
  tarif = input(0, { transform: numberAttribute });

  // Convertit la simple présence de l'attribut HTML (<... promotion>) en booléen true :
  promotion = input(false, { transform: booleanAttribute });
}
```

---

### 3.2 Les Sorties Réactives : `output<T>()`

Pour émettre des messages vers l'extérieur sans dépendre de la lourde machinerie RxJS, nous utilisons la fonction `output<T>()` qui retourne un `OutputEmitterRef<T>` :

```typescript
import { Component, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-compteur-touches',
  standalone: true,
  template: `<button (click)="valider()">Valider la saisie</button>`
})
export class CompteurTouchesComponent {
  // Déclaration explicite et fortement typée de l'événement de sortie :
  validationEffectuee: OutputEmitterRef<string> = output<string>();

  valider(): void {
    // Émission du message vers le composant parent :
    this.validationEffectuee.emit('Saisie approuvée par l'utilisateur');
  }
}
```

Dans le composant parent :
```html
<app-compteur-touches (validationEffectuee)="traiterValidation($event)" />
```

---

### 3.3 La Révolution de la Liaison Bidirectionnelle : `model<T>()`

La liaison bidirectionnelle (*Two-Way Binding*) est l'un des besoins les plus fréquents en interface graphique : permettre à un composant parent et à un composant enfant de partager une même donnée, de telle sorte que si l'un la modifie, l'autre est immédiatement synchronisé.

Autrefois, cela imposait de respecter une pénible convention de nommage : créer un `@Input() valeur` et un `@Output() valeurChange = new EventEmitter()`.

L'API **`model()`** d'Angular 22 unifie les deux mécanismes en une seule primitive : un **`ModelSignal<T>`**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LE FONCTIONNEMENT DE MODEL<T>()                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│        Composant Parent                         Composant Enfant       │
│   ┌────────────────────────┐                ┌──────────────────────┐   │
│   │ volume = signal(50);   │                │ volume = model(0);   │   │
│   │                        │                │                      │   │
│   │ Template :             │                │ Enfant modifie :     │   │
│   │ [(volume)]="volume"    │ ─────────────> │ volume.update(v=>v+5)│   │
│   │                        │ <───────────── │                      │   │
│   │ La donnée circule dans │   Synchronisé  │ Le parent est mis    │   │
│   │ les deux sens !        │   immédiatement│ à jour sans effort ! │   │
│   └────────────────────────┘                └──────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### Implémentation du composant enfant réutilisable :

```typescript
import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'app-interrupteur',
  standalone: true,
  template: `
    <button 
      (click)="basculer()"
      [style.background]="actif() ? '#10b981' : '#64748b'"
      class="px-3 py-1.5 rounded text-white font-bold text-xs cursor-pointer">
      {{ actif() ? 'ACTIVÉ' : 'DÉSACTIVÉ' }}
    </button>
  `
})
export class InterrupteurComponent {
  // Déclaration du signal bidirectionnel model() :
  actif: ModelSignal<boolean> = model<boolean>(false);

  basculer(): void {
    // La modification locale s'écrit localement ET émet automatiquement vers le parent !
    this.actif.update(etat => !etat);
  }
}
```

#### Consommation sans aucune tuyauterie manuelle dans le parent :

```typescript
@Component({
  selector: 'app-panneau-controle',
  standalone: true,
  imports: [InterrupteurComponent],
  template: `
    <!-- La célèbre syntaxe "boîte à bananes" [()] synchronise les deux signaux ! -->
    <app-interrupteur [(actif)]="systemeEnLigne" />
    
    <p>État perçu par le parent : {{ systemeEnLigne() ? 'Opérationnel' : 'Arrêté' }}</p>
  `
})
export class PanneauControleComponent {
  systemeEnLigne = signal<boolean>(false);
}
```

---

## Partie 04 — POO & Signals : Encapsulation, Invariants & Immutabilité

Le plus grand écueil pour les développeurs juniors est d'aborder un framework comme une rupture avec les principes de conception logicielle. C'est une erreur grave.

Dans une architecture logicielle saine, les signaux ne remplacent pas les classes et les objets : **ils constituent le moteur réactif qui anime l'état des objets**.

---

### 4.1 L'Encapsulation Stricte de l'État : Le Motif « Private Source, Public Readonly Projection »

En **Séance 05**, nous avons martelé ce principe fondamental de la POO :  
*« Un objet doit être maître de son état interne. Tout champ public exposé sans contrôle est une brèche béante dans l'encapsulation. »*

Si vous déclarez un `WritableSignal` public dans une classe, n'importe quel tiers peut faire `monObjet.solde.set(-50000)` et anéantir tous les invariants de votre système :

```typescript
// ❌ VIOLATION GRAVE DE L'ENCAPSULATION (Anti-pattern)
export class CompteBancaireComponent {
  // Champ public modifiable à volonté depuis l'extérieur !
  public solde = signal<number>(1000);
}
```

La règle d'or en ingénierie logicielle Angular consiste à séparer rigoureusement la **source mutable privée** de la **projection immuable publique** :

```typescript
// ✅ CONCEPTION POO STRICTE : Encapsulation totale et protection des invariants
import { Component, signal, Signal } from '@angular/core';

@Component({
  selector: 'app-compte-bancaire',
  standalone: true,
  template: `<p>Solde actuel : {{ solde() }} €</p>`
})
export class CompteBancaireComponent {
  // 1. Source de vérité STRICTEMENT PRIVÉE :
  private readonly _solde = signal<number>(1000);

  // 2. Projection publique STRICTEMENT EN LECTURE SEULE :
  public readonly solde: Signal<number> = this._solde.asReadonly();

  // 3. Méthodes d'affaires contrôlant scrupuleusement les invariants (Séance 05) :
  public deposer(montant: number): void {
    if (montant <= 0) {
      throw new Error("Le montant du dépôt doit être strictement positif.");
    }
    this._solde.update(actuel => actuel + montant);
  }

  public retirer(montant: number): void {
    if (montant <= 0) {
      throw new Error("Le montant du retrait doit être strictement positif.");
    }
    if (this._solde() - montant < 0) {
      throw new Error("Opération refusée : solde insuffisant (pas de découvert autorisé).");
    }
    this._solde.update(actuel => actuel - montant);
  }
}
```

```
┌────────────────────────────────────────────────────────────────────────┐
│             LE MODÈLE D'ENCAPSULATION EN ARCHITECTURE SIGNALS          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   COMPOSANTS EXTERNES / TEMPLATE         CŒUR DU COMPOSANT MÉTIER      │
│  ┌──────────────────────────────┐       ┌───────────────────────────┐  │
│  │ Lecture :                    │ <───  │ public readonly solde     │  │
│  │ solde() (Readonly)           │       │    (Vue asReadonly())     │  │
│  ├──────────────────────────────┤       ├───────────────────────────┤  │
│  │ Commandes métier :           │ ───>  │ Méthode retirer(montant)  │  │
│  │ retirer(montant)             │       │ [Vérification Invariants] │  │
│  │                              │       │           │               │  │
│  │ ❌ Tentative d'écriture :    │       │           v               │  │
│  │ solde.set(0) ➔ REFUSÉ PAR TS │       │ private readonly _solde   │  │
│  │                              │       │ [WritableSignal d'état]   │  │
│  └──────────────────────────────┘       └───────────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 L'Immutabilité en Pratique avec les Entités Métier (Pont avec la Séance 12)

Lors de la **Séance 12**, nous avons vu comment concevoir des classes métier robustes équipées d'une méthode `equals()` et de méthodes de clonage immuables.

Voyons comment ces classes s'intègrent naturellement dans les signaux Angular :

```typescript
// src/app/models/article-panier.model.ts
export class ArticlePanier {
  constructor(
    public readonly id: number,
    public readonly libelle: string,
    public readonly prixUnitaire: number,
    public readonly quantite: number = 1
  ) {
    if (prixUnitaire < 0) throw new Error("Le prix ne peut pas être négatif.");
    if (quantite < 1) throw new Error("La quantité doit valoir au moins 1.");
  }

  /**
   * Égalité sémantique (Séance 12)
   */
  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof ArticlePanier)) return false;
    return this.id === autre.id;
  }

  /**
   * Méthode de clonage immuable produisant une nouvelle instance
   */
  avecQuantite(nouvelleQuantite: number): ArticlePanier {
    return new ArticlePanier(this.id, this.libelle, this.prixUnitaire, nouvelleQuantite);
  }

  public get sousTotal(): number {
    return this.prixUnitaire * this.quantite;
  }
}
```

Dans le composant Angular :

```typescript
// src/app/components/panier.component.ts
import { Component, signal, computed } from '@angular/core';
import { ArticlePanier } from '../models/article-panier.model';

@Component({
  selector: 'app-panier',
  standalone: true,
  template: `<!-- Template -->`
})
export class PanierComponent {
  private readonly _articles = signal<ArticlePanier[]>([
    new ArticlePanier(1, 'Livre TypeScript', 35, 1),
    new ArticlePanier(2, 'Tasse isotherme', 15, 2)
  ]);

  public readonly articles = this._articles.asReadonly();

  // État dérivé calculé proprement via computed() :
  public readonly montantTotal = computed(() => {
    return this._articles().reduce((total, art) => total + art.sousTotal, 0);
  });

  public modifierQuantite(idArticle: number, delta: number): void {
    // ✅ Utilisation de map() : retourne un NOUVEAU tableau et de NOUVELLES instances
    this._articles.update((listeActuelle) =>
      listeActuelle.map((art) => {
        if (art.id === idArticle) {
          const nouvelleQte = art.quantite + delta;
          return nouvelleQte >= 1 ? art.avecQuantite(nouvelleQte) : art;
        }
        return art;
      })
    );
  }
}
```

Cette approche garantit :
1. Une prédictibilité absolue sans effets de bord cachés.
2. Une réactivité parfaite puisque les références changent dans le Tas à chaque opération.
3. Une totale compatibilité avec les tests unitaires purs hors du framework.

---

## Partie 05 — Pièges Fréquents & Anti-Patterns des Développeurs Juniors

| Anti-Pattern Junior | Symptôme / Erreur constatée | Diagnostic & Bonne Pratique |
|---|---|---|
| **1. Omission des parenthèses `()` à la lecture** | Le template affiche `function() { ... }` ou `[Function: signal]` à l'écran. | Un signal est un accesseur fonctionnel : écrivez systématiquement `compteur()` dans le template et `this.compteur()` en TypeScript. |
| **2. Muter les données en place dans le Tas** | `panier().push(article)` : la page refuse de s'actualiser et le DOM reste figé. | `Object.is` ne détecte aucun changement d'adresse. Utilisez `.update(list => [...list, article])` pour fournir une nouvelle référence. |
| **3. Synchroniser des états avec `effect()`** | Boucles infinies d'exécution, plantage du navigateur, erreur `NG0600`. | N'écrivez jamais dans un signal depuis un effet. Utilisez exclusivement `computed()` pour concevoir des états dérivés. |
| **4. Déclencher des effets de bord dans `computed()`** | Calculs relancés arbitrairement, comportements imprévisibles en production. | Un `computed()` doit être une fonction mathématique pure (déterministe, sans appel réseau ni altération extérieure). |
| **5. Créer un `effect()` en dehors de l'injection** | Erreur au runtime : `NG0203: effect() can only be used within an injection context`. | Appelez `effect()` directement dans le `constructor()` de la classe ou au niveau de l'assignation initiale de ses attributs. |
| **6. Graphes de dépendances circulaires** | Erreur de récursion infinie (*Maximum call stack size exceeded*). | Veillez à ce que le flux de données soit strictement unidirectionnel et acyclique (A produit B qui produit C). |

---

## Partie 06 — Démonstration Angular Complète : La Friterie Réactive (*Frit'Kot*)

Pour consolider l'ensemble des concepts, nous concevons une mini-application que tout le monde comprend sans explication métier : la **commande d'une friterie**, **Frit'Kot** 🍟. Tout le monde a déjà commandé un cornet de frites : l'attention est donc entièrement libérée pour la réactivité, qui est le vrai sujet du jour.

Cette application illustre :
- Un modèle de données minimal (`interface Article`) et une fonction pure (`prixLigne`).
- Une source de vérité privée (`signal`) exposée en lecture seule (`asReadonly()`).
- Des états dérivés mémorisés (`computed`) : le total et le nombre d'articles.
- Un effet de bord contrôlé pour la persistance locale (`effect`).
- Des composants modulaires utilisant `input.required()`, `output()` et `model()`.
- Le flux de contrôle déclaratif Angular (`@for`, `@empty`).

> [!NOTE]
> Le modèle est volontairement un simple `interface` : pas d'invariants, pas de clonage, pas de `equals`. Le blindage des règles métier par une classe (constructeur validant, immutabilité, `equals`) a été vu en Partie 04 et en Séance 12.

---

### 6.1 Étape 1 : Le Modèle — Un Simple Contrat de Données

```typescript
// src/app/models/article.model.ts
export type Taille = 'MOYENNE' | 'LARGE' | 'XXL';

export interface Article {
  id: number;
  nom: string;           // 'Cornet de frites', 'Burger maison'...
  taille: Taille;
  prixUnitaire: number;  // en euros
  quantite: number;
}

// Fonction pure (S11) : le prix d'une ligne de commande
export function prixLigne(a: Article): number {
  return a.prixUnitaire * a.quantite;
}
```

- **Un `interface`, rien de plus** : on garde la séance entière pour la réactivité.
- **Une fonction pure (Séance 11)** : `prixLigne()` ne dépend que de son argument (même entrée = même sortie, aucun effet de bord). Elle sera réutilisée telle quelle dans un `computed()`.

---

### 6.2 Étape 2 : Le Composant Enfant (`ligne-commande.component.ts`)

Une ligne de ticket : elle **reçoit** un article, elle **prévient** d'une suppression, elle **calcule** son prix.

```typescript
import { Component, input, output, computed } from '@angular/core';
import { Article, prixLigne } from './models/article.model';

@Component({
  selector: 'app-ligne-commande',
  standalone: true,
  template: `
    <div class="ligne">
      <span>{{ article().nom }} · {{ article().taille }}</span>
      <span class="prix">{{ prixTotal() }} €</span>
      <button (click)="suppression.emit(article().id)">🗑️</button>
    </div>
  `
})
export class LigneCommandeComponent {
  // 1. Entrée OBLIGATOIRE : une ligne ne peut pas exister sans article
  article = input.required<Article>();

  // 2. Sortie : l'enfant prévient, il ne décide pas
  suppression = output<number>();

  // 3. Prix dérivé : recalculé tout seul si la quantité change
  prixTotal = computed(() => prixLigne(this.article()));
}
```

- **`input.required()`** : si le parent oublie `[article]="..."`, TypeScript refuse de compiler. Zéro ticket fantôme.
- **`output()`** : l'enfant n'atteint **jamais** la liste lui-même ; il émet l'`id` et c'est le parent qui décide.
- **`computed()`** : le prix suit la quantité automatiquement (la « cellule Excel » de l'analogie de la Partie 01).
- **Séparation des rôles** : la ligne est un composant de présentation, le parent possède la liste (responsabilité unique, Séance 11).

---

### 6.3 Étape 3 : Le Compteur de Quantité — `model<T>()`

Un petit composant réutilisable, piloté dans **les deux sens** sans aucune plomberie :

```typescript
// ENFANT : src/app/compteur.component.ts
import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'app-compteur',
  standalone: true,
  template: `
    <span class="stepper">
      <button (click)="moins()">−</button>
      {{ quantite() }}
      <button (click)="plus()">＋</button>
    </span>
  `
})
export class CompteurComponent {
  // Signal bidirectionnel : lu ET écrit par l'enfant et le parent
  quantite: ModelSignal<number> = model<number>(1);

  moins(): void {
    if (this.quantite() > 1) this.quantite.update(n => n - 1);
  }

  plus(): void {
    // Met à jour la valeur locale ET notifie le parent, en 1 ligne !
    this.quantite.update(n => n + 1);
  }
}
```

```html
<!-- PARENT : la « boîte à bananes » [()] -->
<app-compteur [(quantite)]="quantiteChoisie" />
```

- Le parent modifie `quantiteChoisie` ➔ l'affichage du compteur bouge.
- L'utilisateur clique sur **＋** ➔ `quantiteChoisie` change dans le parent. **Une seule ligne, les deux sens.**

> ✨ Une seule ligne remplace le couple historique `@Input()` + `@Output() ...Change`.

---

### 6.4 Étape 4 : Le Composant Racine (`fritkot.component.ts`)

Une seule source de vérité privée. Tout le reste est dérivé ou immuable :

```typescript
import { Component, signal, computed, effect } from '@angular/core';
import { Article, prixLigne } from './models/article.model';

@Component({
  selector: 'app-fritkot',
  standalone: true,
  imports: [LigneCommandeComponent]
})
export class FritkotComponent {
  // 1. LA source de vérité : privée (S05)
  private readonly _commande = signal<Article[]>([
    { id: 1, nom: 'Cornet de frites', taille: 'LARGE',   prixUnitaire: 3.5, quantite: 2 },
    { id: 2, nom: 'Burger maison',    taille: 'MOYENNE', prixUnitaire: 5,   quantite: 1 },
    { id: 3, nom: 'Frikandel XXL',    taille: 'XXL',     prixUnitaire: 2.5, quantite: 3 },
  ]);

  // 2. Vue publique en lecture seule (encapsulation, version légère)
  readonly commande = this._commande.asReadonly();

  // 3. TOUT le reste est DÉRIVÉ (computed) : zéro code de synchronisation
  readonly total = computed(() =>
    this._commande().reduce((somme, a) => somme + prixLigne(a), 0)
  );
  readonly nbArticles = computed(() =>
    this._commande().reduce((somme, a) => somme + a.quantite, 0)
  );

  // 4. Effet de bord : parler au monde extérieur (ici, la sauvegarde)
  constructor() {
    effect(() => {
      localStorage.setItem('fritkot', JSON.stringify(this._commande()));
    });
  }

  // 5. Mutation IMMUABLE (S12) : filter renvoie un NOUVEAU tableau
  supprimer(id: number): void {
    this._commande.update(liste => liste.filter(a => a.id !== id));
  }
}
```

Les **5 piliers** à savoir reproduire en TP :

| # | Pilier | Rôle |
|---|---|---|
| 1 | **Source privée** (`_commande`) | Personne d'autre que le composant ne peut écrire dedans (encapsulation, Séance 05). |
| 2 | **Vue publique en lecture seule** (`asReadonly()`) | Le template lit `commande()`, mais ne peut pas la modifier. |
| 3 | **Deux `computed`** (`total`, `nbArticles`) | Se recalculent seuls à chaque modification. Aucune synchronisation manuelle. |
| 4 | **Un `effect`** | Uniquement pour le monde extérieur (`localStorage`). Jamais pour calculer. |
| 5 | **Un `update` immuable** | `filter()` crée une nouvelle référence ➔ `Object.is` détecte le changement, l'écran se met à jour (rappel Séance 12). |

---

### 6.5 Étape 5 : Le Template Déclaratif (`@for` & `@empty`)

Le template ne fait que lire des signaux et router les événements :

```html
<!-- fritkot.component.ts (template) -->
<h1>🍟 Frit'Kot</h1>
<p>
  {{ nbArticles() }} articles — Total :
  <strong>{{ total() }} €</strong>
</p>

<ul>
  @for (article of commande(); track article.id) {
    <li>
      <app-ligne-commande
        [article]="article"
        (suppression)="supprimer($event)" />
    </li>
  } @empty {
    <li>Votre commande est vide… à table !</li>
  }
</ul>
```

- **`@for ... track`** : la clé unique `article.id` évite tout réagencement inutile du DOM. Plus de `*ngFor`, plus de `trackBy`.
- **Le bloc `@empty`** : s'affiche automatiquement quand `commande()` est vide, sans `*ngIf` manuel.
- **Lecture = parenthèses** : `total()`, pas `total`. Chaque lecture tisse le graphe réactif.

---

### 6.6 Étape 6 : Rendu Visuel de l'Application Frit'Kot

Voici le ticket que produit notre architecture réactive complète :

```text
🍟 Frit'Kot · Commande en direct            Total (computed)
Angular 22 · Fine-Grained Signals                   19,50 €
──────────────────────────────────────────────────────────
 ×2  Cornet de frites · LARGE                       7,00 €
 ×1  Burger maison · MOYENNE                        5,00 €
 ×3  Frikandel XXL · XXL                            7,50 €
──────────────────────────────────────────────────────────
 ⚡ 6 articles · total recalculé à chaque clic · sauvegardé via effect()
```

Un clic sur 🗑️ : la ligne disparaît, le total et le compteur se recalculent seuls et `localStorage` est mis à jour. **Un seul clic, cinq mécanismes du jour en action.**

---

## Partie 07 — Exercices Pratiques d'Application

### Exercice 01 (L'Exercice court du programme) : Ajouter un `computed()` de livraison offerte

#### Énoncé :
Dans le composant `FritkotComponent`, la friterie souhaite offrir la livraison **dès que le total de la commande atteint 20 €**.

**Votre mission :**
1. Déclarer une propriété publique en lecture seule nommée `livraisonOfferte`, initialisée avec `computed()` : elle vaut `true` si `total() >= 20`.
2. Déclarer `resteAvantLivraison`, un second `computed()` qui calcule le montant manquant (jamais négatif) en s'appuyant sur `total()`.
3. Afficher dans le template, à l'aide de l'instruction `@if`, soit le message de livraison offerte, soit le montant restant.

---

#### Solution commentée de l'Exercice 01 :

```typescript
// 1. Déclarations dans la classe FritkotComponent :
readonly livraisonOfferte = computed(() => this.total() >= 20);

readonly resteAvantLivraison = computed(() =>
  Math.max(0, 20 - this.total())
);
```

```html
<!-- 2. Insertion dans le template, sous le total : -->
@if (livraisonOfferte()) {
  <p>🚚 Livraison offerte !</p>
} @else {
  <p>Plus que {{ resteAvantLivraison() }} € pour la livraison offerte.</p>
}
```

> 💡 **Pourquoi `computed()` surpasse-t-il une méthode classique `calculerLivraison()` ?**  
> Une méthode invoquée directement dans le template s'exécute à chaque cycle de détection, même si aucune donnée n'a bougé. À l'inverse, `computed()` met en cache sa valeur et ne se réexécute que si `_commande()` est effectivement modifié. De plus, `livraisonOfferte` dépend de `total`, lui-même un `computed` : le graphe réactif (DAG) enchaîne les recalculs sans aucun code de synchronisation.

---

### Exercice 02 (Bonus) : Brancher le Compteur dans la Ligne de Commande

#### Énoncé :
Intégrez le `CompteurComponent` de l'Étape 3 dans `LigneCommandeComponent`, afin de modifier la quantité d'un article directement depuis le ticket, **sans jamais muter le tableau en place**.

---

#### Solution commentée de l'Exercice 02 :

```typescript
// Dans LigneCommandeComponent : une nouvelle sortie + le compteur dans le template
quantiteModifiee = output<{ id: number; quantite: number }>();
```

```html
<!-- Template de la ligne : liaison explicite en deux temps -->
<app-compteur
  [quantite]="article().quantite"
  (quantiteChange)="quantiteModifiee.emit({ id: article().id, quantite: $event })" />
```

```typescript
// Dans FritkotComponent : mutation IMMUABLE avec map() et le spread
modifierQuantite(id: number, quantite: number): void {
  this._commande.update(liste =>
    liste.map(a => (a.id === id ? { ...a, quantite } : a))
  );
}
```

```html
<!-- Template du parent -->
<app-ligne-commande
  [article]="article"
  (suppression)="supprimer($event)"
  (quantiteModifiee)="modifierQuantite($event.id, $event.quantite)" />
```

> 💡 `map()` renvoie un **nouveau** tableau et `{ ...a, quantite }` un **nouvel** objet : `Object.is` détecte le changement, `total` et `nbArticles` se recalculent seuls, et l'`effect` met à jour `localStorage`.

---

## Synthèse : ce qu'il faut retenir absolument

### Tableau récapitulatif des mécanismes réactifs

| Primitive / Mécanisme | Rôle architectural | Modalité d'accès / Syntaxe | Règle d'or associée |
|---|---|---|---|
| **`signal<T>(valeur)`** | Cellule d'état réactive primaire en lecture/écriture. | Lecture : `val()`<br>Écriture : `.set(v)` ou `.update(fn)` | Toujours préserver l'immutabilité lors de la mise à jour d'objets ou de collections. |
| **`computed<T>(fn)`** | Projection d'état dérivée pure et mémorisée. | Lecture : `val()` (Readonly) | Doit être une fonction mathématique pure : aucun effet secondaire à l'intérieur ! |
| **`effect(fn)`** | Consommateur terminal d'effets de bord. | Instanciation dans `constructor()` | Réservé aux logs, Web Storage et APIs DOM tierces ; interdit pour synchroniser des signaux. |
| **`input<T>()`** | Entrée de composant réactive en lecture seule. | `val = input()` ou `input.required()` | Remplace définitivement `@Input()`. Accepte des fonctions de conversion `transform`. |
| **`output<T>()`** | Émetteur d'événements vers le composant parent. | `val = output()`, appel : `val.emit(v)` | Remplace `@Output()` et RxJS `EventEmitter`. Plus léger et sans dépendance externe. |
| **`model<T>()`** | Liaison bidirectionnelle unifiée (*Two-Way Binding*). | `val = model()`, parent : `[(val)]="etat"` | Remplace le couple fastidieux `@Input() / @Output()Change`. |

---

### La Règle d'Or de la Séance 13

> **« Un composant Angular moderne traite ses signaux comme des flux vivants d'état pur :**  
> **L'état source est confiné et protégé par encapsulation, les projections dérivées sont mémorisées par `computed()`, et les composants enfants communiquent en toute transparence via `input()`, `output()` et `model()`, garantissant un rafraîchissement d'interface chirurgical, déterministe et sans gaspillage de ressources. »**

---

## Clôture de la séance & Pont vers la Séance 14

Félicitations ! Vous venez de franchir une étape déterminante dans la maîtrise des architectures réactives modernes sous **Angular 22** :
- Vous comprenez l'abandon de Zone.js au profit de la réactivité fine par graphe de dépendances (DAG).
- Vous savez articuler le trio fondamental `signal`, `computed` et `effect`.
- Vous maîtrisez la communication modulaire moderne avec `input()`, `output()` et `model()`.

Cependant, dans un logiciel d'entreprise, **un composant graphique ne doit jamais assumer à la fois l'affichage et la persistance des données** (violation du principe de responsabilité unique - SRP de la Séance 11).

### Aperçu de la Séance 14 : Services Métier & Injection de Dépendances
Dans la prochaine séance, nous allons extraire notre état et nos signaux vers des **services injectables dédiés** :
- Le rôle d'un service Angular et le mécanisme `@Injectable({ providedIn: 'root' })`.
- L'Inversion de Dépendance (DIP, Séance 11) matérialisée par la fonction moderne `inject()`.
- L'introduction des **classes génériques en TypeScript** (`class Repository<T>`) pour factoriser l'accès aux données de multiples entités métier.
