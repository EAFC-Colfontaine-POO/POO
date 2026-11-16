# Séance 19 : IndexedDB & Dexie.js — La vraie base de données du navigateur

Support de cours interactif et laboratoire d'entraînement intensif pour la **Séance 19** de Programmation Orientée Objet (Bachelier en Informatique, EAFC). Clôture du **Bloc D : Persistance des données**.

---

## 🎯 Objectifs Pédagogiques

- **Comprendre le Choc d'Impédance** : Pourquoi `LocalStorage` s'effondre sur les applications modernes (quota 5 Mo, blocage synchrone du thread principal, sérialisation destructrice) et comment `IndexedDB` apporte un moteur transactionnel asynchrone noSQL dans le navigateur.
- **Maîtriser Dexie.js 4+** : Simplifier l'API IndexedDB native (complexe et verbeuse) sans sacrifier la puissance ni le typage TypeScript strict.
- **La Règle d'Or du Schéma** : Ne déclarer dans `stores()` **que les index de recherche** (jamais toutes les propriétés).
- **Index B-Tree & Complexité Algorithmique** : Comprendre la différence entre un balayage linéaire $O(n)$ et une descente d'arbre $O(\log n)$, manipuler les index uniques (`&`), multi-entry (`*`) et composés (`[a+b]`).
- **Transactions ACID & Rollback** : Garantir l'intégrité des données (Atomicité, Cohérence, Isolation, Durabilité) et comprendre pourquoi les requêtes réseau (`fetch`, `HttpClient`) sont formellement proscrites à l'intérieur d'une transaction IndexedDB.
- **Migrations de Schéma en Production** : Mettre à niveau les bases de données déjà installées chez les utilisateurs via `.version().upgrade()` et la transformation de données `table.toCollection().modify()`.
- **Réhydratation POO & Triade DTO** : Restaurer les instances de classes de domaine (`new Livre()`, `Livre.fromDTO()`) à partir des records bruts IndexedDB pour préserver l'encapsulation native (`#`).

---

## 🏗️ Architecture & Technologies

- **Angular 22** :
  - Architecture **Signal-First** exclusive (`signal()`, `computed()`, `linkedSignal()`, `toSignal()`).
  - Stratégie de détection de changements `ChangeDetectionStrategy.OnPush` sur 100% des composants.
  - Syntaxe de flux de contrôle natif (`@if`, `@for`, `@switch`).
  - Aucun `BehaviorSubject` ni `ngOnInit` inutile.
- **TypeScript 5+** : Typage strict, interfaces DTO immuables (`readonly`), champs privés natifs ECMAScript (`#`).
- **Dexie.js 4+** : Encapsulation typée de la base de données via héritage de `Dexie`, tables typées `Table<DTO, Key>`.
- **Monaco Editor** :
  - Intégration de l'éditeur officiel VS Code dans le navigateur.
  - Injection dynamique de définitions TypeScript (`monaco.languages.typescript.typescriptDefaults.addExtraLib`) pour Dexie, Table, Collection, WhereClause et les modèles du domaine.
- **Transpilateur & Sandbox TS** :
  - Nettoyage TS natif préservant les champs privés `#`.
  - Exécution sandboxée asynchrone avec console virtuelle interactive.
  - Nettoyage automatique des bases éphémères (`Dexie.delete()`).
- **Vitest** :
  - Tests unitaires et suites d'audit de non-régression (`fake-indexeddb/auto`).

---

## 🧭 Parcours Pédagogique (8 Modules Interactifs + 1 Lab Global)

1. **Le Choc d'Impédance (`impedance-mismatch`)** :
   - Les 3 murs de LocalStorage (5 Mo, freeze UI du thread principal, pas d'indexation).
   - Métaphore de *La Voiture Découpée* (POO vs JSON).
   - Comparateur interactif de code natif `indexedDB.open()` vs Dexie `db.table.where()`.
2. **La Base Typée & Schéma Dexie (`typed-database`)** :
   - Constructeur visuel de schéma Dexie avec syntaxe `stores()`.
   - Démonstrateur de la *Règle d'Or* (erreur commune d'indexer toutes les colonnes vs bonne pratique).
   - Arbitrage architectural : UUID v4 (`string`) vs auto-incrément (`++id`).
