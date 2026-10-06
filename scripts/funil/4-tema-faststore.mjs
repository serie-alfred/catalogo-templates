/**
 * Estágio 4 — montar o tema FastStore de verdade.
 *
 * É a única perna do pipeline que dá para executar desta máquina: o clone do
 * GitHub autentica pelo `gh`, enquanto o GitLab (tema-base da Tray) e o
 * git.fbits.net (tema da Wake) travam no git-credential-osxkeychain.
 *
 * Roda com `--test` (dispensa o prompt da URL da loja), SEM `--push` (não cria
 * branch) e SEM `--sync` (não publica no Headless CMS da VTEX).
 *
 * Também confere o checkout VTEX, que sai em TODO tema FastStore (`checkout/`):
 * o generator clona o checkout-vtex no SHA de `faststore.checkout.version`
 * (`CHECKOUT_VTEX_REPO`; sem a env, o irmão `../checkout-vtex` quando ele tem
 * commit), compõe com o `lib/compose.mjs` do clone e grava 5 arquivos. O estágio
 * prova dois casos negativos (papel desconhecido e, gate0 #25, o checkout-vtex que
 * não clona com o config COM `faststore.checkout` → a VALIDATE aborta sem escrever) e,
 * no positivo, que os bytes são os do compose do CATÁLOGO (o lib vendorizado em
 * src/lib/checkout/) para o mesmo config — o que o /gerador mostra é o que sai.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import {
  GENERATOR,
  FASTSTORE_STARTER,
  E_TEMAS,
  RAIZ,
  SAIDA,
  itens,
  relatorio,
} from './lib/util.mjs';

const r = relatorio('Estágio 4 — tema FastStore montado');
const CONFIG_VIVO = path.join(GENERATOR, 'src/config/config.json');
const TEMA = path.join(GENERATOR, 'tema-base-faststore');
// A base é o config COERENTE, não o máximo: o máximo põe seis cards e seis
// vitrines ao mesmo tempo, o que a UI não permite, e o tema sai com componentes
// que ninguém escolheria junto.
const origem = `${SAIDA}/config-VTEX-coerente.json`;

if (!fs.existsSync(origem)) {
  r.ok('config coerente disponível', false, 'rode o estágio 3 antes');
  process.exit(1);
}

// O config do generator é versionado: guardar e devolver, sempre — inclusive se
// algo estourar no meio. Sujeira aqui contamina a próxima execução.
const backup = fs.readFileSync(CONFIG_VIVO, 'utf8');
let devolvido = false;
const devolver = () => {
  if (devolvido) return;
  devolvido = true;
  fs.writeFileSync(CONFIG_VIVO, backup);
};
process.on('exit', devolver);
// `exit` NÃO dispara em SIGINT/SIGTERM, e este estágio anuncia "minutos" duas vezes —
// o Ctrl+C no meio é o caso comum, não a exceção. Sem estes dois, o config.json
// versionado do generator fica sujo e contamina a próxima execução. Já aconteceu.
for (const sinal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sinal, () => {
    devolver();
    process.exit(130);
  });
}
process.on('uncaughtException', err => {
  devolver();
  throw err;
});

// O generator CLONA a origem dos componentes — inclusive de um `file://`. Clone
// enxerga commit, não working tree: trabalho não commitado no starter fica
// invisível e o tema sai com a versão antiga, sem nenhum aviso.
const repoComponentes = process.env.FASTSTORE_COMPONENTS_REPO ?? '';
if (repoComponentes.startsWith('file://')) {
  const local = repoComponentes.replace('file://', '');
  const sujo = spawnSync('git', ['status', '--porcelain'], {
    cwd: local,
    encoding: 'utf8',
  }).stdout.trim();
  r.ok(
    'checkout local do starter sem alteração pendente',
    sujo === '',
    `${sujo.split('\n').length} arquivo(s) não commitado(s) — o clone não os veria`
  );
}

// Do config coerente para o CRUZADO: a vitrine vira a da família 06 e o card
// escolhido continua o 01. É o que o cliente faz quando gosta de uma vitrine e de
// um card de linhas diferentes — e é o único caminho que exercita a substituição
// de spot, que é textual e reescreve import, JSX e caminho de módulo de uma vez.
// O coerente não exercita nada disso: vitrine e card são da mesma família, então
// o replaceAll não encontra o que trocar.
const config = JSON.parse(fs.readFileSync(origem, 'utf8'));
const home = config.faststore?.home ?? [];
const vitrine = home.find(
  e => e.component === 'organisms/ProductShelfCustom01'
);
if (vitrine) {
  vitrine.component = 'organisms/ProductShelfCustom06';
  vitrine.title = 'ProductShelfCustom06';
}
r.ok(
  'config cruzado montado (vitrine 06 × card 01)',
  Boolean(vitrine),
  'o config coerente não trazia a ProductShelfCustom01'
);

// Cor por componente, como num export real: o `pickChangedVariables` grava no
// config toda variável que o cliente mexeu, e o config coerente não traz
// nenhuma. Foi assim que este estágio passou verde enquanto o VALIDATE do
// generator reprovava TODO componente não-override com `variables` ("destino
// disputado por duas origens", de 0936789 a 23/09): o primeiro config de
// cliente morreria ali. Uma entrada por caminho de injeção: o componente cuja
// pasta é copiada, e o override, achatado num .tsx com o SCSS solto em
// src/sass/. Os nomes saem do `variablesSchema` do catálogo, que é o contrato,
// e cada valor é um marcador que nenhum SCSS do starter tem.
const catalogoVtex = itens().filter(i => i.platforms?.includes('VTEX'));
const coresDe = e =>
  (
    catalogoVtex.find(i => i.key === e.key && i.path === e.component)
      ?.variablesSchema ?? []
  ).filter(v => v.type === 'color');
const entradas = Object.values(config.faststore).filter(Array.isArray).flat();
// Cópia duplicada com `variables` divergentes é outro assunto (um SCSS por
// componente, ver o aviso do VALIDATE): o alvo tem de aparecer uma vez só.
const unico = e =>
  entradas.filter(x => x.component === e.component).length === 1;
const alvo = override =>
  entradas.find(
    e =>
      e.component?.startsWith('overrides/') === override &&
      unico(e) &&
      coresDe(e).length > 0
  );
const comCor = [alvo(false), alvo(true)];
let marcador = 0;
for (const e of comCor.filter(Boolean)) {
  e.variables = Object.fromEntries(
    coresDe(e).map(v => [
      v.cssVar,
      `#0f0f${String(++marcador).padStart(2, '0')}`,
    ])
  );
}
r.ok(
  `variables num componente não-override (${comCor[0]?.component ?? '—'})`,
  Boolean(comCor[0]),
  'nenhuma entrada não-override do config tem cor no variablesSchema'
);
r.ok(
  `variables num override (${comCor[1]?.component ?? '—'})`,
  Boolean(comCor[1]),
  'nenhum override do config tem cor no variablesSchema'
);

// ── checkout VTEX: o config ──────────────────────────────────────────────────
// O export já leva `faststore.checkout` (o estágio 3 confere modelo, SHA e
// papéis). Aqui o nível 1 vira MARCADOR — valores que nenhum arquivo da base tem —
// em parte dos papéis do painel; botão, tag e texto ficam de fora de propósito,
// para herdar o nível 2 (`faststore.variables`) e exercitar a cadeia inteira. E o
// logo vira um data URL marcador: o coerente sai com `assets.logo` vazio.
const VERSAO_CK = JSON.parse(
  fs.readFileSync(path.join(RAIZ, 'src/data/checkout/VERSION.json'), 'utf8')
);
const MODELO_CK = JSON.parse(
  fs.readFileSync(
    path.join(RAIZ, 'src/data/checkout', VERSAO_CK.modelo, 'checkout.json'),
    'utf8'
  )
);
const ARQ_CK = { ...MODELO_CK.arquivos, readme: 'README.md' };
const baseCk = Object.fromEntries(
  ['css', 'js', 'header', 'footer'].map(k => [
    k,
    fs.readFileSync(
      path.join(RAIZ, 'public/gerador/checkout', MODELO_CK.id, ARQ_CK[k]),
      'utf8'
    ),
  ])
);
const shaCk = config.faststore.checkout?.version ?? null;
r.ok(
  `faststore.checkout.version = o SHA vendorizado no catálogo (${String(VERSAO_CK.sha).slice(0, 12)})`,
  shaCk !== null &&
    shaCk === VERSAO_CK.sha &&
    config.faststore.checkout?.model === MODELO_CK.id,
  `config ${config.faststore.checkout?.model ?? '—'}@${shaCk ?? '—'} · VERSION.json ${VERSAO_CK.modelo}@${VERSAO_CK.sha}`
);

const MARCADORES_CK = {
  '--checkout-accent': '#0c0c01',
  '--checkout-text-muted': '#0c0c02',
  '--checkout-page-bg': '#fcfcf3',
  '--checkout-surface-bg': '#fcfcf4',
  '--checkout-border': '#fcfcf5',
  '--checkout-header-bg': '#fcfcf6',
  '--checkout-font': "'Karla', Arial, Helvetica, sans-serif",
};
const doPainel = new Set(
  MODELO_CK.papeis.filter(p => p.painel).map(p => p.cssVar)
);
const foraDoPainel = Object.keys(MARCADORES_CK).filter(k => !doPainel.has(k));
const naBase = Object.values(MARCADORES_CK)
  .filter(v => v.startsWith('#'))
  .filter(v =>
    Object.values(baseCk).some(t => t.toLowerCase().includes(v.toLowerCase()))
  );
r.ok(
  `nível 1 marcador em ${Object.keys(MARCADORES_CK).length} papéis do painel, nenhum valor presente na base`,
  foraDoPainel.length === 0 && naBase.length === 0,
  `fora do painel: ${foraDoPainel.join(', ') || '—'} · já na base: ${naBase.join(', ') || '—'}`
);
const SVG_LOGO =
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="32" viewBox="0 0 120 32">' +
  '<title>funil-4-logo</title><rect width="120" height="32" rx="4" fill="#0c0c0c"/></svg>';
const LOGO_MARCADOR = `data:image/svg+xml;base64,${Buffer.from(SVG_LOGO).toString('base64')}`;
config.faststore.checkout = {
  ...config.faststore.checkout,
  variables: MARCADORES_CK,
};
config.faststore.assets = {
  ...(config.faststore.assets ?? {}),
  logo: LOGO_MARCADOR,
};

// De onde o generator clona o checkout-vtex. O remote do GitHub ainda não existe
// (e o default do generator aponta para ele); sem a env, o irmão com commit. Clone
// enxerga COMMIT: o SHA pedido tem de existir lá, e trabalho não commitado some.
const temHead = dir =>
  spawnSync('git', ['rev-parse', '-q', '--verify', 'HEAD'], {
    cwd: dir,
    encoding: 'utf8',
  }).status === 0;
const irmaoCk = path.join(E_TEMAS, 'checkout-vtex');
const repoCheckout =
  process.env.CHECKOUT_VTEX_REPO ??
  (fs.existsSync(path.join(irmaoCk, '.git')) && temHead(irmaoCk)
    ? `file://${irmaoCk}`
    : undefined);
console.log(
  `  ℹ️  checkout-vtex: ${repoCheckout ?? 'o default do generator (github.com/seriedesign/checkout-vtex)'}`
);
if (repoCheckout?.startsWith('file://')) {
  const local = repoCheckout.replace('file://', '');
  const sujoCk = spawnSync('git', ['status', '--porcelain'], {
    cwd: local,
    encoding: 'utf8',
  }).stdout.trim();
  r.ok(
    'checkout local do checkout-vtex sem alteração pendente',
    sujoCk === '',
    `${sujoCk.split('\n').length} arquivo(s) não commitado(s) — o clone não os veria`
  );
  r.ok(
    `o SHA do config existe no checkout-vtex local (${String(shaCk).slice(0, 12)})`,
    spawnSync('git', ['cat-file', '-e', `${shaCk}^{commit}`], { cwd: local })
      .status === 0,
    `${local} não tem o commit ${shaCk}`
  );
}

fs.writeFileSync(
  `${SAIDA}/config-VTEX-cruzado.json`,
  JSON.stringify(config, null, 2)
);

// yarn resolve `node` do PATH; garantir que é o mesmo Node que roda o funil.
const env = {
  ...process.env,
  PATH: `${path.dirname(process.execPath)}:${process.env.PATH}`,
  ...(repoCheckout ? { CHECKOUT_VTEX_REPO: repoCheckout } : {}),
};
const rodar = (cmd, args, cwd) =>
  spawnSync(cmd, args, {
    cwd,
    env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
const existe = p => fs.existsSync(path.join(TEMA, p));

// ── checkout VTEX: o caso negativo, ANTES do positivo ────────────────────────
// Papel que o modelo não tem é erro exclusivo do checkout (gate0 #14b): a
// VALIDATE reprova antes de qualquer escrita. Roda primeiro porque o SYNC da
// rodada seguinte reclona o tema-base (reset + clean -x) — ao contrário, apagaria
// o tema que o build lá embaixo compila. "Sem escrever" = o tema-base fica
// exatamente como o clone o deixou: nada no status, nem ignorado, e sem checkout/.
const negativo = structuredClone(config);
negativo.faststore.checkout.variables = {
  ...MARCADORES_CK,
  '--checkout-nao-existe': '#123456',
};
fs.writeFileSync(CONFIG_VIVO, JSON.stringify(negativo, null, 2));
console.log(
  '  ⏳ caso negativo: faststore.checkout.variables com um papel que o modelo não tem'
);
const neg = rodar('yarn', ['start:test'], GENERATOR);
const saidaNeg = `${neg.stdout ?? ''}${neg.stderr ?? ''}`;
fs.writeFileSync(`${SAIDA}/generator-negativo.log`, saidaNeg);
r.ok(
  'negativo: o generator aborta (exit ≠ 0)',
  neg.status !== 0,
  `exit ${neg.status} — log em .funil/generator-negativo.log`
);
r.ok(
  'negativo: a VALIDATE reprova com papel-desconhecido (--checkout-nao-existe)',
  /VALIDATE reprovou o plano/.test(saidaNeg) &&
    /checkout \(papel-desconhecido\): "--checkout-nao-existe"/.test(saidaNeg),
  saidaNeg
    .split('\n')
    .filter(l => /❌|VALIDATE/.test(l))
    .slice(0, 4)
    .join(' | ') || 'sem linha de VALIDATE no log'
);
r.ok('negativo: o EXECUTE não começou', !/\[8\/10\] EXECUTE/.test(saidaNeg));
const estadoNeg = spawnSync('git', ['status', '--porcelain', '--ignored'], {
  cwd: TEMA,
  encoding: 'utf8',
});
r.ok(
  'negativo: nada escrito — o tema-base é o clone intacto, sem checkout/',
  estadoNeg.status === 0 &&
    estadoNeg.stdout.trim() === '' &&
    !existe('checkout'),
  estadoNeg.status !== 0
    ? `git status falhou em ${TEMA}`
    : estadoNeg.stdout.trim().split('\n').slice(0, 5).join(', ') ||
        'checkout/ existe'
);

// ── checkout VTEX: o clone que falha (gate0 #25), também antes do positivo ────
// O config do /gerador atual leva `faststore.checkout`: pediu aquele modelo naquele
// SHA. Se o checkout-vtex não clona (repo inexistente, sem rede, sem credencial), o
// problema é exclusivo do checkout e a VALIDATE reprova com `clone-falhou` antes
// de qualquer escrita — nada de "pular" o checkout em silêncio (isso é só para o
// config antigo, SEM a chave, que o teste do generator cobre). O mesmo config do
// positivo, só a origem do checkout trocada por um caminho que não existe. Com o
// remote trocado, o SYNC apaga o `repo-temp-checkout/` da rodada anterior: o
// positivo abaixo reclona do zero.
const INEXISTENTE_CK = path.join(SAIDA, 'checkout-vtex-inexistente');
fs.rmSync(INEXISTENTE_CK, { recursive: true, force: true });
const urlInexistenteCk = pathToFileURL(INEXISTENTE_CK).href;
fs.writeFileSync(CONFIG_VIVO, JSON.stringify(config, null, 2));
console.log(
  `  ⏳ caso gate0 #25: config COM faststore.checkout e CHECKOUT_VTEX_REPO=${urlInexistenteCk}`
);
const semClone = spawnSync('yarn', ['start:test'], {
  cwd: GENERATOR,
  env: { ...env, CHECKOUT_VTEX_REPO: urlInexistenteCk },
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
const saidaSemClone = `${semClone.stdout ?? ''}${semClone.stderr ?? ''}`;
fs.writeFileSync(`${SAIDA}/generator-sem-clone.log`, saidaSemClone);
r.ok(
  'gate0 #25: o generator aborta (exit ≠ 0)',
  semClone.status !== 0,
  `exit ${semClone.status} — log em .funil/generator-sem-clone.log`
);
r.ok(
  'gate0 #25: o SYNC não cai — registra checkout-vtex (clone-falhou) e segue',
  /checkout-vtex \(clone-falhou\)/.test(saidaSemClone) &&
    /\[\d+\/10\] (DISCOVER|RESOLVE|PLAN|VALIDATE)/.test(saidaSemClone),
  saidaSemClone
    .split('\n')
    .filter(l => /💥|clone-falhou|\[\d+\/10\]/.test(l))
    .slice(0, 4)
    .join(' | ') || 'sem linha do SYNC no log'
);
const errosCkSemClone = saidaSemClone
  .split('\n')
  .filter(l => l.includes('❌ checkout ('));
r.ok(
  'gate0 #25: a VALIDATE reprova com clone-falhou, o caminho e o fatal: do git',
  /VALIDATE reprovou o plano/.test(saidaSemClone) &&
    errosCkSemClone.length === 1 &&
    errosCkSemClone[0].includes('checkout (clone-falhou)') &&
    errosCkSemClone[0].includes(urlInexistenteCk) &&
    /fatal:/.test(errosCkSemClone[0]),
  errosCkSemClone.map(l => l.trim().slice(0, 240)).join(' | ') ||
    saidaSemClone
      .split('\n')
      .filter(l => /❌|VALIDATE/.test(l))
      .slice(0, 4)
      .join(' | ') ||
    'sem linha de VALIDATE no log'
);
r.ok(
  'gate0 #25: com a chave no config não é "pulado" (nem aviso checkout-pulado)',
  !/checkout-pulado|checkout: pulado/.test(saidaSemClone)
);
r.ok(
  'gate0 #25: o EXECUTE não começou e nenhuma WriteCheckout',
  !/\[8\/10\] EXECUTE/.test(saidaSemClone) &&
    !/WriteCheckout →/.test(saidaSemClone)
);
const estadoSemClone = spawnSync(
  'git',
  ['status', '--porcelain', '--ignored'],
  { cwd: TEMA, encoding: 'utf8' }
);
r.ok(
  'gate0 #25: nada escrito — o tema-base é o clone intacto, sem checkout/',
  estadoSemClone.status === 0 &&
    estadoSemClone.stdout.trim() === '' &&
    !existe('checkout'),
  estadoSemClone.status !== 0
    ? `git status falhou em ${TEMA}`
    : estadoSemClone.stdout.trim().split('\n').slice(0, 5).join(', ') ||
        'checkout/ existe'
);
r.ok(
  'gate0 #25: o caminho inexistente continua inexistente (o clone não criou nada lá)',
  !fs.existsSync(INEXISTENTE_CK)
);

fs.writeFileSync(CONFIG_VIVO, JSON.stringify(config, null, 2));

console.log(
  '  ⏳ yarn start:test — clona os repos, monta o tema e roda yarn install (minutos)'
);
const build = rodar('yarn', ['start:test'], GENERATOR);
const saida = `${build.stdout ?? ''}${build.stderr ?? ''}`;
fs.writeFileSync(`${SAIDA}/generator.log`, saida);

r.ok(
  'o generator conclui sem erro',
  build.status === 0,
  `exit ${build.status} — log em .funil/generator.log`
);
r.ok(
  'cms-sync NÃO rodou',
  /cms-sync pulado/.test(saida),
  'publicaria no CMS da VTEX'
);
r.ok('preview branch NÃO foi criada', /PREVIEW BRANCH — pulado/.test(saida));
if (build.status !== 0) {
  console.log(saida.slice(-2000));
  process.exit(1);
}

// ── o tema no disco ──────────────────────────────────────────────────────────
const esperados = [
  ...new Set(
    (config.faststore.global ?? [])
      .concat(
        config.faststore.home ?? [],
        config.faststore.category ?? [],
        config.faststore.product ?? []
      )
      .map(e => e.component)
      .filter(c => !c.startsWith('overrides/'))
  ),
];
const faltando = esperados.filter(c => !existe(path.join('src/components', c)));
r.ok(
  `${esperados.length} componentes copiados para o tema`,
  faltando.length === 0,
  faltando.join(', ')
);

// Overrides são achatados: overrides/Breadcrumb01/index.tsx → overrides/Breadcrumb.tsx
const overrides = (config.faststore.overrides ?? []).map(e =>
  e.component.split('/').pop().replace(/\d+$/, '')
);
const semOverride = overrides.filter(
  n =>
    !existe(`src/components/overrides/${n}.tsx`) &&
    !existe(`src/components/molecules/${n}`)
);
r.ok(
  `overrides materializados (${overrides.join(', ')})`,
  semOverride.length === 0,
  semOverride.join(', ')
);

// As `variables` de cada alvo chegaram ao SCSS do tema: o componente na própria
// pasta, o override em src/sass/. VALIDATE que reprova já derruba o estágio lá
// em cima; isto pega o outro jeito de perder a cor do cliente, que é o plano
// sair sem a injeção ou a injeção cair fora do SCSS do componente.
const scssEm = dir =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { recursive: true })
        .filter(f => f.endsWith('.scss'))
        .map(f => path.join(dir, f))
    : [];
for (const e of comCor.filter(Boolean)) {
  const onde = e.component.startsWith('overrides/')
    ? 'src/sass'
    : path.join('src/components', e.component);
  const fontes = scssEm(path.join(TEMA, onde)).map(f => ({
    arquivo: path.relative(TEMA, f),
    css: fs.readFileSync(f, 'utf8'),
  }));
  const declaracoes = Object.entries(e.variables).map(
    ([k, v]) => `${k}: ${v};`
  );
  const faltam = declaracoes.filter(
    d => !fontes.some(({ css }) => css.includes(d))
  );
  const ondeCaiu = fontes
    .filter(({ css }) => declaracoes.some(d => css.includes(d)))
    .map(({ arquivo }) => arquivo);
  r.ok(
    `variables de ${e.component} no SCSS do tema (${ondeCaiu.join(', ') || onde})`,
    faltam.length === 0,
    `faltam em ${onde}: ${faltam.join(' ')}`
  );
}

// Fragments: a pasta de origem só tem manifest, o código é flat. Antes do
// conserto do `fragmentFile` isto morria com ENOENT e derrubava o build inteiro.
const fragments = fs.existsSync(path.join(TEMA, 'src/fragments'))
  ? fs
      .readdirSync(path.join(TEMA, 'src/fragments'))
      .filter(f => f.endsWith('.ts'))
  : [];
r.ok(
  'fragments copiados como arquivo flat',
  fragments.length > 0,
  fragments.join(', ') || 'nenhum'
);

for (const arquivo of [
  'cms/faststore/sections.json',
  'src/components/index.tsx',
  'src/themes/custom-theme.scss',
  'src/fonts/WebFonts.tsx',
  'src/graphql/vtex/resolvers/index.ts',
]) {
  r.ok(`${arquivo} regravado`, existe(arquivo));
}

const secoes = JSON.parse(
  fs.readFileSync(path.join(TEMA, 'cms/faststore/sections.json'), 'utf8')
);
const nomes = new Set(secoes.filter(sc => sc?.name).map(sc => sc.name));
// Só quem declara `section` no manifest vira entrada no CMS. Os ProductCard e o
// ProductShowcase01 não declaram: são consumidos DENTRO de outro componente
// (substituição de spot / override), não escolhidos no painel.
const declaraSection = comp => {
  const m = path.join(
    FASTSTORE_STARTER,
    'src/components',
    comp,
    'manifest.json'
  );
  if (!fs.existsSync(m)) return false;
  return !!JSON.parse(fs.readFileSync(m, 'utf8')).section?.name;
};
const comSection = esperados.filter(declaraSection);
const semSecao = comSection
  .map(c => c.split('/').pop())
  .filter(n => !nomes.has(n));
r.ok(
  `sections.json com ${nomes.size} seções (${comSection.length} esperadas)`,
  semSecao.length === 0,
  `sem entrada: ${semSecao.join(', ')}`
);

const tema = fs.readFileSync(
  path.join(TEMA, 'src/themes/custom-theme.scss'),
  'utf8'
);
r.ok(
  'variáveis globais do editor no custom-theme.scss',
  /--background-primary-color:/.test(tema) && /--font-primary:/.test(tema)
);

// O bloco gerado tem que ser o ÚLTIMO `:root` do arquivo. As custom properties
// do editor e as do design original do starter moram nas duas no `:root`, mesma
// especificidade: quem declara por último vence. Quando o bloco era prependido,
// o tema saía "montado com sucesso" e com as cores que o usuário NÃO escolheu.
const iniGerado = tema.lastIndexOf('/* BEGIN:custom-variables */');
const ultimoRoot = tema.lastIndexOf(':root');
r.ok(
  'o :root gerado é o último do arquivo (vence a cascata)',
  iniGerado !== -1 && ultimoRoot > iniGerado,
  `BEGIN em ${iniGerado}, último :root em ${ultimoRoot}`
);
const nBegin = (tema.match(/BEGIN:custom-variables/g) ?? []).length;
const nEnd = (tema.match(/END:custom-variables/g) ?? []).length;
r.ok(
  'sentinelas de variáveis pareadas e únicas',
  nBegin === 1 && nEnd === 1,
  `${nBegin} BEGIN, ${nEnd} END`
);
const imports = [...tema.matchAll(/@import\s+'([^']+)'/g)].map(m => m[1]);
const impDup = imports.filter((x, i) => imports.indexOf(x) !== i);
r.ok(
  'nenhum @import repetido no custom-theme.scss',
  impDup.length === 0,
  impDup.join(', ')
);

