/**
 * Estágio 2-checkout — o modo Checkout do /gerador, no navegador.
 *
 * O que ele prova, na ordem em que o usuário encontra:
 *
 *  1. o modo só existe em VTEX (sem o alternador em Wake; `editorMode` guardado
 *     de outra sessão não sobrevive a uma plataforma que não é VTEX), entra e
 *     sai pela UI, e TROCAR DE PLATAFORMA pela UI sai do modo Checkout;
 *  2. trocar uma cor GLOBAL muda o checkout (nível 2): o nó-sonda do papel que
 *     herda e o header, que é recomposto porque leva os tokens escopados; a cor
 *     da loja que some no fundo cai na GUARDA de visibilidade (gate0 #14a/#16),
 *     e o painel diz isso; o campo hex digitado com o seletor ABERTO não vira
 *     `#NaN…` (o defeito do ColorPicker, consertado em `ColorPicker/hex.ts`);
 *  3. cada papel do painel, mudado pela UI, muda o seu nó-sonda E nós REAIS do
 *     modelo na fixture (cor, fundo, borda ou fonte de nó visível); e o alcance
 *     direto: cada papel pinta nó real em alguma das 10 fixtures, com o cartão;
 *  4. a fonte chega com os pesos 300–700 ao documento do checkout;
 *  5. o logo da Identidade entra no slot do header reduzido a ≤ 280×64;
 *  6. desfazer/refazer (do editor e de dentro do iframe) e o reload;
 *  7. clique e submit dentro da fixture não navegam nem enviam; os botões de etapa
 *     ("Seguir com o pedido", "Ir para…", "Editar") trocam a fixture do preview;
 *  8. cada uma das 5 etapas carrega em 1280 e em 390, com o tema aplicado — no
 *     pagamento também no iframe do cartão, com a altura pela `scrollHeight`;
 *  9. EQUIVALÊNCIA 0 px: `<link>` da base + `<style>` do emitTokens pinta o mesmo
 *     pixel que o arquivo composto pelo compose do mesmo SHA (carrinho e
 *     pagamento com o cartão, 1280 e 390) — e a mesma régua ACUSA um papel
 *     trocado, senão a igualdade não mediria nada;
 * 10. o export leva `faststore.checkout` e o MESMO logo que o preview mostra; um
 *     logo por URL https passa como veio (não lança), e um logo que o compose
 *     não embute vira aviso no painel, com o de exemplo no canvas (gate0 #17);
 * 11. a rota `/p/{id}/checkout/{etapa}` com o armazenamento LOCAL (KV desligado:
 *     `.preview-store/`, provado antes de gravar qualquer coisa): 200 com
 *     snapshot VTEX válido e o tema dele no frame; um snapshot com valores
 *     injetados abre FILTRADO (o `<style id="ck-tokens">` é o emitTokens só do
 *     que o compose aceita, nada executa); 404 para snapshot Tray (com ou sem o
 *     bloco `checkout`), etapa inválida e id inexistente.
 *
 * E, no caminho: o rodapé do preview mostra texto de EXEMPLO no lugar de
 * razão social, CNPJ e aviso legal, e o painel diz que o arquivo sai com os
 * placeholders (gate0 #26; o 3-export confere o arquivo); o texto do header e o
 * passo ativo do stepper seguem o FUNDO do header — header escuro troca o texto
 * da página pelo contraste calculado (gate0 #23).
 *
 * Nó-sonda: um <span> injetado no documento do checkout com
 * `color: var(--ck01-<papel>)` — prova a cadeia inteira (estado →
 * `<style id="ck-tokens">` → alias do 00-tokens → valor computado). Nó REAL: o
 * que a fixture já tem, visível, com a propriedade pintada de fato (texto
 * próprio para cor e fonte, fundo não transparente, borda com largura).
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BASE_URL, RAIZ, SAIDA, relatorio, espera } from './lib/util.mjs';
import { abrirBrowser, novaAba, clicarDeVerdade, irParaRail } from './lib/editor.mjs';
import { DEST, MODELO } from './lib/checkout.mjs';
import { colorSafeOnWhite } from '../../src/utils/themeStyle.ts';
import { EXEMPLO_DO_RODAPE, PLACEHOLDERS_DO_RODAPE } from '../../src/utils/checkoutExemplo.ts';
import { corDoSeletor, ehHexCompleto, validaOuPreto } from '../../src/components/gerador/ColorPicker/hex.ts';

const r = relatorio('estágio 2-checkout · o modo Checkout do /gerador');

// O conserto do ColorPicker é puro: o seletor só recebe hex completo.
r.ok(
  'ColorPicker/hex.ts: hex parcial não chega ao seletor (fica a última cor válida); completo passa',
  corDoSeletor('#c', '#123456') === '#123456' &&
    corDoSeletor('#c0121', '#123456') === '#123456' &&
    corDoSeletor('#NaNNaNNaN', '#123456') === '#123456' &&
    corDoSeletor('#c0121c', '#123456') === '#c0121c' &&
    corDoSeletor('#abc', '#123456') === '#abc' &&
    !ehHexCompleto('#1234') &&
    validaOuPreto('#12') === '#000000'
);
const DIR = path.join(SAIDA, 'checkout');
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

const model = JSON.parse(fs.readFileSync(DEST.modelo, 'utf8'));
const versao = JSON.parse(fs.readFileSync(DEST.version, 'utf8'));
const { composeCheckout, emitTokens } = await import(pathToFileURL(path.join(DEST.lib, 'compose.mjs')).href);
const { normalizeHex, parseFontValue, isFontFamily, textoLegivel } = await import(pathToFileURL(path.join(DEST.lib, 'derive.mjs')).href);
const { isFontKey } = await import(pathToFileURL(path.join(DEST.lib, 'level2.mjs')).href);
/*
 * Os mesmos dois filtros do preview (src/utils/checkout.ts: `variaveisValidas`
 * e `nivel2DoPreview`), escritos de novo aqui de propósito: se o app deixar de
 * filtrar, ou filtrar outra coisa, o `<style id="ck-tokens">` deixa de bater
 * byte a byte com o emitTokens abaixo.
 */
const nivel1Valido = (vars, papeis) =>
  Object.fromEntries(
    Object.entries(vars ?? {}).filter(([k, v]) => {
      const pp = papeis.find(x => x.cssVar === k);
      return pp && (pp.type === 'color' ? normalizeHex(v) : parseFontValue(v));
    })
  );
const nivel2Valido = vars =>
  Object.fromEntries(Object.entries(vars).filter(([k, v]) => (isFontKey(k) ? isFontFamily(v) : normalizeHex(v))));
const PAINEL = model.papeis.filter(p => p.painel);
const ETAPAS = [
  ['carrinho', 'Carrinho'],
  ['email', 'E-mail'],
  ['perfil', 'Identificação'],
  ['entrega', 'Entrega'],
  ['pagamento', 'Pagamento'],
];
const FRAME = 'iframe[data-checkout-frame]';
const rgb = hex => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.replace(/./g, c => c + c) : h;
  return `rgb(${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)})`;
};

/*
 * Rasterização em software e sem raster parcial: com a da GPU, os 2 px de borda
 * do lápis do "Editar" (mask-image SVG em x = 289,8) alternavam entre dois
 * valores de captura para captura, SEM nada mudar no DOM (medido em 25/09: 20
 * capturas seguidas, 8 num valor e 12 no outro) — era o "4 px de antialias no
 * pagamento-390". Em software ficou determinístico, e o raster parcial deixava
 * 27 px de 1 nível nos cantos do "Cartão de crédito" (pintado aos pedaços no par
 * link+tokens, inteiro no composto). Com as duas flags: 0 px nas 4 equivalências,
 * de novo, com a CPU a 4×.
 */
const b = await abrirBrowser({ argsExtra: ['--disable-gpu-rasterization', '--disable-partial-raster'] });
const { page: p, erros } = await novaAba(b);
const dialogos = [];
p.on('dialog', d => dialogos.push(d.message().slice(0, 160)));
// O export em localhost BAIXA (PNGs + config.json): para a pasta do estágio,
// nunca para os Downloads de quem roda.
await (await p.createCDPSession()).send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DIR });

/** localStorage limpo + as chaves dadas + reload. */
async function semear(chaves) {
  await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.evaluate(kv => {
    localStorage.clear();
    for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v);
  }, chaves);
  await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForSelector('.ed-shell', { timeout: 120000 });
  await esperarHidratar();
}

/**
 * O rail e o shell vêm no HTML do servidor, antes de o React hidratar — e
 * clique em botão não hidratado some em silêncio. Dois sinais: o React ligou o
 * shell (as props dele no nó) e o hook hidratou (o save das fontes só grava
 * depois de `hydrated`; depois de um reload ele já está lá, e quem segue espera
 * o frame, que só nasce depois da hidratação).
 */
async function esperarHidratar() {
  await p.waitForFunction(
    () => {
      const shell = document.querySelector('.ed-shell');
      return !!shell && Object.keys(shell).some(k => k.startsWith('__reactProps$')) && localStorage.getItem('fonts') !== null;
    },
    { timeout: 90000, polling: 200 }
  );
}

