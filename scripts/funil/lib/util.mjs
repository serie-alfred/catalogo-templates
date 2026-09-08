import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(fileURLToPath(import.meta.url), '../../../..');
/** A pasta e-temas agrega os 4 repos lado a lado; o funil cruza os quatro. */
export const E_TEMAS = path.resolve(RAIZ, '..');
export const GLOBAL_TEMPLATES = path.join(E_TEMAS, 'global-templates');
export const FASTSTORE_STARTER = path.join(E_TEMAS, 'faststore.starter');
export const GENERATOR = path.join(E_TEMAS, 'produtos-template-generator');

export const BASE_URL = process.env.FUNIL_BASE_URL ?? 'http://localhost:5503';

/** Tudo que o funil produz (capturas, configs) cai aqui — pasta ignorada. */
export const SAIDA = path.join(RAIZ, '.funil');
fs.mkdirSync(SAIDA, { recursive: true });

/** Mesma resolução do harness de fidelidade do faststore.starter. */
export function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    path.join(
      os.homedir(),
      'AppData',
      'Local',
      'Google',
      'Chrome',
      'Application',
      'chrome.exe'
    ),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  throw new Error('Chrome não encontrado. Defina CHROME_PATH.');
}

/**
 * Lê o LAYOUTS de verdade, desserializado — não por regex.
 *
 * `layoutData.ts` só importa tipos, então o type-stripping nativo do Node dá
 * conta sem bundler e sem resolver o alias `@/`. Um subprocesso porque o
 * stripping vale para o arquivo carregado, não para este.
 */
export function lerLayouts() {
  const script =
    `import {LAYOUTS} from ${JSON.stringify(path.join(RAIZ, 'src/data/layoutData.ts'))};` +
    `process.stdout.write(JSON.stringify(LAYOUTS));`;
  const out = execFileSync(
    process.execPath,
    ['--experimental-strip-types', '--input-type=module', '--eval', script],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024,
    }
  );
  return JSON.parse(out);
}

/** Todo item do catálogo, achatado, com a layoutKey junto. */
export function itens(layouts = lerLayouts()) {
  return Object.entries(layouts).flatMap(([layoutKey, secao]) =>
    secao.items.map(item => ({ ...item, layoutKey, secao: secao.name }))
  );
}

export const espera = ms => new Promise(r => setTimeout(r, ms));

/** Coletor de asserções: imprime na hora e devolve o exit code no fim. */
export function relatorio(titulo) {
  const linhas = [];
  console.log(`\n━━ ${titulo}`);
  return {
    ok(nome, condicao, detalhe = '') {
      const passou = !!condicao;
      linhas.push({ nome, passou, detalhe: String(detalhe) });
      console.log(
        `  ${passou ? '✅' : '❌'} ${nome}${passou || !detalhe ? '' : `  → ${detalhe}`}`
      );
      return passou;
    },
    fechar() {
      const falhas = linhas.filter(l => !l.passou);
      console.log(`  ${linhas.length - falhas.length}/${linhas.length} passam`);
      return falhas.length === 0;
    },
  };
}
