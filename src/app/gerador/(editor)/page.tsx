'use client';

import React from 'react';

import EditorRail from '@/components/gerador/EditorRail';
import EditorLeftPanel from '@/components/gerador/EditorLeftPanel';
import EditorTopbar from '@/components/gerador/EditorTopbar';
import EditorCanvas from '@/components/gerador/EditorCanvas';
import EditorRightPanel from '@/components/gerador/EditorRightPanel';
import ExportStage from '@/components/gerador/ExportStage';
import PanelToggle from '@/components/gerador/PanelToggle';
import DesktopOnlyNotice from '@/components/gerador/DesktopOnlyNotice';

import styles from './index.module.css';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useLayout } from '@/context/LayoutContext';
import { WakePopup } from '@/components/gerador/WakePopup';

export default function GeradorPage() {
  const isMobile = useIsMobile();

  const {
    selectSection,
    wakeCustomValue,
    setWakeCustomValue,
    showWakePopup,
    setShowWakePopup,
    wakePopupRef,
    leftCollapsed,
    setLeftCollapsed,
    rightCollapsed,
    setRightCollapsed,
  } = useLayout();

  if (isMobile) {
    return <DesktopOnlyNotice />;
  }

  /*
   * Clicar em qualquer lugar "morto" da chrome do editor desseleciona: o papel
   * quadriculado do canvas, a sobra do painel esquerdo abaixo da lista, a faixa
   * vazia da topbar, o rail. Um handler só, no shell, porque a regra é uma só —
   * antes ele existia apenas no EditorCanvas e o resto da tela não respondia.
   *
   * O clique DENTRO do iframe não chega aqui (evento não cruza a fronteira de
   * documento): aquele caso é do `useCanvasInteractions`, que roda no documento
   * do canvas e já desseleciona ao clique fora de uma seção.
   *
   * Três exceções, as três necessárias:
   *  - qualquer coisa interativa. Um clique num botão, campo, opção ou rótulo é
   *    uma AÇÃO, não "clicar fora";
   *  - `[data-canvas-control]`, o seletor de zoom, que é um <div> flutuando
   *    sobre o canvas e cujo padding não é botão;
   *  - `[data-ed-portal]`, TODA superfície portalizada. Este é o caso que não é
   *    óbvio: o popover do ColorPicker, o modal de seções e os demais vivem em
   *    `document.body`, FORA deste <div> no DOM — mas um portal do React
   *    propaga o evento pela árvore do REACT, não pela do DOM, então o clique
   *    chega aqui mesmo assim. A área de saturação do react-colorful é um
   *    <div>, não casava com a lista de interativos, e escolher uma cor
   *    desselecionava a seção no meio do gesto.
   */
  const INTERATIVO =
    'button, a, input, select, textarea, label, [role="button"], [role="option"], [role="listbox"], [data-canvas-control], [data-ed-portal]';

  const desselecionarNaChrome = (event: React.MouseEvent) => {
    if ((event.target as Element).closest(INTERATIVO)) return;
    selectSection(null);
  };

  return (
    <>
      <div
        className={`ed-shell ${styles.shell}`}
        data-left-collapsed={leftCollapsed ? 'true' : undefined}
        data-right-collapsed={rightCollapsed ? 'true' : undefined}
        onClick={desselecionarNaChrome}
      >
        <EditorRail className={styles.rail} />
        {/* SEMPRE montado, mesmo recolhido: desmontar mataria a animação — não
            há o que encolher se o conteúdo já sumiu. `inert` tira o painel
            recolhido do Tab e do leitor de tela, que é o que o desmonte fazia
            de graça. */}
        <EditorLeftPanel className={styles.left} inert={leftCollapsed} />

        {/* Cada toggle vem logo depois do painel que controla. Os dois são
            `position: absolute` num shell `relative`, então a ordem no DOM é
            neutra em layout — mas é ela que dá a ordem de Tab. Juntos no fim,
            eles caíam depois de tudo, inclusive do painel direito. */}
        <PanelToggle
          side="left"
          collapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed(prev => !prev)}
        />

        {/* A topbar é filha DIRETA do shell, não da coluna central: ela atravessa
            centro + painel direito (`grid-column: 3 / 5`). Era o cabeçalho do
            painel direito que cobria essa segunda metade, com as mesmas duas
            ações — ver o comentário no index.module.css. */}
        <EditorTopbar className={styles.topbar} />
        <EditorCanvas className={styles.center} />

        <EditorRightPanel className={styles.right} inert={rightCollapsed} />

        <PanelToggle
          side="right"
          collapsed={rightCollapsed}
          onToggle={() => setRightCollapsed(prev => !prev)}
        />

        {showWakePopup && (
          <WakePopup
            wakeCustomValue={wakeCustomValue}
            setWakeCustomValue={setWakeCustomValue}
            onClose={() => setShowWakePopup(false)}
            setShowWakePopup={setShowWakePopup}
            wakePopupRef={wakePopupRef}
          />
        )}
      </div>

      {/* Fora do shell: ele é `overflow: hidden` e recortaria o palco
          off-screen do export, que fica em top/left -99999px. */}
      <ExportStage />
    </>
  );
}
