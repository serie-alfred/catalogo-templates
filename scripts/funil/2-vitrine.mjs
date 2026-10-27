/**
 * Estágio 2v — a vitrine pública dos templates completos: a home lista as
 * famílias e `/templates/<NN>/<página>` mostra a loja montada, só para ver.
 *
 * Prova:
 *  1. a home lista exatamente os templates completos — a regra é reescrita aqui
 *     de propósito, como no 2-templates: mudar um lado só reprova —, do mais
 *     novo para o mais antigo, com nome; "Novos" são os `NOVIDADES` primeiros;
 *  2. cada card tem a thumb própria (`public/images/templates/<NN>.webp`, 800×608,
 *     servida e usada pelo card — não a imagem genérica), e o card INTEIRO é um
 *     link só, para a vitrine, sem botões dentro; clicar no card (no nome, longe
 *     da imagem) abre o template na mesma aba;
 *  3. cada template abre nas 3 páginas pela barra: o iframe monta as peças que a
 *     página deve mostrar (previewRender), com o tema da família sobre o
 *     `TEMA_INICIAL` e o Nível 1 de `NIVEL1_DAS_FAMILIAS` só nas seções do mapa,
 *     sem marcador de registry e sem erro de console;
 *  4. só olha: nada na barra nem na loja leva ao /gerador, não há "Editar",
 *     clicar numa seção não a seleciona, e link ou formulário da loja não tiram
 *     o iframe do lugar;
 *  5. o seletor de página navega (URL e iframe trocam) e mantém a visão; o
 *     Desktop/Mobile troca a moldura para 375px SEM recarregar a loja, a URL
 *     acompanha, e o `isMobile` dos templates vê a largura do iframe;
 *  6. a cara é a do editor: uma aba NOVA do /gerador entra com `ENTRADA_PADRAO`
 *     aplicado, e o canvas dela tem as mesmas seções, na mesma ordem, com as
 *     mesmas variáveis de tema e de Nível 1, que a vitrine dessa família;
 *  7. família incompleta e página inválida dão 404; `/templates/<NN>` leva à
 *     home do template; a vitrine fica fora do login.
 *
 * Fotos em `.funil/vitrine/`.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { relatorio, espera, BASE_URL, SAIDA, RAIZ, itens } from './lib/util.mjs';
import { abrirBrowser, novaAba } from './lib/editor.mjs';

const r = relatorio('Estágio 2v — vitrine pública dos templates (/templates)');
const FOTOS = path.join(SAIDA, 'vitrine');
fs.mkdirSync(FOTOS, { recursive: true });

const fonte = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const TS = fonte('src/utils/templatesCompletos.ts');

// ── o que se espera, derivado do catálogo ─────────────────────────────────────
const entrada = TS.match(/export const ENTRADA_PADRAO[\s\S]*?platform: '(\w+)',\s*template: '(\d+)'/);
const PLAT = entrada?.[1];
const T_PADRAO = entrada ? String(Number(entrada[2])) : null;
const NOVIDADES = Number(fonte('src/utils/vitrineTemplates.ts').match(/export const NOVIDADES = (\d+)/)?.[1]);
const NOMES = Object.fromEntries(
  [...(TS.match(/const NOMES[^{]*\{([\s\S]*?)\n\};/)?.[1] ?? '').matchAll(/'(\d+)': '([^']+)'/g)].map(m => [m[1], m[2]])
);

const TODOS = itens();
const OBRIGATORIOS = {
  common: ['header', 'footer', 'breadcrumb', 'spot'],
  home: ['banner-main', 'showcase'],
  category: ['category-main'],
  product: ['product-info'],
};
const daFamilia = t => TODOS.filter(i => i.template === t && i.platforms.includes(PLAT));
const completa = t =>
  Object.entries(OBRIGATORIOS).every(([pg, sels]) => sels.every(s => daFamilia(t).some(i => i.selection === s && i.pagina.includes(pg))));
const FAMILIAS = [...new Set(TODOS.map(i => i.template))];
const ESPERADAS = FAMILIAS.filter(completa).sort((a, b) => Number(b) - Number(a));
const INCOMPLETA = FAMILIAS.find(t => !completa(t));
const pad = t => t.padStart(2, '0');
const nomeDe = t => (NOMES[t] ? `${pad(t)} · ${NOMES[t]}` : `Template ${pad(t)}`);

const PAGINAS = [
  { slug: 'home', pagina: 'home', nome: 'Homepage' },
  { slug: 'categoria', pagina: 'category', nome: 'Página de Categoria' },
  { slug: 'produto', pagina: 'product', nome: 'Página de Produto' },
];
/** O que a página mostra (previewRender.belongsToPage), em ordem de selection. */
const naPagina = (t, pagina) =>
  daFamilia(t)
    .filter(i => {
      const pg = i.pagina[0];
      if (i.selection === 'spot') return false;
      if (i.selection === 'breadcrumb' && pagina === 'home') return false;
      return pg === pagina || pg === 'common';
    })
    .map(i => i.selection)
    .sort();

