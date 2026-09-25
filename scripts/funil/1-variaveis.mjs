/**
 * Estágio 1v — o `variablesSchema` bate com o CSS que ele diz controlar?
 *
 * O painel "variáveis por componente" lista o que o `variablesSchema` declara;
 * o preview pinta o que o CSS da réplica consome, e o tema gerado, o que o SCSS
 * do starter consome. Nada conferia que os três falam da mesma var, e o erro
 * não aparece em lugar nenhum: o campo existe no painel, mexe no preview e não
 * chega à loja.
 *
 * Confere quatro coisas por item de catálogo com `path` (origem VTEX):
 *
 *  1. toda `cssVar` do schema é consumida como Nível 1 pelo CSS da réplica;
 *  2. o `default` do schema é o Nível 3 da réplica, byte a byte (é contra ele
 *     que o `pickChangedVariables` decide o que exportar — se divergir, o
 *     export manda valor que o usuário não escolheu, ou omite o que ele
 *     escolheu);
 *  3. a réplica não consome token INTERNO do catálogo: toda custom property que
 *     as folhas globais do catálogo declaram (`src/styles/*.css` e o
 *     `frame.css`), menos os tokens de tema que o gerador empurra
 *     (`buildThemeStyle`) e a lista PERMITIDOS. Esses nomes existem para a UI
 *     do e-temas e NÃO existem no tema do cliente: no preview pintam com o
 *     valor do catálogo (o rosa #e73888 do `--accent`, a 'Noto Sans' do
 *     `--font-family`) e na loja gerada a declaração fica inválida ou cai no
 *     fallback do starter — borda que some, fundo que vira transparente, fonte
 *     que cai na herdada;
 *  4. toda `cssVar` do schema é lida por uma regra VIVA do SCSS do fecho do
 *     `path` no starter — a pasta de cada componente que o grafo de manifests
 *     arrasta, mais o `dependencies.scss` declarado —, que é de onde o tema é
 *     montado. Em 24/09/2026 cinco campos passavam em 1 e 2 e morriam aqui: o
 *     painel mexia no preview, o gerador injetava a var no tema e nenhum
 *     seletor a lia. E achar `var(<cssVar>` no texto não bastava: em 25/09 o
 *     Nível 1 posto no `.tag-new span` do ProductCard01 passava, e o TSX dele
 *     nunca renderiza `tag-new`. Por isso cada SCSS é compilado com o sass
 *     (aninhamento, `&` e variáveis `$x` saem resolvidos como no build), e a
 *     regra que lê só é viva se, em algum seletor da lista, TODA classe do
 *     módulo aparece como `<import>.x`, `<import>?.x` ou `<import>['x']` num
 *     TSX do fecho que importa aquele módulo — classe de CSS module é do arquivo
 *     que a declara, e o `.title` de outro módulo não a põe no DOM. Uma classe
 *     que falta mata o seletor: `.spot … div.tag-new span` tem o `.spot`, que o
 *     card usa, e morre pelo `.tag-new`. Não pedem nada do TSX o atributo
 *     (`[data-fs-*]` é markup nativo do FastStore), a tag, o `:global(...)` e o
 *     `:not(...)`; `:is/:where/:has` pedem uma alternativa; `@keyframes` vive
 *     pela regra que anima com ele. Fica isenta a folha global — a que o
 *     manifest põe em `themeImports`, como o `filter.scss` do MainCategory01,
 *     importada no `custom-theme.scss` do tema —, porque classe global não
 *     passa pelo import.
 *
 * Regra viva quer dizer que o TSX REFERENCIA as classes, não que o nó aparece:
 * render condicional, prop que ninguém passa e a parte do seletor que o TSX não
 * escreve (`[data-fs-*]`, tag) ficam presumidos. A chave dinâmica
 * (`style[chave]`) não conta como referência: lendo o código não dá para saber
 * que classe ela escolhe. O único caso hoje é o `style[buttonClassName]` do
 * Drawer01, e ele nunca acha classe do Drawer01 — o NavBar01 passa
 * `style.mobileMenuBtn`, que o módulo dele não declara, e o Drawer01 cai no
 * padrão. Uma regra morta ao lado de uma viva que lê a mesma var não reprova —
 * vira a linha ℹ️ do item.
 *
 * O que ele NÃO prova: que a declaração injetada ALCANÇA o nó que consome. O
 * `cssVariableInjector` do generator escreve só no primeiro seletor de topo do
 * SCSS primário e nos de topo terminados em `Portal`, e sobe para o `:root` só
 * a var que nenhum SCSS local consome; conteúdo portado para fora da raiz
 * escapa. Foi o caso do CategoryTitle06: o SCSS consumia `--plp-text` e
 * `--plp-font`, e a contagem portalada para a trilha ficava fora do alcance —
 * o 4 passava. Este estágio não lê o tema gerado: quem olha para ele é o
 * estágio 4 (os marcadores chegam ao SCSS do tema, em dois componentes) e as
 * sondas de Nível 1 do 2-fidelidade (o render, nos 25 pares). Também não
 * confere o sentido inverso — CSS que consome um Nível 1 que o schema não
 * oferece, a zona que ninguém consegue editar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
// Os dois são dependência do próprio catálogo: o estágio não pede o
// node_modules do starter.
import * as sass from 'sass';
import postcss from 'postcss';
import { lerLayouts, itens, relatorio, RAIZ, FASTSTORE_STARTER } from './lib/util.mjs';
import { lerManifests, fechoCompleto } from './lib/contrato.mjs';

const r = relatorio('estágio 1v · variáveis por componente');

/**
 * `var(--X, <resto>)` com o fecho de parênteses casado.
 *
 * Devolve TODOS os fallbacks distintos por var, não o primeiro: uma mesma var
 * de Nível 1 pode ter Nível 3 diferente em lugares diferentes, e isso é
 * legítimo. `--header-font` do Header03 cai em 'Poppins' no corpo e 'Manrope'
 * no logo (dois papéis, um controle só); `--prod-info-variant-active-bg` cai
 * em #121212 no fundo e rgba(18,18,18,.75) no outline. Fixar no primeiro fazia
 * o portão reprovar schema correto — e portão que grita lobo ninguém lê.
 */
