---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Séance 11 — Principes SOLID (S, O, D)
---

<div class="h-full flex flex-col justify-center items-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
    <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
    Programmation Orientée Objet · EAFC
  </div>

  <h1 class="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
    Séance 11 — Principes SOLID (S, O, D)
  </h1>

  <p class="text-base opacity-80 max-w-xl mx-auto mb-5 font-medium">
    Conception Modulaire · Responsabilité Unique · Extensibilité sans Régression · Inversion de Dépendance
  </p>

  <div class="flex items-center justify-center gap-2 text-xs font-mono opacity-60">
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">TypeScript</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Clean Code</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Architecture POO</span>
    <span class="px-2 py-0.5 rounded bg-gray-500/10 border border-gray-500/20">Angular DI</span>
  </div>
</div>

<!--
Bienvenue dans cette séance 11 consacrée à la conception d'architectures saines et durables.
Jusqu'ici, nous avons appris la syntaxe et les mécanismes de la POO : classes, encapsulation, héritage, polymorphisme, interfaces et exceptions.
Mais avoir des outils puissants ne garantit pas de construire une maison solide : sans principes directeurs, on fabrique des usines à gaz impossibles à maintenir.
Aujourd'hui, nous étudions les trois principes les plus structurants du génie logiciel : S, O et D.
-->

---
layout: default
---

# 🎯 Objectifs pédagogiques

<div class="grid grid-cols-2 gap-3 mt-4">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">01</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">La crise de la maintenance</h3>
      <p class="text-xs opacity-75">Comprendre pourquoi un code qui "fonctionne" peut devenir un cauchemar (rigidité, fragilité, dette technique).</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">02</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">Single Responsibility (SRP)</h3>
      <p class="text-xs opacity-75">Attribuer une seule raison de changer à chaque classe et séparer logique métier, affichage et persistance.</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0">03</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">Open/Closed Principle (OCP)</h3>
      <p class="text-xs opacity-75">Étendre les fonctionnalités sans modifier le code existant grâce au polymorphisme et au pattern Stratégie.</p>
    </div>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 flex items-start gap-3">
    <span class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs flex-shrink-0">04</span>
    <div>
      <h3 class="font-bold text-sm mb-0.5">Dependency Inversion (DIP)</h3>
      <p class="text-xs opacity-75">Découpler les modules en dépendant d'abstractions, et comprendre le fonctionnement intime de l'injection Angular.</p>
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 text-center">
  💡 <strong>Fil conducteur</strong> : Passer du code "bricolé" au code professionnel : évolutif, testable et modulaire sans régressions.
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 01
</div>

# Du code qui marche au code durable
## Pourquoi les principes SOLID existent-ils ?

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Pourquoi tant d'applications deviennent-elles incontrôlables après quelques mois ? Découvrons la face cachée de la dette technique.
</p>

<!--
Avant d'écrire la moindre ligne de code SOLID, nous devons poser le diagnostic.
Pourquoi les développeurs ont-ils inventé ces principes ?
Ce n'est pas par plaisir d'ajouter des interfaces ou des classes : c'est par pure survie face à la complexité grandissante des projets.
-->

---
layout: two-cols-header
---

## L'illusion du "Ça marche, donc c'est bon"

::left::

```ts
// Le code "naturel" d'un débutant :
class ApplicationBoutique {
  validerPanier(panier: any[]) {
    // 1. Calcul du total avec remise
    let total = 0;
    for (const item of panier) {
      total += item.prix * item.quantite;
    }
    if (total > 100) total *= 0.9;

    // 2. Écriture directe en base de données
    const db = new SQLiteConnection();
    db.execute(`INSERT INTO commandes VALUES (...)`);

    // 3. Envoi du mail de confirmation
    const smtp = new SmtpClient('smtp.mail.com');
    smtp.sendMail('client@test.com', `Total: ${total}€`);
  }
}
```

<div class="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 text-center font-semibold">
  ⚠️ Le programme s'exécute sans erreur... mais c'est une bombe à retardement !
</div>

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <div class="font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
    <span>💥</span> Que se passe-t-il demain ?
  </div>
  <p class="opacity-80">
    Si le serveur SMTP change de port, vous devez ouvrir et modifier le fichier de calcul de panier !
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
    <span>🧪</span> Impossible à tester unitairement
  </div>
  <p class="opacity-80">
    Pour tester le calcul d'une remise, vous êtes obligé d'écrire dans une vraie base SQL et d'envoyer un vrai email !
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
    <span>🔒</span> Couplage maximal
  </div>
  <p class="opacity-80">
    Impossible d'utiliser ce calcul dans une application mobile ou une API REST sans emporter tout le reste.
  </p>
</div>

---
layout: default
---

# Les 3 symptômes du mauvais code (*Code Smells*)

Quand une base de code n'applique aucune discipline de conception, elle souffre de 3 maladies majeures :