/** Família → tema e família → componente → Nível 1, lidos dos blocos gerados. */
const TEMA = (() => {
  const bloco = TS.slice(TS.indexOf('export const TEMA_DAS_FAMILIAS'), TS.indexOf('\n};', TS.indexOf('export const TEMA_DAS_FAMILIAS')));
  const out = {};
  for (const [, fam, corpo] of bloco.matchAll(/\n {2}'(\d+)': \{([\s\S]*?)\n {2}\},/g)) {
    const colors = Object.fromEntries([...corpo.matchAll(/(color\w+): '(#[0-9a-f]+)'/g)].map(m => [m[1], m[2]]));
    const f = corpo.match(/fontPrimary: '([^']+)',\s*fontSecondary: '([^']+)',\s*fontTertiary: '([^']+)'/);
    out[fam] = { colors, fonts: f ? { fontPrimary: f[1], fontSecondary: f[2], fontTertiary: f[3] } : null };
  }
  return out;
})();
const NIVEL1 = (() => {
  const ini = TS.indexOf('export const NIVEL1_DAS_FAMILIAS');
  const bloco = TS.slice(ini, TS.indexOf('\n};', ini));
  const out = {};
  for (const [, fam, corpo] of bloco.matchAll(/\n {2}'(\d+)': \{([\s\S]*?)\n {2}\},/g))
    for (const [, comp, vars] of corpo.matchAll(/\n {4}(\w+): \{([\s\S]*?)\n {4}\},/g))
      (out[fam] ??= {})[comp] = Object.fromEntries([...vars.matchAll(/'(--[\w-]+)': '([^']+)'/g)].map(m => [m[1], m[2]]));
  return out;
})();
/** O tema com que o editor nasce (themeStyle.ts), base de toda família. */
const INICIAL = (() => {
  const ts = fonte('src/utils/themeStyle.ts');
  const bloco = ts.slice(ts.indexOf('export const TEMA_INICIAL'), ts.indexOf('\n};', ts.indexOf('export const TEMA_INICIAL')));
  const colors = Object.fromEntries([...bloco.matchAll(/(color\w+): '(#[0-9a-fA-F]+)'/g)].map(m => [m[1], m[2]]));
  const fonts = Object.fromEntries([...bloco.matchAll(/(font\w+): '([^']+)'/g)].map(m => [m[1], m[2]]));
  return { colors, fonts };
})();
const contraste = hex => {
  const h = hex.replace('#', '').replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3');
  const y = (parseInt(h.slice(0, 2), 16) * 299 + parseInt(h.slice(2, 4), 16) * 587 + parseInt(h.slice(4, 6), 16) * 114) / 1000;
  return y >= 128 ? '#000000' : '#ffffff';
};
/** As variáveis de tema que a vitrine deve aplicar (buildThemeStyle). */
function temaEsperado(t) {
  const c = { ...INICIAL.colors, ...TEMA[t]?.colors };
  const f = TEMA[t]?.fonts ?? INICIAL.fonts;
  return {
    '--text-primary-color': c.colorPrimary,
    '--text-secundary-color': c.colorSecondary,
    '--text-tertiary-color': contraste(c.colorTertiaryBackground),
    '--background-primary-color': c.colorPrimaryBackground,
    '--background-secundary-color': c.colorSecondaryBackground,
    '--background-tertiary-color': c.colorTertiaryBackground,
    '--background-footer': c.colorFooter,
    '--text-color-footer': c.colorFooterText,
    '--text-color-base': contraste(c.colorPrimaryBackground),
    '--text-color-secundary': contraste(c.colorSecondaryBackground),
    '--font-primary': `'${f.fontPrimary}', sans-serif`,
    '--font-secundary': `'${f.fontSecondary}', sans-serif`,
    '--font-tertiary': `'${f.fontTertiary}', sans-serif`,
  };
}
const VARS_DO_TEMA = Object.keys(temaEsperado(ESPERADAS[0] ?? '1'));

r.ok('ENTRADA_PADRAO legível no fonte, e o template dela é completo', !!PLAT && !!T_PADRAO && completa(T_PADRAO), `${PLAT} ${T_PADRAO}`);
r.ok('NOVIDADES legível no fonte', NOVIDADES > 0, String(NOVIDADES));
r.ok(`há templates completos em ${PLAT}`, ESPERADAS.length > 0, ESPERADAS.join());

// ── leituras no navegador ─────────────────────────────────────────────────────
/** O documento do iframe da página (a loja), lido pelo pai: mesma origem. */
const DOC = 'document.querySelector("iframe")?.contentDocument';
const lerLoja = page =>
  page.evaluate(
    new Function(
      'vars',
      `const d = ${DOC};
       if (!d) return null;
       const secoes = [...d.querySelectorAll('[data-section-uid]')];
       const tema = secoes[0] ? getComputedStyle(secoes[0]) : null;
       return {
         secoes: secoes.map(s => ({
           selection: s.getAttribute('data-selection'),
           vars: Object.fromEntries([...s.style].filter(p => p.startsWith('--')).sort().map(p => [p, s.style.getPropertyValue(p).trim()])),
         })),
         tema: tema ? Object.fromEntries(vars.map(v => [v, tema.getPropertyValue(v).trim()])) : {},
         registry: [...d.querySelectorAll('[data-registry-missing]')].map(e => e.getAttribute('data-registry-missing')),
         gerador: [...d.querySelectorAll('a[href*="/gerador"]'), ...document.querySelectorAll('a[href*="/gerador"]')].length,
         editar: !!document.querySelector('[data-preview-editar]') || !!d.querySelector('[data-preview-editar]') ||
           [...document.querySelectorAll('a, button')].some(b => /^\\s*Editar\\s*$/i.test(b.textContent ?? '')),
         selecionadas: d.querySelectorAll('[data-selected]').length,
         largura: d.defaultView?.innerWidth ?? 0,
       };`
    ),
    VARS_DO_TEMA
  );
async function esperarLoja(page, alvo) {
  await page
    .waitForFunction(
      new Function('a', `const d = ${DOC}; if (!d) return false;
        return [...d.querySelectorAll('[data-section-uid]')].map(e => e.getAttribute('data-selection')).sort().join() === a;`),
      { timeout: 60000, polling: 400 },
      [...alvo].sort().join()
    )
    .catch(() => {});
  return lerLoja(page);
}
const componenteDe = (t, pagina, selection) =>
  daFamilia(t).find(i => i.selection === selection && (i.pagina[0] === pagina || i.pagina[0] === 'common'))?.component;
const difNivel1 = (t, pagina, secoes) =>
  secoes.flatMap(s => {
    const comp = componenteDe(t, pagina, s.selection);
    const esp = NIVEL1[t]?.[comp] ?? {};
    const ordenado = Object.fromEntries(Object.entries(esp).sort());
    return JSON.stringify(s.vars) === JSON.stringify(ordenado) ? [] : [`${comp}: ${JSON.stringify(s.vars)} ≠ ${JSON.stringify(ordenado)}`];
  });
const difTema = (visto, esperado) =>
  Object.entries(esperado).flatMap(([v, x]) => (String(visto?.[v] ?? '').toLowerCase() === x.toLowerCase() ? [] : [`${v}: ${visto?.[v]} ≠ ${x}`]));

/** Clica até o efeito aparecer: o botão existe no HTML antes de o React
 *  hidratar, e clique em botão não hidratado não faz nada — em silêncio. */
async function insistir(page, clicar, pronto, ms = 20000) {
  const limite = Date.now() + ms;
  while (Date.now() < limite) {
    if (await page.evaluate(pronto)) return true;
    await page.evaluate(clicar);
    await espera(500);
  }
  return page.evaluate(pronto);
}

const browser = await abrirBrowser();

// ── 1 e 2. a home ─────────────────────────────────────────────────────────────
{
  const { page, erros } = await novaAba(browser);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 120000 });
  await page.waitForSelector('[data-home-catalogo] [data-spot]', { timeout: 60000 }).catch(() => {});
  const cards = await page.$$eval('[data-home-catalogo] [data-spot]', els =>
    els.map(e => ({
      id: e.getAttribute('data-spot'),
      titulo: e.querySelector('h3')?.textContent.trim(),
      img: decodeURIComponent(e.querySelector('img')?.getAttribute('src') ?? ''),
      tag: e.tagName,
      href: e.getAttribute('href'),
      novaAba: e.getAttribute('target') === '_blank',
      dentro: e.querySelectorAll('a, button').length,
    }))
  );
  r.ok(
    `a home lista os ${ESPERADAS.length} templates completos, do mais novo para o mais antigo`,
    cards.map(c => c.id).join() === ESPERADAS.map(t => String(Number(t))).join(),
    `${cards.map(c => c.id).join()} ≠ ${ESPERADAS.join()}`
  );
  r.ok(
    'cada card tem o nome do template (09 · Editorial, Template 01)',
    cards.every((c, i) => c.titulo === nomeDe(ESPERADAS[i] ?? '')),
    cards.map(c => c.titulo).join(' | ')
  );
  const novos = await page.$$eval('[data-home-novos] [data-spot]', els => [...new Set(els.map(e => e.getAttribute('data-spot')))]);
  r.ok(
    `"Novos" mostra os ${NOVIDADES} mais recentes`,
    novos.join() === ESPERADAS.slice(0, NOVIDADES).map(t => String(Number(t))).join(),
    novos.join()
  );

  for (const [i, t] of ESPERADAS.entries()) {
    const c = cards[i];
    const arq = path.join(RAIZ, 'public/images/templates', `${pad(t)}.webp`);
    const meta = fs.existsSync(arq) ? await sharp(arq).metadata() : null;
    r.ok(`${pad(t)}: a thumb existe em disco, 800×608`, meta?.width === 800 && meta?.height === 608, meta ? `${meta.width}×${meta.height}` : `falta ${arq}`);
    r.ok(`${pad(t)}: o card usa a thumb do template, não a genérica`, !!c?.img.includes(`/images/templates/${pad(t)}.webp`), c?.img);
    const st = await fetch(`${BASE_URL}/images/templates/${pad(t)}.webp`).then(x => x.status).catch(() => 0);
    r.ok(`${pad(t)}: a thumb é servida`, st === 200, String(st));
    r.ok(
      `${pad(t)}: o card inteiro é um link só para a vitrine, na mesma aba, sem botões dentro`,
      c?.tag === 'A' && c?.href === `/templates/${pad(t)}/home` && !c?.novaAba && c?.dentro === 0,
      JSON.stringify(c)
    );
  }
  await (await page.$('#templates'))?.screenshot({ path: path.join(FOTOS, 'home-catalogo.png') }).catch(() => {});

  // Clique de mouse de verdade no NOME do primeiro card, longe da imagem: o card
  // todo é clicável, não só a foto.
  const alvo = `/templates/${pad(ESPERADAS[0])}/home`;
  const nome = await page.$('[data-home-catalogo] [data-spot] h3');
  await nome?.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await espera(400);
  await nome?.click();
  await page.waitForFunction(a => location.pathname === a, { timeout: 30000 }, alvo).catch(() => {});
  r.ok('clicar no nome do card abre o template na mesma aba', new URL(page.url()).pathname === alvo, page.url());
  r.ok('home sem erro de console', erros.length === 0, erros.slice(0, 3).join(' | '));
  await page.close();
}

