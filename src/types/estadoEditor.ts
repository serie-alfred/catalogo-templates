import type { PreviewSnapshot } from '@/lib/previewStore';
import type { EditorMode, LayoutSelection } from '@/hooks/useLayoutGenerator';

/**
 * O tema inteiro de uma aba do editor, como ele é salvo no histórico e
 * reaberto. É o snapshot do preview (`PreviewSnapshot`) mais o que o preview
 * não precisa: a LP sempre (o preview só a leva no modo LP), o modo em que o
 * editor estava e o token da Wake.
 *
 * O mesmo `carregarEstado` do hook lê os dois formatos — um snapshot de
 * preview (botão "Editar" do /p) e um tema salvo —, e passa tudo pelos mesmos
 * filtros da hidratação: o catálogo pode ter mudado desde que foi gravado.
 */
export interface EstadoDoEditor extends Omit<PreviewSnapshot, 'lp' | 'rev'> {
  lp?: { nome: string; selections: LayoutSelection[] };
  editorMode?: EditorMode;
  wakeToken?: string;
}
