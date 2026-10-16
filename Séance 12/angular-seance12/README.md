# Web & POO Studio — Séance 12 : Les Objets eux-mêmes
> **Identité, Comparaison, Clonage & Passerelle vers Angular Signals**  
> *Cours de Programmation Orientée Objet — Bachelier en Informatique (EAFC)*  
> *Stack technique : Angular 22 (Standalone Components, Signals réactifs, Control Flow natif), TypeScript 5+/6, Monaco Editor, SCSS.*

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** : v20+ ou v24+
- **npm** : v10+ ou v11+
- **Angular CLI** : v22+

### Installation & Lancement
```bash
# 1. Se positionner dans le dossier du projet
cd "/home/cchiodo/EAFC/POO/Séance 12/angular-seance12"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement Angular
npm start
# ou
npx ng serve
```

L'application est accessible sur [http://localhost:4200/](http://localhost:4200/).

Pour compiler pour la production :
```bash
npm run build
```

---

## 🎯 Objectifs Pédagogiques de la Séance 12

Cette application interactive a été conçue pour permettre aux étudiants de comprendre en profondeur la vie intime des objets en mémoire :

1. **Distinguer Identité et Valeur** : Comprendre le modèle mémoire sous-jacent (**Pile / *Stack*** vs **Tas / *Heap***), les pointeurs hexadécimaux de référence (`0x10A`, `0x20B`), et pourquoi `{ a: 1 } !== { a: 1 }`.
2. **Implémenter une méthode `equals()` robuste** : Combler l'absence de surcharge d'opérateur en JavaScript/TypeScript en respectant l'anatomie canonique en 3 étapes (court-circuit d'adresse, garde de type strict `instanceof`, comparaison sémantique) et les 4 lois d'équivalence (réflexivité, symétrie, transitivité, cohérence).
3. **Différencier Entités et Value Objects** : Comparer les objets selon leur nature (identifiant pérenne `id` vs totalité des attributs), formaliser le contrat `Equatable<T>` et bannir l'anti-pattern `JSON.stringify()`.
4. **Maîtriser la Duplication (Shallow vs Deep Copy)** : Diagnostiquer les ravages de l'analogie de la valise câblée avec `{ ...obj }`, utiliser `structuredClone()` pour les données pures et implémenter le pattern POO `clone()` pour préserver prototypes et méthodes.
5. **Pratiquer l'Immutabilité** : Combiner le double bouclier (`readonly` en compilation TS + `Object.freeze()` au runtime JS) pour forger des *Value Objects* indestructibles (`Monnaie`).
6. **Comprendre la Réactivité Angular Signals** : Visualiser pourquoi `Object.is(0x10A, 0x10A)` ignore les mutations sur place et pourquoi la production d'une nouvelle référence mémoire (`0x10A !== 0x20B`) est la clé absolue du rafraîchissement chirurgical du DOM.

---

## 🧭 Architecture des 6 Chapitres & Simulateurs

L'application est structurée autour d'une barre latérale rétractable et d'un header persistant :

