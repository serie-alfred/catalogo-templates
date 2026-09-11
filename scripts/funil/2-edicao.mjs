/**
 * Estágio 2b — regras de negócio da edição, dirigindo a UI de verdade.
 *
 * O foco são os singletons: `toggleSelection` e o botão de duplicar descrevem o
 * mesmo conjunto por caminhos diferentes, e enquanto discordavam era possível
 * pôr dois banners principais distintos na mesma home.
 */
import { relatorio, espera } from './lib/util.mjs';
import {
  abrirBrowser,
  novaAba,
  semear,
  trocarPagina,
  selecoesSalvas,
  secoesNoCanvas,
  badgesDe,
  adicionarPeloModal,
  gruposNaLista,
  clicarDeVerdade,
} from './lib/editor.mjs';

const r = relatorio('Estágio 2b — regras de edição');
const browser = await abrirBrowser();
const { page, erros } = await novaAba(browser);
const sel = (id, layoutKey, pagina) => ({
  uid: `u-${layoutKey}-${id}`,
  id,
  layoutKey,
  pagina,
});

// ── singletons: o modelo novo substitui o antigo, não soma ────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'showcase', 'home')],
});
await adicionarPeloModal(page, 'Vitrines', 'Vitrine Template 6');
r.ok(
  'Showcase06 substitui Showcase01',
  JSON.stringify(await selecoesSalvas(page)) === '["showcase:06"]',
  await selecoesSalvas(page)
);
r.ok(
  '  canvas com 1 seção',
  (await secoesNoCanvas(page)) === 1,
  await secoesNoCanvas(page)
);

await semear(page, {
  plataforma: 'VTEX',
  selecoes: [sel('01', 'header', 'common')],
});
await adicionarPeloModal(page, 'Header', 'Header Template 7', 'common');
r.ok(
  'Header07 substitui Header01 (regra common)',
  JSON.stringify(await selecoesSalvas(page)) === '["header:07"]',
  await selecoesSalvas(page)
);

await semear(page, {
  plataforma: 'VTEX',
  selecoes: [sel('06', 'spot', 'common')],
});
await adicionarPeloModal(
  page,
  'Card de Produto',
  'Card de Produto Template 7',
  'common'
);
r.ok(
  'Spot07 substitui Spot06',
  JSON.stringify(await selecoesSalvas(page)) === '["spot:07"]',
  await selecoesSalvas(page)
);

// ── não-singleton: coexistem ──────────────────────────────────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'bannerTriple', 'home')],
});
await adicionarPeloModal(page, 'Banner Triplo', 'Banner Triplo Template 6');
const triplos = await selecoesSalvas(page);
r.ok(
  'BannerTriple05 e 06 coexistem',
  triplos.length === 2 &&
    triplos.includes('bannerTriple:01') &&
    triplos.includes('bannerTriple:03'),
  triplos
);

// ── duplicar / remover pelos badges do canvas ─────────────────────────────────
const bTriplo = await badgesDe(page, 'banner-triple');
r.ok(
  'badge verde disponível em banner-triple',
  bTriplo.duplicar,
  JSON.stringify(bTriplo)
);
await page.evaluate(() => {
  const d = document.querySelector('iframe').contentDocument;
  [
    ...d.querySelector('.editor-section-actions').querySelectorAll('button'),
  ][0].click();
});
await espera(1400);
r.ok(
  'duplicar cria 3ª seção',
  (await secoesNoCanvas(page)) === 3,
  await secoesNoCanvas(page)
);
await badgesDe(page, 'banner-triple');
await page.evaluate(() => {
  const d = document.querySelector('iframe').contentDocument;
  [
    ...d.querySelector('.editor-section-actions').querySelectorAll('button'),
  ][1].click();
});
await espera(1400);
r.ok(
  'remover volta a 2 seções',
  (await secoesNoCanvas(page)) === 2,
  await secoesNoCanvas(page)
);

