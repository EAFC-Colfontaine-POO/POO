export type TabId = 
  | 'ram-vs-storage'
  | 'json-vs-xml'
  | 'stringify-encapsulation'
  | 'prototype-crisis'
  | 'dto-studio'
  | 'crash-tests'
  | 'file-persistence'
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
