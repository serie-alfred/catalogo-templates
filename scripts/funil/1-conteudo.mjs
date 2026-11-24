/**
 * Estágio 1c — o conteúdo real do cliente (src/types/conteudo.ts) está de pé?
 *
 * O CS sobe textos, imagens e listas em cima do mock de cada componente; o
 * que dá para editar vem do `section.schema` dos manifests do starter (o CMS
 * da VTEX), copiado por `yarn derivar:conteudo`. Confere, sem navegador:
 *
 *  1. o schema gerado é o do starter — um campo novo lá precisa de um
 *     `yarn derivar:conteudo` aqui (sem o starter ao lado, só avisa);
 *  2. as regras do `resolverConteudo` e do `sanitizarConteudo`, rodando o
 *     próprio `src/utils/conteudo.ts` no Node (só importa tipos);
 *  3. todo componente que lê pelo `useConteudoDaSecao` tem schema, e todo campo
 *     do tipo `…Conteudo` dele existe no schema — erro de digitação num nome de
 *     campo faria o painel gravar uma chave que o template nunca lê;
 *  4. família listada em `FAMILIAS_MIGRADAS` tem TODO componente com schema
 *     lendo pelo hook (trava de regressão para a migração, família a família).
 *
 * Não prova que o campo aparece na tela: isso é com o `2-conteudo` (marcador
 * único em cada campo, conferido no DOM).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

import { FASTSTORE_STARTER, RAIZ, itens, ler, relatorio } from './lib/util.mjs';
import { ARQUIVO_SCHEMAS, derivarConteudo, serializar } from '../derivar-conteudo.mjs';

/** Famílias cuja migração terminou: todo componente com schema lê pelo hook. */
const FAMILIAS_MIGRADAS = [];

const r = relatorio('1-conteudo · schema do starter, resolvedor e migração');

// ── 1. schema gerado = starter ─────────────────────────────────────────────
const noDisco = ler(ARQUIVO_SCHEMAS);
r.ok('src/data/conteudo/schemas.generated.json existe', noDisco, 'rode yarn derivar:conteudo');
const schemas = noDisco ? JSON.parse(noDisco) : { componentes: {}, semSchema: [] };
const starter = process.env.DERIVAR_STARTER || FASTSTORE_STARTER;
if (fs.existsSync(path.join(starter, 'src/components'))) {
  r.ok(
    'schema gerado é o do starter (yarn derivar:conteudo sem diff)',
    // CRLF → LF: com `core.autocrlf=true` (Windows) o git entrega o arquivo com
    // CRLF, e o 1-checkout já reprova por isso; aqui a comparação é do conteúdo.
    noDisco.replace(/\r\n/g, '\n') === serializar(derivarConteudo(starter)),
    'um manifest mudou: rode yarn derivar:conteudo e revise o diff'
  );
} else {
  console.log('  ⏳ schema não conferido contra o starter: sem faststore.starter ao lado');
}

// ── 2. regras do resolvedor e do sanitizador ───────────────────────────────
const TESTE = `
import { resolverConteudo, sanitizarConteudo, levarConteudo } from ${JSON.stringify(
  pathToFileURL(path.join(RAIZ, 'src/utils/conteudo.ts')).href
)};
const casos = [];
const ok = (nome, cond, det = '') => casos.push({ nome, ok: !!cond, det: String(det) });
const MOCK = { title: 'Mock', items: [{ a: 1 }, { a: 2 }], banner: { x: 'a', y: 'b' }, n: 3, flag: true };
const r0 = resolverConteudo(MOCK);
ok('sem nível, o resolvedor devolve uma cópia do mock', JSON.stringify(r0) === JSON.stringify(MOCK) && r0 !== MOCK);
const r1 = resolverConteudo(MOCK, { items: [{ a: 9 }] });
ok('lista do nível 1 substitui a do mock inteira', r1.items.length === 1 && r1.items[0].a === 9);
const r2 = resolverConteudo(MOCK, { banner: { x: 'z' } });
ok('objeto do nível 1 vem inteiro, sem mesclar com o mock', r2.banner.x === 'z' && r2.banner.y === undefined);
const r3 = resolverConteudo(MOCK, { title: '', items: [] });
ok('texto vazio e lista vazia valem (não voltam ao mock)', r3.title === '' && r3.items.length === 0);
const r4 = resolverConteudo(MOCK, { title: ['x'], items: 'x', banner: [1], n: '7', flag: 'sim' });
ok('valor com forma diferente da do mock é ignorado', r4.title === 'Mock' && r4.items.length === 2 && !Array.isArray(r4.banner) && r4.n === 3 && r4.flag === true, JSON.stringify(r4));
const r5 = resolverConteudo(MOCK, { imageDesktop: 'https://cdn.exemplo/x.webp' });
ok('campo opcional que o mock não traz entra', r5.imageDesktop === 'https://cdn.exemplo/x.webp');
ok('o nível mais forte (o último) vence', resolverConteudo(MOCK, { title: 'loja' }, { title: 'secao' }).title === 'secao');
ok('o nível 2 vale quando o 1 não tem o campo', resolverConteudo(MOCK, { title: 'loja' }, {}).title === 'loja');
const s1 = sanitizarConteudo({ url: 'javascript:alert(1)', vb: ' VBScript:x', img: 'data:image/png;base64,AAA', data: 'Data: 25/11 a 30/11', link: 'https://loja.exemplo' });
ok('sanitizar tira javascript:, vbscript: e data: de imagem', s1 && !('url' in s1) && !('vb' in s1) && !('img' in s1), JSON.stringify(s1));
ok('sanitizar mantém "Data: 25/11" (texto em português) e https', s1 && s1.data === 'Data: 25/11 a 30/11' && s1.link === 'https://loja.exemplo');
const s2 = sanitizarConteudo(JSON.parse('{"__proto__": {"poluido": 1}, "a": "b"}'));
ok('sanitizar ignora __proto__', s2 && s2.a === 'b' && !Object.prototype.hasOwnProperty.call(s2, '__proto__') && ({}).poluido === undefined);
ok('sanitizar recusa o que não é objeto', sanitizarConteudo('x') === undefined && sanitizarConteudo([1]) === undefined && sanitizarConteudo(null) === undefined);
ok('sanitizar devolve undefined quando nada sobra', sanitizarConteudo({ a: 'javascript:x' }) === undefined);
const s3 = sanitizarConteudo({ lista: ['ok', 'javascript:x', 3, null, { f: () => 1 }] });
ok('sanitizar limpa dentro de listas', s3 && JSON.stringify(s3.lista) === '["ok",3,{}]', JSON.stringify(s3));
const s4 = sanitizarConteudo({ n: Infinity, m: NaN, k: 2 });
ok('sanitizar tira número não finito', s4 && !('n' in s4) && !('m' in s4) && s4.k === 2);
ok('levarConteudo leva o nível 1 inteiro e nada quando não há', levarConteudo({ content: { a: 'b' } }).content.a === 'b' && Object.keys(levarConteudo({})).length === 0);
process.stdout.write(JSON.stringify(casos));
`;
try {
  const casos = JSON.parse(
    execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '--eval', TESTE], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  );
  for (const c of casos) r.ok(c.nome, c.ok, c.det);
} catch (erro) {
  r.ok('src/utils/conteudo.ts carrega no Node (só pode importar tipos)', false, String(erro.stderr || erro.message).split('\n')[0]);
}

