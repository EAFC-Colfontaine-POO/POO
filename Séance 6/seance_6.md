---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Séance 6 — L'Héritage en Programmation Orientée Objet
---

<div class="h-full flex flex-col justify-center items-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
    Programmation Orientée Objet · EAFC
  </div>

  <h1 class="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
    Séance 6 — L'Héritage
  </h1>

  <p class="text-lg opacity-80 max-w-xl mx-auto mb-6 font-medium">
    Factorisation · Spécialisation · Mécanique TypeScript · Architecture Angular
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono opacity-60">
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">TypeScript 5+</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Angular 21+</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Standalone</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">POO</span>
  </div>
</div>

<!--
Bienvenue à la séance 6 du cours de Programmation Orientée Objet.
Aujourd'hui, nous abordons l'un des piliers historiques de la POO : l'héritage.
Nous allons comprendre comment factoriser du code, comment spécialiser des classes, mais aussi apprendre à utiliser l'héritage avec précaution et discernement.
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Fondements & Syntaxe</h3>
      <p class="text-xs opacity-75">Comprendre le rôle de <code>extends</code>, l'obligation de <code>super()</code> et la visibilité <code>protected</code>.</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Redéfinition & Sécurité</h3>
      <p class="text-xs opacity-75">Spécialiser un comportement avec <code>override</code> et exploiter la rigueur du compilateur TypeScript.</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Discernement & Pièges</h3>
      <p class="text-xs opacity-75">Valider la relation « est-un », identifier le couplage fort, la classe de base fragile et l'effet yo-yo.</p>
    </div>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h3 class="font-bold text-sm mb-1">Intégration Angular</h3>
      <p class="text-xs opacity-75">Consommer une hiérarchie de classes métier pures dans un composant Standalone avec Signals.</p>
    </div>
  </div>
</div>

<!--
Quatre objectifs majeurs :
1. La syntaxe TypeScript et les règles de base du moteur.
2. La redéfinition explicite pour éviter les régressions silencieuses.
3. Le recul architectural : savoir quand hériter et quand surtout NE PAS hériter.
4. L'application pratique au sein d'une application Angular moderne.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 01
</div>

# Duplication & Genèse de l'héritage

<p class="opacity-70 text-sm max-w-lg mx-auto">
  D'où venons-nous ? Pourquoi la modélisation objet nécessite-t-elle un mécanisme de partage et de spécialisation de structure ?
</p>

<!--
On commence par poser le problème : en séance 5, nous avons appris à concevoir des classes bien encapsulées. Mais dès qu'un projet grandit, un défi majeur apparaît : la duplication entre entités très proches.
-->

---

# Rappel : Où en sommes-nous ?

En **séance 5**, nous avons appris à concevoir une classe solide et autonome :

<div class="grid grid-cols-3 gap-3.5 mt-4">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1">📦 Encapsulation</div>
    <p class="text-xs opacity-75">Regrouper données (état) et méthodes (actions) au sein d'une même entité cohérente.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-xs text-purple-600 dark:text-purple-400 mb-1">🛡️ Modificateurs</div>
    <p class="text-xs opacity-75">Protéger l'intégrité de l'objet avec <code>private</code> et exposer une API avec <code>public</code>.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">🏗️ Constructeur</div>
    <p class="text-xs opacity-75">Garantir que l'objet naît toujours dans un état valide dès son instanciation.</p>
  </div>
</div>

<div class="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
  ⚠️ <strong>La limite rencontrée</strong> : Dans un projet d'entreprise, on gère rarement une seule classe isolée. Comment modéliser des dizaines d'entités qui partagent des caractéristiques communes sans se répéter ?
</div>

<!--
Rappel essentiel : les étudiants maîtrisent désormais la classe individuelle. Mais dans une application réelle, nous avons des dizaines d'entités métiers qui se ressemblent fortement.
-->

---

# Un problème classique de duplication

Imaginons la gestion du catalogue d'une médiathèque :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div>
    <div class="text-xs font-mono text-blue-600 dark:text-blue-400 mb-1 font-bold">livre.ts</div>

```typescript
class Livre {
  titre: string;
  annee: number;
  nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    this.titre = titre;
    this.annee = annee;
    this.nombrePages = pages;
  }

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}
```

  </div>

  <div>
    <div class="text-xs font-mono text-purple-600 dark:text-purple-400 mb-1 font-bold">film.ts</div>

```typescript
class Film {
  titre: string;
  annee: number;
  duree: number;

  constructor(titre: string, annee: number, duree: number) {
    this.titre = titre;
    this.annee = annee;
    this.duree = duree;
  }

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}
```

  </div>
</div>

<div class="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-center">
  🔍 <code>titre</code>, <code>annee</code>, le stockage des données et <code>getDescription()</code> sont <strong>100% dupliqués</strong> !
</div>

<!--
Faire remarquer aux étudiants la redondance évidente. Si on ajoute JeuVideo, Musique, Podcast, le même bloc de code va être recopié 5 ou 10 fois.
-->

---

# Les risques de la duplication de code

Pourquoi copier-coller est l'ennemi n°1 de la maintenabilité logicielle ?

<div class="grid grid-cols-3 gap-3.5 mt-5">
  <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
      <span>🐛</span> Risque de bug accru
    </h3>
    <p class="text-xs opacity-80">Si la formule de <code>getDescription()</code> contient une coquille, il faut la corriger dans <strong>toutes</strong> les classes.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
      <span>🔀</span> Divergence silencieuse
    </h3>
    <p class="text-xs opacity-80">Avec le temps et plusieurs développeurs, deux copies d'un même code finissent par évoluer différemment par mégarde.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
      <span>📈</span> Dette technique
    </h3>
    <p class="text-xs opacity-80">La base de code enfle inutilement, augmentant l'effort de lecture, de test et de maintenance globale.</p>
  </div>
