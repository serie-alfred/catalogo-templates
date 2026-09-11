import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/util.mjs';
const b = await puppeteer.launch({ executablePath: findChrome(), headless:'shell', defaultViewport:{width:375,height:2400} });
const p = await b.newPage();
await p.goto('http://127.0.0.1:3000/dev-fidelity?component=ProductDetails03',{waitUntil:'domcontentloaded',timeout:120000});
await p.waitForSelector('[data-fidelity-stage][data-ready="1"]',{timeout:90000});
await new Promise(r=>setTimeout(r,2500));
console.log(JSON.stringify(await p.evaluate(() => {
  const f = (sel, props) => { const el=document.querySelector(sel); if(!el) return null; const c=getComputedStyle(el);
    const o={}; props.forEach(k=>o[k]=c[k]); const r=el.getBoundingClientRect(); o._box=`${Math.round(r.width)}x${Math.round(r.height)}`; return o; };
  const base=['display','gap','width','height','margin','padding','alignItems','fontSize','lineHeight','color'];
  const btn = document.querySelector('[data-role="pd03-add"]');
  const wrap = btn && btn.querySelector('[data-fs-button-wrapper]');
  const wc = wrap && getComputedStyle(wrap);
  const cont = document.querySelector('.container');
  const cc = cont && getComputedStyle(cont);
  return {
    btnWrapper: wc && {padding: wc.padding, border: wc.borderWidth, fontSize: wc.fontSize, lineHeight: wc.lineHeight, fontWeight: wc.fontWeight, box: `${Math.round(wrap.getBoundingClientRect().width)}x${Math.round(wrap.getBoundingClientRect().height)}`},
    container: cc && {padding: cc.padding, width: cc.width, maxWidth: cc.maxWidth, margin: cc.margin, display: cc.display, gap: cc.gap},
    galeria: f('[data-role="pd03-gallery"]', base),
    rating: f('[data-fs-rating]', base),
    item: f('[data-fs-rating-item]', base),
    icon: f('[data-fs-rating-item] svg', base),
    skuSel: f('[data-fs-sku-selector]', base),
    skuList: f('[data-fs-sku-selector-list]', base),
    skuOpt: f('[data-fs-sku-selector-option]', base),
    skuLink: f('[data-fs-sku-selector-option-link]', base),
    srOnly: f('[data-fs-sr-only]', base),
    label: f('[data-fs-label]', base),
    qty: f('[data-fs-quantity-selector]', base),
  };
}), null, 1));
await b.close();