function consumos(cssBruto) {
  // Comentário NÃO é consumo. Sem tirar antes, um `var(--accent)` citado num
  // comentário explicando por que ele saiu contava como se ainda estivesse lá,
  // e o portão apontava três tokens que o Footer03 já não usa.
  const css = cssBruto.replace(/\/\*[\s\S]*?\*\//g, '');
  const achados = new Map(); // nome -> Set de fallbacks crus
  for (let i = 0; (i = css.indexOf('var(', i)) !== -1; i += 4) {
    let nivel = 0, fim = -1;
    for (let j = i + 3; j < css.length; j++) {
      if (css[j] === '(') nivel++;
      else if (css[j] === ')' && --nivel === 0) { fim = j; break; }
    }
    if (fim === -1) continue;
    const dentro = css.slice(i + 4, fim);
    const virgula = dentro.indexOf(',');
    const nome = (virgula === -1 ? dentro : dentro.slice(0, virgula)).trim();
    if (!nome.startsWith('--')) continue;
    const resto = virgula === -1 ? null : dentro.slice(virgula + 1).trim();
    if (!achados.has(nome)) achados.set(nome, new Set());
    achados.get(nome).add(resto);
  }
  return achados;
}

/** Nível 3 = o último fallback da cadeia. `var(--a, var(--b, X))` → `X`. */
function nivel3(fallback) {
  if (fallback == null) return null;
  const m = /^var\(\s*--[\w-]+\s*,\s*([\s\S]*)\)\s*$/.exec(fallback.trim());
  return (m ? nivel3(m[1]) : fallback).trim();
}

/**
 * Tokens internos, lidos de onde eles nascem. A lista era escrita à mão
 * (`--ink`, `--paper`, `--accent`, `--grey-NN`…) e parou no que a UI de
 * marketing usava quando ela foi escrita: o `--font-family` e os `--color-*`
 * do globals.css passavam, e sete réplicas VTEX pintavam com eles.
 */
const FOLHAS_GLOBAIS = [
  ...fs.readdirSync(path.join(RAIZ, 'src/styles'))
    .filter(f => f.endsWith('.css'))
    .map(f => path.join(RAIZ, 'src/styles', f)),
  path.join(RAIZ, 'src/app/gerador/(frame)/frame.css'),
];
const declaradas = new Set();
for (const f of FOLHAS_GLOBAIS)
  for (const [, nome] of fs.readFileSync(f, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .matchAll(/(?:^|[;{\s])(--[\w-]+)\s*:/g))
    declaradas.add(nome);

/** Os tokens de tema: as chaves do objeto que `buildThemeStyle` devolve. */
const TEMA = new Set(
  [...fs.readFileSync(path.join(RAIZ, 'src/utils/themeStyle.ts'), 'utf8')
    .matchAll(/'(--[\w-]+)'\s*:/g)].map(m => m[1])
);

/**
 * Internos que um template pode ler, com o motivo. Não é para esconder: entra
 * aqui só o que não muda o que a loja recebe.
 */
const PERMITIDOS = {
  '--preview-motion':
    'o frame.css pausa as animações do canvas; o template lê com fallback `running`, que é o que a loja roda',
};

const INTERNOS = new Set(
  [...declaradas].filter(v => !TEMA.has(v) && !(v in PERMITIDOS))
);

r.ok(
  `tokens de tema lidos do buildThemeStyle (${TEMA.size})`,
  TEMA.size > 0,
  'nenhuma chave `--x` no src/utils/themeStyle.ts — o parser não acha mais o objeto'
);
for (const nome of Object.keys(PERMITIDOS))
  r.ok(
    `${nome} continua declarado nas folhas globais (a permissão ainda faz sentido)`,
    declaradas.has(nome),
    'nenhuma folha global declara mais este nome — remova-o de PERMITIDOS'
  );

/**
 * Dispensas do item 3, com motivo obrigatório. Não é para esconder: é para o
 * portão poder ficar verde enquanto uma correção MAIOR que o achado está
 * agendada. Dispensa que não é mais necessária REPROVA — senão vira lixo que
 * ninguém remove.
 */
const PENDENTES = {};
const dispensasUsadas = new Set();

/**
 * O SCSS que chega ao tema a partir de um `path`: a pasta de cada asset do
 * fecho (componentes, hooks, utils… — o que não tem SCSS não soma nada) e o
 * `src/sass/<nome>.module.scss` que cada um declara em `dependencies.scss`, que
 * é onde mora o estilo dos overrides.
 */
const manifests = lerManifests();
const arquivosEm = (dir, re) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory()
      ? arquivosEm(path.join(dir, e.name), re)
      : re.test(e.name) ? [path.join(dir, e.name)] : []
  );
function scssDoFecho(id) {
  const arqs = new Set();
  for (const dep of fechoCompleto(id, manifests)) {
    const d = manifests.get(dep);
    for (const f of arquivosEm(d._dir, /\.scss$/)) arqs.add(f);
    for (const nome of d.dependencies?.scss ?? [])
      arqs.add(path.join(FASTSTORE_STARTER, 'src/sass', `${nome}.module.scss`));
  }
  return [...arqs].filter(f => fs.existsSync(f));
}
/**
 * As folhas globais do fecho: o que o manifest põe em `themeImports`, e o
 * gerador importa no `custom-theme.scss` do tema. O nome casa como no
 * `findVariablesNeedingGlobalScope` do generator: sem `.scss`, sem o `_` de
 * partial, sem caixa.
 */
function globaisDoFecho(id) {
  const globais = new Set();
  for (const dep of fechoCompleto(id, manifests)) {
    const d = manifests.get(dep);
    const nomes = new Set(
      (d.themeImports ?? []).map(t => path.basename(String(t)).replace(/\.scss$/i, '').toLowerCase())
    );
    if (!nomes.size) continue;
    for (const f of arquivosEm(d._dir, /\.scss$/))
      if (nomes.has(path.basename(f).replace(/\.scss$/i, '').replace(/^_+/, '').toLowerCase()))
        globais.add(f);
  }
  return globais;
}
// SCSS tem os dois tipos de comentário. O `//` precedido de `:` fica, porque é
// o `http://` dos SVGs em data-URI, não comentário.
const semComentariosScss = txt =>
  txt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
// O nome é `--[\w-]+`, nada nele é especial numa regex; o lookahead impede que
// `--spot-tag-bg` case dentro de `--spot-tag-bg-hover`.
const consome = (scss, nome) => new RegExp(`var\\(\\s*${nome}(?![\\w-])`).test(scss);

/**
 * Import de pacote (`@faststore/ui/…`, dezessete no CartSidebar01 e no 07)
 * vira folha vazia: é CSS do FastStore, que não lê var do painel, e assim o
 * estágio não depende do node_modules do starter. O import relativo o sass
 * resolve em disco, como no build, e o que não resolve reprova ("não compila
 * aqui") em vez de sumir.
 */
const pacoteVazio = {
  canonicalize: url => (/^[@~]/.test(url) ? new URL(`funil-pacote:${url}`) : null),
  load: () => ({ contents: '', syntax: 'scss' }),
};
/**
 * Por var, onde a folha compilada a lê: `{ rotulo, seletores }`, com as
 * listas de seletores que precisam casar. É a da própria regra; dentro de
 * `@keyframes`, a de cada regra que anima com ele; fora de regra de estilo
 * (`@font-face`, `@page`), nenhuma — `var()` não resolve ali.
 */
function regrasQueLeem(css) {
  const raiz = postcss.parse(css);
  const animam = new Map();
  raiz.walkDecls(/^animation(-name)?$/i, d => {
    if (d.parent.type !== 'rule') return;
    for (const nome of d.value.split(/[\s,]+/)) {
      if (!animam.has(nome)) animam.set(nome, []);
      animam.get(nome).push(d.parent.selector);
    }
  });
  const ondeDe = new Map();
  const leem = new Map();
  raiz.walkDecls(d => {
    const regra = d.parent;
    if (!ondeDe.has(regra)) {
      const quadro =
        regra.parent?.type === 'atrule' && /keyframes$/i.test(regra.parent.name)
          ? regra.parent.params.trim()
          : null;
      ondeDe.set(
        regra,
        quadro !== null
          ? { rotulo: `@keyframes ${quadro}`, seletores: animam.get(quadro) ?? [] }
          : regra.type === 'rule'
            ? { rotulo: regra.selector.replace(/\s+/g, ' '), seletores: [regra.selector] }
            : { rotulo: `@${regra.name}`, seletores: [] }
      );
    }
    for (const [, nome] of d.value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (!leem.has(nome)) leem.set(nome, new Set());
      leem.get(nome).add(ondeDe.get(regra));
    }
  });
  return leem;
}
function compilarScss(texto, arquivo, importers = []) {
  try {
    const { css } = sass.compileString(texto, {
      url: pathToFileURL(arquivo),
      importers: [...importers, pacoteVazio],
      logger: sass.Logger.silent,
    });
    return { leem: regrasQueLeem(css) };
  } catch (e) {
    return { erro: String(e?.message ?? e).split('\n')[0] };
  }
}
const folhas = new Map();
const folhaDe = (arquivo, texto) => {
  if (!folhas.has(arquivo)) {
    const folha = compilarScss(texto, arquivo);
    // Reprova a var só quando nenhuma outra regra a leva ao nó; o aviso sai
    // sempre, porque uma folha fora da checagem é um furo, não um detalhe.
    if (folha.erro)
      console.log(`  ⚠️  ${path.relative(FASTSTORE_STARTER, arquivo)} não compila aqui (${folha.erro}) — as regras dela ficam fora da checagem 4`);
    folhas.set(arquivo, folha);
  }
  return folhas.get(arquivo);
};
const entrada = (arquivo, texto) => ({ arquivo, texto, limpo: semComentariosScss(texto) });

/** Onde fecha o `(` ou `[` aberto em `i`, pulando string e escape. */
function fecha(s, i) {
  const par = s[i] === '(' ? ')' : ']';
  for (let j = i, nivel = 0; j < s.length; j++) {
    if (s[j] === '\\') j++;
    else if (s[j] === '"' || s[j] === "'") j = fimDaString(s, j);
    else if (s[j] === s[i]) nivel++;
    else if (s[j] === par && --nivel === 0) return j;
  }
  return s.length;
}
function fimDaString(s, i) {
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === '\\') j++;
    else if (s[j] === s[i]) return j;
  }
  return s.length;
}
/** A lista cortada nas vírgulas de fora de parêntese, colchete e string. */
function alternativas(lista) {
  const out = [];
  let ini = 0;
  for (let i = 0; i < lista.length; i++) {
    const c = lista[i];
    if (c === '\\') i++;
    else if (c === '"' || c === "'") i = fimDaString(lista, i);
    else if (c === '(' || c === '[') i = fecha(lista, i);
    else if (c === ',') { out.push(lista.slice(ini, i)); ini = i + 1; }
  }
  out.push(lista.slice(ini));
  return out.map(s => s.trim()).filter(Boolean);
}
/**
 * O segundo nome que o css-loader exporta para cada classe: o `@faststore/core`
 * põe `exportLocalsConvention: 'camelCase'` no css-loader, o tema é montado com
 * `next build --webpack`, e `style.tagNew` também acha `.tag-new`. Porte do
 * `camelcase` que o Next embute no css-loader, sem as opções que ele não usa.
 */
