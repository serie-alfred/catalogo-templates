import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
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
/**
 * Agrupa as entradas do config por um eixo de identidade e separa as cópias que
 * NÃO são representáveis no tema.
 *
 * `key` é campo do ITEM do catálogo, não da instância: duplicar seção é recurso
 * (`duplicateSection`), e as duas cópias saem com a MESMA key de propósito. A
 * unicidade que importa é entre ITENS, e quem a mede é o estágio 1 — lá está o
 * motivo (a Wake deduplica SCSS/JS por `key::arquivo`). Medir unicidade aqui, nas
 * ENTRADAS, era proibir o recurso: passava só porque nenhum seed duplicava.
 *
 * O que o tema não comporta é DIVERGÊNCIA entre as cópias: as três plataformas
 * injetam as `variables` num arquivo SCSS por COMPONENTE. Duas cópias com blocos
 * diferentes ⇒ um só chega, e a escolha some sem erro nenhum.
 *
 * @param entradas entradas do config.json
 * @param chaveDe  eixo de identidade — `template/selection` no Tray/Wake (o
 *                 caminho de origem onde a injeção acontece), `component` no
 *                 FastStore (o índice do `componentVarsMap` do generator)
 */
export function copiasDivergentes(entradas, chaveDe) {
  const grupos = new Map();
  for (const e of entradas) {
    const k = chaveDe(e);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(e);
  }
  const divergentes = [...grupos]
    .filter(
      ([, es]) =>
        new Set(es.map(e => JSON.stringify(e.variables ?? {}))).size > 1
    )
    .map(([k, es]) => `${k} \u00d7${es.length}`);
  const duplicadas = [...grupos].filter(([, es]) => es.length > 1).length;
  return { divergentes, duplicadas };
}

/**
 * Autoteste do detector acima. Sem ele a asserção de cópias seria vácua nos dois
 * ramos: o seed do estágio 3 só produz duplicata LEGÍTIMA (mesmas variables), e o
 * ramo que reprova nunca seria exercitado — que é exatamente como a asserção
 * anterior ("keys únicas") passou verde a vida toda sem nunca ver uma duplicata.
 */
