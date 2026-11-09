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
   * Transpilation TypeScript vers JavaScript exécutable côté client.
   * Adaptée pour la Séance 17 (REST, Signals, DTOs, Entités Métier) :
   * - Suppression des types, interfaces, génériques
   * - Préservation des champs privés modernes (#field)
   * - Transformation des enums
   * - Parameter properties
   */
  transpileToJs(tsCode: string): string {
    if (!tsCode) return '';

    let js = tsCode;

    // 1. Transformer les Enums TypeScript
    js = js.replace(/enum\s+([A-Za-z0-9_$]+)\s*\{([^}]+)\}/g, (_match, enumName, body) => {
      const entries = body.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0);
      const assignments: string[] = [];
      let autoIndex = 0;

      for (const entry of entries) {
        const parts = entry.split('=').map((p: string) => p.trim());
        const key = parts[0];
        if (parts.length > 1) {
          const val = parts[1];
          const num = Number(val);
          if (!isNaN(num)) {
            autoIndex = num + 1;
            assignments.push(`${enumName}[${enumName}["${key}"] = ${val}] = "${key}";`);
          } else {
            assignments.push(`${enumName}["${key}"] = ${val};`);
          }
        } else {
          assignments.push(`${enumName}[${enumName}["${key}"] = ${autoIndex}] = "${key}";`);
          autoIndex++;
        }
      }

      return `var ${enumName} = (function(${enumName}) {\n  ${assignments.join('\n  ')}\n  return ${enumName};\n})({});`;
    });

    // 2. Supprimer les interfaces (Type Erasure total)
    js = js.replace(/interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 3. Supprimer les types (type Nom = ...)
    js = js.replace(/type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, '');

    // 4. Nettoyer les clauses "implements Interface1, Interface2"
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, ' ');

    // 5. Nettoyer les clauses "abstract class" -> "class"
    js = js.replace(/\babstract\s+class\b/g, 'class');

    // 6. Supprimer les imports TypeScript
    js = js.replace(/import\s+(?:\{[^}]*\}|\*\s+as\s+[\w$]+|[\w$]+)(?:\s*,\s*\{[^}]*\})?\s+from\s+['"][^'"]+['"];?/g, '');

    // 7. Transformer les Parameter Properties dans les constructeurs :
    // constructor(private _numero: string, public readonly solde: number) {}
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

    // 8. Supprimer les casts "as Type"
    js = js.replace(/\s+as\s+(?:any|unknown|[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s*\[\s*\])?)(?:\s*[|&]\s*[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s*\[\s*\])?)*/g, '');

    // 8b. Supprimer les types génériques sur les appels de fonctions : httpResource<ArticleDTO[]>(...)
    for (let i = 0; i < 3; i++) {
      js = js.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*<[A-Za-z0-9_$, \t\[\]?]+>(?=\s*\()/g, '$1');
    }

    // 9. Supprimer les modificateurs de visibilité
    js = js.replace(/\b(public|private|protected|readonly|abstract)\s+/g, '');

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
   * Exécute le code TypeScript dans un bac à sable client avec shims Angular et console virtuelle
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
      // Shims Angular pour l'exécution d'exercices Séance 17 :
      const ResourceStatusShim = {
        Idle: 0,
        Error: 1,
        Loading: 2,
        Reloading: 3,
        Resolved: 4,
        Local: 5
      };

      const signalShim = (initialVal: any) => {
        let val = initialVal;
        const fn: any = () => val;
        fn.set = (newVal: any) => { val = newVal; };
        fn.update = (updater: any) => { val = updater(val); };
        return fn;
      };

      const computedShim = (fn: any) => {
        const computedFn: any = () => fn();
        return computedFn;
      };

      const provideHttpClientShim = (...features: any[]) => ({
        provide: 'HttpClient',
        features
      });

      const withFetchShim = () => ({ kind: 'fetch' });

      const httpResourceShim = (urlOrFn: any, options?: any) => {
        let reloadCount = 0;
        const getUrl = typeof urlOrFn === 'function' ? urlOrFn() : urlOrFn;
        const isIdle = getUrl === undefined;
        let isError = getUrl && getUrl.includes('error');

        // Données fictives par défaut si appel valide
        let mockData: any = [
          { id: 1, titre: "Introduction à TypeScript", auteur: "Ada Lovelace" },
          { id: 2, titre: "Architecture REST & Angular", auteur: "Alan Turing" }
        ];

        return {
          value: () => (isIdle ? undefined : mockData),
          isLoading: () => !isIdle && false,
          error: () => (isError ? { status: 404, message: "Non trouvé" } : null),
          status: () => (isIdle ? ResourceStatusShim.Idle : (isError ? ResourceStatusShim.Error : ResourceStatusShim.Resolved)),
          reload: () => {
            reloadCount++;
            mockConsole.log(`[httpResource] .reload() déclenché (appel #${reloadCount})`);
          }
        };
      };

      const runFn = new Function(
        'console',
        'signal',
        'computed',
        'httpResource',
        'ResourceStatus',
        'provideHttpClient',
        'withFetch',
        `
        "use strict";
        ${transpiledJs}
        `
      );

      const returnValue = runFn(
        mockConsole,
        signalShim,
        computedShim,
        httpResourceShim,
        ResourceStatusShim,
        provideHttpClientShim,
        withFetchShim
      );

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
