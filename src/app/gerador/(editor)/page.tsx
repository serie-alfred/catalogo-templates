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
   * Desseleção por clique fora — por ZONA MORTA DECLARADA, não por lista-negra.
   *
   * A primeira versão listava o que NÃO desseleciona (button, input, a…) e
   * desselecionava todo o resto. Isso é frágil por construção: qualquer coisa
   * fora da lista vira armadilha. Custou dois bugs reais — o popover de cor
   * (portal do React propaga pela árvore do React, não do DOM) e, pior, o
   * <span> do rótulo da variável: clicar no texto "Fundo da barra superior"
   * esvaziava o painel que o usuário estava editando.
   *
   * Agora só três superfícies dizem "aqui não tem nada": o papel quadriculado
   * do canvas, a faixa da topbar e o rail. Elas carregam `data-deselect-zone`.
   * Tudo o mais — os dois painéis inteiros, portais, modais — não desseleciona,
   * e nenhum elemento novo passa a desselecionar por descuido.
   *
   * O guard de interativos continua DENTRO da zona: a topbar e o rail têm
   * botões, e clicar neles é ação, não "clicar fora".
   *
   * O caso simétrico — clicar fora de uma seção mas DENTRO do tema — é do
   * `useCanvasInteractions`, que roda no documento do iframe.
   */
  const INTERATIVO =
    'button, a, input, select, textarea, label, [role="button"], [role="option"], [role="listbox"], [data-canvas-control]';

  const desselecionarNaZonaMorta = (event: React.MouseEvent) => {
    const alvo = event.target as Element;
    if (!alvo?.closest?.('[data-deselect-zone]')) return;
    if (alvo.closest(INTERATIVO)) return;
    selectSection(null);
  };

  return (
    <>
      <div
        className={`ed-shell ${styles.shell}`}
        data-left-collapsed={leftCollapsed ? 'true' : undefined}
        data-right-collapsed={rightCollapsed ? 'true' : undefined}
        onClick={desselecionarNaZonaMorta}
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
