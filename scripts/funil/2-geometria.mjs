import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL } from './lib/util.mjs';
import { readFileSync } from 'node:fs';

const CHROME = findChrome();
const FIG = new URL('./figma/', import.meta.url).pathname;
const load = f => JSON.parse(readFileSync(`${FIG}${f}.json`, 'utf8'));
const find = (rows, name, nth = 0) => rows.filter(r => r.name === name)[nth];

const SEED = {
  layoutPlatform: 'Wake',
  layoutSelections: JSON.stringify([
    {
      uid: 'seed-header',
      id: '01',
      layoutKey: 'header',
      pagina: 'common',
      variables: { '--header-topbar-bg': '#FFFFFF' },
    },
    { uid: 'seed-banner', id: '01', layoutKey: 'bannerFull', pagina: 'home' },
    { uid: 'seed-footer', id: '01', layoutKey: 'footer', pagina: 'common' },
  ]),
  panelLeftCollapsed: '0',
  panelRightCollapsed: '0',
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: [
    '--force-device-scale-factor=1',
    '--hide-scrollbars',
    '--font-render-hinting=none',
  ],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.goto(`${BASE_URL}/gerador`, {
  waitUntil: 'networkidle2',
  timeout: 120000,
});
await page.evaluate(s => {
  for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
}, SEED);
await page.goto(`${BASE_URL}/gerador`, {
  waitUntil: 'networkidle2',
  timeout: 120000,
});
await page.waitForSelector('.ed-shell');
await new Promise(r => setTimeout(r, 6000));
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => {
  document
    .querySelector('iframe')
    ?.contentDocument?.querySelector('[data-selection="header"]')
    ?.click();
});
await new Promise(r => setTimeout(r, 1500));

const measure = sel =>
  page.evaluate(s => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
    };
  }, sel);

const rows = [];
const cmp = async (label, sel, fig, axes = 'xywh') => {
  const got = await measure(sel);
  if (!fig) {
    rows.push({ label, status: 'SEM-REF' });
    return;
  }
  if (!got) {
    rows.push({ label, status: 'SEM-DOM', sel });
    return;
  }
  const d = {};
  for (const a of axes) d[a] = +(got[a] - fig[a]).toFixed(2);
  const worst = Math.max(...Object.values(d).map(Math.abs));
  rows.push({
    label,
    fig: `${fig.x}/${fig.y} ${fig.w}×${fig.h}`,
    got: `${got.x}/${got.y} ${got.w}×${got.h}`,
    d,
    worst,
  });
};

// ---------- coluna esquerda / rail ----------
const L = load('t1-esquerda');
await cmp('rail', 'nav[aria-label="Seções do editor"]', find(L, 'Frame 30'));
await cmp(
  'rail.logo',
  'nav[aria-label="Seções do editor"] > svg',
  find(L, 'Group 1')
);
const railBtns = ['Edição', 'lucide/palette', 'Vector', 'lucide/component'];
for (let i = 0; i < 4; i++) {
  await cmp(
    `rail.item${i + 1}`,
    `nav[aria-label="Seções do editor"] button:nth-of-type(${i + 1}) svg`,
    find(L, railBtns[i])
  );
}
await cmp(
  'painelEsq',
  'aside[aria-label="Painel de edição"]',
  find(L, 'Frame 143')
);
await cmp(
  'painelEsq.header',
  'aside[aria-label="Painel de edição"] > header',
  find(L, 'Frame 148', 0)
);
await cmp(
  'painelEsq.cardPlataforma',
  'button[class*="PlatformSelect"][class*="card"]',
  find(L, 'Options')
);

// ---------- topbar ----------
const T = load('t1-topbar');
const off = { x: 420, y: 0 };
const shift = f => f && { ...f, x: f.x + off.x, y: f.y + off.y };
await cmp('topbar', 'header[class*="topbar"]', shift(find(T, 'Frame 130')));
await cmp(
  'topbar.historico',
  'header[class*="topbar"] div[class*="history"]',
  shift(find(T, 'Frame 153'))
);
await cmp(
  'topbar.pagina',
  'button[aria-haspopup="listbox"]:not([class*="card"])',
  shift(find(T, 'Frame 154'))
);
await cmp(
  'topbar.toggle',
  'div[role="group"][aria-label="Visão do preview"]',
  shift(find(T, 'Frame 48'))
);
await cmp(
  'topbar.desktop',
  'div[role="group"] button:nth-of-type(1)',
  shift(find(T, 'Frame 25'))
);
await cmp(
  'topbar.mobile',
  'div[role="group"] button:nth-of-type(2)',
  shift(find(T, 'Frame 27'))
);

