# Séance 11 — Principes SOLID (S, O, D)

**Cours de programmation orientée objet — Bachelier en informatique (EAFC)**  
**Stack technique : TypeScript 5+, Angular 21/22 (approche signal-first)**

---

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant est en mesure de :

1. **Identifier la crise de la maintenance logicielle** : diagnostiquer les trois grandes pathologies du code non structuré (*Code Smells*) — la **Rigidité**, la **Fragilité** et l'**Immobilité** — et comprendre pourquoi un code qui « fonctionne » peut être une bombe à retardement pour l'entreprise.
2. **Situer le rôle de l'acronyme SOLID** : connaître le panorama des cinq principes fondamentaux formulés par Robert C. Martin (*Uncle Bob*), et situer l'action prioritaire du trio **S**, **O** et **D** dans l'architecture TypeScript et Angular.
3. **Appliquer le principe de responsabilité unique (SRP - *Single Responsibility Principle*)** : attribuer une seule et unique raison de changer à chaque classe, démanteler les « classes Dieu » (*God Objects*), et séparer rigoureusement la logique métier, la présentation visuelle et la persistance des données.
4. **Mettre en œuvre le principe Ouvert / Fermé (OCP - *Open/Closed Principle*)** : concevoir des modules ouverts à l'extension mais fermés à la modification, éradiquer les cascades conditionnelles instables (`switch` et `if / else if`) au profit du polymorphisme d'interface et du patron de conception Stratégie (*Strategy Pattern*).
5. **Maîtriser le principe d'inversion des dépendances (DIP - *Dependency Inversion Principle*)** : proscrire l'instanciation technique en dur (`new`) au cœur du domaine métier, faire dépendre les modules de haut niveau et de bas niveau d'abstractions communes, et expliciter l'inversion de la flèche de couplage.
6. **Révolutionner la testabilité logicielle grâce à DIP** : substituer des briques d'infrastructure complexes (réseau HTTP, bases de données) par des doubles de test en mémoire (*Mocks*, *Fakes*), permettant une suite de tests unitaires ultra-rapide et déterministe.
7. **Exploiter le système d'injection de dépendances d'Angular** : comprendre la mécanique native du conteneur d'injection (`inject()`, `@Injectable()`, providers de test), et orchestrer la synergie **S ➔ O ➔ D** au sein d'une application Angular moderne articulée autour des signaux réactifs.

---

## Partie 00 — Le cheminement : d'où venons-nous ?

Cette onzième séance marque l'entrée dans la maturité de notre cursus de Programmation Orientée Objet. Depuis le début du semestre, nous avons exploré et assemblé l'ensemble des mécanismes techniques fondamentaux du paradigme objet :

- **Séance 5 — Encapsulation & Invariants** : nous avons verrouillé l'état interne de nos objets (`private`), exposé des accesseurs contrôlés et garanti qu'un objet ne puisse jamais naître ou subsister dans un état incohérent.
- **Séances 6 & 7 — Héritage & Polymorphisme** : nous avons factorisé nos structures (`extends`, `super()`), éliminé les aiguillages conditionnels primitifs et laissé la liaison dynamique exécuter le comportement adéquat selon le type concret de l'instance.
- **Séance 8 — Classes Abstraites & Interfaces** : nous avons défini des contrats purs, interdit les instanciations d'objets incomplets et profité de la souplesse du typage structurel de TypeScript.
- **Séance 9 — Composition vs Héritage** : nous avons compris qu'il est infiniment plus robuste d'*assembler* des briques spécialisées (« relation a-un ») et de déléguer des traitements que de s'enfermer dans une généalogie rigide (« relation est-un »).
- **Séance 10 — Exceptions & Robustesse** : nous avons appris à interrompre proprement l'exécution en cas de rupture de contrat (`throw`), à dérouler la pile (*stack unwinding*), à typer strictement les erreurs avec `unknown` et à préserver l'intégrité de l'application grâce au bloc `finally`.

À ce stade de votre formation, vous disposez d'une boîte à outils technique complète. Pourtant, un constat troublant frappe la majorité des développeurs juniors :

> **« Mon code compile sans erreur, mes fonctionnalités tournent en local... et pourtant, dès que le projet grandit ou que le client demande une évolution, chaque modification devient un calvaire ! »**

Avoir des outils puissants ne garantit pas de bâtir un édifice solide. Sans principes directeurs d'organisation, la POO peut rapidement produire des monstres d'incohérence : des « usines à gaz » opaques où la moindre retouche provoque des pannes en cascade.

Pour comprendre pourquoi les principes SOLID ont été inventés, analysons le piège le plus insidieux du développement logiciel : l'illusion du code qui marche.

---

### Le piège : l'illusion du « Ça marche, donc c'est bon »

Considérons une classe rédigée de manière tout à fait spontanée par un développeur pressé au sein d'une application e-commerce :

```typescript
// ❌ ANTI-PATTERN ARCHITECTURAL : Le code "tout-en-un" du débutant
import { SQLiteConnection } from './database';
import { SmtpClient } from './smtp';

export class ApplicationBoutique {
  validerPanier(panier: any[]): void {
    // 1. Calcul mathématique du total et calcul d'une remise
    let total = 0;
    for (const item of panier) {
      total += item.prix * item.quantite;
    }
    if (total > 100) {
      total *= 0.9; // 10% de remise pour les commandes > 100€
    }

    // 2. Persistance directe dans une table de base de données
    const db = new SQLiteConnection('boutique.db');
    db.execute(
      `INSERT INTO commandes (total, date) VALUES (${total}, '${new Date().toISOString()}')`
    );

    // 3. Envoi d'un courriel de confirmation via le réseau
    const smtp = new SmtpClient('smtp.mail.com', 587);
    smtp.sendMail('client@domaine.com', `Merci pour votre achat ! Total réglé : ${total} €`);
  }
}
```

Lorsque vous testez ce code sur votre poste de développement, il fait exactement ce qu'on lui demande : le calcul est juste, la ligne apparaît dans SQLite, et l'email arrive dans la boîte de test. En apparence, le travail est fait.

Mais d'un point de vue de l'ingénierie logicielle, ce code est une **bombe à retardement** :

1. **Une adhérence technologique toxique** : si le serveur SMTP change son port de sécurité, ou si l'entreprise décide de stocker les commandes dans une API Cloud plutôt qu'en SQLite, vous devez ouvrir et modifier le fichier même qui calcule le total du panier !
2. **L'impossibilité d'écrire des tests unitaires** : comment vérifier que la formule mathématique `total > 100 => 10% de remise` est exacte ? Vous êtes contraint d'avoir un fichier SQLite accessible et d'envoyer un vrai courriel sur internet à chaque exécution du test unitaire ! Le test sera lent, fragile et dépendant du réseau.
3. **Une immobilité totale** : impossible d'extraire ce calcul de remise pour l'utiliser dans une application mobile ou un point de vente physique sans emporter avec soi les bibliothèques SQLite et SMTP.

---

### Les 3 pathologies du mauvais code (*Code Smells*)

Lorsqu'une base de code ignore les règles saines de conception, elle contracte inévitablement l'une des trois maladies chroniques théorisées par Robert C. Martin :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LES 3 PATHOLOGIES DU CODE SPAGHETTI                  │
├────────────────────────────────────────────────────────────────────────┤
│ 🧱 LA RIGIDITÉ                                                         │
│    Le logiciel résiste au changement. Chaque petite demande d'évolution│
│    impose de modifier 10 fichiers en cascade.                          │
│    ➔ Symptôme : "Une heure pour coder, trois jours pour propager."    │
├────────────────────────────────────────────────────────────────────────┤
│ 💣 LA FRAGILITÉ                                                        │
│    Modifier un module provoque des régressions inattendues dans un     │
│    secteur totalement étranger de l'application.                       │
│    ➔ Symptôme : "On répare une fuite, deux tuyaux éclatent ailleurs." │
├────────────────────────────────────────────────────────────────────────┤
│ 🔗 L'IMMOBILITÉ                                                        │
│    Impossible d'isoler une classe pour la réutiliser dans un autre     │
│    projet car elle est soudée à ses dépendances d'infrastructure.      │
│    ➔ Symptôme : "Vous vouliez une banane, vous avez le gorille et      │
│                  toute la jungle avec !"                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

