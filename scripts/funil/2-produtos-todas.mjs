/**
 * Estágio 2-produtos-todas — os produtos do cliente chegam às peças de produto
 * de TODAS as famílias?
 *
 * O `2-produtos` prova o caminho inteiro na família 09 (foto, preço riscado,
 * seletor por tipo, descrição sem HTML). Este passa por cada família (01–17)
 * e confere o essencial em cada peça que desenha produto: semeia as peças da
 * família com dois produtos marcados e olha
 *  - no canvas: vitrines (Showcase/ShelfBanner) com o 1º produto;
 *  - no /p/categoria: a grade com os dois;
 *  - no /p/produto: a PDP com o 1º e um seletor de variação (`data-variacao`),
 *    a descrição com o texto dele e os relacionados com o 2º (sem o da PDP).
 *
 * `FUNIL_PRODUTOS_SO=09,12` restringe às famílias listadas.
 */
import { espera, itens, relatorio } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear } from './lib/editor.mjs';

const r = relatorio('2-produtos-todas · os produtos do cliente em todas as famílias');

const LOJA = {
  versao: 1,
  produtos: [
    {
      name: 'MARCADOR-PROD-UM',
      price: 199.9,
      listPrice: 259.9,
      installments: 2,
      description: 'MARCADOR-PROD-DESC-1',
      specs: [{ name: 'MARCADOR-PROD-SPEC', value: 'Algodão' }],
      variants: [{ name: 'Tamanho', tipo: 'texto', options: [{ label: 'P' }, { label: 'M' }] }],
    },
    { name: 'MARCADOR-PROD-DOIS', price: 89 },
  ],
};

/** As peças que desenham produto, pela página em que aparecem. */
const PECAS = {
  home: /^(Showcase|ShelfBanner)\d+$/,
  category: /^CategoryMain\d+$/,
  product: /^(ProductInfo|ProductDescription|ProductRelated)\d+$/,
};

const catalogo = itens();
const so = (process.env.FUNIL_PRODUTOS_SO ?? '')
  .split(',')
  .map(s => s.trim().replace(/^0/, ''))
  .filter(Boolean);
const familias = Array.from({ length: 17 }, (_, i) => String(i + 1)).filter(f => !so.length || so.includes(f));

const abrirP = async (aba, url) => {
  let resp = await aba.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  if (resp?.status() !== 200) {
    await espera(3000); // a rota do /p compila sob demanda no dev
    resp = await aba.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  }
  await espera(1000);
  return resp?.status();
};

/** O texto de cada seção semeada (por uid) num documento. */
const textosPorUid = (doc, uids) =>
  Object.fromEntries(
    uids.map(uid => {
      const el = doc.querySelector(`[data-section-uid="${uid}"]`);
      return [uid, el ? { texto: el.textContent, variacoes: el.querySelectorAll('[data-variacao]').length } : null];
    })
  );
const LER = `(${textosPorUid.toString()})`;