// ---------- painel direito ----------
const R = load('t1-direita');
await cmp(
  'painelDir',
  'aside[aria-label="Propriedades"]',
  find(R, 'Frame 158')
);
await cmp(
  'painelDir.header',
  'aside[aria-label="Propriedades"] > header',
  find(R, 'Frame 131')
);
await cmp(
  'painelDir.previsualizar',
  'aside[aria-label="Propriedades"] button[class*="trigger"]',
  find(R, 'Button', 0)
);
await cmp(
  'painelDir.baixar',
  'aside[aria-label="Propriedades"] button[class*="download"]',
  find(R, 'Button', 1)
);
await cmp(
  'painelDir.grupo1',
  'aside[aria-label="Propriedades"] section[class*="group"]',
  find(R, 'Frame 49')
);
await cmp(
  'painelDir.rotulo1',
  'aside[aria-label="Propriedades"] section span[class*="label"]',
  find(R, 'Fundo da barra superior')
);
await cmp(
  'painelDir.swatch1',
  'aside[aria-label="Propriedades"] button[class*="swatch"]',
  find(R, 'Ellipse 1', 0)
);
await cmp(
  'painelDir.hex1',
  'aside[aria-label="Propriedades"] input[class*="value"]',
  find(R, 'Button', 2)
);
await cmp(
  'painelDir.titulo1',
  'aside[aria-label="Propriedades"] section h3',
  find(R, 'Heading 3', 0),
  'xyh'
);

// ---------- tela 5: variáveis globais ----------
await page.evaluate(() =>
  document
    .querySelectorAll('nav[aria-label="Seções do editor"] button')[1]
    .click()
);
await new Promise(r => setTimeout(r, 700));
const G = load('t5-esquerda');
await cmp(
  't5.header',
  'aside[aria-label="Painel de edição"] > header',
  find(G, 'Frame 148', 0)
);
await cmp(
  't5.bloco1',
  'aside[aria-label="Painel de edição"] section',
  find(G, 'Frame 146')
);
await cmp(
  't5.titulo1',
  'aside[aria-label="Painel de edição"] section h3',
  find(G, 'Heading 3', 0)
);
await cmp(
  't5.hex1',
  'aside[aria-label="Painel de edição"] input[class*="value"]',
  find(G, 'Button', 0)
);

// ---------- tela 4: tipografia ----------
await page.evaluate(() =>
  document
    .querySelectorAll('nav[aria-label="Seções do editor"] button')[2]
    .click()
);
await new Promise(r => setTimeout(r, 700));
const F4 = load('t4-esquerda');
await cmp(
  't4.header',
  'aside[aria-label="Painel de edição"] > header',
  find(F4, 'Frame 148', 0)
);
await cmp(
  't4.bloco1',
  'aside[aria-label="Painel de edição"] section',
  find(F4, 'Frame 146') || find(F4, 'Frame 145')
);
await cmp(
  't4.input1',
  'aside[aria-label="Painel de edição"] input[class*="input"]',
  find(F4, 'Button', 0)
);

// ---------- modal ----------
await page.evaluate(() =>
  document
    .querySelectorAll('nav[aria-label="Seções do editor"] button')[0]
    .click()
);
await new Promise(r => setTimeout(r, 500));
await page.evaluate(() => {
  [...document.querySelectorAll('aside[aria-label="Painel de edição"] button')]
    .find(b => b.textContent.includes('Adicionar seção'))
    .click();
});
await page.waitForSelector('[role="dialog"]');
await new Promise(r => setTimeout(r, 900));
const M = load('modal');
const mo = await page.evaluate(() => {
  const r = document.querySelector('[role="dialog"]').getBoundingClientRect();
  return { x: r.x, y: r.y };
});
const mshift = f => f && { ...f, x: f.x - 2100 + mo.x, y: f.y - 101 + mo.y };
await cmp('modal.card', '[role="dialog"]', mshift(find(M, 'Frame 165')));
await cmp(
  'modal.header',
  '[role="dialog"] > header',
  mshift(find(M, 'Frame 144'))
);
await cmp(
  'modal.colCategorias',
  '[role="dialog"] aside',
  mshift(find(M, 'Frame 163'))
);
await cmp(
  'modal.listaCategorias',
  '[role="dialog"] #dynamic-tabs',
  mshift(find(M, 'Frame 169'))
);
await cmp(
  'modal.itemCategoria',
  '[role="dialog"] #dynamic-tabs button',
  mshift(find(M, 'Button', 0))
);
await cmp(
  'modal.colGrade',
  '[role="dialog"] div[class*="grid"]',
  mshift(find(M, 'Frame 160'))
);

console.log(JSON.stringify(rows, null, 1));
await browser.close();
process.exit(0);
