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
import { arvore, caminho, filhos } from './lib/geometria.mjs';
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
 * `texto` — as duas dimensões são medidas por motores diferentes (Figma e
 * HarfBuzz) e ainda passam pela métrica do fallback que o `next/font` injeta,
 * então divergem fração de pixel mesmo com o design certo. A altura tolera 1px
 * e isso NÃO é frouxo: o menor passo de tamanho de fonte que importa aqui é
 * 12→14px, que move a caixa 2px. Medido: o título do modal a 14px dava 16
 * contra 19 do Figma (erro real, pego); a 16px dá 20 contra 19 (ruído de
 * motor, tolerado) — e a largura passou a bater em 191,53 contra 192, que é o
 * que confirma que 16 é o tamanho certo.
 */
const TOL = { estrutura: 0.5, textoPos: 0.5, textoW: 1.5, textoH: 1 };

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
    label: 'modal.linha1',
    eixos: ['h'],
    motivo:
      'O rodapé do card mostra os chips de variável do componente, que o mock ' +
      'não desenha (ele repete um card ilustrativo 3x3). Largura e posição são ' +
      'especificação e continuam conferidas; a altura segue o conteúdo.',
  },
  { label: 'modal.card1', eixos: ['h'], motivo: 'idem modal.linha1' },
  { label: 'modal.card2', eixos: ['h'], motivo: 'idem modal.linha1' },
  { label: 'modal.card3', eixos: ['h'], motivo: 'idem modal.linha1' },
  {
    label: 't3.meta1',
    eixos: ['w'],
    motivo:
      'A caixa hugueia o texto da dica, e o Figma escreve o placeholder ' +
      'literal "90 x 90 (X Mb)" enquanto o produto escreve "(2 Mb)". ' +
      'Caracteres diferentes, largura diferente. Vale para os 3 slots.',
  },
  { label: 't3.meta2', eixos: ['w'], motivo: 'idem t3.meta1' },
  { label: 't3.meta3', eixos: ['w'], motivo: 'idem t3.meta1' },
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

/**
 * `sel` aceita o sufixo `|N` para pegar o N-ésimo casamento em ordem de
 * documento. Necessário porque as linhas da lista não são irmãs diretas — o
 * `SortableContext` embrulha as reordenáveis num `div` a mais, e por isso
 * `:nth-of-type` não alcança a 2ª e a 3ª.
 */
const measure = seletor =>
  page.evaluate(bruto => {
    const [s, idx] = bruto.split('|');
    const el = idx
      ? document.querySelectorAll(s)[Number(idx)]
      : document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
    };
  }, seletor);

const rows = [];
/** Ids das fixtures que alguma comparação realmente alcançou. */
const medidos = new Set();

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

    if (fig?.id) medidos.add(fig.id);
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
          : a === 'h'
            ? TOL.textoH
            : TOL.textoPos
        : TOL.estrutura;
      const dentro = Math.abs(d[a]) <= limite;

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

// ═══════════════════════════════════════════════════════════════════════════
// Tela 1 — Componentes: rail, cabeçalho, plataforma, lista de seções
// ═══════════════════════════════════════════════════════════════════════════
const L = arvore(load('t1-esquerda'));
const noL = e => caminho(L, e);

const RAIL = 'nav[aria-label="Seções do editor"]';
const ASIDE = 'aside[aria-label="Painel de edição"]';

await cmp('rail', RAIL, noL('Frame 30'));
await cmp('rail.logo', `${RAIL} > svg`, noL('Frame 30 > Group 1'));
for (const [i, nome] of [
  'Edição',
  'lucide/palette',
  'Vector',
  'lucide/component',
].entries()) {
  await cmp(
    `rail.item${i + 1}`,
    `${RAIL} button:nth-of-type(${i + 1}) svg`,
    noL(`Frame 30 > ${nome}`)
  );
}