const camelDoCssLoader = nome => {
  let s = nome.trim();
  if (s.length <= 1) return s.toLowerCase();
  if (s !== s.toLowerCase()) {
    let minuscula = false, maiuscula = false, maiusculaAntes = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (minuscula && /\p{Lu}/u.test(c)) {
        s = `${s.slice(0, i)}-${s.slice(i)}`;
        minuscula = false;
        maiusculaAntes = maiuscula;
        maiuscula = true;
        i++;
      } else if (maiuscula && maiusculaAntes && /\p{Ll}/u.test(c)) {
        s = `${s.slice(0, i - 1)}-${s.slice(i - 1)}`;
        maiusculaAntes = maiuscula;
        maiuscula = false;
        minuscula = true;
      } else {
        minuscula = c.toLowerCase() === c && c.toUpperCase() !== c;
        maiusculaAntes = maiuscula;
        maiuscula = c.toUpperCase() === c && c.toLowerCase() !== c;
      }
    }
  }
  return s
    .replace(/^[_.\- ]+/, '')
    .toLowerCase()
    .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p) => p.toUpperCase())
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, m => m.toUpperCase());
};
const usa = (usadas, classe) => usadas.has(classe) || usadas.has(camelDoCssLoader(classe));

const IDENT = /^(?:[\w-]|[^\x00-\x7f]|\\.)+/;
const PEDEM_UMA = new Set(['is', 'where', 'matches', '-webkit-any', '-moz-any', 'has', 'local']);
/** As classes do módulo que faltam para o seletor casar; `[]` = vivo. */
function faltamNoSeletor(sel, usadas) {
  const falta = [];
  for (let i = 0; i < sel.length; ) {
    const c = sel[i];
    if (c === '\\') i += 2;
    else if (c === '"' || c === "'") i = fimDaString(sel, i) + 1;
    else if (c === '[') i = fecha(sel, i) + 1; // atributo: `[data-fs-*]` é do FastStore
    else if (c === '.' && IDENT.test(sel.slice(i + 1))) {
      const cru = IDENT.exec(sel.slice(i + 1))[0];
      const nome = cru.replace(/\\(.)/g, '$1');
      if (!usa(usadas, nome)) falta.push(nome);
      i += 1 + cru.length;
    } else if (c === ':') {
      const m = /^::?([\w-]+)/.exec(sel.slice(i));
      if (!m) { i++; continue; }
      const nome = m[1].toLowerCase();
      const j = i + m[0].length;
      if (sel[j] === '(') {
        // `:global(...)` é de terceiro, `:not(...)` não exige, `:nth-*` não
        // tem classe: só os que pedem uma alternativa entram
        const fim = fecha(sel, j);
        if (PEDEM_UMA.has(nome)) falta.push(...faltamNaLista(sel.slice(j + 1, fim), usadas));
        i = fim + 1;
      } else if (nome === 'global') break; // `:global .x`: o resto é global
      else i = j;
    } else i++;
  }
  return falta;
}
/** O seletor da lista que casa (`[]`), ou o que menos falta para casar. */
function faltamNaLista(lista, usadas) {
  let menor = null;
  for (const alt of alternativas(lista)) {
    const falta = faltamNoSeletor(alt, usadas);
    if (!falta.length) return [];
    if (!menor || falta.length < menor.length) menor = falta;
  }
  return menor ?? [];
}

