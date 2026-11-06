---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "Séance 16 — Formats de Données & Sérialisation : JSON, XML et Typage en POO"
info: |
  ## Séance 16 — Formats de Données & Sérialisation : JSON, XML et Typage en POO
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
    Séance 16 — Formats de Données & Sérialisation
  </h1>

  <p class="text-base text-slate-800 dark:text-slate-100 max-w-2xl mx-auto mb-5 font-semibold">
    JSON · XML · Sérialisation · Le Drame du Prototype Perdu · Patron DTO · Fabrique <code>fromDTO()</code>
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono font-bold">
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">TypeScript 5+</span>
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Angular 22</span>
    <span class="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Signal-First</span>
    <span class="px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">Ouverture Bloc D</span>
  </div>
</div>

<!--
Bienvenue à la séance 16 du cours de Programmation Orientée Objet !
Aujourd'hui marque une étape charnière de notre cursus : nous ouvrons officiellement le Bloc D, consacré à la Persistance des Données.
Rassurez tout de suite les étudiants : nous allons aborder une question fondamentale et passionnante.
Jusqu'ici, tous nos beaux objets disparaissaient dès qu'on appuyait sur F5.
Aujourd'hui, nous allons apprendre comment faire sortir nos objets de la mémoire vive sans perdre leurs méthodes ni détruire leurs invariants !
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques de la séance

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Comprendre la Volatilité de la RAM</h4>
      <p class="opacity-75">Expliquer pourquoi les instances du tas (<em>Heap</em>) s'évaporent à l'arrêt du processus et formaliser le rôle pivot de la <strong>sérialisation</strong> (<em>marshalling</em>) et de la <strong>désérialisation</strong> (<em>unmarshalling</em>).</p>
    </div>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Comparer JSON & XML</h4>
      <p class="opacity-75">Identifier les balises, attributs et règles d'un document XML, exploiter <code>DOMParser</code> pour le lire, et comprendre pourquoi JSON s'est imposé comme le standard universel du Web moderne.</p>
    </div>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Maîtriser <code>JSON.stringify()</code> & <code>JSON.parse()</code></h4>
      <p class="opacity-75">Exploiter le paramètre <code>space</code>, le filtrage <code>replacer</code>, la méthode magique <code>toJSON()</code> sur une classe.</p>
    </div>
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Déjouer le Piège du Prototype Perdu</h4>
      <p class="opacity-75">Comprendre pourquoi <code>JSON.parse()</code> produit des objets littéraux simples sans méthodes, prouver l'échec d'<code>instanceof</code> et proscrire les bidouillages comme <code>Object.setPrototypeOf()</code>.</p>
    </div>
  </div>
</div>

<!--
Présentez ces 6 objectifs aux étudiants.
Insistez bien sur le fait que la matière d'aujourd'hui résout l'un des plus grands défis de tout développeur POO :
comment stocker ou envoyer des données sans détruire les classes que nous nous sommes donné tant de mal à concevoir dans les séances précédentes !
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques de la séance

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs flex-shrink-0">05</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Adopter le Patron DTO vs Entité Métier</h4>
      <p class="opacity-75">Découpler le contrat de transfert passif (<code>interface ArticleDTO</code>) de l'entité vivante (<code>class Article</code>) et bâtir des fabriques statiques <code>Article.fromDTO()</code> qui protègent les invariants.</p>
    </div>
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
## L'Entrée dans le Bloc D & Le Mystère des Données Persistantes

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Pourquoi toutes nos belles créations en mémoire vive disparaissent à chaque rafraîchissement et comment leur assurer une survie durable.
</p>

<!--
Prenez 3 minutes pour replacer cette séance dans la progression globale du cours.
Les étudiants doivent comprendre qu'ils ne découvrent pas un sujet isolé, mais la suite logique directe de tout ce qui précède.
-->

---
layout: default
---

# La progression du cursus POO

<div class="grid grid-cols-12 gap-2 mt-2 text-xs">
  <div class="col-span-3 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-blue-500 mb-1">BLOC A (S5 à S9)</div>
    <h3 class="font-bold mb-1">Fondamentaux POO</h3>
    <ul class="opacity-80 space-y-0.5 text-[10px]">
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

  <div class="col-span-3 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-indigo-500 mb-1">BLOC B (S10 à S12)</div>
    <h3 class="font-bold mb-1">Qualité & Mémoire</h3>
    <ul class="opacity-80 space-y-0.5 text-[10px]">
      <li>Exceptions métier & robustesse (S10)</li>
      <li>Principes SOLID : S, O, D (S11)</li>
      <li>Identité, Tas & Immutabilité (S12)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-center text-[10px]">
      Intégrité & Robustesse
    </div>
  </div>

  <div class="col-span-3 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-slate-500 mb-1">BLOC C (S13 à S15)</div>
    <h3 class="font-bold mb-1">Angular Signal-First</h3>
    <ul class="opacity-80 space-y-0.5 text-[10px]">
      <li>Composants & Signals (S13)</li>
      <li>Services & Injection DI (S14)</li>
      <li>Signal Forms & Routing (S15)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-700 dark:text-slate-300 font-semibold text-center text-[10px]">
      Interface & Réactivité
    </div>
  </div>

  <div class="col-span-3 p-2.5 rounded-xl bg-purple-500/10 border-2 border-purple-500/40">
    <div class="font-mono font-bold text-purple-500 mb-1">BLOC D (S16 à S19)</div>
    <h3 class="font-bold mb-1">Persistance</h3>
    <ul class="opacity-80 space-y-0.5 text-[10px]">
      <li><strong>Aujourd'hui : Formats & Sérialisation (S16)</strong></li>
      <li>APIs REST & <code>httpResource</code> (S17)</li>
      <li>LocalStorage & IndexedDB / Dexie.js (S18)</li>
      <li>Dexie.js Approfondi & CRUD (S19)</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-center text-[10px]">
      Survie Hors Mémoire
    </div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1.5">
    <span>💡</span> Le constat troublant des séances précédentes
  </div>
  <p class="opacity-85">
    Dans nos applications précédentes, nous avons conçu de superbes classes avec attributs privés (S05) et des formulaires complets (S15).
    Mais dès que l'utilisateur appuie sur <strong>F5</strong> ou ferme son navigateur : <strong>TOUT DISPARAÎT INSTANTANÉMENT !</strong>
    Nos instances ne vivent qu'en mémoire vive (RAM). Aujourd'hui, nous apprenons à leur donner une existence durable.
  </p>
</div>

<!--
Rappelez le fil conducteur :
En S05 : nous avons protégé l'état interne de nos objets (encapsulation).
En S14-S15 : nous avons injecté des services et validé des formulaires réactifs.
Mais ces objets étaient piégés dans la RAM de la machine de l'utilisateur.
Si on veut envoyer ces objets à un serveur ou les sauvegarder sur disque, on a un problème physique : un disque dur ne sait pas stocker un pointeur mémoire !
-->

---
layout: default
---

# La Grande Question du Bloc D

<div class="h-full flex flex-col justify-center items-center px-8 text-center">
  <div class="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 shadow-xl max-w-3xl">
    <div class="text-3xl mb-3">❓</div>
    <blockquote class="text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">
      « Comment faire franchir la frontière de la mémoire vive<br>
      à un graphe d'objets métier sans perdre son sens, sa structure,<br>
      ses données et ses <span class="text-purple-600 dark:text-purple-400 underline decoration-wavy">invariants de classe</span> ? »
    </blockquote>
    <div class="mt-4 text-xs font-mono font-semibold text-purple-600 dark:text-purple-400">
      — Le Défi Majeur de la Sérialisation en Programmation Orientée Objet
    </div>
  </div>
