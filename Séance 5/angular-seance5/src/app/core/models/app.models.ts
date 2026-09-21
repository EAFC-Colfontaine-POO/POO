export type TabId = 
  | 'memory-model'
  | 'aliasing-pitfall'
  | 'class-vs-instance'
  | 'instance-vs-static'
  | 'encapsulation-invariants'
  | 'visibility-parameter-properties'
  | 'getters-setters-tell-dont-ask'
  | 'advanced-mechanisms'
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

export interface ValidationCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  hint: string;
}

export interface ConsoleLogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  text: string;
  timestamp: string;
}

export interface Exercise {
  id: string;
  labNumber: number;
  number: string; // e.g. "1.1", "2.3"
  title: string;
  subtitle: string;
  sectionId: TabId;
  estimatedTime: string;
  difficulty: 'Débutant' | 'Facile' | 'Intermédiaire' | 'Avancé';
  statement: string;
  hint: string;
  initialCode: string;
  solutionCode: string;
  currentCode: string;
  isCompleted: boolean;
  criteria: ValidationCriterion[];
  solutionExplanation: string[];
}

export interface MemoryCell {
  address: string;
  variableName: string;
  type: 'primitive' | 'reference' | 'object';
  value: string | number | boolean;
  pointsTo?: string; // address in Heap if reference
  color?: string;
}

export interface HeapBlock {
  address: string;
  label: string;
  properties: { [key: string]: any };
  color?: string;
}
