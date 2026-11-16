import { useEffect, useState, type RefObject } from 'react';

/**
 * Distância, em pixels inteiros, de um ciclo de uma fita em marquee: a largura dela dividida
 * por `divisor` (2 quando a animação anda meia fita; o número de voltas quando anda uma).
 *
 * Com ela o CSS troca a animação por `steps(<px>)`, um passo por pixel. A ~40–45px/s a fita
 * andava frações de pixel por quadro: o texto é desenhado em pixel inteiro e os ícones (SVG)
 * não, então os ícones mudavam de contorno a cada quadro e tremiam em relação ao texto. O
 * mesmo vale na Wake (sa-app.js/sa-home.js do header 13, header 14 e régua 14).
 *
 * Devolve `null` até medir (e sem `ResizeObserver` só mede uma vez); o ResizeObserver remede
 * quando a fonte carrega ou a largura muda.
 */
export function useFitaEmPixels(
  ref: RefObject<HTMLElement | null>,
  divisor: number
): number | null {
  const [px, setPx] = useState<number | null>(null);

  useEffect(() => {
    const fita = ref.current;
    if (!fita || !(divisor > 0)) return;
    const medir = () => {
      const valor = Math.round(fita.offsetWidth / divisor);
      setPx(valor >= 1 ? valor : null);
    };
    medir();
    if (typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(medir);
    observador.observe(fita);
    return () => observador.disconnect();
  }, [ref, divisor]);

  return px;
}
