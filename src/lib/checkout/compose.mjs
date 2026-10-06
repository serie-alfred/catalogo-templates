/**
 * O compose do checkout: base do modelo (dist, com slots) + cores/fonte/logo
 * da loja → os 4 arquivos que o time cola no Admin, mais o README de upload.
 *
 * É a INVARIANTE CENTRAL do pipeline (docs/arquitetura.md): o /gerador roda
 * esta função no navegador para o preview e o generator roda a mesma função,
 * do mesmo SHA, para o arquivo do cliente. Por isso ela é PURA e
 * determinística — sem fs, sem rede, sem data/hora, sem aleatório, sem mexer
 * nos objetos recebidos. Mesma entrada, mesmos bytes.
 *
 *   composeCheckout(model, sources, { level2, level1, logo, version })
 *     model   — o checkout.json do modelo, já lido
 *     sources — { css, js, header, footer }: a base do modelo (dist/<Modelo>/*), já lida
 *     level2  — faststore.variables do config (chave do config → valor)
 *     level1  — faststore.checkout.variables ({ '--checkout-<papel>': valor })
 *     logo    — faststore.assets.logo (data URL ou https), opcional
 *     version — faststore.checkout.version (SHA do checkout-vtex), opcional
 *   → { css, js, header, footer, readme, avisos }
 *
 * Slots (o compose preenche; cada um aparece exatamente uma vez na base):
 *   css    /* ETC:SLOT font-import *\/  → @import do Google Fonts (primeiro statement)
 *          /* ETC:SLOT tokens *\/       → :root { nível 2 + nível 1 (e guardas) + derivadas, em hex }
 *   js     /* ETC:SLOT config *\/       → CONFIG = { modelo, contrato, versao }
 *          /* ETC:SLOT integracoes *\/  → vazio (snippets de terceiros, fase futura)
 *   header /* ETC:SLOT tokens-header *\/ e {{ETC_LOGO_SRC}}
 *   footer /* ETC:SLOT tokens-footer *\/
 * O que o compose escreve fica entre `/* ETC:BEGIN <slot> *\/` e `/* ETC:END <slot> *\/`,
 * para o lint e o CheckoutChecker saberem onde o hex é permitido.
 */
import { level2KeyFor, level2Value, isFontKey, fontStack } from './level2.mjs';
import { contrastOn, corVisivel, formatarRazao, isFontFamily, limiteVisivel, luminance, mix, normalizeHex, parseFontValue, piorContraste, primaryFamily, textoLegivel } from './derive.mjs';
import { validarModelo } from './modelo.mjs';

export class ErroCompose extends Error {
  constructor(codigo, mensagem) {
    super(`compose do checkout: ${mensagem}`);
    this.name = 'ErroCompose';
    this.codigo = codigo;
  }
}

export const slot = nome => `/* ETC:SLOT ${nome} */`;
export const inicioBloco = nome => `/* ETC:BEGIN ${nome} */`;
export const fimBloco = nome => `/* ETC:END ${nome} */`;
export const MARCADOR_LOGO = '{{ETC_LOGO_SRC}}';
export const PLACEHOLDER_LOGO = '{{LOGO_SRC}}';

// ── Fonte ───────────────────────────────────────────────────────────────────

/** Os pesos que todo tema pede ao Google Fonts (`fontVariables.js` do generator). */
export const GOOGLE_FONT_WEIGHTS = '300;400;500;600;700';

/**
 * Mesmo formato, byte a byte, de `buildGoogleFontsImport`
 * (`produtos-template-generator/src/utils/fontVariables.js`), inclusive o `\n\n`
 * do fim. O teste compara as duas.
 */
export function buildGoogleFontsImport(fonts) {
  const unicas = [...new Set(fonts)].filter(Boolean);
  if (unicas.length === 0) return '';
  const families = unicas
    .map(font => `family=${font.trim().replace(/\s+/g, '+')}:wght@${GOOGLE_FONT_WEIGHTS}`)
    .join('&');
  return `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');\n\n`;
}

