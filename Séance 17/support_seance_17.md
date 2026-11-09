# Séance 17 — Consommer une API REST : `httpResource()`, Asynchronisme & Intégration Objet

**Cours de programmation orientée objet — Bachelier en informatique (EAFC)**  
**Stack technique : TypeScript 5+, Angular 22 (approche signal-first)**

---

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant est en mesure de :

1. **Maîtriser les fondations des architectures REST et du protocole HTTP** : identifier le rôle des verbes (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), interpréter avec rigueur les grandes familles de codes de statut (`2xx`, `3xx`, `4xx`, `5xx`), et analyser l'anatomie d'une transaction HTTP (en-têtes, corps de requête/réponse au format JSON).
2. **Démystifier le paradigme synchrone vs asynchrone et l'Event Loop JavaScript** : comprendre pourquoi le blocage du thread principal est formellement proscrit dans un navigateur, analyser le fonctionnement articulé de la pile d'appels (*Call Stack*), des APIs d'arrière-plan du navigateur (*Web APIs*), de la file des microtâches (*Microtask Queue*) et du moteur de boucle d'événements (*Event Loop*).
3. **Comprendre la rupture d'architecture réseau d'Angular 22** : comparer l'approche historique impérative/stream (`HttpClient`, Observables RxJS, abonnements manuels, gestion complexe des fuites mémoire) avec la nouvelle approche déclarative `httpResource()` nativement intégrée au graphe réactif des signaux.
4. **Configurer l'infrastructure réseau de l'application** : intégrer et configurer `provideHttpClient()` dans le point d'entrée d'une application Angular moderne (`app.config.ts`) sans recourir aux modules obsolètes (`HttpClientModule`).
5. **Exploiter l'ensemble des capacités de `httpResource()`** : manipuler ses signaux réactifs d'état (`value()`, `status()`, `isLoading()`, `error()`), décoder les transitions de cycle de vie via l'énumération `ResourceStatus`, et piloter le rafraîchissement des requêtes à la demande via `.reload()`.
6. **Bâtir des requêtes réactives paramétrées par des signaux** : concevoir des fonctions de requête dynamiques qui se synchronisent automatiquement avec les mutations de signaux d'entrée (filtres, pagination, recherche textuelle), avec annulation automatique des requêtes obsolètes.
7. **Pérenniser le pont POO entre DTOs réseau et Entités Métier vivantes** : relier les données brutes désérialisées de l'API externe à des classes de domaine riches en comportements, en associant `httpResource()`, les méthodes de fabrique statiques `fromDTO()` (approfondies en Séance 16) et les signaux dérivés `computed()`.

---

## Partie 00 — Le cheminement : d'où venons-nous ?

Cette dix-septième séance s'inscrit au cœur du **Bloc D**, dédié à la **Persistance des Données** :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROGRESSION PÉDAGOGIQUE DU CURSUS POO                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🧱 BLOC 0 — Mise en Route & Outillage (Séances 01 à 04)                     │
│    • S01 — Introduction POO & Git                                           │
│    • S02 — Fondations du Langage TypeScript                                 │
│    • S03 — Architecture d'une SPA & Découverte d'Angular                    │
│    • S04 — Rappel HTML/CSS & Système de Conception Bootstrap                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🏛️ BLOC A — Les Fondamentaux du Paradigme Objet (Séances 05 à 09)          │
│    • S05 — Encapsulation & Invariants (private, getters/setters, static)    │
│    • S06 — Héritage & Spécialisation (extends, super, override)             │
│    • S07 — Polymorphisme Dynamique (liaison tardive, instanceof, unions)    │
│    • S08 — Abstraction & Contrats Purs (abstract, interfaces, implements)   │
│    • S09 — Composition vs Héritage (relations a-un, délégation de rôles)    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🛡️ BLOC B — Conception, Qualité & Maîtrise des Objets (Séances 10 à 12)     │
│    • S10 — Exceptions Métier & Robustesse (throw, try/catch/finally, cause) │
│    • S11 — Principes SOLID (S : Responsabilité, O : Ouvert/Fermé, D : DIP)  │
│    • S12 — Les Objets eux-mêmes : Identité, Clonage & Immutabilité          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ⚡ BLOC C — Angular en Signal-First, Approfondissement (Séances 13 à 15)     │
│    • S13 — Composants & Signals (Primitives réactives, DAG, input/output)   │
│    • S14 — Services Métier, Génériques avancés & Injection (inject())       │
│    • S15 — Signal Forms, Validation Déclarative & Routing d'Entreprise      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 💾 BLOC D — Persistance des Données (Séances 16 à 19)                       │
│    • S16 — Formats de Données, Sérialisation & Typage POO (JSON / XML)      │
│    • S17 — Aujourd'hui : Consommer une API REST avec httpResource()         │
│    • S18 — Stockage Local (LocalStorage vs Cookies) & Intro Dexie.js        │
│    • S19 — Dexie.js Approfondi : Transactions, Index & Persistance CRUD     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📱 BLOCS SUIVANTS : E (Capacitor Mobile), F (Tests Unitaires), G (Projet)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

Faisons le point sur notre progression :

Lors de la **Séance 16**, nous avons franchi la première étape fondamentale de la persistance :
- Nous avons compris pourquoi les instances d'objets en mémoire vive (RAM) sont éphémères et vouées à disparaître dès la fermeture de la page ou l'appui sur **F5**.
- Nous avons appris à sérialiser nos objets sous forme de flux textuels **JSON** ou **XML** grâce à `JSON.stringify()`.
- Nous avons surtout identifié le gouffre de la désérialisation : `JSON.parse()` produit de simples objets littéraux dépourvus de méthodes et de prototypes. Pour résoudre ce défi, nous avons formalisé le patron **DTO** (*Data Transfer Object*) et conçu des fabriques statiques `fromDTO()` capables de réhydrater des entités vivantes tout en certifiant la validité de leurs invariants.

Cependant, en Séance 16, **toutes nos manipulations demeuraient strictement locales**. Nos chaînes JSON provenaient de formulaires ou de fichiers locaux.

Dans le monde professionnel réel, les données résident sur des serveurs distants, hébergés dans des centres de données à l'autre bout de la planète, interrogés à travers le réseau Internet via des **APIs REST**.

La question centrale de cette Séance 17 est donc :

> **« Comment interroger de façon asynchrone et non-bloquante un service distant sur le Web, tout en intégrant de façon transparente et réactive les flux JSON reçus dans notre architecture Orientée Objet sous Angular 22 ? »**

---

## Partie 01 — Le Web Distant : Protocole HTTP, Architecture REST & Défi Asynchrone

### 1.1 Qu'est-ce qu'une API REST ?

Le Web moderne repose sur le style architectural **REST** (*Representational State Transfer*), théorisé par Roy Fielding en 2000. Une API REST expose un ensemble d'opérations standardisées permettant à des clients (applications Angular, mobiles, scripts) d'interagir avec des ressources hébergées sur un serveur.

```
┌─────────────────────────┐                            ┌─────────────────────────┐
│     CLIENT WEB SPA      │   1. Requête HTTP (JSON)   │     SERVEUR BACKEND     │
│   (Navigateur Client)   │ ─────────────────────────> │   (Spring, NestJS...)   │
│                         │                            │                         │
│  • Angular 22           │   2. Réponse HTTP (JSON)   │  • Base de Données SQL  │
│  • Signaux Réactifs     │ <───────────────────────── │  • Logique de Domaine   │
└─────────────────────────┘                            └─────────────────────────┘
```

