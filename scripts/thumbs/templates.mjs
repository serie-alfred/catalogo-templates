/**
 * Thumbs dos templates completos da home: a home de cada família, montada e
 * fotografada no tamanho do card.
 *
 * A lista vem da PRÓPRIA home (o link de cada card de `[data-home-catalogo]`),
 * e não de uma regra reescrita aqui: o que se fotografa
 * é exatamente o que a home mostra. Cada uma é aberta no documento da loja
 * (`/templates/<NN>/home/frame`), sem a barra, numa viewport de 1440 — a mesma
 * do preview "Desktop" do editor — com a altura na proporção do card.
 *
 * O pop-up de newsletter e a ajuda flutuante saem da foto: são camadas sobre a
 * página, e o pop-up cobriria a home inteira. O indicador do `next dev` também.
 *
 *   yarn thumbs:templates                  (precisa do `yarn dev` de pé)
 *   TEMPLATES_SO=09,12 yarn thumbs:templates   só estes
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { findChrome, BASE_URL } from '../funil/lib/util.mjs';
import { RAIZ } from './lib.mjs';

const DESTINO = path.join(RAIZ, 'public/images/templates');

/** 2× o card da home (`Spot`: `<Image width={400} height={304}>`). */
const LARGURA = 800;
const ALTURA = 608;
/** A viewport da foto: 1440 de largura, a altura na proporção do card. */
const VIEWPORT = { width: 1440, height: Math.round((1440 * ALTURA) / LARGURA) };

const SO = process.env.TEMPLATES_SO?.split(',')
  .map(c => c.trim().padStart(2, '0'))
  .filter(Boolean);

const OCULTAR = `
  [data-selection="popup-news"],
  [data-selection="help-float"],
  nextjs-portal { display: none !important; }
`;

const b = await puppeteer.launch({
  executablePath: findChrome(),
  headless: 'shell',
  args: ['--hide-scrollbars'],
  defaultViewport: { ...VIEWPORT, deviceScaleFactor: 1 },
});
const p = await b.newPage();

await p.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 180000 });
const slugs = await p.$$eval(
  '[data-home-catalogo] a[data-spot]',
  links =>
    links
      .map(a => a.getAttribute('href')?.match(/^\/templates\/(\d+)\/home$/)?.[1])
      .filter(Boolean)
);
if (!slugs.length) {
  console.error('✗ a home não lista nenhum template (procurei [data-home-catalogo] a[data-spot])');
  await b.close();
  process.exit(1);
}
const alvos = SO ? slugs.filter(s => SO.includes(s)) : slugs;
console.log(`  ${alvos.length} de ${slugs.length} templates da home${SO ? ` (TEMPLATES_SO=${SO.join(',')})` : ''}`);

fs.mkdirSync(DESTINO, { recursive: true });
let ok = 0;
const falhas = [];

for (const slug of alvos) {
  try {
    await p.goto(`${BASE_URL}/templates/${slug}/home/frame`, {
      waitUntil: 'networkidle2',
      timeout: 120000,
    });
    await p.addStyleTag({ content: OCULTAR });
    await p.waitForSelector('[data-section-uid]', { timeout: 30000 });
    // Fonte do Google e imagem do topo carregadas: sem isso a foto sai com a
    // fonte de fallback e o banner em branco, e ninguém confere o .webp depois.
    // Só as imagens DENTRO da foto: uma `loading="lazy"` abaixo da dobra nunca
    // dispara load sem rolar, e esperar por ela travava o Template 01.
    await p.evaluate(async () => {
      await document.fonts.ready;
      const naFoto = img => img.getBoundingClientRect().top < innerHeight;
      await Promise.race([
        Promise.all(
          [...document.images]
            .filter(img => !img.complete && naFoto(img))
            .map(img => new Promise(r => { img.onload = img.onerror = r; }))
        ),
        new Promise(r => setTimeout(r, 15000)),
      ]);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    });
    const faltando = await p.$$eval('[data-registry-missing]', els => els.map(e => e.getAttribute('data-registry-missing')));
    if (faltando.length) throw new Error(`fora do TemplateRegistry: ${faltando.join(', ')}`);

    const png = await p.screenshot({ captureBeyondViewport: false });
    const saida = path.join(DESTINO, `${slug}.webp`);
    const { size } = await sharp(png)
      .resize(LARGURA, ALTURA, { fit: 'cover', position: 'top' })
      .webp({ quality: 82, effort: 5 })
      .toFile(saida);
    ok++;
    console.log(`✅ ${slug}  public/images/templates/${slug}.webp  ${String(Math.round(size / 1024)).padStart(4)} KB`);
  } catch (e) {
    const motivo = String(e?.message ?? e).split('\n')[0];
    falhas.push(`${slug}: ${motivo}`);
    console.log(`❌ ${slug}  ${motivo}`);
  }
}

await b.close();
console.log(`\n  ${ok}/${alvos.length} thumbs de template geradas`);
if (falhas.length) {
  console.error(`\n✗ ${falhas.length} falha(s) — esses cards ficam com a imagem genérica:`);
  for (const f of falhas) console.error(`    ${f}`);
  process.exit(1);
}
