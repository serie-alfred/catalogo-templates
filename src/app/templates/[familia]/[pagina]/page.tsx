import { notFound } from 'next/navigation';
import TemplateViewer from '@/components/preview/TemplateViewer';
import { slugToPagina } from '@/utils/previewRender';
import { templateDoSlug } from '@/utils/vitrineTemplates';

interface PageProps {
  params: Promise<{ familia: string; pagina: string }>;
  searchParams: Promise<{ vista?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { familia } = await params;
  const t = templateDoSlug(familia);
  return t ? { title: `${t.nome} · E-temas` } : {};
}

/**
 * A visualização de um template completo: a barra (página e Desktop/Mobile) e
 * a loja num <iframe>, como o canvas do editor — os drawers dos Headers são
 * `position: fixed` com `100vh`, e só dentro do iframe o viewport é a loja.
 *
 * Lê `?vista=mobile` no servidor para a moldura já nascer certa; a loja em si
 * (o `…/frame`) é estática.
 */
export default async function TemplatePage({
  params,
  searchParams,
}: PageProps) {
  const { familia, pagina } = await params;
  const { vista } = await searchParams;

  const t = templateDoSlug(familia);
  if (!t || !slugToPagina(pagina)) notFound();

  const c = t.tema?.colors;
  return (
    <TemplateViewer
      slug={familia}
      nome={t.nome}
      // Sem repetidas: na 09 três tokens têm a mesma cor, e três bolinhas
      // iguais na barra parecem um menu "•••".
      paleta={[
        ...new Set(
          [
            c?.colorPrimaryBackground,
            c?.colorSecondaryBackground,
            c?.colorTertiaryBackground,
            c?.colorPrimary,
          ].filter((x): x is string => !!x)
        ),
      ]}
      pagina={pagina}
      mobileInicial={vista === 'mobile'}
    />
  );
}
