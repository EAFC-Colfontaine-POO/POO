# Quiz TypeScript

*29 questions*

---

## 1. En quelle année Microsoft a-t-il publié la première version publique de TypeScript ?

<div v-click>

> 💡 **Hint:** Cherchez la date associée à la création du langage par Anders Hejlsberg chez Microsoft.

</div>

- **A.** 1995
- **B.** 2012
- **C.** 2009
- **D.** 2016

<div v-click>

> **Answer:** B
>
> **Rationale:** TypeScript a été introduit par Microsoft en 2012 pour permettre le développement de grandes applications robustes.

</div>

---

## 2. Lequel de ces énoncés décrit correctement la relation entre TypeScript et JavaScript ?

<div v-click>

> 💡 **Hint:** Pensez à la notion mathématique d'inclusion où un ensemble en contient un autre.

</div>

- **A.** TypeScript est un langage totalement indépendant de JavaScript.
- **B.** TypeScript est un sur-ensemble ($superset$) de JavaScript.
- **C.** JavaScript est un sur-ensemble de TypeScript.
- **D.** TypeScript est une version simplifiée de JavaScript pour les débutants.

<div v-click>

> **Answer:** B
>
> **Rationale:** Tout code JavaScript valide est considéré comme du code TypeScript valide, car TypeScript englobe JavaScript en y ajoutant des types.

</div>

---

## 3. Qu'advient-il des annotations de type une fois que le code TypeScript est compilé en JavaScript ?

<div v-click>

> 💡 **Hint:** Rappelez-vous le terme technique désignant la suppression des types lors de la transpilation.

</div>

- **A.** Elles sont optimisées pour améliorer les performances d'exécution.
- **B.** Elles sont converties en vérifications d'exécution ($runtime checks$).
- **C.** Elles disparaissent complètement du code généré.
- **D.** Elles sont conservées sous forme de commentaires JSDoc.

<div v-click>

> **Answer:** C
>
> **Rationale:** C'est le concept de l'effacement de type ($type erasure$) ; le JavaScript final est un code ordinaire sans notions de types.

</div>

---

## 4. Quelle commande permet d'initialiser un projet TypeScript en créant un fichier de configuration par défaut ?

<div v-click>

> 💡 **Hint:** C'est une option du compilateur $tsc$ souvent utilisée au début d'un projet.

</div>

- **A.** $tsc --init$
- **B.** $tsc --start$
- **C.** $npm init$
- **D.** $ts-node --init$

<div v-click>

> **Answer:** A
>
> **Rationale:** Cette commande génère un fichier $tsconfig.json$ contenant les options de compilation par défaut pour le compilateur TypeScript.

</div>

---

## 5. Quelle est la principale différence entre le type $any$ et le type $unknown$ ?

<div v-click>

> 💡 **Hint:** L'un est considéré comme le 'type le plus sûr' car il exige une prudence explicite avant toute action.

</div>

- **A.** Il n'y a aucune différence technique entre les deux.
- **B.** Le type $unknown$ oblige à effectuer une vérification de type avant usage.
- **C.** $any$ ne peut contenir que des objets alors que $unknown$ accepte tout.
- **D.** Le type $any$ est plus sécurisé que le type $unknown$.

<div v-click>

> **Answer:** B
>
> **Rationale:** Contrairement à $any$, TypeScript interdit d'appeler des méthodes ou d'accéder à des propriétés sur une valeur $unknown$ sans avoir validé son type réel au préalable.

</div>

---

## 6. Quel type est utilisé pour indiquer qu'une fonction ne retourne jamais de valeur, par exemple si elle lance une exception ou contient une boucle infinie ?

<div v-click>

> 💡 **Hint:** Ce type représente l'impossibilité logique d'atteindre la fin d'un bloc de code.

</div>

- **A.** $undefined$
- **B.** $never$
- **C.** $null$
- **D.** $void$

<div v-click>

