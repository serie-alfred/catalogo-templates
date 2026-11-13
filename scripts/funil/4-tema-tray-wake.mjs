/**
 * Estágio 4 — temas Tray, Wake e Wake 2.0 montados de verdade, sem a loja.
 *
 * O 5-contrato-tray-wake confere o contrato sem executar. Este roda o generator
 * irmão com `GENERATOR_LOCAL=1` (o `--local` dele: a Wake não chama a API, a
 * Tray não abre `tray watch`, o build do tema é pulado — nada sai daqui) e
 * confere o tema que ele escreveu em `tema-base/`:
 *
 *   - Tray, família 10; Wake, família 09; Wake 2.0, família 17
 *     (`wake.designStudio: true`). O config de cada um sai do CATÁLOGO, no
 *     formato do `buildConfigJson` — a família inteira, como o "Por template" a
 *     aplica —, não de um JSON escrito à mão;
 *   - o generator sai 0 e não loga erro (`❌`, `Error:`);
 *   - cada seção chegou ao tema: a classe-raiz de cada SCSS da pasta de origem
 *     está no CSS compilado do tema, e a primeira classe do HTML de origem está
 *     num arquivo que a geração mudou (páginas, componentes);
 *   - o SCSS do tema compila (o `sass` do catálogo, o mesmo do 1-variaveis), a
 *     partir de cada folha de entrada — a que nenhuma outra importa;
 *   - Wake 2.0: cada seção da home tem `Blocks/<type>.html|.schema.json`, o
 *     `content_for_page` da rota da home em `Configs/pages.json` lista os tipos na
 *     ordem, e o `<main>` de `Pages/home.html` tem o `wake_has_content_for_page`.
 *     Na Wake de hoje, o contrário: nada disso aparece.
 *
 * O tema-base da Wake vem do git.fbits.net, que pede credencial. Se o clone
 * falhar ali, a plataforma é PULADA com aviso — não é um verde, e o resumo diz
 * quais ficaram de fora.
 *
 * Recurso exclusivo: o generator irmão é UM só — `tema-base/` e `repo-temp/` são
 * reclonados a cada rodada (e outras sessões também os usam). O `config.json`
 * versionado dele não é tocado (o config vai por `GENERATOR_CONFIG`). Origens por
 * env, como nos outros estágios 4: `GLOBAL_COMPONENTS_REPO`/`_BRANCH` (registradas
 * no `funil.mjs` como variáveis que desviam), `TRAY_THEME_BASE_*`, `WAKE_THEME_BASE_*`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as sass from 'sass';
import {
  GENERATOR,
  GLOBAL_TEMPLATES,
  SAIDA,
  itens,
  relatorio,
  ler,
  git,
} from './lib/util.mjs';
import { TEMA_INICIAL, colorSafeOnWhite } from '../../src/utils/themeStyle.ts';

const r = relatorio('Estágio 4 — temas Tray, Wake e Wake 2.0 montados (sem a loja)');
const PASTA = path.join(SAIDA, 'tray-wake');
const TEMA = path.join(GENERATOR, 'tema-base');
const COMPONENTES = path.join(GENERATOR, 'repo-temp');
fs.rmSync(PASTA, { recursive: true, force: true });
fs.mkdirSync(PASTA, { recursive: true });

const semComentario = t =>
  t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/** Todo arquivo sob `raiz` que passa no filtro, sem `node_modules` nem `.git`. */
function listar(raiz, filtro) {
  const fora = new Set(['node_modules', '.git']);
  const achados = [];
  const andar = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (fora.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) andar(p);
      else if (filtro(p)) achados.push(p);
    }
  };
  if (fs.existsSync(raiz)) andar(raiz);
  return achados;
}

// ── o que montar ─────────────────────────────────────────────────────────────
const TODOS = itens();
const CASOS = [
  { plataforma: 'Tray', familia: '10' },
  { plataforma: 'Wake', familia: '9' },
  { plataforma: 'Wake 2.0', familia: '17' },
];
const PASTA_DA_PAGINA = {
  common: 'Common',
  home: 'Home',
  category: 'Category',
  product: 'Product',
};

