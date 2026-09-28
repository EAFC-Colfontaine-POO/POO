# 🎭 Séance 7 — Le Polymorphisme en Programmation Orientée Objet
## Support de Cours Interactif & Banc d'Entraînement TypeScript / Angular Moderne

Bienvenue dans l'application pédagogique interactive conçue pour la **Séance 7** du cursus de POO & Développement Web Moderne.

Après avoir maîtrisé l'**encapsulation** (Séance 5) et l'**héritage** (Séance 6), cette application est dédiée à l'acquisition concrète et viscérale du **polymorphisme par sous-typage**, de la **liaison dynamique (late binding)**, du **principe Ouvert/Fermé (OCP)**, de la sécurisation par **Type Narrowing (`instanceof`)**, et de la comparaison avec les **unions discriminées**.

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** >= 18
- **NPM** >= 9

### Lancer l'application en local

Dans le répertoire du projet :
```bash
# Lancement du serveur de développement Angular
npm start
# ou directement :
# ng serve
```

Ouvrez ensuite votre navigateur à l'adresse : **`http://localhost:4200`**

### Compiler pour la production
```bash
npm run build
```
Les fichiers distribuables sont générés dans le dossier `dist/angular-seance7-poo-polymorphisme`.

---

## 🎨 Identité Visuelle : "Web & POO Studio"

L'application reprend fidèlement l'écosystème graphique des séances 5 et 6 :
- **Dark Mode & Light Mode** instantanés avec persistance dans le `localStorage`.
- **Typographie soignée** : *Inter* pour le corps de texte et *Fira Code* pour les extraits de code et le terminal virtuel.
- **Palette chromatique symbolique** :
  - Rouge Angular (`#dd0031`)
  - Violet Bootstrap (`#7952b3`)
  - Bleu TypeScript / CSS (`#264de4` / `#38bdf8`)
  - Jaune JavaScript (`#f7df1e`)
  - Vert Émeraude Succès (`#10b981`)
  - Rouge Erreur TS (`#ef4444`)
- **Barre de progression en temps réel** de la complétion des 25 micro-exercices.
- **Pluie de confettis** (`canvas-confetti`) lors de la validation d'un exercice.

---

## 🧪 Les 8 Simulateurs Interactifs

### 1. Tour de Contrôle vs Délégation (Le Pourquoi du Polymorphisme)
- **Objectif** : Comprendre pourquoi les cascades de `if` / `switch` sur le type d'un objet violent le principe Ouvert/Fermé (OCP).
- **Fonctionnalités** :
  - Comparatif visuel direct : Code Procédural vs Code Polymorphe POO.
  - Bouton interactif **« Ajouter un Média : JeuVideo »** :
    - *Côté Procédural* : Alerte rouge clignotante, lignes de code surlignées en rouge nécessitant une modification manuelle (violation OCP).
    - *Côté POO* : Badge vert « OCP Respecté », zéro ligne de code modifiée dans le code consommateur, ajout transparent par simple instanciation.

### 2. La Télécommande Universelle (Type Statique vs Type Dynamique)
- **Objectif** : Distinguer le type déclaré à la compilation de la classe réelle de l'objet en mémoire à l'exécution.
- **Fonctionnalités** :
  - Métaphore d'une télécommande universelle (`const m: Media`) pouvant pointer vers différents appareils (`Livre`, `Film`, `JeuVideo`).
  - Boutons d'action : `.titre`, `.getDescription()`, `.pages`, `.jouer()`.
  - Faisceau infrarouge animé entre la télécommande et le récepteur.
  - **Inspecteur de phase** montrant la différence entre la **Phase 1 (Statique / Compilation)** et la **Phase 2 (Dynamique / Exécution & Late Binding)**.

