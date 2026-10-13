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
  { nome: 'organisms/BannerMain08', raiz: 'bannerMain08', envelope: true, container: 'bm', prefixo: 'bm08', catalogo: `${T8}/BannerMain/index.module.css`, wake: [`${W8}/banner-main/home.scss`] },
  { nome: 'organisms/Countdown08', raiz: 'countdown08', envelope: true, container: 'cd', prefixo: 'cd08', catalogo: `${T8}/Countdown/index.module.css`, wake: [`${W8}/countdown/home.scss`] },
  { nome: 'molecules/Categories08', raiz: 'categories08', envelope: true, container: 'ct', prefixo: 'ct08', catalogo: `${T8}/Categories/index.module.css`, wake: [`${W8}/categories/home.scss`] },
  // O núcleo das duas vitrines (ProductShelfCustom08 e ProductShelfBanner08): a
  // mesma folha nas duas réplicas e nas duas pastas Wake.
  { nome: 'molecules/ProductShelf08', raiz: 'productShelf08', envelope: true, container: 'sh', prefixo: 'sh08', catalogo: [`${T8}/Showcase/index.module.css`, `${T8}/ShelfBanner/index.module.css`], wake: [`${W8}/showcase/home.scss`, `${W8}/banner-side/home.scss`] },
  { nome: 'organisms/Editorial08', raiz: 'editorial08', envelope: true, container: 'ed', prefixo: 'ed08', catalogo: `${T8}/Editorial/index.module.css`, wake: [`${W8}/editorial/home.scss`] },
  { nome: 'molecules/BenefitsStrip08', raiz: 'benefitsStrip08', envelope: true, container: 'bs', prefixo: 'bs08', catalogo: `${T8}/Ruler/index.module.css`, wake: [`${W8}/ruler/home.scss`] },
  { nome: 'organisms/Newsletter08', raiz: 'newsletter08', envelope: true, container: 'nl', prefixo: 'nl08', catalogo: `${T8}/Newsletter/index.module.css`, wake: [`${W8}/newsletter/home.scss`] },
  {
    nome: 'organisms/Header08',
    raiz: 'header08',
    container: 'hd',
    prefixo: 'hd08',
    catalogo: 'src/components/templates/common/template_8/Header/index.module.css',
    wake: [`${WAKE}/Common/template_8/header/common.scss`],
  },
  {
    nome: 'organisms/Footer08',
    raiz: 'footer08',
    container: 'ft',
    prefixo: 'ft08',
    catalogo: 'src/components/templates/common/template_8/Footer/index.module.css',
    wake: [`${WAKE}/Common/template_8/footer/common.scss`],
  },
];

// O sass troca 'Open Sans' por "Open Sans"; o `default` do variablesSchema (e o
// FontSelector) lê a família entre aspas simples, e o estágio 1v compara byte a byte.
const aspas = c => c.replace(/"([A-Z][A-Za-z ]+)", sans-serif/g, "'$1', sans-serif");

function partes(arquivo, raiz) {
  const t = fs.readFileSync(arquivo, 'utf8');
  const i = t.indexOf(raiz);
  const j = t.indexOf('/* ── Só ');
  if (i < 0 || j < 0) throw new Error(`${arquivo}: falta a raiz "${raiz}" ou o trecho "/* ── Só …"`);
  return { cab: t.slice(0, i), extra: t.slice(j) };
}

for (const p of PECAS) {
  const base = aspas(
    sass.compile(`${STARTER}/${p.nome}/style.module.scss`, { style: 'expanded' }).css.replace(/^@charset "UTF-8";\n/, '')
  );

  let css = base.replace(/@media \(max-width: 960px\)/g, `@container ${p.container} (max-width: 960px)`);
  if (/@media/.test(css)) throw new Error(`${p.nome}: sobrou @media no CSS da réplica`);
  // Uma @container não estiliza o próprio container: se a raiz tem regra mobile
  // (o padding do Footer08), o container vai para um envelope em volta dela —
  // `.<raiz>Box`, que a réplica precisa renderizar.
  const raizNoMobile = new RegExp(`@container ${p.container} \\(max-width: 960px\\) \\{[^@]*?^  \\.${p.raiz} \\{`, 'm').test(css);
  // As seções 08 de miolo têm a raiz e o bloco no MESMO elemento (`.bannerMain08.hero`):
  // toda regra mobile do bloco cairia no container. Vão sempre de envelope.
  if (raizNoMobile || p.envelope) css += `\n.${p.raiz}Box {\n  container: ${p.container} / inline-size;\n}\n`;
  else css = css.replace(new RegExp(`^\\.${p.raiz} \\{\\n`, 'm'), `.${p.raiz} {\n  container: ${p.container} / inline-size;\n`);
  for (const destino of [p.catalogo].flat()) {
    const { cab, extra } = partes(destino, `.${p.raiz} {`);
    fs.writeFileSync(destino, cab + css + '\n' + extra);
    console.log(`réplica: ${destino}`);
  }

  const root = postcss.parse(base);
  root.walkRules(r => {
    r.selector = r.selector.replace(/\.([a-zA-Z][\w]*)/g, (m, c) => (c === p.raiz ? `.${p.prefixo}` : `.${p.prefixo}-${c}`));
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