<div class="grid grid-cols-3 gap-3 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
    <div class="text-2xl mb-2">🧱</div>
    <h3 class="font-bold text-sm text-red-600 dark:text-red-400 mb-1">1. La Rigidité</h3>
    <p class="opacity-80 leading-relaxed">
      Chaque petite modification demandée par le client oblige à retoucher <strong>10 fichiers différents</strong> en cascade. Le code résiste au changement.
    </p>
    <div class="mt-2 text-[10px] font-mono text-red-700 dark:text-red-300">
      "Une heure pour coder, trois jours pour propager."
    </div>
  </div>

  <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
    <div class="text-2xl mb-2">💣</div>
    <h3 class="font-bold text-sm text-amber-600 dark:text-amber-400 mb-1">2. La Fragilité</h3>
    <p class="opacity-80 leading-relaxed">
      Modifier une ligne dans le module de facturation fait <strong>planter l'envoi de notification</strong> à l'autre bout du logiciel. C'est l'effet domino imprévisible.
    </p>
    <div class="mt-2 text-[10px] font-mono text-amber-700 dark:text-amber-300">
      "On répare une fuite, deux tuyaux éclatent."
    </div>
  </div>

  <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <div class="text-2xl mb-2">🔗</div>
    <h3 class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">3. L'Immobilité</h3>
    <p class="opacity-80 leading-relaxed">
      Impossible d'extraire un composant pour le réutiliser dans un autre projet : il est tellement <strong>soudé à ses dépendances</strong> qu'il faut tout importer.
    </p>
    <div class="mt-2 text-[10px] font-mono text-blue-700 dark:text-blue-300">
      "Vous vouliez une banane, vous avez le gorille et la jungle."
    </div>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs text-center font-medium">
  👉 <strong>L'objectif de SOLID</strong> : Transformer un château de cartes fragile en un ensemble de <strong>briques LEGO</strong> interchangeables.
</div>

---
layout: default
---

# L'Analogie : Château de cartes vs Briques LEGO

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>🃏</span> Le Château de Cartes (Code spaghetti)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li>Chaque élément soutient directement tous les autres.</li>
      <li>Aucune frontière claire entre responsabilités.</li>
      <li>Retirer ou modifier une seule carte fait s'écrouler tout l'édifice.</li>
      <li>Le développeur a peur de toucher au code en production.</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-red-700 dark:text-red-300">
      👉 Symptôme typique : "Ne touchez plus à rien, ça tient par miracle !"
    </div>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
      <span>🧱</span> La Boîte de LEGO (Architecture SOLID)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li>Chaque brique a une fonction et une forme précises.</li>
      <li>Les briques s'assemblent via des picots standards (interfaces).</li>
      <li>On remplace une brique rouge par une bleue sans démonter la maison.</li>
      <li>Chaque pièce se teste et se réutilise indépendamment.</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
      👉 Résultat : Un code prédictif, modulaire et accueillant pour les évolutions.
    </div>
  </div>
</div>

<div class="mt-3 p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-xs text-center">
  SOLID n'est pas une théorie académique : ce sont des <strong>règles d'hygiène</strong> pour que vos projets restent vivants.
</div>

---
layout: default
---

## Le panorama SOLID : Les 5 piliers

Introduit par Robert C. Martin ("Uncle Bob"), l'acronyme regroupe 5 principes de conception orientée objet :

<div class="mt-3 text-xs">

| Lettre | Principe | Idée maîtresse | Dans ce cours |
|:---:|---|---|:---:|
| <strong class="text-blue-500 font-mono text-sm">S</strong> | **Single Responsibility Principle** | Une classe ne doit avoir qu'**une seule raison de changer**. | ✅ **Focus aujourd'hui** |
| <strong class="text-indigo-500 font-mono text-sm">O</strong> | **Open/Closed Principle** | **Ouvert** à l'extension, **fermé** à la modification. | ✅ **Focus aujourd'hui** |
| <span class="opacity-50 font-mono text-sm">L</span> | *Liskov Substitution Principle* | Les sous-classes doivent pouvoir remplacer leur classe mère sans casser le programme. | ⏩ *Déjà vu avec le polymorphisme* |
| <span class="opacity-50 font-mono text-sm">I</span> | *Interface Segregation Principle* | Mieux vaut plusieurs petites interfaces spécifiques qu'une seule générale. | ⏩ *Déjà vu avec les interfaces* |
| <strong class="text-emerald-500 font-mono text-sm">D</strong> | **Dependency Inversion Principle** | Dépendre des **abstractions**, jamais des implémentations concrètes. | ✅ **Focus aujourd'hui** |

</div>

<div class="mt-4 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-center">
  🎯 <strong>Notre mission</strong> : Maîtriser le trio magique <strong>S</strong>, <strong>O</strong> et <strong>D</strong>, qui transforme directement votre façon de coder en TypeScript et Angular !
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
  PARTIE 02
</div>

# 'S' — Single Responsibility Principle (SRP)
## Une seule raison de changer

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Pourquoi confier plusieurs casquettes à la même classe mène droit à la catastrophe ?
</p>

<!--
Commençons par le 'S' : Single Responsibility Principle.
C'est sans doute le principe le plus intuitif, mais aussi le plus fréquemment violé par les développeurs pressés.
Voyons pourquoi vouloir tout mettre au même endroit coûte si cher.
-->

---
layout: default
---

# L'Analogie : L'homme à tout faire du restaurant

