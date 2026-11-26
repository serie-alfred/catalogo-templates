/**
 * Estágio 2-conteudo — o conteúdo que o CS sobe chega à tela?
 *
 * Semeia na aba seções com `content` (Nível 1, src/types/conteudo.ts) cheio de
 * MARCADORES únicos e confere, no canvas (o iframe do editor, home) e no /p
 * (home, categoria e produto):
 *
 *  - cada marcador aparece no DOM (o template lê o campo);
 *  - o texto do mock que o conteúdo substituiu sumiu;
 *  - campo presente e vazio fica vazio; lista vem com o tamanho do conteúdo
 *    (um slide só esconde a navegação do banner, um banner só esconde a pilha);
 *  - imagem e link usam a URL do conteúdo, e `javascript:` não passa: some na
 *    hidratação (sessionStorage) e o link volta ao do mock;
 *  - regras próprias de peça: data final passada zera o contador, forma de
 *    pagamento fora da lista some, `hiddenSpecs` esconde a especificação, e
 *    `pageSize: 0` não quebra a paginação das avaliações;
 *  - o `?rev=1` devolve SÓ a revisão (o polling não baixa o snapshot inteiro).
 *
 * Cobre a família 09 (migrada inteira); cresce com a migração.
 */
import path from 'node:path';

import { BASE_URL, RAIZ, espera, itens, relatorio } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear, trocarPagina } from './lib/editor.mjs';

const r = relatorio('2-conteudo · o conteúdo do CS no canvas e no /p');

const catalogo = itens();
const doCatalogo = componente => {
  const item = catalogo.find(i => i.component === componente);
  if (!item) throw new Error(`${componente} não está no catálogo`);
  return item;
};
let uid = 0;
/** uid de cada seção semeada, pelo componente (o teste do painel seleciona por ele). */
const uidDe = {};
const secao = (componente, content) => {
  const item = doCatalogo(componente);
  uidDe[componente] = `conteudo-${++uid}`;
  return {
    uid: uidDe[componente],
    id: item.id,
    layoutKey: item.layoutKey,
    pagina: item.pagina[0],
    content,
  };
};

const IMAGEM = '/images/templates/09.webp';
const selecoes = [
  secao('Header09', {
    topbarMessages: [{ text: 'MARCADOR-HD-AVISO' }],
    menu: [{ label: 'MARCADOR-HD-MENU', url: '/marcador' }],
    brandName: 'MARCADOR-HD-MARCA',
  }),
  secao('Footer09', {
    columns: [{ title: 'MARCADOR-FT-COLUNA', links: [{ label: 'MARCADOR-FT-LINK', url: '/x' }] }],
    payments: [{ method: 'pix' }, { method: 'bitcoin' }],
    legal: 'MARCADOR-FT-LEGAL',
    brandName: 'MARCADOR-FT-MARCA',
  }),
  secao('BannerMain09', {
    slides: [
      {
        eyebrow: 'MARCADOR-BM-CHAMADA',
        title: 'MARCADOR-BM-TITULO',
        titleEmphasis: 'MARCADOR-BM-ITALICO',
        text: 'MARCADOR-BM-TEXTO',
        primaryLabel: 'MARCADOR-BM-CTA',
        primaryUrl: 'https://loja.exemplo/colecao',
        imageDesktop: IMAGEM,
        imageAlt: 'MARCADOR-BM-ALT',
      },
    ],
  }),
  secao('Ruler09', {
    benefits: [
      {
        icon: 'truck',
        title: 'MARCADOR-RL-TITULO',
        text: 'MARCADOR-RL-TEXTO',
        url: 'https://loja.exemplo/frete',
      },
    ],
  }),
  secao('Showcase09', { title: 'MARCADOR-SC-TITULO', viewAllLabel: 'MARCADOR-SC-VERTUDO' }),
  secao('ShelfBanner09', { banner: { title: 'MARCADOR-SB-BANNER', ctaLabel: 'MARCADOR-SB-CTA' } }),
  secao('Newsletter09', {
    eyebrow: '',
    title: 'MARCADOR-NL-TITULO',
    buttonLabel: 'MARCADOR-NL-BOTAO',
    privacyUrl: 'javascript:alert(1)',
  }),
  secao('Brand09', { brands: [{ name: 'MARCADOR-BR-MARCA', url: '/marca' }] }),
  secao('Countdown09', { title: 'MARCADOR-CD-TITULO', endDate: '2000-01-01T00:00:00Z' }),
  secao('Editorial09', { posts: [{ title: 'MARCADOR-ED-POST', image: IMAGEM, url: '/post' }] }),
  secao('BannerGrid09', { banners: [{ title: 'MARCADOR-BG-BANNER', imageDesktop: IMAGEM }] }),
  secao('Categories09', { categories: [{ name: 'MARCADOR-CA-CATEGORIA', image: IMAGEM }] }),
  secao('ClientReview09', {
    reviews: [{ text: 'MARCADOR-CR-TEXTO', author: 'MARCADOR-CR-AUTORA', rating: 4 }],
  }),
  secao('HelpFloat09', { buttonLabel: 'MARCADOR-HF-BOTAO' }),
  secao('PopupNews09', { title: 'MARCADOR-PN-TITULO' }),
  secao('CategoryTitle09', { allLabel: 'MARCADOR-CTT-TODOS' }),
  // O "Filtrar" só existe no botão e no painel do mobile; a contagem é do desktop.
  secao('CategoryMain09', { countLabel: 'MARCADOR-CM-PRODUTOS' }),
  secao('CategoryDescription09', { faqTitle: 'MARCADOR-CDS-FAQ' }),
  secao('ProductInfo09', { buyLabel: 'MARCADOR-PI-COMPRAR' }),
  secao('ProductDescription09', { specsLabel: 'MARCADOR-PD-SPECS', hiddenSpecs: 'composicao' }),
  secao('ProductReviews09', { title: 'MARCADOR-PR-TITULO', pageSize: 0 }),
];