/** Espera o CheckoutFrame da etapa/vp pedidos ter aplicado base, tokens, header e footer. */
async function esperarFrame(etapa, vp, timeout = 60000) {
  return p
    .waitForFunction(
      (sel, et, v) => {
        const f = document.querySelector(sel);
        if (!f || f.dataset.etapa !== et || f.dataset.vp !== String(v) || f.dataset.pronto !== '1') return false;
        // O documento já mostra o que foi pedido (os efeitos do CheckoutFrame rodaram).
        if (!f.dataset.pedido || f.dataset.aplicado !== f.dataset.pedido) return false;
        const d = f.contentDocument;
        if (!d || d.readyState !== 'complete' || !d.location.pathname.endsWith(`/${et}.${v}.html`)) return false;
        // No pagamento, o iframe do cartão também tem de estar pintado.
        const ci = d.querySelector('iframe[src$=".card.html"]');
        const cd = ci?.contentDocument;
        const cartaoOk =
          !ci ||
          (!!cd &&
            cd.readyState === 'complete' &&
            !!cd.getElementById('ck-base')?.sheet &&
            cd.getElementById('ck-tokens')?.textContent === d.getElementById('ck-tokens')?.textContent);
        return (
          d.documentElement.classList.contains(`ck01-step-${et}`) &&
          !!d.querySelector('.etm-header') &&
          !!d.querySelector('.etm-footer') &&
          /^:root \{/.test(d.getElementById('ck-tokens')?.textContent ?? '') &&
          !!d.getElementById('ck-base')?.sheet &&
          cartaoOk
        );
      },
      { timeout, polling: 250 },
      FRAME,
      etapa,
      vp
    )
    .then(() => true)
    .catch(() => false);
}

/**
 * Depois de uma mudança pela UI: espera o CheckoutFrame declarar o estado de
 * agora aplicado no MESMO documento (`data-aplicado` = `data-pedido`, sem troca
 * de documento no meio) e um quadro pintado (rAF duplo no iframe). É o que o
 * `espera(ms)` fixo tentava adivinhar — e a máquina carregada não respeita.
 */
async function esperarAplicado(timeout = 60000) {
  const ok = await p
    .waitForFunction(
      sel => {
        const f = document.querySelector(sel);
        const d = f?.contentDocument;
        return (
          f?.dataset.pronto === '1' &&
          !!f.dataset.pedido &&
          f.dataset.aplicado === f.dataset.pedido &&
          d?.readyState === 'complete' &&
          !!d.getElementById('ck-base')
        );
      },
      { timeout, polling: 100 },
      FRAME
    )
    .then(() => true)
    .catch(() => false);
  if (ok) await quadroDoFrame();
  return ok;
}
/** Dois requestAnimationFrame no documento do checkout: o estado aplicado já foi pintado. */
const quadroDoFrame = () =>
  p.evaluate(sel => {
    const w = document.querySelector(sel)?.contentWindow;
    // Aba em segundo plano não roda rAF: o prazo evita pendurar o estágio.
    return w ? Promise.race([new Promise(ok => w.requestAnimationFrame(() => w.requestAnimationFrame(ok))), new Promise(ok => setTimeout(ok, 10000))]) : null;
  }, FRAME);
/** Espera a sonda de um papel pintar `valor` (o computado); devolve se chegou. */
const esperarSonda = (cssVar, valor, timeout = 30000) =>
  p
    .waitForFunction(
      (sel, v, esperado) => {
        const d = document.querySelector(sel)?.contentDocument;
        const s = d?.querySelector(`#funil-sondas [data-sonda="${v}"]`);
        return !!s && d.defaultView.getComputedStyle(s).color === esperado;
      },
      { timeout, polling: 100 },
      FRAME,
      cssVar,
      valor
    )
    .then(() => true)
    .catch(() => false);

/** Um <span> por papel do painel, pintado pelo alias `--ck01-*`. */
const injetarSondas = () =>
  p.evaluate(
    (sel, papeis) => {
      const d = document.querySelector(sel).contentDocument;
      d.getElementById('funil-sondas')?.remove();
      const box = d.createElement('div');
      box.id = 'funil-sondas';
      box.style.cssText = 'position:absolute;left:-9999px;top:0';
      for (const pp of papeis) {
        const s = d.createElement('span');
        s.dataset.sonda = pp.cssVar;
        s.textContent = 'x';
        s.style[pp.type === 'font' ? 'fontFamily' : 'color'] = `var(${pp.alias})`;
        box.appendChild(s);
      }
      d.body.appendChild(box);
    },
    FRAME,
    PAINEL.map(x => ({ cssVar: x.cssVar, alias: x.alias, type: x.type }))
  );
const lerSondas = () =>
  p.evaluate(sel => {
    const d = document.querySelector(sel).contentDocument;
    const out = {};
    for (const s of d.querySelectorAll('#funil-sondas [data-sonda]')) {
      const cs = d.defaultView.getComputedStyle(s);
      out[s.dataset.sonda] = s.style.fontFamily ? cs.fontFamily : cs.color;
    }
    return out;
  }, FRAME);
/**
 * O que os nós REAIS da fixture pintam — página e, no pagamento, o cartão —,
 * um texto por nó VISÍVEL, na ordem do DOM (a sonda fica de fora). Só conta a
 * propriedade que chega ao pixel: cor e fonte de nó com texto próprio (ou
 * campo), fundo não transparente, borda com largura, `fill`/`stroke` de SVG.
 * Roda no navegador; `docs` é a lista de documentos.
 */
function pinturaDosDocs(docs) {
  const out = [];
  for (const d of docs) {
    const w = d.defaultView;
    // O <html> e o <body> contam: o fundo da página mora num deles.
    for (const el of [d.documentElement, d.body, ...d.querySelectorAll('body *')]) {
      if (el.closest('#funil-sondas') || /^(SCRIPT|STYLE|LINK|META|IFRAME|BR)$/.test(el.tagName)) continue;
      if (!el.getClientRects().length) continue;
      const cs = w.getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
      const raiz = el === d.documentElement || el === d.body;
      const temTexto =
        (!raiz && [...el.childNodes].some(n => n.nodeType === 3 && n.data.trim())) ||
        /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName);
      const partes = [];
      if (temTexto) partes.push(`c:${cs.color}`, `f:${cs.fontFamily}`);
      if (!/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)) partes.push(`bg:${cs.backgroundColor}`);
      for (const lado of ['Top', 'Right', 'Bottom', 'Left'])
        if (parseFloat(cs[`border${lado}Width`]) > 0 && cs[`border${lado}Style`] !== 'none')
          partes.push(`b${lado[0]}:${cs[`border${lado}Color`]}`);
      if (el instanceof w.SVGElement) partes.push(`fill:${cs.fill}`, `stroke:${cs.stroke}`);
      out.push(partes.join('|'));
    }
  }
  return out;
}
/**
 * Espera as transições CSS dos documentos terminarem (a CSS da VTEX na fixture
 * anima cor, fundo e borda de botão e link): antes disso a leitura pega o valor
 * no meio do caminho, e o nó que o papel ANTERIOR mexeu, ainda voltando à base,
 * conta para o papel de agora. Medido em 26/09 no alcance direto, com as mesmas
 * variantes: accent 1↔2 e text-muted 3↔7 de uma repetição para outra (e o
 * "nós reais por papel" diferente em cada rodada); esperando as transições, 3
 * repetições idênticas. Prazo por volta, para aba em segundo plano não pendurar.
 * Roda no navegador.
 */
async function assentarTransicoes(docs) {
  for (let k = 0; k < 20; k++) {
    const vivas = docs
      .flatMap(d => d.getAnimations())
      .filter(a => 'transitionProperty' in a && a.playState === 'running');
    if (!vivas.length) return true;
    await Promise.race([Promise.allSettled(vivas.map(a => a.finished)), new Promise(ok => setTimeout(ok, 2000))]);
  }
  return false;
}
/** Os documentos da fixture no canvas: a página e, se houver, o cartão. */
const pintura = () =>
  p.evaluate(
    async (sel, fn, fa) => {
      const d = document.querySelector(sel).contentDocument;
      const cd = d.querySelector('iframe[src$=".card.html"]')?.contentDocument;
      const docs = cd ? [d, cd] : [d];
      await new Function(`return (${fa})`)()(docs);
      return new Function(`return (${fn})`)()(docs);
    },
    FRAME,
    pinturaDosDocs.toString(),
    assentarTransicoes.toString()
  );
const diferentes = (a, b) => {
  if (a.length !== b.length) return Math.max(a.length, b.length);
  let n = 0;
  for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) n++;
  return n;
};

const noHeader = () =>
  p.evaluate(sel => {
    const d = document.querySelector(sel).contentDocument;
    const h = d.querySelector('.etm-header');
    const f = d.querySelector('.etm-footer');
    const ch = d.defaultView.getComputedStyle(h);
    return {
      bg: ch.backgroundColor,
      cor: ch.color,
      fonte: ch.fontFamily,
      footerBg: d.defaultView.getComputedStyle(f).backgroundColor,
      logo: d.querySelector('.etm-header__logo-img')?.getAttribute('src') ?? '',
      logoW: d.querySelector('.etm-header__logo-img')?.naturalWidth ?? 0,
      logoH: d.querySelector('.etm-header__logo-img')?.naturalHeight ?? 0,
    };
  }, FRAME);
/*
 * `captureBeyondViewport: false` em TODA captura com recorte. O padrão do
 * Puppeteer (true) faz o Chrome redimensionar a janela durante a captura — sob
 * carga a aba chegou a ver `resize` para 1×1 e para a largura do recorte (390) —,
 * e o `useIsMobile` do /gerador (≤ 768) trocava o editor inteiro pelo
 * DesktopOnlyNotice: o shell desmontava e voltava com um iframe NOVO. Era isso o
 * "iframe trocado no meio do passo" (sondas somem, `#ck-base` null, captura
 * branca). Os recortes daqui cabem na janela de 1920×1080.
 */
const shotDoFrame = async nome => {
  const el = await p.$(`${FRAME}`);
  const stage = await el.evaluateHandle(e => e.parentElement);
  await stage.asElement().screenshot({ path: path.join(DIR, nome), captureBeyondViewport: false });
};

/**
 * Escreve um valor num campo de cor por label (o painel da direita ou o da
 * esquerda), COM o seletor aberto — o caminho de quem digita: o foco no campo
 * abre o popover. Volta `{ ok, valores }`: o texto do campo depois de CADA
 * tecla, para provar que nenhum `#NaN…` do react-colorful o sobrescreveu.
 */
