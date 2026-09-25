/**
 * Funil de teste do E-temas, ponta a ponta.
 *
 * Encadeia os estágios na ordem em que o produto acontece: catálogo → editor →
 * export → tema montado. Para no primeiro que falhar, porque os seguintes
 * dependem do anterior — não adianta conferir o tema se o config saiu errado.
 *
 *   yarn funil               todos os estágios
 *   yarn funil 1 2-edicao    só os que casarem com os argumentos
 */
import { spawn, execFileSync } from 'node:child_process';
import { readdirSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL, SAIDA, RAIZ, FASTSTORE_STARTER } from './lib/util.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const filtros = process.argv.slice(2);
// Só uma execução COMPLETA vira evidência — ver o registro no fim.
const completa = !filtros.length;

const estagios = readdirSync(AQUI)
  .filter(f => /^\d.*\.mjs$/.test(f))
  .sort()
  .filter(f => !filtros.length || filtros.some(q => f.startsWith(q)));

if (!estagios.length) {
  console.error(`Nenhum estágio casa com ${JSON.stringify(filtros)}.`);
  process.exit(1);
}

/**
 * Variáveis que ESTREITAM o que um estágio mede. Numa execução parcial servem
 * para iterar; numa completa fariam o registro mentir — até 24/09 ele saía
 * `ok: true` com o build do tema pulado, um par de fidelidade só ou 23 dos itens
 * no render, e o preflight do cutover aceitava. A completa as recusa.
 */
const ESTREITAM = {
  FUNIL_TEMA_BUILD: v => v === '0', // 4: pula o `yarn build` do tema
  FIDELIDADE_SO: v => v !== '', // 2-fidelidade: um par só
  FUNIL_RENDER_NOVOS: v => v === '1', // 2-render: só os 23 do redesign
};
/**
 * Variáveis que trocam O QUE é medido: outra origem de componentes, outro
 * tema-base, outra branch esperada do starter, o palco ligado no build de
 * produção do tema. Não estreitam, desviam — ficam registradas, e a execução
 * que rodou com qualquer uma não vale como evidência.
 */
const DESVIAM = [
  'FASTSTORE_COMPONENTS_REPO',
  'FASTSTORE_COMPONENTS_BRANCH',
  'FASTSTORE_THEME_BASE_REPO',
  'FASTSTORE_THEME_BASE_BRANCH',
  'NEXT_PUBLIC_DEV_FIDELITY',
];

if (completa) {
  const estreitas = Object.entries(ESTREITAM)
    .filter(([k, estreita]) => process.env[k] !== undefined && estreita(process.env[k]))
    .map(([k]) => `${k}=${process.env[k]}`);
  if (estreitas.length) {
    console.error(
      `\n💥 execução completa com ${estreitas.join(' ')}: isso estreita o que os estágios\n` +
        `   medem, e o registro sairia dizendo que o todo passou. Tire a variável, ou\n` +
        `   rode os estágios por nome (\`yarn funil 1 2 3\`) — execução parcial não grava nada.`
    );
    process.exit(1);
  }
}

// Os estágios de browser morrem com um stack cru do puppeteer quando o dev server
// não está de pé — e "ERR_CONNECTION_REFUSED" não diz que o servidor caiu no meio,
// nem que alguém subiu outro na mesma porta. Conferir antes custa 1s.
const precisaDeDev = estagios.some(f => /^[23]/.test(f));
if (precisaDeDev) {
  const vivo = await fetch(`${BASE_URL}/gerador`, { redirect: 'manual' })
    .then(r => r.status < 500)
    .catch(() => false);
  if (!vivo) {
    console.error(
      `\n💥 ${BASE_URL} não responde. Os estágios 2 e 3 precisam do dev server:\n` +
        `   yarn dev\n` +
        `   (se outra sessão já subiu um na mesma porta, ele pode ter derrubado o seu)`
    );
    process.exit(1);
  }
}

