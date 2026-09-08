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
