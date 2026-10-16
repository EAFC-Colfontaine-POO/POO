# Projet : Fil d'actualité et interactions

## Contexte

Une plateforme de partage souhaite afficher un fil de publications, avec leurs auteurs, leurs commentaires et leurs réactions. Les utilisateurs peuvent publier, commenter et réagir, et les administrateurs peuvent modérer les contenus.

## Objectif

Développer une application de fil d'actualité permettant de gérer des publications, des commentaires et des utilisateurs, avec des règles de modération.

Cet énoncé constitue un point de départ, et non une liste obligatoire. Il n'est pas nécessaire d'implémenter l'ensemble des fonctionnalités : l'objectif est de mettre en œuvre le plus de notions POO possible, de façon claire et cohérente. Une application simple et bien conçue est préférable à une application étendue mais confuse.

## Données de départ (DummyJSON)

| Entité | Liste | Détail | Champs principaux |
|---|---|---|---|
| Publication | https://dummyjson.com/posts | https://dummyjson.com/posts/1 | `id`, `title`, `body`, `userId`, `tags`, `reactions` |
| Commentaire | https://dummyjson.com/comments | https://dummyjson.com/comments/1 | `id`, `body`, `postId`, `likes`, `user` |
| Utilisateur | https://dummyjson.com/users | https://dummyjson.com/users/1 | `id`, `firstName`, `lastName`, `email`, `username` |

Commentaires d'une publication : https://dummyjson.com/posts/1/comments

Publications d'un utilisateur : https://dummyjson.com/users/1/posts

Les opérations d'écriture (POST, PUT, DELETE) sont simulées : DummyJSON répond comme si l'opération avait abouti, mais ne sauvegarde rien. L'application doit donc conserver elle-même son état.

## Entités principales (3)

- `Publication`
- `Commentaire`
- `Utilisateur`

Une quatrième entité peut être ajoutée à titre de bonus, par exemple `Notification`.

## CRUD attendu

- **Publications** : lister, créer, modifier, supprimer
- **Commentaires** : lister, ajouter à une publication, modifier, supprimer
- **Utilisateurs** : lister, créer, modifier, supprimer

## Routes

Minimum 2 :

- un fil d'actualité (liste des publications)
- une page de détail d'une publication avec ses commentaires

Une page de profil utilisateur constitue un bonus.

## Notions POO à mettre en œuvre

- **Classe abstraite `Contenu`** dont héritent `Publication` et `Commentaire`, avec les attributs communs : auteur, date, nombre de réactions.
- **Interface `Moderable`** implémentée par les contenus, avec les méthodes `signaler()` et `masquer()`.
- **Composition** : un `Utilisateur` possède ses publications, une `Publication` possède ses commentaires.
- **Invariants** : une publication ne peut pas être vide, un commentaire doit avoir un auteur.
- **Exceptions** : par exemple `ContenuVideException` ou `ContenuMasqueException`, levées lorsqu'une interaction est tentée sur un contenu modéré.
- **Visibilité** : le compteur de réactions n'est modifiable que par une méthode dédiée.
- **Sérialisation** : transformation du JSON brut de l'API en objets métier, dans un service dédié.
- **Persistance** : les réactions sont conservées dans le localStorage.

## Squelettes de classes (à compléter)

Ces squelettes indiquent uniquement les propriétés attendues. La définition des constructeurs, des invariants et des comportements relève de la conception de chacun.

```ts
// Classe abstraite : données communes à tout contenu
export abstract class Contenu {
  // id, auteur, date de création, nombre de réactions
}

// Hérite de Contenu, implémente Moderable
export class Publication extends Contenu {
  // titre, corps, tags, commentaires
}

// Hérite de Contenu, implémente Moderable
export class Commentaire extends Contenu {
  // corps, publication parente
}

// Interface : contrat de modération
export interface Moderable {
  // signaler(), masquer()
}

export class Utilisateur {
  // id, prénom, nom, email, publications
}
```

## Liberté de réalisation

- **CSS** : la solution est libre (CSS natif, Bootstrap, Tailwind, Material, etc.). Aucune n'est imposée.
- **Affichage des données** : si l'appel à l'API n'est pas maîtrisé, une liste de données créée directement dans le code est acceptée. L'objectif porte sur la POO, et non sur les requêtes HTTP.
- **Stockage** : une liste en mémoire suffit. Un signal global ou une base locale (IndexedDB, par exemple) peuvent également être utilisés. Aucun de ces choix n'est obligatoire.
- **Fonctionnalités supplémentaires** : recherche, filtres, tri, pagination, mode sombre, notifications, etc. Toute fonctionnalité permettant de justifier des choix de conception est pertinente.

## Livrables

1. **Le code** : un dépôt GitHub contenant l'application Angular, accompagné d'un README expliquant comment la lancer.
2. **Le diagramme de classes**, avec une explication écrite des relations (association, agrégation, composition, héritage, implémentation d'interface).
3. **Une présentation** au format PowerPoint (quelques diapositives) expliquant l'application, les notions POO mises en œuvre et les raisons de ces choix.
4. **Un mini-rapport** détaillant les choix de conception et les difficultés rencontrées.
5. **Une démonstration** en direct, présentant le fonctionnement général de l'application et justifiant les choix effectués.

## Critère d'évaluation

L'évaluation porte non pas sur le nombre de fonctionnalités, mais sur la justesse de l'usage de la POO. Chaque concept utilisé doit avoir une raison d'être dans l'application et pouvoir être expliqué.


> *Conseil :* la classe abstraite `Contenu` et l'interface `Moderable` répondent à des besoins différents. La première partage des données entre classes de même nature. La seconde définit un comportement que des classes non apparentées peuvent partager. Pour chaque concept, il convient de se demander lequel utiliser et pourquoi.
