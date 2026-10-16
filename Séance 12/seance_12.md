---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "Séance 12 — Les Objets eux-mêmes : Identité, Comparaison & Clonage"
info: |
  ## Séance 12 — Les Objets eux-mêmes : Identité, Comparaison & Clonage
  Cours de programmation orientée objet — Bachelier en informatique (EAFC).
  Stack technique : TypeScript 5+, Angular 22 (approche signal-first).
---

<style>
.slidev-code, .slidev-code pre { font-size: 0.72rem !important; line-height: 1.3 !important; }
.slidev-code pre { padding: 0.45rem 0.65rem !important; }
</style>

<div class="h-full flex flex-col justify-center items-center">
  <div class="inline-flex items-center gap-2 px-3.5 py-1 mb-4 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700">
    <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
    Programmation Orientée Objet · EAFC
  </div>

  <h1 class="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
    Séance 12 — Les Objets eux-mêmes
  </h1>

  <p class="text-base text-slate-800 dark:text-slate-100 max-w-2xl mx-auto mb-5 font-semibold">
    Identité vs Valeur · Méthode <code>equals()</code> · Shallow vs Deep Copy · Immutabilité · Réactivité Angular Signals
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono font-bold">
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">TypeScript 5+</span>
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Angular 22</span>
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Signal-First</span>
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Fin Bloc B</span>
  </div>
</div>

<!--
Bienvenue à la séance 12 du cours de Programmation Orientée Objet !
Cette séance vient clôturer notre Bloc B consacré à la conception, la qualité et la manipulation des objets.
Après avoir appris à structurer des classes, hériter, composer, gérer les exceptions et appliquer les principes SOLID,
nous allons aujourd'hui observer l'objet sous le microscope : que se passe-t-il réellement dans la mémoire de l'ordinateur ?
Pourquoi deux objets avec exactement les mêmes données ne sont-ils pas égaux ?
Comment dupliquer un objet sans tout casser ?
Et pourquoi cette question est-elle vitale pour la réactivité des signaux dans Angular ?
-->

---
layout: default
---

## 🎯 Objectifs pédagogiques de la séance

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-2 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Identité vs Valeur</h4>
      <p class="opacity-75">Comprendre le modèle mémoire (Pile vs Tas), les adresses de référence et pourquoi <code>{ a: 1 } !== { a: 1 }</code>.</p>
    </div>
  </div>

  <div class="p-2 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">La méthode <code>equals()</code></h4>
      <p class="opacity-75">Implémenter une véritable égalité métier sur vos classes en respectant réflexivité, symétrie et typage strict.</p>
    </div>
  </div>

  <div class="p-2 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Clonage : Shallow vs Deep Copy</h4>
      <p class="opacity-75">Distinguer la copie superficielle (<code>{...obj}</code>) de la copie profonde récursive (<code>structuredClone()</code>).</p>
    </div>
  </div>

  <div class="p-2 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">L'Immutabilité en pratique</h4>
      <p class="opacity-75">Allier <code>readonly</code> (temps de compilation) et <code>Object.freeze()</code> (runtime) pour bâtir des <em>Value Objects</em> indestructibles.</p>
    </div>
  </div>

  <div class="col-span-2 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs flex-shrink-0">05</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Réactivité Angular & Signals</h4>
      <p class="opacity-75">Comprendre pourquoi un <code>signal()</code> ignore les mutations en place et exige impérativement une nouvelle référence pour rafraîchir l'interface.</p>
    </div>
  </div>
</div>

<!--
Présentez ces 5 objectifs aux étudiants.
Insistez sur le fait que la manipulation des objets par référence est la cause numéro 1 d'incompréhension chez les débutants.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 00
</div>

# Le Cheminement : D'où venons-nous ?
## La dernière pierre du Bloc B

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Pourquoi comprendre la vie intime des objets en mémoire est indispensable avant de plonger dans le développement Angular avancé.
</p>

<!--
Replacer la séance dans l'ensemble du cursus : nous terminons le Bloc B.
-->

---
layout: default
---

# La progression du cursus POO

<div class="grid grid-cols-12 gap-2 mt-2 text-xs">
  <div class="col-span-4 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-blue-500 mb-1">BLOC A (S5 à S9)</div>
    <h3 class="font-bold mb-1">Fondamentaux POO</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Encapsulation & visibilité (S5)</li>
      <li>Héritage & réutilisation (S6)</li>
      <li>Polymorphisme dynamique (S7)</li>
      <li>Classes abstraites & interfaces (S8)</li>
      <li>Composition vs héritage (S9)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-center text-[10px]">
      Architecture & Relations
    </div>
  </div>

  <div class="col-span-4 p-2.5 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/30">
    <div class="font-mono font-bold text-indigo-500 mb-1">BLOC B (S10 à S12)</div>
    <h3 class="font-bold mb-1">Qualité & Maîtrise des Objets</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Gestion des exceptions typées (S10)</li>
      <li>Principes SOLID : S, O, D (S11)</li>
      <li><strong>Aujourd'hui : Identité, Clonage & Immutabilité (S12)</strong></li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-center text-[10px]">
      Intégrité & Comportement en mémoire
    </div>
  </div>

  <div class="col-span-4 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-emerald-500 mb-1">BLOC C (S13 à S15)</div>
    <h3 class="font-bold mb-1">Angular Signal-First</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Composants & réactivité fine (S13)</li>
      <li>Services, génériques & DI (S14)</li>
      <li>Signal Forms & routing (S15)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-center text-[10px]">
      Application directe du modèle objet
    </div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
  <div class="font-bold text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1.5">
    <span>⚠️</span> Pourquoi cette séance est-elle un tournant décisif ?
  </div>
  <p class="opacity-85">
    Dans les frameworks modernes comme Angular 21/22, la réactivité (les <code>signals</code>) repose entièrement sur la détection des changements de référence mémoire.
    Si vous ne comprenez pas comment un objet vit en mémoire, vos applications afficheront des données périmées et des bugs fantômes.
  </p>
</div>

<!--
Soulignez que cette séance est la passerelle technique indispensable vers le Bloc C.
Sans la maîtrise de l'immutabilité et des références, il est impossible de maîtriser les Signals d'Angular.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 01
</div>

# Identité & Égalité : Référence vs Valeur
## Pourquoi `===` ne fonctionne pas comme vous le croyez

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Le grand mystère : comment deux objets rigoureusement identiques peuvent-ils être déclarés différents ?
</p>

<!--
Entrons dans le vif du sujet avec l'énigme la plus déroutante pour les étudiants débutants.
-->

---
layout: two-cols-header
---

## L'Énigme

::left::

