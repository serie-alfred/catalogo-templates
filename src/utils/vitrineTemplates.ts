import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';
import {
  ENTRADA_PADRAO,
  selecoesDoTemplate,
  temaDoTemplate,
  templatesCompletos,
  type TemplateCompleto,
} from './templatesCompletos';
import { TEMA_INICIAL } from './themeStyle';

/**
 * A vitrine pública dos templates completos: a home lista as famílias e
 * `/templates/<NN>/<página>` mostra a loja montada, só para ver — sem editor,
 * sem login, sem "Editar". Os mesmos templates do "Por template" do editor
 * (`templatesCompletos`), então família nova aparece aqui sozinha.
 *
 * Nada é guardado: a loja é DERIVADA do catálogo a cada build, ao contrário do
 * `/p/{id}`, que lê um snapshot do KV com validade de 3 dias.
 */

/**
 * As famílias completas têm as mesmas peças nas três plataformas (conferido em
 * 27/10/2026: 20 na 01, 24 da 09 à 13, em VTEX, Wake e Tray). A vitrine monta
 * pela plataforma com que o editor abre.
 */
export const PLATAFORMA_DA_VITRINE = ENTRADA_PADRAO.platform;

/** Quantos templates a faixa "Novos" da home mostra: os mais recentes. */
export const NOVIDADES = 5;

/** Do mais novo para o mais antigo, como o "Por template". */
export const templatesDaVitrine = (): TemplateCompleto[] =>
  templatesCompletos(PLATAFORMA_DA_VITRINE);

/** "09": o segmento da URL e o nome do arquivo da thumb. */
export const slugDoTemplate = (t: TemplateCompleto): string =>
  t.template.padStart(2, '0');

export function templateDoSlug(slug: string): TemplateCompleto | null {
  return templatesDaVitrine().find(t => slugDoTemplate(t) === slug) ?? null;
}

/** Foto da home montada, tirada por `yarn thumbs:templates`. */
export const thumbDoTemplate = (slug: string): string =>
  `/images/templates/${slug}.webp`;

/** "Fraunces e Figtree · 24 peças". */
export function resumoDoTemplate(t: TemplateCompleto): string {
  const f = t.tema?.fonts;
  const fontes = f
    ? [...new Set([f.fontPrimary, f.fontSecondary])].join(' e ')
    : null;
  return [fontes, `${t.itens.length} peças`].filter(Boolean).join(' · ');
}

/**
 * A loja inteira com a cara da família, como uma aba nova do editor a mostra
 * depois de aplicar o template: as peças com o Nível 1 do desenho
 * (`selecoesDoTemplate`) e o tema sobre `TEMA_INICIAL`.
 *
 * O uid é estável e não o `randomUUID` do editor: a página é gerada no build e
 * o uid vira atributo no HTML (`data-section-uid`).
 */
export function lojaDoTemplate(t: TemplateCompleto): {
  selections: LayoutSelection[];
  colors: FrameColors;
  fonts: FrameFonts;
} {
  const slug = slugDoTemplate(t);
  return {
    selections: selecoesDoTemplate(t).map((s, i) => ({
      ...s,
      uid: `t${slug}-${i}`,
    })),
    ...temaDoTemplate(t, TEMA_INICIAL),
  };
}
