

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
    Séance 13 — Composants & Signals
  </h1>

  <p class="text-base text-slate-800 dark:text-slate-100 max-w-2xl mx-auto mb-5 font-semibold">
    L'Architecture Réactive Fine · <code>signal()</code> · <code>computed()</code> · <code>effect()</code> · <code>input()</code> · <code>output()</code> · <code>model()</code>
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono font-bold">
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">TypeScript 5+</span>
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Angular 22</span>
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Signal-First</span>
    <span class="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">Début Bloc C</span>
  </div>
</div>

<!--
Bienvenue à la séance 13 du cours de Programmation Orientée Objet !
Aujourd'hui, nous ouvrons le Bloc C : Angular en Signal-First.
Rappelez immédiatement aux étudiants qu'Angular n'est pas une matière différente de la POO,
mais son prolongement direct dans une interface utilisateur graphique moderne.
Les Signals sont la matérialisation la plus élégante de l'état d'un objet et de son encapsulation.
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques de la séance

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">La Révolution Réactive Fine</h4>
      <p class="opacity-75">Comprendre pourquoi Angular a abandonné Zone.js et le Dirty Checking global pour adopter un graphe de dépendances (DAG) chirurgical et le mode <strong>Zoneless</strong>.</p>
    </div>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Le Trio Fondamental</h4>
      <p class="opacity-75">Maîtriser <code>signal()</code> (source mutable), <code>computed()</code> (projection dérivée pure et mémorisée) et <code>effect()</code> (consommateur contrôlé d'effets de bord).</p>
    </div>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Communication Signal-First</h4>
      <p class="opacity-75">Remplacer <code>@Input</code> et <code>@Output</code> par <code>input()</code>, <code>input.required()</code>, <code>output()</code> et la liaison bidirectionnelle unifiée <code>model()</code>.</p>
    </div>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">POO, Encapsulation & Immutabilité</h4>
      <p class="opacity-75">Protéger les invariants avec le motif <em>Private Source, Public Readonly</em> et combiner les entités métier de la Séance 12 avec la réactivité d'Angular.</p>
    </div>
  </div>

</div>

<!--
Présentez ces 5 objectifs aux étudiants.
Rassurez-les : même si le vocabulaire paraît nouveau (DAG, fine-grained reactivity),
les concepts reposent sur ce qu'ils ont déjà compris en séances 5, 11 et 12.
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques de la séance

<div class="col-span-2 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs flex-shrink-0">05</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Architecture Complète : La Friterie Frit'Kot 🍟</h4>
      <p class="opacity-75">Assembler tous les concepts du jour dans une mini-application que tout le monde comprend : une commande de friterie — signaux sources, prix dérivés, composants enfants et flux de contrôle déclaratif (<code>@for</code>, <code>@empty</code>).</p>
    </div>
  </div>


---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 00
</div>

# Le Cheminement : D'où venons-nous ?
## L'Entrée dans le Bloc C (Angular Signal-First)

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Comment la POO pure que nous étudions depuis 12 séances devient le moteur d'une interface graphique interactive moderne.
</p>

<!--
Prenez 3 minutes pour replacer cette séance dans la fresque complète de l'année.
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
      <li>Encapsulation & invariants (S5)</li>
      <li>Héritage & réutilisation (S6)</li>
      <li>Polymorphisme dynamique (S7)</li>
      <li>Abstraction & interfaces (S8)</li>
      <li>Composition vs héritage (S9)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-center text-[10px]">
      Architecture & Relations
    </div>
  </div>

  <div class="col-span-4 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-indigo-500 mb-1">BLOC B (S10 à S12)</div>
    <h3 class="font-bold mb-1">Qualité & Maîtrise Mémoire</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Gestion des exceptions typées (S10)</li>
      <li>Principes SOLID : S, O, D (S11)</li>
      <li>Identité, Pile/Tas & Immutabilité (S12)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-center text-[10px]">
      Intégrité & Comportement en mémoire
    </div>
  </div>

  <div class="col-span-4 p-2.5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30">
    <div class="font-mono font-bold text-emerald-500 mb-1">BLOC C (S13 à S15)</div>
    <h3 class="font-bold mb-1">Angular Signal-First</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li><strong>Aujourd'hui : Composants & Signals (S13)</strong></li>
      <li>Services, génériques & DI (S14)</li>
      <li>Signal Forms & routing (S15)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-center text-[10px]">
      Application directe du modèle objet
    </div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1.5">
    <span>💡</span> La grande question de tout système interactif
  </div>
  <p class="opacity-85">
    <em>« Comment lier l'état interne d'un objet métier à l'interface visuelle sans gaspiller de cycles processeur, sans synchronisation manuelle et sans risque d'incohérence ? »</em>
  </p>
</div>

<!--
Expliquez aux étudiants :
En S5, on cachait les attributs pour protéger les données.
En S12, on a vu que l'ordinateur stocke les objets dans le Tas et compare leurs adresses.
Aujourd'hui, nous découvrons comment informer l'écran dès qu'une donnée change !
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 01
</div>

# La Révolution Réactive : Pourquoi les Signals ?

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Pourquoi les frameworks modernes abandonnent Zone.js et le Dirty Checking pour réinventer la mise à jour graphique.
</p>

<!--
Cette première partie pose le "pourquoi".
Sans comprendre la souffrance de l'ancien monde, on ne peut pas apprécier la beauté des Signals.
-->

---
layout: two-cols-header
---

# L'Ancien Monde : Dirty Checking & Zone.js

Dans les versions patrimoniales d'Angular (2 à 15), la détection de changements fonctionnait par surveillance globale :

::left::

<div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
  <div class="font-bold text-rose-600 dark:text-rose-400 text-sm">
    🕵️ Le "Monkey Patching" de Zone.js
  </div>
  <p class="opacity-85 leading-relaxed">
    Zone.js intercepte en sous-main toutes les APIs asynchrones du navigateur :
  </p>
  <ul class="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
    <li><code>setTimeout</code>, <code>setInterval</code></li>
    <li><code>Promise.then</code>, <code>fetch</code></li>
    <li><code>addEventListener('click', ...)</code></li>
  </ul>
  <p class="opacity-85 leading-relaxed">
    Dès qu'un clic ou un timer survient, Zone.js crie : <em>« Quelque chose a peut-être changé dans la mémoire ! »</em>.
  </p>
</div>

::right::

<div class="ms-2 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs space-y-2">
  <div class="font-bold text-slate-700 dark:text-slate-200 text-sm">
    💥 Le Parcours d'Arbre Aveugle
  </div>
  <p class="opacity-85 leading-relaxed">
    Ne sachant pas <strong>où</strong> la modification a eu lieu, Angular scanne l'arbre entier du haut vers le bas :
  </p>
  <div class="p-2 rounded bg-slate-900 text-slate-200 font-mono text-[10.5px]">
    [Racine App] ⬇<br>
    &nbsp;&nbsp;├── [Header] (Vérifié inutilement)<br>
    &nbsp;&nbsp;└── [Page] ⬇<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [Menu] (Vérifié inutilement)<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [Compteur] ➔ (Mis à jour !)
  </div>
  <div class="text-rose-600 dark:text-rose-400 font-bold">
    ➔ 99% des vérifications étaient du gaspillage processeur pur !
  </div>
</div>

<!--
Posez la question : "Si vous changez le volume de votre autoradio, devez-vous vérifier la pression des 4 pneus et le niveau d'huile ?"
C'est pourtant ce que faisait l'ancien système !
-->

---
layout: two-cols-header
---

# Le Nouveau Monde : Réactivité Fine & Zoneless

Angular 22 adopte un **Graphe Orienté Acyclique (DAG)** de dépendances directes :

::left::

<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
    🎯 La Mise à Jour Atomique (Fine-Grained)
  </div>
  <p class="opacity-85 leading-relaxed">
    Un Signal sait exactement qui le consomme (un paragraphe HTML précis, un calcul dérivé).
  </p>
  <ul class="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
    <li><strong>À la lecture</strong> : le signal note qui lit sa valeur.</li>
    <li><strong>À l'écriture</strong> : il réveille directement et uniquement ce nœud de DOM !</li>
  </ul>
  <div class="p-2 rounded bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300">
    ⚡ Aucun parcours d'arbre. Les autres composants restent endormis !
  </div>
</div>

::right::

<div class="ms-2 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs space-y-2">
  <div class="font-bold text-slate-700 dark:text-slate-200 text-sm">
    🚀 Les Gains de l'Architecture Zoneless
  </div>
  <div class="space-y-1.5">
    <div class="p-2 rounded bg-slate-500/10">
      <strong class="text-blue-500">1. Bundle allégé :</strong><br>
      Zone.js est retiré du binaire final (0 ko de surcoût).
    </div>
    <div class="p-2 rounded bg-slate-500/10">
      <strong class="text-indigo-500">2. Stack traces claires :</strong><br>
      Les erreurs affichent des piles d'appels natives lisibles, sans intercepteurs obscurs.
    </div>
    <div class="p-2 rounded bg-slate-500/10">
      <strong class="text-purple-500">3. async/await natif :</strong><br>
      Plus aucun besoin de polyfill pour les coroutines ECMAScript modernes.
    </div>
  </div>
</div>

<!--
Expliquez la précision chirurgicale :
On ne repeint pas tout le mur de la maison quand on change un cadre, on change juste le cadre.
-->

---
layout: default
---

# Les Deux Analogies pour Tout Comprendre

Pour ancrer définitivement ce changement d'architecture dans votre esprit :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1.5">
      <span>🚉</span> 1. L'Analogie de la Gare Centrale
    </div>
    <ul class="space-y-2 opacity-85 leading-relaxed">
      <li><strong>Ancien modèle (Zone.js) :</strong> Un train arrive. Un employé doit courir le long des 24 voies pour inspecter chaque panneau en bois un par un, juste pour voir que seule la voie 4 a changé.</li>
      <li><strong>Nouveau modèle (Signals) :</strong> Chaque quai est relié par câble optique au grand panneau d'affichage numérique. Le capteur de la voie 4 commute ➔ Seules les LED de la voie 4 s'allument instantanément. Les 23 autres voies restent au repos.</li>
    </ul>
    <div class="mt-2.5 p-1.5 rounded bg-blue-500/15 font-semibold text-blue-700 dark:text-blue-300 text-center">
      👉 Notification directe de la source vers l'afficheur.
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
    <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1.5 flex items-center gap-1.5">
      <span>📊</span> 2. L'Analogie du Tableur Excel
    </div>
    <ul class="space-y-2 opacity-85 leading-relaxed">
      <li>La cellule <strong>A1</strong> contient la valeur brute <code>10</code> (c'est un <code>signal</code>).</li>
      <li>La cellule <strong>B1</strong> contient la formule <code>= A1 * 2</code> (c'est un <code>computed</code>).</li>
      <li>Si vous modifiez <strong>A1</strong> pour <code>25</code>, Excel ne recalcule pas les 10 000 autres cellules de la feuille ! Il recalcule immédiatement <strong>B1</strong>, car il connaît le lien de dépendance.</li>
    </ul>
    <div class="mt-2.5 p-1.5 rounded bg-purple-500/15 font-semibold text-purple-700 dark:text-purple-300 text-center">
      👉 Évaluation sur demande, automatique et sans effort.
    </div>
  </div>
</div>

<!--
L'analogie d'Excel est fondamentale pour les étudiants :
Tout le monde a déjà utilisé un tableur. C'est exactement le fonctionnement d'un Signal et d'un Computed !
-->

---
layout: default
---

## Tableau comparatif : Zone.js vs Angular Signals

<div class="mt-3 text-xs">

| Critère d'ingénierie | Approche patrimoniale (Zone.js / Dirty Checking) | Approche moderne (Signals / Signal-First) |
|---|---|---|
| **Granularité de détection** | Composant / Arborescence complète de l'application. | **Atomique / Nœud de DOM ciblé** (*Fine-Grained*). |
| **Mécanisme sous-jacent** | Interception des APIs asynchrones (*monkey patching*). | **Graphe de dépendances dynamique orienté (DAG)**. |
| **Moment du calcul** | À chaque tick asynchrone (clic, timer, requête HTTP). | **Sur demande (*Pull*) lors de la lecture, notifié (*Push*) à l'écriture**. |
| **Performance d'exécution** | Dégradée sur les grands arbres de composants complexes. | **Optimale et constante**, indépendante de la taille de l'arbre. |
| **Poids du bundle (*Footprint*)** | Poids additionnel de la librairie Zone.js (~30-40 ko). | **0 ko additionnel** (architecture Zoneless native dans Angular 22). |
| **Débogage & Diagnostic** | Piles d'appels obscurcies par les intercepteurs Zone.js. | **Piles d'appels natives et transparentes**, `async/await` natif standard. |

</div>


<!--
Ce tableau synthétise le pourquoi technique.
Faites remarquer la ligne "Moment du calcul" : on ne calcule plus si personne ne regarde !
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 02
</div>

# Les Primitives Réactives Fondamentales
## `signal<T>()`, `computed<T>()` & `effect()`

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Le triptyque réactif d'Angular 22 : de la source mutable au calcul dérivé pur jusqu'à la gestion contrôlée des effets de bord.
</p>

<!--
Nous entrons dans le code et les 3 fonctions fondamentales fournies par @angular/core.
-->

---
layout: default
---

# Le Triptyque Réactif d'Angular 22

Toute la réactivité repose sur trois rôles clairs et non interchangeables :

<div class="grid grid-cols-3 gap-3.5 mt-5 text-xs">
  <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
      <span>1️⃣</span> Le Producteur d'État
    </div>
    <div class="font-mono text-sm font-bold text-blue-500 mb-2">signal&lt;T&gt;()</div>
    <p class="opacity-80 leading-relaxed mb-2">
      Conteneur mutable représentant la <strong>source de vérité primaire</strong>.
    </p>
    <ul class="list-disc list-inside opacity-75 space-y-1">
      <li>Valeur initiale requise</li>
      <li>Lecture : <code>valeur()</code></li>
      <li>Écriture : <code>.set()</code> / <code>.update()</code></li>
    </ul>
  </div>

  <div class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
      <span>2️⃣</span> La Projection Pure
    </div>
    <div class="font-mono text-sm font-bold text-purple-500 mb-2">computed&lt;T&gt;()</div>
    <p class="opacity-80 leading-relaxed mb-2">
      État dérivé calculé à partir d'autres signaux. <strong>Paresseux et mémorisé</strong>.
    </p>
    <ul class="list-disc list-inside opacity-75 space-y-1">
      <li>Fonction pure en argument</li>
      <li>Lecture seule (Readonly)</li>
      <li>Aucun effet secondaire autorisé</li>
    </ul>
  </div>

  <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <div class="font-bold text-sm text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
      <span>3️⃣</span> L'Effet de Bord
    </div>
    <div class="font-mono text-sm font-bold text-amber-500 mb-2">effect()</div>
    <p class="opacity-80 leading-relaxed mb-2">
      Consommateur terminal exécuté automatiquement lors des changements d'état.
    </p>
    <ul class="list-disc list-inside opacity-75 space-y-1">
      <li>Contexte d'injection obligatoire</li>
      <li>Écriture dans un signal interdite</li>
      <li>Idéal pour Web Storage & logs</li>
    </ul>
  </div>
</div>


<!--
Insistez sur la flèche :
La donnée part de la source (signal), est projetée (computed), puis consommée (effect / template).
Le flux est strictement unidirectionnel.
-->

---
layout: default
---


## Le Signal Source : Déclaration & Lecture

Comment instancier une cellule d'état réactive :

<div class="grid grid-cols-3 gap-4 mt-0">

<div class="col-span-2">

```ts
import { signal, WritableSignal } from '@angular/core';

// 1. Types primitifs :
const score: WritableSignal<number> = signal<number>(0);
const prenom = signal<string>('Alexandre');
const actif = signal<boolean>(true);

// 2. Types objets et collections :
const notes = signal<number[]>([15, 18, 12]);

// 📖 LECTURE DE LA VALEUR :
// On invoque le signal comme une fonction sans argument !
console.log(score());  // 0
console.log(prenom()); // "Alexandre"
console.log(notes());  // [15, 18, 12]
```

<div class="mt-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-700 dark:text-blue-300">
  👉 Dans le template HTML : <code v-pre>&lt;p&gt;{{ prenom() }}&lt;/p&gt;</code> (ne jamais oublier les parenthèses !)
</div>

</div>

<div class="col-span-1 space-y-2.5 text-xs pt-1">

<div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
    <span>🔬</span> Pourquoi une fonction <code>()</code> et pas une simple variable ?
  </div>
  <p class="opacity-80 leading-relaxed">
    Lorsque JavaScript exécute <code>score()</code>, le moteur d'Angular inspecte le contexte actif d'exécution.
  </p>
  <p class="opacity-80 leading-relaxed mt-1">
    Si un template ou un calcul est en train de s'exécuter, Angular l'inscrit silencieusement dans la liste des <strong>abonnés</strong> de <code>score</code>.
  </p>
  <div class="mt-2 text-indigo-600 dark:text-indigo-400 font-bold">
    L'appel fonctionnel est l'hameçon invisible qui tisse le graphe réactif !
  </div>
</div>

<div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-medium">
  ⚠️ Si vous écrivez <code>prenom</code> sans <code>()</code>, vous manipulez l'objet fonction, pas sa valeur !
</div>

</div>

</div>

<style>
  pre code {
    font-size : 10px !important;
  }
</style>

<!--
Montrez bien l'analogie de l'hameçon :
Quand on appelle (), on "mord à l'hameçon" du signal, et le signal retient qui a appelé.
-->

---

## Mutation d'État : `.set()` vs `.update()`

Pour modifier la valeur d'un `WritableSignal`, deux méthodes strictes s'offrent à nous :

<div class="grid grid-cols-2 gap-4 mt-4">

<div>

#### 1. Le Remplacement Unilatéral : `.set()`
Utilisé quand la nouvelle valeur est autonome et ne dépend pas de l'ancienne valeur.

```ts
const score = signal<number>(0);

// Écrase la valeur sans se soucier du passé :
score.set(50);
console.log(score()); // 50

score.set(100);
console.log(score()); // 100
```

<div class="mt-2 p-2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 text-[11px] font-semibold">
  Cas typiques : Réinitialiser un formulaire, injecter des données reçues d'une API HTTP, vider un champ.
</div>

</div>

<div>

#### 2. La Transition Fonctionnelle : `.update()`
Utilisé quand la nouvelle valeur est calculée à partir de la valeur courante.

```ts
const score = signal<number>(0);

// Reçoit la valeur actuelle et retourne la nouvelle :
score.update((valeurActuelle: number) => {
  return valeurActuelle + 1;
});

// Syntaxe fléchée concise :
score.update(n => n + 10);
console.log(score()); // 11
```

<div class="mt-2 p-2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[11px] font-semibold">
  Cas typiques : Incrémenter un compteur, ajouter un élément à une liste, inverser un booléen.
</div>

</div>

</div>

<!--
Comparez .set() et .update() :
.set() c'est "mets ceci dedans".
.update() c'est "prends ce qu'il y a dedans, transforme-le, et remets le résultat".
-->

---

# Rappel de la Séance 12 : L'Immutabilité !

Pourquoi `panier().push(...)` casse-t-il la réactivité des signaux ?

<div class="grid grid-cols-2 gap-4 mt-4">

<div>

```ts
// ❌ ANTI-PATTERN MAJEUR : Muter en place dans le Tas
const panier = signal<string[]>(['Pomme', 'Poire']);

// On modifie directement le tableau à l'adresse 0x10A !
panier().push('Orange'); 

// On tente de notifier le signal :
panier.set(panier());

// Que fait Angular ?
// Object.is(0x10A, 0x10A) ➔ TRUE !
// Angular déduit que rien n'a changé en mémoire.
// Le template HTML RESTE ENTIÈREMENT FIGÉ !
```

<div class="mt-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs text-center">
  💥 Même adresse mémoire ➔ Aucun rafraîchissement d'écran !
</div>

</div>

<div>

```ts
// ✅ BONNE PRATIQUE : Nouvelle référence dans le Tas
const panier = signal<string[]>(['Pomme', 'Poire']);

// L'opérateur spread [...] alloue une nouvelle adresse 0x20B :
panier.update(anciensFruits => [...anciensFruits, 'Orange']);

// ⚡ Que fait Angular ?
// Object.is(0x10A, 0x20B) ➔ FALSE !
// Angular détecte immédiatement la nouvelle référence.
// Le template HTML s'actualise instantanément !
```

<div class="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs text-center">
  🎉 Nouvelle référence mémoire ➔ Réactivité déclenchée !
</div>

</div>

</div>

<style>
  pre code {
    font-size : 10px !important;
  }
</style>

<!--
Rappelez la séance 12 sur Pile et Tas :
Angular teste Object.is(ancienneReference, nouvelleReference).
Si vous mutez l'objet sur place, l'adresse dans la Pile ne change pas, donc Angular ne voit rien.
-->

---

# L'État Dérivé Mémorisé : `computed<T>()`

Un signal calculé représente une projection mathématique dépendant d'autres signaux :

<div class="grid grid-cols-3 gap-4 mt-4">

<div class="col-span-2">

```ts
import { signal, computed, Signal } from '@angular/core';

const prixHorsTva = signal<number>(100);
const tauxTva = signal<number>(0.21); // 21%

// Signal dérivé automatique :
const prixTTC: Signal<number> = computed(() => {
  return prixHorsTva() * (1 + tauxTva());
});

console.log(prixTTC()); // 121 €

// Si la source évolue :
prixHorsTva.set(200);
console.log(prixTTC()); // 242 € (Mis à jour automatiquement !)
```

<div class="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold text-center">
  prixTTC est en lecture seule absolue : pas de .set() ou .update() !
</div>

</div>

<div class="col-span-1 space-y-2 text-xs pt-1">

<div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
  <strong class="text-blue-500">1. Évaluation Paresseuse (*Lazy*) :</strong><br>
  Le calcul ne tourne <strong>pas</strong> à sa déclaration. Il ne s'exécute que lorsqu'un consommateur lit <code>prixTTC()</code> pour la 1ère fois.
</div>

<div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
  <strong class="text-purple-500">2. Mémorisation en Cache (*Memoization*) :</strong><br>
  Si ni <code>prixHorsTva</code> ni <code>tauxTva</code> n'ont changé, lire <code>prixTTC()</code> 1 000 fois dans le template ne recalcule <strong>rien</strong> : le résultat en cache est renvoyé directement !
</div>

<div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
  <strong class="text-amber-600 dark:text-amber-400">3. Règle de pureté absolue :</strong><br>
  La fonction passée à <code>computed()</code> doit être <strong>pure</strong> : aucun appel HTTP, aucune écriture dans un autre signal !
</div>

</div>

</div>

<style>
  pre code {
    font-size : 10px !important;
  }
</style>

<!--
Expliquez la memoization :
Si vous demandez 10 fois à un collègue combien font 100 * 1.21, il ne refait pas le calcul sur sa calculette après la première fois, il vous redonne sa réponse de mémoire.
-->


---
layout: default
---

# 2.3 Les Effets de Bord Contrôlés : `effect()`

Un `effect()` est une opération réactive exécutée chaque fois qu'un signal lu à l'intérieur est modifié :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-audit-connexion',
  standalone: true,
  template: `<p>Utilisateur : {{ login() }}</p>`
})
export class AuditConnexionComponent {
  login = signal<string>('invité');

  constructor() {
    // 🎯 Déclaration dans le CONTEXTE D'INJECTION :
    effect(() => {
      console.log(`[AUDIT] Connexion : ${this.login()}`);
      // S'exécute au démarrage puis à chaque modification de login() !
    });
  }
}
```

</div>

<div class="col-span-1 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">Le Contexte d'Injection :</strong><br>
    Un effet doit surveiller le cycle de vie du composant. Pour pouvoir se détruire automatiquement quand le composant quitte l'écran, il doit être créé dans le <code>constructor()</code> ou à l'initialisation d'un champ.
  </div>

  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">⚠️ Erreur fréquente :</strong><br>
    Créer un effet dans une méthode ordinaire (ex: gestionnaire de clic) déclenche :<br>
    <code>NG0203: effect() can only be used within an injection context</code>.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Nettoyage automatique :</strong><br>
    Aucun risque de fuite mémoire : à la destruction du composant, l'effet est débranché.
  </div>
</div>
</div>

<style>
  pre code {
    font-size : 10px !important;
  }
</style>

<!--
Soulignez l'importance du constructeur.
Les étudiants essaient souvent de mettre des effect() dans les méthodes onSave() ou onClick(). C'est interdit !
-->

---
layout: default
---

# Piège & Cas d'Usage Légitimes de `effect()`

Comprendre quand utiliser un effet — et quand le bannir absolument :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

### L'Anti-Pattern : Synchroniser deux signaux

```ts
// ❌ NE FAITES JAMAIS CELA !
const quantite = signal<number>(2);
const prix = signal<number>(50);
const total = signal<number>(0);

effect(() => {
  // 💥 Tentative d'écriture dans un signal depuis un effet :
  total.set(quantite() * prix()); 
  // Erreur Angular : NG0600 (Writing to signals forbidden) !
});

// ✅ LA SEULE BONNE PRATIQUE : computed()
const totalPropre = computed(() => quantite() * prix());
```

<div class="mt-2 p-2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold text-center">
  Angular bloque l'écriture dans les effets pour empêcher les boucles réactives infinies !
</div>

</div>

<div class="col-span-1">

### Les Cas d'Usage Légitimes d'un `effect()`

<div class="space-y-1.5 text-xs">
  <div class="p-2 rounded bg-slate-500/5 border border-slate-500/15">
    <strong>💾 Web Storage :</strong><br>
    Sauvegarder un panier ou des préférences dans <code>localStorage</code> à chaque changement.
  </div>

  <div class="p-2 rounded bg-slate-500/5 border border-slate-500/15">
    <strong>📊 Librairies graphiques tierces :</strong><br>
    Redessiner un graphique Chart.js ou animer une scène Three.js non gérée par Angular.
  </div>

  <div class="p-2 rounded bg-slate-500/5 border border-slate-500/15">
    <strong>🌐 Titre de document & Canvas :</strong><br>
    Mettre à jour <code>document.title</code> ou dessiner dans un élément <code>&lt;canvas&gt;</code>.
  </div>

  <div class="p-2 rounded bg-slate-500/5 border border-slate-500/15">
    <strong>📡 Télémétrie applicative :</strong><br>
    Envoyer un log analytique à un serveur distant.
  </div>
</div>
</div>
</div>

<style>
  pre code {
    font-size : 12px !important;
  }
</style>

<!--
Règle simple à donner aux étudiants :
Si le but est de calculer une nouvelle valeur à afficher dans Angular -> computed() !
Si le but est de parler au monde extérieur (localStorage, console, titre du navigateur) -> effect() !
-->

---
layout: default
---

## Libération de Ressources avec `onCleanup`

Comment stopper proprement des timers ou écouteurs externes lorsqu'un signal change :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts
import { Component, signal, effect } from '@angular/core';

@Component({ ... })
export class MoniteurArticleComponent {
  articleId = signal<number>(101);

  constructor() {
    effect((onCleanup) => {
      const id = this.articleId();
      
      // Lance une tâche asynchrone externe :
      const timer = setInterval(() => {
        console.log(`Polling des stocks pour article #${id}`);
      }, 5000);

      onCleanup(() => {
        clearInterval(timer);
        console.log(`Timer détruit pour article #${id}`);
      });
    });
  }
}
```

</div>

<div class="col-span-1 space-y-3 text-xs pt-1">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">
      Quand s'exécute <code>onCleanup</code> ?
    </div>
    <ul class="list-disc list-inside space-y-1 opacity-80 leading-relaxed">
      <li><strong>Juste avant</strong> la ré-exécution suivante de l'effet (si <code>articleId</code> passe de 101 à 102, le timer de 101 est détruit avant de lancer celui de 102).</li>
      <li><strong>Lors de la destruction</strong> finale du composant lorsque l'utilisateur change de page.</li>
    </ul>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
    🛡️ <strong>Garantie anti-fuite :</strong> Vous évitez les doublons de timers fantômes qui s'accumulent en arrière-plan et ralentissent la machine de l'utilisateur.
  </div>
</div>
</div>

<style>
  pre code {
    font-size : 12px !important;
  }
</style>

<!--
Faites le parallèle avec le mot-clé finally vu en Séance 10 (Gestion des ressources) :
onCleanup assure qu'on ferme toujours la porte derrière soi.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 03
</div>

# Communication Réactive : `input()`, `output()` & `model()`

<p class="opacity-70 text-sm max-w-lg mx-auto">
Échanges entre composants
</p>

<!--
Nous abordons la communication inter-composants.
Rappelez le principe de composition de la Séance 09 : une application est un assemblage de petites briques autonomes.
-->

---
layout: default
---

# L'Évolution des Communications Inter-Composants

Angular 22 unifie toute la communication avec les signaux :

<div class="mt-4 text-xs">

| Rôle architectural | Syntaxe patrimoniale (Angular &lt; 17) | Syntaxe moderne Signal-First (S13) | Avantage clé |
|---|---|---|---|
| **Entrée de données** | `@Input() valeur: number = 0;` | `valeur = input<number>(0);` | Devient un <code>Signal&lt;T&gt;</code> réactif en lecture seule. |
| **Entrée obligatoire** | `@Input({ required: true }) id!: number;` | `id = input.required<number>();` | Erreur de compilation TypeScript immédiate si omis par le parent. |
| **Sortie d'événement** | `@Output() chg = new EventEmitter<string>();` | `chg = output<string>();` | Léger, typé, libéré de la dépendance lourde à RxJS. |
| **Liaison bidirectionnelle** | `@Input() val` + `@Output() valChange` | `val = model<number>(0);` | Une seule primitive synchronisée automatiquement dans les 2 sens ! |

</div>

<div class="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-emerald-500/15 border border-blue-500/30 text-xs text-center font-medium">
  ✨ Plus de décorateurs verbeux, plus de risque d'oublier <code>EventEmitter</code> : tout s'exprime sous forme de fonctions pures fortement typées.
</div>

<!--
Soulignez la simplification :
Au lieu d'apprendre des décorateurs complexes avec des métadonnées, on appelle de simples fonctions TS.
-->

---
layout: default
---

## 3.1 Les Entrées Réactives : `input<T>()`

Une entrée déclarée avec `input()` est un signal en lecture seule (`InputSignal<T>`) :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts
// src/app/indicateur-stock.component.ts
import { Component, input, computed } from '@angular/core';
@Component({
  selector: 'app-indicateur-stock',
  standalone: true,
  template: `
    <div [class]="classeAlerte()">
      Stock disponible : {{ quantite() }} unités
    </div>
  `
})
export class IndicateurStockComponent {
  // 1. Entrée avec valeur par défaut (5) :
  seuilCritique = input<number>(5);
  // 2. Entrée obligatoire :
  quantite = input.required<number>();
  // 3. Calcul dérivé réactif immédiat sans ngOnChanges :
  classeAlerte = computed(() => 
    this.quantite() <= this.seuilCritique() ? 'badge-danger' : 'badge-ok'
  );
}
```

