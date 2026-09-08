'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { LayoutSelection } from './useLayoutGenerator';

/**
 * O "documento" versionável do editor.
 *
 * Entra o que o usuário reconhece como o tema que está montando: as seções e as
 * variáveis globais. NÃO entram:
 *
 * - estado transiente de UI (`selectedUid`, `hoveredUid`, `isMobileView`,
 *   `railTarget`, `selectedPage`) — desfazer não deveria mexer no que está
 *   selecionado nem na página aberta;
 * - `platform` — a troca tem diálogo próprio de confirmação;
 * - logo, favicon e a imagem de compartilhamento — são data URLs de até 2 MB
 *   cada; 50 entradas de histórico as multiplicariam por 50.
 */
export interface ThemeDoc {
  selections: LayoutSelection[];
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

/** Além disto, as entradas mais antigas são descartadas. */
const HISTORY_LIMIT = 50;

/**
 * Espera antes de fechar uma entrada. Arrastar o color picker dispara a cada
 * movimento do mouse; sem isto um único arraste viraria centenas de entradas.
 */
const COALESCE_MS = 250;

const structureOf = (doc: ThemeDoc) => doc.selections.map(s => s.uid).join('|');

/**
 * Histórico de desfazer/refazer sobre o documento do tema.
 *
 * É um OBSERVADOR: não intercepta nenhuma ação. `toggleSelection`,
 * `moveSection` e os setters de cor continuam intocados — o histórico só olha o
 * resultado e guarda cópias. Por isso `applyEntry` devolve o array `selections`
 * COMPLETO e verbatim, incluindo a ordem que o `arrayMove` produziu; um array
 * filtrado por página perderia a ordenação.
 */
export function useThemeHistory(
  doc: ThemeDoc,
  apply: (doc: ThemeDoc) => void,
  /** Só começa a gravar depois da hidratação, senão o load vira a 1ª entrada. */
  enabled: boolean
) {
  const past = useRef<string[]>([]);
  const future = useRef<string[]>([]);
  /** Último estado fechado. É ele que vai para a pilha, não o atual. */
  const committed = useRef<string | null>(null);
  /** Ligado durante um undo/redo para o observador ignorar a própria escrita. */
  const applying = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const sync = () => {
    setCanUndo(past.current.length > 0);
    setCanRedo(future.current.length > 0);
  };

  const serialized = JSON.stringify(doc);

  useEffect(() => {
    if (!enabled) return;

    if (committed.current === null) {
      committed.current = serialized;
      return;
    }
    if (applying.current) {
      applying.current = false;
      committed.current = serialized;
      return;
    }
    if (serialized === committed.current) return;

    const commit = () => {
      if (committed.current === null || committed.current === serialized)
        return;
      past.current = [...past.current, committed.current].slice(-HISTORY_LIMIT);
      future.current = [];
      committed.current = serialized;
      sync();
    };

    // Mudança estrutural (entrou, saiu ou trocou de posição uma seção) fecha na
    // hora: são gestos discretos, não um arraste contínuo.
    const structural =
      structureOf(doc) !==
      structureOf(JSON.parse(committed.current) as ThemeDoc);

    if (timer.current) clearTimeout(timer.current);
    if (structural) {
      commit();
    } else {
      timer.current = setTimeout(commit, COALESCE_MS);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [serialized, enabled, doc]);

  const travel = useCallback(
    (from: React.RefObject<string[]>, to: React.RefObject<string[]>) => {
      if (from.current.length === 0) return;
      if (timer.current) clearTimeout(timer.current);

      const next = from.current[from.current.length - 1];
      from.current = from.current.slice(0, -1);
      if (committed.current !== null) {
        to.current = [...to.current, committed.current];
      }
      applying.current = true;
      committed.current = next;
      apply(JSON.parse(next) as ThemeDoc);
      sync();
    },
    [apply]
  );

  const undo = useCallback(() => travel(past, future), [travel]);
  const redo = useCallback(() => travel(future, past), [travel]);

  return { undo, redo, canUndo, canRedo };
}