async function digitarCor(escopo, label, hex) {
  const sel = `${escopo} input[aria-label="${label}"]`;
  if (!(await p.$(sel))) {
    // Ainda herda: o swatch "Definir <label>" abre o picker e um clique no
    // quadro de saturação dá um valor próprio — só então aparece o campo hex.
    const ok = await clicarDeVerdade(p, `${escopo} button[aria-label="Definir ${label}"]`);
    if (!ok) return { ok: false, valores: [] };
    await p.waitForSelector('[data-ed-portal] .react-colorful__saturation', { timeout: 15000 });
    const sat = await p.$('[data-ed-portal] .react-colorful__saturation');
    const caixa = await sat.boundingBox();
    await p.mouse.click(caixa.x + caixa.width * 0.7, caixa.y + caixa.height * 0.3);
    await p.keyboard.press('Escape');
    await p.waitForSelector(sel, { timeout: 15000 }).catch(() => {});
  }
  const campo = await p.$(sel);
  if (!campo) return { ok: false, valores: [] };
  await p.waitForFunction(() => !document.querySelector('[data-ed-portal]'), { timeout: 3000 }).catch(() => {});
  await campo.focus();
  const aberto = await p
    .waitForSelector('[data-ed-portal] .react-colorful', { timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  // foco + select() porque o triplo clique perdia a seleção e o texto entrava no meio do antigo.
  await campo.evaluate(el => el.select());
  const valores = [];
  for (const ch of hex) {
    await p.keyboard.type(ch);
    await espera(40);
    valores.push(await campo.evaluate(el => el.value));
  }
  await espera(150);
  valores.push(await campo.evaluate(el => el.value));
  await p.keyboard.press('Escape');
  await p.evaluate(() => document.activeElement?.blur?.());
  await esperarAplicado();
  return { ok: true, aberto, valores };
}
/** Cada valor do campo foi exatamente o prefixo digitado (e o fim, o hex inteiro). */
const digitouLimpo = (hex, res) =>
  res.ok &&
  res.valores.length === hex.length + 1 &&
  res.valores.every((v, k) => v === hex.slice(0, Math.min(k + 1, hex.length)));

// ── 1. só em VTEX ───────────────────────────────────────────────────────────
await semear({ layoutPlatform: 'Wake', layoutSelections: '[]', editorMode: 'checkout', wakeToken: 'TOKEN-DE-TESTE' });
const wake = await p.evaluate(sel => ({
  toggle: !!document.querySelector('[data-editor-mode-toggle]'),
  frame: !!document.querySelector(sel),
  modo: localStorage.getItem('editorMode'),
}), FRAME);
r.ok('Wake: sem o alternador de Checkout no rail', !wake.toggle);
r.ok(
  'Wake: `editorMode: checkout` de outra sessão não abre o checkout (vira loja)',
  !wake.frame && wake.modo === 'loja',
  JSON.stringify(wake)
);

await semear({ layoutPlatform: 'VTEX', layoutSelections: '[]', panelLeftCollapsed: '0', panelRightCollapsed: '0' });
r.ok('VTEX: o alternador de Checkout está no rail', !!(await p.$('[data-editor-mode-toggle]')));
r.ok('VTEX: clicar no alternador entra no checkout', await clicarDeVerdade(p, '[data-editor-mode-toggle]'));
const entrou = await esperarFrame('carrinho', 1280, 120000);
r.ok('o checkout abre no Carrinho, 1280, com base, tokens, header e footer', entrou);
const chrome = await p.evaluate(() => ({
  rail: [...document.querySelectorAll('nav[aria-label="Seções do editor"] button')].map(x => x.getAttribute('aria-label')),
  pressed: document.querySelector('[data-editor-mode-toggle]')?.getAttribute('aria-pressed'),
  etapa: document.querySelector('header[class*="topbar"] button[aria-haspopup="listbox"]')?.textContent.trim(),
  painel: !!document.querySelector('aside[aria-label="Propriedades"] [aria-label="Editar papéis do checkout"]'),
  campos: document.querySelectorAll('aside[aria-label="Propriedades"] section').length,
  largura: document.querySelector('iframe[data-checkout-frame]')?.style.width,
}));
r.ok(
  'no checkout o rail tem Variáveis/Tipografia/Identidade (sem Componentes) e o alternador ligado',
  JSON.stringify(chrome.rail) === JSON.stringify(['Variáveis globais', 'Tipografia', 'Identidade visual', 'Checkout']) &&
    chrome.pressed === 'true',
  JSON.stringify(chrome.rail)
);
r.ok('a topbar troca o seletor de página pelo de etapa ("Carrinho")', chrome.etapa === 'Carrinho', chrome.etapa);
r.ok(
  `o painel direito mostra os papéis do ${MODELO} em grupos`,
  chrome.painel && chrome.campos === new Set(PAINEL.map(x => x.group)).size,
  `${chrome.campos} grupos`
);
r.ok('LARGURA_CHECKOUT: o iframe tem 1280 lógicos no desktop', chrome.largura === '1280px', chrome.largura);

// gate0 #26: `{{CNPJ}}` cru no canvas parece defeito. O preview mostra texto de
// EXEMPLO no rodapé, e o painel diz que o arquivo sai com os placeholders (o
// 3-export confere que o compose do config exportado continua com eles).
const rodapeDoFrame = () =>
  p.evaluate(sel => document.querySelector(sel).contentDocument.querySelector('.etm-footer')?.textContent ?? '', FRAME);
const phsDoRodape = (model.placeholders ?? []).filter(ph => ph.arquivo === model.arquivos.footer).map(ph => ph.id);
const rodape = await rodapeDoFrame();
r.ok(
  `gate0 #26: o rodapé do preview mostra razão social, CNPJ e aviso legal de EXEMPLO (os ${phsDoRodape.length} placeholders do footer do modelo), sem nenhum {{…}}`,
  JSON.stringify([...phsDoRodape].sort()) === JSON.stringify([...PLACEHOLDERS_DO_RODAPE].sort()) &&
    Object.values(EXEMPLO_DO_RODAPE).every(t => rodape.includes(t)) &&
    !rodape.includes('{{'),
  `modelo ${phsDoRodape.join(',')} · rodapé "${rodape.replace(/\s+/g, ' ').trim().slice(0, 200)}"`
);
const notaRodape = await p.evaluate(
  () => document.querySelector('aside[aria-label="Propriedades"] [data-checkout-placeholders]')?.textContent ?? ''
);
r.ok(
  'gate0 #26: o painel explica que cada um sai como placeholder, "preenchido pelo time antes de subir"',
  PLACEHOLDERS_DO_RODAPE.every(ph => notaRodape.includes(ph)) && notaRodape.includes('preenchido pelo time antes de subir'),
  notaRodape.slice(0, 240)
);

await clicarDeVerdade(p, '[data-editor-mode-toggle]');
const saiu = await p
  .waitForFunction(sel => !document.querySelector(sel) && !!document.querySelector('iframe[src="/gerador/frame-mobile"]'), { timeout: 30000 }, FRAME)
  .then(() => true)
  .catch(() => false);
r.ok('clicar de novo volta para a loja (o PreviewFrame remonta)', saiu);
await clicarDeVerdade(p, '[data-editor-mode-toggle]');
await esperarFrame('carrinho', 1280, 60000);

// Trocar de plataforma PELA UI (o seletor do painel esquerdo, que continua lá no
// modo Checkout) sai do modo: o checkout-vtex é o checkout nativo da VTEX.
async function escolherPlataforma(nome) {
  await clicarDeVerdade(p, 'button[class*="card"][aria-haspopup="listbox"]');
  await p.waitForSelector('[role="option"]', { timeout: 15000 }).catch(() => {});
  const achou = await p.evaluate(n => {
    const o = [...document.querySelectorAll('[role="option"]')].find(x => x.textContent.trim() === n);
    o?.click();
    return !!o;
  }, nome);
  return achou;
}
const escolheuTray = await escolherPlataforma('Tray');
const naTray = await p
  .waitForFunction(
    sel => !document.querySelector(sel) && !document.querySelector('[data-editor-mode-toggle]') && localStorage.getItem('layoutPlatform') === 'Tray',
    { timeout: 30000 },
    FRAME
  )
  .then(() => true)
  .catch(() => false);
const estadoTray = await p.evaluate(() => ({
  modo: localStorage.getItem('editorMode'),
  loja: !!document.querySelector('iframe[src^="/gerador/frame"]'),
  rail: [...document.querySelectorAll('nav[aria-label="Seções do editor"] button')].map(x => x.getAttribute('aria-label')),
  etapa: document.querySelector('header[class*="topbar"] button[aria-haspopup="listbox"]')?.textContent.trim() ?? null,
}));
r.ok(
  'UI: trocar VTEX → Tray no seletor de plataforma SAI do modo Checkout (sem o iframe do checkout, sem o alternador, `editorMode: loja`, o canvas da loja de volta)',
  escolheuTray && naTray && estadoTray.modo === 'loja' && estadoTray.loja && estadoTray.rail.includes('Componentes'),
  JSON.stringify(estadoTray)
);
// Na loja o seletor mora em "Componentes" (o rail ficou em Variáveis desde o checkout).
await irParaRail(p, 'Componentes');
const escolheuVtex = await escolherPlataforma('VTEX');
const voltouVtex = await p
  .waitForFunction(() => !!document.querySelector('[data-editor-mode-toggle]') && localStorage.getItem('layoutPlatform') === 'VTEX', { timeout: 30000 })
  .then(() => true)
  .catch(() => false);
const estadoVtex = await p.evaluate(sel => ({
  frame: !!document.querySelector(sel),
  modo: localStorage.getItem('editorMode'),
  pressed: document.querySelector('[data-editor-mode-toggle]')?.getAttribute('aria-pressed'),
}), FRAME);
r.ok(
  'UI: voltar para VTEX devolve o alternador, mas NÃO reabre o checkout sozinho (continua na loja)',
  escolheuVtex && voltouVtex && !estadoVtex.frame && estadoVtex.modo === 'loja' && estadoVtex.pressed === 'false',
  JSON.stringify(estadoVtex)
);
await semear({ layoutPlatform: 'VTEX', layoutSelections: '[]', panelLeftCollapsed: '0', panelRightCollapsed: '0' });
await clicarDeVerdade(p, '[data-editor-mode-toggle]');
await esperarFrame('carrinho', 1280, 120000);

// ── 2. cor global → checkout ────────────────────────────────────────────────
await injetarSondas();
const antes = await lerSondas();
const headerAntes = await noHeader();
await shotDoFrame('cor-global-antes.png');
const digitouPrimaria = await digitarCor('aside[aria-label="Painel de edição"]', 'Defina a cor primária da marca', '#7b1fa2');
r.ok(
  'ColorPicker: digitar o hex com o seletor ABERTO mantém exatamente o que foi digitado, tecla a tecla (sem #NaN…)',
  digitouPrimaria.aberto === true && digitouLimpo('#7b1fa2', digitouPrimaria),
  JSON.stringify(digitouPrimaria.valores)
);
const guardado = await p.evaluate(() => JSON.parse(localStorage.getItem('colors') ?? '{}').colorPrimaryBackground);
r.ok('ColorPicker: o estado guarda o hex digitado, não o do seletor', guardado === '#7b1fa2', guardado);
await digitarCor('aside[aria-label="Painel de edição"]', 'Defina a cor base do texto', '#2e7d32');
const depois = await lerSondas();
const headerDepois = await noHeader();
await shotDoFrame('cor-global-depois.png');
r.ok(
  'cor global primária da marca → --checkout-button-bg e --checkout-tag-bg herdam (nível 2)',
  depois['--checkout-button-bg'] === rgb('#7b1fa2') && depois['--checkout-tag-bg'] === rgb('#7b1fa2'),
  `${antes['--checkout-button-bg']} → ${depois['--checkout-button-bg']}`
);
r.ok(
  'cor global do texto → --checkout-text herda, e o texto secundário é recalculado',
  depois['--checkout-text'] === rgb('#2e7d32') && depois['--checkout-text-muted'] !== antes['--checkout-text-muted'],
  `${depois['--checkout-text']} · muted ${antes['--checkout-text-muted']} → ${depois['--checkout-text-muted']}`
);
r.ok(
  'o header é RECOMPOSTO: a cor do texto dele muda (tokens escopados no template)',
  headerAntes.cor !== headerDepois.cor && headerDepois.cor === rgb('#2e7d32'),
  `${headerAntes.cor} → ${headerDepois.cor}`
);
const herdando = await p.evaluate(() => document.querySelector('aside[aria-label="Propriedades"]')?.textContent ?? '');
r.ok('o painel diz de onde herda, ao vivo ("Herdando de cor primária da marca (#7b1fa2)")', herdando.includes('Herdando de cor primária da marca (#7b1fa2)'));

// Guarda de visibilidade (gate0 #14a/#16): a loja com a cor primária #ffffff
// deixaria o botão branco na página branca. O botão e a tag voltam ao Figma, o
// nó REAL do botão também, e o painel diz por quê.
const PAPEL = Object.fromEntries(model.papeis.map(x => [x.cssVar, x]));
await digitarCor('aside[aria-label="Painel de edição"]', 'Defina a cor primária da marca', '#ffffff');
const comGuarda = await lerSondas();
const botaoReal = () =>
  p.evaluate(sel => {
    const d = document.querySelector(sel).contentDocument;
    const b = d.querySelector('#cart-to-orderform');
    return b ? d.defaultView.getComputedStyle(b).backgroundColor : null;
  }, FRAME);
const botaoComGuarda = await botaoReal();
const textoGuarda = await p.evaluate(() => document.querySelector('aside[aria-label="Propriedades"]')?.textContent ?? '');
const fraseGuarda = `Usando a cor do modelo (${PAPEL['--checkout-button-bg'].level3}) porque a da loja (#ffffff) não aparece no fundo`;
r.ok(
  'guarda: cor primária da loja #ffffff → botão e tag usam o nível 3 do Figma (sonda e o botão real "Seguir com o pedido")',
  comGuarda['--checkout-button-bg'] === rgb(PAPEL['--checkout-button-bg'].level3) &&
    comGuarda['--checkout-tag-bg'] === rgb(PAPEL['--checkout-tag-bg'].level3) &&
    botaoComGuarda === rgb(PAPEL['--checkout-button-bg'].level3),
  `sonda ${comGuarda['--checkout-button-bg']} · tag ${comGuarda['--checkout-tag-bg']} · botão ${botaoComGuarda}`
);
r.ok(`guarda: o painel diz "${fraseGuarda}"`, textoGuarda.includes(fraseGuarda), textoGuarda.slice(0, 300));
await digitarCor('aside[aria-label="Painel de edição"]', 'Defina a cor primária da marca', '#7b1fa2');
r.ok(
  'guarda: com a cor visível de novo, o botão real volta a herdar da loja',
  (await botaoReal()) === rgb('#7b1fa2'),
  await botaoReal()
);

// gate0 #23: o texto do header, o "100% seguro" e o passo ativo do stepper
// (barra e rótulo) usam o `header-text`, derivado do FUNDO do header: o texto da
// página enquanto ele se lê ali (4,5:1), senão o contraste calculado. Nó REAL
// do slot do header, pela UI (o fundo do header no painel do checkout).
const REGRA_HEADER = PAPEL['--checkout-header-text']?.derivado ?? {};
const textoDoHeader = () =>
  p.evaluate(sel => {
    const d = document.querySelector(sel).contentDocument;
    const cs = el => (el ? d.defaultView.getComputedStyle(el) : null);
    const ativo = d.querySelector('.etm-header .etm-stepper__passo[data-passo="carrinho"]');
    return {
      bg: cs(d.querySelector('.etm-header'))?.backgroundColor ?? null,
      texto: cs(d.querySelector('.etm-header'))?.color ?? null,
      selo: cs(d.querySelector('.etm-header__selo-texto'))?.color ?? null,
      barra: cs(ativo?.querySelector('.etm-stepper__barra'))?.backgroundColor ?? null,
      rotulo: cs(ativo?.querySelector('.etm-stepper__rotulo'))?.color ?? null,
    };
  }, FRAME);
const TEXTO_GLOBAL = '#2e7d32';
const HEADER_ESCURO = '#141414';
const noClaro = await textoDoHeader();
const esperadoClaro = textoLegivel(TEXTO_GLOBAL, PAPEL['--checkout-header-bg'].level3, REGRA_HEADER.min);
r.ok(
  `gate0 #23: header claro (${PAPEL['--checkout-header-bg'].level3}) — texto, "100% seguro" e passo ativo usam o texto da página (${TEXTO_GLOBAL})`,
  REGRA_HEADER.regra === 'legivel' &&
    !esperadoClaro.trocou &&
    [noClaro.texto, noClaro.selo, noClaro.barra, noClaro.rotulo].every(c => c === rgb(TEXTO_GLOBAL)),
  JSON.stringify(noClaro)
);
await digitarCor('aside[aria-label="Propriedades"]', PAPEL['--checkout-header-bg'].label, HEADER_ESCURO);
const noEscuro = await textoDoHeader();
const esperadoEscuro = textoLegivel(TEXTO_GLOBAL, HEADER_ESCURO, REGRA_HEADER.min);
r.ok(
  `gate0 #23: header escuro (${HEADER_ESCURO}, pela UI) — texto, "100% seguro" e passo ativo (barra e rótulo) viram o contraste calculado (${esperadoEscuro.valor}), porque o texto da página tem ${esperadoEscuro.razao.toFixed(2)}:1 ali`,
  noEscuro.bg === rgb(HEADER_ESCURO) &&
    esperadoEscuro.trocou &&
    [noEscuro.texto, noEscuro.selo, noEscuro.barra, noEscuro.rotulo].every(c => c === rgb(esperadoEscuro.valor)) &&
    noEscuro.texto !== noClaro.texto,
  JSON.stringify(noEscuro)
);
await shotDoFrame('header-escuro.png');

// ── 3. cada papel → nó-sonda ────────────────────────────────────────────────
const CORES = ['#c0121c', '#1565c0', '#00838f', '#6d4c41', '#fdd835', '#f3e5f5', '#e0f2f1', '#b0bec5', '#fff3e0', '#37474f', '#ff7043'];
const escolhidos = {};
const reaisPelaUi = {};
let i = 0;
for (const papel of PAINEL) {
  const antesDoPapel = await pintura();
  if (papel.type === 'font') {
    const campo = await p.$('aside[aria-label="Propriedades"] #input-font-checkout-font');
    if (campo) {
      await campo.focus();
      await campo.evaluate(el => el.select());
      await p.keyboard.type('Poppins', { delay: 15 });
      await p.keyboard.press('Enter');
      await p.evaluate(() => document.activeElement?.blur?.());
      await esperarAplicado();
    }
    escolhidos[papel.cssVar] = "'Poppins', Arial, Helvetica, sans-serif";
  } else {
    const hex = CORES[i++ % CORES.length];
    const res = await digitarCor('aside[aria-label="Propriedades"]', papel.label, hex);
    if (!res.ok) r.ok(`${papel.cssVar}: campo "${papel.label}" utilizável no painel`, false);
    escolhidos[papel.cssVar] = hex;
  }
  reaisPelaUi[papel.cssVar] = diferentes(antesDoPapel, await pintura());
}
await esperarAplicado();
const sondas = await lerSondas();
for (const papel of PAINEL) {
  const v = sondas[papel.cssVar];
  const esperado = papel.type === 'font' ? 'Poppins' : rgb(escolhidos[papel.cssVar]);
  r.ok(
    `${papel.cssVar} (${papel.label}): mudado pela UI, muda o nó-sonda`,
    papel.type === 'font' ? /Poppins/.test(v ?? '') : v === esperado,
    `sonda ${v} · esperado ${esperado}`
  );
}
const hdr = await noHeader();
// O texto do header é o `header-text` (gate0 #23): o texto escolhido, se ele se
// lê sobre o fundo escolhido; senão o contraste calculado.
const textoHeaderEsperado = textoLegivel(escolhidos['--checkout-text'], escolhidos['--checkout-header-bg'], REGRA_HEADER.min).valor;
r.ok(
  'os papéis que o header/footer pintam mudam o nó REAL (fundo, texto, fonte)',
  hdr.bg === rgb(escolhidos['--checkout-header-bg']) &&
    hdr.footerBg === rgb(escolhidos['--checkout-header-bg']) &&
    hdr.cor === rgb(textoHeaderEsperado) &&
    /Poppins/.test(hdr.fonte),
  JSON.stringify({ bg: hdr.bg, footer: hdr.footerBg, cor: hdr.cor, esperado: textoHeaderEsperado, fonte: hdr.fonte })
);
await shotDoFrame('papeis-depois.png');

// ── 3b. nós REAIS ───────────────────────────────────────────────────────────
// Alcance direto: cada fixture aberta sozinha (a URL estática que o iframe
// carrega), com o header e o footer compostos nos slots e o `:root` do
// emitTokens na página e no cartão. Linha de base = o modelo sem nada da loja
// (nível 3); depois, UM papel por vez com uma cor-sonda. Conta os nós visíveis
// que mudaram de pintura. Sem sonda nenhuma: só o que a fixture tem.
const baseParaAlcance = Object.fromEntries(
  ['css', 'js', 'header', 'footer'].map(k => [k, fs.readFileSync(path.join(DEST.public, model.arquivos[k]), 'utf8')])
);
const logoEx =
  /<img class="etm-header__logo-img" src="([^"]+)"/.exec(
    fs.readFileSync(path.join(DEST.public, 'default', model.arquivos.header), 'utf8')
  )?.[1] ?? null;