</div>
<div class="col-span-1 space-y-2.5 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400">Consommation dans le parent :</strong>
    <div class="mt-1 p-2 rounded bg-slate-900 font-mono text-[10.5px] text-slate-200">
      &lt;app-indicateur-stock<br>
      &nbsp;&nbsp;[quantite]="stock()"<br>
      &nbsp;&nbsp;[seuilCritique]="10" /&gt;
    </div>
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
    <strong class="text-emerald-600 dark:text-emerald-400">Fin du calvaire de <code>ngOnChanges</code> :</strong><br>
    Dans l'ancien Angular, détecter la modification d'un <code>@Input</code> exigeait d'implémenter le cycle de vie <code>ngOnChanges</code> avec un dictionnaire de changements non typé. Avec <code>input()</code>, on branche simplement un <code>computed()</code> !
  </div>
</div>
</div>

<!--
Montrez la clarté : la propriété dérivée classeAlerte est un computed() qui s'abonne naturellement à quantite() et seuilCritique().
-->

<style>
  pre code {
    font-size : 11px !important;
  }
</style>

---
layout: default
---

# Coercition & Transformation d'Attributs : `transform`

Convertir automatiquement les attributs passés depuis le HTML :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts
import { Component, input, numberAttribute, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-vignette-produit',
  standalone: true,
  template: `
    <p>{{ ref() }} - Promo: {{ promo() }} - {{ tarif() }} €</p>
  `
})
export class VignetteProduitComponent {
  ref = input.required<string>();