> **Answer:** B
>
> **Rationale:** Le type $never$ représente une valeur qui ne se produit jamais, utilisé pour des fonctions dont le point de sortie n'est jamais atteint.

</div>

---

## 7. Comment appelle-t-on la déclaration d'une variable qui peut accepter plusieurs types différents, par exemple : $let id: string | number$ ?

<div v-click>

> 💡 **Hint:** Cela exprime l'idée de 'l'un ou l'autre'.

</div>

- **A.** Un alias de type.
- **B.** Une assertion de type.
- **C.** Une intersection de types.
- **D.** Une union de types.

<div v-click>

> **Answer:** D
>
> **Rationale:** L'union de types permet à une variable de correspondre à l'un des types séparés par le symbole pipe ($|$).

</div>

---

## 8. Quelle est la particularité de la portée ($scope$) d'une variable déclarée avec le mot-clé $var$ ?

<div v-click>

> 💡 **Hint:** C'est l'une des raisons pour lesquelles ce mot-clé est aujourd'hui déconseillé au profit de $let$.

</div>

- **A.** Elle possède une portée de fonction.
- **B.** Elle possède une portée de bloc.
- **C.** Elle est protégée contre la réaffectation.
- **D.** Elle ne peut être utilisée qu'après sa déclaration.

<div v-click>

> **Answer:** A
>
> **Rationale:** Une variable $var$ est accessible partout à l'intérieur de la fonction où elle est définie, même en dehors du bloc ($if$, $for$) où elle a été créée.

</div>

---

## 9. Si vous déclarez un tableau avec $const$, comme $const liste = [1, 2]$; , quelle opération est interdite ?

<div v-click>

> 💡 **Hint:** Identifiez l'action qui tente d'écraser la variable avec un tout nouvel objet.

</div>

- **A.** $liste.pop()$
- **B.** $liste[0] = 0$
- **C.** $liste = [4, 5]$
- **D.** $liste.push(3)$

<div v-click>

> **Answer:** C
>
> **Rationale:** Le mot-clé $const$ interdit la réaffectation d'une nouvelle valeur (ou d'une nouvelle référence) à la variable.

</div>

---

## 10. Quelle boucle est recommandée pour itérer directement sur les valeurs d'un tableau ?

<div v-click>

> 💡 **Hint:** C'est la syntaxe la plus simple qui accède au contenu de chaque cellule sans passer par l'index.

</div>

- **A.** $for...of$
- **B.** $for...in$
- **C.** $for$ avec un compteur classique.
- **D.** $while$

<div v-click>

> **Answer:** A
>
> **Rationale:** $for...of$ permet de parcourir directement les valeurs des itérables comme les tableaux.

</div>

---

## 11. À quoi sert l'opérateur de chaînage optionnel ($?.$) ?

<div v-click>

> 💡 **Hint:** Pensez à la sécurité lors de l'accès à des objets imbriqués.

</div>

- **A.** À vérifier si une condition est vraie avant d'exécuter une fonction.
- **B.** À accéder à une propriété sans risquer d'erreur si l'objet parent est $null$ ou $undefined$.
- **C.** À rendre une propriété d'interface optionnelle.
- **D.** À fournir une valeur par défaut si une variable est $null$.

<div v-click>

> **Answer:** B
>
> **Rationale:** L'opérateur $?.$ arrête l'évaluation et renvoie $undefined$ au lieu de lancer une exception si la valeur intermédiaire n'existe pas.

</div>

---

## 12. Quelle est la principale différence de comportement des fonctions fléchées ($arrow functions$) concernant le mot-clé $this$ ?

<div v-click>

> 💡 **Hint:** On dit souvent qu'elles ont un 'this' lexical.

</div>

- **A.** Leur $this$ est toujours égal à l'objet global $window$.
- **B.** Elles créent leur propre contexte $this$.
- **C.** Elles interdisent totalement l'usage de $this$.
- **D.** Elles capturent le $this$ du contexte environnant ($lexical scope$).

<div v-click>

