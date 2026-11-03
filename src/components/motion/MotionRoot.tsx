'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

import {
  aplicarTier,
  medirQuadros,
  pior,
  tierDeclarado,
  type Tier,
} from '@/lib/motion/tier';

/**
 * Liga o sistema de movimento do site: decide a faixa (`lib/motion/tier.ts`) e,
 * fora da faixa baixa, a rolagem suave do Lenis. O Lenis anima o scroll nativo
 * da janela, então `position: sticky` e as `animation-timeline: view()` do CSS
 * continuam valendo.
 */
export default function MotionRoot() {
  useEffect(() => {
    let tier: Tier = tierDeclarado();
    aplicarTier(tier);

    let lenis: Lenis | null = null;
    let raf = 0;
    const ligarLenis = () => {
      if (lenis || tier === 'baixo') return;
      // allowNestedScroll: a arara rola na horizontal; sem isso o Lenis
      // engole o gesto de trackpad e rola a página.
      lenis = new Lenis({ lerp: 0.11, anchors: true, allowNestedScroll: true });
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const desligarLenis = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
    ligarLenis();

    let vivo = true;
    medirQuadros().then(medido => {
      if (!vivo) return;
      const novo = pior(tier, medido);
      if (novo === tier) return;
      tier = novo;
      aplicarTier(tier);
      if (tier === 'baixo') desligarLenis();
    });

    const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
    const aoMudar = () => {
      tier = reduzir.matches ? 'baixo' : tierDeclarado();
      aplicarTier(tier);
      if (tier === 'baixo') desligarLenis();
      else ligarLenis();
    };
    reduzir.addEventListener('change', aoMudar);

    return () => {
      vivo = false;
      reduzir.removeEventListener('change', aoMudar);
      desligarLenis();
    };
  }, []);

  return null;
}