### 3. Liaison Dynamique & Chaîne des Prototypes (Sous le Capot)
- **Objectif** : Visualiser comment le moteur JavaScript résout les méthodes redéfinies (override) via la chaîne de prototypes.
- **Fonctionnalités** :
  - Vue mémoire Heap vs Stack (la référence `m` pointe vers l'instance en mémoire contenant `__proto__`).
  - Décomposition pas à pas de la recherche de méthode :
    `livreInstance` ➔ `Livre.prototype` (trouvé immédiatement !) ➔ `Media.prototype` ➔ `Object.prototype`.
  - Comparaison avec une méthode héritée non redéfinie (`.annee`) qui remonte la chaîne jusqu'à `Media.prototype`.

### 4. Le Restricteur de Vue & L'Erreur TS2339 (Sécurité Statique)
- **Objectif** : Démystifier l'erreur n°1 des étudiants : *« Mais mon objet en mémoire est un Livre, pourquoi m.pages provoque une erreur ? »*.
- **Fonctionnalités** :
  - Banc de test déclenchant l'erreur officielle TypeScript `TS2339: Property 'pages' does not exist on type 'Media'`.
  - Métaphore interactive de la boîte opaque et du sélecteur de vue :
    - Vue `m: Media` : L'étiquette masque les propriétés spécialisées pour protéger le développeur.
    - Vue `m: Livre` : L'étiquette débloque les propriétés spécifiques mais perd la généricité.
    - Vue `if (m instanceof Livre)` : Le compromis parfait grâce au Type Narrowing.

### 5. Collections Hétérogènes & Crash-Test OCP
- **Objectif** : Expérimenter la puissance d'un tableau `Media[]` contenant des sous-types variés.
- **Fonctionnalités** :
  - Catalogue dynamique d'objets : ajout et suppression de `Livre`, `Film`, `JeuVideo`, `Podcast`.
  - **Créateur de classe à la volée** : Définissez une classe personnalisée (ex: `BandeDessinee`), et injectez-la directement dans le catalogue !
  - Boucle universelle `for (const m of catalogue)` exécutant le code sans aucun `if` ni modification du moteur d'affichage.

### 6. `instanceof` & Type Narrowing : Quand et Comment Spécialiser
- **Objectif** : Savoir quand et comment spécialiser le traitement d'un sous-type de manière sûre, tout en évitant les pièges classiques.
- **Fonctionnalités** :
  - Démonstrateur de `instanceof` avec rétrécissement de type automatique dans les blocs conditionnels.
  - **Les 3 pièges cruciaux** :
    1. *Interface vs Classe* : `instanceof MonInterface` impossible car les interfaces sont effacées à la compilation.
    2. *Désérialisation `JSON.parse`* : Perte de la chaîne de prototypes (un objet recréé depuis JSON n'est plus reconnu par `instanceof`).
    3. *Jauge de dette technique* : Avertisseur visuel contre la tentation de recréer des cascades de `if (x instanceof A) ... else if (x instanceof B)`.

### 7. POO (Sous-typage) vs Approche Fonctionnelle (Unions Discriminées)
- **Objectif** : Comparer objectivement le polymorphisme orienté objet et les unions discriminées TypeScript.
- **Fonctionnalités** :
  - Code côte à côte : Hiérarchie de classes vs `type Media = Livre | Film | JeuVideo` avec propriété discriminante (`type: 'livre' | 'film'`).
  - Bac à sable de vérification d'exhaustivité avec le type `never` (`assertNever(m)`).
  - Matrice décisionnelle interactive pour choisir la bonne approche selon le projet (domain model extensible vs état applicatif / Redux / NgRx).

### 8. Architecture Angular de Production (TP Fil Rouge — Médiathèque Réactive)
- **Objectif** : Implémenter le polymorphisme dans une architecture Angular 19+ propre et réactive.
- **Structure en 3 couches** :
  1. *Modèle Métier TypeScript pur* : Classe abstraite `Media`, sous-classes `Livre`, `Film`, `JeuVideo`.
  2. *Service Réactif Angular* : `MediathequeService` exploitant les `signal()` et `computed()` pour un calcul réactif des statistiques et du filtrage.
  3. *Composant Standalone* : Rendu dynamique avec `@for`, cartes polymorphes appelant `m.getDescription()`, et actions spécialisées via `@if (m instanceof LivreClass)`.

---

## 💻 Le Laboratoire d'Entraînement (Workshops Lab)

Le banc de travail intègre **Monaco Editor** (le moteur de VS Code), avec coloration syntaxique, complétion TypeScript, analyse statique et un **Terminal Virtuel** interactif.

### 6 Labos Pédagogiques (25 Micro-Exercices)

| Labo | Thématique | Nb d'exercices | Notions Validées |
| :--- | :--- | :---: | :--- |
| **Lab 1** | Le Piège du Switch-Case & la Délégation | 4 | Remplacement de switch, méthode polymorphe `afficher()`, OCP, `calculerTarif()` |
| **Lab 2** | Types Statiques vs Dynamiques & TS2339 | 4 | Typage par la classe de base, erreur TS2339, invocation polymorphe `jouer()` |
| **Lab 3** | Override & Chaîne de Prototypes | 4 | `super()`, redéfinition de méthode, liaison tardive, chaîne `__proto__` |
| **Lab 4** | Collections Hétérogènes & Extensibilité OCP | 4 | Tableaux `Media[]`, boucle universelle, extension sans toucher au code existant |
| **Lab 5** | Type Narrowing Sécurisé & Pièges d'instanceof | 4 | `instanceof`, accès aux membres spécialisés, protection JSON, garde de type custom |
| **Lab 6** | Grand Défi d'Intégration : Simulateur Polymorphe | 5 | Système complet de combat RPG / Médiathèque avec calculs polymorphes avancés |

### Fonctionnalités du Code Runner
- **Analyse Statique par Regex** : Vérifie la présence des constructions clés (ex: interdiction des `switch`, obligation de `instanceof` ou `override`).
- **Évaluation Dynamique en Sandbox** : Exécute le code dans un environnement sécurisé avec capture des flux `console.log`.
- **Rapports d'Assurance Qualité** : Check-lists de critères réussis / échoués avec messages d'explication clairs.
- **Indice & Solution Révélable** : Accompagnement progressif de l'étudiant en cas de blocage.
- **Sauvegarde Automatique** : Toute modification et tout avancement sont mémorisés dans le navigateur via `localStorage`.

---

## 🛠️ Stack Technique

- **Framework** : [Angular 19 / 20](https://angular.dev/) (Standalone Components, Control Flow `@if` / `@for`, Signals)
- **Langage** : [TypeScript 5.x / 6.x](https://www.typescriptlang.org/)
- **Éditeur de Code** : [Monaco Editor](https://microsoft.github.io/monaco-editor/) via `@monaco-editor/loader`
- **Styles** : SCSS modulaire, CSS Custom Properties pour les thèmes clair/sombre
- **Effets** : `canvas-confetti`