await cmp('painelEsq', ASIDE, noL('Frame 143'));
await cmp(
  'painelEsq.header',
  `${ASIDE} > header`,
  noL('Frame 143 > Frame 148')
);
await cmp(
  'painelEsq.titleRow',
  `${ASIDE} div[class*="titleRow"]`,
  noL('Frame 143 > Frame 148 > Frame 150')
);
await cmp(
  'painelEsq.titulo',
  `${ASIDE} span[class*="EditorLeftPanel_title"]`,
  noL('Frame 143 > Frame 148 > Frame 150 > Frame 148'),
  'xywh',
  { tipo: 'texto' }
);
await cmp(
  'painelEsq.versao',
  `${ASIDE} span[class*="version"]`,
  noL('Frame 143 > Frame 148 > Frame 150 > Frame 44')
);
await cmp(
  'painelEsq.cardPlataforma',
  'button[class*="PlatformSelect"][class*="card"]',
  noL('Frame 143 > Frame 148 > Options')
);
// `x` e `w` só: o Container do Figma tem 18px de altura (a caixa de texto que
// ele hugueia) e o span do produto tem 16 — e como ele é centrado nos 48px do
// card, essa diferença de altura arrasta o `y` junto. É métrica de fonte, não
// layout.
await cmp(
  'painelEsq.plataformaLegenda',
  'span[class*="PlatformSelect_caption"]',
  noL('Frame 143 > Frame 148 > Options > Container'),
  'xw'
);
await cmp(
  'painelEsq.plataformaChevron',
  'button[class*="PlatformSelect"][class*="card"] > svg:last-of-type',
  noL('Frame 143 > Frame 148 > Options > Arrow / Chevron_Right_MD')
);

// As três linhas da lista. O Figma desenha a 1ª EXPANDIDA e as outras duas
// recolhidas, e é esse o estado que o estágio monta (o clique no header dentro
// do canvas expande a linha dele).
//
// Na expandida só x/y/w entram: o corpo aberto do mock desenha "Título" e
// "Produtos", e o produto desenha "Modelo" + as ações da linha. Conteúdo
// diferente, altura diferente — e é o mock que está velho, não o produto.
const LINHAS = [
  { fig: 'Frame 132', cabeca: 'Frame 149', eixos: 'xyw' },
  { fig: 'Frame 144', cabeca: 'Frame 150', eixos: 'xwh' },
  { fig: 'Frame 145', cabeca: 'Frame 151', eixos: 'xwh' },
];
for (const [i, linha] of LINHAS.entries()) {
  const dom = `div[class*="SectionsPanel_row"]|${i}`;
  const raiz = `Frame 143 > ${linha.fig}`;
  await cmp(`lista.linha${i + 1}`, dom, noL(raiz), linha.eixos);
  // As linhas 2 e 3 herdam o deslocamento da 1ª (o corpo expandido do mock é
  // 20px mais curto que o do produto), então comparar `y` absoluto pintaria 8
  // caixas de vermelho por causa de UMA divergência. O que importa é o
  // espaçamento entre linhas consecutivas, e esse é comparável.
  if (i > 0) {
    const anterior = noL(`Frame 143 > ${LINHAS[i - 1].fig}`);
    const atual = noL(raiz);
    const domAnterior = await measure(
      `div[class*="SectionsPanel_row"]|${i - 1}`
    );
    const domAtual = await measure(dom);
    const esperado = +(atual.y - anterior.y).toFixed(2);
    const veio =
      domAnterior && domAtual ? +(domAtual.y - domAnterior.y).toFixed(2) : NaN;
    if (i === 1) {
      // O passo da 1ª para a 2ª embute a altura do corpo EXPANDIDO, e aí os
      // dois lados divergem por conteúdo: o mock abre "Título" e "Produtos"
      // (campos que o produto não tem) e o produto abre "Modelo" mais as ações
      // da linha. 20px de diferença, conhecida e travada — se mudar, reprova.
      r.ok(
        'lista: o passo com a linha expandida é o conhecido (mock ≠ produto)',
        veio - esperado === 20,
        `esperado ${esperado} + 20 conhecidos, veio ${veio}`
      );
    } else {
      r.ok(
        `lista: o passo da linha ${i} para a ${i + 1} bate com o Figma`,
        Math.abs(veio - esperado) <= TOL.estrutura,
        `esperado ${esperado}, veio ${veio}`
      );
    }
  }
  const eixosFilho = i === 0 ? 'xywh' : 'xwh';
  await cmp(
    `lista.linha${i + 1}.cabeca`,
    `${dom.split('|')[0]} div[class*="SectionsPanel_head"]|${i}`,
    noL(`${raiz} > ${linha.cabeca}`),
    eixosFilho
  );
  await cmp(
    `lista.linha${i + 1}.caret`,
    `${dom.split('|')[0]} button[class*="affordance"]|${i}`,
    noL(`${raiz} > ${linha.cabeca} > Frame 148 > Arrow / Caret_Down_SM`),
    eixosFilho
  );
  await cmp(
    `lista.linha${i + 1}.toggle`,
    `${dom.split('|')[0]} button[class*="SectionsPanel_toggle"]|${i}`,
    noL(
      `${raiz} > ${linha.cabeca} > Edit / ${i === 0 ? 'Remove_Minus' : 'Add_Plus'}`
    ),
    eixosFilho
  );
}