/** Famílias que não vêm do Google Fonts: não geram @import. */
const FONTES_DO_SISTEMA = new Set([
  'arial', 'helvetica', 'helvetica neue', 'georgia', 'times', 'times new roman', 'verdana', 'tahoma',
  'trebuchet ms', 'segoe ui', 'system-ui', '-apple-system', 'blinkmacsystemfont',
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy',
]);
const GENERICAS = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui']);

// ── Validação de valores ────────────────────────────────────────────────────

function valorDoPapel(papel, valor, origem) {
  if (papel.type === 'color') {
    const hex = normalizeHex(valor);
    if (!hex) throw new ErroCompose('valor-invalido', `${origem} ${papel.cssVar} = "${valor}" não é hex (#rgb ou #rrggbb)`);
    return hex;
  }
  if (!parseFontValue(valor)) {
    throw new ErroCompose('valor-invalido', `${origem} ${papel.cssVar} = "${valor}" não é um valor de fonte válido`);
  }
  const v = valor.trim().replace(/\s+/g, ' ');
  // Uma família solta ("Roboto") ganha a mesma pilha do nível 2; pilha pronta passa como veio.
  return isFontFamily(v) && !GENERICAS.has(v.toLowerCase()) ? fontStack(v) : v;
}

/**
 * O nível 2 é da LOJA (`faststore.variables`), não do checkout: valor que não
 * serve ao checkout NÃO lança (gate0 #14b) — o tema da loja não pode cair por
 * causa do checkout. Volta `{ valor }` ou `{ motivo }`; quem chama avisa e usa o
 * nível 3.
 */
function valorDoNivel2(key, valor) {
  if (isFontKey(key)) {
    return isFontFamily(typeof valor === 'string' ? valor : '')
      ? { valor: level2Value(key, valor) }
      : { motivo: 'não é um nome de família (ex.: "Montserrat")' };
  }
  const hex = normalizeHex(valor);
  return hex ? { valor: hex } : { motivo: 'não é hex (#rgb ou #rrggbb)' };
}

const ehObjeto = v => v != null && typeof v === 'object' && !Array.isArray(v);

// ── Resolução dos tokens ────────────────────────────────────────────────────

/** A cor veio da loja (nível 1 ou 2)? Só então uma derivada é calculada. */
const daLoja = e => e.fonte === 'nivel1' || e.fonte === 'nivel2';

/**
 * Resolve cada papel para o valor que ele terá na loja, e diz de onde veio.
 *
 *   papel comum:   nível 1 (faststore.checkout.variables) → nível 2 (faststore.variables) → nível 3 (Figma)
 *   papel derivado: nível 1 (se for do painel) → CALCULADO quando alguma base veio da loja → nível 3
 *
 * Duas guardas protegem o nível 2, que é a cor global da loja e não foi
 * escolhida para o checkout (gate0 #14):
 *   - nível 2 inválido (formato) → aviso `nivel2-invalido` + nível 3; não lança.
 *     Só lança o que é exclusivo do checkout: papel desconhecido ou derivado,
 *     nível 1 inválido;
 *   - guarda de VISIBILIDADE: o papel com `visibilidade: {contra, min}` no
 *     checkout.json cuja cor de nível 2 fica com razão de contraste WCAG < `min`
 *     contra algum dos fundos `contra` (a loja com `colorPrimaryBackground`
 *     #ffffff: botão branco em página branca) usa o nível 3 do Figma e avisa
 *     `guarda-visibilidade`. O nível 1 não passa pela guarda: é escolha explícita
 *     do cliente no painel.
 *
 * A derivada só é calculada quando a cor de base vem da loja. No nível 3 vale o
 * hex do Figma: o texto branco do "Continuar comprando" laranja é decisão do
 * design, e a regra de contraste (YIQ ≥ 128 → preto) daria preto ali. A base que
 * a guarda devolveu ao Figma conta como nível 3.
 *
 * Devolve `{ papeis: [{papel, valor, fonte}], root: [[nome, valor]], avisos }`,
 * onde `root` é o que vai no `:root` (nível 2 consumido + nível 1 + guardas +
 * derivadas) e `fonte` é `nivel1 | nivel2 | nivel3 | guarda | derivado`.
 */