const SONDA_COR = '#ff00ff';
const SONDA_FONTE = "'Poppins', Arial, Helvetica, sans-serif";
const variante = level1 => {
  const c = composeCheckout(model, baseParaAlcance, { level1, logo: logoEx, version: versao.sha });
  return { tokens: emitTokens(model, { level1 }), header: c.header, footer: c.footer };
};
const variantes = [
  { papel: null, ...variante({}) },
  ...PAINEL.map(pp => ({
    papel: pp.cssVar,
    ...variante({ [pp.cssVar]: pp.type === 'font' ? SONDA_FONTE : pp.level3.toLowerCase() === SONDA_COR ? '#00ff00' : SONDA_COR }),
  })),
];
const alcance = {}; // papel → { 'carrinho.1280': n, … }
const aux = await b.newPage();
for (const [etapa] of ETAPAS)
  for (const vp of [1280, 390]) {
    await aux.setViewport({ width: vp, height: 900, deviceScaleFactor: 1 });
    await aux.goto(`${BASE_URL}/gerador/checkout/${MODELO}/${etapa}.${vp}.html`, { waitUntil: 'load', timeout: 120000 });
    const contagens = await aux.evaluate(
      async (vs, fn, fa) => {
        const pintar = new Function(`return (${fn})`)();
        const assentar = new Function(`return (${fa})`)();
        const d = document;
        const cd = d.querySelector('iframe[src$=".card.html"]')?.contentDocument ?? null;
        const docs = cd ? [d, cd] : [d];
        // rAF duplo (o estilo novo foi calculado e as transições começaram) e
        // então o fim delas: sem isso a sobra do papel anterior conta para este.
        const quadro = async () => {
          await new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok)));
          await assentar(docs);
        };
        const aplicar = v => {
          for (const x of docs) x.getElementById('ck-tokens').textContent = v.tokens;
          for (const [nome, html] of [['header', v.header], ['footer', v.footer]]) {
            const slot = d.querySelector(`[data-etm-slot="${nome}"]`);
            if (slot) slot.innerHTML = html;
          }
        };
        aplicar(vs[0]);
        await quadro();
        const linha = pintar(docs);
        const out = {};
        for (const v of vs.slice(1)) {
          aplicar(v);
          await quadro();
          const agora = pintar(docs);
          let n = linha.length === agora.length ? 0 : Math.max(linha.length, agora.length);
          if (!n) for (let k = 0; k < linha.length; k++) if (linha[k] !== agora[k]) n++;
          out[v.papel] = n;
        }
        return { out, nos: linha.length, cartao: !!cd };
      },
      variantes,
      pinturaDosDocs.toString(),
      assentarTransicoes.toString()
    );
    for (const [papel, n] of Object.entries(contagens.out)) (alcance[papel] ??= {})[`${etapa}.${vp}`] = n;
    if (etapa === 'pagamento')
      r.ok(`alcance ${etapa}.${vp}: o iframe do cartão entra na conta (card.html carregado)`, contagens.cartao);
  }
