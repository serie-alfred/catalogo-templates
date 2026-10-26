/**
 * Estágio 2t — "Por template": escolher uma família inteira no rail e receber a
 * loja montada, em todas as páginas.
 *
 * Prova, no editor de verdade:
 *  1. a lista de templates é a DERIVADA do catálogo (mesma regra de
 *     `utils/templatesCompletos.ts`, reescrita aqui de propósito: se a regra
 *     mudar num lado só, o estágio reprova), por plataforma, com nome e contagem;
 *  2. escolher a 09 com a loja vazia não pede confirmação, preenche TODO slot da
 *     família (e só ela) e leva para "Componentes" na home;
 *  3. o canvas renderiza home, categoria e produto com as peças da família, sem
 *     erro de console;
 *  4. trocar uma peça depois continua funcionando (o modal de sempre);
 *  5. com seções já escolhidas, escolher a 10 pede confirmação; cancelar não muda
 *     nada, aceitar troca tudo;
 *  6. o export sai só com a família e passa no contrato do generator (VTEX, Wake
 *     e Tray);
 *  7. aplicar traz a cara da família: as cores autorais e as fontes globais de
 *     `TEMA_DAS_FAMILIAS` (as derivadas, recalculadas pelo contraste), no canvas
 *     e no export; o undo as restaura junto com as peças; família sem tema
 *     (Template 01) mantém a paleta;
 *  8. onde o Nível 2 não acerta o desenho, a peça ganha Nível 1 próprio
 *     (`NIVEL1_DAS_FAMILIAS`): as `variables` entram SÓ nas seções do mapa, o
 *     header pinta a cor do desenho, o painel da direita mostra e restaura, o
 *     undo/redo as leva junto, e o export as carrega por componente.
 *  9. a aba NOVA entra com `ENTRADA_PADRAO` (plataforma + template), aplicado
 *     como aqui, sem confirm, sem pintar o convite e sem "Voltar" para a tela
 *     vazia; recarregar não reaplica; o "Começar do zero" do painel esvazia e a
 *     loja vazia recarregada mostra o convite.
 *
 * Fotos em FUNIL_FOTOS (padrão `.funil/por-template/`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { relatorio, espera, BASE_URL, SAIDA, itens } from './lib/util.mjs';
import {
  abrirBrowser,
  semear,
  trocarPagina,
  irParaRail,
  clicarDeVerdade,
  adicionarPeloModal,
} from './lib/editor.mjs';
import { conferirFaststore, conferirTrayWake } from './lib/contrato.mjs';

const r = relatorio('Estágio 2t — Por template (família inteira)');
const FOTOS = process.env.FUNIL_FOTOS ?? path.join(SAIDA, 'por-template');
fs.mkdirSync(FOTOS, { recursive: true });

const TODOS = itens();
const OBRIGATORIOS = {
  common: ['header', 'footer', 'breadcrumb', 'spot'],
  home: ['banner-main', 'showcase'],
  category: ['category-main'],
  product: ['product-info'],
};
const daFamilia = (t, plat) => TODOS.filter(i => i.template === t && i.platforms.includes(plat));
const completa = (t, plat) => {
  const f = daFamilia(t, plat);
  return Object.entries(OBRIGATORIOS).every(([pg, sels]) =>
    sels.every(s => f.some(i => i.selection === s && i.pagina.includes(pg)))
  );
};
const esperadas = plat =>
  [...new Set(TODOS.map(i => i.template))].filter(t => completa(t, plat)).sort((a, b) => Number(b) - Number(a));

/** O que o canvas mostra numa página (previewRender.belongsToPage). */
const noCanvas = (t, plat, pagina) =>
  daFamilia(t, plat)
    .filter(i => {
      const pg = i.pagina[0];
      if (i.selection === 'spot') return false;
      if (i.selection === 'breadcrumb' && pagina === 'home') return false;
      return pg === pagina || pg === 'common';
    })
    .map(i => i.selection)
    .sort();

const secoes = page =>
  page.evaluate(() =>
    [...(document.querySelector('iframe')?.contentDocument?.querySelectorAll('[data-section-uid]') ?? [])].map(e =>
      e.getAttribute('data-selection')
    )
  );

async function esperarCanvas(page, alvo) {
  const ordenado = [...alvo].sort().join();
  await page
    .waitForFunction(
      a => {
        const d = document.querySelector('iframe')?.contentDocument;
        if (!d) return false;
        const s = [...d.querySelectorAll('[data-section-uid]')].map(e => e.getAttribute('data-selection')).sort();
        return s.join() === a;
      },
      { timeout: 60000, polling: 400 },
      ordenado
    )
    .catch(() => {});
  return secoes(page);
}

const salvas = page =>
  page.evaluate(() => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').map(s => `${s.layoutKey}:${s.id}`));
const chaves = (t, plat) => daFamilia(t, plat).map(i => `${i.layoutKey}:${i.id}`).sort();

async function abrirPainel(page) {
  await irParaRail(page, 'Por template');
  await page.waitForSelector('[data-templates-lista] [data-template]', { timeout: 30000 });
  await espera(600);
}

async function cartoes(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('[data-templates-lista] [data-template]')].map(b => ({
      t: b.getAttribute('data-template'),
      texto: b.textContent.replace(/\s+/g, ' ').trim(),
      imgs: b.querySelectorAll('img').length,
      pressionado: b.getAttribute('aria-pressed') === 'true',
    }))
  );
}

