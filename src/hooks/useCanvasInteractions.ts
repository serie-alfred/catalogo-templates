'use client';

import { useEffect, useRef } from 'react';

interface CanvasInteractionOptions {
  /** Chamado ao clicar em qualquer ponto de uma seção. */
  onSelect?: (uid: string) => void;
  /** Chamado ao entrar/sair de uma seção (null = saiu do canvas). */
  onHover?: (uid: string | null) => void;
  /** Chamado no Escape. */
  onEscape?: () => void;
}

const SECTION_SELECTOR = '[data-section-uid]';

/**
 * Liga um container de tema renderizado ao editor: neutraliza a navegação e
 * delega hover/seleção de seção.
 *
 * Usado tanto pelo canvas desktop (ThemeCanvas, no documento do editor) como
 * pelo documento do iframe mobile (FrameClient) — daí receber o root por ref em
 * vez de assumir `document`.
 *
 * Duas decisões que sustentam a interatividade dos templates:
 *
 * 1. Todos os listeners rodam em FASE DE CAPTURA e nunca chamam
 *    stopPropagation. `preventDefault` em captura cancela só a ação DEFAULT do
 *    navegador; o evento segue propagando e os handlers do próprio template
 *    (accordion, toggle de menu, bullets do Swiper, mini-cart) continuam
 *    rodando normalmente. É por isso que só `<a href>` fica inerte.
 *
 * 2. `pointerdown`/`mousedown`/`touchstart` NÃO são tocados — é deles que o
 *    gesto de arrastar do Swiper vive. A alternativa CSS (`pointer-events: none`
 *    nos links) mataria os megamenus abertos por hover e os slides embrulhados
 *    em `<a>`.
 */
export function useCanvasInteractions(
  rootRef: React.RefObject<HTMLElement | null>,
  { onSelect, onHover, onEscape }: CanvasInteractionOptions = {}
) {
  // Handlers num ref: o efeito não deve re-assinar a cada render do pai.
  const handlersRef = useRef({ onSelect, onHover, onEscape });
  handlersRef.current = { onSelect, onHover, onEscape };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /** Seção sob o cursor. Atributo DOM, não estado React: hover é alta
     *  frequência e um setState aqui re-renderizaria o editor a cada travessia. */
    let hovered: HTMLElement | null = null;

    const setHovered = (el: HTMLElement | null) => {
      if (el === hovered) return;
      hovered?.removeAttribute('data-hovered');
      el?.setAttribute('data-hovered', 'true');
      hovered = el;
      handlersRef.current.onHover?.(
        el?.getAttribute('data-section-uid') ?? null
      );
    };

    const sectionOf = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest<HTMLElement>(SECTION_SELECTOR);
    };

    // pointerover/pointerout BORBULHAM (ao contrário de mouseenter/mouseleave),
    // então um par de listeners no root cobre a árvore inteira.
    const onPointerOver = (e: Event) => setHovered(sectionOf(e.target));
    const onPointerOut = (e: Event) => {
      const to = (e as PointerEvent).relatedTarget;
      if (to instanceof Node && root.contains(to)) return;
      setHovered(null);
    };

    const onClick = (e: MouseEvent) => {
      // Cancela navegação, target="_blank" e Enter num link focado (que
      // dispara click). <a> sem href é usado como botão em vários templates:
      // não casa o seletor e passa ileso, de propósito.
      if ((e.target as Element)?.closest?.('a[href]')) e.preventDefault();

      const uid = sectionOf(e.target)?.getAttribute('data-section-uid');
      if (uid) handlersRef.current.onSelect?.(uid);
    };

    // Botão do meio abre nova aba e NÃO dispara click.
    const onAuxClick = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.('a[href]')) e.preventDefault();
    };

    // Os forms de busca dos Headers recarregariam a página.
    const onSubmit = (e: Event) => e.preventDefault();

    // Arraste nativo de link/imagem parece bug e briga com o Swiper.
    const onDragStart = (e: Event) => {
      if ((e.target as Element)?.closest?.('a[href], img')) e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handlersRef.current.onEscape?.();
    };

    const capture = { capture: true } as const;
    root.addEventListener('pointerover', onPointerOver, capture);
    root.addEventListener('pointerout', onPointerOut, capture);
    root.addEventListener('click', onClick, capture);
    root.addEventListener('auxclick', onAuxClick, capture);
    root.addEventListener('submit', onSubmit, capture);
    root.addEventListener('dragstart', onDragStart, capture);
    root.ownerDocument.addEventListener('keydown', onKeyDown);

    return () => {
      root.removeEventListener('pointerover', onPointerOver, capture);
      root.removeEventListener('pointerout', onPointerOut, capture);
      root.removeEventListener('click', onClick, capture);
      root.removeEventListener('auxclick', onAuxClick, capture);
      root.removeEventListener('submit', onSubmit, capture);
      root.removeEventListener('dragstart', onDragStart, capture);
      root.ownerDocument.removeEventListener('keydown', onKeyDown);
      hovered?.removeAttribute('data-hovered');
    };
  }, [rootRef]);
}

/** Destaca imperativamente uma seção do canvas (hover vindo do painel). */
export function highlightSection(
  root: HTMLElement | null,
  uid: string | null
) {
  if (!root) return;
  root
    .querySelectorAll<HTMLElement>('[data-hovered="true"]')
    .forEach(el => el.removeAttribute('data-hovered'));
  if (!uid) return;
  root
    .querySelector<HTMLElement>(`[data-section-uid="${uid}"]`)
    ?.setAttribute('data-hovered', 'true');
}

/** Rola o canvas até uma seção. */
export function scrollToSection(root: HTMLElement | null, uid: string) {
  root
    ?.querySelector<HTMLElement>(`[data-section-uid="${uid}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
