/**
 * Estágio 1-checkout — o checkout-vtex vendorizado é o do SHA, e o contrato
 * fecha dos dois lados.
 *
 * A invariante central do checkout (checkout-vtex/docs/arquitetura.md): o
 * preview do /gerador e o arquivo do cliente saem do MESMO `compose.mjs`, do
 * mesmo SHA. O `yarn checkout:sync` copia; este estágio prova que a cópia é
 * aquela e que ninguém a editou depois — sem subir nada:
 *
 *  1. INTEGRIDADE: o VERSION.json tem o sha256 de CADA arquivo vendorizado (lib,
 *     checkout.json, dist, fixtures, cartões) e todos batem com o disco — nada
 *     sobrando nem faltando. Com o checkout-vtex ao lado (`../checkout-vtex` ou
 *     `CHECKOUT_VTEX_DIR`), também vendorizado = `git show <sha>:<arquivo>`,
 *     byte a byte; sem ele, só os hashes (aviso, não reprova);
 *  1b. REPO PÚBLICO (gate0 #29): o catálogo não guarda a lista do que não pode
 *     receber; com o checkout-vtex ao lado, ela é carregada DE LÁ, em memória (a
 *     do SHA; sem o commit, a do working tree), e cada arquivo vendorizado e os
 *     fontes da integração têm zero termos. Sem ele: "termos não conferidos: sem
 *     checkout-vtex ao lado", aviso;
 *  2. as fixtures não têm script nem atributo de evento nem `javascript:`, só
 *     CDN público, e trazem o
 *     que o CheckoutFrame precisa (base, tokens, os dois slots, a etapa no <html>);
 *     o CSS nativo vem das URLs VERSIONADAS do CDN. A REAL é o `fixtures/` do SHA
 *     (só o `src` do cartão achatado), com o `card.html` no pagamento, e foi
 *     capturada com o JS que o SHA entrega (`sha256Js` = o do `dist/default`);
 *     `provisorio: false` exige as 10 reais;
 *  3. todo papel é consumido no CSS como Nível 1, com a cadeia do contrato e
 *     `default` = Nível 3 (a lógica do 1-variaveis, sobre o checkout);
 *  4. o compose de amostra passa no lint do próprio checkout-vtex, e o lib
 *     vendorizado reproduz o `dist/default` byte a byte;
 *  5. o Nível 2 ⊆ `VAR_MAP` do generator: as chaves, a ordem e a declaração, e o
 *     export do catálogo manda exatamente essas chaves.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { relatorio, RAIZ, GENERATOR } from './lib/util.mjs';
import {
  CHECKOUT_VTEX,
  DEST,
  MODELO,
  VIEWPORTS,
  nomeDaFixture,
  listaDoSha,
  listaDoWorkingTree,
} from './lib/checkout.mjs';

const r = relatorio('estágio 1-checkout · checkout-vtex vendorizado');

if (!fs.existsSync(DEST.version)) {
  r.ok('src/data/checkout/VERSION.json existe (rode yarn checkout:sync)', false);
  process.exit(r.fechar() ? 0 : 1);
}
const versao = JSON.parse(fs.readFileSync(DEST.version, 'utf8'));
const SHA = versao.sha;
console.log(
  `  checkout-vtex@${SHA.slice(0, 12)} · ${versao.commit ?? ''}${versao.provisorio ? ' · fixtures PROVISÓRIAS' : ''}`
);

// ── 1. vendorizado = git show ───────────────────────────────────────────────
const git = (...a) =>
  execFileSync('git', ['-C', CHECKOUT_VTEX, ...a], {
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  });
// O checkout-vtex é PRIVADO: num clone só do catálogo ele não está ao lado. Aí
// a integridade fica com os hashes do VERSION.json (abaixo) e o resto é aviso.
const temRepo = fs.existsSync(CHECKOUT_VTEX);
let temCommit = temRepo;
if (!temRepo) {
  console.log(
    `  ⚠️  sem checkout-vtex ao lado (${path.relative(path.dirname(RAIZ), CHECKOUT_VTEX)}; CHECKOUT_VTEX_DIR): o vendorizado não é comparado com o git show do SHA, só com os hashes do VERSION.json`
  );
} else {
  try {
    git('cat-file', '-e', `${SHA}^{commit}`);
  } catch {
    temCommit = false;
  }
  r.ok(
    `o SHA ${SHA.slice(0, 12)} existe em ${path.relative(path.dirname(RAIZ), CHECKOUT_VTEX)}`,
    temCommit,
    'o repo lido (CHECKOUT_VTEX_DIR ou ../checkout-vtex) não tem esse commit'
  );
}

const sha256 = buf => crypto.createHash('sha256').update(buf).digest('hex');
if (temCommit) {
  const noSha = rel => git('show', `${SHA}:${rel}`);
  const lista = pasta =>
    git('ls-tree', '-r', '--name-only', SHA, '--', pasta)
      .toString('utf8')
      .split('\n')
      .filter(Boolean);

  const libsDoSha = lista('lib')
    .map(f => path.basename(f))
    .filter(n => n.endsWith('.mjs') && !n.endsWith('.test.mjs'))
    .sort();
  const libsAqui = fs
    .readdirSync(DEST.lib)
    .filter(n => n.endsWith('.mjs'))
    .sort();
  r.ok(
    `lib: os mesmos ${libsDoSha.length} módulos do SHA (sem os *.test.mjs)`,
    JSON.stringify(libsDoSha) === JSON.stringify(libsAqui),
    `SHA ${libsDoSha.join(',')} · aqui ${libsAqui.join(',')}`
  );
  const difLib = libsDoSha.filter(
    n =>
      !fs.existsSync(path.join(DEST.lib, n)) ||
      !noSha(`lib/${n}`).equals(fs.readFileSync(path.join(DEST.lib, n)))
  );
  r.ok(
    'lib: cada módulo é byte a byte o `git show <sha>:lib/…`',
    difLib.length === 0,
    `diferem: ${difLib.join(', ')}`
  );
  r.ok(
    `${MODELO}/checkout.json é o do SHA`,
    noSha(`modelos/${MODELO}/checkout.json`).equals(fs.readFileSync(DEST.modelo))
  );

  const distDoSha = lista(`dist/${MODELO}`).map(f =>
    f.slice(`dist/${MODELO}/`.length)
  );
  const difDist = distDoSha.filter(rel => {
    const aqui = path.join(DEST.public, rel);
    return !fs.existsSync(aqui) || !noSha(`dist/${MODELO}/${rel}`).equals(fs.readFileSync(aqui));
  });
  r.ok(
    `dist: os ${distDoSha.length} arquivos de dist/${MODELO} são os do SHA`,
    distDoSha.length > 0 && difDist.length === 0,
    `diferem ou faltam: ${difDist.join(', ')}`
  );
}

const hashes = Object.entries(versao.hashes ?? {});
const difHash = hashes.filter(
  ([rel]) =>
    !fs.existsSync(path.join(RAIZ, rel)) ||
    sha256(fs.readFileSync(path.join(RAIZ, rel))) !== versao.hashes[rel]
);
r.ok(
  `VERSION.json: os ${hashes.length} hashes batem com o disco (nada editado à mão)`,
  hashes.length > 0 && difHash.length === 0,
  difHash.map(([k]) => k).join(', ')
);
const sobrando = [];
const listarPublic = (dir, pref = '') => {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = pref ? `${pref}/${d.name}` : d.name;
    if (d.isDirectory()) listarPublic(path.join(dir, d.name), rel);
    else if (!versao.hashes[path.relative(RAIZ, path.join(DEST.public, rel))]) sobrando.push(rel);
  }
};
listarPublic(DEST.public);
r.ok(
  `public/gerador/checkout/${MODELO}: nada fora do que o sync gravou`,
  sobrando.length === 0,
  sobrando.join(', ')
);
// O hash é o que prende o vendorizado quando o checkout-vtex não está ao lado:
// todo módulo do lib, o checkout.json e cada fixture/cartão do VERSION.json têm o seu.
const semHash = [
  ...fs
    .readdirSync(DEST.lib)
    .filter(n => n.endsWith('.mjs'))
    .map(n => path.relative(RAIZ, path.join(DEST.lib, n))),
  path.relative(RAIZ, DEST.modelo),
  ...Object.entries(versao.fixtures?.arquivos ?? {}).flatMap(([n, f]) =>
    [n, f.card].filter(Boolean).map(a => path.relative(RAIZ, path.join(DEST.public, a)))
  ),
].filter(rel => !versao.hashes?.[rel]);
r.ok(
  'VERSION.json: sha256 de CADA arquivo vendorizado (lib, checkout.json, dist, fixtures, cartões)',
  semHash.length === 0,
  `sem hash: ${semHash.join(', ')}`
);

// ── 1b. repo público: a lista vem do checkout-vtex, nunca daqui (gate0 #29) ─
// O catálogo não guarda a lista nem as trocas: nem vendorizadas (o lib/ do SHA
// vem inteiro, e ela mora fora dele), nem literais num script.
const DECLARA_LISTA = /\b(?:PROIBIDOS|TROCAS|CPFS_PERMITIDOS)\s*=\s*\[/;
const comLista = [
  ...fs.readdirSync(DEST.lib).map(n => path.join(DEST.lib, n)),
  path.join(RAIZ, 'scripts/checkout-sync.mjs'),
  ...fs.readdirSync(path.join(RAIZ, 'scripts/funil')).map(n => path.join(RAIZ, 'scripts/funil', n)),
  ...fs.readdirSync(path.join(RAIZ, 'scripts/funil/lib')).map(n => path.join(RAIZ, 'scripts/funil/lib', n)),
]
  .filter(a => /\.m?[jt]s$/.test(a) && fs.statSync(a).isFile() && DECLARA_LISTA.test(fs.readFileSync(a, 'utf8')))
  .map(a => path.relative(RAIZ, a));
r.ok(
  'gate0 #29: o catálogo não guarda a lista do repo público (sem src/lib/checkout/publico.mjs; nenhum script declara PROIBIDOS/TROCAS)',
  !fs.existsSync(path.join(DEST.lib, 'publico.mjs')) && comLista.length === 0,
  `publico.mjs: ${fs.existsSync(path.join(DEST.lib, 'publico.mjs'))} · declaram: ${comLista.join(', ') || '—'}`
);

/**
 * Os fontes da integração do checkout no catálogo (vão para o repo público com
 * o vendorizado): TODO arquivo que a integração criou ou mudou, não só os do
 * modo Checkout — um termo num painel mexido por ela também iria a público.
 */
