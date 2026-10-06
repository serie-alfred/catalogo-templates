/**
 * Cores e fontes derivadas, calculadas AQUI e emitidas como hex.
 *
 * O checkout não usa `color-mix()` nem cálculo em runtime: o que sai no `:root`
 * é hex puro, o mesmo byte no preview do /gerador e no arquivo do cliente. Isso
 * deixa o resultado conferível (o funil compara bytes) e não depende do
 * navegador do comprador.
 *
 * As regras: `contrastOn` (texto de botão), `mix` (texto secundário),
 * `textoLegivel` (texto do header, gate0 #23) e `corVisivel` com
 * `limiteVisivel` (o que se desenha sobre o fundo do header e do rodapé,
 * gate0 #28).
 *
 * `contrastOn` é a MESMA regra do catálogo (`catalogo-templates/src/utils/themeStyle.ts`):
 * luminância YIQ com limiar 128, preto em cor clara, branco em cor escura. O
 * teste importa o arquivo do catálogo e compara as duas funções numa varredura.
 *
 * PURO: sem fs. O generator e o catálogo importam este arquivo.
 */

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** `#abc`/`#AABBCC`/`aabbcc` → `#aabbcc`; qualquer outra coisa → `null`. */
export function normalizeHex(valor) {
  if (typeof valor !== 'string') return null;
  const m = HEX.exec(valor.trim());
  if (!m) return null;
  const hex = m[1].length === 3 ? m[1].replace(/./g, c => c + c) : m[1];
  return `#${hex.toLowerCase()}`;
}

export function isHex(valor) {
  return normalizeHex(valor) !== null;
}