const browser = await abrirBrowser();
try {
  for (const familia of familias) {
    const nn = familia.padStart(2, '0');
    const rotulo = `família ${nn}`;
    const pecas = catalogo.filter(i => {
      const m = /(\d+)$/.exec(i.component);
      return m && Number(m[1]) === Number(familia) && Object.values(PECAS).some(re => re.test(i.component));
    });
    if (!pecas.length) {
      console.log(`  ℹ️  ${rotulo}: sem peça de produto no catálogo`);
      continue;
    }
    const selecoes = pecas.map((item, i) => ({
      uid: `pt-${nn}-${i}`,
      id: item.id,
      layoutKey: item.layoutKey,
      pagina: item.pagina[0],
      componente: item.component,
    }));
    const { page, erros } = await novaAba(browser);
    await semear(page, {
      plataforma: 'VTEX',
      selecoes: selecoes.map(({ componente: _c, ...s }) => s),
      aba: { conteudoLoja: LOJA },
    });

    // ── home: as vitrines no canvas ────────────────────────────────────────
    const daHome = selecoes.filter(s => PECAS.home.test(s.componente));
    if (daHome.length) {
      await page
        .waitForFunction(
          uid => document.querySelector('iframe')?.contentDocument?.querySelector(`[data-section-uid="${uid}"]`)?.textContent.includes('MARCADOR-PROD-UM'),
          { timeout: 30000, polling: 250 },
          daHome[0].uid
        )
        .catch(() => {});
      const telas = await page.evaluate(`${LER}(document.querySelector('iframe').contentDocument, ${JSON.stringify(daHome.map(s => s.uid))})`);
      for (const s of daHome) {
        const t = telas[s.uid];
        r.ok(`${rotulo} · ${s.componente}: mostra os produtos da loja`, t && t.texto.includes('MARCADOR-PROD-UM') && t.texto.includes('MARCADOR-PROD-DOIS'), t ? t.texto.slice(0, 90) : 'seção não montou');
      }
    }

    // ── categoria e produto: pelo /p ───────────────────────────────────────
    const doP = selecoes.filter(s => !PECAS.home.test(s.componente));
    if (doP.length) {
      await page.keyboard.press('Escape');
      const clicou = await page.evaluate(() => {
        const b = [...document.querySelectorAll('button')].find(x => /pr[ée]-?visualizar/i.test(x.textContent ?? ''));
        b?.click();
        return !!b;
      });
      const link = clicou
        ? await page
            .waitForFunction(
              () => {
                for (const t of [...[...document.querySelectorAll('input')].map(i => i.value), document.body.innerText]) {
                  const m = /https?:\/\/[^\s"']*\/p\/[A-Za-z0-9_-]+\/[a-z]+/.exec(t ?? '');
                  if (m) return m[0];
                }
                return null;
              },
              { timeout: 20000, polling: 300 }
            )
            .then(h => h.jsonValue())
            .catch(() => null)
        : null;
      if (!r.ok(`${rotulo}: o Pré-visualizar devolve um link /p/{id}`, link, String(link))) {
        await page.close();
        continue;
      }
      const base = link.replace(/\/[a-z]+$/, '');
      const { page: aba, erros: errosDoP } = await novaAba(browser);
      for (const [pagina, slug] of [['category', 'categoria'], ['product', 'produto']]) {
        const daPagina = doP.filter(s => PECAS[pagina].test(s.componente));
        if (!daPagina.length) continue;
        await abrirP(aba, `${base}/${slug}`);
        const telas = await aba.evaluate(`${LER}(document, ${JSON.stringify(daPagina.map(s => s.uid))})`);
        for (const s of daPagina) {
          const t = telas[s.uid];
          const texto = t?.texto ?? '';
          const prova = t ? texto.slice(0, 90) : 'seção não montou';
          if (/^CategoryMain/.test(s.componente))
            r.ok(`${rotulo} · ${s.componente}: a grade lista os 2 produtos`, texto.includes('MARCADOR-PROD-UM') && texto.includes('MARCADOR-PROD-DOIS'), prova);
          else if (/^ProductInfo/.test(s.componente))
            r.ok(`${rotulo} · ${s.componente}: a PDP mostra o 1º produto, com o seletor da variação`, texto.includes('MARCADOR-PROD-UM') && t.variacoes > 0, `${t?.variacoes ?? 0} seletores · ${prova}`);
          else if (/^ProductDescription/.test(s.componente))
            // A descrição ou a ficha do produto: famílias com abas (a 10) abrem na
            // ficha, e a aba da descrição só monta quando é clicada.
            r.ok(
              `${rotulo} · ${s.componente}: mostra a descrição ou a ficha do produto`,
              (texto.includes('MARCADOR-PROD-DESC-1') || texto.includes('MARCADOR-PROD-SPEC')) && !texto.includes('100% linho'),
              prova
            );
          else if (/^ProductRelated/.test(s.componente))
            r.ok(`${rotulo} · ${s.componente}: os relacionados mostram o 2º, não o da PDP`, texto.includes('MARCADOR-PROD-DOIS') && !texto.includes('MARCADOR-PROD-UM'), prova);
        }
      }
      const HIDRATACAO = /hydrated but some attributes/;
      const outros = errosDoP.filter(e => !HIDRATACAO.test(e));
      r.ok(`${rotulo}: o /p sem erro de página`, outros.length === 0, outros.slice(0, 2).join(' | '));
      await aba.close();
    }
    r.ok(`${rotulo}: o editor sem erro de página`, erros.length === 0, erros.slice(0, 2).join(' | '));
    await page.close();
  }
} finally {
  await browser.close();
}
process.exit(r.fechar() ? 0 : 1);