> **Answer:** D
>
> **Rationale:** Les fonctions fléchées ne redéfinissent pas $this$ ; elles utilisent celui du bloc parent, ce qui est utile pour les rappels ($callbacks$).

</div>

---

## 13. Comment définit-on un paramètre 'reste' ($rest parameter$) pour accepter un nombre indéfini d'arguments dans une fonction ?

<div v-click>

> 💡 **Hint:** Utilisez le symbole composé de trois points consécutifs.

</div>

- **A.** En utilisant le mot-clé $arguments$.
- **B.** En utilisant un tableau simple : $params: any[]$
- **C.** En rendant le paramètre optionnel : $params?$
- **D.** En utilisant l'opérateur spread avant le nom : $...params: number[]$

<div v-click>

> **Answer:** D
>
> **Rationale:** L'opérateur $...$ permet de collecter tous les arguments restants dans un tableau manipulable à l'intérieur de la fonction.

</div>

---

## 14. Qu'est-ce qu'un tuple en TypeScript ?

<div v-click>

> 💡 **Hint:** Considérez-le comme un tableau rigide avec une structure connue à l'avance.

</div>

- **A.** Un type spécial pour stocker des paires clé/valeur uniquement.
- **B.** Une liste dont la taille peut varier dynamiquement.
- **C.** Un tableau de taille fixe où chaque élément a un type prédéfini.
- **D.** Un objet dont les clés sont uniquement des nombres.

<div v-click>

> **Answer:** C
>
> **Rationale:** Un tuple définit précisément le nombre d'éléments et le type de chaque cellule à une position donnée, par exemple $[string, number]$.

</div>

---

## 15. Dans le cadre du typage structurel, pourquoi un objet possédant des propriétés supplémentaires par rapport à une interface peut-il être accepté ?

<div v-click>

> 💡 **Hint:** On dit souvent : 'Si ça marche comme un canard et que ça fait coin-coin comme un canard...'.

</div>

- **A.** Parce que les interfaces sont converties en classes à la compilation.
- **B.** Parce que TypeScript ignore systématiquement les objets complexes.
- **C.** Parce que l'objet possède au minimum les propriétés requises par l'interface.
- **D.** Uniquement si l'on utilise le mode non-strict de TypeScript.

<div v-click>

> **Answer:** C
>
> **Rationale:** Le typage structurel considère que deux types sont compatibles si leurs structures se ressemblent ; avoir 'plus' de propriétés ne rompt pas le contrat de base.

</div>

---

## 16. Quelle est la principale différence entre une $interface$ et un $type$ concernant l'extension ?

<div v-click>

> 💡 **Hint:** L'un est plus flexible pour les définitions de bibliothèques tierces grâce à sa capacité de fusion.

</div>

- **A.** Les types ne peuvent pas représenter des objets.
- **B.** Les interfaces peuvent être étendues avec $extends$, tandis que les types utilisent l'intersection ($&$).
- **C.** Les types peuvent être rouverts pour ajouter des propriétés alors que les interfaces ne le peuvent pas.
- **D.** Il n'y a aucune différence, ce sont des synonymes parfaits.

<div v-click>

> **Answer:** B
>
> **Rationale:** TypeScript favorise $extends$ pour la hiérarchie d'interfaces, tandis que les alias de type utilisent l'opérateur d'intersection pour combiner des formes.

</div>

---

## 17. En TypeScript, que permet la syntaxe raccourcie du constructeur dans une classe, par exemple : $constructor(public nom: string) {}$ ?

<div v-click>

> 💡 **Hint:** C'est un 'sucre syntaxique' pour éviter d'écrire $this.nom = nom$.

</div>

- **A.** À déclarer et initialiser automatiquement une propriété de classe sans répétition.
- **B.** À créer une classe sans aucune propriété.
- **C.** À rendre le constructeur privé par défaut.
- **D.** À empêcher l'instanciation de la classe via le mot-clé $new$.

<div v-click>

