/**
 * Regera o CSS das cópias das peças do "Templates - Serie A" a partir do SCSS do
 * starter, que é a fonte da verdade:
 *
 *   ../faststore.starter/src/components/organisms/<Nome>/style.module.scss
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

const STARTER = '../faststore.starter/src/components/organisms';
const WAKE = '../global-templates/Wake';
const PECAS = [
  {
    nome: 'BlackFriday01',
    raiz: 'blackFriday01',
    container: 'bf',
    prefixo: 'bf01',
    catalogo: 'src/components/templates/landing/template_1/BlackFriday/index.module.css',
    wake: `${WAKE}/Landing/template_1/landing-page/landing.scss`,
  },
  {
    nome: 'Header08',
    raiz: 'header08',
    container: 'hd',
    prefixo: 'hd08',
    catalogo: 'src/components/templates/common/template_8/Header/index.module.css',
    wake: `${WAKE}/Common/template_8/header/common.scss`,
  },
  {
    nome: 'Footer08',
    raiz: 'footer08',
    container: 'ft',
    prefixo: 'ft08',
    catalogo: 'src/components/templates/common/template_8/Footer/index.module.css',
    wake: `${WAKE}/Common/template_8/footer/common.scss`,
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

  const { cab, extra } = partes(p.catalogo, `.${p.raiz} {`);
  let css = base.replace(/@media \(max-width: 960px\)/g, `@container ${p.container} (max-width: 960px)`);
  if (/@media/.test(css)) throw new Error(`${p.nome}: sobrou @media no CSS da réplica`);
  // Uma @container não estiliza o próprio container: se a raiz tem regra mobile
  // (o padding do Footer08), o container vai para um envelope em volta dela —
  // `.<raiz>Box`, que a réplica precisa renderizar.
  const raizNoMobile = new RegExp(`@container ${p.container} \\(max-width: 960px\\) \\{[^@]*?^  \\.${p.raiz} \\{`, 'm').test(css);
  if (raizNoMobile) css += `\n.${p.raiz}Box {\n  container: ${p.container} / inline-size;\n}\n`;
  else css = css.replace(new RegExp(`^\\.${p.raiz} \\{\\n`, 'm'), `.${p.raiz} {\n  container: ${p.container} / inline-size;\n`);
  fs.writeFileSync(p.catalogo, cab + css + '\n' + extra);
  console.log(`réplica: ${p.catalogo}`);

  if (!fs.existsSync(p.wake)) {
    console.log(`  (sem ${p.wake}: a versão Wake não foi regerada)`);
    continue;
  }
  const w = partes(p.wake, `.${p.prefixo} {`);
  const root = postcss.parse(base);
  root.walkRules(r => {
    r.selector = r.selector.replace(/\.([a-zA-Z][\w]*)/g, (m, c) => (c === p.raiz ? `.${p.prefixo}` : `.${p.prefixo}-${c}`));
  });
  fs.writeFileSync(p.wake, w.cab + root.toString() + '\n' + w.extra);
  console.log(`wake:    ${p.wake}`);
}
