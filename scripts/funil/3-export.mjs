import puppeteer from 'puppeteer-core';
import { findChrome, BASE_URL, lerLayouts, SAIDA, espera } from './lib/util.mjs';
import {
  writeFileSync,
  existsSync,
  statSync,
  rmSync,
  mkdirSync,
  readdirSync,
} from 'node:fs';
import { relatorio } from './lib/util.mjs';
import { NON_DUPLICABLE_SELECTIONS } from '../../src/utils/sectionRules.ts';
// A MESMA constante que o app lê, mas com o env DESTE processo: o funil e o
// `next dev` têm de subir com a mesma NEXT_PUBLIC_PLATAFORMA_NUVEMSHOP, e o
// bloco "seletor e hidratação" no fim reprova quando não sobem.
import { NUVEMSHOP_LIGADA } from '../../src/types/platform.ts';
import {
  conferirTrayWake,
  conferirFaststore,
  conferirNuvemshop,
  autotesteCopias,
  autotesteCredencial,
} from './lib/contrato.mjs';
const CHROME = findChrome();
const L = lerLayouts();
const s = ms => new Promise(r => setTimeout(r, ms));
const log = m => {
  process.stdout.write(`${m}\n`);
};
const r = relatorio('Estágio 3 — export e contrato com o generator');

// O detector de cópias antes de qualquer config real: é ele que decide se a
// asserção abaixo mede alguma coisa, e o seed só exercita o ramo que tolera.
autotesteCopias(r);
// Idem para a regra da Nuvemshop: o config dela não carrega credencial.
autotesteCredencial(r);
// Os PNGs também são baixados; pasta limpa a cada run para a conferência valer.
const DL = `${SAIDA}/download`;
rmSync(DL, { recursive: true, force: true });
mkdirSync(DL, { recursive: true });

// PNG 1×1 transparente — substitui as imagens externas dos mocks. O config.json
// não depende de imagem nenhuma; o que a rede atrapalha é só o palco de captura.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);


// ── Valores-sentinela (variáveis por componente e globais do painel) ─────────
// O seed antigo só punha UMA variável em UM item, então o funil nunca viu se o
// export leva o que o editor escolheu. Aqui cada variável semeada tem um valor
// que não repete em lugar nenhum (nem com o default do schema), e a conferência
// lê o config de volta cssVar a cssVar. O contador é global ao processo: duas
// plataformas ou duas LPs nunca dividem um valor.
let nSent = 0;
const FONTES_SENT = [
  "'Lora', serif",
  "'Oswald', sans-serif",
  "'Manrope', sans-serif",
  "'Merriweather', serif",
  "'Rubik', sans-serif",
];
const valorSentinela = v => {
  nSent++;
  if (v.type === 'font') return FONTES_SENT[nSent % FONTES_SENT.length];
  return `#${((0x2a1b0c + nSent * 0x0b0d11) & 0xffffff).toString(16).padStart(6, '0')}`;
};
const variaveisSentinela = it =>
  Object.fromEntries(it.variablesSchema.map(v => [v.cssVar, valorSentinela(v)]));
/** O item serve ao export da plataforma? Na VTEX só sai o que tem `path` e não é override. */
const exportavel = (it, plat) =>
  !!it?.variablesSchema?.length &&
  it.platforms.includes(plat) &&
  (plat !== 'VTEX' || (!!it.path && !it.override));
/** Prefere item com fonte no schema, para a fonte também ser provada. */
const poeFontePrimeiro = (a, b) =>
  (b.it.variablesSchema.some(v => v.type === 'font') ? 1 : 0) -
  (a.it.variablesSchema.some(v => v.type === 'font') ? 1 : 0);
/** Semeadas por plataforma: [{ sel, it, variables }] — o que a conferência lê. */
const SENTINELAS = {};

