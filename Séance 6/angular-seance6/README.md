# 🏛️ Séance 6 — L'Héritage en Programmation Orientée Objet
> **Factorisation, Spécialisation, Mécanique TypeScript & Architecture de Composants Angular**  
> *Plateforme Pédagogique Interactive & Studio de Développement Pratique (Angular 22+ & TypeScript 6)*

---

## 🎯 Objectifs Pédagogiques

Cette application web interactive a été conçue pour enseigner et démystifier **l'héritage en POO** à des étudiants maîtrisant déjà la classe individuelle et l'encapsulation (Séance 5). Elle allie **rigueur conceptuelle**, **démonstrateurs visuels interactifs** et **pratique intensive guidée** grâce à un éditeur Monaco intégré.

### Compétences Clés Développées :
1. **Factoriser sans sur-abstraire** : Détecter la duplication de code (DRY) et créer une classe mère naturelle (`Media`).
2. **Distinguer « Est-un » (*is-a*) et « A-un » (*has-a*)** : Éviter l'anti-pattern de l'héritage de commodité et privilégier la composition quand la substitution n'est pas absolue.
3. **Maîtriser le cycle d'instanciation (`extends` / `super()`)** : Comprendre pourquoi `super()` est obligatoire avant tout accès à `this` (résolution de l'erreur `TS17009`).
4. **Graduer l'encapsulation avec `protected`** : Protéger les données internes contre le monde extérieur tout en les partageant loyalement avec la lignée descendante.
5. **Sécuriser la redéfinition avec `override`** : Exploiter `noImplicitOverride` (TypeScript) pour prévenir les fautes de frappe silencieuses (`TS4113`) et enrichir le parent via `super.methode()`.
6. **Anticiper la fragilité de la classe de base** : Visualiser l'effet domino des modifications parentes et l'effet Yo-Yo dans les hiérarchies trop profondes.
7. **Intégrer l'héritage dans Angular** : Manipuler des collections d'objets dérivés avec les **Angular Signals** (`signal<Media[]>`, `computed`) et le control flow moderne (`@for`, `@empty`).

---

## 🕹️ Les 7 Simulateurs Visuels de Concepts

L'application intègre 7 modules visuels d'exploration interactive :

| Module | Thématique | Fonctionnalités Interactives Clés |
| :--- | :--- | :--- |
| **1. Genèse & Problème de Duplication** | Dette technique & Factorisation | Bascule dynamique Avant/Après factorisation, calculatrice de dette technique (lignes dupliquées, coût de maintenance), animation de factorisation vers la classe mère `Media`. |
| **2. Relation « Est-un » vs « A-un »** | Héritage vs Composition | Test de la question d'or, mini-jeu de tri de cartes glissables (Livre/Media, Voiture/Moteur, etc.) avec validation instantanée et explication didactique. |
| **3. Cycle de Construction & `super()`** | Mécanique mémoire & `TS17009` | Démonstrateur interactif du piège `TS17009` (inversion de code), animation en 4 étapes de l'analogie du bâtiment (fondations puis étages) et suivi du pointeur `this` en mémoire. |
| **4. Encapsulation & Visibilité `protected`** | Les 3 niveaux d'accès | Schéma animé à 3 cercles concentriques (Public, Protected, Private), sélecteur de contexte d'accès (Monde extérieur, Fille `Livre`, Classe `Media`) et matrice comparative. |
| **5. Redéfinition `override` & Sécurité** | Méthodes dérivées & `TS4113` | Démonstrateur d'erreur de frappe silencieuse vs détection `override` (`noImplicitOverride`), simulateur de chaîne d'enrichissement dynamique avec `super.description()`. |
| **6. Classe Fragile & Effet Yo-Yo** | Couplage fort & Limites | Simulateur d'effet domino : modifier la signature ou le comportement de la classe mère et constater l'impact en cascade sur les classes filles ; visualiseur d'effet Yo-Yo sur 6 niveaux. |
| **7. Showroom Démo Angular** | Composants & Signals | Architecture découpée en 3 volets (Modèles TS purs, Composant Standalone Angular avec `signal<Media[]>`, Template réactif `@for` / `@empty`), console d'actions réelles et teasing pour la Séance 7. |

