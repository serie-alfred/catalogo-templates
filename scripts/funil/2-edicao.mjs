/**
 * Estágio 2b — regras de negócio da edição, dirigindo a UI de verdade.
 *
 * O foco são os singletons: `toggleSelection` e o botão de duplicar descrevem o
 * mesmo conjunto por caminhos diferentes, e enquanto discordavam era possível
 * pôr dois banners principais distintos na mesma home.
 */
import { relatorio, espera } from './lib/util.mjs';
import {
  abrirBrowser,
  novaAba,
  semear,
  trocarPagina,
  selecoesSalvas,
  secoesNoCanvas,
  badgesDe,
  adicionarPeloModal,
  gruposNaLista,
} from './lib/editor.mjs';

const r = relatorio('Estágio 2b — regras de edição');
const browser = await abrirBrowser();
const { page, erros } = await novaAba(browser);
const sel = (id, layoutKey, pagina) => ({
  uid: `u-${layoutKey}-${id}`,
  id,
  layoutKey,
  pagina,
});

// ── singletons: o modelo novo substitui o antigo, não soma ────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'showcase', 'home')],
});
await adicionarPeloModal(page, 'Vitrines', 'Vitrine Template 6');
r.ok(
  'Showcase06 substitui Showcase01',
  JSON.stringify(await selecoesSalvas(page)) === '["showcase:06"]',
  await selecoesSalvas(page)
);
r.ok(
  '  canvas com 1 seção',
  (await secoesNoCanvas(page)) === 1,
  await secoesNoCanvas(page)
);

await semear(page, {
  plataforma: 'VTEX',
  selecoes: [sel('01', 'header', 'common')],
});
await adicionarPeloModal(page, 'Header', 'Header Template 7', 'common');
r.ok(
  'Header07 substitui Header01 (regra common)',
  JSON.stringify(await selecoesSalvas(page)) === '["header:07"]',
  await selecoesSalvas(page)
);

await semear(page, {
  plataforma: 'VTEX',
  selecoes: [sel('06', 'spot', 'common')],
});
await adicionarPeloModal(
  page,
  'Card de Produto',
  'Card de Produto Template 7',
  'common'
);
r.ok(
  'Spot07 substitui Spot06',
  JSON.stringify(await selecoesSalvas(page)) === '["spot:07"]',
  await selecoesSalvas(page)
);

// ── não-singleton: coexistem ──────────────────────────────────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'bannerTriple', 'home')],
});
await adicionarPeloModal(page, 'Banner Triplo', 'Banner Triplo Template 6');
const triplos = await selecoesSalvas(page);
r.ok(
  'BannerTriple05 e 06 coexistem',
  triplos.length === 2 &&
    triplos.includes('bannerTriple:01') &&
    triplos.includes('bannerTriple:03'),
  triplos
);

// ── duplicar / remover pelos badges do canvas ─────────────────────────────────
const bTriplo = await badgesDe(page, 'banner-triple');
r.ok(
  'badge verde disponível em banner-triple',
  bTriplo.duplicar,
  JSON.stringify(bTriplo)
);
await page.evaluate(() => {
  const d = document.querySelector('iframe').contentDocument;
  [
    ...d.querySelector('.editor-section-actions').querySelectorAll('button'),
  ][0].click();
});
await espera(1400);
r.ok(
  'duplicar cria 3ª seção',
  (await secoesNoCanvas(page)) === 3,
  await secoesNoCanvas(page)
);
await badgesDe(page, 'banner-triple');
await page.evaluate(() => {
  const d = document.querySelector('iframe').contentDocument;
  [
    ...d.querySelector('.editor-section-actions').querySelectorAll('button'),
  ][1].click();
});
await espera(1400);
r.ok(
  'remover volta a 2 seções',
  (await secoesNoCanvas(page)) === 2,
  await secoesNoCanvas(page)
);

// ── o conserto: singleton não oferece duplicar, e a granularidade é por selection ──
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'banner', 'home'), sel('01', 'bannerFull', 'home')],
});
const bMain = await badgesDe(page, 'banner-main');
r.ok(
  'banner-main NÃO oferece duplicar',
  !bMain.duplicar && bMain.remover,
  JSON.stringify(bMain)
);
const bFull = await badgesDe(page, 'banner-full');
r.ok(
  'banner-full CONTINUA oferecendo duplicar',
  bFull.duplicar,
  JSON.stringify(bFull)
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('06', 'banner', 'home')],
});
r.ok(
  'banner-main template 6 também não oferece',
  !(await badgesDe(page, 'banner-main')).duplicar
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('04', 'bannerFull', 'category')],
});
await trocarPagina(page, 'category');
r.ok(
  'category-banner NÃO oferece duplicar',
  !(await badgesDe(page, 'category-banner')).duplicar
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'bannerProduct', 'product')],
});
await trocarPagina(page, 'product');
r.ok(
  'banner-top NÃO oferece duplicar',
  !(await badgesDe(page, 'banner-top')).duplicar
);

