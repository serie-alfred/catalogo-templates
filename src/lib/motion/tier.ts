/**
 * Quanto movimento o aparelho aguenta, em três faixas, gravadas em
 * `<html data-tier>` para o CSS decidir o que liga:
 *
 *   - `alto`  — tudo: rolagem suave, órbita girando, loja flutuando em 3D, granulado.
 *   - `medio` — rolagem suave e transições, sem o que fica rodando o tempo todo.
 *   - `baixo` — só as trocas de template e fades curtos.
 *
 * A primeira leitura é do que o navegador diz (núcleos, memória, GPU); depois
 * uma amostra de quadros reais rebaixa quem prometeu e não entregou. Movimento
 * reduzido no sistema é sempre `baixo`. `?tier=alto|medio|baixo` força, para
 * testar.
 */
export type Tier = 'alto' | 'medio' | 'baixo';

const TIERS: Tier[] = ['alto', 'medio', 'baixo'];
const CHAVE = 'etemas-tier';

type NavegadorComMemoria = Navigator & { deviceMemory?: number };

function gpuFraca(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const nome = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
      : '';
    return /swiftshader|llvmpipe|software|basic render/i.test(nome);
  } catch {
    return true;
  }
}

/** A faixa pelo que o navegador declara, sem medir nada. */
export function tierDeclarado(): Tier {
  const forcado = new URLSearchParams(location.search).get('tier');
  if (forcado && (TIERS as string[]).includes(forcado)) return forcado as Tier;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'baixo';
  try {
    const salvo = sessionStorage.getItem(CHAVE);
    if (salvo && (TIERS as string[]).includes(salvo)) return salvo as Tier;
  } catch {
    // sessionStorage bloqueado: segue pela leitura.
  }
  const nucleos = navigator.hardwareConcurrency || 4;
  const memoria = (navigator as NavegadorComMemoria).deviceMemory ?? 8;
  if (gpuFraca() || nucleos <= 2 || memoria <= 2) return 'baixo';
  if (nucleos <= 4 || memoria <= 4) return 'medio';
  return 'alto';
}

/**
 * Mede ~45 quadros e devolve a faixa que o aparelho de fato sustenta: média
 * acima de 22 ms (menos de ~45 fps) desce um degrau, acima de 34 ms desce dois.
 */
export function medirQuadros(): Promise<Tier | null> {
  return new Promise(resolve => {
    const tempos: number[] = [];
    let anterior = 0;
    const passo = (t: number) => {
      if (anterior) tempos.push(t - anterior);
      anterior = t;
      if (tempos.length < 45) return requestAnimationFrame(passo);
      // O primeiro terço inclui a hidratação: descarta.
      const uteis = tempos.slice(15);
      const media = uteis.reduce((a, b) => a + b, 0) / uteis.length;
      resolve(media > 34 ? 'baixo' : media > 22 ? 'medio' : null);
    };
    requestAnimationFrame(passo);
  });
}

/** O pior dos dois: medir só rebaixa, nunca promove. */
export function pior(a: Tier, b: Tier | null): Tier {
  if (!b) return a;
  return TIERS.indexOf(b) > TIERS.indexOf(a) ? b : a;
}

export function aplicarTier(t: Tier) {
  document.documentElement.dataset.tier = t;
  try {
    sessionStorage.setItem(CHAVE, t);
  } catch {
    // sem persistência, mede de novo na próxima página.
  }
}
