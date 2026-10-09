import '@angular/compiler';
import { describe, it, expect, beforeAll } from 'vitest';
import { createEnvironmentInjector } from '@angular/core';
import { ExerciseService } from './exercise.service';
import { ConfettiService } from './confetti.service';

/**
 * Solutions alternatives (noms de variables, style différent) qui doivent
 * aussi être validées : on ne veut pas bloquer un étudiant qui a bien codé.
 * Chaque variante part du code de départ et remplace un fragment.
 */
const VARIANTS: { id: string; from: string | RegExp; to: string }[] = [
  { id: 'ex-1-1', from: /\/\/ TODO[^\n]*/, to: 'if (solde < 0) throw new Error(`Le solde initial ne peut pas être négatif`);' },
  { id: 'ex-1-4', from: /    \/\/ ❌[\s\S]*?this\.reserve -= montant;/, to: '    if (this.actif === false) { throw new Error("Distributeur inactif"); }\n    this.compteurTransactions++;\n    this.reserve -= montant;' },
  { id: 'ex-3-2', from: /return "Anomalie non reconnue";\n\}/, to: 'if (error instanceof Error) return error.message;\n  if (typeof error == "string") return error;\n  return "Anomalie non reconnue";\n}' },
  { id: 'ex-3-3', from: /return "";\n\}/, to: 'if (null === error) return "NullError";\n  if (error === undefined) return "UndefinedError";\n  if (error instanceof Error) return error.message;\n  if (typeof error === "string") return error;\n  return String(error);\n}' },
  { id: 'ex-3-4', from: /\/\/ TODO[^\n]*/, to: 'throw new Error("Opération métier échouée", { cause: err })' },
  { id: 'ex-3-5', from: /return "Ignoré";/, to: 'if (error instanceof ErreurValidation) { return "Validation corrigée"; }\n    throw error' },
  { id: 'ex-4-1', from: /super\(message\);\n  \}/, to: 'super(message);\n    this.name = new.target.name;\n  }' },
  { id: 'ex-5-1', from: /  if \(err instanceof BanqueError\) \{[\s\S]*?\n  return "Autre";/, to: '  if (err instanceof SoldeInsuffisantError) { return "Spécifique: Solde"; }\n  if (err instanceof BanqueError) { return "Général: Banque"; }\n  return "Autre";' },
  { id: 'ex-6-1', from: /    this\.service\.debiter\(montant\);\n/, to: '    try { this.service.debiter(montant); } catch (e: unknown) { if (e instanceof BanqueError) { this.erreur.set(e); } }\n' },
  { id: 'ex-6-4', from: /  return "";\n\}/, to: "  if (erreur === null) return '';\n  return `<div class='alerte'><strong>[${erreur.code}]</strong> ${erreur.message}</div>`;\n}" },
];

describe('Solutions alternatives valides', () => {
  let service: ExerciseService;
  beforeAll(() => {
    const injector = createEnvironmentInjector([ConfettiService, ExerciseService], null as any);
    service = injector.get(ExerciseService);
  });

  for (const v of VARIANTS) {
    it(`variante valide pour ${v.id}`, () => {
      const ex = service.exercises().find(e => e.id === v.id)!;
      expect(ex.initialCode.search(v.from)).toBeGreaterThan(-1);
      service.updateCode(v.id, ex.initialCode.replace(v.from, v.to));
      const res = service.evaluateExercise(v.id);
      expect(res.success, res.messages.join(' ; ')).toBe(true);
    });
  }
});
