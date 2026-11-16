import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService, ExecutionResult } from './typescript-transpiler.service';
import { stripComments } from './validation-utils';
import { EXERCISES_REGISTRY } from './exercises.registry';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance19_exercises_v1';
  private readonly transpiler: TypescriptTranspilerService;

  constructor(customTranspiler?: TypescriptTranspilerService) {
    this.transpiler = customTranspiler ?? inject(TypescriptTranspilerService, { optional: true }) ?? new TypescriptTranspilerService();
    this.loadFromStorage();
  }

  readonly activeExerciseIndex = signal<number>(0);

  /** Définitions des 26 micro-exercices répartis en 6 labos */
  private readonly exerciseDefinitions: Omit<Exercise, 'currentCode'>[] = EXERCISES_REGISTRY;

  readonly exercises = signal<Exercise[]>(
    this.exerciseDefinitions.map(def => ({
      ...def,
      currentCode: def.initialCode,
      isCompleted: false,
      criteria: def.criteria.map(c => ({ ...c }))
    }))
  );

  readonly activeExercise = computed<Exercise>(() => {
    const list = this.exercises();
    const idx = this.activeExerciseIndex();
    return list[idx] ?? list[0];
  });

  readonly totalCount = computed<number>(() => this.exercises().length);

  readonly completedCount = computed<number>(() => {
    return this.exercises().filter(e => e.isCompleted).length;
  });

  readonly progressPercentage = computed<number>(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  getExercisesByLab(labNumber: number): Exercise[] {
    return this.exercises().filter(e => e.labNumber === labNumber);
  }

  selectExercise(exerciseId: string): void {
    const idx = this.exercises().findIndex(e => e.id === exerciseId);
    if (idx !== -1) {
      this.activeExerciseIndex.set(idx);
    }
  }

  selectNext(): void {
    const next = this.activeExerciseIndex() + 1;
    if (next < this.exercises().length) {
      this.activeExerciseIndex.set(next);
    }
  }

  selectPrevious(): void {
    const prev = this.activeExerciseIndex() - 1;
    if (prev >= 0) {
      this.activeExerciseIndex.set(prev);
    }
  }

  updateCode(exerciseId: string, newCode: string): void {
    this.exercises.update(list =>
      list.map(ex => {
        if (ex.id === exerciseId) {
          return { ...ex, currentCode: newCode };
        }
        return ex;
      })
    );
    this.saveToStorage();
  }

  resetCode(exerciseId: string): void {
    const def = this.exerciseDefinitions.find(d => d.id === exerciseId);
    if (!def) return;

    this.exercises.update(list =>
      list.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            currentCode: def.initialCode,
            isCompleted: false,
            criteria: def.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return ex;
      })
    );
    this.saveToStorage();
  }

  async validateExercise(exerciseId?: string, overrideCode?: string): Promise<{ success: boolean; logs: ConsoleLogEntry[]; error?: string; criteria?: ValidationCriterion[] }> {
    const targetId = exerciseId ?? this.activeExercise().id;
    const exercise = this.exercises().find(e => e.id === targetId);
    if (!exercise) {
      return { success: false, logs: [] };
    }
    return await this.evaluate(targetId, overrideCode ?? exercise.currentCode, 'student');
  }

  private async evaluate(targetId: string, rawCode: string, mode: 'baseline' | 'student' = 'student'): Promise<{ success: boolean; logs: ConsoleLogEntry[]; error?: string; criteria?: ValidationCriterion[] }> {
    const currentEx = this.exercises().find(e => e.id === targetId);
    if (!currentEx) {
      return { success: false, logs: [] };
    }

    const code = stripComments(rawCode);
    const exec: ExecutionResult = await this.transpiler.executeCode(rawCode);

    const updatedCriteria = currentEx.criteria.map(c => ({ ...c }));
    let allPassed = false;

    switch (targetId) {
      // =======================================================================
      // LABO 1 : Création de Base & Clés Primaires
      // =======================================================================
      case 'ex-1-1': {
        const hasExtends = /class\s+TodoDB\s+extends\s+Dexie\b/.test(code);
        const hasProp = /taches\s*!\s*:\s*Table\s*<\s*TacheDTO\s*,\s*string\s*>/.test(rawCode) ||
                        /taches\s*:\s*Table/.test(rawCode) ||
                        /taches\s*!/.test(rawCode);
        const hasSuper = /super\s*\(\s*["']TodoDB["']\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Nom de la base : TodoDB")) &&
          exec.logs.some(l => l.text.includes("Instance Dexie valide : true"));

        updatedCriteria[0].passed = hasExtends;
        updatedCriteria[1].passed = hasProp;
        updatedCriteria[2].passed = hasSuper;
        updatedCriteria[3].passed = compilesOk;
        allPassed = hasExtends && hasProp && hasSuper && compilesOk;
        break;
      }

      case 'ex-1-2': {
        const hasVersion = /version\s*\(\s*1\s*\)\s*\.\s*stores\s*\(/.test(code);
        const hasGoldenRule = /['"]?taches['"]?\s*:\s*["'][^"']*id[^"']*priorite[^"']*["']/.test(code) &&
                             !/['"]?taches['"]?\s*:\s*["'][^"']*description[^"']*["']/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Faire le labo")) &&
          exec.logs.some(l => l.text.includes("Description intacte sur disque : true"));

        updatedCriteria[0].passed = hasVersion;
        updatedCriteria[1].passed = hasGoldenRule;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasVersion && hasGoldenRule && compilesOk;
        break;
      }

      case 'ex-1-3': {
        const hasAutoInc = /['"]?logs['"]?\s*:\s*["'][^"']*\+\+id[^"']*["']/.test(code);
        const hasAddNoId = /logs\s*\.\s*add\s*\(/.test(code) && !/logs\s*\.\s*add\s*\(\s*\{[\s\S]*?\bid\s*:/m.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => /Clé numérique auto-générée\s*:\s*1\b/.test(l.text));

        updatedCriteria[0].passed = hasAutoInc;
        updatedCriteria[1].passed = hasAddNoId;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasAutoInc && hasAddNoId && compilesOk;
        break;
      }

      case 'ex-1-4': {
        const hasAdd = /articles\s*\.\s*add\s*\(/.test(code);
        const hasGet = /articles\s*\.\s*get\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Clavier Mécanique") && l.text.includes("89"));

        updatedCriteria[0].passed = hasAdd;
        updatedCriteria[1].passed = hasGet;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasAdd && hasGet && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 2 : Index Uniques, Multi-Entry & Composés
      // =======================================================================
      case 'ex-2-1': {
        const hasUnique = /['"]?livres['"]?\s*:\s*["'][^"']*&isbn[^"']*["']/.test(code);
        const hasCatch = /catch\s*(?:\([^)]*\))?\s*\{/.test(code) && /ConstraintError/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("ConstraintError") || l.text.includes("doublon refusé"));

        updatedCriteria[0].passed = hasUnique;
        updatedCriteria[1].passed = hasCatch;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasUnique && hasCatch && compilesOk;
        break;
      }

      case 'ex-2-2': {
        const hasMultiEntry = /['"]?livres['"]?\s*:\s*["'][^"']*\*genres[^"']*["']/.test(code);
        const hasQuery = /where\s*\(\s*["']genres["']\s*\)\s*\.\s*(?:equals|equalsIgnoreCase)\s*\(\s*["']SF["']\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("SF trouvés : 2"));

        updatedCriteria[0].passed = hasMultiEntry;
        updatedCriteria[1].passed = hasQuery;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasMultiEntry && hasQuery && compilesOk;
        break;
      }

      case 'ex-2-3': {
        const hasCompound = /\[\s*statut\s*\+\s*priorite\s*\]/.test(code);
        const hasQuery = /where\s*\(\s*["']\[\s*statut\s*\+\s*priorite\s*\]["']\s*\)\s*\.\s*equals\s*\(\s*\[\s*["']EN_COURS["']\s*,\s*["']HAUTE["']\s*\]\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("urgentes en cours trouvées : 1"));

        updatedCriteria[0].passed = hasCompound;
        updatedCriteria[1].passed = hasQuery;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasCompound && hasQuery && compilesOk;
        break;
      }

      case 'ex-2-4': {
        const hasCategoryIndex = /['"]?articles['"]?\s*:\s*["'][^"']*categorie[^"']*["']/.test(code);
        const hasWhere = /where\s*\(\s*["']categorie["']\s*\)\s*\.\s*equals\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("informatique trouvés : 1"));

        updatedCriteria[0].passed = hasCategoryIndex;
        updatedCriteria[1].passed = hasWhere;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasCategoryIndex && hasWhere && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 3 : Fluent API, Recherche & Réhydratation
      // =======================================================================
      case 'ex-3-1': {
        const hasPrefix = /where\s*\(\s*["']titre["']\s*\)\s*\.\s*startsWithIgnoreCase\s*\(/.test(code);
        const hasLimit = /limit\s*\(\s*5\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Harry Potter trouvés (insensible à la casse) : 3"));

        updatedCriteria[0].passed = hasPrefix;
        updatedCriteria[1].passed = hasLimit;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasPrefix && hasLimit && compilesOk;
        break;
      }

      case 'ex-3-2': {
        const hasBetween = /between\s*\(/.test(code) && /2026-10-01/.test(code) && /2026-10-31/.test(code);
        const hasField = /where\s*\(\s*["']dateEmpruntISO["']\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Emprunts d'octobre trouvés : 2"));

        updatedCriteria[0].passed = hasBetween;
        updatedCriteria[1].passed = hasField;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasBetween && hasField && compilesOk;
        break;
      }

      case 'ex-3-3': {
        const hasOrderBy = /orderBy\s*\(\s*["']titre["']\s*\)/.test(code);
        const hasOffsetLimit = /offset\s*\(/.test(code) && /limit\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Nombre de livres page 2 : 3")) &&
          exec.logs.some(l => l.text.includes("Design Patterns"));

        updatedCriteria[0].passed = hasOrderBy;
        updatedCriteria[1].passed = hasOffsetLimit;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasOrderBy && hasOffsetLimit && compilesOk;
        break;
      }

      case 'ex-3-4': {
        const hasWhere = /where\s*\(\s*["']categorie["']\s*\)\s*\.\s*equals\s*\(\s*["']Informatique["']\s*\)/.test(code);
        const hasFilter = /filter\s*\([\s\S]*?prix\s*<\s*50/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("informatique à moins de 50€ : 2"));

        updatedCriteria[0].passed = hasWhere;
        updatedCriteria[1].passed = hasFilter;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasWhere && hasFilter && compilesOk;
        break;
      }

      case 'ex-3-5': {
        const hasMap = /map\s*\([\s\S]*?Livre\s*\.\s*fromDTO/.test(code);
        const hasMethod = /estDisponible\s*\(\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("estDisponible() fonctionnelle : true")) &&
          exec.logs.some(l => l.text.includes("Instance de Livre : true"));

        updatedCriteria[0].passed = hasMap;
        updatedCriteria[1].passed = hasMethod;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasMap && hasMethod && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 4 : Transactions ACID & Robustesse
      // =======================================================================
      case 'ex-4-1': {
        const hasTx = /transaction\s*\(\s*["']rw["']\s*,\s*(?:\[\s*(?:db\.)?(?:livres|emprunts)\s*,\s*(?:db\.)?(?:livres|emprunts)\s*\]|(?:db\.)?(?:livres|emprunts)\s*,\s*(?:db\.)?(?:livres|emprunts))/.test(code);
        const hasOps = /update\s*\(/.test(code) && /emprunts\s*\.\s*add\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Stock mis à jour : 2")) &&
          exec.logs.some(l => l.text.includes("Emprunt créé : Alice"));

        updatedCriteria[0].passed = hasTx;
        updatedCriteria[1].passed = hasOps;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasTx && hasOps && compilesOk;
        break;
      }

      case 'ex-4-2': {
        const hasThrow = /throw\s+new\s+Error\s*\(/.test(code);
        const hasRestoration = /comptes\s*\.\s*get\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Solde après rollback : 100 €"));

        updatedCriteria[0].passed = hasThrow;
        updatedCriteria[1].passed = hasRestoration;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasThrow && hasRestoration && compilesOk;
        break;
      }

      case 'ex-4-3': {
        const hasMethod = /retirerUnExemplaire\s*\(\s*\)/.test(code);
        const hasSafe = /emprunts\s*\.\s*count\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Fiches d'emprunt créées : 0"));

        updatedCriteria[0].passed = hasMethod;
        updatedCriteria[1].passed = hasSafe;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasMethod && hasSafe && compilesOk;
        break;
      }

      case 'ex-4-4': {
        const regexExtract = /verifierQuotaReseau\s*\(\s*\)[\s\S]*?db\s*\.\s*transaction/;
        const hasExtract = regexExtract.test(code);
        const hasTxLocal = /db\s*\.\s*transaction\s*\(\s*["']rw["']\s*,\s*\[?\s*db\.items\s*\]?/.test(code) &&
                           !/db\s*\.\s*transaction[\s\S]*?verifierQuotaReseau[\s\S]*?db\s*\.\s*items/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Item enregistré sans TransactionInactiveError : Document Important"));

        updatedCriteria[0].passed = hasExtract;
        updatedCriteria[1].passed = hasTxLocal;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasExtract && hasTxLocal && compilesOk;
        break;
      }

      case 'ex-4-5': {
        const hasModeR = /transaction\s*\(\s*["']r["']\s*,\s*(?:\[\s*(?:db\.)?(?:livres|emprunts)\s*,\s*(?:db\.)?(?:livres|emprunts)\s*\]|(?:db\.)?(?:livres|emprunts)\s*,\s*(?:db\.)?(?:livres|emprunts))/.test(code);
        const hasCounts = /livres\s*\.\s*count\s*\(\s*\)/.test(code) && /emprunts\s*\.\s*count\s*\(\s*\)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Statistiques cohérentes : 2 livres, 1 emprunts"));

        updatedCriteria[0].passed = hasModeR;
        updatedCriteria[1].passed = hasCounts;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasModeR && hasCounts && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 5 : Migrations de Schéma Incrémentales
      // =======================================================================
      case 'ex-5-1': {
        const hasV1 = /version\s*\(\s*1\s*\)\s*\.\s*stores\s*\(\s*\{\s*['"]?contacts['"]?\s*:\s*["'][^"']*nomComplet/.test(code);
        const hasV2 = /version\s*\(\s*2\s*\)\s*\.\s*stores\s*\(\s*\{\s*['"]?contacts['"]?\s*:\s*["'][^"']*(?:nom[^"']*prenom|prenom[^"']*nom)/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Version active de la base : 2"));

        updatedCriteria[0].passed = hasV1;
        updatedCriteria[1].passed = hasV2;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasV1 && hasV2 && compilesOk;
        break;
      }

      case 'ex-5-2': {
        const hasUpgrade = /upgrade\s*\(\s*(?:async\s*)?(?:function\s*)?(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?:=>|\{)/.test(code);
        const hasModify = /toCollection\s*\(\s*\)\s*\.\s*modify\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Prénom extrait : Jean")) &&
          exec.logs.some(l => l.text.includes("Nom extrait : Dupont")) &&
          exec.logs.some(l => l.text.includes("nomComplet supprimé : true"));

        updatedCriteria[0].passed = hasUpgrade;
        updatedCriteria[1].passed = hasModify;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasUpgrade && hasModify && compilesOk;
        break;
      }

      case 'ex-5-3': {
        const hasActifIndex = /version\s*\(\s*2\s*\)\s*\.\s*stores\s*\(\s*\{[\s\S]*?actif/.test(code);
        const hasDefaultActif = /(?:\.actif|\[['"]actif['"]\])\s*=\s*true/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Contact migré avec valeur par défaut : true"));

        updatedCriteria[0].passed = hasActifIndex;
        updatedCriteria[1].passed = hasDefaultActif;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasActifIndex && hasDefaultActif && compilesOk;
        break;
      }

      case 'ex-5-4': {
        const hasV3 = /version\s*\(\s*3\s*\)\s*\.\s*stores\s*\(/.test(code);
        const hasNull = /['"]?archives['"]?\s*:\s*null/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Table archives définitivement supprimée : true"));

        updatedCriteria[0].passed = hasV3;
        updatedCriteria[1].passed = hasNull;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasV3 && hasNull && compilesOk;
        break;
      }

      // =======================================================================
      // LABO 6 : Architecture POO, Signals & BiblioTech
      // =======================================================================
      case 'ex-6-1': {
        const hasCheck = /throw\s+new\s+Error\s*\(\s*["']Stock épuisé["']\s*\)/.test(code) &&
                         (/estDisponible\s*\(\s*\)/.test(code) || /nbExemplaires\s*<=\s*0/.test(code));
        const hasDec = /--\s*(?:this\.)?#nbExemplaires|#nbExemplaires\s*--|#nbExemplaires\s*-=\s*1|#nbExemplaires\s*=\s*(?:this\.)?#nbExemplaires\s*-\s*1/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Stock après 1er retrait : 0")) &&
          exec.logs.some(l => l.text.includes("Exception levée au 2e retrait : Stock épuisé"));

        updatedCriteria[0].passed = hasCheck;
        updatedCriteria[1].passed = hasDec;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasCheck && hasDec && compilesOk;
        break;
      }

      case 'ex-6-2': {
        const toDtoMatch = code.match(/toDTO\s*\(\s*\)[\s\S]*?return\s*\{([\s\S]*?)\}/);
        const hasToDTO = !!toDtoMatch &&
                         /\bid\b/.test(toDtoMatch[1]) &&
                         /\btitre\b/.test(toDtoMatch[1]) &&
                         /\bstock\b/.test(toDtoMatch[1]);
        const hasFromDTO = /static\s+fromDTO\s*\([\s\S]*?\)[\s\S]*?new\s+LivreModele\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("DTO généré (objet pur) : l1 TypeScript Avancé 5")) &&
          exec.logs.some(l => l.text.includes("instanceof LivreModele : true"));

        updatedCriteria[0].passed = hasToDTO;
        updatedCriteria[1].passed = hasFromDTO;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasToDTO && hasFromDTO && compilesOk;
        break;
      }

      case 'ex-6-3': {
        const hasRead = /db\s*\.\s*livres\s*\.\s*toArray\s*\(\s*\)/.test(code);
        const hasRehydrate = /Livre\s*\.\s*fromDTO/.test(code);
        const hasSignal = /#?livres\s*\.\s*set\s*\(/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Nombre de livres dans le signal : 1")) &&
          exec.logs.some(l => l.text.includes("L'Étranger"));

        updatedCriteria[0].passed = hasRead;
        updatedCriteria[1].passed = hasRehydrate;
        updatedCriteria[2].passed = hasSignal;
        updatedCriteria[3].passed = compilesOk;
        allPassed = hasRead && hasRehydrate && hasSignal && compilesOk;
        break;
      }

      case 'ex-6-4': {
        const hasAwait = /await\s+db(?:\.livres|\['livres'\])\s*\.\s*add\s*\(/.test(code);
        const hasAsync = /async\s+ajouterLivre/.test(code);
        const compilesOk = exec.success &&
          exec.logs.some(l => l.text.includes("Nombre de livres après ajout synchrone : 1"));

        updatedCriteria[0].passed = hasAwait;
        updatedCriteria[1].passed = hasAsync;
        updatedCriteria[2].passed = compilesOk;
        allPassed = hasAwait && hasAsync && compilesOk;
        break;
      }

      default:
        allPassed = exec.success;
        break;
    }

    if (mode === 'student') {
      this.exercises.update(list =>
        list.map(ex => {
          if (ex.id === targetId) {
            return {
              ...ex,
              isCompleted: allPassed,
              criteria: updatedCriteria
            };
          }
          return ex;
        })
      );
      this.saveToStorage();
    }

    return {
      success: allPassed,
      logs: exec.logs,
      error: exec.error,
      criteria: updatedCriteria
    };
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed: Array<{ id: string; currentCode: string; isCompleted: boolean }> = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const codeMap = new Map(parsed.map(p => [p.id, p]));
      this.exercises.update(list =>
        list.map(ex => {
          const saved = codeMap.get(ex.id);
          if (saved) {
            return {
              ...ex,
              currentCode: saved.currentCode ?? ex.initialCode,
              isCompleted: !!saved.isCompleted
            };
          }
          return ex;
        })
      );
    } catch {
      // Ignorer si stockage corrompu
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const payload = this.exercises().map(e => ({
        id: e.id,
        currentCode: e.currentCode,
        isCompleted: e.isCompleted
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // QuotaExceededError ou SSR
    }
  }
}
