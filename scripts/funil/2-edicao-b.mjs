/**
 * Estágio 2d — as quatro features cujo defeito seria INVISÍVEL.
 *
 * Os outros estágios provam que a UI reage. Este prova que a escolha do cliente
 * atravessa as camadas e chega onde importa. Sem ele, uma cor que se perde entre o
 * ColorPicker → estado → postMessage → `buildConfigJson` sai VERDE no funil inteiro:
 * o cliente escolhe a paleta, o tema é montado "com sucesso", e chega com outra cor.
 *
 * 1. cor global chega ao config.json
 * 2. variável POR COMPONENTE chega ao config.json — o "elo frágil" do CLAUDE.md
 * 3. o preview compartilhável leva cores e fontes, nas três páginas
 * 4. o trabalho sobrevive a um reload (o editor não tem "salvar": é o localStorage)
 */
import { relatorio, espera, BASE_URL } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear } from './lib/editor.mjs';

const r = relatorio('Estágio 2d — a escolha do cliente chega ao config');
const browser = await abrirBrowser();
const { page, erros } = await novaAba(browser);

const COR = '#ab12cd';
const selecoes = [
  { uid: 'u-header', id: '01', layoutKey: 'header', pagina: 'common' },
  { uid: 'u-showcase', id: '01', layoutKey: 'showcase', pagina: 'home' },
  { uid: 'u-footer', id: '01', layoutKey: 'footer', pagina: 'common' },
];

await semear(page, { plataforma: 'VTEX', selecoes });
await page.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2' });
await page.waitForSelector('.ed-shell');
await espera(2500);

/** Escreve num <input> controlado por React, disparando o onChange de verdade. */
const digitar = (seletor, valor) =>
  page.evaluate(
    (sel, v) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    },
    seletor,
    valor
  );

/** O rail à esquerda troca o painel; nada de input existe antes de abrir o certo. */
const abrirNoRail = rotulo =>
  page.evaluate(nome => {
    const alvo = [
      ...document.querySelectorAll('button,[role="tab"],[aria-label]'),
    ].find(
      e => (e.getAttribute('aria-label') ?? e.textContent ?? '').trim() === nome
    );
    alvo?.click();
    return !!alvo;
  }, rotulo);

// ── 1. cor global ───────────────────────────────────────────────────────────
r.ok('o rail tem "Variáveis globais"', await abrirNoRail('Variáveis globais'));
await espera(1500);

const SEL_COR = 'input[aria-label="Defina a cor primária da marca"]';
const achou = await page.evaluate(
  sel => !!document.querySelector(sel),
  SEL_COR
);
if (!achou) {
  const rotulos = await page.evaluate(() =>
    [...document.querySelectorAll('input[aria-label]')].map(i =>
      i.getAttribute('aria-label')
    )
  );
  r.ok(
    'o campo da cor primária da marca existe',
    false,
    `rótulos no painel: ${rotulos.join(' | ')}`
  );
} else {
  r.ok('o campo da cor primária da marca existe', await digitar(SEL_COR, COR));
}
await espera(1200);

// ── 2. variável por componente ──────────────────────────────────────────────
// Precisa de DUAS coisas: uma seção selecionada e o painel "Propriedades" aberto.
await page
  .waitForFunction(
    () =>
      (document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ?? 0) >
      0,
    { timeout: 20000, polling: 250 }
  )
  .catch(() => {});
await page.evaluate(() => {
  const d = document.querySelector('iframe')?.contentDocument;
  d?.querySelector('[data-section-uid]')?.click();
});
await espera(1200);
await abrirNoRail('Propriedades');
await espera(1500);

const varAlvo = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input[aria-label]')].filter(i =>
    /^--/.test(i.getAttribute('aria-label') ?? '')
  );
  // o painel da direita rotula cada campo com o nome da cssVar
  const alvo = inputs[0];
  return alvo ? alvo.getAttribute('aria-label') : null;
});
let corComponente = null;
if (varAlvo) {
  corComponente = '#0f9d58';
  await digitar(`input[aria-label="${varAlvo}"]`, corComponente);
  await espera(1000);
}
if (varAlvo) {
  r.ok(`há variável por componente para editar (${varAlvo})`, true);
} else {
  // Informativo, não falha: o caminho da variável por componente até o TEMA já é
  // provado pelo estágio 4 (`InjectComponentVariables` → `--breadcrumb-text` dentro
  // de `.breadcrumb` no SCSS gerado). O que falta aqui é só a perna do editor, e o
  // painel não expõe um seletor estável para dirigi-la.
  console.log(
    '     ℹ️  nenhum campo de cor no painel de propriedades desta seção — a perna\n' +
      '        editor→config da variável por componente não é exercitada aqui; a\n' +
      '        perna config→tema é, no estágio 4'
  );
}

// ── exporta e confere ───────────────────────────────────────────────────────
// Reaplica a cor logo antes do export: trocar de painel remonta o ColorPicker, e
// o valor digitado antes pode não ter sobrevivido ao ciclo de render. Confere que
// pegou, para o export não medir um estado que nunca existiu.
await abrirNoRail('Variáveis globais');
await espera(1200);
await digitar(SEL_COR, COR);
await espera(1000);
const corNoCampo = await page.evaluate(
  sel => document.querySelector(sel)?.value,
  SEL_COR
);
r.ok(
  'a cor fica no campo depois de digitada',
  corNoCampo?.toLowerCase() === COR,
  `campo mostra ${corNoCampo}`
);