  // Convertit automatiquement la chaîne "149.90" en number :
  tarif = input(0, { transform: numberAttribute });

  // Convertit la simple présence de l'attribut HTML en boolean true :
  promo = input(false, { transform: booleanAttribute });
}
```

</div>
<div class="col-span-1 space-y-3 text-xs pt-1">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">
      Dans le template HTML du parent :
    </div>
    <div class="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-200 leading-relaxed">
      &lt;!-- L'attribut promo présent vaut true ! --&gt;<br>
      &lt;!-- Le tarif string "89" devient le number 89 ! --&gt;<br>
      &lt;app-vignette-produit<br>
      &nbsp;&nbsp;ref="ECRAN-4K"<br>
      &nbsp;&nbsp;promo<br>
      &nbsp;&nbsp;tarif="89" /&gt;
    </div>
  </div>

  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300">
    🛡️ <strong>Robustesse de typage :</strong> Le développeur HTML peut écrire des attributs standards sans risquer de casser le code TypeScript avec des erreurs de type <code>string vs number</code>.
  </div>
</div>
</div>

<!--
Les étudiants qui ont déjà écrit du HTML pur adorent cette fonctionnalité :
Écrire simplement <... promo> sans devoir écrire [promo]="true".
-->

<style>
  pre code {
    font-size : 11px !important;
  }
</style>

---
layout: default
---

## 3.2 Les Sorties Réactives : `output<T>()`

Émettre des messages vers le composant parent en toute simplicité :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts
import { Component, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-bouton-action',
  standalone: true,
  template: `
    <button (click)="valider()" class="btn-primary">
      Confirmer la commande
    </button>
  `
})
export class BoutonActionComponent {
  // Déclaration explicite et typée :
  commandeValidee: OutputEmitterRef<string> = output<string>();

  valider(): void {
    // Émission de l'événement vers le parent :
    this.commandeValidee.emit('Commande #9842 validée !');
  }
}
```

