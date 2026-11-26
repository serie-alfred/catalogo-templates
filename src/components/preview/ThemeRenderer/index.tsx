'use client';

import React from 'react';
import { LAYOUTS } from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { selectionsForPage } from '@/utils/previewRender';
import { SecaoUidContext } from '@/hooks/useAbrirNoCanvas';
import {
  ConteudoLojaContext,
  PlataformaContext,
  SecaoConteudoContext,
} from '@/context/ConteudoContext';
import type { ConteudoDaSecao, ConteudoLoja } from '@/types/conteudo';
import { sanitizarConteudoLoja } from '@/utils/conteudo';

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
  /**
   * O conteúdo da loja (Nível 2): menus, contato… que as seções leem
   * pelos vínculos (src/utils/conteudoLoja.ts). Sanitizado aqui, uma vez, para
   * todas as superfícies — no /p ele vem do snapshot, que é público.
   */
  conteudoLoja?: ConteudoLoja | null;
  /**
   * A plataforma do tema: o conteúdo só vale nos campos que o lojista dela muda
   * (src/utils/editaveis.ts). `null` = sem restrição.
   */
  platform?: string | null;
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
  /** Nível 1 do conteúdo (src/types/conteudo.ts). Comparado por referência:
   *  o hook troca o objeto inteiro a cada edição, nunca o muta. */
  conteudo?: ConteudoDaSecao;
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
    conteudo,
    selecionada,
    sticky,
    isMobile,
  }: SecaoProps) {
    const Component = TemplateRegistry[componentKey];
    const doConteudo = React.useMemo(
      () => ({ componente: componentKey, conteudo }),
      [componentKey, conteudo]
    );

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
          /* O uid da seção, para o componente saber se o editor pediu para
             abrir o carrinho/painel DELE (useAbrirNoCanvas). Contexto não vira
             DOM: o markup da seção é o mesmo de antes. */
          <SecaoUidContext.Provider value={uid}>
            {/* O conteúdo da seção (useConteudoDaSecao) — também contexto, então
                o markup da seção continua o mesmo. */}
            <SecaoConteudoContext.Provider value={doConteudo}>
              <Component isMobile={isMobile} />
            </SecaoConteudoContext.Provider>
          </SecaoUidContext.Provider>
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
    a.conteudo === b.conteudo &&
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
  conteudoLoja = null,
  platform = null,
}: ThemeRendererProps) {
  const items = selectionsForPage(selections, pagina);
  const loja = React.useMemo(
    () => sanitizarConteudoLoja(conteudoLoja),
    [conteudoLoja]
  );

  /*
   * As variáveis do "Card de Produto" escolhido valem para TODO card daquele
   * componente na página — vitrines, PLP e relacionados que usam o mesmo card —,
   * como no tema, onde o generator as injeta na raiz do ProductCardNN. Sem isto
   * elas só pintavam o card de exemplo do próprio Spot. Cada réplica de card
   * marca a raiz com `data-spot="SpotNN"`; card de outra família não é tocado,
   * também como no tema.
   */
  const estiloDosCards = selections
    .filter(sel => sel.layoutKey === 'spot' && sel.variables)
    .map(sel => {
      const comp = LAYOUTS.spot.items.find(it => it.id === sel.id)?.component;
      const decl = Object.entries(sel.variables ?? {})
        .filter(([k, v]) => /^--[a-z0-9-]+$/.test(k) && !/[;{}<>]/.test(v))
        .map(([k, v]) => `${k}:${v};`)
        .join('');
      return comp && decl ? `[data-spot="${comp}"]{${decl}}` : '';
    })
    .join('');

  return (
    <PlataformaContext.Provider value={platform}>
      <ConteudoLojaContext.Provider value={loja}>
        {estiloDosCards && <style data-cards-do-spot>{estiloDosCards}</style>}
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
              conteudo={item.content}
              selecionada={item.uid === selectedUid}
              sticky={item.layoutKey === 'header' && stickyHeader}
              isMobile={isMobile}
            />
          );
        })}
      </ConteudoLojaContext.Provider>
    </PlataformaContext.Provider>
  );
}

/**
 * memo é funcional, não cosmético: no editor o hover de seção e cada keystroke
 * de color picker re-renderizam o pai, e sem o bail-out aqui a árvore inteira
 * de templates (dezenas de Swipers) seria reconciliada a cada frame.
 */
export default React.memo(ThemeRenderer);
