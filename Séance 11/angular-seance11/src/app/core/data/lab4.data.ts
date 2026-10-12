import { ExerciseDef } from '../models/app.models';

export const LAB4_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-4-1',
    labNumber: 4,
    number: '4.1',
    title: 'Le Moteur de Commande Complet (S + O + D)',
    subtitle: 'Refactoriser un script e-commerce monolithique en architecture propre',
    sectionId: 'synergie-sod-arbitrage',
    estimatedTime: '8 min',
    difficulty: 'Avancé',
    statement: `Un script monolithique encaisse les commandes, calcule la TVA en dur, gère les paiements par if/else et écrit dans un fichier.
Refactorisez ce système selon la sainte trinité SOLID :
1. SRP : Créez CalculateurTaxe avec calculerTtc(ht: number, taux: number): number
2. OCP : Définissez l'interface PasserellePaiement { payer(montant: number): boolean; } et implémentez PaiementStripe
3. DIP : Définissez l'interface CommandeRepository { enregistrer(totalTtc: number): void; }
4. Créez MoteurCommande qui injecte les 3 abstractions et propose traiter(montantHt: number, tauxTva: number): { succes: boolean; totalTtc: number }`,
    hint: 'MoteurCommande orchestre sans instancier new Passerelle ni faire de calcul direct de taxe.',
    initialCode: `// ❌ MONOLITHE INITIAL : Viole S, O et D
// export class CommandeMonolithique {
//   traiter(ht: number, mode: string) {
//     const ttc = ht * 1.21; // Viole SRP
//     if (mode === 'STRIPE') { ... } else if (mode === 'PAYPAL') { ... } // Viole OCP
//     new BaseSQL().sauvegarder(ttc); // Viole DIP
//   }
// }

// TODO 1 (SRP) : CalculateurTaxe
export class CalculateurTaxe {
  calculerTtc(montantHt: number, taux: number): number {
    return 0;
  }
}

// TODO 2 (OCP) : PasserellePaiement et PaiementStripe
export interface PasserellePaiement {
  payer(montant: number): boolean;
}

export class PaiementStripe implements PasserellePaiement {
  payer(montant: number): boolean {
    // TODO : vérifier que montant > 0
    return false;
  }
}

// TODO 3 (DIP) : CommandeRepository
export interface CommandeRepository {
  enregistrer(totalTtc: number): void;
}

// TODO 4 (Orchestrateur) : MoteurCommande
export class MoteurCommande {
  constructor(
    private taxeCalc: CalculateurTaxe,
    private paiement: PasserellePaiement,
    private repo: CommandeRepository
  ) {}

  traiter(montantHt: number, tauxTva: number): { succes: boolean; totalTtc: number } {
    return { succes: false, totalTtc: 0 };
  }
}
`,
    solutionCode: `export class CalculateurTaxe {
  calculerTtc(montantHt: number, taux: number): number {
    return Math.round(montantHt * (1 + taux) * 100) / 100;
  }
}

export interface PasserellePaiement {
  payer(montant: number): boolean;
}

export class PaiementStripe implements PasserellePaiement {
  payer(montant: number): boolean {
    return montant > 0;
  }
}

export interface CommandeRepository {
  enregistrer(totalTtc: number): void;
}

export class MoteurCommande {
  constructor(
    private taxeCalc: CalculateurTaxe,
    private paiement: PasserellePaiement,
    private repo: CommandeRepository
  ) {}

  traiter(montantHt: number, tauxTva: number): { succes: boolean; totalTtc: number } {
    const totalTtc = this.taxeCalc.calculerTtc(montantHt, tauxTva);
    const succesPaiement = this.paiement.payer(totalTtc);

    if (succesPaiement) {
      this.repo.enregistrer(totalTtc);
    }

    return { succes: succesPaiement, totalTtc };
  }
}
`,
    solutionExplanation: [
      'SRP : Le calcul de taxe est confiné dans CalculateurTaxe.',
      'OCP : On peut brancher PayPal ou Crypto en créant une nouvelle classe implémentant PasserellePaiement.',
      'DIP : MoteurCommande ne sait pas si la commande est enregistrée dans PostgreSQL, MongoDB ou un tableau RAM.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+MoteurCommande/,
        label: 'class MoteurCommande',
        errorMessage: 'Vous devez créer la classe MoteurCommande.'
      },
      {
        type: 'keyword',
        pattern: /class\s+CalculateurTaxe/,
        label: 'class CalculateurTaxe',
        errorMessage: 'Vous devez créer la classe CalculateurTaxe.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const TaxeClass = sandbox.CalculateurTaxe;
      const StripeClass = sandbox.PaiementStripe;
      const MoteurClass = sandbox.MoteurCommande;

      if (!TaxeClass || !StripeClass || !MoteurClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const taxe = new TaxeClass();
        const ttc = taxe.calculerTtc(100, 0.20);
        const stripe = new StripeClass();
        const paye = stripe.payer(ttc);
        const p1 = Math.abs(ttc - 120) < 0.1 && paye === true;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'CalculateurTaxe ou PaiementStripe ne fonctionnent pas correctement.' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        let totalEnregistre = 0;
        const fakeRepo: any = {
          enregistrer: (tot: number) => { totalEnregistre = tot; }
        };
        const taxe = new TaxeClass();
        const stripe = new StripeClass();
        const moteur = new MoteurClass(taxe, stripe, fakeRepo);

        const res = moteur.traiter(200, 0.21); // 200 * 1.21 = 242
        const p2 = res.succes === true && Math.abs(res.totalTtc - 242) < 0.1 && Math.abs(totalEnregistre - 242) < 0.1;
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `Le moteur n'a pas validé la commande ou n'a pas enregistré le total TTC dans le repo (reçu: ${totalEnregistre}).` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Composants SRP & OCP validés',
        description: 'CalculateurTaxe calcule 120€ pour 100€ HT à 20% et PaiementStripe approuve le paiement.',
        passed: false,
        hint: 'Implémentez calculerTtc(ht * (1 + taux)) et payer(montant > 0).'
      },
      {
        id: 'c2',
        label: 'Orchestration DIP sans instanciation directe',
        description: 'MoteurCommande calcule le total, paie et appelle repo.enregistrer(totalTtc).',
        passed: false,
        hint: 'Appelez this.taxeCalc.calculerTtc, this.paiement.payer, et this.repo.enregistrer.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-4-2',
    labNumber: 4,
    number: '4.2',
    title: 'Détection & Correction en Temps Réel',
    subtitle: 'Assainir une classe commerciale truffée de code smells',
    sectionId: 'synergie-sod-arbitrage',
    estimatedTime: '8 min',
    difficulty: 'Avancé',
    statement: `Prenez une classe commerciale qui viole simultanément S, O et D, et fournissez une solution propre :
1. Créez CalculateurRemiseSimple avec calculer(montant: number, remisePct: number): number (renvoyant montant * (1 - remisePct / 100))
2. Créez l'interface EnregistreurFacture { sauvegarder(ref: string, total: number): void; }
3. Créez EnregistreurMemoire implements EnregistreurFacture conservant un dictionnaire { [ref: string]: number } et une méthode getTotal(ref: string): number | null
4. Créez GestionnaireFacturation qui reçoit EnregistreurFacture et CalculateurRemiseSimple dans son constructeur et propose :
   - emettreFacture(ref: string, montant: number, remisePct: number): number`,
    hint: 'Bannissez tout new technique dans GestionnaireFacturation.',
    initialCode: `// TODO 1 : CalculateurRemiseSimple (SRP)
export class CalculateurRemiseSimple {
  calculer(montant: number, remisePct: number): number {
    return montant;
  }
}

// TODO 2 : Interface EnregistreurFacture (DIP)
export interface EnregistreurFacture {
  sauvegarder(ref: string, total: number): void;
}

// TODO 3 : EnregistreurMemoire
export class EnregistreurMemoire implements EnregistreurFacture {
  private factures: Record<string, number> = {};

  sauvegarder(ref: string, total: number): void {
    // TODO
  }

  getTotal(ref: string): number | null {
    return null;
  }
}

// TODO 4 : GestionnaireFacturation
export class GestionnaireFacturation {
  constructor(
    private remises: CalculateurRemiseSimple,
    private enregistreur: EnregistreurFacture
  ) {}

  emettreFacture(ref: string, montant: number, remisePct: number): number {
    // Calculer le total net
    // Sauvegarder dans l'enregistreur
    // Renvoyer le total net
    return 0;
  }
}
`,
    solutionCode: `export class CalculateurRemiseSimple {
  calculer(montant: number, remisePct: number): number {
    return Math.round(montant * (1 - remisePct / 100) * 100) / 100;
  }
}

export interface EnregistreurFacture {
  sauvegarder(ref: string, total: number): void;
}

export class EnregistreurMemoire implements EnregistreurFacture {
  private factures: Record<string, number> = {};

  sauvegarder(ref: string, total: number): void {
    this.factures[ref] = total;
  }

  getTotal(ref: string): number | null {
    return this.factures[ref] ?? null;
  }
}

export class GestionnaireFacturation {
  constructor(
    private remises: CalculateurRemiseSimple,
    private enregistreur: EnregistreurFacture
  ) {}

  emettreFacture(ref: string, montant: number, remisePct: number): number {
    const totalNet = this.remises.calculer(montant, remisePct);
    this.enregistreur.sauvegarder(ref, totalNet);
    return totalNet;
  }
}
`,
    solutionExplanation: [
      'L\'architecture assainie respecte S (calcul isolé), O (enregistreur ouvert à d\'autres drivers) et D (injection d\'interface).',
      'Le composant métier est 100% testable en RAM en quelques microsecondes.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+GestionnaireFacturation/,
        label: 'class GestionnaireFacturation',
        errorMessage: 'Vous devez créer la classe GestionnaireFacturation.'
      },
      {
        type: 'keyword',
        pattern: /class\s+EnregistreurMemoire/,
        label: 'class EnregistreurMemoire',
        errorMessage: 'Vous devez créer la classe EnregistreurMemoire.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CalcClass = sandbox.CalculateurRemiseSimple;
      const MemClass = sandbox.EnregistreurMemoire;
      const GestClass = sandbox.GestionnaireFacturation;

      if (!CalcClass || !MemClass || !GestClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const calc = new CalcClass();
        const net = calc.calculer(100, 15);
        const mem = new MemClass();
        mem.sauvegarder('FAC-1', 85);
        const p1 = Math.abs(net - 85) < 0.01 && mem.getTotal('FAC-1') === 85;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : `Calculateur ou EnregistreurMemoire défaillants (net=${net}).` });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const calc = new CalcClass();
        const mem = new MemClass();
        const gest = new GestClass(calc, mem);
        const net = gest.emettreFacture('FAC-2026', 500, 10);
        const p2 = Math.abs(net - 450) < 0.01 && mem.getTotal('FAC-2026') === 450;
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `GestionnaireFacturation n'a pas émis ou sauvegardé 450€ pour FAC-2026.` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Calculateur et Enregistreur conformes',
        description: 'CalculateurRemiseSimple déduit 15% et EnregistreurMemoire persiste la facture.',
        passed: false,
        hint: 'Retournez montant * (1 - remisePct / 100) et stockez dans this.factures[ref] = total.'
      },
      {
        id: 'c2',
        label: 'Orchestration propre et testable en mémoire',
        description: 'emettreFacture coordonne le calcul et la persistance sans dépendance technique.',
        passed: false,
        hint: 'Appelez this.remises.calculer(...) puis this.enregistreur.sauvegarder(ref, totalNet).'
      }
    ],
    isCompleted: false
  }
];