</div>
<div class="col-span-1 space-y-3 text-xs pt-1">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">
      Écoute dans le composant parent :
    </div>
    <p class="opacity-80 mb-2">On utilise la syntaxe standard d'écoute d'événement avec parenthèses <code>()</code> :</p>
    <div class="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-200">
      &lt;app-bouton-action<br>
      &nbsp;&nbsp;(commandeValidee)="traiterSucces($event)" /&gt;
    </div>
    <div class="mt-2 text-slate-500 text-[10.5px]">
      <code>$event</code> contient la charge utile émise (ici la chaîne de caractères).
    </div>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
    🚀 <strong>Plus besoin de RxJS EventEmitter :</strong> <code>output()</code> est un émetteur autonome, beaucoup plus léger en mémoire et sans risque d'oubli de désabonnement.
  </div>
</div>
</div>

<!--
Expliquez le contrat : l'enfant ne sait pas ce que le parent fera de l'information.
Il crie "quelque chose s'est passé" avec .emit(), et le parent décide.
-->

<style>
  pre code {
    font-size : 11px !important;
  }
</style>

---
layout: default
---

## 3.3 La Révolution de la Liaison Bidirectionnelle : `model<T>()`

La liaison dans les deux sens (*Two-Way Binding*) sans aucune plomberie manuelle :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts
// ENFANT : src/app/interrupteur.component.ts
import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'app-interrupteur',
  standalone: true,
  template: `
    <button (click)="basculer()">
      État : {{ actif() ? 'MARCHE' : 'ARRÊT' }}
    </button>
  `
})
export class InterrupteurComponent {
  // Déclaration du signal bidirectionnel model() :
  actif: ModelSignal<boolean> = model<boolean>(false);

