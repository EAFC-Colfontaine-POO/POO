import { ExerciseDef } from '../models/app.models';

export const LAB1_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-1-1',
    labNumber: 1,
    number: '1.1',
    title: 'Découplage Métier / Affichage',
    subtitle: 'Extraire la mise en forme HTML hors de la classe métier',
    sectionId: 'srp-single-responsibility',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: `Une classe CompteBancaire calcule les intérêts et produit du HTML au sein de la même méthode.
Séparez ces responsabilités :
1. Conservez dans CompteBancaire uniquement le métier : titulaire, solde et la méthode calculerInterets(taux: number): number.
2. Créez une classe ReleveBancaireHtml avec la méthode generer(compte: CompteBancaire): string produisant le relevé HTML.`,
    hint: 'La classe CompteBancaire ne doit plus contenir de balises HTML. La classe ReleveBancaireHtml reçoit une instance de CompteBancaire en paramètre de generer().',
    initialCode: `// ❌ VIOLATION DU SRP : Logique financière et rendu HTML entremêlés
export class CompteBancaire {
  constructor(
    public titulaire: string,
    public solde: number
  ) {}

  // TODO : Nettoyer cette méthode pour ne renvoyer que le montant des intérêts (number)
  calculerEtAfficherInterets(taux: number): string {
    const interets = this.solde * taux;
    return \`<div class="releve"><h1>Relevé Bancaire</h1><p>Titulaire: \${this.titulaire}</p><p>Solde: \${this.solde} €</p><p>Intérêts: \${interets} €</p></div>\`;
  }
}

// TODO : Créer la classe ReleveBancaireHtml avec la méthode generer(compte: CompteBancaire): string
`,
    solutionCode: `export class CompteBancaire {
  constructor(
    public titulaire: string,
    public solde: number
  ) {}

  calculerInterets(taux: number): number {
    return this.solde * taux;
  }
}

export class ReleveBancaireHtml {
  generer(compte: CompteBancaire): string {
    return \`<div class="releve"><h1>Relevé Bancaire</h1><p>Titulaire: \${compte.titulaire}</p><p>Solde: \${compte.solde} €</p></div>\`;
  }
}
`,
    solutionExplanation: [
      'CompteBancaire ne dépend plus d\'aucune logique de présentation visuelle. Elle ne changera que si la formule financière évolue.',
      'ReleveBancaireHtml s\'occupe exclusivement de la mise en page. Si la charte graphique change, le calcul des intérêts n\'est pas impacté.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+ReleveBancaireHtml/,
        label: 'class ReleveBancaireHtml',
        errorMessage: 'Vous devez créer la classe ReleveBancaireHtml.'
      },
      {
        type: 'keyword',
        pattern: /calculerInterets\s*\(/,
        label: 'calculerInterets(taux: number)',
        errorMessage: 'La classe CompteBancaire doit proposer la méthode calculerInterets(taux: number): number.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompteClass = sandbox.CompteBancaire;
      const ReleveClass = sandbox.ReleveBancaireHtml;

      if (!CompteClass || !ReleveClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes CompteBancaire ou ReleveBancaireHtml introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes CompteBancaire ou ReleveBancaireHtml introuvables.' }
        ];
      }

      // Critère 1 : Calcul pur d'intérêts (number, sans HTML)
      try {
        const compte = new CompteClass('Alice', 1000);
        const res = compte.calculerInterets(0.05);
        const isNumber = typeof res === 'number' && Math.abs(res - 50) < 0.001;
        results.push({
          criterionId: 'c1',
          passed: isNumber,
          message: isNumber ? undefined : `Attendu: 50 (number), Reçu: ${JSON.stringify(res)}`
        });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: `Erreur lors du calcul : ${err.message}` });
      }

      // Critère 2 : Formatage HTML dédié
      try {
        const compte = new CompteClass('Bob', 2500);
        const releveur = new ReleveClass();
        const html = releveur.generer(compte);
        const hasTags = typeof html === 'string' && /(?:relev[eé]\s+bancaire)/i.test(html) && html.includes('Bob') && html.includes('2500');
        results.push({
          criterionId: 'c2',
          passed: hasTags,
          message: hasTags ? undefined : `Le HTML généré doit contenir "Relevé Bancaire", "Bob" et "2500". Reçu: ${html}`
        });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: `Erreur du générateur HTML : ${err.message}` });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Calcul financier pur',
        description: 'CompteBancaire.calculerInterets(0.05) renvoie 50 sous forme de nombre pur sans balises.',
        passed: false,
        hint: 'Implémentez calculerInterets(taux: number): number { return this.solde * taux; }'
      },
      {
        id: 'c2',
        label: 'Génération HTML dissociée',
        description: 'ReleveBancaireHtml.generer(compte) produit le code HTML du relevé.',
        passed: false,
        hint: 'Instanciez ReleveBancaireHtml et passez le compte à generer().'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-1-2',
    labNumber: 1,
    number: '1.2',
    title: 'Découplage de la Persistance',
    subtitle: 'Extraire les I/O de stockage vers une classe dédiée',
    sectionId: 'srp-single-responsibility',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: `Une classe GestionnaireTaches gère à la fois sa liste en mémoire et l'écriture dans le stockage.
1. Créez la classe StockageTachesLocal avec les méthodes sauvegarder(taches: Tache[]): void et charger(): Tache[].
2. Injectez ou utilisez StockageTachesLocal dans GestionnaireTaches pour lui déléguer la persistance.`,
    hint: 'Utilisez un tableau interne dans StockageTachesLocal pour simuler le stockage sans crash si le navigateur n\'a pas de localStorage actif.',
    initialCode: `export interface Tache {
  id: string;
  titre: string;
  terminee: boolean;
}

// TODO : Créer la classe StockageTachesLocal
// export class StockageTachesLocal {
//   private memoire: Tache[] = [];
//   sauvegarder(taches: Tache[]): void { ... }
//   charger(): Tache[] { ... }
// }

export class GestionnaireTaches {
  private taches: Tache[] = [];

  constructor(private stockage?: any) {}

  ajouterTache(titre: string): void {
    const nouvelle: Tache = { id: String(Date.now()), titre, terminee: false };
    this.taches.push(nouvelle);
    // TODO : Déléguer l'enregistrement à this.stockage
  }

  getTaches(): Tache[] {
    return [...this.taches];
  }
}
`,
    solutionCode: `export interface Tache {
  id: string;
  titre: string;
  terminee: boolean;
}

export class StockageTachesLocal {
  private memoire: Tache[] = [];

  sauvegarder(taches: Tache[]): void {
    this.memoire = taches.map(t => ({ ...t }));
  }

  charger(): Tache[] {
    return this.memoire.map(t => ({ ...t }));
  }
}

export class GestionnaireTaches {
  private taches: Tache[] = [];

  constructor(private stockage: StockageTachesLocal = new StockageTachesLocal()) {}

  ajouterTache(titre: string): void {
    const nouvelle: Tache = { id: String(this.taches.length + 1), titre, terminee: false };
    this.taches.push(nouvelle);
    this.stockage.sauvegarder(this.taches);
  }

  getTaches(): Tache[] {
    return [...this.taches];
  }
}
`,
    solutionExplanation: [
      'GestionnaireTaches ne sait plus comment les données sont écrites ou encodées.',
      'Si nous voulons passer à IndexedDB ou à une API Cloud, seule la classe de stockage sera réécrite.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+StockageTachesLocal/,
        label: 'class StockageTachesLocal',
        errorMessage: 'Vous devez créer la classe StockageTachesLocal.'
      },
      {
        type: 'keyword',
        pattern: /sauvegarder\s*\(/,
        label: 'sauvegarder(taches)',
        errorMessage: 'StockageTachesLocal doit posséder la méthode sauvegarder.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const StockageClass = sandbox.StockageTachesLocal;
      const GestionnaireClass = sandbox.GestionnaireTaches;

      if (!StockageClass || !GestionnaireClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const stockage = new StockageClass();
        stockage.sauvegarder([{ id: '1', titre: 'Acheter du pain', terminee: false }]);
        const charg = stockage.charger();
        const p1 = Array.isArray(charg) && charg.length === 1 && charg[0].titre === 'Acheter du pain';
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'StockageTachesLocal n\'enregistre ou ne restitue pas correctement.' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const stockage = new StockageClass();
        const gest = new GestionnaireClass(stockage);
        gest.ajouterTache('Préparer le cours POO');
        const charg = stockage.charger();
        const p2 = Array.isArray(charg) && charg.some((t: any) => t.titre === 'Préparer le cours POO');
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : 'GestionnaireTaches n\'a pas sauvegardé la tâche dans le stockage délégué.' });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Composant de stockage fonctionnel',
        description: 'StockageTachesLocal sauvegarde et restitue les tâches avec succès.',
        passed: false,
        hint: 'Stockez les tâches dans un tableau interne ou une variable privée.'
      },
      {
        id: 'c2',
        label: 'Délégation de persistance',
        description: 'L\'ajout d\'une tâche déclenche la persistance via StockageTachesLocal.',
        passed: false,
        hint: 'Appelez this.stockage.sauvegarder(this.taches) lors de l\'ajout.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-1-3',
    labNumber: 1,
    number: '1.3',
    title: 'Refactoring Angular : Smart vs Presentational',
    subtitle: 'Extraire les calculs financiers dans un service injectable',
    sectionId: 'srp-single-responsibility',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `Un composant Angular mélange l'affichage, le calcul de la TVA et la conversion de devises.
1. Créez la classe de service ProduitService avec :
   - calculerTtc(prixHt: number, tauxTva: number): number
   - convertirEnDevise(prixEuros: number, tauxChange: number): number
2. Ajustez ProduitDetailComponent pour utiliser ProduitService au lieu d'écrire des équations dans sa méthode.`,
    hint: 'Le composant délègue les calculs à son service injecté.',
    initialCode: `// TODO : Définir la classe ProduitService
export class ProduitService {
  // TODO : calculerTtc(prixHt: number, tauxTva: number): number
  // TODO : convertirEnDevise(prixEuros: number, tauxChange: number): number
}

export class ProduitDetailComponent {
  prixTtc: number = 0;
  prixDevise: number = 0;

  constructor(private produitService?: ProduitService) {}

  onCalculerPrix(prixHt: number, tauxTva: number, tauxChange: number): void {
    // ❌ Évitez de coder le calcul directement ici :
    // this.prixTtc = prixHt * (1 + tauxTva);
    // this.prixDevise = this.prixTtc * tauxChange;
    // TODO : Déléguer à ProduitService
  }
}
`,
    solutionCode: `export class ProduitService {
  calculerTtc(prixHt: number, tauxTva: number): number {
    return Math.round(prixHt * (1 + tauxTva) * 100) / 100;
  }

  convertirEnDevise(prixEuros: number, tauxChange: number): number {
    return Math.round(prixEuros * tauxChange * 100) / 100;
  }
}

export class ProduitDetailComponent {
  prixTtc: number = 0;
  prixDevise: number = 0;

  constructor(private produitService: ProduitService = new ProduitService()) {}

  onCalculerPrix(prixHt: number, tauxTva: number, tauxChange: number): void {
    this.prixTtc = this.produitService.calculerTtc(prixHt, tauxTva);
    this.prixDevise = this.produitService.convertirEnDevise(this.prixTtc, tauxChange);
  }
}
`,
    solutionExplanation: [
      'Le composant Angular se concentre sur l\'affichage et la liaison de données (UI).',
      'Le service concentre la règle de gestion mathématique, ce qui permet de le tester isolément sans instancier le DOM.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+ProduitService/,
        label: 'class ProduitService',
        errorMessage: 'Vous devez créer la classe ProduitService.'
      },
      {
        type: 'keyword',
        pattern: /calculerTtc\s*\(/,
        label: 'calculerTtc',
        errorMessage: 'ProduitService doit posséder la méthode calculerTtc.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const ServClass = sandbox.ProduitService;
      const CompClass = sandbox.ProduitDetailComponent;

      if (!ServClass || !CompClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const s = new ServClass();
        const ttc = s.calculerTtc(100, 0.21);
        const conv = s.convertirEnDevise(121, 1.10);
        const p1 = Math.abs(ttc - 121) < 0.1 && Math.abs(conv - 133.1) < 0.1;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : `Attendu TTC=121 et Conv=133.1. Reçu TTC=${ttc}, Conv=${conv}` });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const s = new ServClass();
        const comp = new CompClass(s);
        comp.onCalculerPrix(100, 0.21, 1.10);
        const p2 = Math.abs(comp.prixTtc - 121) < 0.1 && Math.abs(comp.prixDevise - 133.1) < 0.1;
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : `Le composant n'a pas mis à jour prixTtc ou prixDevise.` });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Service ProduitService opérationnel',
        description: 'ProduitService calcule le TTC et convertit la devise selon le taux.',
        passed: false,
        hint: 'Implémentez calculerTtc et convertirEnDevise dans ProduitService.'
      },
      {
        id: 'c2',
        label: 'Délégation dans le composant',
        description: 'ProduitDetailComponent utilise ProduitService pour mettre à jour ses propriétés d\'état.',
        passed: false,
        hint: 'Appelez this.produitService.calculerTtc(...) et assignez à this.prixTtc.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-1-4',
    labNumber: 1,
    number: '1.4',
    title: 'Audit de Cohésion : Démanteler UtilisateurManager',
    subtitle: 'Scinder une classe fourre-tout en 2 unités hautement cohésives',
    sectionId: 'srp-single-responsibility',
    estimatedTime: '6 min',
    difficulty: 'Intermédiaire',
    statement: `La classe UtilisateurManager mélange les préoccupations de sécurité et les notifications d'alertes.
Scindez cette classe en deux :
1. ServiceSecurite avec :
   - hacherMotDePasse(mdp: string): string (renvoyant "[HASHED]:" + mdp)
   - verifierIdentifiants(login: string, mdp: string): boolean (renvoie true si login === 'admin' et mdp === 'secret')
2. ServiceNotification avec :
   - envoyerEmailBienvenue(email: string): string (renvoyant "Email envoyé à " + email)
   - envoyerSmsAlerte(numero: string, msg: string): string (renvoyant "SMS envoyé au " + numero)`,
    hint: 'Chaque classe doit avoir un périmètre cohérent et délimité.',
    initialCode: `// ❌ CODE GOD OBJECT A SCINDER :
// export class UtilisateurManager {
//   hacherMotDePasse(...) { ... }
//   verifierIdentifiants(...) { ... }
//   envoyerEmailBienvenue(...) { ... }
//   envoyerSmsAlerte(...) { ... }
// }

// TODO : Créer ServiceSecurite
export class ServiceSecurite {
  // hacherMotDePasse(mdp: string): string
  // verifierIdentifiants(login: string, mdp: string): boolean
}

// TODO : Créer ServiceNotification
export class ServiceNotification {
  // envoyerEmailBienvenue(email: string): string
  // envoyerSmsAlerte(numero: string, msg: string): string
}
`,
    solutionCode: `export class ServiceSecurite {
  hacherMotDePasse(mdp: string): string {
    return \`[HASHED]:\${mdp}\`;
  }

  verifierIdentifiants(login: string, mdp: string): boolean {
    return login === 'admin' && mdp === 'secret';
  }
}

export class ServiceNotification {
  envoyerEmailBienvenue(email: string): string {
    return \`Email envoyé à \${email}\`;
  }

  envoyerSmsAlerte(numero: string, msg: string): string {
    return \`SMS envoyé au \${numero}\`;
  }
}
`,
    solutionExplanation: [
      'ServiceSecurite ne change que si la politique d\'authentification et de cryptographie évolue.',
      'ServiceNotification ne change que si les passerelles d\'envoi ou templates de messages évoluent.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+ServiceSecurite/,
        label: 'class ServiceSecurite',
        errorMessage: 'Vous devez créer la classe ServiceSecurite.'
      },
      {
        type: 'keyword',
        pattern: /class\s+ServiceNotification/,
        label: 'class ServiceNotification',
        errorMessage: 'Vous devez créer la classe ServiceNotification.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const SecClass = sandbox.ServiceSecurite;
      const NotifClass = sandbox.ServiceNotification;

      if (!SecClass || !NotifClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classes introuvables.' },
          { criterionId: 'c2', passed: false, message: 'Classes introuvables.' }
        ];
      }

      try {
        const sec = new SecClass();
        const h = sec.hacherMotDePasse('1234');
        const auth = sec.verifierIdentifiants('admin', 'secret');
        const authBad = sec.verifierIdentifiants('admin', 'wrong');
        const p1 = h.includes('1234') && auth === true && authBad === false;
        results.push({ criterionId: 'c1', passed: p1, message: p1 ? undefined : 'ServiceSecurite ne valide pas les identifiants ou le hash.' });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: err.message });
      }

      try {
        const notif = new NotifClass();
        const m1 = notif.envoyerEmailBienvenue('alice@test.be');
        const m2 = notif.envoyerSmsAlerte('0470123456', 'Code: 999');
        const p2 = m1.includes('alice@test.be') && m2.includes('0470123456');
        results.push({ criterionId: 'c2', passed: p2, message: p2 ? undefined : 'ServiceNotification ne formate pas les notifications.' });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Service de sécurité spécialisé',
        description: 'ServiceSecurite hache les mots de passe et valide les accès admin/secret.',
        passed: false,
        hint: 'Vérifiez if (login === "admin" && mdp === "secret").'
      },
      {
        id: 'c2',
        label: 'Service de notification isolé',
        description: 'ServiceNotification expédie les e-mails et SMS sans connaître la sécurité.',
        passed: false,
        hint: 'Retournez les messages formatés avec l\'adresse e-mail et le numéro.'
      }
    ],
    isCompleted: false
  }
];