async function foto(page, nome) {
  await page.screenshot({ path: path.join(FOTOS, `${nome}.png`) });
}

/** Clica no "Baixar" e devolve o config (o Blob JSON). Igual ao 2-lp. */
async function exportar(page) {
  await page.evaluate(() => {
    window.__cfg = null;
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = bl => {
      if (bl && bl.type === 'application/json') bl.text().then(t => (window.__cfg = JSON.parse(t)));
      return orig(bl);
    };
  });
  await page.waitForFunction(
    () => {
      const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('Baixar'));
      return !!b && !b.disabled;
    },
    { timeout: 60000, polling: 250 }
  );
  await page.evaluate(() =>
    [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('Baixar')).click()
  );
  for (let i = 0; i < 40; i++) {
    const cfg = await page.evaluate(() => window.__cfg).catch(() => null);
    if (cfg) return cfg;
    await espera(3000);
  }
  return null;
}

/** Aba com controle do diálogo: `resposta.valor` decide aceitar ou cancelar. */
async function aba(browser) {
  const page = await browser.newPage();
  const erros = [];
  const dialogos = [];
  const resposta = { valor: true };
  page.on('pageerror', e => erros.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error') erros.push(`console: ${m.text().slice(0, 160)}`);
  });
  page.on('dialog', async d => {
    dialogos.push({ tipo: d.type(), msg: d.message() });
    if (d.type() === 'confirm' && !resposta.valor) await d.dismiss();
    else await d.accept();
  });
  return { page, erros, dialogos, resposta };
}

