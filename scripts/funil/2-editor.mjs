/**
 * Estágio 2a — o editor de ponta a ponta: shell, canvas, painéis, atalhos,
 * modal, troca de plataforma e os invariantes de tema (fonte e contraste).
 */
import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL } from './lib/util.mjs';
import {
  visibilidadeDe,
  controleUsavel,
  clicarDeVerdade,
} from './lib/editor.mjs';
const CHROME = findChrome();
const SEED = {
  layoutPlatform: 'Wake',
  layoutSelections: JSON.stringify([
    { uid: 'u-header', id: '01', layoutKey: 'header', pagina: 'common' },
    { uid: 'u-banner', id: '01', layoutKey: 'bannerFull', pagina: 'home' },
    { uid: 'u-footer', id: '01', layoutKey: 'footer', pagina: 'common' },
  ]),
  panelLeftCollapsed: '0',
  panelRightCollapsed: '0',
};
const R = [];
const ok = (n, cond, extra = '') =>
  R.push({ t: n, ok: !!cond, extra: String(extra).slice(0, 90) });

const b = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
const s = ms => new Promise(r => setTimeout(r, ms));

await p.goto(`${BASE_URL}/gerador`, {
  waitUntil: 'networkidle2',
  timeout: 120000,
});
await p.evaluate(x => {
  for (const [k, v] of Object.entries(x)) localStorage.setItem(k, v);
}, SEED);
await p.goto(`${BASE_URL}/gerador`, {
  waitUntil: 'networkidle2',
  timeout: 120000,
});
await p.waitForSelector('.ed-shell');
// Espera o canvas PINTAR, não o relógio. Os 6000 ms fixos que havia aqui caíam
// exatamente na borda: medido, as 3 seções aparecem por volta de 6 s, então o
// estágio reprovava com "0 seções" por milissegundos — e acusava o produto.
await p
  .waitForFunction(
    n =>
      (document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ??
        0) >= n,
    { timeout: 45000, polling: 250 },
    3
  )
  .catch(() => {});
await s(800);

const q = (fn, ...args) => p.evaluate(fn, ...args);
const nSec = () =>
  q(
    () =>
      document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ?? -1
  );

ok('canvas renderiza no 1º load', (await nSec()) === 3, await nSec());

// --- rail
for (const [i, nome] of [
  [0, 'Componentes'],
  [1, 'Variáveis globais'],
  [2, 'Tipografia'],
  [3, 'Identidade visual'],
]) {
  await q(
    idx =>
      document
        .querySelectorAll('nav[aria-label="Seções do editor"] button')
        [idx].click(),
    i
  );
  await s(400);
  const cur = await q(() =>
    document
      .querySelector('nav[aria-label="Seções do editor"] button[aria-current]')
      ?.getAttribute('aria-label')
  );
  ok(`rail → ${nome}`, cur === nome, cur);
}
await q(() =>
  document
    .querySelectorAll('nav[aria-label="Seções do editor"] button')[0]
    .click()
);
await s(400);

// --- seleção abre o painel direito (era o bug do editingUid)
await q(() =>
  document
    .querySelector('iframe')
    .contentDocument.querySelector('[data-selection="header"]')
    .click()
);
await s(1200);
const grupos = await q(
  () =>
    document.querySelectorAll('aside[aria-label="Propriedades"] section').length
);
ok('selecionar no canvas abre as variáveis', grupos >= 3, `${grupos} grupos`);

// --- badges
const badge = await q(() => {
  const d = document.querySelector('iframe').contentDocument;
  const a = d.querySelector('.editor-section-actions');
  const [dup, rem] = [...a.querySelectorAll('button')];
  return {
    visivel: !a.hidden,
    verdeEscondido: dup.hidden,
    dupDisplay: d.defaultView.getComputedStyle(dup).display,
  };
});
ok(
  'badge verde some em header (não-duplicável)',
  badge.verdeEscondido && badge.dupDisplay === 'none',
  JSON.stringify(badge)
);

