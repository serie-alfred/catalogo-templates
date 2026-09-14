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
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL, SAIDA, RAIZ } from './lib/util.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const filtros = process.argv.slice(2);

const estagios = readdirSync(AQUI)
  .filter(f => /^\d.*\.mjs$/.test(f))
  .sort()
  .filter(f => !filtros.length || filtros.some(q => f.startsWith(q)));

if (!estagios.length) {
  console.error(`Nenhum estágio casa com ${JSON.stringify(filtros)}.`);
  process.exit(1);
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
if (estagios.some(f => f.startsWith('2-fidelidade'))) {
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
 * O commit de cada um dos 4 repos no momento da execução.
 *
 * É o que transforma "o funil passou" em evidência: um verde sobre código que
 * mudou depois não prova nada, e sem registrar contra o quê ele passou não há
 * como saber. O preflight do cutover compara estes hashes com os de agora.
 */
const REPOS = [
  'faststore.starter',
  'catalogo-templates',
  'produtos-template-generator',
  'global-templates',
];
const commits = {};
for (const repo of REPOS) {
  try {
    commits[repo] = execFileSync(
      'git',
      ['-C', path.join(RAIZ, '..', repo), 'rev-parse', 'HEAD'],
      { encoding: 'utf8' }
    ).trim();
  } catch {
    commits[repo] = null;
  }
}

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
if (!filtros.length) {
  const destino = path.join(SAIDA, 'resultado.json');
  writeFileSync(
    destino,
    JSON.stringify(
      {
        quando: new Date().toISOString(),
        ok: okAll,
        estagios: feitos,
        asserções: { ok: asserçõesOk, total: asserções },
        segundos,
        commits,
      },
      null,
      2
    )
  );
  console.log(`   registrado em ${path.relative(RAIZ, destino)}`);
}

process.exit(okAll ? 0 : 1);