// O 2-fidelidade é o único estágio que precisa dos DOIS servidores: ele compara
// o componente real do starter com a réplica daqui. Sem esta conferência, ele
// morre com um ERR_CONNECTION_REFUSED que parece problema do catálogo.
const STARTER_URL = process.env.FUNIL_STARTER_URL ?? 'http://localhost:3000';
const precisaDoStarter = estagios.some(f => f.startsWith('2-fidelidade'));
if (precisaDoStarter) {
  const vivo = await fetch(`${STARTER_URL}/dev-fidelity`, { redirect: 'manual' })
    .then(r => r.status < 500)
    .catch(() => false);
  if (!vivo) {
    console.error(
      `\n💥 ${STARTER_URL}/dev-fidelity não responde. O estágio 2-fidelidade\n` +
        `   compara contra o componente REAL, então precisa do starter de pé:\n` +
        `   yarn --cwd ../faststore.starter dev\n` +
        `   (500 ali costuma ser contentSource: o palco vive no CMS legado —\n` +
        `    ver faststore.starter/CLAUDE.md → "De onde vem o conteúdo")`
    );
    process.exit(1);
  }
}

/**
 * O estado de cada um dos 4 repos: commit e o que está fora dele.
 *
 * É o que transforma "o funil passou" em evidência: um verde sobre código que
 * mudou depois não prova nada, e sem registrar contra o quê ele passou não há
 * como saber. Só o commit não basta — o estágio lê o WORKING TREE, e um verde
 * com arquivo sujo prova um código que o commit não tem. Tirado no início e no
 * fim: o checkout é compartilhado, e outra sessão pode commitar no meio.
 *
 * `GIT_OPTIONAL_LOCKS=0`: o `git status` não regrava o índice, que as outras
 * sessões usam para commitar.
 */
const REPOS = [
  'faststore.starter',
  'catalogo-templates',
  'produtos-template-generator',
  'global-templates',
];
const GIT = {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
  env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
};
function estadoDosRepos() {
  const estado = {};
  for (const repo of REPOS) {
    const dir = path.join(RAIZ, '..', repo);
    try {
      estado[repo] = {
        commit: execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], GIT).trim(),
        sujo: execFileSync('git', ['-C', dir, 'status', '--porcelain'], GIT)
          .split('\n')
          .filter(Boolean),
      };
    } catch {
      estado[repo] = { commit: null, sujo: [] };
    }
  }
  return estado;
}

/**
 * Quem responde num servidor local: os PIDs que escutam na porta e a pasta de
 * onde cada um roda. O `fetch` lá em cima diz que ALGUÉM respondeu; isto diz se
 * foi este checkout — outra sessão pode ter subido o catálogo de um clone
 * descartável na mesma porta, e o funil mediria outro código com o commit deste.
 */
function quemServe(url, esperado) {
  const u = new URL(url);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(u.hostname))
    return { url, pids: [], pastas: [], ok: false, motivo: `${url} não é local: não dá para saber que código respondeu` };
  const porta = u.port || (u.protocol === 'https:' ? '443' : '80');
  const lsof = args => {
    try {
      return execFileSync('lsof', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      return '';
    }
  };
  const real = p => {
    try {
      return realpathSync(p);
    } catch {
      return p;
    }
  };
  const pids = lsof(['-nP', `-iTCP:${porta}`, '-sTCP:LISTEN', '-t']).split('\n').filter(Boolean);
  const pastas = pids
    .map(pid => lsof(['-a', '-p', pid, '-d', 'cwd', '-Fn']).split('\n').find(l => l.startsWith('n'))?.slice(1))
    .filter(Boolean);
  const raiz = real(esperado);
  const ok = pastas.length > 0 && pastas.every(p => real(p) === raiz || real(p).startsWith(raiz + path.sep));
  return {
    url,
    pids,
    pastas,
    ok,
    motivo: ok
      ? null
      : pastas.length
        ? `${url} é servido de ${pastas.join(', ')}, fora de ${path.basename(esperado)}`
        : `não deu para saber quem escuta em ${url} (lsof)`,
  };
}
const servidores = () => ({
  ...(precisaDeDev ? { catalogo: quemServe(BASE_URL, RAIZ) } : {}),
  ...(precisaDoStarter ? { starter: quemServe(STARTER_URL, FASTSTORE_STARTER) } : {}),
});

const inicio = { repos: estadoDosRepos(), servidores: servidores() };

