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
import { LAB5_EXERCISES } from '../data/lab5.data';
import { LAB6_EXERCISES } from '../data/lab6.data';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'seance7_exercises_progress';
  private readonly confetti = inject(ConfettiService);

  private readonly RAW_EXERCISES: ExerciseDef[] = [
    ...LAB1_EXERCISES,
    ...LAB2_EXERCISES,
    ...LAB3_EXERCISES,
    ...LAB4_EXERCISES,
    ...LAB5_EXERCISES,
    ...LAB6_EXERCISES
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
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) return;
    this.updateCode(id, ex.initialCode);
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

    // 1. Vérification des contraintes syntaxiques
    for (const req of ex.syntaxRequirements) {
      if (req.type === 'forbidden') {
        const regex = typeof req.pattern === 'string' ? new RegExp(req.pattern) : req.pattern;
        if (regex.test(ex.currentCode)) {
          syntaxPassed = false;
          messages.push(`Syntaxe interdite : ${req.errorMessage}`);
          logs.push({
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: `✖ Erreur de syntaxe : ${req.errorMessage}`
          });
        }
      } else {
        const regex = typeof req.pattern === 'string' ? new RegExp(req.pattern) : req.pattern;
        if (!regex.test(ex.currentCode)) {
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

    // 2. Transpilation et Exécution
    try {
      const transpileJs = this.transpileTsToJs(ex.currentCode);

      const mockSignal = (initialVal: any) => {
        let val = initialVal;
        const s: any = () => val;
        s.set = (newVal: any) => { val = newVal; };
        s.update = (fn: (prev: any) => any) => { val = fn(val); };
        return s;
      };

      const mockComputed = (fn: () => any) => {
        return () => fn();
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
          Voiture: typeof Voiture !== 'undefined' ? Voiture : undefined,
          VeloElectrique: typeof VeloElectrique !== 'undefined' ? VeloElectrique : undefined,
          Vehicule: typeof Vehicule !== 'undefined' ? Vehicule : undefined,
          Moto: typeof Moto !== 'undefined' ? Moto : undefined,
          Oiseau: typeof Oiseau !== 'undefined' ? Oiseau : undefined,
          Avion: typeof Avion !== 'undefined' ? Avion : undefined,
          Produit: typeof Produit !== 'undefined' ? Produit : undefined,
          ProduitPhysique: typeof ProduitPhysique !== 'undefined' ? ProduitPhysique : undefined,
          ProduitNumerique: typeof ProduitNumerique !== 'undefined' ? ProduitNumerique : undefined,
          Animal: typeof Animal !== 'undefined' ? Animal : undefined,
          Chien: typeof Chien !== 'undefined' ? Chien : undefined,
          Appareil: typeof Appareil !== 'undefined' ? Appareil : undefined,
          Smartphone: typeof Smartphone !== 'undefined' ? Smartphone : undefined,
          GrandParent: typeof GrandParent !== 'undefined' ? GrandParent : undefined,
          Parent: typeof Parent !== 'undefined' ? Parent : undefined,
          Enfant: typeof Enfant !== 'undefined' ? Enfant : undefined,
          Forme: typeof Forme !== 'undefined' ? Forme : undefined,
          Cercle: typeof Cercle !== 'undefined' ? Cercle : undefined,
          Rectangle: typeof Rectangle !== 'undefined' ? Rectangle : undefined,
          Employe: typeof Employe !== 'undefined' ? Employe : undefined,
          Ouvrier: typeof Ouvrier !== 'undefined' ? Ouvrier : undefined,
          Manager: typeof Manager !== 'undefined' ? Manager : undefined,
          Freelance: typeof Freelance !== 'undefined' ? Freelance : undefined,
          FigureGeometrique: typeof FigureGeometrique !== 'undefined' ? FigureGeometrique : undefined,
          Carre: typeof Carre !== 'undefined' ? Carre : undefined,
          Triangle: typeof Triangle !== 'undefined' ? Triangle : undefined,
          Media: typeof Media !== 'undefined' ? Media : undefined,
          Livre: typeof Livre !== 'undefined' ? Livre : undefined,
          Paiement: typeof Paiement !== 'undefined' ? Paiement : undefined,
          CarteBancaire: typeof CarteBancaire !== 'undefined' ? CarteBancaire : undefined,
          PayPal: typeof PayPal !== 'undefined' ? PayPal : undefined,
          Outil: typeof Outil !== 'undefined' ? Outil : undefined,
          DocumentMetier: typeof DocumentMetier !== 'undefined' ? DocumentMetier : undefined,
          Rapport: typeof Rapport !== 'undefined' ? Rapport : undefined,
          Facture: typeof Facture !== 'undefined' ? Facture : undefined,
          Tache: typeof Tache !== 'undefined' ? Tache : undefined,
          TacheUrgente: typeof TacheUrgente !== 'undefined' ? TacheUrgente : undefined,
          TacheLongue: typeof TacheLongue !== 'undefined' ? TacheLongue : undefined,
          TachesService: typeof TachesService !== 'undefined' ? TachesService : undefined,
          TachesComponent: typeof TachesComponent !== 'undefined' ? TachesComponent : undefined,
          NotificationsService: typeof NotificationsService !== 'undefined' ? NotificationsService : undefined
        };
      `;

      const runnerFn = new Function('console', 'signal', 'computed', executionCode);
      sandboxContext = runnerFn(customConsole, mockSignal, mockComputed);

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
    }
  }

  private transpileTsToJs(tsCode: string): string {
    let js = tsCode;

    // 1. Assigner automatiquement les propriétés de paramètres de constructeur (public/private/protected/readonly x)
    js = js.replace(/constructor\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g, (match, params, body) => {
      const assignments: string[] = [];
      const cleanedParams = params.split(',').map((p: string) => {
        const trimmed = p.trim();
        const propMatch = trimmed.match(/^(?:public|private|protected|readonly)\s+([A-Za-z0-9_]+)/);
        if (propMatch) {
          assignments.push(`this.${propMatch[1]} = ${propMatch[1]};`);
        }
        return trimmed;
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
    js = js.replace(/export\s+/g, '');
    js = js.replace(/import\s+[^;]+;/g, '');

    // 3. Supprimer les interfaces TS (y compris multilignes)
    js = js.replace(/interface\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 4. Supprimer les types TS (y compris multilignes avec accolades)
    js = js.replace(/type\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?\s*=\s*(?:\{[\s\S]*?\}|[^;]+);/g, '');

    // 5. Supprimer implements
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, '');

    // 6. Supprimer les modificateurs de visibilité
    js = js.replace(/\b(public|private|protected|readonly|override)\s+/g, '');

    // 7. Supprimer les génériques Angular signal<T> -> signal
    js = js.replace(/signal\s*<[^>]+>/g, 'signal');
    js = js.replace(/computed\s*<[^>]+>/g, 'computed');

    // 8. Supprimer les assertions as Type
    js = js.replace(/\s+as\s+[A-Za-z0-9_<>|[\] ]+/g, '');

    // 9. Supprimer les typages simples de variables : let/const/var x: Type = val -> let/const/var x = val
    js = js.replace(/(\b(?:let|const|var)\s+[A-Za-z0-9_]+)\s*:\s*[A-Za-z0-9_<>[\]| ]+\s*=/g, '$1 =');

    // 10. Supprimer les types complexes de paramètres : (arg: { ... }) -> (arg)
    js = js.replace(/:\s*\{[\s\S]*?\}\s*(?=[),])/g, '');

    // 11. Nettoyer les signatures de méthodes et fonctions sans altérer les littéraux d'objets ni les conditions
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
        s = s.replace(/^(public|private|protected|readonly)\s+/, '');
        s = s.replace(/\?/, '');
        const colonIdx = s.indexOf(':');
        if (colonIdx !== -1) {
          s = s.slice(0, colonIdx).trim();
        }
        return s + defVal;
      }).join(', ');
    };

    // Fonctions et méthodes régulières (en excluant les structures de contrôle if, for, etc.)
    js = js.replace(/\b(function(?:\s+[A-Za-z0-9_]+)?|[A-Za-z0-9_]+)\s*\(([^)]*)\)\s*(?::\s*[A-Za-z0-9_<>[\]| ]+)?\s*\{/g, (match, prefix, params) => {
      const trimmedPrefix = prefix.trim();
      if (['if', 'while', 'for', 'switch', 'catch'].includes(trimmedPrefix)) {
        return match;
      }
      return `${prefix}(${cleanParams(params)}) {`;
    });

    // Fonctions fléchées : (params): ReturnType => ou (params) =>
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
