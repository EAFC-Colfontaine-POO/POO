import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

describe('ExerciseService & Solution Validation Suite (Séance 17)', () => {
  let service: ExerciseService;
  let transpiler: TypescriptTranspilerService;

  beforeEach(() => {
    transpiler = new TypescriptTranspilerService();
    service = new ExerciseService(transpiler);
  });

  it('should have exactly 24 exercises across 6 labs', () => {
    const list = service.exercises();
    expect(list.length).toBe(24);

    const lab1 = list.filter(e => e.labNumber === 1);
    const lab2 = list.filter(e => e.labNumber === 2);
    const lab3 = list.filter(e => e.labNumber === 3);
    const lab4 = list.filter(e => e.labNumber === 4);
    const lab5 = list.filter(e => e.labNumber === 5);
    const lab6 = list.filter(e => e.labNumber === 6);

    expect(lab1.length).toBe(4);
    expect(lab2.length).toBe(3);
    expect(lab3.length).toBe(4);
    expect(lab4.length).toBe(4);
    expect(lab5.length).toBe(4);
    expect(lab6.length).toBe(5);
  });

  it('should validate 100% of solutions for all 24 exercises', () => {
    const list = service.exercises();

    for (const ex of list) {
      const result = service.validateExercise(ex.id, ex.solutionCode);
      if (!result.success) {
        console.error(`Validation failed for ${ex.id} (${ex.number} - ${ex.title}):`, {
          error: result.error,
          logs: result.logs,
          transpiled: transpiler.transpileToJs(ex.solutionCode)
        });
      }
      expect(result.success, `Solution for ${ex.id} should validate all criteria`).toBe(true);

      const updated = service.exercises().find(e => e.id === ex.id);
      expect(updated).toBeDefined();
      const allPassed = updated!.criteria.every(c => c.passed);
      expect(allPassed, `All criteria of ${ex.id} must be marked as passed`).toBe(true);
    }
  });
});