// As 14 globais como uma aba nova as exporta (`variaveisTrayWake` no hook).
const GLOBAIS = {
  ...TEMA_INICIAL.fonts,
  ...TEMA_INICIAL.colors,
  colorPrimaryBackgroundSafe: colorSafeOnWhite(
    TEMA_INICIAL.colors.colorPrimaryBackground
  ),
};

/** O config da família, como o `buildConfigJson` o escreve depois do "Por template". */
function configDe({ plataforma, familia }, daFamilia) {
  const trilha = plataforma === 'Tray' ? 'tray' : 'wake';
  const raiz = {
    ...(plataforma === 'Wake 2.0' ? { designStudio: true } : {}),
    global: [],
    variables: GLOBAIS,
    assets: { logo: '', footerLogo: '', favicon: '', ogImage: '' },
  };
  for (const i of daFamilia) {
    const entrada = {
      template: i.template,
      selection: i.selection,
      title: i.title,
      key: i.key,
      pagina: i.pagina,
    };
    if (i.pagina.includes('common')) raiz.global.push(entrada);
    else for (const pg of i.pagina) (raiz[pg] ??= []).push(entrada);
  }
  return {
    platform: trilha,
    [trilha]: raiz,
    ...(trilha === 'wake' ? { wakeToken: '' } : {}),
    _familia: familia, // só rótulo; o generator ignora chave desconhecida
  };
}