### L'Analogie : Le Château de Cartes vs Les Briques LEGO

Pour visualiser la différence entre un code improvisé et une architecture logicielle professionnelle, comparons deux modes de construction physique :

<div align="center">

```
   LE CHÂTEAU DE CARTES (Anti-pattern)           LA BOÎTE DE LEGO (Architecture SOLID)
               /\                                       ┌─────┐   ┌─────┐
              /  \                                      │  A  │───│  B  │
             /____\                                     └─────┘   └─────┘
            /\    /\                                       │         │
           /  \  /  \                                   ┌─────┐   ┌─────┐
          /____\/____\                                  │  C  │───│  D  │
                                                        └─────┘   └─────┘
   - Éléments en appui mutuel précaire          - Pièces autonomes et standardisées
   - La moindre secousse effondre le tout       - On remplace une brique sans toucher aux autres
   - "Surtout, ne touchez plus à rien !"        - Évolutions et tests chirurgicaux
```

</div>

- **Dans le château de cartes**, chaque élément soutient directement les autres. Il n'existe aucune frontière claire. Les développeurs vivent dans la hantise constante de toucher au code en production, car ils ne maîtrisent plus les effets de bord.
- **Dans la boîte de briques LEGO**, chaque élément possède une géométrie et un rôle stricts. Les briques s'emboîtent grâce à une norme d'interconnexion universelle (les picots, qui correspondent à nos **interfaces**). Remplacer une brique rouge par une brique bleue ne nécessite jamais de démolir la maison.

---

### Le panorama SOLID : Les 5 piliers de la conception objet

Au début des années 2000, l'ingénieur américain Robert C. Martin (*Uncle Bob*) rassemble sous l'acronyme mnémotechnique **SOLID** cinq règles d'or destinées à concevoir des architectures modulaires, testables et pérennes :

| Lettre | Principe | Idée maîtresse | Traitement dans le cursus |
|:---:|---|---|:---:|
| **S** | **Single Responsibility Principle** | Une classe ne doit avoir qu'**une seule raison de changer**. | ✅ **Focus majeur de cette séance 11** |
| **O** | **Open / Closed Principle** | Une classe doit être **ouverte à l'extension**, mais **fermée à la modification**. | ✅ **Focus majeur de cette séance 11** |
| **L** | **Liskov Substitution Principle** | Une sous-classe doit pouvoir remplacer sa classe mère sans altérer la cohérence du système. | ⏩ *Déjà abordé en Séance 7 (Polymorphisme)* |
| **I** | **Interface Segregation Principle** | Mieux vaut plusieurs petites interfaces spécialisées qu'une seule interface obèse. | ⏩ *Déjà abordé en Séance 8 (Interfaces)* |
| **D** | **Dependency Inversion Principle** | Les modules doivent dépendre d'**abstractions**, jamais de détails concrets. | ✅ **Focus majeur de cette séance 11** |

> [!NOTE]
> Les principes **L** (Liskov) et **I** (Ségrégation des interfaces) ont déjà été abondamment pratiqués lors des séances dédiées au polymorphisme et aux interfaces contractuelles. Notre mission prioritaire aujourd'hui est d'ancrer le trio souverain **S**, **O** et **D**, qui structure directement l'architecture d'applications d'entreprise en TypeScript et sous Angular.

---

## Partie 01 — 'S' : Single Responsibility Principle (SRP)

### 1.1 Définition formelle et intuition

Le premier principe de SOLID s'énonce ainsi :

> **« Une classe ne doit avoir qu'une seule et unique raison de changer. »**  
> *(A class should have one, and only one, reason to change — Robert C. Martin)*

Pour bien appréhender cette règle, il faut dissiper une confusion fréquente chez les débutants : **une responsabilité ne signifie pas « une seule méthode »**. Une classe peut posséder dix méthodes différentes tout en respectant scrupuleusement le SRP, pourvu que toutes ces méthodes concourent au même rôle métier.

Une « raison de changer » découle d'un **acteur** ou d'une **source d'exigences**. Si l'équipe comptable, l'équipe design UI et l'administrateur système peuvent tous trois venir vous demander de modifier la même classe, cette classe possède trois raisons de changer : elle viole violemment le SRP.

---

### 1.2 L'Analogie : L'homme à tout faire du restaurant

Imaginons un restaurateur qui, par souci d'économie immédiate, embauche une seule personne pour tenir tout son établissement :

```
               ┌────────────────────────────────────────────────────────┐
               │         L'EMPLOYÉ UNIQUE (Violation du SRP)            │
               ├────────────────────────────────────────────────────────┤
               │  • Prépare les sauces et cuit les viandes en cuisine   │
               │  • Établit le bilan comptable et calcule la TVA        │
               │  • Réserve les tables et accueille les clients         │
               │  • Répare la tuyauterie des sanitaires                 │
               │  • Livrera les commandes à domicile à scooter          │
               └────────────────────────────────────────────────────────┘
```

Que se passe-t-il dans la réalité ?
- Si l'administration fiscale modifie le taux de TVA, vous devez déranger votre cuisinier en plein coup de feu pour lui faire réviser ses formulaires.
- Si le cuisinier se blesse à scooter en livrant une pizza, **plus personne ne fait la cuisine, plus personne ne facture, tout le restaurant s'effondre**.

À l'inverse, un grand restaurant organise une **brigade spécialisée** :
- Le **Chef cuisinier** n'a qu'un rôle : la préparation culinaire. Si la fiscalité change, il n'en sait rien et continue de cuire ses viandes.
- Le **Comptable** gère les livres de comptes. Si le four tombe en panne, sa journée de travail n'est pas perturbée.
- Le **Livreur** assure la logistique externe.

En programmation orientée objet, appliquez cette métaphore à la lettre : **donnez à chaque classe une fiche de poste limpide, cohérente et délimitée**.

---

### 1.3 Le contre-exemple : La classe « Dieu » (*God Object*)

Examinons une implémentation violant le SRP dans la gestion de rapports de ventes :

```typescript
// ❌ ANTI-PATTERN ARCHITECTURAL : La classe "Dieu" omnisciente
import * as fs from 'fs';

export interface Vente {
  readonly id: string;
  readonly montant: number;
  readonly description: string;
}

export class RapportVente {
  private ventes: Vente[] = [];

  // Responsabilité 1 : Logique métier et calculs
  ajouterVente(vente: Vente): void {
    this.ventes.push(vente);
  }

  calculerTotal(): number {
    return this.ventes.reduce((acc, v) => acc + v.montant, 0);
  }

  calculerTva(taux: number): number {
    return this.calculerTotal() * taux;
  }

  // Responsabilité 2 : Présentation et mise en forme visuelle
  formaterEnHtml(): string {
    const lignes = this.ventes
      .map(v => `<tr><td>${v.description}</td><td>${v.montant} €</td></tr>`)
      .join('');
    return `
      <div class="rapport">
        <h1>Rapport Financier</h1>
        <table>${lignes}</table>
        <strong>Total TTC : ${this.calculerTotal()} €</strong>
      </div>
    `;
  }

  // Responsabilité 3 : Persistance et accès au système de fichiers
  sauvegarderDansFichier(chemin: string): void {
    const contenu = this.formaterEnHtml();
    fs.writeFileSync(chemin, contenu, 'utf-8');
  }
}
```

Analysons pourquoi cette classe est condamnée à poser des problèmes :

1. **Trois raisons distinctes d'évoluer** :
   - *Raison Métier* : Le directeur financier souhaite exclure les ventes annulées du total.
   - *Raison Présentation* : L'équipe UI modernise la charte graphique et remplace les tableaux `<table>` par des grilles CSS avec Tailwind.
   - *Raison Infrastructure* : L'administrateur système demande de remplacer l'écriture sur disque local par un envoi vers un stockage S3 Cloud.
2. **Le risque de conflits Git majeurs** : Le développeur front-end qui modifie les balises HTML et le développeur back-end qui change la méthode d'écriture disque modifient le même fichier au même moment. La fusion des branches sera source d'erreurs.
3. **Le coût des tests** : Pour tester si `calculerTotal()` fait bien une somme arithmétique, le moteur de test doit charger le module `fs` de Node.js.

---

### 1.4 Le Refactoring SRP : Séparer les préoccupations

Appliquons le principe SRP en découpant ce bloc monolithique en trois unités à haute cohésion :

