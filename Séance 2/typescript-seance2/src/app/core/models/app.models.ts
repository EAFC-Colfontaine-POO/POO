export type TabId = 
  | 'type-erasure' 
  | 'tooling-cli' 
  | 'types-primitives' 
  | 'scope-mutability' 
  | 'flow-operators' 
  | 'functions' 
  | 'arrays-tuples' 
  | 'objects-interfaces'
  | 'exercises';

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

export interface CliCommand {
  command: string;
  description: string;
  output: string;
  details: string;
}

export interface TsConfigOption {
  key: string;
  value: string;
  type: 'boolean' | 'string';
  description: string;
  pedagogicalNote: string;
  impactIfFalse?: string;
}

export interface ValidationCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  hint: string;
}

export interface ExerciseFile {
  name: string;
  language: 'typescript' | 'javascript';
  initialContent: string;
  solutionContent: string;
  currentContent: string;
}

export interface Exercise {
  id: string;
  labNumber: number; // 1 to 6
  number: string;    // e.g. "1.1", "2.3"
  title: string;
  subtitle: string;
  sectionId: TabId;
  estimatedTime: string;
  difficulty: 'Débutant' | 'Facile' | 'Intermédiaire';
  statement: string;
  hint: string;
  initialCode: string;
  solutionCode: string;
  currentCode: string;
  isCompleted: boolean;
  criteria: ValidationCriterion[];
  solutionExplanation: string[];
}

export interface ConsoleLogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  text: string;
  timestamp: string;
}
