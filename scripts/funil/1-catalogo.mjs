/**
 * Estágio 1 — integridade do catálogo. Estático, sem browser, segundos.
 *
 * Lê o LAYOUTS desserializado e confere os invariantes que, quebrados, só
 * apareceriam lá na frente: no tema gerado, ou não aparecendo nunca.
 */
import fs from 'node:fs';
import path from 'node:path';
import { conferirFragmentos } from './lib/contrato.mjs';
import {
  RAIZ,
  GLOBAL_TEMPLATES,
  FASTSTORE_STARTER,
  lerLayouts,
  itens,
  relatorio,
} from './lib/util.mjs';

const r = relatorio('Estágio 1 — catálogo íntegro');
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

// 4. todo item VTEX tem path — sem ele o export descarta o item em silêncio
const vtexSemPath = todos
  .filter(i => i.platforms.includes('VTEX') && !i.path)
  .map(i => i.component);
r.ok(
  'todo item VTEX tem path',
  vtexSemPath.length === 0,
  vtexSemPath.join(', ')
);

// 5. registry ↔ catálogo, nos dois sentidos. Entrada sem item ativo é peso morto
//    no bundle; item sem entrada cai num placeholder PNG sem avisar.
const regSrc = fs.readFileSync(
  path.join(RAIZ, 'src/utils/templateRegistry.ts'),
  'utf8'
);
const importados = new Set(
  [...regSrc.matchAll(/^import\s+([A-Z][A-Za-z0-9]*)\s+from/gm)].map(m => m[1])
);
const usados = new Set(todos.map(i => i.component));
const orfaos = [...importados].filter(c => !usados.has(c));
const ausentes = [...usados].filter(c => !importados.has(c));
r.ok(
  `registry sem órfão (${importados.size} imports)`,
  orfaos.length === 0,
  orfaos.join(', ')
);
r.ok(
  'todo component está no registry',
  ausentes.length === 0,
  ausentes.join(', ')
);

// 6. o mock existe em disco
const caminhoMock = new Map(
  [
    ...regSrc.matchAll(
      /import\s+([A-Z][A-Za-z0-9]*)\s+from\s+'@\/components\/templates\/([^']+)'/g
    ),
  ].map(m => [m[1], m[2]])
);
const semMock = [...usados].filter(c => {
  const rel = caminhoMock.get(c);
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
  `origem Tray (${nTray}) e Wake (${nWake}) existe`,
  semOrigem.length === 0,
  semOrigem.join(' | ')
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

// 9. cada componente VTEX se sustenta sozinho no tema gerado. O starter tem os
//    quatro fragments em disco e sempre compila; o tema só recebe o que está
//    declarado, e um campo de extensão sem fragment derruba o build lá.
conferirFragmentos(
  [
    ...new Set(
      todos.filter(i => i.platforms.includes('VTEX') && i.path).map(i => i.path)
    ),
  ],
  r
);

console.log(
  `  (${todos.length} itens em ${Object.keys(layouts).length} seções)`
);
process.exit(r.fechar() ? 0 : 1);
