---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Séance 10 — Gestion des Exceptions & Robustesse en POO
info: |
  ## Séance 10 — Gestion des Exceptions & Robustesse en POO
  Cours de programmation orientée objet — Bachelier en informatique (EAFC).
---

<style>
.slidev-code, .slidev-code pre { font-size: 0.72rem !important; line-height: 1.3 !important; }
.slidev-code pre { padding: 0.45rem 0.65rem !important; }
</style>

<div class="h-full flex flex-col justify-center items-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
    <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
    Programmation Orientée Objet · EAFC
  </div>

  <h1 class="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
    Séance 10 — Gestion des Exceptions & Robustesse en POO
  </h1>

  <p class="text-lg opacity-80 max-w-2xl mx-auto mb-6 font-medium">
    Flux d'exécution anormal · Typage strict TypeScript · Exceptions métier POO · Résilience UI Angular Signals
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono opacity-60">
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">TypeScript 5+</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Angular 21+</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Signals</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">POO Avancée</span>
  </div>
</div>

<!--
Bienvenue à la séance 10 du cours de Programmation Orientée Objet !
Jusqu'ici, nous avons appris à concevoir des architectures élégantes : encapsulation (S5), héritage (S6), polymorphisme (S7), abstraction (S8) et composition (S9).
Mais dans le monde réel, tout ne se passe pas toujours comme prévu : réseau coupé, entrées invalides, invariants violés.
Aujourd'hui, nous allons apprendre à rendre nos architectures invulnérables grâce à une gestion rigoureuse et orientée objet des exceptions.
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Rupture du flux nominal</h4>
      <p class="opacity-75">Comprendre pourquoi les codes de retour (<code>-1</code>, <code>null</code>) échouent, et maîtriser le déroulement de pile (<em>stack unwinding</em>).</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Syntaxe & Sémantique</h4>
      <p class="opacity-75">Maîtriser <code>try</code>, <code>catch</code> et la garantie absolue de libération des ressources du bloc <code>finally</code>.</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Typage strict TypeScript</h4>
      <p class="opacity-75">Bannir <code>catch (error: any)</code>, apprivoiser <code>unknown</code> et pratiquer le filtrage précis via <em>type guards</em> et <code>instanceof</code>.</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Hiérarchie d'erreurs POO</h4>
      <p class="opacity-75">Hériter de <code>Error</code>, construire une taxonomie d'exceptions métier typées avec codes d'erreur et métadonnées contextualisées.</p>
    </div>
  </div>

</div>



<!--
Présentez ces 6 objectifs aux étudiants.
Insistez sur le fait qu'écrire des exceptions n'est pas un aveu d'échec, mais la preuve d'un logiciel robuste qui refuse de fonctionner dans un état corrompu.
-->

---
layout: default
---

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs flex-shrink-0">05</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Stratégies de propagation</h4>
      <p class="opacity-75">Savoir précisément où lever, où intercepter, quand relancer (<code>rethrow</code>) et comment traduire une erreur technique en erreur métier.</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs flex-shrink-0">06</span>
    <div>
      <h4 class="font-bold text-sm mb-0.5">Résilience UI Angular Signals</h4>
      <p class="opacity-75">Connecter des exceptions de service à des signaux de composants réactifs sans jamais bloquer ni faire planter l'interface utilisateur.</p>
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 text-center font-semibold">
  💡 <strong>Fil conducteur :</strong> Transformer les pannes imprévues en états applicatifs contrôlés, typés et compréhensibles par l'utilisateur.
</div>


---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 00
</div>

# Le Cheminement : D'où venons-nous ?

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Comment les acquis des séances 5 à 9 nous mènent inévitablement à la question vitale de la robustesse et des invariants d'objets.
</p>

<!--
Replacer la séance dans l'histoire globale du cours : chaque séance a résolu un problème de la précédente.
-->

---
layout: default
---

# La progression du cursus POO

<div class="grid grid-cols-12 gap-2.5 mt-3 text-xs">
  

  <div class="col-span-3 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-indigo-500 mb-1">SÉANCES 6-7</div>
    <h3 class="font-bold mb-1">Héritage & Polym.</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Factorisation <code>extends</code></li>
      <li>Appel à <code>super()</code></li>
      <li>Fin des <code>switch/if</code></li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-center text-[10px]">Liaison dynamique</div>
  </div>

  <div class="col-span-3 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-purple-500 mb-1">SÉANCE 8</div>
    <h3 class="font-bold mb-1">Contrats purs</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Classes abstraites</li>
      <li>Interfaces & DTOs</li>
      <li>Typage structurel</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-center text-[10px]">Zéro objet fantôme</div>
  </div>

  <div class="col-span-3 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-mono font-bold text-teal-500 mb-1">SÉANCE 9</div>
    <h3 class="font-bold mb-1">Composition</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Relation « A un » (Has-a)</li>
      <li>Délégation modulaire</li>
      <li>Remplacement à chaud</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold text-center text-[10px]">Couplage faible</div>
  </div>

  <div class="col-span-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
    <div class="font-mono font-bold text-amber-600 dark:text-amber-400 mb-1">AUJOURD'HUI (S10)</div>
    <h3 class="font-bold mb-1">Exceptions & Robustesse</h3>
    <ul class="opacity-80 space-y-0.5 text-[11px]">
      <li>Protection des invariants</li>
      <li>Déroulement de pile</li>
      <li>Erreurs métier typées</li>
      <li>Résilience de l'UI</li>
    </ul>
    <div class="mt-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-center text-[10px]">Stabilité logicielle</div>
  </div>
</div>

<div class="mt-3.5 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs text-center">
  ❓ <strong>La question fondamentale :</strong> <em>Que doit faire un objet quand les règles métier sont violées ou qu'une opération ne peut physiquement pas aboutir ?</em>
</div>

<!--
Expliquez la logique :
En séance 5, nous avons défini des invariants (ex: un solde bancaire ne peut être négatif sans autorisation).
Mais que fait-on si quelqu'un tente un retrait illégal ? Renvoyer false ? Renvoyer null ?
C'est précisément l'impasse des approches archaïques que nous allons analyser.
-->

---
layout: two-cols-header
---

# Problème 1 : Les « codes de retour magiques »

::left::

```typescript
// ❌ ANTI-PATTERN
class CompteBancaire {
  private solde = 100;

  // Renvoyer -1 pour signaler une erreur ?
  retirer(montant: number): number {
    if (montant > this.solde) {
      return -1;
    }
    this.solde -= montant;
    return this.solde;
  }
}

// Appelant distrait ou pressé :
const compte = new CompteBancaire();
const nouveauSolde = compte.retirer(500);
// On oublie de tester -1 !
console.log(`Solde : ${nouveauSolde} €`); // Solde : -1 € !
```

::right::

<p class="text-xs ms-2 mb-2 opacity-90">
  L'approche procédurale historique (héritée du C) : renvoyer une valeur sentinelle (<code>-1</code>, <code>null</code>, <code>false</code>) en cas de problème.
</p>

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">1. Mélange données et erreurs</strong><br>
    La valeur de retour cumule deux responsabilités incompatibles : le résultat métier légitime et le statut d'échec.
  </div>

  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">2. Aucune contrainte mécanique</strong><br>
    Le compilateur n'oblige personne à tester <code>-1</code>. L'erreur continue sa course et corrompt la mémoire en silence.
  </div>

  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">3. Perte totale du contexte</strong><br>
    Pourquoi le retrait a-t-il échoué ? Solde insuffisant ? Plafond dépassé ? Compte bloqué ? Le chiffre <code>-1</code> est muet.
  </div>
</div>

<style>
  code {
    font-size: 10px !important;
  }

</style>

<!--
Soulignez l'absurdité du code sentinelle : si la méthode renvoie un solde légitime, comment distinguer un solde de -1€ suite à un découvert autorisé d'un code d'erreur -1 ? C'est impossible.
-->