// Globais do painel: valores próprios, que o config tem de devolver iguais. Os
// fundos são claramente escuros/claros para as 3 cores DERIVADAS (texto sobre
// o fundo, terciária) terem resposta determinística.
const GLOBAIS = {
  colors: {
    colorPrimary: '#c1272d',
    colorSecondary: '#2d7fc1',
    colorTertiary: '#ffffff',
    colorPrimaryBackground: '#101820',
    colorSecondaryBackground: '#f0e8d0',
    colorTertiaryBackground: '#204060',
    colorFooter: '#3a1c5e',
    colorFooterText: '#e0d0f0',
    colorPrimaryText: '#ffffff',
    colorSecondaryText: '#000000',
  },
  fonts: {
    fontPrimary: 'Playfair Display',
    fontSecondary: 'Nunito',
    fontTertiary: 'Space Mono',
  },
};
const luminancia = hex => {
  const n = parseInt(hex.slice(1), 16);
  return (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
};
const contraste = hex => (luminancia(hex) >= 128 ? '#000000' : '#ffffff');
const bgs = GLOBAIS.colors;
// Fontes como saem no config: o nome cru do painel (o `variaveisTrayWake` não embrulha).
const GLOBAIS_ESPERADAS = {
  ...GLOBAIS.fonts,
  colorPrimary: bgs.colorPrimary,
  colorSecondary: bgs.colorSecondary,
  colorPrimaryBackground: bgs.colorPrimaryBackground,
  colorSecondaryBackground: bgs.colorSecondaryBackground,
  colorTertiaryBackground: bgs.colorTertiaryBackground,
  colorFooter: bgs.colorFooter,
  colorFooterText: bgs.colorFooterText,
  // derivadas: o editor as recalcula do fundo, o valor semeado não vale
  colorPrimaryText: contraste(bgs.colorPrimaryBackground),
  colorSecondaryText: contraste(bgs.colorSecondaryBackground),
  colorTertiary: contraste(bgs.colorTertiaryBackground),
  colorPrimaryBackgroundSafe:
    luminancia(bgs.colorPrimaryBackground) >= 220 ? '#000000' : bgs.colorPrimaryBackground,
};

/** Confere `variables` de um balde do config contra o semeado, chave a chave. */
const conferirGlobais = (rotulo, variables) => {
  const dif = Object.entries(GLOBAIS_ESPERADAS)
    .filter(([k, v]) => variables?.[k] !== v)
    .map(([k, v]) => `${k}: esperado ${v}, veio ${variables?.[k]}`);
  r.ok(
    `${rotulo}: as ${Object.keys(GLOBAIS_ESPERADAS).length} globais do painel (cores e fontes) saem com os valores semeados`,
    dif.length === 0,
    dif.join(' | ')
  );
};

/** Cada cssVar → valor semeado aparece, e só ele, na entrada do item certo. */
const conferirSentinelas = (rotulo, entradas, semeadas, chaveDe) => {
  for (const { it, variables, onde } of semeadas) {
    const achadas = entradas.filter(e => e.key === it.key);
    const e = achadas[0];
    const dif = Object.entries(variables)
      .filter(([k, v]) => e?.variables?.[k] !== v)
      .map(([k, v]) => `${k}: esperado ${v}, veio ${e?.variables?.[k]}`);
    const sobra = Object.keys(e?.variables ?? {}).filter(k => !(k in variables));
    r.ok(
      `${rotulo}: ${it.component ?? it.id} (${onde}) leva as ${Object.keys(variables).length} variáveis semeadas, cada cssVar com o seu valor`,
      achadas.length === 1 && dif.length === 0 && sobra.length === 0,
      achadas.length !== 1
        ? `${achadas.length} entradas com key "${it.key}" em ${chaveDe}`
        : [...dif, ...sobra.map(k => `sobrou ${k}`)].join(' | ')
    );
  }
};

const seedFor = plat => {
  const out = [];
  for (const [layoutKey, sec] of Object.entries(L))
    for (const it of sec.items)
      if (it.platforms.includes(plat))
        for (const pg of it.pagina)
          out.push({
            uid: `u-${layoutKey}-${it.id}-${pg}`,
            id: it.id,
            layoutKey,
            pagina: pg,
          });

  // Uma duplicata de propósito. Duplicar seção é recurso do editor
  // (`duplicateSection`), e até aqui NENHUM seed produzia duas instâncias do
  // mesmo item — então a asserção de cópias do contrato passava por vacuidade,
  // sem nunca ter visto o caso que existe para julgar. Esta cópia leva as MESMAS
  // `variables` da original: é a duplicata legítima, que o tema comporta. O ramo
  // que reprova (cópias divergentes) é exercitado pelo autoteste em `contrato.mjs`.
  //
  // O alvo tem DUAS condições além do schema, e as duas foram aprendidas na
  // rodada completa de 21/09 — até então este seed só era exercitado pelos
  // estágios 1-4, e o 5 nunca tinha visto sua saída:
  //
  //   1. `pagina === 'home'`. Fora da Home o generator da Tray/Wake não
  //      instancia cópia: o `instanceCount` não chega a processCategoryHtmlFile
  //      nem a processProductHtmlFile, então a segunda entrada vira include
  //      repetido do primeiro snippet mais um `_2.html` órfão no tema. O
  //      estágio 5 reprova exatamente isso.
  //   2. a `selection` tem de ser duplicável DE VERDADE, lido de
  //      `NON_DUPLICABLE_SELECTIONS` — a mesma constante que esconde o botão de
  //      duplicar na UI, importada em vez de reescrita para o harness não poder
  //      divergir do produto.
  //
  // Sem as duas, o alvo caía no primeiro item com schema, que é o `Header01`:
  // balde `global` E `selection: 'header'`, que está na lista de não-duplicáveis.
  // O seed fabricava uma seleção que a UI proíbe e que o generator não honra.
  const alvo = out.find(sel => {
    const it = L[sel.layoutKey].items.find(i => i.id === sel.id);
    return (
      it?.variablesSchema?.length &&
      it.platforms.includes(plat) &&
      sel.pagina === 'home' &&
      !NON_DUPLICABLE_SELECTIONS.has(it.selection)
    );
  });
  if (alvo) {
    const it = L[alvo.layoutKey].items.find(i => i.id === alvo.id);
    const v = it.variablesSchema[0];
    const valor = v.type === 'font' ? "'Manrope', sans-serif" : '#123456';
    alvo.variables = { [v.cssVar]: valor };
    out.push({ ...alvo, uid: `${alvo.uid}-copia` });
  }

  // Variáveis-sentinela em TODAS as variáveis do schema de 3 itens, um de cada
  // grupo de página (common, home e category/product), fora o alvo da cópia.
  const itemDe = sel => L[sel.layoutKey].items.find(i => i.id === sel.id);
  const grupos = [
    ['common', ['common']],
    ['home', ['home']],
    ['category/product', ['category', 'product']],
  ];
  const semeadas = [];
  for (const [onde, paginas] of grupos) {
    const cand = out
      .filter(sel => paginas.includes(sel.pagina) && sel.uid !== alvo?.uid)
      .map(sel => ({ sel, it: itemDe(sel) }))
      .filter(({ it }) => exportavel(it, plat))
      .sort(poeFontePrimeiro);
    const esc = cand[0];
    if (!esc) continue;
    esc.sel.variables = variaveisSentinela(esc.it);
    semeadas.push({ ...esc, variables: esc.sel.variables, onde });
  }
  SENTINELAS[plat] = semeadas;
  return out;
};

const b = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});

