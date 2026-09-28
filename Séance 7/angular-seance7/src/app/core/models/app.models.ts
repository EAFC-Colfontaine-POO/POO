export type TabId = 
  | 'control-tower-vs-delegation'
  | 'remote-control-analogy'
  | 'late-binding-prototypes'
  | 'ts-view-restrictor'
  | 'heterogeneous-collections-ocp'
  | 'instanceof-type-narrowing'
  | 'oop-vs-discriminated-unions'
  | 'angular-modern-mediatheque'
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
// MODÈLES POUR LES SIMULATEURS THÉORIQUES
// ==========================================

// 1. Tour de Contrôle vs Délégation
export interface MediaDemoItem {
  id: string;
  type: 'livre' | 'film' | 'jeuvideo' | 'podcast' | 'autre';
  titre: string;
  annee: number;
  specificInfo: string;
  pages?: number;
  duree?: number;
  plateforme?: number | string;
}

// 2. Télécommande Universelle
export type PluggableDeviceType = 'Livre' | 'Film' | 'JeuVideo';

export interface RemoteButton {
  name: string;
  type: 'property' | 'method';
  signature: string;
  description: string;
}

// 3. Liaison Dynamique & Prototypes
export interface PrototypeNode {
  name: string;
  properties: { name: string; value: string; isOverridden?: boolean }[];
  methods: { name: string; implementation: string; isOverridden?: boolean }[];
  parentPrototype?: string;
}

// 4. Collections Hétérogènes
export interface MediaInstanceCard {
  id: string;
  className: string;
  titre: string;
  annee: number;
  extraLabel: string;
  extraValue: string;
  descriptionOutput: string;
  badgeCss: string;
}

// 5. Discriminated Unions
export interface DiscriminatedMedia {
  kind: 'livre' | 'film' | 'jeu';
  titre: string;
  valeurSpecifique: string;
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
  difficulty: 'Débutant' | 'Facile' | 'Intermédiaire';
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
