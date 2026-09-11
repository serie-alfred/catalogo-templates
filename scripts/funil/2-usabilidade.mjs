/**
 * Estágio 2g — todo controle da tela é achável, alcançável e faz alguma coisa.
 *
 * Existe porque a cobertura dos outros estágios é por TESE (regras de edição,
 * geometria, integração), e no vão entre elas ficaram componentes inteiros sem
 * uma única asserção: `ScrollArea`, `DesktopOnlyNotice`, o caminho feliz do
 * `FontSelector`, 9 das 10 cores globais, o botão Fechar do modal.
 *
 * A tese daqui é a que o `PanelToggle` provou que faltava: um controle pode
 * estar no DOM, responder a `.click()` por DOM, e ser inalcançável por um
 * humano. `visibilidadeDe` mede opacidade e hit-test reais; `clicarDeVerdade`
 * usa o hit-test do Chrome.
 *
 * Não tem dependentes: se reprovar, dá para rodar `yarn funil 3` e seguir com
 * o diagnóstico das outras pernas.
 */
import {
  abrirBrowser,
  novaAba,
  semear,
  irParaRail,
  visibilidadeDe,
  controleUsavel,
  clicarDeVerdade,
} from './lib/editor.mjs';
import { relatorio, espera, BASE_URL } from './lib/util.mjs';

const r = relatorio('Estágio 2g — alcance e usabilidade dos controles');

const SELECOES = [
  { uid: 'u-header', id: '01', layoutKey: 'header', pagina: 'common' },
  { uid: 'u-banner', id: '01', layoutKey: 'bannerFull', pagina: 'home' },
  { uid: 'u-footer', id: '01', layoutKey: 'footer', pagina: 'common' },
];

const browser = await abrirBrowser();
const { page, erros } = await novaAba(browser);
await semear(page, { plataforma: 'Tray', selecoes: SELECOES });

/** Cada bloco num try/catch próprio — regra 5: a falha de um é a falha dele. */
const bloco = async (nome, fn) => {
  try {
    await fn();
  } catch (e) {
    r.ok(`${nome}: roda sem estourar`, false, String(e).slice(0, 100));
  }
};

// ═══ 1. varredura de alcance ════════════════════════════════════════════════
// É o portão que impede um segundo PanelToggle invisível.
await bloco('varredura', async () => {
  const CONTROLES = [
    ['rail: Componentes', 'button[aria-label="Componentes"]'],
    ['rail: Variáveis globais', 'button[aria-label="Variáveis globais"]'],
    ['rail: Tipografia', 'button[aria-label="Tipografia"]'],
    ['rail: Identidade visual', 'button[aria-label="Identidade visual"]'],
    ['topbar: Voltar', 'header[class*="topbar"] button[aria-label="Voltar"]'],
    ['topbar: Avançar', 'header[class*="topbar"] button[aria-label="Avançar"]'],
    [
      'topbar: seletor de página',
      'header[class*="topbar"] button[aria-haspopup="listbox"]',
    ],
    ['topbar: Desktop', 'div[role="group"] button:nth-of-type(1)'],
    ['topbar: Mobile', 'div[role="group"] button:nth-of-type(2)'],
    ['canvas: zoom', 'button[aria-label="Zoom do canvas"]'],
    [
      'painel: recolher esquerdo',
      'button[aria-label="Recolher painel esquerdo"]',
    ],
    [
      'painel: recolher direito',
      'button[aria-label="Recolher painel direito"]',
    ],
    [
      'painel: seletor de plataforma',
      'button[class*="PlatformSelect"][class*="card"]',
    ],
    ['lista: setinha da 1ª seção', 'button[class*="affordance"]'],
    ['lista: +/− da 1ª seção', 'button[class*="SectionsPanel_toggle"]'],
    [
      'direita: Pré-visualizar',
      'aside[aria-label="Propriedades"] button[class*="trigger"]',
    ],
  ];
  for (const [nome, sel] of CONTROLES) {
    const v = await visibilidadeDe(page, sel);
    r.ok(`alcance — ${nome}`, controleUsavel(v), JSON.stringify(v));
  }

  // "Baixar" é o único legitimamente desabilitado num estado — sem plataforma.
  // Aqui há plataforma, então ele tem que estar usável.
  const baixar = await visibilidadeDe(
    page,
    'aside[aria-label="Propriedades"] button[class*="download"]'
  );
  r.ok(
    'alcance — direita: Baixar (com plataforma escolhida)',
    controleUsavel(baixar) && !baixar.desabilitado,
    JSON.stringify(baixar)
  );
});

