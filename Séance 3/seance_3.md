---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Séance 3 — Présentation générale d'Angular
---

<div class="h-full flex flex-col justify-center items-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
    <span class="w-2 h-2 rounded-full bg-red-500"></span>
    Programmation Orientée Objet · EAFC
  </div>

  <h1 class="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-red-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
    Séance 3 — Présentation générale d'Angular
  </h1>

  <p class="text-lg opacity-80 max-w-xl mx-auto mb-6 font-medium">
    Single Page Applications · Structure d'un projet · Premier composant
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono opacity-60">
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Angular 21+</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Standalone</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Signal-first</span>
  </div>
</div>

---
layout: default
---

# 🎯 Objectifs pédagogiques

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Le modèle SPA</h3>
      <p class="text-xs opacity-75">Comprendre le modèle SPA et ses avantages</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Architecture Angular CLI</h3>
      <p class="text-xs opacity-75">Décrypter la structure d'un projet Angular CLI</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Composants Standalone</h3>
      <p class="text-xs opacity-75">Identifier les éléments d'un composant standalone</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Pratique & Déploiement</h3>
      <p class="text-xs opacity-75">Cloner, installer et lancer une application Angular localement</p>
    </div>
  </div>
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
  PARTIE 01
</div>

# Du modèle classique au modèle SPA

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Comprendre l'évolution du web : de la recharge de page complète à la manipulation dynamique du DOM.
</p>

---

# Applications web traditionnelles

- Chaque interaction déclenche une requête au serveur
- Le serveur renvoie une page HTML **complète**
- Le navigateur **recharge** l'intégralité de la page

<div class="my-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
  <strong>Conséquences</strong> : latence élevée, bande passante consommée, expérience discontinue
</div>

<div class="mt-4 flex justify-center">
  <img class="rounded-lg shadow max-h-56 object-contain" src="https://yard.onl/sitelycee/cours/php/lib/NouvelElement3.png"/>
</div>

---

# Définition d'une SPA

<div class="grid grid-cols-2 gap-4 items-center mt-4">
<div>

**Single Page Application** = application monopage

- Une **seule** page HTML chargée initialement
- Toutes les navigations se font par **manipulation du DOM** via JavaScript
- Le serveur fournit des **données** (JSON), pas du HTML

</div>
<div class="flex justify-center">
<img class="rounded-lg shadow max-h-64 object-contain" style="width: 450px;" src="https://media.geeksforgeeks.org/wp-content/uploads/20240726124329/Architechture-Of-SPA.webp" alt="Architecture SPA" />
</div>
</div>

<!--
MPA (multipage = architecture de base, présentée juste avant)
-->

---

# DOM

<div class="grid grid-cols-2 gap-4 items-center mt-4">
<div>

Le DOM (Document Object Model) est l'interprétation vivante et modifiable du code HTML par le navigateur.

* Le code HTML n'est qu'un texte brut sur un fichier.

* Le DOM est la structure de données dynamique créée en mémoire par le navigateur à partir de ce texte.

</div>
<div class="flex justify-center">
<img class="rounded-lg shadow max-h-60 object-contain" style="width: 450px;" src="https://upload.wikimedia.org/wikipedia/commons/5/5a/DOM-model.svg" alt="DOM model" />
</div>
</div>  

---

# Avantages du modèle SPA

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">⚡</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Fluidité</h3>
      <p class="text-xs opacity-75">Pas de rechargement complet, allure native</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">🌐</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Charge serveur</h3>
      <p class="text-xs opacity-75">Échanges limités aux données strictement nécessaires</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">🔌</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Séparation</h3>
      <p class="text-xs opacity-75">Front-end et back-end indépendants, contrat API</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">💾</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Cache</h3>
      <p class="text-xs opacity-75">Ressources statiques mises en cache efficacement</p>
    </div>
  </div>
</div>

---

# Inconvénients et contraintes

<div class="grid grid-cols-3 gap-3.5 mt-5">
  <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
      <span>⏳</span> Premier chargement
    </h3>
    <p class="text-xs opacity-80">Premier chargement lourd : tout le JavaScript doit être chargé.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
      <span>🔍</span> SEO
    </h3>
    <p class="text-xs opacity-80">Les moteurs de recherche peinent à indexer le contenu dynamique.</p>
    <div class="mt-2 text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 inline-block">
      Contournement : SSR et SSG
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
      <span>⚙️</span> Complexité client
    </h3>
    <p class="text-xs opacity-80">La logique applicative migre vers le navigateur.</p>
  </div>
