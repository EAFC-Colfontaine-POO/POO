import { ExerciseDef } from '../models/app.models';

export const LAB4_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-4-1',
    labNumber: 4,
    number: '4.1',
    title: 'Blindage d\'État avec asReadonly()',
    subtitle: 'Appliquer l\'encapsulation stricte de la Séance 05 aux signaux d\'état',
    sectionId: 'oop-encapsulation',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `Dans la classe CompteurSecuriseComponent :\n1. Déclarez une source privée : private readonly _compteur = signal<number>(0).\n2. Exposez une vue publique en lecture seule : public readonly compteur = this._compteur.asReadonly().\n3. Ajoutez une méthode incrementer(): void qui fait évoluer la source interne avec .update(n => n + 1).\n4. Testez l'incrémentation : compteur() doit renvoyer 1.`,
    hint: `public readonly compteur = this._compteur.asReadonly(); Empêche tout tiers d'écraser l'état depuis l'extérieur.`,
    initialCode: `// Exercice 4.1 — Blindage d'État asReadonly()
class CompteurSecuriseComponent {
  // TODO: 1. Source de vérité privée modifiable (signal numérique initialisé à 0, nommé _compteur)

  // TODO: 2. Vue publique 'compteur' en lecture seule (dérivée de _compteur)

  // TODO: 3. Commande métier interne
  incrementer(): void {
    
  }
}

// TODO: Instancier, incrémenter puis afficher compteur() dans la console
const c = new CompteurSecuriseComponent();
`,
    solutionCode: `// Exercice 4.1 — Solution officielle
class CompteurSecuriseComponent {
  // 1. Source de vérité STRICTEMENT PRIVÉE (Encapsulation S05) :
  private readonly _compteur = signal<number>(0);

  // 2. Vue publique STRICTEMENT EN LECTURE SEULE :
  public readonly compteur = this._compteur.asReadonly();

  // 3. Commande métier :
  incrementer(): void {
    this._compteur.update(n => n + 1);
  }
}

const c = new CompteurSecuriseComponent();
c.incrementer();
console.log('Compteur :', c.compteur()); // 1`,
    solutionExplanation: [
      "Exposer un WritableSignal public viole directement le principe fondamental d'encapsulation de la POO.",
      "Avec asReadonly(), la référence exposée au template et aux appelants externes est de type Signal<T> sans méthode .set() ou .update().",
      "L'objet reste le maître absolu de ses transitions d'état internes."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /private\s+readonly\s+_compteur\s*=\s*signal/,
        label: 'Source privée _compteur',
        errorMessage: "La source de vérité doit être un champ privé nommé '_compteur'."
      },
      {
        type: 'regex',
        pattern: /this\._compteur\.asReadonly\s*\(\s*\)/,
        label: 'Projection asReadonly()',
        errorMessage: "Vous devez initialiser 'compteur' avec this._compteur.asReadonly()."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const Comp = sandbox.CompteurSecuriseComponent;

      const isClass = typeof Comp === 'function';
      let readonlyWorks = false;

      if (isClass) {
        try {
          const inst = new Comp();
          if (inst.compteur() === 0 && !inst.compteur.set) {
            inst.incrementer();
            if (inst.compteur() === 1) readonlyWorks = true;
          }
        } catch (e) {}
      }

      results.push({
        criterionId: 'c-4-1-1',
        passed: readonlyWorks,
        message: readonlyWorks ? undefined : "CompteurSecuriseComponent doit protéger son état et exposer une vue en lecture seule qui s'incrémente à 1."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-4-1-1',
        label: 'Encapsulation et asReadonly',
        description: "L'état interne est protégé et seule la vue Readonly est accessible publiquement.",
        passed: false,
        hint: "compteur = this._compteur.asReadonly();"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-4-2',
    labNumber: 4,
    number: '4.2',
    title: 'Protection des Invariants Métier (Exceptions Typées)',
    subtitle: 'Empêcher la corruption d\'état avec des préconditions strictes (Séances 05 & 10)',
    sectionId: 'oop-encapsulation',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Dans la classe CompteBancaireComponent :\n1. Nous avons une source privée _solde = signal<number>(1000).\n2. Complétez la méthode retirer(montant: number): void.\n3. Si montant <= 0, lever une exception new Error('Montant positif requis.').\n4. Si (this._solde() - montant) < 0, lever une exception new Error('Solde insuffisant.').\n5. Sinon, déduire le montant avec this._solde.update(s => s - montant).\n6. Testez un retrait valide de 200, puis interceptez l'erreur lors d'une tentative de retrait de 5000.`,
    hint: `Valider les invariants AVANT de muter le signal ! Si une condition échoue, throw new Error(...) empêche toute mutation illicite.`,
    initialCode: `// Exercice 4.2 — Protection d'Invariants
class CompteBancaireComponent {
  private readonly _solde = signal<number>(1000);
  public readonly solde = this._solde.asReadonly();

  retirer(montant: number): void {
    // TODO: 1. Valider que le montant est strictement positif
    
    // TODO: 2. Valider qu'il n'y a pas de découvert (solde - montant >= 0)
    
    // TODO: 3. Déduire le montant de la source privée
  }
}

// TODO: Instancier et tester
const compte = new CompteBancaireComponent();
compte.retirer(200);
console.log('Solde après retrait valide :', compte.solde());

try {
  compte.retirer(5000); // Doit échouer !
} catch (e: any) {
  console.log('[Sécurité Invariant] Rejeté :', e.message);
}
`,
    solutionCode: `// Exercice 4.2 — Solution officielle
class CompteBancaireComponent {
  private readonly _solde = signal<number>(1000);
  public readonly solde = this._solde.asReadonly();

  retirer(montant: number): void {
    if (montant <= 0) {
      throw new Error('Montant positif requis.');
    }
    if (this._solde() - montant < 0) {
      throw new Error('Solde insuffisant.');
    }
    this._solde.update(s => s - montant);
  }
}

const compte = new CompteBancaireComponent();
compte.retirer(200);
console.log('Solde après retrait valide :', compte.solde());

try {
  compte.retirer(5000);
} catch (e: any) {
  console.log('[Sécurité Invariant] Rejeté :', e.message);
}`,
    solutionExplanation: [
      "L'état d'un objet ne doit JAMAIS être modifié si l'opération viole une règle métier.",
      "Le contrôle d'invariants (Séance 05) combiné aux exceptions (Séance 10) garantit l'intégrité de l'application.",
      "L'interface graphique est ainsi protégée contre tout bug ou piratage de données."
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /throw\s+new\s+Error/,
        label: "Levée d'exception avec throw new Error",
        errorMessage: "Vous devez lever des exceptions pour protéger les invariants métier."
      },
      {
        type: 'regex',
        pattern: /this\._solde\.update/,
        label: 'Mise à jour sécurisée du solde',
        errorMessage: "La mise à jour du solde doit s'effectuer via this._solde.update()."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const Comp = sandbox.CompteBancaireComponent;

      const isClass = typeof Comp === 'function';
      let validationPassed = false;

      if (isClass) {
        try {
          const c = new Comp();
          c.retirer(200);
          if (c.solde() === 800) {
            let errorCaught = false;
            try {
              c.retirer(5000);
            } catch (err: any) {
              errorCaught = err.message.includes('Solde insuffisant');
            }
            if (errorCaught && c.solde() === 800) {
              validationPassed = true;
            }
          }
        } catch (e) {}
      }

      results.push({
        criterionId: 'c-4-2-1',
        passed: validationPassed,
        message: validationPassed ? undefined : "Le solde doit valoir 800 après retrait de 200, et le retrait de 5000 doit être rejeté par exception sans modifier le solde."
      });

      const loggedRejet = logs.some(l => l.includes('Rejeté : Solde insuffisant'));
      results.push({
        criterionId: 'c-4-2-2',
        passed: loggedRejet,
        message: loggedRejet ? undefined : "L'interception de l'exception doit être journalisée."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-4-2-1',
        label: 'Protection stricte des invariants',
        description: "Les montants négatifs et les découverts non autorisés sont rejetés.",
        passed: false,
        hint: "if (this._solde() - montant < 0) throw new Error('Solde insuffisant.');"
      },
      {
        id: 'c-4-2-2',
        label: 'Gestion de l\'exception',
        description: "L'erreur typée est interceptée et consignée.",
        passed: false,
        hint: "try { compte.retirer(5000); } catch (e) { ... }"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-4-3',
    labNumber: 4,
    number: '4.3',
    title: 'Remplacement d\'Entité Immuable (Shallow Clone)',
    subtitle: 'Mettre à jour un objet dans un signal sans jamais muter l\'instance d\'origine',
    sectionId: 'oop-encapsulation',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Soit le signal 'utilisateur' contenant : { id: 10, nom: 'Claire', ville: 'Bruxelles' }.\n1. Écrivez une fonction pure 'changerVille(nouvelleVille: string): void'.\n2. Utilisez utilisateur.update() avec le clonage superficiel ({ ...ancien, ville: nouvelleVille }) pour changer la ville pour 'Liège'.\n3. Vérifiez que la référence a bien changé dans le Tas et que la ville est désormais 'Liège'.`,
    hint: `utilisateur.update(u => ({ ...u, ville: nouvelleVille })); Crée un nouvel objet et alloue une nouvelle adresse mémoire.`,
    initialCode: `// Exercice 4.3 — Clonage Immuable d'Entité
interface Profil {
  id: number;
  nom: string;
  ville: string;
}

const utilisateur = signal<Profil>({
  id: 10,
  nom: 'Claire',
  ville: 'Bruxelles'
});

// TODO: Compléter la mise à jour immuable (nouvelle instance clonée avec l'opérateur spread)
function changerVille(nouvelleVille: string): void {
  
}

changerVille('Liège');
console.log('Utilisateur mis à jour :', utilisateur());
`,
    solutionCode: `// Exercice 4.3 — Solution officielle
interface Profil {
  id: number;
  nom: string;
  ville: string;
}

const utilisateur = signal<Profil>({
  id: 10,
  nom: 'Claire',
  ville: 'Bruxelles'
});

// Mise à jour par remplacement immuable :
function changerVille(nouvelleVille: string): void {
  utilisateur.update(ancien => ({
    ...ancien,
    ville: nouvelleVille
  }));
}

changerVille('Liège');
console.log('Utilisateur mis à jour :', utilisateur());`,
    solutionExplanation: [
      "Muter l'objet sur place (ex: utilisateur().ville = 'Liège') ne changerait pas l'adresse mémoire du signal, donc Object.is renverrait true et le DOM resterait figé.",
      "Le clonage superficiel { ...ancien, ville: nouvelleVille } alloue un nouvel objet à une nouvelle adresse mémoire.",
      "Angular détecte immédiatement la différence et notifie chirurgicalement l'interface."
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /utilisateur\(\)\.ville\s*=/,
        label: 'Interdiction de mutation directe',
        errorMessage: "La mutation directe utilisateur().ville = ... est un anti-pattern majeur !"
      },
      {
        type: 'regex',
        pattern: /utilisateur\.update\s*\(/,
        label: 'Appel de utilisateur.update',
        errorMessage: "Vous devez utiliser utilisateur.update()."
      },
      {
        type: 'regex',
        pattern: /\{\s*\.\.\./,
        label: 'Clonage superficiel {...ancien}',
        errorMessage: "Vous devez cloner l'objet avec l'opérateur spread : { ...ancien, ville: nouvelleVille }."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const u = sandbox.utilisateur;

      const isSignal = typeof u === 'function';
      const obj = isSignal ? u() : null;
      const isCorrect = obj && obj.id === 10 && obj.nom === 'Claire' && obj.ville === 'Liège';

      results.push({
        criterionId: 'c-4-3-1',
        passed: isCorrect,
        message: isCorrect ? undefined : "L'utilisateur final doit avoir pour ville 'Liège' tout en conservant son id et son nom."
      });

      const loggedLiege = logs.some(l => l.includes('Liège'));
      results.push({
        criterionId: 'c-4-3-2',
        passed: loggedLiege,
        message: loggedLiege ? undefined : "L'objet mis à jour doit être affiché dans la console."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-4-3-1',
        label: 'Clonage immuable réussi',
        description: "L'entité a été remplacée par une nouvelle instance avec la ville modifiée.",
        passed: false,
        hint: "utilisateur.update(u => ({ ...u, ville: 'Liège' }));"
      },
      {
        id: 'c-4-3-2',
        label: 'Validation console',
        description: "Le profil modifié est imprimé avec succès.",
        passed: false,
        hint: "console.log('Utilisateur mis à jour :', utilisateur());"
      }
    ],
    isCompleted: false
  },
  {
    id: 'ex-4-4',
    labNumber: 4,
    number: '4.4',
    title: 'Dérivation de Collection avec Fonction Pure',
    subtitle: 'Calculer le total d\'un panier d\'articles en réutilisant la fonction pure de la Séance 11',
    sectionId: 'oop-encapsulation',
    estimatedTime: '7 min',
    difficulty: 'Intermédiaire',
    statement: `1. Soit le modèle Article (id, nom, prixUnitaire, quantite) et la fonction pure 'prixLigne(a: Article): number'.\n2. Le signal 'panier' contient une collection d'articles.\n3. Créez un computed 'montantTotal' qui parcourt panier() avec .reduce() et calcule la somme globale en réutilisant prixLigne(a).\n4. Affichez montantTotal() dans la console.\n5. Ajoutez un article de 10 € en quantite 2 de manière immuable avec .update() et observez le recalcul automatique.`,
    hint: `const montantTotal = computed(() => panier().reduce((somme, a) => somme + prixLigne(a), 0));`,
    initialCode: `// Exercice 4.4 — Dérivation de Collection
interface Article {
  id: number;
  nom: string;
  prixUnitaire: number;
  quantite: number;
}

// Fonction pure de la Séance 11 :
function prixLigne(a: Article): number {
  return a.prixUnitaire * a.quantite;
}

const panier = signal<Article[]>([
  { id: 1, nom: 'Frites', prixUnitaire: 3.5, quantite: 2 }, // 7.0 €
  { id: 2, nom: 'Sauce Mayonnaise', prixUnitaire: 0.8, quantite: 2 } // 1.6 €
]);

// TODO: 1. Déclarer le computed 'montantTotal' calculant la somme avec .reduce() et prixLigne()
// const montantTotal = ...


// TODO: 2. Afficher montantTotal() (doit valoir 8.6 €)


// TODO: 3. Ajouter un article { id: 3, nom: 'Burger', prixUnitaire: 5, quantite: 1 } de façon immuable avec panier.update()


// TODO: 4. Ré-afficher montantTotal() (doit valoir 13.6 €)
`,
    solutionCode: `// Exercice 4.4 — Solution officielle
interface Article {
  id: number;
  nom: string;
  prixUnitaire: number;
  quantite: number;
}

function prixLigne(a: Article): number {
  return a.prixUnitaire * a.quantite;
}

const panier = signal<Article[]>([
  { id: 1, nom: 'Frites', prixUnitaire: 3.5, quantite: 2 },
  { id: 2, nom: 'Sauce Mayonnaise', prixUnitaire: 0.8, quantite: 2 }
]);

// Calcul dérivé pur réutilisant la fonction métier existante :
const montantTotal = computed(() => {
  return panier().reduce((somme, a) => somme + prixLigne(a), 0);
});

console.log('Total initial :', montantTotal()); // 8.6

// Ajout immuable :
panier.update(liste => [
  ...liste,
  { id: 3, nom: 'Burger', prixUnitaire: 5, quantite: 1 }
]);

console.log('Total après ajout :', montantTotal()); // 13.6`,
    solutionExplanation: [
      "Réutiliser une fonction pure existante (prixLigne) au sein de computed() respecte le principe DRY et le SRP (Séance 11).",
      "La méthode reduce() itère proprement sur la collection pour produire la valeur dérivée globale.",
      "L'ajout d'un nouvel élément avec l'opérateur spread déclenche automatiquement le recalcul sans aucun code de synchronisation !"
    ],
    syntaxRequirements: [
      {
        type: 'regex',
        pattern: /montantTotal\s*=\s*computed\s*\(/,
        label: 'Création de montantTotal avec computed',
        errorMessage: "Vous devez déclarer 'montantTotal' avec computed()."
      },
      {
        type: 'regex',
        pattern: /prixLigne\s*\(/,
        label: 'Réutilisation de prixLigne()',
        errorMessage: "Vous devez faire appel à la fonction pure prixLigne(a) dans le calcul."
      },
      {
        type: 'regex',
        pattern: /panier\.update\s*\(/,
        label: 'Mise à jour immuable de panier',
        errorMessage: "L'ajout d'article doit utiliser panier.update()."
      }
    ],
    evaluateFn: (sandbox, logs) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const mt = sandbox.montantTotal;
      const p = sandbox.panier;

      const isComputed = typeof mt === 'function';
      const finalTotalOk = isComputed && Math.abs(mt() - 13.6) < 0.001;

      results.push({
        criterionId: 'c-4-4-1',
        passed: finalTotalOk,
        message: finalTotalOk ? undefined : "Le montant total dérivé final doit valoir 13.6 €."
      });

      const logged86 = logs.some(l => l.includes('8.6'));
      const logged136 = logs.some(l => l.includes('13.6'));

      results.push({
        criterionId: 'c-4-4-2',
        passed: logged86 && logged136,
        message: logged86 && logged136 ? undefined : "La console doit enregistrer 8.6 puis 13.6."
      });

      return results;
    },
    criteria: [
      {
        id: 'c-4-4-1',
        label: 'Agrégation dérivée réactive',
        description: "montantTotal calcule et recalcule automatiquement le panier avec reduce().",
        passed: false,
        hint: "panier().reduce((s, a) => s + prixLigne(a), 0)"
      },
      {
        id: 'c-4-4-2',
        label: 'Sortie console de vérification',
        description: "Les montants 8.6 puis 13.6 sont affichés avec succès.",
        passed: false,
        hint: "console.log(montantTotal()); panier.update(...); console.log(montantTotal());"
      }
    ],
    isCompleted: false
  }
];
