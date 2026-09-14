/**
 * Estágio 1g — o `path` de cada item resolve no grafo de manifests?
 *
 * O estágio 4 monta um tema de VERDADE, mas só a partir do config COERENTE, que
 * escolhe um modelo por slot (`id === '01'` quando existe). Dos 52 itens VTEX do
 * catálogo, ele alcança 30 — os outros 22 nunca passam pelo `yarn build`, e um
 * `path` que não resolve não derruba só aquele componente: derruba a geração do
 * tema INTEIRO, porque a fase RESOLVE do generator estoura antes de escrever
 * qualquer arquivo.
 *
 * Este estágio cobre os 52 de uma vez, sem clonar nem compilar nada: usa as
 * classes REAIS do generator (`AssetRegistry` + `DependencyResolver`) contra o
 * checkout local do starter. Se o `resolve` não estoura, o `manifest.json`
 * daquele componente e de TODO o grafo abaixo dele está completo.
 *
 * Não substitui o estágio 4 — ele prova que o tema COMPILA, isto prova que os
 * arquivos CHEGAM. São falhas diferentes.
 *
 * ⚠️ O que ele NÃO pega: dependência USADA no código e não DECLARADA no
 * manifest. O resolver só anda pelo que está declarado, então um import que
 * ninguém declarou é invisível aqui — e é justamente o erro que faz o arquivo
 * não chegar no destino. Para esse lado existe o `yarn alcance` do starter.
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { itens, relatorio, FASTSTORE_STARTER, GENERATOR } from './lib/util.mjs';

const r = relatorio('estágio 1g · grafo de manifests dos paths VTEX');

const imp = rel =>
  import(pathToFileURL(path.join(GENERATOR, rel)).href);

const { AssetRegistry } = await imp('src/platforms/faststore/core/AssetRegistry.js');
const { DependencyResolver } = await imp('src/platforms/faststore/core/DependencyResolver.js');

const registry = new AssetRegistry();
await registry.discover(FASTSTORE_STARTER);

const alvos = itens().filter(i => i.path);
r.ok('há item VTEX para conferir', alvos.length > 0, `${alvos.length}`);

const resolver = new DependencyResolver();
const alcance = new Set();

for (const item of alvos) {
  try {
    const g = resolver.resolve([item.path], registry);
    for (const id of g.ids) alcance.add(id);
    r.ok(`${item.component} → ${item.path}`, g.ids.size > 0, `${g.ids.size} assets`);
  } catch (e) {
    r.ok(`${item.component} → ${item.path}`, false, String(e.message).slice(0, 120));
  }
}

// Resolver TODOS de uma vez também: é assim que o generator monta um tema, e é
// onde um ID duplicado entre dois grafos apareceria.
try {
  const g = resolver.resolve(alvos.map(i => i.path), registry);
  r.ok(
    'o grafo COMPLETO resolve de uma vez',
    g.ids.size >= alcance.size,
    `${g.ids.size} assets · ${g.constants.size} constantes · ${g.scss.size} scss`
  );
} catch (e) {
  r.ok('o grafo COMPLETO resolve de uma vez', false, String(e.message).slice(0, 140));
}

console.log(`  (${alvos.length} paths · ${alcance.size} assets alcançados)`);
process.exit(r.fechar() ? 0 : 1);
