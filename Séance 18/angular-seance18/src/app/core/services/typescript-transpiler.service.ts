import { Injectable } from '@angular/core';
import { ConsoleLogEntry } from '../models/app.models';

export interface ExecutionResult {
  success: boolean;
  logs: ConsoleLogEntry[];
  returnValue?: any;
  error?: string;
  transpiledJs: string;
  mockLocalStorage?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TypescriptTranspilerService {

  /**
   * Transpilation TypeScript vers JavaScript exécutable côté client.
   * Conçue pour la Séance 18 (LocalStorage, POO, Invariants, DTOs, Signals) :
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

    // 5. Supprimer les imports TypeScript (@angular/core, etc.)
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

    // 8. Supprimer les casts "as Type" (y compris chaînes littérales ex: as "clair" | "sombre", as const, as (...))
    js = js.replace(/\s+as\s+\([^)]+\)/g, '');
    js = js.replace(/\s+as\s+(?:any|unknown|const|'[^']*'|"[^"]*"|[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s*\[\s*\])?)(?:\s*[|&]\s*(?:'[^']*'|"[^"]*"|[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s*\[\s*\])?))*/g, '');

    // 8b. Supprimer les assertions non-null postfixées de TypeScript (ex: getItem("key")! ou obj.prop!)
    // en préservant strictement les opérateurs !=, !== et le NON logique !condition
    js = js.replace(/([a-zA-Z0-9_$\]\)])!(?!=)/g, '$1');

    // 8c. Supprimer les types génériques sur les appels de fonctions : lireJSONSecurise<Note[]>(...) ou signal<Note[]>(...)
    for (let i = 0; i < 4; i++) {
      js = js.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*<[A-Za-z0-9_$, \t\[\]?|&]+>(?=\s*\()/g, '$1');
    }

    // 9. Supprimer les modificateurs de visibilité
    js = js.replace(/\b(public|private|protected|readonly|abstract)\s+/g, '');

    // 9b. Supprimer les types de fonctions callback en paramètres : (cb: (a: string) => void)
    js = js.replace(/:\s*\([^)]*\)\s*=>\s*[a-zA-Z_$][a-zA-Z0-9_$<>, |&]*/g, '');

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
   * Crée un mock d'interface Storage isolée pour l'exécution d'exercices.
   * Utilise un Proxy pour supporter fidèlement Object.keys(localStorage), l'indexation
   * par crochets (localStorage['key']) et le mot-clé 'in' conformément à la spec Web Storage.
   */
  createMockStorage(initialEntries?: Record<string, string>): any {
    const store = new Map<string, string>();
    if (initialEntries) {
      for (const [k, v] of Object.entries(initialEntries)) {
        store.set(k, String(v));
      }
    }

    const storageObj: any = {
      _store: store,
      get length() {
        return store.size;
      },
      setItem(key: string, value: any) {
        store.set(String(key), String(value));
      },
      getItem(key: string): string | null {
        return store.has(String(key)) ? store.get(String(key))! : null;
      },
      removeItem(key: string) {
        store.delete(String(key));
      },
      clear() {
        store.clear();
      },
      key(index: number): string | null {
        const keys = Array.from(store.keys());
        return index >= 0 && index < keys.length ? keys[index] : null;
      }
    };

    return new Proxy(storageObj, {
      get(target, prop, receiver) {
        if (prop in target || typeof prop === 'symbol') {
          const val = target[prop];
          return typeof val === 'function' ? val.bind(target) : val;
        }
        return target.getItem(String(prop));
      },
      set(target, prop, value) {
        if (prop in target) {
          target[prop] = value;
          return true;
        }
        target.setItem(String(prop), value);
        return true;
      },
      deleteProperty(target, prop) {
        target.removeItem(String(prop));
        return true;
      },
      has(target, prop) {
        return (prop in target) || store.has(String(prop));
      },
      ownKeys() {
        return Array.from(store.keys());
      },
      getOwnPropertyDescriptor(target, prop) {
        if (store.has(String(prop))) {
          return {
            value: store.get(String(prop)),
            writable: true,
            enumerable: true,
            configurable: true
          };
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      }
    });
  }

  /**
   * Exécute le code TypeScript dans un bac à sable client avec console virtuelle,
   * shims Angular Signals, Storage et gestion d'erreurs
   */
  executeCode(tsCode: string, initialStorage?: Record<string, string>): ExecutionResult {
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
      const mockStorage = this.createMockStorage(initialStorage);
      const storageListeners: ((event: any) => void)[] = [];

      const mockCrypto = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto
        : { randomUUID: () => 'uuid-' + Math.random().toString(36).substring(2, 9) };

      const mockWindow = {
        localStorage: mockStorage,
        sessionStorage: this.createMockStorage(),
        crypto: mockCrypto,
        addEventListener: (event: string, handler: (e: any) => void) => {
          if (event === 'storage') {
            storageListeners.push(handler);
          }
        },
        removeEventListener: (event: string, handler: (e: any) => void) => {
          const idx = storageListeners.indexOf(handler);
          if (idx !== -1) storageListeners.splice(idx, 1);
        },
        dispatchEvent: (event: any) => {
          storageListeners.forEach(fn => fn(event));
          return true;
        }
      };

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

      const isPlatformBrowserShim = (_platformId: any) => true;
      const PLATFORM_ID_SHIM = 'browser';
      const injectShim = (token: any) => {
        if (token === PLATFORM_ID_SHIM || token === 'PLATFORM_ID') return 'browser';
        return {};
      };

      // Exécution dans Function sandbox avec isolation de localStorage, window et shims Angular
      const runFn = new Function(
        'console',
        'localStorage',
        'sessionStorage',
        'window',
        'crypto',
        'signal',
        'computed',
        'isPlatformBrowser',
        'PLATFORM_ID',
        'inject',
        'DOMException',
        `
        "use strict";
        ${transpiledJs}
        `
      );

      const returnValue = runFn(
        mockConsole,
        mockStorage,
        mockWindow.sessionStorage,
        mockWindow,
        mockCrypto,
        signalShim,
        computedShim,
        isPlatformBrowserShim,
        PLATFORM_ID_SHIM,
        injectShim,
        typeof DOMException !== 'undefined' ? DOMException : Error
      );

      return {
        success: true,
        logs,
        returnValue,
        transpiledJs,
        mockLocalStorage: mockStorage
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