export function autotesteCopias(r) {
  const k = e => e.component;
  const iguais = [
    { component: 'a/X', variables: { '--c': '#fff' } },
    { component: 'a/X', variables: { '--c': '#fff' } },
  ];
  const difs = [
    { component: 'a/X', variables: { '--c': '#fff' } },
    { component: 'a/X', variables: { '--c': '#000' } },
  ];
  const pintadaEIntocada = [
    { component: 'a/X', variables: { '--c': '#fff' } },
    { component: 'a/X' },
  ];
  const sozinha = [{ component: 'a/X' }, { component: 'b/Y' }];

  const A = copiasDivergentes(iguais, k);
  const B = copiasDivergentes(difs, k);
  const C = copiasDivergentes(pintadaEIntocada, k);
  const D = copiasDivergentes(sozinha, k);

  r.ok(
    'detector de cópias: duplicata com as MESMAS variables passa',
    A.divergentes.length === 0 && A.duplicadas === 1,
    JSON.stringify(A)
  );
  r.ok(
    'detector de cópias: variables diferentes REPROVA',
    B.divergentes.length === 1,
    JSON.stringify(B)
  );
  r.ok(
    'detector de cópias: cópia pintada + cópia intocada REPROVA',
    C.divergentes.length === 1,
    JSON.stringify(C)
  );
  r.ok(
    'detector de cópias: sem duplicata, nada a relatar',
    D.divergentes.length === 0 && D.duplicadas === 0,
    JSON.stringify(D)
  );
}

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

  const { divergentes, duplicadas } = copiasDivergentes(
    entradas,
    e => `${e.template}/${e.selection}`
  );
  r.ok(
    `${plataforma}: nenhuma cópia com variables divergentes${duplicadas ? ` (${duplicadas} duplicada${duplicadas > 1 ? 's' : ''})` : ''}`,
    divergentes.length === 0,
    `só um conjunto chega ao tema: ${divergentes.join(', ')}`
  );

  r.ok(
    `${plataforma}: bloco assets presente`,
    !!raiz.assets,
    Object.keys(raiz.assets ?? {}).join(',')
  );
  /*
   * 14 desde 16/09/2026 (commit 1c8a3dc): entrou `colorPrimaryBackgroundSafe`,
   * a cor primária de marca ajustada para continuar visível sobre branco —
   * `colorSafeOnWhite` devolve #000 quando a luminância passa de 220. Ela vira
   * o token `--background-primary-color-safe` em `themeStyle.ts`, e NÃO é peso
   * morto: 7 componentes do catálogo e 10 do starter a consomem.
   *
   * O número segue cravado de propósito. É ele que pega variável global
   * entrando ou saindo sem querer — o que o export manda para o tema do cliente
   * não pode mudar em silêncio.
   */
  const GLOBAIS_ESPERADAS = 14;
  r.ok(
    `${plataforma}: ${GLOBAIS_ESPERADAS} variáveis globais`,
    Object.keys(raiz.variables ?? {}).length === GLOBAIS_ESPERADAS,
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

  const { divergentes, duplicadas } = copiasDivergentes(
    entradas,
    e => e.component
  );
  r.ok(
    `VTEX: nenhuma cópia com variables divergentes (${entradas.length} entradas${duplicadas ? `, ${duplicadas} duplicada${duplicadas > 1 ? 's' : ''}` : ''})`,
    divergentes.length === 0,
    `só um conjunto chega ao tema: ${divergentes.join(', ')}`
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

/** Tira comentários: `.availableInstallments` citado em comentário não é uso. */
const semComentarios = txt =>
  txt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const lerRecursivo = (dir, ext = /\.tsx?$/) => {
  if (!fs.existsSync(dir)) return '';
  let txt = '';
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) txt += lerRecursivo(p, ext);
    else if (ext.test(e.name))
      txt += semComentarios(fs.readFileSync(p, 'utf8'));
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

/** Fecho transitivo por manifests, incluindo resolvers e typeDefs. */
function fechoCompleto(id, manifests) {
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
    const g = dp.graphql ?? {};
    fila.push(
      ...(g.resolvers ?? []).map(x => (x.includes('/') ? x : `resolvers/${x}`))
    );
    fila.push(
      ...(g.typeDefs ?? []).map(x => (x.includes('/') ? x : `typeDefs/${x}`))
    );
  }
  return vis;
}

/** Todos os manifests do starter, indexados por id, com a pasta de cada um. */
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

/** Um import relativo sem extensão resolve para algum arquivo em disco? */
const existeModulo = abs =>
  ['', '.ts', '.tsx', '.js', '.jsx'].some(
    ext => fs.existsSync(abs + ext) && fs.statSync(abs + ext).isFile()
  ) ||
  ['index.ts', 'index.tsx'].some(f => fs.existsSync(path.join(abs, f)));

/**
 * Todo import relativo aponta para algo que o grafo de `dependencies` alcança?
 *
 * É a forma geral do defeito: no starter todo import resolve, porque o repo
 * inteiro está em disco. No tema gerado só chega o que está DECLARADO, e um
 * import para um asset fora do grafo vira "Cannot find module" no build do tema
 * — depois de clonar, copiar e compilar. Aqui custa milissegundos.
 *
 * Import cujo alvo não tem manifest dono também é falha, e era o ponto cego
 * desta checagem: ela só olhava imports com dono. Em 22/09/2026 três utils
 * entraram no starter como arquivo solto (`src/utils/vtexImage.ts`) — o
 * AssetRegistry não os enxerga, o tema-base não os tem, e quatro componentes do
 * catálogo passaram a importar um módulo que nunca chega ao tema. Dois lugares
 * sem manifest são legítimos: `src/constants` (o AddConstant reconcilia) e
 * `src/sass`, que viaja por `dependencies.scss` — e por isso é conferido contra
 * ela.
 */
export function conferirImports(paths, r) {
  const manifests = lerManifests();
  const SRC = path.join(FASTSTORE_STARTER, 'src');
  const scssDe = fecho =>
    new Set(
      [...fecho].flatMap(i => manifests.get(i)?.dependencies?.scss ?? [])
    );
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

  // O alcance do catálogo: os paths e tudo que eles arrastam.
  const alcance = new Set();
  for (const p of paths)
    for (const id of fechoCompleto(p, manifests)) alcance.add(id);

  const falhas = new Set();
  for (const id of alcance) {
    const d = manifests.get(id);
    if (!d) continue;
    const fecho = fechoCompleto(id, manifests);
    for (const f of arquivosTs(d._dir)) {
      // sem comentários: `// import Image from "../Image"` (SmartImage01) não é uso
      const src = semComentarios(fs.readFileSync(f, 'utf8'));
      // aspas duplas também: os resolvers do starter importam assim
      for (const [, , imp] of src.matchAll(/from\s+(['"])(\.[^'"]+)\1/g)) {
        const alvo = path.normalize(path.resolve(path.dirname(f), imp));
        const dono = donoDe(alvo);
        if (dono) {
          if (dono !== id && !fecho.has(dono))
            falhas.add(`${id} importa ${dono} sem declarar`);
          continue;
        }
        const rel = path.relative(SRC, alvo);
        if (rel.startsWith('..') || rel.split(path.sep)[0] === 'constants')
          continue;
        if (rel.split(path.sep)[0] === 'sass') {
          const nome = path.basename(rel).replace(/\.module\.scss$/, '');
          if (!scssDe(fecho).has(nome))
            falhas.add(`${id} importa sass/${nome} sem declarar em scss`);
          continue;
        }
        if (existeModulo(alvo))
          falhas.add(`${id} importa src/${rel}, arquivo solto sem manifest.json`);
      }
    }
  }
  r.ok(
    `${alcance.size} assets no alcance do catálogo: todo import está declarado`,
    falhas.size === 0,
    [...falhas].join(' | ')
  );
  return [...falhas];
}

/**
 * A substituição de spot é uma troca TEXTUAL do nome do card dentro da vitrine
 * (`AssetCopier.copyDirWithSubstitution`, guiada por `usesSpot`). O catálogo
 * oferece card e vitrine como escolhas independentes, então qualquer par é
 * possível — e o par só compila se o card aceitar tudo o que a vitrine passa e
 * o tipo de `product` for o mesmo.
 *
 * Isto mede os dois, estaticamente. Sem esta checagem o par errado só aparece
 * no `next build` do tema, depois de clonar e compilar.
 */
/**
 * Limitações medidas e aceitas da substituição de spot. O funil não as trata como
 * falha — trata como contrato: mudou a lista, alguém mexeu na compatibilidade e
 * precisa saber.
 *
 * A família 07 é fechada. O `ProductCard07` recebe
 * `ProductCard07Product`, um shape próprio montado por `productToCard07(node)`, e
 * não o `Product` do core que todas as outras vitrines entregam. Abrir isso é
 * redesenhar a família, não declarar uma flag.
 */
const PARES_IMPOSSIVEIS = new Set([
  '01×07',
  '03×07',
  '04×07',
  '05×07',
  '06×07',
]);
/** Vitrines sem `usesSpot`: a escolha de card do cliente não as alcança. */
const SEM_SUBSTITUICAO = new Set(['07']);

const igual = (a, b) => a.length === b.size && a.every(x => b.has(x));

/**
 * O catálogo oferece card e vitrine como escolhas independentes; o generator
 * troca o card dentro da vitrine com um replaceAll de texto. A regra de quando
 * isso compila mora no próprio generator (SubstitutionChecker) — aqui só medimos
 * a matriz que o catálogo torna alcançável, para não duplicar a regra.
 */
export async function conferirParesCardVitrine(vtexPaths, r) {
  const { checarSubstituicao } = await import(
    pathToFileURL(
      path.join(
        GENERATOR,
        'src/platforms/faststore/services/SubstitutionChecker.js'
      )
    ).href
  );
  const raiz = path.join(FASTSTORE_STARTER, 'src/components');

  const sufixo = p => /(\d+)$/.exec(p)?.[1] ?? null;
  const vitrines = vtexPaths
    .filter(p => /^organisms\/ProductShelfCustom\d+$/.test(p))
    .map(p => ({ p, n: sufixo(p) }));
  const cards = vtexPaths
    .filter(p => /^molecules\/ProductCard\d+$/.test(p))
    .map(p => ({ p, n: sufixo(p) }));

  if (!vitrines.length || !cards.length) {
    r.ok('matriz vitrine×card: catálogo não oferece os dois lados', true);
    return [];
  }

  // Vitrine sem `usesSpot` não é substituída: o cliente escolhe um card e recebe
  // outro, sem erro em lugar nenhum. Não é falha de compilação — é escolha ignorada.
  const ignoram = [];
  const substituem = [];
  for (const v of vitrines) {
    const manifest = path.join(raiz, v.p, 'manifest.json');
    const usesSpot =
      fs.existsSync(manifest) &&
      JSON.parse(fs.readFileSync(manifest, 'utf8')).usesSpot === true;
    (usesSpot ? substituem : ignoram).push(v);
  }
  const ignoramEsperado = igual(
    ignoram.map(v => v.n),
    SEM_SUBSTITUICAO
  );
  r.ok(
    `só a família 07 ignora a escolha de card (${ignoram.map(v => v.n).join(', ') || 'nenhuma'})`,
    ignoramEsperado,
    `esperado ${[...SEM_SUBSTITUICAO].join(', ')}, medido ${ignoram.map(v => v.n).join(', ')}`
  );

  const incompativeis = [];
  let total = 0;
  for (const v of substituem) {
    for (const c of cards) {
      if (c.n === v.n) continue;
      total++;
      const subs = Object.fromEntries(
        cards
          .filter(x => x.n !== c.n)
          .map(x => [`ProductCard${x.n}`, `ProductCard${c.n}`])
      );
      const problemas = checarSubstituicao(path.join(raiz, v.p), subs);
      if (problemas.length) incompativeis.push([`${v.n}×${c.n}`, problemas[0]]);
    }
  }
  const novos = incompativeis.filter(([par]) => !PARES_IMPOSSIVEIS.has(par));
  const sumiram = [...PARES_IMPOSSIVEIS].filter(
    par => !incompativeis.some(([p]) => p === par)
  );
  r.ok(
    `${total - incompativeis.length}/${total} pares vitrine×card compilam; ` +
      `os ${PARES_IMPOSSIVEIS.size} restantes são a limitação conhecida do card 07`,
    novos.length === 0 && sumiram.length === 0,
    [
      ...novos.map(([par, motivo]) => `NOVO: ${par} — ${motivo}`),
      ...sumiram.map(
        par => `${par} passou a compilar; tire de PARES_IMPOSSIVEIS`
      ),
    ].join(' | ')
  );
  return incompativeis;
}

/**
 * O SCSS que o gerador copia precisa compilar nas DUAS versões do FastStore ao
 * mesmo tempo: o starter está na v4, e o tema do cliente é montado sobre a branch
 * `main` do mesmo repo, que está na v3. Não existe forma única que sirva às duas
 * para os mixins do `@faststore/ui`:
 *
 *   v3 — o core injeta `@import ".../custom-mixins.scss"` em todo SCSS pelo
 *        `additionalData` do sass-loader. Isso vira a linha 1, e qualquer `@use`
 *        do arquivo cai para a linha 2: «@use rules must be written before any
 *        other rules». Em compensação, `media()` existe global.
 *   v4 — o `additionalData` sumiu. `media()` global não existe mais, e o mixin só
 *        vem por `@use "@faststore/ui/.../utilities" as u`.
 *
 * Ou seja: `@use` quebra a v3 e `media()` sem namespace quebra a v4. A saída é não
 * usar nenhum dos dois — `@media` literal compila igual nas duas.
 */
export function conferirScssPortavel(vtexPaths, r) {
  const raiz = path.join(FASTSTORE_STARTER, 'src');
  const problemas = [];

  const andar = dir => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) andar(p);
      else if (e.name.endsWith('.scss')) {
        const src = semComentarios(fs.readFileSync(p, 'utf8'));
        const rel = path.relative(raiz, p);
        if (/^@use\s/m.test(src)) problemas.push(`${rel}: @use quebra na v3`);
        const global =
          /(?:^|\s)@include\s+(media|layout-content|truncate-title)\b/.exec(
            src
          );
        if (global)
          problemas.push(
            `${rel}: @include ${global[1]} sem namespace quebra na v4`
          );
      }
    }
  };
  // O alcance inteiro, não só os paths do catálogo: quem quebra costuma ser uma
  // dependência (NavbarIcons01 é do Header01, não item de catálogo).
  const manifests = lerManifests();
  const alcance = new Set();
  for (const p of vtexPaths)
    for (const id of fechoCompleto(p, manifests)) alcance.add(id);
  for (const id of alcance) {
    const d = manifests.get(id);
    if (d) andar(d._dir);
  }
  andar(path.join(raiz, 'sass'));
  andar(path.join(raiz, 'themes'));

  r.ok(
    'o SCSS que chega ao tema compila na v3 e na v4',
    problemas.length === 0,
    problemas.join(' | ')
  );
  return problemas;
}

/**
 * Os três alertas que a apuração paralela levantou, como invariante.
 *
 * Eles foram conferidos à mão uma vez e a conferência evaporou — igual aos logs
 * que moravam em /tmp. Um alerta que depende de alguém lembrar de reconferir
 * não é proteção nenhuma.
 */
export async function conferirAlertasDaApuracao(r) {
  const STARTER = FASTSTORE_STARTER;
  const GERADOR = GENERATOR;

  // ── 1. Bug 5: o `:root` do starter não pode vencer o bloco gerado ─────────
  // O cenário do alerta é o dia em que o `custom-theme.scss` da `base/faststore`
  // — que tem BEGIN órfão e um `:root` hardcoded — chegar à `main`, que é o
  // tema-base do cliente. Hoje o estágio 4 prova a forma ATUAL; isto prova o
  // cenário, rodando o gerador real contra o arquivo real da prateleira.
  const scssDaPrateleira = path.join(STARTER, 'src/themes/custom-theme.scss');
  if (!fs.existsSync(scssDaPrateleira)) {
    r.ok(
      'bug 5: o SCSS da prateleira existe para o ensaio',
      false,
      scssDaPrateleira
    );
  } else {
    const { VariablesGenerator } = await import(
      pathToFileURL(
        path.join(
          GERADOR,
          'src/platforms/faststore/services/VariablesGenerator.js'
        )
      ).href
    );
    const ensaiar = async conteudo => {
      const palco = fs.mkdtempSync(path.join(os.tmpdir(), 'funil-bug5-'));
      const alvo = path.join(palco, 'src/themes');
      fs.mkdirSync(alvo, { recursive: true });
      fs.writeFileSync(path.join(alvo, 'custom-theme.scss'), conteudo);
      await new VariablesGenerator().write(palco, {
        colorPrimaryBackground: '#abcdef',
      });
      const saida = fs.readFileSync(
        path.join(alvo, 'custom-theme.scss'),
        'utf8'
      );
      fs.rmSync(palco, { recursive: true, force: true });
      return {
        saida,
        // `/^:root/gm` NÃO serve: quando o conserto falha, o marcador órfão é
        // removido junto com as quebras de linha antes dele e o `:root`
        // obsoleto cola no `}` anterior (`}:root {`). A âncora de início de
        // linha deixa de casar e a asserção passa COM o bug presente — foi
        // exatamente o que aconteceu na primeira versão disto.
        nRoots: (saida.match(/:root\s*\{/g) ?? []).length,
        ultimoRoot: saida.lastIndexOf(':root'),
        inicioGerado: saida.lastIndexOf('/* BEGIN:custom-variables */'),
      };
    };

    const conferir = (rotulo, res) => {
      r.ok(
        `bug 5 · ${rotulo}: sobra UM \`:root\` só`,
        res.nRoots === 1,
        `${res.nRoots} blocos :root na saída`
      );
      r.ok(
        `bug 5 · ${rotulo}: e é o do editor, vencendo a cascata`,
        res.inicioGerado !== -1 && res.ultimoRoot > res.inicioGerado,
        `BEGIN em ${res.inicioGerado}, último :root em ${res.ultimoRoot}`
      );
      r.ok(
        `bug 5 · ${rotulo}: a cor escolhida sobrevive`,
        res.saida.includes('#abcdef')
      );
    };

    // (a) O arquivo REAL da prateleira, como está hoje. Guarda de regressão da
    //     forma atual — hoje ele tem o par de sentinelas completo.
    conferir(
      'SCSS real da prateleira',
      await ensaiar(fs.readFileSync(scssDaPrateleira, 'utf8'))
    );

    // (b) O CENÁRIO do alerta, construído: BEGIN órfão (sem END) seguido de um
    //     `:root` hardcoded. Não adianta esperar que o repo contenha essa forma
    //     — ela foi consertada, e um ensaio que depende disso passa por acaso.
    //     Foi o que aconteceu na primeira versão desta asserção: desliguei o
    //     tratamento do órfão no gerador e ela continuou verde, porque estava
    //     exercitando o ramo do par bem-formado.
    conferir(
      'BEGIN órfão + :root do starter',
      await ensaiar(
        [
          '.theme {',
          '  --fs-color-main-2: #0366dd;',
          '}',
          '',
          '/* BEGIN:custom-variables */',
          ':root {',
          "  --font-primary: 'Roboto', sans-serif;",
          '  --background-primary-color: #682A77;',
          '}',
          '',
          '/* BEGIN:component-theme-imports */',
          '/* END:component-theme-imports */',
          '',
        ].join('\n')
      )
    );
  }

  // ── 2. `vtex content` vem de um plugin que o wrapper tem que garantir ─────
  const pkg = JSON.parse(
    fs.readFileSync(path.join(STARTER, 'package.json'), 'utf8')
  );
  const cmsSync = pkg.scripts?.['cms-sync'] ?? '';
  r.ok(
    'o `cms-sync` do starter passa pelo guarda de plugins do toolbelt',
    /ensure-vtex-plugins/.test(cmsSync),
    cmsSync
  );
  const guarda = path.join(STARTER, 'scripts/ensure-vtex-plugins.mjs');
  const fonte = fs.existsSync(guarda) ? fs.readFileSync(guarda, 'utf8') : '';
  r.ok(
    'e o guarda cobre os DOIS plugins (`cms` e `content`)',
    /@vtex\/cli-plugin-cms/.test(fonte) &&
      /@vtex\/cli-plugin-content/.test(fonte),
    fonte ? 'guarda presente' : 'scripts/ensure-vtex-plugins.mjs não existe'
  );
}
