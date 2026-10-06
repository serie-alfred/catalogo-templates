/**
 * O que o `yarn checkout:sync` e os estágios de checkout do funil precisam
 * concordar: onde cada coisa vendorizada mora e como achar, no checkout-vtex, a
 * lista do que o repo público nunca pode conter (ver abaixo). Módulo sem efeito
 * colateral (não cria `.funil/`, não lê nada no import), porque o sync, o
 * `contrato.mjs` e o 2-checkout o importam.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(fileURLToPath(import.meta.url), '../../../..');
export const MODELO = 'Checkout01';
export const VIEWPORTS = [1280, 390];

/** O repo do checkout-vtex lido pelo sync: irmão do catálogo, ou o que a env apontar. */
export const CHECKOUT_VTEX = path.resolve(
  process.env.CHECKOUT_VTEX_DIR ?? path.join(RAIZ, '..', 'checkout-vtex')
);

export const DEST = {
  lib: path.join(RAIZ, 'src/lib/checkout'),
  data: path.join(RAIZ, 'src/data/checkout'),
  modelo: path.join(RAIZ, 'src/data/checkout', MODELO, 'checkout.json'),
  version: path.join(RAIZ, 'src/data/checkout/VERSION.json'),
  public: path.join(RAIZ, 'public/gerador/checkout', MODELO),
};

/** URL pública de um arquivo do modelo (o que o CheckoutFrame carrega). */
export const urlDoModelo = arquivo => `/gerador/checkout/${MODELO}/${arquivo}`;
export const nomeDaFixture = (etapa, vp) => `${etapa}.${vp}.html`;
/**
 * O iframe do cartão da fixture real (`fixtures/<etapa>/<vp>/card.html` no
 * checkout-vtex). O público é achatado — a fixture pede a base por caminho
 * relativo, `checkout6-custom.css` —, então cada vp ganha um nome próprio e o
 * `src` do iframe é reescrito pelo sync.
 */
export const nomeDoCartao = (etapa, vp) => `${etapa}.${vp}.card.html`;

/*
 * A LISTA do que o repo público não pode receber (gate0 #29) NÃO mora no
 * catálogo — nem cópia, nem vendorizada: ela é exatamente o conjunto de termos
 * que o catálogo não pode conter. A canônica fica no checkout-vtex (privado),
 * fora do `lib/` que o sync vendoriza, e é lida de lá EM MEMÓRIA: o texto do
 * arquivo (`git show <sha>:<caminho>` ou, sem o commit, o working tree) vira um
 * módulo por `data:` URL, sem passar pelo disco. O catálogo confere o que
 * vendorizou por HASH contra o VERSION.json; a lista só roda quando o
 * checkout-vtex está ao lado (o `checkout:sync` exige; o `1-checkout` avisa).
 *
 * O caminho não é escrito aqui: a pasta onde a lista mora é um dos termos dela.
 * O arquivo é achado pela regra "o único `publico.mjs` da árvore fora do
 * `lib/`" — zero ou mais de um reprova, e `lib/publico.mjs` (o lugar antigo,
 * vendorizável) também. Pelo mesmo motivo nenhuma mensagem imprime o caminho.
 */

/** Na lista de arquivos de uma árvore do checkout-vtex, o caminho da lista (ou lança). */
export function caminhoDaLista(arquivos) {
  const nomes = arquivos.map(a => a.split(path.sep).join('/'));
  if (nomes.includes('lib/publico.mjs'))
    throw new Error(
      'a árvore tem lib/publico.mjs: o lib/ é vendorizado inteiro no catálogo PÚBLICO, e a lista não pode ir junto (gate0 #29) — use um SHA em que ela mora fora do lib/'
    );
  const achados = nomes.filter(
    a => a.split('/').pop() === 'publico.mjs' && !a.startsWith('lib/') && !a.split('/').includes('node_modules')
  );
  if (achados.length !== 1)
    throw new Error(
      achados.length === 0
        ? 'nenhum publico.mjs fora do lib/: sem a lista do repo público não há trava (gate0 #29)'
        : `${achados.length} arquivos publico.mjs fora do lib/ — a lista tem de ser uma só`
    );
  return achados[0];
}

/** O texto da lista → o módulo, em memória (data: URL), com a API conferida. */
export async function importarLista(fonte, onde) {
  const m = await import(`data:text/javascript;base64,${Buffer.from(fonte).toString('base64')}`);
  const ok =
    Array.isArray(m.PROIBIDOS) &&
    m.PROIBIDOS.length > 0 &&
    m.PROIBIDOS.every(re => re instanceof RegExp) &&
    Array.isArray(m.TROCAS) &&
    typeof m.sobrasProibidas === 'function';
  if (!ok) throw new Error(`${onde} não exporta PROIBIDOS (RegExp[] não vazio), TROCAS e sobrasProibidas`);
  return m;
}

/**
 * A lista de um COMMIT do checkout-vtex (o que o `checkout:sync` usa: a do
 * próprio SHA que vendoriza). → `{ publico, caminho }`; lança se o SHA não a tiver.
 */
export async function listaDoSha(repo, sha) {
  const git = (...a) =>
    execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
  const caminho = caminhoDaLista(git('ls-tree', '-r', '--name-only', sha).split('\n').filter(Boolean));
  return { publico: await importarLista(git('show', `${sha}:${caminho}`), `a lista do SHA ${sha.slice(0, 12)}`), caminho };
}

/**
 * A lista do WORKING TREE do checkout-vtex (o real não tem commit): os arquivos
 * que o git enxerga, rastreados ou não, respeitando o .gitignore.
 */
export async function listaDoWorkingTree(repo) {
  const arquivos = execFileSync('git', ['-C', repo, 'ls-files', '-co', '--exclude-standard'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
    .split('\n')
    .filter(Boolean);
  const caminho = caminhoDaLista(arquivos);
  return { publico: await importarLista(fs.readFileSync(path.join(repo, caminho), 'utf8'), 'a lista do working tree'), caminho };
}