// --- deselecionar esconde os badges
await q(() => {
  const d = document.querySelector('iframe').contentDocument;
  d.querySelector('[data-selection="banner-full"]')?.click();
});
await s(900);
const badge2 = await q(() => {
  const d = document.querySelector('iframe').contentDocument;
  const a = d.querySelector('.editor-section-actions');
  const [dup] = [...a.querySelectorAll('button')];
  return {
    verdeVisivel: !dup.hidden,
    display: d.defaultView.getComputedStyle(dup).display,
  };
});
ok(
  'badge verde aparece em seção duplicável',
  badge2.verdeVisivel && badge2.display !== 'none',
  JSON.stringify(badge2)
);

// --- colapso dos painéis

// --- os toggles são ALCANÇÁVEIS por um humano?
// O bloco abaixo clicava por DOM e ficava verde com o controle a `opacity: 0`.
// Feature inalcançável, teste passando — é a razão de a regra 5 existir.
// Estas asserções medem opacidade e hit-test REAIS, sem hover e sem foco.
for (const [lado, rotulo] of [
  ['esquerdo', 'Recolher painel esquerdo'],
  ['direito', 'Recolher painel direito'],
]) {
  const v = await visibilidadeDe(p, `button[aria-label="${rotulo}"]`);
  ok(
    `toggle ${lado} é VISÍVEL em repouso (sem hover, sem foco)`,
    controleUsavel(v),
    JSON.stringify(v)
  );
}

// Contenção: o controle vive nos 32px de --ed-canvas-pad, entre a borda do
// painel e a do iframe. Se escorregar para cima de um dos dois, isto reprova.
const vEsq = await visibilidadeDe(
  p,
  'button[aria-label="Recolher painel esquerdo"]'
);
const bordaPainel = await q(() =>
  Math.round(
    document
      .querySelector('aside[aria-label="Painel de edição"]')
      .getBoundingClientRect().right
  )
);
const bordaIframe = await q(() =>
  Math.round(document.querySelector('iframe').getBoundingClientRect().left)
);
ok(
  'toggle esquerdo cabe no vão do canvas (não cobre painel nem storefront)',
  vEsq.x >= bordaPainel && vEsq.direita <= bordaIframe,
  `painel→${bordaPainel} | toggle ${vEsq.x}..${vEsq.direita} | iframe→${bordaIframe}`
);

ok(
  'o toggle esquerdo aceita clique de mouse real',
  await clicarDeVerdade(p, 'button[aria-label="Recolher painel esquerdo"]')
);
await s(600);
await clicarDeVerdade(p, 'button[aria-label="Expandir painel esquerdo"]');
await s(600);

// O proxy antigo aposentado. Estas três asserções mediam a LARGURA do canvas
// como prova de que o tema tinha espaço para renderizar como desktop. Esse
// proxy morreu: a viewport interna é fixa em 1440, e o que recolher painel
// compra agora é ESCALA (legibilidade), não breakpoint. Então as de painel
// medem escala, e uma nova trava o que realmente importa.
const vpInterna = () =>
  q(() => document.querySelector('iframe').contentWindow.innerWidth);
const escala = () =>
  q(() => {
    const el = document.querySelector('iframe');
    return Number(
      (el.getBoundingClientRect().width / el.contentWindow.innerWidth).toFixed(
        3
      )
    );
  });

const vpAntes = await vpInterna();
const escAntes = await escala();
ok('a viewport interna do tema é 1440', vpAntes === 1440, vpAntes);

await clicarDeVerdade(p, 'button[aria-label="Recolher painel esquerdo"]');
await s(700);
const escSemEsq = await escala();
const vpSemEsq = await vpInterna();
ok(
  'recolher esquerdo aumenta a escala do canvas',
  escSemEsq > escAntes + 0.15,
  `${escAntes} → ${escSemEsq}`
);

await clicarDeVerdade(p, 'button[aria-label="Recolher painel direito"]');
await s(700);
const escSemAmbos = await escala();
const vpSemAmbos = await vpInterna();
ok(
  'recolher direito leva a escala a 100%',
  escSemAmbos === 1,
  `${escSemEsq} → ${escSemAmbos}`
);