await aux.close();
// A aba auxiliar deixava o editor em segundo plano (`visibilityState: hidden`,
// sem rAF): ele volta para a frente antes do próximo passo.
await p.bringToFront();
for (const papel of PAINEL) {
  const porFixture = alcance[papel.cssVar] ?? {};
  const onde = Object.entries(porFixture).filter(([, n]) => n > 0);
  r.ok(
    `${papel.cssVar} (${papel.label}): pinta nós REAIS do modelo — ${onde.length}/10 fixtures`,
    onde.length > 0,
    JSON.stringify(porFixture)
  );
}
console.log(
  `  ℹ️  nós reais por papel (carrinho.1280 · total nas 10): ${PAINEL.map(x => `${x.cssVar.replace('--checkout-', '')} ${alcance[x.cssVar]?.['carrinho.1280'] ?? 0}·${Object.values(alcance[x.cssVar] ?? {}).reduce((a, c) => a + c, 0)}`).join(', ')}`
);
// A mesma coisa pela UI: o papel mudado no painel muda os nós reais do carrinho
// que o alcance direto diz que ele pinta.
for (const papel of PAINEL) {
  const direto = alcance[papel.cssVar]?.['carrinho.1280'] ?? 0;
  if (!direto) continue;
  r.ok(
    `${papel.cssVar}: mudado PELA UI, muda nós reais do carrinho 1280 (${reaisPelaUi[papel.cssVar]} nós; o alcance direto conta ${direto})`,
    reaisPelaUi[papel.cssVar] > 0,
    `${reaisPelaUi[papel.cssVar]} nós`
  );
}
// O editor inteiro no modo Checkout: rail, seletor de etapa, painel de papéis.
await p.screenshot({ path: path.join(DIR, 'editor-checkout.png') });
const estadoCk = await p.evaluate(() => JSON.parse(localStorage.getItem('checkout') ?? '{}'));
/** Os mesmos papéis e valores, sem ordem: a do objeto é a da 1ª edição de cada papel (o gate0 #23 mexe no fundo do header antes da volta pelos papéis). */
const mesmosPapeis = (a, b) => JSON.stringify(Object.entries(a ?? {}).sort()) === JSON.stringify(Object.entries(b ?? {}).sort());
r.ok('os papéis ficam no localStorage próprio (`checkout`)', mesmosPapeis(estadoCk.variables, escolhidos), JSON.stringify(estadoCk.variables));

// ── 4. pesos 300–700 ────────────────────────────────────────────────────────
const pesos = await p.evaluate(async sel => {
  const d = document.querySelector(sel).contentDocument;
  const fam = d.documentElement.getAttribute('data-ck-fonte');
  const link = [...d.querySelectorAll('link[id^="preview-font-"]')].find(l => l.href.includes(`family=${fam}`));
  await Promise.all([300, 400, 500, 600, 700].map(w => d.fonts.load(`${w} 16px "${fam}"`)));
  const achados = new Set();
  for (const f of d.fonts) {
    if (f.family.replace(/["']/g, '') !== fam || f.status !== 'loaded') continue;
    const [a, z] = f.weight.split(' ').map(Number);
    for (const w of [300, 400, 500, 600, 700]) if (w >= a && w <= (z || a)) achados.add(w);
  }
  return { fam, href: link?.href ?? '', pesos: [...achados].sort() };
}, FRAME);
r.ok(
  `a fonte do checkout (${pesos.fam}) é pedida com wght@300;400;500;600;700 no documento do checkout`,
  pesos.href.includes('wght@300;400;500;600;700'),
  pesos.href
);
r.ok('os cinco pesos 300–700 carregam no documento do checkout', JSON.stringify(pesos.pesos) === '[300,400,500,600,700]', JSON.stringify(pesos.pesos));

// ── 5. logo no slot, reduzido ───────────────────────────────────────────────
const logoGrande = await p.evaluate(() => {
  const c = document.createElement('canvas');
  c.width = 600;
  c.height = 200;
  const x = c.getContext('2d');
  x.fillStyle = '#0b5394';
  x.fillRect(0, 0, 600, 200);
  x.fillStyle = '#ffffff';
  x.font = 'bold 120px sans-serif';
  x.fillText('LOJA', 150, 150);
  return c.toDataURL('image/png');
});
await p.evaluate(l => localStorage.setItem('logo', l), logoGrande);
await p.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForSelector('.ed-shell', { timeout: 120000 });
await esperarHidratar();
const voltou = await esperarFrame('carrinho', 1280, 120000);
r.ok('reload: continua no modo Checkout, na mesma etapa', voltou);
// `data-pronto` só vem depois da redução do logo (logoCheckoutPendente), e o
// esperarFrame exige o estado aplicado: o header já tem o logo reduzido.
const logo = await noHeader();
r.ok(
  'o logo da Identidade entra no slot do header reduzido a ≤ 280×64 (600×200 → 192×64)',
  logo.logo.startsWith('data:image/png') && logo.logoW === 192 && logo.logoH === 64,
  `${logo.logo.slice(0, 30)}… ${logo.logoW}×${logo.logoH}`
);
await injetarSondas();
const recarregado = await lerSondas();
r.ok(
  'reload: os papéis voltam do localStorage e pintam de novo',
  PAINEL.every(x => (x.type === 'font' ? /Poppins/.test(recarregado[x.cssVar]) : recarregado[x.cssVar] === rgb(escolhidos[x.cssVar]))),
  JSON.stringify(recarregado).slice(0, 200)
);

// ── 6. desfazer / refazer ───────────────────────────────────────────────────
// O hex é digitado tecla a tecla, e o campo grava a cada uma: o desfazer tem de
// voltar o VALOR inteiro (um gesto), nunca o `#123` digitado pela metade nem o
// `#12345` que nenhum filtro aceita. O histórico fecha a entrada quando o foco
// sai do campo (useThemeHistory), não num prazo que a máquina carregada estoura.
await digitarCor('aside[aria-label="Propriedades"]', 'Bordas', '#123456');
await esperarSonda('--checkout-border', rgb('#123456'));
const comBorda = (await lerSondas())['--checkout-border'];
await p.keyboard.down('Meta');
await p.keyboard.press('z');
await p.keyboard.up('Meta');
// Espera o valor de antes; se o desfazer parar noutro, o prazo vence e a
// asserção abaixo mostra onde parou.
await esperarSonda('--checkout-border', rgb(escolhidos['--checkout-border']));
await esperarAplicado();
const desfeito = (await lerSondas())['--checkout-border'];
await p.evaluate(sel => {
  const d = document.querySelector(sel).contentDocument;
  d.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', metaKey: true, shiftKey: true, bubbles: true }));
}, FRAME);
await esperarSonda('--checkout-border', rgb('#123456'));
await esperarAplicado();
const refeito = (await lerSondas())['--checkout-border'];
r.ok(
  'desfazer (Cmd+Z no editor) volta o papel; refazer (Cmd+Shift+Z DENTRO do iframe) reaplica',
  comBorda === rgb('#123456') && desfeito === rgb(escolhidos['--checkout-border']) && refeito === rgb('#123456'),
  `${comBorda} → ${desfeito} → ${refeito}`
);
escolhidos['--checkout-border'] = '#123456';

// ── 7. clique e submit bloqueados; os botões de etapa trocam a fixture ─────
// O clique continua morrendo na captura (nada navega nem envia). Um link sem etapa
// no preview ("Continuar comprando") não muda nada; "Seguir com o pedido" troca a
// fixture para a etapa seguinte, como no checkout de verdade (onNavegar).
const fr = p.frames().find(f => f.url().includes(`/gerador/checkout/${MODELO}/`));
const urlAntes = fr?.url();
const bloqueio = await p.evaluate(sel => {
  const d = document.querySelector(sel).contentDocument;
  const a = d.querySelector('#cart-choose-more-products') ?? d.querySelector('a[href]:not(#cart-to-orderform)');
  const form = d.querySelector('form');
  return {
    clique: a ? !a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })) : null,
    submit: form ? !form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })) : null,
  };
}, FRAME);
if (fr) {
  await fr.click('#cart-choose-more-products').catch(() => {});
  await espera(600);
}
r.ok(
  'clique e submit dentro da fixture são bloqueados (um link sem etapa no preview não muda a URL)',
  bloqueio.clique === true && bloqueio.submit === true && fr?.url() === urlAntes,
  `${JSON.stringify(bloqueio)} · ${urlAntes} → ${fr?.url()}`
);
const navegou = await p.evaluate(async sel => {
  const ifr = () => document.querySelector(sel);
  ifr().contentDocument.querySelector('#cart-to-orderform')?.click();
  for (let k = 0; k < 40 && !/\/email\./.test(ifr().getAttribute('src') ?? ''); k++) await new Promise(res => setTimeout(res, 250));
  return ifr().getAttribute('src');
}, FRAME);
r.ok('"Seguir com o pedido" no preview leva à etapa E-mail (troca de fixture, sem navegar)', /\/email\./.test(navegou ?? ''), navegou);

