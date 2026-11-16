import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { stripComments } from './validation-utils';

describe('Student Variants & Edge Cases (Séance 19 · IndexedDB & Dexie.js)', () => {
  let service: ExerciseService;
  let transpiler: TypescriptTranspilerService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.clear();
      } catch {}
    }
    transpiler = new TypescriptTranspilerService();
    service = new ExerciseService(transpiler);
  });

  describe('Validation Utils & Transpiler Robustness', () => {
    it('stripComments ne doit jamais tronquer les URLs ou chaînes contenant // ou /*', () => {
      const code = 'const url = "https://api.eafc.be/articles?filter=/*tag*/"; // commentaire\nconst path = \'http://localhost:4200\';';
      const clean = stripComments(code);
      expect(clean).toContain('"https://api.eafc.be/articles?filter=/*tag*/"');
      expect(clean).toContain("'http://localhost:4200'");
      expect(clean).not.toContain('commentaire');
    });

    it('transpileToJs doit préserver les champs privés natifs (#field)', () => {
      const ts = `
        class Livre {
          #id: string;
          #stock: number;
          constructor(id: string, stock: number) {
            this.#id = id;
            this.#stock = stock;
          }
          get stock(): number { return this.#stock; }
        }
      `;
      const js = transpiler.transpileToJs(ts);
      expect(js).toContain('#id');
      expect(js).toContain('#stock');
    });

    it('transpileToJs doit supprimer les déclarations de types génériques comme Table<DTO, string>', () => {
      const ts = 'class TestDB extends Dexie { articles!: Table<ArticleDTO, string>; }';
      const js = transpiler.transpileToJs(ts);
      expect(js).not.toContain('Table<');
    });

    it('transpileToJs doit correctement transpiler la solution 4.5', async () => {
      const ex = service.exercises().find(e => e.id === 'ex-4-5')!;
      const js = transpiler.transpileToJs(ex.solutionCode);
      expect(js).toContain('BiblioDB');
      const res = await service.validateExercise('ex-4-5', ex.solutionCode);
      expect(res.success).toBe(true);
    });
  });

  describe('Variantes d\'écriture valides des étudiants', () => {
    it('Ex 1.1 : accepte différentes syntaxes d\'héritage et guillemets simples', async () => {
      const variant = `
class TodoDB extends Dexie {
  taches!: Table<TacheDTO, string>;

  constructor() {
    super('TodoDB');
  }
}

const db = new TodoDB();
console.log("Nom de la base :", db.name);
console.log("Instance Dexie valide :", db instanceof Dexie);
`;
      const res = await service.validateExercise('ex-1-1', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 1.2 : accepte un espacement varié dans la définition de stores', async () => {
      const variant = `
class TodoDB extends Dexie {
  taches!: Table<TacheDTO, string>;

  constructor() {
    super("TodoDB_" + crypto.randomUUID());
    this.version(1).stores({
      taches: 'id,priorite'
    });
  }
}

const db = new TodoDB();
await db.open();
await db.taches.add({
  id: "t1",
  titre: "Faire le labo",
  priorite: "HAUTE",
  description: "Texte volumineux qui n'a pas besoin d'index"
});
const t = await db.taches.get("t1");
console.log("Tâche lue :", t?.titre, "| Priorité :", t?.priorite);
console.log("Description intacte sur disque :", t?.description !== undefined);
await db.delete();
`;
      const res = await service.validateExercise('ex-1-2', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 3.1 : accepte les fonctions fléchées pour la recherche de livres', async () => {
      const variant = `
class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.bulkAdd([
  { id: "1", titre: "Harry Potter à l'école des sorciers" },
  { id: "2", titre: "harry potter et la chambre des secrets" },
  { id: "3", titre: "HARRY POTTER et le prisonnier d'Azkaban" },
  { id: "4", titre: "Le Seigneur des Anneaux" }
]);

const chercherLivres = async (prefixe: string) => {
  return await db.livres
    .where('titre')
    .startsWithIgnoreCase(prefixe)
    .limit(5)
    .toArray();
};

const resultats = await chercherLivres("ha");
console.log("Livres Harry Potter trouvés (insensible à la casse) :", resultats.length);
await db.delete();
`;
      const res = await service.validateExercise('ex-3-1', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 4.2 : accepte différentes formulations d\'exception pour le rollback', async () => {
      const variant = `
class BanqueDB extends Dexie {
  comptes!: Table<any, string>;
  constructor() {
    super("BanqueDB_" + crypto.randomUUID());
    this.version(1).stores({ comptes: "id" });
  }
}

const db = new BanqueDB();
await db.open();

await db.comptes.add({ id: "c1", titulaire: "Alice", solde: 100 });

try {
  await db.transaction('rw', db.comptes, async () => {
    await db.comptes.update("c1", { solde: 50 });
    throw new Error('Erreur solde insuffisant');
  });
} catch (e: any) {
  console.log("Exception capturée :", e.message);
}

const c = await db.comptes.get("c1");
console.log("Solde après rollback :", c?.solde, "€");
await db.delete();
`;
      const res = await service.validateExercise('ex-4-2', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 3.4 : accepte filter avec parenthèses autour du paramètre (a) => a.prix < 50', async () => {
      const variant = `
class BoutiqueDB extends Dexie {
  articles!: Table<ArticleDTO, string>;
  constructor() {
    super("BoutiqueDB_" + crypto.randomUUID());
    this.version(1).stores({ articles: "id, categorie" });
  }
}

const db = new BoutiqueDB();
await db.open();

await db.articles.bulkAdd([
  { id: "1", titre: "Câble HDMI", prix: 12, categorie: "Informatique" },
  { id: "2", titre: "Écran 4K", prix: 350, categorie: "Informatique" },
  { id: "3", titre: "Clé USB", prix: 25, categorie: "Informatique" },
  { id: "4", titre: "Chaise bureau", prix: 45, categorie: "Mobilier" }
]);

const bonsPlansInfo = await db.articles
  .where("categorie")
  .equals("Informatique")
  .filter((a: any) => a.prix < 50)
  .toArray();

console.log("Articles informatique à moins de 50€ :", bonsPlansInfo.length);
await db.delete();
`;
      const res = await service.validateExercise('ex-3-4', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 3.5 : accepte map avec fonction fléchée explicite (dto) => Livre.fromDTO(dto)', async () => {
      const variant = `
class BiblioDB extends Dexie {
  livres!: Table<LivreDTO, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({ livres: "id, isbn, titre" });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({
  id: "l1",
  isbn: "978-2070368228",
  titre: "L'Étranger",
  genres: ["Roman"],
  nbExemplaires: 3
});

const dtos = await db.livres.toArray();
const livresVivants = dtos.map((dto: any) => Livre.fromDTO(dto));

console.log("Nombre de livres réhydratés :", livresVivants.length);
if (livresVivants.length > 0) {
  console.log("Méthode estDisponible() fonctionnelle :", livresVivants[0].estDisponible());
  console.log("Instance de Livre :", livresVivants[0] instanceof Livre);
}

await db.delete();
`;
      const res = await service.validateExercise('ex-3-5', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 4.1 : accepte ordre inversé des tables dans transaction [db.emprunts, db.livres]', async () => {
      const variant = `
class BiblioDB extends Dexie {
  livres!: Table<any, string>;
  emprunts!: Table<any, string>;
  constructor() {
    super("BiblioDB_" + crypto.randomUUID());
    this.version(1).stores({
      livres: "id, titre",
      emprunts: "id, livreId"
    });
  }
}

const db = new BiblioDB();
await db.open();

await db.livres.add({ id: "l1", titre: "Dune", nbExemplaires: 3 });

await db.transaction("rw", [db.emprunts, db.livres], async () => {
  await db.livres.update("l1", { nbExemplaires: 2 });
  await db.emprunts.add({ id: "e1", livreId: "l1", adherentNom: "Alice" });
});

const l = await db.livres.get("l1");
const e = await db.emprunts.get("e1");
console.log("Stock mis à jour :", l?.nbExemplaires);
console.log("Emprunt créé :", e?.adherentNom);
console.log("Transaction atomique validée !");
await db.delete();
`;
      const res = await service.validateExercise('ex-4-1', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 4.4 : accepte transaction avec tableau de tables [db.items]', async () => {
      const variant = `
class QuotaDB extends Dexie {
  items!: Table<any, string>;
  constructor() {
    super("QuotaDB_" + crypto.randomUUID());
    this.version(1).stores({ items: "id" });
  }
}

const db = new QuotaDB();
await db.open();

async function verifierQuotaReseau(): Promise<boolean> {
  return true;
}

async function enregistrerItemSecurise(id: string, libelle: string): Promise<void> {
  const autorise = await verifierQuotaReseau();
  if (!autorise) return;

  await db.transaction("rw", [db.items], async () => {
    await db.items.add({ id, libelle });
  });
}

await enregistrerItemSecurise("i1", "Document Important");
const item = await db.items.get("i1");
console.log("Item enregistré sans TransactionInactiveError :", item?.libelle);
await db.delete();
`;
      const res = await service.validateExercise('ex-4-4', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 5.1 : accepte inversion de colonnes non-clés "id, prenom, nom"', async () => {
      const variant = `
class CarnetDB extends Dexie {
  contacts!: Table<any, string>;
  constructor() {
    super("CarnetDB_" + crypto.randomUUID());
    
    this.version(1).stores({
      contacts: "id, nomComplet"
    });

    this.version(2).stores({
      contacts: "id, prenom, nom"
    });
  }
}

const db = new CarnetDB();
await db.open();
console.log("Version active de la base :", db.verno);
await db.delete();
`;
      const res = await service.validateExercise('ex-5-1', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 5.2 : accepte upgrade synchrone retournant une promesse (sans mot-clé async devant tx)', async () => {
      const variant = `
const dbName = "CarnetDB_" + crypto.randomUUID();

const dbV1 = new Dexie(dbName);
dbV1.version(1).stores({ contacts: "id, nomComplet" });
await dbV1.open();
await dbV1.table("contacts").add({ id: "c1", nomComplet: "Jean Dupont" });
dbV1.close();

const dbV2 = new Dexie(dbName);
dbV2.version(1).stores({ contacts: "id, nomComplet" });
dbV2.version(2).stores({ contacts: "id, nom, prenom" })
  .upgrade(tx => {
    return tx.table("contacts").toCollection().modify((c: any) => {
      const parts = (c.nomComplet || "").split(" ");
      c.prenom = parts[0] || "";
      c.nom = parts.slice(1).join(" ") || "";
      delete c.nomComplet;
    });
  });

await dbV2.open();

const c = await dbV2.table("contacts").get("c1");
console.log("Prénom extrait :", c?.prenom);
console.log("Nom extrait :", c?.nom);
console.log("nomComplet supprimé :", c?.nomComplet === undefined);
await dbV2.delete();
`;
      const res = await service.validateExercise('ex-5-2', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 6.1 : accepte pre-decrement --this.#nbExemplaires', async () => {
      const variant = `
class LivreExemplaire {
  #titre: string;
  #nbExemplaires: number;

  constructor(titre: string, nb: number) {
    this.#titre = titre;
    this.#nbExemplaires = nb;
  }

  get titre(): string { return this.#titre; }
  get nbExemplaires(): number { return this.#nbExemplaires; }
  estDisponible(): boolean { return this.#nbExemplaires > 0; }

  retirerUnExemplaire(): void {
    if (!this.estDisponible()) {
      throw new Error("Stock épuisé");
    }
    --this.#nbExemplaires;
  }
}

const livre = new LivreExemplaire("Clean Code", 1);
livre.retirerUnExemplaire();
console.log("Stock après 1er retrait :", livre.nbExemplaires);

try {
  livre.retirerUnExemplaire();
} catch (err: any) {
  console.log("Exception levée au 2e retrait :", err.message);
}
`;
      const res = await service.validateExercise('ex-6-1', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 6.2 : accepte un ordre différent des propriétés dans toDTO()', async () => {
      const variant = `
class LivreModele {
  #id: string;
  #titre: string;
  #stock: number;

  constructor(id: string, titre: string, stock: number) {
    this.#id = id;
    this.#titre = titre;
    this.#stock = stock;
  }

  get id(): string { return this.#id; }
  get titre(): string { return this.#titre; }
  get stock(): number { return this.#stock; }

  toDTO(): any {
    return {
      id: this.#id,
      stock: this.#stock,
      titre: this.#titre
    };
  }

  static fromDTO(dto: any): LivreModele {
    return new LivreModele(dto.id, dto.titre, dto.stock);
  }
}

const entite = new LivreModele("l1", "TypeScript Avancé", 5);
const dto = entite.toDTO();
console.log("DTO généré (objet pur) :", dto?.id, dto?.titre, dto?.stock);

const réhydraté = LivreModele.fromDTO(dto);
console.log("Entité ressuscitée :", réhydraté?.titre, "| instanceof LivreModele :", réhydraté instanceof LivreModele);
`;
      const res = await service.validateExercise('ex-6-2', variant);
      expect(res.success).toBe(true);
    });

    it('Ex 2.3 : accepte guillemets simples et formatage varié pour l\'index composé [statut+priorite]', async () => {
      const variant = `
class TaskDB extends Dexie {
  taches!: Table<any, string>;
  constructor() {
    super("TaskDB_" + crypto.randomUUID());
    this.version(1).stores({
      taches: 'id, [statut+priorite]'
    });
  }
}

const db = new TaskDB();
await db.open();

await db.taches.bulkAdd([
  { id: "t1", titre: "Corriger bug prod", statut: "EN_COURS", priorite: "HAUTE" },
  { id: "t2", titre: "Rédiger doc", statut: "EN_COURS", priorite: "BASSE" },
  { id: "t3", titre: "Mettre à jour Angular", statut: "A_FAIRE", priorite: "HAUTE" }
]);

const urgentes = await db.taches
  .where('[statut+priorite]')
  .equals(['EN_COURS', 'HAUTE'])
  .toArray();

console.log("Tâches urgentes en cours trouvées :", urgentes.length);
await db.delete();
`;
      const res = await service.validateExercise('ex-2-3', variant);
      expect(res.success).toBe(true);
    });
  });
});
