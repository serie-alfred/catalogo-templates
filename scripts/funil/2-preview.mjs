/**
 * Estágio 2c — as três features do editor que os outros estágios não tocam:
 * a visão mobile, o link de preview compartilhável e a rota de import-log.
 *
 * Não é capricho de cobertura: as três atravessam camadas que nenhum outro
 * estágio exercita. A visão mobile troca a classe do iframe (o frame é o MESMO
 * documento, `/gerador/frame-mobile` — quem muda é a moldura). O preview
 * serializa o tema num snapshot do servidor e devolve `/p/{id}/{page}`, que
 * renderiza SEM o editor e sem postMessage. E o import-log é rota pública.
 */
import { relatorio, espera, BASE_URL } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear, clicarDeVerdade } from './lib/editor.mjs';

const r = relatorio('Estágio 2c — mobile, preview compartilhável e import-log');
const browser = await abrirBrowser();
const { page, erros } = await novaAba(browser);

const selecoes = [
  { uid: 'u-header', id: '01', layoutKey: 'header', pagina: 'common' },
  { uid: 'u-banner', id: '01', layoutKey: 'bannerFull', pagina: 'home' },
  { uid: 'u-footer', id: '01', layoutKey: 'footer', pagina: 'common' },
];
await semear(page, { plataforma: 'VTEX', selecoes });
await page.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2' });
await page.waitForSelector('.ed-shell');
await espera(2000);

// ── 1. visão mobile ─────────────────────────────────────────────────────────
const classeDoFrame = () =>
  page.evaluate(() => document.querySelector('iframe')?.className ?? '');
const apertar = rotulo =>
  page.evaluate(nome => {
    const g = document.querySelector(
      '[role="group"][aria-label="Visão do preview"]'
    );
    const b = [...(g?.querySelectorAll('button') ?? [])].find(x =>
      new RegExp(nome, 'i').test(x.textContent ?? '')
    );
    b?.click();
    return !!b;
  }, rotulo);

const classeDesktop = await classeDoFrame();
r.ok(
  'preview começa em desktop',
  /desktop/i.test(classeDesktop),
  classeDesktop
);

// Clicar UMA vez e esperar 900 ms não bastava: o botão existe no HTML antes de o
// React hidratar, e `b.click()` num botão ainda não hidratado não faz nada — em
// silêncio, como o "Baixar" desabilitado do estágio 3. Medido: 1 em 2 execuções
// isoladas reprovava com `desktop → desktop`. Agora insiste até a moldura trocar.
r.ok('o botão mobile existe no grupo de visão', await apertar('mobile'));
const trocouPara = async alvo => {
  const limite = Date.now() + 15000;
  while (Date.now() < limite) {
    if (new RegExp(alvo, 'i').test(await classeDoFrame())) return true;
    await espera(500);
    await apertar(alvo);
  }
  return false;
};
await trocouPara('mobile');
const classeMobile = await classeDoFrame();
r.ok(
  'alternar para mobile troca a moldura do iframe',
  /mobile/i.test(classeMobile) && classeMobile !== classeDesktop,
  `${classeDesktop} → ${classeMobile}`
);
// o documento é o mesmo dos dois lados — só a moldura muda
const srcMobile = await page.evaluate(
  () => document.querySelector('iframe')?.getAttribute('src') ?? ''
);
r.ok(
  'o iframe continua no /gerador/frame-mobile',
  srcMobile.includes('/gerador/frame-mobile'),
  srcMobile
);
// e as seções continuam montadas depois de trocar a visão — esperando a pintura,
// não o relógio: trocar a moldura remonta o documento do iframe.
await page
  .waitForFunction(
    n =>
      (document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ??
        0) >= n,
    { timeout: 30000, polling: 250 },
    selecoes.length
  )
  .catch(() => {});
const secoesNoMobile = await page.evaluate(
  () =>
    document
      .querySelector('iframe')
      ?.contentDocument?.querySelectorAll('[data-section-uid]').length ?? 0
);
r.ok(
  'as seções sobrevivem à troca de visão',
  secoesNoMobile === selecoes.length,
  `${secoesNoMobile} de ${selecoes.length}`
);

await apertar('desktop');
await trocouPara('desktop');
await espera(600);

// ── 2. link de preview compartilhável ───────────────────────────────────────
const clicouPreview = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x =>
    /pr[ée]-?visualizar|preview|compartilhar/i.test(x.textContent ?? '')
  );
  b?.click();
  return !!b;
});
r.ok('o botão de preview existe', clicouPreview);

let link = null;
if (clicouPreview) {
  link = await page
    .waitForFunction(
      () => {
        // O link fica num <input readOnly> — `innerText` não enxerga value de input.
        const alvos = [
          ...[...document.querySelectorAll('input')].map(i => i.value),
          document.body.innerText,
        ];
        for (const t of alvos) {
          const m = /https?:\/\/[^\s"']*\/p\/[A-Za-z0-9_-]+\/[a-z]+/.exec(
            t ?? ''
          );
          if (m) return m[0];
        }
        return null;
      },
      { timeout: 20000, polling: 300 }
    )
    .then(h => h.jsonValue())
    .catch(() => null);
}
r.ok('o preview devolve um link /p/{id}', Boolean(link), String(link));

