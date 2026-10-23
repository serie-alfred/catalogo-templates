/**
 * Estágio 2l — o MODO LP: uma landing page avulsa, montada com qualquer seção de
 * miolo e exportada sozinha (`tipo: "lp"`), como o modo Checkout é uma área à
 * parte da loja.
 *
 * Prova, no editor de verdade:
 *  1. o alternador "Landing page" do rail só existe onde o generator monta LP
 *     (Wake e VTEX; na Tray, não);
 *  2. entrar no modo abre a LP inicial (a Black Friday da família 08, oito
 *     seções na ordem do Figma), SEM header/footer da loja, e a topbar troca o
 *     seletor de página pelo nome da LP com o slug;
 *  3. a LP é um documento à parte: as seções da loja não mudam, e voltar à loja
 *     devolve o canvas dela;
 *  4. o modal oferece qualquer seção de miolo (não só as 08) e nunca header/footer;
 *  5. a variável do painel pinta a seção no canvas (Nível 1);
 *  6. o export entrega SÓ a LP — `tipo: "lp"`, `landingPage { slug, nome }` e o
 *     balde `landing` na ordem da página, sem global/home/checkout — e passa no
 *     contrato do generator (origem Wake em Home/template_N, path VTEX no starter);
 *  7. o preview compartilhável abre a LP em `/p/{id}/lp`.
 */
import { relatorio, espera, BASE_URL } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear } from './lib/editor.mjs';
import { conferirFaststore, conferirTrayWake } from './lib/contrato.mjs';

const r = relatorio('Estágio 2l — modo LP (landing page avulsa)');
const browser = await abrirBrowser();

const sel = (id, layoutKey, pagina) => ({ uid: `u-${layoutKey}-${id}`, id, layoutKey, pagina });
const comuns = [sel('01', 'header', 'common'), sel('01', 'footer', 'common'), sel('01', 'banner', 'home')];
const ORDEM_INICIAL = ['banner-main', 'countdown', 'categories', 'showcase', 'banner-side', 'editorial', 'ruler', 'newsletter'];

const botaoLp = page =>
  page.evaluate(() => {
    const b = document.querySelector('[data-editor-mode-lp]');
    return b ? { existe: true, pressionado: b.getAttribute('aria-pressed') === 'true' } : { existe: false };
  });

const alternarLp = async page => {
  await page.evaluate(() => document.querySelector('[data-editor-mode-lp]')?.click());
  await espera(1800);
};

const secoesNoCanvas = page =>
  page.evaluate(() =>
    [...(document.querySelector('iframe')?.contentDocument?.querySelectorAll('[data-section-uid]') ?? [])].map(e =>
      e.getAttribute('data-selection')
    )
  );

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

/** Clica no botão de export e devolve o config que ele gera (o Blob JSON). */
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

// ── Tray: o modo não existe ──────────────────────────────────────────────────
{
  const { page } = await novaAba(browser);
  await semear(page, { plataforma: 'Tray', selecoes: comuns });
  r.ok('Tray: o rail NÃO tem o alternador de LP', !(await botaoLp(page)).existe);
  await page.close();
}