</div>

<!--
Lisez cette question solennellement.
Demandez aux étudiants : "À votre avis, qu'est-ce qui se passe si on essaie d'envoyer directement un objet new Article() dans un fichier texte ?"
Laissez-les réfléchir : un fichier texte ne comprend ni constructeur, ni méthodes, ni notions de classe.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 01
</div>

# La Problématique de la Persistance
## Sortir du Monde de la RAM : Volatilité vs Durabilité

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Comprendre la frontière physique entre le tas de la mémoire vive et le monde linéaire du stockage textuel.
</p>

<!--
Partie 1 : Posons les bases conceptuelles.
Cette partie est cruciale pour des étudiants qui découvrent la POO.
Ils doivent comprendre la différence physique entre un objet en RAM et une suite de caractères dans un fichier.
-->

---
layout: two-cols-header
---

# Le Monde de la RAM vs Le Monde de la Persistance

Deux univers d'exécution aux propriétés physiques radicalement différentes :

::left::

### 🧠 Le Monde de la RAM (Mémoire Vive)

<div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2 mt-2 me-1">
  <div class="flex items-start gap-2">
    <span class="text-blue-500 font-bold">⚡</span>
    <div><strong>Volatile :</strong> Disparaît instantanément à l'arrêt du processus, extinction ou touche F5.</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-blue-500 font-bold">🕸️</span>
    <div><strong>Graphe de pointeurs :</strong> Objets interconnectés par des adresses mémoire (<code>0x7ffee...</code>).</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-blue-500 font-bold">🏃</span>
    <div><strong>Instances vivantes :</strong> Possèdent des fonctions exécutables (méthodes du prototype).</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-blue-500 font-bold">🛡️</span>
    <div><strong>Champs privés :</strong> Protégés par les fermetures lexicales et le moteur JavaScript.</div>
  </div>
</div>

::right::

### 💾 Le Monde de la Persistance (Disque / Réseau)

<div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-2 mt-2">
  <div class="flex items-start gap-2">
    <span class="text-purple-500 font-bold">⏳</span>
    <div><strong>Durable :</strong> Conservé intact dans le temps (fichiers, bases de données, disques SSD).</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-purple-500 font-bold">📏</span>
    <div><strong>Séquence linéaire :</strong> Une simple suite unidimensionnelle de caractères ou d'octets.</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-purple-500 font-bold">🧊</span>
    <div><strong>Données passives :</strong> Données froides et muettes. Aucun code n'y est exécutable.</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-purple-500 font-bold">🌍</span>
    <div><strong>Universel :</strong> Compris par n'importe quelle machine (Linux, Windows, serveur Java...).</div>
  </div>
</div>

<!--
Expliquez bien la distinction :
En RAM, vous avez un graphe 3D d'objets vivants.
Sur le disque ou sur le réseau, vous n'avez qu'un fil plat 1D d'octets.
Le travail d'aujourd'hui consiste à faire passer nos objets de l'un à l'autre !
-->

---
layout: default
---

# Définition : Sérialisation & Désérialisation

Les deux opérations indispensables pour franchir la frontière de la mémoire vive :

<div class="grid grid-cols-2 gap-4 my-4">
  <div class="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-2xl">📦</span>
      <h3 class="text-base font-bold text-blue-700 dark:text-blue-300">La Sérialisation (Marshalling)</h3>
    </div>
    <p class="text-xs opacity-85 leading-relaxed">
      Processus de <strong>traduction</strong> d'un graphe d'objets résidant en mémoire vive vers un format séquentiel linéaire (texte ou binaire).
    </p>
    <div class="mt-3 p-2 rounded bg-blue-500/10 text-[11px] font-mono text-blue-800 dark:text-blue-200">
      Objet en RAM ➔ Séquence de caractères (JSON, XML...)
    </div>
  </div>

  <div class="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-2xl">🪄</span>
      <h3 class="text-base font-bold text-purple-700 dark:text-purple-300">La Désérialisation (Unmarshalling)</h3>
    </div>
    <p class="text-xs opacity-85 leading-relaxed">
      Opération symétrique inverse : lecture d'une séquence textuelle ou binaire pour <strong>reconstruire fidèlement</strong> une structure d'objets en mémoire vive.
    </p>
    <div class="mt-3 p-2 rounded bg-purple-500/10 text-[11px] font-mono text-purple-800 dark:text-purple-200">
      Chaîne de caractères ➔ Vraie instance d'objet en RAM
    </div>
  </div>
</div>

<div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15 text-xs text-center font-mono opacity-80">
  En JavaScript / TypeScript : <code>JSON.stringify()</code> sérialise · <code>JSON.parse()</code> lit la chaîne brute
</div>

<!--
Soulignez les deux termes équivalents :
Serialization / Deserialization (termes courants)
Marshalling / Unmarshalling (termes souvent utilisés en Java, Go ou systèmes distribués).
-->

---
layout: two-cols-header
---

# Analogie 1 : Le Meuble en Kit IKEA

Une métaphore concrète pour comprendre le voyage d'un objet :

::left::

<div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-3 me-1">
  <div class="flex items-center gap-2">
    <span class="text-xl">🚪</span>
    <h4 class="font-bold text-amber-700 dark:text-amber-300">L'armoire montée (Objet en RAM)</h4>
  </div>
  <p class="opacity-80">
    Une armoire en bois massif assemblée dans votre chambre : elle occupe un volume 3D, ses portes pivotent sur des charnières et ses tiroirs glissent sur des rails (ses <strong>méthodes</strong>).
  </p>
  <div class="p-2 rounded bg-amber-500/10 font-semibold">
    🚗 Impossible de la faire entrer montée dans le coffre d'une berline !
  </div>
</div>

::right::

<div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2.5">
  <div class="flex items-start gap-2">
    <span class="font-bold text-blue-600">1.</span>
    <div><strong>Sérialisation :</strong> Vous démontez l'armoire, retirez les charnières et placez chaque planche <em>à plat</em> dans un carton rectangulaire 2D standardisé.</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="font-bold text-blue-600">2.</span>
    <div><strong>Transport :</strong> Le carton plat voyage sans encombre sur l'autoroute (le câble réseau ou le disque).</div>
  </div>
  <div class="flex items-start gap-2">
    <span class="font-bold text-blue-600">3.</span>
    <div><strong>Désérialisation :</strong> Ouvrir le carton ne suffit pas ! Un tas de planches par terre ne permet pas de ranger des vêtements. Il faut la <strong>notice d'assemblage (votre classe POO)</strong> pour remonter les charnières et faire refonctionner les portes !</div>
  </div>
</div>

<!--
Cette analogie est fondamentale pour les étudiants débutants en POO !
Expliquez : si vous déposez juste les planches par terre dans votre salon, est-ce que c'est une armoire ? Non, c'est juste du bois plat.
C'est exactement ce que fait JSON.parse() : il pose les planches sur la moquette, mais ne remonte pas les charnières (les méthodes) !
-->

---
layout: default
---

# Le Bilan des Pertes : Ce qui survit vs Ce qui meurt

