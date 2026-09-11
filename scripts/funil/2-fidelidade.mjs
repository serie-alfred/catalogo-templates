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
import { findChrome, BASE_URL, lerLayouts } from './lib/util.mjs';

const STARTER_URL = process.env.FUNIL_STARTER_URL ?? 'http://localhost:3000';
const TOL = 0.5;

/**
 * Os pares cobertos. Só entra aqui componente migrado com o contrato de
 * `data-role` espelhado dos dois lados — os migrados antes deste portão não têm
 * `data-role` no catálogo e ficam sem cobertura até serem revisitados.
 */
/**
 * `textoLivre`: papéis cujo TEXTO diverge POR CONTRATO entre os dois lados.
 *
 * O `/from-faststore` proíbe trazer o wordmark da marca de origem para o
 * catálogo — o preview é público e mostra o logo do usuário (`useLayout()`)
 * com fallback "SERIE//A". Então `brand-name` é "Brasilusa" na origem e
 * "SERIE//A" aqui, de propósito.
 *
 * A mesma regra vale para o NOME DA MARCA dentro do conteúdo: o mock da origem
 * diz "Clube VIP Brasilusa" e "curadoria Brasilusa" porque o starter é o repo
 * do componente daquele cliente; o catálogo é um produto público e não pode
 * exibir a marca de um cliente para outro.
 *
 * Esses nós são casados por papel + ordem (não por texto) e têm a GEOMETRIA
 * dispensada — largura de texto diferente é a consequência esperada de texto
 * diferente. O que continua valendo: eles existem nos dois lados, na mesma
 * quantidade, e as propriedades de CSS que o nó possui batem.
 */