// Duas seleções, com propósitos diferentes:
//  - "máxima" põe TODO modelo compatível ao mesmo tempo. Não é alcançável pela
//    UI (os slots singleton só aceitam um), mas cobre de uma vez todos os
//    caminhos de origem e todo manifest.
//  - "coerente" é um tema que alguém montaria: um modelo por slot, mesma
//    família. É a base do estágio 4, que dele deriva o config CRUZADO (vitrine
//    de uma família, card de outra) para exercitar a substituição de spot.
const coerenteFor = plataforma => {
  const out = [];
  for (const [layoutKey, sec] of Object.entries(L)) {
    const it =
      sec.items.find(i => i.id === '01' && i.platforms.includes(plataforma)) ??
      sec.items.find(i => i.platforms.includes(plataforma));
    if (!it) continue;
    for (const pg of it.pagina)
      out.push({ uid: `u-${layoutKey}`, id: it.id, layoutKey, pagina: pg });
  }
  return out;
};

// A Nuvemshop entra só com a flag. Enquanto nenhum item a declara, o palco de
// export dela sai vazio, e os PNGs vão para uma pasta própria: o Chrome
// SOBRESCREVE arquivo de mesmo nome, e os PNGs em branco dela tomariam o lugar
// dos que a conferência do fim lê (medido em 05/11: 1 kB e 0 kB).
const PLATAFORMAS = ['Tray', 'Wake', 'VTEX', 'VTEX-coerente'];
if (NUVEMSHOP_LIGADA) PLATAFORMAS.push('Nuvemshop');
PLATAFORMAS.push('Wake 2.0');
const DL_NUVEMSHOP = `${DL}/nuvemshop`;

