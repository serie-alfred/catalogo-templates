/**
 * Estágio 2l — o MODO LP: uma landing page avulsa, montada com qualquer seção de
 * miolo e exportada sozinha (`tipo: "lp"`), como o modo Checkout é uma área à
 * parte da loja.
 *
 * Prova, no editor de verdade:
 *  1. o alternador "Landing page" do rail só existe onde o generator monta LP
 *     (Wake, VTEX e — com NEXT_PUBLIC_PLATAFORMA_WAKE2=1 — Wake 2.0; na Tray, não);
 *  2. entrar no modo abre a LP inicial (a Black Friday da família 08, oito
 *     seções na ordem do Figma; na Wake 2.0, que não tem a 08, as mesmas oito da
 *     10), SEM header/footer da loja, e a topbar troca o seletor de página pelo
 *     nome da LP com o slug;
 *  3. a LP é um documento à parte: as seções da loja não mudam, e voltar à loja
 *     devolve o canvas dela;
 *  4. o modal oferece qualquer seção de miolo (não só as 08) e nunca header/footer;
 *  5. a variável do painel pinta a seção no canvas (Nível 1);
 *  6. o export entrega SÓ a LP — `tipo: "lp"`, `landingPage { slug, nome }` e o
 *     balde `landing` na ordem da página, sem global/home/checkout — e passa no
 *     contrato do generator (origem Wake em Home/template_N, path VTEX no starter);
 *  7. o preview compartilhável abre a LP em `/p/{id}/lp`;
 *  8. Wake 2.0: seção que ela não oferece, guardada na LP, some na hidratação
 *     (`sanitizeLp` filtra pela plataforma), o export leva `designStudio: true`,
 *     e trocar de VTEX para Wake 2.0 com a LP inicial intocada troca a 08 pela
 *     10 sem diálogo.
 */
import { relatorio, espera, BASE_URL } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear, irParaRail, clicarDeVerdade } from './lib/editor.mjs';
import { conferirFaststore, conferirTrayWake } from './lib/contrato.mjs';
import { WAKE2_LIGADA } from '../../src/types/platform.ts';

const r = relatorio('Estágio 2l — modo LP (landing page avulsa)');
const browser = await abrirBrowser();

const sel = (id, layoutKey, pagina) => ({ uid: `u-${layoutKey}-${id}`, id, layoutKey, pagina });
// A Wake 2.0 só tem as famílias 10 e 17: a loja e a seção "de outra família" saem delas.
const comunsDe = f => [sel(f, 'header', 'common'), sel(f, 'footer', 'common'), sel(f, 'banner', 'home')];
const comuns = comunsDe('01');
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

const PLATAFORMAS_LP = ['VTEX', 'Wake', ...(WAKE2_LIGADA ? ['Wake 2.0'] : [])];
if (!WAKE2_LIGADA) console.log('  ℹ️  Wake 2.0 fora (NEXT_PUBLIC_PLATAFORMA_WAKE2 desligada)');