// ═══ 2. as 10 cores globais ═════════════════════════════════════════════════
// Só a primária era exercitada. As outras 6 editáveis e as 3 derivadas nunca.
await bloco('cores', async () => {
  await irParaRail(page, 'Variáveis globais');
  await page
    .waitForFunction(
      () =>
        document.querySelectorAll(
          'aside[aria-label="Painel de edição"] input[aria-label]'
        ).length >= 10,
      { timeout: 15000, polling: 200 }
    )
    .catch(() => {});

  const EDITAVEIS = [
    ['Defina a cor base do texto', '#a10001'],
    ['Defina a cor secundária', '#a10002'],
    ['Defina a cor primária da marca', '#a10003'],
    ['Defina a cor secundária da marca', '#a10004'],
    ['Defina a cor terciária da marca', '#a10005'],
    ['Defina a cor do rodapé', '#a10006'],
    ['Defina a cor do texto do rodapé', '#a10007'],
  ];
  const DERIVADAS = [
    'Defina a cor primária de contraste da marca',
    'Defina a cor secundária de contraste da marca',
    'Defina a cor terciária de contraste da marca',
  ];

  // O input do ColorPicker é controlado e valida o hex a cada tecla, então
  // digitar caractere a caractere deixa estados parciais ("#000") que o
  // componente normaliza. O setter nativo entrega o valor inteiro de uma vez,
  // que é o que o React escuta.
  const digitar = (rotulo, valor) =>
    page.evaluate(
      (rot, v) => {
        const el = document.querySelector(`input[aria-label="${rot}"]`);
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
      rotulo,
      valor
    );

  for (const [rotulo, valor] of EDITAVEIS) {
    r.ok(`cor "${rotulo}" existe`, await digitar(rotulo, valor));
    await espera(220);
  }
  const aplicadas = await page.evaluate(
    rots =>
      rots.map(rot => ({
        rot,
        valor: document
          .querySelector(`input[aria-label="${rot}"]`)
          ?.value?.toLowerCase(),
      })),
    EDITAVEIS.map(([rot]) => rot)
  );
  r.ok(
    'as 7 cores editáveis aceitam valor e o guardam',
    aplicadas.every((a, i) => a.valor === EDITAVEIS[i][1]),
    JSON.stringify(aplicadas.filter((a, i) => a.valor !== EDITAVEIS[i][1]))
  );

  const deriv = await page.evaluate(
    rots =>
      rots.map(rot => {
        const i = document.querySelector(`input[aria-label="${rot}"]`);
        const linha = i?.closest('div[class*="ColorPicker_row"]');
        const sw = linha?.querySelector('button[class*="swatch"]');
        return {
          rot,
          readOnly: !!i?.readOnly,
          swatchDesabilitado: !!sw?.disabled,
          valor: i?.value,
        };
      }),
    DERIVADAS
  );
  r.ok(
    'as 3 derivadas são somente-leitura (input readOnly + swatch disabled)',
    deriv.every(d => d.readOnly && d.swatchDesabilitado),
    JSON.stringify(deriv)
  );
  r.ok(
    'as 3 derivadas trazem hex de 6 dígitos, não NaN',
    deriv.every(d => /^#[0-9a-f]{6}$/i.test((d.valor ?? '').trim())),
    deriv.map(d => d.valor).join(' | ')
  );

  // E recalculam: trocar o fundo tem que mover a derivada correspondente.
  const antes = deriv[0].valor;
  await digitar('Defina a cor primária da marca', '#ffffff');
  await espera(800);
  const depois = await page.evaluate(
    rot => document.querySelector(`input[aria-label="${rot}"]`)?.value,
    DERIVADAS[0]
  );
  r.ok(
    'a derivada recalcula quando o fundo muda (fundo claro ⇒ texto escuro)',
    depois !== antes && /^#[0-9a-f]{6}$/i.test(depois ?? ''),
    `${antes} → ${depois}`
  );
});

// ═══ 3. FontSelector, caminho feliz ═════════════════════════════════════════
// Só o caminho de FALHA (catálogo fora do ar) era testado.
await bloco('fontes', async () => {
  await irParaRail(page, 'Tipografia');
  await page
    .waitForFunction(
      () =>
        document.querySelectorAll('aside[aria-label="Painel de edição"] input')
          .length >= 3,
      { timeout: 15000, polling: 200 }
    )
    .catch(() => {});

  // Clique de mouse real primeiro: `showSuggestions` liga no `onFocus`, e um
  // `el.focus()` de dentro do evaluate nem sempre dispara o handler do React
  // em headless.
  await clicarDeVerdade(page, 'aside[aria-label="Painel de edição"] input');
  await espera(400);

  // Insistir, não esperar uma vez. O catálogo de fontes é buscado pela rota
  // `/gerador/api/fonts`, que faz round-trip ao Google: isolado o estágio pega
  // a rota quente e a lista abre na hora; no funil inteiro, com o browser
  // recém-aberto, a primeira busca demora mais que qualquer timeout fixo.
  // Digitar de novo a cada volta é barato e cobre os dois casos.
  const digitarNoCampo = valor =>
    page.evaluate(v => {
      const el = document.querySelector(
        'aside[aria-label="Painel de edição"] input'
      );
      el?.focus();
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(el, v);
      el?.dispatchEvent(new Event('input', { bubbles: true }));
    }, valor);

  let temSugestao = false;
  for (let i = 0; i < 12 && !temSugestao; i++) {
    // Alterna o termo para forçar um `input` novo mesmo se o valor já era esse.
    await digitarNoCampo(i % 2 ? 'Manr' : 'Manro');
    temSugestao = await page
      .waitForFunction(
        () =>
          (document.querySelectorAll('button[class*="suggestion"]').length ??
            0) > 0,
        { timeout: 2500, polling: 150 }
      )
      .then(() => true)
      .catch(() => false);
    if (
      !temSugestao &&
      (await page.evaluate(
        () =>
          !!document.querySelector(
            'aside[aria-label="Painel de edição"] p[role="status"]'
          )
      ))
    )
      break;
  }

  if (!temSugestao) {
    // Sem GOOGLE_FONTS_API_KEY a rota devolve 500 — aí é ambiente, não produto,
    // e pular é honesto. Mas só depois de CONFERIR que é esse o caso: pular por
    // seletor errado seria cobertura fantasma, que é pior que cobertura zero.
    const diagnostico = await page.evaluate(() => ({
      avisoIndisponivel: !!document.querySelector(
        'aside[aria-label="Painel de edição"] p[role="status"]'
      ),
      valorDoCampo: document.querySelector(
        'aside[aria-label="Painel de edição"] input'
      )?.value,
      listaNoDom: !!document.querySelector('ul[class*="fontSuggest"]'),
    }));
    if (diagnostico.avisoIndisponivel) {
      console.log(
        '  ⏭️  catálogo de fontes indisponível (a rota avisou): caminho feliz pulado'
      );
      return;
    }
    r.ok(
      'digitar 2+ letras abre as sugestões',
      false,
      JSON.stringify(diagnostico)
    );
    return;
  }
  r.ok('digitar 2+ letras abre as sugestões', true);
  const escolhida = await page.evaluate(() => {
    const b = document.querySelector('button[class*="suggestion"]');
    const nome = b?.textContent?.trim();
    // `onMouseDown` e não click: o blur do input fecha a lista antes do click.
    b?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    return nome;
  });
  await espera(900);
  const aplicada = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--font-primary')
      .trim()
  );
  r.ok(
    `clicar numa sugestão aplica a fonte (${escolhida})`,
    !!escolhida && aplicada.includes(escolhida),
    `--font-primary = ${aplicada}`
  );
});

// ═══ 4. modal: Fechar, overlay e ScrollArea ═════════════════════════════════
await bloco('modal', async () => {
  await irParaRail(page, 'Componentes');
  await espera(400);
  const abrir = async () => {
    await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          'aside[aria-label="Painel de edição"] button'
        ),
      ]
        .find(b => b.textContent.includes('Adicionar seção'))
        ?.click()
    );
    await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
    await espera(700);
  };
  const aberto = () =>
    page.evaluate(() => !!document.querySelector('[role="dialog"]'));

  await abrir();
  r.ok(
    'o botão Fechar do modal é alcançável',
    controleUsavel(
      await visibilidadeDe(page, '[role="dialog"] button[aria-label="Fechar"]')
    )
  );
  await clicarDeVerdade(page, '[role="dialog"] button[aria-label="Fechar"]');
  await espera(500);
  r.ok('clicar em Fechar fecha o modal', !(await aberto()));

  await abrir();
  await page.evaluate(() =>
    document
      .querySelector('div[class*="SectionModal_overlay"]')
      ?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  );
  await espera(500);
  r.ok('mousedown no overlay fecha', !(await aberto()));

  await abrir();
  await page.evaluate(() =>
    document
      .querySelector(
        '[role="dialog"] div[class*="SectionModal_card"], [role="dialog"]'
      )
      ?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  );
  await espera(400);
  r.ok('mousedown no card NÃO fecha', await aberto());

  // O anel de foco dentro do modal: ele é portalizado para fora do .ed-shell,
  // e o override de :focus-visible era escopado ao shell. Diálogo com
  // armadilha de Tab e zero indicação de foco.
  const anel = await page.evaluate(() => {
    const b = document.querySelector(
      '[role="dialog"] button[aria-label="Fechar"]'
    );
    b?.focus();
    const cs = getComputedStyle(b);
    return { largura: cs.outlineWidth, cor: cs.outlineColor };
  });
  await page.keyboard.press('Tab');
  await espera(200);
  r.ok(
    'o modal herda a fonte do editor, não a do tema do cliente',
    (
      await page.evaluate(
        () =>
          getComputedStyle(document.querySelector('[role="dialog"] h2'))
            .fontFamily
      )
    ).includes('Inter'),
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('[role="dialog"] h2'))
          .fontFamily
    )
  );

  // ScrollArea — nunca teve uma asserção.
  const barras = await page.evaluate(
    () =>
      document.querySelectorAll('[role="dialog"] div[class*="ScrollArea_bar"]')
        .length
  );
  r.ok('o modal tem as duas ScrollAreas', barras === 2, barras);
  const rolou = await page.evaluate(async () => {
    const vp = document.querySelector(
      '[role="dialog"] aside div[class*="ScrollArea_viewport"]'
    );
    if (!vp) return { erro: 'sem viewport' };
    const antes = vp.scrollTop;
    const btn = [...document.querySelectorAll('[role="dialog"] button')].find(
      b => b.getAttribute('aria-label') === 'Rolar para baixo'
    );
    if (!btn)
      return { semBotao: true, overflow: vp.scrollHeight > vp.clientHeight };
    btn.click();
    await new Promise(r2 => setTimeout(r2, 600));
    return { antes, depois: vp.scrollTop };
  });
  if (rolou.semBotao) {
    r.ok(
      'sem overflow, a barra some (data-hidden)',
      !rolou.overflow,
      JSON.stringify(rolou)
    );
  } else {
    r.ok(
      '"Rolar para baixo" move o viewport',
      rolou.depois > rolou.antes,
      JSON.stringify(rolou)
    );
  }
  await page.keyboard.press('Escape');
  await espera(400);
});