export function resolveTokens(model, { level2 = {}, level1 = {} } = {}) {
  const porVar = new Map(model.papeis.map(p => [p.cssVar, p]));
  const avisos = [];

  const l1 = level1 ?? {};
  if (!ehObjeto(l1)) {
    throw new ErroCompose('valor-invalido', 'faststore.checkout.variables precisa ser um objeto { "--checkout-<papel>": valor }');
  }
  let l2 = level2 ?? {};
  if (!ehObjeto(l2)) {
    avisos.push({ codigo: 'nivel2-invalido', mensagem: 'faststore.variables não é um objeto { "colorPrimary": "#…", … }: o checkout usa o nível 3 do Figma nos papéis que herdariam da loja' });
    l2 = {};
  }

  for (const [nome, valor] of Object.entries(l1)) {
    const papel = porVar.get(nome);
    if (!papel) {
      throw new ErroCompose('papel-desconhecido', `"${nome}" não é papel do ${model.id} (papéis: ${model.papeis.filter(p => p.painel).map(p => p.cssVar).join(', ')})`);
    }
    if (!papel.painel) {
      throw new ErroCompose('papel-derivado', `"${nome}" é calculado (${papel.derivado.regra} de ${papel.derivado.de}) e não se define no config`);
    }
    valorDoPapel(papel, valor, 'faststore.checkout.variables');
  }

  const efetivo = new Map();
  const invalidos = new Map(); // chave do config → { bruto, motivo, papeis }
  for (const papel of model.papeis) {
    if (papel.derivado) continue;
    if (Object.hasOwn(l1, papel.cssVar)) {
      efetivo.set(papel.cssVar, { valor: valorDoPapel(papel, l1[papel.cssVar], 'faststore.checkout.variables'), fonte: 'nivel1' });
      continue;
    }
    const key = papel.level2 ? level2KeyFor(papel.level2) : null;
    const bruto = key != null ? l2[key] : undefined;
    if (bruto != null && bruto !== '') {
      const r = valorDoNivel2(key, bruto);
      if (r.valor != null) {
        efetivo.set(papel.cssVar, { valor: r.valor, fonte: 'nivel2', key });
        continue;
      }
      const inv = invalidos.get(key) ?? { bruto, motivo: r.motivo, papeis: [] };
      inv.papeis.push(papel);
      invalidos.set(key, inv);
    }
    efetivo.set(papel.cssVar, { valor: papel.level3, fonte: 'nivel3' });
  }
  for (const [key, { bruto, motivo, papeis }] of invalidos) {
    avisos.push({
      codigo: 'nivel2-invalido',
      mensagem: `faststore.variables.${key} = ${JSON.stringify(bruto)} ${motivo}: o checkout usa o nível 3 do Figma em ${papeis.map(p => `${p.cssVar} (${p.level3})`).join(', ')}`,
    });
  }

  // Guarda de visibilidade: depois do laço, porque os fundos (`contra`) são papéis
  // resolvidos nele. O `validarModelo` garante que o fundo não tem guarda própria.
  for (const papel of model.papeis) {
    const guarda = papel.visibilidade;
    const e = efetivo.get(papel.cssVar);
    if (!guarda || !e || e.fonte !== 'nivel2') continue;
    const fundos = guarda.contra.map(nome => ({ nome, valor: efetivo.get(nome).valor }));
    const pior = piorContraste(e.valor, fundos);
    if (!pior || pior.razao >= guarda.min) continue;
    efetivo.set(papel.cssVar, { valor: papel.level3, fonte: 'guarda', key: e.key, herdado: e.valor });
    const doFigma = piorContraste(papel.level3, fundos);
    avisos.push({
      codigo: 'guarda-visibilidade',
      mensagem: `${papel.cssVar} usa o nível 3 do Figma (${papel.level3}): a cor da loja faststore.variables.${e.key} = ${e.valor} tem contraste ${formatarRazao(pior.razao)} contra ${pior.nome} (${pior.valor}), abaixo do mínimo ${formatarRazao(guarda.min)}`
        + (doFigma.razao < guarda.min ? `; o nível 3 também fica abaixo contra ${doFigma.nome} (${formatarRazao(doFigma.razao)}): revise ${doFigma.nome}` : ''),
    });
  }

  // As derivadas "visivel" (gate0 #28) usam as outras derivadas (o texto do
  // header, #23) como alternativa: vão numa segunda passada.
  const derivados = [
    ...model.papeis.filter(p => p.derivado && p.derivado.regra !== 'visivel'),
    ...model.papeis.filter(p => p.derivado?.regra === 'visivel'),
  ];
  const neutros = new Map(model.neutros.map(n => [n.cssVar, n]));
  for (const papel of derivados) {
    if (Object.hasOwn(l1, papel.cssVar)) {
      efetivo.set(papel.cssVar, { valor: valorDoPapel(papel, l1[papel.cssVar], 'faststore.checkout.variables'), fonte: 'nivel1' });
      continue;
    }
    const { regra, de, com, peso, sobre, min } = papel.derivado;
    const base = efetivo.get(de);
    if (regra === 'visivel') {
      // gate0 #28: o que se desenha sobre o fundo do header/rodapé. `de` é papel ou
      // neutro fixo; abaixo do limite (o menor entre `min` e a razão do par no
      // Figma), a alternativa — pura ou na menor mistura com o fundo.
      const neutro = neutros.get(de);
      const cor = neutro ? { valor: neutro.valor, fonte: 'nivel3' } : base;
      const fundo = efetivo.get(sobre);
      const alt = efetivo.get(papel.derivado.senao);
      if (![cor, fundo, alt].some(e => daLoja(e) || e.fonte === 'derivado')) {
        efetivo.set(papel.cssVar, { valor: papel.level3, fonte: 'nivel3' });
        continue;
      }
      const nivel3De = neutro ? neutro.valor : model.papeis.find(p => p.cssVar === de).level3;
      const nivel3Sobre = model.papeis.find(p => p.cssVar === sobre).level3;
      const limite = limiteVisivel(min, nivel3De, nivel3Sobre);
      const r = corVisivel(cor.valor, fundo.valor, limite, alt.valor, { misturar: !!papel.derivado.misturar });
      efetivo.set(papel.cssVar, { valor: r.valor, fonte: 'derivado' });
      if (r.trocou) {
        const como = papel.derivado.misturar
          ? `a mistura de ${papel.derivado.senao} (${alt.valor}) com o fundo, ${r.peso}% da primeira`
          : `${papel.derivado.senao} = ${alt.valor}`;
        avisos.push({
          codigo: 'guarda-contraste',
          mensagem: `${papel.cssVar} virou ${r.valor} (${como}, ${formatarRazao(r.razaoFinal)}) porque ${de} = ${cor.valor} tem contraste ${formatarRazao(r.razao)} contra ${sobre} = ${fundo.valor}, abaixo do limite ${formatarRazao(limite)}`
            + (r.alcancou ? '' : `; nem a alternativa chega ao limite: revise ${sobre}`),
        });
      }
    } else if (regra === 'legivel') {
      // gate0 #23: o texto do header segue o texto da página enquanto ele se lê
      // sobre o fundo do header; senão, o contraste calculado desse fundo.
      const fundo = efetivo.get(sobre);
      if (!daLoja(base) && !daLoja(fundo)) {
        efetivo.set(papel.cssVar, { valor: papel.level3, fonte: 'nivel3' });
        continue;
      }
      const r = textoLegivel(base.valor, fundo.valor, min);
      efetivo.set(papel.cssVar, { valor: r.valor, fonte: 'derivado' });
      if (r.trocou) {
        avisos.push({
          codigo: 'guarda-contraste',
          mensagem: `${papel.cssVar} virou ${r.valor} (o contraste de ${sobre} = ${fundo.valor}) porque ${de} = ${base.valor} tem contraste ${formatarRazao(r.razao)} contra ele, abaixo do mínimo ${formatarRazao(min)}: o texto e o stepper do header não usam o texto da página`,
        });
      }
    } else if (regra === 'contraste') {
      if (!daLoja(base)) {
        efetivo.set(papel.cssVar, { valor: papel.level3, fonte: 'nivel3' });
        continue;
      }
      const valor = contrastOn(base.valor);
      efetivo.set(papel.cssVar, { valor, fonte: 'derivado' });
      if (valor !== papel.level3) {
        avisos.push({
          codigo: 'guarda-contraste',
          mensagem: `${papel.cssVar} virou ${valor} (o Figma usa ${papel.level3}) porque ${de} = ${base.valor} tem luminância ${Math.round(luminance(base.valor))} (limiar 128)`,
        });
      }
    } else {
      const outro = efetivo.get(com);
      if (!daLoja(base) && !daLoja(outro)) {
        efetivo.set(papel.cssVar, { valor: papel.level3, fonte: 'nivel3' });
        continue;
      }
      efetivo.set(papel.cssVar, { valor: mix(base.valor, outro.valor, peso), fonte: 'derivado' });
    }
  }

  // :root — o nível 2 só entra se algum papel o usa de fato (a guarda pode ter
  // devolvido todos ao Figma); o papel que a guarda devolveu entra como nível 1
  // com o hex do Figma, porque o mesmo nível 2 ainda pode estar no :root por
  // outro papel (ou no preview) e a cadeia do 00-tokens.css o pegaria.
  const root = [];
  const nivel2 = new Set();
  for (const papel of model.papeis) {
    const e = efetivo.get(papel.cssVar);
    if (e.fonte === 'nivel2' && !nivel2.has(papel.level2)) {
      nivel2.add(papel.level2);
      root.push([papel.level2, e.valor]);
    }
  }
  for (const papel of model.papeis) {
    const e = efetivo.get(papel.cssVar);
    if (e.fonte === 'nivel1' || e.fonte === 'guarda') root.push([papel.cssVar, e.valor]);
  }
  for (const papel of model.papeis) {
    const e = efetivo.get(papel.cssVar);
    if (e.fonte === 'derivado') root.push([papel.cssVar, e.valor]);
  }

  return {
    papeis: model.papeis.map(papel => ({ papel, ...efetivo.get(papel.cssVar) })),
    root,
    avisos,
  };
}