for (const plat of PLATAFORMAS) {
  const coerente = plat.endsWith('-coerente');
  const plataforma = coerente ? plat.replace('-coerente', '') : plat;
  const p = await b.newPage();
  // sem interceptação: as imagens externas dos mocks carregam de verdade
  const cdp = await p.createCDPSession();
  await cdp.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: plataforma === 'Nuvemshop' ? DL_NUVEMSHOP : DL,
  });
  p.on('dialog', async d => {
    log(`   [dialog ${plat}] ${d.message().slice(0, 90)}`);
    await d.dismiss();
  });
  p.on('pageerror', e =>
    log(`   [pageerror ${plat}] ${e.message.slice(0, 90)}`)
  );

  const seed = coerente ? coerenteFor(plataforma) : seedFor(plataforma);
  if (!seed.length)
    log(
      `   ℹ️  ${plat}: nenhum item do catálogo declara a plataforma — o config sai só com globais e assets`
    );
  // Papéis do checkout no sessionStorage em TODAS as plataformas: em VTEX eles têm
  // de chegar ao `faststore.checkout.variables`; em Tray/Wake não podem vazar.
  const CHECKOUT_SEMEADO = {
    '--checkout-accent': '#ffeb3b',
    '--checkout-font': "'Lato', Arial, Helvetica, sans-serif",
  };
  await p.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await p.evaluate(
    (pl, sel, tok, ck, gl) => {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('colors', JSON.stringify(gl.colors));
      sessionStorage.setItem('fonts', JSON.stringify(gl.fonts));
      sessionStorage.setItem('layoutPlatform', pl);
      sessionStorage.setItem('layoutSelections', sel);
      if (tok) sessionStorage.setItem('wakeToken', tok);
      sessionStorage.setItem('checkout', ck);
    },
    plataforma,
    JSON.stringify(seed),
    // Na Nuvemshop, o token que sobrou de uma sessão Wake na mesma aba: é ele
    // que daria credencial ao config se o export o carregasse.
    plataforma === 'Wake' || plataforma === 'Wake 2.0' || plataforma === 'Nuvemshop' ? 'TOKEN-DE-TESTE' : '',
    JSON.stringify({ model: 'Checkout01', variables: CHECKOUT_SEMEADO, etapa: 'carrinho' }),
    GLOBAIS
  );
  await p.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await p.waitForSelector('.ed-shell', { timeout: 60000 });
  await s(8000);

  // O `sanitizeSelections` da hidratação descarta toda seleção cujo
  // `layoutKey/id` o app servido não conhece — e o export sai sem ela, com o
  // contrato abaixo verde porque só confere o que VEIO no config. Semente e app
  // leem o mesmo layoutData.ts, então perder qualquer uma quer dizer que o app em
  // :5503 não é este catálogo (outro checkout na porta, HMR atrasado, alguém
  // editando o arquivo no meio da rodada). Até 24/09 isto só era impresso.
  const hidratadas = await p.evaluate(() =>
    JSON.parse(sessionStorage.getItem('layoutSelections') ?? '[]').map(
      s => `${s.layoutKey}/${s.id}@${s.pagina}`
    )
  );
  const perdidas = seed
    .map(s => `${s.layoutKey}/${s.id}@${s.pagina}`)
    .filter(k => !hidratadas.includes(k));
  r.ok(
    `${plat}: as ${seed.length} seleções semeadas hidratam (${hidratadas.length})`,
    hidratadas.length === seed.length && perdidas.length === 0,
    `perdidas na hidratação: ${[...new Set(perdidas)].join(', ') || '(nenhuma, mas a contagem mudou)'}`
  );

  await p.evaluate(() => {
    window.__cfg = null;
    // Diagnóstico: sem isto, um export que não entrega o JSON some em 120s de
    // espera muda e a mensagem final não distingue "o botão não fez nada" de
    // "o Blob veio e o parse falhou".
    window.__blobs = [];
    window.__cfgErro = null;
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = bl => {
      if (bl) window.__blobs.push(`${bl.type}:${bl.size}`);
      if (bl && bl.type === 'application/json')
        bl.text().then(t => {
          try {
            window.__cfg = JSON.parse(t);
          } catch (e) {
            window.__cfgErro = String(e);
          }
        });
      return orig(bl);
    };
  });
  // O botão é `disabled={exporting || !platform}`, e clicar em botão desabilitado
  // não faz NADA — sem erro, sem blob, sem sinal. Se o clique chegar antes de o
  // `platform` hidratar do sessionStorage, o estágio ficava 120s esperando um export
  // que nunca começou. Esperar ele habilitar é a diferença entre medir o produto e
  // medir a corrida.
  const habilitou = await p
    .waitForFunction(
      () => {
        const b = [...document.querySelectorAll('button')].find(x =>
          x.textContent.trim().startsWith('Baixar')
        );
        return !!b && !b.disabled;
      },
      { timeout: 60000, polling: 250 }
    )
    .then(
      () => true,
      () => false
    );
  if (
    !r.ok(
      `${plat}: o "Baixar" habilita (a plataforma hidratou)`,
      habilitou,
      plataforma === 'Nuvemshop'
        ? 'o dev recusou a Nuvemshop: suba-o com NEXT_PUBLIC_PLATAFORMA_NUVEMSHOP=1, como o funil'
        : 'a plataforma semeada não hidratou'
    )
  ) {
    await p.close();
    continue;
  }
  await p.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(x =>
      x.textContent.trim().startsWith('Baixar')
    );
    if (!btn) throw new Error('botão Baixar não encontrado');
    btn.click();
  });

  let config = null;
  for (let i = 1; i <= 24 && !config; i++) {
    await s(5000);
    try {
      config = await p.evaluate(() => window.__cfg);
    } catch {}
    if (!config && i % 4 === 0) {
      const st = await p
        .evaluate(() => {
          const im = [...document.querySelectorAll('img')];
          return `${im.length} img, ${im.filter(x => !x.complete).length} pendentes, fonts=${document.fonts.status}`;
        })
        .catch(() => 'contexto indisponível');
      const bl = await p
        .evaluate(() => ({ blobs: window.__blobs, erro: window.__cfgErro }))
        .catch(() => null);
      const detalhe = bl
        ? ` | blobs: ${bl.blobs?.join(', ') || 'nenhum'}${bl.erro ? ` | parse: ${bl.erro}` : ''}`
        : '';
      log(`   ...${i * 5}s ${st}${detalhe}`);
    }
  }
  r.ok(`${plat}: o botão "Baixar" entrega o config.json`, !!config);
  if (config) {
    writeFileSync(
      `${SAIDA}/config-${plat}.json`,
      JSON.stringify(config, null, 2)
    );
    const esperado =
      plataforma === 'VTEX' ? 'faststore' : plataforma === 'Wake 2.0' ? 'wake' : plataforma.toLowerCase();
    r.ok(
      `${plat}: platform === "${esperado}"`,
      config.platform === esperado,
      config.platform
    );
    if (plataforma === 'VTEX')
      conferirFaststore(config, r, { checkoutEsperado: CHECKOUT_SEMEADO });
    else if (plataforma === 'Nuvemshop') conferirNuvemshop(config, r);
    else conferirTrayWake(config, plataforma, r);

    // Valores de ponta a ponta: o que o editor escolheu é o que o config leva.
    const raiz = plataforma === 'VTEX' ? config.faststore : config[esperado];
    conferirGlobais(plat, raiz?.variables);
    if (!coerente) {
      const sem = SENTINELAS[plat] ?? [];
      r.ok(
        `${plat}: variáveis-sentinela semeadas em 3 itens (common, home, category/product)`,
        sem.length === 3 && sem.some(x => x.it.variablesSchema.some(v => v.type === 'font')),
        `semeados: ${sem.map(x => x.onde).join(', ') || 'nenhum'}`
      );
      for (const x of sem) {
        const balde = x.sel.pagina === 'common' ? raiz?.global : raiz?.[x.sel.pagina];
        conferirSentinelas(plat, balde ?? [], [x], x.sel.pagina === 'common' ? 'global' : x.sel.pagina);
      }
    }
  }
  await p.close();
}

