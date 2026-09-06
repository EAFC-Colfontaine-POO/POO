
# Séance 1 — Introduction générale à la Programmation Orientée Objet

## Objectifs pédagogiques

À l'issue de cette première séance, l'étudiant sera capable de :

1. Comprendre les limites fondamentales du paradigme procédural face au passage à l'échelle des applications informatiques.
2. Définir et manipuler les concepts de base de la Programmation Orientée Objet (POO) : classe, objet/instance, attribut et méthode.
3. Maîtriser le flux de travail et les commandes fondamentales du système de gestion de version **Git** (`init`, `clone`, `status`, `diff`, `log`, `add`, `commit`, `push`, `fetch`, `pull`, `branch`, `checkout`/`switch`, `merge`, `restore`).
4. Installer et configurer un environnement de développement professionnel complet sous Linux (Ubuntu) ou Windows : Node.js, Angular CLI et l'IDE **WebStorm**.
5. Importer, configurer, compiler et exécuter un projet Angular dans l'IDE pour accéder au serveur de développement (`http://localhost:4200/`).
6. Modéliser des entités métiers simples sous forme de classes autonomes sans relations d'héritage ou d'encapsulation complexe.

---

## 1. Pourquoi la Programmation Orientée Objet ?

### 1.1. Le paradigme procédural et ses limites

La programmation procédurale repose sur la séparation stricte entre les **données** (stockées dans des variables ou des structures de données) et les **traitements** (exécutés par des fonctions ou des procédures). Dans les systèmes de petite taille, cette approche est simple et directe. Toutefois, dès que la taille ou la complexité de la base de code augmente, ce paradigme révèle des fragilités structurelles majeures.

Considérons une application de gestion bancaire écrite selon une approche procédurale en TypeScript :

```typescript
// Données dissociées
let compte1Titulaire = "Alice Dupont";
let compte1Solde = 1500;

let compte2Titulaire = "Bob Martin";
let compte2Solde = 500;

// Fonctions opérant sur des variables globales ou transmises en arguments
function deposer(soldeActuel: number, montant: number): number {
    return soldeActuel + montant;
}

function retirer(soldeActuel: number, montant: number): number {
    if (montant > soldeActuel) {
        console.log("Solde insuffisant");
        return soldeActuel;
    }
    return soldeActuel - montant;
}

// Utilisation
compte1Solde = deposer(compte1Solde, 200);
compte2Solde = retirer(compte2Solde, 100);
````

### 1.2. Problèmes identifiés dans l'approche procédurale

1. **Découplage entre données et fonctions** : Les fonctions `deposer` et `retirer` nécessitent que le développeur passe explicitement le bon solde en argument. Rien ne garantit qu'une fonction n'agisse pas accidentellement sur la mauvaise variable.
    
2. **Absence de protection des données** : Les variables de solde sont librement accessibles et modifiables de n'importe où dans le programme. Une instruction telle que `compte1Solde = -999999` est techniquement possible et contourne toute validation logique.
    
3. **Difficulté de passage à l'échelle** : Si l'application doit gérer des milliers de comptes, la multiplication manuelle des variables ou le recours à des tableaux parallèles devient rapidement ingérable et source d'erreurs d'indexation.
    
4. **Maintenance complexe** : Si la structure d'un compte évolue (ajout d'une devise ou d'un découvert autorisé), l'ensemble des fonctions procédurales disséminées dans l'application doit être modifié.
    

### 1.3. L'apport de la Programmation Orientée Objet

La Programmation Orientée Objet (POO) propose un changement de paradigme : regrouper au sein d'une même structure logicielle les **données** (l'état) et les **traitements** qui s'y appliquent (le comportement).

Au lieu de considérer un programme comme une suite d'instructions agissant sur des données séparées, la POO conçoit le logiciel comme une collection d'**objets** autonomes qui interagissent entre eux.

## 2. Vocabulaire et concepts fondamentaux

### 2.1. La Classe

Une **classe** est la description abstraite, le plan ou le « moule » à partir duquel des objets seront créés. Elle définit la structure interne et les comportements communs à une catégorie d'entités du monde réel ou conceptuel.

Une classe regroupe :

- Des **attributs** (ou propriétés) : les variables décrivant l'état des objets.
- Des **méthodes** : les fonctions décrivant ce que les objets peuvent faire ou subir.

Syntaxe de base d'une classe en TypeScript :

```TypeScript
class CompteBancaire {
    // Attributs
    titulaire: string;
    solde: number;

