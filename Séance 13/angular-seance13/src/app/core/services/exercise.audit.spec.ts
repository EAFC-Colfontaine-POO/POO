import { TestBed } from '@angular/core/testing';
import { ExerciseService } from './exercise.service';

/**
 * Audit automatique des exercices :
 *  - le code de départ ne doit JAMAIS valider l'exercice ;
 *  - le code de départ dont les commentaires sont décommentés ne doit pas valider non plus
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
  let service: ExerciseService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseService);
  });

  it('initialCode ne valide pas / solution valide / reset fidèle', () => {
    const problems: string[] = [];
    const startCodes = new Map(service.exercises().map(e => [e.id, e.initialCode]));

    for (const ex of service.exercises()) {
      const id = ex.id;

      service.updateCode(id, ex.initialCode);
      if (service.evaluateExercise(id).success) problems.push(`${ex.number}: valide avec le code de départ`);

      service.updateCode(id, uncomment(ex.initialCode));
      if (service.evaluateExercise(id).success) problems.push(`${ex.number}: valide en décommentant le départ`);

      service.updateCode(id, ex.solutionCode);
      const solRes = service.evaluateExercise(id);
      if (!solRes.success) {
        problems.push(`${ex.number}: la solution NE valide PAS -> ${solRes.messages.join(' | ')} || ${solRes.consoleLogs.map(l => l.message).join(' ; ')}`);
      }
      if (solRes.executionError) console.log('DUMP ' + ex.number + '\n' + (service as any).transpileTsToJs(ex.solutionCode));

      service.resetExercise(id);
      const after = service.exercises().find(e => e.id === id)!;
      if (after.currentCode !== startCodes.get(id)) problems.push(`${ex.number}: reset ≠ code de départ`);
      if (after.isCompleted) problems.push(`${ex.number}: reset laisse isCompleted`);
    }

    console.log('PROBLEMS:\n' + problems.join('\n'));
    expect(problems).toEqual([]);
  });
});
