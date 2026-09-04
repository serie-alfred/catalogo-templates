'use client';

import React from 'react';
import { LAYOUTS } from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { selectionsForPage } from '@/utils/previewRender';

interface ThemeRendererProps {
  selections: LayoutSelection[];
  /** Página interna a renderizar: "home" | "category" | "product". */
  pagina: string;
  /** Repassado a cada template. */
  isMobile?: boolean;
  /** Header fixo ao rolar. Desligado no palco de export — o html2canvas
   *  renderiza `position: sticky` de forma imprevisível. */
  stickyHeader?: boolean;
  /** uid da seção destacada como selecionada (só o editor usa). */
  selectedUid?: string | null;
}

/**
 * Renderiza, empilhados, os componentes selecionados para uma página.
 *
 * Renderer ÚNICO do projeto: serve o preview compartilhado (/p), o canvas do
 * editor (/gerador), o iframe da visão mobile e o palco off-screen do export.
 * Os wrappers são `div`s nus de propósito — nada de `overflow`, `transform` ou
 * `will-change` aqui, senão os megamenus seriam recortados e os drawers
 * `position: fixed` dos Headers ficariam presos à caixa da seção.
 *
 * Os `data-section-*` são inertes em /p; no editor eles alimentam a delegação
 * de eventos (useCanvasInteractions) e o contorno de hover/seleção (editor-canvas.css).
 */
function ThemeRenderer({
  selections,
  pagina,
  isMobile = false,
  stickyHeader = true,
  selectedUid = null,
}: ThemeRendererProps) {
  const items = selectionsForPage(selections, pagina);

  return (
    <>
      {items.map(item => {
        const layoutItem = LAYOUTS[item.layoutKey].items.find(
          it => it.id === item.id
        );
        if (!layoutItem) return null;

        const Component = TemplateRegistry[layoutItem.component];
        // Overrides por instância cascateiam como CSS custom properties.
        const styleVars = item.variables as React.CSSProperties | undefined;
        const isHeader = item.layoutKey === 'header';
        const fallbackImage =
          (isMobile && layoutItem.mobile) || layoutItem.image;

        return (
          // .preview-template: marcador estável da subárvore do template, usado
          // pelo reset base fraco de templates.css.
          <div
            key={item.uid}
            data-section-uid={item.uid}
            data-section-label={layoutItem.title}
            data-layout-key={item.layoutKey}
            data-selected={item.uid === selectedUid ? 'true' : undefined}
            className={`preview-template${
              isHeader && stickyHeader ? ' preview-sticky-header' : ''
            }`}
            style={styleVars}
          >
            {Component ? (
              <Component isMobile={isMobile} />
            ) : (
              <img
                src={`/images/gerador/${fallbackImage}`}
                alt={layoutItem.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

/**
 * memo é funcional, não cosmético: no editor o hover de seção e cada keystroke
 * de color picker re-renderizam o pai, e sem o bail-out aqui a árvore inteira
 * de templates (dezenas de Swipers) seria reconciliada a cada frame.
 */
export default React.memo(ThemeRenderer);