    // Constructeur : méthode spéciale d'initialisation
    constructor(titulaireInitial: string, soldeInitial: number) {
        this.titulaire = titulaireInitial;
        this.solde = soldeInitial;
    }

    // Méthodes
    deposer(montant: number): void {
        this.solde = this.solde + montant;
    }

    retirer(montant: number): void {
        if (montant <= this.solde) {
            this.solde = this.solde - montant;
        } else {
            console.log("Solde insuffisant pour " + this.titulaire);
        }
    }

    afficherResume(): void {
        console.log("Compte de " + this.titulaire + " - Solde : " + this.solde + " €");
    }
}
```

### 2.2. L'Objet et l'Instance

Un **objet** (ou une **instance**) est la concrétisation en mémoire d'une classe. Si la classe est le plan d'une maison, l'objet est la maison réellement construite sur un terrain.

L'opération qui permet de créer un objet à partir d'une classe s'appelle l'**instanciation**. Elle s'effectue au moyen du mot-clé `new`, qui fait appel au **constructeur** de la classe.

```TypeScript
// Instanciation de deux objets distincts
let compteAlice = new CompteBancaire("Alice Dupont", 1500);
let compteBob = new CompteBancaire("Bob Martin", 500);

// Interaction avec les objets via leurs méthodes
compteAlice.deposer(200);
compteBob.retirer(100);