/** Marcadores por página do /p; os de `common` (header, rodapé) valem nas três. */
const COMUNS = ['MARCADOR-HD-AVISO', 'MARCADOR-HD-MENU', 'MARCADOR-HD-MARCA', 'MARCADOR-FT-COLUNA', 'MARCADOR-FT-LINK', 'MARCADOR-FT-LEGAL', 'MARCADOR-FT-MARCA'];
const MARCADORES = {
  home: [
    ...COMUNS,
    'MARCADOR-BM-CHAMADA',
    'MARCADOR-BM-TITULO',
    'MARCADOR-BM-ITALICO',
    'MARCADOR-BM-TEXTO',
    'MARCADOR-BM-CTA',
    'MARCADOR-RL-TITULO',
    'MARCADOR-RL-TEXTO',
    'MARCADOR-SC-TITULO',
    'MARCADOR-SC-VERTUDO',
    'MARCADOR-SB-BANNER',
    'MARCADOR-SB-CTA',
    'MARCADOR-NL-TITULO',
    'MARCADOR-NL-BOTAO',
    'MARCADOR-BR-MARCA',
    'MARCADOR-CD-TITULO',
    'MARCADOR-ED-POST',
    'MARCADOR-BG-BANNER',
    'MARCADOR-CA-CATEGORIA',
    'MARCADOR-CR-TEXTO',
    'MARCADOR-CR-AUTORA',
    'MARCADOR-HF-BOTAO',
    'MARCADOR-PN-TITULO',
  ],
  categoria: [...COMUNS, 'MARCADOR-CTT-TODOS', 'MARCADOR-CM-PRODUTOS', 'MARCADOR-CDS-FAQ'],
  produto: [...COMUNS, 'MARCADOR-PI-COMPRAR', 'MARCADOR-PD-SPECS', 'MARCADOR-PR-TITULO'],
};

/** O que a tela mostra, lido de um documento (o do iframe ou o do /p). */
const ler = doc => {
  const naSecao = (selection, seletor) =>
    doc.querySelector(`[data-selection="${selection}"] ${seletor}`);
  const todas = (selection, seletor) =>
    doc.querySelectorAll(`[data-selection="${selection}"] ${seletor}`);
  const imagem = img =>
    img
      ? { src: img.getAttribute('src'), alt: img.getAttribute('alt'), carregou: img.complete && img.naturalWidth > 0 }
      : null;
  return {
    texto: doc.body.innerText,
    itensDaRegua: todas('ruler', '[data-role="rl-item"]').length,
    linkDaRegua: naSecao('ruler', '[data-role="rl-item"] a')?.getAttribute('href') ?? null,
    navDoBanner: !!naSecao('banner-main', '[data-role="bm-nav"]'),
    imagem: imagem(naSecao('banner-main', '[data-role="bm-image"] img')),
    ctaDoBanner: naSecao('banner-main', '[data-role="bm-cta"]')?.getAttribute('href') ?? null,
    chamadaDaNews: !!naSecao('newsletter', '[data-role="nl-eyebrow"]'),
    linkDaPrivacidade: naSecao('newsletter', 'p a')?.getAttribute('href') ?? null,
    contador: [...todas('countdown', '[data-role="cd-timer"] [aria-hidden="true"] span:first-child')].map(s => s.textContent),
    postsDoEditorial: todas('editorial', '[data-role="ed-post"]').length,
    imagemDoPost: imagem(naSecao('editorial', '[data-role="ed-post"] img')),
    bannersDaGrade: todas('banner-grid', '[data-role="bg-banner"]').length,
    imagemDaCategoria: imagem(naSecao('categories', '[data-role="ct-item"] img')),
    pagamentos: [...doc.querySelectorAll('[data-role="ft-payments"] li')].map(li => li.textContent.trim()),
  };
};

