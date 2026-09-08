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
 * `conferirImports` (contrato.mjs) usa só o grupo 1 — 106 assets. Com os outros
 * dois são 109. A diferença é justamente onde mora o `ProductShowcase07`.
 *
 *   yarn alcance
 *
 * Não falha o build: é inventário para decidir, não invariante. O que ele mede e
 * a decisão de cada caso estão em
 * `faststore.starter/docs/alcance-do-catalogo.md`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { itens, FASTSTORE_STARTER } from './lib/util.mjs';

/** Os prefixos que o manifest deixa implícitos (`useInView` → `hooks/useInView`). */
const PREFIXO = {
  hooks: 'hooks/',
  fragments: 'fragments/',
  typings: 'typings/',
  utils: 'utils/',
};

/** Todos os manifests do starter, por id, guardando a pasta de cada um. */
function lerManifests() {
  const m = new Map();
  (function varrer(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) varrer(p);
      else if (e.name === 'manifest.json') {
        const d = JSON.parse(fs.readFileSync(p, 'utf8'));
        d._dir = path.dirname(p);
        m.set(d.id, d);
      }
    }
  })(path.join(FASTSTORE_STARTER, 'src'));
  return m;
}

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

/** Mesma travessia de `fechoCompleto` em contrato.mjs. */
function fecho(id, m) {
  const vis = new Set();
  const fila = [id];
  while (fila.length) {
    const i = fila.pop();
    if (vis.has(i) || !m.has(i)) continue;
    vis.add(i);
    fila.push(...declaradas(m.get(i)));
  }
  return vis;
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

// Root 2 — auto-injeção do export (useLayoutGenerator.ts).
const autoInjetados = catalogo.includes('organisms/ProductShowcase01')
  ? ['overrides/CrossSellingShelf01']
  : [];

// Root 3 — alvo da substituição de showcase (BuildPipeline._resolve).
const alvosShowcase = catalogo
  .filter(p => /^organisms\/ProductShelfCustom\d+$/.test(p))
  .map(p => `organisms/ProductShowcase${p.replace(/\D+/g, '')}`)
  .filter(id => manifests.has(id));

const roots = [...new Set([...catalogo, ...autoInjetados, ...alvosShowcase])];
const alcance = new Set();
for (const r of roots) for (const id of fecho(r, manifests)) alcance.add(id);

// O alcance POTENCIAL: se todo asset que declara `section` entrasse no catálogo.
// É o que separa "só falta registrar o pai" de "não tem como chegar".
const potencial = new Set(alcance);
for (const id of manifests.keys()) {
  if (manifests.get(id).section) {
    for (const x of fecho(id, manifests)) potencial.add(x);
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
  const f = fecho(id, manifests);
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
