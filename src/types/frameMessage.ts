import type { LayoutSelection } from '@/hooks/useLayoutGenerator';

/**
 * Protocolo entre o editor (/gerador) e o documento do iframe mobile
 * (/gerador/frame-mobile). Módulo client-safe de propósito: não toca o
 * previewStore, que é server-only.
 */

export interface FrameColors {
  colorPrimary: string;
  colorSecondary: string;
  colorTertiary: string;
  colorPrimaryBackground: string;
  colorSecondaryBackground: string;
  colorTertiaryBackground: string;
  colorFooter: string;
  colorFooterText: string;
  colorPrimaryText: string;
  colorSecondaryText: string;
}

export interface FrameFonts {
  fontPrimary: string;
  fontSecondary: string;
  fontTertiary: string;
}

export const FRAME_PARENT = 'gerador' as const;
export const FRAME_CHILD = 'gerador-frame' as const;

/**
 * Editor → iframe.
 *
 * `theme` e `content` são separados de propósito: um keystroke de color picker
 * manda só `theme`, que o filho aplica como custom properties inline num
 * wrapper. Assim re-renderiza um `<div style>` e o ThemeRenderer (memo) faz
 * bail-out da árvore de templates. Se `logo` (um data-URL de centenas de KB)
 * viajasse junto, cada frame de um arraste de cor o clonaria.
 */
export type ToFrame =
  /**
   * Sondagem de presença. O pai a envia assim que instala o próprio listener; o
   * filho responde com `ready`.
   *
   * Existe porque o `ready` do filho, sozinho, tem uma corrida: o <iframe> está
   * no HTML servido, então o browser começa a baixar o documento filho antes de
   * o bundle do editor terminar de hidratar. Em bundles grandes o filho hidrata
   * PRIMEIRO, anuncia `ready` para um pai que ainda não escuta, e a mensagem se
   * perde — o canvas fica em branco até algo remontar o iframe. Com o `hello`,
   * quem chegar por último inicia a troca.
   */
  | { source: typeof FRAME_PARENT; type: 'hello' }
  | { source: typeof FRAME_PARENT; type: 'theme'; colors: FrameColors; fonts: FrameFonts }
  | {
      source: typeof FRAME_PARENT;
      type: 'content';
      selections: LayoutSelection[];
      pagina: string;
      logo: string;
      selectedUid: string | null;
      /** Repassado aos templates. O frame serve as duas visões. */
      isMobile: boolean;
    }
  | { source: typeof FRAME_PARENT; type: 'highlight'; uid: string | null }
  | { source: typeof FRAME_PARENT; type: 'scroll-to'; uid: string };

/** iframe → editor. */
export type FromFrame =
  | { source: typeof FRAME_CHILD; type: 'ready' }
  /**
   * O canvas é outro documento: um Cmd/Ctrl+Z com o foco lá dentro nunca
   * chegaria ao editor. O filho repassa só o gesto, sem saber o que ele faz.
   */
  | { source: typeof FRAME_CHILD; type: 'shortcut'; action: 'undo' | 'redo' }
  /** Badges da seção selecionada no canvas. */
  | {
      source: typeof FRAME_CHILD;
      type: 'section-action';
      action: 'duplicate' | 'remove';
      uid: string;
    }
  | { source: typeof FRAME_CHILD; type: 'select'; uid: string }
  | { source: typeof FRAME_CHILD; type: 'hover'; uid: string | null };