await cmp(
  'lista.adicionarArea',
  'div[class*="PanelComponents_footer"]',
  noL('Frame 143 > Frame 161'),
  'xwh'
);
await cmp(
  'lista.adicionarBotao',
  'button[class*="PanelComponents_add"]',
  noL('Frame 143 > Frame 161 > Frame 160'),
  'xwh'
);

// ═══════════════════════════════════════════════════════════════════════════
// Topbar
// ═══════════════════════════════════════════════════════════════════════════
const T = arvore(load('t1-topbar'));
// A fixture nasce em x=0; no produto a topbar começa depois do rail e do painel.
const OFF = 420;
const noT = e => {
  const n = caminho(T, e);
  return n && { ...n, x: n.x + OFF };
};
const TOPBAR = 'header[class*="topbar"]';

await cmp('topbar', TOPBAR, noT('Frame 130'));
await cmp(
  'topbar.historico',
  `${TOPBAR} div[class*="history"]`,
  noT('Frame 153')
);
for (const [i, nome] of ['Frame 143', 'Frame 148'].entries()) {
  await cmp(
    `topbar.historico.botao${i + 1}`,
    `${TOPBAR} div[class*="history"] button:nth-of-type(${i + 1})`,
    noT(`Frame 153 > ${nome}`)
  );
  await cmp(
    `topbar.historico.icone${i + 1}`,
    `${TOPBAR} div[class*="history"] button:nth-of-type(${i + 1}) svg`,
    noT(
      `Frame 153 > ${nome} > ${i === 0 ? 'Arrow / Arrow_Undo_Up_Left' : 'Arrow / Arrow_Undo_Up_Right'}`
    )
  );
}
await cmp(
  'topbar.pagina',
  `${TOPBAR} button[aria-haspopup="listbox"]`,
  noT('Frame 154')
);
await cmp(
  'topbar.paginaCaret',
  `${TOPBAR} button[aria-haspopup="listbox"] svg`,
  noT('Frame 154 > Frame 148 > Arrow / Caret_Down_SM')
);
await cmp(
  'topbar.toggle',
  'div[role="group"][aria-label="Visão do preview"]',
  noT('Frame 48')
);
for (const [i, nome] of ['Frame 25', 'Frame 27'].entries()) {
  await cmp(
    `topbar.${i === 0 ? 'desktop' : 'mobile'}`,
    `div[role="group"] button:nth-of-type(${i + 1})`,
    noT(`Frame 48 > ${nome}`)
  );
  await cmp(
    `topbar.${i === 0 ? 'desktop' : 'mobile'}.icone`,
    `div[role="group"] button:nth-of-type(${i + 1}) svg`,
    noT(
      `Frame 48 > ${nome} > ${i === 0 ? 'lucide/monitor-stop' : 'lucide/smartphone'}`
    )
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Painel direito — variáveis do componente selecionado
// ═══════════════════════════════════════════════════════════════════════════
const R2 = arvore(load('t1-direita'));
const noR = e => caminho(R2, e);
const DIR = 'aside[aria-label="Propriedades"]';

await cmp('painelDir', DIR, noR('Frame 158'));
await cmp('painelDir.header', `${DIR} > header`, noR('Frame 158 > Frame 131'));
await cmp(
  'painelDir.previsualizar',
  `${DIR} button[class*="trigger"]`,
  noR('Frame 158 > Frame 131 > Button[1]')
);
await cmp(
  'painelDir.previsualizarIcone',
  `${DIR} button[class*="trigger"] svg`,
  noR('Frame 158 > Frame 131 > Button[1] > Edit / Show')
);
await cmp(
  'painelDir.baixar',
  `${DIR} button[class*="download"]`,
  noR('Frame 158 > Frame 131 > Button[2]')
);
await cmp(
  'painelDir.baixarIcone',
  `${DIR} button[class*="download"] svg`,
  noR('Frame 158 > Frame 131 > Button[2] > Arrow / Arrow_Down_SM')
);

// Os dois primeiros grupos do mock são os que têm a mesma forma do produto
// (heading + campo com rótulo, swatch e hex). Do 3º em diante o mock simplifica.
// Só o 1º grupo. Do 2º em diante o mock desenha cópia inventada ("Header",
// "Menu", "Lorem Ipsum") que não corresponde a nenhum schema real — e o 2º
// grupo do Header01 é de FONTE, sem swatch nem hex.
for (const [i, grupo] of ['Frame 49'].entries()) {
  const raiz = `Frame 158 > Frame 145 > ${grupo}`;
  const dom = `${DIR} section[class*="group"]:nth-of-type(${i + 1})`;
  await cmp(`painelDir.grupo${i + 1}`, dom, noR(raiz), 'xw');
  await cmp(
    `painelDir.grupo${i + 1}.titulo`,
    `${dom} h3`,
    noR(`${raiz} > Frame 31 > Heading 3`),
    'xw'
  );
  await cmp(
    `painelDir.grupo${i + 1}.rotulo`,
    `${dom} span[class*="label"]`,
    noR(
      `${raiz} > Frame 31 > Frame 120 > ${i === 0 ? 'Fundo da barra superior' : 'Fundo do header (meio)'}`
    ),
    'xywh',
    { tipo: 'texto' }
  );
  await cmp(
    `painelDir.grupo${i + 1}.swatch`,
    `${dom} button[class*="swatch"]`,
    noR(`${raiz} > Frame 31 > Frame 120 > Frame 55 > Ellipse 1`),
    'xwh'
  );
  await cmp(
    `painelDir.grupo${i + 1}.hex`,
    `${dom} input[class*="value"]`,
    noR(`${raiz} > Frame 31 > Frame 120 > Frame 55 > Button`),
    'xwh'
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tela 5 — Variáveis globais: 4 blocos idênticos
// ═══════════════════════════════════════════════════════════════════════════
await irParaRail(page, 'Variáveis globais');
await page
  .waitForFunction(
    () =>
      document.querySelectorAll(
        'aside[aria-label="Painel de edição"] section[class*="PanelGlobalColors_block"]'
      ).length >= 4,
    { timeout: 15000, polling: 200 }
  )
  .catch(() => {});
await espera(500);

const G = arvore(load('t5-esquerda'));
const noG = e => caminho(G, e);
await cmp('t5.header', `${ASIDE} > header`, noG('Frame 143 > Frame 148'));
for (const [i, bloco] of [
  'Frame 146',
  'Frame 149',
  'Frame 150',
  'Frame 151',
].entries()) {
  const raiz = `Frame 143 > ${bloco}`;
  const dom = `${ASIDE} section[class*="PanelGlobalColors_block"]:nth-of-type(${i + 1})`;
  await cmp(`t5.bloco${i + 1}`, dom, noG(raiz));
  await cmp(
    `t5.titulo${i + 1}`,
    `${dom} h3`,
    noG(`${raiz} > Frame 31 > Heading 3`),
    'xyh',
    { tipo: 'texto' }
  );
  await cmp(
    `t5.campo${i + 1}`,
    `${dom} div[class*="ColorPicker_row"]`,
    noG(`${raiz} > Frame 31 > Frame 55`),
    'xyh'
  );
  await cmp(
    `t5.swatch${i + 1}`,
    `${dom} button[class*="swatch"]`,
    noG(`${raiz} > Frame 31 > Frame 55 > Ellipse 1`)
  );
  await cmp(
    `t5.hex${i + 1}`,
    `${dom} input[class*="value"]`,
    noG(`${raiz} > Frame 31 > Frame 55 > Button`),
    'xwh'
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tela 4 — Tipografia: 3 blocos idênticos
// ═══════════════════════════════════════════════════════════════════════════
await irParaRail(page, 'Tipografia');
await page
  .waitForFunction(
    () =>
      document.querySelectorAll(
        'aside[aria-label="Painel de edição"] section[class*="block"]'
      ).length >= 3,
    { timeout: 15000, polling: 200 }
  )
  .catch(() => {});
await espera(500);

const F4 = arvore(load('t4-esquerda'));
const noF4 = e => caminho(F4, e);
await cmp('t4.header', `${ASIDE} > header`, noF4('Frame 143 > Frame 148'));
for (const [i, bloco] of ['Frame 146', 'Frame 149', 'Frame 150'].entries()) {
  const raiz = `Frame 143 > ${bloco}`;
  const dom = `${ASIDE} section[class*="block"]:nth-of-type(${i + 1})`;
  await cmp(`t4.bloco${i + 1}`, dom, noF4(raiz));
  await cmp(
    `t4.titulo${i + 1}`,
    `${dom} h3`,
    noF4(`${raiz} > Frame 31 > Heading 3`),
    'xywh',
    { tipo: 'texto' }
  );
  await cmp(
    `t4.input${i + 1}`,
    `${dom} input`,
    noF4(`${raiz} > Frame 31 > Button`),
    'xywh'
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tela 3 — Identidade visual. A fixture existia no repo e NUNCA era lida:
// o estágio clicava nos destinos 1 e 2 do rail e nunca no 3.
// ═══════════════════════════════════════════════════════════════════════════
await irParaRail(page, 'Identidade visual');
await page
  .waitForFunction(
    () => document.querySelectorAll('input[type="file"]').length >= 3,
    { timeout: 15000, polling: 200 }
  )
  .catch(() => {});
await espera(500);

const T3 = arvore(load('t3-esquerda'));
const noT3 = e => caminho(T3, e);
await cmp('t3.header', `${ASIDE} > header`, noT3('Frame 143 > Frame 148'));
for (const [i, slot] of ['Frame 146', 'Frame 149', 'Frame 150'].entries()) {
  const raiz = `Frame 143 > ${slot}`;
  const conteudo = `${raiz} > ${i === 0 ? 'Frame 33' : 'Frame 32'}`;
  const metaFig = `${conteudo} > Frame 122 > Frame ${123 + i}`;
  const dom = `${ASIDE} section[class*="block"]:nth-of-type(${i + 1})`;
  // `x` e `w` só: a altura do slot no mock varia (248/262/253) porque cada um
  // desenha uma arte de placeholder diferente — o produto renderiza sempre a
  // mesma moldura. Registrado em figma/README.md.
  await cmp(`t3.slot${i + 1}`, dom, noT3(raiz), 'xw');
  await cmp(
    `t3.meta${i + 1}`,
    `${dom} div[class*="meta"]`,
    noT3(metaFig),
    'xw'
  );
  await cmp(
    `t3.titulo${i + 1}`,
    `${dom} h3`,
    noT3(`${metaFig} > Heading 3 > ${['Logo', 'Favicon', 'Share Link'][i]}`),
    'xh',
    { tipo: 'texto' }
  );
  await cmp(
    `t3.dica${i + 1}`,
    `${dom} p[class*="hint"]`,
    noT3(`${metaFig} > 90 x 90 (X Mb)`),
    'xh',
    { tipo: 'texto' }
  );
  await cmp(
    `t3.acao${i + 1}`,
    `${dom} button[class*="action"]`,
    noT3(`${conteudo} > Frame 122 > Frame 51`),
    'xh'
  );
}
// ═══════════════════════════════════════════════════════════════════════════
// Modal "Componentes de seções" — a maior fixture, 105 nós
// ═══════════════════════════════════════════════════════════════════════════
await irParaRail(page, 'Componentes');
await espera(400);
await page.evaluate(() => {
  [...document.querySelectorAll('aside[aria-label="Painel de edição"] button')]
    .find(b => b.textContent.includes('Adicionar seção'))
    ?.click();
});
await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
await page
  .waitForFunction(
    () =>
      (document.querySelectorAll(
        '[role="dialog"] div[class*="ScrollArea_viewport"] button'
      ).length ?? 0) > 0,
    { timeout: 15000, polling: 200 }
  )
  .catch(() => {});
await espera(500);

const M = arvore(load('modal'));
// O diálogo é centrado em runtime, então a fixture é deslocada pela posição
// medida do card em vez de por um offset mágico.
const mo = await page.evaluate(() => {
  const r2 = document.querySelector('[role="dialog"]').getBoundingClientRect();
  return { x: r2.x, y: r2.y };
});
const noM = e => {
  const n = caminho(M, e);
  return n && { ...n, x: n.x - 2100 + mo.x, y: n.y - 101 + mo.y };
};
const DLG = '[role="dialog"]';

await cmp('modal.card', DLG, noM('Frame 165'));
await cmp('modal.header', `${DLG} > header`, noM('Frame 165 > Frame 144'));
await cmp(
  'modal.titulo',
  `${DLG} h2`,
  noM('Frame 165 > Frame 144 > Frame 150 > Componentes de seções'),
  'xh',
  { tipo: 'texto' }
);
await cmp(
  'modal.fechar',
  `${DLG} button[class*="close"]`,
  noM('Frame 165 > Frame 144 > Frame 150 > Menu / Close_MD')
);
await cmp(
  'modal.corpo',
  `${DLG} div[class*="body"]`,
  noM('Frame 165 > Frame 166')
);
await cmp(
  'modal.colCategorias',
  `${DLG} aside`,
  noM('Frame 165 > Frame 166 > Frame 163')
);
await cmp(
  'modal.listaCategorias',
  `${DLG} aside div[class*="ScrollArea_viewport"]`,
  noM('Frame 165 > Frame 166 > Frame 163 > Frame 169')
);
await cmp(
  'modal.barraCategorias',
  `${DLG} aside div[class*="ScrollArea_bar"]`,
  noM('Frame 165 > Frame 166 > Frame 163 > Pagination Container'),
  'xw'
);
await cmp(
  'modal.colGrade',
  `${DLG} div[class*="SectionModal_grid"]`,
  noM('Frame 165 > Frame 166 > Frame 160')
);
await cmp(
  'modal.gradeArea',
  `${DLG} div[class*="SectionModal_grid"] div[class*="ScrollArea_root"]`,
  noM('Frame 165 > Frame 166 > Frame 160 > Frame 48'),
  'xw'
);
await cmp(
  'modal.gradeViewport',
  `${DLG} div[class*="SectionModal_grid"] div[class*="ScrollArea_viewport"]`,
  noM('Frame 165 > Frame 166 > Frame 160 > Frame 48 > Frame 40'),
  'xw'
);

// Os botões de categoria: o mock desenha 15, o catálogo tem menos. Comparar os
// que existem nos dois, e o PASSO entre eles — é o passo que pega deriva
// cumulativa de espaçamento, que medir só o primeiro nunca veria.
const nCategorias = await page.evaluate(
  () =>
    document.querySelectorAll(
      '[role="dialog"] aside div[class*="ScrollArea_viewport"] button'
    ).length
);
const figCategorias = filhos(
  caminho(M, 'Frame 165 > Frame 166 > Frame 163 > Frame 169'),
  'Button'
);
r.ok(
  `modal: há categorias para medir (${nCategorias} no produto, ${figCategorias.length} no mock)`,
  nCategorias > 0 && figCategorias.length > 0
);
const quantas = Math.min(nCategorias, figCategorias.length, 8);
for (let i = 0; i < quantas; i++) {
  const fig = figCategorias[i];
  await cmp(
    `modal.categoria${i + 1}`,
    `${DLG} aside div[class*="ScrollArea_viewport"] button|${i}`,
    { ...fig, x: fig.x - 2100 + mo.x, y: fig.y - 101 + mo.y }
  );
}

// A grade de cards — a maior sub-árvore da fixture. O conteúdo depende da
// categoria ativa, então o que se compara é a CAIXA: linha, card, e a barra de
// rolagem com os dois carets. Nenhuma delas depende de quantos itens a
// categoria tem.
const grade = caminho(
  M,
  'Frame 165 > Frame 166 > Frame 160 > Frame 48 > Frame 40'
);
const linhasFig = (grade?.filhos ?? []).filter(n =>
  /^Frame (138|141|142)$/.test(n.name)
);
// Os cards em ordem de documento, achatados — é assim que o DOM os entrega.
const cardsFig = linhasFig.flatMap(l => filhos(l, 'lucide/x'));

const nLinhas = await page.evaluate(
  () =>
    document.querySelectorAll(
      '[role="dialog"] div[class*="SelectSectionItem_carousel"]'
    ).length
);
const nCards = await page.evaluate(
  () =>
    document.querySelectorAll(
      '[role="dialog"] div[class*="SectionModal_grid"] div[class*="imageContainer"]'
    ).length
);
r.ok(
  `modal: a grade tem o que medir (${nLinhas} linhas / ${nCards} cards no produto, ${linhasFig.length}/${cardsFig.length} no mock)`,
  nLinhas > 0 && nCards > 0 && linhasFig.length > 0
);

const desloca = n => n && { ...n, x: n.x - 2100 + mo.x, y: n.y - 101 + mo.y };

// Só a primeira linha: as outras são a MESMA estrutura repetida, e o que
// interessa nelas é o passo — medido logo abaixo. Comparar as três inteiras
// multiplicaria por 3 qualquer divergência de uma.
await cmp(
  'modal.linha1',
  '[role="dialog"] div[class*="SelectSectionItem_carousel"]|0',
  desloca(linhasFig[0]),
  'xwh'
);
for (let j = 0; j < Math.min(nCards, cardsFig.length, 3); j++) {
  await cmp(
    `modal.card${j + 1}`,
    `[role="dialog"] div[class*="SectionModal_grid"] div[class*="imageContainer"]|${j}`,
    desloca(cardsFig[j]),
    'wh'
  );
}

// Sem asserção de passo entre linhas: as duas estruturas não correspondem. O
// mock repete um card ilustrativo numa grade 3x3 de uma categoria só; o produto
// desenha UM carrossel por seção, cada um com as variantes daquela seção.
// Comparar o espaçamento seria comparar coisas diferentes que por acaso têm o
// mesmo formato.

// A barra de rolagem da grade e seus dois carets.
await cmp(
  'modal.barraGrade',
  '[role="dialog"] div[class*="SectionModal_grid"] div[class*="ScrollArea_bar"]',
  desloca(
    caminho(
      M,
      'Frame 165 > Frame 166 > Frame 160 > Frame 48 > Frame 40 > Pagination'
    )
  ),
  'w'
);
for (const [j, nome] of ['CaretLeft', 'CaretRight'].entries()) {
  await cmp(
    `modal.grade.caret${j + 1}`,
    `[role="dialog"] div[class*="SectionModal_grid"] button[class*="ScrollArea_caret"]|${j}`,
    desloca(
      caminho(
        M,
        `Frame 165 > Frame 166 > Frame 160 > Frame 48 > Frame 40 > ${nome}`
      )
    ),
    'wh'
  );
}
for (const [j, nome] of ['CaretLeft', 'CaretRight'].entries()) {
  await cmp(
    `modal.categorias.caret${j + 1}`,
    `[role="dialog"] aside button[class*="ScrollArea_caret"]|${j}`,
    desloca(
      caminho(
        M,
        `Frame 165 > Frame 166 > Frame 163 > Pagination Container > ${nome}`
      )
    ),
    'wh'
  );
}

await page.keyboard.press('Escape');
await espera(400);

// ── cobertura: o que das fixtures ficou de fora, e por quê ─────────────────
// Sem isto, "133 de 300" é afirmação. Com isto, é conta — e a conta reprova se
// alguém apagar metade das comparações sem ninguém perceber.
const ICONE =
  /^(lucide\/|Arrow \/|Edit \/|Menu \/|CaretLeft|CaretRight|Pagination$)/;
const FORMA = /^(Vector|Group \d+|Ellipse \d+|Rectangle \d+|Union|Subtract)$/;
const censo = { total: 0, semCaixa: 0, dentroDeIcone: 0, medido: 0, resto: 0 };
for (const nome of [
  't1-esquerda',
  't1-topbar',
  't1-direita',
  't3-esquerda',
  't4-esquerda',
  't5-esquerda',
  'modal',
]) {
  const nos = arvore(load(nome));
  const dentro = new Set();
  for (const n of nos) {
    censo.total++;
    if (n.pai && (dentro.has(n.pai.id) || ICONE.test(n.pai.name)))
      dentro.add(n.id);
    if (!(n.w > 0 && n.h > 0)) censo.semCaixa++;
    else if (dentro.has(n.id) || FORMA.test(n.name)) censo.dentroDeIcone++;
    else if (medidos.has(n.id)) censo.medido++;
    else censo.resto++;
  }
}
console.log(
  `\n  censo das fixtures: ${censo.total} nós · ${censo.semCaixa} sem caixa · ` +
    `${censo.dentroDeIcone} internos de ícone · ${censo.medido} MEDIDOS · ${censo.resto} sem gêmeo no DOM`
);
// O piso é sobre NÓS DISTINTOS do Figma, não sobre asserções: o estágio tem
// mais asserções que nós porque algumas conferem waiver e outras não são
// comparação de caixa. Confundir os dois inflava o número que eu reportava.
r.ok(
  `cobertura das fixtures não regrediu (${censo.medido} nós do Figma comparados)`,
  censo.medido >= 115,
  `medidos ${censo.medido}, piso 115`
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