// A que carrega o significado do conserto: 60 dos 69 CSS de template têm media
// query abaixo de 1200px. Com o frame variando com a coluna, "Desktop" mostrava
// layout de celular numa tela de 1440.
ok(
  'a viewport interna não depende dos painéis',
  vpAntes === 1440 && vpSemEsq === 1440 && vpSemAmbos === 1440,
  `${vpAntes} | ${vpSemEsq} | ${vpSemAmbos}`
);
ok(
  'o tema nunca cai em tier de tablet/celular',
  [vpAntes, vpSemEsq, vpSemAmbos].every(v => v >= 1200),
  [vpAntes, vpSemEsq, vpSemAmbos].join(' | ')
);

await clicarDeVerdade(p, 'button[aria-label="Expandir painel esquerdo"]');
await s(600);
await clicarDeVerdade(p, 'button[aria-label="Expandir painel direito"]');
await s(700);
ok(
  'expandir restaura a escala',
  Math.abs((await escala()) - escAntes) <= 0.005,
  `${escAntes} → ${await escala()}`
);

// --- undo/redo
const nAntes = await nSec();
await q(() => {
  const d = document.querySelector('iframe').contentDocument;
  d.querySelector('[data-selection="banner-full"]').click();
});
await s(800);
await q(() => {
  const d = document.querySelector('iframe').contentDocument;
  [
    ...d.querySelector('.editor-section-actions').querySelectorAll('button'),
  ][0].click();
});
await s(900);
ok('badge verde duplica', (await nSec()) === nAntes + 1, await nSec());
await q(() =>
  [...document.querySelectorAll('header[class*="topbar"] button')]
    .find(x => x.getAttribute('aria-label') === 'Voltar')
    .click()
);
await s(900);
ok('undo desfaz a duplicação', (await nSec()) === nAntes, await nSec());

// --- modal
await q(() =>
  [...document.querySelectorAll('aside[aria-label="Painel de edição"] button')]
    .find(x => x.textContent.includes('Adicionar seção'))
    .click()
);
await p.waitForSelector('[role="dialog"]');
await s(900);
const modal = await q(() => {
  const d = document.querySelector('[role="dialog"]');
  return {
    cats: d.querySelectorAll('#dynamic-tabs button').length,
    cards: d.querySelector('div[class*="carousel"]')?.children.length ?? 0,
    scrollbars: d.querySelectorAll('div[class*="ScrollArea"]').length,
  };
});
ok(
  'modal lista categorias e cards',
  modal.cats > 0 && modal.cards > 0,
  JSON.stringify(modal)
);
await p.keyboard.press('Escape');
await s(500);
ok(
  'Esc fecha o modal',
  !(await q(() => !!document.querySelector('[role="dialog"]')))
);

// --- troca de plataforma preservando
await p.evaluate(() => {
  window.__confirms = [];
  window.confirm = m => {
    window.__confirms.push(m);
    return true;
  };
});
const secAntes = await q(
  () => JSON.parse(localStorage.getItem('layoutSelections')).length
);
await q(() =>
  document.querySelector('button[class*="card"][aria-haspopup]').click()
);
await s(400);
await q(() =>
  [...document.querySelectorAll('[role="option"]')]
    .find(o => o.textContent.trim() === 'Tray')
    .click()
);
await s(1200);
const trocou = await q(() => ({
  plat: localStorage.getItem('layoutPlatform'),
  sec: JSON.parse(localStorage.getItem('layoutSelections')).length,
  confirms: window.__confirms.length,
}));
ok(
  'Wake→Tray preserva tudo, sem diálogo',
  trocou.plat === 'Tray' && trocou.sec === secAntes && trocou.confirms === 0,
  JSON.stringify(trocou)
);

// --- fonte não vaza no :root
const vazou = await q(() =>
  ['--showcase-font', '--header-font', '--font-secondary'].filter(v =>
    document.documentElement.style.getPropertyValue(v)
  )
);
ok(
  'nenhuma fonte por componente no :root',
  vazou.length === 0,
  vazou.join(',')
);
const fonteOk = await q(() => ({
  primary: document.documentElement.style.getPropertyValue('--font-primary'),
  secundary:
    document.documentElement.style.getPropertyValue('--font-secundary'),
  tertiary: document.documentElement.style.getPropertyValue('--font-tertiary'),
}));
ok(
  'as 3 fontes globais no :root',
  !!(fonteOk.primary && fonteOk.secundary && fonteOk.tertiary),
  JSON.stringify(fonteOk)
);

