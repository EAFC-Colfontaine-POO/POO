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
   * Transpilation rapide et purement client-side (Type Erasure)
   * Supprime toutes les annotations de type, interfaces, types littéraux,
   * generics, readonly, et casts "as" pour obtenir du JavaScript valide et exécutable.
   */
  transpileToJs(tsCode: string): string {
    if (!tsCode) return '';

    let js = tsCode;

    // 1. Supprimer les interfaces multi-lignes et mono-lignes
    // interface Foo { ... }
    js = js.replace(/interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, (match) => {
      return `/* [Effacement de Type] : ${match.replace(/\n/g, ' ').slice(0, 45)}... supprimé du JS */`;
    });

    // 2. Supprimer les alias de types
    // type Foo = ...;
    js = js.replace(/type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, (match) => {
      return `/* [Effacement de Type] : ${match.replace(/\n/g, ' ').slice(0, 45)}... supprimé du JS */`;
    });

    // 3. Supprimer les casts "as Type"
    // (x as string) -> (x)
    js = js.replace(/\s+as\s+[A-Za-z0-9_$<>\[\]|&\s]+/g, '');

    // 4. Supprimer les modificateurs readonly
    js = js.replace(/\breadonly\s+/g, '');

    // 5. Supprimer les modificateurs d'accès public/private/protected dans les constructeurs ou classes
    js = js.replace(/\b(public|private|protected)\s+/g, '');

    // 6. Supprimer les generics d'appels ou déclarations de fonctions / classes : <T>, <string, number>
    // Attention de ne pas casser les comparaisons < et >
    js = js.replace(/<[A-Za-z0-9_$,\s|&]+>(?=\s*[\(\{\[])/g, '');

    // 7. Supprimer les types de retour de fonction : ): Type { ou ): Type =>
    // ex: function foo(x: number): string { -> function foo(x: number) {
    js = js.replace(/\)\s*:\s*[A-Za-z0-9_$<>\[\]|&\s{}?:]+\s*(=>|\{)/g, ') $1');

    // 8. Supprimer les annotations de types de paramètres : (a: number, b?: string = 'def')
    // On remplace "param?: Type" par "param" et "param: Type" par "param"
    // Regex ciblée pour paramètres typés
    js = js.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\?\s*:\s*[A-Za-z0-9_$<>\[\]|&.\s{}()]+/g, '$1');
    js = js.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[A-Za-z0-9_$<>\[\]|&.\s{}()]+/g, '$1');

    // 9. Nettoyer les let/const/var typés qui auraient subsisté : let a: number = 5
    js = js.replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[A-Za-z0-9_$<>\[\]|&.\s{}()]+\s*=/g, '$1 $2 =');

    return js;
  }

  /**
   * Exécute le code dans un bac à sable isolé en capturant tous les console.log
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
      // Exécution avec capture console
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
