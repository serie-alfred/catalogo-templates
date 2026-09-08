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
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL } from './lib/util.mjs';

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

const t0 = Date.now();
const feitos = [];
for (const arquivo of estagios) {
  const r = spawnSync(process.execPath, [path.join(AQUI, arquivo)], {
    stdio: 'inherit',
  });
  feitos.push({ arquivo, ok: r.status === 0 });
  if (r.status !== 0) {
    console.error(
      `\n💥 ${arquivo} falhou (exit ${r.status}). Os estágios seguintes dependem dele.`
    );
    break;
  }
}

const okAll = feitos.every(f => f.ok) && feitos.length === estagios.length;
console.log(
  `\n${okAll ? '✅' : '❌'} ${feitos.filter(f => f.ok).length}/${estagios.length} estágios ` +
    `em ${Math.round((Date.now() - t0) / 1000)}s`
);
process.exit(okAll ? 0 : 1);