```typescript
// ✅ CODE PROFESSIONNEL CONFORME AU SRP

// 1. Cœur métier pur : ne s'occupe QUE de la gestion des données de vente
export class RapportVente {
  private readonly _ventes: Vente[] = [];

  ajouterVente(vente: Vente): void {
    this._ventes.push(vente);
  }

  get ventes(): readonly Vente[] {
    return this._ventes;
  }

  calculerTotal(): number {
    return this._ventes.reduce((acc, v) => acc + v.montant, 0);
  }

  calculerTva(taux: number): number {
    return this.calculerTotal() * taux;
  }
}

// 2. Présentation : ne s'occupe QUE de la génération de représentations visuelles
export class FormateurRapportHtml {
  formater(rapport: RapportVente): string {
    const lignes = rapport.ventes
      .map(v => `<tr><td>${v.description}</td><td>${v.montant} €</td></tr>`)
      .join('');
    return `
      <div class="rapport-card">
        <h2>Rapport Financier</h2>
        <table>${lignes}</table>
        <p class="total">Total : ${rapport.calculerTotal()} €</p>
      </div>
    `;
  }
}

// 3. Persistance : ne s'occupe QUE des opérations d'entrée/sortie (I/O)
export class PersistenceFichier {
  sauvegarder(chemin: string, contenu: string): void {
    fs.writeFileSync(chemin, contenu, 'utf-8');
  }
}
```

Voyez les bénéfices immédiats de cette séparation :
- **Extensibilité naturelle** : Demain, si le client exige un export en JSON au lieu de HTML, nous créons simplement une classe `FormateurRapportJson`. La classe `RapportVente` n'est pas modifiée d'un seul caractère !
- **Testabilité chirurgicale** : Nous pouvons valider les calculs mathématiques de `RapportVente` en mémoire vive pure, sans jamais toucher au disque dur.

---

### 1.5 SRP en pratique dans Angular : Composant vs Service

Dans le framework Angular, la violation de SRP est l'erreur la plus répandue chez les développeurs débutants. Elle porte un nom : le syndrome du **Smart Component obèse**.

```typescript
// ❌ ANTI-PATTERN ANGULAR : Le composant qui fait tout
@Component({
  selector: 'app-panier',
  standalone: true,
  template: `<!-- rendu HTML -->`
})
export class PanierComponent {
  articles: Article[] = [];

  // Le composant d'interface gère directement le réseau HTTP et le calcul métier !
  chargerPanier(): void {
    fetch('https://api.monsite.com/panier')
      .then(res => res.json())
      .then((data: Article[]) => {
        // Calcul métier fiscal au beau milieu du composant graphique !
        data.forEach(article => {
          article.prixTtc = article.prixHt * 1.21;
        });
        this.articles = data;
      });
  }
}
```

La philosophie native d'Angular impose une frontière SRP rigoureuse :

```
┌───────────────────────────────────────┐         ┌───────────────────────────────────────┐
│        COMPOSANT ANGULAR              │         │         SERVICE ANGULAR               │
│   (`*.component.ts` + `*.html`)       │         │       (`*.service.ts`)                │
├───────────────────────────────────────┤         ├───────────────────────────────────────┤
│ • Gérer l'affichage visuel (DOM)      │ ──────> │ • Exécuter les requêtes HTTP (API)    │
│ • Capter les événements de l'usager   │ délègue │ • Appliquer les règles de calcul      │
│ • Exposer des signaux réactifs d'état │         │ • Maintenir la logique métier pure    │
└───────────────────────────────────────┘         └───────────────────────────────────────┘
```

Dans un code propre, le composant se contente d'injecter un `PanierService` et d'appeler `this.panierService.chargerArticles()`. Si la formule de TVA ou l'URL de l'API change, le composant visuel ne subit aucune modification.

---

### 1.6 Diagnostic : Détecter les violations de SRP

Comment repérer qu'une classe enfreint le principe de responsabilité unique lors d'une relecture de code (*code review*) ? Surveillez les quatre signaux d'alarme suivants :

1. **Le nom de la classe contient des mots de liaison ou des termes génériques** :  
   Des appellations telles que `UserAuthAndNotificationManager`, `OrderDataHandler` ou `CommonUtils` révèlent immédiatement une juxtaposition de métiers hétérogènes.
2. **Le fichier dépasse plusieurs centaines de lignes** :  
   Une classe excédant 300 à 400 lignes accumule presque systématiquement des détails techniques (requêtes, conversions, affichage) greffés à la logique métier.
3. **Le bloc d'imports ressemble à un inventaire à la Prévert** :  
   Si un même fichier importe à la fois `HttpClient`, un générateur de PDF, des fonctions de hachage cryptographique et des composants d'interface, la classe a trop de casquettes.
4. **La rédaction des tests unitaires devient un supplice** :  
   Si tester une simple méthode de calcul vous oblige à initialiser dix mocks d'infrastructure, c'est que la méthode est prisonnière d'une classe encombrée de responsabilités parasites.

> [!CAUTION]
> **Attention au piège de l'émiettement excessif (*Nano-classes*) !**  
> Le SRP n'exige pas de créer une classe par fonction ! Une classe doit conserver une **forte cohésion interne**. Factoriser ensemble des données et des méthodes qui gravitent autour d'un même concept métier est sain ; c'est le mélange de domaines distincts (métier, réseau, stockage, UI) qu'il faut proscrire.

---

## Partie 02 — 'O' : Open/Closed Principle (OCP)

### 2.1 Définition et principe fondamental

Formulé pour la première fois par l'informaticien Bertrand Meyer en 1988, le principe Ouvert / Fermé s'énonce comme suit :

> **« Une entité logicielle (classe, module, fonction) doit être ouverte à l'extension, mais fermée à la modification. »**

Cette maxime semble de prime abord paradoxale : comment peut-on enrichir les capacités d'un système sans modifier son code source ?

La réponse réside dans la puissance de **l'abstraction** et du **polymorphisme** :
- **Ouverte à l'extension** : le comportement de l'application peut être enrichi pour répondre à de nouveaux besoins du marché.
- **Fermée à la modification** : le code initial, déjà éprouvé, testé et déployé en production, ne doit faire l'objet d'aucune altération chirurgicale.

---

### 2.2 L'Analogie : Le Smartphone et l'App Store

Considérez votre téléphone intelligent. Vous venez de l'acquérir et vous souhaitez utiliser une nouvelle application de navigation GPS :

```
                  ┌────────────────────────────────────────────────────────┐
                  │    L'APPROCHE PAR "MODIFICATION" (Violation d'OCP)     │
                  ├────────────────────────────────────────────────────────┤
                  │  • Ouvrir le boîtier du téléphone au tournevis         │
                  │  • Dessouder des puces de la carte mère                │
                  │  • Modifier le micro-logiciel du fabricant             │
                  │  • Refermer en priant pour ne pas avoir grillé l'écran │
                  └────────────────────────────────────────────────────────┘
```

Cette démarche est évidemment absurde et destructrice. Le fabricant d'ordinateurs ou de smartphones a résolu ce problème grâce au principe OCP :

```
                  ┌────────────────────────────────────────────────────────┐
                  │    L'APPROCHE PAR "EXTENSION" (Respect total d'OCP)    │
                  ├────────────────────────────────────────────────────────┤
                  │  • Le système d'exploitation publie des CONTRATS (API) │
                  │  • L'application tierce implémente ces contrats        │
                  │  • Vous installez l'application depuis le store        │
                  │  • Le smartphone gagne un comportement nouveau sans    │
                  │    qu'une seule ligne de l'OS n'ait été réécrite !     │
                  └────────────────────────────────────────────────────────┘
```

Le même raisonnement s'applique aux **ports USB** de votre ordinateur : vous pouvez brancher une souris optique, une guitare électrique ou une manette de jeu sans jamais ouvrir le châssis de votre machine. Le port USB est un **contrat matériel standardisé**.

---

### 2.3 Le contre-exemple : Le piège destructeur du `switch / case`

Examinons une classe chargée d'octroyer des remises commerciales à des clients selon leur statut :