// ── 3 e 4. cada template, nas três páginas, pela barra ────────────────────────
for (const t of ESPERADAS) {
  const { page, erros } = await novaAba(browser);
  await page.setViewport({ width: 1440, height: 900 });
  for (const p of PAGINAS) {
    const url = `/templates/${pad(t)}/${p.slug}`;
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle2', timeout: 120000 }).catch(() => {});
    const esperado = naPagina(t, p.pagina);
    const loja = await esperarLoja(page, esperado);
    const nome = `${pad(t)} ${p.slug}`;
    if (!loja) {
      r.ok(`${nome}: o iframe da loja abriu`, false, url);
      continue;
    }
    const barra = await page.evaluate(() => ({
      nome: document.querySelector('[data-vitrine]')?.textContent ?? '',
      pagina: document.querySelector('[aria-haspopup="listbox"]')?.textContent.trim(),
      src: document.querySelector('iframe')?.getAttribute('src'),
    }));
    r.ok(
      `${nome}: a barra mostra o template e a página, e o iframe é o da loja`,
      barra.nome.includes(nomeDe(t)) && barra.pagina === p.nome && barra.src === `${url}/frame`,
      JSON.stringify(barra)
    );
    const vistas = loja.secoes.map(s => s.selection).sort();
    r.ok(`${nome}: as ${esperado.length} peças da página`, vistas.join() === esperado.join(), `${vistas.join()} ≠ ${esperado.join()}`);
    r.ok(`${nome}: nenhum componente fora do registry`, loja.registry.length === 0, loja.registry.join());
    const dt = difTema(loja.tema, temaEsperado(t));
    r.ok(`${nome}: o tema da família sobre o TEMA_INICIAL`, dt.length === 0, dt.slice(0, 4).join(' | '));
    const d1 = difNivel1(t, p.pagina, loja.secoes);
    r.ok(`${nome}: o Nível 1 do desenho só nas seções do mapa`, d1.length === 0, d1.slice(0, 3).join(' | '));
    r.ok(`${nome}: nada leva ao /gerador, e não há "Editar"`, loja.gerador === 0 && !loja.editar, `${loja.gerador} links, editar=${loja.editar}`);
    if (p.slug === 'home') await page.screenshot({ path: path.join(FOTOS, `vitrine-${pad(t)}-home.png`) });
  }
  r.ok(`${pad(t)}: sem erro de console nas três páginas`, erros.length === 0, erros.slice(0, 3).join(' | '));
  await page.close();
}