// O modo LP na Nuvemshop (fase 7 do contrato dela): com a flag, uma LP feita
// das seções de miolo da 09, na ordem da página e com uma cópia de cor própria,
// exportada SOZINHA. A aba também tem loja, checkout e um `wakeToken` de outra
// sessão: nada disso pode ir no config da LP. O config fica em
// `config-Nuvemshop-lp.json`, que o `4-tema-nuvemshop` monta e o `5-contrato` lê.
if (NUVEMSHOP_LIGADA) {
  const LP_NOME = 'Black Friday Nuvem';
  const LP_SLUG = 'black-friday-nuvem';
  // Uma família só: um template comporta 25 seções, e cada família tem ~13 de miolo.
  const miolo = [];
  let familiaDaLp = null;
  for (const [layoutKey, sec] of Object.entries(L))
    for (const it of sec.items)
      if (it.platforms.includes('Nuvemshop') && it.pagina.includes('home') && (familiaDaLp ??= it.template) === it.template)
        miolo.push({ it, sel: { uid: `lp-${layoutKey}-${it.id}`, id: it.id, layoutKey, pagina: 'home' } });
  // A cópia: o primeiro item com cor no schema entra duas vezes, cada uma com a
  // sua cor. Na Nuvemshop cada instância tem os próprios settings (§2.1 C).
  const comCor = miolo.find(m => m.it.variablesSchema?.some(v => v.type === 'color'));
  if (comCor) {
    const v = comCor.it.variablesSchema.find(x => x.type === 'color');
    comCor.sel.variables = { [v.cssVar]: '#0e0f01' };
    miolo.splice(miolo.indexOf(comCor) + 1, 0, {
      it: comCor.it,
      sel: { ...comCor.sel, uid: `${comCor.sel.uid}-copia`, variables: { [v.cssVar]: '#0e0f02' } },
    });
  }
  const esperado = miolo.map(m => `${m.it.template}/${m.it.selection}`);
  const p = await b.newPage();
  const cdp = await p.createCDPSession();
  await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DL_NUVEMSHOP });
  p.on('dialog', async d => {
    log(`   [dialog Nuvemshop-lp] ${d.message().slice(0, 90)}`);
    await d.dismiss();
  });
  await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(
    (loja, lp) => {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('layoutPlatform', 'Nuvemshop');
      sessionStorage.setItem('layoutSelections', loja);
      sessionStorage.setItem('wakeToken', 'TOKEN-DE-TESTE');
      sessionStorage.setItem('checkout', JSON.stringify({ model: 'Checkout01', variables: { '--checkout-accent': '#ffeb3b' }, etapa: 'carrinho' }));
      sessionStorage.setItem('editorMode', 'lp');
      sessionStorage.setItem('lp', lp);
    },
    JSON.stringify(coerenteFor('Nuvemshop')),
    JSON.stringify({ nome: LP_NOME, selections: miolo.map(m => m.sel) })
  );
  await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForSelector('.ed-shell', { timeout: 60000 });
  const emLp = await p
    .waitForFunction(() => document.querySelector('[data-editor-mode-lp]')?.getAttribute('aria-pressed') === 'true', {
      timeout: 60000,
      polling: 250,
    })
    .then(
      () => true,
      () => false
    );
  r.ok(
    `Nuvemshop: o modo LP existe e a aba semeada abre nele (${miolo.length} seções de miolo da família ${familiaDaLp})`,
    emLp && miolo.length > 0,
    emLp ? 'nenhum item de miolo declara a Nuvemshop' : 'o rail não tem o alternador de LP pressionado — plataformaTemLp inclui a Nuvemshop com a flag?'
  );
  let cfg = null;
  if (emLp) {
    await p.evaluate(() => {
      window.__cfg = null;
      const orig = URL.createObjectURL.bind(URL);
      URL.createObjectURL = bl => {
        if (bl && bl.type === 'application/json') bl.text().then(t => (window.__cfg = JSON.parse(t)));
        return orig(bl);
      };
    });
    await p
      .waitForFunction(
        () => {
          const x = [...document.querySelectorAll('button')].find(y => y.textContent.trim().startsWith('Baixar'));
          return !!x && !x.disabled;
        },
        { timeout: 60000, polling: 250 }
      )
      .catch(() => {});
    await p.evaluate(() => [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('Baixar'))?.click());
    for (let i = 0; i < 40 && !cfg; i++) {
      await s(3000);
      cfg = await p.evaluate(() => window.__cfg).catch(() => null);
    }
  }
  if (r.ok('Nuvemshop-lp: o "Baixar" do modo LP entrega o config', !!cfg)) {
    writeFileSync(`${SAIDA}/config-Nuvemshop-lp.json`, JSON.stringify(cfg, null, 2));
    const raiz = cfg.nuvemshop ?? {};
    r.ok(
      `Nuvemshop-lp: platform "nuvemshop", tipo "lp" e landingPage { slug: "${LP_SLUG}", nome }`,
      cfg.platform === 'nuvemshop' && cfg.tipo === 'lp' && raiz.landingPage?.slug === LP_SLUG && raiz.landingPage?.nome === LP_NOME,
      JSON.stringify({ platform: cfg.platform, tipo: cfg.tipo, landingPage: raiz.landingPage })
    );
    r.ok(
      'Nuvemshop-lp: sem tema de loja no config (global/home/category/product/checkout)',
      !['global', 'home', 'category', 'product', 'checkout'].some(k => k in raiz),
      Object.keys(raiz).join(', ')
    );
    const veio = (raiz.landing ?? []).map(e => `${e.template}/${e.selection}`);
    r.ok(
      `Nuvemshop-lp: nuvemshop.landing traz as ${esperado.length} seções na ordem da página`,
      JSON.stringify(veio) === JSON.stringify(esperado),
      `veio: ${veio.join(', ')}`
    );
    if (comCor) {
      const i = miolo.findIndex(m => m === comCor);
      const [a, c] = [raiz.landing?.[i]?.variables, raiz.landing?.[i + 1]?.variables];
      r.ok(
        'Nuvemshop-lp: a cópia leva a própria cor (variável por cópia)',
        Object.values(a ?? {})[0] === '#0e0f01' && Object.values(c ?? {})[0] === '#0e0f02',
        JSON.stringify([a, c])
      );
    }
    conferirNuvemshop(cfg, r);
  }
  await p.close();
}


