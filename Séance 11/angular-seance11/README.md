# 🏛️ TypeScript & Angular POO Studio — Séance 11 : Principes SOLID (S, O, D)

Laboratoire d'apprentissage interactif complet conçu pour le cours de **Programmation Orientée Objet** (Bachelier en Informatique · EAFC).

Cette application monopage (*SPA*) transforme les concepts abstraits d'architecture logicielle propre (*Clean Code*) en simulateurs visuels interactifs et propose **14 ateliers pratiques** exécutables dans un éditeur Monaco Editor intégré avec évaluation en mémoire vive.

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** : v20+ (testé avec Node v24.20)
- **NPM** : v10+

### Lancer le serveur de développement
```bash
npm start
# ou
npx ng serve
```
Ouvrez ensuite votre navigateur sur `http://localhost:4200/`.

### Compiler pour la production
```bash
npm run build
```
Les fichiers générés se trouveront dans `dist/angular-seance11-solid-s-o-d/`.

### Exécuter la suite de tests automatisée des exercices
```bash
npx vitest run src/app/core/services/exercise-solutions.spec.ts
```

---

## 🛠️ Stack Technique

- **Framework** : Angular v22 (Architecture 100% Standalone Components).
- **Gestion d'État Réactive** : Angular Signals (`signal`, `computed`, `effect`, `linkedSignal`).
- **Templates Modernes** : Contrôle de flux natif (`@if`, `@for`, `@switch`).
- **Éditeur de Code** : Monaco Editor (via `@monaco-editor/loader` avec fallback CDN jsDelivr automatique, worker TypeScript, coloration, autocomplétion).
- **Moteur d'Exécution & Bac à Sable** : Transpilation TypeScript vers JavaScript à la volée, évaluation sécurisée en mémoire vive, redirection des flux `console.log`, `console.info`, `console.warn`, `console.error` vers un terminal virtuel.
- **Moteur d'Assertions & Tests** : Évaluation de contrats d'interfaces et vérification de conformité architecturale en temps réel.
- **Effets Graphiques** : Moteur de confettis léger 100% Canvas HTML5 natif (zéro dépendance externe).
- **Styles & UI/UX** : SCSS sur mesure avec Design System "Architecture Studio" (Dark/Light mode, volet latéral rétractable, jauge de progression globale).

---

## 🧭 Parcours Pédagogique & Simulateurs Interactifs

L'application est articulée autour de 6 modules interactifs majeurs et d'un espace d'ateliers complet :

### 1. La Crise de la Maintenance & Les 3 Symptômes (*Code Smells*)
- **Simulateur d'effet domino (Château de cartes vs LEGO)** :
  - *Mode Château de cartes* : Modification de la TVA dans une classe spaghetti `ApplicationBoutique` ; propagation visuelle d'erreurs en cascade (crash de requête SQL, déconnexion SMTP).
  - *Mode LEGO* : Même modification dans un système modulaire ; seule la brique `CalculateurTva` est impactée, zéro effet de bord collatéral.
- **Matrice interactive des 3 pathologies de Martin** :
  - *Rigidité* : 1 modification impose 10 retouches en cascade.
  - *Fragilité* : réparer un calcul casse l'envoi d'e-mails.
  - *Immobilité* : impossible d'extraire une brique sans embarquer toute l'infrastructure.
- **Panorama interactif SOLID** : Infographie récapitulative des 5 piliers avec zoom actif sur S, O et D.

### 2. 'S' — Single Responsibility Principle (SRP)
- **Visualiseur "God Object vs Brigade Spécialisée"** :
  - Déconstruction de la classe monolithique `RapportVente` (métier, formatage HTML, I/O fichier).
  - Curseur d'inspection par acteur (Finance, Designer UI, DevOps) et démonstration du risque de conflits Git multi-développeurs.
  - Animation de décomposition en 3 classes ciblées : `RapportVente`, `FormateurRapportHtml`, `PersistenceFichier`.
- **Comparateur Angular : Fat Component vs Architecture Découplée** :
  - Vue côte à côte d'un `PanierComponent` réalisant des `fetch` et des calculs TVA face au refactoring propre utilisant un `PanierService` injecté (`@Injectable`).
- **Analyseur Lexical de Violations SRP** :
  - Détection automatique de mots-valises suspects dans les noms de classes (`...Manager`, `...Helper`, `...AndEmailSender`).

### 3. 'O' — Open/Closed Principle (OCP)
- **Le Piège du Switch/Case Interactif** :
  - Composant `CalculateurRemise` avec `switch` sur types de clients.
  - Bouton interactif « Ajouter le type SENIOR (-30%) » montrant l'obligation de modifier le code existant et les risques de régression sur le profil VIP.
- **Atelier Interactif Pattern Stratégie** :
  - Contrat d'interface `StrategieRemise`.
  - Calculateur fermé à la modification.
  - Injection dynamique de `RemiseSenior` à l'exécution avec **zéro ligne modifiée** dans le calculateur.
- **Simulateur de Routage Multi-Canal** :
  - Dispatcher d'alertes via le contrat `CanalNotification` implémenté par Email, SMS, Discord et WhatsApp.

### 4. 'D' — Dependency Inversion Principle (DIP)
- **Analogie de la Prise Murale 230V** :
  - Schéma animé démontrant le couplage fort par soudure directe (`new LampeHalogene()`) opposé au branchement sur prise standardisée 230V (`interface PriseElectrique`).
- **Démystificateur des 2 Lois de Robert C. Martin** :
  - Modules de haut niveau (domaine) vs bas niveau (détails techniques SQL, HTTP).
  - Inversion de la flèche de dépendance.
