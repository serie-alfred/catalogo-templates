/**
 * Estágio 2f — fidelidade 1:1 entre o componente REAL do faststore.starter e a
 * réplica mock deste catálogo.
 *
 * Por que existe: até aqui "migrei o componente" era uma afirmação sem prova. O
 * `2-render` só diz que a réplica monta sem erro; o `2-geometria` mede o EDITOR
 * contra o Figma, não o conteúdo do canvas. Ninguém comparava os dois lados.
 *
 * Como compara: os dois lados publicam os MESMOS `data-role`. O portão casa nó a
 * nó por `role + texto`, e afirma sobre a CAIXA (w/h/dx/dy relativos ao primeiro
 * nó visível). Caixa é a asserção; CSS é diagnóstico — com uma exceção, abaixo.
 *
 * ── As três regras que a calibração exigiu (medidas em BenefitsStrip07) ──
 *
 * 1. NORMALIZA `letter-spacing` nos dois lados. O core do FastStore põe
 *    `letter-spacing: .16px` no `body.theme`; o catálogo não põe nada. Nenhum
 *    componente declara a propriedade — ela é do shell. Sem zerar, dava até
 *    4,5px (2,4%) de largura em texto e o portão nasceria vermelho para sempre
 *    por um motivo que não é do componente.
 *    ⚠️ Isto é uma divergência REAL entre o preview e a loja gerada: na loja o
 *    espaçamento existe. Está registrado em docs/CATALOGO-E-FASTSTORE.md.
 *
 * 2. `font-family` compara só o PRIMEIRO token. Os dois lados chegam na mesma
 *    face por pilhas diferentes ("Poppins, Arial, Helvetica, sans-serif" contra
 *    "Poppins, sans-serif"). Se a face pintada divergir de fato, a CAIXA acusa —
 *    foi exatamente assim que apareceu que o starter pedia Poppins e nunca a
 *    carregava (título 15px contra 20px).
 *
 * 3. Propriedade só é comparada no nó que a POSSUI — computado diferente do pai.
 *    Um wrapper sem texto próprio herda a cor do shell e divergia por isso, sem
 *    nada visível na tela. Quem herda não é comparado; quem estabelece, é.
 */
import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL } from './lib/util.mjs';

const STARTER_URL = process.env.FUNIL_STARTER_URL ?? 'http://localhost:3000';
const TOL = 0.5;

/**
 * Os pares cobertos. Só entra aqui componente migrado com o contrato de
 * `data-role` espelhado dos dois lados — os migrados antes deste portão não têm
 * `data-role` no catálogo e ficam sem cobertura até serem revisitados.
 */
export const PARES = [
  { starter: 'BenefitsStrip07', id: '03', layoutKey: 'ruler', pagina: 'home' },
  { starter: 'SocialProof07', id: '07', layoutKey: 'review', pagina: 'home' },
  { starter: 'EditorialBanner07', id: '07', layoutKey: 'bannerSideLeft', pagina: 'home' },
  { starter: 'Categories07', id: '07', layoutKey: 'categories', pagina: 'home' },
  { starter: 'BannerSide06', id: '06', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'BannerMain07', id: '07', layoutKey: 'banner', pagina: 'home' },
  { starter: 'ShopByRoom07', id: '07', layoutKey: 'rooms', pagina: 'home' },
  { starter: 'Newsletter07', id: '07', layoutKey: 'newsletter', pagina: 'home' },
  { starter: 'Categories06', id: '06', layoutKey: 'buySize', pagina: 'home' },
  { starter: 'HelpFloatButton06', id: '06', layoutKey: 'helpFloat', pagina: 'home' },
];

/** Propriedades que valem asserção quando o nó as possui. */
const PROPS = [
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'color',
  'backgroundColor', 'padding', 'gap', 'display', 'gridTemplateColumns',
  'alignItems', 'justifyContent', 'borderRadius', 'borderWidth', 'borderColor',
];

