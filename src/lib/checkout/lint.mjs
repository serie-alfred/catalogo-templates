/**
 * Lint do modelo de checkout. PURO: recebe strings (e o checkout.json já lido),
 * devolve `{ erros, avisos }` — cada item `{ regra, mensagem, arquivo?, linha? }`.
 *
 * Roda em duas fases:
 *   base     — o que o build monta em dist/<Modelo>/ (com os slots vazios);
 *   composto — o que o compose entrega (slots preenchidos entre ETC:BEGIN/END).
 *
 * As regras (docs/contrato.md §Lint):
 *   hex        hex, rgb() e hsl() só no 00-tokens.css e nos blocos que o compose gera
 *   escopo     todo seletor começa em #checkoutMainContainer, #app-container, ou
 *              html.ck01-step-*|html.ck01-passo-* seguido de um dos dois; exceções:
 *              :root, @font-face, @keyframes. Nos templates, todo seletor tem
 *              .etm-header ou .etm-footer, e :root é proibido
 *   var        as regras só consomem --ck01-*, e todo --ck01-* consumido existe
 *   media      var() no prelúdio de @media não funciona (o navegador ignora); largura só
 *              nos breakpoints do checkout.json: (max-width: N) ou (min-width: N + 1)
 *   content    texto posto por CSS (content: "Frete") — texto sai do vtex.i18n; ícone,
 *              número e string vazia passam, e /* content-ok: motivo *\/ libera a linha
 *   import     @import só o do slot font-import, e como primeiro statement
 *   handle     classe de ilha React versionada (vtex-<app>-<major>-x-) tem que estar no checkout.json
 *   script     <script> e on*= em template são erro (a VTEX remove; o JS mora no checkout6-custom.js)
 *   slot       cada slot aparece exatamente uma vez na base; nada de ETC:SLOT nem {{ETC_ no composto
 *   tokens     o 00-tokens.css declara cada alias do checkout.json com a cadeia de 3 níveis exata
 *   js         orçamento de bytes, nenhuma cor, nenhuma rede, nunca clicar no #payment-data-submit
 *   important  !important só com /* !important: motivo *\/ na mesma linha
 */
import { dividirNoTopo, linhador, parseCss, percorrer, referenciasVar } from './css.mjs';
import { aliasesDoModelo, validarModelo } from './modelo.mjs';
import { VAR_MAP } from './level2.mjs';

/** Cabeçalho que o build põe antes de cada arquivo de src/css ao concatenar. */
export const bannerArquivo = nome => `/* @arquivo ${nome} */`;
const RE_BANNER = /\/\* @arquivo ([\w.-]+) \*\//g;
const RE_BLOCO = /\/\* ETC:BEGIN ([\w-]+) \*\/([\s\S]*?)\/\* ETC:END \1 \*\//g;
const ARQUIVO_TOKENS = '00-tokens.css';

// As funções de cor do CSS Color 4/5 também são cor literal (ou calculada em runtime,
// no caso do color-mix: a derivada sai em hex do compose, docs/arquitetura.md §2).
const HEX_OU_FUNCAO = /#[0-9a-f]{3,8}(?![\w-])|\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\s*\(/i;

/**
 * Nome de cor (`white`, `red`…) é hex com outra roupa: fixa a cor e o tema não
 * pinta. Só nas propriedades que recebem cor, para não confundir com nome de
 * animação ou de área de grid. `transparent` e `currentColor` não são cor do tema.
 */
const PROP_DE_COR = /color|background|border|outline|shadow|^fill$|^stroke$|caret|accent|column-rule|text-decoration|text-emphasis|^mask|^-webkit-text-fill/i;
const NOMES_DE_COR = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown '
  + 'burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod '
  + 'darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen '
  + 'darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue '
  + 'firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew '
  + 'hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan '
  + 'lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray '
  + 'lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid '
  + 'mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream '
  + 'mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen '
  + 'paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown '
  + 'royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow '
  + 'springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));