---

## 💻 Module 8 : Studio d'Atelier & 17 Micro-Exercices

Un environnement de développement complet inspiré de VS Code permet aux étudiants de pratiquer directement dans le navigateur :

- **Éditeur Monaco professionnel** (moteur de VS Code) avec coloration syntaxique TypeScript, numérotation de lignes, autocomplétion et raccourcis.
- **Console virtuelle temps réel** capturant `console.log`, `console.warn`, `console.error` avec horodatage et typage visuel.
- **Double moteur d'évaluation automatique** :
  - *Analyse syntaxique* : vérification par expressions régulières et règles d'interdiction (`noImplicitOverride`, interdiction de duplication, etc.).
  - *Exécution sandboxée en mémoire* : transpilation TypeScript vers JavaScript, instanciation isolée et assertions de comportement unitaire.
- **Système d'aide gradué** : indices contextuels déblocables sans pénalité et solution complète commentée disponible au besoin.
- **Célébration visuelle** : déclenchement de confettis (`canvas-confetti`) et sauvegarde de la progression dans `localStorage`.

### Répartition des 5 Parcours Pratiques :

* **Labo 1 : Déclaration de sous-classe & `super()`**
  * `Ex 1.1` : Première sous-classe `Livre` dérivant de `Media`
  * `Ex 1.2` : Réparer l'ordre du constructeur (Piège `TS17009`)
  * `Ex 1.3` : Spécialisation de `Film` avec durée et réalisateur
  * `Ex 1.4` : Factorisation DRY : Créer la mère `Media` à partir de classes dupliquées
