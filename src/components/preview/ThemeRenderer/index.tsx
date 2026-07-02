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
}

/**
 * Renderiza, empilhados, os componentes selecionados para uma página — versão
 * read-only do DraggablePreviewList (sem drag-and-drop nem controles de edição).
 * Reaproveita as mesmas regras de filtro/ordenação e o TemplateRegistry.
 */
export default function ThemeRenderer({
  selections,
  pagina,
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

        return (
          <div key={item.uid} style={styleVars}>
            {Component ? (
              <Component isMobile={false} />
            ) : (
              <img
                src={`/images/gerador/${layoutItem.image}`}
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
