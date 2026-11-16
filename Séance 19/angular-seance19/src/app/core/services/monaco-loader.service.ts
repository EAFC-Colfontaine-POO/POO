import { Injectable, NgZone, inject } from '@angular/core';
import loader from '@monaco-editor/loader';

const DEXIE_AND_DOMAIN_DECLARATIONS = `
declare class Dexie {
  constructor(databaseName: string, options?: any);
  version(versionNumber: number): DexieVersion;
  table<T, TKey = any>(name: string): Table<T, TKey>;
  transaction<U>(mode: 'r' | 'rw' | 'r!' | 'rw!', ...tablesAndScope: any[]): Promise<U>;
  open(): Promise<Dexie>;
  close(): void;
  delete(): Promise<void>;
  isOpen(): boolean;

  static ConstraintError: new (msg?: string) => Error;
  static ModifyError: new (msg?: string) => Error;
  static BulkError: new (msg?: string) => Error;
  static TransactionInactiveError: new (msg?: string) => Error;
  static delete(databaseName: string): Promise<void>;
  static exists(databaseName: string): Promise<boolean>;
}

declare interface DexieVersion {
  stores(schema: Record<string, string | null>): DexieVersion;
  upgrade(fn: (tx: any) => Promise<any> | void): DexieVersion;
}

declare interface Table<T, TKey = any> {
  add(item: T, key?: TKey): Promise<TKey>;
  put(item: T, key?: TKey): Promise<TKey>;
  get(key: TKey): Promise<T | undefined>;
  bulkAdd(items: readonly T[]): Promise<TKey>;
  delete(key: TKey): Promise<void>;
  clear(): Promise<void>;
  count(): Promise<number>;
  toArray(): Promise<T[]>;
  where(index: keyof T | string): WhereClause<T, TKey>;
  orderBy(index: keyof T | string): Collection<T, TKey>;
  filter(filterFn: (item: T) => boolean): Collection<T, TKey>;
  toCollection(): Collection<T, TKey>;
  update(key: TKey, changes: Partial<T>): Promise<number>;
}

declare interface WhereClause<T, TKey = any> {
  equals(value: any): Collection<T, TKey>;
  equalsIgnoreCase(value: string): Collection<T, TKey>;
  startsWith(prefix: string): Collection<T, TKey>;
  startsWithIgnoreCase(prefix: string): Collection<T, TKey>;
  between(lower: any, upper: any, includeLower?: boolean, includeUpper?: boolean): Collection<T, TKey>;
  above(val: any): Collection<T, TKey>;
  below(val: any): Collection<T, TKey>;
  anyOf(...values: any[]): Collection<T, TKey>;
}

declare interface Collection<T, TKey = any> {
  toArray(): Promise<T[]>;
  count(): Promise<number>;
  limit(count: number): Collection<T, TKey>;
  offset(count: number): Collection<T, TKey>;
  filter(fn: (item: T) => boolean): Collection<T, TKey>;
  modify(changes: Partial<T> | ((item: T) => void)): Promise<number>;
  delete(): Promise<number>;
  first(): Promise<T | undefined>;
  last(): Promise<T | undefined>;
  reverse(): Collection<T, TKey>;
  sortBy(keyPath: keyof T | string): Promise<T[]>;
}

export interface LivreDTO {
  readonly id: string;
  readonly isbn: string;
  readonly titre: string;
  readonly genres: readonly string[];
  readonly nbExemplaires: number;
}

export class Livre {
  constructor(id: string, isbn: string, titre: string, genres: readonly string[], nbExemplaires: number);
  get id(): string;
  get isbn(): string;
  get titre(): string;
  get genres(): readonly string[];
  get nbExemplaires(): number;
  estDisponible(): boolean;
  retirerUnExemplaire(): void;
  toDTO(): LivreDTO;
  static fromDTO(dto: LivreDTO): Livre;
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

declare interface Signal<T> {
  (): T;
}

declare interface WritableSignal<T> extends Signal<T> {
  set(value: T): void;
  update(fn: (current: T) => T): void;
  asReadonly(): Signal<T>;
}

declare function signal<T>(initialValue: T): WritableSignal<T>;
declare function computed<T>(fn: () => T): Signal<T>;
`;

@Injectable({
  providedIn: 'root'
})
export class MonacoLoaderService {
  private readonly ngZone = inject(NgZone);
  private monacoPromise: Promise<any> | null = null;
  private monacoInstance: any = null;

  /**
   * Initialise et met en cache l'instance globale de Monaco Editor.
   * Configure le compilateur TypeScript en mode strict pour afficher les diagnostics.
   */
  init(): Promise<any> {
    if (this.monacoInstance) {
      return Promise.resolve(this.monacoInstance);
    }

    if (this.monacoPromise) {
      return this.monacoPromise;
    }

    const baseVsPath = typeof window !== 'undefined'
      ? `${window.location.origin}/assets/monaco/vs`
      : '/assets/monaco/vs';

    loader.config({
      paths: {
        vs: baseVsPath
      }
    });

    this.monacoPromise = new Promise((resolve, reject) => {
      loader.init()
        .then((monaco) => {
          this.monacoInstance = monaco;
          this.configureTypescriptWorker(monaco);
          this.ngZone.run(() => {
            resolve(monaco);
          });
        })
        .catch((err) => {
          console.warn('[MonacoLoader] Échec chargement local, repli CDN jsDelivr...', err);
          loader.config({
            paths: {
              vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.56.0/min/vs'
            }
          });

          loader.init()
            .then((monaco) => {
              this.monacoInstance = monaco;
              this.configureTypescriptWorker(monaco);
              this.ngZone.run(() => {
                resolve(monaco);
              });
            })
            .catch((cdnErr) => {
              console.error('[MonacoLoader] Échec critique Monaco Editor :', cdnErr);
              this.monacoPromise = null;
              this.ngZone.run(() => {
                reject(cdnErr);
              });
            });
        });
    });

    return this.monacoPromise;
  }

  private configureTypescriptWorker(monaco: any): void {
    try {
      if (monaco?.languages?.typescript) {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2022,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: false
        });

        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          DEXIE_AND_DOMAIN_DECLARATIONS,
          'ts:dexie-env.d.ts'
        );
      }
    } catch {
      // Ignorer si déjà configuré
    }
  }
}