// a lista precisa concordar com o canvas, senão a regra volta pelo outro caminho.
// O botão só existe com a linha expandida (acordeão) e se identifica pelo title.
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'banner', 'home'), sel('01', 'bannerFull', 'home')],
});
await page.evaluate(() =>
  [...document.querySelectorAll('button')]
    .filter(b => /^Expandir /.test(b.getAttribute('aria-label') ?? ''))
    .forEach(b => b.click())
);
await espera(600);
const duplicaveis = await page.evaluate(
  () => [...document.querySelectorAll('button[title="Duplicar seção"]')].length
);
r.ok(
  'lista oferece duplicar só para banner-full',
  duplicaveis === 1,
  `${duplicaveis} botões`
);

// ── estado legado: o conserto impede CRIAR, não cura o que já está no disco ───
// Quem duplicou um singleton antes deste conserto continua com as duas cópias:
// `sanitizeSelections` valida a hidratação mas não deduplica. O que o conserto
// garante é que a UI não oferece mais nenhum caminho para piorar o quadro.
await semear(page, {
  plataforma: 'Tray',
  selecoes: [
    sel('01', 'banner', 'home'),
    { uid: 'u2', id: '01', layoutKey: 'banner', pagina: 'home' },
  ],
});
r.ok(
  'duplicado legado sobrevive à hidratação (esperado)',
  (await selecoesSalvas(page)).length === 2,
  await selecoesSalvas(page)
);
r.ok(
  'e a UI não oferece duplicar de novo',
  !(await badgesDe(page, 'banner-main')).duplicar
);
await adicionarPeloModal(page, 'Banners', 'Banners Template 6');
const conv = await selecoesSalvas(page);
console.log(
  `  ⚠️  limitação conhecida: com duplicado legado, trocar o modelo no modal substitui só`
);
console.log(
  `      a primeira ocorrência (toggleSelection usa findIndex) → ${JSON.stringify(conv)}`
);

// ── painel direito e lista ────────────────────────────────────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'review', 'home')],
});
await page.evaluate(() =>
  document
    .querySelector('iframe')
    .contentDocument.querySelector('[data-selection="client-review"]')
    .click()
);
await espera(1100);
const painel = await page.evaluate(
  () =>
    document.querySelector('aside[aria-label="Propriedades"]')?.innerText ?? ''
);
r.ok(
  'painel direito mostra o estado vazio certo',
  /não expõe variáveis próprias/.test(painel),
  painel.replace(/\s+/g, ' ').slice(0, 90)
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [
    sel('01', 'specialOffers', 'home'),
    sel('01', 'homeCombined', 'home'),
  ],
});
const grupos = await gruposNaLista(page);
r.ok(
  'lista traz os grupos novos',
  grupos.includes('Ofertas Especiais') && grupos.includes('Combinações')
);

// ── troca de plataforma ───────────────────────────────────────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'review', 'home'), sel('01', 'header', 'common')],
});
await page.evaluate(() =>
  [...document.querySelectorAll('[aria-haspopup="listbox"]')]
    .find(
      b =>
        /Tray|Wake|VTEX/.test(b.textContent) &&
        !/Homepage|Todas as páginas|Página de/.test(b.textContent)
    )
    .click()
);
await espera(500);
await page.evaluate(() =>
  [...document.querySelectorAll('[role="option"]')]
    .find(o => o.textContent.trim() === 'VTEX')
    .click()
);
await espera(1500);
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x =>
    /Trocar|Continuar|Confirmar/i.test(x.textContent)
  );
  if (b) b.click();
});
await espera(1800);
r.ok(
  'Tray→VTEX descarta o incompatível e mantém o resto',
  JSON.stringify(await selecoesSalvas(page)) === '["header:01"]',
  await selecoesSalvas(page)
);

r.ok(
  'sem erros de página na bateria',
  erros.length === 0,
  erros.slice(0, 2).join(' | ')
);
await browser.close();
process.exit(r.fechar() ? 0 : 1);