Le passage au format texte impose un **sacrifice technique majeur** :

<div class="grid grid-cols-2 gap-4 mt-3 text-xs">
  <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <h4 class="font-bold text-sm text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
      <span>✅</span> CE QUI SURVIT (Transmis intact)
    </h4>
    <ul class="space-y-1.5 opacity-85">
      <li><strong>Les valeurs scalaires primitives :</strong> chaînes (<code>string</code>), nombres (<code>number</code>), booléens (<code>boolean</code>).</li>
      <li><strong>La structure arborescente :</strong> objets imbriqués (<code>{...}</code>) et tableaux ordonnés (<code>[...]</code>).</li>
      <li><strong>La valeur <code>null</code> :</strong> absence explicite de valeur.</li>
      <li><strong>Les noms des clés :</strong> identifiants des propriétés publiques.</li>
    </ul>
  </div>

  <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <h4 class="font-bold text-sm text-rose-700 dark:text-rose-300 mb-2 flex items-center gap-1.5">
      <span>❌</span> CE QUI MEURT (Détruit au passage)
    </h4>
    <ul class="space-y-1.5 opacity-85">
      <li><strong>Les méthodes et fonctions exécutables :</strong> totalement ignorées ou effacées !</li>
      <li><strong>Le prototype de classe :</strong> l'objet n'appartient plus à votre classe.</li>
      <li><strong>Les attributs privés :</strong> champs <code>#champ</code> ou closures inaccessibles.</li>
      <li><strong>Les types avancés :</strong> les objets <code>Date</code> deviennent de bêtes chaînes de caractères ; <code>Set</code> et <code>Map</code> deviennent des objets vides <code>{}</code>.</li>
      <li><strong>Les références circulaires :</strong> font planter le sérialiseur avec une exception fatale.</li>
    </ul>
  </div>
</div>

<div class="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 font-semibold text-center">
  ⚠️ Règle fondamentale : La sérialisation ne conserve que les données passives. Toute la dynamique comportementale de la POO s'éteint !
</div>

<!--
Passez 2 minutes sur cette diapositive.
Chaque élément de la colonne rouge est un piège classique rencontré par les étudiants.
Posez la question : "Pourquoi à votre avis JSON.stringify() refuse de sérialiser une fonction ?"
Réponse : Une fonction dépend de son environnement d'exécution, d'un moteur JavaScript spécifique, et poserait d'immenses failles de sécurité si on exécutait du code texte inconnu.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 02
</div>

# Duel des Formats : JSON vs XML
## Histoire, Anatomie & Comparaison Technique

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Pourquoi XML a dominé le monde de l'entreprise avant d'être détrôné par l'élégance et la légèreté de JSON.
</p>

<!--
Partie 2 : Présentons les deux grands formats textuels.
Le but n'est pas d'apprendre à écrire des méga-schémas XML, mais de savoir le reconnaître,
comprendre son anatomie et savoir extraire ses données avec DOMParser quand on en rencontre dans la vraie vie.
-->

---
layout: two-cols-header
---

# Histoire & Contexte : Du Règne de XML à l'Hégémonie de JSON

Deux époques, deux philosophies de l'ingénierie logicielle :

::left::

### Le Règne de XML (1998 - 2010)

<div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs space-y-2 mt-2 me-1">
  <p class="opacity-80">
    Issu du standard SGML et officialisé par le W3C en 1998, le <strong>XML</strong> (<em>eXtensible Markup Language</em>) visait à unifier l'échange de documents structurés entre serveurs hétérogènes.
  </p>
  <ul class="list-disc list-inside space-y-1 opacity-75">
    <li>Pilier des protocoles d'entreprise lourds (<strong>SOAP</strong>, WSDL).</li>
    <li>Utilisé dans les formats bureautiques (DOCX, ODT) et SVG.</li>
    <li>Validation ultra-stricte via schémas <strong>XSD</strong> et DTD.</li>
    <li>Problème majeur : <em>extrêmement verbeux et lourd à parser</em>.</li>
  </ul>
</div>

::right::

### La Révolution JSON (2001 - ...)

<div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2 mt-2">
  <p class="opacity-80">
    Popularisé au début des années 2000 par l'ingénieur <strong>Douglas Crockford</strong>, le <strong>JSON</strong> (<em>JavaScript Object Notation</em>) est un sous-ensemble direct de la notation littérale d'objets JavaScript.
  </p>
  <ul class="list-disc list-inside space-y-1 opacity-75">
    <li>Taillé pour la légèreté et les navigateurs web naissants.</li>
    <li>Standard incontesté des <strong>APIs REST</strong> et des <strong>SPA</strong>.</li>
    <li>Grammaire minimale tenant sur une seule page de spécification (RFC 8259).</li>
    <li>Parsing natif ultra-rapide dans tous les langages modernes.</li>
  </ul>
</div>

<!--
Expliquez le contexte historique :
Dans les années 2000, le monde professionnel jurait que XML dominerait pour toujours.
Puis le Web 2.0 est arrivé avec AJAX. Les navigateurs ont trouvé XML trop lent et trop complexe,
et JSON a tout balayé sur son passage en quelques années.
-->

---
layout: default
---

## Anatomie du XML : Savoir le Reconnaître et le Lire

Vous n'aurez que très rarement à *produire* du XML, mais vous devez savoir le **reconnaître et l'extraire** :

<div class="grid grid-cols-5 gap-2 my-3 text-[11px]">
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-blue-500 mb-1">1. Prologue</div>
    <p class="opacity-75">Indique version et encodage<br><code>&lt;?xml version="1.0" ... ?&gt;</code></p>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-indigo-500 mb-1">2. Racine Unique</div>
    <p class="opacity-75">Une et une seule balise englobante obligatoire pour tout le document.</p>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-purple-500 mb-1">3. Fermeture Stricte</div>
    <p class="opacity-75">Toute balise ouverte doit être fermée (<code>&lt;item&gt;&lt;/item&gt;</code> ou <code>&lt;item /&gt;</code>).</p>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-amber-500 mb-1">4. Pas de Chevauchement</div>
    <p class="opacity-75">Hiérarchie purement arborescente : <code>&lt;a&gt;&lt;b&gt;&lt;/b&gt;&lt;/a&gt;</code> obligatoire.</p>
  </div>
  <div class="p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-emerald-500 mb-1">5. Attributs Cités</div>
    <p class="opacity-75">Valeurs d'attributs toujours entre guillemets : <code>id="ART-101"</code>.</p>
  </div>
