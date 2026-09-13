export type TabId = 
  | 'mpa-vs-spa' 
  | 'tree-explorer' 
  | 'bootstrap-flow' 
  | 'standalone-anatomy' 
  | 'template-bindings' 
  | 'view-encapsulation' 
  | 'cli-terminal' 
  | 'workshops-lab'
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
  workshopCount?: number;
  labNumber?: number;
  exerciseCount?: number;
}

// 1. MPA vs SPA
export type ComparisonCategory = 'all' | 'perf' | 'seo' | 'state' | 'arch';

export interface MpaSpaComparisonItem {
  id: string;
  category: ComparisonCategory;
  categoryLabel: string;
  topic: string;
  mpaBehavior: string;
  mpaStatus: 'negative' | 'neutral' | 'positive';
  spaBehavior: string;
  spaStatus: 'negative' | 'neutral' | 'positive';
  pedagogicalTakeaway: string;
}

// 2. Tree Explorer
export interface ProjectFileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  iconType: 'folder' | 'ts' | 'html' | 'css' | 'json' | 'config' | 'angular';
  children?: ProjectFileNode[];
  isExpanded?: boolean;
  content?: string;
  roleTitle?: string;
  roleDescription?: string;
  keyConcepts?: string[];
  studentPitfall?: string;
  shouldEditFrequently?: boolean;
}

// 3. Bootstrap Flow
export interface BootstrapStep {
  step: number;
  title: string;
  phaseLabel: string;
  badgeColor: string;
  description: string;
  technicalDetails: string;
  htmlDomState: string;
  executedCode: string;
  activeFile: string;
}

// 4. Standalone Anatomy
export interface ComponentPart {
  id: string;
  type: 'decorator' | 'metadata' | 'class' | 'property' | 'method';
  name: string;
  codeSnippet: string;
  role: string;
  xrayTarget: 'html' | 'css' | 'index' | 'ts';
  xrayExplanation: string;
  xrayLinkedSnippet: string;
}

// 5. Template Bindings
export interface BindingInteractiveDemo {
  title: string;
  kind: 'interpolation' | 'property' | 'event';
  syntax: string;
  description: string;
}

// 6. View Encapsulation
export type EncapsulationMode = 'Emulated' | 'None' | 'ShadowDom';

// 7. CLI Simulator
export interface CliCommandOption {
  command: string;
  label: string;
  description: string;
  durationMs: number;
  output: string[];
  generatedFiles?: { path: string; size: string }[];
}

// 8. Workshops (Ateliers)
export interface WorkshopFile {
  name: string;
  path: string;
  language: 'typescript' | 'html' | 'css';
  initialContent: string;
  solutionContent: string;
  currentContent: string;
}

export interface ValidationCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  hint: string;
}

export interface WorkshopExercise {
  id: string;
  number: string; // e.g. "3.1", "3.2"
  title: string;
  subtitle: string;
  estimatedTime: string;
  difficulty: 'Débutant' | 'Facile' | 'Intermédiaire';
  statement: string;
  hint: string;
  solutionExplanation: string[];
  files: WorkshopFile[];
  activeFileIndex: number;
  criteria: ValidationCriterion[];
  isCompleted: boolean;
}

// Compatibilité
export interface ConsoleLogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  text: string;
  timestamp: string;
}

export interface Exercise {
  id: string;
  labNumber: number;
  number: string;
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

export interface TsConfigOption {
  key: string;
  value: string;
  type: 'boolean' | 'string';
  description: string;
  pedagogicalNote: string;
  impactIfFalse?: string;
}

export interface CliCommand {
  command: string;
  description: string;
  output: string;
  details: string;
}
