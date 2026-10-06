/**
 * Parser MÍNIMO de CSS para o lint e o compose — sem dependência.
 *
 * Por que não postcss: o `lib/` é importado pelo generator (clone por SHA) e
 * vendorizado no catálogo; cada dependência aqui vira dependência dos dois. O
 * CSS que passa por este parser é o nosso, escrito à mão, então basta
 * entender o que nós escrevemos: regras, at-rules com bloco (`@media`,
 * `@supports`, `@keyframes`, `@font-face`) e at-rules de uma linha (`@import`).
 * CSS aninhado (nesting) é recusado com erro — o checkout roda em navegador de
 * comprador, e o lint prefere reprovar a adivinhar.
 *
 * Tudo trabalha sobre o texto com os comentários trocados por espaços do mesmo
 * tamanho (`apagarComentarios`): as posições e os números de linha continuam
 * batendo com o arquivo original.
 *
 * PURO: sem fs.
 */

/** Troca cada comentário por espaços (preserva `\n`), respeitando strings. */
export function apagarComentarios(css) {
  return apagar(css).texto;
}

function apagar(css) {
  let saida = '';
  let aberto = false;
  let str = null;
  for (let i = 0; i < css.length; ) {
    const c = css[i];
    if (str) {
      saida += c;
      if (c === '\\' && i + 1 < css.length) { saida += css[i + 1]; i += 2; continue; }
      if (c === str || c === '\n') str = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") { str = c; saida += c; i++; continue; }
    if (c === '/' && css[i + 1] === '*') {
      const fim = css.indexOf('*/', i + 2);
      const ate = fim === -1 ? css.length : fim + 2;
      if (fim === -1) aberto = true;
      saida += css.slice(i, ate).replace(/[^\n]/g, ' ');
      i = ate;
      continue;
    }
    saida += c;
    i++;
  }
  return { texto: saida, aberto };
}

/** Índice do primeiro caractere de `paradas` no nível 0 de ()/[] e fora de string; `fim` se não achar. */
function lerAte(t, i, fim, paradas) {
  let prof = 0;
  let str = null;
  for (; i < fim; i++) {
    const c = t[i];
    if (str) {
      if (c === '\\') { i++; continue; }
      if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'") { str = c; continue; }
    if (c === '(' || c === '[') prof++;
    else if ((c === ')' || c === ']') && prof > 0) prof--;
    else if (prof === 0 && paradas.includes(c)) return i;
  }
  return fim;
}

/** Com `t[abre] === '{'`, o índice do `}` que fecha; -1 se não fechar até `fim`. */
function acharFecho(t, abre, fim) {
  let prof = 0;
  let str = null;
  for (let i = abre; i < fim; i++) {
    const c = t[i];
    if (str) {
      if (c === '\\') { i++; continue; }
      if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'") { str = c; continue; }
    if (c === '{') prof++;
    else if (c === '}' && --prof === 0) return i;
  }
  return -1;
}

const AT_COM_REGRAS = /^(media|supports|layer|container|document|-moz-document)$/;
const AT_KEYFRAMES = /keyframes$/;

function lerDeclaracoes(t, ini, fim, erros) {
  const decls = [];
  for (let i = ini; i < fim; ) {
    const j = lerAte(t, i, fim, ';{');
    if (j < fim && t[j] === '{') {
      erros.push({ offset: j, mensagem: 'regra aninhada (CSS nesting) não é suportada' });
      const fecho = acharFecho(t, j, fim);
      i = fecho === -1 ? fim : fecho + 1;
      continue;
    }
    const texto = t.slice(i, j);
    if (texto.trim()) {
      const inicio = i + (texto.length - texto.trimStart().length);
      const doisPontos = texto.indexOf(':');
      if (doisPontos === -1) {
        erros.push({ offset: inicio, mensagem: `declaração sem ":" (${texto.trim().slice(0, 40)})` });
      } else {
        decls.push({
          prop: texto.slice(0, doisPontos).trim(),
          valor: texto.slice(doisPontos + 1).trim(),
          inicio,
          fim: j,
        });
      }
    }
    i = j + 1;
  }
  return decls;
}

function lerBloco(t, ini, fim, erros, emKeyframes = false) {
  const nos = [];
  for (let i = ini; i < fim; ) {
    while (i < fim && /\s/.test(t[i])) i++;
    if (i >= fim) break;
    if (t[i] === '}') { erros.push({ offset: i, mensagem: '"}" sem "{"' }); i++; continue; }
    if (t[i] === ';') { i++; continue; }
    const inicio = i;
    const j = lerAte(t, i, fim, '{;}');
    const cabeca = t.slice(inicio, j).trim();
    if (j >= fim || t[j] !== '{') {
      if (cabeca.startsWith('@')) {
        const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(cabeca);
        nos.push({ tipo: 'at', nome: m ? m[1].toLowerCase() : '', prelude: m ? m[2].trim() : '', inicio, fim: j, bloco: false });
      } else {
        erros.push({ offset: inicio, mensagem: `declaração solta fora de regra (${cabeca.slice(0, 40)})` });
      }
      i = j >= fim ? fim : t[j] === ';' ? j + 1 : j;
      continue;
    }
    let fecho = acharFecho(t, j, fim);
    if (fecho === -1) {
      erros.push({ offset: j, mensagem: '"{" sem "}"' });
      fecho = fim;
    }
    if (cabeca.startsWith('@')) {
      const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(cabeca);
      const nome = m ? m[1].toLowerCase() : '';
      const no = { tipo: 'at', nome, prelude: m ? m[2].trim() : '', inicio, fim: fecho + 1, bloco: true };
      if (AT_COM_REGRAS.test(nome)) no.filhos = lerBloco(t, j + 1, fecho, erros);
      else if (AT_KEYFRAMES.test(nome)) no.filhos = lerBloco(t, j + 1, fecho, erros, true);
      else no.decls = lerDeclaracoes(t, j + 1, fecho, erros);
      nos.push(no);
    } else {
      nos.push({
        tipo: 'regra',
        seletor: cabeca,
        keyframe: emKeyframes,
        inicio,
        fim: fecho + 1,
        decls: lerDeclaracoes(t, j + 1, fecho, erros),
      });
    }
    i = fecho + 1;
  }
  return nos;
}

/**
 * `{ nos, erros, texto }`. `texto` é o CSS sem comentários (mesmas posições);
 * cada nó e cada declaração guarda `inicio`/`fim` nesse texto.
 */
export function parseCss(css) {
  const { texto, aberto } = apagar(css);
  const erros = [];
  if (aberto) erros.push({ offset: css.lastIndexOf('/*'), mensagem: 'comentário "/*" sem "*/"' });
  const nos = lerBloco(texto, 0, texto.length, erros);
  return { nos, erros, texto };
}

/** Visita cada nó em ordem de documento; `fn(no, pais)` com a pilha de at-rules acima. */
export function percorrer(nos, fn, pais = []) {
  for (const no of nos) {
    fn(no, pais);
    if (no.filhos) percorrer(no.filhos, fn, [...pais, no]);
  }
}

/** Divide por `sep` no nível 0 de ()/[] e fora de string (lista de seletores, pilha de fontes). */
export function dividirNoTopo(texto, sep = ',') {
  const partes = [];
  let ini = 0;
  for (;;) {
    const j = lerAte(texto, ini, texto.length, sep);
    partes.push(texto.slice(ini, j).trim());
    if (j >= texto.length) break;
    ini = j + 1;
  }
  return partes;
}

/** Nomes referenciados por `var(--x, …)` num valor, inclusive os aninhados no fallback. */
export function referenciasVar(valor) {
  const nomes = [];
  const re = /var\(\s*(--[\w-]+)/g;
  let m;
  while ((m = re.exec(valor))) nomes.push(m[1]);
  return nomes;
}

/** Função `offset → linha` (1-based) para um texto. */
export function linhador(texto) {
  const inicios = [0];
  for (let i = 0; i < texto.length; i++) if (texto[i] === '\n') inicios.push(i + 1);
  return offset => {
    let lo = 0;
    let hi = inicios.length - 1;
    while (lo < hi) {
      const meio = (lo + hi + 1) >> 1;
      if (inicios[meio] <= offset) lo = meio;
      else hi = meio - 1;
    }
    return lo + 1;
  };
}
