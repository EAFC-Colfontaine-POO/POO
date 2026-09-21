---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Séance 5 — L'Encapsulation & les Invariants de Classe
---

<div class="h-full flex flex-col justify-center items-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
    Programmation Orientée Objet · EAFC
  </div>

  <h1 class="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
    Séance 5 — L'Encapsulation
  </h1>

  <p class="text-base opacity-80 max-w-xl mx-auto mb-5 font-medium">
    Mémoire · Protection de l'état · Invariants · Visibilité · Mécanismes statiques
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono opacity-60">
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">TypeScript</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">POO Fondations</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Modèle Mémoire</span>
  </div>
</div>

<!--
Bienvenue dans cette séance consacrée au pilier fondateur de la POO : l'encapsulation.
Aujourd'hui, nous n'allons pas simplement apprendre des mots-clés de syntaxe (private, public, get, set).
Nous allons comprendre POURQUOI nous en avons besoin pour éviter que nos programmes ne deviennent incontrôlables.
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques

<div class="grid grid-cols-2 gap-3 mt-4">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">Le modèle mémoire</h3>
      <p class="text-xs opacity-75">Distinguer pile (*stack*) et tas (*heap*), comprendre les références et éviter le piège de l'aliasing.</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">Pourquoi l'encapsulation ?</h3>
      <p class="text-xs opacity-75">Comprendre le danger de l'accès direct et définir les <strong>invariants de classe</strong> (la cohérence métier).</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">Visibilité & Accesseurs</h3>
      <p class="text-xs opacity-75">Maîtriser <code>private</code>/<code>public</code>, la syntaxe concise TypeScript et le bon usage des getters/setters.</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">Mécanismes complémentaires</h3>
      <p class="text-xs opacity-75">Comprendre <code>static</code>, surmonter la limite du constructeur unique avec les fabriques, et explorer les énumérations.</p>
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 text-center">
  💡 <strong>Fil conducteur</strong> : Partir de la machine physique pour concevoir des objets fiables et protégés contre les erreurs.
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 01
</div>

# Du matériel au code : La mémoire & les objets

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Pourquoi les objets ne se comportent-ils pas comme des nombres ? Comprendre les références pour éviter les bugs invisibles.
</p>

<!--
Avant de parler d'encapsulation, il faut comprendre le terrain sur lequel nous jouons : la mémoire vive (RAM).
Sans cette compréhension, la POO ressemble à de la magie noire ou à des contraintes arbitraires.
-->

---
layout: two-cols-header
---

# Une variable primitive en mémoire

::left::

```ts
let age = 25;
let autre = age;

autre = 30;

console.log(age);   // 25 (inchangé !)
console.log(autre); // 30
```

<div class="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <strong>Passage par valeur</strong> : Modifier <code>autre</code> ne touche pas <code>age</code>. Deux cases mémoires distinctes.
</div>

::right::

<div class=" ms-2 p-3 text-xs space-y-1">
  <div class="font-bold text-sm text-blue-600 dark:text-blue-400">📦 Types primitifs (Pile / Stack)</div>
  <p class="opacity-80">La variable est une <strong>étiquette</strong> collée sur une <strong>case mémoire</strong> de taille fixe dans la pile.</p>
  <p class="opacity-80">L'affectation <code>let autre = age</code> crée une <strong>copie indépendante</strong> de la valeur.</p>
</div>

<div class="ms-2 mt-3 p-3 text-xs">
  <strong>Analogie</strong> : Écrire une recette sur un post-it et la photocopier pour un ami. S'il rature sa copie, votre original reste intact.
</div>

<!--
Question aux étudiants : "Quand je fais autre = age, reste-t-il un lien entre les deux variables ?"
Réponse : Non, la pile alloue un nouvel espace et y duplique les octets. Fin de l'histoire.
-->

---
layout: two-cols-header
---

# Les objets et le Tas (*Heap*)

::left::

```ts
let joueur = { nom: 'Alice', score: 100 };
```