// ═══ 5. Desktop/Mobile é idempotente ════════════════════════════════════════
await bloco('responsivo', async () => {
  const classe = () =>
    page.evaluate(() => document.querySelector('iframe')?.className ?? '');
  const antes = await classe();
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() =>
      [...document.querySelectorAll('div[role="group"] button')]
        .find(b => /desktop/i.test(b.textContent ?? ''))
        ?.click()
    );
    await espera(250);
  }
  r.ok(
    'clicar no "Desktop" já ativo não alterna nada',
    (await classe()) === antes,
    `${antes} → ${await classe()}`
  );
});

// ═══ 6. DesktopOnlyNotice ═══════════════════════════════════════════════════
// Nenhum estágio abria o /gerador numa viewport de celular: `useIsMobile`
// nunca era exercitado.
await bloco('desktop-only', async () => {
  const { page: mob, erros: errosMob } = await novaAba(browser);
  await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mob.goto(`${BASE_URL}/gerador`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await mob
    .waitForFunction(
      () => /Melhor em telas maiores/.test(document.body.innerText),
      {
        timeout: 30000,
        polling: 250,
      }
    )
    .catch(() => {});
  const estado = await mob.evaluate(() => ({
    aviso: /Melhor em telas maiores/.test(document.body.innerText),
    shell: !!document.querySelector('.ed-shell'),
  }));
  r.ok(
    '≤768px mostra o aviso de desktop-only',
    estado.aviso,
    JSON.stringify(estado)
  );
  r.ok('e o shell do editor NÃO monta', !estado.shell);

  await mob.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const voltou = await mob
    .waitForFunction(() => !!document.querySelector('.ed-shell'), {
      timeout: 20000,
      polling: 250,
    })
    .then(() => true)
    .catch(() => false);
  r.ok('alargar a janela devolve o editor, sem reload', voltou);
  r.ok(
    'sem erros de página na aba mobile',
    errosMob.length === 0,
    errosMob[0] ?? ''
  );
  await mob.close();
});

r.ok('sem erros de página', erros.length === 0, erros.slice(0, 2).join(' | '));
await browser.close();
process.exit(r.fechar() ? 0 : 1);