/**
 * Paleta-SONDA: cada token de marca recebe uma cor única e absurda. Não é só
 * "igualar os dois lados" — é o que transforma o portão num teste do CONTRATO:
 * se a réplica ler `--background-secundary-color` onde o original lê
 * `--background-primary-color`, as cores saem diferentes e o portão acusa. Com
 * a paleta real dos dois shells isso passaria batido sempre que as duas
 * casassem por acaso.
 *
 * As fontes também entram: forçar a MESMA pilha dos dois lados não esconde
 * problema de carregamento — fonte pedida e não baixada continua mudando a
 * caixa, e a caixa é a asserção.
 */
const PALETA = {
  '--background-primary-color': 'rgb(11, 0, 0)',
  '--background-primary-color-safe': 'rgb(12, 0, 0)',
  '--background-secundary-color': 'rgb(13, 0, 0)',
  '--background-tertiary-color': 'rgb(14, 0, 0)',
  '--background-footer': 'rgb(15, 0, 0)',
  '--text-color-base': 'rgb(16, 0, 0)',
  '--text-color-secundary': 'rgb(17, 0, 0)',
  '--text-color-footer': 'rgb(18, 0, 0)',
  '--text-primary-color': 'rgb(19, 0, 0)',
  '--text-secundary-color': 'rgb(20, 0, 0)',
  '--text-tertiary-color': 'rgb(21, 0, 0)',
  '--font-primary': "'Poppins', sans-serif",
  '--font-secundary': "'Roboto', sans-serif",
  '--font-tertiary': "'Open Sans', sans-serif",
};

const normalizar = paleta => {
  const st = document.createElement('style');
  st.id = 'funil-normaliza-shell';
  // `transition`/`animation` desligadas: a própria injeção da paleta DISPARA as
  // transições de cor, e medir 200ms depois lê o valor INTERPOLADO. Foi assim
  // que o link do EditorialBanner07 apareceu como rgb(22,13,13) na origem e
  // rgb(21,8,8) no clone — nenhum dos dois era a cor real, e os dois lados
  // estavam certos. Portão mede repouso.
  st.textContent = '*, *::before, *::after {' +
    'letter-spacing: normal !important;' +
    'transition: none !important;' +
    'animation: none !important;' +
    '}' +
    // Terceira (e última) baseline de shell: o catálogo reseta `a { color:
    // inherit }` em globals.css e o starter deixa o azul do navegador
    // (rgb(0,0,238)) em todo <a> que o componente não colore. Invisível — o
    // texto do link mora em filhos que definem a própria cor —, mas o portão
    // via a diferença em cada card. Seletor `a` tem especificidade (0,0,1):
    // qualquer classe do componente continua vencendo, então link que o
    // componente ESTILIZA segue sendo comparado de verdade.
    //
    // E a baseline HERDADA do documento: cor e fonte do <body>. Tudo que o
    // componente NÃO declara cai nelas, e elas são diferentes nas duas casas
    // (starter rgb(23,26,28); catálogo rgb(26,26,26)). Dois sintomas medidos,
    // a mesma causa: o descender de baseline embaixo da <img> inline do
    // BannerSide06 rendia 0,61px de diferença em 6 caixas, e o borderColor do
    // link vinha `rgb(23,26,28) rgb(23,26,28) rgb(19,0,0)` — só o lado que o
    // componente pinta batia. `!important` no body é necessário: o starter
    // declara em `body.theme`, (0,1,1). Quem declara na própria classe
    // continua vencendo, que é o ponto.
    //
    // O seletor é `a` PELADO por necessidade, não por estilo: a primeira versão
    // era `a:not([class*="..."])`, e `:not()` herda a especificidade do
    // argumento — (0,1,1) — passando a vencer a `.link` (0,1,0) do próprio
    // componente. O portão acusou na hora: borderColor do link virou
    // `rgb(23,26,28) rgb(23,26,28) rgb(19,0,0)`, com os lados seguindo a cor do
    // shell em vez da do componente.
    'a { color: inherit; }' +
    "html, body { color: rgb(9, 9, 9) !important;" +
    " font-family: 'Roboto', sans-serif !important; }";
  document.head.appendChild(st);
  // Regra de autor com `!important` em `*`, não inline no <html>/<body>: o
  // starter declara os tokens em `body.theme`, mas o catálogo os declara num
  // DIV interno (`.editor-canvas`, style inline do FrameClient) — ancestral
  // nenhum alcança aquilo. Declaração de autor com !important vence style
  // inline sem !important, em qualquer nível da árvore.
  const tokens = document.createElement('style');
  tokens.id = 'funil-normaliza-paleta';
  tokens.textContent = `*, *::before, *::after {${ 
    Object.entries(paleta).map(([k, v]) => `${k}: ${v} !important;`).join('')  }}`;
  document.head.appendChild(tokens);
};