<div class="mt-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
  <div class="font-bold text-blue-600 dark:text-blue-400">🔑 La variable ne contient PAS l'objet !</div>
  <p class="opacity-80">
    Elle contient seulement <strong>l'adresse mémoire</strong> (une référence) pointant vers l'objet situé dans le tas.
  </p>
</div>

<div class="grid grid-cols-2 gap-2 mt-2 text-xs font-mono">
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
    Pile : <code>0x7FFE...</code>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
    Tas : <code>{ nom, score }</code>
  </div>
</div>

::right::

<div class="p-3.5 ms-2 text-xs space-y-2">
  <div class="font-bold text-sm text-purple-600 dark:text-purple-400">🏢 Pourquoi stocker dans le Tas ?</div>
  <p class="opacity-80">
    Un objet a une taille variable et potentiellement très grande. Il ne loge pas dans les petites cases rigides de la pile.
  </p>
  <p class="opacity-80">
    Le <strong>Tas (*Heap*)</strong> est un grand espace de stockage dynamique où les objets peuvent grandir librement.
  </p>
  <div class="pt-2 border-t border-slate-500/15 opacity-80">
    <strong>Analogie</strong> : La pile est votre poche. Vous n'y mettez pas un canapé, vous y mettez le ticket de retrait qui indique son emplacement à l'entrepôt !
  </div>
</div>

---
layout: two-cols-header
---

# Le piège de l'effet de bord (*Aliasing*)

::left::

```ts
let joueur1 = { nom: 'Alice', score: 100 };

// ⚠️ On copie L'ADRESSE, pas l'objet !
let joueur2 = joueur1;

joueur2.score = 0;

console.log(joueur1.score); // 💥 Affiche 0 !
```

<div class="mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 text-center font-semibold">
  👉 Modifier <code>joueur2</code> a modifié <code>joueur1</code> à distance, sans prévenir !
</div>

::right::

<div class="m-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <div class="font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
    <span>⚠️</span> Le phénomène d'Aliasing
  </div>
  <p class="opacity-80">
    <code>joueur1</code> et <code>joueur2</code> pointent vers <strong>le même bloc mémoire</strong>. Ils partagent le même état interne.
  </p>
</div>

<div class="m-2.5 p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
  <div class="font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
    <span>📺</span> L'analogie des télécommandes
  </div>
  <p class="opacity-80">
    Il n'y a qu'<strong>une seule télévision</strong> dans la pièce. <code>joueur1</code> et <code>joueur2</code> sont <strong>deux télécommandes</strong> synchronisées sur le même écran.
  </p>
</div>

<!--
Insister sur ce point :
C'est la source de bug numéro 1 chez les débutants en POO.
Sans encapsulation, n'importe qui avec une référence peut écraser les données.
-->

---
layout: two-cols-header
---

# Classe = Le plan d'architecte

::left::

```ts
class Compte {
  constructor(
    public numero: string,
    public solde: number
  ) {}
}

// "new" coule le béton pour chaque maison
const c1 = new Compte('BE123', 1000);
const c2 = new Compte('BE456', 500);
```

<div class="mt-3 p-2 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs text-center font-mono">
  <code>c1</code> et <code>c2</code> = 2 adresses mémoires distinctes
</div>

::right::

<div class="ms-2 m-1 p-2 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
  <h3 class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">📐 La classe (Le plan)</h3>
  <p class="opacity-80">
    Définit la forme et les règles. <strong>On ne peut pas habiter dans un plan d'architecte !</strong> Elle existe une seule fois.
  </p>
</div>

<div class="mt-2.5 ms-2 p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
  <h3 class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1">🏡 L'instance (`new` = Le chantier)</h3>
  <p class="opacity-80">
    <code>new</code> alloue un <strong>nouveau bloc mémoire</strong> dans le tas. Chaque maison a ses propres murs et ses propres pièces.
  </p>
</div>

---
layout: two-cols-header
---