const FONTES_DA_INTEGRACAO = [
  'CLAUDE.md',
  'eslint.config.mjs',
  'package.json',
  'src/components/gerador/ColorPicker',
  'src/components/gerador/ComponentVariablesPanel',
  'src/components/gerador/EditorCanvas',
  'src/components/gerador/EditorLeftPanel',
  'src/components/gerador/EditorRail',
  'src/components/gerador/EditorRightPanel',
  'src/components/gerador/EditorTopbar',
  'src/components/gerador/ExportStage',
  'src/components/gerador/FontSelector',
  'src/components/gerador/SelectPage',
  'src/components/preview/PreviewNav',
  'src/components/preview/SeededLayoutProvider',
  'src/components/preview/SharedPreview',
  'src/hooks/useCanvasZoom.ts',
  'src/hooks/useLayoutGenerator.ts',
  'src/hooks/useThemeHistory.ts',
  'src/lib/previewStore.ts',
  'src/utils/googleFont.ts',
  'src/utils/platformCompat.ts',
  'scripts/checkout-sync.mjs',
  'scripts/funil/1-checkout.mjs',
  'scripts/funil/2-checkout.mjs',
  'scripts/funil/3-export.mjs',
  'scripts/funil/4-tema-faststore.mjs',
  'scripts/funil/README.md',
  'scripts/funil/lib/checkout.mjs',
  'scripts/funil/lib/contrato.mjs',
  'src/app/p/[id]/checkout',
  'src/components/gerador/CheckoutFrame',
  'src/components/gerador/CheckoutVariablesPanel',
  'src/components/gerador/SelectCheckoutStep',
  'src/components/preview/SharedCheckout',
  'src/hooks/useCheckoutPreview.ts',
  'src/utils/checkout.ts',
  'src/utils/checkoutExemplo.ts',
];
const arquivosDe = rel => {
  const abs = path.join(RAIZ, rel);
  if (!fs.existsSync(abs)) return [];
  if (!fs.statSync(abs).isDirectory()) return [rel];
  return fs.readdirSync(abs).flatMap(n => arquivosDe(path.join(rel, n)));
};
let listaPublica = null;
let deOnde = '';
if (!temRepo) {
  console.log('  ⚠️  termos não conferidos: sem checkout-vtex ao lado (a lista do repo público só existe lá)');
} else {
  try {
    listaPublica = (temCommit ? await listaDoSha(CHECKOUT_VTEX, SHA) : await listaDoWorkingTree(CHECKOUT_VTEX)).publico;
    deOnde = temCommit ? `a do SHA ${SHA.slice(0, 12)}` : 'a do working tree, sem o commit';
  } catch (e) {
    r.ok('a lista do repo público carrega do checkout-vtex ao lado', false, e.message);
  }
}
if (listaPublica) {
  const alvos = [
    ...new Set([...Object.keys(versao.hashes ?? {}), path.relative(RAIZ, DEST.version), ...FONTES_DA_INTEGRACAO.flatMap(arquivosDe)]),
  ].filter(rel => fs.existsSync(path.join(RAIZ, rel)));
  const sujos = [];
  for (const rel of alvos) {
    const binario = /\.(png|jpe?g|gif|webp|woff2?|ico)$/i.test(rel);
    const texto = fs.readFileSync(path.join(RAIZ, rel), binario ? 'latin1' : 'utf8');
    const n = binario
      ? listaPublica.PROIBIDOS.filter(re => new RegExp(re.source, re.flags.replace('g', '')).test(texto)).length
      : listaPublica.sobrasProibidas(texto).length;
    if (n) sujos.push(`${rel} (${n})`);
  }
  r.ok(
    `gate0 #29: zero termos da lista do repo público (${deOnde}, carregada em memória) nos ${alvos.length} arquivos vendorizados e da integração`,
    sujos.length === 0,
    sujos.join(', ')
  );
}