</div>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- catalogue_export.xml (Données patrimoniales d'entrepôt) -->
<catalogue depot="Bruxelles-Nord" dateExport="2026-10-06">
  <article id="ART-101" statut="disponible">
    <designation>Clavier Mécanique Ergonomique</designation>
    <prixHT devise="EUR">129.99</prixHT>
    <tauxTVA>21</tauxTVA>
    <categories>
      <categorie>Informatique</categorie>
      <categorie>Périphériques</categorie>
    </categories>
  </article>
</catalogue>
```

<!--
Faites observer l'exemple XML aux étudiants :
Montrez les balises d'ouverture et de fermeture (<article> ... </article>).
Montrez les attributs (depot="Bruxelles-Nord", id="ART-101").
Insistez sur la verbosité : on répète chaque nom de balise deux fois !
-->

<style>
  pre code {
    font-size: 12px !important;
  }
</style>

---
layout: two-cols-header
---

# Notions XML Avancées à Savoir Identifier

Des constructions que vous rencontrerez immanquablement dans les flux d'entreprise :

::left::

### 🔤 Les Entités d'Échappement

Les caractères réservés de la syntaxe XML doivent être échappés pour éviter les collisions :

<div class="p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/15 text-xs font-mono space-y-1 me-1">
  <div><code>&lt;</code> ➔ <strong>&amp;lt;</strong> (less than)</div>
  <div><code>&gt;</code> ➔ <strong>&amp;gt;</strong> (greater than)</div>
  <div><code>&amp;</code> ➔ <strong>&amp;amp;</strong> (ampersand)</div>
  <div><code>"</code> ➔ <strong>&amp;quot;</strong> (double quote)</div>
  <div><code>'</code> ➔ <strong>&amp;apos;</strong> (apostrophe)</div>
</div>

```xml
<!-- Exemple : -->
<description>
  Processeur &lt; 3.5 GHz &amp; RAM &gt; 16 Go
</description>
```

::right::

### 📦 CDATA & Espaces de Noms

<div class="space-y-3 text-xs">
  <div class="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">Sections CDATA (Character Data) :</strong><br>
    Permet d'embarquer du texte brut contenant des caractères interdits sans échappement manuel :
    <div class="mt-1 font-mono text-[10px] bg-slate-800 text-slate-100 p-1 rounded">
      &lt;![CDATA[ &lt;p&gt;Texte HTML &amp; brut sans risque !&lt;/p&gt; ]]&gt;
    </div>
  </div>

  <div class="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Espaces de noms (Namespaces) :</strong><br>
    Préfixent les balises pour éviter les collisions de noms dans les documents composites :
    <div class="mt-1 font-mono text-[10px] bg-slate-800 text-slate-100 p-1 rounded">
      &lt;gest:client xmlns:gest="https://eafc.be/gestion"&gt;
    </div>
  </div>
</div>

<!--
Expliquez pourquoi CDATA existe :
Si on veut stocker un extrait de code JavaScript ou un morceau de HTML dans une balise XML,
sans CDATA, le parser XML croirait que les <script> ou <div> sont des balises XML !
-->

---
layout: default
---

## Comment lire du XML dans le navigateur avec `DOMParser` ?

Les navigateurs modernes fournissent une API native pour transformer une chaîne XML en arbre DOM :

```typescript
const xmlSource = `
  <catalogue>
    <article id="ART-101">
      <designation>Souris Optique</designation>
      <prixHT>24.50</prixHT>
    </article>
  </catalogue>
`;
// Instanciation du parser natif W3C
const parser = new DOMParser();
const documentXml = parser.parseFromString(xmlSource, 'application/xml');
// 🛡️ Détection d'erreur de syntaxe obligatoire !
const parseError = documentXml.querySelector('parsererror');
if (parseError) {
  throw new Error(`Erreur de syntaxe XML : ${parseError.textContent}`);
}
// Extraction des données via l'API DOM standard (querySelectorAll / querySelector)
const noeudArticle = documentXml.querySelector('article');
const id = noeudArticle?.getAttribute('id'); // 'ART-101'
const designation = noeudArticle?.querySelector('designation')?.textContent ?? '';
const prixHT = parseFloat(noeudArticle?.querySelector('prixHT')?.textContent ?? '0');
```

<!--
Faites remarquer la ligne 12 : parsererror !
Contrairement à JSON.parse() qui lève un catch SyntaxError, DOMParser renvoie un document XML valide
contenant une balise spéciale nommée <parsererror>.
C'est un piège d'examen classique ! Il faut obligatoirement tester documentXml.querySelector('parsererror').
-->

<style>
  pre code {
    font-size: 12px !important;
  }
</style>

---
layout: default
---

## Anatomie du JSON : Le Format Universel du Web

L'équivalent exact du document XML précédent sous forme de document JSON :

```json
{
  "depot": "Bruxelles-Nord",
  "dateExport": "2026-10-06T18:30:00.000Z",
  "articles": [
    {
      "id": "ART-101",
      "statut": "disponible",
      "designation": "Clavier Mécanique Ergonomique",
      "prixHT": 129.99,
      "tauxTVA": 21,
      "categories": ["Informatique", "Périphériques"]
    },
    {
      "id": "ART-102",
      "statut": "reapprovisionnement",
      "designation": "Écran UltraWide 34 pouces",
      "prixHT": 489.00,
      "tauxTVA": 21,
      "categories": ["Affichage"]
    }
  ]
}
```

<div class="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
  <div class="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 font-bold text-blue-700 dark:text-blue-300">
    📐 Zéro balise fermante répétée
  </div>
  <div class="p-1.5 rounded bg-indigo-500/10 border border-indigo-500/20 font-bold text-indigo-700 dark:text-indigo-300">
    🔢 Nombres typés nativement (129.99)
  </div>
  <div class="p-1.5 rounded bg-purple-500/10 border border-purple-500/20 font-bold text-purple-700 dark:text-purple-300">
    📋 Tableaux naturels [ ... ]
  </div>
</div>

<!--
Comparez visuellement avec la diapositive XML :
Le document JSON est 40% plus court, immédiatement lisible et les tableaux sont natifs.
Pas besoin d'inventer des balises <categories><categorie>...</categorie></categories>.
-->

<style>
  pre code {
    font-size: 12px !important;
  }
</style>

---
layout: two-cols-header
---

# Les Types Primitifs Autorisés par la Spécification JSON

La norme RFC 8259 est impitoyable : **rigoureusement 6 types autorisés et rien d'autre** :

::left::

<div class="space-y-2 text-xs me-1">
  <div class="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">1. Chaîne (<code>string</code>) :</strong><br>
    Délimitée <u>exclusivement par des guillemets doubles <code>"</code></u>. Les apostrophes <code>'</code> et backticks sont formellement interdits !
  </div>

  <div class="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
    <strong class="text-indigo-600 dark:text-indigo-400">2. Nombre (<code>number</code>) :</strong><br>
    Entiers ou flottants (<code>42</code>, <code>-12.5</code>, <code>1.5e3</code>). Pas de distinction int/float. <code>NaN</code> et <code>Infinity</code> sont strictement interdits !
  </div>

  <div class="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
    <strong class="text-teal-600 dark:text-teal-400">3. Booléen (<code>boolean</code>) :</strong><br>
    Uniquement <code>true</code> ou <code>false</code> en minuscules.
  </div>
</div>

::right::

<div class="space-y-2 text-xs ms-1">
  <div class="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
    <strong class="text-amber-600 dark:text-amber-400">4. Valeur nulle (<code>null</code>) :</strong><br>
    Représente l'absence délibérée de valeur.
  </div>

  <div class="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">5. Tableau (<code>array</code>) :</strong><br>
    Liste ordonnée de valeurs délimitée par des crochets <code>[...]</code>.
  </div>

  <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">6. Objet (<code>object</code>) :</strong><br>
    Collection clé/valeur <code>{...}</code>. <u>Chaque clé doit impérativement être entre guillemets doubles <code>"cle"</code></u> !
  </div>
</div>

<!--
Insistez lourdement auprès des étudiants :
En JavaScript pur, on peut écrire { nom: 'Alice' }.
En JSON strict, c'est {"nom": "Alice"} !
Les guillemets simples provoquent un SyntaxError immédiat.
-->

---
layout: default
---

## 🛑 Ce que JSON Interdit Strictement (Les Pièges Capitaux)

Attention aux fausses croyances des développeurs JavaScript débutants :

<div class="grid grid-cols-2 gap-3 mt-3 text-xs">
  <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">❌ Pas de valeur <code>undefined</code> :</strong>
    <p class="opacity-80 mt-0.5">Dans un objet, la propriété est purement effacée par <code>JSON.stringify</code>. Dans un tableau, elle devient <code>null</code>.</p>
  </div>

  <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">❌ Pas de type <code>Date</code> natif :</strong>
    <p class="opacity-80 mt-0.5">Une instance <code>Date</code> est irréversiblement transformée en simple texte ISO (<code>"2026-10-06T18:00:00Z"</code>).</p>
  </div>

  <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">❌ Pas de fonctions ni méthodes :</strong>
    <p class="opacity-80 mt-0.5">Une fonction passée à <code>JSON.stringify</code> est ignorée ou convertie en <code>null</code>.</p>
  </div>

  <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">❌ Pas de type <code>BigInt</code> :</strong>
    <p class="opacity-80 mt-0.5">Tenter de sérialiser <code>100n</code> lève immédiatement : <code>TypeError: Do not know how to serialize a BigInt</code>.</p>
  </div>

  <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">❌ Pas de <code>Map</code> ni de <code>Set</code> :</strong>
    <p class="opacity-80 mt-0.5">Un <code>Set</code> devient un objet vide <code>{}</code> ! Une <code>RegExp</code> devient <code>{}</code>.</p>
  </div>

  <div class="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">❌ Pas de virgule traînante ni de commentaires :</strong>
    <p class="opacity-80 mt-0.5"><code>{"a": 1,}</code> est une erreur fatale. Tout commentaire <code>//</code> ou <code>/* */</code> fait crasher le parser.</p>
  </div>
</div>

<!--
Prenez le temps d'illustrer la virgule traînante (trailing comma) :
En TypeScript moderne, on met des virgules après le dernier élément des tableaux et objets.
En JSON, c'est l'erreur numéro 1 qui fait crasher JSON.parse !
-->

---
layout: default
---

# Tableau Comparatif Exhaustif : JSON vs XML

<div class="mt-2 text-xs">

| Critère d'évaluation | JSON (JavaScript Object Notation) | XML (eXtensible Markup Language) |
| :--- | :--- | :--- |
| **Philosophie** | Échange de données brutes légères | Balisage sémantique de documents riches |
| **Syntaxe & Poids** | Très concis, compact, lisibilité immédiate | Verbeux (balises d'ouverture et de fermeture répétées) |
| **Typage natif** | Typé : distingue `string`, `number`, `boolean`, `null` | Tout est texte brut (les nombres doivent être parsés manuellement) |
| **Structure de listes** | Tableaux natifs délimités par `[...]` | Répétition d'éléments balisés (`<item>...</item>`) |
| **Intégration JS/TS** | Native, ultra-rapide (`JSON.parse` / `stringify`) | Nécessite `DOMParser` ou une bibliothèque tierce |
| **Distinction Valeur / Méta** | Unique : tout est propriété d'un objet | Double : distinction complexe entre Éléments et Attributs |
| **Commentaires** | ❌ Strictement interdits par la norme RFC | ✅ Autorisés (`<!-- commentaire -->`) |
| **Cas d'usages modernes** | APIs REST, communication SPA, bases NoSQL | Fichiers bancaires (SEPA), SVG, bureautique (DOCX), configs |

</div>

<!--
Parcourez ce tableau pour ancrer les différences chez les étudiants.
Conclusion : JSON gagne pour le Web et les APIs, mais XML reste vivant dans les banques, l'administration et les formats bureautiques.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 03
</div>

# Sérialisation & Désérialisation en TypeScript
## Mécanismes Secrets, Paramètres Avancés & Pièges

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Explorer les signatures complètes de <code>JSON.stringify()</code> et <code>JSON.parse()</code> pour maîtriser l'indentation, le filtrage et la réhydratation.
</p>

<!--
Partie 3 : Entrons dans le code TypeScript concret !
La plupart des développeurs pensent que JSON.stringify ne prend qu'un paramètre.
Aujourd'hui, ils vont découvrir le replacer, le space, la méthode toJSON() et le reviver !
-->

---
layout: two-cols-header
---

## `JSON.stringify()` : Signature & Paramètre `space`

La méthode native de sérialisation possède 3 paramètres :

```typescript
JSON.stringify(value: any, replacer?: Function | (string | number)[], space?: string | number): string
```

::left::

### 1. Format Compact (Défaut)

Par défaut, `JSON.stringify` produit une chaîne sans le moindre espace pour minimiser la taille réseau :

```typescript
const config = {
  theme: 'dark',
  autoSave: true,
  maxRetries: 3
};

console.log(JSON.stringify(config));
// '{"theme":"dark","autoSave":true,"maxRetries":3}'
```

::right::

### 2. Format Lisible (`space = 2`)

Le 3ᵉ argument indente le texte pour les logs, fichiers de configuration ou affichage IHM :

```typescript
console.log(JSON.stringify(config, null, 2));
/*
{
  "theme": "dark",
  "autoSave": true,
  "maxRetries": 3
}
*/
```

<div class="mt-2 p-2 rounded bg-blue-500/10 text-[11px] text-blue-700 dark:text-blue-300 font-semibold">
  💡 Pratique pour afficher du JSON lisible dans un <code>&lt;textarea&gt;</code> de débogage !
</div>

<!--
Expliquez que le null au milieu est le replacer inutilisé.
Le 2 signifie : 2 espaces d'indentation par niveau de profondeur.
-->

<style>
  pre code {
    font-size: 12px !important;
  }
</style>

---
layout: two-cols-header
---

### Le Paramètre `replacer` : Filtrer & Transformer

Le second argument de `JSON.stringify` permet d'intercepter chaque valeur sérialisée :

::left::

<div class="me-1">

#### 📋 En Liste Blanche (Tableau)

Fournir un tableau de chaînes filtre les clés autorisées :

```typescript {maxHeight:'300px'}
const utilisateur = {
  id: 1,
  pseudo: 'Alice',
  motDePasseHash: 'secret$123',
  email: 'alice@eafc.be'
};
// N'exporter que l'id et le pseudo :
const jsonPublic = JSON.stringify(
  utilisateur,
  ['id', 'pseudo'],
  2
);
console.log(jsonPublic);
/*
{
  "id": 1,
  "pseudo": "Alice"
}
*/
```

</div>

::right::

#### ⚙️ En Fonction de Transformation

Une fonction recevant `(cle, valeur)` pour modifier ou supprimer :

```typescript
const donnees = {
  nom: 'Produit A',
  prix: 100,
  secret: 'CONFIDENTIEL'
};

const jsonFiltre = JSON.stringify(donnees, (cle, valeur) => {
  // 🛑 Supprime définitivement la propriété !
  if (cle === 'secret') return undefined;

  // Transforme les nombres en chaînes avec devise :
  if (typeof valeur === 'number') return `${valeur} €`;

  return valeur; // Conserve le reste
});
```

<!--
Soulignez l'astuce de la ligne 12 à droite :
Renvoyer undefined dans une fonction replacer supprime la clé de la sortie finale !
C'est un moyen puissant d'assainir des données avant envoi.
-->

<style>
  pre code {
    font-size: 12px !important;
  }
</style>

---
layout: default
---

## La Méthode Magique `toJSON()` sur une Classe POO

L'incarnation parfaite du principe d'encapsulation (Séance 05) appliqué à la persistance :

<div class="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold mb-3">
  👑 Si une classe implémente une méthode <code>toJSON()</code>, <code>JSON.stringify()</code> lui délègue prioritairement sa sérialisation. L'objet décide lui-même de ce qu'il accepte de divulguer !
</div>

```typescript {maxHeight:'350px'}
export class CompteBancaire {
  readonly #iban: string;
  #solde: number;
  readonly #codeSecret: string; // 🔒 Donnée ultrasensible qui ne doit JAMAIS fuiter !

  constructor(iban: string, soldeInitial: number, codeSecret: string) {
    this.#iban = iban;
    this.#solde = soldeInitial;
    this.#codeSecret = codeSecret;
  }
  // Hook automatique invoqué par JSON.stringify() :
  toJSON(): object {
    return {
      iban: this.#iban,
      solde: this.#solde,
      exporteLe: new Date().toISOString()
      // Le code secret est délibérément exclu : protection absolue !
    };
  }
}
const compte = new CompteBancaire('BE76-1234-5678-9012', 1500, 'PIN-9999');
console.log(JSON.stringify(compte, null, 2));
// Sortie : Seuls 'iban', 'solde' et 'exporteLe' apparaissent. Zéro fuite de sécurité !
```

<!--
Demandez aux étudiants : "Pourquoi est-ce magique ?"
Parce que même si quelqu'un fait un JSON.stringify(compte) n'importe où dans l'application,
la méthode toJSON() s'exécute automatiquement.
C'est la classe elle-même qui contrôle sa frontière de diffusion.
-->

<style>
  pre code {
    font-size: 12px !important;
  }
</style>



---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 04
</div>

# Le Grand Défi de la POO : Réhydratation & Prototypes
## L'Illusion de la Désérialisation & Le Patron DTO

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Pourquoi le cast naïf <code>as Article</code> mène au crash garanti et comment restaurer les prototypes avec le patron DTO et la fabrique <code>fromDTO()</code>.
</p>

<!--
Voici le cœur battant de la séance !
C'est ici qu'on fait le lien entre la POO et la persistance.
Soyez très attentif aux réactions des étudiants sur cette partie.
-->

---
layout: default
---

# Le Piège : `JSON.parse` ne connaît pas vos classes

Un cast `as` ne fabrique aucun objet, il demande seulement au compilateur de faire confiance :

<div class="grid grid-cols-3 gap-4 items-start mt-2">
<div class="col-span-2">

```typescript
class Tache {
  constructor(public id: string, public titre: string) {}

  terminer(): void { /* ... */ }
}

const original = new Tache('T1', 'Réviser le cours');
const texte = JSON.stringify(original);
// '{"id":"T1","titre":"Réviser le cours"}'

const restaure = JSON.parse(texte) as Tache;

console.log(restaure instanceof Tache); // false
restaure.terminer();                    // 💥 TypeError : terminer is not a function
```

</div>
<div class="col-span-1 text-xs space-y-3">

<div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
<strong class="text-rose-600 dark:text-rose-400">Pourquoi ?</strong>
<p class="opacity-80 mt-1">Le <code>as</code> disparaît à la compilation. <code>JSON.parse()</code> crée un simple objet littéral relié à <code>Object.prototype</code>, jamais à <code>Tache.prototype</code>.</p>
</div>

<div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
<strong>À éviter :</strong>
<p class="opacity-80 mt-1"><code>Object.setPrototypeOf()</code> et <code>Object.assign()</code> contournent le constructeur, donc ses validations.</p>
</div>

</div>
</div>

<!--
Demandez d'abord aux étudiants ce qu'affiche instanceof, puis montrez le résultat.
Message clé : le constructeur est le gardien de l'objet, et JSON.parse ne l'appelle jamais.
-->

---
layout: default
---

# La Solution : DTO (*Data Transfer Object*) vs Entité Métier

Le patron d'architecture éprouvé : dissocier le contrat de transport de la forteresse métier :

<div class="grid grid-cols-2 gap-4 my-3 text-xs">
  <div class="p-3 rounded-xl bg-blue-500/10 border-2 border-blue-500/30">
    <div class="flex items-center gap-2 mb-1.5">
      <span class="text-xl">📄</span>
      <h4 class="font-bold text-sm text-blue-700 dark:text-blue-300">Le DTO (<code>interface ArticleDTO</code>)</h4>
    </div>
    <p class="opacity-80 mb-2">Structure de données purement descriptive, passive et muette :</p>
    <ul class="space-y-1 opacity-75 list-disc list-inside">
      <li><strong>Aucune méthode</strong>, aucun comportement.</li>
      <li>Types primitifs 100% compatibles JSON (les dates sont des <code>string</code> ISO).</li>
      <li>Sert de contrat pour le réseau et le stockage.</li>
    </ul>
  </div>

  <div class="p-3 rounded-xl bg-purple-500/10 border-2 border-purple-500/30">
    <div class="flex items-center gap-2 mb-1.5">
      <span class="text-xl">🏰</span>
      <h4 class="font-bold text-sm text-purple-700 dark:text-purple-300">L'Entité Métier (<code>class Article</code>)</h4>
    </div>
    <p class="opacity-80 mb-2">La forteresse vivante du domaine métier :</p>
    <ul class="space-y-1 opacity-75 list-disc list-inside">
      <li><strong>Constructeur robuste</strong> validant chaque invariant.</li>
      <li>Méthodes métier (<code>calculerPrixTTC()</code>).</li>
      <li>Attributs privés et getters encapsulés.</li>
      <li>Fabrique statique de réhydratation (<code>fromDTO</code>).</li>
    </ul>
  </div>
</div>

<!--
Cette distinction DTO vs Entité est universelle : on la retrouve en Java, C#, Python, TypeScript...
Le DTO est une enveloppe postale.
L'Entité est la personne vivante qui écrit et lit la lettre.
-->

---
layout: default
---

# Le Cycle Complet en Une Ligne

Chaque passage entre la RAM et le fichier a un rôle précis :

<div class="flex flex-wrap items-center justify-center gap-2 mt-10 text-xs font-mono font-bold">
  <span class="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300">Tache (RAM)</span>
  <span class="opacity-60">→</span>
  <span class="px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300">toDTO()</span>
  <span class="opacity-60">→</span>
  <span class="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300">JSON.stringify()</span>
  <span class="opacity-60">→</span>
  <span class="px-3 py-2 rounded-xl bg-slate-500/10 border border-slate-500/30">taches.json</span>
  <span class="opacity-60">→</span>
  <span class="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">JSON.parse()</span>
  <span class="opacity-60">→</span>
  <span class="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">Tache.fromDTO()</span>
</div>

<div class="grid grid-cols-2 gap-3 mt-10 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong>Sortie :</strong> <code>toDTO()</code> donne une structure plate, sans méthodes. <code>JSON.stringify()</code> en fait du texte.
  </div>
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong>Entrée :</strong> <code>JSON.parse()</code> donne une donnée brute. <code>fromDTO()</code> reconstruit une vraie <code>Tache</code>, et le constructeur revalide tout.
  </div>
</div>

<!--
Ce schéma remplace les anciens diagrammes : retenez seulement l'entrée et la sortie.
fromDTO() est le seul endroit où l'on réhydrate l'objet métier.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 05
</div>

# Pièges Fréquents & Anti-Patterns
## Les 5 Erreurs

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Identifier les pièges récurrents commis lors des premiers projets de persistance et adopter les réflexes indispensables.
</p>

<!--
Partie 5 : Revue critique des erreurs.
Cette section est conçue pour éviter aux étudiants de perdre des heures lors des futurs TP et de l'examen.
-->

---
layout: default
---

# Tableau des 5 Anti-Patterns Majeurs

<div class="mt-2 text-xs">

| Anti-Pattern fréquent | Pourquoi c'est une défaillance grave | Solution d'ingénierie conforme |
| :--- | :--- | :--- |
| **Le Cast naïf `as MaClasse`** | `JSON.parse(str) as Article` trompe le compilateur. Au runtime, `instanceof` échoue et les méthodes lèvent des `TypeError`. | Utiliser une fabrique statique : `Article.fromDTO(dto)`. |
| **Le syndrome de la Date stringifiée** | Oublier que `JSON.stringify` transforme les `Date` en chaînes ISO. Appeler `.getFullYear()` plante : `not a function`. | Réhydrater avec `new Date(dto.date)` dans la fabrique ou utiliser le `reviver`. |
| **La référence circulaire mortelle** | Deux objets se référençant mutuellement (`a.b = b; b.a = a;`). `JSON.stringify` boucle à l'infini et plante avec une exception fatale. | Rompre les boucles dans les DTOs ou utiliser un `replacer` coupant les références arrière. |
| **La fuite de données confidentielles** | Sérialiser directement une entité utilisateur contenant un mot de passe haché ou un token secret. | Implémenter la méthode `toJSON()` sur la classe ou projeter vers un DTO d'exposition sécurisé. |
| **Le parsing sans filet de sécurité** | Appeler `JSON.parse(str)` sans bloc `try / catch`. Si la chaîne est altérée, l'exception non gérée crashe l'application. | Encapsuler systématiquement dans un `try / catch` et convertir en exception applicative typée (S10). |

</div>

<!--
Lisez chaque ligne avec les étudiants.
Insistez sur la référence circulaire : "Qu'arrive-t-il si un parent a une liste d'enfants, et chaque enfant a une propriété parent ?"
JSON.stringify essaie de sérialiser le parent, qui sérialise l'enfant, qui sérialise le parent... et boum ! Maximum call stack exceeded.
-->


---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 06
</div>

# Démonstration : enregistrer dans un fichier depuis le navigateur
## Angular 22 · API File System Access · un seul fichier JSON

<p class="opacity-70 text-sm max-w-xl mx-auto">
  On ouvre un fichier, on ajoute des tâches avec un formulaire, on enregistre.
</p>

<!--
Partie 6 : la démonstration en direct.
Annoncez le plan avant de toucher au code, puis faites la démo dans le navigateur.
-->

---
layout: default
---

# Pourquoi pas comme une app Java ou C# ?

<div class="grid grid-cols-2 gap-4 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-700 dark:text-blue-300">Application desktop (Java, C#)</strong>
    <p class="opacity-80 mt-1">Le programme tourne sur la machine avec les droits de l'utilisateur, et écrit où il veut.</p>
    <div class="font-mono text-[11px] bg-slate-800 text-slate-100 p-2 rounded mt-2">Files.writeString(Path.of("taches.json"), json);</div>
    <div class="font-mono text-[11px] bg-slate-800 text-slate-100 p-2 rounded mt-1">File.WriteAllText("taches.json", json);</div>
  </div>
  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-700 dark:text-purple-300">Application web (Angular)</strong>
    <p class="opacity-80 mt-1">Le code tourne dans un onglet, dans une sandbox. Il n'a pas accès au disque : c'est l'utilisateur qui choisit le fichier, via une boîte de dialogue du navigateur.</p>
    <div class="font-mono text-[11px] bg-slate-800 text-slate-100 p-2 rounded mt-2">await window.showSaveFilePicker({ ... });</div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
  Autres solutions pour le web : <code>localStorage</code>, export/import JSON, ou un backend (Spring Boot).
</div>

<!--
Point clé : ce n'est pas Angular qui limite, c'est le navigateur.
Demandez aux étudiants qui ont déjà écrit un fichier en Java ou C# : quelle était la différence de contexte ?
-->

---
layout: default
---

## Étape 1 : Le modèle (`tache.ts`)

<div class="grid grid-cols-4 gap-4 items-start mt-2">
<div class="col-span-3">

```typescript {maxHeight:'425px'}
// tache.ts
export interface TacheDTO {
  id: string;
  titre: string;
  echeance: string;   // date ISO, ex. "2026-11-02"
  terminee: boolean;
}

export class Tache {
  constructor(
    public id: string,
    public titre: string,
    public echeance: string,
    public terminee = false,
  ) {
    if (titre.trim() === '') throw new Error('Titre obligatoire.');
  }

  static fromDTO(dto: TacheDTO): Tache {
    return new Tache(dto.id, dto.titre, dto.echeance, dto.terminee);
  }
}
```

</div>
<div class="col-span-1 text-xs space-y-3">

<div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
<strong class="text-blue-700 dark:text-blue-300">Le constructeur valide</strong>
<p class="opacity-80 mt-1">Il est appelé aussi bien à la création qu'à la réhydratation : les règles restent les mêmes.</p>
</div>

<div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
<strong>Garde de type</strong>
<p class="opacity-80 mt-1">Le JSON lu est un <code>unknown</code> : on vérifie sa forme avant de l'utiliser.</p>
</div>

</div>
</div>

<!--
Rappelez le piège : JSON.parse ne rappelle pas le constructeur. C'est fromDTO() qui le fait.
-->

<style>
  pre code {
    font-size: 12px !important;
  }
</style>

---
layout: default
---

### Étape 2 : Ouvrir et enregistrer (service)

<div class="grid grid-cols-4 gap-4 items-start mt-2">
<div class="col-span-3">

```typescript
// tache-persistance.service.ts
import { Injectable, signal } from '@angular/core';
import { Tache } from './tache';

@Injectable({ providedIn: 'root' })
export class TachePersistanceService {
  readonly taches = signal<Tache[]>([]);

  async ouvrir(): Promise<void> {
    const [handle] = await window.showOpenFilePicker();
    const data = JSON.parse(await (await handle.getFile()).text());
    this.taches.set(data.map(Tache.fromDTO));
  }

  async enregistrer(): Promise<void> {
    const handle = await window.showSaveFilePicker({ suggestedName: 'taches.json' });
    const flux = await handle.createWritable();
    await flux.write(JSON.stringify(this.taches(), null, 2));
    await flux.close();
  }
}
```

</div>
<div class="col-span-1 text-xs space-y-3">

<div class="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
<strong class="text-indigo-700 dark:text-indigo-300">Le handle</strong>
<p class="opacity-80 mt-1">Une référence vers le fichier choisi. On la garde pour ne pas redemander le chemin à chaque enregistrement.</p>
</div>

<div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
<strong class="text-amber-700 dark:text-amber-300">Clic obligatoire</strong>
<p class="opacity-80 mt-1">Les boîtes de dialogue ne s'ouvrent que suite à un clic de l'utilisateur.</p>
</div>

</div>
</div>

<!--
Montrez les deux appels window.showOpenFilePicker et window.showSaveFilePicker : c'est le navigateur qui affiche la fenêtre, pas le code.
-->

<style>
  pre code {
    font-size: 11px !important;
  }
</style>

---
layout: default
---

# Étape 3 : Le formulaire (`ngModel`)

<div class="grid grid-cols-3 gap-4 items-start mt-2">
<div class="col-span-2">

```typescript
// taches.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tache } from './tache';
import { TachePersistanceService } from './tache-persistance.service';

@Component({
  selector: 'app-taches',
  imports: [FormsModule],
  templateUrl: '/taches.component.html'
})
export class TachesComponent {
  readonly persistance = inject(TachePersistanceService);
  titre = '';
  echeance = '';

  ajouter(): void {
    const nouvelle = new Tache(crypto.randomUUID(), this.titre, this.echeance);
    this.persistance.taches.update(liste => [...liste, nouvelle]);
    this.titre = '';
  }
}
```

</div>
<div class="col-span-1 text-xs space-y-3">

<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
<strong class="text-emerald-700 dark:text-emerald-300">Mémoire d'abord</strong>
<p class="opacity-80 mt-1">Ajouter une tâche ne touche pas au fichier. Seul le bouton Enregistrer écrit sur le disque.</p>
</div>

<div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
<strong>Deux champs, deux <code>ngModel</code></strong>
<p class="opacity-80 mt-1"><code>[(ngModel)]</code> relie chaque champ à une propriété de la classe.</p>
</div>

</div>
</div>

<!--
Démonstration : ajoutez deux tâches, enregistrez, rouvrez le fichier avec un éditeur de texte.
-->

<style>
  pre code {
    font-size: 11px !important;
  }
</style>

---

## Étape 3 : Le formulaire (`ngModel`)

```html

<button (click)="persistance.ouvrir()">Ouvrir</button>
<button (click)="persistance.enregistrer()">Enregistrer</button>

<form (ngSubmit)="ajouter()">
  <input name="titre" [(ngModel)]="titre" placeholder="Titre" />
  <input name="echeance" type="date" [(ngModel)]="echeance" />
  <button type="submit">Ajouter</button>
</form>

<ul>
  @for (t of persistance.taches(); track t.id) {
    <li>{{ t.titre }} — {{ t.echeance }}</li>
  }
</ul>

```

---
layout: default
---

# À savoir avant de l'utiliser

<div class="grid grid-cols-2 gap-3 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-700 dark:text-rose-300">Navigateur</strong>
    <p class="opacity-80 mt-1">L'API existe dans Chrome et Edge, pas dans Firefox ni Safari. Prévoir un export/import JSON en secours.</p>
  </div>
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong>Contexte sécurisé</strong>
    <p class="opacity-80 mt-1">Fonctionne sur <code>localhost</code> ou en HTTPS uniquement.</p>
  </div>
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong>Typage</strong>
    <p class="opacity-80 mt-1">Les types de l'API ne sont pas toujours dans TypeScript : <code>npm i -D @types/wicg-file-system-access</code>.</p>
  </div>
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong>Permissions</strong>
    <p class="opacity-80 mt-1">Le navigateur peut redemander l'accès au fichier après un rechargement de la page.</p>
  </div>
</div>

<!--
Terminez la démo sur cette slide : le fichier est vraiment sur le disque de l'utilisateur, mais c'est lui qui l'a autorisé.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 08
</div>

# Synthèse & Clôture de la Séance

<!--
Dernière étape : synthèse finale et félicitations pour avoir franchi la première séance du Bloc D !
-->

---
layout: default
---

##### Tableau Récapitulatif des Mécanismes et Syntaxes Clés

<div class=" text-xs small">

| Mécanisme / Syntaxe | Rôle technique et conceptuel | Avantage architectural clé en POO |
| :--- | :--- | :--- |
| **`JSON.stringify(val, replacer, space)`** | Transforme un graphe d'objets en chaîne linéaire. | Extraction des données hors de la RAM vers un support universel. |
| **`toJSON()` sur une classe** | Méthode magique définissant la représentation sérialisable. | Respect strict de l'encapsulation (S05) et masquage des secrets. |
| **`JSON.parse(str, reviver)`** | Parse une chaîne JSON en structures basiques (retourne `any`). | Point d'entrée de la désérialisation. Attention : type dangereux sans contrôle ! |
| **Paramètre `reviver`** | Fonction d'interception unitaire exécutée lors du parsing. | Idéal pour convertir automatiquement les chaînes ISO en objets `Date`. |
| **`DOMParser` (navigateur)** | Parse un flux XML textuel en arbre documentaire W3C navigable. | Permet d'extraire des données de flux patrimoniaux avec `querySelector()`. |
| **Patron DTO (`interface`)** | Modélise la structure brute des données sérialisables. | Découple le format de stockage externe du modèle métier interne. |
| **Fabrique `Article.fromDTO()`** | Méthode statique reconstruisant l'objet métier depuis le DTO. | Revalide les invariants, restaure le prototype et attache les méthodes. |
| **`instance is MonType`** | Garde de type (*Type Guard*) personnalisé en TypeScript. | Sécurise le typage en éliminant les risques du type `any` à l'entrée. |

</div>

<!--
Prenez 2 minutes pour parcourir chaque ligne.
Les étudiants ont sous les yeux leur fiche de révision complète pour cette séance.
-->


---
layout: default
---

# 🚀 Clôture de la Séance & Pont vers la Séance 17

Félicitations ! Vous venez de franchir avec succès la première étape du **Bloc D (Persistance des Données)** :

<div class="grid grid-cols-2 gap-3 mt-3 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400 font-bold">Acquis du jour (Séance 16) :</strong>
    <ul class="list-disc list-inside mt-1.5 space-y-1 opacity-80">
      <li>La frontière physique entre la RAM et la persistance textuelle.</li>
      <li>Duel JSON vs XML et parsing natif avec <code>DOMParser</code>.</li>
      <li>Maîtrise de <code>JSON.stringify</code> (space, replacer, <code>toJSON</code>).</li>
      <li>Le drame du prototype perdu déjoué par <code>Article.fromDTO()</code>.</li>
      <li>Sécurisation du typage avec <code>unknown</code> et Type Guards.</li>
    </ul>
  </div>

  <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400 font-bold">À venir en Séance 17 : Consommer une API REST</strong>
    <ul class="list-disc list-inside mt-1.5 space-y-1 opacity-80">
      <li><strong>Le Réseau Mondial :</strong> Envoyer et recevoir ces flux JSON à travers Internet.</li>
      <li><strong>Synchrone vs Asynchrone :</strong> Pourquoi le Web interdit les appels bloquants.</li>
      <li><strong>La Révolution <code>httpResource()</code> d'Angular 22 :</strong> Consommer des APIs REST directement sous forme de signaux réactifs sans RxJS !</li>
    </ul>
  </div>
</div>

<div class="mt-5 text-center text-xs font-mono opacity-60">
  Séance 16 terminée · Bloc D en cours 
</div>

<!--
Félicitez chaleureusement les étudiants.
Ouvrez la session de questions / réponses et lancez les ateliers pratiques sur leurs postes de travail !
-->