// ── 8. as 5 etapas em 1280 e 390 ────────────────────────────────────────────
/** Abre o seletor de etapa (insiste até a lista aparecer: regra 3) e escolhe. */
async function irParaEtapa(rotulo) {
  for (let k = 0; k < 5; k++) {
    if (!(await p.$('ul[aria-label="Etapa do checkout"]')))
      await clicarDeVerdade(p, 'header[class*="topbar"] button[aria-haspopup="listbox"]');
    const aberta = await p
      .waitForSelector('ul[aria-label="Etapa do checkout"]', { timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (aberta) break;
  }
  return p.evaluate(rot => {
    const bt = [...document.querySelectorAll('ul[aria-label="Etapa do checkout"] button')].find(x => x.textContent.trim() === rot);
    bt?.click();
    return !!bt;
  }, rotulo);
}
for (const [vp, botao] of [
  [1280, 'Desktop'],
  [390, 'Mobile'],
]) {
  await p.evaluate(t => [...document.querySelectorAll('[aria-label="Visão do preview"] button')].find(x => x.textContent.trim() === t)?.click(), botao);
  for (const [etapa, rotulo] of ETAPAS) {
    await irParaEtapa(rotulo);
    const ok = await esperarFrame(etapa, vp, 60000);
    let tema = false;
    if (ok) {
      await injetarSondas();
      const s = await lerSondas();
      tema = s['--checkout-button-bg'] === rgb(escolhidos['--checkout-button-bg']);
      await shotDoFrame(`${etapa}-${vp}.png`);
    }
    const largura = await p.evaluate(sel => document.querySelector(sel)?.style.width, FRAME);
    r.ok(`${rotulo} · ${vp}: a fixture carrega com base, tokens, header, footer e o tema aplicado`, ok && tema && largura === `${vp}px`, `ok=${ok} tema=${tema} largura=${largura}`);
    if (etapa === 'pagamento' && ok) {
      const lerCartao = () =>
        p.evaluate(sel => {
          const d = document.querySelector(sel)?.contentDocument;
          const ci = d?.querySelector('iframe[src$=".card.html"]');
          const cd = ci?.contentDocument;
          if (!cd?.body) return null;
          const fam = cd.documentElement.getAttribute('data-ck-fonte');
          const cs = cd.defaultView.getComputedStyle(cd.body);
          const alvo = Math.ceil(cd.body.scrollHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0));
          return {
            altura: ci.style.height,
            alvo,
            fonte: fam,
            link: [...cd.querySelectorAll('link[id^="preview-font-"]')].find(l => l.href.includes(`family=${(fam ?? '').replace(/ /g, '+')}`))?.href ?? '',
            tokensIguais: !!cd.getElementById('ck-tokens') && cd.getElementById('ck-tokens').textContent === d.getElementById('ck-tokens')?.textContent,
            bloqueado: cd.documentElement.getAttribute('data-ck-bloqueado'),
          };
        }, FRAME);
      // A altura segue o conteúdo do cartão por ResizeObserver (e a fonte, ao
      // carregar, muda a scrollHeight): espera ela bater, em vez de 600 ms.
      await p
        .waitForFunction(
          sel => {
            const ci = document.querySelector(sel)?.contentDocument?.querySelector('iframe[src$=".card.html"]');
            const cd = ci?.contentDocument;
            if (!cd?.body) return false;
            const cs = cd.defaultView.getComputedStyle(cd.body);
            const alvo = Math.ceil(cd.body.scrollHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0));
            return ci.style.height === `${alvo}px`;
          },
          { timeout: 30000, polling: 100 },
          FRAME
        )
        .catch(() => {});
      await quadroDoFrame();
      const c = await lerCartao();
      r.ok(
        `Pagamento · ${vp}: o cartão (card.html) recebe o mesmo :root, a fonte com 300–700 e as travas; a altura do iframe é a scrollHeight dele`,
        !!c && c.tokensIguais && c.bloqueado === '1' && c.link.includes('wght@300;400;500;600;700') && c.altura === `${c.alvo}px` && c.alvo > 200,
        JSON.stringify(c)
      );
    }
  }
}

// ── 9. equivalência 0 px ────────────────────────────────────────────────────
const lerEstado = () =>
  p.evaluate(sel => ({
    colors: JSON.parse(localStorage.getItem('colors') ?? '{}'),
    fonts: JSON.parse(localStorage.getItem('fonts') ?? '{}'),
    checkout: JSON.parse(localStorage.getItem('checkout') ?? '{}'),
    tokens: document.querySelector(sel).contentDocument.getElementById('ck-tokens').textContent,
    logo: document.querySelector(sel).contentDocument.querySelector('.etm-header__logo-img').getAttribute('src'),
  }), FRAME);
const baseDoModelo = Object.fromEntries(
  ['css', 'js', 'header', 'footer'].map(k => [k, fs.readFileSync(path.join(DEST.public, model.arquivos[k]), 'utf8')])
);
const comparar = async (a, bb) => {
  const aux = await b.newPage();
  const res = await aux.evaluate(async (x, y) => {
    const carregar = src =>
      new Promise((ok, erro) => {
        const im = new Image();
        im.onload = () => ok(im);
        im.onerror = erro;
        im.src = src;
      });
    const [ia, ib] = await Promise.all([carregar(x), carregar(y)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return { difs: -1, w: ia.width, h: ia.height };
    const px = im => {
      const c = document.createElement('canvas');
      c.width = im.width;
      c.height = im.height;
      const g = c.getContext('2d');
      g.drawImage(im, 0, 0);
      return g.getImageData(0, 0, im.width, im.height).data;
    };
    const da = px(ia);
    const db = px(ib);
    let difs = 0;
    const cores = new Set();
    for (let k = 0; k < da.length; k += 4) {
      if (da[k] !== db[k] || da[k + 1] !== db[k + 1] || da[k + 2] !== db[k + 2] || da[k + 3] !== db[k + 3]) difs++;
      if (cores.size < 5000) cores.add((da[k] << 16) | (da[k + 1] << 8) | da[k + 2]);
    }
    return { difs, cores: cores.size, w: ia.width, h: ia.height };
  }, `data:image/png;base64,${a.toString('base64')}`, `data:image/png;base64,${bb.toString('base64')}`);
  await aux.close();
  await p.bringToFront();
  return res;
};
for (const [etapa, vp, mobile] of [
  ['carrinho', 1280, false],
  ['carrinho', 390, true],
  ['pagamento', 1280, false],
  ['pagamento', 390, true],
]) {
 // Uma segunda tentativa só para diferença de poucos px (≤ 50, gate0 #27,
 // aprovado): o antialias de um ícone com drop-shadow já saiu 1–2 níveis
 // diferente em 4 px numa rodada e 0 na seguinte, com os mesmos arquivos. A 1ª
 // tentativa fica registrada no log; papel trocado (o controle) dá milhares de
 // px e nunca entra aqui.
 for (let tentativa = 1; tentativa <= 2; tentativa++) {
  // Zoom 100% e painéis recolhidos: a captura é do pixel real, sem escala.
  await p.evaluate(et => {
    localStorage.setItem('canvasZoom', '1');
    localStorage.setItem('panelLeftCollapsed', '1');
    localStorage.setItem('panelRightCollapsed', '1');
    const ck = JSON.parse(localStorage.getItem('checkout'));
    ck.etapa = et;
    localStorage.setItem('checkout', JSON.stringify(ck));
    localStorage.setItem('editorMode', 'checkout');
  }, etapa);
  await p.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForSelector('.ed-shell', { timeout: 120000 });
  await esperarHidratar();
  // Depois de um reload o `fonts` já está no localStorage, então o
  // esperarHidratar volta na hora — antes do React. O iframe do checkout só
  // existe DEPOIS da hidratação (o `editorMode` nasce 'loja'), e o clique no
  // Mobile insiste até o `aria-pressed` mudar: clique em botão não hidratado
  // some em silêncio, e o 390 media o frame de 1280 (ou nenhum).
  await p.waitForSelector(FRAME, { timeout: 120000 });
  const alvo = mobile ? 'Mobile' : 'Desktop';
  const pressionado = () =>
    p.evaluate(() => document.querySelector('[aria-label="Visão do preview"] button[aria-pressed="true"]')?.textContent.trim());
  for (let k = 0; k < 20 && (await pressionado()) !== alvo; k++) {
    await p.evaluate(t => [...document.querySelectorAll('[aria-label="Visão do preview"] button')].find(x => x.textContent.trim() === t)?.click(), alvo);
    await p
      .waitForFunction(
        t => document.querySelector('[aria-label="Visão do preview"] button[aria-pressed="true"]')?.textContent.trim() === t,
        { timeout: 2000, polling: 100 },
        alvo
      )
      .catch(() => {});
  }
  // esperarFrame: a fixture da etapa/vp, o estado aplicado e o logo reduzido.
  const pronto = await esperarFrame(etapa, vp, 120000);
  const est = await lerEstado();
  const level2 = {
    fontPrimary: est.fonts.fontPrimary,
    fontSecondary: est.fonts.fontSecondary,
    fontTertiary: est.fonts.fontTertiary,
    ...est.colors,
    colorPrimaryBackgroundSafe: colorSafeOnWhite(est.colors.colorPrimaryBackground),
  };
  const level1 = nivel1Valido(est.checkout.variables, PAINEL);
  const tokensNode = emitTokens(model, { level2: nivel2Valido(level2), level1 });
  const nome = `${etapa}-${vp}`;
  r.ok(`${nome}: o <style id="ck-tokens"> é byte a byte o emitTokens do lib vendorizado`, pronto && est.tokens === tokensNode, pronto ? est.tokens.slice(0, 120) : 'frame não ficou pronto');
  const composto = composeCheckout(model, baseDoModelo, { level2: nivel2Valido(level2), level1, logo: est.logo, version: versao.sha });
  // O controle negativo: o mesmo arquivo composto com UM papel trocado. Se a
  // régua não o acusar, os 0 px de cima não provam nada.
  const trocado = composeCheckout(model, baseDoModelo, {
    level2: nivel2Valido(level2),
    level1: { ...level1, '--checkout-text': level1['--checkout-text'] === '#ff00ff' ? '#00ff00' : '#ff00ff' },
    logo: est.logo,
    version: versao.sha,
  });

  const clip = async () => {
    await p.evaluate(async sel => {
      const d = document.querySelector(sel).contentDocument;
      const cd = d.querySelector('iframe[src$=".card.html"]')?.contentDocument;
      await d.fonts.ready;
      if (cd) await cd.fonts.ready;
      await new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok)));
    }, FRAME);
    const caixa = await (await p.$(FRAME)).boundingBox();
    // Sem redimensionar a janela na captura (ver shotDoFrame).
    return p.screenshot({
      clip: { x: caixa.x, y: caixa.y, width: Math.min(caixa.width, 1280), height: Math.min(caixa.height, 900) },
      captureBeyondViewport: false,
    });
  };
  /**
   * A captura só vale quando a pintura ASSENTOU: duas seguidas, cada uma depois
   * das fontes e de um rAF duplo, com os mesmos bytes. Troca os `espera(2500)`
   * depois de trocar o CSS (imagem de máscara decodificando, a altura do cartão
   * seguindo o conteúdo). Se nunca assentar, a última vai para a comparação — e
   * a régua acusa.
   */
  const capturaEstavel = async () => {
    let antes = await clip();
    for (let k = 0; k < 8; k++) {
      const agora = await clip();
      if (Buffer.compare(agora, antes) === 0) return agora;
      antes = agora;
    }
    return antes;
  };
  /** Troca, na página e no cartão, o par <link> base + <style> tokens (ou o composto anterior) pelo CSS dado. */
  const usarComposto = css =>
    p.evaluate(
      (sel, texto) => {
        const d = document.querySelector(sel).contentDocument;
        const cd = d.querySelector('iframe[src$=".card.html"]')?.contentDocument;
        for (const x of cd ? [d, cd] : [d]) {
          let st = x.getElementById('ck-composto');
          if (!st) {
            st = x.createElement('style');
            st.id = 'ck-composto';
            x.getElementById('ck-base').replaceWith(st);
            x.getElementById('ck-tokens').remove();
          }
          st.textContent = texto;
        }
      },
      FRAME,
      css
    );
  const A = await capturaEstavel();
  // B: o arquivo composto no lugar do par <link> base + <style> tokens.
  await usarComposto(composto.css);
  const B = await capturaEstavel();
  await usarComposto(trocado.css);
  const C = await capturaEstavel();
  fs.writeFileSync(path.join(DIR, `equivalencia-${nome}-link-tokens.png`), A);
  fs.writeFileSync(path.join(DIR, `equivalencia-${nome}-composto.png`), B);
  fs.writeFileSync(path.join(DIR, `equivalencia-${nome}-controle.png`), C);
  const cmp = await comparar(A, B);
  const ctl = await comparar(A, C);
  if (tentativa === 1 && pronto && cmp.difs > 0 && cmp.difs <= 50) {
    // A 1ª captura fica no log e no disco (gate0 #27).
    fs.renameSync(path.join(DIR, `equivalencia-${nome}-link-tokens.png`), path.join(DIR, `equivalencia-${nome}-tentativa1-link-tokens.png`));
    fs.renameSync(path.join(DIR, `equivalencia-${nome}-composto.png`), path.join(DIR, `equivalencia-${nome}-tentativa1-composto.png`));
    console.log(`  ℹ️  ${nome}: ${cmp.difs} px diferentes na 1ª captura (rasterização?) — repetindo do zero; a 1ª em equivalencia-${nome}-tentativa1-*.png`);
    continue;
  }
  r.ok(
    `${nome}: EQUIVALÊNCIA 0 px — <link> base + <style> tokens pinta igual ao checkout6-custom.css composto${etapa === 'pagamento' ? ' (página e cartão)' : ''}`,
    // Sem o frame pronto na etapa/vp pedidos a comparação é vazia (o 390 já
    // "passou" medindo o frame de 1280): não conta como prova.
    pronto && cmp.difs === 0,
    pronto ? `${cmp.difs} px diferentes em ${cmp.w}×${cmp.h}` : 'frame não ficou pronto: comparação sem valor'
  );
  r.ok(
    `${nome}: a régua mede — o composto com --checkout-text trocado difere (${ctl.difs} px), numa captura com ${cmp.cores} cores`,
    pronto && ctl.difs > 500 && cmp.cores > 20,
    `${ctl.difs} px · ${cmp.cores} cores`
  );
  break;
 }
}

