/**
 * Estágio 1-italico — o liga/desliga do itálico (Tipografia → "Itálico nos
 * destaques") alcança todo itálico dos templates?
 *
 * A chave escreve `--font-italic` (`normal` | `italic`, buildThemeStyle). Só
 * funciona se NENHUM template tiver itálico fixo: toda regra é
 * `font-style: var(--font-italic, italic)`, e o <em>/<i> sem regra própria
 * lê o token pelo storefront.css. Sem navegador.
 */
import fs from 'node:fs';
import path from 'node:path';

import { RAIZ, ler, relatorio } from './lib/util.mjs';

const r = relatorio('1-italico · o itálico dos templates segue a chave da Tipografia');

const fixos = [];
function varrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) varrer(p);
    else if (/\.(css|scss)$/.test(e.name)) {
      const linhas = fs.readFileSync(p, 'utf8').split(/\r?\n/);
      linhas.forEach((l, i) => {
        if (/font-style:\s*italic\b/.test(l)) fixos.push(`${path.relative(RAIZ, p)}:${i + 1}`);
      });
    } else if (/\.tsx$/.test(e.name)) {
      const s = fs.readFileSync(p, 'utf8');
      if (/fontStyle:\s*['"]italic['"]/.test(s)) fixos.push(`${path.relative(RAIZ, p)} (estilo inline)`);
    }
  }
}
varrer(path.join(RAIZ, 'src/components/templates'));
r.ok(
  'nenhum itálico fixo nos templates (toda regra lê var(--font-italic, italic))',
  fixos.length === 0,
  fixos.slice(0, 8).join(', ') + (fixos.length > 8 ? ` … +${fixos.length - 8}` : '')
);
r.ok(
  'o tema escreve --font-italic (buildThemeStyle)',
  /'--font-italic':/.test(ler('src/utils/themeStyle.ts'))
);
r.ok(
  'o <em>/<i> sem regra própria lê o token (storefront.css)',
  /\.preview-template em,\s*\.preview-template i\s*\{\s*font-style:\s*var\(--font-italic, italic\)/.test(
    ler('src/styles/storefront.css')
  )
);
r.ok(
  'o config leva fontItalic nas variáveis (Tray/Wake e VTEX)',
  (ler('src/hooks/useLayoutGenerator.ts').match(/^\s+fontItalic,$/gm) ?? []).length >= 2
);
process.exit(r.fechar() ? 0 : 1);