function bloco(seletor, pares) {
  return `${seletor} {\n${pares.map(([nome, valor]) => `  ${nome}: ${valor};\n`).join('')}}\n`;
}

/**
 * Só o `:root` (nível 2 + nível 1 + derivadas). É o que o /gerador escreve no
 * `<style id="ck-tokens">` do iframe de preview por cima da base; o arquivo
 * composto traz o MESMO texto dentro do slot `tokens` — o estágio 2 do funil
 * prova que "base + este :root" pinta igual ao arquivo composto.
 */
export function emitTokens(model, { level2 = {}, level1 = {} } = {}) {
  return bloco(':root', resolveTokens(model, { level2, level1 }).root);
}

/**
 * Os aliases `--ck01-*` já resolvidos, escopados em `.etm-header`/`.etm-footer`.
 * Os templates também aparecem no Order Placed, onde o checkout6-custom.css não
 * carrega; ali só esse bloco define as cores. `:root` no body venceria os
 * tokens da página, por isso é escopo de classe.
 */
function tokensEscopados(model, resolvido, seletor) {
  const porVar = new Map(resolvido.papeis.map(r => [r.papel.cssVar, r.valor]));
  const pares = [
    ...model.papeis.map(p => [p.alias, porVar.get(p.cssVar)]),
    ...model.neutros.map(n => [n.cssVar, n.valor]),
  ];
  return bloco(seletor, pares);
}

