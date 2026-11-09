'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import ThemeRenderer from '@/components/preview/ThemeRenderer';

/**
 * Palco off-screen do export: as duas cópias em 1920px e 375px que o
 * html2canvas fotografa.
 *
 * Montado SÓ durante a captura (`isCapturing`). Antes ficava montado o tempo
 * todo, o que montava cada template 3× — três Swipers com observer/loop, três
 * baterias de effects e três drawers `position: fixed` disputando com o canvas
 * que o usuário está usando.
 *
 * `stickyHeader={false}`: o html2canvas renderiza `position: sticky` de forma
 * imprevisível, e o editor nunca aplicou sticky nessas cópias.
 *
 * O CHECKOUT não entra aqui, nem no modo Checkout: os PNGs são das páginas da
 * loja. O checkout é uma fixture do DOM da VTEX num iframe (CheckoutFrame), que
 * o html2canvas não atravessa, e o que dele vai no config são só os papéis.
 *
 * `clip-path: inset(0)` é o que mantém o palco INVISÍVEL. Estar em -99999px não
 * basta: o que é `position: fixed` dentro dele (o PopupNews das famílias 06 e
 * 09–17, que nasce aberto com `inset: 0; z-index: 2000`, e o HelpFloat) se
 * prende à janela do EDITOR e cobria a tela inteira durante todo o "Baixar". O
 * `clip-path` recorta também os descendentes fixos (o `overflow` não recorta), e
 * o recorte é a caixa do palco, fora da tela; o recortado também não recebe
 * clique. NÃO troque por `transform`/`filter`/`contain`: esses tornam o palco o
 * bloco de contenção dos fixos, o pop-up passa a cobrir a loja dentro do palco e
 * o html2canvas o pinta no PNG. Com o `clip-path` a posição dos fixos não muda,
 * e o html2canvas (que não implementa `clip-path`) fotografa o mesmo de antes.
 */
export default function ExportStage() {
  const { isCapturing, selections, selectedPage, desktopPreviewRef, mobilePreviewRef } =
    useLayout();

  if (!isCapturing) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: '-99999px',
        left: '-99999px',
        pointerEvents: 'none',
        clipPath: 'inset(0)',
      }}
    >
      <div
        ref={desktopPreviewRef}
        style={{ background: 'white', padding: '10px', width: '1920px' }}
      >
        <ThemeRenderer
          selections={selections}
          pagina={selectedPage}
          isMobile={false}
          stickyHeader={false}
        />
      </div>
      <div
        ref={mobilePreviewRef}
        style={{ background: 'white', padding: '10px', width: '375px' }}
      >
        <ThemeRenderer
          selections={selections}
          pagina={selectedPage}
          isMobile
          stickyHeader={false}
        />
      </div>
    </div>
  );
}