/** O primeiro nome de cor de um valor, fora de string, `url()` e nome de var. */
function nomeDeCor(prop, valor) {
  if (prop.startsWith('--') || !PROP_DE_COR.test(prop)) return null;
  const limpo = valor.replace(/(["'])(?:\\.|(?!\1).)*\1/g, ' ').replace(/url\([^)]*\)/gi, ' ').replace(/--[\w-]+/g, ' ');
  for (const m of limpo.matchAll(/(?<![\w-])[a-z]+(?![\w-])/gi)) if (NOMES_DE_COR.has(m[0].toLowerCase())) return m[0];
  return null;
}
const ID_ESCOPO = /#(checkoutMainContainer|app-container)(?![\w-])/;
const HANDLE = /\bvtex-([a-z0-9]+(?:-[a-z0-9]+)*?)-(\d+)-x-/g;
const JUSTIFICATIVA = /\/\*\s*!important:\s*[^*\s][^*]*\*\//;
const CONTENT_OK = /\/\*\s*content-ok:\s*[^*\s][^*]*\*\//;

// ── Utilitários ─────────────────────────────────────────────────────────────

/**
 * As larguras que um @media pode usar: `max-width` no fim de cada faixa do
 * `checkout.json › breakpoints` e `min-width` no começo da seguinte (767 → 768).
 * Uma régua só para todas as áreas: cada uma escreve o próprio @media, e um
 * número solto (768 no max, 1024 com max) abre uma faixa que as outras não cobrem.
 */
export function largurasDoModelo(model) {
  const bps = Object.values(model?.breakpoints ?? {}).filter(Number.isInteger);
  return { max: new Set(bps), min: new Set(bps.map(b => b + 1)) };
}

/**
 * O conteúdo de cada par de parênteses do prelúdio, inclusive os que têm outro
 * dentro: `(max-width: calc(1000px))` precisa ser lido inteiro, senão a função
 * esconde o número do lint.
 */
function gruposDoPrelude(prelude) {
  const grupos = [];
  const abertos = [];
  for (let i = 0; i < prelude.length; i++) {
    if (prelude[i] === '(') abertos.push(i);
    else if (prelude[i] === ')' && abertos.length) grupos.push(prelude.slice(abertos.pop() + 1, i));
  }
  return grupos;
}

/** Os problemas de largura de um prelúdio de @media (vazio = ok). */
export function problemasDeLargura(prelude, model) {
  const { max, min } = largurasDoModelo(model);
  const problemas = [];
  for (const dentro of gruposDoPrelude(prelude)) {
    const f = dentro.trim();
    // grupo que só embrulha outros ("not ((max-width: 900px))"): os de dentro já foram lidos
    if (f.startsWith('(')) continue;
    const m = /^(min-|max-)?(device-)?width\s*:\s*(.*)$/i.exec(f);
    if (m) {
      const [, lado, device, valor] = m;
      const px = /^(\d+)px$/i.exec(valor.trim());
      const aceitos = lado?.toLowerCase() === 'min-' ? min : max;
      if (device) problemas.push(`(${f}): device-width está obsoleto; use min-width/max-width`);
      else if (!lado) problemas.push(`(${f}): largura exata; use uma faixa com min-width/max-width`);
      else if (!px || !aceitos.has(Number(px[1]))) problemas.push(`(${f}): ${lado.toLowerCase()}width aceita só ${[...aceitos].map(n => `${n}px`).join(' ou ')}`);
    } else if (/(^|[^\w-])(device-)?width\s*[<>=]|[<>=]\s*(device-)?width(?![\w-])/i.test(f)) {
      problemas.push(`(${f}): sintaxe de intervalo; escreva (max-width: …) / (min-width: …)`);
    }
  }
  return problemas;
}

/** Decodifica os escapes de uma string CSS (`\\f105` → U+F105, `\\"` → `"`). */
function desescapar(s) {
  return s.replace(/\\([0-9a-f]{1,6})\s?|\\\n|\\([\s\S])/gi, (m, hex, c) => {
    if (hex) {
      const cp = parseInt(hex, 16);
      return cp === 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff) ? '\ufffd' : String.fromCodePoint(cp);
    }
    return c ?? '';
  });
}

/**
 * A primeira string com LETRA num valor de `content` (fora de `url()`/`image-set()`),
 * ou `null`. Ícone (glifo de fonte na área privada, símbolo), número ("1.") e string
 * vazia não são texto: passam. `attr()` e `counter()` leem o DOM, não escrevem texto.
 */
export function textoNoContent(valor) {
  const semImagem = valor.replace(/(?:-webkit-)?(?:url|image-set)\((?:[^()"']|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\([^()]*\))*\)/gi, ' ');
  for (const m of semImagem.matchAll(/(["'])((?:\\[\s\S]|(?!\1)[^\\])*)\1/g)) {
    if (/\p{L}/u.test(desescapar(m[2]))) return m[0];
  }
  return null;
}

function contar(texto, agulha) {
  let n = 0;
  for (let i = texto.indexOf(agulha); i !== -1; i = texto.indexOf(agulha, i + agulha.length)) n++;
  return n;
}

/** Os compostos de um seletor (divididos nos combinadores do nível 0). */
export function compostos(seletor) {
  const partes = [];
  let atual = '';
  let prof = 0;
  let str = null;
  for (const c of seletor.trim()) {
    if (str) { atual += c; if (c === str) str = null; continue; }
    if (c === '"' || c === "'") { str = c; atual += c; continue; }
    if (c === '(' || c === '[') prof++;
    if (c === ')' || c === ']') prof--;
    if (prof === 0 && (/\s/.test(c) || c === '>' || c === '+' || c === '~')) {
      if (atual) partes.push(atual);
      atual = '';
      continue;
    }
    atual += c;
  }
  if (atual) partes.push(atual);
  return partes;
}

const PSEUDO_LISTA = /^(is|where|matches|-webkit-any|-moz-any)$/i;

/**
 * O composto tem o id de escopo no NÍVEL 0? Dentro de `:not()`/`:has()` o id não
 * escopa nada — `:not(#checkoutMainContainer) .btn` pega o iframe do cartão
 * inteiro, onde esse id não existe. Em `:is()`/`:where()` vale quando TODOS os
 * argumentos começam no escopo (`:is(#checkoutMainContainer, #app-container) .a`).
 */
function compostoNoEscopo(composto, prefixo) {
  let nivel0 = '';
  let i = 0;
  const s = composto;
  const fechar = (j, abre, fecha) => {
    let prof = 0;
    let str = null;
    for (; j < s.length; j++) {
      const c = s[j];
      if (str) { if (c === str) str = null; continue; }
      if (c === '"' || c === "'") { str = c; continue; }
      if (c === abre) prof++;
      else if (c === fecha && --prof === 0) return j;
    }
    return s.length;
  };
  while (i < s.length) {
    if (s[i] === '[') { i = fechar(i, '[', ']') + 1; nivel0 += '[]'; continue; }
    const m = /^:([\w-]+)\(/.exec(s.slice(i));
    if (m) {
      const j = fechar(i + m[0].length - 1, '(', ')');
      const args = s.slice(i + m[0].length, j);
      if (PSEUDO_LISTA.test(m[1]) && dividirNoTopo(args).every(a => comecaNoEscopo(a, prefixo))) return true;
      nivel0 += `:${m[1]}()`;
      i = j + 1;
      continue;
    }
    nivel0 += s[i++];
  }
  return ID_ESCOPO.test(nivel0);
}

function comecaNoEscopo(seletor, prefixo) {
  const [c0, c1] = compostos(seletor.trim());
  if (!c0) return false;
  if (compostoNoEscopo(c0, prefixo)) return true;
  const marcaEtapa = new RegExp(`\\.${prefixo}-(step|passo)-[\\w-]+`);
  return /^html(?=[.:[]|$)/.test(c0) && marcaEtapa.test(c0) && c1 != null && compostoNoEscopo(c1, prefixo);
}

/** O seletor está dentro do escopo da página ou do cartão? */
export function escopoDaPagina(seletor, prefixo) {
  const s = seletor.trim();
  if (s === ':root') return true;
  return comecaNoEscopo(s, prefixo);
}

export function escopoDoTemplate(seletor) {
  return /\.etm-(header|footer)(?![\w-])/.test(seletor);
}

/** Intervalos `[inicio, fim)` dos blocos gerados pelo compose, por nome. */
function blocosGerados(texto) {
  const blocos = [];
  for (const m of texto.matchAll(RE_BLOCO)) blocos.push({ nome: m[1], inicio: m.index, fim: m.index + m[0].length });
  return blocos;
}

/** Para cada offset, o arquivo de origem (pelos banners do build) e a linha dentro dele. */
function mapaDeArquivos(texto, arquivoPadrao) {
  const banners = [...texto.matchAll(RE_BANNER)].map(m => ({ nome: m[1], inicio: m.index }));
  const linha = linhador(texto);
  return offset => {
    let atual = null;
    for (const b of banners) if (b.inicio <= offset) atual = b;
    const l = linha(offset);
    if (!atual) return { arquivo: arquivoPadrao, linha: l };
    return { arquivo: atual.nome, linha: l - linha(atual.inicio) };
  };
}

// ── CSS ─────────────────────────────────────────────────────────────────────

/**
 * Lint de um CSS do modelo. `modo`: 'pagina' (checkout6-custom.css) ou
 * 'template' (o <style> do header/footer). `completo`: o texto é o arquivo
 * inteiro (confere slots, @import e o bloco de tokens); falso para um trecho.
 * Devolve também `refs` e `declarados` para o `lintCheckout` cruzar.
 */
export function lintCss(css, { model, fase = 'base', arquivo = null, modo = 'pagina', completo = false, declaradosExtra = [] } = {}) {
  const erros = [];
  const avisos = [];
  const prefixo = model.prefixo;
  const ondeEm = mapaDeArquivos(css, arquivo);
  const falha = (regra, mensagem, offset) => erros.push({ regra, mensagem, ...(offset != null ? ondeEm(offset) : { arquivo }) });

  const { nos, erros: sintaxe, texto } = parseCss(css);
  for (const e of sintaxe) falha('sintaxe', e.mensagem, e.offset);

  const gerados = blocosGerados(css);
  const geradoEm = offset => gerados.find(b => offset >= b.inicio && offset < b.fim)?.nome ?? null;
  const ehTokens = offset => (modo === 'pagina' && ondeEm(offset).arquivo === ARQUIVO_TOKENS) || geradoEm(offset) != null;

  const refs = [];
  const declarados = new Set(declaradosExtra);
  const nivel2 = new Set(Object.values(VAR_MAP));
  let primeiro = true;

  percorrer(nos, (no, pais) => {
    const eraPrimeiro = primeiro && pais.length === 0;
    if (pais.length === 0) primeiro = false;

    if (no.tipo === 'at') {
      if (no.nome === 'import') {
        const bloco = geradoEm(no.inicio);
        if (fase !== 'composto' || !(bloco === 'font-import' || bloco === 'tokens-header')) {
          falha('import', '@import fora do slot font-import (a fonte vem do compose)', no.inicio);
        } else if (!eraPrimeiro) {
          falha('import', '@import não é o primeiro statement: o navegador o ignora', no.inicio);
        }
      } else if (no.nome === 'charset' || no.nome === 'namespace') {
        falha('import', `@${no.nome} não é permitido`, no.inicio);
      } else if (no.nome === 'media' && /var\(/.test(no.prelude)) {
        falha('media', `var() dentro de @media (${no.prelude}): media query não lê custom property`, no.inicio);
      } else if (no.nome === 'media') {
        for (const p of problemasDeLargura(no.prelude, model)) {
          falha('media', `@media ${no.prelude} — ${p} (breakpoints do checkout.json)`, no.inicio);
        }
      }
      if (no.decls) verDecls(no);
      return;
    }
    if (!no.keyframe) {
      for (const sel of dividirNoTopo(no.seletor)) {
        if (modo === 'template') {
          if (/(^|[\s,>+~(]):root(?![\w-])/.test(sel)) falha('escopo', `:root em template ("${sel}"): no Order Placed venceria os tokens da página; use .etm-header/.etm-footer`, no.inicio);
          else if (!escopoDoTemplate(sel)) falha('escopo', `seletor sem .etm-header/.etm-footer: "${sel}"`, no.inicio);
        } else if (!escopoDaPagina(sel, prefixo)) {
          falha('escopo', `seletor fora do escopo: "${sel}" (comece em #checkoutMainContainer, #app-container ou html.${prefixo}-step-*)`, no.inicio);
        }
      }
    }
    verDecls(no);
  });

  function verDecls(no) {
    for (const d of no.decls) {
      const tokens = ehTokens(d.inicio);
      if (!tokens && HEX_OU_FUNCAO.test(d.valor)) {
        falha('hex', `cor literal fora do 00-tokens.css: ${d.prop}: ${d.valor} (use var(--${prefixo}-*))`, d.inicio);
      } else if (!tokens && nomeDeCor(d.prop, d.valor)) {
        falha('hex', `nome de cor fora do 00-tokens.css: ${d.prop}: ${d.valor} ("${nomeDeCor(d.prop, d.valor)}" fixa a cor; use var(--${prefixo}-*))`, d.inicio);
      }
      if (d.prop.startsWith('--')) {
        declarados.add(d.prop);
        if (!tokens) {
          if (d.prop.startsWith('--checkout-') || nivel2.has(d.prop)) {
            falha('var', `${d.prop} só é definida pelo compose (nível 1/2), não pelas regras`, d.inicio);
          } else if (!d.prop.startsWith(`--${prefixo}-`)) {
            falha('var', `custom property ${d.prop} fora do prefixo --${prefixo}-`, d.inicio);
          }
        }
      }
      for (const nome of referenciasVar(d.valor)) {
        refs.push({ nome, offset: d.inicio, tokens });
        if (!tokens && !nome.startsWith(`--${prefixo}-`)) {
          falha('var', `as regras consomem só --${prefixo}-*: var(${nome}) em ${d.prop}`, d.inicio);
        }
      }
      if (d.prop.toLowerCase() === 'content') {
        const literal = textoNoContent(d.valor);
        if (literal) {
          const ini = css.lastIndexOf('\n', d.inicio - 1) + 1;
          const fim = css.indexOf('\n', d.fim);
          if (!CONTENT_OK.test(css.slice(ini, fim === -1 ? css.length : fim))) {
            falha('content', `texto posto por CSS (content: ${literal}) em "${no.seletor ?? '@' + no.nome}": o texto sai do vtex.i18n (src/js/i18n.js), senão não traduz e o leitor de tela lê o que o Figma não pediu; ícone e string vazia passam, e /* content-ok: motivo */ na mesma linha libera`, d.inicio);
          }
        }
      }
      if (/!\s*important\s*$/i.test(d.valor)) {
        const pos = texto.lastIndexOf('!', d.fim);
        const linhaCrua = css.slice(css.lastIndexOf('\n', pos) + 1, (css.indexOf('\n', pos) + 1 || css.length + 1) - 1);
        if (!JUSTIFICATIVA.test(linhaCrua)) {
          falha('important', `!important sem /* !important: motivo */ na mesma linha (${d.prop})`, pos);
        }
      }
    }
  }

  // Handles de ilha React versionados
  for (const m of texto.matchAll(HANDLE)) {
    const conhecido = model.handles.find(h => h.prefixo === m[0]);
    if (!conhecido) {
      const mesmoApp = model.handles.find(h => h.prefixo.startsWith(`vtex-${m[1]}-`));
      falha('handle', mesmoApp
        ? `${m[0]} tem outro major que o checkout.json (${mesmoApp.prefixo}): atualize o modelo junto com o CSS`
        : `${m[0]} não está em checkout.json › handles`, m.index);
    }
  }

  if (completo) {
    const lista = modo === 'pagina' ? model.slots.css : [];
    if (fase === 'base') {
      for (const nome of lista) {
        const n = contar(css, `/* ETC:SLOT ${nome} */`);
        if (n !== 1) falha('slot', `/* ETC:SLOT ${nome} */ aparece ${n}× (tem que ser 1×)`);
      }
      if (modo === 'pagina') {
        const i = css.indexOf('/* ETC:SLOT font-import */');
        if (i !== -1 && css.slice(0, i).replace(/\/\*[\s\S]*?\*\//g, '').trim() !== '') {
          falha('import', 'o slot font-import não é o primeiro statement do CSS', i);
        }
      }
    } else {
      if (css.includes('ETC:SLOT')) falha('slot', 'sobrou ETC:SLOT no arquivo composto');
      for (const nome of lista) {
        const n = gerados.filter(b => b.nome === nome).length;
        if (n !== 1) falha('slot', `o bloco ETC:BEGIN/END ${nome} aparece ${n}× (tem que ser 1×)`);
      }
    }
    if (css.includes('{{ETC_')) falha('slot', 'sobrou {{ETC_…}} no CSS');
    if (modo === 'pagina') erros.push(...lintTokens(nos, model, ondeEm));
  }

  return { erros, avisos, refs, declarados };
}

/** O 00-tokens.css declara exatamente os aliases do checkout.json, com a cadeia exata. */
function lintTokens(nos, model, ondeEm) {
  const erros = [];
  const regras = nos.filter(no => ondeEm(no.inicio).arquivo === ARQUIVO_TOKENS);
  if (regras.length === 0) return [{ regra: 'tokens', mensagem: `${ARQUIVO_TOKENS} ausente ou vazio`, arquivo: ARQUIVO_TOKENS }];
  const decls = new Map();
  for (const no of regras) {
    if (no.tipo !== 'regra' || no.seletor.trim() !== ':root') {
      erros.push({ regra: 'tokens', mensagem: `${ARQUIVO_TOKENS} só tem o :root dos aliases (achei "${no.seletor ?? '@' + no.nome}")`, ...ondeEm(no.inicio) });
      continue;
    }
    for (const d of no.decls) {
      if (decls.has(d.prop)) erros.push({ regra: 'tokens', mensagem: `${d.prop} declarado duas vezes`, ...ondeEm(d.inicio) });
      decls.set(d.prop, d);
    }
  }
  const normal = v => v.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
  const esperados = aliasesDoModelo(model);
  for (const { nome, esperado } of esperados) {
    const d = decls.get(nome);
    if (!d) erros.push({ regra: 'tokens', mensagem: `falta ${nome}: ${esperado}`, arquivo: ARQUIVO_TOKENS });
    else if (normal(d.valor) !== normal(esperado)) {
      erros.push({ regra: 'tokens', mensagem: `${nome} é "${d.valor}", o checkout.json diz "${esperado}"`, ...ondeEm(d.inicio) });
    }
  }
  const nomes = new Set(esperados.map(e => e.nome));
  for (const [prop, d] of decls) {
    if (!nomes.has(prop)) erros.push({ regra: 'tokens', mensagem: `${prop} não é papel nem neutro do checkout.json`, ...ondeEm(d.inicio) });
  }
  return erros;
}

// ── JS ──────────────────────────────────────────────────────────────────────

export function lintJs(js, { model, fase = 'base', arquivo = null } = {}) {
  const erros = [];
  const ondeEm = mapaDeArquivos(js, arquivo);
  const falha = (regra, mensagem, offset) => erros.push({ regra, mensagem, ...(offset != null ? ondeEm(offset) : { arquivo }) });

  const bytes = new TextEncoder().encode(js).length;
  if (bytes > model.limites.jsBytes) {
    falha('js', `${bytes} bytes; o orçamento é ${model.limites.jsBytes} (o arquivo bloqueia o <head> do checkout)`);
  }
  try {
    // eslint-disable-next-line no-new-func
    new Function(js);
  } catch (e) {
    if (e instanceof SyntaxError) falha('sintaxe', `JS inválido: ${e.message}`);
  }
  const semBlocoGerado = js.replace(RE_BLOCO, m => m.replace(/[^\n]/g, ' '));
  const cor = /#[0-9a-f]{3}(?:[0-9a-f]{3})?(?![\w-])|\b(rgba?|hsla?)\s*\(/gi;
  for (const m of semBlocoGerado.matchAll(cor)) falha('js', `cor no JS (${m[0]}): cor mora no CSS; se for um id com cara de hex, use [id="${m[0].slice(1)}"]`, m.index);
  const rede = /\bfetch\s*\(|\bXMLHttpRequest\b|(\$|\bjQuery)\.(ajax|get|post|getJSON)\s*\(|\bsendBeacon\b|\bWebSocket\b|\bEventSource\b/g;
  for (const m of js.matchAll(rede)) falha('js', `rede no JS (${m[0].trim()}): o modelo não chama API`, m.index);
  const linhas = js.split('\n');
  let offset = 0;
  for (const l of linhas) {
    if (/payment-data-submit/.test(l) && /\.click\s*\(|trigger(Handler)?\(\s*['"]click|dispatchEvent|\.(request)?[sS]ubmit\s*\(/.test(l)) {
      falha('js', 'nunca clicar/submeter o #payment-data-submit (finaliza a compra)', offset);
    }
    offset += l.length + 1;
  }
  for (const m of js.matchAll(HANDLE)) {
    if (!model.handles.some(h => h.prefixo === m[0])) falha('handle', `${m[0]} não está em checkout.json › handles`, m.index);
  }
  for (const nome of model.slots.js) {
    if (fase === 'base') {
      const n = contar(js, `/* ETC:SLOT ${nome} */`);
      if (n !== 1) falha('slot', `/* ETC:SLOT ${nome} */ aparece ${n}× (tem que ser 1×)`);
    } else {
      const n = blocosGerados(js).filter(b => b.nome === nome).length;
      if (n !== 1) falha('slot', `o bloco ETC:BEGIN/END ${nome} aparece ${n}× (tem que ser 1×)`);
    }
  }
  if (fase === 'composto' && js.includes('ETC:SLOT')) falha('slot', 'sobrou ETC:SLOT no JS composto');
  if (js.includes('{{ETC_')) falha('slot', 'sobrou {{ETC_…}} no JS');
  return { erros, avisos: [] };
}

// ── Templates ───────────────────────────────────────────────────────────────

export function lintTemplate(html, { model, tipo, fase = 'base', arquivo = null } = {}) {
  const erros = [];
  const avisos = [];
  const linha = linhador(html);
  const falha = (regra, mensagem, offset) => erros.push({ regra, mensagem, arquivo, ...(offset != null ? { linha: linha(offset) } : {}) });

  for (const m of html.matchAll(/<script\b/gi)) falha('script', '<script> em template: a VTEX remove, e o JS mora no checkout6-custom.js', m.index);
  for (const m of html.matchAll(/<[a-z][^>]*>/gi)) {
    const ev = /\son[a-z]+\s*=|=\s*["']?\s*javascript:/i.exec(m[0]);
    if (ev) falha('script', `atributo de evento (${ev[0].trim()}) em template: é JS inline`, m.index);
  }
  const abre = (html.match(/<style\b/gi) ?? []).length;
  const fecha = (html.match(/<\/style>/gi) ?? []).length;
  if (abre !== fecha) falha('sintaxe', `${abre} <style> para ${fecha} </style>`);

  const conhecidos = new Set([...(model.placeholders ?? []).map(p => p.id), ...(model.marcadores?.[tipo] ?? [])]);
  for (const m of html.matchAll(/\{\{[^}]*\}\}/g)) {
    if (!conhecidos.has(m[0])) falha('slot', `placeholder ${m[0]} não está no checkout.json`, m.index);
  }

  const slots = model.slots[tipo] ?? [];
  for (const nome of slots) {
    const marca = `/* ETC:SLOT ${nome} */`;
    if (fase === 'base') {
      const n = contar(html, marca);
      if (n !== 1) falha('slot', `${marca} aparece ${n}× (tem que ser 1×)`);
      // O compose põe um @import no começo do bloco: só vale se o slot abre o <style>.
      const i = html.indexOf(marca);
      const antes = html.slice(0, i);
      const abertura = antes.lastIndexOf('<style');
      if (i !== -1 && (abertura === -1 || antes.slice(antes.indexOf('>', abertura) + 1).trim() !== '')) {
        falha('slot', `${marca} precisa ser a primeira coisa dentro do <style>`, i);
      }
    } else {
      const n = blocosGerados(html).filter(b => b.nome === nome).length;
      if (n !== 1) falha('slot', `o bloco ETC:BEGIN/END ${nome} aparece ${n}× (tem que ser 1×)`);
    }
  }
  if (fase === 'base') {
    for (const m of model.marcadores?.[tipo] ?? []) {
      const n = contar(html, m);
      if (n !== 1) falha('slot', `${m} aparece ${n}× (tem que ser 1×)`);
    }
  } else {
    if (html.includes('ETC:SLOT')) falha('slot', 'sobrou ETC:SLOT no template composto');
    if (html.includes('{{ETC_')) falha('slot', 'sobrou {{ETC_…}} no template composto');
  }

  // O <style> de dentro: mesmas regras de hex/var, escopo de template.
  const declaradosModelo = aliasesDoModelo(model).map(a => a.nome);
  const refs = [];
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const inicio = m.index + m[0].indexOf('>') + 1;
    const r = lintCss(m[1], { model, fase, arquivo, modo: 'template', declaradosExtra: declaradosModelo });
    const deslocamento = linha(inicio) - 1;
    for (const e of r.erros) erros.push({ ...e, arquivo, linha: e.linha != null ? e.linha + deslocamento : undefined });
    refs.push(...r.refs);
  }
  for (const r of refs) {
    if (!r.tokens && r.nome.startsWith(`--${model.prefixo}-`) && !declaradosModelo.includes(r.nome)) {
      falha('var', `var(${r.nome}) não existe no checkout.json (nem papel, nem neutro)`);
    }
  }
  return { erros, avisos, refs };
}

// ── Tudo junto ──────────────────────────────────────────────────────────────

/**
 * Os 4 arquivos de uma vez (`{css, js, header, footer}`), mais o checkout.json.
 * Cruza o que um arquivo sozinho não vê: var consumida que não existe e papel
 * declarado que nada consome (aviso — o CSS do modelo ainda está sendo escrito).
 */
export function lintCheckout(arquivos, { model, fase = 'base' } = {}) {
  const nomes = model?.arquivos ?? {};
  const erros = [...validarModelo(model).map(e => ({ ...e, arquivo: 'checkout.json' }))];
  const avisos = [];
  if (erros.length) return { erros, avisos };

  const css = lintCss(arquivos.css, { model, fase, arquivo: nomes.css, completo: true });
  const js = lintJs(arquivos.js, { model, fase, arquivo: nomes.js });
  const header = lintTemplate(arquivos.header, { model, tipo: 'header', fase, arquivo: nomes.header });
  const footer = lintTemplate(arquivos.footer, { model, tipo: 'footer', fase, arquivo: nomes.footer });
  erros.push(...css.erros, ...js.erros, ...header.erros, ...footer.erros);
  avisos.push(...css.avisos, ...js.avisos, ...header.avisos, ...footer.avisos);

  const declarados = new Set([...css.declarados, ...aliasesDoModelo(model).map(a => a.nome)]);
  for (const r of css.refs) {
    if (r.nome.startsWith(`--${model.prefixo}-`) && !declarados.has(r.nome)) {
      erros.push({ regra: 'var', mensagem: `var(${r.nome}) não é declarada em lugar nenhum`, arquivo: nomes.css });
    }
  }
  const consumidos = new Set([...css.refs, ...header.refs, ...footer.refs].filter(r => !r.tokens).map(r => r.nome));
  for (const p of model.papeis) {
    if (!consumidos.has(p.alias)) {
      avisos.push({ regra: 'consumo', mensagem: `${p.alias} (${p.label}) ainda não é consumido por nenhuma regra`, arquivo: nomes.css });
    }
  }
  return { erros, avisos };
}

/** Uma linha por problema, para o terminal. */
export function formatarProblema(p) {
  const onde = [p.arquivo, p.linha].filter(v => v != null).join(':');
  return `${onde ? `${onde} ` : ''}[${p.regra}] ${p.mensagem}`;
}