/** O mapa família → tema, lido do próprio templatesCompletos.ts (bloco gerado). */
const TEMA = (() => {
  const ts = fs.readFileSync(path.resolve(new URL('../../src/utils/templatesCompletos.ts', import.meta.url).pathname), 'utf8');
  const bloco = ts.slice(ts.indexOf('export const TEMA_DAS_FAMILIAS'), ts.indexOf('\n};', ts.indexOf('export const TEMA_DAS_FAMILIAS')));
  const out = {};
  for (const parte of bloco.split(/\n {2}'?(\d+)'?: \{/).slice(1).reduce((acc, x, i, arr) => (i % 2 === 0 ? [...acc, [x, arr[i + 1]]] : acc), [])) {
    const [fam, corpo] = parte;
    const colors = Object.fromEntries([...corpo.matchAll(/(color\w+): '(#[0-9a-f]+)'/g)].map(m => [m[1], m[2]]));
    const f = corpo.match(/fontPrimary: '([^']+)',\s*fontSecondary: '([^']+)',\s*fontTertiary: '([^']+)'/);
    out[fam] = { colors, fonts: f ? { fontPrimary: f[1], fontSecondary: f[2], fontTertiary: f[3] } : null };
  }
  return out;
})();
/** O mapa família → componente → vars de Nível 1, lido do mesmo arquivo. */
const NIVEL1 = (() => {
  const ts = fs.readFileSync(path.resolve(new URL('../../src/utils/templatesCompletos.ts', import.meta.url).pathname), 'utf8');
  const ini = ts.indexOf('export const NIVEL1_DAS_FAMILIAS');
  const bloco = ts.slice(ini, ts.indexOf('\n};', ini));
  const out = {};
  for (const [, fam, corpo] of bloco.matchAll(/\n {2}'(\d+)': \{([\s\S]*?)\n {2}\},/g))
    for (const [, comp, vars] of corpo.matchAll(/\n {4}(\w+): \{([\s\S]*?)\n {4}\},/g))
      (out[fam] ??= {})[comp] = Object.fromEntries([...vars.matchAll(/'(--[\w-]+)': '([^']+)'/g)].map(m => [m[1], m[2]]));
  return out;
})();
const componenteDe = Object.fromEntries(TODOS.map(i => [`${i.layoutKey}:${i.id}`, i.component]));
/** Diferenças entre as variables gravadas por seção e o mapa da família. */
const difNivel1 = (gravadas, t) =>
  gravadas.flatMap(s => {
    const comp = componenteDe[`${s.layoutKey}:${s.id}`];
    const esp = NIVEL1[t]?.[comp] ?? null;
    const tem = s.variables && Object.keys(s.variables).length ? s.variables : null;
    return JSON.stringify(tem) === JSON.stringify(esp) ? [] : [`${comp}: ${JSON.stringify(tem)} ≠ ${JSON.stringify(esp)}`];
  });
const contraste = hex => {
  const h = hex.replace('#', '').replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3');
  const y = (parseInt(h.slice(0, 2), 16) * 299 + parseInt(h.slice(2, 4), 16) * 587 + parseInt(h.slice(4, 6), 16) * 114) / 1000;
  return y >= 128 ? '#000000' : '#ffffff';
};
const temaGravado = page =>
  page.evaluate(() => ({ colors: JSON.parse(sessionStorage.getItem('colors') ?? '{}'), fonts: JSON.parse(sessionStorage.getItem('fonts') ?? '{}') }));
/** O tema gravado bate com o da família (autorais + derivadas + fontes)? Devolve as diferenças. */
function difTema(g, t) {
  const tema = TEMA[t];
  const dif = [];
  for (const [k, v] of Object.entries(tema.colors)) if ((g.colors[k] ?? '').toLowerCase() !== v) dif.push(`${k}=${g.colors[k]}≠${v}`);
  const der = { colorPrimaryText: 'colorPrimaryBackground', colorSecondaryText: 'colorSecondaryBackground', colorTertiary: 'colorTertiaryBackground' };
  for (const [k, bg] of Object.entries(der)) if (g.colors[bg] && (g.colors[k] ?? '').toLowerCase() !== contraste(g.colors[bg])) dif.push(`${k} não é o contraste de ${bg}`);
  if (tema.fonts) for (const [k, v] of Object.entries(tema.fonts)) if (g.fonts[k] !== v) dif.push(`${k}=${g.fonts[k]}≠${v}`);
  return dif;
}
/** As variáveis globais do config (mesmas chaves nos dois formatos) batem com o tema? */
function difVariaveis(vars, t) {
  const tema = TEMA[t];
  const dif = [];
  for (const [k, v] of Object.entries(tema.colors)) if ((vars?.[k] ?? '').toLowerCase() !== v) dif.push(`${k}=${vars?.[k]}≠${v}`);
  if (tema.fonts) for (const [k, v] of Object.entries(tema.fonts)) if (vars?.[k] !== v) dif.push(`${k}=${vars?.[k]}≠${v}`);
  return dif;
}
/** Os tokens que o canvas de fato recebeu, lidos numa seção do iframe. */
const tokensNoCanvas = page =>
  page.evaluate(() => {
    const d = document.querySelector('iframe')?.contentDocument;
    const el = d?.querySelector('[data-section-uid]');
    if (!el) return null;
    const cs = d.defaultView.getComputedStyle(el);
    const v = n => cs.getPropertyValue(n).trim().toLowerCase();
    return { bg1: v('--background-primary-color'), texto: v('--text-primary-color'), fonte1: v('--font-primary'), fonte2: v('--font-secundary') };
  });

const reais = erros => erros.filter(e => !/Failed to load resource|favicon|net::ERR|Download the React DevTools/.test(e));

const browser = await abrirBrowser();
/** As seções que o editor gravou ao aplicar cada template — as fotos do /p usam ELAS (a ordem real). */
const aplicadas = {};
const temasAplicados = {};
const gravadas = page => page.evaluate(() => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]'));

// ── 1. a lista nas três plataformas ─────────────────────────────────────────
for (const plat of ['VTEX', 'Wake', 'Tray']) {
  const { page } = await aba(browser);
  await semear(page, { plataforma: plat, token: plat === 'Wake' ? 'TOKEN-DE-TESTE' : '' });
  await abrirPainel(page);
  const lista = await cartoes(page);
  const esp = esperadas(plat);
  r.ok(
    `${plat}: os templates listados são os completos derivados do catálogo (${esp.join(', ')})`,
    lista.map(c => c.t).join() === esp.join(),
    lista.map(c => c.t).join()
  );
  r.ok(`${plat}: as famílias 09 e 10 estão entre eles`, esp.includes('9') && esp.includes('10'));
  const c9 = lista.find(c => c.t === '9');
  const c10 = lista.find(c => c.t === '10');
  r.ok(
    `${plat}: nome e contagem de peças (09 · Editorial, 10 · Varejo)`,
    !!c9 &&
      c9.texto.includes('09 · Editorial') &&
      c9.texto.includes(`${daFamilia('9', plat).length} peças`) &&
      !!c10 &&
      c10.texto.includes('10 · Varejo') &&
      c10.texto.includes(`${daFamilia('10', plat).length} peças`),
    `${c9?.texto} | ${c10?.texto}`
  );
  r.ok(`${plat}: cada card tem a prévia em mosaico (4 thumbs)`, lista.every(c => c.imgs === 4), lista.map(c => c.imgs).join());
  r.ok(
    `${plat}: nenhum nome de cliente nos cards (só "NN · Nome" ou "Template NN")`,
    lista.every(c => /^(\d\d · \p{L}+|Template \d\d) ?(Em uso · )?\d+ peças$/u.test(c.texto)),
    lista.map(c => c.texto).join(' | ')
  );
  if (plat === 'VTEX') await foto(page, 'vtex-painel-templates');
  await page.close();
}

// ── 2 a 6. VTEX ponta a ponta ───────────────────────────────────────────────
{
  const { page, erros, dialogos, resposta } = await aba(browser);
  await semear(page, { plataforma: 'VTEX' });
  await abrirPainel(page);

  await clicarDeVerdade(page, '[data-templates-lista] [data-template="9"]');
  await page.waitForFunction(n => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').length === n, { timeout: 20000 }, daFamilia('9', 'VTEX').length).catch(() => {});
  await espera(1500);
  r.ok('VTEX: escolher a 09 com a loja vazia não pede confirmação', dialogos.length === 0, JSON.stringify(dialogos));
  aplicadas['9'] = await gravadas(page);
  temasAplicados['9'] = await temaGravado(page);
  {
    const d1 = difNivel1(aplicadas['9'], '9');
    const n = Object.keys(NIVEL1['9'] ?? {}).length;
    r.ok(`VTEX 09: Nível 1 próprio só nas ${n} peças do mapa, com os valores do mapa`, n > 0 && d1.length === 0, d1.slice(0, 4).join(' | '));
    await page
      .waitForFunction(
        () => {
          const d = document.querySelector('iframe')?.contentDocument;
          const h = d?.querySelector('[data-selection="header"]');
          return !!h && [...h.querySelectorAll('*')].some(e => d.defaultView.getComputedStyle(e).backgroundColor === 'rgb(247, 244, 239)');
        },
        { timeout: 20000, polling: 300 }
      )
      .catch(() => {});
    const hdr = await page.evaluate(() => {
      const d = document.querySelector('iframe')?.contentDocument;
      const h = d?.querySelector('[data-selection="header"]');
      if (!h) return null;
      const cs = d.defaultView.getComputedStyle(h);
      return {
        var: cs.getPropertyValue('--header-bg').trim().toLowerCase(),
        creme: [...h.querySelectorAll('*')].some(e => d.defaultView.getComputedStyle(e).backgroundColor === 'rgb(247, 244, 239)'),
      };
    });
    r.ok('VTEX 09: o header pinta o creme do desenho (#f7f4ef), não a cor de marca', hdr?.var === '#f7f4ef' && hdr?.creme, JSON.stringify(hdr));
    const botao = await page.evaluate(() => {
      const d = document.querySelector('iframe')?.contentDocument;
      const b = [...(d?.querySelectorAll('[data-selection="popup-news"] button') ?? [])].find(x => /CADASTRAR/i.test(x.textContent));
      return b ? { bg: d.defaultView.getComputedStyle(b).backgroundColor, cor: d.defaultView.getComputedStyle(b).color } : null;
    });
    r.ok('VTEX 09: o botão do pop-up é o do desenho (fundo #1d1b18, texto #f7f4ef)', botao?.bg === 'rgb(29, 27, 24)' && botao?.cor === 'rgb(247, 244, 239)', JSON.stringify(botao));
    await page.evaluate(() => document.querySelector('iframe').contentDocument.querySelector('[data-selection="header"]').click());
    await espera(1200);
    const painel = await page.evaluate(() => {
      const p = document.querySelector('[aria-label="Editar variáveis do componente"]');
      return p ? { texto: (p.textContent + ' ' + [...p.querySelectorAll('input')].map(i => i.value).join(' ')).toLowerCase(), restaurar: [...p.querySelectorAll('button')].some(b => /Restaurar padrão/.test(b.textContent)) } : null;
    });
    r.ok('VTEX 09: o painel da direita mostra a cor própria do header (f7f4ef) e o "Restaurar padrão"', !!painel?.restaurar && painel.texto.includes('f7f4ef'), painel?.texto.slice(-200));
  }
  {
    const g = await temaGravado(page);
    const dif = difTema(g, '9');
    r.ok('VTEX: a 09 traz a paleta e as fontes do desenho (autorais, derivadas pelo contraste, Fraunces + Figtree)', dif.length === 0, dif.join(' | ') || JSON.stringify(g.fonts));
    await page
      .waitForFunction(
        bg => (document.querySelector('iframe')?.contentDocument?.querySelector('[data-section-uid]') && getComputedStyle(document.querySelector('iframe').contentDocument.querySelector('[data-section-uid]')).getPropertyValue('--background-primary-color').trim().toLowerCase() === bg),
        { timeout: 20000, polling: 300 },
        TEMA['9'].colors.colorPrimaryBackground
      )
      .catch(() => {});
    const tk = await tokensNoCanvas(page);
    r.ok(
      'VTEX 09: o canvas recebe os tokens da família (fundo de marca, texto, fontes)',
      tk?.bg1 === TEMA['9'].colors.colorPrimaryBackground && tk?.texto === TEMA['9'].colors.colorPrimary && /fraunces/.test(tk?.fonte1 ?? '') && /figtree/.test(tk?.fonte2 ?? ''),
      JSON.stringify(tk)
    );
  }
  const s9 = (await salvas(page)).sort();
  r.ok('VTEX: a 09 preenche todo slot da família, e só ela', s9.join() === chaves('9', 'VTEX').join(), s9.join());
  const destino = await page.evaluate(
    () => document.querySelector('nav[aria-label="Seções do editor"] button[aria-current]')?.getAttribute('aria-label')
  );
  r.ok('VTEX: depois de aplicar, o rail vai para Componentes', destino === 'Componentes', destino);

  // A ordem da home (a do desenho): abertura logo depois do header, footer no fim.
  const home = await esperarCanvas(page, noCanvas('9', 'VTEX', 'home'));
  r.ok('VTEX 09: home no canvas com todas as peças da família', [...home].sort().join() === noCanvas('9', 'VTEX', 'home').join(), home.join());
  r.ok(
    'VTEX 09: ordem da home começa por header → banner principal → régua → categorias e termina no footer',
    home[0] === 'header' && home[1] === 'banner-main' && home[2] === 'ruler' && home[3] === 'categories' && home.at(-1) === 'footer',
    home.join()
  );
  await foto(page, 'vtex-09-home');
  for (const [pg, nome] of [['category', 'categoria'], ['product', 'produto']]) {
    await trocarPagina(page, pg);
    const c = await esperarCanvas(page, noCanvas('9', 'VTEX', pg));
    r.ok(`VTEX 09: ${nome} no canvas com as peças da família`, [...c].sort().join() === noCanvas('9', 'VTEX', pg).join(), c.join());
    await foto(page, `vtex-09-${nome}`);
  }
  await trocarPagina(page, 'common');
  const comum = await esperarCanvas(page, ['header', 'breadcrumb', 'spot', 'footer']);
  r.ok('VTEX 09: o spot da família está na visão "Todas as páginas"', comum.includes('spot'), comum.join());

  // 4. trocar uma peça depois
  await adicionarPeloModal(page, 'Header', 'Header Template 1', 'common');
  const trocado = await salvas(page);
  r.ok(
    'VTEX: trocar o header pelo modal depois de aplicar funciona (09 sai, 01 entra, nada mais muda)',
    trocado.includes('header:01') && !trocado.includes('header:09') && trocado.length === s9.length,
    trocado.join()
  );
  await trocarPagina(page, 'home');

  // 5. confirmação: cancelar não muda nada, aceitar troca tudo
  await abrirPainel(page);
  resposta.valor = false;
  const antes = (await salvas(page)).sort().join();
  const temaAntes = await temaGravado(page);
  await clicarDeVerdade(page, '[data-templates-lista] [data-template="10"]');
  await espera(1200);
  const confirmou = dialogos.find(d => d.tipo === 'confirm');
  r.ok(
    'VTEX: com seções escolhidas, escolher a 10 pede confirmação (nome, contagem, paleta e fontes, seções com cor própria)',
    !!confirmou && /10 · Varejo/.test(confirmou.msg) && /substituídas/.test(confirmou.msg) && /paleta e as fontes/.test(confirmou.msg) && /Archivo/.test(confirmou.msg) && /ganham cor própria/.test(confirmou.msg),
    confirmou?.msg
  );
  r.ok('VTEX: cancelar a confirmação não muda nenhuma seção', (await salvas(page)).sort().join() === antes);
  r.ok('VTEX: cancelar não muda a paleta nem as fontes', JSON.stringify(await temaGravado(page)) === JSON.stringify(temaAntes));
  resposta.valor = true;
  await clicarDeVerdade(page, '[data-templates-lista] [data-template="10"]');
  await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').every(s => /^10$/.test(s.id)), { timeout: 20000 }).catch(() => {});
  await espera(1200);
  aplicadas['10'] = await gravadas(page);
  const tema10 = await temaGravado(page);
  temasAplicados['10'] = tema10;
  r.ok('VTEX: aceitar traz a paleta e as fontes da 10 (Archivo)', difTema(tema10, '10').length === 0, difTema(tema10, '10').join(' | '));
  r.ok('VTEX 10: Nível 1 próprio só nas peças do mapa da 10', difNivel1(aplicadas['10'], '10').length === 0, difNivel1(aplicadas['10'], '10').slice(0, 4).join(' | '));
  await espera(1500);
  const hdr10 = await page.evaluate(() => {
    const d = document.querySelector('iframe')?.contentDocument;
    const h = d?.querySelector('[data-selection="header"]');
    return h ? [...h.querySelectorAll('*')].some(e => d.defaultView.getComputedStyle(e).backgroundColor === 'rgb(255, 255, 255)') : null;
  });
  r.ok('VTEX 10: a faixa do meio do header é branca, como o desenho', hdr10 === true);
  const s10 = (await salvas(page)).sort();
  r.ok('VTEX: aceitar troca a loja inteira pela 10', s10.join() === chaves('10', 'VTEX').join(), s10.join());
  // O undo desfaz a aplicação inteira num passo, e o redo a refaz.
  await clicarDeVerdade(page, 'button[aria-label="Voltar"]');
  await espera(1200);
  r.ok('VTEX: Voltar (undo) desfaz a aplicação da 10 num passo só', (await salvas(page)).sort().join() === antes, (await salvas(page)).join());
  {
    const g = await temaGravado(page);
    r.ok('VTEX: o mesmo undo restaura a paleta e as fontes de antes (as da 09)', JSON.stringify(g) === JSON.stringify(temaAntes), JSON.stringify(g.fonts));
    const vol = await gravadas(page);
    r.ok('VTEX: o mesmo undo devolve o Nível 1 da 09 (o header trocado pelo 01 fica sem)', difNivel1(vol.filter(x => x.layoutKey !== 'header'), '9').length === 0 && !vol.find(x => x.layoutKey === 'header')?.variables, difNivel1(vol, '9').slice(0, 3).join(' | '));
  }
  await clicarDeVerdade(page, 'button[aria-label="Avançar"]');
  await espera(1200);
  r.ok('VTEX: refazer devolve o Nível 1 da 10', difNivel1(await gravadas(page), '10').length === 0);
  r.ok('VTEX: refazer devolve a 10, peças, paleta e fontes', (await salvas(page)).sort().join() === s10.join() && JSON.stringify(await temaGravado(page)) === JSON.stringify(tema10));
  for (const [pg, nome] of [['home', 'home'], ['category', 'categoria'], ['product', 'produto']]) {
    if (pg !== 'home') await trocarPagina(page, pg);
    const c = await esperarCanvas(page, noCanvas('10', 'VTEX', pg));
    r.ok(`VTEX 10: ${nome} no canvas com as peças da família`, [...c].sort().join() === noCanvas('10', 'VTEX', pg).join(), c.join());
    await foto(page, `vtex-10-${nome}`);
  }
  await trocarPagina(page, 'home');
  await abrirPainel(page);
  const emUso = (await cartoes(page)).find(c => c.t === '10');
  r.ok('VTEX: o card da 10 aparece "Em uso"', !!emUso?.pressionado && /Em uso/.test(emUso.texto), emUso?.texto);
  await foto(page, 'vtex-10-painel-em-uso');

  // 6. export
  const cfg = await exportar(page);
  r.ok('VTEX: o export entrega o config depois de aplicar a 10', !!cfg);
  if (cfg) {
    fs.writeFileSync(path.join(FOTOS, 'config-vtex-10.json'), JSON.stringify(cfg, null, 2));
    const fs10 = cfg.faststore ?? {};
    const titulos = ['global', 'home', 'category', 'product', 'overrides'].flatMap(k => (fs10[k] ?? []).map(e => e.title)).sort();
    const esp = daFamilia('10', 'VTEX').map(i => i.component).sort();
    r.ok('VTEX: o config sai com as peças da família 10, todas', titulos.join() === esp.join(), titulos.join());
    const porComp = Object.fromEntries(['global', 'home', 'category', 'product', 'overrides'].flatMap(k => (fs10[k] ?? []).filter(e => e.variables).map(e => [e.title, e.variables])));
    r.ok('VTEX: o export carrega as variables de Nível 1 por componente, iguais ao mapa da 10', JSON.stringify(Object.keys(porComp).sort()) === JSON.stringify(Object.keys(NIVEL1['10']).sort()) && Object.entries(NIVEL1['10']).every(([c, v]) => JSON.stringify(porComp[c]) === JSON.stringify(v)), Object.keys(porComp).join());
    const dv = difVariaveis(fs10.variables, '10');
    r.ok('VTEX: faststore.variables leva as cores e as fontes da 10', dv.length === 0, dv.join(' | '));
    conferirFaststore(cfg, r);
  }

  r.ok('VTEX: sem erro de console/página no fluxo inteiro', reais(erros).length === 0, reais(erros).slice(0, 4).join(' | '));
  await page.close();
}

// ── 6. Wake (09) e Tray (10): o export passa no contrato ───────────────────
for (const [plat, t] of [['Wake', '9'], ['Tray', '10']]) {
  const { page, erros } = await aba(browser);
  await semear(page, { plataforma: plat, token: plat === 'Wake' ? 'TOKEN-DE-TESTE' : '' });
  await abrirPainel(page);
  await clicarDeVerdade(page, `[data-templates-lista] [data-template="${t}"]`);
  await page.waitForFunction(n => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').length === n, { timeout: 20000 }, daFamilia(t, plat).length).catch(() => {});
  const s = (await salvas(page)).sort();
  r.ok(`${plat}: a ${t.padStart(2, '0')} preenche todo slot da família`, s.join() === chaves(t, plat).join(), s.join());
  const c = await esperarCanvas(page, noCanvas(t, plat, 'home'));
  r.ok(`${plat} ${t.padStart(2, '0')}: home no canvas com as peças da família`, [...c].sort().join() === noCanvas(t, plat, 'home').join(), c.join());
  await foto(page, `${plat.toLowerCase()}-${t.padStart(2, '0')}-home`);
  const cfg = await exportar(page);
  r.ok(`${plat}: o export entrega o config`, !!cfg);
  if (cfg) {
    fs.writeFileSync(path.join(FOTOS, `config-${plat.toLowerCase()}-${t}.json`), JSON.stringify(cfg, null, 2));
    const raiz = cfg[plat.toLowerCase()] ?? {};
    const entradas = ['global', 'home', 'category', 'product'].flatMap(k => raiz[k] ?? []);
    r.ok(
      `${plat}: toda entrada do config é da família ${t} e nenhuma falta`,
      entradas.length === daFamilia(t, plat).length && entradas.every(e => e.template === t),
      `${entradas.length} entradas: ${[...new Set(entradas.map(e => e.template))].join()}`
    );
    const comVars = entradas.filter(e => e.variables).length;
    r.ok(`${plat}: o export carrega o Nível 1 das ${Object.keys(NIVEL1[t] ?? {}).length} peças do mapa da ${t.padStart(2, '0')}`, comVars === Object.keys(NIVEL1[t] ?? {}).length, `${comVars} entradas com variables`);
    const dv = difVariaveis(raiz.variables, t);
    r.ok(`${plat}: ${plat.toLowerCase()}.variables leva as cores e as fontes da ${t.padStart(2, '0')}`, dv.length === 0, dv.join(' | '));
    conferirTrayWake(cfg, plat, r);
  }
  if (plat === 'Tray') {
    // Família sem tema (Template 01): as peças trocam, a paleta e as fontes ficam.
    const antes01 = await temaGravado(page);
    const msgs = [];
    page.on('dialog', d => msgs.push(d.message()));
    await abrirPainel(page);
    await clicarDeVerdade(page, '[data-templates-lista] [data-template="1"]');
    await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').every(s => s.id === '01'), { timeout: 20000 }).catch(() => {});
    await espera(1200);
    const s01 = (await salvas(page)).sort();
    r.ok('Tray: Template 01 troca as peças e avisa que cores e fontes não mudam', s01.join() === chaves('1', 'Tray').join() && msgs.some(m => /Cores e fontes não mudam/.test(m)), msgs.join(' / '));
    r.ok('Tray: Template 01 (sem tema) mantém a paleta e as fontes', JSON.stringify(await temaGravado(page)) === JSON.stringify(antes01));
  }
  r.ok(`${plat}: sem erro de console/página`, reais(erros).length === 0, reais(erros).slice(0, 4).join(' | '));
  await page.close();
}

// ── 9. a aba nova entra com o template padrão ───────────────────────────────
// `ENTRADA_PADRAO` (templatesCompletos.ts), lido do fonte: a aba SEM trabalho no
// sessionStorage entra com aquela plataforma e aquele template, aplicados como o
// "Por template" aplica (peças, paleta, fontes, Nível 1), sem confirm, sem pintar
// o convite em momento nenhum e sem "Voltar" para a tela vazia. Recarregar não
// reaplica. O "Começar do zero" do painel esvazia (confirm + um undo) e a loja
// vazia recarregada mostra o convite, que continua levando ao template.
{
  const ts = fs.readFileSync(path.resolve(new URL('../../src/utils/templatesCompletos.ts', import.meta.url).pathname), 'utf8');
  const m = ts.match(/export const ENTRADA_PADRAO[\s\S]*?platform: '(\w+)',\s*template: '(\d+)'/);
  const PLAT = m?.[1];
  const T = m ? String(Number(m[2])) : null;
  r.ok('ENTRADA_PADRAO legível no fonte (plataforma + template completo nela)', !!PLAT && !!T && completa(T, PLAT), `${PLAT} ${T}`);
  const { page, erros, dialogos, resposta } = await aba(browser);
  // Sentinela desde antes do 1º script: o convite não pode aparecer NEM por um frame.
  await page.evaluateOnNewDocument(() => {
    window.__convite = false;
    new MutationObserver(() => {
      if (document.querySelector('[data-canvas-vazio]')) window.__convite = true;
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await page.waitForFunction(n => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').length === n, { timeout: 60000, polling: 100 }, daFamilia(T, PLAT).length).catch(() => {});
  const vistoCanvas = await esperarCanvas(page, noCanvas(T, PLAT, 'home'));
  await espera(1000);
  const entrada = await gravadas(page);
  const est = await page.evaluate(() => ({
    plat: sessionStorage.getItem('layoutPlatform'),
    convite: window.__convite || !!document.querySelector('[data-canvas-vazio]'),
    voltar: document.querySelector('button[aria-label="Voltar"]')?.disabled ?? null,
  }));
  r.ok(`aba nova: plataforma ${PLAT}`, est.plat === PLAT, est.plat);
  r.ok(`aba nova: todas as peças da ${T} (e só elas)`, (await salvas(page)).sort().join() === chaves(T, PLAT).join(), (await salvas(page)).join());
  r.ok('aba nova: o canvas da home pinta a família', vistoCanvas.sort().join() === noCanvas(T, PLAT, 'home').join(), vistoCanvas.join());
  if (TEMA[T]) {
    const dif = difTema(await temaGravado(page), T);
    r.ok(`aba nova: paleta e fontes da ${T}`, dif.length === 0, dif.join(' | '));
  }
  const d1 = difNivel1(entrada, T);
  r.ok(`aba nova: Nível 1 próprio igual ao mapa da ${T}`, d1.length === 0, d1.slice(0, 4).join(' | '));
  r.ok('aba nova: nenhum confirm/alert', dialogos.length === 0, JSON.stringify(dialogos));
  r.ok('aba nova: o convite "Comece seu tema" nunca pintou', !est.convite);
  r.ok('aba nova: "Voltar" desabilitado (não leva à tela vazia)', est.voltar === true, String(est.voltar));
  await abrirPainel(page);
  r.ok(`aba nova: o card da ${T} está "Em uso"`, (await cartoes(page)).find(c => c.t === T)?.pressionado === true);
  await foto(page, 'entrada-padrao');

  // Recarregar mantém (mesmos uid: nada foi reaplicado).
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await esperarCanvas(page, noCanvas(T, PLAT, 'home'));
  await espera(1000);
  const recarregada = await gravadas(page);
  r.ok('recarregar não reaplica o padrão (mesmas seções, mesmos uid)', recarregada.map(s => s.uid).join() === entrada.map(s => s.uid).join());

  // "Começar do zero" no painel: confirm (há o que perder), esvazia, um undo.
  await abrirPainel(page);
  dialogos.length = 0;
  resposta.valor = false;
  await clicarDeVerdade(page, '[data-templates-zero]');
  await espera(800);
  r.ok('"Começar do zero" com a loja montada pede confirmação; cancelar não muda nada', dialogos.some(d => d.tipo === 'confirm' && /Começar do zero/.test(d.msg)) && (await gravadas(page)).length === entrada.length);
  resposta.valor = true;
  await clicarDeVerdade(page, '[data-templates-zero]');
  await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').length === 0, { timeout: 20000 }).catch(() => {});
  await espera(800);
  const zerado = await page.evaluate(() => ({
    n: JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').length,
    convite: !!document.querySelector('[data-canvas-vazio]'),
    rail: document.querySelector('nav[aria-label="Seções do editor"] button[aria-current]')?.getAttribute('aria-label') ?? null,
  }));
  r.ok('aceitar esvazia a loja e vai para Componentes, sem convite nesta carga', zerado.n === 0 && !zerado.convite && zerado.rail === 'Componentes', JSON.stringify(zerado));
  await clicarDeVerdade(page, 'button[aria-label="Voltar"]');
  await espera(800);
  r.ok('um "Voltar" devolve a família inteira', (await gravadas(page)).length === entrada.length);
  await clicarDeVerdade(page, 'button[aria-label="Avançar"]');
  await espera(800);
  // Loja vazia recarregada: o padrão NÃO volta e o convite aparece (EmptyCanvas vivo).
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  const conviteVoltou = await page.waitForSelector('[data-canvas-vazio]', { timeout: 30000 }).then(() => true).catch(() => false);
  r.ok('loja vazia recarregada: sem o padrão, com o convite', conviteVoltou && (await gravadas(page)).length === 0);
  await foto(page, 'vazia-recarregada-convite');
  dialogos.length = 0;
  await clicarDeVerdade(page, '[data-inicio="template"]');
  await page.waitForSelector(`[data-templates-lista] [data-template="${T}"]`, { timeout: 30000 });
  await clicarDeVerdade(page, `[data-templates-lista] [data-template="${T}"]`);
  await page.waitForFunction(n => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').length === n, { timeout: 20000 }, daFamilia(T, PLAT).length).catch(() => {});
  r.ok('o convite segue levando ao template (sem confirm, loja vazia)', (await gravadas(page)).length === daFamilia(T, PLAT).length && dialogos.length === 0, JSON.stringify(dialogos));
  r.ok('entrada padrão: sem erro de console/página', reais(erros).length === 0, reais(erros).slice(0, 4).join(' | '));
  await page.close();
}

// ── as páginas inteiras, pelo preview compartilhável (só fotos) ─────────────
for (const t of ['9', '10']) {
  const sel = aplicadas[t];
  if (!sel?.length) continue;
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  const id = await page.evaluate(async (s, tema) => {
    const res = await fetch('/gerador/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'VTEX',
        selections: s,
        colors: tema.colors,
        fonts: tema.fonts,
        logo: '',
        favicon: '',
      }),
    });
    return res.ok ? (await res.json()).id : null;
  }, sel, temasAplicados[t]);
  if (!id) {
    r.ok(`/p da ${t}: o preview foi criado`, false);
    await page.close();
    continue;
  }
  for (const slug of ['home', 'categoria', 'produto']) {
    await page.goto(`${BASE_URL}/p/${id}/${slug}`, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
    await page.waitForSelector('[data-section-uid]', { timeout: 30000 }).catch(() => {});
    await espera(1500);
    await page.screenshot({ path: path.join(FOTOS, `pagina-${t.padStart(2, '0')}-${slug}.png`), fullPage: true });
    if (slug === 'home') {
      // Peças avulsas para comparar com os desenhos (o pop-up fechado antes).
      await page.evaluate(() => [...document.querySelectorAll('button, a')].find(b => /Agora não/i.test(b.textContent))?.click());
      await espera(800);
      for (const sel of ['header', 'banner-main', 'showcase', 'newsletter', 'countdown']) {
        const el = await page.$(`[data-selection="${sel}"]`);
        if (el) await el.screenshot({ path: path.join(FOTOS, `peca-${t.padStart(2, '0')}-${sel}.png`) }).catch(() => {});
      }
    }
  }
  await page.close();
}

await browser.close();
process.exit(r.fechar() ? 0 : 1);