</div>

<div class="mt-6 p-3.5 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 flex items-center justify-between">
  <div>
    <span class="text-[11px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">Réponse de la POO</span>
    <h3 class="text-sm font-bold">L'Héritage : Factoriser une seule fois ce qui est commun</h3>
  </div>
  <span class="text-2xl">💡</span>
</div>

<!--
Principe DRY : Don't Repeat Yourself.
L'héritage a été inventé historiquement pour répondre précisément à ce problème de réutilisation de code et d'abstraction.
-->

---

# Le principe de l'héritage

L'héritage permet à une classe d'acquérir automatiquement tous les membres d'une autre classe.

<div class="grid grid-cols-2 gap-4 mt-5 items-center">
  <div class="space-y-3">
    <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
      <h4 class="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1">1. Factorisation (Classe Mère)</h4>
      <p class="text-xs opacity-80">On regroupe les attributs et comportements partagés au sein d'une <strong>classe de base</strong> (ex: <code>Media</code>).</p>
    </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h4 class="font-bold text-xs text-purple-600 dark:text-purple-400 mb-1">2. Spécialisation (Classes Filles)</h4>
    <p class="text-xs opacity-80">Les <strong>classes dérivées</strong> (ex: <code>Livre</code>, <code>Film</code>) héritent du socle commun et n'écrivent que leurs particularités.</p>
  </div>

  </div>

  <div class="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
    <div class="text-xs uppercase font-mono font-bold text-blue-600 dark:text-blue-400 mb-2">Vocabulaire équivalent</div>
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="p-2 rounded bg-slate-500/10 font-medium">Classe Parente</div>
      <div class="p-2 rounded bg-slate-500/10 font-medium">Classe Dérivée</div>
      <div class="p-2 rounded bg-slate-500/10 font-medium">Classe Mère</div>
      <div class="p-2 rounded bg-slate-500/10 font-medium">Classe Fille</div>
      <div class="p-2 rounded bg-slate-500/10 font-medium">Super-classe</div>
      <div class="p-2 rounded bg-slate-500/10 font-medium">Sous-classe</div>
      <div class="p-2 rounded bg-slate-500/10 font-medium">Classe de base</div>
      <div class="p-2 rounded bg-slate-500/10 font-medium">Classe spécialisée</div>
    </div>
  </div>
</div>

<!--
Clarifier le vocabulaire dès le départ : classe mère / classe fille, super-classe / sous-classe, classe de base / classe dérivée. Tous ces termes désignent exactement la même relation.
-->

---

# La relation fondamentale : « est-un » (*is-a*)

L'héritage modélise obligatoirement une relation de sous-type stricte :

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm mb-2 flex items-center gap-2">
      <span>🍪</span> Métaphore de la pâtisserie
    </h3>
    <p class="text-xs opacity-80 leading-relaxed">
      Considérez une <strong>pâte à biscuit de base</strong> (farine, beurre, sucre).<br><br>
      • Un <em>biscuit au chocolat</em> <strong>est une</strong> pâte de base + pépites de chocolat.<br>
      • Un <em>biscuit vanille</em> <strong>est une</strong> pâte de base + arôme de vanille.<br><br>
      Chaque variante <strong>est</strong> la recette de base, enrichie d'une touche unique.
    </p>
  </div>

  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm mb-2 flex items-center gap-2">
      <span>📚</span> Dans notre domaine métier
    </h3>
    <p class="text-xs opacity-80 leading-relaxed">
      • Un <code>Livre</code> <strong>est un</strong> <code>Media</code> (avec un nombre de pages en plus).<br>
      • Un <code>Film</code> <strong>est un</strong> <code>Media</code> (avec une durée en plus).<br>
      • Un <code>Chien</code> <strong>est un</strong> <code>Animal</code>.<br><br>
      Tout ce qui est vrai pour le concept général s'applique naturellement au concept spécialisé.
    </p>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-center text-emerald-700 dark:text-emerald-300">
  ✨ Si une classe dérivée n'est pas un cas particulier évident de sa classe de base, l'héritage est une erreur de conception.
</div>

<!--
La relation "est-un" est le critère d'or. Si la phrase sonne bizarre en français ou en anglais, l'héritage ne convient pas.
-->

---

# La question cruciale avant d'hériter

Avant même d'écrire la moindre ligne de code avec `extends`, posez-vous toujours cette question :

<div class="my-5 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
  <span class="text-lg font-bold text-blue-700 dark:text-blue-300">
    « Un B est-il véritablement et en tout temps un A ? »
  </span>
</div>