export const PARES = [
  { starter: 'BenefitsStrip07', id: '03', layoutKey: 'ruler', pagina: 'home' },
  {
    starter: 'SocialProof07',
    id: '07',
    layoutKey: 'review',
    pagina: 'home',
    textoLivre: ['sp-subtitle'],
  },
  { starter: 'EditorialBanner07', id: '07', layoutKey: 'bannerSideLeft', pagina: 'home' },
  { starter: 'Categories07', id: '07', layoutKey: 'categories', pagina: 'home' },
  { starter: 'BannerSide06', id: '06', layoutKey: 'bannerSide', pagina: 'home' },
  { starter: 'BannerMain07', id: '07', layoutKey: 'banner', pagina: 'home' },
  { starter: 'ShopByRoom07', id: '07', layoutKey: 'rooms', pagina: 'home' },
  {
    starter: 'Newsletter07',
    id: '07',
    layoutKey: 'newsletter',
    pagina: 'home',
    textoLivre: ['nl-eyebrow'],
  },
  { starter: 'Categories06', id: '06', layoutKey: 'buySize', pagina: 'home' },
  { starter: 'HelpFloatButton06', id: '06', layoutKey: 'helpFloat', pagina: 'home' },
  { starter: 'BannerGrid06', id: '06', layoutKey: 'grid', pagina: 'home' },
  { starter: 'BannerCarousel06', id: '06', layoutKey: 'productLines', pagina: 'home' },
  { starter: 'ProductDescriptionBanner01', id: '01', layoutKey: 'productBanner', pagina: 'product' },
  { starter: 'CategoryTitle06', id: '06', layoutKey: 'categoryTitle', pagina: 'category' },
  { starter: 'MainCategory07', id: '07', layoutKey: 'categoryMain', pagina: 'category' },
  { starter: 'ProductDetails07', id: '04', layoutKey: 'productInfo', pagina: 'product' },
  {
    starter: 'Header07',
    id: '07',
    layoutKey: 'header',
    pagina: 'common',
    textoLivre: ['brand-name', 'm-brand-name'],
  },
  {
    starter: 'Footer07',
    id: '07',
    layoutKey: 'footer',
    pagina: 'common',
    textoLivre: ['brand-name', 'm-brand-name', 'copyright', 'm-copyright', 'nl-eyebrow'],
  },
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
/**
 * Paleta de NÍVEL 1 do par — uma cor/fonte única por variável do
 * `variablesSchema` do item, injetada nos DOIS lados.
 *
 * Sem isto o portão é cego para o erro que mais importa no elo frágil do
 * pipeline: ler a var de nível 1 ERRADA. Medido — troquei `--pdp-title-color`
 * por `--pdp-accent` dentro do `.price` do clone e o portão passou verde, porque
 * as duas caem no mesmo fallback de nível 2 (`--text-primary-color`) e ninguém
 * declara nível 1 na hora da medição. Com uma cor por var, o papel trocado pinta
 * diferente e aparece. O nível 3 continua coberto pelo `1-variaveis`.
 *
 * Fonte vira uma família inexistente de propósito: o que se compara é o
 * `font-family` computado (string), e o fallback `monospace` é o mesmo dos dois
 * lados, então a geometria segue comparável.
 */
function paletaNivel1(par, layouts) {
  const item = layouts[par.layoutKey]?.items.find(i => i.id === par.id);
  const schema = item?.variablesSchema ?? [];
  const fora = {};
  schema.forEach((v, i) => {
    fora[v.cssVar] =
      v.type === 'font' ? `'Sonda${i}', monospace` : `rgb(0, ${31 + i}, 0)`;
  });
  return fora;
}

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
    " font-family: 'Roboto', sans-serif !important;" +
    // `line-height` entra na mesma lista: o starter herda 1.15 do shell e aqui
    // é `normal`. Deu 2px de deslocamento e um `16.1px → normal` no
    // CategoryTitle06, com o componente não declarando nada.
    ' line-height: normal !important; }' +
    // Quinta baseline: CONTROLE DE FORMULÁRIO não herda line-height igual nas
    // duas casas. No starter o botão fica com 18.4px (o shell do FastStore) e
    // aqui ele herda da raiz — então `line-height: normal` declarado pelo
    // componente "possui" a propriedade de um lado e não do outro, e o portão
    // via 6 divergências no Header07 em que os dois valores eram IGUAIS.
    // Como as outras, é do shell: nenhum componente declara isso no botão.
    //
    // `font-family: inherit` pelo mesmo motivo, e é o mais sutil dos seis:
    // controle de formulário NÃO herda a fonte por padrão do navegador, e cada
    // shell resolve isso de um jeito. O `×` de fechar um chip do MainCategory07
    // media 9,02px no starter e 8,19px aqui — com o DOM, o padding, o gap e o
    // font-size idênticos. Sobrava 0,7px em cada chip.
    //
    // Sétima: `padding`. `src/styles/globals.css` do catálogo tem
    // `* { box-sizing: border-box; padding: 0; margin: 0 }`; o shell do starter
    // não zera o UA padding do <button> (1px 6px). O `.ctaBuy` do
    // ProductDetails07 não declara padding nenhum nos dois lados, e mesmo assim
    // o portão via "1px 6px" → "0px" — com `h` batendo (border-box + altura
    // fixa), ou seja, sem consequência visual. Como as outras, some por
    // especificidade: o seletor de elemento (0,0,1) perde para qualquer
    // `.classe` que o componente declare.
    'button, input, select, textarea { line-height: normal;' +
    ' font-family: inherit; padding: 0; }';
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
    // `st` = o que o nó POSSUI (computado diferente do pai) — decide o que
    // vale asserção. `tudo` = o computado inteiro — é contra ele que se
    // compara. Separar os dois importa: comparar possuído-contra-possuído
    // dava falso vermelho sempre que a coincidência com o pai mudava de um
    // lado para o outro, com os dois valores IGUAIS na tela.
    const st = {};
    const tudo = {};
    for (const p of props) {
      tudo[p] = cs[p];
      if (!csPai || cs[p] !== csPai[p]) st[p] = cs[p];
    }
    // Texto PRÓPRIO do nó (só os filhos-texto diretos), não a subárvore.
    // Com `textContent` da subárvore, trocar o wordmark da marca por
    // "SERIE//A" mudava a chave de TODOS os ancestrais — `grid`, `col`,
    // `bottom`, `footer` — e o portão acusava 10 nós inexistentes dos dois
    // lados. O texto próprio mantém o sinal onde ele importa (a folha) e
    // deixa os contêineres para o ordinal.
    const proprio = [...n.childNodes]
      .filter(x => x.nodeType === 3)
      .map(x => x.textContent)
      .join('')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 40);
    return {
      role: n.getAttribute('data-role'),
      texto: proprio,
      w: +r.width.toFixed(2), h: +r.height.toFixed(2),
      dx: +(r.left - base.left).toFixed(2), dy: +(r.top - base.top).toFixed(2),
      st, tudo,
    };
  });
};

/** Primeiro token da pilha de fontes, sem aspas, minúsculo. */
const face = v => String(v).split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase();

const s = ms => new Promise(r => setTimeout(r, ms));

const NOME_DA_PAGINA = {
  common: 'Todas as páginas',
  home: 'Homepage',
  category: 'Página de Categoria',
  product: 'Página de Produto',
};

/**
 * Troca a página ativa do editor. Item de PDP/PLP só é renderizado pelo canvas
 * quando a página correspondente está selecionada — sem isso o clone media zero
 * nós e o portão reprovava um componente correto.
 *
 * Rotina emprestada do `2-render`, pelo mesmo motivo dela: o gatilho existe no
 * HTML antes de o React hidratar, e clique em botão não hidratado não faz nada,
 * em silêncio. Clicar, conferir, insistir.
 */
