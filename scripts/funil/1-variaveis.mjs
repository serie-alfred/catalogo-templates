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
 *  4. toda `cssVar` do schema aparece como `var(<cssVar>` no SCSS do fecho do
 *     `path` no starter — a pasta de cada componente que o grafo de manifests
 *     arrasta, mais o `dependencies.scss` declarado —, que é de onde o tema é
 *     montado. Em 24/09/2026 cinco campos passavam em 1 e 2 e morriam aqui: o
 *     painel mexia no preview, o gerador injetava a var no tema e nenhum
 *     seletor a lia.
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
const scssEm = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory()
      ? scssEm(path.join(dir, e.name))
      : e.name.endsWith('.scss') ? [path.join(dir, e.name)] : []
  );
function scssDoFecho(id) {
  const arqs = new Set();
  for (const dep of fechoCompleto(id, manifests)) {
    const d = manifests.get(dep);
    for (const f of scssEm(d._dir)) arqs.add(f);
    for (const nome of d.dependencies?.scss ?? [])
      arqs.add(path.join(FASTSTORE_STARTER, 'src/sass', `${nome}.module.scss`));
  }
  return [...arqs].filter(f => fs.existsSync(f));
}
// SCSS tem os dois tipos de comentário. O `//` precedido de `:` fica, porque é
// o `http://` dos SVGs em data-URI, não comentário.
const semComentariosScss = txt =>
  txt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
// O nome é `--[\w-]+`, nada nele é especial numa regex; o lookahead impede que
// `--spot-tag-bg` case dentro de `--spot-tag-bg-hover`.
const consome = (scss, nome) => new RegExp(`var\\(\\s*${nome}(?![\\w-])`).test(scss);

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

  // 4 — o SCSS do starter consome a var que o painel oferece
  if (!manifests.has(item.path)) {
    r.ok(`${item.component}: ${item.path} tem manifest no starter`, false);
    continue;
  }
  const arqsDoFecho = scssDoFecho(item.path);
  const scss = arqsDoFecho
    .map(f => semComentariosScss(fs.readFileSync(f, 'utf8')))
    .join('\n');
  for (const v of schema) {
    noStarter++;
    r.ok(
      `${item.component} · ${v.cssVar}: o SCSS do starter consome`,
      consome(scss, v.cssVar),
      `nenhum var(${v.cssVar} nos ${arqsDoFecho.length} SCSS do fecho de ${item.path}`
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
  `${semSchema} sem · ${noStarter} vars conferidas no starter · ` +
  `${INTERNOS.size} tokens internos)`
);
process.exit(r.fechar() ? 0 : 1);
