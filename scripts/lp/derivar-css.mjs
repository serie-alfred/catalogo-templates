/**
 * Regera o CSS das duas cópias da LP BlackFriday01 a partir do SCSS do starter,
 * que é a fonte da verdade:
 *
 *   ../faststore.starter/src/components/organisms/BlackFriday01/style.module.scss
 *     → src/components/templates/landing/template_1/BlackFriday/index.module.css
 *       (`@media (max-width: 960px)` → `@container bf (…)`, raiz com `container: bf`)
 *     → ../global-templates/Wake/Landing/template_1/landing-page/landing.scss
 *       (classes prefixadas `bf01-`, a raiz vira `.bf01`)
 *
 * O cabeçalho de cada arquivo e o trecho final próprio dele ("Só no catálogo",
 * "Só na Wake") são preservados. Sem o global-templates ao lado, regera só o catálogo.
 *
 *   yarn lp:css
 */
import fs from 'node:fs';
import * as sass from 'sass';
import postcss from 'postcss';

const SRC = '../faststore.starter/src/components/organisms/BlackFriday01/style.module.scss';
const CAT = 'src/components/templates/landing/template_1/BlackFriday/index.module.css';
const WAKE = '../global-templates/Wake/Landing/template_1/landing-page/landing.scss';

// O sass troca 'Open Sans' por "Open Sans"; o `default` do variablesSchema (e o
// FontSelector) lê a família entre aspas simples, e o estágio 1v compara byte a byte.
const aspas = c =>
  c
    .replace(/"Open Sans", sans-serif/g, "'Open Sans', sans-serif")
    .replace(/"Inter", sans-serif/g, "'Inter', sans-serif");

const base = aspas(sass.compile(SRC, { style: 'expanded' }).css.replace(/^@charset "UTF-8";\n/, ''));

function partes(arquivo, raiz) {
  const t = fs.readFileSync(arquivo, 'utf8');
  return { cab: t.slice(0, t.indexOf(raiz)), extra: t.slice(t.indexOf('/* ── Só ')) };
}

{
  const { cab, extra } = partes(CAT, '.blackFriday01 {');
  let css = base.replace(/@media \(max-width: 960px\)/g, '@container bf (max-width: 960px)');
  if (/@media/.test(css)) throw new Error('sobrou @media no CSS da réplica');
  css = css.replace(/^\.blackFriday01 \{\n/m, '.blackFriday01 {\n  container: bf / inline-size;\n');
  fs.writeFileSync(CAT, cab + css + '\n' + extra);
  console.log(`réplica: ${CAT}`);
}

if (fs.existsSync(WAKE)) {
  const { cab, extra } = partes(WAKE, '.bf01 {');
  const root = postcss.parse(base);
  root.walkRules(r => {
    r.selector = r.selector.replace(/\.([a-zA-Z][\w]*)/g, (m, c) => (c === 'blackFriday01' ? '.bf01' : `.bf01-${c}`));
  });
  fs.writeFileSync(WAKE, cab + root.toString() + '\n' + extra);
  console.log(`wake: ${WAKE}`);
} else {
  console.log('sem ../global-templates ao lado: só a réplica foi regerada');
}