</div>

<div class="mt-6 p-3.5 rounded-xl bg-gradient-to-r from-red-500/15 via-rose-500/10 to-purple-500/15 border border-red-500/30 flex items-center justify-between">
  <div>
    <span class="text-[11px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400">Solution</span>
    <h3 class="text-sm font-bold">Un framework front-end structuré</h3>
  </div>
  <span class="text-2xl">🛡️</span>
</div>

<!--
SSR (Server-Side Rendering)    
- Génération du HTML complet sur le serveur à chaque requête.
- Gain SEO : Le bot reçoit un HTML 100% lisible + métadonnées dynamiques, suivi d'une hydratation JS côté client.

SSG (Static Site Generation)
- Pré-génération des fichiers HTML au moment du build, distribués directement sur CDN.
- Gain SEO : Temps de chargement (LCP/TTFB) imbattables, parfait pour le score PageSpeed.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
  PARTIE 02
</div>

# Angular dans le paysage des frameworks

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Origines, philosophie "batteries incluses", modernité signal-first et rôle pivot de TypeScript.
</p>

---

# Qu'est-ce qu'Angular ?

<div class="grid grid-cols-3 gap-3.5 mt-4">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-center">
    <div class="text-2xl mb-1">🏢</div>
    <h3 class="font-bold text-sm mb-1">Google</h3>
    <p class="text-xs opacity-75">Développé et maintenu par <strong>Google</strong></p>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-center">
    <div class="text-2xl mb-1">🔷</div>
    <h3 class="font-bold text-sm mb-1">TypeScript</h3>
    <p class="text-xs opacity-75">Basé sur <strong>TypeScript</strong> (sur-ensemble typé de JavaScript)</p>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-center">
    <div class="text-2xl mb-1">🧩</div>
    <h3 class="font-bold text-sm mb-1">Composants</h3>
    <p class="text-xs opacity-75">Architecture <strong>composant</strong> et approche <strong>opinionated</strong></p>
  </div>
</div>

<div class="mt-4 p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
  <div class="text-xs font-bold text-red-600 dark:text-red-400 mb-1">
    <strong>Opinionated</strong> = structure et conventions imposées, solutions intégrées pour :
  </div>
  <div class="flex flex-wrap gap-2 text-xs mt-2">
    <span class="px-2.5 py-1 rounded-md bg-slate-500/10 border border-slate-500/20 font-mono">🧭 Routage</span>
    <span class="px-2.5 py-1 rounded-md bg-slate-500/10 border border-slate-500/20 font-mono">📝 Formulaires</span>
    <span class="px-2.5 py-1 rounded-md bg-slate-500/10 border border-slate-500/20 font-mono">📡 HTTP</span>
    <span class="px-2.5 py-1 rounded-md bg-slate-500/10 border border-slate-500/20 font-mono">🧪 Tests</span>
    <span class="px-2.5 py-1 rounded-md bg-slate-500/10 border border-slate-500/20 font-mono">⚡ Build</span>
  </div>
</div>

---

# Angular 21-22 : signal-first

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <h3 class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-2">⚡ Réactivité fine</h3>
    <ul class="text-xs space-y-2 opacity-85">
      <li>• Mécanisme de <strong>réactivité fine</strong> : les <em>signals</em></li>
      <li>• Détection ciblée des mises à jour, sans comparaison d'objets entiers</li>
      <li>• <strong>Unique mécanisme de réactivité</strong> enseigné dans ce cours</li>
    </ul>
    <p class="text-[11px] opacity-70 italic mt-3">*Les signals seront approfondis en séance 13.*</p>
  </div>

  <div class="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
    <h3 class="font-bold text-xs text-red-600 dark:text-red-400 mb-2">🚫 Exclusions explicites de ce cours</h3>
    <ul class="text-xs space-y-2 opacity-80">
      <li>• Pas de <code>NgModule</code> (remplacé par les composants standalone)</li>
      <li>• Pas de Reactive Forms classiques (remplacés par Signal Forms)</li>
      <li>• Pas de RxJS enseigné comme sujet autonome</li>
    </ul>
  </div>