compteAlice.afficherResume(); // Affiche : Compte de Alice Dupont - Solde : 1700 €
compteBob.afficherResume();   // Affiche : Compte de Bob Martin - Solde : 400 €
```

### 2.3. Synthèse du vocabulaire

|**Terme**|**Définition**|**Exemple analogique**|
|---|---|---|
|**Classe**|Moule ou plan conceptuel définissant attributs et méthodes.|Le plan d'architecte d'un véhicule.|
|**Objet / Instance**|Entité réelle créée en mémoire à partir d'une classe.|Une voiture physique spécifique sortie d'usine.|
|**Attribut / Propriété**|Variable rattachée à une instance, représentant son état.|La couleur, la vitesse actuelle, le kilométrage.|
|**Méthode**|Fonction rattachée à une instance, agissant sur son état.|Accélérer(), freiner(), allumerLesPhares().|
|**Constructeur**|Méthode spéciale exécutée au moment de l'instanciation (`new`).|La chaîne de montage initialisant les équipements.|

## 3. Gestion de version professionnelle avec Git

## 3.1. Qu'est-ce que Git ?

Git est un **système de contrôle de versions distribué** (DVCS — Distributed Version Control System). Il permet de suivre l'historique complet des modifications apportées à des fichiers au fil du temps, de collaborer à plusieurs sur un même projet sans se marcher dessus, et de revenir à n'importe quel état passé du code.

Contrairement aux anciens systèmes centralisés (comme SVN), chaque développeur possède une copie complète du dépôt en local — y compris tout l'historique. Pas besoin d'une connexion permanente au serveur.

---

## 3.2. L'inventeur : Linus Torvalds

Git a été créé en **avril 2005** par **Linus Torvalds**, le créateur du noyau Linux. La raison : l'équipe Linux utilisait un outil propriétaire appelé BitKeeper, dont la licence gratuite a été révoquée. Plutôt que de se plier à un autre outil existant, Torvalds a décidé d'en créer un nouveau — en quelques semaines seulement.

Ses objectifs initiaux pour Git :

- Vitesse et performance
- Conception simple
- Support robuste du développement non-linéaire (branches)
- Entièrement distribué
- Capable de gérer de très grands projets comme le noyau Linux

Depuis, Git est maintenu par la communauté open source et est devenu le standard mondial.

---

## 3.3. Chronologie rapide

| Année | Événement |
|-------|-----------|
| 2005 | Création de Git par Linus Torvalds |
| 2008 | Lancement de GitHub — Git se démocratise massivement |
| 2011 | GitLab lancé (alternative open source à GitHub) |
| 2013 | Bitbucket adopte Git comme système principal |
| 2018 | Microsoft rachète GitHub pour 7,5 milliards de dollars |
| Aujourd'hui | Plus de 100 millions de dépôts sur GitHub, Git est utilisé par la quasi-totalité des équipes de développement dans le monde |

---

## 3.4. Utilité de Git

Git résout des problèmes concrets rencontrés par tout développeur ou équipe :

**Historique complet.** Chaque modification est enregistrée avec son auteur, sa date et un message explicatif. On peut comprendre pourquoi une ligne de code a été écrite des mois plus tard.

**Travail en parallèle.** Les branches permettent à plusieurs développeurs de travailler simultanément sur des fonctionnalités différentes sans se bloquer mutuellement.

**Retour en arrière.** Une mise à jour a cassé la production ? On peut revenir à la version précédente en quelques secondes.

**Collaboration à distance.** Des équipes réparties sur plusieurs continents travaillent sur le même projet grâce aux dépôts distants (GitHub, GitLab, etc.).

**Traçabilité et audit.** En entreprise, savoir qui a modifié quoi et quand est crucial — pour la sécurité, la conformité, et le débogage.

---

## 3.5. Concepts fondamentaux

**Repository (dépôt)** — le dossier versionné qui contient l'ensemble du projet et son historique. Il peut être local (sur votre machine) ou distant (hébergé sur GitHub, GitLab...).

**Commit** — un instantané de l'état du projet à un instant T. Chaque commit possède un identifiant unique (hash SHA-1), un auteur, une date et un message. C'est l'unité de base de Git.

**Branch (branche)** — une ligne de développement indépendante. La branche principale s'appelle `main` (ou `master` dans les anciens projets). On crée des branches pour développer des fonctionnalités ou corriger des bugs sans toucher au code stable.

**Merge** — fusionner une branche dans une autre. Git tente de combiner les modifications automatiquement ; en cas de conflit, le développeur tranche manuellement.

**Remote** — le dépôt distant hébergé sur un serveur. `origin` est le nom conventionnel du remote principal.

**Staging area (index)** — zone intermédiaire entre les fichiers modifiés et le prochain commit. On y place précisément ce qu'on veut inclure dans le commit suivant.

**Clone** — copie complète d'un dépôt distant en local, avec tout l'historique.

**Pull / Push** — `pull` récupère et intègre les modifications distantes ; `push` envoie les commits locaux vers le remote.

---

### 3.6. Guide complet des commandes fondamentales

#### A. Initialisation et configuration

- **Initialiser un nouveau dépôt local** :
```Bash
git init
```
- **Cloner un dépôt distant existant** :
```Bash
git clone [https://domaine.com/cours-oo/demo-seance-1.git](https://domaine.com/cours-oo/demo-seance-1.git)
```


#### B. Inspection et suivi des modifications

- **Consulter l'état de l'espace de travail et de l'index** :
```Bash
git status
```
- **Inspecter les différences non encore indexées** :
```Bash
git diff
```
- **Consulter l'historique des commits** :
```Bash
git log --oneline --graph --all
```

#### C. Enregistrement des modifications

- **Placer des fichiers modifiés dans l'index (Staging Area)** :
```Bash
git add nom_du_fichier.ts
# Pour indexer l'ensemble des fichiers modifiés du répertoire courant :
git add .
```
- **Valider les modifications de l'index dans le dépôt local** :
```Bash
git commit -m "Ajout de la classe Article et de sa méthode de calcul TTC"
```
    
- **Annuler les modifications locales d'un fichier (retour au dernier commit)** :
```Bash
git restore nom_du_fichier.ts
```

#### D. Synchronisation avec le dépôt distant

- **Récupérer les métadonnées distantes sans modifier les fichiers locaux** :
```Bash
git fetch origin
```
    
- **Récupérer et fusionner directement les modifications distantes** :
```Bash
git pull origin main
```
_Note : `git pull` équivaut à exécuter `git fetch` suivi de `git merge`._
    
- **Envoyer les commits locaux vers le dépôt distant** :
```Bash
git push origin main
```

#### E. Gestion des branches et fusions

- **Lister les branches locales** :
```Bash
git branch
```
    
- **Créer une nouvelle branche** :
```Bash
git branch nom-de-branche
```
- **Bascule de branche (`checkout` ou `switch`)** :
```Bash
# Commande moderne recommandée :
git switch nom-de-branche
# Commande classique équivalente :
git checkout nom-de-branche
```
- **Créer et basculer sur une nouvelle branche en une seule commande** :
```Bash
git switch -c nouvelle-fonctionnalite
# Equivalent classique :
git checkout -b nouvelle-fonctionnalite
```
- **Fusionner une branche dans la branche courante** :
```Bash
git switch main
git merge nouvelle-fonctionnalite
```
## 4. Installation de l'environnement de développement et lancement d'un projet Angular

Afin de développer et d'exécuter des applications Web basées sur TypeScript et Angular, un environnement outillé complet doit être installé.

### 4.1. Étape 1 : Installation du runtime Node.js et de NPM

Node.js est l'environnement d'exécution JavaScript côté serveur nécessaire pour faire tourner les outils de build. NPM (Node Package Manager) est le gestionnaire de paquets officiel fourni avec Node.js.

- **Sous Windows** :
    
    1. Télécharger l'installateur officiel `.msi` de Node.js en version **LTS** (Long Term Support) sur `https://nodejs.org/`.
    2. Exécuter l'installateur en conservant les options par défaut (incluant l'ajout de Node au `PATH`).
