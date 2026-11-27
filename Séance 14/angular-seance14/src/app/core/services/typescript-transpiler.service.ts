import { Injectable } from '@angular/core';
import { ConsoleLogEntry } from '../models/app.models';

export interface ExecutionResult {
  success: boolean;
  logs: ConsoleLogEntry[];
  returnValue?: any;
  error?: string;
  transpiledJs: string;
}

@Injectable({
  providedIn: 'root'
})
export class TypescriptTranspilerService {

  /**
   * Transpile le code TypeScript de l'étudiant en JavaScript exécutable dans le navigateur.
   * Prend en charge les spécificités de la Séance 14 :
   * - Décorateurs Angular (@Injectable, @Component)
   * - Génériques (<T>, <T extends Identifiable>, <K, V>)
   * - Lookup types (T['id'])
   * - Parameter properties (constructor(public readonly id: number, ...))
   * - Champs privés ES (#items = signal(...))
   * - Effacement des types et interfaces
   */
  transpileToJs(tsCode: string): string {
    if (!tsCode) return '';

    let js = tsCode;

    // 1. Supprimer les imports @angular/core
    js = js.replace(/import\s*\{[^}]*\}\s*from\s*['"]@angular\/core['"];?/g, '');
    js = js.replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]+['"];?/g, '');

    // 2. Nettoyer les décorateurs Angular : @Injectable(...) ou @Component(...)
    js = js.replace(/@Injectable\s*\([^)]*\)/g, '');
    js = js.replace(/@Component\s*\(\{[\s\S]*?\}\)/g, '');

    // 2b. Nettoyer les exports ES (non autorisés dans new Function)
    js = js.replace(/\bexport\s+(?:default\s+)?/g, '');

    // 3. Supprimer les interfaces (Type Erasure)
    js = js.replace(/export\s+interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');
    js = js.replace(/interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 4. Supprimer les types déclarés : type X = ...;
    js = js.replace(/export\s+type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, '');
    js = js.replace(/type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, '');

    // 5. Supprimer la clause "implements Interface" sur les classes
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, ' ');

    // 6. Supprimer les déclarations de génériques sur les classes et fonctions :
    // class Box<T> -> class Box, class Repo<T extends Identifiable> -> class Repo
    js = js.replace(/\bclass\s+([A-Za-z0-9_$]+)\s*<[^>{]+>/g, 'class $1');
    js = js.replace(/\bfunction\s+([A-Za-z0-9_$]+)\s*<[^>(]+>/g, 'function $1');

    // 6b. Supprimer les arguments génériques sur extends : extends Repository<Client> -> extends Repository
    js = js.replace(/\bextends\s+([A-Za-z0-9_$]+)\s*<[^>{]+>/g, 'extends $1');

    // 7. Supprimer les instanciations génériques : new Box<number>(42) -> new Box(42)
    js = js.replace(/\bnew\s+([A-Za-z0-9_$]+)\s*<[^>]+>\s*\(/g, 'new $1(');

    // 8. Supprimer les génériques sur les appels de fonctions : signal<Produit[]>([]) -> signal([]), computed<T>(...) -> computed(...)
    js = js.replace(/\b(signal|computed)\s*<[^>]+>\s*\(/g, '$1(');

    // 9. Transformer les Parameter Properties dans les constructeurs :
    // constructor(public readonly id: number, public nom: string) {}
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

    // 10. Nettoyer les casts "as Type"
    js = js.replace(/\s+as\s+[A-Za-z0-9_$<>\[\]|&\s]+/g, '');

    // 11. Supprimer les modificateurs de visibilité TypeScript restants (sauf private # qui est du JS natif)
    js = js.replace(/\b(public|protected|readonly)\s+/g, '');
    js = js.replace(/\bprivate\s+(?![#])/g, '');

    // 12. Nettoyer les signatures de méthodes et fonctions (types de paramètres et type de retour)
    js = this.cleanFunctionSignatures(js);

    // 13. Nettoyer les typages de variables : const x: number = 5 -> const x = 5
    js = js.replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;]+=/g, '$1 $2 =');

    // 13b. Nettoyer les types dans les clauses catch : catch (e: any) -> catch (e)
    js = js.replace(/\bcatch\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^)]+\)/g, 'catch ($1)');

    // 13c. Nettoyer les typages de variables sans assignation : let x: number; -> let x;
    js = js.replace(/\b(let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;\n]+;/g, '$1 $2;');

    // 14. Nettoyer les typages de champs de classe : id: number; -> id;
    js = js.replace(/^\s*(static\s+)?([#]?[a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;\n]+=\s*/gm, '  $1$2 = ');
    js = js.replace(/^\s*(static\s+)?([#]?[a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^;\n]+;/gm, '  $1$2;');

    return js;
  }

  private cleanFunctionSignatures(code: string): string {
    // 1. Nettoie les fonctions fléchées : (c: string): string => ...
    let res = code.replace(/\(([^);]*?)\)\s*(?::\s*[^;{\n=]+)?\s*=>/g, (_m, paramList) => {
      const cleanParams = this.cleanParams(paramList);
      return `(${cleanParams}) =>`;
    });

    // 2. Nettoie les fonctions et méthodes classiques : name(params): ReturnType {
    return res.replace(/(constructor|function|\b[#]?[a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^);]*?)\)\s*(?::\s*[^;{\n=]+)?\s*\{/g, (_match, fnName, paramList) => {
      if (fnName === 'if' || fnName === 'while' || fnName === 'for' || fnName === 'switch') {
        return _match;
      }
      if (fnName === 'catch') {
        const cleanParams = this.cleanParams(paramList);
        return `catch (${cleanParams}) {`;
      }
      const cleanParams = this.cleanParams(paramList);
      return `${fnName}(${cleanParams}) {`;
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
   * Exécute le code dans un environnement bac à sable équipé des mocks Angular Signals et DI.
   */
  executeCode(tsCode: string): ExecutionResult {
    const logs: ConsoleLogEntry[] = [];
    const timestamp = () => new Date().toLocaleTimeString();

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

    try {
      // Environnement d'exécution injecté (Mocks Signals & DI Angular 22)
      const sandboxPreamble = `
        const __diContainer = new Map();
        function inject(token) {
          if (!__diContainer.has(token)) {
            __diContainer.set(token, new token());
          }
          return __diContainer.get(token);
        }
        function signal(initialVal) {
          let val = initialVal;
          const s = function() { return val; };
          s.set = function(newVal) { val = newVal; };
          s.update = function(fn) { val = fn(val); };
          s.asReadonly = function() {
            const ro = function() { return val; };
            return ro;
          };
          return s;
        }
        function computed(calcFn) {
          return function() { return calcFn(); };
        }
      `;

      const runFn = new Function('console', `
        "use strict";
        ${sandboxPreamble}
        ${transpiledJs}
      `);

      const returnValue = runFn(mockConsole);

      return {
        success: true,
        logs,
        returnValue,
        transpiledJs
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
        transpiledJs
      };
    }
  }

  private formatArg(arg: any): string {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
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