3. **L'Anatomie des Index B-Tree (`btree-indexes`)** :
   - Visualiseur interactif d'arbre B-Tree : comparaison du nombre d'opérations ($O(n)$ vs $O(\log n)$).
   - Les 3 index spéciaux Dexie :
     - `&isbn` (Unique Index).
     - `*genres` (Multi-entry Index sur tableau).
     - `[nom+prenom]` (Index Composé).
4. **Fluent API Dexie & Réhydratation POO (`fluent-api`)** :
   - Bac à sable de requêtes interactif sur un corpus de 20 livres du domaine.
   - Méthodes `where()`, `equals()`, `between()`, `startsWithIgnoreCase()`, `anyOf()`, `filter()`.
   - Autopsie du prototype perdu et réhydratation par `Livre.fromDTO()`.
5. **Transactions ACID & Le Crash Test Rollback (`acid-transactions`)** :
   - Simulateur de transaction d'emprunt en 3 étapes :
     1. Vérification & Décrémentation du stock d'exemplaires.
     2. Création de l'emprunt dans la table `emprunts`.
     3. Logging d'audit.
   - Injection interactive de crash à l'étape 2 ou 3 avec rollback automatique immédiat.
   - Visualisation des 4 piliers ACID et démonstration du crash si `fetch()` est appelé en transaction.
6. **Migrations de Schéma en Production (`schema-migrations`)** :
   - Simulateur de montée de version v1 $\rightarrow$ v2.
   - Déclaration incrémentale de schéma `.version(1)` et `.version(2)`.
   - Hook `.upgrade(async tx => ...)` et transformation via `table.toCollection().modify()`.
   - Les 4 règles d'or pour ne jamais corrompre les données utilisateurs en production.
7. **Les 5 Anti-Patterns Mortels d'IndexedDB (`anti-patterns`)** :
   - Comparateur Avant / Après avec explications détaillées :
     - *Anti-Pattern 1* : Réouverture intempestive de la connexion (`new Dexie` dans chaque fonction).
     - *Anti-Pattern 2* : Requête réseau asynchrone au milieu d'une transaction ACID.
     - *Anti-Pattern 3* : Indexation systématique de toutes les propriétés du DTO.
     - *Anti-Pattern 4* : Boucle séquentielle `for...await` / `forEach` au lieu de `bulkPut` / `bulkAdd`.
     - *Anti-Pattern 5* : Utilisation brute des objets stockés sans réhydratation POO (`fromDTO`).
8. **Application Complète : BiblioTech Dexie & Signals (`bibliotech-demo`)** :
   - Application témoin en architecture 3 couches :
     - Couche 1 : Base Dexie `BibliothequeDB`.
     - Couche 2 : Service Angular `BibliothequeService` avec Signals réactifs (`livres`, `emprunts`).
     - Couche 3 : Composants UI (recherche, emprunt, restitution, ajout).
   - Inspecteur DevTools IndexedDB intégré en direct.
   - Bouton de stress-test pour tenter un double-clic sur le dernier exemplaire en stock.
9. **Espace Ateliers Pratiques (`workshops-lab`)** :
   - 26 micro-exercices répartis sur 6 labos progressifs avec validation en temps réel.

---

## 🧪 Les 26 Micro-Exercices d'Entraînement

| Labo | Thématique | Nb Ex. | Concepts Clés |
| :--- | :--- | :--- | :--- |
| **Labo 1** | Création de Base & Clés Primaires | 4 | `Dexie`, `Table<T, K>`, `stores()`, UUID, `++id`, `db.open()` |
| **Labo 2** | Index Uniques, Multi-Entry & Composés | 4 | `&indexUnique`, `*tagsTableau`, `[cle1+cle2]`, recherche compound |
| **Labo 3** | Fluent API, Recherche & Réhydratation | 5 | `where()`, `equals()`, `startsWithIgnoreCase()`, `fromDTO()`, tri |
| **Labo 4** | Transactions ACID & Robustesse | 5 | `db.transaction('rw')`, atomicité, rollback sur `throw`, piège du `fetch` |
| **Labo 5** | Migrations de Schéma Incrémentales | 4 | `.version(2).stores()`, `.upgrade()`, `modify()`, non-régression |
| **Labo 6** | Architecture POO, Signals & BiblioTech | 4 | Service Signal-First, `toSignal()`, encapsulation `#`, stress-test |