// ── 10. export ──────────────────────────────────────────────────────────────
await p.evaluate(() => {
  localStorage.setItem('panelLeftCollapsed', '0');
  localStorage.setItem('panelRightCollapsed', '0');
  localStorage.setItem('canvasZoom', 'fit');
});
await p.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForSelector('.ed-shell', { timeout: 120000 });
await esperarHidratar();
// `isMobileView` não é persistido: depois do reload o canvas volta ao desktop.
await esperarFrame('carrinho', 1280, 120000);
const logoDoPreview = (await noHeader()).logo;
/** Clica em Baixar e devolve o config.json que o export entregou (o hook vive até o próximo reload). */
async function baixarConfig() {
  await p.evaluate(() => {
    window.__cfg = null;
    if (!window.__cfgHook) {
      window.__cfgHook = true;
      const orig = URL.createObjectURL.bind(URL);
      URL.createObjectURL = bl => {
        if (bl && bl.type === 'application/json') bl.text().then(t => (window.__cfg = JSON.parse(t)));
        return orig(bl);
      };
    }
  });
  await p.waitForFunction(() => [...document.querySelectorAll('button')].some(x => x.textContent.trim().startsWith('Baixar') && !x.disabled), { timeout: 60000 });
  await p.evaluate(() => [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('Baixar')).click());
  return p
    .waitForFunction(() => window.__cfg, { timeout: 120000, polling: 500 })
    .then(h => h.jsonValue())
    .catch(() => null);
}
const cfg = await baixarConfig();
r.ok('o export (Baixar) entrega o config.json', !!cfg);
if (cfg) {
  fs.writeFileSync(path.join(DIR, 'config.json'), JSON.stringify(cfg, null, 2));
  const ck = cfg.faststore?.checkout;
  r.ok(
    'faststore.checkout = { model, version (SHA do VERSION.json), variables = os papéis escolhidos }',
    ck?.model === MODELO && ck?.version === versao.sha && mesmosPapeis(ck?.variables, escolhidos),
    JSON.stringify(ck).slice(0, 300)
  );
  r.ok(
    'faststore.assets.logo é o MESMO que o header do preview mostra (≤ 280×64)',
    cfg.faststore?.assets?.logo === logoDoPreview && logoDoPreview.startsWith('data:image/png'),
    `${(cfg.faststore?.assets?.logo ?? '').slice(0, 40)}… vs ${logoDoPreview.slice(0, 40)}…`
  );
}

// ── 10b. logo por URL e logo recusado ───────────────────────────────────────
/**
 * Grava o logo, recarrega no carrinho 1280 e devolve o que o header e o painel
 * mostram. O aviso do painel vem de um compose assíncrono (CheckoutVariablesPanel):
 * com `aviso` esperado, espera por ele.
 */
async function comLogo(valor, aviso = null) {
  await p.evaluate(l => localStorage.setItem('logo', l), valor);
  await p.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForSelector('.ed-shell', { timeout: 120000 });
  await esperarHidratar();
  await esperarFrame('carrinho', 1280, 120000);
  if (aviso)
    await p
      .waitForFunction(
        a => document.querySelector('aside[aria-label="Propriedades"] [data-checkout-aviso]')?.getAttribute('data-checkout-aviso') === a,
        { timeout: 30000, polling: 100 },
        aviso
      )
      .catch(() => {});
  return p.evaluate(sel => {
    const d = document.querySelector(sel).contentDocument;
    return {
      src: d.querySelector('.etm-header__logo-img')?.getAttribute('src') ?? '',
      aviso: document.querySelector('aside[aria-label="Propriedades"] [data-checkout-aviso]')?.getAttribute('data-checkout-aviso') ?? null,
    };
  }, FRAME);
}
// Um logo https NÃO é redesenhado (canvas de outra origem lançaria SecurityError
// e derrubava o export): vai como veio, e o compose o aceita. `.invalid` não
// resolve — nenhum byte sai daqui.
const LOGO_URL = 'https://loja-exemplo.invalid/logo.png';
const antesUrl = erros.filter(e => e.startsWith('pageerror')).length;
const comUrl = await comLogo(LOGO_URL);
const cfgUrl = await baixarConfig();
r.ok(
  'logo por URL https: o header mostra a URL, sem aviso, e o export sai (não lança) com o mesmo logo',
  comUrl.src === LOGO_URL && comUrl.aviso === null && cfgUrl?.faststore?.assets?.logo === LOGO_URL &&
    erros.filter(e => e.startsWith('pageerror')).length === antesUrl,
  `${JSON.stringify(comUrl)} · export ${cfgUrl?.faststore?.assets?.logo ?? '(sem config)'}`
);
// Um logo que o compose não embute (gate0 #17): aviso no painel, o de exemplo no
// canvas, e o export sai assim mesmo — sem alerta, porque não é erro.
const comInvalido = await comLogo('data:text/plain;base64,SGVsbG8=', 'logo-invalido');
const cfgInvalido = await baixarConfig();
r.ok(
  'logo que o compose não embute: o painel avisa (logo-invalido), o canvas mostra o logo de exemplo e o export sai',
  comInvalido.aviso === 'logo-invalido' && comInvalido.src === logoEx && !!cfgInvalido,
  JSON.stringify({ ...comInvalido, src: comInvalido.src.slice(0, 40) })
);
await p.evaluate(l => localStorage.setItem('logo', l), logoGrande);
r.ok('nenhum alerta do compose do checkout no export', !dialogos.some(d => /checkout/i.test(d)), dialogos.join(' | '));

// ── 11. /p/{id}/checkout/{etapa} ────────────────────────────────────────────
// O preview compartilhável do checkout, com o armazenamento LOCAL: o dev tem de
// ler `.preview-store/` (KV desligado). A prova vem ANTES de qualquer POST — um
// arquivo gravado aqui e lido pela rota —, para o funil nunca escrever no KV de
// produção: com KV ligado a rota não o acha, o estágio reprova e não posta nada.
const LOJA = path.join(RAIZ, '.preview-store');
const idsDoFunil = [];
const CORES_DO_SNAPSHOT = {
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
};
const FONTES_DO_SNAPSHOT = { fontPrimary: 'Lato', fontSecondary: 'Poppins', fontTertiary: 'Open Sans' };
const snapshot = (platform, extra = {}) => ({
  platform,
  selections: [],
  colors: { ...CORES_DO_SNAPSHOT },
  fonts: { ...FONTES_DO_SNAPSHOT },
  logo: '',
  favicon: '',
  ...extra,
});
const blocoCk = variables => ({ model: MODELO, version: versao.sha, variables });
/** O nível 2 que o SharedCheckout monta do snapshot (`variaveisGlobais`), com o filtro do preview. */
const nivel2DoSnapshot = s =>
  nivel2Valido({ ...s.fonts, ...s.colors, colorPrimaryBackgroundSafe: colorSafeOnWhite(s.colors.colorPrimaryBackground) });
