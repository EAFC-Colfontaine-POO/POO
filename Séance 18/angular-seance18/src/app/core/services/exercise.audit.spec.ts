import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

/**
 * Audit automatique des exercices (Séance 18 · Stockage Local) :
 *  - le code de départ ne doit JAMAIS valider l'exercice ;
 *  - le code de départ dont les commentaires « de code » sont décommentés ne doit pas valider non plus ;
 *  - la solution officielle doit toujours valider (19/19 exercices) ;
 *  - « Réinitialiser » doit restituer exactement le code de départ et remettre isCompleted à false.
 */
function uncomment(code: string): string {
  return code
    .split('\n')
    .map(line => {
      const m = line.match(/^(\s*)\/\/ ?(.*)$/);
      if (!m) return line;
      const body = m[2];
      const looksLikeCode =
        !/^(TODO|Note|NB|❌|✅|💥|Etape|Étape)/i.test(body) &&
        /(=>|[=;{}]|\)\s*$|^\s*(return|const|let|class|this\.|\w+\.\w+\())/.test(body) &&
        !/\.\.\.\s*$/.test(body);
      return looksLikeCode ? `${m[1]}${body}` : line;
    })
    .join('\n');
}

describe('Audit complet des 19 exercices (Séance 18)', () => {
  let service: ExerciseService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.clear();
      } catch {}
    }
    service = new ExerciseService(new TypescriptTranspilerService());
  });

  it('initialCode ne valide pas / solution valide à 100% / reset fidèle', () => {
    const problems: string[] = [];
    const all = service.exercises();
    const startCodes = new Map(all.map(e => [e.id, e.initialCode]));

    for (const ex of all) {
      if (ex.currentCode !== ex.initialCode) {
        problems.push(`${ex.number ?? ex.id}: currentCode de départ ≠ initialCode`);
      }
    }

    for (const ex of all) {
      const id = ex.id;
      const tag = `${ex.number ?? id}`;

      // 1. initialCode ne doit PAS valider
      service.updateCode(id, ex.initialCode);
      const resInitial = service.validateExercise(id, ex.initialCode);
      if (resInitial.success) {
        problems.push(`${tag}: valide avec le code de départ initial`);
      }

      // 2. Décommenter le code initial ne doit pas valider
      const unc = uncomment(ex.initialCode);
      if (unc !== ex.initialCode) {
        service.updateCode(id, unc);
        const resUnc = service.validateExercise(id, unc);
        if (resUnc.success) {
          problems.push(`${tag}: valide en décommentant le départ`);
        }
      }

      // 3. La solution officielle DOIT valider
      service.updateCode(id, ex.solutionCode);
      const resSol = service.validateExercise(id, ex.solutionCode);
      if (!resSol.success) {
        const failed = (service.exercises().find(e => e.id === id)?.criteria ?? [])
          .filter(c => !c.passed)
          .map(c => c.id);
        problems.push(
          `${tag}: la solution NE valide PAS (critères KO: ${failed.join(',')}) err=${resSol.error ?? ''} logs=${(resSol.logs ?? []).map(l => l.text).join(' ; ').slice(0, 200)}`
        );
      }

      // 4. Reset fidèle
      service.resetCode(id);
      const after = service.exercises().find(e => e.id === id)!;
      if (after.currentCode !== startCodes.get(id)) {
        problems.push(`${tag}: reset ≠ code de départ`);
      }
      if (after.isCompleted) {
        problems.push(`${tag}: reset laisse isCompleted à true`);
      }
    }

    if (problems.length > 0) {
      console.error('Audit Problems:\n' + problems.join('\n'));
    }
    expect(problems).toEqual([]);
  });
});