```ts
// Cas 1 : Les types primitifs (nombres, chaînes)
const score1: number = 100;
const score2: number = 100;

console.log(score1 === score2); // ✅ TRUE ! Normal.

// Cas 2 : Deux objets avec EXACTEMENT les mêmes données !
class Coordonnees {
  constructor(public x: number, public y: number) {}
}

const pointA = new Coordonnees(10, 20);
const pointB = new Coordonnees(10, 20);

console.log(pointA === pointB); // ❌ FALSE Mais pourquoi ?
console.log(pointA == pointB);  // ❌ FALSE aussi !
```

<div class="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-center font-bold">
  💥 Deux objets avec les mêmes attributs ne sont PAS égaux avec `===` !
</div>

::right::

<div class="ms-2 space-y-3 text-xs pt-1">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
      <span>🤔</span> L'intuition humaine trompeuse
    </div>
    <p class="opacity-80 leading-relaxed">
      L'humain compare le <strong>contenu</strong> : « <em>Les deux points sont situés à x=10 et y=20, donc ils sont pareils !</em> ».
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
      <span>⚙️</span> La réalité de l'ordinateur
    </div>
    <p class="opacity-80 leading-relaxed">
      L'opérateur <code>===</code> sur des objets ne regarde <strong>jamais</strong> les propriétés ! Il compare uniquement une adresse physique en mémoire : <strong>l'identité</strong> de l'instance.
    </p>
  </div>

  <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-medium">
    👉 <code>pointA</code> et <code>pointB</code> sont deux boîtes distinctes situées à deux endroits différents dans la RAM.
  </div>
</div>

<!--
Laissez les étudiants réagir.
Demandez-leur : "Si j'achète deux stylos bille identiques au magasin, ai-je un seul stylo ou deux stylos différents ?"
-->

---
layout: default
---

# Les deux grandes analogies pour tout comprendre

Pour ne plus jamais confondre valeur et identité, retenez ces deux métaphores visuelles :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1.5">
      <span>👥</span> 1. L'Analogie des vrais jumeaux
    </div>
    <ul class="space-y-1.5 opacity-85 leading-relaxed">
      <li>Deux jumeaux monozygotes ont exactement le même ADN, la même taille, le même poids et portent le même t-shirt.</li>
      <li>Leur <strong>valeur</strong> (apparence) est strictement indiscernable.</li>
      <li>Pourtant, ils ont <strong>deux cartes d'identité différentes</strong>. Si l'un se coupe le doigt, l'autre ne saigne pas !</li>
    </ul>
    <div class="mt-3 p-2 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
      👉 En informatique : <code>jumeauA === jumeauB</code> renvoie <code>false</code> !
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
    <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1.5 flex items-center gap-1.5">
      <span>🏠</span> 2. L'Analogie de l'adresse postale
    </div>
    <ul class="space-y-1.5 opacity-85 leading-relaxed">
      <li>Une variable contenant un objet ne contient <strong>pas</strong> la maison elle-même. Elle contient un papier avec l'<strong>adresse postale</strong> de la maison.</li>
      <li>Deux maisons construites selon le même plan d'architecte ont deux adresses postales différentes (ex: <em>12 rue de la Gare</em> et <em>45 avenue du Parc</em>).</li>
      <li>L'opérateur <code>===</code> vérifie simplement : « <em>Est-ce exactement la même adresse écrite sur le papier ?</em> ».</li>
    </ul>
    <div class="mt-3 p-2 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
      👉 Deux adresses distinctes = Deux maisons différentes !
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs text-center font-medium">
  🎯 <strong>Règle d'or n°1 :</strong> En JavaScript/TypeScript, <code>===</code> sur des objets teste l'<strong>égalité de référence</strong> (la même adresse), jamais l'égalité de contenu.
</div>

<!--
L'analogie de l'adresse postale est fondamentale : une variable objet est un pointeur, une adresse.
-->

---
layout: default
---

# Sous le capot : Le Modèle Mémoire (Stack vs Heap)

Pour comprendre pourquoi les objets se comportent ainsi, observons l'organisation de la mémoire vive :

<div class="grid grid-cols-12 gap-3 mt-3 text-xs">
  <!-- Colonne Pile (Stack) -->
  <div class="col-span-5 p-3 rounded-xl bg-slate-800 text-slate-100 border border-slate-700 font-mono">
    <div class="text-xs font-bold text-blue-400 border-b border-slate-700 pb-1 mb-2 flex items-center justify-between">
      <span>📚 LA PILE (Stack)</span>
      <span class="text-[10px] text-slate-400">Rapide, taille fixe</span>
    </div>
    <div class="space-y-2 text-[11px]">
      <div class="p-1.5 rounded bg-slate-700/80 border border-slate-600 flex justify-between">
        <span class="text-amber-300">age = 25</span>
        <span class="text-slate-400">valeur brute</span>
      </div>
      <div class="p-1.5 rounded bg-slate-700/80 border border-slate-600 flex justify-between">
        <span class="text-emerald-300">pointA = 0x10A</span>
        <span class="text-blue-400">➔ pointe vers Heap</span>
      </div>
      <div class="p-1.5 rounded bg-slate-700/80 border border-slate-600 flex justify-between">
        <span class="text-purple-300">pointB = 0x20B</span>
        <span class="text-blue-400">➔ pointe vers Heap</span>
      </div>
      <div class="p-1.5 rounded bg-slate-700/80 border border-slate-600 flex justify-between">
        <span class="text-cyan-300">pointC = 0x10A</span>
        <span class="text-blue-400">➔ même adresse que A !</span>
      </div>
    </div>
  </div>

  <!-- Flèche centrale -->
  <div class="col-span-2 flex flex-col items-center justify-center text-center">
    <div class="text-2xl animate-pulse">➡️</div>
    <span class="text-[10px] font-mono text-slate-500 font-bold mt-1">Références (adresses)</span>
  </div>

  <!-- Colonne Tas (Heap) -->
  <div class="col-span-5 p-3 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-mono">
    <div class="text-xs font-bold text-purple-400 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
      <span>🏔️ LE TAS (Heap)</span>
      <span class="text-[10px] text-slate-400">Objets dynamiques</span>
    </div>
    <div class="space-y-2 text-[11px]">
      <div class="p-1.5 rounded bg-purple-950/60 border border-purple-800">
        <div class="text-[10px] text-purple-400 font-bold">@Adresse : 0x10A</div>
        <div class="text-slate-200">Point { x: 10, y: 20 }</div>
      </div>
      <div class="p-1.5 rounded bg-purple-950/60 border border-purple-800">
        <div class="text-[10px] text-purple-400 font-bold">@Adresse : 0x20B</div>
        <div class="text-slate-200">Point { x: 10, y: 20 }</div>
      </div>
    </div>
  </div>
</div>

