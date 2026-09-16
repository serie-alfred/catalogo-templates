'use client';

import React, { useEffect, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import SelectPage from '../SelectPage';
import ResponsiveToggle from '../ResponsiveToggle';
import PreviewButton from '../PreviewButton';
import ExportFeedbackModal from '../ExportFeedbackModal';
import { UndoLeft, UndoRight, ArrowDown } from '@/assets/icons/editor';
import { isLocalDelivery } from '@/utils/configDelivery';

import styles from './index.module.css';

/** Atalhos de teclado não devem roubar o Cmd+Z de um campo de texto. */
function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable === true;
}

/**
 * Barra do topo: voltar/avançar, seletor de página, o toggle Desktop/Mobile e
 * as duas ações globais — Pré-visualizar e o export.
 *
 * Ela atravessa a coluna central E a do painel direito. As duas ações moravam
 * num cabeçalho próprio do EditorRightPanel, que ocupava exatamente essa
 * segunda metade — continuam no mesmo canto da tela, encostadas à direita.
 * O que mudou é que o painel direito deixou de ser dimensionado por elas:
 * 273px de botões cravavam um piso de 320px num painel cujo conteúdo real (a
 * linha do ColorPicker) cabe em ~201, e o canvas pagava a diferença.
 */
export default function EditorTopbar({ className }: { className?: string }) {
  const {
    selectedPage,
    setSelectedPage,
    isMobileView,
    toggleMobileView,
    undo,
    redo,
    canUndo,
    canRedo,
    exportLayout,
    platform,
    exportFeedback,
    dismissExportFeedback,
  } = useLayout();

  const [exporting, setExporting] = useState(false);

  /* O rótulo segue o destino real do config (ver configDelivery.ts): em
     desenvolvimento o clique baixa o arquivo, fora dele envia por e-mail e não
     baixa nada. Resolvido em efeito porque `window` não existe no servidor — o
     HTML sai com "Enviar", que é o caso de produção, e só o dev vê a troca. */
  const [localDelivery, setLocalDelivery] = useState(false);
  useEffect(() => {
    setLocalDelivery(isLocalDelivery(window.location.hostname));
  }, []);

  /* O export monta o palco off-screen, espera as fontes e todas as imagens e
     captura dois PNGs — são vários segundos. Sem sinal de ocupado o usuário
     clica de novo achando que não funcionou. */
  const handleExport = async (event: React.FormEvent) => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportLayout(event);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === 'y') {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  return (
    <header className={`${styles.topbar} ${className ?? ''}`}>
      {/* Os controles de VISTA ficam alinhados ao canvas; as ações globais, à
          direita. As duas colunas da barra espelham o que está embaixo delas. */}
      <div className={styles.canvasControls}>
        <div className={styles.history}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Voltar"
            onClick={undo}
            disabled={!canUndo}
          >
            <UndoLeft width={20} height={20} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Avançar"
            onClick={redo}
            disabled={!canRedo}
          >
            <UndoRight width={20} height={20} />
          </button>
        </div>

        <SelectPage
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />

        <ResponsiveToggle
          isMobile={isMobileView}
          onToggleMobile={toggleMobileView}
        />
      </div>

      <div className={styles.actions}>
        <PreviewButton />
        <button
          type="button"
          className={styles.download}
          onClick={handleExport}
          /* Sem plataforma o export só liga `showPlatformError`, que quem
             mostra é o PlatformSelect — e ele só existe no destino
             "Componentes" do rail. Nos outros o clique não daria retorno
             nenhum. */
          disabled={exporting || !platform}
          title={platform ? undefined : 'Escolha uma plataforma primeiro'}
        >
          {exporting ? 'Gerando…' : localDelivery ? 'Baixar' : 'Enviar'}

          {localDelivery && <ArrowDown width={20} height={20} />}
        </button>
      </div>

      {/* Desfecho do export. Substitui o `window.alert` de antes — sem download
          em produção, esta é a única evidência de que o clique fez algo.
          Vive aqui, e não no painel direito, porque o painel é DESMONTADO ao
          recolher: o modal sumiria no meio de um export em andamento. */}
      {exportFeedback && (
        <ExportFeedbackModal
          status={exportFeedback}
          onClose={dismissExportFeedback}
        />
      )}
    </header>
  );
}
