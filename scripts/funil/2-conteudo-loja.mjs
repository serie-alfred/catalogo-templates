/**
 * Estágio 2-conteudo-loja — o conteúdo da LOJA (Nível 2) chega a todas as seções?
 *
 * Semeia a aba com seções da família 09 SEM conteúdo próprio e com um
 * `conteudoLoja` cheio de marcadores (src/types/conteudo.ts), e confere:
 *
 *  - no canvas, cada marcador aparece na peça que o vínculo diz (nome e menu no
 *    header, colunas, redes, pagamentos e linha legal no rodapé, banner,
 *    categorias, o WhatsApp da ajuda flutuante virando wa.me);
 *  - "Por template" (09 → 12) troca todas as peças e o conteúdo da loja fica: o
 *    menu, o rodapé e o banner reaparecem no formato das peças 12 — é a promessa
 *    da fase 2 ("trocar de template não perde o menu");
 *  - o painel "Conteúdo da loja": digitar muda o canvas, Ctrl+Z desfaz, "Limpar"
 *    devolve o mock, "Começar com o do Header…" copia o que a página mostra;
 *  - a aba Conteúdo de uma seção diz que o campo vem da loja;
 *  - o /p mostra a loja (o snapshot leva `conteudoLoja`) e recarregar a aba a mantém.
 *
 * As regras de cada vínculo (formato, campos próprios, linha legal) são do
 * `1-conteudo`, sem navegador; aqui é o caminho de ponta a ponta.
 */
import { espera, itens, relatorio } from './lib/util.mjs';
import { abrirBrowser, clicarDeVerdade, irParaRail, novaAba, semear } from './lib/editor.mjs';

const r = relatorio('2-conteudo-loja · o conteúdo da loja em todas as seções');

const catalogo = itens();
let uid = 0;
const secao = componente => {
  const item = catalogo.find(i => i.component === componente);
  if (!item) throw new Error(`${componente} não está no catálogo`);
  return { uid: `loja-${++uid}`, id: item.id, layoutKey: item.layoutKey, pagina: item.pagina[0] };
};

const IMAGEM = '/images/templates/09.webp';
const ZAP = 'https://wa.me/5511988887777';
const LOJA = {
  versao: 1,
  nomeDaLoja: 'MARCADOR-LJ-NOME',
  menuPrincipal: [
    { label: 'MARCADOR-LJ-MENU', url: '/m', children: [{ label: 'MARCADOR-LJ-SUB', url: '/s' }] },
  ],
  menuRodape: [{ title: 'MARCADOR-LJ-COLUNA', links: [{ label: 'MARCADOR-LJ-LINK', url: '/l' }] }],
  contato: {
    whatsapp: '(11) 98888-7777',
    telefone: '(11) 3333-4444',
    email: 'marcador@loja.exemplo',
    horario: 'MARCADOR-LJ-HORARIO',
  },
  redes: [{ network: 'instagram', url: 'https://instagram.com/marcador' }],
  dadosLegais: { razaoSocial: 'MARCADOR-LJ-RAZAO', cnpj: '00.000.000/0001-91' },
  pagamentos: [{ method: 'pix' }],
  banners: [{ title: 'MARCADOR-LJ-BANNER', ctaLabel: 'MARCADOR-LJ-CTA', ctaUrl: '/verao', imageDesktop: IMAGEM }],
  categorias: [{ name: 'MARCADOR-LJ-CATEGORIA', url: '/cat', image: IMAGEM }],
};

const selecoes = ['Header09', 'Footer09', 'BannerMain09', 'Categories09', 'HelpFloat09'].map(secao);

/**
 * O que o canvas (ou o /p) mostra. `textContent`, não `innerText`: o submenu e o
 * balão da ajuda ficam escondidos até o hover/clique, e o texto escondido conta.
 */