```typescript
// ❌ ANTI-PATTERN ARCHITECTURAL : La cascade conditionnelle non-OCP
export class CalculateurRemise {
  calculerPrixFinal(prixBase: number, typeClient: string): number {
    switch (typeClient) {
      case 'STANDARD':
        return prixBase * 0.95; // 5% de réduction
      case 'VIP':
        return prixBase * 0.85; // 15% de réduction
      case 'ETUDIANT':
        return prixBase * 0.80; // 20% de réduction
      case 'BLACK_FRIDAY':
        return prixBase * 0.50; // 50% de réduction
      default:
        return prixBase;
    }
  }
}
```

Cette méthode fonctionne parfaitement lors du lancement du projet. Mais imaginez le scénario en entreprise après deux ans d'exploitation sans aucun incident :

1. **Le marketing invente un profil `SENIOR` (-30%)** :  
   Pour intégrer cette règle, le développeur est contraint d'**ouvrir le fichier existant** et d'insérer une clause `case 'SENIOR': return prixBase * 0.70;`.
2. **Le risque de régression inopiné** :  
   Une inadvertance (l'oubli d'un `break`, une parenthèse mal fermée, une faute de frappe dans la formule du profil `VIP`) peut introduire un bug critique dans une fonctionnalité qui marchait parfaitement depuis deux ans !
3. **La panique de la validation** :  
   Comme le fichier central a été altéré, l'équipe d'assurance qualité (QA) est contrainte de ré-exécuter l'intégralité des tests de tous les types de remises.

---

### 2.4 La solution OCP : Le Pattern Stratégie (*Strategy Pattern*)

Pour immuniser notre architecture contre ces régressions, nous substituons l'aiguillage impératif par un contrat d'interface polymorphique :

```typescript
// ✅ CONCEPTION OCP PROFESSIONNELLE : Le Pattern Stratégie

// 1. Le contrat universel d'extension (Interface)
export interface StrategieRemise {
  readonly identifiant: string;
  appliquer(prix: number): number;
}

// 2. Les implémentations concrètes initiales
export class RemiseStandard implements StrategieRemise {
  readonly identifiant = 'STANDARD';
  appliquer(prix: number): number {
    return prix * 0.95;
  }
}

export class RemiseVip implements StrategieRemise {
  readonly identifiant = 'VIP';
  appliquer(prix: number): number {
    return prix * 0.85;
  }
}

export class RemiseEtudiant implements StrategieRemise {
  readonly identifiant = 'ETUDIANT';
  appliquer(prix: number): number {
    return prix * 0.80;
  }
}

// 3. Le calculateur fermé à la modification !
export class CalculateurRemise {
  calculerPrixFinal(prixBase: number, strategie: StrategieRemise): number {
    // Aucune condition, aucun switch : délégation polymorphique pure !
    return strategie.appliquer(prixBase);
  }
}
```

Observez la transformation fondamentale :
- La classe `CalculateurRemise` est désormais **fermée à la modification**. Elle ne comporte plus aucun `switch`, ni aucun `if`. Son algorithme est stable et définitif.
- Elle est simultanément **ouverte à l'extension** : toute formule de remise imaginable pourra lui être fournie, pourvu qu'elle implémente le contrat `StrategieRemise`.

---

### 2.5 L'Extension en action : Zéro ligne modifiée !

Le service marketing demande l'intégration de la remise `SENIOR` (-30%) ?  
Voici l'intégralité de l'intervention logicielle requise :

```typescript
// ✨ AJOUT DE FONCTIONNALITÉ : Fichier totalement neuf (remise-senior.ts)
import { StrategieRemise } from './strategie-remise';

export class RemiseSenior implements StrategieRemise {
  readonly identifiant = 'SENIOR';

  appliquer(prix: number): number {
    return prix * 0.70;
  }
}

// Utilisation dans l'application :
const calculateur = new CalculateurRemise();
const prixSenior = calculateur.calculerPrixFinal(100, new RemiseSenior());
console.log(`Prix Senior appliqué : ${prixSenior} €`); // 70 €
```

> [!TIP]
> **Le bilan de l'intervention** :  
> Le fichier `calculateur-remise.ts` n'a pas été ouvert. Les fichiers `remise-vip.ts` et `remise-standard.ts` n'ont pas bougé d'un octet. Le risque d'introduire une régression dans les calculs existants est de **zéro pour cent**.

---

### 2.6 Cas pratique 2 : Système de notification multi-canal

Le principe OCP s'applique avec la même élégance à l'envoi d'alertes dans un système distribué :

```typescript
// Contrat d'émission
export interface CanalNotification {
  envoyer(destinataire: string, message: string): void;
}

// Canaux concrets initiaux
export class EmailNotification implements CanalNotification {
  envoyer(destinataire: string, message: string): void {
    console.log(`[SMTP Email] ➔ ${destinataire} : "${message}"`);
  }
}

export class SmsNotification implements CanalNotification {
  envoyer(destinataire: string, message: string): void {
    console.log(`[Passerelle SMS 4G] ➔ ${destinataire} : "${message}"`);
  }
}

export class DiscordNotification implements CanalNotification {
  envoyer(destinataire: string, message: string): void {
    console.log(`[Webhook Discord] ➔ ${destinataire} : "${message}"`);
  }
}

// Le service consommateur reste stable pour l'éternité
export class AlerteSecurite {
  constructor(private readonly canal: CanalNotification) {}

  signalerIntrusion(ipSuspecte: string): void {
    this.canal.envoyer('admin@system.local', `Alerte intrusion détectée depuis l'adresse IP : ${ipSuspecte}`);
  }
}
```

Demain, l'entreprise décide d'expédier ses alertes critiques sur **Slack**, **WhatsApp** ou par **Notification Push Web** ?  
Il suffit d'écrire une classe `SlackNotification implements CanalNotification`. La classe `AlerteSecurite` continuera de fonctionner sans la moindre retouche.

> **Règle d'or de réflexe professionnel :**  
> Dès que vous écrivez un bloc `switch (type)` portant sur une variable métier dont les valeurs sont amenées à s'enrichir dans le temps, **arrêtez-vous immédiatement** : transformez ce `switch` en interface et en classes spécialisées.

---

## Partie 03 — 'D' : Dependency Inversion Principle (DIP)

### 3.1 Définition et les deux lois fondamentales

Le principe d'inversion des dépendances est sans doute le plus puissant et le plus transformateur de l'acronyme SOLID. Énoncé par Robert C. Martin, il repose sur deux lois indissociables :

```
┌────────────────────────────────────────────────────────────────────────┐
│             LES DEUX RÈGLES FORMELLES DU PRINCIPE DIP                  │
├────────────────────────────────────────────────────────────────────────┤
│ 1️⃣  Les modules de HAUT NIVEAU ne doivent pas dépendre des modules de │
│     BAS NIVEAU. Les deux doivent dépendre d'ABSTRACTIONS.              │
├────────────────────────────────────────────────────────────────────────┤
│ 2️⃣  Les ABSTRACTIONS ne doivent pas dépendre des DÉTAILS.             │
│     Ce sont les DÉTAILS qui doivent dépendre des abstractions.         │
└────────────────────────────────────────────────────────────────────────┘
```

Prenons le temps de décrypter ce vocabulaire d'architecte :

- **Module de haut niveau** : c'est le cœur d'affaires de votre application, la logique métier qui justifie l'existence du logiciel (ex. calculer un panier, valider un virement, gérer l'admission d'un étudiant). C'est la valeur ajoutée de votre entreprise.
- **Module de bas niveau** : c'est la plomberie d'infrastructure technique permettant au logiciel de dialoguer avec le monde matériel (ex. envoyer une requête HTTP, exécuter une commande SQL `SELECT`, stocker dans `localStorage`, lire un fichier sur SSD).
- **Abstraction** : c'est une interface ou une classe abstraite qui déclare **ce que l'on veut faire**, sans jamais divulguer **comment c'est fait**.

---

### 3.2 L'Analogie électrique : La prise murale 230V et la lampe

Pour comprendre l'aberration d'un couplage direct, observez le raccordement de votre lampe de chevet :

```
         COUPLAGE DIRECT SANS DIP                          ARCHITECTURE CONFORME À DIP
         (Détail technique hardcodé)                      (Inversion par abstraction)

       ┌──────────────────────────┐                    ┌──────────────────────────┐
       │   Lampe de chevet        │                    │   Lampe de chevet        │
       │   (Module Haut Niveau)   │                    │   (Module Haut Niveau)   │
       └─────────────┬────────────┘                    └─────────────┬────────────┘
                     │ Câble soudé                                   │ Fiche mâle standard
                     ▼                                               ▼
       ┌──────────────────────────┐                    ════════════════════════════
       │   Centrale Nucléaire     │                    │  PRISE MURALE 230V 50Hz  │ (Abstraction)
       │   (Module Bas Niveau)    │                    ════════════════════════════
       └──────────────────────────┘                                  ▲
                                                                     │ Câblage standard
                                                       ┌─────────────┴────────────┐
                                                       │ Centrale nucléaire /     │ (Détails)
                                                       │ Solaire / Éolienne       │
                                                       └──────────────────────────┘
