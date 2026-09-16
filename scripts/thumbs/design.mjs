/**
 * Converte os mockups do designer nas thumbs que o card do /gerador mostra.
 *
 * Entrada:  os JPGs 1920x1035 de "Banners E-temas", um por componente.
 * Saída:    public/images/gerador/<layoutKey>/<Component>.webp a 744x401.
 *
 * O mapa imagem->componente é DADO, não código: mora em `mapa.json`, foi apurado
 * visualmente e conferido contra os renders reais de `.funil/`. Mexer no pareamento
 * é mexer no JSON.
 *
 * Por que WebP e por que 744x401: o repo não tem Git LFS e `public/images` não está
 * no .gitignore, então todo byte commitado fica permanente no pack — a remoção
 * anterior de `public/images/gerador/` deixou 8,3 MB órfãos lá até hoje. Os JPGs
 * crus custariam ~40 MB para sempre; assim custam ~3 MB. 744x401 é 2x o slot do
 * card (334.667x180.333, ratio 1.856) — que é exatamente o ratio dos mockups.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { DESTINO, LARGURA, ALTURA, caminhoDe, lerMapa } from './lib.mjs';

const MAPA = lerMapa();
const ORIGEM = process.env.THUMBS_ORIGEM ?? MAPA.origem;

// Sair com 0, não com 1. Os mockups são deliberadamente não versionados (~40 MB),
// então NENHUMA outra máquina — nem o CI — tem a pasta: com `exit(1)` o `&&` do
// `yarn thumbs` derrubava junto os dois estágios que não dependem dela, e o comando
// documentado falhava na primeira linha para todo mundo que não é o dono do
// ~/Downloads. As thumbs de design já em disco são preservadas de qualquer jeito.
if (!fs.existsSync(ORIGEM)) {
  console.warn(
    `⚠️  sem os mockups em ${ORIGEM}\n` +
      `   Pulando o estágio de design — as thumbs de design já em disco ficam como estão.\n` +
      `   Para regerá-las, aponte THUMBS_ORIGEM para a pasta "Banners E-temas"\n` +
      `   ou ajuste "origem" em scripts/thumbs/mapa.json.`
  );
  process.exit(0);
}

// Uma arte que mostra dois componentes nítidos aparece duas vezes no mapa, uma por
// componente. É daí que sai o imageSharedWith — não há campo a manter em dois lugares.
const porArquivo = new Map();
for (const it of MAPA.itens) {
  if (!porArquivo.has(it.arquivo)) porArquivo.set(it.arquivo, []);
  porArquivo.get(it.arquivo).push(it.component);
}

let ok = 0;
const falhas = [];
const compartilhadas = [];

for (const it of MAPA.itens) {
  const entrada = path.join(ORIGEM, it.arquivo);
  const saida = path.join(DESTINO, caminhoDe(it));
  if (!fs.existsSync(entrada)) {
    falhas.push(`${it.arquivo} (${it.component}): arquivo de origem não existe`);
    continue;
  }
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  try {
    const { size } = await sharp(entrada)
      .resize(LARGURA, ALTURA, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82, effort: 5 })
      .toFile(saida);
    const irmaos = porArquivo.get(it.arquivo).filter(c => c !== it.component);
    if (irmaos.length) compartilhadas.push(`${it.component} ↔ ${irmaos.join(', ')}`);
    ok++;
    console.log(
      `✅ ${it.component.padEnd(22)} ${caminhoDe(it).padEnd(46)} ${String(Math.round(size / 1024)).padStart(4)} KB` +
        (irmaos.length ? `  ⚠️ arte dividida com ${irmaos.join(', ')}` : '')
    );
  } catch (e) {
    falhas.push(`${it.arquivo} (${it.component}): ${e.message}`);
  }
}

console.log(`\n  ${ok}/${MAPA.itens.length} thumbs de design geradas`);
if (compartilhadas.length) {
  console.log(
    `\n  ${compartilhadas.length} usam arte dividida (o designer está refazendo essas):`
  );
  for (const c of new Set(compartilhadas)) console.log(`    · ${c}`);
}
if (MAPA.orfaos?.length) {
  console.log(`\n  ${MAPA.orfaos.length} mockups SEM componente no catálogo (não entram):`);
  for (const o of MAPA.orfaos)
    console.log(`    · ${o.arquivo.padEnd(18)} ${o.mostra} → precisaria de ${o.precisaria}`);
}
if (falhas.length) {
  console.error(`\n✗ ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`    ${f}`);
  process.exit(1);
}