<div class="grid grid-cols-2 gap-3 mt-3 text-xs">
  <div class="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center font-mono">
    <code>pointA === pointB</code> ➔ <code>0x10A === 0x20B</code> ➔ <strong class="text-red-500">FALSE</strong>
  </div>
  <div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center font-mono">
    <code>pointA === pointC</code> ➔ <code>0x10A === 0x10A</code> ➔ <strong class="text-emerald-500">TRUE</strong>
  </div>
</div>

<!--
Expliquez bien la séparation entre Stack et Heap.
Les primitives vivent dans la pile.
Les objets vivent dans le tas, et la pile ne contient que leur adresse.
-->

---
layout: two-cols-header
---

## L'Affectation par référence : Le piège de l'effet de bord

Que se passe-t-il lorsque l'on écrit `const pointC = pointA` ?

::left::

```ts
class CompteBancaire {
  constructor(public titulaire: string, public solde: number) {}
}

const compteAlice = new CompteBancaire('Alice', 1000);

// ⚠️ Attention : on n'a PAS créé un deuxième compte !
// On a simplement copié l'adresse mémoire !
const compteBob = compteAlice; 

// Bob effectue un retrait sur "son" compte :
compteBob.solde -= 400;

console.log(compteBob.solde);   // 600 €
console.log(compteAlice.solde); // 600 € aussi !
```

<div class="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-bold text-center">
  🚨 Deux variables désignent le même objet physique en mémoire !
</div>

::right::

<div class="ms-2 space-y-2.5 text-xs pt-1">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>💣</span> L'effet de bord (*Side Effect*)
    </div>
    <p class="opacity-80 leading-relaxed">
      Modifier <code>compteBob</code> a silencieusement altéré <code>compteAlice</code>, car il n'existe qu'<strong>un seul compte en mémoire</strong> (adresse <code>0x10A</code>).
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
      <span>🔑</span> Deux télécommandes pour la même TV
    </div>
    <p class="opacity-80 leading-relaxed">
      Alice et Bob ont chacun une télécommande différente dans les mains (deux variables), mais les deux télécommandes sont synchronisées sur le même téléviseur (le même objet).
    </p>
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
    ✅ Pour éviter cela, Bob doit posséder son propre compte autonome : il faut <strong>cloner</strong> l'objet !
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Insistez lourdement sur ce slide. Les débutants écrivent très souvent let b = a en pensant dupliquer une valeur.
-->

---
layout: default
---

## Tableau comparatif : Types Primitifs vs Types Objets

<div class="mt-4 text-xs">

| Caractéristique | Types Primitifs (`number`, `string`, `boolean`, `null`, `undefined`) | Types Objets (`Object`, `Array`, `Date`, Instances de classes) |
|---|---|---|
| **Lieu de stockage** | Directement dans la **Pile** (*Stack*) | Dans le **Tas** (*Heap*) ; la Pile ne stocke que la référence |
| **Opération d'affectation** (`let b = a`) | **Copie la valeur** : `b` devient totalement indépendant de `a` | **Copie la référence** : `b` et `a` pointent vers le même objet |
| **Comparaison** (`a === b`) | Compare la **valeur brute** (`10 === 10` ➔ `true`) | Compare l'**adresse mémoire** (`0x10A === 0x20B` ➔ `false`) |
| **Mutabilité** | **Immuables par nature** (un chiffre 5 ne peut pas devenir un chiffre 6) | **Mutables par défaut** (on peut modifier leurs propriétés internes) |
| **Impact d'une modification** | Aucune répercussion sur les autres variables | Répercussion immédiate sur toutes les variables partageant la référence |

</div>

<div class="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-center font-semibold text-blue-700 dark:text-blue-300">
  💡 <strong>Conséquence majeure pour la POO :</strong> Puisque <code>===</code> compare les adresses, comment faire pour comparer le contenu métier de deux objets ?
</div>

<!--
Faites faire une pause de réflexion aux étudiants avant d'aborder la méthode equals().
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 02
</div>

# Comparer des Objets Métier
## Concevoir une Méthode `equals()` Robuste

<p class="opacity-70 text-sm max-w-lg mx-auto">
  En JavaScript, pas de surcharge d'opérateur. La solution universelle de la POO s'appelle la méthode d'égalité contractuelle.
</p>

<!--
Présentez la solution propre et standardisée en génie logiciel pour comparer des objets.
-->

---
layout: two-cols-header
---

# Le besoin d'une égalité métier : La méthode `equals()`

Puisque nous ne pouvons pas redéfinir le comportement de `===`, nous devons doter nos classes d'une méthode explicite :

::left::

```ts
export class Point2D {
  constructor(public x: number, public y: number) {}
  // Méthode d'égalité métier personnalisée
  equals(other: unknown): boolean {
    // 1. Optimisation : même référence en mémoire ?
    if (this === other) return true;
    // 2. Garde de type : est-ce bien une instance de Point2D ?
    if (!(other instanceof Point2D)) return false;
    // 3. Comparaison des valeurs significatives
    return this.x === other.x && this.y === other.y;
  }
}

const p1 = new Point2D(5, 8);
const p2 = new Point2D(5, 8);
console.log(p1 === p2);        // false (adresses mémoires différentes)
console.log(p1.equals(p2));    // true  (valeurs des coordonnées identiques !)
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">Étape 1 : Le court-circuit d'adresse</strong><br>
    Si <code>this === other</code>, ils partagent la même adresse mémoire : inutile de comparer les champs un par un, ils sont forcément égaux !
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Étape 2 : Le garde de type strict</strong><br>
    En typant <code>other: unknown</code>, on accepte n'importe quelle entrée tout en se protégeant contre <code>null</code>, <code>undefined</code> ou un objet d'une autre classe.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">Étape 3 : La comparaison des attributs</strong><br>
    C'est la classe elle-même qui décide ce qui constitue son égalité (ici, les deux coordonnées <code>x</code> et <code>y</code>).
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Soulignez les 3 étapes universelles d'une bonne méthode equals().
C'est le même schéma dans tous les langages orientés objet (Java, C#, TypeScript).
-->

---
layout: default
---

## Les deux grandes familles d'égalité : Entités vs Objets-Valeurs

Tous les objets ne se comparent pas de la même manière selon leur nature métier :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <div class="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
      <span>🆔</span> 1. L'Entité Métier (<strong>Entity</strong>)
    </div>
    <p class="opacity-80 leading-relaxed mb-2">
      Une entité possède une <strong>identité unique pérenne</strong> (souvent un ID ou code unique). Même si son nom ou son adresse change, elle reste la même entité.
    </p>
    <div class="p-2 rounded bg-slate-500/10 font-mono text-[11px]">
      Exemples : <code>Utilisateur</code>, <code>Commande</code>, <code>CompteBancaire</code>
    </div>
    <div class="mt-2.5 p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-[11px]">
      equals(other): boolean {<br>
      &nbsp;&nbsp;return other instanceof User && <strong>this.id === other.id</strong>;<br>
      }
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <div class="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1.5 flex items-center gap-1.5">
      <span>💎</span> 2. L'Objet-Valeur (<strong>Value Object</strong>)
    </div>
    <p class="opacity-80 leading-relaxed mb-2">
      Un objet-valeur n'a pas d'ID : il est <strong>défini exclusivement par l'ensemble de ses attributs</strong>. Deux billets de 20 € ont la même valeur d'échange.
    </p>
    <div class="p-2 rounded bg-slate-500/10 font-mono text-[11px]">
      Exemples : <code>Point2D</code>, <code>Monnaie(montant, devise)</code>, <code>PlageHoraire</code>
    </div>
    <div class="mt-2.5 p-2 rounded bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 font-mono text-[11px]">
      equals(other): boolean {<br>
      &nbsp;&nbsp;return other instanceof Monnaie &&<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<strong>this.valeur === other.valeur && this.devise === other.devise</strong>;<br>
      }
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-center">
  🎯 <strong>Question à se poser :</strong> « <em>Mon objet est-il défini par son identifiant unique, ou par la totalité de ses données ?</em> »
</div>

<!--
Cette distinction entre Entité et Objet-Valeur prépare les étudiants aux architectures logicielles propres (DDD, Clean Architecture).
-->

---
layout: default
---

## Le Contrat d'Interface générique : `Equatable<T>`

<div class="mt-0" style="font-size:14px"> Rappel de la Séance 8 : plutôt que d'inventer des noms de méthodes au hasard (`estEgal`, `compare`, `sameAs`), formalisons un contrat propre ! </div>

<div class="grid grid-cols-12 gap-3 mt-3">
  <div class="col-span-6">

```ts
// 1. Définition du contrat générique
export interface Equatable<T> {
  equals(other: T): boolean;
}

