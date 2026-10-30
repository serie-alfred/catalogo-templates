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
 *
 * Mas o clique não morre calado: um produto leva a página para o "Produto"
 * do mesmo template, o menu e as categorias para a "Categoria", e o resto
 * (conta, carrinho, institucional, banners) mostra um aviso curto. Quem navega é a janela de cima, que tem a barra e a vista.
 */
function destinoDoLink(link: Element): 'produto' | 'categoria' | null {
  const href = link.getAttribute('href') ?? '';
  // Os `href` de mock não seguem padrão entre as famílias (`/p`, domínio de
  // exemplo, `#`): o que decide é ONDE o link está — card de produto (classe do
  // CSS Module com "product"/"spot", fora da própria PDP) ou menu/categorias.
  if (/\/p\/?$/.test(href)) return 'produto';
  const secao = link
    .closest('[data-selection]')
    ?.getAttribute('data-selection');
  if (
    secao !== 'product-info' &&
    link.closest('[class*="roduct"], [class*="spot"], [class*="Spot"]')
  ) {
    return 'produto';
  }
  if (
    secao === 'categories' ||
    (secao === 'header' &&
      link.closest('nav, [class*="menu"], [class*="Menu"]'))
  ) {
    return 'categoria';
  }
  return null;
}

function avisar() {
  const id = 'frame-aviso';
  document.getElementById(id)?.remove();
  const aviso = document.createElement('div');
  aviso.id = id;
  aviso.setAttribute('role', 'status');
  aviso.textContent = 'Visualização: use o menu acima para navegar.';
  Object.assign(aviso.style, {
    position: 'fixed',
    left: '50%',
    bottom: '24px',
    transform: 'translateX(-50%)',
    zIndex: '2147483647',
    padding: '10px 16px',
    borderRadius: '999px',
    background: 'rgba(20, 20, 20, 0.9)',
    color: '#fff',
    font: '14px/1.3 system-ui, sans-serif',
    pointerEvents: 'none',
  });
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2500);
}

export default function FrameClient(props: {
  selections: LayoutSelection[];
  colors: FrameColors;
  fonts: FrameFonts;
  pagina: string;
}) {
  const isMobile = useIsMobile();

  useEffect(() => {
    const clique = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]');
      if (!link) return;
      e.preventDefault();
      const destino = destinoDoLink(link);
      if (!destino || destino === props.pagina) {
        avisar();
        return;
      }
      // `/templates/<NN>/<página>/frame` → `/templates/<NN>/<destino>`, com a vista.
      const topo = window.top ?? window;
      const base = window.location.pathname.replace(/\/[^/]+\/frame\/?$/, '');
      topo.location.assign(`${base}/${destino}${topo.location.search}`);
    };
    const envio = (e: Event) => e.preventDefault();
    document.addEventListener('click', clique, true);
    document.addEventListener('submit', envio, true);
    return () => {
      document.removeEventListener('click', clique, true);
      document.removeEventListener('submit', envio, true);
    };
  }, [props.pagina]);

  return <SeededStorefront {...props} logo="" isMobile={isMobile} />;
}
