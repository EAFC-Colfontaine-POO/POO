import { TestBed } from '@angular/core/testing';
import { WorkshopService } from './workshop.service';

describe('WorkshopService', () => {
  let service: WorkshopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(WorkshopService);
  });

  it('should be created and have 4 exercises', () => {
    expect(service).toBeTruthy();
    expect(service.exercises().length).toBe(4);
    expect(service.totalCount()).toBe(4);
    expect(service.completedCount()).toBe(0);
    expect(service.progressPercentage()).toBe(0);
  });

  it('should have exercises 3.1, 3.2, 3.3, 3.4', () => {
    const numbers = service.exercises().map(e => e.number);
    expect(numbers).toEqual(['3.1', '3.2', '3.3', '3.4']);
  });

  it('should validate exercise 3.1 after injecting solution', () => {
    service.injectSolution('ws-3-1');
    const ex = service.exercises().find(e => e.id === 'ws-3-1');
    expect(ex).toBeDefined();
    expect(ex!.isCompleted).toBe(true);
    expect(ex!.criteria.every(c => c.passed)).toBe(true);
    expect(service.completedCount()).toBe(1);
    expect(service.progressPercentage()).toBe(25);
  });

  it('should validate exercise 3.2 after injecting solution', () => {
    service.injectSolution('ws-3-2');
    const ex = service.exercises().find(e => e.id === 'ws-3-2');
    expect(ex).toBeDefined();
    expect(ex!.isCompleted).toBe(true);
    expect(ex!.criteria.every(c => c.passed)).toBe(true);
  });

  it('should validate exercise 3.3 after injecting solution', () => {
    service.injectSolution('ws-3-3');
    const ex = service.exercises().find(e => e.id === 'ws-3-3');
    expect(ex).toBeDefined();
    expect(ex!.isCompleted).toBe(true);
    expect(ex!.criteria.every(c => c.passed)).toBe(true);
  });

  it('should validate exercise 3.4 after injecting solution', () => {
    service.injectSolution('ws-3-4');
    const ex = service.exercises().find(e => e.id === 'ws-3-4');
    expect(ex).toBeDefined();
    expect(ex!.isCompleted).toBe(true);
    expect(ex!.criteria.every(c => c.passed)).toBe(true);
  });

  it('should reach 100% completion when all 4 workshops are solved', () => {
    service.injectSolution('ws-3-1');
    service.injectSolution('ws-3-2');
    service.injectSolution('ws-3-3');
    service.injectSolution('ws-3-4');

    expect(service.completedCount()).toBe(4);
    expect(service.progressPercentage()).toBe(100);
  });

  it('should reset an exercise properly', () => {
    service.injectSolution('ws-3-1');
    expect(service.completedCount()).toBe(1);

    service.resetExercise('ws-3-1');
    const ex = service.exercises().find(e => e.id === 'ws-3-1');
    expect(ex!.isCompleted).toBe(false);
    expect(ex!.criteria.every(c => !c.passed)).toBe(true);
    expect(service.completedCount()).toBe(0);
  });
});
