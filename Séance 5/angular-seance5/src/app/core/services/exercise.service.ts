import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance5_exercises_v1';
  private readonly transpiler = inject(TypescriptTranspilerService);

  readonly activeExerciseIndex = signal<number>(0);
  readonly filterLab = signal<number | null>(null);

  readonly exercises = signal<Exercise[]>([
    // =========================================================================
    // LABO 1 : Pile, Tas & Piège de l'Aliasing (4 ex)
    // =========================================================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Primitifs et indépendance en pile',
      subtitle: 'Comprendre la duplication par valeur des types simples',
      sectionId: 'memory-model',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        'Déclarez une variable `let noteInitiale = 14;`, puis créez une copie `let noteCopie = noteInitiale;`. Modifiez ensuite `noteCopie = 18;`. Affichez les deux variables avec console.log pour prouver que noteInitiale reste inchangée.',
      hint: 'Utilisez console.log("Initiale:", noteInitiale) et console.log("Copie:", noteCopie);',
      initialCode: `// 1. Déclarez noteInitiale = 14\n\n// 2. Copiez dans noteCopie\n\n// 3. Modifiez noteCopie à 18\n\n// 4. Affichez les deux variables :\n`,
      solutionCode: `let noteInitiale = 14;\nlet noteCopie = noteInitiale;\nnoteCopie = 18;\n\nconsole.log("noteInitiale :", noteInitiale); // 14\nconsole.log("noteCopie :", noteCopie);       // 18\n`,
      currentCode: `// 1. Déclarez noteInitiale = 14\n\n// 2. Copiez dans noteCopie\n\n// 3. Modifiez noteCopie à 18\n\n// 4. Affichez les deux variables :\n`,
      isCompleted: false,
      solutionExplanation: [
        'Les nombres (primitifs) sont stockés directement dans la pile (Stack).',
        "L'affectation `let noteCopie = noteInitiale` duplique la valeur 14 dans un nouvel emplacement mémoire.",
        "Modifier `noteCopie` n'a strictement aucun effet sur `noteInitiale`.",
      ],
      criteria: [
        {
          id: 'c1-declared',
          label: 'Variables déclarées',
          description: 'noteInitiale (14) et noteCopie doivent être déclarées.',
          passed: false,
          hint: 'let noteInitiale = 14; let noteCopie = noteInitiale;',
        },
        {
          id: 'c1-modified',
          label: 'noteCopie réassignée à 18',
          description: 'noteCopie doit être modifiée à 18.',
          passed: false,
          hint: 'noteCopie = 18;',
        },
        {
          id: 'c1-logged',
          label: 'Affichage des deux valeurs distinctes',
          description: 'La console doit afficher 14 pour noteInitiale et 18 pour noteCopie.',
          passed: false,
          hint: 'console.log(noteInitiale); console.log(noteCopie);',
        },
      ],
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: "Détection d'Aliasing & Correction par Clonage",
      subtitle: "Éviter la mutation collatérale par référence d'objet",
      sectionId: 'aliasing-pitfall',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Soit `const user1 = { nom: "Alice", score: 10 };`. Si on fait `const user2 = user1; user2.score = 50;`, user1.score est muté ! Corrigez la déclaration de `user2` en créant une copie superficielle distincte avec le spread `{ ...user1 }` pour que user1.score reste à 10.',
      hint: 'Remplacez const user2 = user1; par const user2 = { ...user1 };',
      initialCode: `const user1 = { nom: "Alice", score: 10 };\n\n// Corrigez la ligne suivante pour cloner l'objet au lieu de copier l'adresse :\nconst user2 = user1;\n\n\n\nconsole.log("user1.score :", user1.score);\nconsole.log("user2.score :", user2.score);\n`,
      solutionCode: `const user1 = { nom: "Alice", score: 10 };\n\n// Clonage superficiel (nouvel objet alloué dans le tas) :\nconst user2 = { ...user1 };\n\nuser2.score = 50;\n\nconsole.log("user1.score :", user1.score); // 10\nconsole.log("user2.score :", user2.score); // 50\n`,
      currentCode: `const user1 = { nom: "Alice", score: 10 };\n\n// Corrigez la ligne suivante pour cloner l'objet au lieu de copier l'adresse :\nconst user2 = user1;\n\n\n\nconsole.log("user1.score :", user1.score);\nconsole.log("user2.score :", user2.score);\n`,
      isCompleted: false,
      solutionExplanation: [
        '`user1` contient une adresse mémoire pointant vers le tas.',
        '`user2 = user1` copiait uniquement cette adresse : les deux variables devenaient des alias de la même case mémoire.',
        '`{ ...user1 }` alloue un nouveau bloc mémoire distinct dans le tas et y copie les propriétés.',
      ],
      criteria: [
        {
          id: 'c2-spread',
          label: 'Clonage par décomposition (...user1)',
          description: 'user2 doit être instancié avec { ...user1 } ou Object.assign.',
          passed: false,
          hint: 'const user2 = { ...user1 };',
        },
        {
          id: 'c2-intact',
          label: 'user1.score reste égal à 10',
          description: 'user1 ne doit pas être altéré par la modification de user2.',
          passed: false,
          hint: 'Vérifiez que user1.score vaut toujours 10.',
        },
        {
          id: 'c2-mutated',
          label: 'user2.score est mis à 50',
          description: 'user2.score doit bien valoir 50.',
          passed: false,
          hint: 'user2.score = 50;',
        },
      ],
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: "Passage d'objet à une fonction (Mutation du tas)",
      subtitle: 'Observer comment une fonction peut muter un objet reçu en argument',
      sectionId: 'aliasing-pitfall',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Écrivez une fonction `reinitialiserScore(joueur: { nom: string; score: number }): void` qui remet à 0 le score de l\'objet reçu (`joueur.score = 0;`). Testez-la avec un objet `hero = { nom: "Link", score: 99 };` et affichez son score après l\'appel.',
      hint: "Une fonction recevant un objet reçoit la référence vers le tas ; modifier une propriété altère l'original.",
      initialCode: `// Déclarez la fonction reinitialiserScore ici :\n\n\n// Testez avec hero :\nconst hero = { nom: "Link", score: 99 };\n// Appelez la fonction puis affichez hero.score\n`,
      solutionCode: `function reinitialiserScore(joueur: { nom: string; score: number }): void {\n  joueur.score = 0;\n}\n\nconst hero = { nom: "Link", score: 99 };\nreinitialiserScore(hero);\nconsole.log("Score de hero après appel :", hero.score);\n`,
      currentCode: `// Déclarez la fonction reinitialiserScore ici :\n\n\n// Testez avec hero :\nconst hero = { nom: "Link", score: 99 };\n// Appelez la fonction puis affichez hero.score\n`,
      isCompleted: false,
      solutionExplanation: [
        "En TypeScript, les objets sont passés aux fonctions par référence (copie de l'adresse mémoire).",
        'La fonction opère donc directement sur le même bloc mémoire dans le tas.',
        "Cela prouve pourquoi l'encapsulation est essentielle : sans elle, n'importe quelle fonction externe peut corrompre l'état interne.",
      ],
      criteria: [
        {
          id: 'c3-func',
          label: 'Fonction reinitialiserScore définie',
          description: 'La fonction doit accepter un objet et assigner score = 0.',
          passed: false,
          hint: 'function reinitialiserScore(joueur) { joueur.score = 0; }',
        },
        {
          id: 'c3-called',
          label: 'Appel effectif et score égal à 0',
          description: "Après l'appel, le score de hero doit être 0.",
          passed: false,
          hint: 'reinitialiserScore(hero); console.log(hero.score);',
        },
      ],
    },
    {
      id: 'ex-1-4',
      labNumber: 1,
      number: '1.4',
      title: 'Protection par immuabilité basique (Object.freeze)',
      subtitle: 'Verrouiller un objet contre les mutations accidentelles',
      sectionId: 'memory-model',
      estimatedTime: '4 min',
      difficulty: 'Intermédiaire',
      statement:
        'Créez un objet de configuration `const config = Object.freeze({ apiUrl: "https://api.be", maxRetries: 3 });`. Tentez d\'exécuter `config.maxRetries = 10;` dans un bloc try/catch et constatez que la modification échoue en mode strict ou n\'altère pas la valeur (maxRetries reste à 3). Affichez `config.maxRetries`.',
      hint: "Object.freeze() rend l'objet non modifiable en lecture seule.",
      initialCode: `// Gelez l'objet config avec Object.freeze :\nconst config = {\n  apiUrl: "https://api.be",\n  \n};\n\ntry {\n  \n} catch (e) {\n  console.log("Mutation bloquée par freeze !");\n}\n\nconsole.log("maxRetries :", config.maxRetries);\n`,
      solutionCode: `const config = Object.freeze({\n  apiUrl: "https://api.be",\n  maxRetries: 3\n});\n\ntry {\n  config.maxRetries = 10;\n} catch (e) {\n  console.log("Mutation bloquée par freeze !");\n}\n\nconsole.log("maxRetries :", config.maxRetries); // 3\n`,
      currentCode: `// Gelez l'objet config avec Object.freeze :\nconst config = {\n  apiUrl: "https://api.be",\n  \n};\n\ntry {\n  \n} catch (e) {\n  console.log("Mutation bloquée par freeze !");\n}\n\nconsole.log("maxRetries :", config.maxRetries);\n`,
      isCompleted: false,
      solutionExplanation: [
        "`Object.freeze()` verrouille l'objet au niveau du moteur JavaScript (runtime).",
        "En mode strict (`use strict`), toute tentative de réaffectation d'une propriété d'un objet gelé lève une TypeError.",
        "C'est une première arme pour garantir l'intégrité avant d'utiliser les classes encapsulées.",
      ],
      criteria: [
        {
          id: 'c4-freeze',
          label: 'Object.freeze() appliqué',
          description: "L'objet config doit être enveloppé dans Object.freeze().",
          passed: false,
          hint: 'const config = Object.freeze({ ... });',
        },
        {
          id: 'c4-intact',
          label: 'maxRetries reste égal à 3',
          description: 'La valeur finale affichée doit être 3.',
          passed: false,
          hint: 'console.log(config.maxRetries);',
        },
      ],
    },

    // =========================================================================
    // LABO 2 : Construction & Défense des Invariants (5 ex)
    // =========================================================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Le Constructeur Gardien (NoteExamen)',
      subtitle: "Empêcher la naissance d'un objet dans un état invalide",
      sectionId: 'encapsulation-invariants',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Créez une classe `NoteExamen` avec un attribut privé `_valeur: number`. Dans le constructeur, si la valeur reçue est `< 0` ou `> 20`, levez une exception `throw new Error("Note invalide")`. Ajoutez une méthode `getValeur(): number` retournant `this._valeur`.',
      hint: 'if (valeur < 0 || valeur > 20) throw new Error("Note invalide");',
      initialCode: `class NoteExamen {\n  private _valeur: number;\n\n  constructor(valeur: number) {\n    // Validez ici l'invariant [0, 20] avec throw new Error :\n    \n    this._valeur = valeur;\n  }\n\n  public getValeur(): number {\n    return this._valeur;\n  }\n}\n\n// Testez :\nconst n1 = new NoteExamen(16);\nconsole.log("Note valide :", n1.getValeur());\n\ntry {\n  const n2 = new NoteExamen(25);\n} catch (e: any) {\n  console.log("Erreur capturée :", e.message);\n}\n`,
      solutionCode: `class NoteExamen {\n  private _valeur: number;\n\n  constructor(valeur: number) {\n    if (valeur < 0 || valeur > 20) {\n      throw new Error("Note invalide");\n    }\n    this._valeur = valeur;\n  }\n\n  public getValeur(): number {\n    return this._valeur;\n  }\n}\n\nconst n1 = new NoteExamen(16);\nconsole.log("Note valide :", n1.getValeur());\n\ntry {\n  const n2 = new NoteExamen(25);\n} catch (e: any) {\n  console.log("Erreur capturée :", e.message);\n}\n`,
      currentCode: `class NoteExamen {\n  private _valeur: number;\n\n  constructor(valeur: number) {\n    // Validez ici l'invariant [0, 20] avec throw new Error :\n    \n    this._valeur = valeur;\n  }\n\n  public getValeur(): number {\n    return this._valeur;\n  }\n}\n\n// Testez :\nconst n1 = new NoteExamen(16);\nconsole.log("Note valide :", n1.getValeur());\n\ntry {\n  const n2 = new NoteExamen(25);\n} catch (e: any) {\n  console.log("Erreur capturée :", e.message);\n}\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le constructeur est le premier gardien d'un objet en mémoire.",
        "`throw new Error()` interrompt l'instanciation : aucun objet corrompu ne naît dans le tas.",
        "L'attribut `_valeur` étant privé, il ne peut être ni altéré de l'extérieur, ni désynchronisé.",
      ],
      criteria: [
        {
          id: 'c21-throw',
          label: 'Validation avec throw new Error',
          description: 'Le constructeur doit lancer une exception si la note est hors [0, 20].',
          passed: false,
          hint: 'if (valeur < 0 || valeur > 20) throw new Error(...);',
        },
        {
          id: 'c21-getter',
          label: 'getValeur() retourne la valeur',
          description: 'La méthode publique getValeur() doit renvoyer la note valide.',
          passed: false,
          hint: 'public getValeur(): number { return this._valeur; }',
        },
        {
          id: 'c21-reject',
          label: 'Rejet des valeurs invalides vérifié',
          description: "L'instanciation avec 25 doit lever une exception capturée.",
          passed: false,
          hint: 'Utilisez try/catch pour tester NoteExamen(25).',
        },
      ],
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Protection de solde bancaire (CompteBancaire)',
      subtitle: "Garantir l'invariant solde >= 0 dès l'initialisation",
      sectionId: 'encapsulation-invariants',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Créez une classe `CompteBancaire` avec un attribut privé `_solde: number`. Le constructeur doit refuser tout solde initial strictement négatif en levant `throw new Error("Solde négatif interdit")`. Fournissez une méthode publique `getSolde(): number`.',
      hint: 'if (soldeInitial < 0) throw new Error("Solde négatif interdit");',
      initialCode: `class CompteBancaire {\n  private _solde: number;\n\n  constructor(soldeInitial: number) {\n    // Validez soldeInitial >= 0 ici\n    \n    this._solde = soldeInitial;\n  }\n\n  public getSolde(): number {\n    return this._solde;\n  }\n}\n\nconst compte = new CompteBancaire(500);\nconsole.log("Solde initial :", compte.getSolde());\n`,
      solutionCode: `class CompteBancaire {\n  private _solde: number;\n\n  constructor(soldeInitial: number) {\n    if (soldeInitial < 0) {\n      throw new Error("Solde négatif interdit");\n    }\n    this._solde = soldeInitial;\n  }\n\n  public getSolde(): number {\n    return this._solde;\n  }\n}\n\nconst compte = new CompteBancaire(500);\nconsole.log("Solde initial :", compte.getSolde());\n`,
      currentCode: `class CompteBancaire {\n  private _solde: number;\n\n  constructor(soldeInitial: number) {\n    // Validez soldeInitial >= 0 ici\n    \n    this._solde = soldeInitial;\n  }\n\n  public getSolde(): number {\n    return this._solde;\n  }\n}\n\nconst compte = new CompteBancaire(500);\nconsole.log("Solde initial :", compte.getSolde());\n`,
      isCompleted: false,
      solutionExplanation: [
        'Un compte ne peut pas naître avec une dette non autorisée.',
        'En protégeant `_solde` avec `private`, aucun code externe ne peut exécuter `c._solde = -100`.',
        'Seule la méthode `getSolde()` permet de consulter le montant.',
      ],
      criteria: [
        {
          id: 'c22-neg-throw',
          label: 'Interdiction des soldes négatifs à la création',
          description: 'Le constructeur doit rejeter tout solde < 0 avec throw new Error.',
          passed: false,
          hint: 'if (soldeInitial < 0) throw new Error(...);',
        },
        {
          id: 'c22-valid',
          label: 'Création valide avec 500',
          description: 'Un compte avec 500€ est créé avec succès.',
          passed: false,
          hint: 'const c = new CompteBancaire(500);',
        },
      ],
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Méthode de retrait avec invariant métier',
      subtitle: "Contrôler chaque mutation pour préserver l'intégrité",
      sectionId: 'encapsulation-invariants',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Reprenez `CompteBancaire` et ajoutez la méthode `public retirer(montant: number): void`. Cette méthode doit vérifier deux choses : 1) le montant doit être `> 0`, 2) le montant ne doit pas dépasser le solde (`montant > this._solde`). Dans ces deux cas, levez une `throw new Error(...)`. Sinon, déduisez le montant.',
      hint: 'if (montant <= 0) throw new Error("Montant invalide"); if (montant > this._solde) throw new Error("Fonds insuffisants");',
      initialCode: `class CompteBancaire {\n  private _solde: number;\n\n  constructor(soldeInitial: number) {\n    if (soldeInitial < 0) throw new Error("Solde négatif");\n    this._solde = soldeInitial;\n  }\n\n  public getSolde(): number {\n    return this._solde;\n  }\n\n  // Implémentez retirer(montant: number) ici :\n  \n}\n\nconst c = new CompteBancaire(100);\n\nconsole.log("Nouveau solde :", c.getSolde()); // doit afficher 60\n`,
      solutionCode: `class CompteBancaire {\n  private _solde: number;\n\n  constructor(soldeInitial: number) {\n    if (soldeInitial < 0) throw new Error("Solde négatif");\n    this._solde = soldeInitial;\n  }\n\n  public getSolde(): number {\n    return this._solde;\n  }\n\n  public retirer(montant: number): void {\n    if (montant <= 0) {\n      throw new Error("Montant invalide");\n    }\n    if (montant > this._solde) {\n      throw new Error("Fonds insuffisants");\n    }\n    this._solde -= montant;\n  }\n}\n\nconst c = new CompteBancaire(100);\nc.retirer(40);\nconsole.log("Nouveau solde :", c.getSolde());\n`,
      currentCode: `class CompteBancaire {\n  private _solde: number;\n\n  constructor(soldeInitial: number) {\n    if (soldeInitial < 0) throw new Error("Solde négatif");\n    this._solde = soldeInitial;\n  }\n\n  public getSolde(): number {\n    return this._solde;\n  }\n\n  // Implémentez retirer(montant: number) ici :\n  \n}\n\nconst c = new CompteBancaire(100);\n\nconsole.log("Nouveau solde :", c.getSolde()); // doit afficher 60\n`,
      isCompleted: false,
      solutionExplanation: [
        "L'invariant de classe `solde >= 0` est défendu par la méthode métier.",
        "L'opération s'exécute de manière atomique : soit les conditions sont satisfaites et le solde est mis à jour, soit une exception est levée sans altérer l'état.",
        'Le compte reste constamment dans un état intègre.',
      ],
      criteria: [
        {
          id: 'c23-retirer-def',
          label: 'Méthode retirer() implémentée',
          description: 'La méthode retirer doit exister et vérifier les conditions.',
          passed: false,
          hint: 'public retirer(montant: number): void { ... }',
        },
        {
          id: 'c23-valid-deduct',
          label: 'Déduction correcte (100 - 40 = 60)',
          description: 'Le solde après retrait de 40 doit être 60.',
          passed: false,
          hint: 'this._solde -= montant;',
        },
        {
          id: 'c23-overdraft-blocked',
          label: 'Blocage des retraits excessifs',
          description: 'Retirer plus que le solde disponible doit lever une erreur.',
          passed: false,
          hint: 'if (montant > this._solde) throw new Error(...);',
        },
      ],
    },
    {
      id: 'ex-2-4',
      labNumber: 2,
      number: '2.4',
      title: 'Attribut en lecture seule (readonly)',
      subtitle: 'Autoriser la lecture publique tout en interdisant la réaffectation',
      sectionId: 'class-vs-instance',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        'Ajoutez à `CompteBancaire` un identifiant immuable `public readonly rib: string`. Initialisez-le dans le constructeur. Vérifiez qu\'il est lisible directement (`c.rib`) mais qu\'une réassignation (`c.rib = "autre"`) est rejetée par TypeScript.',
      hint: 'constructor(public readonly rib: string, soldeInitial: number) { ... }',
      initialCode: '',
      solutionCode: `class CompteBancaire {\n  public readonly rib: string;\n  private _solde: number;\n\n  constructor(rib: string, solde: number) {\n    this.rib = rib;\n    this._solde = solde;\n  }\n}\n\nconst c = new CompteBancaire("BE12-3456-7890", 1000);\nconsole.log("RIB consultable :", c.rib);\n`,
      currentCode: '',
      isCompleted: false,
      solutionExplanation: [
        "`readonly` permet d'exposer publiquement un attribut sans avoir besoin de getter.",
        "TypeScript garantit qu'aucune réaffectation n'est possible après l'exécution du constructeur.",
        "Le RIB d'un compte ne devant jamais changer au cours de sa vie, `readonly` est le choix de conception idéal.",
      ],
      criteria: [
        {
          id: 'c24-readonly',
          label: 'Attribut public readonly rib',
          description: "L'attribut rib doit être déclaré avec readonly.",
          passed: false,
          hint: 'public readonly rib: string;',
        },
        {
          id: 'c24-log',
          label: 'Lecture publique réussie',
          description: 'c.rib doit être affiché dans la console.',
          passed: false,
          hint: 'console.log(c.rib);',
        },
      ],
    },
    {
      id: 'ex-2-5',
      labNumber: 2,
      number: '2.5',
      title: 'Invariant complexe multi-champs (Classe Periode)',
      subtitle: 'Valider la cohérence relationnelle entre plusieurs propriétés',
      sectionId: 'encapsulation-invariants',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'Créez une classe `Periode` prenant deux objets Date : `constructor(private _debut: Date, private _fin: Date)`. L\'invariant métier impose que la date de fin soit strictement postérieure à la date de début (`_fin.getTime() > _debut.getTime()`), sinon levez `throw new Error("Date de fin antérieure ou égale au début")`. Ajoutez une méthode `getDureeJours(): number`.',
      hint: 'const diffMs = this._fin.getTime() - this._debut.getTime(); return Math.floor(diffMs / (1000 * 60 * 60 * 24));',
      initialCode: `class Periode {\n  constructor(private _debut: Date, private _fin: Date) {\n    // Validez l'invariant multi-champs ici :\n    \n  }\n\n  public getDureeJours(): number {\n    const diffMs = this._fin.getTime() - this._debut.getTime();\n    return Math.floor(diffMs / (1000 * 60 * 60 * 24));\n  }\n}\n\nconst d1 = new Date("2026-06-01");\nconst d2 = new Date("2026-06-11");\nconst p = new Periode(d1, d2);\nconsole.log("Durée en jours :", p.getDureeJours()); // 10\n`,
      solutionCode: `class Periode {\n  constructor(private _debut: Date, private _fin: Date) {\n    if (this._fin.getTime() <= this._debut.getTime()) {\n      throw new Error("Date de fin antérieure ou égale au début");\n    }\n  }\n\n  public getDureeJours(): number {\n    const diffMs = this._fin.getTime() - this._debut.getTime();\n    return Math.floor(diffMs / (1000 * 60 * 60 * 24));\n  }\n}\n\nconst d1 = new Date("2026-06-01");\nconst d2 = new Date("2026-06-11");\nconst p = new Periode(d1, d2);\nconsole.log("Durée en jours :", p.getDureeJours());\n`,
      currentCode: `class Periode {\n  constructor(private _debut: Date, private _fin: Date) {\n    // Validez l'invariant multi-champs ici :\n    \n  }\n\n  public getDureeJours(): number {\n    const diffMs = this._fin.getTime() - this._debut.getTime();\n    return Math.floor(diffMs / (1000 * 60 * 60 * 24));\n  }\n}\n\nconst d1 = new Date("2026-06-01");\nconst d2 = new Date("2026-06-11");\nconst p = new Periode(d1, d2);\nconsole.log("Durée en jours :", p.getDureeJours()); // 10\n`,
      isCompleted: false,
      solutionExplanation: [
        "Un invariant n'est pas limité à une seule variable : il régit souvent la relation entre plusieurs attributs.",
        'Vérifier `fin > debut` dès le constructeur interdit les réservations ou intervalles temporels aberrants.',
        "La méthode `getDureeJours()` peut s'exécuter en toute confiance car elle a la certitude que la durée est positive.",
      ],
      criteria: [
        {
          id: 'c25-invariant',
          label: 'Validation temporelle fin > debut',
          description: 'Le constructeur doit vérifier que getTime() de fin est supérieur à début.',
          passed: false,
          hint: 'if (this._fin.getTime() <= this._debut.getTime()) throw new Error(...);',
        },
        {
          id: 'c25-duration',
          label: 'Calcul exact de 10 jours',
          description: 'getDureeJours() doit renvoyer 10 entre le 01/06 et le 11/06.',
          passed: false,
          hint: 'console.log(p.getDureeJours());',
        },
      ],
    },

    // =========================================================================
    // LABO 3 : Parameter Properties & Visibilité (4 ex)
    // =========================================================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Refactorisation en Parameter Properties',
      subtitle: 'Remplacer le boilerplate classique par la syntaxe concise TS',
      sectionId: 'visibility-parameter-properties',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        "Refactorisez la classe `Produit` en supprimant les déclarations redondantes d'attributs et les affectations manuelles `this._ref = ref; this.nom = nom;`. Utilisez les Parameter Properties directement dans la signature du constructeur.",
      hint: 'constructor(private _ref: string, public nom: string, public prix: number) {}',
      initialCode: `// ❌ Syntaxe classique verbeuse à refactoriser :\nclass Produit {\n  private _ref: string;\n  public nom: string;\n  public prix: number;\n\n  constructor(ref: string, nom: string, prix: number) {\n    this._ref = ref;\n    this.nom = nom;\n    this.prix = prix;\n  }\n\n  public getRef(): string {\n    return this._ref;\n  }\n}\n\nconst p = new Produit("REF-99", "Clavier", 49.99);\nconsole.log(p.getRef(), p.nom, p.prix);\n`,
      solutionCode: `// ✨ Syntaxe concise TypeScript avec Parameter Properties :\nclass Produit {\n  constructor(\n    private _ref: string,\n    public nom: string,\n    public prix: number\n  ) {}\n\n  public getRef(): string {\n    return this._ref;\n  }\n}\n\nconst p = new Produit("REF-99", "Clavier", 49.99);\nconsole.log(p.getRef(), p.nom, p.prix);\n`,
      currentCode: `// ❌ Syntaxe classique verbeuse à refactoriser :\nclass Produit {\n  private _ref: string;\n  public nom: string;\n  public prix: number;\n\n  constructor(ref: string, nom: string, prix: number) {\n    this._ref = ref;\n    this.nom = nom;\n    this.prix = prix;\n  }\n\n  public getRef(): string {\n    return this._ref;\n  }\n}\n\nconst p = new Produit("REF-99", "Clavier", 49.99);\nconsole.log(p.getRef(), p.nom, p.prix);\n`,
      isCompleted: false,
      solutionExplanation: [
        "En préfixant un argument de constructeur par `private`, `public` ou `readonly`, TypeScript génère automatiquement l'attribut de classe et l'instruction `this.arg = arg`.",
        'Le code passe de 14 lignes à seulement 7 lignes sans aucune perte de typage ni de sécurité.',
        "C'est le standard idiomatique recommandé dans tous les projets TypeScript modernes.",
      ],
      criteria: [
        {
          id: 'c31-param-prop',
          label: 'Constructeur avec Parameter Properties',
          description:
            'Les attributs doivent être déclarés avec les modificateurs dans les paramètres du constructeur.',
          passed: false,
          hint: 'constructor(private _ref: string, public nom: string, public prix: number) {}',
        },
        {
          id: 'c31-clean-body',
          label: 'Corps de constructeur épuré',
          description:
            "Le corps du constructeur ne doit plus contenir d'assignations this._ref = ...",
          passed: false,
          hint: 'Le corps {} peut rester vide !',
        },
        {
          id: 'c31-exec',
          label: 'Exécution conforme',
          description: 'L\'objet est instancié et affiche "REF-99 Clavier 49.99".',
          passed: false,
          hint: 'console.log(p.getRef(), p.nom, p.prix);',
        },
      ],
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Violation de visibilité privée & Passerelle publique',
      subtitle: "Comprendre l'interdiction de compilation et fournir un accès maîtrisé",
      sectionId: 'visibility-parameter-properties',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        "Dans le code ci-dessous, l'instruction `u._cleSecurite` déclenche une violation de visibilité privée. Corrigez le code en retirant cet accès illégal et en implémentant une méthode publique `verifierCle(cleFournie: string): boolean` qui retourne `this._cleSecurite === cleFournie`.",
      hint: 'Implémentez public verifierCle(cle: string): boolean { return this._cleSecurite === cle; }',
      initialCode: `class Utilisateur {\n  constructor(\n    public pseudo: string,\n    private _cleSecurite: string\n  ) {}\n}\n\nconst u = new Utilisateur("Neo", "Matrix123");\n\n// ❌ Corrigez cet accès interdit qui viole private :\nconsole.log(u._cleSecurite); // Erreur TS !\n`,
      solutionCode: `class Utilisateur {\n  constructor(\n    public pseudo: string,\n    private _cleSecurite: string\n  ) {}\n\n  public verifierCle(cleFournie: string): boolean {\n    return this._cleSecurite === cleFournie;\n  }\n}\n\nconst u = new Utilisateur("Neo", "Matrix123");\nconsole.log("Clé valide ?", u.verifierCle("Matrix123")); // true\nconsole.log("Clé pirate ?", u.verifierCle("1234"));      // false\n`,
      currentCode: `class Utilisateur {\n  constructor(\n    public pseudo: string,\n    private _cleSecurite: string\n  ) {}\n}\n\nconst u = new Utilisateur("Neo", "Matrix123");\n\n// ❌ Corrigez cet accès interdit qui viole private :\nconsole.log(u._cleSecurite); // Erreur TS !\n`,
      isCompleted: false,
      solutionExplanation: [
        "`private` interdit l'accès extérieur dès la compilation TypeScript.",
        "Au lieu d'exposer le mot de passe ou la clé secrète avec un getter aveugle, on fournit une méthode métier `verifierCle(...)`.",
        "C'est une parfaite application de l'encapsulation : le secret ne sort jamais de la boîte noire.",
      ],
      criteria: [
        {
          id: 'c32-no-direct-access',
          label: 'Accès direct à _cleSecurite supprimé',
          description: 'Le code ne doit plus tenter de lire u._cleSecurite.',
          passed: false,
          hint: 'Supprimez ou remplacez console.log(u._cleSecurite).',
        },
        {
          id: 'c32-verifier-cle',
          label: 'Méthode verifierCle() implémentée',
          description: 'La méthode doit retourner true pour la bonne clé et false sinon.',
          passed: false,
          hint: 'public verifierCle(cle: string): boolean { return this._cleSecurite === cle; }',
        },
      ],
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: "Encapsulation d'une collection (Copie défensive)",
      subtitle: "Empêcher la fuite d'encapsulation par référence sur les tableaux",
      sectionId: 'visibility-parameter-properties',
      estimatedTime: '4 min',
      difficulty: 'Intermédiaire',
      statement:
        'Soit la classe `Panier` avec un tableau privé `_articles: string[]`. Si la méthode `getArticles()` renvoie `this._articles`, un code extérieur peut faire `p.getArticles().push("Piraté")` et muter le panier en douce ! Corrigez `getArticles()` en retournant une copie défensive `[...this._articles]`. Ajoutez une méthode publique `ajouter(article: string): void`.',
      hint: 'return [...this._articles]; empêche la modification externe du tableau privé.',
      initialCode: `class Panier {\n  private _articles: string[] = [];\n\n  public ajouter(article: string): void {\n    this._articles.push(article);\n  }\n\n  // Corrigez cette méthode pour retourner une copie défensive :\n  public getArticles(): string[] {\n    return this._articles; // ⚠️ Fuite d'encapsulation !\n  }\n}\n\nconst p = new Panier();\np.ajouter("Pomme");\n\n// Tentative de modification pirate par référence :\nconst liste = p.getArticles();\nliste.push("Article pirate");\n\nconsole.log("Nombre d'articles réels dans le panier :", p.getArticles().length); // Doit rester 1 !\n`,
      solutionCode: `class Panier {\n  private _articles: string[] = [];\n\n  public ajouter(article: string): void {\n    this._articles.push(article);\n  }\n\n  public getArticles(): string[] {\n    // Copie défensive : un nouveau tableau est alloué dans le tas\n    return [...this._articles];\n  }\n}\n\nconst p = new Panier();\np.ajouter("Pomme");\n\nconst liste = p.getArticles();\nliste.push("Article pirate");\n\nconsole.log("Nombre d'articles réels dans le panier :", p.getArticles().length); // 1\n`,
      currentCode: `class Panier {\n  private _articles: string[] = [];\n\n  public ajouter(article: string): void {\n    this._articles.push(article);\n  }\n\n  // Corrigez cette méthode pour retourner une copie défensive :\n  public getArticles(): string[] {\n    return this._articles; // ⚠️ Fuite d'encapsulation !\n  }\n}\n\nconst p = new Panier();\np.ajouter("Pomme");\n\n// Tentative de modification pirate par référence :\nconst liste = p.getArticles();\nliste.push("Article pirate");\n\nconsole.log("Nombre d'articles réels dans le panier :", p.getArticles().length); // Doit rester 1 !\n`,
      isCompleted: false,
      solutionExplanation: [
        'Rendre un tableau `private` ne suffit pas si un getter renvoie la référence directe de ce tableau.',
        "Le code appelant recevrait alors l'adresse mémoire de la collection et pourrait la muter (`push`, `splice`).",
        "Renvoyer `[...this._articles]` (copie défensive) protège définitivement l'invariant de la collection.",
      ],
      criteria: [
        {
          id: 'c33-defensive',
          label: 'Copie défensive [...this._articles]',
          description: 'getArticles() doit retourner un nouveau tableau cloné.',
          passed: false,
          hint: 'return [...this._articles];',
        },
        {
          id: 'c33-protected-length',
          label: 'Taille du panier reste égale à 1',
          description: "L'ajout pirate ne doit pas impacter le tableau interne du panier.",
          passed: false,
          hint: 'Vérifiez que p.getArticles().length affiche 1.',
        },
      ],
    },
    {
      id: 'ex-3-4',
      labNumber: 3,
      number: '3.4',
      title: 'Le modificateur protected (Cercle familial)',
      subtitle: 'Rendre un membre visible pour les sous-classes mais fermé au monde extérieur',
      sectionId: 'visibility-parameter-properties',
      estimatedTime: '4 min',
      difficulty: 'Intermédiaire',
      statement:
        'Créez une classe `CompteBase` avec `protected tauxInteret = 0.02;`. Créez une sous-classe `ComptePremium extends CompteBase` ayant une méthode `calculerInteret(solde: number): number` qui utilise `this.tauxInteret`. Instanciez `ComptePremium` et affichez les intérêts pour 1000€ (doit faire 20€).',
      hint: 'class ComptePremium extends CompteBase { calculerInteret(s) { return s * this.tauxInteret; } }',
      initialCode: `class CompteBase {\n  // Déclarez tauxInteret en protected ici (valeur 0.02) :\n  \n}\n\nclass ComptePremium extends CompteBase {\n  public calculerInteret(solde: number): number {\n    // Utilisez this.tauxInteret\n    return 0;\n  }\n}\n\nconst cp = new ComptePremium();\nconsole.log("Intérêts pour 1000€ :", cp.calculerInteret(1000));\n`,
      solutionCode: `class CompteBase {\n  protected tauxInteret: number = 0.02;\n}\n\nclass ComptePremium extends CompteBase {\n  public calculerInteret(solde: number): number {\n    return solde * this.tauxInteret;\n  }\n}\n\nconst cp = new ComptePremium();\nconsole.log("Intérêts pour 1000€ :", cp.calculerInteret(1000)); // 20\n`,
      currentCode: `class CompteBase {\n  // Déclarez tauxInteret en protected ici (valeur 0.02) :\n  \n}\n\nclass ComptePremium extends CompteBase {\n  public calculerInteret(solde: number): number {\n    // Utilisez this.tauxInteret\n    return 0;\n  }\n}\n\nconst cp = new ComptePremium();\nconsole.log("Intérêts pour 1000€ :", cp.calculerInteret(1000));\n`,
      isCompleted: false,
      solutionExplanation: [
        "`protected` autorise l'accès à l'intérieur de la classe et dans toutes ses classes dérivées (`extends`).",
        'En revanche, un accès externe `cp.tauxInteret` est formellement interdit par TypeScript.',
        "C'est le compromis idéal pour partager de la mécanique interne avec ses héritiers sans l'exposer au public.",
      ],
      criteria: [
        {
          id: 'c34-protected',
          label: 'tauxInteret déclaré protected',
          description: 'tauxInteret doit porter le mot-clé protected.',
          passed: false,
          hint: 'protected tauxInteret = 0.02;',
        },
        {
          id: 'c34-calc',
          label: 'Calcul correct : 20€',
          description: 'calculerInteret(1000) doit renvoyer 20.',
          passed: false,
          hint: 'return solde * this.tauxInteret;',
        },
      ],
    },

    // =========================================================================
    // LABO 4 : Getters, Setters & Propriétés Calculées (5 ex)
    // =========================================================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Thermostat contrôlé par Getter & Setter',
      subtitle: 'Intercepter la réassignation avec validation de bornes [5, 30]',
      sectionId: 'getters-setters-tell-dont-ask',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Créez une classe `Thermostat` avec un attribut privé `_temperature: number`. Écrivez un getter `get temperature()` et un setter `set temperature(v: number)`. Le setter doit rejeter toute valeur hors bornes `[5, 30]` avec `throw new Error("Hors bornes [5-30]")`.',
      hint: 'get temperature(): number { return this._temp; } set temperature(val: number) { ... }',
      initialCode: `class Thermostat {\n  private _temperature: number;\n\n  constructor(initiale: number) {\n    this._temperature = initiale;\n  }\n\n  // 1. Déclarez le getter temperature\n  \n  // 2. Déclarez le setter temperature avec validation [5, 30]\n  \n}\n\nconst t = new Thermostat(20);\nt.temperature = 23; // Appel du setter\nconsole.log("Température actuelle :", t.temperature); // 23\n`,
      solutionCode: `class Thermostat {\n  private _temperature: number;\n\n  constructor(initiale: number) {\n    this._temperature = initiale;\n  }\n\n  get temperature(): number {\n    return this._temperature;\n  }\n\n  set temperature(v: number) {\n    if (v < 5 || v > 30) {\n      throw new Error("Hors bornes [5-30]");\n    }\n    this._temperature = v;\n  }\n}\n\nconst t = new Thermostat(20);\nt.temperature = 23;\nconsole.log("Température actuelle :", t.temperature);\n`,
      currentCode: `class Thermostat {\n  private _temperature: number;\n\n  constructor(initiale: number) {\n    this._temperature = initiale;\n  }\n\n  // 1. Déclarez le getter temperature\n  \n  // 2. Déclarez le setter temperature avec validation [5, 30]\n  \n}\n\nconst t = new Thermostat(20);\nt.temperature = 23; // Appel du setter\nconsole.log("Température actuelle :", t.temperature); // 23\n`,
      isCompleted: false,
      solutionExplanation: [
        "Un setter s'utilise comme une affectation ordinaire (`t.temperature = 23`), mais exécute une fonction en coulisse.",
        'Toute valeur aberrante (`t.temperature = 99`) est interceptée et bloquée.',
        "L'état interne reste garanti dans la plage de sécurité matérielle.",
      ],
      criteria: [
        {
          id: 'c41-getter',
          label: 'Getter temperature implémenté',
          description: 'get temperature() doit retourner la température privée.',
          passed: false,
          hint: 'get temperature(): number { return this._temperature; }',
        },
        {
          id: 'c41-setter-bounds',
          label: 'Setter avec validation [5, 30]',
          description: 'Le setter doit bloquer les valeurs < 5 ou > 30.',
          passed: false,
          hint: 'if (v < 5 || v > 30) throw new Error(...);',
        },
        {
          id: 'c41-working',
          label: 'Affectation à 23 réussie',
          description: 't.temperature = 23 doit mettre à jour la valeur.',
          passed: false,
          hint: 'Vérifiez la mise à jour à 23.',
        },
      ],
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Propriété calculée dynamique (Rectangle.aire)',
      subtitle: "Garantir la synchronisation sans stocker d'attribut redondant",
      sectionId: 'getters-setters-tell-dont-ask',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        "Créez une classe `Rectangle` prenant `largeur: number` et `hauteur: number`. Définissez un getter `get aire(): number` qui renvoie `largeur * hauteur`. N'ajoutez aucun attribut `_aire`. Démontrez que modifier la largeur (via un setter ou réassignation) met à jour l'aire instantanément.",
      hint: 'get aire(): number { return this.largeur * this.hauteur; }',
      initialCode: `class Rectangle {\n  constructor(public largeur: number, public hauteur: number) {}\n\n  // Déclarez le getter calculé aire ici :\n  \n}\n\nconst rect = new Rectangle(5, 10);\nconsole.log("Aire initiale :", rect.aire); // 50\n\nrect.largeur = 8;\nconsole.log("Aire après modification largeur :", rect.aire); // 80\n`,
      solutionCode: `class Rectangle {\n  constructor(public largeur: number, public hauteur: number) {}\n\n  get aire(): number {\n    return this.largeur * this.hauteur;\n  }\n}\n\nconst rect = new Rectangle(5, 10);\nconsole.log("Aire initiale :", rect.aire);\n\nrect.largeur = 8;\nconsole.log("Aire après modification largeur :", rect.aire);\n`,
      currentCode: `class Rectangle {\n  constructor(public largeur: number, public hauteur: number) {}\n\n  // Déclarez le getter calculé aire ici :\n  \n}\n\nconst rect = new Rectangle(5, 10);\nconsole.log("Aire initiale :", rect.aire); // 50\n\nrect.largeur = 8;\nconsole.log("Aire après modification largeur :", rect.aire); // 80\n`,
      isCompleted: false,
      solutionExplanation: [
        'Une propriété calculée ne stocke aucune donnée en mémoire : elle calcule la réponse à la demande.',
        "Il est impossible d'avoir un bug de désynchronisation entre les dimensions et l'aire.",
        'Faute de setter, la propriété est automatiquement en lecture seule : `rect.aire = 100` est interdit.',
      ],
      criteria: [
        {
          id: 'c42-getter-aire',
          label: 'get aire() calculé dynamiquement',
          description: 'Le getter aire doit multiplier largeur par hauteur.',
          passed: false,
          hint: 'get aire(): number { return this.largeur * this.hauteur; }',
        },
        {
          id: 'c42-dynamic-sync',
          label: 'Synchronisation vérifiée (50 puis 80)',
          description: "L'aire doit passer de 50 à 80 après rect.largeur = 8.",
          passed: false,
          hint: 'console.log(rect.aire);',
        },
      ],
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Propriété calculée Personne.nomComplet',
      subtitle: "Assembler des chaînes sans variable d'état supplémentaire",
      sectionId: 'getters-setters-tell-dont-ask',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        'Créez une classe `Personne` avec `public prenom: string` et `public nom: string`. Ajoutez le getter `get nomComplet(): string` retournant `\`${this.prenom} ${this.nom}\``. Testez avec "Jean" "Dupont", puis changez prenom pour "Pierre" et observez que nomComplet s\'adapte sans effort.',
      hint: 'get nomComplet(): string { return `${this.prenom} ${this.nom}`; }',
      initialCode: `class Personne {\n  constructor(public prenom: string, public nom: string) {}\n\n  // Déclarez get nomComplet ici :\n  \n}\n\nconst p = new Personne("Jean", "Dupont");\nconsole.log("Nom complet 1 :", p.nomComplet);\n\np.prenom = "Pierre";\nconsole.log("Nom complet 2 :", p.nomComplet); // Pierre Dupont\n`,
      solutionCode: `class Personne {\n  constructor(public prenom: string, public nom: string) {}\n\n  get nomComplet(): string {\n    return \`\${this.prenom} \${this.nom}\`;\n  }\n}\n\nconst p = new Personne("Jean", "Dupont");\nconsole.log("Nom complet 1 :", p.nomComplet);\n\np.prenom = "Pierre";\nconsole.log("Nom complet 2 :", p.nomComplet);\n`,
      currentCode: `class Personne {\n  constructor(public prenom: string, public nom: string) {}\n\n  // Déclarez get nomComplet ici :\n  \n}\n\nconst p = new Personne("Jean", "Dupont");\nconsole.log("Nom complet 1 :", p.nomComplet);\n\np.prenom = "Pierre";\nconsole.log("Nom complet 2 :", p.nomComplet); // Pierre Dupont\n`,
      isCompleted: false,
      solutionExplanation: [
        "Éviter les variables redondantes dans l'état interne est une règle d'or en POO.",
        "Si l'on avait stocké `nomComplet` dans un attribut, changer `prenom` aurait laissé `nomComplet` périmé.",
        'Le getter garantit une vérité unique.',
      ],
      criteria: [
        {
          id: 'c43-getter',
          label: 'Getter nomComplet défini',
          description: 'get nomComplet() doit combiner prenom et nom.',
          passed: false,
          hint: 'get nomComplet(): string { return `${this.prenom} ${this.nom}`; }',
        },
        {
          id: 'c43-updated',
          label: 'Mise à jour automatique constatée',
          description: 'L\'affichage doit afficher "Pierre Dupont" après modification de prenom.',
          passed: false,
          hint: 'console.log(p.nomComplet);',
        },
      ],
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: "Remplacement du faux setter (Tell, Don't Ask)",
      subtitle: "Passer d'un setter anémique à des méthodes d'action porteuses de sens",
      sectionId: 'getters-setters-tell-dont-ask',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Voici une classe avec un anti-pattern de faux setter aveugle : `set solde(v) { this._solde = v; }`. Supprimez ce setter et remplacez-le par deux méthodes intentionnelles : `crediter(montant: number)` et `debiter(montant: number)` qui valident `montant > 0` et refusent le débit si le solde est insuffisant.',
      hint: 'Retirez set solde. Ajoutez public crediter(m) et public debiter(m).',
      initialCode: `class Compte {\n  private _solde: number = 0;\n\n  public getSolde(): number { return this._solde; }\n\n  // ❌ Supprimez ce faux setter aveugle :\n  public setSolde(v: number): void {\n    this._solde = v;\n  }\n\n  // ✨ Ajoutez crediter(montant) et debiter(montant) ici :\n  \n}\n\nconst c = new Compte();\nc.crediter(100);\nc.debiter(30);\nconsole.log("Solde après opérations :", c.getSolde()); // 70\n`,
      solutionCode: `class Compte {\n  private _solde: number = 0;\n\n  public getSolde(): number { return this._solde; }\n\n  public crediter(montant: number): void {\n    if (montant <= 0) throw new Error("Montant invalide");\n    this._solde += montant;\n  }\n\n  public debiter(montant: number): void {\n    if (montant <= 0) throw new Error("Montant invalide");\n    if (montant > this._solde) throw new Error("Fonds insuffisants");\n    this._solde -= montant;\n  }\n}\n\nconst c = new Compte();\nc.crediter(100);\nc.debiter(30);\nconsole.log("Solde après opérations :", c.getSolde());\n`,
      currentCode: `class Compte {\n  private _solde: number = 0;\n\n  public getSolde(): number { return this._solde; }\n\n  // ❌ Supprimez ce faux setter aveugle :\n  public setSolde(v: number): void {\n    this._solde = v;\n  }\n\n  // ✨ Ajoutez crediter(montant) et debiter(montant) ici :\n  \n}\n\nconst c = new Compte();\nc.crediter(100);\nc.debiter(30);\nconsole.log("Solde après opérations :", c.getSolde()); // 70\n`,
      isCompleted: false,
      solutionExplanation: [
        "Le faux setter est un anti-pattern : il brise l'encapsulation en permettant au monde extérieur de fixer n'importe quelle valeur.",
        "Le principe 'Tell, Don't Ask' demande à l'objet d'accomplir une tâche (`crediter`, `debiter`).",
        "L'objet reste maître absolu de ses transitions d'état.",
      ],
      criteria: [
        {
          id: 'c44-methods',
          label: 'Méthodes crediter et debiter créées',
          description: 'Les méthodes crediter et debiter doivent être présentes et fonctionnelles.',
          passed: false,
          hint: 'public crediter(m: number): void { ... }',
        },
        {
          id: 'c44-result',
          label: 'Solde final égal à 70',
          description: 'Après crédit de 100 et débit de 30, le solde doit être 70.',
          passed: false,
          hint: 'console.log(c.getSolde());',
        },
      ],
    },
    {
      id: 'ex-4-5',
      labNumber: 4,
      number: '4.5',
      title: 'Getter avec transformation (Mot de passe masqué)',
      subtitle: 'Exposer une vue formatée sécurisée sans dévoiler la valeur brute',
      sectionId: 'getters-setters-tell-dont-ask',
      estimatedTime: '3 min',
      difficulty: 'Facile',
      statement:
        'Créez une classe `CompteUtilisateur` recevant un mot de passe privé dans le constructeur `(private _mdp: string)`. Créez un getter `get motDePasseMasque(): string` qui retourne une chaîne d\'astérisques `*` de la même longueur que le mot de passe (`"*".repeat(this._mdp.length)`). Testez avec "secret123" (longueur 9).',
      hint: 'get motDePasseMasque(): string { return "*".repeat(this._mdp.length); }',
      initialCode: `class CompteUtilisateur {\n  constructor(private _mdp: string) {}\n\n  // Implémentez le getter motDePasseMasque ici :\n  \n}\n\nconst compte = new CompteUtilisateur("secret123");\nconsole.log("Affichage sécurisé :", compte.motDePasseMasque);\n`,
      solutionCode: `class CompteUtilisateur {\n  constructor(private _mdp: string) {}\n\n  get motDePasseMasque(): string {\n    return "*".repeat(this._mdp.length);\n  }\n}\n\nconst compte = new CompteUtilisateur("secret123");\nconsole.log("Affichage sécurisé :", compte.motDePasseMasque); // *********\n`,
      currentCode: `class CompteUtilisateur {\n  constructor(private _mdp: string) {}\n\n  // Implémentez le getter motDePasseMasque ici :\n  \n}\n\nconst compte = new CompteUtilisateur("secret123");\nconsole.log("Affichage sécurisé :", compte.motDePasseMasque);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Un getter n'est pas tenu de renvoyer la valeur exacte d'un champ privé.",
        'Il peut appliquer un formatage, un masquage ou une conversion à la volée.',
        "L'interface publique reste ainsi sécurisée et ergonomique pour l'UI.",
      ],
      criteria: [
        {
          id: 'c45-mask-getter',
          label: 'Getter motDePasseMasque implémenté',
          description: 'Le getter doit retourner des étoiles correspondant à la longueur.',
          passed: false,
          hint: 'return "*".repeat(this._mdp.length);',
        },
        {
          id: 'c45-length-match',
          label: 'Masquage de 9 caractères vérifié',
          description: 'Pour "secret123", la sortie doit contenir exactement 9 astérisques.',
          passed: false,
          hint: 'console.log(compte.motDePasseMasque);',
        },
      ],
    },

    // =========================================================================
    // LABO 5 : Instance vs Static & Scope de this (4 ex)
    // =========================================================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: "Compteur global d'instances (Voiture.totalFabriquees)",
      subtitle: "Partager un état unique à l'échelle de la classe entière",
      sectionId: 'instance-vs-static',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        'Créez une classe `Voiture` avec un attribut statique `public static totalFabriquees: number = 0;`. Dans le constructeur, incrémentez `Voiture.totalFabriquees++`. Instanciez 3 voitures et affichez `Voiture.totalFabriquees` (doit afficher 3).',
      hint: 'Voiture.totalFabriquees++; dans le constructeur.',
      initialCode: `class Voiture {\n  // Déclarez l'attribut static totalFabriquees ici :\n  \n  constructor(public marque: string) {\n    // Incrémentez le compteur de classe ici\n  }\n}\n\nconst v1 = new Voiture("Toyota");\nconst v2 = new Voiture("Renault");\nconst v3 = new Voiture("Tesla");\n\nconsole.log("Total de voitures fabriquées :", Voiture.totalFabriquees);\n`,
      solutionCode: `class Voiture {\n  public static totalFabriquees: number = 0;\n\n  constructor(public marque: string) {\n    Voiture.totalFabriquees++;\n  }\n}\n\nconst v1 = new Voiture("Toyota");\nconst v2 = new Voiture("Renault");\nconst v3 = new Voiture("Tesla");\n\nconsole.log("Total de voitures fabriquées :", Voiture.totalFabriquees); // 3\n`,
      currentCode: `class Voiture {\n  // Déclarez l'attribut static totalFabriquees ici :\n  \n  constructor(public marque: string) {\n    // Incrémentez le compteur de classe ici\n  }\n}\n\nconst v1 = new Voiture("Toyota");\nconst v2 = new Voiture("Renault");\nconst v3 = new Voiture("Tesla");\n\nconsole.log("Total de voitures fabriquées :", Voiture.totalFabriquees);\n`,
      isCompleted: false,
      solutionExplanation: [
        '`static` rattache la variable à la classe elle-même, et non aux objets individuels.',
        "Il n'existe qu'une seule case mémoire pour `totalFabriquees` partagée par toute l'application.",
        'Chaque appel à `new` exécute le constructeur qui incrémente ce registre commun.',
      ],
      criteria: [
        {
          id: 'c51-static-field',
          label: 'Attribut public static totalFabriquees = 0',
          description: 'La classe doit posséder un champ statique initialisé à 0.',
          passed: false,
          hint: 'public static totalFabriquees: number = 0;',
        },
        {
          id: 'c51-count-3',
          label: 'Compteur final égal à 3',
          description: 'Après création de 3 instances, le total doit être 3.',
          passed: false,
          hint: 'console.log(Voiture.totalFabriquees);',
        },
      ],
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Fonction utilitaire statique (Convertisseur)',
      subtitle: "Exécuter un calcul sans avoir besoin d'instancier un objet",
      sectionId: 'instance-vs-static',
      estimatedTime: '3 min',
      difficulty: 'Débutant',
      statement:
        'Créez une classe `Convertisseur` sans constructeur, possédant une méthode statique `public static celsiusEnFahrenheit(c: number): number` qui retourne `(c * 9/5) + 32`. Appelez la méthode directement via la classe sans faire de `new`.',
      hint: 'Convertisseur.celsiusEnFahrenheit(100); doit retourner 212.',
      initialCode: `class Convertisseur {\n  // Déclarez la méthode static celsiusEnFahrenheit(c: number): number ici :\n  \n}\n\n// Appel direct sans instanciation :\nconst f100 = Convertisseur.celsiusEnFahrenheit(100);\nconsole.log("100°C en Fahrenheit :", f100); // 212\n`,
      solutionCode: `class Convertisseur {\n  public static celsiusEnFahrenheit(c: number): number {\n    return (c * 9/5) + 32;\n  }\n}\n\nconst f100 = Convertisseur.celsiusEnFahrenheit(100);\nconsole.log("100°C en Fahrenheit :", f100);\n`,
      currentCode: `class Convertisseur {\n  // Déclarez la méthode static celsiusEnFahrenheit(c: number): number ici :\n  \n}\n\n// Appel direct sans instanciation :\nconst f100 = Convertisseur.celsiusEnFahrenheit(100);\nconsole.log("100°C en Fahrenheit :", f100); // 212\n`,
      isCompleted: false,
      solutionExplanation: [
        "Quand une fonction n'a besoin d'aucun état propre à une instance, `static` est la solution idéale (comme `Math.max()` ou `Math.round()`).",
        "Aucun objet n'est alloué dans le tas : l'exécution est directe et économe en mémoire.",
      ],
      criteria: [
        {
          id: 'c52-static-method',
          label: 'Méthode static celsiusEnFahrenheit',
          description: 'La méthode doit être déclarée static.',
          passed: false,
          hint: 'public static celsiusEnFahrenheit(c: number): number',
        },
        {
          id: 'c52-correct-math',
          label: 'Résultat exact : 212 pour 100°C',
          description: 'La conversion de 100°C doit donner 212°F.',
          passed: false,
          hint: 'return (c * 9/5) + 32;',
        },
      ],
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: "L'interdiction de this en contexte statique",
      subtitle: "Comprendre pourquoi le plan d'architecte ne peut pas viser une maison",
      sectionId: 'instance-vs-static',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        "Le code ci-dessous produit une erreur car la méthode statique tente d'accéder à `this.nom`. Corrigez l'erreur en passant l'instance en paramètre de la méthode statique : `public static formater(u: Profil): string { return u.nom.toUpperCase(); }`.",
      hint: 'Remplacez this.nom par u.nom en recevant u: Profil en argument.',
      initialCode: `class Profil {\n  constructor(public nom: string) {}\n\n  // ❌ ERREUR : this n'existe pas en static !\n  public static formater(): string {\n    // return this.nom.toUpperCase(); // Erreur TS !\n    return "";\n  }\n}\n\nconst p = new Profil("sophie");\n// Appelez Profil.formater(p) et affichez le résultat\n`,
      solutionCode: `class Profil {\n  constructor(public nom: string) {}\n\n  public static formater(u: Profil): string {\n    return u.nom.toUpperCase();\n  }\n}\n\nconst p = new Profil("sophie");\nconsole.log("Nom formaté :", Profil.formater(p)); // SOPHIE\n`,
      currentCode: `class Profil {\n  constructor(public nom: string) {}\n\n  // ❌ ERREUR : this n'existe pas en static !\n  public static formater(): string {\n    // return this.nom.toUpperCase(); // Erreur TS !\n    return "";\n  }\n}\n\nconst p = new Profil("sophie");\n// Appelez Profil.formater(p) et affichez le résultat\n`,
      isCompleted: false,
      solutionExplanation: [
        "`this` représente l'objet sur lequel une méthode d'instance est appelée.",
        "Lors de l'appel d'une méthode statique, aucune instance n'est sélectionnée : `this` n'a aucun sens physique.",
        'Pour manipuler une instance depuis une méthode statique, il faut obligatoirement la lui transmettre en paramètre.',
      ],
      criteria: [
        {
          id: 'c53-param',
          label: 'Paramètre instance ajouté en static',
          description: 'formater doit accepter un argument Profil.',
          passed: false,
          hint: 'public static formater(u: Profil): string',
        },
        {
          id: 'c53-uppercase',
          label: 'Affichage de "SOPHIE"',
          description: "Le résultat formaté en majuscules doit s'afficher.",
          passed: false,
          hint: 'console.log(Profil.formater(p));',
        },
      ],
    },
    {
      id: 'ex-5-4',
      labNumber: 5,
      number: '5.4',
      title: 'Constantes de configuration de classe',
      subtitle: 'Définir des règles globales avec static readonly',
      sectionId: 'instance-vs-static',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Dans la classe `Guichet`, déclarez une constante de classe `public static readonly PLAFOND_RETRAIT: number = 1000;`. Ajoutez une méthode `public autoriserRetrait(montant: number): boolean` qui vérifie que le montant ne dépasse pas `Guichet.PLAFOND_RETRAIT`. Testez avec 500€ (autorisé) et 1500€ (refusé).',
      hint: 'return montant <= Guichet.PLAFOND_RETRAIT;',
      initialCode: `class Guichet {\n  // Déclarez la constante de classe PLAFOND_RETRAIT = 1000 ici :\n  \n  public autoriserRetrait(montant: number): boolean {\n    // Comparez avec Guichet.PLAFOND_RETRAIT\n    return false;\n  }\n}\n\nconst g = new Guichet();\nconsole.log("Retrait 500€ autorisé ?", g.autoriserRetrait(500));   // true\nconsole.log("Retrait 1500€ autorisé ?", g.autoriserRetrait(1500)); // false\n`,
      solutionCode: `class Guichet {\n  public static readonly PLAFOND_RETRAIT: number = 1000;\n\n  public autoriserRetrait(montant: number): boolean {\n    return montant <= Guichet.PLAFOND_RETRAIT;\n  }\n}\n\nconst g = new Guichet();\nconsole.log("Retrait 500€ autorisé ?", g.autoriserRetrait(500));\nconsole.log("Retrait 1500€ autorisé ?", g.autoriserRetrait(1500));\n`,
      currentCode: `class Guichet {\n  // Déclarez la constante de classe PLAFOND_RETRAIT = 1000 ici :\n  \n  public autoriserRetrait(montant: number): boolean {\n    // Comparez avec Guichet.PLAFOND_RETRAIT\n    return false;\n  }\n}\n\nconst g = new Guichet();\nconsole.log("Retrait 500€ autorisé ?", g.autoriserRetrait(500));   // true\nconsole.log("Retrait 1500€ autorisé ?", g.autoriserRetrait(1500)); // false\n`,
      isCompleted: false,
      solutionExplanation: [
        "`static readonly` crée une constante partagée immuable à l'échelle de toute la classe.",
        'Cela évite de dupliquer la valeur 1000 dans chaque objet alloué dans le tas.',
        'Si le plafond change un jour, il suffit de le modifier à un seul endroit.',
      ],
      criteria: [
        {
          id: 'c54-const',
          label: 'static readonly PLAFOND_RETRAIT = 1000',
          description: 'La constante de classe doit être déclarée.',
          passed: false,
          hint: 'public static readonly PLAFOND_RETRAIT = 1000;',
        },
        {
          id: 'c54-check',
          label: 'Validation 500 (true) et 1500 (false)',
          description: 'autoriserRetrait doit retourner true pour 500 et false pour 1500.',
          passed: false,
          hint: 'return montant <= Guichet.PLAFOND_RETRAIT;',
        },
      ],
    },

    // =========================================================================
    // LABO 6 : Static Factories & Pattern Enum-like (4 ex)
    // =========================================================================
    {
      id: 'ex-6-1',
      labNumber: 6,
      number: '6.1',
      title: 'Constructeur privé & Fabriques Statiques',
      subtitle: 'Surmonter la limite du constructeur unique avec des constructeurs nommés',
      sectionId: 'advanced-mechanisms',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'Créez une classe `Utilisateur` avec un constructeur `private constructor(public readonly id: string, public nom: string, public readonly role: string) {}`. Écrivez deux fabriques statiques : `static creerInvite(nom: string): Utilisateur` (rôle "invite", id "INV-xxx") et `static creerAdmin(nom: string): Utilisateur` (rôle "admin", id "ADM-xxx").',
      hint: 'private constructor(...) empêche le "new" externe et force l\'usage des fabriques.',
      initialCode: `class Utilisateur {\n  // 1. Constructeur privé\n  constructor(\n    public readonly id: string,\n    public nom: string,\n    public readonly role: string\n  ) {}\n\n  // 2. Fabrique creerInvite\n  \n  // 3. Fabrique creerAdmin\n  \n}\n\n// Instanciation via fabriques nommées :\nconst u1 = Utilisateur.creerInvite("Lucas");\nconst u2 = Utilisateur.creerAdmin("Sarah");\n\nconsole.log(u1.id, u1.nom, u1.role);\nconsole.log(u2.id, u2.nom, u2.role);\n`,
      solutionCode: `class Utilisateur {\n  private constructor(\n    public readonly id: string,\n    public nom: string,\n    public readonly role: string\n  ) {}\n\n  public static creerInvite(nom: string): Utilisateur {\n    return new Utilisateur("INV-" + Math.floor(Math.random() * 1000), nom, "invite");\n  }\n\n  public static creerAdmin(nom: string): Utilisateur {\n    return new Utilisateur("ADM-" + Math.floor(Math.random() * 1000), nom, "admin");\n  }\n}\n\nconst u1 = Utilisateur.creerInvite("Lucas");\nconst u2 = Utilisateur.creerAdmin("Sarah");\n\nconsole.log(u1.nom, u1.role);\nconsole.log(u2.nom, u2.role);\n`,
      currentCode: `class Utilisateur {\n  // 1. Constructeur privé\n  constructor(\n    public readonly id: string,\n    public nom: string,\n    public readonly role: string\n  ) {}\n\n  // 2. Fabrique creerInvite\n  \n  // 3. Fabrique creerAdmin\n  \n}\n\n// Instanciation via fabriques nommées :\nconst u1 = Utilisateur.creerInvite("Lucas");\nconst u2 = Utilisateur.creerAdmin("Sarah");\n\nconsole.log(u1.id, u1.nom, u1.role);\nconsole.log(u2.nom, u2.role);\n`,
      isCompleted: false,
      solutionExplanation: [
        "Puisque TypeScript n'autorise qu'un seul constructeur par classe, les fabriques statiques permettent d'offrir plusieurs manières explicites d'instancier.",
        'Le constructeur privé réserve le pouvoir de création à la classe elle-même.',
        'Le code client gagne énormément en lisibilité : `creerInvite()` est limpide.',
      ],
      criteria: [
        {
          id: 'c61-private-ctor',
          label: 'Constructeur privé',
          description: 'Le constructeur doit être privé.',
          passed: false,
          hint: 'private constructor(...)',
        },
        {
          id: 'c61-factories',
          label: 'Fabriques creerInvite et creerAdmin fonctionnelles',
          description:
            'Les deux fabriques statiques doivent instancier les objets avec les rôles correspondants.',
          passed: false,
          hint: 'static creerInvite(nom): Utilisateur { return new Utilisateur(...); }',
        },
        {
          id: 'c61-roles',
          label: 'Vérification des rôles "invite" et "admin"',
          description: 'u1.role doit être "invite" et u2.role "admin".',
          passed: false,
          hint: 'console.log(u1.role, u2.role);',
        },
      ],
    },
    {
      id: 'ex-6-2',
      labNumber: 6,
      number: '6.2',
      title: 'Énumération typée (StatutCommande)',
      subtitle: "Sécuriser les transitions d'état avec un ensemble fermé de constantes",
      sectionId: 'advanced-mechanisms',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Définissez `enum StatutCommande { EnAttente, Payee, Livree }`. Créez une classe `Commande` avec `private _statut: StatutCommande = StatutCommande.EnAttente`. Ajoutez les méthodes `payer()` (passe à Payee) et `expedier()` qui vérifie que le statut est `Payee` avant de passer à `Livree`, sinon lève `throw new Error("Commande non payée")`.',
      hint: 'if (this._statut !== StatutCommande.Payee) throw new Error("Commande non payée");',
      initialCode: `// 1. Déclarez l'enum StatutCommande ici :\n\nclass Commande {\n  private _statut = StatutCommande.EnAttente;\n\n  public getStatut(): StatutCommande {\n    return this._statut;\n  }\n\n  public payer(): void {\n    this._statut = StatutCommande.Payee;\n  }\n\n  // Implémentez expedier() avec validation du statut Payee :\n  \n}\n\nconst cmd = new Commande();\ncmd.payer();\ncmd.expedier();\nconsole.log("Statut final :", cmd.getStatut()); // StatutCommande.Livree (2)\n`,
      solutionCode: `enum StatutCommande {\n  EnAttente,\n  Payee,\n  Livree\n}\n\nclass Commande {\n  private _statut = StatutCommande.EnAttente;\n\n  public getStatut(): StatutCommande {\n    return this._statut;\n  }\n\n  public payer(): void {\n    this._statut = StatutCommande.Payee;\n  }\n\n  public expedier(): void {\n    if (this._statut !== StatutCommande.Payee) {\n      throw new Error("Commande non payée");\n    }\n    this._statut = StatutCommande.Livree;\n  }\n}\n\nconst cmd = new Commande();\ncmd.payer();\ncmd.expedier();\nconsole.log("Statut final :", cmd.getStatut());\n`,
      currentCode: `// 1. Déclarez l'enum StatutCommande ici :\n\nclass Commande {\n  private _statut = StatutCommande.EnAttente;\n\n  public getStatut(): StatutCommande {\n    return this._statut;\n  }\n\n  public payer(): void {\n    this._statut = StatutCommande.Payee;\n  }\n\n  // Implémentez expedier() avec validation du statut Payee :\n  \n}\n\nconst cmd = new Commande();\ncmd.payer();\ncmd.expedier();\nconsole.log("Statut final :", cmd.getStatut()); // StatutCommande.Livree (2)\n`,
      isCompleted: false,
      solutionExplanation: [
        "Un `enum` ferme l'ensemble des valeurs possibles : impossible d'injecter une chaîne invalide comme 'EN_ROUTE'.",
        "La méthode `expedier()` garantit la machine à états : on ne peut expédier qu'une commande préalablement payée.",
        "Les invariants de transition d'état sont ainsi inviolables.",
      ],
      criteria: [
        {
          id: 'c62-enum',
          label: 'enum StatutCommande défini',
          description: "L'énumération doit contenir EnAttente, Payee, Livree.",
          passed: false,
          hint: 'enum StatutCommande { EnAttente, Payee, Livree }',
        },
        {
          id: 'c62-expedier-check',
          label: 'Validation du statut dans expedier()',
          description: "expedier() doit lever une exception si le statut n'est pas Payee.",
          passed: false,
          hint: 'if (this._statut !== StatutCommande.Payee) throw new Error(...);',
        },
        {
          id: 'c62-delivered',
          label: 'Passage avec succès au statut Livree',
          description: 'Après payer() puis expedier(), le statut doit être Livree.',
          passed: false,
          hint: 'cmd.payer(); cmd.expedier();',
        },
      ],
    },
    {
      id: 'ex-6-3',
      labNumber: 6,
      number: '6.3',
      title: 'Pattern Enum-like avec instances riches (Devise)',
      subtitle: 'Créer des instances statiques uniques portant des calculs métiers',
      sectionId: 'advanced-mechanisms',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'Créez une classe `Devise` avec constructeur privé `(public readonly code: string, public readonly symbole: string, public readonly tauxVersEur: number)`. Déclarez 3 instances statiques uniques : `Devise.EUR` ("EUR", "€", 1.0), `Devise.USD` ("USD", "$", 0.92), `Devise.GBP` ("GBP", "£", 1.17). Ajoutez une méthode `convertirEnEur(montant: number): number`.',
      hint: 'public static readonly EUR = new Devise("EUR", "€", 1.0);',
      initialCode: `class Devise {\n  // Instances statiques uniques partagées :\n  \n  private constructor(\n    public readonly code: string,\n    public readonly symbole: string,\n    public readonly tauxVersEur: number\n  ) {}\n\n  public convertirEnEur(montant: number): number {\n    return montant * this.tauxVersEur;\n  }\n}\n\n// Testez la conversion de 100 USD en EUR :\nconst centDollarsEnEur = Devise.USD.convertirEnEur(100);\nconsole.log("100 USD en EUR :", centDollarsEnEur); // 92\n`,
      solutionCode: `class Devise {\n  public static readonly EUR = new Devise("EUR", "€", 1.0);\n  public static readonly USD = new Devise("USD", "$", 0.92);\n  public static readonly GBP = new Devise("GBP", "£", 1.17);\n\n  private constructor(\n    public readonly code: string,\n    public readonly symbole: string,\n    public readonly tauxVersEur: number\n  ) {}\n\n  public convertirEnEur(montant: number): number {\n    return montant * this.tauxVersEur;\n  }\n}\n\nconst centDollarsEnEur = Devise.USD.convertirEnEur(100);\nconsole.log("100 USD en EUR :", centDollarsEnEur);\n`,
      currentCode: `class Devise {\n  // Instances statiques uniques partagées :\n  \n  private constructor(\n    public readonly code: string,\n    public readonly symbole: string,\n    public readonly tauxVersEur: number\n  ) {}\n\n  public convertirEnEur(montant: number): number {\n    return montant * this.tauxVersEur;\n  }\n}\n\n// Testez la conversion de 100 USD en EUR :\nconst centDollarsEnEur = Devise.USD.convertirEnEur(100);\nconsole.log("100 USD en EUR :", centDollarsEnEur); // 92\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le pattern Enum-like dépasse un simple enum en associant des données riches et des méthodes à chaque valeur.',
        "Grâce au constructeur privé, personne ne peut créer de fausse devise : le jeu d'instances en RAM est strictement clos.",
        "Une seule instance de chaque devise existe en mémoire pour toute l'application.",
      ],
      criteria: [
        {
          id: 'c63-static-instances',
          label: 'Instances statiques EUR, USD, GBP',
          description: 'Devise.EUR, Devise.USD et Devise.GBP doivent être définies.',
          passed: false,
          hint: 'public static readonly EUR = new Devise(...);',
        },
        {
          id: 'c63-calc-usd',
          label: 'Conversion de 100 USD = 92 EUR',
          description: 'Devise.USD.convertirEnEur(100) doit retourner 92.',
          passed: false,
          hint: 'console.log(Devise.USD.convertirEnEur(100));',
        },
      ],
    },
    {
      id: 'ex-6-4',
      labNumber: 6,
      number: '6.4',
      title: "Correction de l'ordre d'initialisation statique",
      subtitle: 'Comprendre et réparer le crash TypeError: _registre is undefined',
      sectionId: 'advanced-mechanisms',
      estimatedTime: '4 min',
      difficulty: 'Intermédiaire',
      statement:
        "Le code ci-dessous plante car les instances statiques `TERRE` et `MARS` s'exécutent AVANT la déclaration du tableau statique `_registre`, provoquant `TypeError: Cannot read properties of undefined (reading 'push')`. Corrigez l'ordre de déclaration pour que le tableau `_registre` soit initialisé AVANT les instances statiques.",
      hint: 'Déplacez la ligne "private static readonly _registre: Planete[] = [];" au tout début de la classe, avant TERRE.',
      initialCode: `class Planete {\n  // ❌ ERREUR D'ORDRE : Déclarées avant _registre !\n  public static readonly TERRE = new Planete("Terre", 9.81);\n  public static readonly MARS = new Planete("Mars", 3.71);\n\n  private constructor(public nom: string, public gravite: number) {\n    Planete._registre.push(this);\n  }\n\n  public static toutes(): Planete[] {\n    return [...Planete._registre];\n  }\n}\n\nconsole.log("Nombre de planètes enregistrées :", Planete.toutes().length);\n`,
      solutionCode: `class Planete {\n  // ✅ Ordre corrigé : Le registre est initialisé en premier\n  private static readonly _registre: Planete[] = [];\n\n  public static readonly TERRE = new Planete("Terre", 9.81);\n  public static readonly MARS = new Planete("Mars", 3.71);\n\n  private constructor(public nom: string, public gravite: number) {\n    Planete._registre.push(this);\n  }\n\n  public static toutes(): Planete[] {\n    return [...Planete._registre];\n  }\n}\n\nconsole.log("Nombre de planètes enregistrées :", Planete.toutes().length); // 2\n`,
      currentCode: `class Planete {\n  // ❌ ERREUR D'ORDRE : Déclarées avant _registre !\n  public static readonly TERRE = new Planete("Terre", 9.81);\n  public static readonly MARS = new Planete("Mars", 3.71);\n\n  private constructor(public nom: string, public gravite: number) {\n    Planete._registre.push(this);\n  }\n\n  public static toutes(): Planete[] {\n    return [...Planete._registre];\n  }\n}\n\nconsole.log("Nombre de planètes enregistrées :", Planete.toutes().length);\n`,
      isCompleted: false,
      solutionExplanation: [
        "En JavaScript et TypeScript, les champs statiques d'une classe sont évalués séquentiellement de haut en bas lors du chargement.",
        "Si une instance statique tente d'accéder à une collection statique déclarée plus bas, cette dernière vaut encore `undefined` au moment de l'appel.",
        "Toujours déclarer les registres statiques avant les instances statiques qui s'y enregistrent.",
      ],
      criteria: [
        {
          id: 'c64-order',
          label: '_registre déclaré avant les instances',
          description: '_registre doit être positionné avant TERRE et MARS.',
          passed: false,
          hint: 'Placez private static readonly _registre: Planete[] = []; en première ligne de la classe.',
        },
        {
          id: 'c64-registered-count',
          label: 'Enregistrement de 2 planètes validé',
          description: 'Planete.toutes().length doit retourner 2 sans exception.',
          passed: false,
          hint: 'console.log(Planete.toutes().length);',
        },
      ],
    },
  ]);

  readonly completedCount = computed(() => {
    return this.exercises().filter((e) => e.isCompleted).length;
  });

  readonly totalCount = computed(() => {
    return this.exercises().length;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  readonly activeExercise = computed(() => {
    const list = this.exercises();
    const idx = this.activeExerciseIndex();
    return list[idx] || list[0];
  });

  constructor() {
    this.loadFromStorage();
  }

  getExercisesForLab(labNumber: number): Exercise[] {
    return this.exercises().filter((e) => e.labNumber === labNumber);
  }

  selectExercise(exerciseId: string): void {
    const idx = this.exercises().findIndex((e) => e.id === exerciseId);
    if (idx !== -1) {
      this.activeExerciseIndex.set(idx);
    }
  }

  updateExerciseCode(exerciseId: string, newCode: string): void {
    this.exercises.update((list) => {
      return list.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, currentCode: newCode };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  resetExerciseCode(exerciseId: string): void {
    this.exercises.update((list) => {
      return list.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, currentCode: ex.initialCode };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  injectSolutionCode(exerciseId: string): void {
    this.exercises.update((list) => {
      return list.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, currentCode: ex.solutionCode };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  /**
   * Évalue le code de l'exercice avec la suite de critères automatiques
   */
  validateExercise(
    targetId: string,
    code: string,
  ): { success: boolean; logs: ConsoleLogEntry[]; error?: string } {
    const ex = this.exercises().find((e) => e.id === targetId);
    if (!ex) {
      return { success: false, logs: [] };
    }

    const exec = this.transpiler.executeCode(code);
    const updatedCriteria = ex.criteria.map((c) => ({ ...c }));
    let allPassed = false;

    switch (targetId) {
      case 'ex-1-1': {
        const declared =
          /noteInitiale\s*=\s*14/.test(code) && /noteCopie\s*=\s*noteInitiale/.test(code);
        const modified = /noteCopie\s*=\s*18/.test(code);
        const has14 = exec.logs.some((l) => l.text.includes('14'));
        const has18 = exec.logs.some((l) => l.text.includes('18'));
        updatedCriteria[0].passed = declared;
        updatedCriteria[1].passed = modified;
        updatedCriteria[2].passed = has14 && has18;
        allPassed = declared && modified && has14 && has18;
        break;
      }

      case 'ex-1-2': {
        const hasSpread = /\{\s*\.\.\.user1\s*\}/.test(code) || /Object\.assign\s*\(/.test(code);
        const user1Is10 =
          exec.logs.some((l) => l.text.includes('user1') && l.text.includes('10')) ||
          (exec.logs.length >= 2 && exec.logs[0].text.includes('10'));
        const user2Is50 =
          exec.logs.some((l) => l.text.includes('user2') && l.text.includes('50')) ||
          (exec.logs.length >= 2 && exec.logs[1].text.includes('50'));
        updatedCriteria[0].passed = hasSpread;
        updatedCriteria[1].passed = user1Is10;
        updatedCriteria[2].passed = user2Is50;
        allPassed = hasSpread && user1Is10 && user2Is50;
        break;
      }

      case 'ex-1-3': {
        const funcDef =
          /function\s+reinitialiserScore/.test(code) || /const\s+reinitialiserScore\s*=/.test(code);
        const assignsZero = /score\s*=\s*0/.test(code);
        const callsFunc = /reinitialiserScore\s*\(\s*hero\s*\)/.test(code);
        const loggedZero = exec.logs.some((l) => l.text.includes('0'));
        updatedCriteria[0].passed = funcDef && assignsZero;
        updatedCriteria[1].passed = callsFunc && loggedZero;
        allPassed = funcDef && assignsZero && callsFunc && loggedZero;
        break;
      }

      case 'ex-1-4': {
        const freezeUsed = /Object\.freeze\s*\(/.test(code);
        const logged3 = exec.logs.some((l) => l.text.includes('3'));
        updatedCriteria[0].passed = freezeUsed;
        updatedCriteria[1].passed = logged3;
        allPassed = freezeUsed && logged3;
        break;
      }

      case 'ex-2-1': {
        const hasThrow = /throw\s+new\s+Error/.test(code);
        const hasBounds = /(< 0|> 20|<= 0|>= 20)/.test(code);
        const hasGetValeur = /getValeur\s*\(\s*\)/.test(code);
        const logged16 = exec.logs.some((l) => l.text.includes('16'));
        const caughtErr = exec.logs.some(
          (l) =>
            l.text.toLowerCase().includes('invalide') || l.text.toLowerCase().includes('erreur'),
        );
        updatedCriteria[0].passed = hasThrow && hasBounds;
        updatedCriteria[1].passed = hasGetValeur && logged16;
        updatedCriteria[2].passed = caughtErr;
        allPassed = hasThrow && hasBounds && hasGetValeur && logged16 && caughtErr;
        break;
      }

      case 'ex-2-2': {
        const throwNeg = /throw\s+new\s+Error/.test(code) && /<\s*0/.test(code);
        const logged500 = exec.logs.some((l) => l.text.includes('500'));
        updatedCriteria[0].passed = throwNeg;
        updatedCriteria[1].passed = logged500;
        allPassed = throwNeg && logged500;
        break;
      }

      case 'ex-2-3': {
        const hasRetirer = /retirer\s*\(\s*montant/.test(code);
        const checkOverdraft = /(montant\s*>\s*(this\.)?_solde|_solde\s*<\s*montant)/.test(code);
        const logged60 = exec.logs.some((l) => l.text.includes('60'));
        updatedCriteria[0].passed = hasRetirer;
        updatedCriteria[1].passed = logged60;
        updatedCriteria[2].passed = checkOverdraft;
        allPassed = hasRetirer && checkOverdraft && logged60;
        break;
      }

      case 'ex-2-4': {
        const hasReadonly = /readonly\s+rib/.test(code);
        const loggedRib = exec.logs.some((l) => l.text.includes('BE12-3456-7890'));
        updatedCriteria[0].passed = hasReadonly;
        updatedCriteria[1].passed = loggedRib;
        allPassed = hasReadonly && loggedRib;
        break;
      }

      case 'ex-2-5': {
        const hasTimeCheck = /getTime\(\)/.test(code) && /(<=|<|>|>=)/.test(code);
        const logged10 = exec.logs.some((l) => l.text.includes('10'));
        updatedCriteria[0].passed = hasTimeCheck;
        updatedCriteria[1].passed = logged10;
        allPassed = hasTimeCheck && logged10;
        break;
      }

      case 'ex-3-1': {
        const usesParamProps = /constructor\s*\(\s*(private|public|protected|readonly)/.test(code);
        const noRedundantBody = !/this\._ref\s*=\s*ref/.test(code);
        const logged = exec.logs.some(
          (l) => l.text.includes('REF-99') && l.text.includes('Clavier'),
        );
        updatedCriteria[0].passed = usesParamProps;
        updatedCriteria[1].passed = noRedundantBody;
        updatedCriteria[2].passed = logged;
        allPassed = usesParamProps && noRedundantBody && logged;
        break;
      }

      case 'ex-3-2': {
        const noDirectAccess = !/\.\s*_cleSecurite/.test(code) || /verifierCle/.test(code);
        const hasVerifierCle = /verifierCle\s*\(/.test(code);
        const logsBool = exec.logs.some((l) => l.text.includes('true'));
        updatedCriteria[0].passed = noDirectAccess;
        updatedCriteria[1].passed = hasVerifierCle && logsBool;
        allPassed = noDirectAccess && hasVerifierCle && logsBool;
        break;
      }

      case 'ex-3-3': {
        const defensiveCopy =
          /\[\s*\.\.\.\s*(this\.)?_articles\s*\]/.test(code) || /slice\s*\(\s*\)/.test(code);
        const logged1 = exec.logs.some((l) => l.text.includes('1'));
        updatedCriteria[0].passed = defensiveCopy;
        updatedCriteria[1].passed = logged1;
        allPassed = defensiveCopy && logged1;
        break;
      }

      case 'ex-3-4': {
        const hasProtected = /protected\s+tauxInteret/.test(code);
        const logged20 = exec.logs.some((l) => l.text.includes('20'));
        updatedCriteria[0].passed = hasProtected;
        updatedCriteria[1].passed = logged20;
        allPassed = hasProtected && logged20;
        break;
      }

      case 'ex-4-1': {
        const hasGetter = /get\s+temperature\s*\(/.test(code);
        const hasSetter = /set\s+temperature\s*\(/.test(code);
        const hasBounds = /(<\s*5|>\s*30|5\s*-\s*30)/.test(code);
        const logged23 = exec.logs.some((l) => l.text.includes('23'));
        updatedCriteria[0].passed = hasGetter;
        updatedCriteria[1].passed = hasSetter && hasBounds;
        updatedCriteria[2].passed = logged23;
        allPassed = hasGetter && hasSetter && hasBounds && logged23;
        break;
      }

      case 'ex-4-2': {
        const hasGetterAire = /get\s+aire\s*\(/.test(code);
        const noAireAttr = !/private\s+_aire/.test(code) && !/public\s+_aire/.test(code);
        const logged80 = exec.logs.some((l) => l.text.includes('80'));
        updatedCriteria[0].passed = hasGetterAire && noAireAttr;
        updatedCriteria[1].passed = logged80;
        allPassed = hasGetterAire && noAireAttr && logged80;
        break;
      }

      case 'ex-4-3': {
        const hasGetter = /get\s+nomComplet\s*\(/.test(code);
        const loggedPierre = exec.logs.some((l) => l.text.includes('Pierre Dupont'));
        updatedCriteria[0].passed = hasGetter;
        updatedCriteria[1].passed = loggedPierre;
        allPassed = hasGetter && loggedPierre;
        break;
      }

      case 'ex-4-4': {
        const hasCrediter = /crediter\s*\(\s*montant/.test(code);
        const hasDebiter = /debiter\s*\(\s*montant/.test(code);
        const noSetSolde = !/set\s+solde\s*\(/.test(code) && !/setSolde\s*\(/.test(code);
        const logged70 = exec.logs.some((l) => l.text.includes('70'));
        updatedCriteria[0].passed = hasCrediter && hasDebiter && noSetSolde;
        updatedCriteria[1].passed = logged70;
        allPassed = hasCrediter && hasDebiter && logged70;
        break;
      }

      case 'ex-4-5': {
        const hasRepeat = /get\s+motDePasseMasque\s*\(/.test(code) && /repeat\s*\(/.test(code);
        const loggedStars = exec.logs.some((l) => l.text.includes('*********'));
        updatedCriteria[0].passed = hasRepeat;
        updatedCriteria[1].passed = loggedStars;
        allPassed = hasRepeat && loggedStars;
        break;
      }

      case 'ex-5-1': {
        const hasStaticCount = /static\s+totalFabriquees/.test(code);
        const increments = /totalFabriquees\s*\+\+/.test(code);
        const logged3 = exec.logs.some((l) => l.text.includes('3'));
        updatedCriteria[0].passed = hasStaticCount && increments;
        updatedCriteria[1].passed = logged3;
        allPassed = hasStaticCount && increments && logged3;
        break;
      }

      case 'ex-5-2': {
        const hasStaticMethod = /static\s+celsiusEnFahrenheit\s*\(/.test(code);
        const logged212 = exec.logs.some((l) => l.text.includes('212'));
        updatedCriteria[0].passed = hasStaticMethod;
        updatedCriteria[1].passed = logged212;
        allPassed = hasStaticMethod && logged212;
        break;
      }

      case 'ex-5-3': {
        const staticWithParam =
          /static\s+formater\s*\(\s*[a-zA-Z0-9_$]+\s*:\s*Profil\s*\)/.test(code) ||
          /static\s+formater\s*\(\s*[a-zA-Z0-9_$]+\s*\)/.test(code);
        const loggedSophie = exec.logs.some((l) => l.text.includes('SOPHIE'));
        updatedCriteria[0].passed = staticWithParam;
        updatedCriteria[1].passed = loggedSophie;
        allPassed = staticWithParam && loggedSophie;
        break;
      }

      case 'ex-5-4': {
        const hasPlafond =
          /static\s+readonly\s+PLAFOND_RETRAIT(\s*:\s*[a-zA-Z0-9_$]+)?\s*=\s*1000/.test(code);
        const hasTrueAndFalse =
          exec.logs.some((l) => l.text.includes('true')) &&
          exec.logs.some((l) => l.text.includes('false'));
        updatedCriteria[0].passed = hasPlafond;
        updatedCriteria[1].passed = hasTrueAndFalse;
        allPassed = hasPlafond && hasTrueAndFalse;
        break;
      }

      case 'ex-6-1': {
        const privateCtor = /private\s+constructor\s*\(/.test(code);
        const hasFactories =
          /static\s+creerInvite\s*\(/.test(code) && /static\s+creerAdmin\s*\(/.test(code);
        const logsRoles =
          exec.logs.some((l) => l.text.includes('invite')) &&
          exec.logs.some((l) => l.text.includes('admin'));
        updatedCriteria[0].passed = privateCtor;
        updatedCriteria[1].passed = hasFactories;
        updatedCriteria[2].passed = logsRoles;
        allPassed = privateCtor && hasFactories && logsRoles;
        break;
      }

      case 'ex-6-2': {
        const hasEnum =
          /enum\s+StatutCommande/.test(code) && /EnAttente/.test(code) && /Payee/.test(code);
        const checkPayee = /StatutCommande\.Payee/.test(code);
        const finalStatus = exec.logs.some(
          (l) => l.text.includes('2') || l.text.includes('Livree'),
        );
        updatedCriteria[0].passed = hasEnum;
        updatedCriteria[1].passed = checkPayee;
        updatedCriteria[2].passed = finalStatus;
        allPassed = hasEnum && checkPayee && finalStatus;
        break;
      }

      case 'ex-6-3': {
        const hasCurrencies =
          /static\s+readonly\s+EUR/.test(code) &&
          /static\s+readonly\s+USD/.test(code) &&
          /static\s+readonly\s+GBP/.test(code);
        const logged92 = exec.logs.some((l) => l.text.includes('92'));
        updatedCriteria[0].passed = hasCurrencies;
        updatedCriteria[1].passed = logged92;
        allPassed = hasCurrencies && logged92;
        break;
      }

      case 'ex-6-4': {
        // L'ordre doit être _registre avant TERRE
        const regIdx = code.indexOf('_registre');
        const terreIdx = code.indexOf('TERRE');
        const orderCorrect = regIdx !== -1 && terreIdx !== -1 && regIdx < terreIdx;
        const logged2 = exec.logs.some((l) => l.text.includes('2'));
        updatedCriteria[0].passed = orderCorrect;
        updatedCriteria[1].passed = logged2 && orderCorrect;
        allPassed = orderCorrect && logged2;
        break;
      }
    }

    this.exercises.update((list) => {
      return list.map((item) => {
        if (item.id === targetId) {
          return {
            ...item,
            isCompleted: allPassed,
            criteria: updatedCriteria,
          };
        }
        return item;
      });
    });

    this.saveToStorage();

    return {
      success: allPassed,
      logs: exec.logs,
      error: exec.error,
    };
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = this.exercises().map((ex) => ({
        id: ex.id,
        isCompleted: ex.isCompleted,
        currentCode: ex.currentCode,
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignorer si quota plein
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.exercises.update((list) => {
          return list.map((ex) => {
            const saved = parsed.find((p: any) => p.id === ex.id);
            if (saved) {
              return {
                ...ex,
                isCompleted: !!saved.isCompleted,
                currentCode: saved.currentCode || ex.initialCode,
              };
            }
            return ex;
          });
        });
      }
    } catch {
      // Ignorer
    }
  }
}