> **Answer:** A
>
> **Rationale:** En ajoutant un modificateur de visibilité ($public$, $private$, etc.) devant un paramètre du constructeur, TypeScript crée la propriété et lui assigne la valeur fournie.

</div>

---

## 18. Quel est l'intérêt principal de la généricité ($generics$) dans une fonction ?

<div v-click>

> 💡 **Hint:** Pensez au symbole $<T>$ comme à une variable pour un type.

</div>

- **A.** Permettre à la fonction de retourner n'importe quel type sans vérification.
- **B.** Forcer l'usage du type $string$ uniquement.
- **C.** Créer du code réutilisable qui conserve la précision du type entre l'entrée et la sortie.
- **D.** Accélérer la compilation du code.

<div v-click>

> **Answer:** C
>
> **Rationale:** Les génériques capturent le type passé en argument pour garantir que la valeur de retour ou les traitements internes restent cohérents avec ce type précis.

</div>

---

## 19. Que signifie la contrainte $<T extends { length: number }>$ dans une fonction générique ?

<div v-click>

> 💡 **Hint:** Le mot-clé 'extends' définit ici une exigence minimale sur la forme du type reçu.

</div>

- **A.** Que le type $T$ doit être obligatoirement un nombre.
- **B.** Que le type $T$ ne peut être utilisé que pour des tableaux.
- **C.** Que le type $T$ doit posséder au minimum une propriété nommée $length$ de type nombre.
- **D.** Que la fonction va allonger la taille de l'élément passé en paramètre.

<div v-click>

> **Answer:** C
>
> **Rationale:** Le mot-clé $extends$ ici impose que l'argument de type respecte une certaine structure minimale (comme une chaîne ou un tableau).

</div>

---

## 20. Quel est le type de retour d'une fonction déclarée avec le mot-clé $async$ ?

<div v-click>

> 💡 **Hint:** Le mot-clé 'async' transforme systématiquement la nature de la valeur de sortie.

</div>

- **A.** $void$
- **B.** Une $Promise$ résolue avec le type de la valeur de retour.
- **C.** $any$
- **D.** Le type de la valeur retournée directement par le mot-clé $return$.

<div v-click>

> **Answer:** B
>
> **Rationale:** Toute fonction $async$ enveloppe son résultat dans une promesse, permettant l'usage de $await$ lors de l'appel.

</div>

---

## 21. Que nécessite l'utilisation des décorateurs en TypeScript pur (hors Angular pré-configuré) ?

<div v-click>

> 💡 **Hint:** Cherchez une option de configuration dans le fichier JSON du projet.

</div>

- **A.** L'utilisation de fichiers avec l'extension $.d.ts$.
- **B.** L'installation d'une bibliothèque externe.
- **C.** L'usage obligatoire de classes abstraites.
- **D.** L'activation de l'option $experimentalDecorators$ dans le fichier $tsconfig.json$.

<div v-click>

> **Answer:** D
>
> **Rationale:** Comme la spécification ECMAScript n'était pas finalisée lors de leur ajout, TypeScript demande une activation explicite de cette fonctionnalité expérimentale.

</div>

---

## 22. Dans Angular, à quoi sert principalement le décorateur $@Component$ ?

<div v-click>

> 💡 **Hint:** C'est l'élément central qui définit la structure visuelle d'une partie de l'application.

</div>

- **A.** À définir une base de données locale pour le composant.
- **B.** À masquer les méthodes de la classe pour les rendre privées.
- **C.** À compiler le code TypeScript en temps réel dans le navigateur.
- **D.** À transformer une simple classe TypeScript en un composant Angular avec son template et ses styles.

<div v-click>

> **Answer:** D
>
> **Rationale:** Il fournit les métadonnées nécessaires au framework pour lier la logique de la classe à une vue HTML.

</div>

---

## 23. Lequel de ces types permet d'exprimer qu'une variable peut être soit une chaîne, soit $null$, soit $undefined$ ?

<div v-click>

