'use client';

import React, { useCallback } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { useCheckoutPreview } from '@/hooks/useCheckoutPreview';
import type { CaixaDoFrame } from '@/hooks/useCanvasZoom';

import CheckoutFrame from '.';

/**
 * O CheckoutFrame alimentado pelo estado do editor. O componente em si é
 * dirigido por props para o /p/{id}/checkout reusar o mesmo, sem
 * `useLayoutGenerator` (que hidrataria o localStorage do autor).
 */
export default function EditorCheckoutFrame({ caixa }: { caixa: CaixaDoFrame }) {
  const {
    checkout,
    isMobileView,
    logoCheckout,
    logoCheckoutPendente,
    undo,
    redo,
    setCheckoutEtapa,
  } = useLayout();
  const { level2, level1 } = useCheckoutPreview();

  const onAtalho = useCallback(
    (acao: 'undo' | 'redo') => (acao === 'undo' ? undo() : redo()),
    [undo, redo]
  );

  return (
    <CheckoutFrame
      etapa={checkout.etapa}
      mobile={isMobileView}
      level2={level2}
      level1={level1}
      logo={logoCheckout}
      logoPendente={logoCheckoutPendente}
      caixa={caixa}
      onAtalho={onAtalho}
      onNavegar={setCheckoutEtapa}
    />
  );
}