// O modo LP com valores de ponta a ponta, na VTEX e na Wake 2.0 (as duas que o
// estágio exporta e onde o generator monta LP). A LP tem o seu `buildLpConfigJson`,
// com `landing` no lugar de global/home, e é um caminho de `pickChangedVariables`
// que o export da loja não toca. Três seções de miolo (home), todas as variáveis
// do schema semeadas, uma fonte no meio; as globais do painel também têm de sair.
for (const plat of ['VTEX', 'Wake 2.0']) {
  const trilha = plat === 'VTEX' ? 'faststore' : 'wake';
  const cand = [];
  for (const [layoutKey, sec] of Object.entries(L))
    for (const it of sec.items)
      if (
        it.pagina.includes('home') &&
        !it.global &&
        !NON_DUPLICABLE_SELECTIONS.has(it.selection) &&
        exportavel(it, plat)
      )
        cand.push({
          it,
          sel: { uid: `lplp-${layoutKey}-${it.id}`, id: it.id, layoutKey, pagina: 'home' },
        });
  cand.sort(poeFontePrimeiro);
  const semeadas = cand.slice(0, 3).map(c => {
    c.sel.variables = variaveisSentinela(c.it);
    return { ...c, variables: c.sel.variables, onde: 'landing' };
  });
  const p = await b.newPage();
  const cdp = await p.createCDPSession();
  await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DL });
  p.on('dialog', async d => {
    log(`   [dialog ${plat}-lp] ${d.message().slice(0, 90)}`);
    await d.dismiss();
  });
  await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(
    (pl, loja, lp, gl, tok) => {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('layoutPlatform', pl);
      sessionStorage.setItem('layoutSelections', loja);
      sessionStorage.setItem('colors', JSON.stringify(gl.colors));
      sessionStorage.setItem('fonts', JSON.stringify(gl.fonts));
      if (tok) sessionStorage.setItem('wakeToken', tok);
      sessionStorage.setItem('editorMode', 'lp');
      sessionStorage.setItem('lp', lp);
    },
    plat,
    JSON.stringify(coerenteFor(plat)),
    JSON.stringify({ nome: 'LP Sentinela', selections: semeadas.map(x => x.sel) }),
    GLOBAIS,
    plat === 'Wake 2.0' ? 'TOKEN-DE-TESTE' : ''
  );
  await p.goto(`${BASE_URL}/gerador`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForSelector('.ed-shell', { timeout: 60000 });
  const emLp = await p
    .waitForFunction(() => document.querySelector('[data-editor-mode-lp]')?.getAttribute('aria-pressed') === 'true', {
      timeout: 60000,
      polling: 250,
    })
    .then(
      () => true,
      () => false
    );
  r.ok(`${plat}-lp: a aba semeada abre no modo LP com ${semeadas.length} seções`, emLp && semeadas.length === 3);
  let cfg = null;
  if (emLp) {
    await p.evaluate(() => {
      window.__cfg = null;
      const orig = URL.createObjectURL.bind(URL);
      URL.createObjectURL = bl => {
        if (bl && bl.type === 'application/json') bl.text().then(t => (window.__cfg = JSON.parse(t)));
        return orig(bl);
      };
    });
    await p
      .waitForFunction(
        () => {
          const x = [...document.querySelectorAll('button')].find(y => y.textContent.trim().startsWith('Baixar'));
          return !!x && !x.disabled;
        },
        { timeout: 60000, polling: 250 }
      )
      .catch(() => {});
    await p.evaluate(() => [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('Baixar'))?.click());
    for (let i = 0; i < 40 && !cfg; i++) {
      await s(3000);
      cfg = await p.evaluate(() => window.__cfg).catch(() => null);
    }
  }
  if (r.ok(`${plat}-lp: o "Baixar" do modo LP entrega o config`, !!cfg)) {
    const raiz = cfg[trilha] ?? {};
    r.ok(`${plat}-lp: tipo "lp" e landingPage com o slug do nome`, cfg.tipo === 'lp' && raiz.landingPage?.slug === 'lp-sentinela', JSON.stringify(raiz.landingPage));
    conferirGlobais(`${plat}-lp`, raiz.variables);
    conferirSentinelas(`${plat}-lp`, raiz.landing ?? [], semeadas, 'landing');
  }
  await p.close();
}