// ── Logo, versão, texto ─────────────────────────────────────────────────────

const LOGO_DATA = /^data:image\/(png|jpe?g|gif|webp|svg\+xml)(;[a-z0-9=.+-]+)*(;base64)?,/i;

/**
 * O logo é `faststore.assets.logo`, um dado GLOBAL da loja (como o nível 2), não
 * do checkout: logo que não cabe no template NÃO lança (gate0 #14b). O header sai
 * com o placeholder `{{LOGO_SRC}}` para o time trocar, e o motivo vira aviso.
 * → `{ src, aviso }`: `src` já escapado para o atributo, ou `null`.
 */
function validarLogo(model, logo) {
  const semLogo = (codigo, motivo) => ({
    src: null,
    aviso: { codigo, mensagem: `${motivo}: o header sai com ${PLACEHOLDER_LOGO} para o time trocar` },
  });
  if (logo == null || logo === '') return semLogo('logo-ausente', 'sem logo no config');
  if (typeof logo !== 'string' || !(LOGO_DATA.test(logo) || /^https:\/\/[^\s]+$/.test(logo))) {
    return semLogo('logo-invalido', 'faststore.assets.logo não é um data URL de imagem (png, jpg, gif, webp, svg) nem uma URL https');
  }
  if (/["<>\s]/.test(logo)) return semLogo('logo-invalido', 'faststore.assets.logo tem aspas, < > ou espaço e não cabe num atributo src');
  if (logo.length > model.limites.logoErroBytes) {
    return semLogo('logo-grande', `faststore.assets.logo tem ${logo.length} bytes; o limite é ${model.limites.logoErroBytes} (o template do Admin guarda o data URL inteiro)`);
  }
  if (logo.length > model.limites.logoAvisoBytes) {
    return {
      src: logo.replace(/&/g, '&amp;'),
      aviso: { codigo: 'logo-pesado', mensagem: `o logo tem ${logo.length} bytes (acima de ${model.limites.logoAvisoBytes}); ele vai inteiro no template e em toda página do checkout` },
    };
  }
  return { src: logo.replace(/&/g, '&amp;'), aviso: null };
}

function validarVersao(version) {
  if (version == null || version === '') return null;
  if (typeof version !== 'string' || !/^[\w.-]{1,64}$/.test(version) || version.includes('--')) {
    throw new ErroCompose('versao-invalida', `version "${version}" não parece um SHA nem uma tag`);
  }
  return version;
}

function banner(model, versao) {
  return `E-temas · ${model.id} · contrato ${model.contrato} · versão ${versao ?? 'sem SHA (build local)'} — gerado pelo lib/compose.mjs do checkout-vtex; não edite à mão: mude as cores no /gerador e gere de novo`;
}

function contar(texto, agulha) {
  let n = 0;
  for (let i = texto.indexOf(agulha); i !== -1; i = texto.indexOf(agulha, i + agulha.length)) n++;
  return n;
}

function exigirUnico(texto, agulha, arquivo) {
  const n = contar(texto, agulha);
  if (n !== 1) throw new ErroCompose('slot', `${agulha} aparece ${n}× em ${arquivo} (tem que ser exatamente 1×)`);
}

function preencher(texto, nome, conteudo) {
  const i = texto.indexOf(slot(nome));
  return texto.slice(0, i) + `${inicioBloco(nome)}\n${conteudo}${fimBloco(nome)}` + texto.slice(i + slot(nome).length);
}

function readme(model, { versao, resolvido, avisos, placeholders, logo }) {
  const a = model.arquivos;
  const linhas = [];
  linhas.push(`# Checkout da loja — ${model.id} (E-temas)`, '');
  linhas.push(`Gerado pelo \`checkout-vtex\` na versão \`${versao ?? 'sem SHA (build local)'}\` (contrato ${model.contrato}).`);
  linhas.push('Não edite estes arquivos à mão: mude as cores no /gerador e gere o tema de novo.', '');
  linhas.push('## Antes de colar (bloqueia)', '');
  linhas.push('Salvar em Admin › Checkout › ⚙ do site › Código **publica na hora, para todos os compradores**.', '');
  linhas.push(`1. **Faça backup** dos 4 arquivos que estão no Admin hoje (copie o conteúdo de cada aba para um arquivo).`);
  linhas.push(`2. **Abra \`https://<conta>.vtexcommercestable.com.br/files/${a.css}\` e procure \`/* source: <\`.** Se aparecer, a conta tem app com builder \`checkout-ui-custom\` e o Admin é ignorado: **pare** e fale com o time.`);
  linhas.push('3. **Confira se o app `vtex.checkout-ui-custom` está instalado** (`vtex ls`). Se estiver, o CSS dele entra antes do nosso: **pare** e fale com o time.');
  linhas.push('4. Se a conta ainda tiver `/arquivos/checkout-custom.css` ou `.js` no CMS legado, eles também carregam no checkout: combine com o time antes.', '');
  linhas.push('## Onde colar', '');
  linhas.push('| Arquivo | Onde, em Admin › Checkout › ⚙ do site |', '|---|---|');
  linhas.push(`| \`${a.css}\` | aba **Código** › \`${a.css}\` |`);
  linhas.push(`| \`${a.js}\` | aba **Código** › \`${a.js}\` |`);
  linhas.push(`| \`${a.header}\` | aba **Templates** › \`checkout-header\` |`);
  linhas.push(`| \`${a.footer}\` | aba **Templates** › \`checkout-footer\` |`, '');
  linhas.push('## Preencha antes de colar', '');
  if (placeholders.length === 0) linhas.push('Nada: todos os campos vieram do config.');
  for (const ph of placeholders) linhas.push(`- \`${ph.id}\` em \`${ph.arquivo}\`: ${ph.descricao}.`);
  linhas.push('');
  linhas.push('## Cores e fonte deste checkout', '');
  linhas.push('| Papel | Variável | Valor | De onde |', '|---|---|---|---|');
  const origem = {
    nivel1: () => 'escolhido no /gerador',
    nivel2: r => `cor/fonte global da loja (\`${r.key}\`)`,
    nivel3: () => 'padrão do modelo (Figma)',
    guarda: r => `padrão do modelo (Figma): a cor da loja (\`${r.key}\` = \`${r.herdado}\`) não aparecia sobre o fundo`,
    derivado: () => 'calculado',
  };
  for (const r of resolvido.papeis) {
    linhas.push(`| ${r.papel.label} | \`${r.papel.cssVar}\` | \`${r.valor}\` | ${origem[r.fonte](r)} |`);
  }
  linhas.push('', `Logo: ${logo ? 'embutido no `checkout-header.html`.' : `**não embutido** — troque \`${PLACEHOLDER_LOGO}\` pela URL do logo (o motivo está nos avisos).`}`, '');
  linhas.push('## Avisos', '');
  if (avisos.length === 0) linhas.push('Nenhum.');
  for (const av of avisos) linhas.push(`- \`${av.codigo}\`: ${av.mensagem}`);
  linhas.push('');
  return linhas.join('\n');
}

// ── Compose ─────────────────────────────────────────────────────────────────

export function composeCheckout(model, sources, { level2 = {}, level1 = {}, logo = null, version = null } = {}) {
  const problemas = validarModelo(model);
  if (problemas.length) throw new ErroCompose('modelo-invalido', problemas.map(p => p.mensagem).join('; '));
  for (const k of ['css', 'js', 'header', 'footer']) {
    if (typeof sources?.[k] !== 'string') throw new ErroCompose('fonte-ausente', `sources.${k} ausente (a base do modelo em dist/${model.id}/${model.arquivos[k]})`);
  }
  for (const [k, lista] of Object.entries(model.slots)) {
    for (const nome of lista) exigirUnico(sources[k], slot(nome), model.arquivos[k]);
  }
  for (const [k, lista] of Object.entries(model.marcadores ?? {})) {
    for (const m of lista) exigirUnico(sources[k], m, model.arquivos[k]);
  }

  const versao = validarVersao(version);
  const resolvido = resolveTokens(model, { level2, level1 });
  const { src: logoSrc, aviso: avisoLogo } = validarLogo(model, logo);
  const avisos = [...resolvido.avisos];
  if (!versao) avisos.push({ codigo: 'versao-ausente', mensagem: 'sem version (SHA do checkout-vtex): o banner não diz de onde o arquivo veio' });
  if (avisoLogo) avisos.push(avisoLogo);

  const textoBanner = banner(model, versao);
  const fonte = resolvido.papeis.find(r => r.papel.type === 'font');
  const familia = fonte ? primaryFamily(fonte.valor) : null;
  const importLinha = familia && !FONTES_DO_SISTEMA.has(familia.toLowerCase())
    ? buildGoogleFontsImport([familia]).trimEnd() + '\n'
    : '';
  if (familia && !importLinha) avisos.push({ codigo: 'fonte-do-sistema', mensagem: `a fonte "${familia}" é do sistema: sem @import do Google Fonts` });

  // CSS
  let css = sources.css;
  css = preencher(css, 'font-import', importLinha);
  css = preencher(css, 'tokens', bloco(':root', resolvido.root));
  css = `/*! ${textoBanner} */\n${css}`;

  // JS — nenhuma cor aqui (regra do repo); só o que identifica o arquivo.
  const config = { modelo: model.id, contrato: model.contrato, versao };
  let js = sources.js;
  js = preencher(js, 'config', `CONFIG = ${JSON.stringify(config)};\n`);
  js = preencher(js, 'integracoes', '');
  js = `/*! ${textoBanner} */\n${js}`;

  // Header e footer
  let header = sources.header;
  header = preencher(header, 'tokens-header', importLinha + tokensEscopados(model, resolvido, '.etm-header'));
  // Substituição por FUNÇÃO: com string, o replace interpreta `$&`, `$'` e `` $` `` —
  // uma URL https com `$` enfiava o resto do template dentro do atributo src.
  header = header.replace(MARCADOR_LOGO, () => logoSrc ?? PLACEHOLDER_LOGO);
  header = `<!-- ${textoBanner} -->\n${header}`;
  let footer = sources.footer;
  footer = preencher(footer, 'tokens-footer', tokensEscopados(model, resolvido, '.etm-footer'));
  footer = `<!-- ${textoBanner} -->\n${footer}`;

  const saida = { css, js, header, footer };
  for (const [k, texto] of Object.entries(saida)) {
    if (texto.includes('{{ETC_')) throw new ErroCompose('etc-restante', `sobrou um {{ETC_…}} em ${model.arquivos[k]}`);
    if (texto.includes('ETC:SLOT')) throw new ErroCompose('etc-restante', `sobrou um ETC:SLOT em ${model.arquivos[k]}`);
  }

  const placeholders = (model.placeholders ?? []).filter(ph => {
    const arquivo = Object.keys(model.arquivos).find(k => model.arquivos[k] === ph.arquivo);
    return arquivo && saida[arquivo].includes(ph.id);
  });
  for (const ph of placeholders) {
    avisos.push({ codigo: 'placeholder-manual', mensagem: `${ph.id} em ${ph.arquivo}: ${ph.descricao}` });
  }

  return { ...saida, readme: readme(model, { versao, resolvido, avisos, placeholders, logo: logoSrc }), avisos };
}

/**
 * Lê o bloco `faststore` do config.json e devolve as opções do compose.
 * Config antigo, sem `faststore.checkout`, ainda compõe (o generator usa o
 * Checkout01 da main) e ganha um aviso.
 */
export function optionsFromConfig(faststore = {}) {
  const checkout = faststore.checkout ?? null;
  return {
    model: checkout?.model ?? null,
    options: {
      level2: faststore.variables ?? {},
      level1: checkout?.variables ?? {},
      logo: faststore.assets?.logo ?? null,
      version: checkout?.version ?? null,
    },
    avisos: checkout ? [] : [{ codigo: 'checkout-ausente', mensagem: 'config sem faststore.checkout: vale o modelo padrão, só com as cores globais da loja' }],
  };
}

