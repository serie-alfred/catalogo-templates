/**
 * Regera o CSS das cópias das peças do "Templates - Serie A" a partir do SCSS do
 * starter, que é a fonte da verdade:
 *
 *   ../faststore.starter/src/components/<organisms|molecules>/<Nome>/style.module.scss
 *     → réplica do catálogo (`@media (max-width: 960px)` → `@container <nome> (…)`,
 *       a raiz ganha `container: <nome> / inline-size`)
 *     → versão Wake no ../global-templates (classes prefixadas, raiz `.<prefixo>`)
 *
 * O cabeçalho de cada arquivo e o trecho final próprio dele ("Só no catálogo",
 * "Só na Wake") são preservados. Sem o global-templates ao lado, regera só o catálogo.
 *
 *   yarn derivar:css
 */
import fs from 'node:fs';
import * as sass from 'sass';
import postcss from 'postcss';

const STARTER = '../faststore.starter/src/components';
const WAKE = '../global-templates/Wake';
const T8 = 'src/components/templates/home/template_8';
const W8 = `${WAKE}/Home/template_8`;
const PECAS = [
  // Seções de miolo da família 08 (o antigo BlackFriday01, dividido): valem na
  // home e no modo LP. Na Wake cada uma é uma pasta de Home/template_8.
  {
    nome: 'organisms/BannerMain08',
    raiz: 'bannerMain08',
    envelope: true,
    container: 'bm',
    prefixo: 'bm08',
    catalogo: `${T8}/BannerMain/index.module.css`,
    wake: [`${W8}/banner-main/home.scss`],
  },
  {
    nome: 'organisms/Countdown08',
    raiz: 'countdown08',
    envelope: true,
    container: 'cd',
    prefixo: 'cd08',
    catalogo: `${T8}/Countdown/index.module.css`,
    wake: [`${W8}/countdown/home.scss`],
  },
  {
    nome: 'molecules/Categories08',
    raiz: 'categories08',
    envelope: true,
    container: 'ct',
    prefixo: 'ct08',
    catalogo: `${T8}/Categories/index.module.css`,
    wake: [`${W8}/categories/home.scss`],
  },
  // O núcleo das duas vitrines (ProductShelfCustom08 e ProductShelfBanner08): a
  // mesma folha nas duas réplicas e nas duas pastas Wake.
  {
    nome: 'molecules/ProductShelf08',
    raiz: 'productShelf08',
    envelope: true,
    container: 'sh',
    prefixo: 'sh08',
    catalogo: [
      `${T8}/Showcase/index.module.css`,
      `${T8}/ShelfBanner/index.module.css`,
    ],
    wake: [`${W8}/showcase/home.scss`, `${W8}/banner-side/home.scss`],
  },
  {
    nome: 'organisms/Editorial08',
    raiz: 'editorial08',
    envelope: true,
    container: 'ed',
    prefixo: 'ed08',
    catalogo: `${T8}/Editorial/index.module.css`,
    wake: [`${W8}/editorial/home.scss`],
  },
  {
    nome: 'molecules/BenefitsStrip08',
    raiz: 'benefitsStrip08',
    envelope: true,
    container: 'bs',
    prefixo: 'bs08',
    catalogo: `${T8}/Ruler/index.module.css`,
    wake: [`${W8}/ruler/home.scss`],
  },
  {
    nome: 'organisms/Newsletter08',
    raiz: 'newsletter08',
    envelope: true,
    container: 'nl',
    prefixo: 'nl08',
    catalogo: `${T8}/Newsletter/index.module.css`,
    wake: [`${W8}/newsletter/home.scss`],
  },
  {
    nome: 'organisms/Header08',
    raiz: 'header08',
    container: 'hd',
    prefixo: 'hd08',
    catalogo:
      'src/components/templates/common/template_8/Header/index.module.css',
    wake: [`${WAKE}/Common/template_8/header/common.scss`],
  },
  {
    nome: 'organisms/Footer08',
    raiz: 'footer08',
    container: 'ft',
    prefixo: 'ft08',
    catalogo:
      'src/components/templates/common/template_8/Footer/index.module.css',
    wake: [`${WAKE}/Common/template_8/footer/common.scss`],
  },
];

// O sass troca 'Open Sans' por "Open Sans"; o `default` do variablesSchema (e o
// FontSelector) lê a família entre aspas simples, e o estágio 1v compara byte a byte.
const aspas = c =>
  c.replace(/"([A-Z][A-Za-z ]+)", sans-serif/g, "'$1', sans-serif");

