export type TabId = 
  | 'dom-oop' 
  | 'semantic-attributes' 
  | 'cascade-specificity' 
  | 'box-model' 
  | 'flexbox-lab' 
  | 'bootstrap-grid' 
  | 'bootstrap-components' 
  | 'angular-integration' 
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

// 1. DOM & POO
export interface DomNodeItem {
  id: string;
  tag: string;
  label: string;
  oopClass: string;
  inheritanceChain: string[];
  properties: { [key: string]: string | number | boolean };
  methods: string[];
  children?: DomNodeItem[];
}

// 2. Gabarit Sémantique
export interface SemanticZone {
  tag: string;
  title: string;
  role: string;
  unique: boolean;
  roleExplanation: string;
  screenReaderUtility: string;
  exampleHtml: string;
  color: string;
}

// 3. Spécificité & Cascade
export interface SpecificityRule {
  name: string;
  selector: string;
  styleInline: number;
  idCount: number;
  classCount: number;
  elementCount: number;
  totalScore: number;
  cssPreview: string;
}

// 4. Box Model
export interface BoxModelValues {
  contentWidth: number;
  contentHeight: number;
  padding: number;
  border: number;
  margin: number;
  boxSizing: 'content-box' | 'border-box';
}

// 5. Flexbox
export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type JustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline';

export interface FlexboxState {
  direction: FlexDirection;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  gap: number;
  wrap: 'nowrap' | 'wrap';
  itemCount: number;
}

// 6. Bootstrap Grid
export interface BootstrapBreakpoint {
  name: string;
  infix: string;
  minWidth: number;
  devices: string;
  badgeClass: string;
}

// Validation & Exercices
export interface ValidationCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  hint: string;
}

export interface ExerciseDef {
  id: string;
  labNumber: number;
  number: string;
  title: string;
  subtitle: string;
  sectionId: TabId;
  estimatedTime: string;
  difficulty: "Débutant" | "Facile" | "Intermédiaire";
  statement: string;
  hint: string;
  initialHtml: string;
  initialCss: string;
  solutionHtml: string;
  solutionCss: string;
  isCompleted: boolean;
  criteria: ValidationCriterion[];
  solutionExplanation: string[];
  validateFn: (doc: Document) => { criterionId: string; passed: boolean; message?: string }[];
}

export interface Exercise extends ExerciseDef {
  currentHtml: string;
  currentCss: string;
}

export interface ValidationSummary {
  success: boolean;
  passedCount: number;
  totalCount: number;
  messages: string[];
}