#### 1. La notion de Ressource et d'URI
Dans une API REST, chaque concept métier est modélisé sous la forme d'une **ressource** identifiée de façon unique par son URI (*Uniform Resource Identifier*) :
- `/api/articles` : représente la collection complète des articles.
- `/api/articles/42` : identifie spécifiquement l'article portant la clé unique 42.
- `/api/articles/42/commentaires` : identifie les sous-ressources rattachées à cet article.

#### 2. Les Verbes HTTP : La sémantique de l'action
Contrairement aux anciennes approches RPC (*Remote Procedure Call*) où l'on créait des URLs verbeuses comme `/getArticle` ou `/deleteArticle`, REST s'appuie sur la sémantique native des verbes HTTP :

| Verbe HTTP | Rôle sémantique | Idempotent ? | Sûr (Safe) ? | Présence d'un Body |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | Récupère la représentation d'une ressource ou d'une liste | **Oui** | **Oui** (ne modifie rien) | Non recommandé |
| **`POST`** | Crée une nouvelle ressource subordonnée | **Non** | **Non** | Oui (données à créer) |
| **`PUT`** | Remplace intégralement une ressource existante | **Oui** | **Non** | Oui (représentation complète) |
| **`PATCH`** | Modifie partiellement certains champs d'une ressource | **Non** (généralement) | **Non** | Oui (diff de modifications) |
| **`DELETE`** | Supprime la ressource ciblée | **Oui** | **Non** | Rare / Facultatif |

> [!NOTE]
> **Qu'est-ce que l'idempotence ?**  
> Une opération est dite *idempotente* si le fait de l'exécuter une seule fois ou dix fois consécutives produit exactement le même effet sur l'état du serveur. Par exemple, supprimer la ressource 42 dix fois de suite laisse le serveur dans le même état final (la ressource 42 n'existe plus). En revanche, envoyer 10 requêtes `POST` crée 10 articles distincts.

#### 3. Les Codes de Statut HTTP : La grammaire du diagnostic
Le serveur répond toujours par un code numérique normalisé sur 3 chiffres :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LES GRANDES FAMILLES DE CODES HTTP                   │
├───────────┬──────────────────────┬─────────────────────────────────────┤
│ Tranche   │ Catégorie            │ Codes majeurs à connaître           │
├───────────┼──────────────────────┼─────────────────────────────────────┤
│ **2xx**   │ Succès (Success)     │ 200 OK (Lecture/mise à jour réussie)│
│           │                      │ 201 Created (Création post-POST)    │
│           │                      │ 204 No Content (Action sans retour) │
├───────────┼──────────────────────┼─────────────────────────────────────┤
│ **3xx**   │ Redirection          │ 301 Moved Permanently               │
│           │                      │ 304 Not Modified (Mise en cache)    │
├───────────┼──────────────────────┼─────────────────────────────────────┤
│ **4xx**   │ Erreur du Client     │ 400 Bad Request (Payload invalide)  │
│           │                      │ 401 Unauthorized (Non authentifié)  │
│           │                      │ 403 Forbidden (Droits insuffisants) │
│           │                      │ 404 Not Found (Ressource inconnue)  │
│           │                      │ 422 Unprocessable (Échec métier)    │
├───────────┼──────────────────────┼─────────────────────────────────────┤
│ **5xx**   │ Erreur du Serveur    │ 500 Internal Server Error (Crash)   │
│           │                      │ 502 Bad Gateway (Proxy défaillant)  │
│           │                      │ 503 Service Unavailable (Surcharge) │
└───────────┴──────────────────────┴─────────────────────────────────────┘
```

---

### 1.2 Le Dilemme Synchrone vs Asynchrone

#### 1. L'analogie du restaurant gastronomique
Considérons deux serveurs dans un restaurant bondé :

- **Le Serveur Synchrone (Bloquant)** :  
  Il prend la commande d'une table, file en cuisine, donne le bon au chef... et reste planté debout devant les fourneaux pendant 25 minutes sans bouger, en attendant que le plat soit cuit. Pendant ces 25 minutes, personne d'autre ne peut commander, les verres ne sont pas servis, la porte d'entrée est bloquée. Le restaurant est complètement paralysé.

- **Le Serveur Asynchrone (Non-Bloquant)** :  
  Il prend la commande, dépose le ticket en cuisine, et confie un bip électronique vibrant (*Pager / Buzzer*) à la table. Il retourne immédiatement en salle prendre d'autres commandes, servir du pain et accueillir de nouveaux clients. Lorsque la cuisine sonne le bip (*l'événement* se déclenche), le serveur récupère le plat et le livre à la table.

#### 2. La réalité physique du navigateur Web
Dans un navigateur Web, JavaScript s'exécute sur **un seul thread principal** (*Single-Threaded*). Ce thread unique est responsable à la fois :
1. De l'exécution de votre code TypeScript/JavaScript.
2. Du calcul des styles CSS et de la disposition graphique (*Reflow & Layout*).
3. Du rendu des pixels sur l'écran (60 images par seconde).
4. De la capture des interactions utilisateur (clics, frappe au clavier, défilement).

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LE DANGER D'UN APPEL RÉSEAU SYNCHRONE                │
├────────────────────────────────────────────────────────────────────────┤
│ Si une requête HTTP vers un serveur distant prenait 800 ms de latence │
│ et était SYNCHRONE (bloquante) :                                      │
│                                                                        │
│  [Clic Utilisateur] ───> [Requête Synchrone]                           │
│                          │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │       │
│                          │  THREAD BLOQUÉ PENDANT 800 ms        │       │
│                          │  • La page ne réagit plus            │       │
│                          │  • Les boutons sont figés            │       │
│                          │  • Les animations saccadent          │       │
│                          │  • Le navigateur affiche "Page morte"│       │
│                          └─────────────────────────────────────┘       │
└────────────────────────────────────────────────────────────────────────┘
```

C'est pourquoi, dès l'origine du Web moderne, **tous les appels réseau via les APIs Web (`fetch`, `XMLHttpRequest`) sont obligatoirement asynchrones**.

---

### 1.3 L'Event Loop JavaScript : Sous le Capot

Pour orchestrer l'asynchronisme sans bloquer le thread principal, le moteur JavaScript (moteur V8 dans Chromium/Node.js) s'appuie sur une mécanique de précision : **l'Event Loop** (*Boucle d'Événements*).

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                     ARCHITECTURE DE L'EVENT LOOP JAVASCRIPT                    │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│   1. CALL STACK (Pile d'exécution)                 2. WEB APIs DU NAVIGATEUR   │
│   ┌────────────────────────────────┐               ┌───────────────────────┐   │
│   │ executeInstructionA()          │               │ • fetch(url) [Réseau] │   │
│   │ declencherRequeteHttp()        │ ────────────> │ • setTimeout(timer)   │   │
│   └────────────────────────────────┘               │ • DOM Events          │   │
│                   │                                └───────────────────────┘   │
│         (Pile vide à la fin)                                   │               │
│                   │                                            ▼               │
│                   │                           3. FILE DES MICRO/MACROTÂCHES    │
│                   ▼                                ┌───────────────────────┐   │
│       ┌───────────────────────┐                    │ Callback / Promesse   │   │
│       │      EVENT LOOP       │ <───────────────── │ terminée prête        │   │
│       │ (Vérifie si Stack vide│                    └───────────────────────┘   │
│       │  et injecte la tâche) │                                                │
│       └───────────────────────┘                                                │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