</div>

<!--
Standalone = définit lui-même les imports, les dépendances nécessaires

Avant, les ngmodules servaient un peu d'annuaire de référencement de ce qu'ils avaient besoin.

En gros, organisation du code. 

Rxjs = programmation réactive via observable.
-->

---

# TypeScript, fondement d'Angular

- Langage présenté en **séance 2**

<div class="grid grid-cols-3 gap-3.5 mt-3">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1">🛡️ Typage statique</div>
    <p class="text-xs opacity-75">Détecter les erreurs en phase de développement.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-xs text-purple-600 dark:text-purple-400 mb-1">✨ Autocomplétion</div>
    <p class="text-xs opacity-75">Autocomplétion enrichie dans l'IDE.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">📖 Documentation</div>
    <p class="text-xs opacity-75">Documentation implicite via les types.</p>
  </div>
</div>

<div class="mt-5 p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 text-center text-sm font-semibold">
  👉 <strong>Tout le code Angular est écrit en TypeScript.</strong>
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
  PARTIE 03
</div>

# Le Angular CLI

<p class="opacity-70 text-sm max-w-lg mx-auto">
  L'outil officiel en ligne de commande : standardisation, productivité et automatisation du cycle de vie.
</p>

---

# Angular CLI

**Command Line Interface** = outil en ligne de commande qui automatise :

<div class="grid grid-cols-4 gap-3 mt-4">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-center">
    <div class="text-xl mb-1">🏗️</div>
    <h3 class="font-bold text-xs mb-1">Création</h3>
    <p class="text-[11px] opacity-70">Création du projet</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-center">
    <div class="text-xl mb-1">⚡</div>
    <h3 class="font-bold text-xs mb-1">Génération</h3>
    <p class="text-[11px] opacity-70">Composants, services, etc.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-center">
    <div class="text-xl mb-1">🚀</div>
    <h3 class="font-bold text-xs mb-1">Build</h3>
    <p class="text-[11px] opacity-70">Compilation et build</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-center">
    <div class="text-xl mb-1">🧪</div>
    <h3 class="font-bold text-xs mb-1">Déploiement</h3>
    <p class="text-[11px] opacity-70">Tests et déploiement</p>
  </div>
</div>

<div class="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <strong>Garantie</strong> : cohérence de structure entre tous les projets Angular
</div>

---

# Installation et création

**Prérequis** : Node.js + npm installés

```bash
# Installation globale du CLI
npm install -g @angular/cli

# Vérification de la version
ng version

# Création d'un projet
ng new nom-du-projet
```

<div class="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs">
  <strong>Options recommandées</strong> : CSS · SSR : non · Standalone components : oui
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
  PARTIE 04
</div>

# Structure d'un projet Angular

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Anatomie des fichiers de configuration, organisation du dossier src/ et conventions.
</p>

---

# Fichiers de configuration (racine)

<div class="grid grid-cols-2 gap-3.5 mt-4">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-red-600 dark:text-red-400 mb-1">angular.json</div>
    <p class="text-xs opacity-80">Configuration du CLI (build, chemins, options)</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">tsconfig.json</div>
    <p class="text-xs opacity-80">Configuration du compilateur TypeScript</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">package.json</div>
    <p class="text-xs opacity-80">Dépendances du projet et scripts</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">package-lock.json</div>
    <p class="text-xs opacity-80">Verrouillage des versions exactes</p>
  </div>
</div>

---

# Le dossier `src/`

Cœur du projet — contient tout le code source

```
src/
├── main.ts           # Point d'entrée
├── index.html        # Page HTML unique de la SPA
├── styles.css        # Styles globaux
└── app/              # Logique applicative
    ├── app.component.ts
    ├── app.component.html
    ├── app.component.css
    ├── app.config.ts
    └── app.routes.ts
```

---

# `src/main.ts`

Point d'entrée de l'application :

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

<div class="grid grid-cols-2 gap-3 mt-3 text-xs">
  <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
    • Monte le <strong>composant racine</strong> dans le navigateur
  </div>
  <div class="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
    • Applique la <strong>configuration</strong> de l'application
  </div>
