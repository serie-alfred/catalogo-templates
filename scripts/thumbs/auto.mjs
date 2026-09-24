/**
 * Thumbs automáticas: fotografa o componente REAL, para os itens que o designer
 * ainda não desenhou.
 *
 * É o mesmo arnês do `scripts/funil/2-render.mjs` (semeia o localStorage com UMA
 * seção, abre o /gerador, troca a página, espera a seção pintar), com duas
 * diferenças: fotografa só o retângulo da seção dentro do <iframe> em vez da tela
 * inteira do editor, e escreve em `public/images/gerador/` em vez do `.funil/`
 * (que é gitignored).
 *
 * GUARDA: nunca toca num item cuja arte veio do designer. Dois cadeados, porque a
 * ordem de execução não pode ser um pré-requisito: o componente está em `mapa.json`
 * (o mapa do design), ou o item já está marcado `imageSource: "design"` no catálogo.
 * É o que permite rodar `yarn thumbs` de novo daqui a seis meses sem medo.
 *
 * O resultado é um screenshot honesto — NÃO imita o mockup do designer (notebook e
 * celular inclinados sobre gradiente). Fingir o estilo deixaria impossível saber o
 * que ainda falta vir do design, que é exatamente o que `imageSource` responde.
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { findChrome, BASE_URL, lerLayouts } from '../funil/lib/util.mjs';
import { DESTINO, LARGURA, ALTURA, caminhoDe, lerMapa } from './lib.mjs';

const DO_DESIGNER = new Set(lerMapa().itens.map(i => i.component));

const PAGENAME = {
  common: 'Todas as páginas',
  home: 'Homepage',
  category: 'Página de Categoria',
  product: 'Página de Produto',
};
// Overlays ancorados na viewport não ocupam fluxo: a caixa da seção tem altura 0.
// Para esses a foto é do canvas inteiro, senão o clip seria degenerado.
const OVERLAYS = new Set(['help-float', 'popup-news']);
const s = ms => new Promise(r => setTimeout(r, ms));

// THUMBS_SO=Spot07,Footer07 refotografa só estes. Sem o filtro a rodada regrava todos os
// prints, e a renderização não é determinística byte a byte: medido em 23/09/2026, os 34
// .webp mudaram algumas dezenas de bytes cada, 29 deles sem nenhuma diferença visível — o
// diff do componente que mudou de verdade some no meio do ruído.
const SO = process.env.THUMBS_SO?.split(',')
  .map(c => c.trim())
  .filter(Boolean);

const L = lerLayouts();
const alvos = [];
for (const [layoutKey, sec] of Object.entries(L))
  for (const it of sec.items) {
    if (DO_DESIGNER.has(it.component) || it.imageSource === 'design') continue;
    if (SO && !SO.includes(it.component)) continue;
    const pag = it.pagina[0];
    alvos.push({
      layoutKey,
      selection: it.selection,
      id: it.id,
      component: it.component,
      plat: it.platforms[0],
      pagina: pag,
      page:
        layoutKey === 'spot'
          ? 'common'
          : layoutKey === 'breadcrumb'
            ? 'category'
            : pag === 'common'
              ? 'home'
              : pag,
    });
  }

const total = Object.values(L).reduce((n, sec) => n + sec.items.length, 0);
if (SO) {
  // Pedido que não virou alvo é item de design (protegido) ou nome que não existe.
  const fora = SO.filter(c => !alvos.some(a => a.component === c));
  const aviso = fora.length ? ` — fora (design ou inexistente): ${fora.join(', ')}` : '';
  console.log(`  THUMBS_SO: ${alvos.length} de ${SO.length} pedidos${aviso}`);
} else
  console.log(
    `  ${alvos.length} itens sem arte de design (de ${total}); ${total - alvos.length} preservados`
  );
if (!alvos.length) process.exit(0);

const b = await puppeteer.launch({
  executablePath: findChrome(),
  headless: 'shell',
  args: ['--force-device-scale-factor=2', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
});
const p = await b.newPage();
await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2', timeout: 120000 });

let ok = 0;
const falhas = [];

for (const a of alvos) {
  try {
    await p.evaluate(
      (plat, sel) => {
        localStorage.clear();
        localStorage.setItem('layoutPlatform', plat);
        localStorage.setItem('layoutSelections', sel);
        localStorage.setItem('panelLeftCollapsed', '1');
        localStorage.setItem('panelRightCollapsed', '1');
      },
      a.plat,
      JSON.stringify([
        { uid: 'u-thumb', id: a.id, layoutKey: a.layoutKey, pagina: a.pagina },
      ])
    );
    await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2', timeout: 120000 });
    await p.waitForSelector('.ed-shell');
    await s(2600);

    if (a.page !== 'home') await trocarPagina(p, PAGENAME[a.page]);

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

    // O retângulo é medido DENTRO do iframe e somado ao offset do iframe na página —
    // as duas coordenadas vivem em documentos diferentes.
    const caixa = await p.evaluate(
      (sel, ehOverlay) => {
        const fr = document.querySelector('iframe');
        if (!fr) return { erro: 'sem iframe' };
        const fb = fr.getBoundingClientRect();
        if (ehOverlay)
          return { x: fb.x, y: fb.y, w: fb.width, h: Math.min(fb.height, 900) };
        const el = fr.contentDocument?.querySelector(`[data-selection="${sel}"]`);
        if (!el) return { erro: 'seção não montou' };
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return { erro: 'seção com caixa vazia' };
        return { x: fb.x + r.x, y: fb.y + r.y, w: r.width, h: r.height };
      },
      a.selection,
      OVERLAYS.has(a.selection)
    );
    if (caixa.erro) throw new Error(caixa.erro);

    const vp = p.viewport();
    const clip = {
      x: Math.max(0, Math.round(caixa.x)),
      y: Math.max(0, Math.round(caixa.y)),
      width: Math.min(Math.round(caixa.w), vp.width - Math.max(0, Math.round(caixa.x))),
      // Seção mais alta que a viewport vira o topo dela: é o pedaço reconhecível,
      // e é o mesmo recorte que o card faz depois com object-fit: cover.
      height: Math.min(
        Math.round(caixa.h),
        vp.height - Math.max(0, Math.round(caixa.y))
      ),
    };
    if (clip.width < 2 || clip.height < 2) throw new Error('clip degenerado');

    await p.evaluate(
      () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    );
    const png = await p.screenshot({ clip, captureBeyondViewport: false });

    const saida = path.join(DESTINO, caminhoDe(a));
    fs.mkdirSync(path.dirname(saida), { recursive: true });
    const { size } = await sharp(png)
      .resize(LARGURA, ALTURA, enquadramento(clip.width, clip.height))
      .webp({ quality: 82, effort: 5 })
      .toFile(saida);
    ok++;
    console.log(
      `✅ ${a.component.padEnd(22)} ${caminhoDe(a).padEnd(46)} ${String(Math.round(size / 1024)).padStart(4)} KB  ${String(clip.width + 'x' + clip.height).padEnd(10)} ${enquadramento(clip.width, clip.height).fit}`
    );
  } catch (e) {
    const motivo = String(e?.message ?? e).split('\n')[0];
    falhas.push(`${a.component}: ${motivo}`);
    console.log(`❌ ${a.component.padEnd(22)} ${motivo}`);
  }
}

await b.close();
console.log(`\n  ${ok}/${alvos.length} thumbs automáticas geradas`);
if (falhas.length) {
  console.error(`\n✗ ${falhas.length} falha(s) — esses itens ficam sem imagem:`);
  for (const f of falhas) console.error(`    ${f}`);
  process.exit(1);
}

/**
 * Como caber um componente de proporção qualquer num slot 1.856:1.
 *
 * `cover` recorta, e para uma seção-faixa isso é destrutivo: o Breadcrumb01 sai
 * 1440x71 (proporção 20:1) e o cover manteria 9% da largura — uma lasca ilegível
 * do meio. A conta é `manteve = min(alvo, origem) / max(alvo, origem)` nas
 * proporções; abaixo de 60% o recorte deixa de representar o componente e vale
 * mais mostrá-lo inteiro, sobre branco (a cor do canvas do editor).
 *
 * Acima disso `cover` ancorado no topo ganha: numa seção alta (ProductInfo,
 * 1440x984) o topo é o pedaço reconhecível, e é o mesmo recorte que o card faz
 * de novo com object-fit: cover.
 */
