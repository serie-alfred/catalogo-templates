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
  /** Papéis do checkout (nível 1). Opcional: entrada gravada antes dele vale. */
  checkout?: Record<string, string>;
}

/** Além disto, as entradas mais antigas são descartadas. */
const HISTORY_LIMIT = 50;

/**
 * Espera antes de fechar uma entrada. Arrastar o color picker dispara a cada
 * movimento do mouse; sem isto um único arraste viraria centenas de entradas.
 */
const COALESCE_MS = 250;

const structureOf = (doc: ThemeDoc) => doc.selections.map(s => s.uid).join('|');

/** Tipos de <input> que não são texto: arraste e clique seguem o prazo. */
const NAO_TEXTO = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

/**
 * Um campo onde se DIGITA (o hex do ColorPicker, o nome da fonte). Enquanto o
 * foco está nele, a entrada do histórico fica aberta e só fecha quando ele sai.
 *
 * O campo grava a cada tecla, e o valor passa por `#`, `#1`, `#12`, `#123`…
 * antes de chegar a `#123456`. Com só o prazo de 250 ms, quem digita devagar
 * (ou uma máquina carregada, que espaça as teclas) fechava uma entrada por
 * tecla: o Cmd+Z parava no `#123` digitado pela metade, ou num `#12345` que
 * nenhum filtro aceita e mostrava o padrão. Digitar um valor é UM gesto.
 */
function ehCampoDeTexto(alvo: EventTarget | Element | null): boolean {
  if (alvo instanceof HTMLTextAreaElement) return true;
  if (alvo instanceof HTMLInputElement) return !NAO_TEXTO.has(alvo.type);
  return alvo instanceof HTMLElement && alvo.isContentEditable;
}

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
  /** O estado de agora: é o que um fechamento adiantado (undo, foco saindo) grava. */
  const latest = useRef(serialized);
  latest.current = serialized;

  const pararPrazo = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  /** Fecha a entrada aberta, se houver: o estado de agora vira o último fechado. */
  const fechar = useCallback(() => {
    pararPrazo();
    // Um undo/redo em curso: o efeito dele é quem fecha (e o `latest` ainda
    // pode ser o de antes do apply).
    if (applying.current) return;
    if (committed.current === null || committed.current === latest.current)
      return;
    past.current = [...past.current, committed.current].slice(-HISTORY_LIMIT);
    future.current = [];
    committed.current = latest.current;
    sync();
  }, []);

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

    // Mudança estrutural (entrou, saiu ou trocou de posição uma seção) fecha na
    // hora: são gestos discretos, não um arraste contínuo.
    const structural =
      structureOf(doc) !==
      structureOf(JSON.parse(committed.current) as ThemeDoc);

    pararPrazo();
    if (structural) fechar();
    // Digitando: fecha quando o foco sair do campo (o `focusout` abaixo).
    else if (!ehCampoDeTexto(document.activeElement))
      timer.current = setTimeout(fechar, COALESCE_MS);
  }, [serialized, enabled, doc, fechar]);

  useEffect(() => {
    if (!enabled) return;
    const aoSairDoCampo = (event: FocusEvent) => {
      if (ehCampoDeTexto(event.target)) fechar();
    };
    document.addEventListener('focusout', aoSairDoCampo);
    return () => {
      document.removeEventListener('focusout', aoSairDoCampo);
      pararPrazo();
    };
  }, [enabled, fechar]);

  const travel = useCallback(
    (from: React.RefObject<string[]>, to: React.RefObject<string[]>) => {
      // O que ainda está aberto (o prazo não venceu, ou o foco segue no campo)
      // fecha ANTES: desfazer volta exatamente um gesto — sem isto, um Cmd+Z
      // dentro do prazo descartava a mudança em curso E voltava mais uma.
      fechar();
      if (from.current.length === 0) return;

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
    [apply, fechar]
  );

  const undo = useCallback(() => travel(past, future), [travel]);
  const redo = useCallback(() => travel(future, past), [travel]);

  return { undo, redo, canUndo, canRedo };
}