/**
 * O que um TSX usa de cada módulo que importa — `<import>.x`, `<import>?.x`,
 * `<import>['x']` —, pelo nome do import: `style`, `styles`, `titleStyles`,
 * `trail`, `gallery`… O módulo resolve a partir do TSX; o `../../sass/…` que o
 * Breadcrumb01 e o CrossSellingShelf01 escrevem para o destino achatado,
 * a partir de `src/components/overrides/` (ver `conferirImports`). Chave que
 * não é literal (`style[chave]`) fica anotada e não conta.
 */
const semComentariosTs = txt =>
  txt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
function acessosDoTsx(arquivo, texto, existe = fs.existsSync) {
  const src = semComentariosTs(texto);
  // Sem as linhas de import: o `styles.scss` de `import '…/Rating/styles.scss'`
  // não é acesso a um `styles`.
  const corpo = src.replace(/^\s*import\b[\s\S]*?['"][^'"\n]*['"]/gm, '');
  const acessos = [];
  for (const [, id, spec] of src.matchAll(
    /import\s+(?:\*\s+as\s+)?([\w$]+)\s+from\s+['"]([^'"]+\.scss)['"]/g
  )) {
    const modulo = [
      path.resolve(path.dirname(arquivo), spec),
      path.resolve(FASTSTORE_STARTER, 'src/components/overrides', spec),
    ].find(p => existe(p));
    if (!modulo) continue;
    const nome = id.replace(/\$/g, '\\$');
    const classes = new Set();
    const dinamicos = [];
    for (const m of corpo.matchAll(new RegExp(
      `(?<![\\w$.])${nome}\\s*\\??\\.\\s*([A-Za-z_$][\\w$]*)` +
        `|(?<![\\w$.])${nome}\\s*(?:\\?\\.)?\\s*\\[([^\\]]*)\\]`,
      'g'
    ))) {
      if (m[1]) { classes.add(m[1]); continue; }
      const literal = /^\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1\s*$/.exec(m[2]);
      if (literal && !(literal[1] === '`' && literal[2].includes('${')))
        classes.add(literal[2]);
      else dinamicos.push(`${id}[${m[2].trim()}]`);
    }
    acessos.push({ modulo, classes, dinamicos });
  }
  return acessos;
}
function juntar(usos, acessos, deOnde) {
  for (const { modulo, classes, dinamicos } of acessos) {
    if (!usos.has(modulo)) usos.set(modulo, { classes: new Set(), dinamicos: [] });
    const u = usos.get(modulo);
    for (const c of classes) u.classes.add(c);
    u.dinamicos.push(...dinamicos.map(d => `${deOnde}: ${d}`));
  }
  return usos;
}
const acessosPorTsx = new Map();
/** Por módulo, as classes que os TSX do fecho usam (e as chaves dinâmicas). */
function usosDoFecho(id) {
  const usos = new Map();
  for (const dep of fechoCompleto(id, manifests))
    for (const f of arquivosEm(manifests.get(dep)._dir, /\.[jt]sx?$/)) {
      if (!acessosPorTsx.has(f))
        acessosPorTsx.set(f, acessosDoTsx(f, fs.readFileSync(f, 'utf8')));
      juntar(usos, acessosPorTsx.get(f), path.relative(FASTSTORE_STARTER, f));
    }
  return usos;
}