- **Sous Linux (Ubuntu / Debian)** :
    
    Exécuter les commandes suivantes dans le terminal pour installer la version LTS courante via le dépôt officiel NodeSource :
    
```Bash
curl -fsSL [https://deb.nodesource.com/setup_22.x](https://deb.nodesource.com/setup_22.x) | sudo -E bash -
sudo apt-get install -y nodejs
```
    
- **Vérification de l'installation dans le terminal** :
    
```Bash
node -v  # Doit afficher une version v20.x.x ou v22.x.x
npm -v   # Doit afficher une version v10.x.x ou supérieure
```
    

### 4.2. Étape 2 : Installation de l'Angular CLI

L'Angular CLI (Command Line Interface) est l'outil officiel en ligne de commande permettant de générer, construire et faire tourner des applications Angular.

- **Installation globale via NPM** :
```Bash
npm install -g @angular/cli
```
    
- **Vérification** :
```Bash
ng version
```

### 4.3. Étape 3 : Installation et configuration de WebStorm

WebStorm (JetBrains) est l'IDE de référence pour le développement TypeScript et Angular.

1. **Téléchargement** : Récupérer l'installateur WebStorm sur le site de JetBrains ou via l'application **JetBrains Toolbox**.
    
2. **Licence académique** : Se connecter avec son compte étudiant pour activer la licence complète.
    
3. **Configuration du Terminal intégré dans WebStorm** :
    
    - Aller dans `Settings` (Windows: `Ctrl+Alt+S`, Linux: `Ctrl+Alt+S`) > `Tools` > `Terminal`.
        
    - Vérifier que le shell configuré est `Bash` (Linux) ou `Git Bash` / `PowerShell` (Windows).
        
4. **Configuration du runtime Node.js dans WebStorm** :
    
    - Naviguer vers `Settings` > `Languages & Frameworks` > `Node.js`.
        
    - S'assurer que le chemin vers l'exécutable Node.js est détecté automatiquement.
        

### 4.4. Étape 4 : De l'ouverture au lancement du projet Angular

Pour travailler sur le projet d'illustration ou de démonstration du cours :

1. **Clonage du projet depuis le terminal** :
```Bash
git clone [https://github.com/enseignement/oo-seance-01-demo.git](https://github.com/enseignement/oo-seance-01-demo.git)
cd oo-seance-01-demo
```
    
2. **Ouverture dans WebStorm** :
    
    Lancer WebStorm, sélectionner `File` > `Open...`, puis choisir le dossier `oo-seance-01-demo`.
    
3. **Installation des dépendances du projet** :
    
    Ouvrir le terminal intégré à WebStorm (`Alt + F12`) et exécuter :
    
```Bash
npm install
```
    
Cette commande lit le fichier `package.json` et télécharge l'intégralité des bibliothèques requises (dont Angular 22) dans le dossier `node_modules/`.
    
4. **Démarrage du serveur de développement Angular** :
    
    Dans le terminal intégré de WebStorm, exécuter :
```Bash
ng serve
# Ou en utilisant le script défini dans package.json :
npm start
```
    
L'Angular CLI compile le projet en mémoire et démarre un serveur Web local.
    
5. **Accès à l'application dans le navigateur** :
    
    Ouvrir un navigateur Web à l'adresse suivante :
    
```Plaintext
http://localhost:4200/
```
    
Toute modification enregistrée dans les fichiers TypeScript ou HTML du projet réexécute automatiquement une compilation à chaud (_Hot Reloading_) et rafraîchit la page web.
    