```

- **Si vous soudez votre lampe directement aux câbles de la centrale**, votre lampe dépend intimement du fournisseur d'énergie. Si la centrale subit des variations de tension ou change de technologie, votre lampe grille ou devient inutilisable. Vous ne pouvez même pas déplacer votre lampe dans une autre pièce !
- **Dans notre monde réel**, on intercale une **prise murale standardisée (230V / 50Hz)**. La prise est l'**abstraction**. La lampe s'alimente dessus via une fiche mâle standard ; le fournisseur alimente la prise selon cette norme. Que l'énergie provienne d'un barrage hydraulique, d'un panneau solaire ou d'un générateur de secours, la lampe s'allume sans aucune modification !

---

### 3.3 Contre-exemple : Le couplage direct par `new`

Voyons comment se traduit la violation de DIP dans du code TypeScript :

```typescript
// ❌ ANTI-PATTERN ARCHITECTURAL : Couplage direct par instanciation interne
export class BaseDeDonneesPostgres {
  executerRequete(sql: string, parametres: any[]): void {
    console.log(`[PostgreSQL DB] Exécution de requête : ${sql}`);
  }
}

export class ServiceCommande {
  // 🛑 ERREUR MAJEURE : Instanciation directe en dur d'un détail technique !
  private bdd: BaseDeDonneesPostgres = new BaseDeDonneesPostgres();

  validerCommande(idClient: string, total: number): void {
    // Logique métier...
    console.log(`Validation de la commande pour le client ${idClient}...`);

    // Appel direct à l'infrastructure PostgreSQL
    this.bdd.executerRequete(
      'INSERT INTO commandes (client_id, montant) VALUES ($1, $2)',
      [idClient, total]
    );
  }
}
```

Ce couplage direct provoque trois désastres architecturaux :

1. **La mort des tests unitaires** : Pour tester la méthode `validerCommande()`, vous êtes **obligé** d'avoir un serveur PostgreSQL démarré, avec les bonnes tables créées, un compte utilisateur configuré et une liaison réseau active. Si le réseau vacille, votre test échoue, sans que votre code métier ne soit en cause !
2. **Le verrou technologique (*Vendor Lock-in*)** : Si la direction technique décide de migrer vers MongoDB, Firebase ou une API REST externe, vous devez réécrire le code interne de `ServiceCommande`.
3. **Le monde à l'envers** : C'est le module de bas niveau (le driver PostgreSQL) qui dicte sa loi et contraint le module de haut niveau (le service de commande).

---

### 3.4 La solution DIP : L'inversion par contrat d'interface

Appliquons le principe d'inversion des dépendances en créant une abstraction intermédiaire :

```typescript
// ✅ CONCEPTION PROFESSIONNELLE CONFORME AU PRINCIPE DIP

// 1. L'Abstraction : le contrat métier dicté par le domaine (Haut niveau)
export interface CommandeRepository {
  enregistrer(idClient: string, total: number): void;
}

// 2. Le module de Haut Niveau ne dépend QUE de l'abstraction
export class ServiceCommande {
  // L'abstraction est INJECTÉE via le constructeur !
  constructor(private readonly repo: CommandeRepository) {}

  validerCommande(idClient: string, total: number): void {
    if (total <= 0) {
      throw new Error('Le montant de la commande doit être supérieur à zéro.');
    }
    // Délégation au contrat abstrait
    this.repo.enregistrer(idClient, total);
  }
}

// 3. Le module de Bas Niveau s'aligne et implémente l'abstraction
export class PostgresCommandeRepository implements CommandeRepository {
  enregistrer(idClient: string, total: number): void {
    console.log(`[SQL Postgres] INSERT INTO commandes VALUES ('${idClient}', ${total})`);
  }
}
```

#### Pourquoi parle-t-on d'« Inversion » de dépendance ?

Observez attentivement le sens des flèches de dépendance :
- **Avant (Sans DIP)** :  
  `ServiceCommande` *(Haut niveau)* ➔ dépendait de ➔ `BaseDeDonneesPostgres` *(Bas niveau)*.  
  Le haut niveau était subordonné au bas niveau.
- **Après (Avec DIP)** :  
  `ServiceCommande` ➔ dépend de ➔ `CommandeRepository` *(Interface)*.  
  `PostgresCommandeRepository` ➔ dépend de ➔ `CommandeRepository` *(Interface)*.  
  La flèche du composant de base de données s'est **inversée** : c'est désormais l'infrastructure technique qui doit obéir et s'adapter au contrat défini pour les besoins du métier !

---

### 3.5 Le super-pouvoir de DIP : Révolution de la testabilité unitaire

Grâce à l'inversion de dépendance, tester unitairement votre logique métier devient un jeu d'enfant. Il n'est plus nécessaire d'installer ou de démarrer une quelconque base de données : nous créons un double en mémoire vive (*Fake Repository*) :

```typescript
// 🧪 DOUBLE DE TEST EN MÉMOIRE (Rapide, déterministe, zéro réseau)
export class FakeCommandeRepository implements CommandeRepository {
  readonly commandesEnregistrees: Array<{ idClient: string; total: number }> = [];

  enregistrer(idClient: string, total: number): void {
    this.commandesEnregistrees.push({ idClient, total });
  }
}

// Dans votre suite de tests automatisés (Jest, Vitest, Jasmine) :
describe('ServiceCommande', () => {
  it('doit enregistrer une commande valide sans toucher à une vraie base', () => {
    // 1. Instanciation du fake en mémoire
    const fakeRepo = new FakeCommandeRepository();

    // 2. Injection du fake dans notre service métier
    const service = new ServiceCommande(fakeRepo);

    // 3. Exécution de l'action métier
    service.validerCommande('CLIENT-42', 150);

    // 4. Assertion instantanée (exécutée en moins de 2 millisecondes !)
    expect(fakeRepo.commandesEnregistrees.length).toBe(1);
    expect(fakeRepo.commandesEnregistrees[0].idClient).toBe('CLIENT-42');
    expect(fakeRepo.commandesEnregistrees[0].total).toBe(150);
  });
});
```

Cette prouesse offre trois avantages décisifs :
1. **Une vitesse fulgurante** : Vos tests s'exécutent en RAM en quelques fractions de seconde, vous permettant d'en lancer des milliers à chaque sauvegarde de fichier.
2. **Une isolation absolue des bogues** : Si ce test échoue, vous avez la certitude mathématique que l'erreur provient de `ServiceCommande`, et jamais d'une coupure réseau ou d'un verrou sur une table SQL.
3. **La simulation de pannes matérielles** : Vous pouvez créer une classe `CrashingCommandeRepository implements CommandeRepository` qui lève délibérément une exception pour éprouver la robustesse de votre service face aux sinistres techniques.

---

### 3.6 DIP au cœur du framework Angular : L'Injection de Dépendances (DI)

Si vous développez avec Angular, vous appliquez le principe DIP en permanence, souvent sans le savoir !

Angular intègre en son cœur un conteneur d'injection de dépendances (*Dependency Injection Container*) qui gère le cycle de vie et la distribution des instances :

```typescript
// 1. Le service métier est étiqueté comme injectable
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private http = inject(HttpClient);

  recupererCatalogue(): Observable<Article[]> {
    return this.http.get<Article[]>('/api/articles');
  }
}

// 2. Le composant graphique délègue et reçoit son instance
@Component({
  selector: 'app-liste-articles',
  standalone: true,
  template: `<!-- affichage -->`
})
export class ListeArticlesComponent {
  // ✅ Injection automatique par le framework : aucun 'new' écrit à la main !
  private readonly articleService = inject(ArticleService);