* **Labo 2 : Visibilité `protected` & Encapsulation**
  * `Ex 2.1` : Passage en `protected` d'un identifiant pour usage filial
  * `Ex 2.2` : Secret de famille : `CompteBancaire` & découvert autorisé dans `CompteCourant`
  * `Ex 2.3` : Différence stricte entre `private` (# / TS) et `protected`
* **Labo 3 : Redéfinition (`override`) & Enrichissement (`super.methode()`)**
  * `Ex 3.1` : Spécialisation du comportement d'affichage (`description()`)
  * `Ex 3.2` : Chaînage d'enrichissement avec `super.description()`
  * `Ex 3.3` : Sécurité de compilation avec le mot-clé `override` (Éviter le piège de la typo)
  * `Ex 3.4` : Calcul de salaire spécialisé (`Employe` et `Manager`)
* **Labo 4 : Architecture Objet : Héritage vs Composition**
  * `Ex 4.1` : Refactoring d'un faux héritage (`Client` / `Facture` ou `Avion` / `Aile`)
  * `Ex 4.2` : Implémentation du pattern de délégation
  * `Ex 4.3` : Détection et correction d'une violation du principe « Est-un »
* **Labo 5 : Intégration Angular & Signals Réactifs**
  * `Ex 5.1` : Composant `MediathequeComponent` avec signal typé `signal<Media[]>`
  * `Ex 5.2` : Compteur réactif `computed()` sur une collection d'objets dérivés
  * `Ex 5.3` : Ajout immuable d'un nouvel objet dérivé dans le signal

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** v20.x ou supérieure (v24.x recommandée)
- **npm** v10.x ou supérieure

### Installation
```bash
# Se placer dans le répertoire du projet
cd angular-seance6

# Installer les dépendances
npm install
```

### Lancer le Serveur de Développement
```bash
npm start
# ou
npx ng serve
```
L'application est immédiatement accessible sur `http://localhost:4200`.

### Compiler pour la Production
```bash
npm run build
```
Les fichiers statiques optimisés sont générés dans le dossier `dist/angular-seance6-poo-heritage/browser`.

---

## 📐 Architecture Technique

```
src/
├── app/
│   ├── app.ts                               # Composant racine shell (Standalone)
│   ├── app.html                             # Layout global Dev Studio
│   ├── app.scss                             # Styles structurels, variables & thèmes
│   ├── app.routes.ts                        # Définition des 8 routes principales
│   │
│   ├── core/                                # Cœur de l'application
│   │   ├── models/
│   │   │   └── app.models.ts                # Typages stricts (Simulateurs, Labs, Exercices)
│   │   └── services/
│   │       ├── navigation.service.ts        # Gestion d'état de l'onglet actif & sidebar
│   │       ├── exercise.service.ts          # Moteur de 17 exercices, AST/regex & sandbox
│   │       ├── theme.service.ts             # Thème sombre / clair persistant
│   │       ├── confetti.service.ts          # Célébrations visuelles de succès
│   │       └── monaco-loader.service.ts     # Initialisation locale & CDN de Monaco
│   │
│   ├── shared/                              # Composants réutilisables
│   │   └── components/
│   │       ├── navbar/                      # Header Dev Studio avec jauge de progression
│   │       ├── sidebar/                     # Navigation latérale avec icônes vectorielles
│   │       ├── monaco-editor/               # Wrapper Angular pour Monaco Editor
│   │       └── code-runner/                 # Interface d'exercice (Éditeur + Console + Bilan)
│   │
│   └── features/                            # Les 8 modules pédagogiques
│       ├── dry-problem/                     # Module 1 : Genèse & Duplication DRY
│       ├── is-a-vs-has-a/                   # Module 2 : « Est-un » vs « A-un » (Composition)
│       ├── constructor-super/               # Module 3 : extends, super() & cycle mémoire
│       ├── protected-encapsulation/         # Module 4 : Cercles concentriques protected
│       ├── override-enrichment/             # Module 5 : override, noImplicitOverride & super.methode()
│       ├── fragile-base-class/              # Module 6 : Couplage fort, Classe fragile & Yo-Yo
│       ├── angular-mediatheque/             # Module 7 : Showroom Démo Angular & Signals
│       └── workshops-lab/                   # Module 8 : Studio d'ateliers (17 micro-exercices)
│
├── styles.scss                              # Thème global, palette Dev Studio & Bootstrap 5
└── main.ts                                  # Point d'entrée bootstrapApplication
```

---

## 🎓 Guide Pédagogique pour l'Enseignant

1. **Phase 1 — Pourquoi hériter ? (Modules 1 & 2)** :
   Montrer d'abord la duplication insupportable de code entre `Livre`, `Film` et `ArticlePresse`. Laisser les étudiants expérimenter la calculatrice de dette technique. Utiliser le jeu de tri « Est-un » pour casser le réflexe d'hériter par simple commodité syntaxique.
2. **Phase 2 — La Mécanique Pure (Modules 3, 4 & 5)** :
   Ouvrir le démonstrateur `TS17009`. Montrer que JavaScript bloque l'accès à `this` au niveau physique du moteur V8. Expliquer la métaphore du bâtiment avec le visualiseur de mémoire. Introduire `protected` via le scanner concentrique et prouver l'utilité du flag `noImplicitOverride`.
3. **Phase 3 — Les Pièges & La Maturité de Design (Module 6)** :
   Jouer avec le simulateur de classe fragile pour faire prendre conscience qu'hériter, c'est épouser la classe mère. Expliquer pourquoi la composition est souvent préférée en architecture logicielle d'entreprise.
4. **Phase 4 — Mise en Pratique Intensive (Module 8)** :
   Inviter les étudiants à valider les 17 micro-exercices. L'ordre est rigoureusement aligné sur la courbe d'apprentissage : chaque concept théorique trouve son application immédiate dans le Monaco Sandbox.
5. **Phase 5 — Pont vers la Séance 7 (Module 7)** :
   Conclure sur le showroom Angular Médiathèque pour montrer la puissance du tableau hétérogène `signal<Media[]>`, ouvrant naturellement la porte au polymorphisme dynamique de la séance suivante.
