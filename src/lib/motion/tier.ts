/**
 * Quanto movimento o aparelho aguenta, em três faixas, gravadas em
 * `<html data-tier>` para o CSS decidir o que liga:
 *
 *   - `alto`  — tudo: rolagem suave, órbita girando, loja flutuando em 3D, granulado.
 *   - `medio` — o mesmo, sem o granulado (o `mix-blend-mode` em tela cheia é o
 *               que mais pesa na composição).
 *   - `baixo` — sem órbita nem rolagem suave; só as trocas de template e fades.
 *
 * O que o navegador declara só serve para achar o aparelho claramente fraco
 * (GPU por software, 2 núcleos, 2 GB): `hardwareConcurrency` vem capado em 4
 * ou 8 em vários navegadores e não separa máquina boa de ruim. Quem decide o
 * resto é uma amostra de quadros reais, tirada DEPOIS do carregamento — no
 * primeiro segundo fontes, imagens e hidratação derrubam qualquer aparelho.
 * Movimento reduzido no sistema é sempre `baixo`; `?tier=alto|medio|baixo` força.
 */
export type Tier = 'alto' | 'medio' | 'baixo';

const TIERS: Tier[] = ['alto', 'medio', 'baixo'];

type NavegadorComMemoria = Navigator & { deviceMemory?: number };

function gpuPorSoftware(): boolean {
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

/** `?tier=` da URL, para testar uma faixa à mão. */
export function tierForcado(): Tier | null {
  const v = new URLSearchParams(location.search).get('tier');
  return v && (TIERS as string[]).includes(v) ? (v as Tier) : null;
}

/** A faixa pelo que o navegador declara, sem medir nada. */
export function tierDeclarado(): Tier {
  const forcado = tierForcado();
  if (forcado) return forcado;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'baixo';
  const nucleos = navigator.hardwareConcurrency || 4;
  const memoria = (navigator as NavegadorComMemoria).deviceMemory ?? 8;
  if (gpuPorSoftware() || nucleos <= 2 || memoria <= 2) return 'baixo';
  return 'alto';
}

/** Espera a página assentar: `load` e mais um respiro ocioso. */
export function depoisDoCarregamento(): Promise<void> {
  return new Promise(resolve => {
    const respiro = () => setTimeout(resolve, 1200);
    if (document.readyState === 'complete') respiro();
    else window.addEventListener('load', respiro, { once: true });
  });
}

/**
 * Mede ~60 quadros e devolve a faixa que o aparelho sustenta: média acima de
 * 26 ms (menos de ~38 fps) desce para `medio`, acima de 42 ms para `baixo`.
 * Com a aba escondida o navegador segura os quadros: não conta.
 */
export function medirQuadros(): Promise<Tier | null> {
  return new Promise(resolve => {
    if (document.visibilityState !== 'visible') return resolve(null);
    const tempos: number[] = [];
    let anterior = 0;
    const passo = (t: number) => {
      if (anterior) tempos.push(t - anterior);
      anterior = t;
      if (tempos.length < 60) return requestAnimationFrame(passo);
      if (document.visibilityState !== 'visible') return resolve(null);
      const ordenados = [...tempos].sort((a, b) => a - b);
      // Mediana, não média: um GC ou um decode de imagem não rebaixa ninguém.
      const mediana = ordenados[Math.floor(ordenados.length / 2)];
      resolve(mediana > 42 ? 'baixo' : mediana > 26 ? 'medio' : null);
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
}