  readonly articles = signal<Article[]>([]);
}
```

Dans un test unitaire Angular, vous pouvez court-circuiter l'accès au serveur en fournissant une doublure dans le tableau des `providers` du banc d'essai :

```typescript
TestBed.configureTestingModule({
  providers: [
    { provide: ArticleService, useValue: mockArticleService }
  ]
});
```

Le composant recevra le faux service sans s'en apercevoir et sans changer la moindre ligne de son code !

> [!NOTE]
> **Clarification lexicale essentielle** :  
> - **DIP** (*Dependency Inversion Principle*) est le **principe d'architecture abstrait**.  
> - **DI** (*Dependency Injection*) est le **mécanisme technique concret** qui permet de réaliser DIP en fournissant les dépendances à un objet plutôt que de le laisser les créer lui-même.

---

## Partie 04 — Synergie : Comment S, O et D travaillent de concert

### 4.1 L'enchaînement vertueux : S ➔ O ➔ D

Les principes S, O et D ne sont pas des règles cloisonnées. Ils s'articulent dans une séquence logique vertueuse qui guide la construction d'un logiciel de qualité industrielle :

```
     ┌────────────────────────────────────────────────────────────────────────┐
     │ 1. PRINCIPE 'S' (Single Responsibility Principle)                      │
     │    On isole et nettoie : on identifie les classes qui font trop de     │
     │    choses et on extrait les responsabilités dans des briques ciblées.  │
     └───────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
     ┌────────────────────────────────────────────────────────────────────────┐
     │ 2. PRINCIPE 'O' (Open/Closed Principle)                                │
     │    Pour les responsabilités susceptibles d'évoluer (tarifs, canaux de  │
     │    communication, formats), on pose des INTERFACES plutôt que des      │
     │    switch/case. Le système est ouvert à l'extension sans altération.   │
     └───────────────────────────────────┬────────────────────────────────────┘
                                         │
                                         ▼
     ┌────────────────────────────────────────────────────────────────────────┐
     │ 3. PRINCIPE 'D' (Dependency Inversion Principle)                       │
     │    On INJECTE ces interfaces dans les constructeurs au lieu d'instancier│
     │    les dépendances en dur par `new`. Le cœur applicatif ne dépend      │
     │    que de contrats stables.                                            │
     └────────────────────────────────────────────────────────────────────────┘
```

> **La formule magique de l'architecture :**  
> **SRP** taille les pièces de monnaie · **OCP** standardise leur gabarit · **DIP** conçoit la fente du distributeur pour accepter n'importe quelle pièce conforme.

---

### 4.2 Matrice synthétique : Détecter & Corriger

| Principe | Question clé d'auto-évaluation | Signal d'alarme (*Code Smell*) | Solution architecturale |
|:---:|---|---|---|
| **SRP** | *« Cette classe a-t-elle plus d'une seule raison de changer ? »* | Fichier de 500 lignes, nom contenant `Manager` ou `And`, mélange de calculs et de requêtes HTTP/SQL. | Extraire les responsabilités annexes dans des classes dédiées à haute cohésion. |
| **OCP** | *« Puis-je ajouter une nouvelle variante sans modifier le code existant ? »* | Présence de `switch (type)` ou de cascades de `if / else if` prévus pour grandir. | Définir une `interface` contractuelle et appliquer le patron Stratégie par polymorphisme. |
| **DIP** | *« Mon cœur métier dépend-il intimement d'une technologie précise ? »* | Présence de `new DatabaseService()` ou `new HttpClient()` au sein d'une classe métier. | Créer une interface d'abstraction et injecter la dépendance via le constructeur ou `inject()`. |

---

## Partie 05 — Pièges fréquents & anti-patterns des juniors

### 5.1 Piège 1 : L'illusion de la sur-ingénierie (*Over-Engineering*)

Le danger qui guette le développeur venant de découvrir les principes SOLID est de vouloir créer des abstractions pour tout et n'importe quoi.

Si vous écrivez une application pour calculer l'aire d'un carré, et que vous produisez :
- `interface FormeGeometriqueQuadrilateraleReguliere`
- `class AbstractQuadrilatereFactory`
- `class CarreAreaCalculatorStrategyService`

Vous faites de la **sur-ingénierie toxique**.

> [!WARNING]
> Respectez toujours deux grands principes d'équilibre du génie logiciel :  
> - **KISS (*Keep It Simple, Stupid*)** : préférez la solution la plus simple possible qui réponde au besoin présent.  
> - **YAGNI (*You Aren't Gonna Need It*)** : n'anticipez pas d'abstractions complexes pour des hypothèses d'évolutions incertaines. Introduisez OCP et DIP là où la variabilité est avérée ou fortement probable.

---

### 5.2 Piège 2 : L'injection masquée via le *Service Locator*

Un anti-pattern fréquent consiste à injecter un conteneur global dans une classe et à lui demander ses dépendances à la volée :

```typescript
// ❌ ANTI-PATTERN : Le Service Locator dissimulé
export class FacturationService {
  constructor(private locator: ServiceContainer) {}

  facturer(): void {
    // Les dépendances sont cachées au fond de la méthode !
    const db = this.locator.get('Database');
    const mailer = this.locator.get('Mailer');
    // ...
  }
}
```

Pourquoi est-ce une mauvaise pratique ? Parce qu'en observant la signature du constructeur `new FacturationService(locator)`, vous n'avez aucune idée de ce dont la classe a réellement besoin pour fonctionner. Explicitez toujours vos dépendances en clair dans les paramètres du constructeur ou via des appels `inject(Service)` identifiés en début de classe.

---

### 5.3 Les 4 Commandements de l'Architecture Propre (S-O-D)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LES 4 COMMANDEMENTS S - O - D                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. UNE SEULE FICHE DE POSTE TU ATTRIBUERAS (SRP)                       │
│    Sépare composants visuels, services métier et accès aux données.    │
├────────────────────────────────────────────────────────────────────────┤
│ 2. ÉTENDRE SANS DÉTRUIRE TU PRIVILÉGIERAS (OCP)                        │
│    Bannis les cascades de switch/case : crée des interfaces et         │
│    accueille de nouvelles classes sans modifier l'existant.            │
├────────────────────────────────────────────────────────────────────────┤
│ 3. LE MOT-CLÉ 'NEW' DANS TON MÉTIER TU BANNIRAS (DIP)                  │
│    Ne crée jamais tes dépendances techniques en dur : injecte des      │
│    abstractions depuis l'extérieur.                                    │
├────────────────────────────────────────────────────────────────────────┤
│ 4. LE SENS DE LA MESURE TU CONSERVERAS (KISS & YAGNI)                  │
│    SOLID n'est pas un dogme religieux : ne crée pas d'interfaces       │
│    fantômes pour du code trivial qui ne changera jamais.               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Partie 06 — Démonstration Angular : La Boutique Éco-Responsable (*GreenShop*)

Pour matérialiser la mise en œuvre conjointe des principes **S**, **O** et **D**, développons un mini-projet complet et réaliste : le terminal de caisse d'une boutique bio éco-responsable.

### 6.1 Architecture du mini-projet

Le projet s'organise selon un découpage strict des responsabilités :

```
src/app/
├── models/
│   └── article.model.ts              # Entités de données immuables
├── strategies/
│   ├── remise.strategy.ts            # Contrat OCP d'extension des remises
│   ├── remise-standard.ts           # Pas de remise
│   ├── remise-fidelite.ts           # Remise adhérent (-10%)
│   └── remise-zero-dechet.ts        # Remise vrac/zéro déchet (-20%)
├── repositories/
│   ├── commande.repository.ts        # Contrat DIP d'abstraction de persistance
│   └── in-memory-commande.repo.ts   # Implémentation concrète de stockage
├── services/
│   └── caisse.service.ts             # Logique métier pure (SRP)
└── components/
    ├── boutique.component.ts         # Composant UI Standalone Angular Signals
    └── boutique.component.html       # Template HTML moderne avec @for et @if
```

---

### 6.2 Les Contrats OCP & les Stratégies de Remise

Définissons le contrat d'interface pour le calcul des remises, ainsi que trois politiques commerciales distinctes :

```typescript
// src/app/strategies/remise.strategy.ts

export interface StrategieRemise {
  readonly code: string;
  readonly libelle: string;
  calculerRemise(montantBrut: number): number;
}
```

```typescript
// src/app/strategies/remise-standard.ts
import { StrategieRemise } from './remise.strategy';