</div>

---

# `src/index.html`

Page HTML unique — contient la balise racine :

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>MonProjet</title>
  <base href="/">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

<div class="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
  <strong><code>&lt;app-root&gt;</code></strong> = point d'ancrage où Angular injecte le premier composant
</div>

---

# Le dossier `src/app/`

<div class="grid grid-cols-1 gap-2 mt-3 text-xs">
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center justify-between">
    <code class="font-bold text-blue-600 dark:text-blue-400">app.component.ts</code>
    <span class="opacity-80">Composant racine (classe + décorateur)</span>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center justify-between">
    <code class="font-bold text-amber-600 dark:text-amber-400">app.component.html</code>
    <span class="opacity-80">Template HTML du composant racine</span>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center justify-between">
    <code class="font-bold text-purple-600 dark:text-purple-400">app.component.css</code>
    <span class="opacity-80">Styles encapsulés du composant racine</span>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center justify-between">
    <code class="font-bold text-emerald-600 dark:text-emerald-400">app.config.ts</code>
    <span class="opacity-80">Configuration (fournisseurs, services globaux)</span>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center justify-between">
    <code class="font-bold text-rose-600 dark:text-rose-400">app.routes.ts</code>
    <span class="opacity-80">Définition des routes de navigation</span>
  </div>
</div>

---

# Dossiers à ne pas versionner

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
    <h3 class="font-mono font-bold text-sm text-red-600 dark:text-red-400 mb-2">node_modules/</h3>
    <p class="text-xs opacity-80 mb-2">Dépendances téléchargées par <code>npm</code></p>
    <ul class="text-xs space-y-1 opacity-80">
      <li>• <em>Jamais</em> versionné dans Git</li>
      <li>• Reconstitué via <code>npm install</code> à partir de <code>package.json</code></li>
    </ul>
  </div>

  <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-mono font-bold text-sm text-amber-600 dark:text-amber-400 mb-2">.angular/</h3>
    <p class="text-xs opacity-80">Cache du CLI pour accélérer les builds</p>
  </div>
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
  PARTIE 05
</div>

# Anatomie d'un composant standalone

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Les 3 piliers, le décorateur @Component, l'interpolation et le cycle de vie du rendu.
</p>

---

# Les trois piliers d'un composant

<div class="grid grid-cols-3 gap-3.5 mt-5">
  <div class="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
    <div class="text-3xl mb-1">🧠</div>
    <h3 class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">1. Classe TypeScript</h3>
    <div class="text-[11px] opacity-70 mb-2">Le « cerveau » du composant</div>
    <ul class="text-xs text-left space-y-1 opacity-80">
      <li>• Données (propriétés)</li>
      <li>• Comportement (méthodes)</li>
    </ul>
  </div>

  <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
    <div class="text-3xl mb-1">👁️</div>
    <h3 class="font-bold text-sm text-amber-600 dark:text-amber-400 mb-1">2. Template HTML</h3>
    <div class="text-[11px] opacity-70 mb-2">Structure visuelle et rendu</div>
    <ul class="text-xs text-left space-y-1 opacity-80">
      <li>• Structure visuelle</li>
      <li>• Référence les propriétés de la classe</li>
    </ul>
  </div>

  <div class="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
    <div class="text-3xl mb-1">🎨</div>
    <h3 class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1">3. Styles CSS</h3>
    <div class="text-[11px] opacity-70 mb-2">Apparence du composant</div>
    <ul class="text-xs text-left space-y-1 opacity-80">
      <li>• Encapsulés</li>
      <li>• Pas d'effet de bord sur les autres composants</li>
    </ul>
  </div>
</div>

---

# Le décorateur `@Component`

