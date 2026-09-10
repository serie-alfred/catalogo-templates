/**
 * Estágio 2d — geometria do chrome do editor contra o Figma "Versão Final V4".
 *
 * ELE REPROVA. Até 10/09 media 37 caixas, calculava o pior delta, imprimia uma
 * tabela e saía com `process.exit(0)` incondicional: a tolerância de ±1px que o
 * README anunciava era convenção de leitura, não portão. Design podia derivar à
 * vontade que o funil ficava verde.
 *
 * As fixtures em `figma/` são coordenadas ABSOLUTAS extraídas pelo MCP Dev
 * Mode. São fixture, não saída: se o design mudar, reextraia — não edite à mão.
 */
import puppeteer from 'puppeteer-core';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

import { irParaRail } from './lib/editor.mjs';
import { findChrome, BASE_URL, relatorio, espera } from './lib/util.mjs';

const r = relatorio('Estágio 2d — geometria vs. Figma');

/**
 * Tolerância por CLASSE de nó, não um número só.
 *
 * `estrutura` — containers e controles de tamanho fixo. Tudo ali vem de
 * padding/gap/width declarados em px inteiros, e o Chrome resolve layout em
 * 1/64 px: o ruído real é ~0,01. Um defeito de verdade é >= 1px (um `gap: 12`
 * que devia ser 16 dá 4). 0,5 separa os dois sem margem para dúvida.
 *
 * `texto` — a largura de um texto hug é medida por dois motores diferentes
 * (Figma e HarfBuzz), então diverge fração de pixel mesmo com o design certo;
 * já a ALTURA o Figma arredonda para inteiro, e por isso ela é comparada
 * arredondada e exata, o que é mais forte que qualquer tolerância.
 */
const TOL = { estrutura: 0.5, textoPos: 0.5, textoW: 1.5 };

/**
 * Divergências CONSCIENTES: o produto está certo e o Figma é que não descreve
 * este caso. Waiva EIXOS NOMEADOS, nunca o nó inteiro, e o motivo é
 * obrigatório.
 *
 * O estágio confere que cada uma AINDA diverge: waiver que virou zero é código
 * morto que passa a esconder regressão, e reprova pedindo a remoção.
 */
const DIVERGENCIAS_CONSCIENTES = [
  {
    label: 't5.titulo1',
    eixos: ['w'],
    motivo:
      'O Figma escreve "Defina a Cor Primária"; o produto expõe os valores ' +
      'reais e o 1º rótulo é outro. Texto diferente, largura hug diferente. ' +
      'x, y e h continuam valendo e são conferidos.',
  },
  {
    label: 'modal.listaCategorias',
    eixos: ['h'],
    motivo:
      'O mock desenha 12 categorias, o catálogo tem 8. A caixa é um scroller: ' +
      'x, y e w são especificação, só h depende do conteúdo.',
  },
];

const CHROME = findChrome();
const FIG = new URL('./figma/', import.meta.url).pathname;
const load = f => JSON.parse(readFileSync(`${FIG}${f}.json`, 'utf8'));
const find = (rows, name, nth = 0) => rows.filter(r2 => r2.name === name)[nth];

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
// Único estágio que não coletava erro de página. Passa a coletar.
const erros = [];
page.on('pageerror', e => erros.push(`pageerror: ${e.message}`));
page.on('console', m => {
  if (m.type() === 'error') erros.push(`console: ${m.text().slice(0, 120)}`);
});
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
// `setTimeout(6000)` cego era exatamente o flake que o README documenta.
await page
  .waitForFunction(
    () =>
      (document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ??
        0) >= 3,
    { timeout: 45000, polling: 250 }
  )
  .catch(() => {});
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => {
  document
    .querySelector('iframe')
    ?.contentDocument?.querySelector('[data-selection="header"]')
    ?.click();
});
await page
  .waitForFunction(
    () =>
      (document.querySelectorAll('aside[aria-label="Propriedades"] section')
        .length ?? 0) > 0,
    { timeout: 15000, polling: 200 }
  )
  .catch(() => {});
await espera(600);

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

/**
 * Compara uma caixa e ASSERTA.
 *
 * `opts.tipo: 'texto'` muda a régua: posição na tolerância normal, largura mais
 * frouxa (dois motores de fonte), altura arredondada e EXATA (o Figma
 * arredonda a caixa de texto, então isso é verificável ao pixel).
 *
 * Cada comparação num try/catch próprio — regra 5 do README: a falha de uma
 * caixa é a falha DAQUELA caixa, não das 37.
 */
