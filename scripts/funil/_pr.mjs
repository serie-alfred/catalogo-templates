import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/util.mjs';
const b = await puppeteer.launch({ executablePath: findChrome(), headless:'shell',
  defaultViewport:{width:1440,height:3000,deviceScaleFactor:1} });
const p = await b.newPage(); await p.setViewport({width:Number(process.argv[3]||1440),height:3000});
await p.goto(`http://localhost:3000/dev-fidelity?component=${process.argv[2]}`,{waitUntil:'domcontentloaded',timeout:120000});
await p.waitForSelector('[data-fidelity-stage][data-ready="1"]',{timeout:90000});
await new Promise(r=>setTimeout(r,2500));
const d = await p.evaluate(() => {
  const st=document.querySelector('[data-fidelity-stage]');
  const vis=[...st.querySelectorAll('[data-role]')].filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0;});
  return vis.map(n=>{
    const r=n.getBoundingClientRect();
    const own=[...n.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent.trim()).join(' ').trim();
    return `${n.getAttribute('data-role')} | ${n.tagName} | y=${Math.round(r.y)} h=${Math.round(r.height)} w=${Math.round(r.width)} | ${own.slice(0,70)}`;
  });
});
console.log(d.join('\n')); console.log('TOTAL', d.length);
await b.close();