> 💡 **Hint:** Utilisez le symbole de l'union.

</div>

- **A.** $unknown$
- **B.** $string?$
- **C.** $string | null | undefined$
- **D.** $any$

<div v-click>

> **Answer:** C
>
> **Rationale:** L'union de types avec l'opérateur $|$ est la manière correcte d'inclure explicitement les valeurs nulles.

</div>

---

## 24. Quelle convention de nommage est recommandée pour les classes et les interfaces en TypeScript ?

<div v-click>

> 💡 **Hint:** Le nom commence par une majuscule.

</div>

- **A.** $PascalCase$
- **B.** $snake_case$
- **C.** $UPPER_CASE$
- **D.** $camelCase$

<div v-click>

> **Answer:** A
>
> **Rationale:** La convention veut que les noms de types complexes (classes, interfaces, types) commencent par une majuscule à chaque mot.

</div>

---

## 25. Que signifie le mot-clé $readonly$ devant une propriété d'interface ?

<div v-click>

> 💡 **Hint:** C'est une restriction de modification 'en lecture seule'.

</div>

- **A.** La propriété est une constante globale.
- **B.** La propriété est invisible à l'extérieur de l'objet.
- **C.** L'objet entier devient immuable.
- **D.** La propriété ne peut pas être modifiée après sa création initiale.

<div v-click>

> **Answer:** D
>
> **Rationale:** Toute tentative de réaffectation d'une valeur à cette propriété après l'instanciation de l'objet provoquera une erreur de compilation.

</div>

---

## 26. Pourquoi dit-on que le typage en TypeScript est 'optionnel' ?

<div v-click>

> 💡 **Hint:** Pensez au mécanisme qui permet de ne pas écrire ': number' si on affecte '10' à une variable.

</div>

- **A.** Parce qu'on peut mélanger du code JavaScript et TypeScript dans le même fichier.
- **B.** Parce que TypeScript peut inférer les types automatiquement sans annotation explicite.
- **C.** Parce que TypeScript n'est utile que pour les projets complexes.
- **D.** Parce que le compilateur ignore les erreurs de type par défaut.

<div v-click>

> **Answer:** B
>
> **Rationale:** L'inférence de type permet à TypeScript de deviner le type d'une variable à partir de sa valeur initiale sans que le développeur n'ait à l'écrire.

</div>

---

## 27. Quelle extension de fichier est utilisée pour les fichiers TypeScript ?

<div v-click>

> 💡 **Hint:** C'est une abréviation directe du nom du langage.

</div>

- **A.** $.type$
- **B.** $.tsx$
- **C.** $.js$
- **D.** $.ts$

<div v-click>

> **Answer:** D
>
> **Rationale:** Il s'agit de l'extension standard pour les fichiers sources contenant du code TypeScript.

</div>

---

## 28. Lequel de ces éléments n'est PAS un type primitif en TypeScript ?

<div v-click>

> 💡 **Hint:** Les types primitifs sont les briques de base immuables de JavaScript.

</div>

- **A.** $string$
- **B.** $boolean$
- **C.** $number$
- **D.** $Object$

<div v-click>

> **Answer:** D
>
> **Rationale:** $Object$ (ou les types structurels d'objets) n'est pas considéré comme un type primitif car il est mutable et composé.

</div>

---

## 29. À quoi sert le mot-clé $as$ en TypeScript ?

<div v-click>

> 💡 **Hint:** C'est une manière de dire au compilateur : 'Fais-moi confiance, je sais que cette donnée est de ce type'.

</div>

- **A.** À renommer une variable lors d'un import.
- **B.** À définir une valeur par défaut pour un paramètre.
- **C.** À effectuer une assertion de type pour forcer le compilateur à accepter un type spécifique.
- **D.** À créer une boucle infinie sécurisée.

<div v-click>

> **Answer:** C
>
> **Rationale:** L'assertion de type informe TypeScript que le développeur connaît mieux le type réel de la valeur que le système d'inférence automatique.

</div>

---