Imaginez un petit restaurant où une seule personne s'occupe de tout :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>👨‍🍳</span> L'employé unique (Violation de SRP)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li>Prépare les repas en cuisine</li>
      <li>Tient la comptabilité et remplit les fiches fiscales</li>
      <li>Répare la plomberie des sanitaires</li>
      <li>Livre les pizzas à scooter</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-red-700 dark:text-red-300">
      💥 La loi sur la TVA change ? Vous devez déranger votre cuisinier en plein service ! S'il tombe malade, tout le restaurant s'arrête net.
    </div>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
      <span>👥</span> La brigade spécialisée (Respect de SRP)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li><strong>Cuisinier</strong> : son seul métier est la cuisine.</li>
      <li><strong>Comptable</strong> : gère les taxes et la facturation.</li>
      <li><strong>Plombier</strong> : intervient sur les tuyaux.</li>
      <li><strong>Livreur</strong> : achemine les commandes.</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
      ✅ Chaque spécialiste a une seule raison d'évoluer. Changer de logiciel comptable n'a aucun impact sur la cuisson des steaks.
    </div>
  </div>
</div>

<div class="mt-3 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-center">
  🎯 En POO, une classe est comme un employé : <strong>donnez-lui une fiche de poste claire et unique.</strong>
</div>

---
layout: two-cols-header
---

## Le contre-exemple : La classe "Dieu" (*God Object*)

::left::

```ts
// ❌ Mauvaise conception : tout est mélangé !
class RapportVente {
  private ventes: Vente[] = [];

  // 1. Logique métier
  ajouterVente(v: Vente) { this.ventes.push(v); }
  calculerTotal(): number {
    return this.ventes.reduce((acc, v) => acc + v.montant, 0);
  }

  // 2. Présentation / Affichage
  formaterEnHtml(): string {
    return `<h1>Rapport Total: ${this.calculerTotal()}€</h1>`;
  }

  // 3. Persistance / Stockage
  sauvegarderDansFichier(chemin: string): void {
    fs.writeFileSync(chemin, this.formaterEnHtml());
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <div class="font-bold text-red-600 dark:text-red-400 mb-1">Combien de raisons de changer ?</div>
  <p class="opacity-80">Cette classe a <strong>3 raisons distinctes</strong> de devoir être modifiée :</p>
  <ul class="mt-1 space-y-1 list-disc list-inside opacity-80">
    <li>Le calcul des ventes évolue (taxe, devise).</li>
    <li>Le design HTML change (nouvelle maquette CSS).</li>
    <li>Le stockage change (sauvegarde en base SQL ou Cloud).</li>
  </ul>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
  <div class="font-bold text-amber-700 dark:text-amber-300 mb-1">Le risque de conflit d'équipe</div>
  <p class="opacity-80">
    Le développeur front-end qui modifie l'HTML et le développeur back-end qui change le stockage touchent au même fichier. <strong>Conflit Git garanti !</strong>
  </p>
</div>

---
layout: two-cols-header
---

## Le Refactoring SRP : Séparer les préoccupations

::left::

```ts
// 1. Cœur métier uniquement
class RapportVente {
  private ventes: Vente[] = [];
  ajouterVente(v: Vente) { this.ventes.push(v); }
  getVentes(): readonly Vente[] { return this.ventes; }
  calculerTotal(): number {
    return this.ventes.reduce((acc, v) => acc + v.montant, 0);
  }
}

// 2. Présentation uniquement
class FormateurRapportHtml {
  formater(rapport: RapportVente): string {
    return `<h1>Total : ${rapport.calculerTotal()}€</h1>`;
  }
}

