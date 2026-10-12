import '@angular/compiler';
import { describe, it, expect, beforeAll } from 'vitest';
import { createEnvironmentInjector } from '@angular/core';
import { ExerciseService } from './exercise.service';
import { ConfettiService } from './confetti.service';

describe('Vérification Automatique des 14 Ateliers Pratiques de la Séance 11 (SOLID: S, O, D)', () => {
  let service: ExerciseService;

  beforeAll(async () => {
    const injector = createEnvironmentInjector([ConfettiService, ExerciseService], null as any);
    service = injector.get(ExerciseService);
    service.useCompiler((await import('typescript')).default);
  });

  it('doit charger exactement 14 exercices répartis sur 4 laboratoires', () => {
    const list = service.exercises();
    expect(list.length).toBe(14);

    const lab1 = list.filter(e => e.labNumber === 1);
    const lab2 = list.filter(e => e.labNumber === 2);
    const lab3 = list.filter(e => e.labNumber === 3);
    const lab4 = list.filter(e => e.labNumber === 4);

    expect(lab1.length).toBe(4);
    expect(lab2.length).toBe(4);
    expect(lab3.length).toBe(4);
    expect(lab4.length).toBe(2);
  });

  describe('Validation du code initial (Le code de départ ne doit PAS être validé)', () => {
    it('les 14 exercices doivent échouer avec leur initialCode et 0 critère réussi', () => {
      const list = service.exercises();
      for (const ex of list) {
        service.updateCode(ex.id, ex.initialCode);
        const result = service.evaluateExercise(ex.id);
        expect(result.success, `L'exercice ${ex.number} (${ex.id}) est validé avec son initialCode !`).toBe(false);
        expect(
          result.passedCount, 
          `L'exercice ${ex.number} (${ex.id}) a déjà des critères validés au départ : ${result.passedCount}/${result.totalCount}`
        ).toBe(0);
      }
    });
  });

  describe('Validation des solutions officielles (Chaque corrigé doit réussir à 100%)', () => {
    it('les 14 exercices doivent réussir à 100% avec leur solutionCode', () => {
      const list = service.exercises();
      for (const ex of list) {
        service.updateCode(ex.id, ex.solutionCode);
        const result = service.evaluateExercise(ex.id);
        expect(
          result.success, 
          `Échec pour l'exercice ${ex.number} (${ex.id}) : ${result.messages.join(' | ')} | ${result.executionError || ''}`
        ).toBe(true);
        expect(result.passedCount).toBe(result.totalCount);
      }
    });
  });

  describe('Vérification de la réinitialisation (resetExercise & resetAllExercises)', () => {
    it('resetExercise doit remettre le code initial et dévalider l\'exercice', () => {
      // 1. Valider le premier exercice
      const ex1 = service.exercises()[0];
      service.updateCode(ex1.id, ex1.solutionCode);
      const resValide = service.evaluateExercise(ex1.id);
      expect(resValide.success).toBe(true);
      expect(service.exercises().find(e => e.id === ex1.id)?.isCompleted).toBe(true);

      // 2. Réinitialiser
      service.resetExercise(ex1.id);
      const exApresReset = service.exercises().find(e => e.id === ex1.id)!;
      expect(exApresReset.isCompleted).toBe(false);
      expect(exApresReset.currentCode).toBe(ex1.initialCode);
      expect(exApresReset.criteria.every(c => !c.passed)).toBe(true);
    });

    it('resetAllExercises doit réinitialiser tous les exercices à 0', () => {
      // Valider plusieurs exercices
      const list = service.exercises();
      service.updateCode(list[0].id, list[0].solutionCode);
      service.evaluateExercise(list[0].id);
      service.updateCode(list[1].id, list[1].solutionCode);
      service.evaluateExercise(list[1].id);
      expect(service.completedCount()).toBeGreaterThan(0);

      // Tout réinitialiser
      service.resetAllExercises();
      expect(service.completedCount()).toBe(0);
      expect(service.exercises().every(e => !e.isCompleted)).toBe(true);
      expect(service.exercises().every(e => e.currentCode === e.initialCode)).toBe(true);
    });
  });

  describe('Souplesse de validation (Fonctions fléchées & Variations HTML)', () => {
    it('doit valider l\'exercice 1.1 même si l\'étudiant omet l\'accent sur Releve Bancaire', () => {
      const codeSansAccent = `
        export class CompteBancaire {
          constructor(public titulaire: string, public solde: number) {}
          calculerInterets(taux: number): number { return this.solde * taux; }
        }
        export class ReleveBancaireHtml {
          generer(compte: CompteBancaire): string {
            return \`<div><h1>Releve Bancaire</h1><p>Titulaire: \${compte.titulaire}</p><p>Solde: \${compte.solde} €</p></div>\`;
          }
        }
      `;
      service.updateCode('ex-1-1', codeSansAccent);
      const res = service.evaluateExercise('ex-1-1');
      expect(res.success).toBe(true);
    });

    it('doit accepter executerTestUnitaire sous forme de fonction fléchée (ex-3-3)', () => {
      const ex33 = service.exercises().find(e => e.id === 'ex-3-3')!;
      const codeFleche = ex33.solutionCode.replace(
        'export function executerTestUnitaire(): boolean {',
        'export const executerTestUnitaire = (): boolean => {'
      );
      service.updateCode('ex-3-3', codeFleche);
      const res = service.evaluateExercise('ex-3-3');
      expect(res.success).toBe(true);
    });

    it('doit accepter testerAvecMock sous forme de fonction fléchée (ex-3-4)', () => {
      const ex34 = service.exercises().find(e => e.id === 'ex-3-4')!;
      const codeFleche = ex34.solutionCode.replace(
        'export function testerAvecMock(): boolean {',
        'export const testerAvecMock = (): boolean => {'
      );
      service.updateCode('ex-3-4', codeFleche);
      const res = service.evaluateExercise('ex-3-4');
      expect(res.success).toBe(true);
    });
  });
});