# Mémoire d'instance vs Mémoire de classe

::left::

```ts
class Compte {
  // Instance : propre à chaque maison
  public solde: number = 0;

  // Classe : partagé au bureau d'études
  static tauxEpargne = 0.02;

  static reglement() {
    console.log("Banque EAFC - Règlement");
  }
}

const c1 = new Compte();
const c2 = new Compte();
```

::right::

<div class="mt-1 ms-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <strong class="text-blue-600 dark:text-blue-400 text-sm">Membres d'instance (`solde`)</strong>
  <p class="opacity-80 mt-1">
    Dupliqués pour chaque objet créé avec <code>new</code>. Accessible via l'instance : <code>c1.solde</code>.
  </p>
</div>

<div class="ms-2 mt-2.5 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <strong class="text-purple-600 dark:text-purple-400 text-sm">Membres de classe (`static`)</strong>
  <p class="opacity-80 mt-1">
    Existe en <strong>un seul exemplaire</strong> pour tout le programme. Accessible via la classe : <code>Compte.tauxEpargne</code>.
  </p>
</div>

---
layout: default
---

# Mémoire d'instance vs Mémoire de classe : Synthèse

<div class="mt-3">

| Critère | Mémoire d'instance | Mémoire de classe (`static`) |
|---|---|---|
| **Quand naît-il ?** | À chaque appel de `new` | Au chargement de la classe en mémoire |
| **Combien d'exemplaires ?** | Un par objet créé (autant que de maisons) | **Un seul**, partagé par tout le programme |
| **Comment y accéder ?** | Via la référence de l'instance (`c1.solde`) | Via le nom de la classe (`Compte.tauxEpargne`) |
| **Accès à `this` ?** | ✅ Oui (`this` = l'instance courante) | ❌ Non (`this` n'a pas de sens ici) |

</div>

<div class="grid grid-cols-2 gap-3 mt-4 text-xs">
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
    🏡 <strong>Instance</strong> = Données variables propres à chaque entité.
  </div>
  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
    📐 <strong>Static</strong> = Constantes globales ou fonctions utilitaires.
  </div>
</div>

---
layout: two-cols-header
---

# Pourquoi `static` ne peut PAS voir `this` ?

::left::

```ts
class Exemple {
  private solde = 100;

  static afficher() {
    // console.log(this.solde);
    // ❌ ERREUR TypeScript !
  }
}
```

<div class="mt-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-center font-mono">
  Règle : <strong>static</strong> n'a jamais accès à l'instance.
</div>

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <div class="font-bold text-red-600 dark:text-red-400 mb-1">❌ Pourquoi est-ce interdit ?</div>
  <p class="opacity-80 leading-relaxed">
    <code>this</code> représente <strong>l'instance courante</strong>.
    Quand on appelle une méthode statique, aucune maison n'est sélectionnée : on est sur le plan !
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">💡 L'analogie physique</div>
  <p class="opacity-80 leading-relaxed">
    Depuis le bureau de l'architecte, on ne peut pas allumer la lumière du salon : quelle maison viserait-on ? Cela n'a aucun sens physique.
  </p>
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
  PARTIE 02
</div>

# Pourquoi l'Encapsulation ?

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Protéger l'état interne et garantir les invariants métier : comment éviter le chaos dans nos applications.
</p>

<!--
Maintenant que nous savons que les objets vivent dans le tas et sont manipulés par référence,
voyons ce qui se passe si nous laissons tout le monde toucher à tout.
-->

---
layout: two-cols-header
---

# Le scénario catastrophe : sans encapsulation

::left::