/** `#aabbcc` → `{r, g, b}` (0–255); `null` se não for hex. */
export function parseHex(valor) {
  const hex = normalizeHex(valor);
  if (!hex) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

const canal = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

export function toHex({ r, g, b }) {
  return `#${canal(r)}${canal(g)}${canal(b)}`;
}

function exigirHex(valor, onde) {
  const rgb = parseHex(valor);
  if (!rgb) throw new TypeError(`${onde}: "${valor}" não é uma cor hex (#rgb ou #rrggbb)`);
  return rgb;
}

/** Luminância YIQ (0–255), a do catálogo. */
export function luminance(valor) {
  const { r, g, b } = exigirHex(valor, 'luminance');
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** Preto ou branco, o que tiver contraste sobre a cor dada. Limiar 128, como no catálogo. */
export function contrastOn(valor) {
  return luminance(valor) >= 128 ? '#000000' : '#ffffff';
}

// ── Contraste WCAG (guarda de visibilidade, gate0 #14a) ──────────────────────
//
// O `contrastOn` acima escolhe preto ou branco PARA o texto de um botão (é a regra
// do catálogo). A guarda de visibilidade responde outra pergunta: a cor herdada
// da loja APARECE sobre o fundo? Para isso vale a razão de contraste da WCAG 2.x,
// que é simétrica e vai de 1 (mesma luminância) a 21 (preto × branco).

const linear = c => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/** Luminância relativa da WCAG 2.x (0–1): sRGB linearizado, 0,2126 R + 0,7152 G + 0,0722 B. */
export function relativeLuminance(valor) {
  const { r, g, b } = exigirHex(valor, 'relativeLuminance');
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Razão de contraste da WCAG 2.x entre duas cores (1–21); a ordem não importa. */
export function contrastRatio(corA, corB) {
  const a = relativeLuminance(corA);
  const b = relativeLuminance(corB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * O fundo em que a cor aparece MENOS: `fundos` é `[{ valor, … }]` e volta
 * `{ razao, …fundo }` do pior, ou `null` sem fundos. É a régua da guarda de
 * visibilidade do compose: a cor passa se `razao >= min`.
 */
export function piorContraste(cor, fundos) {
  let pior = null;
  for (const fundo of fundos) {
    const razao = contrastRatio(cor, fundo.valor);
    if (!pior || razao < pior.razao) pior = { ...fundo, razao };
  }
  return pior;
}

/**
 * Texto que se lê sobre um fundo (gate0 #23, o texto do header e do stepper):
 * o próprio `texto` quando a razão de contraste WCAG contra `fundo` é pelo menos
 * `min`; senão o `contrastOn(fundo)` (preto ou branco, a régua do catálogo).
 * Devolve `{ valor, razao, trocou }`: `razao` é a do `texto` original contra o
 * fundo, `trocou` diz se o valor deixou de ser o texto.
 */
export function textoLegivel(texto, fundo, min = 4.5) {
  const t = normalizeHex(texto);
  if (!t) throw new TypeError(`textoLegivel: "${texto}" não é uma cor hex (#rgb ou #rrggbb)`);
  const razao = contrastRatio(t, fundo);
  if (razao >= min) return { valor: t, razao, trocou: false };
  return { valor: contrastOn(fundo), razao, trocou: true };
}

/**
 * O limite de uma cor desenhada sobre um fundo (gate0 #28): o menor entre `min`
 * (a régua, 3:1 no Checkout01) e a razão do PRÓPRIO par no Figma (a cor e o
 * fundo no nível 3). O Figma desenha o passo inativo do stepper a 1,33:1 e o
 * traço do header a 1,09:1 sobre o branco: exigir 3:1 deles mudaria o header
 * branco do Figma. Com o limite assim, o par do Figma sempre passa (o header
 * branco não muda) e, em qualquer outro fundo, a cor nunca fica menos visível
 * do que o Figma a desenhou — nem se exige mais que `min`.
 */
export function limiteVisivel(min, corNivel3, fundoNivel3) {
  return Math.min(min, contrastRatio(corNivel3, fundoNivel3));
}

/**
 * Cor que aparece sobre um fundo (gate0 #28, o que se desenha sobre o fundo do
 * header e do rodapé): a própria `cor` quando a razão de contraste WCAG dela
 * contra `fundo` é pelo menos `limite`; senão a `alternativa` —
 *   - com `misturar`, a MENOR mistura da alternativa com o fundo que chega ao
 *     limite (peso inteiro da alternativa, de 1 a 100, semântica do `mix`): o
 *     secundário continua secundário, o mais perto do fundo que ainda se vê;
 *   - sem `misturar`, a própria alternativa.
 * Se nem a alternativa pura chega ao limite, fica ela (a melhor que o modelo
 * tem) e `alcancou` sai `false`.
 * → `{ valor, razao, trocou, razaoFinal, alcancou, peso? }`: `razao` é a da cor
 * original contra o fundo; `razaoFinal`, a do valor devolvido.
 */
export function corVisivel(cor, fundo, limite, alternativa, { misturar = false } = {}) {
  const c = normalizeHex(cor);
  const f = normalizeHex(fundo);
  const alt = normalizeHex(alternativa);
  if (!c || !f || !alt) throw new TypeError(`corVisivel: "${!c ? cor : !f ? fundo : alternativa}" não é uma cor hex (#rgb ou #rrggbb)`);
  if (typeof limite !== 'number' || !(limite >= 1 && limite <= 21)) throw new RangeError(`corVisivel: limite ${limite} fora de 1–21`);
  const razao = contrastRatio(c, f);
  if (razao >= limite) return { valor: c, razao, trocou: false, razaoFinal: razao, alcancou: true };
  if (misturar) {
    for (let peso = 1; peso <= 100; peso++) {
      const valor = mix(alt, f, peso);
      const r = contrastRatio(valor, f);
      if (r >= limite) return { valor, razao, trocou: true, razaoFinal: r, alcancou: true, peso };
    }
  }
  const razaoFinal = contrastRatio(alt, f);
  return { valor: alt, razao, trocou: true, razaoFinal, alcancou: razaoFinal >= limite, ...(misturar ? { peso: 100 } : {}) };
}

/** `2.1237…` → `"2,12:1"`, o formato das mensagens da guarda. */
export function formatarRazao(razao) {
  return `${(Math.floor(razao * 100) / 100).toFixed(2).replace('.', ',')}:1`;
}

/**
 * Mistura de duas cores em sRGB, semântica do `mix()` do Sass: `peso` (0–100) é
 * a porcentagem da PRIMEIRA cor. `mix(a, b, 100)` = a; `mix(a, b, 0)` = b.
 * Cada canal é arredondado para o inteiro mais próximo.
 */
export function mix(corA, corB, peso) {
  const a = exigirHex(corA, 'mix');
  const b = exigirHex(corB, 'mix');
  if (typeof peso !== 'number' || !Number.isFinite(peso) || peso < 0 || peso > 100) {
    throw new RangeError(`mix: peso ${peso} fora de 0–100`);
  }
  const p = peso / 100;
  return toHex({
    r: a.r * p + b.r * (1 - p),
    g: a.g * p + b.g * (1 - p),
    b: a.b * p + b.b * (1 - p),
  });
}

// ── Fontes ──────────────────────────────────────────────────────────────────

/**
 * Nome de família aceito: letras (com acento), dígitos, espaço e hífen. É o
 * que o Google Fonts publica, e é o que cabe entre aspas simples no `:root`
 * sem escape — a pilha de nível 2 não escapa nada (ver `level2.mjs`).
 */
const FAMILIA = /^[\p{L}\p{N}][\p{L}\p{N} \-]{0,62}$/u;
/** Genéricas e nomes de sistema que podem vir sem aspas numa pilha. */
const SEM_ASPAS = /^-?[A-Za-z][A-Za-z0-9-]*(?: [A-Za-z][A-Za-z0-9-]*)*$/;

export function isFontFamily(nome) {
  return typeof nome === 'string' && FAMILIA.test(nome.trim()) && nome.trim() === nome;
}

/**
 * Lê um valor de `font-family` e devolve as famílias sem aspas, ou `null` se o
 * valor não for seguro para ir ao CSS. Recusa tudo que possa fechar a
 * declaração ou abrir outra coisa: `; { } < > \`, `url(`, `var(`, quebra de linha.
 */
export function parseFontValue(valor) {
  if (typeof valor !== 'string') return null;
  // Testa o valor CRU: quebra de linha no fim também é recusada, não só "aparada".
  if (/[;{}<>\\\n\r\t]|\/\*|url\(|var\(|expression\(|@/i.test(valor)) return null;
  const v = valor.trim();
  if (v.length === 0 || v.length > 200) return null;
  const partes = v.split(',').map(p => p.trim());
  const familias = [];
  for (const p of partes) {
    const aspas = /^(['"])(.*)\1$/.exec(p);
    if (aspas) {
      if (!isFontFamily(aspas[2])) return null;
      familias.push(aspas[2]);
    } else if (SEM_ASPAS.test(p) || isFontFamily(p)) {
      familias.push(p);
    } else {
      return null;
    }
  }
  return familias;
}

export function isFontValue(valor) {
  return parseFontValue(valor) !== null;
}

/** A família principal de um valor de fonte (`'Poppins', sans-serif` → `Poppins`). */
export function primaryFamily(valor) {
  const familias = parseFontValue(valor);
  return familias ? familias[0] : null;
}
