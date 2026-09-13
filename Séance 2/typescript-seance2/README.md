# 📘 TypeScript Lab — Séance 2 : Fondamentaux du langage TypeScript

Application web interactive Angular moderne servant de **support pédagogique officiel** et de **banc d'entraînement intensif** pour le cours :
**Séance 2 — Fondamentaux du langage TypeScript (Initiation & Découverte de la syntaxe)**.

Destinée aux étudiants qui découvrent TypeScript pour la première fois, l'application démystifie le typage statique, illustre visuellement la transpilation (*Type Erasure*), et propose **27 micro-exercices courts et progressifs** intégrés dans **Monaco Editor** avec validation automatique en temps réel.

---

## 🎯 Objectifs Pédagogiques

1. **Démystifier TypeScript** : Comprendre qu'il s'agit d'un sur-ensemble de JavaScript agissant comme un outil de développement et de détection d'erreurs, totalement effacé à la compilation.
2. **Visualiser la Transpilation (Type Erasure)** : Observer en direct le JavaScript généré et constater que les types n'ajoutent aucun surcoût d'exécution dans le navigateur.
3. **Maîtriser l'Environnement CLI** : Savoir installer le compilateur `tsc`, comprendre le flux `tsc` + `node`, et utiliser le raccourci `ts-node`.
4. **Appliquer la Rigueur du Mode Strict** : Découvrir pourquoi `"strict": true` est activé dans `tsconfig.json` pour bannir les types `any` implicites.
5. **Manipuler les Types de Base & l'Inférence** : Connaître les 5 types primitifs (`number`, `string`, `boolean`, `null`, `undefined`), utiliser les unions `|` et comprendre pourquoi `unknown` est plus sûr que `any`.
6. **Contrôler la Portée & la Mutabilité** : Différencier la portée de bloc (`let`/`const`) de la fuite de `var`, comprendre que `const` fige la référence et non le contenu, et éviter la Temporal Dead Zone (TDZ).
7. **Adopter les Opérateurs Modernes** : Imposer l'égalité stricte `===`, itérer avec `for...of`, et sécuriser les accès avec le chaînage optionnel `?.` et le nullish coalescing `??`.
8. **Structurer Fonctions, Tableaux & Objets** : Déclarer des fonctions typées (classiques et fléchées), des tuples `[number, number]`, des interfaces et expérimenter le typage structurel (*Duck Typing*).

---

## 🚀 Démarrage Rapide

### Prérequis
* **Node.js** : version `20.x` ou supérieure.
* **npm** : version `10.x` ou supérieure.

### Installation & Lancement

1. **Se placer dans le répertoire du projet** :
   ```bash
   cd /home/cchiodo/.gemini/antigravity/scratch/angular-seance3-demo
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm start
   # ou directement :
   npx ng serve
   ```

