/**
 * Estágio 2f — o preview "Desktop" é desktop, em qualquer tela.
 *
 * Existe por um defeito medido em 10/09: o iframe do canvas era `width: 100%`,
 * então a viewport do tema era o que sobrasse da coluna — 1016px numa tela de
 * 1920, 696px em 1600, 576px em 1440. E 60 dos 69 CSS de `src/components/
 * templates/` têm media query abaixo de 1200px. O cliente escolhia "Desktop" e
 * via o tema em layout de tablet ou de celular, sem nenhum aviso.
 *
 * Agora a largura é LÓGICA e fixa (1440 desktop, 375 mobile) e o excedente vira
 * escala. Este estágio é a rede: mede em três larguras de janela, confere que a
 * viewport interna não se move, e — o mais importante — clica com o MOUSE de
 * verdade dentro do frame escalado.
 *
 * Esse último ponto é o único furo que a escala abre. Todo clique do funil é
 * `element.click()` sintético, que não passa por hit-testing: se o Chrome
 * errasse o mapeamento de coordenadas através do `transform`, o produto estaria
 * quebrado e o funil inteiro continuaria verde.
 */
import {
  abrirBrowser,
  novaAba,
  semear,
  clicarDeVerdade,
} from './lib/editor.mjs';
import { relatorio, espera } from './lib/util.mjs';

const r = relatorio('Estágio 2f — zoom do canvas e viewport lógica');

const SELECOES = [
  { uid: 'z-header', id: '01', layoutKey: 'header', pagina: 'common' },
  { uid: 'z-banner', id: '01', layoutKey: 'bannerFull', pagina: 'home' },
  { uid: 'z-footer', id: '01', layoutKey: 'footer', pagina: 'common' },
];

const browser = await abrirBrowser();
const { page, erros } = await novaAba(browser);

