/**
 * Retire les commentaires de ligne et de bloc d'un code TypeScript tout en respectant les chaînes
 * ('...', "...", `...`) afin de ne pas toucher à leur contenu.
 * Les retours à la ligne sont conservés.
 *
 * Utilisé par la validation : une réponse laissée en commentaire ne doit jamais valider un critère.
 */
export function stripComments(src: string): string {
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
