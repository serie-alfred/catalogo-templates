import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { GLOBAL_TEMPLATES, GENERATOR, E_TEMAS } from './util.mjs';

const PASTA = {
  global: 'Common',
  home: 'Home',
  category: 'Category',
  product: 'Product',
};

/**
 * Confere um config Tray/Wake contra o contrato do generator.
 *
 * O caminho é montado com o BALDE (global→Common, home→Home…), o `template` e o
 * `selection`. O campo `component` não participa — é rótulo do catálogo.
 */
export function conferirTrayWake(config, plataforma, r) {
  const raiz = config[plataforma.toLowerCase()];
  const entradas = [];
  for (const [balde, dir] of Object.entries(PASTA)) {
    for (const e of raiz[balde] ?? []) entradas.push({ ...e, balde, dir });
  }
  const semOrigem = entradas
    .filter(
      e =>
        !fs.existsSync(
          path.join(
            GLOBAL_TEMPLATES,
            plataforma,
            e.dir,
            `template_${e.template}`,
            e.selection
          )
        )
    )
    .map(e => `${e.balde}/${e.selection}@t${e.template}`);
  r.ok(
    `${plataforma}: ${entradas.length} entradas com origem real`,
    semOrigem.length === 0,
    semOrigem.join(' | ')
  );

  const keys = entradas.map(e => e.key);
  const dup = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
  r.ok(
    `${plataforma}: keys únicas`,
    dup.length === 0,
    `repetidas: ${dup.join(', ')}`
  );

  r.ok(
    `${plataforma}: bloco assets presente`,
    !!raiz.assets,
    Object.keys(raiz.assets ?? {}).join(',')
  );
  r.ok(
    `${plataforma}: 13 variáveis globais`,
    Object.keys(raiz.variables ?? {}).length === 13,
    `${Object.keys(raiz.variables ?? {}).length}`
  );
  if (plataforma === 'Wake')
    r.ok('Wake: wakeToken presente', !!config.wakeToken);
  return entradas;
}

/**
 * Confere o config faststore resolvendo o grafo com as classes REAIS do
 * generator — não uma réplica. Se o resolve estoura, o tema não monta.
 */
export function conferirFaststore(config, r) {
  const raiz = config.faststore;
  const baldes = ['global', 'home', 'category', 'product', 'overrides'];
  const entradas = baldes.flatMap(b =>
    (raiz[b] ?? []).map(e => ({ ...e, balde: b }))
  );
  const comps = [...new Set(entradas.map(e => e.component))];

  const keys = entradas.map(e => e.key);
  const dup = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
  r.ok(
    `VTEX: keys únicas (${keys.length})`,
    dup.length === 0,
    `repetidas: ${dup.join(', ')}`
  );
  r.ok(
    'VTEX: bloco assets presente',
    !!raiz.assets,
    Object.keys(raiz.assets ?? {}).join(',')
  );

  const script = `
    import { AssetRegistry } from './src/platforms/faststore/core/AssetRegistry.js';
    import { DependencyResolver } from './src/platforms/faststore/core/DependencyResolver.js';
    const reg = new AssetRegistry();
    const log = console.log; console.log = () => {};
    await reg.discover('../faststore.starter');
    console.log = log;
    const g = new DependencyResolver().resolve(${JSON.stringify(comps)}, reg);
    process.stdout.write(JSON.stringify({ ids: g.ids.size, fragments: [...g.ids].filter(i => i.startsWith('fragments/')) }));
  `;
  let saida;
  try {
    saida = JSON.parse(
      execFileSync(
        process.execPath,
        ['--input-type=module', '--eval', script],
        { cwd: GENERATOR, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
      )
    );
  } catch (e) {
    r.ok(
      `VTEX: ${comps.length} componentes resolvem o grafo real`,
      false,
      String(e.stderr ?? e).slice(0, 200)
    );
    return entradas;
  }
  r.ok(
    `VTEX: ${comps.length} componentes resolvem o grafo real (${saida.ids} assets)`,
    true
  );
  if (saida.fragments.length) {
    console.log(
      `  ℹ️  o grafo arrasta fragment: ${saida.fragments.join(', ')}`
    );
  }
  return entradas;
}