  basculer(): void {
    // Modifie la valeur locale ET notifie immédiatement le parent !
    this.actif.update(etat => !etat);
  }
}
```

</div>
<div class="col-span-1 space-y-3 text-xs pt-1">
  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">
      PARENT : La boîte à bananes <code>[()]</code>
    </div>
    <div class="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-200 leading-relaxed" v-pre>
      &lt;!-- Liaison directe des deux signaux --&gt;<br>
      &lt;app-interrupteur [(actif)]="moteurAllume" /&gt;<br><br>
      &lt;p&gt;État parent : {{ moteurAllume() }}&lt;/p&gt;
    </div>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
    ✨ <strong>Unification parfaite :</strong><br>
    Autrefois, il fallait créer <code>@Input() actif</code> ET <code>@Output() actifChange = new EventEmitter()</code>.<br>
    Avec <code>model()</code>, une seule ligne de code gère l'entrée, la sortie et la synchronisation continue !
  </div>
</div>
</div>

<!--
Faites sourire les étudiants avec le surnom officiel "la boîte à bananes" pour [()] :
Les crochets [] représentent la boîte, les parenthèses () représentent la banane dedans !
-->

<style>
  pre code {
    font-size : 10px !important;
  }
</style>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 04
</div>

# POO & Signals : Encapsulation, Invariants & Immutabilité
## Les Principes Objets au Cœur de l'Architecture Réactive

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Pourquoi les Signals ne remplacent pas les classes, mais magnifient l'encapsulation et la protection des règles métier.
</p>

<!--
C'est le pont conceptuel clé pour le cours de POO :
Les Signals ne sont pas un substitut à la POO, ils en sont la vitrine réactive.
-->

---
layout: default
---

## L'Encapsulation Stricte : Private Source, Public Readonly

Rappel de la **Séance 05** : Un objet doit toujours être maître de son état interne !

<div class="grid grid-cols-2 gap-4 mt-2">
<div>

```ts
// ❌ ANTI-PATTERN : Violation flagrante de l'encapsulation
export class CompteBancaireComponent {
  // Champ public directement modifiable depuis l'extérieur !
  public solde = signal<number>(1000);
}

