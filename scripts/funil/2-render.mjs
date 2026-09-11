import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL, lerLayouts, SAIDA } from './lib/util.mjs';
const CHROME = findChrome();
const L = lerLayouts();

/**
 * Os 23 componentes que o redesign trouxe. Eram o escopo INTEIRO do estágio, e
 * isso deixava 44 dos 67 itens do catálogo sem nenhum smoke de render — os
 * pré-existentes, que são justamente os que ninguém olha mais.
 *
 * Agora a varredura é completa por padrão. `FUNIL_RENDER_NOVOS=1` reduz aos 23
 * para uma volta rápida durante desenvolvimento; o portão do cutover roda tudo.
 */
const NOVAS = new Set([
  'hdr07bru1k2m',
  'crdprd06f6g7',
  'crdprd07h8j9',
  'bred02q7l4k5',
  'ftr07bru3n4p',
  'bnfull05k3m7',
  'txt01a2b3c4d',
  'mulcat04n8p2',
  'homcar06q4r9',
  'ban06a1b2c3d',
  'bnf04t5u6v7w',
  'bnf05x8y9z0a',
  'vtr06frc4d5e',
  'vtr07bru5q6r',
  'bntrp05f4g5h',
  'bntsw05j6k7l',
  'bntrp06m8n9p',
  'cattrp06q1r2',
  'bnsolo04s3t4',
  'bnslft05w7x8',
  'spcofr04u5v6',
  'homcmb04y9z0',
  'rev06b1c2d3e',
]);

const SO_NOVOS = process.env.FUNIL_RENDER_NOVOS === '1';
const alvos = [];
for (const [layoutKey, sec] of Object.entries(L))
  for (const it of sec.items)
    if (!SO_NOVOS || NOVAS.has(it.key)) {
      const pag = it.pagina[0];
      const page =
        layoutKey === 'spot'
          ? 'common'
          : layoutKey === 'breadcrumb'
            ? 'category'
            : pag === 'common'
              ? 'home'
              : pag;
      alvos.push({
        layoutKey,
        selection: it.selection,
        id: it.id,
        comp: it.component,
        key: it.key,
        plat: it.platforms[0],
        page,
        pagina: pag,
        platforms: it.platforms,
      });
    }
// Guarda contra alvo que some em silêncio: no modo reduzido o esperado são as
// 23 chaves; no completo, todo item do catálogo.
const esperados = SO_NOVOS
  ? NOVAS.size
  : Object.values(L).reduce((n, sec) => n + sec.items.length, 0);
if (alvos.length !== esperados) {
  console.error(`esperava ${esperados}, achei ${alvos.length}`);
  process.exit(1);
}
console.log(
  `  varrendo ${alvos.length} componentes${SO_NOVOS ? ' (só os novos)' : ' (catálogo inteiro)'}`
);

const PAGENAME = {
  common: 'Todas as páginas',
  home: 'Homepage',
  category: 'Página de Categoria',
  product: 'Página de Produto',
};
const s = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const p = await b.newPage();
let errs = [];
p.on('pageerror', e => errs.push(`pageerror: ${e.message}`));
p.on('console', m => {
  if (m.type() === 'error') errs.push(`console: ${m.text().slice(0, 140)}`);
});

await p.goto(`${BASE_URL}/gerador`, {
  waitUntil: 'networkidle2',
  timeout: 120000,
});

