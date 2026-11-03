'use client';

import { useEffect } from 'react';

import { rastrear, type Evento } from '@/lib/tracking';

/**
 * Rastreia cliques em qualquer elemento com `data-rastrear="<evento>"` (e
 * `data-rastrear-template` opcional), para que seções do servidor — a arara —
 * mandem evento sem virar client component.
 */
export default function RastrearCliques() {
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as Element | null)?.closest<HTMLElement>(
        '[data-rastrear]'
      );
      if (!alvo) return;
      rastrear(alvo.dataset.rastrear as Evento, {
        template: alvo.dataset.rastrearTemplate,
      });
    };
    document.addEventListener('click', aoClicar, true);
    return () => document.removeEventListener('click', aoClicar, true);
  }, []);
  return null;
}
