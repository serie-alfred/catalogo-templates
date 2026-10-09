/**
 * Estágio 2l — a página "LPs": a landing page entra INTEIRA, entre o header e o
 * footer que a loja escolheu.
 *
 * Prova, no editor de verdade, o que nenhum outro estágio exercita:
 *  1. o seletor de página só oferece "LPs" onde há LP no catálogo (Wake e VTEX;
 *     na Tray a página não existe);
 *  2. a LP chega pelo modal e o canvas monta header → LP → footer, sem breadcrumb
 *     (o Figma das LPs começa no hero) e sem vazar para a home;
 *  3. é singleton: escolher de novo não empilha duas LPs;
 *  4. a variável do painel chega ao canvas (o Nível 1 pinta a LP);
 *  5. o export leva a LP no balde `landing` — `faststore.landing` com o `path`
 *     do starter, `wake.landing` com template/selection que existem no
 *     global-templates — e passa no mesmo contrato do generator do estágio 3;
 *  6. o preview compartilhável abre a LP em `/p/{id}/lp`.
 */
import { relatorio, espera, BASE_URL } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear, trocarPagina, adicionarPeloModal } from './lib/editor.mjs';
import { conferirFaststore, conferirTrayWake } from './lib/contrato.mjs';

const r = relatorio('Estágio 2l — página LPs (landing page completa)');
const browser = await abrirBrowser();

const sel = (id, layoutKey, pagina, extra = {}) => ({ uid: `u-${layoutKey}-${id}`, id, layoutKey, pagina, ...extra });
const comuns = [sel('01', 'header', 'common'), sel('01', 'breadcrumb', 'common'), sel('01', 'footer', 'common')];

const opcoesDePagina = page =>
  page.evaluate(async () => {
    const gatilho = [...document.querySelectorAll('[aria-haspopup="listbox"]')].find(b =>
      /Homepage|Todas as páginas|Página de|LPs/.test(b.textContent)
    );
    for (let i = 0; i < 20; i++) {
      const lista = document.querySelector('[role="listbox"][aria-label="Página"]');
      if (lista) {
        const nomes = [...lista.querySelectorAll('[role="option"]')].map(o => o.textContent.trim());
        gatilho.click();
        return nomes;
      }
      gatilho?.click();
      await new Promise(res => setTimeout(res, 400));
    }
    return [];
  });

const canvas = page =>
  page.evaluate(() => {
    const d = document.querySelector('iframe')?.contentDocument;
    if (!d) return null;
    const secoes = [...d.querySelectorAll('[data-section-uid]')].map(e => e.getAttribute('data-selection'));
    const accent = d.querySelector('[data-role="bf-countdown-title"] span');
    return {
      secoes,
      lps: d.querySelectorAll('[data-role="bf-root"]').length,
      accent: accent ? d.defaultView.getComputedStyle(accent).color : null,
    };
  });

const esperarCanvas = (page, cond) =>
  page
    .waitForFunction(
      new Function(
        `const d=document.querySelector('iframe')?.contentDocument;if(!d)return false;` +
          `const s=[...d.querySelectorAll('[data-section-uid]')].map(e=>e.getAttribute('data-selection'));return ${cond};`
      ),
      { timeout: 45000, polling: 300 }
    )
    .catch(() => {});

/** Clica "Baixar" e devolve o config.json que o export gera (o Blob JSON). */
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

// ── Tray: a página não existe ────────────────────────────────────────────────
{
  const { page } = await novaAba(browser);
  await semear(page, { plataforma: 'Tray', selecoes: comuns });
  const op = await opcoesDePagina(page);
  r.ok('Tray: o seletor de página NÃO oferece "LPs"', op.length === 4 && !op.includes('LPs'), JSON.stringify(op));
  await page.close();
}

