import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/util.mjs';
const nome = process.argv[2];
const b = await puppeteer.launch({ executablePath: findChrome(), headless:'shell',
  defaultViewport:{width:1440,height:1600,deviceScaleFactor:1} });
const p = await b.newPage(); await p.setViewport({width:1440,height:1600});
await p.goto(`http://localhost:3000/dev-fidelity?component=${nome}`,{waitUntil:'domcontentloaded',timeout:120000});
await p.waitForSelector('[data-fidelity-stage][data-ready="1"]',{timeout:90000});
await new Promise(r=>setTimeout(r,1500));
console.dir(await p.evaluate(() => {
  const st = document.querySelector('[data-fidelity-stage]');
  return { nos: st.querySelectorAll('*').length, roles: st.querySelectorAll('[data-role]').length,
    h: Math.round(st.getBoundingClientRect().height),
    texto: (st.innerText||'').replace(/\s+/g,' ').trim().slice(0,160) };
}), {depth:null});
await b.close();