// N'importe quel tiers peut exécuter :
// composant.solde.set(-999999);
// 💥 Tous les invariants d'affaires sont anéantis !
```

<div class="mt-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs text-center font-bold">
  Exposer un WritableSignal public détruit l'encapsulation de la POO !
</div>

</div>
<div>

```ts
// ✅ BONNE PRATIQUE : Protection par projection asReadonly()
export class CompteBancaireComponent {
  // 1. Source de vérité STRICTEMENT PRIVÉE :
  private readonly _solde = signal<number>(1000);

  // 2. Vue publique STRICTEMENT EN LECTURE SEULE :
  public readonly solde: Signal<number> = this._solde.asReadonly();

  // 3. Commandes métier contrôlant les invariants (S05 + S10) :
  public deposer(montant: number): void {
    if (montant <= 0) throw new Error("Montant positif requis.");
    this._solde.update(s => s + montant);
  }

  public retirer(montant: number): void {
    if (montant <= 0) throw new Error("Montant positif requis.");
    if (this._solde() - montant < 0) throw new Error("Solde insuffisant.");
    this._solde.update(s => s - montant);
  }
}
```

</div>
</div>

<!--
Faites le lien avec la séance 5 sur les getters / setters et la séance 10 sur les exceptions.
L'extérieur a le droit de lire (solde()), mais pour modifier, il est obligé de passer par deposer() ou retirer().
-->

<style>
  pre code {
    font-size : 11px !important;
  }
</style>

---
layout: default
---

# Schéma Architectural : Le Blindage de l'État

<div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 mt-2 text-xs">
  <div class="grid grid-cols-2 gap-6">
    <div class="space-y-3">
      <div class="font-bold text-sm text-indigo-400 border-b border-slate-800 pb-1">
        🌐 TEMPLATE HTML & COMPOSANTS EXTERNES
      </div>
      <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
        <strong class="text-blue-300">📖 Lecture autorisée :</strong><br>
        <code>solde()</code> renvoie la valeur courante (Readonly).
      </div>
      <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
        <strong class="text-emerald-300">🎮 Commandes métier autorisées :</strong><br>
        Invoquer <code>retirer(50)</code> ou <code>deposer(100)</code>.
      </div>
      <div class="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 font-bold">
        ❌ Écriture directe interdite :<br>
        <code>solde.set(...)</code> est rejeté par TypeScript dès la compilation !
      </div>
    </div>

  <div class="space-y-3">
    <div class="font-bold text-sm text-emerald-400 border-b border-slate-800 pb-1">
      🏰 CŒUR DU COMPOSANT MÉTIER
    </div>
    <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
      <strong class="text-emerald-400">1. Vérification des invariants :</strong><br>
      Validation stricte des montants, levée d'exceptions si solde &lt; 0.
    </div>
    <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
      <strong class="text-emerald-400">2. Mutation atomique :</strong><br>
      <code>_solde.update(actuel => actuel - montant)</code>.
    </div>
    <div class="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800 text-indigo-300 font-bold">
      ⚡ Notification instantanée du DAG :<br>
      Le template et les computed() abonnés sont réveillés chirurgicalement.
    </div>
  </div>
  </div>
</div>

<div class="mt-3 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center text-xs font-semibold text-blue-700 dark:text-blue-300">
  💡 L'état ne peut jamais être corrompu : l'interface reflète toujours une vérité métier validée.
</div>

<!--
Insistez sur la tranquillité d'esprit du développeur :
Personne ne peut corrompre l'état de l'application depuis un bouton ou un script tiers.
-->



---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 05
</div>

# Pièges Fréquents & Anti-Patterns 
## Les 6 erreurs classiques et comment les neutraliser

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Identifier en une seconde les bugs courants pour gagner des heures de diagnostic.
</p>

<!--
Cette section est capitale pour éviter les déconvenues en TP et projet.
Passez en revue chaque erreur avec son symptôme concret.
-->

---
layout: default
---

### Tableau de Diagnostic : Erreurs, Symptômes & Solutions

<div class="mt-2 text-xs">

| Anti-Pattern | Symptôme / Message d'erreur | Diagnostic & Bonne Pratique |
|---|---|---|
| **1. Omission des parenthèses `()` à la lecture** | Le template affiche `function() { ... }` ou `[Function: signal]`. | Un signal est un accesseur fonctionnel : écrivez systématiquement `compteur()` dans le template et `this.compteur()` en TS. |
| **2. Muter les données en place dans le Tas** | `panier().push(article)` : la page refuse de s'actualiser, DOM figé. | `Object.is` ne détecte aucun changement d'adresse. Utilisez `.update(list => [...list, article])` pour fournir une nouvelle référence. |
| **3. Synchroniser des états avec `effect()`** | Boucles infinies d'exécution, plantage du navigateur, erreur `NG0600`. | N'écrivez jamais dans un signal depuis un effet. Utilisez exclusivement `computed()` pour concevoir des états dérivés. |
| **4. Effets de bord dans `computed()`** | Calculs relancés arbitrairement, comportements imprévisibles. | Un `computed()` doit être une fonction mathématique pure (déterministe, sans appel réseau ni altération d'autres variables). |
| **5. Créer un `effect()` hors injection** | Erreur runtime : `NG0203: effect() can only be used within an injection context`. | Appelez `effect()` directement dans le `constructor()` de la classe ou au niveau de l'assignation initiale d'un attribut de classe. |
| **6. Graphes de dépendances circulaires** | Récursion infinie (*Maximum call stack size exceeded*). | Veillez à ce que le flux de données soit strictement unidirectionnel et acyclique (A produit B qui produit C, pas de boucle fermée). |

</div>

<div class="mt-3.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs font-semibold text-amber-700 dark:text-amber-300">
  💡 En cas de doute : demandez-vous toujours <em>« Est-ce un calcul de données (➔ computed) ou une action sur le monde extérieur (➔ effect) ? »</em>
</div>

<!--
Laissez 1 minute aux étudiants pour lire ce tableau.
Ce tableau doit être leur fiche de référence pendant les travaux pratiques.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 06
</div>

# Démonstration Complète : 🍟 Frit'Kot
## La Friterie Réactive

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Une commande de friterie. Chaque concept du jour (signal, computed, effect, input, output, model) y trouve sa place naturelle.
</p>

<!--
Nouvelle démonstration, volontairement plus simple : une friterie.
Aucun étudiant n'a besoin d'explication métier : tout le monde a déjà commandé un cornet de frites.
Le modèle est un simple interface : pas d'invariants, pas de clonage, pas de equals.
Toute l'attention est libérée pour la réactivité, qui est le vrai sujet du jour.
-->

---
layout: default
---

## Étape 1 : Le Modèle — Un Simple Contrat de Données

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts
// src/app/models/article.model.ts
export type Taille = 'MOYENNE' | 'LARGE' | 'XXL';

export interface Article {
  id: number;
  nom: string;           // 'Cornet de frites', 'Burger maison'...
  taille: Taille;
  prixUnitaire: number;  // en euros
  quantite: number;
}

// Fonction pure (S11) : le prix d'une ligne de commande
export function prixLigne(a: Article): number {
  return a.prixUnitaire * a.quantite;
}
```

