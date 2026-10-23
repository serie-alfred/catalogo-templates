import { redirect } from 'next/navigation';

/** `/p/{id}` sozinho abre a home do preview, como o link que o editor entrega. */
export default async function PreviewRaiz({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/p/${id}/home`);
}
