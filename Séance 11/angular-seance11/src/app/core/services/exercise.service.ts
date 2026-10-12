import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  Exercise, 
  ExerciseDef, 
  ValidationSummary, 
  ConsoleLogEntry 
} from '../models/app.models';
import { ConfettiService } from './confetti.service';
import { LAB1_EXERCISES } from '../data/lab1.data';
import { LAB2_EXERCISES } from '../data/lab2.data';
import { LAB3_EXERCISES } from '../data/lab3.data';
import { LAB4_EXERCISES } from '../data/lab4.data';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'seance11_exercises_progress';
  private readonly CODES_STORAGE_KEY = 'seance11_exercises_code';
  private readonly confetti = inject(ConfettiService);

  private readonly RAW_EXERCISES: ExerciseDef[] = [
    ...LAB1_EXERCISES,
    ...LAB2_EXERCISES,
    ...LAB3_EXERCISES,
    ...LAB4_EXERCISES
  ];

  readonly exercises = signal<Exercise[]>([]);
  readonly selectedExerciseId = signal<string>('ex-1-1');

  readonly totalCount = computed(() => this.exercises().length);
  readonly completedCount = computed(() => this.exercises().filter(e => e.isCompleted).length);
  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  readonly activeExercise = computed(() => {
    const id = this.selectedExerciseId();
    return this.exercises().find(e => e.id === id) || this.exercises()[0];
  });

  /** Compilateur TypeScript officiel, chargé à la demande (chunk séparé). */
  private tsCompiler: any = null;
  /** Résolue quand le compilateur TypeScript est prêt (ou a échoué : repli sur le transpileur léger). */
  readonly ready: Promise<void>;

  constructor() {
    this.initExercises();
    this.ready = this.loadTypeScriptCompiler();
  }

  /** Permet d'injecter un compilateur TypeScript (ex. environnement de test Node). */
  useCompiler(compiler: any): void {
    this.tsCompiler = compiler;
  }

  /**
   * Charge typescript.js (copié dans /assets/typescript par angular.json) sans passer par le bundler,
   * car le paquet `typescript` n'est pas bundlable côté navigateur.
   */
  private async loadTypeScriptCompiler(): Promise<void> {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
    try {
      const res = await fetch('assets/typescript/typescript.js');
      if (!res.ok) throw new Error(String(res.status));
      const source = await res.text();
      const mod: { exports: any } = { exports: {} };
      new Function('module', 'exports', source)(mod, mod.exports);
      if (mod.exports?.transpileModule) this.tsCompiler = mod.exports;
    } catch (e) {
      console.warn('[ExerciseService] Compilateur TypeScript indisponible, repli sur le transpileur léger.', e);
    }
  }

  private initExercises(): void {
    let savedProgress: Record<string, boolean> = {};
    let savedCodes: Record<string, string> = {};
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) savedProgress = JSON.parse(raw);
      } catch (e) {}
      try {
        const rawCodes = localStorage.getItem(this.CODES_STORAGE_KEY);
        if (rawCodes) savedCodes = JSON.parse(rawCodes);
      } catch (e) {}
    }

    const list: Exercise[] = this.RAW_EXERCISES.map(def => {
      const userCode = savedCodes[def.id] ?? def.initialCode;
      const isInitialCode = userCode.trim() === def.initialCode.trim();
      const isCompleted = !isInitialCode && !!savedProgress[def.id];

      return {
        ...def,
        currentCode: userCode,
        isCompleted,
        criteria: def.criteria.map(c => ({
          ...c,
          passed: isCompleted
        }))
      };
    });

    this.exercises.set(list);
  }

  selectExercise(id: string): void {
    this.selectedExerciseId.set(id);
  }

  updateCode(id: string, code: string): void {
    this.exercises.update(list => 
      list.map(e => e.id === id ? { ...e, currentCode: code } : e)
    );
    this.saveCodes();
  }

  injectSolution(id: string): void {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) return;
    this.updateCode(id, ex.solutionCode);
  }

  resetExercise(id: string): void {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) return;

    const resetCriteria = ex.criteria.map(c => ({ ...c, passed: false }));
    this.exercises.update(list => 
      list.map(e => e.id === id ? { 
        ...e, 
        currentCode: ex.initialCode, 
        isCompleted: false, 
        criteria: resetCriteria 
      } : e)
    );

    if (typeof localStorage !== 'undefined') {
      try {
        const rawProg = localStorage.getItem(this.STORAGE_KEY);
        if (rawProg) {
          const prog = JSON.parse(rawProg);
          delete prog[id];
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prog));
        }
        const rawCodes = localStorage.getItem(this.CODES_STORAGE_KEY);
        if (rawCodes) {
          const codes = JSON.parse(rawCodes);
          delete codes[id];
          localStorage.setItem(this.CODES_STORAGE_KEY, JSON.stringify(codes));
        }
      } catch (e) {}
    }
  }

  resetAllExercises(): void {
    this.exercises.update(list =>
      list.map(e => ({
        ...e,
        currentCode: e.initialCode,
        isCompleted: false,
        criteria: e.criteria.map(c => ({ ...c, passed: false }))
      }))
    );

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.CODES_STORAGE_KEY);
      } catch (e) {}
    }
  }

  evaluateExercise(id: string): ValidationSummary {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) {
      return {
        success: false,
        passedCount: 0,
        totalCount: 0,
        messages: ['Exercice introuvable'],
        consoleLogs: []
      };
    }

    const logs: ConsoleLogEntry[] = [];
    const messages: string[] = [];
    const rawLogs: string[] = [];
    let syntaxPassed = true;
    let executionError: string | undefined;
    let sandboxContext: any = {};

    // 1. Vérification des contraintes syntaxiques (en ignorant les commentaires)
    const codeWithoutComments = ex.currentCode
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '');

    for (const req of ex.syntaxRequirements) {
      const regex = typeof req.pattern === 'string' ? new RegExp(req.pattern) : req.pattern;
      if (req.type === 'forbidden') {
        if (regex.test(codeWithoutComments)) {
          syntaxPassed = false;
          messages.push(`Syntaxe interdite : ${req.errorMessage}`);
          logs.push({
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: `✖ Erreur : ${req.errorMessage}`
          });
        }
      } else {
        if (!regex.test(codeWithoutComments)) {
          syntaxPassed = false;
          messages.push(req.errorMessage);
          logs.push({
            type: 'warn',
            timestamp: new Date().toLocaleTimeString(),
            message: `⚠ Critère manquant : ${req.errorMessage}`
          });
        }
      }
    }

    // 2. Transpilation et Exécution Sandboxée
    try {
      const transpileJs = this.transpileTsToJs(ex.currentCode);

      const customConsole = {
        log: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'log',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        info: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'info',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        warn: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'warn',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        error: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        }
      };

      const executionCode = `
        ${transpileJs}
        return {
          CompteBancaire: typeof CompteBancaire !== 'undefined' ? CompteBancaire : undefined,
          ReleveBancaireHtml: typeof ReleveBancaireHtml !== 'undefined' ? ReleveBancaireHtml : undefined,
          StockageTachesLocal: typeof StockageTachesLocal !== 'undefined' ? StockageTachesLocal : undefined,
          GestionnaireTaches: typeof GestionnaireTaches !== 'undefined' ? GestionnaireTaches : undefined,
          ProduitService: typeof ProduitService !== 'undefined' ? ProduitService : undefined,
          ProduitDetailComponent: typeof ProduitDetailComponent !== 'undefined' ? ProduitDetailComponent : undefined,
          ServiceSecurite: typeof ServiceSecurite !== 'undefined' ? ServiceSecurite : undefined,
          ServiceNotification: typeof ServiceNotification !== 'undefined' ? ServiceNotification : undefined,
          FraisPortDHL: typeof FraisPortDHL !== 'undefined' ? FraisPortDHL : undefined,
          FraisPortPoste: typeof FraisPortPoste !== 'undefined' ? FraisPortPoste : undefined,
          ServiceExpedition: typeof ServiceExpedition !== 'undefined' ? ServiceExpedition : undefined,
          RemiseEtudiant: typeof RemiseEtudiant !== 'undefined' ? RemiseEtudiant : undefined,
          CalculateurRemise: typeof CalculateurRemise !== 'undefined' ? CalculateurRemise : undefined,
          RegleEmail: typeof RegleEmail !== 'undefined' ? RegleEmail : undefined,
          RegleLongueurMin: typeof RegleLongueurMin !== 'undefined' ? RegleLongueurMin : undefined,
          FormValidator: typeof FormValidator !== 'undefined' ? FormValidator : undefined,
          EmailNotification: typeof EmailNotification !== 'undefined' ? EmailNotification : undefined,
          WebhookDiscordNotification: typeof WebhookDiscordNotification !== 'undefined' ? WebhookDiscordNotification : undefined,
          ServiceAlerte: typeof ServiceAlerte !== 'undefined' ? ServiceAlerte : undefined,
          StockageSessionMemoire: typeof StockageSessionMemoire !== 'undefined' ? StockageSessionMemoire : undefined,
          ServiceAuthentification: typeof ServiceAuthentification !== 'undefined' ? ServiceAuthentification : undefined,
          GestionCatalogue: typeof GestionCatalogue !== 'undefined' ? GestionCatalogue : undefined,
          InMemoryArticleRepository: typeof InMemoryArticleRepository !== 'undefined' ? InMemoryArticleRepository : undefined,
          executerTestUnitaire: typeof executerTestUnitaire !== 'undefined' ? executerTestUnitaire : undefined,
          ProduitApiService: typeof ProduitApiService !== 'undefined' ? ProduitApiService : undefined,
          testerAvecMock: typeof testerAvecMock !== 'undefined' ? testerAvecMock : undefined,
          CalculateurTaxe: typeof CalculateurTaxe !== 'undefined' ? CalculateurTaxe : undefined,
          PaiementStripe: typeof PaiementStripe !== 'undefined' ? PaiementStripe : undefined,
          MoteurCommande: typeof MoteurCommande !== 'undefined' ? MoteurCommande : undefined,
          CalculateurRemiseSimple: typeof CalculateurRemiseSimple !== 'undefined' ? CalculateurRemiseSimple : undefined,
          EnregistreurMemoire: typeof EnregistreurMemoire !== 'undefined' ? EnregistreurMemoire : undefined,
          GestionnaireFacturation: typeof GestionnaireFacturation !== 'undefined' ? GestionnaireFacturation : undefined
        };
      `;

      const sandboxRunner = new Function('console', executionCode);
      sandboxContext = sandboxRunner(customConsole);

    } catch (err: any) {
      executionError = err.message || String(err);
      logs.push({
        type: 'error',
        timestamp: new Date().toLocaleTimeString(),
        message: `Erreur d'exécution : ${executionError}`
      });

      const failedCriteria = ex.criteria.map(c => ({ ...c, passed: false }));
      this.exercises.update(list => 
        list.map(e => e.id === id ? { ...e, criteria: failedCriteria, isCompleted: false } : e)
      );

      return {
        success: false,
        passedCount: 0,
        totalCount: ex.criteria.length,
        messages: [executionError || 'Erreur d\'exécution du code'],
        consoleLogs: logs,
        executionError
      };
    }

    // 3. Évaluation des critères avec sandboxContext
    let evalResults: { criterionId: string; passed: boolean; message?: string }[] = [];
    try {
      evalResults = ex.evaluateFn(sandboxContext, rawLogs);
    } catch (err: any) {
      executionError = `Erreur dans les assertions de test : ${err.message}`;
      logs.push({
        type: 'error',
        timestamp: new Date().toLocaleTimeString(),
        message: executionError
      });
    }

    const updatedCriteria = ex.criteria.map(c => {
      const match = evalResults.find(r => r.criterionId === c.id);
      return {
        ...c,
        passed: syntaxPassed && !!match?.passed
      };
    });

    evalResults.forEach(r => {
      if (r.message) {
        messages.push(r.message);
        logs.push({
          type: r.passed ? 'info' : 'warn',
          timestamp: new Date().toLocaleTimeString(),
          message: `${r.passed ? '✔' : '✖'} ${r.message}`
        });
      }
    });

    const passedCount = updatedCriteria.filter(c => c.passed).length;
    const isSuccess = syntaxPassed && !executionError && passedCount === updatedCriteria.length;

    if (isSuccess) {
      logs.push({
        type: 'success',
        timestamp: new Date().toLocaleTimeString(),
        message: `🎉 Félicitations ! L'exercice ${ex.number} est 100% validé !`
      });
      this.confetti.triggerSuccess();
    }

    this.exercises.update(list => 
      list.map(e => e.id === id ? { 
        ...e, 
        criteria: updatedCriteria, 
        isCompleted: isSuccess 
      } : e)
    );

    this.saveProgress();

    return {
      success: isSuccess,
      passedCount,
      totalCount: updatedCriteria.length,
      messages,
      consoleLogs: logs,
      executionError
    };
  }

  private transpileTsToJs(tsCode: string): string {
    if (this.tsCompiler) {
      const out: string = this.tsCompiler.transpileModule(tsCode, {
        compilerOptions: {
          target: this.tsCompiler.ScriptTarget.ES2022,
          module: this.tsCompiler.ModuleKind.ESNext,
          useDefineForClassFields: false,
          experimentalDecorators: true
        }
      }).outputText;
      return out
        .replace(/^\s*export\s*\{\s*\};?\s*$/gm, '')
        .replace(/^(\s*)export\s+default\s+/gm, '$1')
        .replace(/^(\s*)export\s+/gm, '$1');
    }
    return this.transpileTsToJsLegacy(tsCode);
  }

  /** Repli léger (regex) utilisé uniquement tant que le compilateur TypeScript n'est pas chargé. */
  private transpileTsToJsLegacy(tsCode: string): string {
    let js = tsCode;

    // 0. Supprimer les interfaces TS et types
    js = js.replace(/interface\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');
    js = js.replace(/type\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?\s*=\s*(?:\{[\s\S]*?\}|[^;]+);/g, '');
    js = js.replace(/:\s*\([^)]*\)\s*=>\s*(?:void|number|string|boolean|any|unknown|[A-Z][A-Za-z0-9_]*)(?=[,;)\n}]|$)/g, '');
    js = js.replace(/:\s*\{[^{}]*\}/g, '');

    // 1. Assigner automatiquement les parameter properties dans les constructeurs
    const ctorRegex = /constructor\s*\(/g;
    let match: RegExpExecArray | null;
    let newJs = '';
    let lastIndex = 0;

    while ((match = ctorRegex.exec(js)) !== null) {
      newJs += js.substring(lastIndex, match.index);
      const startOfParams = ctorRegex.lastIndex;
      let pDepth = 1;
      let p = startOfParams;
      while (p < js.length && pDepth > 0) {
        if (js[p] === '(') pDepth++;
        else if (js[p] === ')') pDepth--;
        p++;
      }
      const rawParams = js.substring(startOfParams, p - 1);
      while (p < js.length && js[p] !== '{') p++;
      p++;
      const startOfBody = p;
      let bDepth = 1;
      let inString: string | null = null;
      let escaped = false;

      while (p < js.length && bDepth > 0) {
        const char = js[p];
        if (inString) {
          if (escaped) escaped = false;
          else if (char === '\\') escaped = true;
          else if (char === inString) inString = null;
        } else {
          if (char === '"' || char === "'" || char === '`') inString = char;
          else if (char === '{') bDepth++;
          else if (char === '}') bDepth--;
        }
        p++;
      }

      const body = js.substring(startOfBody, p - 1);
      lastIndex = p;
      ctorRegex.lastIndex = p;

      const assignments: string[] = [];
      const cleanedParams = rawParams.split(',').map(param => {
        let trimmed = param.trim();
        if (!trimmed) return '';
        const propMatch = trimmed.match(/^(?:(?:public|private|protected|readonly)\s+)+([A-Za-z0-9_]+)/);
        if (propMatch) {
          assignments.push(`this.${propMatch[1]} = ${propMatch[1]};`);
        }
        trimmed = trimmed.replace(/^(?:(?:public|private|protected|readonly)\s+)+/, '');
        trimmed = trimmed.replace(/\?/, '');
        const eqIdx = trimmed.indexOf('=');
        let defVal = '';
        if (eqIdx !== -1) {
          defVal = ' = ' + trimmed.slice(eqIdx + 1).trim();
          trimmed = trimmed.slice(0, eqIdx).trim();
        }
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx !== -1) {
          trimmed = trimmed.slice(0, colonIdx).trim();
        }
        return trimmed + defVal;
      }).join(', ');

      let newBody = body;
      if (assignments.length > 0) {
        const assignStr = assignments.join('\n    ');
        const superIdx = body.indexOf('super(');
        if (superIdx !== -1) {
          let parenDepth = 1;
          let sp = superIdx + 6;
          while (sp < body.length && parenDepth > 0) {
            if (body[sp] === '(') parenDepth++;
            else if (body[sp] === ')') parenDepth--;
            sp++;
          }
          while (sp < body.length && (body[sp] === ';' || body[sp] === ' ' || body[sp] === '\t' || body[sp] === '\n')) {
            sp++;
          }
          const superCallAndSemi = body.slice(0, sp);
          const afterSuper = body.slice(sp);
          newBody = `${superCallAndSemi}\n    ${assignStr}\n${afterSuper}`;
        } else {
          newBody = `\n    ${assignStr}\n${body}`;
        }
      }

      newJs += `constructor(${cleanedParams}) {${newBody}}`;
    }

    newJs += js.substring(lastIndex);
    js = newJs;

    // 2. Supprimer les exports et imports
    js = js.replace(/export\s+/g, '');
    js = js.replace(/import\s+[^;]+;/g, '');

    // 3. Supprimer les interfaces et types
    js = js.replace(/interface\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');
    js = js.replace(/type\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?\s*=\s*(?:\{[\s\S]*?\}|[^;]+);/g, '');

    // 4. Supprimer implements
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, '');

    // 5. Supprimer abstract class -> class
    js = js.replace(/\babstract\s+class\b/g, 'class');

    // 6. Supprimer modificateurs
    js = js.replace(/\b(public|private|protected|readonly|override)\s+/g, '');

    // 7. Supprimer les génériques
    js = js.replace(/<[^>]+>/g, '');

    // 8. Supprimer les 'as Type'
    js = js.replace(/\s+as\s+[A-Za-z0-9_<>|[\] ]+/g, '');

    // 9. Supprimer typages de variables
    js = js.replace(/(\b(?:let|const|var)\s+[A-Za-z0-9_]+)\s*:\s*[A-Za-z0-9_<>[\]| ]+\s*=/g, '$1 =');

    // 10. Propriétés de classe
    js = js.replace(/^\s*(?:static\s+)?([A-Za-z0-9_$]+)\s*:\s*(?![^=;\n]*=>)[^=;\n]+=\s*/gm, '  $1 = ');
    js = js.replace(/^\s*(?:static\s+)?([A-Za-z0-9_$]+)\s*:\s*[^;\n]+;/gm, '  $1;');

    // 11. Nettoyer les paramètres de fonctions
    const cleanParams = (params: string) => {
      return params.split(',').map(p => {
        let s = p.trim();
        if (!s) return '';
        const eqIdx = s.indexOf('=');
        let defVal = '';
        if (eqIdx !== -1) {
          defVal = ' = ' + s.slice(eqIdx + 1).trim();
          s = s.slice(0, eqIdx).trim();
        }
        s = s.replace(/^(?:(?:public|private|protected|readonly)\s+)+/, '');
        s = s.replace(/\?/, '');
        const colonIdx = s.indexOf(':');
        if (colonIdx !== -1) {
          s = s.slice(0, colonIdx).trim();
        }
        return s + defVal;
      }).join(', ');
    };

    js = js.replace(/\b(function(?:\s+[A-Za-z0-9_]+)?|[A-Za-z0-9_]+)\s*\(([^)]*)\)\s*(?::\s*[A-Za-z0-9_<>[\]| ]+)?\s*\{/g, (match, prefix, params) => {
      const trimmedPrefix = prefix.trim();
      if (['if', 'while', 'for', 'switch', 'catch'].includes(trimmedPrefix)) {
        return match;
      }
      return `${prefix}(${cleanParams(params)}) {`;
    });

    // 12. Fonctions fléchées
    js = js.replace(/\(([^)]*)\)\s*(?::\s*[A-Za-z0-9_<>[\]| ]+)?\s*=>/g, (match, params) => {
      return `(${cleanParams(params)}) =>`;
    });

    return js;
  }

  private saveCodes(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const codes: Record<string, string> = {};
      this.exercises().forEach(e => {
        if (e.currentCode !== e.initialCode) {
          codes[e.id] = e.currentCode;
        }
      });
      localStorage.setItem(this.CODES_STORAGE_KEY, JSON.stringify(codes));
    } catch (e) {}
  }

  private saveProgress(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const progress: Record<string, boolean> = {};
      this.exercises().forEach(e => {
        if (e.isCompleted) progress[e.id] = true;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }
}
