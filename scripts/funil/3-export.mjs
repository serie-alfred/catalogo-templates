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

for (const plat of ['Tray', 'Wake', 'VTEX']) {
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

  const seed = seedFor(plat);
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
    plat,
    JSON.stringify(seed),
    plat === 'Wake' ? 'TOKEN-DE-TESTE' : ''
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
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = bl => {
      if (bl && bl.type === 'application/json')
        bl.text().then(t => {
          try {
            window.__cfg = JSON.parse(t);
          } catch {}
        });
      return orig(bl);
    };
  });
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
      log(`   ...${i * 5}s ${st}`);
    }
  }
  r.ok(`${plat}: o botão "Baixar" entrega o config.json`, !!config);
  if (config) {
    writeFileSync(
      `${SAIDA}/config-${plat}.json`,
      JSON.stringify(config, null, 2)
    );
    const esperado = plat === 'VTEX' ? 'faststore' : plat.toLowerCase();
    r.ok(
      `${plat}: platform === "${esperado}"`,
      config.platform === esperado,
      config.platform
    );
    if (plat === 'VTEX') conferirFaststore(config, r);
    else conferirTrayWake(config, plat, r);
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