Annotation placée au-dessus de la classe :

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  template: `<h1>Bonjour, {{ nom }} !</h1>`,
  styles: [`h1 { color: #1976d2; }`]
})
export class HelloComponent {
  nom = 'Monde';
}
```

---

# Propriétés du décorateur

<div class="grid grid-cols-2 gap-3.5 mt-3">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-red-600 dark:text-red-400 mb-1">selector</div>
    <p class="text-xs opacity-80">Balise HTML personnalisée (<code>&lt;app-hello&gt;</code>)</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">standalone: true</div>
    <p class="text-xs opacity-80">Composant autonome, sans module</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">template / templateUrl</div>
    <p class="text-xs opacity-80">HTML inline ou fichier externe</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">styles / styleUrl</div>
    <p class="text-xs opacity-80">CSS inline ou fichier externe</p>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
  📌 <strong>Convention</strong> : préfixe <code>app-</code> pour les sélecteurs personnalisés
</div>

---

# Interpolation

Syntaxe `{{ expression }}` dans le template :

```typescript
export class HelloComponent {
  nom = 'Monde';
}
```

```html
<h1>Bonjour, {{ nom }} !</h1>
```

**Résultat** : `<h1>Bonjour, Monde !</h1>`

Le template communique avec la classe de manière déclarative.

---

# En synthèse : les 3 types de liaisons de données

<div class="grid grid-cols-3 gap-3.5 mt-4">
  <div class="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
    <div class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">
      &#123;&#123; expression &#125;&#125;
    </div>
    <h3 class="font-bold text-xs mb-1">Interpolation</h3>
    <div class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold inline-block mb-2">Classe ➔ Vue (Texte)</div>
    <p class="text-[11px] opacity-80">Affiche une chaîne de caractères ou le résultat d'une expression.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
    <div class="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 mb-1">
      [propriété]="valeur"
    </div>
    <h3 class="font-bold text-xs mb-1">Property Binding</h3>
    <div class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold inline-block mb-2">Classe ➔ Vue (DOM)</div>
    <p class="text-[11px] opacity-80">Assigne dynamiquement une propriété d'un élément HTML.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
    <div class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
      (événement)="action()"
    </div>
    <h3 class="font-bold text-xs mb-1">Event Binding</h3>
    <div class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold inline-block mb-2">Vue ➔ Classe (Action)</div>
    <p class="text-[11px] opacity-80">Capte un événement utilisateur (clic, saisie, frappe clavier).</p>
  </div>
</div>

---

# Aperçu : Le nouveau Control Flow natif

Angular intègre une syntaxe déclarative moderne (remplace `*ngIf` et `*ngFor`) :

```html
<!-- Conditionnel -->
@if (estConnecte) {
  <p>Bienvenue sur votre profil !</p>
} @else {
  <button>Se connecter</button>
}

<!-- Boucle itérative -->
<ul>
  @for (cours of coursList; track cours.id) {
    <li>{{ cours.titre }}</li>
  }
</ul>
```

<div class="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
  💡 Plus lisible, nativement typé et utilisable sans aucun import supplémentaire dans le template.
</div>

---

# Le composant racine `AppComponent`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mon-projet-angular';
}
```

<div class="grid grid-cols-3 gap-2.5 mt-3 text-xs">
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    • Premier composant instancié au démarrage
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    • Son sélecteur <code>&lt;app-root&gt;</code> est dans <code>index.html</code>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    • Tous les autres composants en descendent
  </div>
</div>

---

# Cycle de vie d'une requête SPA

<div class="grid grid-cols-1 gap-2 mt-4 text-xs">
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center gap-3">
    <span class="w-5 h-5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">1</span>
    <span>Navigateur demande l'URL au serveur</span>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center gap-3">
    <span class="w-5 h-5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">2</span>
    <span>Serveur renvoie <code>index.html</code> minimal + balise <code>&lt;app-root&gt;</code></span>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center gap-3">
    <span class="w-5 h-5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">3</span>
    <span>Navigateur charge les scripts JavaScript compilés</span>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center gap-3">
    <span class="w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">4</span>
    <span><code>main.ts</code> démarre → <code>bootstrapApplication(AppComponent)</code></span>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center gap-3">
    <span class="w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">5</span>
    <span>Angular compile le template de <code>AppComponent</code></span>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15 flex items-center gap-3">
    <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">6</span>
    <span>DOM généré inséré à l'emplacement de <code>&lt;app-root&gt;</code></span>
  </div>
  <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 font-semibold text-emerald-700 dark:text-emerald-300">
    <span class="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">7</span>
    <span>Toute navigation ultérieure se gère <strong>côté client</strong></span>
  </div>
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
  PARTIE 06
</div>

# Démonstration Angular

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Prise en main guidée pas à pas : installation, exploration des fichiers, serveur local et première modification.
</p>

