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
  '--background-tertiary-color',
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

/** O primeiro token global depois de `var(<cssVar>,` (pulando Nível 1 intermediários). */
function tokenDe(css, cssVar) {
  const contagem = new Map();
  const re = new RegExp(`var\\(${cssVar.replace(/[-]/g, '\\-')},\\s*((?:var\\(--[a-z0-9-]+,\\s*)+)`, 'g');
  for (const m of css.matchAll(re)) {
    const tok = [...m[1].matchAll(/var\((--[a-z0-9-]+)/g)].map(x => x[1]).find(t => GLOBAIS.has(t));
    if (tok) contagem.set(tok, (contagem.get(tok) ?? 0) + 1);
  }
  // A mais frequente: a mesma var às vezes aparece numa mistura com outro token.
  return [...contagem.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

const mapa = {};
let com = 0, sem = 0;
for (const [componente, vars] of [...fixos.entries()].sort()) {
  const css = cssDo(componente);
  for (const v of [...vars].sort()) {
    const tok = tokenDe(css, v);
    if (!tok) { sem++; continue; }
    (mapa[componente] ??= {})[v] = tok;
    com++;
  }
}

const saida = `/**
 * GERADO por \`scripts/nivel1-tokens.mjs\` (\`yarn nivel1:tokens\`) — não edite à mão.
 *
 * Para cada valor de Nível 1 que um template completo fixa (\`NIVEL1_DAS_FAMILIAS\`),
 * o token global que a cadeia da réplica segue. ${com} vars com token; ${sem} vão
 * direto ao hex (sem global a seguir) e ficam de fora.
 */
export const TOKEN_DO_NIVEL1: Record<string, Record<string, string>> = ${JSON.stringify(mapa, null, 2).replace(/"([A-Za-z0-9]+)":/g, '$1:').replace(/"/g, "'")};
`;
fs.writeFileSync(path.join(RAIZ, 'src/utils/nivel1Tokens.ts'), saida);
console.log(`nivel1Tokens.ts: ${com} vars com token, ${sem} sem`);