---

## 🚀 Installation & Lancement

### Prérequis
- **Node.js** v20+ ou v22+
- **npm** v10+

### Démarrage Rapide

```bash
# 1. Accéder au répertoire du projet
cd "/home/cchiodo/EAFC/POO/Séance 19/angular-seance19"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement Angular
npm start
# ou
ng serve --open
```

L'application est accessible à l'adresse [http://localhost:4200](http://localhost:4200).

---

## 🔬 Tests & Validation Automatisée

Le projet intègre une suite de tests Vitest avec `fake-indexeddb` pour valider les 26 exercices et le moteur de vérification :

```bash
# Exécuter les tests en console
npm test

# Exécuter les tests avec rapport détaillé
npx vitest run
```

### Build de Production

```bash
# Compiler le projet en mode production (AOT, arbres de secousses, minification)
npm run build
```

---

## 🏛️ Structure du Code Source

```
src/
├── app/
│   ├── app.config.ts                       # Configuration de l'application
│   ├── app.html                            # Layout principal avec switch réactif
│   ├── app.scss                            # Styles globaux du layout
│   ├── app.ts                              # Composant racine avec OnPush & préchargement Monaco
│   ├── core/
│   │   ├── models/
│   │   │   └── app.models.ts               # Types du domaine (LivreDTO, EmpruntDTO, TabId, Exercise)
│   │   └── services/
│   │       ├── exercise.service.ts         # Moteur de validation des exercices (regex & runtime)
│   │       ├── exercises.registry.ts       # Registre des 26 exercices (énoncés, codes, critères)
│   │       ├── monaco-loader.service.ts    # Chargeur Monaco & injection des types Dexie d.ts
│   │       ├── navigation.service.ts       # Navigation Signal-First (9 sections)
│   │       ├── theme.service.ts            # Gestion du thème sombre / clair
│   │       ├── typescript-transpiler.service.ts # Transpilateur TS avec support champs privés #
│   │       └── validation-utils.ts         # Utilitaires d'évaluation regex & AST
│   ├── features/
│   │   ├── impedance-mismatch/             # Module 1 : Choc d'impédance LocalStorage vs IndexedDB
│   │   ├── typed-database/                 # Module 2 : Schéma typé & Règle d'or
│   │   ├── btree-indexes/                  # Module 3 : B-Tree & 3 index spéciaux
│   │   ├── fluent-api/                     # Module 4 : Fluent API & Réhydratation POO
│   │   ├── acid-transactions/              # Module 5 : Transactions ACID & Rollback
│   │   ├── schema-migrations/              # Module 6 : Migrations v1 -> v2
│   │   ├── anti-patterns/                  # Module 7 : Les 5 Anti-Patterns
│   │   ├── bibliotech-demo/                # Module 8 : App complète BiblioTech 3 couches
│   │   └── workshops-lab/                  # Espace Ateliers Monaco (6 labos)
│   └── shared/
│       └── components/
│           ├── lab-runner/                 # Interface d'exécution et console virtuelle
│           ├── monaco-editor/              # Composant Wrapper Monaco Editor
│           ├── navbar/                     # Barre de navigation supérieure avec progression
│           └── sidebar/                    # Menu latéral rétractable avec icônes SVG
```

---

## 👨‍🏫 Auteur & Licence

- **Formation** : Bachelier en Informatique — Bloc D : Persistance des données.
- **Établissement** : EAFC (Enseignement pour Adultes et de Formation Continue).
- **Cours** : Programmation Orientée Objet & Architectures Web Modernes.