export class RemiseStandard implements StrategieRemise {
  readonly code = 'AUCUNE';
  readonly libelle = 'Tarif Standard (0%)';

  calculerRemise(montantBrut: number): number {
    return 0;
  }
}
```

```typescript
// src/app/strategies/remise-fidelite.ts
import { StrategieRemise } from './remise.strategy';

export class RemiseFidelite implements StrategieRemise {
  readonly code = 'FIDELITE';
  readonly libelle = 'Adhérent Vert (-10%)';

  calculerRemise(montantBrut: number): number {
    return montantBrut * 0.10;
  }
}
```

```typescript
// src/app/strategies/remise-zero-dechet.ts
import { StrategieRemise } from './remise.strategy';

export class RemiseZeroDechet implements StrategieRemise {
  readonly code = 'ZERO_DECHET';
  readonly libelle = 'Client Vrac & Zéro Déchet (-20%)';

  calculerRemise(montantBrut: number): number {
    return montantBrut * 0.20;
  }
}
```

---

### 6.3 Le Contrat DIP & l'Implémentation de Persistance

Créons l'abstraction de sauvegarde des commandes ainsi que son implémentation en mémoire :

```typescript
// src/app/repositories/commande.repository.ts
import { InjectionToken } from '@angular/core';

export interface TicketCommande {
  readonly id: string;
  readonly date: Date;
  readonly articlesCount: number;
  readonly sousTotal: number;
  readonly remise: number;
  readonly totalTtc: number;
}

export interface CommandeRepository {
  sauvegarder(ticket: TicketCommande): Promise<void>;
  recupererHistorique(): Promise<TicketCommande[]>;
}

// Jeton d'injection Angular pour l'abstraction (DIP)
export const COMMANDE_REPOSITORY = new InjectionToken<CommandeRepository>('COMMANDE_REPOSITORY');
```

```typescript
// src/app/repositories/in-memory-commande.repo.ts
import { Injectable } from '@angular/core';
import { CommandeRepository, TicketCommande } from './commande.repository';

@Injectable({ providedIn: 'root' })
export class InMemoryCommandeRepository implements CommandeRepository {
  private historique: TicketCommande[] = [];

  async sauvegarder(ticket: TicketCommande): Promise<void> {
    // Simulation d'une écriture asynchrone sans latence réseau
    this.historique = [ticket, ...this.historique];
  }

  async recupererHistorique(): Promise<TicketCommande[]> {
    return [...this.historique];
  }
}
```

---

### 6.4 Le Service Métier pur (SRP) : `CaisseService`

Ce service n'a qu'une seule et unique responsabilité : **l'arithmétique de la vente et l'orchestration de la validation**. Il dépend d'une abstraction pour la persistance (DIP) et d'un contrat pour les réductions (OCP) :

```typescript
// src/app/services/caisse.service.ts
import { Injectable, inject } from '@angular/core';
import { COMMANDE_REPOSITORY } from '../repositories/commande.repository';
import { StrategieRemise } from '../strategies/remise.strategy';
import { TicketCommande } from '../repositories/commande.repository';

export interface LigneAchat {
  readonly idArticle: string;
  readonly nom: string;
  readonly prixUnitaire: number;
  readonly quantite: number;
}

@Injectable({ providedIn: 'root' })
export class CaisseService {
  // ✅ DIP : Injection du contrat abstrait, pas d'une classe concrète !
  private readonly repo = inject(COMMANDE_REPOSITORY);

  calculerSousTotal(lignes: readonly LigneAchat[]): number {
    return lignes.reduce((total, l) => total + l.prixUnitaire * l.quantite, 0);
  }

  // ✅ OCP : La méthode reçoit une stratégie polymorphique
  calculerTotalNet(lignes: readonly LigneAchat[], strategie: StrategieRemise): { sousTotal: number; remise: number; total: number } {
    const sousTotal = this.calculerSousTotal(lignes);
    const remise = strategie.calculerRemise(sousTotal);
    const total = Math.max(0, sousTotal - remise);
    return { sousTotal, remise, total };
  }

  async finaliserVente(lignes: readonly LigneAchat[], strategie: StrategieRemise): Promise<TicketCommande> {
    if (lignes.length === 0) {
      throw new Error('Impossible de valider un panier vide.');
    }

    const { sousTotal, remise, total } = this.calculerTotalNet(lignes, strategie);

    const ticket: TicketCommande = {
      id: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date(),
      articlesCount: lignes.reduce((acc, l) => acc + l.quantite, 0),
      sousTotal,
      remise,
      totalTtc: total
    };

    await this.repo.sauvegarder(ticket);
    return ticket;
  }

  async obtenirHistorique(): Promise<TicketCommande[]> {
    return this.repo.recupererHistorique();
  }
}
```

---

### 6.5 Le Composant Angular Standalone : `BoutiqueComponent`

Le composant graphique applique strictement le SRP : il ne calcule rien, ne stocke rien, et s'occupe exclusivement de réagir aux clics de l'utilisateur et d'animer les signaux réactifs :

```typescript
// src/app/components/boutique.component.ts
import { Component, signal, computed, inject } from '@angular/core';
import { CaisseService, LigneAchat } from '../services/caisse.service';
import { COMMANDE_REPOSITORY } from '../repositories/commande.repository';
import { InMemoryCommandeRepository } from '../repositories/in-memory-commande.repo';
import { StrategieRemise } from '../strategies/remise.strategy';
import { RemiseStandard } from '../strategies/remise-standard';
import { RemiseFidelite } from '../strategies/remise-fidelite';
import { RemiseZeroDechet } from '../strategies/remise-zero-dechet';
import { TicketCommande } from '../repositories/commande.repository';

@Component({
  selector: 'app-boutique',
  standalone: true,
  providers: [
    // Configuration DIP : on associe le jeton d'interface à l'implémentation
    { provide: COMMANDE_REPOSITORY, useClass: InMemoryCommandeRepository }
  ],
  templateUrl: './boutique.component.html'
})
export class BoutiqueComponent {
  private readonly caisse = inject(CaisseService);

  // Catalogue des stratégies de remise disponibles (OCP)
  readonly strategiesDisponibles: StrategieRemise[] = [
    new RemiseStandard(),
    new RemiseFidelite(),
    new RemiseZeroDechet()
  ];

  // Signaux d'état de l'application
  readonly panier = signal<LigneAchat[]>([
    { idArticle: 'ART-1', nom: 'Pommes Bio (1kg)', prixUnitaire: 3.50, quantite: 2 },
    { idArticle: 'ART-2', nom: 'Flocons d\'Avoine Vrac (500g)', prixUnitaire: 2.20, quantite: 1 }
  ]);

  readonly strategieChoisie = signal<StrategieRemise>(this.strategiesDisponibles[0]);
  readonly dernierTicket = signal<TicketCommande | null>(null);
  readonly historique = signal<TicketCommande[]>([]);

  // Signal calculé réactif (SRP : calcul délégué au service métier)
  readonly calculs = computed(() => {
    return this.caisse.calculerTotalNet(this.panier(), this.strategieChoisie());
  });

  ajouterArticle(nom: string, prix: number): void {
    this.panier.update(items => [
      ...items,
      { idArticle: `ART-${Date.now()}`, nom, prixUnitaire: prix, quantite: 1 }
    ]);
  }

  changerStrategie(strategie: StrategieRemise): void {
    this.strategieChoisie.set(strategie);
  }

  async encaisser(): Promise<void> {
    try {
      const ticket = await this.caisse.finaliserVente(this.panier(), this.strategieChoisie());
      this.dernierTicket.set(ticket);
      this.panier.set([]); // Vider le panier
      const hist = await this.caisse.obtenirHistorique();
      this.historique.set(hist);
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  }
}
```

---

### 6.6 Le Template HTML de la Caisse (`boutique.component.html`)

Le template exploite la syntaxe de contrôle de flux moderne (`@for`, `@if`) d'Angular :

```html
<!-- src/app/components/boutique.component.html -->
<main class="max-w-2xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
  
  <header class="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
    <h1 class="text-xl font-black text-emerald-400 flex items-center gap-2">
      🌿 GreenShop POS — Caisse Écologique
    </h1>
    <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
      SOLID Terminal
    </span>
  </header>