const ler = doc => ({
  texto: doc.body.textContent,
  zap: !!doc.querySelector(`a[href="https://wa.me/5511988887777"]`),
  instagram: !!doc.querySelector('[data-selection="footer"] a[href="https://instagram.com/marcador"]'),
  pagamentos: [...doc.querySelectorAll('[data-role="ft-payments"] li')].map(li => li.textContent.trim()),
});
const LER = `(${ler.toString()})`;
const noCanvas = page => page.evaluate(`${LER}(document.querySelector('iframe').contentDocument)`);
const faltando = (tela, marcadores) => marcadores.filter(m => !tela.texto.includes(m));

const browser = await abrirBrowser();
try {
  const { page, erros } = await novaAba(browser);
  await semear(page, { plataforma: 'VTEX', selecoes, aba: { conteudoLoja: LOJA } });
  const esperarNoCanvas = (fn, ...args) =>
    page
      .waitForFunction(fn, { timeout: 15000, polling: 200 }, ...args)
      .then(() => true)
      .catch(() => false);
  const canvasTem = marcador =>
    esperarNoCanvas(
      m => document.querySelector('iframe')?.contentDocument?.body?.textContent.includes(m),
      marcador
    );

  // ── 1. família 09: cada slot na peça certa ──────────────────────────────
  r.ok('canvas: o conteúdo da loja chegou (menu no header)', await canvasTem('MARCADOR-LJ-MENU'));
  let tela = await noCanvas(page);
  const DA_09 = [
    'MARCADOR-LJ-NOME',
    'MARCADOR-LJ-MENU',
    'MARCADOR-LJ-SUB',
    'MARCADOR-LJ-COLUNA',
    'MARCADOR-LJ-LINK',
    'MARCADOR-LJ-HORARIO',
    'MARCADOR-LJ-RAZAO',
    'MARCADOR-LJ-BANNER',
    'MARCADOR-LJ-CTA',
    'MARCADOR-LJ-CATEGORIA',
  ];
  r.ok(`09: os ${DA_09.length} marcadores da loja aparecem`, faltando(tela, DA_09).length === 0, faltando(tela, DA_09).join(', '));
  r.ok('09: o mock que a loja substituiu sumiu (coluna do rodapé)', !tela.texto.includes('Trabalhe conosco'));
  r.ok('09: o WhatsApp da ajuda flutuante abre o número da loja', tela.zap);
  r.ok('09: a rede social do rodapé é a da loja', tela.instagram);
  r.ok('09: só as formas de pagamento da loja', JSON.stringify(tela.pagamentos) === '["Pix"]', JSON.stringify(tela.pagamentos));
  const guardado = await page.evaluate(() => JSON.parse(sessionStorage.getItem('conteudoLoja') ?? 'null'));
  r.ok('a hidratação guarda o conteúdo da loja na aba', guardado?.nomeDaLoja === 'MARCADOR-LJ-NOME' && guardado.versao === 1);

  // ── 2. "Por template" 09 → 12: as peças trocam, a loja fica ─────────────
  await irParaRail(page, 'Por template');
  await page.waitForSelector('[data-templates-lista] [data-template="12"]', { timeout: 30000 });
  await clicarDeVerdade(page, '[data-templates-lista] [data-template="12"]');
  const trocou = await esperarNoCanvas(
    () => !!document.querySelector('iframe')?.contentDocument?.querySelector('[data-section-uid]') &&
      !JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').some(s => s.uid?.startsWith('loja-'))
  );
  r.ok('Por template: a 12 substituiu as peças da 09', trocou);
  await canvasTem('MARCADOR-LJ-MENU');
  await espera(800);
  tela = await noCanvas(page);
  const DA_12 = ['MARCADOR-LJ-NOME', 'MARCADOR-LJ-MENU', 'MARCADOR-LJ-COLUNA', 'MARCADOR-LJ-RAZAO', 'MARCADOR-LJ-BANNER'];
  r.ok(
    `12: o conteúdo da loja continua nas peças novas (${DA_12.length} marcadores)`,
    faltando(tela, DA_12).length === 0,
    faltando(tela, DA_12).join(', ')
  );
  r.ok('12: o WhatsApp do rodapé (campo próprio da 12) é o da loja', tela.zap);
  r.ok('12: só as formas de pagamento da loja', JSON.stringify(tela.pagamentos) === '["Pix"]', JSON.stringify(tela.pagamentos));
  r.ok(
    'Por template não mexe no conteúdo da loja',
    (await page.evaluate(() => JSON.parse(sessionStorage.getItem('conteudoLoja') ?? 'null')?.nomeDaLoja)) === 'MARCADOR-LJ-NOME'
  );

  // ── 3. o painel "Conteúdo da loja" ──────────────────────────────────────
  await irParaRail(page, 'Conteúdo da loja');
  const temPainel = await page.waitForSelector('[data-painel-loja]', { timeout: 10000 }).then(() => true).catch(() => false);
  r.ok('painel: o rail abre o Conteúdo da loja', temPainel);
  if (temPainel) {
    const nome = '#loja-nomeDaLoja';
    r.ok('painel: o campo parte do valor da loja', (await page.$eval(nome, el => el.value)) === 'MARCADOR-LJ-NOME');
    await page.click(nome, { clickCount: 3 });
    await page.type(nome, 'MARCADOR-LJ-NOVO');
    r.ok('painel: digitar o nome da loja muda o header e o rodapé', await canvasTem('MARCADOR-LJ-NOVO'));
    await page.click('[data-painel-loja] p'); // o foco sai do campo: fecha a entrada do histórico
    await page.keyboard.down('Control');
    await page.keyboard.press('z');
    await page.keyboard.up('Control');
    r.ok(
      'painel: Ctrl+Z desfaz a digitação inteira',
      await esperarNoCanvas(() => {
        const t = document.querySelector('iframe').contentDocument.body.textContent;
        return t.includes('MARCADOR-LJ-NOME') && !t.includes('MARCADOR-LJ-NOVO');
      })
    );

    const slotMenu = '[data-slot-loja="menuPrincipal"]';
    await clicarDeVerdade(page, `${slotMenu} [data-limpar-slot]`);
    r.ok(
      'painel: "Limpar" o menu devolve o menu do mock ao header',
      await esperarNoCanvas(() => !document.querySelector('iframe').contentDocument.body.textContent.includes('MARCADOR-LJ-MENU'))
    );
    const comecar = await page.waitForSelector(`${slotMenu} [data-comecar-da-pagina]`, { timeout: 5000 }).then(() => true).catch(() => false);
    r.ok('painel: com o menu vazio, oferece começar com o do header', comecar);
    if (comecar) {
      await clicarDeVerdade(page, `${slotMenu} [data-comecar-da-pagina]`);
      const copiado = await page
        .waitForFunction(
          () => JSON.parse(sessionStorage.getItem('conteudoLoja') ?? '{}').menuPrincipal?.length > 0,
          { timeout: 5000, polling: 150 }
        )
        .then(() => true)
        .catch(() => false);
      const primeiro = await page.evaluate(() => JSON.parse(sessionStorage.getItem('conteudoLoja') ?? '{}').menuPrincipal?.[0]?.label ?? '');
      r.ok(
        'painel: "Começar com o do header" copia o menu da página para a loja (e a tela não muda)',
        copiado && !!primeiro && (await noCanvas(page)).texto.includes(primeiro),
        primeiro
      );
    }

    // ── 4. a aba Conteúdo da seção diz de onde o campo vem ─────────────────
    await page.click('[data-aba-direita="conteudo"]');
    await page.evaluate(() =>
      document.querySelector('iframe').contentDocument.querySelector('[data-selection="header"]')?.click()
    );
    r.ok(
      'aba Conteúdo: o menu do header diz que vem da loja',
      await page
        .waitForSelector('[data-campo-conteudo="menu"] [data-vem-da-loja="menuPrincipal"]', { timeout: 10000 })
        .then(() => true)
        .catch(() => false)
    );
  }

  // ── 5. o /p e o recarregar ─────────────────────────────────────────────
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
    const { page: aba } = await novaAba(browser);
    const url = link.replace(/\/[a-z]+$/, '/home');
    let resp = await aba.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    if (resp?.status() !== 200) {
      await espera(3000); // a rota do /p compila sob demanda no dev
      resp = await aba.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    }
    await espera(1200);
    const noP = await aba.evaluate(`${LER}(document)`);
    const NO_P = ['MARCADOR-LJ-NOME', 'MARCADOR-LJ-COLUNA', 'MARCADOR-LJ-RAZAO', 'MARCADOR-LJ-BANNER'];
    r.ok(
      `/p/home: o conteúdo da loja aparece (${NO_P.length} marcadores e o wa.me)`,
      resp?.status() === 200 && faltando(noP, NO_P).length === 0 && noP.zap,
      `HTTP ${resp?.status()} · ${faltando(noP, NO_P).join(', ')}${noP.zap ? '' : ' · sem wa.me'}`
    );
    await aba.close();
  }

  await page.bringToFront();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ed-shell', { timeout: 60000 });
  r.ok('recarregar a aba mantém o conteúdo da loja', await canvasTem('MARCADOR-LJ-NOME'));

  // ── Todo header recebe o nome e o menu da loja ─────────────────────────
  // Cada família guarda o menu num formato (lista, objeto `{ links }`, colunas
  // de megamenu): o vínculo de cada uma tem de existir. O 3º nível só nos
  // headers que o desenham. (A barra do topo é conteúdo de cada header.)
  const TRES_NIVEIS = new Set(['Header01', 'Header02', 'Header03', 'Header06', 'Header07']);
  const LOJA_DOS_HEADERS = {
    versao: 1,
    nomeDaLoja: 'MKHDNOME',
    menuPrincipal: [
      { label: 'MKHDMENU', url: '/mk', children: [{ label: 'MKHDN2', url: '/n2', children: [{ label: 'MKHDN3', url: '/n3' }] }] },
    ],
  };
  const faltamNosHeaders = [];
  for (const h of itens().filter(i => i.selection === 'header' && i.platforms.includes('VTEX'))) {
    await semear(page, {
      plataforma: 'VTEX',
      selecoes: [{ uid: `hd-${h.id}`, id: h.id, layoutKey: h.layoutKey, pagina: 'common' }],
      aba: { conteudoLoja: LOJA_DOS_HEADERS },
    });
    const html = await page
      .waitForFunction(
        () => document.querySelector('iframe')?.contentDocument?.querySelector('[data-section-uid]')?.innerHTML.includes('MKHDMENU'),
        { timeout: 30000, polling: 250 }
      )
      .then(() => page.evaluate(() => document.querySelector('iframe').contentDocument.querySelector('[data-section-uid]').innerHTML))
      .catch(() => page.evaluate(() => document.querySelector('iframe')?.contentDocument?.querySelector('[data-section-uid]')?.innerHTML ?? ''));
    const faltam = [
      !html.includes('MKHDNOME') && 'nome',
      !html.includes('MKHDMENU') && 'menu',
      !html.includes('MKHDN2') && '2º nível',
      TRES_NIVEIS.has(h.component) && !html.includes('MKHDN3') && '3º nível',
    ].filter(Boolean);
    if (faltam.length) faltamNosHeaders.push(`${h.component}: ${faltam.join(', ')}`);
  }
  r.ok(
    'todo header (01 a 17) mostra o nome e o menu da loja, com o 2º e o 3º nível',
    !faltamNosHeaders.length,
    faltamNosHeaders.join(' | ')
  );

  r.ok('o editor sem erro de página', erros.length === 0, erros.join(' | '));
} finally {
  await browser.close();
}
process.exit(r.fechar() ? 0 : 1);