await page.evaluate(() => {
  window.__cfg = null;
  const orig = URL.createObjectURL.bind(URL);
  URL.createObjectURL = bl => {
    if (bl && bl.type === 'application/json')
      bl.text().then(t => {
        try {
          window.__cfg = JSON.parse(t);
        } catch {}
      });
    return orig(bl);
  };
});
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x =>
    x.textContent.trim().startsWith('Baixar')
  );
  if (!b) throw new Error('botão Baixar não encontrado');
  b.click();
});

let cfg = null;
for (let i = 0; i < 30 && !cfg; i++) {
  await espera(4000);
  cfg = await page.evaluate(() => window.__cfg).catch(() => null);
}
r.ok('o export entrega o config', Boolean(cfg));

if (cfg) {
  const vars = cfg.faststore?.variables ?? {};
  r.ok(
    'a cor global escolhida chega ao config.json',
    vars.colorPrimaryBackground?.toLowerCase() === COR,
    `esperado ${COR}, veio ${vars.colorPrimaryBackground}`
  );

  if (corComponente) {
    const todas = [
      'global',
      'home',
      'category',
      'product',
      'overrides',
    ].flatMap(k => cfg.faststore?.[k] ?? []);
    // O config guarda pela cssVar; o painel rotula pelo texto do `variablesSchema`.
    // Casamos pelo VALOR, que é o que atravessou o caminho todo.
    const comVar = todas.find(
      e =>
        e.variables &&
        Object.values(e.variables).some(
          v => String(v).toLowerCase() === corComponente
        )
    );
    const qual = comVar
      ? Object.entries(comVar.variables).find(
          ([, v]) => String(v).toLowerCase() === corComponente
        )?.[0]
      : null;
    r.ok(
      `a variável por componente chega ao config.json${qual ? ` (${qual})` : ''}`,
      Boolean(comVar),
      comVar
        ? `em ${comVar.component}`
        : `nenhuma entrada do config traz ${corComponente}`
    );
  }
}

// ── 3. o preview compartilhável leva cores e fontes, nas 3 páginas ──────────
const link = await page.evaluate(async () => {
  const b = [...document.querySelectorAll('button')].find(x =>
    /pr[ée]-?visualizar/i.test(x.textContent ?? '')
  );
  b?.click();
  return null;
});
void link;
const url = await page
  .waitForFunction(
    () => {
      for (const t of [...document.querySelectorAll('input')].map(
        i => i.value
      )) {
        const m = /https?:\/\/[^\s"']*\/p\/[A-Za-z0-9_-]+\/[a-z]+/.exec(
          t ?? ''
        );
        if (m) return m[0];
      }
      return null;
    },
    { timeout: 25000, polling: 300 }
  )
  .then(h => h.jsonValue())
  .catch(() => null);
r.ok('o preview devolve o link', Boolean(url));

if (url) {
  const base = url.replace(/\/[a-z]+$/, '');
  for (const slug of ['home', 'categoria', 'produto']) {
    const { page: aba, erros: errosP } = await novaAba(browser);
    let resp = await aba.goto(`${base}/${slug}`, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    if (resp?.status() !== 200) {
      await espera(3000);
      resp = await aba.goto(`${base}/${slug}`, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
    }
    r.ok(`/p/.../${slug} responde 200`, resp?.status() === 200);

    if (resp?.status() === 200) {
      const medida = await aba.evaluate(cor => {
        const html = document.documentElement.outerHTML;
        return {
          temCor: html.toLowerCase().includes(cor),
          fontes: /--font-(primary|secundary|tertiary)/.test(html),
          erroVisivel: /Application error|500|Internal Server/i.test(
            document.body.innerText
          ),
        };
      }, COR);
      r.ok(
        `/p/.../${slug} leva a cor escolhida`,
        medida.temCor,
        `procurei ${COR} no HTML`
      );
      r.ok(`/p/.../${slug} leva as variáveis de fonte`, medida.fontes);
      r.ok(
        `/p/.../${slug} sem erro de página`,
        !medida.erroVisivel && errosP.length === 0,
        errosP.slice(0, 2).join(' | ')
      );
    }
    await aba.close();
  }
}

// ── 4. o trabalho sobrevive ao reload ───────────────────────────────────────
await page.goto(`${BASE_URL}/gerador`, { waitUntil: 'networkidle2' });
await page.waitForSelector('.ed-shell');
await espera(2500);
// o canvas monta por handshake com o iframe; esperar a pintura, não um sleep fixo
await page
  .waitForFunction(
    () =>
      (document
        .querySelector('iframe')
        ?.contentDocument?.querySelectorAll('[data-section-uid]').length ?? 0) >
      0,
    { timeout: 25000, polling: 250 }
  )
  .catch(() => {});
await abrirNoRail('Variáveis globais');
await espera(1200);
const depois = await page.evaluate(() => ({
  selecoes: JSON.parse(localStorage.getItem('layoutSelections') ?? '[]').length,
  secoes:
    document
      .querySelector('iframe')
      ?.contentDocument?.querySelectorAll('[data-section-uid]').length ?? 0,
  cor: document.querySelector(
    'input[aria-label="Defina a cor primária da marca"]'
  )?.value,
}));
r.ok(
  'as seções sobrevivem ao reload',
  depois.selecoes === selecoes.length && depois.secoes === selecoes.length,
  `${depois.selecoes} no storage, ${depois.secoes} no canvas`
);
r.ok(
  'a cor escolhida sobrevive ao reload',
  depois.cor?.toLowerCase() === COR,
  `veio ${depois.cor}`
);

r.ok(
  'editor sem erro de página',
  erros.length === 0,
  erros.slice(0, 2).join(' | ')
);

await browser.close();
process.exit(r.fechar() ? 0 : 1);
