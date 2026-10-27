'use client';

import React, { useEffect } from 'react';
import SeededStorefront from '@/components/preview/SeededStorefront';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';

/**
 * A loja do template, só para ver. O `isMobile` dos templates sai da largura
 * DESTE documento: na moldura Mobile da barra ele tem 375px, como o canvas do
 * editor na visão mobile.
 *
 * Link e formulário não saem do lugar. Os templates são réplicas com `href` de
 * mock (`/`, `/account`, `/<produto>/p`, domínios de exemplo): seguir um deles
 * carregaria a home do E-temas, um 404 ou outro site dentro da moldura, e o
 * "Cadastrar" da newsletter recarregaria a página. As travas rodam em captura
 * e só cancelam a ação PADRÃO — o handler do template (carrossel, drawer, aba)
 * roda igual, como no canvas do editor.
 */
export default function FrameClient(props: {
  selections: LayoutSelection[];
  colors: FrameColors;
  fonts: FrameFonts;
  pagina: string;
}) {
  const isMobile = useIsMobile();

  useEffect(() => {
    const clique = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a[href]')) {
        e.preventDefault();
      }
    };
    const envio = (e: Event) => e.preventDefault();
    document.addEventListener('click', clique, true);
    document.addEventListener('submit', envio, true);
    return () => {
      document.removeEventListener('click', clique, true);
      document.removeEventListener('submit', envio, true);
    };
  }, []);

  return <SeededStorefront {...props} logo="" isMobile={isMobile} />;
}