// Folha que importa outra folha local pode ler a var sem citá-la no texto.
const IMPORTA_LOCAL = /@(?:import|use|forward)\s+['"](?![@~])/;
/**
 * A var chega a uma regra viva? `folhasDoFecho` são as entradas do fecho,
 * `globais` as de `themeImports`, `usos` o que cada módulo tem de TSX. Partial
 * que não é módulo nem global conta pelo módulo que o importa, não sozinho.
 * Devolve as regras mortas que a leem: são o motivo da falha, ou a linha ℹ️
 * do item quando outra regra leva a var ao nó.
 */
function leituraViva(nome, folhasDoFecho, globais, usos, compilar = folhaDe) {
  let viva = false;
  let isenta = false;
  const mortas = [];
  const soltas = [];
  for (const { arquivo, texto, limpo } of folhasDoFecho) {
    const global = globais.has(arquivo);
    const cita = consome(limpo, nome);
    const onde = path.relative(FASTSTORE_STARTER, arquivo);
    if (!global && !arquivo.endsWith('.module.scss')) {
      if (cita)
        soltas.push({ onde, rotulo: 'a folha', porque: 'não é módulo nem `themeImports`: conta pelo módulo que a importa', falta: [] });
      continue;
    }
    if (!cita && !IMPORTA_LOCAL.test(limpo)) continue;
    const { erro, leem } = compilar(arquivo, texto);
    if (erro) {
      mortas.push({ onde, rotulo: 'a folha', porque: `não compila aqui: ${erro}`, falta: [] });
      continue;
    }
    const regras = leem.get(nome);
    if (!regras) {
      if (cita)
        mortas.push({ onde, rotulo: `var(${nome}`, porque: 'nenhuma declaração compilada lê — variável Sass sem uso?', falta: [] });
      continue;
    }
    if (global) { isenta = true; continue; }
    const u = usos.get(arquivo);
    for (const regra of regras) {
      let falta = null;
      for (const s of regra.seletores) {
        const f = faltamNaLista(s, u?.classes ?? new Set());
        if (!falta || f.length < falta.length) falta = f;
      }
      if (falta && !falta.length) { viva = true; continue; }
      const porque = !falta
        ? regra.rotulo.startsWith('@keyframes') ? 'nenhuma regra anima com ele' : 'fora de regra de estilo'
        : !u
          ? 'nenhum TSX do fecho importa o módulo'
          : `o TSX não usa ${falta.map(c => `.${c}`).join(' ')}` +
            (u.dinamicos.length ? ` — chave dinâmica não conta: ${u.dinamicos.join(', ')}` : '');
      mortas.push({ onde, rotulo: regra.rotulo, porque, falta: falta ?? [] });
    }
  }
  if (!viva && !isenta) mortas.push(...soltas);
  return { viva: viva || isenta, soIsenta: !viva && isenta, mortas };
}
const descrever = m => `${m.onde}: ${m.rotulo} (${m.porque})`;
/** O veredito da checagem 4 para uma var: o que o laço e o autoteste leem. */
function veredito(nome, folhasDoFecho, globais, usos, compilar = folhaDe) {
  if (!folhasDoFecho.some(f => consome(f.limpo, nome)))
    return { ok: false, soIsenta: false, mortas: [], detalhe: `nenhum var(${nome} nos ${folhasDoFecho.length} SCSS` };
  const { viva, soIsenta, mortas } = leituraViva(nome, folhasDoFecho, globais, usos, compilar);
  return {
    ok: viva,
    soIsenta,
    mortas,
    detalhe:
      `nenhuma regra viva: ${mortas.slice(0, 3).map(descrever).join(' | ')}` +
      (mortas.length > 3 ? ` | +${mortas.length - 3}` : ''),
  };
}

/**
 * Autoteste do detector. Hoje nenhuma var real cai no ramo que reprova, e a
 * asserção por var ficaria verde sem nunca ter sido exercitada — o mesmo
 * motivo do autoteste de registro de resolvers no `lib/contrato.mjs`.
 */
{
  // [o caso, as folhas (uma string é o `style.module.scss`), o corpo do TSX que
  //  importa `style` e `outro`, a var chega?]. Folha sem `.module` e sem `_` é
  //  de `themeImports`; o `@import './x'` de um caso lê o `_x.scss` dele.
  const TAG_NEW = '.spot { .tag { div { &.tag-new span { color: var(--v); } } } }';
  const PARCIAL = { 'style.module.scss': ".x { @import './parcial'; }", '_parcial.scss': '.y { color: var(--v); }' };
  const casos = [
    ['classe que o TSX não usa (o `.tag-new` de 25/09)', TAG_NEW, 'style.spot; style.tag;', false],
    ['a mesma regra, com o TSX usando a classe', TAG_NEW, "style.spot; style.tag; style['tag-new'];", true],
    ['`style.tagNew` acha `.tag-new` (camelCase do css-loader)', TAG_NEW, 'style.spot; style.tag; style.tagNew;', true],
    ['`&` com sufixo é outra classe', '.card { &__title { color: var(--v); } }', 'style.card;', false],
    ['variável Sass leva a var à regra que a usa', '$c: var(--v, #000); .morta { color: $c; } .viva { color: red; }', 'style.viva;', false],
    ['`[data-fs-*]` e tag não pedem nada do TSX', '.spot { [data-fs-button] span { color: var(--v); } }', 'style?.spot;', true],
    ['`:global(...)` é classe de terceiro', '.spot :global(.swiper-slide) { color: var(--v); }', 'style.spot;', true],
    ['`:not(...)` não exige a classe', '.spot:not(.oculto) { color: var(--v); }', 'style.spot;', true],
    ['`:is(...)` pede uma alternativa', ':is(.a, .b) .c { color: var(--v); }', 'style.b; style.c;', true],
    ['`:is(...)` sem alternativa usada', ':is(.a, .b) .c { color: var(--v); }', 'style.c;', false],
    ['na lista, basta um seletor vivo', '.morta, .viva { color: var(--v); }', 'style.viva;', true],
    ['`@keyframes` que só a regra morta anima', '@keyframes pulso { to { color: var(--v); } } .morta { animation: pulso 1s; }', 'style.outra;', false],
    ['`@keyframes` que a regra viva anima', '@keyframes pulso { to { color: var(--v); } } .viva { animation: pulso 1s; }', 'style.viva;', true],
    ['chave dinâmica não conta, nem com o nome da classe', '.x { color: var(--v); }', 'style[x];', false],
    ['var que nenhuma folha cita', '.x { color: var(--outra); }', 'style.x;', false],
    ['comentário no TSX não conta', '.x { color: var(--v); }', '/* style.x */', false],
    ['classe de OUTRO módulo não conta', '.x { color: var(--v); }', 'outro.x;', false],
    ['folha de `themeImports` fica isenta', { 'filter.scss': '[data-fs-filter] .x { color: var(--v); }' }, '', true],
    ['partial conta pelo módulo que o importa', PARCIAL, 'style.x; style.y;', true],
    ['… e reprova se o TSX não usa a classe', PARCIAL, 'style.x;', false],
    ['partial que nenhum módulo importa não conta', { '_parcial.scss': '.y { color: var(--v); }' }, 'style.y;', false],
  ];
  const trocados = casos.filter(([, folhasDoCaso, corpo, chega], i) => {
    const dir = `/funil-autoteste/${i}`;
    const scss = typeof folhasDoCaso === 'string' ? { 'style.module.scss': folhasDoCaso } : folhasDoCaso;
    const tsx =
      "import style from './style.module.scss';\n" +
      "import outro from './outro.module.scss';\n" +
      `${corpo}\n`;
    const usos = juntar(new Map(), acessosDoTsx(`${dir}/index.tsx`, tsx, p => p.startsWith(dir)), 'autoteste');
    const irma = {
      canonicalize: url => (`_${path.basename(url)}.scss` in scss ? new URL(`funil-autoteste:${i}/_${path.basename(url)}.scss`) : null),
      load: url => ({ contents: scss[path.basename(url.pathname)], syntax: 'scss' }),
    };
    const folhasDoFecho = Object.entries(scss).map(([nome, texto]) => entrada(`${dir}/${nome}`, texto));
    const globais = new Set(
      folhasDoFecho.map(f => f.arquivo).filter(a => !a.endsWith('.module.scss') && !path.basename(a).startsWith('_'))
    );
    const { ok } = veredito('--v', folhasDoFecho, globais, usos, (a, t) => compilarScss(t, a, [irma]));
    return ok !== chega;
  });
  r.ok(
    `detector de regra viva: os ${casos.length} casos reprovam onde a var não chega a nó nenhum e passam onde chega`,
    trocados.length === 0,
    trocados.map(([caso]) => caso).join(' | ')
  );
}

const layouts = lerLayouts();
const todos = itens(layouts);

// Mapa component → pasta do template, lido do registry (fonte única do vínculo).
const registry = fs.readFileSync(
  path.join(RAIZ, 'src/utils/templateRegistry.ts'), 'utf8'
);
const pastaDe = new Map();
for (const m of registry.matchAll(
  /import\s+(\w+)\s+from\s+'@\/components\/templates\/([^']+)'/g
)) pastaDe.set(m[1], m[2]);