// ── o conserto: singleton não oferece duplicar, e a granularidade é por selection ──
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'banner', 'home'), sel('01', 'bannerFull', 'home')],
});
const bMain = await badgesDe(page, 'banner-main');
r.ok(
  'banner-main NÃO oferece duplicar',
  !bMain.duplicar && bMain.remover,
  JSON.stringify(bMain)
);
const bFull = await badgesDe(page, 'banner-full');
r.ok(
  'banner-full CONTINUA oferecendo duplicar',
  bFull.duplicar,
  JSON.stringify(bFull)
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('06', 'banner', 'home')],
});
r.ok(
  'banner-main template 6 também não oferece',
  !(await badgesDe(page, 'banner-main')).duplicar
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('04', 'bannerFull', 'category')],
});
await trocarPagina(page, 'category');
r.ok(
  'category-banner NÃO oferece duplicar',
  !(await badgesDe(page, 'category-banner')).duplicar
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'bannerProduct', 'product')],
});
await trocarPagina(page, 'product');
r.ok(
  'banner-top NÃO oferece duplicar',
  !(await badgesDe(page, 'banner-top')).duplicar
);

// a lista precisa concordar com o canvas, senão a regra volta pelo outro caminho.
// O botão só existe com a linha expandida (acordeão) e se identifica pelo title.
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'banner', 'home'), sel('01', 'bannerFull', 'home')],
});
// Uma linha tem DOIS controles de expandir com o mesmo rótulo — a setinha e o
// `+`, que são dois disclosures da mesma região. Clicar nos dois abre e fecha
// na mesma passada, então escopa-se pela classe do `+`.
await page.evaluate(() =>
  [...document.querySelectorAll('button[class*="SectionsPanel_toggle"]')]
    .filter(b => /^Expandir /.test(b.getAttribute('aria-label') ?? ''))
    .forEach(b => b.click())
);
await espera(600);
const duplicaveis = await page.evaluate(
  () => [...document.querySelectorAll('button[title="Duplicar seção"]')].length
);
r.ok(
  'lista oferece duplicar só para banner-full',
  duplicaveis === 1,
  `${duplicaveis} botões`
);

// ── estado legado: o conserto impede CRIAR, não cura o que já está no disco ───
// Quem duplicou um singleton antes deste conserto continua com as duas cópias:
// `sanitizeSelections` valida a hidratação mas não deduplica. O que o conserto
// garante é que a UI não oferece mais nenhum caminho para piorar o quadro.
await semear(page, {
  plataforma: 'Tray',
  selecoes: [
    sel('01', 'banner', 'home'),
    { uid: 'u2', id: '01', layoutKey: 'banner', pagina: 'home' },
  ],
});
r.ok(
  'duplicado legado sobrevive à hidratação (esperado)',
  (await selecoesSalvas(page)).length === 2,
  await selecoesSalvas(page)
);
r.ok(
  'e a UI não oferece duplicar de novo',
  !(await badgesDe(page, 'banner-main')).duplicar
);
// Trocar o modelo com duplicado legado no disco: antes o `findIndex` trocava só
// a primeira ocorrência e sobrava ["banner:06","banner:01"] — dois modelos
// diferentes no mesmo slot singleton, estado que a UI não sabe desfazer. Agora
// TODAS as ocorrências trocam, como o ramo do showcase sempre fez: a contagem
// não muda (nada some em silêncio) e o estado volta a ser coerente.
await adicionarPeloModal(page, 'Banners', 'Banners Template 6');
const conv = await selecoesSalvas(page);
r.ok(
  'duplicado legado: trocar o modelo troca TODAS as ocorrências',
  conv.length === 2 && conv.every(c => c === conv[0]),
  JSON.stringify(conv)
);

// ── painel direito e lista ────────────────────────────────────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'review', 'home')],
});
await page.evaluate(() =>
  document
    .querySelector('iframe')
    .contentDocument.querySelector('[data-selection="client-review"]')
    .click()
);
await espera(1100);
const painel = await page.evaluate(
  () =>
    document.querySelector('aside[aria-label="Propriedades"]')?.innerText ?? ''
);
r.ok(
  'painel direito mostra o estado vazio certo',
  /não expõe variáveis próprias/.test(painel),
  painel.replace(/\s+/g, ' ').slice(0, 90)
);

await semear(page, {
  plataforma: 'Tray',
  selecoes: [
    sel('01', 'specialOffers', 'home'),
    sel('01', 'homeCombined', 'home'),
  ],
});
const grupos = await gruposNaLista(page);
r.ok(
  'lista traz os grupos novos',
  grupos.includes('Ofertas Especiais') && grupos.includes('Combinações')
);

