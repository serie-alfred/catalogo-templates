'use client';

import React, { useEffect } from 'react';
import type { PreviewSnapshot } from '@/lib/previewStore';
import PreviewNav from '../PreviewNav';
import SeededStorefront from '../SeededStorefront';
import { snapshotTemCheckout } from '@/utils/checkout';

interface SharedPreviewProps {
  snapshot: PreviewSnapshot;
  /** Página interna a renderizar: "home" | "category" | "product". */
  pagina: string;
  /** ID do preview e slug da URL atual (para o balão de navegação). */
  id: string;
  activeSlug: string;
}

export default function SharedPreview({
  snapshot,
  pagina,
  id,
  activeSlug,
}: SharedPreviewProps) {
  // Favicon do tema. As fontes ficam com o SeededStorefront.
  useEffect(() => {
    if (!snapshot.favicon) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = snapshot.favicon;
  }, [snapshot.favicon]);

  return (
    <>
      <SeededStorefront
        selections={snapshot.selections}
        colors={snapshot.colors}
        fonts={snapshot.fonts}
        logo={snapshot.logo}
        pagina={pagina}
      />
      <PreviewNav
        id={id}
        activeSlug={activeSlug}
        temCheckout={snapshotTemCheckout(snapshot)}
        lp={snapshot.lp ? { nome: snapshot.lp.nome } : undefined}
        rev={snapshot.rev}
      />
    </>
  );
}