// ── o generator ──────────────────────────────────────────────────────────────
function gerar(config, rotulo) {
  const arq = path.join(PASTA, `config-${rotulo}.json`);
  fs.writeFileSync(arq, JSON.stringify(config, null, 2));
  // `node src/index.js` com o MESMO node do funil. Sem `--push`: nada sai daqui.
  const res = spawnSync(process.execPath, ['src/index.js'], {
    cwd: GENERATOR,
    env: {
      ...process.env,
      GENERATOR_LOCAL: '1',
      GENERATOR_CONFIG: arq,
      // Repo que pede credencial vira falha na hora, não um processo parado.
      GIT_TERMINAL_PROMPT: '0',
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    timeout: 15 * 60 * 1000,
  });
  const log = `${res.stdout ?? ''}${res.stderr ?? ''}${res.error ? `\n${res.error.message}` : ''}`;
  fs.writeFileSync(path.join(PASTA, `${rotulo}.log`), log);
  const erros = log
    .split('\n')
    .filter(l => /❌|\bError:/.test(l) && !/No valid JSON script/.test(l));
  return {
    status: res.status,
    log,
    erros,
    arquivoLog: path.relative(SAIDA, path.join(PASTA, `${rotulo}.log`)),
  };
}

// ── o SCSS do tema ───────────────────────────────────────────────────────────
// Pacote (`~x`, `@x`) vira folha vazia: o node_modules do tema não é instalado
// no --local, e o que se prova aqui é o SCSS que a geração escreveu.
const pacoteVazio = {
  canonicalize: url =>
    /^[@~]/.test(url) ? new URL(`funil-pacote:${url}`) : null,
  load: () => ({ contents: '', syntax: 'scss' }),
};
function resolverScss(dir, url) {
  if (/^[~@]|^https?:|\.css$/.test(url)) return null;
  const base = path.resolve(dir, url);
  const d = path.dirname(base);
  const n = path.basename(base).replace(/\.scss$/, '');
  for (const c of [`${n}.scss`, `_${n}.scss`, `${n}/index.scss`, `${n}/_index.scss`]) {
    const p = path.join(d, c);
    if (fs.existsSync(p)) return p;
  }
  return null;
}
/**
 * As folhas de entrada: `.scss` que não é parcial e que nenhuma outra importa.
 * Com `webpack.mix.js` (Wake), só as que o build lista: o tema-base tem folha
 * órfã que nenhum build compila (o `sa-institucional.scss` importa um arquivo que
 * não existe) e reprovar por ela seria medir o tema-base, não a geração.
 */
function entradasScss(raiz) {
  const mix = ler(path.join(raiz, 'webpack.mix.js'));
  const doBuild = new Set([...mix.matchAll(/["']([\w.-]+\.scss)["']/g)].map(m => m[1]));
  const todos = listar(raiz, p => p.endsWith('.scss'));
  const importados = new Set();
  for (const f of todos)
    for (const m of semComentario(ler(f)).matchAll(/@(?:import|use|forward)\s+([^;]+);/g))
      for (const u of m[1].matchAll(/["']([^"']+)["']/g)) {
        const alvo = resolverScss(path.dirname(f), u[1]);
        if (alvo) importados.add(alvo);
      }
  return todos.filter(
    f =>
      !path.basename(f).startsWith('_') &&
      !importados.has(f) &&
      (!doBuild.size || doBuild.has(path.basename(f)))
  );
}
function compilarTema() {
  const entradas = entradasScss(TEMA);
  const falhas = [];
  let css = '';
  for (const f of entradas) {
    try {
      css += sass.compile(f, {
        importers: [pacoteVazio],
        loadPaths: [path.dirname(f)],
        logger: sass.Logger.silent,
      }).css;
    } catch (e) {
      falhas.push(
        `${path.relative(TEMA, f)}: ${String(e?.message ?? e).split('\n')[0]}`
      );
    }
  }
  return { entradas, falhas, css };
}

// ── as marcas de cada seção ──────────────────────────────────────────────────
/** A primeira classe de cada SCSS da pasta de origem (a raiz da seção). */
const raizesScss = dir =>
  listar(dir, p => p.endsWith('.scss'))
    .map(f => ({
      arquivo: path.basename(f),
      classe: semComentario(ler(f)).match(
        /(?:^|[\s,{}>+~(])\.([A-Za-z_][\w-]*)/m
      )?.[1],
    }))
    .filter(x => x.classe);
/** A primeira classe literal do HTML de origem (fora os de settings da Tray). */
const classeHtml = dir => {
  for (const f of listar(
    dir,
    p => p.endsWith('.html') && !/settings-/.test(path.basename(p))
  )) {
    for (const m of ler(f).matchAll(/class="([^"]*)"/g)) {
      const c = m[1].split(/\s+/).find(x => /^[A-Za-z_][\w-]*$/.test(x));
      if (c) return { arquivo: path.basename(f), classe: c };
    }
  }
  return null;
};

// ── as rodadas ───────────────────────────────────────────────────────────────
const pulados = [];
const commitsComponentes = new Set();
for (const caso of CASOS) {
  const { plataforma, familia } = caso;
  const nn = familia.padStart(2, '0');
  const rot = `${plataforma.replace(/\s+/g, '').toLowerCase()}-${nn}`;
  const daFamilia = TODOS.filter(
    i => i.template === familia && i.platforms.includes(plataforma)
  );
  if (
    !r.ok(
      `${plataforma} ${nn}: a família tem itens no catálogo (${daFamilia.length})`,
      daFamilia.length > 0
    )
  )
    continue;
  try {
    console.log(`  ⏳ ${plataforma} ${nn}: generator --local (clona tema-base e global-templates)`);
    const g = gerar(configDe(caso, daFamilia), rot);

    // O tema-base da Wake mora no git.fbits.net, com credencial: sem ela, pula.
    if (
      plataforma !== 'Tray' &&
      g.status !== 0 &&
      /Failed to sync repository https:\/\/git\.fbits\.net/.test(g.log)
    ) {
      pulados.push(plataforma);
      console.log(
        `  ⏭️  ${plataforma} ${nn}: PULADA — o clone do tema-base no git.fbits.net falhou (credencial?). ` +
          `Não é um verde: rode com acesso ao repo da Fbits. Log: ${g.arquivoLog}`
      );
      continue;
    }
    const montou = r.ok(
      `${plataforma} ${nn}: o generator monta (--local), exit 0`,
      g.status === 0,
      `exit ${g.status} — ${g.erros.slice(-2).join(' | ') || g.log.trim().split('\n').slice(-2).join(' ')} — ${g.arquivoLog}`
    );
    r.ok(
      `${plataforma} ${nn}: nenhuma linha de erro no log do generator`,
      g.erros.length === 0,
      `${g.erros.slice(0, 3).join(' | ')} — ${g.arquivoLog}`
    );
    if (!montou) continue;
    commitsComponentes.add(git(COMPONENTES, 'rev-parse', 'HEAD'));
    const temaCommit = git(TEMA, 'rev-parse', '--short', 'HEAD');
    const temaBranch = git(TEMA, 'rev-parse', '--abbrev-ref', 'HEAD');
    console.log(`  ℹ️  tema-base ${temaBranch} @ ${temaCommit}`);
    if (plataforma === 'Wake 2.0')
      r.ok(
        'Wake 2.0: o tema-base é a branch do Design Studio (baseStorefrontDs)',
        temaBranch === 'baseStorefrontDs' || !!process.env.WAKE_THEME_BASE_BRANCH,
        temaBranch
      );

    // ── o que a geração mudou ──────────────────────────────────────────────
    const mudados = git(TEMA, 'status', '--porcelain', '-uall')
      .split('\n')
      .filter(Boolean)
      .map(l => l.slice(3).replace(/^"|"$/g, ''))
      .filter(rel => fs.existsSync(path.join(TEMA, rel)));
    const textoMudado = mudados
      .filter(rel => /\.(html|scss|json|js)$/.test(rel))
      .map(rel => ler(path.join(TEMA, rel)))
      .join('\n');
    console.log(`  ℹ️  ${mudados.length} arquivo(s) escritos ou mudados pela geração`);

    // ── SCSS compila ──────────────────────────────────────────────────────
    const scss = compilarTema();
    r.ok(
      `${plataforma} ${nn}: o SCSS do tema compila (${scss.entradas.length} folha(s) de entrada)`,
      scss.entradas.length > 0 && scss.falhas.length === 0,
      scss.falhas.slice(0, 3).join(' | ') || 'nenhuma folha de entrada'
    );

    // ── cada seção chegou ─────────────────────────────────────────────────
    const plat = plataforma === 'Tray' ? 'Tray' : 'Wake';
    const semOrigem = [];
    const semCss = [];
    const semHtml = [];
    let nCss = 0;
    let nHtml = 0;
    for (const i of daFamilia) {
      const dir = path.join(
        COMPONENTES,
        plat,
        PASTA_DA_PAGINA[i.pagina[0]],
        `template_${i.template}`,
        i.selection
      );
      if (!fs.existsSync(dir)) {
        semOrigem.push(`${i.component} → ${path.relative(COMPONENTES, dir)}`);
        continue;
      }
      for (const { arquivo, classe } of raizesScss(dir))
        if (++nCss && !scss.css.includes(`.${classe}`))
          semCss.push(`${i.selection}/${arquivo} (.${classe})`);
      const h = classeHtml(dir);
      if (h) nHtml++;
      if (h && !textoMudado.includes(h.classe))
        semHtml.push(`${i.selection}/${h.arquivo} (${h.classe})`);
    }
    r.ok(
      `${plataforma} ${nn}: as ${daFamilia.length} seções têm pasta de origem no global-templates clonado`,
      semOrigem.length === 0,
      semOrigem.join(' | ')
    );
    r.ok(
      `${plataforma} ${nn}: a classe-raiz de cada SCSS de seção está no CSS compilado do tema (${nCss} folhas)`,
      nCss > 0 && semCss.length === 0,
      semCss.slice(0, 5).join(' | ')
    );
    r.ok(
      `${plataforma} ${nn}: o HTML de cada seção chegou a uma página ou componente escrito pela geração (${nHtml} seções)`,
      nHtml > 0 && semHtml.length === 0,
      semHtml.slice(0, 5).join(' | ')
    );

    // ── Design Studio ─────────────────────────────────────────────────────
    // Os globais (`LayoutItem.global`: ajuda flutuante, pop-up) moram no balde home mas não são
    // seção da home nem bloco: o Design Studio não tem bloco global. Vão para toda página.
    // `Components/globais.html` é da Wake (as duas): a Tray não tem esse arquivo.
    const daHome = daFamilia.filter(i => i.pagina.includes('home') && !i.global);
    const globais = daFamilia.filter(i => i.global);
    if (globais.length && plataforma !== 'Tray') {
      const arquivoGlobais = ler(path.join(TEMA, 'Components', 'globais.html'));
      const nConteudos = (arquivoGlobais.match(/class="api-content\b/g) ?? []).length;
      const chama = arq => /\{\{\s*globais\b/.test(ler(path.join(TEMA, 'Pages', arq)));
      r.ok(
        `${plataforma} ${nn}: os ${globais.length} componentes globais estão em Components/globais.html (um conteúdo cada) e home e produto chamam {{ globais }}`,
        nConteudos === globais.length && chama('home.html') && chama('product.html'),
        `api-content em globais.html: ${nConteudos}`
      );
    }
    const tipo = i =>
      `${i.selection.replace(/-/g, '_')}_${String(i.template).padStart(2, '0')}`;
    const blocos = path.join(TEMA, 'Blocks');
    const home = ler(path.join(TEMA, 'Pages', 'home.html'));
    const paginas = JSON.parse(ler(path.join(TEMA, 'Configs', 'pages.json')) || '[]');
    const rotaHome = paginas
      .find(p => p.type === 'hotsite')
      ?.customs?.find(c => c.urlMatch === '' && c.path === 'home.html');
    if (plataforma === 'Wake 2.0') {
      const semSchema = daHome
        .filter(i => !fs.existsSync(path.join(COMPONENTES, 'Wake', 'Home', `template_${i.template}`, i.selection, `${i.selection}.schema.json`)))
        .map(i => i.selection);
      r.ok(
        `Wake 2.0 ${nn}: as ${daHome.length} seções da home têm <selection>.schema.json na origem (layout publicado apaga seção sem bloco)`,
        daHome.length > 0 && semSchema.length === 0,
        semSchema.join(', ')
      );
      const semBloco = daHome
        .map(tipo)
        .filter(
          t =>
            !fs.existsSync(path.join(blocos, `${t}.html`)) ||
            !fs.existsSync(path.join(blocos, `${t}.schema.json`))
        );
      r.ok(
        `Wake 2.0 ${nn}: Blocks/<type>.html e .schema.json para cada seção da home`,
        semBloco.length === 0,
        `faltam: ${semBloco.join(', ')}`
      );
      const lista = (rotaHome?.content_for_page ?? []).map(c => c.type);
      const esperado = [...new Set(daHome.map(tipo))];
      r.ok(
        `Wake 2.0 ${nn}: content_for_page da rota da home (Configs/pages.json) lista os ${esperado.length} tipos, na ordem`,
        Array.isArray(rotaHome?.content_for_page) && lista.join() === esperado.join(),
        rotaHome ? `tem: ${lista.join(', ') || '—'}` : 'sem a rota da home em hotsite.customs'
      );
      r.ok(
        `Wake 2.0 ${nn}: Pages/home.html embrulha o <main> em wake_has_content_for_page`,
        /\{\{~?\s*if wake_has_content_for_page/.test(home) && home.includes('wake_content_for_page'),
        'o wrapper do Design Studio não está na home'
      );
    } else if (plataforma === 'Wake') {
      // A Wake de hoje não muda: sem bloco, sem content_for_page, sem wrapper.
      const algum = mudados.filter(rel => rel.startsWith('Blocks/'));
      r.ok(
        `Wake ${nn}: sem Design Studio (nenhum Blocks/ escrito, sem content_for_page, sem wrapper)`,
        algum.length === 0 && !rotaHome?.content_for_page && !home.includes('wake_has_content_for_page'),
        `Blocks: ${algum.join(', ') || '—'} · content_for_page: ${!!rotaHome?.content_for_page}`
      );
    }
  } catch (e) {
    // Uma plataforma que estoura não derruba as outras.
    r.ok(`${plataforma} ${nn}: estourou`, false, e.message);
  }
}

// ── de onde veio ─────────────────────────────────────────────────────────────
if (commitsComponentes.size) {
  const [clonado] = commitsComponentes;
  r.ok(
    `todas as rodadas montaram sobre o mesmo global-templates (${clonado.slice(0, 7)})`,
    commitsComponentes.size === 1,
    [...commitsComponentes].join(', ')
  );
  // O 1-catalogo conferiu as pastas no checkout irmão; o generator montou o clonado.
  const lido = git(GLOBAL_TEMPLATES, 'rev-parse', 'HEAD');
  r.ok(
    `o global-templates clonado é o que o estágio 1 leu (${lido.slice(0, 7)})`,
    clonado === lido || !!process.env.GLOBAL_COMPONENTS_REPO,
    `clonado ${clonado.slice(0, 7)} · irmão local ${lido.slice(0, 7) || '—'}`
  );
}
if (pulados.length)
  console.log(
    `  ⏭️  PULADA(S): ${pulados.join(', ')} — esta rodada não prova essas plataformas.`
  );
process.exit(r.fechar() ? 0 : 1);
