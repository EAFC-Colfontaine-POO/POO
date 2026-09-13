# 🅰️ Angular Studio — Séance 3 : Architecture SPA, CLI & Composants Standalone

Application web interactive Angular moderne servant de **support pédagogique officiel** et de **démonstrateur d'apprentissage** pour le cours :
**Séance 3 — Présentation générale d'Angular (Architecture SPA, CLI & Composants Standalone)**.

Conçue pour les étudiants qui découvrent Angular et l'architecture web moderne monopage (*Single Page Application*), l'application permet d'expérimenter concrètement les mécanismes fondamentaux du framework, son cycle d'amorçage (*Bootstrap Flow*), son arborescence normalisée et de s'exercer via **Monaco Editor** avec validation automatique des critères.

---

## 🎯 Objectifs Pédagogiques du Cours

À l'issue de cette séance, l'étudiant est capable de :

1. **Expliquer** la différence conceptuelle et technique entre une application web traditionnelle (**Multi-Page Application — MPA**) et une application monopage (**Single Page Application — SPA**).
2. **Identifier** la fonction et le rôle de chaque dossier et fichier clé dans l'arborescence standard d'un projet généré par le CLI Angular (`src/`, `app.config.ts`, `main.ts`, `index.html`, `angular.json`, etc.).
3. **Décrire** l'anatomie d'un composant Angular *Standalone* (décorateur `@Component`, métadonnées `selector`, `imports`, `templateUrl`, `styleUrl`, et classe TypeScript associée).
4. **Tracer** le flux d'exécution initial d'une application Angular, depuis le chargement initial du fichier squelette `index.html` jusqu'à l'hydratation de la balise hôte `<app-root>` dans le DOM.
5. **Maîtriser** les 3 liaisons élémentaires de données (*Template Bindings*) : Interpolation `{{ expression }}`, Liaison de propriété `[propriété]="valeur"` et Liaison d'événement `(événement)="méthode()"`.
6. **Comprendre** l'isolation des styles CSS (*View Encapsulation*) et le rôle des attributs générés automatiquement par Angular (`_ngcontent-ng-c...`).
7. **Manipuler** l'environnement de développement local et les commandes fondamentales du CLI (`ng serve` avec *Live Reload*, `ng generate component`, `ng build`).
8. **Réaliser et valider** les 4 ateliers pratiques du cours dans un environnement IDE intégré avec **Monaco Editor**.

---

## 🚀 Démarrage Rapide

### Prérequis
* **Node.js** : version `20.x` ou supérieure (testé sous Node v24).
* **npm** : version `10.x` ou supérieure (testé sous npm 11).

### Installation & Lancement en Local

1. **Ouvrir un terminal dans le répertoire du projet** :
   ```bash
   cd "/home/cchiodo/EAFC/POO/Séance 2/typescript-seance2"
   ```

2. **Installer les dépendances du projet** :
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement local** :
   ```bash
   npm start
   # ou directement via le CLI Angular :
   npx ng serve
   ```