const medir = props => {
  const vis = [...document.querySelectorAll('[data-role]')].filter(n => {
    const r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  if (!vis.length) return [];
  const base = vis[0].getBoundingClientRect();
  return vis.map(n => {
    const r = n.getBoundingClientRect();
    const cs = getComputedStyle(n);
    const csPai = n.parentElement ? getComputedStyle(n.parentElement) : null;
    const st = {};
    for (const p of props) {
      // "possui" = computado diferente do pai. Herdado não é do componente.
      if (!csPai || cs[p] !== csPai[p]) st[p] = cs[p];
    }
    return {
      role: n.getAttribute('data-role'),
      texto: (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      w: +r.width.toFixed(2), h: +r.height.toFixed(2),
      dx: +(r.left - base.left).toFixed(2), dy: +(r.top - base.top).toFixed(2),
      st,
    };
  });
};

/** Primeiro token da pilha de fontes, sem aspas, minúsculo. */
const face = v => String(v).split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase();

const s = ms => new Promise(r => setTimeout(r, ms));

/**
 * Espera o iframe do canvas ter o componente PINTADO — pelo menos um
 * `[data-role]` com caixa. É o sinal que o estágio realmente precisa; o
 * `.ed-shell` aparece muito antes disso.
 */
async function esperarConteudo(page, timeout = 90000) {
  const inicio = Date.now();
  for (;;) {
    const f = page.frames().find(x => x.url().includes('frame-mobile'));
    if (f) {
      const n = await f
        .evaluate(() =>
          [...document.querySelectorAll('[data-role]')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          }).length
        )
        .catch(() => 0);
      if (n > 0) {
        // um respiro para o layout assentar depois da primeira pintura
        await s(400);
        return n;
      }
    }
    if (Date.now() - inicio > timeout)
      throw new Error('o canvas não pintou nenhum [data-role] em 90s');
    await s(250);
  }
}

async function medirStarter(browser, comp, largura) {
  const p = await browser.newPage();
  try {
    await p.setViewport({ width: largura, height: 1000, deviceScaleFactor: 1 });
    await p.goto(`${STARTER_URL}/dev-fidelity?component=${comp}`, {
      waitUntil: 'networkidle2', timeout: 180000,
    });
    await p.evaluate(() => document.fonts?.ready).catch(() => {});
    await s(1500);
    await p.evaluate(normalizar, PALETA);
    await s(200);
    return await p.evaluate(medir, PROPS);
  } finally {
    await p.close();
  }
}

async function medirCatalogo(browser, par, mobile) {
  const p = await browser.newPage();
  try {
    await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2', timeout: 180000 });
    await p.evaluate(
      (id, layoutKey, pagina) => {
        localStorage.clear();
        localStorage.setItem('layoutPlatform', 'VTEX');
        localStorage.setItem('layoutSelections',
          JSON.stringify([{ uid: 'u-fid', id, layoutKey, pagina }]));
        localStorage.setItem('panelLeftCollapsed', '1');
        localStorage.setItem('panelRightCollapsed', '1');
        localStorage.setItem('canvasZoom', 'fit');
      },
      par.id, par.layoutKey, par.pagina
    );
    await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2', timeout: 180000 });
    await p.waitForSelector('.ed-shell');

    // Esperar o CONTEÚDO, não o relógio. A primeira versão dormia 3500ms fixos
    // e passava rodando o estágio sozinho; no funil completo, com o dev server
    // já castigado pelos estágios anteriores, o clone mediu ZERO nós e o
    // clique no Mobile estourou. Sleep fixo é medida de sorte.
    await esperarConteudo(p);

    if (mobile) {
      // O botão existe no HTML antes de o React hidratar, e clique em botão
      // não hidratado não faz nada, em silêncio. Clicar, conferir, insistir.
      const clique = () => p.evaluate(() => {
        const b = [...document.querySelectorAll('button')]
          .find(x => /Mobile/.test(x.textContent || ''));
        if (!b) return 'ausente';
        if (b.getAttribute('aria-pressed') === 'true') return 'ja';
        b.click();
        return 'clicou';
      });
      let ligado = false;
      for (let tentativa = 0; tentativa < 12 && !ligado; tentativa++) {
        const res = await clique();
        if (res === 'ja') { ligado = true; break; }
        ligado = await p
          .waitForFunction(() => {
            const b = [...document.querySelectorAll('button')]
              .find(x => /Mobile/.test(x.textContent || ''));
            return b?.getAttribute('aria-pressed') === 'true';
          }, { timeout: 5000 })
          .then(() => true)
          .catch(() => false);
      }
      if (!ligado) throw new Error('a visão Mobile não ligou em 12 tentativas');
      await esperarConteudo(p);
    }

    const f = p.frames().find(x => x.url().includes('frame-mobile'));
    if (!f) throw new Error('iframe do canvas não encontrado');
    await f.evaluate(normalizar, PALETA);
    await s(200);
    return await f.evaluate(medir, PROPS);
  } finally {
    await p.close();
  }
}

function comparar(origem, clone, rotulo, falhas) {
  const chave = n => `${n.role}#${n.texto}`;
  const mapO = new Map(origem.map(n => [chave(n), n]));
  const mapC = new Map(clone.map(n => [chave(n), n]));

  if (!mapO.size) {
    falhas.push(`${rotulo}: ORIGEM sem nenhum [data-role] visível`);
    return 0;
  }
  if (!mapC.size) {
    falhas.push(`${rotulo}: CLONE sem nenhum [data-role] visível`);
    return 0;
  }

  let asserts = 0;
  for (const k of mapO.keys())
    if (!mapC.has(k)) falhas.push(`${rotulo}: nó "${k}" existe na origem e não no clone`);
  for (const k of mapC.keys())
    if (!mapO.has(k)) falhas.push(`${rotulo}: nó "${k}" existe no clone e não na origem`);

  for (const [k, o] of mapO) {
    const c = mapC.get(k);
    if (!c) continue;
    for (const eixo of ['w', 'h', 'dx', 'dy']) {
      asserts++;
      const d = Math.abs(o[eixo] - c[eixo]);
      if (d > TOL)
        falhas.push(`${rotulo}: ${k} · ${eixo} ${o[eixo]} → ${c[eixo]} (Δ ${d.toFixed(2)}px)`);
    }
    for (const p of PROPS) {
      if (!(p in o.st)) continue; // a origem não possui a propriedade neste nó
      asserts++;
      const a = p === 'fontFamily' ? face(o.st[p]) : o.st[p];
      const b = p === 'fontFamily' ? face(c.st[p] ?? '') : c.st[p];
      if (a !== b)
        falhas.push(`${rotulo}: ${k} · ${p} "${o.st[p]}" → "${c.st[p] ?? '(herdado)'}"`);
    }
  }
  return asserts;
}

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: 'shell',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1200, deviceScaleFactor: 1 },
});

const falhas = [];
let total = 0;
try {
  if (!PARES.length) {
    console.error('  nenhum par declarado — o portão não prova nada');
    process.exit(1);
  }
  for (const par of PARES) {
    for (const [rot, largura, mobile] of [['desktop', 1440, false], ['mobile', 375, true]]) {
      const rotulo = `${par.starter}/${rot}`;
      const origem = await medirStarter(browser, par.starter, largura);
      const clone = await medirCatalogo(browser, par, mobile);
      const n = comparar(origem, clone, rotulo, falhas);
      total += n;
      console.log(`  ${rotulo}: ${origem.length} nós · ${n} asserções`);
    }
  }
} finally {
  await browser.close();
}

// `N/M passam` é a forma que o funil lê para o placar (funil.mjs). Uma linha
// por asserção seriam 226 ✅ — o que importa é o placar e o detalhe das falhas.
if (falhas.length) {
  console.log(`\n  ${falhas.length} divergência(s):`);
  for (const f of falhas) console.log(`   ❌ ${f}`);
}
console.log(`  ${total - falhas.length}/${total} passam  (${PARES.length} componente(s))`);
process.exit(falhas.length ? 1 : 0);