const status = async rota => {
  try {
    const resp = await fetch(`${BASE_URL}${rota}`, { redirect: 'manual' });
    return { status: resp.status, html: await resp.text() };
  } catch (e) {
    return { status: 0, html: String(e) };
  }
};
async function postar(s) {
  const resp = await fetch(`${BASE_URL}/gerador/api/preview`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(s),
  });
  const { id } = await resp.json().catch(() => ({}));
  if (id) idsDoFunil.push(id);
  return resp.ok && id && fs.existsSync(path.join(LOJA, `${id}.json`)) ? id : null;
}
/** Abre o /p do checkout no `p` e devolve o que o frame mostra. */
async function abrirNoP(id, etapa = 'carrinho') {
  await p.goto(`${BASE_URL}/p/${id}/checkout/${etapa}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  const pronto = await esperarFrame(etapa, 1280, 120000);
  const frame = await p.evaluate(sel => {
    const d = document.querySelector(sel)?.contentDocument;
    if (!d) return null;
    const h = d.querySelector('.etm-header');
    const cs = el => (el ? d.defaultView.getComputedStyle(el) : null);
    return {
      tokens: d.getElementById('ck-tokens')?.textContent ?? '',
      headerBg: cs(h)?.backgroundColor ?? null,
      headerTexto: cs(h)?.color ?? null,
      rodape: d.querySelector('.etm-footer')?.textContent ?? '',
      logo: d.querySelector('.etm-header__logo-img')?.getAttribute('src') ?? '',
      scripts: d.querySelectorAll('script').length,
      corpoVisivel: cs(d.body)?.display !== 'none',
      pwned: !!(window.__pwned || d.defaultView.__pwned),
    };
  }, FRAME);
  return { pronto, frame };
}

// Prova do armazenamento local: um snapshot gravado DIRETO no arquivo.
fs.mkdirSync(LOJA, { recursive: true });
const idSonda = `funilck${Date.now().toString(36)}`;
fs.writeFileSync(path.join(LOJA, `${idSonda}.json`), JSON.stringify(snapshot('VTEX', { checkout: blocoCk({}) })));
idsDoFunil.push(idSonda);
const sonda = await status(`/p/${idSonda}/checkout/carrinho`);
const local = r.ok(
  '/p: o dev lê o armazenamento LOCAL (.preview-store/, KV desligado) — um snapshot gravado no arquivo abre com 200',
  sonda.status === 200,
  `HTTP ${sonda.status}: com KV ligado a rota não acha o arquivo — suba o dev sem KV_REST_API_*/UPSTASH_REDIS_REST_* (nada foi postado)`
);

if (local) {
  // a) snapshot VTEX válido, pelo caminho real (POST do botão Compartilhar).
  const VALIDO = { '--checkout-button-bg': '#c0121c', '--checkout-header-bg': '#141414' };
  const sValido = snapshot('VTEX', { checkout: blocoCk(VALIDO) });
  const idValido = await postar(sValido);
  const rValido = idValido ? await status(`/p/${idValido}/checkout/carrinho`) : { status: 0 };
  const vValido = idValido ? await abrirNoP(idValido) : { pronto: false, frame: null };
  const tokensValido = emitTokens(model, { level2: nivel2DoSnapshot(sValido), level1: nivel1Valido(VALIDO, PAINEL) });
  // O texto da página herda a cor primária da loja (`--text-primary-color`),
  // que não se lê no header escuro do snapshot: vale o contraste (gate0 #23).
  const textoHeaderValido = textoLegivel(CORES_DO_SNAPSHOT.colorPrimary, VALIDO['--checkout-header-bg'], REGRA_HEADER.min).valor;
  r.ok(
    '/p/{id}/checkout/carrinho: snapshot VTEX válido (POST) → 200, e o frame pinta o tema DELE (ck-tokens = emitTokens do snapshot, header escuro com o texto legível, rodapé de exemplo)',
    !!idValido &&
      rValido.status === 200 &&
      vValido.pronto &&
      vValido.frame?.tokens === tokensValido &&
      vValido.frame.headerBg === rgb(VALIDO['--checkout-header-bg']) &&
      vValido.frame.headerTexto === rgb(textoHeaderValido) &&
      Object.values(EXEMPLO_DO_RODAPE).every(t => vValido.frame.rodape.includes(t)),
    JSON.stringify({ id: idValido, http: rValido.status, pronto: vValido.pronto, ...vValido.frame, tokens: vValido.frame?.tokens?.slice(0, 80), rodape: vValido.frame?.rodape?.trim().slice(0, 60) })
  );
  /**
   * O menu do /p: o balão vem no HTML do servidor, e o clique antes da
   * hidratação some em silêncio (a página do /p compila na 1ª vez e, sob carga,
   * hidrata segundos depois do DOMContentLoaded — o `espera(800)` perdia o
   * clique e o menu saía vazio). Clica até o `aria-expanded` virar "true" e só
   * então lê os links.
   */
  const navDoP = async slug => {
    await p.goto(`${BASE_URL}/p/${slug}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    const BALAO = '[aria-label="Navegar entre as páginas"]';
    await p.waitForSelector(BALAO, { timeout: 60000 }).catch(() => {});
    for (let k = 0; k < 30; k++) {
      if ((await p.evaluate(s => document.querySelector(s)?.getAttribute('aria-expanded'), BALAO)) === 'true') break;
      await clicarDeVerdade(p, BALAO, 1);
      await p
        .waitForFunction(s => document.querySelector(s)?.getAttribute('aria-expanded') === 'true', { timeout: 2000, polling: 100 }, BALAO)
        .catch(() => {});
    }
    await p.waitForSelector('nav[aria-label="Navegação do preview"] a', { timeout: 10000 }).catch(() => {});
    return p.evaluate(() => [...document.querySelectorAll('nav[aria-label="Navegação do preview"] a')].map(a => a.getAttribute('href')));
  };
  if (idValido) {
    const links = await navDoP(`${idValido}/home`);
    const doCk = links.filter(h => h.includes('/checkout/'));
    r.ok('/p: o menu do snapshot VTEX lista as 5 etapas do checkout', doCk.length === 5, JSON.stringify(links));
    for (const [rota, rotulo] of [
      [`/p/${idValido}/checkout/finalizar`, 'etapa inválida'],
      [`/p/${idValido}/checkout`, 'sem etapa'],
      [`/p/funilckinexistente/checkout/carrinho`, 'id inexistente'],
    ]) {
      const x = await status(rota);
      r.ok(`/p: ${rotulo} (${rota.replace(idValido, '{id}')}) → 404`, x.status === 404, `HTTP ${x.status}`);
    }
  }

  // b) valores INJETADOS no snapshot (o POST grava o que vier): nada disso pode
  //    virar CSS, script ou quebrar a página — o CheckoutFrame filtra nível 1 e 2.
  const INJ_TEXTO = '#123456; } body { display: none } :root { --x: 0';
  const INJ_SCRIPT = '#fff</style><script>window.__pwned = 1</script>';
  const INJETADO = {
    '--checkout-text': INJ_TEXTO,
    '--checkout-button-bg': '#00ff00',
    '--checkout-desconhecido': '#000000',
    '--checkout-header-text': '#ff00ff',
  };
  const sInj = snapshot('VTEX', {
    colors: { ...CORES_DO_SNAPSHOT, colorPrimary: INJ_SCRIPT, colorPrimaryBackground: 'url(javascript:alert(1))' },
    fonts: { ...FONTES_DO_SNAPSHOT, fontPrimary: "Lato'); } body { display: none } /*" },
    logo: 'javascript:alert(1)',
    checkout: blocoCk(INJETADO),
  });
  const idInj = await postar(sInj);
  const rInj = idInj ? await status(`/p/${idInj}/checkout/carrinho`) : { status: 0, html: '' };
  const dialogosAntes = dialogos.length;
  const vInj = idInj ? await abrirNoP(idInj) : { pronto: false, frame: null };
  const tokensInj = emitTokens(model, { level2: nivel2DoSnapshot(sInj), level1: nivel1Valido(INJETADO, PAINEL) });
  const fInj = vInj.frame ?? {};
  r.ok(
    '/p: snapshot com valores INJETADOS abre FILTRADO — ck-tokens = emitTokens só do que o compose aceita (sem o texto injetado, o papel desconhecido nem o derivado), corpo visível, nenhum <script> nem diálogo, logo de exemplo',
    !!idInj &&
      rInj.status === 200 &&
      vInj.pronto &&
      fInj.tokens === tokensInj &&
      !/display: none|--checkout-desconhecido|<\/style>|javascript/i.test(fInj.tokens) &&
      fInj.corpoVisivel &&
      fInj.scripts === 0 &&
      !fInj.pwned &&
      dialogos.length === dialogosAntes &&
      fInj.logo === logoEx,
    JSON.stringify({ id: idInj, http: rInj.status, pronto: vInj.pronto, igualAoFiltrado: fInj.tokens === tokensInj, scripts: fInj.scripts, pwned: fInj.pwned, corpo: fInj.corpoVisivel, logo: String(fInj.logo).slice(0, 40), dialogos: dialogos.slice(dialogosAntes) })
  );
  r.ok(
    '/p: o HTML do servidor não leva o valor injetado cru (o `</style><script>` sai escapado no payload)',
    rInj.status === 200 && !rInj.html.includes('</style><script>window.__pwned'),
    `HTTP ${rInj.status}`
  );

  // c) snapshot Tray: sem checkout, e também COM o bloco (feito à mão) → 404.
  const idTray = await postar(snapshot('Tray'));
  const idTrayCk = await postar(snapshot('Tray', { checkout: blocoCk({ '--checkout-button-bg': '#c0121c' }) }));
  const rTray = idTray ? await status(`/p/${idTray}/checkout/carrinho`) : { status: 0 };
  const rTrayCk = idTrayCk ? await status(`/p/${idTrayCk}/checkout/carrinho`) : { status: 0 };
  r.ok(
    '/p: snapshot Tray → 404 no checkout, sem o bloco E com o bloco `checkout` (o checkout-vtex é só VTEX)',
    rTray.status === 404 && rTrayCk.status === 404,
    `sem bloco HTTP ${rTray.status} · com bloco HTTP ${rTrayCk.status}`
  );
  if (idTrayCk) {
    const links = await navDoP(`${idTrayCk}/home`);
    r.ok('/p: o menu do snapshot Tray com o bloco não oferece o checkout', links.length > 0 && !links.some(h => h.includes('/checkout/')), JSON.stringify(links));
  }
}
// Os snapshots do funil saem da loja local (o `.preview-store/` é do dev, não do funil).
for (const id of idsDoFunil) fs.rmSync(path.join(LOJA, `${id}.json`), { force: true });

const pageErrors = erros.filter(e => e.startsWith('pageerror'));
r.ok('sem erro de página (pageerror)', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));
const consoleErros = erros.filter(e => e.startsWith('console'));
if (consoleErros.length)
  console.log(`  ℹ️  ${consoleErros.length} console.error (recursos externos inclusos): ${[...new Set(consoleErros)].slice(0, 4).join(' | ')}`);
console.log(`  capturas em ${path.relative(process.cwd(), DIR)}/`);

await b.close();
process.exit(r.fechar() ? 0 : 1);