---

# Étape 1 — Récupération du projet

```bash
git pull
```

*Rappel séance 1 : `git pull` récupère les changements apportés sur le serveur distant*

---

# Étape 2 — Installation des dépendances

```bash
npm install
```

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    • Lit <code>package.json</code><br>
    • Télécharge les bibliothèques dans <code>node_modules/</code>
  </div>
  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold flex items-center">
    ⚠️ <strong>Ne jamais versionner</strong> ce dossier
  </div>
</div>

---

# Étape 3 — Exploration guidée

<div class="space-y-2 mt-4 text-xs">
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <strong>Racine</strong> : <code>angular.json</code>, <code>package.json</code>, <code>tsconfig.json</code>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <strong><code>src/index.html</code></strong> : balise <code>&lt;app-root&gt;&lt;/app-root&gt;</code>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <strong><code>src/main.ts</code></strong> : <code>bootstrapApplication(AppComponent, appConfig)</code>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <strong><code>src/app/app.component.ts</code></strong> : décorateur <code>@Component</code>, sélecteur <code>app-root</code>
  </div>
  <div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <strong><code>src/app/app.component.html</code></strong> : interpolation <code>&#123;&#123; title &#125;&#125;</code>
  </div>
</div>

---

# Étape 4 — Lancement

```bash
ng serve
```

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 space-y-1">
    <div>• Compilation + serveur de développement local</div>
    <div>• Surveillance des fichiers sources</div>
    <div>• Recompilation automatique à chaque sauvegarde</div>
  </div>
  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col justify-center">
    <div class="text-[11px] opacity-70">Adresse par défaut :</div>
    <div class="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">http://localhost:4200</div>
  </div>
</div>

---

# Étape 5 — Première modification

Dans `app.component.ts` :

```typescript
title = 'Ma première application Angular';
```

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong>Observation</strong> : le navigateur se met à jour instantanément, sans rechargement de page.
  </div>
  <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong>Illustration concrète</strong> du lien classe ↔ template ↔ rendu.
  </div>
</div>

---

# Étape 6 — Arrêt propre

```bash
Ctrl+C
```

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    • <code>ng serve</code> = développement local uniquement
  </div>
  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
    • Production : <code>ng build</code> → fichiers optimisés dans <code>dist/</code>
  </div>
</div>

---
layout: default
---

# 📌 Récapitulatif

<div class="grid grid-cols-2 gap-3.5 mt-5">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-red-600 dark:text-red-400">SPA :</strong>
    <p class="opacity-75 mt-0.5">Une seule page, manipulation DOM côté client.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-rose-600 dark:text-rose-400">Angular :</strong>
    <p class="opacity-75 mt-0.5">Framework opinionated, TypeScript, signal-first.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-purple-600 dark:text-purple-400">CLI :</strong>
    <p class="opacity-75 mt-0.5"><code>ng new</code>, <code>ng serve</code>, <code>ng build</code>.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-blue-600 dark:text-blue-400">Structure :</strong>
    <p class="opacity-75 mt-0.5"><code>main.ts</code> → <code>AppComponent</code> → <code>index.html</code> (<code>&lt;app-root&gt;</code>).</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-emerald-600 dark:text-emerald-400">Composant :</strong>
    <p class="opacity-75 mt-0.5">Classe + template + styles encapsulés.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-amber-600 dark:text-amber-400">Décorateur @Component :</strong>
    <p class="opacity-75 mt-0.5">Avec <code>selector</code>, <code>standalone</code>, <code>template</code>, <code>styles</code>.</p>
  </div>
</div>

---

# 🔜 Séance suivante

**Séance 4 — Rappel HTML/CSS et introduction à Bootstrap**

<div class="grid grid-cols-3 gap-3.5 mt-6 text-xs">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold mb-1">📐 HTML & CSS</div>
    <p class="opacity-75">Structure HTML, flexbox, classes CSS</p>
  </div>
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold mb-1">🎨 Bootstrap</div>
    <p class="opacity-75">Grille, boutons, cartes, formulaires</p>
  </div>
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold mb-1">🧩 Angular</div>
    <p class="opacity-75">Mise en page d'un gabarit dans Angular</p>
  </div>
</div>