1. **La Call Stack (Pile d'appels synchrone)** : Elle empile et exécute les fonctions TypeScript les unes après les autres. Tant qu'une fonction est sur la pile, rien d'autre ne peut s'exécuter.
2. **Les Web APIs du navigateur** : Lorsqu'une requête HTTP est déclenchée, le moteur JavaScript délègue la négociation TCP/TLS et l'attente du paquet réseau au système d'exploitation et aux threads d'arrière-plan du navigateur. La Call Stack est immédiatement libérée !
3. **La Task / Microtask Queue** : Lorsque la réponse HTTP arrive enfin avec ses octets JSON, le navigateur place la fonction de rappel (*callback / résolution de Promise*) dans la file d'attente.
4. **L'Event Loop** : Elle surveille continuellement la Call Stack. Dès que celle-ci est complètement vide, elle prélève la tâche en tête de file et l'injecte dans la Call Stack pour la traiter.

#### Règle de décision : Quand employer du Synchrone vs de l'Asynchrone ?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GRILLE D'ARBITRAGE TECHNIQUE                       │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ UTILISER LE SYNCHRONE POUR :          │ UTILISER L'ASYNCHRONE POUR :        │
├───────────────────────────────────────┼─────────────────────────────────────┤
│ • Calculs mathématiques en mémoire    │ • Requêtes réseau (HTTP, WebSocket) │
│ • Instanciation de classes (`new`)    │ • Lecture/écriture sur disque ou DB │
│ • Validations d'invariants (Séance 05)│ • Délais, timers (`setTimeout`)     │
│ • Getters / Setters simples           │ • Accès matériel (GPS, caméra, etc.)│
│ • Transformations `computed()` locales│ • Tout franchissement de frontière  │
└───────────────────────────────────────┴─────────────────────────────────────┘
```

---

## Partie 02 — L'Accès Réseau sous Angular 22 : Du Labyrinthe RxJS à la Révolution Signal-First

### 2.1 Le Paradigme Historique : Les Tourments de `HttpClient` et RxJS

Historiquement (d'Angular 2 jusqu'à Angular 17), toute communication réseau devait obligatoirement transiter par la bibliothèque **RxJS** (*Reactive Extensions for JavaScript*). Pour récupérer une simple liste d'articles, un développeur devait écrire :

```typescript
// ❌ ANCIENNE APPROCHE (RxJS Classique) : Lourd, verbeux, propice aux fuites mémoire
@Component({ ... })
export class AncienComposant implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private subscription?: Subscription;
  articles: ArticleDTO[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription = this.http.get<ArticleDTO[]>('https://api.monsite.com/articles')
      .pipe(
        catchError(err => {
          this.errorMessage = 'Erreur réseau';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        this.articles = data;
      });
  }

  ngOnDestroy(): void {
    // ⚠️ OBLIGATOIRE : Si on oublie de se désinscrire, fuite mémoire critique !
    this.subscription?.unsubscribe();
  }
}
```

Cette approche présentait des inconvénients pédagogiques et architecturaux majeurs :
- **Multiplication d'états manuels** : Le développeur devait gérer manuellement 3 ou 4 variables (`isLoading`, `errorMessage`, `articles`, `subscription`).
- **Fuites mémoires insidieuses** : Oublier de se désinscrire (`unsubscribe()`) laissait des écouteurs actifs en mémoire vive après la destruction du composant.
- **Complexité conceptuelle** : Nécessité de maîtriser des dizaines d'opérateurs ésotériques (`switchMap`, `mergeMap`, `concatMap`, `exhaustMap`, `takeUntilDestroyed`).
- **Rupture avec les Signals** : Obligation d'utiliser des ponts hybrides (`toSignal()`) pour ramener les flux RxJS vers l'architecture réactive moderne.

---

### 2.2 La Révolution Déclarative : `resource()` et `httpResource()`

Angular a introduit une simplification majeure dans sa gestion de la réactivité asynchrone avec l'API **Resource** :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LA RÉVOLUTION SIGNAL-FIRST EN RÉSEAU                 │
├──────────────────────────────────┬─────────────────────────────────────┤
│ ANCIEN MONDE (RxJS Imperatif)    │ MONDE MODERNE (Angular 22 Signals)  │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Flux d'événements (Observables)│ • Primitives d'état pures (Signals) │
│ • Souscriptions manuelles        │ • Résolution déclarative automatique│
│ • Gestion manuelle du cycle      │ • Cycle de vie géré par le framework│
│ • Risques de fuites mémoire      │ • Zéro fuite, annulation automatique│
│ • `subscribe()` / `unsubscribe()`│ • `.value()`, `.isLoading()`        │
└──────────────────────────────────┴─────────────────────────────────────┘
```

Angular 22 propose deux fonctions clés :

1. **`resource()` (dans `@angular/core`)** :  
   Une primitive universelle capable de transformer n'importe quelle opération asynchrone arbitraire (une fonction basée sur des Promesses, un appel à l'API `fetch()`, ou une requête vers une base IndexedDB) en un ensemble de signaux réactifs.

2. **`httpResource()` (dans `@angular/common/http`)** :  
   Une spécialisation de haut niveau, conçue spécifiquement pour consommer des APIs HTTP REST. Elle encapsule automatiquement `HttpClient`, gère les requêtes d'annulation via les `AbortController` natifs, et expose directement des signaux réactifs reflétant l'état du réseau.

---

### 2.3 Configuration Préalable : `provideHttpClient()`

Pour que les fonctionnalités réseau d'Angular soient opérationnelles dans une application moderne (sans `AppModule`), nous devons déclarer explicitement le fournisseur HTTP dans le fichier de configuration racine `app.config.ts` :

```typescript
// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // 🌐 Active l'infrastructure réseau d'Angular
    // withFetch() active l'API fetch moderne du navigateur plutôt que XMLHttpRequest
    provideHttpClient(withFetch())
  ]
};
```

> [!IMPORTANT]
> **Pourquoi `withFetch()` ?**  
> L'option `withFetch()` configure le client HTTP d'Angular pour s'appuyer sur l'API native `fetch()` du navigateur au lieu du vénérable `XMLHttpRequest`. Cela améliore les performances, réduit l'empreinte mémoire et permet une intégration optimale avec les mécanismes d'annulation de requêtes et le rendu côté serveur (*SSR*).

---

## Partie 03 — Maîtriser `httpResource()` en Profondeur : États, Paramètres & Cycle de Vie

### 3.1 Anatomie d'un `HttpResourceRef<T>`

Lorsque vous appelez la fonction `httpResource<T>()`, Angular ne déclenche pas immédiatement un callback impératif : il retourne un objet de référence réactif appelé **`HttpResourceRef<T>`**.