---
layout: two-cols-header
---

# Problème 2 : La corvée de propagation manuelle

::left::

<p class="text-xs mb-2 opacity-90">
  Sans mécanisme d'exception, chaque niveau d'appel intermédiaire doit vérifier et propager l'erreur manuellement :
</p>

```typescript
function coucheBase(): number {
  if (disquePlein()) return -5; // Erreur disque
  return 42;
}

function coucheService(): number {
  const code = coucheBase();
  if (code < 0) return code; // 🛑 Bruit parasite
  return code * 2;
}

function coucheControleur(): number {
  const code = coucheService();
  if (code < 0) return code; // 🛑 Bruit parasite
  return code + 1;
}
```

::right::

<div class="ms-2 space-y-2.5 text-xs pt-1">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-amber-600 dark:text-amber-400">80% de code parasite</strong><br>
    La logique métier réelle est noyée dans un labyrinthe de vérifications défensives répétitives.
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400">Chaîne de responsabilités fragile</strong><br>
    Il suffit qu'un seul développeur dans la chaîne oublie un <code>if (code < 0)</code> pour que l'erreur disparaisse mystérieusement dans la nature.
  </div>

  <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">🎯 Le besoin réel</strong><br>
    Un mécanisme automatique qui traverse les couches intermédiaires sans les polluer, et saute directement au composant capable de traiter l'anomalie.
  </div>
</div>

<!--
Ce schéma illustre la pollution du code : les fonctions intermédiaires n'ont aucun moyen de résoudre l'erreur disque, mais elles sont obligées d'écrire du code pour la faire passer à la suivante.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 01
</div>

# Le Mécanisme des Exceptions en POO

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Rupture de séquence, déroulement automatique de la pile (<em>stack unwinding</em>) et syntaxe universelle <code>try / catch / finally</code>.
</p>

<!--
Entrons dans le vif du sujet : comment fonctionne le moteur d'exécution lorsqu'une exception est déclenchée.
-->

---
layout: two-cols-header
---

## L'Instruction `throw` : Signaler la rupture d'un contrat

::left::

<p class="text-xs mt-0 opacity-90">
  Lorsqu'une précondition n'est pas remplie, l'objet <strong>refuse d'exécuter l'action</strong> et lève immédiatement une exception :
</p>