const conferirHome = (onde, tela) => {
  const faltam = MARCADORES.home.filter(m => !tela.texto.includes(m));
  r.ok(`${onde}: os ${MARCADORES.home.length} marcadores da home aparecem`, faltam.length === 0, faltam.join(', '));
  r.ok(
    `${onde}: o texto do mock substituído sumiu`,
    !tela.texto.includes('Troca fácil em 30 dias') && !tela.texto.includes('Mais desejados'),
    'o mock ainda aparece onde o conteúdo devia valer'
  );
  r.ok(`${onde}: a régua tem o tamanho da lista do conteúdo`, tela.itensDaRegua === 1, `${tela.itensDaRegua} itens`);
  r.ok(`${onde}: o link do item usa a URL do conteúdo`, tela.linkDaRegua === 'https://loja.exemplo/frete', tela.linkDaRegua);
  r.ok(`${onde}: um slide só esconde a navegação do banner`, !tela.navDoBanner);
  r.ok(
    `${onde}: a imagem do slide é a do conteúdo e carrega`,
    tela.imagem?.src === IMAGEM && tela.imagem?.alt === 'MARCADOR-BM-ALT' && tela.imagem?.carregou,
    JSON.stringify(tela.imagem)
  );
  r.ok(`${onde}: o CTA do slide leva à URL do conteúdo`, tela.ctaDoBanner === 'https://loja.exemplo/colecao', tela.ctaDoBanner);
  r.ok(`${onde}: campo vazio fica vazio (a chamada da newsletter some)`, !tela.chamadaDaNews);
  r.ok(
    `${onde}: javascript: não vira href (o link volta ao do mock)`,
    tela.linkDaPrivacidade === '/politica-de-privacidade',
    tela.linkDaPrivacidade
  );
  r.ok(
    `${onde}: data final passada zera o contador`,
    tela.contador.length === 4 && tela.contador.every(v => v === '00'),
    JSON.stringify(tela.contador)
  );
  // A miniatura é `loading="lazy"` e fica fora da janela do iframe: confere a URL,
  // não o carregamento (o do banner principal, que é eager, prova que carrega).
  r.ok(
    `${onde}: editorial com um post e a imagem do conteúdo`,
    tela.postsDoEditorial === 1 && tela.imagemDoPost?.src === IMAGEM,
    `${tela.postsDoEditorial} posts · ${JSON.stringify(tela.imagemDoPost)}`
  );
  r.ok(`${onde}: grade com um banner só (sem a pilha)`, tela.bannersDaGrade === 1, `${tela.bannersDaGrade} banners`);
  r.ok(
    `${onde}: a imagem da categoria é a do conteúdo`,
    tela.imagemDaCategoria?.src === IMAGEM && tela.imagemDaCategoria?.alt === 'MARCADOR-CA-CATEGORIA',
    JSON.stringify(tela.imagemDaCategoria)
  );
  r.ok(
    `${onde}: forma de pagamento fora da lista some`,
    JSON.stringify(tela.pagamentos) === '["Pix"]',
    JSON.stringify(tela.pagamentos)
  );
};