for (const plataforma of ['VTEX', 'Wake']) {
  const { page, erros } = await novaAba(browser);
  await semear(page, { plataforma, selecoes: comuns, token: plataforma === 'Wake' ? 'TOKEN-DE-TESTE' : '' });
  await page.evaluate(() => sessionStorage.removeItem('lp'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await esperarCanvas(page, "s.includes('header')");

  r.ok(`${plataforma}: o rail tem o alternador de LP, desligado`, (await botaoLp(page)).existe && !(await botaoLp(page)).pressionado);

  await alternarLp(page);
  await esperarCanvas(page, `s.join()===${JSON.stringify(ORDEM_INICIAL.join())}`);
  const c1 = await secoesNoCanvas(page);
  r.ok(
    `${plataforma}: o modo LP abre a LP inicial (8 seções 08 na ordem do Figma), sem header/footer`,
    c1.join() === ORDEM_INICIAL.join(),
    c1.join()
  );
  const topo = await page.evaluate(() => ({
    nome: document.querySelector('[data-lp-nome] input')?.value,
    slug: document.querySelector('[data-lp-nome]')?.textContent,
    seletorDePagina: !![...document.querySelectorAll('[aria-haspopup="listbox"]')].find(b => /Homepage|Todas as páginas/.test(b.textContent)),
  }));
  r.ok(
    `${plataforma}: a topbar mostra o nome e o slug da LP no lugar do seletor de página`,
    topo.nome === 'Black Friday' && /\/black-friday/.test(topo.slug ?? '') && !topo.seletorDePagina,
    JSON.stringify(topo)
  );

  // a loja não mudou
  const loja = await page.evaluate(() => JSON.parse(sessionStorage.getItem('layoutSelections')).map(s => `${s.layoutKey}:${s.id}`));
  r.ok(`${plataforma}: as seções da loja continuam as mesmas`, loja.join() === 'header:01,footer:01,banner:01', loja.join());

  // o nome vira slug
  await page.focus('[data-lp-nome] input');
  await page.$eval('[data-lp-nome] input', el => el.select());
  await page.keyboard.type('Natal Mágico 2026');
  await espera(600);
  const slug = await page.evaluate(() => document.querySelector('[data-lp-nome]')?.textContent);
  r.ok(`${plataforma}: o slug deriva do nome (sem acento, com hífen)`, /\/natal-magico-2026/.test(slug ?? ''), slug);

  // o modal oferece qualquer seção de miolo e nunca header/footer
  await page.evaluate(() => [...document.querySelectorAll('button')].find(x => /Adicionar se/i.test(x.textContent))?.click());
  await page.waitForFunction(() => document.querySelectorAll('[role="tab"], [role="dialog"] button').length > 3, { timeout: 15000 }).catch(() => {});
  await espera(800);
  const abas = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? [...d.querySelectorAll('button, [role="tab"]')].map(b => b.textContent.trim()).filter(Boolean) : [];
  });
  r.ok(
    `${plataforma}: o modal do modo LP não oferece header/footer`,
    abas.length > 0 && !abas.some(t => /^(Header|Footer|Rodapé|Cabeçalho)\b/i.test(t)),
    abas.slice(0, 12).join(' | ')
  );
  await page.keyboard.press('Escape');

  // seção de miolo que não é da família 08 entra na LP, e a variável pinta o canvas
  await page.evaluate(() => {
    const lp = JSON.parse(sessionStorage.getItem('lp'));
    lp.selections.push({ uid: 'u-lp-bannerFull-01', id: '01', layoutKey: 'bannerFull', pagina: 'home' });
    for (const s of lp.selections) if (s.layoutKey === 'countdown') s.variables = { '--countdown-accent': '#ff0000' };
    sessionStorage.setItem('lp', JSON.stringify(lp));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await esperarCanvas(page, "s.includes('banner-full')");
  await page
    .waitForFunction(
      () => {
        const d = document.querySelector('iframe')?.contentDocument;
        const a = d?.querySelector('[data-role="cd-title"] span');
        return a && d.defaultView.getComputedStyle(a).color === 'rgb(255, 0, 0)';
      },
      { timeout: 20000, polling: 300 }
    )
    .catch(() => {});
  const c2 = await secoesNoCanvas(page);
  const accent = await page.evaluate(() => {
    const d = document.querySelector('iframe')?.contentDocument;
    const a = d?.querySelector('[data-role="cd-title"] span');
    return a ? d.defaultView.getComputedStyle(a).color : null;
  });
  r.ok(`${plataforma}: o modo LP sobrevive ao reload e aceita seção de miolo de outra família`, c2.at(-1) === 'banner-full', c2.join());
  r.ok(`${plataforma}: --countdown-accent do painel pinta o destaque no canvas`, accent === 'rgb(255, 0, 0)', accent);

  // export: só a LP
  const cfg = await exportar(page);
  r.ok(`${plataforma}: o export entrega o config da LP`, !!cfg);
  if (cfg) {
    const raiz = cfg[plataforma === 'VTEX' ? 'faststore' : 'wake'] ?? {};
    r.ok(`${plataforma}: tipo "lp" e landingPage { slug, nome }`, cfg.tipo === 'lp' && raiz.landingPage?.slug === 'natal-magico-2026' && raiz.landingPage?.nome === 'Natal Mágico 2026', JSON.stringify(raiz.landingPage));
    r.ok(`${plataforma}: sem tema de loja no config (global/home/category/product/checkout)`, !['global', 'home', 'category', 'product', 'checkout', 'overrides'].some(k => k in raiz), Object.keys(raiz).join());
    const lp = raiz.landing ?? [];
    if (plataforma === 'VTEX') {
      r.ok(
        'VTEX: faststore.landing na ordem da página, com os paths do starter e a variável',
        lp.length === 9 && lp[0].component === 'organisms/BannerMain08' && lp[8].component === 'atoms/BannerFull01' && lp[1].variables?.['--countdown-accent'] === '#ff0000',
        JSON.stringify(lp.map(e => e.component))
      );
    } else {
      r.ok(
        'Wake: wake.landing com template/selection de home, na ordem, e a variável',
        lp.length === 9 && lp[0].template === '8' && lp[0].selection === 'banner-main' && lp[8].selection === 'banner-full' && lp[1].variables?.['--countdown-accent'] === '#ff0000',
        JSON.stringify(lp.map(e => `${e.template}/${e.selection}`))
      );
    }
    if (plataforma === 'VTEX') conferirFaststore(cfg, r);
    else conferirTrayWake(cfg, 'Wake', r);
  }

  // preview compartilhável: o botão do editor abre /p/{id}/lp
  const link = await page.evaluate(async () => {
    const res = await fetch('/gerador/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: sessionStorage.getItem('layoutPlatform'),
        selections: JSON.parse(sessionStorage.getItem('layoutSelections')),
        lp: { ...JSON.parse(sessionStorage.getItem('lp')), slug: 'natal-magico-2026' },
        colors: { colorPrimary: '#1a1a1a', colorSecondary: '#ffffff', colorTertiary: '#fff', colorPrimaryBackground: '#000', colorSecondaryBackground: '#dd1838', colorTertiaryBackground: '#000', colorFooter: '#1A051C', colorFooterText: '#94A3B8', colorPrimaryText: '#fff', colorSecondaryText: '#51ff00' },
        fonts: { fontPrimary: 'Roboto', fontSecondary: 'Roboto', fontTertiary: 'Roboto' },
        logo: '',
        favicon: '',
      }),
    });
    return res.ok ? (await res.json()).id : `HTTP ${res.status}`;
  });
  if (link && !link.startsWith('HTTP')) {
    const p2 = await browser.newPage();
    await p2.goto(`${BASE_URL}/p/${link}/lp`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await p2.waitForSelector('[data-section-uid]', { timeout: 30000 }).catch(() => {});
    const ordem = await p2.evaluate(() => [...document.querySelectorAll('[data-section-uid]')].map(e => e.getAttribute('data-selection')));
    r.ok(`${plataforma}: /p/{id}/lp abre a LP, sem as seções da loja`, ordem.join() === [...ORDEM_INICIAL, 'banner-full'].join(), ordem.join());
    await p2.close();
  } else {
    r.ok(`${plataforma}: /p/{id}/lp abre a LP`, false, `POST do preview: ${link}`);
  }

  // voltar à loja devolve o canvas dela
  await alternarLp(page);
  await esperarCanvas(page, "s.includes('header')");
  const c3 = await secoesNoCanvas(page);
  r.ok(`${plataforma}: voltar à loja devolve as seções dela`, c3.includes('header') && c3.includes('footer') && !c3.includes('countdown'), c3.join());

  const reais = erros.filter(e => !/Failed to load resource|favicon|net::ERR/.test(e));
  r.ok(`${plataforma}: sem erro de página`, reais.length === 0, reais.slice(0, 3).join(' | '));
  await page.close();
}

await browser.close();
process.exit(r.fechar() ? 0 : 1);