4. **Accéder à l'application dans votre navigateur** :
   Rendez-vous sur [http://localhost:4200](http://localhost:4200).
   L'application dispose du rafraîchissement automatique à chaud (*Live Reloading*).

5. **Exécuter la suite de tests automatisés** :
   ```bash
   npx ng test --watch=false
   ```

6. **Compiler pour la production** :
   ```bash
   npm run build
   ```
   Les fichiers optimisés et minifiés sont générés dans le dossier `dist/angular-seance3-demo/`.

---

## 🧩 Les 8 Modules Interactifs de l'Application

| N° | Module | Fonctionnalités & Démonstrateurs Pédagogiques |
|---|---|---|
| **1** | **Simulateur d'Architecture : MPA vs SPA** | **Comparateur visuel de flux réseau** avec animation de paquets HTTP. **Mode MPA** simulant la requête complète, le re-rendu serveur, le flash blanc de rechargement total et la **perte brutale d'état d'un champ de saisie**. **Mode SPA** démontrant la transition instantanée, l'appel API JSON asynchrone (480 octets) et la conservation parfaite de l'état client. Tableau interactif Avantages/Compromis filtrable. |
| **2** | **Arborescence & Fichiers Clés du CLI** | **Tree-view interactif pliable/dépliable** répliquant l'arborescence officielle d'un projet Angular (v21/22). **Inspecteur de rôle côte à côte** affichant le contenu type coloré de chaque fichier (`app.component.ts`, `app.config.ts`, `main.ts`, `index.html`, `angular.json`) et une fiche descriptive avec concepts clés et pièges d'examen. |
| **3** | **Cycle d'Amorçage (Bootstrap Flow)** | **Visualiseur séquentiel pas-à-pas en 4 étapes** (avec boutons Précédent, Suivant, Rejouer et Lecture Automatique) : (1) Réception du squelette `index.html` avec `<app-root>` vide, (2) Chargement et évaluation de `main.ts`, (3) Exécution de `bootstrapApplication(AppComponent, appConfig)`, (4) Remplacement et hydratation dans le DOM. **Inspecteur de DOM synchronisé en direct**. |
| **4** | **Anatomie d'un Composant Standalone** | **Déconstructeur visuel** du décorateur `@Component` (`selector`, `standalone: true`, `imports: []`, `templateUrl`, `styleUrl`) et de la classe TypeScript. **Mode Rayons X** : le survol ou clic d'une métadonnée active une projection laser vers le fichier lié (`index.html`, template HTML, styles CSS scopés). |
| **5** | **Bac à Sable des Liaisons de Données** | **Playground tri-vue en direct** des 3 liaisons élémentaires : **Interpolation** `{{ expression }}` avec saisie dynamique, **Property Binding** `[disabled]`, `[src]`, `[class.online]` avec commutateurs, et **Event Binding** `(click)="methode()"` avec compteur d'interactions. Vue synchronisée : État de classe TS <-> Template HTML <-> Rendu réel. |
| **6** | **Laboratoire d'Encapsulation CSS** | **Démonstrateur de scopage de styles** opposant un composant Parent (`AppComponent`) et Enfant (`HeaderComponent`). Visualiseur de compilation dévoilant l'attribut injecté `_ngcontent-ng-c...` et commutateur de mode : **Emulated** (étanche), **None** (démontrant la fuite de style où le parent devient violet !), et **ShadowDom**. |
| **7** | **Console Virtuelle du CLI Angular** | **Simulateur de terminal interactif** bash permettant de taper ou cliquer les commandes officielles : `ng serve` (avec log Vite/esbuild et bouton de simulation de Live Reload en 24ms), `ng generate component components/header` (animation de création des 4 fichiers), `ng build` (statistiques de bundle production), `ng test`, `ng version`. |
| **8** | **Espace Ateliers Pratiques (Monaco Editor)** | **Studio d'entraînement intensif** multi-fichiers avec **Monaco Editor** reprenant les 4 ateliers officiels du cours (`support_seance_3.md`) avec validation automatique des critères, aperçu visuel en direct et solution guidée. |

---

## 🧪 Espace Ateliers Pratiques (Les 4 Ateliers du Cours)

### 📌 Atelier 3.1 — Déclaration & Interpolation `{{ }}`
* **Objectif** : Déclarer `studentName: string` et `academicYear: string` dans la classe `AppComponent`, puis les afficher dans le template HTML via l'interpolation `{{ }}`.
* **Fichiers édités** : `app.component.ts` et `app.component.html`.
* **Validation** : Détection regex des propriétés dans la classe et des interpolations dans le template avec rendu instantané de la carte étudiante.

### 📌 Atelier 3.2 — Compteur interactif & Property / Event Binding
* **Objectif** : Implémenter la propriété `clickCount: number = 0`, les méthodes `increment()` et `resetCounter()`, relier les boutons via `(click)` et désactiver le bouton de réinitialisation via `[disabled]="clickCount === 0"`.
* **Fichiers édités** : `app.component.ts` et `app.component.html`.
* **Validation** : Vérification des méthodes, des événements de clic et de l'état désactivé du bouton réactif dans la prévisualisation.

### 📌 Atelier 3.3 — Arbre de Composants & Déclaration Standalone
* **Objectif** : Importer le sous-composant `HeaderComponent` dans `app.component.ts`, l'inscrire dans le tableau `imports: [HeaderComponent]` du décorateur `@Component` et insérer sa balise personnalisée `<app-header></app-header>` dans le template racine.
* **Fichiers édités** : `app.component.ts`, `app.component.html` et consultation de `header.component.ts`.
* **Validation** : Contrôle de la chaîne d'importation, de l'inscription Standalone et de la présence du tag dans l'arbre DOM.

### 📌 Atelier 3.4 — Isolation des Styles CSS (View Encapsulation)
* **Objectif** : Ajouter la règle `p { color: purple; font-style: italic; }` dans `header.component.css`. Constater que les paragraphes du composant Enfant deviennent violets et en italique, tandis que ceux du composant Parent restent strictement insensibles grâce à l'émulation de scopage d'Angular.
* **Fichiers édités** : `header.component.css`.
* **Validation** : Vérification de la règle CSS et observation du rendu comparé Parent / Enfant.

---

## 🛠️ Spécifications & Choix Techniques

* **Framework** : Angular v22.1 (Architecture 100% *Standalone Components*).
* **Gestion d'État Réactif** : Angular Signals (`signal`, `computed`).
* **Nouveau Control Flow** : Syntaxe native moderne (`@if`, `@for`, `@switch`).
* **Éditeur de Code Intégré** : **Monaco Editor** via `@monaco-editor/loader` avec fallback résilient (assets locaux configurés dans `angular.json` + CDN Cloudflare/jsDelivr si nécessaire) et synchronisation automatique avec le thème sombre/clair.
* **Design System** : Thème sombre et clair dynamique avec bascule instantanée et persistance locale (`localStorage`).
* **Exécution Client** : Aucune dépendance à un serveur backend distant. Toutes les simulations (réseau, compilation CLI, hydratation du DOM, validation de code) sont exécutées localement dans le navigateur de l'étudiant.

---

## 👨‍🏫 Auteur & Cadre Académique

* **Formation** : Programmation Orientée Objet (POO) — Bloc 0 (Mise en route).
* **Établissement** : EAFC Colfontaine.
* **Enseignant** : C. Chiodo.
