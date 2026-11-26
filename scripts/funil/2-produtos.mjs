/**
 * Estágio 2-produtos — os produtos do cliente (`ConteudoLoja.produtos`) chegam a
 * toda lista e à PDP?
 *
 * Semeia a família 09 (vitrine, card, grade da categoria, PDP, descrição e
 * relacionados) com dois produtos marcados e confere:
 *
 *  - o canvas: a vitrine e o card de "Todas as páginas" mostram os produtos da
 *    loja, com a foto enviada, e não os de exemplo;
 *  - o /p: a grade da categoria lista os dois (contagem incluída); a PDP mostra o
 *    1º, com o preço "de" riscado, a parcela, a descrição em parágrafos (texto,
 *    nunca HTML) e a ficha dele; cada variação vira o seletor do TIPO (texto →
 *    botões, imagem → miniaturas com a imagem enviada), e os relacionados
 *    mostram os outros produtos, não o da PDP;
 *  - a aba Conteúdo do card leva aos Produtos do painel da loja.
 *
 * A normalização (preço "de", parcela, esgotado, tipo inferido, teto) é testada
 * sem navegador no `1-conteudo`.
 */
import { espera, itens, relatorio } from './lib/util.mjs';
import { abrirBrowser, clicarDeVerdade, novaAba, semear } from './lib/editor.mjs';

const r = relatorio('2-produtos · os produtos do cliente nas listas e na PDP');

const catalogo = itens();
let uid = 0;
const uidDe = {};
const secao = componente => {
  const item = catalogo.find(i => i.component === componente);
  if (!item) throw new Error(`${componente} não está no catálogo`);
  uidDe[componente] = `prod-${++uid}`;
  return { uid: uidDe[componente], id: item.id, layoutKey: item.layoutKey, pagina: item.pagina[0] };
};

const FOTO = '/images/templates/09.webp';
const GUIA = '/images/templates/10.webp';
const LOJA = {
  versao: 1,
  produtos: [
    {
      name: 'MARCADOR-PROD-UM',
      images: [{ productImage: FOTO }],
      price: 199.9,
      listPrice: 259.9,
      installments: 2,
      description: 'MARCADOR-PROD-DESC-1\n\nMARCADOR-PROD-DESC-2 <b>sem html</b>',
      specs: [{ name: 'MARCADOR-PROD-SPEC', value: 'Algodão' }],
      badge: 'MARCADOR-PROD-SELO',
      sizeGuide: GUIA,
      variants: [
        { name: 'MARCADOR-PROD-TAMANHO', tipo: 'texto', options: [{ label: 'P' }, { label: 'M' }, { label: 'G', soldOut: true }] },
        { name: 'MARCADOR-PROD-ESTAMPA', tipo: 'imagem', options: [{ label: 'Floral', swatchImage: FOTO }, { label: 'Liso', swatchImage: FOTO }] },
      ],
    },
    { name: 'MARCADOR-PROD-DOIS', price: 89 },
  ],
  // A categoria da página de categoria (nome, descrição, FAQ), do cadastro na plataforma.
  categoria: {
    name: 'MARCADOR-CAT-NOME',
    description: 'MARCADOR-CAT-P1\n\nMARCADOR-CAT-P2 <b>sem html</b>',
    faq: [{ question: 'MARCADOR-CAT-PERGUNTA', answer: 'MARCADOR-CAT-RESPOSTA' }],
  },
};

const selecoes = ['Header09', 'Showcase09', 'Spot09', 'CategoryTitle09', 'CategoryMain09', 'CategoryDescription09', 'ProductInfo09', 'ProductDescription09', 'ProductRelated09', 'Footer09'].map(secao);

