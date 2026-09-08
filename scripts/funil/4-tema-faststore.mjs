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
// O tema é montado a partir do config COERENTE, não do máximo: o máximo põe seis
// cards e seis vitrines ao mesmo tempo, o que a UI não permite, e a substituição
// de spot então cruza famílias — ProductCard01 exige `userEmail`, que as
// vitrines 03/04 não passam, e o tema não compila.
const origem = `${SAIDA}/config-VTEX-coerente.json`;

if (!fs.existsSync(origem)) {
  r.ok('config coerente disponível', false, 'rode o estágio 3 antes');
  process.exit(1);
}

// O config do generator é versionado: guardar e devolver, sempre — inclusive se
// algo estourar no meio. Sujeira aqui contamina a próxima execução.
const backup = fs.readFileSync(CONFIG_VIVO, 'utf8');
const devolver = () => fs.writeFileSync(CONFIG_VIVO, backup);
process.on('exit', devolver);

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

const config = JSON.parse(fs.readFileSync(origem, 'utf8'));
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

const fontes = fs.readFileSync(
  path.join(TEMA, 'src/fonts/WebFonts.tsx'),
  'utf8'
);
const familias = [...fontes.matchAll(/family=([^:&"']+)/g)].map(m => m[1]);
r.ok(
  `WebFonts com as fontes escolhidas (${familias.join(', ')})`,
  familias.length >= 3
);

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
