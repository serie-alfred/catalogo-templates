/**
 * Estágio 4 — montar o tema FastStore de verdade.
 *
 * É a única perna do pipeline que dá para executar desta máquina: o clone do
 * GitHub autentica pelo `gh`, enquanto o GitLab (tema-base da Tray) e o
 * git.fbits.net (tema da Wake) travam no git-credential-osxkeychain.
 *
 * Roda com `--test` (dispensa o prompt da URL da loja), SEM `--push` (não cria
 * branch) e SEM `--sync` (não publica no Headless CMS da VTEX).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { GENERATOR, FASTSTORE_STARTER, SAIDA, relatorio } from './lib/util.mjs';

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
fs.writeFileSync(
  `${SAIDA}/config-VTEX-cruzado.json`,
  JSON.stringify(config, null, 2)
);
fs.writeFileSync(CONFIG_VIVO, JSON.stringify(config, null, 2));

// yarn resolve `node` do PATH; garantir que é o mesmo Node que roda o funil.
const env = {
  ...process.env,
  PATH: `${path.dirname(process.execPath)}:${process.env.PATH}`,
};
const rodar = (cmd, args, cwd) =>
  spawnSync(cmd, args, {
    cwd,
    env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

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
const existe = p => fs.existsSync(path.join(TEMA, p));
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
const mockData = path.join(TEMA, 'src/utils/mockData/index.ts');
if (fs.existsSync(mockData)) {
  const linha = fs
    .readFileSync(mockData, 'utf8')
    .split('\n')
    .find(l => l.startsWith('export const MOCK_ENABLED'));
  r.ok(
    'MOCK_ENABLED desligado em produção no tema entregue',
    linha === "export const MOCK_ENABLED = process.env.NODE_ENV !== 'production'",
    linha
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