const browser = await abrirBrowser();
try {
  const { page, erros } = await novaAba(browser);
  await semear(page, { plataforma: 'VTEX', selecoes, aba: { conteudoLoja: LOJA } });
  const textoDoCanvas = () => page.evaluate(() => document.querySelector('iframe')?.contentDocument?.body?.textContent ?? '');
  const naVitrine = await page
    .waitForFunction(
      () => document.querySelector('iframe')?.contentDocument?.querySelector('[data-selection="showcase"]')?.textContent.includes('MARCADOR-PROD-UM'),
      { timeout: 30000, polling: 250 }
    )
    .then(() => true)
    .catch(() => false);
  r.ok('canvas: a vitrine mostra os produtos da loja', naVitrine);
  const vitrine = await page.evaluate(() => {
    const doc = document.querySelector('iframe').contentDocument;
    const v = doc.querySelector('[data-selection="showcase"]');
    return {
      texto: v?.textContent ?? '',
      cards: v?.querySelectorAll('[data-role="sh-list"] > li').length ?? 0,
      foto: [...(v?.querySelectorAll('img') ?? [])].some(i => i.getAttribute('src') === '/images/templates/09.webp'),
    };
  });
  r.ok('canvas: a vitrine tem um card por produto da loja (2), nenhum de exemplo', vitrine.cards === 2 && !vitrine.texto.includes('Vestido Midi Linho'), `${vitrine.cards} cards`);
  r.ok('canvas: o card usa a foto enviada', vitrine.foto);
  r.ok(
    'canvas: o preço "de" da loja aparece no card',
    vitrine.texto.includes('259,90'),
    vitrine.texto.slice(0, 200)
  );

  // ── a aba Conteúdo do card leva aos Produtos ───────────────────────────
  await page.click('[data-aba-direita="conteudo"]');
  await page.evaluate(alvo => {
    document.querySelector('iframe').contentDocument.querySelector(`[data-section-uid="${alvo}"]`)?.click();
  }, uidDe.Showcase09);
  const temAviso = await page.waitForSelector('[data-produtos-da-loja] button', { timeout: 10000 }).then(() => true).catch(() => false);
  r.ok('aba Conteúdo: a vitrine diz que os produtos são os da loja', temAviso);
  if (temAviso) {
    await clicarDeVerdade(page, '[data-produtos-da-loja] button');
    r.ok(
      'aba Conteúdo: "Editar produtos" abre o painel da loja nos Produtos',
      await page.waitForSelector('[data-painel-loja] [data-slot-loja="produtos"]', { timeout: 8000 }).then(() => true).catch(() => false)
    );
  }

  // ── o /p: grade da categoria, PDP, descrição, relacionados ─────────────
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
  r.ok('o Pré-visualizar devolve um link /p/{id}', link, String(link));
  if (link) {
    const { page: aba, erros: errosDoP } = await novaAba(browser);
    const abrir = async url => {
      let resp = await aba.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      if (resp?.status() !== 200) {
        await espera(3000);
        resp = await aba.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      }
      await espera(1200);
      return resp?.status();
    };
    const base = link.replace(/\/[a-z]+$/, '');

    await abrir(`${base}/categoria`);
    const plp = await aba.evaluate(() => {
      const grade = document.querySelector('[data-selection="category-main"] [data-role="cm-grid"]');
      return {
        cards: grade?.children.length ?? 0,
        texto: grade?.textContent ?? '',
        contagem: document.querySelector('[data-selection="category-main"]')?.textContent.includes('2 ') ?? false,
      };
    });
    r.ok(
      '/p/categoria: a grade lista os 2 produtos da loja',
      plp.cards === 2 && plp.texto.includes('MARCADOR-PROD-UM') && plp.texto.includes('MARCADOR-PROD-DOIS'),
      `${plp.cards} cards`
    );
    const cat = await aba.evaluate(() => {
      const titulo = document.querySelector('[data-selection="category-title"]')?.textContent ?? '';
      const desc = document.querySelector('[data-role="cd-root"]');
      return {
        titulo,
        paragrafos: [...(desc?.querySelectorAll('[data-role="cd-text"] p') ?? [])].map(p => p.textContent.trim()),
        negrito: !!desc?.querySelector('[data-role="cd-text"] b'),
        tituloDaDescricao: desc?.querySelector('[data-role="cd-title"]')?.textContent ?? '',
        faq: desc?.querySelector('[data-role="cd-faq"]')?.textContent ?? '',
      };
    });
    r.ok('/p/categoria: o título é o nome da categoria da loja, com a contagem dos produtos (2)', cat.titulo.includes('MARCADOR-CAT-NOME') && cat.titulo.includes('(2)'), cat.titulo.slice(0, 80));
    r.ok(
      '/p/categoria: a descrição é a da categoria, em parágrafos de texto (sem HTML)',
      cat.paragrafos.length === 2 && cat.paragrafos[1].includes('<b>sem html</b>') && !cat.negrito && cat.tituloDaDescricao.includes('marcador-cat-nome'),
      JSON.stringify(cat.paragrafos)
    );
    r.ok('/p/categoria: o FAQ é o da categoria', cat.faq.includes('MARCADOR-CAT-PERGUNTA') && cat.faq.includes('MARCADOR-CAT-RESPOSTA'), cat.faq.slice(0, 80));

    await abrir(`${base}/produto`);
    const pdp = await aba.evaluate(() => {
      const raiz = document.querySelector('[data-role="pdp-root"]');
      const q = s => raiz?.querySelector(s);
      return {
        titulo: q('[data-role="pdp-title"]')?.textContent.trim() ?? '',
        de: q('[data-role="pdp-list-price"]')?.textContent ?? '',
        parcela: q('[data-role="pdp-installment"]')?.textContent ?? '',
        foto: q('[data-role="pdp-gallery"] img')?.getAttribute('src') ?? '',
        texto: [...(raiz?.querySelectorAll('[data-variacao="texto"] [data-role="pdp-size"], [data-variacao="texto"] [data-role="pdp-size-out"]') ?? [])].map(b => b.textContent.trim()),
        esgotadas: raiz?.querySelectorAll('[data-variacao="texto"] [data-role="pdp-size-out"]').length ?? 0,
        imagens: [...(raiz?.querySelectorAll('[data-variacao="imagem"] [data-role="pdp-swatch"] img') ?? [])].map(i => i.getAttribute('src')),
        cores: raiz?.querySelectorAll('[data-variacao="cor"]').length ?? 0,
        rotulos: raiz?.textContent ?? '',
      };
    });
    r.ok('/p/produto: a PDP mostra o 1º produto da loja', pdp.titulo === 'MARCADOR-PROD-UM', pdp.titulo);
    r.ok('/p/produto: preço "de" riscado e parcela da loja', pdp.de.includes('259,90') && pdp.parcela.includes('2x'), `${pdp.de} · ${pdp.parcela}`);
    r.ok('/p/produto: a galeria usa a foto enviada', pdp.foto === FOTO, pdp.foto);
    r.ok(
      '/p/produto: variação de texto vira botões (P, M e G esgotado)',
      pdp.texto.join() === 'P,M,G' && pdp.esgotadas === 1 && pdp.rotulos.includes('MARCADOR-PROD-TAMANHO'),
      pdp.texto.join()
    );
    r.ok(
      '/p/produto: variação de imagem vira miniaturas com a imagem enviada',
      pdp.imagens.length === 2 && pdp.imagens.every(src => src === FOTO) && pdp.rotulos.includes('MARCADOR-PROD-ESTAMPA'),
      JSON.stringify(pdp.imagens)
    );
    r.ok('/p/produto: produto sem variação de cor não desenha o seletor de cor', pdp.cores === 0);
    const tagEGuia = await aba.evaluate(async () => {
      const tag = document.querySelector('[data-role="pdp-eyebrow"]')?.textContent.trim() ?? '';
      const botao = document.querySelector('[data-role="pdp-size-guide"]');
      botao?.click();
      let img = null;
      for (let i = 0; i < 20 && !img; i++) {
        await new Promise(r => setTimeout(r, 100));
        img = document.querySelector('[data-selection="product-info"] [role="dialog"] img');
      }
      return { tag, guia: img?.getAttribute('src') ?? (botao ? 'o diálogo não abriu' : 'sem o botão do guia') };
    });
    r.ok('/p/produto: a tag é o selo do produto da loja', tagEGuia.tag === 'MARCADOR-PROD-SELO', tagEGuia.tag);
    r.ok('/p/produto: o guia de medidas abre a imagem do produto da loja', tagEGuia.guia === GUIA, tagEGuia.guia);

    const resto = await aba.evaluate(() => ({
      desc: [...document.querySelectorAll('[data-role="pd-description"] p')].map(p => p.textContent.trim()),
      negrito: !!document.querySelector('[data-role="pd-description"] b'),
      ficha: document.querySelector('[data-role="pd-specs"]')?.textContent ?? '',
      relacionados: document.querySelector('[data-role="rel-list"]')?.textContent ?? '',
    }));
    r.ok(
      '/p/produto: a descrição sai em parágrafos, como texto (sem HTML)',
      resto.desc.length === 2 && resto.desc[1].includes('<b>sem html</b>') && !resto.negrito,
      JSON.stringify(resto.desc)
    );
    r.ok('/p/produto: a ficha é a do produto da loja', resto.ficha.includes('MARCADOR-PROD-SPEC') && !resto.ficha.includes('linho'), resto.ficha.slice(0, 120));
    r.ok(
      '/p/produto: os relacionados mostram os outros produtos, não o da PDP',
      resto.relacionados.includes('MARCADOR-PROD-DOIS') && !resto.relacionados.includes('MARCADOR-PROD-UM'),
      resto.relacionados.slice(0, 120)
    );
    const HIDRATACAO = /hydrated but some attributes/;
    const outros = errosDoP.filter(e => !HIDRATACAO.test(e));
    r.ok('o /p sem erro de página (fora o aviso de hidratação conhecido)', outros.length === 0, outros.join(' | '));
    await aba.close();
  }

  await page.bringToFront();
  r.ok('o canvas não mostra o produto de exemplo do card', !(await textoDoCanvas()).includes('Vestido Midi Linho Areia'));
  r.ok('o editor sem erro de página', erros.length === 0, erros.join(' | '));
} finally {
  await browser.close();
}
process.exit(r.fechar() ? 0 : 1);
