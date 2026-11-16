import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ConsoleLogEntry, LivreDTO } from '../models/app.models';

export interface ExecutionResult {
  success: boolean;
  logs: ConsoleLogEntry[];
  returnValue?: any;
  error?: string;
  transpiledJs: string;
  createdDbs?: string[];
}

export class CourseLivre {
  readonly #id: string;
  readonly #isbn: string;
  readonly #titre: string;
  readonly #genres: readonly string[];
  #nbExemplaires: number;

  constructor(id: string, isbn: string, titre: string, genres: readonly string[], nbExemplaires: number) {
    if (!isbn?.trim() || isbn.length < 5) throw new Error('ISBN invalide');
    if (!titre || titre.trim().length < 2) throw new Error('Titre trop court');
    if (nbExemplaires < 0) throw new Error('Stock négatif interdit');
    this.#id = id;
    this.#isbn = isbn.trim().toUpperCase();
    this.#titre = titre.trim();
    this.#genres = Object.freeze([...(genres || [])]);
    this.#nbExemplaires = Math.floor(nbExemplaires);
  }

  get id(): string { return this.#id; }
  get isbn(): string { return this.#isbn; }
  get titre(): string { return this.#titre; }
  get genres(): readonly string[] { return this.#genres; }
  get nbExemplaires(): number { return this.#nbExemplaires; }

  estDisponible(): boolean { return this.#nbExemplaires > 0; }

  retirerUnExemplaire(): void {
    if (!this.estDisponible()) {
      throw new Error(`Stock épuisé pour "${this.#titre}"`);
    }
    this.#nbExemplaires--;
  }

  toDTO(): LivreDTO {
    return {
      id: this.#id,
      isbn: this.#isbn,
      titre: this.#titre,
      genres: [...this.#genres],
      nbExemplaires: this.#nbExemplaires
    };
  }

  static fromDTO(dto: LivreDTO): CourseLivre {
    return new CourseLivre(dto.id, dto.isbn, dto.titre, dto.genres, dto.nbExemplaires);
  }
}

@Injectable({
  providedIn: 'root'
})
export class TypescriptTranspilerService {

  /**
   * Transpilation TypeScript vers JavaScript exécutable côté client.
   * Conçue pour la Séance 19 (IndexedDB, Dexie.js, POO, Invariants, DTOs, Signals) :
   * - Type Erasure total (types, interfaces, génériques)
   * - Préservation des champs privés natifs (#field)
   * - Résolution des parameter properties dans les constructeurs
   * - Nettoyage des casts "as Type" et annotations de retour
   */
  transpileToJs(tsCode: string): string {
    if (!tsCode) return '';

    let js = tsCode;

    // 1. Supprimer les interfaces
    js = js.replace(/interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 2. Supprimer les alias de type (type Nom = ...)
    js = js.replace(/type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, '');

    // 3. Nettoyer les clauses "implements Interface1, Interface2"
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, ' ');

    // 4. Nettoyer les clauses "abstract class" -> "class"
    js = js.replace(/\babstract\s+class\b/g, 'class');

    // 5. Supprimer les imports TypeScript (dexie, @angular/core, etc.)
    js = js.replace(/import\s+(?:\{[^}]*\}|\*\s+as\s+[\w$]+|[\w$]+)(?:\s*,\s*\{[^}]*\})?\s+from\s+['"][^'"]+['"];?/g, '');

    // 6. Supprimer les décorateurs Angular (@Injectable(), @Component(), etc.)
    js = js.replace(/@[A-Za-z0-9_$]+(?:\s*\([^)]*\))?/g, '');

    // 7. Transformer les Parameter Properties dans les constructeurs :
    // constructor(private _nom: string, public readonly prix: number) {}
    js = js.replace(/constructor\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g, (match, paramsStr, bodyStr) => {
      if (!/\b(public|private|protected|readonly)\b/.test(paramsStr)) {
        return match;
      }

      const params = paramsStr.split(',');
      const assignments: string[] = [];
      const cleanParams: string[] = [];

      for (const rawParam of params) {
        const trimmed = rawParam.trim();
        if (!trimmed) continue;

        const isParamProperty = /\b(public|private|protected|readonly)\b/.test(trimmed);
        const strippedMod = trimmed.replace(/\b(public|private|protected|readonly)\s+/g, '');
        const paramNameMatch = strippedMod.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        const paramName = paramNameMatch ? paramNameMatch[1] : '';

        if (isParamProperty && paramName) {
          assignments.push(`this.${paramName} = ${paramName};`);
        }
        cleanParams.push(this.cleanParams(strippedMod));
      }

      const superMatch = bodyStr.match(/^\s*super\([^)]*\);?/);
      if (superMatch) {
        const superCall = superMatch[0];
        const restBody = bodyStr.slice(superCall.length);
        return `constructor(${cleanParams.join(', ')}) {\n  ${superCall}\n  ${assignments.join('\n  ')}\n${restBody}}`;
      }

      return `constructor(${cleanParams.join(', ')}) {\n  ${assignments.join('\n  ')}\n${bodyStr}}`;
    });

    // 8. Supprimer les casts "as Type" (y compris chaînes littérales, as const, as any)
    js = js.replace(/\s+as\s+\([^)]+\)/g, '');
    js = js.replace(/\s+as\s+(?:any|unknown|const|'[^']*'|"[^"]*"|[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s*\[\s*\])?)(?:\s*[|&]\s*(?:'[^']*'|"[^"]*"|[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s*\[\s*\])?))*/g, '');

    // 8b. Supprimer les assertions non-null postfixées de TypeScript (ex: obj! ou table!)
    js = js.replace(/([a-zA-Z0-9_$\]\)])!(?!=)/g, '$1');

    // 8c. Supprimer les types génériques sur les propriétés et appels : Table<TacheDTO, string>, signal<Note[]>
    for (let i = 0; i < 4; i++) {
      js = js.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*<[A-Za-z0-9_$, \t\[\]?|&]+>(?=\s*[\(=;])/g, '$1');
    }

    // 9. Supprimer les modificateurs de visibilité
    js = js.replace(/\b(public|private|protected|readonly|abstract)\s+/g, '');

    // 9b. Supprimer les types de fonctions callback en paramètres : (cb: (a: string) => void)
    js = js.replace(/:\s*\([^)]*\)\s*=>\s*[a-zA-Z_$][a-zA-Z0-9_$<>, |&]*/g, '');

    // 9c. Supprimer les types de retour de fonctions (ex: ): Promise<{ ... }> {)
    js = this.stripReturnTypes(js);

    // 10. Supprimer les types dans les fonctions et méthodes
    js = this.cleanFunctionSignatures(js);

    // 10b. Nettoyer les clauses catch typées : catch (err: any) -> catch (err)
    js = js.replace(/catch\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^)]+\)/g, 'catch ($1)');

    // 11. Supprimer les déclarations de types de variables : let x: number = 5
    js = js.replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;]+=/g, '$1 $2 =');

    // 12. Nettoyer les propriétés de classe sans assignation ou avec typage (sauf champs privés #field)
    js = js.replace(/^\s*(static\s+)?(?!(?:default|case|return|throw)\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;\n]+=\s*/gm, '  $1$2 = ');
    js = js.replace(/^\s*(static\s+)?(?!(?:default|case|return|throw)\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^;\n]+;/gm, '  $1$2;');
    js = js.replace(/^\s*(static\s+)?(#[a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;\n]+=\s*/gm, '  $1$2 = ');
    js = js.replace(/^\s*(static\s+)?(#[a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^;\n]+;/gm, '  $1$2;');

    return js;
  }

  private stripReturnTypes(code: string): string {
    let out = '';
    let i = 0;
    const n = code.length;

    while (i < n) {
      if (code[i] === ')') {
        out += ')';
        let j = i + 1;
        while (j < n && /\s/.test(code[j])) j++;
        if (code[j] === ':') {
          let k = j + 1;
          let depth = 0;
          let foundBody = false;
          while (k < n) {
            const ch = code[k];
            if (depth === 0) {
              if (ch === '{') {
                foundBody = true;
                break;
              }
              if (ch === '=' && code[k + 1] === '>') {
                foundBody = true;
                break;
              }
            }

            if (ch === '<' || ch === '{' || ch === '(' || ch === '[') {
              depth++;
            } else if (ch === '>' || ch === '}' || ch === ')' || ch === ']') {
              depth--;
            }
            k++;
          }
          if (foundBody) {
            out += ' ';
            i = k;
            continue;
          }
        }
        i++;
        continue;
      }
      out += code[i];
      i++;
    }
    return out;
  }

  private cleanFunctionSignatures(code: string): string {
    let res = code.replace(/(?:<[^>]*>)?\s*\(([^()]*?)\)\s*(?::\s*([^=>{]+))?\s*=>/g, (_m, paramList) => {
      const cleanParams = this.cleanParams(paramList);
      return `(${cleanParams}) =>`;
    });

    return res.replace(/(constructor|function|\b[a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*<[^>]*>)?\s*\(([^()]*?)\)\s*(?::\s*([^{=]+(?:\{[^}]*\})*))?\s*(\{|=>(?!>))/g, (_match, fnName, paramList, _retType, suffix) => {
      if (fnName === 'if' || fnName === 'while' || fnName === 'for' || fnName === 'switch' || fnName === 'catch') {
        return _match;
      }
      const cleanParams = this.cleanParams(paramList);
      return `${fnName}(${cleanParams}) ${suffix}`;
    });
  }

  private cleanParams(paramStr: string): string {
    if (!paramStr || !paramStr.includes(':')) {
      return paramStr;
    }

    let result = '';
    let inType = false;
    let depth = 0;

    for (let i = 0; i < paramStr.length; i++) {
      const ch = paramStr[i];
      if (ch === '<' || ch === '{' || ch === '(' || ch === '[') {
        depth++;
      } else if (ch === '>' || ch === '}' || ch === ')' || ch === ']') {
        depth--;
      } else if (depth === 0) {
        if (ch === ':') {
          inType = true;
          continue;
        } else if (ch === '=' || ch === ',') {
          inType = false;
        }
      }

      if (!inType) {
        if (depth === 0 && ch === '?' && paramStr[i + 1] === ':') {
          continue;
        }
        result += ch;
      }
    }

    return result.trim();
  }

  /**
   * Exécute le code TypeScript dans un bac à sable asynchrone avec support natif de Dexie.js 4+
   */
  async executeCode(tsCode: string): Promise<ExecutionResult> {
    const logs: ConsoleLogEntry[] = [];
    const timestamp = () => new Date().toLocaleTimeString();
    const createdDbs: string[] = [];

    const mockConsole = {
      log: (...args: any[]) => {
        logs.push({
          type: 'log',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      error: (...args: any[]) => {
        logs.push({
          type: 'error',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      warn: (...args: any[]) => {
        logs.push({
          type: 'warn',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      info: (...args: any[]) => {
        logs.push({
          type: 'info',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      }
    };

    let transpiledJs = '';
    try {
      transpiledJs = this.transpileToJs(tsCode);
    } catch (err: any) {
      return {
        success: false,
        logs: [{
          type: 'error',
          text: `Erreur de transpilation : ${err.message}`,
          timestamp: timestamp()
        }],
        error: err.message,
        transpiledJs: ''
      };
    }

    // Proxy sur le constructeur Dexie pour tracker les bases créées et pouvoir les nettoyer
    const CustomDexie = class extends Dexie {
      constructor(databaseName: string, options?: any) {
        super(databaseName, options);
        createdDbs.push(databaseName);
      }
    };
    // Copier les propriétés statiques de Dexie (ConstraintError, etc.)
    Object.setPrototypeOf(CustomDexie, Dexie);
    for (const key of Object.getOwnPropertyNames(Dexie)) {
      if (key !== 'prototype' && key !== 'name' && key !== 'length') {
        try {
          (CustomDexie as any)[key] = (Dexie as any)[key];
        } catch {}
      }
    }

    const mockCrypto = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto
      : { randomUUID: () => 'uuid-' + Math.random().toString(36).substring(2, 9) };

    const signalShim = (initialVal: any) => {
      let val = initialVal;
      const fn: any = () => val;
      fn.set = (newVal: any) => { val = newVal; };
      fn.update = (updater: any) => { val = updater(val); };
      fn.asReadonly = () => (() => val);
      return fn;
    };

    const computedShim = (fn: any) => {
      const computedFn: any = () => fn();
      return computedFn;
    };

    try {
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

      const runFn = new AsyncFunction(
        'console',
        'Dexie',
        'crypto',
        'signal',
        'computed',
        'Livre',
        `
        "use strict";
        ${transpiledJs}
        `
      );

      const returnValue = await runFn(
        mockConsole,
        CustomDexie,
        mockCrypto,
        signalShim,
        computedShim,
        CourseLivre
      );

      return {
        success: true,
        logs,
        returnValue,
        transpiledJs,
        createdDbs
      };
    } catch (err: any) {
      logs.push({
        type: 'error',
        text: `Runtime Error : ${err.message}`,
        timestamp: timestamp()
      });

      return {
        success: false,
        logs,
        error: err.message,
        transpiledJs,
        createdDbs
      };
    } finally {
      // Nettoyage des bases de données éphémères créées
      for (const dbName of createdDbs) {
        try {
          await Dexie.delete(dbName);
        } catch {}
      }
    }
  }

  private formatArg(arg: any): string {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
    if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
    if (Array.isArray(arg)) {
      try {
        return JSON.stringify(arg);
      } catch {
        return '[Array]';
      }
    }
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return '[Object]';
      }
    }
    return String(arg);
  }
}
