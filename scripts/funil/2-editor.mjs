/**
 * Estágio 2a — o editor de ponta a ponta: shell, canvas, painéis, atalhos,
 * modal, troca de plataforma e os invariantes de tema (fonte e contraste).
 */
import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL } from './lib/util.mjs';
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
const larguraCanvas = () =>
  q(() =>
    Math.round(document.querySelector('iframe').getBoundingClientRect().width)
  );
const antes = await larguraCanvas();
await q(() =>
  document
    .querySelector('button[aria-label="Recolher painel esquerdo"]')
    .click()
);
await s(600);
const semEsq = await larguraCanvas();
ok(
  'recolher esquerdo alarga o canvas',
  semEsq > antes + 300,
  `${antes} → ${semEsq}`
);
await q(() =>
  document.querySelector('button[aria-label="Recolher painel direito"]').click()
);
await s(600);
const semAmbos = await larguraCanvas();
ok(
  'recolher direito alarga mais',
  semAmbos > semEsq + 300,
  `${semEsq} → ${semAmbos}`
);
ok('canvas > 1200 com os dois recolhidos', semAmbos > 1200, semAmbos);
await q(() => {
  document
    .querySelector('button[aria-label="Expandir painel esquerdo"]')
    .click();
});
await s(500);
await q(() => {
  document
    .querySelector('button[aria-label="Expandir painel direito"]')
    .click();
});
await s(600);
ok(
  'expandir restaura',
  (await larguraCanvas()) === antes,
  await larguraCanvas()
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

console.log(JSON.stringify(R, null, 1));
await b.close();
process.exit(R.every(r => r.ok) ? 0 : 1);
