/**
 * Converte os mockups do designer nas thumbs que o card do /gerador mostra.
 *
 * Entrada:  as artes de "Banners E-temas" — JPG 1920x1035 nas pastas V1-V3, PNG ~16:9
 *           no Lote2 —, uma por componente.
 * Saída:    public/images/gerador/<layoutKey>/<Component>.webp a 744x401.
 *
 * O mapa imagem->componente é DADO, não código: mora em `mapa.json`, foi apurado
 * visualmente e conferido contra os renders reais de `.funil/`. Mexer no pareamento
 * é mexer no JSON.
 *
 * Por que WebP e por que 744x401: o repo não tem Git LFS e `public/images` não está
 * no .gitignore, então todo byte commitado fica permanente no pack — a remoção
 * anterior de `public/images/gerador/` deixou 8,3 MB órfãos lá até hoje. Os originais
 * crus custariam ~80 MB para sempre; assim as 56 custam ~1,3 MB. 744x401 é 2x o slot do
 * card (334.667x180.333, ratio 1.856) — que é exatamente o ratio dos mockups.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { DESTINO, LARGURA, ALTURA, caminhoDe, lerMapa } from './lib.mjs';

const MAPA = lerMapa();
const ORIGEM = process.env.THUMBS_ORIGEM ?? MAPA.origem;

// Sair com 0, não com 1. Os mockups são deliberadamente não versionados (~80 MB),
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

// O mockup padrão tem o ratio do slot, então `cover` só apara a borda. Arte que chega
// fora dele declara `"enquadramento": "contain"` no mapa e vai inteira sobre branco:
// numa faixa 3:1 o `cover` manteria o miolo e cortaria as pontas — que é onde ficam o
// título e a contagem do CategoryTitle06. Explícito por item, e não pela proporção
// como no auto.mjs, porque 3:1 ainda passa no limiar de 60% de lá e seria cortada.
const enquadramentoDe = it =>
  it.enquadramento === 'contain'
    ? { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }
    : { fit: 'cover', position: 'centre' };

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
      .resize(LARGURA, ALTURA, enquadramentoDe(it))
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
