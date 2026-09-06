# Support de cours : Introduction à Git & au Versioning Distribué

**Public cible :** Développeurs débutants à intermédiaires  
**Prérequis :** Notions de base en ligne de commande (terminal)  
**Objectif pédagogique :** Comprendre l'architecture distribuée de Git, maîtriser le cycle de vie des modifications, manipuler les branches avec assurance, résoudre les conflits et adopter les standards de collaboration en entreprise (conventions de commit, workflows, CI/CD).

---

## Table des matières

1. [Introduction au contrôle de versions](#1-introduction-au-contrôle-de-versions)
   - 1.1 Qu'est-ce qu'un VCS / DVCS ?
   - 1.2 Centralisé vs Distribué
   - 1.3 Pourquoi Git est devenu le standard
2. [Genèse et histoire de Git](#2-genèse-et-histoire-de-git)
   - 2.1 Le contexte BitKeeper (Avril 2005)
   - 2.2 Les objectifs architecturaux de Linus Torvalds
   - 2.3 Chronologie de 2005 à nos jours
3. [Architecture et modèle interne](#3-architecture-et-modèle-interne)
   - 3.1 Les quatre zones logiques de Git
   - 3.2 Objets Git et hachage cryptographique (SHA)
   - 3.3 HEAD, Commits, Branches et Tags
4. [Installation et configuration](#4-installation-et-configuration)
   - 4.1 Procédure par système d'exploitation
   - 4.2 Configuration globale essentielle
   - 4.3 Authentification sécurisée par clé SSH (Ed25519)
5. [Guide complet des commandes fondamentales](#5-guide-complet-des-commandes-fondamentales)
   - 5.1 Initialiser et inspecter un projet
   - 5.2 Préparer et valider des changements
   - 5.3 Mettre en attente : le remisage (`git stash`)
   - 5.4 Gérer les branches avec `git switch`
   - 5.5 Synchronisation distante (`push`, `pull`, `fetch`)
   - 5.6 Annulations et corrections sûres (`revert`, `restore`, `amend`)
6. [Stratégies de branches (Workflows)](#6-stratégies-de-branches-workflows)
   - 6.1 GitHub Flow
   - 6.2 Git Flow
   - 6.3 Trunk-Based Development
   - 6.4 Tableau comparatif
7. [Git en entreprise & Bonnes pratiques DevOps](#7-git-en-entreprise--bonnes-pratiques-devops)
   - 7.1 Pull Requests et Revue de code
   - 7.2 Convention de commits (Conventional Commits)
   - 7.3 Intégration Continue (CI/CD) et GitOps
   - 7.4 Bonnes pratiques d'hygiène de dépôt (.gitignore, secrets)
8. [Atelier pratique guidé (TP pas à pas)](#8-atelier-pratique-guidé-tp-pas-à-pas)
   - Étape 1 : Initialisation du dépôt
   - Étape 2 : Cycle add / commit
   - Étape 3 : Branche de fonctionnalité
   - Étape 4 : Fusion (Merge)
   - Étape 5 : Simulation et résolution d'un conflit
9. [Aide-mémoire (Cheat Sheet) & Ressources](#9-aide-mémoire-cheat-sheet--ressources)
   - 9.1 Fiche réflexe des commandes quotidiennes
   - 9.2 Bibliographie et simulateurs interactifs

---

## 1. Introduction au contrôle de versions

### 1.1 Qu'est-ce qu'un VCS / DVCS ?
Un **VCS** (*Version Control System* ou système de contrôle de versions) est un logiciel conçu pour enregistrer l'évolution d'un ensemble de fichiers au fil du temps. Il permet de :
- Retrouver l'état exact d'un projet à une date ou un jalon donné.
- Comparer les modifications introduites entre deux versions.
- Identifier précisément l'auteur, la date et la justification de chaque ligne de code modifiée.
- Travailler en parallèle à plusieurs développeurs sur une même base de code sans écraser le travail d'autrui.

Git appartient à la catégorie des **DVCS** (*Distributed Version Control System* ou système distribué).

### 1.2 Centralisé (SVN) vs Distribué (Git)

Dans un système centralisé traditionnel (comme Subversion ou CVS), l'historique réside exclusivement sur un serveur central :

```
Système Centralisé (SVN) :
┌──────────────┐
│ Serveur SVN  │ <--- Contient l'unique base d'historique
└──────┬───────┘
       │  (Connexion requise pour chaque opération)
 ┌─────┴─────┐
 ▼           ▼
Client A    Client B
(Copie de   (Copie de
 travail)    travail)
```

Dans un système distribué comme Git, **chaque copie locale est un clone autonome et complet** de la base de données :

```
Système Distribué (Git) :
               ┌──────────────────────┐
               │ Dépôt Distant        │
               │ (GitHub / GitLab)    │
               └──────────┬───────────┘
                          │ push / pull
            ┌─────────────┴─────────────┐
            ▼                           ▼
 ┌──────────────────────┐    ┌──────────────────────┐
 │ Dépôt Local A        │    │ Dépôt Local B        │
 │ • Historique complet │    │ • Historique complet │
 │ • Arbre de commits   │    │ • Arbre de commits   │
 │ • Branches locales   │    │ • Branches locales   │
 └──────────────────────┘    └──────────────────────┘
```

### 1.3 Pourquoi Git est devenu le standard
1. **Autonomie et travail déconnecté :** Toutes les opérations courantes (`commit`, `log`, `diff`, création de branches) s'exécutent en local sans latence réseau ni besoin de connexion Internet.
2. **Performance exceptionnelle :** La structure interne basée sur des instantanés compressés rend Git ultra-rapide, même sur des dépôts de plusieurs dizaines de gigaoctets.
3. **Résilience et tolérance aux pannes :** Chaque poste de travail constitue une sauvegarde intégrale du projet. Si le serveur distant est corrompu, n'importe quel dépôt local permet de le reconstruire.
4. **Branches légères :** Créer, fusionner ou supprimer une branche prend quelques millisecondes car une branche n'est qu'un pointeur de 41 octets vers un commit.

---

## 2. Genèse et histoire de Git

### 2.1 Le contexte BitKeeper (Avril 2005)
De 2002 à 2005, le développement du noyau Linux utilisait un logiciel propriétaire nommé **BitKeeper**. Bien que propriétaire, une licence gratuite était accordée aux développeurs du kernel.

En avril 2005, suite à des tentatives d'ingénierie inverse sur le protocole BitKeeper par un développeur communautaire (Andrew Tridgell), la société éditrice révoque l'accès gracieux de la communauté Linux.

Ne trouvant aucun outil existant capable de répondre aux contraintes du noyau Linux (des milliers de patchs par semaine, une collaboration mondiale et asynchrone), **Linus Torvalds** décide de concevoir son propre système en s'isolant pendant quelques semaines. Le premier commit du code source de Git est enregistré le 7 avril 2005.

### 2.2 Les objectifs architecturaux de Linus Torvalds
- **Vitesse :** Prendre moins d'une seconde pour appliquer un patch complexe.
- **Conception non-linéaire :** Facilité déconcertante à créer des branches divergentes et à les fusionner.
- **Intégrité cryptographique :** Impossibilité totale de modifier silencieusement un commit ou un fichier sans invalider la chaîne de confiance (garantie par hachage SHA).
- **Simplicité du cœur :** Une boîte à outils modulaire basée sur des briques Unix combinables.

### 2.3 Chronologie de 2005 à nos jours

| Période | Événement marquant |
| :--- | :--- |
| **Avril 2005** | Création de Git par Linus Torvalds ; prise en charge du noyau Linux. |
| **Juillet 2005** | Junio Hamano devient le mainteneur principal du projet Git. |
| **Février 2008** | Lancement public de **GitHub** (fondé par Tom Preston-Werner, Chris Wanstrath et PJ Hyett). |
| **Octobre 2011** | Création de **GitLab**, apportant une solution alternative complète et open source. |
| **2013** | Bitbucket (Atlassian) adopte massivement Git au détriment de Mercurial. |
| **Juin 2018** | Microsoft rachète GitHub pour 7,5 milliards de dollars. |
| **Aujourd'hui** | Standard absolu de l'industrie logicielle, propulsant plus de 100 millions de dépôts. |

---

## 3. Architecture et modèle interne

### 3.1 Les quatre zones logiques de Git

Comprendre Git nécessite de visualiser la circulation de l'information entre quatre espaces distincts :

```
[ Répertoire de Travail ]  -->  git add  -->  [ Staging Area (Index) ]
  (Working Directory)                           (Zone de transit)
          ▲                                             │
          │ git checkout / restore                      │ git commit
          │                                             ▼
[ Dépôt Distant (Remote) ] <--  git push --  [ Dépôt Local (.git) ]
  (GitHub / GitLab)        --  git pull -->     (Base d'historique)
```

1. **Working Directory (Répertoire de travail) :** Le dossier physique sur votre machine contenant vos fichiers réels, éditables dans votre IDE.
2. **Staging Area (Zone de transit / Index) :** Espace intermédiaire invisible où vous préparez avec précision les morceaux de code qui constitueront le prochain commit.
3. **Local Repository (Dépôt local) :** Le répertoire caché `.git/` contenant la base d'objets, l'historique complet et les pointeurs de branches.
4. **Remote Repository (Dépôt distant) :** Dépôt hébergé sur une plateforme cloud ou un serveur d'entreprise (généralement nommé `origin`).

### 3.2 Objets Git et hachage cryptographique (SHA)
Git fonctionne comme un système de fichiers adressable par contenu. Chaque élément stocké est un objet identifié par une empreinte unique (hash SHA-1 de 40 caractères hexadécimaux ou SHA-256) :
- **Blob (*Binary Large Object*) :** Stocke le contenu brut d'un fichier (sans son nom ni ses métadonnées).
- **Tree :** Représente un répertoire. Il associe des noms de fichiers et des permissions à des Blobs ou à d'autres Trees.
- **Commit :** Pointeur vers un Tree racine, accompagné de métadonnées (auteur, commiteur, date, message) et du hash du (ou des) commit(s) parent(s).
- **Tag annoté :** Référence permanente vers un commit donné, avec un message et une signature optionnelle.

### 3.3 HEAD, Commits, Branches et Tags
- **Commit :** Un instantané immuable du projet à un instant T.
- **Branche :** Un simple fichier texte contenant le hash du dernier commit de cette ligne. Créer une branche ne consomme aucun espace disque supplémentaire.
- **HEAD :** Un pointeur spécial indiquant sur quelle branche (ou sur quel commit précis) votre répertoire de travail est positionné.
- **Tag :** Une étiquette fixe pointant vers un commit (ex: `v1.0.0`), idéale pour marquer les versions publiées.

---

## 4. Installation et configuration

### 4.1 Procédure par système d'exploitation

#### Linux (Debian / Ubuntu / Linux Mint)
```bash
sudo apt update
sudo apt install -y git
```

#### Linux (Fedora / RHEL)
```bash
sudo dnf install -y git
```

#### Linux (Arch Linux)
```bash
sudo pacman -S git
```

#### Windows
- Télécharger l'installeur officiel sur [git-scm.com](https://git-scm.com).
- Ou installer via le terminal PowerShell :
```powershell
winget install --id Git.Git -e
```
*Recommandation : sélectionner l'intégration Git Bash et définir le nom de branche par défaut sur `main`.*

#### macOS
```bash
brew install git
```

---

### 4.2 Configuration globale essentielle
Avant d'enregistrer le moindre commit, définissez l'identité qui apparaîtra dans l'historique :

```bash
# Identité du développeur
git config --global user.name "Prénom Nom"
git config --global user.email "prenom.nom@example.com"

# Branche initiale par défaut
git config --global init.defaultBranch main

# Gestion des fins de ligne (CRLF sous Windows vs LF sous Unix)
# Pour Windows :
git config --global core.autocrlf true
# Pour Linux / macOS :
git config --global core.autocrlf input

# Éditeur de texte par défaut (exemple avec VS Code)
git config --global core.editor "code --wait"

# Vérifier la configuration active
git config --list --show-origin
```

---

### 4.3 Authentification sécurisée par clé SSH (Ed25519)
Pour communiquer avec GitHub, GitLab ou Bitbucket sans saisir d'identifiants à chaque opération :

```bash
# 1. Générer une paire de clés Ed25519 moderne
ssh-keygen -t ed25519 -C "prenom.nom@example.com"

# 2. Démarrer l'agent SSH en arrière-plan
eval "$(ssh-agent -s)"

# 3. Ajouter la clé privée à l'agent
ssh-add ~/.ssh/id_ed25519

# 4. Afficher la clé publique pour la copier
cat ~/.ssh/id_ed25519.pub
```

*Copiez la chaîne affichée et collez-la dans vos paramètres GitHub/GitLab sous : **Settings > SSH and GPG Keys > New SSH Key**.*

Pour tester la liaison :
```bash
ssh -T git@github.com
```

---

## 5. Guide complet des commandes fondamentales

### 5.1 Initialiser et inspecter un projet

```bash
# Créer un nouveau dépôt Git dans le dossier courant
git init

# Cloner un dépôt distant via SSH
git clone git@github.com:organisation/mon-projet.git

# Examiner l'état de l'index et des fichiers modifiés
git status

# Historique lisible sous forme d'arbre graphique
git log --oneline --graph --decorate --all

# Voir les modifications non encore indexées
git diff

# Voir les modifications prêtes à être commitées (staged)
git diff --staged
```

---

### 5.2 Préparer et valider des changements

```bash
# Indexer un fichier spécifique
git add src/app.js

# Indexer tous les fichiers modifiés et nouveaux du répertoire
git add .

# Enregistrer un commit avec un message descriptif
git commit -m "feat(auth): ajouter la vérification du mot de passe"

# Modifier le dernier commit (message ou ajout de fichier oublié)
# ATTENTION : à n'utiliser que sur des commits locaux non partagés !
git commit --amend -m "feat(auth): ajouter la vérification robuste du mot de passe"
```

---

### 5.3 Mettre en attente : le remisage (`git stash`)
Le *stash* permet de mettre de côté des modifications non terminées afin d'obtenir un espace de travail propre sans créer de commit brouillon.

```bash
# Sauvegarder le travail en cours et revenir à l'état HEAD
git stash save "WIP: formulaire en cours"

# Lister les remises existantes
git stash list

# Récupérer la dernière remise et la supprimer de la pile
git stash pop

# Abandonner la dernière remise sans l'appliquer
git stash drop
```

---

### 5.4 Gérer les branches avec `git switch`
> 💡 *Note :* Depuis la version 2.23, `git switch` et `git restore` remplacent l'ancienne commande polyvalente `git checkout` pour une meilleure clarté d'utilisation.

```bash
# Créer une nouvelle branche et basculer dessus
git switch -c feature/connexion-sso

# Basculer sur une branche existante
git switch main

# Lister les branches locales et distantes
git branch -a

# Fusionner la branche feature dans la branche courante
git merge feature/connexion-sso

# Supprimer une branche locale fusionnée
git branch -d feature/connexion-sso

# Forcer la suppression d'une branche non fusionnée
git branch -D feature/ancienne-idee
```

---

### 5.5 Synchronisation distante (`push`, `pull`, `fetch`)

```bash
# Récupérer les métadonnées distantes sans modifier les fichiers locaux
git fetch origin

# Récupérer et intégrer les modifications distantes dans la branche active
git pull origin main

# Publier une nouvelle branche locale sur le remote et établir le suivi (upstream)
git push -u origin feature/connexion-sso

# Pousser les commits ultérieurs
git push
```

---

### 5.6 Annulations et corrections sûres

```bash
# Annuler les modifications non enregistrées d'un fichier physique
git restore chemin/vers/fichier.js

# Désindexer un fichier (le retirer du staging sans le supprimer du disque)
git restore --staged chemin/vers/fichier.js

# Annuler un commit public de manière saine (crée un commit inverse)
git revert abc1234
```

---

## 6. Stratégies de branches (Workflows)

La collaboration en équipe requiert une discipline stricte d'organisation des branches.

### 6.1 GitHub Flow
Idéal pour les architectures web modernes avec déploiement continu.

```
main     ──────●──────────────●──────────────● (Toujours en production)
                \            /
feature          ●───●─── PR 
```

- La branche `main` est toujours stable et déployable immédiatement.
- Pour chaque ticket ou fonctionnalité, une branche descriptive est créée depuis `main` (ex: `feature/panier-achats`).
- Les commits y sont réguliers.
- Dès que le travail est prêt, une **Pull Request** est ouverte pour revue et validation des tests automatisés.
- Une fois approuvée, la branche est fusionnée dans `main` et déployée.

### 6.2 Git Flow
Recommandé pour les logiciels embarqués, les applications distribuées par versions ou les cycles de livraisons planifiés.

```
main      ●─────────────────────────────────────● (Releases officielles)
           \                                   /
release     \                         ●───●───●
             \                       /
develop       ●──────●──────●───────● (Intégration continue)
                      \    /
feature                ●──● (Développement unitaire)
```

- **`main` :** Ne contient que les versions stables livrées (marquées par des tags `v1.0.0`, `v1.1.0`).
- **`develop` :** Branche centrale recevant les fonctionnalités terminées.
- **`feature/*` :** Branches temporaires partant de `develop` et y revenant.
- **`release/*` :** Branches de préparation de version (stabilisation, corrections mineures).
- **`hotfix/*` :** Branches d'urgence dérivées directement de `main` pour corriger un bug critique en production.

### 6.3 Trunk-Based Development
Méthode privilégiée par les géants de la tech (Google, Meta) favorisant une intégration ultra-rapide.

```
main (Trunk) ──●───●───●───●───●───●───●───●───● (Déploiements multiples par jour)
```

- Tous les développeurs poussent directement ou via des branches très courtes (moins de 24h) sur le tronc commun.
- Les fonctionnalités non terminées sont masquées par des bascules logiques (*Feature Flags* ou *Feature Toggles*).

### 6.4 Tableau comparatif

| Critère | GitHub Flow | Git Flow | Trunk-Based |
| :--- | :--- | :--- | :--- |
| **Complexité** | Faible | Élevée | Moyenne |
| **Cycle de release** | Continu (plusieurs fois/jour) | Planifié (mensuel / trimestriel) | Continu |
| **Durée de vie d'une branche** | 1 à 3 jours | Quelques jours à plusieurs semaines | Quelques heures (< 24h) |
| **Taille de l'équipe** | Petites à moyennes équipes | Grandes équipes / Projets legacy | Équipes seniors et outillées |

---

## 7. Git en entreprise & Bonnes pratiques DevOps

### 7.1 Pull Requests et Revue de code
Dans un environnement professionnel, aucun développeur ne pousse directement son code sur les branches protégées. Tout passage de code implique une **Pull Request (PR)** ou **Merge Request (MR)** :
- **Relecture humaine :** Un ou deux pairs analysent la lisibilité, l'architecture, la conformité aux exigences et la sécurité du code.
- **Relecture automatisée :** Exécution de la suite de tests, vérification de la couverture de code, analyse statique (linter, SonarQube).
- **Discussion ciblée :** Débat constructif directement attaché aux lignes de code modifiées.

### 7.2 Convention de commits (Conventional Commits)
L'adoption de messages de commit normalisés permet de générer automatiquement les versions logicielles (*Semantic Versioning*) et les journaux de modifications (*Changelogs*).

Format standard :
```
<type>(<portée optionnelle>): <description claire à l'impératif>

[corps détaillé optionnel]

[pied de page optionnel avec référence aux tickets]
```

#### Les types reconnus :
- **`feat` :** Nouvelle fonctionnalité (`feat(auth): implémenter la connexion par empreinte`)
- **`fix` :** Correction d'une anomalie (`fix(cart): corriger l'arrondi de la TVA`)
- **`docs` :** Modification exclusive de la documentation (`docs: mettre à jour le guide d'installation`)
- **`style` :** Formatage, points-virgules, indentation (sans impact sur la logique)
- **`refactor` :** Modification de code n'ajoutant ni fonctionnalité ni correction de bug
- **`perf` :** Amélioration des performances
- **`test` :** Ajout ou correction de tests unitaires/intégration
- **`chore` :** Tâche technique, mise à jour de dépendances (`chore(deps): update spring-boot to 3.3.0`)

---

### 7.3 Intégration Continue (CI/CD) et GitOps
- **CI (Continuous Integration) :** Dès qu'un push survient, un agent exécute la compilation et les tests. Si un seul test échoue, le statut de la PR devient rouge et bloque la fusion.
- **CD (Continuous Delivery / Deployment) :** Déploiement automatisé du binaire sur les environnements de staging ou de production.
- **GitOps :** Paradigme où l'infrastructure système (fichiers Kubernetes, Terraform, Docker Compose) est stockée dans un dépôt Git. Le dépôt Git fait office d'unique source de vérité (*Single Source of Truth*). Tout changement d'infrastructure s'opère par une Pull Request auditée.

---

### 7.4 Hygiène de dépôt : `.gitignore` et protection des secrets
Le fichier `.gitignore` placé à la racine du projet indique à Git quels fichiers ne doivent **jamais** être suivis.

Exemple de `.gitignore` type :
```gitignore
# Dépendances externes
node_modules/
vendor/
target/

# Variables d'environnement et secrets
.env
.env.local
*.pem
*.key

# Fichiers générés et logs
*.log
dist/
build/

# Fichiers de configuration IDE
.idea/
.vscode/
*.swp
.DS_Store
```

⚠️ **Règle d'or :** Ne commitez **JAMAIS** de secrets (clés d'API, mots de passe de bases de données, certificats). Une fois poussé sur un dépôt public, un secret est considéré comme compromis en moins de 60 secondes par des robots de veille automatisés.

---

## 8. Atelier pratique guidé (TP pas à pas)

### Objectif
Créer un projet local, effectuer des commits, manipuler des branches, fusionner et résoudre un conflit de merge.

---

### Étape 1 : Initialisation du dépôt
Ouvrez un terminal et exécutez :

```bash
# 1. Créer le répertoire et s'y déplacer
mkdir tp-git-initiation && cd tp-git-initiation

# 2. Initialiser le dépôt
git init

# 3. Créer un fichier de base
echo "# Plateforme Calculatrice" > README.md

# 4. Vérifier le statut
git status
```

---

### Étape 2 : Cycle add / commit

```bash
# Indexer le fichier
git add README.md

# Créer le premier commit
git commit -m "docs: initialiser le projet avec README"

# Consulter l'historique
git log --oneline
```

---

### Étape 3 : Travailler sur une branche de fonctionnalité

```bash
# Créer la branche feature/addition et s'y déplacer
git switch -c feature/addition

# Créer un fichier source
cat << 'EOF' > calcul.js
function addition(a, b) {
    return a + b;
}
EOF

# Indexer et commiter
git add calcul.js
git commit -m "feat(math): ajouter la fonction addition"
```

---

### Étape 4 : Fusionner dans la branche principale

```bash
# Revenir sur la branche principale
git switch main

# Fusionner la branche feature
git merge feature/addition

# Constater que le fichier calcul.js est désormais présent sur main
ls -l

# Supprimer la branche locale devenue superflue
git branch -d feature/addition
```

---

### Étape 5 : Simulation et résolution d'un conflit de fusion

1. **Modifier la fonction sur `main` :**
   ```bash
   cat << 'EOF' > calcul.js
   // Implémentation validée par l'équipe A
   function addition(a, b) {
       return a + b;
   }
   EOF
   git commit -am "refactor: documenter la fonction sur main"
   ```

2. **Créer une branche dissidente et modifier la même zone :**
   ```bash
   git switch -c feature/variante-calcul
   cat << 'EOF' > calcul.js
   // Implémentation alternative avec typage dynamique
   function addition(nombre1, nombre2) {
       return Number(nombre1) + Number(nombre2);
   }
   EOF
   git commit -am "feat(math): sécuriser la conversion numérique"
   ```

3. **Déclencher le conflit :**
   ```bash
   git switch main
   git merge feature/variante-calcul
   ```
   *Git bloque l'opération et affiche :*  
   `CONFLICT (content): Merge conflict in calcul.js`  
   `Automatic merge failed; fix conflicts and then commit the result.`

4. **Résoudre le conflit :**  
   Ouvrez `calcul.js`. Vous observez les séparateurs Git :
   ```javascript
   <<<<<<< HEAD
   // Implémentation validée par l'équipe A
   function addition(a, b) {
       return a + b;
   }
   =======
   // Implémentation alternative avec typage dynamique
   function addition(nombre1, nombre2) {
       return Number(nombre1) + Number(nombre2);
   }
   >>>>>>> feature/variante-calcul
   ```
   Éditez le fichier pour harmoniser la solution (en supprimant tous les marqueurs `<<<<<<<`, `=======`, `>>>>>>>`) :
   ```javascript
   // Implémentation harmonisée
   function addition(a, b) {
       return Number(a) + Number(b);
   }
   ```

5. **Finaliser la fusion :**
   ```bash
   git add calcul.js
   git commit -m "merge: résoudre le conflit de signature sur addition"
   git branch -d feature/variante-calcul
   ```

---

## 9. Aide-mémoire (Cheat Sheet) & Ressources

### 9.1 Fiche réflexe des commandes quotidiennes

| Action souhaitée | Commande Git recommandée |
| :--- | :--- |
| **Inspecter l'état des fichiers** | `git status -s` |
| **Visualiser l'historique compact** | `git log --oneline --graph --all` |
| **Indexer toutes les modifications** | `git add .` |
| **Créer un commit normalisé** | `git commit -m "type(scope): message"` |
| **Mettre de côté temporairement** | `git stash` puis `git stash pop` |
| **Créer et basculer sur une branche** | `git switch -c <nom-de-branche>` |
| **Changer de branche existante** | `git switch <nom-de-branche>` |
| **Fusionner une branche dans la courante** | `git merge <nom-de-branche>` |
| **Récupérer et fusionner le serveur** | `git pull` |
| **Pousser une nouvelle branche locale** | `git push -u origin <nom-de-branche>` |
| **Annuler les modifs d'un fichier** | `git restore <fichier>` |
| **Annuler un commit sans casser l'historique** | `git revert <hash>` |

---

### 9.2 Bibliographie et simulateurs interactifs

- 📖 **Pro Git (Livre officiel de référence) :** Écrit par Scott Chacon et Ben Straub. Entièrement gratuit et disponible en français sur [git-scm.com/book/fr](https://git-scm.com/book/fr).
- 🎮 **Learn Git Branching :** Le meilleur bac à sable interactif et visuel pour s'entraîner aux fusions, rebase et manipulations d'arbre : [learngitbranching.js.org](https://learngitbranching.js.org).
- 🛠️ **GitHub Skills :** Modules d'apprentissage pratiques hébergés sur GitHub pour acquérir les réflexes de Pull Requests et de GitHub Actions : [skills.github.com](https://skills.github.com).
- 📝 **Conventional Commits :** Spécification formelle des messages de commit : [conventionalcommits.org](https://www.conventionalcommits.org/fr).