const browser = await abrirBrowser();
try {
  const { page, erros } = await novaAba(browser);
  await semear(page, { plataforma: 'VTEX', selecoes });

  const naHome = selecoes.filter(s => s.pagina === 'home').length;
  const frame = await page
    .waitForFunction(
      n => {
        const doc = document.querySelector('iframe')?.contentDocument;
        return (doc?.querySelectorAll('[data-section-uid]').length ?? 0) >= n;
      },
      { timeout: 60000, polling: 250 },
      naHome
    )
    .then(() => true)
    .catch(() => false);
  r.ok('o canvas montou as seções semeadas da home', frame);
  await espera(1500);

  conferirHome('canvas', await page.evaluate(`(${ler.toString()})(document.querySelector('iframe').contentDocument)`));

  const guardado = await page.evaluate(() => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]'));
  const news = guardado.find(s => s.content?.title === 'MARCADOR-NL-TITULO');
  r.ok(
    'a hidratação guarda o conteúdo e tira o javascript:',
    news && !('privacyUrl' in news.content),
    JSON.stringify(news?.content)
  );

  // ── o /p ────────────────────────────────────────────────────────────────
  const clicou = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x =>
      /pr[ée]-?visualizar/i.test(x.textContent ?? '')
    );
    b?.click();
    return !!b;
  });
  const link = clicou
    ? await page
        .waitForFunction(
          () => {
            const alvos = [...[...document.querySelectorAll('input')].map(i => i.value), document.body.innerText];
            for (const t of alvos) {
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
        await espera(3000); // a rota do /p compila sob demanda no dev
        resp = await aba.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      }
      await espera(1200);
      return resp?.status();
    };
    const base = link.replace(/\/[a-z]+$/, '');

    r.ok('o /p/home abre', (await abrir(`${base}/home`)) === 200, `${base}/home`);
    conferirHome('/p/home', await aba.evaluate(`(${ler.toString()})(document)`));

    for (const pagina of ['categoria', 'produto']) {
      const status = await abrir(`${base}/${pagina}`);
      const texto = await aba.evaluate(() => document.body.innerText);
      const faltam = MARCADORES[pagina].filter(m => !texto.includes(m));
      r.ok(`/p/${pagina}: abre e os ${MARCADORES[pagina].length} marcadores aparecem`, status === 200 && faltam.length === 0, `HTTP ${status} · ${faltam.join(', ')}`);
      if (pagina === 'produto') {
        r.ok('/p/produto: hiddenSpecs esconde "Composição"', !texto.includes('Composição') && texto.includes('Forro'));
        const paginas = await aba.evaluate(() => document.body.innerText.match(/Infinity|NaN/g)?.length ?? 0);
        r.ok('/p/produto: pageSize 0 não quebra a paginação', paginas === 0, `${paginas} ocorrências de Infinity/NaN`);
      }
    }
    // Aviso de hidratação por `useId` no /p (CategoryDescription09, ProductInfo09):
    // existe na `main` SEM conteúdo nenhum, intermitente (3/6 cargas da categoria em
    // 24/11/2026). Fica visível aqui, mas não reprova este estágio.
    const HIDRATACAO = /hydrated but some attributes/;
    const conhecidos = errosDoP.filter(e => HIDRATACAO.test(e));
    if (conhecidos.length)
      console.log(`  ⏳ ${conhecidos.length} aviso(s) de hidratação de useId no /p — pré-existente na main, fora deste escopo`);
    const outros = errosDoP.filter(e => !HIDRATACAO.test(e));
    r.ok('o /p sem erro de página (fora o aviso de hidratação conhecido)', outros.length === 0, outros.join(' | '));

    const id = /\/p\/([A-Za-z0-9]+)\//.exec(link)?.[1];
    const rev = await fetch(`${BASE_URL}/api/preview/${id}?rev=1`).then(x => x.json());
    r.ok(
      'o ?rev=1 devolve só a revisão',
      typeof rev.rev === 'number' && rev.rev > 0 && Object.keys(rev).length === 1,
      JSON.stringify(rev)
    );
  }

  // ── a aba Conteúdo do painel da direita ─────────────────────────────────
  // A aba do /p ficou na frente: em segundo plano o headless não pinta quadros,
  // e o `click` do puppeteer (que espera um quadro para rolar até o alvo) trava.
  await page.bringToFront();
  const textoDoCanvas = () =>
    page.evaluate(() => document.querySelector('iframe').contentDocument.body.innerText);
  const esperarNoCanvas = (fn, ...args) =>
    page
      .waitForFunction(fn, { timeout: 8000, polling: 150 }, ...args)
      .then(() => true)
      .catch(() => false);
  const selecionar = async componente => {
    const frame = await (await page.$('iframe')).contentFrame();
    await frame.click(`[data-section-uid="${uidDe[componente]}"]`);
    await espera(400);
  };

  // O balão do link do Pré-visualizar abre sobre o topo da coluna da direita, onde
  // ficam as abas: fecha (Esc e clique no rail) antes de clicar.
  await page.keyboard.press('Escape');
  await page.mouse.click(20, 400);
  await page.click('[data-aba-direita="conteudo"]');
  r.ok(
    'painel: a aba Conteúdo fica selecionada',
    await page
      .waitForSelector('[data-aba-direita="conteudo"][aria-selected="true"]', { timeout: 5000 })
      .then(() => true)
      .catch(() => false)
  );
  // O pop-up da 09 nasce aberto e cobre o canvas inteiro: o clique na vitrine
  // cairia nele. O "Agora não" fecha (o handler do template roda no canvas).
  const canvas = await (await page.$('iframe')).contentFrame();
  await canvas.click('[data-role="pn-dismiss"]').catch(() => {});
  await espera(300);
  await selecionar('Showcase09');
  const campoTitulo = '[data-campo-conteudo="title"] input';
  const temCampo = await page.waitForSelector(campoTitulo, { timeout: 15000 }).then(() => true).catch(() => false);
  const oQuePainelMostra = () =>
    page
      .$eval('#painel-direito-corpo', el => el.innerText.replace(/\s+/g, ' ').slice(0, 160))
      .catch(e => `sem painel (${e.message})`);
  r.ok('painel: a aba Conteúdo mostra os campos da vitrine selecionada', temCampo, temCampo ? '' : await oQuePainelMostra());
  if (temCampo) {
    r.ok(
      'painel: o campo parte do valor da seção',
      (await page.$eval(campoTitulo, el => el.value)) === 'MARCADOR-SC-TITULO'
    );
    await page.click(campoTitulo, { clickCount: 3 });
    await page.type(campoTitulo, 'MARCADOR-PAINEL-TITULO');
    r.ok(
      'painel: digitar no campo muda o canvas',
      await esperarNoCanvas(() =>
        document.querySelector('iframe').contentDocument.body.innerText.includes('MARCADOR-PAINEL-TITULO')
      )
    );
    await page.click('[data-campo-conteudo="title"] button');
    r.ok(
      'painel: "Voltar ao padrão" devolve o título do mock',
      await esperarNoCanvas(() => {
        const t = document.querySelector('iframe').contentDocument.body.innerText;
        return t.includes('Mais') && !t.includes('MARCADOR-PAINEL-TITULO') && !t.includes('MARCADOR-SC-TITULO');
      })
    );
  }

  await selecionar('Ruler09');
  const adicionar = '[data-campo-conteudo="benefits"] button[class*="adicionar"]';
  const temLista = await page.waitForSelector(adicionar, { timeout: 8000 }).then(() => true).catch(() => false);
  r.ok('painel: a régua mostra a lista de benefícios', temLista);
  if (temLista) {
    const itens = () =>
      page.evaluate(
        () => document.querySelector('iframe').contentDocument.querySelectorAll('[data-selection="ruler"] [data-role="rl-item"]').length
      );
    await page.click(adicionar);
    await page.type('[data-campo-conteudo="benefits"] input[id$="-title"]', 'MARCADOR-PAINEL-BENEFICIO');
    r.ok(
      'painel: adicionar um item na lista aparece no canvas',
      await esperarNoCanvas(() =>
        document.querySelector('iframe').contentDocument.body.innerText.includes('MARCADOR-PAINEL-BENEFICIO')
      ),
      `${await itens()} itens`
    );
    // Desfazer: o foco sai do campo (fecha a entrada do histórico) e Ctrl+Z volta um passo.
    await page.click('[data-aba-direita="conteudo"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('z');
    await page.keyboard.up('Control');
    r.ok(
      'painel: Ctrl+Z desfaz o item adicionado',
      await esperarNoCanvas(
        () => !document.querySelector('iframe').contentDocument.body.innerText.includes('MARCADOR-PAINEL-BENEFICIO')
      ),
      (await textoDoCanvas()).includes('MARCADOR-PAINEL-BENEFICIO') ? 'o item continua no canvas' : ''
    );
  }

  // ── upload de imagem (dev: .preview-store/midias, servida por /api/midias) ─
  await selecionar('Countdown09');
  const arquivoDaImagem = '[data-campo-conteudo="imageDesktop"] input[data-enviar-imagem]';
  const temUpload = await page.waitForSelector(arquivoDaImagem, { timeout: 8000 }).then(() => true).catch(() => false);
  r.ok('upload: o campo de imagem do contador tem o envio de arquivo', temUpload);
  if (temUpload) {
    await (await page.$(arquivoDaImagem)).uploadFile(path.join(RAIZ, 'public/images/templates/09.webp'));
    const url = await page
      .waitForFunction(
        () => {
          const v = document.querySelector('[data-campo-conteudo="imageDesktop"] input[type="text"]')?.value ?? '';
          return /^\/api\/midias\/[0-9a-f-]{36}\.webp$/.test(v) ? v : null;
        },
        { timeout: 20000, polling: 200 }
      )
      .then(h => h.jsonValue())
      .catch(() => null);
    r.ok('upload: o campo recebe a URL da imagem enviada (WebP)', url, String(url));
    if (url) {
      // Pelo Node primeiro: prova o CORS e, num dev recém-subido, compila a rota
      // /api/midias/[arquivo] (sob demanda, mais de 8 s nesta máquina) antes de
      // o canvas pedir a imagem — senão a espera abaixo estoura no aquecimento.
      const resposta = await fetch(`${BASE_URL}${url}`);
      // A imagem do contador é `lazy`: rola a seção para a janela do iframe.
      await page.evaluate(alvo => {
        document
          .querySelector('iframe')
          .contentDocument.querySelector(`[data-section-uid="${alvo}"]`)
          ?.scrollIntoView({ block: 'center' });
      }, uidDe.Countdown09);
      r.ok(
        'upload: a imagem enviada aparece e carrega no canvas',
        await esperarNoCanvas(alvo => {
          const img = document
            .querySelector('iframe')
            .contentDocument.querySelector('[data-selection="countdown"] [data-role="cd-image"] img');
          return img?.getAttribute('src') === alvo && img.complete && img.naturalWidth > 0;
        }, url)
      );
      r.ok(
        'upload: /api/midias serve image/webp, público, com CORS',
        resposta.status === 200 &&
          resposta.headers.get('content-type') === 'image/webp' &&
          resposta.headers.get('access-control-allow-origin') === '*',
        `${resposta.status} ${resposta.headers.get('content-type')}`
      );
    }
  }
  // Pelo Node, não pela página: o 415 esperado viraria erro de console do editor.
  const formSvg = new FormData();
  formSvg.append(
    'arquivo',
    new Blob(['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'], { type: 'image/svg+xml' }),
    'x.svg'
  );
  const svg = (await fetch(`${BASE_URL}/gerador/api/midias`, { method: 'POST', body: formSvg })).status;
  r.ok('upload: o servidor recusa SVG (confere os bytes, não o tipo declarado)', svg === 415, `HTTP ${svg}`);

  // ── Só o que o lojista da plataforma muda (src/utils/editaveis.ts) ──────
  // A PDP da Wake não tem Design Studio: o texto do CS no botão de comprar não
  // chega à loja, então o canvas desenha o do tema e o painel não oferece o campo.
  const wake = await novaAba(browser);
  const pdpWake = secao('ProductInfo09', { buyLabel: 'MARCADOR-WAKE-COMPRAR' });
  await semear(wake.page, { plataforma: 'Wake 2.0', selecoes: [pdpWake] });
  await trocarPagina(wake.page, 'product');
  const botaoNaWake = await wake.page
    .waitForFunction(
      u => document.querySelector('iframe')?.contentDocument?.querySelector(`[data-section-uid="${u}"]`)?.innerText,
      { timeout: 60000, polling: 250 },
      pdpWake.uid
    )
    .then(h => h.jsonValue())
    .catch(() => '');
  r.ok(
    'Wake: a PDP desenha o botão fixo do tema, não o texto do CS',
    botaoNaWake && !botaoNaWake.includes('MARCADOR-WAKE-COMPRAR') && /Adicionar à sacola/i.test(botaoNaWake),
    botaoNaWake ? botaoNaWake.slice(0, 120) : 'a seção não montou'
  );
  await wake.page.click('[data-aba-direita="conteudo"]');
  await (await (await wake.page.$('iframe')).contentFrame()).click(`[data-section-uid="${pdpWake.uid}"]`);
  const painelNaWake = await wake.page
    .waitForSelector('[data-sem-editaveis="Wake 2.0"]', { timeout: 15000 })
    .then(() => wake.page.$$eval('[data-campo-conteudo]', l => l.length))
    .catch(() => -1);
  r.ok(
    'Wake: o painel da PDP não oferece texto e diz que ele fica no tema',
    painelNaWake === 0,
    painelNaWake < 0 ? 'sem o aviso [data-sem-editaveis]' : `${painelNaWake} campos`
  );
  erros.push(...wake.erros);

  r.ok('o editor sem erro de página', erros.length === 0, erros.join(' | '));
} finally {
  await browser.close();
}
process.exit(r.fechar() ? 0 : 1);