<div class="grid grid-cols-2 gap-4 text-xs">
  <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
      <span>✅</span> Exemples sémantiquement valides
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li> <code>Livre</code> <em>est-un</em> <code>Media</code></li>
      <li> <code>Voiture</code> <em>est-un</em> <code>Vehicule</code></li>
      <li> <code>Enseignant</code> <em>est-une</em> <code>Personne</code></li>
      <li> <code>CompteEpargne</code> <em>est-un</em> <code>CompteBancaire</code></li>
    </ul>
  </div>

  <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
    <div class="font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>❌</span> Exemples invalides (Anti-patterns)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li> <code>Facture extends Client</code> (Une facture n'est pas un client !)</li>
      <li> <code>Voiture extends Moteur</code> (Une voiture n'est pas un moteur !)</li>
      <li> <code>Avion extends Aile</code> (Un avion possède une aile, il ne l'est pas)</li>
      <li> <code>Panier extends Article</code> (Un panier contient des articles)</li>
    </ul>
  </div>
</div>

<!--
Faire participer les étudiants : pourquoi Facture extends Client est-il absurde ? Parce qu'une facture a un montant, une date, un numéro. Le client a un nom, une adresse. La relation est une association/possession ("a-un"), pas un héritage ("est-un").
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 02
</div>

# La mécanique technique en TypeScript

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Syntaxe <code>extends</code>, appel obligatoire de <code>super()</code>, cycle d'instanciation et visibilité <code>protected</code>.
</p>

<!--
On rentre maintenant dans le code concret TypeScript. Comment déclare-t-on l'héritage, comment initialise-t-on les objets en mémoire, et comment règle-t-on la visibilité des attributs ?
-->

---

# Syntaxe : Le mot-clé `extends`

En TypeScript (et en JavaScript ES6+), l'héritage s'exprime avec le mot-clé **`extends`** :

<div class="grid grid-cols-[3fr_2fr] gap-4 mt-4">

```typescript
export class Media {
  titre: string;
  annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

export class Livre extends Media {
  nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee); // ⚠️ Invoque le constructeur de Media
    this.nombrePages = pages;
  }
}
```


  <div class="mt-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-center h-20">
    <code>Livre</code> acquiert automatiquement <code>titre</code>, <code>annee</code> et tous les comportements déclarés dans <code>Media</code>.
  </div>

</div>

<!--
Montrer la structure claire : Media définit ce qui est universel, Livre ajoute sa spécialité (nombrePages).
Insister sur la ligne super(titre, annee).
-->

---

# Le rôle vital de `super()`

Que fait exactement l'instruction **`super(...)`** ?

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-xs text-blue-600 dark:text-blue-400 mb-2">1. Délégation d'initialisation</h3>
    <p class="text-xs opacity-80 leading-relaxed">
      La classe dérivée ne doit pas réinventer la roue. Elle délègue l'initialisation des champs hérités au constructeur de sa classe mère.
    </p>
    <div class="mt-3 p-2 rounded bg-slate-500/10 font-mono text-[11px]">
      super(titre, annee);
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-xs text-purple-600 dark:text-purple-400 mb-2">2. Cohérence du contrat</h3>
    <p class="text-xs opacity-80 leading-relaxed">
      Si la classe mère exige 2 paramètres à la construction, toute classe fille est <strong>obligée</strong> de les lui fournir pour que l'objet soit intègre.
    </p>
    <div class="mt-3 p-2 rounded bg-slate-500/10 text-[11px] opacity-80">
      Garantie absolue d'intégrité de la classe mère
    </div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  ⚠️ <strong>Règle TypeScript</strong> : Si une classe fille définit un constructeur, elle a l'obligation stricte d'appeler <code>super()</code>. Omettre cet appel produit une erreur de compilation immédiate.
</div>

<!--
Souligner : si on n'écrit pas super(), le compilateur TypeScript refuse de compiler. C'est une obligation syntaxique et logique.
-->

---

# La règle d'or du moteur : `super()` en premier

En TypeScript et JavaScript, une règle d'ordre stricte régit le constructeur :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div>
    <div class="text-xs font-mono text-red-600 dark:text-red-400 mb-1 font-bold">❌ Incorrect (Erreur de compilation)</div>

```typescript
class Livre extends Media {
  pages: number;

  constructor(titre: string, annee: number, pages: number) {
    this.pages = pages;  // ❌ ERREUR !
    super(titre, annee); // Trop tard !
  }
}
```

  <div class="mt-2 text-[10px] p-2 rounded bg-red-500/10 text-red-600 dark:text-red-400">
    <em>TS17009: 'super' must be called before accessing 'this' in the constructor of a derived class.</em>
  </div>

  </div>

  <div>
    <div class="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-1 font-bold">✅ Correct</div>

```typescript
class Livre extends Media {
  pages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee); // ✅ D'abord le parent
    this.pages = pages;  // ✅ Puis l'enfant
  }
}
```

  <div class="mt-2 text-[10px] p-2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
    L'instance est d'abord initialisée comme <code>Media</code>, puis spécialisée avec ses <code>pages</code>.
  </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-center">
  🧠 <strong>Pourquoi cette règle ?</strong> L'objet <code>this</code> n'existe officiellement en mémoire que lorsque la fondation (la classe parente) a fini de se construire !
</div>

<!--
Expliquer la métaphore du bâtiment : on ne peut pas poser le papier peint du 1er étage (this.pages = pages) tant que les fondations et le rez-de-chaussée (super) ne sont pas coulés dans le béton.
-->

---

### Visibilité et héritage : Le dilemme

Rappelons nos modificateurs de la séance 5 : que se passe-t-il si un membre est `private` ?

<div class="grid grid-cols-2 gap-4 mt-2">
  <div class="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-xs text-red-600 dark:text-red-400 mb-2">Le problème de <code>private</code></h3>
    <p class="text-xs opacity-80 leading-relaxed mb-3">
      Un membre déclaré <code>private</code> dans <code>Media</code> est <strong>totalement inaccessible</strong> depuis <code>Livre</code> !
    </p>

```typescript
class Media {
  private titre: string;
}
class Livre extends Media {
  afficher() {
    // ❌ Erreur : 'titre' est privé
    console.log(this.titre);
  }
}
```

  </div>

  <div class="p-2 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-2">Le piège de <code>public</code></h3>
    <p class="text-xs opacity-80 leading-relaxed mb-3">
      Tout déclarer en <code>public</code> résout l'accès dans <code>Livre</code>, mais <strong>détruit l'encapsulation</strong> : n'importe quel code extérieur peut alors corrompre les données.
    </p>

```typescript
class Media {
  public titre: string;
}
// N'importe qui peut écrire n'importe quoi :
const m = new Media('Dune', 1965);
m.titre = ''; // ⚠️ Aucune protection !
```

  </div>
</div>

<div class="mt-1 p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-center font-semibold text-indigo-700 dark:text-indigo-300">
  👉 Il nous faut un modificateur intermédiaire dédié à l'héritage : <code>protected</code>.
</div>

<!--
Ce dilemme est crucial à faire comprendre. Les étudiants ont tendance à tout mettre en public pour que ça marche, ou en private et ne comprennent pas pourquoi la classe fille ne peut pas lire le titre.
-->

---

# Le juste milieu : `protected`

Le mot-clé **`protected`** a été spécialement conçu pour l'héritage :

<div class="grid grid-cols-2 gap-4 mt-4 items-center">
  <div class="space-y-3">
    <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
      <strong>Ouvert aux enfants :</strong><br>
      Accessible directement dans la classe parente et dans toutes ses classes dérivées (famille).
    </div>

  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
    <strong>Fermé au reste du monde :</strong><br>
    Inaccessible depuis l'extérieur de la classe (exactement comme un membre privé).
  </div>
  </div>

  <div>

```typescript
export class Media {
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }
}

export class Livre extends Media {
  resume(): string {
    // ✅ Autorisé : 'titre' est protected
    return `${this.titre.toUpperCase()}`;
  }
}

const livre = new Livre('1984', 1949, 328);
// livre.titre; ❌ ERREUR extérieure !
```

  </div>
</div>

<!--
Protected = "secret de famille". Les membres de la famille (mère et filles) y ont accès, mais le public extérieur ne peut pas y toucher directement.
-->

---

# Matrice récapitulative des visibilités

Un tableau de référence indispensable pour concevoir vos classes :

<div class="mt-6 overflow-hidden rounded-xl border border-slate-500/20">
  <table class="w-full text-xs text-left">
    <thead class="bg-slate-500/10 text-slate-700 dark:text-slate-300 uppercase font-mono text-[11px]">
      <tr>
        <th class="p-3">Modificateur</th>
        <th class="p-3 text-center">Classe Mère</th>
        <th class="p-3 text-center">Classes Dérivées</th>
        <th class="p-3 text-center">Reste du monde (Extérieur)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-500/15 opacity-90">
      <tr class="hover:bg-slate-500/5">
        <td class="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">public</td>
        <td class="p-3 text-center">✅ Oui</td>
        <td class="p-3 text-center">✅ Oui</td>
        <td class="p-3 text-center">✅ Oui</td>
      </tr>
      <tr class="hover:bg-slate-500/5 bg-indigo-500/5">
        <td class="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">protected</td>
        <td class="p-3 text-center">✅ Oui</td>
        <td class="p-3 text-center">✅ Oui</td>
        <td class="p-3 text-center text-red-500 font-bold">❌ Non</td>
      </tr>
      <tr class="hover:bg-slate-500/5">
        <td class="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">private</td>
        <td class="p-3 text-center">✅ Oui</td>
        <td class="p-3 text-center text-red-500 font-bold">❌ Non</td>
        <td class="p-3 text-center text-red-500 font-bold">❌ Non</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="mt-6 p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs text-center">
  📌 <strong>Recommandation</strong> : Par défaut, privilégiez <code>private</code>. N'ouvrez en <code>protected</code> que les attributs dont les classes dérivées ont réellement besoin.
</div>

<!--
Cette matrice est un classique absolu des examens et entretiens techniques. À mémoriser impérativement.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 03
</div>

# Spécialisation et redéfinition (`override`)

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Comment une classe fille adapte-t-elle un comportement hérité ? Pourquoi le mot-clé <code>override</code> est-il indispensable en TypeScript ?
</p>

<!--
On aborde maintenant la redéfinition de méthode (method overriding). Hériter d'une méthode ne signifie pas être prisonnier de son implémentation initiale.
-->

---

# Redéfinition de méthode (*Method Overriding*)

Une classe dérivée peut fournir sa propre version d'une méthode reçue du parent :

<div class="grid grid-cols-[3fr_2fr] gap-4 mt-4">


```typescript
// Classe Mère
export class Media {
  protected titre: string;
  protected annee: number;

  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}

// Classe Dérivée
export class Film extends Media {
  private duree: number; // en minutes

  // Redéfinition : Film adapte getDescription à sa réalité
  override getDescription(): string {
    return `${this.titre} (${this.annee}) — ${this.duree} min`;
  }
}
```

<div class="mt-3 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs h-20">
  Quand on appelle <code>unFilm.getDescription()</code>, c'est la version spécialisée de <code>Film</code> qui s'exécute, pas celle de <code>Media</code>.
</div>

</div>

<!--
La classe fille remplace l'implémentation standard par une version plus spécifique à son rôle.
-->

---

# Le mot-clé `override` en TypeScript

Depuis TypeScript 4.3+, le mot-clé **`override`** permet de déclarer explicitement son intention :

<div class="grid grid-cols-3 gap-3.5 mt-5">
  <div class="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
    <div class="text-2xl mb-1">📖</div>
    <h3 class="font-bold text-xs mb-1">Lisibilité immédiate</h3>
    <p class="text-[11px] opacity-75">Indique instantanément au lecteur que cette méthode provient d'un ancêtre.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
    <div class="text-2xl mb-1">🛡️</div>
    <h3 class="font-bold text-xs mb-1">Protection compilateur</h3>
    <p class="text-[11px] opacity-75">Empêche les erreurs de frappe indétectables dans le nom de la méthode.</p>
  </div>

  <div class="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
    <div class="text-2xl mb-1">🔄</div>
    <h3 class="font-bold text-xs mb-1">Refactorings sereins</h3>
    <p class="text-[11px] opacity-75">Si la méthode parente est renommée, TypeScript nous signale immédiatement l'incohérence.</p>
  </div>
</div>

<div class="mt-5 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs text-center">
  💡 C'est un contrat formel avec le compilateur : <em>« Je promets que cette méthode existe déjà dans la classe mère. »</em>
</div>

<!--
Pourquoi ce mot-clé a-t-il été introduit tardivement en TypeScript alors qu'il existait déjà en Java ou C# ? Précisément pour sauver les développeurs de bugs insidieux.
-->

---

### Les pièges évités par `override`

<span>Observons le bug silencieux classique sans `override` :</span>

<div class="grid grid-cols-2 gap-4 mt-3">
  <div>
    <div class="text-xs font-mono text-red-600 dark:text-red-400 mb-1 font-bold">Sans override : Bug silencieux 😱</div>

```typescript
class Media {
  getDescription(): string {
    return `${this.titre}`;
  }
}

class Film extends Media {
  // Coquille : 't' au lieu de 'T'
  getdescription(): string {
    return `${this.titre} (Film)`;
  }
}

const f = new Film();
f.getDescription(); // Exécute Media ! Pas Film !
```

  <div class="mt-2 text-[10px] p-2 rounded bg-red-500/10 text-red-600 dark:text-red-400">
    TypeScript valide le code car il pense que vous créez simplement une nouvelle méthode ! Le bug passe en production.
  </div>
  </div>

  <div>
    <div class="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-1 font-bold">Avec override : Bloqué à la compilation 🛡️</div>

```typescript
class Film extends Media {
  // Coquille détectée immédiatement
  override getdescription(): string {
    return `${this.titre} (Film)`;
  }
}
```

  <div class="mt-2 text-[10px] p-2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
    <em>TS4113: This member cannot have an 'override' modifier because it is not declared in the base class 'Media'.</em>
  </div>

  <div class="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-center">
  ⚙️ Option recommandée dans <code>tsconfig.json</code> : <strong><code>"noImplicitOverride": true</code></strong>
</div>
  </div>
</div>



<!--
Cette diapositive est très percutante : elle montre comment une simple faute de casse passe totalement inaperçue sans override, alors qu'override transforme un bug d'exécution en erreur de compilation immédiate.
-->

---

# Enrichir plutôt qu'écraser : `super.methode()`

Une classe dérivée n'a pas toujours besoin de tout réécrire de zéro. Elle peut **réutiliser** le résultat du parent :

```typescript
export class Livre extends Media {
  private nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee);
    this.nombrePages = pages;
  }

  // On enrichit la description parente au lieu de la dupliquer
  override getDescription(): string {
    const descriptionBase = super.getDescription(); // "Dune (1965)"
    return `${descriptionBase} — ${this.nombrePages} pages`;
  }
}
```

<div class="grid grid-cols-2 gap-3 mt-2 text-xs">
  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong>Avantage maintenance :</strong><br>
    Si le format global de `Media` change (ex: `[1965] Dune`), `Livre` en profite automatiquement !
  </div>
  <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong>Principe :</strong><br>
    <code>super.nomDeMethode()</code> permet d'appeler n'importe quelle méthode parente depuis l'enfant.
  </div>
</div>

<!--
super.getDescription() permet de déléguer la partie commune et d'ajouter uniquement la spécialité. C'est l'essence même de l'extension de comportement.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 04
</div>

# Discernement architectural & Les pièges de l'héritage

<p class="opacity-70 text-sm max-w-lg mx-auto">
  L'héritage est le lien le plus fort et le plus rigide qui puisse unir deux classes. Quels sont ses pièges et ses coûts réels ?
</p>

<!--
Partie essentielle de recul critique : beaucoup de développeurs débutants abusent de l'héritage pour économiser 3 lignes de code. C'est ici que se fait la différence entre un codeur et un informaticien bachelier.
-->

---

# L'héritage : Un outil puissant, pas un réflexe

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <h3 class="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-2">Ce que l'héritage résout avec brio</h3>
    <ul class="text-xs space-y-2 opacity-85">
      <li>Élimine la duplication de code entre entités soeurs</li>
      <li>Spécialise élégamment un concept abstrait</li>
      <li>Modélise fidèlement une taxonomie métier naturelle (« est-un »)</li>
    </ul>
  </div>

  <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
    <h3 class="font-bold text-xs text-red-600 dark:text-red-400 mb-2">Ce que l'héritage COÛTE en pratique</h3>
    <ul class="text-xs space-y-2 opacity-85">
      <li><strong>Couplage très fort</strong> entre parent et enfants</li>
      <li>Perte de flexibilité : relation fixée à la compilation</li>
      <li>Fragilité de la classe mère face aux évolutions</li>
      <li>Complexité de lecture croissante avec la profondeur</li>
    </ul>
  </div>
</div>

<div class="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-center">
  ⚖️ En ingénierie logicielle, l'héritage n'est jamais gratuit : on échange un gain de lignes de code contre une <strong>rigidité architecturale accrue</strong>.
</div>

<!--
Insister sur le mot "compromis" (trade-off). Rien n'est gratuit en architecture logicielle.
-->

---

# Piège n°1 : L'héritage par commodité

L'erreur du débutant : hériter juste pour « récupérer » des méthodes ou des variables pratiques.

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="">
    <div class="font-bold text-xs text-red-600 dark:text-red-400 mb-1">❌ Héritage abusif</div>

```typescript
class Client {
  nom: string;
  adresse: string;
  envoyerEmail(): void { ... }
}

// ❌ Une facture n'est PAS un client !
class Facture extends Client {
  montantTotal: number;
}

const f = new Facture();
f.envoyerEmail(); // Sémantiquement absurde !
```

  </div>

  <div>
    <div class="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">✅ Relation saine de composition</div>

```typescript
class Client {
  nom: string;
  adresse: string;
}

// ✅ Une facture POSSÈDE un client
class Facture {
  numero: string;
  montantTotal: number;
  client: Client; // Référence propre

  constructor(num: string, total: number, client: Client) {
    this.client = client;
  }
}
```

  </div>
</div>

<div class="mt-1 p-2.5 rounded-lg bg-slate-500/10 border border-slate-500/20 text-xs text-center font-medium">
  Ne jamais hériter d'une classe simplement pour éviter de retaper des propriétés. La relation sémantique doit être irréprochable.
</div>

<!--
L'exemple Facture extends Client est marquant : tout le monde comprend qu'une facture n'est pas un être humain avec un nom et une adresse.
-->

---

# La notion clé : Le couplage fort

Qu'appelle-t-on **couplage** en programmation ?

<div class="my-3 p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
  <strong>Couplage</strong> = Mesure du degré d'interdépendance entre deux modules ou classes.<br>
  👉 Deux classes sont <strong>fortement couplées</strong> quand modifier l'une risque de casser l'autre.
</div>

<div class="grid grid-cols-2 gap-4 mt-4 items-center">
  <div class="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
    <h4 class="font-bold text-xs text-blue-600 dark:text-blue-400 mb-2">🏗️ L'image des fondations</h4>
    <p class="text-xs opacity-80 leading-relaxed">
      La classe dérivée est comme un étage construit <strong>directement sur les fondations</strong> d'un bâtiment existant :<br><br>
      • Tant que les fondations restent immobiles, tout est parfait.<br>
      • Si le rez-de-chaussée modifie ses poutres porteuses, <strong>tous les étages supérieurs doivent être réexaminés</strong>, même s'ils n'ont pas été touchés directement.
    </p>
  </div>

  <div class="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
    <h4 class="font-bold text-xs text-purple-600 dark:text-purple-400 mb-2">🔗 Pourquoi l'héritage couple-t-il autant ?</h4>
    <p class="text-xs opacity-80 leading-relaxed">
      Contrairement à une simple utilisation externe (qui ne voit que les méthodes publiques), la classe fille dépend souvent de :<br><br>
      • L'ordre d'initialisation du constructeur<br>
      • L'implémentation interne de <code>super.methode()</code><br>
      • L'état des membres <code>protected</code>
    </p>
  </div>
</div>

<!--
Expliquer que l'héritage est la forme de couplage la plus serrée de toute la programmation orientée objet.
-->

---

## Piège n°2 : La classe de base fragile (*Fragile Base Class*)

Exemple concret : une modification anodine dans la classe mère bouleverse les classes filles :

```typescript
// VERSION INITIALE
class Media {
  protected titre: string;
  protected annee: number;
  getDescription(): string { return `${this.titre} (${this.annee})`; }
}

class Livre extends Media {
  // Livre s'appuie sur le format exact du parent
  override getDescription(): string { return `${super.getDescription()} — X pages`; }
} // Résultat initial : "Dune (1965) — X pages" ✅
```

```typescript
// PLUS TARD : Un développeur modifie la classe mère pour un besoin externe...
class Media {
  getDescription(): string { return `[${this.annee}] - TITRE : ${this.titre}`; }
}
// Résultat dans Livre : "[1965] - TITRE : Dune — X pages" 💥
```

<div class="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-center text-red-600 dark:text-red-400">
  ⚠️ Le comportement de <code>Livre</code> a été altéré <strong>sans qu'une seule ligne de <code>Livre</code> n'ait été touchée</strong> !
</div>

<!--
Le problème de la classe de base fragile (Fragile Base Class Problem) est un concept fondamental en génie logiciel. Plus la classe mère a d'enfants, plus elle devient pétrifiée et impossible à modifier.
-->

---

# Piège n°3 : L'effet Yo-Yo et les hiérarchies profondes

Que se passe-t-il quand on empile trop de niveaux d'héritage ?

<div class="grid grid-cols-2 gap-4 mt-3 items-center">
  <div>

```typescript
class Entite { ... }
class ObjetMetier extends Entite { ... }
class Ressource extends ObjetMetier { ... }
class Media extends Ressource { ... }
class DocumentPapier extends Media { ... }
class Livre extends DocumentPapier { ... }
```

  <div class="mt-2 text-center text-xs text-red-500 font-bold">
    ❌ 6 niveaux d'héritage : Code illisible et ingérable !
  </div>
  </div>

  <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <h3 class="font-bold text-xs text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
      <span>🪀</span> L'effet Yo-Yo
    </h3>
    <p class="text-xs opacity-80 leading-relaxed mb-3">
      Pour comprendre ce que fait une seule méthode de <code>Livre</code> :
    </p>
    <ol class="text-[11px] space-y-1 opacity-80 list-decimal list-inside">
      <li>On ouvre <code>Livre.ts</code> : appelle <code>super.m()</code></li>
      <li>On ouvre <code>DocumentPapier.ts</code> : ne redéfinit rien</li>
      <li>On ouvre <code>Media.ts</code> : appelle <code>super.m()</code></li>
      <li>On ouvre <code>Ressource.ts</code>...</li>
    </ol>
    <div class="mt-3 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
      Le cerveau du développeur oscille sans cesse entre 6 fichiers.
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-center font-bold text-emerald-700 dark:text-emerald-300">
  📏 Règle d'or en pratique : Ne dépassez jamais 2 à 3 niveaux d'héritage.
</div>

<!--
L'effet Yo-Yo fatigue les développeurs, complexifie le débogage et masque les responsabilités.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 05
</div>

# Démonstration Angular

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Intégration pas à pas : modèles TypeScript métier purs, composant Standalone moderne, Signals réactifs et template déclaratif.
</p>

<!--
On passe à la pratique dans Angular ! On applique tout ce qu'on vient d'apprendre dans un cas concret d'affichage de médiathèque.
-->

---

# Architecture du projet

Séparer rigoureusement la **logique métier pure** des **composants d'interface Angular** :

```
src/app/
├── models/                     # 100% TypeScript pur (Agnostique d'Angular)
│   ├── media.model.ts          # Classe de base
│   ├── livre.model.ts          # Classe dérivée
│   └── film.model.ts           # Classe dérivée
│
└── components/                 # Présentation Angular
    └── bibliotheque/
        ├── bibliotheque.component.ts    # Standalone component + Signals
        ├── bibliotheque.component.html  # Template + Control Flow (@for)
        └── bibliotheque.component.css   # Styles encapsulés
```

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong>💡 Modèles purs :</strong><br>
    Aucun décorateur <code>@Component</code>, aucun import d'Angular. Ces classes fonctionnent partout (Node.js, React, script CLI).
  </div>
  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong>💡 Composant Angular :</strong><br>
    Son rôle unique est d'instancier, stocker dans un <code>signal</code> et restituer les données à l'utilisateur.
  </div>
</div>

<!--
Très important de faire remarquer aux étudiants : la POO métier ne dépend PAS du framework. Angular n'est que la couche d'affichage.
-->

---

## Étape 1 — Classe de base : `media.model.ts`

Dans `src/app/models/media.model.ts` :

```typescript
export class Media {
  // Attributs protégés : accessibles par Livre et Film
  protected titre: string;
  protected annee: number;

  constructor(titre: string, annee: number) {
    this.titre = titre;
    this.annee = annee;
  }

  // Comportement universel à tous les médias
  getDescription(): string {
    return `${this.titre} (${this.annee})`;
  }
}
```

<div class="mt-3 p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-xs">
  • <code>protected</code> assure la transmission sécurisée aux classes dérivées.<br>
  • La méthode <code>getDescription()</code> fournit le comportement par défaut.
</div>

<!--
Passer en revue les éléments de Media : constructeur propre, getters, visibilité protected.
-->

---

## Étape 2 — Classes spécialisées : `Livre` & `Film`

<div class="grid grid-cols-2 gap-4 mt-2">
  <div>
    <div class="text-xs font-mono text-blue-600 dark:text-blue-400 mb-1 font-bold">src/app/models/livre.model.ts</div>

```typescript
import { Media } from './media.model';

export class Livre extends Media {
  private nombrePages: number;

  constructor(titre: string, annee: number, pages: number) {
    super(titre, annee); // 1. Fondation
    this.nombrePages = pages;
  }

  getNombrePages(): number {
    return this.nombrePages;
  }

  override getDescription(): string {
    return `${super.getDescription()} — ${this.nombrePages} p.`;
  }
}
```

  </div>

  <div>
    <div class="text-xs font-mono text-purple-600 dark:text-purple-400 mb-1 font-bold">src/app/models/film.model.ts</div>

```typescript
import { Media } from './media.model';

export class Film extends Media {
  private dureeMinutes: number;

  constructor(titre: string, annee: number, duree: number) {
    super(titre, annee); // 1. Fondation
    this.dureeMinutes = duree;
  }

  getDureeMinutes(): number {
    return this.dureeMinutes;
  }

  override getDescription(): string {
    return `${super.getDescription()} — ${this.dureeMinutes} min`;
  }
}
```

  </div>
</div>

<div class="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-center">
  Les deux classes filles réutilisent <code>super.getDescription()</code> et y apposent leur spécialité.
</div>

<!--
Montrer la symétrie parfaite et la clarté du code. Chaque classe fille est ultra-courte car tout le socle a été factorisé.
-->

---

## Étape 3 — Composant Angular : `BibliothequeComponent`

Dans `src/app/components/bibliotheque/bibliotheque.component.ts` :

```typescript
import { Component, signal } from '@angular/core';
import { Media } from '../../models/media.model';
import { Livre } from '../../models/livre.model';
import { Film } from '../../models/film.model';

@Component({
  selector: 'app-bibliotheque',
  standalone: true,
  templateUrl: './bibliotheque.component.html',
  styleUrl: './bibliotheque.component.css'
})
export class BibliothequeComponent {
  collection = signal<Media[]>([ new Livre('Le Petit Prince', 1943, 96), new Film('Inception', 2010, 148),
    new Livre('Les Misérables', 1862, 1462), new Film('Interstellar', 2014, 169)
  ]);
}
```

<div class="mt-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
  💡 <strong>Remarque capitale</strong> : La variable <code>collection</code> est typée <strong><code>Media[]</code></strong>, mais elle accueille indifféremment des <code>Livre</code> et des <code>Film</code> car ils <em>sont tous des médias</em> !
</div>

<!--
Attirer l'attention des étudiants sur signal<Media[]>. Pourquoi TypeScript accepte-t-il de mettre un Livre et un Film dans un tableau de Media ? Parce qu'un Livre EST un Media.
-->

---

## Étape 4 — Template HTML avec Control Flow moderne

Dans `src/app/components/bibliotheque/bibliotheque.component.html` :

```html
<div class="container mt-4">
  <h2 class="mb-3">📚 Ma Médiathèque</h2>

  <div class="list-group">
    @for (media of collection(); track media.getTitre()) {
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <span class="fw-semibold">{{ media.getDescription() }}</span>
        </div>
        <span class="badge bg-secondary rounded-pill">
          {{ media.getAnnee() }}
        </span>
      </div>
    } @empty {
      <p class="text-muted">Aucun média dans la collection.</p>
    }
  </div>
</div>
```

<div class="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-center">
  🎯 Syntaxe moderne : <strong><code>@for</code></strong> natif avec <code>track</code>, et Bootstrap pour la mise en forme.
</div>

<!--
Souligner la simplicité du template : media.getDescription() est appelé pour chaque élément de la boucle.
-->

---

## Étape 5 — Ce qu'il faut retenir de la démo

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">🏛️</span>
    <div>
      <h3 class="font-bold text-xs mb-1">Architecture découplée</h3>
      <p class="text-xs opacity-75">Les modèles métier sont en pur TypeScript, testables indépendamment de toute interface web.</p>
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">⚡</span>
    <div>
      <h3 class="font-bold text-xs mb-1">Modernité Angular</h3>
      <p class="text-xs opacity-75">Composant <code>standalone: true</code>, état géré via <code>signal()</code>, et rendu par <code>@for</code>.</p>
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">🧩</span>
    <div>
      <h3 class="font-bold text-xs mb-1">Encapsulation respectée</h3>
      <p class="text-xs opacity-75">Le composant interagit avec le modèle uniquement via son API publique (<code>getDescription()</code>).</p>
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="text-xl">🔍</span>
    <div>
      <h3 class="font-bold text-xs mb-1">Le mystère de l'exécution</h3>
      <p class="text-xs opacity-75">Le template appelle <code>media.getDescription()</code> sur un tableau de <code>Media</code>, et pourtant, le résultat affiche bien les pages ou les minutes !</p>
    </div>
  </div>
</div>

<!--
Cette 4e carte prépare le terrain mental pour le polymorphisme, sans donner la solution tout de suite.
-->


---
layout: default
---

# 📌 Récapitulatif

<div class="grid grid-cols-2 gap-3.5 mt-5">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-blue-600 dark:text-blue-400">Héritage (<code>extends</code>) :</strong>
    <p class="opacity-75 mt-0.5">Factorise les membres communs et spécialise une classe fille selon la relation « est-un ».</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-indigo-600 dark:text-indigo-400">Constructeur (<code>super()</code>) :</strong>
    <p class="opacity-75 mt-0.5">Obligatoire dans la classe fille, doit impérativement être appelé avant tout accès à <code>this</code>.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-purple-600 dark:text-purple-400">Redéfinition (<code>override</code>) :</strong>
    <p class="opacity-75 mt-0.5">Adapte un comportement hérité. Le mot-clé <code>override</code> sécurise le code face aux renommages et coquilles.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-emerald-600 dark:text-emerald-400">Visibilité (<code>protected</code>) :</strong>
    <p class="opacity-75 mt-0.5">Accessible par la classe mère et ses classes dérivées, mais hermétique à l'extérieur.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-amber-600 dark:text-amber-400">Couplage fort & Yo-Yo :</strong>
    <p class="opacity-75 mt-0.5">L'héritage lie fortement les classes. Limiter impérativement la profondeur à 2 ou 3 niveaux.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-rose-600 dark:text-rose-400">Angular :</strong>
    <p class="opacity-75 mt-0.5">Les modèles métier restent en pur TypeScript. Angular les consomme via Standalone et Signals.</p>
  </div>
</div>

<!--
Récapitulatif complet de la séance 6.
-->

---

# 🔜 Séance suivante

**Séance 7 — Le Polymorphisme**

<div class="p-4 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 mb-5">
  <h3 class="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">
    ❓ La question laissée en suspens à la fin de notre démo Angular :
  </h3>
  <p class="text-xs opacity-85 leading-relaxed">
    Dans notre composant, nous avons stocké des <code>Livre</code> et des <code>Film</code> dans un tableau typé <code>Media[]</code>. Lorsque la boucle appelle <code>media.getDescription()</code>, <strong>comment le moteur d'exécution sait-il quelle méthode appeler pour chaque objet ?</strong>
  </p>
</div>

<div class="grid grid-cols-3 gap-3.5 text-xs">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold mb-1">🎭 Polymorphisme</div>
    <p class="opacity-75">Une interface unique, plusieurs comportements dynamiques selon l'objet réel.</p>
  </div>
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold mb-1">⏱️ Liaison dynamique</div>
    <p class="opacity-75">Comprendre comment JavaScript résout les méthodes au moment de l'exécution (*late binding*).</p>
  </div>
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold mb-1">🧩 Extensibilité</div>
    <p class="opacity-75">Ajouter de nouveaux types (ex: <code>Podcast</code>) sans modifier une seule ligne du template !</p>
  </div>
</div>

<!--
Parfait pour créer une attente positive pour la séance suivante sans avoir brûlé les étapes aujourd'hui.
-->