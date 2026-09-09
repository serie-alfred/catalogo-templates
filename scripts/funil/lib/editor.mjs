import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL, espera } from './util.mjs';

export const PAGINAS = {
  common: 'Todas as páginas',
  home: 'Homepage',
  category: 'Página de Categoria',
  product: 'Página de Produto',
};

export async function abrirBrowser() {
  return puppeteer.launch({
    executablePath: findChrome(),
    headless: 'shell',
    args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  });
}

/** Página nova com os erros coletados — sem isso um crash passa despercebido. */
export async function novaAba(browser) {
  const page = await browser.newPage();
  const erros = [];
  page.on('pageerror', e => erros.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error') erros.push(`console: ${m.text().slice(0, 140)}`);
  });
  page.on('dialog', async d => {
    await d.accept();
  });
  return { page, erros };
}

/** Semeia o localStorage e recarrega — o estado do editor mora lá. */
export async function semear(page, { plataforma, selecoes = [], token = '' }) {
  await page.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await page.evaluate(
    (p, s, t) => {
      localStorage.clear();
      localStorage.setItem('layoutPlatform', p);
      localStorage.setItem('layoutSelections', s);
      localStorage.setItem('panelLeftCollapsed', '0');
      localStorage.setItem('panelRightCollapsed', '0');
      if (t) localStorage.setItem('wakeToken', t);
    },
    plataforma,
    JSON.stringify(selecoes),
    token
  );
  await page.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });

  // `.ed-shell` só diz que a casca montou. Quem os chamadores realmente usam é a
  // LISTA de seções e o CANVAS, e os dois chegam depois — o canvas por handshake
  // com o iframe. Dormir 3,5s cobria isso na máquina descarregada e falhava sob
  // carga: já derrubou o estágio 2b duas vezes por timing, não por defeito.
  if (selecoes.length) {
    await page
      .waitForFunction(
        n =>
          document.querySelectorAll('[aria-label^="Expandir "]').length >= n ||
          (document
            .querySelector('iframe')
            ?.contentDocument?.querySelectorAll('[data-section-uid]').length ??
            0) >= n,
        { timeout: 45000, polling: 250 },
        selecoes.length
      )
      .catch(() => {});
  }
  await espera(1200);
}

/** O gatilho de página é o que traz o nome de uma das 4 — o outro listbox é o de plataforma. */
const GATILHO_PAGINA =
  'const t=[...document.querySelectorAll(\'[aria-haspopup="listbox"]\')]' +
  '.find(b=>/Homepage|Todas as páginas|Página de/.test(b.textContent));';

export async function trocarPagina(page, chave) {
  const nome = PAGINAS[chave];
  await page.waitForFunction(new Function(`${GATILHO_PAGINA}return !!t`), {
    timeout: 15000,
  });
  await page.evaluate(new Function(`${GATILHO_PAGINA}t.click()`));
  await page.waitForFunction(
    () =>
      document
        .querySelector('[role="listbox"][aria-label="Página"]')
        ?.querySelectorAll('[role="option"]').length === 4,
    { timeout: 15000 }
  );
  await page.evaluate(n => {
    [
      ...document.querySelectorAll(
        '[role="listbox"][aria-label="Página"] [role="option"]'
      ),
    ]
      .find(o => o.textContent.trim() === n)
      .click();
  }, nome);
  await page.waitForFunction(
    new Function(
      'n',
      `${GATILHO_PAGINA}return t && t.textContent.trim().startsWith(n)`
    ),
    { timeout: 15000 },
    nome
  );
  await espera(1800);
}

export const selecoesSalvas = page =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem('layoutSelections')).map(
      s => `${s.layoutKey}:${s.id}`
    )
  );

export const secoesNoCanvas = page =>
  page.evaluate(
    () =>
      document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ?? -1
  );

/** Seleciona a seção no canvas e devolve o estado dos dois badges. */
export async function badgesDe(page, selection) {
  // O canvas é outro documento e monta depois do shell; esperar o elemento é
  // mais honesto (e mais rápido) do que dormir um tempo arbitrário.
  await page
    .waitForFunction(
      sel =>
        !!document
          .querySelector('iframe')
          ?.contentDocument?.querySelector(`[data-selection="${sel}"]`),
      { timeout: 20000 },
      selection
    )
    .catch(async () => {
      const presentes = await page.evaluate(() =>
        [
          ...(document
            .querySelector('iframe')
            ?.contentDocument?.querySelectorAll('[data-selection]') ?? []),
        ].map(e => e.getAttribute('data-selection'))
      );
      throw new Error(
        `[data-selection="${selection}"] não montou; no canvas: ${JSON.stringify(presentes)}`
      );
    });
  await page.evaluate(sel => {
    document
      .querySelector('iframe')
      .contentDocument.querySelector(`[data-selection="${sel}"]`)
      .click();
  }, selection);
  await espera(1100);
  return page.evaluate(() => {
    const d = document.querySelector('iframe').contentDocument;
    const acoes = d.querySelector('.editor-section-actions');
    const [dup, rem] = [...acoes.querySelectorAll('button')];
    const vis = el =>
      !el.hidden && d.defaultView.getComputedStyle(el).display !== 'none';
    return {
      acoesVisiveis: !acoes.hidden,
      duplicar: vis(dup),
      remover: vis(rem),
    };
  });
}

/** Abre o modal, escolhe a categoria e clica no modelo pelo título. */
export async function adicionarPeloModal(page, categoria, titulo, pagina) {
  if (pagina) await trocarPagina(page, pagina);
  const abrir = () =>
    page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find(x =>
        /Adicionar se/i.test(x.textContent)
      );
      b?.click();
      return !!b;
    });
  await abrir();
  // Uma segunda tentativa antes de desistir. O clique pode chegar enquanto o React
  // ainda está montando o shell, e sob carga (build, outro funil, agentes em
  // paralelo) 15s de espera fixa não bastavam — o estágio caía por timing, não por
  // defeito do modal.
  try {
    await page.waitForSelector('#dynamic-tabs', { timeout: 20000 });
  } catch {
    await espera(1500);
    await abrir();
    await page.waitForSelector('#dynamic-tabs', { timeout: 20000 });
  }
  await espera(600);
  await page.evaluate(c => {
    const tabs = [...document.querySelectorAll('#dynamic-tabs button')];
    const alvo = tabs.find(t => t.textContent.trim().startsWith(c));
    if (!alvo)
      throw new Error(
        `categoria "${c}" não listada; tem: ${tabs.map(t => t.textContent.trim()).join(' / ')}`
      );
    alvo.click();
  }, categoria);
  await espera(600);
  await page.evaluate(t => {
    const card = [...document.querySelectorAll('h2')].find(
      h => h.textContent.trim() === t
    );
    if (!card) throw new Error(`modelo "${t}" não está na grade`);
    card.closest('div[class]').parentElement.click();
  }, titulo);
  await espera(900);
  await page.keyboard.press('Escape');
  await espera(900);
}

/** Rótulos das linhas do painel esquerdo (o botão .name carrega o nome do grupo). */
export const gruposNaLista = page =>
  page.evaluate(() =>
    [...document.querySelectorAll('button')].map(b => b.textContent.trim())
  );