const linhas = [];
// Uma varredura de 67 itens NÃO pode ser tudo-ou-nada: qualquer exceção no meio
// (um wait que estoura, um elemento que não apareceu) derrubava o estágio e, com
// ele, os quatro estágios seguintes que dependem dele. Agora a falha de um alvo é
// a falha DAQUELE alvo — aparece na tabela e conta no placar, e o lote termina.
for (const a of alvos) {
  errs = [];
  try {
    await p.evaluate(
      (plat, sel) => {
        localStorage.clear();
        localStorage.setItem('layoutPlatform', plat);
        localStorage.setItem('layoutSelections', sel);
        localStorage.setItem('panelLeftCollapsed', '0');
        localStorage.setItem('panelRightCollapsed', '0');
      },
      a.plat,
      JSON.stringify([
        { uid: 'u-teste', id: a.id, layoutKey: a.layoutKey, pagina: a.pagina },
      ])
    );
    await p.goto(`${BASE_URL}/gerador`, {
      waitUntil: 'networkidle2',
      timeout: 120000,
    });
    await p.waitForSelector('.ed-shell');
    await s(2600);

    if (a.page !== 'home') {
      // Há DOIS [aria-haspopup="listbox"] no shell: o card de plataforma e o
      // seletor de página. O de página é o que traz o nome de uma das 4 páginas.
      const TRIG =
        'const t=[...document.querySelectorAll(\'[aria-haspopup="listbox"]\')]' +
        '.find(b=>/Homepage|Todas as p\u00e1ginas|P\u00e1gina de/.test(b.textContent));';
      // Clicar e VERIFICAR, insistindo — o gatilho existe no HTML antes de o React
      // hidratar, e clique em botão não hidratado não faz nada, em silêncio. Era
      // um `waitForFunction` de 15 s seco: quando estourava, a exceção derrubava o
      // estágio inteiro no meio da varredura dos 67.
      await p.waitForFunction(new Function(`${TRIG}return !!t`), {
        timeout: 30000,
        polling: 250,
      });
      const abriuLista = async () => {
        const limite = Date.now() + 20000;
        while (Date.now() < limite) {
          const n = await p.evaluate(
            () =>
              document
                .querySelector('[role="listbox"][aria-label="P\u00e1gina"]')
                ?.querySelectorAll('[role="option"]').length ?? 0
          );
          if (n === 4) return true;
          await p.evaluate(new Function(`${TRIG}t?.click()`));
          await s(400);
        }
        return false;
      };
      if (!(await abriuLista()))
        throw new Error('o seletor de página não abriu com 4 opções');

      await p.evaluate(nome => {
        [
          ...document.querySelectorAll(
            '[role="listbox"][aria-label="P\u00e1gina"] [role="option"]'
          ),
        ]
          .find(x => x.textContent.trim() === nome)
          ?.click();
      }, PAGENAME[a.page]);
      await p.waitForFunction(
        new Function(
          'nome',
          `${TRIG}return t && t.textContent.trim().startsWith(nome)`
        ),
        { timeout: 30000, polling: 250 },
        PAGENAME[a.page]
      );
      await s(2200);
    }

    // Espera a seção pintar em vez de confiar no sleep fixo. Com o dev server frio o
    // primeiro alvo do lote perdia a corrida e saía como "seção não montou" — falha
    // de harness, não do componente. Se estourar, o evaluate abaixo reporta o motivo.
    await p
      .waitForFunction(
        sel =>
          !!document
            .querySelector('iframe')
            ?.contentDocument?.querySelector(`[data-selection="${sel}"]`),
        { timeout: 20000, polling: 250 },
        a.selection
      )
      .catch(() => {});

    const m = await p.evaluate(sel => {
      const d = document.querySelector('iframe')?.contentDocument;
      if (!d) return { erro: 'sem contentDocument' };
      const secs = d.querySelectorAll('[data-section-uid]');
      const el = d.querySelector(`[data-selection="${sel}"]`);
      if (!el) return { nSec: secs.length, erro: 'seção não montou' };
      const r = el.getBoundingClientRect();
      return {
        nSec: secs.length,
        h: Math.round(r.height),
        w: Math.round(r.width),
        nodes: el.querySelectorAll('*').length,
        txt: (el.innerText || '').trim().length,
        imgs: el.querySelectorAll('img').length,
      };
    }, a.selection);

    // Overlay ancorado na viewport (`position: fixed`) não ocupa fluxo: a caixa
    // da SEÇÃO tem altura 0 por construção, e exigir `h > 0` reprovaria um
    // componente que está correto. A lista é explícita de propósito — "altura 0
    // é aceitável" não pode ser regra geral, senão o estágio deixa de pegar o
    // caso que ele existe para pegar: a seção que não montou.
    const OVERLAYS = new Set(['help-float', 'popup-news']);
    const ehOverlay = OVERLAYS.has(a.selection);
    const passou =
      !m.erro &&
      m.nSec === 1 &&
      (ehOverlay || m.h > 0) &&
      m.nodes > 0 &&
      errs.length === 0;
    await p.evaluate(
      () =>
        new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    );
    await s(500);
    await p.screenshot({
      path: `${SAIDA}/${a.comp}.png`,
      captureBeyondViewport: false,
    });
    linhas.push({ ...a, m, errs: [...errs], passou });
    console.log(
      `${passou ? '✅' : '❌'} ${a.comp.padEnd(21)} ${a.plat.padEnd(4)} ${a.page.padEnd(8)} ${
        m.erro
          ? `ERRO: ${m.erro}`
          : `${m.w}x${m.h}px${ehOverlay ? ' (overlay: fora do fluxo)' : ''}  ${m.nodes} nós  ${m.imgs} img  ${m.txt} chars`
      }${errs.length ? `  ⚠️ ${errs.slice(0, 2).join(' | ')}` : ''}`
    );
  } catch (e) {
    const motivo = String(e?.message ?? e).split('\n')[0];
    linhas.push({
      ...a,
      m: { erro: motivo },
      errs: [...errs],
      passou: false,
    });
    console.log(
      `❌ ${a.comp.padEnd(21)} ${a.plat.padEnd(4)} ${a.page.padEnd(8)} EXCEÇÃO: ${motivo}`
    );
  }
}
const bad = linhas.filter(l => !l.passou);
console.log(
  `\n${linhas.length - bad.length}/${linhas.length} renderizam limpos`
);
if (bad.length)
  for (const x of bad)
    console.log('  ✗', x.comp, JSON.stringify(x.m), x.errs.slice(0, 3));
await b.close();
process.exit(bad.length ? 1 : 0);