// 3. Persistance uniquement
class PersistenceFichier {
  sauvegarder(chemin: string, contenu: string): void {
    fs.writeFileSync(chemin, contenu);
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ 1 classe = 1 responsabilité</div>
  <p class="opacity-80">
    Chaque classe répond à un seul besoin précis et possède <strong>une seule raison de changer</strong>.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">✨ Testabilité maximale</div>
  <p class="opacity-80">
    On peut tester le calcul mathématique de <code>RapportVente</code> sans avoir besoin de créer de fichier sur le disque dur.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">🔄 Réutilisabilité</div>
  <p class="opacity-80">
    Demain, pour générer du JSON au lieu du HTML, il suffit d'écrire <code>FormateurRapportJson</code> sans toucher à <code>RapportVente</code> !
  </p>
</div>

---
layout: two-cols-header
---

## SRP en pratique dans Angular : Composant vs Service

::left::

```ts
// ❌ Violation SRP dans un composant Angular
@Component({ ... })
export class PanierComponent {
  articles: Article[] = [];

  // L'UI s'occupe de la requête HTTP !
  chargerPanier() {
    fetch('https://api.monsite.com/panier')
      .then(r => r.json())
      .then(data => {
        // L'UI s'occupe du calcul TVA !
        data.forEach(a => a.prixTtc = a.prix * 1.21);
        this.articles = data;
      });
  }
}
```

<div class="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-center font-mono">
  Anti-pattern : Le "Smart Component" obèse qui fait tout.
</div>

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">🅰️ La règle d'or Angular</div>
  <p class="opacity-80">Angular est naturellement conçu pour respecter le principe SRP :</p>
  <ul class="mt-1 space-y-1.5 opacity-85">
    <li><strong>Le Composant (`.ts` + `.html`)</strong> : gère uniquement l'affichage et la réaction aux clics de l'utilisateur.</li>
    <li><strong>Le Service (`@Injectable()`)</strong> : gère la logique métier, les calculs et les requêtes HTTP.</li>
  </ul>
</div>

<div class="ms-2 mt-2.5 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">💡 Comment corriger ?</div>
  <p class="opacity-80">
    Déplacez l'appel <code>fetch</code> et le calcul de TVA dans un <code>PanierService</code>. Le composant n'a plus qu'à appeler <code>this.panierService.getArticles()</code>.
  </p>
</div>

---
layout: default
---

# Comment détecter les violations de SRP ?

Voici les signaux d'alarme (*Code Smells*) que vous devez repérer lors de vos revues de code :

<div class="grid grid-cols-2 gap-3 mt-4 text-xs">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-amber-600 dark:text-amber-400 mb-1">1. Le nom de la classe contient "And" ou "Manager"</div>
    <p class="opacity-80">
      Si vous appelez votre classe <code>UserAuthAndEmailSender</code> ou <code>DataManager</code>, c'est le signe évident qu'elle a plusieurs métiers non reliés.
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-red-600 dark:text-red-400 mb-1">2. La classe dépasse plusieurs centaines de lignes</div>
    <p class="opacity-80">
      Une classe de 800 lignes accumule presque systématiquement des responsabilités hétérogènes (calculs, parsing, I/O, formatage).
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">3. Des imports trop diversifiés</div>
    <p class="opacity-80">
      Si un même fichier importe à la fois une bibliothèque de graphiques 2D, un driver de base de données et un client SMTP, SRP est mort.
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
    <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">4. Difficulté à rédiger les tests unitaires</div>
    <p class="opacity-80">
      Si tester une méthode simple nécessite d'instancier 8 objets annexes et de simuler le réseau, la classe est trop grosse.
    </p>
  </div>
</div>

<div class="mt-4 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-center">
  ⚠️ <strong>Attention au piège inverse (L'émiettement)</strong> : SRP ne signifie pas créer une classe par fonction ! Une classe doit conserver une <strong>forte cohésion</strong> autour d'un concept cohérent.
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
  PARTIE 03
</div>

# 'O' — Open/Closed Principle (OCP)
## Ouvert à l'extension, fermé à la modification

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Comment ajouter de nouveaux comportements sans toucher à une seule ligne du code existant qui fonctionne déjà ?
</p>

<!--
Passons au deuxième principe : Open/Closed Principle (OCP).
Formulé par Bertrand Meyer en 1988, il pose une règle contre-intuitive au premier abord :
Comment peut-on ajouter des fonctionnalités sans modifier le code ?
La réponse réside dans l'abstraction et le polymorphisme.
-->

---
layout: default
---

# L'Analogie : Le Smartphone et l'App Store

Vous venez d'acheter un nouveau smartphone et vous souhaitez écouter de la musique en streaming :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>🔨</span> L'approche "Modification du code" (Non OCP)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li>Ouvrir le dos du téléphone avec un tournevis.</li>
      <li>Dessouder les puces de la carte mère.</li>
      <li>Ajouter un composant matériel "Spotify".</li>
      <li>Refermer en espérant ne pas avoir grillé l'écran !</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-red-700 dark:text-red-300">
      💥 Absurde, risqué et coûteux. Vous risquez de détruire les fonctions de base (téléphoner, SMS).
    </div>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
      <span>📲</span> L'approche "Extension par contrat" (Respect d'OCP)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li>Le système d'exploitation fournit des <strong>interfaces d'API</strong>.</li>
      <li>Spotify implémente ce contrat d'application.</li>
      <li>Vous téléchargez l'app sur le Play Store / App Store.</li>
      <li>Le téléphone gagne une fonction <strong>sans modifier son OS</strong>.</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
      ✅ Le système d'exploitation est <strong>fermé à la modification</strong> (protégé) mais <strong>ouvert à l'extension</strong> (applications infinies).
    </div>
  </div>
</div>

<div class="mt-3 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-center">
  🔌 Autre exemple : <strong>Le port USB</strong>. Votre ordinateur n'est jamais modifié quand vous branchez une souris, un clavier ou une manette !
</div>

---
layout: two-cols-header
---

## Le contre-exemple : Le piège du `switch / case`

::left::

```ts
// ❌ Violation flagrante d'OCP
class CalculateurRemise {
  calculerRemise(prix: number, typeClient: string): number {
    if (typeClient === 'STANDARD') {
      return prix * 0.95;
    } else if (typeClient === 'VIP') {
      return prix * 0.85;
    } else if (typeClient === 'ETUDIANT') {
      return prix * 0.80;
    } else if (typeClient === 'BLACK_FRIDAY') {
      return prix * 0.50;
    }
    return prix;
  }
}
```

<div class="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-center font-mono">
  Chaque nouveau client = obligation de modifier cette classe !
</div>

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <div class="font-bold text-red-600 dark:text-red-400 mb-1">Le problème en production</div>
  <p class="opacity-80">
    Cette classe tourne depuis 2 ans sans aucun bug. Demain, le service marketing crée les clients <code>SENIOR</code>.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
  <div class="font-bold text-amber-700 dark:text-amber-300 mb-1">Risque de régression majeur</div>
  <p class="opacity-80">
    Pour ajouter <code>SENIOR</code>, vous <strong>ouvrez le fichier</strong> et modifiez le code.
    Une erreur d'inattention (mauvaise parenthèse, faute de frappe) peut casser le calcul des clients <code>VIP</code> !
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">Obligation de tout retester</div>
  <p class="opacity-80">
    Comme vous avez touché au fichier, l'équipe QA doit retester l'intégralité des types de remises.
  </p>
</div>

---
layout: two-cols-header
---

# La solution OCP : Le Pattern Stratégie

::left::

```ts
// 1. Le contrat d'extension (Interface)
interface StrategieRemise {
  appliquer(prix: number): number;
}

// 2. Les implémentations concrètes
class RemiseStandard implements StrategieRemise {
  appliquer(prix: number): number { return prix * 0.95; }
}

class RemiseVip implements StrategieRemise {
  appliquer(prix: number): number { return prix * 0.85; }
}

// 3. Le calculateur fermé à la modification !
class CalculateurRemise {
  calculer(prix: number, strategie: StrategieRemise): number {
    return strategie.appliquer(prix);
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">🛡️ `CalculateurRemise` est figé</div>
  <p class="opacity-80">
    Cette classe n'a plus <strong>aucun `if` ni `switch`</strong>. Elle se contente d'exécuter le contrat <code>StrategieRemise</code>.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">🔌 Polymorphisme en action</div>
  <p class="opacity-80">
    Au moment de l'exécution, c'est l'instance concrète passée en argument qui dicte la formule appliquée.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">✨ Zéro impact sur le code existant</div>
  <p class="opacity-80">
    Pour ajouter la remise <code>SENIOR</code>, que fait-on ? Regardons la diapositive suivante !
  </p>
</div>

---
layout: two-cols-header
---

# L'Extension en action : Zéro ligne modifiée !

::left::

```ts
// ✨ Nouveau besoin : Remise Senior (-30%)
// On CRÉE un nouveau fichier, on ne touche à RIEN d'autre :

class RemiseSenior implements StrategieRemise {
  appliquer(prix: number): number {
    return prix * 0.70;
  }
}

// Utilisation :
const calculateur = new CalculateurRemise();

const total = calculateur.calculer(
  100,
  new RemiseSenior()
); // 70€
```

<div class="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-center font-bold text-emerald-700 dark:text-emerald-300">
  🎉 Victoire : 0 ligne modifiée dans le code existant !
</div>

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">🔒 Zéro risque de régression</div>
  <p class="opacity-80">
    Puisque <code>CalculateurRemise</code>, <code>RemiseVip</code> et <code>RemiseStandard</code> n'ont pas été touchés, <strong>ils ne peuvent pas être cassés</strong> !
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">🧪 Test unitaire isolé</div>
  <p class="opacity-80">
    Il suffit d'écrire un test unitaire dédié pour <code>RemiseSenior</code>. Pas besoin de re-tester toute l'application.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
  <div class="font-bold text-indigo-600 dark:text-indigo-400 mb-1">🚀 Déploiement serein</div>
  <p class="opacity-80">
    Ajouter une fonctionnalité se résume à <strong>ajouter du code</strong>, jamais à en altérer.
  </p>
</div>

---
layout: two-cols-header
---

## Cas pratique 2 : Système de notification multi-canal

::left::

```ts
// Contrat d'envoi
interface CanalNotification {
  envoyer(destinataire: string, message: string): void;
}

class EmailNotification implements CanalNotification {
  envoyer(dest: string, msg: string) { /* SMTP */ }
}

class SmsNotification implements CanalNotification {
  envoyer(dest: string, msg: string) { /* Twilio */ }
}

class DiscordNotification implements CanalNotification {
  envoyer(dest: string, msg: string) { /* Webhook */ }
}

// Le service reste propre et stable :
class AlerteSecurite {
  constructor(private canal: CanalNotification) {}
  alerter(msg: string) {
    this.canal.envoyer('admin', msg);
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">📱 Évolution continue</div>
  <p class="opacity-80">
    Demain, vous voulez notifier par <strong>WhatsApp</strong>, <strong>Slack</strong> ou <strong>Push Web</strong> ?
  </p>
</div>

<div class="ms-2 mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ Respect total d'OCP</div>
  <p class="opacity-80">
    Vous créez <code>WhatsAppNotification</code> en implémentant l'interface.
    La classe <code>AlerteSecurite</code> ne changera <strong>jamais</strong>.
  </p>
</div>

<div class="ms-2 mt-2.5 p-2 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs">
  <div class="font-bold text-slate-700 dark:text-slate-300 mb-1">💡 La règle réflexe</div>
  <p class="opacity-80">
    Dès que vous vous surprenez à écrire un <code>switch (type)</code> avec plus de 3 branches prévues pour s'étoffer dans le temps : <strong>pensez OCP & interfaces</strong> !
  </p>
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
  PARTIE 04
</div>

# 'D' — Dependency Inversion Principle (DIP)
## Dépendre des abstractions, pas des détails

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Pourquoi le mot-clé <code>new</code> au cœur de vos classes est souvent votre pire ennemi architectural ?
</p>

<!--
Nous arrivons au 'D' : Dependency Inversion Principle.
C'est le principe qui fait le lien direct avec les frameworks modernes comme Angular.
Quand on le comprend, on comprend d'un coup pourquoi Angular utilise des @Injectable, des constructeurs avec injection, et comment tester du code facilement.
-->

---
layout: default
---

# L'Analogie : La prise murale 230V et la lampe

Regardons comment les appareils électriques sont connectés au réseau :

<div class="grid grid-cols-2 gap-4 mt-3">
  <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
    <div class="font-bold text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
      <span>⚡</span> Le couplage direct (Violation de DIP)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li>Vous soudez directement les fils de votre lampe de chevet aux câbles de la centrale nucléaire.</li>
      <li>La lampe dépend intimement du fournisseur d'énergie spécifique.</li>
      <li>Si la centrale passe au solaire ou subit des travaux, votre lampe grille ou devient inutilisable.</li>
      <li>Impossible d'emmener votre lampe dans une autre pièce !</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-red-700 dark:text-red-300">
      💥 Couplage fort et rigide : le haut niveau (votre lampe) est asservi au bas niveau (l'infrastructure).
    </div>
  </div>

  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
      <span>🔌</span> L'inversion par contrat standard (Respect de DIP)
    </div>
    <ul class="space-y-1.5 opacity-85 mt-2">
      <li>On définit une <strong>prise murale standardisée</strong> (230V, 50Hz). C'est <strong>l'abstraction</strong>.</li>
      <li>La lampe implémente la fiche mâle standard.</li>
      <li>Le fournisseur d'électricité alimente la prise standard.</li>
      <li>Que le courant vienne d'une éolienne, d'un barrage ou d'un panneau solaire, la lampe s'allume sans aucune modification !</li>
    </ul>
    <div class="mt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
      ✅ Les deux côtés dépendent d'un même contrat : la prise électrique !
    </div>
  </div>
</div>

---
layout: default
---

# Les deux règles formelles de DIP

Robert C. Martin énonce le principe en deux lois fondamentales :

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
      <span>1️⃣</span> Règle n°1 : Les modules
    </div>
    <p class="opacity-90 leading-relaxed font-medium">
      Les modules de <strong>haut niveau</strong> ne doivent pas dépendre des modules de <strong>bas niveau</strong>. Les deux doivent dépendre d'<strong>abstractions</strong>.
    </p>
  </div>

  <div class="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
    <div class="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
      <span>2️⃣</span> Règle n°2 : Les détails
    </div>
    <p class="opacity-90 leading-relaxed font-medium">
      Les <strong>abstractions</strong> ne doivent pas dépendre des détails d'implémentation. Ce sont les <strong>détails</strong> qui doivent dépendre des abstractions.
    </p>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
  <h4 class="font-bold text-sm mb-2 text-indigo-600 dark:text-indigo-400">💡 Démystifions le jargon :</h4>
  <div class="grid grid-cols-3 gap-2 text-[11px]">
    <div class="p-2 rounded bg-slate-500/10">
      <strong>Haut niveau</strong> : Le cœur métier de votre application (gérer un panier, valider un virement bancaire). C'est ce qui fait la valeur du logiciel.
    </div>
    <div class="p-2 rounded bg-slate-500/10">
      <strong>Bas niveau</strong> : La plomberie technique (requête SQL, localStorage, appel fetch HTTP, écriture de fichier).
    </div>
    <div class="p-2 rounded bg-slate-500/10">
      <strong>Abstraction</strong> : L'interface TypeScript qui définit <em>ce que l'on veut faire</em> sans dire <em>comment c'est fait</em>.
    </div>
  </div>
</div>

---
layout: two-cols-header
---

# Le contre-exemple : Le couplage direct par `new`

::left::

```ts
// Plomberie technique (Bas niveau)
class BaseDeDonneesSQL {
  inserer(table: string, data: any) {
    console.log(`INSERT INTO ${table}...`);
  }
}

// Logique métier (Haut niveau)
class ServiceCommande {
  // ❌ COUPLAGE FORT : "new" en dur !
  private db: BaseDeDonneesSQL = new BaseDeDonneesSQL();

  validerCommande(c: Commande) {
    // Calculs métier...
    this.db.inserer('commandes', c);
  }
}
```

<div class="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-center font-mono">
  Le service métier est pieds et poings liés à SQL.
</div>

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
  <div class="font-bold text-red-600 dark:text-red-400 mb-1">1. Test unitaire impossible !</div>
  <p class="opacity-80">
    Pour tester <code>validerCommande()</code>, vous DEVEZ démarrer un serveur PostgreSQL/MySQL réel. Si le réseau coupe, vos tests échouent.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
  <div class="font-bold text-amber-700 dark:text-amber-300 mb-1">2. Changement technologique bloqué</div>
  <p class="opacity-80">
    Si votre entreprise décide de migrer vers Firebase ou une API REST externe, vous devez réécrire l'intérieur de <code>ServiceCommande</code>.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">3. Qui commande qui ?</div>
  <p class="opacity-80">
    C'est la base de données (détail technique) qui dicte sa loi à la règle métier, au lieu du contraire !
  </p>
</div>

---
layout: two-cols-header
---

# La solution DIP : L'Abstraction intermédiaire

::left::

```ts
// 1. Le contrat métier (Haut niveau)
interface RepositoryCommande {
  sauvegarder(c: Commande): void;
}

// 2. Le service dépend UNIQUEMENT du contrat
class ServiceCommande {
  // ✅ Injection de l'abstraction via le constructeur
  constructor(private repo: RepositoryCommande) {}

  validerCommande(c: Commande) {
    // Logique métier pure
    this.repo.sauvegarder(c);
  }
}

// 3. Implémentation concrète (Bas niveau)
class SqlCommandeRepository implements RepositoryCommande {
  sauvegarder(c: Commande) {
    console.log("INSERT INTO commandes...");
  }
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">🔄 Pourquoi parle-t-on d'"Inversion" ?</div>
  <p class="opacity-80 leading-relaxed">
    <strong>Avant</strong> : Le Métier dépendait de la classe SQL concrète.<br>
    <strong>Après</strong> : La classe SQL doit se soumettre et implémenter le contrat défini pour le Métier.
  </p>
  <div class="mt-1 font-semibold text-emerald-700 dark:text-emerald-300">
    👉 La flèche de dépendance s'est inversée !
  </div>
</div>

<div class="ms-2 mt-2.5 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">📦 Découplage total</div>
  <p class="opacity-80">
    <code>ServiceCommande</code> ne sait pas, et <em>ne veut pas savoir</em>, où sont stockées les commandes (SQL, Mongo, Fichier, Mémoire).
  </p>
</div>

---
layout: two-cols-header
---

## Le super-pouvoir de DIP : Des tests unitaires sans réseau !

::left::

```ts
// Une fausse implémentation en mémoire pour les tests !
class FakeCommandeRepository implements RepositoryCommande {
  commandesSauvegardees: Commande[] = [];

  sauvegarder(c: Commande): void {
    this.commandesSauvegardees.push(c);
  }
}

// Dans votre suite de tests Jest / Vitest :
it('doit sauvegarder la commande valide', () => {
  const fakeRepo = new FakeCommandeRepository();
  const service = new ServiceCommande(fakeRepo);

  service.validerCommande({ id: 'CMD-1', total: 50 });

  // ✅ Vérification instantanée en RAM !
  expect(fakeRepo.commandesSauvegardees.length).toBe(1);
});
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">⚡ Tests instantanés (quelques ms)</div>
  <p class="opacity-80">
    Aucune connexion réseau, aucun serveur de base de données à installer ou à nettoyer après chaque test.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">🎯 Isolation parfaite</div>
  <p class="opacity-80">
    Si ce test échoue, vous êtes <strong>certain à 100%</strong> que le bug vient de votre calcul métier, et non d'une panne réseau ou d'une table SQL verrouillée.
  </p>
</div>

<div class="ms-2 mt-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
  <div class="font-bold text-purple-600 dark:text-purple-400 mb-1">🧪 Simulation d'erreurs</div>
  <p class="opacity-80">
    Vous pouvez créer un <code>ErrorCommandeRepository</code> qui lève une exception pour tester la réaction de votre application en cas de panne !
  </p>
</div>

---
layout: two-cols-header
---

## DIP au cœur d'Angular : L'Injection de Dépendances

::left::

```ts
// 1. Déclaration du service injectable
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private http = inject(HttpClient);

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>('/api/articles');
  }
}

// 2. Le composant n'instancie JAMAIS le service avec 'new' !
@Component({ ... })
export class ListeArticlesComponent {
  // Angular injecte automatiquement l'instance !
  private articleService = inject(ArticleService);
  articles$ = this.articleService.getArticles();
}
```

::right::

<div class="ms-2 mt-1 p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
  <div class="font-bold text-blue-600 dark:text-blue-400 mb-1">🅰️ Le rôle du Conteneur d'Injection</div>
  <p class="opacity-80">
    Dans Angular, vous n'écrivez jamais <code>new ArticleService()</code> dans vos composants. C'est le <strong>moteur d'injection (DI)</strong> d'Angular qui s'en charge.
  </p>
</div>

<div class="ms-2 mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
  <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">🎭 Remplacement de mock dans les tests</div>
  <p class="opacity-80 leading-relaxed">
    Dans un test de composant Angular, vous pouvez déclarer :<br>
    <code>providers: [{ provide: ArticleService, useValue: mockArticleService }]</code>.<br>
    Le composant recevra le faux service sans s'en rendre compte !
  </p>
</div>

<div class="ms-2 mt-2.5 p-2 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs">
  💡 <strong>Distinction essentielle</strong> : DIP est le <em>principe architectural</em>. L'injection de dépendances (DI) est l'<em>outil technique</em> qui le réalise.
</div>

---
layout: center
class: text-center
---

<div class="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-mono font-semibold rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
  PARTIE 05
</div>

# Synergie & Synthèse
## Comment S, O et D travaillent ensemble

<p class="opacity-70 text-sm max-w-lg mx-auto">
  Les trois principes ne vivent pas isolés : ils s'épaulent mutuellement pour former une architecture propre.
</p>

<!--
Pour terminer cette séance, prenons du recul.
Vous avez vu S, O et D séparément.
Mais la véritable force apparaît quand ils sont combinés sur un même projet.
-->

---
layout: default
---

# L'enchaînement vertueux : S ➔ O ➔ D

<div class="grid grid-cols-3 gap-3 mt-4 text-xs">
  <div class="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
    <div class="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
      <span>1️⃣</span> Étape 1 : Le "S" (SRP)
    </div>
    <p class="opacity-80 leading-relaxed">
      On commence par <strong>nettoyer et isoler</strong>. On repère les classes qui font trop de choses et on extrait chaque responsabilité dans une unité dédiée.
    </p>
    <div class="mt-2.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
      👉 Résultat : Des rôles bien définis.
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
    <div class="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
      <span>2️⃣</span> Étape 2 : Le "O" (OCP)
    </div>
    <p class="opacity-80 leading-relaxed">
      Pour les rôles susceptibles d'évoluer (tarifs, notifications, exports), on crée des <strong>interfaces contractuelles</strong> plutôt que des `switch / case`.
    </p>
    <div class="mt-2.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
      👉 Résultat : Extensibilité sans risque de casse.
    </div>
  </div>

  <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
    <div class="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
      <span>3️⃣</span> Étape 3 : Le "D" (DIP)
    </div>
    <p class="opacity-80 leading-relaxed">
      On <strong>injecte</strong> ces interfaces dans les constructeurs au lieu d'instancier en dur avec `new`. Le cœur applicatif ne dépend que d'abstractions.
    </p>
    <div class="mt-2.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
      👉 Résultat : Découplage et tests instantanés.
    </div>
  </div>
</div>

<div class="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-emerald-500/15 border border-blue-500/30 text-xs text-center font-medium">
  ✨ <strong>L'équation de la réussite</strong> : SRP isole les pièces · OCP les rend interchangeables · DIP permet de les brancher proprement.
</div>

---
layout: default
---

# Tableau récapitulatif : Détecter & Corriger

<div class="mt-3 text-xs">

| Principe | Question clé à se poser | Signal d'alarme (*Code smell*) | Solution à appliquer |
|:---:|---|---|---|
| <strong class="text-blue-500 font-mono text-sm">SRP</strong> | *Cette classe a-t-elle une seule responsabilité ?* | Classe > 300 lignes, nom avec `And` ou `Manager`, mélange calcul et I/O. | Découper en plusieurs classes spécialisées à haute cohésion. |
| <strong class="text-indigo-500 font-mono text-sm">OCP</strong> | *Puis-je ajouter une variante sans toucher au code existant ?* | Blocs `switch(type)` ou longues séries de `if / else if` qui grandissent. | Extraire une `interface` et utiliser le polymorphisme (Pattern Stratégie). |
| <strong class="text-emerald-500 font-mono text-sm">DIP</strong> | *Mon métier dépend-il d'une technologie précise ?* | Présence de `new ServiceSQL()` ou `new HttpClient()` dans le constructeur. | Définir un contrat d'interface et injecter la dépendance depuis l'extérieur. |

</div>

<div class="grid grid-cols-2 gap-3 mt-4 text-xs">
  <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center font-medium">
    🧪 <strong>Bénéfice n°1</strong> : Le code devient 100% testable avec des mocks légers en mémoire.
  </div>
  <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center font-medium">
    🛡️ <strong>Bénéfice n°2</strong> : Vos collègues peuvent ajouter des fonctionnalités sans toucher à vos fichiers.
  </div>
</div>

---
layout: default
---

# 📌 Récapitulatif : Les 4 Règles d'Or

<div class="grid grid-cols-2 gap-3.5 mt-4">
  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-blue-600 dark:text-blue-400 text-sm">1. Une seule fiche de poste (SRP)</strong>
    <p class="opacity-75 mt-0.5">
      Ne laissez jamais une classe gérer à la fois la logique métier, la présentation visuelle et la persistance des données. Séparez composants et services.
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-indigo-600 dark:text-indigo-400 text-sm">2. Étendre sans modifier (OCP)</strong>
    <p class="opacity-75 mt-0.5">
      Remplacez les cascades de <code>if / switch</code> par des interfaces et du polymorphisme. Pour ajouter une option, créez une classe au lieu d'altérer un fichier éprouvé.
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-emerald-600 dark:text-emerald-400 text-sm">3. Bannir le `new` hardcodé (DIP)</strong>
    <p class="opacity-75 mt-0.5">
      Ne faites jamais un <code>new</code> direct sur une classe technique (base de données, HTTP, stockage) dans votre cœur métier. Passez par une abstraction et injectez.
    </p>
  </div>

  <div class="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15 text-xs">
    <strong class="text-purple-600 dark:text-purple-400 text-sm">4. Garder le sens de la mesure</strong>
    <p class="opacity-75 mt-0.5">
      SOLID n'est pas une religion : n'anticipez pas des abstractions inutiles sur du code trivial qui ne changera jamais (*KISS - Keep It Simple, Stupid*).
    </p>
  </div>
</div>

<div class="mt-4 p-2.5 rounded-xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 text-xs text-center font-bold">
  🚀 Dès votre prochain TP ou projet Angular : appliquez ces réflexes pour un code robuste et professionnel !
</div>

