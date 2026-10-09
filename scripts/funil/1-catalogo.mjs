/**
 * Estágio 1 — integridade do catálogo. Estático, sem browser, segundos.
 *
 * Lê o LAYOUTS desserializado e confere os invariantes que, quebrados, só
 * apareceriam lá na frente: no tema gerado, ou não aparecendo nunca.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  conferirFragmentos,
  conferirImports,
  conferirParesCardVitrine,
  conferirScssPortavel,
  conferirAlertasDaApuracao,
  conferirRegistroDeResolvers,
  conferirParidadeGlobalTemplates,
  lerManifests,
  raizesDoTema,
} from './lib/contrato.mjs';
import {
  RAIZ,
  GLOBAL_TEMPLATES,
  FASTSTORE_STARTER,
  lerLayouts,
  itens,
  relatorio,
} from './lib/util.mjs';
import { conferirParesDeFidelidade } from './lib/fidelidade.mjs';

const r = relatorio('Estágio 1 — catálogo íntegro');

// As checagens estáticas leem o WORKING TREE do starter; o generator, no estágio 4,
// clona `base/faststore`. Se o checkout local estiver em outra branch, este estágio
// mede uma árvore que a produção não vai ver — e passa verde por isso.
{
  const atual = spawnSync('git', ['branch', '--show-current'], {
    cwd: FASTSTORE_STARTER,
    encoding: 'utf8',
  }).stdout.trim();
  const esperada = process.env.FASTSTORE_COMPONENTS_BRANCH ?? 'base/faststore';
  r.ok(
    `starter em ${esperada} (checkout: ${atual || '(destacado)'})`,
    atual === esperada,
    'as checagens estáticas leriam uma árvore diferente da que o generator clona'
  );
}
const layouts = lerLayouts();
const todos = itens(layouts);

// 1. chaves únicas — a Wake usa `key` para deduplicar SCSS/JS (key::arquivo),
//    então chave repetida entre itens DIFERENTES faz um perder o estilo do outro.
const porChave = new Map();
for (const i of todos)
  (porChave.get(i.key) ?? porChave.set(i.key, []).get(i.key)).push(
    `${i.layoutKey}/${i.id}`
  );
const chavesDup = [...porChave].filter(([, v]) => v.length > 1);
r.ok(
  `chaves únicas (${porChave.size}/${todos.length})`,
  chavesDup.length === 0,
  JSON.stringify(chavesDup)
);

// 2. id único dentro da seção — é como toggleSelection e o export encontram o item
const idsDup = Object.entries(layouts)
  .map(([k, s]) => [k, s.items.map(i => i.id)])
  .filter(([, ids]) => new Set(ids).size !== ids.length);
r.ok('id único por seção', idsDup.length === 0, JSON.stringify(idsDup));

// 3. campos obrigatórios
const OBRIGATORIOS = [
  'id',
  'selection',
  'key',
  'image',
  'mobile',
  'component',
  'title',
  'description',
  'template',
  'pagina',
  'platforms',
  'backgroundVars',
];
const semCampo = todos.flatMap(i => {
  const faltam = OBRIGATORIOS.filter(c => !(c in i));
  return faltam.length ? [`${i.component}: ${faltam}`] : [];
});
r.ok(
  'campos obrigatórios presentes',
  semCampo.length === 0,
  semCampo.join(' | ')
);

// 3b. a thumb existe DE VERDADE. A checagem acima usa `in`, que só olha a presença
//     da chave: `image: ""` passa, e um caminho apontando para arquivo apagado
//     também. Foi exatamente esse o estado que durou até 15/09/2026 — funil verde,
//     90 cards no placeholder cinza. Sem esta asserção a próxima regressão é igual
//     de silenciosa: apagar um .webp, renomear uma pasta, ou acrescentar um
//     LayoutItem sem rodar `yarn thumbs`.
const THUMBS = path.join(RAIZ, 'public/images/gerador');
const semThumb = todos.flatMap(i =>
  !i.image || !fs.existsSync(path.join(THUMBS, i.image))
    ? [`${i.component} → ${i.image || '(vazio)'}`]
    : []
);
r.ok(
  `thumb em disco para os ${todos.length} itens`,
  semThumb.length === 0,
  semThumb.join(' | ')
);

// 3c. `imageSource` é o que separa arte do designer de screenshot gerado, e é a
//     lista de pendências que docs/THUMBS-DOS-COMPONENTES.md publica. Item sem ele
//     não some da tela — some da contabilidade, que é pior.
const fontesValidas = new Set(['design', 'auto']);
const semFonte = todos
  .filter(i => !fontesValidas.has(i.imageSource))
  .map(i => `${i.component} → ${i.imageSource ?? '(ausente)'}`);
r.ok(
  'toda thumb declara imageSource (design|auto)',
  semFonte.length === 0,
  semFonte.join(' | ')
);

// 3d. o caminho segue <layoutKey>/<Component>.webp e nenhum .webp fica órfão.
//     `component` é a chave porque é o único campo único nos 90 itens (`id` repete
//     entre seções, `key` repete em alguns, `title` repete em 4).
const foraDaRegra = todos
  .filter(i => i.image && i.image !== `${i.layoutKey}/${i.component}.webp`)
  .map(i => `${i.component} → ${i.image}`);
r.ok(
  'thumb segue <layoutKey>/<Component>.webp',
  foraDaRegra.length === 0,
  foraDaRegra.join(' | ')
);

const referenciadas = new Set(todos.map(i => i.image));
const orfas = fs.existsSync(THUMBS)
  ? fs
      .readdirSync(THUMBS)
      .filter(d => fs.statSync(path.join(THUMBS, d)).isDirectory())
      .flatMap(d =>
        fs
          .readdirSync(path.join(THUMBS, d))
          .filter(f => f.endsWith('.webp'))
          .map(f => `${d}/${f}`)
      )
      .filter(f => !referenciadas.has(f))
  : [];
r.ok('nenhuma thumb órfã em public/images/gerador', orfas.length === 0, orfas.join(' | '));

// 3e. mapa.json ↔ catálogo. Renomear um componente não avisa o mapa: foi assim que o
//     ProductInfo05 virou ProductInfo06 em 22/09/2026 com o mapa ainda dizendo 05 — o
//     próximo `yarn thumbs` escreveria productInfo/ProductInfo05.webp, que nenhum item
//     lê, e a arte deixaria de ter origem registrada. O sentido inverso pega o mesmo
//     buraco pelo outro lado: item `design` fora do mapa só continua `design` pelo
//     cadeado do aplicar.mjs, sem dizer de qual arquivo a imagem saiu. E item do mapa
//     marcado `auto` é arte do designer que o catálogo conta como pendência (e que o
//     auto.mjs pularia de qualquer jeito, pelo outro cadeado).
{
  const mapa = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'scripts/thumbs/mapa.json'), 'utf8')
  );
  const noCatalogo = new Set(todos.map(i => `${i.layoutKey}/${i.component}`));
  const doMapa = new Set(mapa.itens.map(i => `${i.layoutKey}/${i.component}`));
  const semItem = [...doMapa].filter(c => !noCatalogo.has(c));
  const semOrigem = todos
    .filter(i => i.imageSource === 'design' && !doMapa.has(`${i.layoutKey}/${i.component}`))
    .map(i => `${i.layoutKey}/${i.component}`);
  const naoDesign = todos
    .filter(i => i.imageSource !== 'design' && doMapa.has(`${i.layoutKey}/${i.component}`))
    .map(i => `${i.layoutKey}/${i.component} (${i.imageSource ?? 'sem imageSource'})`);
  r.ok(
    `mapa.json casa com o catálogo (${doMapa.size} artes de design)`,
    semItem.length === 0 && semOrigem.length === 0 && naoDesign.length === 0,
    [
      semItem.length && `no mapa sem item no catálogo: ${semItem.join(', ')}`,
      semOrigem.length && `design sem arte no mapa: ${semOrigem.join(', ')}`,
      naoDesign.length && `no mapa mas não design no catálogo: ${naoDesign.join(', ')}`,
    ]
      .filter(Boolean)
      .join(' | ')
  );
}

// 4. todo item VTEX tem path — sem ele o export descarta o item em silêncio
const vtexSemPath = todos
  .filter(i => i.platforms.includes('VTEX') && !i.path)
  .map(i => i.component);
r.ok(
  'todo item VTEX tem path',
  vtexSemPath.length === 0,
  vtexSemPath.join(', ')
);

// 5. registry ↔ catálogo, nos dois sentidos, pelas CHAVES do objeto
//    `TemplateRegistry` — é ele que o ThemeRenderer consulta. Até 24/09 isto lia
//    as linhas de import: tirar `Footer06,` do objeto e deixar o import passava
//    verde, e no app o rodapé virava o marcador vermelho "não está no
//    TemplateRegistry". Entrada sem item ativo é peso morto no bundle.
const regSrc = fs.readFileSync(
  path.join(RAIZ, 'src/utils/templateRegistry.ts'),
  'utf8'
);
const importados = new Set(
  [...regSrc.matchAll(/^import\s+([A-Z][A-Za-z0-9]*)\s+from/gm)].map(m => m[1])
);
const { default: ts } = await import('typescript');
const fonteReg = ts.createSourceFile(
  'templateRegistry.ts',
  regSrc,
  ts.ScriptTarget.Latest,
  true
);
const objeto = fonteReg.statements
  .filter(ts.isVariableStatement)
  .flatMap(st => [...st.declarationList.declarations])
  .find(d => ts.isIdentifier(d.name) && d.name.text === 'TemplateRegistry')
  ?.initializer;
// chave → o identificador que ela renderiza
const registro = new Map();
const ilegiveis = [];
for (const p of objeto && ts.isObjectLiteralExpression(objeto)
  ? objeto.properties
  : []) {
  if (ts.isShorthandPropertyAssignment(p)) registro.set(p.name.text, p.name.text);
  else if (
    ts.isPropertyAssignment(p) &&
    (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) &&
    ts.isIdentifier(p.initializer)
  )
    registro.set(p.name.text, p.initializer.text);
  else ilegiveis.push(p.getText().slice(0, 60));
}
const usados = new Set(todos.map(i => i.component));
const renderizados = new Set(registro.values());
const orfaos = [
  ...[...registro.keys()].filter(c => !usados.has(c)).map(c => `${c} (chave sem item)`),
  ...[...importados]
    .filter(c => !renderizados.has(c))
    .map(c => `${c} (importado e fora do objeto)`),
];
const ausentes = [
  ...(registro.size ? [] : ['objeto TemplateRegistry não encontrado ou vazio']),
  ...ilegiveis.map(t => `entrada que não é \`Nome\` nem \`Nome: Ident\`: ${t}`),
  ...[...usados].filter(c => !registro.has(c)).map(c => `${c} (sem chave no objeto)`),
  ...[...registro].filter(([k, v]) => k !== v).map(([k, v]) => `${k} renderiza ${v}`),
  ...[...renderizados].filter(v => !importados.has(v)).map(v => `${v} (sem import)`),
];
r.ok(
  `registry sem órfão (${registro.size} chaves, ${importados.size} imports)`,
  orfaos.length === 0,
  orfaos.join(', ')
);
r.ok(
  'todo component está no registry',
  ausentes.length === 0,
  ausentes.join(', ')
);

// 6. o mock existe em disco — o do identificador que a chave renderiza
const caminhoMock = new Map(
  [
    ...regSrc.matchAll(
      /import\s+([A-Z][A-Za-z0-9]*)\s+from\s+'@\/components\/templates\/([^']+)'/g
    ),
  ].map(m => [m[1], m[2]])
);
const semMock = [...usados].filter(c => {
  const rel = caminhoMock.get(registro.get(c) ?? c);
  return (
    !rel || !fs.existsSync(path.join(RAIZ, 'src/components/templates', rel))
  );
});
r.ok('todo mock existe em disco', semMock.length === 0, semMock.join(', '));

// 7. origem real em global-templates. O `component` NÃO participa do caminho:
//    o generator monta template_<template>/<selection> sob a pasta da página.
const PASTA = {
  common: 'Common',
  home: 'Home',
  category: 'Category',
  product: 'Product',
  landing: 'Landing',
};
const semOrigem = [];
let nTray = 0,
  nWake = 0;
for (const i of todos) {
  for (const plat of ['Tray', 'Wake']) {
    if (!i.platforms.includes(plat)) continue;
    plat === 'Tray' ? nTray++ : nWake++;
    const p = path.join(
      GLOBAL_TEMPLATES,
      plat,
      PASTA[i.pagina[0]],
      `template_${i.template}`,
      i.selection
    );
    if (!fs.existsSync(p))
      semOrigem.push(`${i.component} → ${path.relative(GLOBAL_TEMPLATES, p)}`);
  }
}
r.ok(
  `origem Tray (${nTray}) e Wake (${nWake}) existe no global-templates local`,
  semOrigem.length === 0,
  semOrigem.join(' | ')
);
// ...que é o clone do GitHub, não o do GitLab que o generator clona: diz qual
// árvore foi lida e compara as duas quando o GitLab responde.
await conferirParidadeGlobalTemplates(r);

// 7b. conteúdo hospedado no CDN de OUTRA loja.
//
// Medido em 09/09: quatro subdomínios `*.fbitsstatic.net` aparecem chumbados no
// global-templates — `agenciaseriedesign2` (a loja de demonstração da agência) e,
// pior, `guardaroba`, `plenitudedistribuidora` e `chasleao`, que são lojas de
// CLIENTE. Aberto arquivo por arquivo: 15 `<img src>` renderizam de verdade na
// página, todos vivos e todos em CDN de terceiro — inclusive `barcode.svg` e
// `credit-card.svg`, que vêm do CDN de um cliente. Um site novo passa a depender de
// outra loja não apagar o arquivo.
//
// (As outras 60 URLs, essas 404, estão em regras `&[data-value="xadrez gales"]` —
// nome de cor do catálogo de uma loja só. O seletor nunca casa em outra loja, então
// é CSS morto viajando junto, não imagem quebrada na tela.)
//
// Não é conserto meu — trocar as imagens ou definir onde hospedá-las é decisão de
// produto, e a trilha Wake não é validável desta máquina.
//
// O que dá para garantir é que a lista não CRESÇA, e que encolha junto quando uma
// pasta for limpa: item que saiu e continua aqui é vaga reservada para a mesma
// pasta voltar a sujar sem ninguém ver. As duas direções reprovam.
const CDN_DE_TERCEIRO =
  /(agenciaseriedesign2|guardaroba|plenitudedistribuidora|chasleao)\.fbitsstatic\.net/;
// Eram 8. Os três `Wake/Common/template_*/spot` saíram em 10/09 com a remoção
// das 409 linhas de CSS morto — lá o host alheio só aparecia em regra que nunca
// casava. Os cinco que restam têm `<img src>` de verdade, e esses dependem de
// decisão de conteúdo.
const CONTAMINADOS_CONHECIDOS = new Set([
  'Tray/Home/template_6/category-triple',
  'Tray/Home/template_6/client-review',
  'Wake/Home/template_1/categories',
  'Wake/Product/template_1/product-info',
  'Wake/Product/template_2/product-info',
]);
const contaminados = new Set();
for (const i of todos) {
  for (const plat of ['Tray', 'Wake']) {
    if (!i.platforms.includes(plat)) continue;
    const rel = `${plat}/${PASTA[i.pagina[0]]}/template_${i.template}/${i.selection}`;
    const dir = path.join(GLOBAL_TEMPLATES, rel);
    if (!fs.existsSync(dir)) continue;
    const sujo = fs
      .readdirSync(dir)
      .some(
        f =>
          fs.statSync(path.join(dir, f)).isFile() &&
          CDN_DE_TERCEIRO.test(fs.readFileSync(path.join(dir, f), 'utf8'))
      );
    if (sujo) contaminados.add(rel);
  }
}
const novos = [...contaminados].filter(c => !CONTAMINADOS_CONHECIDOS.has(c));
const sumiram = [...CONTAMINADOS_CONHECIDOS].filter(c => !contaminados.has(c));
r.ok(
  `nenhum componente NOVO trazendo CDN de outra loja (${contaminados.size} conhecidos)`,
  novos.length === 0,
  novos.join(', ')
);
r.ok(
  `CONTAMINADOS_CONHECIDOS só lista pasta ainda suja (${CONTAMINADOS_CONHECIDOS.size})`,
  sumiram.length === 0,
  `limpos desde a medição — tire de CONTAMINADOS_CONHECIDOS: ${sumiram.join(', ')}`
);

// 8. manifest do faststore presente para cada path
const semManifest = todos
  .filter(i => i.platforms.includes('VTEX') && i.path)
  .filter(
    i =>
      !fs.existsSync(
        path.join(FASTSTORE_STARTER, 'src/components', i.path, 'manifest.json')
      )
  )
  .map(i => i.path);
r.ok(
  'manifest presente para cada path VTEX',
  semManifest.length === 0,
  semManifest.join(', ')
);

// As raízes que o generator acrescenta às do catálogo (ver `raizesDoTema`). Sem
// elas, os itens 9, 10 e 13 abaixo nunca liam o ProductShowcase03…07 nem o
// CrossSellingShelf01 — que chegam ao tema de quem escolhe a vitrine.
const manifests = lerManifests();
const vtexPaths = [
  ...new Set(
    todos.filter(i => i.platforms.includes('VTEX') && i.path).map(i => i.path)
  ),
];
const raizes = raizesDoTema(vtexPaths, id => manifests.has(id));
const injetadas = raizes.filter(id => !vtexPaths.includes(id));
const injetadaSemManifest = injetadas.filter(id => !manifests.has(id));
r.ok(
  `manifest presente para as ${injetadas.length} raízes que o generator injeta (${injetadas.join(', ')})`,
  injetadas.length > 0 && injetadaSemManifest.length === 0,
  injetadas.length
    ? `sem manifest: ${injetadaSemManifest.join(', ')}`
    : 'nenhuma — o catálogo não oferece ProductShowcase01 nem vitrine com showcase'
);

// 8b. todo par do `2-fidelidade` aponta para a réplica do componente que mede.
//     Renumerar um item não avisa o par: o 63f0c6d renumerou quatro, e o estágio
//     de fidelidade morreu no primeiro par com um erro de canvas que não dizia
//     nada — ou, na troca 04↔07, mediu cada PDP contra a réplica da outra.
conferirParesDeFidelidade(layouts, r);

// 9. cada raiz do tema se sustenta sozinha no tema gerado. O starter tem os
//    quatro fragments em disco e sempre compila; o tema só recebe o que está
//    declarado, e um campo de extensão sem fragment derruba o build lá.
conferirFragmentos(raizes, r);
// 10. e todo import relativo desses assets aponta para algo declarado. É a forma
//     geral do item 9: no starter tudo resolve porque o repo inteiro está em
//     disco; no tema só chega o que está no grafo.
conferirImports(raizes, r);

// 11. o catálogo oferece card e vitrine como escolhas INDEPENDENTES; a
//     substituição de spot troca o card dentro da vitrine. Qualquer par é
//     possível, e o par incompatível só aparece no build do tema.
await conferirParesCardVitrine(vtexPaths, r);

// 13. e o SCSS desses assets precisa compilar nas DUAS versões do FastStore: o
//     starter está na v4, o tema-base do cliente ainda na v3.
conferirScssPortavel(raizes, r);

// 14. os três alertas da apuração paralela viram INVARIANTE, não lembrete.
//     Eu os conferi à mão uma vez, e essa conferência evaporou como qualquer
//     coisa que só existe no terminal. Aqui elas rodam em toda execução.
await conferirAlertasDaApuracao(r);

// 15. todo resolver chega ao tema registrado do jeito que o default export pede.
//     O `resolvers/index.ts` do starter é escrito à mão e nunca lê o
//     `registration`; o do tema é escrito só a partir dele.
await conferirRegistroDeResolvers(r);

console.log(
  `  (${todos.length} itens em ${Object.keys(layouts).length} seções)`
);
process.exit(r.fechar() ? 0 : 1);