// 2. La classe implémente le contrat
export class ArticlePanier implements Equatable<ArticlePanier> {
  constructor(
    public readonly reference: string,
    public readonly designation: string,
    public prixUnitaire: number
  ) {}

  equals(other: ArticlePanier): boolean {
    if (this === other) return true;
    if (!other) return false;
    // Deux articles sont identiques s'ils ont la même référence
    return this.reference === other.reference;
  }
}
```

  </div>

  <div class="col-span-6 space-y-2 text-xs">
    <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
      <h4 class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">Les 4 Lois d'une égalité mathématique saine</h4>
      <ul class="space-y-1 opacity-80 list-disc list-inside">
        <li><strong>Réflexive :</strong> <code>a.equals(a)</code> doit toujours être <code>true</code>.</li>
        <li><strong>Symétrique :</strong> <code>a.equals(b)</code> équivaut à <code>b.equals(a)</code>.</li>
        <li><strong>Transitive :</strong> Si <code>a.equals(b)</code> et <code>b.equals(c)</code>, alors <code>a.equals(c)</code> est <code>true</code>.</li>
        <li><strong>Cohérente :</strong> Deux appels successifs sans modification de l'objet renvoient le même résultat.</li>
      </ul>
    </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-700 dark:text-emerald-300">Recherche facilitée dans les tableaux</strong><br>
    <span class="opacity-80 text-[11px]">
      Vous pouvez désormais chercher un élément dans une liste sans vous soucier des références :<br>
      <code>const existe = panier.some(item => item.equals(nouvelArticle));</code>
    </span>
  </div>
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Montrez l'intérêt pratique : rechercher dans une collection avec .some() ou .find().
-->

---
layout: default
---

# ⚠️ La fausse bonne idée : `JSON.stringify()`

Beaucoup de développeurs pressés tentent de comparer deux objets en les transformant en chaînes JSON :

```ts
const userA = { nom: 'Dupont', prenom: 'Jean' };
const userB = { prenom: 'Jean', nom: 'Dupont' }; // Même contenu, ordre inversé !

console.log(JSON.stringify(userA) === JSON.stringify(userB)); // ❌ FALSE !
```

<div class="grid grid-cols-3 gap-3 mt-3 text-xs">
  <div class="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
    <strong class="text-red-600 dark:text-red-400 block mb-1">1. L'Ordre des clés</strong>
    <p class="opacity-80">
      L'ordre de déclaration des propriétés détermine la chaîne générée. Deux objets identiques aux propriétés permutées échouent.
    </p>
  </div>

  <div class="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
    <strong class="text-red-600 dark:text-red-400 block mb-1">2. Perte des types riches</strong>
    <p class="opacity-80">
      Les objets <code>Date</code> deviennent de simples chaînes, les méthodes de classe disparaissent, <code>undefined</code> est ignoré.
    </p>
  </div>

  <div class="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
    <strong class="text-red-600 dark:text-red-400 block mb-1">3. Performance désastreuse</strong>
    <p class="opacity-80">
      Sérialiser deux gros objets en mémoire à chaque comparaison consomme énormément de CPU et alloue des chaînes temporaires inutiles.
    </p>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 text-center font-bold">
  ⛔ Bannissez <code>JSON.stringify()</code> pour tester l'égalité : écrivez une méthode <code>equals()</code> explicite !
</div>

<!--
Mise en garde indispensable : JSON.stringify est un anti-pattern extrêmement répandu chez les débutants.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 03
</div>

# La Duplication d'Objets
## Copie Superficielle (*Shallow*) vs Copie Profonde (*Deep*)

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Comment obtenir une copie véritablement indépendante d'un objet sans risquer d'altérer l'original ?
</p>

<!--
Passons au clonage d'objets : comprendre la frontière entre le premier niveau et les niveaux imbriqués.
-->

---
layout: default
---

## La Copie Superficielle (*Shallow Copy*) : Les Mécanismes

Une copie superficielle ne duplique que le **premier niveau** de l'objet. Les outils standards en TypeScript sont :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div>
    <div class="font-bold text-xs text-blue-500 mb-1 font-mono">1. L'opérateur Spread `{ ...objet }` (Recommandé)</div>

```ts
const configurationInitiale = {
  theme: 'dark',
  langue: 'fr',
  volume: 80
};

// ✅ Crée un nouvel objet avec une nouvelle adresse :
const copieConfig = { ...configurationInitiale };

copieConfig.volume = 50;

console.log(configurationInitiale.volume); // 80 (Préservé !)
console.log(copieConfig.volume);           // 50 (Indépendant !)
```

  </div>

  <div>
    <div class="font-bold text-xs text-indigo-500 mb-1 font-mono">2. `Object.assign({}, objet)` (Historique)</div>

```ts
// Équivalent syntaxique plus ancien :
const copieAssign = Object.assign({}, configurationInitiale);

