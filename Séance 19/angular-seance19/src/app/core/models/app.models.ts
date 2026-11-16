export type TabId =
  | 'impedance-mismatch'
  | 'typed-database'
  | 'btree-indexes'
  | 'fluent-api'
  | 'acid-transactions'
  | 'schema-migrations'
  | 'anti-patterns'
  | 'bibliotech-demo'
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

// Interfaces métier du cours pour Monaco et typage
export interface LivreDTO {
  readonly id: string;
  readonly isbn: string;
  readonly titre: string;
  readonly genres: readonly string[];
  readonly nbExemplaires: number;
}

export interface EmpruntDTO {
  readonly id: string;
  readonly livreId: string;
  readonly adherentNom: string;
  readonly dateEmpruntISO: string;
}

export interface TacheDTO {
  id: string;
  titre: string;
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE';
  description?: string;
  statut?: 'A_FAIRE' | 'EN_COURS' | 'TERMINEE';
}

export interface ArticleDTO {
  id: string;
  titre: string;
  prix: number;
  categorie: string;
  descriptionLongue?: string;
}

export interface LogEntryDTO {
  id?: number;
  niveau: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  dateISO: string;
}

export interface ContactDTO {
  id: string;
  nomComplet?: string;
  nom?: string;
  prenom?: string;
  actif?: boolean;
}
