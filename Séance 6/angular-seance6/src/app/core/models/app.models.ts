export type TabId = 
  | 'dry-problem' 
  | 'is-a-vs-has-a' 
  | 'constructor-super' 
  | 'protected-encapsulation' 
  | 'override-enrichment' 
  | 'fragile-base-class' 
  | 'angular-mediatheque' 
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
// 1. DUPLICATION & DRY
// ==========================================
export interface RedundantProperty {
  name: string;
  type: string;
  description: string;
  duplicatedIn: string[];
}

export interface TechnicalDebtMetrics {
  duplicateLines: number;
  maintenanceMultiplier: number;
  divergenceRiskPercent: number;
  newMediaOverheadLines: number;
}

// ==========================================
// 2. IS-A VS HAS-A
// ==========================================
export interface SemanticPairCard {
  id: string;
  classA: string;
  classB: string;
  correctRelation: 'is-a' | 'has-a';
  userChoice?: 'is-a' | 'has-a';
  title: string;
  justification: string;
  heresyExplanation?: string;
  recommendedDesign: string;
}

// ==========================================
// 3. CONSTRUCTOR & SUPER() CYCLE
// ==========================================
export interface BuildingStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  analogyPhase: string;
  memoryState: {
    baseAllocated: boolean;
    thisBorn: boolean;
    childFieldsInitialized: boolean;
  };
  codeHighlightLine: number;
  explanation: string;
}

// ==========================================
// 4. PROTECTED & ENCAPSULATION
// ==========================================
export type VisibilityModifier = 'public' | 'protected' | 'private';

export interface AccessZoneStatus {
  zone: 'base' | 'derived' | 'outside';
  label: string;
  icon: string;
  allowed: boolean;
  riskLevel: 'safe' | 'family-safe' | 'forbidden' | 'danger-corrupt';
  message: string;
  tsErrorCode?: string;
}

// ==========================================
// 5. OVERRIDE & ENRICHMENT
// ==========================================
export interface OverrideComparisonState {
  hasTypo: boolean;
  hasOverrideKeyword: boolean;
  noImplicitOverrideEnabled: boolean;
  detectedError?: string;
  behaviorDescription: string;
}

// ==========================================
// 6. FRAGILE BASE CLASS & YO-YO
// ==========================================
export interface DominoTarget {
  name: string;
  type: 'Livre' | 'Film' | 'AudioBook';
  impactDescription: string;
  derivedOutput: string;
  isBroken: boolean;
}

export interface YoYoLevel {
  level: number;
  className: string;
  fileName: string;
  methodName: string;
  codeSnippet: string;
  role: string;
}

// ==========================================
// 7. ANGULAR SHOWROOM POO MODELS
// ==========================================
export abstract class MediaModel {
  constructor(
    public titre: string,
    public annee: number
  ) {}

  abstract getType(): string;

  getDescription(): string {
    return `« ${this.titre} » (${this.annee})`;
  }
}

export class LivreModel extends MediaModel {
  constructor(
    titre: string,
    annee: number,
    public nombrePages: number
  ) {
    super(titre, annee);
  }

  override getType(): string {
    return 'Livre';
  }

  override getDescription(): string {
    return `${super.getDescription()} — ${this.nombrePages} pages`;
  }
}

export class FilmModel extends MediaModel {
  constructor(
    titre: string,
    annee: number,
    public dureeMinutes: number
  ) {
    super(titre, annee);
  }

  override getType(): string {
    return 'Film';
  }

  override getDescription(): string {
    return `${super.getDescription()} — durée : ${this.dureeMinutes} min`;
  }
}

// ==========================================
// 8. LABO & EVALUATION ENGINE
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
