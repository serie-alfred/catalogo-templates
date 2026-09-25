/**
 * Estágio 1g — cada raiz do tema resolve no grafo de manifests?
 *
 * O estágio 4 monta um tema de VERDADE, mas só a partir do config COERENTE, que
 * escolhe um modelo por slot (`id === '01'` quando existe) — a maior parte dos
 * itens VTEX do catálogo nunca passa pelo `yarn build`. E um id que não resolve
 * não derruba só aquele componente: derruba a geração do tema INTEIRO, porque a
 * fase RESOLVE do generator estoura antes de escrever qualquer arquivo.
 *
 * Este estágio cobre todas as raízes de uma vez, sem clonar nem compilar nada:
 * usa as classes REAIS do generator (`AssetRegistry` + `DependencyResolver`)
 * contra o checkout local do starter. As raízes são os `path` do catálogo MAIS
 * as que o generator injeta (`raizesDoTema`: o CrossSellingShelf01 do export e
 * o ProductShowcase da vitrine) — até 24/09 eram só os `path`, e um manifest
 * quebrado no ProductShowcase07 passava aqui e estourava no tema de quem
 * escolhesse a vitrine 07.
 *
 * O que um `resolve` sem erro prova: todo id DECLARADO no grafo abaixo daquela
 * raiz tem manifest, e todo `scss` declarado tem arquivo. Não prova que as
 * declarações estão COMPLETAS — o resolver só anda pelo que está declarado, e o
 * import que ninguém declarou é invisível aqui. Esse lado é do `conferirImports`
 * do estágio 1 (e o `yarn alcance` varre o starter inteiro).
 *
 * Não substitui o estágio 4 — ele prova que o tema COMPILA, isto prova que os
 * arquivos CHEGAM. São falhas diferentes.
 */
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { itens, relatorio, FASTSTORE_STARTER, GENERATOR } from './lib/util.mjs';
import { raizesDoTema } from './lib/contrato.mjs';

const r = relatorio('estágio 1g · grafo de manifests das raízes do tema');

const imp = rel =>
  import(pathToFileURL(path.join(GENERATOR, rel)).href);

const { AssetRegistry } = await imp('src/platforms/faststore/core/AssetRegistry.js');
const { DependencyResolver } = await imp('src/platforms/faststore/core/DependencyResolver.js');

const registry = new AssetRegistry();
await registry.discover(FASTSTORE_STARTER);

const alvos = itens().filter(i => i.path);
r.ok('há item VTEX para conferir', alvos.length > 0, `${alvos.length}`);
const paths = [...new Set(alvos.map(i => i.path))];
// A regra de quando cada uma entra é a do generator: o showcase só quando o
// registry o tem (`BuildPipeline._resolve`), o CrossSellingShelf01 sempre que o
// ProductShowcase01 é escolhível — ausente, ele estoura aqui como estouraria lá.
const injetadas = raizesDoTema(paths, id => registry.has(id)).filter(
  id => !paths.includes(id)
);

const resolver = new DependencyResolver();
const alcance = new Set();

// `dependencies.scss` não é asset: o resolver só junta o NOME, e quem copia é o
// CopyScss, já na fase EXECUTE — o VALIDATE do generator não confere essa origem.
// Nome sem arquivo estoura ENOENT com o tema meio escrito. Foi o `productGallery`
// que o MainCategory06 passou a declarar em 22/09/2026 no lugar de `productGallery06`.
const scssSemArquivo = g =>
  [...g.scss].filter(
    n => !fs.existsSync(path.join(FASTSTORE_STARTER, 'src/sass', `${n}.module.scss`))
  );

const conferir = (rotulo, raiz) => {
  try {
    const g = resolver.resolve([raiz], registry);
    for (const id of g.ids) alcance.add(id);
    const semArquivo = scssSemArquivo(g);
    r.ok(
      `${rotulo} → ${raiz}`,
      g.ids.size > 0 && semArquivo.length === 0,
      semArquivo.length
        ? `scss declarado sem arquivo em src/sass: ${semArquivo.join(', ')}`
        : `${g.ids.size} assets`
    );
  } catch (e) {
    r.ok(`${rotulo} → ${raiz}`, false, String(e.message).slice(0, 120));
  }
};

for (const item of alvos) conferir(item.component, item.path);
r.ok(
  'o generator injeta raízes além do catálogo (CrossSellingShelf01, ProductShowcase)',
  injetadas.length > 0,
  'nenhuma — o catálogo não oferece ProductShowcase01 nem vitrine com showcase'
);
for (const id of injetadas) conferir('(injetada pelo generator)', id);

// Resolver TODAS de uma vez também: é assim que o generator monta um tema, e é
// onde um ID duplicado entre dois grafos apareceria.
try {
  const g = resolver.resolve([...paths, ...injetadas], registry);
  const semArquivo = scssSemArquivo(g);
  r.ok(
    'o grafo COMPLETO resolve de uma vez',
    g.ids.size >= alcance.size && semArquivo.length === 0,
    semArquivo.length
      ? `scss declarado sem arquivo em src/sass: ${semArquivo.join(', ')}`
      : `${g.ids.size} assets · ${g.constants.size} constantes · ${g.scss.size} scss`
  );
} catch (e) {
  r.ok('o grafo COMPLETO resolve de uma vez', false, String(e.message).slice(0, 140));
}

console.log(
  `  (${paths.length} paths + ${injetadas.length} raízes injetadas · ${alcance.size} assets alcançados)`
);
process.exit(r.fechar() ? 0 : 1);