for (const plataforma of ['VTEX', 'Wake']) {
  const { page, erros } = await novaAba(browser);
  await semear(page, { plataforma, selecoes: comuns, token: plataforma === 'Wake' ? 'TOKEN-DE-TESTE' : '' });

  const op = await opcoesDePagina(page);
  r.ok(`${plataforma}: o seletor de página oferece "LPs"`, op.includes('LPs') && op.length === 5, JSON.stringify(op));

  await adicionarPeloModal(page, 'Landing pages', 'Black Friday', 'landing');
  await esperarCanvas(page, "s.includes('landing-page')");
  const c1 = await canvas(page);
  r.ok(
    `${plataforma}: o canvas monta header → LP → footer, sem breadcrumb`,
    JSON.stringify(c1?.secoes) === JSON.stringify(['header', 'landing-page', 'footer']) && c1?.lps === 1,
    JSON.stringify(c1)
  );

  // singleton: o mesmo modelo de novo não empilha
  await adicionarPeloModal(page, 'Landing pages', 'Black Friday');
  await espera(1500);
  const salvas = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('layoutSelections')).filter(s => s.layoutKey === 'landingPage')
  );
  r.ok(`${plataforma}: escolher a LP de novo não empilha (singleton)`, salvas.length === 1, JSON.stringify(salvas));

  // a variável do painel pinta a LP no canvas
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('layoutSelections'));
    for (const x of s) if (x.layoutKey === 'landingPage') x.variables = { '--blackfriday-accent': '#ff0000' };
    localStorage.setItem('layoutSelections', JSON.stringify(s));
  });
  await page.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await espera(1500);
  await trocarPagina(page, 'landing');
  await esperarCanvas(page, "s.includes('landing-page')");
  await page
    .waitForFunction(
      () => {
        const d = document.querySelector('iframe')?.contentDocument;
        const a = d?.querySelector('[data-role="bf-countdown-title"] span');
        return a && d.defaultView.getComputedStyle(a).color === 'rgb(255, 0, 0)';
      },
      { timeout: 20000, polling: 300 }
    )
    .catch(() => {});
  const c2 = await canvas(page);
  r.ok(`${plataforma}: --blackfriday-accent do painel pinta o "Friday" no canvas`, c2?.accent === 'rgb(255, 0, 0)', c2?.accent);

  // fora da página LPs a LP não aparece
  await trocarPagina(page, 'home');
  await esperarCanvas(page, "!s.includes('landing-page')");
  const c3 = await canvas(page);
  r.ok(`${plataforma}: a LP não vaza para a home`, !!c3 && !c3.secoes.includes('landing-page'), JSON.stringify(c3?.secoes));

  // export
  const cfg = await exportar(page);
  r.ok(`${plataforma}: o export entrega o config.json`, !!cfg);
  if (cfg && plataforma === 'VTEX') {
    const lp = cfg.faststore?.landing ?? [];
    r.ok(
      'VTEX: faststore.landing leva a LP com o path do starter e a variável',
      lp.length === 1 && lp[0].component === 'organisms/BlackFriday01' && lp[0].variables?.['--blackfriday-accent'] === '#ff0000',
      JSON.stringify(lp)
    );
    r.ok('VTEX: a LP não cai em home/category/product', !['home', 'category', 'product'].some(b => (cfg.faststore[b] ?? []).some(e => /BlackFriday/.test(e.component))));
    conferirFaststore(cfg, r);
  }
  if (cfg && plataforma === 'Wake') {
    const lp = cfg.wake?.landing ?? [];
    r.ok(
      'Wake: wake.landing leva template 1 / selection landing-page e a variável',
      lp.length === 1 && lp[0].template === '1' && lp[0].selection === 'landing-page' && lp[0].variables?.['--blackfriday-accent'] === '#ff0000',
      JSON.stringify(lp)
    );
    conferirTrayWake(cfg, 'Wake', r);
  }

  // preview compartilhável
  const snapshot = await page.evaluate(() => ({
    platform: localStorage.getItem('layoutPlatform'),
    selections: JSON.parse(localStorage.getItem('layoutSelections')),
    colors: { colorPrimary: '#1a1a1a', colorSecondary: '#ffffff', colorTertiary: '#fff', colorPrimaryBackground: '#000', colorSecondaryBackground: '#dd1838', colorTertiaryBackground: '#000', colorFooter: '#1A051C', colorFooterText: '#94A3B8', colorPrimaryText: '#fff', colorSecondaryText: '#51ff00' },
    fonts: { fontPrimary: 'Roboto', fontSecondary: 'Roboto', fontTertiary: 'Roboto' },
    logo: '',
    favicon: '',
  }));
  const res = await fetch(`${BASE_URL}/gerador/api/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snapshot),
  });
  const { id } = res.ok ? await res.json() : {};
  if (id) {
    const p2 = await browser.newPage();
    await p2.goto(`${BASE_URL}/p/${id}/lp`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const ok = await p2
      .waitForSelector('[data-role="bf-root"]', { timeout: 30000 })
      .then(() => true)
      .catch(() => false);
    const ordem = await p2.evaluate(() =>
      [...document.querySelectorAll('[data-section-uid]')].map(e => e.getAttribute('data-selection'))
    );
    r.ok(`${plataforma}: /p/{id}/lp abre a LP entre header e footer`, ok && ordem.join() === 'header,landing-page,footer', ordem.join());
    await p2.close();
  } else {
    r.ok(`${plataforma}: /p/{id}/lp abre a LP entre header e footer`, false, `POST do preview: HTTP ${res.status}`);
  }

  const reais = erros.filter(e => !/Failed to load resource|favicon|net::ERR/.test(e));
  r.ok(`${plataforma}: sem erro de página`, reais.length === 0, reais.slice(0, 3).join(' | '));
  await page.close();
}

await browser.close();
process.exit(r.fechar() ? 0 : 1);
