import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/util.mjs';
const b = await puppeteer.launch({ executablePath: findChrome(), headless:'shell', defaultViewport:{width:1440,height:2400,deviceScaleFactor:1} });
const p = await b.newPage(); await p.setViewport({width:Number(process.argv[3]||1440),height:2400});
await p.goto(`http://127.0.0.1:3000/dev-fidelity?component=${process.argv[2]}`,{waitUntil:'domcontentloaded',timeout:120000});
await p.waitForSelector('[data-fidelity-stage][data-ready="1"]',{timeout:90000});
await new Promise(r=>setTimeout(r,2500));
const d = await p.evaluate(() => {
  const st=document.querySelector('[data-fidelity-stage]');
  const vis=[...st.querySelectorAll('[data-role]')].filter(n=>{const r=n.getBoundingClientRect();return r.width>0&&r.height>0;});
  const arv = (n, nivel) => {
    const r = n.getBoundingClientRect();
    const attrs = [...n.attributes].filter(a=>a.name.startsWith('data-')||a.name==='class'||a.name.startsWith('aria-')).map(a=>`${a.name}="${a.value.slice(0,40)}"`).join(' ');
    let out = `${'  '.repeat(nivel)}${n.tagName} ${attrs} [${Math.round(r.width)}x${Math.round(r.height)}]`;
    const txt=[...n.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent.trim()).join('').trim();
    if (txt) out += ` "${txt.slice(0,50)}"`;
    for (const c of n.children) out += '\n' + arv(c, nivel+1);
    return out;
  };
  return { papeis: vis.map(n=>`${n.getAttribute('data-role')} ${Math.round(n.getBoundingClientRect().width)}x${Math.round(n.getBoundingClientRect().height)}`),
           arvore: arv(st.querySelector('[data-role]').closest('section') || st, 0) };
});
console.log(d.papeis.join('\n')); console.log('--- ARVORE ---'); console.log(d.arvore);
await b.close();