Cet objet expose un ensemble cohérent de signaux et de méthodes d'action :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ANATOMIE DE HttpResourceRef<T>                       │
├────────────────────────────────────────────────────────────────────────┤
│ • ressource.value()      ──> Signal<T | undefined>                     │
│                             (Contient les données JSON résolues)       │
│                                                                        │
│ • ressource.isLoading()  ──> Signal<boolean>                           │
│                             (true pendant l'attente du réseau)         │
│                                                                        │
│ • ressource.error()      ──> Signal<unknown>                           │
│                             (Capture l'objet d'erreur HTTP ou null)    │
│                                                                        │
│ • ressource.status()     ──> Signal<ResourceStatus>                    │
│                             (Énumération du cycle de vie précis)       │
│                                                                        │
│ • ressource.reload()     ──> void                                      │
│                             (Fonction impérative de réactualisation)   │
└────────────────────────────────────────────────────────────────────────┘
```

#### L'Énumération `ResourceStatus`
Pour les besoins avancés, Angular expose l'énumération `ResourceStatus` décrivant rigoureusement la machine à états de la ressource :

```typescript
export enum ResourceStatus {
  Idle = 0,        // La ressource est en attente, aucune requête n'a encore été émise
  Error = 1,       // La requête a échoué (erreur réseau, 404, 500...)
  Loading = 2,     // La première requête de chargement est en cours
  Reloading = 3,   // Les données précédentes sont conservées pendant qu'une réactualisation tourne
  Resolved = 4,    // Les données sont arrivées et disponibles dans .value()
  Local = 5        // Les données ont été mutées localement
}
```

La distinction entre **`Loading`** et **`Reloading`** est un atout d'ergonomie majeur :
- Lors du premier chargement (`Loading`), votre interface graphique affiche généralement un gros spinner central ou des cartes squelettes (*skeletons*).
- Lors d'un rafraîchissement en arrière-plan (`Reloading`), `.value()` conserve l'ancienne liste de données à l'écran, et vous affichez simplement un petit voyant discret en haut de page sans faire clignoter toute l'application.

---

### 3.2 Requêtes Dynamiques et Réactivité en Cascade

L'une des plus grandes puissances de `httpResource()` réside dans sa capacité à accepter **une fonction de requête** qui lit d'autres signaux :

```typescript
@Component({ ... })
export class RechercheArticlesComponent {
  // 1. Signaux d'entrée pilotés par les interactions de l'utilisateur
  readonly termeRecherche = signal<string>('ordinateurs');
  readonly pageActuelle = signal<number>(1);
  readonly limiteParPage = signal<number>(10);

  // 2. Ressource HTTP connectée au graphe réactif
  readonly articlesResource = httpResource<CatalogueResponseDTO>(() => {
    const terme = this.termeRecherche().trim();
    const page = this.pageActuelle();
    const limite = this.limiteParPage();

    // Dès qu'un des 3 signaux change, l'URL est recalculée
    // et Angular relance AUTOMATIQUEMENT la requête HTTP !
    return `https://api.monsite.com/v1/articles?q=${encodeURIComponent(terme)}&page=${page}&limit=${limite}`;
  });
}
```

```
┌────────────────────────────────────────────────────────────────────────────────┐
│               LE GRAPHE DE DÉPENDANCE RÉACTIF DE httpResource()                │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│   termeRecherche() ─────┐                                                      │
│                         │                                                      │
│   pageActuelle()   ─────┼──>  () => URL Dynamique  ──>  httpResource()         │
│                         │                                     │                │
│   limiteParPage()  ─────┘                                     ▼                │
│                                                           .value()             │
│                                                         .isLoading()           │
│                                                           .error()             │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

#### Suspendre une requête conditionnellement
Que se passe-t-il si l'utilisateur n'a rien saisi dans le champ de recherche et que nous ne souhaitons émettre **aucune requête** ?  
Il suffit de retourner `undefined` dans la fonction de calcul de l'URL :

```typescript
readonly articlesResource = httpResource<CatalogueResponseDTO>(() => {
  const terme = this.termeRecherche().trim();
  
  // Si le champ de recherche compte moins de 3 caractères, on ne requête pas le serveur !
  if (terme.length < 3) {
    return undefined; // La ressource reste à l'état Idle (aucun appel réseau)
  }

  return `https://api.monsite.com/v1/articles/recherche?q=${encodeURIComponent(terme)}`;
});
```

---

### 3.3 Comparaison : `httpResource()` vs `resource()` générique

Il est fondamental de savoir quand privilégier l'une ou l'autre de ces deux fonctions :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ARBITRAGE : httpResource() VS resource()                    │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ CARACTÉRISTIQUES                      │ httpResource()                      │
├───────────────────────────────────────┼─────────────────────────────────────┤
│ Package d'importation                 │ `@angular/common/http`              │
│ Mécanisme de transport sous-jacent    │ HttpClient d'Angular                │
│ Support des Intercepteurs HTTP        │ **OUI** (Authentication, Logs...)   │
│ Rendu SSR / Hydratation optimisée     │ **OUI** (Prise en charge native)    │
│ Cas d'usage recommandé                │ **Toutes les APIs REST standard**   │
├───────────────────────────────────────┼─────────────────────────────────────┤
│ CARACTÉRISTIQUES                      │ resource()                          │
├───────────────────────────────────────┼─────────────────────────────────────┤
│ Package d'importation                 │ `@angular/core`                     │
│ Mécanisme de transport sous-jacent    │ Fonction `loader` asynchrone libre  │
│ Support des APIs non-HTTP             │ **OUI** (IndexedDB, Dexie, SDKs...) │
│ Rendu SSR / Hydratation optimisée     │ Nécessite une configuration manuelle│
│ Cas d'usage recommandé                │ **Promesses custom, SDK Firebase**  │
└───────────────────────────────────────┴─────────────────────────────────────┘
```

Exemple d'utilisation de `resource()` avec une Promesse ou `fetch()` :

```typescript
import { resource } from '@angular/core';

// resource() prend un objet de configuration avec request et loader
readonly utilisateurResource = resource({
  request: () => ({ id: this.utilisateurId() }),
  loader: async ({ request, abortSignal }) => {
    // Exécution d'un loader asynchrone arbitraire
    const response = await fetch(`https://api.monsite.com/users/${request.id}`, {
      signal: abortSignal // Permet d'annuler la requête si l'id change en cours de route
    });
    if (!response.ok) {
      throw new Error(`Échec HTTP avec statut ${response.status}`);
    }
    return await response.json();
  }
});
```

---

## Partie 04 — L'Intégration POO : Du Flux HTTP Brut (DTO) à l'Entité Métier Enrichie

### 4.1 La Frontière Réseau et le Gouffre des Données Inertes

C'est ici que notre savoir-faire en **Programmation Orientée Objet** prend toute sa dimension.

Lorsqu'une API REST externe nous répond un flux JSON, ce flux est automatiquement désérialisé par le moteur HTTP. Cependant, **les objets obtenus sont des dictionnaires de données brutes passives** :
- Ils ne possèdent aucune méthode d'instance.
- Leurs champs de dates sont de bêtes chaînes textuelles (format ISO 8601 `"2026-10-06T14:30:00.000Z"`).
- Aucun invariant métier n'est garanti : si le serveur renvoie un prix négatif ou une chaîne corrompue, un cast naïf `as Produit` laissera entrer le poison dans votre application sans lever la moindre exception !

```
┌────────────────────────────────────────────────────────────────────────────────┐
│               LE PIÈGE DU TYPAGE DIRECT vs L'ARCHITECURE DTO / POO             │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│   API REST Externe (JSON)                                                      │
│            │                                                                   │
│            ▼                                                                   │
│   httpResource<Produit[]>() ❌ PIÈGE MORTEL !                                  │
│            │                                                                   │
│            ├──> Au runtime : Ce ne sont PAS des instances de la classe Produit │
│            └──> Appel de p.calculerMarge() ──> CRASH : TypeError is not a func │
│                                                                                │
│ ────────────────────────────────────────────────────────────────────────────── │
│                                                                                │
│   APPROCHE RIGOUREUSE (CONFORME SÉANCE 16) :                                   │
│                                                                                │
│   API REST Externe (JSON)                                                      │
│            │                                                                   │
│            ▼                                                                   │
│   httpResource<ProduitDTO[]>()  (Contrat de transfert inerte)                  │
│            │                                                                   │
│            ▼                                                                   │
│   computed(() => brut.map(dto => Produit.fromDTO(dto)))                        │
│            │                                                                   │
│            ▼                                                                   │
│   Entités Métier Vivantes (Instances réhydratées, invariants certifiés)        │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 L'Architecture Complète : DTO, Entité Métier et Fabrique

