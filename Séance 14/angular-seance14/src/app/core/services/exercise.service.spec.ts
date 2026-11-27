import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

describe('ExerciseService & Solution Validation Suite (Séance 14)', () => {
  let service: ExerciseService;
  let transpiler: TypescriptTranspilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseService, TypescriptTranspilerService]
    });
    service = TestBed.inject(ExerciseService);
    transpiler = TestBed.inject(TypescriptTranspilerService);
  });

  it('should have exactly 20 exercises across 6 labs', () => {
    const list = service.exercises();
    expect(list.length).toBe(20);

    const lab1 = list.filter(e => e.labNumber === 1);
    const lab2 = list.filter(e => e.labNumber === 2);
    const lab3 = list.filter(e => e.labNumber === 3);
    const lab4 = list.filter(e => e.labNumber === 4);
    const lab5 = list.filter(e => e.labNumber === 5);
    const lab6 = list.filter(e => e.labNumber === 6);

    expect(lab1.length).toBe(3);
    expect(lab2.length).toBe(3);
    expect(lab3.length).toBe(3);
    expect(lab4.length).toBe(4);
    expect(lab5.length).toBe(3);
    expect(lab6.length).toBe(4);
  });

  it('should filter exercises correctly by lab number', () => {
    service.setLabFilter(null);
    expect(service.filteredExercises().length).toBe(20);

    service.setLabFilter(1);
    expect(service.filteredExercises().length).toBe(3);
    expect(service.filteredExercises().every(e => e.labNumber === 1)).toBe(true);

    service.setLabFilter(4);
    expect(service.filteredExercises().length).toBe(4);
    expect(service.filteredExercises().every(e => e.labNumber === 4)).toBe(true);

    service.setLabFilter(6);
    expect(service.filteredExercises().length).toBe(4);
    expect(service.filteredExercises().every(e => e.labNumber === 6)).toBe(true);
  });

  it('should not validate initial currentCode immediately for any exercise', () => {
    const list = service.exercises();

    for (const ex of list) {
      const result = service.validateExercise(ex.id, ex.currentCode);
      expect(result.success, `Initial code for ${ex.id} should NOT be fully validated immediately`).toBe(false);
    }
  });

  it('should validate 100% of solutions for all 20 exercises', () => {
    const list = service.exercises();

    for (const ex of list) {
      const result = service.validateExercise(ex.id, ex.solutionCode);
      if (!result.success) {
        const exData = service.exercises().find(e => e.id === ex.id);
        console.error(`Validation failed for ${ex.id} (${ex.number} - ${ex.title}):`, {
          error: result.error,
          logs: result.logs,
          criteria: exData?.criteria
        });
      }
      expect(result.success, `Solution for ${ex.id} (${ex.number} - ${ex.title}) should pass validation`).toBe(true);

      const updated = service.exercises().find(e => e.id === ex.id);
      expect(updated).toBeDefined();
      const allPassed = updated!.criteria.every(c => c.passed);
      expect(allPassed, `All criteria of ${ex.id} must be marked as passed`).toBe(true);
    }
  });

  it('should transpile generics and signal-first services cleanly', () => {
    const ts = `
      interface Identifiable { readonly id: number | string; }
      class Repository<T extends Identifiable> {
        readonly #items = signal<T[]>([]);
        readonly items = this.#items.asReadonly();
        ajouter(e: T): void { this.#items.update(l => [...l, e]); }
      }
      const repo = new Repository<{ id: number; nom: string }>();
      repo.ajouter({ id: 1, nom: "Test" });
      console.log("Nom:", repo.items()[0].nom);
    `;

    const res = transpiler.executeCode(ts);
    expect(res.success).toBe(true);
    expect(res.logs.some(l => l.text.includes('Test'))).toBe(true);
  });
});