// ── 4 e 5. só olha; seletor de página e Desktop/Mobile ────────────────────────
{
  const t = T_PADRAO && ESPERADAS.includes(T_PADRAO) ? T_PADRAO : ESPERADAS[0];
  const { page, erros } = await novaAba(browser);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/templates/${pad(t)}/home`, { waitUntil: 'networkidle2', timeout: 120000 });
  await esperarLoja(page, naPagina(t, 'home'));
  await espera(1500);

  // Clicar numa seção (no meio dela) não seleciona nada nem tira a página do lugar.
  const antes = page.url();
  const caixa = await page.evaluate(
    new Function(`const d = ${DOC}; const s = d?.querySelector('[data-selection="banner-main"]') ?? d?.querySelector('[data-section-uid]');
      const f = document.querySelector('iframe').getBoundingClientRect(); const b = s?.getBoundingClientRect();
      return b ? { x: f.x + b.x + b.width / 2, y: f.y + Math.min(b.y + b.height / 2, 600) } : null;`)
  );
  if (caixa) {
    await page.mouse.move(caixa.x, caixa.y);
    await espera(300);
    await page.mouse.click(caixa.x, caixa.y);
    await espera(800);
  }
  const depois = await lerLoja(page);
  r.ok('clicar numa seção não a seleciona (sem chrome de edição)', !!caixa && depois?.selecionadas === 0, `${depois?.selecionadas} selecionadas`);
  r.ok('clicar numa seção não navega a página', page.url() === antes, page.url());

  // Link e formulário de mock não tiram o iframe da loja.
  const fuga = await page.evaluate(
    new Function(`const d = ${DOC}; const w = d.defaultView; w.__marca = 1;
      const a = d.querySelector('a[href="/"]') ?? d.querySelector('a[href]:not([href^="#"])');
      a?.click();
      const f = d.querySelector('form'); f?.requestSubmit?.();
      return { link: a?.getAttribute('href') ?? null, form: !!f };`)
  );
  await espera(2000);
  const ficou = await page.evaluate(
    new Function(`const d = ${DOC}; return { marca: d?.defaultView?.__marca ?? null, href: d?.defaultView?.location.pathname ?? null };`)
  );
  r.ok(
    `link (${fuga.link}) e formulário (${fuga.form ? 'sim' : 'nenhum'}) da loja não tiram o iframe do lugar`,
    !!fuga.link && ficou.marca === 1 && ficou.href === `/templates/${pad(t)}/home/frame`,
    JSON.stringify(ficou)
  );

  // Desktop → Mobile: a moldura troca, a loja NÃO recarrega, a URL acompanha.
  await page.evaluate(new Function(`const d = ${DOC}; d.defaultView.__marca = 2;`));
  const GRUPO = '[role="group"][aria-label="Visão do preview"]';
  const foi = await insistir(
    page,
    new Function(`[...document.querySelectorAll('${GRUPO} button')].find(b => /mobile/i.test(b.textContent))?.click();`),
    new Function(`return document.querySelector('iframe')?.dataset.vitrineFrame === 'mobile';`)
  );
  await espera(400);
  const mob = await page.evaluate(
    new Function(`const f = document.querySelector('iframe'); return { w: Math.round(f.getBoundingClientRect().width), marca: f.contentWindow.__marca, busca: location.search,
      dentro: f.contentWindow.innerWidth };`)
  );
  r.ok('Mobile: a moldura vai a 375px', foi && mob.w === 375 && mob.dentro === 375, JSON.stringify(mob));
  r.ok('Mobile: a loja não recarrega (mesmo documento)', mob.marca === 2, String(mob.marca));
  r.ok('Mobile: a URL ganha ?vista=mobile', mob.busca === '?vista=mobile', mob.busca);
  await page.screenshot({ path: path.join(FOTOS, `vitrine-${pad(t)}-mobile.png`) });

  // Trocar de página pelo seletor: URL, iframe e peças trocam; a visão fica.
  const abriu = await insistir(
    page,
    () => document.querySelector('[aria-haspopup="listbox"]')?.click(),
    () => document.querySelectorAll('[role="listbox"][aria-label="Página"] [role="option"]').length === 3
  );
  r.ok('o seletor de página abre com as 3 páginas', abriu);
  await page.evaluate(() =>
    [...document.querySelectorAll('[role="listbox"][aria-label="Página"] [role="option"]')].find(o => o.textContent.trim() === 'Página de Produto')?.click()
  );
  await page.waitForFunction(a => location.pathname === a, { timeout: 30000 }, `/templates/${pad(t)}/produto`).catch(() => {});
  const produto = await esperarLoja(page, naPagina(t, 'product'));
  const est = await page.evaluate(() => ({
    path: location.pathname,
    busca: location.search,
    src: document.querySelector('iframe')?.getAttribute('src'),
    vista: document.querySelector('iframe')?.dataset.vitrineFrame,
  }));
  r.ok(
    '"Página de Produto" troca a URL e o iframe, e mantém a visão Mobile',
    est.path === `/templates/${pad(t)}/produto` && est.busca === '?vista=mobile' && est.src === `/templates/${pad(t)}/produto/frame` && est.vista === 'mobile',
    JSON.stringify(est)
  );
  r.ok(
    'a página de produto monta as peças dela',
    produto?.secoes.map(s => s.selection).sort().join() === naPagina(t, 'product').join(),
    produto?.secoes.map(s => s.selection).join()
  );

  // Mobile → Desktop: a moldura volta à largura da janela.
  await insistir(
    page,
    new Function(`[...document.querySelectorAll('${GRUPO} button')].find(b => /desktop/i.test(b.textContent))?.click();`),
    new Function(`return document.querySelector('iframe')?.dataset.vitrineFrame === 'desktop';`)
  );
  await espera(400);
  const desk = await page.evaluate(() => ({ w: Math.round(document.querySelector('iframe').getBoundingClientRect().width), busca: location.search }));
  r.ok('Desktop: a moldura volta à largura da janela e a URL perde o ?vista', desk.w === 1440 && desk.busca === '', JSON.stringify(desk));
  const voltar = await page.$eval('[data-vitrine-voltar]', a => a.getAttribute('href')).catch(() => null);
  r.ok('"Templates" volta para a lista da home', voltar === '/#templates', voltar);
  r.ok('interações sem erro de console', erros.length === 0, erros.slice(0, 3).join(' | '));
  await page.close();
}

// ── 6. a mesma cara do editor ─────────────────────────────────────────────────
if (T_PADRAO && ESPERADAS.includes(T_PADRAO)) {
  const { page } = await novaAba(browser);
  await page.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2', timeout: 120000 });
  await page.waitForSelector('.ed-shell', { timeout: 60000 }).catch(() => {});
  const editor = await esperarLoja(page, naPagina(T_PADRAO, 'home'));
  await page.goto(`${BASE_URL}/templates/${pad(T_PADRAO)}/home`, { waitUntil: 'networkidle2', timeout: 120000 });
  const vitrine = await esperarLoja(page, naPagina(T_PADRAO, 'home'));
  const resumo = l => JSON.stringify({ secoes: l?.secoes ?? null, tema: l?.tema ?? null });
  r.ok(
    `a home da ${pad(T_PADRAO)} na vitrine = o canvas de uma aba nova do editor (seções, ordem, tema e Nível 1)`,
    !!editor?.secoes.length && resumo(editor) === resumo(vitrine),
    `editor ${resumo(editor).slice(0, 160)} | vitrine ${resumo(vitrine).slice(0, 160)}`
  );
  await page.close();
}

// ── 7. rotas ──────────────────────────────────────────────────────────────────
{
  const status = async (u, opts = {}) => fetch(`${BASE_URL}${u}`, { redirect: 'manual', ...opts }).then(x => ({ s: x.status, loc: x.headers.get('location') })).catch(() => ({ s: 0 }));
  if (INCOMPLETA) {
    const a = await status(`/templates/${pad(INCOMPLETA)}/home`);
    const b = await status(`/templates/${pad(INCOMPLETA)}/home/frame`);
    r.ok(`família incompleta (${pad(INCOMPLETA)}) dá 404, na barra e no frame`, a.s === 404 && b.s === 404, `${a.s} ${b.s}`);
  }
  const t = pad(ESPERADAS[0]);
  const inval = await status(`/templates/${t}/checkout`);
  r.ok('página inválida dá 404', inval.s === 404, String(inval.s));
  const raiz = await status(`/templates/${t}`);
  r.ok(`/templates/${t} leva à home do template`, raiz.s >= 300 && raiz.s < 400 && raiz.loc?.endsWith(`/templates/${t}/home`), `${raiz.s} ${raiz.loc}`);
  const matcher = fonte('src/middleware.ts').match(/matcher:\s*\[([^\]]*)\]/)?.[1] ?? '';
  r.ok('a vitrine fica fora do login (o matcher só fecha o /gerador)', /\/gerador/.test(matcher) && !/\/templates/.test(matcher), matcher);
}

await browser.close();
process.exit(r.fechar() ? 0 : 1);