```ts
class CompteBancaire {
  public numero: string;
  public solde: number;

  constructor(numero: string, solde: number) {
    this.numero = numero;
    this.solde = solde;
  }
}

const c = new CompteBancaire('BE-01', 500);

// N'importe qui peut tout casser :
c.solde = -999999;
c.solde = NaN;
c.numero = "";
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <code class="text-red-600 dark:text-red-400 font-bold">c.solde = -999999;</code>
  <p class="opacity-80 mt-0.5">Règles bancaires violées sans aucune alerte du compilateur.</p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <code class="text-red-600 dark:text-red-400 font-bold">c.solde = NaN;</code>
  <p class="opacity-80 mt-0.5">Donnée corrompue : les calculs futurs échoueront silencieusement.</p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <code class="text-red-600 dark:text-red-400 font-bold">c.numero = "";</code>
  <p class="opacity-80 mt-0.5">L'identifiant est effacé, l'objet ne représente plus rien de réel.</p>
</div>

<div class="ms-2 mt-1 p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-xs text-center font-semibold">
  💥 L'objet est passif et sans défense.
</div>

---
layout: default
---

# Qu'est-ce que l'Encapsulation ?

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-2xl">📦</span>
    <div>
      <h3 class="font-bold text-sm mb-1">1. Regrouper</h3>
      <p class="text-xs opacity-75">
        Réunir dans une même classe les <strong>données</strong> (état interne) et les <strong>méthodes</strong> qui les manipulent (comportement).
      </p>
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-2xl">🛡️</span>
    <div>
      <h3 class="font-bold text-sm mb-1">2. Protéger (Cordon sanitaire)</h3>
      <p class="text-xs opacity-75">
        <strong>Verrouiller l'accès direct</strong> aux données internes et forcer l'usage de méthodes contrôlées publiques.
      </p>
    </div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 flex items-center justify-between">
  <div class="text-xs">
    <span class="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">Règle fondamentale</span>
    <h3 class="text-sm font-bold mt-0.5">L'état interne est privé. Seule l'interface publique est accessible.</h3>
  </div>
  <span class="text-2xl">🔒</span>
</div>

---
layout: default
---

# La métaphore de la voiture

L'encapsulation, c'est le **capot fermé** d'une voiture.

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
      <span>🎛️</span> Commandes visibles (Interface publique)
    </div>
    <ul class="space-y-1 opacity-85">
      <li>Volant, pédale d'accélérateur, frein</li>
      <li>Tableau de bord, compteur de vitesse</li>
    </ul>
    <div class="mt-2.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
      👉 Commandes ergonomiques et sûres. Impossible de casser le moteur en tournant le volant.
    </div>
  </div>

  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>⚙️</span> Organes cachés (État interne privé)
    </div>
    <ul class="space-y-1 opacity-85">
      <li>Pistons, bougies, injecteurs</li>
      <li>Calculateur électronique (ECU)</li>
    </ul>
    <div class="mt-2.5 text-[11px] font-semibold text-red-700 dark:text-red-300">
      👉 Complexe et fragile : le conducteur ne doit pas y toucher directement !
    </div>
  </div>
</div>

<div class="mt-3 p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-xs text-center">
  Pour accélérer, on appuie sur la <strong>pédale</strong> (méthode publique). On ne verse pas l'essence dans les cylindres avec une pipette !
</div>

---
layout: default
---

# La notion clé : L'Invariant de classe

<div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-0.5">🎯 Qu'est-ce qu'un invariant ?</div>
  <p class="opacity-90 leading-relaxed">
    Une règle métier qui doit être <strong>VRAIE à chaque instant</strong> : à la création de l'objet et après chaque méthode publique.
  </p>
</div>

<div class="grid grid-cols-3 gap-3 mt-3 text-xs">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-blue-600 dark:text-blue-400 mb-0.5">🏦 Compte Bancaire</div>
    <p class="opacity-80"><code>solde &gt;= -decouvertMax</code></p>
    <p class="text-[11px] opacity-60">Le solde ne descend jamais sous le plafond accordé.</p>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">📝 Note d'examen</div>
    <p class="opacity-80"><code>0 &lt;= note &lt;= 20</code></p>
    <p class="text-[11px] opacity-60">Une note négative ou supérieure à 20 est impossible.</p>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-amber-600 dark:text-amber-400 mb-0.5">🌡️ Thermostat</div>
    <p class="opacity-80"><code>5°C &lt;= consigne &lt;= 30°C</code></p>
    <p class="text-[11px] opacity-60">Consigne bornée entre hors-gel et confort max.</p>
  </div>
</div>

<div class="mt-3 p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs text-center font-semibold">
  🛡️ <strong>Rôle de l'encapsulation</strong> : Rendre techniquement impossible la violation d'un invariant.
</div>

---
layout: two-cols-header
---

# Le constructeur : Premier gardien des invariants

::left::

```ts
class Note {
  private _valeur: number;

