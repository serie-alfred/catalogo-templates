/**
 * Gera `src/utils/nivel1Tokens.ts`: para cada valor de Nível 1 que um template
 * completo fixa nas seções (`NIVEL1_DAS_FAMILIAS`), o token global que a cadeia
 * da réplica encadeia em seguida — `var(--header-bg, var(--background-primary-color, #hex))`
 * dá `--background-primary-color`.
 *
 * É o que deixa o editor soltar o valor fixado quando o usuário muda aquela cor
 * global (`soltarFixosDoTemplate`): sem isso, a global "não fazia nada" nas
 * seções que o template tinha fixado. Var cuja cadeia vai direto ao hex fica de
 * fora — não há global que ela siga.
 *
 *   yarn nivel1:tokens
 *
 * Rode de novo quando `NIVEL1_DAS_FAMILIAS` ou as cadeias das réplicas mudarem;
 * o estágio 1-catalogo do funil não depende disto.
 */
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const GLOBAIS = new Set([
  '--text-primary-color',
  '--text-secundary-color',
  '--text-tertiary-color',
  '--background-primary-color',
  '--background-primary-color-safe',
  '--background-secundary-color',
  '--background-secundary-color-safe',
  '--background-tertiary-color',
  '--background-tertiary-color-safe',
  '--background-footer',
  '--text-color-footer',
  '--text-color-base',
  '--text-color-secundary',
]);

const tc = fs.readFileSync(path.join(RAIZ, 'src/utils/templatesCompletos.ts'), 'utf8');
const ini = tc.indexOf('export const NIVEL1_DAS_FAMILIAS');
const fim = tc.indexOf('\n};', ini);
const bloco = tc.slice(ini, fim);
/** componente → vars fixadas */
const fixos = new Map();
let comp = null;
for (const linha of bloco.split('\n')) {
  const c = /^ {4}(\w+): \{/.exec(linha);
  if (c) comp = c[1];
  const v = /^ {6}'(--[a-z0-9-]+)':/.exec(linha);
  if (v && comp) (fixos.get(comp) ?? fixos.set(comp, new Set()).get(comp)).add(v[1]);
}

const registry = fs.readFileSync(path.join(RAIZ, 'src/utils/templateRegistry.ts'), 'utf8');
const pastaDe = new Map(
  [...registry.matchAll(/import\s+(\w+)\s+from\s+'@\/components\/templates\/([^']+)'/g)].map(m => [m[1], m[2]])
);

function cssDo(componente) {
  const pasta = pastaDe.get(componente);
  if (!pasta) return '';
  const dir = path.join(RAIZ, 'src/components/templates', pasta);
  const arquivos = [path.join(dir, 'index.module.css')];
  const tsx = path.join(dir, 'index.tsx');
  if (fs.existsSync(tsx)) {
    const fonte = fs.readFileSync(tsx, 'utf8');
    for (const m of fonte.matchAll(/from '@\/components\/templates\/([^']+)'/g))
      arquivos.push(path.join(RAIZ, 'src/components/templates', m[1], 'index.module.css'));
    for (const m of fonte.matchAll(/from '(\.\.?\/[\w-]+)'/g))
      arquivos.push(path.join(dir, m[1], 'index.module.css'));
  }
  return arquivos.filter(fs.existsSync).map(f => fs.readFileSync(f, 'utf8')).join('\n');
}

/**
 * TODOS os tokens globais que a var segue quando está vazia: o fallback inteiro de
 * cada `var(<cssVar>, …)` da réplica, inclusive dentro de `color-mix` e de Nível 1
 * intermediários. A mesma var às vezes cai em tokens diferentes em regras
 * diferentes (Header12 --header-text: texto-primário no miolo, texto-secundário
 * na topbar); guardar só o mais frequente deixava o pino preso quando o usuário
 * mudava o outro (revisão de 17/11, D1-01/D2-05).
 */
function tokensDe(css, cssVar) {
  const achados = new Set();
  const alvo = `var(${cssVar}`;
  for (let i = 0; (i = css.indexOf(alvo, i)) !== -1; i += alvo.length) {
    const depois = css[i + alvo.length];
    if (depois !== ',' && !/\s/.test(depois)) continue;
    let n = 0, fim = -1;
    for (let j = i + 3; j < css.length; j++) {
      if (css[j] === '(') n++;
      else if (css[j] === ')' && --n === 0) { fim = j; break; }
    }
    if (fim === -1) continue;
    for (const m of css.slice(i + alvo.length, fim).matchAll(/var\(\s*(--[a-z0-9-]+)/g))
      if (GLOBAIS.has(m[1])) achados.add(m[1]);
  }
  return [...achados].sort();
}

const mapa = {};
let com = 0, sem = 0;
for (const [componente, vars] of [...fixos.entries()].sort()) {
  const css = cssDo(componente);
  for (const v of [...vars].sort()) {
    const toks = tokensDe(css, v);
    if (!toks.length) { sem++; continue; }
    (mapa[componente] ??= {})[v] = toks;
    com++;
  }
}

const saida = `/**
 * GERADO por \`scripts/nivel1-tokens.mjs\` (\`yarn nivel1:tokens\`) — não edite à mão.
 *
 * Para cada valor de Nível 1 que um template completo fixa (\`NIVEL1_DAS_FAMILIAS\`),
 * os tokens globais que a cadeia da réplica segue (todos: a mesma var pode cair em
 * tokens diferentes em regras diferentes). ${com} vars com token; ${sem} vão direto
 * ao hex (sem global a seguir) e ficam de fora.
 */
export const TOKEN_DO_NIVEL1: Record<string, Record<string, readonly string[]>> = ${JSON.stringify(mapa, null, 2).replace(/"([A-Za-z0-9]+)":/g, '$1:').replace(/"/g, "'")};
`;
fs.writeFileSync(path.join(RAIZ, 'src/utils/nivel1Tokens.ts'), saida);
console.log(`nivel1Tokens.ts: ${com} vars com token, ${sem} sem`);