// Pour les tableaux : [...tableau] ou slice()
const notes = [12, 15, 18];
const copieNotes = [...notes];
copieNotes.push(20);

console.log(notes.length);      // 3
console.log(copieNotes.length); // 4
```

  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 text-center font-semibold">
  ✅ Pour des objets "plats" (ne contenant que des nombres, chaînes ou booléens), le spread <code>{...obj}</code> est parfait !
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Le spread operator est très populaire et pratique pour les objets simples sans imbrication.
-->

---
layout: two-cols-header
---

## Le Piège du Shallow Copy : Les Objets Imbriqués

Que se passe-t-il dès que notre objet contient un sous-objet ou un tableau d'éléments ?

::left::

```ts
// Un objet avec une structure imbriquée :
const profilUtilisateur = {
  pseudo: 'Alice',
  parametres: {
    notifications: true,
    resolution: '1080p'
  }
};
// Shallow copy via spread :
const cloneSuperficiel = { ...profilUtilisateur };
// Modif 1 : Propriété primitive de niveau 1
cloneSuperficiel.pseudo = 'Bob'; // Aucun problème !
// Modif 2 : Propriété dans l'objet imbriqué
cloneSuperficiel.parametres.notifications = false;
// Vérification de l'original :
console.log(profilUtilisateur.pseudo); // 'Alice' (OK)
console.log(profilUtilisateur.parametres.notifications); 
// FALSE ! L'original a été muté en silence !
```

::right::

<div class="ms-2 space-y-2.5 text-xs pt-1">
  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>💣</span> Pourquoi ce désastre ?
    </div>
    <p class="opacity-80 leading-relaxed">
      Le spread a créé un nouveau conteneur pour le niveau 1, mais pour la propriété <code>parametres</code>, il a simplement <strong>recopié l'adresse de référence</strong> !
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
      <span>🎒</span> L'Analogie de la valise
    </div>
    <p class="opacity-80 leading-relaxed">
      Vous avez acheté une nouvelle valise (niveau 1), mais à l'intérieur, vous avez branché des câbles reliés aux mêmes objets que la première valise. Toucher à l'un modifie l'autre !
    </p>
  </div>

  <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-center font-bold">
    Conclusion : Pour des structures imbriquées, il FAUT une copie profonde !
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Montrez bien que parametres est une référence partagée.
C'est la cause numéro 1 d'effets de bord avec le spread operator.
-->

---
layout: default
---

## La Copie Profonde (*Deep Copy*) : L'arme moderne `structuredClone()`

<div style="font-size:14px">Depuis ECMAScript 2022 (Node 17+ et tous les navigateurs modernes), JavaScript intègre une fonction native puissante :</div>

<div class="grid grid-cols-12 gap-3 mt-3">
  <div class="col-span-7">

```ts
const profilOriginal = {
  pseudo: 'Alice',
  parametres: {
    notifications: true,
    theme: { mode: 'dark', contraste: 'eleve' }
  },
  scores: [100, 150, 200],
  dateInscription: new Date('2025-01-15')
};

// COPIE PROFONDE NATIVE PARFAITE :
const vraiClone = structuredClone(profilOriginal);

// Altérations en profondeur sur le clone :
vraiClone.parametres.theme.mode = 'light';
vraiClone.scores.push(300);

// L'original est 100% protégé :
console.log(profilOriginal.parametres.theme.mode); // 'dark'
console.log(profilOriginal.scores.length);         // 3
```

  </div>

  <div class="col-span-5 space-y-2 text-xs">
    <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
      <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1">
        ✨ Les super-pouvoirs de `structuredClone()`
      </div>
      <ul class="space-y-1 opacity-80 list-disc list-inside">
        <li>Clone <strong>tous les niveaux d'imbrication</strong> de façon récursive.</li>
        <li>Préserve les types riches natifs : <code>Date</code>, <code>RegExp</code>, <code>Map</code>, <code>Set</code>, <code>ArrayBuffer</code>.</li>
        <li>Gère nativement les <strong>références circulaires</strong> (quand un objet pointe vers lui-même) sans boucle infinie !</li>
      </ul>
    </div>

  <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <div class="font-bold text-sm text-amber-700 dark:text-amber-300 mb-1">
      ⚠️ La seule limite de `structuredClone()`
    </div>
    <p class="opacity-80 leading-relaxed">
      Il ne peut <strong>pas</strong> cloner les fonctions ni les méthodes de classe ! L'instance clonée perd son prototype et redevient un objet JavaScript simple sans méthodes.
    </p>
  </div>
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
structuredClone() est le standard web moderne. Fini les bibliothèques lourdes comme lodash.cloneDeep pour les données pures.
-->

---
layout: default
---

## Le Clonage en POO : La Méthode Métier `clone()`

<div style="font-size:14px">Pour cloner une instance de classe tout en conservant ses méthodes et son encapsulation, implémentons le pattern `clone()` :</div>

<div class="grid grid-cols-2 gap-4 mt-3">
  <div>

```ts
export class Adresse {
  constructor(public rue: string, public ville: string) {}
  // Clonage autonome de l'adresse
  clone(): Adresse {
    return new Adresse(this.rue, this.ville);
  }
}
export class Client {
  constructor(
    public nom: string,
    public adresse: Adresse
  ) {}

