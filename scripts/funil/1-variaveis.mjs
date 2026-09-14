/**
 * Estágio 1v — o `variablesSchema` bate com o CSS que ele diz controlar?
 *
 * Este era o buraco mais silencioso do pipeline. O painel "variáveis por
 * componente" lista o que o `variablesSchema` declara; o preview e o tema
 * gerado pintam o que o CSS consome. Nada conferia que os dois falam da mesma
 * var, e o erro não aparece em lugar nenhum — some nos dois sentidos:
 *
 *   schema tem, CSS não usa  → o campo existe no painel e não faz NADA
 *   CSS usa, schema não tem  → a zona não é editável e ninguém percebe
 *
 * Confere três coisas por item de catálogo com `path` (origem VTEX):
 *
 *  1. toda `cssVar` do schema é consumida como Nível 1 pelo CSS do template;
 *  2. o `default` do schema é o Nível 3 do CSS, byte a byte (é contra ele que
 *     o `pickChangedVariables` decide o que exportar — se divergir, o export
 *     manda valor que o usuário não escolheu, ou omite o que ele escolheu);
 *  3. o CSS do template não consome token INTERNO do catálogo
 *     (`--ink`, `--paper`, `--accent`, `--grey-NN`, `--font-display`,
 *     `--font-body`, `--hairline`, `--ease`). Esses nomes existem no
 *     `globals.css` para a UI de marketing do e-temas e NÃO existem no tema do
 *     cliente: no preview pintam com a marca do e-temas (o rosa #e73888
 *     inclusive) e na loja gerada a declaração fica inválida — borda que some,
 *     fundo que vira transparente, fonte que cai na herdada.
 */
import fs from 'node:fs';
import path from 'node:path';
import { lerLayouts, itens, relatorio, RAIZ } from './lib/util.mjs';

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

const INTERNOS = /^--(ink|paper|accent|grey-\d+|hairline|ease|font-display|font-body)$/;

/**
 * Dispensas do item 3, com motivo obrigatório. Não é para esconder: é para o
 * portão poder ficar verde enquanto uma correção MAIOR que o achado está
 * agendada. Dispensa que não é mais necessária REPROVA — senão vira lixo que
 * ninguém remove.
 */
const PENDENTES = {};
const dispensasUsadas = new Set();

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
  const vazados = [...usadas.keys()].filter(v => INTERNOS.test(v));
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
}

for (const nome of Object.keys(PENDENTES))
  r.ok(
    `dispensa de ${nome} ainda faz sentido`,
    dispensasUsadas.has(nome),
    'o componente não tem mais token interno — remova a dispensa'
  );

console.log(
  `  (${comPath.length} itens VTEX · ${comPath.length - semSchema} com schema · ` +
  `${semSchema} sem)`
);
process.exit(r.fechar() ? 0 : 1);