// ── 3. quem lê pelo hook tem schema, e os campos do tipo existem nele ──────
/** Componente → arquivo, pelas linhas de import do TemplateRegistry. */
const arquivoDe = new Map(
  [...ler(path.join(RAIZ, 'src/utils/templateRegistry.ts')).matchAll(
    /^import\s+(\w+)\s+from\s+'@\/components\/templates\/([^']+)';/gm
  )].map(([, nome, rel]) => [nome, path.join(RAIZ, 'src/components/templates', rel, 'index.tsx')])
);

/** Campos de primeiro nível da `interface …Conteudo` do arquivo (sem os aninhados). */
function camposDoTipo(fonte) {
  const semComentario = fonte.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const inicio = /interface\s+\w*Conteudo\s*\{/.exec(semComentario);
  if (!inicio) return null;
  let profundidade = 0;
  let topo = '';
  for (let i = inicio.index + inicio[0].length; i < semComentario.length; i++) {
    const ch = semComentario[i];
    if ('{(['.includes(ch)) profundidade++;
    else if ('})]'.includes(ch)) {
      if (profundidade === 0) break;
      profundidade--;
    } else if (profundidade === 0) topo += ch;
  }
  return [...topo.matchAll(/(\w+)\??\s*:/g)].map(m => m[1]);
}

const migrados = new Set();
for (const [nome, arquivo] of arquivoDe) {
  const fonte = ler(arquivo);
  if (!fonte.includes('useConteudoDaSecao(')) continue;
  migrados.add(nome);
  const schema = schemas.componentes[nome]?.schema;
  if (!r.ok(`${nome}: lê pelo hook e tem schema`, schema, 'componente sem section.schema no starter')) continue;
  const campos = camposDoTipo(fonte);
  if (!r.ok(`${nome}: declara a interface …Conteudo`, campos, 'o tipo do MOCK é o contrato com o schema')) continue;
  const doSchema = Object.keys(schema.properties);
  const estranhos = campos.filter(c => !doSchema.includes(c));
  r.ok(`${nome}: todo campo do tipo existe no schema`, estranhos.length === 0, estranhos.join(', '));
  const faltam = doSchema.filter(c => !campos.includes(c));
  if (faltam.length) console.log(`  ℹ️  ${nome}: campos do schema que a réplica ainda não desenha: ${faltam.join(', ')}`);
}

// ── 4. família migrada = família inteira ───────────────────────────────────
const catalogo = itens();
for (const familia of FAMILIAS_MIGRADAS) {
  const faltam = catalogo
    .filter(i => i.template === familia && schemas.componentes[i.component] && !migrados.has(i.component))
    .map(i => i.component);
  r.ok(`família ${familia}: todo componente com schema lê pelo hook`, faltam.length === 0, faltam.join(', '));
}

const comSchema = catalogo.filter(i => schemas.componentes[i.component]);
const porFamilia = new Map();
for (const i of comSchema) {
  const f = porFamilia.get(i.template) ?? { total: 0, feitos: 0 };
  f.total++;
  if (migrados.has(i.component)) f.feitos++;
  porFamilia.set(i.template, f);
}
const comecadas = [...porFamilia]
  .filter(([, f]) => f.feitos)
  .map(([t, f]) => `${t.padStart(2, '0')}: ${f.feitos}/${f.total}`)
  .join(' · ');
console.log(
  `  (${migrados.size}/${comSchema.length} componentes com schema leem pelo hook${comecadas ? ` — ${comecadas}` : ''}; ` +
    `${schemas.semSchema.length} sem schema)`
);
process.exit(r.fechar() ? 0 : 1);
