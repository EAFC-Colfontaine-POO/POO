# Séance 16 — Formats de Données & Sérialisation : JSON, XML et Typage en POO

**Cours de programmation orientée objet — Bachelier en informatique (EAFC)**  
**Stack technique : TypeScript 5+, Angular 22 (approche signal-first)**

---

## Objectifs pédagogiques

À l'issue de cette séance, l'étudiant est en mesure de :

1. **Comprendre la frontière de la mémoire vive et la nécessité de la persistance** : expliquer pourquoi les instances d'objets stockées dans le tas (*Heap*) de la RAM sont volatiles et inaccessibles à l'extérieur du processus, et formaliser le rôle pivot de la **sérialisation** (*marshalling*) et de la **désérialisation** (*unmarshalling*).
2. **Comparer et reconnaître les grands formats de données structurées (JSON vs XML)** : identifier la structure, les balises, les attributs et le prologue d'un document XML, exploiter `DOMParser` pour en lire le contenu en JavaScript/TypeScript, et comprendre pourquoi JSON s'est imposé comme le standard *de facto* des architectures Web modernes.
3. **Maîtriser les APIs natives de sérialisation en TypeScript** : exploiter toutes les capacités de `JSON.stringify()` (paramètre d'indentation `space`, fonction de filtrage `replacer`, méthode magique `toJSON()` sur une classe) et de `JSON.parse()` (fonction de transformation `reviver`).
4. **Surmonter le gouffre de la réhydratation en Orienté Objet** : comprendre pourquoi `JSON.parse()` produit des objets littéraux simples sans prototype, identifier l'échec immédiat de l'opérateur `instanceof` et la perte irrémédiable des méthodes, et proscrire les contournements dangereux tels que `Object.setPrototypeOf()`.
5. **Appliquer le patron architectural DTO (*Data Transfer Object*) vs Entité Métier** : découpler le contrat de transfert passif (`interface ArticleDTO`) de l'entité vivante encapsulée (`class Article`), et concevoir des fabriques de réhydratation rigoureuses (`fromDTO()` / `toJSON()`) garantissant la protection des invariants métier (Séance 05).
6. **Sécuriser le typage à la désérialisation** : neutraliser le type `any` renvoyé par `JSON.parse()`, contraindre le flux entrant au type `unknown`, et valider l'intégrité structurelle des données via des gardes de type personnalisés (*Type Guards*) avant toute instanciation.
7. **Bâtir un atelier de sérialisation locale réactif sous Angular 22** : développer une suite complète de conversion bidirectionnelle et d'inspection mémoire (sans appel réseau à ce stade), orchestrée par des services injectables et des signaux réactifs (`signal`, `computed`), avec validation des types et exécution de méthodes métier en temps réel.

---

## Partie 00 — Le cheminement : d'où venons-nous ?

Cette seizième séance marque l'ouverture officielle du **Bloc D**, consacré à la **Persistance des Données** :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROGRESSION PÉDAGOGIQUE DU CURSUS POO                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🧱 BLOC 0 — Mise en Route & Outillage (Séances 01 à 04)                     │
│    • S01 — Introduction POO & Git                                           │
│    • S02 — Fondations du Langage TypeScript                                 │
│    • S03 — Architecture d'une SPA & Découverte d'Angular                    │
│    • S04 — Rappel HTML/CSS & Système de Conception Bootstrap                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🏛️ BLOC A — Les Fondamentaux du Paradigme Objet (Séances 05 à 09)          │
│    • S05 — Encapsulation & Invariants (private, getters/setters, static)    │
│    • S06 — Héritage & Spécialisation (extends, super, override)             │
│    • S07 — Polymorphisme Dynamique (liaison tardive, instanceof, unions)    │
│    • S08 — Abstraction & Contrats Purs (abstract, interfaces, implements)   │
│    • S09 — Composition vs Héritage (relations a-un, délégation de rôles)    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🛡️ BLOC B — Conception, Qualité & Maîtrise des Objets (Séances 10 à 12)     │
│    • S10 — Exceptions Métier & Robustesse (throw, try/catch/finally, cause) │
│    • S11 — Principes SOLID (S : Responsabilité, O : Ouvert/Fermé, D : DIP)  │
│    • S12 — Les Objets eux-mêmes : Identité, Clonage & Immutabilité          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ⚡ BLOC C — Angular en Signal-First, Approfondissement (Séances 13 à 15)     │
│    • S13 — Composants & Signals (Primitives réactives, DAG, input/output)   │
│    • S14 — Services Métier, Génériques avancés & Injection (inject())       │
│    • S15 — Signal Forms, Validation Déclarative & Routing d'Entreprise      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 💾 BLOC D — Persistance des Données (Séances 16 à 19)                       │
│    • S16 — Aujourd'hui : Formats de Données, Sérialisation & Typage POO     │
│    • S17 — Consommation d'APIs REST avec httpResource() & Asynchronisme     │
│    • S18 — Stockage Local (LocalStorage vs Cookies) & Intro Dexie.js        │
│    • S19 — Dexie.js Approfondi : Transactions, Index & Persistance CRUD     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📱 BLOCS SUIVANTS : E (Capacitor Mobile), F (Tests Unitaires), G (Projet)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

Faisons un arrêt sur image pour mesurer la rupture fondamentale introduite par cette séance.

Tout au long des **Blocs A, B et C**, nous avons conçu des modèles orientés objet de plus en plus sophistiqués :
- Des classes dotées d'attributs privés protégeant leurs invariants (Séance 05).
- Des hiérarchies polymorphes réutilisables (Séances 06, 07 et 08).
- Des services injectables hébergeant des signaux réactifs (`signal<T>`) qui animent nos interfaces graphiques (Séances 13, 14 et 15).

Cependant, toutes ces créations partagent un point commun silencieux mais rédhibitoire : **elles n'existent qu'en mémoire vive (RAM)**.
- Dès que l'utilisateur appuie sur la touche **F5** ou ferme son navigateur, la mémoire allouée par le moteur JavaScript est balayée par le ramasse-miettes (*Garbage Collector*) : **la totalité des objets disparaît**.
- Si notre application souhaite échanger des données avec un autre programme (un serveur Node.js, une base de données ou un fichier sur disque), elle ne peut pas lui transmettre une référence mémoire (`0x7ffee3b...`) : l'autre machine ou l'autre processus ne partage pas le même espace d'adressage.

La question centrale de ce Bloc D, qui s'ouvre avec cette Séance 16, est donc la suivante :

> **« Comment faire franchir la frontière de la mémoire vive à un graphe d'objets métier sans perdre son sens, sa structure, ses données et ses invariants de classe ? »**

Pour répondre à cette question, nous devons apprendre à convertir nos objets en un format universellement transmissible et stockable : c'est l'art de la **sérialisation**.

---

## Partie 01 — La Problématique de la Persistance : Sortir du Monde de la RAM

### 1.1 Le Monde de la RAM vs Le Monde de la Persistance

Comprendre la sérialisation exige de distinguer clairement deux univers d'exécution aux propriétés physiques radicalement différentes :

```
┌───────────────────────────────────────┐         ┌───────────────────────────────────────┐
│         LE MONDE DE LA RAM            │         │       LE MONDE DE LA PERSISTANCE      │
│     (Mémoire Vive / Runtime JS)       │         │       (Disque, Réseau, Fichiers)      │
├───────────────────────────────────────┤         ├───────────────────────────────────────┤
│ • Volatile (disparaît à l'arrêt/F5)   │         │ • Durable (conservé dans le temps)    │
│ • Graphe de pointeurs et références   │ ──────> │ • Séquence linéaire d'octets / texte │
│ • Instances vivantes avec méthodes    │ Sérial. │ • Données passives et muettes         │
│ • Tables de prototypes (V8 / JVM)     │ <────── │ • Aucun pointeur mémoire              │
│ • Typage fort au runtime de l'OS      │ Désér.  │ • Universel, interopérable multi-OS   │
└───────────────────────────────────────┘         └───────────────────────────────────────┘
```

En mémoire vive, une instance de classe TypeScript/JavaScript est une structure de données complexe :
1. Une table de propriétés primitives et d'adresses pointant vers d'autres objets du tas (*Heap*).
2. Un lien invisible vers un **prototype** (`Object.getPrototypeOf(instance)`), qui contient les fonctions exécutables (les méthodes de la classe).
3. Des contextes de fermeture lexicale (*closures*) et d'éventuels symboles privés (`#champ`).

Aucun support de stockage persistant (disque dur, SSD, clé USB) ni aucun canal réseau (câble Ethernet, ondes Wi-Fi) ne sait transporter un « pointeur mémoire » ou une « méthode exécutable ». Ces supports ne connaissent qu'une seule réalité : **un flux continu et linéaire d'octets (ou de caractères)**.

---

### 1.2 Définition : Sérialisation et Désérialisation

Ces deux opérations constituent les ponts indispensables entre le monde vivant de la mémoire et le monde inerte du stockage :

- **La Sérialisation (*Serialization* ou *Marshalling*)** :  
  C'est le processus de traduction d'un graphe d'objets résidant en mémoire vive en un format séquentiel (texte ou binaire) capable d'être stocké dans un fichier, consigné dans une base de données ou transmis à travers une socket réseau.
- **La Désérialisation (*Deserialization* ou *Unmarshalling*)** :  
  C'est l'opération symétrique inverse : elle lit une séquence textuelle ou binaire pour reconstruire fidèlement une structure de données équivalente dans la mémoire vive du programme récepteur.

---

### 1.3 Les Deux Grandes Analogies pour Tout Comprendre

Pour fixer intuitivement ces concepts dans votre esprit, retenez ces deux métaphores pédagogiques :

#### 1. L'Analogie du meuble en kit IKEA (Le transport à plat)
Considérez une grande armoire en bois massif assemblée dans votre chambre : elle occupe un volume tridimensionnel, dispose de portes qui pivotent sur des charnières métalliques et de tiroirs qui glissent sur des rails (ses **méthodes**).  
Si vous devez déménager cette armoire à l'autre bout du pays dans le coffre d'une berline, il est impossible de la transporter montée :
1. **La Sérialisation** : Vous démontez l'armoire, retirez les charnières et placez soigneusement chaque planche de bois à plat dans un carton d'expédition rectangulaire 2D, avec les vis et les tourillons dans un sachet étiqueté.
2. **Le Transport** : Le carton est compact, standardisé, empilable et universellement transportable.
3. **La Désérialisation** : À l'arrivée, ouvrir le carton ne suffit pas ! Un tas de planches posé sur la moquette ne permet pas de ranger des vêtements. Il faut obligatoirement ressortir la **notice d'assemblage** (votre classe POO), emboîter les pièces dans le bon ordre, remonter les charnières et vérifier que les portes s'ouvrent à nouveau correctement.

#### 2. L'Analogie de la lyophilisation alimentaire
Pensez à un plat préparé destiné aux astronautes de la station spatiale :
- En cuisine, le plat est riche en eau, en saveurs et en texture (l'objet vivant en RAM).
- Pour le stocker des mois durant sans frigo, on en extrait toute l'eau sous vide : il devient une poudre sèche et inerte (la chaîne de caractères sérialisée).
- Avant de le consommer, l'astronaute doit obligatoirement **réhydrater** la poudre avec une quantité précise d'eau chaude : ce n'est qu'à cette condition que la préparation retrouve sa consistance et sa valeur nutritive d'origine.  
En POO, faire un simple `JSON.parse()` équivaut à avaler la poudre sèche : il manque la réhydratation du prototype pour redonner vie aux méthodes !

---

### 1.4 Que perd-on lors du passage au format texte ?

La sérialisation n'est pas une simple copie miroir : elle impose un **sacrifice d'information technique** considérable.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LE BILAN DE LA SÉRIALISATION TEXTUELLE               │
├──────────────────────────────────┬─────────────────────────────────────┤
│ CE QUI SURVIT (Transmis intact)  │ CE QUI MEURT (Détruit au passage)   │
├──────────────────────────────────┼─────────────────────────────────────┤
│ ✅ Les valeurs scalaires         │ ❌ Les méthodes et fonctions        │
│    (nombres, booléens, textes)   │ ❌ Le prototype de classe           │
│ ✅ La hiérarchie arborescente    │ ❌ Les champs privés (# ou private) │
│    (objets imbriqués, listes)    │ ❌ Les types avancés (Date, Map...) │
│ ✅ La valeur `null`              │ ❌ Les références circulaires       │
│ ✅ Les clés d'attributs          │ ❌ Les accesseurs (getters/setters) │
└──────────────────────────────────┴─────────────────────────────────────┘
```

Ce constat est fondamental : **le format de persistance ne conserve que la substance passive des données ; toute la dynamique comportementale de la POO s'éteint**. C'est à la désérialisation qu'incombera la responsabilité cruciale de ressusciter cette dynamique.

---

## Partie 02 — Duel des Formats : JSON vs XML

Pour stocker ou échanger ces données déshydratées, le monde du logiciel a inventé plusieurs formats de représentation textuelle. Deux d'entre eux dominent l'histoire de l'informatique : **XML** et **JSON**.

### 2.1 Histoire & Contexte : Du règne de XML à l'hégémonie de JSON

#### Le Règne de XML (années 1990 - 2010)
Issu du standard SGML (*Standard Generalized Markup Language*) et normalisé par le W3C en 1998, le **XML** (*eXtensible Markup Language*) a été conçu pour unifier l'échange de documents électroniques entre systèmes hétérogènes (mainframes IBM, serveurs Unix, postes Windows).  
Il a régné en maître absolu sur les architectures orientées services (SOA), les protocoles d'entreprise (SOAP, WSDL), les formats bureautiques (DOCX, ODT) et les fichiers de configuration logicielle (Maven `pom.xml`, Android `AndroidManifest.xml`).

#### La Révolution JSON (2001 à aujourd'hui)
Au début des années 2000, l'ingénieur **Douglas Crockford** popularise le **JSON** (*JavaScript Object Notation*), officialisé par la suite dans la norme RFC 8259. Constatant que XML était lourd, complexe à parser et inadapté aux navigateurs web naissants qui exécutaient JavaScript, Crockford formalise un sous-ensemble direct de la syntaxe littérale d'objets JavaScript.  
En quelques années, porté par l'explosion du Web 2.0, des APIs REST et des Single Page Applications (SPA), JSON a balayé XML pour devenir le standard incontesté du Web moderne.

---

### 2.2 Anatomie du XML : Savoir le Reconnaître et le Lire

En tant que développeur moderne, vous n'aurez que très rarement à *produire* du XML à partir de zéro dans une application front-end. En revanche, **vous devez impérativement savoir le reconnaître, comprendre sa grammaire et être capable d'en extraire des informations** lorsqu'un système d'entreprise patrimonial (*legacy*) ou un service public vous en renvoie.

#### Les 5 règles d'or de la syntaxe XML :
1. **Le Prologue XML (optionnel mais fréquent)** : Indique la version et l'encodage du document.  
   `<?xml version="1.0" encoding="UTF-8"?>`
2. **Une racine unique obligatoire** : L'intégralité du document doit être englobée dans une seule balise racine.
3. **Fermeture stricte et casse sensible** : Chaque balise ouverte `<article>` doit être fermée par `</article>`. `<Article>` et `<article>` sont deux éléments distincts. Les balises vides peuvent s'auto-fermer : `<disponible />`.
4. **Balises imbriquées sans chevauchement** : `<b><i>texte</b></i>` est formellement interdit ; la hiérarchie doit être strictement arborescente : `<b><i>texte</i></b>`.
5. **Attributs toujours entre guillemets** : `<livre pages="350">` et jamais `<livre pages=350>`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Fichier catalogue_export.xml (Données patrimoniales d'entrepôt) -->
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
  <article id="ART-102" statut="reapprovisionnement">
    <designation>Écran UltraWide 34 pouces</designation>
    <prixHT devise="EUR">489.00</prixHT>
    <tauxTVA>21</tauxTVA>
    <categories>
      <categorie>Affichage</categorie>
    </categories>
  </article>
</catalogue>
```

#### Notions XML avancées à savoir identifier :
- **Entités d'échappement** : Les caractères spéciaux de la grammaire XML doivent être échappés :
  - `<` devient `&lt;` (*less than*)
  - `>` devient `&gt;` (*greater than*)
  - `&` devient `&amp;` (*ampersand*)
  - `"` devient `&quot;` (*quote*)
  - `'` devient `&apos;` (*apostrophe*)
- **Sections CDATA** : Permettent d'embarquer du texte brut contenant des caractères interdits sans échappement :  
  `<![CDATA[ <p>Ce texte contient des balises HTML brutes & sans risque !</p> ]]>`
- **Espaces de noms (*Namespaces*)** : Préfixent les balises pour éviter les collisions de noms dans les documents composites :  
  `<gest:client xmlns:gest="https://eafc.be/gestion">`

#### Comment lire et parser du XML dans un navigateur avec `DOMParser` ?
Les navigateurs web fournissent une API native très puissante pour convertir une chaîne XML en un arbre DOM navigable :

```typescript
// Exemple de lecture d'une chaîne XML en TypeScript
const xmlSource = `
  <catalogue>
    <article id="ART-101">
      <designation>Souris Optique</designation>
      <prixHT>24.50</prixHT>
    </article>
  </catalogue>
`;

// 1. Instanciation du parser natif du navigateur
const parser = new DOMParser();
const documentXml = parser.parseFromString(xmlSource, 'application/xml');

// 2. Vérification d'erreur de parsing syntaxique
const parseError = documentXml.querySelector('parsererror');
if (parseError) {
  throw new Error(`Erreur de syntaxe XML : ${parseError.textContent}`);
}

// 3. Extraction des données via les sélecteurs DOM standards
const noeudsArticles = documentXml.querySelectorAll('article');
noeudsArticles.forEach(noeud => {
  const id = noeud.getAttribute('id'); // 'ART-101'
  const designation = noeud.querySelector('designation')?.textContent ?? 'Sans nom';
  const prix = parseFloat(noeud.querySelector('prixHT')?.textContent ?? '0');
  
  console.log(`Article lu : [${id}] ${designation} -> ${prix} €`);
});
```

---

### 2.3 Anatomie du JSON : Le Format Universel du Web

JSON a été taillé pour l'efficacité et la légèreté. Sa grammaire est d'une simplicité mathématique désarmante : elle tient sur une seule page de spécification.

Voici l'équivalent exact du catalogue précédent sous forme de document JSON :

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

#### Les Types Primitifs Autorisés par la Spécification JSON :
JSON ne tolère rigoureusement que **6 types de données** :
1. **Chaîne de caractères (`string`)** : Délimitée **exclusivement par des guillemets doubles `"`**. Les apostrophes `'` et les backticks `` ` `` sont formellement interdits !
2. **Nombre (`number`)** : Entiers ou flottants (`42`, `-12.5`, `1.5e3`). Pas de distinction entre `int` et `float`. `NaN` et `Infinity` sont strictement interdits !
3. **Booléen (`boolean`)** : `true` ou `false` en minuscules.
4. **Valeur nulle (`null`)** : Représente l'absence délibérée de valeur.
5. **Tableau (`array`)** : Liste ordonnée de valeurs délimitée par des crochets `[...]`.
6. **Objet (`object`)** : Collection non ordonnée de paires clé/valeur délimitée par des accolades `{...}`. **Chaque nom de clé doit impérativement être entouré de guillemets doubles `"`**.

#### 🛑 CE QUE JSON NE SUPPORTE PAS (Les Pièges Capitaux) :
- ❌ **Pas de valeur `undefined`** : Si un objet JS possède un champ valant `undefined`, `JSON.stringify` le supprime purement et simplement de la sortie. Dans un tableau, il est converti en `null`.
- ❌ **Pas de dates natives** : L'objet JavaScript `Date` n'a pas d'équivalent natif en JSON. Il est converti en simple chaîne de caractères au format ISO-8601 (`"2026-10-06T16:32:00.000Z"`).
- ❌ **Pas de fonctions ni de méthodes** : Une fonction passée à `JSON.stringify` est ignorée ou transformée en `null`.
- ❌ **Pas de type `BigInt`** : Tenter de sérialiser un entier `100n` lève immédiatement une exception `TypeError: Do not know how to serialize a BigInt`.
- ❌ **Pas de collections avancées (`Map`, `Set`, `RegExp`)** : Un `Set` devient un objet vide `{}` ; une `RegExp` devient un objet vide `{}`.
- ❌ **Pas de commentaires** : Aucune syntaxe `//` ou `/* */` n'est autorisée dans un document JSON standard.
- ❌ **Pas de virgule finale traînante (*trailing comma*)** : `{"a": 1, "b": 2,}` est une erreur de syntaxe fatale.

---

### 2.4 Tableau Comparatif Exhaustif : JSON vs XML

| Critère d'évaluation | JSON (JavaScript Object Notation) | XML (eXtensible Markup Language) |
| :--- | :--- | :--- |
| **Philosophie** | Échange de données brutes légères | Balisage sémantique de documents riches |
| **Syntaxe & Poids** | Très concis, compact, lisibilité immédiate | Verbeux (balises d'ouverture et de fermeture répétées) |
| **Typage natif** | Typé : distingue `string`, `number`, `boolean`, `null` | Tout est texte brut (les nombres doivent être parsés à la main) |
| **Structure de listes** | Tableaux natifs délimités par `[...]` | Répétition d'éléments balisés (`<item>...</item>`) |
| **Intégration JavaScript** | Native, ultra-rapide (`JSON.parse` / `stringify`) | Nécessite `DOMParser` ou une bibliothèque tierce |
| **Distinction Valeur / Métadonnée** | Unique : tout est propriété d'objet | Double : distinction complexe entre Éléments et Attributs |
| **Validation de schéma** | JSON Schema (existant mais optionnel) | XSD / DTD (extrêmement rigide, complexe et puissant) |
| **Commentaires autorisés** | ❌ Strictement interdits par la norme RFC | ✅ Autorisés (`<!-- commentaire -->`) |
| **Cas d'usages modernes** | APIs REST, communication SPA, Stockage NoSQL | Flux bancaires (SEPA), SVG, bureautique (DOCX), configs |

---

## Partie 03 — Sérialisation & Désérialisation en TypeScript : Mécanismes & Pièges

L'environnement standard JavaScript/TypeScript intègre l'objet global statique `JSON`. Bien que ses méthodes `stringify()` et `parse()` semblent familières, elles renferment des mécanismes avancés indispensables à tout développeur professionnel.

### 3.1 La Sérialisation avec `JSON.stringify()`

La signature complète de la méthode est la suivante :

```typescript
JSON.stringify(value: any, replacer?: Function | (string | number)[], space?: string | number): string
```

#### 1. Le paramètre de mise en forme `space` (Pretty-Printing)
Par défaut, `JSON.stringify(objet)` produit une chaîne compacte sans espaces ni retours à la ligne, optimisée pour minimiser la bande passante réseau.  
Pour générer un fichier de configuration lisible par un être humain ou un affichage de diagnostic dans votre console/IHM, utilisez le troisième paramètre :

```typescript
const config = { theme: 'dark', autoSave: true, maxRetries: 3 };

// Format compact (par défaut) :
console.log(JSON.stringify(config));
// '{"theme":"dark","autoSave":true,"maxRetries":3}'

// Format indenté avec 2 espaces :
console.log(JSON.stringify(config, null, 2));
/*
{
  "theme": "dark",
  "autoSave": true,
  "maxRetries": 3
}
*/
```

#### 2. Le paramètre de filtrage et transformation `replacer`
Le second argument permet de filtrer ou de modifier les données avant leur mise en chaîne :

- **Sous forme de tableau de chaînes** : Il agit comme une **liste blanche** stricte des attributs autorisés :
  ```typescript
  const utilisateur = { id: 1, pseudo: 'Alice', motDePasseHash: 'secret$123', email: 'alice@eafc.be' };
  
  // N'exporter que l'id et le pseudo :
  const jsonPublic = JSON.stringify(utilisateur, ['id', 'pseudo'], 2);
  console.log(jsonPublic);
  // Seuls "id" et "pseudo" apparaissent ! "motDePasseHash" et "email" sont exclus.
  ```

- **Sous forme de fonction** : Elle reçoit chaque clé et valeur pour appliquer des transformations conditionnelles :
  ```typescript
  const donnees = { nom: 'Produit A', prix: 100, secretInterne: 'CONFIDENTIEL' };

  const jsonFiltre = JSON.stringify(donnees, (cle, valeur) => {
    if (cle === 'secretInterne') {
      return undefined; // 🛑 Supprime définitivement la propriété de la sortie !
    }
    if (typeof valeur === 'number') {
      return `${valeur} €`; // Transforme les nombres en chaînes monétaires
    }
    return valeur; // Conserve le reste inchangé
  });
  ```

#### 3. La méthode magique `toJSON()` sur une classe POO
Si un objet ou une instance de classe possède une méthode nommée `toJSON()`, `JSON.stringify()` lui délègue **prioritairement** la responsabilité de sa sérialisation. C'est l'incarnation parfaite du principe d'encapsulation (Séance 05) appliqué à la persistance : **l'objet décide lui-même de ce qu'il accepte de divulguer au monde extérieur** !

```typescript
export class CompteBancaire {
  readonly #iban: string;
  #solde: number;
  readonly #codeSecret: string; // Donnée ultrasensible

  constructor(iban: string, soldeInitial: number, codeSecret: string) {
    this.#iban = iban;
    this.#solde = soldeInitial;
    this.#codeSecret = codeSecret;
  }

  // Hook automatique invoqué par JSON.stringify()
  toJSON(): object {
    return {
      iban: this.#iban,
      solde: this.#solde,
      exporteLe: new Date().toISOString()
      // Le code secret est délibérément omis : protection absolue !
    };
  }
}

const compte = new CompteBancaire('BE76-1234-5678-9012', 1500, 'PIN-9999');
console.log(JSON.stringify(compte, null, 2));
/*
{
  "iban": "BE76-1234-5678-9012",
  "solde": 1500,
  "exporteLe": "2026-10-06T18:35:00.000Z"
}
*/
```

---

### 3.2 La Désérialisation avec `JSON.parse()`

La méthode inverse prend une chaîne de caractères et reconstitue les données :

```typescript
JSON.parse(text: string, reviver?: (key: string, value: any) => any): any
```

#### 1. Le Danger Absolu du retour `any`
Regardez attentivement la signature officielle fournie par la bibliothèque standard TypeScript de `JSON.parse()` :  
**Elle renvoie le type `any` !**

```typescript
// ❌ DANGER : Un trou noir de sécurité de typage !
const resultat = JSON.parse(chaineRecue);
resultat.nImporteQuoi.methodeInexistante(); // Le compilateur ne bronche pas, crash au runtime !
```

`any` désactive l'ensemble du vérificateur de types de TypeScript. Accepter un retour `any` dans votre code revient à faire entrer un cheval de Troie au cœur de votre architecture logicielle.

#### 2. Sécurisation : Forcer `unknown` et pratiquer le *Type Narrowing*
La bonne pratique d'ingénierie consiste à réassigner immédiatement le résultat à `unknown`, puis à vérifier la forme des données avec un garde de type (*Type Guard*) :

```typescript
export interface ProduitBrut {
  nom: string;
  prix: number;
}

// Fonction de garde de type personnalisée (Type Guard)
function estProduitBrut(donnee: unknown): donnee is ProduitBrut {
  return (
    typeof donnee === 'object' &&
    donnee !== null &&
    'nom' in donnee &&
    typeof (donnee as Record<string, unknown>)['nom'] === 'string' &&
    'prix' in donnee &&
    typeof (donnee as Record<string, unknown>)['prix'] === 'number'
  );
}

// Utilisation sécurisée :
try {
  const donneesInconnues: unknown = JSON.parse(chaineRecue);
  if (estProduitBrut(donneesInconnues)) {
    // Ici, TypeScript sait avec certitude que donneesInconnues est de type ProduitBrut !
    console.log(`Produit valide : ${donneesInconnues.nom} (${donneesInconnues.prix} €)`);
  } else {
    console.error('Le format JSON ne correspond pas à la structure attendue.');
  }
} catch (erreur) {
  console.error('La chaîne reçue n'est pas un JSON valide (SyntaxError).');
}
```

#### 3. La fonction de réhydratation automatique `reviver`
Le paramètre `reviver` est une fonction miroir du `replacer`. Il inspecte chaque nœud reconstruit. C'est le moyen le plus élégant pour transformer automatiquement des chaînes de dates ISO en véritables objets `Date` :

```typescript
const jsonAvecDates = '{"id":"EVT-1","dateDebut":"2026-10-06T18:00:00.000Z","description":"Cours POO"}';

// Détecteur d'horodatage ISO 8601 regex
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;

const evenement = JSON.parse(jsonAvecDates, (cle, valeur) => {
  if (typeof valeur === 'string' && ISO_DATE_REGEX.test(valeur)) {
    return new Date(valeur); // Réhydrate automatiquement la chaîne en objet Date !
  }
  return valeur;
});

console.log(evenement.dateDebut instanceof Date); // ✅ true !
console.log(evenement.dateDebut.getFullYear());    // ✅ 2026 !
```

---

## Partie 04 — Le Grand Défi de la POO : Réhydratation d'Objets & Préservation du Prototype

Voici le cœur conceptuel de notre séance. C'est ici que se séparent les programmeurs amateurs et les véritables ingénieurs logiciels.

### 4.1 L'Illusion de la Désérialisation : Le Drame du Prototype Perdu

Examinons le code suivant, que l'on retrouve malheureusement trop souvent chez les développeurs débutants :

```typescript
export class Article {
  constructor(
    public id: string,
    public designation: string,
    public prixHT: number,
    public tauxTVA: number = 21
  ) {}

  // Méthode métier calculant le prix TTC
  calculerPrixTTC(): number {
    return this.prixHT * (1 + this.tauxTVA / 100);
  }
}

// 1. Création d'une instance réelle et sérialisation
const original = new Article('ART-01', 'Écran 4K', 400);
console.log(original.calculerPrixTTC()); // 484 € (Tout va bien)

const chaineJson = JSON.stringify(original);
// Chaine générée : '{"id":"ART-01","designation":"Écran 4K","prixHT":400,"tauxTVA":21}'

// 2. Désérialisation naïve avec casting TypeScript 'as Article' :
const restaure = JSON.parse(chaineJson) as Article;

// 🛑 TEST 1 : Vérification de l'appartenance à la classe
console.log(restaure instanceof Article); 
// Sortie console : ❌ FALSE !!!

// 🛑 TEST 2 : Appel de la méthode métier
console.log(restaure.calculerPrixTTC()); 
// Sortie console : 💥 TypeError: restaure.calculerPrixTTC is not a function !
```

#### Pourquoi ce crash brutal survient-il ?
Pour une raison fondamentale liée au modèle d'exécution JavaScript :
1. Le casting TypeScript `as Article` n'est qu'un artifice de compilation. Il disparaît purement et simplement lors de la transpilation en JavaScript.
2. `JSON.parse()` ne connaît absolument pas votre classe `Article`. Il ne dispose d'aucune information sur son existence.
3. En conséquence, `JSON.parse()` instancie un simple **objet littéral générique** dont le prototype direct est `Object.prototype`.
4. La chaîne de prototypes ne remonte jamais vers `Article.prototype`. L'objet reconstruit possède bien les valeurs `id`, `prixHT` et `designation`, mais **il est amputé de la totalité de ses méthodes et de son identité** !

```
OBJET INITIAL EN MÉMOIRE :
┌─────────────────────────────────┐
│ instance 'original'             │ ──[ __proto__ ]──> ┌─────────────────────────────┐
│ • id: "ART-01"                  │                    │ Article.prototype           │
│ • prixHT: 400                   │                    │ • calculerPrixTTC() { ... } │
└─────────────────────────────────┘                    └─────────────────────────────┘

OBJET APRÈS JSON.parse() :
┌─────────────────────────────────┐
│ objet 'restaure' (Littéral pur) │ ──[ __proto__ ]──> ┌─────────────────────────────┐
│ • id: "ART-01"                  │                    │ Object.prototype            │
│ • prixHT: 400                   │                    │ • toString()                │
└─────────────────────────────────┘                    │ • hasOwnProperty()          │
                                                       └─────────────────────────────┘
  ❌ AUCUNE MÉTHODE MÉTIER ! 'instanceof Article' VAUT FALSE !
```

---

### 4.2 Les Fausses Bonnes Idées : Pourquoi Éviter le « Bricolage »

Face à ce problème, certains tentent des raccourcis séduisants mais dangereux :

```typescript
// ❌ FAUSSE BONNE IDÉE 1 : Forcer le prototype au runtime
const objetBrut = JSON.parse(chaineJson);
Object.setPrototypeOf(objetBrut, Article.prototype);

// ❌ FAUSSE BONNE IDÉE 2 : Copier les propriétés avec Object.assign
const instanceBricolee = Object.assign(new Article('', '', 0), JSON.parse(chaineJson));
```

#### Pourquoi ces techniques sont-elles proscrites dans une architecture propre ?
1. **Destruction des performances V8** : `Object.setPrototypeOf()` casse irrémédiablement les optimisations de formes d'objets (*hidden classes / inline caches*) du moteur V8 des navigateurs.
2. **Violations des invariants (Séance 05)** : Le constructeur de votre classe n'est jamais exécuté (dans le cas de `setPrototypeOf`), ou est appelé avec des valeurs bidons (`new Article('', '', 0)`). Vos contrôles de validité (ex: `if (prixHT <= 0) throw new Error(...)`) sont totalement contournés ! Si le JSON contenait un prix négatif, votre objet corrompu prend vie sans aucune alerte.
3. **Incapacité à gérer les objets imbriqués** : Si votre article possède un tableau de sous-objets `Commentaire[]`, `Object.assign` les laissera sous forme d'objets littéraux simples.

---

### 4.3 La Solution Noble : DTO (*Data Transfer Object*) & Fabrique Métier

La conception logicielle professionnelle résout ce problème avec élégance grâce à un patron de conception éprouvé : **la dissociation stricte entre DTO et Entité Métier**.

```
┌───────────────────────────────────────────────┐
│        FLUX DE SÉRIALISATION / PERSISTANCE    │
├───────────────────────────────────────────────┤
│                                               │
│   [ Entité Métier Vivante ] (class Article)   │
│      • Méthodes métier (calculerPrixTTC)      │
│      • Invariants protégés (prixHT > 0)       │
│      • Propriétés privées encapsulées         │
│                     │                         │
│                     │ .toDTO() / .toJSON()    │
│                     ▼                         │
│   [ DTO Passif ] (interface ArticleDTO)       │
│      • Structure purement descriptive         │
│      • Compatible 100% avec le format JSON    │
│                     │                         │
│                     │ JSON.stringify()        │
│                     ▼                         │
│   [ Chaîne Textuelle JSON ]                   │
│      • Stockée sur disque / Envoyée           │
│                     │                         │
│                     │ JSON.parse()            │
│                     ▼                         │
│   [ Donnée Reçue Décodée ] (unknown)          │
│                     │                         │
│                     │ Validation & Type Guard │
│                     ▼                         │
│   [ DTO Certifié Conforme ]                   │
│                     │                         │
│                     │ Article.fromDTO(dto)    │
│                     ▼                         │
│   [ Entité Métier Réhydratée ] (class)        │
│      • Invariants vérifiés à nouveau          │
│      • Prototype restauré                     │
│      • 'instanceof Article' === true          │
│                                               │
└───────────────────────────────────────────────┘
```

#### 1. Le DTO (*Data Transfer Object*) : Le contrat de transport
Un DTO est une simple `interface` (ou un `type`) TypeScript. Il ne contient **aucun comportement, aucune méthode, aucune logique**. Sa seule mission est de décrire la forme géométrique exacte des données sérialisables.

```typescript
export interface ArticleDTO {
  id: string;
  designation: string;
  prixHT: number;
  tauxTVA: number;
  dateCreation: string; // En JSON, la date voyage toujours sous forme de texte ISO !
}
```

#### 2. L'Entité Métier : La forteresse du domaine
La classe métier incarne la vérité du système. Elle possède son constructeur avec validation d'invariants, ses méthodes métier, et deux fonctions pivots :
- Une méthode d'instance `toDTO()` (ou `toJSON()`) pour exporter son état.
- Une **méthode statique de fabrique (*Factory Method*) `fromDTO()`** pour reconstruire une instance certifiée conforme à partir des données brutes.

```typescript
export class Article {
  readonly #id: string;
  #designation: string;
  #prixHT: number;
  #tauxTVA: number;
  readonly #dateCreation: Date;

  constructor(id: string, designation: string, prixHT: number, tauxTVA: number, dateCreation: Date) {
    // 🛡️ Protection des invariants métier (Séance 05 & 10)
    if (!id || id.trim().length === 0) {
      throw new Error('L'identifiant de l'article est obligatoire.');
    }
    if (prixHT < 0) {
      throw new Error(`Le prix HT ne peut pas être négatif (reçu : ${prixHT} €).`);
    }
    if (tauxTVA < 0 || tauxTVA > 100) {
      throw new Error(`Taux de TVA invalide : ${tauxTVA}%. Doit être compris entre 0 et 100.`);
    }

    this.#id = id;
    this.#designation = designation.trim();
    this.#prixHT = prixHT;
    this.#tauxTVA = tauxTVA;
    this.#dateCreation = dateCreation;
  }

  // --- Getters publics encapsulés ---
  get id(): string { return this.#id; }
  get designation(): string { return this.#designation; }
  get prixHT(): number { return this.#prixHT; }
  get tauxTVA(): number { return this.#tauxTVA; }
  get dateCreation(): Date { return this.#dateCreation; }

  // --- Comportement Métier POO ---
  calculerPrixTTC(): number {
    return Number((this.#prixHT * (1 + this.#tauxTVA / 100)).toFixed(2));
  }

  // --- Exportation vers DTO / JSON ---
  toDTO(): ArticleDTO {
    return {
      id: this.#id,
      designation: this.#designation,
      prixHT: this.#prixHT,
      tauxTVA: this.#tauxTVA,
      dateCreation: this.#dateCreation.toISOString()
    };
  }

  toJSON(): ArticleDTO {
    return this.toDTO();
  }

  // --- Fabrique de Réhydratation (La solution reine !) ---
  static fromDTO(dto: ArticleDTO): Article {
    // Reconversion explicite des types (chaîne ISO -> objet Date réel)
    const dateRehydratee = new Date(dto.dateCreation);
    
    // Instanciation légitime : le constructeur valide à nouveau tous les invariants !
    return new Article(
      dto.id,
      dto.designation,
      dto.prixHT,
      dto.tauxTVA,
      dateRehydratee
    );
  }
}
```

Grâce à cette architecture :
1. `Article.fromDTO(dto)` réexécute scrupuleusement le constructeur : **aucun objet corrompu ne peut pénétrer dans votre système**.
2. L'instance créée est rattachée nativement à `Article.prototype` : **`instanceof Article` vaut `true`**.
3. Les méthodes métier comme `calculerPrixTTC()` sont immédiatement disponibles.
4. Les objets `Date` sont reconstruits sous forme d'instances natives dotées de toutes leurs méthodes temporelles.

---

## Partie 05 — Pièges Fréquents & Anti-Patterns des Développeurs Juniors

| Anti-Pattern fréquent | Pourquoi c'est une défaillance grave | Solution d'ingénierie conforme |
| :--- | :--- | :--- |
| **Le Cast naïf `as MaClasse`** | `JSON.parse(str) as Article` fait croire au compilateur que l'objet est une instance. Au runtime, `instanceof` échoue et les appels de méthodes lèvent des `TypeError`. | Utiliser une méthode de fabrique statique : `Article.fromDTO(dto)`. |
| **Le syndrome de la Date stringifiée** | Oublier que `JSON.stringify` convertit les objets `Date` en chaînes ISO. Appeler ensuite `.getFullYear()` plante : `date.getFullYear is not a function`. | Réhydrater avec `new Date(dto.date)` ou utiliser le paramètre `reviver` de `JSON.parse`. |
| **La référence circulaire mortelle** | Deux objets qui se référencent mutuellement (`parent.enfant = e; e.parent = parent;`). `JSON.stringify` boucle à l'infini et plante : `TypeError: Converting circular structure to JSON`. | Rompre les boucles dans les DTOs ou utiliser un `replacer` coupant les références arrière. |
| **La fuite de données confidentielles** | Sérialiser directement une entité utilisateur contenant un mot de passe haché ou un jeton de session. | Implémenter la méthode `toJSON()` sur la classe ou projeter vers un DTO d'exposition sécurisé. |
| **Le parsing sans filet de sécurité** | Appeler `JSON.parse(donnees)` sans bloc `try / catch`. Si la chaîne est altérée, l'exception non gérée fait crasher l'application. | Encapsuler systématiquement dans un `try / catch` et convertir en exception applicative typée (Séance 10). |

---

## Partie 06 — Démonstration Angular Complète : L'Atelier de Sérialisation Locale (*DataVault*)

Pour mettre en pratique l'intégralité de ces concepts dans une application d'entreprise sous **Angular 22** (sans réseau, uniquement avec de la manipulation locale de données textuelles et de fichiers), nous allons concevoir l'application **DataVault**.

### Vue d'ensemble de l'architecture

L'application est structurée de manière hautement modulaire :

```
src/app/
├── models/
│   └── article.model.ts            # Entité Métier POO encapsulée & interface DTO
├── services/
│   ├── serialization.service.ts    # Service gérant JSON.stringify/parse sécurisés & parser XML
│   └── vault-store.service.ts      # Service Store réactif (Signals) pilotant le catalogue
└── components/
    └── data-vault/
        └── data-vault.component.ts # Composant Standalone Angular 22 complet (Vue & Logique)
```

---

### 6.1 Étape 1 : Le Modèle Métier POO & son DTO (`article.model.ts`)

```typescript
// src/app/models/article.model.ts

/**
 * Contrat DTO (Data Transfer Object) :
 * Structure de transport purement descriptive, sérialisable sans perte en JSON.
 */
export interface ArticleDTO {
  id: string;
  designation: string;
  prixHT: number;
  tauxTVA: number;
  dateCreation: string; // Horodatage ISO-8601
}

/**
 * Entité Métier POO du Domaine :
 * Encapsule ses attributs, garantit ses invariants et expose ses méthodes de calcul.
 */
export class Article {
  readonly #id: string;
  #designation: string;
  #prixHT: number;
  #tauxTVA: number;
  readonly #dateCreation: Date;

  constructor(
    id: string,
    designation: string,
    prixHT: number,
    tauxTVA: number = 21,
    dateCreation: Date = new Date()
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('L'identifiant de l'article est obligatoire.');
    }
    if (!designation || designation.trim().length === 0) {
      throw new Error('La désignation ne peut pas être vide.');
    }
    if (prixHT < 0) {
      throw new Error(`Le prix HT (${prixHT} €) ne peut pas être strictement négatif.`);
    }
    if (tauxTVA < 0 || tauxTVA > 100) {
      throw new Error(`Taux TVA invalide : ${tauxTVA}%.`);
    }

    this.#id = id.trim();
    this.#designation = designation.trim();
    this.#prixHT = Number(prixHT);
    this.#tauxTVA = Number(tauxTVA);
    this.#dateCreation = dateCreation;
  }

  // --- Getters d'Encapsulation ---
  get id(): string { return this.#id; }
  get designation(): string { return this.#designation; }
  get prixHT(): number { return this.#prixHT; }
  get tauxTVA(): number { return this.#tauxTVA; }
  get dateCreation(): Date { return this.#dateCreation; }

  // --- Comportement Métier ---
  /**
   * Calcule le montant TTC arrondi au centime d'euro le plus proche.
   */
  calculerPrixTTC(): number {
    const montant = this.#prixHT * (1 + this.#tauxTVA / 100);
    return Math.round(montant * 100) / 100;
  }

  /**
   * Calcule le montant net de la taxe seule.
   */
  calculerMontantTaxe(): number {
    const taxe = this.#prixHT * (this.#tauxTVA / 100);
    return Math.round(taxe * 100) / 100;
  }

  // --- Projection vers DTO ---
  toDTO(): ArticleDTO {
    return {
      id: this.#id,
      designation: this.#designation,
      prixHT: this.#prixHT,
      tauxTVA: this.#tauxTVA,
      dateCreation: this.#dateCreation.toISOString()
    };
  }

  /**
   * Hook automatique invoqué lors de JSON.stringify()
   */
  toJSON(): ArticleDTO {
    return this.toDTO();
  }

  // --- Fabrique de Réhydratation (Factory) ---
  static fromDTO(dto: ArticleDTO): Article {
    if (!dto || typeof dto !== 'object') {
      throw new Error('Impossible de réhydrater un article : DTO non défini.');
    }

    const dateParsed = new Date(dto.dateCreation);
    if (isNaN(dateParsed.getTime())) {
      throw new Error(`Date de création invalide dans le DTO : "${dto.dateCreation}".`);
    }

    return new Article(
      dto.id,
      dto.designation,
      dto.prixHT,
      dto.tauxTVA,
      dateParsed
    );
  }
}
```

---

### 6.2 Étape 2 : Le Service de Sérialisation & Parser XML (`serialization.service.ts`)

Ce service regroupe toutes les opérations techniques de transformation de chaînes. Il applique le principe de responsabilité unique (SRP, Séance 11) et protège l'application des erreurs de parsing (Séance 10).

```typescript
// src/app/services/serialization.service.ts
import { Injectable } from '@angular/core';
import { Article, ArticleDTO } from '../models/article.model';

export interface SerializationResult<T> {
  succes: boolean;
  donnees?: T;
  erreur?: string;
  tailleOctets?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SerializationService {
  /**
   * Sérialise une liste d'articles POO en chaîne JSON formatée.
   */
  serialiserArticlesEnJson(articles: Article[], avecIndentation: boolean = true): string {
    // JSON.stringify invoque automatiquement la méthode .toJSON() de chaque Article !
    const espace = avecIndentation ? 2 : 0;
    return JSON.stringify(articles, null, espace);
  }

  /**
   * Désérialise et réhydrate une chaîne JSON en une liste de vraies instances 'Article'.
   * Applique la validation de type et de structure sans jamais recourir à 'any'.
   */
  deserialiserArticlesDepuisJson(chaineJson: string): SerializationResult<Article[]> {
    if (!chaineJson || chaineJson.trim().length === 0) {
      return { succes: false, erreur: 'Le texte JSON à désérialiser est vide.' };
    }

    try {
      // 1. Parsing sécurisé en 'unknown' (Bannit le 'any')
      const brut: unknown = JSON.parse(chaineJson);

      // 2. Vérification de structure globale
      if (!Array.isArray(brut)) {
        return { succes: false, erreur: 'Le format JSON attendu est un tableau [...] d'articles.' };
      }

      // 3. Réhydratation unitaire et validation des invariants
      const articlesRehydrates: Article[] = [];
      for (let i = 0; i < brut.length; i++) {
        const item = brut[i];
        if (!this.validerStructureDTO(item)) {
          return {
            succes: false,
            erreur: `L'élément à l'index [${i}] ne respecte pas le contrat ArticleDTO.`
          };
        }
        // Reconstruction légitime via la fabrique POO
        const instance = Article.fromDTO(item);
        articlesRehydrates.push(instance);
      }

      return {
        succes: true,
        donnees: articlesRehydrates,
        tailleOctets: new Blob([chaineJson]).size
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue de syntaxe JSON.';
      return { succes: false, erreur: `Échec du parsing JSON : ${message}` };
    }
  }

  /**
   * Parse une chaîne XML patrimoniale et convertit les données en DTOs standards.
   * Utilise le DOMParser natif du navigateur.
   */
  lireXmlCatalogue(chaineXml: string): SerializationResult<ArticleDTO[]> {
    if (!chaineXml || chaineXml.trim().length === 0) {
      return { succes: false, erreur: 'Le flux XML est vide.' };
    }

    try {
      const parser = new DOMParser();
      const documentXml = parser.parseFromString(chaineXml, 'application/xml');

      // Détection des erreurs de syntaxe XML natives
      const erreurBalise = documentXml.querySelector('parsererror');
      if (erreurBalise) {
        return {
          succes: false,
          erreur: `Erreur de syntaxe XML : ${erreurBalise.textContent ?? 'Structure XML invalide'}`
        };
      }

      const noeudsArticles = documentXml.querySelectorAll('article');
      if (noeudsArticles.length === 0) {
        return { succes: false, erreur: 'Aucune balise <article> trouvée dans le document XML.' };
      }

      const dtos: ArticleDTO[] = [];
      noeudsArticles.forEach((noeud) => {
        const id = noeud.getAttribute('id') ?? `XML-GEN-${Math.random().toString(36).substring(2, 6)}`;
        const designation = noeud.querySelector('designation')?.textContent?.trim() ?? 'Sans désignation';
        const prixHT = parseFloat(noeud.querySelector('prixHT')?.textContent ?? '0');
        const tauxTVA = parseFloat(noeud.querySelector('tauxTVA')?.textContent ?? '21');
        const dateIso = noeud.querySelector('dateCreation')?.textContent?.trim() ?? new Date().toISOString();

        dtos.push({
          id,
          designation,
          prixHT: isNaN(prixHT) ? 0 : prixHT,
          tauxTVA: isNaN(tauxTVA) ? 21 : tauxTVA,
          dateCreation: dateIso
        });
      });

      return {
        succes: true,
        donnees: dtos,
        tailleOctets: new Blob([chaineXml]).size
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur imprévue lors du parsing XML.';
      return { succes: false, erreur: `Échec XML : ${message}` };
    }
  }

  /**
   * Garde de type (Type Guard) privé vérifiant la géométrie du DTO
   */
  private validerStructureDTO(item: unknown): item is ArticleDTO {
    if (typeof item !== 'object' || item === null) return false;
    const candid = item as Record<string, unknown>;
    return (
      typeof candid['id'] === 'string' &&
      typeof candid['designation'] === 'string' &&
      typeof candid['prixHT'] === 'number' &&
      typeof candid['tauxTVA'] === 'number' &&
      typeof candid['dateCreation'] === 'string'
    );
  }
}
```

---

### 6.3 Étape 3 : Le Service Store Réactif (`vault-store.service.ts`)

Ce service gère la liste vivante des articles en mémoire sous forme de signaux réactifs (`signal`, `computed`). Il permet d'ajouter des articles, de charger des données et d'exporter l'état courant.

```typescript
// src/app/services/vault-store.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { Article } from '../models/article.model';
import { SerializationService } from './serialization.service';

@Injectable({
  providedIn: 'root'
})
export class VaultStoreService {
  private readonly serializationService = inject(SerializationService);

  // État mutable interne (Signal source privé)
  readonly #articles = signal<Article[]>([
    new Article('ART-001', 'Écran Dell UltraSharp 27"', 349.99, 21, new Date('2026-01-15T10:00:00Z')),
    new Article('ART-002', 'Clavier Mécanique MX Keys', 109.50, 21, new Date('2026-02-20T14:30:00Z')),
    new Article('ART-003', 'Souris Ergonomique Logitech', 89.00, 21, new Date('2026-03-05T09:15:00Z')),
    new Article('ART-004', 'Livre "Conception POO Moderne"', 45.00, 6, new Date('2026-04-10T11:00:00Z'))
  ]);

  // Expositions publiques en lecture seule
  readonly articles = this.#articles.asReadonly();

  // Indicateurs dérivés réactifs (computed)
  readonly nombreArticles = computed(() => this.#articles().length);

  readonly totalHT = computed(() => {
    const total = this.#articles().reduce((acc, art) => acc + art.prixHT, 0);
    return Math.round(total * 100) / 100;
  });

  readonly totalTTC = computed(() => {
    const total = this.#articles().reduce((acc, art) => acc + art.calculerPrixTTC(), 0);
    return Math.round(total * 100) / 100;
  });

  readonly totalTaxes = computed(() => {
    const total = this.#articles().reduce((acc, art) => acc + art.calculerMontantTaxe(), 0);
    return Math.round(total * 100) / 100;
  });

  // --- Actions Métier ---
  ajouterArticle(nouvelArticle: Article): void {
    this.#articles.update(liste => [nouvelArticle, ...liste]);
  }

  supprimerArticle(id: string): void {
    this.#articles.update(liste => liste.filter(art => art.id !== id));
  }

  reinitialiserParDefaut(): void {
    this.#articles.set([
      new Article('ART-001', 'Écran Dell UltraSharp 27"', 349.99, 21),
      new Article('ART-002', 'Clavier Mécanique MX Keys', 109.50, 21),
      new Article('ART-003', 'Souris Ergonomique Logitech', 89.00, 21)
    ]);
  }

  chargerArticles(nouvelleListe: Article[]): void {
    this.#articles.set(nouvelleListe);
  }

  // --- Raccourci de sérialisation ---
  obtenirJsonExport(): string {
    return this.serializationService.serialiserArticlesEnJson(this.#articles(), true);
  }
}
```

---

### 6.4 Étape 4 : Le Composant Standalone DataVault (`data-vault.component.ts`)

Voici l'interface utilisateur complète développée avec **Bootstrap 5** et les **Signals Angular 22**. Elle comprend des zones d'édition interactives, des visualisations d'état et un panneau de diagnostic vérifiant en direct l'intégrité de la réhydratation (`instanceof Article` et exécution de méthodes).

```typescript
// src/app/components/data-vault/data-vault.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VaultStoreService } from '../../services/vault-store.service';
import { SerializationService } from '../../services/serialization.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-data-vault',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4 px-lg-5">
      <!-- En-tête principal -->
      <header class="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <div>
          <span class="badge bg-primary text-uppercase px-2 py-1 mb-1">Bloc D — Persistance des Données</span>
          <h1 class="h2 fw-bold text-dark mb-0">Atelier de Sérialisation Locale : DataVault</h1>
          <p class="text-muted small mb-0">Expérimentation POO : JSON, XML, Typage Strict & Réhydratation de Prototypes</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" (click)="store.reinitialiserParDefaut()">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Réinitialiser
          </button>
          <button class="btn btn-success btn-sm" (click)="exporterVersEditeur()">
            <i class="bi bi-filetype-json me-1"></i> Sérialiser l'état en JSON
          </button>
        </div>
      </header>

      <!-- Message d'Alerte / Statut Réactif -->
      @if (messageStatut()) {
        <div class="alert alert-dismissible fade show mb-4 shadow-sm" [ngClass]="alertClass()">
          <div class="d-flex align-items-center">
            <strong class="me-2">{{ statutTitre() }} :</strong>
            <span>{{ messageStatut() }}</span>
          </div>
          <button type="button" class="btn-close" (click)="effacerMessage()"></button>
        </div>
      }

      <!-- Tableau de bord indicateurs réactifs (computed) -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm bg-primary text-white p-3">
            <div class="text-uppercase small fw-semibold opacity-75">Articles en Mémoire (RAM)</div>
            <div class="display-6 fw-bold mt-1">{{ store.nombreArticles() }}</div>
            <div class="small opacity-75 mt-1">Instances 'Article' vivantes</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm bg-white p-3 border-start border-primary border-4">
            <div class="text-uppercase text-muted small fw-semibold">Total Hors Taxes</div>
            <div class="h3 fw-bold text-dark mt-1">{{ store.totalHT() | number:'1.2-2' }} €</div>
            <div class="small text-muted">Somme brute des prixHT</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm bg-white p-3 border-start border-warning border-4">
            <div class="text-uppercase text-muted small fw-semibold">TVA Cumulée</div>
            <div class="h3 fw-bold text-dark mt-1">{{ store.totalTaxes() | number:'1.2-2' }} €</div>
            <div class="small text-muted">Calculée via .calculerMontantTaxe()</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm bg-white p-3 border-start border-success border-4">
            <div class="text-uppercase text-muted small fw-semibold">Total TTC en Direct</div>
            <div class="h3 fw-bold text-success mt-1">{{ store.totalTTC() | number:'1.2-2' }} €</div>
            <div class="small text-muted">Calculé via .calculerPrixTTC()</div>
          </div>
        </div>
      </div>

      <!-- Corps principal en 2 colonnes -->
      <div class="row g-4">
        <!-- COLONNE GAUCHE : État vivant en mémoire vive (RAM) -->
        <div class="col-lg-6">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title fw-bold text-dark mb-0">
                <i class="bi bi-memory me-2 text-primary"></i> 1. Objets Vivants dans la RAM
              </h5>
              <span class="badge bg-light text-dark border">{{ store.articles().length }} entités</span>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light small text-uppercase">
                    <tr>
                      <th class="ps-3">Réf / Désignation</th>
                      <th>Prix HT</th>
                      <th>TVA</th>
                      <th>Prix TTC (Méthode)</th>
                      <th>Création (Date)</th>
                      <th class="text-end pe-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (art of store.articles(); track art.id) {
                      <tr>
                        <td class="ps-3">
                          <div class="fw-bold font-monospace text-primary small">{{ art.id }}</div>
                          <div class="text-dark small">{{ art.designation }}</div>
                        </td>
                        <td class="small">{{ art.prixHT | number:'1.2-2' }} €</td>
                        <td><span class="badge bg-secondary-subtle text-secondary">{{ art.tauxTVA }}%</span></td>
                        <td class="small fw-semibold text-success">
                          {{ art.calculerPrixTTC() | number:'1.2-2' }} €
                        </td>
                        <td class="small text-muted">
                          {{ art.dateCreation | date:'dd/MM/yyyy HH:mm' }}
                        </td>
                        <td class="text-end pe-3">
                          <button class="btn btn-outline-danger btn-sm py-0 px-2" (click)="store.supprimerArticle(art.id)">
                            &times;
                          </button>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="6" class="text-center py-4 text-muted">
                          Aucun article en mémoire vive. Importez des données depuis la colonne de droite !
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Formulaire rapide d'ajout pour tester la persistance -->
            <div class="card-footer bg-light p-3 border-top">
              <h6 class="small fw-bold text-uppercase text-muted mb-2">Ajouter un nouvel article manuellement :</h6>
              <div class="row g-2">
                <div class="col-md-3">
                  <input type="text" class="form-control form-control-sm" placeholder="Réf (ex: ART-99)" [(ngModel)]="nouveauId">
                </div>
                <div class="col-md-4">
                  <input type="text" class="form-control form-control-sm" placeholder="Désignation" [(ngModel)]="nouvelleDesignation">
                </div>
                <div class="col-md-3">
                  <input type="number" class="form-control form-control-sm" placeholder="Prix HT" [(ngModel)]="nouveauPrixHT">
                </div>
                <div class="col-md-2">
                  <button class="btn btn-primary btn-sm w-100" (click)="creerArticleManuel()">Créer</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- COLONNE DROITE : La Persistance (Chaînes Textuelles Sérialisées) -->
        <div class="col-lg-6">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title fw-bold text-dark mb-0">
                <i class="bi bi-file-earmark-code me-2 text-success"></i> 2. Espace de Sérialisation (Texte Brut)
              </h5>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary" [class.active]="modeFormat() === 'JSON'" (click)="basculerFormat('JSON')">Format JSON</button>
                <button class="btn btn-outline-primary" [class.active]="modeFormat() === 'XML'" (click)="basculerFormat('XML')">Format XML (Lecture)</button>
              </div>
            </div>

            <div class="card-body d-flex flex-col p-3">
              <div class="mb-2 d-flex justify-content-between align-items-center">
                <span class="small text-muted">
                  Taille du flux : <strong>{{ fluxTaille() }} octets</strong>
                </span>
                <div class="d-flex gap-1">
                  <button class="btn btn-link btn-sm text-decoration-none p-0 me-2" (click)="chargerExempleValide()">
                    Charger exemple valide
                  </button>
                  <button class="btn btn-link btn-sm text-danger text-decoration-none p-0" (click)="injecterErreurSyntaxe()">
                    Simuler JSON corrompu
                  </button>
                </div>
              </div>

              <!-- Zone de saisie / d'affichage du texte brut sérialisé -->
              <textarea 
                class="form-control font-monospace small bg-dark text-light p-3 flex-grow-1" 
                rows="14" 
                [(ngModel)]="tamponTexte"
                placeholder="Collez ici votre flux JSON ou XML..."
              ></textarea>

              <!-- Barre d'actions de désérialisation -->
              <div class="d-flex gap-2 mt-3 flex-wrap">
                @if (modeFormat() === 'JSON') {
                  <button class="btn btn-primary btn-sm" (click)="deserialiserEtRehydraterJson()">
                    <i class="bi bi-arrow-left-circle me-1"></i> Désérialiser & Réhydrater dans la RAM
                  </button>
                  <button class="btn btn-outline-danger btn-sm" (click)="testerDeserialisationNaive()">
                    <i class="bi bi-bug me-1"></i> Démontrer le piège 'as Article' (Crash)
                  </button>
                } @else {
                  <button class="btn btn-warning btn-sm text-dark" (click)="deserialiserXmlVersRam()">
                    <i class="bi bi-box-arrow-in-left me-1"></i> Parser XML & Convertir vers la RAM
                  </button>
                }
              </div>
            </div>

            <!-- Panneau de Diagnostic POO en Temps Réel -->
            <div class="card-footer bg-light p-3 border-top">
              <h6 class="small fw-bold text-uppercase text-muted mb-2">
                <i class="bi bi-clipboard2-pulse me-1"></i> Diagnostic POO & Audit de Prototype :
              </h6>
              <div class="p-2 rounded bg-white border small font-monospace">
                <div>Type premier élément : <span class="fw-bold">{{ auditPremierType() }}</span></div>
                <div>Test `instanceof Article` : <span [ngClass]="auditInstanceOfClass()">{{ auditInstanceOfTexte() }}</span></div>
                <div>Exécution méthode `.calculerPrixTTC()` : <span [ngClass]="auditMethodeClass()">{{ auditMethodeTexte() }}</span></div>
                <div>Prototype sous-jacent : <span class="text-muted">{{ auditPrototypeNom() }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    textarea {
      resize: vertical;
      min-height: 280px;
      tab-size: 2;
    }
  `]
})
export class DataVaultComponent {
  // Injection des services
  readonly store = inject(VaultStoreService);
  private readonly serializationService = inject(SerializationService);

  // État local réactif du composant (Signals)
  readonly modeFormat = signal<'JSON' | 'XML'>('JSON');
  tamponTexte = '';

  // Formulaire d'ajout rapide
  nouveauId = 'ART-005';
  nouvelleDesignation = 'Casque Audio ANC';
  nouveauPrixHT = 199.99;

  // Signaux de notification et de diagnostic
  readonly messageStatut = signal<string | null>(null);
  readonly statutTitre = signal<string>('Information');
  readonly alertClass = signal<string>('alert-info');

  readonly auditPremierType = signal<string>('Article (Instance de classe)');
  readonly auditInstanceOfTexte = signal<string>('✅ VRAI (Prototype préservé)');
  readonly auditInstanceOfClass = signal<string>('text-success fw-bold');
  readonly auditMethodeTexte = signal<string>('✅ Fonctionnel (Retourne 423.49 €)');
  readonly auditMethodeClass = signal<string>('text-success fw-bold');
  readonly auditPrototypeNom = signal<string>('Article.prototype');

  // Taille calculée en octets du tampon
  readonly fluxTaille = computed(() => new Blob([this.tamponTexte]).size);

  constructor() {
    // Initialise l'éditeur avec l'état sérialisé courant
    this.exporterVersEditeur();
  }

  exporterVersEditeur(): void {
    if (this.modeFormat() === 'JSON') {
      this.tamponTexte = this.store.obtenirJsonExport();
      this.notifierSucces('Export JSON', 'L'état de la RAM a été sérialisé avec succès avec indentation.');
    } else {
      this.tamponTexte = this.genererXmlExemple();
      this.notifierInfo('Export XML', 'Génération d'un flux XML équivalent.');
    }
    this.mettreAJourAudit(true);
  }

  basculerFormat(nouveauMode: 'JSON' | 'XML'): void {
    this.modeFormat.set(nouveauMode);
    this.exporterVersEditeur();
  }

  creerArticleManuel(): void {
    try {
      const art = new Article(this.nouveauId, this.nouvelleDesignation, this.nouveauPrixHT);
      this.store.ajouterArticle(art);
      this.notifierSucces('Création réussie', `Article ${art.id} instancié et stocké en RAM.`);
      this.nouveauId = `ART-${Math.floor(Math.random() * 900 + 100)}`;
      this.exporterVersEditeur();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Paramètres invalides';
      this.notifierErreur('Erreur d'invariant', msg);
    }
  }

  /**
   * Action 1 : Désérialisation NOBLE et PROPRE
   * Utilise Article.fromDTO() pour reconstruire le prototype et valider les invariants !
   */
  deserialiserEtRehydraterJson(): void {
    const resultat = this.serializationService.deserialiserArticlesDepuisJson(this.tamponTexte);

    if (resultat.succes && resultat.donnees) {
      this.store.chargerArticles(resultat.donnees);
      this.notifierSucces(
        'Réhydratation Réussie',
        `${resultat.donnees.length} article(s) reconstruit(s) avec succès. Prototypes intacts !`
      );
      this.mettreAJourAudit(true);
    } else {
      this.notifierErreur('Échec Désérialisation', resultat.erreur ?? 'Format JSON invalide.');
    }
  }

  /**
   * Action 2 : DÉMONSTRATION DU PIÈGE DU CAST NAÏF 'as Article'
   * Montre ce qui arrive quand on ne fait pas de réhydratation de prototype.
   */
  testerDeserialisationNaive(): void {
    try {
      // 🛑 Le piège classique : casting TypeScript sans conversion de prototype !
      const objetsNaifs = JSON.parse(this.tamponTexte) as Article[];

      if (!Array.isArray(objetsNaifs) || objetsNaifs.length === 0) {
        this.notifierErreur('Erreur Test', 'Veuillez avoir au moins 1 article dans le JSON.');
        return;
      }

      const premier = objetsNaifs[0];

      // Mise à jour de l'audit pour prouver la catastrophe en direct :
      this.auditPremierType.set('Object (Objet littéral pur)');
      this.auditInstanceOfTexte.set('❌ FAUX (instanceof Article vaut false !)');
      this.auditInstanceOfClass.set('text-danger fw-bold');
      this.auditPrototypeNom.set('Object.prototype');

      // Tentative d'appel de la méthode :
      try {
        const testPrix = premier.calculerPrixTTC();
        this.auditMethodeTexte.set(`Succès inattendu : ${testPrix}`);
      } catch (errCrash: unknown) {
        this.auditMethodeTexte.set('💥 CRASH : TypeError: premier.calculerPrixTTC is not a function');
        this.auditMethodeClass.set('text-danger fw-bold');
      }

      this.notifierErreur(
        'Démonstration du Piège',
        'JSON.parse() seul ne réhydrate PAS les méthodes ! Vérifiez le panneau de diagnostic ci-dessous.'
      );
    } catch (syntaxErr: unknown) {
      const msg = syntaxErr instanceof Error ? syntaxErr.message : 'Syntax error';
      this.notifierErreur('Erreur JSON', msg);
    }
  }

  /**
   * Action 3 : Désérialisation du XML via DOMParser
   */
  deserialiserXmlVersRam(): void {
    const resultat = this.serializationService.lireXmlCatalogue(this.tamponTexte);

    if (resultat.succes && resultat.donnees) {
      try {
        const instances = resultat.donnees.map(dto => Article.fromDTO(dto));
        this.store.chargerArticles(instances);
        this.notifierSucces(
          'Parsing XML Réussi',
          `${instances.length} article(s) extrait(s) du XML et converti(s) en objets vivants.`
        );
        this.mettreAJourAudit(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invariants invalides';
        this.notifierErreur('Erreur Métier lors de l'import XML', msg);
      }
    } else {
      this.notifierErreur('Échec XML', resultat.erreur ?? 'Document XML invalide.');
    }
  }

  injecterErreurSyntaxe(): void {
    // Injecte une virgule traînante ou une accolade cassée pour provoquer un SyntaxError
    this.tamponTexte = this.tamponTexte.replace(/\}$/, ', "invalide": }');
    this.notifierInfo('Corruption provoquée', 'Une erreur de syntaxe a été injectée. Tentez de désérialiser !');
  }

  chargerExempleValide(): void {
    this.exporterVersEditeur();
  }

  effacerMessage(): void {
    this.messageStatut.set(null);
  }

  private mettreAJourAudit(estValide: boolean): void {
    if (estValide && this.store.articles().length > 0) {
      const premier = this.store.articles()[0];
      this.auditPremierType.set('Article (Instance de classe)');
      this.auditInstanceOfTexte.set('✅ VRAI (instanceof Article === true)');
      this.auditInstanceOfClass.set('text-success fw-bold');
      this.auditMethodeTexte.set(`✅ Fonctionnel (Retourne ${premier.calculerPrixTTC()} €)`);
      this.auditMethodeClass.set('text-success fw-bold');
      this.auditPrototypeNom.set('Article.prototype');
    }
  }

  private notifierSucces(titre: string, msg: string): void {
    this.statutTitre.set(titre);
    this.messageStatut.set(msg);
    this.alertClass.set('alert-success');
  }

  private notifierErreur(titre: string, msg: string): void {
    this.statutTitre.set(titre);
    this.messageStatut.set(msg);
    this.alertClass.set('alert-danger');
  }

  private notifierInfo(titre: string, msg: string): void {
    this.statutTitre.set(titre);
    this.messageStatut.set(msg);
    this.alertClass.set('alert-warning');
  }

  private genererXmlExemple(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<catalogue depot="Principal">
  <article id="XML-001">
    <designation>Station d'accueil USB-C Thunderbolt</designation>
    <prixHT>189.50</prixHT>
    <tauxTVA>21</tauxTVA>
    <dateCreation>2026-05-12T08:30:00.000Z</dateCreation>
  </article>
  <article id="XML-002">
    <designation>Webcam 4K avec Microphone Stéréo</designation>
    <prixHT>125.00</prixHT>
    <tauxTVA>21</tauxTVA>
    <dateCreation>2026-06-18T14:00:00.000Z</dateCreation>
  </article>
</catalogue>`;
  }
}
```

---

### 6.5 Analyse du Fonctionnement & Mécanique Interne

Prenons le temps de disséquer ce qui s'opère dans cette démonstration sous le capot :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MÉCANIQUE DE L'ATELIER DATAVAULT                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Au chargement :                                                     │
│    ➔ VaultStoreService instancie 4 objets 'Article' via leur           │
│      constructeur complet.                                             │
│    ➔ Leurs prototypes sont attachés à Article.prototype.               │
│                                                                        │
│ 2. Clic sur « Sérialiser l'état en JSON » :                            │
│    ➔ JSON.stringify() parcourt le tableau d'articles.                  │
│    ➔ Pour chaque objet, le moteur invoque sa méthode .toJSON().        │
│    ➔ Les champs privés sont projetés vers un objet pur ArticleDTO.     │
│    ➔ Le résultat textuel indenté apparaît dans le <textarea>.          │
│                                                                        │
│ 3. Clic sur « Démontrer le piège 'as Article' » :                      │
│    ➔ JSON.parse() reconstruit de simples objets génériques.            │
│    ➔ Le cast 'as Article' n'ajoute AUCUNE méthode au runtime !         │
│    ➔ Le diagnostic affiche en rouge : premier.calculerPrixTTC is not a │
│      function, prouvant la défaillance à tous les étudiants !          │
│                                                                        │
│ 4. Clic sur « Désérialiser & Réhydrater dans la RAM » :                │
│    ➔ SerializationService valide le contrat ArticleDTO.               │
│    ➔ Pour chaque élément, Article.fromDTO() est exécuté.               │
│    ➔ Le constructeur vérifie les invariants (prix >= 0, etc.).         │
│    ➔ La Date ISO est reconvertie en véritable objet 'new Date()'.      │
│    ➔ Le tableau réactif est mis à jour (set) dans le Store.            │
│    ➔ Les indicateurs réactifs (totalTTC) se recalculent instantanément │
│      grâce aux signaux sans aucun rechargement de page !               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Synthèse : ce qu'il faut retenir absolument

### Tableau récapitulatif des mécanismes et syntaxes clés

| Mécanisme / Syntaxe | Rôle technique et conceptuel | Avantage architectural clé en POO |
| :--- | :--- | :--- |
| **`JSON.stringify(val, replacer, space)`** | Transforme un graphe d'objets en chaîne de caractères linéaire. | Extraction des données hors de la RAM vers un support universel. |
| **`toJSON()` sur une classe** | Méthode magique définissant la représentation sérialisable de l'objet. | Respect strict de l'encapsulation (Séance 05) et masquage des secrets. |
| **`JSON.parse(str, reviver)`** | Parse une chaîne JSON en structures JavaScript basiques (retourne `any`). | Point d'entrée de la désérialisation. Attention : type dangereux sans contrôle ! |
| **Paramètre `reviver`** | Fonction d'interception unitaire exécutée lors du parsing. | Idéal pour convertir automatiquement les chaînes ISO en objets `Date`. |
| **`DOMParser` (navigateur)** | Parse un flux XML textuel en arbre documentaire W3C navigable. | Permet d'extraire des données de flux patrimoniaux avec `querySelector()`. |
| **Patron DTO (`interface`)** | Modélise la structure brute des données sérialisables. | Découple le format de stockage externe du modèle métier interne. |
| **Fabrique `Article.fromDTO()`** | Méthode statique reconstruisant l'objet métier à partir du DTO. | Revalide les invariants, restaure le prototype et attache les méthodes. |
| **`instance is MonType`** | Garde de type (*Type Guard*) personnalisé en TypeScript. | Sécurise le typage en éliminant les risques du type `any` à l'entrée. |

---

### La Règle d'Or de la Séance 16

> **« La sérialisation déshydrate vos objets en simples séquences de données inertes ; ne comptez jamais sur `JSON.parse` pour leur redonner vie par magie. En Orienté Objet, la réhydratation est un acte architectural explicite : seule une méthode de fabrique (`fromDTO`) est habilitée à restaurer le prototype, réattacher les méthodes et certifier la protection absolue de vos invariants métier. »**

---

## Clôture de la séance & Pont vers la Séance 17

Toutes nos félicitations pour avoir franchi cette première étape fondamentale du **Bloc D** !

Vous avez désormais acquis une vision lucide et rigoureuse de la frontière entre la mémoire vive et la persistance :
- Vous savez discerner les forces et les faiblesses respectives de **JSON** et de **XML**.
- Vous maîtrisez les paramètres avancés de `JSON.stringify()` et `JSON.parse()`.
- Vous savez déjouer les pièges mortels de la perte de prototype, des méthodes évaporées et du typage `any`.
- Vous maîtrisez la séparation indispensable entre **DTO** et **Entité Métier**.

Jusqu'ici, nos données sérialisées sont restées cantonnées à des chaînes de caractères locales générées et consommées sur la même machine.

### Aperçu de la Séance 17 : Consommer une API REST avec `httpResource()`
Dans la prochaine séance, nous allons propulser ces flux JSON à travers le monde grâce au réseau Internet :
- **Architectures REST & Protocole HTTP** : Les verbes standards (`GET`, `POST`, `PUT`, `DELETE`), les codes de statut (`200 OK`, `404 Not Found`, `500 Internal Error`).
- **L'Appel Synchrone vs Asynchrone** : Pourquoi le navigateur web interdit les appels réseau bloquants, comment fonctionne l'Event Loop et quand employer des promesses.
- **La Révolution `httpResource()` d'Angular 22** : Comment consommer une API REST externe directement sous forme de signaux réactifs (`status()`, `value()`, `error()`, `isLoading()`), sans aucune ligne de code RxJS explicite !