if (link) {
  const { page: aba, erros: errosPreview } = await novaAba(browser);
  // Uma segunda tentativa porque em dev a rota `/p/[id]/[page]` é compilada sob
  // demanda: a primeira navegação da vida do servidor chega antes de ela existir.
  // Falha real falha nas duas.
  const abrir = () =>
    aba.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
  let resp = await abrir();
  if (resp?.status() !== 200) {
    await espera(3000);
    resp = await abrir();
  }
  r.ok(`o link abre (HTTP ${resp?.status()})`, resp?.status() === 200, link);

  // A página de preview NÃO tem editor: renderiza o tema direto, sem postMessage.
  const medida = await aba.evaluate(() => ({
    shell: !!document.querySelector('.ed-shell'),
    secoes: document.querySelectorAll('[data-section-uid]').length,
    altura: document.body.scrollHeight,
  }));
  r.ok('a página de preview não carrega o editor', !medida.shell);
  r.ok(
    'o preview renderiza as mesmas seções do editor',
    medida.secoes === selecoes.length,
    `${medida.secoes} de ${selecoes.length}`
  );
  r.ok('o preview tem altura', medida.altura > 300, `${medida.altura}px`);

  // O "Editar" é de quem entraria no /gerador agora (lib/sessaoDoEditor),
  // decidido no servidor: o cliente, com o mesmo link, nunca o recebe — nem com
  // `?editar=1`, o parâmetro que bastava para abri-lo até 03/11/2026.
  const { modo } = await fetch(`${BASE_URL}/api/auth/estado`)
    .then(x => x.json())
    .catch(() => ({}));
  const hrefDoEditar = () =>
    aba
      .$eval('[data-preview-editar]', a => a.getAttribute('href'))
      .catch(() => null);
  if (modo === 'ligado') {
    // O navegador do funil não tem sessão: é o cliente.
    r.ok(
      'sem sessão do editor, o link não mostra o "Editar"',
      !(await hrefDoEditar())
    );
    await aba.goto(`${link}?editar=1`, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    r.ok('?editar=1 não abre o "Editar" sem sessão', !(await hrefDoEditar()));
  } else {
    // Login desligado (dev sem as variáveis): o editor é aberto a todos, e o
    // "Editar" também — sem parâmetro nenhum.
    const href = await hrefDoEditar();
    r.ok(
      `com o editor aberto (login ${modo}), o "Editar" aparece e leva ao editor`,
      /^\/gerador\?preview=/.test(href ?? ''),
      String(href)
    );
  }
  // Os links do menu do balão: cada um é uma rota do preview e abre. Em
  // 03/11/2026 um `$` sobrou no fim de todos (`…/checkout/carrinho$`) e o
  // estágio não viu, porque só olhava o "Editar".
  // O clique antes da hidratação some em silêncio (sob carga o /p hidrata
  // segundos depois do networkidle2; um clique só deixava o menu vazio): clica
  // até o `aria-expanded` virar "true", como o 2-checkout.
  const BALAO = '[aria-label="Navegar entre as páginas"]';
  for (let k = 0; k < 30; k++) {
    const aberto = await aba
      .$eval(BALAO, b => b.getAttribute('aria-expanded'))
      .catch(() => null);
    if (aberto === 'true') break;
    await clicarDeVerdade(aba, BALAO, 1).catch(() => {});
    await aba
      .waitForFunction(
        s => document.querySelector(s)?.getAttribute('aria-expanded') === 'true',
        { timeout: 2000, polling: 100 },
        BALAO
      )
      .catch(() => {});
  }
  const menu = await aba
    .waitForSelector('nav[aria-label="Navegação do preview"] a', {
      timeout: 10000,
    })
    .then(() =>
      aba.$$eval('nav[aria-label="Navegação do preview"] a', as =>
        as.map(a => a.getAttribute('href'))
      )
    )
    .catch(() => []);
  const ROTA =
    /^\/p\/[A-Za-z0-9]{10}\/(home|categoria|produto|lp|checkout\/[a-z-]+)$/;
  const tortos = menu.filter(h => !ROTA.test(h ?? ''));
  r.ok(
    `os ${menu.length} links do menu do balão são rotas do preview`,
    menu.length >= 3 && tortos.length === 0,
    tortos.join(' ') || menu.join(' ')
  );
  const quebrados = [];
  for (const h of menu) {
    const st = await fetch(`${BASE_URL}${h}`)
      .then(x => x.status)
      .catch(() => 0);
    if (st !== 200) quebrados.push(`${h} → ${st}`);
  }
  r.ok(
    'todos os links do menu abrem (HTTP 200)',
    menu.length > 0 && quebrados.length === 0,
    quebrados.join(' | ')
  );
  r.ok(
    'preview sem erro de página',
    errosPreview.length === 0,
    errosPreview.slice(0, 2).join(' | ')
  );
  await aba.close();
}

// ── 3. import-log ───────────────────────────────────────────────────────────
const { page: aba2, erros: errosLog } = await novaAba(browser);
const respLog = await aba2.goto(`${BASE_URL}/gerador/import-log`, {
  waitUntil: 'networkidle2',
  timeout: 60000,
});
r.ok(
  `/gerador/import-log responde (HTTP ${respLog?.status()})`,
  respLog?.status() === 200
);
const textoLog = await aba2.evaluate(
  () => document.body.innerText.trim().length
);
r.ok('import-log renderiza conteúdo', textoLog > 0, `${textoLog} chars`);
r.ok(
  'import-log sem erro de página',
  errosLog.length === 0,
  errosLog.slice(0, 2).join(' | ')
);
await aba2.close();

r.ok(
  'editor sem erro de página',
  erros.length === 0,
  erros.slice(0, 2).join(' | ')
);

await browser.close();
process.exit(r.fechar() ? 0 : 1);