// ── 2. fixtures ─────────────────────────────────────────────────────────────
const model = JSON.parse(fs.readFileSync(DEST.modelo, 'utf8'));
const HOSTS_OK = new Set(['io2.vtex.com', 'vtex.vtexassets.com', 'loja-exemplo.invalid']);
const infoFix = versao.fixtures?.arquivos ?? {};
const shaJsDist = sha256(fs.readFileSync(path.join(DEST.public, 'default', model.arquivos.js)));
const hostsDe = html =>
  [...new Set([...html.matchAll(/(?:href|src)="(?:https?:)?\/\/([^/"]+)/g)].map(m => m[1]))].filter(h => !HOSTS_OK.has(h));
/** Nada executável, só CDN público: vale para a página e o cartão (os termos da lista estão no 1b). */
const problemasPublicos = html => {
  const hosts = hostsDe(html);
  return [
    /<script/i.test(html) && '<script>',
    // Iframe sem sandbox na origem do catálogo: evento inline e URL javascript: também executam.
    /<[a-z][^>]*\son[a-z]+\s*=/i.test(html) && 'atributo on…=',
    /\s(?:href|src|action|formaction|xlink:href)\s*=\s*["']?\s*javascript:/i.test(html) && 'javascript:',
    hosts.length && `hosts: ${hosts.join(', ')}`,
    !/<link id="ck-base" rel="stylesheet" href="checkout6-custom\.css">/.test(html) && 'ck-base',
    !/<style id="ck-tokens">/.test(html) && 'ck-tokens',
  ].filter(Boolean);
};
const noShaTexto = rel => {
  try {
    return git('show', `${SHA}:${rel}`).toString('utf8');
  } catch {
    return null;
  }
};
let reais = 0;
for (const etapa of model.etapas) {
  for (const vp of VIEWPORTS) {
    const nome = nomeDaFixture(etapa.id, vp);
    const arq = path.join(DEST.public, nome);
    if (!r.ok(`fixture ${nome} existe`, fs.existsSync(arq))) continue;
    const html = fs.readFileSync(arq, 'utf8');
    const info = infoFix[nome] ?? {};
    const real = info.origem === 'real';
    if (real) reais++;
    // A real traz `[data-etm-slot]`; a provisória, o par de comentários.
    const slot = n =>
      new RegExp(`<div data-etm-slot="${n}"[^>]*>`).test(html) ||
      new RegExp(`<!-- ck-slot:${n} -->[\\s\\S]*<!-- \\/ck-slot:${n} -->`).test(html);
    // O único iframe que pode existir é o do cartão, apontando para o card.html achatado ao lado.
    const iframes = [...html.matchAll(/<iframe\b[^>]*>/gi)].map(m => m[0]);
    const cartao = info.card ?? null;
    const iframeOk =
      iframes.length === 0
        ? !cartao
        : iframes.length === 1 && !!cartao && iframes[0].includes(` src="${cartao}"`);
    const faltas = [
      ...problemasPublicos(html),
      !slot('header') && 'slot header',
      !slot('footer') && 'slot footer',
      !new RegExp(`<html[^>]*class="[^"]*\\bck01-step-${etapa.id}\\b`).test(html) && 'ck01-step no <html>',
      !new RegExp(`<html[^>]*class="[^"]*\\bck01-passo-${etapa.passo}\\b`).test(html) && 'ck01-passo no <html>',
      !/href="https:\/\/io2\.vtex\.com\/checkout-ui\/v\d+\.\d+\.\d+\/style\/style\.css"/.test(html) &&
        'style.css versionado do CDN',
      !iframeOk && `iframe ${JSON.stringify(iframes)} × card ${cartao}`,
    ].filter(Boolean);
    r.ok(
      `fixture ${nome} (${real ? 'real' : 'PROVISÓRIA'}): sem script/on…=/javascript:, só CDN público, com base/tokens/slots`,
      !faltas.length,
      faltas.join(' · ')
    );
    if (cartao) {
      const arqC = path.join(DEST.public, cartao);
      if (r.ok(`${nome}: o cartão ${cartao} existe`, fs.existsSync(arqC))) {
        const htmlC = fs.readFileSync(arqC, 'utf8');
        const fC = [...problemasPublicos(htmlC), /<iframe/i.test(htmlC) && '<iframe>'].filter(Boolean);
        r.ok(`${cartao}: sem script/on…=/javascript:, só CDN público, com base/tokens`, !fC.length, fC.join(' · '));
      }
    }
    if (!real) continue;

    // A real é a do SHA: o index.html do commit, só com o src do cartão achatado,
    // e o card.html idem. E foi capturada com o JS que o SHA entrega. Sem o
    // checkout-vtex ao lado, só o que o catálogo tem (VERSION.json e o HTML).
    const curto = /· js ([0-9a-f]{12}) ·/.exec(html)?.[1] ?? null;
    if (!temRepo) {
      r.ok(
        `${nome}: o JS da fixture é o do dist (VERSION.json e o HTML = checkout6-custom.js do default/, ${shaJsDist.slice(0, 12)})`,
        info.sha256Js === shaJsDist && curto === shaJsDist.slice(0, 12),
        `VERSION ${String(info.sha256Js).slice(0, 12)} · no HTML ${curto} · dist ${shaJsDist.slice(0, 12)}`
      );
      continue;
    }
    const rel = `modelos/${MODELO}/fixtures/${etapa.id}/${vp}`;
    const doSha = temCommit ? noShaTexto(`${rel}/index.html`) : null;
    const esperado = doSha && cartao ? doSha.replace(' src="card.html"', ` src="${cartao}"`) : doSha;
    r.ok(`${nome}: é o ${rel}/index.html do SHA (só o src do cartão reescrito)`, esperado != null && esperado === html, esperado == null ? 'ausente no SHA' : 'difere');
    if (cartao) {
      const cDoSha = temCommit ? noShaTexto(`${rel}/card.html`) : null;
      r.ok(`${cartao}: é o ${rel}/card.html do SHA`, cDoSha != null && cDoSha === fs.readFileSync(path.join(DEST.public, cartao), 'utf8'));
    }
    const meta = temCommit ? JSON.parse(noShaTexto(`${rel}/fixture.json`) ?? '{}') : {};
    r.ok(
      `${nome}: o JS da fixture é o do dist (sha256Js = checkout6-custom.js do default/, ${shaJsDist.slice(0, 12)})`,
      meta.sha256Js === shaJsDist && info.sha256Js === shaJsDist && curto === shaJsDist.slice(0, 12),
      `fixture.json ${String(meta.sha256Js).slice(0, 12)} · VERSION ${String(info.sha256Js).slice(0, 12)} · no HTML ${curto} · dist ${shaJsDist.slice(0, 12)}`
    );
  }
}
if (versao.provisorio) {
  console.log(
    `  ℹ️  ${reais} fixtures reais; as provisórias (captura crua, sem o nosso JS) não têm hash de JS nem card.html`
  );
} else {
  r.ok(
    `provisorio: false — as ${model.etapas.length * VIEWPORTS.length} fixtures são reais`,
    reais === model.etapas.length * VIEWPORTS.length && versao.fixtures?.provisorias === 0,
    `${reais} reais`
  );
  const pagamento = VIEWPORTS.map(vp => infoFix[nomeDaFixture('pagamento', vp)]?.card);
  r.ok('o pagamento traz o iframe do cartão (card.html) nos dois tamanhos', pagamento.every(Boolean), JSON.stringify(pagamento));
}

// ── 3. papéis × CSS ─────────────────────────────────────────────────────────
const lib = n => import(pathToFileURL(path.join(DEST.lib, n)).href);
const { composeCheckout, emitTokens } = await lib('compose.mjs');
const { lintCheckout, formatarProblema } = await lib('lint.mjs');
const { validarModelo, cadeia } = await lib('modelo.mjs');
const { VAR_MAP, level2Declaration } = await lib('level2.mjs');

const problemas = validarModelo(model);
r.ok(`${MODELO}/checkout.json passa no validarModelo`, problemas.length === 0, problemas.map(p => p.mensagem).join('; '));

const base = {
  css: fs.readFileSync(path.join(DEST.public, model.arquivos.css), 'utf8'),
  js: fs.readFileSync(path.join(DEST.public, model.arquivos.js), 'utf8'),
  header: fs.readFileSync(path.join(DEST.public, model.arquivos.header), 'utf8'),
  footer: fs.readFileSync(path.join(DEST.public, model.arquivos.footer), 'utf8'),
};

/** `var(--X, <resto>)` com o fecho casado — o mesmo leitor do 1-variaveis. */
function consumos(cssBruto) {
  const css = cssBruto.replace(/\/\*[\s\S]*?\*\//g, '');
  const achados = new Map();
  for (let i = 0; (i = css.indexOf('var(', i)) !== -1; i += 4) {
    let nivel = 0;
    let fim = -1;
    for (let j = i + 3; j < css.length; j++) {
      if (css[j] === '(') nivel++;
      else if (css[j] === ')' && --nivel === 0) {
        fim = j;
        break;
      }
    }
    if (fim === -1) continue;
    const dentro = css.slice(i + 4, fim);
    const virgula = dentro.indexOf(',');
    const nome = (virgula === -1 ? dentro : dentro.slice(0, virgula)).trim();
    const resto = virgula === -1 ? null : dentro.slice(virgula + 1).trim();
    if (!achados.has(nome)) achados.set(nome, new Set());
    achados.get(nome).add(resto);
  }
  return achados;
}
const nivel3 = fallback => {
  if (fallback == null) return null;
  const m = /^var\(\s*--[\w-]+\s*,\s*([\s\S]*)\)\s*$/.exec(fallback.trim());
  return (m ? nivel3(m[1]) : fallback).trim();
};

const usadas = consumos(base.css);
const semConsumo = [];
for (const p of model.papeis) {
  const ok1 = r.ok(`${p.cssVar}: o CSS consome como Nível 1`, usadas.has(p.cssVar));
  if (!ok1) continue;
  const n3s = [...usadas.get(p.cssVar)].map(nivel3).filter(x => x !== null);
  r.ok(
    `${p.cssVar}: default == Nível 3 do CSS, com a cadeia do contrato`,
    n3s.includes(p.default) && base.css.includes(`${p.alias}: ${cadeia(p)};`),
    `default "${p.default}" · css ${JSON.stringify(n3s)} · esperado ${p.alias}: ${cadeia(p)}`
  );
  // O alias consumido por uma REGRA (fora do :root do 00-tokens, que só o declara).
  const semTokens = base.css.replace(/:root\s*\{[^}]*\}/g, '');
  const nosTemplates = consumos(base.header + base.footer);
  if (!consumos(semTokens).has(p.alias) && !nosTemplates.has(p.alias)) semConsumo.push(p.alias);
}
if (versao.provisorio)
  console.log(
    `  ℹ️  ${model.papeis.length - semConsumo.length}/${model.papeis.length} aliases já pintam alguma regra` +
      (semConsumo.length ? ` (ainda não: ${semConsumo.join(', ')})` : '')
  );
else
  // Com o CSS das etapas escrito, alias que nenhuma regra consome é papel que o
  // painel oferece e não pinta nada. O 2-checkout mede o nó real no navegador.
  r.ok(
    `os ${model.papeis.length} aliases pintam alguma regra do CSS ou dos templates`,
    semConsumo.length === 0,
    `sem regra: ${semConsumo.join(', ')}`
  );

// ── 4. lint + compose ───────────────────────────────────────────────────────
const lintBase = lintCheckout(base, { model, fase: 'base' });
r.ok('a base vendorizada passa no lint do checkout-vtex', lintBase.erros.length === 0, lintBase.erros.map(formatarProblema).join(' | '));

// Amostra: uma loja com tudo definido — cores globais, todos os papéis do painel e logo.
const PNG_1x1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const level2 = {
  fontPrimary: 'Lato',
  fontSecondary: 'Poppins',
  fontTertiary: 'Open Sans',
  colorPrimary: '#1a1a1a',
  colorSecondary: '#ffffff',
  colorTertiary: '#ffffff',
  colorPrimaryBackground: '#0b5394',
  colorSecondaryBackground: '#dd1838',
  colorTertiaryBackground: '#000000',
  colorFooter: '#1a051c',
  colorFooterText: '#94a3b8',
  colorPrimaryText: '#ffffff',
  colorSecondaryText: '#ffffff',
  colorPrimaryBackgroundSafe: '#0b5394',
};
const CORES = ['#c0121c', '#1f7a3a', '#6a1b9a', '#0d47a1', '#e65100', '#004d40', '#3e2723', '#827717', '#263238', '#ad1457', '#5d4037'];
const level1 = {};
model.papeis
  .filter(p => p.painel)
  .forEach((p, i) => {
    level1[p.cssVar] = p.type === 'font' ? "'Montserrat', Arial, Helvetica, sans-serif" : CORES[i % CORES.length];
  });
let composto = null;
try {
  composto = composeCheckout(model, base, { level2, level1, logo: PNG_1x1, version: SHA });
} catch (e) {
  r.ok('o compose de amostra (todos os papéis + logo) compõe', false, e.message);
}
if (composto) {
  const lintComposto = lintCheckout(composto, { model, fase: 'composto' });
  r.ok(
    'o compose de amostra passa no lint do checkout-vtex (fase composto)',
    lintComposto.erros.length === 0,
    lintComposto.erros.map(formatarProblema).join(' | ')
  );
  const tokens = emitTokens(model, { level2, level1 });
  r.ok(
    'o `:root` do emitTokens (o <style id="ck-tokens"> do preview) é o do slot tokens do arquivo composto',
    composto.css.includes(`/* ETC:BEGIN tokens */\n${tokens}/* ETC:END tokens */`)
  );
  r.ok(
    'o arquivo composto começa pelo @import da fonte (pesos 300–700)',
    /^\/\*![^\n]*\*\/\n\/\* ETC:BEGIN font-import \*\/\n@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Montserrat:wght@300;400;500;600;700&display=swap'\);/.test(
      composto.css
    )
  );
}

