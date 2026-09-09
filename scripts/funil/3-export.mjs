import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL, lerLayouts, SAIDA } from './lib/util.mjs';
import {
  writeFileSync,
  existsSync,
  statSync,
  rmSync,
  mkdirSync,
} from 'node:fs';
import { relatorio } from './lib/util.mjs';
import { conferirTrayWake, conferirFaststore } from './lib/contrato.mjs';
const CHROME = findChrome();
const L = lerLayouts();
const s = ms => new Promise(r => setTimeout(r, ms));
const log = m => {
  process.stdout.write(`${m}\n`);
};
const r = relatorio('Estágio 3 — export e contrato com o generator');
// Os PNGs também são baixados; pasta limpa a cada run para a conferência valer.
const DL = `${SAIDA}/download`;
rmSync(DL, { recursive: true, force: true });
mkdirSync(DL, { recursive: true });

// PNG 1×1 transparente — substitui as imagens externas dos mocks. O config.json
// não depende de imagem nenhuma; o que a rede atrapalha é só o palco de captura.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const seedFor = plat => {
  const out = [];
  for (const [layoutKey, sec] of Object.entries(L))
    for (const it of sec.items)
      if (it.platforms.includes(plat))
        for (const pg of it.pagina)
          out.push({
            uid: `u-${layoutKey}-${it.id}-${pg}`,
            id: it.id,
            layoutKey,
            pagina: pg,
          });
  return out;
};

const b = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});

// Duas seleções, com propósitos diferentes:
//  - "máxima" põe TODO modelo compatível ao mesmo tempo. Não é alcançável pela
//    UI (os slots singleton só aceitam um), mas cobre de uma vez todos os
//    caminhos de origem e todo manifest.
//  - "coerente" é um tema que alguém montaria: um modelo por slot, mesma
//    família. É a base do estágio 4, que dele deriva o config CRUZADO (vitrine
//    de uma família, card de outra) para exercitar a substituição de spot.
const coerenteFor = plataforma => {
  const out = [];
  for (const [layoutKey, sec] of Object.entries(L)) {
    const it =
      sec.items.find(i => i.id === '01' && i.platforms.includes(plataforma)) ??
      sec.items.find(i => i.platforms.includes(plataforma));
    if (!it) continue;
    for (const pg of it.pagina)
      out.push({ uid: `u-${layoutKey}`, id: it.id, layoutKey, pagina: pg });
  }
  return out;
};

for (const plat of ['Tray', 'Wake', 'VTEX', 'VTEX-coerente']) {
  const coerente = plat.endsWith('-coerente');
  const plataforma = coerente ? plat.replace('-coerente', '') : plat;
  const p = await b.newPage();
  // sem interceptação: as imagens externas dos mocks carregam de verdade
  const cdp = await p.createCDPSession();
  await cdp.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DL,
  });
  p.on('dialog', async d => {
    log(`   [dialog ${plat}] ${d.message().slice(0, 90)}`);
    await d.dismiss();
  });
  p.on('pageerror', e =>
    log(`   [pageerror ${plat}] ${e.message.slice(0, 90)}`)
  );

  const seed = coerente ? coerenteFor(plataforma) : seedFor(plataforma);
  await p.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await p.evaluate(
    (pl, sel, tok) => {
      localStorage.clear();
      localStorage.setItem('layoutPlatform', pl);
      localStorage.setItem('layoutSelections', sel);
      if (tok) localStorage.setItem('wakeToken', tok);
    },
    plataforma,
    JSON.stringify(seed),
    plataforma === 'Wake' ? 'TOKEN-DE-TESTE' : ''
  );
  await p.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await p.waitForSelector('.ed-shell', { timeout: 60000 });
  await s(8000);

  const hidratou = await p.evaluate(
    () => JSON.parse(localStorage.getItem('layoutSelections')).length
  );
  log(`${plat}: semeados ${seed.length} → hidratados ${hidratou}`);

  await p.evaluate(() => {
    window.__cfg = null;
    // Diagnóstico: sem isto, um export que não entrega o JSON some em 120s de
    // espera muda e a mensagem final não distingue "o botão não fez nada" de
    // "o Blob veio e o parse falhou".
    window.__blobs = [];
    window.__cfgErro = null;
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = bl => {
      if (bl) window.__blobs.push(`${bl.type}:${bl.size}`);
      if (bl && bl.type === 'application/json')
        bl.text().then(t => {
          try {
            window.__cfg = JSON.parse(t);
          } catch (e) {
            window.__cfgErro = String(e);
          }
        });
      return orig(bl);
    };
  });
  // O botão é `disabled={exporting || !platform}`, e clicar em botão desabilitado
  // não faz NADA — sem erro, sem blob, sem sinal. Se o clique chegar antes de o
  // `platform` hidratar do localStorage, o estágio ficava 120s esperando um export
  // que nunca começou. Esperar ele habilitar é a diferença entre medir o produto e
  // medir a corrida.
  await p.waitForFunction(
    () => {
      const b = [...document.querySelectorAll('button')].find(x =>
        x.textContent.trim().startsWith('Baixar')
      );
      return !!b && !b.disabled;
    },
    { timeout: 60000, polling: 250 }
  );
  await p.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(x =>
      x.textContent.trim().startsWith('Baixar')
    );
    if (!btn) throw new Error('botão Baixar não encontrado');
    btn.click();
  });

  let config = null;
  for (let i = 1; i <= 24 && !config; i++) {
    await s(5000);
    try {
      config = await p.evaluate(() => window.__cfg);
    } catch {}
    if (!config && i % 4 === 0) {
      const st = await p
        .evaluate(() => {
          const im = [...document.querySelectorAll('img')];
          return `${im.length} img, ${im.filter(x => !x.complete).length} pendentes, fonts=${document.fonts.status}`;
        })
        .catch(() => 'contexto indisponível');
      const bl = await p
        .evaluate(() => ({ blobs: window.__blobs, erro: window.__cfgErro }))
        .catch(() => null);
      log(
        `   ...${i * 5}s ${st}` +
          (bl
            ? ` | blobs: ${bl.blobs?.join(', ') || 'nenhum'}${bl.erro ? ` | parse: ${bl.erro}` : ''}`
            : '')
      );
    }
  }
  r.ok(`${plat}: o botão "Baixar" entrega o config.json`, !!config);
  if (config) {
    writeFileSync(
      `${SAIDA}/config-${plat}.json`,
      JSON.stringify(config, null, 2)
    );
    const esperado =
      plataforma === 'VTEX' ? 'faststore' : plataforma.toLowerCase();
    r.ok(
      `${plat}: platform === "${esperado}"`,
      config.platform === esperado,
      config.platform
    );
    if (plataforma === 'VTEX') conferirFaststore(config, r);
    else conferirTrayWake(config, plataforma, r);
  }
  await p.close();
}
await b.close();

// Os dois PNGs do palco de export. Um palco em branco comprime para pouquíssimas
// cores, então a contagem é o que separa "gerou" de "gerou vazio".
for (const nome of ['layout-desktop.png', 'layout-mobile.png']) {
  const f = `${DL}/${nome}`;
  r.ok(
    `${nome} baixado`,
    existsSync(f) && statSync(f).size > 50_000,
    existsSync(f) ? `${Math.round(statSync(f).size / 1024)} kB` : 'ausente'
  );
}

process.exit(r.fechar() ? 0 : 1);