</div>
<div class="col-span-1 space-y-2.5 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">Un <code>interface</code>, rien de plus :</strong><br>
    Pas de classe avec validation ici : on garde la séance entière pour la réactivité.
  </div>
  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Une fonction pure (S11) :</strong><br>
    <code>prixLigne()</code> ne dépend que de son argument. Elle sera réutilisée telle quelle dans un <code>computed()</code>.
  </div>
</div>
</div>

<!--
Un seul but : que le modèle soit évident en 30 secondes.
prixLigne() est exactement une fonction pure de la séance 11 : même entrée = même sortie, aucun effet de bord.
-->

---
layout: default
---

## Étape 2 : Le Composant Enfant (`ligne-commande.component.ts`)

Une ligne de ticket : elle <strong>reçoit</strong> un article, elle <strong>prévient</strong> d'une suppression, elle <strong>calcule</strong> son prix.

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts {maxHeight:'400px'}
import { Component, input, output, computed } from '@angular/core';
import { Article, prixLigne } from './models/article.model';

@Component({
  selector: 'app-ligne-commande',
  standalone: true,
  template: `
    <div class="ligne">
      <span>{{ article().nom }} · {{ article().taille }}</span>
      <span class="prix">{{ prixTotal() }} €</span>
      <button (click)="suppression.emit(article().id)">🗑️</button>
    </div>
  `
})
export class LigneCommandeComponent {
  // 1. Entrée OBLIGATOIRE : une ligne ne peut pas exister sans article
  article = input.required<Article>();

  // 2. Sortie : l'enfant prévient, il ne décide pas
  suppression = output<number>();

  // 3. Prix dérivé : recalculé tout seul si la quantité change
  prixTotal = computed(() => prixLigne(this.article()));
}
```

</div>
<div class="col-span-1 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400"><code>input.required()</code> :</strong><br>
    Si le parent oublie <code>[article]="..."</code>, TypeScript refuse de compiler. Zéro ticket fantôme.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400"><code>output()</code> :</strong><br>
    L'enfant n'atteint <strong>jamais</strong> la liste lui-même : il crie l'<code>id</code> au comptoir, et le parent décide.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400"><code>computed()</code> :</strong><br>
    Le prix suit la quantité automatiquement — la cellule Excel de tout à l'heure.
  </div>
</div>
</div>

<style>
  pre code {
    font-size : 11px !important;
  }
</style>

<!--
Insistez sur la séparation des rôles :
La ligne est un composant de présentation : elle affiche ce qu'on lui donne et transmet les clics.
C'est le parent qui possède la liste : responsabilité unique (S11) en action.
-->

---
layout: default
---

## Étape 3 : Le Compteur de Quantité — `model<T>()`

Un petit composant réutilisable, piloté dans <strong>les deux sens</strong> sans aucune plomberie :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts {maxHeight:'400px'}
// ENFANT : src/app/compteur.component.ts
import { Component, model, ModelSignal } from '@angular/core';

@Component({
  selector: 'app-compteur',
  standalone: true,
  template: `
    <span class="stepper">
      <button (click)="moins()">−</button>
      {{ quantite() }}
      <button (click)="plus()">＋</button>
    </span>
  `
})
export class CompteurComponent {
  // Signal bidirectionnel : lu ET écrit par l'enfant et le parent
  quantite: ModelSignal<number> = model<number>(1);

  moins(): void {
    if (this.quantite() > 1) this.quantite.update(n => n - 1);
  }

  plus(): void {
    // Met à jour la valeur locale ET notifie le parent, en 1 ligne !
    this.quantite.update(n => n + 1);
  }
}
```

</div>
<div class="col-span-1 space-y-3 text-xs pt-1">
  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">
      PARENT : la boîte à bananes <code v-pre>[()]</code>
    </div>
    <div class="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-200 leading-relaxed">
      &lt;app-compteur [(quantite)]="quantiteChoisie" /&gt;
    </div>
    <p class="opacity-80 leading-relaxed mt-2">
      Le parent modifie <code>quantiteChoisie</code> ➔ l'affichage bouge.<br>
      L'étudiant clique sur <strong>＋</strong> ➔ <code>quantiteChoisie</code> change dans le parent. <strong>Une seule ligne, les deux sens.</strong>
    </p>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
    ✨ <strong>Une seule ligne remplace</strong> le couple historique <code>@Input()</code> + <code>@Output() ...Change</code>.
  </div>
</div>
</div>

<style>
  pre code {
    font-size : 11px !important;
  }
</style>

<!--
Faites sourire la salle avec la "boîte à bananes" : [] est la boîte, () est la banane.
Exercice bonus à annoncer : brancher ce compteur dans la ligne de commande, sans muter le tableau en place !
-->

---
layout: default
---

## Étape 4 : Le Composant Racine (`fritkot.component.ts`)

Une seule source de vérité privée. Tout le reste est dérivé ou immuable :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```ts {maxHeight:'400px'}
import { Component, signal, computed, effect } from '@angular/core';
import { Article, prixLigne } from './models/article.model';

@Component({
  selector: 'app-fritkot',
  standalone: true,
  imports: [LigneCommandeComponent]
})
export class FritkotComponent {
  // 1. LA source de vérité : privée (S05)
  private readonly _commande = signal<Article[]>([
    { id: 1, nom: 'Cornet de frites', taille: 'LARGE',   prixUnitaire: 3.5, quantite: 2 },
    { id: 2, nom: 'Burger maison',    taille: 'MOYENNE', prixUnitaire: 5,   quantite: 1 },
    { id: 3, nom: 'Frikandel XXL',    taille: 'XXL',      prixUnitaire: 2.5, quantite: 3 },
  ]);

  // 2. Vue publique en lecture seule (encapsulation, version légère)
  readonly commande = this._commande.asReadonly();

  // 3. TOUT le reste est DÉRIVÉ (computed) : zéro code de synchronisation
  readonly total = computed(() =>
    this._commande().reduce((somme, a) => somme + prixLigne(a), 0)
  );
  readonly nbArticles = computed(() =>
    this._commande().reduce((somme, a) => somme + a.quantite, 0)
  );

  // 4. Effet de bord : parler au monde extérieur (ici, la sauvegarde)
  constructor() {
    effect(() => {
      localStorage.setItem('fritkot', JSON.stringify(this._commande()));
    });
  }

  // 5. Mutation IMMUABLE (S12) : filter renvoie un NOUVEAU tableau
  supprimer(id: number): void {
    this._commande.update(liste => liste.filter(a => a.id !== id));
  }
}
```

</div>
<div class="col-span-1 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">1 source privée, 1 vue publique :</strong><br>
    Le template lit <code>commande()</code>, mais personne ne peut écrire dedans. L'encapsulation de la S05, en deux lignes.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">2 <code>computed</code> :</strong><br>
    Total et nombre d'articles se recalculent seuls à chaque clic. Aucune synchronisation manuelle.
  </div>

  <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <strong class="text-amber-600 dark:text-amber-400">1 <code>effect</code> :</strong><br>
    Uniquement pour le monde extérieur (localStorage). Jamais pour calculer.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">1 update immuable :</strong><br>
    <code>filter()</code> crée une nouvelle référence ➔ <code>Object.is</code> détecte le changement, l'écran se met à jour (rappel S12).
  </div>
