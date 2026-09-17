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

/** Shallow compare de um Record<string,string>. As variáveis por instância são
 *  sempre um mapa plano de cssVar → valor. */
function mesmasVariaveis(
  a?: Record<string, string>,
  b?: Record<string, string>
) {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a);
  if (ka.length !== Object.keys(b).length) return false;
  return ka.every(k => a[k] === b[k]);
}

interface SecaoProps {
  uid: string;
  titulo: string;
  selection: string;
  componentKey: string;
  variaveis?: Record<string, string>;
  selecionada: boolean;
  sticky: boolean;
  isMobile: boolean;
}

/**
 * UMA seção do tema, memoizada por instância.
 *
 * É aqui que mora o ganho: o `memo` do ThemeRenderer inteiro (lá embaixo) só
 * evita trabalho quando TODAS as props são idênticas, e `selections` troca de
 * identidade a cada edição de variável — então ele nunca segurava nada e as
 * dezenas de templates reconciliavam juntos. Medido antes: 12 cliques de
 * seleção = 576ms de bloqueio da thread, ~48ms por clique.
 *
 * Com o memo por seção, mexer numa cor da Vitrine reconcilia a Vitrine. As
 * outras 14 seções não são tocadas — o comparador abaixo compara as variáveis
 * por VALOR, que é o que muda num arraste de color picker.
 */
const Secao = React.memo(
  function Secao({
    uid,
    titulo,
    selection,
    componentKey,
    variaveis,
    selecionada,
    sticky,
    isMobile,
  }: SecaoProps) {
    const Component = TemplateRegistry[componentKey];

    return (
      // .preview-template: marcador estável da subárvore do template, usado
      // pelo reset base fraco de templates.css.
      <div
        data-section-uid={uid}
        data-section-label={titulo}
        data-selection={selection}
        data-selected={selecionada ? 'true' : undefined}
        className={`preview-template${sticky ? ' preview-sticky-header' : ''}`}
        /* Overrides por instância cascateiam como CSS custom properties. */
        style={variaveis as React.CSSProperties | undefined}
      >
        {Component ? (
          <Component isMobile={isMobile} />
        ) : (
          /* Componente fora do `TemplateRegistry`. Isto costumava renderizar
             `<img src={`/images/gerador/${layoutItem.image}`}>`, e como os 67
             itens têm `image: ''` desde o commit 5633c33 o que saía era um
             `/images/gerador/` — 404 mudo. O erro tem que APARECER: é o único
             sinal de que alguém esqueceu de registrar o componente. */
          <div
            data-registry-missing={componentKey}
            style={{
              padding: 24,
              border: '2px dashed #c0121c',
              color: '#c0121c',
              font: '600 14px/1.4 system-ui, sans-serif',
              textAlign: 'center',
            }}
          >
            <strong>{componentKey}</strong> não está no TemplateRegistry
            <br />
            <span style={{ fontWeight: 400 }}>
              registre em src/utils/templateRegistry.ts
            </span>
          </div>
        )}
      </div>
    );
  },
  (a, b) =>
    a.uid === b.uid &&
    a.titulo === b.titulo &&
    a.selection === b.selection &&
    a.componentKey === b.componentKey &&
    a.selecionada === b.selecionada &&
    a.sticky === b.sticky &&
    a.isMobile === b.isMobile &&
    mesmasVariaveis(a.variaveis, b.variaveis)
);

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

        return (
          <Secao
            key={item.uid}
            uid={item.uid}
            titulo={layoutItem.title}
            selection={layoutItem.selection}
            componentKey={layoutItem.component}
            variaveis={item.variables}
            selecionada={item.uid === selectedUid}
            sticky={item.layoutKey === 'header' && stickyHeader}
            isMobile={isMobile}
          />
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