// --- contraste com hex curto
const contraste = await q(() => ({
  base: document.documentElement.style.getPropertyValue('--text-color-base'),
}));
ok(
  'contraste derivado não é NaN',
  /^#[0-9a-f]{6}$/i.test(contraste.base.trim()),
  contraste.base
);

ok('sem erros de página', errs.length === 0, errs.join(' | '));

// ── seletor de fontes sem catálogo ───────────────────────────────────────────
// Sem `GOOGLE_FONTS_API_KEY` a rota devolve 500 e o catálogo chega vazio. Isso
// vai acontecer no primeiro deploy em que a variável faltar na Vercel — e o
// modo de falha era o pior possível: as sugestões eram o ÚNICO caminho que
// chamava `onFontChange`, então digitar não aplicava nada e a tela não dizia
// por quê. Aba própria, para a interceptação não contaminar o resto do estágio.
const p2 = await b.newPage();
const errs2 = [];
p2.on('pageerror', e => errs2.push(e.message));
await p2.setRequestInterception(true);
p2.on('request', req => {
  if (req.url().includes('/gerador/api/fonts')) {
    req.respond({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Missing API key' }),
    });
    return;
  }
  req.continue();
});
await p2.evaluateOnNewDocument(seed => {
  for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
}, SEED);
await p2.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2' });
await p2.waitForSelector('.ed-shell');

// Espera a hidratação antes de clicar: `.ed-shell` existe no HTML servido, mas
// clique em botão não hidratado não faz nada — em silêncio. O bloco do rail lá
// em cima só funciona porque roda DEPOIS da espera do canvas. Aqui a espera é
// explícita, e o clique insiste até o `aria-current` mudar.
await p2
  .waitForFunction(
    () =>
      (document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ??
        0) >= 3,
    { timeout: 45000, polling: 250 }
  )
  .catch(() => {});

const railAtual = () =>
  p2.evaluate(
    () =>
      document
        .querySelector(
          'nav[aria-label="Seções do editor"] button[aria-current]'
        )
        ?.getAttribute('aria-label') ?? ''
  );
const clicarTipografia = () =>
  p2.evaluate(() => {
    [...document.querySelectorAll('nav[aria-label="Seções do editor"] button')]
      .find(x => x.getAttribute('aria-label') === 'Tipografia')
      ?.click();
  });

let abriuTipografia = false;
for (let tentativa = 0; tentativa < 20 && !abriuTipografia; tentativa++) {
  await clicarTipografia();
  await s(500);
  abriuTipografia = (await railAtual()) === 'Tipografia';
}
ok('rail de tipografia acessível na aba sem catálogo', abriuTipografia);

const avisoVisivel = await p2
  .waitForFunction(
    () =>
      [...document.querySelectorAll('p[role="status"]')].some(el =>
        /catálogo de fontes indispon/i.test(el.textContent ?? '')
      ),
    { timeout: 15000, polling: 250 }
  )
  .then(() => true)
  .catch(() => false);
ok(
  'sem catálogo, o seletor de fontes avisa em vez de abrir vazio',
  avisoVisivel
);

// e continua utilizável: digitar o nome exato + Enter aplica
await p2
  .waitForSelector('input[id^="input-font-"]', { timeout: 15000 })
  .catch(() => {});
const campo = await p2.$('input[id^="input-font-"]');
if (campo) {
  await campo.click({ clickCount: 3 });
  await campo.type('Cormorant Garamond');
  await campo.press('Enter');
}
const aplicou = await p2
  .waitForFunction(
    () =>
      /Cormorant Garamond/.test(
        document.documentElement.style.getPropertyValue('--font-primary')
      ),
    { timeout: 10000, polling: 250 }
  )
  .then(() => true)
  .catch(() => false);
ok(
  'sem catálogo, digitar o nome + Enter aplica a fonte',
  aplicou,
  await p2.evaluate(() =>
    document.documentElement.style.getPropertyValue('--font-primary')
  )
);
ok(
  'sem erros de página na aba sem catálogo',
  errs2.length === 0,
  errs2.join(' | ')
);

console.log(JSON.stringify(R, null, 1));
await b.close();
process.exit(R.every(r => r.ok) ? 0 : 1);
