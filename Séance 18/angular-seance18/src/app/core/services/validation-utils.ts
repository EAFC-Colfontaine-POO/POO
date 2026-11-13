/**
 * Retire les commentaires de ligne (//) et de bloc (/* *\/) d'un code TypeScript
 * tout en respectant scrupuleusement les chaînes littérales ('...', "...", `...`)
 * afin de ne jamais mutiler les URLs (http://, https://) ou les contenus de chaînes.
 * Les retours à la ligne sont conservés.
 */
export function stripComments(src: string): string {
  if (!src) return '';
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];

    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      out += c;
      i++;
      while (i < n) {
        const ch = src[i];
        out += ch;
        i++;
        if (ch === '\\' && i < n) {
          out += src[i];
          i++;
          continue;
        }
        if (ch === quote) break;
      }
      continue;
    }

    if (c === '/' && next === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }

    if (c === '/' && next === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') out += '\n';
        i++;
      }
      i += 2;
      continue;
    }

    out += c;
    i++;
  }

  return out;
}