- **Le Problème du "new" en Dur** :
  - Comparatif visuel d'un service instanciant directement `new BaseDeDonneesSQL()` face à l'injection d'un contrat `RepositoryCommande`.

### 5. DIP dans Angular & Banc de Test Unitaire Ultra-Rapide
- **Laboratoire de Test Unitaire en RAM** :
  - Démonstrateur mesurant le temps d'exécution réel : test avec vraie base de données PostgreSQL (~450 ms, risque d'échec réseau) vs Fake Repository en RAM (~2 ms, isolation déterministe).
- **Visualiseur du Moteur d'Injection Angular (DI)** :
  - Décorateur `@Injectable({ providedIn: 'root' })`.
  - Fonction moderne `inject()`.
  - Substitution dynamique de providers pour les tests unitaires (`useValue`).

### 6. Synergie S-O-D & Tableau d'Arbitrage
- **Pipeline Vertueux S ➔ O ➔ D** :
  - Chaîne complète : 1. SRP isole les rôles ➔ 2. OCP pose les interfaces ➔ 3. DIP injecte sans instanciation directe.
- **Quiz Interactif "Code Smell Detector"** :
  - Analyse d'extraits de code, diagnostic du principe violé et recommandation du patron de conception adéquat (Strategy, Repository, Adapter).

---

## 💻 Catalogue des 14 Ateliers Pratiques (Monaco Editor)

| Labo | N° | Titre du Défi | Objectif Pédagogique |
| :--- | :--- | :--- | :--- |
| **Lab 1 (SRP)** | 1.1 | Découplage Métier / Affichage | Extraire le HTML hors de `CompteBancaire` vers `ReleveBancaireHtml`. |
| | 1.2 | Découplage de la Persistance | Extraire le `localStorage` de `GestionnaireTaches` vers `StockageTachesLocal`. |
| | 1.3 | Refactoring Angular : Smart vs Presentational | Transférer les calculs de TVA du composant vers `ProduitService`. |
| | 1.4 | Audit de Cohésion : Scinder UtilisateurManager | Séparer `ServiceSecurite` (auth/hash) et `ServiceNotification` (e-mails/SMS). |
| **Lab 2 (OCP)** | 2.1 | Élimination de switch par Stratégie | Remplacer le switch des transporteurs par `StrategieFraisPort` (DHL, Poste). |
| | 2.2 | Extension sans modification | Ajouter `RemiseEtudiant` (-20%) sans toucher à `CalculateurRemise`. |
| | 2.3 | Système de validation extensible | Créer un moteur `FormValidator` ouvert à des règles polymorphiques. |
| | 2.4 | Notification multi-plateforme | Implémenter `CanalNotification` pour brancher `WebhookDiscordNotification`. |
| **Lab 3 (DIP)** | 3.1 | Bannir le new hardcodé | Injecter l'interface `StockageSession` dans `ServiceAuthentification`. |
| | 3.2 | Contrat de Repository de données | Définir `ArticleRepository` et l'injecter dans `GestionCatalogue`. |
| | 3.3 | Fake Repository pour Test Unitaire | Écrire `InMemoryArticleRepository` et valider le catalogue en RAM en 1 ms. |
| | 3.4 | Injection Angular & Doubles de Test | Tester un service consommant `ApiClient` avec un mock sans appel HTTP réel. |
| **Lab 4 (Synthèse)** | 4.1 | Le Moteur de Commande Complet | Refactoriser un monolithe en appliquant conjointement SRP, OCP et DIP. |
| | 4.2 | Détection & Correction en Temps Réel | Assainir une classe commerciale truffée de violations S, O et D. |

---

## 📁 Structure du Projet

```
angular-seance11/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss                       # Design system Dark/Light Studio
│   └── app/
│       ├── app.ts                        # Composant racine standalone
│       ├── app.html                      # Layout Navbar + Sidebar + Switch
│       ├── app.scss
│       ├── core/
│       │   ├── models/app.models.ts      # Modèles TypeScript & assertions
│       │   ├── services/
│       │   │   ├── theme.service.ts      # Gestion Dark/Light + localStorage
│       │   │   ├── navigation.service.ts # Navigation 6 modules + ateliers
│       │   │   ├── confetti.service.ts   # Animations Canvas légères
│       │   │   ├── monaco-loader.service.ts # Loader Monaco + fallback CDN
│       │   │   ├── exercise.service.ts   # Transpilation & bac à sable d'évaluation
│       │   │   └── exercise-solutions.spec.ts # Tests automatisés Vitest
│       │   └── data/
│       │       ├── lab1.data.ts          # 4 défis SRP
│       │       ├── lab2.data.ts          # 4 défis OCP
│       │       ├── lab3.data.ts          # 4 défis DIP
│       │       └── lab4.data.ts          # 2 défis Synthèse SOLID
│       ├── shared/components/
│       │   ├── navbar/                   # En-tête Studio avec jauge live
│       │   ├── sidebar/                  # Volet rétractable avec compteurs
│       │   ├── monaco-editor/            # Composant wrapper Monaco Editor
│       │   └── lab-runner/               # Split-view éditeur, terminal & critères
│       └── features/
│           ├── 01-crise-maintenance/     # Simulateur Château de cartes vs LEGO
│           ├── 02-srp-single-responsibility/ # God Object vs Brigade & Audit
│           ├── 03-ocp-open-closed/       # Switch trap, Stratégie & Multi-canal
│           ├── 04-dip-dependency-inversion/  # Prise 230V & 2 lois de Martin
│           ├── 05-dip-angular-testing/   # Fake repo en RAM & DI Angular
│           ├── 06-synergie-sod-arbitrage/# Pipeline vertueux & Quiz interactif
│           └── workshops-lab/            # Espace Ateliers Pratiques avec filtres
```