// Classe do módulo → `.<prefixo>-<classe>` (a raiz vira `.<prefixo>`). O que o SCSS do
// starter marca com `:global(...)` é classe de biblioteca (`.swiper-pagination`,
// `.swiper-slide-active`), que existe com esse nome no tema da Tray/Wake: sai do
// `:global()` sem prefixo — prefixá-la deixaria a regra sem casar nada.
function prefixar(seletor, raiz, prefixo) {
  const globais = [];
  return seletor
    .replace(
      /:global\(([^)]*)\)/g,
      (m, dentro) => `\u0000${globais.push(dentro) - 1}\u0000`
    )
    .replace(/\.([a-zA-Z][\w]*)/g, (m, c) =>
      c === raiz ? `.${prefixo}` : `.${prefixo}-${c}`
    )
    .replace(/\u0000(\d+)\u0000/g, (m, i) => globais[i]);
}

function partes(arquivo, raiz) {
  const t = fs.readFileSync(arquivo, 'utf8');
  const i = t.indexOf(raiz);
  const j = t.indexOf('/* ── Só ');
  if (i < 0 || j < 0)
    throw new Error(
      `${arquivo}: falta a raiz "${raiz}" ou o trecho "/* ── Só …"`
    );
  return { cab: t.slice(0, i), extra: t.slice(j) };
}

for (const p of PECAS) {
  const base = aspas(
    sass
      .compile(`${STARTER}/${p.nome}/style.module.scss`, { style: 'expanded' })
      .css.replace(/^@charset "UTF-8";\n/, '')
  );

  let css = base.replace(
    /@media \(max-width: 960px\)/g,
    `@container ${p.container} (max-width: 960px)`
  );
  if (/@media/.test(css))
    throw new Error(`${p.nome}: sobrou @media no CSS da réplica`);
  // Uma @container não estiliza o próprio container: se a raiz tem regra mobile
  // (o padding do Footer08), o container vai para um envelope em volta dela —
  // `.<raiz>Box`, que a réplica precisa renderizar.
  const raizNoMobile = new RegExp(
    `@container ${p.container} \\(max-width: 960px\\) \\{[^@]*?^  \\.${p.raiz} \\{`,
    'm'
  ).test(css);
  // As seções 08 de miolo têm a raiz e o bloco no MESMO elemento (`.bannerMain08.hero`):
  // toda regra mobile do bloco cairia no container. Vão sempre de envelope.
  if (raizNoMobile || p.envelope)
    css += `\n.${p.raiz}Box {\n  container: ${p.container} / inline-size;\n}\n`;
  else
    css = css.replace(
      new RegExp(`^\\.${p.raiz} \\{\\n`, 'm'),
      `.${p.raiz} {\n  container: ${p.container} / inline-size;\n`
    );
  for (const destino of [p.catalogo].flat()) {
    const { cab, extra } = partes(destino, `.${p.raiz} {`);
    fs.writeFileSync(destino, cab + css + '\n' + extra);
    console.log(`réplica: ${destino}`);
  }

  const root = postcss.parse(base);
  root.walkRules(r => {
    r.selector = prefixar(r.selector, p.raiz, p.prefixo);
  });
  for (const destino of p.wake) {
    if (!fs.existsSync(destino)) {
      console.log(`  (sem ${destino}: a versão Wake não foi regerada)`);
      continue;
    }
    const w = partes(destino, `.${p.prefixo} {`);
    fs.writeFileSync(destino, w.cab + root.toString() + '\n' + w.extra);
    console.log(`wake:    ${destino}`);
  }
}

/**
 * Portes declarados no global-templates: toda pasta de componente Tray/Wake que
 * nasceu de um componente do starter traz um `derivar.json`
 *
 *   { "starter": "organisms/Header04", "raiz": "header04", "prefixo": "hd04",
 *     "destinos": ["common.scss"] }
 *
 * (destinos relativos à própria pasta). Cada destino recebe o SCSS do starter
 * compilado com as classes prefixadas — a raiz vira `.<prefixo>`, o resto
 * `.<prefixo>-<classe>` — entre o cabeçalho do arquivo e o trecho "Só na
 * Tray"/"Só na Wake", que são preservados. É como a família 08 já era derivada,
 * sem precisar de uma linha em PECAS por porte.
 */
/**
 * A parte gerada de um porte começa num marcador fixo e vai até o trecho "Só na
 * …". Ancorar no marcador (e não na primeira regra da raiz) é o que deixa a
 * derivação idempotente: o CSS compilado pode começar por outra regra que não a
 * raiz, ou por um seletor em lista (`.sp07, .sp07-mCard {`), e uma âncora na raiz
 * deixaria o começo da parte gerada no cabeçalho — duplicado a cada rodada.
 * Primeira rodada (arquivo ainda sem marcador): ancora na raiz vazia `.<prefixo> {`.
 */
