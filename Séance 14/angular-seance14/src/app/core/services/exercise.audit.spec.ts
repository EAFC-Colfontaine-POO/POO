import { TestBed } from '@angular/core/testing';
import { ExerciseService } from './exercise.service';

/**
 * Audit automatique des exercices :
 *  - le code de départ ne doit JAMAIS valider l'exercice ;
 *  - le code de départ dont les commentaires « de code » sont décommentés ne doit pas valider non plus
 *    (la réponse ne doit pas se cacher dans les commentaires) ;
 *  - la solution officielle doit toujours valider ;
 *  - « Réinitialiser » doit restituer exactement le code de départ.
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

describe('Audit des exercices', () => {
  let service: any;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseService);
  });

  const update = (id: string, code: string) =>
    (service.updateCurrentCode ?? service.updateCode ?? service.updateExerciseCode).call(service, id, code);
  const reset = (id: string) =>
    (service.resetExercise ?? service.resetCurrentExercise).call(service, id);
  const getAll = (): any[] => service.exercises();

  it('initialCode ne valide pas / solution valide / reset fidèle', () => {
    const problems: string[] = [];
    const info: string[] = [];
    const startCodes = new Map(getAll().map(e => [e.id, e.initialCode]));
    for (const ex of getAll()) {
      if (ex.currentCode !== ex.initialCode) problems.push(`${ex.number ?? ex.id}: currentCode de départ ≠ initialCode (le code affiché au départ diffère du code après Réinitialiser)`);
    }

    for (const ex of getAll()) {
      const id = ex.id;
      const tag = `${ex.number ?? id}`;

      update(id, ex.initialCode);
      if (service.validateExercise(id, ex.initialCode).success) problems.push(`${tag}: valide avec le code de départ`);
      const passedAtStart = (getAll().find(e => e.id === id)?.criteria ?? []).filter((c: any) => c.passed).map((c: any) => c.id);
      if (passedAtStart.length) info.push(`${tag}: critères déjà verts au départ -> ${passedAtStart.join(', ')}`);

      const unc = uncomment(ex.initialCode);
      if (unc !== ex.initialCode) {
        update(id, unc);
        if (service.validateExercise(id, unc).success) problems.push(`${tag}: valide en décommentant le départ`);
      }

      update(id, ex.solutionCode);
      const res = service.validateExercise(id, ex.solutionCode);
      if (!res.success) {
        const failed = (getAll().find(e => e.id === id)?.criteria ?? []).filter((c: any) => !c.passed).map((c: any) => c.id);
        problems.push(`${tag}: la solution NE valide PAS (critères KO: ${failed.join(',')}) err=${res.error ?? ''} logs=${(res.logs ?? []).map((l: any) => l.text ?? l.message).join(' ; ').slice(0, 200)}`);
      }

      reset(id);
      const after = getAll().find(e => e.id === id)!;
      if (after.currentCode !== startCodes.get(id)) problems.push(`${tag}: reset ≠ code de départ`);
      if (after.isCompleted) problems.push(`${tag}: reset laisse isCompleted`);
    }

    console.log('INFO:\n' + info.join('\n'));
    console.log('PROBLEMS:\n' + problems.join('\n'));
    expect(problems).toEqual([]);
  });
});