async function trocarPagina(page, pagina) {
  const alvo = NOME_DA_PAGINA[pagina === 'common' ? 'home' : pagina];
  if (!alvo || alvo === 'Homepage') return;
  const TRIG =
    "const t=[...document.querySelectorAll('[aria-haspopup=\"listbox\"]')]" +
    '.find(b=>/Homepage|Todas as p\u00e1ginas|P\u00e1gina de/.test(b.textContent));';
  await page.waitForFunction(new Function(`${TRIG}return !!t`), {
    timeout: 30000,
    polling: 250,
  });
  const QUATRO =
    "return (document.querySelector('[role=\"listbox\"][aria-label=\"P\u00e1gina\"]')" +
    "?.querySelectorAll('[role=\"option\"]').length ?? 0) === 4;";
  const limite = Date.now() + 40000;
  let abriu = false;
  while (Date.now() < limite && !abriu) {
    abriu = await page.evaluate(new Function(QUATRO));
    if (abriu) break;
    await page.evaluate(new Function(`${TRIG}t?.click()`));
    // ESPERAR o menu, não dormir 400ms e clicar de novo: o gatilho é um toggle,
    // então a versão anterior FECHAVA o que tinha acabado de abrir sempre que o
    // editor demorava mais que isso. Sozinho o estágio passava; no funil
    // completo, com o dev server já castigado, ele morria aqui com "o seletor
    // de página não abriu com 4 opções" — no MainCategory07, o 15º par.
    abriu = await page
      .waitForFunction(new Function(QUATRO), { timeout: 8000, polling: 150 })
      .then(() => true)
      .catch(() => false);
  }
  if (!abriu) throw new Error('o seletor de página não abriu com 4 opções');
  await page.evaluate(nome => {
    [
      ...document.querySelectorAll(
        '[role="listbox"][aria-label="P\u00e1gina"] [role="option"]'
      ),
    ]
      .find(x => x.textContent.trim() === nome)
      ?.click();
  }, alvo);
  await page.waitForFunction(
    new Function('nome', `${TRIG}return t && t.textContent.trim().startsWith(nome)`),
    { timeout: 30000, polling: 250 },
    alvo
  );
}

/**
 * Roda `fn` no iframe do canvas, RE-RESOLVENDO o frame a cada tentativa.
 *
 * O frame pode ser trocado entre o momento em que você o acha e o momento em
 * que avalia nele — hot-reload do Next, uma remontagem do canvas — e o
 * puppeteer devolve "Execution context was destroyed". Não é falha do
 * componente: é o portão perdendo a corrida. Foi o que derrubou o estágio na
 * primeira execução do funil completo.
 */
async function noFrame(page, fn, tentativas = 6) {
  let ultimo;
  for (let t = 0; t < tentativas; t++) {
    const f = page.frames().find(x => x.url().includes('frame-mobile'));
    if (f) {
      try {
        return await fn(f);
      } catch (e) {
        ultimo = e;
        if (!/destroyed|detached|Target closed/i.test(String(e))) throw e;
      }
    }
    await s(500);
  }
  throw ultimo ?? new Error('iframe do canvas não encontrado');
}

/**
 * Espera o iframe do canvas ter o componente PINTADO — pelo menos um
 * `[data-role]` com caixa. É o sinal que o estágio realmente precisa; o
 * `.ed-shell` aparece muito antes disso.
 */
async function esperarConteudo(page, timeout = 90000) {
  const inicio = Date.now();
  for (;;) {
    const n = await noFrame(page, f =>
      f.evaluate(
        () =>
          [...document.querySelectorAll('[data-role]')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          }).length
      )
    ).catch(() => 0);
    if (n > 0) {
      // um respiro para o layout assentar depois da primeira pintura
      await s(400);
      return n;
    }
    if (Date.now() - inicio > timeout)
      throw new Error('o canvas não pintou nenhum [data-role] em 90s');
    await s(250);
  }
}

async function medirStarter(browser, comp, largura, altura, paleta) {
  const p = await browser.newPage();
  try {
    await p.setViewport({ width: largura, height: altura, deviceScaleFactor: 1 });
    await p.goto(`${STARTER_URL}/dev-fidelity?component=${comp}`, {
      waitUntil: 'networkidle2', timeout: 180000,
    });
    await p.evaluate(() => document.fonts?.ready).catch(() => {});
    await s(1500);
    await p.evaluate(normalizar, paleta);
    await s(200);
    return await p.evaluate(medir, PROPS);
  } finally {
    await p.close();
  }
}

