import { notFound } from 'next/navigation';
import { getPreview } from '@/lib/previewStore';
import { slugToPagina } from '@/utils/previewRender';
import SharedPreview from '@/components/preview/SharedPreview';

interface PageProps {
  params: Promise<{ id: string; page: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { id, page } = await params;

  const snapshot = await getPreview(id);
  if (!snapshot) notFound();

  // A LP do modo LP: as seções dela são de miolo (`home`) e vivem fora das
  // páginas da loja — renderiza só elas, como o canvas do modo LP.
  if (page === 'lp') {
    if (!snapshot.lp?.selections?.length) notFound();
    return (
      <SharedPreview
        snapshot={{ ...snapshot, selections: snapshot.lp.selections }}
        pagina="home"
        id={id}
        activeSlug="lp"
      />
    );
  }

  const pagina = slugToPagina(page);
  if (!pagina) notFound();

  return (
    <SharedPreview
      snapshot={snapshot}
      pagina={pagina}
      id={id}
      activeSlug={page}
    />
  );
}