Mettons en pratique la séparation architecturale indispensable vue en Séance 16 :

#### 1. Le DTO (*Data Transfer Object*) : Contrat Passif
Il décrit fidèlement la forme exacte des données telles qu'elles voyagent sur le réseau :

```typescript
// src/app/models/produit.dto.ts

export interface ProduitDTO {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly discountPercentage: number;
  readonly rating: number;
  readonly stock: number;
  readonly brand: string;
  readonly category: string;
  readonly thumbnail: string;
}

export interface ReponseCatalogueDTO {
  readonly products: readonly ProduitDTO[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}
```

#### 2. L'Entité Métier : La forteresse du domaine
La classe `Produit` encapsule ses données, protège ses invariants dans son constructeur, et offre des méthodes de calcul métier réelles :

```typescript
// src/app/models/produit.model.ts
import { ProduitDTO } from './produit.dto';

export class Produit {
  readonly #id: number;
  #titre: string;
  #description: string;
  #prixBaseHT: number;
  #pourcentageRemise: number;
  #stockDisponible: number;
  #marque: string;
  #categorie: string;
  #imageMiniature: string;

  constructor(
    id: number,
    titre: string,
    description: string,
    prixBaseHT: number,
    pourcentageRemise: number,
    stockDisponible: number,
    marque: string,
    categorie: string,
    imageMiniature: string
  ) {
    // 🛡️ Validation stricte des invariants métier (Séance 05 & Séance 10)
    if (id <= 0) {
      throw new Error(`L'identifiant produit doit être un entier positif (reçu : ${id}).`);
    }
    if (!titre || titre.trim().length === 0) {
      throw new Error('Le titre du produit ne peut pas être vide.');
    }
    if (prixBaseHT < 0) {
      throw new Error(`Le prix de base ne peut pas être négatif (reçu : ${prixBaseHT} €).`);
    }
    if (pourcentageRemise < 0 || pourcentageRemise > 100) {
      throw new Error(`Pourcentage de remise invalide : ${pourcentageRemise}%.`);
    }
    if (stockDisponible < 0) {
      throw new Error(`Le stock ne peut pas être négatif (reçu : ${stockDisponible}).`);
    }

    this.#id = id;
    this.#titre = titre.trim();
    this.#description = description.trim();
    this.#prixBaseHT = prixBaseHT;
    this.#pourcentageRemise = pourcentageRemise;
    this.#stockDisponible = Math.floor(stockDisponible);
    this.#marque = marque.trim();
    this.#categorie = categorie.trim();
    this.#imageMiniature = imageMiniature.trim();
  }

  // --- Getters d'accès encapsulés ---
  get id(): number { return this.#id; }
  get titre(): string { return this.#titre; }
  get description(): string { return this.#description; }
  get prixBaseHT(): number { return this.#prixBaseHT; }
  get pourcentageRemise(): number { return this.#pourcentageRemise; }
  get stockDisponible(): number { return this.#stockDisponible; }
  get marque(): string { return this.#marque; }
  get categorie(): string { return this.#categorie; }
  get imageMiniature(): string { return this.#imageMiniature; }

  // --- Comportements Métier POO ---

  /** Calcule le montant de la réduction en euros */
  calculerMontantEconomie(): number {
    return Number((this.#prixBaseHT * (this.#pourcentageRemise / 100)).toFixed(2));
  }

  /** Calcule le prix net remisé */
  calculerPrixNet(): number {
    return Number((this.#prixBaseHT - this.calculerMontantEconomie()).toFixed(2));
  }

  /** Évalue le statut de criticité du stock */
  estEnAlerteStock(): boolean {
    return this.#stockDisponible > 0 && this.#stockDisponible <= 5;
  }

  estEnRupture(): boolean {
    return this.#stockDisponible === 0;
  }

  // --- Fabrique Statique de Réhydratation (La solution reine !) ---
  static fromDTO(dto: ProduitDTO): Produit {
    return new Produit(
      dto.id,
      dto.title,
      dto.description,
      dto.price,
      dto.discountPercentage ?? 0,
      dto.stock,
      dto.brand ?? 'Générique',
      dto.category,
      dto.thumbnail
    );
  }
}
```

---

### 4.3 Le Rôle Pivot de `computed()` pour la Réhydratation Réactive

Comment marier harmonieusement la ressource HTTP et notre classe métier ?  
Grâce à un signal calculé **`computed()`** !

```typescript
@Injectable({ providedIn: 'root' })
export class CatalogueService {
  readonly filtreCategorie = signal<string>('all');
  readonly termeRecherche = signal<string>('');

  // 1. Ressource HTTP qui rapatrie les DTOs bruts
  readonly reponseResource = httpResource<ReponseCatalogueDTO>(() => {
    const q = this.termeRecherche().trim();
    const cat = this.filtreCategorie();

    if (q.length > 0) {
      return `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}`;
    }
    if (cat !== 'all') {
      return `https://dummyjson.com/products/category/${encodeURIComponent(cat)}`;
    }
    return `https://dummyjson.com/products?limit=12`;
  });

  // 2. Réhydratation POO Réactive par computed()
  // Dès que reponseResource.value() se résout, les DTOs sont instanciés en vrais objets Produit !
  readonly produits = computed<readonly Produit[]>(() => {
    const reponse = this.reponseResource.value();
    if (!reponse || !reponse.products) {
      return [];
    }

    return reponse.products.map(dto => Produit.fromDTO(dto));
  });

  // 3. Calculs statistiques dérivés sur les entités vivantes
  readonly valeurTotaleCatalogue = computed<number>(() => {
    return this.produits().reduce((total, p) => total + (p.calculerPrixNet() * p.stockDisponible), 0);
  });

  readonly nombreProduitsEnAlerte = computed<number>(() => {
    return this.produits().filter(p => p.estEnAlerteStock()).length;
  });
}
```

Cette architecture offre des garanties d'ingénierie incomparables :
1. **Séparation des responsabilités (SRP)** : Le DTO ne s'occupe que de la structure réseau ; l'entité ne s'occupe que des règles métier.
2. **Robustesse absolue** : Si le serveur distant envoie un champ manquant ou une valeur invalide, `Produit.fromDTO` lève immédiatement une exception claire plutôt que de laisser des bugs silencieux polluer l'interface graphique.
3. **Plein usage du polymorphisme et de la POO** : Dans le template HTML, vous pouvez appeler sans crainte `p.calculerPrixNet()` ou `p.estEnAlerteStock()`. `instanceof Produit` est vrai à 100%.

---

## Partie 05 — Pièges Fréquents & Anti-Patterns des Développeurs Juniors

| Anti-Pattern Fréquent | Pourquoi c'est une défaillance grave | Solution d'ingénierie conforme |
| :--- | :--- | :--- |
| **Le Cast naïf du type de la ressource** : `httpResource<Produit[]>(url)` | TypeScript croit au typage statique, mais au runtime les objets reçus sont de simples JSON bruts. `p.calculerPrixNet()` plantera instantanément avec `TypeError: p.calculerPrixNet is not a function`. | Typé avec le DTO (`httpResource<ProduitDTO[]>()`), puis réhydrater via `computed(() => val.map(Produit.fromDTO))`. |
| **L'oubli de `provideHttpClient()`** | Tenter d'utiliser `httpResource` sans avoir enregistré le fournisseur réseau dans `app.config.ts`. L'application crash au démarrage avec une erreur obscure `NullInjectorError: No provider for HttpClient!`. | Ajouter systématiquement `provideHttpClient(withFetch())` dans les `providers` du fichier `app.config.ts`. |
| **L'illusion synchrone** : `const data = res.value();` exécuté juste après | Au moment où la ligne s'exécute, la requête réseau vient à peine de partir. La valeur de `.value()` est obligatoirement `undefined`. L'interface ou le code tente d'accéder à `data[0]` et plante. | Traiter la valeur de manière réactive dans un `computed()`, un `effect()`, ou dans le template avec `@if (res.isLoading())`. |
| **La boucle infinie d'effets (`effect()`)** | Mettre à jour un signal dans un `effect()` qui écoute la même ressource HTTP. La ressource se recharge, l'effet se redéclenche, la ressource se recharge : le navigateur freeze et l'API est spammée. | Ne jamais muter les signaux déclencheurs de requêtes à l'intérieur d'un effet observant la ressource. |
| **L'omission de `encodeURIComponent()`** | Écrire `api/search?q=${terme()}`. Si l'utilisateur saisit `téléphone portable` (espace ou accent) ou des caractères réservés (`&`, `?`), la requête HTTP est syntaxiquement corrompue (erreur 400). | Toujours protéger les variables d'URL avec `encodeURIComponent(terme())`. |
| **Ignorer les signaux `.isLoading()` et `.error()`** | Afficher directement la liste sans vérifier l'état du réseau. Si le réseau est lent, l'écran reste blanc sans feedback ; si le serveur tombe, l'utilisateur ne sait pas qu'une erreur 500 s'est produite. | Toujours structurer le template avec des blocs `@if (res.isLoading())`, `@if (res.error())` et `@else`. |

---

## Partie 06 — Démonstration Angular Complète : L'Explorateur de Produits Distant (*CatalogPulse*)

Voici le code complet et rigoureusement documenté d'un mini-projet Angular 22 autonome prêt à être intégré. Il met en scène la consommation de l'API publique `dummyjson.com/products`, avec recherche dynamique, filtrage par catégorie, gestion intégrale des erreurs, indicateurs de chargement et réhydratation d'objets métier POO.

### 1. Configuration de l'application : `app.config.ts`

```typescript
// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Enregistrement du client HTTP moderne avec support natif de l'API fetch
    provideHttpClient(withFetch())
  ]
};
```

---

### 2. Le Contrat Réseau : `src/app/models/catalog.dto.ts`

```typescript
// src/app/models/catalog.dto.ts

/** Contrat d'interface passif représentant un produit tel qu'émis par l'API REST */
export interface ProductDTO {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly discountPercentage: number;
  readonly rating: number;
  readonly stock: number;
  readonly brand?: string;
  readonly category: string;
  readonly thumbnail: string;
}

/** Contrat d'interface pour l'enveloppe paginée renvoyée par le serveur */
export interface ProductCatalogResponseDTO {
  readonly products: readonly ProductDTO[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}
```

---

### 3. L'Entité Métier Vivante : `src/app/models/product.entity.ts`

```typescript
// src/app/models/product.entity.ts
import { ProductDTO } from './catalog.dto';

export class Product {
  readonly #id: number;
  #title: string;
  #description: string;
  #price: number;
  #discountPercentage: number;
  #rating: number;
  #stock: number;
  #brand: string;
  #category: string;
  #thumbnail: string;

  constructor(
    id: number,
    title: string,
    description: string,
    price: number,
    discountPercentage: number,
    rating: number,
    stock: number,
    brand: string,
    category: string,
    thumbnail: string
  ) {
    // 🛡️ Validation des invariants de classe (Séances 05 & 10)
    if (id <= 0) {
      throw new Error(`Identifiant invalide : ${id}`);
    }
    if (!title || title.trim().length === 0) {
      throw new Error('Le titre du produit est obligatoire.');
    }
    if (price < 0) {
      throw new Error(`Le prix ne peut être négatif (reçu : ${price})`);
    }
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error(`Pourcentage de remise invalide : ${discountPercentage}%`);
    }
    if (stock < 0) {
      throw new Error(`Le stock ne peut être négatif (reçu : ${stock})`);
    }

    this.#id = id;
    this.#title = title.trim();
    this.#description = description.trim();
    this.#price = price;
    this.#discountPercentage = discountPercentage;
    this.#rating = rating;
    this.#stock = Math.floor(stock);
    this.#brand = brand.trim();
    this.#category = category.trim();
    this.#thumbnail = thumbnail.trim();
  }

  // --- Getters publics encapsulés ---
  get id(): number { return this.#id; }
  get title(): string { return this.#title; }
  get description(): string { return this.#description; }
  get price(): number { return this.#price; }
  get discountPercentage(): number { return this.#discountPercentage; }
  get rating(): number { return this.#rating; }
  get stock(): number { return this.#stock; }
  get brand(): string { return this.#brand; }
  get category(): string { return this.#category; }
  get thumbnail(): string { return this.#thumbnail; }

  // --- Méthodes Métier POO réelles ---

  /** Calcule le prix final remisé */
  computeDiscountedPrice(): number {
    const discountAmount = this.#price * (this.#discountPercentage / 100);
    return Number((this.#price - discountAmount).toFixed(2));
  }

  /** Calcule la valeur totale immobilisée en stock pour ce produit */
  computeStockAssetValue(): number {
    return Number((this.computeDiscountedPrice() * this.#stock).toFixed(2));
  }

  /** Indique si le stock est critique (moins de 5 unités) */
  isLowStock(): boolean {
    return this.#stock > 0 && this.#stock <= 5;
  }

  /** Indique si le produit est épuisé */
  isOutOfStock(): boolean {
    return this.#stock === 0;
  }

  /** Génère une classe CSS selon la note du produit */
  getRatingBadgeClass(): string {
    if (this.#rating >= 4.5) return 'bg-success';
    if (this.#rating >= 3.5) return 'bg-primary';
    return 'bg-warning text-dark';
  }

  // --- Fabrique Statique de Réhydratation (fromDTO) ---
  static fromDTO(dto: ProductDTO): Product {
    return new Product(
      dto.id,
      dto.title,
      dto.description,
      dto.price,
      dto.discountPercentage ?? 0,
      dto.rating ?? 0,
      dto.stock ?? 0,
      dto.brand ?? 'Marque Inconnue',
      dto.category,
      dto.thumbnail
    );
  }
}
```

---

### 4. Le Service Métier Réactif : `src/app/services/catalog.service.ts`

```typescript
// src/app/services/catalog.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ProductCatalogResponseDTO } from '../models/catalog.dto';
import { Product } from '../models/product.entity';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  // Signaux d'état de filtrage (pilotés par l'utilisateur)
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('all');

  // Ressource HTTP déclarative connectée aux signaux d'entrée
  readonly catalogResource = httpResource<ProductCatalogResponseDTO>(() => {
    const search = this.searchQuery().trim();
    const category = this.selectedCategory();

    // 1. Recherche par mot-clé prioritaire
    if (search.length > 0) {
      return `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`;
    }

    // 2. Filtrage par catégorie
    if (category !== 'all') {
      return `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;
    }

    // 3. Catalogue standard par défaut (12 éléments)
    return `https://dummyjson.com/products?limit=12`;
  });

  // Signal dérivé : Réhydratation des DTOs en véritables Entités POO Product
  readonly products = computed<readonly Product[]>(() => {
    const response = this.catalogResource.value();
    if (!response || !response.products) {
      return [];
    }

    // Chaque objet brut franchit la fabrique de réhydratation
    return response.products.map(dto => Product.fromDTO(dto));
  });

  // Calculs d'indicateurs de gestion (KPIs) dérivés du stock réhydraté
  readonly totalStockValue = computed<number>(() => {
    return this.products().reduce((acc, p) => acc + p.computeStockAssetValue(), 0);
  });

  readonly lowStockCount = computed<number>(() => {
    return this.products().filter(p => p.isLowStock()).length;
  });

  readonly outOfStockCount = computed<number>(() => {
    return this.products().filter(p => p.isOutOfStock()).length;
  });

  // Actions métier déclenchables
  setSearch(query: string): void {
    this.searchQuery.set(query);
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  /** Permet de forcer une nouvelle requête réseau (ex: clic sur "Actualiser") */
  refresh(): void {
    this.catalogResource.reload();
  }
}
```

---

### 5. Le Composant Utilisateur : `src/app/components/catalog/catalog.component.ts`

```typescript
// src/app/components/catalog/catalog.component.ts
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { Product } from '../../models/product.entity';
import { ResourceStatus } from '@angular/common/http';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- En-tête de la séance -->
      <header class="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h1 class="h3 fw-bold text-dark mb-0">
            <i class="bi bi-cloud-arrow-down-fill text-primary me-2"></i>
            CatalogPulse — Explorateur REST & POO
          </h1>
          <p class="text-muted small mb-0">Consommation d'API avec <code>httpResource()</code> & Réhydratation d'Entités Métier</p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <!-- Statut de la ressource HTTP -->
          <span class="badge border" [ngClass]="statusBadgeClass()">
            Statut : {{ statusLabel() }}
          </span>
          <button class="btn btn-outline-primary btn-sm" (click)="catalogService.refresh()" [disabled]="catalogService.catalogResource.isLoading()">
            <i class="bi bi-arrow-clockwise me-1" [class.spin]="catalogService.catalogResource.isLoading()"></i>
            Actualiser
          </button>
        </div>
      </header>

      <!-- Barre de Contrôles & Filtres Réactifs -->
      <div class="card shadow-sm border-0 mb-4 bg-light">
        <div class="card-body p-3">
          <div class="row g-3 align-items-center">
            <!-- Recherche textuelle -->
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Rechercher par titre (ex: laptop, phone, perfume)..."
                  [ngModel]="catalogService.searchQuery()"
                  (ngModelChange)="onSearchChange($event)"
                >
                @if (catalogService.searchQuery().length > 0) {
                  <button class="btn btn-outline-secondary" (click)="catalogService.setSearch('')">
                    &times;
                  </button>
                }
              </div>
            </div>

            <!-- Filtre par catégorie -->
            <div class="col-md-4">
              <select 
                class="form-select"
                [ngModel]="catalogService.selectedCategory()"
                (ngModelChange)="catalogService.setCategory($event)"
              >
                <option value="all">Toutes les catégories</option>
                <option value="beauty">Beauté & Cosmétiques</option>
                <option value="fragrances">Parfums</option>
                <option value="furniture">Mobilier</option>
                <option value="groceries">Alimentation</option>
              </select>
            </div>

            <!-- Indicateur d'activité réseau -->
            <div class="col-md-2 text-end">
              @if (catalogService.catalogResource.isLoading()) {
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <span class="small text-primary fw-bold">Réseau actif...</span>
              } @else {
                <span class="small text-success"><i class="bi bi-check-circle me-1"></i>Synchronisé</span>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau d'indicateurs financiers & de stock (KPIs calculés via POO) -->
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm p-3 border-start border-4 border-primary">
            <div class="text-muted small">Entités en Mémoire (RAM)</div>
            <div class="h4 fw-bold mb-0 text-dark">{{ catalogService.products().length }}</div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm p-3 border-start border-4 border-success">
            <div class="text-muted small">Valeur Stock Actif (Calculé)</div>
            <div class="h4 fw-bold mb-0 text-success">{{ catalogService.totalStockValue() | number:'1.2-2' }} €</div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm p-3 border-start border-4 border-warning">
            <div class="text-muted small">Alerte Stock Bas (≤ 5)</div>
            <div class="h4 fw-bold mb-0 text-warning">{{ catalogService.lowStockCount() }}</div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm p-3 border-start border-4 border-danger">
            <div class="text-muted small">Rupture Définitive</div>
            <div class="h4 fw-bold mb-0 text-danger">{{ catalogService.outOfStockCount() }}</div>
          </div>
        </div>
      </div>

      <!-- Zone d'Affichage Principale -->
      @if (catalogService.catalogResource.error()) {
        <!-- État d'Erreur Réseau ou Serveur -->
        <div class="alert alert-danger shadow-sm border-0 d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle-fill fs-3 me-3 text-danger"></i>
          <div class="flex-grow-1">
            <h5 class="alert-heading fw-bold mb-1">Échec de la communication réseau</h5>
            <p class="mb-0 small">
              Impossible de joindre le serveur REST. Détails de l'incident : 
              <code>{{ formatErrorMessage(catalogService.catalogResource.error()) }}</code>
            </p>
          </div>
          <button class="btn btn-outline-danger btn-sm ms-3" (click)="catalogService.refresh()">
            Réessayer
          </button>
        </div>
      } @else if (catalogService.catalogResource.isLoading() && catalogService.products().length === 0) {
        <!-- Spinner lors du chargement initial -->
        <div class="text-center py-5">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
          <p class="mt-3 text-muted fw-semibold">Interrogation de l'API REST en cours...</p>
        </div>
      } @else {
        <!-- Grille des Produits Réhydratés -->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          @for (product of catalogService.products(); track product.id) {
            <div class="col">
              <div class="card h-100 shadow-sm border-0 product-card">
                <div class="position-relative bg-light text-center p-3">
                  <img [src]="product.thumbnail" [alt]="product.title" class="img-fluid rounded" style="max-height: 180px; object-fit: contain;">
                  <span class="position-absolute top-0 end-0 m-2 badge" [ngClass]="product.getRatingBadgeClass()">
                    ★ {{ product.rating }}
                  </span>
                </div>
                
                <div class="card-body d-flex flex-column">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-secondary-subtle text-secondary small">{{ product.category }}</span>
                    <span class="text-muted small font-monospace">{{ product.brand }}</span>
                  </div>

                  <h5 class="card-title fw-bold text-dark fs-6 mb-1">{{ product.title }}</h5>
                  <p class="card-text text-muted small flex-grow-1 line-clamp-2">{{ product.description }}</p>

                  <!-- Bloc Tarification & Calculs Méthodes Métier -->
                  <div class="p-2 rounded bg-light mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <span class="text-muted text-decoration-line-through small me-2">{{ product.price }} €</span>
                        <span class="h5 fw-bold text-primary mb-0">{{ product.computeDiscountedPrice() }} €</span>
                      </div>
                      <span class="badge bg-danger-subtle text-danger">-{{ product.discountPercentage }}%</span>
                    </div>
                    <div class="small text-muted mt-1">
                      Économie : <strong class="text-success">{{ (product.price - product.computeDiscountedPrice()) | number:'1.2-2' }} €</strong>
                    </div>
                  </div>

                  <!-- Statut de Stock & Diagnostic POO -->
                  <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                    <div>
                      @if (product.isOutOfStock()) {
                        <span class="badge bg-danger">Rupture de stock</span>
                      } @else if (product.isLowStock()) {
                        <span class="badge bg-warning text-dark">Dernières pièces ({{ product.stock }})</span>
                      } @else {
                        <span class="badge bg-success-subtle text-success">En stock ({{ product.stock }})</span>
                      }
                    </div>

                    <!-- Preuve du raccordement au prototype de la classe -->
                    <span class="badge bg-dark-subtle text-dark font-monospace small" title="Vérification instanceof Product">
                      instanceof OK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-12 text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted"></i>
              <h4 class="mt-3 text-muted">Aucun produit ne correspond à ces critères</h4>
              <p class="small text-muted">Essayez de modifier votre terme de recherche ou sélectionnez une autre catégorie.</p>
            </div>
          }
        </div>
      }

      <!-- Volet Pédagogique d'Audit en Temps Réel -->
      <footer class="mt-5 p-3 rounded bg-dark text-light small font-monospace shadow">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="text-warning fw-bold"><i class="bi bi-cpu me-1"></i> AUDIT D'EXÉCUTION POO (RAM & HTTP)</span>
          <span class="badge bg-secondary">TypeScript 5 / Angular 22</span>
        </div>
        <div class="row g-2">
          <div class="col-md-4">URL active : <span class="text-info">{{ catalogService.catalogResource.status() }}</span></div>
          <div class="col-md-4">Type du 1er élément : <span class="text-success">{{ premierElementAudit() }}</span></div>
          <div class="col-md-4">Prototype vérifié : <span class="text-success">Product.prototype (Méthodes actives)</span></div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
    .spin {
      animation: rotation 1s infinite linear;
    }
    @keyframes rotation {
      from { transform: rotate(0deg); }
      to { transform: rotate(359deg); }
    }
  `]
})
export class CatalogComponent {
  readonly catalogService = inject(CatalogService);

  // Signaux dérivés pour l'affichage du statut de la ressource
  readonly statusLabel = computed<string>(() => {
    switch (this.catalogService.catalogResource.status()) {
      case ResourceStatus.Idle: return 'En attente (Idle)';
      case ResourceStatus.Loading: return 'Chargement initial (Loading)';
      case ResourceStatus.Reloading: return 'Actualisation en arrière-plan (Reloading)';
      case ResourceStatus.Resolved: return 'Résolu avec succès (Resolved)';
      case ResourceStatus.Error: return 'Erreur réseau/HTTP (Error)';
      case ResourceStatus.Local: return 'Muté localement (Local)';
      default: return 'Inconnu';
    }
  });

  readonly statusBadgeClass = computed<string>(() => {
    switch (this.catalogService.catalogResource.status()) {
      case ResourceStatus.Resolved: return 'bg-success-subtle text-success border-success';
      case ResourceStatus.Loading:
      case ResourceStatus.Reloading: return 'bg-primary-subtle text-primary border-primary';
      case ResourceStatus.Error: return 'bg-danger-subtle text-danger border-danger';
      default: return 'bg-light text-dark';
    }
  });

  readonly premierElementAudit = computed<string>(() => {
    const premier = this.catalogService.products()[0];
    if (!premier) return 'Aucun';
    return premier instanceof Product ? 'Instance valide de Product' : 'Simple objet anonyme';
  });

  onSearchChange(valeur: string): void {
    this.catalogService.setSearch(valeur);
  }

  formatErrorMessage(error: unknown): string {
    if (!error) return 'Erreur inconnue';
    if (typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    return String(error);
  }
}
```

---

## Synthèse : ce qu'il faut retenir absolument

1. **Le Web est structurellement asynchrone** : Le navigateur s'exécute sur un seul thread d'exécution (*Single-Threaded*). Bloquer ce thread avec une opération réseau synchrone fige l'interface graphique. L'asynchronisme et l'Event Loop garantissent une interface fluide en déléguant l'attente du réseau aux Web APIs du navigateur.
2. **REST normalise les échanges client-serveur** : Les ressources sont ciblées par des URIs, manipulées par des verbes sémantiques précis (`GET`, `POST`, `PUT`, `DELETE`), et diagnostiquées à l'aide de codes de statut standardisés (`200 OK`, `404 Not Found`, `500 Server Error`).
3. **`httpResource()` incarne la simplification d'Angular 22** : Finies les souscriptions manuelles, les fuites mémoires et les tuyaux d'opérateurs RxJS complexes pour de simples requêtes HTTP. `httpResource()` expose directement l'état réseau sous forme de signaux réactifs clairs : `.value()`, `.isLoading()`, `.error()`, `.status()` et `.reload()`.
4. **Réactivité automatique et paramétrée** : En passant une fonction de requête à `httpResource()`, toute mutation d'un signal d'entrée (terme de recherche, filtre, numéro de page) déclenche instantanément l'annulation de la requête en cours et le lancement de la nouvelle.
5. **Le réseau ne transporte que des DTOs inertes** : Ne commettez jamais l'erreur d'ingénierie de typer directement `httpResource<MaClasse[]>()` en croyant que les méthodes existeront par magie.
6. **Le pont POO est assuré par `computed()` et `fromDTO()`** : Associez toujours la ressource HTTP à un signal calculé `computed()` qui fait transiter chaque DTO brut par la fabrique statique `MaClasse.fromDTO(dto)`. C'est le garant absolu de la réhydratation du prototype, de la disponibilité des méthodes d'instance et de l'intégrité de vos invariants métier.

> **« Le protocole HTTP transporte des flux JSON inertes à travers le globe ; `httpResource()` orchestre leur rapatriement asynchrone sans bloquer l'Event Loop ; et vos fabriques Orientées Objet leur redonnent vie en mémoire vive sous forme d'entités riches, robustes et certifiées conformes. »**

---

## Clôture de la séance & Pont vers la Séance 18

Félicitations pour avoir franchi cette étape majeure du **Bloc D** !

Vous savez désormais :
- Naviguer avec aisance entre exécution synchrone et asynchrone grâce à l'Event Loop.
- Dialoguer avec des serveurs distants via les conventions de l'architecture REST.
- Déployer la puissance de `httpResource()` sous Angular 22 sans la complexité historique de RxJS.
- Réhydrater en temps réel des collections complètes d'entités métier vivantes à partir de réponses JSON externes.

Cependant, interroger une API REST suppose que **la machine cliente dispose d'une connexion Internet permanente**, et chaque rafraîchissement de page force le navigateur à redemander l'intégralité des données au serveur distant.

### Aperçu de la Séance 18 : Stockage Local & Introduction à Dexie.js
Dans la prochaine séance, nous aborderons la persistance locale sur le terminal de l'utilisateur :
- **Les mécanismes de stockage du navigateur** : Comparatif critique entre `LocalStorage`, `SessionStorage` et les `Cookies` (capacités, limitations textuelles, absence d'index).
- **Le gouffre entre Objets et Bases Relationnelles** : Pourquoi stocker des graphes d'objets complexes dans des tables relationnelles rigides pose problème (*Object-Relational Impedance Mismatch*).
- **La puissance d'IndexedDB & Dexie.js** : Découverte de la base de données orientée objets native du navigateur, capable de stocker des dizaines de mégaoctets de données hors-ligne avec requêtes indexées, transactions et performances optimales.
