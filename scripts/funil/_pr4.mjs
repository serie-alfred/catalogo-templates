import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/util.mjs';
const b = await puppeteer.launch({ executablePath: findChrome(), headless:'shell', defaultViewport:{width:1440,height:2400} });
const p = await b.newPage();
await p.goto('http://127.0.0.1:3000/dev-fidelity?component=TrustvoxReviews06',{waitUntil:'domcontentloaded',timeout:120000});
await p.waitForSelector('[data-fidelity-stage][data-ready="1"]',{timeout:90000});
await new Promise(r=>setTimeout(r,2500));
console.log(JSON.stringify(await p.evaluate(() => {
  const h2 = document.querySelector('[data-role="tvx-title"]');
  const w = h2.closest('[data-fs-button-wrapper]');
  const sp = h2.parentElement;
  const f = el => { const c = getComputedStyle(el); return {fs:c.fontSize, fw:c.fontWeight, lh:c.lineHeight, ff:c.fontFamily.slice(0,28), ls:c.letterSpacing, tt:c.textTransform, m:c.margin, disp:c.display, w:Math.round(el.getBoundingClientRect().width)}; };
  return { h2: f(h2), span: f(sp), wrapper: f(w) };
}), null, 1));
await b.close();
