/**
 * Estágio 2-conteudo — o conteúdo que o CS sobe chega à tela?
 *
 * Semeia na aba seções com `content` (Nível 1, src/types/conteudo.ts) cheio de
 * MARCADORES únicos e confere, no canvas (o iframe do editor) e no /p:
 *
 *  - cada marcador aparece no DOM da seção certa (o template lê o campo);
 *  - o texto do mock que o conteúdo substituiu sumiu;
 *  - campo presente e vazio fica vazio; lista vem com o tamanho do conteúdo
 *    (um slide só esconde a navegação do banner);
 *  - imagem e link usam a URL do conteúdo, e `javascript:` não passa: some na
 *    hidratação (sessionStorage) e o link volta ao do mock;
 *  - o /p mostra o mesmo conteúdo, e o `?rev=1` devolve SÓ a revisão (o
 *    polling não baixa mais o snapshot inteiro).
 *
 * Cobre os componentes já migrados (o piloto da família 09); cresce com eles.
 */
import { BASE_URL, espera, itens, relatorio } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear } from './lib/editor.mjs';

const r = relatorio('2-conteudo · o conteúdo do CS no canvas e no /p');

const catalogo = itens();
const doCatalogo = componente => {
  const item = catalogo.find(i => i.component === componente);
  if (!item) throw new Error(`${componente} não está no catálogo`);
  return item;
};
let uid = 0;
const secao = (componente, content) => {
  const item = doCatalogo(componente);
  return {
    uid: `conteudo-${++uid}`,
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
  secao('Showcase09', {
    title: 'MARCADOR-SC-TITULO',
    viewAllLabel: 'MARCADOR-SC-VERTUDO',
  }),
  secao('ShelfBanner09', {
    banner: { title: 'MARCADOR-SB-BANNER', ctaLabel: 'MARCADOR-SB-CTA' },
  }),
  secao('Newsletter09', {
    eyebrow: '',
    title: 'MARCADOR-NL-TITULO',
    buttonLabel: 'MARCADOR-NL-BOTAO',
    privacyUrl: 'javascript:alert(1)',
  }),
];
const MARCADORES = [
  'MARCADOR-HD-AVISO',
  'MARCADOR-HD-MENU',
  'MARCADOR-HD-MARCA',
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
];

/** O que a tela mostra, lido de um documento (o do iframe ou o do /p). */
const ler = doc => {
  const naSecao = (selection, seletor) =>
    doc.querySelector(`[data-selection="${selection}"] ${seletor}`);
  const img = naSecao('banner-main', '[data-role="bm-image"] img');
  return {
    texto: doc.body.innerText,
    itensDaRegua: doc.querySelectorAll('[data-selection="ruler"] [data-role="rl-item"]').length,
    linkDaRegua: naSecao('ruler', '[data-role="rl-item"] a')?.getAttribute('href') ?? null,
    navDoBanner: !!naSecao('banner-main', '[data-role="bm-nav"]'),
    imagem: img
      ? { src: img.getAttribute('src'), alt: img.getAttribute('alt'), carregou: img.complete && img.naturalWidth > 0 }
      : null,
    ctaDoBanner: naSecao('banner-main', '[data-role="bm-cta"]')?.getAttribute('href') ?? null,
    chamadaDaNews: !!naSecao('newsletter', '[data-role="nl-eyebrow"]'),
    linkDaPrivacidade: naSecao('newsletter', 'p a')?.getAttribute('href') ?? null,
  };
};

const conferir = (onde, tela) => {
  const faltam = MARCADORES.filter(m => !tela.texto.includes(m));
  r.ok(`${onde}: os ${MARCADORES.length} marcadores aparecem`, faltam.length === 0, faltam.join(', '));
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
};

const browser = await abrirBrowser();
try {
  const { page, erros } = await novaAba(browser);
  await semear(page, { plataforma: 'VTEX', selecoes });

  const frame = await page
    .waitForFunction(
      n => {
        const doc = document.querySelector('iframe')?.contentDocument;
        return (doc?.querySelectorAll('[data-section-uid]').length ?? 0) >= n;
      },
      { timeout: 60000, polling: 250 },
      selecoes.filter(s => s.pagina !== 'common').length
    )
    .then(() => true)
    .catch(() => false);
  r.ok('o canvas montou as seções semeadas', frame);
  await espera(1500);

  const noCanvas = await page.evaluate(
    `(${ler.toString()})(document.querySelector('iframe').contentDocument)`
  );
  conferir('canvas', noCanvas);

  const guardado = await page.evaluate(() => JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]'));
  const news = guardado.find(s => s.uid === selecoes.at(-1).uid);
  r.ok(
    'a hidratação guarda o conteúdo e tira o javascript:',
    news?.content?.title === 'MARCADOR-NL-TITULO' && !('privacyUrl' in (news?.content ?? {})),
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
    let resp = await aba.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
    if (resp?.status() !== 200) {
      await espera(3000); // a rota do /p compila sob demanda no dev
      resp = await aba.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
    }
    r.ok(`o /p abre (HTTP ${resp?.status()})`, resp?.status() === 200, link);
    await espera(1500);
    conferir('/p', await aba.evaluate(`(${ler.toString()})(document)`));
    r.ok('o /p sem erro de página', errosDoP.length === 0, errosDoP.join(' | '));

    const id = /\/p\/([A-Za-z0-9]+)\//.exec(link)?.[1];
    const rev = await fetch(`${BASE_URL}/api/preview/${id}?rev=1`).then(x => x.json());
    r.ok(
      'o ?rev=1 devolve só a revisão',
      typeof rev.rev === 'number' && rev.rev > 0 && Object.keys(rev).length === 1,
      JSON.stringify(rev)
    );
  }

  r.ok('o editor sem erro de página', erros.length === 0, erros.join(' | '));
} finally {
  await browser.close();
}
process.exit(r.fechar() ? 0 : 1);
