import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { GLOBAL_TEMPLATES, GENERATOR, FASTSTORE_STARTER } from './util.mjs';

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

/**
 * Campos que os typeDefs DO PROJETO acrescentam ao schema da VTEX, e o fragment
 * que os traz na query. Não existem no schema nativo: se o fragment não chegar
 * ao tema, o codegen gera o tipo sem o campo e o `next build` do tema morre em
 * "Property X does not exist".
 *
 * Aqui isso é invisível — o starter tem os quatro fragments em disco, então o
 * codegen dele sempre vê o campo. O generator copia só o que o grafo de
 * `dependencies` alcança, e é lá que a falta aparece.
 */
const CAMPO_PROVEDOR = {
  availableInstallments: [
    'fragments/ServerProduct',
    'fragments/ClientManyProducts',
  ],
  releaseDate: ['fragments/ServerProduct'],
  descriptionBanner: ['fragments/ServerProduct'],
  suggestionProducts: ['fragments/ClientSearchSuggestions'],
};

/** Fecho transitivo de dependências de um asset, pelos manifests. */
function fechoDeps(id, manifests) {
  const pref = {
    hooks: 'hooks/',
    fragments: 'fragments/',
    typings: 'typings/',
    utils: 'utils/',
  };
  const vis = new Set();
  const fila = [id];
  while (fila.length) {
    const i = fila.pop();
    if (vis.has(i) || !manifests.has(i)) continue;
    vis.add(i);
    const dp = manifests.get(i).dependencies ?? {};
    fila.push(...(dp.components ?? []));
    for (const [k, p] of Object.entries(pref)) {
      fila.push(...(dp[k] ?? []).map(x => (x.includes('/') ? x : p + x)));
    }
  }
  return vis;
}

const lerRecursivo = (dir, ext = /\.tsx?$/) => {
  if (!fs.existsSync(dir)) return '';
  let txt = '';
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) txt += lerRecursivo(p, ext);
    else if (ext.test(e.name)) txt += fs.readFileSync(p, 'utf8');
  }
  return txt;
};

/**
 * Todo `path` VTEX do catálogo consegue se sustentar sozinho no tema gerado?
 * Roda em milissegundos e pega antes do build o que hoje só aparece depois de
 * clonar, copiar e compilar.
 */
export function conferirFragmentos(paths, r) {
  const raiz = path.join(FASTSTORE_STARTER, 'src');
  const manifests = new Map();
  (function varrer(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) varrer(p);
      else if (e.name === 'manifest.json') {
        const m = JSON.parse(fs.readFileSync(p, 'utf8'));
        manifests.set(m.id, m);
      }
    }
  })(raiz);

  const falhas = [];
  for (const id of paths) {
    const fecho = fechoDeps(id, manifests);
    let txt = lerRecursivo(path.join(raiz, 'components', id));
    for (const dep of fecho) {
      if (dep.startsWith('hooks/') || dep.startsWith('utils/'))
        txt += lerRecursivo(path.join(raiz, dep));
    }
    for (const [campo, provedores] of Object.entries(CAMPO_PROVEDOR)) {
      if (!new RegExp(`\\.${campo}\\b`).test(txt)) continue;
      if (provedores.some(p => fecho.has(p))) continue;
      falhas.push(
        `${id} usa .${campo} sem ${provedores.map(p => p.split('/')[1]).join(' nem ')}`
      );
    }
  }
  r.ok(
    `${paths.length} paths VTEX se sustentam sozinhos no tema`,
    falhas.length === 0,
    falhas.join(' | ')
  );
  return falhas;
}
