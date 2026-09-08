'use client';

import { useEffect, useRef } from 'react';

import { NON_DUPLICABLE_LAYOUT_KEYS } from '@/utils/sectionRules';

interface CanvasInteractionOptions {
  /** Chamado ao clicar em qualquer ponto de uma seção. */
  onSelect?: (uid: string) => void;
  /** Chamado ao entrar/sair de uma seção (null = saiu do canvas). */
  onHover?: (uid: string | null) => void;
  /** Chamado no Escape. */
  onEscape?: () => void;
  /** Badge verde da seção selecionada. */
  onDuplicate?: (uid: string) => void;
  /** Badge vermelho da seção selecionada. */
  onRemove?: (uid: string) => void;
  /**
   * Só liga quando o canvas existe no DOM.
   *
   * Sem isto o efeito rodava uma única vez, no primeiro commit — quando o
   * FrameClient ainda retorna `null` porque não recebeu `content`. `rootRef`
   * era null, o efeito caía no early return e, como a única dependência é o
   * objeto de ref (estável), nunca mais rodava: nem o rótulo de hover nem o
   * clique-para-selecionar chegavam a ser ligados.
   */
  enabled?: boolean;
}

const SECTION_SELECTOR = '[data-section-uid]';

/**
 * Liga um container de tema renderizado ao editor: neutraliza a navegação e
 * delega hover/seleção de seção.
 *
 * Roda dentro do documento do iframe do canvas (FrameClient) — daí receber o
 * root por ref em vez de assumir `document`.
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
  {
    onSelect,
    onHover,
    onEscape,
    onDuplicate,
    onRemove,
    enabled = true,
  }: CanvasInteractionOptions = {}
) {
  // Handlers num ref: o efeito não deve re-assinar a cada render do pai.
  const handlersRef = useRef({
    onSelect,
    onHover,
    onEscape,
    onDuplicate,
    onRemove,
  });
  handlersRef.current = { onSelect, onHover, onEscape, onDuplicate, onRemove };

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const doc = root.ownerDocument;

    /** Seção sob o cursor. Atributo DOM, não estado React: hover é alta
     *  frequência e um setState aqui re-renderizaria o editor a cada travessia. */
    let hovered: HTMLElement | null = null;

    /**
     * Rótulo com o nome da seção. Um único elemento `position: fixed`, filho do
     * <body> — deliberadamente FORA da árvore do tema.
     *
     * Já foi um `::before` na própria seção, o que exigia `position: relative`
     * no wrapper. Parecia inofensivo, mas dava containing block a
     * pseudo-elementos absolutos órfãos dos templates (que no /p resolvem
     * contra o containing block inicial e ficam fora de vista), fazendo
     * aparecerem linhas e caixas que a loja publicada não tem. `fixed` não
     * precisa de ancestral posicionado, então os wrappers seguem sendo divs nus.
     */
    const label = doc.createElement('div');
    label.className = 'editor-section-label';
    label.hidden = true;
    doc.body.appendChild(label);

    /**
     * Ações da seção SELECIONADA: duplicar (verde) e remover (vermelho).
     *
     * Mesmo princípio do rótulo — um único elemento `position: fixed` filho do
     * <body>, fora da árvore do tema. Nada é adicionado aos wrappers de seção.
     */
    const actions = doc.createElement('div');
    actions.className = 'editor-section-actions';
    actions.hidden = true;

    const makeBadge = (kind: 'duplicate' | 'remove', title: string) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = `editor-section-badge editor-section-badge--${kind}`;
      button.title = title;
      button.setAttribute('aria-label', title);
      button.innerHTML =
        kind === 'duplicate'
          ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V4a2 2 0 0 1 2-2h10"/></svg>'
          : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const uid = selected?.getAttribute('data-section-uid');
        if (!uid) return;
        if (kind === 'duplicate') handlersRef.current.onDuplicate?.(uid);
        else handlersRef.current.onRemove?.(uid);
      });
      return button;
    };

    const duplicateBadge = makeBadge('duplicate', 'Duplicar seção');
    const removeBadge = makeBadge('remove', 'Remover seção');
    actions.append(duplicateBadge, removeBadge);
    doc.body.appendChild(actions);

    let selected: HTMLElement | null = null;

    const positionActions = () => {
      if (!selected) return;
      const rect = selected.getBoundingClientRect();
      actions.style.left = `${rect.right - 8}px`;
      actions.style.top = `${Math.max(rect.top + 8, 8)}px`;
    };

    const syncActions = () => {
      selected = root.querySelector<HTMLElement>('[data-selected="true"]');
      if (!selected) {
        actions.hidden = true;
        return;
      }
      const layoutKey = selected.getAttribute('data-layout-key') ?? '';
      // Espelha a regra da lista: singleton não duplica.
      duplicateBadge.hidden = NON_DUPLICABLE_LAYOUT_KEYS.has(layoutKey);
      actions.hidden = false;
      positionActions();
    };

    // `data-selected` é escrito pelo React ao re-renderizar o ThemeRenderer,
    // fora do alcance deste efeito — daí observar em vez de reagir a eventos.
    const selectionObserver = new MutationObserver(syncActions);
    selectionObserver.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-selected'],
    });
    syncActions();

    const positionLabel = () => {
      if (!hovered) return;
      const rect = hovered.getBoundingClientRect();
      // Acima da borda superior da seção; por dentro quando não há espaço
      // (primeira seção, ou seção que começa acima da área visível).
      const above = rect.top >= 20;
      label.style.left = `${rect.left}px`;
      label.style.top = `${above ? rect.top - 19 : Math.max(rect.top, 0)}px`;
      label.style.borderRadius = above ? '4px 4px 0 0' : '0 0 4px 0';
    };

    const setHovered = (el: HTMLElement | null) => {
      if (el === hovered) return;
      hovered?.removeAttribute('data-hovered');
      el?.setAttribute('data-hovered', 'true');
      hovered = el;

      if (el) {
        label.textContent = el.getAttribute('data-section-label') ?? '';
        label.hidden = false;
        positionLabel();
      } else {
        label.hidden = true;
      }

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
    // O rótulo é `fixed`, então precisa acompanhar o scroll do documento do
    // canvas. `passive` porque nunca chamamos preventDefault aqui.
    const reposition = () => {
      positionLabel();
      positionActions();
    };
    doc.addEventListener('scroll', reposition, {
      capture: true,
      passive: true,
    });
    doc.defaultView?.addEventListener('resize', reposition);

    return () => {
      root.removeEventListener('pointerover', onPointerOver, capture);
      root.removeEventListener('pointerout', onPointerOut, capture);
      root.removeEventListener('click', onClick, capture);
      root.removeEventListener('auxclick', onAuxClick, capture);
      root.removeEventListener('submit', onSubmit, capture);
      root.removeEventListener('dragstart', onDragStart, capture);
      root.ownerDocument.removeEventListener('keydown', onKeyDown);
      doc.removeEventListener('scroll', reposition, { capture: true });
      doc.defaultView?.removeEventListener('resize', reposition);
      selectionObserver.disconnect();
      hovered?.removeAttribute('data-hovered');
      label.remove();
      actions.remove();
    };
  }, [rootRef, enabled]);
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