const cmp = async (label, sel, fig, axes = 'xywh', opts = {}) => {
  try {
    const got = await measure(sel);
    if (!fig) {
      rows.push({ label, status: 'SEM-REF' });
      r.ok(`${label}: existe referência no Figma`, false, 'fixture sem o nó');
      return;
    }
    if (!got) {
      rows.push({ label, status: 'SEM-DOM', sel });
      r.ok(`${label}: o seletor casa algum elemento`, false, sel);
      return;
    }

    const texto = opts.tipo === 'texto';
    const waiver = DIVERGENCIAS_CONSCIENTES.find(w => w.label === label);
    const d = {};
    const foraDaRegua = [];
    const waivadosQueBatem = [];

    for (const a of axes) {
      d[a] = +(got[a] - fig[a]).toFixed(2);
      const limite = texto
        ? a === 'w'
          ? TOL.textoW
          : TOL.textoPos
        : TOL.estrutura;
      // Altura de texto: o Figma arredonda, então a comparação é exata.
      const dentro =
        texto && a === 'h'
          ? Math.round(got.h) === fig.h
          : Math.abs(d[a]) <= limite;

      if (waiver?.eixos.includes(a)) {
        if (dentro) waivadosQueBatem.push(a);
        continue;
      }
      if (!dentro) foraDaRegua.push(`${a}=${d[a]}`);
    }

    const worst = Math.max(...Object.values(d).map(Math.abs));
    rows.push({
      label,
      fig: `${fig.x}/${fig.y} ${fig.w}×${fig.h}`,
      got: `${got.x}/${got.y} ${got.w}×${got.h}`,
      d,
      worst,
      waiver: waiver ? waiver.eixos.join(',') : undefined,
    });

    r.ok(
      `${label} bate com o Figma${waiver ? ` (menos ${waiver.eixos.join(',')})` : ''}`,
      foraDaRegua.length === 0,
      foraDaRegua.join(' ')
    );

    // Waiver morto reprova: a lista não pode inchar com exceções que já não
    // existem, porque cada uma passa a esconder uma regressão futura.
    if (waivadosQueBatem.length) {
      r.ok(
        `${label}: a exceção de ${waivadosQueBatem.join(',')} ainda é necessária`,
        false,
        'o eixo voltou a bater — remova a entrada de DIVERGENCIAS_CONSCIENTES'
      );
    }
  } catch (e) {
    rows.push({ label, status: 'ERRO', erro: String(e).slice(0, 90) });
    r.ok(
      `${label}: a medição roda sem estourar`,
      false,
      String(e).slice(0, 90)
    );
  }
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
  find(R, 'Fundo da barra superior'),
  'xywh',
  { tipo: 'texto' }
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
  'xyh',
  { tipo: 'texto' }
);

// ---------- tela 5: variáveis globais ----------
await irParaRail(page, 'Variáveis globais');
await espera(500);
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
  find(G, 'Heading 3', 0),
  'xywh',
  { tipo: 'texto' }
);
await cmp(
  't5.hex1',
  'aside[aria-label="Painel de edição"] input[class*="value"]',
  find(G, 'Button', 0)
);

// ---------- tela 4: tipografia ----------
await irParaRail(page, 'Tipografia');
await espera(500);
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
await irParaRail(page, 'Componentes');
await espera(400);
await page.evaluate(() => {
  [...document.querySelectorAll('aside[aria-label="Painel de edição"] button')]
    .find(b => b.textContent.includes('Adicionar seção'))
    .click();
});
await page.waitForSelector('[role="dialog"]');
await page
  .waitForFunction(
    () =>
      (document.querySelectorAll('[role="dialog"] #dynamic-tabs button')
        .length ?? 0) > 0,
    { timeout: 15000, polling: 200 }
  )
  .catch(() => {});
await espera(500);
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

// Todo `var(--ed-*)` consumido tem que existir. O --ed-danger passou
// despercebido porque tinha fallback inline: a tela ficava com uma cor
// plausível que ninguém escolheu.
const tokensCss = readFileSync(
  new URL('../../src/styles/editor-tokens.css', import.meta.url).pathname,
  'utf8'
);
const definidos = new Set(
  [...tokensCss.matchAll(/^\s*(--ed-[a-z0-9-]+)\s*:/gm)].map(m => m[1])
);
const fonte = execSync("grep -rhoE 'var\\(--ed-[a-z0-9-]+' src/ || true", {
  cwd: new URL('../../', import.meta.url).pathname,
  encoding: 'utf8',
});
const usados = new Set(
  [...fonte.matchAll(/var\((--ed-[a-z0-9-]+)/g)].map(m => m[1])
);
const orfaos = [...usados].filter(t => !definidos.has(t));
r.ok(
  `todo --ed-* consumido está definido (${usados.size} usados)`,
  orfaos.length === 0,
  orfaos.join(', ')
);
const comFallback = execSync(
  "grep -rhoE 'var\\(--ed-[a-z0-9-]+,' src/ || true",
  { cwd: new URL('../../', import.meta.url).pathname, encoding: 'utf8' }
).trim();
r.ok(
  'nenhum var(--ed-*) com fallback inline',
  comFallback === '',
  comFallback.split('\n').slice(0, 3).join(' | ')
);

r.ok('sem erros de página', erros.length === 0, erros.slice(0, 2).join(' | '));

console.log(JSON.stringify(rows, null, 1));
await browser.close();
process.exit(r.fechar() ? 0 : 1);