</div>
</div>

<style>
  pre code {
    font-size : 10px !important;
  }
</style>

<!--
Résumez les 5 piliers sur cette slide unique :
1. Source privée
2. Vue readonly
3. Computed dérivés
4. Effect de persistance
5. Update immuable
C'est LE schéma que les étudiants doivent pouvoir reproduire en TP.
-->

---
layout: default
---

## Étape 5 : Le Template Déclaratif (`@for` & `@empty`)

Le template ne fait que lire des signaux et router les événements :

<div class="grid grid-cols-3 gap-4 mt-2">
<div class="col-span-2">

```html
<!-- fritkot.component.ts (template) -->
<h1>🍟 Frit'Kot</h1>
<p>
  {{ nbArticles() }} articles — Total :
  <strong>{{ total() }} €</strong>
</p>

<ul>
  @for (article of commande(); track article.id) {
    <li>
      <app-ligne-commande
        [article]="article"
        (suppression)="supprimer($event)" />
    </li>
  } @empty {
    <li>Votre commande est vide… à table !</li>
  }
</ul>
```

</div>
<div class="col-span-1 space-y-2.5 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400"><code>@for ... track</code> :</strong><br>
    La clé unique <code>article.id</code> évite tout réagencement inutile du DOM. Plus de <code>*ngFor</code>, plus de <code>trackBy</code>.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Le bloc <code>@empty</code> :</strong><br>
    S'affiche automatiquement quand <code>commande()</code> est vide — le fameux état « commande vide », sans <code>*ngIf</code> manuel.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">Lecture = parenthèses :</strong><br>
    <code>total()</code>, pas <code>total</code>. Chaque lecture tisse le graphe réactif.
  </div>
</div>
</div>

<style>
  pre code {
    font-size : 11px !important;
  }
</style>

<!--
Faites lire le template à voix haute : "pour chaque article de commande(), affiche une ligne".
C'est du HTML qui décrit, Angular orchestre.
-->

---
layout: default
---

## Étape 6 : Rendu Visuel de l'Application Frit'Kot

Voici le ticket que produit notre architecture réactive complète :

<div class="max-w-xl mx-auto p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 text-slate-100 shadow-2xl text-xs space-y-3 mt-1">
  <div class="flex items-center justify-between border-b border-slate-800 pb-2">
    <div>
      <h3 class="text-base font-black text-white flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        🍟 Frit'Kot · Commande en direct
      </h3>
      <p class="text-[10px] text-slate-400">Angular 22 · Fine-Grained Signals</p>
    </div>
    <div class="text-right">
      <div class="text-lg font-mono font-black text-amber-400">19,50 €</div>
      <div class="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Total (computed)</div>
    </div>
  </div>

  <!-- Ticket -->
  <div class="space-y-1.5">
    <div class="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
      <div class="flex items-center gap-2">
        <span class="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300">×2</span>
        <span class="text-slate-100 text-xs">Cornet de frites · LARGE</span>
      </div>
      <span class="font-mono text-xs text-amber-300">7,00 €</span>
    </div>

  <div class="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
    <div class="flex items-center gap-2">
      <span class="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300">×1</span>
      <span class="text-slate-100 text-xs">Burger maison · MOYENNE</span>
    </div>
    <span class="font-mono text-xs text-amber-300">5,00 €</span>
  </div>

  <div class="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
    <div class="flex items-center gap-2">
      <span class="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300">×3</span>
      <span class="text-slate-100 text-xs">Frikandel XXL · XXL</span>
    </div>
    <span class="font-mono text-xs text-amber-300">7,50 €</span>
  </div>
  </div>

  <div class="text-[10px] font-mono text-slate-500 text-center pt-1 border-t border-slate-800">
    ⚡ 6 articles · total recalculé à chaque clic · sauvegardé via effect()
  </div>
</div>

<!--
L'étudiant voit le résultat final : un ticket de friterie vivant.
Cliquez sur 🗑️ en direct : la ligne disparaît, le total et le compteur se recalculent seuls, localStorage est mis à jour.
Un seul clic, cinq mécanismes du jour en action. C'est toute la séance sur un écran.
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
  La boîte à outils indispensable pour concevoir des composants réactifs professionnels sous Angular 22.
</p>

<!--
Passons au récapitulatif global de la séance.
-->

---
layout: default
---

### Ce qu'il faut retenir absolument

<div class="mt-2 text-xs">

| Primitive / Mécanisme | Rôle architectural | Modalité d'accès / Syntaxe | Règle d'or associée |
|---|---|---|---|
| **`signal<T>(valeur)`** | Cellule d'état primaire en lecture / écriture. | Lecture : `val()`<br>Écriture : `.set(v)` ou `.update(fn)` | Toujours préserver l'immutabilité lors de la mise à jour d'objets ou tableaux. |
| **`computed<T>(fn)`** | Projection d'état dérivée pure et mémorisée. | Lecture : `val()` (Readonly) | Doit être une fonction mathématique pure : aucun effet secondaire à l'intérieur ! |
| **`effect(fn)`** | Consommateur terminal d'effets de bord. | Instanciation dans `constructor()` | Réservé aux logs, Web Storage et APIs DOM tierces ; interdit pour synchroniser des signaux. |
| **`input<T>()`** | Entrée de composant réactive en lecture seule. | `val = input()` ou `input.required()` | Remplace définitivement `@Input()`. Accepte des fonctions de conversion `transform`. |
| **`output<T>()`** | Émetteur d'événements vers le composant parent. | `val = output()`, appel : `val.emit(v)` | Remplace `@Output()` et RxJS `EventEmitter`. Plus léger et sans dépendance externe. |
| **`model<T>()`** | Liaison bidirectionnelle unifiée (*Two-Way Binding*). | `val = model()`, parent : `[(val)]="etat"` | Remplace le couple fastidieux `@Input() / @Output()Change`. |

</div>

<!--
Faites lire la règle d'or par un étudiant.
Elle résume toute la philosophie Signal-First.
-->

---
layout: default
---

# 🚀 Clôture de la séance & Pont vers la Séance 14

Vous venez de franchir une étape déterminante dans la maîtrise des architectures réactives modernes !

<div class="p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 mb-4 text-xs">
  <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-0.5">Le Début du Bloc C est validé !</div>
  <p class="opacity-85">
    Vous comprenez l'abandon de Zone.js, vous maîtrisez le triptyque <code>signal / computed / effect</code>, et vous savez faire communiquer des composants avec <code>input / output / model</code>.
  </p>
</div>

<div class="mt-2 text-xs">
  <div class="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2">
    ⚠️ La limite actuelle : Où stocker la logique métier ?
  </div>

</div>

<div class="grid grid-cols-3 gap-3 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400 text-sm mb-1 block">Services Injectables</strong>
    <p class="opacity-75">Extraire l'état et les signaux dans des classes dédiées avec <code>@Injectable({ providedIn: 'root' })</code>.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400 text-sm mb-1 block">Fonction `inject()`</strong>
    <p class="opacity-75">Appliquer l'Inversion de Dépendance (DIP, S11) avec l'API d'injection moderne d'Angular.</p>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-slate-500/15">
    <strong class="text-emerald-600 dark:text-emerald-400 text-sm mb-1 block">Génériques TypeScript</strong>
    <p class="opacity-75">Concevoir des <code v-pre>Repository&lt;T&gt;</code> génériques réutilisables pour toutes vos entités métier !</p>
  </div>
</div>

<!--
Donnez rendez-vous pour la séance 14 :
Nous allons appliquer le SRP et le DIP de la séance 11 en déplaçant toute la logique de nos composants vers de vrais services injectables !
-->