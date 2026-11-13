import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

describe('ExerciseService (Séance 18 · Stockage Local)', () => {
  let service: ExerciseService;

  beforeEach(() => {
    // Clear storage to avoid test leakage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.clear();
      } catch {}
    }
    const transpiler = new TypescriptTranspilerService();
    service = new ExerciseService(transpiler);
  });

  it('devrait charger les 19 exercices répartis sur 5 labos', () => {
    const list = service.exercises();
    expect(list.length).toBe(19);

    const lab1 = list.filter(e => e.labNumber === 1);
    const lab2 = list.filter(e => e.labNumber === 2);
    const lab3 = list.filter(e => e.labNumber === 3);
    const lab4 = list.filter(e => e.labNumber === 4);
    const lab5 = list.filter(e => e.labNumber === 5);

    expect(lab1.length).toBe(4);
    expect(lab2.length).toBe(4);
    expect(lab3.length).toBe(4);
    expect(lab4.length).toBe(4);
    expect(lab5.length).toBe(3);
  });

  it('devrait valider avec succès TOUTES les solutions officielles des 19 exercices', () => {
    const list = service.exercises();

    for (const ex of list) {
      const result = service.validateExercise(ex.id, ex.solutionCode);

      if (!result.success) {
        console.error(`Échec de validation sur l'exercice ${ex.number} (${ex.id}) :`, {
          error: result.error,
          logs: result.logs.map(l => l.text),
          criteria: result.criteria
        });
      }

      expect(result.success, `L'exercice ${ex.number} (${ex.id}) doit être validé avec sa solution`).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.criteria?.every((c: any) => c.passed)).toBe(true);
    }
  });

  it('devrait échouer ou rester non validé sur le code initial non complété', () => {
    const ex1 = service.exercises()[0];
    const res = service.validateExercise(ex1.id, ex1.initialCode);
    expect(res.success).toBe(false);
  });
});