async function medirCatalogo(browser, par, mobile, paleta) {
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
    await trocarPagina(p, par.pagina);

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

    // normalizar e medir na MESMA volta: se o contexto morrer entre as duas, a
    // medição sairia sem a normalização e o portão reprovaria por nada.
    return await noFrame(p, async f => {
      await f.evaluate(normalizar, paleta);
      await s(200);
      const nos = await f.evaluate(medir, PROPS);
      // A altura do scrollport vai junto porque a origem precisa medir DENTRO
      // dela — ver o comentário do laço.
      const altura = await f.evaluate(() => window.innerHeight);
      return { nos, altura };
    });
  } finally {
    await p.close();
  }
}

function comparar(origem, clone, rotulo, falhas, textoLivre = []) {
  const livre = new Set(textoLivre);
  // papel livre entra por papel + ordem; o resto, por papel + texto
  const chaveador = () => {
    const ordem = new Map();
    return n => {
      // sem texto próprio (contêiner) ou papel de texto livre → papel + ordem
      if (n.texto && !livre.has(n.role)) return `${n.role}#${n.texto}`;
      const i = (ordem.get(n.role) ?? 0) + 1;
      ordem.set(n.role, i);
      return `${n.role}#${i}`;
    };
  };
  const chaveO = chaveador();
  const chaveC = chaveador();
  const mapO = new Map(origem.map(n => [chaveO(n), n]));
  const mapC = new Map(clone.map(n => [chaveC(n), n]));

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
    // geometria dispensada onde o texto diverge por contrato
    if (!livre.has(o.role))
      for (const eixo of ['w', 'h', 'dx', 'dy']) {
        asserts++;
        const d = Math.abs(o[eixo] - c[eixo]);
        if (d > TOL)
          falhas.push(`${rotulo}: ${k} · ${eixo} ${o[eixo]} → ${c[eixo]} (Δ ${d.toFixed(2)}px)`);
      }
    for (const p of PROPS) {
      if (!(p in o.st)) continue; // a origem não ESTABELECE a propriedade aqui
      asserts++;
      // ...mas compara contra o COMPUTADO do clone: o que importa é o que
      // pinta na tela, não se ele coincide com o pai dele.
      const a = p === 'fontFamily' ? face(o.st[p]) : o.st[p];
      const b = p === 'fontFamily' ? face(c.tudo[p] ?? '') : c.tudo[p];
      if (a !== b)
        falhas.push(`${rotulo}: ${k} · ${p} "${o.st[p]}" → "${c.tudo[p] ?? '(ausente)'}"`);
    }
  }
  return asserts;
}

// FIDELIDADE_SO=<Nome> roda um par só (iteração durante a migração). O funil
// nunca seta a variável, então o placar dele continua vendo os N pares.
let so, pares;
const LAYOUTS = lerLayouts();

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: 'shell',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1200, deviceScaleFactor: 1 },
});

const falhas = [];
let total = 0;
try {
  // FIDELIDADE_SO=<Nome> roda um par só — é para iterar durante a migração.
  // O funil nunca seta a variável, então o placar dele continua vendo os N pares.
  so = process.env.FIDELIDADE_SO;
  pares = so ? PARES.filter(p => p.starter === so) : PARES;
  if (so && !pares.length) {
    console.error(`  FIDELIDADE_SO=${so} não casa com nenhum par declarado`);
    process.exit(1);
  }
  if (!PARES.length) {
    console.error('  nenhum par declarado — o portão não prova nada');
    process.exit(1);
  }
  for (const par of pares) {
    for (const [rot, largura, mobile] of [['desktop', 1440, false], ['mobile', 375, true]]) {
      const rotulo = `${par.starter}/${rot}`;
      // O CLONE mede primeiro porque é ele quem define a altura do scrollport:
      // o editor dá ao iframe uma altura própria (1104px na PDP), e a origem
      // media numa janela de altura fixa. Para `position: sticky`, isso não é
      // detalhe — o `.mStickyCta` do ProductDetails07 ficava GRAMPEADO no
      // rodapé de um scrollport e em posição de fluxo no outro, e a mesma regra
      // idêntica dos dois lados dava 104px de diferença (768px quando subi a
      // janela da origem para 2400). Medir os dois na mesma altura faz o
      // grampo acontecer no mesmo lugar — sem dispensar asserção nenhuma.
      const paleta = { ...PALETA, ...paletaNivel1(par, LAYOUTS) };
      const { nos: clone, altura } = await medirCatalogo(browser, par, mobile, paleta);
      const origem = await medirStarter(browser, par.starter, largura, altura, paleta);
      const n = comparar(origem, clone, rotulo, falhas, par.textoLivre);
      total += n;
      const nLivres = origem.filter(x => (par.textoLivre ?? []).includes(x.role)).length;
      console.log(
        `  ${rotulo}: ${origem.length} nós · ${n} asserções${ 
          nLivres ? ` (${nLivres} com texto livre: geometria dispensada)` : ''}`
      );
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
console.log(`  ${total - falhas.length}/${total} passam  (${pares.length} componente(s))`);
process.exit(falhas.length ? 1 : 0);