const GERADO =
  '/* ── gerado por yarn derivar:css (catalogo-templates) — não edite até o trecho "Só na" ── */';

function partesDoPorte(arquivo, prefixo) {
  const t = fs.readFileSync(arquivo, 'utf8');
  const j = t.indexOf('/* ── Só ');
  let i = t.indexOf(GERADO);
  if (i < 0) {
    // Sem marcador: a 1ª regra do prefixo COM conteúdo (as vazias do cabeçalho —
    // a raiz-placeholder e as que recebem as variáveis do /gerador — ficam).
    const re = new RegExp(`^\\.${prefixo}[\\w-]*[^{}]*\\{([^}]*)\\}`, 'gm');
    let m;
    while ((m = re.exec(t)) && m.index < j) {
      if (m[1].trim()) {
        i = m.index;
        break;
      }
    }
    // Arquivo só com a raiz vazia (porte novo): entra depois do cabeçalho.
    if (i < 0) {
      const v = new RegExp(`^\\.${prefixo} \\{\\s*\\}`, 'm').exec(t);
      i = v ? v.index + v[0].length + 1 : -1;
    }
  }
  if (i < 0 || j < 0 || i > j)
    throw new Error(
      `${arquivo}: falta o marcador/raiz ".${prefixo} {" antes do trecho "/* ── Só …"`
    );
  return { cab: t.slice(0, i), extra: t.slice(j) };
}

function acharDerivar(dir, achados = []) {
  if (!fs.existsSync(dir)) return achados;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) acharDerivar(p, achados);
    else if (e.name === 'derivar.json') achados.push(p);
  }
  return achados;
}

let pulados = 0;
for (const arq of [
  ...acharDerivar(WAKE),
  ...acharDerivar('../global-templates/Tray'),
]) {
  const pasta = arq.slice(0, arq.lastIndexOf('/'));
  const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
  // Peça feita de mais de um componente do starter (vitrine + card, PDP = galeria +
  // info): `"partes": [{ starter, raiz, prefixo }, …]`, compiladas na ordem e
  // concatenadas em cada destino. A âncora do destino é a raiz da PRIMEIRA parte.
  // `scss` (opcional): folha fora da pasta do componente, relativa a src/ do starter
  // — os overrides de seção nativa (ex.: Breadcrumb09) a mantêm em src/sass/.
  const pecas = d.partes ?? [
    { starter: d.starter, raiz: d.raiz, prefixo: d.prefixo, scss: d.scss },
  ];
  let css;
  try {
    css = pecas
      .map(pc => {
        const base = aspas(
          sass
            .compile(pc.scss ? `${STARTER}/../${pc.scss}` : `${STARTER}/${pc.starter}/style.module.scss`, {
              style: 'expanded',
            })
            .css.replace(/^@charset "UTF-8";\n/, '')
        );
        const root = postcss.parse(base);
        // Comentário do SCSS de origem não vai para a cópia: o sass 'expanded' os
        // mantém, e eles citam cliente/origem (o global-templates é outro repo).
        root.walkComments(c => c.remove());
        root.walkRules(r => {
          r.selector = prefixar(r.selector, pc.raiz, pc.prefixo);
        });
        return root.toString().trim();
      })
      .join('\n\n');
  } catch (e) {
    console.log(`  ⚠️ ${arq}: ${e.message.split('\n')[0]} — pulado`);
    pulados++;
    continue;
  }
  for (const destino of d.destinos) {
    const alvo = `${pasta}/${destino}`;
    // Um porte incompleto (destino ainda não criado, sem âncora) não derruba os
    // outros: avisa e segue. O exit code no fim diz se algum ficou de fora.
    if (!fs.existsSync(alvo)) {
      console.log(`  ⚠️ porte sem o destino ${alvo} — pulado`);
      pulados++;
      continue;
    }
    try {
      const w = partesDoPorte(alvo, pecas[0].prefixo);
      fs.writeFileSync(alvo, w.cab + GERADO + '\n' + css + '\n' + w.extra);
      console.log(`porte:   ${alvo}`);
    } catch (e) {
      console.log(`  ⚠️ ${e.message} — pulado`);
      pulados++;
    }
  }
}
if (pulados) {
  console.log(`\n${pulados} destino(s) de porte pulado(s).`);
  process.exitCode = 1;
}