// O seletor e a hidratação contra a flag, nos dois sentidos. Desligada (o
// padrão, e o que vai para produção): uma aba que guardou `Nuvemshop` volta sem
// plataforma e o seletor não a oferece. Ligada: volta com ela e o seletor a
// oferece. A aba fica sem seções, então o convite do canvas (`[data-inicio]`)
// só aparece DEPOIS da hidratação — é por ele que se espera, não por tempo.
{
  const p = await b.newPage();
  await p.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await p.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('layoutPlatform', 'Nuvemshop');
    sessionStorage.setItem('layoutSelections', '[]');
  });
  await p.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  const hidratou = await p
    .waitForSelector('[data-inicio]', { timeout: 60000 })
    .then(
      () => true,
      () => false
    );
  const card = 'button[class*="card"][aria-haspopup]';
  const visto = hidratou
    ? await p.evaluate(sel => {
        const b = [...document.querySelectorAll('button')].find(x =>
          x.textContent.trim().startsWith('Baixar')
        );
        return {
          rotulo: document.querySelector(sel)?.textContent.trim() ?? '',
          baixar: !!b && !b.disabled,
        };
      }, card)
    : null;
  let opcoes = [];
  if (hidratou) {
    await p.click(card);
    await p
      .waitForSelector('[role="option"]', { timeout: 5000 })
      .catch(() => {});
    opcoes = await p.evaluate(() =>
      [...document.querySelectorAll('[role="option"]')].map(o =>
        o.textContent.trim()
      )
    );
  }
  const flag = `NEXT_PUBLIC_PLATAFORMA_NUVEMSHOP ${NUVEMSHOP_LIGADA ? 'ligada' : 'desligada'}`;
  const mesmaFlag =
    'o dev e o funil sobem com a mesma NEXT_PUBLIC_PLATAFORMA_NUVEMSHOP?';
  r.ok(
    `${flag}: a aba com "Nuvemshop" guardado hidrata`,
    hidratou,
    'o convite do canvas não apareceu em 60 s'
  );
  if (visto) {
    r.ok(
      NUVEMSHOP_LIGADA
        ? `${flag}: a hidratação aceita a Nuvemshop (seletor e "Baixar")`
        : `${flag}: a hidratação recusa a Nuvemshop (seletor vazio, "Baixar" desabilitado)`,
      NUVEMSHOP_LIGADA
        ? visto.rotulo.startsWith('Nuvemshop') && visto.baixar
        : visto.rotulo === 'Selecione uma plataforma' && !visto.baixar,
      `seletor "${visto.rotulo}" · Baixar ${visto.baixar ? 'habilitado' : 'desabilitado'} — ${mesmaFlag}`
    );
    r.ok(
      `${flag}: o seletor ${NUVEMSHOP_LIGADA ? 'oferece' : 'não oferece'} a Nuvemshop`,
      opcoes.length >= 3 && opcoes.includes('Nuvemshop') === NUVEMSHOP_LIGADA,
      `opções: ${opcoes.join(', ') || 'nenhuma'} — ${mesmaFlag}`
    );
  }
  await p.close();
}
// O Chrome cria o arquivo vazio e só depois escreve; sob carga, fechar o navegador antes
// deixava o PNG com 0 kB. Espera os downloads assentarem (sem .crdownload, tamanho > 0).
for (let i = 0; i < 60; i++) {
  const pendentes = readdirSync(DL).filter(n => n.endsWith('.crdownload'));
  const vazios = ['layout-desktop.png', 'layout-mobile.png'].filter(
    n => !existsSync(`${DL}/${n}`) || statSync(`${DL}/${n}`).size === 0
  );
  if (!pendentes.length && !vazios.length) break;
  await espera(500);
}
await b.close();

// Os dois PNGs do palco de export. Um palco em branco comprime para pouquíssimas
// cores, então a contagem é o que separa "gerou" de "gerou vazio".
for (const nome of ['layout-desktop.png', 'layout-mobile.png']) {
  const f = `${DL}/${nome}`;
  r.ok(
    `${nome} baixado`,
    existsSync(f) && statSync(f).size > 50_000,
    existsSync(f) ? `${Math.round(statSync(f).size / 1024)} kB` : 'ausente'
  );
}

process.exit(r.fechar() ? 0 : 1);
