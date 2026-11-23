import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  Exercise, 
  ExerciseDef, 
  ValidationSummary, 
  ConsoleLogEntry 
} from '../models/app.models';
import { ConfettiService } from './confetti.service';
import { createReactiveRuntime } from './reactive-runtime';
import { LAB1_EXERCISES } from '../data/lab1.data';
import { LAB2_EXERCISES } from '../data/lab2.data';
import { LAB3_EXERCISES } from '../data/lab3.data';
import { LAB4_EXERCISES } from '../data/lab4.data';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'seance13_exercises_progress';
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

  constructor() {
    this.initExercises();
  }

  private initExercises(): void {
    let savedProgress: Record<string, boolean> = {};
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) savedProgress = JSON.parse(raw);
      } catch (e) {}
    }

    const list: Exercise[] = this.RAW_EXERCISES.map(def => ({
      ...def,
      currentCode: def.initialCode,
      isCompleted: !!savedProgress[def.id],
      criteria: def.criteria.map(c => ({
        ...c,
        passed: !!savedProgress[def.id]
      }))
    }));

    this.exercises.set(list);
  }

  selectExercise(id: string): void {
    this.selectedExerciseId.set(id);
  }

  updateCode(id: string, code: string): void {
    this.exercises.update(list => 
      list.map(e => e.id === id ? { ...e, currentCode: code } : e)
    );
  }

  injectSolution(id: string): void {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) return;
    this.updateCode(id, ex.solutionCode);
  }

  resetExercise(id: string): void {
    const rawDef = this.RAW_EXERCISES.find(e => e.id === id);
    if (!rawDef) return;

    this.exercises.update(list => 
      list.map(e => e.id === id ? { 
        ...e, 
        currentCode: rawDef.initialCode,
        isCompleted: false,
        criteria: rawDef.criteria.map(c => ({ ...c, passed: false }))
      } : e)
    );

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
          const progress = JSON.parse(raw);
          delete progress[id];
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        }
      } catch (e) {}
    }
  }

  resetAllProgress(): void {
    this.exercises.update(list => 
      list.map(e => {
        const rawDef = this.RAW_EXERCISES.find(r => r.id === e.id);
        return {
          ...e,
          currentCode: rawDef ? rawDef.initialCode : e.initialCode,
          isCompleted: false,
          criteria: e.criteria.map(c => ({ ...c, passed: false }))
        };
      })
    );
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
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
    let cleanupTimers: () => void = () => {};

    // Nettoyage des commentaires pour les vérifications syntaxiques
    const codeWithoutComments = ex.currentCode
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '');

    // 1. Contraintes syntaxiques
    for (const req of ex.syntaxRequirements) {
      const regex = typeof req.pattern === 'string' ? new RegExp(req.pattern) : req.pattern;
      if (req.type === 'forbidden') {
        if (regex.test(codeWithoutComments)) {
          syntaxPassed = false;
          messages.push(`Syntaxe interdite : ${req.errorMessage}`);
          logs.push({
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: `✖ Erreur de syntaxe : ${req.errorMessage}`
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

    // 2. Transpilation et Exécution dans le Bac à Sable
    try {
      const transpileJs = this.transpileTsToJs(ex.currentCode);

      // Runtime réactif fidèle (dépendances, mémoïsation, ré-exécution des effets, onCleanup)
      const runtime = createReactiveRuntime(msg => rawLogs.push(msg));
      const mockSignal: any = runtime.signal;
      const mockComputed = runtime.computed;
      const mockEffect = runtime.effect;

      // Les timers créés par le code de l'élève sont tracés puis libérés après l'évaluation
      const timerIds: any[] = [];
      const sandboxSetInterval = (fn: any, ms?: number, ...args: any[]) => {
        const t = setInterval(fn, ms, ...args);
        timerIds.push(t);
        return t;
      };
      const sandboxSetTimeout = (fn: any, ms?: number, ...args: any[]) => {
        const t = setTimeout(fn, ms, ...args);
        timerIds.push(t);
        return t;
      };
      cleanupTimers = () => timerIds.forEach(t => { clearInterval(t); clearTimeout(t); });

      const mockInput: any = (defaultVal?: any, opts?: any) => {
        let currentVal = defaultVal;
        if (opts?.transform && typeof opts.transform === 'function') {
          currentVal = opts.transform(defaultVal);
        }
        const inp: any = () => currentVal;
        return inp;
      };

      mockInput.required = (simulatedVal?: any) => {
        let currentVal: any = simulatedVal;
        const inp: any = () => currentVal;
        return inp;
      };

      const mockOutput = () => {
        return {
          emit: (val: any) => {
            rawLogs.push(`[Output emit] ${JSON.stringify(val)}`);
          }
        };
      };

      const mockModel = (initialVal: any) => {
        return mockSignal(initialVal);
      };

      const mockBooleanAttribute = (value: any): boolean => {
        return typeof value === 'boolean' ? value : value != null && `${value}` !== 'false';
      };

      const mockNumberAttribute = (value: any, fallbackValue: number = 0): number => {
        const num = parseFloat(value);
        return isNaN(num) ? fallbackValue : num;
      };

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
          tentatives: typeof tentatives !== 'undefined' ? tentatives : undefined,
          valeurLue: typeof valeurLue !== 'undefined' ? valeurLue : undefined,
          score: typeof score !== 'undefined' ? score : undefined,
          panier: typeof panier !== 'undefined' ? panier : undefined,
          prixHT: typeof prixHT !== 'undefined' ? prixHT : undefined,
          tauxTVA: typeof tauxTVA !== 'undefined' ? tauxTVA : undefined,
          prixTTC: typeof prixTTC !== 'undefined' ? prixTTC : undefined,
          modeAvance: typeof modeAvance !== 'undefined' ? modeAvance : undefined,
          primeStandard: typeof primeStandard !== 'undefined' ? primeStandard : undefined,
          primeAvancee: typeof primeAvancee !== 'undefined' ? primeAvancee : undefined,
          primeAccordee: typeof primeAccordee !== 'undefined' ? primeAccordee : undefined,
          fakeStorage: typeof fakeStorage !== 'undefined' ? fakeStorage : undefined,
          pseudo: typeof pseudo !== 'undefined' ? pseudo : undefined,
          quantite: typeof quantite !== 'undefined' ? quantite : undefined,
          prixUnitaire: typeof prixUnitaire !== 'undefined' ? prixUnitaire : undefined,
          totalPropre: typeof totalPropre !== 'undefined' ? totalPropre : undefined,
          intervalleMs: typeof intervalleMs !== 'undefined' ? intervalleMs : undefined,
          MoniteurComponent: typeof MoniteurComponent !== 'undefined' ? MoniteurComponent : undefined,
          moniteur: typeof moniteur !== 'undefined' ? moniteur : undefined,
          ProfilCarteComponent: typeof ProfilCarteComponent !== 'undefined' ? ProfilCarteComponent : undefined,
          carte: typeof carte !== 'undefined' ? carte : undefined,
          ToggleButtonComponent: typeof ToggleButtonComponent !== 'undefined' ? ToggleButtonComponent : undefined,
          btn: typeof btn !== 'undefined' ? btn : undefined,
          SupprimerBoutonComponent: typeof SupprimerBoutonComponent !== 'undefined' ? SupprimerBoutonComponent : undefined,
          InterrupteurComponent: typeof InterrupteurComponent !== 'undefined' ? InterrupteurComponent : undefined,
          interrupteur: typeof interrupteur !== 'undefined' ? interrupteur : undefined,
          templateParent: typeof templateParent !== 'undefined' ? templateParent : undefined,
          CompteurSecuriseComponent: typeof CompteurSecuriseComponent !== 'undefined' ? CompteurSecuriseComponent : undefined,
          c: typeof c !== 'undefined' ? c : undefined,
          CompteBancaireComponent: typeof CompteBancaireComponent !== 'undefined' ? CompteBancaireComponent : undefined,
          compte: typeof compte !== 'undefined' ? compte : undefined,
          utilisateur: typeof utilisateur !== 'undefined' ? utilisateur : undefined,
          changerVille: typeof changerVille !== 'undefined' ? changerVille : undefined,
          montantTotal: typeof montantTotal !== 'undefined' ? montantTotal : undefined,
          prixLigne: typeof prixLigne !== 'undefined' ? prixLigne : undefined
        };
      `;

      const runnerFn = new Function(
        'console', 
        'signal', 
        'computed', 
        'effect', 
        'input', 
        'output', 
        'model', 
        'booleanAttribute', 
        'numberAttribute', 
        'setInterval', 
        'setTimeout', 
        executionCode
      );

      sandboxContext = runnerFn(
        customConsole, 
        mockSignal, 
        mockComputed, 
        mockEffect, 
        mockInput, 
        mockOutput, 
        mockModel, 
        mockBooleanAttribute, 
        mockNumberAttribute,
        sandboxSetInterval,
        sandboxSetTimeout
      );

      // Évaluation des critères
      const evalResults = ex.evaluateFn(sandboxContext, rawLogs);

      const updatedCriteria = ex.criteria.map(c => {
        const found = evalResults.find(r => r.criterionId === c.id);
        const passed = syntaxPassed && !!found?.passed;
        if (found && !found.passed && found.message) {
          messages.push(found.message);
        }
        return { ...c, passed };
      });

      const allPassed = syntaxPassed && updatedCriteria.every(c => c.passed);

      this.exercises.update(list => 
        list.map(e => e.id === id ? { 
          ...e, 
          criteria: updatedCriteria,
          isCompleted: allPassed
        } : e)
      );

      if (allPassed) {
        this.saveProgress();
        this.confetti.triggerSuccess();
        logs.push({
          type: 'success',
          timestamp: new Date().toLocaleTimeString(),
          message: `✔ Tous les critères de l'exercice ${ex.number} sont validés avec succès !`
        });
      }

      return {
        success: allPassed,
        passedCount: updatedCriteria.filter(c => c.passed).length,
        totalCount: updatedCriteria.length,
        messages,
        consoleLogs: logs
      };

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
    } finally {
      cleanupTimers();
    }
  }

  private transpileTsToJs(tsCode: string): string {
    let js = tsCode;

    // 1. Assigner automatiquement les propriétés de constructeur (public/private/protected/readonly x)
    js = js.replace(/constructor\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g, (match, params, body) => {
      const assignments: string[] = [];
      const cleanedParams = params.split(',').map((p: string) => {
        const trimmed = p.trim();
        const propMatch = trimmed.match(/^(?:(?:public|private|protected|readonly)\s+)+([A-Za-z0-9_]+)/);
        if (propMatch) {
          assignments.push(`this.${propMatch[1]} = ${propMatch[1]};`);
        }
        return trimmed.replace(/^(?:(?:public|private|protected|readonly)\s+)+/, '');
      }).join(', ');

      if (assignments.length === 0) return match;

      const assignStr = assignments.join('\n    ');
      const superMatch = body.match(/super\s*\([^)]*\)\s*;/);
      if (superMatch) {
        const superCall = superMatch[0];
        const afterSuper = body.slice(body.indexOf(superCall) + superCall.length);
        const beforeSuper = body.slice(0, body.indexOf(superCall) + superCall.length);
        return `constructor(${cleanedParams}) {${beforeSuper}\n    ${assignStr}${afterSuper}}`;
      } else {
        return `constructor(${cleanedParams}) {\n    ${assignStr}\n${body}}`;
      }
    });

    // 2. Supprimer les imports et exports
    js = js.replace(/catch\s*\(\s*([A-Za-z0-9_]+)\s*:\s*[A-Za-z0-9_<>[\]| ]+\)/g, 'catch ($1)');
    js = js.replace(/export\s+/g, '');
    js = js.replace(/import\s+[^;]+;/g, '');

    // 3. Supprimer les interfaces TS
    js = js.replace(/interface\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 4. Supprimer les types TS
    js = js.replace(/type\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?\s*=\s*(?:\{[\s\S]*?\}|[^;]+);/g, '');

    // 5. Supprimer implements
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, '');

    // 6. Supprimer les modificateurs de visibilité
    js = js.replace(/\b(public|private|protected|readonly|override)\s+/g, '');

    // 7. Supprimer les génériques TypeScript : signal<T>, computed<T>, model<T>, output<T>, input<T>, input.required<T>
    js = js.replace(/signal\s*<[^>]+>/g, 'signal');
    js = js.replace(/computed\s*<[^>]+>/g, 'computed');
    js = js.replace(/model\s*<[^>]+>/g, 'model');
    js = js.replace(/output\s*<[^>]+>/g, 'output');
    js = js.replace(/input\.required\s*<[^>]+>/g, 'input.required');
    js = js.replace(/input\s*<[^>]+>/g, 'input');

    // 8. Supprimer les assertions as Type
    js = js.replace(/\s+as\s+[A-Za-z0-9_<>|[\] ]+/g, '');

    // 9. Supprimer les typages simples de variables : let/const/var x: Type = val -> let/const/var x = val
    js = js.replace(/(\b(?:let|const|var)\s+[A-Za-z0-9_]+)\s*:\s*[A-Za-z0-9_<>[\]| ]+\s*=/g, '$1 =');

    // 10. Supprimer les types de paramètres d'objets : (arg: { ... })
    js = js.replace(/:\s*\{[\s\S]*?\}\s*(?=[),])/g, '');

    // 11. Nettoyer les signatures de méthodes et fonctions
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

    js = js.replace(/\(([^)]*)\)\s*(?::\s*[A-Za-z0-9_<>[\]| ]+)?\s*=>/g, (match, params) => {
      return `(${cleanParams(params)}) =>`;
    });

    return js;
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
