/**
 * Diagnóstico (não é estágio do funil): quais assets do `faststore.starter`
 * nenhum tema consegue receber.
 *
 * Existe porque a pergunta "esse componente é usado?" tem uma resposta errada e
 * fácil — grep de import. O generator não copia o que é importado: copia o que o
 * grafo de `manifest.json` alcança a partir das ESCOLHAS DO CLIENTE. Então o
 * alcance real são os roots do catálogo mais o fecho transitivo, e um componente
 * pode ter dez importadores e ainda assim nunca chegar a uma loja.
 *
 * ROOTS — os três, não só o primeiro:
 *   1. os `path` VTEX de `src/data/layoutData.ts` (o que o cliente escolhe);
 *   2. `overrides/CrossSellingShelf01`, que `useLayoutGenerator` auto-injeta no
 *      export quando `organisms/ProductShowcase01` está entre as escolhas;
 *   3. `organisms/ProductShowcase<NN>` para cada `ProductShelfCustom<NN>` do
 *      catálogo — `BuildPipeline._resolve` o empurra como root para que a
 *      substituição de showcase tenha alvo.
 * A substituição de SPOT não acrescenta alcance: o alvo é o `ProductCard<NN>`
 * escolhido, que já é root pelo item de catálogo.
 *
 * A lista vem de `raizesDoTema` (contrato.mjs), a mesma que os estágios 1 e 1g
 * usam desde 24/09 — até ali eles partiam só do grupo 1, e o `ProductShowcase07`
 * ficava fora de toda checagem estática.
 *
 *   yarn alcance
 *
 * Não falha o build: é inventário para decidir, não invariante. O que ele mede e
 * a decisão de cada caso estão em
 * `faststore.starter/docs/alcance-do-catalogo.md`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { itens } from './lib/util.mjs';
import { lerManifests, fechoCompleto, raizesDoTema } from './lib/contrato.mjs';

/** Os prefixos que o manifest deixa implícitos (`useInView` → `hooks/useInView`). */
const PREFIXO = {
  hooks: 'hooks/',
  fragments: 'fragments/',
  typings: 'typings/',
  utils: 'utils/',
};

/** Dependências declaradas de um asset, normalizadas para id. */
function declaradas(d) {
  const dp = d.dependencies ?? {};
  const out = [...(dp.components ?? [])];
  for (const [k, pre] of Object.entries(PREFIXO)) {
    out.push(...(dp[k] ?? []).map(x => (x.includes('/') ? x : pre + x)));
  }
  const g = dp.graphql ?? {};
  out.push(
    ...(g.resolvers ?? []).map(x => (x.includes('/') ? x : `resolvers/${x}`))
  );
  out.push(
    ...(g.typeDefs ?? []).map(x => (x.includes('/') ? x : `typeDefs/${x}`))
  );
  return out;
}

const arquivosTs = dir => {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...arquivosTs(p));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
};

const manifests = lerManifests();
const catalogo = [
  ...new Set(
    itens()
      .filter(i => i.platforms.includes('VTEX') && i.path)
      .map(i => i.path)
  ),
];

// Roots 2 e 3 — a auto-injeção do export e o alvo da substituição de showcase.
const roots = raizesDoTema(catalogo, id => manifests.has(id));
const autoInjetados = roots.filter(id => id.startsWith('overrides/') && !catalogo.includes(id));
const alvosShowcase = roots.filter(id => id.startsWith('organisms/ProductShowcase') && !catalogo.includes(id));
const alcance = new Set();
for (const r of roots) for (const id of fechoCompleto(r, manifests)) alcance.add(id);

// O alcance POTENCIAL: se todo asset que declara `section` entrasse no catálogo.
// É o que separa "só falta registrar o pai" de "não tem como chegar".
const potencial = new Set(alcance);
for (const id of manifests.keys()) {
  if (manifests.get(id).section) {
    for (const x of fechoCompleto(id, manifests)) potencial.add(x);
  }
}

const fora = [...manifests.keys()].filter(id => !alcance.has(id)).sort();
const comSection = fora.filter(id => manifests.get(id).section);
const semSection = fora.filter(id => !manifests.get(id).section);
const resgatados = semSection.filter(id => potencial.has(id));
const inalcancaveis = semSection.filter(id => !potencial.has(id));

// Quem declara quem, para dizer se um inalcançável é raiz de cluster ou arrastado.
const pais = new Map();
for (const [id, d] of manifests) {
  for (const dep of declaradas(d)) {
    if (!pais.has(dep)) pais.set(dep, []);
    pais.get(dep).push(id);
  }
}

console.log('\n━━ Alcance do catálogo sobre o faststore.starter');
console.log(`  manifests no starter        ${manifests.size}`);
console.log(`  roots                       ${roots.length}  (${catalogo.length} paths do catálogo + ${autoInjetados.length} auto-injetado + ${alvosShowcase.length} alvo de showcase-sub)`);
console.log(`  ALCANCE (fecho transitivo)  ${alcance.size}`);
console.log(`  fora do alcance             ${fora.length}`);
console.log(`    ├─ com section            ${comSection.length}  → basta entrar no catálogo`);
console.log(`    └─ sem section            ${semSection.length}`);
console.log(`       ├─ resgatados          ${resgatados.length}  → o pai com section entrar no catálogo resolve`);
console.log(`       └─ INALCANÇÁVEIS       ${inalcancaveis.length}  → nenhum tema recebe, de jeito nenhum`);

console.log(`\n── inalcançáveis (${inalcancaveis.length})`);
for (const id of inalcancaveis) {
  const p = pais.get(id) ?? [];
  console.log(
    `   ${id.padEnd(38)} ${p.length ? `arrastado por ${p.join('+')}` : 'raiz órfã (ninguém declara)'}`
  );
}

// Import não declarado é o defeito que só aparece no build do tema. `conferirImports`
// (estágio 1) o cobre DENTRO do alcance; aqui varremos tudo, porque um asset com
// `section` e import não declarado é uma bomba armada: quebra no dia em que entrar
// no catálogo, não hoje.
const donoDe = abs => {
  let melhor = null;
  for (const [id, d] of manifests) {
    if (abs === d._dir || abs.startsWith(d._dir + path.sep)) {
      if (!melhor || d._dir.length > manifests.get(melhor)._dir.length)
        melhor = id;
    }
  }
  return melhor;
};
const naoDeclarados = new Map();
for (const [id, d] of manifests) {
  const f = fechoCompleto(id, manifests);
  for (const arq of arquivosTs(d._dir)) {
    const src = fs.readFileSync(arq, 'utf8');
    for (const [, imp] of src.matchAll(/from\s+'(\.[^']+)'/g)) {
      const dono = donoDe(path.normalize(path.resolve(path.dirname(arq), imp)));
      if (!dono || dono === id || f.has(dono)) continue;
      naoDeclarados.set(`${id}>${dono}`, {
        id,
        dono,
        dentro: alcance.has(id),
        section: !!d.section,
      });
    }
  }
}
console.log(`\n── imports não declarados em TODO o starter (${naoDeclarados.size})`);
if (!naoDeclarados.size) console.log('   nenhum');
for (const x of naoDeclarados.values()) {
  const sev = x.dentro
    ? '🔴 NO ALCANCE — quebra hoje'
    : x.section
      ? '🟠 tem section — quebra ao registrar'
      : '⚪️ fora do alcance';
  console.log(`   ${sev}  ${x.id} importa ${x.dono} sem declarar`);
}
console.log('');
