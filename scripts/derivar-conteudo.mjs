/**
 * Gera o schema de CONTEÚDO de cada componente do catálogo a partir do starter,
 * que é a fonte da verdade do "o que dá para editar de verdade" (o CMS da VTEX):
 *
 *   ../faststore.starter/src/components/<path>/manifest.json → section.schema
 *     → src/data/conteudo/schemas.generated.json
 *
 * Copia o schema sem traduzir nada — só as chaves de JSON Schema que os
 * manifests usam (`CHAVES`), na ordem dos campos de lá, que é a ordem do
 * formulário. Componente sem `section.schema` (cards, breadcrumbs, relacionados:
 * vivem do catálogo da plataforma) entra em `semSchema`.
 *
 *   yarn derivar:conteudo
 *
 * Um checkout do starter em outro lugar (worktree, clone na ponta do origin)
 * entra por `DERIVAR_STARTER`, a raiz do repo, como no `derivar:css`. O estágio
 * `1-conteudo` do funil importa `derivarConteudo` e compara com o arquivo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { FASTSTORE_STARTER, RAIZ, itens } from './funil/lib/util.mjs';

export const ARQUIVO_SCHEMAS = path.join(
  RAIZ,
  'src/data/conteudo/schemas.generated.json'
);

/** As chaves de JSON Schema que os manifests usam (levantadas em 23/11/2026). */
const CHAVES = [
  'type',
  'title',
  'description',
  'default',
  'enum',
  'enumNames',
  'widget',
  'format',
  'items',
  'properties',
  'required',
  'minItems',
  'maxItems',
  'minimum',
  'maximum',
];

function normalizar(no) {
  const saida = {};
  for (const chave of CHAVES) {
    if (no[chave] === undefined) continue;
    if (chave === 'items') saida.items = normalizar(no.items);
    else if (chave === 'properties')
      saida.properties = Object.fromEntries(
        Object.entries(no.properties).map(([campo, filho]) => [
          campo,
          normalizar(filho),
        ])
      );
    else saida[chave] = no[chave];
  }
  return saida;
}

/** O conteúdo do arquivo gerado, como objeto (o funil compara com o disco). */
export function derivarConteudo(
  starter = process.env.DERIVAR_STARTER || FASTSTORE_STARTER
) {
  const componentes = {};
  const semSchema = new Set();
  for (const item of itens()) {
    if (!item.path || componentes[item.component]) continue;
    const manifest = path.join(starter, 'src/components', item.path, 'manifest.json');
    const schema = fs.existsSync(manifest)
      ? JSON.parse(fs.readFileSync(manifest, 'utf8')).section?.schema
      : null;
    if (!schema?.properties || !Object.keys(schema.properties).length) {
      semSchema.add(item.component);
      continue;
    }
    componentes[item.component] = { path: item.path, schema: normalizar(schema) };
  }
  const ordenado = Object.fromEntries(
    Object.keys(componentes)
      .sort()
      .map(nome => [nome, componentes[nome]])
  );
  return {
    $gerado:
      'yarn derivar:conteudo, do section.schema dos manifests do faststore.starter. Não edite à mão.',
    componentes: ordenado,
    semSchema: [...semSchema].sort(),
  };
}

/** O texto exato do arquivo: o funil compara byte a byte. */
export const serializar = dados => `${JSON.stringify(dados, null, 2)}\n`;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const starter = process.env.DERIVAR_STARTER || FASTSTORE_STARTER;
  if (!fs.existsSync(path.join(starter, 'src/components'))) {
    console.error(
      `faststore.starter não encontrado em ${starter} (DERIVAR_STARTER aponta outro checkout).`
    );
    process.exit(1);
  }
  const dados = derivarConteudo(starter);
  fs.mkdirSync(path.dirname(ARQUIVO_SCHEMAS), { recursive: true });
  fs.writeFileSync(ARQUIVO_SCHEMAS, serializar(dados));

  let campos = 0;
  const contar = no => {
    for (const filho of Object.values(no.properties ?? {})) {
      campos++;
      if (filho.items) contar(filho.items);
      if (filho.properties) contar(filho);
    }
  };
  for (const { schema } of Object.values(dados.componentes)) contar(schema);
  console.log(
    `${Object.keys(dados.componentes).length} componentes com schema (${campos} campos), ` +
      `${dados.semSchema.length} sem → ${path.relative(RAIZ, ARQUIVO_SCHEMAS)}`
  );
}