/** Tudo o que importa medir, numa chamada só. */
const medir = () =>
  page.evaluate(() => {
    const f = document.querySelector('iframe');
    const canvas = document.querySelector('main');
    const w = f?.contentWindow;
    const rect = f?.getBoundingClientRect();
    return {
      janela: window.innerWidth,
      vpInterna: w?.innerWidth ?? -1,
      escala: rect && w ? Number((rect.width / w.innerWidth).toFixed(3)) : -1,
      larguraVisual: rect ? Math.round(rect.width) : -1,
      colunaUtil: canvas ? Math.floor(canvas.clientWidth - 64) : -1,
      desktopCasa: !!w?.matchMedia('(min-width: 1200px)').matches,
      celularCasa: !!w?.matchMedia('(max-width: 768px)').matches,
      scrollFantasmaX: canvas
        ? canvas.scrollWidth > canvas.clientWidth + 1
        : true,
      scrollFantasmaY: canvas
        ? canvas.scrollHeight > canvas.clientHeight + 1
        : true,
      barraNoEditor:
        document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

await semear(page, { plataforma: 'Wake', selecoes: SELECOES });

// ── a matriz: três larguras de janela, painéis abertos, zoom em `fit` ───────
for (const largura of [1440, 1600, 1920]) {
  try {
    await page.setViewport({
      width: largura,
      height: 900,
      deviceScaleFactor: 1,
    });
    await page
      .waitForFunction(w => window.innerWidth === w, { timeout: 8000 }, largura)
      .catch(() => {});
    await espera(900);
    const m = await medir();

    r.ok(
      `${largura}: a viewport interna do tema é 1440`,
      m.vpInterna === 1440,
      m.vpInterna
    );
    r.ok(
      `${largura}: o tema casa o breakpoint de desktop`,
      m.desktopCasa && !m.celularCasa,
      `min-1200=${m.desktopCasa} max-768=${m.celularCasa}`
    );
    r.ok(
      `${largura}: a escala é a que cabe na coluna`,
      Math.abs(m.escala - Math.min(1, m.colunaUtil / 1440)) <= 0.01,
      `escala ${m.escala} | coluna ${m.colunaUtil}`
    );
    r.ok(
      `${largura}: o frame cabe na coluna, sem estouro`,
      m.larguraVisual <= m.colunaUtil + 1,
      `frame ${m.larguraVisual} | coluna ${m.colunaUtil}`
    );
    r.ok(
      `${largura}: sem scroll fantasma no canvas`,
      !m.scrollFantasmaX && !m.scrollFantasmaY,
      `x=${m.scrollFantasmaX} y=${m.scrollFantasmaY}`
    );
    r.ok(`${largura}: sem barra horizontal no editor`, !m.barraNoEditor);
  } catch (e) {
    r.ok(
      `${largura}: a matriz roda sem estourar`,
      false,
      String(e).slice(0, 90)
    );
  }
}

// ── clique de MOUSE dentro do frame escalado ────────────────────────────────
// A única forma de provar hit-testing sob `transform`. Um `.click()` sintético
// passaria mesmo com o mapeamento de coordenadas errado.
try {
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await espera(1200);
  const alvo = await page.evaluate(() => {
    const f = document.querySelector('iframe');
    const fr = f.getBoundingClientRect();
    const s = fr.width / f.contentWindow.innerWidth;
    const el = f.contentDocument.querySelector('[data-section-uid]');
    if (!el) return null;
    const r2 = el.getBoundingClientRect();
    return {
      x: fr.left + (r2.left + r2.width / 2) * s,
      y: fr.top + (r2.top + Math.min(r2.height / 2, 160)) * s,
      uid: el.getAttribute('data-section-uid'),
      escala: s,
    };
  });
  r.ok('há seção no canvas para clicar', !!alvo, JSON.stringify(alvo));
  if (alvo) {
    await page.mouse.click(alvo.x, alvo.y);
    await espera(1000);
    const selecionado = await page.evaluate(
      () =>
        document
          .querySelector('iframe')
          ?.contentDocument?.querySelector('[data-selected="true"]')
          ?.getAttribute('data-section-uid') ?? null
    );
    r.ok(
      'clique de mouse real no frame escalado seleciona a seção certa',
      selecionado === alvo.uid,
      `escala ${alvo.escala} | esperado ${alvo.uid} | veio ${selecionado}`
    );
  }
} catch (e) {
  r.ok('o clique real roda sem estourar', false, String(e).slice(0, 90));
}

// ── o controle de zoom ──────────────────────────────────────────────────────
try {
  const abriu = await clicarDeVerdade(
    page,
    'button[aria-label="Zoom do canvas"]'
  );
  r.ok('o controle de zoom é alcançável', abriu);
  await espera(400);
  const opcoes = await page.evaluate(() =>
    [...document.querySelectorAll('[role="option"]')].map(o =>
      o.textContent.trim()
    )
  );
  r.ok(
    'o menu traz Ajustar / 50% / 75% / 100%',
    ['Ajustar', '50%', '75%', '100%'].every(o => opcoes.includes(o)),
    opcoes.join(' | ')
  );

  await page.evaluate(() =>
    [...document.querySelectorAll('[role="option"]')]
      .find(o => o.textContent.trim() === '75%')
      ?.click()
  );
  await espera(900);
  const m75 = await medir();
  r.ok('escolher 75% aplica 0,75 de escala', m75.escala === 0.75, m75.escala);
  r.ok(
    'e a viewport interna continua 1440',
    m75.vpInterna === 1440,
    m75.vpInterna
  );
  r.ok(
    'o zoom persiste no localStorage',
    (await page.evaluate(() => localStorage.getItem('canvasZoom'))) === '0.75'
  );

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  // Esperar `innerWidth === 1440` não serve: isso já é verdade ANTES de a
  // hidratação ler o localStorage, porque o padrão é `fit` e a viewport lógica
  // é a mesma nos dois modos. A condição certa é o próprio efeito.
  await page
    .waitForFunction(
      () =>
        document
          .querySelector('button[aria-label="Zoom do canvas"]')
          ?.textContent?.includes('75%') ?? false,
      { timeout: 30000, polling: 250 }
    )
    .catch(() => {});
  r.ok('o zoom sobrevive ao reload', (await medir()).escala === 0.75);
} catch (e) {
  r.ok('o controle de zoom roda sem estourar', false, String(e).slice(0, 90));
}

// ── mobile ──────────────────────────────────────────────────────────────────
try {
  await page.evaluate(() => localStorage.setItem('canvasZoom', 'fit'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await espera(2500);
  await page.evaluate(() =>
    [...document.querySelectorAll('div[role="group"] button')]
      .find(b => /mobile/i.test(b.textContent ?? ''))
      ?.click()
  );
  await page
    .waitForFunction(
      () => document.querySelector('iframe')?.contentWindow?.innerWidth === 375,
      { timeout: 15000, polling: 250 }
    )
    .catch(() => {});
  const mm = await medir();
  r.ok('mobile: a viewport interna é 375', mm.vpInterna === 375, mm.vpInterna);
  r.ok(
    'mobile: o frame cabe na coluna',
    mm.larguraVisual <= mm.colunaUtil + 1,
    `frame ${mm.larguraVisual} | coluna ${mm.colunaUtil}`
  );
} catch (e) {
  r.ok('o mobile roda sem estourar', false, String(e).slice(0, 90));
}

r.ok('sem erros de página', erros.length === 0, erros.slice(0, 2).join(' | '));
await browser.close();
process.exit(r.fechar() ? 0 : 1);
