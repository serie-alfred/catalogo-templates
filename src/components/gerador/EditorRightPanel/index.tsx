'use client';

import React, { useEffect, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import PreviewButton from '../PreviewButton';
import ComponentVariablesPanel from '../ComponentVariablesPanel';
import ExportFeedbackModal from '../ExportFeedbackModal';
import { ArrowDown } from '@/assets/icons/editor';
import { isLocalDelivery } from '@/utils/configDelivery';

import styles from './index.module.css';

/**
 * Painel direito: cabeçalho fixo com Pré-visualizar e o botão de export, e
 * abaixo as variáveis da seção em edição.
 *
 * O cabeçalho aparece sempre — inclusive quando nenhuma seção está selecionada
 * e o corpo está vazio.
 */
export default function EditorRightPanel({
  className,
}: {
  className?: string;
}) {
  const { exportLayout, platform, exportFeedback, dismissExportFeedback } =
    useLayout();
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

  return (
    <aside
      className={`${styles.panel} ${className ?? ''}`}
      aria-label="Propriedades"
    >
      <header className={styles.header}>
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
      </header>

      <div className={`${styles.body} ed-scroll`}>
        <ComponentVariablesPanel />
      </div>

      {/* Desfecho do export. Substitui o `window.alert` de antes — sem download
          em produção, esta é a única evidência de que o clique fez algo. */}
      {exportFeedback && (
        <ExportFeedbackModal
          status={exportFeedback}
          onClose={dismissExportFeedback}
        />
      )}
    </aside>
  );
}
