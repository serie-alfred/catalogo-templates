'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import ThemeRenderer from '@/components/preview/ThemeRenderer';

/**
 * Canvas desktop do editor: o tema renderizado do mesmo jeito que em /p —
 * carrosséis arrastáveis, hovers, megamenus e cliques funcionando — mais a
 * delegação de eventos que neutraliza a navegação e sincroniza hover/seleção
 * com o painel de seções.
 *
 * Não há drag-and-drop aqui de propósito: reordenar acontece no SectionsPanel.
 * Foi o dnd no canvas que obrigava o `pointer-events: none` do antigo
 * SortableItem e deixava os templates inertes.
 */
export default function ThemeCanvas() {
  const {
    selections,
    selectedPage,
    canvasRef,
    selectedUid,
    setSelectedUid,
    setHoveredUid,
  } = useLayout();

  useCanvasInteractions(canvasRef, {
    onSelect: setSelectedUid,
    onHover: setHoveredUid,
    onEscape: () => setSelectedUid(null),
  });

  return (
    <div ref={canvasRef} className="editor-canvas">
      <ThemeRenderer
        selections={selections}
        pagina={selectedPage}
        isMobile={false}
        selectedUid={selectedUid}
      />
    </div>
  );
}