  constructor(valeurInitiale: number) {
    if (valeurInitiale < 0 || valeurInitiale > 20) {
      throw new Error(
        `Note invalide : ${valeurInitiale}`
      );
    }
    this._valeur = valeurInitiale;
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <code class="text-emerald-600 dark:text-emerald-400 font-bold">const n1 = new Note(15);</code>
  <p class="opacity-80 mt-1">✅ L'invariant est respecté. L'objet est instancié sainement.</p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <code class="text-red-600 dark:text-red-400 font-bold">const n2 = new Note(25);</code>
  <p class="opacity-80 mt-1">❌ Exception levée immédiatement ! Aucun objet corrompu n'est créé en mémoire.</p>
</div>

<div class="ms-2 mt-1 p-2 rounded-lg bg-slate-500/5 border border-slate-500/15 text-xs opacity-80">
  💡 <code>throw new Error()</code> garantit que le reste du programme manipulera toujours des objets valides.
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
  PARTIE 03
</div>

# En Pratique : Visibilité & Accesseurs

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Mettre en place les barrières en TypeScript : modificateurs d'accès, syntaxe concise et bon usage des getters/setters.
</p>

---
layout: default
---

# Les modificateurs d'accès en TypeScript

<div class="grid grid-cols-3 gap-3 mt-4">
  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <div class="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-0.5">public</div>
    <div class="text-[10px] opacity-70 mb-1.5">Visibilité totale (défaut)</div>
    <p class="text-xs opacity-80">Accessible depuis l'intérieur ET depuis l'extérieur de la classe.</p>
    <div class="mt-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 inline-block font-mono">
      compte.deposer()
    </div>
  </div>

  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
    <div class="font-mono font-bold text-sm text-red-600 dark:text-red-400 mb-0.5">private</div>
    <div class="text-[10px] opacity-70 mb-1.5">Secret de fabrication</div>
    <p class="text-xs opacity-80">Accessible <strong>uniquement</strong> depuis le code interne de la classe.</p>
    <div class="mt-2 text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-700 dark:text-red-300 inline-block font-mono">
      this._solde
    </div>
  </div>

  <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <div class="font-mono font-bold text-sm text-amber-600 dark:text-amber-400 mb-0.5">protected</div>
    <div class="text-[10px] opacity-70 mb-1.5">Cercle familial</div>
    <p class="text-xs opacity-80">Accessible dans la classe et ses <em>futures sous-classes</em>.</p>
    <div class="mt-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 inline-block font-mono">
      *Vu avec l'héritage*
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs">
  💡 <strong>Convention</strong> : On préfixe souvent les attributs privés par un tiret bas (<code>_solde</code>) pour libérer le nom propre (<code>solde</code>) pour les getters ou méthodes publiques.
</div>

---
layout: two-cols-header
---

# Syntaxe concise : Parameter Properties

::left::

<div class="text-xs font-bold mb-1 opacity-70">❌ Syntaxe classique verbeuse</div>

```ts
class Compte {
  private _numero: string;
  private _solde: number;

  constructor(numero: string, solde: number) {
    this._numero = numero;
    this._solde = solde;
  }
}
```

::right::

<div class="text-xs font-bold mb-1 text-emerald-600 dark:text-emerald-400">✨ Syntaxe concise TypeScript</div>

```ts
class Compte {
  // Déclaration + assignation auto !
  constructor(
    private _numero: string,
    private _solde: number
  ) {}
}
```

<div class="mt-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <strong>Astuce</strong> : Préfixer un paramètre par <code>private</code> ou <code>public</code> ordonne à TypeScript de générer l'attribut et l'assignation automatiquement.
</div>

---
layout: two-cols-header
---

# Cas pratique : Le Thermostat (État & Invariant)

::left::

```ts
class Thermostat {
  constructor(
    private _temperature: number,
    public readonly piece: string
  ) {
    if (_temperature < 5 || _temperature > 30) {
      throw new Error("Température hors bornes");
    }
  }

  public getTemperature(): number {
    return this._temperature;
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
  <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">Attribut privé : <code>_temperature</code></div>
  <p class="opacity-80">
    Inaccessible depuis l'extérieur. Personne ne peut faire <code>t._temperature = 100</code>.
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
  <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1">Attribut <code>readonly</code> : <code>piece</code></div>
  <p class="opacity-80">
    Visible par tout le monde, mais non modifiable après création.
  </p>
</div>

---
layout: two-cols-header
---

# Cas pratique : Le Thermostat (Méthodes d'action)

::left::

```ts
class Thermostat {
  // ... constructeur et état ...

  public augmenter(delta: number): void {
    if (delta <= 0) {
      console.warn("Delta invalide");
      return;
    }
    if (this._temperature + delta > 30) {
      this._temperature = 30; // Plafond max
      return;
    }
    this._temperature += delta;
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Protection de l'invariant</div>
  <p class="opacity-80">
    La méthode vérifie les bornes avant d'altérer l'état. L'invariant <code>temp &lt;= 30°C</code> ne peut jamais être violé.
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">Intention métier claire</div>
  <p class="opacity-80">
    On demande à l'objet « d'augmenter la température », plutôt que de forcer une valeur brute.
  </p>
</div>

---
layout: two-cols-header
---

# Getters et Setters (`get` / `set`)

::left::

```ts
class Thermostat {
  constructor(private _temp: number) {}

  get temperature(): number {
    return this._temp;
  }

  set temperature(nouvelle: number) {
    if (nouvelle < 5 || nouvelle > 30) {
      throw new Error("Hors bornes [5-30]");
    }
    this._temp = nouvelle;
  }
}
```

::right::

```ts
const t = new Thermostat(19);

t.temperature = 22;        // Exécute le setter !
console.log(t.temperature);// Exécute le getter (22)

// t.temperature = 50;    // 💥 Erreur levée !
```

<div class="mt-2.5 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  Extérieurement, cela ressemble à une variable ordinaire. Intérieurement, une méthode filtre et valide chaque accès.
</div>

---
layout: two-cols-header
---

# Propriété calculée : L'exemple du Rectangle

::left::

```ts
class Rectangle {
  constructor(
    private _largeur: number,
    private _hauteur: number
  ) {}

  get largeur(): number { return this._largeur; }

  // Propriété calculée dynamique :
  get aire(): number {
    return this._largeur * this._hauteur;
  }
}

const r = new Rectangle(5, 10);
console.log(r.aire); // 50
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Toujours synchronisé</div>
  <p class="opacity-80">Pas d'attribut <code>_aire</code> qui risquerait d'être désynchronisé si la largeur change.</p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">Lecture seule par nature</div>
  <p class="opacity-80">Puisqu'il n'y a pas de <code>set aire()</code>, écrire <code>r.aire = 80</code> refuse de compiler.</p>
</div>

---
layout: two-cols-header
---

# ⚠️ Le piège du "Faux Getter/Setter"

::left::

```ts
// ❌ ANTI-PATTERN : Ne sert à rien !
class Compte {
  private _solde: number;

  get solde(): number {
    return this._solde;
  }
  set solde(v: number) {
    this._solde = v; // Zéro contrôle !
  }
}
```

<div class="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-center font-semibold">
  Équivalent à un champ public, avec 6 lignes inutiles !
</div>

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">💡 La bonne pratique métier</div>
  <p class="opacity-80">
    Remplacer les setters aveugles par des méthodes exprimant une intention : <code>deposer(montant)</code>, <code>retirer(montant)</code>.
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-semibold text-center">
  👉 « Don't just get and set, tell the object what to do ! »
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
  PARTIE 04
</div>

# Mécanismes Avancés

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Surmonter les limites du constructeur avec les fabriques statiques, et structurer les constantes avec les énumérations.
</p>

---
layout: two-cols-header
---

# La contrainte : Un seul constructeur !

::left::

```ts
// ❌ Interdit en TypeScript !
class User {
  constructor(name: string) { /* ... */ }

  // Erreur : constructeur dupliqué
  constructor(id: string, name: string) { /* ... */ }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
  <div class="font-bold text-amber-700 dark:text-amber-300 mb-1">Pourquoi cette limitation ?</div>
  <p class="opacity-80">
    En JavaScript, les types s'effacent à l'exécution : seul un unique constructeur peut exister dans le prototype.
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">La solution : Static Factories</div>
  <p class="opacity-80">
    Créer des méthodes <code>static</code> avec des noms explicites pour instancier les objets.
  </p>
</div>

---
layout: two-cols-header
---

# Constructeurs nommés via Static Factory

::left::

```ts
type Role = 'admin' | 'guest';

class User {
  // 1. Constructeur PRIVÉ : impossible
  // de faire "new User()" depuis l'extérieur
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _role: Role
  ) {}

  // 2. Fabrique 1 : Invité
  static createGuest(name: string): User {
    const id = Math.random().toString(36).substring(2, 8);
    return new User(id, name, 'guest');
  }

  // 3. Fabrique 2 : Admin
  static createAdmin(id: string, name: string): User {
    return new User(id, name, 'admin');
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">🔒 Le secret : Constructeur privé</div>
  <p class="opacity-80">
    Seule la classe elle-même a le pouvoir d'appeler <code>new User(...)</code>. Elle contrôle 100% de la création.
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✨ Des méthodes auto-documentées</div>
  <p class="opacity-80">
    Le nom de la méthode exprime directement <em>ce qu'on fabrique</em>.
  </p>
</div>

---
layout: default
---

# Utilisation des Constructeurs Nommés

```ts
const invite = User.createGuest("Jean Paul");
const admin  = User.createAdmin("ADM-01", "Alice");

// const u = new User("123", "Bob", "guest"); // ❌ ERREUR : Constructeur privé !
```

<div class="grid grid-cols-3 gap-3 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">📖 Clarté du code</div>
    <p class="opacity-75">Le code appelant devient évident à lire sans consulter la documentation.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">🛡️ Sécurité totale</div>
    <p class="opacity-75">Impossible d'oublier un champ obligatoire ou de mal initialiser l'objet.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">⚡ Évolutif</div>
    <p class="opacity-75">Ajouter une variante (ex: <code>createModerator</code>) sans impacter l'existant.</p>
  </div>
</div>

---
layout: two-cols-header
---

# Les Énumérations (`enum`)

::left::

```ts
enum StatutCommande {
  EnAttente, // 0
  Payee,     // 1
  Livree     // 2
}

class Commande {
  private _statut = StatutCommande.EnAttente;

  public payer(): void {
    if (this._statut !== StatutCommande.EnAttente) {
      throw new Error("Paiement impossible");
    }
    this._statut = StatutCommande.Payee;
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Sécurité à la compilation</div>
  <p class="opacity-80">
    Si vous écrivez <code>StatutCommande.Livre</code> (faute de frappe), TypeScript refuse de compiler !
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">Typage strict</div>
  <p class="opacity-80">
    Une fonction peut exiger un <code>StatutCommande</code> plutôt qu'une chaîne libre.
  </p>
</div>

---
layout: two-cols-header
---

# Pattern Enum-like : Instances uniques

::left::

```ts
class Planete {
  private static readonly _all: Planete[] = [];

  // Instances uniques partagées
  static readonly TERRE   = new Planete("Terre",   5.97e24, 9.81);
  static readonly MARS    = new Planete("Mars",    0.64e24, 3.71);
  static readonly JUPITER = new Planete("Jupiter", 1898e24, 24.79);

  private constructor(
    public readonly nom: string,
    public readonly masseKg: number,
    public readonly gravite: number
  ) {
    Planete._all.push(this);
  }
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">Constructeur privé</div>
  <p class="opacity-80">Aucune autre planète ne peut être créée de l'extérieur. Le jeu d'instances est clos.</p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Instances uniques en RAM</div>
  <p class="opacity-80">Une seule Terre allouée en mémoire pour toute l'application.</p>
</div>

---
layout: two-cols-header
---

# Pattern Enum-like : Méthodes riches

::left::

```ts
// Dans la classe Planete :
public calculerPoids(masseObjetKg: number): number {
  return masseObjetKg * this.gravite;
}

public static toutes(): Planete[] {
  return [...Planete._all];
}

// Utilisation :
const poidsSurTerre = Planete.TERRE.calculerPoids(70);
const poidsSurMars  = Planete.MARS.calculerPoids(70);
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">🧠 Des objets riches</div>
  <p class="opacity-80">
    Contrairement à un simple <code>enum</code>, chaque valeur porte des données et du calcul métier.
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">API Statique</div>
  <p class="opacity-80">
    <code>Planete.toutes()</code> permet d'itérer sur l'ensemble des planètes du système solaire.
  </p>
</div>

---
layout: two-cols-header
---

# ⚠️ Le piège d'ordre d'initialisation statique

::left::

```ts
class Planete {
  // ❌ ERREUR : _all déclaré APRÈS !
  static readonly TERRE = new Planete("Terre", 9.81);
  private static readonly _all: Planete[] = [];

  private constructor(public nom: string, public gravite: number) {
    Planete._all.push(this);
    // 💥 TypeError: _all is undefined !
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
  <div class="font-bold text-amber-700 dark:text-amber-300 mb-1">Ordre d'écriture = ordre d'exécution</div>
  <p class="opacity-85 leading-relaxed">
    En JS/TS, les champs statiques s'exécutent de haut en bas.<br>
    Au moment où <code>new Planete()</code> tourne, <code>_all</code> n'a pas encore été initialisé !
  </p>
</div>

<div class="ms-2 mt-1 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-center">
  👉 Règle : Déclarez toujours les registres/tableaux statiques <strong>avant</strong> les instances statiques.
</div>

---
layout: default
---

# 📌 Récapitulatif : Les 4 Règles d'Or

<div class="grid grid-cols-2 gap-3.5 mt-4">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-blue-600 dark:text-blue-400 text-sm">1. Par défaut, tout est privé</strong>
    <p class="opacity-75 mt-0.5">
      Gardez vos attributs en <code>private</code>. N'ouvrez en <code>public</code> que les méthodes indispensables au monde extérieur.
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-indigo-600 dark:text-indigo-400 text-sm">2. Protégez vos invariants</strong>
    <p class="opacity-75 mt-0.5">
      Un objet ne doit jamais naître invalide : validez dès le constructeur. Refusez toute modification qui mènerait à un état corrompu.
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-purple-600 dark:text-purple-400 text-sm">3. Pas de setters aveugles</strong>
    <p class="opacity-75 mt-0.5">
      Évitez de générer mécaniquement des getters/setters sans contrôle. Privilégiez des méthodes métier porteuses de sens (<code>deposer()</code>).
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-emerald-600 dark:text-emerald-400 text-sm">4. Distinguez instance et classe</strong>
    <p class="opacity-75 mt-0.5">
      Dans la maison = instance (avec <code>this</code>). Sur le plan d'architecte = <code>static</code> (sans <code>this</code>).
    </p>
  </div>
</div>
