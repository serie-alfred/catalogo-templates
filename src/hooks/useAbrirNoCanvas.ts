'use client';

import { createContext, useContext, useEffect, useRef } from 'react';

/**
 * Abrir no canvas o estado que um campo do painel pinta (D3-06, decisão de
 * 18/11/2026).
 *
 * Mini-carrinho, painel de ajuda, painel de filtros e menu mobile nascem
 * FECHADOS no preview, e os campos deles (`previewNote` "Aparece com…") pintam
 * nós que estão ocultos: o lojista mudava a cor e não via nada. Agora, com o
 * campo focado no painel da direita, o canvas abre esse estado NA SEÇÃO
 * selecionada, e fecha quando o foco sai do campo.
 *
 * O caminho:
 *   painel (`ComponentVariablesPanel`) → `estadoNoCanvasRef` do hook →
 *   `PreviewFrame` → postMessage `estado-no-canvas` → `FrameClient` guarda o
 *   alvo em `EstadoNoCanvasContext` → cada `Secao` do ThemeRenderer diz o
 *   próprio uid em `SecaoUidContext` → o componente que sabe abrir chama
 *   `useAbrirNoCanvas(estado, setAberto)` com o MESMO setter do gatilho dele.
 *
 * Contexto e não clique simulado no gatilho: os gatilhos variam por família
 * (botão do desktop, do mobile, ícone sem `data-role`) e fechar exigiria achar
 * o "x" de cada gaveta. O setter é o que o próprio componente já usa, e a
 * linha é uma só por componente. Fora do editor (/p, export, vitrine) não há
 * provider: o alvo é sempre vazio e o hook não faz nada.
 */
export type EstadoNoCanvas = 'carrinho' | 'ajuda' | 'filtros' | 'menu';

export interface AlvoNoCanvas {
  uid: string | null;
  estado: EstadoNoCanvas | null;
}

export const ALVO_VAZIO: AlvoNoCanvas = { uid: null, estado: null };

/** O que o editor pediu para abrir. Só o frame do canvas fornece. */
export const EstadoNoCanvasContext = createContext<AlvoNoCanvas>(ALVO_VAZIO);

/** O uid da seção em volta do componente (fornecido pela `Secao`). */
export const SecaoUidContext = createContext<string | null>(null);

/**
 * Qual estado um campo pede, pela `previewNote` dele. `null` = nenhum que o
 * canvas saiba abrir (hover, submenu por CSS, modal que o preview não tem…).
 */
export function estadoDaNota(nota: string | undefined): EstadoNoCanvas | null {
  if (!nota) return null;
  if (/mini-carrinho/i.test(nota)) return 'carrinho';
  if (/painel de ajuda|com o painel aberto/i.test(nota)) return 'ajuda';
  if (/filtro/i.test(nota)) return 'filtros';
  if (/menu mobile/i.test(nota)) return 'menu';
  return null;
}

/**
 * Abre o estado `estado` desta seção quando o editor pedir, e fecha quando ele
 * deixar de pedir. Só fecha o que ele mesmo abriu: um carrinho que o usuário
 * abriu clicando no canvas continua como estava.
 */
export function useAbrirNoCanvas(
  estado: EstadoNoCanvas,
  setAberto: (aberto: boolean) => void
) {
  const uid = useContext(SecaoUidContext);
  const alvo = useContext(EstadoNoCanvasContext);
  const ativo = uid !== null && alvo.uid === uid && alvo.estado === estado;
  const abriuRef = useRef(false);

  useEffect(() => {
    if (ativo) {
      setAberto(true);
      abriuRef.current = true;
    } else if (abriuRef.current) {
      setAberto(false);
      abriuRef.current = false;
    }
  }, [ativo, setAberto]);
}