  // Clonage récursif de l'entité Client
  clone(): Client {
    return new Client(
      this.nom,
      // Délégation du clonage à l'objet interne !
      this.adresse.clone() 
    );
  }
}
```

  </div>

  <div class="space-y-3 text-xs">
    <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
      <h4 class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">Pourquoi la méthode `clone()` est supérieure en POO ?</h4>
      <ul class="space-y-1.5 opacity-80 list-disc list-inside leading-relaxed">
        <li><strong>Respect de l'encapsulation :</strong> chaque classe sait exactement comment dupliquer ses propres membres privés.</li>
        <li><strong>Préservation des prototypes :</strong> l'objet retourné est une vraie instance (`instanceof Client === true`) avec toutes ses méthodes.</li>
        <li><strong>Délégation naturelle :</strong> la classe <code>Client</code> délègue à <code>Adresse</code> le soin de se cloner elle-même (principe de délégation de la S9).</li>
      </ul>
    </div>

  <div class=" font-mono text-[11px]">

```ts
const c1 = new Client('Alice', new Adresse('Rue Neuve', 'Bruxelles'));
const c2 = c1.clone();
c2.adresse.ville = 'Liège';
console.log(c1.adresse.ville); // 'Bruxelles' ✅ Totalement isolé !
```

  </div>
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
La méthode clone() est la solution reine en POO : chaque objet est responsable de sa propre duplication.
-->

---
layout: default
---

# Tableau comparatif : Quelle stratégie de clonage choisir ?

<div class="mt-4 text-xs">

| Technique | Profondeur | Conserve les Méthodes ? | Gère les Dates/Map/Set ? | Cas d'usage idéal |
|---|:---:|:---:|:---:|---|
| **Affectation directe** (`b = a`) | ❌ 0 niveau | ✅ Oui | ✅ Oui | Vous voulez juste un alias vers le même objet physique en mémoire. |
| **Spread operator** (`{ ...a }`) | 🟡 1 niveau (*Shallow*) | ❌ Non (objet littéral) | ❌ Non (copie la réf) | Objets simples, DTOs plats, mise à jour de formulaires Angular. |
| **`structuredClone(a)`** | 🟢 Tous niveaux (*Deep*) | ❌ Non (données pures) | ✅ Oui | Objets de données imbriqués, arbres d'état, clonage de JSON complexe. |
| **Méthode `clone()` POO** | 🟢 Tous niveaux (*Deep*) | ✅ **Oui (100% POO)** | ✅ Oui (si géré) | **Classes métier avec méthodes**, entités du modèle de domaine. |

</div>

<div class="mt-5 p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 text-xs text-center font-bold">
  🚀 <strong>Règle de décision :</strong> Données plates ➔ Spread · Arbre de données pur ➔ `structuredClone` · Vraies classes POO ➔ Méthode `clone()`
</div>

<!--
Cette diapositive est le tableau de référence que les étudiants doivent garder sous le coude.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 04
</div>

# L'Immutabilité en POO
## `readonly`, `Object.freeze()` et les Objets-Valeurs

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Et si la meilleure façon d'éviter les bugs de mutation était d'interdire formellement toute modification ?
</p>

<!--
Abordons le concept d'immutabilité : la philosophie qui transforme le développement moderne.
-->

---
layout: default
---

# Qu'est-ce que l'Immutabilité ?

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1.5">
      <span>✏️</span> L'Objet Mutable (Par défaut)
    </div>
    <p class="opacity-80 leading-relaxed">
      L'objet ressemble à un <strong>tableau blanc effaçable</strong> : n'importe quelle méthode ou fonction distante peut venir modifier ses valeurs internes à tout moment.
    </p>
    <div class="mt-3 space-y-1 text-slate-700 dark:text-slate-300">
      <div>💥 Risque élevé d'effets de bord imprévus</div>
      <div>💥 Difficulté à savoir qui a modifié l'état et quand</div>
      <div>💥 Bugs indétectables en environnement réactif</div>
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
      <span>🗿</span> L'Objet Immuable (*Immutable*)
    </div>
    <p class="opacity-80 leading-relaxed">
      L'objet ressemble à une <strong>gravure sur pierre</strong> : une fois instancié, son état interne ne peut plus JAMAIS changer d'un seul millimètre.
    </p>
    <div class="mt-3 space-y-1 text-slate-700 dark:text-slate-300">
      <div>✅ Fiabilité absolue : 100% prédictible</div>
      <div>✅ Aucun risque de modification concurrente ou accidentelle</div>
      <div>✅ Détection de changement ultra-rapide par référence</div>
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-center font-medium">
  💡 <strong>Le principe fondamental :</strong> Si l'on souhaite modifier un objet immuable, on ne le modifie pas sur place : on en crée une <strong>nouvelle version</strong> avec les nouvelles valeurs !
</div>

<!--
Expliquez bien la distinction entre modifier en place (mutation) et produire une nouvelle instance.
-->

---
layout: two-cols-header
---

## `readonly` (TypeScript) vs `Object.freeze()` (JavaScript)

Comment garantir l'immutabilité en TypeScript ? Deux niveaux de protection complémentaires existent :

::left::

```ts
// 1. Protection au temps de compilation (TypeScript)
export class CoordonneesGPS {
  // readonly interdit la réassignation dans le code TS
  readonly latitude: number;
  readonly longitude: number;

  constructor(lat: number, lng: number) {
    this.latitude = lat;
    this.longitude = lng;
    // 2. Protection au runtime (moteur JS)
    Object.freeze(this);
  }
}
const bruxelles = new CoordonneesGPS(50.85, 4.35);
// ❌ Erreur TypeScript à la compilation :
// Cannot assign to 'latitude' because it is a read-only property.
// bruxelles.latitude = 51.0;

// ❌ Erreur Runtime (en mode strict JS) :
// TypeError: Cannot assign to read only property 'latitude'
```

::right::

<div class="ms-2 space-y-2.5 text-xs pt-1">
  <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">
      🛡️ Le rôle de `readonly` (TS)
    </div>
    <p class="opacity-80 leading-relaxed">
      C'est une <strong>sécurité de développement</strong>. Le compilateur vous empêche d'écrire du code qui modifie la propriété. Mais à la compilation en JS, le mot-clé <code>readonly</code> s'évapore totalement !
    </p>
  </div>

  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1">
      🧊 Le rôle de `Object.freeze()` (JS)
    </div>
    <p class="opacity-80 leading-relaxed">
      C'est le <strong>garde-fou d'exécution</strong>. Il verrouille physiquement l'objet en mémoire. Même un code externe en JavaScript brut ne pourra pas altérer ses propriétés.
    </p>
  </div>

  <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-center">
    ⚠️ Attention : <code>Object.freeze()</code> est superficiel (<strong>shallow freeze</strong>) !
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
readonly protège pendant que vous codez dans l'IDE.
Object.freeze() protège pendant que le programme tourne dans le navigateur.
-->

---
layout: default
---

### L'Exemple Magistral : Le *Value Object* Immuable `Monnaie`

<div style="font-size:12px">Observons comment concevoir une classe métier élégante qui ne mute jamais :</div>

```ts
export class Monnaie {
  constructor(public readonly montant: number, public readonly devise: string) {
    if (montant < 0) throw new Error("Le montant ne peut pas être négatif");
    Object.freeze(this); // Garantie runtime
  }
  // Toute opération produit une NOUVELLE instance !
  ajouter(autre: Monnaie): Monnaie {
    if (this.devise !== autre.devise) {
      throw new Error(`Incompatibilité de devises : ${this.devise} vs ${autre.devise}`);
    }
    // L'instance courante n'est PAS modifiée : on renvoie un nouveau Monnaie !
    return new Monnaie(this.montant + autre.montant, this.devise);
  }
  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof Monnaie)) return false;
    return this.montant === autre.montant && this.devise === autre.devise;
  }
}
const prixArticle = new Monnaie(50, 'EUR');
const fraisPort = new Monnaie(10, 'EUR');
const total = prixArticle.ajouter(fraisPort);
console.log(prixArticle.montant); // 50 € (Inchangé !)  console.log(total.montant);       // 60 € (Nouvelle instance)