### 1. Le Modèle Mémoire : Pile (Stack) vs Tas (Heap) & L'Énigme du `===`
- **L'Énigme interactive** : Comparaison interactive de primitives (`100 === 100` ➔ `true`) vs objets identiques (`new Point(10, 20) === new Point(10, 20)` ➔ `false`).
- **Simulateur dynamique de RAM** : Visualisation en 3 colonnes (Pile à gauche avec pointeurs, flèches dynamiques au centre, Tas à droite avec objets alloués). Boutons d'allocation (`p1`, `p2`, alias `p3`) et mutation en direct avec télémétrie des comparaisons.
- **Deux analogies illustrées** : Les vrais jumeaux (même valeur/visage mais 2 cartes d'identité) et l'adresse postale (le papier contient l'adresse, pas le bâtiment).
- **Le piège des deux télécommandes pour la même TV** : Bob retire 400 € sur `compteBob = compteAlice`, le solde d'Alice chute en direct.

### 2. L'Égalité Métier & La Méthode `equals()`
- **Anatomie canonique en 3 étapes** : (1) Court-circuit d'adresse `this === other`, (2) Garde strict `!(other instanceof MaClasse)`, (3) Comparaison des champs signifiants.
- **Démonstrateur Entité vs Value Object** : Modification en temps réel d'un `Utilisateur` (l'égalité se maintient grâce à l'ID) vs une `Monnaie` (l'égalité bascule dès qu'un champ diffère).
- **Laboratoire des 4 lois** : Réflexivité, Symétrie, Transitivité et Cohérence vérifiées.
- **Anti-pattern `JSON.stringify()`** : Démonstration visuelle de l'échec sur inversion des clés, destruction des `Date` et des méthodes de classe.

### 3. La Duplication : Copie Superficielle (Shallow) vs Copie Profonde (Deep)
- **Visualiseur du Shallow Copy** : Spread `{ ...obj }` et l'analogie de la valise câblée (la modification du sous-objet altère l'original en silence).
- **Deep Copy avec `structuredClone()`** : Duplication récursive native, et démonstration visuelle de sa limite (perte du prototype et des méthodes).
- **Patron de conception POO `clone()`** : Duplication avec délégation (`this.adresse.clone()`) préservant l'encapsulation et le prototype.
- **Matrice interactive de décision** : Tableau guidant le choix entre affectation, spread, `structuredClone` et méthode `clone()`.

### 4. L'Immutabilité en POO : `readonly`, `Object.freeze()` & Value Objects
- **Tableau blanc (Mutable) vs Gravure sur pierre (Immuable)**.
- **Le Double Bouclier** : `readonly` (compilation) + `Object.freeze()` (runtime) avec testeur de tentative de mutation interceptant les `TypeError`.
- **Le Value Object `Monnaie`** : Invariants au constructeur et méthode pure `ajouter(autre)` retournant une nouvelle instance.
- **Mur des pièges classiques des juniors** : `.push()`, `const` vs `freeze()`, dates et clonage de classes.

### 5. La Clé de Voûte : Angular Signals & Réactivité Mémoire
- **Simulateur `Object.is()`** : Comparaison des adresses mémoire par le moteur réactif.
- **Fiche Article Interactive (Signals POS)** :
  * Bouton Rouge (*Muter en place*) : Mute dans le tas sans changer l'adresse (`0x10A`) ➔ L'écran reste figé sur 100 € !
  * Bouton Vert (*Nouvelle instance*) : Alloue `new Article` à `0x20B` ➔ L'écran s'actualise immédiatement à 70 € !
  * Journal de télémétrie en temps réel.
- **Synthèse philosophique** : *On écrit `equals()` pour reconnaître nos objets au niveau métier, et on produit de nouvelles références pour réveiller les signaux Angular.*

### 6. Espace Ateliers Pratiques (22 Micro-Exercices Monaco)
- Regroupement des 22 micro-exercices d'entraînement répartis sur les 5 labos avec filtrage interactif.

---

## 💻 Les 22 Micro-Exercices Pratiques Monaco

Chaque exercice intègre un énoncé clair, un code de démarrage guidé, des critères d'évaluation automatiques, un terminal virtuel interceptant `console.log`, un bouton indice et la solution officielle pas-à-pas :

| Labo | N° | Titre de l'Exercice | Objectif Pédagogique |
|:---:|:---:|---|---|
| **Lab 1** | **1.1** | L'Illusion de l'égalité d'objets | Prouver que `new Point() === new Point()` vaut `false` mais `x === x` vaut `true`. |
| | **1.2** | L'Effet de bord par affectation d'adresse | Remplacer l'alias `compteB = compteA` par un spread pour isoler le compte d'Alice. |
| | **1.3** | Le Piège de la comparaison de Dates | Corriger `d1 === d2` en utilisant `.getTime()` pour comparer les timestamps. |
| | **1.4** | Détecter un alias intentionnel en mémoire | Écrire une fonction qui vérifie si deux variables pointent vers le même objet physique. |
| **Lab 2** | **2.1** | Le Court-circuit d'adresse mémoire | Écrire la 1ère étape de performance : `if (this === other) return true;`. |
| | **2.2** | Le Garde de type strict instanceof | Protéger la méthode `equals(other: unknown)` contre `null`/`undefined` via `instanceof`. |
| | **2.3** | Égalité complète d'un Value Object | Implémenter les 3 étapes canoniques sur la classe `Coordonnees(x, y)`. |
| | **2.4** | Égalité d'une Entité Métier | Implémenter l'égalité d'un `Utilisateur` en comparant uniquement son `id` unique. |
| | **2.5** | Le Contrat d'Interface `Equatable<T>` | Faire implémenter le contrat et rechercher un article avec `panier.some(...)`. |
| **Lab 3** | **3.1** | Copie Superficielle avec Spread | Cloner un objet de configuration plat et modifier le clone sans altérer l'original. |
| | **3.2** | Le Piège du sous-objet partagé | Mettre en évidence la mutation silencieuse de l'original sur un objet imbriqué. |
| | **3.3** | Copie Profonde avec structuredClone() | Corriger le bug du sous-objet grâce à la fonction standard récursive. |
| | **3.4** | Clonage POO : La méthode clone() | Implémenter `clone(): Adresse` retournant une nouvelle instance avec prototype. |
| | **3.5** | Clonage POO avec Délégation Récursive | Implémenter `Client.clone()` en déléguant à `this.adresse.clone()`. |
| **Lab 4** | **4.1** | Le Double Bouclier : readonly + freeze() | Déclarer des propriétés `readonly` et sceller l'instance avec `Object.freeze(this)`. |
| | **4.2** | Opération Pure sur Value Object | Ajouter la méthode pure `translater(dx, dy)` retournant un `new Vecteur2D`. |
| | **4.3** | Immutabilité des Tableaux : Bannir .push() | Remplacer `.push()` par `[...tab, el]` pour ne pas muter le tableau d'entrée. |
| | **4.4** | La Classe Monnaie Complète | Valider les invariants, sceller l'objet, implémenter `equals()` et l'addition pure. |
| **Lab 5** | **5.1** | Réveiller un Signal Figé | Remplacer la mutation en place par `profil.update(p => ({ ...p, age: p.age + 1 }))`. |
| | **5.2** | Mise à jour Immuable de Liste | Marquer une tâche terminée via `taches.update(liste => liste.map(...))`. |
| | **5.3** | Méthode de Copie Fonctionnelle | Implémenter `avecNouveauPrix()` et l'utiliser pour actualiser un signal de composant. |
| | **5.4** | Remplacement d'Entité avec equals() | Remplacer un article dans un catalogue de signal en le localisant via `it.equals(maj)`. |

---

## 🛠️ Architecture Technique

```
src/app/
├── core/
│   ├── models/app.models.ts          # Interfaces typées (ExerciseDef, ValidationCriterion, TabId)
│   ├── services/
│   │   ├── navigation.service.ts     # Routage interne réactif par Signals
│   │   ├── theme.service.ts          # Gestion du thème Dark / Light
│   │   ├── monaco-loader.service.ts  # Chargement autonome de Monaco (local + CDN)
│   │   ├── confetti.service.ts       # Effets de célébration canvas-confetti
│   │   └── exercise.service.ts       # Transpiler TS->JS, Sandbox d'exécution, assertions
│   └── data/
│       ├── lab1.data.ts              # Données & tests Labo 1 (4 exercices)
│       ├── lab2.data.ts              # Données & tests Labo 2 (5 exercices)
│       ├── lab3.data.ts              # Données & tests Labo 3 (5 exercices)
│       ├── lab4.data.ts              # Données & tests Labo 4 (4 exercices)
│       └── lab5.data.ts              # Données & tests Labo 5 (4 exercices)
├── shared/components/
│   ├── navbar/                       # Barre supérieure avec ratio d'exercices validés
│   ├── sidebar/                      # Menu rétractable des 6 modules
│   ├── monaco-editor/                # Éditeur Monaco haute performance
│   └── code-runner/                  # IDE d'évaluation en direct avec terminal virtuel
└── features/
    ├── memory-model-identity/        # Module 1 (Stack vs Heap, Énigme ===)
    ├── business-equality-equals/     # Module 2 (equals(), 3 étapes, 4 lois)
    ├── cloning-shallow-vs-deep/      # Module 3 (Shallow vs Deep, structuredClone)
    ├── immutability-value-objects/   # Module 4 (readonly, freeze, Monnaie)
    ├── angular-signals-memory/       # Module 5 (Signals POS, Object.is)
    └── workshops-lab/                # Module 6 (Vue globale des 22 exercices)
```

---

## 🎓 Remerciements & Contexte Académique
Application conçue pour le cours de **Programmation Orientée Objet** (Bachelier en Informatique - EAFC).  
Fin du **Bloc B (Qualité & Maîtrise des Objets)** et passerelle vers le **Bloc C (Angular Signal-First)**.