// O lib vendorizado reproduz o dist/default do SHA: é o mesmo compose que o gerou.
const headerDefault = fs.readFileSync(path.join(DEST.public, 'default', model.arquivos.header), 'utf8');
const logoExemplo = /<img class="etm-header__logo-img" src="([^"]+)"/.exec(headerDefault)?.[1] ?? null;
try {
  const def = composeCheckout(model, base, { logo: logoExemplo, version: null });
  const lerDef = k => fs.readFileSync(path.join(DEST.public, 'default', model.arquivos[k]), 'utf8');
  const difs = ['css', 'js', 'header', 'footer'].filter(k => def[k] !== lerDef(k));
  if (def.readme !== fs.readFileSync(path.join(DEST.public, 'default', 'README.md'), 'utf8')) difs.push('readme');
  r.ok('o compose vendorizado reproduz o dist/default byte a byte', difs.length === 0, `diferem: ${difs.join(', ')}`);
} catch (e) {
  r.ok('o compose vendorizado reproduz o dist/default byte a byte', false, e.message);
}

// ── 5. nível 2 ⊆ VAR_MAP do generator ───────────────────────────────────────
const arqGen = path.join(GENERATOR, 'src/platforms/faststore/services/VariablesGenerator.js');
if (r.ok('o VariablesGenerator.js do generator existe', fs.existsSync(arqGen), arqGen)) {
  const fonte = fs.readFileSync(arqGen, 'utf8');
  const m = /const VAR_MAP = (\{[\s\S]*?\n\});/.exec(fonte);
  if (r.ok('o generator declara `const VAR_MAP = {…}`', !!m)) {
    const deles = new Function(`return (${m[1]});`)();
    r.ok(
      'VAR_MAP: mesmas chaves, na mesma ordem, que o generator',
      JSON.stringify(Object.keys(VAR_MAP)) === JSON.stringify(Object.keys(deles)),
      `checkout ${Object.keys(VAR_MAP).join(',')} · generator ${Object.keys(deles).join(',')}`
    );
    const difDecl = Object.keys(deles).filter(k =>
      ['Montserrat', 'Open Sans', '#123abc'].some(a => level2Declaration(k, a) !== deles[k](a))
    );
    r.ok('VAR_MAP: cada declaração sai igual à do generator', difDecl.length === 0, difDecl.join(', '));
    const nomesGen = new Set(Object.values(deles).map(f => f('X').split(':')[0]));
    const fora = model.papeis.filter(p => p.level2 && !nomesGen.has(p.level2)).map(p => `${p.cssVar}→${p.level2}`);
    r.ok('todo Nível 2 dos papéis é uma var que o generator escreve no :root', fora.length === 0, fora.join(', '));
  }
}

// O export do catálogo manda exatamente as chaves do VAR_MAP em `faststore.variables`
// (a função que o preview do checkout também usa).
const utilCheckout = fs.readFileSync(path.join(RAIZ, 'src/utils/checkout.ts'), 'utf8');
const corpo = /export function variaveisGlobais\([\s\S]*?\{\n  return \{([\s\S]*?)\n  \};\n\}/.exec(utilCheckout)?.[1] ?? '';
const chaves = [...corpo.matchAll(/^\s+(\w+):/gm)].map(x => x[1]);
r.ok(
  'o nível 2 que o catálogo exporta (variaveisGlobais) tem as chaves do VAR_MAP',
  chaves.length > 0 && JSON.stringify([...chaves].sort()) === JSON.stringify(Object.keys(VAR_MAP).sort()),
  `catálogo ${chaves.join(',')}`
);

process.exit(r.fechar() ? 0 : 1);