// ── troca de plataforma ───────────────────────────────────────────────────────
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'review', 'home'), sel('01', 'header', 'common')],
});
await page.evaluate(() =>
  [...document.querySelectorAll('[aria-haspopup="listbox"]')]
    .find(
      b =>
        /Tray|Wake|VTEX/.test(b.textContent) &&
        !/Homepage|Todas as páginas|Página de/.test(b.textContent)
    )
    .click()
);
await espera(500);
await page.evaluate(() =>
  [...document.querySelectorAll('[role="option"]')]
    .find(o => o.textContent.trim() === 'VTEX')
    .click()
);
await espera(1500);
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x =>
    /Trocar|Continuar|Confirmar/i.test(x.textContent)
  );
  if (b) b.click();
});
await espera(1800);
r.ok(
  'Tray→VTEX descarta o incompatível e mantém o resto',
  JSON.stringify(await selecoesSalvas(page)) === '["header:01"]',
  await selecoesSalvas(page)
);

// ── acordeão da lista: vários abertos, cada um por conta ────────────────────
// Regressão de "só abrem, fecham quando clico em outro". A causa era
// `expanded = open || selected`: a seleção é global e anulava o toggle local,
// então o `−` da linha selecionada não tinha como produzir `false`.
await semear(page, {
  plataforma: 'Tray',
  selecoes: [
    sel('01', 'header', 'common'),
    sel('01', 'banner', 'home'),
    sel('01', 'bannerFull', 'home'),
    sel('01', 'footer', 'common'),
  ],
});

const linhas = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('div[class*="SectionsPanel_row"]')].map(
      l => ({
        nome: l.querySelector('button[class*="name"]')?.textContent.trim(),
        aberta: l.getAttribute('data-expanded') === 'true',
        selecionada: l.getAttribute('data-selected') === 'true',
        caretAria: l
          .querySelector('button[class*="affordance"]')
          ?.getAttribute('aria-expanded'),
        corpo: !!l.querySelector('div[class*="children"]'),
      })
    )
  );
const clicarNaLinha = (i, classe) =>
  page.evaluate(
    (idx, cls) => {
      const alvo = document.querySelectorAll('div[class*="SectionsPanel_row"]')[
        idx
      ];
      const b = alvo?.querySelector(`button[class*="${cls}"]`);
      b?.click();
      return !!b;
    },
    i,
    classe
  );

const l0 = await linhas();
r.ok(
  'a lista traz as 4 linhas',
  l0.length === 4,
  JSON.stringify(l0.map(l => l.nome))
);
r.ok(
  'a setinha é um <button> com aria-expanded',
  l0.length > 0 && l0.every(l => l.caretAria === 'false'),
  JSON.stringify(l0.map(l => l.caretAria))
);

r.ok('a setinha responde ao clique', await clicarNaLinha(0, 'affordance'));
await espera(500);
r.ok('clicar na setinha ABRE a linha', (await linhas())[0].aberta);
await clicarNaLinha(0, 'affordance');
await espera(500);
r.ok('clicar na setinha FECHA a linha', !(await linhas())[0].aberta);

for (const i of [0, 1, 2]) {
  await clicarNaLinha(i, 'toggle');
  await espera(350);
}
let le = await linhas();
r.ok(
  'três linhas ficam abertas ao mesmo tempo',
  le.filter(l => l.aberta).length === 3,
  JSON.stringify(le.map(l => l.aberta))
);
await clicarNaLinha(1, 'toggle');
await espera(450);
le = await linhas();
r.ok(
  'fechar uma não fecha as outras',
  le[0].aberta && !le[1].aberta && le[2].aberta,
  JSON.stringify(le.map(l => l.aberta))
);

// O bug relatado, na forma exata em que o usuário o encontrou.
await clicarNaLinha(3, 'name');
await espera(800);
le = await linhas();
r.ok('selecionar pelo nome expande a linha', le[3].aberta && le[3].selecionada);
await clicarNaLinha(3, 'toggle');
await espera(600);
le = await linhas();
r.ok(
  'o "−" FECHA a linha SELECIONADA (era o bug)',
  !le[3].aberta && le[3].selecionada,
  JSON.stringify(le[3])
);