  <!-- Section Sélection d'articles rapides -->
  <section class="mb-6">
    <span class="text-xs uppercase font-bold text-slate-400">Ajout rapide au panier :</span>
    <div class="flex gap-2 mt-2">
      <button (click)="ajouterArticle('Lentilles Vertes Vrac', 4.10)"
        class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700">
        + Lentilles (4.10 €)
      </button>
      <button (click)="ajouterArticle('Savon Artisanal', 5.50)"
        class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700">
        + Savon (5.50 €)
      </button>
    </div>
  </section>

  <!-- Table du Panier en cours -->
  <section class="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 mb-6">
    <h2 class="text-xs font-bold uppercase text-slate-400 mb-3">Panier en cours</h2>
    <div class="space-y-2">
      @for (item of panier(); track item.idArticle) {
        <div class="flex justify-between items-center text-xs py-1 border-b border-slate-700/40">
          <span>{{ item.nom }} (x{{ item.quantite }})</span>
          <span class="font-mono font-bold">{{ (item.prixUnitaire * item.quantite).toFixed(2) }} €</span>
        </div>
      } @empty {
        <p class="text-xs text-slate-500 italic py-2">Le panier est vide.</p>
      }
    </div>
  </section>

  <!-- Sélecteur de Stratégie OCP -->
  <section class="mb-6">
    <span class="text-xs uppercase font-bold text-slate-400">Politique de remise (OCP) :</span>
    <div class="grid grid-cols-3 gap-2 mt-2">
      @for (strat of strategiesDisponibles; track strat.code) {
        <button (click)="changerStrategie(strat)"
          [class.ring-2]="strategieChoisie().code === strat.code"
          [class.ring-emerald-400]="strategieChoisie().code === strat.code"
          class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold border border-slate-700 transition text-center">
          {{ strat.libelle }}
        </button>
      }
    </div>
  </section>

  <!-- Synthèse financière dynamique -->
  <section class="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 mb-6">
    <div class="flex justify-between text-xs text-slate-300 mb-1">
      <span>Sous-total brut :</span>
      <span class="font-mono">{{ calculs().sousTotal.toFixed(2) }} €</span>
    </div>
    <div class="flex justify-between text-xs text-emerald-400 mb-2">
      <span>Remise appliquée :</span>
      <span class="font-mono">- {{ calculs().remise.toFixed(2) }} €</span>
    </div>
    <div class="flex justify-between text-lg font-black text-white pt-2 border-t border-emerald-500/20">
      <span>NET À PAYER :</span>
      <span class="text-emerald-300 font-mono">{{ calculs().total.toFixed(2) }} €</span>
    </div>
  </section>

  <!-- Bouton d'encaissement -->
  <button (click)="encaisser()" [disabled]="panier().length === 0"
    class="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 disabled:opacity-40 font-extrabold text-slate-950 transition shadow-lg shadow-emerald-500/20 mb-6">
    💳 Encaisser & Sauvegarder la commande
  </button>

  <!-- Ticket imprimé récent -->
  @if (dernierTicket(); as t) {
    <div class="p-4 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-mono space-y-1">
      <div class="text-emerald-400 font-bold mb-1">✅ Vente validée avec succès !</div>
      <div>Numéro : {{ t.id }}</div>
      <div>Date : {{ t.date.toLocaleTimeString() }}</div>
      <div>Articles vendus : {{ t.articlesCount }}</div>
      <div>Montant final réglé : {{ t.totalTtc.toFixed(2) }} €</div>
    </div>
  }

</main>
```

---

### 6.7 Démonstration de l'architecture en action

Observons le rendu textuel direct de l'écran du terminal lors d'une transaction :

```
┌────────────────────────────────────────────────────────┐
│ 🌿 GreenShop POS — Caisse Écologique  [ SOLID Terminal ]│
├────────────────────────────────────────────────────────┤
│ AJOUT RAPIDE :                                         │
│ [ + Lentilles (4.10 €) ]     [ + Savon (5.50 €) ]      │
├────────────────────────────────────────────────────────┤
│ PANIER EN COURS :                                      │
│ • Pommes Bio (1kg) (x2)                       7.00 €   │
│ • Flocons d'Avoine Vrac (500g) (x1)           2.20 €   │
├────────────────────────────────────────────────────────┤
│ POLITIQUE DE REMISE (OCP) :                            │
│ [ Tarif Standard ]  [ Adhérent (-10%) ]  [ Vrac (-20%) ]*
├────────────────────────────────────────────────────────┤
│ Sous-total brut :                             9.20 €   │
│ Remise appliquée (-20%) :                   - 1.84 €   │
│ NET À PAYER :                                 7.36 €   │
├────────────────────────────────────────────────────────┤
│ [ 💳 ENCAISSER & SAUVEGARDER LA COMMANDE ]             │
├────────────────────────────────────────────────────────┤
│ ✅ TICKET ENREGISTRÉ : CMD-4892                        │
│ Heure : 14:32:05 | Total : 7.36 € | Mode : In-Memory   │
└────────────────────────────────────────────────────────┘
```

#### Ce qui fait la supériorité de cette conception :
1. **Conformité SRP** : Si le design Tailwind change, nous touchons au template HTML ; si la fiscalité ou la logique d'arrondi change, nous modifions `CaisseService` ; si le mode de persistance passe à Supabase ou Firebase, nous modifions le dépôt.
2. **Conformité OCP** : Pour créer une nouvelle offre *« Promo Anniversaire (-35%) »*, nous ajoutons une classe `RemiseAnniversaire implements StrategieRemise`. Zéro ligne existante n'est modifiée !
3. **Conformité DIP** : `CaisseService` ignore souverainement si les données finissent dans une base Postgres, une mémoire vive ou un fichier texte. Tester le calcul financier prend 1 milliseconde.

---

## Synthèse : ce qu'il faut retenir absolument

### Tableau récapitulatif des mécanismes

| Mécanisme / Principe | Question directrice | Bénéfice architectural majeur | Réalisation concrète en TS / Angular |
|---|---|---|---|
| **S** *(Single Responsibility)* | *« Cette classe n'a-t-elle qu'une seule raison de changer ? »* | Isolation parfaite des changements, éradication des conflits de fusion d'équipe (*Git merge*). | Séparation nette entre Composants UI (`@Component`) et Services Métier (`@Injectable`). |
| **O** *(Open / Closed)* | *« Puis-je enrichir le comportement sans altérer les lignes existantes ? »* | Protection absolue contre les régressions logicielles, déploiements sereins. | Patron Stratégie, contrats d'`interface`, délégation polymorphique à la place de `switch(type)`. |
| **D** *(Dependency Inversion)* | *« Mon métier dépend-il de contrats plutôt que de détails ? »* | Découplage maximal, testabilité unitaire foudroyante par doubles de tests (*Mocks/Fakes*). | Injection via le constructeur ou `inject()`, `InjectionToken`, `providers` dans `TestBed`. |

---

### La Règle d'Or de la Séance 11

> **« Ne construisez jamais votre logiciel comme un château de cartes solidaire où chaque élément supporte tout l'édifice.**  
> **Donnez à chaque classe une mission exclusive (SRP), verrouillez vos algorithmes éprouvés tout en les rendant extensibles par polymorphisme (OCP), et amarrez systématiquement votre logique métier à des abstractions stables plutôt qu'à des détails technologiques éphémères (DIP). »**

---

## Aperçu de la séance suivante

La **séance 12** conclura notre second bloc pédagogique en descendant au cœur intime de l'objet : **Les Objets eux-mêmes : Identité, Comparaison & Clonage**.

Nous explorerons :
1. **L'Identité vs La Valeur** : pourquoi l'opérateur d'égalité stricte `===` échoue à comparer le contenu de deux objets distincts en mémoire, et comment implémenter une méthode sémantique `equals()`.
2. **La Copie Superficielle vs La Copie Profonde** : comprendre les ravages des références partagées lors de l'utilisation du *spread operator* (`...`) ou d'`Object.assign()`, et maîtriser le clonage profond moderne via l'API native `structuredClone()`.
3. **L'Immutabilité & la Réactivité fine** : comment l'intégrité et la non-mutation des objets garantissent la précision chirurgicale de la détection de changements d'Angular et des signaux réactifs (`signal`, `computed`).