for (const plataforma of PLATAFORMAS_LP) {
  const wake2 = plataforma === 'Wake 2.0';
  const fLoja = wake2 ? '10' : '01';
  const fLp = wake2 ? '10' : '08';
  // A seção de miolo de outra família que entra na LP, e o seletor do Nível 1 que a variável pinta.
  const extra = wake2 ? { key: 'brand', id: '17', selection: 'brands' } : { key: 'bannerFull', id: '01', selection: 'banner-full' };
  const destaque = wake2
    ? { sel: '[data-role="cd-cta"]', prop: 'backgroundColor' }
    : { sel: '[data-role="cd-title"] span', prop: 'color' };
  const { page, erros } = await novaAba(browser);
  await semear(page, { plataforma, selecoes: comunsDe(fLoja), token: plataforma === 'VTEX' ? '' : 'TOKEN-DE-TESTE' });
  await page.evaluate(() => sessionStorage.removeItem('lp'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await esperarCanvas(page, "s.includes('header')");

  r.ok(`${plataforma}: o rail tem o alternador de LP, desligado`, (await botaoLp(page)).existe && !(await botaoLp(page)).pressionado);

  await alternarLp(page);
  await esperarCanvas(page, `s.join()===${JSON.stringify(ORDEM_INICIAL.join())}`);
  const c1 = await secoesNoCanvas(page);
  r.ok(
    `${plataforma}: o modo LP abre a LP inicial (8 seções ${fLp} na ordem do Figma), sem header/footer`,
    c1.join() === ORDEM_INICIAL.join(),
    c1.join()
  );
  const idsLp = await page.evaluate(() => [...new Set(JSON.parse(sessionStorage.getItem('lp') ?? '{"selections":[]}').selections.map(s => s.id))]);
  r.ok(`${plataforma}: a LP inicial é toda da família ${fLp}`, idsLp.join() === fLp, idsLp.join());
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
  r.ok(`${plataforma}: as seções da loja continuam as mesmas`, loja.join() === `header:${fLoja},footer:${fLoja},banner:${fLoja}`, loja.join());

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
  // Na Wake 2.0 vai junto uma seção que ela NÃO oferece (a bannerFull 01): a
  // hidratação tem de tirá-la, senão o canvas mostra o que o export descarta.
  await page.evaluate((extra, wake2) => {
    const lp = JSON.parse(sessionStorage.getItem('lp'));
    if (wake2) lp.selections.push({ uid: 'u-lp-bannerFull-01', id: '01', layoutKey: 'bannerFull', pagina: 'home' });
    lp.selections.push({ uid: `u-lp-${extra.key}-${extra.id}`, id: extra.id, layoutKey: extra.key, pagina: 'home' });
    for (const s of lp.selections) if (s.layoutKey === 'countdown') s.variables = { '--countdown-accent': '#ff0000' };
    sessionStorage.setItem('lp', JSON.stringify(lp));
  }, extra, wake2);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await esperarCanvas(page, `s.includes(${JSON.stringify(extra.selection)})`);
  const lerDestaque = () =>
    page.evaluate(({ sel, prop }) => {
      const d = document.querySelector('iframe')?.contentDocument;
      const a = d?.querySelector(sel);
      return a ? d.defaultView.getComputedStyle(a)[prop] : null;
    }, destaque);
  for (let i = 0; i < 60 && (await lerDestaque()) !== 'rgb(255, 0, 0)'; i++) await espera(300);
  const c2 = await secoesNoCanvas(page);
  const accent = await lerDestaque();
  r.ok(`${plataforma}: o modo LP sobrevive ao reload e aceita seção de miolo de outra família`, c2.at(-1) === extra.selection, c2.join());
  if (wake2) {
    const guardada = await page.evaluate(() => JSON.parse(sessionStorage.getItem('lp')).selections.map(s => `${s.layoutKey}:${s.id}`));
    r.ok(
      'Wake 2.0: seção que ela não oferece (bannerFull 01) some da LP na hidratação, do canvas e da aba',
      !c2.includes('banner-full') && !guardada.includes('bannerFull:01'),
      `canvas: ${c2.join()} · aba: ${guardada.join()}`
    );
  }
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
        `${plataforma}: wake.landing com template/selection de home, na ordem, e a variável`,
        lp.length === 9 && lp[0].template === String(Number(fLp)) && lp[0].selection === 'banner-main' && lp[8].selection === extra.selection && lp[1].variables?.['--countdown-accent'] === '#ff0000',
        JSON.stringify(lp.map(e => `${e.template}/${e.selection}`))
      );
    }
    if (plataforma === 'VTEX') conferirFaststore(cfg, r);
    else conferirTrayWake(cfg, plataforma, r);
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
    r.ok(`${plataforma}: /p/{id}/lp abre a LP, sem as seções da loja`, ordem.join() === [...ORDEM_INICIAL, extra.selection].join(), ordem.join());
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

// ── Wake 2.0: trocar de plataforma com a LP inicial intocada ─────────────────
// A LP inicial (08) de quem começou em VTEX vira a inicial da Wake 2.0 (10), sem
// o diálogo de "estas seções serão removidas" — ela não era trabalho do usuário.
if (WAKE2_LIGADA) {
  const { page } = await novaAba(browser);
  const dialogos = [];
  page.on('dialog', d => dialogos.push(d.message().slice(0, 120)));
  await semear(page, { plataforma: 'VTEX', selecoes: comunsDe('10') });
  await page.evaluate(() => sessionStorage.removeItem('lp'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  await espera(1500);
  // Clique antes da hidratação é engolido: clica de verdade até a lista abrir.
  await irParaRail(page, 'Componentes');
  for (let i = 0; i < 20 && !(await page.$('[role="option"]')); i++) {
    await clicarDeVerdade(page, 'button[class*="card"][aria-haspopup="listbox"]');
    await espera(500);
  }
  await page.evaluate(() => [...document.querySelectorAll('[role="option"]')].find(o => o.textContent.trim() === 'Wake 2.0')?.click());
  await espera(1500);
  const depois = await page.evaluate(() => ({
    plataforma: sessionStorage.getItem('layoutPlatform'),
    ids: [...new Set(JSON.parse(sessionStorage.getItem('lp') ?? '{"selections":[]}').selections.map(s => s.id))],
    n: JSON.parse(sessionStorage.getItem('lp') ?? '{"selections":[]}').selections.length,
  }));
  r.ok(
    'VTEX → Wake 2.0: a LP inicial intocada vira as 8 seções da 10, sem diálogo de remoção',
    depois.plataforma === 'Wake 2.0' && depois.ids.join() === '10' && depois.n === 8 && !dialogos.some(m => /removidas/.test(m)),
    `${JSON.stringify(depois)} · diálogos: ${dialogos.join(' | ') || '—'}`
  );
  await page.close();
}

await browser.close();
process.exit(r.fechar() ? 0 : 1);