// Recolher todas: só existe quando resolve algum problema.
const barra = () =>
  page.evaluate(
    () =>
      !!document.querySelector('button[aria-label="Recolher todas as seções"]')
  );
for (const i of [0, 1, 2]) {
  if (!(await linhas())[i].aberta) {
    await clicarNaLinha(i, 'toggle');
    await espera(300);
  }
}
r.ok('"Recolher todas" aparece com 2+ linhas abertas', await barra());
r.ok(
  '"Recolher todas" é alcançável de verdade',
  await clicarDeVerdade(page, 'button[aria-label="Recolher todas as seções"]')
);
await espera(600);
le = await linhas();
r.ok(
  '"Recolher todas" fecha todas',
  le.every(l => !l.aberta),
  JSON.stringify(le.map(l => l.aberta))
);
r.ok('e a própria barra some quando não há nada aberto', !(await barra()));

// A setinha não pode sumir sob o cursor: era ela que virava grip de arraste.
const sobHover = await page.evaluate(async () => {
  const l = document.querySelectorAll('div[class*="SectionsPanel_row"]')[1];
  l.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  await new Promise(r => setTimeout(r, 300));
  const caret = l.querySelector('button[class*="affordance"]');
  const grip = l.querySelector('button[class*="handle"]');
  const cr = caret?.getBoundingClientRect();
  return {
    caretPresente: !!caret,
    caretOpaco: caret ? Number(getComputedStyle(caret).opacity) : 0,
    caretLargura: cr ? Math.round(cr.width) : 0,
    gripPresente: !!grip,
    gripAEsquerda: grip
      ? grip.getBoundingClientRect().right <= (cr?.left ?? 0)
      : false,
  };
});
r.ok(
  'com o cursor na linha a setinha CONTINUA lá e clicável',
  sobHover.caretPresente &&
    sobHover.caretOpaco === 1 &&
    sobHover.caretLargura === 24,
  JSON.stringify(sobHover)
);
r.ok(
  'o grip aparece à esquerda da setinha, sem tomar o slot dela',
  sobHover.gripPresente && sobHover.gripAEsquerda,
  JSON.stringify(sobHover)
);

// ── arraste: só o bucket do meio, e a nova ordem chega ao estado ───────────
// `aria-label="Reordenar X"` não aparecia em NENHUM estágio. E `moveSection`
// reordena o array `selections`, que é a ordem que vai para o config.json —
// então um arraste quebrado entrega o tema com as seções fora de ordem.
await semear(page, {
  plataforma: 'Tray',
  selecoes: [
    sel('01', 'header', 'common'),
    sel('01', 'banner', 'home'),
    sel('01', 'bannerFull', 'home'),
    sel('01', 'showcase', 'home'),
    sel('01', 'footer', 'common'),
  ],
});

const handles = await page.evaluate(() =>
  [...document.querySelectorAll('button[aria-label^="Reordenar "]')].map(b =>
    b.getAttribute('aria-label')
  )
);
r.ok(
  'só as linhas do bucket de conteúdo têm handle de arraste',
  handles.length === 3 &&
    !handles.some(h => /Header|Footer|Breadcrumb/i.test(h)),
  handles.join(' | ')
);

const caixaDoHandle = i =>
  page.evaluate(idx => {
    const b = [
      ...document.querySelectorAll('button[aria-label^="Reordenar "]'),
    ][idx];
    if (!b) return null;
    b.closest('div[class*="SectionsPanel_row"]')?.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true })
    );
    const r2 = b.getBoundingClientRect();
    return { x: r2.x + r2.width / 2, y: r2.y + r2.height / 2 };
  }, i);

const ordemAntes = await selecoesSalvas(page);
const origem = await caixaDoHandle(0);
const destino = await caixaDoHandle(2);
if (origem && destino) {
  await page.mouse.move(origem.x, origem.y);
  await page.mouse.down();
  // Passa dos 4px do `activationConstraint` antes de mirar no destino.
  await page.mouse.move(origem.x, origem.y + 12, { steps: 4 });
  await page.mouse.move(destino.x, destino.y + 10, { steps: 14 });
  await page.mouse.up();
  await espera(1400);
}
const ordemDepois = await selecoesSalvas(page);
r.ok(
  'arrastar reordena `selections` de verdade',
  JSON.stringify(ordemDepois) !== JSON.stringify(ordemAntes),
  `${ordemAntes.join(',')} → ${ordemDepois.join(',')}`
);
r.ok(
  'a reordenação não perde nem duplica seção',
  ordemDepois.length === ordemAntes.length &&
    new Set(ordemDepois).size === new Set(ordemAntes).size,
  ordemDepois.join(',')
);

