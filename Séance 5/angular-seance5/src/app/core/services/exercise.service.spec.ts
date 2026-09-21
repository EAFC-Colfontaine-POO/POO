import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

describe('ExerciseService & TypescriptTranspilerService', () => {
  let transpiler: TypescriptTranspilerService;
  let service: ExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseService, TypescriptTranspilerService]
    });
    transpiler = TestBed.inject(TypescriptTranspilerService);
    service = TestBed.inject(ExerciseService);
  });

  it('should have exactly 26 exercises across 6 labs', () => {
    expect(service.exercises().length).toBe(26);
    expect(service.getExercisesForLab(1).length).toBe(4);
    expect(service.getExercisesForLab(2).length).toBe(5);
    expect(service.getExercisesForLab(3).length).toBe(4);
    expect(service.getExercisesForLab(4).length).toBe(5);
    expect(service.getExercisesForLab(5).length).toBe(4);
    expect(service.getExercisesForLab(6).length).toBe(4);
  });

  it('should validate all 26 exercises successfully with their solutionCode', () => {
    for (const ex of service.exercises()) {
      const result = service.validateExercise(ex.id, ex.solutionCode);
      if (!result.success) {
        console.error(`Validation failed for exercise ${ex.number} (${ex.id}):`, result.logs, result.error);
      }
      expect(result.success).toBe(true);
    }
  });

  it('should properly transpile Parameter Properties', () => {
    const ts = `
      class User {
        constructor(private _name: string, public age: number) {}
        greet() { console.log(this._name, this.age); }
      }
      const u = new User("Alice", 30);
      u.greet();
    `;
    const res = transpiler.executeCode(ts);
    expect(res.success).toBe(true);
    expect(res.logs.some(l => l.text.includes('Alice') && l.text.includes('30'))).toBe(true);
  });

  it('should properly transpile Enums', () => {
    const ts = `
      enum Status { Draft, Published }
      console.log(Status.Draft, Status.Published);
    `;
    const res = transpiler.executeCode(ts);
    expect(res.success).toBe(true);
    expect(res.logs.some(l => l.text.includes('0') && l.text.includes('1'))).toBe(true);
  });
});