4. **Accéder à l'application** :
   Ouvrez votre navigateur web sur [http://localhost:4200](http://localhost:4200).
   L'application dispose du rafraîchissement à chaud (*Hot Module Replacement / Live Reload*).

5. **Compiler pour la production** :
   ```bash
   npm run build
   ```

---

## 🧩 Architecture des 8 Modules Fondamentaux

| N° | Section | Fonctionnalités & Démonstrateurs Interactifs |
|---|---|---|
| **1** | **Pourquoi TypeScript ? & Transpilation** | **Split-screen en temps réel** (TS à gauche, JS transpilé à droite). Démonstrateur d'effacement de type (*Type Erasure*) où types et interfaces disparaissent instantanément. Comparateur Statique vs Dynamique montrant le piège de l'addition `10 + "5"`. |
| **2** | **Environnement & Outillage** | **Simulateur de terminal CLI interactif** en 3 étapes (`npm install` & `tsc --version`, flux standard `tsc` + `node`, et raccourci `ts-node`). **Inspecteur de `tsconfig.json`** avec focus pédagogique sur `"strict": true`. |
| **3** | **Types Primitifs, Inférence & Conversions** | Cartes mémo interactives des 5 primitifs. **Playground de l'Inférence de Type** (`let score = 10`). Comparatif de sécurité `any` (danger) vs `unknown` (avec `typeof`), unions `number \| string` et types littéraux. **Inclus : Labo 1 (5 exercices)**. |
| **4** | **Variables, Portée (Scope) & Mutabilité** | Visualiseur de portée opposant la fuite de `var` au confinement strict de `let`/`const` dans `{ }`. Démonstrateur du piège de la mutabilité avec `const` (référence figée vs modification de tableau `.push()`). Chronologie interactive de la **Temporal Dead Zone (TDZ)**. **Inclus : Labo 2 (4 exercices)**. |
| **5** | **Contrôle de Flux & Opérateurs Modernes** | Matrice interactive des pièges du double égal `==` (`0 == ""`, `false == "0"`). Parcours `for...of` (valeurs) vs `for...in` (clés/indices). Laboratoire `?.` (Optional Chaining) et comparaison entre `\|\|` et `??` quand la valeur vaut `0`. **Inclus : Labo 3 (4 exercices)**. |
| **6** | **Fonctions & Paramètres** | Anatomie visuelle décomposée d'une fonction typée. Comparatif syntaxique et contexte `this` (Fonctions classiques vs Arrow functions). Bac à sable des paramètres optionnels `?`, par défaut `=` et rest `...elements`. **Inclus : Labo 4 (5 exercices)**. |
| **7** | **Tableaux & Tuples** | Tableaux typés `number[]` vs `Array<number>`. Visualiseur de **Tuples** ordonnés à taille fixe (`[number, number]`). Playground interactif avec animations étape par étape sur `map`, `filter`, `find` et `reduce`. Déstructuration et opérateur `...` (spread). **Inclus : Labo 5 (4 exercices)**. |
| **8** | **Objets, Interfaces & Duck Typing** | Déclaration d'interfaces d'objets, modificateurs `readonly` et `?`. **Démonstrateur de typage structurel (*Duck Typing*)** prouvant qu'un objet avec des propriétés supplémentaires est accepté s'il satisfait le contrat minimal. Signatures d'index dynamiques `[joueur: string]: number`. **Inclus : Labo 6 (5 exercices)**. |

---

## 🧪 Espace Ateliers Pratiques : Les 27 Micro-Exercices

L'application inclut **27 micro-exercices progressifs** répartis dans les 6 ateliers du cours :

### Labo 1 — Types de base & Inférence (5 exercices)
* **Ex 1.1 — Typage explicite** : Déclarer une variable `note: number = 15.5;`.
* **Ex 1.2 — Inférence et correction** : Autoriser deux types via une union `let texte: string | number = "hello";`.
* **Ex 1.3 — Le type `unknown` et `typeof`** : Protéger une conversion `x.toUpperCase()` avec un type guard `typeof`.
* **Ex 1.4 — Type littéral** : Définir un alias `type Role = "admin" | "visiteur"` et assigner une valeur valide.
* **Ex 1.5 — Assertion de type (`as`)** : Forcer la lecture de `.length` avec `(donnee as string).length`.

### Labo 2 — Variables, Portée & TDZ (4 exercices)
* **Ex 2.1 — Portée de bloc** : Remplacer `var` par `let` dans une boucle pour confiner la variable.
* **Ex 2.2 — Mutabilité `const`** : Déclarer `const couleurs = ["rouge"]` et ajouter `"bleu"` avec `.push()`.
* **Ex 2.3 — Éviter la réassignation** : Vider un tableau `const` proprement avec `panier.length = 0;`.
* **Ex 2.4 — Temporal Dead Zone** : Réordonner le code pour déclarer `let remise` avant son affichage.

### Labo 3 — Contrôle de Flux & Opérateurs (4 exercices)
* **Ex 3.1 — Égalité stricte** : Comparer avec `valeur === 10`.
* **Ex 3.2 — Boucle `for...of`** : Parcourir un tableau de mots avec `for...of` et compter les mots débutant par "A".
* **Ex 3.3 — Optional Chaining (`?.`)** : Sécuriser la lecture `client?.adresse?.ville ?? "Non renseignée"`.
* **Ex 3.4 — Nullish Coalescing (`??`)** : Conserver le score `0` grâce à `score ?? 10`.

### Labo 4 — Fonctions & Paramètres (5 exercices)
* **Ex 4.1 — Fonction fléchée simple** : Déclarer `const estPair = (n: number): boolean => n % 2 === 0;`.
* **Ex 4.2 — Paramètre optionnel** : Gérer un titre optionnel `saluer(prenom: string, titre?: string)`.
* **Ex 4.3 — Valeur par défaut** : Déclarer `calculerTTC(prixHT: number, taux: number = 0.20): number`.
* **Ex 4.4 — Rest parameters (`...`)** : Écrire `sommer(...nombres: number[]): number` avec `.reduce()`.
* **Ex 4.5 — Typage d'un callback** : Définir `type Filtre = (n: number) => boolean;` et l'utiliser dans `filtrer`.

### Labo 5 — Tableaux & Tuples (4 exercices)
* **Ex 5.1 — Déclaration de Tuple** : Déclarer `let coordonnees: [number, number] = [48.8566, 2.3522];`.
* **Ex 5.2 — Transformation avec `.map()`** : Multiplier chaque élément par 2 avec `liste.map(n => n * 2)`.
* **Ex 5.3 — Filtrage avec `.filter()`** : Ne retenir que les notes `>= 10` avec `notes.filter(n => n >= 10)`.
* **Ex 5.4 — Déstructuration de tableau** : Extraire `const [premier, second] = podium;`.

### Labo 6 — Objets, Interfaces & Duck Typing (5 exercices)
* **Ex 6.1 — Première Interface** : Déclarer `interface Etudiant { nom: string; age: number; }` et un objet conforme.
* **Ex 6.2 — Propriété optionnelle** : Ajouter `email?: string` et créer un objet valide sans email.
* **Ex 6.3 — Propriété `readonly`** : Déclarer `readonly isbn: string` et vérifier l'interdiction de réassignation.
* **Ex 6.4 — Typage structurel** : Passer un objet de 3 propriétés à une fonction n'en attendant que 2.
* **Ex 6.5 — Signature d'index** : Déclarer `interface Scores { [joueur: string]: number; }` et stocker des scores.

---

## ⚙️ Spécifications Techniques

* **Framework** : Angular v22.1 (100% Standalone Components, zero NgModule).
* **Gestion d'État** : Angular Signals (`signal`, `computed`, `effect`).
* **Moteur d'Édition** : Monaco Editor (moteur de VS Code) chargé localement avec coloration syntaxique et autocomplétion TypeScript.
* **Transpilation & Sandbox** : Transpilation instantanée en mémoire et exécution isolée avec capture complète des sorties `console.log`, `console.warn` et `console.error` dans un terminal virtuel.
* **Persistance** : Sauvegarde automatique de la progression des étudiants dans le `localStorage` du navigateur.
* **Thèmes** : Mode Sombre (*Dark*) et Mode Clair (*Light*) synchronisés avec Monaco Editor.
* **Exécution** : 100% côté client, aucune API ou backend requis.