```

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Faites remarquer la méthode ajouter() : elle ne fait pas this.montant += autre.montant.
Elle fait return new Monnaie(...). C'est le cœur de l'approche immuable.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 05
</div>

# Démonstration Angular Signals
## La Classe Métier en Action : `equals()`, Clonage & Réactivité

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Lier les concepts du jour dans un composant concret : comment une classe métier interagit avec le moteur réactif des signaux Angular.
</p>

<!--
Nous abordons la démonstration qui réunit tous les acquis de la séance :
- Une vraie classe POO
- L'identité et la méthode equals()
- Le clonage par création d'une nouvelle instance immuable
- Et la réaction immédiate du signal Angular !
-->

---
layout: two-cols-header
---

## Étape 1 : Le Modèle Métier POO — La Classe `Article`

<div>Pour modéliser un produit de catalogue, nous concevons une classe propre appliquant les principes vus aujourd'hui :</div>

::left::

```ts
// src/app/models/article.model.ts
export class Article {
  constructor(
    public readonly id: number,    // 🆔 Identité immuable
    public readonly nom: string,   // 🏷️ Libellé
    public readonly prix: number   // 💶 Valeur monétaire
  ) {}
  // 1. Égalité métier (S12 - Partie 02)
  equals(autre: unknown): boolean {
    if (this === autre) return true;
    if (!(autre instanceof Article)) return false;
    return this.id === autre.id;
  }
  // 2. Duplication immuable (S12 - Parties 03 & 04)
  avecNouveauPrix(nouveauPrix: number): Article {
    // Produit une NOUVELLE instance sans altérer l'objet courant !
    return new Article(this.id, this.nom, nouveauPrix);
  }
}
```

::right::

<div class="ms-2 space-y-2.5 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400">1. Identité protégée (`readonly`)</strong><br>
    L'identifiant <code>id</code> ne peut jamais être réassigné après instanciation.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">2. Égalité métier (`equals()`)</strong><br>
    Deux articles avec le même <code>id</code> représentent le même produit en stock, même si leur prix temporaire diffère.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">3. Clonage fonctionnel (`avecNouveauPrix`)</strong><br>
    Au lieu de modifier un attribut en place, la méthode retourne une <strong>nouvelle instance</strong> avec la valeur mise à jour.
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Cette classe est limpide et illustre exactement le cours :
- readonly
- equals()
- production d'une nouvelle instance immuable
-->

---
layout: two-cols-header
---

### Étape 2 : Le Composant Angular — `ArticleComponent`

<div class="mt-0">Observons ce qui se passe quand notre classe métier est placée dans un <code>signal&lt;Article&gt;</code> :</div>

::left::

```ts
import { Component, signal } from '@angular/core';
import { Article } from './models/article.model';
@Component({
  selector: 'app-article',
  standalone: true,
  templateUrl: './article.component.html'
})
export class ArticleComponent {
  // Le signal héberge l'instance de notre classe Article
  article = signal<Article>(new Article(42, 'Casque Bluetooth', 100));
  // BOUTON 1 : Mutation en place (Anti-pattern)
  remiseMuteDirect(): void {
    const a = this.article();
    (a as any).prix = 70;      // ⚠️ On force la modification dans le Tas
    this.article.set(a);        // 💥 Même adresse 0x10A -> UI FIGÉE !
  }
  // ✅ BOUTON 2 : Nouvelle instance immuable (Bonne pratique)
  remiseImmuable(): void {
    const a = this.article();
    this.article.set(a.avecNouveauPrix(70)); 
    // 🎉 new Article(...) -> Nouvelle adresse 0x20B -> L'ÉCRAN CHANGE !
  }
}
```

::right::

<div class="ms-2 space-y-2.5 text-xs pt-1">
  <div class="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1">
      Pourquoi <code>remiseMuteDirect()</code> échoue ?
    </div>
    <p class="opacity-80 leading-relaxed">
      L'attribut <code>prix</code> a bien changé dans la mémoire vive, mais <code>this.article.set(a)</code> transmet l'adresse <code>0x10A</code>.<br>
      Angular teste : <code>Object.is(0x10A, 0x10A)</code> ➔ <strong>TRUE</strong>.<br>
      Angular en déduit qu'aucun changement n'a eu lieu : <strong>l'écran ne bouge pas !</strong>
    </p>
  </div>

  <div class="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1">
      Pourquoi <code>remiseImmuable()</code> réussit ?
    </div>
    <p class="opacity-80 leading-relaxed">
      <code>a.avecNouveauPrix(70)</code> instancie un nouvel <code>Article</code> à l'adresse <code>0x20B</code>.<br>
      Angular teste : <code>Object.is(0x10A, 0x20B)</code> ➔ <strong>FALSE</strong>.<br>
      Angular détecte le changement d'adresse et <strong>rafraîchit le template instantanément !</strong>
    </p>
  </div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
Soulignez bien le contraste : l'une passe la même adresse, l'autre passe une nouvelle adresse créée par la méthode métier.
-->

---
layout: default
---

### Étape 3 : Le Template HTML & La Simulation Visuelle

<div class="grid grid-cols-12 gap-4 items-start">

<div class="col-span-7">

```html
<!-- src/app/article.component.html -->
<div class="fiche-article">
  <span class="badge">Réf: #{{ article().id }}</span>
  
  <h3>{{ article().nom }}</h3>
  <div class="prix-affiche">{{ article().prix }} €</div>

  <div class="actions">
    <!-- Bouton Buggé -->
    <button (click)="remiseMuteDirect()" class="btn-rouge">
      ❌ Muter en place (70 €)
    </button>

    <!-- Bouton Corrigé -->
    <button (click)="remiseImmuable()" class="btn-vert">
      ✅ Nouvelle instance (70 €)
    </button>
  </div>
