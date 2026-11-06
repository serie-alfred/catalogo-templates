/**
 * Estágio 4 — tema Nuvemshop montado, sem a loja.
 *
 * A Nuvemshop não tem localhost (o Twig só roda na plataforma), mas o tema por
 * seções valida offline. Então este estágio faz o que a Tray e a Wake nunca
 * tiveram: roda o generator de verdade, com `--local` (nada sai daqui: sem
 * `--push`, sem `--deploy`), e valida o tema que ele escreveu.
 *
 *   1. Um config por item do catálogo que declara a Nuvemshop, no formato que o
 *      `buildConfigJson` exporta, com MARCADORES de Nível 1 em toda variável do
 *      `variablesSchema` do item. Cada marcador tem de chegar ao tema: nos
 *      `settings` da instância (`templates/**`, §2.1 C do contrato) ou, quando a
 *      seção não tem o setting, no CSS do componente (o fallback do generator).
 *   2. Um config com a família inteira, UM POR FAMÍLIA (o `template` dos itens:
 *      duas famílias num tema passam das 25 seções por template da plataforma) —
 *      o exportado pelo estágio 3 quando a flag está ligada (a perna /gerador →
 *      config → tema), partido por família, senão o montado aqui com os mesmos
 *      itens — e o build do `theme-src/` de cada um: a classe-raiz e as
 *      variáveis de cada CSS de seção têm de estar no `app-serie.css`, e o
 *      marcador `data-<raiz>-pronto` de cada JS no `app-serie.js`.
 *   3. Cada tema montado passa pelo validador (abaixo), com 0 erros.
 *   4. Controle negativo: numa CÓPIA do tema da família, um `{% schema %}`
 *      quebrado tem de reprovar no mesmo validador. Sem isso, um caminho errado
 *      para um script que sempre sai 0 daria verde.
 *
 * O validador. O `nuvemshop theme check` da CLI não roda sem login: ele pede à
 * API da loja que valide os arquivos que DIFEREM do tema remoto (precisa do
 * `--theme-id` ou do `.nuvem`, e de token), então não é validação offline. O que
 * valida offline é o `validate-theme.mjs` da skill `seriea-nuvemshop-migration`
 * (plugin privado da agência). Este repo é público e não pode vendorizá-lo, e
 * adivinhar onde o plugin está instalado acoplaria o funil ao layout de uma
 * máquina. Por isso o caminho vem de uma variável explícita,
 * `NUVEMSHOP_VALIDADOR`, e o estágio imprime o sha256 do arquivo usado. Sem ela,
 * o estágio REPROVA — nunca dá verde sem validar. Ele nunca passa `--cli` ao
 * validador (seria o `theme check` contra a loja).
 *
 * De onde o generator clona: do default dele (GitHub, `main`) ou dos overrides
 * `NUVEMSHOP_THEME_BASE_REPO`/`_BRANCH` e `GLOBAL_COMPONENTS_REPO`/`_BRANCH`,
 * que o `funil.mjs` registra como variáveis que DESVIAM. Clone enxerga commit,
 * não working tree: override `file://` com checkout sujo reprova.
 *
 * Recurso exclusivo: o generator irmão é UM só — `tema-base-nuvemshop/` e
 * `repo-temp/` são reclonados a cada rodada. O `config.json` versionado dele não
 * é tocado (o config vai por `GENERATOR_CONFIG`). `FUNIL_TEMA_BUILD=0` pula o
 * build do `theme-src/` (execução parcial, como no estágio 4 da FastStore).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import {
  GENERATOR,
  GLOBAL_TEMPLATES,
  SAIDA,
  itens,
  relatorio,
} from './lib/util.mjs';
import { NUVEMSHOP_LIGADA } from '../../src/types/platform.ts';
import { TEMA_INICIAL, colorSafeOnWhite } from '../../src/utils/themeStyle.ts';

const r = relatorio('Estágio 4 — tema Nuvemshop montado (sem a loja)');
const PASTA = path.join(SAIDA, 'nuvemshop');
const TEMA = path.join(GENERATOR, 'tema-base-nuvemshop');
const COMPONENTES = path.join(GENERATOR, 'repo-temp');
fs.rmSync(PASTA, { recursive: true, force: true });
fs.mkdirSync(PASTA, { recursive: true });

const ler = p => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const git = (dir, ...args) =>
  spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).stdout?.trim() ??
  '';
const fim = () => process.exit(r.fechar() ? 0 : 1);

// ── o que montar ─────────────────────────────────────────────────────────────
const marcados = itens().filter(i => i.platforms.includes('Nuvemshop'));
if (
  !r.ok(
    `${marcados.length} item(ns) do catálogo declaram a Nuvemshop`,
    marcados.length > 0,
    'nada a montar: um estágio sem item passaria por vacuidade'
  )
)
  fim();

// ── a trilha do generator ────────────────────────────────────────────────────
const TRILHA = path.join(GENERATOR, 'src/platforms/nuvemshop');
if (
  !r.ok(
    'o generator irmão tem a trilha nuvemshop',
    fs.existsSync(path.join(TRILHA, 'index.js')),
    `${path.relative(SAIDA, TRILHA)} não existe — o checkout do generator ainda não tem a trilha`
  )
)
  fim();
const doGenerator = rel =>
  import(pathToFileURL(path.join(GENERATOR, rel)).href);
// As convenções do próprio generator (§2.1 do contrato), não uma cópia: o id do
// setting, o `type` da seção, para onde vai cada balde.
const conv = await doGenerator('src/platforms/nuvemshop/convencoes.js');
const { comandosDoBuild } = await doGenerator(
  'src/platforms/nuvemshop/services/build.js'
);
// Lidas com o env DESTE processo, que é o que o generator filho herda.
const origem = await doGenerator('src/constants/config.js');
const FONTES = [
  [
    'tema-base',
    origem.NUVEMSHOP_THEME_BASE_REPO_URL,
    origem.NUVEMSHOP_THEME_BASE_REPO_BRANCH,
  ],
  [
    'componentes',
    origem.GLOBAL_COMPONENTS_REPO_URL,
    origem.GLOBAL_COMPONENTS_REPO_BRANCH ?? 'main',
  ],
];
for (const [nome, url, branch] of FONTES) {
  console.log(`  ℹ️  ${nome}: ${url} @ ${branch}`);
  if (!url.startsWith('file://')) continue;
  const local = url.replace('file://', '');
  const sujo = git(local, 'status', '--porcelain');
  r.ok(
    `${nome}: checkout local sem alteração pendente`,
    sujo === '',
    `${sujo.split('\n').length} arquivo(s) fora do commit — o clone não os veria`
  );
}

// ── o validador ──────────────────────────────────────────────────────────────
const VALIDADOR = process.env.NUVEMSHOP_VALIDADOR ?? '';
const temValidador = VALIDADOR !== '' && fs.existsSync(VALIDADOR);
r.ok(
  'validador de tema disponível (NUVEMSHOP_VALIDADOR)',
  temValidador,
  VALIDADOR
    ? `${VALIDADOR} não existe`
    : 'defina NUVEMSHOP_VALIDADOR=<caminho do validate-theme.mjs da skill seriea-nuvemshop-migration>; sem ele o tema não é validado e o estágio não pode passar'
);
if (temValidador) {
  const sha = crypto
    .createHash('sha256')
    .update(fs.readFileSync(VALIDADOR))
    .digest('hex');
  console.log(`  ℹ️  validador: ${VALIDADOR} · sha256 ${sha.slice(0, 16)}`);
}
/** `{ ok, erros, avisos, achados, motivo }` do validador no tema `dir`. Nunca `--cli`. */
function validar(dir) {
  if (!temValidador) return { ok: false, motivo: 'sem validador', achados: [] };
  const res = spawnSync(process.execPath, [VALIDADOR, dir, '--json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  let j = null;
  try {
    j = JSON.parse(res.stdout);
  } catch {
    /* saída que não é JSON: cai no motivo abaixo */
  }
  if (!j?.resumo)
    return {
      ok: false,
      motivo: `exit ${res.status}: ${(j?.erro ?? res.stderr ?? '').trim().slice(0, 200) || 'saída sem JSON'}`,
      achados: [],
    };
  const erros = j.achados.filter(a => a.nivel === 'erro');
  return {
    ok: res.status === 0 && j.familia === 'sectionable' && j.resumo.erros === 0,
    erros: j.resumo.erros,
    avisos: j.resumo.avisos,
    achados: j.achados,
    motivo:
      j.familia !== 'sectionable'
        ? `família ${j.familia}, não "por seções"`
        : erros
            .slice(0, 4)
            .map(
              a =>
                `[${a.regra}] ${a.arquivo}${a.linha ? `:${a.linha}` : ''} ${a.msg.slice(0, 120)}`
            )
            .join(' | '),
  };
}

// ── o config, no formato do export ───────────────────────────────────────────
// As 14 globais como uma aba nova as exporta (`variaveisTrayWake` no hook):
// os valores iniciais do editor, e a `Safe` derivada pela mesma função.
const GLOBAIS = {
  ...TEMA_INICIAL.fonts,
  ...TEMA_INICIAL.colors,
  colorPrimaryBackgroundSafe: colorSafeOnWhite(
    TEMA_INICIAL.colors.colorPrimaryBackground
  ),
};
const baldeDe = i => (i.pagina[0] === 'common' ? 'global' : i.pagina[0]);
/** Uma entrada como o `mapToConfig` do `buildConfigJson` a escreve. */
const entrada = (i, variables) => ({
  template: i.template,
  selection: i.selection,
  title: i.title,
  key: i.key,
  pagina: i.pagina,
  ...(variables && Object.keys(variables).length ? { variables } : {}),
});
const configCom = entradas => {
  const ns = {
    global: [],
    variables: GLOBAIS,
    assets: { logo: '', favicon: '', ogImage: '' },
  };
  for (const [i, v] of entradas) (ns[baldeDe(i)] ??= []).push(entrada(i, v));
  return { platform: 'nuvemshop', nuvemshop: ns };
};

/*
 * O breadcrumb não tem página própria: o generator o põe no topo das páginas que
 * o config MONTA (§2.1 E), e sozinho ele não cairia em lugar nenhum. Vai com a
 * PLP da mesma família, sem variáveis.
 */
const CONTEXTO = { breadcrumb: 'category-main' };
const contextoDe = i =>
  CONTEXTO[i.selection]
    ? (marcados.find(
        x => x.template === i.template && x.selection === CONTEXTO[i.selection]
      ) ?? null)
    : null;

/** Onde a instância do item fica no tema (`template: null` = snippet, sem instância). */
function destino(i) {
  const tipo = conv.tipoDaSecao(i.selection, i.template);
  const balde = baldeDe(i);
  if (balde !== 'global')
    return { tipo, template: conv.TEMPLATE_DA_PAGINA[balde] };
  const d = conv.DESTINO_GLOBAL[i.selection];
  if (d?.tipo === 'grupo') return { tipo, template: d.template };
  if (d?.tipo === 'topo') {
    const ctx = contextoDe(i);
    return {
      tipo,
      template: ctx ? conv.TEMPLATE_DA_PAGINA[baldeDe(ctx)] : null,
    };
  }
  return { tipo, template: null };
}

/** Marcador por variável: cor `#0e0fNN`, fonte "Funil Fonte NN" (o setting guarda só a família). */
function marcadores(i) {
  let n = 0;
  return (i.variablesSchema ?? []).map(v => {
    const nn = String(++n).padStart(2, '0');
    const familia = `Funil Fonte ${nn}`;
    return v.type === 'font'
      ? {
          cssVar: v.cssVar,
          valor: `'${familia}', sans-serif`,
          esperado: familia,
        }
      : { cssVar: v.cssVar, valor: `#0e0f${nn}`, esperado: `#0e0f${nn}` };
  });
}

// ── o generator ──────────────────────────────────────────────────────────────
const commits = { tema: new Set(), componentes: new Set() };
function gerar(config, rotulo) {
  const arq = path.join(PASTA, `config-${rotulo}.json`);
  fs.writeFileSync(arq, JSON.stringify(config, null, 2));
  // `node src/index.js`, com o MESMO node do funil (o `yarn start` acharia o do
  // PATH). Só `--local`: sem `--push` nem `--deploy`, nada sai daqui.
  const res = spawnSync(process.execPath, ['src/index.js', '--local'], {
    cwd: GENERATOR,
    env: { ...process.env, GENERATOR_CONFIG: arq },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  });
  const log = `${res.stdout ?? ''}${res.stderr ?? ''}`;
  fs.writeFileSync(path.join(PASTA, `${rotulo}.log`), log);
  if (res.status === 0) {
    commits.tema.add(git(TEMA, 'rev-parse', 'HEAD'));
    commits.componentes.add(git(COMPONENTES, 'rev-parse', 'HEAD'));
  }
  const avisos = [...log.matchAll(/⚠️ {2}(.+)/g)].map(m => m[1].trim());
  const erro =
    log.match(/❌ (VALIDATE reprovou[^\n]*|[^\n]+)/)?.[1] ??
    log.trim().split('\n').slice(-2).join(' ');
  return {
    ok: res.status === 0,
    avisos,
    erro,
    log: path.relative(SAIDA, path.join(PASTA, `${rotulo}.log`)),
  };
}

// ── 1. item a item ───────────────────────────────────────────────────────────
// `FUNIL_NUVEMSHOP_SO=banner-main,showcase` restringe ESTE laço: serve para iterar, e
// a execução completa do funil o recusa. Cada termo é uma `selection` (todas as
// famílias que a têm), uma `selection-NN` (só a da família NN) ou um número de
// família (`10`: os itens dela). A família inteira (passo 2) é montada para cada
// família que sobrou no laço, sempre com todos os itens dela.
const SO = (process.env.FUNIL_NUVEMSHOP_SO ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const NN = x => String(x.template).padStart(2, '0');
const noSo = i =>
  SO.some(
    s =>
      s === i.selection ||
      s === `${i.selection}-${NN(i)}` ||
      (/^\d+$/.test(s) && Number(s) === Number(i.template))
  );
const doLaco = SO.length ? marcados.filter(noSo) : marcados;
if (SO.length)
  r.ok(
    `FUNIL_NUVEMSHOP_SO: ${doLaco.length} de ${marcados.length} itens no laço (execução parcial)`,
    doLaco.length > 0,
    `nenhum item marcado tem selection em ${SO.join(', ')}`
  );
console.log(
  `  ⏳ ${doLaco.length} tema(s), um por item (o generator reclona a cada rodada — minutos)`
);
for (const i of doLaco) {
  const rot = `${i.selection}-${NN(i)}`;
  try {
    const marcas = marcadores(i);
    const ctx = contextoDe(i);
    if (
      CONTEXTO[i.selection] &&
      !r.ok(
        `${rot}: a família tem ${CONTEXTO[i.selection]} para recebê-lo`,
        ctx
      )
    )
      continue;
    const config = configCom([
      [i, Object.fromEntries(marcas.map(m => [m.cssVar, m.valor]))],
      ...(ctx ? [[ctx, null]] : []),
    ]);
    const g = gerar(config, rot);
    if (
      !r.ok(`${rot}: o generator monta (--local)`, g.ok, `${g.erro} — ${g.log}`)
    )
      continue;
    for (const a of g.avisos) console.log(`     ⚠️  ${a}`);

    // Nível 1: cada marcador nos settings da instância ou no CSS do componente.
    const { tipo, template } = destino(i);
    const doc = template
      ? JSON.parse(ler(path.join(TEMA, template)) || '{}')
      : null;
    const inst = doc?.sections?.[tipo];
    if (template)
      r.ok(
        `${rot}: a instância "${tipo}" está em ${template} e no order`,
        !!inst && (doc.order ?? []).includes(tipo),
        `sections: ${Object.keys(doc?.sections ?? {}).join(', ') || '—'} · order: ${(doc?.order ?? []).join(', ') || '—'}`
      );
    const css = ler(path.join(TEMA, conv.DESTINO_DO_CSS, `${tipo}.css`));
    let noSetting = 0;
    let noCss = 0;
    const perdidos = [];
    for (const m of marcas) {
      if (inst?.settings?.[conv.settingIdDaVariavel(m.cssVar)] === m.esperado)
        noSetting++;
      else if (css.includes(m.esperado)) noCss++;
      else perdidos.push(m.cssVar);
    }
    if (marcas.length)
      r.ok(
        `${rot}: ${marcas.length} variável(is) de Nível 1 chegam ao tema (${noSetting} nos settings da instância, ${noCss} no CSS do componente)`,
        perdidos.length === 0,
        `não chegaram: ${perdidos.join(', ')}`
      );
    else
      console.log(
        `     ℹ️  ${rot}: sem variablesSchema — nada de Nível 1 a conferir`
      );

    const v = validar(TEMA);
    r.ok(
      `${rot}: o tema montado valida (${v.erros ?? '?'} erro(s), ${v.avisos ?? '?'} aviso(s))`,
      v.ok,
      v.motivo
    );
    for (const a of v.achados.filter(
      a => a.nivel === 'aviso' && `${a.arquivo} ${a.msg}`.includes(tipo)
    ))
      console.log(`     ⚠️  [${a.regra}] ${a.arquivo} ${a.msg.slice(0, 140)}`);
  } catch (e) {
    // Varredura não é tudo-ou-nada: a exceção de um item é a falha DELE.
    r.ok(`${rot}: estourou`, false, e.message);
  }
}

// ── 2. a família inteira, um tema por família ───────────────────────────────
// Com a flag, o config é o que o /gerador exportou no estágio 3: é a perna
// editor → config → tema. Sem a flag, o estágio 3 não exporta a Nuvemshop, e o
// config sai daqui com os mesmos itens. Nos dois casos ele é partido por família
// (o `template` de cada entrada): duas famílias num tema só dão dois headers, dois
// cards e 26 seções na home, e o generator recusa mais de 25 por template — um
// limite da plataforma, não do teste. Cada família que sobrou no laço vira um tema.
const EXPORTADO = path.join(SAIDA, 'config-Nuvemshop.json');
let familia = null;
if (NUVEMSHOP_LIGADA) {
  if (
    r.ok(
      'flag ligada: o config exportado pelo estágio 3 existe',
      fs.existsSync(EXPORTADO),
      'rode o estágio 3 com a mesma flag'
    )
  ) {
    familia = JSON.parse(ler(EXPORTADO));
    const chaves = new Set(
      Object.values(familia.nuvemshop ?? {})
        .filter(Array.isArray)
        .flat()
        .map(e => e.key)
    );
    const faltam = marcados
      .filter(i => !chaves.has(i.key))
      .map(i => i.component);
    r.ok(
      `o config exportado traz os ${marcados.length} itens marcados`,
      faltam.length === 0,
      `faltam: ${faltam.join(', ')}`
    );
    console.log(
      `  ℹ️  família inteira: o config exportado (${new Date(fs.statSync(EXPORTADO).mtime).toISOString()})`
    );
  }
} else {
  familia = configCom(marcados.map(i => [i, null]));
  console.log(
    '  ℹ️  família inteira: config montado do catálogo (sem a flag o estágio 3 não exporta a Nuvemshop)'
  );
}

/** O config só com as entradas da família `nn` (globais e assets ficam). */
const soDaFamilia = (cfg, nn) => ({
  ...cfg,
  nuvemshop: Object.fromEntries(
    Object.entries(cfg.nuvemshop ?? {}).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.filter(e => NN(e) === nn) : v,
    ])
  ),
});
const familias = familia ? [...new Set(doLaco.map(NN))].sort() : [];
for (const nn of familias) {
  const daFamilia = marcados.filter(i => NN(i) === nn);
  const g = gerar(soDaFamilia(familia, nn), `familia-${nn}`);
  if (
    r.ok(
      `família ${nn} (${daFamilia.length} itens): o generator monta (--local)`,
      g.ok,
      `${g.erro} — ${g.log}`
    )
  ) {
    for (const a of g.avisos) console.log(`     ⚠️  ${a}`);
    const v = validar(TEMA);
    r.ok(
      `família ${nn}: o tema valida (${v.erros ?? '?'} erro(s), ${v.avisos ?? '?'} aviso(s))`,
      v.ok,
      v.motivo
    );

    // O build do theme-src/: é ele que põe o CSS e o JS das seções no tema.
    const fontes = path.join(TEMA, conv.DESTINO_DO_CSS);
    const secoes = fs.existsSync(fontes) ? fs.readdirSync(fontes) : [];
    const cssSecoes = secoes.filter(f => f.endsWith('.css'));
    const jsSecoes = secoes.filter(f => f.endsWith('.js'));
    if (process.env.FUNIL_TEMA_BUILD === '0') {
      console.log('  ⏭️  build do theme-src/ pulado (FUNIL_TEMA_BUILD=0)');
    } else {
      const bundle = {
        css: path.join(TEMA, 'static/css/app-serie.css'),
        js: path.join(TEMA, 'static/js/app-serie.js'),
      };
      const antes = Object.fromEntries(
        Object.entries(bundle).map(([k, p]) => [k, ler(p).length])
      );
      console.log(
        `  ⏳ build do theme-src/ (${cssSecoes.length} CSS e ${jsSecoes.length} JS de seção; instala da rede)`
      );
      const themeSrc = path.join(TEMA, 'theme-src');
      const env = {
        ...process.env,
        // npm resolve `node` do PATH: o mesmo do funil.
        PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH}`,
      };
      let logBuild = '';
      let buildOk = true;
      for (const [cmd, args] of comandosDoBuild(themeSrc)) {
        const res = spawnSync(cmd, args, {
          cwd: themeSrc,
          env,
          encoding: 'utf8',
          maxBuffer: 64 * 1024 * 1024,
        });
        logBuild += `$ ${cmd} ${args.join(' ')}\n${res.stdout ?? ''}${res.stderr ?? ''}\n`;
        if (res.status !== 0) {
          buildOk = false;
          break;
        }
      }
      fs.writeFileSync(path.join(PASTA, `build-${nn}.log`), logBuild);
      if (
        r.ok(
          `família ${nn}: o theme-src/ compila (vite build)`,
          buildOk,
          `ver ${path.relative(SAIDA, path.join(PASTA, `build-${nn}.log`))}`
        )
      ) {
        const css = ler(bundle.css);
        const js = ler(bundle.js);
        console.log(
          `  ℹ️  app-serie.css ${antes.css} → ${css.length} bytes · app-serie.js ${antes.js} → ${js.length} bytes`
        );
        const semCss = [];
        for (const f of cssSecoes) {
          const fonte = ler(path.join(fontes, f)).replace(
            /\/\*[\s\S]*?\*\//g,
            ''
          );
          const raiz = fonte.match(/\.([A-Za-z_][\w-]*)/)?.[1];
          const vars = [
            ...new Set(
              [...fonte.matchAll(/var\(\s*(--[\w-]+)/g)].map(m => m[1])
            ),
          ];
          const faltam = [
            ...(raiz && !css.includes(`.${raiz}`) ? [`.${raiz}`] : []),
            ...vars.filter(x => !css.includes(x)),
          ];
          if (!raiz || faltam.length)
            semCss.push(
              `${f}: ${raiz ? faltam.slice(0, 3).join(', ') : 'sem classe-raiz'}`
            );
        }
        r.ok(
          `família ${nn}: os ${cssSecoes.length} CSS de seção estão no app-serie.css (classe-raiz e variáveis lidas)`,
          cssSecoes.length > 0 && semCss.length === 0,
          semCss.join(' | ') || 'nenhum CSS de seção no tema'
        );
        const semJs = [];
        for (const f of jsSecoes) {
          const marca = ler(path.join(fontes, f)).match(
            /data-[a-z0-9]+-pronto/
          )?.[0];
          if (!marca || !js.includes(marca))
            semJs.push(`${f}: ${marca ?? 'sem marcador data-<raiz>-pronto'}`);
        }
        r.ok(
          `família ${nn}: os ${jsSecoes.length} JS de seção estão no app-serie.js (marcador data-<raiz>-pronto)`,
          jsSecoes.length > 0 && semJs.length === 0,
          semJs.join(' | ') ||
            'nenhum JS de seção no tema — o tema-base tem o import.meta.glob dos .js no theme-src/src/main.ts?'
        );
      }
    }

    // ── 4. controle negativo do validador, numa cópia ───────────────────────
    const copia = path.join(PASTA, `controle-negativo-${nn}`);
    const PASTAS_DO_TEMA = [
      'blocks',
      'config',
      'layouts',
      'sections',
      'snippets',
      'static',
      'templates',
      'translations',
    ];
    for (const p of PASTAS_DO_TEMA)
      if (fs.existsSync(path.join(TEMA, p)))
        fs.cpSync(path.join(TEMA, p), path.join(copia, p), { recursive: true });
    const alvo = daFamilia
      .map(i => `sections/${conv.tipoDaSecao(i.selection, i.template)}.tpl`)
      .find(rel => fs.existsSync(path.join(copia, rel)));
    if (alvo && temValidador) {
      const abs = path.join(copia, alvo);
      fs.writeFileSync(
        abs,
        ler(abs).replace(/(\{%-?\s*schema\s*-?%\})/, '$1{')
      );
      const v = validar(copia);
      const pegou = v.achados.some(
        a =>
          a.nivel === 'erro' &&
          a.regra === 'S1-schema-json' &&
          a.arquivo === alvo
      );
      r.ok(
        `família ${nn}, controle negativo: o validador reprova o {% schema %} quebrado de ${alvo} (numa cópia do tema)`,
        !v.ok && pegou,
        v.motivo || 'o validador não apontou o arquivo quebrado'
      );
    } else if (temValidador) {
      r.ok(
        `família ${nn}, controle negativo: há seção da família na cópia do tema`,
        false,
        'nenhum sections/<tipo>.tpl dos itens marcados'
      );
    }
  }
}

// ── de onde veio ─────────────────────────────────────────────────────────────
const [temaCommit] = commits.tema;
const [compCommit] = commits.componentes;
r.ok(
  `todas as rodadas montaram sobre os mesmos commits (tema-base ${temaCommit?.slice(0, 7) ?? '—'}, global-templates ${compCommit?.slice(0, 7) ?? '—'})`,
  commits.tema.size === 1 && commits.componentes.size === 1,
  `tema-base: ${[...commits.tema].join(', ') || '—'} · global-templates: ${[...commits.componentes].join(', ') || '—'}`
);
// O 1-catalogo conferiu as pastas de origem no checkout irmão; o que o generator
// montou é o que ele clonou. Os dois têm de ser o mesmo commit.
const lido = git(GLOBAL_TEMPLATES, 'rev-parse', 'HEAD');
r.ok(
  `o global-templates clonado é o que o estágio 1 leu (${lido.slice(0, 7)})`,
  compCommit === lido,
  `clonado ${compCommit?.slice(0, 7) ?? '—'} · irmão local ${lido.slice(0, 7) || '—'}`
);
fim();
