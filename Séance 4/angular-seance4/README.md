# Séance 4 — HTML/CSS, Le DOM & Introduction à Bootstrap 5

Application web interactive Angular (+v22) servant de support pédagogique et de banc d'entraînement visuel pour le cours de **Programmation Orientée Objet & Web** (Bachelier en informatique — EAFC Colfontaine).

---

## 🎯 Objectifs Pédagogiques

1. **Le DOM comme arbre d'objets (Lien avec la POO)** : Comprendre que le HTML n'est qu'un texte sérialisé converti en mémoire vive en instances d'objets JavaScript (`EventTarget` ➔ `Node` ➔ `Element` ➔ `HTMLElement` ➔ `HTMLButtonElement`).
2. **Structure Sémantique & Attributs Universels** : Structurer une page avec les balises HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) et appréhender l'unicité de `id` face à la réutilisabilité et au cumul de `class`.
3. **Cascade CSS & Calculateur de Spécificité** : Maîtriser l'algorithme d'arbitrage des règles conflictuelles (Style en ligne 1000 pts, ID 100 pts, Classe 10 pts, Balise 1 pt).
4. **Le Modèle de Boîte (*Box Model*) & `box-sizing`** : Visualiser les 4 couches concentriques (Content, Padding, Border, Margin) et constater la supériorité de `box-sizing: border-box` généralisé par le Reboot de Bootstrap.
5. **Flexbox — Disposition Unidimensionnelle** : Aligner et distribuer les éléments le long de l'axe principal (`justify-content`) et de l'axe secondaire (`align-items`) avec espacement `gap`.
6. **Système de Grille Bootstrap (12 Colonnes & Breakpoints)** : Simuler le responsive design avec les 6 breakpoints (`col-`, `col-sm-`, `col-md-`, `col-lg-`, `col-xl-`, `col-xxl-`) et maîtriser la formule classique `col-12 col-md-6 col-lg-4`.
7. **Composants Clés & Classes Utilitaires** : Utiliser les boutons, formulaires, cartes avec alignement `.h-100` et décoder la syntaxe compacte d'espacement `{m|p}{t|b|s|e|x|y}-{0..5|auto}`.
8. **Intégration dans Angular** : Installer Bootstrap via npm, le déclarer dans `angular.json` et concevoir un composant standalone avec signaux et `@for`.

---

## 🛠️ Stack Technique

* **Framework** : Angular v22 (100% Standalone Components, Signals, nouveau control flow natif `@if`, `@for`, `@switch`).
* **Design & Styles** : SCSS avec variables CSS dynamiques, Thème Sombre & Thème Clair, typographies *Inter* et *Fira Code*.
* **Éditeur de Code** : Monaco Editor intégré (HTML & CSS) avec colorisation syntaxique et bascule dynamique de thème.
* **Sandbox & Prévisualisation** : `<iframe sandbox="allow-scripts">` avec injection temps réel du CDN Bootstrap 5.3.3.
* **Moteur d'Évaluation DOM** : Vérification automatique via `contentDocument.querySelector`, `classList` et `getComputedStyle`, complété par des célébrations confetti (`canvas-confetti`).

---

## 🚀 Démarrage Rapide

```bash
# Se placer dans le répertoire du projet
cd "/home/cchiodo/Téléchargements/To_improve/angular-seance4"

# Lancer le serveur de développement Angular
npm start
```

L'application est accessible à l'adresse : **`http://localhost:4200`**

---

## 📚 Les 22 Exercices Pratiques

* **Labo 1 — Structure Sémantique & DOM (4 exercices)** :
  * Ex 1.1 : Squelette sémantique HTML5 (`<header>`, `<main>`, `<footer>`)
  * Ex 1.2 : Navigation sémantique (`<nav>`, `<ul>`, `<li>`, `<a>`)
  * Ex 1.3 : Blocs vs En-ligne (`display: block` et `display: inline`)
  * Ex 1.4 : Attributs universels (`id="presentation"` et `class="texte-bleu important"`)
* **Labo 2 — Sélecteurs CSS, Spécificité & Box Model (4 exercices)** :
  * Ex 2.1 : Sélecteur de classe (`.carte`)
  * Ex 2.2 : Résolution de conflit par spécificité
  * Ex 2.3 : Modèle de boîte (`padding: 16px`, `border`, `margin-bottom: 24px`)
  * Ex 2.4 : Adoption de `box-sizing: border-box` pour éviter l'empilement
* **Labo 3 — Flexbox en Pratique (4 exercices)** :
  * Ex 3.1 : Activation et direction horizontale avec `gap: 12px`
  * Ex 3.2 : Distribution horizontale avec `justify-content: space-between`
  * Ex 3.3 : Centrage absolu sur les deux axes
  * Ex 3.4 : Empilement vertical avec `flex-direction: column`
* **Labo 4 — Grille Responsive Bootstrap (5 exercices)** :
  * Ex 4.1 : Grille 2 colonnes égales (`.container` > `.row` > `.col-6`)
  * Ex 4.2 : Grille asymétrique (`.col-3` et `.col-9`)
  * Ex 4.3 : Grille responsive Mobile-First (`.col-12 col-md-6 col-lg-4`)
  * Ex 4.4 : Gestion de la gouttière (`.g-3`)
  * Ex 4.5 : Réinitialisation automatique au-delà de 12 colonnes
* **Labo 5 — Composants & Utilitaires Bootstrap (5 exercices)** :
  * Ex 5.1 : Boutons thématiques plein et contour (`.btn-primary`, `.btn-outline-warning`)
  * Ex 5.2 : Carte structurée (`.card`, `.card-body`, `.shadow-sm`)
  * Ex 5.3 : Alignement des hauteurs avec `.h-100`
  * Ex 5.4 : Formulaire propre (`.form-label`, `.form-control`, `.mb-3`)
  * Ex 5.5 : Centrage et espacement utilitaires (`.mx-auto`, `.p-4`)
