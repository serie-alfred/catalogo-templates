import { notFound } from 'next/navigation';
import { getPreview } from '@/lib/previewStore';
import { slugToPagina } from '@/utils/previewRender';
import SharedPreview from '@/components/preview/SharedPreview';

interface PageProps {
  params: Promise<{ id: string; page: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { id, page } = await params;

  const pagina = slugToPagina(page);
  if (!pagina) notFound();

  const snapshot = await getPreview(id);
  if (!snapshot) notFound();

  return (
    <SharedPreview
      snapshot={snapshot}
      pagina={pagina}
      id={id}
      activeSlug={page}
    />
  );
}
