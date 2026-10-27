import { notFound } from 'next/navigation';
import { PREVIEW_PAGES, slugToPagina } from '@/utils/previewRender';
import {
  lojaDoTemplate,
  slugDoTemplate,
  templateDoSlug,
  templatesDaVitrine,
} from '@/utils/vitrineTemplates';
import FrameClient from './FrameClient';

/** Todo template × página sai pronto do build: a loja é derivada do catálogo. */
export function generateStaticParams() {
  return templatesDaVitrine().flatMap(t =>
    PREVIEW_PAGES.map(p => ({ familia: slugDoTemplate(t), pagina: p.slug }))
  );
}

/**
 * O documento da loja que a barra da vitrine embute. Aberto sozinho é a loja
 * inteira, sem barra — e é o que o `yarn thumbs:templates` fotografa.
 */
export default async function TemplateFramePage({
  params,
}: {
  params: Promise<{ familia: string; pagina: string }>;
}) {
  const { familia, pagina } = await params;
  const t = templateDoSlug(familia);
  const interna = slugToPagina(pagina);
  if (!t || !interna) notFound();

  return <FrameClient {...lojaDoTemplate(t)} pagina={interna} />;
}