</div>
```


<div class="p-2 rounded bg-emerald-950/50 border border-emerald-700 text-[10.5px]">
  <strong class="text-emerald-300">Clic sur [Nouvelle instance] :</strong><br>
  Nouvelle adresse <code>0x20B</code> ➔ L'écran bascule immédiatement sur <strong>70 €</strong> !
</div>

</div>

<div class="col-span-5">

<!-- Rendu UI simulé -->
<div class="ms-2 p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 text-slate-100 text-xs shadow-xl">
  <div class="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-2">
    <span class="font-bold text-sm text-indigo-400">📦 Catalogue Boutique</span>
    <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Réf: #42</span>
  </div>

  <div class="my-2 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex justify-between items-center">
    <div>
      <div class="text-[10px] text-slate-400 font-bold uppercase">Article</div>
      <div class="text-sm font-extrabold text-white">Casque Bluetooth</div>
    </div>
    <div class="text-right">
      <div class="text-[10px] text-slate-400 font-bold uppercase">Prix Écran</div>
      <div class="text-2xl font-black text-rose-400">100 €</div>
    </div>
  </div>

  <div class="space-y-1.5 mt-2.5">
    <div class="p-2 rounded bg-rose-950/50 border border-rose-700 text-[10.5px]">
      <strong class="text-rose-300">Clic sur [Muter en place] :</strong><br>
      L'objet en RAM vaut 70 €, mais l'écran <strong>reste bloqué sur 100 €</strong> ! (même adresse <code>0x10A</code>).
    </div>

  <div class="p-2 rounded bg-emerald-950/50 border border-emerald-700 text-[10.5px]">
    <strong class="text-emerald-300">Clic sur [Nouvelle instance] :</strong><br>
    Nouvelle adresse <code>0x20B</code> ➔ L'écran bascule immédiatement sur <strong>70 €</strong> !
  </div>
  </div>
</div>
</div>
</div>

<style>
  code {
    font-size: 11px !important;
  }
</style>

<!--
L'étudiant voit le lien direct entre le bouton cliqué et la réaction visuelle de l'écran.
-->

---
layout: default
---

## La Clé de Voûte : Égalité Métier (`equals`) vs Égalité Mémoire (`===`)

Cette démonstration révèle la distinction fondamentale de toute la séance :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
    <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1.5 flex items-center gap-1.5">
      <span>🎯</span> 1. L'Égalité Métier (`equals()`)
    </div>
    <div class="p-2 rounded bg-slate-500/10 font-mono text-[11px] mb-2">
      articleInitial.equals(articlePromo) ➔ <strong class="text-emerald-500">TRUE</strong>
    </div>
    <p class="opacity-80 leading-relaxed">
      Pour votre logique d'entreprise, c'est <strong>exactement le même article</strong> : c'est toujours le produit #42 (même code-barres, même référence en stock).
    </p>
    <div class="mt-2 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
      👉 Sert à la logique métier (panier, recherche dans un tableau).
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1.5">
      <span>⚙️</span> 2. L'Égalité Mémoire (`===`)
    </div>
    <div class="p-2 rounded bg-slate-500/10 font-mono text-[11px] mb-2">
      articleInitial === articlePromo ➔ <strong class="text-rose-500">FALSE</strong>
    </div>
    <p class="opacity-80 leading-relaxed">
      Pour l'ordinateur et le moteur d'Angular, ce sont <strong>deux instances distinctes</strong> logées à deux adresses différentes (<code>0x10A !== 0x20B</code>).
    </p>
    <div class="mt-2 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
      👉 C'est ce <strong>FALSE</strong> qui déclenche la réactivité des signaux et actualise l'UI !
    </div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/15 via-blue-500/10 to-emerald-500/15 border border-purple-500/30 text-xs text-center font-bold">
  ✨ <strong>La révélation de la Séance 12 :</strong> Vous écrivez <code>equals()</code> pour reconnaître vos objets, et vous créez de nouvelles références pour réveiller Angular !
</div>

<!--
Cette diapositive est l'aboutissement de toute la séance. Tout prend sens pour l'étudiant.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  SYNTHÈSE
</div>

# Récapitulatif & Règles d'Or
## Ce qu'il faut graver dans vos mémoires

<p class="opacity-70 text-sm max-w-xl mx-auto">
  La boîte à outils indispensable pour manipuler les objets en professionnel sans jamais se faire piéger par la mémoire.
</p>

<!--
Passons au récapitulatif global de la séance.
-->

---
layout: default
---

# Ce qu'il faut retenir absolument

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1.5">🧠 Identité & Comparaison</h3>
    <ul class="opacity-80 space-y-1.5 list-disc list-inside">
      <li><strong>`===` compare des adresses :</strong> deux objets différents avec les mêmes attributs valent <code>false</code>.</li>
      <li><strong>Méthode `equals()` :</strong> incontournable pour définir l'égalité métier de vos classes.</li>
      <li><strong>Respect des lois :</strong> réflexivité, symétrie, transitivité et garde <code>instanceof</code>.</li>
      <li><strong>Bannir `JSON.stringify` :</strong> trop lent, sensible à l'ordre des clés et perte de typage.</li>
    </ul>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1.5">📦 Duplication & Protection</h3>
    <ul class="opacity-80 space-y-1.5 list-disc list-inside">
      <li><strong>Shallow Copy (`{ ...obj }`) :</strong> duplique uniquement le 1er niveau. Dangereux si imbrications !</li>
      <li><strong>Deep Copy (`structuredClone`) :</strong> duplication récursive moderne des structures de données pures.</li>
      <li><strong>Pattern `clone()` en POO :</strong> chaque classe instancie sa propre copie récursivement.</li>
      <li><strong>Immutabilité :</strong> <code>readonly</code> pour la compilation + <code>Object.freeze()</code> pour le runtime.</li>
    </ul>
  </div>
</div>

<div class="mt-3.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
  <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">💡 La Règle d'Or de la Séance 12</div>
  <p class="text-sm font-bold">
    « En programmation réactive, ne mutez jamais un objet en place : traitez vos données comme des gravures sur pierre.<br>
    Pour faire évoluer un état, produisez toujours une nouvelle référence mémoire afin d'informer vos signaux et vos composants. »
  </p>
</div>

<!--
Faites lire la règle d'or à voix haute par un étudiant.
-->

---
layout: default
---

# 🚀 Clôture du Bloc B : Le Pont vers le Bloc C

Vous venez de franchir une étape cruciale de votre apprentissage du génie logiciel :

<div class="p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 mb-4 text-xs">
  <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-0.5">Le Bloc B est validé !</div>
  <p class="opacity-85">
    Vous maîtrisez désormais la robustesse (S10 - Exceptions), la conception modulaire propre (S11 - Principes SOLID) et la gestion intime de la mémoire (S12 - Objets & Immutabilité).
  </p>
</div>

<div class="grid grid-cols-3 gap-3 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400 text-sm mb-1 block">Séance 13</strong>
    <p class="font-bold mb-1">Composants & Signals Approfondis</p>
    <p class="opacity-75"><code>signal()</code>, <code>computed()</code>, <code>effect()</code>, <code>input()</code>, <code>output()</code>, <code>model()</code> au cœur d'un projet interactif complet.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400 text-sm mb-1 block">Séance 14</strong>
    <p class="font-bold mb-1">Services & Injection (DI)</p>
    <p class="opacity-75">L'Inversion de Dépendance (DIP) et les classes génériques <code v-pre>Repository&lt;T&gt;</code> appliquées aux architectures de services.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-emerald-600 dark:text-emerald-400 text-sm mb-1 block">Séance 15</strong>
    <p class="font-bold mb-1">Signal Forms & Routing</p>
    <p class="opacity-75">Validation réactive déclarative et navigation multi-vues dans une application Angular professionnelle.</p>
  </div>
</div>