const ordemCanvas = await page.evaluate(() =>
  [
    ...(document
      .querySelector('iframe')
      ?.contentDocument?.querySelectorAll('[data-selection]') ?? []),
  ].map(e => e.getAttribute('data-selection'))
);
r.ok(
  'header continua no topo e footer no fim depois do arraste',
  ordemCanvas[0] === 'header' && ordemCanvas.at(-1) === 'footer',
  ordemCanvas.join(' > ')
);

await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('.ed-shell', { timeout: 60000 });
await page
  .waitForFunction(
    n =>
      (JSON.parse(localStorage.getItem('layoutSelections') ?? '[]').length ??
        0) === n,
    { timeout: 30000, polling: 250 },
    ordemDepois.length
  )
  .catch(() => {});
r.ok(
  'a ordem nova sobrevive ao reload',
  JSON.stringify(await selecoesSalvas(page)) === JSON.stringify(ordemDepois),
  (await selecoesSalvas(page)).join(',')
);

// ── o popup do token da Wake ───────────────────────────────────────────────
// Nunca era aberto pelo funil: `semear` grava `layoutPlatform` direto, e só o
// `changePlatform` abre o diálogo. Semear Tray e escolher Wake na UI é o
// caminho que o cliente percorre.
await semear(page, {
  plataforma: 'Tray',
  selecoes: [sel('01', 'header', 'common')],
});
await clicarDeVerdade(page, 'button[class*="card"][aria-haspopup="listbox"]');
await espera(500);
await page.evaluate(() =>
  [...document.querySelectorAll('[role="option"]')]
    .find(o => o.textContent.trim() === 'Wake')
    ?.click()
);
const abriuWake = await page
  .waitForSelector('.wake-popup', { timeout: 12000 })
  .then(() => true)
  .catch(() => false);
r.ok('escolher Wake abre o popup do token', abriuWake);

if (abriuWake) {
  const anatomia = await page.evaluate(() => {
    const el = document.querySelector('.wake-popup');
    const botoes = [...el.querySelectorAll('button')];
    return {
      role: el.getAttribute('role'),
      tipos: botoes.map(b => b.type),
      rotulos: botoes.map(
        b => b.textContent.trim() || b.getAttribute('aria-label') || '?'
      ),
      prometeEnviar: /(^|\s)enviar(\s|$)/i.test(el.innerText),
      avisoVazio: !!el.querySelector('[role="status"]'),
    };
  });
  r.ok(
    'todo botão do popup é type="button"',
    anatomia.tipos.every(t => t === 'button'),
    anatomia.tipos.join(',')
  );
  r.ok(
    'o popup NÃO promete "Enviar" — nada é enviado daqui',
    !anatomia.prometeEnviar,
    anatomia.rotulos.join(' | ')
  );
  r.ok(
    'o ✕ tem nome acessível',
    anatomia.rotulos.every(x => x !== '?'),
    anatomia.rotulos.join(' | ')
  );
  r.ok('campo vazio avisa a consequência', anatomia.avisoVazio);
  r.ok(
    'o popup é um diálogo de verdade',
    anatomia.role === 'dialog',
    anatomia.role
  );

  await page.type('#wakeToken', 'TOKEN-DIGITADO-NO-POPUP');
  await espera(700);
  r.ok(
    'o token persiste no onChange, antes de qualquer botão',
    (await page.evaluate(() => localStorage.getItem('wakeToken'))) ===
      'TOKEN-DIGITADO-NO-POPUP'
  );

  await page.keyboard.press('Escape');
  await espera(500);
  r.ok(
    'Escape fecha o popup',
    !(await page.evaluate(() => !!document.querySelector('.wake-popup')))
  );
}

r.ok(
  'sem erros de página na bateria',
  erros.length === 0,
  erros.slice(0, 2).join(' | ')
);
await browser.close();
process.exit(r.fechar() ? 0 : 1);
