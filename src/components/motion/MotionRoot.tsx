'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

import {
  aplicarTier,
  depoisDoCarregamento,
  medirQuadros,
  pior,
  tierDeclarado,
  tierForcado,
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
    const medir = async () => {
      if (tierForcado()) return;
      await depoisDoCarregamento();
      // A intro da primeira visita também pesa: mede depois dela.
      while (vivo && document.documentElement.dataset.intro === 'rodando') {
        await new Promise(r => setTimeout(r, 300));
      }
      const medido = vivo ? await medirQuadros() : null;
      if (!vivo) return;
      const novo = pior(tier, medido);
      if (novo === tier) return;
      tier = novo;
      aplicarTier(tier);
      if (tier === 'baixo') desligarLenis();
    };
    medir();

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