function enquadramento(w, h) {
  const alvo = LARGURA / ALTURA;
  const origem = w / h;
  const manteve = Math.min(alvo, origem) / Math.max(alvo, origem);
  return manteve < 0.6
    ? { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }
    : { fit: 'cover', position: 'top' };
}

/** Abre o seletor de página do shell e escolhe `nome`. Copiado de 2-render.mjs:
 *  o gatilho existe no HTML antes de o React hidratar, e clique em botão não
 *  hidratado não faz nada — em silêncio. Por isso é clicar-e-verificar em laço. */
async function trocarPagina(p, nome) {
  const TRIG =
    'const t=[...document.querySelectorAll(\'[aria-haspopup="listbox"]\')]' +
    '.find(b=>/Homepage|Todas as páginas|Página de/.test(b.textContent));';
  await p.waitForFunction(new Function(`${TRIG}return !!t`), {
    timeout: 30000,
    polling: 250,
  });
  const limite = Date.now() + 20000;
  let abriu = false;
  while (Date.now() < limite) {
    const n = await p.evaluate(
      () =>
        document
          .querySelector('[role="listbox"][aria-label="Página"]')
          ?.querySelectorAll('[role="option"]').length ?? 0
    );
    if (n === 4) {
      abriu = true;
      break;
    }
    await p.evaluate(new Function(`${TRIG}t?.click()`));
    await s(400);
  }
  if (!abriu) throw new Error('o seletor de página não abriu com 4 opções');
  await p.evaluate(n => {
    [
      ...document.querySelectorAll(
        '[role="listbox"][aria-label="Página"] [role="option"]'
      ),
    ]
      .find(x => x.textContent.trim() === n)
      ?.click();
  }, nome);
  await p.waitForFunction(
    new Function('n', `${TRIG}return t && t.textContent.trim().startsWith(n)`),
    { timeout: 30000, polling: 250 },
    nome
  );
  await s(2200);
}
