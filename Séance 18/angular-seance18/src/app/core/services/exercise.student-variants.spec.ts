import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';
import { stripComments } from './validation-utils';

describe('Student Variants & Edge Cases (Séance 18)', () => {
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

    it('transpileToJs doit supprimer les casts as string literal unions sans erreur de syntaxe', () => {
      const ts = 'function getTheme(): any { return "clair" as "clair" | "sombre"; }';
      const js = transpiler.transpileToJs(ts);
      expect(js).not.toContain('as "clair"');
      const res = transpiler.executeCode(ts);
      expect(res.success).toBe(true);
    });

    it('transpileToJs doit supprimer les assertions non-null postfixées !', () => {
      const ts = 'const a = localStorage.getItem("test")!; const b = a !== null;';
      const js = transpiler.transpileToJs(ts);
      expect(js).toContain('localStorage.getItem("test")');
      expect(js).toContain('!== null');
      const res = transpiler.executeCode(ts);
      expect(res.success).toBe(true);
    });

    it('createMockStorage Proxy doit supporter Object.keys(localStorage) fidèlement', () => {
      const mock = transpiler.createMockStorage({ a: '1', b: '2' });
      expect(Object.keys(mock)).toEqual(['a', 'b']);
      expect(mock.length).toBe(2);
      expect('a' in mock).toBe(true);
      mock.setItem('c', '3');
      expect(Object.keys(mock)).toEqual(['a', 'b', 'c']);
      mock.removeItem('b');
      expect(Object.keys(mock)).toEqual(['a', 'c']);
    });
  });

  describe('Variantes valides des étudiants sur les 19 exercices', () => {
    it('Ex 1.1 : doit valider avec cast union et opérateur ??', () => {
      const code = `
function sauvegarderTheme(theme: "clair" | "sombre"): void {
  localStorage.setItem("app_theme", theme);
}

function lireTheme(): "clair" | "sombre" {
  return (localStorage.getItem("app_theme") ?? "clair") as "clair" | "sombre";
}

sauvegarderTheme("sombre");
console.log("Thème lu après sauvegarde :", lireTheme());
localStorage.removeItem("app_theme");
console.log("Thème lu après suppression (défaut) :", lireTheme());
`;
      const res = service.validateExercise('ex-1-1', code);
      expect(res.success).toBe(true);
    });

    it('Ex 1.2 : doit valider avec brut !== "false"', () => {
      const code = `
function estPremiereVisite(): boolean {
  const brut = localStorage.getItem("visite");
  return brut !== "false";
}

localStorage.setItem("visite", "false");
console.log("Visite avec chaîne 'false' :", estPremiereVisite());
localStorage.removeItem("visite");
console.log("Visite si clé absente :", estPremiereVisite());
`;
      const res = service.validateExercise('ex-1-2', code);
      expect(res.success).toBe(true);
    });

    it('Ex 1.3 : doit valider avec +val + 1 et variable nommée val', () => {
      const code = `
function incrementerVisites(): number {
  const val = localStorage.getItem("visites_total");
  const count = (val ? +val : 0) + 1;
  localStorage.setItem("visites_total", count.toString());
  return count;
}

localStorage.setItem("visites_total", "0");
console.log("Passage 1 :", incrementerVisites());
console.log("Passage 2 :", incrementerVisites());
`;
      const res = service.validateExercise('ex-1-3', code);
      expect(res.success).toBe(true);
    });

    it('Ex 1.4 : doit valider avec Object.keys(localStorage) grâce au Proxy', () => {
      const code = `
function nettoyerPrefixe(prefixe: string): number {
  const cles = Object.keys(localStorage);
  let count = 0;
  for (const k of cles) {
    if (k.startsWith(prefixe)) {
      localStorage.removeItem(k);
      count++;
    }
  }
  return count;
}

localStorage.setItem("app_theme", "sombre");
localStorage.setItem("app_lang", "fr");
localStorage.setItem("session_token", "ne_pas_toucher");

const suppr = nettoyerPrefixe("app_");
console.log("Clés app_ supprimées :", suppr);
console.log("session_token préservé :", localStorage.getItem("session_token") !== null);
`;
      const res = service.validateExercise('ex-1-4', code);
      expect(res.success).toBe(true);
    });

    it('Ex 2.1 : doit valider avec catch sans type ou catch (e: any)', () => {
      const code = `
function sauvegarderSecurise(cle: string, valeur: string): boolean {
  try {
    localStorage.setItem(cle, valeur);
    return true;
  } catch (e: any) {
    return false;
  }
}

const ok = sauvegarderSecurise("config", "valeur_valide");
console.log("Sauvegarde réussie :", ok);
`;
      const res = service.validateExercise('ex-2-1', code);
      expect(res.success).toBe(true);
    });

    it('Ex 2.2 : doit valider avec variable de retour et non-null assertion', () => {
      const code = `
function lireJSONSecurise<T>(cle: string, repli: T): T {
  try {
    const raw = localStorage.getItem(cle);
    if (!raw) return repli;
    return JSON.parse(raw!) as T;
  } catch {
    return repli;
  }
}

localStorage.setItem("panier_valide", JSON.stringify(["Livre POO", "Clavier"]));
localStorage.setItem("panier_corrompu", "{ id: 1, broken_json...");

console.log("Lecture valide :", lireJSONSecurise("panier_valide", []));
console.log("Lecture corrompue (repli attendu) :", lireJSONSecurise("panier_corrompu", []));
`;
      const res = service.validateExercise('ex-2-2', code);
      expect(res.success).toBe(true);
    });

    it('Ex 2.3 : doit valider avec isPlatformBrowser', () => {
      const code = `
function estStorageDisponible(): boolean {
  if (!isPlatformBrowser(PLATFORM_ID)) return false;
  try {
    const probe = "__probe__";
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

console.log("Storage disponible dans cet environnement :", estStorageDisponible());
`;
      const res = service.validateExercise('ex-2-3', code);
      expect(res.success).toBe(true);
    });

    it('Ex 3.1 : doit valider avec getter typé : number', () => {
      const code = `
interface ArticleDTO {
  readonly id: string;
  readonly nom: string;
  readonly prixHT: number;
}

class Article {
  readonly #id: string;
  readonly #nom: string;
  readonly #prixHT: number;

  constructor(id: string, nom: string, prixHT: number) {
    this.#id = id;
    this.#nom = nom;
    this.#prixHT = prixHT;
  }

  get prixTTC(): number {
    return this.#prixHT * 1.2;
  }

  toDTO(): ArticleDTO {
    return {
      id: this.#id,
      nom: this.#nom,
      prixHT: this.#prixHT
    };
  }
}

const art = new Article("a1", "Écran 4K", 300);
console.log("Prix TTC calculé :", art.prixTTC);
console.log("DTO exporté :", art.toDTO());
`;
      const res = service.validateExercise('ex-3-1', code);
      expect(res.success).toBe(true);
    });

    it('Ex 3.2 : doit valider avec throw Error() sans mot-clé new', () => {
      const code = `
interface ArticleDTO {
  readonly id: string;
  readonly nom: string;
  readonly prixHT: number;
}

class Article {
  readonly #id: string;
  readonly #nom: string;
  readonly #prixHT: number;

  constructor(id: string, nom: string, prixHT: number) {
    if (prixHT < 0) {
      throw Error("Prix négatif interdit");
    }
    this.#id = id;
    this.#nom = nom;
    this.#prixHT = prixHT;
  }

  get prixTTC(): number { return this.#prixHT * 1.2; }

  static fromDTO(dto: ArticleDTO): Article {
    return new Article(dto.id, dto.nom, dto.prixHT);
  }
}

const dtoValide: ArticleDTO = { id: "a2", nom: "Souris Ergonomique", prixHT: 50 };
const articleVivante = Article.fromDTO(dtoValide);

console.log("instanceof Article :", articleVivante instanceof Article);
console.log("Méthode/Getter actif :", articleVivante.prixTTC);
`;
      const res = service.validateExercise('ex-3-2', code);
      expect(res.success).toBe(true);
    });

    it('Ex 4.1 : doit valider avec typage explicite readonly #notes: WritableSignal<string[]>', () => {
      const code = `
class NotesService {
  readonly #notes: any = signal<string[]>(this.#charger());
  readonly notes = this.#notes.asReadonly();

  #charger(): string[] {
    const b = localStorage.getItem("notes_app");
    return b ? JSON.parse(b) : [];
  }
}

localStorage.setItem("notes_app", JSON.stringify(["Note A", "Note B"]));
const service = new NotesService();

console.log("Nombre de notes initiales :", service.notes().length);
console.log("Contenu initial :", service.notes());
`;
      const res = service.validateExercise('ex-4-1', code);
      expect(res.success).toBe(true);
    });

    it('Ex 4.4 : doit valider avec fonction fléchée parenthésée .filter((item) => item.id !== id)', () => {
      const code = `
class NoteItem {
  constructor(public id: string, public titre: string) {}
}

class NotesService {
  readonly #notes = signal<NoteItem[]>([
    new NoteItem("n1", "Acheter café"),
    new NoteItem("n2", "Finir labo 4")
  ]);
  readonly notes = this.#notes.asReadonly();

  supprimer(id: string): void {
    const maj = this.#notes().filter((item) => item.id !== id);
    this.#notes.set(maj);
    localStorage.setItem("notes_app", JSON.stringify(maj));
  }
}

const svc = new NotesService();
svc.supprimer("n1");
console.log("Notes restantes :", svc.notes().map(n => n.titre));
`;
      const res = service.validateExercise('ex-4-4', code);
      expect(res.success).toBe(true);
    });

    it('Ex 5.2 : doit valider avec Yoda condition null === event.key', () => {
      const code = `
function synchroniserSiCleCible(
  event: { key: string | null },
  cleCible: string,
  onUpdate: () => void
): boolean {
  if (null === event.key || event.key === cleCible) {
    onUpdate();
    return true;
  }
  return false;
}

let compteUpdates = 0;
const maj = () => compteUpdates++;

console.log("Clé tierce ignorée :", synchroniserSiCleCible({ key: "autre_app" }, "mes_notes", maj));
console.log("Clé ciblée acceptée :", synchroniserSiCleCible({ key: "mes_notes" }, "mes_notes", maj));
console.log("localStorage.clear() (clé null) accepté :", synchroniserSiCleCible({ key: null }, "mes_notes", maj));
console.log("Total mises à jour déclenchées :", compteUpdates);
`;
      const res = service.validateExercise('ex-5-2', code);
      expect(res.success).toBe(true);
    });

    it('Ex 5.3 : doit valider avec paramètre court e et condition !e.newValue', () => {
      const code = `
function surveillerDeconnexion(cleAuth: string, onDeconnecte: () => void): void {
  window.addEventListener("storage", (e: any) => {
    if (e.key === cleAuth && !e.newValue) {
      onDeconnecte();
    }
  });
}

let deconnecte = false;
surveillerDeconnexion("auth_token", () => {
  deconnecte = true;
  console.log("Déconnexion inter-onglets déclenchée avec succès !");
});

window.dispatchEvent({ key: "auth_token", newValue: null });
console.log("Statut de déconnexion :", deconnecte);
`;
      const res = service.validateExercise('ex-5-3', code);
      expect(res.success).toBe(true);
    });
  });
});
