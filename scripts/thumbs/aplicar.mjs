/**
 * Escreve `image`, `imageSource` e `imageSharedWith` nos 90 itens de layoutData.ts,
 * a partir do que existe EM DISCO em public/images/gerador/.
 *
 * O disco é a fonte da verdade, não o inverso: um arquivo apagado devolve o item ao
 * placeholder na próxima rodada, sem precisar editar TypeScript à mão.
 *
 * É idempotente — apaga os três campos antes de reescrevê-los —, então rodar duas
 * vezes seguidas produz exatamente o mesmo arquivo. Isso é o que torna
 * `yarn thumbs` seguro de repetir.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DESTINO, RAIZ, caminhoDe, lerMapa } from './lib.mjs';
import { lerLayouts } from '../funil/lib/util.mjs';

const LAYOUT_DATA = path.join(RAIZ, 'src/data/layoutData.ts');
const MAPA = lerMapa();
const DO_DESIGNER = new Set(MAPA.itens.map(i => i.component));

// component -> { layoutKey, arquivo }, varrendo o que realmente existe.
const emDisco = new Map();
if (fs.existsSync(DESTINO))
  for (const layoutKey of fs.readdirSync(DESTINO)) {
    const dir = path.join(DESTINO, layoutKey);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir))
      if (f.endsWith('.webp'))
        emDisco.set(f.replace(/\.webp$/, ''), { layoutKey, arquivo: `${layoutKey}/${f}` });
  }

// Quem divide arte com quem: dois itens apontando o mesmo mockup em mapa.json.
const irmaosDe = new Map();
const porArquivoFonte = new Map();
for (const it of MAPA.itens) {
  if (!porArquivoFonte.has(it.arquivo)) porArquivoFonte.set(it.arquivo, []);
  porArquivoFonte.get(it.arquivo).push(it.component);
}
for (const comps of porArquivoFonte.values())
  if (comps.length > 1)
    for (const c of comps) irmaosDe.set(c, comps.filter(o => o !== c));

const original = fs.readFileSync(LAYOUT_DATA, 'utf8');
let design = 0,
  auto = 0,
  vazios = 0;
const semArquivo = [];

const atualizado = original
  .split('\n')
  .map(linha => {
    const m = linha.match(/\bcomponent:\s*"([A-Za-z0-9]+)"/);
    // A declaração do tipo também casa `image:`; só linhas de item têm `component:`.
    if (!m || !/\bimage:\s*"/.test(linha)) return linha;
    const comp = m[1];

    // Lido da linha ORIGINAL, antes de zerar. É o que faz `design` GRUDAR: sem isto
    // o cadeado era um só, com uma rodada de atraso — tirar um componente de
    // mapa.json rebaixava o item para "auto" com o .webp do designer intacto em
    // disco, e a rodada seguinte de auto.mjs sobrescrevia a arte com um screenshot.
    // Para rebaixar de verdade, apague o .webp: sem arquivo o item volta ao placeholder.
    const eraDesign = /\bimageSource:\s*"design"/.test(linha);

    // Zera antes de escrever — é o que garante idempotência.
    let l = linha
      .replace(/\s*imageSource:\s*"[^"]*",/g, '')
      .replace(/\s*imageSharedWith:\s*\[[^\]]*\],/g, '')
      .replace(/\bimage:\s*"[^"]*",/, 'image: "",');

    const arq = emDisco.get(comp);
    if (!arq) {
      vazios++;
      semArquivo.push(comp);
      return l;
    }
    const fonte = DO_DESIGNER.has(comp) || eraDesign ? 'design' : 'auto';
    fonte === 'design' ? design++ : auto++;
    const irmaos = irmaosDe.get(comp);
    const extra =
      `imageSource: "${fonte}",` +
      (irmaos ? ` imageSharedWith: [${irmaos.map(c => `"${c}"`).join(', ')}],` : '');
    return l.replace(/\bimage:\s*"",/, `image: "${arq.arquivo}", ${extra}`);
  })
  .join('\n');

if (atualizado !== original) fs.writeFileSync(LAYOUT_DATA, atualizado);

const total = design + auto + vazios;
console.log(`  ${total} itens no catálogo`);
console.log(`    design  ${String(design).padStart(3)}  ← arte do designer`);
console.log(`    auto    ${String(auto).padStart(3)}  ← screenshot gerado (PENDENTE de design)`);
console.log(`    (nenhum)${String(vazios).padStart(3)}  ← sem imagem, cai no placeholder`);
if (semArquivo.length)
  console.log(`\n  sem arquivo: ${semArquivo.join(', ')}`);
console.log(
  atualizado === original ? '\n  layoutData.ts já estava em dia' : '\n  layoutData.ts atualizado'
);

// O relatório é GERADO, não escrito à mão: a lista de pendências do designer perde
// o valor no dia em que diverge do catálogo.
const DOC = path.join(RAIZ, 'docs/THUMBS-DOS-COMPONENTES.md');
const L = lerLayouts();
const itens = Object.entries(L).flatMap(([layoutKey, sec]) =>
  sec.items.map(i => ({ ...i, layoutKey, secao: sec.name }))
);
const porArquivoMockup = new Map();
for (const it of MAPA.itens) porArquivoMockup.set(it.component, it);

const linhaDe = i => {
  const m = porArquivoMockup.get(i.component);
  const div = i.imageSharedWith ? ` ⚠️ divide com ${i.imageSharedWith.join(', ')}` : '';
  return `| \`${i.component}\` | ${i.secao} \`${i.layoutKey}/${i.id}\` | ${m ? '`' + m.arquivo + '`' : '—'} | ${m ? m.nota + div : 'screenshot do componente real'} |`;
};

const doc = [
  '# Thumbs dos componentes do /gerador',
  '',
  '> **Gerado por `yarn thumbs` (scripts/thumbs/aplicar.mjs). Não edite à mão.**',
  '',
  'Cada card do modal "Componentes de seções" mostra uma imagem de',
  '`public/images/gerador/<layoutKey>/<Component>.webp`, apontada pelo campo `image` do item',
  'em `src/data/layoutData.ts`. O campo `imageSource` diz de onde ela veio.',
  '',
  '| | itens | o que é |',
  '|---|---|---|',
  `| \`design\` | ${design} | mockup entregue pelo designer (pasta *Banners E-temas*) |`,
  `| \`auto\` | ${auto} | screenshot do componente real — **pendente de arte do designer** |`,
  `| sem imagem | ${vazios} | cai no placeholder |`,
  '',
  '## Pendente do designer',
  '',
  'Estes têm thumb automática. É a lista do que falta chegar do design:',
  '',
  ...(() => {
    const porSecao = new Map();
    for (const i of itens.filter(x => x.imageSource === 'auto')) {
      if (!porSecao.has(i.secao)) porSecao.set(i.secao, []);
      porSecao.get(i.secao).push(i.component);
    }
    return [...porSecao].map(([sec, cs]) => `- **${sec}** — ${cs.join(', ')}`);
  })(),
  '',
  '## Arte do designer',
  '',
  '| componente | seção | mockup | nota |',
  '|---|---|---|---|',
  ...itens.filter(i => i.imageSource === 'design').map(linhaDe),
  '',
  '## Mockups que não entraram',
  '',
  '### Órfãos — mostram um componente que o catálogo não tem',
  '',
  'Não force o encaixe: a thumb prometeria um layout que o gerador não entrega.',
  'Cada linha é um candidato a componente novo.',
  '',
  '| mockup | mostra | precisaria de |',
  '|---|---|---|',
  ...MAPA.orfaos.map(o => `| \`${o.arquivo}\` | ${o.mostra} | ${o.precisaria} |`),
  '',
  '### Alternativas — o mesmo componente, num enquadramento pior',
  '',
  '| mockup | componente | por que não foi escolhido |',
  '|---|---|---|',
  ...MAPA.alternativas.map(a => `| \`${a.arquivo}\` | \`${a.component}\` | ${a.porque} |`),
  '',
  '## Como regerar',
  '',
  '```bash',
  'yarn thumbs           # design → auto → aplicar (o `auto` precisa de `yarn dev` de pé)',
  'yarn thumbs:aplicar   # só reescreve o layoutData a partir do que está em disco',
  '```',
  '',
  'Os mockups **não são versionados** (~40 MB de JPG). `scripts/thumbs/mapa.json` guarda o',
  'caminho da pasta em `origem`; `THUMBS_ORIGEM` sobrescreve.',
  '',
  '`auto.mjs` nunca sobrescreve um item `design` — dois cadeados: o componente estar em',
  '`mapa.json`, ou o item já estar marcado `imageSource: "design"`. É o que torna seguro',
  'rodar `yarn thumbs` de novo quando chegar a próxima leva de arte.',
  '',
  'Quando o designer entregar arte isolada para um caso de `imageSharedWith`, some com o',
  'campo: ele existe só para achar esses casos.',
  '',
].join('\n');
fs.mkdirSync(path.dirname(DOC), { recursive: true });
fs.writeFileSync(DOC, doc);
console.log(`  docs/THUMBS-DOS-COMPONENTES.md atualizado`);
