export type TabId = 
  | 'zone-vs-dag'
  | 'trio-primitives'
  | 'memory-immutability'
  | 'component-comm'
  | 'oop-encapsulation'
  | 'fritkot-demo'
  | 'antipattern-scanner'
  | 'workshops-lab';

export interface ModuleSection {
  id: TabId;
  index: number;
  title: string;
  shortTitle: string;
  icon: string;
  badge?: string;
  description: string;
  labNumber?: number;
  exerciseCount?: number;
}

// ==========================================
// MODÈLES ÉVALUATION & ATELIERS (MONACO)
// ==========================================
export interface ConsoleLogEntry {
  type: 'log' | 'info' | 'warn' | 'error' | 'success';
  timestamp: string;
  message: string;
}

export interface ValidationCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  hint: string;
}

export interface SyntaxRequirement {
  type: 'keyword' | 'regex' | 'forbidden';
  pattern: RegExp | string;
  label: string;
  errorMessage: string;
}

export interface ExerciseDef {
  id: string;
  labNumber: number;
  number: string;
  title: string;
  subtitle: string;
  sectionId: TabId;
  estimatedTime: string;
  difficulty: 'Débutant' | 'Facile' | 'Intermédiaire' | 'Avancé';
  statement: string;
  hint: string;
  initialCode: string;
  solutionCode: string;
  solutionExplanation: string[];
  syntaxRequirements: SyntaxRequirement[];
  evaluateFn: (sandbox: any, logs: string[]) => { criterionId: string; passed: boolean; message?: string }[];
  criteria: ValidationCriterion[];
  isCompleted: boolean;
}

export interface Exercise extends ExerciseDef {
  currentCode: string;
}

export interface ValidationSummary {
  success: boolean;
  passedCount: number;
  totalCount: number;
  messages: string[];
  consoleLogs: ConsoleLogEntry[];
  executionError?: string;
}
