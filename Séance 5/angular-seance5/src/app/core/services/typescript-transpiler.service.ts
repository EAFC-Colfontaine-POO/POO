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
   * Transpilation complète TypeScript vers JavaScript exécutable 100% côté client.
   * Prend en charge :
   * - L'effacement des types, interfaces, types littéraux, génériques
   * - La transformation des Parameter Properties (private _solde: number -> this._solde = _solde;)
   * - La transformation des Enums TypeScript en objets exécutables
   * - Le nettoyage des modificateurs de visibilité (public, private, protected, readonly)
   */
  transpileToJs(tsCode: string): string {
    if (!tsCode) return '';

    let js = tsCode;

    // 1. Transformer les Enums TypeScript
    // enum Statut { EnAttente, Payee, Livree } ou enum Devise { EUR = '€' }
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

    // 2. Transformer les Parameter Properties dans les constructeurs :
    // constructor(private _numero: string, public readonly solde: number) {}
    // Doit insérer this._numero = _numero; this.solde = solde; au début du constructeur
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
        cleanParams.push(strippedMod);
      }

      if (assignments.length === 0) {
        return match;
      }

      const superMatch = bodyStr.match(/^\s*super\([^)]*\);?/);
      if (superMatch) {
        const superCall = superMatch[0];
        const restBody = bodyStr.slice(superCall.length);
        return `constructor(${cleanParams.join(', ')}) {\n  ${superCall}\n  ${assignments.join('\n  ')}\n${restBody}}`;
      }

      return `constructor(${cleanParams.join(', ')}) {\n  ${assignments.join('\n  ')}\n${bodyStr}}`;
    });

    // 3. Supprimer les interfaces
    js = js.replace(/interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 4. Supprimer les types
    js = js.replace(/type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, '');

    // 5. Supprimer les casts "as Type"
    js = js.replace(/\s+as\s+[A-Za-z0-9_$<>\[\]|&\s]+/g, '');

    // 6. Supprimer les modificateurs de visibilité et readonly
    js = js.replace(/\b(public|private|protected|readonly)\s+/g, '');

    // 7. Supprimer les génériques <T>, <string, number>
    js = js.replace(/<[A-Za-z0-9_$,\s|&]+>(?=\s*[\(\{\[])/g, '');

    // 8. Supprimer les types de retour : ): Type { ou ): Type =>
    js = js.replace(/\)\s*:\s*[A-Za-z0-9_$<>\[\]|&\s{}?:]+\s*(=>|\{)/g, ') $1');

    // 9. Supprimer les types dans les listes de paramètres des constructeurs / fonctions / méthodes
    // Cible spécifiquement (a: number, b?: string = 'def') sans toucher aux objets littéraux
    js = js.replace(/(constructor|function|\b[a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*(\{|=>)/g, (_m, fnName, paramList, suffix) => {
      // Nettoyer d'abord les types objets inline comme { nom: string; score: number }
      let cleanList = paramList.replace(/:\s*\{[^}]*\}/g, '');
      if (!cleanList.includes(':')) {
        return `${fnName}(${cleanList}) ${suffix}`;
      }
      const cleaned = cleanList.split(',').map((p: string) => {
        const parts = p.split('=');
        const left = parts[0].replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\??\s*:\s*[^:]+$/g, '$1').trim();
        return parts.length > 1 ? `${left} = ${parts.slice(1).join('=')}` : left;
      }).join(', ');
      return `${fnName}(${cleaned}) ${suffix}`;
    });

    // 10. Supprimer les types des variables : let x: number = 5
    js = js.replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;]+=/g, '$1 $2 =');

    // 11. Nettoyer les déclarations de propriétés de classe sans assignation ou avec typage :
    // e.g.  _solde: number; ou _solde: number = 0; -> _solde = 0;
    js = js.replace(/^\s*(static\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;\n]+=\s*/gm, '  $1$2 = ');
    js = js.replace(/^\s*(static\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^;\n]+;/gm, '  $1$2;');

    return js;
  }

  /**
   * Exécute le code dans un bac à sable en capturant logs et erreurs
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
      const runFn = new Function('console', `
        "use strict";
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
