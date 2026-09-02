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
  | { source: typeof FRAME_PARENT; type: 'theme'; colors: FrameColors; fonts: FrameFonts }
  | {
      source: typeof FRAME_PARENT;
      type: 'content';
      selections: LayoutSelection[];
      pagina: string;
      logo: string;
      selectedUid: string | null;
    }
  | { source: typeof FRAME_PARENT; type: 'highlight'; uid: string | null }
  | { source: typeof FRAME_PARENT; type: 'scroll-to'; uid: string };

/** iframe → editor. */
export type FromFrame =
  | { source: typeof FRAME_CHILD; type: 'ready' }
  | { source: typeof FRAME_CHILD; type: 'select'; uid: string }
  | { source: typeof FRAME_CHILD; type: 'hover'; uid: string | null };
