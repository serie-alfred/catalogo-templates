'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS, type ComponentVariable } from '@/data/layoutData';
import { estadoDaNota, type EstadoNoCanvas } from '@/hooks/useAbrirNoCanvas';
import type { Platform } from '@/types/platform';
import VariablesList from './VariablesList';

import styles from './index.module.css';

/** O que a loja publicada mostra quando a seção tem cópias (ver `copias`). */
const NA_LOJA: Record<Platform, string> = {
  VTEX: 'vale o que estiver na última cópia',
  Tray: 'vale o que estiver na primeira cópia',
  Wake: 'vale o que estiver na primeira cópia',
  'Wake 2.0': 'vale o que estiver na primeira cópia',
  Nuvemshop: 'cada cópia fica com as suas',
};

export default function ComponentVariablesPanel() {
  const {
    selectedUid,
    selections,
    setItemVariable,
    resetItemVariables,
    platform,
    estadoNoCanvasRef,
  } = useLayout();

  /* Abrir no canvas o que o campo focado pinta (D3-06): o mini-carrinho, o
     painel de ajuda, o de filtros ou o menu mobile da seção selecionada. O
     foco que sai do campo só fecha depois de um respiro: passar do campo hex
     para o popover do seletor de cor é blur + focus, e sem o respiro o
     carrinho piscaria fechado entre os dois. */
  const enviadoRef = useRef<string>('');
  const fecharRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Gavetas que, ao abrir, põem o foco nelas mesmas (o diálogo do
     CartSidebar10, por exemplo) tiram o foco do campo — e o campo fecharia a
     gaveta que acabou de abrir. Foco que cai no iframe logo depois de abrir
     volta para o campo; um clique do usuário no canvas, depois, fecha. */
  const abriuEmRef = useRef(0);
  const ultimoCampoRef = useRef<HTMLElement | null>(null);
  const enviar = useCallback(
    (uid: string | null, estado: EstadoNoCanvas | null) => {
      const chave = uid && estado ? `${uid}:${estado}` : '';
      if (chave === enviadoRef.current) return;
      enviadoRef.current = chave;
      if (chave) abriuEmRef.current = Date.now();
      estadoNoCanvasRef.current?.(chave ? uid : null, chave ? estado : null);
    },
    [estadoNoCanvasRef]
  );
  const aoFocarCampo = useCallback(
    (variable: ComponentVariable | null) => {
      if (fecharRef.current) clearTimeout(fecharRef.current);
      fecharRef.current = null;
      if (variable) {
        ultimoCampoRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        enviar(selectedUid, estadoDaNota(variable.previewNote));
        return;
      }
      fecharRef.current = setTimeout(() => {
        const campo = ultimoCampoRef.current;
        if (
          enviadoRef.current &&
          document.activeElement?.tagName === 'IFRAME' &&
          Date.now() - abriuEmRef.current < 1000 &&
          campo?.isConnected
        ) {
          campo.focus();
          return;
        }
        enviar(null, null);
      }, 200);
    },
    [enviar, selectedUid]
  );
  // Trocar de seção (ou o painel sair) fecha o que estava aberto.
  useEffect(
    () => () => {
      if (fecharRef.current) clearTimeout(fecharRef.current);
      enviar(null, null);
    },
    [selectedUid, enviar]
  );

  const selection = useMemo(
    () => selections.find(s => s.uid === selectedUid) ?? null,
    [selections, selectedUid]
  );

  const layoutItem = useMemo(() => {
    if (!selection) return null;
    return (
      LAYOUTS[selection.layoutKey].items.find(i => i.id === selection.id) ??
      null
    );
  }, [selection]);

  /* Quantas cópias deste mesmo item existem no tema. Duplicar seção é recurso
     (`duplicateSection`, e o ramo de showcase do `toggleSelection`), e as
     variáveis são por `uid`: no editor, no /p/{id} e nos PNGs do export cada
     cópia mostra as próprias cores, e o config leva uma entrada por cópia.
     Quem decide o que a LOJA mostra é o generator de cada plataforma, e cada um
     resolve de um jeito (D8-01, decisão de 18/11/2026: o comportamento fica,
     o aviso conta como é): FastStore injeta num SCSS por componente e vale a
     ÚLTIMA cópia; Tray e Wake gravam no arquivo de origem e vale a PRIMEIRA;
     a Nuvemshop grava settings por instância e cada cópia fica com as suas. */
  const copias = useMemo(
    () =>
      selection
        ? selections.filter(
            s => s.id === selection.id && s.layoutKey === selection.layoutKey
          ).length
        : 0,
    [selections, selection]
  );

  /* Estados vazios: o painel é permanente, então não some — explica por quê.
     38 dos 90 itens do catálogo não declaram `variablesSchema`, então o
     segundo caso é garantido, não hipotético. */
  if (!selectedUid || !selection) {
    return (
      <p className={styles.empty}>
        Selecione uma seção no preview ou na lista para editar as variáveis
        dela.
      </p>
    );
  }

  if (!layoutItem?.variablesSchema?.length) {
    return (
      <p className={styles.empty}>
        <strong>{layoutItem?.title}</strong> não expõe variáveis próprias. As
        cores e fontes vêm das variáveis globais.
      </p>
    );
  }

  return (
    <div className={styles.panel} aria-label="Editar variáveis do componente">
      {/* Sem bloco de identidade do componente: a Tela 1 do Figma leva o painel
          direto para o primeiro grupo de variáveis. O cabeçalho com ícone,
          título e descrição é da Tela 2, que desenha as propriedades
          estruturais — fora do escopo acordado. */}
      {copias > 1 && (
        <p className={styles.aviso} role="status">
          Este componente está <strong>{copias}×</strong> no tema. Aqui cada
          cópia guarda as próprias cores e fontes; na loja,{' '}
          {platform ? (
            <strong>{NA_LOJA[platform]}</strong>
          ) : (
            <>
              na VTEX vale a <strong>última</strong> cópia, na Tray e na Wake a{' '}
              <strong>primeira</strong>, e na Nuvemshop{' '}
              <strong>cada cópia fica com as suas</strong>
            </>
          )}
          .
        </p>
      )}

      <div className={styles.body}>
        <VariablesList
          variables={layoutItem.variablesSchema}
          values={selection.variables}
          onChange={(cssVar, value) =>
            setItemVariable(selectedUid, cssVar, value)
          }
          onCampoFoco={aoFocarCampo}
        />
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.resetButton}
          onClick={() => resetItemVariables(selectedUid)}
        >
          Restaurar padrão
        </button>
      </footer>
    </div>
  );
}