const t0 = Date.now();
const feitos = [];
for (const arquivo of estagios) {
  // spawn assíncrono e não `spawnSync` com pipe: a saída precisa aparecer AO
  // VIVO (o build do tema no estágio 4 leva minutos sem imprimir nada, e um
  // terminal mudo por 8 minutos parece travado) e ao mesmo tempo ser capturada
  // para o placar. Transmite e acumula.
  let saida = '';
  const status = await new Promise(resolve => {
    const filho = spawn(process.execPath, [path.join(AQUI, arquivo)], {
      stdio: ['inherit', 'pipe', 'inherit'],
    });
    filho.stdout.on('data', pedaco => {
      saida += pedaco;
      process.stdout.write(pedaco);
    });
    filho.on('close', codigo => resolve(codigo));
  });
  const r = { status };
  // `N/M passam` é a forma que o `relatorio()` imprime; os estágios que usam
  // outra (o de render) trazem `N/M renderizam limpos`.
  const placares = [...saida.matchAll(/(\d+)\/(\d+) (?:passam|renderizam)/g)];
  const passam = placares.reduce((n, m) => n + Number(m[1]), 0);
  const total = placares.reduce((n, m) => n + Number(m[2]), 0);
  feitos.push({ arquivo, ok: r.status === 0, passam, total });
  if (r.status !== 0) {
    console.error(
      `\n💥 ${arquivo} falhou (exit ${r.status}). Os estágios seguintes dependem dele.`
    );
    break;
  }
}

const okAll = feitos.every(f => f.ok) && feitos.length === estagios.length;
const segundos = Math.round((Date.now() - t0) / 1000);
const asserçõesOk = feitos.reduce((n, f) => n + f.passam, 0);
const asserções = feitos.reduce((n, f) => n + f.total, 0);

console.log(
  `\n${okAll ? '✅' : '❌'} ${feitos.filter(f => f.ok).length}/${estagios.length} estágios ` +
    `· ${asserçõesOk}/${asserções} asserções · ${segundos}s`
);

// Só uma execução COMPLETA vira evidência. Rodar `yarn funil 2-edicao` não pode
// carimbar o conjunto — seria o mesmo que provar o todo olhando uma parte.
if (completa) {
  const fim = { repos: estadoDosRepos(), servidores: servidores() };
  // Por que esta execução não prova o código de agora, se não prova.
  const motivos = [];
  for (const repo of REPOS) {
    const a = inicio.repos[repo];
    const b = fim.repos[repo];
    if (!a.commit) motivos.push(`${repo}: não é um checkout git`);
    else if (a.commit !== b.commit)
      motivos.push(`${repo} mudou de commit durante a execução (${a.commit.slice(0, 7)} → ${b.commit?.slice(0, 7)})`);
    const sujos = [...new Set([...a.sujo, ...b.sujo])];
    if (sujos.length)
      motivos.push(
        `${repo} com ${sujos.length} arquivo(s) fora do commit: ${sujos.slice(0, 4).map(l => l.trim()).join(', ')}${sujos.length > 4 ? ', …' : ''}`
      );
  }
  for (const k of DESVIAM) if (process.env[k]) motivos.push(`${k}=${process.env[k]}`);
  for (const [nome, s] of Object.entries(inicio.servidores)) {
    if (!s.ok) motivos.push(`servidor ${nome}: ${s.motivo}`);
    if (!fim.servidores[nome]?.ok)
      motivos.push(`servidor ${nome} no fim da execução: ${fim.servidores[nome]?.motivo}`);
  }
  const destino = path.join(SAIDA, 'resultado.json');
  writeFileSync(
    destino,
    JSON.stringify(
      {
        quando: new Date().toISOString(),
        ok: okAll,
        // `evidencia`: mediu ESTE código — commit sem nada fora dele nos 4 repos,
        // do início ao fim, sem variável desviando, servidores deste checkout.
        evidencia: motivos.length === 0,
        motivos,
        estagios: feitos,
        asserções: { ok: asserçõesOk, total: asserções },
        segundos,
        // O commit de cada repo no início; o preflight compara com os de agora.
        commits: Object.fromEntries(REPOS.map(r => [r, inicio.repos[r].commit])),
        ambiente: Object.fromEntries(
          [...DESVIAM, 'FUNIL_BASE_URL', 'FUNIL_STARTER_URL', 'CHROME_PATH']
            .filter(k => process.env[k] !== undefined)
            .map(k => [k, process.env[k]])
        ),
        inicio,
        fim,
      },
      null,
      2
    )
  );
  console.log(`   registrado em ${path.relative(RAIZ, destino)}`);
  if (motivos.length) {
    console.log('   ⚠️  não vale como evidência para o cutover:');
    for (const m of motivos) console.log(`      · ${m}`);
  }
}

process.exit(okAll ? 0 : 1);
