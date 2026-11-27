import { useEffect, useState, type CSSProperties, type RefObject } from 'react';

/**
 * Faz uma fita em marquee andar em pixels inteiros DA TELA. Devolve as variáveis que o CSS lê
 * (`--fita-px`, a distância de um ciclo em px de CSS, e `--fita-passos`, quantos pixels da
 * tela ela cobre), ou `null` até medir.
 *
 * Com elas o CSS troca a animação por `steps(var(--fita-passos))`. A ~40–45px/s a fita andava
 * frações de pixel por quadro: o texto é desenhado em pixel inteiro e os ícones (SVG) não,
 * então os ícones mudavam de contorno a cada quadro e tremiam em relação ao texto. O mesmo vale
 * na Wake (sa-app.js/sa-home.js do header 13, header 14 e régua 14).
 *
 * Um passo por pixel de CSS não basta fora de 100%: no canvas do editor o iframe é escalado
 * (`transform: scale()` no PreviewFrame, 0,26 num notebook; medido aqui pela largura do
 * <iframe> na tela ÷ a de layout, com `--frame-escala` de reserva) e no Windows a tela costuma estar a 125% ou 150%
 * (`devicePixelRatio`). Aí 1px de CSS cai em 0,55 ou 1,25 pixel da tela, e o ícone volta a
 * tremer. Por isso o número de passos é a distância × escala × devicePixelRatio: cada passo
 * anda exatamente um pixel da tela.
 *
 * `divisor`: 2 quando a animação anda meia fita; o número de voltas quando anda uma. Remede
 * quando a fonte carrega ou a largura muda (ResizeObserver), quando o zoom do canvas muda
 * (atributo style do <html>) e quando a janela troca de tela ou de zoom (devicePixelRatio).
 */
export function useFitaEmPixels(
  ref: RefObject<HTMLElement | null>,
  divisor: number
): CSSProperties | null {
  const [medida, setMedida] = useState<{ px: number; passos: number } | null>(null);

  useEffect(() => {
    const fita = ref.current;
    if (!fita || !(divisor > 0)) return;
    const doc = fita.ownerDocument;
    const janela = doc.defaultView ?? window;

    // O <iframe> do canvas (mesma origem), quando a fita está dentro de um.
    let moldura: HTMLElement | null = null;
    try {
      moldura = (janela.frameElement as HTMLElement | null) ?? null;
    } catch {
      moldura = null;
    }
    const escalaDaMoldura = () => {
      if (moldura && moldura.offsetWidth > 0) {
        const tela = moldura.getBoundingClientRect().width;
        if (tela > 0) return tela / moldura.offsetWidth;
      }
      return parseFloat(janela.getComputedStyle(doc.documentElement).getPropertyValue('--frame-escala')) || 1;
    };

    const medir = () => {
      const px = Math.round(fita.offsetWidth / divisor);
      if (!(px >= 1)) return setMedida(null);
      const escala = escalaDaMoldura();
      const passos = Math.max(1, Math.round(px * escala * (janela.devicePixelRatio || 1)));
      setMedida(antes => (antes && antes.px === px && antes.passos === passos ? antes : { px, passos }));
    };
    medir();

    const limpar: Array<() => void> = [];
    if (typeof ResizeObserver !== 'undefined') {
      const observador = new ResizeObserver(medir);
      observador.observe(fita);
      limpar.push(() => observador.disconnect());
    }
    // O zoom do canvas chega como --frame-escala no style do <html> do iframe.
    const zoom = new MutationObserver(medir);
    zoom.observe(doc.documentElement, { attributes: true, attributeFilter: ['style'] });
    limpar.push(() => zoom.disconnect());
    // No editor, o zoom é um transform: scale() num ancestral do <iframe>, no documento do
    // editor: muda por style/class lá, ou com a janela do editor.
    if (moldura?.parentElement) {
      const pai = moldura.ownerDocument;
      const escalaDoPai = new MutationObserver(medir);
      escalaDoPai.observe(pai.body, { attributes: true, attributeFilter: ['style', 'class'], subtree: true });
      const janelaDoPai = pai.defaultView;
      janelaDoPai?.addEventListener('resize', medir);
      limpar.push(() => {
        escalaDoPai.disconnect();
        janelaDoPai?.removeEventListener('resize', medir);
      });
    }
    // devicePixelRatio: a media query vale só para o valor atual, então é refeita a cada troca.
    let consulta: MediaQueryList | null = null;
    const aoTrocarTela = () => {
      consulta?.removeEventListener('change', aoTrocarTela);
      medir();
      consulta = janela.matchMedia(`(resolution: ${janela.devicePixelRatio || 1}dppx)`);
      consulta.addEventListener('change', aoTrocarTela);
    };
    consulta = janela.matchMedia(`(resolution: ${janela.devicePixelRatio || 1}dppx)`);
    consulta.addEventListener('change', aoTrocarTela);
    limpar.push(() => consulta?.removeEventListener('change', aoTrocarTela));

    return () => limpar.forEach(f => f());
  }, [ref, divisor]);

  return medida
    ? ({ '--fita-px': medida.px, '--fita-passos': medida.passos } as CSSProperties)
    : null;
}