```typescript
export class CompteBancaire {
  constructor(
    public readonly numero: string,
    private solde: number
  ) {
    // Invariant : un compte ne naît pas dans le rouge
    if (solde < 0) {
      throw new Error(`Solde initial invalide : ${solde} €.`);
    }
  }
  retirer(montant: number): void {
    if (montant <= 0) {
      throw new Error(`Montant de retrait invalide : ${montant} €.`);
    }
    if (montant > this.solde) {
      throw new Error(`Solde insuffisant (${this.solde} €) pour retirer ${montant} €.`);
    }
    this.solde -= montant;
  }
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
    <strong class="text-blue-600 dark:text-blue-400">1. Arrêt immédiat de la méthode</strong><br>
    Dès que <code>throw</code> est exécuté, la ligne suivante n'est <strong>jamais atteinte</strong>. Le solde n'est jamais débité à tort.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15">
    <strong class="text-purple-600 dark:text-purple-400">2. Protection des constructeurs</strong><br>
    Un constructeur ne peut pas renvoyer de code d'erreur (il ne renvoie rien). <code>throw</code> est la <strong>seule façon légale</strong> d'interdire la création d'un objet corrompu en mémoire !
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">3. Signature pure</strong><br>
    La méthode renvoie <code>void</code> ou le vrai type métier attendu, sans l'alourdir avec <code>number | null | -1</code>.
  </div>
</div>

<style>
  code {
    font-size: 10px !important;
  }
</style>

<!--
Mettez en avant le point n°2 : beaucoup d'étudiants ignorent comment empêcher l'instanciation quand les paramètres du constructeur sont aberrants. L'exception est l'unique solution.
-->

---
layout: default
---

## Le Déroulement de la pile (*Stack Unwinding*)

<div class="grid grid-cols-12 gap-3 mt-3 text-xs">
  <div class="col-span-6 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-2">Pile d'appels (Call Stack)</h3>
    <div class="space-y-1.5 font-mono text-[11px]">
      <div class="p-2 rounded bg-slate-500/10 border-l-4 border-indigo-500">
        <strong>1. UI (Bouton Clic)</strong> ➔ appel <code>onValider()</code>
      </div>
      <div class="p-2 rounded bg-slate-500/10 border-l-4 border-blue-500 ms-3">
        <strong>2. Contrôleur</strong> ➔ appel <code>traiterCommande()</code>
      </div>
      <div class="p-2 rounded bg-slate-500/10 border-l-4 border-purple-500 ms-6">
        <strong>3. Service Métier</strong> ➔ appel <code>debiterCompte()</code>
      </div>
      <div class="p-2 rounded bg-rose-500/15 border-l-4 border-rose-500 ms-9 text-rose-600 dark:text-rose-400 font-bold">
        <strong>4. CompteBancaire.retirer()</strong> ➔ 💥 <code>throw new Error()</code>
      </div>
    </div>
  </div>

  <div class="col-span-6 space-y-2.5">
    <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
      <h4 class="font-bold text-sm mb-1 text-slate-900 dark:text-white">Que fait le moteur d'exécution (JS Runtime) ?</h4>
      <p class="opacity-80">
        Lorsqu'une exception est lancée, le moteur met instantanément l'exécution nominale sur pause et inspecte la fonction courante à la recherche d'un bloc <code>catch</code>.
      </p>
    </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h4 class="font-bold text-sm mb-1 text-amber-600 dark:text-amber-400">Rembobinage automatique</h4>
    <p class="opacity-80">
      Si la fonction n'a pas de <code>catch</code>, elle est retirée de la pile (<em>dépilée</em>) et ses variables locales sont nettoyées. Le runtime remonte au niveau supérieur, et ainsi de suite jusqu'à trouver un intercepteur.
    </p>
  </div>

  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
    ⚠️ <strong>Attention :</strong> Si aucun <code>catch</code> n'existe sur l'ensemble de la pile, l'exception devient <em>Unhandled</em> et provoque le crash du processus (Node.js) ou une erreur console bloquante (Navigateur).
  </div>
  </div>
</div>

<!--
Cette diapositive est capitale pour la compréhension mentale : l'exception n'est pas un goto, c'est un ascenseur qui remonte les étages de la pile d'appels jusqu'à trouver un filet de sécurité.
-->

---
layout: two-cols-header
---

# Syntaxe fondamentale : `try` / `catch` / `finally`

::left::

```typescript
function executerOperation(): void {
  // 1. Zone sous surveillance
  try {
    console.log("A. Début de l'opération");
    compte.retirer(9999); // 💥 Lève une exception
    console.log("B. Cette ligne ne s'exécutera JAMAIS");
  } 
  // 2. Filet d'interception
  catch (error: unknown) {
    console.warn("C. Exception interceptée avec succès !");
  } 
  // 3. Garantie absolue d'exécution
  finally {
    console.log("D. Nettoyage : toujours exécuté !");
  }

  console.log("E. Reprise normale du flux applicatif");
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
    <strong class="text-blue-600 dark:text-blue-400"><code>try { ... }</code></strong><br>
    Délimite le périmètre à risque. Contient le scénario nominal (« chemin heureux »).
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15">
    <strong class="text-purple-600 dark:text-purple-400"><code>catch (e) { ... }</code></strong><br>
    N'est invoqué <strong>que si</strong> une anomalie surgit dans le bloc <code>try</code>. Reçoit l'objet erreur en argument.
  </div>

  <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <strong class="text-amber-600 dark:text-amber-400"><code>finally { ... }</code></strong><br>
    S'exécute <strong>dans 100% des cas</strong> : que le <code>try</code> réussisse, qu'il échoue, et même si le <code>try</code> ou le <code>catch</code> contient un <code>return</code> anticipé !
  </div>
</div>

<!--
Faites remarquer la trace d'exécution : A -> C -> D -> E.
La ligne B a été court-circuitée.
Insistez sur la fiabilité du bloc finally.
-->

---
layout: default
---

## La garantie indestructible du bloc `finally`

<div class="grid grid-cols-2 gap-4 mt-3 text-xs">
  <div>

```typescript
function traiterFichierTransaction(): string {
  const fichier = ouvrirFichier('comptes.csv');
  try {
    if (!fichier.estValide()) {
      throw new Error('Fichier corrompu');
    }
    fichier.ecrireDonnees();
    return 'Succès'; // ⚠️ Return anticipé !
  } catch (error: unknown) {
    console.error('Erreur fichier :', error);
    return 'Échec';  // ⚠️ Return anticipé !
  } finally {
    // 🛡️ S'EXÉCUTE MALGRÉ LE RETURN !
    fichier.fermer();
    console.log('Ressource libérée.');
  }
}
```

  </div>

  <div class="space-y-2.5">
    <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
      <h4 class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1">À quoi sert `finally` en pratique ?</h4>
      <p class="opacity-80">
        À la <strong>libération des ressources critiques</strong> qui ne doivent jamais rester ouvertes en cas de plantage :
      </p>
      <ul class="list-disc list-inside mt-1.5 space-y-1 opacity-90">
        <li>Fermeture d'un descripteur de fichier ou de socket</li>
        <li>Rétablissement d'un curseur de chargement UI (<code>isLoading.set(false)</code>)</li>
        <li>Déverrouillage d'un verrou mémoire (Mutex / Lock)</li>
        <li>Fermeture d'une connexion SQL</li>
      </ul>
    </div>

  <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <h4 class="font-bold text-sm text-rose-600 dark:text-rose-400 mb-1">⚠️ Anti-pattern mortel : `return` dans `finally`</h4>
    <p class="opacity-80">
      Ne mettez <strong>jamais</strong> de <code>return</code> ou de <code>throw</code> à l'intérieur du bloc <code>finally</code>. Cela écraserait silencieusement tout <code>return</code> ou toute exception levée dans le <code>try</code> ou le <code>catch</code> !
    </p>
  </div>
  </div>
</div>

<style>
  code {
    font-size: 13px !important;
  }
</style>

<!--
Le bloc finally garantit qu'aucune fuite de ressource (resource leak) ne subsistera en production.
En Angular, c'est l'endroit parfait pour désactiver un loader de bouton !
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 02
</div>

# La Hiérarchie Native & le Typage Strict

<p class="opacity-70 text-sm max-w-lg mx-auto">
  La classe standard <code>Error</code>, ses spécialisations natives, le chaînage d'erreurs et l'exigence du typage <code>unknown</code> en TypeScript.
</p>

<!--
Abordons maintenant l'anatomie interne de l'objet Error fourni par la plateforme.
-->

---
layout: two-cols-header
---

# L'Objet Standard `Error` : Anatomie d'une anomalie

::left::

```typescript
const anomalie = new Error("Connexion à l'API refusée.");

console.log(anomalie.name);    // "Error"
console.log(anomalie.message); // "Connexion à l'API refusée."
console.log(anomalie.stack);   
/*
Error: Connexion à l'API refusée.
    at Service.connect (api.service.ts:42:11)
    at Component.onClick (login.component.ts:18:25)
    at HTMLButtonElement.dispatch (zone.js:561:1)
*/
```

<div class="mt-2 p-2 rounded bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-600 dark:text-blue-400">
  🔍 La propriété <code>stack</code> est générée automatiquement à l'instant précis où l'objet <code>new Error()</code> est instancié.
</div>

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400"><code>name: string</code></strong><br>
    Identifiant du type d'erreur (par défaut <code>"Error"</code>, ou <code>"TypeError"</code>, etc.).
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400"><code>message: string</code></strong><br>
    Description humaine du problème, passée en paramètre au constructeur.
  </div>

  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-purple-600 dark:text-purple-400"><code>stack?: string</code></strong><br>
    Tracé complet de la pile au moment du déclenchement : fichier, numéro de ligne et colonne exacte.
  </div>

  <div class="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
    <strong class="text-teal-600 dark:text-teal-400"><code>cause?: unknown</code> (ES2022+)</strong><br>
    Permet d'encapsuler la cause d'origine pour préserver la chaîne d'investigation sans écraser la panne initiale.
  </div>
</div>

<!--
Expliquez la structure : un objet Error n'est pas qu'une bête chaîne de caractères. C'est un conteneur riche qui sait d'où il vient et où il s'est produit.
-->

---
layout: default
---

# Les Spécialisations Natives de JavaScript

<p class="text-xs mb-3 opacity-80">
  Le moteur d'exécution lève lui-même des sous-classes spécialisées héritant de <code>Error</code> lorsqu'une opération technique illégale se produit :
</p>

<div class="mt-2 overflow-x-auto text-xs">

| Classe d'Erreur | Cause du déclenchement | Exemple de code fautif |
|---|---|---|
| **`TypeError`** | Type incompatible ou opération sur `null`/`undefined` | `const x: any = null; x.faireQuelqueChose();` |
| **`RangeError`** | Valeur numérique ou taille hors limites autorisées | `new Array(-5);` ou récursion infinie (Stack Overflow) |
| **`ReferenceError`** | Tentative d'accès à une variable non déclarée | `console.log(variableInconnue);` |
| **`SyntaxError`** | Erreur d'analyse grammaticale du code | `JSON.parse("{ bad json }");` |
| **`URIError`** | Caractères invalides lors de l'encodage URI | `decodeURIComponent("%");` |

</div>

<div class="mt-4 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs flex items-center gap-3">
  <span class="text-2xl">💡</span>
  <div>
    <strong>Leçon POO :</strong> JavaScript utilise lui-même l'<strong>héritage de classes</strong> pour classifier ses erreurs ! 
    Tous ces types vérifient <code>err instanceof Error === true</code>.
  </div>
</div>

<!--
Montrez aux étudiants que l'héritage sert déjà sous le capot dans le moteur du langage.
Leur propre architecture métier va suivre exactement ce même modèle.
-->

---
layout: two-cols-header
---

# Le Chaînage d'Erreurs moderne : `Error Cause`

::left::

<p class="text-xs mb-2 opacity-90">
  Depuis ECMAScript 2022 et TypeScript 4.6+, on peut lier une exception de haut niveau à l'erreur technique originelle via l'option <code>cause</code> :
</p>

```typescript
async function chargerProfilUtilisateur(id: string): Promise<User> {
  try {
    return await apiFetch(`/users/${id}`);
  } catch (err: unknown) {
    // 🛡️ On lève une erreur métier en conservant la cause
    throw new Error(
      `Échec du chargement du profil ${id}`, 
      { cause: err }
    );
  }
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">✨ Le double diagnostic</strong><br>
    L'utilisateur ou le composant UI reçoit un message clair et lisible (<em>« Échec du chargement du profil... »</em>).
  </div>

  <div class="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
    <strong class="text-blue-600 dark:text-blue-400">🔍 Traçabilité DevOps complète</strong><br>
    Les logs de surveillance conservent l'exception sous-jacente complète (ex: <code>NetworkError: Failed to fetch</code>) accessible via <code>erreur.cause</code>.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Fini la perte d'informations</strong><br>
    Avant <code>cause</code>, encapsuler une erreur écrasait la <code>stack</code> originelle. Le bogue devenait presque impossible à reproduire.
  </div>
</div>

<!--
Montrez que c'est le standard moderne de l'industrie : masquer la complexité pour l'UI, mais préserver la preuve technique pour le débogage.
-->

---
layout: two-cols-header
---

# Le Typage Strict : Pourquoi `catch (e: unknown)` ?

::left::

<p class="text-xs mb-2 opacity-90">
  En JavaScript, on a le droit de jeter <strong>absolument n'importe quoi</strong> :
</p>

```typescript
// En JavaScript, tout ceci est valide au runtime :
throw new Error("Erreur standard");
throw "Oups, une chaîne !";
throw 404;
throw { message: "Pas un vrai objet Error" };
throw null;
throw undefined;

// Si vous écrivez :
catch (error: any) {
  // 💥 BOOM si error est une chaîne ou null :
  console.log(error.message.toUpperCase());
  // TypeError: Cannot read properties of undefined
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">❌ Le piège mortel de `any`</strong><br>
    <code>any</code> désactive le compilateur. Tenter d'accéder à <code>error.message</code> provoque un <strong>second crash dans le gestionnaire d'erreur</strong> !
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">🛡️ L'option `useUnknownInCatchVariables`</strong><br>
    Dans `tsconfig.json` strict, TypeScript force le type du bloc <code>catch</code> à <code>unknown</code>.
  </div>

  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <strong class="text-blue-600 dark:text-blue-400">🎯 Obligation de vérification</strong><br>
    Avec <code>unknown</code>, TypeScript interdit d'utiliser <code>error</code> avant d'avoir prouvé son type par un garde (<em>narrowing</em>).
  </div>
</div>

<!--
Expliquez bien la philosophie de TypeScript : unknown signifie 'je ne sais pas ce que c'est, donc tu as l'obligation de vérifier sa structure avant de l'utiliser'.
-->

---
layout: two-cols-header
---

# Pratique du Narrowing dans le bloc `catch`

::left::

```typescript
try {
  executerActionRisquee();
} catch (error: unknown) {
  // 1. Est-ce une vraie instance d'Error ?
  if (error instanceof Error) {
    // ✅ TypeScript affine le type : 'error' est Error !
    console.error(`[${error.name}] ${error.message}`);
    if (error.stack) {
      console.debug(error.stack);
    }
  } 
  // 2. Est-ce une chaîne primitive ?
  else if (typeof error === 'string') {
    console.error('Anomalie textuelle :', error);
  } 
  // 3. Cas imprévu
  else {
    console.error('Anomalie non standard :', String(error));
  }
}
```

::right::

<div class="ms-2 space-y-2.5 text-xs pt-1">
  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">Le pouvoir de `instanceof` (Séance 7)</strong><br>
    Rappelez-vous la séance sur le polymorphisme : <code>instanceof</code> vérifie la présence du prototype dans la chaîne d'héritage au runtime.
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400">Affinement de type automatique</strong><br>
    Dès que la condition <code>if (error instanceof Error)</code> est franchie, l'IDE propose l'autocomplétion sur <code>message</code>, <code>name</code>, et <code>stack</code> en toute sécurité.
  </div>

  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center font-bold text-blue-700 dark:text-blue-300">
    Règle d'or : ZÉRO <code>catch (error: any)</code> dans un projet professionnel !
  </div>
</div>

<!--
Ce schéma de narrowing est le modèle que chaque étudiant doit recopier dans ses projets. Il est 100% sûr au runtime.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 03
</div>

# Concevoir des Exceptions Métier Typées en POO

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Pourquoi et comment créer ses propres classes d'erreur via <code>extends Error</code>, avec codes d'erreur, horodatage et métadonnées métier.
</p>

<!--
Nous abordons maintenant le cœur de la séance : l'utilisation de l'héritage objet pour nos propres erreurs d'application.
-->

---
layout: two-cols-header
---

# Pourquoi `throw new Error("texte")` ne suffit pas ?

::left::

<p class="text-xs mb-2 opacity-90">
  Regardez comment un composant est forcé de réagir si les erreurs sont de simples chaînes :
</p>

```typescript
// ❌ HORREUR ARCHITECTURALE :
try {
  reserverCreneau('slot-12');
} catch (error: unknown) {
  if (error instanceof Error) {
    // Comparer des bouts de texte pour savoir quoi faire ???
    if (error.message.includes('déjà réservé')) {
      afficherAlerteReservation();
    } else if (error.message.includes('carte expirée')) {
      redirigerVersPaiement();
    }
  }
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">1. Fragilité extrême (Fragile Code)</strong><br>
    Si un développeur corrige une faute d'orthographe dans le message, toute la logique conditionnelle de l'application s'effondre silencieusement !
  </div>

  <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
    <strong class="text-rose-600 dark:text-rose-400">2. Problème d'internationalisation (i18n)</strong><br>
    Si l'application est traduite en anglais ou en néerlandais, le test <code>includes('déjà réservé')</code> échoue systématiquement.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">3. La solution POO : Les Types !</strong><br>
    En créant une classe par situation anormale, le filtrage s'appuie sur le <strong>type réel de l'objet</strong> et non sur son texte.
  </div>
</div>

<!--
Insistez sur la honte de faire des if (error.message.includes('...')). C'est un code qui casse dès la première traduction ou modification de texte.
-->

---
layout: two-cols-header
---

# Créer sa première Exception Métier (`extends Error`)

::left::

```typescript
// src/app/errors/app-error.base.ts
export abstract class AppError extends Error {
  public readonly timestamp: Date;

  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus: number = 400
  ) {
    super(message); // 1. Initialise le parent Error
    
    // 2. Rétablit le nom de la classe concrète
    this.name = this.constructor.name;
    this.timestamp = new Date();

    // 3. Restauration de la chaîne de prototypes (TS / ES5)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2 rounded-xl bg-blue-500/5 border border-blue-500/15">
    <strong class="text-blue-600 dark:text-blue-400"><code>super(message)</code></strong><br>
    Indispensable en POO (S6) : alimente la propriété héritée <code>this.message</code> et capture la pile d'appels.
  </div>

  <div class="p-2 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400"><code>this.name = this.constructor.name</code></strong><br>
    Par défaut, <code>new Error()</code> fixe <code>this.name = "Error"</code>. En réassignant dynamiquement le nom, la trace affichera clairement <code>[ReservationError]</code> au lieu de <code>[Error]</code>.
  </div>

  <div class="p-2 rounded-xl bg-purple-500/5 border border-purple-500/15">
    <strong class="text-purple-600 dark:text-purple-400"><code>public readonly code: string</code></strong><br>
    Expose un code d'erreur constant et stable (ex: <code>"RES_SLOT_UNAVAILABLE"</code>) parfait pour l'UI et les tests automatisés.
  </div>

  <div class="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px]">
    ⚙️ <code>Object.setPrototypeOf</code> garantit que <code>instanceof</code> fonctionne fidèlement sur les navigateurs anciens lors de la transpilation.
  </div>
</div>

<!--
Cette classe de base abstraite est le socle de toute l'architecture.
Soulignez l'usage de abstract class (séance 8) : on ne veut pas instancier une AppError générique !
-->

---
layout: default
---

## L'Arbre des Exceptions du Domaine (Taxonomie POO)

<div class="grid grid-cols-12 gap-3 mt-3 text-xs">
  <div class="col-span-5 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-2">Arborescence d'Héritage</h3>
    <div class="font-mono space-y-1.5 text-[11px]">
      <div class="text-slate-500 font-bold">Error (Standard JS)</div>
      <div class="ps-3 text-blue-600 dark:text-blue-400 font-bold">↳ abstract AppError</div>
      <div class="ps-6 text-indigo-600 dark:text-indigo-400 font-bold">↳ ReservationError</div>
      <div class="ps-9 text-emerald-600 dark:text-emerald-400">↳ SlotUnavailableError</div>
      <div class="ps-9 text-amber-600 dark:text-amber-400">↳ PastDateError</div>
      <div class="ps-9 text-rose-600 dark:text-rose-400">↳ CapacityExceededError</div>
      <div class="ps-6 text-indigo-600 dark:text-indigo-400 font-bold">↳ PaymentError</div>
      <div class="ps-9 text-purple-600 dark:text-purple-400">↳ InsufficientFundsError</div>
    </div>
      <div class="mt-2.5 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-center text-blue-700 dark:text-blue-300 font-medium">
  ✨ Grâce à l'héritage, <code>SlotUnavailableError</code> <strong>est une</strong> <code>ReservationError</code>, qui <strong>est une</strong> <code>AppError</code>, qui <strong>est une</strong> <code>Error</code> !
</div>

  </div>
  

  <div class="col-span-7 space-y-2">

```typescript
// src/app/errors/reservation.errors.ts
import { AppError } from './app-error.base';
export class ReservationError extends AppError {}
export class SlotUnavailableError extends ReservationError {
  constructor(public readonly slotId: string, public readonly date: Date) {
    super(
      `Le créneau ${slotId} du ${date.toLocaleDateString()} est déjà réservé.`,
      'ERR_SLOT_UNAVAILABLE',
      409 // Conflit HTTP
    );
  }
}
export class PastDateError extends ReservationError {
  constructor(public readonly date: Date) {
    super(
      `Impossible de réserver une date passée : ${date.toLocaleDateString()}.`,
      'ERR_PAST_DATE',
      422
    );
  }
}
```

  </div>
</div>



<style>
  code {
    font-size: 10px !important;
  }
</style>

<!--
Cette diapositive montre la puissance de la modélisation objet : les erreurs ne sont pas plates, elles forment un arbre hiérarchique.
-->

---
layout: two-cols-header
---

## Le Filtrage Chirurgical avec `instanceof`

::left::

```typescript
try {
  service.reserver(creneauId, dateReservation);
} catch (error: unknown) {
  // 1. Filtrage ultra-spécifique
  if (error instanceof SlotUnavailableError) {
    notif.warning(`Créneau pris. Voulez-vous être alerté en cas de désistement ?`);
  } 
  // 2. Erreur métier de réservation générique
  else if (error instanceof ReservationError) {
    notif.error(`Problème de réservation [${error.code}] : ${error.message}`);
  } 
  // 3. Autre erreur applicative connue
  else if (error instanceof AppError) {
    notif.error(`Erreur système : ${error.message}`);
  } 
  // 4. Exception imprévue ou bogue de code (ex: TypeError)
  else {
    notif.fatal(`Panne inattendue. Nos équipes ont été alertées.`);
    throw error; // ⚠️ Relance de l'inconnu
  }
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Polymorphisme d'interception</strong><br>
    Un bloc <code>catch (error instanceof ReservationError)</code> attrapera indifféremment <code>SlotUnavailableError</code> ou <code>PastDateError</code> !
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">Ordre du plus spécifique au plus général</strong><br>
    Toujours placer les sous-classes concrètes en premier, et les classes mères plus générales ensuite (sinon le parent intercepte tout avant l'enfant).
  </div>

  <div class="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
    <strong class="text-blue-600 dark:text-blue-400">Zéro manipulation de chaînes</strong><br>
    Le code est 100% protégé contre les changements de texte ou de langue.
  </div>
</div>

<style>
  code {
    font-size:10px !important;
  }
</style>

<!--
Attirez l'attention des étudiants sur la dernière branche : le throw error.
Ne jamais avaler une erreur qu'on ne sait pas traiter. Si ce n'est pas une AppError, il faut relancer.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 04
</div>

# Stratégies Architecturales : Lever, Capturer ou Propager ?

<p class="opacity-70 text-sm max-w-lg mx-auto">
  La bonne décision au bon étage : responsabilité de la couche domaine, du service applicatif et du composant d'interface utilisateur.
</p>

<!--
Une fois la syntaxe maîtrisée, la question clé de l'ingénieur logiciel est : où place-t-on le try/catch ?
-->

---
layout: default
---

# La Règle des Trois Étages

<div class="grid grid-cols-3 gap-3 mt-4 text-xs">
  <div class="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
    <div class="font-mono font-bold text-blue-500 mb-1">ÉTAGE 1 : DOMAINE</div>
    <h3 class="font-bold text-sm mb-1.5">Entités & Modèles POO</h3>
    <ul class="opacity-80 space-y-1 list-disc list-inside">
      <li><strong>Rôle :</strong> Valider les invariants purs.</li>
      <li><strong>Action :</strong> <code>throw new ...</code> dès qu'un état est invalide.</li>
      <li><strong>Règle :</strong> Ne contient <strong>jamais</strong> de <code>try/catch</code> !</li>
    </ul>
    <div class="mt-3 p-1.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-center text-[11px]">
      Lève l'exception immédiatement
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
    <div class="font-mono font-bold text-indigo-500 mb-1">ÉTAGE 2 : SERVICES</div>
    <h3 class="font-bold text-sm mb-1.5">Services Métier</h3>
    <ul class="opacity-80 space-y-1 list-disc list-inside">
      <li><strong>Rôle :</strong> Orchestrer la logique et l'API.</li>
      <li><strong>Action :</strong> Traduire les erreurs techniques (HTTP 500) en erreurs métier (<em>wrapping</em>).</li>
      <li><strong>Règle :</strong> Relance (<code>rethrow</code>) après journalisation.</li>
    </ul>
    <div class="mt-3 p-1.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-center text-[11px]">
      Traduit et propage
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">ÉTAGE 3 : PRÉSENTATION</div>
    <h3 class="font-bold text-sm mb-1.5">Composants UI Angular</h3>
    <ul class="opacity-80 space-y-1 list-disc list-inside">
      <li><strong>Rôle :</strong> Interagir avec l'humain.</li>
      <li><strong>Action :</strong> <code>try / catch</code> pour alimenter un <code>signal</code> d'erreur.</li>
      <li><strong>Règle :</strong> Ne <strong>laisse jamais</strong> fuiter l'exception dans le vide.</li>
    </ul>
    <div class="mt-3 p-1.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-center text-[11px]">
      Capture et informe l'utilisateur
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs text-center">
  🎯 <strong>Règle d'or :</strong> <em>« On lève l'exception là où on constate l'anomalie. On ne la capture que là où on a le pouvoir de faire quelque chose d'utile pour la réparer ou l'afficher. »</em>
</div>

<!--
Cette grille en 3 étages évite la prolifération de try/catch inutiles au milieu de nulle part.
-->

---
layout: two-cols-header
---

## L'Englobement d'Erreur (*Error Wrapping*)

::left::

<p class="text-xs mb-2 opacity-90">
  Transformer une erreur technique bas niveau en une exception compréhensible par le reste de l'application :
</p>

```typescript
export class ReservationService {
  async reserver(slotId: string): Promise<ReservationResult> {
    try {
      return await this.http.post<ReservationResult>(
        `/api/slots/${slotId}/book`, {}
      );
    } catch (rawError: unknown) {
      // 1. Détection du code HTTP 409 Conflit
      if (this.isHttpConflict(rawError)) {
        throw new SlotUnavailableError(slotId, new Date());
      }
      // 2. Détection du code HTTP 404
      if (this.isHttpNotFound(rawError)) {
        throw new SlotNotFoundError(slotId);
      }
      // 3. Panne inconnue : on encapsule avec la cause
      throw new ServiceUnavailableError(
        'Impossible de joindre le serveur de réservation.',
        { cause: rawError }
      );
    }
  }
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Découplage technologique total</strong><br>
    Le composant Angular n'a pas besoin de savoir si l'erreur vient d'un appel HTTP REST, d'une WebSocket, de Firebase ou d'un `localStorage` !
  </div>

  <div class="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
    <strong class="text-blue-600 dark:text-blue-400">Vocabulaire métier (Ubiquitous Language)</strong><br>
    L'UI manipule <code>SlotUnavailableError</code> au lieu de <code>HttpErrorResponse with status 409</code>.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">Facilité des tests unitaires</strong><br>
    On peut simuler les erreurs métier dans les tests du composant sans devoir mocker des objets HTTP complexes.
  </div>
</div>

<style>
  code {
    font-size:12px !important;
  }
</style>

<!--
L'Error Wrapping est une compétence clé des architectures d'entreprise.
Elle empêche les détails techniques d'infiltrer la couche de présentation.
-->

---
layout: default
---

## Quand utiliser une Exception vs une Valeur de retour ?

<div class="mt-3 overflow-x-auto text-xs">

| Situation | Choix recommandé | Justification architecturale |
|---|---|---|
| **Violation d'un invariant d'objet** | 💥 **Exception (`throw`)** | L'objet refuse d'exister dans un état invalide (ex: solde négatif sans droit). |
| **Saisie utilisateur incomplète dans un formulaire** | 📝 **Valeur de retour / Signal** | Saisir un email sans `@` est un comportement normal et attendu d'un humain distrait, pas une panne ! |
| **Recherche dans un tableau retournant 0 élément** | 🔍 **Retourner `null` ou `[]`** | Ne rien trouver est un résultat légitime, pas une situation exceptionnelle. |
| **Fichier de configuration indispensable introuvable** | 💥 **Exception (`throw`)** | L'application ne peut pas démarrer : arrêt obligatoire du flux. |
| **Panne réseau ou panne de base de données** | 💥 **Exception (`throw`)** | Incident extérieur imprévisible empêchant l'opération d'aboutir. |

</div>

<div class="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
  ⚠️ <strong>Règle d'or de performance et de clarté :</strong><br>
  <em>« Les exceptions sont réservées aux événements <strong>exceptionnels</strong>. Ne les utilisez jamais pour orchestrer le flux de contrôle normal de votre programme (ex: boucler jusqu'à ce qu'une exception IndexOutOfBounds surgisse). »</em>
</div>

<!--
Cette diapositive pose la frontière : certains étudiants ont tendance à abuser des exceptions pour tout et n'importe quoi.
Les exceptions coûtent cher en mémoire (génération de stack trace) et rendent la lecture confuse si elles remplacent un simple if.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 05
</div>

# Pièges Fréquents & Bonnes Pratiques

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Les 4 erreurs tragiques commises en production et les 5 commandements de la robustesse logicielle.
</p>

<!--
Passons en revue les pires pièges vus dans le code des débutants.
-->

---
layout: two-cols-header
---

# Piège 1 : Le `catch` vide (Avaler l'erreur en silence)

::left::

```typescript
try {
  compte.retirer(montant);
  baseDeDonnees.sauvegarder();
} catch (error: unknown) {
  // Silence radio... rien ne s'affiche !
}
```

<div class="mt-3 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-700 dark:text-rose-300">
  ☠️ L'opération a échoué, mais le programme continue comme si de rien n'était. La base est corrompue et personne n'est au courant.
</div>

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-rose-600 dark:text-rose-400">Le syndrome du « bogue fantôme »</strong><br>
    Trois jours plus tard, un client appelle : ses données ont disparu. Vous ouvrez les logs : **zéro ligne d'erreur**. Félicitations, vous venez de perdre 2 jours de débogage !
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">✅ La bonne pratique</strong><br>
    Si vous attrapez une exception dans un <code>catch</code>, vous avez l'<strong>obligation morale</strong> :
    <ul class="list-disc list-inside mt-1 space-y-0.5">
      <li>Soit de la réparer (état de repli légitime).</li>
      <li>Soit de la journaliser (<code>console.error</code> / Sentry).</li>
      <li>Soit d'informer l'utilisateur (Signal / UI).</li>
      <li>Soit de la relancer (<code>throw error</code>).</li>
    </ul>
  </div>
</div>

<!--
Dites-le avec insistance : un catch vide dans une pull request en entreprise est un motif de refus immédiat.
-->

---
layout: two-cols-header
---

# Pièges 2, 3 & 4 : Les erreurs courantes des juniors

::left::

```typescript
// ❌ PIÈGE 2 : Lancer une chaîne primitive
throw "Erreur de connexion"; 
// -> Pas de stack trace, pas de name, instanceof impossible !

// ❌ PIÈGE 3 : Oublier de réassigner this.name
class MaCustomError extends Error {
  constructor(message: string) {
    super(message);
    // Oubli : this.name = 'MaCustomError'
  }
}
console.log(new MaCustomError('x').name); // Affiche "Error" !

// ❌ PIÈGE 4 : L'attrapage partiel non relancé
catch (err: unknown) {
  if (err instanceof ErreurConnue) {
    traiter();
  }
  // Oubli du else : toute erreur inconnue est avalée !
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400">Toujours instancier `Error`</strong><br>
    Ne lancez jamais de nombre ou de texte brut. Lancer <code>new MonException(...)</code> préserve la pile d'exécution.
  </div>

  <div class="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400">Nommer ses exceptions</strong><br>
    Toujours ajouter <code>this.name = 'NomDeLaClasse'</code> dans vos classes filles pour faciliter la lecture des traces de pile.
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">Toujours relancer l'inconnu</strong><br>
    Si le <code>catch</code> filtre par <code>if (e instanceof X)</code>, terminez <strong>toujours</strong> par un <code>else { throw e; }</code> pour ne pas dissimuler des bogues imprévus.
  </div>
</div>

<!--
Passez en revue ces 3 pièges. Ils sont très fréquents lors des examens et des premiers entretiens techniques.
-->

---
layout: default
---

## Les 5 Commandements de la Robustesse en POO

<div class="grid grid-cols-12 gap-3 mt-3 text-xs">
  <div class="col-span-6 space-y-2">
    <div class="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
      <div class="font-bold text-blue-600 dark:text-blue-400 mb-0.5">1. Jamais d'invariants brisés en mémoire</div>
      <p class="opacity-80">Si les paramètres d'un constructeur ou d'une méthode sont illégaux, levez immédiatement une exception plutôt que de construire un objet estropié.</p>
    </div>

  <div class="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
    <div class="font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">2. Zéro catch (error: any)</div>
    <p class="opacity-80">Le type du paramètre de catch doit toujours être <code>unknown</code>. Vérifiez systématiquement <code>instanceof Error</code> avant d'accéder aux propriétés.</p>
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15">
    <div class="font-bold text-purple-600 dark:text-purple-400 mb-0.5">3. Créer des classes d'erreur typées</div>
    <p class="opacity-80">Bannissez <code>throw new Error("texte")</code> pour vos règles métier : créez des classes dédiées (<code>extends AppError</code>) avec un code d'erreur constant.</p>
  </div>
  </div>

  <div class="col-span-6 space-y-2">
    <div class="p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/15">
      <div class="font-bold text-teal-600 dark:text-teal-400 mb-0.5">4. Libérer dans le bloc `finally`</div>
      <p class="opacity-80">Désactiver un loader, libérer une ressource ou fermer un flux doit être garanti par un bloc <code>finally</code>, exécuté qu'il y ait erreur ou non.</p>
    </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">5. Séparer la levée de la présentation</div>
    <p class="opacity-80">Le modèle ou le service ne manipule jamais de boîtes de dialogue ou de signaux UI : il lève l'exception. C'est le composant d'interface qui attrape et affiche le retour à l'utilisateur.</p>
  </div>

  <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center font-bold text-amber-700 dark:text-amber-300">
    Une application robuste n'est pas une application sans erreurs : c'est une application qui sait exactement quoi faire en cas d'erreur !
  </div>
  </div>
</div>

<!--
Faites marquer un temps d'arrêt sur ces 5 commandements. Ils résument la discipline d'ingénierie que l'on attend d'eux.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 06
</div>

# Démonstration : Le Distributeur Bancaire (ATM)

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Un cas concret, visuel et intuitif : observer le refus d'une transaction, l'interception de l'exception métier et la mise à jour réactive de l'interface graphique.
</p>

<!--
Passons à la mise en pratique.
Nous reprenons l'exemple du compte bancaire que tout le monde comprend immédiatement :
Vous avez 100 € sur votre compte. Que se passe-t-il si vous tentez de retirer 150 € au distributeur ?
-->

---
layout: default
---

## Étape 1 : Les Exceptions Métier & le Service

<div class="grid grid-cols-2 gap-4 mt-2">
  <div>

```typescript {all}{maxHeight:'400px'}
// src/app/errors/banque.errors.ts
// 1. Socle d'erreur bancaire commun
export abstract class BanqueError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
// 2. Exception spécifique : solde insuffisant
export class SoldeInsuffisantError extends BanqueError {
  constructor(solde: number, montant: number) {
    super(
      `Solde insuffisant (${solde} €) pour retirer 
      ${montant} € ! Manque ${montant - solde} €.`,
      "SOLDE_INSUFFISANT"
    );
  }
}
// 3. Exception spécifique : montant négatif ou nul
export class MontantInvalideError extends BanqueError {
  constructor(montant: number) {
    super(
      `Le montant (${montant} €) doit être 
      strictement positif !`,
      "MONTANT_INVALIDE"
    );
  }
}
```

<div class="mt-1.5 p-2 rounded bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-300">
  🏛️ Chaque exception porte un code d'erreur constant et fournit le contexte calculé (montant manquant).
</div>

  </div>
  <div>

```typescript {all}{maxHeight:'400px'}
// src/app/services/banque.service.ts
import { Injectable } from "@angular/core";
import { SoldeInsuffisantError, MontantInvalideError 
} from "../errors/banque.errors";

@Injectable({ providedIn: "root" })
export class BanqueService {
  // Débite le compte et renvoie le nouveau solde.
  // Lève une exception si une règle métier est violée.
  retirer(soldeActuel: number, montant: number): number {
    // Invariant 1 : montant positif obligatoire
    if (montant <= 0) {
      throw new MontantInvalideError(montant);
    }
    // Invariant 2 : interdiction de passer en négatif
    if (montant > soldeActuel) {
      throw new SoldeInsuffisantError(soldeActuel, montant);
    }
    // Cas nominal : retrait autorisé
    return soldeActuel - montant;
  }
}
```

<div class="mt-1.5 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300">
  🛡️ <strong>Zéro code UI :</strong> Le service applique les règles. Si la règle est enfreinte, il refuse l'opération et lève une exception typée.
</div>

  </div>
</div>

<style>
  code { font-size: 11px !important; }
</style>

<!--
Expliquez la clarté de cette conception :
Le service ne sait même pas qu'il s'exécute dans un navigateur web ou sur un smartphone.
Il reçoit un montant, vérifie les règles métier, et lève une exception précise si la règle est enfreinte.
-->

---
layout: two-cols-header
---

## Étape 2 : Le Composant Angular (`AtmComponent`)

::left::

```typescript {all}{maxHeight:'400px'}
// src/app/components/atm/atm.component.ts
import { Component, signal } from "@angular/core";
import { BanqueService } from "../../services/banque.service";
import { BanqueError } from "../../errors/banque.errors";
@Component({
  selector: "app-atm",
  standalone: true,
  templateUrl: "./atm.component.html"
})
export class AtmComponent {
  // Signaux d'état réactifs de l'automate
  solde = signal<number>(100); // 100 € sur le compte au départ
  erreur = signal<BanqueError | null>(null);
  succes = signal<string | null>(null);
  enCours = signal<boolean>(false);

  constructor(private banque: BanqueService) {}

  onRetirer(montant: number): void {
    this.enCours.set(true);
    this.erreur.set(null);
    this.succes.set(null);

    try {
      const nouveauSolde = this.banque.retirer(this.solde(), montant);
      this.solde.set(nouveauSolde); // ✅ Mis à jour uniquement en cas de succès !
      this.succes.set(`💵 Retrait de ${montant} € effectué avec succès.`);
    } catch (e: unknown) {
      // 🛡️ Typage strict : on capture l'exception métier sans jamais planter !
      if (e instanceof BanqueError) {
        this.erreur.set(e);
      }
    } finally {
      // 🔒 Toujours exécuté : réactivation garantie des boutons
      this.enCours.set(false);
    }
  }
}
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
    <strong class="text-blue-600 dark:text-blue-400">1. Intégrité des données (`try`)</strong><br>
    Si <code>banque.retirer()</code> lève une exception, la ligne <code>this.solde.set(...)</code> n'est <strong>jamais atteinte</strong>. Le solde du client ne bouge pas d'un centime !
  </div>

  <div class="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
    <strong class="text-purple-600 dark:text-purple-400">2. Typage strict (`catch`)</strong><br>
    Le paramètre est <code>unknown</code>. Le test <code>instanceof BanqueError</code> isole l'erreur bancaire et alimente le Signal réactif <code>erreur</code>.
  </div>

  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400">3. Nettoyage garanti (`finally`)</strong><br>
    Succès ou échec, <code>enCours.set(false)</code> s'exécute toujours pour débloquer l'interface.
  </div>
</div>

<style>
  code { font-size: 11px !important; }
</style>

<!--
Faites remarquer aux étudiants la propreté de cette méthode :
- 1 try pour exécuter
- 1 catch typé pour réagir
- 1 finally pour libérer
C'est le pattern standard d'Angular.
-->

---
layout: two-cols-header
---

## Étape 3 : Le Template & Les Scénarios en Direct

::left::

```html {all}{maxHeight:'440px'}
<!-- src/app/components/atm/atm.component.html -->
<main class="p-4 max-w-sm mx-auto bg-slate-900 text-white rounded-2xl">
  <!-- 1. Affichage du Solde Réactif -->
  <div class="text-center p-3 mb-3 bg-slate-800 rounded-xl">
    <span class="text-xs text-slate-400">Solde disponible</span>
    <div class="text-2xl font-black text-emerald-400">{{ solde() }} €</div>
  </div>

  <!-- 2. Boutons de Retrait Rapide -->
  <div class="grid grid-cols-3 gap-2 mb-3">
    <button (click)="onRetirer(40)" [disabled]="enCours()">40 €</button>
    <button (click)="onRetirer(150)" [disabled]="enCours()">150 €</button>
    <button (click)="onRetirer(-20)" [disabled]="enCours()">-20 €</button>
  </div>

  <!-- 3. Message de Succès -->
  @if (succes()) {
    <div class="p-2 text-xs bg-emerald-500/20 text-emerald-300 rounded-lg">
      {{ succes() }}
    </div>
  }

  <!-- 4. Alerte d'Erreur Métier Typée -->
  @if (erreur(); as err) {
    <div class="p-2 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 
    rounded-lg">
      <strong>[{{ err.code }}]</strong> {{ err.message }}
    </div>
  }
</main>
```

::right::

<div class="ms-2 space-y-2 text-xs pt-1">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-sm mb-1.5">🎮 Scénarios utilisateur simulés</div>
    <div class="space-y-1.5 font-mono text-[11px]">
      <div class="p-1.5 rounded bg-emerald-500/10 border-l-4 border-emerald-500">
        👉 <strong>Clic sur [40 €] (Solde 100 €) :</strong><br>
        Transaction acceptée ➔ Solde : <span class="text-emerald-500 font-bold">60 €</span><br>
        <span class="text-emerald-400">« 💵 Retrait de 40 € effectué avec succès. »</span>
      </div>
      <div class="p-1.5 rounded bg-rose-500/10 border-l-4 border-rose-500">
        👉 <strong>Clic sur [150 €] (Solde 60 €) :</strong><br>
        💥 <code>SoldeInsuffisantError</code> levée !<br>
        Solde préservé : <span class="text-slate-400 font-bold">60 €</span><br>
        <span class="text-rose-400 font-bold">« [SOLDE_INSUFFISANT] Solde insuffisant (60 €) pour retirer 150 € ! Manque 90 €. »</span>
      </div>
      <div class="p-1.5 rounded bg-amber-500/10 border-l-4 border-amber-500">
        👉 <strong>Clic sur [-20 €] :</strong><br>
        💥 <code>MontantInvalideError</code> levée !<br>
        <span class="text-amber-400 font-bold">« [MONTANT_INVALIDE] Le montant (-20 €) doit être strictement positif ! »</span>
      </div>
    </div>
  </div>

  <div class="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center font-bold text-emerald-700 dark:text-emerald-300">
    L'UI ne plante jamais : chaque exception se transforme en message clair !
  </div>
</div>

<style>
  code { font-size: 10.5px !important; }
</style>

<!--
Montrez les 3 scénarios :
1. Cas nominal : le solde diminue et le message vert s'affiche.
2. Dépassement : l'exception bloque le débit, le solde ne bouge pas, le message rouge explique clairement pourquoi.
3. Valeur négative : invariant protégé.
-->

---
layout: default
---

## Étape 4 : Rendu Visuel direct du Guichet (ATM)

<p class="text-xs mb-3 opacity-80">
  Voici l'interface graphique du guichet telle qu'elle réagit après une tentative de retrait de 150 € avec 60 € de solde :
</p>

<div class="grid grid-cols-12 gap-2.5 mt-3">

<div class="col-span-6">

  <div class="max-w-xs mx-auto p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl text-slate-100 text-xs font-sans">
    <!-- En-tête Guichet -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
      <div class="font-extrabold text-sm flex items-center gap-1.5 text-blue-400">
        🏧 EAFC Bank
      </div>
      <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
        En Ligne
      </span>
    </div>

  <!-- Afficheur de Solde -->
  <div class="p-3 rounded-xl bg-slate-800/90 border border-slate-700/60 text-center mb-3">
    <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Solde Disponible</div>
    <div class="text-3xl font-black text-emerald-400 tracking-tight my-0.5">60,00 €</div>
    <div class="text-[9px] text-slate-500 font-mono">Compte Courant · BE76 **** 4210</div>
  </div>

  <!-- Boutons de Retrait -->
  <div class="text-[10px] font-bold text-slate-400 mb-1">Sélectionnez un montant :</div>
  <div class="grid grid-cols-3 gap-2 mb-3">
    <div class="p-2 rounded-lg bg-slate-800 border border-slate-700 text-center font-bold text-slate-300">
      40 €
    </div>
    <div class="p-2 rounded-lg bg-blue-600 border-2 border-rose-500 text-center font-bold text-white shadow-lg ring-2 ring-rose-500/50">
      150 €
    </div>
    <div class="p-2 rounded-lg bg-slate-800 border border-slate-700 text-center font-bold text-slate-400">
      -20 €
    </div>
  </div>

  <!-- Bandeau d'Erreur Métier Actif -->
  <div class="p-2.5 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-rose-200 animate-pulse">
    <div class="flex items-center justify-between mb-1">
      <span class="font-bold flex items-center gap-1 text-[11px] text-rose-300">
        ⚠️ Retrait Refusé
      </span>
      <span class="font-mono text-[9px] px-1 py-0.5 rounded bg-rose-900 text-rose-200 font-bold">
        SOLDE_INSUFFISANT
      </span>
    </div>
    <p class="text-[10.5px] leading-tight opacity-90 m-0">
      Solde insuffisant (60 €) pour retirer 150 € ! Montant manquant : <strong>90 €</strong>.
    </p>
  </div>
  </div>

</div>

<div class="col-span-6">

  <div class=" mt-3 max-w-sm mx-auto p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-700 dark:text-blue-300 text-center">
    💡 <strong>L'objectif pédagogique est atteint :</strong> Les étudiants visualisent immédiatement le lien direct entre <code>throw new SoldeInsuffisantError()</code> dans le service et le message d'alerte rouge affiché sur l'écran du distributeur.
  </div>

</div>

</div>

<!--
Cette diapositive conclut la démonstration :
L'étudiant voit exactement ce que son code produit.
Tout est limpide, intuitif et sans bavure.
-->

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  SYNTHÈSE
</div>

# Récapitulatif & Règle d'Or

<p class="opacity-70 text-sm max-w-xl mx-auto">
  Ce qu'il faut graver dans vos mémoires d'ingénieurs avant les travaux pratiques et les examens.
</p>

<!--
La synthèse finale.
-->

---
layout: default
---

## Ce qu'il faut retenir absolument

<div class="grid grid-cols-2 gap-3.5 mt-4 text-xs">
  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1.5">⚡ Le Mécanisme (`throw / try / catch`)</h3>
    <ul class="opacity-80 space-y-1 list-disc list-inside">
      <li><strong>Rupture de séquence :</strong> <code>throw</code> interrompt immédiatement l'exécution.</li>
      <li><strong>Déroulement de pile :</strong> remontée automatique jusqu'au premier <code>catch</code> adapté.</li>
      <li><strong>Typage strict :</strong> <code>catch (error: unknown)</code> + <code>instanceof Error</code> obligatoire.</li>
      <li><strong>Garantie absolue :</strong> <code>finally</code> libère les ressources dans 100% des cas.</li>
    </ul>
  </div>

  <div class="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <h3 class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1.5">🏛️ Les Exceptions Métier (POO)</h3>
    <ul class="opacity-80 space-y-1 list-disc list-inside">
      <li><strong>Héritage pur :</strong> <code>class MonErreur extends Error</code> (ou <code>extends AppError</code>).</li>
      <li><strong>Attributs typés :</strong> code d'erreur constant, timestamp, statut HTTP, cause originale.</li>
      <li><strong>Discrimination fine :</strong> filtrage élégant par <code>instanceof</code> sans manipulation de chaînes.</li>
      <li><strong>Découplage UI :</strong> le service lève, le composant attrape et alimente des <code>signals</code>.</li>
    </ul>
  </div>
</div>

<div class="mt-3.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
  <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">💡 La Règle d'Or de la Séance 10</div>
  <p class="text-sm font-bold">
    « Ne laissez jamais votre logiciel fonctionner dans un état corrompu : levez immédiatement une exception typée dès qu'un invariant est violé.<br>
    Ne capturez que là où vous pouvez informer l'utilisateur ou réparer l'état, et garantissez le nettoyage dans <code>finally</code>. »
  </p>
</div>

<!--
Faites répéter la règle d'or par un étudiant.
-->

---
layout: default
---

# 🚀 Prochaine séance : L'Étape suivante

<div class="p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 mb-4">
  <span class="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">Séance suivante</span>
  <h2 class="text-lg font-extrabold mt-0.5">Séance 11 — Les Principes SOLID (S, O, D)</h2>
</div>

<div class="grid grid-cols-2 gap-3 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-blue-600 dark:text-blue-400 text-sm mb-1 block">Responsabilité Unique (SRP)</strong>
    <p class="opacity-75">Une classe ne doit avoir qu'une seule raison de changer : séparer le calcul, le stockage et la présentation.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-indigo-600 dark:text-indigo-400 text-sm mb-1 block">Ouvert / Fermé (OCP)</strong>
    <p class="opacity-75">Ouvert à l'extension, fermé à la modification : ajouter des fonctionnalités sans retoucher au code existant testé.</p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <strong class="text-purple-600 dark:text-purple-400 text-sm mb-1 block">Inversion des Dépendances (DIP)</strong>
    <p class="opacity-75">Dépendre d'abstractions (interfaces) plutôt que d'implémentations concrètes : le cœur de l'injection en Angular.</p>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <strong class="text-emerald-600 dark:text-emerald-400 text-sm mb-1 block">Vers le Génie Logiciel Professionnel</strong>
    <p class="opacity-75">Assembler tous les acquis (S5 à S10) pour bâtir des systèmes maintenables sur 10 ans.</p>
  </div>
</div>

<!--
Fin de la présentation. Ouvrez vos IDE pour les travaux pratiques !
-->