const fontes = fs.readFileSync(
  path.join(TEMA, 'src/fonts/WebFonts.tsx'),
  'utf8'
);
const familias = [...fontes.matchAll(/family=([^:&"']+)/g)].map(m => m[1]);
r.ok(
  `WebFonts com as fontes escolhidas (${familias.join(', ')})`,
  familias.length >= 3
);

// Dados de exemplo NÃO podem viajar ligados para a loja do cliente. O starter
// mantém `MOCK_ENABLED = true` de propósito (a "produção" dele é ambiente de
// agência) e o próprio arquivo diz qual é a reversão para uma loja real. Até
// 09/09 a reversão era manual e o tema montado saía com a chave ligada — uma
// seção sem conteúdo no CMS entregava dado de exemplo na loja. Quem desliga
// agora é o MockGuard do gerador; esta é a rede que impede a volta.
// `const` OU `let`: o starter trocou para `let` em 1e0e96b (18/09) para que
// `enableMockScope()` religue a chave em runtime, e essa função viaja junto
// para o tema — forçar `const` aqui quebraria o `tsc` do tema. O que importa é
// o VALOR, não a palavra-chave; o MockGuard preserva a que encontrar.
// O arquivo tem de EXISTIR: o palco abaixo o importa em toda geração, e uma
// conferência que some quando o arquivo some não confere nada — até 24/09 ela
// morava dentro de um `if (existsSync)`, e mudar o mockData de lugar calava a trava.
const mockData = path.join(TEMA, 'src/utils/mockData/index.ts');
const linhaMock = fs.existsSync(mockData)
  ? fs
      .readFileSync(mockData, 'utf8')
      .split('\n')
      .find(l => /^export (const|let) MOCK_ENABLED\b/.test(l))
  : undefined;
r.ok(
  'MOCK_ENABLED desligado em produção no tema entregue',
  /^export (const|let) MOCK_ENABLED = process\.env\.NODE_ENV !== 'production'$/.test(
    linhaMock ?? ''
  ),
  fs.existsSync(mockData)
    ? (linhaMock ?? 'declaração de MOCK_ENABLED não encontrada')
    : `${path.relative(TEMA, mockData)} não existe no tema — a trava não foi conferida`
);

// O DevFidelityStage viaja para o tema (o DevFidelityInjector o copia por fora do
// grafo de manifests) e chama `enableMockScope()`, que RELIGA MOCK_ENABLED em
// runtime — por cima do que o MockGuard acabou de desligar. Até 21/09 o que
// segurava isso era só a frase "nunca numa página real" no schema da seção. Agora
// o palco tem trava de build; esta é a rede que impede a trava de sumir sem aviso,
// que foi exatamente como o MockGuard virou no-op.
// O DevFidelityInjector copia o palco em TODA geração, então aqui também a
// ausência reprova em vez de pular a conferência.
const palco = path.join(
  TEMA,
  'src/components/organisms/DevFidelityStage/index.tsx'
);
const fontePalco = fs.existsSync(palco) ? fs.readFileSync(palco, 'utf8') : null;
const temConstante =
  fontePalco !== null &&
  /const PALCO_ATIVO\s*=[\s\S]{0,200}?process\.env\.NODE_ENV !== 'production'/.test(
    fontePalco
  );
const temSaida =
  fontePalco !== null && /if \(!PALCO_ATIVO\) return null/.test(fontePalco);
r.ok(
  'DevFidelityStage desligado em produção no tema entregue',
  temConstante && temSaida,
  fontePalco === null
    ? `${path.relative(TEMA, palco)} não existe no tema — o DevFidelityInjector o copia em toda geração, e a trava não foi conferida`
    : !temConstante
      ? 'sem a constante PALCO_ATIVO ligada a NODE_ENV'
      : 'PALCO_ATIVO existe mas nada retorna null com ela'
);

// ── checkout VTEX: o que saiu em checkout/ ───────────────────────────────────
// Exatamente os 5 do CheckoutWriter: `.ts` o tsconfig do tema checaria, e
// `manifest.json` o AssetRegistry derrubaria na próxima geração.
const DIR_CK = path.join(TEMA, 'checkout');
const nomesCk = Object.values(ARQ_CK).sort();
const noDiscoCk = fs.existsSync(DIR_CK)
  ? fs.readdirSync(DIR_CK, { recursive: true }).map(String).sort()
  : [];
r.ok(
  `checkout/ com exatamente os 5 arquivos (${nomesCk.join(', ')})`,
  JSON.stringify(noDiscoCk) === JSON.stringify(nomesCk),
  `tem: ${noDiscoCk.join(', ') || 'nada'}`
);
r.ok(
  'checkout/ sem .ts nem manifest.json',
  !noDiscoCk.some(
    f => /\.tsx?$/.test(f) || path.basename(f) === 'manifest.json'
  ),
  noDiscoCk.filter(f => /\.tsx?$|manifest\.json$/.test(f)).join(', ')
);
const ck = Object.fromEntries(
  Object.entries(ARQ_CK).map(([k, nome]) => [
    k,
    fs.existsSync(path.join(DIR_CK, nome))
      ? fs.readFileSync(path.join(DIR_CK, nome), 'utf8')
      : '',
  ])
);
r.ok(
  `o clone do checkout-vtex parou no SHA do config (${String(shaCk).slice(0, 12)})`,
  spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: path.join(GENERATOR, 'repo-temp-checkout'),
    encoding: 'utf8',
  }).stdout.trim() === shaCk
);
r.ok(
  'o log registra o WriteCheckout no SHA do config',
  new RegExp(
    `WriteCheckout → checkout/checkout6-custom\\.css.*\\(${MODELO_CK.id}@${String(shaCk).slice(0, 12)}\\)`
  ).test(saida)
);

// @import primeiro: depois de qualquer regra, o navegador o ignora (comentário e
// banner `/*! … */` não contam). E é o da fonte do nível 1 marcador.
const semComentarios = ck.css.replace(/\/\*[\s\S]*?\*\//g, '');
const primeiroImport = /^\s*@import url\('([^']+)'\);/.exec(semComentarios);
r.ok(
  '@import do Google Fonts é a primeira instrução do checkout6-custom.css (Karla)',
  Boolean(primeiroImport) && /[?&]family=Karla:wght@/.test(primeiroImport[1]),
  primeiroImport?.[1] ?? semComentarios.trimStart().slice(0, 80)
);
const tokensCk =
  /\/\* ETC:BEGIN tokens \*\/\s*:root\s*\{([^}]*)\}/.exec(ck.css)?.[1] ?? '';
const semMarcador = Object.entries(MARCADORES_CK)
  .map(([k, v]) => `${k}: ${v};`)
  .filter(d => !tokensCk.includes(d));
r.ok(
  `os ${Object.keys(MARCADORES_CK).length} marcadores de nível 1 no :root do bloco tokens`,
  tokensCk !== '' && semMarcador.length === 0,
  tokensCk
    ? `faltam: ${semMarcador.join(' ')}`
    : 'bloco ETC:BEGIN tokens não encontrado'
);
r.ok(
  'o nível 2 da loja entra no mesmo :root (botão e texto herdam faststore.variables)',
  /--background-primary-color: #[0-9a-f]{6};/.test(tokensCk) &&
    /--text-primary-color: #[0-9a-f]{6};/.test(tokensCk),
  tokensCk.trim().split('\n').slice(0, 4).join(' ')
);
r.ok(
  'o logo do config está no checkout-header.html (sem {{LOGO_SRC}})',
  ck.header.includes(`src="${LOGO_MARCADOR}"`) &&
    !ck.header.includes('{{LOGO_SRC}}')
);
const comEtc = Object.entries(ck)
  .filter(([, t]) => t.includes('{{ETC_') || t.includes('ETC:SLOT'))
  .map(([k]) => ARQ_CK[k]);
r.ok(
  'zero {{ETC_ e ETC:SLOT nos 5 arquivos',
  comEtc.length === 0,
  comEtc.join(', ')
);
// README de upload: o pre-flight é o que impede colar numa conta em que o Admin é
// ignorado, e os placeholders são o que o time preenche antes.
const phRestantes = (MODELO_CK.placeholders ?? []).filter(ph =>
  Object.entries(ARQ_CK).some(
    ([k, nome]) => nome === ph.arquivo && ck[k].includes(ph.id)
  )
);
const phSemReadme = phRestantes.filter(
  ph => !ck.readme.includes(`\`${ph.id}\``)
);
r.ok(
  `README com os ${phRestantes.length} placeholders a preencher (${phRestantes.map(p => p.id).join(', ')})`,
  phRestantes.length > 0 && phSemReadme.length === 0,
  `faltam: ${phSemReadme.map(p => p.id).join(', ')}`
);
const preflight = [
  'Antes de colar (bloqueia)',
  '/* source: <',
  'vtex.checkout-ui-custom',
  shaCk,
];
const semPreflight = preflight.filter(m => !ck.readme.includes(m));
r.ok(
  'README com o pre-flight bloqueante e o SHA',
  semPreflight.length === 0,
  `faltam: ${semPreflight.join(', ')}`
);

// A equivalência com o /gerador: o compose do lib VENDORIZADO no catálogo, sobre a
// base servida ao preview, com o mesmo config, tem de dar os MESMOS bytes. O 1-checkout
// prova vendorizado == SHA; isto fecha o laço do outro lado (generator == SHA).
try {
  const libCk = await import(
    pathToFileURL(path.join(RAIZ, 'src/lib/checkout/compose.mjs')).href
  );
  const { options } = libCk.optionsFromConfig(config.faststore);
  const doCatalogo = libCk.composeCheckout(MODELO_CK, baseCk, options);
  const difs = Object.keys(ARQ_CK)
    .filter(k => doCatalogo[k] !== ck[k])
    .map(k => {
      const a = doCatalogo[k] ?? '';
      const b = ck[k];
      let i = 0;
      while (i < a.length && a[i] === b[i]) i++;
      return `${ARQ_CK[k]} (byte ${i}: catálogo ${JSON.stringify(a.slice(i, i + 30))} × tema ${JSON.stringify(b.slice(i, i + 30))})`;
    });
  r.ok(
    'bytes do checkout/ == compose do catálogo (src/lib/checkout, mesmo config), os 5 arquivos',
    difs.length === 0,
    difs.join('; ')
  );
  const avisosCk = doCatalogo.avisos.map(a => a.codigo);
  console.log(
    `  ℹ️  avisos do compose: ${[...new Set(avisosCk)].join(', ') || 'nenhum'}`
  );
} catch (e) {
  r.ok(
    'bytes do checkout/ == compose do catálogo (src/lib/checkout, mesmo config), os 5 arquivos',
    false,
    `o compose do catálogo lançou: ${e.message}`
  );
}

// ── portão: o tema compila? ──────────────────────────────────────────────────
if (process.env.FUNIL_TEMA_BUILD === '0') {
  console.log('  ⏭️  yarn build do tema pulado (FUNIL_TEMA_BUILD=0)');
} else {
  console.log('  ⏳ yarn build do tema (minutos)');
  const b = rodar('yarn', ['build'], TEMA);
  fs.writeFileSync(
    `${SAIDA}/tema-build.log`,
    `${b.stdout ?? ''}${b.stderr ?? ''}`
  );
  r.ok(
    'o tema gerado compila (yarn build)',
    b.status === 0,
    `exit ${b.status} — log em .funil/tema-build.log`
  );
}

process.exit(r.fechar() ? 0 : 1);