const comPath = todos.filter(i => i.path);
r.ok(
  'todo item com `path` está no registry',
  comPath.every(i => pastaDe.has(i.component)),
  comPath.filter(i => !pastaDe.has(i.component)).map(i => i.component).join(', ')
);

let semSchema = 0;
let noStarter = 0;
let soPorFolhaGlobal = 0;
for (const item of comPath) {
  const pasta = pastaDe.get(item.component);
  if (!pasta) continue;
  // A convenção é `index.module.css`, mas dois templates antigos fogem dela:
  // `Spot01` usa `index.css` (NÃO é módulo — as classes dele são globais) e
  // `TextArea` ainda está em `index.module.scss`. Aceitar os três é o certo
  // aqui: este estágio confere VARIÁVEL, não nome de arquivo, e reprovar por
  // isso esconderia o que ele tem para dizer sobre os dois.
  const arq = ['index.module.css', 'index.css', 'index.module.scss']
    .map(n => path.join(RAIZ, 'src/components/templates', pasta, n))
    .find(fs.existsSync);
  if (!arq) {
    r.ok(`${item.component}: tem folha de estilo`, false, pasta);
    continue;
  }
  // A folha do template não é a história toda: o contrato do /from-faststore
  // manda inlinar o grafo inteiro num arquivo só, "exceto a infra transversal
  // que já vive em templates/_shared/". A gaveta de carrinho é justamente
  // isso, e é ela quem pinta `--cart-text` nos cinco Headers. Sem seguir o
  // import, o portão acusava cinco campos mortos que estão vivos.
  const dir = path.dirname(arq);
  const tsx = path.join(dir, 'index.tsx');
  const compartilhados = fs.existsSync(tsx)
    ? [...fs.readFileSync(tsx, 'utf8').matchAll(
        /from '@\/components\/templates\/(_shared\/[\w-]+)'/g
      )].map(m => path.join(RAIZ, 'src/components/templates', m[1], 'index.module.css'))
       .filter(fs.existsSync)
    : [];
  const css = [arq, ...compartilhados].map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const usadas = consumos(css);

  // 3 — token interno do catálogo dentro de um template
  const vazados = [...usadas.keys()].filter(v => INTERNOS.has(v));
  const dispensa = PENDENTES[item.component];
  if (dispensa && vazados.length) {
    dispensasUsadas.add(item.component);
    console.log(`  ⏳ ${item.component}: ${vazados.length} token(s) interno(s) — ${dispensa}`);
  } else {
    r.ok(
      `${item.component}: sem token interno do catálogo`,
      vazados.length === 0,
      vazados.join(', ')
    );
  }

  const schema = item.variablesSchema ?? [];
  if (!schema.length) { semSchema++; continue; }

  for (const v of schema) {
    // 1 — o CSS consome a var que o painel oferece
    const ok1 = r.ok(
      `${item.component} · ${v.cssVar}: o CSS consome`,
      usadas.has(v.cssVar)
    );
    if (!ok1) continue;
    // 2 — o default do painel é UM dos Níveis 3 que o CSS declara
    const n3s = [...usadas.get(v.cssVar)].map(nivel3).filter(x => x !== null);
    // Nível 3 derivado (`color-mix` do texto da seção) não tem valor textual
    // para comparar: o default do schema é o resultado, não a expressão. Fica
    // registrado, não reprovado — é o padrão de neutro-que-segue-o-texto.
    if (n3s.some(x => x.startsWith('color-mix('))) {
      console.log(`     ↳ ${item.component} · ${v.cssVar}: Nível 3 derivado (color-mix), default não comparável`);
      continue;
    }
    r.ok(
      `${item.component} · ${v.cssVar}: default == Nível 3 do CSS`,
      n3s.includes(v.default),
      `schema "${v.default}" · css ${JSON.stringify(n3s)}`
    );
  }

  // 4 — o SCSS do starter lê a var que o painel oferece, numa regra viva
  if (!manifests.has(item.path)) {
    r.ok(`${item.component}: ${item.path} tem manifest no starter`, false);
    continue;
  }
  const arqsDoFecho = scssDoFecho(item.path);
  const folhasDoFecho = arqsDoFecho.map(f => entrada(f, fs.readFileSync(f, 'utf8')));
  const globais = globaisDoFecho(item.path);
  const usos = usosDoFecho(item.path);
  const mortasDoItem = new Map();
  for (const v of schema) {
    noStarter++;
    const { ok, soIsenta, mortas, detalhe } = veredito(v.cssVar, folhasDoFecho, globais, usos);
    if (soIsenta) soPorFolhaGlobal++;
    if (ok) for (const m of mortas) mortasDoItem.set(descrever(m), m);
    r.ok(
      `${item.component} · ${v.cssVar}: o SCSS do starter consome numa regra viva`,
      ok,
      `${detalhe} — fecho de ${item.path}`
    );
  }
  if (mortasDoItem.size) {
    const classes = [...new Set([...mortasDoItem.values()].flatMap(m => m.falta))];
    console.log(
      `  ℹ️  ${item.component}: ${mortasDoItem.size} regra(s) morta(s) também leem var do painel, ` +
        `que chega por outra — o TSX não usa ${classes.slice(0, 8).map(c => `.${c}`).join(' ')}` +
        (classes.length > 8 ? ` +${classes.length - 8}` : '')
    );
  }
}

for (const nome of Object.keys(PENDENTES))
  r.ok(
    `dispensa de ${nome} ainda faz sentido`,
    dispensasUsadas.has(nome),
    'o componente não tem mais token interno — remova a dispensa'
  );

console.log(
  `  (${comPath.length} itens VTEX · ${comPath.length - semSchema} com schema · ` +
  `${semSchema} sem · ${noStarter} vars conferidas no starter, em ${folhas.size} SCSS ` +
  `compilados, ${soPorFolhaGlobal} só por folha global · ${INTERNOS.size} tokens internos)`
);
process.exit(r.fechar() ? 0 : 1);
